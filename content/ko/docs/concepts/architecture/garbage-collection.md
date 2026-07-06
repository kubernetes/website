---
title: 가비지(garbage) 수집
content_type: concept
weight: 70
---

<!-- overview -->
{{<glossary_definition term_id="garbage-collection" length="short">}}
다음과 같은 리소스를 정리한다:

* [종료된 파드](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
* [완료된 잡](/docs/concepts/workloads/controllers/ttlafterfinished/)
* [소유자 참조가 없는 오브젝트](#owners-dependents)
* [사용되지 않는 컨테이너와 컨테이너 이미지](#containers-images)
* [반환 정책이 Delete인 스토리지클래스에 의해 동적으로 생성된 퍼시스턴트볼륨](/docs/concepts/storage/persistent-volumes/#delete)
* [오래되었거나 만료된 CertificateSigningRequest(CSR)](/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
* 다음과 같은 상황에서 삭제되는 {{<glossary_tooltip text="노드" term_id="node">}}:
  * 클러스터가 [클라우드 컨트롤러 매니저](/docs/concepts/architecture/cloud-controller/)를 사용하는 클라우드에서
  * 클러스터가 클라우드 컨트롤러 매니저와 유사한 애드온을
    사용하는 온프레미스에서
* [노드 리스(Lease) 오브젝트](/docs/concepts/architecture/nodes/#heartbeats)

## 소유자(owners)와 종속(dependents) {#owners-dependents}

쿠버네티스의 많은 오브젝트는 [*소유자 참조*](/docs/concepts/overview/working-with-objects/owners-dependents/)를 통해 서로 연결되어 있다.
소유자 참조는 컨트롤 플레인에게 어떤 오브젝트가 다른 오브젝트에 종속되어 있는지를 알려준다.
쿠버네티스는 소유자 참조를 사용하여 컨트롤 플레인과 다른 API
클라이언트에게 오브젝트를 삭제하기 전에 관련된 리소스를 정리할 수 있는 기회를 제공한다.
대부분의 경우, 쿠버네티스는 소유자 참조를 자동으로 관리한다.

소유권(ownership)은 일부 리소스가 사용하는 [레이블과 셀렉터](/docs/concepts/overview/working-with-objects/labels/)
메커니즘과는 다르다. 예를 들어,
`EndpointSlice` 오브젝트를 생성하는 {{<glossary_tooltip text="서비스" term_id="service">}}를
생각해보자. 서비스는 *레이블*을 사용해 컨트롤 플레인이
어떤 `EndpointSlice` 오브젝트가 해당 서비스에 의해 사용되는지 판단하는 데 도움을 준다. 레이블과 더불어,
서비스를 대신해 관리되는 각 `EndpointSlice` 오브젝트는
소유자 참조를 가진다. 소유자 참조는 쿠버네티스의 다른 부분이 제어하지 않는
오브젝트를 방해하는 것을 방지하는 데 도움을 준다.

{{< note >}}
교차 네임스페이스(cross-namespace)의 소유자 참조는 디자인상 허용되지 않는다.
네임스페이스 종속 오브젝트는 클러스터 범위 또는 네임스페이스 소유자를 지정할 수 있다.
네임스페이스 소유자는 **반드시** 종속 오브젝트와 동일한 네임스페이스에 존재해야 한다.
그렇지 않다면, 소유자 참조는 없는 것으로 간주되어, 종속 오브젝트는
모든 소유자가 없는 것으로 확인되면 삭제될 수 있다.

클러스터 범위의 종속 오브젝트는 클러스터 범위의 소유자만 지정할 수 있다.
v1.20 이상에서, 클러스터 범위의 종속 오브젝트가 네임스페이스 종류를 소유자로 지정하면,
확인할 수 없는 소유자 참조가 있는 것으로 간주되어 가비지 수집이 될 수 없다.

v1.20 이상에서, 가비지 수집기가 잘못된 교차 네임스페이스 `ownerReference`
또는 네임스페이스 종류를 참조하는 `ownerReference`가 있는 클러스터 범위의 종속 항목을 감지하면,
`OwnerRefInvalidNamespace`가 원인인 경고 이벤트와 유효하지 않은 종속 항목의 `involvedObject`가 보고된다.
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`
를 실행하여 이러한 종류의 이벤트를 확인할 수 있다.
{{< /note >}}

## 캐스케이딩(cascading) 삭제 {#cascading-deletion}

쿠버네티스는 오브젝트를 삭제할 때 더 이상 소유자 참조가 없는지,
예를 들어 레플리카셋을 삭제할 때, 남겨진 파드가 없는지 확인하고 삭제한다.
오브젝트를 삭제할 때 쿠버네티스가 오브젝트의 종속 오브젝트들을 자동으로 삭제할 지 여부를 제어할 수 있다.
이 과정을 *캐스케이딩 삭제*라고 한다.
캐스케이딩 삭제에는 다음과 같은 두 가지 종류가 있다.

* 포그라운드 캐스케이딩 삭제(foreground cascading deletion)
* 백그라운드 캐스케이딩 삭제(background cascading deletion)

또한 쿠버네티스의 {{<glossary_tooltip text="파이널라이저(finalizers)" term_id="finalizer">}}를 사용하여
가비지 수집이 소유자 참조가 있는 자원을 언제 어떻게 삭제할 것인지 제어할 수 있다.

### 포그라운드 캐스케이딩 삭제 {#foreground-deletion}

포그라운드 캐스케이딩 삭제에서는 삭제하려는 소유자 오브젝트가 먼저
*삭제 중* 상태가 된다. 이 상태에서는 소유자 오브젝트에게 다음과 같은 일이
일어난다.

* 쿠버네티스 API 서버가 오브젝트의 `metadata.deletionTimestamp` 필드를
  오브젝트가 삭제 표시된 시간으로 설정한다.
* 쿠버네티스 API 서버가 `metadata.finalizers` 필드를 `foregroundDeletion`으로
  설정한다.
* 오브젝트는 삭제 과정이 완료되기 전까지
  쿠버네티스 API를 통해 조회할 수 있다.

소유자 오브젝트가 *삭제 진행 중(deletion in progress)* 상태가 된 이후, 컨트롤러는 알고 있는 종속 오브젝트들을 삭제한다.
알고 있는 모든 종속 오브젝트들이 삭제되고 나면, 컨트롤러가 소유자 오브젝트를 삭제한다.
이 시점에서 오브젝트는 더 이상
쿠버네티스 API를 통해 조회할 수 없다.

포그라운드 캐스케이딩 삭제 중에 소유자 오브젝트의 삭제를 막는 종속 오브젝트는
`ownerReference.blockOwnerDeletion=true` 필드를 가지고 있으면서 가비지 수집 컨트롤러 캐시에 있는
오브젝트뿐이다. 가비지 수집 컨트롤러 캐시에는 리소스 유형을 나열하거나(list)
감시(watch)하는 데 실패한 오브젝트, 또는 소유자 오브젝트의 삭제와 동시에 생성된
오브젝트가 포함되지 않을 수 있다.
자세한 내용은 [포그라운드 캐스케이딩 삭제 사용](/docs/tasks/administer-cluster/use-cascading-deletion/#use-foreground-cascading-deletion)을
참고한다.

### 백그라운드 캐스케이딩 삭제 {#background-deletion}

백그라운드 캐스케이딩 삭제에서는 쿠버네티스 API 서버가 소유자
오브젝트를 즉시 삭제하고 가비지 수집 컨트롤러(사용자 정의 또는 기본)가
백그라운드에서 종속 오브젝트들을 정리한다.
파이널라이저가 존재하면, 필요한 모든 정리 작업이 완료될 때까지 오브젝트가 삭제되지 않도록 보장한다.
수동으로 포그라운드 삭제를 사용하거나 종속 오브젝트를 분리하도록 선택하지 않는 한,
쿠버네티스는 기본적으로 백그라운드 캐스케이딩 삭제를 사용한다.

자세한 내용은 [백그라운드 캐스케이딩 삭제 사용](/docs/tasks/administer-cluster/use-cascading-deletion/#use-background-cascading-deletion)을
참고한다.

### 종속된 고아 오브젝트(orphaned dependents)

쿠버네티스가 소유자 오브젝트를 삭제할 때, 남은 종속 오브젝트는 *고아(orphan)* 오브젝트라고 부른다.
기본적으로 쿠버네티스는 종속된 오브젝트들을 삭제한다. 이 동작을 재정의하는 방법을 알아보려면,
[소유자 오브젝트 및 종속된 고아 오브젝트 삭제](/docs/tasks/administer-cluster/use-cascading-deletion/#set-orphan-deletion-policy)를 참고한다.

## 사용되지 않는 컨테이너와 이미지 가비지 수집 {#containers-images}

{{<glossary_tooltip text="kubelet" term_id="kubelet">}}은
사용되지 않는 이미지에 대한 가비지 수집을 5분마다, 컨테이너에 대한 가비지 수집을 매분마다
수행한다. 외부 가비지 수집 도구는 kubelet의 동작을 방해하여
유지되어야 하는 컨테이너를 삭제할 수 있으므로 사용을 피해야 한다.

사용되지 않는 컨테이너와 이미지에 대한 가비지 수집 옵션을 구성하려면,
[설정 파일](/docs/tasks/administer-cluster/kubelet-config-file/)을 사용하여
kubelet을 조정하고 가비지 수집과 관련된 파라미터를
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
리소스 유형을 사용하여 변경한다.

### 컨테이너 이미지 라이프사이클

쿠버네티스는 kubelet의 일부인 *이미지 관리자*가
{{< glossary_tooltip text="cadvisor" term_id="cadvisor" >}}와 협력하여
모든 이미지의 라이프사이클을 관리한다. kubelet은 가비지 수집
결정을 내릴 때 다음과 같은 디스크 사용량 제한을
고려한다.

* `HighThresholdPercent`
* `LowThresholdPercent`

설정된 `HighThresholdPercent` 값을 초과하는 디스크 사용량은 가비지 수집을
트리거하며, 마지막으로 사용된 시간을 기준으로 오래된 이미지부터
순서대로 삭제한다. kubelet은 디스크 사용량이 `LowThresholdPercent`
값에 도달할 때까지 이미지를 삭제한다.

#### 사용되지 않는 컨테이너 이미지에 대한 가비지 수집 {#image-maximum-age-gc}

디스크 사용량과 관계없이, 로컬 이미지가 사용되지 않은 상태로 유지될 수 있는
최대 시간을 지정할 수 있다. 이는 노드별로 구성하는 kubelet 설정이다.

이 설정을 구성하려면, kubelet 구성 파일에서 `imageMaximumGCAge`
필드에 값을 설정해야 한다.

이 값은 쿠버네티스 {{< glossary_tooltip text="기간(duration)" term_id="duration" >}}으로 지정한다.
자세한 내용은 용어집의 [기간(duration)](/docs/reference/glossary/?all=true#term-duration)
항목을 참고한다.

예를 들어, 이 구성 필드를 `12h45m`로 설정할 수 있으며,
이는 12시간 45분을 의미한다.

{{< note >}}
이 기능은 kubelet이 재시작되는 동안에는 이미지 사용량을 추적하지 않는다.
kubelet이 재시작되면 추적하던 이미지 기간이 초기화되어, kubelet은 이미지
기간을 기준으로 한 가비지 수집 대상 이미지 판단을 위해 전체
`imageMaximumGCAge` 기간만큼 다시 기다리게 된다.
{{< /note>}}

### 컨테이너 가비지 수집 {#container-image-garbage-collection}

kubelet은 사용자가 정의할 수 있는 다음 변수를 기반으로
사용되지 않는 컨테이너를 가비지 수집한다.

* `MinAge`: kubelet이 컨테이너를 가비지 수집할 수 있는 최소 나이.
  `0`으로 설정하여 비활성화할 수 있다.
* `MaxPerPodContainer`: 각 파드가 가질 수 있는 데드(dead) 컨테이너의 최대 개수.
  `0` 미만으로 설정하여 비활성화할 수 있다.
* `MaxContainers`: 클러스터가 가질 수 있는 데드 컨테이너의 최대 개수.
  `0` 미만으로 설정하여 비활성화할 수 있다.

이 변수들 외에도, kubelet은 식별할 수 없는 컨테이너와 삭제된 컨테이너를
일반적으로 오래된 순서대로 가비지 수집한다.

파드당 최대 컨테이너 개수(`MaxPerPodContainer`)를 유지하는 것이 전역(global)
데드 컨테이너의 허용 총량(`MaxContainers`)을 초과하게 되는 상황에서는,
`MaxPerPodContainer`와 `MaxContainers`가 서로 충돌할 수 있다.
이 경우 kubelet은 충돌을 해결하기 위해 `MaxPerPodContainer`를 조정한다.
최악의 경우 `MaxPerPodContainer`를 `1`로 낮추고
가장 오래된 컨테이너부터 축출하게 된다.
또한, 삭제된 파드가 소유했던 컨테이너는 `MinAge`보다 오래되면
제거된다.

{{<note>}}
kubelet은 자신이 관리하는 컨테이너에 대해서만 가비지 수집을 수행한다.
{{</note>}}

## 가비지 수집 구성하기 {#configuring-gc}

리소스를 관리하는 컨트롤러별 옵션을 구성하여
리소스의 가비지 수집을 조정할 수 있다. 가비지 수집을 구성하는 방법은
다음 페이지에서 확인할 수 있다.

* [쿠버네티스 오브젝트의 캐스케이딩 삭제 구성하기](/docs/tasks/administer-cluster/use-cascading-deletion/)
* [완료된 잡에 대한 정리(cleanup) 구성하기](/docs/concepts/workloads/controllers/ttlafterfinished/)

## {{% heading "whatsnext" %}}

* [쿠버네티스 오브젝트의 소유권](/docs/concepts/overview/working-with-objects/owners-dependents/)에 대해 자세히 알아보기
* 쿠버네티스 [파이널라이저(finalizers)](/docs/concepts/overview/working-with-objects/finalizers/)에 대해 자세히 알아보기
* 완료된 잡을 정리하는 [TTL 컨트롤러](/docs/concepts/workloads/controllers/ttlafterfinished/)에 대해 알아보기