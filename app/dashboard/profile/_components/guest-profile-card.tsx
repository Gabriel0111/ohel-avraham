"use client";

import { useMemo, useState, useTransition } from "react";
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
import { MapPin } from "lucide-react";
import { buildGuestSchema, GuestType } from "@/app/schemas/guest";
import { SECTORS } from "@/app/enums/sector";
import { ETHNICITIES } from "@/app/enums/ethnicity";
import { GENDERS } from "@/app/enums/gender";
import AutocompleteAddress from "@/components/layout/autocomplete-address";
import { toast } from "sonner";
import { SettingsRow } from "../../_components/profile-ui/settings-row";
import { ViewValue } from "../../_components/profile-ui/view-value";
import { EnumPill, genderColor } from "@/components/ui/enum-pill";
import { FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Doc } from "@/convex/_generated/dataModel";
import { useEnumLabel, useT } from "@/lib/i18n/context";

export function GuestProfileCard({
  guestData,
}: {
  guestData: Doc<"guests"> | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const upsertGuest = useMutation(api.guests.upsertGuest);
  const { t } = useT();
  const el = useEnumLabel();

  const schema = useMemo(() => buildGuestSchema(t.validation), [t.validation]);

  const form = useForm({
    resolver: zodResolver(schema),
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
        toast.success(t.common.save);
        setIsEditing(false);
      } catch {
        toast.error(t.auth.errorCreating);
      }
    });
  };

  if (!guestData)
    return (
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
        {t.guestProfile.noProfileFound}
      </div>
    );

  return (
    <div className="space-y-2">
      {/* Action Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="text-base font-semibold">{t.profile.guestProfile}</h3>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            {t.common.edit}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              {t.common.cancel}
            </Button>
            <Button
              size="sm"
              onClick={form.handleSubmit(handleSave)}
              disabled={isSaving}
            >
              {isSaving && <Spinner className="mr-2 border-background/30" />}
              {t.common.save}
            </Button>
          </div>
        )}
      </div>

      <div className="divide-y divide-border/20">
        {/* LIGNE : REGION — featured, the guest's key matching dimension */}
        <SettingsRow
          label={t.guestProfile.preferredRegion}
          description={t.guestProfile.preferredRegionDesc}
        >
          {isEditing ? (
            <Controller
              name="region"
              control={form.control}
              render={({ field }) => (
                <div className="w-full">
                  <AutocompleteAddress
                    defaultValue={field.value}
                    onPlaceSelect={(place) => field.onChange(place.address)}
                  />
                </div>
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
          label={t.form.gender}
          description={t.guestProfile.genderDesc}
        >
          {isEditing ? (
            <Controller
              name="gender"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.form.gender} />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {el.gender(g)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            <EnumPill color={genderColor(guestData.gender)}>
              {el.gender(guestData.gender)}
            </EnumPill>
          )}
        </SettingsRow>

        {/* LIGNE : SECTOR & ETHNICITY */}
        <SettingsRow
          label={t.hostProfile.communityDetails}
          description={t.hostProfile.communityDetailsDesc}
        >
          {isEditing ? (
            <div className="grid gap-4 w-full">
              <Controller
                name="sector"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FieldLabel>{t.form.sector}</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.form.selectSector} />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTORS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {el.sector(s)}
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
                    <FieldLabel>{t.form.ethnicity}</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.form.selectEthnicity} />
                      </SelectTrigger>
                      <SelectContent>
                        {ETHNICITIES.map((e) => (
                          <SelectItem key={e} value={e}>
                            {el.ethnicity(e)}
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
                <Label>{t.form.sector}</Label>
                <EnumPill color="amber">
                  {el.sector(guestData.sector)}
                </EnumPill>
              </div>
              <div className="flex items-center justify-between">
                <Label>{t.form.ethnicity}</Label>
                <EnumPill color="slate">
                  {el.ethnicity(guestData.ethnicity)}
                </EnumPill>
              </div>
            </div>
          )}
        </SettingsRow>

        {/* LIGNE : NOTES */}
        <SettingsRow
          label={t.form.notes}
          description={t.guestProfile.bioNotesDesc}
        >
          {isEditing ? (
            <Controller
              name="notes"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  className="min-h-25 bg-muted/20 border-border/40 focus-visible:ring-1"
                  placeholder={t.guestProfile.bioNotesPlaceholder}
                />
              )}
            />
          ) : (
            <ViewValue value={guestData.notes} />
          )}
        </SettingsRow>
      </div>
    </div>
  );
}
