---
title: ServiceAccount
id: service-account
date: 2018-04-12
full_link: /zh-cn/docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  為在 Pod 中執行的程序提供標識。

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
為在 {{< glossary_tooltip text="Pod" term_id="pod" >}} 中執行的程序提供標識。

<!--more--> 

<!--
When processes inside Pods access the cluster, they are authenticated by the API server as a particular service account, for example, `default`. When you create a Pod, if you do not specify a service account, it is automatically assigned the default service account in the same {{< glossary_tooltip text="Namespace" term_id="namespace" >}}.
-->
當 Pod 中的程序訪問叢集時，API 伺服器將它們作為特定的服務帳戶進行身份驗證，
例如  `default` ，建立 Pod 時，如果你沒有指定服務帳戶，它將自動被賦予同一個
{{< glossary_tooltip text="名字空間" term_id="namespace" >}}中的 default 服務賬戶。

