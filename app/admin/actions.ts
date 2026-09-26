"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin, login, logout } from "@/lib/auth";
import { deleteBookings, setBookingStatus, type Booking } from "@/lib/bookings";
import { deleteMessage, setMessageRead } from "@/lib/messages";

async function guard() {
  if (!(await isAdmin())) redirect("/admin");
}

export async function loginAction(_prev: { error: string } | null, formData: FormData): Promise<{ error: string }> {
  const ok = await login(String(formData.get("password") ?? ""));
  if (!ok) return { error: "Contraseña incorrecta." };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin");
}

export async function bookingStatusAction(formData: FormData) {
  await guard();
  await setBookingStatus(String(formData.get("ref")), String(formData.get("status")) as Booking["status"]);
  revalidatePath("/admin");
}

export async function bookingDeleteAction(formData: FormData) {
  await guard();
  await deleteBookings(String(formData.get("ref")));
  revalidatePath("/admin");
}

export async function messageReadAction(formData: FormData) {
  await guard();
  await setMessageRead(String(formData.get("id")), formData.get("read") === "1");
  revalidatePath("/admin");
}

export async function messageDeleteAction(formData: FormData) {
  await guard();
  await deleteMessage(String(formData.get("id")));
  revalidatePath("/admin");
}
