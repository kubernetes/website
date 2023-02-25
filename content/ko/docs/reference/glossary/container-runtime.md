---
title: 컨테이너 런타임
id: container-runtime
date: 2019-06-05
full_link: /ko/docs/setup/production-environment/container-runtimes/
short_description: >
 컨테이너 런타임은 컨테이너 실행을 담당하는 소프트웨어이다.

aka:
tags:
- fundamental
- workload
---
 컨테이너 런타임은 컨테이너 실행을 담당하는 소프트웨어이다.

<!--more-->

쿠버네티스는 {{< glossary_tooltip term_id="containerd" >}}, 
{{< glossary_tooltip term_id="cri-o" >}}와 같은 컨테이너 런타임 및 
모든 [Kubernetes CRI (컨테이너 런타임 인터페이스)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md) 
구현체를 지원한다.
