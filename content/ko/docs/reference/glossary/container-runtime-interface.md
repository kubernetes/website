---
title: 컨테이너 런타임 인터페이스(Container Runtime Interface)
id: container-runtime-interface
date: 2022-01-10
full_link: /ko/docs/concepts/architecture/cri/
short_description: >
  Kubelet과 컨테이너 런타임 사이의 통신을 위한 주요 프로토콜이다.

aka:
tags:
  - cri
---

Kubelet과 컨테이너 런타임 사이의 통신을 위한 주요 프로토콜이다.

<!--more-->

쿠버네티스 컨테이너 런타임 인터페이스(CRI)는
[클러스터 컴포넌트](/ko/docs/concepts/overview/components/#노드-컴포넌트)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}과
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}} 사이의
통신을 위한 주요 [gRPC](https://grpc.io) 프로토콜을 정의한다.
