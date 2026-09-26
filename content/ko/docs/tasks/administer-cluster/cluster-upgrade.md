---
title: 클러스터 업그레이드
content_type: task
weight: 350
---

<!-- overview -->
이 페이지는 쿠버네티스 클러스터를 업그레이드하기 위해 따라야 할 단계에 대한
개요를 제공한다.

쿠버네티스 프로젝트는 최신 패치 릴리스로 신속하게 업그레이드하고,
지원되는 쿠버네티스 마이너 릴리스를 사용하고 있는지 확인할 것을 권고한다.
이 권고를 따르면 보안을 유지하는 데 도움이 된다.

클러스터를 업그레이드하는 방법은 클러스터 초기 배포 방식과
이후의 변경 사항에 따라 달라진다.

개략적인 수행 단계는 다음과 같다.

- {{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}} 업그레이드
- 클러스터의 노드 업그레이드
- {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}과 같은 클라이언트 업그레이드
- 새로운 쿠버네티스 버전에 수반되는 API 변경 사항을 기반으로 매니페스트 및
  기타 리소스 조정

## {{% heading "prerequisites" %}}

기존 클러스터가 존재해야 한다. 이 페이지는 쿠버네티스 {{< skew currentVersionAddMinor -1 >}}에서
쿠버네티스 {{< skew currentVersion >}}로 업그레이드하는 방법에 관한 것이다.
클러스터가 현재 쿠버네티스 {{< skew currentVersionAddMinor -1 >}}을 실행하고 있지 않다면,
업그레이드하려는 쿠버네티스 버전의 문서를 확인한다.

{{< note >}}
리눅스 노드에서 kubelet은 기본적으로 cgroups v2만 지원한다.
쿠버네티스 {{< skew currentVersion >}}에서는 `FailCgroupV1` kubelet 구성 옵션이 기본적으로 `true`로 설정된다.

자세한 내용은 [쿠버네티스 cgroup v1 사용 중단 문서](/docs/concepts/architecture/cgroups/#deprecation-of-cgroup-v1)를 참조한다.
{{</ note >}}

## 업그레이드 방법

### kubeadm {#upgrade-kubeadm}

클러스터가 `kubeadm` 도구를 사용하여 배포된 경우
클러스터를 업그레이드하는 방법에 대한 자세한 정보는
[kubeadm 클러스터 업그레이드](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)를 참조한다.

클러스터를 업그레이드한 후에는
[`kubectl` 최신 버전 설치](/docs/tasks/tools/)를 잊지 않는다.

### 수동 배포

{{< caution >}}
이 단계는 네트워크 및 스토리지 플러그인과 같은 서드파티 확장을
고려하지 않는다.
{{< /caution >}}

다음 순서에 따라 컨트롤 플레인을 수동으로 업데이트해야 한다.

- etcd(모든 인스턴스)
- kube-apiserver(모든 컨트롤 플레인 호스트)
- kube-controller-manager
- kube-scheduler
- 사용하는 경우, cloud controller manager

이 시점에서 
[`kubectl` 최신 버전 설치](/docs/tasks/tools/)를 해야 한다.

클러스터의 각 노드에 대해 해당 노드를 [드레인](/docs/tasks/administer-cluster/safely-drain-node/)한 다음
{{< skew currentVersion >}} kubelet을 사용하는 새 노드로 교체하거나
해당 노드의 kubelet을 업그레이드하고 노드를 다시 서비스 상태로 되돌린다.

{{< caution >}}
kubelet을 업그레이드하기 전에 노드를 드레인하면 파드가 다시 승인되고 컨테이너가
다시 생성되는 것을 보장하며, 이는 일부 보안 문제나 기타 중요한 버그를 해결하는 데 필요할 수 있다.
{{</ caution >}}

### 기타 배포 {#upgrade-other}

유지 관리를 위한 권장 설정 단계를 알아보려면 클러스터 배포 도구의
문서를 참조한다.

## 업그레이드 후 작업

### 클러스터의 스토리지 API 버전 전환

클러스터에서 활성화된 쿠버네티스 리소스의 클러스터 내부
표현을 위해 etcd로 직렬화되는 오브젝트는
특정 버전의 API를 사용하여 작성된다.

지원되는 API가 변경되면 이러한 오브젝트는 최신 API로
다시 작성해야 할 수 있다. 이렇게 하지 않으면 결국 쿠버네티스 API 서버에서
더 이상 디코딩하거나 사용할 수 없는 리소스가 발생한다.

영향을 받는 각 오브젝트에 대해 지원되는 최신 API를 사용하여 가져온 다음,
지원되는 최신 API를 사용하여 다시 작성한다.

### 매니페스트 업그레이드

새로운 쿠버네티스 버전으로 업그레이드하면 새로운 API를 제공할 수 있다.

`kubectl convert` 명령을 사용하여 서로 다른 API 버전 간에 매니페스트를 변환할 수 있다.
예시:

```shell
kubectl convert -f pod.yaml --output-version v1
```

`kubectl` 도구는 `pod.yaml`의 내용을, `kind`는 Pod로 설정하고(변경되지 않음)
`apiVersion`을 수정한 매니페스트로 교체한다.

### 장치 플러그인

클러스터에서 장치 플러그인을 실행 중이고 노드를 최신 장치 플러그인 API 버전이 있는
쿠버네티스 릴리스로 업그레이드해야 한다면, 업그레이드 중에도 장치 할당이 계속 성공적으로
완료되도록 보장하기 위해, 노드를 업그레이드하기 전에 장치 플러그인을
두 버전을 모두 지원하도록 업그레이드해야 한다.

자세한 내용은 [API 호환성](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#api-호환성) 및 [Kubelet 장치 매니저 API 버전](/docs/reference/node/device-plugin-api-versions/)을 참조한다.