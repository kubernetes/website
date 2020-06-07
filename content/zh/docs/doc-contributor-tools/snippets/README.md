<!-- # Snippets for Atom -->
# Atom 的代码段

<!-- Snippets are bits of text that get inserted into your editor, to save typing and
reduce syntax errors. The snippets provided in `atom-snippets.cson` are scoped to
only work on Markdown files within Atom. -->

代码段就是可以插入到编辑器中的一段文本，可以节省键入时间，减少语法错误。
`atom-snippets.cson` 文件中所提供的代码段只用于在 Atom 中的 Markdown 文件。

<!-- ## Installation -->
## 安装

<!-- Copy the contents of the `atom-snippets.cson` file into your existing
`~/.atom/snippets.cson`. **Do not replace your existing file.** -->

将 `atom-snippets.cson` 文件中的内容复制到现有的`~/.atom/snippets.cson` 之中。
**不要替换现有的文件。**

<!-- You do not need to restart Atom. -->
不需要重启 Atom。

<!-- ## Usage -->
## 使用

<!-- Have a look through `atom-snippets.cson` and note the titles and `prefix` values
of the snippets. -->

浏览一遍 `atom-snippets.cson` 文件，记下代码段的标题和 `prefix`。

<!-- You can trigger a given snippet in one of two ways:

- By typing the snippet's `prefix` and pressing the `<TAB>` key
- By searching for the snippet's title in **Packages / Snippets / Available** -->

你可以使用以下任意一种方式来触发相应的代码段：
- 键入代码段的`prefix`，按下 `<TAB>` 键
- 在 **Packages / Snippets / Available** 中搜索代码段的标题

<!-- For example, open a Markdown file and type `anote` and press `<TAB>`. A blank
note is added, with the correct Hugo shortcodes. -->

例如，打开一个 Markdown 文件，键入 `anote`，按下 `<TAB>`。
就会插入一段带有正确的 Hugo 短代码的空注释。

<!-- A snippet can insert a single line or multiple lines of text. Some snippets
have placeholder values. To get to the next placeholder, press `<TAB>` again. -->

代码段可以插入一行或多行文本。一些代码行都设有预留值。想要切换到下一个预留值，再按一次`<TAB>` 键即可。

<!-- Some of the snippets only insert partially-formed Markdown or Hugo syntax.
For instance, `coverview` inserts the start of a concept overview tag, while
`cclose` inserts a close-capture tag. This is because every type of capture
needs a capture-close tab. -->

一些代码段只会插入部分格式的 Markdown 或 Hugo 语法。
例如，`coverview` 只会插入一个概念概览的开始标签，而`cclose`则会插入一个结束标签。
这是因为每类 capture 都需要一个 capture-close 标签。

<!-- ## Creating new topics using snippets -->
## 使用代码段创建新的话题

<!-- To create a new concept, task, or tutorial from a blank file, use one of the
following: -->
从空白文件中，创建一个新的概念，任务或者教程，使用以下的代码段：

- `newconcept`
- `newtask`
- `newtutorial`

<!-- Placeholder text is included. -->
预设文本包含其中。

<!-- ## Submitting new snippets -->
## 提交新的代码段

<!-- 1.  Develop the snippet locally and verify that it works as expected.
2.  Copy the template's code into the `atom-snippets.cson` file on Github. Raise a
    pull request, and ask for review from another Atom user in `#sig-docs` on
    Kubernetes Slack. -->

1. 本地开发代码段，验证是否有效。
2. 将代码单复制到 Github 的 `atom-snippets.cson` 文件中。
提交 pull request，邀请 Kubernetes Slack `#sig-docs` 中的另外一名 Atom 用户进行审查。
