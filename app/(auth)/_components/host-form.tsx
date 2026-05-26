"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { hostSchema, hostSchemaDV, HostType } from "@/app/schemas/host";
import * as RPNInput from "react-phone-number-input";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/app/(auth)/_components/phone-number-comps";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { KASHROUT } from "@/app/enums/kashrout";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import AutocompleteAddress from "@/components/layout/autocomplete-address";
import { useT } from "@/lib/i18n/context";
import { Home, Accessibility } from "lucide-react";
import { DobField, NotesField, SectorEthnicityFields } from "@/app/(auth)/_components/shared-form-fields";

const HostForm = () => {
  const [isRegistering, startRegistering] = useTransition();
  const router = useRouter();
  const { t } = useT();

  const createHost = useMutation(api.hosts.createHost);

  const form = useForm({
    resolver: zodResolver(hostSchema),
    defaultValues: hostSchemaDV,
  });

  const handleSubmit = (values: HostType) => {
    startRegistering(async () => {
      const { success, id } = await createHost({
        data: {
          ...values,
          dob: values.dob.getTime(),
          floor: String(values.floor),
        },
      });

      if (success) {
        toast.success(`Host successfully created, id: ${id}`);
        router.push("/");
      } else {
        toast.error(t.auth.errorCreating);
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <div className="flex flex-col gap-5 w-full">

          {/* Welcome header */}
          <div className="flex flex-col items-center gap-3 text-center py-2">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center ring-4 ring-primary/5">
              <Home className="size-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t.auth.welcomeNewHost}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                {t.auth.hostDesc}
              </p>
            </div>
          </div>

          {/* Date of birth */}
          <DobField control={form.control as never} />

          {/* Phone number */}
          <Controller
            name="phoneNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t.form.phoneNumber}</FieldLabel>
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

          {/* Address */}
          <Controller
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t.form.address}</FieldLabel>
                <AutocompleteAddress
                  defaultValue={field.value}
                  onPlaceSelect={(place) => {
                    form.setValue("address", place.address, { shouldValidate: true });
                    form.setValue("lat", place.lat, { shouldValidate: true });
                    form.setValue("lng", place.lng, { shouldValidate: true });
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Floor + Disability */}
          <div className="flex gap-4 items-end">
            <Controller
              name="floor"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-28 shrink-0">
                  <FieldLabel>{t.form.floor}</FieldLabel>
                  <Input
                    type="number"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value as number}
                    onChange={(e) => field.onChange(isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
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
                <div className="flex flex-1 h-9 items-center justify-between rounded-lg border border-input bg-muted/30 px-4">
                  <Label
                    htmlFor="disability-switch"
                    className="text-sm cursor-pointer leading-tight"
                  >
                    <Accessibility className="size-3.5 inline mr-1.5 text-muted-foreground" />
                    {t.form.disabilityAccess}
                  </Label>
                  <Switch
                    id="disability-switch"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </div>

          {/* Sector + Ethnicity */}
          <SectorEthnicityFields control={form.control as never} />

          {/* Kashrout */}
          <Controller
            name="kashrout"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t.form.kashrout}</FieldLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.form.selectKashrout} />
                  </SelectTrigger>
                  <SelectContent>
                    {KASHROUT.map((kashrout) => (
                      <SelectItem value={kashrout} key={kashrout}>
                        {kashrout}
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

          {/* Notes */}
          <NotesField control={form.control as never} />

          <Button type="submit" className="w-full" size="lg" disabled={isRegistering}>
            {isRegistering && <Spinner />}
            {t.common.continue}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default HostForm;
