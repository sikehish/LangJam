import { useState } from "react";
import { useCategoryQueries } from "../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "react-toastify";


function Category({
  category,
  token,
}: {
  category: { name: string; _id: string };
  token: string;
}) {
  const queryClient = useQueryClient();
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [deletingCategoryId, setDeletingCategoryId] = useState("");
  const [isDeleteClicked, setDeleteClicked] = useState(false);
  const [isEditClicked, setEditClicked] = useState(false);
  const {
    getCategories,
    createCategoryMutation,
    editCategoryMutation,
    deleteCategoryMutation,
  } = useCategoryQueries(queryClient, token);

  const handleEditSubmit = async () => {
    if (!editingCategoryId || !editedCategoryName) return;

    try {
       editCategoryMutation.mutate({
        categoryId: editingCategoryId,
        newName: editedCategoryName,
      });
      setEditedCategoryName(""); // Clear edited name after successful edit
    } catch (error) {
      console.error("Error editing category:", error);
      toast.error("Failed to edit category!");
    }
  };

  const handlePopoverClose = () => {
    if (isEditClicked) { // Check if popover was actually closed (edit mode)
      handleEditSubmit(); // Call edit submit logic on close
    }
    setEditClicked(prev=>!prev); // Reset edit state
  };

  return (
    <div>
      <p>{category.name}</p>
      <button onClick={() => setDeleteClicked((prev) => !prev)}>Edit</button>
      <button onClick={() => setEditClicked((prev) => !prev)}>Delete</button>
      {isEditClicked && (
        <Popover modal={true} open={isEditClicked} onOpenChange={handlePopoverClose}>
          <PopoverTrigger asChild>
            <Button variant="outline">Edit</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Category Name</h4>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="cname">Category Name</Label>
                  <Input
                    id="cname"
                    defaultValue={category.name} // Set default value to current name
                    className="col-span-2 h-8"
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleEditSubmit}>Save</Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export default Category;
