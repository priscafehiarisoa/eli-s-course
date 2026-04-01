export type SupportedLocale = "en" | "fr" | "de";
export type EmailTemplateKind = "enrollment" | "cancellation" | "payment";

export type EmailTemplate = {
  subject: string;
  body: string;
};

export type EmailTemplateMap = Record<SupportedLocale, EmailTemplate>;
export type EmailTemplateStore = Record<EmailTemplateKind, EmailTemplateMap>;

const PLATFORM_NAME = "Online Deutschkurs mit Eliana";

export const ENROLLMENT_EMAIL_TOKENS = [
  "[student-first-name]",
  "[student-last-name]",
  "[student-full-name]",
  "[course-name]",
  "[course-start-date]",
  "[course-schedule-days]",
  "[course-schedule-time]",
  "[course-price]",
  "[payment-date]",
  "[platform-name]",
] as const;

export const EMAIL_TEMPLATE_KINDS: EmailTemplateKind[] = ["enrollment", "cancellation", "payment"];

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplateStore = {
  enrollment: {
    en: {
      subject: "Your enrollment is confirmed - [course-name]",
      body: [
        "Dear [student-full-name],",
        "",
        "Thank you for enrolling in [course-name].",
        "",
        "Here are your course details:",
        "- Start date: [course-start-date]",
        "- Schedule: [course-schedule-days], [course-schedule-time]",
        "- Price: [course-price]",
        "",
        "We look forward to seeing you!",
        "",
        "The [platform-name] team",
      ].join("\n"),
    },
    fr: {
      subject: "Votre inscription est confirmee - [course-name]",
      body: [
        "Cher(e) [student-full-name],",
        "",
        "Merci de vous etre inscrit(e) a [course-name].",
        "",
        "Details de votre cours :",
        "- Date de debut : [course-start-date]",
        "- Horaires : [course-schedule-days], [course-schedule-time]",
        "- Prix : [course-price]",
        "",
        "Nous avons hate de vous retrouver !",
        "",
        "L'equipe [platform-name]",
      ].join("\n"),
    },
    de: {
      subject: "Ihre Anmeldung ist bestaetigt - [course-name]",
      body: [
        "Liebe(r) [student-full-name],",
        "",
        "Vielen Dank fuer Ihre Anmeldung zu [course-name].",
        "",
        "Ihre Kursdetails:",
        "- Startdatum: [course-start-date]",
        "- Zeitplan: [course-schedule-days], [course-schedule-time]",
        "- Preis: [course-price]",
        "",
        "Wir freuen uns auf Sie!",
        "",
        "Das [platform-name]-Team",
      ].join("\n"),
    },
  },
  cancellation: {
    en: {
      subject: "Your enrollment has been cancelled - [course-name]",
      body: [
        "Dear [student-full-name],",
        "",
        "Your enrollment for [course-name] has been cancelled.",
        "",
        "If you have any questions, please contact us.",
        "",
        "The [platform-name] team",
      ].join("\n"),
    },
    fr: {
      subject: "Votre inscription a ete annulee - [course-name]",
      body: [
        "Cher(e) [student-full-name],",
        "",
        "Votre inscription a [course-name] a ete annulee.",
        "",
        "Si vous avez des questions, contactez-nous.",
        "",
        "L'equipe [platform-name]",
      ].join("\n"),
    },
    de: {
      subject: "Ihre Anmeldung wurde storniert - [course-name]",
      body: [
        "Liebe(r) [student-full-name],",
        "",
        "Ihre Anmeldung zu [course-name] wurde storniert.",
        "",
        "Bei Fragen kontaktieren Sie uns bitte.",
        "",
        "Das [platform-name]-Team",
      ].join("\n"),
    },
  },
  payment: {
    en: {
      subject: "Your payment has been confirmed - [course-name]",
      body: [
        "Dear [student-full-name],",
        "",
        "Your payment for [course-name] has been confirmed on [payment-date].",
        "",
        "Course details:",
        "- Start date: [course-start-date]",
        "- Schedule: [course-schedule-days], [course-schedule-time]",
        "- Price: [course-price]",
        "",
        "The [platform-name] team",
      ].join("\n"),
    },
    fr: {
      subject: "Votre paiement a ete confirme - [course-name]",
      body: [
        "Cher(e) [student-full-name],",
        "",
        "Votre paiement pour [course-name] a ete confirme le [payment-date].",
        "",
        "Details du cours :",
        "- Date de debut : [course-start-date]",
        "- Horaires : [course-schedule-days], [course-schedule-time]",
        "- Prix : [course-price]",
        "",
        "L'equipe [platform-name]",
      ].join("\n"),
    },
    de: {
      subject: "Ihre Zahlung wurde bestaetigt - [course-name]",
      body: [
        "Liebe(r) [student-full-name],",
        "",
        "Ihre Zahlung fuer [course-name] wurde am [payment-date] bestaetigt.",
        "",
        "Kursdetails:",
        "- Startdatum: [course-start-date]",
        "- Zeitplan: [course-schedule-days], [course-schedule-time]",
        "- Preis: [course-price]",
        "",
        "Das [platform-name]-Team",
      ].join("\n"),
    },
  },
};

