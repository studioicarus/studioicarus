import {
  BadgeCheck,
  Blocks,
  BookOpen,
  Box,
  BrainCircuit,
  Brush,
  CalendarDays,
  Camera,
  Clapperboard,
  Compass,
  FileSearch,
  FileText,
  Film,
  GraduationCap,
  Handshake,
  Image as ImageIcon,
  Images,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Megaphone,
  Mic,
  MonitorSmartphone,
  Newspaper,
  Palette,
  PenTool,
  Rocket,
  Search,
  Send,
  Shapes,
  Share2,
  Sparkles,
  Target,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Instagram, LinkedinSquare, Tiktok, Youtube, type IconComponent } from '../components/ui/BrandIcons'
import teamData from '../content/team.json'
import worksData from '../content/works.json'

/** Placeholder — swap for the real inbox. */
export const CONTACT_HREF = 'mailto:hello@icarusx.com'

export const VIDEO_MOTION_PATH = '/services/video-motion'
export const PERSONAL_BRAND_PATH = '/services/personal-brand'
export const BRAND_GROWTH_PATH = '/services/brand-social-growth'
export const GET_STARTED_PATH = '/get-started'
export const TEAM_PATH = '/team'
export const WORK_PATH = '/work'

/**
 * Settings for the Get Started booking page. Availability is written in the studio's own time zone
 * and converted for each visitor. Placeholder hours: adjust to the real schedule.
 */
export const booking = {
  title: 'Discovery Call',
  minutes: 30,
  note: 'Web conferencing details provided upon confirmation.',
  hostTimeZone: 'Asia/Dhaka',
  /** 0 = Sunday … 6 = Saturday */
  weekdays: [1, 2, 3, 4, 5],
  startHour: 10,
  endHour: 18,
  intervalMinutes: 30,
  minNoticeHours: 6,
  horizonDays: 60,
}

export type AnyIcon = LucideIcon | IconComponent

/** Hrefs start with "/" so they work from any page; on the home page they are plain in-page scrolls. */
export const navLinks = [
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: WORK_PATH },
  { label: 'About', href: '/#about' },
  { label: 'Team', href: TEAM_PATH },
  { label: 'Contact', href: '/#contact' },
]

export const services: { title: string; text: string; image: string; alt: string; icon: AnyIcon; href?: string }[] = [
  {
    title: 'Video & Motion',
    text: 'From podcast clips to animated videos, we turn your ideas into engaging visual stories.',
    image: '/images/svc-video-studio.webp',
    alt: 'Video editing studio with three monitors, a color-grading console and an ICARUSX sign on the wall',
    icon: Clapperboard,
    href: VIDEO_MOTION_PATH,
  },
  {
    title: 'Personal Brand & Content',
    text: 'We help professionals build authority through powerful LinkedIn content and ghostwriting.',
    image: '/images/svc-linkedin-studio.webp',
    alt: 'Desk with a laptop showing a social media dashboard, floating follower-growth cards for six platforms and an ICARUSX mug',
    icon: LinkedinSquare,
    href: PERSONAL_BRAND_PATH,
  },
  {
    title: 'Brand & Social Growth',
    text: 'Creative campaigns, product content, AI visuals and social media management to grow your brand.',
    image: '/images/svc-brand-growth-studio.webp',
    alt: 'Presenter showing a social media growth dashboard on a large screen to a team in a meeting room',
    icon: Sparkles,
    href: BRAND_GROWTH_PATH,
  },
]

/** Content for the individual service pages, keyed by their path. */
export type ServicePage = {
  title: string
  /** Matches the last part of the page's path and the `service` field of each work. */
  slug: string
  icon: AnyIcon
  intro: string
  image: string
  alt: string
  offeringsSubtitle: string
  offerings: { title: string; text: string; icon: AnyIcon }[]
}

