const OrDivider = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="h-px w-full bg-border" />
      <span className="px-2 text-muted-foreground text-xs">OR</span>
      <div className="h-px w-full bg-border" />
    </div>
  );
};

export default OrDivider;
