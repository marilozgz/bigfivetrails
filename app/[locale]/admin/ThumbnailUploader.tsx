"use client"

import ImageUploader from "./ImageUploader"

export default function ThumbnailUploader({
  targetInputName,
  targetThumbInputName
}: {
  targetInputName: string
  targetThumbInputName?: string
}) {
  return (
    <ImageUploader
      label='Subir thumbnail'
      onUploaded={(url, meta) => {
        const input = document.querySelector(
          `input[name="${targetInputName}"]`
        ) as HTMLInputElement | null
        if (input) input.value = url
        if (targetThumbInputName && meta?.thumbUrl) {
          const inputThumb = document.querySelector(
            `input[name="${targetThumbInputName}"]`
          ) as HTMLInputElement | null
          if (inputThumb) inputThumb.value = meta.thumbUrl
        }
      }}
    />
  )
}
