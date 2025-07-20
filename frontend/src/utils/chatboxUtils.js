// utils/chatbotUtils.js - Fonctionnalités avancées

// Base de données des réponses automatiques
const autoResponses = {
  // Problèmes courants et solutions
  troubleshooting: {
    'ordinateur lent': {
      solution: `Voici quelques étapes pour résoudre un ordinateur lent :
1. Redémarrez votre ordinateur
2. Vérifiez l'espace disque disponible
3. Fermez les programmes inutiles
4. Vérifiez les mises à jour Windows
5. Lancez un scan antivirus

Si le problème persiste, je peux créer un ticket pour une intervention technique.`,
      priority: 'medium'
    },
    'wifi ne fonctionne pas': {
      solution: `Pour résoudre les problèmes WiFi :
1. Vérifiez que le WiFi est activé
2. Redémarrez votre routeur (débranchez 30 secondes)
3. Oubliez et reconnectez-vous au réseau
4. Vérifiez les paramètres proxy
5. Contactez l'administrateur réseau si nécessaire

Voulez-vous que je crée un ticket pour l'équipe réseau ?`,
      priority: 'high'
    },
    'mot de passe oublié': {
      solution: `Pour réinitialiser votre mot de passe :
1. Utilisez le lien "Mot de passe oublié" sur la page de connexion
2. Vérifiez votre email (y compris les spams)
3. Suivez les instructions dans l'email
4. Créez un nouveau mot de passe sécurisé

Si vous n'avez pas accès à votre email, je peux créer un ticket urgent.`,
      priority: 'urgent'
    },
    'imprimante ne marche pas': {
      solution: `Vérifications pour l'imprimante :
1. Vérifiez l'alimentation et les connexions
2. Contrôlez les niveaux d'encre/toner
3. Vérifiez qu'il n'y a pas de bourrage papier
4. Redémarrez l'imprimante
5. Vérifiez les pilotes sur votre ordinateur

Besoin d'aide supplémentaire ?`,
      priority: 'medium'
    }
  },

  // Réponses pour les demandes de matériel
  equipment: {
    'nouvel ordinateur': {
      response: 'Pour une demande de nouvel ordinateur, je vais créer un ticket avec les informations nécessaires. Quel est le motif de cette demande ?',
      followUp: ['Remplacement défaillant', 'Nouvel employé', 'Mise à niveau performance']
    },
    'écran supplémentaire': {
      response: 'Je peux vous aider pour une demande d\'écran supplémentaire. Cela améliore vraiment la productivité !',
      followUp: ['Créer la demande', 'Voir les modèles disponibles']
    },
    'téléphone': {
      response: 'Pour les demandes de téléphone ou problèmes téléphoniques, notre équipe télécom peut vous aider.',
      followUp: ['Nouveau téléphone', 'Problème technique', 'Changement de numéro']
    }
  }
};

// Fonction pour détecter les mots-clés et fournir des solutions automatiques
function getAutoResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Vérifier les problèmes techniques
  for (const [key, solution] of Object.entries(autoResponses.troubleshooting)) {
    if (lowerMessage.includes(key) || 
        key.split(' ').every(word => lowerMessage.includes(word))) {
      return {
        type: 'troubleshooting',
        solution: solution.solution,
        priority: solution.priority,
        suggestions: ['Créer un ticket', 'Parler à un technicien', 'Autre problème']
      };
    }
  }
  
  // Vérifier les demandes de matériel
  for (const [key, response] of Object.entries(autoResponses.equipment)) {
    if (lowerMessage.includes(key)) {
      return {
        type: 'equipment',
        response: response.response,
        followUp: response.followUp,
        suggestions: response.followUp
      };
    }
  }
  
  return null;
}

// Fonction pour générer des statistiques sur l'utilisation du chatbot
function getChatbotStats() {
  return {
    totalConversations: 0, // À implémenter avec une base de données
    resolvedIssues: 0,
    ticketsCreated: 0,
    averageResponseTime: '2s',
    topIssues: [
      { issue: 'Mot de passe oublié', count: 45 },
      { issue: 'Ordinateur lent', count: 32 },
      { issue: 'Problème WiFi', count: 28 }
    ]
  };
}

// Fonction pour sauvegarder les conversations (optionnel)
async function saveConversation(userId, conversation) {
  try {
    // Implémentez selon votre base de données
    const ChatHistory = require('../models/ChatHistory');
    
    const chatHistory = new ChatHistory({
      userId,
      messages: conversation,
      timestamp: new Date()
    });
    
    await chatHistory.save();
  } catch (error) {
    console.error('Erreur sauvegarde conversation:', error);
  }
}

// Fonction pour l'apprentissage automatique simple (feedback)
function processFeedback(messageId, feedback, userId) {
  // Implémentez un système de feedback pour améliorer les réponses
  console.log(`Feedback reçu pour message ${messageId}: ${feedback}`);
  
  // Vous pouvez stocker ces données pour analyser et améliorer le chatbot
  return {
    acknowledged: true,
    message: 'Merci pour votre feedback !'
  };
}

// Fonction pour détecter l'urgence d'un message
function detectUrgency(message) {
  const urgentKeywords = [
    'urgent', 'critique', 'bloqué', 'production', 'serveur down',
    'ne fonctionne plus', 'panne', 'catastrophe', 'aide vite'
  ];
  
  const lowerMessage = message.toLowerCase();
  const hasUrgentKeyword = urgentKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  if (hasUrgentKeyword) {
    return {
      isUrgent: true,
      priority: 'urgent',
      escalationMessage: 'Ce problème semble urgent. Je vais créer un ticket haute priorité et notifier l\'équipe technique immédiatement.'
    };
  }
  
  return { isUrgent: false, priority: 'medium' };
}

// Export des fonctions utilitaires
module.exports = {
  getAutoResponse,
  getChatbotStats,
  saveConversation,
  processFeedback,
  detectUrgency,
  autoResponses
};

// Modèle pour sauvegarder l'historique des conversations (optionnel)
// models/ChatHistory.js
const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    text: String,
    sender: { type: String, enum: ['user', 'bot'] },
    timestamp: { type: Date, default: Date.now },
    intent: String,
    resolved: { type: Boolean, default: false }
  }],
  sessionStart: { type: Date, default: Date.now },
  sessionEnd: Date,
  satisfaction: { type: Number, min: 1, max: 5 },
  ticketsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }]
});

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);