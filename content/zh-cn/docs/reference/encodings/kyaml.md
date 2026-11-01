---
title: KYAML 参考
content_type: concept
weight: 40
---
<!--
title: KYAML Reference
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
**KYAML** is a safer and less ambiguous subset of YAML, initially introduced in Kubernetes v1.34 (alpha) and enabled by default in v1.35 (beta). Designed specifically for Kubernetes, KYAML addresses common YAML pitfalls such as whitespace sensitivity and implicit type coercion while maintaining full compatibility with existing YAML parsers and tooling.
-->
**KYAML** 是一个更安全、歧义更少的 YAML 子集，最初在 Kubernetes v1.34 中引入（Alpha），并在
v1.35 中默认启用（Beta）。KYAML 专为 Kubernetes 设计，在完全兼容现有 YAML 解析器和工具链的同时，解决了
YAML 中常见的问题，例如对空白的敏感性以及隐式类别转换。

<!-- body -->

<!--
This reference describes KYAML syntax.

## Getting started with KYAML

YAML’s reliance on indentation and implicit type coercion often leads to configuration errors, especially in CI/CD pipelines and templating systems like Helm. KYAML eliminates these issues by enforcing explicit syntax and structure, making configurations more reliable and easier to debug.
-->
本文说明了 KYAML 的语法。

## KYAML 入门  {#getting-started-with-kyaml}

YAML 对缩进和隐式类别转换的依赖常常会导致配置错误，尤其是在 CI/CD 流水线和 Helm 等模板化体系中。
KYAML 通过强制使用显式语法和显式结构来消除这些问题，使配置更可靠，调试更容易。

<!--
### Basic Structure

KYAML uses *flow style* syntax with `{}` for objects and `[]` for arrays. All string values must be **double-quoted**.
-->
### 基本结构  {#basic-structure}

KYAML 使用**流式**语法：对象使用 `{}`，数组使用 `[]`。所有字符串的取值都必须使用**双引号**。

```yaml
---
{
  apiVersion: "v1",
  kind: "Pod",
  metadata: {
    name: "my-pod",
    labels: {
      app: "demo"
    },
  },
  spec: {
    containers: [{
      name: "nginx",
      image: "nginx:1.20"
    }]
  }
}
```
