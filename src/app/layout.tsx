import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { TVEffect } from '@/components/TVEffect';
import { ShellGate } from '@/components/ShellGate';
import { getProfileSettings } from '@/lib/server-storage';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfileSettings().catch(() => null);

  const name = profile?.displayName || 'Elang Dimas Syadewa';
  const description =
    profile?.aboutText ||
    'Cybersecurity specialist, CTF player, and web developer. Explore my portfolio, projects, and write-ups.';

  const baseUrl = profile?.websiteUrl || 'https://claritys.my.id';
  const previewImage = `${baseUrl}/preview.png`;

  // Ambil username IG otomatis
  const igUsername =
    profile?.instagramUrl?.split('/').filter(Boolean).pop() || '';

  return {
    metadataBase: new URL(baseUrl),

    alternates: {
      canonical: baseUrl,
    },

    title: {
      template: `%s | ${name}`,
      default: `${name} | Cybersecurity Portfolio`,
    },

    description,

    keywords: [
      name,
      igUsername,
      'Elang Dimas Syadewa',
      'elanggslibaw',
      'Cybersecurity',
      'CTF Player',
      'Write-ups',
      'Security Researcher',
      'Ethical Hacking',
      'Bug Bounty',
      'Web Developer',
      'Portfolio',
      'SMK Telkom Malang',
      'Digital Forensics',
    ].filter(Boolean),

    authors: [{ name }],
    creator: name,

    icons: {
      icon: '/favicon.ico',
    },

    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: baseUrl,
      title: `${name} | Cybersecurity Portfolio`,
      description,
      siteName: `${name} Portfolio`,
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${name} | Cybersecurity Portfolio`,
      description,
      images: [previewImage],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Elang Dimas Syadewa',
    url: 'https://claritys.my.id',
    image: 'https://claritys.my.id/preview.png',
    sameAs: [
      'https://instagram.com/elanggslibaw',
      'https://github.com/Claritys11',
    ],
    jobTitle: 'Cybersecurity Specialist',
    description:
      'Cybersecurity specialist, CTF player, and web developer.',
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Source+Code+Pro:wght@400;600&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD (SEO Advanced) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body className="font-body antialiased text-foreground min-h-screen selection:bg-primary/30 selection:text-primary">
        <ShellGate>
          <TVEffect />
          <Navbar />
          <main className="pt-16">{children}</main>
          <Toaster />
        </ShellGate>
      </body>
    </html>
  );
}