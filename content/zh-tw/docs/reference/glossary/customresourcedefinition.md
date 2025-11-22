---
title: CustomResourceDefinition
id: CustomResourceDefinition
date: 2018-04-12
full_link: /zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
short_description: >
  通過定製化的代碼給你的 Kubernetes API 伺服器增加資源對象，而無需編譯完整的定製 API 伺服器。

aka: 
tags:
- fundamental
- operation
- extension
---
<!--
title: CustomResourceDefinition
id: CustomResourceDefinition
date: 2018-04-12
full_link: /docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
short_description: >
  Custom code that defines a resource to add to your Kubernetes API server without building a complete custom server.

aka: 
tags:
- fundamental
- operation
- extension
-->
 
<!--
 Custom code that defines a resource to add to your Kubernetes API server without building a complete custom server.
-->
 通過定製化的代碼給你的 Kubernetes API 伺服器增加資源對象，而無需編譯完整的定製 API 伺服器。

<!--more--> 

<!--
Custom Resource Definitions let you extend the Kubernetes API for your environment if the publicly supported API resources can't meet your needs. 
-->
當 Kubernetes 公開支持的 API 資源不能滿足你的需要時，
定製資源對象（Custom Resource Definitions）讓你可以在你的環境上擴展 Kubernetes API。
