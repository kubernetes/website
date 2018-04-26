<!--
## Synopsis
-->
## 概要

<!--
Static compilation of html from markdown including processing for grouping code snippets into arbitrary tabs.
-->
静态编译 html 文件，这些 html 文件来源于需要将代码片段分组为任意选项卡进行处理的 markdown 文件。

<!--
## Code Example
-->
## 代码示例

<!--
\> bdocs-tab:kubectl Deployment Config to run 3 nginx instances (max rollback set to 10 revisions).
-->
\> bdocs-tab:kubectl 部署运行三个 nginx 实例（最大修改次数设置为 10）

<!--
bdocs-tab:tab will be stripped during rendering and utilized to with CSS to show or hide the prefered tab. kubectl indicates the desired tab, since blockquotes have no specific syntax highlighting.
-->
在渲染过程中，bdocs-tab:tab 将被剥离，并与 CSS 一起用于显示或隐藏首选选项卡。因为 blockquotes 没有特定的语法高亮，所以 kubectl 指示所需的选项。

\`\`\`bdocs-tab:kubectl_yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: deployment-example
spec:
  replicas: 3
  revisionHistoryLimit: 10
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.10
\`\`\`

<!--
bdocs-tab:tab_lang will be used to indicate which tab these code snippets belong to. The tab section of the string indicates the tab, while, the language is pushed beyond the underscore. During rendering, the language will be properly highlighted as if the bdoc token was omitted.
-->
bdocs-tab:tab_lang 用于指示这些代码片段属于哪个选项卡。字符串的 tab 部分指示选项卡，而语言则被推送到下划线之外。在渲染过程中，语言能够被正常高亮显示，就像省略了 bdoc 令牌一样。

<!--
## Motivation
-->
## 动机

<!--
This is a project to extend markdown documents and render them in html with a table of contents and code snippet pane. Most projects of this variety lean heavily on front end parsing with JavaScript/jQuery. This project uses NodeJS, Marked, and highlight.js to output syntax highlighted code blocks.
-->
这是一个扩展标记文档的项目，并在 html 中使用目录和代码片段窗格呈现它们。这种类型的大多数项目都严重依赖于使用 JavaScript/jQuery 进行前端解析。该项目使用NodeJS、Marked 和 highlight.js 来输出语法高亮显示的代码块。

<!--
With specific tokens on blockquotes and code blocks, the chunks can be placed according to their relevance. Ex: Multiple language code blocks that should be grouped under an arbitrary tab.
-->
在 blockquote 和代码块上使用特殊的标记，块就可以根据它的相关性来放置。例如：多语言代码块应该在任意选项卡下分组。

<!--
## Installation
-->
## 安装

<!--
Clone the repository, then add documents into documents directory. Modify the manifest.json to contain the document filenames in the order desired. The docs field is an array of objects with a filename key.
-->
克隆代码库，然后将文档添加到文档目录中。按照所需的顺序，修改 manifest.json 以包含文档文件名。docs 字段是一个以文件名为 key 的对象数组。

<!--
As a NodeJS program, a valid installation of node is required. Once node is installed, verify it can be run from command line.
-->
作为一个 NodeJS 程序，需要 node 的有效安装。node 安装完成后，验证其是否可以从命令行运行。
```
node --version
```
<!--
Next, depedencies need to be installed via npm from the root of the project directory.
-->
接下来，在项目的根目录下面使用 npm 安装依赖项。
```
npm install
```

<!--
Once dependencies are installed, run
-->
待依赖安装完成后，运行。
```
node brodoc.js
```

<!--
This will generate the index.html file, which can be opened in a browser or served.
-->
这将生成 index.html 文件，可以在浏览器或服务中打开它。

<!--
The included node-static server can be run from the project root via
-->
可以从项目根目录下运行所包含的节点静态服务器。
```
npm start
```

<!--
## License
-->
## 许可证

Apache License Version 2.0

<!--
## FAQ
-->
## 常见问题解答

<!--
Q: Why is it named brodocs?
A: This project was born out of a collaboration with my brother to create a suitable docs app for his purposes. It was a fun name for the the two of us to use as actual brothers.
-->
问：为什么它叫做 brodocs?
答：这个项目源于与我哥哥的合作，是为了给他制作一个合适的文档应用程序。我们两个真正的兄弟来使用的话，这是一个有趣的名字。