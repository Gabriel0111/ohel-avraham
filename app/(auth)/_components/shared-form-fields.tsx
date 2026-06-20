"use client";

import { Control, Controller, FieldValues } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { NativeSelect } from "@/components/ui/native-select";
import { SECTORS } from "@/app/enums/sector";
import { ETHNICITIES } from "@/app/enums/ethnicity";
import { LANGUAGES } from "@/app/enums/language";
import { Textarea } from "@/components/ui/textarea";
import { useEnumLabel, useT } from "@/lib/i18n/context";
import flags from "react-phone-number-input/flags";
import { Check } from "lucide-react";

export const DobField = ({ control }: { control: Control<FieldValues> }) => {
  const { t } = useT();
  return (
    <Controller
      name="dob"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>{t.form.dateOfBirth}</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground",
                  fieldState.invalid && "border-destructive",
                )}
              >
                <CalendarIcon className="size-4 shrink-0" />
                {field.value instanceof Date
                  ? format(field.value, "dd/MM/yyyy")
                  : t.form.dateOfBirth}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={field.value instanceof Date ? field.value : undefined}
                onSelect={(date) => field.onChange(date)}
                defaultMonth={field.value instanceof Date ? field.value : undefined}
                startMonth={new Date(1924, 0)}
                endMonth={new Date()}
                disabled={(date) =>
                  date > new Date() || date < new Date("1924-01-01")
                }
              />
            </PopoverContent>
          </Popover>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export const SectorEthnicityFields = ({ control }: { control: Control<FieldValues> }) => {
  const { t } = useT();
  const el = useEnumLabel();
  return (
    <div className="grid grid-cols-2 gap-4">
      <Controller
        name="sector"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>{t.form.sector}</FieldLabel>
            <NativeSelect
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={t.form.selectSector}
              invalid={fieldState.invalid}
              options={SECTORS.map((sector) => ({
                value: sector,
                label: el.sector(sector),
              }))}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="ethnicity"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>{t.form.ethnicity}</FieldLabel>
            <NativeSelect
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={t.form.selectEthnicity}
              invalid={fieldState.invalid}
              options={ETHNICITIES.map((ethnicity) => ({
                value: ethnicity,
                label: el.ethnicity(ethnicity),
              }))}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
};

export const LanguagesField = ({ control }: { control: Control<FieldValues> }) => {
  const { t } = useT();
  return (
    <Controller
      name="languages"
      control={control}
      render={({ field, fieldState }) => {
        const selected: string[] = Array.isArray(field.value) ? field.value : [];
        const toggle = (value: string) => {
          field.onChange(
            selected.includes(value)
              ? selected.filter((v) => v !== value)
              : [...selected, value],
          );
        };
        return (
          <Field>
            <FieldLabel>{t.form.languages}</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const Flag = flags[lang.country];
                const isSelected = selected.includes(lang.value);
                return (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => toggle(lang.value)}
                    aria-pressed={isSelected}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      isSelected
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <span className="w-5 shrink-0 overflow-hidden rounded-xs">
                      {Flag && <Flag title={lang.label} />}
                    </span>
                    {lang.label}
                    {isSelected && (
                      <Check className="size-3.5 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

export const NotesField = ({ control }: { control: Control<FieldValues> }) => {
  const { t } = useT();
  return (
    <Controller
      control={control}
      name="notes"
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>{t.form.notes}</FieldLabel>
          <Textarea
            placeholder={t.form.notesPlaceholder}
            className="resize-none"
            rows={3}
            {...field}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
