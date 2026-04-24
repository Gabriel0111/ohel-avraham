"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SECTORS } from "@/app/enums/sector";
import { ETHNICITIES } from "@/app/enums/ethnicity";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { hostSchema, hostSchemaDV, HostType } from "@/app/schemas/host";

import * as RPNInput from "react-phone-number-input";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/app/(auth)/_components/phone-number-comps";
import { Switch } from "@/components/ui/switch";
import { KASHROUT } from "@/app/enums/kashrout";
import AuthHeader from "@/app/(auth)/_components/auth-header";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import AutocompleteAddress from "@/components/layout/autocomplete-address";
import { useT } from "@/lib/i18n/context";

const HostForm = () => {
  const [isRegistering, startRegistering] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");
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
        <div className="flex flex-col space-y-5 justify-between w-full mx-auto">
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
                    className="bg-transparent! border-transparent!"
                    value={(field.value as string) || ""}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </InputGroup>
              </Field>
            )}
          />

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

          <div className="flex space-x-5 items-center">
            <Controller
              name="floor"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>{t.form.floor}</FieldLabel>

                  <Input type="string" {...field} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="hasDisabilityAccess"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>{t.form.disabilityAccess}</FieldLabel>

                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="kashrout"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t.form.kashrout}</FieldLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.form.selectKashrout} />
                    <SelectContent>
                      {Object.values(KASHROUT).map((kashrout, index) => (
                        <SelectItem value={kashrout} key={kashrout}>
                          {KASHROUT[index]}
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

export default HostForm;
