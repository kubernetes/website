---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /ko/docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  클러스터의 각 노드에서 실행되는 네트워크 프록시.

aka:
tags:
- fundamental
- networking
---
kube-proxy는 클러스터의 각 {{< glossary_tooltip text="노드" term_id="node" >}}에서 실행되는 네트워크 프록시로, 쿠버네티스의 {{< glossary_tooltip text="서비스" term_id="service">}} 개념을 구현하는 컴포넌트이다.

<!--more-->

[kube-proxy](/ko/docs/reference/command-line-tools-reference/kube-proxy/)는 노드의 네트워크 규칙을 유지 관리하며, 내부 네트워크 세션이나 외부 클러스터에서 파드와 통신할 수 있도록 한다.

kube-proxy는 운영 체제에 가용한 패킷 필터링 계층이 있는 경우 이를 사용하고, 그렇지 않은 경우에는 트래픽 자체를 포워드(forward)한다.
