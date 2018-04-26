<!--
## Synopsis

Static compilation of html from markdown including processing for grouping code snippets into arbitrary tabs.
-->
## 摘要

通过markdown格式静态编译html，包括将代码片段分组到任意选项卡的处理。

<!--
## Code Example
\> bdocs-tab:kubectl Deployment Config to run 3 nginx instances (max rollback set to 10 revisions).

bdocs-tab:tab will be stripped during rendering and utilized to with CSS to show or hide the prefered tab. kubectl indicates the desired tab, since blockquotes have no specific syntax highlighting.

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

bdocs-tab:tab_lang will be used to indicate which tab these code snippets belong to. The tab section of the string indicates the tab, while, the language is pushed beyond the underscore. During rendering, the language will be properly highlighted as if the bdoc token was omitted.
-->
## 代码示例
\> bdocs-tab:通过 kubectl 创建 Deployment 配置运行三个 nginx 示例（最大回滚设置为10次修订）

bdocs-tab: 标签将在渲染过程中被剥离，并与 CSS 一起使用以显示或隐藏首选选项卡。 kubectl 标识所选的选项卡，因为块引用没有特定的语法突出显示。

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

bdocs-tab:tab_lang 将用于指示这些代码片段属于哪个选项卡。 字符串的选项卡部分表示选项卡，而语言被推送到下划线之外。 在渲染期间，语言将被正确突出显示，就像省略了 bdoc 令牌一样。

<!--
## Motivation

This is a project to extend markdown documents and render them in html with a table of contents and code snippet pane. Most projects of this variety lean heavily on front end parsing with JavaScript/jQuery. This project uses NodeJS, Marked, and highlight.js to output syntax highlighted code blocks.

With specific tokens on blockquotes and code blocks, the chunks can be placed according to their relevance. Ex: Multiple language code blocks that should be grouped under an arbitrary tab.
-->
## 动机

这是一个扩展 markdown 标识文档并使用目录和代码片段将其呈现在 HTML 中的项目。 这个类型的大多数项目都大量用于使用 JavaScript / jQuery 进行前端解析。 该项目使用 NodeJS，Marked 和highlight.js 来输出语法突出显示的代码块。

在块引用和代码块中使用特定令牌，可以根据其相关性放置块。 例如：多个语言代码块应该分在任意选项卡下。

<!--
## Installation

Clone the repository, then add documents into documents directory. Modify the manifest.json to contain the document filenames in the order desired. The docs field is an array of objects with a filename key.

As a NodeJS program, a valid installation of node is required. Once node is installed, verify it can be run from command line.
```
node --version
```
Next, depedencies need to be installed via npm from the root of the project directory.
```
npm install
```

Once dependencies are installed, run
```
node brodoc.js
```

This will generate the index.html file, which can be opened in a browser or served.

The included node-static server can be run from the project root via
```
npm start
```
-->
## 部署

克隆存储库，然后将文档添加到文档目录中。修改 manifest.json 文件中包括按照所需顺序的文件名。文档字段是具有文件名键的对象数组。

例如一个 NodeJS 程序，需要一个有效安装节点。 一旦安装了节点，通过从命令行运行来验证它。
```
node --version
```
接下来，需要在项目目录的根目录下通过 npm 安装依赖项。
```
npm install
```

一旦安装完依赖项，执行程序
```
node brodoc.js
```

这将生成index.html文件，可以通过浏览器获取打开。

所包含的 node-static 服务器可以从项目根目录运行
```
npm start
```

<!--
## License

Apache License Version 2.0
-->
## 授权

Apache License Version 2.0

<!--
## FAQ

Q: Why is it named brodocs?
A: This project was born out of a collaboration with my brother to create a suitable docs app for his purposes. It was a fun name for the the two of us to use as actual brothers.
-->
## 疑问解答

问: 为什么它被命名为 brodocs ?
答: 这个项目是与我的兄弟合作诞生的，为他的意愿来创建的一个适合的文档应用程序。 这是一个有趣的名字，为我们两个成为真正的兄弟。
