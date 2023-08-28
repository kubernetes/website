---
title: Content organization
content_type: concept
weight: 90
---

<!-- overview -->

This site uses Hugo. In Hugo, [content organization](https://gohugo.io/content-management/organization/) is a core concept.

<!-- body -->

{{% note %}}
**Hugo Tip:** Start Hugo with `hugo server --navigateToChanged` for content edit-sessions.
{{% /note %}}

## Page Lists

### Page Order

The documentation side menu, the documentation page browser etc. are listed using
Hugo's default sort order, which sorts by weight (from 1), date (newest first),
and finally by the link title.

Given that, if you want to move a page or a section up, set a weight in the page's front matter:

```yaml
title: My Page
weight: 10
```

{{% note %}}
For page weights, it can be smart not to use 1, 2, 3 ..., but some other interval,
say 10, 20, 30... This allows you to insert pages where you want later.
Additionally, each weight within the same directory (section) should not be
overlapped with the other weights. This makes sure that content is always
organized correctly, especially in localized content.
{{% /note %}}

### Documentation Main Menu

The `Documentation` main menu is built from the sections below `docs/` with
the `main_menu` flag set in front matter of the `_index.md` section content file:

```yaml
main_menu: true
```

Note that the link title is fetched from the page's `linkTitle`, so if you want
it to be something different than the title, change it in the content file:

```yaml
main_menu: true
title: Page Title
linkTitle: Title used in links
```

{{% note %}}
The above needs to be done per language. If you don't see your section in the menu,
it is probably because it is not identified as a section by Hugo. Create a
`_index.md` content file in the section folder.
{{% /note %}}

### Documentation Side Menu

The documentation side-bar menu is built from the _current section tree_ starting below `docs/`.

It will show all sections and their pages.

If you don't want to list a section or page, set the `toc_hide` flag to `true` in front matter:

```yaml
toc_hide: true
```

When you navigate to a section that has content, the specific section or page
(e.g. `_index.md`) is shown. Else, the first page inside that section is shown.

### Documentation Browser

The page browser on the documentation home page is built using all the sections
and pages that are directly below the `docs section`.

If you don't want to list a section or page, set the `toc_hide` flag to `true` in front matter:

```yaml
toc_hide: true
```

### The Main Menu

The site links in the top-right menu -- and also in the footer -- are built by
page-lookups. This is to make sure that the page actually exists. So, if the
`case-studies` section does not exist in a site (language), it will not be linked to.

## Page Bundles

In addition to standalone content pages (Markdown files), Hugo supports
[Page Bundles](https://gohugo.io/content-management/page-bundles/).

One example is [Custom Hugo Shortcodes](/docs/contribute/style/hugo-shortcodes/).
It is considered a `leaf bundle`. Everything below the directory, including the `index.md`,
will be part of the bundle. This also includes page-relative links, images that can be processed etc.:

```bash
en/docs/home/contribute/includes
├── example1.md
├── example2.md
├── index.md
└── podtemplate.json
```

Another widely used example is the `includes` bundle. It sets `headless: true` in
front matter, which means that it does not get its own URL. It is only used in other pages.

```bash
en/includes
├── default-storage-class-prereqs.md
├── index.md
├── partner-script.js
├── partner-style.css
├── task-tutorial-prereqs.md
├── user-guide-content-moved.md
└── user-guide-migration-notice.md
```

Some important notes to the files in the bundles:

* For translated bundles, any missing non-content files will be inherited from
  languages above. This avoids duplication.
* All the files in a bundle are what Hugo calls `Resources` and you can provide
  metadata per language, such as parameters and title, even if it does not supports
  front matter (YAML files etc.).
  See [Page Resources Metadata](https://gohugo.io/content-management/page-resources/#page-resources-metadata).
* The value you get from `.RelPermalink` of a `Resource` is page-relative.
  See [Permalinks](https://gohugo.io/content-management/urls/#permalinks).

## Styles

The [SASS](https://sass-lang.com/) source of the stylesheets for this site is
stored in `assets/sass` and is automatically built by Hugo.

## {{% heading "whatsnext" %}}

* Learn about [custom Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/)
* Learn about the [Style guide](/docs/contribute/style/style-guide)
* Learn about the [Content guide](/docs/contribute/style/content-guide)
