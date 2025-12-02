/**
 * WebAppEndpoints.js - Add these functions to your LiveChatV004r004.js
 *
 * These endpoints enable the b4bAbL React app to:
 * - Create sessions via API
 * - Send messages via API
 * - Get messages via API (polling)
 *
 * INSTRUCTIONS:
 * 1. Copy the functions below into your LiveChatV004r004.js
 * 2. Redeploy your Web App
 */

// ===== NEW ENDPOINTS FOR REACT APP =====

/**
 * Handle POST requests for creating sessions and sending messages
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const mode = e.parameter.mode || data.mode;

    switch(mode) {
      case 'createSession':
        return handleCreateSession(data);

      case 'joinSession':
        return handleJoinSession(e.parameter.session, data);

      case 'sendMessage':
        return handleSendMessage(e.parameter.session, data);

      case 'babelResponse':
        return handleBabelResponse(data);

      default:
        return jsonResponse({ error: 'Unknown mode: ' + mode });
    }
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

/**
 * Extended doGet to handle message polling
 */
function doGetExtended(e) {
  const mode = e && e.parameter && e.parameter.mode;

  // Get messages for a session
  if (mode === 'messages') {
    const sessionId = e.parameter.session;
    const lastRow = Number(e.parameter.lastRow || 1);
    const userName = e.parameter.user || '';

    return jsonResponse(getSessionMessages(sessionId, lastRow, userName));
  }

  // Get Babel responses
  if (mode === 'babelResponses') {
    const limit = Number(e.parameter.limit || 20);
    return jsonResponse(getBabelResponses(limit));
  }

  // Get session info
  if (mode === 'sessionInfo') {
    const sessionId = e.parameter.session;
    return jsonResponse(getSessionInfo(sessionId));
  }

  // Fall through to existing doGet logic...
  // (Keep your existing doGet code)
}

// ===== HELPER FUNCTIONS =====

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Create a new session via API
 */
function handleCreateSession(data) {
  const sessionCode = data.sessionCode || generateSessionCode();
  const sessionName = SESSION_PREFIX + sessionCode;

  const ss = SpreadsheetApp.getActive();

  // Check if session already exists
  if (ss.getSheetByName(sessionName)) {
    return jsonResponse({ error: 'Session already exists', sessionCode: sessionCode });
  }

  // Create the session
  const result = createSession(
    sessionCode,
    data.userA || data.name || 'User A',
    data.userB || 'User B',
    data.langA || data.language || 'English',
    data.langB || 'Spanish',
    {
      audiate: data.audiate || false,
      voiceA: data.voiceA || '',
      voiceB: data.voiceB || ''
    }
  );

  return jsonResponse({
    success: true,
    sessionCode: sessionCode,
    sessionName: sessionName,
    sheetId: result.sheetId
  });
}

/**
 * Generate a 6-character session code
 */
function generateSessionCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Join an existing session
 */
function handleJoinSession(sessionCode, data) {
  const sessionName = SESSION_PREFIX + sessionCode;
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(sessionName);

  if (!sh) {
    return jsonResponse({ error: 'Session not found: ' + sessionCode });
  }

  // Get session config
  let cfg = {};
  try {
    cfg = JSON.parse(sh.getRange('A1').getNote() || '{}');
  } catch (e) {}

  // Update User B info if joining as second user
  if (data.name && !cfg.userBJoined) {
    cfg.userB = data.name;
    cfg.langB = data.language || cfg.langB;
    cfg.userBJoined = true;
    sh.getRange('A1').setNote(JSON.stringify(cfg));
  }

  return jsonResponse({
    success: true,
    sessionCode: sessionCode,
    config: cfg
  });
}

/**
 * Send a message to a session
 */