const servicePages: Record<string, ServicePage> = {
  [VIDEO_MOTION_PATH]: {
    title: 'Video & Motion',
    slug: 'video-motion',
    icon: Clapperboard,
    intro: 'From podcast shorts to AI-generated educational cartoons, we create engaging videos that inform, entertain and convert.',
    image: '/images/svc-video-studio.webp',
    alt: 'Video editing studio with three monitors, a color-grading console and an ICARUSX sign on the wall',
    offeringsSubtitle: 'Eight ways we turn ideas into video.',
    offerings: [
      { title: 'Podcast → Shorts & Reels', text: 'Long conversations cut into short, captioned clips made to be shared.', icon: Mic },
      { title: 'YouTube Shorts', text: 'Vertical videos framed and paced for the Shorts feed.', icon: Youtube },
      { title: 'Instagram Reels', text: 'Tight edits with a strong first second, captions and clear sound.', icon: Instagram },
      { title: 'TikTok Videos', text: 'Fast, native-feeling videos that fit how people scroll TikTok.', icon: Tiktok },
      { title: 'Educational Videos & AI Cartoons', text: 'Explainers and AI-generated cartoons that make ideas easy to follow.', icon: GraduationCap },
      { title: 'Motion Graphics', text: 'Animated titles, charts and graphics that bring your message to life.', icon: Shapes },
      { title: 'Video Advertisements', text: 'Short ads with one clear message and a reason to act.', icon: Megaphone },
      { title: 'Social Media Content', text: 'A steady run of on-brand posts, cut to suit every platform.', icon: Share2 },
    ],
  },
  [PERSONAL_BRAND_PATH]: {
    title: 'Personal Brand & Content',
    slug: 'personal-brand',
    icon: LinkedinSquare,
    intro: 'Build your authority and credibility with high-quality, research-driven content.',
    image: '/images/svc-linkedin-studio.webp',
    alt: 'Desk with a laptop showing a social media dashboard, floating follower-growth cards for six platforms and an ICARUSX mug',
    offeringsSubtitle: 'Eight ways we help you build authority.',
    offerings: [
      { title: 'LinkedIn Ghostwriting', text: 'Posts and articles written in your voice, so your ideas reach the right people.', icon: PenTool },
      { title: 'Personal Brand Content', text: 'Content that shows who you are and what you stand for.', icon: UserRound },
      { title: 'LinkedIn Posts', text: 'Clear, well-structured posts made to be read, saved and shared.', icon: LinkedinSquare },
      { title: 'Thought Leadership Articles', text: 'Long-form pieces that show depth and back up your expertise.', icon: Newspaper },
      { title: 'Content Strategy', text: 'A plan for what to say, who to say it to, and how often.', icon: Compass },
      { title: 'Profile/Content Positioning', text: 'A profile and message that make clear what you do and why it matters.', icon: Target },
      { title: 'Research & Writing', text: 'Every piece starts with research, so what you publish holds up.', icon: Search },
      { title: 'Content Calendars', text: 'A planned schedule that keeps your content consistent.', icon: CalendarDays },
    ],
  },
  [BRAND_GROWTH_PATH]: {
    title: 'Brand & Social Growth',
    slug: 'brand-social-growth',
    icon: Sparkles,
    intro: 'We create the content and campaigns that help brands get noticed and grow.',
    image: '/images/svc-brand-growth-studio.webp',
    alt: 'Presenter showing a social media growth dashboard on a large screen to a team in a meeting room',
    offeringsSubtitle: 'Eight ways we help your brand get noticed.',
    offerings: [
      { title: 'Product Copywriting', text: 'Product descriptions and messaging that explain the value and make people want it.', icon: FileText },
      { title: 'Promotional Campaigns', text: 'Campaigns built around one clear idea, from concept to launch.', icon: Rocket },
      { title: 'AI Product Photography', text: 'Studio-quality product shots created with AI, without a photoshoot.', icon: Camera },
      { title: 'Product Images', text: 'Clean, consistent images for your store, website and social feeds.', icon: Images },
      { title: 'AI-Generated Ads (Image & Video)', text: 'Attention-grabbing ads made faster with AI, as images or video.', icon: Sparkles },
      { title: 'Social Media Content', text: 'Posts, carousels and clips that keep your brand in view.', icon: Share2 },
      { title: 'Social Media Management', text: 'Planning, posting and upkeep, handled so your channels stay active.', icon: LayoutDashboard },
      { title: 'Content Calendars', text: 'A clear posting plan so every campaign and post lands on time.', icon: CalendarDays },
    ],
  },
}

export function getServicePage(path: string): ServicePage | undefined {
  return Object.prototype.hasOwnProperty.call(servicePages, path) ? servicePages[path] : undefined
}

/** The services a work can belong to, for the filter on the Works page. */
export const serviceFilters = Object.values(servicePages).map(({ slug, title }) => ({ slug, title }))

