import Quiz, { IQuiz } from "../models/quizModel";
import { UserDocument } from "../models/userModel";
import { Types } from 'mongoose';

export async function getQuizzesNotAttempted(user: UserDocument, topicId: string) {
   
    let quizzesNotAttempted=[]
    if(!user.quizAttempts) quizzesNotAttempted=await Quiz.find({topic: topicId})
    else{
        const userAttemptedQuizIds = Array.from(user.quizAttempts.keys());
        quizzesNotAttempted = await Quiz.find({ _id: { $nin: userAttemptedQuizIds }, topic: topicId });
}  
    return quizzesNotAttempted;
}

export async function getQuizzesCompleted(user: UserDocument, topicId: string) {
    const quizzes: IQuiz[] = await Quiz.find({ topic: topicId });
    if(!user.quizAttempts) return []
    const quizzesCompleted = quizzes.filter((quiz) => {
        const quizId = quiz._id.toString();
        const quizAttempt = user.quizAttempts.get(quizId);
        return quizAttempt && quizAttempt.questionsAttempted === quiz.questions.length;
    });
    return quizzesCompleted;
}

export async function getQuizzesIncomplete(user: UserDocument, topicId: string) {
    const quizzes: IQuiz[] = await Quiz.find({ topic: topicId });
    if(!user.quizAttempts) return []
    const quizzesIncomplete = quizzes.filter((quiz) => {
        const quizId = quiz._id.toString();
        const quizAttempt = user.quizAttempts.get(quizId);
        return quizAttempt && quizAttempt.questionsAttempted > 0 && quizAttempt.questionsAttempted < quiz.questions.length;
    });
    return quizzesIncomplete;
}