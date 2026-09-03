"use client";

import { useMemo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { buildHostSchema, hostSchemaDV, HostType } from "@/app/schemas/host";
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
import { useEnumLabel, useErrorMessage, useT } from "@/lib/i18n/context";
import { Home, Accessibility, Music, BookOpen } from "lucide-react";
import {
  DobField,
  LanguagesField,
  NotesField,
  SectorEthnicityFields,
  ToggleChip,
} from "@/app/(auth)/_components/shared-form-fields";
import { RegistrationSuccess } from "@/app/(auth)/_components/registration-success";
import { setJustRegistered } from "@/lib/registration-success";

const HostForm = () => {
  const [isRegistering, startRegistering] = useTransition();
  const [registered, setRegistered] = useState(false);
  const { t, lang } = useT();
  const el = useEnumLabel();
  const getErrorMessage = useErrorMessage();

  const createHost = useMutation(api.hosts.createHost);

  const schema = useMemo(() => buildHostSchema(t.validation), [t.validation]);

  const form = useForm({
    resolver: zodResolver(schema),
    // Pre-select the language the user is currently browsing in as a spoken
    // language — they can add or remove others.
    defaultValues: { ...hostSchemaDV, languages: [lang] },
  });

  const handleSubmit = (values: HostType) => {
    startRegistering(async () => {
      try {
        await createHost({
          data: {
            ...values,
            dob: values.dob.getTime(),
            floor: String(values.floor),
          },
        });
        setJustRegistered(true);
        setRegistered(true);
      } catch (e) {
        toast.error(getErrorMessage(e, "profileCreateFailed"));
      }
    });
  };

  if (registered) return <RegistrationSuccess role="host" />;

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
                  limitMaxLength
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
                    form.setValue("address", place.address, {
                      shouldValidate: true,
                    });
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
          <div className="flex gap-3 sm:gap-4 items-end">
            <Controller
              name="floor"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-20 sm:w-28 shrink-0">
                  <FieldLabel>{t.form.floor}</FieldLabel>
                  <Input
                    autoComplete="off"
                    aria-required
                    type="text"
                    inputMode="numeric"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={(field.value ?? "") as string | number}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || /^-?\d{0,3}$/.test(v)) field.onChange(v);
                    }}
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
                <div className="flex flex-1 min-w-0 h-9 items-center justify-between gap-2 rounded-lg border border-input bg-muted/30 px-3 sm:px-4">
                  <Label
                    htmlFor="disability-switch"
                    className="flex min-w-0 items-center gap-1.5 text-sm cursor-pointer leading-tight whitespace-nowrap"
                  >
                    <Accessibility className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">
                      {t.hostProfile.stepFreeAccess}
                    </span>
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
                <NativeSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder={t.form.selectKashrout}
                  invalid={fieldState.invalid}
                  options={KASHROUT.map((kashrout) => ({
                    value: kashrout,
                    label: el.kashrout(kashrout),
                  }))}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Hospitality preferences — pill toggles like the language chips */}
          <Field>
            <FieldLabel>{t.hostProfile.preferences}</FieldLabel>
            <div className="flex flex-wrap items-center gap-2">
              <Controller
                name="likesSinging"
                control={form.control}
                render={({ field }) => (
                  <ToggleChip
                    icon={Music}
                    label={t.form.likesSinging}
                    active={!!field.value}
                    onClick={() => field.onChange(!field.value)}
                  />
                )}
              />
              <Controller
                name="likesDivreiTorah"
                control={form.control}
                render={({ field }) => (
                  <ToggleChip
                    icon={BookOpen}
                    label={t.form.likesDivreiTorah}
                    active={!!field.value}
                    onClick={() => field.onChange(!field.value)}
                  />
                )}
              />
            </div>
          </Field>

          {/* Languages spoken */}
          <LanguagesField control={form.control as never} />

          {/* Notes */}
          <NotesField control={form.control as never} />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isRegistering}
          >
            {isRegistering && <Spinner />}
            {t.common.continue}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default HostForm;