function handleSendMessage(sessionCode, data) {
  const sessionName = SESSION_PREFIX + sessionCode;
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(sessionName);

  if (!sh) {
    return jsonResponse({ error: 'Session not found' });
  }

  // Get session config
  let cfg = {};
  try {
    cfg = JSON.parse(sh.getRange('A1').getNote() || '{}');
  } catch (e) {}

  // Determine which column to write to based on user
  const isUserA = (data.from === cfg.userA) || (data.role === 'A');
  const msgCol = isUserA ? COL.A_MSG : COL.B_MSG;
  const timeCol = isUserA ? COL.A_TIME : COL.B_TIME;

  // Find the next empty row
  const lastRow = sh.getLastRow();
  let targetRow = 2; // Start after header

  for (let r = 2; r <= lastRow + 1; r++) {
    const cellA = sh.getRange(r, COL.A_MSG).getValue();
    const cellB = sh.getRange(r, COL.B_MSG).getValue();

    // Find first row where the user's column is empty
    if (isUserA && !cellA) {
      targetRow = r;
      break;
    } else if (!isUserA && !cellB) {
      targetRow = r;
      break;
    }
    targetRow = r + 1;
  }

  // Write the message
  sh.getRange(targetRow, msgCol).setValue(data.text);
  sh.getRange(targetRow, timeCol).setValue(new Date());

  // The onEdit trigger will handle translation automatically
  // But we need to trigger it manually since we're using API
  SpreadsheetApp.flush();

  // Manually trigger translation
  const sourceLang = isUserA ? cfg.langA : cfg.langB;
  const targetLang = isUserA ? cfg.langB : cfg.langA;
  const transCol = isUserA ? COL.AtoB : COL.BtoA;

  const translation = translateText(data.text, targetLang, sourceLang);
  if (translation && translation.text) {
    sh.getRange(targetRow, transCol).setValue(translation.text);
  }

  return jsonResponse({
    success: true,
    row: targetRow,
    translation: translation ? translation.text : null
  });
}

/**
 * Get messages from a session
 */
function getSessionMessages(sessionCode, lastRow, userName) {
  const sessionName = SESSION_PREFIX + sessionCode;
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(sessionName);

  if (!sh) {
    return { error: 'Session not found', messages: [] };
  }

  // Get session config
  let cfg = {};
  try {
    cfg = JSON.parse(sh.getRange('A1').getNote() || '{}');
  } catch (e) {}

  const dataRange = sh.getDataRange();
  const values = dataRange.getValues();
  const messages = [];

  // Start from lastRow + 1 to get only new messages
  const startRow = Math.max(1, lastRow);

  for (let r = startRow; r < values.length; r++) {
    const row = values[r];
    const rowNum = r + 1;

    // User A message
    if (row[COL.A_MSG - 1]) {
      messages.push({
        id: `${sessionCode}_${rowNum}_A`,
        row: rowNum,
        from: cfg.userA || 'User A',
        originalText: row[COL.A_MSG - 1],
        translatedText: row[COL.AtoB - 1] || '',
        fromLanguage: cfg.langCodeA || 'en',
        toLanguage: cfg.langCodeB || 'es',
        timestamp: row[COL.A_TIME - 1] ? new Date(row[COL.A_TIME - 1]).toISOString() : new Date().toISOString(),
        side: 'A'
      });
    }

    // User B message
    if (row[COL.B_MSG - 1]) {
      messages.push({
        id: `${sessionCode}_${rowNum}_B`,
        row: rowNum,
        from: cfg.userB || 'User B',
        originalText: row[COL.B_MSG - 1],
        translatedText: row[COL.BtoA - 1] || '',
        fromLanguage: cfg.langCodeB || 'es',
        toLanguage: cfg.langCodeA || 'en',
        timestamp: row[COL.B_TIME - 1] ? new Date(row[COL.B_TIME - 1]).toISOString() : new Date().toISOString(),
        side: 'B'
      });
    }
  }

  // Sort by timestamp
  messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return {
    messages: messages,
    lastRow: values.length,
    config: cfg
  };
}

/**
 * Get session info
 */
function getSessionInfo(sessionCode) {
  const sessionName = SESSION_PREFIX + sessionCode;
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(sessionName);

  if (!sh) {
    return { error: 'Session not found' };
  }

  let cfg = {};
  try {
    cfg = JSON.parse(sh.getRange('A1').getNote() || '{}');
  } catch (e) {}

  return {
    sessionCode: sessionCode,
    config: cfg,
    exists: true
  };
}

