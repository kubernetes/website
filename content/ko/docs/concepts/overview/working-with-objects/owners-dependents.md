---
title: 소유자와 종속 오브젝트
content_type: concept
weight: 90
---

<!-- overview -->

쿠버네티스에서는 일부 {{<glossary_tooltip text="오브젝트" term_id="object" >}}는 다른 오브젝트들의 
*소유자*이다. 예를 들어,
{{<glossary_tooltip text="레플리카셋(ReplicaSet)" term_id="replica-set">}} 은 일련의 파드의 소유자이다.
이러한 소유된 오브젝트들은 소유자의 *종속 오브젝트*이다.

소유권은 일부 리소스들에서도 사용하는 [레이블과 셀렉터](/ko/docs/concepts/overview/working-with-objects/labels/)
메커니즘과는 다르다. 예를 들어, `엔드포인트슬라이스(EndpointSlice)` 오브젝트를 
생성하는 서비스를 생각해보자. 이 서비스는 {{<glossary_tooltip text="레이블(Label)" term_id="label">}}을 사용하여 컨트롤 플레인이 어떤 `엔드포인트슬라이스` 오브젝트가 해당 서비스에 사용되는지 
결정할 수 있도록 한다.
레이블 외에도, 서비스에 의해 관리되는 각 `엔드포인트슬라이스`는 소유자 참조를 가지고 있다.
소유자 참조는 쿠버네티스의 다른 부분들이 자신이 제어하지 않는 오브젝트에 
간섭하지 않도록 도와준다.

## 오브젝트 사양의 소유자 참조

종속 오브젝트에는 해당 소유 오브젝트를 참조하는 `metadata.ownerReferences` 필드가 있다. 
올바른 소유자 참조는 종속 오브젝트와 동일한 {{<glossary_tooltip text="네임스페이스" term_id="namespace">}} 내에 있는 오브젝트 이름과 {{<glossary_tooltip text="UID" term_id="uid">}}로 
구성된다. 쿠버네티스는 레플리카셋(ReplicaSets), 데몬셋(DaemonSets), 디플로이먼트(Deployment), 잡(Job), 크론잡(CronJobs) 그리고 
레플리케이션컨트롤러(ReplicationControllers)와 같이 다른 오브젝트들에 종속 오브젝트에 
대해 필드의 값을 자동으로 설정한다. 
필드의 값을 변경하여 소유권을 가진 오브젝트와 종속 오브젝트의 
관계를 변경할 수 있다. 그러나, 일반적으로 쿠버네티스가 관계를 자동으로 관리해주기 때문에 
사용자가 직접 관계를 건드릴 필요가 없다. 

종속 오브젝트에는 boolean 값을 취하고 특정 종속 오브젝트가 
가비지 컬렉션이 소유자 오브젝트를 삭제하지 못하도록 차단할 수 있는지 
여부를 제어하는 `ownerReferences.blockOwnerDeletion` 필드도 있다.
만약 {{<glossary_tooltip text="컨트롤러(controller)" term_id="controller">}} 
(예를 들어, 디플로이먼트 컨트롤러)가 `metadata.ownerReferences` 필드 값을 설정하려고 하면 쿠버네티스는 
자동으로 필드의 값을 `true`로 설정한다. 또한 `blockOwnerDeletion` 필드의 값을 수동으로 
설정하여 가비지 수집을 막을 
종속 오브젝트를 제어할 수 있다.

쿠버네티스 어드미션 컨트롤러는 소유자의 삭제 권한에 따라 종속 리소스에 대해 해당 필드를 변경하려고 
하는 사용자의 접근을 관리할 수 있다. 해당 제어는 권한이 없는 사용자가 소유자의 오브젝트 
삭제를 지연시키는 것을 막는다.

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
또는 네임스페이스 종류를 참조하는 `ownerReference`가 있는 클러스터 범위의 종속 오브젝트를 감지하면,
`OwnerRefInvalidNamespace`가 원인인 경고 이벤트와 유효하지 않은 종속 오브젝트의 `involvedObject`가 보고된다.
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`
를 실행하여 이러한 종류의 이벤트를 확인할 수 있다.
{{< /note >}}

## 소유권 및 파이널라이저

쿠버네티스에게 리소스를 삭제하라고 지시하면, API 서버는 관리 컨트롤러가 리소스에 대한 모든 
[파이널라이저 규칙](/ko/docs/concepts/overview/working-with-objects/finalizers/)을 
처리할 수 있도록 한다. {{<glossary_tooltip text="파이널라이저(Finalizer)" term_id="finalizer">}} 는 클러스터에서 올바르게 
작동해야 하는 리소스를 실수로 삭제하는 것을 방지한다. 예를 들어, 파드에서 여전히 사용 중인 
[퍼시스턴트 볼륨](/ko/docs/concepts/storage/persistent-volumes/)을 삭제하려고 하면 `퍼시스턴트 볼륨`에 
`kubernetes.io/pv-protection`파이널라이저가 있기 때문에 
즉시 삭제되지 않는다. 
대신, 쿠버네티스가 파이널라이저를 지울 때까지 
[볼륨](/ko/docs/concepts/storage/volumes/)은 `Terminating` 상태로 유지되며 
이는 `퍼시스턴트 볼륨`이 더 이상 파드에 바인딩 되지 않은 후에만 발생한다.

또한 쿠버네티스는 [포그라운드(foreground) 또는 고아(orphan) 캐스케이딩 삭제](/ko/docs/concepts/architecture/garbage-collection/#cascading-deletion) 
중 하나를 사용할 때 소유자 리소스에 파이널라이저를 추가한다. 
포그라운드 삭제 시에는 `foreground` 파이널라이저를 
추가하여 컨트롤러가 소유자를 삭제하기 전에 
`ownerReferences.blockOwnerDeletion=true`를 가진 종속 리소스도 삭제해야 한다. 
고아 삭제 정책을 지정하면 컨트롤러가 소유자 오브젝트를 삭제한 후 
종속 리소스를 무시하도록 쿠버네티스는 `orphan` 파이널라이저를 
추가한다.

## {{% heading "whatsnext" %}}

* [쿠버네티스 파이널라이저](/ko/docs/concepts/overview/working-with-objects/finalizers/)에 대해 배워본다.
* [가비지(Garbage) 수집](/ko/docs/concepts/architecture/garbage-collection)에 대해서 배워본다.
* [오브젝트 메타데이터](/docs/reference/kubernetes-api/common-definitions/object-meta/#System)에 대한 API 참조를 읽어본다.