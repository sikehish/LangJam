import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
 
export function CreateBtn({saveMethod, name}: {saveMethod: any, name: string}) {
    const [data, setData] = useState("")

    function submitHandler(e:React.FormEvent){
        e.preventDefault()
        console.log("CLICKED",data)
        const {mutate}=saveMethod;
        mutate({name: data});
    }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create {name}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create {name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="createname" className="text-center">
              {name} Name
            </Label>
            <Input
              id="createname"
              defaultValue=":))"
              className="col-span-3"
              onChange={(e)=>{
                setData(e.target.value)
                console.log(e.target.value)
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={submitHandler}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}