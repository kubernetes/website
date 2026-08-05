---
# reviewers:
# - sig-cluster-lifecycle
title: 고가용성 토폴로지 선택
content_type: concept
weight: 50
---

<!-- overview -->

이 페이지는 고가용성(HA) 쿠버네티스 클러스터의 토폴로지를 구성하는 두 가지 선택 사항을 설명한다.

다음과 같이 HA 클러스터를 구성할 수 있다.

- etcd 노드와 컨트롤 플레인 노드를 함께 배치하는 중첩된(stacked) 컨트롤 플레인 노드 방식
- etcd와 컨트롤 플레인이 분리된 노드에서 운영되는 외부 etcd 노드 방식

HA 클러스터를 구성하기 전에 각 토폴로지의 장단점을 주의 깊게 고려해야 한다.

{{< note >}}
kubeadm은 etcd 클러스터를 정적으로 부트스트랩한다. 자세한 내용은 etcd
[클러스터 구성 가이드](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)
를 읽는다.
{{< /note >}}

<!-- body -->

## 중첩된 etcd 토폴로지

중첩된 HA 클러스터는 etcd에서 제공하는 분산 데이터 저장소 클러스터를,
컨트롤 플레인 구성 요소를 실행하는 kubeadm으로 관리되는 노드에 의해서 형성된 클러스터 상단에
중첩하는 [토폴로지](https://en.wikipedia.org/wiki/Network_topology)이다.

각 컨트롤 플레인 노드는 `kube-apiserver`, `kube-scheduler`, `kube-controller-manager` 인스턴스를 운영한다.
`kube-apiserver`는 로드 밸런서를 이용하여 워커 노드에 노출되어 있다.

각 컨트롤 플레인 노드는 로컬 etcd 멤버를 생성하고
이 etcd 멤버는 오직 해당 노드의 `kube-apiserver`와 통신한다.
같은 방식이 로컬 `kube-controller-manager`와 `kube-scheduler` 인스턴스에도 적용된다.

이 토폴로지는 컨트롤 플레인과 etcd 멤버가 같은 노드에 묶여 있다.
이는 외부 etcd 노드의 클러스터를 구성하는 것보다는 단순하며 복제 관리도 간단하다.

그러나 중첩된 클러스터는 결합이 실패할 위험이 있다. 한 노드가 다운되면 etcd 멤버와 컨트롤 플레인을 모두 잃어버리고,
중복성도 손상된다. 더 많은 컨트롤 플레인 노드를 추가하여 이 위험을 완화할 수 있다.

그러므로 HA 클러스터를 위해 최소 3개인 중첩된 컨트롤 플레인 노드를 운영해야 한다.

이는 kubeadm의 기본 토폴로지이다. 로컬 etcd 멤버는
`kubeadm init`와 `kubeadm join --control-plane` 을 이용할 때에 컨트롤 플레인 노드에 자동으로 생성된다.

![중첩된 etcd 토폴로지](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

## 외부 etcd 토폴로지

외부 etcd를 이용하는 HA 클러스터는 etcd로 제공한 분산된 데이터 스토리지 클러스터가
컨트롤 플레인 구성 요소를 운영하는 노드로 형성하는 클러스터의 외부에 있는
[토폴로지](https://en.wikipedia.org/wiki/Network_topology)이다.

중첩된 etcd 토폴로지와 같이, 외부 etcd 토폴로지에서 각 컨트롤 플레인 노드는
`kube-apiserver`, `kube-scheduler`, `kube-controller-manager`의 인스턴스를 운영한다.
그리고 `kube-apiserver`는 로드 밸런서를 이용하여 워커 노드에 노출한다. 그러나,
etcd 멤버는 분리된 호스트에서 운영되고, 각 etcd 호스트는 각 컨트롤 플레인 노드의
`kube-apiserver`와 통신한다.

이 토폴로지는 컨트롤 플레인과 etcd 멤버를 분리한다. 따라서 
컨트롤 플레인 인스턴스 또는 etcd 멤버 하나를 잃더라도 영향이 더 적고,
중첩된 HA 토폴로지만큼 클러스터 중복성에 영향을 미치지 않는 HA 구성을 제공한다.

그러나, 이 토폴로지는 중첩된 HA 토폴로지보다 두 배 많은 호스트 수를 필요로 한다. 
이 토폴로지로 HA 클러스터를 구성하려면 컨트롤 플레인 노드용 호스트 3대와 etcd 노드용 호스트 3대가 
최소로 필요하다.

![외부 etcd 토폴로지](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)

## {{% heading "whatsnext" %}}

- [kubeadm을 이용하여 고가용성 클러스터 구성하기](/docs/setup/production-environment/tools/kubeadm/high-availability/)
