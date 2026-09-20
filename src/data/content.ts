import {
  BadgeCheck,
  Blocks,
  BrainCircuit,
  Clapperboard,
  GraduationCap,
  Handshake,
  Layers,
  Lightbulb,
  Mic,
  MonitorSmartphone,
  Palette,
  PenTool,
  Rocket,
  Search,
  Send,
  Share2,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { LinkedinSquare, type IconComponent } from '../components/ui/BrandIcons'

/** Placeholder — swap for the real inbox. */
export const CONTACT_HREF = 'mailto:hello@icarusx.com'

export type AnyIcon = LucideIcon | IconComponent

export const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
]

export const services: { title: string; text: string; image: string; alt: string; icon: AnyIcon }[] = [
  {
    title: 'Video & Motion',
    text: 'From podcast clips to animated videos, we turn your ideas into engaging visual stories.',
    image: '/images/svc-video.webp',
    alt: 'Editor cutting a video timeline on a dual-monitor workstation',
    icon: Clapperboard,
  },
  {
    title: 'Personal Brand & Content',
    text: 'We help professionals build authority through powerful LinkedIn content and ghostwriting.',
    image: '/images/svc-linkedin.webp',
    alt: 'Laptop showing a LinkedIn profile',
    icon: LinkedinSquare,
  },
  {
    title: 'Brand & Social Growth',
    text: 'Creative campaigns, product content, AI visuals and social media management to grow your brand.',
    image: '/images/svc-product.webp',
    alt: 'Premium dropper bottle styled with soft violet petals',
    icon: Sparkles,
  },
]

export const needs: { lines: [string, string]; icon: AnyIcon }[] = [
  { lines: ['Podcast +', 'Shorts & Reels'], icon: Mic },
  { lines: ['Build My', 'LinkedIn Brand'], icon: LinkedinSquare },
  { lines: ['Advertise', 'My Product'], icon: Rocket },
  { lines: ['Manage My', 'Social Media'], icon: Share2 },
  { lines: ['Educational', 'Content'], icon: GraduationCap },
]

export const work = [
  { title: 'Podcast Shorts', tag: 'Video Editing', image: '/images/work-podcast.webp', alt: 'Two podcast hosts recording in a blue-lit studio' },
  { title: 'Product Advertisement', tag: 'AI + Photography', image: '/images/work-product.webp', alt: 'Presenter behind a glowing white product on a wooden table' },
  { title: 'LinkedIn Content', tag: 'Ghostwriting', image: '/images/work-linkedin.webp', alt: 'Tablet showing LinkedIn posts and a content dashboard' },
  { title: 'Educational Animation', tag: 'AI Generated', image: '/images/work-education.webp', alt: 'Illustrated learning scene with a tablet showing charts' },
]

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
      { label: 'Video & Motion', href: '#services' },
      { label: 'Personal Brand & Content', href: '#services' },
      { label: 'Brand & Social Growth', href: '#services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Our Team', href: '#team' },
      { label: 'Portfolio', href: '#work' },
      { label: 'Contact', href: '#contact' },
    ],
  },
]
