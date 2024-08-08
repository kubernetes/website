---
title: 测试页面（中文版）
main_menu: false
---
<!--
title: Docs smoke test page
main_menu: false
-->

<!--
This page serves two purposes:

- Demonstrate how the Kubernetes documentation uses Markdown
- Provide a "smoke test" document we can use to test HTML, CSS, and template
  changes that affect the overall documentation.
-->
本页面服务于两个目的：

- 展示 Kubernetes 中文版文档中应如何使用 Markdown
- 提供一个测试用文档，用来测试可能影响所有文档的 HTML、CSS 和模板变更

<!--
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
-->
## 标题级别   {#heading-levels}

上面的标题是 H2 级别。页面标题（Title）会渲染为 H1。以下各节分别展示 H3-H6
的渲染结果。

### H3

此处为 H3 节内容。

#### H4

此处为 H4 节内容。

##### H5

此处为 H5 节内容。

###### H6

此处为 H6 节内容。

<!--
## Inline elements

Inline elements show up within the text of paragraph, list item, admonition, or
other block-level element.
-->
## 内联元素（Inline elements）   {#inline-elements}

内联元素显示在段落文字、列表条目、提醒信息或者块级别元素之内。

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.

<!--
### Inline text styles
-->
### 内联文本风格   {#inline-text-styles}

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
- **粗体字**
- _斜体字_
- ***粗斜体字***
- ~~删除线~~
- <u>下划线</u>
- _<u>带下划线的斜体</u>_
- ***<u>带下划线的粗斜体</u>***
- `monospace text`  <- 等宽字体
- **`monospace bold`**    <- 粗等宽字体

<!--
## Lists
-->
## 列表   {#lists}

<!--
Markdown doesn't have strict rules about how to process lists. When we moved
from Jekyll to Hugo, we broke some lists. To fix them, keep the following in
mind:

- Make sure you indent sub-list items **2 spaces**.

- To end a list and start another, you need an HTML comment block on a new line
  between the lists, flush with the left-hand border. The first list won't end
  otherwise, no matter how many blank lines you put between it and the second.
-->
Markdown 在如何处理列表方面没有严格的规则。在我们从 Jekyll 迁移到 Hugo 时，
我们遇到了一些问题。为了处理这些问题，请注意以下几点：

- 确保你将子列表的条目缩进**两个空格**。

- 要结束一个列表并开始一个新的列表，你需要在两个列表之间添加加一个 HTML 注释块，
  并将其置于独立的一行，左边顶边对齐。否则前一个列表不会结束，无论你在它与第二个列表之间放多少个空行。

<!--
### Bullet lists

- This is a list item.
* This is another list item in the same list.
- You can mix `-` and `*`.
  - To make a sub-item, indent two spaces.
    - This is a sub-sub-item. Indent two more spaces.
  - Another sub-item.
-->
### 项目符号列表   {#bullet-lists}

- 此为列表条目。
* 此为另一列表条目，位于同一列表中。
- 你可以将 `-` 和 `*` 混合使用。
  - 要开始子列表，缩进两个空格。
    - 这是另一个子子条目。进一步多缩进两个空格。
  - 另一个子条目。

<!-- separate lists -->

<!--
- This is a new list. With Hugo, you need to use a HTML comment to separate two
  consecutive lists. **The HTML comment needs to be at the left margin.**
- Bullet lists can have paragraphs or block elements within them.

  Indent the content to be the same as the first line of the bullet point.
  **This paragraph and the code block line up with the first `B` in `Bullet`
  above.**
-->
- 这是一个新的列表。使用 Hugo 时，你需要用一行 HTML 注释将两个紧挨着的列表分开。
  **这里的 HTML 注释需要按左侧顶边对齐。**
- 项目符号列表可以中包含文字段落或块元素。

  段落内容与第一行文字左侧对齐。
  **此段文字和下面的代码段都与前一行中的“项”字对齐。**

  ```bash
  ls -l
  ```

  <!--
  - And a sub-list after some block-level content
  -->
  - 在块级内容之后还可以有子列表内容。

<!--
- A bullet list item can contain a numbered list.
  1. Numbered sub-list item 1
  1. Numbered sub-list item 2
