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
import Autocomplete from "@/components/layout/autocomplete-adress";

const HostForm = () => {
  const [isRegistering, startRegistering] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");

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
        toast.error("Error creating guest");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <div className="flex flex-col space-y-5 justify-between w-full mx-auto">
          <AuthHeader title={`Welcome new ${userType}`} />

          <Controller
            name="dob"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Date of birth</FieldLabel>

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
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              // <Field>
              //   <FieldLabel>Region</FieldLabel>
              //
              //   <Input placeholder="12 Bayit Vagan, Jerusalem" {...field} />
              //   {/*<Autocomplete*/}
              //   {/*  onValueChange={field.onChange}*/}
              //   {/*  defaultValue={field.value}*/}
              //   {/*/>*/}
              //
              //   {fieldState.invalid && (
              //     <FieldError errors={[fieldState.error]} />
              //   )}
              // </Field>
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

          <div className="flex space-x-5">
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
                  <FieldLabel>Ethnicity</FieldLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Ethnicity" />
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
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Disability Access</FieldLabel>

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
                <FieldLabel>Kashrout</FieldLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Kashrout" />
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
                <FieldLabel>Notes</FieldLabel>

                <Textarea
                  placeholder="Notes for futher explanations"
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
            Continue
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default HostForm;
