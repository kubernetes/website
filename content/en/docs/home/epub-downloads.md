---
title: Download Documentation (EPUB)
description: Download Kubernetes documentation as EPUB files for offline reading on e-readers and mobile devices.
weight: 20
---

Kubernetes documentation is available as EPUB files for offline reading on e-readers, tablets, and mobile devices. EPUBs are updated with each Kubernetes release.

## Full download

A full EPUB is available containing the Setup, Concepts, Tasks and Tutorials sections in a single file.

{{< note >}}
The Reference section is not included in the full download because of its size
(over 1,000 pages of API, CLI, and configuration reference content). You can download
the Reference section separately as its own EPUB.
{{< /note >}}

## Reference download

A standalone EPUB is available for the **Reference** section:

| Section | Description |
|---------|-------------|
| **Reference** | API, CLI, and configuration reference |

EPUB files are attached as assets to each
[Kubernetes release on GitHub](https://github.com/kubernetes/website/releases).

## Localization

EPUB files are available in multiple languages. Localized builds follow the same
structure as the English version and are generated from the translated content
in each language's content directory.

To build an EPUB in a specific language, use the `EPUB_LANG` parameter:

```bash
make epub EPUB_LANG=ja    # Japanese
make epub EPUB_LANG=zh-cn # Chinese
make epub EPUB_LANG=ko    # Korean
make epub EPUB_LANG=fr    # French
make epub-reference EPUB_LANG=ja # Reference-only (Japanese)
```

Localized EPUBs are named with a language suffix, for example:
`kubernetes-docs-v1.35-ja.epub` and `kubernetes-reference-v1.35-ja.epub`.

## Building EPUBs locally

If you have the [website repository](https://github.com/kubernetes/website)
checked out, you can build EPUBs locally:

```bash
# Prerequisites: hugo, pandoc, python3
make epub            # Full EPUB (Setup, Tutorials, Concepts, Tasks)
make epub-reference  # Reference-only EPUB

# Build release assets for all configured languages (full + reference)
make epub-release

# Clean generated files
make epub-clean
```

## Maintainer metadata

EPUB title metadata for full builds is driven by
`data/releases/epub-cover.json`.

Supported fields per version key:

| Field | Description |
|-------|-------------|
| `name` | EPUB title for full documentation builds |
| `logo` | Optional EPUB cover image path (site path like `/images/...` or repo-relative path) |

If a version entry or field is missing, the builder uses `defaults` from the
same file and continues the build.

## Compatibility

The EPUB files use the **EPUB3** format and are compatible with:

- Apple Books
- Kobo e-readers
- Kindle (via Send to Kindle or Calibre conversion)
- Google Play Books
- Most EPUB3-compatible reader applications
