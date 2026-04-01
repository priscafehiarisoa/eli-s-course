import nodemailer from "nodemailer";
import { buildEmailContent } from "@/lib/enrollmentEmailTemplate.server";

const SMTP_HOST = process.env.SMTP_HOST;
const isConfigured =
  !!SMTP_HOST &&
  SMTP_HOST !== "smtp.example.com" &&
  !!process.env.SMTP_USER &&
  !!process.env.SMTP_PASS;

function getTransporter() {
  if (!isConfigured) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = process.env.SMTP_FROM || `"Online Deutschkurs mit Eliana" <no-reply@online-deutschkurs-mit-eliana.de>`;

// ─── Enrollment confirmation ──────────────────────────────────────────────────

type EnrollmentEmailParams = {
  to: string;
  firstName: string;
  lastName: string;
  courseTitle: string;
  startDate: string; // formatted string e.g. "Dienstag, 1. April 2026"
  scheduleDays: string;
  scheduleTime: string;
  price: string;
  locale: string;
};

export async function sendEnrollmentConfirmation(params: EnrollmentEmailParams) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] SMTP not configured — skipping enrollment confirmation email.");
    return;
  }

  const { subject, html } = await buildEmailContent({
    kind: "enrollment",
    locale: params.locale,
    firstName: params.firstName,
    lastName: params.lastName,
    courseTitle: params.courseTitle,
    startDate: params.startDate,
    scheduleDays: params.scheduleDays,
    scheduleTime: params.scheduleTime,
    price: params.price,
  });

  await transporter.sendMail({
    from: FROM,
    to: params.to,
    subject,
    html,
  });
}

type CancellationEmailParams = {
  to: string;
  firstName: string;
  lastName: string;
  courseTitle: string;
  startDate: string;
  scheduleDays: string;
  scheduleTime: string;
  price: string;
  locale: string;
};

export async function sendEnrollmentCancellation(params: CancellationEmailParams) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] SMTP not configured — skipping cancellation email.");
    return;
  }

  const { subject, html } = await buildEmailContent({
    kind: "cancellation",
    locale: params.locale,
    firstName: params.firstName,
    lastName: params.lastName,
    courseTitle: params.courseTitle,
    startDate: params.startDate,
    scheduleDays: params.scheduleDays,
    scheduleTime: params.scheduleTime,
    price: params.price,
  });

  await transporter.sendMail({
    from: FROM,
    to: params.to,
    subject,
    html,
  });
}

// ─── Payment confirmation ─────────────────────────────────────────────────────

type PaymentEmailParams = {
  to: string;
  firstName: string;
  lastName: string;
  courseTitle: string;
  amount: string;
  paymentDate: string; // formatted
  locale: string;
};

export async function sendPaymentConfirmation(params: PaymentEmailParams) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] SMTP not configured — skipping payment confirmation email.");
    return;
  }
  const { subject, html } = await buildEmailContent({
    kind: "payment",
    locale: params.locale,
    firstName: params.firstName,
    lastName: params.lastName,
    courseTitle: params.courseTitle,
    startDate: params.paymentDate,
    scheduleDays: "",
    scheduleTime: "",
    price: params.amount,
    paymentDate: params.paymentDate,
  });

  await transporter.sendMail({
    from: FROM,
    to: params.to,
    subject,
    html,
  });
}
