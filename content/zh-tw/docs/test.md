---
title: 測試頁面（中文版）
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
本頁面服務於兩個目的：

- 展示 Kubernetes 中文版文件中應如何使用 Markdown
- 提供一個測試用文件，用來測試可能影響所有文件的 HTML、CSS 和模板變更

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
## 標題級別

上面的標題是 H2 級別。頁面標題（Title）會渲染為 H1。以下各節分別展示 H3-H6
的渲染結果。

### H3

此處為 H3 節內容。

#### H4

此處為 H4 節內容。

##### H5

此處為 H5 節內容。

###### H6

此處為 H6 節內容。

<!--
## Inline elements

Inline elements show up within the text of paragraph, list item, admonition, or
other block-level element.
-->
## 內聯元素（Inline elements）

內聯元素顯示在段落文字、列表條目、提醒資訊或者塊級別元素之內。

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.

### 內聯文字風格

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
- **粗體字**
- _斜體字_
- ***粗斜體字***
- ~~刪除線~~
- <u>下劃線</u>
- _<u>帶下劃線的斜體</u>_
- ***<u>帶下劃線的粗斜體</u>***
- `monospace text`  <- 等寬字型
- **`monospace bold`**    <- 粗等寬字型

## 列表

<!--
Markdown doesn't have strict rules about how to process lists. When we moved
from Jekyll to Hugo, we broke some lists. To fix them, keep the following in
mind:

- Make sure you indent sub-list items **4 spaces** rather than the 2 that you
  may be used to. Counter-intuitively, you need to indent block-level content
  within a list item an extra 4 spaces too.

- To end a list and start another, you need a HTML comment block on a new line
  between the lists, flush with the left-hand border. The first list won't end
  otherwise, no matter how many blank lines you put between it and the second.
-->
Markdown 在如何處理列表方面沒有嚴格的規則。在我們從 Jekyll 遷移到 Hugo 時，
我們遇到了一些問題。為了處理這些問題，請注意以下幾點：

- 確保你將子列表的條目縮排**四個空格**而不是你可能熟悉的兩個空格。
  有一點是不那麼直觀的，你需要將列表中的塊級別內容多縮排四個空格。

- 要結束一個列表並開始一個新的列表，你需要在兩個列表之間新增加一個 HTML 註釋塊，
  並將其置於獨立的一行，左邊頂邊對齊。否則前一個列表不會結束，無論你在它與
  第二個列表之間放多少個空行。

<!--
### Bullet lists

- This is a list item
* This is another list item in the same list
- You can mix `-` and `*`
    - To make a sub-item, indent two tabstops (4 spaces). **This is different
      from Jekyll and Kramdown.**
        - This is a sub-sub-item. Indent two more tabstops (4 more spaces).
    - Another sub-item.
-->
### 專案符號列表

- 此為列表條目
* 此為另一列表條目，位於同一列表中
- 你可以將 `-` 和 `*` 混合使用
  - 要開始子列表，縮排兩個 TAB （四個空格）。**Jekyll 和 Markdown
    在這點上有所不同**。
    - 這是另一個子子條目。進一步多縮排兩個空格。
  - 另一個子條目

<!-- separate lists -->

<!--
- This is a new list.  With Hugo, you need to use a HTML comment to separate two
  consecutive lists. **The HTML comment needs to be at the left margin.**
- Bullet lists can have paragraphs or block elements within them.

      Indent the content to be the same as the first line of the bullet
      point. **This paragraph and the code block line up with the second `l` in
      `Bullet` above.**

      ```bash
      ls -l
      ```

      - And a sub-list after some block-level content
-->
- 這是一個新的列表。使用 Hugo 時，你需要用一行 HTML 註釋將兩個緊挨著的列表分開。
  **這裡的 HTML 註釋需要按左側頂邊對齊。**
