---
title: 文档冒烟测试页面
main_menu: false
---

<!--
title: Docs smoke test page
main_menu: false
-->

<!--
This page serves two purposes:
-->
此文档有两个用途：

<!--
- Demonstrate how the Kubernetes documentation uses Markdown
- Provide a "smoke test" document we can use to test HTML, CSS, and template
  changes that affect the overall documentation.
-->

- 演示 Kubernetes 文档如何使用 Markdown
- 提供一个 "冒烟测试" 文档，我们可以使用它来测试影响整个文档的 HTML、CSS 和模板更改。

<!--
## Heading levels
-->

## 标题级别

<!--
The above heading is an H2. The page title renders as an H1. The following
sections show H3-H6.
-->
上面的标题是 H2。页面标题呈现为 H1。以下部分显示 H3-H6。

### H3

<!--
This is in an H3 section.
-->
这是在 H3 部分。

#### H4

<!--
This is in an H4 section.
-->
这是在 H4 部分。


##### H5

<!--
This is in an H5 section.
-->
这是在 H5 部分。

###### H6

<!--
This is in an H6 section.
-->
这是在 H6 部分。

<!--
## Inline elements
-->
## 内联元素

<!--
Inline elements show up within the text of paragraph, list item, admonition, or
other block-level element.
-->
内联元素出现在段落、列表项、警告或其他块级元素的文本中。

<!--
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.
-->


<!--
### Inline text styles
-->

### 内联文本样式

<!--
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
-->

- **粗体**
- _斜体_
- ***加粗斜体***
- ~~删除线~~
- <u>下划线</u>
- _<u>强调斜体</u>_
- **<u>强调 bold</u>**
- ***<u>粗体斜体加下划线</u>***
- `等宽字体文本`
- **`等宽字体 bold`**

<!--
## Lists
-->

## 列表

<!--
Markdown doesn't have strict rules about how to process lists. When we moved
from Jekyll to Hugo, we broke some lists. To fix them, keep the following in
mind:
-->
Markdown 没有关于如何处理列表的严格规则。当我们从 Jekyll 搬到 Hugo 时，我们破坏了一些列表。要解决这些问题，请记住以下几点:

<!--
- Make sure you indent sub-list items **4 spaces** rather than the 2 that you
  may be used to. Counter-intuitively, you need to indent block-level content
  within a list item an extra 4 spaces too.

- To end a list and start another, you need a HTML comment block on a new line
  between the lists, flush with the left-hand border. The first list won't end
  otherwise, no matter how many blank lines you put between it and the second.
-->

- 确保缩进子列表项**4个空格**而不是您可能习惯的2个空格。与直觉相反，您需要将列表项中的块级内容缩进额外的4个空格。
- 要结束列表并启动另一个列表，您需要在列表之间的新行上使用 HTML 注释块，并使用左侧边框刷新。
  无论你在第一个列表和第二个列表之间放置多少空行，第一个列表都不会以其他方式结束。

<!--
### Bullet lists
-->

### 项目符号列表

<!--
- This is a list item
* This is another list item in the same list
- You can mix `-` and `*`
    - To make a sub-item, indent two tabstops (4 spaces). **This is different
      from Jekyll and Kramdown.**
        - This is a sub-sub-item. Indent two more tabstops (4 more spaces).
    - Another sub-item.
-->

- 这是一个列表项
* 这是同一列表中的另一个列表项
- 你可以把 `-` 和 `*` 混合
    - 要生成一个子项目，缩进两个制表符(4个空格)。**这和 Jekyll 和 Kramdown 不一样。**
        - 这是一个子项目。缩进另外两个制表符（另外4个空格）。
    - 另一个子项目。

<!-- separate lists -->

<!--
- This is a new list. With Hugo, you need to use a HTML comment to separate two
  consecutive lists. **The HTML comment needs to be at the left margin.**
- Bullet lists can have paragraphs or block elements within them.
-->
- 这是一个新列表。使用 Hugo，您需要使用 HTML 注释来分隔两个连续的列表。**HTML 注释需要在左边的空白处。**
- 项目符号列表可以包含段落或块元素。

<!--
      Indent the content to be one tab stop beyond the text of the bullet
      point. **This paragraph and the code block line up with the second `l` in
      `Bullet` above.**
-->
      将内容缩进到项目符号文本之外的一个制表符。**本段和代码块与上面 `Bullet` 中的第二个 `l` 对齐。**

      ```bash
      ls -l
      ```

      - 以及一些块级内容之后的子列表

