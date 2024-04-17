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
import { useAuthContext } from "@/context/AuthContext";
import { IQuiz } from "@/pages/Quizzes";
import { CircleCheckBig, CirclePlus, CircleSlash, Paintbrush2 } from "lucide-react";

function UserQuizTile({
  quiz,
  token,
  categoryId,
  subjectId, filter
}: {
    quiz: IQuiz,
  token: string,
  categoryId: string,
  subjectId: string,
  filter: string
}) {
  const {state}=useAuthContext()
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


  return (
    <div className="my-5">
  <Link to={`/categories/${categoryId}/subjects/${subjectId}/topics/${quiz.topic}/quizzes/${quiz._id}`}>
    <div className={`p-4 rounded-lg shadow-md ${filter=="yetto" && "bg-blue-500 "} ${filter=="incomplete" && "bg-yellow-600"} ${filter=="completed" && "bg-green-500"} flex justify-between items-center`}>
      <p className="text-white">{quiz.title}</p>
      {filter=="yetto" && <CirclePlus className="text-yellow-400" />}
      {filter=="incomplete" && <CircleSlash className="text-yellow-50" />}
      {filter=="completed" && <CircleCheckBig className="text-green-100" />}
    </div>
  </Link>
</div>
  );
}

export default UserQuizTile;