- 專案符號列表可以中包含文欄位落或塊元素。

  段落內容與第一行文字左側對齊。
  **此段文字和下面的程式碼段都與前一行中的“項”字對齊。**

  ```bash
  ls -l
  ```

  - 在塊級內容之後還可以有子列表內容。

<!--
- A bullet list item can contain a numbered list.
    1.  Numbered sub-list item 1
    2.  Numbered sub-list item 2
-->
- 專案符號列表條目中還可以包含編號列表。
    1.  編號子列表條目一
    1.  編號子列表條目二

- 專案符號列表條目中包含編號列表的另一種形式（推薦形式）。讓子列表的編號數字
  與專案符號列表文字左對齊。

  1. 編號子列表條目一，左側編號與前一行的“項”字左對齊。
  1.  編號子列表條目二，條目文字與數字之間多了一個空格。

<!--
### Numbered lists

1.  This is a list item
2.  This is another list item in the same list. The number you use in Markdown
    does not necessarily correlate to the number in the final output. By
    convention, we keep them in sync.
3.  {{<note>}}
    For single-digit numbered lists, using two spaces after the period makes
    interior block-level content line up better along tab-stops.
    {{</note>}}
-->
### 編號列表

1.  此為列表條目
1.  此為列表中的第二個條目。在 Markdown 原始碼中所給的編號數字與最終輸出的數字
    可能不同。建議在緊湊列表中編號都使用 1。如果條目之間有其他內容（比如註釋
    掉的英文）存在，則需要顯式給出編號。
2.  {{<note>}}
    對於單個數字的編號列表，在句點（`.`）後面加兩個空格。這樣有助於將列表的
    內容更好地對齊。
    {{</note>}}


<!-- separate lists -->

<!--
1.  This is a new list. With Hugo, you need to use a HTML comment to separate
    two consecutive lists. **The HTML comment needs to be at the left margin.**
2.  Numbered lists can have paragraphs or block elements within them.

      Just indent the content to be one tab stop beyond the text of the bullet
      point. **This paragraph and the code block line up with the `m` in
      `Numbered` above.**

      ```bash
      ls -l
      ```

    - And a sub-list after some block-level content. This is at the same
      "level" as the paragraph and code block above, despite being indented
      more.
-->
1.  這是一個新的列表。 使用 Hugo 時，你需要用 HTML 註釋將兩個緊挨著的列表分開。
    **HTML 註釋需要按左邊頂邊對齊。**
2.  編號列表條目中也可以包含額外的段落或者塊元素。

    後續段落應該按編號列表文字的第一行左側對齊。
    **此段落及下面的程式碼段都與本條目中的第一個字“編”對齊。**

    ```bash
    ls -l
    ```

    - 編號列表條目中可以在塊級內容之後有子列表。子列表的符號項要與上層列表條目
      文字左側對齊。

### 中文譯文的編號列表格式 1

<!--
1. English item 1
-->
1. 譯文條目一

<!--
1. English item 2
-->
2. 譯文條目二，由於前述原因，條目 2 與 1 之間存在註釋行，如果此條目不顯式給出
   起始編號，會被 Hugo 當做兩個獨立的列表。

### 中文譯文的編號列表格式 2

<!--
1. English item 1
-->
1. 譯文條目一

   <!-- trunk of english text -->
   中文譯文段落。

   <!--
   ```shell
   # list services
   kubectl get svc
   ```
   -->
   帶註釋的程式碼段（**注意以上英文註釋 `<!--` 和 `-->` 的縮排空格數**）。

   ```shell
   # 列舉服務
   kubectl get svc
   ```

<!--
1. English item 2
-->
2. 譯文條目二，由於前述原因，條目 2 與 1 之間存在註釋行，如果此條目不顯式給出
   起始編號，會被 Hugo 當做兩個獨立的列表。

<!--
### Tab lists

Tab lists can be used to conditionally display content, e.g., when multiple
options must be documented that require distinct instructions or context.
-->
### 標籤列表

標籤列表可以用來有條件地顯式內容，例如，當有多種選項可供選擇時，每個選項
可能需要完全不同的指令或者上下文。

