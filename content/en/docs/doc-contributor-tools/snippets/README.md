# Snippets for Atom

Snippets are bits of text that get inserted into your editor, to save typing and
reduce syntax errors. The snippets provided in `snippets.cson` are scoped to
only work on Markdown files within Atom.

## Installation

Copy the contents of the `snippets.cson` file into your existing
`~/.atom/snippets.cson`. **Do not replace your existing file.**

You do not need to restart Atom.

## Usage

Have a look through `snippets.cson` and note the titles and `prefix` values of
the snippets.

A given snippet can be triggered in one of two ways:

- By typing the snippet's `prefix` and pressing the `<TAB>` key
- By searching for the snippet's title in **Packages / Snippets / Available**

For example, open a Markdown file and type `anote` and press `<TAB>`. A blank
note is added, with the correct Hugo shortcodes.

A snippet can insert a single line or multiple lines of text. Some snippets
have placeholder values. To get to the next placeholder, press `<TAB>` again.

Some of the snippets only insert partially-formed Markdown or Hugo syntax.
For instance, `coverview` insers the start of a concept overview tag, while
`cclose` inserts a close-capture tag. This is because every type of capture
needs a capture-close tab.

## Submitting new snippets

1.  Develop the snippet locally and verify that it works as expected.
2.  Copy the template's code into the `snippets.cson` file on Github. Raise a
    pull request, and ask for review from another Atom user in #sig-docs on
    Kubernetes Slack.