export const chatbotAPI = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  
  endpoints: {
    startSession: '/chatbot/start-session',
    sendMessage: '/chatbot/send-message',
    getHistory: '/chatbot/session/{sessionId}/history',
    getSuggestions: '/chatbot/suggestions',
    createTicket: '/chatbot/create-ticket',
    rateResponse: '/chatbot/rate-response',
    endSession: '/chatbot/end-session',
    transferToAgent: '/chatbot/transfer-to-agent'
  },

  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  })
};