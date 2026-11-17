import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verity · AI Content Intelligence & Plagiarism Finder',
  description: 'Enterprise AI and human content intelligence platform for plagiarism detection, factual accuracy verification, and brand risk mitigation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen text-[#0F172A] bg-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
