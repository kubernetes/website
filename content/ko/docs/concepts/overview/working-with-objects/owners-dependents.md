---
title: 소유자와 종속자 Owners and Dependents
content_type: concept
weight: 60
---

<!-- overview -->

쿠버네티스에서는 일부 오브젝트가 다른 오브젝트들에 소유권을 가지고 있다. 예를 들어,
{{<glossary_tooltip text="ReplicaSet" term_id="replica-set">}} 은 파드 묶음의 소유자이다. 소유자 파드들에 묶인 파드 묶음은 
종속되어 있다.

소유권은 일부 리소스들에서도 사용하는 [labels and selectors](/ko/docs/concepts/overview/working-with-objects/labels/)
의 메커니즘과는 다르다. 예를 들어, `EndpointSlice` 오브젝트를 생성하는 서비스를 생각해보자. 
서비스는 라벨을 사용하여 컨트롤 플레인이 해당 서비스에 사용되는 `EndpointSlice` 오브젝트를 
결정할 수 있도록 한다. 라벨 외에도 서비스를 대신하여 관리되는 각 `EndpointSlice` 에는 
소유자 참조가 있다. 소유자 참조는 쿠버네티스의 다른 부분들이 제어하고 있지 않은 오브젝트에 
대한 간섭을 피하는데 도움이 된다.

## 오브젝트 사양의 소유자 참조

종속 오브젝트에는 해당 오브젝트를 참조하는 `metadata.ownerReferences` 필드가 있다. 
올바른 소유자 참조는 종속 오브젝트와 동일한 네임스페이스 내에 있는 오브젝트 이름과 UID로 
구성된다. 쿠버네티스는 ReplicaSets, DaemonSets, Deployments, Job과 CronJobs 그리고 
ReplicationControllers와 같은 다른 오브젝트들에 종속 오브젝트에 대해 필드의 값을 
자동으로 설정해준다. 필드의 값을 변경하여서 소유권을 가진 오브젝트와 종속 오브젝트의 
관계를 변경할 수 있다. 그러나 일반적으로 쿠버네티스가 관계를 자동으로 관리해주기 때문에 
사용자가 직접 관계를 건들일 필요가 없다.

종속 오브젝트는 또한 `ownerReferences.blockOwnerDeletion` 필드를 가지고 있다. 소유자 
오브젝트가 종속 오브젝트를 삭제하려고 할 경우 필드의 boolean 값을 확인하여 삭제를 
허용하거나 못하게 막을 수 있다. 만약 {{<glossary_tooltip text="controller" term_id="controller">}} 
(예로, 배포 컨트롤러)가 `metadata.ownerReferences` 필드 값을 설정하려고 하면 쿠버네티스는 
자동으로 필드의 값을 true로 만들어준다. 또한 `blockOwnerDeletion` 필드의 값을 수동으로 
설정하여 가비지 수집을 차단할 종속 항목을 제어할 수 있다.

쿠버네티스 승인 컨트롤러는 소유자의 삭제 권한에 따라 종속 리소스에 대해 이 필드를 변경하려고 
하는 사용자의 접근을 관리할 수 있다. 이렇게 함여 권한이 없는 사용자가 소유자의 오브젝트 
삭제를 지연시키는 것을 막는다.

{{< note >}}
교차 네임스페이스의 소유자 참조는 설계에 의해 허용되지 않는다. 네임스페이스 종속성은 클러스터 
범위 또는 네임스페이스 소유자를 지정할 수 있다. 네임스페이스 소유자는 종속된 파드와 동일한 
네임스페이스에 존재해야 한다. 그렇지 않은 경우 소유자 참조는 부재로 처리되며, 모든 소유자가 
부재된 것으로 확인되면 종속자는 삭제될 수 있다.

클러스터 범위 종속성은 클러스터 범위 소유자만 지정할 수 있다. v1.20+에서는 클러스터 범위 종속이 
네임스페이스 종류를 소유자로 지정하는 경우 확인할 수 없는 소유자 참조가 있는 것으로 간주되면 
가비지 수집을 할 수 없게 된다.

v1.20+에서 가비지 수집기가 잘못된 교차 네임스페이스인 `ownerReference` 또는 네임스페이스 종류를 
참조하는 `ownerReference`를 가진 클러스터 범위 종속을 감지하면 잘못된 종속의 `OwnerRefInvalidNamespace`와 
`involvedObject`를 이유로 경고 이벤트를 보고한다. 이러한 종류의 이벤트는 
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`를 실행하여 확인할 수 있다.
{{< /note >}}

## 소유권 및 최종 결정자

쿠버네티스에게 리소스를 삭제하라고 지시하면, API 서버는 관리 컨트롤러가 리소스에 대한 모든 
[finalizer rules](/docs/concepts/overview/working-with-objects/finalizers/)을 처리할 수 있도록 
한다. {{<glossary_tooltip text="Finalizers" term_id="finalizer">}} 는 클러스터에서 올바르게 
작동해야 하는 리소스를 실수로 삭제하는 것을 방지한다. 예를 들어, Pod에서 사용 중인 `PersistentVolume`을 
삭제하려고 하면 `PersistentVolume`에 `kubernetes.io/pv-protection`의 최종 결정자가 있기 때문에 
즉시 삭제되지 않는다. 대신, 쿠버네티스가 최종 결정자를 클리어할 때까지 볼륨은 `Terminating` 상태로 유지되며 
이는 `PersistentVolume`이 더 이상 Pod에 바인딩 되지 않은 후에만 발생한다.

또한 쿠버네티스는 [foreground or orphan cascading deletion](/ko/docs/concepts/architecture/garbage-collection) 
중 하나를 사용할 때 소유자 리소스에 최종 사용자를 추가한다. 포그라운드 삭제시 `foreground` 최종 
결정자를 추가하여 컨트롤러가 소유자를 삭제하기 전에 `ownerReferences.blockOwnerDeletion=true`가 
있는 종속 리소스를 삭제해야 한다. 고아 삭제 정책을 지정하면 컨트롤러가 소유자 오브젝트를 삭제한 후 
종속 리소스를 무시하도록 쿠버네티스는 `orphan` 최종 결정자를 추가한다.

## {{% heading "다음 내용" %}}

* [쿠버네티스 최종결정자](/docs/concepts/overview/working-with-objects/finalizers/)에 대해 배워본다.
* [가비지 수집](/ko/docs/concepts/architecture/garbage-collection)에 대해서 배워본다.
* [오브젝트 메타데이터](/docs/reference/kubernetes-api/common-definitions/object-meta/#System)에 대한 API 참조 읽기.