-->
- 项目符号列表条目中还可以包含编号列表。
  1. 编号子列表条目一
  1. 编号子列表条目二

- 项目符号列表条目中包含编号列表的另一种形式（推荐形式）。
  让子列表的编号数字与项目符号列表文字左对齐。

  1. 编号子列表条目一，左侧编号与前一行的“项”字左对齐。
  1.  编号子列表条目二，条目文字与数字之间多了一个空格。

<!--
### Numbered lists

1. This is a list item
1. This is another list item in the same list. The number you use in Markdown
   does not necessarily correlate to the number in the final output. By
   convention, we keep them in sync.
-->
### 编号列表  {#numbered-lists}

1. 此为列表条目
1. 此为列表中的第二个条目。在 Markdown 源码中所给的编号数字与最终输出的数字
   可能不同。建议在紧凑列表中编号都使用 1。如果条目之间有其他内容（比如注释
   掉的英文）存在，则需要显式给出编号。

{{<note>}}
<!--
For single-digit numbered lists, using two spaces after the period makes
interior block-level content line up better along tab-stops.
-->
对于单个数字的编号列表，在句点（`.`）后面加两个空格。这样有助于将列表的
内容更好地对齐。
{{</note>}}

<!-- separate lists -->

<!--
1. This is a new list. With Hugo, you need to use an HTML comment to separate
   two consecutive lists. **The HTML comment needs to be at the left margin.**
1. Numbered lists can have paragraphs or block elements within them.

   Indent the content to be the same as the first line of the bullet
   point. **This paragraph and the code block line up with the `N` in
   `Numbered` above.**
-->
1. 这是一个新的列表。 使用 Hugo 时，你需要用 HTML 注释将两个紧挨着的列表分开。
   **HTML 注释需要按左边顶边对齐。**
1. 编号列表条目中也可以包含额外的段落或者块元素。

   后续段落应该按编号列表文字的第一行左侧对齐。
   **此段落及下面的代码段都与本条目中的第一个字“编”对齐。**

   ```bash
   ls -l
   ```

   <!--
   - And a sub-list after some block-level content. This is at the same
     "level" as the paragraph and code block above, despite being indented
     more.
   -->
   - 编号列表条目中可以在块级内容之后有子列表。子列表的符号项要与上层列表条目文字左侧对齐。

### 中文译文的编号列表格式 1

<!--
1. English item 1
-->
1. 译文条目一

<!--
1. English item 2
-->
2. 译文条目二，由于前述原因，条目 2 与 1 之间存在注释行，如果此条目不显式给出
   起始编号，会被 Hugo 当做两个独立的列表。

### 中文译文的编号列表格式 2

<!--
1. English item 1
-->
1. 译文条目一

   <!--
   trunk of english text
   -->
   中文译文段落。

   <!--
   ```shell
   # list services
   kubectl get svc
   ```
   -->
   带注释的代码段（**注意以上英文注释 `<!--` 和 `-->` 的缩进空格数**）。

   ```shell
   # 列举服务
   kubectl get svc
   ```

<!--
1. English item 2
-->
2. 译文条目二，由于前述原因，条目 2 与 1 之间存在注释行，如果此条目不显式给出起始编号，
   会被 Hugo 当做两个独立的列表。

<!--
### Tab lists

Tab lists can be used to conditionally display content, e.g., when multiple
options must be documented that require distinct instructions or context.
-->
### 标签列表  {#tab-lists}

标签列表可以用来有条件地显式内容，例如，当有多种选项可供选择时，
每个选项可能需要完全不同的指令或者上下文。

<!--
{{</* tabs name="tab_lists_example" */>}}
{{%/* tab name="Choose one..." */%}}
请注意这里对英文原文短代码的处理。目的是确保其中的 tabs 短代码失效。
由于 Hugo 的局限性，如果不作类似处理，这里的 tabs 尽管已经被包含在
HTML 注释块中，仍然会生效！

Please select an option.
{{%/* /tab */%}}
-->
{{< tabs name="tab_lists_example" >}}
{{% tab name="请选择..." %}}
请选择一个选项。
{{% /tab %}}

<!--
{{%/* tab name="Formatting tab lists" */%}}
-->
{{% tab name="在标签页中格式化列表" %}}

