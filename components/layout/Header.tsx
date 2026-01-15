// "use client";
// import { Button, buttonVariants } from "@/components/ui/button";
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
// } from "@/components/ui/navigation-menu";
//
// import { cn } from "@/lib/utils";
// import { LogOutIcon, MenuIcon, UserIcon } from "lucide-react";
// import { navigationData } from "@/lib/navigation-data";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
// import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
// import { authClient } from "@/lib/auth-client";
// import { Spinner } from "@/components/ui/spinner";
// import { Logo } from "@/components/icons/logo";
// import { toast } from "sonner";
// import {
//   Sheet,
//   SheetContent,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import AvatarDropdown from "@/components/ui/avatar-dropdown";
// import { useAuth } from "@/app/ConvexClientProvider";
//
// const Navbar = () => {
//   const [scrolled, setScrolled] = useState(false);
//
//   const { user } = useAuth();
//
//   useEffect(() => {
//     const onScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);
//
//   function onSignOut() {
//     authClient.signOut({
//       fetchOptions: {
//         onSuccess: () => {
//           toast.success("Logout successfully.");
//         },
//         onError: (error) => {
//           toast.error(error.error.message);
//         },
//       },
//     });
//   }
//
//   return (
//     <header
//       className={cn(
//         "fixed top-0 left-0 z-50 w-full transition-all duration-300",
//         scrolled
//           ? "backdrop-blur-md bg-white/70 shadow-sm dark:bg-black/50"
//           : "bg-transparent",
//       )}
//     >
//       <nav className="container mx-auto flex h-16 max-w-7xl items-center justify-between w-full px-4 md:px-6 lg:px-8">
//         {/* Logo */}
//         <Link href="/">
//           <Logo />
//         </Link>
//
//         {/* Navigation */}
//         <NavigationMenu className="max-md:hidden">
//           <NavigationMenuList className="flex-wrap justify-start gap-0">
//             {navigationData.map((navItem) => (
//               <NavigationMenuItem key={navItem.title}>
//                 <NavigationMenuLink
//                   href={navItem.href}
//                   className="text-muted-foreground hover:text-primary px-3 py-1.5 text-base! font-medium hover:bg-transparent"
//                 >
//                   {navItem.title}
//                 </NavigationMenuLink>
//               </NavigationMenuItem>
//             ))}
//           </NavigationMenuList>
//         </NavigationMenu>
//
//         {/* Login Button */}
//         <div className="flex gap-4 items-center">
//           <LinknimatedThemeToggler />
//
//           <Linkuthenticated>
//             <LinkvatarDropdown
//               name={user?.name}
//               email={user?.email}
//               imageSrc={user?.image}
//               items={[
//                 {
//                   icon: <UserIcon />,
//                   label: "Profile",
//                   onClick: () => console.log("Chalom"),
//                 },
//                 {
//                   icon: <LogOutIcon />,
//                   label: "Sign Out",
//                   onClick: onSignOut,
//                 },
//               ]}
//             />
//
//             {/*<Button onClick={onSignOut}>Logout</Button>*/}
//           </Linkuthenticated>
//
//           <Unauthenticated>
//             <Link href="/sign-up" className={buttonVariants()}>
//               Sign up
//             </Link>
//
//             <Link
//               href="/login"
//               className={buttonVariants({ variant: "ghost" })}
//             >
//               Login
//             </Link>
//           </Unauthenticated>
//
//           <LinkuthLoading>
//             <Button variant="ghost" disabled>
//               <Spinner />
//             </Button>
//           </LinkuthLoading>
//
//           {/* Navigation for small screens */}
//           <div className="flex gap-4 md:hidden">
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="outline" size="icon">
//                   <MenuIcon />
//                   <span className="sr-only">Menu</span>
//                 </Button>
//               </SheetTrigger>
//               <SheetTitle className="hidden">
//                 <p>Menu</p>
//               </SheetTitle>
//               <SheetContent side="right" className="w-64 p-5">
//                 <nav className="flex flex-col gap-4 mt-8">
//                   {navigationData.map((item, index) => (
//                     <Link
//                       key={index}
//                       href={item.href}
//                       className="text-lg font-medium hover:text-primary transition-colors"
//                     >
//                       {item.title}
//                     </Link>
//                   ))}
//                 </nav>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };
//
// export default Navbar;
"use client";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOutIcon, Menu, UserIcon, X } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Spinner } from "@/components/ui/spinner";
import AvatarDropdown from "@/components/ui/avatar-dropdown";
import { useAuth } from "@/app/ConvexClientProvider";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const links: { href: string; title: string }[] = [
    {
      title: "How it works",
      href: "/",
    },
    {
      title: "Communities",
      href: "/",
    },
    {
      title: "About",
      href: "/",
    },
  ];

  function onSignOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logout successfully.");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <AnimatedThemeToggler />

            <Unauthenticated>
              <Link
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                href="/login"
              >
                Sign In
              </Link>
              <Link
                className={buttonVariants({ variant: "default", size: "sm" })}
                href="/sign-up"
              >
                Join Now
              </Link>
            </Unauthenticated>

            <Authenticated>
              <AvatarDropdown
                name={user?.name}
                email={user?.email}
                imageSrc={user?.image}
                items={[
                  {
                    icon: <UserIcon />,
                    label: "Profile",
                    onClick: () => console.log("Chalom"),
                  },
                  {
                    icon: <LogOutIcon />,
                    label: "Sign Out",
                    onClick: onSignOut,
                  },
                ]}
              />
            </Authenticated>

            <AuthLoading>
              <Button variant="ghost" disabled>
                <Spinner />
              </Button>
            </AuthLoading>
          </div>

          {/* Mobile Menu Button */}
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col gap-4">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {link.title}
                </Link>
              ))}

              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <AnimatedThemeToggler />
                <Link
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                  href="/login"
                >
                  Sign In
                </Link>
                <Link
                  className={buttonVariants({ variant: "default", size: "sm" })}
                  href="/sign-up"
                >
                  Join Now
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
