"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import styles from "@/styles/portfolio/hero-promo-video.module.scss";

interface PromoPlayerProps {
  src: string;
}

const HIDE_DELAY_MS = 2600;
const SEEK_STEP_S = 5;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const total = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="currentColor">
      <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="currentColor">
      <rect x="6.5" y="5" width="4" height="14" rx="1" />
      <rect x="13.5" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
      {muted ? (
        <path d="M17 9l4 6M21 9l-4 6" />
      ) : (
        <>
          <path d="M16.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 6a8.5 8.5 0 0 1 0 12" />
        </>
      )}
    </svg>
  );
}

function FullscreenIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {active ? (
        <path d="M9 4v3a2 2 0 0 1-2 2H4M15 4v3a2 2 0 0 0 2 2h3M9 20v-3a2 2 0 0 0-2-2H4M15 20v-3a2 2 0 0 1 2-2h3" />
      ) : (
        <path d="M4 9V6a2 2 0 0 1 2-2h3M20 9V6a2 2 0 0 0-2-2h-3M4 15v3a2 2 0 0 0 2 2h3M20 15v3a2 2 0 0 1-2 2h-3" />
      )}
    </svg>
  );
}

/**
 * Custom, on-brand video player for the promo modal: seekable progress bar,
 * volume, fullscreen, auto-hiding controls, and keyboard shortcuts. Replaces
 * the browser's native controls so the modal looks consistent everywhere.
 */
export function PromoPlayer({ src }: PromoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsShown, setControlsShown] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const [volScrubbing, setVolScrubbing] = useState(false);
  const effectiveVolume = muted ? 0 : volume;

  const playedRatio = duration > 0 ? current / duration : 0;
  const bufferedRatio = duration > 0 ? buffered / duration : 0;

  const revealControls = useCallback(() => {
    setControlsShown(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      // Keep controls up while paused or scrubbing.
      if (!videoRef.current?.paused && !scrubbing) setControlsShown(false);
    }, HIDE_DELAY_MS);
  }, [scrubbing]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, []);

  const changeVolume = useCallback((next: number) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.min(1, Math.max(0, next));
    video.volume = clamped;
    video.muted = clamped === 0;
  }, []);

  const volumeFromClientX = useCallback(
    (clientX: number) => {
      const el = volumeRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      changeVolume((clientX - rect.left) / rect.width);
    },
    [changeVolume],
  );

  const onVolumePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    setVolScrubbing(true);
    volumeRef.current?.setPointerCapture(event.pointerId);
    volumeFromClientX(event.clientX);
  };

  const onVolumePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (volScrubbing) volumeFromClientX(event.clientX);
  };

  const onVolumePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!volScrubbing) return;
    setVolScrubbing(false);
    volumeRef.current?.releasePointerCapture(event.pointerId);
  };

  const onVolumeKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      changeVolume(effectiveVolume + 0.05);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      changeVolume(effectiveVolume - 0.05);
    }
  };

  const seekToClientX = useCallback((clientX: number) => {
    const track = progressRef.current;
    const video = videoRef.current;
    if (!track || !video || !Number.isFinite(video.duration)) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
    setCurrent(video.currentTime);
  }, []);

  const onProgressPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    setScrubbing(true);
    progressRef.current?.setPointerCapture(event.pointerId);
    seekToClientX(event.clientX);
  };

  const onProgressPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!scrubbing) return;
    seekToClientX(event.clientX);
  };

  const onProgressPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!scrubbing) return;
    setScrubbing(false);
    progressRef.current?.releasePointerCapture(event.pointerId);
  };

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void container.requestFullscreen().catch(() => {});
    }
  }, []);

  // Sync fullscreen state with the browser.
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Keyboard shortcuts while the player is on screen.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      const video = videoRef.current;
      if (!video) return;
      if (event.key === " " || event.key === "k") {
        event.preventDefault();
        togglePlay();
        revealControls();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        video.currentTime = Math.min(video.duration || 0, video.currentTime + SEEK_STEP_S);
        revealControls();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - SEEK_STEP_S);
        revealControls();
      } else if (event.key === "m") {
        toggleMute();
        revealControls();
      } else if (event.key === "f") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePlay, toggleMute, toggleFullscreen, revealControls]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const progressStyle = {
    "--played": playedRatio,
    "--buffered": bufferedRatio,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={styles.player}
      data-fullscreen={fullscreen}
      data-controls={controlsShown || !playing}
      onPointerMove={revealControls}
      onPointerLeave={() => {
        if (playing && !scrubbing) setControlsShown(false);
      }}
    >
      <video
        ref={videoRef}
        className={styles.playerVideo}
        src={src}
        autoPlay
        playsInline
        onClick={togglePlay}
        onPlay={() => {
          setPlaying(true);
          revealControls();
        }}
        onPause={() => {
          setPlaying(false);
          setControlsShown(true);
        }}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
          setVolume(event.currentTarget.volume);
          setMuted(event.currentTarget.muted);
        }}
        onProgress={(event) => {
          const video = event.currentTarget;
          if (video.buffered.length) setBuffered(video.buffered.end(video.buffered.length - 1));
        }}
        onVolumeChange={(event) => {
          setMuted(event.currentTarget.muted);
          setVolume(event.currentTarget.volume);
        }}
        onEnded={() => setPlaying(false)}
      />

      <button
        type="button"
        className={styles.bigPlay}
        data-visible={!playing}
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
        tabIndex={-1}
      >
        <span className={styles.bigPlayIcon}>{playing ? <PauseIcon /> : <PlayIcon />}</span>
      </button>

      <div className={styles.controls} data-visible={controlsShown || !playing}>
        <div
          ref={progressRef}
          className={styles.progress}
          style={progressStyle}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(current)}
          tabIndex={0}
          onPointerDown={onProgressPointerDown}
          onPointerMove={onProgressPointerMove}
          onPointerUp={onProgressPointerUp}
        >
          <span className={styles.progressBuffered} aria-hidden="true" />
          <span className={styles.progressPlayed} aria-hidden="true" />
          <span className={styles.progressThumb} aria-hidden="true" />
        </div>

        <div className={styles.controlsRow}>
          <button
            type="button"
            className={styles.ctrlBtn}
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>

          <div className={styles.volumeGroup}>
            <button
              type="button"
              className={styles.ctrlBtn}
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              <VolumeIcon muted={muted || volume === 0} />
            </button>
            <div
              ref={volumeRef}
              className={styles.volumeBar}
              role="slider"
              aria-label="Volume"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(effectiveVolume * 100)}
              tabIndex={0}
              style={{ "--vol": effectiveVolume } as CSSProperties}
              onPointerDown={onVolumePointerDown}
              onPointerMove={onVolumePointerMove}
              onPointerUp={onVolumePointerUp}
              onKeyDown={onVolumeKeyDown}
            >
              <span className={styles.volumeFill} aria-hidden="true" />
              <span className={styles.volumeThumb} aria-hidden="true" />
            </div>
          </div>

          <span className={styles.time}>
            {formatTime(current)} <span className={styles.timeSep}>/</span> {formatTime(duration)}
          </span>

          <span className={styles.controlsSpacer} />

          <button
            type="button"
            className={styles.ctrlBtn}
            onClick={toggleFullscreen}
            aria-label={fullscreen ? "Exit full screen" : "Full screen"}
          >
            <FullscreenIcon active={fullscreen} />
          </button>
        </div>
      </div>
    </div>
  );
}
