"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { PublicMediaAsset } from "@/lib/portfolio/projects/media-schema";
import styles from "@/styles/portfolio/case-study.module.scss";

export function CaseStudyArchitectureDialog({
  asset,
  projectTitle,
}: {
  asset: PublicMediaAsset;
  projectTitle: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousOverflowRef = useRef("");

  const close = () => {
    dialogRef.current?.close();
    document.body.style.overflow = previousOverflowRef.current;
    setExpanded(false);
    triggerRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!expanded) return;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [expanded]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.expandArchitecture}
        aria-haspopup="dialog"
        onClick={() => setExpanded(true)}
      >
        Expand architecture diagram
      </button>
      {expanded ? (
        <dialog
          ref={dialogRef}
          className={styles.architectureDialog}
          aria-label={`${projectTitle} architecture diagram`}
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div>
            <header>
              <p>{projectTitle} / SYSTEM ANATOMY</p>
              <button type="button" onClick={close}>
                Close diagram
              </button>
            </header>
            <Image
              src={asset.src}
              alt={asset.alt}
              width={asset.width}
              height={asset.height}
              sizes="96vw"
            />
          </div>
        </dialog>
      ) : null}
    </>
  );
}
