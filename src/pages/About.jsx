import React from 'react';
import { PageHeader } from '../components/ui';

export default function About() {
  return (
    <div className="container-narrow section">
      <PageHeader 
        title="We made a bookmark manager that respects your attention." 
        subtitle="Keep is a study in subtraction. Every field we didn't add is a decision you don't have to make."
      />

      <div className="content-block" style={{ maxWidth: '720px', marginTop: '64px' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', marginBottom: '24px' }}>Why we built Keep</h2>
        <p className="body-text" style={{ marginBottom: '32px', lineHeight: '1.65' }}>
          We built Keep after losing one too many good articles to a browser crash and a bookmarks bar nobody scrolls. The modern web is designed to keep you clicking, not to help you remember. We wanted a quiet space to store our findings—an archive, not a feed.
        </p>

        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', marginBottom: '24px' }}>Minimal by design, not by accident</h2>
        <p className="body-text" style={{ marginBottom: '32px', lineHeight: '1.65' }}>
          Most tools force you into complex folder hierarchies or algorithmic "smart" collections. Keep ignores the noise. We believe that if a system is small enough to actually use, you'll actually use it. Three fields—URL, Title, and Tag—are all that separate your discovery from your archive.
        </p>

        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', marginBottom: '24px' }}>Who Keep is for</h2>
        <p className="body-text" style={{ marginBottom: '32px', lineHeight: '1.65' }}>
          Keep is for the researcher building a reference library, the reader saving articles for a quiet weekend, and the designer collecting visual notes. It is for anyone who says "I'll read that later" and actually means it.
        </p>

        <div className="grid-3" style={{ marginTop: '80px', gap: '32px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Permanence</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Your data is yours. No scanning, no ads, no surprises.</p>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Simplicity</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>One tag, one link. No nested folders to get lost in.</p>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Privacy</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>We don't sell your browsing patterns or suggest what to read.</p>
          </div>
        </div>

        <div style={{ marginTop: '96px', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '64px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '24px' }}>
            Keep is small on purpose. Come build your shelf.
          </p>
          <a href="/app" className="btn-primary">Open your archive</a>
        </div>
      </div>
    </div>
  );
}