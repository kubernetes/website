---
title: 監視（Watch）
id: watch
date: 2024-07-02
full_link: /zh-cn/docs/reference/using-api/api-concepts/#api-verbs
short_description: >
  用於以流的形式跟蹤 Kubernetes 中對象變化的動詞。

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
用於以流的形式跟蹤 Kubernetes 中對象更改的動詞。
它用於高效檢測更改。

<!--more-->

<!--
A verb that is used to track changes to an object in Kubernetes as a stream. Watches allow
efficient detection of changes; for example, a
{{< glossary_tooltip term_id="controller" text="controller">}} that needs to know whenever a
ConfigMap has changed can use a watch rather than polling.

See [Efficient Detection of Changes in API Concepts](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes) for more information.
-->
用於以流的形式跟蹤 Kubernetes 中對象變化的動詞。
監視可以有效地檢測變化；例如，需要知道 ConfigMap
何時發生變化的{{< glossary_tooltip term_id="controller" text="控制器">}}可以使用監視而不是輪詢。
請參閱[有效檢測 API 概念的變化](/zh-cn/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)瞭解更多資訊。
