// Valid KG mobile prefixes after country code 996:
// Megacom: 500-509, 550-559
// Beeline: 220-229, 700-709, 770-779
// O!: 200-209, 990-999
const KG_PREFIX_RE = /^996(20[0-9]|22[0-9]|50[0-9]|55[0-9]|70[0-9]|77[0-9]|99[0-9])\d{6}$/

export const isKgPhoneValid = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '')
  return KG_PREFIX_RE.test(digits)
}
