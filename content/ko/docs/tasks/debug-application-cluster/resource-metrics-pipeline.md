---
title: 리소스 메트릭 파이프라인
content_template: templates/concept
---

{{% capture overview %}}

쿠버네티스 1.8 부터 컨테이너 CPU 및 메모리 사용량과 같은 리소스 사용량 메트릭은 
쿠버네티스의 Metrics API를 통해 사용할 수 있다. 이 메트릭은 
`kubectl top` 커맨드 사용과 같이 사용자가 직접적으로 액세스하거나, 
Horizontal Pod Autoscaler 같은 클러스터의 컨트롤러에서 결정을 내릴 때 사용될 수 있다. 

{{% /capture %}}


{{% capture body %}}

## Metrics API

Metrics API를 통해 주어진 노드나 파드에서 현재 사용중인 
리소스의 양을 알 수 있다. 이 API는 메트릭 값을 저장하지 
않으므로 지정된 노드에서 10분 전에 사용된 리소스의 양을 
가져오는 것과 같은 일을 할 수는 없다.

이 API와 다른 API는 차이가 없다.

- 다른 쿠버네티스 API의 엔드포인트와 같이 `/apis/metrics.k8s.io/` 하위 경로에서 발견될 수 있다
- 동일한 보안, 확장성 및 신뢰성 보장을 제공한다

[k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go) 
리포지터리에서 이 API를 정의하고 있다. 여기에서 이 API에 대한 더 상세한 정보를 찾을 수 있다.

{{< note >}}
이 API를 사용하려면 Metrics server를 클러스터에 배포해야 한다. 그렇지 않으면 사용할 수 없다.
{{< /note >}}

## Metrics Server

[Metrics server](https://github.com/kubernetes-incubator/metrics-server)는 클러스터 전역에서 리소스 사용량 데이터를 집계한다.
쿠버네티스 1.8 부터 `kube-up.sh` 스크립트에 의해 생성된 클러스터에는 기본적으로 Metrics server가 
디플로이먼트 오브젝트로 배포된다. 만약 다른 쿠버네티스 설치 메커니즘을 사용한다면, 제공된 
[배포 yaml들](https://github.com/kubernetes-incubator/metrics-server/tree/master/deploy)을 사용하여 Metrics server를 배포할 수 있다.
이 방식은 쿠버네티스 1.7 이상에서 지원된다. (상세 사항은 아래를 참조)

Metric server는 각 노드에서 [Kubelet](/docs/admin/kubelet/)에 의해 노출된 Summary API에서 메트릭을 수집한다.

Metrics server는 쿠버네티스 1.7에서 도입된 
[쿠버네티스 aggregator](/docs/concepts/api-extension/apiserver-aggregation/)를 
통해 메인 API 서버에 등록된다.

[설계 문서](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md)에서 Metrics server에 대해 자세하게 배울 수 있다.

{{% /capture %}}
