/**
 * Extracts a human-readable message from an Axios/DRF error response.
 *
 * DRF returns 400 validation errors as field-keyed objects
 * (e.g. { inn: ['...'], non_field_errors: ['...'] }) with no `detail` key,
 * while APIException errors (401/403/throttle) use { detail: '...' }.
 * Reading only `detail` therefore loses every validation message.
 */
export const getApiErrorMessage = (error: any, fallback: string): string => {
  const data = error?.response?.data

  if (typeof data === 'string' && data.trim()) return data
  if (data?.detail) return String(data.detail)

  if (data && typeof data === 'object') {
    const firstValue = Object.values(data)[0]
    if (Array.isArray(firstValue) && firstValue.length) return String(firstValue[0])
    if (typeof firstValue === 'string' && firstValue.trim()) return firstValue
  }

  return fallback
}
