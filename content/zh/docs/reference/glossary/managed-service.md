---
title: 托管服务
id: managed-service
date: 2018-04-12
full_link: 
short_description: >
  由第三方供应商负责维护的一种软件产品。

aka: 
tags:
- extension
---

<!--
title: Managed Service
id: managed-service
date: 2018-04-12
full_link: 
short_description: >
  A software offering maintained by a third-party provider.

aka: 
tags:
- extension
-->

<!--
 A software offering maintained by a third-party provider.
-->
由第三方供应商负责维护的一种软件产品。

<!--more--> 

<!--
Some examples of Managed Services are AWS EC2, Azure SQL Database, and
GCP Pub/Sub, but they can be any software offering that can be used by an application.
[Service Catalog](/docs/concepts/extend-kubernetes/service-catalog/) provides a way to
list, provision, and bind with Managed Services offered by
{{< glossary_tooltip text="Service Brokers" term_id="service-broker" >}}.
-->
托管服务的一些例子有 AWS EC2、Azure SQL 数据库和 GCP Pub/Sub 等，
不过它们也可以是可以被某应用使用的任何软件交付件。
[服务目录](/zh/docs/concepts/extend-kubernetes/service-catalog/)
提供了一种方法用来列举、制备和绑定到
{{< glossary_tooltip text="服务代理商（Service Brokers）" term_id="service-broker" >}}
所提供的托管服务。
