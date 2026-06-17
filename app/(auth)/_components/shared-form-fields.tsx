"use client";

import { Control, Controller, FieldValues } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SECTORS } from "@/app/enums/sector";
import { ETHNICITIES } from "@/app/enums/ethnicity";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/i18n/context";

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
  return (
    <div className="grid grid-cols-2 gap-4">
      <Controller
        name="sector"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>{t.form.sector}</FieldLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.form.selectSector} />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((sector) => (
                  <SelectItem value={sector} key={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.form.selectEthnicity} />
              </SelectTrigger>
              <SelectContent>
                {ETHNICITIES.map((ethnicity) => (
                  <SelectItem value={ethnicity} key={ethnicity}>
                    {ethnicity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
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
