import Quiz from "../models/quizModel";
import { UserDocument } from "../models/userModel";

export async function getQuizzesNotAttempted(user: UserDocument) {
    const userAttemptedQuizIds = Array.from(user.attempts.keys());
    const quizzesNotAttempted = await Quiz.find({ _id: { $nin: userAttemptedQuizIds } });
    return quizzesNotAttempted;
}

export async function getQuizzesCompleted(user: UserDocument) {
    const quizzes = await Quiz.find({});
    const quizzesCompleted = quizzes.filter((quiz) => {
        const quizId = quiz._id.toString();
        const quizAttempt = user.quizAttempts.get(quizId);
        return quizAttempt && quizAttempt.questionsAttempted === quiz.questions.length;
    });
    return quizzesCompleted;
}

export async function getQuizzesAttempted(user: UserDocument) {
    const quizzes = await Quiz.find({});
    const quizzesAttempted = quizzes.filter((quiz) => {
        const quizId = quiz._id.toString();
        const quizAttempt = user.quizAttempts.get(quizId);
        return quizAttempt && quizAttempt.questionsAttempted > 0 && quizAttempt.questionsAttempted < quiz.questions.length;
    });
    return quizzesAttempted;
}
