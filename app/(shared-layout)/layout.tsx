import { PropsWithChildren } from "react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "./_components/footer";

const SharedLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-7xl w-full mx-auto pt-16 px-4 md:px-8 lg:px-12 outline-none"
      >
        {children}
      </main>
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 lg:px-12">
        <Footer />
      </div>
    </>
  );
};

export default SharedLayout;
