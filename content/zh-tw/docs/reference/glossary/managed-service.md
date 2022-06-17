---
title: 託管服務
id: managed-service
date: 2018-04-12
full_link: 
short_description: >
  由第三方供應商負責維護的一種軟體產品。

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
由第三方供應商負責維護的一種軟體產品。

<!--more--> 

<!--
Some examples of Managed Services are AWS EC2, Azure SQL Database, and
GCP Pub/Sub, but they can be any software offering that can be used by an application.
[Service Catalog](/docs/concepts/extend-kubernetes/service-catalog/) provides a way to
list, provision, and bind with Managed Services offered by
{{< glossary_tooltip text="Service Brokers" term_id="service-broker" >}}.
-->
託管服務的一些例子有 AWS EC2、Azure SQL 資料庫和 GCP Pub/Sub 等，
不過它們也可以是可以被某應用使用的任何軟體交付件。
[服務目錄](/zh-cn/docs/concepts/extend-kubernetes/service-catalog/)
提供了一種方法用來列舉、製備和繫結到
{{< glossary_tooltip text="服務代理商（Service Brokers）" term_id="service-broker" >}}
所提供的託管服務。
