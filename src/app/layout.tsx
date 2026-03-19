
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { TVEffect } from '@/components/TVEffect';
import { ShellGate } from '@/components/ShellGate';
import { getProfileSettings } from '@/lib/profile-storage';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfileSettings();
  const name = profile.displayName || 'Cybersecurity Specialist';
  const description = profile.aboutText || 'A professional cybersecurity portfolio and CTF write-up repository.';
  
  // Ambil username IG dari URL jika ada
  const igUsername = profile.instagramUrl?.split('/').filter(Boolean).pop() || '';

  return {
	metadataBase: new URL('https://claritys.my.id'),
	alternates: {
  		canonical: 'https://claritys.my.id',
	},
    title: {
      template: `%s | ${name}`,
      default: `${name} | Cybersecurity Portfolio`,
    },
    description: description,
    keywords: [
      name, igUsername, 'Cybersecurity', 'CTF Player', 'Write-ups', 'Security Researcher', 'Ethical Hacking', 'Portfolio', 'Bug Bounty', 'elanggslibaw', 'Elang Dimas Syadewa', 'SMK Telkom Malang', 'Digital Forensics'
    ].filter(Boolean),
    authors: [{ name: name }],
    creator: name,
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: profile.websiteUrl || 'https://claritys.my.id',
      title: `${name} | Cybersecurity Portfolio`,
      description: description,
      siteName: `${name} Portfolio`,
      images: [
        {
          url: profile.profileImageUrl || '/profile.jpg',
          width: 800,
          height: 800,
          alt: name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | Cybersecurity Portfolio`,
      description: description,
      images: [profile.profileImageUrl || '/profile.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Source+Code+Pro:wght@400;600&display=swap" rel="stylesheet" />
	  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Elang Dimas Syadewa",
        url: "https://claritys.my.id",
        sameAs: [
          "https://instagram.com/elanggslibaw", "https://github.com/Claritys11" ], jobTitle: "Cybersecurity Specialist", description: "Cybersecurity portfolio and CTF write-up repository"
      }),
    }}
  />
      </head>
      <body className="font-body antialiased text-foreground min-h-screen selection:bg-primary/30 selection:text-primary">
        <ShellGate>
          <TVEffect />
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Toaster />
        </ShellGate>
      </body>
    </html>
  );
}
