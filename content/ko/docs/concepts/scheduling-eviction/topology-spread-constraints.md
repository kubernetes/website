---
title: 파드 토폴로지 분배 제약 조건
content_type: concept
weight: 40
---


<!-- overview -->

사용자는 _토폴로지 분배 제약 조건_ 을 사용하여 
지역(region), 존(zone), 노드 및 기타 사용자 정의 토폴로지 도메인과 같이 
장애 도메인으로 설정된 클러스터에 걸쳐 
{{< glossary_tooltip text="파드" term_id="Pod" >}}가 분배되는 방식을 제어할 수 있다. 
이를 통해 고가용성뿐만 아니라 효율적인 리소스 활용의 목적을 이루는 데에도 도움이 된다.

[클러스터-수준 제약](#cluster-level-default-constraints)을 기본값으로 설정하거나, 
개별 워크로드마다 각각의 토폴로지 분배 제약 조건을 설정할 수 있다.

<!-- body -->

## 동기(motivation)

최대 20 노드로 이루어진 클러스터가 있고, 레플리카 수를 자동으로 조절하는 
{{< glossary_tooltip text="워크로드" term_id="workload" >}}를 
실행해야 하는 상황을 가정해 보자. 
파드의 수는 2개 정도로 적을 수도 있고, 15개 정도로 많을 수도 있다. 
파드가 2개만 있는 상황에서는, 해당 파드들이 동일 노드에서 실행되는 것은 원치 않을 것이다. 
단일 노드 장애(single node failure)로 인해 
전체 워크로드가 오프라인이 될 수 있기 때문이다.

이러한 기본적 사용 뿐만 아니라, 고가용성(high availability) 및 
클러스터 활용(cluster utilization)으로부터 오는 장점을 워크로드가 누리도록 하는 고급 사용 예시도 존재한다.

워크로드를 스케일 업 하여 더 많은 파드를 실행함에 따라, 중요성이 부각되는 다른 요소도 존재한다. 
3개의 노드가 각각 5개의 파드를 실행하는 경우를 가정하자. 
각 노드는 5개의 레플리카를 실행하기에 충분한 성능을 갖고 있다. 
하지만, 이 워크로드와 통신하는 클라이언트들은 
3개의 서로 다른 데이터센터(또는 인프라스트럭처 존(zone))에 걸쳐 존재한다. 
이제 단일 노드 장애에 대해서는 덜 걱정해도 되지만, 지연 시간(latency)이 증가하고, 
서로 다른 존 간에 네트워크 트래픽을 전송하기 위해 네트워크 비용을 지불해야 한다.

정상적인 동작 중에는 각 인프라스트럭처 존에 
비슷한 수의 레플리카가 [스케줄](/ko/docs/concepts/scheduling-eviction/)되고, 
클러스터에 문제가 있는 경우 스스로 치유하도록 설정할 수 있다.

파드 토폴로지 분배 제약 조건은 이러한 설정을 할 수 있도록 하는 선언적인 방법을 제공한다.

## `topologySpreadConstraints` 필드

파드 API에 `spec.topologySpreadConstraints` 필드가 있다. 이 필드는 다음과 같이 
쓰인다.

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # 토폴로지 분배 제약 조건을 구성한다.
  topologySpreadConstraints:
    - maxSkew: <integer>
      minDomains: <integer> # 선택 사항이며, v1.25에서 베타 기능으로 도입되었다.
      topologyKey: <string>
      whenUnsatisfiable: <string>
      labelSelector: <object>
      matchLabelKeys: <list> # 선택 사항이며, v1.25에서 알파 기능으로 도입되었다.
      nodeAffinityPolicy: [Honor|Ignore] # 선택 사항이며, v1.26에서 베타 기능으로 도입되었다.
      nodeTaintsPolicy: [Honor|Ignore] # 선택 사항이며, v1.26에서 베타 기능으로 도입되었다.
  ### 파드의 다른 필드가 이 아래에 오게 된다.
```

`kubectl explain Pod.spec.topologySpreadConstraints` 명령을 실행하거나 파드에 관한 API 레퍼런스의
[스케줄링](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling) 섹션을 참조해서 이 필드에 대해 좀 더 알아볼 수 있다.

### 분배 제약 조건 정의

하나 또는 다중 `topologySpreadConstraint` 를 정의하여, 
kube-scheduler가 어떻게 클러스터 내에서 기존 파드와의 관계를 고려하며 
새로운 파드를 배치할지를 지시할 수 있다. 각 필드는 다음과 같다.

- **maxSkew** 는 파드가 균등하지 않게 분산될 수 있는 정도를 나타낸다.
  이 필드는 필수이며, 0 보다는 커야 한다. 
  이 필드 값의 의미는 `whenUnsatisfiable` 의 값에 따라 다르다.

  - `whenUnsatisfiable: DoNotSchedule`을 선택했다면, 
    `maxSkew`는 대상 토폴로지에서 일치하는 파드 수와 
    _전역 최솟값(global minimum)_ (적절한 도메인 내에서 일치하는 파드의 최소 수, 또는 적절한 도메인의 수가 `minDomains`보다 작은 경우에는 0)  
    사이의 최대 허용 차이를 나타낸다. 
    예를 들어, 3개의 존에 각각 2, 2, 1개의 일치하는 파드가 있으면, 
    `maxSkew`는 1로 설정되고 전역 최솟값은 1로 설정된다.
  - `whenUnsatisfiable: ScheduleAnyway`를 선택하면, 
    스케줄러는 차이(skew)를 줄이는 데 도움이 되는 토폴로지에 더 높은 우선 순위를 부여한다.

- **minDomains** 는 적합한(eligible) 도메인의 최소 수를 나타낸다. 이 필드는 선택 사항이다.
  도메인은 토폴로지의 특정 인스턴스 중 하나이다.
  도메인의 노드가 노드 셀렉터에 매치되면 그 도메인은 적합한 도메인이다.

  {{< note >}}
  `minDomains` 필드는 1.25에서 기본적으로 사용하도록 설정된 베타 필드이다. 사용을 원하지 않을 경우 
  `MinDomainsInPodTopologySpread` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 비활성화한다.
  {{< /note >}}
  
  - `minDomains` 값을 명시하는 경우, 이 값은 0보다 커야 한다. 
    `minDomains`는 `whenUnsatisfiable: DoNotSchedule`일 때에만 지정할 수 있다.
  - 매치되는 토폴로지 키의 적합한 도메인 수가 `minDomains`보다 적으면,
    파드 토폴로지 스프레드는 전역 최솟값을 0으로 간주한 뒤, `skew` 계산을 수행한다.
    전역 최솟값은 적합한 도메인 내에 매치되는 파드의 최소 수이며,
    적합한 도메인 수가 `minDomains`보다 적은 경우에는 0이다.
  - 매치되는 토폴로지 키의 적합한 도메인 수가 `minDomains`보다 크거나 같으면,
    이 값은 스케줄링에 영향을 미치지 않는다.
  - `minDomains`를 명시하지 않으면, 분배 제약 조건은 `minDomains`가 1이라고 가정하고 동작한다.

- **topologyKey** 는 [노드 레이블](#node-labels)의 키(key)이다. 이 키와 동일한 값을 가진 
  레이블이 있는 노드는 동일한 토폴로지에 있는 것으로 간주된다.  
  토폴로지의 각 인스턴스(즉, <키, 값> 쌍)를 도메인이라고 한다. 스케줄러는
  각 도메인에 균형잡힌 수의 파드를 배치하려고 시도할 것이다.
	또한, 노드가 nodeAffinityPolicy 및 nodeTaintsPolicy의 요구 사항을 충족하는 도메인을
	적절한 도메인이라고 정의한다.

- **whenUnsatisfiable** 는 분산 제약 조건을 만족하지 않을 경우에 파드를 처리하는 방법을 나타낸다.
  - `DoNotSchedule`(기본값)은 스케줄러에 스케줄링을 하지 말라고 알려준다.
  - `ScheduleAnyway`는 스케줄러에게 차이(skew)를 최소화하는 노드에 높은 우선 순위를 부여하면서, 스케줄링을 계속하도록 지시한다.

- **labelSelector** 는 일치하는 파드를 찾는 데 사용된다. 
  이 레이블 셀렉터와 일치하는 파드의 수를 계산하여 
  해당 토폴로지 도메인에 속할 파드의 수를 결정한다. 
  자세한 내용은 
  [레이블 셀렉터](/ko/docs/concepts/overview/working-with-objects/labels/#레이블-셀렉터)를 참조한다.

- **matchLabelKeys** 는 분배도(spreading)가 계산될 파드를 선택하기 위한 파드 레이블
  키 목록이다. 키는 파드 레이블에서 값을 조회하는 데 사용되며, 이러한 키-값 레이블은 `labelSelector`와 AND 처리되어 들어오는 파드(incoming pod)에 대해 분배도가 계산될 기존 파드 그룹의 선택에 사용된다. 파드 레이블에 없는 키는 무시된다. null 또는 비어 있는 목록은 `labelSelector`와만 일치함을 의미한다.

  `matchLabelKeys`를 사용하면, 사용자는 다른 리비전 간에 `pod.spec`을 업데이트할 필요가 없다. 컨트롤러/오퍼레이터는 다른 리비전에 대해 동일한 `label`키에 다른 값을 설정하기만 하면 된다. 스케줄러는 `matchLabelKeys`를 기준으로 값을 자동으로 가정할 것이다. 예를 들어 사용자가 디플로이먼트를 사용하는 경우, 디플로이먼트 컨트롤러에 의해 자동으로 추가되는 `pod-template-hash`로 키가 지정된 레이블을 사용함으로써 단일 디플로이먼트에서 서로 다른 리비전을 구별할 수 있다.

  ```yaml
      topologySpreadConstraints:
          - maxSkew: 1
            topologyKey: kubernetes.io/hostname
            whenUnsatisfiable: DoNotSchedule
            matchLabelKeys:
              - app
              - pod-template-hash
  ```

  {{< note >}}
  `matchLabelKeys` 필드는 1.25에서 추가된 알파 필드이다. 이 필드를 사용하려면
  `MatchLabelKeysInPodTopologySpread` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)
  를 활성화시켜야 한다.
  {{< /note >}}

- **nodeAffinityPolicy**는 파드 토폴로지의 스프레드 스큐(spread skew)를 계산할 때
  파드의 nodeAffinity/nodeSelector를 다루는 방법을 나타낸다. 옵션은 다음과 같다.
  - Honor: nodeAffinity/nodeSelector와 일치하는 노드만 계산에 포함된다.
  - Ignore: nodeAffinity/nodeSelector는 무시된다. 모든 노드가 계산에 포함된다.

  옵션의 값이 null일 경우, Honor 정책과 동일하게 동작한다.

  {{< note >}}
  `nodeAffinityPolicy` 필드는 베타 필드이고 1.26에서 기본적으로 활성화되어 있다. 이 필드를 비활성화하려면
  `NodeInclusionPolicyInPodTopologySpread` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)
  를 비활성화하면 된다.
  {{< /note >}}

- **nodeTaintsPolicy**는 파드 토폴로지의 스프레드 스큐(spread skew)를 계산할 때 노드 테인트(taint)를 
  다루는 방법을 나타낸다. 옵션은 다음과 같다.
  - Honor: 테인트가 없는 노드, 그리고 노드가 톨러레이션이 있는 들어오는 파드(incoming pod)를 위한 테인트가 설정된
    노드가 포함된다.
  - Ignore: 노드 테인트는 무시된다. 모든 노드가 포함된다.

  옵션의 값이 null일 경우, Ignore 정책과 동일하게 동작한다.

  {{< note >}}
  `nodeTaintsPolicy` 필드는 베타 필드이고 1.26에서 기본적으로 활성화되어 있다. 이 필드를 비활성화하려면
  `NodeInclusionPolicyInPodTopologySpread` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)
  를 비활성화하면 된다.
  {{< /note >}}

파드에 2개 이상의 `topologySpreadConstraint`가 정의되어 있으면, 
각 제약 조건은 논리 AND 연산으로 조합되며, 
kube-scheduler는 새로운 파드의 모든 제약 조건을 만족하는 노드를 찾는다.

### 노드 레이블

토폴로지 분배 제약 조건은 노드 레이블을 이용하여 
각 {{< glossary_tooltip text="노드" term_id="node" >}}가 속한 토폴로지 도메인(들)을 인식한다. 
예를 들어, 노드가 다음과 같은 레이블을 가질 수 있다.
```yaml
  region: us-east-1
  zone: us-east-1a
```

{{< note >}}
간결함을 위해, 이 예시에서는 
[잘 알려진](/ko/docs/reference/labels-annotations-taints/) 레이블 키인 
`topology.kubernetes.io/zone` 및 `topology.kubernetes.io/region`을 사용하지 않는다. 
그러나 그렇더라도, 아래에 등장하는 프라이빗(비공인된) 레이블 키인 `region` 및 `zone`보다는 
위와 같은 공인된 레이블 키를 사용하는 것을 권장한다.

다양한 각 상황에 대해, 프라이빗 레이블 키의 의미가 
모두 우리의 생각과 같을 것이라고 가정할 수는 없다.
{{< /note >}}

각각 다음과 같은 레이블을 갖는 4개의 노드로 구성된 클러스터가 있다고 가정한다.

```
NAME    STATUS   ROLES    AGE     VERSION   LABELS
node1   Ready    <none>   4m26s   v1.16.0   node=node1,zone=zoneA
node2   Ready    <none>   3m58s   v1.16.0   node=node2,zone=zoneA
node3   Ready    <none>   3m17s   v1.16.0   node=node3,zone=zoneB
node4   Ready    <none>   2m43s   v1.16.0   node=node4,zone=zoneB
```

그러면 클러스터는 논리적으로 다음과 같이 보이게 된다.

{{<mermaid>}}
graph TB
    subgraph "zoneB"
        n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        n1(Node1)
        n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

## 일관성(consistency)

그룹 내의 모든 파드에는 동일한 파드 토폴로지 분배 제약 조건을 설정해야 한다.

일반적으로, 디플로이먼트와 같은 워크로드 컨트롤러를 사용하는 경우, 
파드 템플릿이 이 사항을 담당한다. 
여러 분배 제약 조건을 혼합하는 경우, 쿠버네티스는 해당 필드의 API 정의를 따르기는 하지만, 
동작이 복잡해질 수 있고 트러블슈팅이 덜 직관적이게 된다.

동일한 토폴로지 도메인(예: 클라우드 공급자 리전)에 있는 모든 노드가 
일관적으로 레이블되도록 하는 메카니즘이 필요하다. 
각 노드를 수동으로 레이블하는 것을 피하기 위해, 
대부분의 클러스터는 `topology.kubernetes.io/hostname`와 같은 잘 알려진 레이블을 자동으로 붙인다. 
이용하려는 클러스터가 이를 지원하는지 확인해 본다.

## 토폴로지 분배 제약 조건 예시

### 예시: 단수 토폴로지 분배 제약 조건 {#example-one-topologyspreadconstraint}

`foo:bar` 가 레이블된 3개의 파드가 4개 노드를 가지는 클러스터의 
node1, node2 및 node3에 각각 위치한다고 가정한다.

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

신규 파드가 기존 파드와 함께 여러 존에 걸쳐 균등하게 분배되도록 하려면, 
다음과 같은 매니페스트를 사용할 수 있다.

{{< codenew file="pods/topology-spread-constraints/one-constraint.yaml" >}}

위의 매니페스트에서, `topologyKey: zone`이 의미하는 것은 `zone: <any value>`로 레이블된 
노드에 대해서만 균등한 분배를 적용한다는 뜻이다(`zone` 레이블이 없는 노드는 무시된다). 
`whenUnsatisfiable: DoNotSchedule` 필드는 만약 스케줄러가 신규 파드에 대해 제약 조건을 
만족하는 스케줄링 방법을 찾지 못하면 이 신규 파드를 pending 상태로 유지하도록 한다.

만약 스케줄러가 이 신규 파드를 `A` 존에 배치하면 파드 분포는 `[3, 1]`이 된다. 
이는 곧 실제 차이(skew)가 2(`3-1`)임을 나타내는데, 이는 `maxSkew: 1`을 위반하게 된다. 
이 예시에서 제약 조건과 상황을 만족하려면, 
신규 파드는 `B` 존의 노드에만 배치될 수 있다.

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

또는

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n3
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

사용자는 파드 스펙을 조정하여 다음과 같은 다양한 요구사항을 충족할 수 있다.

- `maxSkew` 를 더 큰 값(예: `2`)으로 변경하여 
  신규 파드가 `A` 존에도 배치할 수 있도록 한다.
- `topologyKey`를 `node`로 변경하여 파드가 존이 아닌 노드에 걸쳐 고르게 분산되도록 한다. 
  위의 예시에서, 만약 `maxSkew`를 `1`로 유지한다면, 
  신규 파드는 오직 `node4`에만 배치될 수 있다.
- `whenUnsatisfiable: DoNotSchedule`를 `whenUnsatisfiable: ScheduleAnyway`로 변경하면 
  신규 파드가 항상 스케줄링되도록 보장할 수 있다(다른 스케줄링 API를 충족한다는 가정 하에). 
  그러나, 매칭되는 파드의 수가 적은 토폴로지 도메인에 배치되는 것이 선호된다. 
  (이 선호도는 리소스 사용 비율과 같은 다른 내부 스케줄링 우선순위와 함께 정규화된다는 것을 
  알아두자.)

### 예시: 다중 토폴로지 분배 제약 조건 {#example-multiple-topologyspreadconstraints}

이 예시는 위의 예시에 기반한다. `foo:bar` 가 레이블된 3개의 파드가 
4개 노드를 가지는 클러스터의 node1, node2 그리고 node3에 각각 위치한다고 가정한다.

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

사용자는 2개의 토폴로지 분배 제약 조건을 사용하여 
노드 및 존 기반으로 파드가 분배되도록 제어할 수 있다.

{{< codenew file="pods/topology-spread-constraints/two-constraints.yaml" >}}

이 경우에는, 첫 번째 제약 조건에 부합하려면, 신규 파드는 오직 `B` 존에만 배치될 수 있다. 
한편 두 번째 제약 조건에 따르면 신규 파드는 오직 `node4` 노드에만 배치될 수 있다. 
스케줄러는 모든 정의된 제약 조건을 만족하는 선택지만 고려하므로, 
유효한 유일한 선택지는 신규 파드를 `node4`에 배치하는 것이다.

### 예시: 상충하는 토폴로지 분배 제약 조건 {#example-conflicting-topologyspreadconstraints}

다중 제약 조건이 서로 충돌할 수 있다. 3개의 노드를 가지는 클러스터 하나가 2개의 존에 걸쳐 있다고 가정한다.

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p4(Pod) --> n3(Node3)
        p5(Pod) --> n3
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n1
        p3(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3,p4,p5 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

만약 
[`two-constraints.yaml`](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/topology-spread-constraints/two-constraints.yaml)
(위 예시의 매니페스트)을 
**이** 클러스터에 적용하면, 
`mypod` 파드가 `Pending` 상태로 유지되는 것을 볼 수 있을 것이다. 
이러한 이유는, 첫 번째 제약 조건을 충족하려면 `mypod` 파드는 `B` 존에만 배치될 수 있지만, 
두 번째 제약 조건에 따르면 `mypod` 파드는 `node2` 노드에만 스케줄링될 수 있기 때문이다. 
두 제약 조건의 교집합이 공집합이므로, 스케줄러는 파드를 배치할 수 없다.

이 상황을 극복하기 위해, `maxSkew` 값을 증가시키거나, 
제약 조건 중 하나를 `whenUnsatisfiable: ScheduleAnyway` 를 사용하도록 수정할 수 있다. 
상황에 따라, 기존 파드를 수동으로 삭제할 수도 있다. 
예를 들어, 버그픽스 롤아웃이 왜 진행되지 않는지 트러블슈팅하는 상황에서 이 방법을 활용할 수 있다.

#### 노드 어피니티(Affinity) 및 노드 셀렉터(Selector)와의 상호 작용

스케줄러는 신규 파드에 `spec.nodeSelector` 또는 `spec.affinity.nodeAffinity`가 정의되어 있는 경우, 
부합하지 않는 노드들을 차이(skew) 계산에서 생략한다.

### 예시: 토폴로지 분배 제약조건과 노드 어피니티 {#example-topologyspreadconstraints-with-nodeaffinity}

5개의 노드를 가지는 클러스터가 A 존에서 C 존까지 걸쳐 있다고 가정한다.

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n1,n2,n3,n4,p1,p2,p3 k8s;
class p4 plain;
class zoneA,zoneB cluster;
{{< /mermaid >}}

{{<mermaid>}}
graph BT
    subgraph "zoneC"
        n5(Node5)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n5 k8s;
class zoneC cluster;
{{< /mermaid >}}

그리고 `C` 존은 파드 배포에서 제외해야 한다는 사실을 사용자가 알고 있다고 가정한다. 
이 경우에, 다음과 같이 매니페스트를 작성하여, `mypod` 파드가 `C` 존 대신 `B` 존에 배치되도록 할 수 있다. 
유사하게, 쿠버네티스는 `spec.nodeSelector` 필드도 고려한다.

{{< codenew file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" >}}

## 암묵적 규칙

여기에 주목할만한 몇 가지 암묵적인 규칙이 있다.

- 신규 파드와 동일한 네임스페이스를 갖는 파드만이 매칭의 후보가 된다.

- `topologySpreadConstraints[*].topologyKey` 가 없는 노드는 무시된다. 
  이것은 다음을 의미한다.

  1. 이러한 노드에 위치한 파드는 `maxSkew` 계산에 영향을 미치지 않는다. 
     위의 예시에서, `node1` 노드는 "zone" 레이블을 가지고 있지 않다고 가정하면, 
     파드 2개는 무시될 것이고, 이런 이유로 신규 파드는 `A` 존으로 스케줄된다.
  2. 신규 파드는 이런 종류의 노드에 스케줄 될 기회가 없다. 
     위의 예시에서, **잘못 타이핑된** `zone-typo: zoneC` 레이블을 갖는 `node5` 노드가 있다고 가정하자(`zone` 레이블은 설정되지 않음). 
     `node5` 노드가 클러스터에 편입되면, 해당 노드는 무시되고 
     이 워크로드의 파드는 해당 노드에 스케줄링되지 않는다.

- 신규 파드의 `topologySpreadConstraints[*].labelSelector`가 자체 레이블과 일치하지 않을 경우 어떻게 되는지 알고 있어야 한다. 
  위의 예시에서, 신규 파드의 레이블을 제거해도, 
  제약 조건이 여전히 충족되기 때문에 이 파드는 `B` 존의 노드에 배치될 수 있다. 
  그러나, 배치 이후에도 클러스터의 불균형 정도는 변경되지 않는다. 
  여전히 `A` 존은 `foo: bar` 레이블을 가지는 2개의 파드를 가지고 있고, 
  `B` 존도 `foo: bar` 레이블을 가지는 1개의 파드를 가지고 있다. 
  만약 결과가 예상과 다르다면, 
  워크로드의 `topologySpreadConstraints[*].labelSelector`를 파드 템플릿의 레이블과 일치하도록 업데이트한다.

## 클러스터 수준의 기본 제약 조건

클러스터에 대한 기본 토폴로지 분배 제약 조건을 설정할 수 있다. 
기본 토폴로지 분배 제약 조건은 다음과 같은 경우에만 파드에 적용된다.

- `.spec.topologySpreadConstraints` 에 어떠한 제약 조건도 정의되어 있지 않는 경우.
- 서비스, 레플리카셋(ReplicaSet), 스테이트풀셋(StatefulSet), 또는 레플리케이션컨트롤러(ReplicationController)에 속해있는 경우.

기본 제약 조건은 
[스케줄링 프로파일](/ko/docs/reference/scheduling/config/#프로파일)내의 플러그인 인자 중 하나로 설정할 수 있다. 
제약 조건은 [위에서 설명한 것과 동일한 API](#topologyspreadconstraints-필드)를 이용하여 정의되는데,
다만 `labelSelector`는 비워 두어야 한다. 
셀렉터는 파드가 속한 서비스, 레플리카셋, 스테이트풀셋, 또는 레플리케이션 컨트롤러를 바탕으로 계산한다.

예시 구성은 다음과 같다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints:
            - maxSkew: 1
              topologyKey: topology.kubernetes.io/zone
              whenUnsatisfiable: ScheduleAnyway
          defaultingType: List
```

{{< note >}}
[`SelectorSpread` 플러그인](/ko/docs/reference/scheduling/config/#스케줄링-플러그인)은
기본적으로 비활성화되어 있다.
비슷한 효과를 얻기 위해 `PodTopologySpread`를 사용하는 것을 추천한다.
{{< /note >}}

### 내장 기본 제약 조건 {#internal-default-constraints}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

파드 토폴로지 분배에 대해 클러스터 수준의 기본 제약을 설정하지 않으면,
kube-scheduler는 다음과 같은 기본 토폴로지 제약이 설정되어 있는 것처럼 동작한다.

```yaml
defaultConstraints:
  - maxSkew: 3
    topologyKey: "kubernetes.io/hostname"
    whenUnsatisfiable: ScheduleAnyway
  - maxSkew: 5
    topologyKey: "topology.kubernetes.io/zone"
    whenUnsatisfiable: ScheduleAnyway
```

또한, 같은 동작을 제공하는 레거시 `SelectorSpread` 플러그인은
기본적으로 비활성화되어 있다.

{{< note >}}
`PodTopologySpread` 플러그인은 
분배 제약 조건에 지정된 토폴로지 키가 없는 노드에 점수를 매기지 않는다. 
이로 인해 기본 토폴로지 제약을 사용하는 경우의 
레거시 `SelectorSpread` 플러그인과는 기본 정책이 다를 수 있다.

노드에 `kubernetes.io/hostname` 및 `topology.kubernetes.io/zone` 
레이블 세트가 **둘 다** 설정되지 않을 것으로 예상되는 경우, 
쿠버네티스 기본값을 사용하는 대신 자체 제약 조건을 정의하자.
{{< /note >}}

클러스터에 기본 파드 분배 제약 조건을 사용하지 않으려면,
`PodTopologySpread` 플러그인 구성에서 `defaultingType` 을 `List` 로 설정하고
`defaultConstraints` 를 비워두어 기본값을 비활성화할 수 있다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints: []
          defaultingType: List
```

## 파드어피니티(PodAffinity) 및 파드안티어피니티(PodAntiAffinity)와의 비교 {#comparison-with-podaffinity-podantiaffinity}

쿠버네티스에서, [파드간 어피니티 및 안티 어피니티](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)는 
파드가 다른 파드에 서로 어떤 연관 관계를 지니며 스케줄링되는지를 제어하며, 
이는 파드들이 서로 더 밀집되도록 하거나 흩어지도록 하는 것을 의미한다.

`podAffinity`
: 파드를 끌어당긴다. 조건이 충족되는 토폴로지 도메인에는
  원하는 수의 파드를 얼마든지 채울 수 있다.

`podAntiAffinity`
: 파드를 밀어낸다. 
  이를 `requiredDuringSchedulingIgnoredDuringExecution` 모드로 설정하면 
  각 토폴로지 도메인에는 하나의 파드만 스케줄링될 수 있다. 
  반면 `preferredDuringSchedulingIgnoredDuringExecution`로 설정하면 제약 조건이 강제성을 잃게 된다.

더 세밀한 제어를 위해, 
토폴로지 분배 제약 조건을 지정하여 다양한 토폴로지 도메인에 파드를 분배할 수 있고, 
이를 통해 고 가용성 또는 비용 절감을 달성할 수 있다. 
이는 또한 워크로드의 롤링 업데이트와 레플리카의 원활한 스케일링 아웃에 도움이 될 수 있다.

더 자세한 내용은
파드 토폴로지 분배 제약 조건에 대한 개선 제안의 
[동기(motivation)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation) 섹션을 참고한다.

## 알려진 제한사항

- 파드가 제거된 이후에도 제약 조건이 계속 충족된다는 보장은 없다. 
  예를 들어 디플로이먼트를 스케일링 다운하면 그 결과로 파드의 분포가 불균형해질 수 있다.
  
  [Descheduler](https://github.com/kubernetes-sigs/descheduler)와 같은 도구를 사용하여 
  파드 분포를 다시 균형있게 만들 수 있다.
- 테인트된(tainted) 노드에 매치된 파드도 계산에 포함된다. 
  [이슈 80921](https://github.com/kubernetes/kubernetes/issues/80921)을 본다.
- 스케줄러는 클러스터가 갖는 모든 존 또는 다른 토폴로지 도메인에 대한 사전 지식을 갖고 있지 않다. 
  이 정보들은 클러스터의 기존 노드로부터 획득된다. 
  이로 인해 오토스케일된 클러스터에서 문제가 발생할 수 있는데, 
  예를 들어 노드 풀(또는 노드 그룹)이 0으로 스케일 다운되고, 
  클러스터가 다시 스케일 업 되기를 기대하는 경우, 
  해당 토폴로지 도메인은 적어도 1개의 노드가 존재하기 전에는 고려가 되지 않을 것이다. 

  이를 극복하기 위해, 파드 토폴로지 분배 제약 조건과 
  전반적인 토폴로지 도메인 집합에 대한 정보를 인지하고 동작하는 
  클러스터 오토스케일링 도구를 이용할 수 있다.

## {{% heading "whatsnext" %}}

- [블로그: PodTopologySpread 소개](/blog/2020/05/introducing-podtopologyspread/)에서는
  `maxSkew` 에 대해 자세히 설명하고, 몇 가지 고급 사용 예제를 제공한다.
- 파드 API 레퍼런스의 
  [스케줄링](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling) 섹션을 읽어 본다.
