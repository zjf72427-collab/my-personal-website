import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'

export interface MarkdownHeading {
  id: string
  text: string
  level: number
}

function slugifyHeading(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\u4e00-\u9fa5 -]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalizeHeadingText(raw: string) {
  return raw
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim()
}

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(code: string, lang: string) {
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
    const highlighted = hljs.highlight(code, { language }).value
    return `<pre class="hljs-pre"><code class="hljs ${language}">${highlighted}</code></pre>`
  }
})

markdown.renderer.rules.heading_open = (
  tokens: Array<{ attrSet: (name: string, value: string) => void } & { tag?: string }>,
  idx: number,
  options: unknown,
  env: unknown,
  self: { renderToken: (tokenList: unknown[], tokenIndex: number, renderOptions: unknown) => string }
) => {
  const token = tokens[idx]
  const inlineToken = (tokens[idx + 1] as { content?: string } | undefined)
  const rawText = inlineToken?.content || ''
  const id = slugifyHeading(rawText)

  if (id) {
    token.attrSet('id', id)
    token.attrSet('data-heading-id', id)
  }

  return self.renderToken(tokens as unknown[], idx, options)
}

export function renderMarkdown(raw: string) {
  return markdown.render(raw)
}

export function extractMarkdownHeadings(raw: string) {
  const headings: MarkdownHeading[] = []
  const matcher = /^(#{1,3})\s+(.+)$/gm
  let match = matcher.exec(raw)

  while (match) {
    const level = match[1].length
    const text = normalizeHeadingText(match[2])
    const id = slugifyHeading(text)

    if (text && id) {
      headings.push({
        id,
        text,
        level
      })
    }

    match = matcher.exec(raw)
  }

  return headings
}

export function renderMarkdownDocument(raw: string, idPrefix: string) {
  const baseHeadings = extractMarkdownHeadings(raw)
  const used = new Set<string>()
  const headings = baseHeadings.map((heading, index) => {
    let id = `${idPrefix}-${heading.id || `heading-${index + 1}`}`
    let suffix = 1

    while (used.has(id)) {
      suffix += 1
      id = `${idPrefix}-${heading.id || `heading-${index + 1}`}-${suffix}`
    }

    used.add(id)

    return {
      ...heading,
      id
    }
  })

  let headingIndex = 0
  const html = markdown.render(raw).replace(/<h([1-3])(?:\s+[^>]*)?>/g, (matchText: string, levelText: string) => {
    const heading = headings[headingIndex]
    headingIndex += 1
    if (!heading) return matchText
    return `<h${levelText} id="${heading.id}" data-heading-id="${heading.id}">`
  })

  return {
    html,
    headings
  }
}
