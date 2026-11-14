import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Bookmark, Copy, Check, Heart, ArrowRight, Home, Download, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playHandshakeSound } from '../utils/audio';
import { RELATIONSHIP_TYPES } from '../utils/engine';
import { downloadCardAsPng } from '../utils/cardExporter';
import { getCardThemeColor, getCardMascot } from './CardMascots';

export default function ClosingScreen({
  bookmarkedMoments = [],
  relationshipType = 'COUPLE',
  onReturnHome,
  onStartNew,
  hostName = 'Partner 1',
  guestName = 'Partner 2',
  peerName = 'Partner',
  myName = 'You',
  isHost = true,
  peerAppreciationNote = '',
  myAppreciationNote = '',
  onSendAppreciationNote
}) {
  const [copiedMoments, setCopiedMoments] = useState(false);
  const [appreciationNote, setAppreciationNote] = useState(myAppreciationNote || '');
  const [noteSent, setNoteSent] = useState(!!myAppreciationNote);
  const [isGeneratingKeepsake, setIsGeneratingKeepsake] = useState(false);

  useEffect(() => {
    if (myAppreciationNote) {
      setAppreciationNote(myAppreciationNote);
      setNoteSent(true);
    }
  }, [myAppreciationNote]);

  useEffect(() => {
    playHandshakeSound();

    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D94E34', '#DE4D6A', '#C6882C', '#F9ECE4', '#E87D65']
      });
    } catch (e) {}
  }, []);

  const handleCopyMoments = () => {
    playClickSound();
    const text = bookmarkedMoments.map((q, idx) => `${idx + 1}. “${q.text}”`).join('\n\n');
    navigator.clipboard.writeText(`✨ Moments we saved from our Between session:\n\n${text}`).then(() => {
      setCopiedMoments(true);
      setTimeout(() => setCopiedMoments(false), 2400);
    }).catch(() => {
      prompt('Copy your saved moments:', text);
    });
  };

  const handleDownloadAllMiniCards = async () => {
    playClickSound();
    for (let i = 0; i < bookmarkedMoments.length; i++) {
      await downloadCardAsPng(bookmarkedMoments[i]);
      // Small pause between downloads to prevent browser throttling
      await new Promise(r => setTimeout(r, 250));
    }
  };

  const handleSendNote = () => {
    playClickSound();
    if (!appreciationNote.trim()) return;
    setNoteSent(true);
    onSendAppreciationNote?.(appreciationNote.trim());
  };

  // High-Resolution 1080x1440 Keepsake Canvas Generator
  // USER REQUIREMENT: "i should only download what they wrote and so forth"
  const handleDownloadKeepsake = () => {
    playClickSound();
    setIsGeneratingKeepsake(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');

    // 1. Beige Background
    ctx.fillStyle = '#F4ECE2';
    ctx.fillRect(0, 0, 1080, 1440);

    // 2. Elegant Border
    ctx.strokeStyle = '#DFD5C6';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, 960, 1320);

    ctx.strokeStyle = '#D5C7B5';
    ctx.lineWidth = 1;
    ctx.strokeRect(72, 72, 936, 1296);

    // 3. Draw Between Logo at top
    const centerX = 540;
    const logoY = 160;

    // Outer squircle
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E6DDD2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(centerX - 48, logoY - 48, 96, 96, 24);
    ctx.fill();
    ctx.stroke();

    // Golden Vesica Lens Fill
    ctx.fillStyle = 'rgba(229, 169, 60, 0.45)';
    ctx.beginPath();
    ctx.arc(centerX - 12, logoY, 20, -Math.PI / 3, Math.PI / 3, false);
    ctx.arc(centerX + 12, logoY, 20, (2 * Math.PI) / 3, (4 * Math.PI) / 3, false);
    ctx.closePath();
    ctx.fill();

    // Left ring (Ember #D94E34)
    ctx.strokeStyle = '#D94E34';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX - 12, logoY, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Right ring (Ink #1C1917)
    ctx.strokeStyle = '#1C1917';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX + 12, logoY, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Center spark dot
    ctx.fillStyle = '#E5A93C';
    ctx.beginPath();
    ctx.arc(centerX, logoY, 3, 0, Math.PI * 2);
    ctx.fill();

    // 4. Header Titles
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('B E T W E E N', centerX, logoY + 95);

    ctx.fillStyle = '#C2673B';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${hostName} & ${guestName}`, centerX, logoY + 130);

    ctx.fillStyle = '#8C8278';
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('RITUALS OF CLOSENESS', centerX, logoY + 160);

    // Date & Mode Pill
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const relLabel = RELATIONSHIP_TYPES[relationshipType]?.label || 'Partner';
    ctx.fillStyle = '#4A443E';
    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${relLabel} Session · ${dateStr}`, centerX, logoY + 195);

    // Divider Line
    ctx.strokeStyle = '#DFD5C6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, logoY + 225);
    ctx.lineTo(900, logoY + 225);
    ctx.stroke();

    // 5. Starred Questions / Saved Moments
    ctx.fillStyle = '#1C1917';
    ctx.font = '700 24px "Outfit", sans-serif';
    ctx.fillText('MOMENTS WE REMEMBER', centerX, logoY + 275);

    let currentY = logoY + 340;
    const questionsToDraw = bookmarkedMoments.slice(0, 3);

    if (questionsToDraw.length === 0) {
      ctx.fillStyle = '#8C8278';
      ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('“A quiet ritual of deep presence and shared time.”', centerX, currentY + 60);
      currentY += 160;
    } else {
      questionsToDraw.forEach((item, index) => {
        ctx.fillStyle = '#1C1917';
        ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
        
        // Wrap text
        const words = item.text.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 780 && n > 0) {
            ctx.fillText(line, centerX, currentY);
            line = words[n] + ' ';
            currentY += 42;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, centerX, currentY);
        currentY += 75;
      });
    }

    // 6. Appreciation Note Box (Downloading strictly what the partner wrote!)
    const noteToRender = peerAppreciationNote?.trim() || appreciationNote?.trim();
    const author = peerName || 'Partner';
    const recipient = myName || 'You';

    if (noteToRender) {
      currentY += 20;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(160, currentY, 760, 220, 16);
      ctx.fill();
      ctx.strokeStyle = '#DFD5C6';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#D94E34';
      ctx.font = 'bold 20px "Outfit", sans-serif';
      ctx.fillText(`WORDS FROM ${author.toUpperCase()}`, centerX, currentY + 45);

      ctx.fillStyle = '#8C8278';
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Dedicated with love to ${recipient}`, centerX, currentY + 72);

      ctx.fillStyle = '#1C1917';
      ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';

      const noteWords = noteToRender.trim().split(' ');
      let noteLine = '';
      let noteY = currentY + 115;
      for (let n = 0; n < noteWords.length; n++) {
        const testLine = noteLine + noteWords[n] + ' ';
        if (ctx.measureText(testLine).width > 680 && n > 0) {
          ctx.fillText(noteLine, centerX, noteY);
          noteLine = noteWords[n] + ' ';
          noteY += 36;
        } else {
          noteLine = testLine;
        }
      }
      ctx.fillText(noteLine, centerX, noteY);
    }

    // 7. Footer
    ctx.fillStyle = '#8C8278';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Rendered with love across the distance · Between App', centerX, 1330);

    // Download PNG
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `Between-Keepsake-from-${author.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsGeneratingKeepsake(false);
    }, 400);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '480px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      animation: 'fadeIn 0.4s ease-out',
      textAlign: 'center',
      paddingBottom: '32px'
    }}>
      {/* Gentle Ending Header */}
      <div style={{ padding: '16px 0 8px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(217, 78, 52, 0.1)',
          border: '1px solid rgba(217, 78, 52, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: 'var(--color-ember)'
        }}>
          <Sparkles size={30} strokeWidth={2.2} />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px',
          fontWeight: '700',
          color: 'var(--color-ink)',
          marginBottom: '8px'
        }}>
          Ritual Completed
        </h1>

        <p style={{
          fontSize: '15px',
          color: 'var(--color-body)',
          lineHeight: '1.55',
          maxWidth: '380px',
          margin: '0 auto'
        }}>
          Thank you for gifting each other your undivided attention. Closeness isn't built in grand gestures, but in moments like this.
        </p>
      </div>

      {/* Bookmarked Moments Summary */}
      <div className="soft-card" style={{ padding: '24px', textAlign: 'left' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bookmark size={18} strokeWidth={2.4} color="var(--color-ember)" />
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--color-ink)',
              margin: 0
            }}>
              Saved Moments ({bookmarkedMoments.length})
            </h3>
          </div>

          {bookmarkedMoments.length > 0 && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={handleDownloadAllMiniCards}
                className="btn-secondary"
                style={{ padding: '6px 11px', fontSize: '11.5px', gap: '4px' }}
                title="Download all starred moments as physical mini cards PNG"
              >
                <Download size={12} strokeWidth={2.4} />
                <span>Mini Cards</span>
              </button>
              <button
                onClick={handleCopyMoments}
                className="btn-secondary"
                style={{ padding: '6px 11px', fontSize: '11.5px', gap: '4px' }}
              >
                {copiedMoments ? <Check size={12} strokeWidth={2.4} color="#387B6A" /> : <Copy size={12} strokeWidth={2.2} />}
                <span>{copiedMoments ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>
          )}
        </div>

        {bookmarkedMoments.length === 0 ? (
          <p style={{
            fontSize: '13px',
            color: 'var(--color-muted)',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '12px 0'
          }}>
            No questions were starred this session. Every conversation has its own rhythm.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px'
          }}>
            {bookmarkedMoments.map((item, idx) => {
              const themeColor = getCardThemeColor(item);
              const Mascot = getCardMascot(item.category, item.id, item.depth);
              const isWildcard = item.isWildcard || item.id?.startsWith('wildcard');

              return (
                <div
                  key={item.id || idx}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 6px 16px -4px rgba(28, 25, 23, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Inner Powder Blue Block */}
                  <div style={{
                    background: themeColor,
                    borderRadius: '12px',
                    padding: '10px 10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '230px',
                    textAlign: 'center',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    {/* Top Row: Star Badge & Download Button */}
                    <div style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <div className="tabletop-star-badge" style={{ width: '22px', height: '22px', fontSize: '11px' }}>
                        ★
                      </div>
                      <button
                        onClick={() => {
                          playClickSound();
                          downloadCardAsPng(item);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.88)',
                          border: '1px solid rgba(28, 25, 23, 0.12)',
                          borderRadius: '50%',
                          width: '26px',
                          height: '26px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#1C1917',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                        }}
                        title="Download this physical mini card PNG"
                      >
                        <Download size={13} strokeWidth={2.4} />
                      </button>
                    </div>

                    {/* Mini Mascot */}
                    <div style={{ margin: '2px 0' }}>
                      <Mascot size={64} />
                    </div>

                    {/* White Sticker Label */}
                    <div className="card-label-sticker" style={{ fontSize: '9px', padding: '3px 8px', margin: '4px 0' }}>
                      {isWildcard ? 'WILDCARD' : (item.category || 'BETWEEN')}
                    </div>

                    {/* Prompt snippet */}
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11.5px',
                      fontWeight: '600',
                      lineHeight: '1.4',
                      color: '#1C1917',
                      margin: '4px 0 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      “{item.text}”
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mutual Appreciation Note Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Card 1: What Peer Wrote For You (The note you will download) */}
        <div className="soft-card" style={{
          padding: '24px',
          textAlign: 'left',
          background: peerAppreciationNote ? 'rgba(217, 78, 52, 0.04)' : 'var(--color-surface)',
          border: peerAppreciationNote ? '1.5px solid rgba(217, 78, 52, 0.25)' : '1px solid var(--color-hairline)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} strokeWidth={2.4} color="var(--color-ember)" />
              <label style={{
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-ember)'
              }}>
                What {peerName} Wrote For You
              </label>
            </div>
            {peerAppreciationNote && (
              <span className="pill-badge pill-badge-ember" style={{ fontSize: '10px', padding: '2px 8px' }}>
                Keepsake Note
              </span>
            )}
          </div>

          {peerAppreciationNote ? (
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              fontSize: '15px',
              lineHeight: '1.6',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
              boxShadow: 'var(--shadow-sm)'
            }}>
              “{peerAppreciationNote}”
            </div>
          ) : (
            <div style={{
              padding: '16px',
              background: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              color: 'var(--color-muted)',
              lineHeight: '1.5',
              textAlign: 'center',
              fontStyle: 'italic',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-ember)', animation: 'pulse 1.8s infinite' }} />
              <span>Waiting for {peerName} to share their note...</span>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>Their words will appear here and on your keepsake card.</span>
            </div>
          )}
        </div>

        {/* Card 2: Your Note For Peer */}
        <div className="soft-card" style={{ padding: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Heart size={15} strokeWidth={2.4} color="var(--color-ember)" />
            <label style={{
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)'
            }}>
              Your Note For {peerName}
            </label>
          </div>
          
          <p style={{ fontSize: '13px', color: 'var(--color-body)', marginBottom: '12px' }}>
            What is one thing you appreciate about {peerName} after this conversation?
          </p>

          <textarea
            rows={3}
            value={appreciationNote}
            onChange={(e) => setAppreciationNote(e.target.value)}
            placeholder={`Thank you for being open and present with me today, ${peerName}...`}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              lineHeight: '1.5',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-hairline)',
              background: 'var(--color-surface-subtle)',
              outline: 'none',
              resize: 'none',
              marginBottom: '12px',
              fontFamily: 'inherit'
            }}
          />

          {noteSent ? (
            <div style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(56, 123, 106, 0.12)',
              color: 'var(--color-sage)',
              fontSize: '13px',
              fontWeight: '600',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <Check size={16} strokeWidth={2.5} />
              <span>Shared with {peerName}</span>
            </div>
          ) : (
            <button
              onClick={handleSendNote}
              disabled={!appreciationNote.trim()}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '11px',
                fontSize: '13px',
                opacity: appreciationNote.trim() ? 1 : 0.5
              }}
            >
              Send Note to {peerName}
            </button>
          )}
        </div>
      </div>

      {/* Keepsake Generator Button */}
      <button
        onClick={() => handleDownloadKeepsake()}
        disabled={isGeneratingKeepsake}
        className="btn-secondary"
        style={{
          width: '100%',
          padding: '13px 16px',
          gap: '8px',
          borderColor: 'var(--color-hairline-strong)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <Download size={17} strokeWidth={2.4} color="var(--color-ember)" />
        <span style={{ fontWeight: '700', fontSize: 'clamp(12px, 3.2vw, 14px)', lineHeight: '1.3' }}>
          {isGeneratingKeepsake
            ? 'Rendering Keepsake...'
            : `Download Keepsake with ${peerName}'s Words (PNG)`
          }
        </span>
      </button>

      {/* Navigation Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={() => {
            playClickSound();
            onStartNew();
          }}
          className="btn-primary"
          style={{ width: '100%', padding: '15px', gap: '8px' }}
        >
          <span>Start Another Ritual</span>
          <ArrowRight size={18} strokeWidth={2.4} />
        </button>

        <button
          onClick={() => {
            playClickSound();
            onReturnHome();
          }}
          className="btn-secondary"
          style={{ width: '100%', padding: '12px', gap: '8px' }}
        >
          <Home size={16} strokeWidth={2.2} />
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  );
}
