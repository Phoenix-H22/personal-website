"use client";

import Image, { type ImageProps } from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import styles from "@/styles/portfolio/lazy-media.module.scss";

export type LazyMediaProps = ImageProps & {
  frameClassName?: string;
};

export function LazyMedia({
  className,
  frameClassName,
  fill,
  alt,
  src,
  onLoad,
  ...props
}: LazyMediaProps) {
  const [ready, setReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const img = imgRef.current;
    setReady(Boolean(img?.complete && img.naturalWidth > 0));
  }, [src]);

  const onImageLoad: NonNullable<ImageProps["onLoad"]> = (event) => {
    setReady(true);
    onLoad?.(event);
  };

  return (
    <span
      className={[styles.frame, fill ? styles.fill : styles.flow, frameClassName]
        .filter(Boolean)
        .join(" ")}
      data-ready={ready}
      aria-busy={!ready || undefined}
    >
      <span className={styles.skeleton} aria-hidden="true" />
      <Image
        {...props}
        ref={imgRef}
        src={src}
        alt={alt}
        fill={fill}
        className={className}
        onLoad={onImageLoad}
      />
    </span>
  );
}
