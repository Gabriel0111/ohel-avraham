import { Skeleton } from "@/components/ui/skeleton";

export const ProfileLoading = () => (
  <div className="container max-w-5xl space-y-8 animate-in fade-in duration-500">
    {/* Header Skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-10 w-64" /> {/* Profile Settings Title */}
      <Skeleton className="h-4 w-80" /> {/* Description text */}
    </div>

    {/* 1. Personal Identity Section */}
    <section className="flex flex-col border-b border-border py-8 md:flex-row md:gap-12">
      <div className="w-full md:w-1/3 lg:w-1/2 space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full max-w-62.5" />
      </div>
      <div className="w-full md:w-2/3 lg:w-1/2 mt-6 md:mt-0 flex gap-6">
        <Skeleton className="size-14 rounded-full shrink-0" /> {/* Avatar */}
        <div className="space-y-3 w-full">
          <Skeleton className="h-7 w-48" /> {/* Name */}
          <Skeleton className="h-4 w-32" /> {/* Role */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-36 rounded-full" /> {/* Email badge */}
            <Skeleton className="h-6 w-36 rounded-full" /> {/* Date badge */}
          </div>
        </div>
      </div>
    </section>

    {/* 2. Community Profiles Section */}
    <section className="flex flex-col border-b border-border py-8 md:flex-row md:gap-12">
      <div className="w-full md:w-1/3 lg:w-1/2 space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full max-w-50" />
      </div>
      <div className="w-full md:w-2/3 lg:w-1/2 mt-6 md:mt-0 grid gap-4">
        {/* Si tu as des ActionCards ici en chargement */}
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </section>

    {/* 3. Host Settings Section */}
    <section className="flex flex-col border-b border-border py-8 md:flex-row md:gap-12">
      <div className="flex w-full justify-between md:block md:w-1/3 lg:w-1/2">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full max-w-55" />
        </div>
        <Skeleton className="h-9 w-16 mt-4 hidden md:block" />{" "}
        {/* Edit Button */}
      </div>

      <div className="w-full md:w-2/3 lg:w-1/2 mt-6 md:mt-0 space-y-0">
        {/* Simulation des InfoRows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center py-4 border-b border-border/50 last:border-0"
          >
            <Skeleton className="size-5 w-10 shrink-0 mr-4" /> {/* Icon */}
            <Skeleton className="h-4 w-24 grow" /> {/* Label */}
            <Skeleton className="h-4 w-32" /> {/* Value */}
          </div>
        ))}
      </div>
    </section>
  </div>
);
