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
                        Title: 'Login',
                        SubmitButton: 'Login'
                    },
                    user: {
                        table: {
                            AddButton: 'Add User',
                            Name: 'NAME',
                            Email: 'EMAIL',
                            Role: 'ROLE',
                            select: {
                                Default: 'Select User',
                                Admin: 'admin',
                                Employee: 'employee'
                            }
                        },
                        delete: {
                            NotAuthorized: 'You are not authorized to perform this action.',
                            Yes: 'Yes',
                            No: 'No',
                            Title: 'Are you sure you want to delete '
                        },
                        update: {
                            Title: 'Edit User',
                            Confirmation: 'Confirm modifications?',
                            FormSubmit: 'Save Changes'
                        },
                        create: {
                            Title: 'Add User',
                            Confirmation: 'Confirm creation?',
                            FormSubmit: 'Add'
                        },
                        error: {
                            InvalidEmailValidation: "Invalid email. Must end with 'benoit-cote.com'.",
                            InvalidPasswordValidation: 'Password must be at least 8 characters, contain 1 upper-case and 1 lower-case letter, and contain a number.',
                            MustSelectRoleValidation: 'Must select a role!',
                            InvalidEmailUpdate: 'Cannot recognize the email addres',
                            RequestFailedUpdate: 'Cannot send the request to modify the user'
                        },
                        GoBackButton: 'Go Back'
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
                    },
                    form: {
                        Password: 'Password',
                        ConfirmPassword: 'Confirm Password',
                        EmailAddress: 'Email Address',
                        Role: 'Role',
                        SubmitButton: 'Confirm'
                    },
                    error: {
                        Empty: 'This field cannot be empty!',
                        Incorrect: 'Incorrect email or password.',
                        NotFound: 'Could not reach B&C Engine...',
                        PasswordMatch: 'Password must match!'
                    },
                }
            },
            fr: {
                translation: {
                    login: {
                        Title: 'Connexion',
                        SubmitButton: 'Se Connecter'
                    },
                    user: {
                        table: {
                            AddButton: 'Ajouter un utilisateur',
                            Name: 'NOM',
                            Email: 'COURIEL',
                            Role: 'ROLE',
                            select: {
                                Default: 'Selectionner un role',
                                Admin: 'administrateur',
                                Employee: 'employé'
                            }
                        },
                        delete: {
                            NotAuthorized: "Vous n'ètes pas authoriser à performer cet action.",
                            Yes: 'Oui',
                            No: 'Non',
                            Title: 'Êtes-vous sur de vouloir supprimer '
                        },
                        update: {
                            Title: "Modifier l'utilisateur",
                            Confirmation: 'Confirmer les modifications?',
                            FormSubmit: 'Savegarder les modifications'
                        },
                        create: {
                            Title: 'Ajouter un utilisateur',
                            Confirmation: "Confirmer l'ajout?",
                            FormSubmit: 'Ajouter'
                        },
                        error: {
                            InvalidEmailValidation: "Addresse couriel invalide. Il doit commencer par 'benoit-cote.com'",
                            InvalidPasswordValidation: 'Mot de pass doit être au moins 8 charactères,  contenir 1 lettre majuscule et une lettre minuscule, et doit contenir un chiffre.',
                            MustSelectRoleValidation: 'Selectionez un role!',
                            InvalidEmailUpdate: "Incapable de reconnaître l'address couriel",
                            RequestFailedUpdate: "Incapable d'envoyer la requête pour modifier l'utilisateur"
                        },
                        GoBackButton: 'Précédent'
                    },
                    form : {
                        Password: 'Mot de passe',
                        ConfirmPassword: 'Confirmer le mot de passe',
                        EmailAddress: 'Addresse Couriel',
                        Role: 'Role',
                        SubmitButton: 'Confirmer'
                    },
                    error: {
                        Empty: 'Ce champs est obligatoire!',
                        Incorrect: 'Address couriel ou mot de passe invalide.',
                        NotFound: "Impossible d'atteindre B&C Engine...",
                        PasswordMatch: 'Les mots de passe ne correspondent pas!'
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