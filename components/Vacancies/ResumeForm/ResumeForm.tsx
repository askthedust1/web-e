import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import s from './ResumeForm.module.scss'
import Container from 'components/Container'
import { RscInput } from 'components/ui/Input'
import { Textarea } from 'components/ui/Textarea'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'
import InputDataPicker from 'components/Input/InputDataPicker'
import Button from 'components/Buttons/Button'
import { EMAIL_SINX } from 'helpers/email-sinx'
import PopUp from 'components/PopUp'
import { store } from 'store'
import { OtherCreateApi, OtherPageApi } from 'services/api/OtherApi'
import Icon from 'components/Icon'

// ── ComboOption ────────────────────────────────────────────────────────────────
interface ComboOption {
  id: number
  name: string
}

// ── BranchCombobox (одиночный выбор) ─────────────────────────────────────────
interface BranchComboboxProps {
  options: ComboOption[]
  value: number[]
  onChange: (ids: number[]) => void
  placeholder?: string
  error?: any
}

const BranchCombobox: React.FC<BranchComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите филиал',
  error,
}) => {
  const selectedOption = options.find((o) => o.id === value?.[0]) ?? null
  const [inputValue, setInputValue] = useState(selectedOption?.name ?? '')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) setInputValue(selectedOption?.name ?? '')
  }, [open, selectedOption])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = useMemo(() => {
    const term = inputValue.trim().toLowerCase()
    if (!term || (selectedOption && selectedOption.name === inputValue))
      return options
    return options.filter((o) => o.name.toLowerCase().includes(term))
  }, [inputValue, options, selectedOption])

  return (
    <div className={s.comboboxWrapper} ref={wrapperRef}>
      {selectedOption && (
        <div className={s.comboboxLabelTop}>{placeholder}</div>
      )}
      <div
        className={`${s.comboboxBlock} ${selectedOption ? s.comboboxBlockWithLabel : ''}`}
      >
        <input
          className={s.comboboxInput}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            onChange([])
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
        />
        <div className={s.comboboxIcons}>
          {selectedOption && (
            <button
              type="button"
              className={s.comboboxClear}
              onClick={() => {
                onChange([])
                setInputValue('')
                setOpen(false)
              }}
            >
              ✕
            </button>
          )}
          <span className={s.comboboxArrow} onClick={() => setOpen((v) => !v)}>
            <Icon id="arrow-up-thin" width={22} height={22} />
          </span>
        </div>
      </div>
      {open && (
        <ul className={s.comboboxDropdown}>
          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <li
                key={opt.id}
                className={`${s.comboboxOption} ${value?.[0] === opt.id ? s.comboboxOptionActive : ''}`}
                onMouseDown={() => {
                  onChange([opt.id])
                  setInputValue(opt.name)
                  setOpen(false)
                }}
              >
                {opt.name}
              </li>
            ))
          ) : (
            <li className={s.comboboxEmpty}>Не найдено</li>
          )}
        </ul>
      )}
      {error?.message && <div className={s.comboboxError}>{error.message}</div>}
    </div>
  )
}

// ── MultiCombobox (множественный выбор) ──────────────────────────────────────
interface MultiComboboxProps {
  options: ComboOption[]
  value: number[]
  onChange: (ids: number[]) => void
  placeholder?: string
  error?: any
}

