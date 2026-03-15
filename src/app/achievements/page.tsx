
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Award, Shield, Trophy, CheckCircle2, Star, ExternalLink } from "lucide-react"
import Image from "next/image"

const certifications = [
  {
    title: "CompTIA Security+",
    issuer: "CompTIA",
    date: "2023",
    id: "COMP-SEC-9981",
    image: "https://picsum.photos/seed/cert1/400/300",
    color: "hsl(var(--primary))"
  },
  {
    title: "eJPT - Junior PenTester",
    issuer: "eLearnSecurity",
    date: "2023",
    id: "EJPT-7721-B",
    image: "https://picsum.photos/seed/cert2/400/300",
    color: "hsl(var(--secondary))"
  },
  {
    title: "Certified Ethical Hacker",
    issuer: "EC-Council",
    date: "2022",
    id: "CEH-11029",
    image: "https://picsum.photos/seed/cert3/400/300",
    color: "hsl(var(--primary))"
  }
]

const achievements = [
  {
    title: "Top 1% Global Ranking",
    platform: "TryHackMe",
    description: "Maintained consistent top ranking through solving 200+ rooms.",
    icon: Trophy
  },
  {
    title: "CTF Winner - Hacking 101",
    platform: "University Cup",
    description: "1st Place out of 50+ regional teams.",
    icon: Star
  },
  {
    title: "Responsible Disclosure",
    platform: "HackerOne",
    description: "Valid critical vulnerability reported to a major fintech firm.",
    icon: Shield
  }
]

export default function AchievementsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <Award className="h-5 w-5" />
            <span className="font-code text-sm font-bold uppercase tracking-widest">Hall of Fame</span>
          </div>
          <h1 className="text-4xl font-headline font-bold">Achievements & Certifications</h1>
          <p className="text-muted-foreground max-w-2xl">
            A visual documentation of my professional journey, validation of skills, and competitive milestones.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {certifications.map((cert, idx) => (
          <Card key={idx} className="bg-card border-border overflow-hidden group hover:neon-border transition-all">
            <div className="relative h-56">
              <Image 
                src={cert.image} 
                alt={cert.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                data-ai-hint="certificate document"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded">
                <ExternalLink className="h-4 w-4 text-primary" />
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-code text-primary uppercase mb-1">{cert.issuer}</p>
                  <h3 className="text-lg font-headline font-bold">{cert.title}</h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-2 font-code">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    Verified: {cert.id}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{cert.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-headline font-bold mb-8 flex items-center">
        <Trophy className="h-6 w-6 mr-3 text-secondary" />
        Competitive Milestones
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {achievements.map((item, idx) => {
          const Icon = item.icon
          return (
            <div key={idx} className="p-6 rounded-lg bg-muted/40 border border-border hover:bg-muted/60 transition-colors flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs font-code text-secondary mb-1">{item.platform}</p>
              <h3 className="text-lg font-headline font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
