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
 * Deeper nav sub-items and the mock news/meetings/events content are left English-only on
 * purpose: in a real CMS those come from localized content fields an editor fills in per
 * page, not from strings hardcoded in a template. Pretending otherwise here would model the
 * problem wrongly.
 *
 * A fluent reviewer should QA every French string in this file before any of it reaches
 * production. It has not had that pass yet, and this comment should not be deleted until it has.
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
    breadcrumbHome: 'Home',
    breadcrumbDashboard: 'Government Dashboard',
    breadcrumbCurrent: 'Public Overview',
    civicUpdates: 'Civic Updates',
    allUpdates: 'All Updates',
    upcomingEvents: 'Upcoming Events',
    communityCalendar: 'Community Calendar',
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
    breadcrumbHome: 'Accueil',
    breadcrumbDashboard: 'Tableau de bord municipal',
    breadcrumbCurrent: 'Aperçu public',
    civicUpdates: 'Mises à jour civiques',
    allUpdates: 'Toutes les mises à jour',
    upcomingEvents: 'Événements à venir',
    communityCalendar: 'Calendrier communautaire',
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
