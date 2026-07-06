import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import s from './vacanciesBanner.module.scss';
import { useTranslation } from 'next-i18next'

interface Vacancy {
  id: number;
  title: string;
  slug: string;
  cities?: { name: string }[];
}

interface Props {
  search: string;
  setSearch: (value: string) => void;
  results: Vacancy[];
  setResults: (items: Vacancy[]) => void;
  showDropdown: boolean;
  setShowDropdown: (v: boolean) => void;
}

const SearchPromptBar: React.FC<Props> = ({
                                            search,
                                            setSearch,
                                            results,
                                            setResults: _setResults,
                                            showDropdown,
                                            setShowDropdown,
                                          }) => {
  const { t } = useTranslation()
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClickVacancy = (slug: string) => {
    const forWho = router?.query?.for_who
    const query = forWho === 'legal' ? { for_who: 'legal' } : {}

    router.push({
      pathname: `/vacancies/${slug}`,
      query,
    });
  };

  return (
    <div className={s.promptBar}>
      <div className={s.searchBar}>
        <div className={s.innerSearchContainer}>
          <div className={s.inputWrapper}>
            <div className={s.iconContainer}>
              <Image
                src="/images/vacancies/search.svg"
                alt="Поиск"
                width={49}
                height={47}
                className={s.searchIcon}
              />
            </div>
            <input
              type="text"
              className={s.searchInput}
              placeholder={t('job.search')}
              value={search}
              onChange={handleChange}
              onFocus={() => search && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
            />
          </div>
          <button className={s.send}>
            <div className={s.sendIconWrapper}>
              <Image
                src="/images/vacancies/send.svg"
                alt="Отправить"
                width={28}
                height={28}
                className={s.sendIcon}
              />
            </div>
          </button>
        </div>

        {showDropdown && (
          <ul className={s.dropdown}>
            {search && results.length === 0 && (
              <li className={s.dropdownEmpty}>{t('search.not_found')}</li>
            )}
            {results.length > 0 &&
              results.map((vacancy) => (
                <li
                  key={vacancy.id}
                  className={s.dropdownItem}
                  onMouseDown={() => handleClickVacancy(vacancy.slug)}
                >
                  <div className={s.dropdownLink}>
                    <div className={s.title}>{vacancy.title}</div>
                    {vacancy?.cities && vacancy?.cities?.length > 0 && (
                      <div className={s.location}>
                        {vacancy.cities.map((city) => city.name).join(', ')}
                      </div>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPromptBar;
