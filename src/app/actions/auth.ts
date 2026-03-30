"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const user = formData.get("user");
    const password = formData.get("password");

    const ADMIN_USER = process.env.ADMIN_USER || "user";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gaceta20!26ADMIN";

    if (user === ADMIN_USER && password === ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set("auth_session", "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        redirect("/");
    } else {
        throw new Error("Credenciales inválidas");
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_session");
    redirect("/login");
}
