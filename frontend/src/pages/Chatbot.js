import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, FileText, Wifi, Printer, Lock, Monitor, Mail, AlertTriangle} from 'lucide-react';
import './Chatbot.css'; // Import your CSS styles

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [userContext, setUserContext] = useState({
    previousIssues: [],
    preferredLanguage: 'fr',
    expertiseLevel: 'beginner'
  });
  const messagesEndRef = useRef(null);

  // Base de connaissances étendue et plus intelligente
  const knowledgeBase = {
    // Problèmes de mot de passe
    'authentication': {
      keywords: ['mot de passe', 'password', 'connexion', 'login', 'oublié', 'reset', 'authentification', 'compte', 'accès', 'verrouillé', 'locked'],
      responses: {
        beginner: "🔐 **Problème de connexion :**\n\n**Solutions simples :**\n1. Vérifiez que Caps Lock n'est pas activé\n2. Essayez de taper votre mot de passe dans un bloc-notes d'abord\n3. Utilisez 'Mot de passe oublié' sur la page de connexion\n4. Attendez 15 minutes si le compte est verrouillé\n\n**Besoin d'aide immédiate ?** Je peux créer un ticket prioritaire pour vous.",
        intermediate: "🔐 **Diagnostic de connexion :**\n\n**Vérifications :**\n• Caps Lock, Num Lock, langue du clavier\n• Cache et cookies du navigateur\n• Synchronisation de l'heure système\n• VPN ou proxy actif\n\n**Actions :**\n1. Reset via self-service portal\n2. Vérification des politiques de sécurité\n3. Test depuis un autre appareil\n\n*Quel message d'erreur voyez-vous exactement ?*",
        expert: "🔐 **Analyse d'authentification :**\n\n**Diagnostic avancé :**\n• Vérifiez les logs d'authentification\n• Status du domaine et contrôleurs\n• Politiques GPO applicables\n• Certificats et Kerberos tickets\n\n**Commandes utiles :**\n```cmd\nklist purge\ngpupdate /force\nnslookup _kerberos._tcp.domain.com\n```\n\n*Avez-vous accès aux logs événements ?*"
      },
      followUp: ["Avez-vous essayé depuis un autre appareil ?", "Quel navigateur utilisez-vous ?", "Le problème est-il récent ?"]
    },

    // Problèmes réseau
    'network': {
      keywords: ['internet', 'connexion', 'réseau', 'wifi', 'lent', 'déconnecté', 'latence', 'ping', 'dns', 'ip', 'ethernet'],
      responses: {
        beginner: "🌐 **Problème de réseau :**\n\n**Étapes simples :**\n1. Vérifiez l'icône WiFi/réseau en bas à droite\n2. Redémarrez votre box internet (débranchez 30 secondes)\n3. Redémarrez votre ordinateur\n4. Rapprochez-vous de la box WiFi\n\n**Test rapide :** Essayez d'aller sur google.com\n\n*La connexion fonctionne-t-elle sur votre téléphone ?*",
        intermediate: "🌐 **Diagnostic réseau :**\n\n**Tests à effectuer :**\n1. `ping 8.8.8.8` (test internet)\n2. `ping votre-serveur.com` (test interne)\n3. `ipconfig /all` (configuration IP)\n4. `nslookup google.com` (test DNS)\n\n**Vérifications :**\n• Câbles réseau bien connectés\n• LED sur équipements réseau\n• Configuration proxy\n• Pare-feu Windows\n\n*Obtenez-vous une adresse IP automatiquement ?*",
        expert: "🌐 **Analyse réseau avancée :**\n\n**Diagnostic complet :**\n```cmd\nnetsh winsock reset\nnetsh int ip reset\nipconfig /flushdns\nnetsh interface show interface\ntracert 8.8.8.8\n```\n\n**Vérifications :**\n• Table de routage\n• Configuration VLAN\n• QoS et bande passante\n• Logs switch/routeur\n\n*Avez-vous accès aux équipements réseau ?*"
      },
      followUp: ["Le problème affecte-t-il tous les appareils ?", "Avez-vous des messages d'erreur spécifiques ?", "Depuis quand le problème existe-t-il ?"]
    },

    // Problèmes d'impression
    'printing': {
      keywords: ['imprimante', 'imprimer', 'impression', 'bourrage', 'toner', 'encre', 'spooler', 'pilote', 'driver'],
      responses: {
        beginner: "🖨️ **Problème d'impression :**\n\n**Vérifications de base :**\n1. L'imprimante est-elle allumée ? (voyant vert)\n2. Y a-t-il du papier dans le bac ?\n3. Y a-t-il des voyants rouges clignotants ?\n4. Les câbles sont-ils bien branchés ?\n\n**Solution rapide :** Éteignez/rallumez l'imprimante\n\n*Voyez-vous votre document dans la file d'attente ?*",
        intermediate: "🖨️ **Diagnostic d'impression :**\n\n**Actions techniques :**\n1. Panneau de configuration → Imprimantes\n2. Clic droit sur l'imprimante → 'Voir la file d'attente'\n3. Supprimer tous les documents bloqués\n4. Services → 'Spouleur d'impression' → Redémarrer\n\n**Tests :**\n• Page de test depuis les propriétés\n• Impression depuis un autre logiciel\n• Vérification des pilotes\n\n*L'imprimante apparaît-elle comme 'Prête' ?*",
        expert: "🖨️ **Résolution avancée impression :**\n\n**Diagnostic système :**\n```cmd\nnet stop spooler\ndel %systemroot%\\system32\\spool\\printers\\*.*\nnet start spooler\n```\n\n**Vérifications :**\n• Registre imprimante\n• Logs événements\n• Conflits de pilotes\n• Configuration réseau (IP fixe)\n• Permissions de partage\n\n*Gestion centralisée via serveur d'impression ?*"
      },
      followUp: ["Quel type d'imprimante utilisez-vous ?", "Le problème concerne-t-il tous les utilisateurs ?", "Avez-vous récemment installé de nouveaux logiciels ?"]
    },

    // Performance système
    'performance': {
      keywords: ['lent', 'freeze', 'plantage', 'redémarrage', 'performance', 'ram', 'disque', 'cpu', 'ralenti', 'bug'],
      responses: {
        beginner: "💻 **Problème de performance :**\n\n**Solutions rapides :**\n1. Redémarrez votre PC\n2. Fermez les programmes inutiles (Ctrl+Shift+Echap)\n3. Vérifiez l'espace disque (min. 15% libre)\n4. Lancez Windows Update\n\n**Nettoyage simple :**\n• Corbeille\n• Fichiers temporaires\n• Téléchargements anciens\n\n*Depuis quand le problème existe-t-il ?*",
        intermediate: "💻 **Optimisation système :**\n\n**Diagnostic :**\n1. Gestionnaire des tâches → Onglets Processus/Performance\n2. Vérifiez utilisation CPU, RAM, Disque\n3. Msconfig → Démarrage (désactiver programmes inutiles)\n4. Défragmentation disque dur\n\n**Outils utiles :**\n• Nettoyage de disque\n• Vérificateur de fichiers système (sfc /scannow)\n• Moniteur de ressources\n\n*Quels programmes consomment le plus ?*",
        expert: "💻 **Analyse performance avancée :**\n\n**Diagnostic professionnel :**\n```cmd\nperfmon /res\nwmic logicaldisk get size,freespace,caption\nsfc /scannow\nDISM /Online /Cleanup-Image /RestoreHealth\n```\n\n**Analyses :**\n• Logs d'événements système\n• Profils utilisateur corrompus\n• Services Windows non essentiels\n• Métriques WMI\n• Test mémoire RAM\n\n*Avez-vous un monitoring système en place ?*"
      },
      followUp: ["Le problème survient-il au démarrage ?", "Avez-vous installé récemment de nouveaux logiciels ?", "L'ordinateur fait-il du bruit inhabituel ?"]
    },

    // Problèmes logiciels
    'software': {
      keywords: ['logiciel', 'application', 'programme', 'erreur', 'crash', 'installation', 'mise à jour', 'licence'],
      responses: {
        beginner: "🔧 **Problème de logiciel :**\n\n**Solutions de base :**\n1. Fermez complètement le programme\n2. Relancez-le en tant qu'administrateur\n3. Redémarrez votre ordinateur\n4. Vérifiez les mises à jour disponibles\n\n**Si le problème persiste :**\n• Désinstaller et réinstaller\n• Vérifier la compatibilité Windows\n\n*Quel logiciel pose problème exactement ?*",
        intermediate: "🔧 **Résolution logicielle :**\n\n**Diagnostic :**\n1. Observateur d'événements → Journaux Windows\n2. Mode de compatibilité (clic droit → Propriétés)\n3. Réparation/Modification via Programmes et fonctionnalités\n4. Vérification intégrité fichiers programme\n\n**Tests :**\n• Nouveau profil utilisateur\n• Mode sans échec\n• Installation sur autre poste\n\n*Avez-vous un message d'erreur spécifique ?*",
        expert: "🔧 **Analyse logicielle avancée :**\n\n**Investigation :**\n```cmd\neventcreate /T ERROR /ID 100 /L APPLICATION /SO MyApp /D \"Test event\"\nget-eventlog -LogName Application -EntryType Error -Newest 50\nreg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\n```\n\n**Vérifications :**\n• Dépendances .NET/Visual C++\n• Registre Windows\n• Permissions NTFS\n• Politiques de sécurité\n• Conflit DLL\n\n*Déploiement via MSI ou installation manuelle ?*"
      },
      followUp: ["Le logiciel fonctionnait-il avant ?", "Avez-vous les droits administrateur ?", "D'autres utilisateurs ont-ils le même problème ?"]
    },

    // Sécurité
    'security': {
      keywords: ['virus', 'malware', 'sécurité', 'antivirus', 'suspect', 'piratage', 'phishing', 'spam', 'menace'],
      responses: {
        beginner: "🛡️ **Problème de sécurité :**\n\n**⚠️ Actions immédiates :**\n1. Ne cliquez sur rien de suspect\n2. Déconnectez-vous d'internet si nécessaire\n3. Lancez votre antivirus (analyse complète)\n4. Changez vos mots de passe importants\n\n**Signes d'infection :**\n• PC très lent\n• Pop-ups inattendues\n• Page d'accueil modifiée\n\n*Décrivez exactement ce qui vous inquiète*",
        intermediate: "🛡️ **Analyse sécuritaire :**\n\n**Diagnostic :**\n1. Windows Defender → Analyse hors ligne\n2. Malwarebytes (outil complémentaire)\n3. Vérification des programmes installés récemment\n4. Analyse des connexions réseau actives\n\n**Vérifications :**\n• Gestionnaire des tâches (processus suspects)\n• Extensions navigateur\n• Fichiers temporaires\n• Historique téléchargements\n\n*Avez-vous cliqué sur des liens suspects récemment ?*",
        expert: "🛡️ **Investigation sécurité avancée :**\n\n**Analyse forensique :**\n```cmd\nnetstat -an | find \"ESTABLISHED\"\ntasklist /svc\nwmic startup list full\nreg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\n```\n\n**Outils spécialisés :**\n• ProcessMonitor/ProcessExplorer\n• Wireshark (trafic réseau)\n• Sysinternals Suite\n• YARA rules\n• IOC hunting\n\n*Avez-vous un SOC ou SIEM en place ?*"
      },
      followUp: ["Avez-vous sauvegardé vos données récemment ?", "Le problème affecte-t-il d'autres ordinateurs ?", "Avez-vous reçu des emails suspects ?"]
    }
  };

  // IA conversationnelle améliorée
  const conversationalAI = {
    // Salutations et politesse
    greetings: {
      patterns: ['bonjour', 'salut', 'hello', 'bonsoir', 'bonne journée'],
      responses: [
        "👋 Bonjour ! Je suis ravi de vous aider avec vos problèmes informatiques.",
        "Salut ! Comment puis-je vous assister aujourd'hui ?",
        "Bonjour ! Quel défi technique puis-je vous aider à résoudre ?"
      ]
    },

    // Remerciements
    gratitude: {
      patterns: ['merci', 'thanks', 'parfait', 'super', 'génial', 'excellent'],
      responses: [
        "De rien ! N'hésitez pas si vous avez d'autres questions.",
        "Ravi d'avoir pu vous aider ! 😊",
        "C'est un plaisir ! Je reste disponible si besoin."
      ]
    },

    // Questions sur le chatbot
    aboutBot: {
      patterns: ['qui es-tu', 'comment tu fonctionnes', 'que peux-tu faire', 'aide'],
      response: "🤖 **Je suis votre assistant IT intelligent !**\n\n**Je peux vous aider avec :**\n• Problèmes de connexion et mots de passe\n• Dysfonctionnements réseau et WiFi\n• Problèmes d'impression\n• Performance et lenteur PC\n• Erreurs logicielles\n• Questions de sécurité\n• Création de tickets support\n\n**Mes capacités :**\n✓ Diagnostic étape par étape\n✓ Solutions adaptées à votre niveau\n✓ Support multilingue\n✓ Escalade vers techniciens\n\n*Décrivez-moi votre problème, je m'adapte automatiquement à votre expertise !*"
    }
  };

  // Suggestions contextuelles intelligentes
  const generateSuggestions = (context, userMessage) => {
    const suggestions = [];
    
    if (userMessage.toLowerCase().includes('lent')) {
      suggestions.push("Vérifier l'utilisation CPU", "Nettoyer les fichiers temporaires", "Redémarrer en mode sans échec");
    }
    
    if (userMessage.toLowerCase().includes('réseau') || userMessage.toLowerCase().includes('internet')) {
      suggestions.push("Tester la connexion", "Redémarrer la box", "Vérifier les câbles");
    }
    
    if (userMessage.toLowerCase().includes('imprimante')) {
      suggestions.push("Vérifier les consommables", "Redémarrer le spooler", "Page de test");
    }
    
    return suggestions.slice(0, 3); // Maximum 3 suggestions
  };

  const quickActions = [
    { label: "🎫 Créer un ticket", action: "create_ticket", icon: FileText },
    { label: "🔐 Mot de passe", action: "authentication", icon: Lock },
    { label: "🌐 Réseau", action: "network", icon: Wifi },
    { label: "🖨️ Imprimante", action: "printing", icon: Printer },
    { label: "💻 Performance", action: "performance", icon: Monitor },
    { label: "📧 Email", action: "email", icon: Mail }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        text: "👋 **Bonjour ! Je suis votre assistant IT intelligent.**\n\nJe peux vous aider avec tous vos problèmes informatiques. Mon IA s'adapte automatiquement à votre niveau d'expertise !\n\n**Pour commencer :** Décrivez-moi votre problème ou choisissez une action rapide ci-dessous.",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ["Mon PC est lent", "Problème de connexion", "L'imprimante ne fonctionne pas"]
      }]);
    }
  }, [isOpen, messages.length]);

  // IA de matching améliorée avec analyse contextuelle
  const findBestResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;
    let matchedCategory = null;

    // Vérifier les réponses conversationnelles d'abord
    for (const [category, data] of Object.entries(conversationalAI)) {
      if (data.patterns) {
        const score = data.patterns.reduce((acc, pattern) => {
          return message.includes(pattern.toLowerCase()) ? acc + 2 : acc;
        }, 0);
        
        if (score > 0) {
          if (data.responses) {
            return {
              response: data.responses[Math.floor(Math.random() * data.responses.length)],
              category: category,
              suggestions: []
            };
          } else {
            return {
              response: data.response,
              category: category,
              suggestions: []
            };
          }
        }
      }
    }

    // Recherche dans la base de connaissances technique
    for (const [category, data] of Object.entries(knowledgeBase)) {
      let score = 0;
      
      // Score basé sur les mots-clés
      score += data.keywords.reduce((acc, keyword) => {
        const keywordScore = message.includes(keyword.toLowerCase()) ? 1 : 0;
        // Bonus si le mot-clé apparaît plusieurs fois
        const occurrences = (message.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        return acc + keywordScore + (occurrences > 1 ? occurrences * 0.5 : 0);
      }, 0);

      // Bonus pour les mots-clés en début de phrase
      data.keywords.forEach(keyword => {
        if (message.startsWith(keyword.toLowerCase())) {
          score += 1;
        }
      });
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = data;
        matchedCategory = category;
      }
    }

    if (bestMatch && maxScore > 0) {
      const userLevel = userContext.expertiseLevel;
      const response = bestMatch.responses[userLevel] || bestMatch.responses.beginner;
      const suggestions = generateSuggestions(matchedCategory, userMessage);
      
      return {
        response: response,
        category: matchedCategory,
        suggestions: suggestions,
        followUp: bestMatch.followUp || []
      };
    }

    return null;
  };

  // IA générative pour les questions non reconnues
  const generateIntelligentResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Analyse des intentions
    const intentions = {
      question: ['comment', 'pourquoi', 'que', 'quoi', 'où', 'quand', '?'],
      problem: ['ne fonctionne pas', 'erreur', 'problème', 'bug', 'panne', 'cassé'],
      request: ['peux-tu', 'pouvez-vous', 'aide-moi', 'aidez-moi', 'comment faire'],
      urgent: ['urgent', 'critique', 'immédiatement', 'rapidement', 'bloqué']
    };

    let detectedIntention = 'general';
    let maxIntentionScore = 0;

    for (const [intention, patterns] of Object.entries(intentions)) {
      const score = patterns.reduce((acc, pattern) => {
        return message.includes(pattern) ? acc + 1 : acc;
      }, 0);
      
      if (score > maxIntentionScore) {
        maxIntentionScore = score;
        detectedIntention = intention;
      }
    }

    // Réponses adaptées selon l'intention
    const responses = {
      question: "🤔 **C'est une excellente question !**\n\nJe vais faire de mon mieux pour vous aider. Cependant, votre question est très spécifique et pourrait nécessiter l'expertise d'un technicien.\n\n**Que puis-je faire :**\n• Créer un ticket détaillé avec votre question\n• Vous orienter vers la bonne ressource\n• Vous donner des conseils généraux\n\n*Souhaitez-vous que je crée un ticket pour avoir une réponse d'expert ?*",
      
      problem: "⚠️ **Je comprends que vous rencontrez un problème.**\n\nPour vous aider efficacement, j'ai besoin de plus d'informations :\n\n**Dites-moi :**\n• Quel équipement/logiciel est concerné ?\n• Quand le problème a-t-il commencé ?\n• Avez-vous un message d'erreur ?\n• Le problème affecte-t-il d'autres personnes ?\n\n*Plus vous serez précis, mieux je pourrai vous aider !*",
      
      request: "🤝 **Je suis là pour vous aider !**\n\nVoici comment procéder :\n\n**1.** Décrivez-moi votre besoin en détail\n**2.** Je vous propose des solutions étape par étape\n**3.** Si nécessaire, je crée un ticket pour un suivi personnalisé\n\n**Mes spécialités :**\n• Dépannage technique\n• Configuration système\n• Résolution d'erreurs\n• Optimisation performance\n\n*Que souhaitez-vous que je vous aide à faire ?*",
      
      urgent: "🚨 **Situation urgente détectée !**\n\n**Actions immédiates :**\n1. Décrivez brièvement le problème critique\n2. Je vous donne une solution rapide si possible\n3. Je crée un ticket prioritaire automatiquement\n4. Escalade vers l'équipe technique si nécessaire\n\n**Pour les urgences critiques :**\n📞 Hotline : 01-XX-XX-XX-XX (24h/7j)\n📧 Urgent : support-urgent@entreprise.com\n\n*Décrivez-moi l'urgence en quelques mots*",
      
      general: "🤖 **Je n'ai pas bien saisi votre demande.**\n\nPour mieux vous aider, pourriez-vous :\n\n**Reformuler** en utilisant des mots-clés comme :\n• \"Mon ordinateur...\"\n• \"L'imprimante...\"\n• \"Je n'arrive pas à...\"\n• \"Comment faire pour...\"\n\n**Ou choisir** une action rapide ci-dessous.\n\n*Je suis conçu pour comprendre les problèmes techniques. N'hésitez pas à être précis !*"
    };

    return {
      response: responses[detectedIntention],
      category: 'ai_generated',
      suggestions: ['Créer un ticket', 'Voir les solutions courantes', 'Parler à un technicien'],
      followUp: []
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Simulation du temps de réponse avec délai réaliste
    setTimeout(() => {
      let result = findBestResponse(currentMessage);
      
      if (!result) {
        result = generateIntelligentResponse(currentMessage);
      }

      // Mise à jour du contexte utilisateur
      setUserContext(prev => ({
        ...prev,
        previousIssues: [...prev.previousIssues.slice(-4), result.category] // Garde les 5 derniers problèmes
      }));

      const botMessage = {
        id: Date.now() + 1,
        text: result.response,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: result.suggestions || [],
        followUp: result.followUp || []
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 500); // Délai réaliste entre 0.5 et 1.5 secondes
  };

  const handleQuickAction = (action) => {
    if (action === 'create_ticket') {
      setShowTicketForm(true);
      return;
    }

    const response = knowledgeBase[action];
    if (response) {
      const userLevel = userContext.expertiseLevel;
      const responseText = response.responses[userLevel] || response.responses.beginner;
      
      const botMessage = {
        id: Date.now(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: generateSuggestions(action, action),
        followUp: response.followUp || []
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    // Auto-envoi de la suggestion
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const TicketForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      contactMethod: 'email',
      phone: '',
      email: ''
    });

    const categories = ['Matériel', 'Logiciel', 'Réseau', 'Sécurité', 'Accès/Comptes', 'Performance', 'Autre'];
    const priorities = [
      { value: 'low', label: 'Basse', color: 'text-green-600', description: 'Pas urgent, peut attendre' },
      { value: 'medium', label: 'Moyenne', color: 'text-yellow-600', description: 'Résolution sous 24h' },
      { value: 'high', label: 'Haute', color: 'text-orange-600', description: 'Résolution sous 4h' },
      { value: 'critical', label: 'Critique', color: 'text-red-600', description: 'Intervention immédiate' }
    ];

    const handleSubmit = (e) => {
      e.preventDefault();
      
      const ticketId = `TKT-${Date.now().toString().slice(-6)}`;
      
      const botMessage = {
        id: Date.now(),
        text: `✅ **Ticket créé avec succès !**\n\n**🎫 Numéro :** ${ticketId}\n**📝 Titre :** ${formData.title}\n**📂 Catégorie :** ${formData.category}\n**⚡ Priorité :** ${formData.priority.toUpperCase()}\n\n**📋 Prochaines étapes :**\n1. Vous recevrez un email de confirmation\n2. Un technicien sera assigné selon la priorité\n3. Vous serez contacté via ${formData.contactMethod}\n\n**⏱️ Temps de résolution estimé :**\n${formData.priority === 'critical' ? '< 1 heure' : formData.priority === 'high' ? '< 4 heures' : formData.priority === 'medium' ? '< 24 heures' : '< 48 heures'}\n\n*Conservez ce numéro pour le suivi : ${ticketId}*`,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['Créer un autre ticket', 'Suivre mes tickets', 'Retour au support']
      };

      setMessages(prev => [...prev, botMessage]);
      setShowTicketForm(false);
      setFormData({ title: '', description: '', category: '', priority: 'medium', contactMethod: 'email', phone: '', email: '' });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ticket-form-overlay">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto ticket-form-modal">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <FileText className="w-6 h-6 text-blue-600" />
              Créer un ticket de support
            </h3>
            <button
              onClick={() => setShowTicketForm(false)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Titre du problème *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Impossible de me connecter à mon email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <FileText className="w-4 h-4 inline mr-1" />
                Description détaillée *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                placeholder="Décrivez le problème, les messages d'erreur, ce que vous avez déjà essayé..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Catégorie *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choisir...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Priorité</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value} className={priority.color}>
                      {priority.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {priorities.find(p => p.value === formData.priority)?.description}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Contact préféré</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="email"
                    checked={formData.contactMethod === 'email'}
                    onChange={(e) => setFormData({...formData, contactMethod: e.target.value})}
                    className="mr-2"
                  />
                  📧 Email
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="phone"
                    checked={formData.contactMethod === 'phone'}
                    onChange={(e) => setFormData({...formData, contactMethod: e.target.value})}
                    className="mr-2"
                  />
                  📞 Téléphone
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowTicketForm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Créer le ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Bouton flottant pour ouvrir le chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-float-button"
        >
          <MessageCircle className="icon" />
          <div className="online-indicator"></div>
        </button>
      )}

      {/* Interface du chatbot */}
      {isOpen && (
        <div className="chat-container">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="bot-avatar">
                <Bot className="icon" />
                <div className="online-indicator"></div>
              </div>
              <div>
                <h3 className="chat-title">Assistant IT Intelligent</h3>
                <p className="chat-status">En ligne • Répond en temps réel</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="close-btn"
            >
              <X className="icon" />
            </button>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className="message-block">
                <div className={`message-row ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`message-bubble ${message.sender}`}>
                    <div className="message-meta">
                      {message.sender === 'bot' && <Bot className="icon-sm" />}
                      {message.sender === 'user' && <User className="icon-sm" />}
                      <div className="message-time">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                    <div className="message-text">
                      {message.text}
                    </div>
                  </div>
                </div>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="suggestions-row">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="suggestion-chip"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="message-row justify-start">
                <div className="message-bubble bot">
                  <div className="typing">
                    <Bot className="icon-sm" />
                    <div className="typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Actions rapides */}
          <div className="quick-actions">
            {quickActions.slice(0, 4).map((action, idx) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.action)}
                  className="quick-action-btn"
                >
                  <IconComponent className="icon-sm" />
                  <span>{action.label.replace(/🎫|🔐|🌐|🖨️/, '').trim()}</span>
                </button>
              );
            })}
          </div>

          {/* Input */}
          <div className="chat-input-bar">
            <div className="input-wrapper">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Décrivez votre problème..."
                className="chat-input"
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={isTyping || !inputMessage.trim()}
              className="send-btn"
            >
              <Send className="icon-sm" />
            </button>
          </div>
          <div className="chat-hint">
            <div className="online-indicator hint"></div>
            <span>Assistant IA • Appuyez sur Entrée pour envoyer</span>
          </div>
        </div>
      )}

      {/* Formulaire de création de ticket */}
      {showTicketForm && <TicketForm />}
    </>
  );
};

export default Chatbot;