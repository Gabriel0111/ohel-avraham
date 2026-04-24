"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { InputGroup } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { SECTORS } from "@/app/enums/sector";
import { ETHNICITIES } from "@/app/enums/ethnicity";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AuthHeader from "@/app/(auth)/_components/auth-header";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import AutocompleteAddress from "@/components/layout/autocomplete-address";
import { useT } from "@/lib/i18n/context";

const GuestForm = () => {
  const [isRegistering, startRegistering] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");
  const { t } = useT();

  const createGuest = useMutation(api.guests.createGuest);

  const form = useForm({
    resolver: zodResolver(guestSchema),
    defaultValues: guestSchemaDV,
  });

  const handleSubmit = (values: GuestType) => {
    console.log(values);
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
        <div className="flex flex-col space-y-5 justify-between w-full">
          <AuthHeader title={`${t.auth.welcomeNew} ${userType}`} />

          <Controller
            name="dob"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t.form.dateOfBirth}</FieldLabel>

                <InputGroup>
                  <Input
                    type="date"
                    {...field}
                    value={(field.value as string) || ""}
                    className="bg-transparent! border-transparent! shadow-none!"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </InputGroup>
              </Field>
            )}
          />

          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t.form.gender}</FieldLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.form.selectGender} />
                    <SelectContent>
                      {Object.values(GENDERS).map((gender, index) => (
                        <SelectItem value={gender} key={gender}>
                          {GENDERS[index]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

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

          <div className="flex space-x-5">
            <Controller
              name="sector"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>{t.form.sector}</FieldLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.form.selectSector} />
                      <SelectContent>
                        {Object.values(SECTORS).map((sector, index) => (
                          <SelectItem value={sector} key={sector}>
                            {SECTORS[index]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectTrigger>
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
                  <FieldLabel>{t.form.ethnicity}</FieldLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.form.selectEthnicity} />
                      <SelectContent>
                        {Object.values(ETHNICITIES).map((sector, index) => (
                          <SelectItem value={sector} key={sector}>
                            {ETHNICITIES[index]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectTrigger>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="notes"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t.form.notes}</FieldLabel>

                <Textarea
                  placeholder={t.form.notesPlaceholder}
                  {...field}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" className="w-full" disabled={isRegistering}>
            {isRegistering && <Spinner />}
            {t.common.continue}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default GuestForm;
