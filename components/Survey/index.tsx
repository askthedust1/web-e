import React, { FC, useState } from 'react'
import { SurveyData, SurveyQuestion, SurveySubmitPayload } from 'services/api/SurveyApi.models'
import { SurveyApi } from 'services/api/SurveyApi'
import { toast } from 'react-toastify'
import { useTranslation } from 'next-i18next'
import s from './Survey.module.scss'

interface Props {
  survey: SurveyData
}

type Answers = Record<number, { optionId?: number; stars?: number; text?: string }>

const SurveyForm: FC<Props> = ({ survey }) => {
  const { t } = useTranslation('common')
  const [step, setStep] = useState(-1) // -1 = intro screen
  const [answers, setAnswers] = useState<Answers>({})
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const questions = survey.questions

  const setAnswer = (qId: number, value: Partial<Answers[number]>) => {
    setAnswers((prev) => ({ ...prev, [qId]: { ...prev[qId], ...value } }))
    setError('')
  }

  const validate = (q: SurveyQuestion): boolean => {
    if (!q.required) return true
    const ans = answers[q.id]
    if (q.type === 'radio') return !!ans?.optionId
    if (q.type === 'stars') return !!ans?.stars
    if (q.type === 'contact') return !!ans?.text?.trim()
    if (q.type === 'textarea') return !!ans?.text?.trim()
    return true
  }

  const handleNext = () => {
    if (step === -1) {
      setStep(0)
      return
    }
    const q = questions[step]
    if (!validate(q)) {
      setError(t('survey.requiredFieldError'))
      return
    }
    if (step < questions.length - 1) {
      setStep(step + 1)
      setError('')
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
      setError('')
    } else if (step === 0) {
      setStep(-1)
      setError('')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const contactQ = questions.find((q) => q.type === 'contact')
      const payload: SurveySubmitPayload = {
        answers: questions
          .filter((q) => q.type !== 'contact')
          .map((q) => {
            const ans = answers[q.id] || {}
            return {
              question_id: q.id,
              selected_option_id: ans.optionId || null,
              stars_value: ans.stars || null,
              text_value: ans.text || '',
            }
          }),
        contact_name: contactQ ? answers[contactQ.id]?.text || '' : '',
        contact_info: '',
      }
      await SurveyApi.submitSurvey(survey.slug, payload)
      setSubmitted(true)
    } catch {
      toast.error(t('survey.submitError'))
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className={s.successScreen}>
        <div className={s.successIcon}>✓</div>
        <h2 className={s.successTitle}>{t('survey.successTitle')}</h2>
        <p className={s.successText}>{t('survey.successText')}</p>
      </div>
    )
  }

  // Intro screen
  if (step === -1) {
    return (
      <div className={s.surveyPage}>
        <div className={s.card}>
          <div className={s.header}>
            <h1 className={s.title}>{survey.title}</h1>
            <p className={s.description}>{survey.description}</p>
          </div>
          <div className={s.buttons} style={{ justifyContent: 'center' }}>
            <button className={s.btnNext} onClick={handleNext}>
              {t('survey.startButton')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[step]
  const currentAns = answers[currentQ.id] || {}

  return (
    <div className={s.surveyPage}>
      <div className={s.card}>
        <div className={s.progress}>
          <div className={s.progressBar}>
            <div
              className={s.progressFill}
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className={s.progressText}>
            {step + 1} / {questions.length}
          </span>
        </div>

        <div className={s.questionBlock} key={currentQ.id}>
          <h2 className={s.questionText}>{currentQ.text}</h2>
          {currentQ.hint && <p className={s.hint}>{currentQ.hint}</p>}

          {currentQ.type === 'radio' && (
            <div className={s.optionsList}>
              {currentQ.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`${s.optionLabel} ${
                    currentAns.optionId === opt.id ? s.optionSelected : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${currentQ.id}`}
                    checked={currentAns.optionId === opt.id}
                    onChange={() => setAnswer(currentQ.id, { optionId: opt.id })}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          )}

          {currentQ.type === 'stars' && (
            <div className={s.starsRow}>
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`${s.star} ${(currentAns.stars || 0) >= val ? s.starActive : ''}`}
                  onClick={() => setAnswer(currentQ.id, { stars: val })}
                  aria-label={t('survey.starLabel', { value: val })}
                >
                  ★
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'textarea' && (
            <textarea
              className={s.textarea}
              placeholder={t('survey.textareaPlaceholder')}
              value={currentAns.text || ''}
              onChange={(e) => setAnswer(currentQ.id, { text: e.target.value })}
            />
          )}

          {currentQ.type === 'contact' && (
            <input
              type="text"
              className={s.contactInput}
              placeholder={t('survey.contactPlaceholder')}
              value={currentAns.text || ''}
              onChange={(e) => setAnswer(currentQ.id, { text: e.target.value })}
            />
          )}

          {error && <p className={s.error}>{error}</p>}
        </div>

        <div className={s.buttons}>
          <button className={s.btnBack} onClick={handleBack}>
            {t('survey.backButton')}
          </button>
          <button className={s.btnNext} onClick={handleNext} disabled={loading}>
            {step === questions.length - 1
              ? loading
                ? t('survey.submittingButton')
                : t('survey.submitButton')
              : t('survey.nextButton')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SurveyForm
