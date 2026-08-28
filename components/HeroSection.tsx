import Image from 'next/image';
import Link from 'next/link';

export interface HeroNavOption {
  label: string;
  href: string;
}

export interface HeroSectionProps {
  /** Source path for the full-bleed background image */
  imageSrc?: string;
  /** Main logo/wordmark text on far left of nav */
  logoText?: string;
  /** Navigation links rendered in the center of the nav bar */
  navLinks?: HeroNavOption[];
  /** Eyebrow intro text block in the upper-left area */
  eyebrowText?: string;
  /** Label for the dark pill CTA button */
  ctaText?: string;
  /** Destination link for the CTA button */
  ctaHref?: string;
  /** Secondary tagline text in the upper-right area */
  taglineText?: string;
  /** Massive display headline text anchored to the bottom */
  headlineText?: string;
  /** Toggle mix-blend-mode for headline color inversion over backdrop */
  enableMixBlend?: boolean;
  /** CSS blend mode class ('mix-blend-diff' | 'mix-blend-exclusion') */
  blendModeClass?: string;
  /** Toggle desaturation grayscale filter on background image */
  enableGrayscaleFilter?: boolean;
  /** Custom heading font family CSS class slot */
  customFontDisplayClass?: string;
  /** Custom body/nav font family CSS class slot */
  customFontBodyClass?: string;
}

export function HeroSection({
  imageSrc = '/images/hero-placeholder.jpg',
  logoText = 'QUIET',
  navLinks = [
    { label: 'MODELS', href: '/client/models' },
    { label: 'BOOK', href: '/client/models' },
    { label: 'ABOUT', href: '/#about' },
    { label: 'CONTACT', href: '/#contact' },
  ],
  eyebrowText = 'QUIET IS BUILT FOR THOSE WHO CHOOSE FORM OVER NOISE — AND LET THE WORK SPEAK WHERE WORDS DON\'T HAVE TO',
  ctaText = 'SHOP THE DROP',
  ctaHref = '/client/models',
  taglineText = 'FASHION WITHOUT\nTHE SHOUT',
  headlineText = 'SPEAK QUIET',
  enableMixBlend = true,
  blendModeClass = 'mix-blend-diff',
  enableGrayscaleFilter = true,
  customFontDisplayClass = 'font-display',
  customFontBodyClass = 'font-body',
}: HeroSectionProps) {
  return (
    <section
      className={`relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-black text-white selection:bg-white selection:text-black ${customFontBodyClass}`}
    >
      {/* FULL-BLEED BACKGROUND IMAGE WITH DESATURATION FILTER */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center ${
            enableGrayscaleFilter ? 'hero-grayscale-filter' : ''
          }`}
        />
        {/* Subtle dark vignette to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* 3x3 DECORATIVE HAIRLINE GRID OVERLAY (HIDDEN ON MOBILE) */}
      <div className="hairline-grid hidden md:grid">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>

      {/* OVERLAID TRANSPARENT TOP NAV BAR */}
      <header className="relative z-30 w-full px-6 md:px-12 py-6 flex items-center justify-between text-xs tracking-widest uppercase font-semibold border-b border-white/10 backdrop-blur-xs">
        {/* Logo / Wordmark (Far Left) */}
        <Link
          href="/"
          className={`text-lg md:text-xl font-bold tracking-wider hover:opacity-80 transition-opacity ${customFontDisplayClass}`}
        >
          {logoText}
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:opacity-70 transition-opacity tracking-widest"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search & Account/Bag Icons (Far Right) */}
        <div className="flex items-center space-x-6">
          <button
            type="button"
            aria-label="Search"
            className="flex items-center space-x-1 hover:opacity-70 transition-opacity cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="hidden sm:inline">SEARCH</span>
          </button>

          <Link
            href="/login"
            aria-label="Account or Bag"
            className="flex items-center space-x-1 hover:opacity-70 transition-opacity"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="hidden sm:inline">BAG</span>
          </Link>
        </div>
      </header>

      {/* HERO TEXT LAYOUT CONTAINER */}
      <div className="relative z-20 w-full flex-1 flex flex-col justify-between px-6 md:px-12 pt-8 pb-12">
        {/* UPPER CONTENT ROW: Left Eyebrow/CTA & Right Tagline */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 my-auto pt-4 md:pt-12">
          {/* Upper-Left Third: Eyebrow Intro Block & Dark Pill CTA Button */}
          <div className="md:col-span-6 lg:col-span-5 space-y-5 max-w-lg">
            <p className="text-xs md:text-sm font-medium tracking-wide uppercase leading-relaxed text-white/90 drop-shadow-sm">
              {eyebrowText}
            </p>

            <div>
              <Link
                href={ctaHref}
                className="inline-flex items-center space-x-3 px-6 py-3.5 bg-neutral-900/90 text-white border border-white/20 text-xs font-bold tracking-widest uppercase rounded-2xl hover:bg-white hover:text-black transition-all group shadow-2xl"
              >
                <span>{ctaText}</span>
                <span className="text-sm group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>

          {/* Center Empty Span on Desktop */}
          <div className="hidden md:block md:col-span-1 lg:col-span-3" />

          {/* Upper-Right Third: Secondary Tagline Text (Right-aligned) */}
          <div className="md:col-span-5 lg:col-span-4 text-left md:text-right flex flex-col justify-start md:justify-center">
            <p className="text-xs md:text-sm font-semibold tracking-widest uppercase text-white/80 whitespace-pre-line leading-snug">
              {taglineText}
            </p>
          </div>
        </div>

        {/* BOTTOM ANCHORED DISPLAY HEADLINE WITH FLUID CLAMP FONT SIZE */}
        <div className="w-full pt-8 md:pt-16 border-t border-white/10 mt-auto">
          <h1
            className={`w-full text-white font-extrabold uppercase tracking-tighter leading-none select-none text-left ${customFontDisplayClass} ${
              enableMixBlend ? blendModeClass : ''
            }`}
            style={{
              fontSize: 'clamp(3.5rem, 11vw, 13rem)',
            }}
          >
            {headlineText}
          </h1>
        </div>
      </div>
    </section>
  );
}
