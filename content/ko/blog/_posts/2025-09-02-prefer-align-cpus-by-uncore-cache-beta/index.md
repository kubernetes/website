---
layout: blog
title: '쿠버네티스 v1.34: CPU Manager Static Policy의 Uncore Cache 정렬 옵션 도입'
date: 2025-09-02T10:30:00-08:00
slug: kubernetes-v1-34-prefer-align-by-uncore-cache-cpumanager-static-policy-optimization
author: Charles Wong (AMD)
translator:
  변재한 (수퍼게이트)
---

Kubernetes v1.32에서 prefer-align-cpus-by-uncorecache라는 새로운 CPU Manager Static Policy 옵션이 알파 기능으로 처음 도입되었고, Kubernetes v1.34에서는 베타 단계로 승격되었습니다. 이 옵션은 분할된 언코어 캐시 아키텍처를 사용하는 프로세서에서 실행되는 특정 워크로드의 성능을 최적화하도록 설계되었습니다. 이 글에서는 해당 개념이 무엇을 의미하는지, 그리고 왜 유용한지를 설명합니다.

## 기능 이해하기

### Uncore 캐시란 무엇인가?
얼마 전까지 대부분의 범용 CPU는 여러 코어가 단일(last-level) L3 캐시를 공유하는 구조였습니다. 이 단일 L3 캐시는 특정 코어에 연결되지 않기 때문에 _언코어(Uncore) 캐시(=L3 캐시)_ 라고 부르기도 합니다. 반대로 L1, L2 캐시는 보통 특정 코어에 종속되어 있습니다.

최근의 AMD64 및 ARM 기반 프로세서들은 코어와 캐시 간 접근 지연(latency)을 줄이기 위해 분할된 Uncore 캐시 아키텍처를 도입했습니다. 즉, 최종 레벨 캐시(L3)를 물리적으로 나눠 CPU 패키지 내 특정 CPU 그룹과 정렬(alignment)되도록 구성합니다. 이렇게 패키지 내부 거리를 줄이면 캐시 접근 지연을 줄일 수 있습니다.

![Diagram showing monolithic cache on the left and split cache on the right](./mono_vs_split_uncore.png)

쿠버네티스는 이러한 CPU 패키지(들) 내 캐시 토폴로지를 고려해 워크로드를 배치할 수 있습니다.

### 캐시 인식(Cache-aware) 워크로드 배치

