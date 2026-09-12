---
title: 리스(Lease)
api_metadata:
- apiVersion: "coordination.k8s.io/v1"
  kind: "Lease"
content_type: concept
weight: 30
---

<!-- overview -->

분산 시스템에는 종종 공유 리소스를 잠그는 메커니즘을 제공하는 _리스(Lease)_가 필요하며,
리스는 집합 구성원 간의 활동을 조정한다.
쿠버네티스에서 리스 개념은 [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/)
오브젝트로 표현되며, 이 오브젝트는 `coordination.k8s.io` {{< glossary_tooltip text="API 그룹" term_id="api-group" >}}에 속하고,
노드 하트비트 및 컴포넌트 수준의 리더 선출과 같은 시스템 핵심 기능에 사용된다.

<!-- body -->

## 노드 하트비트 {#node-heart-beats}

쿠버네티스는 리스 API를 사용하여 kubelet 노드 하트비트를 쿠버네티스 API 서버에 전달한다.
각 `Node`마다 이름이 같은 `Lease` 오브젝트가 `kube-node-lease`
네임스페이스에 존재한다. 내부적으로 각 kubelet 하트비트는 이 `Lease` 오브젝트에 대한 **업데이트** 요청이며,
리스의 `spec.renewTime` 필드를 업데이트한다. 쿠버네티스 컨트롤 플레인은 이 필드의 타임스탬프를
사용하여 해당 `Node`의 가용성을 확인한다.

자세한 내용은 [노드 리스 오브젝트](/docs/concepts/architecture/nodes/#node-heartbeats)를 참고한다.

## 리더 선출

쿠버네티스는 특정 시점에 컴포넌트의 인스턴스 하나만 실행되도록 보장하는 데에도 리스를 사용한다.
이는 컴포넌트의 한 인스턴스만 활성 상태로 실행되고 다른 인스턴스는 대기 상태여야 하는
고가용성 구성에서 `kube-controller-manager` 및 `kube-scheduler`와 같은 컨트롤 플레인
컴포넌트에 사용된다.

[조정된 리더 선출](/docs/concepts/cluster-administration/coordinated-leader-election)을 참고하여,
쿠버네티스가 리스 API를 기반으로 어떤 컴포넌트 인스턴스를
리더로 선택하는지 알아본다.

### 종료 시 kube-controller-manager 잠금 해제

{{< feature-state feature_gate_name="ControllerManagerReleaseLeaderElectionLockOnExit" >}}

`ControllerManagerReleaseLeaderElectionLockOnExit` 기능 게이트가 활성화되면,
`kube-controller-manager`는 잠금의 TTL이 만료될 때까지 기다리는 대신
리더 전환 중 리더 선출 잠금을 능동적으로 해제한다. 이를 통해 새로운 리더를
더 빠르게 선출할 수 있어 리더 전환 지연 시간이 줄어든다.

## API 서버 신원

{{< feature-state feature_gate_name="APIServerIdentity" >}}

쿠버네티스 v1.26부터 각 `kube-apiserver`는 리스 API를 사용하여 시스템의
나머지 부분에 자신의 신원을 게시한다. 그 자체로는 특별히 유용하지 않지만, 이를 통해 클라이언트는
쿠버네티스 컨트롤 플레인을 운영 중인 `kube-apiserver` 인스턴스 수를 파악할 수 있다.
kube-apiserver 리스가 존재하면 향후 각 kube-apiserver 간의 조정이 필요한
기능을 사용할 수 있다.

각 kube-apiserver가 소유한 리스는 `kube-system` 네임스페이스에서
이름이 `apiserver-<sha256-hash>`인 리스 오브젝트를 찾아 확인할 수 있다. 또는 `apiserver.kubernetes.io/identity=kube-apiserver` 레이블 셀렉터를 사용할 수 있다.

```shell
kubectl -n kube-system get lease -l apiserver.kubernetes.io/identity=kube-apiserver
```
```
NAME                                        HOLDER                                                                           AGE
apiserver-07a5ea9b9b072c4a5f3d1c3702        apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05        5m33s
apiserver-7be9e061c59d368b3ddaf1376e        apiserver-7be9e061c59d368b3ddaf1376e_84f2a85d-37c1-4b14-b6b9-603e62e4896f        4m23s
apiserver-1dfef752bcb36637d2763d1868        apiserver-1dfef752bcb36637d2763d1868_c5ffa286-8a9a-45d4-91e7-61118ed58d2e        4m43s

```

리스 이름에 사용된 SHA256 해시는 해당 API 서버에서 확인되는 OS 호스트네임을 기반으로 한다. 각 kube-apiserver는
클러스터 내에서 고유한 호스트네임을 사용하도록 구성해야 한다. 동일한 호스트네임을 사용하는 새 kube-apiserver 인스턴스는
새 리스 오브젝트를 생성하는 대신 새로운 홀더 신원(holder identity)을 사용하여 기존 리스를 인계받는다. kube-apiserver가
사용하는 호스트네임은 `kubernetes.io/hostname` 레이블의 값을 확인하여 알 수 있다.

```shell
kubectl -n kube-system get lease apiserver-07a5ea9b9b072c4a5f3d1c3702 -o yaml
```
```yaml
apiVersion: coordination.k8s.io/v1
kind: Lease
metadata:
  creationTimestamp: "2023-07-02T13:16:48Z"
  labels:
    apiserver.kubernetes.io/identity: kube-apiserver
    kubernetes.io/hostname: master-1
  name: apiserver-07a5ea9b9b072c4a5f3d1c3702
  namespace: kube-system
  resourceVersion: "334899"
  uid: 90870ab5-1ba9-4523-b215-e4d4e662acb1
spec:
  holderIdentity: apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05
  leaseDurationSeconds: 3600
  renewTime: "2023-07-04T21:58:48.065888Z"
```

더 이상 존재하지 않는 kube-apiserver의 만료된 리스는 1시간 후 새 kube-apiserver에 의해 가비지 컬렉션된다.

`APIServerIdentity` [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)를
비활성화하여 API 서버 신원 리스를 비활성화할 수 있다.

## 워크로드 {#custom-workload}

사용자 워크로드에서 리스를 사용하는 방식을 직접 정의할 수 있다. 예를 들어 주(primary) 또는 리더 구성원이
피어가 수행하지 않는 작업을 수행하는 사용자 정의 {{< glossary_tooltip term_id="controller" text="컨트롤러" >}}를 실행할 수 있다.
컨트롤러 레플리카가 쿠버네티스 API를 조정에 사용하여 리더를 선택하거나
선출할 수 있도록 리스를 정의한다.
리스를 사용하는 경우 리스의 이름을 해당 제품 또는 컴포넌트와 명확하게 연결되도록
정의하는 것이 좋다. 예를 들어 Example Foo라는 컴포넌트가 있다면
리스 이름으로 `example-foo`를 사용한다.

클러스터 운영자 또는 다른 최종 사용자가 컴포넌트의 여러 인스턴스를 배포할 수 있다면 이름
접두사를 선택하고 (디플로이먼트 이름의 해시와 같은) 메커니즘을 선택하여 리스의
이름 충돌을 방지한다.

서로 다른 소프트웨어 제품이 충돌하지 않는다는 동일한 결과를 얻는다면 다른 방법을
사용해도 된다.
