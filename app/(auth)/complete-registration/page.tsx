import { Suspense } from "react";
import RegistrationForm from "@/app/(auth)/complete-registration/_components/registration-form";

const CompleteRegistration = () => {
  return (
    <Suspense fallback={"loading registration form..."}>
      <RegistrationForm />
    </Suspense>
  );
};

export default CompleteRegistration;
