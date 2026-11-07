import { SiteHeader } from "@/components/site-header";
import { SignInForm } from "./sign-in-form";

export const metadata = { title: "Sign in · oenodPay" };

export default function SignInPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-md px-6 py-12">
        <SignInForm />
      </main>
    </>
  );
}
