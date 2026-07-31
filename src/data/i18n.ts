/**
 * BILINGUAL UI STRINGS.
 *
 * Ontario's French Language Services Act makes French-language service a requirement in
 * designated areas, and a municipal site is one of the first places a resident encounters
 * that. The strings here cover persistent UI chrome: navigation, labels, section headers,
 * everything structural that appears on every page regardless of content.
 *
 * Nav CATEGORY names are translated separately, in `categoryTranslations`, so the English
 * strings can stay as the stable keys the rest of the app looks things up by
 * (activeDesktopNav, expandedMobileCategory, siteStructure[...]) without that lookup logic
 * needing to know which language is active.
 *
 * An earlier version of this file translated the chrome and left everything else in English,
 * reasoning that nav sub-items and news content are CMS fields rather than template strings. The
 * reasoning was sound; the result was still a French page with English navigation contents,
 * English headlines, English table headers and an English search index. A resident does not care
 * which layer a string came from. Content now carries its own `{ en, fr }` pair alongside it —
 * see data/navigation.ts, data/feeds.ts and data/search.ts — which is exactly how a localized CMS
 * field behaves, and means there is no separate French site to drift out of sync.
 *
 * A fluent reviewer should QA every French string in this project before any of it reaches
 * production. It has not had that pass yet, it is disclosed in the accessibility statement's
 * known-issues section, and neither this comment nor that disclosure should be deleted until a
 * native speaker has actually read it.
 */

