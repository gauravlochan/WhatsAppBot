/**
 * Session management utility
 */
const sessions = new Map();

/**
 * Get a user session or create a new one
 * @param {string} userId - The user's ID
 * @returns {Object} The user session
 */
function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      userId,
      createdAt: new Date(),
      lastActivity: new Date(),
      context: {},
      history: []
    });
  }
  
  const session = sessions.get(userId);
  session.lastActivity = new Date();
  return session;
}

/**
 * Update a user's session context
 * @param {string} userId - The user's ID
 * @param {Object} contextUpdate - The context updates
 */
function updateSessionContext(userId, contextUpdate) {
  const session = getSession(userId);
  session.context = {
    ...session.context,
    ...contextUpdate
  };
  return session.context;
}

/**
 * Add a message to the user's history
 * @param {string} userId - The user's ID
 * @param {Object} message - The message object
 */
function addToHistory(userId, message) {
  const session = getSession(userId);
  session.history.push({
    timestamp: new Date(),
    ...message
  });
  
  // Limit history size
  if (session.history.length > 50) {
    session.history.shift();
  }
}

/**
 * Clear a user's session
 * @param {string} userId - The user's ID
 */
function clearSession(userId) {
  sessions.delete(userId);
}

/**
 * Clean up old sessions
 * @param {number} maxAgeMs - Maximum session age in milliseconds
 */
function cleanupSessions(maxAgeMs = 24 * 60 * 60 * 1000) {
  const now = new Date();
  
  for (const [userId, session] of sessions.entries()) {
    const age = now - session.lastActivity;
    if (age > maxAgeMs) {
      sessions.delete(userId);
    }
  }
}

// Run cleanup every hour
setInterval(() => cleanupSessions(), 60 * 60 * 1000);

module.exports = {
  getSession,
  updateSessionContext,
  addToHistory,
  clearSession
};