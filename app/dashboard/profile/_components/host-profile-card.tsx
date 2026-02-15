"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
  MapPin,
  Phone,
  Pencil,
  X,
  Calendar,
  Building,
  Accessibility,
  Utensils,
  Users,
  Globe,
} from "lucide-react";
import { hostSchema, HostType } from "@/app/schemas/host";
import { SECTORS } from "@/app/enums/sector";
import { ETHNICITIES } from "@/app/enums/ethnicity";
import { KASHROUT } from "@/app/enums/kashrout";
import Autocomplete from "@/components/layout/autocomplete-adress";
import { toast } from "sonner";
import * as RPNInput from "react-phone-number-input";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/app/(auth)/_components/phone-number-comps";

interface HostProfileCardProps {
  hostData: {
    dob: number;
    phoneNumber: string;
    address: string;
    floor: number;
    hasDisabilityAccess: boolean;
    kashrout: string;
    sector: string;
    ethnicity: string;
    notes?: string;
  } | null | undefined;
}

export function HostProfileCard({ hostData }: HostProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const upsertHost = useMutation(api.hosts.upsertHost);

  const form = useForm({
    resolver: zodResolver(hostSchema),
    defaultValues: hostData
      ? {
          dob: new Date(hostData.dob),
          phoneNumber: hostData.phoneNumber,
          address: hostData.address,
          floor: hostData.floor,
          hasDisabilityAccess: hostData.hasDisabilityAccess,
          kashrout: hostData.kashrout as HostType["kashrout"],
          sector: hostData.sector as HostType["sector"],
          ethnicity: hostData.ethnicity as HostType["ethnicity"],
          notes: hostData.notes || "",
        }
      : undefined,
  });

  if (!hostData) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No host profile data found.
        </CardContent>
      </Card>
    );
  }

  const handleSave = (values: HostType) => {
    startSaving(async () => {
      try {
        await upsertHost({
          data: {
            ...values,
            dob: values.dob.getTime(),
          },
        });
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } catch {
        toast.error("Failed to update profile");
      }
    });
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Host Profile</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(false)}
          >
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <FieldGroup>
              <div className="flex flex-col gap-5">
                <Controller
                  name="dob"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Date of Birth</FieldLabel>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : (field.value as string) || ""
                        }
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="phoneNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Phone Number</FieldLabel>
                      <RPNInput.default
                        defaultCountry="IL"
                        className="flex rounded-md shadow-xs"
                        international
                        flagComponent={FlagComponent}
                        countrySelectComponent={CountrySelect}
                        inputComponent={PhoneInput}
                        placeholder="+972 58-1234567"
                        value={field.value}
                        onChange={field.onChange}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Address</FieldLabel>
                      <Autocomplete
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="sector"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Sector</FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Sector" />
                          </SelectTrigger>
                          <SelectContent>
                            {SECTORS.map((s) => (
                              <SelectItem value={s} key={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="ethnicity"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Ethnicity</FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Ethnicity" />
                          </SelectTrigger>
                          <SelectContent>
                            {ETHNICITIES.map((e) => (
                              <SelectItem value={e} key={e}>
                                {e}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="floor"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Floor</FieldLabel>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          value={(field.value as number) || ""}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="hasDisabilityAccess"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Disability Access</FieldLabel>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="kashrout"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Kashrout</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Kashrout" />
                        </SelectTrigger>
                        <SelectContent>
                          {KASHROUT.map((k) => (
                            <SelectItem value={k} key={k}>
                              {k}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Notes</FieldLabel>
                      <Textarea
                        placeholder="Additional notes..."
                        {...field}
                      />
                    </Field>
                  )}
                />

                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Spinner />}
                  Save Changes
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    );
  }

  // View mode
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Host Profile</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="gap-1.5"
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ProfileField
            icon={<Calendar className="size-4" />}
            label="Date of Birth"
            value={new Date(hostData.dob).toLocaleDateString()}
          />
          <ProfileField
            icon={<Phone className="size-4" />}
            label="Phone Number"
            value={hostData.phoneNumber}
          />
          <ProfileField
            icon={<MapPin className="size-4" />}
            label="Address"
            value={hostData.address}
          />
          <ProfileField
            icon={<Building className="size-4" />}
            label="Floor"
            value={String(hostData.floor)}
          />
          <ProfileField
            icon={<Accessibility className="size-4" />}
            label="Disability Access"
            value={hostData.hasDisabilityAccess ? "Yes" : "No"}
          />
          <ProfileField
            icon={<Utensils className="size-4" />}
            label="Kashrout"
            value={hostData.kashrout}
          />
          <ProfileField
            icon={<Users className="size-4" />}
            label="Sector"
            value={hostData.sector}
          />
          <ProfileField
            icon={<Globe className="size-4" />}
            label="Ethnicity"
            value={hostData.ethnicity}
          />
          {hostData.notes && (
            <div className="sm:col-span-2">
              <ProfileField
                icon={<Pencil className="size-4" />}
                label="Notes"
                value={hostData.notes}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
