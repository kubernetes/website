---
title: 서비스 브로커(Service Broker)
id: service-broker
date: 2018-04-12
full_link:
short_description: >
  서드파티에서 제공하고 유지 관리하는 일련의 매니지드 서비스에 대한 엔드포인트이다.

aka:
tags:
- extension
---
 서드파티에서 제공하고 유지 관리하는 일련의 {{< glossary_tooltip text="매니지드 서비스" term_id="managed-service" >}}에 대한 엔드포인트이다.

<!--more-->

{{< glossary_tooltip text="서비스 브로커" term_id="service-broker" >}}는
[오픈 서비스 브로커 API 명세](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md)를
구현하고 애플리케이션이 매니지드 서비스를 사용할 수 있도록 표준 인터페이스를 제공한다.
[서비스 카탈로그](/ko/docs/concepts/extend-kubernetes/service-catalog/)는
서비스 브로커가 제공하는 매니지드 서비스의 목록과 프로비전, 바인딩하는 방법을 제공한다.

