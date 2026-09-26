import { readList, writeList } from "@/lib/store";

export interface Message {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
}

const KEY = "messages";

export const listMessages = () => readList<Message>(KEY);

export async function addMessage(input: { name?: unknown; email?: unknown; phone?: unknown; message?: unknown; website?: unknown }): Promise<{ ok: true } | { ok: false; error: string }> {
  if (input.website) return { ok: false, error: "No se pudo procesar la solicitud." };
  const name = String(input.name ?? "").trim().slice(0, 120);
  const email = String(input.email ?? "").trim().slice(0, 120);
  const phone = String(input.phone ?? "").replace(/[^0-9+ ]/g, "").slice(0, 40);
  const message = String(input.message ?? "").trim().slice(0, 2000);
  if (name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length < 3) {
    return { ok: false, error: "Revisa tu nombre, correo y mensaje." };
  }
  const all = await listMessages();
  all.unshift({ id: Math.random().toString(36).slice(2, 10), createdAt: new Date().toISOString(), name, email, phone, message, read: false });
  await writeList(KEY, all.slice(0, 500));
  return { ok: true };
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  await writeList(KEY, (await listMessages()).map((m) => (m.id === id ? { ...m, read } : m)));
}

export async function deleteMessage(id: string): Promise<void> {
  await writeList(KEY, (await listMessages()).filter((m) => m.id !== id));
}
