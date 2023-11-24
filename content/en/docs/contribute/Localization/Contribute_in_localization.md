---
title: Contributing to an Existing Localization
content_type: concept
approvers:
- remyleone
- rlenferink
weight: 50
card:
  name: contribute
  weight: 50
  title: Localizing the docs
---

<!-- overview -->

This page shows you how to Contribute in Existing
[localization](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/).
You can help add or improve the content of an existing localization. In
[Kubernetes Slack](https://slack.k8s.io/), you can find a channel for each
localization. There is also a general
[SIG Docs Localizations Slack channel](https://kubernetes.slack.com/messages/sig-docs-localizations)
where you can say hello.

{{< note >}}
For extra details on how to contribute to a specific localization,
look for a localized version of this page.
{{< /note >}}


<!-- body -->

### Find your two-letter language code

First, consult the
[ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php)
to find your localization's two-letter language code. For example, the two-letter code for
Korean is `ko`.

Some languages use a lowercase version of the country code as defined by the
ISO-3166 along with their language codes. For example, the Brazilian Portuguese
language code is `pt-br`.

## Fork and clone the repo

First, [create your own fork](/docs/contribute/new-content/open-a-pr/#fork-the-repo) of the
[kubernetes/website](https://github.com/kubernetes/website) repository.

Then, clone your fork and `cd` into it:

```shell
git clone https://github.com/<username>/website
cd website
```

The website content directory includes subdirectories for each language. The
localization you want to help out with is inside `content/<two-letter-code>`.

## Suggest changes

Create or update your chosen localized page based on the English original. See
[translating content](#translating-content) for more details.

If you notice a technical inaccuracy or other problem with the upstream
(English) documentation, you should fix the upstream documentation first and
then repeat the equivalent fix by updating the localization you're working on.

Limit changes in a pull requests to a single localization. Reviewing pull
requests that change content in multiple localizations is problematic.

Follow [Suggesting Content Improvements](/docs/contribute/suggesting-improvements/)
to propose changes to that localization. The process is similar to proposing
changes to the upstream (English) content.

## Localize content

Localizing *all* the Kubernetes documentation is an enormous task. It's okay to
start small and expand over time.

### Localize SVG images

The Kubernetes project recommends using vector (SVG) images where possible, as
these are much easier for a localization team to edit. If you find a raster
image that needs localizing, consider first redrawing the English version as
a vector image, and then localize that.

When translating text within SVG (Scalable Vector Graphics) images, it's
essential to follow certain guidelines to ensure accuracy and maintain
consistency across different language versions. SVG images are commonly
used in the Kubernetes documentation to illustrate concepts, workflows,
and diagrams.

1. **Identifying translatable text**: Start by identifying the text elements
   within the SVG image that need to be translated. These elements typically
   include labels, captions, annotations, or any text that conveys information.

1. **Editing SVG files**: SVG files are XML-based, which means they can be
   edited using a text editor. However, it's important to note that most of the
   documentation images in Kubernetes already convert text to curves to avoid font
   compatibility issues. In such cases, it is recommended to use specialized SVG
   editing software, such as Inkscape, for editing, open the SVG file and locate
   the text elements that require translation.

1. **Translating the text**: Replace the original text with the translated
   version in the desired language. Ensure the translated text accurately conveys
   the intended meaning and fits within the available space in the image. The Open
   Sans font family should be used when working with languages that use the Latin
   alphabet. You can download the Open Sans typeface from here:
   [Open Sans Typeface](https://fonts.google.com/specimen/Open+Sans).

1. **Converting text to curves**: As already mentioned, to address font
   compatibility issues, it is recommended to convert the translated text to
   curves or paths. Converting text to curves ensures that the final image
   displays the translated text correctly, even if the user's system does not
   have the exact font used in the original SVG.

1. **Reviewing and testing**: After making the necessary translations and
   converting text to curves, save and review the updated SVG image to ensure
   the text is properly displayed and aligned. Check
   [Preview your changes locally](/docs/contribute/new-content/open-a-pr/#preview-locally).

## Upstream contributions

SIG Docs welcomes upstream contributions and corrections to the English source.