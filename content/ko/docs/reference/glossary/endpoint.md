---
title: 엔드포인트(Endpoints)
id: endpoints
date: 2020-04-23
full_link: 
short_description: >
  엔드포인트는 서비스(Service) 셀렉터에 매치되는 파드의 IP 주소를 추적한다.

aka:
tags:
- networking
---
 엔드포인트는 서비스(Service) {{< glossary_tooltip term_id="selector" >}}에 매치되는 파드의 IP 주소를 추적한다. (API에서 해당 `kind`의 명칭은 `Endpoints`이며, 복수형이 기본임을 유의한다.)

<!--more-->
엔드포인트는 셀렉터를 명시하지 않고도 {{< glossary_tooltip term_id="service" >}}에 대해 수동으로 구성할 수 있다.
{{< glossary_tooltip text="엔드포인트슬라이스(EndpointSlice)" term_id="endpoint-slice" >}} 리소스는 엔드포인트의 대안으로, 확장성(scalability)과 확장 가능성(extensibility)을 제공한다.
