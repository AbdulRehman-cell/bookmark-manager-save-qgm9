import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PageHeader, Card, Spinner, Alert, Badge } from '../components/ui';
import { useNavigate } from 'react-router-dom';

const TagsExplorer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tagStats, setTagStats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTagStats();
  }, []);

  const fetchTagStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookmarks')
        .select('tag');

      if (error) throw error;

      // Aggregate tags
      const counts = data.reduce((acc, curr) => {
        const tag = curr.tag?.toLowerCase() || 'untagged';
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});

      const formatted = Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      setTagStats(formatted);
    } catch (err) {
      setError('Failed to load archive structure.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="section"><Spinner size="lg" /></div>;

  return (
    <div className="section">
      <div className="container-narrow">
        <PageHeader 
          title="Archive Structure" 
          subtitle="A visual breakdown of your tags and how your library is organized." 
        />

        {error && <Alert variant="error" title="Error">{error}</Alert>}

        <div className="grid-3" style={{ marginTop: '48px' }}>
          {tagStats.length > 0 ? (
            tagStats.map((tag) => (
              <Card 
                key={tag.name} 
                interactive 
                onClick={() => navigate(`/app?filter=${tag.name}`)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    {tag.name}
                  </span>
                  <div style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--primary)' }}>
                    {tag.count}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {tag.count === 1 ? 'item saved' : 'items saved'}
                  </span>
                </div>
              </Card>
            ))
          ) : (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
              <p>No tags found. Start saving your first links to build your archive.</p>
            </div>
          )}
        </div>
        
        <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Keep organizes your world through single-tag classification. 
            Click a tag to view all associated bookmarks in the main application view.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TagsExplorer;