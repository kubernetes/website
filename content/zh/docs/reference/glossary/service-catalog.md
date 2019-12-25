---
title: 服务目录
id: service-catalog
date: 2018-04-12
full_link: 
short_description: >
  服务目录是一种扩展 API，它能让 Kubernetes 集群中运行的应用易于使用外部托管的软件服务，例如云供应商提供的数据仓库服务。
  
  An extension API that enables applications running in Kubernetes clusters to easily use external managed software offerings, such as a datastore service offered by a cloud provider.
aka: 
tags:
- extension
---

<!--
---
title: Service Catalog
id: service-catalog
date: 2018-04-12
full_link: 
short_description: >
  An extension API that enables applications running in Kubernetes clusters to easily use external managed software offerings, such as a datastore service offered by a cloud provider.

aka: 
tags:
- extension
---
-->

<!--
 An extension API that enables applications running in Kubernetes clusters to easily use external managed software offerings, such as a datastore service offered by a cloud provider.
-->

服务目录（Service Catalog）是一种扩展 API，它能让 Kubernetes 集群中运行的应用易于使用外部托管的的软件服务，例如云供应商提供的数据仓库服务。

<!--more--> 

<!--
It provides a way to list, provision, and bind with external {{< glossary_tooltip text="Managed Services" term_id="managed-service" >}} from {{< glossary_tooltip text="Service Brokers" term_id="service-broker" >}} without needing detailed knowledge about how those services are created or managed.
-->

服务目录可以检索、供应、和绑定由 {{< glossary_tooltip text="服务代理人（Service Brokers）" term_id="service-broker" >}} 提供的外部 {{< glossary_tooltip text="托管服务" term_id="managed-service" >}}，而无需知道那些服务具体是怎样创建和托管的。

