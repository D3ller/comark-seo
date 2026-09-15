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
  content:  { words, readingTime, repeatedWords: Map<string, number> },
  headings: { count, h1Count, hierarchyValid },
  links:    { count, internal, external, invalid },
  images:   { count, missingAlt },
  issues:   [ /* see below */ ]
}
```

`readingTime` is in minutes. A link is `external` when it matches an absolute
`http(s)` URL, `internal` otherwise.

## Issues

Each entry in `issues` is a discriminated union on `reason`:

| `reason` | Extra fields |
| --- | --- |
| `multiple-h1` | `count` |
| `heading-hierarchy` | `from`, `to` |
| `invalid-heading` | — |
| `missing-alt` | `src` |
| `missing-dimensions` | `src`, `missing` |
| `invalid-link` | `href` |

## License

MIT © Corentin NELHOMME
