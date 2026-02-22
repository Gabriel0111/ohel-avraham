"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { MapPin, User2 } from "lucide-react";
import { guestSchema, GuestType } from "@/app/schemas/guest";
import { SECTORS } from "@/app/enums/sector";
import { ETHNICITIES } from "@/app/enums/ethnicity";
import { GENDERS } from "@/app/enums/gender";
import Autocomplete from "@/components/layout/autocomplete-adress";
import { toast } from "sonner";
import { SettingsRow } from "../../_components/profile-ui/settings-row";
import { ViewValue } from "../../_components/profile-ui/view-value";
import { Badge } from "@/components/ui/badge";
import { FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Doc } from "@/convex/_generated/dataModel";

export function GuestProfileCard({
  guestData,
}: {
  guestData: Doc<"guests"> | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const upsertGuest = useMutation(api.guests.upsertGuest);

  const form = useForm({
    resolver: zodResolver(guestSchema),
    defaultValues: guestData
      ? {
          ...guestData,
          dob: new Date(guestData.dob),
          // On cast les strings de Convex vers les types attendus par Zod
          gender: guestData.gender as GuestType["gender"],
          sector: guestData.sector as GuestType["sector"],
          ethnicity: guestData.ethnicity as GuestType["ethnicity"],
          notes: guestData.notes || "",
        }
      : undefined,
  });

  const handleSave = (values: GuestType) => {
    startSaving(async () => {
      try {
        await upsertGuest({ data: { ...values, dob: values.dob.getTime() } });
        toast.success("Guest profile updated");
        setIsEditing(false);
      } catch {
        toast.error("Failed to update profile");
      }
    });
  };

  if (!guestData)
    return (
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
        No guest profile found.
      </div>
    );

  return (
    <div className="relative">
      {/* Action Header Flottant */}
      <div className="absolute -top-12 right-0">
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 rounded-md shadow-xs bg-background"
          >
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={form.handleSubmit(handleSave)}
              disabled={isSaving}
              className="h-8 rounded-md px-4 bg-foreground text-background hover:bg-foreground/90"
            >
              {isSaving && <Spinner className="mr-2 border-background/30" />}
              Save changes
            </Button>
          </div>
        )}
      </div>

      <div className="divide-y divide-border/20">
        {/* LIGNE : REGION */}
        <SettingsRow
          label="Preferred Region"
          description="The area where you are looking for a host."
        >
          {isEditing ? (
            <Controller
              name="region"
              control={form.control}
              render={({ field }) => (
                <Autocomplete
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  // className="w-full border-none p-0 focus-visible:ring-0 bg-transparent"
                />
              )}
            />
          ) : (
            <ViewValue
              value={guestData.region}
              icon={<MapPin className="size-4" />}
            />
          )}
        </SettingsRow>

        {/* LIGNE : GENDER */}
        <SettingsRow
          label="Gender"
          description="Helps hosts coordinate sleeping arrangements."
        >
          {isEditing ? (
            <Controller
              name="gender"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9 w-full max-w-50 bg-muted/30 border-none shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            <ViewValue
              value={guestData.gender}
              icon={<User2 className="size-4" />}
            />
          )}
        </SettingsRow>

        {/* LIGNE : SECTOR & ETHNICITY */}
        <SettingsRow
          label="Community details"
          description="Sector and cultural background."
        >
          {isEditing ? (
            <div className="grid gap-4 w-full">
              <Controller
                name="sector"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FieldLabel>Sector</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTORS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              <Controller
                name="ethnicity"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FieldLabel>Ethnicity</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        {ETHNICITIES.map((e) => (
                          <SelectItem key={e} value={e}>
                            {e}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-full">
              <div className="flex items-center justify-between">
                <Label>Sector</Label>
                <Badge variant="secondary">{guestData.sector}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label>Ethnicity</Label>
                <Badge variant="secondary">{guestData.ethnicity}</Badge>
              </div>
            </div>
          )}
        </SettingsRow>

        {/* LIGNE : NOTES */}
        <SettingsRow
          label="Bio & Notes"
          description="Share a bit about yourself or special needs."
        >
          {isEditing ? (
            <Controller
              name="notes"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  className="min-h-25 bg-muted/20 border-border/40 focus-visible:ring-1"
                  placeholder="Ex: I follow specific dietary rules..."
                />
              )}
            />
          ) : (
            <ViewValue
              value={guestData.notes ?? "No specific notes provided."}
            />
          )}
        </SettingsRow>
      </div>
    </div>
  );
}