/**
 * Handle Babel story submissions
 */
function handleBabelResponse(data) {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName('BabelResponses');

  if (!sheet) {
    sheet = ss.insertSheet('BabelResponses');
    sheet.getRange(1, 1, 1, 4)
      .setValues([['Timestamp', 'Name', 'Language', 'Response']])
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date().toISOString(),
    data.name || 'Anonymous',
    data.language || 'en',
    data.response || ''
  ]);

  return jsonResponse({ success: true });
}

/**
 * Get Babel responses
 */
function getBabelResponses(limit) {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName('BabelResponses');

  if (!sheet) {
    return { responses: [] };
  }

  const data = sheet.getDataRange().getValues();
  const responses = data.slice(1).slice(-limit).map((row, index) => ({
    id: index + 1,
    timestamp: row[0],
    name: row[1],
    language: row[2],
    response: row[3]
  }));

  return { responses: responses.reverse() };
}

// ===== UPDATED doGet FUNCTION =====
// Replace your existing doGet with this merged version:

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const mode = params.mode || params.action || '';

  // ----- MESSAGE POLLING -----
  if (mode === 'messages') {
    const sessionCode = params.session;
    const lastRow = Number(params.lastRow || 1);
    const userName = params.user || '';
    return jsonResponse(getSessionMessages(sessionCode, lastRow, userName));
  }

  // ----- BABEL RESPONSES -----
  if (mode === 'babelResponses') {
    const limit = Number(params.limit || 20);
    return jsonResponse(getBabelResponses(limit));
  }

  // ----- SESSION INFO -----
  if (mode === 'sessionInfo') {
    const sessionCode = params.session;
    return jsonResponse(getSessionInfo(sessionCode));
  }

  // ----- AUDIO QUEUE (existing) -----
  if (mode === 'queue') {
    const lastId = Number(params.lastId || params.lastid || 0) || 0;
    const session = params.session || params.sid || '';
    const toUser = params.to || params.listener || '';
    const result = getAudioQueue(lastId, session, toUser);
    return jsonResponse(result);
  }

  // ----- AUDIO PLAYER (existing) -----
  if (mode === 'audioplayer' || mode === 'audio') {
    return HtmlService.createHtmlOutputFromFile('AudioPlayer')
      .setTitle('🔊 Audiate Player')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
  }

  // ----- UPLOAD (existing) -----
  if (mode === 'upload') {
    const template = HtmlService.createTemplateFromFile('UploadWebV004r000');
    template.sheetId = Number(params.s || 0);
    template.row = Number(params.r || 0);
    template.col = Number(params.c || 0);
    template.lang = params.lang || 'en';
    template.userLang = params.userLang || 'English';
    return template.evaluate()
      .setTitle('Upload / Attach')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }

  // ----- HELP (existing) -----
  if (mode === 'help') {
    const template = HtmlService.createTemplateFromFile('HelpGuideV004r000');
    template.lang = params.lang || 'en';
    return template.evaluate()
      .setTitle('Help & Guide')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }

  // ----- DEFAULT: Landing page -----
  return HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>b4bAbL - Live Translator</title>
      <style>
        body { font-family: -apple-system, sans-serif; background: linear-gradient(135deg, #d4a574, #8b6b4a); min-height: 100vh; margin: 0; padding: 20px; color: white; }
        .container { max-width: 400px; margin: 0 auto; text-align: center; }
        h1 { font-size: 2.5rem; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        p { opacity: 0.9; margin-bottom: 30px; font-style: italic; }
        .btn { display: block; padding: 16px; margin: 12px 0; background: rgba(255,255,255,0.95); color: #6b5344; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 1.1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>b4bAbL</h1>
        <p>"To unite the tongues of Humanity"</p>
        <a class="btn" href="?mode=audioplayer">🔊 Audio Player</a>
      </div>
    </body>
    </html>
  `)
    .setTitle('b4bAbL')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}
