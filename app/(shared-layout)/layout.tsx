import { PropsWithChildren } from "react";
import Navbar from "@/components/layout/Navbar";

const SharedLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl w-full mx-auto pt-16">{children}</div>
    </>
  );
};

export default SharedLayout;