<!--
{{</* tabs name="tab_lists_example" */>}}
{{%/* tab name="Choose one..." */%}}
請注意這裡對英文原文短程式碼的處理。目的是確保其中的 tabs 短程式碼失效。
由於 Hugo 的侷限性，如果不作類似處理，這裡的 tabs 儘管已經被包含在
HTML 註釋塊中，仍然會生效！

Please select an option.
{{%/* /tab */%}}
-->
{{< tabs name="tab_lists_example" >}}
{{% tab name="請選擇..." %}}
請選擇一個選項。
{{% /tab %}}

<!--
{{%/* tab name="Formatting tab lists" */%}}
-->
{{% tab name="在標籤頁中格式化列表" %}}

<!--
Tabs may also nest formatting styles.

1. Ordered
1. (Or unordered)
1. Lists

```bash
echo 'Tab lists may contain code blocks!'
```
-->
標籤頁中也可以包含巢狀的排版風格，其中的英文註釋處理也同正文中
的處理基本一致。

1. 編號列表
1. （或者沒有編號的）
1. 列表

```bash
echo '標籤頁裡面也可以有程式碼段!'
```

{{% /tab %}}
<!--
{{%/* tab name="Nested headers" */%}}
-->
{{% tab name="巢狀的子標題" %}}

<!--
### Headers in Tab list

Nested header tags may also be included.
-->
### 在標籤頁中的子標題

標籤頁中也可以包含巢狀的子標題。

<!--
{{</* warning */>}}
Headers within tab lists will not appear in the Table of Contents.
{{</* /warning */>}}
-->
{{< warning >}}
標籤頁中的子標題不會在目錄中出現。
{{< /warning >}}

{{% /tab %}}
{{< /tabs >}}

<!--
### Checklists

Checklists are technically bullet lists, but the bullets are suppressed by CSS.

- [ ] This is a checklist item
- [x] This is a selected checklist item
-->
### 檢查項列表  （Checklists）

檢查項列表本質上也是一種專案符號列表，只是這裡的專案符號部分被 CSS 壓制了。

- [ ] 此為第一個檢查項
- [x] 此為被選中的檢查項

<!--
## Code blocks

You can create code blocks two different ways by surrounding the code block with
three back-tick characters on lines before and after the code block. **Only use
back-ticks (code fences) for code blocks.** This allows you to specify the
language of the enclosed code, which enables syntax highlighting. It is also more
predictable than using indentation.
-->
## 程式碼段

你可以用兩種方式來建立程式碼塊。一種方式是將在程式碼塊之前和之後分別加上包含三個
反引號的獨立行。**反引號應該僅用於程式碼段。**
用這種方式標記程式碼段時，你還可以指定所包含的程式碼的程式語言，從而啟用語法加亮。
這種方式也比使用空格縮排的方式可預測性更好。

