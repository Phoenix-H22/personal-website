/**
 * Typed registry of verified portfolio image assets under /public/images.
 * Visual components must consume these paths — never hardcode filenames.
 *
 * Missing / ambiguous files are documented in docs/portfolio-v3/MISSING_ASSETS.md.
 * Mixed PNG / WebP / JPG formats are intentional — do not normalize extensions.
 */
export const portfolioAssets = {
  credentials: {
    /** Approved Hero Upwork mark — do not move or duplicate. */
    upwork: "/images/upwork.png",
  },

  companies: {
    mohssilh: "/images/companies/mohssilh.png",
    kayanac: "/images/companies/kayanac.png",
    theqah: "/images/companies/theqah.webp",
    tjar: "/images/companies/tjar.png",
    klliq: "/images/companies/klliq.jpg",
    eraasoft: "/images/companies/eraasoft.webp",
    phoenixTechs: "/images/companies/phoenix-techs.png",
    /** Present on disk; wired after inventory validation. */
    marqity: "/images/companies/marqity.jpg",
    maryzad: "/images/companies/maryzad.jpg",
    /** No owner-approved file yet. */
    intsolutions: null,
  },

  education: {
    obourStem: "/images/education/stem-obour.png",
    universityOfSadatCity: "/images/education/uscElsadat.png",
  },

  projects: {
    yourObourGuide: "/images/LogoAPpICon2.png",
    /** No confidently matching Smart Vending logo in public/images. */
    smartVending: null,
    nabd: "/images/nabd-logo-new.png",
  },

  additional: {
    /** MQTT Door Lockers mark — not mapped to hero Smart Vending. */
    mqttDoorLockers: "/images/smartlockers.jpg",
    autopay: "/images/autopay-logo.png",
  },
} as const;

export type PortfolioAssets = typeof portfolioAssets;

export type CompanyAssetKey = keyof typeof portfolioAssets.companies;
