---
title: 服务代理（Service Broker）
id: service-broker
date: 2018-04-12
full_link: 
short_description: >
  由第三方提供并维护的一组托管服务的访问端点。

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
由第三方提供并维护的一组{{< glossary_tooltip text="托管服务" term_id="managed-service">}}的访问端点。

<!--more--> 

<!--
{{< glossary_tooltip text="Service Brokers" term_id="service-broker" >}} implement the
[Open Service Broker API spec](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md)
and provide a standard interface for applications to use their Managed Services.
[Service Catalog](/docs/concepts/extend-kubernetes/service-catalog/) provides a way to
list, provision, and bind with Managed Services offered by Service Brokers.
-->

{{< glossary_tooltip text="服务代理（Service Brokers）" term_id="service-broker">}}会实现
[开放服务代理 API 规范](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md)
并为应用提供使用其托管服务的标准接口。
[服务目录（Service Catalog）](/zh-cn/docs/concepts/extend-kubernetes/service-catalog/)则提供一种方法，用来列举、供应和绑定服务代理商所提供的托管服务。