<!--
```
this is a code block created by back-ticks
```
-->
```
這是用反引號建立的程式碼段
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
反引號標記程式碼段的方式有以下優點：

- 這種方式幾乎總是能正確工作
- 在檢視原始碼時，內容相對緊湊
- 允許你指定程式碼塊的程式語言，以便啟用語法加亮
- 程式碼段的結束位置有明確標記。有時候，採用縮排空格的方式會使得一些對空格
  很敏感的語言（如 Python、YAML）很難處理。

<!--
To specify the language for the code block, put it directly after the first
grouping of back-ticks:
-->
要為程式碼段指定程式語言，可以在第一組反引號之後加上程式語言名稱：

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
Kubernetes 文件中程式碼塊常用語言包括：

- `bash` / `shell` （二者幾乎完全相同）
- `go`
- `json`
- `yaml`
- `xml`
- `none` （禁止對程式碼塊執行語法加亮）

<!--
### Code blocks containing Hugo shortcodes

To show raw Hugo shortcodes as in the above example and prevent Hugo
from interpreting them, use C-style comments directly after the `<` and before
the `>` characters. The following example illustrates this (view the Markdown
source for this page).
-->
### 包含 Hugo 短程式碼的程式碼塊

如果要像上面的例子一樣顯示 Hugo 短程式碼（Shortcode），不希望 Hugo 將其當做短程式碼來處理，
可以在 `<` 和 `>` 之間使用 C 語言風格的註釋。
下面的示例展示如何實現這點（檢視本頁的 Markdown 原始碼）：

```none
{{</* codenew file="pods/storage/gce-volume.yaml" */>}}
```

<!--
## Links

To format a link, put the link text inside square brackets, followed by the
link target in parentheses. [Link to Kubernetes.io](https://kubernetes.io/) or
[Relative link to Kubernetes.io](/)

You can also use HTML, but it is not preferred.
<a href="https://kubernetes.io/">Link to Kubernetes.io</a>
-->
## 連結

要格式化連結，將連結顯示文字放在方括號中，後接用圓括號括起來的連結目標。
[指向 Kubernetes.io 的連線](https://kubernetes.io/) 或
[到 Kubernetes.io 的相對連結](/)。

你也可以使用 HTML，但這種方式不是推薦的方式。
<a href="https://kubernetes.io/">到 Kubernetes.io 的連結</a>。

### 中文連結

中文版本文件中的連結要注意以下兩點：

- 指向 Kubernetes 文件的站內連結，需要在英文連結之前新增字首 `/zh`。
  例如，原連結目標為 `/docs/foo/bar` 時，譯文中的連結目標應為
  `/zh-cn/docs/foo/bar`。例如：

  - 英文版本連結 [Kubernetes Components](/docs/concepts/overview/components/)
  - 對應中文連結 [Kubernetes 元件](/zh-cn/docs/concepts/overview/components/)

- 英文頁面子標題會生成對應錨點（Anchor），例如子標題 `## Using object` 會生成
  對應標籤 `#using-objects`。在翻譯為中文之後，對應錨點可能會失效。對此，有
  兩種方法處理。假定譯文中存在以下子標題：

  ```
  <!--
  ## Clean up

  You can do this ...
  -->
  ## 清理現場

  你可以這樣 ...
  ```

  並且在本頁或其他頁面有指向 `#clean-up` 的連結如下：

  ```
  ..., please refer to the [clean up](#clean-up) section.
  ```

  第一種處理方法是將連結改為中文錨點，即將引用該子標題的文字全部改為中文錨點。
  例如：
    
  ```
  ..., 請參考[清理工作](#清理現場)一節。
  ```

  第二種方式（也是推薦的方式）是將原來可能生成的錨點（儘管在英文原文中未明確
  給出）顯式標記在譯文的子標題上。

  ```
  <!--
  ## Clean up

  You can do this ...
  -->
  ## 清理現場  {#clean-up}

  你可以這樣 ...
  ```

  之所以優選第二種方式是因為可以避免文件站點中其他引用此子標題的連結失效。
   
<!--
## Images

