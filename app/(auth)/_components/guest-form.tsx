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
import Autocomplete from "@/components/layout/autocomplete-adress";

const GuestForm = () => {
  const [isRegistering, startRegistering] = useTransition();

  const router = useRouter();

  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");

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
        toast.error("Error creating guest");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <div className="flex flex-col space-y-5 justify-between w-full">
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
                    value={(field.value as string) || ""}
                    className="bg-transparent! border-transparent!"
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
                <FieldLabel>Gender</FieldLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Gender" />
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
                <FieldLabel>Region</FieldLabel>

                <Autocomplete
                  onValueChange={(e) => {
                    console.log("e", e);
                    field.onChange(e);
                    console.log(field.onChange);

                    console.log(form.getValues());
                  }}
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

export default GuestForm;
