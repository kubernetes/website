---
title: 리스(Lease)
content_type: concept
weight: 30
---

<!-- overview -->

분산 시스템에는 종종 공유 리소스를 잠그고 노드 간의 활동을 조정하는 메커니즘을 제공하는 "리스(Lease)"가 필요하다.
쿠버네티스에서 "리스" 개념은 `coordination.k8s.io` API 그룹에 있는 `Lease` 오브젝트로 표현되며,
노드 하트비트 및 컴포넌트 수준의 리더 선출과 같은 시스템 핵심 기능에서 사용된다.

<!-- body -->

## 노드 하트비트

쿠버네티스는 리스 API를 사용하여 kubelet 노드의 하트비트를 쿠버네티스 API 서버에 전달한다.
모든 `노드`에는 같은 이름을 가진 `Lease` 오브젝트가 `kube-node-lease` 네임스페이스에 존재한다.
내부적으로, 모든 kubelet 하트비트는 이 `Lease` 오브젝트에 대한 업데이트 요청이며,
이 업데이트 요청은 `spec.renewTime` 필드를 업데이트한다.
쿠버네티스 컨트롤 플레인은 이 필드의 타임스탬프를 사용하여 해당 `노드`의 가용성을 확인한다.

자세한 내용은 [노드 리스 오브젝트](/ko/docs/concepts/architecture/nodes/#heartbeats)를 참조한다.

## 리더 선출

리스는 쿠버네티스에서도 특정 시간 동안 컴포넌트의 인스턴스 하나만 실행되도록 보장하는 데에도 사용된다.
이는 구성 요소의 한 인스턴스만 활성 상태로 실행되고 다른 인스턴스는 대기 상태여야 하는
`kube-controller-manager` 및 `kube-scheduler`와 같은 컨트롤 플레인 컴포넌트의
고가용성 설정에서 사용된다.

## API 서버 신원

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

쿠버네티스 v1.26부터, 각 `kube-apiserver`는 리스 API를 사용하여 시스템의 나머지 부분에 자신의 신원을 게시한다.
그 자체로는 특별히 유용하지는 않지만, 이것은 클라이언트가 쿠버네티스 컨트롤 플레인을 운영 중인 `kube-apiserver` 인스턴스 수를 
파악할 수 있는 메커니즘을 제공한다.
kube-apiserver 리스의 존재는 향후 각 kube-apiserver 간의 조정이 필요할 때
기능을 제공해 줄 수 있다.

각 kube-apiserver가 소유한 리스는 `kube-system` 네임스페이스에서`kube-apiserver-<sha256-hash>`라는 이름의
리스 오브젝트를 확인하여 볼 수 있다. 또는 `k8s.io/component=kube-apiserver` 레이블 설렉터를 사용하여 볼 수도 있다.

```shell
$ kubectl -n kube-system get lease -l k8s.io/component=kube-apiserver
NAME                                        HOLDER                                                                           AGE
kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a   kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a_9cbf54e5-1136-44bd-8f9a-1dcd15c346b4   5m33s
kube-apiserver-dz2dqprdpsgnm756t5rnov7yka   kube-apiserver-dz2dqprdpsgnm756t5rnov7yka_84f2a85d-37c1-4b14-b6b9-603e62e4896f   4m23s
kube-apiserver-fyloo45sdenffw2ugwaz3likua   kube-apiserver-fyloo45sdenffw2ugwaz3likua_c5ffa286-8a9a-45d4-91e7-61118ed58d2e   4m43s
```

리스 이름에 사용된 SHA256 해시는 kube-apiserver가 보는 OS 호스트 이름을 기반으로 한다.
각 kube-apiserver는 클러스터 내에서 고유한 호스트 이름을 사용하도록 구성해야 한다.
동일한 호스트명을 사용하는 새로운 kube-apiserver 인스턴스는 새 리스 오브젝트를 인스턴스화하는 대신 새로운 소유자 ID를 사용하여 기존 리스를 차지할 수 있다.
kube-apiserver가 사용하는 호스트네임은 `kubernetes.io/hostname` 레이블의 값을 확인하여 확인할 수 있다.

```shell
$ kubectl -n kube-system get lease kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a -o yaml
```

```yaml
apiVersion: coordination.k8s.io/v1
kind: Lease
metadata:
  creationTimestamp: "2022-11-30T15:37:15Z"
  labels:
    k8s.io/component: kube-apiserver
    kubernetes.io/hostname: kind-control-plane
  name: kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a
  namespace: kube-system
  resourceVersion: "18171"
  uid: d6c68901-4ec5-4385-b1ef-2d783738da6c
spec:
  holderIdentity: kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a_9cbf54e5-1136-44bd-8f9a-1dcd15c346b4
  leaseDurationSeconds: 3600
  renewTime: "2022-11-30T18:04:27.912073Z"
```

더 이상 존재하지 않는 kube-apiserver의 만료된 임대는 1시간 후에 새로운 kube-apiserver에 의해 가비지 컬렉션된다.
