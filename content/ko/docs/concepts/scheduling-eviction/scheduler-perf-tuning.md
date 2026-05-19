---
# reviewers:
# - bsalamat
title: 스케줄러 성능 튜닝
content_type: concept
weight: 70
---

<!-- overview -->

{{< feature-state for_k8s_version="1.14" state="beta" >}}

[kube-scheduler](/ko/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)는
쿠버네티스의 기본 스케줄러이다. 그것은 클러스터의
노드에 파드를 배치하는 역할을 한다.

파드의 스케줄링 요건을 충족하는
클러스터의 노드를 파드에 _적합한(feasible)_ 노드라고 한다. 스케줄러는
파드에 대해 적합한 노드를 찾고 기능 셋을 실행하여 해당 노드의 점수를
측정한다. 그리고 스케줄러는 파드를 실행하는데 적합한 모든 노드 중 가장
높은 점수를 가진 노드를 선택한다. 이후 스케줄러는 _바인딩_ 이라는 프로세스로
API 서버에 해당 결정을 통지한다.

본 페이지에서는 상대적으로 큰 규모의 쿠버네티스 클러스터에 대한 성능 튜닝
최적화에 대해 설명한다.

<!-- body -->

큰 규모의 클러스터에서는 스케줄러의 동작을 튜닝하여 응답 시간
(새 파드가 빠르게 배치됨)과 정확도(스케줄러가 배치 결정을 잘 못하는 경우가 드물게 됨)
사이에서의 스케줄링 결과를 균형 잡을 수 있다.

kube-scheduler 의 `percentageOfNodesToScore` 설정을 통해
이 튜닝을 구성 한다. 이 KubeSchedulerConfiguration 설정에 따라 클러스터의
노드를 스케줄링할 수 있는 임계값이 결정된다.

### 임계값 설정하기

`percentageOfNodesToScore` 옵션은 0과 100 사이의 값을
허용한다. 값 0은 kube-scheduler가 컴파일 된 기본값을
사용한다는 것을 나타내는 특별한 숫자이다.
`percentageOfNodesToScore` 를 100 보다 높게 설정해도 kube-scheduler는
마치 100을 설정한 것처럼 작동한다.

값을 변경하려면,
[kube-scheduler 구성 파일](/docs/reference/config-api/kube-scheduler-config.v1beta3/)을
편집한 다음 스케줄러를 재시작한다.
대부분의 경우, 구성 파일은 `/etc/kubernetes/config/kube-scheduler.yaml` 에서 찾을 수 있다.

이를 변경한 후에 다음을 실행해서

```bash
kubectl get pods -n kube-system | grep kube-scheduler
```

kube-scheduler 컴포넌트가 정상인지 확인할 수 있다.

## 노드 스코어링(scoring) 임계값 {#percentage-of-nodes-to-score}

스케줄링 성능을 향상시키기 위해 kube-scheduler는 실행 가능한
노드가 충분히 발견되면 이를 찾는 것을 중단할 수 있다. 큰 규모의 클러스터에서는
모든 노드를 고려하는 고지식한 접근 방식에 비해 시간이 절약된다.

클러스터에 있는 모든 노드의 정수 백분율로 충분한 노두의 수에
대한 임계값을 지정한다. kube-scheduler는 이 값을 노드의
정수 값(숫자)로 변환 한다. 스케줄링 중에 kube-scheduler가 구성된
비율을 초과 할만큼 충분히 실행 가능한 노드를 식별한 경우, kube-scheduler는
더 실행 가능한 노드를 찾는 검색을 중지하고
[스코어링 단계](/ko/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler-implementation)를 진행한다.

