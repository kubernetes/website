---
title: 服務代理（Service Broker）
id: service-broker
date: 2018-04-12
full_link: 
short_description: >
  由第三方提供並維護的一組託管服務的訪問端點。

aka: 
tags:
- extension
---

<!--
---
title: Service Broker
id: service-broker
date: 2018-04-12
full_link: 
short_description: >
  An endpoint for a set of Managed Services offered and maintained by a third-party.

aka: 
tags:
- extension
---
-->

<!--
 An endpoint for a set of {{< glossary_tooltip text="Managed Services" term_id="managed-service" >}} offered and maintained by a third-party.
-->
由第三方提供並維護的一組{{< glossary_tooltip text="託管服務" term_id="managed-service">}}的訪問端點。

<!--more--> 

<!--
{{< glossary_tooltip text="Service Brokers" term_id="service-broker" >}} implement the
[Open Service Broker API spec](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md)
and provide a standard interface for applications to use their Managed Services.
[Service Catalog](/docs/concepts/extend-kubernetes/service-catalog/) provides a way to
list, provision, and bind with Managed Services offered by Service Brokers.
-->

{{< glossary_tooltip text="服務代理（Service Brokers）" term_id="service-broker">}}會實現
[開放服務代理 API 規範](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md)
併為應用提供使用其託管服務的標準介面。
[服務目錄（Service Catalog）](/zh-cn/docs/concepts/extend-kubernetes/service-catalog/)則提供一種方法，用來列舉、供應和繫結服務代理商所提供的託管服務。