<!--
- A bullet list item can contain a numbered list.
    1.  Numbered sub-list item 1
    2.  Numbered sub-list item 2
-->

- 项目符号列表项可以包含编号列表。
    1.  编号的子列表项目 1
    2.  编号的子列表项目 2

<!--
### Numbered lists
-->

### 编号列表

<!--
1.  This is a list item
2.  This is another list item in the same list. The number you use in Markdown
    does not necessarily correlate to the number in the final output. By
    convention, we keep them in sync.
3.  {{<note>}}
    For single-digit numbered lists, using two spaces after the period makes
    interior block-level content line up better along tab-stops.
    {{</note>}}
-->

1.  这是一个列表项
2.  这是同一列表中的另一个列表项。在 Markdown 中使用的数字不一定与最终输出中的数字相关。按照惯例，我们使它们保持同步。
3.  {{<note>}}
    对于单位数字编号列表，在句点后使用两个空格可使内部块级内容沿制表符更好地排列。
    {{</note>}}


<!-- separate lists -->

<!--
1.  This is a new list. With Hugo, you need to use a HTML comment to separate
    two consecutive lists. **The HTML comment needs to be at the left margin.**
2.  Numbered lists can have paragraphs or block elements within them.

      Just indent the content to be one tab stop beyond the text of the bullet
      point. **This paragraph and the code block line up with the `m` in
      `Numbered` above.**
-->
1.  这是一个新的列表。使用 Hugo，您需要使用 HTML 注释来分隔两个连续的列表。**HTML 注释需要在左边的空白处**
2.  编号列表可以包含段落或块元素。

    只需将内容缩进到 bullet 文本之外的一个制表符停止即可。**本段和代码块与上面 `Numbered` 中的 `m` 对齐。**


      ```bash
      $ ls -l
      ```

<!--
    - And a sub-list after some block-level content. This is at the same
      "level" as the paragraph and code block above, despite being indented
      more.
-->
    - 以及块级内容之后的子列表。这与上面的段落和代码块处于同一"级别"，尽管缩进更多。


<!--
### Tab lists
-->

### 标签列表

<!--
Tab lists can be used to conditionally display content, e.g., when multiple
options must be documented that require distinct instructions or context.
-->
标签列表可用于有条件地显示内容，例如，当必须记录多个需要不同指令或上下文的选项时。

{{< tabs name="tab_lists_example" >}}
{{% tab name="Choose one..." %}}

<!--
Please select an option.
-->
请选择一个选项。

{{% /tab %}}
{{% tab name="Formatting tab lists" %}}

<!--
Tabs may also nest formatting styles.
-->
标签也可以嵌套格式样式。

<!--
1. Ordered
1. (Or unordered)
1. Lists
-->

1. 有序
2. （或无序）
3. 列表

```bash
$ echo 'Tab lists may contain code blocks!'
```

{{% /tab %}}
{{% tab name="Nested headers" %}}

<!--
### Header within a tab list
-->

### 标签列表中的标题

<!--
Nested header tags may also be included.
-->
还可以包括嵌套标题标签。

{{< warning >}}

<!--
Headers within tab lists will not appear in the Table of Contents.
-->
标签列表中的标题不会出现在目录中。

{{< /warning >}}

{{% /tab %}}
{{< /tabs >}}

<!--
### Checklists
-->

### 检查列表

<!--
Checklists are technically bullet lists, but the bullets are suppressed by CSS.
-->
检查列表在技术上是 bullet 列表，但项目符号被 CSS 抑制。

<!--
- [ ] This is a checklist item
- [x] This is a selected checklist item
-->

- [ ] 这是一个检查列表项目
- [x] 这是一个选定的检查表项

<!--
## Code blocks
-->

## 代码块

<!--
You can create code blocks two different ways by surrounding the code block with
three back-tick characters on lines before and after the code block. **Only use
back-ticks (code fences) for code blocks.** This allows you to specify the
language of the enclosed code, which enables syntax highlighting. It is also more
predictable than using indentation.
-->
您可以用两种不同的方法创建代码块，方法是使用三个反勾号围绕代码块来以两种不同的方式创建代码块。
**仅对代码块使用反向标记（代码栏）**，这允许您指定所附代码的语言，从而启用语法高亮显示。它也比缩进更容易预测。

{{< warning >}}

