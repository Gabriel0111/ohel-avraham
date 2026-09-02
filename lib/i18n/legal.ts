// Content for the static legal / informational pages (Help, Terms, Privacy,
// Cookies). Kept out of `translations.ts` to keep that file navigable.
//
// Inline links use a minimal `[label](href)` syntax, rendered by
// `components/legal/legal-document.tsx`. Internal hrefs start with "/".

import type { Language } from "./translations";

export type LegalBlock =
  | { h: string } // sub-heading (e.g. an FAQ question)
  | { p: string } // paragraph, supports [label](href)
  | { ul: string[] }; // bullet list, each item supports [label](href)

export type LegalSection = { heading?: string; blocks: LegalBlock[] };

export type LegalDoc = {
  title: string;
  intro?: string;
  sections: LegalSection[];
};

export type LegalContent = {
  lastUpdated: string;
  updatedDate: string;
  help: LegalDoc;
  terms: LegalDoc;
  privacy: LegalDoc;
  cookies: LegalDoc;
};

const en: LegalContent = {
  lastUpdated: "Last updated",
  updatedDate: "September 2, 2026",

  help: {
    title: "Help & FAQ",
    intro:
      "Ohel Avraham connects Shabbat hosts and guests across Israel. Below are the questions we hear most often. If something isn't covered, please [get in touch](/contact).",
    sections: [
      {
        heading: "Getting started",
        blocks: [
          { h: "How do I create an account?" },
          {
            p: "Sign up with your email address or your Google account from the [sign-up page](/sign-up). After confirming your email you complete a short profile and choose whether you want to host, to be a guest, or both.",
          },
          { h: "What information do I need to provide?" },
          {
            p: "Guests share their region, sector, ethnicity and a few preferences. Hosts additionally provide an address, kashrut level and accessibility details so guests can find a table that fits them.",
          },
        ],
      },
      {
        heading: "Hosting",
        blocks: [
          { h: "Who can see my address?" },
          {
            p: "Your exact address is only revealed to a guest once you accept their request. Public search shows an approximate map location and your city.",
          },
          { h: "How do I pause hosting?" },
          {
            p: "Open your profile and turn off your host availability. You stay listed but no longer appear as available for new requests.",
          },
        ],
      },
      {
        heading: "Requests",
        blocks: [
          { h: "How does a request work?" },
          {
            p: "A guest sends a hosting request for a specific Shabbat. The host receives an email and can accept or decline. Both sides are notified of the outcome, and the guest can cancel a request while it is still pending.",
          },
        ],
      },
      {
        heading: "Account & privacy",
        blocks: [
          { h: "How do I change my avatar or name?" },
          {
            p: "Edit them from your profile page. Uploaded photos replace the one imported from your sign-in provider.",
          },
          { h: "How do I delete my account?" },
          {
            p: "Use the delete option at the bottom of your profile page. This removes your profile, your hosting requests and your stored photo. See our [Privacy Policy](/privacy) for details.",
          },
        ],
      },
      {
        heading: "Still need help?",
        blocks: [
          {
            p: "Reach us through the [contact form](/contact) and we'll get back to you within 48 hours.",
          },
        ],
      },
    ],
  },

  terms: {
    title: "Terms of Use",
    intro:
      'These Terms of Use ("Terms") govern your access to and use of Ohel Avraham (the "Platform"), which connects people offering a Shabbat table ("Hosts") with people looking for one ("Guests"). By creating an account or using the Platform you agree to these Terms.',
    sections: [
      {
        heading: "1. Eligibility",
        blocks: [
          {
            p: "You must be at least 18 years old and able to enter into a binding agreement to use the Platform. You are responsible for the accuracy of the information in your profile and for keeping it up to date.",
          },
        ],
      },
      {
        heading: "2. The Platform's role",
        blocks: [
          {
            p: "Ohel Avraham is an introduction service. We do not host meals, verify the identity of every user, inspect homes, or supervise kashrut. Any meeting or hosting arrangement is made directly between Host and Guest, at their own discretion and risk. We are not a party to those arrangements.",
          },
        ],
      },
      {
        heading: "3. User conduct",
        blocks: [
          {
            ul: [
              "Provide truthful profile and contact information.",
              "Treat other users with respect; harassment, hateful conduct and discrimination are not tolerated.",
              "Do not use the Platform for commercial solicitation or for any unlawful purpose.",
              "Do not misuse other users' personal information, including addresses shared with you to arrange a visit.",
            ],
          },
        ],
      },
      {
        heading: "4. Content you provide",
        blocks: [
          {
            p: "You retain ownership of the text and images you upload. You grant Ohel Avraham a limited licence to store and display that content on the Platform for the purpose of operating the service. You must hold the rights to any image you upload.",
          },
        ],
      },
      {
        heading: "5. Safety",
        blocks: [
          {
            p: "You are solely responsible for your decisions about whom to meet and whom to host. Use common sense, meet new contacts thoughtfully, and stop any interaction that makes you uncomfortable. Report concerns through the [contact form](/contact).",
          },
        ],
      },
      {
        heading: "6. Suspension and termination",
        blocks: [
          {
            p: "We may suspend or remove any account that violates these Terms or that we reasonably believe puts other users at risk. You may delete your account at any time from your profile page.",
          },
        ],
      },
      {
        heading: "7. Disclaimers and limitation of liability",
        blocks: [
          {
            p: 'The Platform is provided "as is" without warranties of any kind. To the fullest extent permitted by law, Ohel Avraham is not liable for any indirect, incidental or consequential damages, or for the conduct of any user, arising out of your use of the Platform.',
          },
        ],
      },
      {
        heading: "8. Changes",
        blocks: [
          {
            p: "We may update these Terms from time to time. Material changes will be announced on the Platform. Continued use after a change means you accept the updated Terms.",
          },
        ],
      },
      {
        heading: "9. Contact",
        blocks: [
          { p: "Questions about these Terms can be sent through the [contact form](/contact)." },
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    intro:
      'This Privacy Policy explains what personal information Ohel Avraham (the "Platform") collects, how we use it, and the choices you have.',
    sections: [
      {
        heading: "1. Information we collect",
        blocks: [
          {
            ul: [
              "Account information: name, email address, and profile photo (uploaded by you or imported from Google when you sign in with Google).",
              "Profile information: date of birth, region or address, phone number (hosts), sector, ethnicity, kashrut level, accessibility details and any notes you add.",
              "Activity information: hosting requests you send or receive and messages you send us through the contact form.",
              "Technical information: basic log data needed to operate and secure the service.",
            ],
          },
        ],
      },
      {
        heading: "2. How we use your information",
        blocks: [
          {
            ul: [
              "To create your account and show your profile to compatible users.",
              "To let hosts and guests find each other and arrange a Shabbat visit.",
              "To send transactional emails, such as request notifications and email verification codes.",
              "To respond to your enquiries and to keep the Platform safe.",
            ],
          },
        ],
      },
      {
        heading: "3. What other users can see",
        blocks: [
          {
            p: "Your first name, photo, city and general profile details are visible to other signed-in users. Your exact address and phone number are shared with a guest only after you accept their hosting request. Public search pages show an approximate map location, never your precise address.",
          },
        ],
      },
      {
        heading: "4. Service providers",
        blocks: [
          {
            p: "We use third parties to run the Platform, including [Convex](https://www.convex.dev) (database and file storage), [Resend](https://resend.com) (email delivery), and Google (sign-in and maps). These providers process data only on our behalf and according to their own security commitments.",
          },
        ],
      },
      {
        heading: "5. Cookies",
        blocks: [
          {
            p: "We use cookies that are strictly necessary to run the site, plus third-party cookies from Google when you use sign-in or the map. We do not use advertising or analytics cookies. See our [Cookie Policy](/cookies) for the full list and your choices.",
          },
        ],
      },
      {
        heading: "6. Data retention",
        blocks: [
          {
            p: "We keep your information for as long as your account is active. When you delete your account we remove your profile, your hosting requests and your stored profile photo. Some records may be retained briefly where required for security or legal reasons.",
          },
        ],
      },
      {
        heading: "7. Your choices",
        blocks: [
          {
            ul: [
              "Update or correct your profile at any time from your profile page.",
              "Replace or remove your profile photo from your profile page.",
              "Delete your account, and the data described above, from your profile page.",
            ],
          },
        ],
      },
      {
        heading: "8. Children",
        blocks: [
          {
            p: "The Platform is not intended for anyone under 18, and we do not knowingly collect information from children.",
          },
        ],
      },
      {
        heading: "9. Changes",
        blocks: [
          {
            p: "We may update this Policy from time to time. Material changes will be announced on the Platform.",
          },
        ],
      },
      {
        heading: "10. Contact",
        blocks: [
          {
            p: "For any question about your data or this Policy, contact us through the [contact form](/contact).",
          },
        ],
      },
    ],
  },

  cookies: {
    title: "Cookie Policy",
    intro:
      "This policy explains how Ohel Avraham uses cookies and similar technologies, and how you can control them.",
    sections: [
      {
        heading: "What are cookies?",
        blocks: [
          {
            p: "Cookies are small text files stored on your device by your browser. They let a site remember information about your visit, such as your language or that you are signed in.",
          },
        ],
      },
      {
        heading: "Cookies we use",
        blocks: [
          { h: "Strictly necessary (always active)" },
          {
            p: "These are required for the site to function and cannot be switched off.",
          },
          {
            ul: [
              "lang — remembers your interface language.",
              "Authentication cookies — keep your session active while you are signed in.",
              "cookie_consent — remembers your cookie choice so we don't ask again.",
            ],
          },
          { h: "Third-party (Google)" },
          {
            p: "When you sign in with Google or use the interactive map, Google may set its own cookies on its domains. These are governed by Google's own privacy and cookie policies.",
          },
        ],
      },
      {
        heading: "Advertising and analytics",
        blocks: [
          { p: "We do not use advertising cookies or third-party analytics cookies." },
        ],
      },
      {
        heading: "Managing your choices",
        blocks: [
          {
            p: 'On your first visit you can accept all cookies or keep only the necessary ones. You can change your choice at any time from "Cookie settings" in the footer. You can also delete or block cookies in your browser settings, but the site may not work correctly without the strictly necessary ones.',
          },
        ],
      },
      {
        heading: "Changes",
        blocks: [
          {
            p: "We may update this policy from time to time. Material changes will be announced on the Platform.",
          },
        ],
      },
      {
        heading: "Contact",
        blocks: [
          { p: "Questions about cookies can be sent through the [contact form](/contact)." },
        ],
      },
    ],
  },
};

const fr: LegalContent = {
  lastUpdated: "Dernière mise à jour",
  updatedDate: "2 septembre 2026",

  help: {
    title: "Aide & FAQ",
    intro:
      "Ohel Avraham met en relation des hôtes et des invités pour Chabbat partout en Israël. Voici les questions les plus fréquentes. Si vous ne trouvez pas de réponse, [contactez-nous](/contact).",
    sections: [
      {
        heading: "Premiers pas",
        blocks: [
          { h: "Comment créer un compte ?" },
          {
            p: "Inscrivez-vous avec votre adresse e-mail ou votre compte Google depuis la [page d'inscription](/sign-up). Après confirmation de votre e-mail, vous remplissez un court profil et choisissez si vous souhaitez héberger, être invité, ou les deux.",
          },
          { h: "Quelles informations dois-je fournir ?" },
          {
            p: "Les invités indiquent leur région, leur secteur, leur origine et quelques préférences. Les hôtes fournissent en plus une adresse, un niveau de cacherout et des informations d'accessibilité, afin que les invités trouvent une table qui leur convient.",
          },
        ],
      },
      {
        heading: "Héberger",
        blocks: [
          { h: "Qui peut voir mon adresse ?" },
          {
            p: "Votre adresse exacte n'est communiquée à un invité qu'une fois sa demande acceptée. La recherche publique n'affiche qu'une position approximative sur la carte et votre ville.",
          },
          { h: "Comment mettre l'hébergement en pause ?" },
          {
            p: "Ouvrez votre profil et désactivez votre disponibilité d'hôte. Vous restez référencé mais n'apparaissez plus comme disponible pour de nouvelles demandes.",
          },
        ],
      },
      {
        heading: "Demandes",
        blocks: [
          { h: "Comment fonctionne une demande ?" },
          {
            p: "Un invité envoie une demande d'hébergement pour un Chabbat précis. L'hôte reçoit un e-mail et peut accepter ou refuser. Les deux parties sont informées du résultat, et l'invité peut annuler une demande tant qu'elle est en attente.",
          },
        ],
      },
      {
        heading: "Compte & confidentialité",
        blocks: [
          { h: "Comment changer ma photo ou mon nom ?" },
          {
            p: "Modifiez-les depuis votre page de profil. Les photos que vous importez remplacent celle récupérée auprès de votre fournisseur de connexion.",
          },
          { h: "Comment supprimer mon compte ?" },
          {
            p: "Utilisez l'option de suppression en bas de votre page de profil. Cela supprime votre profil, vos demandes d'hébergement et votre photo stockée. Voir notre [Politique de confidentialité](/privacy) pour les détails.",
          },
        ],
      },
      {
        heading: "Besoin d'aide ?",
        blocks: [
          {
            p: "Écrivez-nous via le [formulaire de contact](/contact), nous répondons sous 48 heures.",
          },
        ],
      },
    ],
  },

  terms: {
    title: "Conditions d'utilisation",
    intro:
      "Les présentes conditions d'utilisation (« Conditions ») régissent votre accès et votre utilisation d'Ohel Avraham (la « Plateforme »), qui met en relation des personnes proposant une table pour Chabbat (« Hôtes ») et des personnes en cherchant une (« Invités »). En créant un compte ou en utilisant la Plateforme, vous acceptez ces Conditions.",
    sections: [
      {
        heading: "1. Admissibilité",
        blocks: [
          {
            p: "Vous devez avoir au moins 18 ans et être en mesure de conclure un accord contraignant pour utiliser la Plateforme. Vous êtes responsable de l'exactitude des informations de votre profil et de leur mise à jour.",
          },
        ],
      },
      {
        heading: "2. Rôle de la Plateforme",
        blocks: [
          {
            p: "Ohel Avraham est un service de mise en relation. Nous n'organisons pas de repas, ne vérifions pas l'identité de chaque utilisateur, n'inspectons pas les domiciles et ne supervisons pas la cacherout. Toute rencontre ou tout arrangement d'hébergement se fait directement entre l'Hôte et l'Invité, à leur seule discrétion et à leurs risques. Nous ne sommes pas partie à ces arrangements.",
          },
        ],
      },
      {
        heading: "3. Comportement des utilisateurs",
        blocks: [
          {
            ul: [
              "Fournir des informations de profil et de contact véridiques.",
              "Traiter les autres utilisateurs avec respect ; le harcèlement, les propos haineux et la discrimination ne sont pas tolérés.",
              "Ne pas utiliser la Plateforme à des fins de démarchage commercial ni à des fins illégales.",
              "Ne pas détourner les informations personnelles des autres utilisateurs, y compris les adresses partagées pour organiser une visite.",
            ],
          },
        ],
      },
      {
        heading: "4. Contenu que vous fournissez",
        blocks: [
          {
            p: "Vous conservez la propriété des textes et images que vous téléversez. Vous accordez à Ohel Avraham une licence limitée pour stocker et afficher ce contenu sur la Plateforme aux fins de l'exploitation du service. Vous devez détenir les droits sur toute image téléversée.",
          },
        ],
      },
      {
        heading: "5. Sécurité",
        blocks: [
          {
            p: "Vous êtes seul responsable de vos décisions concernant les personnes que vous rencontrez et que vous hébergez. Faites preuve de bon sens, rencontrez de nouveaux contacts avec prudence et interrompez toute interaction qui vous met mal à l'aise. Signalez tout problème via le [formulaire de contact](/contact).",
          },
        ],
      },
      {
        heading: "6. Suspension et résiliation",
        blocks: [
          {
            p: "Nous pouvons suspendre ou supprimer tout compte qui enfreint ces Conditions ou dont nous estimons raisonnablement qu'il met d'autres utilisateurs en danger. Vous pouvez supprimer votre compte à tout moment depuis votre page de profil.",
          },
        ],
      },
      {
        heading: "7. Exclusions et limitation de responsabilité",
        blocks: [
          {
            p: "La Plateforme est fournie « en l'état », sans garantie d'aucune sorte. Dans toute la mesure permise par la loi, Ohel Avraham n'est pas responsable des dommages indirects, accessoires ou consécutifs, ni du comportement d'un utilisateur, découlant de votre utilisation de la Plateforme.",
          },
        ],
      },
      {
        heading: "8. Modifications",
        blocks: [
          {
            p: "Nous pouvons modifier ces Conditions de temps à autre. Les changements importants seront annoncés sur la Plateforme. Continuer à utiliser la Plateforme après une modification vaut acceptation des Conditions mises à jour.",
          },
        ],
      },
      {
        heading: "9. Contact",
        blocks: [
          {
            p: "Les questions relatives à ces Conditions peuvent être envoyées via le [formulaire de contact](/contact).",
          },
        ],
      },
    ],
  },

  privacy: {
    title: "Politique de confidentialité",
    intro:
      "La présente politique de confidentialité explique quelles informations personnelles Ohel Avraham (la « Plateforme ») collecte, comment nous les utilisons et les choix dont vous disposez.",
    sections: [
      {
        heading: "1. Informations que nous collectons",
        blocks: [
          {
            ul: [
              "Informations de compte : nom, adresse e-mail et photo de profil (téléversée par vous ou importée depuis Google lors d'une connexion Google).",
              "Informations de profil : date de naissance, région ou adresse, numéro de téléphone (hôtes), secteur, origine, niveau de cacherout, informations d'accessibilité et notes éventuelles.",
              "Informations d'activité : demandes d'hébergement envoyées ou reçues et messages envoyés via le formulaire de contact.",
              "Informations techniques : données de journalisation de base nécessaires au fonctionnement et à la sécurité du service.",
            ],
          },
        ],
      },
      {
        heading: "2. Utilisation de vos informations",
        blocks: [
          {
            ul: [
              "Créer votre compte et présenter votre profil aux utilisateurs compatibles.",
              "Permettre aux hôtes et aux invités de se trouver et d'organiser une visite pour Chabbat.",
              "Envoyer des e-mails transactionnels, comme les notifications de demande et les codes de vérification.",
              "Répondre à vos demandes et assurer la sécurité de la Plateforme.",
            ],
          },
        ],
      },
      {
        heading: "3. Ce que voient les autres utilisateurs",
        blocks: [
          {
            p: "Votre prénom, votre photo, votre ville et les informations générales de votre profil sont visibles par les autres utilisateurs connectés. Votre adresse exacte et votre numéro de téléphone ne sont communiqués à un invité qu'après acceptation de sa demande. Les pages de recherche publiques n'affichent qu'une position approximative, jamais votre adresse précise.",
          },
        ],
      },
      {
        heading: "4. Prestataires de services",
        blocks: [
          {
            p: "Nous faisons appel à des tiers pour exploiter la Plateforme, notamment [Convex](https://www.convex.dev) (base de données et stockage de fichiers), [Resend](https://resend.com) (envoi d'e-mails) et Google (connexion et cartes). Ces prestataires traitent les données uniquement pour notre compte et conformément à leurs propres engagements de sécurité.",
          },
        ],
      },
      {
        heading: "5. Cookies",
        blocks: [
          {
            p: "Nous utilisons des cookies strictement nécessaires au fonctionnement du site, ainsi que des cookies tiers de Google lorsque vous utilisez la connexion ou la carte. Nous n'utilisons pas de cookies publicitaires ou de mesure d'audience. Voir notre [Politique relative aux cookies](/cookies) pour la liste complète et vos choix.",
          },
        ],
      },
      {
        heading: "6. Conservation des données",
        blocks: [
          {
            p: "Nous conservons vos informations tant que votre compte est actif. Lorsque vous supprimez votre compte, nous supprimons votre profil, vos demandes d'hébergement et votre photo de profil stockée. Certaines données peuvent être conservées brièvement lorsque la sécurité ou la loi l'exige.",
          },
        ],
      },
      {
        heading: "7. Vos choix",
        blocks: [
          {
            ul: [
              "Mettre à jour ou corriger votre profil à tout moment depuis votre page de profil.",
              "Remplacer ou supprimer votre photo de profil depuis votre page de profil.",
              "Supprimer votre compte, et les données décrites ci-dessus, depuis votre page de profil.",
            ],
          },
        ],
      },
      {
        heading: "8. Enfants",
        blocks: [
          {
            p: "La Plateforme n'est pas destinée aux personnes de moins de 18 ans, et nous ne collectons pas sciemment d'informations auprès d'enfants.",
          },
        ],
      },
      {
        heading: "9. Modifications",
        blocks: [
          {
            p: "Nous pouvons mettre à jour cette politique de temps à autre. Les changements importants seront annoncés sur la Plateforme.",
          },
        ],
      },
      {
        heading: "10. Contact",
        blocks: [
          {
            p: "Pour toute question sur vos données ou cette politique, contactez-nous via le [formulaire de contact](/contact).",
          },
        ],
      },
    ],
  },

  cookies: {
    title: "Politique relative aux cookies",
    intro:
      "Cette politique explique comment Ohel Avraham utilise les cookies et technologies similaires, et comment vous pouvez les contrôler.",
    sections: [
      {
        heading: "Qu'est-ce qu'un cookie ?",
        blocks: [
          {
            p: "Les cookies sont de petits fichiers texte stockés sur votre appareil par votre navigateur. Ils permettent à un site de mémoriser des informations sur votre visite, comme votre langue ou le fait que vous êtes connecté.",
          },
        ],
      },
      {
        heading: "Cookies que nous utilisons",
        blocks: [
          { h: "Strictement nécessaires (toujours actifs)" },
          {
            p: "Ils sont indispensables au fonctionnement du site et ne peuvent pas être désactivés.",
          },
          {
            ul: [
              "lang — mémorise la langue de l'interface.",
              "Cookies d'authentification — maintiennent votre session active lorsque vous êtes connecté.",
              "cookie_consent — mémorise votre choix en matière de cookies pour ne plus vous le redemander.",
            ],
          },
          { h: "Tiers (Google)" },
          {
            p: "Lorsque vous vous connectez avec Google ou utilisez la carte interactive, Google peut déposer ses propres cookies sur ses domaines. Ils sont régis par les politiques de confidentialité et de cookies de Google.",
          },
        ],
      },
      {
        heading: "Publicité et mesure d'audience",
        blocks: [
          {
            p: "Nous n'utilisons pas de cookies publicitaires ni de cookies de mesure d'audience tiers.",
          },
        ],
      },
      {
        heading: "Gérer vos choix",
        blocks: [
          {
            p: "Lors de votre première visite, vous pouvez accepter tous les cookies ou ne conserver que les cookies nécessaires. Vous pouvez modifier votre choix à tout moment via « Paramètres des cookies » dans le pied de page. Vous pouvez aussi supprimer ou bloquer les cookies dans les réglages de votre navigateur, mais le site peut ne pas fonctionner correctement sans les cookies strictement nécessaires.",
          },
        ],
      },
      {
        heading: "Modifications",
        blocks: [
          {
            p: "Nous pouvons mettre à jour cette politique de temps à autre. Les changements importants seront annoncés sur la Plateforme.",
          },
        ],
      },
      {
        heading: "Contact",
        blocks: [
          {
            p: "Les questions relatives aux cookies peuvent être envoyées via le [formulaire de contact](/contact).",
          },
        ],
      },
    ],
  },
};

const he: LegalContent = {
  lastUpdated: "עודכן לאחרונה",
  updatedDate: "2 בספטמבר 2026",

  help: {
    title: "עזרה ושאלות נפוצות",
    intro:
      "אוהל אברהם מחבר בין מארחים לאורחים לשבת בכל רחבי ישראל. להלן השאלות הנפוצות ביותר. אם לא מצאתם תשובה, [צרו קשר](/contact).",
    sections: [
      {
        heading: "צעדים ראשונים",
        blocks: [
          { h: "איך יוצרים חשבון?" },
          {
            p: "הירשמו עם כתובת האימייל שלכם או עם חשבון Google מתוך [דף ההרשמה](/sign-up). לאחר אימות האימייל תמלאו פרופיל קצר ותבחרו אם ברצונכם לארח, להיות אורחים, או שניהם.",
          },
          { h: "אילו פרטים צריך למסור?" },
          {
            p: "אורחים מוסרים אזור, מגזר, עדה וכמה העדפות. מארחים מוסרים בנוסף כתובת, רמת כשרות ופרטי נגישות, כדי שאורחים ימצאו שולחן שמתאים להם.",
          },
        ],
      },
      {
        heading: "אירוח",
        blocks: [
          { h: "מי רואה את הכתובת שלי?" },
          {
            p: "הכתובת המדויקת נחשפת לאורח רק לאחר שאתם מאשרים את בקשתו. בחיפוש הציבורי מוצג מיקום מקורב על המפה ושם היישוב בלבד.",
          },
          { h: "איך משהים אירוח?" },
          {
            p: "פתחו את הפרופיל וכבו את הזמינות שלכם כמארחים. תישארו רשומים אך לא תופיעו כזמינים לבקשות חדשות.",
          },
        ],
      },
      {
        heading: "בקשות",
        blocks: [
          { h: "איך פועלת בקשה?" },
          {
            p: "אורח שולח בקשת אירוח לשבת מסוימת. המארח מקבל אימייל ויכול לאשר או לדחות. שני הצדדים מקבלים הודעה על התוצאה, והאורח יכול לבטל בקשה כל עוד היא בהמתנה.",
          },
        ],
      },
      {
        heading: "חשבון ופרטיות",
        blocks: [
          { h: "איך משנים תמונה או שם?" },
          {
            p: "ערכו אותם מדף הפרופיל. תמונה שאתם מעלים מחליפה את זו שיובאה מספק ההתחברות.",
          },
          { h: "איך מוחקים חשבון?" },
          {
            p: "השתמשו באפשרות המחיקה בתחתית דף הפרופיל. פעולה זו מוחקת את הפרופיל, את בקשות האירוח ואת התמונה השמורה. לפרטים ראו את [מדיניות הפרטיות](/privacy).",
          },
        ],
      },
      {
        heading: "עדיין צריכים עזרה?",
        blocks: [
          {
            p: "פנו אלינו דרך [טופס יצירת הקשר](/contact) ונחזור אליכם תוך 48 שעות.",
          },
        ],
      },
    ],
  },

  terms: {
    title: "תנאי שימוש",
    intro:
      "תנאי שימוש אלה („התנאים”) חלים על הגישה שלכם לאוהל אברהם („הפלטפורמה”) ועל השימוש בה. הפלטפורמה מחברת בין אנשים שמציעים שולחן לשבת („מארחים”) לבין אנשים שמחפשים שולחן („אורחים”). ביצירת חשבון או בשימוש בפלטפורמה אתם מסכימים לתנאים אלה.",
    sections: [
      {
        heading: "1. כשירות",
        blocks: [
          {
            p: "עליכם להיות בני 18 לפחות ובעלי כשירות משפטית להתקשר בהסכם מחייב כדי להשתמש בפלטפורמה. אתם אחראים לדיוק הפרטים בפרופיל ולעדכונם.",
          },
        ],
      },
      {
        heading: "2. תפקיד הפלטפורמה",
        blocks: [
          {
            p: "אוהל אברהם הוא שירות היכרות בלבד. איננו מארחים ארוחות, אין באפשרותנו לאמת את זהות כל משתמש, איננו בודקים בתים ואיננו מפקחים על כשרות. כל מפגש או הסדר אירוח נעשה ישירות בין המארח לאורח, על דעתם ובאחריותם בלבד. איננו צד להסדרים אלה.",
          },
        ],
      },
      {
        heading: "3. התנהגות משתמשים",
        blocks: [
          {
            ul: [
              "למסור פרטי פרופיל ויצירת קשר נכונים.",
              "לנהוג בכבוד כלפי משתמשים אחרים; הטרדה, הסתה ואפליה אסורות.",
              "לא להשתמש בפלטפורמה לשיווק מסחרי או לכל מטרה בלתי חוקית.",
              "לא לעשות שימוש לרעה בפרטים אישיים של משתמשים אחרים, לרבות כתובות שנמסרו לצורך תיאום ביקור.",
            ],
          },
        ],
      },
      {
        heading: "4. תוכן שאתם מספקים",
        blocks: [
          {
            p: "אתם שומרים על הבעלות בטקסטים ובתמונות שאתם מעלים. אתם מעניקים לאוהל אברהם רישיון מוגבל לאחסן ולהציג תוכן זה בפלטפורמה לצורך הפעלת השירות. עליכם להחזיק בזכויות לכל תמונה שאתם מעלים.",
          },
        ],
      },
      {
        heading: "5. בטיחות",
        blocks: [
          {
            p: "האחריות על ההחלטות את מי לפגוש ואת מי לארח היא עליכם בלבד. הפעילו שיקול דעת, היפגשו עם אנשים חדשים בזהירות, והפסיקו כל אינטראקציה שגורמת לכם לאי-נוחות. דווחו על חשש דרך [טופס יצירת הקשר](/contact).",
          },
        ],
      },
      {
        heading: "6. השעיה וסיום",
        blocks: [
          {
            p: "אנו רשאים להשעות או להסיר כל חשבון שמפר תנאים אלה או שלדעתנו הסבירה מסכן משתמשים אחרים. תוכלו למחוק את חשבונכם בכל עת מדף הפרופיל.",
          },
        ],
      },
      {
        heading: "7. הסרת אחריות והגבלתה",
        blocks: [
          {
            p: "הפלטפורמה מסופקת „AS IS”, ללא אחריות מכל סוג. במידה המרבית המותרת בדין, אוהל אברהם אינו אחראי לכל נזק עקיף, מקרי או תוצאתי, או להתנהגותו של משתמש כלשהו, הנובעים מהשימוש שלכם בפלטפורמה.",
          },
        ],
      },
      {
        heading: "8. שינויים",
        blocks: [
          {
            p: "אנו רשאים לעדכן תנאים אלה מעת לעת. שינויים מהותיים יפורסמו בפלטפורמה. המשך השימוש לאחר שינוי מהווה הסכמה לתנאים המעודכנים.",
          },
        ],
      },
      {
        heading: "9. יצירת קשר",
        blocks: [
          {
            p: "שאלות בנוגע לתנאים אלה ניתן לשלוח דרך [טופס יצירת הקשר](/contact).",
          },
        ],
      },
    ],
  },

  privacy: {
    title: "מדיניות פרטיות",
    intro:
      "מדיניות פרטיות זו מסבירה אילו פרטים אישיים אוהל אברהם („הפלטפורמה”) אוסף, כיצד אנו משתמשים בהם ואילו אפשרויות עומדות לרשותכם.",
    sections: [
      {
        heading: "1. מידע שאנו אוספים",
        blocks: [
          {
            ul: [
              "פרטי חשבון: שם, כתובת אימייל ותמונת פרופיל (שהעליתם או שיובאה מ-Google בעת התחברות עם Google).",
              "פרטי פרופיל: תאריך לידה, אזור או כתובת, מספר טלפון (מארחים), מגזר, עדה, רמת כשרות, פרטי נגישות והערות שתוסיפו.",
              "פרטי פעילות: בקשות אירוח ששלחתם או קיבלתם והודעות ששלחתם דרך טופס יצירת הקשר.",
              "מידע טכני: נתוני יומן בסיסיים הדרושים להפעלת השירות ולאבטחתו.",
            ],
          },
        ],
      },
      {
        heading: "2. כיצד אנו משתמשים במידע",
        blocks: [
          {
            ul: [
              "ליצור את חשבונכם ולהציג את הפרופיל למשתמשים מתאימים.",
              "לאפשר למארחים ולאורחים למצוא זה את זה ולתאם ביקור לשבת.",
              "לשלוח אימיילים תפעוליים, כגון הודעות על בקשות וקודי אימות.",
              "להשיב לפניותיכם ולשמור על בטיחות הפלטפורמה.",
            ],
          },
        ],
      },
      {
        heading: "3. מה משתמשים אחרים רואים",
        blocks: [
          {
            p: "השם הפרטי, התמונה, היישוב ופרטי הפרופיל הכלליים שלכם גלויים למשתמשים מחוברים אחרים. הכתובת המדויקת ומספר הטלפון נמסרים לאורח רק לאחר שאישרתם את בקשתו. דפי החיפוש הציבוריים מציגים מיקום מקורב בלבד, לעולם לא את הכתובת המדויקת.",
          },
        ],
      },
      {
        heading: "4. ספקי שירות",
        blocks: [
          {
            p: "אנו נעזרים בצדדים שלישיים להפעלת הפלטפורמה, ובהם [Convex](https://www.convex.dev) (מסד נתונים ואחסון קבצים), [Resend](https://resend.com) (משלוח אימייל) ו-Google (התחברות ומפות). ספקים אלה מעבדים נתונים אך ורק בשמנו ובהתאם להתחייבויות האבטחה שלהם.",
          },
        ],
      },
      {
        heading: "5. עוגיות",
        blocks: [
          {
            p: "אנו משתמשים בעוגיות הכרחיות בלבד להפעלת האתר, וכן בעוגיות צד שלישי של Google בעת שימוש בהתחברות או במפה. איננו משתמשים בעוגיות פרסום או אנליטיקה. ראו את [מדיניות העוגיות](/cookies) לרשימה המלאה ולאפשרויות שלכם.",
          },
        ],
      },
      {
        heading: "6. שמירת נתונים",
        blocks: [
          {
            p: "אנו שומרים את המידע כל עוד חשבונכם פעיל. עם מחיקת החשבון אנו מוחקים את הפרופיל, את בקשות האירוח ואת תמונת הפרופיל השמורה. חלק מהרשומות עשויות להישמר לזמן קצר כאשר הדבר נדרש מטעמי אבטחה או חוק.",
          },
        ],
      },
      {
        heading: "7. האפשרויות שלכם",
        blocks: [
          {
            ul: [
              "לעדכן או לתקן את הפרופיל בכל עת מדף הפרופיל.",
              "להחליף או להסיר את תמונת הפרופיל מדף הפרופיל.",
              "למחוק את החשבון, ואת הנתונים שתוארו לעיל, מדף הפרופיל.",
            ],
          },
        ],
      },
      {
        heading: "8. קטינים",
        blocks: [
          {
            p: "הפלטפורמה אינה מיועדת למי שגילו נמוך מ-18, ואיננו אוספים ביודעין מידע מקטינים.",
          },
        ],
      },
      {
        heading: "9. שינויים",
        blocks: [
          {
            p: "אנו רשאים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו בפלטפורמה.",
          },
        ],
      },
      {
        heading: "10. יצירת קשר",
        blocks: [
          {
            p: "לכל שאלה על הנתונים שלכם או על מדיניות זו, צרו קשר דרך [טופס יצירת הקשר](/contact).",
          },
        ],
      },
    ],
  },

  cookies: {
    title: "מדיניות עוגיות",
    intro:
      "מדיניות זו מסבירה כיצד אוהל אברהם משתמש בעוגיות ובטכנולוגיות דומות, וכיצד תוכלו לשלוט בהן.",
    sections: [
      {
        heading: "מהן עוגיות?",
        blocks: [
          {
            p: "עוגיות הן קבצי טקסט קטנים שנשמרים במכשירכם על ידי הדפדפן. הן מאפשרות לאתר לזכור פרטים על הביקור שלכם, כגון השפה או העובדה שאתם מחוברים.",
          },
        ],
      },
      {
        heading: "עוגיות שבהן אנו משתמשים",
        blocks: [
          { h: "הכרחיות (פעילות תמיד)" },
          { p: "הן חיוניות לתפקוד האתר ולא ניתן לכבות אותן." },
          {
            ul: [
              "lang — זוכרת את שפת הממשק.",
              "עוגיות אימות — שומרות על הפעלת החשבון כשאתם מחוברים.",
              "cookie_consent — זוכרת את בחירת העוגיות שלכם כדי לא לשאול שוב.",
            ],
          },
          { h: "צד שלישי (Google)" },
          {
            p: "כשאתם מתחברים עם Google או משתמשים במפה האינטראקטיבית, Google עשויה להגדיר עוגיות משלה בדומיינים שלה. אלה כפופות למדיניות הפרטיות והעוגיות של Google.",
          },
        ],
      },
      {
        heading: "פרסום ואנליטיקה",
        blocks: [
          { p: "איננו משתמשים בעוגיות פרסום או בעוגיות אנליטיקה של צד שלישי." },
        ],
      },
      {
        heading: "ניהול הבחירות שלכם",
        blocks: [
          {
            p: "בביקור הראשון תוכלו לאשר את כל העוגיות או להשאיר רק את ההכרחיות. תוכלו לשנות את בחירתכם בכל עת דרך „הגדרות עוגיות” בכותרת התחתונה. תוכלו גם למחוק או לחסום עוגיות בהגדרות הדפדפן, אך ייתכן שהאתר לא יפעל כראוי ללא העוגיות ההכרחיות.",
          },
        ],
      },
      {
        heading: "שינויים",
        blocks: [
          {
            p: "אנו רשאים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו בפלטפורמה.",
          },
        ],
      },
      {
        heading: "יצירת קשר",
        blocks: [
          {
            p: "שאלות בנוגע לעוגיות ניתן לשלוח דרך [טופס יצירת הקשר](/contact).",
          },
        ],
      },
    ],
  },
};

export const legalContent: Record<Language, LegalContent> = { en, fr, he };
