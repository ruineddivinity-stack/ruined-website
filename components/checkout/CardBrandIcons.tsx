export function CardBrandIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <VisaIcon />
      <MastercardIcon />
      <AmexIcon />
      <DiscoverIcon />
      <ApplePayIcon />
      <GooglePayIcon />
    </div>
  );
}

function VisaIcon() {
  return (
    <svg width="30" height="20" viewBox="0 0 34 22" aria-label="Visa" role="img">
      <rect width="34" height="22" rx="4" fill="#1434CB" />
      <text
        x="17"
        y="15.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="10"
        fill="#ffffff"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg width="30" height="20" viewBox="0 0 34 22" aria-label="Mastercard" role="img">
      <rect width="34" height="22" rx="4" fill="#16191c" />
      <circle cx="14" cy="11" r="6.5" fill="#EB001B" />
      <circle cx="20" cy="11" r="6.5" fill="#F79E1B" fillOpacity="0.85" />
    </svg>
  );
}

function AmexIcon() {
  return (
    <svg width="30" height="20" viewBox="0 0 34 22" aria-label="American Express" role="img">
      <rect width="34" height="22" rx="4" fill="#2E77BC" />
      <text
        x="17"
        y="14.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="7.5"
        fill="#ffffff"
      >
        AMEX
      </text>
    </svg>
  );
}

function DiscoverIcon() {
  return (
    <svg width="30" height="20" viewBox="0 0 34 22" aria-label="Discover" role="img">
      <rect width="34" height="22" rx="4" fill="#1b1e22" />
      <circle cx="25" cy="11" r="7" fill="#FF6000" />
      <text
        x="13"
        y="14"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="6"
        fill="#ffffff"
      >
        DISC
      </text>
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <svg width="30" height="20" viewBox="0 0 34 22" aria-label="Apple Pay" role="img">
      <rect width="34" height="22" rx="4" fill="#000000" />
      <path
        d="M9.87 6.6c-.34.4-.88.72-1.42.68-.07-.54.2-1.11.51-1.46.34-.4.93-.7 1.4-.72.06.56-.16 1.11-.49 1.5zm.48.77c-.78-.05-1.45.44-1.82.44-.38 0-.95-.42-1.57-.41-.81.01-1.55.47-1.97 1.19-.84 1.46-.22 3.62.6 4.81.4.58.88 1.23 1.51 1.21.6-.02.83-.39 1.56-.39.73 0 .94.39 1.57.38.65-.01 1.06-.59 1.46-1.17.46-.67.65-1.31.66-1.35-.01-.01-1.26-.49-1.28-1.94-.01-1.22.99-1.8 1.04-1.83-.57-.83-1.44-.92-1.75-.94z"
        fill="#ffffff"
      />
      <text
        x="27"
        y="15"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontStyle="italic"
        fontWeight="600"
        fontSize="8.5"
        fill="#ffffff"
      >
        Pay
      </text>
    </svg>
  );
}

function GooglePayIcon() {
  return (
    <svg width="30" height="20" viewBox="0 0 34 22" aria-label="Google Pay" role="img">
      <rect width="34" height="22" rx="4" fill="#ffffff" stroke="#dadce0" strokeWidth="1" />
      <text x="7" y="15.5" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="10">
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#5f6368"> Pay</tspan>
      </text>
    </svg>
  );
}