export const needs: { lines: [string, string]; icon: AnyIcon }[] = [
  { lines: ['Podcast +', 'Shorts & Reels'], icon: Mic },
  { lines: ['Build My', 'LinkedIn Brand'], icon: LinkedinSquare },
  { lines: ['Advertise', 'My Product'], icon: Rocket },
  { lines: ['Manage My', 'Social Media'], icon: Share2 },
  { lines: ['Educational', 'Content'], icon: GraduationCap },
]

/*
 * Team and works live in plain data files (src/content/*.json) so they can be edited without touching
 * code, by hand or through an admin page later. Each entry below is one item in those files.
 */
export type TeamMember = {
  name: string
  role: string
  bio: string
  /** Path to a square photo, e.g. "/images/team/jane.webp". Leave empty to show initials. */
  photo: string
  /** Full LinkedIn URL. Leave empty to hide the link. */
  linkedin: string
}

export type WorkItem = {
  title: string
  /** The `slug` of one of the services: "video-motion", "personal-brand" or "brand-social-growth". */
  service: string
  /** One line under the title, e.g. "AI + Storytelling + Video Production". */
  tag: string
  text: string
  /** Cover image path. Leave empty to use the video's thumbnail (YouTube links only). */
  image: string
  alt: string
  /** A YouTube or Vimeo link, or a link to a short .mp4. Leave empty for no video. */
  video: string
  /** Shown in the Selected Work section on the home page (the first three are used). */
  featured: boolean
  /** `icon` is a key from `skillIcons`. */
  skills: { label: string; icon: string }[]
}

export const team = teamData as TeamMember[]
export const works = worksData as WorkItem[]
export const featuredWorks = works.filter((w) => w.featured).slice(0, 3)

/** Icons a work's skill tag can use. Unknown keys fall back to a sparkle. */
export const skillIcons: Record<string, AnyIcon> = {
  box: Box,
  brush: Brush,
  film: Film,
  sparkles: Sparkles,
  mic: Mic,
  search: Search,
  'file-search': FileSearch,
  'book-open': BookOpen,
  image: ImageIcon,
  'brain-circuit': BrainCircuit,
  'pen-tool': PenTool,
  camera: Camera,
  megaphone: Megaphone,
  share: Share2,
  shapes: Shapes,
  calendar: CalendarDays,
  target: Target,
  compass: Compass,
  newspaper: Newspaper,
  clapperboard: Clapperboard,
}
export const skillIcon = (key: string): AnyIcon => skillIcons[key] ?? Sparkles

export const steps: { n: string; title: string; text: string; icon: LucideIcon }[] = [
  { n: '01', title: 'Discover', text: 'We understand your goals and audience.', icon: Search },
  { n: '02', title: 'Create', text: 'Our team brings your ideas to life.', icon: PenTool },
  { n: '03', title: 'Refine', text: 'You review. We polish.', icon: BadgeCheck },
  { n: '04', title: 'Deliver', text: 'Ready-to-publish content, on time.', icon: Send },
]

export const aboutItems: { n: string; title: string; text: string; icon: LucideIcon }[] = [
  { n: '01', title: 'One Team.\nMultiple Capabilities', text: 'Built to deliver.', icon: Users },
  { n: '02', title: 'Creative Thinking + AI', text: 'Human ideas, amplified by technology.', icon: Lightbulb },
  { n: '03', title: 'Designing', text: 'Visuals that look sharp on every screen.', icon: Palette },
  { n: '04', title: 'Building', text: 'Content and campaigns that connect with people.', icon: Blocks },
]

export const why: { title: string; text: string; icon: LucideIcon }[] = [
  { title: 'One Team.\nMultiple Capabilities', text: 'All your creative needs under one roof.', icon: Layers },
  { title: 'Human Creativity + AI', text: 'Faster production, better possibilities.', icon: BrainCircuit },
  { title: 'Built for Digital', text: 'Optimized for LinkedIn, Instagram, YouTube, TikTok and more.', icon: MonitorSmartphone },
  { title: 'Flexible Collaboration', text: 'One-off projects or ongoing creative partnerships.', icon: Handshake },
]

export const footerColumns = [
  {
    title: 'Services',
    links: [
      { label: 'Video & Motion', href: VIDEO_MOTION_PATH },
      { label: 'Personal Brand & Content', href: PERSONAL_BRAND_PATH },
      { label: 'Brand & Social Growth', href: BRAND_GROWTH_PATH },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'Our Team', href: TEAM_PATH },
      { label: 'Portfolio', href: WORK_PATH },
      { label: 'Contact', href: '/#contact' },
    ],
  },
]
