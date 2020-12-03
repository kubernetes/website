---
title: 리소스 메트릭 파이프라인
content_type: concept
---

<!-- overview -->

컨테이너 CPU 및 메모리 사용량과 같은 리소스 사용량 메트릭은
쿠버네티스의 메트릭 API를 통해 사용할 수 있다. 이 메트릭은
`kubectl top` 커맨드 사용하여 사용자가 직접적으로 액세스하거나,
Horizontal Pod Autoscaler 같은 클러스터의 컨트롤러에서 결정을 내릴 때 사용될 수 있다.

<!-- body -->

## 메트릭 API

메트릭 API를 통해, 주어진 노드나 파드에서 현재 사용중인
리소스의 양을 알 수 있다. 이 API는 메트릭 값을 저장하지
않으므로, 예를 들어, 지정된 노드에서 10분 전에 사용된 리소스의 양을
가져오는 것과 같은 일을 할 수는 없다.

이 API와 다른 API는 차이가 없다.

- 다른 쿠버네티스 API의 엔드포인트와 같이 `/apis/metrics.k8s.io/` 하위 경로에서 발견될 수 있다
- 동일한 보안, 확장성 및 신뢰성 보장을 제공한다

[k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go)
리포지터리에서 이 API를 정의하고 있다. 여기에서 이 API에 대한 더 상세한 정보를 찾을 수 있다.

{{< note >}}
이 API를 사용하려면 메트릭 서버를 클러스터에 배포해야 한다. 그렇지 않으면 사용할 수 없다.
{{< /note >}}

## 리소스 사용량 측정

### CPU

CPU는 일정 기간 동안
[CPU 코어](/ko/docs/concepts/configuration/manage-resources-containers/#cpu의-의미)에서
평균 사용량으로 리포트된다. 이 값은 커널(리눅스와 윈도우 커널 모두)에서 제공하는
누적 CPU 카운터보다 높은 비율을 적용해서 얻는다.
kubelet은 비율 계산에 사용할 윈도우를 선택한다.

### 메모리

메모리는 메트릭이 수집된 순간 작업 집합으로 리포트 된다.
이상적인 환경에서 "작업 집합(working set)"은 압박(memory pressure)에서 풀려날 수 없는 사용 중인(in-use) 메모리의 양이다.
그러나 작업 집합의 계산은 호스트 OS에 따라 다르며, 일반적으로 휴리스틱스를 사용해서 평가한다.
쿠버네티스는 스왑(swap)을 지원하지 않기 때문에 모든 익명(파일로 백업되지 않은) 메모리를 포함한다.
호스트 OS가 항상 이러한 페이지를 회수할 수 없기 때문에 메트릭에는 일반적으로 일부 캐시된(파일 백업) 메모리도 포함된다.

## 메트릭 서버

[메트릭 서버](https://github.com/kubernetes-sigs/metrics-server)는 클러스터 전역에서 리소스 사용량 데이터를 집계한다.
`kube-up.sh` 스크립트에 의해 생성된 클러스터에는 기본적으로 메트릭 서버가
디플로이먼트 오브젝트로 배포된다. 만약 다른 쿠버네티스 설치 메커니즘을 사용한다면, 제공된
[디플로이먼트 components.yaml](https://github.com/kubernetes-sigs/metrics-server/releases) 파일을 사용하여 메트릭 서버를 배포할 수 있다.

메트릭 서버는 각 노드에서 [Kubelet](/docs/reference/command-line-tools-reference/kubelet/)에 의해
노출된 Summary API에서 메트릭을 수집하고, [쿠버네티스 aggregator](/ko/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)를
통해 메인 API 서버에 등록된다.

[설계 문서](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md)에서
메트릭 서버에 대해 자세하게 배울 수 있다.
