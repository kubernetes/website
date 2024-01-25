---
title: API Group (API 组)
id: api-group
date: 2019-09-02
full_link: /zh-cn/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning
short_description: >
  Kubernetes API 中的一组相关路径。

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
Kubernetes API 中的一组相关路径。

<!--more-->

<!-- 
You can enable or disable each API group by changing the configuration of your API server. You can also disable or enable paths to specific resources. API group makes it easier to extend the Kubernetes API. The API group is specified in a REST path and in the `apiVersion` field of a serialized object. 
-->
通过更改 API 服务器的配置，可以启用或禁用每个 API 组 (API Group)。
你还可以禁用或启用指向特定资源的路径。
API 组使扩展 Kubernetes API 更加的容易。
API 组在 REST 路径和序列化对象的 `apiVersion` 字段中指定。

<!-- 
* Read [API Group](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning) for more information. 
-->
* 阅读 [API 组](/zh-cn/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning)了解更多信息。
