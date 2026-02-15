"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Pencil, X, Calendar, MapPin, Users, Globe, User2 } from "lucide-react";
import { guestSchema, GuestType } from "@/app/schemas/guest";
import { SECTORS } from "@/app/enums/sector";
import { ETHNICITIES } from "@/app/enums/ethnicity";
import { GENDERS } from "@/app/enums/gender";
import Autocomplete from "@/components/layout/autocomplete-adress";
import { toast } from "sonner";

interface GuestProfileCardProps {
  guestData: {
    dob: number;
    region: string;
    gender: string;
    sector: string;
    ethnicity: string;
    notes?: string;
  } | null | undefined;
}

export function GuestProfileCard({ guestData }: GuestProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const upsertGuest = useMutation(api.guests.upsertGuest);

  const form = useForm({
    resolver: zodResolver(guestSchema),
    defaultValues: guestData
      ? {
          dob: new Date(guestData.dob),
          region: guestData.region,
          gender: guestData.gender as GuestType["gender"],
          sector: guestData.sector as GuestType["sector"],
          ethnicity: guestData.ethnicity as GuestType["ethnicity"],
          notes: guestData.notes || "",
        }
      : undefined,
  });

  if (!guestData) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No guest profile data found.
        </CardContent>
      </Card>
    );
  }

  const handleSave = (values: GuestType) => {
    startSaving(async () => {
      try {
        await upsertGuest({
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
          <CardTitle>Edit Guest Profile</CardTitle>
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
                  name="gender"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Gender</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENDERS.map((g) => (
                            <SelectItem value={g} key={g}>
                              {g}
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
                  name="region"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Region</FieldLabel>
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
        <CardTitle>Guest Profile</CardTitle>
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
            value={new Date(guestData.dob).toLocaleDateString()}
          />
          <ProfileField
            icon={<User2 className="size-4" />}
            label="Gender"
            value={guestData.gender}
          />
          <ProfileField
            icon={<MapPin className="size-4" />}
            label="Region"
            value={guestData.region}
          />
          <ProfileField
            icon={<Users className="size-4" />}
            label="Sector"
            value={guestData.sector}
          />
          <ProfileField
            icon={<Globe className="size-4" />}
            label="Ethnicity"
            value={guestData.ethnicity}
          />
          {guestData.notes && (
            <div className="sm:col-span-2">
              <ProfileField
                icon={<Pencil className="size-4" />}
                label="Notes"
                value={guestData.notes}
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
