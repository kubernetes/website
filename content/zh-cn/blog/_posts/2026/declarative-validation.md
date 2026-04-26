---
layout: blog
title: "Kubernetes v1.36：声明式验证正式发布"
date: 2026-03-23T10:00:00-08:00
draft: true
slug: kubernetes-v1-36-declarative-validation-ga
author: >
  [Yongrui Lin](https://github.com/yongruilin)
translator: >
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.36: Declarative Validation Graduates to GA"
date: 2026-03-23T10:00:00-08:00
draft: true
slug: kubernetes-v1-36-declarative-validation-ga
author: >
  [Yongrui Lin](https://github.com/yongruilin)
-->

<!--
In Kubernetes v1.36, **Declarative Validation** for Kubernetes native types has reached General Availability (GA).

For users, this means more reliable, predictable, and better-documented APIs. By moving to a declarative model, the project also unlocks the future ability to publish validation rules via OpenAPI and integrate with ecosystem tools like Kubebuilder. For contributors and ecosystem developers, this replaces thousands of lines of handwritten validation code with a unified, maintainable framework.

This post covers why this migration was necessary, how the declarative validation framework works, and what new capabilities come with this GA release.
-->
在 Kubernetes v1.36 中，Kubernetes 原生类型的**声明式验证**特性已正式发布（GA）。

对于用户而言，这意味着更可靠、更可预测且文档更完善的 API。
通过迁移到声明式模型，该项目还为未来通过 OpenAPI 发布验证规则以及与 Kubebuilder 等生态系统工具集成奠定了基础。
对于贡献者和生态系统开发者而言，这意味着可以用一个统一且易于维护的框架取代数千行手写的验证代码。

本文将介绍此次迁移的必要性、声明式验证框架的工作原理以及此正式版带来的新特性。

<!--
## The Motivation: Escaping the "Handwritten" Technical Debt

For years, the validation of Kubernetes native APIs relied almost entirely on handwritten Go code. If a field needed to be bounded by a minimum value, or if two fields needed to be mutually exclusive, developers had to write explicit Go functions to enforce those constraints. 
-->
## 动机：摆脱“手写”技术债务

多年来，Kubernetes 原生 API 的验证几乎完全依赖于手写的 Go 代码。
如果某个字段需要设置最小值限制，或者两个字段需要互斥，开发人员就必须编写显式的 Go
函数来强制执行这些约束。

<!--
As the Kubernetes API surface expanded, this approach led to several systemic issues:
1. **Technical Debt:** The project accumulated roughly 18,000 lines of boilerplate validation code. This code was difficult to maintain, error-prone, and required intense scrutiny during code reviews.
2. **Inconsistency:** Without a centralized framework, validation rules were sometimes applied inconsistently across different resources.
3. **Opaque APIs:** Handwritten validation logic was difficult to discover or analyze programmatically. This meant clients and tooling couldn't predictably know validation rules without consulting the source code or encountering errors at runtime.

The solution proposed by SIG API Machinery was **Declarative Validation**: using Interface Definition Language (IDL) tags (specifically `+k8s:` marker tags) directly within `types.go` files to define validation rules.
-->
随着 Kubernetes API 接口的扩展，这种方法导致了几个系统性问题：

1. **技术债务**：该项目积累了大约 18,000 行样板验证代码。这些代码难以维护、容易出错，
   并且在代码审查期间需要进行严格审查。
2. **不一致性**：由于缺乏集中式框架，验证规则有时会在不同的资源中以不一致的方式应用。
3. **API 不透明**：手写的验证逻辑难以通过编程方式发现或分析。
   这意味着客户端和工具无法在不查阅源代码或在运行时遇到错误的情况下，预先了解验证规则。

SIG API Machinery 提出的解决方案是**声明式验证**：
直接在 `types.go` 文件中使用接口定义语言（IDL）标签（特别是 `+k8s:` 标记标签）来定义验证规则。

<!--
## Enter `validation-gen`

At the core of the declarative validation feature is a new code generator called `validation-gen`. Just as Kubernetes uses generators for deep copies, conversions, and defaulting, `validation-gen` parses `+k8s:` tags and automatically generates the corresponding Go validation functions.

These generated functions are then registered seamlessly with the API scheme. The generator is designed as an extensible framework, allowing developers to plug in new "Validators" by describing the tags they parse and the Go logic they should produce. 
-->
## 引入 `validation-gen`

声明式验证特性的核心是一个名为 `validation-gen` 的全新代码生成器。
正如 Kubernetes 使用生成器进行深度复制、转换和默认值设置一样，`validation-gen`
会解析 `+k8s:` 标签并自动生成相应的 Go 验证函数。

这些生成的函数随后会无缝注册到 API 方案中。该生成器被设计为一个可扩展的框架，
允许开发人员通过描述它们要解析的标签以及它们应该生成的 Go 逻辑来插入新的“验证器”。

<!--
### A Comprehensive Suite of +k8s: Tags

The declarative validation framework introduces a comprehensive suite of marker tags that provide rich validation capabilities highly optimized for Go types. For a full list of supported tags, check out the [official documentation](https://kubernetes.io/docs/reference/using-api/declarative-validation/#declarative-validation-tag-reference). Here is a catalog of some of the most common tags you will now see in the Kubernetes codebase:
-->
### 一套全面的 `+k8s:` 标签

声明式验证框架引入了一套全面的标记标签，提供丰富的验证功能，并针对
Go 类型进行了高度优化。有关支持标签的完整列表，
请参阅[官方文档](https://kubernetes.io/zh-cn/docs/reference/using-api/declarative-validation/#declarative-validation-tag-reference)。
以下列出了一些你现在将在 Kubernetes 代码库中看到的最常用标签：

<!--
*   **Presence:** `+k8s:optional`, `+k8s:required`
*   **Basic Constraints:** `+k8s:minimum=0`, `+k8s:maximum=100`, `+k8s:maxLength=16`, `+k8s:format=k8s-short-name`
*   **Collections:** `+k8s:listType=map`, `+k8s:listMapKey=type`
*   **Unions:** `+k8s:unionMember`, `+k8s:unionDiscriminator`
*   **Immutability:** `+k8s:immutable`, `+k8s:update=[NoSet, NoModify, NoClear]`

**Example Usage:**
-->
* **存在性：** `+k8s:optional`、`+k8s:required`
* **基本约束：** `+k8s:minimum=0`、`+k8s:maximum=100`、`+k8s:maxLength=16` 和 `+k8s:format=k8s-short-name`
* **集合：** `+k8s:listType=map`、`+k8s:listMapKey=type`
* **联合：** `+k8s:unionMember`、`+k8s:unionDiscriminator`
* **不可变性：** `+k8s:immutable`、`+k8s:update=[NoSet, NoModify, NoClear]`

**用法示例：**

```go
type ReplicationControllerSpec struct {
    // +k8s:optional
    // +k8s:minimum=0
    Replicas *int32 `json:"replicas,omitempty"`
}
```

<!--
By placing these tags directly above the field definitions, the constraints are self-documenting and immediately visible to anyone reading the type definitions.
-->
通过将这些标签直接放置在字段定义上方，约束条件就具有了自文档性，
任何阅读类型定义的人都可以立即看到这些约束条件。

<!--
## Advanced Capabilities: "Ambient Ratcheting"

One of the most substantial outcomes of this work is that validation ratcheting is now a standard, ambient part of the API. In the past, if we needed to tighten validation, we had to first add handwritten ratcheting code, wait a release, and then tighten the validation to avoid breaking existing objects. 

With declarative validation, this safety mechanism is built-in. If a user updates an existing object, the validation framework compares the incoming object with the `oldObject`. If a specific field's value is semantically equivalent to its prior state (i.e., the user didn't change it), the new validation rule is bypassed. This "ambient ratcheting" means we can loosen or tighten validation immediately and in the least disruptive way possible.
-->
## 高级功能：“Ambient 机制”

这项工作最重要的成果之一是，验证棘轮机制现在已成为 API 的标准组成部分。
过去，如果我们需要加强验证，必须先编写手动棘轮代码，等待版本发布，然后再加强验证，以避免破坏现有对象。

借助声明式验证，这种安全机制已内置。如果用户更新现有对象，验证框架会将传入的对象与 `oldObject` 进行比较。
如果特定字段的值在语义上与其先前状态相同（即用户未对其进行更改），则新的验证规则将被忽略。
这种 “Ambient 机制”意味着我们可以立即以尽可能减少干扰的方式放松或加强验证。

<!--
## Scaling API Reviews with `kube-api-linter`

Reaching GA required absolute confidence in the generated code, but our vision extends beyond just validation. Declarative validation is a key part of a comprehensive approach to making API review easier, more consistent, and highly scalable.

By moving validation rules out of opaque Go functions and into structured markers, we are empowering tools like `kube-api-linter`. This linter can now statically analyze API types and enforce API conventions automatically, significantly reducing the manual burden on SIG API Machinery reviewers and providing immediate feedback to contributors.
-->
## 使用 `kube-api-linter` 扩展 API 审查

达到正式发布（GA）要求我们对生成的代码绝对有信心，但我们的愿景远不止于代码验证。
声明式验证是全面改进 API 审查的关键组成部分，它能使审查更轻松、更一致、更具可扩展性。

通过将验证规则从不透明的 Go 函数中移至结构化标记，我们增强了 `kube-api-linter`
等工具的功能。该代码检查器现在可以静态分析 API 类型并自动强制执行 API 约定，
从而显著减轻 SIG API Machinery 审查人员的手动负担，并为贡献者提供即时反馈。

<!--
## What's next?

With the release of Kubernetes v1.36, Declarative Validation graduates to General Availability (GA). As a stable feature, the associated `DeclarativeValidation` feature gate is now enabled by default. It has become the primary mechanism for adding new validation rules to Kubernetes native types.
-->
## 下一步是什么？

随着 Kubernetes v1.36 的发布，声明式验证正式上线（GA）。
作为一项稳定特性，相关的 `DeclarativeValidation` 特性门控现在默认启用。
它已成为向 Kubernetes 原生类型添加新验证规则的主要机制。

<!--
Looking forward, the project is committed to adopting declarative validation even more extensively. This includes migrating the remaining legacy handwritten validation code for established APIs and requiring its use for all new APIs and new fields. This ongoing transition will continue to shrink the codebase's complexity while enhancing the consistency and reliability of the entire Kubernetes API surface.

Beyond the core migration, declarative validation also unlocks an exciting future for the broader ecosystem. Because validation rules are now defined as structured markers rather than opaque Go code, they can be parsed and reflected in the OpenAPI schemas published by the Kubernetes API server. This paves the way for tools like `kubectl`, client libraries, and IDEs to perform rich client-side validation before a request is ever sent to the cluster. The same declarative framework can also be consumed by ecosystem tools like Kubebuilder, enabling a more consistent developer experience for authors of Custom Resource Definitions (CRDs).
-->
展望未来，该项目致力于更广泛地采用声明式验证。
这包括迁移现有 API 中剩余的旧式手写验证代码，并要求所有新 API 和新字段都使用声明式验证。
这一持续的过渡将不断降低代码库的复杂性，同时增强整个 Kubernetes API 接口的一致性和可靠性。

除了核心迁移之外，声明式验证也为更广泛的生态系统开启了令人兴奋的未来。
由于验证规则现在被定义为结构化标记，而不是不透明的 Go 代码，因此它们可以被解析并反映在
Kubernetes API 服务器发布的 OpenAPI schema 中。这为 `kubectl` 等工具、客户端库和
IDE 等在向集群发送请求之前执行丰富的客户端验证铺平了道路。
同样的声明式框架也可以被 Kubebuilder 等生态系统工具使用，从而为自定义资源定义（CRD）的作者带来更一致的开发体验。

<!--
## Getting involved

The migration to declarative validation is an ongoing effort. While the framework itself is GA, there is still work to be done migrating older APIs to the new declarative format. 

If you are interested in contributing to the core of Kubernetes API Machinery, this is a fantastic place to start. Check out the `validation-gen` documentation, look for issues tagged with `sig/api-machinery`, and join the conversation in the [#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery) and [#sig-api-machinery-dev-tools](https://kubernetes.slack.com/messages/sig-api-machinery-dev-tools) channels on Kubernetes Slack (for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)). You can also attend the [SIG API Machinery meetings](https://github.com/kubernetes/community/tree/master/sig-api-machinery#meetings) to get involved directly.
-->
## 参与其中

向声明式验证的迁移是一项持续进行的工作。虽然框架本身已经正式发布 (GA)，
但仍需将旧版 API 迁移到新的声明式格式。

如果你有兴趣为 Kubernetes API Machinery 的核心做出贡献，这里是一个绝佳的起点。
请查看 `validation-gen` 文档，查找带有 `sig/api-machinery` 标签的问题，
并加入 Kubernetes Slack 上的 [#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery)
和 [#sig-api-machinery-dev-tools](https://kubernetes.slack.com/messages/sig-api-machinery-dev-tools)
频道参与讨论（如需邀请，请访问 [https://slack.k8s.io/](https://slack.k8s.io/)）。
你还可以参加
[SIG API Machinery 会议](https://github.com/kubernetes/community/tree/master/sig-api-machinery#meetings)直接参与其中。

<!--
## Acknowledgments

A huge thank you to everyone who helped bring this feature to GA:
-->
## 致谢

衷心感谢所有帮助将此特性上线 GA 的朋友们：

* [Tim Hockin](https://github.com/thockin)
* [Joe Betz](https://github.com/jpbetz)
* [Aaron Prindle](https://github.com/aaron-prindle)
* [Lalit Chauhan](https://github.com/lalitc375)
* [David Eads](https://github.com/deads2k)
* [Darshan Murthy](https://github.com/darshansreenivas)
* [Jordan Liggitt](https://github.com/liggitt)
* [Patrick Ohly](https://github.com/pohly)
* [Maciej Szulik](https://github.com/soltysh)
* [Wojciech Tyczynski](https://github.com/wojtek-t)
* [Joel Speed](https://github.com/JoelSpeed)
* [Bryce Palmer](https://github.com/everettraven)

<!--
And the many others across the Kubernetes community who contributed along the way.

Welcome to the declarative future of Kubernetes validation!
-->
以及 Kubernetes 社区中其他众多为此做出贡献的人。

欢迎来到 Kubernetes 验证的声明式未来！
