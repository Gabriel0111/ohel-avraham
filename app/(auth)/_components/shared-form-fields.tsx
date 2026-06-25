"use client";

import {
  Control,
  Controller,
  ControllerRenderProps,
  ControllerFieldState,
  FieldValues,
} from "react-hook-form";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, isValid, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { NativeSelect } from "@/components/ui/native-select";
import { SECTORS } from "@/app/enums/sector";
import { ETHNICITIES } from "@/app/enums/ethnicity";
import { LANGUAGES } from "@/app/enums/language";
import { Textarea } from "@/components/ui/textarea";
import { useEnumLabel, useT } from "@/lib/i18n/context";
import flags from "react-phone-number-input/flags";
import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const DOB_MIN = new Date("1924-01-01");

/** Insert slashes as the user types digits: "01011990" -> "01/01/1990". */
const maskDate = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 4),
    digits.slice(4, 8),
  ].filter(Boolean);
  return parts.join("/");
};

const DobInput = ({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<FieldValues, "dob">;
  fieldState: ControllerFieldState;
}) => {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(
    field.value instanceof Date ? format(field.value, "dd/MM/yyyy") : "",
  );

  const handleTextChange = (raw: string) => {
    const masked = maskDate(raw);
    setText(masked);
    // Only commit a fully-typed "dd/MM/yyyy"; otherwise clear so the required
    // rule still fires and partial input never backfills a wrong date.
    if (masked.length === 10) {
      const parsed = parse(masked, "dd/MM/yyyy", new Date());
      field.onChange(
        isValid(parsed) && parsed <= new Date() && parsed >= DOB_MIN
          ? parsed
          : undefined,
      );
    } else {
      field.onChange(undefined);
    }
  };

  return (
    <Field>
      <FieldLabel>{t.form.dateOfBirth}</FieldLabel>
      <div className="relative">
        <Input
          value={text}
          inputMode="numeric"
          placeholder="dd/MM/yyyy"
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={field.onBlur}
          aria-invalid={fieldState.invalid}
          className="pr-10"
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <CalendarIcon className="size-4" />
              <span className="sr-only">{t.form.dateOfBirth}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={field.value instanceof Date ? field.value : undefined}
              onSelect={(date) => {
                field.onChange(date);
                setText(date ? format(date, "dd/MM/yyyy") : "");
                setOpen(false);
              }}
              defaultMonth={
                field.value instanceof Date ? field.value : undefined
              }
              startMonth={new Date(1924, 0)}
              endMonth={new Date()}
              disabled={(date) => date > new Date() || date < DOB_MIN}
            />
          </PopoverContent>
        </Popover>
      </div>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};

export const DobField = ({ control }: { control: Control<FieldValues> }) => (
  <Controller
    name="dob"
    control={control}
    render={({ field, fieldState }) => (
      <DobInput field={field} fieldState={fieldState} />
    )}
  />
);

export const SectorEthnicityFields = ({
  control,
}: {
  control: Control<FieldValues>;
}) => {
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

export const LanguagesField = ({
  control,
}: {
  control: Control<FieldValues>;
}) => {
  const { t } = useT();
  const reduceMotion = useReducedMotion();
  return (
    <Controller
      name="languages"
      control={control}
      render={({ field, fieldState }) => {
        const selected: string[] = Array.isArray(field.value)
          ? field.value
          : [];
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
                      "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      isSelected
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <span className="w-5 shrink-0 overflow-hidden rounded-xs">
                      {Flag && <Flag title={lang.label} />}
                    </span>
                    {lang.label}
                    <AnimatePresence initial={false}>
                      {isSelected && (
                        <motion.span
                          initial={
                            reduceMotion
                              ? false
                              : { width: 0, opacity: 0, marginLeft: -8 }
                          }
                          animate={{ width: "auto", opacity: 1, marginLeft: 0 }}
                          exit={{ width: 0, opacity: 0, marginLeft: -8 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="flex items-center overflow-hidden"
                        >
                          <Check className="size-3.5 shrink-0 text-primary" />
                        </motion.span>
                      )}
                    </AnimatePresence>
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
            className="resize-none text-sm"
            rows={3}
            {...field}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
