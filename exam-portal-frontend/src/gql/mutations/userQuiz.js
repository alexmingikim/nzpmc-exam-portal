import gql from 'graphql-tag'
import {
    UserQuizQuestionFragment,
    UserQuizOptionFragment,
} from '../fragments/userQuiz'

export const UserQuizUpdateFlagMutation = gql`
    mutation UserQuizUpdateFlagMutation($input: EditUserQuizQuestionInput!) {
        editUserQuizQuestion(input: $input) {
            ...UserQuizQuestionFragment
        }
    }
    ${UserQuizQuestionFragment}
`

export const UserQuizUpdateAnswerMutation = gql`
    mutation UserQuizUpdateAnswerMutation($input: EditUserQuizQuestionInput!) {
        editUserQuizQuestion(input: $input) {
            id
            userAnswer {
                ...UserQuizOptionFragment
            }
        }
    }
    ${UserQuizOptionFragment}
`
