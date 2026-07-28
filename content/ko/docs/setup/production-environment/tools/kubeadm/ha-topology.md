---
# reviewers:
# - sig-cluster-lifecycle
title: 고가용성 토폴로지 선택
content_type: concept
weight: 50
---

<!-- overview -->

이 페이지는 고가용성(HA) 쿠버네티스 클러스터의 토폴로지를 구성하는 두 가지 방법을 설명한다.

다음과 같이 HA 클러스터를 구성할 수 있다.

- etcd 노드와 컨트롤 플레인 노드를 같은 위치에 두는 중첩된(stacked) 컨트롤 플레인 노드 방식
- etcd가 컨트롤 플레인과 분리된 노드에서 실행되는 외부 etcd 노드 방식

HA 클러스터를 구성하기 전에 각 토폴로지의 장단점을 신중하게 고려해야 한다.

{{< note >}}
kubeadm은 etcd 클러스터를 정적으로 부트스트랩한다. 자세한 내용은 etcd
[클러스터링 가이드](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)
를 참고한다.
{{< /note >}}

<!-- body -->

## 중첩된 etcd 토폴로지

중첩된 HA 클러스터는 etcd가 제공하는 분산 데이터 저장소 클러스터가 kubeadm으로 관리되며
컨트롤 플레인 구성 요소를 실행하는 노드로 구성된 클러스터 위에 중첩되는
[토폴로지](https://en.wikipedia.org/wiki/Network_topology)이다.

각 컨트롤 플레인 노드는 `kube-apiserver`, `kube-scheduler`, `kube-controller-manager`의 인스턴스를 하나씩 실행한다.
`kube-apiserver`는 로드 밸런서를 통해 워커 노드에 노출된다.

각 컨트롤 플레인 노드는 로컬 etcd 멤버를 생성하며 이 etcd 멤버는 오직
해당 노드의 `kube-apiserver`와만 통신한다. 로컬 `kube-controller-manager`와
`kube-scheduler` 인스턴스에도 동일하게 적용된다.

이 토폴로지는 컨트롤 플레인과 etcd 멤버를 같은 노드에 묶는다. 이는 외부 etcd 노드를 사용하는 클러스터
보다 구성하기 간단하고, 복제 관리도 더 단순하다.

그러나 중첩된 클러스터는 결합 실패의 위험이 있다. 노드 하나가 다운되면 etcd 멤버와 컨트롤
플레인 인스턴스를 모두 잃게 되어 중복성이 저하된다. 컨트롤 플레인 노드를 추가하면 이 위험을 완화할 수 있다.

그러므로 HA 클러스터에는 중첩된 컨트롤 플레인 노드를 최소 3개 실행해야 한다.

이는 kubeadm의 기본 토폴로지이다. `kubeadm init`과 `kubeadm join --control-plane`을
사용하면 컨트롤 플레인 노드에 로컬 etcd 멤버가 자동으로 생성된다.

![중첩된 etcd 토폴로지](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

## 외부 etcd 토폴로지

외부 etcd를 사용하는 HA 클러스터는 etcd가 제공하는 분산 데이터 저장소 클러스터가
컨트롤 플레인 구성 요소를 실행하는 노드로 구성된 클러스터의 외부에 있는
[토폴로지](https://en.wikipedia.org/wiki/Network_topology)이다.

중첩된 etcd 토폴로지와 마찬가지로, 외부 etcd 토폴로지의 각 컨트롤 플레인 노드도
`kube-apiserver`, `kube-scheduler`, `kube-controller-manager`의 인스턴스를 실행한다.
그리고 `kube-apiserver`는 로드 밸런서를 통해 워커 노드에 노출된다. 그러나
etcd 멤버는 별도의 호스트에서 실행되며, 각 etcd 호스트는 각 컨트롤 플레인 노드의
`kube-apiserver`와 통신한다.

이 토폴로지는 컨트롤 플레인과 etcd 멤버를 분리한다. 따라서 컨트롤 플레인 인스턴스나
etcd 멤버 하나를 잃더라도 영향이 적으며, 중첩된 HA 토폴로지만큼
클러스터 중복성에 영향을 주지 않는 HA 구성을 제공한다.

그러나 이 토폴로지는 중첩된 HA 토폴로지에 비해 두 배의 호스트 수가 필요하다.
이 토폴로지로 HA 클러스터를 구성하려면 컨트롤 플레인 노드용 호스트 3개와
etcd 노드용 호스트 3개가 최소로 필요하다.

![외부 etcd 토폴로지](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)

## {{% heading "whatsnext" %}}

- [kubeadm으로 고가용성 클러스터 구성하기](/docs/setup/production-environment/tools/kubeadm/high-availability/)
