---
title: Operator 模式
id: operator-pattern
date: 2019-05-21
full_link: /zh-cn/docs/concepts/extend-kubernetes/operator/
short_description: >
  一種用於管理自定義資源的專用控制器

aka:
tags:
- architecture
---

<!--
title: Operator pattern
id: operator-pattern
date: 2019-05-21
full_link: /docs/concepts/extend-kubernetes/operator/
short_description: >
  A specialized controller used to manage a custom resource

aka:
tags:
- architecture
-->
<!--
The [operator pattern](/docs/concepts/extend-kubernetes/operator/) is a system
design that links a {{< glossary_tooltip term_id="controller" >}} to one or more custom
resources.
-->
[operator 模式](/zh-cn/docs/concepts/extend-kubernetes/operator/) 是一種系統設計， 
將 {{< glossary_tooltip term_id="controller" >}} 關聯到一個或多個自定義資源。
<!--more-->

<!--
You can extend Kubernetes by adding controllers to your cluster, beyond the built-in
controllers that come as part of Kubernetes itself.

If a running application acts as a controller and has API access to carry out tasks
against a custom resource that's defined in the control plane, that's an example of
the Operator pattern.
-->
除了使用作爲 Kubernetes 自身一部分的內置控制器之外，你還可以通過
將控制器添加到集羣中來擴展 Kubernetes。

如果正在運行的應用程序能夠充當控制器並通過 API 訪問的方式來執行任務操控
那些在控制平面中定義的自定義資源，這就是一個 operator 模式的示例。