아래의 매트릭스는 분할된 언코어 캐시를 사용하는 프로세서에서, 캐시 일관성(coherence) 프로토콜을 통해 CPU 간에 패킷을 전달할 때의 [CPU↔CPU 지연 시간(ns)](https://github.com/nviennot/core-to-core-latency)을 보여줍니다(낮을수록 좋음). 이 예시에서 하나의 프로세서 패키지는 2개의 언코어 캐시를 가지며, 각 언코어 캐시는 8개의 CPU 코어를 담당합니다.

![CPU-to-CPU 지연 시간 수치를 보여주는 표](./c2c_latency.png)

- 파란 칸: 같은 언코어 캐시를 공유하는 CPU 간 지연(낮음)
- 회색 칸: 서로 다른 언코어 캐시에 속한 CPU 간 지연(높음)

`prefer-align-cpus-by-uncorecache`를 활성화하면 [static CPU Manager](/docs/concepts/policy/node-resource-managers/#static-policy)는 컨테이너에 할당되는 모든 CPU가 가능한 한 동일한 언코어 캐시를 공유하도록 CPU 리소스를 할당하려고 시도합니다. 이 정책은 best-effort 방식으로 동작하며, 컨테이너의 요구사항과 노드의 가용 리소스를 함께 고려해 컨테이너의 CPU가 여러 언코어 캐시에 흩어지는 것을 최소화합니다.

가능한 가장 적은 수의 언코어 캐시를 사용하는 CPU 집합 위에서 워크로드를 실행하면, (위 매트릭스에서처럼) 캐시 지연이 감소하고 타 워크로드와의 캐시 경합도 줄어들어 _전체 처리량(throughput)_ 이 향상될 수 있습니다. 단, 이러한 이점은 노드의 프로세서가 분할 언코어 캐시 토폴로지일 때에만 나타납니다.

아래 다이어그램은 기능 활성화 시의 언코어 캐시 정렬을 보여줍니다.

![Diagram showing an example workload CPU assignment, default static policy, and with prefer-align-cpus-by-uncorecache](./cache-align-diagram.png)

기본적으로 쿠버네티스는 언코어 캐시 토폴로지를 고려하지 않으며, _packed 방식_ 으로 CPU를 할당합니다. 이 경우 <span style="color: skyblue;">컨테이너 1</span>과 <span style="color: steelblue;">컨테이너 2</span>가 같은 언코어 캐시(예: Uncore Cache 0)를 공유하면서 Noisy Neighbor 현상(캐시 경합)이 발생할 수 있습니다. 또한 <span style="color: steelblue;">컨테이너 2</span>는 CPU가 두 캐시에 걸쳐 분산되어 cross-cache latency가 추가로 발생할 수 있습니다.

반면 `prefer-align-cpus-by-uncorecache`를 활성화하면 각 컨테이너가 서로 다른 캐시로 격리되어 배치됩니다. 그 결과 컨테이너 간 캐시 경합이 제거되고, 사용 중인 CPU들의 캐시 지연도 최소화됩니다.

## 사용 사례
대표적인 사례로는 통신(Telco) 분야 애플리케이션이 포함될 수 있습니다.
- vRAN
- 모바일 패킷 코어(Mobile Packet Core)
- 방화벽(Firewall)

다만, 이 최적화의 효과는 워크로드에 따라 달라질 수 있습니다. 예를 들어 메모리 대역폭 병목인 애플리케이션은 더 많은 언코어 캐시를 활용하는 편이 메모리 대역폭 접근에 유리할 수 있어, 언코어 캐시 정렬의 이점을 크게 못 느낄 수도 있습니다.

## 기능 활성화

이 기능을 사용하려면:

1. CPU Manager 정책을 static으로 설정하고,
2. CPU Manager Policy Options에서 prefer-align-cpus-by-uncorecache를 활성화해야 합니다.

쿠버네티스 1.34의 경우, 이 기능은 베타 단계에 있으며 `CPUManagerPolicyBetaOptions` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)도 활성화해야 합니다.

아래 내용을 `kubelet` 설정 파일에 추가하세요:
```yaml
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
featureGates:
  ...
  CPUManagerPolicyBetaOptions: true
cpuManagerPolicy: "static"
cpuManagerPolicyOptions:
  prefer-align-cpus-by-uncorecache: "true"
reservedSystemCPUs: "0"
...
```

이미 운영 중인 노드에 변경을 적용한다면, `cpu_manager_state` 파일을 삭제한 뒤 `kubelet`을 재시작하세요.

또한, 단일(모놀리식) 언코어 캐시 프로세서가 장착된 노드에서도 이 옵션을 켤 수 있습니다. 이 경우, 기본 정적 정책과 유사하게 소켓 단위로 CPU를 모아 할당하는 best-effort 소켓 정렬 효과를 흉내 냅니다.

## 더 읽어보기

CPU Manager와 사용 가능한 정책에 대해 더 알아보려면 [Node Resource Managers](/docs/concepts/policy/node-resource-managers/)를 참조하세요.

`prefer-align-cpus-by-uncorecache`에 대한 문서는 [CPU Manager Static Policy Option 섹션](/docs/concepts/policy/node-resource-managers/#prefer-align-cpus-by-uncorecache)을 참조하세요.

`prefer-align-cpus-by-uncorecache`의 구현 상세는 [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4800-cpumanager-split-uncorecache)을 참조하세요.

## 참여하기
이 기능은 [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md)에서 주도하고 있습니다. 해당 기능 개발에 기여하거나, 피드백을 공유하고 싶거나, 다른 SIG Node 프로젝트에 참여하고 싶다면, SIG Node 회의에 참석해 주세요.