[스케줄러가 노드 탐색을 반복(iterate)하는 방법](#스케줄러가-노드-탐색을-반복-iterate-하는-방법)
은 이 프로세스를 자세히 설명한다.

### 기본 임계값

임계값을 지정하지 않으면 쿠버네티스는 100 노드 클러스터인
경우 50%, 5000 노드 클러스터인 경우 10%를 산출하는
선형 공식을 사용하여 수치를 계산한다. 자동 값의 하한선은 5% 이다.

즉, `percentageOfNodesToScore` 를 명시적으로 5보다 작게 설정하지
않은 경우 클러스터가 아무리 크더라도 kube-scheduler는
항상 클러스터의 최소 5%를 스코어링을 한다.

스케줄러가 클러스터의 모든 노드에 스코어링을 하려면
`percentageOfNodesToScore` 를 100으로 설정 한다.

## 예시

아래는 `percentageOfNodesToScore`를 50%로 설정하는 구성 예시이다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

percentageOfNodesToScore: 50
```

### percentageOfNodesToScore 튜닝

`percentageOfNodesToScore`는 1과 100 사이의 값이어야 하며
기본값은 클러스터 크기에 따라 계산된다. 또한 100 노드로 하드 코딩된
최솟값도 있다.

{{< note >}} 클러스터에서 적합한 노드가 100 미만인 경우, 스케줄러는 여전히
모든 노드를 확인한다. 그 이유는 스케줄러가 탐색을 조기 중단하기에는 적합한
노드의 수가 충분하지 않기 때문이다.

규모가 작은 클러스터에서는 `percentageOfNodesToScore` 에 낮은 값을 설정하면,
비슷한 이유로 변경 사항이 거의 또는 전혀 영향을 미치지 않게 된다.

클러스터에 수백 개 이하의 노드가 있는 경우 이 구성 옵션을
기본값으로 둔다. 이는 변경사항을 적용하더라도 스케줄러의
성능이 크게 향상되지 않는다.
{{< /note >}}

이 값을 세팅할 때 중요하고 자세한 사항은, 클러스터에서
적은 수의 노드에 대해서만 적합성을 확인하면, 주어진 파드에 대해서
일부 노드의 점수는 측정이되지 않는다는 것이다. 결과적으로, 주어진 파드를 실행하는데
가장 높은 점수를 가질 가능성이 있는 노드가 점수 측정 단계로 조차 넘어가지
않을 수 있다. 이것은 파드의 이상적인 배치보다 낮은 결과를 초래할 것이다.

`percentageOfNodesToScore` 를 매우 낮게 설정해서 kube-scheduler가
파드 배치 결정을 잘못 내리지 않도록 해야 한다. 스케줄러의 처리량에
대해 애플리케이션이 중요하고 노드 점수가 중요하지 않은 경우가 아니라면
백분율을 10% 미만으로 설정하지 말아야 한다. 즉, 가능한 한
모든 노드에서 파드를 실행하는 것이 좋다.

## 스케줄러가 노드 탐색을 반복(iterate)하는 방법

이 섹션은 이 특징의 상세한 내부 방식을 이해하고 싶은 사람들을
위해 작성되었다.

클러스터의 모든 노드가 파드 실행 대상으로 고려되어 공정한 기회를
가지도록, 스케줄러는 라운드 로빈(round robin) 방식으로 모든 노드에 대해서 탐색을
반복한다. 모든 노드가 배열에 나열되어 있다고 생각해보자. 스케줄러는 배열의
시작부터 시작하여 `percentageOfNodesToScore`에 명시된 충분한 수의 노드를
찾을 때까지 적합성을 확인한다. 그 다음 파드에 대해서는, 스케줄러가
이전 파드를 위한 노드 적합성 확인이 마무리된 지점인 노드 배열의 마지막
포인트부터 확인을 재개한다.

만약 노드들이 다중의 영역(zone)에 있다면, 다른 영역에 있는 노드들이 적합성
확인의 대상이 되도록 스케줄러는 다양한 영역에 있는 노드에 대해서
탐색을 반복한다. 예제로, 2개의 영역에 있는 6개의 노드를 생각해보자.

```
영역 1: 노드 1, 노드 2, 노드 3, 노드 4
영역 2: 노드 5, 노드 6
```

스케줄러는 노드의 적합성 평가를 다음의 순서로 실행한다.

```
노드 1, 노드 5, 노드 2, 노드 6, 노드 3, 노드 4
```

모든 노드를 검토한 후, 노드 1로 돌아간다.

## {{% heading "whatsnext" %}}

* [kube-scheduler 구성 레퍼런스(v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/) 확인
