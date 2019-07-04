---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/generated/kube-proxy
short_description: >
  `kube-proxy`는 클러스터의 각 노드에서 실행되는 네트워크 프록시이다.

aka:
tags:
- fundamental
- core-object
---
 `kube-proxy`는 클러스터의 각 노드에서 실행되는 네트워크 프록시이다.

이는 호스트의 네트워크 규칙을 관리하고 접속 포워딩을 수행하여
쿠버네티스 서비스 추상화를 가능케 한다.

<!--more-->

`kube-proxy`는 요청에 대한 포워딩을 책임진다. `kube-proxy`는 TCP 및 UDP 스트림 포워딩을 허용하거나 TCP 및 UDP 포워딩을 백 엔드 기능 집합에 걸쳐 라운드 로빈을 제공한다.

