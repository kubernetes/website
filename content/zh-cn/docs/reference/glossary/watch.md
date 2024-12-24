---
title: 监视（Watch）
id: watch
date: 2024-07-02
full_link: /zh-cn/docs/reference/using-api/api-concepts/#api-verbs
short_description: >
  用于以流的形式跟踪 Kubernetes 中对象变化的动词。

aka:
tags:
- API verb
- fundamental
---

<!--
title: Watch
id: watch
date: 2024-07-02
full_link: /docs/reference/using-api/api-concepts/#api-verbs
short_description: >
  A verb that is used to track changes to an object in Kubernetes as a stream.

aka:
tags:
- API verb
- fundamental
-->

<!--
A verb that is used to track changes to an object in Kubernetes as a stream.
It is used for the efficient detection of changes.
-->
用于以流的形式跟踪 Kubernetes 中对象更改的动词。
它用于高效检测更改。

<!--more-->

<!--
A verb that is used to track changes to an object in Kubernetes as a stream. Watches allow
efficient detection of changes; for example, a
{{< glossary_tooltip term_id="controller" text="controller">}} that needs to know whenever a
ConfigMap has changed can use a watch rather than polling.

See [Efficient Detection of Changes in API Concepts](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes) for more information.
-->
用于以流的形式跟踪 Kubernetes 中对象变化的动词。
监视可以有效地检测变化；例如，需要知道 ConfigMap
何时发生变化的{{< glossary_tooltip term_id="controller" text="控制器">}}可以使用监视而不是轮询。
请参阅[有效检测 API 概念的变化](/zh-cn/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)了解更多信息。
