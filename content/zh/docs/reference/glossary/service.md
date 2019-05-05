---
title: Service
id: service
date: 2018-04-12
full_link: /docs/concepts/services-networking/service/
short_description: >
  Service 是一种 API 资源对象，它描述了应用的访问方式，例如包含一组 Pod 的应用如何进行访问，Service 还可以描述端口和负载均衡。

aka: 
tags:
- fundamental
- core-object
---

<!--
---
title: Service
id: service
date: 2018-04-12
full_link: /docs/concepts/services-networking/service/
short_description: >
  An API object that describes how to access applications, such as a set of Pods, and can describe ports and load-balancers.

aka: 
tags:
- fundamental
- core-object
---
-->

<!--
 An API object that describes how to access applications, such as a set of {{< glossary_tooltip text="Pods" term_id="pod" >}}, and can describe ports and load-balancers.
-->
 
 Service 是一种 API 资源对象，它描述了应用的访问方式，例如包含一组 Pod 的应用如何进行访问，Service 还可以描述端口和负载均衡。
 
<!--more--> 

<!--
The access point can be internal or external to the cluster.
-->

Service 的接入点可以是集群内部的也可以是集群外部的。
