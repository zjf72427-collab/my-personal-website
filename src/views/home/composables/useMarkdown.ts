/**
 * Lightweight Markdown renderer — zero external dependencies required.
 * Uses highlight.js for code blocks if available, falls back to plain escaped code.
 * Supports: h1-h3, bold, italic, inline code, fenced code blocks,
 * blockquotes, hr, ul/ol lists, GFM tables, paragraphs.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inlineRender(s: string): string {
  return s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
}

function hljsHighlight(code: string, lang: string): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const hljs = require('highlight.js')
    const validLang = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language: validLang }).value
  } catch {
    return escapeHtml(code)
  }
}

export function renderMarkdown(raw: string): string {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```
      const code = codeLines.join('\n')
      const highlighted = hljsHighlight(code, lang)
      out.push(`<pre class="hljs-pre"><code class="hljs language-${lang || 'plaintext'}">${highlighted}</code></pre>`)
      continue
    }

    // HR
    if (/^---+$/.test(line.trim())) {
      out.push('<hr>')
      i++
      continue
    }

    // Headings
    const h3 = line.match(/^### (.+)/)
    if (h3) { out.push(`<h3>${inlineRender(h3[1])}</h3>`); i++; continue }
    const h2 = line.match(/^## (.+)/)
    if (h2) { out.push(`<h2>${inlineRender(h2[1])}</h2>`); i++; continue }
    const h1 = line.match(/^# (.+)/)
    if (h1) { out.push(`<h1>${inlineRender(h1[1])}</h1>`); i++; continue }

    // Blockquote
    if (line.startsWith('>')) {
      const bqLines: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) {
        bqLines.push(lines[i].slice(1).trim())
        i++
      }
      out.push(`<blockquote><p>${bqLines.map(inlineRender).join('<br>')}</p></blockquote>`)
      continue
    }

    // Table (header row contains | and next line is separator)
    if (line.includes('|') && i + 1 < lines.length && /^[\s|:-]+$/.test(lines[i + 1])) {
      const headers = line.split('|').filter(c => c.trim())
        .map(c => `<th>${inlineRender(c.trim())}</th>`)
      i += 2 // skip header + separator
      const rows: string[] = []
      while (i < lines.length && lines[i].includes('|')) {
        const cells = lines[i].split('|').filter(c => c.trim())
          .map(c => `<td>${inlineRender(c.trim())}</td>`)
        rows.push(`<tr>${cells.join('')}</tr>`)
        i++
      }
      out.push(`<table><thead><tr>${headers.join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>`)
      continue
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(`<li>${inlineRender(lines[i].slice(2).trim())}</li>`)
        i++
      }
      out.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${inlineRender(lines[i].replace(/^\d+\. /, '').trim())}</li>`)
        i++
      }
      out.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    // Empty line — skip
    if (line.trim() === '') {
      i++
      continue
    }

    // Paragraph — collect until blank line or block element
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('>') &&
      !lines[i].startsWith('```') &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length) {
      out.push(`<p>${inlineRender(paraLines.join(' '))}</p>`)
    }
  }

  return out.join('\n')
}
