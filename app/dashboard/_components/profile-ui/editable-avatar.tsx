"use client";

import Image from "next/image";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableAvatarProps {
  src?: string | null;
  name?: string | null;
  /** Green ring + cue when the account is verified. */
  verified?: boolean;
  onClick: () => void;
  title?: string;
  /** Skip Next image optimization for local object-URL previews. */
  unoptimized?: boolean;
}

/**
 * The clickable profile avatar with a camera affordance. Shared between the
 * profile view (clicking enters edit mode) and the edit form (clicking opens
 * the file picker) so the two states are visually identical.
 * RTL-safe: the camera pastille uses logical `end-0`.
 */
export function EditableAvatar({
  src,
  name,
  verified,
  onClick,
  title,
  unoptimized,
}: EditableAvatarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="group relative shrink-0 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div
        className={cn(
          "relative size-20 overflow-hidden rounded-full bg-muted shadow-sm ring-2",
          verified ? "ring-green-500/40" : "ring-border",
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name ?? ""}
            fill
            className="object-cover"
            draggable={false}
            unoptimized={unoptimized}
          />
        ) : (
          <div className="flex h-full w-full select-none items-center justify-center text-3xl font-semibold text-muted-foreground">
            {name?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="size-5 text-white" />
        </div>
      </div>
      <span className="absolute bottom-0 end-0 flex size-7 items-center justify-center rounded-full bg-primary shadow-sm ring-2 ring-background transition-colors group-hover:bg-primary/90">
        <Camera className="size-3.5 text-primary-foreground" />
      </span>
    </button>
  );
}
