import { promises as fs } from "node:fs";
import path from "node:path";
import {
  DEFAULT_EMAIL_TEMPLATES,
  type EmailTemplateMap,
  type EmailTemplateStore,
  type EmailTemplateKind,
  type SupportedLocale,
} from "@/lib/enrollmentEmailTemplate";

const TEMPLATE_FILE_PATH = path.join(process.cwd(), "data", "enrollment-email-template.json");
const PLATFORM_NAME = "Online Deutschkurs mit Eliana";

function mergeLocaleTemplates(input: unknown, defaults: EmailTemplateMap): EmailTemplateMap {
  const source = typeof input === "object" && input ? (input as Partial<EmailTemplateMap>) : {};

  return {
    en: {
      subject: source.en?.subject?.trim() || defaults.en.subject,
      body: source.en?.body || defaults.en.body,
    },
    fr: {
      subject: source.fr?.subject?.trim() || defaults.fr.subject,
      body: source.fr?.body || defaults.fr.body,
    },
    de: {
      subject: source.de?.subject?.trim() || defaults.de.subject,
      body: source.de?.body || defaults.de.body,
    },
  };
}

function normalizeStore(input: unknown): EmailTemplateStore {
  if (input && typeof input === "object" && !Array.isArray(input)) {
    const record = input as Partial<EmailTemplateStore> & Partial<EmailTemplateMap>;

    if (record.enrollment || record.cancellation || record.payment) {
      return {
        enrollment: mergeLocaleTemplates(record.enrollment, DEFAULT_EMAIL_TEMPLATES.enrollment),
        cancellation: mergeLocaleTemplates(record.cancellation, DEFAULT_EMAIL_TEMPLATES.cancellation),
        payment: mergeLocaleTemplates(record.payment, DEFAULT_EMAIL_TEMPLATES.payment),
      };
    }

    return {
      enrollment: mergeLocaleTemplates(record, DEFAULT_EMAIL_TEMPLATES.enrollment),
      cancellation: mergeLocaleTemplates(DEFAULT_EMAIL_TEMPLATES.cancellation, DEFAULT_EMAIL_TEMPLATES.cancellation),
      payment: mergeLocaleTemplates(DEFAULT_EMAIL_TEMPLATES.payment, DEFAULT_EMAIL_TEMPLATES.payment),
    };
  }

  return DEFAULT_EMAIL_TEMPLATES;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function replaceTokens(template: string, tokenValues: Record<string, string>): string {
  let result = template;
  for (const [token, value] of Object.entries(tokenValues)) {
    result = result.replaceAll(token, value);
  }
  return result;
}

export async function getEmailTemplates(): Promise<EmailTemplateStore> {
  try {
    const raw = await fs.readFile(TEMPLATE_FILE_PATH, "utf8");
    return normalizeStore(JSON.parse(raw));
  } catch {
    return DEFAULT_EMAIL_TEMPLATES;
  }
}

export async function saveEmailTemplates(config: EmailTemplateStore): Promise<EmailTemplateStore> {
  const merged = normalizeStore(config);
  await fs.mkdir(path.dirname(TEMPLATE_FILE_PATH), { recursive: true });
  await fs.writeFile(TEMPLATE_FILE_PATH, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  return merged;
}

type BuildTemplateParams = {
  locale: string;
  firstName: string;
  lastName: string;
  courseTitle: string;
  startDate: string;
  scheduleDays: string;
  scheduleTime: string;
  price: string;
  paymentDate?: string;
};

type BuildTemplateKindParams = BuildTemplateParams & { kind: EmailTemplateKind };

export async function buildEmailContent(params: BuildTemplateKindParams): Promise<{ subject: string; html: string }> {
  const templates = await getEmailTemplates();
  const locale: SupportedLocale = params.locale === "fr" || params.locale === "de" ? params.locale : "en";
  const template = templates[params.kind][locale];

  const tokenValues: Record<string, string> = {
    "[student-first-name]": params.firstName,
    "[student-last-name]": params.lastName,
    "[student-full-name]": `${params.firstName} ${params.lastName}`.trim(),
    "[course-name]": params.courseTitle,
    "[course-start-date]": params.startDate,
    "[course-schedule-days]": params.scheduleDays,
    "[course-schedule-time]": params.scheduleTime,
    "[course-price]": params.price,
    "[payment-date]": params.paymentDate ?? params.startDate,
    "[platform-name]": PLATFORM_NAME,
  };

  const subject = replaceTokens(template.subject, tokenValues);
  const body = replaceTokens(template.body, tokenValues);

  const htmlBody = escapeHtml(body).replaceAll("\n", "<br />");
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb">
      <h2 style="color:#1a1a1a;margin-bottom:8px">${escapeHtml(subject)}</h2>
      <p style="color:#555;line-height:1.7;white-space:normal">${htmlBody}</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
      <p style="color:#999;font-size:12px">${escapeHtml(PLATFORM_NAME)} · Deutsch lernen mit Leidenschaft</p>
    </div>`;

  return { subject, html };
}
