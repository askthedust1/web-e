import React from 'react';
import Modal from 'components/ui/Modal';
import Loader from 'components/Loader';
import styles from '../toStudents.module.scss';
import { useTranslation } from 'next-i18next'

interface DetailedVacancy {
  id: number;
  slug: string;
  title: string;
  image: string;
  direction: { id: number; name: string; slug: string };
  cities: { id: number; name: string }[];
  desc?: string;
  reqs?: string;
}

interface Props {
  vacancy: DetailedVacancy | null;
  loading: boolean;
  onClose: () => void;
}

const InternshipDetailModal: React.FC<Props> = ({ vacancy, loading, onClose }) => {
  const { t } = useTranslation()

  return (
    <Modal isOpen={!!vacancy} onClose={onClose}>
      {loading ? (
        <Loader />
      ) : (
        vacancy && (
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{vacancy?.title}</h2>

            <p className={styles.modalDirection}>
              <strong>{t('job.students.direction')}:</strong> {vacancy?.direction?.name}
            </p>

            {vacancy.cities.length > 0 && (
              <div className={styles.modalBranches}>
                <h3>{t('job.students.city')}:</h3>
                {vacancy.cities.map((city) => (
                  <div key={city?.id} className={styles.modalBranch}>
                    <div>
                      <p><strong>{city?.name}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {vacancy.desc && (
              <div
                className={styles.modalSection}
                dangerouslySetInnerHTML={{ __html: vacancy?.desc }}
              />
            )}

            {vacancy.reqs && (
              <div
                className={styles.modalSection}
                dangerouslySetInnerHTML={{ __html: vacancy?.reqs }}
              />
            )}
          </div>
        )
      )}
    </Modal>
  );
};

export default InternshipDetailModal;
