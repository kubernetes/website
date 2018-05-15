---
title: Docs smoke test page
main_menu: false
---

This page serves two purposes:

- Demonstrate how the Kubernetes documentation uses Markdown
- Provide a "smoke test" document we can use to test HTML, CSS, and template
  changes that affect the overall documentation.

## Heading levels

The above heading is an H2. The page title renders as an H1. The following
sections show H3-H6.

### H3

This is in an H3 section.

#### H4

This is in an H4 section.

##### H5

This is in an H5 section.

###### H6

This is in an H6 section.

## Inline elements

Inline elements show up within the text of paragraph, list item, admonition, or
other block-level element.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.

### Inline text styles

- **bold**
- _italic_
- ***bold italic***
- ~~strikethrough~~
- <u>underline</u>
- _<u>underline italic</u>_
- **<u>underline bold</u>**
- ***<u>underline bold italic</u>***
- `monospace text`
- **`monospace bold`**

## Lists

### Bullet lists

- This is a list item
* This is another list item in the same list
- You can mix `-` and `*`
  - To make a sub-item, indent two spaces.
    - This is a sub-sub-item.



- This is a new list. It has two blank lines from the previous list, If it only
  had one blank line, it would still show up as part of the previous list.
- Bullet lists can have paragraphs or block elements within them.

  Just indent the content to be even with the text of the bullet point, rather
  than the bullet itself.

  ```bash
  ls -l
  ```
  
  - And a sub-list after some block-level content
- A bullet list item can contain a numbered list.
  1.  Numbered sub-list item 1
  2.  Numbered sub-list item 2

### Numbered lists

1.  This is a list item
2.  This is another list item in the same list. The number you use in Markdown
    does not necessarily correlate to the number in the final output. By
    convention, we keep them in sync.
3.  For single-digit numbered lists, using two spaces after the period makes
    interior block-level content line up better along tab-stops.



1.  This is a new list. It has two blank lines from the previous list, If it only
    had one blank line, it would still show up as part of the previous list.
2.  Numbered lists can have paragraphs or block elements within them.

    Just indent the content to be even with the text of the bullet point, rather
    than the bullet itself.

    ```bash
    $ ls -l
    ```
  
  - And a sub-list after some block-level content


### Checklists

- [ ] This is a checklist item
- [x] This is a selected checklist item

## Code blocks

You can create code blocks two different ways:

- by indenting the entire code block 4 spaces from the content

      this is a code block created by indentation
      
- by surrounding the code block with three back-tick characters on lines before
  and after the code block.
  
  ```
  this is a code block created by back-ticks
  ```

The back-tick method has some advantages.

- It is more compact when viewing the source code.
- It allows you to specify what language the code block is in, for syntax
  highlighting.
- It has a definite ending. Sometimes, the indentation method breaks with
  languages where spacing is significant, like Python or YAML.

To specify the language for the code block, put it directly after the first
grouping of back-ticks:

```bash
ls -l
```

## Links

To format a link, put the link text inside square brackets, followed by the
link target in parentheses. [Link to Kubernetes.io](https://kubernetes.io/) or
[Relative link to Kubernetes.io](/)

You can also use HTML, but it is not preferred.
<a href="https://kubernetes.io/">Link to Kubernetes.io</a>


## Images

To format an image, use similar syntax to [links](#links), but add a leading `!`
character. The square brackets contain the image's alt text. Try to always use
alt text so that people using screen readers can get some benefit from the
image.

![pencil icon](/static/images/pencil.png)

An image can also be a link. This time the pencil icon links to the Kubernetes
website. Outer square brackets enclose the entire image tag, and the link target
is in the parentheses at the end.

[![pencil icon](/static/images/pencil.png)](https://kubernetes.io)

You can also use HTML for images, but it is not preferred.

<img src="/static/images/pencil.png" alt="pencil icon" />


## Tables

Simple tables have one row per line, and columns are separated by `|`
characters. The header is separated from the body by cells containing nothing
but at least three `-` characters. For ease of maintenance, try to keep all the
cell separators even, even if you heed to use extra space.

| Heading cell 1 | Heading cell 2 |
|----------------|----------------|
| Body cell 1    | Body cell 2    |

The header is optional. Any text separated by `|` will render as a table.

Markdown tables have a hard time with block-level elements within cells, such as
list items, code blocks, or multiple paragraphs. For complex or very wide
tables, use HTML instead.

<table>
<thead>
  <tr>
    <th>Heading cell 1</th>
    <th>Heading cell 2</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Body cell 1</td>
    <td>Body cell 2</td>
  </tr>
</tbody>
</table>

## Sidebars and Admonitions

Sidebars and admonitions provide ways to add visual importance to text. Use
them sparingly.

### Sidebars

A sidebar offsets text visually, but without the visual prominence of
[admonitions](#admonitions).

> This is a sidebar.
>
> You can have paragraphs and block-level elements within a sidebar.
>
> You can even have code blocks.
>
> ```bash
> sudo dmesg
> ```
>

### Admonitions

Admonitions (notes, warnings, etc) use Hugo shortcodes.

{{< note >}}
**Note:** Notes catch the reader's attention without a sense of urgency.

You can have multiple paragraphs and block-level elements inside an admonition.

| Or | a | table |
{{< /note >}}

{{< caution >}}
**Caution:** The reader should proceed with caution.
{{< /caution >}}


{{< warning >}}
**Warning:** Warnings point out something that could cause harm if ignored.
{{< /warning >}}
