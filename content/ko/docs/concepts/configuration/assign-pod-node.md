---
title: 노드에 파드 할당하기
content_template: templates/concept
weight: 30
---


{{% capture overview %}}

{{< glossary_tooltip text="파드" term_id="pod" >}}를 특정한 {{< glossary_tooltip text="노드" term_id="node" >}}에서만 동작하도록 하거나 특정 노드를 선호하도록 제한할 수 있다. 
이를 위해서는 몇가지 방법이 있는데 그 중 하나는 선택 시 [레이블 셀렉터(label selector)](/ko/docs/concepts/overview/working-with-objects/labels/)를 사용하는 것이다. 
스케쥴러가 알아서 합리적인 위치를 고르기 때문에 (예를 들어 파드를 노드에 퍼뜨리고, 리소스가 충분하지 않은 노드에는 파드를 위치시키지 않는 것 등) 일반적으로 이러한 제약은 불필요하지만 
파드가 SSD가 달려있는 머신에서 동작하도록 하거나 서로 통신을 많이 하는 두개의 각기 다른 서비스와 연결된 파드가 
동일한 가용성 영역(availability zone)에 위치시켜야 하는 것처럼 
파드가 위치할 노드에 대해 좀 더 제어가 필요한 몇가지 상황들이 있다.

{{% /capture %}}

{{% capture body %}}

## 노드 셀렉터(nodeSelector)

`nodeSelector`는 가장 간단하고 추천하는 형식의 노드 선택 제약이다.
`nodeSelector`는 파드 스펙의 필드이다. 이는 키-값 쌍의 맵을 지정한다.
파드가 노드에서 동작할 수 있도록 하려면 노드는 반드시 레이블(물론 이는 추가적인 레이블들을 가질 수도 있다)로 지정된 
키-값 쌍들을 모두 가지고 있어야 한다. 일반적인 사용법은 단일 키-값 쌍을 사용하는 것이다.

`nodeSelector`를 어떻게 사용하는지 예시를 통해 알아보도록 하자.

### 0 단계: 사전 준비

이 예시는 쿠버네티스에 대한 기본적인 이해를 하고 있고 [쿠버네티스 클러스터가 준비](/ko/docs/setup/)되어 있다고 가정한다.

### 1 단계: 노드에 레이블 붙이기 {#step-one-attach-label-to-the-node}

`kubectl get nodes`를 실행하여 클러스터의 노드들 이름을 확인한다. 
레이블을 추가하고싶은 것을 하나 선택하고 `kubectl label nodes <노드 이름> <레이블 키>=<레이블 값>`을 실행하여 선택한 노드에 레이블을 추가한다. 
예를 들어 노드의 이름이 'kubernetes-foo-node-1.c.a-robinson.internal'이고 추가하고자 하는 레이블이 'disktype=ssd'일 경우 `kubectl label nodes kubernetes-foo-node-1.c.a-robinson.internal disktype=ssd`를 실행하면 된다.

`kubectl get nodes --show-labels`를 다시 실행시켜서 노드에 레이블이 있는지 확인하여 이 작업이 잘 되었는지 검증할 수 있다. 
또한 `kubectl describe node "노드 이름"`을 이용하여 주어진 노드에 대한 모든 레이블들의 리스트를 확인할 수 있다.

### 2 단계: 파드 설정에 nodeSelector 필드 추가하기

