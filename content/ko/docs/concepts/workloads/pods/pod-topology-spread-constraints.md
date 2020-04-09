---
title: 파드 토폴로지 분배 제약 조건
content_template: templates/concept
weight: 50
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

사용자는 _토폴로지 분배 제약 조건_ 을 사용해서 지역, 영역, 노드 그리고 기타 사용자-정의 토폴로지 도메인과 같이 장애-도메인으로 설정된 클러스터에 걸쳐 파드가 분산되는 방식을 제어할 수 있다. 이를 통해 고가용성뿐만 아니라, 효율적인 리소스 활용의 목적을 이루는 데 도움이 된다.

{{% /capture %}}

{{% capture body %}}

## 필수 구성 요소

### 기능 게이트 활성화

를 참조한다. {{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}} **와** 
{{< glossary_tooltip text="스케줄러" term_id="kube-scheduler" >}}에 
대해 `EvenPodsSpread`
[기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)가 활성화되어야 한다.

### 노드 레이블

토폴로지 분배 제약 조건은 노드 레이블을 의지해서 각 노드가 속한 토폴로지 도메인(들)을 인식한다. 예를 들어, 노드에 다음과 같은 레이블을 가지고 있을 수 있다. `node=node1,zone=us-east-1a,region=us-east-1`

다음 레이블이 있고, 4개 노드를 가지는 클러스터가 있다고 가정한다.

```
NAME    STATUS   ROLES    AGE     VERSION   LABELS
node1   Ready    <none>   4m26s   v1.16.0   node=node1,zone=zoneA
node2   Ready    <none>   3m58s   v1.16.0   node=node2,zone=zoneA
node3   Ready    <none>   3m17s   v1.16.0   node=node3,zone=zoneB
node4   Ready    <none>   2m43s   v1.16.0   node=node4,zone=zoneB
```

그러면 클러스터는 논리적으로 다음과 같이 보이게 된다.

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
```

레이블을 수동으로 적용하는 대신에, 사용자는 대부분의 클러스터에서 자동으로 생성되고 채워지는 [잘-알려진 레이블](/docs/reference/kubernetes-api/labels-annotations-taints/)을 재사용할 수 있다.

## 파드의 분배 제약 조건

### API

`pod.spec.topologySpreadConstraints` 필드는 1.16에서 다음과 같이 도입되었다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  topologySpreadConstraints:
  - maxSkew: <integer>
    topologyKey: <string>
    whenUnsatisfiable: <string>
    labelSelector: <object>
```

사용자는 하나 또는 다중 `topologySpreadConstraint` 를 정의해서 kube-scheduler 에게 클러스터에 걸쳐 있는 기존 파드와 시작하는 각각의 파드와 연관하여 배치하는 방법을 명령할 수 있다. 필드는 다음과 같다.

- **maxSkew** 는 파드가 균등하지 않게 분산될 수 있는 정도를 나타낸다. 이것은 주어진 토폴로지 유형의 임의의 두 토폴로지 도메인에 일치하는 파드의 수 사이에서 허용되는 차이의 최댓값이다. 이것은 0보다는 커야 한다.
- **topologyKey** 는 노드 레이블의 키다. 만약 두 노드가 이 키로 레이블이 지정되고, 레이블이 동일한 값을 가진다면 스케줄러는 두 노드를 같은 토폴로지에 있는것으로 여기게 된다. 스케줄러는 각 토폴로지 도메인에 균형잡힌 수의 파드를 배치하려고 시도한다.
- **whenUnsatisfiable** 는 분산 제약 조건을 만족하지 않을 경우에 처리하는 방법을 나타낸다.
    - `DoNotSchedule` (기본값)은 스케줄러에 스케줄을 하지 말라고 알려준다.
    - `ScheduleAnyway` 는 스케줄러에게 차이(skew)를 최소화하는 노드에 높은 우선순위를 부여하면서, 스케줄을 계속하도록 지시한다.
