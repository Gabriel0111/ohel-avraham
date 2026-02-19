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
import Autocomplete from "@/components/layout/autocomplete-adress";
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

interface HostProfileCardProps {
  hostData: Doc<"hosts"> | null | undefined;
}

export function HostProfileCard({ hostData }: HostProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const upsertHost = useMutation(api.hosts.upsertHost);

  const form = useForm({
    resolver: zodResolver(hostSchema),
    defaultValues: hostData ?? undefined,
  });

  if (!hostData) return <EmptyProfile />;

  const handleSave = (values: HostType) => {
    startSaving(async () => {
      try {
        await upsertHost({ data: { ...values, dob: values.dob.getTime() } });
        toast.success("Changes saved");
        setIsEditing(false);
      } catch {
        toast.error("Failed to save");
      }
    });
  };

  return (
    <div className="space-y-2">
      {/* Action Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="text-base font-semibold">Host Settings</h3>
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
            >
              {isSaving && <Spinner className="mr-2 border-background/30" />}
              Save changes
            </Button>
          </div>
        )}
      </div>

      <div className="divide-y divide-border/40">
        {/* --- LIGNE : ADRESSE --- */}
        <SettingsRow
          label="Address"
          description="The location where you will host meals."
        >
          {isEditing ? (
            <div className="grid gap-4 w-full">
              <Controller
                name="address"
                control={form.control}
                render={({ field }) => (
                  <Autocomplete
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    // className="w-full bg-transparent border-none p-0 focus-visible:ring-0"
                  />
                )}
              />

              <Controller
                name="entrance"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex items-center justify-between">
                    <FieldLabel>Entrance</FieldLabel>
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
                    <FieldLabel>Floor</FieldLabel>
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

              <ViewValue value={hostData.entrance} title="Entrance" />

              <ViewValue value={hostData.floor} title="Floor" />
            </div>
          )}
        </SettingsRow>

        {/* --- LIGNE : TELEPHONE --- */}
        <SettingsRow
          label="Phone Number"
          description="Used for urgent coordination with guests."
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
              value={RPNInput.formatPhoneNumberIntl(hostData.phoneNumber)}
              icon={<Phone className="size-4" />}
            />
          )}
        </SettingsRow>

        {/* --- LIGNE : KASHROUT --- */}
        <SettingsRow
          label="Community details"
          description="Sector and cultural background."
        >
          {isEditing ? (
            <div className="grid gap-4 w-full">
              <Controller
                name="kashrout"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FieldLabel>Kashrout</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kashrout" />
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
                <Label>Kashrout</Label>
                <Badge variant="secondary">{hostData.kashrout}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label>Sector</Label>
                <Badge variant="secondary">{hostData.sector}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label>Ethnicity</Label>
                <Badge variant="secondary">{hostData.ethnicity}</Badge>
              </div>
            </div>
          )}
        </SettingsRow>

        {/* --- LIGNE : ACCESSIBILITÉ --- */}
        <SettingsRow
          label="Accessibility"
          description="Does your home have step-free access for wheelchairs?"
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
                    {field.value ? "Enabled" : "Disabled"}
                  </span>
                </div>
              )}
            />
          ) : (
            <ViewValue
              value={
                hostData.hasDisabilityAccess
                  ? "Step-free access"
                  : "No specialized access"
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
          label="Notes"
          description="Any specific details your guests should know beforehand."
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
            <ViewValue value={hostData.notes || "No additional notes."} />
          )}
        </SettingsRow>
      </div>
    </div>
  );
}
