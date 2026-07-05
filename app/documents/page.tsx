import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DocumentsPanel } from '@/components/documents/documents-panel'

export default function DocumentsPage() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Documentos" />
        <div className="flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 lg:px-6">
            <div>
              <h1 className="text-lg font-semibold">Subida de documentos</h1>
              <p className="text-sm text-muted-foreground">
                Probá la integración real con el gateway: cada archivo se
                sube autenticado a{' '}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  POST /documents
                </code>{' '}
                y se procesa con el pipeline de n8n conectado.
              </p>
            </div>
            <DocumentsPanel />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
