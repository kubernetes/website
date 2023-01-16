---
title: 스케줄러 구성
content_type: concept
weight: 20
---

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

구성 파일을 작성하고 해당 경로를 커맨드 라인 인수로 전달하여
`kube-scheduler` 의 동작을 사용자 정의할 수 있다.

<!-- overview -->

<!-- body -->

스케줄링 프로파일(Profile)을 사용하면 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}에서
여러 단계의 스케줄링을 구성할 수 있다.
각 단계는 익스텐션 포인트(extension point)를 통해 노출된다. 플러그인은 이러한
익스텐션 포인트 중 하나 이상을 구현하여 스케줄링 동작을 제공한다.

KubeSchedulerConfiguration ([v1beta3](/docs/reference/config-api/kube-scheduler-config.v1beta3/)
또는 [v1](/docs/reference/config-api/kube-scheduler-config.v1/))
구조에 맞게 파일을 작성하고,
`kube-scheduler --config <filename>`을 실행하여
스케줄링 프로파일을 지정할 수 있다.

최소 구성은 다음과 같다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
clientConnection:
  kubeconfig: /etc/srv/kubernetes/kube-scheduler/kubeconfig
```

  {{< note >}}
  KubeSchedulerConfiguration [v1beta2](/docs/reference/config-api/kube-scheduler-config.v1beta2/)는
  v1.25부터 사용 중단되었고 v1.26부터 제거된다. KubeSchedulerConfiguration을
  [v1beta3](/docs/reference/config-api/kube-scheduler-config.v1beta3/) 또는 [v1](/docs/reference/config-api/kube-scheduler-config.v1/)로 전환한 뒤에
  쿠버네티스를 v1.25로 업그레이드하도록 한다.
  {{< /note >}}
## 프로파일

스케줄링 프로파일을 사용하면 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}에서
여러 단계의 스케줄링을 구성할 수 있다.
각 단계는 [익스텐션 포인트](#익스텐션-포인트)에 노출된다.
[플러그인](#스케줄링-플러그인)은 이러한 익스텐션 포인트 중
하나 이상을 구현하여 스케줄링 동작을 제공한다.

`kube-scheduler` 의 단일 인스턴스를 구성하여
[여러 프로파일](#여러-프로파일)을 실행할 수 있다.

### 익스텐션 포인트

스케줄링은 다음 익스텐션 포인트를 통해 노출되는 일련의 단계에서
발생한다.

1. `queueSort`: 이 플러그인은 스케줄링 대기열에서 보류 중인 파드를
   정렬하는 데 사용되는 정렬 기능을 제공한다. 대기열 정렬 플러그인은 한 번에 단 하나만 활성화될 수 있다.
   사용할 수 있다.
1. `preFilter`: 이 플러그인은 필터링하기 전에 파드 또는 클러스터에 대한 정보를
   사전 처리하거나 확인하는 데 사용된다. 이 플러그인은 파드를 unschedulable로
   표시할 수 있다.
1. `filter`: 이 플러그인은 스케줄링 정책의 단정(Predicates)과 동일하며
   파드를 실행할 수 없는 노드를 필터링하는 데 사용된다. 필터는
   구성된 순서대로 호출된다. 노드가 모든 필터를 통과하지 않으면 파드는 unschedulable로
   표시된다.
1. `postFilter`: 이 플러그인은 파드의 실행 가능한 노드를 찾을 수 없을 때,
   구성된 순서대로 호출된다. `postFilter` 플러그인이 파드 _schedulable_ 을 표시하는 경우,
   나머지 플러그인은 호출 되지 않는다.
1. `preScore`: 이것은 사전 스코어링 작업을 수행하는 데 사용할 수 있는
   정보성 익스텐션 포인트이다.
1. `score`: 이 플러그인은 필터링 단계를 통과한 각 노드에 점수를
   제공한다. 그런 다음 스케줄러는 가중치 합계가 가장 높은
   노드를 선택한다.
1. `reserve`: 지정된 파드에 리소스가 예약된 경우 플러그인에
   알리는 정보성 익스텐션 포인트이다. 플러그인은 또한
   `Reserve` 도중 또는 이후에 실패한 경우 호출 되는 `Unreserve` 호출을
   구현한다.
1. `permit`: 이 플러그인은 파드 바인딩을 방지하거나 지연시킬 수 있다.
1. `preBind`: 이 플러그인은 파드가 바인딩되기 전에 필요한 모든 작업을 수행한다.
1. `bind`: 플러그인은 파드를 노드에 바인딩한다. `bind` 플러그인은 순서대로 호출되며
   일단 바인딩이 완료되면 나머지 플러그인은 건너뛴다. bind
   플러그인은 적어도 하나 이상 필요하다.
1. `postBind`: 파드가 바인드된 후 호출되는
   정보성 익스텐션 포인트이다.
1. `multiPoint`: 이 필드는 플러그인들의 모든 적용 가능한 익스텐션 포인트에 대해
   플러그인들을 동시에 활성화하거나 비활성화할 수 있게 하는 환경 설정 전용 필드이다.

각 익스텐션 포인트에 대해 특정 [기본 플러그인](#스케줄링-플러그인)을 비활성화하거나
자체 플러그인을 활성화할 수 있다. 예를 들면, 다음과 같다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - plugins:
      score:
        disabled:
        - name: PodTopologySpread
        enabled:
        - name: MyCustomPluginA
          weight: 2
        - name: MyCustomPluginB
          weight: 1
```

