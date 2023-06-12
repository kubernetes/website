---
title: 가비지(Garbage) 수집
content_type: concept
weight: 70
---

<!-- overview -->
{{<glossary_definition term_id="garbage-collection" length="short">}}
다음과 같은 리소스를 정리한다:

  * [종료된 잡](/ko/docs/concepts/workloads/controllers/ttlafterfinished/)
  * [소유자 참조가 없는 오브젝트](#owners-dependents)
  * [사용되지 않는 컨테이너와 컨테이너 이미지](#containers-images)
  * [반환 정책이 삭제인 스토리지클래스에 의해 동적으로 생성된 퍼시스턴트볼륨](/ko/docs/concepts/storage/persistent-volumes/#delete)
  * [Stale 또는 만료된 CertificateSigningRequests (CSRs)](/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
  * {{<glossary_tooltip text="노드" term_id="node">}} 는 다음과 같은 상황에서 삭제된다:
    * 클러스터가 [클라우드 컨트롤러 매니저](/ko/docs/concepts/architecture/cloud-controller/)를 사용하는 클라우드
    * 클러스터가 클라우드 컨트롤러 매니저와 유사한 애드온을 사용하는 
      온프레미스
  * [노드 리스(Lease) 오브젝트](/ko/docs/concepts/architecture/nodes/#heartbeats)

## 소유자(Owners)와 종속(dependents) {#owners-dependents}

쿠버네티스의 많은 오브젝트는 [*owner references*](/docs/concepts/overview/working-with-objects/owners-dependents/)를 통해 서로 연결되어 있다.

소유자 참조(Owner references)는 컨트롤 플레인에게 어떤 오브젝트가 서로 종속적인지를 알려준다.
쿠버네티스는 소유자 참조를 사용하여 컨트롤 플레인과 다른 API 클라이언트에게 오브젝트를 삭제하기 전 관련 리소스를 정리하는 기회를 제공한다. 대부분의 경우, 쿠버네티스는 소유자 참조를 자동으로 관리한다.

소유권(Ownership)은 일부 리소스가 사용하는 [레이블과 셀렉터](/ko/docs/concepts/overview/working-with-objects/labels/)
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

## 캐스케이딩(Cascading) 삭제 {#cascading-deletion}

쿠버네티스는 오브젝트를 삭제할 때 더 이상 소유자 참조가 없는지,
예를 들어 레플리카셋을 삭제할 때, 남겨진 파드가 없는지 확인하고 삭제한다.
오브젝트를 삭제할 때 쿠버네티스가 오브젝트의 종속 오브젝트들을 자동으로 삭제할 지 여부를 제어할 수 있다.
이 과정을 `캐스케이딩 삭제`라고 한다.
캐스케이딩 삭제에는 다음과 같은 두 가지 종류가 있다.

  * 포그라운드 캐스케이딩 삭제(Foreground cascading deletion)
  * 백그라운드 캐스케이딩 삭제(Background cascading deletion)

또한 쿠버네티스의 {{<glossary_tooltip text="finalizers" term_id="finalizer">}}를 사용하여 
가비지 수집이 소유자 참조가 있는 자원을 언제 어떻게 삭제할 것인지 제어할 수 있다.

### 포그라운드 캐스케이딩 삭제 {#foreground-deletion}

포그라운드 캐스케이딩 삭제에서는 삭제하려는 소유자 오브젝트가 먼저
*삭제 중* 상태가 된다. 이 상태에서는 소유자 오브젝트에게 다음과 같은 일이
일어난다:

  * 쿠버네티스 API 서버가 오브젝트의 `metadata.deletionTimestamp` 필드를
    오브젝트가 삭제 표시된 시간으로 설정한다.
  * 쿠버네티스 API 서버가 `metadata.finalizers` 필드를 `foregroundDeletion`로
    설정한다. 
  * 오브젝트는 삭제 과정이 완료되기 전까지 
    쿠버네티스 API를 통해 조회할 수 있다.

소유자 오브젝트가 삭제 중 상태가 된 이후, 컨트롤러는 종속 오브젝트들을 삭제한다.
모든 종속 오브젝트들이 삭제되고나면, 컨트롤러가 소유자 오브젝트를 삭제한다.
이 시점에서 오브젝트는 더 이상 
쿠버네티스 API를 통해 조회할 수 없다.

포그라운드 캐스케이딩 삭제 중에 소유자 오브젝트의 삭제를 막는
종속 오브젝트는`ownerReference.blockOwnerDeletion=true`필드를 가진 오브젝트다.
더 자세한 내용은 [Use foreground cascading deletion](/ko/docs/tasks/administer-cluster/use-cascading-deletion/#use-foreground-cascading-deletion)를
참고한다.

### 백그라운드 캐스케이딩 삭제 {#background-deletion}

백그라운드 캐스케이딩 삭제에서는 쿠버네티스 API 서버가 소유자 오브젝트를 즉시 삭제하고
백그라운드에서 컨트롤러가 종속 오브젝트들을 삭제한다.
쿠버네티스는 수동으로 포그라운드 삭제를 사용하거나 종속 오브젝트를 분리하지 않는다면, 
기본적으로 백그라운드 캐스케이딩 삭제를 사용한다.

더 자세한 내용은 [Use background cascading deletion](/ko/docs/tasks/administer-cluster/use-cascading-deletion/#use-background-cascading-deletion)를
참고한다.

### 분리된 종속 (Orphaned dependents)

쿠버네티스가 소유자 오브젝트를 삭제할 때, 남은 종속 오브젝트는 *분리된* 오브젝트라고 부른다.
기본적으로 쿠버네티스는 종속 오브젝트를 삭제한다. 이 행동을 오버라이드하는 방법을 보려면,
[Delete owner objects and orphan dependents](/ko/docs/tasks/administer-cluster/use-cascading-deletion/#set-orphan-deletion-policy)를 참고한다.

## 사용되지 않는 컨테이너와 이미지 가비지 수집 {#containers-images}

{{<glossary_tooltip text="kubelet" term_id="kubelet">}}은
사용되지 않는 이미지에 대한 가비지 수집을 5분마다, 컨테이너에 대한 가비지 수집을 1분마다
수행한다. 외부 가비지 수집 도구는 kubelet 의 행동을 중단시키고
존재해야만 하는 컨테이너를 삭제할 수 있으므로 사용을 피해야 한다.

사용되지 않는 컨테이너와 이미지에 대한 가비지 수집 옵션을 구성하려면, 
[configuration file](/docs/tasks/administer-cluster/kubelet-config-file/) 사용하여 
kubelet 을 수정하거나
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration) 리소스 타입의
가비지 수집과 관련된 파라미터를 수정한다.

### 컨테이너 이미지 라이프사이클

쿠버네티스는 kubelet의 일부인 *이미지 관리자*가 
{{< glossary_tooltip text="cadvisor" term_id="cadvisor" >}}와 협동하여
모든 이미지의 라이프사이클을 관리한다.
kubelet은 가비지 수집 결정을 내릴 때, 
다음 디스크 사용량 제한을 고려한다.

  * `HighThresholdPercent`
  * `LowThresholdPercent`

`HighThresholdPercent` 값을 초과한 디스크 사용량은
마지막으로 사용된 시간을 기준으로 오래된 이미지순서대로 이미지를 삭제하는
가비지 수집을 트리거한다. kubelet은 디스크 사용량이 `LowThresholdPercent` 값에 도달할 때까지
이미지를 삭제한다.

### 컨테이너 이미지 가비지 수집 {#container-image-garbage-collection}

kubelet은 사용자가 정의할 수 있는 다음 변수들을 기반으로 
사용되지 않는 컨테이너들을 삭제한다:

  * `MinAge`: kubelet이 가비지 수집할 수 있는 최소 나이. 
    `0`으로 세팅하여 비활성화할 수 있다.
  * `MaxPerPodContainer`: 각 파드 쌍이 가질 수 있는 죽은 컨테이너의 최대 개수.
    `0`으로 세팅하여 비활성화할 수 있다.
  * `MaxContainers`: 클러스터가 가질 수 있는 죽은 컨테이너의 최대 개수
    `0`으로 세팅하여 비활성화할 수 있다.

위 변수와 더불어, kubelet은 식별할 수 없고 삭제된 컨테이너들을 
오래된 순서대로 가비지 수집한다.

`MaxPerPodContainer`와 `MaxContainer`는
파드의 최대 컨테이너 개수(`MaxPerPodContainer`)를 유지하는 것이
전체 죽은 컨테이너의 개수 제한(`MaxContainers`)을 초과하게 될 때,
서로 충돌이 발생할 수 있다.
이 상황에서 kubelet은 충돌을 해결하기 위해 `MaxPodPerContainer`를 조절한다.
최악의 시나리오에서는 `MaxPerPodContainer`를 `1`로 다운그레이드하고
가장 오래된 컨테이너들을 축출한다.
또한, 삭제된 파드가 소유한 컨테이너들은 `MinAge`보다 오래되었을 때 삭제된다.

{{<note>}}
kubelet은 자신이 관리하는 컨테이너에 대한 가비지 수집만을 수행한다.
{{</note>}}

## 가비지 수집 구성하기 {#configuring-gc}

자원을 관리하는 컨트롤러의 옵션을 구성하여 
가비지 컬렉션을 수정할 수 있다.
다음 페이지에서 어떻게 가비지 수집을 구성할 수 있는지 확인할 수 있다.

  * [쿠버네티스 오브젝트의 캐스케이딩 삭제 구성하기](/ko/docs/tasks/administer-cluster/use-cascading-deletion/)
  * [완료된 잡 자동 정리하기](/ko/docs/concepts/workloads/controllers/ttlafterfinished/)
  
<!-- * [Configuring unused container and image garbage collection](/docs/tasks/administer-cluster/reconfigure-kubelet/) -->

## {{% heading "whatsnext" %}}

* [쿠버네티스 오브젝트의 소유권](/docs/concepts/overview/working-with-objects/owners-dependents/)에 대해 알아보자.
* 쿠버네티스 [finalizers](/ko/docs/concepts/overview/working-with-objects/finalizers/)에 대해 알아보자.
* 완료된 잡을 정리하는 [TTL 컨트롤러](/ko/docs/concepts/workloads/controllers/ttlafterfinished/) (beta) 에 대해 알아보자.
