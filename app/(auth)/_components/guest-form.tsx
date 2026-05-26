"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestSchema, guestSchemaDV, GuestType } from "@/app/schemas/guest";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDERS } from "@/app/enums/gender";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import AutocompleteAddress from "@/components/layout/autocomplete-address";
import { useT } from "@/lib/i18n/context";
import { UserRound } from "lucide-react";
import { DobField, NotesField, SectorEthnicityFields } from "@/app/(auth)/_components/shared-form-fields";

const GuestForm = () => {
  const [isRegistering, startRegistering] = useTransition();
  const router = useRouter();
  const { t } = useT();

  const createGuest = useMutation(api.guests.createGuest);

  const form = useForm({
    resolver: zodResolver(guestSchema),
    defaultValues: guestSchemaDV,
  });

  const handleSubmit = (values: GuestType) => {
    startRegistering(async () => {
      const { success, id } = await createGuest({
        data: {
          ...values,
          dob: values.dob.getTime(),
        },
      });

      if (success) {
        toast.success(`Guest successfully created, id: ${id}`);
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
              <UserRound className="size-7 text-primary" />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.form.selectGender} />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((gender) => (
                      <SelectItem value={gender} key={gender}>
                        {gender}
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
