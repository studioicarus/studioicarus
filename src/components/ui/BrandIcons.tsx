import type { ComponentType, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string }
export type IconComponent = ComponentType<IconProps>

const base = ({ size = 24, strokeWidth = 2, ...rest }: IconProps): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  ...rest,
})

export const Linkedin: IconComponent = (props) => (
  <svg {...base(props)}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

/** LinkedIn "in" inside a rounded square — used for the "Build My LinkedIn Brand" tile. */
export const LinkedinSquare: IconComponent = (props) => (
  <svg {...base(props)}>
    <rect x="3" y="3" width="18" height="18" rx="3.5" />
    <path d="M8 11v5M8 8v.01M12 16v-5M12 13.2a2.2 2.2 0 0 1 4.4 0V16" />
  </svg>
)

export const Instagram: IconComponent = (props) => (
  <svg {...base(props)}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

export const Youtube: IconComponent = (props) => (
  <svg {...base(props)}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

export const Tiktok: IconComponent = (props) => (
  <svg {...base(props)}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)
