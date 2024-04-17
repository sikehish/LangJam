import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import UserQuizCarousel from '@/components/UserQuizCarousel';
import { Input } from '@/components/ui/input';
import { ArrowLeft, NotebookPen } from 'lucide-react';
import { attemptQuestion } from '../../../../backend/controllers/userController';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Label } from '@radix-ui/react-label';
import { toast } from 'react-toastify';
import { Textarea } from '@/components/ui/textarea';
const UserQuiz = ({ token }: { token: string }) => {
  const { subjectId, topicId, categoryId, quizId } = useParams();
  const [isNoteClicked, setNoteClicked] = useState(false)
  const [noteData, setNoteData]=useState({title:"", description:""})
  const navigate=useNavigate()

  const { data: quizDetails } = useQuery({
    queryKey: ['quizDetails', quizId],
    queryFn: async () => {
      const response = await fetch(`/api/users/attempted-quiz-details/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Unable to fetch quiz details');
      }
      return response.json();
    }
  });

  const { data } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const response = await fetch(`/api/entities/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Unable to fetch quizzes');
      }
      return response.json();
    }
  });

  const handleNoteSubmit = async (e: FormEvent) =>{
    e.preventDefault()
    try{
      if(!noteData.title.trim() || !noteData.description.trim()){
        throw new Error("Note is incomplete!")
      }
      const data={title: noteData.title.trim(), description: noteData.description.trim()}
      const response=await fetch(`/api/users/create-note`,{
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error creating a note :(");
      }

      toast.success("Note created!")
      setNoteData({title:"", description:""})

    }catch(e){
      toast.error((e as Error).message)
    }
  }

  const { title, questions, difficulty, numberOfQuestions, content } = data?.data ?? {};
  const { questionsAttempted, questionsCorrect}= quizDetails?.data?.attemptedQuizDetails ?? {}
  console.log(quizDetails?.data?.attemptedQuizDetails)

  return (
    <div className="w-[80%] lg:w-[60%] mx-auto mb-8">
      <div className="mx-0 text-center mt-8">
      {/* <ArrowLeft
          className="cursor-pointer ml-2 mb-3 transition-transform transform hover:scale-110"
          onClick={() => navigate(`/admin`)}
          /> */}
        <h2 className="text-2xl font-bold mb-4 pt-12">Quiz Title: <span className="underline">{title}</span></h2>
        <p className="mb-2">Difficulty Level: {difficulty}</p>
         {questions && questionsAttempted ? <p className="mb-4">
          Questions attempted: {questionsAttempted}/{questions.length} | Correct answers : {questionsCorrect}
        </p>  : <p className="mb-4">
          Number of Questions: {numberOfQuestions}
        </p>}
      </div>
      <div className='flex flex-row justify-center items-center mb-4'>
<button
   className="cursor-pointer transition-transform transform hover:scale-110 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
   onClick={() => navigate(`/categories/${categoryId}/subjects/${subjectId}/topics/${topicId}`)}
   >Return</button>
   {token && <div className="flex">
        <Popover modal={true}  open={isNoteClicked} onOpenChange={setNoteClicked} >
        <PopoverTrigger asChild title='Add Note'>
          <Button className='mx-2 bg-blue-600 px-4 text-xs rounded-lg' variant={"default"}>
            <NotebookPen className='text-xs' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-slate-200 rounded-lg py-3 px-3 mt-2" style={{ zIndex: 999 }}>
  <div className="space-y-4">
    <h4 className="font-medium leading-none text-center">Create Note</h4>
    <div className="grid gap-2">
      <div className="grid grid-cols-3 items-center gap-4">
        <Input
          id="noteTitle"
          placeholder="Note Title"
          value={noteData.title}
          className="col-span-3 h-8 w-full px-2 py-1 rounded "
          onChange={(e) => setNoteData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-3 items-center gap-4 mt-2">
        <Textarea
          id="noteDescription"
          placeholder="Note Description"
          value={noteData.description}
          className="col-span-3 h-8 w-full px-2 py-1 rounded"
          onChange={(e) => setNoteData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
    </div>
    <Button
      type="submit"
      onClick={handleNoteSubmit}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
    >
      Save
    </Button>
  </div>
</PopoverContent>

        </Popover>
      </div>}
   </div>
      {questions && 
        <UserQuizCarousel
        token={token}
        quizData={{questions, content, numberOfQuestions}}
        topic={topicId!}
        subject={subjectId!}
        category={categoryId!}
        title={title}
        quizId={quizId}
        difficulty={difficulty}
        />
      }
    </div>
  );
  
};

export default UserQuiz;
