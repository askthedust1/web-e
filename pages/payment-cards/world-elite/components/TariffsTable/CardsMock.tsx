const Card = ({ label }: { label: string }) => (
  <svg width={300} height={190} viewBox="0 0 300 190" fill="none">
    <defs>
      <linearGradient id="cardBg" x1="0" y1="0" x2="300" y2="190" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#20242c" />
        <stop offset="100%" stopColor="#12141a" />
      </linearGradient>
    </defs>
    <rect x="1" y="1" width="298" height="188" rx="16" fill="url(#cardBg)" stroke="#2c3645" />
    {/* gold chip */}
    <rect x="28" y="66" width="34" height="26" rx="5" fill="#c9a23f" />
    <rect x="28" y="74" width="34" height="2" fill="#a5842f" />
    {/* eldik-style logo mark */}
    <path
      d="M150 60 h60 v10 h-42 l42 22 v10 l-60 -30 v-42Z"
      fill="none"
      stroke="#2bb6d6"
      strokeWidth="4"
    />
    <text x="28" y="120" fill="#f1f2f5" fontSize="12" fontWeight="700" letterSpacing="1">
      ELDIK BANK
    </text>
    <text x="272" y="40" textAnchor="end" fill="#97a3b7" fontSize="10">
      {label}
    </text>
    {/* mastercard circles */}
    <circle cx="248" cy="150" r="16" fill="#8b93a1" opacity="0.85" />
    <circle cx="266" cy="150" r="16" fill="#c2c8d2" opacity="0.85" />
  </svg>
)

const CardsMock = () => (
  <div style={{ position: 'relative', width: 340, height: 300 }}>
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        transform: 'rotate(-18deg)',
      }}
    >
      <Card label="world elite" />
    </div>
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        transform: 'rotate(-18deg)',
      }}
    >
      <Card label="world elite" />
    </div>
  </div>
)

export default CardsMock
