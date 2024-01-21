---
title: 스토리지 사용량 제한
content_type: task
---

<!-- overview -->

이 예제는 네임스페이스(namespace)에서 사용되는 스토리지의 용량을 제한하는 방법을 보여준다.

예제에서는 다음과 같은 리소스가 사용된다. [리소스쿼터(ResourceQuota)](/ko/docs/concepts/policy/resource-quotas/),
[리밋레인지(LimitRange)](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/),
그리고 [퍼시스턴트볼륨클레임(PersistentVolumeClaim)](/ko/docs/concepts/storage/persistent-volumes/).


## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->
## 시나리오: 스토리지 사용량 제한하기

클러스터 관리자는 사용자를 대표하여 클러스터를 운영하고 
, 비용을 제어하기 위해 단일 네임스페이스에서 사용할 수 있는 스토리지의 크기를 제어하려고 한다.

관리자는 다음을 제한하려고 한다.

1. 네임스페이스에 있는 퍼시스턴트볼륨클레임의 수
2. 각 클레임(claim)이 요청할 수 있는 스토리지의 용량 
3. 네임스페이스가 가질 수 있는 누적 스토리지 용량


## 스토리지 요청을 제한하기 위한 리밋레인지(LimitRange)

네임스페이스에 `리밋레인지(LimitRange)`을 추가하면 스토리지 요청 크기가 최소 및 최대값으로 설정된다.
스토리지는 퍼시스턴트 볼륨 클레임(Persistent Volume Claim)을 통해 요청하게 된다.
제한 범위를 적용하는 어드미션 컨트롤러(Admission Controller)는 관리자가 설정한 값보다 높거나 낮은 PVC를 거부한다.

이 예제에서, 10Gi의 스토리지를 요청하는 PVC는 2Gi인 최대값을 초과하기 때문에 거부된다.

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: storagelimits
spec:
  limits:
  - type: PersistentVolumeClaim
    max:
      storage: 2Gi
    min:
      storage: 1Gi
```

스토리지 요청에 대한 최솟값은 해당 스토리지의 제공자가 최소값을 특정하여 요구하는 경우 사용한다. 
예를 들어, AWS EBS 볼륨을 사용할 때는 최소 1Gi를 요청해야 한다.

## PVC 수와 누적 스토리지 용량을 제한하는 스토리지쿼터(StorageQuota)

관리자는 네임스페이스의 PVC 수와 해당 PVC의 누적 용량을 제한할 수 있다.
최대값을 초과하는 새 PVC는 거부된다.

이 예제에서 네임스페이스의 6번째 PVC는 최대 카운트 5를 초과하기 때문에 거부된다. 또한,
위의 2Gi 최대 한계(max limit)와 결합된 5Gi 최대 할당량(maximum quota)은 각각 2Gi를 갖는 3개의 PVC를 가질 수 없다.
그것은 5Gi로 한도가 정해진 네임스페이스에 대해 6Gi의 요청이 될 것이다.

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: storagequota
spec:
  hard:
    persistentvolumeclaims: "5"
    requests.storage: "5Gi"
```

<!-- discussion -->

## 요약

리밋레인지(LimitRange)을 지정하면 요청된 스토리지 양을 제한할 수 있으며 
리소스쿼터(ResourceQuota)는 네임스페이스에 클레임(claim)수와 누적 스토리지 용량을 효과적으로 제한할 수 있다.
클러스터 관리자는 어느 프로젝트도 할당량을 초과하는 위험이 없도록 클러스터의 스토리지 예산을 계획할 수 있다.