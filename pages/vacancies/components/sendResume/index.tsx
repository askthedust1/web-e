import React, { useState } from 'react'
import s from './sendResume.module.scss'
import { useTranslation } from 'next-i18next'
import FormJob from 'components/ui/FormJob'
import Modal from 'components/ui/Modal'

const SendResume = () => {
  const [showModal, setShowModal] = useState(false)
  const { t } = useTranslation()

  const handleOpenPopUp = () => setShowModal(true)
  const handleClosePopUp = () => setShowModal(false)

  return (
    <>
      <div className={s.sendResume}>
        <p className={s.title}>{t("job.send_resume.title")}</p>
        <p>{t("job.send_resume.subtitle")}</p>
        <button onClick={handleOpenPopUp}>{t("job.send_resume.button")}</button>
      </div>

      <Modal isOpen={showModal} onClose={handleClosePopUp}>
        <FormJob onSuccess={handleClosePopUp} />
      </Modal>
    </>
  )
}

export default SendResume
