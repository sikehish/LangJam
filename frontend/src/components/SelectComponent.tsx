import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
   
  export function SelectComponent() {
    return (
      <Select defaultValue="yetto">
        <SelectTrigger className="w-[180px] bg-gray-600 text-white">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent className="bg-gray-600 text-white">
          <SelectGroup>
            <SelectItem value="attempted">Attempted</SelectItem>
            <SelectItem value="yetto">Yet to attempt</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }