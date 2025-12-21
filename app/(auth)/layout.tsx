import { PropsWithChildren } from "react";
import { AuthPage } from "@/app/(auth)/_components/auth-page";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return <AuthPage>{children}</AuthPage>;
};

export default AuthLayout;
