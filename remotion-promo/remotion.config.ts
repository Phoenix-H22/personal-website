import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("png"); // pristine dark gradients, no jpeg banding
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
// ANGLE gives crisper gradients/blur in headless Chrome
Config.setChromiumOpenGlRenderer("angle");
