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
A kind of {{< glossary_tooltip text="API object" term_id="object" >}} that defines a new custom API to add
to your Kubernetes API server, without building a complete custom server.
-->
一种 {{< glossary_tooltip text="API 对象" term_id="object" >}}，
用于定义一个新的定制 API 添加到你的 Kubernetes API 服务器，无需构建一个完整的定制服务器。

<!--more-->

<!--
CustomResourceDefinitions let you extend the Kubernetes API for your environment if the built-in
{{< glossary_tooltip text="API resources" term_id="api-resource" >}} can't meet your needs.
-->
当内置的 {{< glossary_tooltip text="API 资源" term_id="api-resource" >}}不能满足你的需要时，
定制资源对象（CustomResourceDefinition）让你可以在你的环境上扩展 Kubernetes API。
