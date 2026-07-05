'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { uploadDocumentWithProgress, ApiError } from '@/lib/api'
import { ItemGroup } from '@/components/ui/item'
import { DocumentDropzone } from '@/components/documents/document-dropzone'
import { DocumentUploadItem } from '@/components/documents/document-upload-item'

export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

interface UploadItemState {
  id: string
  file: File
  status: UploadStatus
  progress: number
  error?: string
  response?: unknown
}

export function DocumentsPanel() {
  const [items, setItems] = useState<UploadItemState[]>([])

  const runUpload = useCallback((id: string, file: File) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'uploading', progress: 0, error: undefined }
          : item
      )
    )

    uploadDocumentWithProgress(file, (percent) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, progress: percent } : item))
      )
    })
      .then((response) => {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: 'success', progress: 100, response }
              : item
          )
        )
      })
      .catch((error: unknown) => {
        // 401 already triggers a global sign-out redirect; no local toast needed.
        if (error instanceof ApiError && error.status === 401) return

        const message =
          error instanceof Error ? error.message : 'No se pudo subir el archivo'
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: 'error', error: message } : item
          )
        )
        toast.error(`${file.name}: ${message}`)
      })
  }, [])

  const handleFiles = useCallback(
    (files: File[]) => {
      const newItems: UploadItemState[] = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: 'pending',
        progress: 0,
      }))

      setItems((prev) => [...prev, ...newItems])
      for (const item of newItems) {
        runUpload(item.id, item.file)
      }
    },
    [runUpload]
  )

  const handleRemove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const handleRetry = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id)
      if (item) runUpload(id, item.file)
    },
    [items, runUpload]
  )

  const isUploading = items.some((item) => item.status === 'uploading')

  return (
    <div className="flex flex-col gap-6">
      <DocumentDropzone onFiles={handleFiles} disabled={false} />

      {items.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-medium">
              Cola de subida ({items.length})
            </h3>
            {isUploading && (
              <span className="text-xs text-muted-foreground">
                Subiendo a n8n...
              </span>
            )}
          </div>
          <ItemGroup>
            {items.map((item) => (
              <DocumentUploadItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onRetry={handleRetry}
              />
            ))}
          </ItemGroup>
        </div>
      )}
    </div>
  )
}