export const i18n = {
  en: {
    title: 'City of North Bay',
    cityOfLabel: 'City of',
    titleShort: 'North Bay',
    sso: 'My North Bay',
    heroHeading: 'How can we help?',
    iWantTo: 'I want to...',
    searchPrompt: "Or search 'Taxes', 'Permits'...",
    footerLand:
      'The City of North Bay is situated in the territory of the Robinson-Huron Treaty of 1850. We recognize that we are on the traditional territory of the Anishinaabeg peoples, specifically the Nipissing First Nation. We respect the history, languages, and cultures of the First Nations, Metis, Inuit, and all First Peoples of Canada, whose presence continues to enrich our vibrant community.',
    privacy: 'Privacy Policy',
    accessibility: 'Accessibility (AODA)',
    skipToContent: 'Skip to main content',
    searchLabel: 'Search this site',
    cityServices: 'City Services',
    recentNews: 'Recent News',
    allUpdates: 'View all news',
    featuredEvents: 'Featured Events',
    communityCalendar: 'View all events',
    municipalDashboard: 'Municipal Dashboard',
    municipalDashboardSub:
      'Explore data about City services, growth, infrastructure, finances and more through our interactive Municipal Dashboard.',
    exploreDashboard: 'Explore the Dashboard',
    followUs: 'Follow the City',
    contactUs: 'Contact Us',
    legal: 'Legal',
    careers: 'Careers',
    meetingRegistry: 'Public Meeting Registry',
    meetingRegistrySub: 'Access agendas, minutes, and livestreams for municipal proceedings.',
    filterLabel: 'Filter:',
    printLabel: 'Print',
    helpfulQuestion: 'Was this page helpful?',
    helpfulSub: "Your feedback helps us improve North Bay's digital services.",
    yesLabel: 'Yes',
    noLabel: 'No',
    urgentLabel: 'Urgent',
    topServices: 'Top Services',
    governmentFooter: 'Government',
    connectFooter: 'Connect',
    allRightsReserved: 'All rights reserved.',
    landAcknowledgement: 'Land Acknowledgement',
    winterConditionsTitle: 'Winter Road Conditions',
    parkingBanOn: 'Overnight Parking Ban: ON',
    parkingBanOff: 'Overnight Parking Ban: OFF',
    roadConditionsLabel: 'Roads',
    updatedLabel: 'Updated',
    winterConditionsLink: 'Full winter maintenance schedule',
    fireConditionsTitle: 'Fire Danger Rating',
    fireDangerLabel: 'Fire danger',
    fireBanLabel: 'Fire ban',
    fireBanYes: 'Yes',
    fireBanNo: 'No',
    fireLevelLow: 'Low',
    fireLevelMedium: 'Medium',
    fireLevelHigh: 'High',
    fireLevelExtreme: 'Extreme',
    fireConditionsLink: 'Fire safety and burn permits',
    conceptDisclaimer:
      'Unofficial redesign concept. Not affiliated with or endorsed by the City of North Bay.',
    topServicesFooter: 'Popular Pages',

    // Alert banner
    alertMessage: 'Main Street Revitalization Road Closures in effect until Aug 15.',
    alertLinkLabel: 'Detour Maps',

    // Mega menu
    directory: 'Directory',

    // Meeting registry
    colDateTime: 'Date & Time',
    colMeetingType: 'Meeting Type',
    colStatus: 'Status',
    colActions: 'Actions',
    agendaLabel: 'Agenda',
    watchLiveLabel: 'Watch Live',
    notYetAvailable: 'Not yet available',
    noMeetings: 'No meetings found for this filter.',
    meetingsCaption: 'Upcoming municipal meetings with agendas and livestream links',

    // Feedback
    thanksPositive: 'Thanks for letting us know this page helped.',
    thanksNegative: 'Thanks. What made this page hard to use?',
    feedbackPlaceholder: 'Optional: tell us more so we can fix it',
    feedbackNoteLabel: 'Tell us what made this page hard to use (optional)',
    sendFeedback: 'Send feedback',
    feedbackSent: 'Feedback sent. Thank you.',

    // Search
    searchNoResults: 'No exact matches. Press Enter to search all pages.',
    searchResultsFound: 'results found',
    searchOneResultFound: 'result found',

    // Task wizard
    wizardBusinessTitle: 'Start a Business Workflow',
    wizardReportTitle: 'Report an Issue',
    wizardStep: 'Step',
    wizardOf: 'of',
    wizardBack: 'Back',
    wizardContinue: 'Continue',
    wizardProceed: 'Proceed to Portal',
    wizardStep1Title: 'Step 1: Verify Zoning',
    wizardStep1Body: 'Ensure your proposed location is zoned for your specific business type.',
    wizardStep1Tip: 'Tip: Use the GIS Portal to look up zoning by address.',
    wizardStep2Title: 'Step 2: Prepare Documents',
    wizardStep2ItemA: 'Master Business License (Provincial)',
    wizardStep2ItemB: 'Floor Plan / Site Plan',
    wizardStep3Title: 'Step 3: Begin Application',
    wizardStep3Ready: 'Application Ready',

    // Accessibility statement
    a11yTitle: 'Accessibility Statement',
    a11yConformanceHeading: 'Conformance status',
    a11yConformanceBody:
      "This site targets WCAG 2.2 Level AA, one level above the WCAG 2.0 AA the City is required to meet under Ontario's Integrated Accessibility Standards Regulation (O. Reg. 191/11). This page is a partial conformance statement for a redesign in progress, not a final audit result.",
    a11yVerifiedHeading: "What's been verified",
    a11yVerified1:
      'Keyboard access to every menu, dialog, and control, including a true focus trap in modal dialogs',
    a11yVerified2: 'Visible focus indicators on every interactive element',
    a11yVerified3: 'A skip link and a proper landmark structure (header, nav, main, footer)',
    a11yVerified4: "Support for the operating system's reduced-motion preference",
    a11yVerified5:
      'Colour is never the only way information is conveyed (severity, urgency, and status all carry a text label alongside colour)',
    a11yVerified6:
      'Live search follows the WAI-ARIA combobox pattern, including arrow-key navigation between results',
    a11yKnownHeading: 'Known issues',
    a11yKnown1:
      'French translations have not yet had a review pass by a fluent speaker; the interface, navigation and content are translated, but the wording has not been professionally verified',
    a11yKnown2:
      "This is a demonstration build. Navigation and service links open the City's real pages on northbay.ca in a new tab; the page content shown here — news, events and meeting records — is illustrative and its own links do not resolve.",
    a11yFeedbackHeading: 'Feedback and accommodation requests',
    a11yFeedbackBody:
      'If any part of this site is difficult to use with assistive technology, contact the Customer Service Centre at',
    a11yFeedbackBody2:
      'Requests for information in an accessible format will be met in a timeframe that takes the request into account.',
    a11yReviewed: 'Last reviewed: July 2026.',
    closeDialog: 'Close dialog',
    opensOnCitySite: '(opens northbay.ca in a new tab)',
  },
  fr: {
    title: 'Ville de North Bay',
    cityOfLabel: 'Ville de',
    titleShort: 'North Bay',
    sso: 'Mon North Bay',
    heroHeading: 'Comment pouvons-nous vous aider?',
    iWantTo: 'Je veux...',
    searchPrompt: "Ou recherchez 'Impôts', 'Permis'...",
    footerLand:
      "La ville de North Bay est située sur le territoire du traité Robinson-Huron de 1850. Nous reconnaissons que nous sommes sur le territoire traditionnel des peuples Anishinaabeg, plus précisément la Première Nation de Nipissing. Nous respectons l'histoire, les langues et les cultures des Premières Nations, des Métis, des Inuits et de tous les Premiers Peuples du Canada, dont la présence continue d'enrichir notre communauté dynamique.",
    privacy: 'Politique de confidentialité',
    accessibility: 'Accessibilité (AODA)',
    skipToContent: 'Passer au contenu principal',
    searchLabel: 'Rechercher dans ce site',
    cityServices: 'Services municipaux',
    recentNews: 'Actualités récentes',
    allUpdates: 'Toutes les actualités',
    featuredEvents: 'Événements en vedette',
    communityCalendar: 'Tous les événements',
    municipalDashboard: 'Tableau de bord municipal',
    municipalDashboardSub:
      'Explorez les données sur les services municipaux, la croissance, les infrastructures, les finances et plus encore grâce à notre tableau de bord interactif.',
    exploreDashboard: 'Explorer le tableau de bord',
    followUs: 'Suivez la Ville',
    contactUs: 'Nous joindre',
    legal: 'Mentions légales',
    careers: 'Carrières',
    meetingRegistry: 'Registre des réunions publiques',
    meetingRegistrySub:
      'Consultez les ordres du jour, les procès-verbaux et la diffusion en direct des séances municipales.',
    filterLabel: 'Filtrer :',
    printLabel: 'Imprimer',
    helpfulQuestion: 'Cette page vous a-t-elle été utile?',
    helpfulSub: 'Vos commentaires nous aident à améliorer les services numériques de North Bay.',
    yesLabel: 'Oui',
    noLabel: 'Non',
    urgentLabel: 'Urgent',
    topServices: 'Principaux services',
    governmentFooter: 'Gouvernement',
    connectFooter: 'Coordonnées',
    allRightsReserved: 'Tous droits réservés.',
    landAcknowledgement: 'Reconnaissance territoriale',
    winterConditionsTitle: 'État des routes en hiver',
    parkingBanOn: 'Interdiction de stationner la nuit : ACTIVE',
    parkingBanOff: 'Interdiction de stationner la nuit : INACTIVE',
    roadConditionsLabel: 'Routes',
    updatedLabel: 'Mise à jour',
    winterConditionsLink: "Calendrier complet d'entretien hivernal",
    fireConditionsTitle: "Indice de danger d'incendie",
    fireDangerLabel: "Danger d'incendie",
    fireBanLabel: 'Interdiction de feu',
    fireBanYes: 'Oui',
    fireBanNo: 'Non',
    fireLevelLow: 'Faible',
    fireLevelMedium: 'Modéré',
    fireLevelHigh: 'Élevé',
    fireLevelExtreme: 'Extrême',
    fireConditionsLink: 'Sécurité incendie et permis de brûlage',
    conceptDisclaimer:
      'Concept de refonte non officiel. Sans affiliation avec la Ville de North Bay ni approbation de celle-ci.',
    topServicesFooter: 'Pages populaires',

    // Alert banner
    alertMessage:
      'Fermetures de routes pour la revitalisation de la rue Main en vigueur jusqu’au 15 août.',
    alertLinkLabel: 'Cartes des détours',

    // Mega menu
    directory: 'Répertoire',

    // Meeting registry
    colDateTime: 'Date et heure',
    colMeetingType: 'Type de réunion',
    colStatus: 'Statut',
    colActions: 'Actions',
    agendaLabel: 'Ordre du jour',
    watchLiveLabel: 'Diffusion en direct',
    notYetAvailable: 'Pas encore disponible',
    noMeetings: 'Aucune réunion ne correspond à ce filtre.',
    meetingsCaption:
      'Réunions municipales à venir, avec ordres du jour et liens de diffusion en direct',

    // Feedback
    thanksPositive: 'Merci de nous avoir indiqué que cette page vous a été utile.',
    thanksNegative: 'Merci. Qu’est-ce qui a rendu cette page difficile à utiliser?',
    feedbackPlaceholder: 'Facultatif : dites-nous-en plus afin que nous puissions corriger',
    feedbackNoteLabel: 'Dites-nous ce qui a rendu cette page difficile à utiliser (facultatif)',
    sendFeedback: 'Envoyer les commentaires',
    feedbackSent: 'Commentaires envoyés. Merci.',

    // Search
    searchNoResults:
      'Aucune correspondance exacte. Appuyez sur Entrée pour chercher dans tout le site.',
    searchResultsFound: 'résultats trouvés',
    searchOneResultFound: 'résultat trouvé',

    // Task wizard
    wizardBusinessTitle: 'Démarches pour démarrer une entreprise',
    wizardReportTitle: 'Signaler un problème',
    wizardStep: 'Étape',
    wizardOf: 'sur',
    wizardBack: 'Précédent',
    wizardContinue: 'Continuer',
    wizardProceed: 'Accéder au portail',
    wizardStep1Title: 'Étape 1 : vérifier le zonage',
    wizardStep1Body:
      'Assurez-vous que l’emplacement envisagé est zoné pour votre type d’entreprise.',
    wizardStep1Tip: 'Conseil : utilisez le portail SIG pour vérifier le zonage par adresse.',
    wizardStep2Title: 'Étape 2 : préparer les documents',
    wizardStep2ItemA: 'Licence d’entreprise principale (provinciale)',
    wizardStep2ItemB: 'Plan d’étage ou plan d’implantation',
    wizardStep3Title: 'Étape 3 : commencer la demande',
    wizardStep3Ready: 'Demande prête',

    // Accessibility statement
    a11yTitle: 'Déclaration d’accessibilité',
    a11yConformanceHeading: 'État de conformité',
    a11yConformanceBody:
      'Ce site vise le niveau AA des WCAG 2.2, soit un niveau au-dessus du niveau AA des WCAG 2.0 que la Ville doit respecter en vertu du Règlement sur les normes d’accessibilité intégrées de l’Ontario (Règl. de l’Ont. 191/11). Cette page est une déclaration de conformité partielle pour une refonte en cours, et non le résultat d’un audit final.',
    a11yVerifiedHeading: 'Ce qui a été vérifié',
    a11yVerified1:
      'Accès au clavier à tous les menus, dialogues et commandes, y compris un véritable piège de focus dans les dialogues modaux',
    a11yVerified2: 'Indicateurs de focus visibles sur tous les éléments interactifs',
    a11yVerified3:
      'Un lien d’évitement et une structure de repères appropriée (en-tête, navigation, contenu principal, pied de page)',
    a11yVerified4: 'Prise en charge de la préférence de mouvement réduit du système d’exploitation',
    a11yVerified5:
      'La couleur n’est jamais le seul moyen de transmettre l’information (gravité, urgence et statut sont toujours accompagnés d’un libellé texte)',
    a11yVerified6:
      'La recherche en direct suit le modèle de zone de liste déroulante WAI-ARIA, y compris la navigation par touches fléchées',
    a11yKnownHeading: 'Problèmes connus',
    a11yKnown1:
      'Les traductions françaises n’ont pas encore été révisées par une personne dont c’est la langue maternelle; l’interface, la navigation et le contenu sont traduits, mais la formulation n’a pas été vérifiée professionnellement',
    a11yKnown2:
      'Il s’agit d’une version de démonstration. Les liens de navigation et de services ouvrent les vraies pages de la Ville sur northbay.ca dans un nouvel onglet; le contenu présenté ici — actualités, événements et registres de réunions — est illustratif et ses propres liens ne mènent nulle part.',
    a11yFeedbackHeading: 'Commentaires et demandes d’adaptation',
    a11yFeedbackBody:
      'Si une partie de ce site est difficile à utiliser avec une technologie d’assistance, communiquez avec le Centre de service à la clientèle à',
    a11yFeedbackBody2:
      'Les demandes d’information dans un format accessible seront traitées dans un délai qui tient compte de la demande.',
    a11yReviewed: 'Dernière révision : juillet 2026.',
    closeDialog: 'Fermer le dialogue',
    opensOnCitySite: '(ouvre northbay.ca dans un nouvel onglet)',
  },
} as const;

