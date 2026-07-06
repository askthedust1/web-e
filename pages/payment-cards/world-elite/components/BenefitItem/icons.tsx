const LoungeIcon = () => (
  <svg viewBox="0 0 64 64" width={56} height={56} fill="none">
    <rect x="6" y="24" width="18" height="26" rx="3" fill="#73D0F6" />
    <rect x="10" y="18" width="10" height="8" rx="2" fill="#156CE6" />
    <path
      d="M30 46 L52 20 M46 20 H52 V26"
      stroke="#F1F2F5"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="46" cy="46" r="8" fill="#0F52BE" opacity="0.5" />
  </svg>
)

const FastTrackIcon = () => (
  <svg viewBox="0 0 64 64" width={56} height={56} fill="none">
    <rect x="10" y="10" width="8" height="40" rx="2" fill="#73D0F6" />
    <rect x="46" y="10" width="8" height="40" rx="2" fill="#73D0F6" />
    <path
      d="M22 30 H42 M34 22 L42 30 L34 38"
      stroke="#156CE6"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CashbackIcon = () => (
  <svg viewBox="0 0 64 64" width={56} height={56} fill="none">
    <rect x="8" y="18" width="26" height="30" rx="4" fill="#156CE6" />
    <path d="M14 18 V13 a4 4 0 0 1 4-4 h4 a4 4 0 0 1 4 4 v5" stroke="#F1F2F5" strokeWidth="3" fill="none" />
    <circle cx="44" cy="38" r="14" fill="#73D0F6" />
    <text x="44" y="43" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0F52BE">%</text>
  </svg>
)

const RoamingIcon = () => (
  <svg viewBox="0 0 64 64" width={56} height={56} fill="none">
    <circle cx="30" cy="32" r="20" fill="#0F52BE" opacity="0.4" />
    <path
      d="M10 32 H50 M30 12 C22 20 22 44 30 52 C38 44 38 20 30 12Z"
      stroke="#73D0F6"
      strokeWidth="2"
      fill="none"
    />
    <rect x="42" y="10" width="16" height="20" rx="3" fill="#156CE6" />
    <rect x="46" y="14" width="8" height="9" rx="1" fill="#F1F2F5" />
  </svg>
)

const MedicalIcon = () => (
  <svg viewBox="0 0 64 64" width={56} height={56} fill="none">
    <path
      d="M32 8 L52 16 V30 C52 44 44 52 32 56 C20 52 12 44 12 30 V16 Z"
      fill="#156CE6"
    />
    <path
      d="M32 22 L38 34 L44 28 M32 22 L26 34 L20 28"
      stroke="#F1F2F5"
      strokeWidth="0"
      fill="none"
    />
    <path
      d="M32 24 C22 32 22 40 32 48 C42 40 42 32 32 24Z"
      fill="#73D0F6"
    />
    <path d="M32 32 V42 M27 37 H37" stroke="#F1F2F5" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

const LocationIcon = () => (
  <svg viewBox="0 0 64 64" width={56} height={56} fill="none">
    <path
      d="M32 8 C20 8 12 17 12 28 C12 42 32 56 32 56 C32 56 52 42 52 28 C52 17 44 8 32 8Z"
      fill="#156CE6"
    />
    <circle cx="32" cy="27" r="8" fill="#F1F2F5" />
    <circle cx="32" cy="27" r="4" fill="#0F52BE" />
  </svg>
)

export {
  LoungeIcon,
  FastTrackIcon,
  CashbackIcon,
  RoamingIcon,
  MedicalIcon,
  LocationIcon,
}
