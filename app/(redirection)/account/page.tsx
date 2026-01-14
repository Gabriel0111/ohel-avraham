import { redirect } from "next/navigation";

const AccountLayout = () => {
  redirect("/dashboard/profile");
};

export default AccountLayout;
