import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast, Button, Card, Badge, Spinner, EmptyState } from '../components/ui';

export default function Home() {
  const navigate = useNavigate();

  // Quick save widget form state
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Recent activity / Bookmarks feed
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Selected filter tag on preview feed
  const [selectedTag, setSelectedTag] = useState('all');

  useEffect(() => {
    fetchRecentBookmarks();
  }, []);

  const fetchRecentBookmarks = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setBookmarks(data || []);
    } catch (err) {
      console.error('Error loading bookmarks:', err);
      setFetchError('Unable to load recent records from the archive.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSave = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setSaveError('Please provide a valid web address.');
      return;
    }
    if (!title.trim()) {
      setSaveError('Please give this link a concise title.');
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);

      // Auto derive domain for favicon if not provided
      let domain = '';
      try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        domain = parsed.hostname;
      } catch {
        domain = 'link';
      }
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      const normalizedTag = (tag.trim() || 'reading').toLowerCase().replace(/\s+/g, '-');
      const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

      const newRecord = {
        url: formattedUrl,
        title: title.trim(),
        tag: normalizedTag,
        favicon_url: favicon,
        is_favorite: false,
      };

      const { data, error } = await supabase
        .from('bookmarks')
        .insert([newRecord])
        .select();

      if (error) throw error;

      toast.success('Filed into your archive.');
      setUrl('');
      setTitle('');
      setTag('');
      if (data && data[0]) {
        setBookmarks((prev) => [data[0], ...prev.slice(0, 7)]);
      }
    } catch (err) {
      console.error('Quick save error:', err);
      setSaveError('Could not preserve bookmark. Please try again.');
      toast.error('Failed to save bookmark.');
    } finally {
      setSaving(false);
    }
  };

  // Derive unique tags & counts from loaded bookmarks
  const tagCounts = bookmarks.reduce((acc, curr) => {
    const t = curr.tag?.toLowerCase() || 'general';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const popularTags = Object.keys(tagCounts);

  const displayedBookmarks = selectedTag === 'all'
    ? bookmarks
    : bookmarks.filter((b) => (b.tag || '').toLowerCase() === selectedTag.toLowerCase());

  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="home-container">
      {/* 1. HERO SECTION */}
      <section className="hero-editorial">
        <div className="hero-radial-glow" aria-hidden="true" />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="hero-eyebrow">A Quiet Luxury for the Web</span>
              <h1 className="hero-title">
                Save it once. Find it <em className="accent-italic">always</em>.
              </h1>
              <p className="hero-lead">
                Most things you save, you never see again. Keep is an intentional, archival bookmark
                manager for people who save things on purpose — without algorithms, feeds, or folder sprawl.
              </p>
              <div className="hero-actions">
                <Button variant="primary" onClick={() => navigate('/app')}>
                  Start keeping
                </Button>
                <Link to="/how-it-works" className="btn-ghost hero-secondary-link">
                  The philosophy &rarr;
                </Link>
              </div>

              <div className="hero-trust-metrics">
                <div className="metric-item">
                  <span className="metric-number">10,000+</span>
                  <span className="metric-label">Links neatly filed</span>
                </div>
                <div className="metric-divider" />
                <div className="metric-item">
                  <span className="metric-number">0 tabs</span>
                  <span className="metric-label">Hoarded in panic</span>
                </div>
                <div className="metric-divider" />
                <div className="metric-item">
                  <span className="metric-number">1 tag</span>
                  <span className="metric-label">Pure categorization</span>
                </div>
              </div>
            </div>

            {/* Quick Add Widget Card */}
            <div className="hero-card-column">
              <Card variant="bordered" className="quick-save-card">
                <div className="card-catalogue-header">
                  <div className="catalogue-index-bullet" />
                  <span className="catalogue-label">ARCHIVE DESK // NEW INGESTION</span>
                </div>
                <h3 className="quick-save-title">Drop a link to keep</h3>
                <p className="quick-save-subtitle">
                  Paste a URL. Name it. File it under a single deliberate tag.
                </p>

                {saveError && (
                  <div className="quick-save-alert-error" role="alert">
                    {saveError}
                  </div>
                )}

                <form onSubmit={handleQuickSave} className="quick-save-form">
                  <div className="form-field-group">
                    <label htmlFor="quick-url" className="form-field-label">URL Destination</label>
                    <input
                      id="quick-url"
                      type="text"
                      className="form-input"
                      placeholder="https://nytimes.com/article..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="quick-title" className="form-field-label">Title / Note</label>
                    <input
                      id="quick-title"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Design Systems at Scale"
                      value={title}
                      maxLength={120}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="quick-tag" className="form-field-label">Primary Tag</label>
                    <input
                      id="quick-tag"
                      type="text"
                      className="form-input"
                      placeholder="e.g. essays, architecture, design"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      disabled={saving}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    loading={saving}
                    className="quick-save-submit"
                  >
                    {saving ? 'Preserving...' : 'File into shelf'}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM STRIP */}
      <section className="section editorial-strip-section">
        <div className="container container-narrow">
          <blockquote className="editorial-pullquote">
            “Browser bookmarks are a drawer you never open.<br />
            Keep is a shelf you actually use.”
          </blockquote>
          <p className="editorial-caption">
            — THE DELIBERATE CURATOR’S CREED
          </p>
        </div>
      </section>

      <div className="hairline-separator" />

      {/* 3. RECENT ACTIVITY & POPULAR TAGS (LIVE PRODUCT PREVIEW) */}
      <section className="section archive-preview-section">
        <div className="container">
          <div className="section-head">
            <span className="section-label">THE INDEX CATALOGUE</span>
            <h2 className="section-title">Everything you’ve kept, neatly filed</h2>
            <p className="section-subtitle">
              Live records from the active repository. Filter by keyword or inspect recent additions.
            </p>
          </div>

          {/* Popular Tag Rail */}
          <div className="tag-filter-rail" role="tablist" aria-label="Tag filter">
            <button
              type="button"
              className={`tag-chip ${selectedTag === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTag('all')}
            >
              ALL ITEMS ({bookmarks.length})
            </button>
            {popularTags.map((t) => (
              <button
                key={t}
                type="button"
                className={`tag-chip ${selectedTag.toLowerCase() === t.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedTag(t)}
              >
                #{t.toUpperCase()} ({tagCounts[t]})
              </button>
            ))}
          </div>

          {/* Records Feed */}
          {loading ? (
            <div className="preview-loading-box">
              <Spinner size="lg" />
              <p className="loading-label">Accessing archival records...</p>
            </div>
          ) : fetchError ? (
            <div className="preview-error-box">
              <p className="error-message">{fetchError}</p>
              <Button variant="ghost" onClick={fetchRecentBookmarks}>
                Retry fetch
              </Button>
            </div>
          ) : displayedBookmarks.length === 0 ? (
            <EmptyState
              title="No records found"
              description={
                selectedTag === 'all'
                  ? 'Your archive has no bookmarks stored yet. Paste your first URL using the desk above.'
                  : `No links currently filed under "#${selectedTag}".`
              }
              action={
                selectedTag !== 'all' ? (
                  <Button variant="ghost" onClick={() => setSelectedTag('all')}>
                    Clear tag filter
                  </Button>
                ) : null
              }
            />
          ) : (
            <div className="records-grid">
              {displayedBookmarks.map((item) => (
                <article key={item.id} className="bookmark-card">
                  <div className="bookmark-card-top">
                    <div className="favicon-box">
                      {item.favicon_url ? (
                        <img
                          src={item.favicon_url}
                          alt=""
                          className="favicon-img"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="favicon-fallback">✦</span>
                      )}
                    </div>
                    <span className="card-tag-pill">
                      {item.tag || 'general'}
                    </span>
                  </div>

                  <h3 className="bookmark-card-title">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.title}
                    >
                      {item.title}
                    </a>
                  </h3>

                  <div className="bookmark-card-meta">
                    <span className="bookmark-card-domain">
                      {item.url ? item.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : ''}
                    </span>
                    <span className="meta-dot">·</span>
                    <span className="bookmark-card-time">
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="preview-action-row">
            <Link to="/app" className="archive-cta-link">
              Explore entire shelf &amp; search filters &rarr;
            </Link>
          </div>
        </div>
      </section>

      <div className="hairline-separator" />

      {/* 4. HOW IT WORKS */}
      <section className="section how-it-works-section">
        <div className="container">
          <div className="section-head">
            <span className="section-label">OPERATING PRINCIPLES</span>
            <h2 className="section-title">Three steps. No learning curve.</h2>
            <p className="section-subtitle">
              Paste a URL. Name it. Tag it. That is the entire system.
            </p>
          </div>

          <div className="steps-flow-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-card-title">Save instantly</h3>
              <p className="step-card-desc">
                Paste any web address from your browser or mobile clip. Keep extracts the domain and prepares it for cataloging.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-card-title">Tag with precision</h3>
              <p className="step-card-desc">
                One deliberate tag per item. No sprawling nested folders that become graveyards of unread intention.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-card-title">Find anytime</h3>
              <p className="step-card-desc">
                Instant tag filters and exact text retrieval. Return to essays, tools, and inspirations in two clicks flat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL FEATURE BREAKDOWN */}
      <section className="section features-breakdown-section">
        <div className="container">
          <div className="feature-row">
            <div className="feature-text-col">
              <span className="section-label">PERMANENCE OVER NOISE</span>
              <h2 className="feature-row-title">Built for people who tag on purpose.</h2>
              <p className="feature-row-p">
                Most bookmark tools want you to build taxonomies, install heavy extensions, or scroll algorithmic feeds of "suggested content."
              </p>
              <p className="feature-row-p">
                Keep strips away the clutter: every record is stored reliably, accessible via high-contrast typography, and stays pristine until you decide to remove it.
              </p>
              <ul className="feature-checklist">
                <li>Instant filtering without subfolder friction</li>
                <li>Zero algorithmic resurfacing or tracking feeds</li>
                <li>Archival visual language inspired by library card catalogues</li>
              </ul>
            </div>
            <div className="feature-visual-col">
              <div className="archival-image-frame">
                <img
                  src="https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcHg3MTQ1MzAtaW1hZ2Uta3d2eGd5dDMuanBn.jpg"
                  alt="Minimalist archival workspace with notebook and pen"
                  className="archival-photo"
                />
                <div className="image-caption-band">
                  <span>PLATE NO. 04 — THE UNHURRIED DESK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA BAND */}
      <section className="cta-archival-band">
        <div className="container container-narrow">
          <span className="cta-prehead">READY TO BEGIN</span>
          <h2 className="cta-headline">Your next good read is already saved somewhere.</h2>
          <p className="cta-body">
            Let’s go find it. Build a calm, permanent shelf for the ideas, essays, and tools that deserve your attention.
          </p>
          <div className="cta-button-wrapper">
            <Button variant="primary" onClick={() => navigate('/app')}>
              Open your archive
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}