아래와 같이 실행하고 싶은 파드의 설정 파일에 nodeSelector을 추가한다. 만약 파드 설정 파일이 다음과 같다면:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
```

nodeSelector를 이처럼 추가한다:

{{< codenew file="pods/pod-nginx.yaml" >}}

`kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml`을 실행시키면 파드는 레이블을 붙인 노드에 스케쥴될 것이다. 
`kubectl get pods -o wide`를 실행시켜 파드가 할당된 "NODE"를 확인하여 검증할 수 있다.

## 넘어가기 전에: 내장 노드 레이블들 {#built-in-node-labels}

노드에 [붙인](#step-one-attach-label-to-the-node) 레이블에 추가적으로 이미 만들어진 표준 레이블 모음이 있다. 이런 레이블들은 다음과 같다.

* [`kubernetes.io/hostname`](/docs/reference/kubernetes-api/labels-annotations-taints/#kubernetes-io-hostname)
* [`failure-domain.beta.kubernetes.io/zone`](/docs/reference/kubernetes-api/labels-annotations-taints/#failure-domainbetakubernetesiozone)
* [`failure-domain.beta.kubernetes.io/region`](/docs/reference/kubernetes-api/labels-annotations-taints/#failure-domainbetakubernetesioregion)
* [`topology.kubernetes.io/zone`](/docs/reference/kubernetes-api/labels-annotations-taints/#topologykubernetesiozone)
* [`topology.kubernetes.io/region`](/docs/reference/kubernetes-api/labels-annotations-taints/#topologykubernetesiozone)
* [`beta.kubernetes.io/instance-type`](/docs/reference/kubernetes-api/labels-annotations-taints/#beta-kubernetes-io-instance-type)
* [`node.kubernetes.io/instance-type`](/docs/reference/kubernetes-api/labels-annotations-taints/#nodekubernetesioinstance-type)
* [`kubernetes.io/os`](/docs/reference/kubernetes-api/labels-annotations-taints/#kubernetes-io-os)
* [`kubernetes.io/arch`](/docs/reference/kubernetes-api/labels-annotations-taints/#kubernetes-io-arch)

{{< note >}}
이 레이블들의 값은 클라우드 제공자에 따라 다르고 신뢰성이 보장되지 않는다. 
예를 들어 `kubernetes.io/hostname`은 어떤 환경에서는 노드의 이름과 같고 다른 환경에서는 다른 값이 될 수 있다.
{{< /note >}}

## 노드 격리(isolation)/제한(restriction)

노드 오브젝트에 레이블을 추가하는 것은 파드가 특정한 노드들이나 노드 그룹들을 목표 대상으로 할 수 있도록 한다. 
이는 특정한 파드가 어떤 격리, 보안, 규제 속성들을 가진 노드에서만 동작할 수 있도록 한다. 
이는 compromised node들이 kubelet 자격증명(credential)을 사용하여 노드 오브젝트 자체에 레이블을 설정하지 않도록 하며 스케쥴러가 compromised node에 워크로드를 스케쥴하는 데 영향을 주지 않도록 한다.

`NodeRestriction` 어드미션 플러그인은 kubelet이 레이블을 `node-restriction.kubernetes.io/` 접두사로 수정하거나 설정하는 것을 방지한다. 노드 격리를 위해 그 레이블 접두사를 사용하도록 하려면 다음과 같이 하면 된다:

1. [Node authorizer](/docs/reference/access-authn-authz/node/)를 사용하고 있고 [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)을 _활성화_ 했는지 확인한다.
2. 노드 오브젝트에 `node-restriction.kubernetes.io/` 접두사를 가지고 레이블을 추가하고 이 레이블을 노드 셀렉터에서 사용한다. 
예를 들어, `example.com.node-restriction.kubernetes.io/fips=true`나 `example.com.node-restriction.kubernetes.io/pci-dss=true`와 같이 설정한다.

## 어피니티(affinity)와 안티-어피니티(anti-affinity)

`nodeSelector`는 파드를 특정 레이블을 가진 노드에서 동작하도록 제한을 하는 가장 간단한 방법이다. 
어피니티/안티-어피니티는 표현할 수 있는 제약의 종류를 폭 넓게 할 수 있다. 개선할 수 있는 사항들은 다음과 같다.

1. 언어가 더욱 표현력있게 된다. (단순히 정확한 일치를 의미하는 "AND"가 아니다)
2. 엄격한 요구사항 대신 "유연한(soft)"/"선호(preference)" 규칙을 나타낼 수 있어 스케쥴러가 만족하지 못할 경우에도 여전히 파드가 스케쥴될 수 있도록 할 수 있다.
3. 노드 자체(또는 다른 토폴로지 도메인)에 대한 레이블에 대해서만 제약을 걸 수 있는것이 아니라 노드에 떠있는 파드들이 가진 레이블에 대해서도 제약을 걸어 파드가 서로 함께 위치하도록 하거나 위치하지 못하도록 할 수 있다.

어피니티 기능은 "노드 어피니티", "파드 간 어피니티/안티-어피니티" 두가지 종류의 어피니티로 구성되어있다. 
노드 어피니티는 기존 `nodeSelector`와 비슷한 것(그러나 위의 리스트에서 말한 것 중 처음 두가지 이점을 가졌다)이고, 
파드간 어피니티/안티-어피니티는 위 리스트의 3번째 리스트에서 설명한 것처럼 
노드 레이블이 아니라 파드의 레이블에 대해서 제약을 둘 수 있으면서 첫번째와 두번째 속성또한 가졌다.

### 노드 어피니티

노드 어피니티는 개념적으로 `nodeSelector`와 비슷하다 -- 이는 노드에 달린 레이블을 기반으로 파드가 특정한 노드로 스케쥴이 가능하도록 제약을 줄 수 있다.

`requiredDuringSchedulingIgnoredDuringExecution`과 `preferredDuringSchedulingIgnoredDuringExecution` 두가지 종류의 노드 어피니티가 있다. 
전자는 파드가 노드에 스케쥴될 때 (`nodeSelector`와 비슷하지만 좀 더 표현이 풍부한 문법이다) 규칙을 *반드시* 만족해야 하는 것이고, 후자는 스케쥴러가 규칙을 지키려고 시도하겠지만 만족한다는 것을 보장하지는 않는, 규칙을 *선호*한다는 관점에서 이를 각각 "엄격한" 그리고 "유연한" 조건이라고 생각할 수 있다. 
위의 이름에서 "IgnoredDuringExecution"라고 적혀있는 부분은 `nodeSelector`가 동작하는 방식과 비슷하게 노드의 레이블이 런타임에 변경될 경우 파드에 설정된 어피니티 규칙이 더이상 만족하지 않는 경우에도 파드가 여전히 그 노드에서 동작한다는 의미이다. 
후에 `requiredDuringSchedulingRequiredDuringExecution` 설정을 제공하여 `requiredDuringSchedulingIgnoredDuringExecution` 처럼 동작하지만 파드가 동작하고 있는 노드가 더 이상 파드의 노드 어피니티 요구사항을 만족하지 않는 경우에 파드를 축출하는 것을 계획하고 있다.

따라서 `requiredDuringSchedulingIgnoredDuringExecution`의 예시는 "인텔 CPU가 있는 노드에서만 파드를 동작시키겠다"가 될 수 있으며 
`preferredDuringSchedulingIgnoredDuringExecution`의 예시는 "XYZ 영역에 파드 세트를 동작시키려고 시도하지만 가능하지 않은 경우 다른곳에서 동작하는 것을 허용한다"가 되겠다.

노드 어피니티는 파드 스펙에서 `affinity`필드 내의 `nodeAffinity` 필드에서 지정된다.

노드 어피니티를 사용하는 파드의 예시이다:

{{< codenew file="pods/pod-with-node-affinity.yaml" >}}

이 노드 어피니티 규칙은 파드가 `kubernetes.io/e2e-az-name`가 키고 값이 `e2e-az1` 또는 `e2e-az2`인 레이블을 가진 노드에서만 동작할 수 있도록 하는 것이다. 
추가적으로 이러한 규칙을 만족하는 노드들 중에서 `another-node-label-key`가 키이고 값이 `another-node-label-value`인 레이블을 가진 노드를 선호하도록 되어있다.

예시에서 `In`이라는 오퍼레이터를 사용하였다. 
새로운 노드 어피니티 문법은 다음의 오퍼레이터들을 지원한다: `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, `Lt`. 
`NotIn`과 `DoesNotExist`를 사용하여 안티-어피니티 동작을 할 수 있고 [노드 테인트(node taints)](/docs/concepts/configuration/taint-and-toleration/) 사용하여 특정한 노드에서 파드를 쫓아낼 수 있다.

