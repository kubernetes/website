---
title: Download Documentation (EPUB)
description: Download Kubernetes documentation as EPUB files for offline reading on e-readers and mobile devices.
weight: 20
---

Kubernetes documentation is available as EPUB files for offline reading on e-readers,
tablets, and mobile devices. EPUBs are updated with each Kubernetes release.

## Full download

A full EPUB is available containing the Setup, Tutorials, Concepts, and Tasks sections
in a single file.

{{< note >}}
The Reference section is not included in the full download because of its size
(over 1,000 pages of API, CLI, and configuration reference content). You can download
the Reference section separately as a per-section EPUB.
{{< /note >}}

## Per-section downloads

Each major documentation section is also available as a standalone EPUB file:

| Section | Description |
|---------|-------------|
| **Setup** | Cluster installation and configuration guides |
| **Tutorials** | End-to-end walkthroughs for learning Kubernetes |
| **Concepts** | Core Kubernetes concepts and architecture |
| **Tasks** | Step-by-step operational how-tos |
| **Reference** | API, CLI, and configuration reference |
| **Contribute** | Guide to contributing to Kubernetes documentation |

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
```

Localized EPUBs are named with a language suffix, for example:
`kubernetes-concepts-v1.35-ja.epub`.

## Building EPUBs locally

If you have the [website repository](https://github.com/kubernetes/website)
checked out, you can build EPUBs locally:

```bash
# Prerequisites: hugo, pandoc, python3
make epub

# Build a single section
make epub-section SECTION=concepts

# Clean generated files
make epub-clean
```

## Compatibility

The EPUB files use the **EPUB3** format and are compatible with:

- Apple Books
- Kobo e-readers
- Kindle (via Send to Kindle or Calibre conversion)
- Google Play Books
- Most EPUB3-compatible reader applications
