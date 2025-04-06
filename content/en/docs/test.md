---
शीर्षक: दस्तावेज़ धूम्रपान परीक्षण पृष्ठ
मुख्य_मेनू: गलत
---

यह पृष्ठ दो उद्देश्यों की पूर्ति करता है:

- दिखाएँ कि Kubernetes दस्तावेज़न Markdown का उपयोग कैसे करता है
- एक "स्मोक टेस्ट" दस्तावेज़ प्रदान करें जिसका उपयोग हम HTML, CSS और टेम्पलेट का परीक्षण करने के लिए कर सकते हैं
  परिवर्तन जो समग्र दस्तावेज़ीकरण को प्रभावित करते हैं।

## शीर्षक स्तर

उपरोक्त शीर्षक H2 है। पृष्ठ शीर्षक H1 के रूप में प्रस्तुत किया गया है। निम्नलिखित अनुभाग H3-H6 दिखाते हैं।

### H3

यह H3 अनुभाग में है।

#### H4

यह H4 अनुभाग में है।

##### H5

यह H5 अनुभाग में है।

###### H6

यह H6 अनुभाग में है।

## इनलाइन तत्व

इनलाइन तत्व पैराग्राफ, सूची आइटम, चेतावनी या किसी अन्य पाठ के भीतर दिखाई देते हैं।
अन्य ब्लॉक-स्तरीय तत्व.

लोरेम इप्सम डोलर सिट अमेट, कंसेक्टेचर एडिपिसिंग एलीट, सेड डू ईयूसमॉड टेम्पोर

यह काम करना और बहुत अच्छा काम करना है। यूट एनिम एड मिनिम वेनियम, क्विस

नोस्ट्रुड व्यायाम उल्लामको लेबोरिस निसी यूटी एलिक्विप एक्स ईए कमोडो कॉन्सक्वेट।

डुइस अउते इरुरे डोलोर इन रिप्रेहेंडरिट इन वोलुप्टेट वेलिट एस्से सिलम डोलोर ईयू

फुगियाट नल्ला पारियाटुर। एक्सेप्टेउर सिंट ओकैकैट क्यूपिडैटैट नॉन प्रोडेंट, सुंट इन

कल्पा क्वि ऑफिसिया डेसरुंट मोलिट एनिम आईडी इस्ट लेबोरम।

### Inline text styles

- **bold**
- _italic_
- **_bold italic_**
- ~~strikethrough~~
- <u>underline</u>
- _<u>underline italic</u>_
- **<u>underline bold</u>**
- **_<u>underline bold italic</u>_**
- `monospace text`
- **`monospace bold`**

## सूचियाँ

मार्कडाउन में सूचियों को संसाधित करने के बारे में सख्त नियम नहीं हैं। जब हम चले गए

जेकेल से लेकर ह्यूगो तक, हमने कुछ सूचियाँ तोड़ दीं। उन्हें ठीक करने के लिए, निम्नलिखित बातों का ध्यान रखें:

- सुनिश्चित करें कि आप उप-सूची आइटम को **2 स्पेस** से इंडेंट करें।

- किसी सूची को समाप्त करने और दूसरी सूची शुरू करने के लिए, आपको एक नई पंक्ति पर HTML टिप्पणी ब्लॉक की आवश्यकता होगी

  सूचियों के बीच, बाएं हाथ की सीमा के साथ फ्लश। पहली सूची समाप्त नहीं होगी

  अन्यथा, इससे कोई फर्क नहीं पड़ता कि आप इसके और दूसरे के बीच कितनी रिक्त पंक्तियाँ डालते हैं।

### बुलेट सूचियाँ

    यह एक सूची आइटम है।

- यह उसी सूची में एक और सूची आइटम है।

* आप `-` और `*` को मिला सकते हैं।
* उप-आइटम बनाने के लिए, दो रिक्त स्थान इंडेंट करें।
* यह एक उप-उप-आइटम है। दो और रिक्त स्थान इंडेंट करें।
* एक और उप-आइटम।

<!-- अलग सूचियाँ -->

- This is a new list. With Hugo, you need to use a HTML comment to separate two
  consecutive lists. **The HTML comment needs to be at the left margin.**
- Bullet lists can have paragraphs or block elements within them.

  Indent the content to be the same as the first line of the bullet point.
  **This paragraph and the code block line up with the first `B` in `Bullet`
  above.**

  ```bash
  ls -l
  ```

  - And a sub-list after some block-level content

- A bullet list item can contain a numbered list.
  1. Numbered sub-list item 1
  1. Numbered sub-list item 2

### Numbered lists

1. This is a list item
1. This is another list item in the same list. The number you use in Markdown
   does not necessarily correlate to the number in the final output. By
   convention, we keep them in sync.

{{<note>}}
For single-digit numbered lists, using two spaces after the period makes
interior block-level content line up better along tab-stops.
{{</note>}}

<!-- separate lists -->

1. This is a new list. With Hugo, you need to use an HTML comment to separate
   two consecutive lists. **The HTML comment needs to be at the left margin.**
1. Numbered lists can have paragraphs or block elements within them.

   Indent the content to be the same as the first line of the bullet
   point. **This paragraph and the code block line up with the `N` in
   `Numbered` above.**

   ```bash
   ls -l
   ```

   - And a sub-list after some block-level content. This is at the same
     "level" as the paragraph and code block above, despite being indented
     more.

