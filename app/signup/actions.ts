"use server";

import { redirect } from "next/navigation";

export async function signup(prevState: any, formData: FormData) {
  // Mock action for UI development.
  // The actual implementation would verify the device_id, create the user, and send an email to admin.
  const email = formData.get("email");
  const password = formData.get("password");
  const deviceId = formData.get("deviceId");
  const name = formData.get("name");

  if (!email || !password || !deviceId || !name) {
    return { error: "Semua field harus diisi" };
  }

  if (password.toString().length < 8) {
    return { error: "Password minimal 8 karakter" };
  }

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Redirect to a success/pending page or login
  redirect("/login?message=Menunggu persetujuan admin");
}