const MultiCombobox: React.FC<MultiComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите направления',
  error,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = useMemo(() => {
    const term = inputValue.trim().toLowerCase()
    if (!term) return options
    return options.filter((o) => o.name.toLowerCase().includes(term))
  }, [inputValue, options])

  const selectedOptions = options.filter((o) => value?.includes(o.id))

  const toggleItem = (id: number) => {
    if (value?.includes(id)) {
      onChange(value.filter((v) => v !== id))
    } else {
      onChange([...(value || []), id])
    }
  }

  const removeItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== id))
  }

  return (
    <div className={s.comboboxWrapper} ref={wrapperRef}>
      {selectedOptions.length > 0 && (
        <div className={s.comboboxLabelTop}>{placeholder}</div>
      )}
      <div
        className={`${s.comboboxBlock} ${s.comboboxMultiBlock} ${selectedOptions.length > 0 ? s.comboboxMultiBlockWithLabel : ''}`}
        onClick={() => setOpen(true)}
      >
        <div className={s.comboboxMultiContent}>
          {selectedOptions.length > 0 ? (
            <div className={s.comboboxTags}>
              {selectedOptions.map((opt) => (
                <span key={opt.id} className={s.comboboxTag}>
                  {opt.name}
                  <button
                    type="button"
                    className={s.comboboxTagRemove}
                    onClick={(e) => removeItem(opt.id, e)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <input
              className={s.comboboxInput}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              autoComplete="off"
            />
          )}
          {selectedOptions.length > 0 && (
            <input
              className={s.comboboxInputSmall}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setOpen(true)
              }}
              placeholder="Поиск..."
              autoComplete="off"
            />
          )}
        </div>
        <div className={s.comboboxIcons}>
          {selectedOptions.length > 0 && (
            <button
              type="button"
              className={s.comboboxClear}
              onClick={(e) => {
                e.stopPropagation()
                onChange([])
                setInputValue('')
              }}
            >
              ✕
            </button>
          )}
          <span
            className={s.comboboxArrow}
            onClick={(e) => {
              e.stopPropagation()
              setOpen((v) => !v)
            }}
          >
            <Icon id="arrow-up-thin" width={22} height={22} />
          </span>
        </div>
      </div>
      {open && (
        <ul className={s.comboboxDropdown}>
          {filtered.length > 0 ? (
            filtered.map((opt) => {
              const selected = value?.includes(opt.id)
              return (
                <li
                  key={opt.id}
                  className={`${s.comboboxOption} ${selected ? s.comboboxOptionActive : ''}`}
                  onMouseDown={() => toggleItem(opt.id)}
                >
                  <span className={s.comboboxCheckIcon}>
                    {selected ? '✓' : ''}
                  </span>
                  {opt.name}
                </li>
              )
            })
          ) : (
            <li className={s.comboboxEmpty}>Не найдено</li>
          )}
        </ul>
      )}
      {error?.message && <div className={s.comboboxError}>{error.message}</div>}
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────────────────

export interface ResumeFormData {
  fio: string
  age: number | string
  city: string
  phone: string
  email: string
  objective: string
  skills: string
  personal_info: string
  branches: number[] // желаемый филиал (один)
  departments: number[] // направления (несколько)
  work_experiences: {
    organization: string
    position: string
    date_from: Date | null
    date_to: Date | null
    is_current: boolean
    duties: string
  }[]
  educations: {
    institution: string
    speciality: string
    date_from: Date | null
    date_to: Date | null
    is_current: boolean
  }[]
}

// Props переименован departmentList чтобы не конфликтовать с ResumeFormData.departments
interface Props {
  departmentList: { id: number; name: string; slug?: string }[]
}

const ResumeForm: React.FC<Props> = ({ departmentList }) => {
  const { t } = useTranslation()
  const { locale } = useRouter()
  const { modals } = store
  const [isLoading, setIsLoading] = useState(false)

  // Направления — загружаются на клиенте с учётом текущей локали
  const [departmentsData, setDepartmentsData] = useState<ComboOption[]>([])

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await OtherPageApi.getDepartmentsClient(locale || 'ru')
        setDepartmentsData(response?.data || [])
      } catch {
        setDepartmentsData([])
      }
    }
    fetchDepartments()
  }, [locale])

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResumeFormData>({
    mode: 'onChange',
    defaultValues: {
      fio: '',
      age: '',
      city: '',
      phone: '',
      email: '',
      objective: '',
      skills: '',
      personal_info: '',
      branches: [],
      departments: [],
      work_experiences: [
        {
          organization: '',
          position: '',
          date_from: null,
          date_to: null,
          is_current: false,
          duties: '',
        },
      ],
      educations: [
        {
          institution: '',
          speciality: '',
          date_from: null,
          date_to: null,
          is_current: false,
        },
      ],
    },
  })

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({ control, name: 'work_experiences' })

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({ control, name: 'educations' })

  const watchFio = watch('fio')
  const watchAge = watch('age')
  const watchCity = watch('city')
  const watchEmail = watch('email')
  const watchObjective = watch('objective')
  const watchSkills = watch('skills')
  const watchPersonalInfo = watch('personal_info')

  // Филиалы из пропса (server-side) — с фильтрацией
  const branchOptions: ComboOption[] = useMemo(() => {
    return (departmentList || [])
      .map((dep) => ({
        name: String(dep?.name || ''),
        id: Number(dep?.id || 0),
      }))
      .filter(({ name }) => {
        const n = name.toLowerCase()
        return (
          !n.includes('сберегательная касса') && !n.includes('выездная касса')
        )
      })
  }, [departmentList])

  const formatDate = (date: Date | null): string => {
    if (!date) return ''
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const onSubmit = async (data: ResumeFormData) => {
    setIsLoading(true)
    try {
      const payload = {
        ...data,
        age: Number(data.age),
        work_experiences: data.work_experiences.map((exp) => ({
          ...exp,
          date_from: formatDate(exp.date_from),
          date_to: exp.is_current ? null : formatDate(exp.date_to),
        })),
        educations: data.educations.map((edu) => ({
          ...edu,
          date_from: formatDate(edu.date_from),
          date_to: edu.is_current ? null : formatDate(edu.date_to),
        })),
      }
      await OtherCreateApi.createResume(payload as any)
      modals?.openModal({
        body: (
          <PopUp
            text={t('successfullySent')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    } catch {
      modals?.openModal({
        body: (
          <PopUp
            text={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={s.formWrapper}>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          {/* === Личные данные === */}
          <div className={s.section}>
            <h3 className={s.sectionTitle}>
              {t('resume_form.section_personal')}
            </h3>
            <div className={s.grid}>
              <div className={s.inputWrapper}>
                <RscInput
                  label={t('resume_form.fio')}
                  value={watchFio}
                  {...register('fio', {
                    required: t('resume_form.err_fio_required'),
                    maxLength: {
                      value: 255,
                      message: t('resume_form.err_max_255'),
                    },
                  })}
                  error={errors.fio}
                />
              </div>

              <div className={s.inputWrapper}>
                <RscInput
                  label={t('resume_form.age')}
                  type="number"
                  value={watchAge}
                  {...register('age', {
                    required: t('resume_form.err_age_required'),
                    min: {
                      value: 0,
                      message: t('resume_form.err_age_negative'),
                    },
                    max: {
                      value: 32767,
                      message: t('resume_form.err_age_invalid'),
                    },
                  })}
                  error={errors.age}
                />
              </div>

              <div className={s.inputWrapper}>
                <RscInput
                  label={t('resume_form.city')}
                  value={watchCity}
                  {...register('city', {
                    required: t('resume_form.err_city_required'),
                    maxLength: {
                      value: 255,
                      message: t('resume_form.err_max_255'),
                    },
                  })}
                  error={errors.city}
                />
              </div>

              <div className={s.inputWrapper}>
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: t('resume_form.err_phone_required'),
                    minLength: {
                      value: KG_PHONE_MAX_LENGTH,
                      message: t('resume_form.err_phone_invalid'),
                    },
                  }}
                  render={({ field: { value } }) => (
                    <InputPhone
                      placeholder={t('resume_form.phone')}
                      label={t('resume_form.phone')}
                      error={errors.phone}
                      value={value || ''}
                      onChangePhone={(event) =>
                        setValue('phone', event.formattedPhone, {
                          shouldValidate: true,
                        })
                      }
                    />
                  )}
                />
              </div>

              <div className={s.inputWrapperFull}>
                <RscInput
                  label={t('resume_form.email')}
                  value={watchEmail}
                  {...register('email', {
                    pattern: {
                      value: EMAIL_SINX,
                      message: t('resume_form.err_email_invalid'),
                    },
                    maxLength: {
                      value: 254,
                      message: t('resume_form.err_max_254'),
                    },
                  })}
                  error={errors.email}
                />
              </div>

              <div className={s.inputWrapperFull}>
                <RscInput
                  label={t('resume_form.objective')}
                  value={watchObjective}
                  {...register('objective')}
                />
              </div>

              {/* departments — направления, мультиселект, загружается с API */}
              <div className={s.inputWrapperFull}>
                <Controller
                  control={control}
                  name="departments"
                  rules={{
                    validate: (v) =>
                      (v && v.length > 0) ||
                      t('resume_form.err_directions_required'),
                  }}
                  render={({ field }) => (
                    <MultiCombobox
                      options={departmentsData}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('resume_form.directions')}
                      error={errors.departments}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* === Желаемый филиал === */}
          <div className={s.section}>
            <h3 className={s.sectionTitle}>
              {t('resume_form.section_branch')}
            </h3>
            <div className={s.inputWrapper}>
              <Controller
                control={control}
                name="branches"
                rules={{
                  validate: (v) =>
                    (v && v.length > 0) || t('resume_form.err_branch_required'),
                }}
                render={({ field }) => (
                  <BranchCombobox
                    options={branchOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('resume_form.branch_placeholder')}
                    error={errors.branches}
                  />
                )}
              />
            </div>
          </div>

          {/* === Дополнительно === */}
          <div className={s.section}>
            <h3 className={s.sectionTitle}>
              {t('resume_form.section_additional')}
            </h3>
            <div className={s.gridFull}>
              <div className={s.inputWrapperFull}>
                <Textarea
                  label={t('resume_form.skills')}
                  value={watchSkills}
                  {...register('skills')}
                />
              </div>
              <div className={s.inputWrapperFull}>
                <Textarea
                  label={t('resume_form.personal_info')}
                  value={watchPersonalInfo}
                  {...register('personal_info')}
                />
              </div>
            </div>
          </div>

          {/* === Опыт работы === */}
          <div className={s.section}>
            <h3 className={s.sectionTitle}>{t('resume_form.section_work')}</h3>
            {workFields.map((item, index) => {
              const watchOrg = watch(`work_experiences.${index}.organization`)
              const watchPos = watch(`work_experiences.${index}.position`)
              const watchDuties = watch(`work_experiences.${index}.duties`)
              const watchIsCurrent = watch(
                `work_experiences.${index}.is_current`
              )
              return (
                <div key={item.id} className={s.dynamicCard}>
                  <div className={s.dynamicCardHeader}>
                    <span className={s.dynamicCardTitle}>
                      {t('resume_form.work_entry', { index: index + 1 })}
                    </span>
                    {workFields.length > 1 && (
                      <button
                        type="button"
                        className={s.removeBtn}
                        onClick={() => removeWork(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className={s.grid}>
                    <div className={s.inputWrapper}>
                      <RscInput
                        label={t('resume_form.organization')}
                        value={watchOrg}
                        {...register(`work_experiences.${index}.organization`, {
                          required: t('resume_form.err_org_required'),
                        })}
                        error={errors.work_experiences?.[index]?.organization}
                      />
                    </div>
                    <div className={s.inputWrapper}>
                      <RscInput
                        label={t('resume_form.position')}
                        value={watchPos}
                        {...register(`work_experiences.${index}.position`, {
                          required: t('resume_form.err_position_required'),
                        })}
                        error={errors.work_experiences?.[index]?.position}
                      />
                    </div>
                    <div className={s.inputWrapper}>
                      <Controller
                        control={control}
                        name={`work_experiences.${index}.date_from`}
                        rules={{
                          required: t('resume_form.err_date_from_required'),
                        }}
                        render={({ field }) => (
                          <InputDataPicker
                            placeholder={t('resume_form.date_from_work')}
                            selected={field.value as Date}
                            onChange={(date) => field.onChange(date)}
                            error={errors.work_experiences?.[index]?.date_from}
                            maxDate={new Date()}
                          />
                        )}
                      />
                    </div>
                    {!watchIsCurrent && (
                      <div className={s.inputWrapper}>
                        <Controller
                          control={control}
                          name={`work_experiences.${index}.date_to`}
                          render={({ field }) => (
                            <InputDataPicker
                              placeholder={t('resume_form.date_to_work')}
                              selected={field.value as Date}
                              onChange={(date) => field.onChange(date)}
                              maxDate={new Date()}
                            />
                          )}
                        />
                      </div>
                    )}
                    <div className={s.checkboxWrapper}>
                      <label className={s.checkboxLabel}>
                        <input
                          type="checkbox"
                          className={s.checkbox}
                          {...register(`work_experiences.${index}.is_current`)}
                        />
                        <span className={s.checkboxCustom} />
                        <span className={s.checkboxText}>
                          {t('resume_form.currently_working')}
                        </span>
                      </label>
                    </div>
                    <div className={s.inputWrapperFull}>
                      <Textarea
                        label={t('resume_form.duties')}
                        value={watchDuties}
                        {...register(`work_experiences.${index}.duties`)}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            <button
              type="button"
              className={s.addBtn}
              onClick={() =>
                appendWork({
                  organization: '',
                  position: '',
                  date_from: null,
                  date_to: null,
                  is_current: false,
                  duties: '',
                })
              }
            >
              {t('resume_form.add_work')}
            </button>
          </div>

          {/* === Образование === */}
          <div className={s.section}>
            <h3 className={s.sectionTitle}>
              {t('resume_form.section_education')}
            </h3>
            {eduFields.map((item, index) => {
              const watchInst = watch(`educations.${index}.institution`)
              const watchSpec = watch(`educations.${index}.speciality`)
              const watchEduCurrent = watch(`educations.${index}.is_current`)
              return (
                <div key={item.id} className={s.dynamicCard}>
                  <div className={s.dynamicCardHeader}>
                    <span className={s.dynamicCardTitle}>
                      {t('resume_form.education_entry', { index: index + 1 })}
                    </span>
                    {eduFields.length > 1 && (
                      <button
                        type="button"
                        className={s.removeBtn}
                        onClick={() => removeEdu(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className={s.grid}>
                    <div className={s.inputWrapper}>
                      <RscInput
                        label={t('resume_form.institution')}
                        value={watchInst}
                        {...register(`educations.${index}.institution`, {
                          required: t('resume_form.err_institution_required'),
                        })}
                        error={errors.educations?.[index]?.institution}
                      />
                    </div>
                    <div className={s.inputWrapper}>
                      <RscInput
                        label={t('resume_form.speciality')}
                        value={watchSpec}
                        {...register(`educations.${index}.speciality`, {
                          required: t('resume_form.err_speciality_required'),
                        })}
                        error={errors.educations?.[index]?.speciality}
                      />
                    </div>
                    <div className={s.inputWrapper}>
                      <Controller
                        control={control}
                        name={`educations.${index}.date_from`}
                        rules={{
                          required: t('resume_form.err_edu_date_from_required'),
                        }}
                        render={({ field }) => (
                          <InputDataPicker
                            placeholder={t('resume_form.date_from_edu')}
                            selected={field.value as Date}
                            onChange={(date) => field.onChange(date)}
                            error={errors.educations?.[index]?.date_from}
                            maxDate={new Date()}
                          />
                        )}
                      />
                    </div>
                    {!watchEduCurrent && (
                      <div className={s.inputWrapper}>
                        <Controller
                          control={control}
                          name={`educations.${index}.date_to`}
                          render={({ field }) => (
                            <InputDataPicker
                              placeholder={t('resume_form.date_to_edu')}
                              selected={field.value as Date}
                              onChange={(date) => field.onChange(date)}
                              maxDate={new Date()}
                            />
                          )}
                        />
                      </div>
                    )}
                    <div className={s.checkboxWrapper}>
                      <label className={s.checkboxLabel}>
                        <input
                          type="checkbox"
                          className={s.checkbox}
                          {...register(`educations.${index}.is_current`)}
                        />
                        <span className={s.checkboxCustom} />
                        <span className={s.checkboxText}>
                          {t('resume_form.currently_studying')}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            })}
            <button
              type="button"
              className={s.addBtn}
              onClick={() =>
                appendEdu({
                  institution: '',
                  speciality: '',
                  date_from: null,
                  date_to: null,
                  is_current: false,
                })
              }
            >
              {t('resume_form.add_education')}
            </button>
          </div>

          {/* === Кнопка отправки === */}
          <div className={s.submitWrapper}>
            <Button
              value={
                isLoading
                  ? t('resume_form.submitting')
                  : t('resume_form.submit')
              }
              onClick={handleSubmit(onSubmit)}
              isLarge
              isLong
              disabled={isLoading}
            />
          </div>
        </form>
      </Container>
    </div>
  )
}

export default ResumeForm
