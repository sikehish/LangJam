import Quiz, { IQuiz } from "../models/quizModel";
import { UserDocument } from "../models/userModel";
import { Types } from 'mongoose';

export async function getQuizzesNotAttempted(user: UserDocument, topicId: string) {
    const userAttemptedQuizIds = Array.from(user.quizAttempts.keys());
    const quizzesNotAttempted = await Quiz.find({ _id: { $nin: userAttemptedQuizIds }, topic: topicId });
    return quizzesNotAttempted;
}

export async function getQuizzesCompleted(user: UserDocument, topicId: string) {
    const quizzes: IQuiz[] = await Quiz.find({ topic: topicId });
    const quizzesCompleted = quizzes.filter((quiz) => {
        const quizId = quiz._id.toString();
        const quizAttempt = user.quizAttempts.get(quizId);
        return quizAttempt && quizAttempt.questionsAttempted === quiz.questions.length;
    });
    return quizzesCompleted;
}

export async function getQuizzesAttempted(user: UserDocument, topicId: string) {
    const quizzes: IQuiz[] = await Quiz.find({ topic: topicId });
    const quizzesAttempted = quizzes.filter((quiz) => {
        const quizId = quiz._id.toString();
        const quizAttempt = user.quizAttempts.get(quizId);
        return quizAttempt && quizAttempt.questionsAttempted > 0 && quizAttempt.questionsAttempted < quiz.questions.length;
    });
    return quizzesAttempted;
}
