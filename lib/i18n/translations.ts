export type Language = "en" | "fr" | "he";

export const translations = {
  en: {
    nav: {
      login: "Login",
      signup: "Sign up",
      profile: "Profile",
      signOut: "Sign Out",
      menu: "Menu",
      dashboard: "Dashboard",
      aboutUs: "About us",
    },
    common: {
      save: "Save changes",
      cancel: "Cancel",
      edit: "Edit",
      continue: "Continue",
      loading: "Loading...",
      enabled: "Enabled",
      disabled: "Disabled",
      noAdditionalNotes: "No additional notes.",
      logoutSuccess: "Logout successfully.",
      or: "OR",
      home: "Home",
      back: "Back",
    },
    form: {
      dateOfBirth: "Date of birth",
      phoneNumber: "Phone Number",
      address: "Address",
      floor: "Floor",
      entrance: "Entrance",
      disabilityAccess: "Disability Access",
      kashrout: "Kashrout",
      selectKashrout: "Select Kashrout",
      sector: "Sector",
      selectSector: "Select Sector",
      ethnicity: "Ethnicity",
      selectEthnicity: "Select Ethnicity",
      gender: "Gender",
      selectGender: "Select Gender",
      region: "Region",
      notes: "Notes",
      notesPlaceholder: "Notes for further explanations",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
    },
    address: {
      searchPlaceholder: "Search for an address with street number...",
      loading: "Loading address details...",
      streetNumberRequired: "Please select an address that includes a street number.",
      fetchError: "Failed to fetch address details. Please try again.",
    },
    search: {
      title: "Find a Shabbat Host",
      placeholder: "Search by name, address, sector...",
      noResults: "No hosts found matching your search.",
    },
    hero: {
      badge: "Bringing the spirit of Abraham's hospitality to life",
      titleLine1: "Share the warmth of",
      titleHighlight: "Shabbat",
      titleLine2: "with open doors",
      description:
        "Ohel Avraham connects hosts who open their homes for Shabbat meals with guests looking for a warm, meaningful experience. No one should eat alone.",
      getStarted: "Get Started",
      learnMore: "Learn More",
    },
    stats: {
      labels: [
        "Shabbat meals shared",
        "Active hosts",
        "Communities reached",
        "Guest satisfaction",
      ],
    },
    howItWorks: {
      sectionLabel: "How it works",
      sectionTitle: "Three simple steps to a meaningful Shabbat",
      step: "Step",
      steps: [
        {
          title: "Create your profile",
          description:
            "Sign up as a host or a guest. Tell us about your preferences, kashrut level, and what makes your Shabbat special.",
        },
        {
          title: "Find a match",
          description:
            "Browse available Shabbat meals in your area, or open your home and let guests find you. We make the connection easy.",
        },
        {
          title: "Share a meal",
          description:
            "Enjoy a warm Shabbat experience together. Build lasting connections and strengthen the community, one meal at a time.",
        },
      ],
    },
    features: {
      sectionLabel: "Why Ohel Avraham",
      sectionTitle: "Everything you need for a perfect Shabbat",
      items: [
        {
          title: "Trusted & Verified",
          description:
            "All hosts and guests go through a verification process so you can feel safe and confident.",
        },
        {
          title: "Kashrut Preferences",
          description:
            "Specify your dietary needs and kashrut level. We make sure every meal matches your standards.",
        },
        {
          title: "Any Community",
          description:
            "From Ashkenazi to Sephardi, from modern to traditional, find or offer meals in any community style.",
        },
        {
          title: "Build Connections",
          description:
            "More than a meal, it is a chance to forge friendships and strengthen community bonds.",
        },
      ],
    },
    testimonials: {
      sectionLabel: "Testimonials",
      sectionTitle: "Stories from our community",
      items: [
        {
          name: "Sarah L.",
          role: "Guest",
          quote:
            "I was new to the city and didn't know anyone. Through Ohel Avraham, I found a family that welcomed me like their own. It changed my Shabbat completely.",
        },
        {
          name: "David & Miriam K.",
          role: "Hosts",
          quote:
            "We have extra seats at our table every week. Now those seats are filled with wonderful people we would never have met otherwise. It enriches our Shabbat.",
        },
        {
          name: "Yonatan R.",
          role: "Guest",
          quote:
            "As a student far from home, Shabbat could feel lonely. This platform gave me a community. Now I look forward to every Friday night.",
        },
      ],
    },
    cta: {
      title: "Ready to open your door or find your next Shabbat meal?",
      description:
        "Join hundreds of hosts and guests building a stronger, more connected community, one Shabbat at a time.",
      joinAsHost: "Join as a Host",
      joinAsGuest: "Join as a Guest",
    },
    footer: {
      tagline:
        "Connecting hearts and homes for a warmer Shabbat experience. Inspired by the hospitality of Avraham Avinu.",
      platform: "Platform",
      account: "Account",
      signUp: "Sign Up",
      rights: "Ohel Avraham. All rights reserved.",
      builtWith: "Built with",
      love: "love",
      forCommunity: "for the community",
    },
    auth: {
      signUpTitle: "Sign up",
      signUpDesc: "Create your Account to start your sharing experience",
      loginTitle: "Login",
      loginDesc: "Log in to your Account to start your sharing experience",
      continueWithGoogle: "Continue with Google",
      continueWithEmail: "Continue With Email",
      register: "Register",
      alreadyHaveAccount: "Already have an account?",
      clickToLogin: "Click here to login",
      noAccount: "Don't have an account?",
      clickToRegister: "Click here to register",
      quote: "Welcoming guests is greater than receiving the Divine Presence.",
      quoteSource: "Shabbat 127a",
      loadingRegistration: "Loading registration...",
      completeRegTitle: "Complete your registration",
      completeRegDesc: "Finish your registration to pursue your sharing experience.",
      hostLabel: "Host",
      hostDesc: "Welcome people on Shabbat and share a wonderful holy day",
      guestLabel: "Guest",
      guestDesc: "Search for people that can host you on Shabbat",
      welcomeNew: "Welcome new",
      signedInWithGoogle: "Signed in with Google, you will be redirected...",
      signedUpSuccess: "Signed up successfully.",
      loginSuccess: "Login successfully.",
      errorCreating: "Error creating profile",
    },
    dashboard: {
      title: "Dashboard",
      accountOverview: "Account Overview",
      accountOverviewDesc: "Manage your profile status and community permissions.",
      editProfile: "Edit Profile",
      community: "Community",
      communityDesc: "Connect with other members of the community.",
      browsePeople: "Browse People",
      seeGuests: "See guests looking for meals",
      findHosts: "Find hosts near you",
      profileSetup: "Profile Setup",
      complete: "Complete",
      incomplete: "Incomplete",
      yourRole: "Your Role",
      verification: "Verification",
      verified: "Verified",
      pending: "Pending",
    },
    hostProfile: {
      title: "Host Settings",
      addressDesc: "The location where you will host meals.",
      phoneDesc: "Used for urgent coordination with guests.",
      communityDetails: "Community details",
      communityDetailsDesc: "Sector and cultural background.",
      accessibility: "Accessibility",
      accessibilityDesc: "Does your home have step-free access for wheelchairs?",
      stepFreeAccess: "Step-free access",
      noSpecializedAccess: "No specialized access",
      notesDesc: "Any specific details your guests should know beforehand.",
    },
    guestProfile: {
      preferredRegion: "Preferred Region",
      preferredRegionDesc: "The area where you are looking for a host.",
    },
  },

  fr: {
    nav: {
      login: "Connexion",
      signup: "S'inscrire",
      profile: "Profil",
      signOut: "Se déconnecter",
      menu: "Menu",
      dashboard: "Tableau de bord",
      aboutUs: "À propos",
    },
    common: {
      save: "Sauvegarder",
      cancel: "Annuler",
      edit: "Modifier",
      continue: "Continuer",
      loading: "Chargement...",
      enabled: "Activé",
      disabled: "Désactivé",
      noAdditionalNotes: "Aucune note supplémentaire.",
      logoutSuccess: "Déconnexion réussie.",
      or: "OU",
      home: "Accueil",
      back: "Retour",
    },
    form: {
      dateOfBirth: "Date de naissance",
      phoneNumber: "Numéro de téléphone",
      address: "Adresse",
      floor: "Étage",
      entrance: "Entrée",
      disabilityAccess: "Accès handicapé",
      kashrout: "Cacherout",
      selectKashrout: "Sélectionner la Cacherout",
      sector: "Secteur",
      selectSector: "Sélectionner un secteur",
      ethnicity: "Communauté",
      selectEthnicity: "Sélectionner une communauté",
      gender: "Genre",
      selectGender: "Sélectionner un genre",
      region: "Région",
      notes: "Notes",
      notesPlaceholder: "Notes pour des précisions supplémentaires",
      firstName: "Prénom",
      lastName: "Nom de famille",
      email: "E-mail",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
    },
    address: {
      searchPlaceholder: "Rechercher une adresse avec numéro de rue...",
      loading: "Chargement des détails de l'adresse...",
      streetNumberRequired: "Veuillez sélectionner une adresse incluant un numéro de rue.",
      fetchError: "Impossible de récupérer les détails de l'adresse. Réessayez.",
    },
    search: {
      title: "Trouver un hôte pour Chabbat",
      placeholder: "Rechercher par nom, adresse, secteur...",
      noResults: "Aucun hôte trouvé.",
    },
    hero: {
      badge: "Faire vivre l'esprit d'hospitalité d'Avraham",
      titleLine1: "Partagez la chaleur du",
      titleHighlight: "Chabbat",
      titleLine2: "portes ouvertes",
      description:
        "Ohel Avraham met en relation des hôtes qui ouvrent leur maison pour les repas de Chabbat avec des invités à la recherche d'une expérience chaleureuse et enrichissante. Personne ne devrait manger seul.",
      getStarted: "Commencer",
      learnMore: "En savoir plus",
    },
    stats: {
      labels: [
        "Repas de Chabbat partagés",
        "Hôtes actifs",
        "Communautés atteintes",
        "Satisfaction des invités",
      ],
    },
    howItWorks: {
      sectionLabel: "Comment ça marche",
      sectionTitle: "Trois étapes simples vers un Chabbat mémorable",
      step: "Étape",
      steps: [
        {
          title: "Créez votre profil",
          description:
            "Inscrivez-vous en tant qu'hôte ou invité. Parlez-nous de vos préférences, de votre niveau de Cacherout et de ce qui rend votre Chabbat unique.",
        },
        {
          title: "Trouvez une correspondance",
          description:
            "Parcourez les repas de Chabbat disponibles dans votre région, ou ouvrez votre maison et laissez les invités vous trouver. Nous facilitons la mise en relation.",
        },
        {
          title: "Partagez un repas",
          description:
            "Profitez ensemble d'une belle expérience de Chabbat. Créez des liens durables et renforcez la communauté, un repas à la fois.",
        },
      ],
    },
    features: {
      sectionLabel: "Pourquoi Ohel Avraham",
      sectionTitle: "Tout ce qu'il vous faut pour un Chabbat parfait",
      items: [
        {
          title: "Fiable & Vérifié",
          description:
            "Tous les hôtes et les invités passent par un processus de vérification pour que vous puissiez vous sentir en sécurité et en confiance.",
        },
        {
          title: "Préférences de Cacherout",
          description:
            "Précisez vos besoins alimentaires et votre niveau de Cacherout. Nous nous assurons que chaque repas correspond à vos standards.",
        },
        {
          title: "Toute Communauté",
          description:
            "D'Ashkénaze à Séfarade, de moderne à traditionnel, trouvez ou proposez des repas dans n'importe quel style communautaire.",
        },
        {
          title: "Créer des Liens",
          description:
            "Plus qu'un repas, c'est une chance de nouer des amitiés et de renforcer les liens communautaires.",
        },
      ],
    },
    testimonials: {
      sectionLabel: "Témoignages",
      sectionTitle: "Les histoires de notre communauté",
      items: [
        {
          name: "Sarah L.",
          role: "Invitée",
          quote:
            "J'étais nouvelle dans la ville et je ne connaissais personne. Grâce à Ohel Avraham, j'ai trouvé une famille qui m'a accueillie comme l'une des leurs. Ça a complètement changé mon Chabbat.",
        },
        {
          name: "David & Miriam K.",
          role: "Hôtes",
          quote:
            "Nous avons des places libres à notre table chaque semaine. Maintenant ces places sont occupées par des personnes merveilleuses que nous n'aurions jamais rencontrées autrement. Cela enrichit notre Chabbat.",
        },
        {
          name: "Yonatan R.",
          role: "Invité",
          quote:
            "En tant qu'étudiant loin de chez moi, le Chabbat pouvait sembler solitaire. Cette plateforme m'a donné une communauté. Maintenant j'attends chaque vendredi soir avec impatience.",
        },
      ],
    },
    cta: {
      title: "Prêt à ouvrir votre porte ou à trouver votre prochain repas de Chabbat ?",
      description:
        "Rejoignez des centaines d'hôtes et d'invités qui bâtissent une communauté plus forte et plus unie, un Chabbat à la fois.",
      joinAsHost: "Rejoindre en tant qu'hôte",
      joinAsGuest: "Rejoindre en tant qu'invité",
    },
    footer: {
      tagline:
        "Relier les cœurs et les foyers pour une expérience de Chabbat plus chaleureuse. Inspiré par l'hospitalité d'Avraham Avinou.",
      platform: "Plateforme",
      account: "Compte",
      signUp: "S'inscrire",
      rights: "Ohel Avraham. Tous droits réservés.",
      builtWith: "Fait avec",
      love: "amour",
      forCommunity: "pour la communauté",
    },
    auth: {
      signUpTitle: "S'inscrire",
      signUpDesc: "Créez votre compte pour commencer votre expérience de partage",
      loginTitle: "Connexion",
      loginDesc: "Connectez-vous à votre compte pour commencer votre expérience de partage",
      continueWithGoogle: "Continuer avec Google",
      continueWithEmail: "Continuer avec l'e-mail",
      register: "S'inscrire",
      alreadyHaveAccount: "Vous avez déjà un compte ?",
      clickToLogin: "Cliquez ici pour vous connecter",
      noAccount: "Vous n'avez pas de compte ?",
      clickToRegister: "Cliquez ici pour vous inscrire",
      quote: "Accueillir des invités est plus grand que recevoir la Présence Divine.",
      quoteSource: "Chabbat 127a",
      loadingRegistration: "Chargement de l'inscription...",
      completeRegTitle: "Terminez votre inscription",
      completeRegDesc: "Finalisez votre inscription pour poursuivre votre expérience de partage.",
      hostLabel: "Hôte",
      hostDesc: "Accueillez des personnes pour le Chabbat et partagez une merveilleuse journée sainte",
      guestLabel: "Invité",
      guestDesc: "Cherchez des personnes pouvant vous héberger pour le Chabbat",
      welcomeNew: "Bienvenue nouveau",
      signedInWithGoogle: "Connecté avec Google, vous allez être redirigé...",
      signedUpSuccess: "Inscription réussie.",
      loginSuccess: "Connexion réussie.",
      errorCreating: "Erreur lors de la création du profil",
    },
    dashboard: {
      title: "Tableau de bord",
      accountOverview: "Aperçu du compte",
      accountOverviewDesc: "Gérez le statut de votre profil et les autorisations communautaires.",
      editProfile: "Modifier le profil",
      community: "Communauté",
      communityDesc: "Connectez-vous avec d'autres membres de la communauté.",
      browsePeople: "Parcourir les membres",
      seeGuests: "Voir les invités cherchant des repas",
      findHosts: "Trouver des hôtes près de chez vous",
      profileSetup: "Configuration du profil",
      complete: "Complet",
      incomplete: "Incomplet",
      yourRole: "Votre rôle",
      verification: "Vérification",
      verified: "Vérifié",
      pending: "En attente",
    },
    hostProfile: {
      title: "Paramètres de l'hôte",
      addressDesc: "L'endroit où vous accueillerez les repas.",
      phoneDesc: "Utilisé pour la coordination urgente avec les invités.",
      communityDetails: "Détails de la communauté",
      communityDetailsDesc: "Secteur et appartenance culturelle.",
      accessibility: "Accessibilité",
      accessibilityDesc: "Votre domicile dispose-t-il d'un accès sans marches pour les fauteuils roulants ?",
      stepFreeAccess: "Accès sans marches",
      noSpecializedAccess: "Pas d'accès spécialisé",
      notesDesc: "Tous les détails spécifiques que vos invités devraient savoir à l'avance.",
    },
    guestProfile: {
      preferredRegion: "Région préférée",
      preferredRegionDesc: "La zone où vous cherchez un hôte.",
    },
  },

  he: {
    nav: {
      login: "כניסה",
      signup: "הרשמה",
      profile: "פרופיל",
      signOut: "התנתק",
      menu: "תפריט",
      dashboard: "לוח בקרה",
      aboutUs: "אודות",
    },
    common: {
      save: "שמור שינויים",
      cancel: "ביטול",
      edit: "עריכה",
      continue: "המשך",
      loading: "טוען...",
      enabled: "מופעל",
      disabled: "מושבת",
      noAdditionalNotes: "אין הערות נוספות.",
      logoutSuccess: "התנתקת בהצלחה.",
      or: "או",
      home: "דף הבית",
      back: "חזרה",
    },
    form: {
      dateOfBirth: "תאריך לידה",
      phoneNumber: "מספר טלפון",
      address: "כתובת",
      floor: "קומה",
      entrance: "כניסה",
      disabilityAccess: "נגישות לנכים",
      kashrout: "כשרות",
      selectKashrout: "בחר כשרות",
      sector: "מגזר",
      selectSector: "בחר מגזר",
      ethnicity: "עדה",
      selectEthnicity: "בחר עדה",
      gender: "מין",
      selectGender: "בחר מין",
      region: "אזור",
      notes: "הערות",
      notesPlaceholder: "הערות להסברים נוספים",
      firstName: "שם פרטי",
      lastName: "שם משפחה",
      email: "דוא\"ל",
      password: "סיסמה",
      confirmPassword: "אישור סיסמה",
    },
    address: {
      searchPlaceholder: "חפש כתובת עם מספר רחוב...",
      loading: "טוען פרטי כתובת...",
      streetNumberRequired: "אנא בחר כתובת הכוללת מספר רחוב.",
      fetchError: "שגיאה בטעינת פרטי הכתובת. נסה שוב.",
    },
    search: {
      title: "מצא מארח לשבת",
      placeholder: "חיפוש לפי שם, כתובת, מגזר...",
      noResults: "לא נמצאו מארחים.",
    },
    hero: {
      badge: "מביאים לחיים את רוח האירוח של אברהם",
      titleLine1: "שתפו את חמימות",
      titleHighlight: "שבת",
      titleLine2: "עם דלתות פתוחות",
      description:
        "אוהל אברהם מחבר בין מארחים שפותחים את בתיהם לארוחות שבת לבין אורחים המחפשים חוויה חמה ומשמעותית. אף אחד לא צריך לאכול לבד.",
      getStarted: "בואו נתחיל",
      learnMore: "קרא עוד",
    },
    stats: {
      labels: [
        "ארוחות שבת שנשתפו",
        "מארחים פעילים",
        "קהילות שהגענו אליהן",
        "שביעות רצון האורחים",
      ],
    },
    howItWorks: {
      sectionLabel: "איך זה עובד",
      sectionTitle: "שלושה שלבים פשוטים לשבת משמעותית",
      step: "שלב",
      steps: [
        {
          title: "צור את הפרופיל שלך",
          description:
            "הירשם כמארח או כאורח. ספר לנו על ההעדפות שלך, רמת הכשרות שלך ומה שמייחד את השבת שלך.",
        },
        {
          title: "מצא התאמה",
          description:
            "עיין בארוחות שבת זמינות באזורך, או פתח את ביתך ותן לאורחים למצוא אותך. אנו מקלים על החיבור.",
        },
        {
          title: "שתף ארוחה",
          description:
            "תיהנה יחד מחוויית שבת חמה. צור קשרים מתמשכים וחזק את הקהילה, ארוחה אחת בכל פעם.",
        },
      ],
    },
    features: {
      sectionLabel: "למה אוהל אברהם",
      sectionTitle: "כל מה שצריך לשבת מושלמת",
      items: [
        {
          title: "מהימן ומאומת",
          description:
            "כל המארחים והאורחים עוברים תהליך אימות כדי שתוכלו להרגיש בטוחים ובטוחים.",
        },
        {
          title: "העדפות כשרות",
          description:
            "ציין את הצרכים התזונתיים שלך ורמת הכשרות שלך. אנו מוודאים שכל ארוחה עומדת בסטנדרטים שלך.",
        },
        {
          title: "כל קהילה",
          description:
            "מאשכנז לספרד, ממודרני למסורתי, מצא או הצע ארוחות בכל סגנון קהילתי.",
        },
        {
          title: "בנה קשרים",
          description:
            "יותר מסתם ארוחה, זוהי הזדמנות לקשור ידידויות ולחזק את קשרי הקהילה.",
        },
      ],
    },
    testimonials: {
      sectionLabel: "המלצות",
      sectionTitle: "סיפורים מהקהילה שלנו",
      items: [
        {
          name: "שרה ל.",
          role: "אורחת",
          quote:
            "הייתי חדשה בעיר ולא הכרתי אף אחד. דרך אוהל אברהם, מצאתי משפחה שקיבלה אותי כאחת משלהם. זה שינה את השבת שלי לחלוטין.",
        },
        {
          name: "דוד ומרים ק.",
          role: "מארחים",
          quote:
            "יש לנו מקומות פנויים בשולחן שלנו כל שבוע. עכשיו המקומות האלה מלאים באנשים נפלאים שלא היינו פוגשים אחרת. זה מעשיר את השבת שלנו.",
        },
        {
          name: "יונתן ר.",
          role: "אורח",
          quote:
            "כסטודנט רחוק מהבית, השבת יכולה להרגיש בודדה. הפלטפורמה הזו נתנה לי קהילה. עכשיו אני מצפה לכל ליל שישי.",
        },
      ],
    },
    cta: {
      title: "מוכן לפתוח את דלתך או למצוא את ארוחת השבת הבאה שלך?",
      description:
        "הצטרף למאות מארחים ואורחים שבונים קהילה חזקה ומקושרת יותר, שבת אחת בכל פעם.",
      joinAsHost: "הצטרף כמארח",
      joinAsGuest: "הצטרף כאורח",
    },
    footer: {
      tagline:
        "מחברים לבבות ובתים לחוויית שבת חמה יותר. בהשראת האירוח של אברהם אבינו.",
      platform: "פלטפורמה",
      account: "חשבון",
      signUp: "הרשמה",
      rights: "אוהל אברהם. כל הזכויות שמורות.",
      builtWith: "נבנה עם",
      love: "אהבה",
      forCommunity: "לקהילה",
    },
    auth: {
      signUpTitle: "הרשמה",
      signUpDesc: "צור את חשבונך כדי להתחיל את חוויית השיתוף שלך",
      loginTitle: "כניסה",
      loginDesc: "התחבר לחשבונך כדי להתחיל את חוויית השיתוף שלך",
      continueWithGoogle: "המשך עם Google",
      continueWithEmail: "המשך עם דוא\"ל",
      register: "הירשם",
      alreadyHaveAccount: "כבר יש לך חשבון?",
      clickToLogin: "לחץ כאן להתחברות",
      noAccount: "אין לך חשבון?",
      clickToRegister: "לחץ כאן להרשמה",
      quote: "הכנסת אורחים גדולה מהכנסת שכינה.",
      quoteSource: "שבת קכז ע\"א",
      loadingRegistration: "טוען הרשמה...",
      completeRegTitle: "השלם את ההרשמה שלך",
      completeRegDesc: "סיים את ההרשמה שלך כדי להמשיך בחוויית השיתוף שלך.",
      hostLabel: "מארח",
      hostDesc: "קבל אורחים בשבת ושתף יום קדוש נפלא",
      guestLabel: "אורח",
      guestDesc: "חפש אנשים שיכולים לארח אותך בשבת",
      welcomeNew: "ברוך הבא",
      signedInWithGoogle: "התחברת עם Google, תועבר בקרוב...",
      signedUpSuccess: "נרשמת בהצלחה.",
      loginSuccess: "התחברת בהצלחה.",
      errorCreating: "שגיאה ביצירת הפרופיל",
    },
    dashboard: {
      title: "לוח בקרה",
      accountOverview: "סקירת חשבון",
      accountOverviewDesc: "נהל את סטטוס הפרופיל שלך והרשאות קהילתיות.",
      editProfile: "ערוך פרופיל",
      community: "קהילה",
      communityDesc: "התחבר עם חברים אחרים בקהילה.",
      browsePeople: "עיין באנשים",
      seeGuests: "ראה אורחים המחפשים ארוחות",
      findHosts: "מצא מארחים קרובים אליך",
      profileSetup: "הגדרת פרופיל",
      complete: "מושלם",
      incomplete: "לא שלם",
      yourRole: "התפקיד שלך",
      verification: "אימות",
      verified: "מאומת",
      pending: "ממתין",
    },
    hostProfile: {
      title: "הגדרות מארח",
      addressDesc: "המיקום שבו תארח ארוחות.",
      phoneDesc: "משמש לתיאום דחוף עם האורחים.",
      communityDetails: "פרטי קהילה",
      communityDetailsDesc: "מגזר ורקע תרבותי.",
      accessibility: "נגישות",
      accessibilityDesc: "האם לביתך יש גישה ללא מדרגות לכיסאות גלגלים?",
      stepFreeAccess: "גישה ללא מדרגות",
      noSpecializedAccess: "אין גישה מיוחדת",
      notesDesc: "כל פרטים ספציפיים שהאורחים שלך צריכים לדעת מראש.",
    },
    guestProfile: {
      preferredRegion: "אזור מועדף",
      preferredRegionDesc: "האזור שבו אתה מחפש מארח.",
    },
  },
} as const;

export type Translations = typeof translations.en;
