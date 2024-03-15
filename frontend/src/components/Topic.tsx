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
import { useTopicQueries } from "@/hooks/useTopicQueries";

function Topic({
  topic,
  token,
  categoryId,
}: {
    topic: { name: string; _id: string, subject:string},
  token: string,
  categoryId: string
}) {
  const queryClient = useQueryClient();
  const [editedTopicName, setEditedTopicName] = useState(topic?.name);
  const [isEditClicked, setEditClicked] = useState(false);
  const {
    editTopicMutation,
    deleteTopicMutation,
  } = useTopicQueries(queryClient, token, topic.subject);

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editedTopicName) return;
      console.log(editedTopicName)
    try {
        editTopicMutation.mutate({
        topicId: topic._id,
        newName: editedTopicName,
      });
      setEditedTopicName(""); 
      setEditClicked(false);
    } catch (error) {
      console.error("Error editing subject:", error);
      toast.error("Failed to edit subject!");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    try {
      const result: boolean=confirm(`Are you sure you want to delete the ${editedTopicName} subject?`)
      if(result){
        deleteTopicMutation.mutate(topic._id);
      }else toast.error(`${editedTopicName}: Delete event aborted`)
    } catch (error) {
      console.error("Error editing subject:", error);
      toast.error("Failed to edit subject!");
    }
  };

  return (
    <div className="mb-4">
      <Link to={`/admin/categories/${categoryId}/subjects/${topic.subject}/topics/${topic._id}`}>
      <div className="p-4 rounded-lg shadow-md bg-blue-500">
        <p className="text-white">{topic.name}</p>
      </div>
      </Link>
      <div className="flex">
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
                      defaultValue={topic.name} // Set default value to current name
                      className="col-span-2 h-8"
                      onChange={(e) => setEditedTopicName(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" onClick={handleEditSubmit}>Save</Button>
              </div>
            </PopoverContent>
          </Popover>
      </div>
    </div>
  );
}

export default Topic;
