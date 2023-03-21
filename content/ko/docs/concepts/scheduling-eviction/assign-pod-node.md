---
# reviewers:
# - davidopp
# - kevin-wangzefeng
# - alculquicondor
title: 노드에 파드 할당하기
content_type: concept
weight: 20
---


<!-- overview -->

특정한 {{< glossary_tooltip text="노드(들)" term_id="node" >}} 집합에서만 
동작하거나 특정한 노드 집합에서 동작하는 것을 선호하도록 {{< glossary_tooltip text="파드" term_id="pod" >}}를 
제한할 수 있다.
이를 수행하는 방법에는 여러 가지가 있으며 권장되는 접근 방식은 모두
[레이블 셀렉터](/ko/docs/concepts/overview/working-with-objects/labels/)를 사용하여 선택을 용이하게 한다.
보통은 {{< glossary_tooltip text="스케줄러" term_id="kube-scheduler" >}}가 
자동으로 합리적인 배치(예: 자원이 부족한 노드에 파드를 배치하지 않도록 
노드 간에 파드를 분배)를 수행하기에 이러한 제약 조건을 설정할 필요는 없다.
그러나, 예를 들어 SSD가 장착된 머신에 파드가 배포되도록 하거나 또는 
많은 통신을 하는 두 개의 서로 다른 서비스의 파드를 동일한 가용성 영역(availability zone)에 배치하는 경우와 같이, 
파드가 어느 노드에 배포될지를 제어해야 하는 경우도 있다.

<!-- body -->