비활성화된 배열의 이름으로 `*` 를 사용하여 해당 익스텐션 포인트에 대한
모든 기본 플러그인을 비활성화할 수 있다. 원하는 경우, 플러그인 순서를 재정렬하는 데
사용할 수도 있다.

### 스케줄링 플러그인 {#scheduling-plugins}

기본적으로 활성화된 다음의 플러그인은 이들 익스텐션 포인트 중
하나 이상을 구현한다.

- `ImageLocality`: 파드가 실행하는 컨테이너 이미지가 이미 있는 노드를
  선호한다.
  익스텐션 포인트: `score`.
- `TaintToleration`: [테인트(taint)와 톨러레이션(toleration)](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/)을
  구현한다.
  익스텐션 포인트 구현: `filter`, `preScore`, `score`.
- `NodeName`: 파드 명세 노드 이름이 현재 노드와 일치하는지 확인한다.
  익스텐션 포인트: `filter`.
- `NodePorts`: 노드에 요청된 파드 포트에 대해 사용 가능한 포트가 있는지 확인한다.
  익스텐션 포인트: `preFilter`, `filter`.
- `NodeAffinity`: [노드 셀렉터](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#노드-셀렉터-nodeselector)와
  [노드 어피니티](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#노드-어피니티)를
  구현한다.
  익스텐션 포인트: `filter`, `score`.
- `PodTopologySpread`: [파드 토폴로지 분배 제약 조건](/ko/docs/concepts/scheduling-eviction/topology-spread-constraints/)을
  구현한다.
  익스텐션 포인트: `preFilter`, `filter`, `preScore`, `score`.
- `NodeUnschedulable`: `.spec.unschedulable` 이 true로 설정된 노드를
  필터링한다.
  익스텐션 포인트: `filter`.
- `NodeResourcesFit`: 노드에 파드가 요청하는 모든 리소스가 있는지
  확인한다. 점수는 `LeastAllocated`(기본값), `MostAllocated`, `RequestedToCapacityRatio` 등
  3가지 전략 중 하나를 사용할 수 있다.
  익스텐션 포인트: `preFilter`, `filter`, `score`.
- `NodeResourcesBalancedAllocation`: 파드가 스케줄된 경우, 보다 균형잡힌 리소스 사용량을
  얻을 수 있는 노드를 선호한다.
  익스텐션 포인트: `score`.
- `VolumeBinding`: 노드에 요청된 {{< glossary_tooltip text="볼륨" term_id="volume" >}}이 있는지
  또는 바인딩할 수 있는지 확인한다.
  익스텐션 포인트: `preFilter`, `filter`, `reserve`, `preBind`, `score`.
  {{< note >}}
  `score` 익스텐션 포인트는 `VolumeCapacityPriority` 기능이
  활성화되어 있어야 활성화되며,
  요청된 볼륨 사이즈를 만족하는 가장 작은 PV들을 우선순위 매긴다.
  {{< /note >}}
- `VolumeRestrictions`: 노드에 마운트된 볼륨이 볼륨 제공자에 특정한
  제한 사항을 충족하는지 확인한다.
  익스텐션 포인트: `filter`.
- `VolumeZone`: 요청된 볼륨이 가질 수 있는 영역 요구 사항을 충족하는지
  확인한다.
  익스텐션 포인트: `filter`.
- `NodeVolumeLimits`: 노드에 대해 CSI 볼륨 제한을 충족할 수 있는지
  확인한다.
  익스텐션 포인트: `filter`.
- `EBSLimits`: 노드에 대해 AWS EBS 볼륨 제한을 충족할 수 있는지 확인한다.
  익스텐션 포인트: `filter`.
- `GCEPDLimits`: 노드에 대해 GCP-PD 볼륨 제한을 충족할 수 있는지 확인한다.
  익스텐션 포인트: `filter`.
- `AzureDiskLimits`: 노드에 대해 Azure 디스크 볼륨 제한을 충족할 수 있는지
  확인한다.
  익스텐션 포인트: `filter`.
- `InterPodAffinity`: [파드 간 어피니티 및 안티-어피니티](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#파드간-어피니티와-안티-어피니티)를
  구현한다.
  익스텐션 포인트: `preFilter`, `filter`, `preScore`, `score`.
- `PrioritySort`: 기본 우선 순위 기반 정렬을 제공한다.
  익스텐션 포인트: `queueSort`.
- `DefaultBinder`: 기본 바인딩 메커니즘을 제공한다.
  익스텐션 포인트: `bind`.
- `DefaultPreemption`: 기본 선점 메커니즘을 제공한다.
  익스텐션 포인트: `postFilter`.

기본으로 활성화되지 않는 다음의 플러그인을
컴포넌트 구성 API를 통해 활성화할 수도 있다.

- `CinderLimits`: 노드에 대해 [OpenStack Cinder](https://docs.openstack.org/cinder/)
  볼륨 제한이 충족될 수 있는지 확인한다.
  익스텐션 포인트: `filter`.

### 여러 프로파일

둘 이상의 프로파일을 실행하도록 `kube-scheduler` 를 구성할 수 있다.
각 프로파일에는 연관된 스케줄러 이름이 있으며 [익스텐션 포인트](#익스텐션-포인트)에 구성된
다른 플러그인 세트를 가질 수 있다.

다음의 샘플 구성을 사용하면, 스케줄러는 기본 플러그인이 있는
프로파일과 모든 스코어링 플러그인이 비활성화된 프로파일의 두 가지 프로파일로
실행된다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
  - schedulerName: no-scoring-scheduler
    plugins:
      preScore:
        disabled:
        - name: '*'
      score:
        disabled:
        - name: '*'
```

특정 프로파일에 따라 스케줄하려는 파드는
`.spec.schedulerName` 에 해당 스케줄러 이름을 포함할 수 있다.

기본적으로, 스케줄러 이름 `default-scheduler` 를 가진 하나의 프로파일이 생성된다.
이 프로파일에는 위에서 설명한 기본 플러그인이 포함되어 있다. 둘 이상의
프로파일을 선언할 때, 각각에 대한 고유한 스케줄러 이름이 필요하다.

파드가 스케줄러 이름을 지정하지 않으면, kube-apiserver는 이를 `default-scheduler` 로
설정한다. 따라서, 해당 파드를 스케줄하려면 이 스케줄러 이름을 가진 프로파일이
있어야 한다.

{{< note >}}
파드의 스케줄링 이벤트에는 ReportingController로 `.spec.schedulerName` 이 있다.
리더 선출을 위한 이벤트는 목록에서 첫 번째 프로파일의 스케줄러 이름을
사용한다.
{{< /note >}}

{{< note >}}
모든 프로파일은 `queueSort` 익스텐션 포인트에서 동일한 플러그인을 사용해야 하며
동일한 구성 파라미터(해당하는 경우)를 가져야 한다. 그 이유는 스케줄러가 보류 중 상태인 파드 대기열을
단 하나만 가질 수 있기 때문이다.
{{< /note >}}

### 다수의 익스텐션 포인트에 플러그인 적용하기 {#multipoint}

`kubescheduler.config.k8s.io/v1beta3` 부터,
다수의 익스텐션 포인트에 대해 플러그인을 쉽게 활성화하거나
비활성화할 수 있게 하는 프로파일 환경 설정 `multiPoint` 가 추가되었다.
이를 사용하여 사용자와 관리자가 커스텀 프로파일을 사용할 때 환경 설정을 간소화할 수 있다.

`preScore`, `score`, `preFilter`, `filter` 익스텐션 포인트가 있는 `MyPlugin` 이라는 플러그인이 있다고 가정하자.
모든 사용 가능한 익스텐션 포인트에 대해 `MyPlugin` 을 활성화하려면,
다음과 같은 프로파일 환경 설정을 사용한다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: MyPlugin
```

위의 예시는 아래와 같이 모든 익스텐션 포인트에 대해 `MyPlugin` 을 수동으로 활성화하는 것과
동일한 효과를 갖는다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: non-multipoint-scheduler
    plugins:
      preScore:
        enabled:
        - name: MyPlugin
      score:
        enabled:
        - name: MyPlugin
      preFilter:
        enabled:
        - name: MyPlugin
      filter:
        enabled:
        - name: MyPlugin
```

여기서 `multiPoint` 를 사용했을 때의 이점은,
추후 `MyPlugin` 이 다른 익스텐션 포인트에 대한 구현을 추가했을 때,
새로운 익스텐션에 대해서도 `multiPoint` 환경 설정이 자동으로 활성화될 것이라는 점이다.

`disabled` 필드를 사용하여, `MultiPoint` 확장으로부터 특정 익스텐션 포인트를 제외할 수 있다.
기본 플러그인을 비활성화하거나, 기본이 아닌(non-default) 플러그인을 비활성화하거나,
와일드카드(`'*'`)를 사용하여 모든 플러그인을 비활성화할 수 있다.
다음은 `Score` 와 `PreScore` 에 대해 비활성화하는 예시이다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: non-multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: 'MyPlugin'
      preScore:
        disabled:
        - name: '*'
      score:
        disabled:
        - name: '*'
```

`kubescheduler.config.k8s.io/v1beta3` 부터, `MultiPoint` 필드를 통해
내부적으로 모든 [기본 플러그인](#scheduling-plugins)이 활성화된다.
그러나, 개별 익스텐션 포인트에 대해 기본값(예: 순서, Score 가중치)을 유연하게 재설정하는 것도 여전히 가능하다.
예를 들어, 2개의 Score 플러그인 `DefaultScore1` 과 `DefaultScore2` 가 있고
각각의 가중치가 `1` 이라고 하자.
이 때, 다음과 같이 가중치를 다르게 설정하여 순서를 바꿀 수 있다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      score:
        enabled:
        - name: 'DefaultScore2'
          weight: 5
```

이 예제에서, 이 플러그인들을 `MultiPoint` 에 명시할 필요는 없는데,
이는 이 플러그인들이 기본 플러그인이기 때문이다.
그리고 `Score` 에는 `DefaultScore2` 플러그인만 명시되었다.
이는 익스텐션 포인트를 명시하여 설정된 플러그인은 언제나 `MultiPoint` 플러그인보다 우선순위가 높기 때문이다.
결론적으로, 위의 예시에서는 두 플러그인을 모두 명시하지 않고도 두 플러그인의 순서를 조정하였다.

`MultiPoint` 플러그인을 설정할 때, 일반적인 우선 순위는 다음과 같다.
1. 명시된 익스텐션 포인트가 먼저 실행되며, 여기에 명시된 환경 설정은 다른 모든 곳에 설정된 내용보다 우선한다.
2. `MultiPoint` 및 플러그인 설정을 통해 수동으로 구성된 플러그인
3. 기본 플러그인 및 기본 플러그인의 기본 설정

위의 우선 순위를 설명하기 위해, 다음과 같은 예시를 가정한다.
| 플러그인 | 익스텐션 포인트 |
|---|---|
|`DefaultQueueSort`|`QueueSort`|
|`CustomQueueSort`|`QueueSort`|
|`DefaultPlugin1`|`Score`, `Filter`|
|`DefaultPlugin2`|`Score`|
|`CustomPlugin1`|`Score`, `Filter`|
|`CustomPlugin2`|`Score`, `Filter`|

이들 플러그인에 대한 유효한 예시 환경 설정은 다음과 같다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: 'CustomQueueSort'
        - name: 'CustomPlugin1'
          weight: 3
        - name: 'CustomPlugin2'
        disabled:
        - name: 'DefaultQueueSort'
      filter:
        disabled:
        - name: 'DefaultPlugin1'
      score:
        enabled:
        - name: 'DefaultPlugin2'
```

명시한 익스텐션 포인트 내에 `MultiPoint` 플러그인을 재정의해도 에러가 발생하지 않음에 유의한다.
명시한 익스텐션 포인트의 우선 순위가 더 높으므로,
이 재정의는 무시되고 로그에만 기록된다.

대부분의 환경 설정을 한 곳에서 관리하는 것 말고도, 이 예시는 다음과 같은 내용을 포함한다.
* 커스텀 `queueSort` 플러그인을 활성화하고 기존의 기본 플러그인을 비활성화한다
* `CustomPlugin1` 과 `CustomPlugin2` 플러그인을 활성화하며, 이 플러그인에 연결된 모든 익스텐션 포인트를 위해 이 플러그인들이 먼저 실행된다
* `filter` 에 대해서만 `DefaultPlugin1` 을 비활성화한다
* `score` 에 대해, `DefaultPlugin2` 플러그인이 (심지어 커스텀 플러그인보다도) 가장 먼저 실행되도록 순서를 조정한다

`multiPoint` 필드가 없는 `v1beta3` 이전 버전의 환경 설정에서는, 위의 스니펫을 다음과 같이 표현할 수 있다.
```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:

      # 기본 QueueSort 플러그인을 비활성화한다
      queueSort:
        enabled:
        - name: 'CustomQueueSort'
        disabled:
        - name: 'DefaultQueueSort'

      # 커스텀 Filter 플러그인을 활성화한다
      filter:
        enabled:
        - name: 'CustomPlugin1'
        - name: 'CustomPlugin2'
        - name: 'DefaultPlugin2'
        disabled:
        - name: 'DefaultPlugin1'

      # 커스텀 score 플러그인을 활성화하고 순서를 조정한다
      score:
        enabled:
        - name: 'DefaultPlugin2'
          weight: 1
        - name: 'DefaultPlugin1'
          weight: 3
```

다소 복잡한 예시를 통해, 익스텐션 포인트를 설정함에 있어서 `MultiPoint` 환경 설정의 유연성과
기존 방법과의 끊김없는 통합을 확인할 수 있다.

## 스케줄러 설정 전환

{{< tabs name="tab_with_md" >}}
{{% tab name="v1beta1 → v1beta2" %}}
* 설정 버전 v1beta2 에서는, `NodeResourcesFit` 플러그인을 위한 새로운 스코어링 확장을
  이용할 수 있다.
  새 확장은 `NodeResourcesLeastAllocated`, `NodeResourcesMostAllocated`,
  `RequestedToCapacityRatio` 플러그인의 기능을 통합하여 제공한다.
  예를 들어, 이전에 `NodeResourcesMostAllocated` 플러그인을 사용했다면,
  대신 `NodeResourcesFit`(기본적으로 활성화되어 있음)을 사용하면서
  다음과 같이 `scoreStrategy`를 포함하는 `pluginConfig`를 추가할 수 있다.
  ```yaml
  apiVersion: kubescheduler.config.k8s.io/v1beta2
  kind: KubeSchedulerConfiguration
  profiles:
  - pluginConfig:
    - args:
        scoringStrategy:
          resources:
          - name: cpu
            weight: 1
          type: MostAllocated
      name: NodeResourcesFit
  ```

* 스케줄러 플러그인 `NodeLabel`은 사용 중단되었다. 대신, 비슷한 효과를 얻기 위해 [`NodeAffinity`](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#어피니티-affinity-와-안티-어피니티-anti-affinity) 플러그인(기본적으로 활성화되어 있음)을 사용한다.

* 스케줄러 플러그인 `ServiceAffinity`은 사용 중단되었다. 대신, 비슷한 효과를 얻기 위해 [`InterPodAffinity`](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#파드간-어피니티와-안티-어피니티) 플러그인(기본적으로 활성화되어 있음)을 사용한다.

* 스케줄러 플러그인 `NodePreferAvoidPods`은 사용 중단되었다. 대신, 비슷한 효과를 얻기 위해 [노드 테인트](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/)를 사용한다.

* v1beta2 설정 파일에서 활성화된 플러그인은 해당 플러그인의 기본 설정값보다 v1beta2 설정 파일의 값이 우선 적용된다.

* 스케줄러 healthz와 metrics 바인드 주소에 대해 `host` 또는 `port` 가 잘못 설정되면 검증 실패를 유발한다.
{{% /tab %}}

{{% tab name="v1beta2 → v1beta3" %}}
* 세 플러그인의 가중치 기본값이 다음과 같이 증가한다.
  * `InterPodAffinity`: 1 에서 2 로
  * `NodeAffinity`: 1 에서 2 로
  * `TaintToleration`: 1 에서 3 으로
{{% /tab %}}

{{% tab name="v1beta3 → v1" %}}
* 스케줄러 플러그인 `SelectorSpread`는 제거되었다. 대신, 비슷한 효과를 얻기 위해
`PodTopologySpread` 플러그인(기본적으로 활성화되어 있음)을 사용한다.
{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [kube-scheduler 레퍼런스](/docs/reference/command-line-tools-reference/kube-scheduler/) 읽어보기
* [스케줄링](/ko/docs/concepts/scheduling-eviction/kube-scheduler/)에 대해 알아보기
* [kube-scheduler 설정 (v1beta2)](/docs/reference/config-api/kube-scheduler-config.v1beta2/) 레퍼런스 읽어보기
* [kube-scheduler 설정 (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/) 레퍼런스 읽어보기
* [kube-scheduler 설정 (v1)](/docs/reference/config-api/kube-scheduler-config.v1/) 레퍼런스 읽어보기