`nodeSelector`와 `nodeAffinity`를 모두 지정한다면 파드가 후보 노드에 스케쥴 되기 위해서는 *둘 다* 반드시 만족해야한다.

여러개의 `nodeAffinity` 타입과 관련하여 `nodeSelectorTerms`를 지정하면 파드는 `nodeSelectorTerms` 중에서 **하나라도 만족**하는 노드에 스케쥴될 수 있다. 

`nodeSelectorTerms`와 관련된 `matchExpressions`를 여러개 지정하면 파드는 `matchExpressions`가 **모두 만족**하는 노드에만 스케쥴될 수 있다.

파드가 스케쥴된 노드의 레이블을 지우거나 변경해도 파드는 삭제되지 않는다. 다시 말해, 어피니티 선택은 파드가 스케쥴링 되는 시점에만 작동한다.

`preferredDuringSchedulingIgnoredDuringExecution`에서 `weight` 필드는 1-100까지의 범위를 가진다. 
모든 스케쥴링 요구사항 (리소스 요청, RequiredDuringScheduling 어피니티 표현식 등)을 만족하는 각 노드들에 대해서 스케쥴러는 이 필드를 순회하며 노드가 MatchExpressions에 적합할 때 "weight"를 누적 합계에 추가하여 총합을 계산할 것이다. 
이 점수는 노드에 대해 다른 우선순위 함수의 점수들과 합쳐진다. 가장 높은 점수를 가진 노드를 가장 선호하게 된다.

