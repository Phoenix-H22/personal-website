import fs from "fs";

const path = "src/styles/concept-v3-rebuild/artifacts.module.scss";
const s = fs.readFileSync(path, "utf8");
const marker = "/* ——— Products ——— */";
const idx = s.indexOf(marker);
if (idx < 0) throw new Error("products marker missing");

// Drop duplicate amber/highlight block just before products if present twice
let head = s.slice(0, idx);
const dup = head.lastIndexOf(".metricAmber .metricValue");
const first = head.indexOf(".metricAmber .metricValue");
if (dup > first && dup > 0) {
  head = head.slice(0, dup);
}

const next = `${head}${marker}
.productOrbit {
  position: relative;
  display: grid;
  gap: 1rem;
  justify-items: stretch;
}

.orbitSvg {
  display: none;
}

.productObject {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 0.65rem;
  min-width: 0;
  padding: 0.85rem;
  border: 1px solid rgb(139 171 204 / 16%);
  background:
    linear-gradient(160deg, rgb(14 24 36 / 94%), rgb(7 13 20 / 96%));
  box-shadow:
    0 18px 36px rgb(0 0 0 / 42%),
    inset 0 1px 0 rgb(255 255 255 / 8%);
}

.productObjectCopy {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.productObjectLogo,
.nabdLogo {
  width: 2.25rem;
  height: 2.25rem;
  object-fit: contain;
  border-radius: 0.45rem;
  flex-shrink: 0;
}

.productTitle {
  margin: 0;
  color: #f3f7fb;
  font-size: 0.9rem;
  font-weight: 560;
  letter-spacing: -0.02em;
}

.productDomain {
  margin: 0.2rem 0 0;
  color: #a8b6c8;
  font-size: 0.78rem;
  line-height: 1.35;
}

/* Obour — angled device */
.productObour {
  --accent: #6b8fff;
  border-radius: 1.2rem 0.55rem 1rem 0.7rem;
  width: min(100%, 17rem);
  box-shadow:
    0 22px 40px rgb(0 0 0 / 46%),
    0 0 0 1px rgb(94 143 255 / 22%),
    inset 0 1px 0 rgb(180 210 255 / 12%);
}

.obourDevice {
  width: 7.5rem;
  height: 9.5rem;
  margin: 0 auto;
  border: 1.5px solid rgb(94 143 255 / 45%);
  border-radius: 1.1rem;
  background: linear-gradient(160deg, #121c2c, #070d16);
  box-shadow:
    0 16px 28px rgb(0 0 0 / 4%),
    inset 0 1px 0 rgb(255 255 255 / 1%);
  transform: rotate(-8deg);
  padding: 0.45rem;
}

.obourScreen {
  position: relative;
  height: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #0a1422;
}

.obourMapGrid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgb(94 143 255 / 12%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(94 143 255 / 12%) 1px, transparent 1px);
  background-size: 12px 12px;
  opacity: 0.7;
}

.obourRoute {
  position: absolute;
  inset: 8% 10%;
  width: 80%;
  height: 84%;
}

/* Vending — vertical machine */
.productVending {
  --accent: #31e6d0;
  width: min(100%, 12.5rem);
  border-radius: 0.55rem 0.55rem 0.9rem 0.9rem;
  justify-self: center;
  box-shadow:
    0 24px 44px rgb(0 0 0 / 48%),
    0 0 0 1px rgb(49 230 208 / 24%),
    inset 0 1px 0 rgb(160 255 240 / 1%);
}

.vendingBody {
  width: 5.8rem;
  margin: 0 auto;
  border: 1.5px solid rgb(49 230 208 / 4%);
  border-radius: 0.55rem;
  background: linear-gradient(180deg, #0d1a22, #071018);
  padding: 0.45rem;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 8%);
}

.vendingScreen {
  position: relative;
  height: 3.2rem;
  border-radius: 0.35rem;
  background: #102838;
  margin-bottom: 0.4rem;
}

.vendingQr {
  position: absolute;
  left: 0.45rem;
  top: 0.45rem;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid #7ab0ff;
  background:
    linear-gradient(#7ab0ff 1px, transparent 1px) 0 0 / 4px 4px,
    linear-gradient(90deg, #7ab0ff 1px, transparent 1px) 0 0 / 4px 4px,
    #071018;
}

.vendingLight {
  position: absolute;
  right: 0.5rem;
  top: 0.55rem;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: #31e6d0;
  box-shadow: 0 0 10px rgb(49 230 208 / 7%);
}

.vendingSlots {
  display: grid;
  gap: 0.28rem;
  margin-bottom: 0.4rem;
}

.vendingSlots span {
  display: block;
  height: 0.38rem;
  border-radius: 0.15rem;
  background: #1a3040;
}

.vendingBay {
  height: 0.85rem;
  border-radius: 0.2rem;
  border: 1px solid rgb(49 230 208 / 35%);
  background: #102430;
}

/* NABD — messaging signal object */
.productNabd {
  --accent: #31e6d0;
  width: min(100%, 16.5rem);
  border-radius: 1.4rem 0.9rem 1.4rem 0.9rem;
  box-shadow:
    0 20px 40px rgb(0 0 0 / 44%),
    0 0 0 1px rgb(242 184 79 / 18%),
    inset 0 1px 0 rgb(160 255 240 / 1%);
}

.nabdSignal {
  display: grid;
  gap: 0.45rem;
  justify-items: start;
  padding: 0.15rem 0.15rem 0;
}

.nabdGraph {
  width: 100%;
  height: 3.4rem;
}

@media (min-width: 768px) and (max-width: 1279px) {
  .productOrbit {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "obour vending"
      "nabd nabd";
    gap: 0.9rem 1rem;
    align-items: end;
  }

  .productObour {
    grid-area: obour;
    justify-self: end;
  }

  .productVending {
    grid-area: vending;
    justify-self: start;
  }

  .productNabd {
    grid-area: nabd;
    justify-self: center;
  }
}

@media (min-width: 1280px) {
  .productOrbit {
    display: block;
    min-height: 19rem;
    perspective: 900px;
  }

  .orbitSvg {
    display: block;
    position: absolute;
    inset: -6% -4%;
    z-index: 0;
    width: 108%;
    height: 112%;
    pointer-events: none;
    opacity: 0.55;
  }

  .productObour {
    position: absolute;
    top: 0;
    right: 8%;
    width: 12.5rem;
    transform: rotate(-7deg) translateZ(24px);
  }

  .productVending {
    position: absolute;
    top: 4.2rem;
    left: 8%;
    width: 10.5rem;
    transform: rotate(1deg) translateZ(8px);
  }

  .productNabd {
    position: absolute;
    right: 0;
    bottom: 0.4rem;
    width: 13.5rem;
    transform: rotate(4deg) translateZ(32px);
  }

  .obourDevice {
    transform: rotate(-10deg);
  }
}

/* ——— AK Core ——— */
.akCore {
  position: relative;
  display: grid;
  place-items: center;
  width: 7.25rem;
  height: 7.25rem;
  transform-style: preserve-3d;
}

.akAura {
  position: absolute;
  inset: -18%;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(49 230 208 / 18%), transparent 68%);
  filter: blur(8px);
}

.akShadow {
  position: absolute;
  left: 18%;
  right: 18%;
  bottom: -0.75rem;
  height: 1.05rem;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgb(0 0 0 / 7%), transparent 72%);
  filter: blur(3px);
  opacity: 0.9;
}

.akBeam {
  position: absolute;
  left: 46%;
  bottom: -1.4rem;
  width: 8%;
  height: 1.5rem;
  background: linear-gradient(180deg, rgb(49 230 208 / 35%), transparent);
  filter: blur(2px);
}

.akRing {
  position: absolute;
  border: 1px solid rgb(49 230 208 / 32%);
  border-radius: 50%;
  border-left-color: transparent;
  border-bottom-color: transparent;
}

.akRingOuter {
  inset: 0;
  box-shadow: 0 0 24px rgb(49 230 208 / 14%);
}

.akRingMid {
  inset: 14%;
  border-style: dashed;
  opacity: 0.8;
}

.akRingInner {
  inset: 28%;
  border-right-color: transparent;
}

.akEtch {
  position: absolute;
  inset: 20%;
  border-radius: 50%;
  background:
    conic-gradient(from 40deg, transparent 0 70%, rgb(49 230 208 / 18%) 70% 72%, transparent 72% 100%);
  opacity: 0.55;
  pointer-events: none;
}

.akLens {
  position: absolute;
  inset: 36%;
  border-radius: 50%;
  overflow: hidden;
  background:
    radial-gradient(circle at 32% 28%, rgb(255 255 255 / 24%), transparent 42%),
    radial-gradient(circle at 65% 70%, rgb(49 230 208 / 16%), transparent 55%),
    linear-gradient(160deg, rgb(14 32 40 / 75%), rgb(4 12 18 / 95%));
  border: 1px solid rgb(49 230 208 / 35%);
  box-shadow:
    inset 0 0 16px rgb(0 0 0 / 5%),
    0 0 14px rgb(49 230 208 / 12%);
}

.akLensGlare {
  position: absolute;
  top: 12%;
  left: 18%;
  width: 42%;
  height: 28%;
  border-radius: 50%;
  background: linear-gradient(180deg, rgb(255 255 255 / 3%), transparent);
  filter: blur(1px);
}

.akMark {
  position: relative;
  z-index: 1;
  color: #e8f7f4;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-shadow: 0 0 16px rgb(49 230 208 / 4%);
}

.akMono {
  filter: grayscale(1) brightness(1.1);
}

.akIlluminated .akMark {
  color: #31e6d0;
}

@media (min-width: 768px) {
  .akCore {
    width: 8.25rem;
    height: 8.25rem;
  }

  .akMark {
    font-size: 1.65rem;
  }
}

@media (min-width: 1280px) {
  .akCore {
    width: 8.75rem;
    height: 8.75rem;
  }

  .akIlluminated .akRingOuter {
    box-shadow:
      0 0 34px rgb(49 230 208 / 22%),
      0 0 70px rgb(49 230 208 / 8%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .upworkSheen {
    display: none;
  }
}
`;

fs.writeFileSync(path, next);
console.log("rewrote products+ak styles", next.length);
