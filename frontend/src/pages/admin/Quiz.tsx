import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminQuizCarousel from '@/components/AdminQuizCarousel';
import { Input } from '@/components/ui/input';

const Quiz = ({ token }: { token: string }) => {
  const { subjectId, topicId, categoryId, quizId } = useParams();

  const { data: quizData } = useQuery({
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

  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedDifficulty, setEditedDifficulty] = useState<string>("");

  useEffect(() => {
    if (quizData) {
      setEditedTitle(quizData.data.title);
      setEditedDifficulty(quizData.data.difficulty);
    }
  }, [quizData]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedDifficulty(e.target.value);
  };

  return (
    <div className="w-[80%] lg:w-[60%] mx-auto mb-8">
      <div className="mx-0 text-center mt-8">
        <label className="text-2xl font-bold mb-4 pt-12 flex flex-row items-center justify-center">Quiz:&nbsp;
          <Input
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            className="form-input mr-2 w-auto"
            placeholder="Enter quiz title"
          />
        </label>
        <p className="mb-2">Difficulty Level: 
          <select
            value={editedDifficulty}
            onChange={handleDifficultyChange}
            className="form-select mr-2"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </p>
        <p className="mb-4">
          Number of Questions: {quizData?.data?.numberOfQuestions}
        </p>
      </div>
      {quizData && 
        <AdminQuizCarousel
          token={token}
          quizData={quizData?.data}
          topic={topicId!}
          subject={subjectId!}
          category={categoryId!}
          title={editedTitle}
          mode={"edit-view"}
          quizId={quizId}
          difficulty={editedDifficulty}
        />
      }
    </div>
  );
  
};

export default Quiz;
