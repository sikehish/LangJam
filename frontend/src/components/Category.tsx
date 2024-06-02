import { FormEvent, useState } from "react";
import { useCategoryQueries } from "../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import edit and delete icons
import { Link } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

function Category({
  category,
}: {
  category: { name: string; _id: string };
}) {
  const queryClient = useQueryClient();
  const { state } = useAuthContext();
  const [editedCategoryName, setEditedCategoryName] = useState(category?.name);
  const [isEditClicked, setEditClicked] = useState(false);
  const {
    getCategories,
    createCategoryMutation,
    editCategoryMutation,
    deleteCategoryMutation,
  } = useCategoryQueries(queryClient);

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editedCategoryName) return;
    try {
      editCategoryMutation.mutate({
        categoryId: category._id,
        newName: editedCategoryName,
      });
      setEditedCategoryName(""); 
      setEditClicked(false);
    } catch (error) {
      console.error("Error editing category:", error);
      toast.error("Failed to edit category!");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    try {
      const result: boolean=confirm(`Are you sure you want to delete the ${editedCategoryName} category?`)
      if(result){
        deleteCategoryMutation.mutate(category._id);
      }else toast.error(`${editedCategoryName}: Delete event aborted`)
    } catch (error) {
      console.error("Error editing category:", error);
      toast.error("Failed to edit category!");
    }
  };

  const handleLinkClick = () => {
    if (!(state?.user)) {
      toast.error("You need to login to access this page");
    }
  };

  return (
    <div className="mb-4">
      <Link to={`/categories/${category._id}`} onClick={handleLinkClick}>
        <div className="p-4 rounded-lg shadow-md bg-blue-500">
          <p className="text-white">{category.name}</p>
        </div>
      </Link>
      {state?.user?.isAdmin && <div className="flex">
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
                <h4 className="font-medium leading-none">Edit Category</h4>
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
              <Button type="submit" onClick={handleEditSubmit}>Save</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>}
    </div>
  );
}

export default Category;
