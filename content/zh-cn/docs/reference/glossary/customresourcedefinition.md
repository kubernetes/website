---
title: CustomResourceDefinition
id: CustomResourceDefinition
date: 2018-04-12
full_link: /zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
short_description: >
  通过定制化的代码给你的 Kubernetes API 服务器增加资源对象，而无需编译完整的定制 API 服务器。

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
 通过定制化的代码给你的 Kubernetes API 服务器增加资源对象，而无需编译完整的定制 API 服务器。

<!--more--> 

<!--
Custom Resource Definitions let you extend the Kubernetes API for your environment if the publicly supported API resources can't meet your needs. 
-->
当 Kubernetes 公开支持的 API 资源不能满足你的需要时，
定制资源对象（Custom Resource Definitions）让你可以在你的环境上扩展 Kubernetes API。
