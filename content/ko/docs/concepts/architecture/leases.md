---
title: 리스(Lease)
content_type: concept
weight: 30
---

<!-- overview -->

분산 시스템에는 공유 리소스를 잠그고 세트 구성원 간의 활동을 조정하는
메커니즘을 제공하는 *리스(Lease)*가 필요한 경우가 종종 있다.
쿠버네티스에서 [리스](/docs/reference/kubernetes-api/cluster-resources/lease-v1/) 개념은
`coordination.k8s.io` {{< glossary_tooltip text="API 그룹" term_id="api-group" >}}에 있는 `Lease` 오브젝트로 표현되며,
노드 하트비트 및 컴포넌트 수준의 리더 선출과 같은 시스템 핵심 기능에서 사용된다.

<!-- body -->

## 노드 하트비트 {#node-heart-beats}

쿠버네티스는 리스 API를 사용하여 kubelet 노드의 하트비트를 쿠버네티스 API 서버에 전달한다.
모든 `Node`에는 같은 이름을 가진 `Lease` 오브젝트가 `kube-node-lease` 네임스페이스에 존재한다.
내부적으로, 모든 kubelet 하트비트는 이 `Lease` 오브젝트에 대한 업데이트 요청이며,
이 **update** 요청은 `spec.renewTime` 필드를 업데이트한다.
쿠버네티스 컨트롤 플레인은 이 필드의 타임스탬프를 사용하여 해당 `Node`의 가용성을 확인한다.

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
kubectl -n kube-system get lease -l k8s.io/component=kube-apiserver
```
```
NAME                                        HOLDER                                                                           AGE
kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a   kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a_9cbf54e5-1136-44bd-8f9a-1dcd15c346b4   5m33s
kube-apiserver-dz2dqprdpsgnm756t5rnov7yka   kube-apiserver-dz2dqprdpsgnm756t5rnov7yka_84f2a85d-37c1-4b14-b6b9-603e62e4896f   4m23s
kube-apiserver-fyloo45sdenffw2ugwaz3likua   kube-apiserver-fyloo45sdenffw2ugwaz3likua_c5ffa286-8a9a-45d4-91e7-61118ed58d2e   4m43s
```

리스 이름에 사용된 SHA256 해시는 API 서버가 보는 OS 호스트 이름을 기반으로 한다.
각 kube-apiserver는 클러스터 내에서 고유한 호스트 이름을 사용하도록 구성해야 한다.
동일한 호스트명을 사용하는 새로운 kube-apiserver 인스턴스는 새 리스 오브젝트를 인스턴스화하는 대신 새로운 소유자 ID를 사용하여 기존 리스를 차지할 수 있다.
kube-apiserver가 사용하는 호스트네임은 `kubernetes.io/hostname` 레이블의 값을 확인하여 확인할 수 있다.

```shell
kubectl -n kube-system get lease kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a -o yaml
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

`APIServerIdentity` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 사용하지 않도록 설정하여
API 서버 신원 리스를 사용하지 않도록 설정할 수 있다.

## 워크로드 {#custom-workload}

사용자 자체 워크로드가 자체 리스 사용을 정의할 수 있다.
예를 들어, 주요 또는 리더 멤버가 동료가 수행하지 않는 작업을 수행하는
사용자 정의 {{< glossary_tooltip term_id="controller" text="컨트롤러" >}}를 실행할 수 있다.
컨트롤러 복제본이 리더를 선택하거나 선출할 수 있도록 리스를 정의하고,
쿠버네티스 API를 사용하여 조정한다.
리스를 사용한다면, 리스의 이름을 제품 또는 구성 요소와 명확하게 연결되는 이름으로 정의하는 것이 좋다.
예를 들어, Example foo라는 구성 요소가 있다면, `example-foo`라는 리스 이름을 사용한다.

클러스터 운영자나 다른 최종 사용자가 구성 요소의 여러 인스턴스를 배포할 수 있는 경우,
이름 접두사를 선택하고
메커니즘(예: 디플로이먼트 이름의 해시)을 선택하여 리스에 대한 이름 충돌을 방지한다.

서로 다른 소프트웨어 제품들이 서로 충돌하지 않는다는 동일한 결과를 달성한다면,
다른 접근 방식을 사용할 수 있다.