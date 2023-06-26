---
title: 서비스(Service)
id: service
date: 2018-04-12
full_link: /ko/docs/concepts/services-networking/service/
short_description: >
  네트워크 서비스로 파드 집합에서 실행 중인 애플리케이션을 노출하는 방법

aka: 
tags:
- fundamental
- core-object
---
클러스터에서 하나 이상의 {{< glossary_tooltip text="파드" term_id="pod" >}}로 실행되는 네트워크 애플리케이션을 노출하는 방법

<!--more-->

서비스의 대상이 되는 파드 집합은 (보통) {{< glossary_tooltip text="셀렉터" term_id="selector" >}}로 결정된다. 많은 파드가 추가되거나 제거되면, 셀렉터와 일치하는 파드의 집합도 변경된다. 서비스는 네트워크 트래픽을 현재 워크로드를 위한 파드 집합으로 보낼 수 있는지 확인한다.

쿠버네티스 서비스는 IP 네트워킹(IPv4, IPv6 또는 둘 다)을 사용하거나 도메인 네임 시스템(DNS)에서 외부 이름을 참조한다.

서비스 추상화는 인그레스 및 게이트웨이와 같은 다른 메커니즘을 활성화한다.
