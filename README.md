# comark-seo

Comark plugin that analyses Markdown for SEO: headings, links, images, word count and reading time.

## Install

```bash
pnpm add comark-seo
```

Requires `comark` >= 0.4 as a peer dependency.

## Usage

```ts
import { parseMarkdown } from 'comark'
import seo from 'comark-seo'

const tree = await parseMarkdown(markdown, {
  plugins: [seo({ language: 'fra', readingSpeed: 150 })],
})

console.log(tree.meta.seo)
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Set to `false` to skip the analysis. |
| `language` | `'fra' \| 'eng'` | — | Stop words ignored in `repeatedWords`. None are ignored if unset. |
| `readingSpeed` | `number` | `200` | Words per minute used for `readingTime`. |

## Result

`tree.meta.seo` holds the analysis:

```ts
{
  content:  { words, readingTime, repeatedWords },
  headings: { count, h1Count, hierarchyValid },
  links:    { count, internal, external, special: { anchor, emails, phone }, invalid },
  images:   { count, missingAlt },
  issues:   [ /* see below */ ]
}
```

Everything is JSON-serialisable, so `tree.meta` can be sent in an SSR payload or
cached as-is.

### `content`

`words` counts the text of the document. Fenced blocks and inline code are
skipped, so snippets and identifiers do not inflate the count.

`readingTime` is in minutes, rounded to the nearest minute and never below `1`.

`repeatedWords` lists the words appearing **more than once**, sorted by
descending count, ties broken alphabetically:

```ts
[
  { word: 'est', count: 12 },
  { word: 'web', count: 9 },
  { word: 'construire', count: 7 },
]
```

Set `language` to drop stop words such as `le`, `de` or `the` from that list.

### `links`

Every link is classified into exactly one bucket:

| Bucket | Matches |
| --- | --- |
| `external` | Absolute `http(s)` URL, or protocol-relative `//host` |
| `internal` | Any relative path: `/guide`, `./page.md`, `../up.md`, `page.md` |
| `special.anchor` | Starts with `#` |
| `special.emails` | `mailto:` |
| `special.phone` | `tel:` |
| `invalid` | Missing `href`, or an unsupported scheme such as `ftp:` or `javascript:` |

### `headings`

`hierarchyValid` is `false` as soon as one level is skipped (for example `h2`
straight to `h4`). Every break is still reported individually in `issues`.

## Issues

Each entry in `issues` is a discriminated union on `reason`:

| `reason` | Extra fields | Raised when |
| --- | --- | --- |
| `missing-heading-one` | — | The document has no `h1` |
| `multiple-h1` | `count` | The document has more than one `h1` |
| `heading-hierarchy` | `from`, `to` | A heading level is skipped |
| `heading-too-long` | `from`, `text` | A heading exceeds 60 characters |
| `invalid-heading` | — | A heading tag outside `h1`–`h6` |
| `missing-alt` | `src` | An image has no `alt` attribute |
| `missing-dimensions` | `src`, `missing` | An image lacks `width`, `height` or both |
| `invalid-link` | `href` | A link uses an unsupported scheme |
| `missing-url` | `text` | A link has no `href` |

Heading text is flattened before being measured, so `## A **bold** title` is
counted in full.

## License

MIT © Corentin NELHOMME
