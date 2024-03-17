import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import edit and delete icons
import { Link } from "react-router-dom";
import { useQuizQueries } from "@/hooks/useQuizQueries";
import { IQuiz } from "@/pages/admin/Quizzes";

function Quiz({
  quiz,
  token,
  categoryId,
  subjectId
}: {
    quiz: IQuiz,
  token: string,
  categoryId: string,
  subjectId: string
}) {
  const queryClient = useQueryClient();
  const [editedQuizTitle, setEditedQuizTitle] = useState(quiz?.title);
  const [isEditClicked, setEditClicked] = useState(false);
  const {
    editQuizMutation,
    deleteQuizMutation,
  } = useQuizQueries(queryClient, token, quiz.topic);

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editedQuizTitle) return;
      console.log(editedQuizTitle)
    try {
        editQuizMutation.mutate({
        quizId: quiz._id,
        newTitle: editedQuizTitle,
      });
      setEditedQuizTitle(""); 
      setEditClicked(false);
    } catch (error) {
      console.error("Error editing quiz:", error);
      toast.error("Failed to edit quiz!");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    try {
      const result: boolean=confirm(`Are you sure you want to delete the ${editedQuizTitle} quiz?`)
      if(result){
        deleteQuizMutation.mutate(quiz._id);
      }else toast.error(`${editedQuizTitle}: Delete event aborted`)
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz!");
    }
  };

  return (
    <div className="mb-4">
      <Link to={`/admin/categories/${categoryId}/subjects/${subjectId}/topics/${quiz.topic}/quizzes/${quiz._id}`}>
      <div className="p-4 rounded-lg shadow-md bg-blue-500">
        <p className="text-white">{quiz.title}</p>
      </div>
      </Link>
      <div className="flex">
        {/* <button onClick={} className="mr-2"><FaTrash /></button> */}
        <Button variant={"ghost"} onClick={handleDelete}>
                <FaTrash className="text-red-800" />
              </Button>
      </div>
    </div>
  );
}

export default Quiz;