<!--
There is one situation where you need to use indentation for code blocks: when
the contents of the code block contain lines starting with `-` or `*` characters.
This is due to
[blackfriday issue #239](https://github.com/russross/blackfriday/issues/239).
-->
有一种情况需要对代码块使用缩进：当代码块的内容包含以 `-` 或 `*` 字符开头的行时。这是由于 [blackfriday 问题 #239](https://github.com/russross/blackfriday/issues/239).

{{< /warning >}}

<!--
this is a code block created by back-ticks
-->

```
这是由反勾号创建的代码块
```

<!--
The back-tick method has some advantages.
-->
反勾号方法有一些优点。

<!--
- It works nearly every time
- It is more compact when viewing the source code.
- It allows you to specify what language the code block is in, for syntax
  highlighting.
- It has a definite ending. Sometimes, the indentation method breaks with
  languages where spacing is significant, like Python or YAML.
-->
- 几乎每次都有效
- 查看源代码，它更紧凑。
- 它允许您指定代码块所在的语言，用于语法高亮显示。
- 它有一个明确的结尾。有时候，缩进方法会中断一些间距很大的语言，比如 Python 或 YAML。

<!--
To specify the language for the code block, put it directly after the first
grouping of back-ticks:
-->
要为代码块指定语言，请将其直接放在第一个代码块之后
反勾号的分组：

```bash
ls -l
```

<!--
Common languages used in Kubernetes documentation code blocks include:
-->
Kubernetes 文档代码块中使用的通用语言包括：

<!--
- `bash` / `shell` (both work the same)
- `go`
- `json`
- `yaml`
- `xml`
- `none` (disables syntax highlighting for the block)
-->
- `bash` / `shell` (两者都相同)
- `go`
- `json`
- `yaml`
- `xml`
- `none` (禁用块的语法突出显示)

<!--
### Code blocks containing Hugo shortcodes
-->

### 包含 Hugo 短代码的代码块

<!--
To show raw Hugo shortcodes as in the above example and prevent Hugo
from interpreting them, use C-style comments directly after the `<` and before
the `>` characters. The following example illustrates this (view the Markdown
source for this page).
-->
要显示上面示例中的原始 Hugo 短代码并防止 Hugo 解释它们，请在 `<` 后面和 `>` 字符之前直接使用 C 风格的注释。
下面的例子说明了这一点（查看此页面的 Markdown 源代码）。

```none
{{</* codenew file="pods/storage/gce-volume.yaml" */>}}
```

<!--
## Links
-->

## 链接

<!--
To format a link, put the link text inside square brackets, followed by the
link target in parentheses. [Link to Kubernetes.io](https://kubernetes.io/) or
[Relative link to Kubernetes.io](/)
-->
要格式化链接，请将链接文本放在方括号中，然后将链接目标放在圆括号中。[链接到 Kubernetes.io](https://kubernetes.io/) 或者 
[Kubernetes.io 的相关链接](/)

<!--
You can also use HTML, but it is not preferred.
<a href="https://kubernetes.io/">Link to Kubernetes.io</a>
-->
您也可以使用 HTML，但不推荐使用它。
<a href="https://kubernetes.io/">链接到 Kubernetes.io</a>

<!--
## Images
-->

## 图片

<!--
To format an image, use similar syntax to [links](#links), but add a leading `!`
character. The square brackets contain the image's alt text. Try to always use
alt text so that people using screen readers can get some benefit from the
image.
-->
要格式化图片，请使用与[链接](#links)类似的语法，但要添加一个前导 `!` 字符。
方括号包含图片的 alt 文本。尽量使用 alt 文本，这样使用屏幕阅读器的人就可以从图片中获得一些好处。

<!--
![pencil icon](/static/images/pencil.png)
-->

![铅笔图标](/static/images/pencil.png)

<!--
To specify extended attributes, such as width, title, caption, etc, use the
<a href="https://gohugo.io/content-management/shortcodes/#figure">figure shortcode</a>,
which is preferred to using a HTML `<img>` tag. Also, if you need the image to
also be a hyperlink, use the `link` attribute, rather than wrapping the whole
figure in Markdown link syntax as shown below.
-->
要指定扩展属性，如宽度、标题、标题等，请使用<a href="https://gohugo.io/content-management/shortcodes/#figure">图形短代码</a>
这是首选使用 HTML `<img>` 标签。此外，如果您需要图片也是一个超链接，请使用 `link` 属性，而不是用 Markdown 链接语法包装整个图片，如下所示。

<!--
{{< figure src="/static/images/pencil.png" title="Pencil icon" caption="Image used to illustrate the figure shortcode" width="200px" >}}
-->
{{< figure src="/static/images/pencil.png" title="铅笔图标”" caption="用于说明图片短代码的图片" width="200px" >}}

<!--
Even if you choose not to use the figure shortcode, an image can also be a link. This
time the pencil icon links to the Kubernetes website. Outer square brackets enclose
the entire image tag, and the link target is in the parentheses at the end.
-->
即使您选择不使用图形短代码，图片也可以是链接。这一次铅笔图标链接到 Kubernetes 网站。外部方括号将整个图像标记括起来，链接目标位于末尾的括号中。

<!--
[![pencil icon](/static/images/pencil.png)](https://kubernetes.io)
-->
[![铅笔图标](/static/images/pencil.png)](https://kubernetes.io)

<!--
You can also use HTML for images, but it is not preferred.
-->
您还可以对图片使用 HTML，但不推荐使用 HTML。

<img src="/static/images/pencil.png" alt="pencil icon" />

<!--
## Tables
-->

## 表

<!--
Simple tables have one row per line, and columns are separated by `|`
characters. The header is separated from the body by cells containing nothing
but at least three `-` characters. For ease of maintenance, try to keep all the
cell separators even, even if you heed to use extra space.
-->
简单表每行有一行，列由 `|` 字符分隔。标题由包含任何内容但至少包含三个 `-` 字符的单元格与主体分隔。
为了便于维护，尽量保持所有的单元分隔符，即使你注意使用额外的空间。

<!--
| Heading cell 1 | Heading cell 2 |
|----------------|----------------|
| Body cell 1    | Body cell 2    |
-->

| 标题单元 1     | 标题单元 2    |
|---------------|----- ---------|
| 主体单元 1     | 主体单元 2    |


<!--
The header is optional. Any text separated by `|` will render as a table.
-->
标题头是可选的。任何以 `|` 分隔的文本都将呈现为一个表。

<!--
Markdown tables have a hard time with block-level elements within cells, such as
list items, code blocks, or multiple paragraphs. For complex or very wide
tables, use HTML instead.
-->
Markdown 在单元格中很难处理块级元素，例如列表项代码块或多个段落。对于复杂或非常宽的表，可以使用 HTML。

<!--
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
-->

<table>
<thead>
  <tr>
    <th>标题单元 1</th>
    <th>标题单元 2</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>主体单元 1</td>
    <td>主体单元 2</td>
  </tr>
</tbody>
</table>

<!--
## Sidebars and Admonitions
-->

## 侧边栏和警告

<!--
Sidebars and admonitions provide ways to add visual importance to text. Use
them sparingly.
-->
侧边栏和警告提供了为文本添加视觉重要性的方法。谨慎使用它们。

<!--
### Sidebars
-->

### 侧边栏

<!--
A sidebar offsets text visually, but without the visual prominence of
[admonitions](#admonitions).
-->
侧边栏在视觉上抵消了文本的影响，但是没有[警告](#admonitions)的视觉突出。

<!--
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
-->


> 这是一个侧边栏。
>
> 您可以在侧栏中包含段落和块级元素。
>
> 你甚至可以拥有代码块。
>
> ```bash
> sudo dmesg
> ```
>


<!--
### Admonitions
-->

### 警告

<!--
Admonitions (notes, warnings, etc) use Hugo shortcodes.
-->
警告（注释，警告等）使用 Hugo 短代码。


{{< note >}}

<!--
Notes catch the reader's attention without a sense of urgency.

You can have multiple paragraphs and block-level elements inside an admonition.
-->
笔记能抓住读者的注意力，而不带紧迫感。

警告中可以包含多个段落和块级元素。


| Or | a | table |
{{< /note >}}

{{< caution >}}

<!--
The reader should proceed with caution.
-->
读者应该谨慎行事。

{{< /caution >}}


{{< warning >}}

<!--
Warnings point out something that could cause harm if ignored.
-->
警告指出如果被忽略可能会造成损害的事情。

{{< /warning >}}


<!--
## Includes

To add shortcodes to includes.
-->

## 包含

添加包含的短代码。

{{< note >}}
{{< include "federation-current-state.md" >}}
{{< /note >}}

<!--
## Katacoda Embedded Live Environment
-->

## Katacoda 嵌入式实时环境

{{< kat-button >}}
