import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  // Clerk gerencia automaticamente o callback do SSO
  return <AuthenticateWithRedirectCallback />;
}

