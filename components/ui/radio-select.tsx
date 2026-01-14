import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioSelectProps {
  items: RadioGroupItem[];
  onSelected: (value: string) => void;
  defaultValue?: string;
}

export interface RadioGroupItem {
  label: string;
  sublabel?: string;
  description: string;
  value: string;
}

export default function RadioSelect({
  items,
  onSelected,
  defaultValue,
}: RadioSelectProps) {
  return (
    <RadioGroup
      className="gap-2"
      defaultValue={defaultValue}
      onValueChange={onSelected}
    >
      {items.map(({ label, sublabel, description, value }, index) => (
        <div
          key={index}
          className="relative flex w-full items-start gap-2 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50"
        >
          <RadioGroupItem
            aria-describedby={`${index}-1-description`}
            className="order-1 after:absolute after:inset-0"
            id={`${index}-1`}
            value={value}
          />
          <div className="grid grow gap-2">
            <Label htmlFor={`${index}-1`}>
              {label}{" "}
              {sublabel && (
                <span className="font-normal text-muted-foreground text-xs leading-[inherit]">
                  {sublabel}
                </span>
              )}
            </Label>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  );
}
