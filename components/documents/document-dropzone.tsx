'use client'

import { useCallback, useRef, useState } from 'react'
import { UploadCloudIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'

interface DocumentDropzoneProps {
  onFiles: (files: File[]) => void
  disabled?: boolean
}

export function DocumentDropzone({
  onFiles,
  disabled = false,
}: DocumentDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return
      onFiles([...fileList])
    },
    [onFiles]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)
      if (disabled) return
      handleFiles(event.dataTransfer.files)
    },
    [disabled, handleFiles]
  )

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'transition-colors',
        isDragging && 'rounded-3xl ring-2 ring-primary/50'
      )}
    >
      <Empty
        className={cn(
          'border-2 bg-muted/20 transition-colors',
          isDragging ? 'border-primary/60 bg-primary/5' : 'border-dashed',
          disabled && 'opacity-60'
        )}
      >
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UploadCloudIcon />
          </EmptyMedia>
          <EmptyTitle>Arrastrá tus documentos acá</EmptyTitle>
          <EmptyDescription>
            PDF, Word, texto o imágenes. Se procesan con el pipeline de n8n
            configurado en el gateway.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            Elegir archivos
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            aria-label="Subir documentos"
            disabled={disabled}
            onChange={(event) => {
              handleFiles(event.target.files)
              event.target.value = ''
            }}
          />
        </EmptyContent>
      </Empty>
    </div>
  )
}
