"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Accessibility, MapPin, Phone, X } from "lucide-react";
import { hostSchema, HostType } from "@/app/schemas/host";
import AutocompleteAddress from "@/components/layout/autocomplete-address";
import { toast } from "sonner";
import * as RPNInput from "react-phone-number-input";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/app/(auth)/_components/phone-number-comps";
import { EmptyProfile } from "@/app/dashboard/_components/profile-ui/empty-profile";
import { SettingsRow } from "../../_components/profile-ui/settings-row";
import { ViewValue } from "@/app/dashboard/_components/profile-ui/view-value";
import { SECTORS } from "@/app/enums/sector";
import { ETHNICITIES } from "@/app/enums/ethnicity";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { KASHROUT } from "@/app/enums/kashrout";
import { Doc } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { useWarnIfUnsavedChanges } from "@/hooks/use-warn-if-unsaved-changes";
import Link from "next/link";
import { useT } from "@/lib/i18n/context";

interface HostProfileCardProps {
  hostData: Doc<"hosts"> | null | undefined;
}

export function HostProfileCard({ hostData }: HostProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const upsertHost = useMutation(api.hosts.upsertHost);
  const { t } = useT();

  const form = useForm({
    resolver: zodResolver(hostSchema),
    defaultValues: hostData
      ? {
          ...hostData,
          dob: new Date(hostData.dob),
          // On "rassure" TypeScript ici :
          kashrout: hostData.kashrout as HostType["kashrout"],
          sector: hostData.sector as HostType["sector"],
          ethnicity: hostData.ethnicity as HostType["ethnicity"],
          notes: hostData.notes || "",
          entrance: hostData.entrance || "",
        }
      : undefined,
  });

  useWarnIfUnsavedChanges(isEditing && form.formState.isDirty);

  if (!hostData) return <EmptyProfile />;

  const handleSave = (values: HostType) => {
    startSaving(async () => {
      try {
        await upsertHost({ data: { ...values, dob: values.dob.getTime() } });
        toast.success(t.common.save);
        setIsEditing(false);
      } catch {
        toast.error(t.auth.errorCreating);
      }
    });
  };

  return (
    <div className="space-y-2">
      {/* Action Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="text-base font-semibold">{t.hostProfile.title}</h3>
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

      <div className="divide-y divide-border/40">
        {/* --- LIGNE : ADRESSE --- */}
        <SettingsRow
          label={t.form.address}
          description={t.hostProfile.addressDesc}
        >
          {isEditing ? (
            <div className="grid gap-4 w-full">
              <Controller
                name="address"
                control={form.control}
                render={({ field }) => (
                  <AutocompleteAddress
                    defaultValue={field.value}
                    onPlaceSelect={(place) => {
                      form.setValue("address", place.address, { shouldValidate: true });
                      form.setValue("lat", place.lat, { shouldValidate: true });
                      form.setValue("lng", place.lng, { shouldValidate: true });
                    }}
                  />
                )}
              />

              <Controller
                name="entrance"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex items-center justify-between">
                    <FieldLabel>{t.form.entrance}</FieldLabel>
                    <Input {...field} className="w-fit" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                )}
              />

              <Controller
                name="floor"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex items-center justify-between">
                    <FieldLabel>{t.form.floor}</FieldLabel>
                    <Input {...field} className="w-fit" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                )}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-full">
              <ViewValue
                value={hostData.address}
                icon={<MapPin className="size-4" />}
              />

              <ViewValue value={hostData.entrance} title={t.form.entrance} />

              <ViewValue value={hostData.floor} title={t.form.floor} />
            </div>
          )}
        </SettingsRow>

        {/* --- LIGNE : TELEPHONE --- */}
        <SettingsRow
          label={t.form.phoneNumber}
          description={t.hostProfile.phoneDesc}
        >
          {isEditing ? (
            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <div className="w-full">
                  <RPNInput.default
                    defaultCountry="IL"
                    className="flex rounded-md border-none"
                    international
                    flagComponent={FlagComponent}
                    countrySelectComponent={CountrySelect}
                    inputComponent={PhoneInput}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
          ) : (
            <ViewValue
              value={
                <Link href={`tel:${hostData.phoneNumber}`}>
                  {RPNInput.formatPhoneNumberIntl(hostData.phoneNumber)}
                </Link>
              }
              icon={<Phone className="size-4" />}
            />
          )}
        </SettingsRow>

        {/* --- LIGNE : KASHROUT --- */}
        <SettingsRow
          label={t.hostProfile.communityDetails}
          description={t.hostProfile.communityDetailsDesc}
        >
          {isEditing ? (
            <div className="grid gap-4 w-full">
              <Controller
                name="kashrout"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FieldLabel>{t.form.kashrout}</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.form.selectKashrout} />
                      </SelectTrigger>
                      <SelectContent>
                        {KASHROUT.map((s) => (
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
                name="sector"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FieldLabel>{t.form.sector}</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.form.selectSector} />
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
                    <FieldLabel>{t.form.ethnicity}</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.form.selectEthnicity} />
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
                <Label>{t.form.kashrout}</Label>
                <Badge variant="secondary">{hostData.kashrout}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label>{t.form.sector}</Label>
                <Badge variant="secondary">{hostData.sector}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label>{t.form.ethnicity}</Label>
                <Badge variant="secondary">{hostData.ethnicity}</Badge>
              </div>
            </div>
          )}
        </SettingsRow>

        {/* --- LIGNE : ACCESSIBILITÉ --- */}
        <SettingsRow
          label={t.hostProfile.accessibility}
          description={t.hostProfile.accessibilityDesc}
        >
          {isEditing ? (
            <Controller
              name="hasDisabilityAccess"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-sm text-muted-foreground">
                    {field.value ? t.common.enabled : t.common.disabled}
                  </span>
                </div>
              )}
            />
          ) : (
            <ViewValue
              value={
                hostData.hasDisabilityAccess
                  ? t.hostProfile.stepFreeAccess
                  : t.hostProfile.noSpecializedAccess
              }
              icon={
                hostData.hasDisabilityAccess ? (
                  <Accessibility className="size-4 text-emerald-500" />
                ) : (
                  <X className="size-4 text-destructive" />
                )
              }
            />
          )}
        </SettingsRow>

        {/* --- LIGNE : NOTES --- */}
        <SettingsRow
          label={t.form.notes}
          description={t.hostProfile.notesDesc}
        >
          {isEditing ? (
            <Controller
              name="notes"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  className="min-h-25 text-sm bg-muted/20 border-border/50 focus-visible:ring-1"
                />
              )}
            />
          ) : (
            <ViewValue value={hostData.notes || t.common.noAdditionalNotes} />
          )}
        </SettingsRow>
      </div>
    </div>
  );
}
