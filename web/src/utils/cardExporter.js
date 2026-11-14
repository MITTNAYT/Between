import { getCardThemeColor } from '../components/CardMascots';

/**
 * High-definition Canvas generator for physical tabletop mini playing cards (800x1120 px).
 * Renders outer white cardstock, inner pastel block, star badge, mascot, category pill, and grotesque typography.
 */

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

/**
 * Draws a clean mascot illustration using vector silhouettes
 */
function drawMascot(ctx, mascotName, centerX, centerY, scale = 1.8) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);

  // Soft ground shadow
  ctx.fillStyle = 'rgba(28, 25, 23, 0.16)';
  ctx.beginPath();
  ctx.ellipse(0, 44, 26, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw Ghost (default / most iconic mascot from photo)
  // Silhouette offset shadow
  ctx.fillStyle = '#1C1917';
  ctx.beginPath();
  ctx.moveTo(-1, -34);
  ctx.bezierCurveTo(-15, -34, -23, -22, -23, -6);
  ctx.bezierCurveTo(-23, 10, -25, 24, -31, 30);
  ctx.bezierCurveTo(-23, 31, -16, 23, -10, 26);
  ctx.bezierCurveTo(-4, 29, 1, 34, 7, 32);
  ctx.bezierCurveTo(13, 30, 17, 25, 24, 28);
  ctx.bezierCurveTo(30, 31, 32, 24, 33, 18);
  ctx.bezierCurveTo(34, 4, 33, -12, 27, -22);
  ctx.bezierCurveTo(20, -31, 10, -34, -1, -34);
  ctx.closePath();
  ctx.fill();

  // White inner body with thick ink outline
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#1C1917';
  ctx.lineWidth = 3.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-2, -32);
  ctx.bezierCurveTo(-14, -32, -20, -21, -20, -6);
  ctx.bezierCurveTo(-20, 9, -22, 21, -27, 26);
  ctx.bezierCurveTo(-20, 26, -14, 20, -8, 23);
  ctx.bezierCurveTo(-2, 26, 2, 30, 8, 28);
  ctx.bezierCurveTo(14, 26, 18, 21, 24, 24);
  ctx.bezierCurveTo(29, 26, 30, 19, 31, 14);
  ctx.bezierCurveTo(32, 1, 31, -13, 25, -22);
  ctx.bezierCurveTo(19, -30, 9, -32, -2, -32);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Ghost eyes
  ctx.fillStyle = '#1C1917';
  ctx.beginPath();
  ctx.ellipse(-6, -12, 3.5, 5.5, 0, 0, Math.PI * 2);
  ctx.ellipse(8, -11, 3.5, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Comic accent lines
  ctx.strokeStyle = '#1C1917';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-28, -20);
  ctx.lineTo(-32, -16);
  ctx.moveTo(27, -24);
  ctx.lineTo(31, -20);
  ctx.stroke();

  ctx.restore();
}

/**
 * Renders the question card to a high-res HTML5 Canvas element
 */
export async function renderCardToCanvas(question, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1120;
  const ctx = canvas.getContext('2d');

  const themeColor = getCardThemeColor(question);
  const category = (question.isWildcard ? 'WILDCARD · ASK ANYTHING' : (question.category || 'BETWEEN')).toUpperCase();
  const text = question.text || 'Meaningful question';

  // 1. Tabletop Background / Outer Edge
  ctx.fillStyle = '#F4ECE2';
  ctx.fillRect(0, 0, 800, 1120);

  // Soft Outer Drop Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(28, 25, 23, 0.18)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 16;

  // 2. Outer White Cardstock Frame
  drawRoundedRect(ctx, 36, 36, 728, 1048, 40);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  // Outer border line
  ctx.strokeStyle = 'rgba(28, 25, 23, 0.08)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 36, 36, 728, 1048, 40);
  ctx.stroke();

  // 3. Inner Pastel Canvas Block
  drawRoundedRect(ctx, 60, 60, 680, 1000, 28);
  ctx.fillStyle = themeColor;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. Black Circle Star Badge (Top-Left)
  ctx.fillStyle = '#1C1917';
  ctx.beginPath();
  ctx.arc(114, 114, 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 26px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 114, 115);

  // 5. Center Handcrafted Mascot Illustration
  drawMascot(ctx, question.category, 400, 310, 2.2);

  // 6. White Label Sticker (matching physical card sticker)
  ctx.font = '800 19px "Plus Jakarta Sans", sans-serif';
  const tagMetrics = ctx.measureText(category);
  const pillWidth = Math.max(tagMetrics.width + 44, 170);
  const pillHeight = 44;
  const pillX = 400 - pillWidth / 2;
  const pillY = 490;

  ctx.save();
  ctx.shadowColor = 'rgba(28, 25, 23, 0.08)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  drawRoundedRect(ctx, pillX, pillY, pillWidth, pillHeight, 8);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'rgba(28, 25, 23, 0.08)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, pillX, pillY, pillWidth, pillHeight, 8);
  ctx.stroke();

  // Category Tag Text
  ctx.fillStyle = '#1C1917';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(category, 400, pillY + pillHeight / 2 + 1);

  // 7. Question Text
  ctx.font = '700 33px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#1C1917';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = wrapText(ctx, text, 580);
  const lineHeight = 48;
  const totalTextHeight = lines.length * lineHeight;
  const startY = 660 + (220 - totalTextHeight) / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, 400, startY + index * lineHeight);
  });

  // 8. Bottom Deck Ribbon Watermark
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(28, 25, 23, 0.5)';
  ctx.textAlign = 'center';
  ctx.fillText('BETWEEN · TABLETOP DECK EDITION · PLAYBETWEEN.VERCEL.APP', 400, 1018);

  return canvas;
}

/**
 * Downloads a question card as a PNG image file
 */
export async function downloadCardAsPng(question, filename = null) {
  const canvas = await renderCardToCanvas(question);
  const link = document.createElement('a');
  const catSlug = (question.category || 'between').toLowerCase().replace(/[^a-z0-9]/g, '-');
  link.download = filename || `between-card-${catSlug}-${question.id || 'card'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Copies the card PNG image directly to system clipboard
 */
export async function copyCardToClipboard(question) {
  const canvas = await renderCardToCanvas(question);
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error('Canvas blob conversion failed'));
        return;
      }
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new window.ClipboardItem({ 'image/png': blob })
          ]);
          resolve(true);
        } else {
          // Fallback: download if clipboard item not supported
          downloadCardAsPng(question);
          resolve(false);
        }
      } catch (err) {
        downloadCardAsPng(question);
        resolve(false);
      }
    }, 'image/png');
  });
}
