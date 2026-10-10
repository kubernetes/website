---
title: 노드 메트릭 데이터
content_type: reference
weight: 50
description: >-
  노드, 볼륨, 파드, 컨테이너 레벨에서 
  kubelet이 보는 것과 동일한 메트릭에 접근하는 메커니즘
---

[kubelet](/docs/reference/command-line-tools-reference/kubelet/)은 
노드, 볼륨, 파드, 컨테이너 수준의 통계를 수집하며, 
이 통계를 
[요약 API(Summary API)](https://github.com/kubernetes/kubernetes/blob/7d309e0104fedb57280b261e5677d919cb2a0e2d/staging/src/k8s.io/kubelet/pkg/apis/stats/v1alpha1/types.go)에 기록한다.

통계 요약 API에 대한 요청을 
쿠버네티스 API 서버를 통해 프록시하여 전송할 수 있다.

다음은 `minikube`라는 이름의 노드에 대한 요약 API 요청 예시이다.

```shell
kubectl get --raw "/api/v1/nodes/minikube/proxy/stats/summary"
```

다음은 `curl`을 이용하여 동일한 API 호출을 하는 명령어다.

```shell
# 먼저 "kubectl proxy"를 실행해야 한다.
# 8080 부분을 "kubectl proxy" 명령이 할당해 준 포트로 치환한다.
curl http://localhost:8080/api/v1/nodes/minikube/proxy/stats/summary
```

{{< note >}}
`metrics-server` 0.6.x 버전부터, `metrics-server`는 `/stats/summary`가 아닌 
`/metrics/resource` kubelet 엔드포인트에 대해 질의한다.
{{< /note >}}

## 요약 메트릭 API 소스 {#summary-api-source}

기본적으로, 쿠버네티스는 kubelet 내부에서 실행되는 
내장 [cAdvisor](https://github.com/google/cadvisor)를 사용하여 노드 요약 메트릭 데이터를 가져온다.

## CRI를 통해 요약 API 데이터 가져오기 {#pod-and-container-stats-from-cri}

{{< feature-state for_k8s_version="v1.23" state="alpha" >}}

클러스터에 `PodAndContainerStatsFromCRI` 
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 활성화하고, 
{{< glossary_tooltip term_id="cri" text="컨테이너 런타임 인터페이스(CRI)">}}를 
통한 통계 정보 접근을 지원하는 컨테이너 런타임을 사용하는 경우, 
kubelet은 cAdvisor가 아닌 CRI를 사용하여 파드 및 컨테이너 수준의 메트릭 데이터를 가져온다.

## {{% heading "whatsnext" %}}

[클러스터 트러블슈팅하기](/ko/docs/tasks/debug/debug-cluster/) 태스크 페이지에서 
이러한 데이터에 의존하는 메트릭 파이프라인을 사용하는 방법에 대해 다룬다.
