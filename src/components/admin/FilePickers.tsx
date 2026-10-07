"use client";

import { useId } from "react";

export function FilePickers({
  onFiles,
  multiple = false,
}: {
  onFiles: (files: FileList | null) => void;
  multiple?: boolean;
}) {
  const galleryId = useId();
  const cameraId = useId();

  return (
    <div className="flex flex-wrap gap-2">
      <label
        htmlFor={galleryId}
        className="inline-flex h-11 cursor-pointer items-center rounded-lg border border-gold/50 px-4 text-sm"
      >
        Upload from gallery
        <input
          id={galleryId}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="sr-only"
          onChange={(event) => {
            onFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
      <label
        htmlFor={cameraId}
        className="inline-flex h-11 cursor-pointer items-center rounded-lg border border-gold/50 px-4 text-sm"
      >
        Take photo
        <input
          id={cameraId}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(event) => {
            onFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
