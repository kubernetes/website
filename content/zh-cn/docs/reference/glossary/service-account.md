---
title: ServiceAccount
id: service-account
date: 2018-04-12
full_link: /zh-cn/docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  为在 Pod 中运行的进程提供标识。

aka: 
tags:
- fundamental
- core-object
---

<!--
---
title: ServiceAccount
id: service-account
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  Provides an identity for processes that run in a Pod.

aka: 
tags:
- fundamental
- core-object
---
-->


<!--
 Provides an identity for processes that run in a {{< glossary_tooltip text="Pod" term_id="pod" >}}.
-->
为在 {{< glossary_tooltip text="Pod" term_id="pod" >}} 中运行的进程提供标识。

<!--more--> 

<!--
When processes inside Pods access the cluster, they are authenticated by the API server as a particular service account, for example, `default`. When you create a Pod, if you do not specify a service account, it is automatically assigned the default service account in the same {{< glossary_tooltip text="Namespace" term_id="namespace" >}}.
-->
当 Pod 中的进程访问集群时，API 服务器将它们作为特定的服务帐户进行身份验证，
例如  `default` ，创建 Pod 时，如果你没有指定服务帐户，它将自动被赋予同一个
{{< glossary_tooltip text="名字空间" term_id="namespace" >}}中的 default 服务账户。

