export interface SurveyQuestionOption {
  id: number
  text: string
}

export interface SurveyQuestion {
  id: number
  type: 'radio' | 'stars' | 'textarea' | 'contact'
  required: boolean
  text: string
  hint: string
  options: SurveyQuestionOption[]
}

export interface SurveyData {
  id: number
  slug: string
  title: string
  description: string
  questions: SurveyQuestion[]
}

export interface SurveyAnswerPayload {
  question_id: number
  selected_option_id?: number | null
  stars_value?: number | null
  text_value?: string
}

export interface SurveySubmitPayload {
  answers: SurveyAnswerPayload[]
  contact_name: string
  contact_info: string
}
