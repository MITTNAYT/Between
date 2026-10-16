import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Bookmark, Copy, Check, Heart, ArrowRight, Home, Download, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playHandshakeSound } from '../utils/audio';
import { RELATIONSHIP_TYPES } from '../utils/engine';

export default function ClosingScreen({
  bookmarkedMoments = [],
  relationshipType = 'COUPLE',
  onReturnHome,
  onStartNew
}) {
  const [copiedMoments, setCopiedMoments] = useState(false);
  const [appreciationNote, setAppreciationNote] = useState('');
  const [noteSent, setNoteSent] = useState(false);
  const [isGeneratingKeepsake, setIsGeneratingKeepsake] = useState(false);

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

  // High-Resolution 1080x1440 Keepsake Canvas Generator
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
    ctx.beginPath();
    ctx.roundRect(centerX - 45, logoY - 45, 90, 90, 20);
    ctx.fill();

    // Venn left circle (#C2673B)
    ctx.strokeStyle = '#C2673B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX - 13, logoY, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Venn right circle (#18181B)
    ctx.strokeStyle = '#18181B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX + 13, logoY, 20, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Header Titles
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('B E T W E E N', centerX, logoY + 95);

    ctx.fillStyle = '#8C8278';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('RITUALS OF CLOSENESS', centerX, logoY + 130);

    // Date & Mode Pill
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const relLabel = RELATIONSHIP_TYPES[relationshipType]?.label || 'Partner';
    ctx.fillStyle = '#4A443E';
    ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${relLabel} Session · ${dateStr}`, centerX, logoY + 175);

    // Divider Line
    ctx.strokeStyle = '#DFD5C6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, logoY + 215);
    ctx.lineTo(900, logoY + 215);
    ctx.stroke();

    // 5. Starred Questions / Saved Moments
    ctx.fillStyle = '#1C1917';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('MOMENTS WE REMEMBER', centerX, logoY + 275);

    let currentY = logoY + 340;
    const questionsToDraw = bookmarkedMoments.slice(0, 3);

    if (questionsToDraw.length === 0) {
      ctx.fillStyle = '#8C8278';
      ctx.font = 'italic 26px "Source Serif 4", serif';
      ctx.fillText('“A quiet ritual of deep presence and shared time.”', centerX, currentY + 60);
      currentY += 160;
    } else {
      questionsToDraw.forEach((item, index) => {
        ctx.fillStyle = '#1C1917';
        ctx.font = 'italic 28px "Source Serif 4", serif';
        
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

    // 6. Appreciation Note Box
    if (appreciationNote.trim()) {
      currentY += 20;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(160, currentY, 760, 200, 16);
      ctx.fill();
      ctx.strokeStyle = '#DFD5C6';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#D94E34';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('HEARTFELT TAKEAWAY', centerX, currentY + 45);

      ctx.fillStyle = '#1C1917';
      ctx.font = 'italic 24px "Source Serif 4", serif';

      const noteWords = appreciationNote.trim().split(' ');
      let noteLine = '';
      let noteY = currentY + 95;
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
      link.download = `Between-Keepsake-${new Date().toISOString().slice(0, 10)}.png`;
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
          fontFamily: 'var(--font-serif)',
          fontSize: '32px',
          fontWeight: '600',
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
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--color-ink)',
              margin: 0
            }}>
              Saved Moments ({bookmarkedMoments.length})
            </h3>
          </div>

          {bookmarkedMoments.length > 0 && (
            <button
              onClick={handleCopyMoments}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', gap: '4px' }}
            >
              {copiedMoments ? <Check size={13} strokeWidth={2.4} color="#387B6A" /> : <Copy size={13} strokeWidth={2.2} />}
              <span>{copiedMoments ? 'Copied' : 'Copy All'}</span>
            </button>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {bookmarkedMoments.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  padding: '12px 14px',
                  background: 'var(--color-surface-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  lineHeight: '1.45',
                  color: 'var(--color-ink)',
                  fontFamily: 'var(--font-serif)'
                }}
              >
                “{item.text}”
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mutual Appreciation Note */}
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
            Closing Takeaway or Appreciation
          </label>
        </div>
        
        <p style={{ fontSize: '13px', color: 'var(--color-body)', marginBottom: '12px' }}>
          What is one thing you appreciate about your partner or friend after this conversation?
        </p>

        <textarea
          rows={3}
          value={appreciationNote}
          onChange={(e) => setAppreciationNote(e.target.value)}
          placeholder="E.g., Thank you for opening up about your dreams today. It was so peaceful listening to you..."
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
            <span>Shared with heartfelt gratitude</span>
          </div>
        ) : (
          <button
            onClick={() => {
              playClickSound();
              if (appreciationNote.trim()) {
                setNoteSent(true);
              }
            }}
            disabled={!appreciationNote.trim()}
            className="btn-secondary"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '13px',
              opacity: appreciationNote.trim() ? 1 : 0.5
            }}
          >
            Save Note
          </button>
        )}
      </div>

      {/* Keepsake Generator Button */}
      <button
        onClick={handleDownloadKeepsake}
        disabled={isGeneratingKeepsake}
        className="btn-secondary"
        style={{
          width: '100%',
          padding: '14px',
          gap: '8px',
          borderColor: 'var(--color-hairline-strong)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <Download size={17} strokeWidth={2.4} color="var(--color-ember)" />
        <span style={{ fontWeight: '700' }}>
          {isGeneratingKeepsake ? 'Rendering Keepsake...' : 'Download Letterpress Keepsake Card (PNG)'}
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
