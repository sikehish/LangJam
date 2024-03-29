import { FormEvent, useState } from "react";
import { useSubjectQueries } from "../hooks/useSubjectQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import edit and delete icons
import { Link } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

function Subject({
  subject,
  token,
}: {
  subject: { name: string; _id: string, category:string};
  token: string;
}) {
  const {state}=useAuthContext()
  const queryClient = useQueryClient();
  const [editedSubjectName, setEditedSubjectName] = useState(subject?.name);
  const [isEditClicked, setEditClicked] = useState(false);
  const {
    editSubjectMutation,
    deleteSubjectMutation,
  } = useSubjectQueries(queryClient, token, subject.category);

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editedSubjectName) return;
      console.log(editedSubjectName)
    try {
      editSubjectMutation.mutate({
        subjectId: subject._id,
        newName: editedSubjectName,
      });
      setEditedSubjectName(""); 
      setEditClicked(false);
    } catch (error) {
      console.error("Error editing subject:", error);
      toast.error("Failed to edit subject!");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    try {
      const result: boolean=confirm(`Are you sure you want to delete the ${editedSubjectName} subject?`)
      if(result){
        deleteSubjectMutation.mutate(subject._id);
      }else toast.error(`${editedSubjectName}: Delete event aborted`)
    } catch (error) {
      console.error("Error editing subject:", error);
      toast.error("Failed to edit subject!");
    }
  };

  return (
    <div className="mb-4">
      <Link to={`/categories/${subject.category}/subjects/${subject._id}/`}>
      <div className="p-4 rounded-lg shadow-md bg-blue-500">
        <p className="text-white">{subject.name}</p>
      </div>
      </Link>
      {token && state?.user?.isAdmin && <div className="flex">
        {/* <button onClick={} className="mr-2"><FaTrash /></button> */}
        <Button variant={"ghost"} onClick={handleDelete}>
                <FaTrash className="text-red-800" />
              </Button>
          <Popover modal={true} open={isEditClicked} onOpenChange={setEditClicked}>
            <PopoverTrigger asChild>
              <Button variant={"ghost"}>
                <FaEdit />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Subject Name</h4>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="cname">Subject Name</Label>
                    <Input
                      id="cname"
                      defaultValue={subject.name} // Set default value to current name
                      className="col-span-2 h-8"
                      onChange={(e) => setEditedSubjectName(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" onClick={handleEditSubmit}>Save</Button>
              </div>
            </PopoverContent>
          </Popover>
      </div>}
    </div>
  );
}

export default Subject;
