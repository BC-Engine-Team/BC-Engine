import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // detect user language
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        // here are all the translations
        resources: {
            en: {
                translation: {
                    login: {
                        form: {
                            Password: 'Password',
                            EmailAddress: 'Email Address'
                        },
                        error: {
                            Empty: 'This field cannot be empty!',
                            Incorrect: 'Incorrect email or password.',
                            NotFound: 'Could not reach B&C Engine...'
                        }
                    },
                    dashboard: {
                        criteria: {
                            NamePlaceHolder: 'Enter Chart Report Name',
                            LoadChartButton: 'Load Chart'
                        },
                        chart: {
                            Title: 'Average Collection Days over Time',
                            YAxisLabel: 'Days',
                            XAxisLabel: 'Months',
                            months: {
                                Jan: 'January',
                                Feb: 'February',
                                Mar: 'March',
                                Apr: 'April',
                                May: 'May',
                                Jun: 'June',
                                Jul: 'July',
                                Aug: 'August',
                                Sep: 'September',
                                Oct: 'October',
                                Nov: 'November',
                                Dec: 'December'
                            },
                            FallbackLegendLabel: 'Waiting for data...'
                        }
                    }
                }
            },
            fr: {
                translation: {
                    login: {
                        form: {
                            Password: 'Mot de passe',
                            EmailAddress: 'Addresse Couriel'
                        },
                        error: {
                            Empty: 'Ce champs doit être rempli!',
                            Incorrect: 'Address couriel ou mot de passe invalide.',
                            NotFound: "Impossible d'atteindre B&C Engine..."
                        }
                    },
                    dashboard: {
                        criteria: {
                            NamePlaceHolder: 'Entrez le nom de votre Rapport Graphique',
                            LoadChartButton: 'Mettre à jour le Graphique'
                        },
                        chart: {
                            Title: 'Moyenne de Jour de Collection par Mois',
                            YAxisLabel: 'Jours',
                            XAxisLabel: 'Mois',
                            months: {
                                Jan: 'Janvier',
                                Feb: 'Février',
                                Mar: 'Mars',
                                Apr: 'Avril',
                                May: 'Mai',
                                Jun: 'Juin',
                                Jul: 'Juillet',
                                Aug: 'Août',
                                Sep: 'Septembre',
                                Oct: 'Octobre',
                                Nov: 'Novembre',
                                Dec: 'Decembre'
                            },
                            FallbackLegendLabel: 'En attente des données...'
                        }
                    }
                }
            }
        }
    });

export default i18n;