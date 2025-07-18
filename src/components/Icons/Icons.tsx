import { SvgIcon } from '../ui/svg-icon';

type IconProps = {
  className?: string;
  onClick?: () => void;
};

export const Icons = {
  Sun: (className: string) => {
    return (
      <SvgIcon className={className}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v1" />
        <path d="M12 20v1" />
        <path d="M3 12h1" />
        <path d="M20 12h1" />
        <path d="m18.364 5.636-.707.707" />
        <path d="m6.343 17.657-.707.707" />
        <path d="m5.636 5.636.707.707" />
        <path d="m17.657 17.657.707.707" />
      </SvgIcon>
    );
  },
  Moon: (className: string) => {
    return (
      <SvgIcon className={className}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </SvgIcon>
    );
  },
  Spinner: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </SvgIcon>
  ),
  Loader: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </SvgIcon>
  ),
  Eye: ({ className }: IconProps) => {
    return (
      <SvgIcon className={className} strokeWidth={2}>
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
      </SvgIcon>
    );
  },
  EyeOff: ({ className }: IconProps) => {
    return (
      <SvgIcon className={className} strokeWidth={2}>
        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
        <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
        <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
        <path d="m2 2 20 20" />
      </SvgIcon>
    );
  },

  Check: ({ className }: IconProps) => {
    return (
      <SvgIcon className={className} strokeWidth={2}>
        <path d="M20 6 9 17l-5-5" />
      </SvgIcon>
    );
  },

  Plus: ({ className }: IconProps) => {
    return (
      <SvgIcon className={className} strokeWidth={2}>
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </SvgIcon>
    );
  },

  CheckCircle: ({ className }: IconProps) => {
    return (
      <SvgIcon className={className} strokeWidth={2}>
        <path d="M21.801 10A10 10 0 1 1 17 3.335" />
        <path d="m9 11 3 3L22 4" />
      </SvgIcon>
    );
  },
  Edit: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </SvgIcon>
  ),
  Calender: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </SvgIcon>
  ),

  Trash: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </SvgIcon>
  ),

  RestoreArchive: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h2" />
      <path d="M20 8v11a2 2 0 0 1-2 2h-2" />
      <path d="m9 15 3-3 3 3" />
      <path d="M12 12v9" />
    </SvgIcon>
  ),

  Search: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </SvgIcon>
  ),
  User: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </SvgIcon>
  ),
  ClockFading: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="M12 2a10 10 0 0 1 7.38 16.75" />
      <path d="M12 6v6l4 2" />
      <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
      <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
      <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
      <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
    </SvgIcon>
  ),
  CheckCheck: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="M18 6 7 17l-5-5" />
      <path d="m22 10-7.5 7.5L13 16" />
    </SvgIcon>
  ),

  ChevronsLeft: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="m11 17-5-5 5-5" />
      <path d="m18 17-5-5 5-5" />
    </SvgIcon>
  ),
  ChevronLeft: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="m15 18-6-6 6-6" />
    </SvgIcon>
  ),
  ChevronsRight: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="m6 17 5-5-5-5" />
      <path d="m13 17 5-5-5-5" />
    </SvgIcon>
  ),
  ChevronRight: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="m9 18 6-6-6-6" />
    </SvgIcon>
  ),
  ChevronUpDown: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </SvgIcon>
  ),
  ArrowUpDown: ({ className }: IconProps) => {
    return (
      <SvgIcon className={className}>
        <path d="m21 16-4 4-4-4" />
        <path d="M17 20V4" />
        <path d="m3 8 4-4 4 4" />
        <path d="M7 4v16" />
      </SvgIcon>
    );
  },

  CircleX: ({ className }: IconProps) => (
    <SvgIcon className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </SvgIcon>
  ),
};
