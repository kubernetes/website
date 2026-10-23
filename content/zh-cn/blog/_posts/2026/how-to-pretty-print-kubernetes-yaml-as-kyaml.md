---
layout: blog
title: "如何将 Kubernetes YAML 格式化为 KYAML，以及为什么你会想要这样做"
date: 2026-08-11T10:00:00-08:00
slug: how-to-pretty-print-kubernetes-yaml-as-kyaml
author: >
  [Kashish Verma](https://github.com/KashishV999)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "How to Pretty-Print Your Kubernetes YAML as KYAML and Why You'd Want To"
date: 2026-08-11T10:00:00-08:00
slug: how-to-pretty-print-kubernetes-yaml-as-kyaml
author: >
  [Kashish Verma](https://github.com/KashishV999)
-->

<!--
YAML has been the standard way to write Kubernetes manifests for years. Every example, tutorial, and configuration file you come across is written in it. The problem isn't that YAML is a bad format. It's that YAML gives you a lot of choices, and not all of them are equally good for writing Kubernetes manifests. Some features make files harder to read, some are easy to misuse and others can lead to surprising behavior.

The interesting part is that Kubernetes doesn't actually need most of those features. It only relies on a small subset of YAML. This led to a simple question: if Kubernetes only needs a small part of YAML, why not *standardize*  on that part and avoid the rest? Instead of introducing a new configuration language, [SIG CLI](https://github.com/kubernetes/community/tree/main/sig-cli) introduced **KYAML**, a stricter, more consistent way to write YAML. 
-->
多年来，YAML 一直是编写 Kubernetes 清单的标准方式。你遇到的每个示例、教程和配置文件都是用它编写的。
问题不在于 YAML 是一个糟糕的格式，而在于 YAML 给了你很多选择，并非所有选择都同样适合编写 Kubernetes 清单。
有些特性让文件更难阅读，有些容易被误用，还有一些可能导致令人惊讶的行为。

有趣的是，Kubernetes 实际上并不需要大多数这些特性。
它只依赖于 YAML 的一个小子集。这引出了一个简单的问题：如果 Kubernetes 只需要 YAML 的一小部分，
为什么不**标准化**那部分并避免其余部分呢？与其引入一种新的配置语言，
[SIG CLI](https://github.com/kubernetes/community/tree/main/sig-cli) 引入了 **KYAML**，
一种更严格、更一致的 YAML 编写方式。

<!--
## What is KYAML? 
-->
## 什么是 KYAML？

<!--
***KYAML is a strict subset (or "dialect") of standard YAML, designed to be parseable by the existing ecosystem without any changes, as proposed in [KEP 5295](https://www.kubernetes.dev/resources/keps/5295/).*** It does not introduce a new format or a new parser. It just narrows the scope of choices you make when writing YAML, so everyone ends up making the same ones.

Think of it less like a new language and more like an agreed-upon style. ***Everything valid in KYAML is valid YAML.*** 
-->
***KYAML 是标准 YAML 的严格子集（或"方言"），旨在让现有生态系统无需任何更改即可解析，
正如 [KEP 5295](https://www.kubernetes.dev/resources/keps/5295/) 中提出的那样。***
它没有引入新的格式或新的解析器。
它只是缩小了你在编写 YAML 时的选择范围，让每个人最终做出相同的选择。

与其把它看作一种新语言，不如把它看作一种约定好的风格。
***KYAML 中有效的一切都是有效的 YAML。***

<!--
## How KYAML solves it
-->
## KYAML 如何解决这些问题

<!--
Standard YAML has a few well-known traps and JSON is not without its own.
-->
标准 YAML 有几个众所周知的陷阱，JSON 也并非没有自己的问题。

<!--
**Whitespace sensitivity.** Indentation defines structure in YAML, which means a wrongly indented file can remain syntactically valid while representing a different object than intended. This gets especially painful with templating tools like Helm, where you are manipulating indentation from outside the YAML context.
-->
**空白符敏感性。**缩进定义了 YAML 中的结构，这意味着缩进错误的文件在语法上可能仍然有效，
但表示的对象与预期不同。在像 Helm 这样的模板工具中，这尤其令人痛苦，
因为你是在 YAML 上下文之外操作缩进的。

<!--
**Silent type coercion.** String quoting is optional in YAML, which sounds convenient until it is not. Some values that look like strings get coerced into other types without warning. The classic example is the ["Norway Bug"](https://hitchdev.com/strictyaml/why/implicit-typing-removed/).
-->
**静默类型强制转换。**在 YAML 中，字符串引号是可选的，这听起来很方便，直到它变得不方便。
一些看起来像字符串的值会在没有警告的情况下被强制转换为其他类型。
经典示例是["挪威 Bug"](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)。

```yaml
country: NO
```

<!---
In standard YAML, `NO` is parsed as a boolean `false`, not the string `"NO"` and it has caught more than a few people off guard.
-->
在标准 YAML 中，`NO` 被解析为布尔值 `false`，而不是字符串 `"NO"`，
这让不少人措手不及。

<!--
**JSON is not the answer either.** It lacks comment support, is strict about trailing commas, and requires every key to be quoted, none of which makes for a good config writing experience.
-->
**JSON 也不是答案。**它缺少注释支持，对尾随逗号很严格，并且要求每个键都被引用，
这些都不能提供良好的配置编写体验。

<!--
***KYAML addresses all of these by making structure and types explicit:***

- Does not depend on whitespace for structure
- Always quotes value strings so no silent type coercion
- Always uses `{}` for maps and structs
- Always uses `[]` for lists
- Allows comments and trailing commas, unlike JSON
- Includes a `---` header to distinguish it from JSON at a glance, since both start with `{`
-->
***KYAML 通过使结构和类型明确来解决所有这些问题：***

- 不依赖空白符来定义结构
- 始终引用值字符串，因此不会静默类型强制转换
- 始终使用 `{}` 表示映射和结构体
- 始终使用 `[]` 表示列表
- 允许注释和尾随逗号，与 JSON 不同
- 包含 `---` 头部，可一眼将其与 JSON 区分，因为两者都以 `{` 开头

<!--
YAML calls this **flow style**, as opposed to the conventional **block style** most people use. KYAML sits halfway between JSON and YAML, more explicit than default YAML, friendlier than JSON.
-->
YAML 称之为**流式风格**，与大多数人使用的传统**块风格**相对。
KYAML 位于 JSON 和 YAML 之间，比默认的 YAML 更明确，比 JSON 更友好。

<!--
Here is the same Pod manifest written in both formats for comparison.
-->
以下是用两种格式编写的相同 Pod 清单，用于比较。

<!--
### Standard YAML
-->
### 标准 YAML

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  labels:
    app: demo
spec:
  containers:
    - name: nginx
      image: nginx:1.20
```

### KYAML

```yaml
---
{
  apiVersion: "v1",
  kind: "Pod",
  metadata: {
    name: "my-pod",
    labels: {
      app: "demo",
    },
  },
  spec: {
    containers: [{
      name: "nginx",
      image: "nginx:1.20",
    }],
  },
}
```

<!--
Notice the double-quoted string values, the braces around every mapping, the brackets around the list and the trailing commas. The additional syntax makes the document structure explicit instead of relying on indentation.
-->
注意双引号字符串值、每个映射周围的花括号、列表周围的方括号以及尾随逗号。
额外的语法使文档结构明确，而不是依赖缩进。

<!--
## How to pretty print YAML as KYAML

There are different ways to get KYAML output.
-->
## 如何将 YAML 格式化为 KYAML

有不同的方法可以获取 KYAML 输出。

<!--
### Option 1: kubectl -o kyaml
-->
### 选项 1：kubectl -o kyaml

<!--
Since Kubernetes 1.34, `kubectl` supports KYAML as a native output format. 
```bash
# Kubernetes 1.35+ (beta; feature enabled by default, still requires -o kyaml CLI param)
kubectl get deployment my-app -o kyaml

# Kubernetes 1.34 (alpha, opt-in)
export KUBECTL_KYAML=true
kubectl get deployment my-app -o kyaml
```
-->
自 Kubernetes 1.34 以来，`kubectl` 原生支持 KYAML 作为输出格式。

```bash
# Kubernetes 1.35+（Beta；默认启用该特性，仍需 -o kyaml CLI 参数）
kubectl get deployment my-app -o kyaml

# Kubernetes 1.34（Alpha，需选择启用）
export KUBECTL_KYAML=true
kubectl get deployment my-app -o kyaml
```

<!--
To save the output to a file:
-->
将输出保存到文件：

```bash
kubectl get deployment my-app -o kyaml > my-app.yaml
```

<!--
There are currently no plans to make KYAML the default output format. If you prefer using KYAML by default, you can configure your preferred default with `kuberc`. For more details, see the [kuberc documentation](https://kubernetes.io/docs/reference/kubectl/kuberc/).

```bash
# Kubernetes 1.36+
kubectl kuberc set --section defaults --command get --option output=kyaml

# Kubernetes 1.33–1.35 (alpha prefix still required)
kubectl alpha kuberc set --section defaults --command get --option output=kyaml
```
-->
目前没有计划将 KYAML 设为默认输出格式。
如果你更喜欢默认使用 KYAML，可以通过 `kuberc` 配置你的首选默认值。
更多详情请参阅 [kuberc 文档](https://kubernetes.io/zh-cn/docs/reference/kubectl/kuberc/)。

```bash
# Kubernetes 1.36+
kubectl kuberc set --section defaults --command get --option output=kyaml

# Kubernetes 1.33–1.35（仍需 Alpha 前缀）
kubectl alpha kuberc set --section defaults --command get --option output=kyaml
```

<!--
### Option 2: yamlfmt
-->
### 选项 2：yamlfmt

<!--
For converting existing files, Google's `yamlfmt` added a dedicated [`kyaml` formatter](https://github.com/google/yamlfmt/blob/main/docs/config-file.md#kyaml-formatter) in v0.21.0.
-->
对于转换现有文件，Google 的 `yamlfmt` 在 v0.21.0 中添加了专用的
[`kyaml` 格式化器](https://github.com/google/yamlfmt/blob/main/docs/config-file.md#kyaml-formatter)。

<!--
Install via Go, or grab a binary from the [releases page](https://github.com/google/yamlfmt/releases):
-->
通过 Go 安装，或从[发布页面](https://github.com/google/yamlfmt/releases)获取二进制文件：

```bash
go install github.com/google/yamlfmt/cmd/yamlfmt@latest
```

<!--
It is also available as a [pre-commit hook](https://github.com/google/yamlfmt/blob/main/docs/pre-commit.md) and as a [Docker image](https://github.com/google/yamlfmt) for CI pipelines.
-->
它也可以作为 [pre-commit hook](https://github.com/google/yamlfmt/blob/main/docs/pre-commit.md) 和
用于 CI 管道的 [Docker 镜像](https://github.com/google/yamlfmt)使用。

<!--
Add a `.yamlfmt` config to your project root:
-->
在项目根目录添加 `.yamlfmt` 配置：

```yaml
formatter:
  type: kyaml
```

<!--
Preview the output without modifying your file:
-->
预览输出而不修改文件：

```bash
yamlfmt -dry my-deployment.yaml
```

<!--
then apply:
-->
然后应用：

```bash
yamlfmt my-deployment.yaml
```

<!--
To convert an entire directory:
-->
转换整个目录：

```bash
yamlfmt ./k8s/
```

<!--
The `kyaml` formatter takes no additional configuration and does not share options with the default formatter so mixing them will cause an error.
-->
`kyaml` 格式化器不需要额外配置，也不与默认格式化器共享选项，因此混合使用会导致错误。


<!--
## Is KYAML worth adopting?
-->
## KYAML 值得采用吗？

<!--
Every valid KYAML file is a valid YAML file. So whatever you write in KYAML, your existing tools, your `kubectl`, your CI pipelines, none of them need to change. You can even pass KYAML as input to any version of `kubectl`, not just 1.34+, because at the end of the day it is just YAML.
-->
每个有效的 KYAML 文件都是有效的 YAML 文件。
因此，无论你用 KYAML 写什么，你现有的工具、你的 `kubectl`、你的 CI 管道都不需要更改。
你甚至可以将 KYAML 作为输入传递给任何版本的 `kubectl`，而不仅仅是 1.34+，
因为归根结底它只是 YAML。

<!--
KYAML is not strictly necessary. You can keep writing block-style YAML and things will work. But it is a *deliberate choice* to make your configs less error-prone and more consistent especially across a team or a larger repo. 

*It is less of a migration and more of a better habit.*
-->
KYAML 并不是严格必需的。你可以继续编写块风格的 YAML，一切都会正常工作。
但这是一个**有意的选择**，使你的配置更不容易出错，更一致，
尤其是在团队或较大的仓库中。

**这与其说是迁移，不如说是养成更好的习惯。**
