import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In Ielts Writing",
  description: "Sign In Ielts Writing",
};

export default function SignIn() {
  return <SignInForm />;
}
