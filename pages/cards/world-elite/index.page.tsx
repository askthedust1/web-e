import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'

import { ServicePoints } from 'services/api/BranchesApi'
import {
  Branches,
  Cities,
  ServiceDetailProps,
} from 'services/api/BranchesApimodule'


interface ChangePinCodeProps {
  bankomats: Branches[]
  branches: Branches[]
  regions: Cities[]
}
const WorldElite: NextPage<ChangePinCodeProps> = ({
                                                       bankomats,
                                                       branches,
                                                       regions,
                                                     }) => {
  const { t } = useTranslation()


  return (
    <>

    </>
  )
}

export default WorldElite

export const getServerSideProps: GetServerSideProps = async ({
                                                               locale,
                                                               query,
                                                             }) => {
  const region = query?.region || '9'

  const [bankomatsRes, branchesRes, regRes, tr] = await Promise.all([
    ServicePoints.getAllPoints(locale || 'ru', 'bankomats', {
      region,
      is_paginated: false,
    }),
    ServicePoints.getAllPoints(locale || 'ru', 'branches', {
      region,
      is_paginated: false,
    }),
    ServicePoints.getRegions(locale || 'ru'),
    getTranslations(locale as string),
  ])

  return {
    props: {
      bankomats: bankomatsRes?.data?.results || bankomatsRes?.data || [],
      branches: branchesRes?.data?.results || branchesRes?.data || [],
      regions: regRes?.data || [],
      ...tr,
    },
  }
}
