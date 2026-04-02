
"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Terminal, 
  Calendar, 
  Trophy, 
  Tag as TagIcon, 
  ChevronLeft, 
  Flag, 
  Lock, 
  Unlock,
  FileText,
  Code,
  Download,
  Github,
  Instagram,
  Paperclip,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchJson } from "@/lib/api-client"
import type { ProfileSettingsRecord, WriteupRecord } from "@/lib/portfolio-types"

export default function WriteupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [isFlagRevealed, setIsFlagRevealed] = React.useState(false)
  const [data, setData] = React.useState<WriteupRecord | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [profile, setProfile] = React.useState<ProfileSettingsRecord | null>(null)
  const [profileImageDataUrl, setProfileImageDataUrl] = React.useState<string | null>(null)
  const [isExportingPdf, setIsExportingPdf] = React.useState(false)
  const exportCoverRef = React.useRef<HTMLDivElement | null>(null)
  const exportContentRef = React.useRef<HTMLDivElement | null>(null)
  const exportInstagramRef = React.useRef<HTMLAnchorElement | null>(null)
  const exportGithubRef = React.useRef<HTMLAnchorElement | null>(null)

  const toAbsoluteUrl = React.useCallback((value?: string) => {
    if (!value) {
      return null
    }

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value
    }

    if (value.startsWith("//")) {
      return `https:${value}`
    }

    if (typeof window === "undefined") {
      return value
    }

    return new URL(value, window.location.origin).toString()
  }, [])

  React.useEffect(() => {
    let isActive = true

    const loadWriteup = async () => {
      try {
        const nextWriteup = await fetchJson<WriteupRecord>(`/api/public/writeups/${id}`)
        if (isActive) {
          setData(nextWriteup)
        }
      } catch {
        if (isActive) {
          setData(null)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    if (id) {
      void loadWriteup()
    } else {
      setIsLoading(false)
    }

    return () => {
      isActive = false
    }
  }, [id])

  React.useEffect(() => {
    let isActive = true

    const blobToDataUrl = (blob: Blob) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result)
            return
          }
          reject(new Error("Unable to read image"))
        }
        reader.onerror = () => reject(reader.error ?? new Error("Unable to read image"))
        reader.readAsDataURL(blob)
      })
    }

    const loadProfile = async () => {
      try {
        const profilePayload = await fetchJson<ProfileSettingsRecord>("/api/public/profile")
        if (!isActive) {
          return
        }

        setProfile(profilePayload)
        const imageUrl = toAbsoluteUrl(profilePayload.profileImageUrl)

        if (!imageUrl) {
          setProfileImageDataUrl(null)
          return
        }

        const response = await fetch(imageUrl)
        if (!response.ok) {
          throw new Error("Failed to fetch image")
        }

        const blob = await response.blob()
        const dataUrl = await blobToDataUrl(blob)
        if (isActive) {
          setProfileImageDataUrl(dataUrl)
        }
      } catch {
        if (isActive) {
          setProfile(null)
          setProfileImageDataUrl(null)
        }
      }
    }

    void loadProfile()

    return () => {
      isActive = false
    }
  }, [toAbsoluteUrl])

  const handleExportPdf = React.useCallback(async () => {
    if (!data || isExportingPdf || !exportCoverRef.current || !exportContentRef.current) {
      return
    }

    setIsExportingPdf(true)

    try {
      const [{ default: html2canvas }, { default: JsPdf }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ])

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve())
        })
      })

      const pdf = new JsPdf({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 28

      const coverCanvas = await html2canvas(exportCoverRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#071022",
      })
      pdf.addImage(coverCanvas.toDataURL("image/png"), "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST")

      const addCoverLink = (linkRef: React.RefObject<HTMLAnchorElement | null>, url?: string | null) => {
        if (!linkRef.current || !exportCoverRef.current || !url) {
          return
        }

        const coverRect = exportCoverRef.current.getBoundingClientRect()
        const linkRect = linkRef.current.getBoundingClientRect()
        const scaleX = pageWidth / coverRect.width
        const scaleY = pageHeight / coverRect.height

        pdf.setPage(1)
        pdf.link(
          (linkRect.left - coverRect.left) * scaleX,
          (linkRect.top - coverRect.top) * scaleY,
          linkRect.width * scaleX,
          linkRect.height * scaleY,
          { url }
        )
      }

      addCoverLink(exportInstagramRef, toAbsoluteUrl(profile?.instagramUrl))
      addCoverLink(exportGithubRef, toAbsoluteUrl(profile?.githubUrl))

      const contentCanvas = await html2canvas(exportContentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      const printableWidth = pageWidth - margin * 2
      const printableHeight = pageHeight - margin * 2
      const pxPerPt = contentCanvas.width / printableWidth
      const slicePx = Math.floor(printableHeight * pxPerPt)

      let yOffset = 0
      while (yOffset < contentCanvas.height) {
        const currentSlice = Math.min(slicePx, contentCanvas.height - yOffset)
        const pageCanvas = document.createElement("canvas")
        pageCanvas.width = contentCanvas.width
        pageCanvas.height = currentSlice

        const context = pageCanvas.getContext("2d")
        if (!context) {
          throw new Error("Unable to render canvas")
        }

        context.drawImage(
          contentCanvas,
          0,
          yOffset,
          contentCanvas.width,
          currentSlice,
          0,
          0,
          contentCanvas.width,
          currentSlice
        )

        pdf.addPage()
        pdf.addImage(
          pageCanvas.toDataURL("image/png"),
          "PNG",
          margin,
          margin,
          printableWidth,
          currentSlice / pxPerPt,
          undefined,
          "FAST"
        )

        yOffset += currentSlice
      }

      if (exportContentRef.current) {
        const contentRect = exportContentRef.current.getBoundingClientRect()
        const contentScale = contentCanvas.width / contentRect.width
        const attachmentLinks = Array.from(
          exportContentRef.current.querySelectorAll<HTMLAnchorElement>("[data-export-attachment-link='true']")
        )

        for (const linkElement of attachmentLinks) {
          const href = toAbsoluteUrl(linkElement.getAttribute("href") || undefined)
          if (!href) {
            continue
          }

          const rect = linkElement.getBoundingClientRect()
          const leftPx = (rect.left - contentRect.left) * contentScale
          const topPx = (rect.top - contentRect.top) * contentScale
          const widthPx = rect.width * contentScale
          const heightPx = rect.height * contentScale

          const contentPageIndex = Math.floor(topPx / slicePx)
          const yWithinPagePx = topPx - contentPageIndex * slicePx
          const targetPage = 2 + contentPageIndex

          if (targetPage > pdf.getNumberOfPages()) {
            continue
          }

          pdf.setPage(targetPage)
          pdf.link(
            margin + leftPx / pxPerPt,
            margin + yWithinPagePx / pxPerPt,
            widthPx / pxPerPt,
            heightPx / pxPerPt,
            { url: href }
          )
        }
      }

      const slug = (data.title || "writeup")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      pdf.save(`${slug || "writeup"}.pdf`)
    } finally {
      setIsExportingPdf(false)
    }
  }, [data, isExportingPdf, profile, toAbsoluteUrl])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="font-code text-muted-foreground">Decrypting write-up data...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Terminal className="h-12 w-12 text-muted" />
        <h1 className="text-2xl font-bold">Write-up not found</h1>
        <Button onClick={() => router.push('/ctf')}>Return to Repository</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-20">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-8 text-muted-foreground hover:text-primary pl-0"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Database
      </Button>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30 uppercase text-[10px] tracking-widest">
                {data.category}
              </Badge>
              <span className={cn(
                "text-[10px] uppercase font-bold px-2 py-0.5 rounded border",
                data.difficulty === "Hard" ? "border-red-500/50 text-red-400" : 
                data.difficulty === "Medium" ? "border-yellow-500/50 text-yellow-400" : 
                "border-green-500/50 text-green-400"
              )}>
                {data.difficulty}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto border-primary/40 text-primary hover:bg-primary/10"
              onClick={() => void handleExportPdf()}
              disabled={isExportingPdf}
            >
              {isExportingPdf ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Exporting PDF...</>
              ) : (
                <><Download className="h-4 w-4 mr-2" /> Export as PDF</>
              )}
            </Button>
          </div>
          <h1 className="text-5xl font-headline font-bold leading-tight tracking-tight">
            {data.title}
          </h1>
        </div>

        {/* Properties Grid - Notion Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-muted/30 border border-border rounded-xl">
          <div className="flex items-center text-sm">
            <Trophy className="h-4 w-4 mr-3 text-muted-foreground" />
            <span className="text-muted-foreground w-24">Competition</span>
            <span className="font-medium">{data.competition}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
            <span className="text-muted-foreground w-24">Date</span>
            <span className="font-medium">{data.date}</span>
          </div>
          <div className="flex items-center text-sm">
            <Flag className="h-4 w-4 mr-3 text-muted-foreground" />
            <span className="text-muted-foreground w-24">Solved</span>
            <span className="font-medium text-green-400 flex items-center">
              <Unlock className="h-3 w-3 mr-1" /> Decrypted
            </span>
          </div>
          <div className="flex items-center text-sm">
            <TagIcon className="h-4 w-4 mr-3 text-muted-foreground" />
            <span className="text-muted-foreground w-24">Tags</span>
            <div className="flex gap-2">
              {(data.tags || []).map(tag => (
                <span key={tag} className="text-[10px] font-code border border-primary/20 bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Content Body - Notion Style Layout */}
        <article className="max-w-none space-y-12 pb-20">
          <section className="space-y-4">
            <h2 className="text-2xl font-headline font-bold flex items-center">
              <FileText className="h-5 w-5 mr-3 text-secondary" />
              Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {data.summary}
            </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-2xl font-headline font-bold flex items-center">
              <Code className="h-5 w-5 mr-3 text-secondary" />
              Documentation
            </h2>
            <div 
              className="prose prose-invert prose-primary max-w-none bg-muted/20 p-6 rounded-lg border border-border/50 font-body overflow-hidden"
              dangerouslySetInnerHTML={{ __html: data.content || "" }}
            />
          </section>

          {(data.attachments || []).length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-headline font-bold flex items-center">
                <Paperclip className="h-5 w-5 mr-3 text-secondary" />
                Challenge Attachments
              </h2>
              <div className="space-y-2">
                {(data.attachments || []).map((attachment, index) => (
                  <a
                    key={`${attachment.url}-${index}`}
                    href={attachment.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary break-all">
                        {attachment.name || `Attachment ${index + 1}`}
                      </p>
                      {attachment.contentType ? (
                        <p className="text-[10px] text-muted-foreground">{attachment.contentType}</p>
                      ) : null}
                    </div>
                    <Download className="h-4 w-4 text-primary shrink-0 ml-3" />
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="p-8 bg-primary/5 border border-primary/20 rounded-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold text-primary flex items-center">
                <Flag className="h-5 w-5 mr-3" />
                Flag Captured
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary/50 text-primary hover:bg-primary/10"
                onClick={() => setIsFlagRevealed(!isFlagRevealed)}
              >
                {isFlagRevealed ? (
                  <><EyeOff className="h-3 w-3 mr-2" /> HIDE SIGNAL</>
                ) : (
                  <><Eye className="h-3 w-3 mr-2" /> REVEAL FLAG SIGNAL</>
                )}
              </Button>
            </div>
            
            <div className={cn(
              "p-6 rounded-lg font-code text-center text-lg font-bold border transition-all duration-500",
              isFlagRevealed 
                ? "bg-primary/20 border-primary/50 text-primary blur-none" 
                : "bg-black/40 border-dashed border-primary/20 text-primary/10 blur-[6px] select-none"
            )}>
              {isFlagRevealed ? (data.flag || "FLAG_RECOVERED_SUCCESSFULLY") : "XXXXXXXXXXXXXXXXXXXXXXXXXXXX"}
            </div>
            
            {!isFlagRevealed && (
              <p className="text-[10px] text-center font-code text-muted-foreground uppercase tracking-widest animate-pulse">
                Click reveal button to authorize data visualization
              </p>
            )}
          </section>
        </article>
      </div>

      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden>
        <div
          ref={exportCoverRef}
          style={{ width: 794, height: 1123 }}
          className="relative overflow-hidden text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.28),transparent_48%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,0.25),transparent_45%),linear-gradient(145deg,#020617_0%,#0f172a_55%,#111827_100%)]" />
          <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full border border-cyan-300/30" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-emerald-300/30" />

          <div className="relative h-full w-full px-16 py-20 flex flex-col items-center justify-center text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-200/80">Write Up Export</p>
            <h1 className="mt-6 text-5xl leading-tight font-bold max-w-[640px]">
              {(data.competition || "Platform Name") + " - " + (data.title || "Challenge Name")}
            </h1>

            <div className="mt-14 h-56 w-56 rounded-full border-4 border-white/20 bg-slate-900/60 overflow-hidden flex items-center justify-center">
              {profileImageDataUrl ? (
                <div
                  className="h-full w-full rounded-full overflow-hidden"
                  style={{ clipPath: "circle(50% at 50% 50%)" }}
                >
                  <img
                    src={profileImageDataUrl}
                    alt="Profile"
                    className="block h-full w-full rounded-full object-cover object-center scale-110"
                    style={{ clipPath: "circle(50% at 50% 50%)" }}
                  />
                </div>
              ) : (
                <span className="text-7xl font-semibold text-cyan-200/90">
                  {(profile?.displayName || "P").charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <h2 className="mt-8 text-3xl font-semibold tracking-wide">
              {profile?.displayName || "Profile Name"}
            </h2>
            {profile?.alias ? (
              <p className="mt-2 text-base font-medium tracking-wide text-slate-300/75">
                @{profile.alias}
              </p>
            ) : null}
            <div className="mt-5 rounded-2xl border border-white/20 bg-white/5 px-8 py-5 max-w-[680px] backdrop-blur-sm">
              <div className="flex items-center justify-center gap-5">
                <a
                  ref={exportInstagramRef}
                  href={toAbsoluteUrl(profile?.instagramUrl) || "#"}
                  className="h-12 w-12 rounded-full border border-white/30 bg-white/10 flex items-center justify-center"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6 text-slate-100" />
                </a>
                <a
                  ref={exportGithubRef}
                  href={toAbsoluteUrl(profile?.githubUrl) || "#"}
                  className="h-12 w-12 rounded-full border border-white/30 bg-white/10 flex items-center justify-center"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-6 w-6 text-slate-100" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={exportContentRef}
          style={{ width: 794 }}
          className="bg-white text-slate-900 px-14 py-14"
        >
          <div className="border-b border-slate-200 pb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Write Up Content</p>
            <h2 className="mt-2 text-3xl font-bold">{data.title || "Challenge"}</h2>
            <p className="mt-1 text-sm text-slate-500">{data.competition || "CTF"}</p>
          </div>

          <section className="mt-8">
            <h3 className="text-lg font-semibold">Overview</h3>
            <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
              {data.summary || "No summary available."}
            </p>
          </section>

          <section className="mt-10">
            <h3 className="text-lg font-semibold">Documentation</h3>
            <div
              className="mt-3 text-[15px] leading-7 text-slate-800 prose max-w-none prose-slate"
              dangerouslySetInnerHTML={{ __html: data.content || "" }}
            />
          </section>

          <section className="mt-12 border-t border-slate-200 pt-8 space-y-8">
            {(data.attachments || []).length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold">Attachments</h3>
                <ul className="mt-3 space-y-2">
                  {(data.attachments || []).map((attachment, index) => (
                    <li key={`${attachment.url}-${index}`} className="text-[14px] leading-6 text-slate-700 break-all">
                      {toAbsoluteUrl(attachment.url) ? (
                        <a
                          href={toAbsoluteUrl(attachment.url) || "#"}
                          data-export-attachment-link="true"
                          className="text-sky-700 underline"
                        >
                          {attachment.name || `Attachment ${index + 1}`}
                        </a>
                      ) : (
                        <span>{attachment.name || `Attachment ${index + 1}`}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div>
              <h3 className="text-lg font-semibold">Flag</h3>
              <p className="mt-3 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-[14px] text-slate-800 break-all">
                {data.flag || "FLAG_RECOVERED_SUCCESSFULLY"}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
