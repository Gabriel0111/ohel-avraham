"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildGuestSchema, guestSchemaDV, GuestType } from "@/app/schemas/guest";
import { NativeSelect } from "@/components/ui/native-select";
import { GENDERS } from "@/app/enums/gender";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import AutocompleteAddress from "@/components/layout/autocomplete-address";
import { useEnumLabel, useErrorMessage, useT } from "@/lib/i18n/context";
import { UserRound } from "lucide-react";
import { DobField, LanguagesField, NotesField, SectorEthnicityFields } from "@/app/(auth)/_components/shared-form-fields";
import { RegistrationSuccess } from "@/app/(auth)/_components/registration-success";
import { setJustRegistered } from "@/lib/registration-success";

const GuestForm = () => {
  const [isRegistering, startRegistering] = useTransition();
  const [registered, setRegistered] = useState(false);
  const { t } = useT();
  const el = useEnumLabel();
  const getErrorMessage = useErrorMessage();

  const createGuest = useMutation(api.guests.createGuest);

  const schema = useMemo(() => buildGuestSchema(t.validation), [t.validation]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: guestSchemaDV,
  });

  const handleSubmit = (values: GuestType) => {
    startRegistering(async () => {
      try {
        await createGuest({
          data: {
            ...values,
            dob: values.dob.getTime(),
          },
        });
        setJustRegistered(true);
        setRegistered(true);
      } catch (e) {
        toast.error(getErrorMessage(e, "profileCreateFailed"));
      }
    });
  };

  if (registered) return <RegistrationSuccess role="guest" />;

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <div className="flex flex-col gap-5 w-full">

          {/* Welcome header */}
          <div className="flex flex-col items-center gap-3 text-center py-2">
            <div className="relative flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500/20 to-amber-500/5 shadow-sm shadow-amber-500/10 ring-1 ring-inset ring-amber-500/20">
              <span className="absolute inset-0 rounded-2xl ring-4 ring-amber-500/5" />
              <UserRound className="size-7 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t.auth.welcomeNewGuest}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                {t.auth.guestDesc}
              </p>
            </div>
          </div>

          {/* Date of birth */}
          <DobField control={form.control as never} />

          {/* Gender */}
          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t.form.gender}</FieldLabel>
                <NativeSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder={t.form.selectGender}
                  invalid={fieldState.invalid}
                  options={GENDERS.map((gender) => ({
                    value: gender,
                    label: el.gender(gender),
                  }))}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Region */}
          <Controller
            control={form.control}
            name="region"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t.form.region}</FieldLabel>
                <AutocompleteAddress
                  defaultValue={field.value}
                  onPlaceSelect={(place) => field.onChange(place.address)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Sector + Ethnicity */}
          <SectorEthnicityFields control={form.control as never} />

          {/* Languages spoken */}
          <LanguagesField control={form.control as never} />

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

export default GuestForm;
