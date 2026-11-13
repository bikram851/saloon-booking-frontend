import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  Send,
  CornerDownRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { getProReviews, saveProReviews } from '../proData';

export default function ProReviewsPage() {
  const [reviews, setReviews] = useState(getProReviews());
  const [replyText, setReplyText] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);

  const handlePostReply = (id) => {
    const text = replyText[id];
    if (!text || !text.trim()) return;

    const updated = reviews.map(r => r.id === id ? { ...r, response: text.trim() } : r);
    setReviews(updated);
    saveProReviews(updated);
    setActiveReplyId(null);
    setReplyText({ ...replyText, [id]: '' });
  };

  return (
    <div>
      <div className="pro-page-header">
        <div>
          <h1 className="pro-page-title">Client Reviews & Testimonials</h1>
          <p className="pro-page-subtitle">
            Monitor client feedback, celebrate top-rated stylists, and reply directly to verified salon guests.
          </p>
        </div>
      </div>

      {/* Ratings Overview KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="pro-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--pro-navy)', lineHeight: 1 }}>
              4.85
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', color: '#D97706', margin: '6px 0 2px' }}>
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={15} fill="#D97706" />)}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--pro-text-muted)' }}>142 verified reviews</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px' }}>5★</span>
              <div style={{ flex: 1, height: '6px', background: 'var(--pro-border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '84%', height: '100%', background: '#10B981' }} />
              </div>
              <span style={{ width: '30px', textAlign: 'right' }}>84%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px' }}>4★</span>
              <div style={{ flex: 1, height: '6px', background: 'var(--pro-border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '13%', height: '100%', background: '#0879E8' }} />
              </div>
              <span style={{ width: '30px', textAlign: 'right' }}>13%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px' }}>3★</span>
              <div style={{ flex: 1, height: '6px', background: 'var(--pro-border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '3%', height: '100%', background: '#F59E0B' }} />
              </div>
              <span style={{ width: '30px', textAlign: 'right' }}>3%</span>
            </div>
          </div>
        </div>

        <div className="pro-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: 'var(--pro-navy)' }}>
            Client Recommendation Rate
          </h4>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginBottom: '4px' }}>
            97.8%
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--pro-text-muted)' }}>
            Clients who would book again or recommend this salon to their friends.
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map(rev => (
          <div key={rev.id} className="pro-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--pro-navy)' }}>{rev.customerName}</strong>
                  {rev.verified && (
                    <span className="pro-badge confirmed" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={12} /> Verified Customer
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--pro-text-muted)', marginTop: '2px' }}>
                  Service: <strong>{rev.serviceName}</strong> • Stylist: <strong>{rev.barberName}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '2px', color: '#D97706' }}>
                  {[...Array(Math.floor(rev.rating))].map((_, i) => (
                    <Star key={i} size={14} fill="#D97706" />
                  ))}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--pro-text-muted)' }}>{rev.date}</span>
              </div>
            </div>

            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--pro-text)', lineHeight: 1.5 }}>
              "{rev.comment}"
            </p>

            {rev.response ? (
              <div style={{ background: 'var(--pro-bg)', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '3px solid var(--pro-blue)', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--pro-navy)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CornerDownRight size={14} color="var(--pro-blue)" /> Salon Owner Response:
                </div>
                <p style={{ margin: 0, color: 'var(--pro-text-muted)' }}>
                  {rev.response}
                </p>
              </div>
            ) : (
              <div>
                {activeReplyId === rev.id ? (
                  <div style={{ marginTop: '0.75rem' }}>
                    <textarea
                      rows="2"
                      className="pro-form-textarea"
                      placeholder="Write a polite public response to your guest..."
                      value={replyText[rev.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                      style={{ width: '100%', marginBottom: '6px' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setActiveReplyId(null)}
                        className="pro-btn pro-btn-secondary pro-btn-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handlePostReply(rev.id)}
                        className="pro-btn pro-btn-primary pro-btn-sm"
                      >
                        <Send size={13} /> Post Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveReplyId(rev.id)}
                    className="pro-btn pro-btn-secondary pro-btn-sm"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <MessageSquare size={13} /> Reply to Review
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
