import { promises as fs } from "node:fs";
import path from "node:path";

const AUDIT_FILE_PATH = path.join(process.cwd(), "data", "audit", "enrollment-actions.log");

type AuditEvent = {
  action: string;
  actorId?: string;
  actorEmail?: string;
  enrollmentId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
};

export async function writeAuditEvent(event: Omit<AuditEvent, "createdAt">): Promise<void> {
  const line = `${JSON.stringify({ ...event, createdAt: new Date().toISOString() })}\n`;
  await fs.mkdir(path.dirname(AUDIT_FILE_PATH), { recursive: true });
  await fs.appendFile(AUDIT_FILE_PATH, line, "utf8");
}
