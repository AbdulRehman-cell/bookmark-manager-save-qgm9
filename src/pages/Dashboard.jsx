import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button, Card, Input, Badge, EmptyState, Spinner } from '../components/ui';

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', url: '', tag: '' });
  const [filter, setFilter] = useState('All');
  const [saving, setSaving] = useState(false);

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase.from('bookmarks').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBookmarks(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookmarks(); }, []);

  const tags = ['All', ...new Set(bookmarks.map(b => b.tag))];
  const filtered = filter === 'All' ? bookmarks : bookmarks.filter(b => b.tag === filter);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.url || !form.title) return;
    setSaving(true);
    try {
      await supabase.from('bookmarks').insert([{ ...form, tag: form.tag.toLowerCase() }]);
      setForm({ title: '', url: '', tag: '' });
      fetchBookmarks();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      await supabase.from('bookmarks').delete().eq('id', id);
      fetchBookmarks();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="container-narrow">
      <header className="page-header">
        <h1>Everything you've <i>kept</i>.</h1>
      </header>

      <section className="card card-white">
        <form onSubmit={handleSave} className="grid-3">
          <Input label="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <Input label="URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})} />
          <Input label="Tag" value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} />
          <Button type="submit" loading={saving} className="btn-primary">Save bookmark</Button>
        </form>
      </section>

      <section className="filter-rail">
        {tags.map(t => (
          <button 
            key={t} 
            className={`tag-pill ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </section>

      {loading ? <Spinner size="lg" /> : (
        <div className="bookmark-list">
          {filtered.length === 0 ? (
            <EmptyState title="Shelf is empty" description="Add your first link above to start your archive." />
          ) : (
            filtered.map(b => (
              <div key={b.id} className="bookmark-card">
                <div className="favicon-box">
                  <img src={`https://www.google.com/s2/favicons?domain=${b.url}`} alt="" />
                </div>
                <div className="content">
                  <h3>{b.title}</h3>
                  <a href={b.url} target="_blank" rel="noreferrer" className="link-muted">{b.url}</a>
                </div>
                <Badge variant="secondary">{b.tag}</Badge>
                <button className="btn-ghost" onClick={() => deleteBookmark(b.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}