To format an image, use similar syntax to [links](#links), but add a leading `!`
character. The square brackets contain the image's alt text. Try to always use
alt text so that people using screen readers can get some benefit from the
image.
-->
## 圖片

要顯示圖片，可以使用與連結類似的語法（`[links](#links)`），不過要在整個連結
之前新增一個感嘆號（`!`）。方括號中給出的是圖片的替代文字。
請堅持為圖片設定替代文字，這樣使用螢幕閱讀器的人也能夠了解圖片中包含的是什麼。

![pencil icon](/images/pencil.png)

<!--
To specify extended attributes, such as width, title, caption, etc, use the
<a href="https://gohugo.io/content-management/shortcodes/#figure">figure shortcode</a>,
which is preferred to using a HTML `<img>` tag. Also, if you need the image to
also be a hyperlink, use the `link` attribute, rather than wrapping the whole
figure in Markdown link syntax as shown below.
-->
要設定擴充套件的屬性，例如 width、title、caption 等等，可以使用
<a href="https://gohugo.io/content-management/shortcodes/#figure">figure</a>
短程式碼，而不是使用 HTML 的 `<img>` 標籤。
此外，如果你需要讓圖片本身變成超連結，可以使用短程式碼的 `link` 屬性，而不是
將整個圖片放到 Markdown 的連結語法之內。下面是一個例子：

<!--
{{</* figure src="/static/images/pencil.png" title="Pencil icon" caption="Image used to illustrate the figure shortcode" width="200px" */>}}
-->
{{< figure src="/images/pencil.png" title="鉛筆圖示" caption="用來展示 figure 短程式碼的圖片" width="200px" >}}

<!--
Even if you choose not to use the figure shortcode, an image can also be a link. This
time the pencil icon links to the Kubernetes website. Outer square brackets enclose
the entire image tag, and the link target is in the parentheses at the end.

[![pencil icon](/images/pencil.png)](https://kubernetes.io)

You can also use HTML for images, but it is not preferred.

<img src="/images/pencil.png" alt="pencil icon" />
-->
即使你不想使用 figure 短程式碼，圖片也可以展示為連結。這裡，鉛筆圖示指向
Kubernetes 網站。外層的方括號將整個 image 標籤封裝起來，連結目標在
末尾的圓括號之間給出。

[![pencil icon](/images/pencil.png)](https://kubernetes.io)

你也可以使用 HTML 來嵌入圖片，不過這種方式是不推薦的。

<img src="/images/pencil.png" alt="鉛筆圖示" />

<!--
## Tables

Simple tables have one row per line, and columns are separated by `|`
characters. The header is separated from the body by cells containing nothing
but at least three `-` characters. For ease of maintenance, try to keep all the
cell separators even, even if you heed to use extra space.
-->
## 表格

簡單的表格可能每行只有一個獨立的資料行，各個列之間用 `|` 隔開。
表格的標題行與表格內容之間用獨立的一行隔開，在這一行中每個單元格的內容
只有 `-` 字元，且至少三個。出於方便維護考慮，請嘗試將各個單元格間的
分割線對齊，儘管這樣意味著你需要多輸入幾個空格。

<!--
| Heading cell 1 | Heading cell 2 |
|----------------|----------------|
| Body cell 1    | Body cell 2    |
-->
| 標題單元格 1   | 標題單元格 2   |
|----------------|----------------|
| 內容單元格 1   | 內容單元格 2   |


<!--
The header is optional. Any text separated by `|` will render as a table.
-->
標題行是可選的。所有用 `|` 隔開的內容都會被渲染成表格。

<!--
Markdown tables have a hard time with block-level elements within cells, such as
list items, code blocks, or multiple paragraphs. For complex or very wide
tables, use HTML instead.
-->
Markdown 表格在處理塊級元素方面還很笨拙。例如在單元格中嵌入列表條目、程式碼段、
或者在其中劃分多個段落方面的能力都比較差。對於複雜的或者很寬的表格，可以使用
HTML。

<table>
<thead>
  <tr>
    <!-- th>Heading cell 1</th -->
    <th>標題單元格 1</th>
    <!-- th>Heading cell 2</th -->
    <th>標題單元格 2</th>
  </tr>
</thead>
<tbody>
  <tr>
    <!-- td>Body cell 1</td -->
    <td>內容單元格 1</td>
    <!-- td>Body cell 2</td -->
    <td>內容單元格 2</td>
  </tr>
</tbody>
</table>

<!--
## Visualizations with Mermaid

You can use [Mermaid JS](https://mermaidjs.github.io) visualizations.
The Mermaid JS version is specified in [/layouts/partials/head.html](https://github.com/kubernetes/website/blob/main/layouts/partials/head.html)
-->
## 使用 Mermaid 來視覺化

你可以使用 [Mermaid JS](https://mermaidjs.github.io) 來進行視覺化展示。
Mermaid JS 版本在 [/layouts/partials/head.html](https://github.com/kubernetes/website/blob/main/layouts/partials/head.html)
中設定。

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
會產生：

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
    張三 ->> 李四: 李四，鋤禾日當午？
    李四-->>王五: 王五，鋤禾日當午？
    李四--x 張三: 汗滴禾下土！
    李四-x 王五: 汗滴禾下土！
    Note right of 王五: 李四想啊想啊<br/>一直想啊想，太陽<br/>都下山了，他還沒想出來<br/>，文字框都放不下了。

    李四-->張三: 跑去問王五...
    張三->王五: 好吧... 王五，白日依山盡？
{{</*/ mermaid */>}}
```

<!--
Produces: 
-->
產生：

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
    張三 ->> 李四: 李四，鋤禾日當午？
    李四-->>王五: 王五，鋤禾日當午？
    李四--x 張三: 汗滴禾下土！
    李四-x 王五: 汗滴禾下土！
    Note right of 王五: 李四想啊想啊一直想，<br/>想到太陽都下山了，<br/>他還沒想出來，<br/>文字框都放不下了。

    李四-->張三: 跑去問王五...
    張三->王五: 好吧... 王五，白日依山盡？
{{</ mermaid >}}

<!--
<br>More [examples](https://mermaid-js.github.io/mermaid/#/examples) from the official docs.
-->
<br>在官方網站上有更多的[示例](https://mermaid-js.github.io/mermaid/#/examples)。

<!--
## Sidebars and Admonitions

Sidebars and admonitions provide ways to add visual importance to text. Use
them sparingly.
-->
## 側邊欄和提醒框

側邊欄和提醒框可以為文字提供直觀的重要性強調效果，可以偶爾一用。

<!--
### Sidebars

A sidebar offsets text visually, but without the visual prominence of
[admonitions](#admonitions).
-->
### 側邊欄（Sidebar）

側邊欄可以將文字橫向平移，只是其顯示效果可能不像[提醒](#admonitions)那麼明顯。

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
-->

> 此為側邊欄。
>
> 你可以在側邊欄內排版段落和塊級元素。
>
> 你甚至可以在其中包含程式碼塊。
>
> ```bash
> sudo dmesg
> ```
<!--
### Admonitions

Admonitions (notes, warnings, etc) use Hugo shortcodes.
-->
### 提醒框   {#admonitions}

提醒框（說明、警告等等）都是用 Hugo 短程式碼的形式展現。

<!--
{{< note >}}
Notes catch the reader's attention without a sense of urgency.

You can have multiple paragraphs and block-level elements inside an admonition.

| Or | a | table |
{{< /note >}}
-->
{{< note >}}
說明資訊用來引起讀者的注意，但不過分強調其緊迫性。

你可以在提醒框內包含多個段落和塊級元素。

| 甚至 | 包含 | 表格 |
{{< /note >}}

<!--
{{< caution >}}
The reader should proceed with caution.
{{< /caution >}}
-->
{{< caution >}}
讀者繼續此操作時要格外小心。
{{< /caution >}}

<!--
{{< warning >}}
Warnings point out something that could cause harm if ignored.
{{< /warning >}}
-->
{{< warning >}}
警告資訊試圖為讀者指出一些不應忽略的、可能引發問題的事情。
{{< /warning >}}

注意，在較老的 Hugo 版本中，直接將 `note`、`warning` 或 `caution` 短程式碼
括入 HTML 註釋當中是有問題的。這些短程式碼仍然會起作用。目前，在 0.70.0 
以上版本中似乎已經修復了這一問題。

<!--
## Includes

To add shortcodes to includes.
-->
## 包含其他頁面

要包含其他頁面，可使用短程式碼。

{{< note >}}
{{< include "task-tutorial-prereqs.md" >}}
{{< /note >}}

<!--
## Katacoda Embedded Live Environment
-->
## 嵌入的 Katacoda 環境

{{< kat-button >}}

