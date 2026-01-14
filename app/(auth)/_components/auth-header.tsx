import { Logo } from "@/components/icons/logo";

type AuthHeaderProps = {
  title: string;
  description?: string;
};

const AuthHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Logo className="h-5 lg:hidden pb-6" />

      <div className="flex flex-col space-y-1">
        <h1 className="font-bold text-2xl">{title}</h1>

        {description && (
          <p className="text-base text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

export default AuthHeader;
