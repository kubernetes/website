---
title: CIDR
id: cidr
date: 2019-11-12
full_link:
short_description: >
  CIDR은 IP 주소 블록을 설명하는 표기법으로 다양한 네트워킹 구성에서 많이 사용한다.

aka:
tags:
- networking
---
CIDR (Classless Inter-Domain Routing)은 IP 주소 블록을 설명하는 표기법으로 다양한 네트워킹 구성에서 많이 사용한다.

<!--more-->

쿠버네티스에서는 CIDR을 사용하여 시작 주소와 서브넷 마스크로 각 {{< glossary_tooltip text="노드" term_id="node" >}}에 IP 주소 범위를 할당한다.
이를 통해 노드는 각 {{< glossary_tooltip text="파드" term_id="pod" >}}에 고유한 IP 주소를 할당할 수 있다. 원래 IPv4를 위한 개념이었지만 CIDR은 IPv6도 포함하도록 확장됐다.

