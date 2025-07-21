// client/src/pages/FAQ.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQ.css'; // Assurez-vous d'avoir un fichier CSS pour le style

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const faqData = [
    {
      id: 1,
      category: 'imprimante',
      question: "Mon imprimante ne fonctionne plus, que faire ?",
      answer: `
        1. **Vérifiez les connexions** : Assurez-vous que tous les câbles sont bien connectés
        2. **Redémarrez l'imprimante** : Éteignez-la pendant 30 secondes puis rallumez-la
        3. **Vérifiez le niveau d'encre/toner** : Remplacez si nécessaire
        4. **Nettoyez la queue d'impression** : Supprimez les tâches en attente
        5. **Redémarrez votre ordinateur** si le problème persiste
        
        Si aucune de ces solutions ne fonctionne, créez un ticket pour assistance technique.
      `
    },
    {
      id: 2,
      category: 'imprimante',
      question: "Qualité d'impression dégradée (lignes, taches)",
      answer: `
        **Solutions rapides :**
        - Lancez un nettoyage des têtes d'impression depuis les paramètres
        - Vérifiez si les cartouches sont bien installées
        - Utilisez du papier de qualité appropriée
        - Alignez les têtes d'impression via le panneau de contrôle
        
        **Pour les imprimantes laser :**
        - Secouez délicatement le toner
        - Nettoyez le tambour avec un chiffon sec
      `
    },
    {
      id: 3,
      category: 'motdepasse',
      question: "J'ai oublié mon mot de passe Windows",
      answer: `
        **Solutions possibles :**
        1. **Utilisez les questions de sécurité** configurées lors de la création du compte
        2. **Essayez vos anciens mots de passe** les plus récents
        3. **Contactez l'administrateur système** pour une réinitialisation
        
        **Prévention :**
        - Utilisez un gestionnaire de mots de passe
        - Configurez des questions de sécurité
        - Notez vos mots de passe dans un endroit sécurisé
      `
    },
    {
      id: 4,
      category: 'motdepasse',
      question: "Comment créer un mot de passe sécurisé ?",
      answer: `
        **Critères d'un bon mot de passe :**
        - Au moins 12 caractères
        - Mélange de majuscules, minuscules, chiffres et symboles
        - Pas d'informations personnelles (nom, date de naissance)
        - Unique pour chaque compte
        
        **Exemples de techniques :**
        - Phrase de passe : "J'aime2Café&LeMatin!"
        - Acronyme : "Jv@lB2f7j!" (Je vais au bureau 2 fois 7 jours)
        
        **Outils recommandés :** Gestionnaires de mots de passe
      `
    },
    {
      id: 5,
      category: 'basedonnees',
      question: "Impossible d'accéder à la base de données",
      answer: `
        **Vérifications initiales :**
        1. **Connexion réseau** : Testez votre connexion internet
        2. **Serveur en ligne** : Vérifiez si d'autres collègues ont le même problème
        3. **Identifiants corrects** : Vérifiez nom d'utilisateur et mot de passe
        
        **Solutions courantes :**
        - Redémarrez l'application
        - Videz le cache de votre navigateur
        - Vérifiez les paramètres de connexion
        
        Si le problème persiste, contactez immédiatement l'équipe IT.
      `
    },
    {
      id: 6,
      category: 'basedonnees',
      question: "La base de données est lente",
      answer: `
        **Actions utilisateur :**
        - Fermez les applications inutiles
        - Redémarrez votre ordinateur
        - Évitez les requêtes complexes pendant les heures de pointe
        
        **Si le problème persiste :**
        - Vérifiez votre connexion réseau
        - Contactez l'administrateur de base de données
        - Documentez les requêtes lentes pour analyse
      `
    },
    {
      id: 7,
      category: 'wifi',
      question: "Pas de connexion WiFi",
      answer: `
        **Étapes de dépannage :**
        1. **Vérifiez le WiFi** : Assurez-vous qu'il est activé sur votre appareil
        2. **Redémarrez** votre appareil et le routeur
        3. **Oubliez et reconnectez** le réseau WiFi
        4. **Vérifiez le mot de passe** du réseau
        
        **Solutions avancées :**
        - Réinitialisez les paramètres réseau
        - Mettez à jour les pilotes de carte réseau
        - Changez de canal WiFi si vous êtes administrateur
      `
    },
    {
      id: 8,
      category: 'wifi',
      question: "WiFi lent ou instable",
      answer: `
        **Optimisation de la connexion :**
        - **Position** : Rapprochez-vous du routeur
        - **Obstacles** : Évitez les murs épais et appareils électroniques
        - **Bande de fréquence** : Utilisez la 5GHz si disponible
        
        **Actions correctives :**
        - Redémarrez votre routeur
        - Limitez les appareils connectés
        - Vérifiez les interférences (micro-ondes, téléphones)
        - Contactez le fournisseur internet si nécessaire
      `
    },
    {
      id: 9,
      category: 'general',
      question: "Mon ordinateur est très lent",
      answer: `
        **Solutions immédiates :**
        1. **Redémarrez** votre ordinateur
        2. **Fermez les programmes** inutiles
        3. **Vérifiez l'espace disque** disponible (minimum 15%)
        4. **Analysez les processus** dans le gestionnaire des tâches
        
        **Maintenance préventive :**
        - Nettoyez les fichiers temporaires
        - Défragmentez le disque dur
        - Mettez à jour les pilotes
        - Lancez un antivirus
      `
    },
    {
      id: 10,
      category: 'general',
      question: "Comment sauvegarder mes fichiers ?",
      answer: `
        **Options de sauvegarde :**
        1. **Cloud** : OneDrive, Google Drive, Dropbox
        2. **Disque externe** : USB, disque dur externe
        3. **Serveur d'entreprise** : Dossiers partagés
        
        **Bonnes pratiques :**
        - Sauvegarde automatique quotidienne
        - Règle 3-2-1 : 3 copies, 2 supports différents, 1 hors site
        - Testez régulièrement vos sauvegardes
        - Organisez vos fichiers par dossiers
      `
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les catégories', icon: '📚' },
    { id: 'imprimante', name: 'Imprimantes', icon: '🖨️' },
    { id: 'motdepasse', name: 'Mots de passe', icon: '🔐' },
    { id: 'basedonnees', name: 'Base de données', icon: '🗄️' },
    { id: 'wifi', name: 'WiFi / Réseau', icon: '📡' },
    { id: 'general', name: 'Général', icon: '💻' }
  ];

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="faq-container">
      {/* Header */}
      <div className="faq-header">
        <h1>📖 Base de connaissances</h1>
        <p>Trouvez rapidement des solutions aux problèmes les plus courants</p>
        <div className="faq-nav">
          <Link to="/" className="btn btn-outline">
            ← Retour à l'accueil
          </Link>
          <Link to="/login" className="btn btn-primary">
            Créer un ticket
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="faq-search">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher dans la base de connaissances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Categories */}
      <div className="faq-categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="faq-content">
        {filteredFAQ.length === 0 ? (
          <div className="no-results">
            <p>Aucun résultat trouvé pour votre recherche.</p>
            <p>Essayez d'autres mots-clés ou <Link to="/login">créez un ticket</Link> pour obtenir de l'aide.</p>
          </div>
        ) : (
          <div className="faq-list">
            {filteredFAQ.map(item => (
              <div key={item.id} className="faq-item">
                <div 
                  className="faq-question"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <h3>{item.question}</h3>
                  <span className={`expand-icon ${expandedItems.has(item.id) ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
                
                {expandedItems.has(item.id) && (
                  <div className="faq-answer">
                    <div dangerouslySetInnerHTML={{ 
                      __html: item.answer.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="faq-cta">
        <div className="cta-content">
          <h2>Vous n'avez pas trouvé de solution ?</h2>
          <p>Notre équipe technique est là pour vous aider</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">
              Créer un compte
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Créer un ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;