<!--
Tabs may also nest formatting styles.

1. Ordered
1. (Or unordered)
1. Lists

```bash
echo 'Tab lists may contain code blocks!'
```
-->
标签页中也可以包含嵌套的排版风格，其中的英文注释处理也同正文中
的处理基本一致。

1. 编号列表
1. （或者没有编号的）
1. 列表

```bash
echo '标签页里面也可以有代码段!'
```

{{% /tab %}}
<!--
{{%/* tab name="Nested headers" */%}}
-->
{{% tab name="嵌套的子标题" %}}

<!--
### Headers in Tab list

Nested header tags may also be included.
-->
### 在标签页中的子标题  {#headers-in-tab-list}

标签页中也可以包含嵌套的子标题。

{{< warning >}}
<!--
Headers within tab lists will not appear in the Table of Contents.
-->
标签页中的子标题不会在目录中出现。
{{< /warning >}}

{{% /tab %}}
{{< /tabs >}}

<!--
### Checklists

Checklists are technically bullet lists, but the bullets are suppressed by CSS.

- [ ] This is a checklist item
- [x] This is a selected checklist item
-->
### 检查项列表  （Checklists）

检查项列表本质上也是一种项目符号列表，只是这里的项目符号部分被 CSS 压制了。

- [ ] 此为第一个检查项
- [x] 此为被选中的检查项

<!--
## Code blocks

You can create code blocks two different ways by surrounding the code block with
three back-tick characters on lines before and after the code block. **Only use
back-ticks (code fences) for code blocks.** This allows you to specify the
language of the enclosed code, which enables syntax highlighting. It is also more
predictable than using indentation.
-->
## 代码段  {#code-blocks}

你可以用两种方式来创建代码块。一种方式是将在代码块之前和之后分别加上包含三个反引号的独立行。
**反引号应该仅用于代码段。**
用这种方式标记代码段时，你还可以指定所包含的代码的编程语言，从而启用语法加亮。
这种方式也比使用空格缩进的方式可预测性更好。

<!--
```
this is a code block created by back-ticks
```
-->
```
这是用反引号创建的代码段
```

<!--
The back-tick method has some advantages.

- It works nearly every time
- It is more compact when viewing the source code.
- It allows you to specify what language the code block is in, for syntax
  highlighting.
- It has a definite ending. Sometimes, the indentation method breaks with
  languages where spacing is significant, like Python or YAML.
-->
反引号标记代码段的方式有以下优点：

- 这种方式几乎总是能正确工作
- 在查看源代码时，内容相对紧凑
- 允许你指定代码块的编程语言，以便启用语法加亮
- 代码段的结束位置有明确标记。有时候，采用缩进空格的方式会使得一些对空格很敏感的语言（如 Python、YAML）很难处理。

<!--
To specify the language for the code block, put it directly after the first
grouping of back-ticks:
-->
要为代码段指定编程语言，可以在第一组反引号之后加上编程语言名称：

```bash
ls -l
```

<!--
Common languages used in Kubernetes documentation code blocks include:

- `bash` / `shell` (both work the same)
- `go`
- `json`
- `yaml`
- `xml`
- `none` (disables syntax highlighting for the block)
-->
Kubernetes 文档中代码块常用语言包括：

- `bash` / `shell`（二者几乎完全相同）
- `go`
- `json`
- `yaml`
- `xml`
- `none`（禁止对代码块执行语法加亮）

<!--
### Code blocks containing Hugo shortcodes

To show raw Hugo shortcodes as in the above example and prevent Hugo
from interpreting them, use C-style comments directly after the `<` and before
the `>` characters. The following example illustrates this (view the Markdown
source for this page).
-->
### 包含 Hugo 短代码的代码块   {#code-blocks-containing-hugo-shortcodes}

如果要像上面的例子一样显示 Hugo 短代码（Shortcode），不希望 Hugo 将其当做短代码来处理，
可以在 `<` 和 `>` 之间使用 C 语言风格的注释。
下面的示例展示如何实现这点（查看本页的 Markdown 源码）：

```none
{{</* alert color="warning" >}}This is a warning.{{< /alert */>}}
```

<!--
## Links

To format a link, put the link text inside square brackets, followed by the
link target in parentheses.

