"use client";

import { useRef, useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useT } from "@/lib/i18n/context";
import { Doc } from "@/convex/_generated/dataModel";

interface EditIdentityProps {
  user: Doc<"users">;
  onDone: () => void;
  onCancel: () => void;
}

export function EditIdentity({ user, onDone, onCancel }: EditIdentityProps) {
  const { t } = useT();
  const [name, setName] = useState(user.name ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, startSaving] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateUserProfile = useMutation(api.users.updateUserProfile);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSave = () => {
    startSaving(async () => {
      try {
        let storageId: string | undefined;

        if (file) {
          const uploadUrl = await generateUploadUrl();
          const res = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          if (!res.ok) throw new Error("Upload failed");
          const { storageId: id } = await res.json();
          storageId = id;
        }

        await updateUserProfile({
          name: name.trim() || undefined,
          storageId: storageId as Parameters<typeof updateUserProfile>[0]["storageId"],
        });

        toast.success(t.common.save);
        onDone();
      } catch {
        toast.error(t.auth.errorCreating);
      }
    });
  };

  const avatarSrc = previewUrl ?? user.image ?? null;

  return (
    <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
      {/* Avatar avec bouton upload */}
      <div className="relative shrink-0">
        <div className="relative size-20 rounded-full overflow-hidden bg-muted shadow-sm ring-2 ring-border">
          {avatarSrc ? (
            <Image src={avatarSrc} alt={name} fill className="object-cover" unoptimized={!!previewUrl} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-muted-foreground select-none">
              {name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 size-7 bg-primary rounded-full flex items-center justify-center ring-2 ring-background hover:bg-primary/90 transition-colors"
        >
          <Camera className="size-3.5 text-primary-foreground" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Champs + actions */}
      <div className="flex-1 w-full space-y-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t.profile.firstLastName}</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Avraham Avinu"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSaving}>
            {t.common.cancel}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving && <Spinner className="mr-1 border-background/30" />}
            {t.profile.saveIdentity}
          </Button>
        </div>
      </div>
    </div>
  );
}
