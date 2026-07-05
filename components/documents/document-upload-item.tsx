'use client'

import {
  CheckCircle2Icon,
  ChevronDownIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  Loader2Icon,
  RotateCcwIcon,
  XIcon,
  XCircleIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { UploadStatus } from '@/components/documents/documents-panel'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileTypeIcon({ file }: { file: File }) {
  if (file.type.startsWith('image/')) return <ImageIcon />
  if (
    file.type.includes('text') ||
    file.type.includes('pdf') ||
    /\.(pdf|docx?|txt|md)$/i.test(file.name)
  ) {
    return <FileTextIcon />
  }
  return <FileIcon />
}

export interface UploadItemData {
  id: string
  file: File
  status: UploadStatus
  progress: number
  error?: string
  response?: unknown
}

interface DocumentUploadItemProps {
  item: UploadItemData
  onRemove: (id: string) => void
  onRetry: (id: string) => void
}

export function DocumentUploadItem({
  item,
  onRemove,
  onRetry,
}: DocumentUploadItemProps) {
  const { file, status, progress, error, response } = item

  return (
    <Item variant="outline" className="flex-col items-stretch">
      <div className="flex w-full items-center gap-3.5">
        <ItemMedia variant="icon">
          <FileTypeIcon file={file} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{file.name}</ItemTitle>
          <ItemDescription>
            {formatBytes(file.size)}
            {status === 'error' && error ? ` · ${error}` : null}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <UploadStatusBadge status={status} />
          {status === 'error' && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onRetry(item.id)}
              aria-label="Reintentar"
            >
              <RotateCcwIcon />
            </Button>
          )}
          {status !== 'uploading' && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onRemove(item.id)}
              aria-label="Quitar"
            >
              <XIcon />
            </Button>
          )}
        </ItemActions>
      </div>

      {status === 'uploading' && (
        <Progress value={progress} className="w-full" />
      )}

      {status === 'success' && response !== undefined && (
        <Collapsible>
          <CollapsibleTrigger className="group flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ChevronDownIcon className="size-3 transition-transform group-data-[state=open]:rotate-180" />
            Ver respuesta del pipeline
          </CollapsibleTrigger>
          <CollapsibleContent>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-muted p-3 text-xs">
              {typeof response === 'string'
                ? response
                : JSON.stringify(response, null, 2)}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      )}
    </Item>
  )
}

function UploadStatusBadge({ status }: { status: UploadStatus }) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline">En espera</Badge>
    case 'uploading':
      return (
        <Badge variant="secondary" className="gap-1">
          <Loader2Icon className="size-3 animate-spin" />
          Subiendo
        </Badge>
      )
    case 'success':
      return (
        <Badge
          variant="outline"
          className={cn(
            'gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
          )}
        >
          <CheckCircle2Icon className="size-3" />
          Listo
        </Badge>
      )
    case 'error':
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircleIcon className="size-3" />
          Error
        </Badge>
      )
  }
}
