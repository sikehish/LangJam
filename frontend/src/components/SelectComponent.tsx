import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  export function SelectComponent({ setFilter }: { setFilter: (value: string) => void }) {
    return (
      <Select defaultValue="yetto" onValueChange={value => setFilter(value)}>
        <SelectTrigger className="w-[180px] bg-gray-600 text-white">
          <SelectValue placeholder="Quiz Filter" />
        </SelectTrigger>
        <SelectContent className="bg-gray-600 text-white">
          <SelectGroup>
            <SelectItem value="attempted">Attempted</SelectItem>
            <SelectItem value="yetto">Yet to attempt</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
  