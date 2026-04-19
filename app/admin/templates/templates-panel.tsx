'use client'

import { useState } from 'react'

interface TemplateDef {
  id: string
  name: string
  sector: string
  sprint: number
  colors: string[]
  font: string
  description: string
}

interface TemplateStats {
  count: number
  views: number
  chats: number
  demos: number
}

interface Props {
  catalog: TemplateDef[]
  stats: Record<string, TemplateStats>
}

export default function TemplatesPanel({ catalog, stats }: Props) {
  const [previewSlug, setPreviewSlug] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Şablonlar</h1>
          <p className="mt-1 text-sm text-admin-muted">
            WA outreach landing page şablonları — Sprint 1: Sağlık &amp; Klinik
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-lg border border-admin-border bg-admin-bg2 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-admin-accent-dim text-admin-accent'
                  : 'text-admin-muted hover:text-admin-text'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-admin-accent-dim text-admin-accent'
                  : 'text-admin-muted hover:text-admin-text'
              }`}
            >
              Liste
            </button>
          </div>

          <span className="rounded-full bg-admin-accent-dim px-3 py-1 text-xs font-semibold text-admin-accent">
            {catalog.length} şablon
          </span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Toplam Şablon',
            value: catalog.length,
            icon: '📄',
            color: 'text-admin-accent',
          },
          {
            label: 'Aktif Sayfa',
            value: Object.values(stats).reduce((a, s) => a + s.count, 0),
            icon: '🌐',
            color: 'text-admin-blue',
          },
          {
            label: 'Toplam Görüntülenme',
            value: Object.values(stats).reduce((a, s) => a + s.views, 0),
            icon: '👁️',
            color: 'text-admin-green',
          },
          {
            label: 'Teklif Tıklamaları',
            value: Object.values(stats).reduce((a, s) => a + s.chats, 0),
            icon: '💬',
            color: 'text-admin-amber',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-admin-border bg-admin-bg2 p-4"
          >
            <div className="flex items-center gap-2 text-sm text-admin-muted">
              <span>{stat.icon}</span>
              {stat.label}
            </div>
            <div className={`mt-1 text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Template Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {catalog.map((tpl) => {
            const s = stats[tpl.id]
            return (
              <div
                key={tpl.id}
                className="group overflow-hidden rounded-xl border border-admin-border bg-admin-bg2 transition-colors hover:border-admin-accent/30"
              >
                {/* Color bar */}
                <div className="flex h-2">
                  {tpl.colors.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[15px] font-semibold text-admin-text">
                        {tpl.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-admin-muted">
                        {tpl.font}
                      </p>
                    </div>
                    <span className="rounded-full bg-admin-green-dim px-2 py-0.5 text-[10px] font-medium text-admin-green">
                      Sprint {tpl.sprint}
                    </span>
                  </div>

                  <p className="mt-3 text-[13px] leading-relaxed text-admin-muted">
                    {tpl.description}
                  </p>

                  {/* Stats */}
                  {s && (
                    <div className="mt-4 flex gap-4 border-t border-admin-border pt-3 text-xs text-admin-muted">
                      <span>
                        <strong className="text-admin-text">{s.count}</strong> sayfa
                      </span>
                      <span>
                        <strong className="text-admin-text">{s.views}</strong> görüntülenme
                      </span>
                      <span>
                        <strong className="text-admin-text">{s.chats}</strong> teklif
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setPreviewSlug(tpl.id)}
                      className="flex-1 rounded-lg bg-admin-accent-dim py-2 text-xs font-medium text-admin-accent transition-colors hover:bg-admin-accent hover:text-white"
                    >
                      Önizle
                    </button>
                    <button
                      onClick={() => {
                        window.open(`/demo/preview-${tpl.id}`, '_blank')
                      }}
                      className="rounded-lg border border-admin-border px-3 py-2 text-xs text-admin-muted transition-colors hover:border-admin-accent/30 hover:text-admin-text"
                    >
                      Yeni Sekmede Aç
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-bg2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border bg-admin-bg3 text-left text-xs text-admin-muted">
                <th className="px-4 py-3 font-medium">Şablon</th>
                <th className="px-4 py-3 font-medium">Sektör</th>
                <th className="px-4 py-3 font-medium">Font</th>
                <th className="px-4 py-3 font-medium">Renk</th>
                <th className="px-4 py-3 font-medium text-right">Sayfa</th>
                <th className="px-4 py-3 font-medium text-right">Görüntülenme</th>
                <th className="px-4 py-3 font-medium text-right">Teklif</th>
                <th className="px-4 py-3 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map((tpl) => {
                const s = stats[tpl.id]
                return (
                  <tr
                    key={tpl.id}
                    className="border-b border-admin-border last:border-0 hover:bg-admin-bg3/50"
                  >
                    <td className="px-4 py-3 font-medium text-admin-text">{tpl.name}</td>
                    <td className="px-4 py-3 text-admin-muted">{tpl.sector}</td>
                    <td className="px-4 py-3 text-admin-muted text-xs">{tpl.font}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {tpl.colors.map((c, i) => (
                          <div
                            key={i}
                            className="h-4 w-4 rounded-full border border-admin-border"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-admin-text">{s?.count ?? 0}</td>
                    <td className="px-4 py-3 text-right text-admin-text">{s?.views ?? 0}</td>
                    <td className="px-4 py-3 text-right text-admin-text">{s?.chats ?? 0}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setPreviewSlug(tpl.id)}
                        className="text-xs text-admin-accent hover:underline"
                      >
                        Önizle
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      {previewSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative h-[90vh] w-[90vw] overflow-hidden rounded-2xl border border-admin-border bg-admin-bg shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-admin-border bg-admin-bg2 px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-admin-text">
                  {catalog.find((t) => t.id === previewSlug)?.name} — Önizleme
                </span>
                <span className="rounded bg-admin-amber-dim px-2 py-0.5 text-[10px] text-admin-amber">
                  Demo Verilerle
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/demo/preview-${previewSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-admin-border px-3 py-1.5 text-xs text-admin-muted hover:text-admin-text"
                >
                  Yeni Sekmede Aç
                </a>
                <button
                  onClick={() => setPreviewSlug(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-admin-muted hover:bg-admin-bg4 hover:text-admin-text"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* iframe preview */}
            <iframe
              src={`/demo/preview-${previewSlug}`}
              className="h-full w-full"
              title={`${previewSlug} önizleme`}
            />
          </div>
        </div>
      )}
    </div>
  )
}
