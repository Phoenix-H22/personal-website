import Image from "next/image";

import { ScoreRing } from "@/components/concept-v3-rebuild/artifacts/score-ring";
import type {
  BrandCoreArtifact,
  CommerceScaleArtifact,
  CompositionMode,
  CredentialArtifact,
  EducationJourneyArtifact,
  ProductArtifact,
} from "@/lib/proof-engine/types";
import styles from "@/styles/concept-v3-rebuild/artifacts.module.scss";

interface ModeProps {
  mode: CompositionMode;
}

export function UpworkCredential({
  artifact,
}: { artifact: CredentialArtifact } & ModeProps) {
  const scoreText = `${artifact.score.value}${artifact.score.unit} ${artifact.score.label}`;
  const href = artifact.profileLink?.href ?? artifact.href;
  const label =
    artifact.profileLink?.ariaLabel ??
    "View Abdalrhman Alkady’s Upwork profile";

  const body = (
    <>
      <div className={styles.panelGlow} aria-hidden="true" />
      <div className={styles.upworkDepth} aria-hidden="true" />
      <div className={styles.upworkRail} aria-hidden="true" />
      <div className={`${styles.panelShell} ${styles.upworkShell}`} data-upwork-shell>
        <div className={styles.upworkSheen} aria-hidden="true" data-upwork-sheen />
        <div className={styles.panelInset}>
          <div className={styles.panelBody}>
            <div className={styles.upworkHeader}>
              {artifact.asset ? (
                <Image
                  src={artifact.asset.src}
                  alt={artifact.asset.alt}
                  width={artifact.asset.width ?? 140}
                  height={artifact.asset.height ?? 38}
                  className={styles.upworkLogo}
                  priority
                  unoptimized
                />
              ) : (
                <p className={styles.upworkWord}>Upwork</p>
              )}
              <span className={styles.upworkSeal} data-upwork-seal>
                <span className={styles.upworkSealDot} aria-hidden="true" />
                {artifact.credential}
              </span>
            </div>

            <div className={styles.upworkMain}>
              <div>
                {artifact.summary ? (
                  <p className={styles.upworkSummary}>{artifact.summary}</p>
                ) : null}
              </div>
              <ScoreRing
                value={artifact.score.value}
                unit={artifact.score.unit}
                label={artifact.score.label}
              />
            </div>

            <div className={styles.upworkFoot}>
              <span className={styles.upworkVerified} data-upwork-verified>
                <svg
                  className={styles.upworkCheck}
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="8" r="7.25" fill="#14a800" />
                  <path
                    d="M4.6 8.2 L7 10.5 L11.5 5.6"
                    fill="none"
                    stroke="#041208"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Verified
              </span>
              <span className={styles.upworkExternal} aria-hidden="true">
                <svg viewBox="0 0 16 16" width="14" height="14">
                  <path
                    d="M6 3.5H3.5A1.5 1.5 0 0 0 2 5v7.5A1.5 1.5 0 0 0 3.5 14H11a1.5 1.5 0 0 0 1.5-1.5V10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9 2.5h4.5V7M13.2 2.8 7 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <p className="sr-only">{scoreText}</p>
          </div>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        className={`${styles.panel} ${styles.upwork} ${styles.upworkLink}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        data-artifact="upwork"
        data-depth="near"
        data-parallax-target
      >
        {body}
      </a>
    );
  }

  return (
    <article
      className={`${styles.panel} ${styles.upwork}`}
      aria-label={`${artifact.title}: ${artifact.credential}, ${scoreText}`}
      data-artifact="upwork"
      data-depth="near"
      data-parallax-target
    >
      {body}
    </article>
  );
}

export function CommerceScale({
  artifact,
}: { artifact: CommerceScaleArtifact } & ModeProps) {
  return (
    <article
      className={`${styles.panel} ${styles.commerce}`}
      aria-label={artifact.title}
      data-artifact="commerce"
      data-depth="mid"
    >
      <div className={styles.panelGlow} aria-hidden="true" />
      <div className={styles.commerceDepth} aria-hidden="true" />
      <div className={styles.commerceFrame} aria-hidden="true" />
      <div className={`${styles.panelShell} ${styles.commerceShell}`}>
        <div className={styles.panelInset}>
          <div className={styles.panelBody}>
            <div className={styles.commerceHead}>
              <div>
                <p className={styles.meta}>{artifact.scope}</p>
                <h2 className={styles.title}>{artifact.title}</h2>
              </div>
              <span className={styles.commerceStatus} data-commerce-status>
                <span className={styles.commerceStatusDot} aria-hidden="true" />
                Live ops
              </span>
            </div>
            <dl className={styles.commerceMetrics}>
              {artifact.metrics.map((metric) => (
                <div
                  key={metric.id}
                  className={[
                    styles.metric,
                    metric.accent === "amber" ? styles.metricAmber : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <dt className="sr-only">{metric.label}</dt>
                  <dd
                    className={styles.metricValue}
                    data-metric-value={metric.id}
                    data-metric-final={metric.value}
                    aria-label={`${metric.label}: ${metric.value}`}
                  >
                    {metric.value}
                  </dd>
                  <dd className={styles.metricLabel}>{metric.label}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.commerceFlow} aria-label="Operations flow">
              {artifact.flow.map((step, index) => (
                <span key={step.id} className="contents">
                  {index > 0 ? (
                    <span className={styles.flowLink} aria-hidden="true">
                      <span className={styles.flowArrow}>→</span>
                      <span
                        className={styles.flowSignal}
                        data-flow-signal={step.id}
                      />
                    </span>
                  ) : null}
                  <span className={styles.flowStep} data-flow-step={step.id}>
                    {step.label}
                  </span>
                </span>
              ))}
            </div>
            <svg
              className={styles.commerceWave}
              viewBox="0 0 320 36"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="commerceWaveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#31e6d0" stopOpacity="0.35" />
                  <stop offset="55%" stopColor="#31e6d0" />
                  <stop offset="100%" stopColor="#f2b84f" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              <path
                data-commerce-wave
                d="M0 22 C24 10, 48 30, 72 18 S120 6, 148 16 S200 32, 228 14 S280 4, 320 18"
                fill="none"
                stroke="url(#commerceWaveGrad)"
                strokeWidth="1.8"
                pathLength={1}
              />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
}

export function EducationJourney({
  artifact,
}: { artifact: EducationJourneyArtifact } & ModeProps) {
  return (
    <article
      className={`${styles.panel} ${styles.education}`}
      aria-label={artifact.title}
      data-artifact="education"
      data-depth="mid"
    >
      <div className={styles.panelGlow} aria-hidden="true" />
      <div className={styles.educationDepth} aria-hidden="true" />
      <div className={`${styles.panelShell} ${styles.educationShell}`}>
        <div className={styles.panelInset}>
          <div className={styles.panelBody}>
            <p className={styles.meta}>{artifact.eyebrow}</p>
            <h2 className={styles.title}>{artifact.title}</h2>
            <div className={styles.educationYears} data-edu-years>
              <span>{artifact.startYear}</span>
              <span className={styles.educationYearsLine} aria-hidden="true" />
              <span>{artifact.endYear}</span>
            </div>
            <div className={styles.educationTrackWrap}>
              <div className={styles.educationRouteLine} aria-hidden="true">
                <span data-edu-route />
              </div>
              <ol className={styles.educationTrack}>
                {artifact.milestones.map((milestone, index) => (
                  <li
                    key={milestone.id}
                    className={styles.milestone}
                    data-edu-milestone={milestone.id}
                  >
                    <div
                      className={[
                        styles.milestoneFrame,
                        index === 0
                          ? styles.milestoneFrameStem
                          : styles.milestoneFrameUni,
                      ].join(" ")}
                    >
                      {milestone.mark ? (
                        <Image
                          src={milestone.mark.src}
                          alt={milestone.mark.alt}
                          width={44}
                          height={44}
                          className={styles.milestoneLogo}
                        />
                      ) : (
                        <span
                          className={styles.milestoneFallback}
                          aria-hidden="true"
                        >
                          {index === 0 ? "STEM" : "USC"}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className={styles.milestonePeriod}>{milestone.period}</p>
                      <p className={styles.milestoneInstitution}>
                        {milestone.institution}
                      </p>
                      <p className={styles.milestoneDetail}>
                        {milestone.qualification}
                      </p>
                      {milestone.highlight ? (
                        <p
                          className={styles.milestoneHighlight}
                          data-edu-highlight={index === 1 ? "true" : undefined}
                        >
                          {milestone.highlight}
                        </p>
                      ) : null}
                      <p
                        className={styles.milestoneHighlightCompact}
                        aria-hidden="true"
                      >
                        {index === 0
                          ? "STEM foundation in scientific problem-solving and software development"
                          : "B.Sc. Computer & AI · A-grade with Honors · Capstone graded A+"}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <span className={styles.educationSeal} data-edu-seal aria-hidden="true">
                A
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ObourObject({ product }: { product: ProductArtifact }) {
  return (
    <article
      className={`${styles.productObject} ${styles.productObour}`}
      data-product={product.id}
      data-depth="near"
      aria-label={`${product.title}: ${product.domain}`}
    >
      <div className={styles.obourDevice} aria-hidden="true">
        <div className={styles.obourScreen}>
          <div className={styles.obourMapGrid} />
          <svg className={styles.obourRoute} viewBox="0 0 80 90" aria-hidden="true">
            <path
              d="M12 68 C24 48, 34 54, 42 38 S58 22, 68 30"
              fill="none"
              stroke="#7aa2ff"
              strokeWidth="1.6"
            />
            <circle cx="42" cy="38" r="9" fill="none" stroke="#8fb0ff" strokeWidth="1" data-obour-pulse />
            <path
              d="M42 28 C37.5 28 34 31.6 34 36 C34 42.5 42 52 42 52 S50 42.5 50 36 C50 31.6 46.5 28 42 28 Z"
              fill="#6b8fff"
            />
            <circle cx="42" cy="36" r="2.4" fill="#0b1220" />
          </svg>
        </div>
      </div>
      <div className={styles.productObjectCopy}>
        {product.asset ? (
          <Image
            src={product.asset.src}
            alt=""
            width={36}
            height={36}
            className={styles.productObjectLogo}
          />
        ) : null}
        <div>
          <h3 className={styles.productTitle}>{product.title}</h3>
          <p className={styles.productDomain}>{product.domain}</p>
        </div>
      </div>
    </article>
  );
}

function VendingObject({ product }: { product: ProductArtifact }) {
  return (
    <article
      className={`${styles.productObject} ${styles.productVending}`}
      data-product={product.id}
      data-depth="mid"
      aria-label={`${product.title}: ${product.domain}`}
    >
      <div className={styles.vendingBody} aria-hidden="true">
        <div className={styles.vendingScreen}>
          <span className={styles.vendingQr} data-vending-qr />
          <span className={styles.vendingLight} data-vending-light />
        </div>
        <div className={styles.vendingSlots}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.vendingBay} data-vending-dispense />
      </div>
      <div className={styles.productObjectCopy}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <p className={styles.productDomain}>{product.domain}</p>
      </div>
    </article>
  );
}

function NabdObject({ product }: { product: ProductArtifact }) {
  return (
    <article
      className={`${styles.productObject} ${styles.productNabd}`}
      data-product={product.id}
      data-depth="near"
      aria-label={`${product.title}: ${product.domain}`}
    >
      <div className={styles.nabdSignal} aria-hidden="true">
        {product.asset ? (
          <Image
            src={product.asset.src}
            alt=""
            width={40}
            height={40}
            className={styles.nabdLogo}
          />
        ) : null}
        <svg className={styles.nabdGraph} viewBox="0 0 120 56" aria-hidden="true">
          <circle cx="18" cy="28" r="4" fill="#f2b84f" />
          <circle cx="60" cy="18" r="3.5" fill="#31e6d0" />
          <circle cx="98" cy="34" r="4" fill="#31e6d0" data-nabd-delivered />
          <path
            d="M22 28 C36 28, 44 18, 60 18"
            fill="none"
            stroke="#f2b84f"
            strokeWidth="1.4"
            opacity="0.75"
          />
          <path
            data-nabd-wave
            d="M64 18 C76 18, 84 34, 98 34"
            fill="none"
            stroke="#31e6d0"
            strokeWidth="1.6"
          />
          <path
            d="M18 40 C34 48, 52 32, 70 42 S96 46, 110 38"
            fill="none"
            stroke="#31e6d0"
            strokeWidth="1.2"
            opacity="0.45"
          />
        </svg>
      </div>
      <div className={styles.productObjectCopy}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <p className={styles.productDomain}>{product.domain}</p>
      </div>
    </article>
  );
}

export function ProductArtifacts({
  products,
}: {
  products: ProductArtifact[];
  mode: CompositionMode;
}) {
  const obour = products.find((p) => p.visualKind === "map-phone");
  const vending = products.find((p) => p.visualKind === "vending-machine");
  const nabd = products.find((p) => p.visualKind === "message-signal");

  return (
    <div className={styles.productOrbit} data-artifact="products">
      <svg className={styles.orbitSvg} viewBox="0 0 360 300" aria-hidden="true">
        <ellipse
          cx="180"
          cy="150"
          rx="150"
          ry="112"
          fill="none"
          stroke="rgb(49 230 208 / 20%)"
          strokeWidth="1"
          strokeDasharray="5 8"
        />
        <ellipse
          cx="180"
          cy="150"
          rx="100"
          ry="72"
          fill="none"
          stroke="rgb(94 143 255 / 16%)"
          strokeWidth="1"
        />
        <path
          d="M40 210 C90 160, 140 240, 190 180 S280 120, 320 170"
          fill="none"
          stroke="rgb(139 171 204 / 14%)"
          strokeWidth="1"
        />
      </svg>
      {obour ? <ObourObject product={obour} /> : null}
      {vending ? <VendingObject product={vending} /> : null}
      {nabd ? <NabdObject product={nabd} /> : null}
    </div>
  );
}

export function AKCore({
  artifact,
  illuminated = true,
}: {
  artifact: BrandCoreArtifact;
  illuminated?: boolean;
}) {
  return (
    <div
      className={[
        styles.akCore,
        illuminated ? styles.akIlluminated : styles.akMono,
      ].join(" ")}
      role="img"
      aria-label={artifact.title}
      data-artifact="ak-core"
      data-depth="far"
    >
      <span className={styles.akAura} aria-hidden="true" />
      <span className={styles.akShadow} aria-hidden="true" data-ak-floor />
      <span className={styles.akBeam} aria-hidden="true" />
      <span
        className={`${styles.akRing} ${styles.akRingOuter}`}
        data-ak-ring="outer"
        aria-hidden="true"
      />
      <span
        className={`${styles.akRing} ${styles.akRingMid}`}
        data-ak-ring="mid"
        data-ak-spin
        aria-hidden="true"
      />
      <span
        className={`${styles.akRing} ${styles.akRingInner}`}
        data-ak-ring="inner"
        aria-hidden="true"
      />
      <span className={styles.akEtch} aria-hidden="true" />
      <span className={styles.akLens} aria-hidden="true">
        <span className={styles.akLensGlare} />
      </span>
      <span className={styles.akMark} data-ak-mark>
        {artifact.mark}
      </span>
    </div>
  );
}
