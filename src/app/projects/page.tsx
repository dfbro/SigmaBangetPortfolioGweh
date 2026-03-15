
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cpu, Github, ExternalLink, ShieldCheck, Code } from "lucide-react"
import Image from "next/image"

const projects = [
  {
    title: "CipherVault",
    description: "A decentralized, zero-knowledge password manager built using Rust and React. Features multi-layered AES-256-GCM encryption and biometric auth integration.",
    image: "https://picsum.photos/seed/p1/600/400",
    tags: ["Rust", "Wasm", "Cryptography", "React"],
    github: "https://github.com",
    demo: "https://demo.com",
    category: "Security Tooling"
  },
  {
    title: "Vanguard Scanner",
    description: "Automated vulnerability scanner for microservices. Uses headless browsing to detect XSS, CSRF, and misconfigured CORS policies in modern SPAs.",
    image: "https://picsum.photos/seed/p2/600/400",
    tags: ["Go", "Docker", "Security", "NoSQL"],
    github: "https://github.com",
    demo: "https://demo.com",
    category: "Web Security"
  },
  {
    title: "Sentinel Proxy",
    description: "A high-performance reverse proxy with integrated Layer 7 DDoS mitigation and real-time threat intelligence filtering.",
    image: "https://picsum.photos/seed/p3/600/400",
    tags: ["C++", "Networking", "DDoS", "Linux"],
    github: "https://github.com",
    demo: "https://demo.com",
    category: "Networking"
  }
]

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-4 mb-12">
        <div className="flex items-center space-x-2 text-secondary">
          <Cpu className="h-5 w-5" />
          <span className="font-code text-sm font-bold uppercase tracking-widest">Showcase</span>
        </div>
        <h1 className="text-4xl font-headline font-bold">Technical Projects</h1>
        <p className="text-muted-foreground max-w-2xl">
          A deep dive into the technical solutions I've architected, focusing on security, performance, and scalability.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {projects.map((project, idx) => (
          <Card key={idx} className="bg-card border-border overflow-hidden group">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 relative h-48 md:h-full min-h-[200px]">
                <Image 
                  src={project.image} 
                  alt={project.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  data-ai-hint="project screenshot"
                />
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="md:col-span-3 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="border-primary/30 text-primary text-[10px] uppercase tracking-tighter">
                      {project.category}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-headline font-bold mb-3">{project.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[11px] font-code px-2 py-0.5 rounded bg-muted border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm" className="flex-1 rounded-none border-border hover:bg-muted" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" /> GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 rounded-none border-border hover:bg-muted" asChild>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> Demo
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-20 p-8 border border-border bg-muted/30 rounded-lg text-center">
        <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-headline font-bold mb-2">Commitment to Secure Coding</h3>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm">
          All projects follow OWASP Top 10 guidelines and undergo rigorous manual code review. 
          View more experiments on my <a href="#" className="text-primary hover:underline">GitHub Laboratory</a>.
        </p>
      </div>
    </div>
  )
}