### Tab lists

Tab lists can be used to conditionally display content, e.g., when multiple
options must be documented that require distinct instructions or context.

{{< tabs name="tab_lists_example" >}}
{{% tab name="Choose one..." %}}
Please select an option.
{{% /tab %}}
{{% tab name="Formatting tab lists" %}}

Tabs may also nest formatting styles.

1. Ordered
1. (Or unordered)
1. Lists

```bash
echo 'Tab lists may contain code blocks!'
```

{{% /tab %}}
{{% tab name="Nested headers" %}}

### Header within a tab list

Nested header tags may also be included.

{{< warning >}}
Headers within tab lists will not appear in the Table of Contents.
{{< /warning >}}

{{% /tab %}}
{{< /tabs >}}

### Checklists

Checklists are technically bullet lists, but the bullets are suppressed by CSS.

- [ ] This is a checklist item
- [x] This is a selected checklist item

## Code blocks

You can create code blocks two different ways by surrounding the code block with
three back-tick characters on lines before and after the code block. **Only use
back-ticks (code fences) for code blocks.** This allows you to specify the
language of the enclosed code, which enables syntax highlighting. It is also more
predictable than using indentation.

```
this is a code block created by back-ticks
```

The back-tick method has some advantages.

- It works nearly every time
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

Common languages used in Kubernetes documentation code blocks include:

- `bash` / `shell` (both work the same)
- `go`
- `json`
- `yaml`
- `xml`
- `none` (disables syntax highlighting for the block)

### Code blocks containing Hugo shortcodes

To show raw Hugo shortcodes as in the above example and prevent Hugo
from interpreting them, use C-style comments directly after the `<` and before
the `>` characters. The following example illustrates this (view the Markdown
source for this page).

```none
{{</* alert color="warning" >}}This is a warning.{{< /alert */>}}
```

## Links

To format a link, put the link text inside square brackets, followed by the
link target in parentheses.

- `[Link to Kubernetes.io](https://kubernetes.io/)` or
- `[Relative link to Kubernetes.io](/)`

You can also use HTML, but it is not preferred.
For example, `<a href="https://kubernetes.io/">Link to Kubernetes.io</a>`.

## Images

To format an image, use similar syntax to [links](#links), but add a leading `!`
character. The square brackets contain the image's alt text. Try to always use
alt text so that people using screen readers can get some benefit from the
image.

![pencil icon](/images/pencil.png)

To specify extended attributes, such as width, title, caption, etc, use the
<a href="https://gohugo.io/content-management/shortcodes/#figure">figure shortcode</a>,
which is preferred to using a HTML `<img>` tag. Also, if you need the image to
also be a hyperlink, use the `link` attribute, rather than wrapping the whole
figure in Markdown link syntax as shown below.

{{< figure src="/images/pencil.png" title="Pencil icon" caption="Image used to illustrate the figure shortcode" width="200px" >}}

Even if you choose not to use the figure shortcode, an image can also be a link. This
time the pencil icon links to the Kubernetes website. Outer square brackets enclose
the entire image tag, and the link target is in the parentheses at the end.

[![pencil icon](/images/pencil.png)](https://kubernetes.io)

You can also use HTML for images, but it is not preferred.

<img src="/images/pencil.png" alt="pencil icon" />

## Tables

Simple tables have one row per line, and columns are separated by `|`
characters. The header is separated from the body by cells containing nothing
but at least three `-` characters. For ease of maintenance, try to keep all the
cell separators even, even if you heed to use extra space.

| Heading cell 1 | Heading cell 2 |
| -------------- | -------------- |
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

## Visualizations with Mermaid

You can use [Mermaid JS](https://mermaidjs.github.io) visualizations.
The Mermaid JS version is specified in [/layouts/partials/head.html](https://github.com/kubernetes/website/blob/main/layouts/partials/head.html)

```
{{</* mermaid */>}}
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
{{</*/ mermaid */>}}
```

Produces:

{{< mermaid >}}
graph TD;
A-->B;
A-->C;
B-->D;
C-->D;
{{</ mermaid >}}

```
{{</* mermaid */>}}
sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?
{{</*/ mermaid */>}}
```

Produces:

{{< mermaid >}}
sequenceDiagram
Alice ->> Bob: Hello Bob, how are you?
Bob-->>John: How about you John?
Bob--x Alice: I am good thanks!
Bob-x John: I am good thanks!
Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?

{{</ mermaid >}}

You can check more [examples](https://mermaid-js.github.io/mermaid/#/examples) from the official docs.

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

### Admonitions

Admonitions (notes, warnings, etc) use Hugo shortcodes.

{{< note >}}
Notes catch the reader's attention without a sense of urgency.

You can have multiple paragraphs and block-level elements inside an admonition.

| Or | a | table |
{{< /note >}}

{{< caution >}}
The reader should proceed with caution.
{{< /caution >}}

{{< warning >}}
Warnings point out something that could cause harm if ignored.
{{< /warning >}}

## Includes

To add shortcodes to includes.

{{< note >}}
{{< include "task-tutorial-prereqs.md" >}}
{{< /note >}}

## Katacoda Embedded Live Environment

{{< kat-button >}}
