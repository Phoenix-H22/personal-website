import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const poppins = loadPoppins("normal", {
  weights: ["500", "600", "700", "800"],
}).fontFamily;

export const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
}).fontFamily;

export const mono = loadMono("normal", {
  weights: ["400", "500", "700"],
}).fontFamily;
