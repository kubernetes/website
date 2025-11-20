---
title: API Group (API 組)
id: api-group
date: 2019-09-02
full_link: /zh-cn/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning
short_description: >
  Kubernetes API 中的一組相關路徑。

aka:
tags:
- fundamental
- architecture
---
<!-- 
title: API Group
id: api-group
date: 2019-09-02
full_link: /docs/concepts/overview/kubernetes-api/#api-groups-and-versioning
short_description: >
  A set of related paths in the Kubernetes API.

aka:
tags:
- fundamental
- architecture									  
-->

<!-- 
A set of related paths in Kubernetes API.  
-->
Kubernetes API 中的一組相關路徑。

<!--more-->

<!-- 
You can enable or disable each API group by changing the configuration of your API server. You can also disable or enable paths to specific
{{< glossary_tooltip text="resources" term_id="api-resource" >}}. API group makes it easier to extend the Kubernetes API.
The API group is specified in a REST path and in the `apiVersion` field of a serialized {{< glossary_tooltip text="object" term_id="object" >}}. 
-->
通過更改 API 伺服器的設定，可以啓用或禁用每個 API 組 (API Group)。
你還可以禁用或啓用指向特定{{< glossary_tooltip text="資源" term_id="api-resource" >}}的路徑。
API 組使擴展 Kubernetes API 更加的容易。
API 組在 REST 路徑和序列化{{< glossary_tooltip text="對象" term_id="object" >}}的
`apiVersion` 字段中指定。

<!-- 
* Read [API Group](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning) for more information. 
-->
* 閱讀 [API 組](/zh-cn/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning)瞭解更多資訊。
