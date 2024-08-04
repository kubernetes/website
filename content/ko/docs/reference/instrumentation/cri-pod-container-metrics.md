---
title: CRI 파드 & 컨테이너 메트릭
content_type: reference
weight: 50
description: >-
  CRI를 통한 파드 & 컨테이너 메트릭 수집.
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="alpha" >}}

[kubelet](/docs/reference/command-line-tools-reference/kubelet/)은 [cAdvisor](https://github.com/google/cadvisor)를 통해
파드 및 컨테이너 메트릭을 수집한다. 알파 기능으로,
쿠버네티스는 {{< glossary_tooltip term_id="cri" text="컨테이너 런타임 인터페이스(Container Runtime Interface, CRI)">}}를 통해
파드 및 컨테이너 메트릭 수집을 구성할 수 있도록 한다.
CRI 기반 수집 메커니즘을 사용하려면
`PodAndContainerStatsFromCRI` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 활성화하고
호환되는 CRI 도구(containerd >= 1.6.0, CRI-O >= 1.23.0)를 사용해야 한다.

<!-- body -->

## CRI 파드 & 컨테이너 메트릭

`PodAndContainerStatsFromCRI`를 활성화하면, kubelet은 cAdvisor를 사용하여 호스트 시스템을 
직접 조사하는 대신 기본 컨테이너 런타임에서 파드 및 컨테이너 통계에 대해 폴링한다.
이 정보를 cAdvisor로 직접 수집하는 대신
컨테이너 런타임에 의존하는 것의 이점은 다음과 같다.

- 컨테이너 런타임이 정상 작동 중에 이미 이 정보를 수집하는 경우 잠재적으로 성능이 향상될 수 있다.
  이 경우에, 데이터는 kubelet에 의해 다시 집계되는 것이 아니라
  단순히 재사용되는 것이다.
  
- 이는 또한 kubelet과 컨테이너 런타임을 디커플링시키는 것인데, 
  이는 kubelet을 이용하여 프로세스를 (cAdvisor로 관측 가능한) 호스트에 직접 실행하지 않는 
  컨테이너 런타임(예: 가상화를 사용하는 컨테이너 런타임)에서도 메트릭을 수집할 수 있기 때문이다.