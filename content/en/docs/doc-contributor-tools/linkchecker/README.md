# Internal link checking tool

You can use [htmltest](https://github.com/wjdp/htmltest) to check for broken links in [`/content/en/`](https://git.k8s.io/website/content/en/). This is useful when refactoring sections of content, moving pages around, or renaming files or page headers.

## How the tool works

`htmltest` scans links in the generated HTML files of the kubernetes website repository. It runs using a `make` command which does the following:

- Builds the site and generates output HTML in the `/public` directory of your local `kubernetes/website` repository
- Pulls the `wdjp/htmltest` Docker image
- Mounts your local `kubernetes/website` repository to the Docker image
- Scans the files generated in the `/public` directory and provides command line output when it encounters broken internal links

## What it does and doesn't check

The link checker scans generated HTML files, not raw Markdown. The htmltest tool depends on a configuration file, [`.htmltest.yml`](https://git.k8s.io/website/.htmltest.yml), to determine which content to examine.

The link checker scans the following:

- All content generated from Markdown in [`/content/en/docs`](https://git.k8s.io/website/content/en/docs/) directory, excluding:
  - Generated API references, for example https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/
- All internal links, excluding:
  - Empty hashes (`<a href="#">` or `[title](#)`) and empty hrefs (`<a href="">` or `[title]()`)
  - Internal links to images and other media files

The link checker does not scan the following:

- Links included in the top and side nav bars, footer links, or links in a page's `<head>` section, such as links to CSS stylesheets, scripts, and meta information
- Top level pages and their children, for example: `/training`, `/community`, `/case-studies/adidas`
- Blog posts
- API Reference documentation, for example: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/
- Localizations

## Prerequisites and installation

You must install
* [Docker](https://docs.docker.com/get-docker/)
* [make](https://www.gnu.org/software/make/)

## Running the link checker

To run the link checker:

1. Navigate to the root directory of your local `kubernetes/website` repository.

2. Run the following command:

  ```
  make container-internal-linkcheck
  ```

## Understanding the output

If the link checker finds broken links, the output is similar to the following:

```
tasks/access-kubernetes-api/custom-resources/index.html
  hash does not exist --- tasks/access-kubernetes-api/custom-resources/index.html --> #preserving-unknown-fields
  hash does not exist --- tasks/access-kubernetes-api/custom-resources/index.html --> #preserving-unknown-fields
```

This is one set of broken links. The log adds an output for each page with broken links.

In this output, the file with broken links is `tasks/access-kubernetes-api/custom-resources.md`.

The tool gives a reason: `hash does not exist`. In most cases, you can ignore this.

The target URL is `#preserving-unknown-fields`.

One way to fix this is to:

1. Navigate to the Markdown file with a broken link.
2. Using a text editor, do a full-text search (usually Ctrl+F or Command+F) for the broken link's URL, `#preserving-unknown-fields`.
3. Fix the link. For a broken page hash (or _anchor_) link, check whether the topic was renamed or removed.

Run htmltest to verify that broken links are fixed.