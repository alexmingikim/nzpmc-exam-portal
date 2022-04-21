import { getRepository, runTransaction } from 'fireorm'
import { packQuestion, packQuestions } from '../mappers/questionMapper'
import { Question, Quiz } from '../models'
import Option from '../models/option'
import { QuestionModel } from '../resolvers/custom/questionModel'
import { NotFoundError } from '../utils/errors'
import { firestore } from '../utils/firebase'

const QuizRepository = getRepository(Quiz)

const getQuestions = async (quizID: string): Promise<QuestionModel[]> => {
    return QuizRepository.runTransaction(async (tran) => {
        const quiz = await tran.findById(quizID)
        if (!quiz || !quiz.questions) {
            return []
        }

        const questions = await quiz.questions.find()
        return packQuestions(
            questions.map((question) => ({ quizID, question })),
        )
    })
}

const getQuestion = async (
    quizID: string,
    questionID: string,
): Promise<QuestionModel> => {
    return QuizRepository.runTransaction(async (tran) => {
        const quiz = await tran.findById(quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(questionID)
        if (!question) {
            throw new NotFoundError()
        }
        return packQuestion({ quizID, question })
    })
}

const addQuestion = async (
    quizID: string,
    q: string,
    imageURI: string,
    numOfAnswers: number,
    topics: string,
): Promise<QuestionModel> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)

        const quiz = await QuizTranRepository.findById(quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = new Question()

        question.question = q
        question.imageURI = imageURI
        question.numOfAnswers = numOfAnswers
        question.topics = topics

        const newQuestion = await quiz.questions.create(question)
        if (!newQuestion.options) {
            throw new NotFoundError()
        }

        const answer = new Option()
        answer.option = ''

        const newAnswer = await newQuestion.options.create(answer)

        const docRef = firestore.collection('Answers').doc(newAnswer.id)
        newQuestion.answer = docRef

        await quiz.questions.update(newQuestion)

        return packQuestion({ quizID, question: newQuestion })
    })
}

const editQuestion = async (
    quizID: string,
    id: string,
    q?: string,
    imageURI?: string,
    numOfAnswers?: number,
    answer?: string,
    topics?: string,
): Promise<QuestionModel> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const quiz = await QuizTranRepository.findById(quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(id)
        if (!question) {
            throw new NotFoundError()
        }

        question.question = q ? q : question.question
        question.imageURI = imageURI ? imageURI : question.imageURI
        question.numOfAnswers = numOfAnswers
            ? numOfAnswers
            : question.numOfAnswers
        question.topics = topics ? topics : question.topics
        question.modified = new Date()

        if (answer !== undefined && question.options) {
            const answerObj = await question.options.findById(
                question.answer.id,
            )

            if (answerObj === null) {
                throw new NotFoundError()
            }

            answerObj.option = answer
            await question.options.update(answerObj)
        }

        quiz.questions.update(question)

        return packQuestion({ quizID, question })
    })
}

export { getQuestions, getQuestion, addQuestion, editQuestion }