쿠버네티스가 특정 파드를 어느 노드에 스케줄링할지 고르는 
다음의 방법 중 하나를 골라 사용할 수 있다.

  * [노드 레이블](#built-in-node-labels)에 매칭되는 [nodeSelector](#nodeselector) 필드
  * [어피니티 / 안티 어피니티](#affinity-and-anti-affinity)
  * [nodeName](#nodename) 필드
  * [파드 토폴로지 분배 제약 조건](#pod-topology-spread-constraints)

## 노드 레이블 {#built-in-node-labels}

다른 쿠버네티스 오브젝트와 마찬가지로, 노드도 [레이블](/ko/docs/concepts/overview/working-with-objects/labels/)을 가진다.
[레이블을 수동으로 추가](/ko/docs/tasks/configure-pod-container/assign-pods-nodes/#노드에-레이블-추가)할 수 있다.
또한 쿠버네티스도 클러스터의 모든 노드에 표준화된 레이블 집합을 적용한다.
[잘 알려진 레이블, 어노테이션, 테인트](/ko/docs/reference/labels-annotations-taints/)에서 널리 사용되는 노드 레이블의 목록을 확인한다.

{{<note>}}
이러한 레이블에 대한 값은 클라우드 제공자별로 다르며 정확하지 않을 수 있다.
예를 들어, `kubernetes.io/hostname`에 대한 값은 특정 환경에서는 노드 이름과 동일할 수 있지만 
다른 환경에서는 다른 값일 수도 있다.
{{</note>}}

### 노드 격리/제한 {#node-isolation-restriction}

노드에 레이블을 추가하여 
파드를 특정 노드 또는 노드 그룹에 스케줄링되도록 지정할 수 있다.
이 기능을 사용하여 특정 파드가 특정 격리/보안/규제 속성을 만족하는 노드에서만 
실행되도록 할 수 있다.

노드 격리를 위해 레이블을 사용할 때, {{<glossary_tooltip text="kubelet" term_id="kubelet">}}이 변경할 수 없는 레이블 키를 선택한다.
그렇지 않으면 kubelet이 해당 레이블을 변경하여 노드가 사용 불가능(compromised) 상태로 빠지고 
스케줄러가 이 노드에 워크로드를 스케줄링하는 일이 발생할 수 있다.

[`NodeRestriction` 어드미션 플러그인](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)은 
kubelet이 `node-restriction.kubernetes.io/` 접두사를 갖는 레이블을 
설정하거나 변경하지 못하도록 한다.

노드 격리를 위해 레이블 접두사를 사용하려면,

1. [노드 인가자(authorizer)](/docs/reference/access-authn-authz/node/)를 사용하고 있는지, 그리고 `NodeRestriction` 어드미션 플러그인을 **활성화** 했는지 확인한다.
1. 노드에 `node-restriction.kubernetes.io/` 접두사를 갖는 레이블을 추가하고, [노드 셀렉터](#nodeselector)에서 해당 레이블을 사용한다.
   예: `example.com.node-restriction.kubernetes.io/fips=true` 또는 `example.com.node-restriction.kubernetes.io/pci-dss=true`

## 노드셀렉터(nodeSelector) {#nodeselector}

`nodeSelector`는 노드 선택 제약사항의 가장 간단하면서도 추천하는 형태이다.
파드 스펙에 `nodeSelector` 필드를 추가하고, 
타겟으로 삼고 싶은 노드가 갖고 있는 [노드 레이블](#built-in-node-labels)을 명시한다.
쿠버네티스는 사용자가 명시한 레이블을 갖고 있는 노드에만 
파드를 스케줄링한다.

[노드에 파드 할당](/ko/docs/tasks/configure-pod-container/assign-pods-nodes)에서 
더 많은 정보를 확인한다.

## 어피니티(affinity)와 안티-어피니티(anti-affinity) {#affinity-and-anti-affinity}

`nodeSelector` 는 파드를 특정 레이블이 있는 노드로 제한하는 가장 간단한 방법이다.
어피니티/안티-어피니티 기능은 표현할 수 있는 제약 종류를 크게 확장한다.
주요 개선 사항은 다음과 같다.

* 어피니티/안티-어피니티 언어가 더 표현적이다.
  `nodeSelector`로는 명시한 레이블이 있는 노드만 선택할 수 있다.
  어피니티/안티-어피니티는 선택 로직에 대한 좀 더 많은 제어권을 제공한다.
* 규칙이 "소프트(soft)" 또는 "선호사항(preference)" 임을 나타낼 수 있으며, 
  이 덕분에 스케줄러는 매치되는 노드를 찾지 못한 경우에도 파드를 스케줄링할 수 있다.
* 다른 노드 (또는 다른 토폴로지 도메인)에서 실행 중인 
  다른 파드의 레이블을 사용하여 파드를 제한할 수 있으며, 
  이를 통해 어떤 파드들이 노드에 함께 위치할 수 있는지에 대한 규칙을 정의할 수 있다.

어피니티 기능은 다음의 두 가지 종류로 구성된다.

* *노드 어피니티* 기능은 `nodeSelector` 필드와 비슷하지만 
  더 표현적이고 소프트(soft) 규칙을 지정할 수 있게 해 준다.
* *파드 간 어피니티/안티-어피니티* 는 다른 파드의 레이블을 이용하여 
  해당 파드를 제한할 수 있게 해 준다.

### 노드 어피니티 {#node-affinity}

노드 어피니티는 개념적으로 `nodeSelector` 와 비슷하며, 
노드의 레이블을 기반으로 파드가 스케줄링될 수 있는 노드를 제한할 수 있다.
노드 어피니티에는 다음의 두 종류가 있다.

  * `requiredDuringSchedulingIgnoredDuringExecution`: 
    규칙이 만족되지 않으면 스케줄러가 파드를 스케줄링할 수 없다.
    이 기능은 `nodeSelector`와 유사하지만, 좀 더 표현적인 문법을 제공한다.
  * `preferredDuringSchedulingIgnoredDuringExecution`: 
    스케줄러는 조건을 만족하는 노드를 찾으려고 노력한다.
    해당되는 노드가 없더라도, 스케줄러는 여전히 파드를 스케줄링한다.

{{<note>}}
앞의 두 유형에서, `IgnoredDuringExecution`는 
쿠버네티스가 파드를 스케줄링한 뒤에 노드 레이블이 변경되어도 파드는 계속 해당 노드에서 실행됨을 의미한다.
{{</note>}}

파드 스펙의 `.spec.affinity.nodeAffinity` 필드에 
노드 어피니티를 명시할 수 있다.

예를 들어, 다음과 같은 파드 스펙이 있다고 하자.

{{< codenew file="pods/pod-with-node-affinity.yaml" >}}

이 예시에서는 다음의 규칙이 적용된다.

  * 노드는 키가 `topology.kubernetes.io/zone`인 레이블을 갖고 *있어야 하며*,
    레이블의 값이 `antarctica-east1` 혹은 `antarctica-west1`*여야 한다*.
  * 키가 `another-node-label-key`이고 값이 `another-node-label-value`인 레이블을 
    갖고 있는 노드를 *선호한다* .

`operator` 필드를 사용하여 
쿠버네티스가 규칙을 해석할 때 사용할 논리 연산자를 지정할 수 있다.
`In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt` 및 `Lt` 연산자를 사용할 수 있다.

`NotIn` 및 `DoesNotExist` 연산자를 사용하여 노드 안티-어피니티 규칙을 정의할 수 있다.
또는, 특정 노드에서 파드를 쫓아내는 
[노드 테인트(taint)](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/)를 설정할 수 있다.

{{<note>}}
`nodeSelector`와 `nodeAffinity`를 모두 사용하는 경우, 
파드가 노드에 스케줄링되려면 두 조건 *모두* 만족되어야 한다.

`nodeAffinity`의 `nodeSelectorTerms`에 여러 조건(term)을 명시한 경우,
노드가 명시된 조건 중 하나만 만족해도 파드가
해당 노드에 스케줄링될 수 있다. (조건들은 OR 연산자로 처리)

`nodeSelectorTerms`의 조건으로 단일 `matchExpressions` 필드에 여러 표현식(expression)을 명시한 경우,
모든 표현식을 동시에 만족하는 노드에만
파드가 스케줄링될 수 있다. (표현식들은 AND 연산자로 처리)
{{</note>}}

[노드 어피니티를 사용해 노드에 파드 할당](/ko/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)에서 
더 많은 정보를 확인한다.

#### 노드 어피니티 가중치(weight) {#node-affinity-weight}

각 `preferredDuringSchedulingIgnoredDuringExecution` 어피니티 타입 인스턴스에 대해 
1-100 범위의 `weight`를 명시할 수 있다.
스케줄러가 다른 모든 파드 스케줄링 요구 사항을 만족하는 노드를 찾으면, 
스케줄러는 노드가 만족한 모든 선호하는(preferred) 규칙에 대해 
합계 계산을 위한 `weight` 값을 각각 추가한다.

최종 합계는 해당 노드에 대한 다른 우선 순위 함수 점수에 더해진다.
스케줄러가 파드에 대한 스케줄링 판단을 할 때, 
총 점수가 가장 높은 노드가 우선 순위를 갖는다.

예를 들어, 다음과 같은 파드 스펙이 있다고 하자.

{{< codenew file="pods/pod-with-affinity-anti-affinity.yaml" >}}

`preferredDuringSchedulingIgnoredDuringExecution` 규칙을 만족하는 노드가 2개 있고, 
하나에는 `label-1:key-1` 레이블이 있고 다른 하나에는 `label-2:key-2` 레이블이 있으면, 
스케줄러는 각 노드의 `weight`를 확인한 뒤 
해당 노드에 대한 다른 점수에 가중치를 더하고, 
최종 점수가 가장 높은 노드에 해당 파드를 스케줄링한다.

{{<note>}}
이 예시에서 쿠버네티스가 정상적으로 파드를 스케줄링하려면, 
보유하고 있는 노드에 `kubernetes.io/os=linux` 레이블이 있어야 한다.
{{</note>}}

#### 스케줄링 프로파일당 노드 어피니티 {#node-affinity-per-scheduling-profile}

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

여러 [스케줄링 프로파일](/ko/docs/reference/scheduling/config/#여러-프로파일)을 구성할 때
노드 어피니티가 있는 프로파일을 연결할 수 있는데, 이는 프로파일이 특정 노드 집합에만 적용되는 경우 유용하다.
이렇게 하려면 다음과 같이 [스케줄러 구성](/ko/docs/reference/scheduling/config/)에 있는
[`NodeAffinity` 플러그인](/ko/docs/reference/scheduling/config/#스케줄링-플러그인-1)의 `args` 필드에 `addedAffinity`를 추가한다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
  - schedulerName: foo-scheduler
    pluginConfig:
      - name: NodeAffinity
        args:
          addedAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              nodeSelectorTerms:
              - matchExpressions:
                - key: scheduler-profile
                  operator: In
                  values:
                  - foo
```

`addedAffinity`는 `.spec.schedulerName`을 `foo-scheduler`로 설정하는 모든 파드에 적용되며
PodSpec에 지정된 NodeAffinity도 적용된다.
즉, 파드를 매칭시키려면, 노드가 `addedAffinity`와 
파드의 `.spec.NodeAffinity`를 충족해야 한다.

`addedAffinity`는 엔드 유저에게 표시되지 않으므로, 
예상치 못한 동작이 일어날 수 있다.
스케줄러 프로파일 이름과 명확한 상관 관계가 있는 노드 레이블을 사용한다.

{{< note >}}
[데몬셋 파드를 생성](/ko/docs/concepts/workloads/controllers/daemonset/#기본-스케줄러로-스케줄)하는 데몬셋 컨트롤러는 
스케줄링 프로파일을 지원하지 않는다.
데몬셋 컨트롤러가 파드를 생성할 때, 기본 쿠버네티스 스케줄러는 해당 파드를 배치하고 
데몬셋 컨트롤러의 모든 `nodeAffinity` 규칙을 준수한다.
{{< /note >}}

### 파드간 어피니티와 안티-어피니티 {#inter-pod-affinity-and-anti-affinity}

파드간 어피니티와 안티-어피니티를 사용하여, 
노드 레이블 대신, 각 노드에 이미 실행 중인 다른 **파드** 의 레이블을 기반으로 
파드가 스케줄링될 노드를 제한할 수 있다.

파드간 어피니티와 안티-어피니티 규칙은 
"X가 규칙 Y를 충족하는 하나 이상의 파드를 이미 실행중인 경우 이 파드는 X에서 실행해야 한다(또는 
안티-어피니티의 경우에는 "실행하면 안 된다")"의 형태이며, 
여기서 X는 노드, 랙, 클라우드 제공자 존 또는 리전 등이며 
Y는 쿠버네티스가 충족할 규칙이다.

이러한 규칙(Y)은 [레이블 셀렉터](/ko/docs/concepts/overview/working-with-objects/labels/#레이블-셀렉터) 형태로 작성하며, 
연관된 네임스페이스 목록을 선택적으로 명시할 수도 있다.
쿠버네티스에서 파드는 네임스페이스에 속하는(namespaced) 오브젝트이므로, 
파드 레이블도 암묵적으로 특정 네임스페이스에 속하게 된다.
파드 레이블에 대한 모든 레이블 셀렉터는 쿠버네티스가 해당 레이블을 어떤 네임스페이스에서 탐색할지를 명시해야 한다.

`topologyKey`를 사용하여 토폴로지 도메인(X)를 나타낼 수 있으며, 
이는 시스템이 도메인을 표시하기 위해 사용하는 노드 레이블의 키이다.
이에 대한 예시는 [잘 알려진 레이블, 어노테이션, 테인트](/ko/docs/reference/labels-annotations-taints/)를 참고한다.

{{< note >}}
파드간 어피니티와 안티-어피니티에는 상당한 양의 프로세싱이 필요하기에
대규모 클러스터에서는 스케줄링 속도가 크게 느려질 수 있다.
수백 개의 노드를 넘어가는 클러스터에서 이를 사용하는 것은 추천하지 않는다.
{{< /note >}}

{{< note >}}
파드 안티-어피니티에서는 노드에 일관된 레이블을 지정해야 한다.
즉, 클러스터의 모든 노드는 `topologyKey` 와 매칭되는 적절한 레이블을 가지고 있어야 한다.
일부 또는 모든 노드에 지정된 `topologyKey` 레이블이 없는 경우에는 
의도하지 않은 동작이 발생할 수 있다.
{{< /note >}}

#### 파드간 어피니티 및 안티-어피니티 종류 {#types-of-inter-pod-affinity-and-anti-affinity}

노드 어피니티와 마찬가지로 
파드 어피니티 및 안티-어피니티에는 다음의 2 종류가 있다.

  * `requiredDuringSchedulingIgnoredDuringExecution`
  * `preferredDuringSchedulingIgnoredDuringExecution`

예를 들어, `requiredDuringSchedulingIgnoredDuringExecution` 어피니티를 사용하여 
서로 통신을 많이 하는 두 서비스의 파드를 
동일 클라우드 제공자 존에 배치하도록 스케줄러에게 지시할 수 있다.
비슷하게, `preferredDuringSchedulingIgnoredDuringExecution` 안티-어피니티를 사용하여 
서비스의 파드를 
여러 클라우드 제공자 존에 퍼뜨릴 수 있다.

파드간 어피니티를 사용하려면, 파드 스펙에 `affinity.podAffinity` 필드를 사용한다.
파드간 안티-어피니티를 사용하려면, 
파드 스펙에 `affinity.podAntiAffinity` 필드를 사용한다.

#### 파드 어피니티 예시 {#an-example-of-a-pod-that-uses-pod-affinity}

다음과 같은 파드 스펙을 가정한다.

{{< codenew file="pods/pod-with-pod-affinity.yaml" >}}

이 예시는 하나의 파드 어피니티 규칙과 
하나의 파드 안티-어피니티 규칙을 정의한다.
파드 어피니티 규칙은 "하드" `requiredDuringSchedulingIgnoredDuringExecution`을, 
안티-어피니티 규칙은 "소프트" `preferredDuringSchedulingIgnoredDuringExecution`을 사용한다.

위의 어피니티 규칙은 `security=S1` 레이블이 있는 하나 이상의 기존 파드의 존와 동일한 존에 있는 노드에만 
파드를 스케줄링하도록 스케줄러에 지시한다.
더 정확히 말하면, 만약 `security=S1` 파드 레이블이 있는 하나 이상의 기존 파드를 실행하고 있는 노드가 
`zone=V`에 하나 이상 존재한다면, 
스케줄러는 파드를 `topology.kubernetes.io/zone=V` 레이블이 있는 노드에 배치해야 한다.

위의 안티-어피니티 규칙은 `security=S2` 레이블이 있는 하나 이상의 기존 파드의 존와 동일한 존에 있는 노드에는 
가급적 파드를 스케줄링하지 않도록 스케줄러에 지시한다.
더 정확히 말하면, 만약 `security=S2` 파드 레이블이 있는 파드가 실행되고 있는 `zone=R`에 
다른 노드도 존재한다면, 
스케줄러는 `topology.kubernetes.io/zone=R` 레이블이 있는 노드에는 가급적 해당 파드를 스케줄링하지 않야아 한다.

파드 어피니티와 안티-어피니티의 예시에 대해 익숙해지고 싶다면,
[디자인 제안](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md)을 참조한다.

파드 어피니티와 안티-어피니티의 `operator` 필드에 
`In`, `NotIn`, `Exists` 및 `DoesNotExist` 값을 사용할 수 있다.

원칙적으로, `topologyKey` 에는 성능과 보안상의 이유로 다음의 예외를 제외하면 
어느 레이블 키도 사용할 수 있다.

* 파드 어피니티 및 안티-어피니티에 대해, 빈 `topologyKey` 필드는 
  `requiredDuringSchedulingIgnoredDuringExecution` 및 `preferredDuringSchedulingIgnoredDuringExecution` 내에 허용되지 않는다.
* `requiredDuringSchedulingIgnoredDuringExecution` 파드 안티-어피니티 규칙에 대해, 
  `LimitPodHardAntiAffinityTopology` 어드미션 컨트롤러는 
  `topologyKey`를 `kubernetes.io/hostname`으로 제한한다.
  커스텀 토폴로지를 허용하고 싶다면 어드미션 컨트롤러를 수정하거나 비활성화할 수 있다.

`labelSelector`와 `topologyKey`에 더하여 선택적으로, 
`labelSelector`가 비교해야 하는 네임스페이스의 목록을 
`labelSelector` 및 `topologyKey` 필드와 동일한 계위의 `namespaces` 필드에 명시할 수 있다.
생략하거나 비워 두면, 
해당 어피니티/안티-어피니티 정의가 있는 파드의 네임스페이스를 기본값으로 사용한다.

#### 네임스페이스 셀렉터 {#namespace-selector}
{{< feature-state for_k8s_version="v1.24" state="stable" >}}

네임스페이스 집합에 대한 레이블 쿼리인 `namespaceSelector` 를 사용하여 일치하는 네임스페이스를 선택할 수도 있다.
`namespaceSelector` 또는 `namespaces` 필드에 의해 선택된 네임스페이스 모두에 적용된다.
빈 `namespaceSelector` ({})는 모든 네임스페이스와 일치하는 반면, 
null 또는 빈 `namespaces` 목록과 null `namespaceSelector` 는 규칙이 적용된 파드의 네임스페이스에 매치된다.

#### 더 실제적인 유스케이스 {#more-practical-use-cases}

파드간 어피니티와 안티-어피니티는 레플리카셋, 스테이트풀셋, 디플로이먼트 등과 같은 
상위 레벨 모음과 함께 사용할 때 더욱 유용할 수 있다.
이러한 규칙을 사용하면, 워크로드 집합이 예를 들면 
서로 연관된 두 개의 파드를 동일한 노드에 배치하는 것과 같이 동일하게 정의된 토폴로지와 
같은 위치에 배치되도록 쉽게 구성할 수 있다.

세 개의 노드로 구성된 클러스터를 상상해 보자. 이 클러스터에서 redis와 같은 인-메모리 캐시를 이용하는 웹 애플리케이션을 실행한다.
또한 이 예에서 웹 애플리케이션과 메모리 캐시 사이의 대기 시간은 될 수 있는 대로 짧아야 한다고 가정하자.
이 때 웹 서버를 가능한 한 캐시와 같은 위치에서 실행되도록 하기 위해 
파드간 어피니티/안티-어피니티를 사용할 수 있다.

다음의 redis 캐시 디플로이먼트 예시에서, 레플리카는 `app=store` 레이블을 갖는다.
`podAntiAffinity` 규칙은 스케줄러로 하여금 
`app=store` 레이블을 가진 복수 개의 레플리카를 단일 노드에 배치하지 않게 한다.
이렇게 하여 캐시 파드를 각 노드에 분산하여 생성한다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-cache
spec:
  selector:
    matchLabels:
      app: store
  replicas: 3
  template:
    metadata:
      labels:
        app: store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: redis-server
        image: redis:3.2-alpine
```

웹 서버를 위한 다음의 디플로이먼트는 `app=web-store` 레이블을 갖는 레플리카를 생성한다.
파드 어피니티 규칙은 스케줄러로 하여금 `app=store` 레이블이 있는 파드를 실행 중인 노드에 각 레플리카를 배치하도록 한다.
파드 안티-어피니티 규칙은 스케줄러로 하여금 `app=web-store` 레이블이 있는 서버 파드를 
한 노드에 여러 개 배치하지 못하도록 한다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
spec:
  selector:
    matchLabels:
      app: web-store
  replicas: 3
  template:
    metadata:
      labels:
        app: web-store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - web-store
            topologyKey: "kubernetes.io/hostname"
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: web-app
        image: nginx:1.16-alpine
```

위의 두 디플로이먼트를 생성하면 다음과 같은 클러스터 형상이 나타나는데, 
세 노드에 각 웹 서버가 캐시와 함께 있는 형상이다.

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| *webserver-1*        |   *webserver-2*     |    *webserver-3*   |
|  *cache-1*           |     *cache-2*       |     *cache-3*      |

전체적인 효과는 각 캐시 인스턴스를 동일한 노드에서 실행 중인 단일 클라이언트가 액세스하게 될 것 같다는 것이다.
이 접근 방식은 차이(불균형 로드)와 대기 ​​시간을 모두 최소화하는 것을 목표로 한다.

파드간 안티-어피니티를 사용해야 하는 다른 이유가 있을 수 있다.
[ZooKeeper 튜토리얼](/ko/docs/tutorials/stateful-application/zookeeper/#노드-실패-방지)에서 
위 예시와 동일한 기술을 사용해 
고 가용성을 위한 안티-어피니티로 구성된 스테이트풀셋의 예시를 확인한다.

## nodeName {#nodename}

`nodeName`은 어피니티 또는 `nodeSelector`보다 더 직접적인 형태의 노드 선택 방법이다.
`nodeName`은 파드 스펙의 필드 중 하나이다.
`nodeName` 필드가 비어 있지 않으면, 스케줄러는 파드를 무시하고, 
명명된 노드의 kubelet이 해당 파드를 자기 노드에 배치하려고 시도한다.
`nodeName`은 `nodeSelector` 또는 어피니티/안티-어피니티 규칙보다 우선적으로 적용(overrule)된다.

`nodeName` 을 사용해서 노드를 선택할 때의 몇 가지 제한은 다음과 같다.

-   만약 명명된 노드가 없으면, 파드가 실행되지 않고
    따라서 자동으로 삭제될 수 있다.
-   만약 명명된 노드에 파드를 수용할 수 있는
    리소스가 없는 경우 파드가 실패하고, 그 이유는 다음과 같이 표시된다.
    예: OutOfmemory 또는 OutOfcpu.
-   클라우드 환경의 노드 이름은 항상 예측 가능하거나
    안정적인 것은 아니다.

다음은 `nodeName` 필드를 사용하는 파드 스펙 예시이다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeName: kube-01
```

위 파드는 `kube-01` 노드에서만 실행될 것이다.

## 파드 토폴로지 분배 제약 조건

_토폴로지 분배 제약 조건_을 사용하여 지역(regions), 영역(zones), 노드 또는 사용자가 정의한 다른 토폴로지 도메인과 같은 장애 도메인 사이에서 {{< glossary_tooltip text="파드" term_id="Pod" >}}가 클러스터 전체에 분산되는 방식을 제어할 수 있다. 성능, 예상 가용성 또는 전체 활용도를 개선하기 위해 이 작업을 수행할 수 있다.

[파드 토폴로지 분배 제약 조건](/ko/docs/concepts/scheduling-eviction/topology-spread-constraints/)에서 
작동 방식에 대해 더 자세히 알아볼 수 있다.

## {{% heading "whatsnext" %}}

* [테인트 및 톨러레이션](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/)에 대해 더 읽어본다.
* [노드 어피니티](https://git.k8s.io/design-proposals-archive/scheduling/nodeaffinity.md)와
  [파드간 어피니티/안티-어피니티](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md)에 대한 디자인 문서를 읽어본다.
* [토폴로지 매니저](/docs/tasks/administer-cluster/topology-manager/)가 
  노드 수준 리소스 할당 결정에 어떻게 관여하는지 알아본다.
* [노드셀렉터(nodeSelector)](/ko/docs/tasks/configure-pod-container/assign-pods-nodes/)를 어떻게 사용하는지 알아본다.
* [어피니티/안티-어피니티](/ko/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)를 어떻게 사용하는지 알아본다.


