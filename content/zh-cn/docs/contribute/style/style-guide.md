---
title: 文档样式指南
linktitle: 样式指南
content_type: concept
weight: 40
---
<!--
title: Documentation Style Guide
linktitle: Style guide
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
This page gives writing style guidelines for the Kubernetes documentation.
These are guidelines, not rules. Use your best judgment, and feel free to
propose changes to this document in a pull request.

For additional information on creating new content for the Kubernetes
documentation, read the [Documentation Content Guide](/docs/contribute/style/content-guide/).

Changes to the style guide are made by SIG Docs as a group. To propose a change
or addition, [add it to the agenda](https://bit.ly/sig-docs-agenda) for an upcoming
SIG Docs meeting, and attend the meeting to participate in the discussion.
-->
本页讨论 Kubernetes 文档的样式指南。
这些仅仅是指南而不是规则。
你可以自行决定，且欢迎使用 PR 来为此文档提供修改意见。

关于为 Kubernetes 文档贡献新内容的更多信息，
可以参考[文档内容指南](/zh-cn/docs/contribute/style/content-guide/)。

样式指南的变更是 SIG Docs 团队集体决定。
如要提议更改或新增条目，请先将其添加到下一次 SIG Docs
例会的[议程表](https://bit.ly/sig-docs-agenda)上，并按时参加会议讨论。

<!-- body -->

{{< note >}}
<!--
Kubernetes documentation uses
[Goldmark Markdown Renderer](https://github.com/yuin/goldmark)
with some adjustments along with a few
[Hugo Shortcodes](/docs/contribute/style/hugo-shortcodes/) to support
glossary entries, tabs, and representing feature state.
-->
Kubernetes 文档使用带调整的 [Goldmark Markdown 解释器](https://github.com/yuin/goldmark/)
和一些 [Hugo 短代码](/zh-cn/docs/contribute/style/hugo-shortcodes/)来支持词汇表项、Tab
页以及特性门控标注。
{{< /note >}}

<!--
## Language

Kubernetes documentation has been translated into multiple languages
(see [Localization READMEs](https://github.com/kubernetes/website/blob/main/README.md#localization-readmemds)).

The way of localizing the docs for a different language is described in [Localizing Kubernetes Documentation](/docs/contribute/localization/).

The English-language documentation uses U.S. English spelling and grammar.

{{< comment >}}[If you're localizing this page, you can omit the point about US English.]{{< /comment >}}
-->
## 语言 {#language}

Kubernetes 文档已经被翻译为多个语种
（参见 [本地化 README](https://github.com/kubernetes/website/blob/main/README.md#localization-readmemds)）。

[本地化 Kubernetes 文档](/zh-cn/docs/contribute/localization/)描述了如何为一种新的语言提供本地化文档。

英语文档使用美国英语的拼写和语法。

{{< comment >}}[如果你在翻译本页面，你可以忽略关于美国英语的这一条。]{{< /comment >}}

<!--
## Documentation formatting standards

### Use upper camel case for API objects

When you refer specifically to interacting with an API object, use
[UpperCamelCase](https://en.wikipedia.org/wiki/Camel_case), also known as
Pascal case. You may see different capitalization, such as "configMap",
in the [API Reference](/docs/reference/kubernetes-api/). When writing
general documentation, it's better to use upper camel case, calling it "ConfigMap" instead.

When you are generally discussing an API object, use
[sentence-style capitalization](https://docs.microsoft.com/en-us/style-guide/text-formatting/using-type/use-sentence-style-capitalization).

The following examples focus on capitalization. For more information about formatting
API object names, review the related guidance on [Code Style](#code-style-inline-code).
-->
## 文档格式标准 {#documentation-formatting-standards}

### 对 API 对象使用大写驼峰式命名法  {#use-upper-camel-case-for-api-objects}

当你与指定的 API 对象进行交互时，
使用[大写驼峰式命名法](https://zh.wikipedia.org/wiki/%E9%A7%9D%E5%B3%B0%E5%BC%8F%E5%A4%A7%E5%B0%8F%E5%AF%AB)，
也被称为帕斯卡拼写法（PascalCase）。
你可以在 [API 参考](/zh-cn/docs/reference/kubernetes-api/)中看到不同的大小写形式，例如 "configMap"。
在编写通用文档时，最好使用大写驼峰形式，将之称作 "ConfigMap"。

通常在讨论 API 对象时，使用
[句子式大写](https://docs.microsoft.com/en-us/style-guide/text-formatting/using-type/use-sentence-style-capitalization)。

下面的例子关注的是大小写问题。关于如何格式化 API 对象名称的更多信息，
可参考相关的[代码风格](#code-style-inline-code)指南。

<!--
{{< table caption = "Do and Don't - Use Pascal case for API objects" >}}
Do | Don't
:--| :-----
The HorizontalPodAutoscaler resource is responsible for ... | The Horizontal pod autoscaler is responsible for ...
A PodList object is a list of pods. | A Pod List object is a list of pods.
The Volume object contains a `hostPath` field. | The volume object contains a hostPath field.
Every ConfigMap object is part of a namespace. | Every configMap object is part of a namespace.
For managing confidential data, consider using the Secret API. | For managing confidential data, consider using the secret API.
{{< /table >}}
-->
{{< table caption = "使用 Pascal 风格大小写来给出 API 对象的约定" >}}
可以 | 不可以
:--| :-----
该 HorizontalPodAutoscaler 负责... | 该 Horizontal pod autoscaler 负责...
每个 PodList 是一个 Pod 组成的列表。 | 每个 Pod List 是一个由 Pod 组成的列表。
该 Volume 对象包含一个 `hostPath` 字段。 | 此卷对象包含一个 hostPath 字段。
每个 ConfigMap 对象都是某个名字空间的一部分。| 每个 configMap 对象是某个名字空间的一部分。
要管理机密数据，可以考虑使用 Secret API。 | 要管理机密数据，可以考虑使用秘密 API。
{{< /table >}}

<!--
### Use angle brackets for placeholders

Use angle brackets for placeholders. Tell the reader what a placeholder
represents, for example:

Display information about a pod:

```shell
kubectl describe pod <pod-name> -n <namespace>
```

If the namespace of the pod is `default`, you can omit the '-n' parameter.
-->
### 在占位符中使用尖括号

用尖括号表示占位符，让读者知道占位符表示的是什么。例如：

显示有关 Pod 的信息：

```shell
kubectl describe pod <Pod 名称> -n <名字空间>
```

如果名字空间被忽略，默认为 `default`，你可以省略 '-n' 参数。

<!--
### Use bold for user interface elements

{{< table caption = "Do and Don't - Bold interface elements" >}}
Do | Don't
:--| :-----
Click **Fork**. | Click "Fork".
Select **Other**. | Select "Other".
{{< /table >}}
-->
### 用粗体字表现用户界面元素

{{< table caption = "以粗体表示用户界面元素" >}}
可以 | 不可以
:--| :-----
点击 **Fork**。 | 点击 "Fork"。
选择 **Other**。 | 选择 "Other"。
{{< /table >}}

<!--
### Use italics to define or introduce new terms

{{< table caption = "Do and Don't - Use italics for new terms" >}}
Do | Don't
:--| :-----
A _cluster_ is a set of nodes ... | A "cluster" is a set of nodes ...
These components form the _control plane_. | These components form the **control plane**.
{{< /table >}}
-->
### 定义或引入新术语时使用斜体

{{< table caption = "新术语约定" >}}
可以 | 不可以
:--| :-----
每个 _集群_  是一组节点 ... | 每个“集群”是一组节点 ...
这些组件构成了 _控制面_。 | 这些组件构成了 **控制面**。
{{< /table >}}

{{< note >}}
注意：这一条不适用于中文本地化，中文本地化过程中通常将英文斜体改为粗体。
{{< /note >}}

<!--
### Use code style for filenames, directories, and paths

{{< table caption = "Do and Don't - Use code style for filenames, directories, and paths" >}}
Do | Don't
:--| :-----
Open the `envars.yaml` file. | Open the envars.yaml file.
Go to the `/docs/tutorials` directory. | Go to the /docs/tutorials directory.
Open the `/_data/concepts.yaml` file. | Open the /\_data/concepts.yaml file.
{{< /table >}}
-->
### 使用代码样式表现文件名、目录和路径

{{< table caption = "文件名、目录和路径约定" >}}
可以 | 不可以
:--| :-----
打开 `envars.yaml` 文件 | 打开 envars.yaml 文件
进入到 `/docs/tutorials` 目录 | 进入到 /docs/tutorials 目录
打开 `/_data/concepts.yaml` 文件 | 打开 /\_data/concepts.yaml 文件
{{< /table >}}

<!--
### Use the international standard for punctuation inside quotes

{{< table caption = "Do and Don't - Use the international standard for punctuation inside quotes" >}}
Do | Don't
:--| :-----
events are recorded with an associated "stage". | events are recorded with an associated "stage."
The copy is called a "fork". | The copy is called a "fork."
{{< /table >}}
-->
### 在引号内使用国际标准标点

{{< table caption = "标点符号约定" >}}
可以 | 不可以
:--| :-----
事件记录中都包含对应的“stage”。 | 事件记录中都包含对应的“stage。”
此副本称作一个“fork”。| 此副本称作一个“fork。”
{{< /table >}}

<!--
## Inline code formatting

### Use code style for inline code, commands {#code-style-inline-code}

For inline code in an HTML document, use the `<code>` tag. In a Markdown
document, use the backtick (`` ` ``). However, API kinds such as StatefulSet
or ConfigMap are written verbatim (no backticks); this allows using possessive
apostrophes.
-->
## 行间代码格式    {#inline-code-formatting}

### 为行间代码、命令使用代码样式  {#code-style-inline-code}

对于 HTML 文档中的行间代码，使用 `<code>` 标记。在 Markdown 文档中，使用反引号（`` ` ``）。
然而，StatefulSet 或 ConfigMap 这些 API 类别是直接书写的（不用反引号）；这样允许使用表示所有格的撇号。

<!--
{{< table caption = "Do and Don't - Use code style for inline code, commands, and API objects" >}}
Do | Don't
:--| :-----
The `kubectl run` command creates a Pod. | The "kubectl run" command creates a Pod.
The kubelet on each node acquires a Lease… | The kubelet on each node acquires a `Lease`…
A PersistentVolume represents durable storage… | A `PersistentVolume` represents durable storage…
The CustomResourceDefinition's `.spec.group` field… | The `CustomResourceDefinition.spec.group` field…
For declarative management, use `kubectl apply`. | For declarative management, use "kubectl apply".
Enclose code samples with triple backticks. (\`\`\`)| Enclose code samples with any other syntax.
Use single backticks to enclose inline code. For example, `var example = true`. | Use two asterisks (`**`) or an underscore (`_`) to enclose inline code. For example, **var example = true**.
Use triple backticks before and after a multi-line block of code for fenced code blocks. | Use multi-line blocks of code to create diagrams, flowcharts, or other illustrations.
Use meaningful variable names that have a context. | Use variable names such as 'foo','bar', and 'baz' that are not meaningful and lack context.
Remove trailing spaces in the code. | Add trailing spaces in the code, where these are important, because the screen reader will read out the spaces as well.
{{< /table >}}
-->
{{< table caption = "行间代码、命令和 API 对象约定" >}}
可以 | 不可以
:--| :-----
`kubectl run` 命令会创建一个 Pod。 | "kubectl run" 命令会创建一个 Pod。
每个节点上的 kubelet 都会获得一个 Lease… | 每个节点上的 kubelet 都会获得一个 `Lease`…
一个 PersistentVolume 代表持久存储… | 一个 `PersistentVolume` 代表持久存储…
CustomResourceDefinition 的 `.spec.group` 字段… | `CustomResourceDefinition.spec.group` 字段…
在声明式管理中，使用 `kubectl apply`。 | 在声明式管理中，使用 "kubectl apply"。
用三个反引号来（\`\`\`）标示代码示例 | 用其他语法来标示代码示例。
使用单个反引号来标示行间代码。例如：`var example = true`。 | 使用两个星号（`**`）或者一个下划线（`_`）来标示行间代码。例如：**var example = true**。
在多行代码块之前和之后使用三个反引号标示隔离的代码块。 | 使用多行代码块来创建示意图、流程图或者其他表示。
使用符合上下文的有意义的变量名。 | 使用诸如 'foo'、'bar' 和 'baz' 这类无意义且无语境的变量名。
删除代码中行尾空白。 | 在代码中包含行尾空白，因为屏幕抓取工具通常也会抓取空白字符。
{{< /table >}}

{{< note >}}
<!--
The website supports syntax highlighting for code samples, but specifying a language
is optional. Syntax highlighting in the code block should conform to the
[contrast guidelines.](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0&showtechniques=141%2C143#contrast-minimum)
-->
网站支持为代码示例使用语法加亮，不过指定语法加亮是可选的。
代码段的语法加亮要遵从[对比度指南](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0&showtechniques=141%2C143#contrast-minimum)
{{< /note >}}

<!--
### Use code style for object field names and namespaces

{{< table caption = "Do and Don't - Use code style for object field names" >}}
Do | Don't
:--| :-----
Set the value of the `replicas` field in the configuration file. | Set the value of the "replicas" field in the configuration file.
The value of the `exec` field is an ExecAction object. | The value of the "exec" field is an ExecAction object.
Run the process as a DaemonSet in the `kube-system` namespace. | Run the process as a DaemonSet in the kube-system namespace.
{{< /table >}}
-->
### 为对象字段名和名字空间使用代码风格

{{< table caption = "对象字段名约定" >}}
可以 | 不可以
:--| :-----
在配置文件中设置 `replicas` 字段的值。 | 在配置文件中设置 "replicas" 字段的值。
`exec` 字段的值是一个 ExecAction 对象。 | "exec" 字段的值是一个 ExecAction 对象。
在 `kube-system` 名字空间中以 DaemonSet 形式运行此进程。 | 在 kube-system 名字空间中以 DaemonSet 形式运行此进程。
{{< /table >}}

<!--
### Use code style for Kubernetes command tool and component names

{{< table caption = "Do and Don't - Use code style for Kubernetes command tool and component names" >}}
Do | Don't
:--| :-----
The `kubelet` preserves node stability. | The `kubelet` preserves node stability.
The `kubectl` handles locating and authenticating to the API server. | The kubectl handles locating and authenticating to the apiserver.
Run the process with the certificate, `kube-apiserver --client-ca-file=FILENAME`. | Run the process with the certificate, kube-apiserver --client-ca-file=FILENAME. |
{{< /table >}}
-->
### 用代码样式书写 Kubernetes 命令工具和组件名

{{< table caption = "Kubernetes 命令工具和组件名" >}}
可以 | 不可以
:--| :-----
`kubelet` 维持节点稳定性。 | kubelet 负责维护节点稳定性。
`kubectl` 处理 API 服务器的定位和身份认证。| kubectl 处理 API 服务器的定位和身份认证。
使用该证书运行进程 `kube-apiserver --client-ca-file=FILENAME`。| 使用证书运行进程 kube-apiserver --client-ca-file=FILENAME。|
{{< /table >}}

<!--
### Starting a sentence with a component tool or component name

{{< table caption = "Do and Don't - Starting a sentence with a component tool or component name" >}}
Do | Don't
:--| :-----
The `kubeadm` tool bootstraps and provisions machines in a cluster. | `kubeadm` tool bootstraps and provisions machines in a cluster.
The kube-scheduler is the default scheduler for Kubernetes. | kube-scheduler is the default scheduler for Kubernetes.
{{< /table >}}
-->
### 用工具或组件名称开始一句话

{{< table caption = "工具或组件名称使用约定" >}}
可以 | 不可以
:--| :-----
The `kubeadm` tool bootstraps and provisions machines in a cluster. | `kubeadm` tool bootstraps and provisions machines in a cluster.
The kube-scheduler is the default scheduler for Kubernetes. | kube-scheduler is the default scheduler for Kubernetes.
{{< /table >}}

<!--
### Use a general descriptor over a component name

{{< table caption = "Do and Don't - Use a general descriptor over a component name" >}}
Do | Don't
:--| :-----
The Kubernetes API server offers an OpenAPI spec. | The apiserver offers an OpenAPI spec.
Aggregated APIs are subordinate API servers. | Aggregated APIs are subordinate APIServers.
{{< /table >}}
-->
### 尽量使用通用描述而不是组件名称

{{< table caption = "组件名称与通用描述" >}}
可以 | 不可以
:--| :-----
Kubernetes API 服务器提供 OpenAPI 规范。| apiserver 提供 OpenAPI 规范。
聚合 API 是下级 API 服务器。 | 聚合 API 是下级 APIServer。
{{< /table >}}

<!--
### Use normal style for string and integer field values

For field values of type string or integer, use normal style without quotation marks.

{{< table caption = "Do and Don't - Use normal style for string and integer field values" >}}
Do | Don't
:--| :-----
Set the value of `imagePullPolicy` to Always. | Set the value of `imagePullPolicy` to "Always".
Set the value of `image` to nginx:1.16. | Set the value of `image` to `nginx:1.16`.
Set the value of the `replicas` field to 2. | Set the value of the `replicas` field to `2`.
{{< /table >}}
-->
### 使用普通样式表达字符串和整数字段值

对于字符串或整数，使用正常样式，不要带引号。

{{< table caption = "字符串和整数字段值约定" >}}
可以 | 不可以
:--| :-----
将 `imagePullPolicy` 设置为 Always。 | 将 `imagePullPolicy` 设置为 "Always"。
将 `image` 设置为 nginx:1.16。 | 将 `image` 设置为 `nginx:1.16`。
将 `replicas` 字段值设置为 2。 | 将 `replicas` 字段值设置为 `2`。
{{< /table >}}

<!--
However, consider quoting values where there is a risk that readers might confuse the value
with an API kind.
-->
然而，在读者可能会将某些值与 API 类别混淆时，请考虑为这些值添加引号。

<!--
## Referring to Kubernetes API resources

This section talks about how we reference API resources in the documentation.

### Clarification about "resource"

Kubernetes uses the word _resource_ to refer to API resources. For example,
the URL path `/apis/apps/v1/namespaces/default/deployments/my-app` represents a
Deployment named "my-app" in the "default"
{{< glossary_tooltip text="namespace" term_id="namespace" >}}. In HTTP jargon,
{{< glossary_tooltip text="namespace" term_id="namespace" >}} is a resource -
the same way that all web URLs identify a resource.
-->
## 引用 Kubernetes API 资源   {#referring-to-kubernetes-api-resources}

本节讨论我们如何在文档中引用 API 资源。

### 有关 “资源” 的阐述

Kubernetes 使用单词 _resource_ 一词来指代 API 资源。
例如，URL 路径 `/apis/apps/v1/namespaces/default/deployments/my-app` 表示 "default"
{{< glossary_tooltip text="名字空间" term_id="namespace" >}}中名为 "my-app" 的 Deployment。
在 HTTP 的术语中，{{< glossary_tooltip text="名字空间" term_id="namespace" >}}是一个资源，
就像所有 Web URL 都标识一个资源。

<!--
Kubernetes documentation also uses "resource" to talk about CPU and memory
requests and limits. It's very often a good idea to refer to API resources
as "API resources"; that helps to avoid confusion with CPU and memory resources,
or with other kinds of resource.
-->
Kubernetes 文档在讨论 CPU 和内存请求以及限制也使用“资源（resource）”一词。
将 API 资源称为 "API 资源" 往往是一个好的做法；这有助于避免与 CPU 和内存资源或其他类别的资源混淆。

<!--
If you are using the lowercase plural form of a resource name, such as
`deployments` or `configmaps`, provide extra written context to help readers
understand what you mean. If you are using the term in a context where the
UpperCamelCase name could work too, and there is a risk of ambiguity,
consider using the API kind in UpperCamelCase.
-->
如果你使用资源名称的小写复数形式，例如 `deployments` 或 `configmaps`，
请提供额外的书面上下文来帮助读者理解你的用意。
如果你使用术语时所处的上下文中使用驼峰编码（UpperCamelCase）的名称也可行，且术语存在歧义的风险，
应该考虑使用 UpperCamelCase 形式的 API 类别。

<!--
### When to use Kubernetes API terminologies

The different Kubernetes API terminologies are:

- _API kinds_: the name used in the API URL (such as `pods`, `namespaces`).
  API kinds are sometimes also called _resource types_.
- _API resource_: a single instance of an API kind (such as `pod`, `secret`).
- _Object_: a resource that serves as a "record of intent". An object is a desired
  state for a specific part of your cluster, which the Kubernetes control plane tries to maintain.
  All objects in the Kubernetes API are also resources.
-->
### 何时使用 Kubernetes API 术语

不同 Kubernetes API 术语的说明如下：

- **API 类别** ：API URL 中使用的名称（如 `pods`、`namespaces`）。
  API 类别有时也称为 **资源类型** 。
- **API 资源** ：API 类别的单个实例（如 `pod`、`secret`）
- **对象** ：作为 “意向记录” 的资源。对象是集群特定部分的期望状态，
  该状态由 Kubernetes 控制平面负责维护。
  Kubernetes API 中的所有对象也都是资源。

<!--
For clarity, you can add "resource" or "object" when referring to an API resource in Kubernetes
documentation.
An example: write "a Secret object" instead of "a Secret".
If it is clear just from the capitalization, you don't need to add the extra word.

Consider rephrasing when that change helps avoid misunderstandings. A common situation is
when you want to start a sentence with an API kind, such as “Secret”; because English
and other languages capitalize at the start of sentences, readers cannot tell whether you
mean the API kind or the general concept. Rewording can help.
-->
为了清晰起见，在 Kubernetes 文档中引用 API 资源时可以使用 "资源" 或 "对象"。
例如：写成 "Secret 对象" 而不是 "Secret"。
如果仅大写就能明确含义，那么无需添加额外的单词。

当修改有助于避免误解时，那就考虑修改表述。
一个常见的情况是当你想要某个句子以 "Secret" 这种 API 类别开头时；
因为英语和其他几种语言会对句首的第一个字母大写，所以读者无法确定你说的是 API 类别还是一般概念。
此时重新构词有助于让句子更清晰。

<!--
### API resource names

Always format API resource names using [UpperCamelCase](https://en.wikipedia.org/wiki/Camel_case),
also known as PascalCase. Do not write API kinds with code formatting.

Don't split an API object name into separate words. For example, use PodTemplateList, not Pod Template List.

For more information about PascalCase and code formatting, review the related guidance on
[Use upper camel case for API objects](/docs/contribute/style/style-guide/#use-upper-camel-case-for-api-objects)
and [Use code style for inline code, commands, and API objects](/docs/contribute/style/style-guide/#code-style-inline-code).

For more information about Kubernetes API terminologies, review the related
guidance on [Kubernetes API terminology](/docs/reference/using-api/api-concepts/#standard-api-terminology).
-->
### API 资源名称

始终使用[大写驼峰式命名法](https://zh.wikipedia.org/wiki/%E9%A7%9D%E5%B3%B0%E5%BC%8F%E5%A4%A7%E5%B0%8F%E5%AF%AB)
（也称为 PascalCase）来表达 API 资源名称。不要使用代码格式书写 API 类别。

不要将 API 对象的名称切分成多个单词。
例如请使用 PodTemplateList 而非 Pod Template List。

有关 PascalCase 和代码格式的更多信息，
请查看[对 API 对象使用大写驼峰式命名法](/zh-cn/docs/contribute/style/style-guide/#use-upper-camel-case-for-api-objects)
和[针对内嵌代码、命令与 API 对象使用代码样式](/zh-cn/docs/contribute/style/style-guide/#code-style-inline-code)。

有关 Kubernetes API 术语的更多信息，
请查看 [Kubernetes API 术语](/zh-cn/docs/reference/using-api/api-concepts/#standard-api-terminology)的相关指南。

<!--
## Code snippet formatting

### Don't include the command prompt

{{< table caption = "Do and Don't - Don't include the command prompt" >}}
Do | Don't
:--| :-----
`kubectl get pods` | `$ kubectl get pods`
{{< /table >}}
-->
## 代码段格式   {#code-snippet-formatting}

### 不要包含命令行提示符   {#do-not-include-the-command-promot}

{{< table caption = "命令行提示符约定" >}}
可以 | 不可以
:--| :-----
`kubectl get pods` | `$ kubectl get pods`
{{< /table >}}

<!--
### Separate commands from output

Verify that the pod is running on your chosen node:

```shell
kubectl get pods --output=wide
```

The output is similar to this:

```console
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```
-->
### 将命令和输出分开   {#separate-commands-from-output}

例如：

验证 Pod 已经在你所选的节点上运行：

```shell
kubectl get pods --output=wide
```

输出类似于：

```console
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

<!--
### Versioning Kubernetes examples

Code examples and configuration examples that include version information should
be consistent with the accompanying text.

If the information is version specific, the Kubernetes version needs to be defined
in the `prerequisites` section of the [Task template](/docs/contribute/style/page-content-types/#task)
or the [Tutorial template](/docs/contribute/style/page-content-types/#tutorial).
Once the page is saved, the `prerequisites` section is shown as **Before you begin**.

To specify the Kubernetes version for a task or tutorial page, include
`min-kubernetes-server-version` in the front matter of the page.
-->
### 为 Kubernetes 示例给出版本   {#versioning-kubernetes-examples}

代码示例或者配置示例如果包含版本信息，应该与对应的文字描述一致。

如果所给的信息是特定于具体版本的，需要在
[任务模板](/zh-cn/docs/contribute/style/page-content-types/#task)
或[教程模板](/zh-cn/docs/contribute/style/page-content-types/#tutorial)
的 `prerequisites` 小节定义 Kubernetes 版本。
页面保存之后，`prerequisites` 小节会显示为**开始之前**。

如果要为任务或教程页面指定 Kubernetes 版本，可以在文件的前言部分包含
`min-kubernetes-server-version` 信息。

<!--
If the example YAML is in a standalone file, find and review the topics that
include it as a reference.  Verify that any topics using the standalone YAML
have the appropriate version information defined.  If a stand-alone YAML file
is not referenced from any topics, consider deleting it instead of updating
it.

For example, if you are writing a tutorial that is relevant to Kubernetes
version 1.8, the front-matter of your markdown file should look something
like:
-->
如果示例 YAML 是一个独立文件，找到并审查包含该文件的主题页面。
确认使用该独立 YAML 文件的主题都定义了合适的版本信息。
如果独立的 YAML 文件没有在任何主题中引用，可以考虑删除该文件，
而不是继续更新它。

例如，如果你在编写一个教程，与 Kubernetes 1.8 版本相关。那么你的 Markdown
文件的文件头应该开始起来像这样：

<!--
```yaml
---
title: <your tutorial title here>
min-kubernetes-server-version: v1.8
---
```
-->
```yaml
---
title: <教程标题>
min-kubernetes-server-version: v1.8
---
```

<!--
In code and configuration examples, do not include comments about alternative versions.
Be careful to not include incorrect statements in your examples as comments, such as:

```yaml
apiVersion: v1 # earlier versions use...
kind: Pod
...
```
-->
在代码和配置示例中，不要包含其他版本的注释信息。
尤其要小心不要在示例中包含不正确的注释信息，例如：

```yaml
apiVersion: v1 # 早期版本使用...
kind: Pod
...
```
<!--
## Kubernetes.io word list

A list of Kubernetes-specific terms and words to be used consistently across the site.

{{< table caption = "Kubernetes.io word list" >}}
Term | Usage
:--- | :----
Kubernetes | Kubernetes should always be capitalized.
Docker | Docker should always be capitalized.
SIG Docs | SIG Docs rather than SIG-DOCS or other variations.
On-premises | On-premises or On-prem rather than On-premise or other variations.
cloud native | Cloud native or cloud native as appropriate for sentence structure rather than cloud-native or Cloud Native.
open source | Open source or open source as appropriate for sentence structure rather than open-source or Open Source.
{{< /table >}}
-->
## Kubernetes.io 术语列表   {#kubernetes-io-word-list}

以下特定于 Kubernetes 的术语和词汇在使用时要保持一致性。

{{< table caption = "Kubernetes.io 词汇表" >}}
术语 | 用法
:--- | :----
Kubernetes | Kubernetes 的首字母要保持大写。
Docker | Docker 的首字母要保持大写。
SIG Docs | SIG Docs 是正确拼写形式，不要用 SIG-DOCS 或其他变体。
On-premises | On-premises 或 On-prem 而不是 On-premise 或其他变体。
cloud native | Cloud native 或 cloud native 适合句子结构，而不是 cloud-native 或 Cloud Native。
open source | Open source 或 open source 适合句子结构，而不是 open-source 或 Open Source。
{{< /table >}}

<!--
## Shortcodes

Hugo [Shortcodes](https://gohugo.io/content-management/shortcodes) help create
different rhetorical appeal levels. Our documentation supports three different
shortcodes in this category: **Note** `{{</* note */>}}`,
**Caution** `{{</* caution */>}}`, and **Warning** `{{</* warning */>}}`.

1. Surround the text with an opening and closing shortcode.

2. Use the following syntax to apply a style:

   ```none
   {{</* note */>}}
   No need to include a prefix; the shortcode automatically provides one. (Note:, Caution:, etc.)
   {{</* /note */>}}
   ```

   The output is:
-->
## 短代码（Shortcodes） {#shortcodes}

Hugo [短代码（Shortcodes）](https://gohugo.io/content-management/shortcodes)
有助于创建比较漂亮的展示效果。我们的文档支持三个不同的这类短代码。
**注意** `{{</* note */>}}`、**小心** `{{</* caution */>}}` 和 **警告** `{{</* warning */>}}`。

1. 将要突出显示的文字用短代码的开始和结束形式包围。
2. 使用下面的语法来应用某种样式：

   ```none
   {{</* note */>}}
   不需要前缀；短代码会自动添加前缀（注意：、小心：等）
   {{</* /note */>}}
   ```

   输出的样子是：

   {{< note >}}
   <!--
   The prefix you choose is the same text for the tag.
   -->
   你所选择的标记决定了文字的前缀。
   {{< /note >}}

<!--
### Note

Use `{{</* note */>}}` to highlight a tip or a piece of information that may be helpful to know.

For example:

```
{{</* note */>}}
You can _still_ use Markdown inside these callouts.
{{</* /note */>}}
```

The output is:
-->
### 注释（Note） {#note}

使用短代码 `{{</* note */>}}` 来突出显示某种提示或者有助于读者的信息。

例如：

```
{{</* note */>}}
在这类短代码中仍然 _可以_ 使用 Markdown 语法。
{{</* /note */>}}
```

输出为：

{{< note >}}
<!--
You can _still_ use Markdown inside these callouts.
-->
在这类短代码中仍然**可以**使用 Markdown 语法。
{{< /note >}}

<!--
You can use a `{{</* note */>}}` in a list:

```
1. Use the note shortcode in a list

1. A second item with an embedded note

   {{</* note */>}}
   Warning, Caution, and Note shortcodes, embedded in lists, need to be indented four spaces. See [Common Shortcode Issues](#common-shortcode-issues).
   {{</* /note */>}}

1. A third item in a list

1. A fourth item in a list
```
-->
你可以在列表中使用 `{{</* note */>}}`：

```
1. 在列表中使用 note 短代码

1. 带嵌套 note 的第二个条目

   {{</* note */>}}
   警告、小心和注意短代码可以嵌套在列表中，但是要缩进四个空格。
   参见[常见短代码问题](#common-shortcode-issues)。
   {{</* /note */>}}

1. 列表中第三个条目

1. 列表中第四个条目
```

<!--
The output is:

1. Use the note shortcode in a list

1. A second item with an embedded note
-->
其输出为：

1. 在列表中使用 note 短代码

2. 带嵌套 note 的第二个条目

    <!--
    Warning, Caution, and Note shortcodes, embedded in lists, need to be indented four spaces. See [Common Shortcode Issues](#common-shortcode-issues).
    -->
    
    {{< note >}}
    警告、小心和注释短代码可以嵌套在列表中，但是要缩进四个空格。
    参见[常见短代码问题](#common-shortcode-issues)。
    {{< /note >}}

<!--
1. A third item in a list

1. A fourth item in a list
-->
3. 列表中第三个条目

4. 列表中第四个条目

<!--
### Caution

Use `{{</* caution */>}}` to call attention to an important piece of information to avoid pitfalls.

For example:

```
{{</* caution */>}}
The callout style only applies to the line directly above the tag.
{{</* /caution */>}}
```

The output is:
-->
### 小心（Caution）  {#caution}

使用 `{{</* caution */>}}` 短代码来引起读者对某段信息的重视，以避免遇到问题。

例如：

```
{{</* caution */>}}
此短代码样式仅对标记之上的一行起作用。
{{</* /caution */>}}
```

其输出为：

{{< caution >}}
<!--
The callout style only applies to the line directly above the tag.
-->
此短代码样式仅对标记之上的一行起作用。
{{< /caution >}}

<!--
### Warning

Use `{{</* warning */>}}` to indicate danger or a piece of information that is crucial to follow.

For example:

```
{{</* warning */>}}
Beware.
{{</* /warning */>}}
```

The output is:
-->
### 警告（Warning）  {#warning}

使用 `{{</* warning */>}}` 来表明危险或者必须要重视的一则信息。

例如：

```
{{</* warning */>}}
注意事项
{{</* /warning */>}}
```

其输出为：

{{< warning >}}
<!--
Beware.
-->
注意事项
{{< /warning >}}

<!--
## Common Shortcode Issues

### Ordered Lists

Shortcodes will interrupt numbered lists unless you indent four spaces before the notice and the tag.

For example:

    1. Preheat oven to 350˚F
    
    1. Prepare the batter, and pour into springform pan.
       {{</* note */>}}Grease the pan for best results.{{</* /note */>}}

    1. Bake for 20-25 minutes or until set.

The output is:

1. Preheat oven to 350˚F

1. Prepare the batter, and pour into springform pan.

   {{< note >}}Grease the pan for best results.{{< /note >}}

1. Bake for 20-25 minutes or until set.
-->
## 常见的短代码问题  {#common-shortcode-issues}

### 编号列表   {#ordered-lists}

短代码会打乱编号列表的编号，除非你在信息和标志之前都缩进四个空格。

例如：

```
1. 预热到 350˚F
1. 准备好面糊，倒入烘烤盘
    {{</* note */>}}给盘子抹上油可以达到最佳效果。{{</* /note */>}}
1. 烘烤 20 到 25 分钟，或者直到满意为止。
```

其输出结果为：

1. 预热到 350˚F
1. 准备好面糊，倒入烘烤盘
   {{< note >}}给盘子抹上油可以达到最佳效果。{{< /note >}}
1. 烘烤 20 到 25 分钟，或者直到满意为止。

<!--
### Include Statements

Shortcodes inside include statements will break the build. You must insert them
in the parent document, before and after you call the include. For example:

```
{{</* note */>}}
{{</* include "task-tutorial-prereqs.md" */>}}
{{</* /note */>}}
```
-->
### Include 语句   {#include-statements}

如果短代码出现在 include 语境中，会导致网站无法构建。
你必须将他们插入到上级文档中，分别将开始标记和结束标记插入到 include 语句之前和之后。
例如：

```
{{</* note */>}}
{{</* include "task-tutorial-prereqs.md" */>}}
{{</* /note */>}}
```

<!--
## Markdown elements

### Line breaks

Use a single newline to separate block-level content like headings, lists, images,
code blocks, and others. The exception is second-level headings, where it should
be two newlines. Second-level headings follow the first-level (or the title) without
any preceding paragraphs or texts. A two line spacing helps visualize the overall
structure of content in a code editor better.
-->
## Markdown 元素 {#markdown-elements}

### 换行  {#line-breaks}

使用单一换行符来隔离块级内容，例如标题、列表、图片、代码块以及其他元素。
这里的例外是二级标题，必须有两个换行符。
二级标题紧随一级标题（或标题），中间没有段落或文字。

两行的留白有助于在代码编辑器中查看整个内容的结构组织。

<!--
Manually wrap paragraphs in the Markdown source when appropriate. Since the git
tool and the GitHub website generate file diffs on a line-by-line basis,
manually wrapping long lines helps the reviewers to easily find out the changes
made in a PR and provide feedback. It also helps the downstream localization
teams where people track the upstream changes on a per-line basis.  Line
wrapping can happen at the end of a sentence or a punctuation character, for
example. One exception to this is that a Markdown link or a shortcode is
expected to be in a single line.
-->
适当时在 Markdown 文档中手动换行。由于 git 工具和 GitHub
网站是逐行生成文件差异的，手动换行可以帮助审阅者轻松找到 PR 中所做的更改并提供反馈。
它还可以帮助下游本地化团队，使其按行跟踪上游更改。例如，换行可以发生在句子或标点符号的末尾。
一个例外是 Markdown 链接或短代码应位于一行中。

<!--
### Headings and titles {#headings}

People accessing this documentation may use a screen reader or other assistive technology (AT).
[Screen readers](https://en.wikipedia.org/wiki/Screen_reader) are linear output devices,
they output items on a page one at a time. If there is a lot of content on a page, you can
use headings to give the page an internal structure. A good page structure helps all readers
to easily navigate the page or filter topics of interest.
-->
### 大标题和小标题  {#headings}

访问文档的读者可能会使用屏幕抓取程序或者其他辅助技术。
[屏幕抓取器](https://en.wikipedia.org/wiki/Screen_reader)是一种线性输出设备,
它们每次输出页面上的一个条目。
如果页面上内容过多，你可以使用标题来为页面组织结构。
页面的良好结构对所有读者都有帮助，使得他们更容易浏览或者过滤感兴趣的内容。

<!--
{{< table caption = "Do and Don't - Headings" >}}
Do | Don't
:--| :-----
Update the title in the front matter of the page or blog post. | Use first level heading, as Hugo automatically converts the title in the front matter of the page into a first-level heading.
Use ordered headings to provide a meaningful high-level outline of your content. | Use headings level 4 through 6, unless it is absolutely necessary. If your content is that detailed, it may need to be broken into separate articles.
Use pound or hash signs (`#`) for non-blog post content. | Use underlines (`---` or `===`) to designate first-level headings.
Use sentence case for headings in the page body. For example, **Extend kubectl with plugins** | Use title case for headings in the page body. For example, **Extend Kubectl With Plugins**
Use title case for the page title in the front matter. For example, `title: Kubernetes API Server Bypass Risks` | Use sentence case for page titles in the front matter. For example, don't use `title: Kubernetes API server bypass risks`
{{< /table >}}
-->
{{< table caption = "标题约定" >}}
可以 | 不可以
:--| :-----
更新页面或博客在前言部分中的标题。 | 使用一级标题。因为 Hugo 会自动将页面前言部分的标题转化为一级标题。
使用编号的标题以便内容组织有一个更有意义的结构。| 使用四级到六级标题，除非非常有必要这样。如果你要编写的内容有非常多细节，可以尝试拆分成多个不同页面。
在非博客内容页面中使用井号（`#`）| 使用下划线 `---` 或 `===` 来标记一级标题。
页面正文中的小标题采用正常语句的大小写。例如：**Extend kubectl with plugins** | 页面正文中的小标题采用首字母大写的大标题式样。例如：**Extend Kubectl With Plugins**
头部的页面标题采用大标题的式样。例如：`title: Kubernetes API Server Bypass Risks` | 头部的页面标题采用正常语句的大小写。例如不要使用 `title: Kubernetes API server bypass risks`
{{< /table >}}

<!--
### Paragraphs

{{< table caption = "Do and Don't - Paragraphs" >}}
Do | Don't
:--| :-----
Try to keep paragraphs under 6 sentences. | Indent the first paragraph with space characters. For example, ⋅⋅⋅Three spaces before a paragraph will indent it.
Use three hyphens (`---`) to create a horizontal rule. Use horizontal rules for breaks in paragraph content. For example, a change of scene in a story, or a shift of topic within a section. | Use horizontal rules for decoration.
{{< /table >}}
-->
### 段落    {#paragraphs}

{{< table caption = "段落约定" >}}
可以 | 不可以
:--| :-----
尝试不要让段落超出 6 句话。 | 用空格来缩进第一段。例如，段落前面的三个空格⋅⋅⋅会将段落缩进。
使用三个连字符（`---`）来创建水平线。使用水平线来分隔段落内容。例如，在故事中切换场景或者在上下文中切换主题。 | 使用水平线来装饰页面。
{{< /table >}}

<!--
### Links

{{< table caption = "Do and Don't - Links" >}}
Do | Don't
Write hyperlinks that give you context for the content they link to. For example: Certain ports are open on your machines. See <a href="#check-required-ports">Check required ports</a> for more details. | Use ambiguous terms such as “click here”. For example: Certain ports are open on your machines. See <a href="#check-required-ports">here</a> for more details.
Write Markdown-style links: `[link text](URL)`. For example: `[Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/#table-captions)` and the output is [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/#table-captions). | Write HTML-style links: `<a href="/media/examples/link-element-example.css" target="_blank">Visit our tutorial!</a>`, or create links that open in new tabs or windows. For example: `[example website](https://example.com){target="_blank"}`
{{< /table >}}
-->
### 链接   {#links}

{{< table caption = "链接约定" >}}
可以 | 不可以
:--| :-----
插入超级链接时给出它们所链接到的目标内容的上下文。例如：你的机器上某些端口处于开放状态。参见<a href="#check-required-ports">检查所需端口</a>了解更详细信息。| 使用“点击这里”等模糊的词语。例如：你的机器上某些端口处于打开状态。参见<a href="#check-required-ports">这里</a>了解详细信息。
编写 Markdown 风格的链接：`[链接文本](URL)`。例如：`[Hugo 短代码](/zh-cn/docs/contribute/style/hugo-shortcodes/#table-captions)`，输出是 [Hugo 短代码](/zh-cn/docs/contribute/style/hugo-shortcodes/#table-captions)。 | 编写 HTML 风格的超级链接：`<a href="/media/examples/link-element-example.css" target="_blank">访问我们的教程！</a>`，或者创建会打开新 Tab 页签或新窗口的链接。例如：`[网站示例](https://example.com){target="_blank"}`。
{{< /table >}}

<!--
### Lists

Group items in a list that are related to each other and need to appear in a specific
order or to indicate a correlation between multiple items. When a screen reader comes
across a list—whether it is an ordered or unordered list—it will be announced to the
user that there is a group of list items. The user can then use the arrow keys to move
up and down between the various items in the list. Website navigation links can also be
marked up as list items; after all they are nothing but a group of related links.

- End each item in a list with a period if one or more items in the list are complete
  sentences. For the sake of consistency, normally either all items or none should be complete sentences.
-->
### 列表  {#lists}

将一组相互关联的内容组织到一个列表中，以便表达这些条目彼此之间有先后顺序或者某种相互关联关系。
当屏幕抓取器遇到列表时，无论该列表是否有序，它会告知用户存在一组枚举的条目。
用户可以使用箭头键来上下移动，浏览列表中条目。
网站导航链接也可以标记成列表条目，因为说到底他们也是一组相互关联的链接而已。

- 如果列表中一个或者多个条目是完整的句子，则在每个条目末尾添加句号。
  出于一致性考虑，一般要么所有条目要么没有条目是完整句子。

  {{< note >}}
  <!--
  Ordered lists that are part of an incomplete introductory sentence can be in lowercase
  and punctuated as if each item was a part of the introductory sentence.
  -->
  编号列表如果是不完整的介绍性句子的一部分，可以全部用小写字母，并按照
  每个条目都是句子的一部分来看待和处理。
  {{< /note >}}

<!--
- Use the number one (`1.`) for ordered lists.

- Use (`+`), (`*`), or (`-`) for unordered lists.

- Leave a blank line after each list.

- Indent nested lists with four spaces (for example, ⋅⋅⋅⋅).

- List items may consist of multiple paragraphs. Each subsequent paragraph in a list
  item must be indented by either four spaces or one tab.
-->
- 在编号列表中，使用数字 1（`1.`）。

- 对非排序列表，使用加号（`+`）、星号（`*`）、或者减号（`-`）。

- 在每个列表之后留一个空行。

- 对于嵌套的列表，相对缩进四个空格（例如，⋅⋅⋅⋅）。

- 列表条目可能包含多个段落。每个后续段落都要缩进或者四个空格或者一个制表符。

<!--
### Tables

The semantic purpose of a data table is to present tabular data. Sighted users can
quickly scan the table but a screen reader goes through line by line. A table caption
is used to create a descriptive title for a data table. Assistive technologies (AT)
use the HTML table caption element to identify the table contents to the user within the page structure.

- Add table captions using [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/#table-captions) for tables.
-->
### 表格  {#tables}

数据表格的语义用途是呈现表格化的数据。
用户可以快速浏览表格，但屏幕抓取器需要逐行地处理数据。
表格标题可以用来给数据表提供一个描述性的标题。
辅助技术使用 HTML 表格标题元素来在页面结构中辨识表格内容。

- 使用 [Hugo 短代码](/zh-cn/docs/contribute/style/hugo-shortcodes/#table-captions)为表格添加标题。

<!--
## Content best practices

This section contains suggested best practices for clear, concise, and consistent content.

### Use present tense

{{< table caption = "Do and Don't - Use present tense" >}}
Do | Don't
This command starts a proxy. | This command will start a proxy.
{{< /table >}}

Exception: Use future or past tense if it is required to convey the correct
meaning.
-->
## 内容最佳实践   {#content-best-practices}

本节包含一些建议的最佳实践，用来开发清晰、明确一致的文档内容。

### 使用现在时态

{{< table caption = "使用现在时态" >}}
可以 | 不可以
:--| :-----
此命令启动代理。| 此命令将启动一个代理。
{{< /table >}}

例外：如果需要使用过去时或将来时来表达正确含义时，是可以使用的。

<!--
### Use active voice

{{< table caption = "Do and Don't - Use active voice" >}}
Do | Don't
You can explore the API using a browser. | The API can be explored using a browser.
The YAML file specifies the replica count. | The replica count is specified in the YAML file.
{{< /table >}}  

Exception: Use passive voice if active voice leads to an awkward construction.
-->
### 使用主动语态

{{< table caption = "使用主动语态" >}}
可以 | 不可以
:--| :-----
你可以使用浏览器来浏览 API。| API 可以被使用浏览器来浏览。
YAML 文件给出副本个数。 | 副本个数是在 YAML 文件中给出的。
{{< /table >}}  

例外：如果主动语态会导致句子很难构造时，可以使用被动语态。

<!--
### Use simple and direct language

Use simple and direct language. Avoid using unnecessary phrases, such as saying "please."

{{< table caption = "Do and Don't - Use simple and direct language" >}}
Do | Don't
To create a ReplicaSet, ... | In order to create a ReplicaSet, ...
See the configuration file. | Please see the configuration file.
View the pods. | With this next command, we'll view the Pods.
{{< /table >}}  
-->
### 使用简单直接的语言

使用简单直接的语言。避免不必要的短语，例如说“请”。

{{< table caption = "使用简单直接语言" >}}
可以 | 不可以
:--| :-----
要创建 ReplicaSet，... | 如果你想要创建 ReplicaSet，...
参看配置文件。 | 请自行查看配置文件。
查看 Pod。| 使用下面的命令，我们将会看到 Pod。
{{< /table >}}  

<!--
### Address the reader as "you"

{{< table caption = "Do and Don't - Addressing the reader" >}}
Do | Don't
:--| :-----
You can create a Deployment by ... | We'll create a Deployment by ...
In the preceding output, you can see... | In the preceding output, we can see ...
{{< /table >}}  
-->
### 将读者称为“你”

{{< table caption = "将读者称为“你”" >}}
可以 | 不可以
:--| :-----
你可以通过 ... 创建一个 Deployment。 | 通过...我们将创建一个 Deployment。
在前面的输出中，你可以看到... | 在前面的输出中，我们可以看到...
{{< /table >}}  

<!--
### Avoid Latin phrases

Prefer English terms over Latin abbreviations.

{{< table caption = "Do and Don't - Avoid Latin phrases" >}}
Do | Don't
For example, ... | e.g., ...
That is, ...| i.e., ...
{{< /table >}}   

Exception: Use "etc." for et cetera.
-->
### 避免拉丁短语

尽可能使用英语而不是拉丁语缩写。

{{< table caption = "避免拉丁语短语" >}}
可以 | 不可以
:--| :-----
例如，... | e.g., ...
也就是说，...| i.e., ...
{{< /table >}}

例外：使用 etc. 表示等等。

<!--
## Patterns to avoid

### Avoid using "we"

Using "we" in a sentence can be confusing, because the reader might not know
whether they're part of the "we" you're describing.

{{< table caption = "Do and Don't - Patterns to avoid" >}}
Do | Don't
:--| :-----
Version 1.4 includes ... | In version 1.4, we have added ...
Kubernetes provides a new feature for ... | We provide a new feature ...
This page teaches you how to use pods. | In this page, we are going to learn about pods.
{{< /table >}} 
-->
## 应避免的模式   {#patterns-to-avoid}

### 避免使用“我们”

在句子中使用“我们”会让人感到困惑，因为读者可能不知道这里的“我们”指的是谁。

{{< table caption = "要避免的模式" >}}
可以 | 不可以
:--| :-----
版本 1.4 包含了 ... | 在 1.4 版本中，我们添加了 ...
Kubernetes 为 ... 提供了一项新功能。 | 我们提供了一项新功能...
本页面教你如何使用 Pod。| 在本页中，我们将会学到如何使用 Pod。
{{< /table >}}

<!--
### Avoid jargon and idioms

Some readers speak English as a second language. Avoid jargon and idioms to help them understand better.

{{< table caption = "Do and Don't - Avoid jargon and idioms" >}}
Do | Don't
:--| :-----
Internally, ... | Under the hood, ...
Create a new cluster. | Turn up a new cluster.
{{< /table >}}   
-->
### 避免使用俚语或行话

对某些读者而言，英语是其外语。
避免使用一些俚语或行话有助于他们更方便的理解内容。

{{< table caption = "避免使用俚语或行话" >}}
可以 | 不可以
:--| :-----
Internally, ... | Under the hood, ...
Create a new cluster. | Turn up a new cluster.
{{< /table >}}

<!--
### Avoid statements about the future

Avoid making promises or giving hints about the future. If you need to talk about
an alpha feature, put the text under a heading that identifies it as alpha
information.

An exception to this rule is documentation about announced deprecations
targeting removal in future versions. One example of documentation like this
is the [Deprecated API migration guide](/docs/reference/using-api/deprecation-guide/).
-->
### 避免关于将来的陈述

要避免对将来作出承诺或暗示。如果你需要讨论的是 Alpha 功能特性，
可以将相关文字放在一个单独的标题下，标识为 Alpha 版本信息。

此规则的一个例外是对未来版本中计划移除的已废弃功能选项的文档。
此类文档的例子之一是[已弃用 API 迁移指南](/zh-cn/docs/reference/using-api/deprecation-guide/)。

<!--
### Avoid statements that will soon be out of date

Avoid words like "currently" and "new." A feature that is new today might not be
considered new in a few months.

{{< table caption = "Do and Don't - Avoid statements that will soon be out of date" >}}
Do | Don't
:--| :-----
In version 1.4, ... | In the current version, ...
The Federation feature provides ... | The new Federation feature provides ...
{{< /table >}}
-->
### 避免使用很快就会过时的表达

避免使用一些很快就会过时的陈述，例如“目前”、“新的”。
今天而言是新的功能，过了几个月之后就不再是新的了。

{{< table caption = "避免使用很快过时的表达" >}}
可以 | 不可以
:--| :-----
在版本 1.4 中，... | 在当前版本中，...
联邦功能特性提供 ... | 新的联邦功能特性提供 ...
{{< /table >}}  

<!--
### Avoid words that assume a specific level of understanding

Avoid words such as "just", "simply", "easy", "easily", or "simple". These words do not add value.

{{< table caption = "Do and Don't - Avoid insensitive words" >}}
Do | Don't
:--| :-----
Include one command in ... | Include just one command in ...
Run the container ... | Simply run the container ...
You can remove ... | You can easily remove ...
These steps ... | These simple steps ...
{{< /table >}}
-->
### 避免使用隐含用户对某技术有一定理解的词汇

避免使用“只是”、“仅仅”、“简单”、“很容易地”、“很简单”这类词汇。
这些词并没有提升文档的价值。

{{< table caption = "避免无意义词汇的注意事项" >}}
可以 | 不可以
:--| :-----
在 ... 中包含一个命令 | 只需要在... 中包含一个命令
运行容器 ... | 只需运行该容器...
你可以移除... | 你可以很容易地移除...
这些步骤... | 这些简单的步骤...
{{< /table >}}

<!--
### EditorConfig file
The Kubernetes project maintains an EditorConfig file that sets common style preferences in text editors
such as VS Code. You can use this file if you want to ensure that your contributions are consistent with
the rest of the project. To view the file, refer to
[`.editorconfig`](https://github.com/kubernetes/website/blob/main/.editorconfig) in the repository root.
-->
### 编辑器配置文件

Kubernetes 项目维护一个 EditorConfig 文件，用于设置文本编辑器（例如 VS Code）中的常见样式首选项。
如果你想确保你的贡献与项目的其余部分样式保持一致，则可以使用此文件。
要查看该文件，请参阅项目仓库根目录的
[`.editorconfig`](https://github.com/kubernetes/website/blob/main/.editorconfig)。

## {{% heading "whatsnext" %}}

<!--
* Learn about [writing a new topic](/docs/contribute/style/write-new-topic/).
* Learn about [using page templates](/docs/contribute/style/page-content-types/).
* Learn about [custom hugo shortcodes](/docs/contribute/style/hugo-shortcodes/).
* Learn about [creating a pull request](/docs/contribute/new-content/open-a-pr/).
-->
* 了解[编写新主题](/zh-cn/docs/contribute/style/write-new-topic/)。
* 了解[页面内容类型](/zh-cn/docs/contribute/style/page-content-types/)。
* 了解[定制 Hugo 短代码](/zh-cn/docs/contribute/style/hugo-shortcodes/)。
* 了解[发起 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)。
