import { PropsWithChildren } from "react";
import Navbar from "@/components/layout/Navbar";

const SharedLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <div className="pt-20">{children}</div>
    </>
  );
};

export default SharedLayout;