- **labelSelector** 는 일치하는 파드를 찾는데 사용된다. 이 레이블 셀렉터와 일치하는 파드의 수를 계산하여 해당 토폴로지 도메인에 속할 파드의 수를 결정한다. 자세한 내용은 [레이블 셀렉터](/ko/docs/concepts/overview/working-with-objects/labels/#레이블-셀렉터)를 참조한다.

사용자는 `kubectl explain Pod.spec.topologySpreadConstraints` 를 실행해서 이 필드에 대한 자세한 내용을 알 수 있다.

### 예시: 단수 토폴로지 분배 제약 조건

4개 노드를 가지는 클러스터에 `foo:bar` 가 레이블된 3개의 파드가 node1, node2 그리고 node3에 각각 위치한다고 가정한다(`P`는 파드를 나타낸다).

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
|   P   |   P   |   P   |       |
+-------+-------+-------+-------+
```

신규 파드가 기존 파드와 함께 영역에 걸쳐서 균등하게 분배되도록 하려면, 스펙(spec)은 다음과 같이 주어질 수 있다.

{{< codenew file="pods/topology-spread-constraints/one-constraint.yaml" >}}

`topologyKey: zone` 는 "zone:<any value>" 레이블 쌍을 가지는 노드에 대해서만 균등한 분배를 적용하는 것을 의미한다. `whenUnsatisfiable: DoNotSchedule` 은 만약 들어오는 파드가 제약 조건을 만족시키지 못하면 스케줄러에게 pending 상태를 유지하도록 지시한다.

만약 스케줄러가 이 신규 파드를 "zoneA"에 배치하면 파드 분포는 [3, 1]이 되며, 따라서 실제 차이(skew)는 2 (3 - 1)가 되어 `maxSkew: 1` 를 위반하게 된다. 이 예시에서는 들어오는 파드는 오직 "zoneB"에만 배치할 수 있다.

```
+---------------+---------------+      +---------------+---------------+
|     zoneA     |     zoneB     |      |     zoneA     |     zoneB     |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |  OR  | node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
|   P   |   P   |   P   |   P   |      |   P   |   P   |  P P  |       |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
```

사용자는 파드 스펙을 조정해서 다음과 같은 다양한 요구사항을 충족할 수 있다.

- `maxSkew` 를 "2" 보다 큰 값으로 변경해서 들어오는 파드들이 "zoneA"에도 배치할 수 있도록 한다.
- `topologyKey` 를 "node"로 변경해서 파드가 영역이 아닌, 노드에 걸쳐 고르게 분산할 수 있게 한다. 위의 예시에서 만약 `maxSkew` 가 "1"로 유지되면 들어오는 파드는 오직 "node4"에만 배치할 수 있다.
- `whenUnsatisfiable: DoNotSchedule` 에서 `whenUnsatisfiable: ScheduleAnyway` 로 변경하면 들어오는 파드는 항상 다른 스케줄링 API를 충족한다는 가정하에 스케줄할 수 있도록 보장한다. 그러나 일치하는 파드가 적은 토폴로지 도메인에 배치되는 것이 좋다.  (이 선호도는 리소스 사용 비율 등과 같은 다른 내부 스케줄링 우선순위와 공동으로 정규화 된다는 것을 알아두자.)

### 예시: 다중 토폴로지 분배 제약 조건

4개 노드를 가지는 클러스터에 `foo:bar` 가 레이블된 3개의 파드가 node1, node2 그리고 node3에 각각 위치한다고 가정한다(`P`는 파드를 나타낸다).

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
|   P   |   P   |   P   |       |
+-------+-------+-------+-------+
```

사용자는 2개의 TopologySpreadConstraints를 사용해서 영역과 노드에 파드를 분배하는 것을 제어할 수 있다.

{{< codenew file="pods/topology-spread-constraints/two-constraints.yaml" >}}

이 경우에는, 첫번째 제약 조건에 부합시키려면, 신규 파드는 오직 "zoneB"에만 배치할 수 있다. 두 번째 제약 조건에서는 신규 파드는 오직 "node4"에만 배치할 수 있다. 그런 다음 두 가지 제약 조건의 결과는 AND 가 되므로, 실행 가능한 유일한 옵션은 "node4"에 배치하는 것이다.

다중 제약 조건은 충돌로 이어질 수 있다. 3개의 노드를 가지는 클러스터 하나가 2개의 영역에 걸쳐 있다고 가정한다.

```
+---------------+-------+
|     zoneA     | zoneB |
+-------+-------+-------+
| node1 | node2 | node3 |
+-------+-------+-------+
|  P P  |   P   |  P P  |
+-------+-------+-------+
```

만약 사용자가 "two-constraints.yaml" 을 이 클러스터에 적용하면, "mypod"가 `Pending` 상태로 유지되는 것을 알게 된다. 이러한 이유는, 첫 번째 제약 조건을 충족하기 위해 "mypod"는 오직 "zoneB"에만 놓을 수 있다. 두 번째 제약 조건에서는 "mypod"는 오직 "node2"에만 놓을 수 있다. 그러면 "zoneB"와 "node2"의 공동 결과는 아무것도 반환되지 않는다.

이 상황을 극복하기 위해서는 사용자가 `maxSkew` 의 증가 또는 `whenUnsatisfiable: ScheduleAnyway` 를 사용하도록 제약 조건 중 하나를 수정할 수 있다.

### 규칙

여기에 주목할만한 몇 가지 암묵적인 규칙이 있다.

- 신규 파드와 같은 네임스페이스를 갖는 파드만이 매칭의 후보가 된다.

- `topologySpreadConstraints[*].topologyKey` 가 없는 노드는 무시된다. 이것은 다음을 의미한다.
    1. 이러한 노드에 위치한 파드는 "maxSkew" 계산에 영향을 미치지 않는다. - 위의 예시에서, "node1"은 "zone"레이블을 가지고 있지 않다고 가정하면, 파드 2개는 무시될 것이고, 이런 이유로 신규 파드는 "zoneA"로 스케줄된다.
    2. 신규 파드는 이런 종류의 노드에 스케줄 될 기회가 없다. - 위의 예시에서, 레이블로 `{zone-typo: zoneC}` 를 가지는 "node5"가 클러스터에 편입한다고 가정하면, 레이블 키에 "zone"이 없기 때문에 무시하게 된다.

- 들어오는 파드의 `topologySpreadConstraints[*].labelSelector` 와 자체 레이블과 일치하지 않을 경우 어떻게 되는지 알고 있어야 한다. 위의 예시에서, 만약 들어오는 파드의 레이블을 제거하더라도 여전히 제약 조건이 충족하기 때문에 "zoneB"에 배치할 수 있다. 그러나, 배치 이후에도 클러스터의 불균형 정도는 변경되지 않는다. - 여전히 zoneA는 {foo:bar} 레이블을 가지고 있는 2개의 파드를 가지고 있고, zoneB 도 {foo:bar}를 레이블로 가지는 파드 1개를 가지고 있다. 따라서 만약 예상과 다르면, 워크로드의 `topologySpreadConstraints[*].labelSelector` 가 자체 레이블과 일치하도록 하는 것을 권장한다.

- 만약 신규 파드에 `spec.nodeSelector` 또는 `spec.affinity.nodeAffinity` 가 정의되어 있으면, 일치하지 않는 노드는 무시하게 된다.

    zoneA 에서 zoneC에 걸쳐있고, 5개의 노드를 가지는 클러스터가 있다고 가정한다.

    ```
    +---------------+---------------+-------+
    |     zoneA     |     zoneB     | zoneC |
    +-------+-------+-------+-------+-------+
    | node1 | node2 | node3 | node4 | node5 |
    +-------+-------+-------+-------+-------+
    |   P   |   P   |   P   |       |       |
    +-------+-------+-------+-------+-------+
    ```

    그리고 알다시피 "zoneC"는 제외해야 한다. 이 경우에, "mypod"가 "zoneC"가 아닌 "zoneB"에 배치되도록 yaml을 다음과 같이 구성할 수 있다. 마찬가지로 `spec.nodeSelector` 도 존중된다.

    {{< codenew file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" >}}

### 클러스터 수준의 기본 제약 조건

{{< feature-state for_k8s_version="v1.18" state="alpha" >}}

클러스터에 대한 기본 토폴로지 분배 제약 조건을 설정할 수 있다. 기본
토폴로지 분배 제약 조건은 다음과 같은 경우에만 파드에 적용된다.

- `.spec.topologySpreadConstraints` 에는 어떠한 제약도 정의되어 있지 않는 경우.
- 서비스, 레플리케이션 컨트롤러, 레플리카 셋 또는 스테이트풀 셋에 속해있는 경우.

기본 제약 조건은 [스케줄링 프로파일](/docs/reference/scheduling/profiles)에서
`PodTopologySpread` 플러그인의 일부로 설정할 수 있다.
제약 조건은 `labelSelector` 가 비어 있어야 한다는 점을 제외하고, [위와 동일한 API](#api)로
제약 조건을 지정한다. 셀렉터는 파드가 속한 서비스, 레플리케이션 컨트롤러,
레플리카 셋 또는 스테이트풀 셋에서 계산한다.

예시 구성은 다음과 같다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha2
kind: KubeSchedulerConfiguration

profiles:
  pluginConfig:
  - name: PodTopologySpread
    args:
      defaultConstraints:
      - maxSkew: 1
        topologyKey: failure-domain.beta.kubernetes.io/zone
        whenUnsatisfiable: ScheduleAnyway
```

{{< note >}}
기본 스케줄링 제약 조건에 의해 생성된 점수는
[`DefaultPodTopologySpread` 플러그인](/docs/reference/scheduling/profiles/#scheduling-plugins)에
의해 생성된 점수와 충돌 할 수 있다.
`PodTopologySpread` 에 대한 기본 제약 조건을 사용할 때 스케줄링 프로파일에서
이 플러그인을 비활성화 하는 것을 권장한다.
{{< /note >}}

## 파드어피니티(PodAffinity)/파드안티어피니티(PodAntiAffinity)와의 비교

쿠버네티스에서 "어피니티(Affinity)"와 관련된 지침은 파드가
더 많이 채워지거나 더 많이 분산되는 방식으로 스케줄 되는 방법을 제어한다. 

- `PodAffinity` 는, 사용자가 자격이 충족되는 토폴로지 도메인에
원하는 수의 파드를 얼마든지 채울 수 있다.
- `PodAntiAffinity` 로는, 단일 토폴로지 도메인에
단 하나의 파드만 스케줄 될 수 있다.

"EvenPodsSpread" 기능은 다양한 토폴로지 도메인에 파드를 균등하게 분배해서 
고 가용성 또는 비용 절감을 달성할 수 있는 유연한 옵션을 제공한다. 또한 워크로드의 롤링 업데이트와
레플리카의 원활한 스케일링 아웃에 도움이 될 수 있다.
더 자세한 내용은 [모티베이션(Motivation)](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/20190221-even-pods-spreading.md#motivation)를 참조한다.

## 알려진 제한사항

1.18을 기준으로 이 기능은 베타(Beta)이며, 몇 가지 알려진 제한사항이 있다.

- 디플로이먼트를 스케일링 다운하면 그 결과로 파드의 분포가 불균형이 될 수 있다.
- 파드와 일치하는 테인트(taint)가 된 노드가 존중된다. [이슈 80921](https://github.com/kubernetes/kubernetes/issues/80921)을 본다.

{{% /capture %}}