### 파드간 어피니티와 안티-어피니티

파드간 어피니티와 안티-어피니티는 파드를 노드의 레이블이 아니라 *노드에서 이미 동작 중인 파드들의 레이블을 기반으로* 동작할 수 있는 노드를 선택하게 할 수 있다. 
이 규칙은 "이 파드는 반드시 Y 규칙을 만족하는 파드가 하나 이상 동작중인 X에서만 동작할 수 있도록(안티-어피니티의 경우, 동작할수 없도록) 한다"는 형태로 구성되어있다. 
Y는 네임스페이스와 관련된 선택적 목록을 가진 LabelSelector로 표현된다; 노드와는 다르게 파드는 네임스페이스 기반(이는 파드의 레이블이 네임스페이스 기반임을 내포한다)이고 파트 레이블에 대한 레이블 셀렉터는 반드시 셀렉터가 어느 네임스페이스에 적용되어야 하는지 지정해 주어야 하기 때문이다. 
개념적으로 X는 노드, 랙, 클라우드 제공자 영역, 클라우드 제공자 리젼 등과 같은 토폴로지 도메인이다. 시스템이 사용하는 토폴로지 도메인을 의미하는 노드 레이블의 키인 `topologyKey`를 사용하여 토폴로지 도메인을 표현할 수 있으며, 예시는 [넘어가기 전에: 빌트인 노드 레이블](#built-in-node-labels) 섹션에 나열된 레이블 키를 보면 된다.

{{< note >}}
파드간 어피니티와 안티-어피니티는 상당한 양의 연산을 필요로 하여 큰 클러스터에서는 스케쥴링을 상당히 느리게 할 수 있다. 
수백개의 노드가 넘는 클러스터에서 이를 사용하는 것은 추천하지 않는다.
{{< /note >}}

{{< note >}}
파드 안티-어피니티는 노드가 일관적으로 레이블을 가지고 있어야 함을 전제로 한다. 예를들어 클러스터의 모든 노드는 `topologyKey`와 매칭되는 적절한 레이블을 가지고 있어야 한다. 일부 또는 모든 노드가 지정된 `topologyKey` 레이블이 없다면 이는 의도치 않은 동작을 일으킬 수 있다.
{{< /note >}}

노드 어피니티처럼 현재 각각 "엄격한"과 "유연한" 제약사항을 나타내는 `requiredDuringSchedulingIgnoredDuringExecution`와 `preferredDuringSchedulingIgnoredDuringExecution`라고 하는 파드 어피니티와 안티 어피니티 두가지 종류가 있다. 
앞선 노드 어피니티 섹션의 설명을 보면 된다. 
`requiredDuringSchedulingIgnoredDuringExecution` 어피니티의 예시는 "서비스 A와 서비스 B는 서로 많은 통신을 하기 때문에 각 서비스의 파드들을 동일한 영역에 위치시킨다."이고 `preferredDuringSchedulingIgnoredDuringExecution` 안티 어피니티의 예시는 "서비스를 여러 영역에 걸처 퍼트린다"가 될 것이다
(엄격한 제약조건은 파드가 영역의 수보다 많을 수 있기 때문에 말이 안된다).

파드간 어피니티는 파드 스펙에서 `affinity` 필드의 `podAffinity` 필드에서 지정할 수 있다. 그리고 파드간 안티-어피니티는 파드 스펙에서 `affinity` 필드의 `podAntiAffinity` 필드에서 지정할 수 있다.

#### 파드 어피니티를 사용하는 파드의 예시:

{{< codenew file="pods/pod-with-pod-affinity.yaml" >}}

이 파드에서의 어피니티는 하나의 파드 어피니티 규칙과 하나의 안티-어피니티 규칙을 정의한다. 이 예시에서 `podAffinity`는 `requiredDuringSchedulingIgnoredDuringExecution`이고 `podAntiAffinity`는 `preferredDuringSchedulingIgnoredDuringExecution`이다. 
파드 어피니티 규칙은 "security"를 키로하고 "S1"을 값으로 하는 레이블을 가진 파드가 최소한 하나라도 동작 중인 한 노드에서만 스케쥴될 수 있다고 말하고 있다.
(더 정확하게는 파드가 `failure-domain.beta.kubernetes.io/zone`를 키로하고 V를 값으로 하는 클러스터의 노드가 "security"를 키로하고 "S1"을 값으로 하는 레이블을 가진 파드를 동작시키고 있는 것과 같이 노드 N이 `failure-domain.beta.kubernetes.io/zone`을 키로 하고 어떤 V를 값으로 하는 레이블이 있는 노드 N에 뜨기에 적합하다.) 
파드 안티-어피니티 규칙은 파드가 "security"를 키로하고 "S2"를 값으로 하는 레이블을 가진 파드를 실행시키고 있는 노드일 경우 해당 노드에 스케쥴하지 않는 것을 선호한다고 말하고 있다. 
(`topologyKey`가 `failure-domain.beta.kubernetes.io/zone`라면 이는 스케쥴하고자 하는 파드가 "security"를 키로하고 "S2"를 값으로하는 레이블을 가진 파드를 실행하고 있는 노드와 동일한 영역에 있는 노드들에 스케쥴될 수 없음을 의미한다.) 
[디자인 문서](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md)를 통해 `requiredDuringSchedulingIgnoredDuringExecution`와 `preferredDuringSchedulingIgnoredDuringExecution`의 파드 어피니티와 안티-어피니티에 대한 많은 예시를 확인할 수 있다.

파드 어피니티와 안티-어피니티에 대해 허용된 연산자는 `In`, `NotIn`, `Exists`, `DoesNotExist`가 있다.

원칙적으로 `topologyKey`는 어느 규칙에 맞는 레이블-키도 될 수 있다. 
하지만 성능과 보안상의 이유로 토폴로지 키에는 몇가지 제약사항이 있다.

1. 어피니티와 `requiredDuringSchedulingIgnoredDuringExecution` 파드 안티-어피니티에 대해 `topologyKey`가 비어있는 것은 허용하지 않는다.
2. `requiredDuringSchedulingIgnoredDuringExecution` 파드 안티-어피니티에 대해 어드미션 컨트롤러의 `LimitPodHardAntiAffinityTopology`는 `topologyKey`를 `kubernetes.io/hostname`으로 제한하기 위해 도입되었다. 사용자 정의 토폴로지를 이용하고자 할 경우 어드미션 컨트롤러를 수정하거나 간단하게 이를 비활성화 하면 된다.
3. `preferredDuringSchedulingIgnoredDuringExecution` 파드 안티-어피니티에 대해 `topologyKey`가 비어있는 경우 이를 "모든 토폴로지"("모든 토폴로지"는 현재 `kubernetes.io/hostname`, `failure-domain.beta.kubernetes.io/zone`, `failure-domain.beta.kubernetes.io/region`로 제한된다)로 해석한다.
4. 위의 경우를 제외하면 `topologyKey`는 어느 규칙에 맞는 레이블-키도 가능하다.

`labelSelector`와 `topologyKey`외에도 `labelSelector`가 매칭되어야 하는 네임스페이스의  `namespaces` 리스트를 선택적으로 지정할 수 있다(이는 `labelSelector`와 `topologyKey`와 같은 개위로 작성되어야 한다).
생략되어있거나 비어있을 경우 어피니티/안티-어피니티 정의가 있는 파드의 네임스페이스가 기본 값이다.

파드가 노드에 스케쥴되려면 `requiredDuringSchedulingIgnoredDuringExecution` 어피니티 및 안티-어피니티와 관련된 모든 `matchExpressions`를 만족해야 한다.

#### 더 실용적인 유스케이스

파드간 어피니티와 안티-어피니티는 레플리카셋, 스테이트풀셋, 디플로이먼트 등과 같은 상위 레벨의 컬렉션에 사용될 때 좀 더 유용할 수 있다. 
이를 통해 같은 노드에 함께 위치시키는 것과 같이 정의된 토폴로지와 동일한 곳에 함께 위치시키는 워크로드를 쉽게 구성할 수 있다.

##### 항상 같은 노드에 위치시키기

세개의 노드를 가진 클러스터가 있는 상황에서 웹 어플리케이션은 redis와 같은 인메모리 캐시를 가지고 있다. 웹 서버를 캐시가 있는 위치와 동일한 곳으로 최대한 많이 위치시키고 싶다.

이 짧은 yaml은 세개의 레플리카를 가지고 `app=store`라는 셀렉터 레이블을 가진 간단한 redis 디플로이먼트이다. 디플로이먼트는 `PodAntiAffinity` 설정이 있어 스케쥴러가 레플리카들을 하나의 노드에만 위치하지 않도록 한다.

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

아래의 짧은 yaml은 웹서버 디플로이먼트가 `podAntiAffinity`와 `podAffinity` 설정을 가진 것이다. 이는 스케쥴러에게 이 레플리카들이 `app=store`라는 셀렉터 레이블을 가진 파드와 함께 위치시키고 싶다는 것을 알려준다. 또한 웹서버 레플리카가 하나의 노드에만 위치하지 않도록 한다.

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
        image: nginx:1.12-alpine
```

위의 두 디플로이먼트를 생성하면 세개의 노드를 가진 클러스터는 다음과 같이 보일 것이다.


|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| *webserver-1*        |   *webserver-2*     |    *webserver-3*   |
|  *cache-1*           |     *cache-2*       |     *cache-3*      |

여기서 볼 수 있듯이 `web-server`의 세 레플리카들이 기대했던 것처럼 알아서 캐시와 함께 위치하게 되었다.

```
kubectl get pods -o wide
```
결과는 다음과 비슷할 것이다:
```
NAME                           READY     STATUS    RESTARTS   AGE       IP           NODE
redis-cache-1450370735-6dzlj   1/1       Running   0          8m        10.192.4.2   kube-node-3
redis-cache-1450370735-j2j96   1/1       Running   0          8m        10.192.2.2   kube-node-1
redis-cache-1450370735-z73mh   1/1       Running   0          8m        10.192.3.1   kube-node-2
web-server-1287567482-5d4dz    1/1       Running   0          7m        10.192.2.3   kube-node-1
web-server-1287567482-6f7v5    1/1       Running   0          7m        10.192.4.3   kube-node-3
web-server-1287567482-s330j    1/1       Running   0          7m        10.192.3.2   kube-node-2
```

##### 절대 동일한 노드에 위치시키지 않게 하기

위의 예시는 `PodAntiAffinity` 규칙을 `topologyKey:"kubernetes.io/hostname"`과 함께 사용하여 redis 클러스터가 하나의 호스트에 두개 이상 위치하지 않도록 배포한다. 
[ZooKeeper 튜토리얼](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)을 통해 같은 방법을 사용하여 스테이트풀셋을 고가용성을 위해 안티-어피니티 설정을 한 예시를 확인할 수 있다.

## nodeName

`nodeName` 노드 셀렉션을 하는 가장 간단한 형태이지만 자체의 한계때문에 일반적으로 사용하지는 않는다. 
`nodeName`은 파드 스펙의 필드이다. 비어있지 않다면 스케쥴러는 이 파트를 무시하게 되고 해당되는 노드에서 동작중인 kubelet이 파드를 실행하려 할 것이다. 
따라서 `nodeName`이 파드 스펙에 제공되면 노드 셀렉션에 대한 위의 방법들 중 가장 우선시된다.

`nodeName`으로 노드를 선택하는 것의 제약사항이 몇가지 있다:
    
-		그 이름을 가진 노드가 없을 경우 파드는 실행되지 않을 것이고 몇몇 경우에는 자동으로 삭제된다.
-		그 이름을 가진 노드가 파드를 실행하기 위한 충분한 리소스가 없는 경우 파드의 실행은 실패하고 OutOfmemory 또는 OutOfcpu와 같은 이유를 나타낼 것이다.
-		클라우드 환경에서의 노드 이름은 항상 예측이 가능하거나 안정적인 것이 아니다.

`nodeName` 필드를 사용한 파드 설정 파일의 예시이다:

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

우의 파드는 kube-01 노드에서 동작할 것이다.

{{% /capture %}}

{{% capture whatsnext %}}

[테인트(Taints)](/docs/concepts/configuration/taint-and-toleration/)는 노드가 특정 파드들을 *쫓아내게* 할 수 있다.

[노드 어피니티](https://git.k8s.io/community/contributors/design-proposals/scheduling/nodeaffinity.md)와 [파드간 어피니티/안티-어피니티](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md)에 대한 디자인 문서는 이 기능들에 대한 추가적인 배경 정보를 포함한다.

파드가 노드에 할당되고 나면 kubelet은 파드를 실행하고 노드의 로컬 리소스를 할당한다. 
[토폴로지 매니저](/docs/tasks/administer-cluster/topology-manager/)는 노드 레벨의 리소스 할당 결정의 일부분이 될 수 있다.

{{% /capture %}}
