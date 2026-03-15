
"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Terminal, Search, ExternalLink, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const categories = ["All", "Web", "Pwn", "Crypto", "Reverse", "Forensics"]

const writeups = [
  {
    id: 1,
    title: "SQLi to RCE on Legacy CMS",
    challenge: "PicoCTF 2023",
    category: "Web",
    difficulty: "Hard",
    date: "2023-11-15",
    summary: "Bypassing a strict WAF to achieve remote code execution via a multi-stage blind SQL injection.",
    tags: ["SQLi", "WAF Bypass", "PHP"]
  },
  {
    id: 2,
    title: "ROP Chain Magic",
    challenge: "HackTheBox Business",
    category: "Pwn",
    difficulty: "Medium",
    date: "2023-10-02",
    summary: "Constructing a Return Oriented Programming chain to bypass NX and ASLR on a binary.",
    tags: ["ROP", "Exploit", "Pwn"]
  },
  {
    id: 3,
    title: "Broken AES-ECB Implementation",
    challenge: "CyberApocalypse",
    category: "Crypto",
    difficulty: "Easy",
    date: "2023-08-12",
    summary: "Exploiting the lack of diffusion in ECB mode to recover sensitive session tokens.",
    tags: ["AES", "ECB", "Oracle"]
  },
  {
    id: 4,
    title: "Deep Dive into packed Malware",
    challenge: "Flare-On 9",
    category: "Reverse",
    difficulty: "Hard",
    date: "2023-09-20",
    summary: "Unpacking a custom obfuscator and reversing the core C2 communication logic.",
    tags: ["Malware", "RE", "Ghidra"]
  }
]

export default function CTFPage() {
  const [activeTab, setActiveTab] = React.useState("All")
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredWriteups = writeups.filter(w => {
    const matchesCategory = activeTab === "All" || w.category === activeTab
    const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <Terminal className="h-5 w-5" />
            <span className="font-code text-sm font-bold uppercase tracking-widest">Repository</span>
          </div>
          <h1 className="text-4xl font-headline font-bold">CTF Write-Ups</h1>
          <p className="text-muted-foreground max-w-2xl">
            A collection of technical write-ups from various Capture The Flag competitions, 
            detailing my methodology and exploitation techniques.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search write-ups..." 
            className="pl-10 bg-card border-border focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="All" onValueChange={setActiveTab}>
        <TabsList className="bg-muted p-1 mb-8 overflow-x-auto inline-flex whitespace-nowrap">
          {categories.map(cat => (
            <TabsTrigger 
              key={cat} 
              value={cat}
              className="px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-headline"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWriteups.length > 0 ? (
            filteredWriteups.map((w) => (
              <Card key={w.id} className="bg-card border-border hover:border-primary/50 transition-all group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">
                      {w.category}
                    </Badge>
                    <span className={cn(
                      "text-[10px] uppercase font-bold px-2 py-0.5 rounded border",
                      w.difficulty === "Hard" ? "border-red-500/50 text-red-400" : 
                      w.difficulty === "Medium" ? "border-yellow-500/50 text-yellow-400" : 
                      "border-green-500/50 text-green-400"
                    )}>
                      {w.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">
                    {w.title}
                  </CardTitle>
                  <CardDescription className="flex items-center text-xs mt-1">
                    <Calendar className="h-3 w-3 mr-1" /> {w.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {w.summary}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 pt-0">
                  {w.tags.map(tag => (
                    <span key={tag} className="flex items-center text-[10px] text-muted-foreground font-code bg-muted px-2 py-0.5 rounded">
                      <Tag className="h-2 w-2 mr-1" /> {tag}
                    </span>
                  ))}
                  <Link href={`/ctf/${w.id}`} className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 border-2 border-dashed border-border rounded-lg">
              <Terminal className="h-12 w-12 text-muted mx-auto" />
              <p className="text-muted-foreground font-code">NO RESULTS FOUND IN DATABASE.</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
