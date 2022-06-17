---
title: API Group
id: api-group
date: 2019-09-02
full_link: /zh-cn/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning
short_description: >
  Kubernetes API 中的一組相關路徑

aka:
tags:
- fundamental
- architecture
---

<!-- 
---
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
---										  
-->


<!-- 
A set of related paths in Kubernetes API.  
-->
Kubernetes API 中的一組相關路徑。

<!--more-->																																																																											  

<!-- 
You can enable or disable each API group by changing the configuration of your API server. You can also disable or enable paths to specific resources. API group makes it easier to extend the Kubernetes API. The API group is specified in a REST path and in the `apiVersion` field of a serialized object. 
-->
透過更改 API server 的配置，可以啟用或禁用每個 API Group。
你還可以禁用或啟用指向特定資源的路徑。
API group 使擴充套件 Kubernetes API 更加的容易。
API group 在 REST 路徑和序列化物件的 `apiVersion` 欄位中指定。

<!-- 
* Read [API Group](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning) for more information. 
-->
* 閱讀 [API Group](/zh-cn/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning) 瞭解更多資訊。