- `[Link to Kubernetes.io](https://kubernetes.io/)` or
- `[Relative link to Kubernetes.io](/)`

You can also use HTML, but it is not preferred.
For example, `<a href="https://kubernetes.io/">Link to Kubernetes.io</a>`.
-->
## 链接   {#links}

要格式化链接，将链接显示文本放在方括号中，后接用圆括号括起来的链接目标。

- `[指向 Kubernetes.io 的链接](https://kubernetes.io/)`或
- `[到 Kubernetes.io 的相对链接](/)`

你也可以使用 HTML，但这种方式不是推荐的方式。
例如，`<a href="https://kubernetes.io/">到 Kubernetes.io 的链接</a>`。

### 中文链接

中文版本文档中的链接要注意以下两点：

- 指向 Kubernetes 文档的站内链接，需要在英文链接之前添加前缀 `/zh-cn`。
  例如，原链接目标为 `/docs/foo/bar` 时，译文中的链接目标应为
  `/zh-cn/docs/foo/bar`。例如：

  - 英文版本链接 [Kubernetes Components](/docs/concepts/overview/components/)
  - 对应中文链接 [Kubernetes 组件](/zh-cn/docs/concepts/overview/components/)

- 英文页面子标题会生成对应锚点（Anchor），例如子标题 `## Using object` 会生成对应标签
  `#using-objects`。在翻译为中文之后，对应锚点可能会失效。对此，有两种方法处理。
  假定译文中存在以下子标题：

  ```
  <!--
  ## Clean up

  You can do this ...
  -->
  ## 清理现场

  你可以这样 ...
  ```

  并且在本页或其他页面有指向 `#clean-up` 的链接如下：

  ```
  ..., please refer to the [clean up](#clean-up) section.
  ```

  第一种处理方法是将链接改为中文锚点，即将引用该子标题的文字全部改为中文锚点。
  例如：
    
  ```
  ..., 请参考[清理工作](#清理现场)一节。
  ```

  第二种方式（也是推荐的方式）是将原来可能生成的锚点（尽管在英文原文中未明确给出）
  显式标记在译文的子标题上。

  ```
  <!--
  ## Clean up

  You can do this ...
  -->
  ## 清理现场  {#clean-up}

  你可以这样 ...
  ```

  之所以优选第二种方式是因为可以避免文档站点中其他引用此子标题的链接失效。
   
<!--
## Images

