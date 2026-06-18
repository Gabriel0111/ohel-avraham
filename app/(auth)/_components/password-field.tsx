"use client";

import { useState } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { EyeIcon, EyeOffIcon, type LucideIcon } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

type PasswordFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  icon?: LucideIcon;
};

/**
 * Password input with a show/hide toggle, wired to react-hook-form.
 * Shares one implementation across login and sign-up so every password
 * field has identical states (hover, focus, invalid) and a11y wiring.
 */
export function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  autoComplete,
  icon: Icon,
}: PasswordFieldProps<T>) {
  const { t } = useT();
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <InputGroup aria-invalid={fieldState.invalid}>
            {Icon && (
              <InputGroupAddon align="inline-start">
                <Icon
                  className={cn(fieldState.invalid && "text-destructive")}
                />
              </InputGroupAddon>
            )}
            <InputGroupInput
              id={name}
              type={visible ? "text" : "password"}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-invalid={fieldState.invalid}
              {...field}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-xs"
                aria-label={visible ? t.form.hidePassword : t.form.showPassword}
                aria-pressed={visible}
                onClick={() => setVisible((v) => !v)}
              >
                {visible ? <EyeOffIcon /> : <EyeIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
