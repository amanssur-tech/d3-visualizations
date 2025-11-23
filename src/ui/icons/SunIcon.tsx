// src/ui/icons/SunIcon.tsx

// Tweak: adjust stroke width/paths here to change the theme toggle sun icon.
const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-inherit"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.636 5.636 4.222 4.222M19.778 19.778l-1.414-1.414M18.364 5.636l1.414-1.414M5.636 18.364 4.222 19.778" />
  </svg>
);

export default SunIcon;
