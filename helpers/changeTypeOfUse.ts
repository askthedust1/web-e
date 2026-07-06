export const changeTypeOfUser = (router: any, type = 'individual') => {
  const buildQuery = (baseQuery: any) => {
    if (type === 'legal') {
      return { ...baseQuery, for_who: 'legal' }
    }
    const { for_who, ...rest } = baseQuery
    return rest
  }

  if (router.query.slug) {
    if (type === 'legal') {
      router.push({ pathname: '/', query: { for_who: 'legal' } })
    } else {
      router.push({ pathname: '/' })
    }
  } else if (router?.query?.date) {
    router.push({
      pathname: router.pathname,
      query: buildQuery(router.query),
    })
  } else if (router?.query?.type) {
    router.push({
      pathname: router.pathname,
      query: buildQuery(router.query),
    })
  } else if (router?.query?.page) {
    router.push({
      pathname: router.pathname,
      query: { ...buildQuery(router.query), page: 1 },
    })
  } else {
    router.push({
      pathname: router.pathname,
      query: buildQuery(router.query),
    })
  }
}

export const linkPath = (path: string, router: any) => {
  if (router.query.for_who !== 'legal') {
    return path
  }
  if (path.includes('for_who')) {
    return path
  }
  return path.includes('?') ? `${path}&for_who=legal` : `${path}?for_who=legal`
}

export const checkQueryParams = (query: any) => {
  const check =
    (query.for_who === 'legal' || query.for_who === 'individual')
      ? query
      : query.slug
      ? { for_who: 'individual', slug: query.slug ? query.slug : '' }
      : { for_who: 'individual', ...query }
  return check
}
