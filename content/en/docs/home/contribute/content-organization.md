---
title: Content Organization
date: 2018-04-30
content_template: templates/concept
weight: 42
---

{{< toc >}}

{{% capture overview %}}

This site uses Hugo. In Hugo, [content organization](https://gohugo.io/content-management/organization/) is a core concept.

{{% /capture %}}

{{% capture body %}}

{{% note %}}
**Hugo Tip:** Start Hugo with `hugo server --navigateToChanged` for content edit-sessions.
{{% /note %}}

## Page Lists

### Page Order

The documentation side menu, the documentation page browser etc. are listed using Hugo's default sort order, which sorts by weight (from 1), date (newest first) and finally by the link title.

Given that, if you want to move a page or a section up, set a weight in the page's front matter:

```yaml
title: My Page
weight: 10
```


{{% note %}}
For page weights, it can be smart not to use 1, 2, 3 ..., but some other interval, say 10, 20, 30... This allows you to insert pages where you want later.
{{% /note %}}


### Documentation Main Menu

The `Documentation` main menu is built from the sections below `docs/` with the `main_menu` flag set in front matter of the `_index.md` section content file:

```yaml
main_menu: true
```


Note that the link title is fetched from the page's `linkTitle`, so if you want it to be something different than the title, change it in the content file:


```yaml
main_menu: true
title: Page Title
linkTitle: Title used in links
```


{{% note %}}
The above needs to be done per language. If you don't see your section in the menu, it is probably because it is not identified as a section by Hugo. Create a `_index.md` content file in the section folder.
{{% /note %}}

### Documentation Side Menu

The documentation side-bar menu is built from the _current section tree_ starting below `docs/`. 

It will show all sections and their pages.

If you want a section or page to not be listed, set the `toc_hide` flag in front matter:


```yaml
toc_hide: true
```

When you navigate to a section, the page shown is the section page (e.g. `_index.md`) if it has content, else the first page inside that section.

### Documentation Browser

The page browser on the documentation home page is built from all sections and pages directly below the `docs section`.

If you want a section or page to not be listed, set the `toc_hide` flag in front matter:

```yaml
toc_hide: true
```

### The Main Menu

The site links in the top-right menu -- and also in the footer -- are built by page-lookups. This is to make sure that the page actually exists. So, if the `case-studies` section does not exist in a site (language), it will not be linked to. 


## Page Bundles

In addition to standalone content pages (Markdown files), Hugo supports [Page Bundles](https://gohugo.io/content-management/page-bundles/).

One example is [Custom Hugo Shortcodes](/docs/home/contribute/includes/). It is a socalled `leaf bundle`. Everything below the directory with the `index.md` will be part of the bundle, with page-relative links, images can be processed etc.:

```bash
en/docs/home/contribute/includes
├── example1.md
├── example2.md
├── index.md
└── podtemplate.json
```

Another example used widely is the `includes` bundle. It has `headless: true` set in front matter, which means that it does not get its own URL. It is only used in other pages.

```bash
en/includes
├── default-storage-class-prereqs.md
├── federated-task-tutorial-prereqs.md
├── federation-content-moved.md
├── index.md
├── partner-script.js
├── partner-style.css
├── task-tutorial-prereqs.md
├── user-guide-content-moved.md
└── user-guide-migration-notice.md
```

Some important notes to the files in the bundles:

* For translated bundles, any missing non-content files will be inherited from languages above. This avoids duplication.
* All the files in a bundle are what Hugo calls `Resources` and you can provide metadata per language, such as parameters and title, even if it does not supports front matter (YAML files etc.). See [Page Resources Metadata](https://gohugo.io/content-management/page-resources/#page-resources-metadata).
* The value you get from `.RelPermalink` from a `Resource` is page-relative.


## Styles

The `SASS` source of the stylesheets for this site is stored below `src/sass` and can be built with `make sass` (note that Hugo will get `SASS` support soon, see https://github.com/gohugoio/hugo/issues/4243).

{{% /capture %}}

{{% capture whatsnext %}}

* [Custom Hugo Shortcodes](/docs/home/contribute/includes)
* [Style Guide](/docs/home/contribute/style-guide)

{{% /capture %}}