To format an image, use similar syntax to [links](#links), but add a leading `!`
character. The square brackets contain the image's alt text. Try to always use
alt text so that people using screen readers can get some benefit from the
image.
-->
## 图片  {#images}

要显示图片，可以使用与链接类似的语法（`[links](#links)`），不过要在整个链接之前添加一个感叹号（`!`）。
方括号中给出的是图片的替代文本。
请坚持为图片设定替代文本，这样使用屏幕阅读器的人也能够了解图片中包含的是什么。

![pencil icon](/images/pencil.png)

<!--
To specify extended attributes, such as width, title, caption, etc, use the
<a href="https://gohugo.io/content-management/shortcodes/#figure">figure shortcode</a>,
which is preferred to using a HTML `<img>` tag. Also, if you need the image to
also be a hyperlink, use the `link` attribute, rather than wrapping the whole
figure in Markdown link syntax as shown below.
-->
要设置扩展的属性，例如 width、title、caption 等等，可以使用
<a href="https://gohugo.io/content-management/shortcodes/#figure">figure</a>
短代码，而不是使用 HTML 的 `<img>` 标签。
此外，如果你需要让图片本身变成超链接，可以使用短代码的 `link` 属性，
而不是将整个图片放到 Markdown 的链接语法之内。下面是一个例子：

<!--
{{</* figure src="/static/images/pencil.png" title="Pencil icon" caption="Image used to illustrate the figure shortcode" width="200px" */>}}
-->
{{< figure src="/images/pencil.png" title="铅笔图标" caption="用来展示 figure 短代码的图片" width="200px" >}}

<!--
Even if you choose not to use the figure shortcode, an image can also be a link. This
time the pencil icon links to the Kubernetes website. Outer square brackets enclose
the entire image tag, and the link target is in the parentheses at the end.

[![pencil icon](/images/pencil.png)](https://kubernetes.io)

You can also use HTML for images, but it is not preferred.

<img src="/images/pencil.png" alt="pencil icon" />
-->
即使你不想使用 figure 短代码，图片也可以展示为链接。这里，铅笔图标指向
Kubernetes 网站。外层的方括号将整个 image 标签封装起来，链接目标在末尾的圆括号之间给出。

[![铅笔图标](/images/pencil.png)](https://kubernetes.io)

你也可以使用 HTML 来嵌入图片，不过这种方式是不推荐的。

<img src="/images/pencil.png" alt="铅笔图标" />

<!--
## Tables

Simple tables have one row per line, and columns are separated by `|`
characters. The header is separated from the body by cells containing nothing
but at least three `-` characters. For ease of maintenance, try to keep all the
cell separators even, even if you heed to use extra space.
-->
## 表格   {#tables}

简单的表格可能每行只有一个独立的数据行，各个列之间用 `|` 隔开。
表格的标题行与表格内容之间用独立的一行隔开，在这一行中每个单元格的内容只有
`-` 字符，且至少三个。出于方便维护考虑，请尝试将各个单元格间的分割线对齐，
尽管这样意味着你需要多输入几个空格。

<!--
| Heading cell 1 | Heading cell 2 |
|----------------|----------------|
| Body cell 1    | Body cell 2    |
-->
| 标题单元格 1   | 标题单元格 2   |
|--------------|---------------|
| 内容单元格 1   | 内容单元格 2   |

<!--
The header is optional. Any text separated by `|` will render as a table.
-->
标题行是可选的。所有用 `|` 隔开的内容都会被渲染成表格。

<!--
Markdown tables have a hard time with block-level elements within cells, such as
list items, code blocks, or multiple paragraphs. For complex or very wide
tables, use HTML instead.
-->
Markdown 表格在处理块级元素方面还很笨拙。例如在单元格中嵌入列表条目、代码段、
或者在其中划分多个段落方面的能力都比较差。对于复杂的或者很宽的表格，可以使用
HTML。

<table>
<thead>
  <tr>
    <!-- th>Heading cell 1</th -->
    <th>标题单元格 1</th>
    <!-- th>Heading cell 2</th -->
    <th>标题单元格 2</th>
  </tr>
</thead>
<tbody>
  <tr>
    <!-- td>Body cell 1</td -->
    <td>内容单元格 1</td>
    <!-- td>Body cell 2</td -->
    <td>内容单元格 2</td>
  </tr>
</tbody>
</table>

<!--
## Visualizations with Mermaid

You can use [Mermaid JS](https://mermaidjs.github.io) visualizations.
The Mermaid JS version is specified in [/layouts/partials/head.html](https://github.com/kubernetes/website/blob/main/layouts/partials/head.html)
-->
## 使用 Mermaid 来可视化  {#visualizations-with-mermaid}

你可以使用 [Mermaid JS](https://mermaidjs.github.io) 来进行可视化展示。
Mermaid JS 版本在 [/layouts/partials/head.html](https://github.com/kubernetes/website/blob/main/layouts/partials/head.html)
中设置。

<!--
{{</* mermaid */>}}
graph TD;
  A->B;
  A->C;
  B->D;
  C->D;
{{</* mermaid */>}}
-->
```
{{</* mermaid */>}}
graph TD;
  甲-->乙;
  甲-->丙;
  乙-->丁;
  丙-->丁;
{{</*/ mermaid */>}}
```

<!--
Produces:
-->
会产生：

<!--
{{</* mermaid */>}}
graph TD;
  A->B;
  A->C;
  B->D;
  C->D;
{{</*/ mermaid */>}}
-->
{{< mermaid >}}
graph TD;
  甲-->乙;
  甲-->丙;
  乙-->丁;
  丙-->丁;
{{</ mermaid >}}

<!--
```
{{</* mermaid */>}}
sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob->>John: How about you John?
    Bob-x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob->Alice: Checking with John...
    Alice->John: Yes... John, how are you?
{{</*/ mermaid */>}}
```
-->

```
{{</* mermaid */>}}
sequenceDiagram
    张三 ->> 李四: 李四，锄禾日当午？
    李四-->>王五: 王五，锄禾日当午？
    李四--x 张三: 汗滴禾下土！
    李四-x 王五: 汗滴禾下土！
    Note right of 王五: 李四想啊想啊<br/>一直想啊想，太阳<br/>都下山了，他还没想出来<br/>，文本框都放不下了。

    李四-->张三: 跑去问王五...
    张三->王五: 好吧... 王五，白日依山尽？
{{</*/ mermaid */>}}
```

<!--
Produces:
-->
会产生：

<!--
{{< mermaid >}}
sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob->>John: How about you John?
    Bob-x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob->Alice: Checking with John...
    Alice->John: Yes... John, how are you?
{{</ mermaid >}}
-->
{{< mermaid >}}
sequenceDiagram
    张三 ->> 李四: 李四，锄禾日当午？
    李四-->>王五: 王五，锄禾日当午？
    李四--x 张三: 汗滴禾下土！
    李四-x 王五: 汗滴禾下土！
    Note right of 王五: 李四想啊想啊一直想，<br/>想到太阳都下山了，<br/>他还没想出来，<br/>文本框都放不下了。

    李四-->张三: 跑去问王五...
    张三->王五: 好吧... 王五，白日依山尽？
{{</ mermaid >}}

<!--
You can check more [examples](https://mermaid-js.github.io/mermaid/#/examples) from the official docs.
-->
你可以查阅官方网站上的更多[示例](https://mermaid-js.github.io/mermaid/#/examples)。

<!--
## Sidebars and Admonitions

Sidebars and admonitions provide ways to add visual importance to text. Use
them sparingly.
-->
## 侧边栏和提醒框   {#sidebars-and-admonitions}

侧边栏和提醒框可以为文本提供直观的重要性强调效果，可以偶尔一用。

<!--
### Sidebars

A sidebar offsets text visually, but without the visual prominence of
[admonitions](#admonitions).
-->
### 侧边栏（Sidebar）  {#sidebars}

侧边栏可以将文字横向平移，只是其显示效果可能不像[提醒](#admonitions)那么明显。

<!--
> This is a sidebar.
>
> You can have paragraphs and block-level elements within a sidebar.
>
> You can even have code blocks.
-->

> 此为侧边栏。
>
> 你可以在侧边栏内排版段落和块级元素。
>
> 你甚至可以在其中包含代码块。
>
> ```bash
> sudo dmesg
> ```

<!--
### Admonitions

Admonitions (notes, warnings, etc) use Hugo shortcodes.
-->
### 提醒框   {#admonitions}

提醒框（说明、警告等等）都是用 Hugo 短代码的形式展现。

{{< note >}}
<!--
Notes catch the reader's attention without a sense of urgency.

You can have multiple paragraphs and block-level elements inside an admonition.

You can also add tables to organize and highlight key information.

| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Data 1   | Data A   | Info X   |
| Data 2   | Data B   | Info Y   |
-->
说明信息用来引起读者的注意，但不过分强调其紧迫性。

你还可以添加表格来组织和突出关键信息。

| 表头 1 | 表头 2 | 表头 3 |
| -------- | -------- | -------- |
| 数据 1   | 数据 A   | 信息 X   |
| 数据 2   | 数据 B   | 信息 Y   |
{{< /note >}}

{{< caution >}}
<!--
The reader should proceed with caution.
-->
读者继续此操作时要格外小心。
{{< /caution >}}

{{< warning >}}
<!--
Warnings point out something that could cause harm if ignored.
-->
警告信息试图为读者指出一些不应忽略的、可能引发问题的事情。
{{< /warning >}}

注意，在较老的 Hugo 版本中，直接将 `note`、`warning` 或 `caution` 短代码括入
HTML 注释当中是有问题的。这些短代码仍然会起作用。目前，在 0.70.0
以上版本中似乎已经修复了这一问题。

<!--
## Includes

To add shortcodes to includes.
-->
## 包含其他页面   {#includes}

要包含其他页面，可使用短代码。

{{< note >}}
{{< include "task-tutorial-prereqs.md" >}}
{{< /note >}}

<!--
## Katacoda Embedded Live Environment
-->
## 嵌入的 Katacoda 环境   {#katacoda-embedded-live-env}

{{< kat-button >}}
