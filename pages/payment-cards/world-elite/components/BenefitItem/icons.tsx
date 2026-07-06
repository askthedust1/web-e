const Backdrop = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 130 130" width="100%" height="100%" fill="none">
    <defs>
      <linearGradient id="tile" x1="0" y1="0" x2="130" y2="130" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2c3645" />
        <stop offset="100%" stopColor="#1c222b" />
      </linearGradient>
    </defs>
    <rect x="9" y="9" width="112" height="112" rx="24" fill="url(#tile)" stroke="#3c485c" />
    {children}
  </svg>
)

const LoungeIcon = () => (
  <Backdrop>
    <rect x="28" y="58" width="34" height="46" rx="6" fill="#73D0F6" />
    <rect x="35" y="46" width="20" height="16" rx="4" fill="#156CE6" />
    <path
      d="M62 96 L96 46 M84 46 H96 V58"
      stroke="#F1F2F5"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="86" cy="86" r="14" fill="#0F52BE" opacity="0.55" />
  </Backdrop>
)

const FastTrackIcon = () => (
  <Backdrop>
    <rect x="34" y="30" width="12" height="70" rx="4" fill="#73D0F6" />
    <rect x="84" y="30" width="12" height="70" rx="4" fill="#73D0F6" />
    <path
      d="M50 65 H80 M68 51 L82 65 L68 79"
      stroke="#156CE6"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Backdrop>
)

const CashbackIcon = () => (
  <Backdrop>
    <rect x="24" y="46" width="46" height="50" rx="6" fill="#156CE6" />
    <path d="M34 46 V38 a8 8 0 0 1 8-8 h6 a8 8 0 0 1 8 8 v8" stroke="#F1F2F5" strokeWidth="5" fill="none" />
    <circle cx="90" cy="80" r="22" fill="#73D0F6" />
    <text x="90" y="88" textAnchor="middle" fontSize="20" fontWeight="700" fill="#0F52BE">%</text>
  </Backdrop>
)

const RoamingIcon = () => (
  <Backdrop>
    <circle cx="58" cy="65" r="34" fill="#0F52BE" opacity="0.45" />
    <path
      d="M24 65 H92 M58 31 C42 47 42 83 58 99 C74 83 74 47 58 31Z"
      stroke="#73D0F6"
      strokeWidth="3"
      fill="none"
    />
    <rect x="80" y="26" width="28" height="34" rx="5" fill="#156CE6" />
    <rect x="87" y="34" width="14" height="16" rx="2" fill="#F1F2F5" />
  </Backdrop>
)

const MedicalIcon = () => (
  <Backdrop>
    <path
      d="M65 22 L98 34 V58 C98 82 84 96 65 104 C46 96 32 82 32 58 V34 Z"
      fill="#156CE6"
    />
    <path
      d="M65 46 C48 58 48 72 65 86 C82 72 82 58 65 46Z"
      fill="#73D0F6"
    />
    <path d="M65 58 V78 M55 68 H75" stroke="#F1F2F5" strokeWidth="5" strokeLinecap="round" />
  </Backdrop>
)

const LocationIcon = () => (
  <Backdrop>
    <path
      d="M65 24 C46 24 32 39 32 57 C32 80 65 104 65 104 C65 104 98 80 98 57 C98 39 84 24 65 24Z"
      fill="#156CE6"
    />
    <circle cx="65" cy="56" r="15" fill="#F1F2F5" />
    <circle cx="65" cy="56" r="7" fill="#0F52BE" />
  </Backdrop>
)

export {
  LoungeIcon,
  FastTrackIcon,
  CashbackIcon,
  RoamingIcon,
  MedicalIcon,
  LocationIcon,
}
