import { Form } from './models/Form';

export const FORM: Form [] = [
  {
  'formId': 1,
  'formName': 'US Private Banking Questionnaire',
  'categoriesList': [
    {
      'categoryId': 1,
      'categoryWeight': 33.3,
      'categoryName': 'Relationship and repayment history',
      'formId': 1,
      'questionList': [
        {
          'questionId': 1,
          'questionContent': 'Length of relationship with the bank',
          'questionWeight': 6.7,
          'categoryId': 1,
          'answerList': [
            {
              'answerId': 1,
              'questionId': 1,
              'answerContent': 'New Client',
              'answerScore': 0
            },
            {
              'answerId': 2,
              'questionId': 1,
              'answerContent': '0-3 years',
              'answerScore': 33
            }
          ]
        },
        {
          'questionId': 2,
          'questionContent': 'Credit score',
          'questionWeight': 20.0,
          'categoryId': 1,
          'answerList': [
            {
              'answerId': 5,
              'questionId': 2,
              'answerContent': 'Under 600',
              'answerScore': 0
            },
            {
              'answerId': 6,
              'questionId': 2,
              'answerContent': '600-700',
              'answerScore': 33
            }
          ]
        }
      ]
    },
    {
      'categoryId': 3,
      'categoryWeight': 66.7,
      'categoryName': 'Debt repayment capacity',
      'formId': 1,
      'questionList': [
        {
          'questionId': 9,
          'questionContent': 'Ratio of annual debt payments to recurring net personal cash-flow (on a 5 year required payback)',
          'questionWeight': 28.55,
          'categoryId': 3,
          'answerList': [
            {
              'answerId': 26,
              'questionId': 9,
              'answerContent': 'Over 75%',
              'answerScore': 0
            },
            {
              'answerId': 27,
              'questionId': 9,
              'answerContent': '65%-75%',
              'answerScore': 25
            }
          ]
        }
      ]
    }
  ]
},
    {
      'formId': 3,
      'formName': 'US Global Questionnaire',
      'categoriesList': [
        {
          'categoryId': 2,
          'categoryWeight': 33.3,
          'categoryName': 'mnmnmn and repayment history',
          'formId': 3,
          'questionList': [
            {
              'questionId': 1,
              'questionContent': 'kjoobj of relationship with the bank',
              'questionWeight': 6.7,
              'categoryId': 2,
              'answerList': [
                {
                  'answerId': 1,
                  'questionId': 1,
                  'answerContent': 'New Client',
                  'answerScore': 0
                },
                {
                  'answerId': 2,
                  'questionId': 1,
                  'answerContent': '0-3 years',
                  'answerScore': 33
                }
              ]
            },
            {
              'questionId': 2,
              'questionContent': 'Credit score',
              'questionWeight': 20.0,
              'categoryId': 1,
              'answerList': [
                {
                  'answerId': 5,
                  'questionId': 2,
                  'answerContent': 'Under 600',
                  'answerScore': 0
                },
                {
                  'answerId': 6,
                  'questionId': 2,
                  'answerContent': '600-700',
                  'answerScore': 33
                }
              ]
            }
          ]
        },
        {
          'categoryId': 3,
          'categoryWeight': 66.7,
          'categoryName': 'Debt repayment capacity',
          'formId': 1,
          'questionList': [
            {
              'questionId': 9,
              'questionContent': 'Ratio of annual debt payments to recurring net personal cash-flow (on a 5 year required payback)',
              'questionWeight': 28.55,
              'categoryId': 3,
              'answerList': [
                {
                  'answerId': 26,
                  'questionId': 9,
                  'answerContent': 'Over 75%',
                  'answerScore': 0
                },
                {
                  'answerId': 27,
                  'questionId': 9,
                  'answerContent': '65%-75%',
                  'answerScore': 25
                }
              ]
            }
          ]
        }
      ]
    }
  ]
;
