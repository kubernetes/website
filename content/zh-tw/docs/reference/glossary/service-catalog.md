---
title: 服務目錄（Service Catalog）
id: service-catalog
date: 2018-04-12
full_link: 
short_description: >
  服務目錄是一種擴充套件 API，它能讓 Kubernetes 叢集中執行的應用易於使用外部託管的軟體服務，例如雲供應商提供的資料倉庫服務。
  
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

服務目錄是一種擴充套件 API，它能讓 Kubernetes 叢集中執行的應用易於使用外部託管的的軟體服務，例如雲供應商提供的資料倉庫服務。

<!--more--> 

<!--
It provides a way to list, provision, and bind with external {{< glossary_tooltip text="Managed Services" term_id="managed-service" >}} from {{< glossary_tooltip text="Service Brokers" term_id="service-broker" >}} without needing detailed knowledge about how those services are created or managed.
-->

服務目錄可以檢索、供應、和繫結由 {{< glossary_tooltip text="服務代理人（Service Brokers）" term_id="service-broker" >}}
提供的外部{{< glossary_tooltip text="託管服務（Managed Services）" term_id="managed-service" >}}，
而無需知道那些服務具體是怎樣建立和託管的。

