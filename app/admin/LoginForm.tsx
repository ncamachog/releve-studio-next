"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form className="ad-login" action={action}>
      <p className="ad-login__brand">Relevé</p>
      <h1>Panel de administración</h1>
      <input type="password" name="password" placeholder="Contraseña" autoComplete="current-password" required autoFocus />
      {state?.error && <p className="ad-error">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Entrando…" : "Entrar"}</button>
    </form>
  );
}
