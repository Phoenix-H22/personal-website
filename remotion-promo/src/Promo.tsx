import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "./components/Background";
import { SCENES } from "./timing";
import { Identity } from "./scenes/Identity";
import { Companies } from "./scenes/Companies";
import { Products } from "./scenes/Products";
import { HowIWork } from "./scenes/HowIWork";
import { CTA } from "./scenes/CTA";
import { Captions } from "./components/Captions";

export const Promo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070c" }}>
      <Background />
      <Audio src={staticFile("assets/audio/master.mp3")} />

      <Sequence from={SCENES.identity.from} durationInFrames={SCENES.identity.duration}>
        <Identity durationInFrames={SCENES.identity.duration} />
      </Sequence>
      <Sequence from={SCENES.companies.from} durationInFrames={SCENES.companies.duration}>
        <Companies durationInFrames={SCENES.companies.duration} />
      </Sequence>
      <Sequence from={SCENES.products.from} durationInFrames={SCENES.products.duration}>
        <Products durationInFrames={SCENES.products.duration} />
      </Sequence>
      <Sequence from={SCENES.howIWork.from} durationInFrames={SCENES.howIWork.duration}>
        <HowIWork durationInFrames={SCENES.howIWork.duration} />
      </Sequence>
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration}>
        <CTA durationInFrames={SCENES.cta.duration} />
      </Sequence>

      <Captions />
    </AbsoluteFill>
  );
};
