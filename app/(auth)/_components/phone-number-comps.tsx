"use client";

import { useState } from "react";
import flags from "react-phone-number-input/flags";
import { CheckIcon, ChevronsUpDown, PhoneIcon } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import { useCoarsePointer } from "@/hooks/use-coarse-pointer";

export const PhoneInput = ({
  className,
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <Input
      data-slot="phone-input"
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      className={cn(
        "-ms-px rounded-s-none shadow-none focus-visible:z-10",
        className,
      )}
      {...props}
    />
  );
};

PhoneInput.displayName = "PhoneInput";

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
};

export const CountrySelect = ({
  disabled,
  value: selectedCountry,
  onChange,
  options: countryList,
}: CountrySelectProps) => {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const coarse = useCoarsePointer();

  // Phones / tablets: the OS-native <select> picker instead of the combobox.
  if (coarse === true) {
    return (
      <div className="relative w-[5.75rem] shrink-0">
        <select
          aria-label={t.form.country}
          disabled={disabled}
          value={selectedCountry}
          onChange={(e) => onChange(e.target.value as RPNInput.Country)}
          className={cn(
            "h-9 w-full appearance-none overflow-hidden rounded-s-md rounded-e-none border border-e-0 border-input bg-background ps-2.5 pe-6 text-sm text-ellipsis whitespace-nowrap outline-none",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
          )}
        >
          {/* Only the calling code — the trigger is too narrow for a country
              name and the flag already identifies the country. */}
          {countryList.map(({ value }) =>
            value ? (
              <option key={value} value={value}>
                +{RPNInput.getCountryCallingCode(value)}
              </option>
            ) : null,
          )}
        </select>
        <ChevronsUpDown className="pointer-events-none absolute end-1.5 top-1/2 size-3.5 -translate-y-1/2 opacity-50" />
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex gap-1 rounded-s-md rounded-e-none border-e-0 px-3 focus:z-10"
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              "-me-2 size-4 opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t.form.searchCountry} />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>{t.form.noCountryFound}</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={(country) => {
                        onChange(country);
                        setOpen(false);
                      }}
                    />
                  ) : null,
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
}: CountrySelectOptionProps) => {
  return (
    <CommandItem
      className="gap-2"
      // Match the search input against the country name + calling code.
      value={`${countryName} +${RPNInput.getCountryCallingCode(country)}`}
      onSelect={() => onChange(country)}
    >
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-muted-foreground">
        {`+${RPNInput.getCountryCallingCode(country)}`}
      </span>
      <CheckIcon
        className={cn(
          "ms-auto size-4",
          country === selectedCountry ? "opacity-100" : "opacity-0",
        )}
      />
    </CommandItem>
  );
};

export const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-foreground/10 [&_svg]:size-full">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <PhoneIcon size={14} aria-hidden="true" />
      )}
    </span>
  );
};
