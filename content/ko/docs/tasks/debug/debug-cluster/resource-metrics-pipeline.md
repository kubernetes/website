---
# reviewers:
# - fgrzadkowski
# - piosz
title: 리소스 메트릭 파이프라인
content_type: concept
weight: 15
---

<!-- overview -->

쿠버네티스에서, _메트릭 API(Metrics API)_ 는 자동 스케일링 및 비슷한 사용 사례를 지원하기 위한 기본적인 메트릭 집합을 제공한다. 
이 API는 노드와 파드의 리소스 사용량 정보를 제공하며, 
여기에는 CPU 및 메모리 메트릭이 포함된다. 
메트릭 API를 클러스터에 배포하면, 쿠버네티스 API의 클라이언트는 이 정보에 대해 질의할 수 있으며, 
질의 권한을 관리하기 위해 쿠버네티스의 접근 제어 메커니즘을 이용할 수 있다.

[HorizontalPodAutoscaler](/ko/docs/tasks/run-application/horizontal-pod-autoscale/)(HPA) 및 
[VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)(VPA)는 
사용자의 요구 사항을 만족할 수 있도록 워크로드 레플리카와 리소스를 조정하는 데에 메트릭 API의 데이터를 이용한다.

[`kubectl top`](/docs/reference/generated/kubectl/kubectl-commands#top) 
명령을 이용하여 
리소스 메트릭을 볼 수도 있다.

{{< note >}}
메트릭 API 및 이것이 제공하는 메트릭 파이프라인은 
HPA / VPA 에 의한 자동 스케일링이 동작하는 데 필요한 
최소한의 CPU 및 메모리 메트릭만을 제공한다. 
더 많은 메트릭 집합을 제공하려면, _커스텀 메트릭 API_ 를 사용하는 
추가 [메트릭 파이프라인](/ko/docs/tasks/debug/debug-cluster/resource-usage-monitoring/#full-metrics-pipeline)을 배포하여 
기본 메트릭 API를 보충할 수 있다.
{{< /note >}}


그림 1은 리소스 메트릭 파이프라인의 아키텍처를 나타낸다.

{{< mermaid >}}
flowchart RL
subgraph cluster[클러스터]
direction RL
S[ <br><br> ]
A[Metrics-<br>Server]
subgraph B[노드]
direction TB
D[cAdvisor] --> C[kubelet]
E[컨테이너<br>런타임] --> D
E1[컨테이너<br>런타임] --> D
P[파드 데이터] -.- C
end
L[API<br>서버]
W[HPA]
C ---->|요약<br>API| A -->|메트릭<br>API| L --> W
end
L ---> K[kubectl<br>top]
classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
class W,B,P,K,cluster,D,E,E1 box
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class S spacewhite
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
class A,L,C k8s
{{< /mermaid >}}

그림 1. 리소스 메트릭 파이프라인

그림의 오른쪽에서 왼쪽 순으로, 아키텍처 구성 요소는 다음과 같다.

* [cAdvisor](https://github.com/google/cadvisor): kubelet에 포함된 컨테이너 메트릭을 
  수집, 집계, 노출하는 데몬
* [kubelet](/ko/docs/concepts/overview/components/#kubelet): 컨테이너 리소스 관리를 위한 노드 에이전트. 
  리소스 메트릭은 kubelet API 엔드포인트 `/metrics/resource` 및 
  `/stats` 를 사용하여 접근 가능하다.
* [요약 API](#summary-api-source): `/stats` 엔드포인트를 통해 사용할 수 있는 
  노드 별 요약된 정보를 탐색 및 수집할 수 있도록 kubelet이 제공하는 API
* [metrics-server](#metrics-server): 각 kubelet으로부터 수집한 리소스 메트릭을 수집 및 집계하는 클러스터 애드온 구성 요소. 
  API 서버는 HPA, VPA 및 `kubectl top` 명령어가 사용할 수 있도록 메트릭 API를 제공한다. 
  metrics-server는 메트릭 API에 대한 기준 구현(reference implementation) 중 하나이다.
* [메트릭 API](#metrics-api): 워크로드 오토스케일링에 사용되는 CPU 및 메모리 정보로의 접근을 지원하는 쿠버네티스 API. 
  이를 클러스터에서 사용하려면, 
  메트릭 API를 제공하는 API 확장(extension) 서버가 필요하다.

  {{< note >}}
  cAdvisor는 cgroups으로부터 메트릭을 가져오는 것을 지원하며, 리눅스의 일반적인 컨테이너 런타임은 이를 지원한다.
  만약 다른 리소스 격리 메커니즘(예: 가상화)을 사용하는 컨테이너 런타임을 사용한다면, 
  kubelet이 메트릭을 사용할 수 있기 위해서는 
  해당 컨테이너 런타임이 
  [CRI 컨테이너 메트릭](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/cri-container-stats.md)을 지원해야 한다.
  {{< /note >}}

<!-- body -->

## 메트릭 API {#metrics-api}
{{< feature-state for_k8s_version="1.8" state="beta" >}}

metrics-server는 메트릭 API에 대한 구현이다. 
이 API는 클러스터 내 노드와 파드의 CPU 및 메모리 사용 정보에 접근할 수 있게 해 준다. 
이것의 주 역할은 리소스 사용 메트릭을 쿠버네티스 오토스케일러 구성 요소에 제공하는 것이다.

다음은 `minikube` 노드에 대한 메트릭 API 요청 예시이며 
가독성 향상을 위해 `jq`를 활용한다.

```shell
kubectl get --raw "/apis/metrics.k8s.io/v1beta1/nodes/minikube" | jq '.'
```

다음은 `curl`을 이용하여 동일한 API 호출을 하는 명령어다.

```shell
curl http://localhost:8080/apis/metrics.k8s.io/v1beta1/nodes/minikube
```

응답 예시는 다음과 같다.

```json
{
  "kind": "NodeMetrics",
  "apiVersion": "metrics.k8s.io/v1beta1",
  "metadata": {
    "name": "minikube",
    "selfLink": "/apis/metrics.k8s.io/v1beta1/nodes/minikube",
    "creationTimestamp": "2022-01-27T18:48:43Z"
  },
  "timestamp": "2022-01-27T18:48:33Z",
  "window": "30s",
  "usage": {
    "cpu": "487558164n",
    "memory": "732212Ki"
  }
}
```

다음은 `kube-system` 네임스페이스 내의 `kube-scheduler-minikube` 파드에 대한 
메트릭 API 요청 예시이며 가독성 향상을 위해 `jq`를 활용한다.

```shell
kubectl get --raw "/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube" | jq '.'
```

다음은 `curl`을 이용하여 동일한 API 호출을 하는 명령어다.

```shell
curl http://localhost:8080/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube
```

응답 예시는 다음과 같다.

```json
{
  "kind": "PodMetrics",
  "apiVersion": "metrics.k8s.io/v1beta1",
  "metadata": {
    "name": "kube-scheduler-minikube",
    "namespace": "kube-system",
    "selfLink": "/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube",
    "creationTimestamp": "2022-01-27T19:25:00Z"
  },
  "timestamp": "2022-01-27T19:24:31Z",
  "window": "30s",
  "containers": [
    {
      "name": "kube-scheduler",
      "usage": {
        "cpu": "9559630n",
        "memory": "22244Ki"
      }
    }
  ]
}
```

메트릭 API는 [k8s.io/metrics](https://github.com/kubernetes/metrics) 저장소에 정의되어 있다. 
`metrics.k8s.io` API를 사용하기 위해서는 
[API 집계(aggregation) 계층](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)을 활성화하고 
[APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/)를 등록해야 한다.

메트릭 API에 대해 더 알아보려면, [리소스 메트릭 API 디자인](https://git.k8s.io/design-proposals-archive/instrumentation/resource-metrics-api.md),
[metrics-server 저장소](https://github.com/kubernetes-sigs/metrics-server) 및 
[리소스 메트릭 API](https://github.com/kubernetes/metrics#resource-metrics-api)를 참고한다.


{{< note >}}
메트릭 API에 접근하려면 먼저 메트릭 API를 제공하는 
metrics-server 또는 대체 어댑터를 배포해야 한다.
{{< /note >}}

## 리소스 사용량 측정 {#measuring-resource-usage}

### CPU

CPU는 `cpu` 단위로 측정된 평균 코어 사용량 형태로 보고된다. 쿠버네티스에서 1 cpu는 
클라우드 제공자의 경우 1 vCPU/코어에 해당하고, 베어메탈 인텔 프로세서의 경우 1 하이퍼-스레드에 해당한다.

이 값은 커널(Linux 및 Windows 커널 모두)에서 제공하는 누적 CPU 카운터에 대한 
비율을 취하여 얻어진다. 
CPU 값 계산에 사용된 타임 윈도우는 메트릭 API의 `window` 필드에 표시된다.

쿠버네티스가 어떻게 CPU 리소스를 할당하고 측정하는지 더 알아보려면, 
[CPU의 의미](/ko/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)를 참고한다.

### 메모리

메모리는 메트릭을 수집하는 순간에 바이트 단위로 측정된 워킹 셋(working set) 형태로 보고된다.

이상적인 환경에서, "워킹 셋"은 메모리가 부족한 상태더라도 해제할 수 없는 사용 중인 메모리의 양이다. 
그러나 워킹 셋의 계산 방법은 호스트 OS에 따라 다르며 
일반적으로 추정치를 추출하기 위해 휴리스틱을 많이 사용한다.

컨테이너의 워킹 셋에 대한 쿠버네티스 모델은 컨테이너 런타임이 해당 컨테이너와 연결된 익명(anonymous) 메모리를 계산할 것으로 예상한다. 
호스트 OS가 항상 페이지를 회수할 수는 없기 때문에, 
워킹 셋 메트릭에는 일반적으로 일부 캐시된 (파일 기반) 메모리도 포함된다.

쿠버네티스가 어떻게 메모리 리소스를 할당하고 측정하는지 더 알아보려면, 
[메모리의 의미](/ko/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)를 참고한다.

## metrics-server {#metrics-server}

metrics-server는 kubelet으로부터 리소스 메트릭을 수집하고, 
이를 HPA(Horizontal Pod Autoscaler) 및 VPA(Vertical Pod Autoscaler)가 활용할 수 있도록 쿠버네티스 API 서버 내에서 메트릭 API(Metrics API)를 통해 노출한다. 
`kubectl top` 명령을 사용하여 이 메트릭을 확인해볼 수도 있다.

metrics-server는 쿠버네티스 API를 사용하여 클러스터의 노드와 파드를 추적한다. 
metrics-server는 각 노드에 HTTP를 통해 질의하여 메트릭을 수집한다. 
metrics-server는 또한 파드 메타데이터의 내부적 뷰를 작성하고, 파드 헬스(health)에 대한 캐시를 유지한다. 
이렇게 캐시된 파드 헬스 정보는 metrics-server가 제공하는 확장 API(extension API)를 통해 이용할 수 있다.

HPA 질의에 대한 예시에서, 예를 들어 HPA 질의에 대한 경우, 
metrics-server는 디플로이먼트의 어떤 파드가 레이블 셀렉터 조건을 만족하는지 판별해야 한다.

metrics-server는 각 노드로부터 메트릭을 수집하기 위해 [kubelet](/docs/reference/command-line-tools-reference/kubelet/) API를 호출한다. 
사용 중인 metrics-server 버전에 따라, 다음의 엔드포인트를 사용한다.

* v0.6.0 이상: 메트릭 리소스 엔드포인트 `/metrics/resource`
* 이전 버전: 요약 API 엔드포인트 `/stats/summary`

## {{% heading "whatsnext" %}}

metrics-server에 대한 더 많은 정보는 
[metrics-server 저장소](https://github.com/kubernetes-sigs/metrics-server)를 확인한다.

또한 다음을 참고할 수도 있다.

* [metrics-server 디자인](https://git.k8s.io/design-proposals-archive/instrumentation/metrics-server.md)
* [metrics-server 자주 묻는 질문](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md)
* [metrics-server 알려진 이슈](https://github.com/kubernetes-sigs/metrics-server/blob/master/KNOWN_ISSUES.md)
* [metrics-server 릴리스](https://github.com/kubernetes-sigs/metrics-server/releases)
* [Horizontal Pod Autoscaling](/ko/docs/tasks/run-application/horizontal-pod-autoscale/)

kubelet이 어떻게 노드 메트릭을 제공하는지, 그리고 쿠버네티스 API를 통해 이러한 메트릭에 어떻게 접근하는지 알아보려면, 
[노드 메트릭 데이터](/ko/docs/reference/instrumentation/node-metrics/) 문서를 참조한다.