/** The two languages the interface itself is available in. */
export type Language = keyof typeof i18n;

/**
 * Every key the English dictionary defines. Typing `t()` against this means a typo in a
 * lookup is a build error rather than a string that silently renders its own key name to a
 * resident. The `satisfies` check below makes a missing French translation a build error too.
 */
export type TranslationKey = keyof (typeof i18n)['en'];

// Compile-time parity check: if `fr` ever drifts from `en` — a key added to one and not the
// other — this line fails to typecheck. Cheaper than discovering it in production, where the
// symptom is a French page rendering a raw camelCase key.
const _frParity = i18n.fr satisfies Record<TranslationKey, string>;
void _frParity;

/** Nav category names, translated separately so the English name stays the lookup key. */
export const categoryTranslations = {
  en: {
    'Services & Payments': 'Services & Payments',
    Business: 'Business',
    'City Government': 'City Government',
    'Our Community': 'Our Community',
  },
  fr: {
    'Services & Payments': 'Services et paiements',
    Business: 'Entreprises',
    'City Government': 'Administration municipale',
    'Our Community': 'Notre communauté',
  },
} as const;

export type NavCategory = keyof (typeof categoryTranslations)['en'];

/** A piece of content available in both languages, e.g. a task label. */
export type LocalizedLabel = { readonly en: string; readonly fr: string };
