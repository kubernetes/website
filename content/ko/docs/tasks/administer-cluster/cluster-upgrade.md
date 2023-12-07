---
title: 클러스터 업그레이드
content_type: task
---

<!-- overview -->
이 페이지는 쿠버네티스 클러스터를 업그레이드하기 위해 따라야 할 단계에 대한
개요를 제공한다.

클러스터를 업그레이드하는 방법은 초기 배포 방법에 의존적이며,
배포 이후 관련된 변경 사항에도 의존적일 수 있다.

고수준으로 살펴 본, 수행 단계

- {{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}} 업그레이드하기
- 클러스터 내부의 노드를 업그레이드하기
- {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}과 같은 클라이언트 업그레이드하기
- 새로운 쿠버네티스 버전에 동반되는 API 변화에 기반하여, 매니페스트 또는
  다른 리소스를 조정하기

## {{% heading "prerequisites" %}}

기존 클러스터가 존재해야 한다. 이 페이지는 쿠버네티스 {{< skew currentVersionAddMinor -1 >}}에서
쿠버네티스 {{< skew currentVersion >}}로 업그레이드하는 것에 관해 다룬다.
클러스터에서 쿠버네티스 {{< skew currentVersionAddMinor -1 >}}을 실행하지 않는 경우
업그레이드하려는 쿠버네티스 버전에 대한 설명서를 참고한다.

## 업그레이드 방법

### kubeadm {#upgrade-kubeadm}

클러스터가 `kubeadm` 도구를 사용하여 배포된 경우
클러스터 업그레이드 방법에 대한 자세한 내용은
[kubeadm 클러스터 업그레이드](/ko/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)를 참조한다.

클러스터를 업그레이드한 후에는
[`kubectl` 최신 버전을 설치](/ko/docs/tasks/tools/)해야 한다.

### 수동 배포

{{< caution >}}
이 단계는 네트워크 및 스토리지 플러그인과 같은
타사 확장을 고려하지 않는다.
{{< /caution >}}

다음 순서에 따라 컨트롤 플레인을 수동으로 업데이트해야 한다.

- etcd (모든 인스턴스)
- kube-apiserver (모든 컨트롤 플레인 호스트)
- kube-controller-manager
- kube-scheduler
- cloud controller manager (사용하는 경우)

이 때 [`kubectl` 최신 버전을 설치](/ko/docs/tasks/tools/)
해야 한다.

클러스터의 각 노드에 대해 해당 노드를 [드레인(drain)](/docs/tasks/administer-cluster/safely-drain-node/)
한 다음 {{< skew currentVersion >}} kubelet을 사용하는 새 노드로 바꾸거나
해당 노드의 kubelet을 업그레이드하고 노드를 다시 가동한다.

### 다른 방식의 배포 {#upgrade-other}

사용한 클러스터 배포 도구에 따라 해당 배포 도구가
제공하는 문서를 통하여, 유지 관리를 위해 권장되는 설정 단계를 확인한다.

## 업그레이드 후 작업

### 클러스터의 스토리지 API 버전 전환

클러스터에서 활성화된 쿠버네티스 리소스를
클러스터 내부적으로 표현(representation)하기 위해서 etcd로 직렬화된 객체는
특정 버전의 API를 사용하여 작성된다.

지원되는 API가 변경되면 이러한 개체를 새 API에서 다시 작성해야 할 수 있다.
이렇게 하지 않으면 결국 더 이상 디코딩할 수 없거나
쿠버네티스 API 서버에서 사용할 수 없는 리소스가 된다.

영향을 받는 각 객체를 지원되는 최신 API를 사용하여
가져온(fetch) 다음, 해당 API를 사용하여 다시 쓴다.

### 매니페스트 업그레이드

새로운 쿠버네티스 버전으로 업그레이드하면 새로운 API를 제공할 수 있다.

`kubectl convert` 명령을 사용하여 서로 다른 API 버전 간에 매니페스트를 변환할 수 있다.
예시:

```shell
kubectl convert -f pod.yaml --output-version v1
```

`kubectl` 도구는 `pod.yaml`의 내용을 `kind`를 파드(변경되지 않음, unchanged)로 설정하는 매니페스트로 대체하고,
수정된 `apiVersion`으로 대체한다.

### 장치 플러그인

클러스터가 장치 플러그인을 실행 중이고 노드를 최신 장치 플러그인 API 버전이 있는
쿠버네티스 릴리스로 업그레이드해야 하는 경우,
업그레이드 중에 장치 할당이 계속 성공적으로 완료되도록 하려면
장치 플러그인을 업그레이드해야 한다.

[API 호환성](docs/concepts/extend-kubernetes/compute-storage-net/device-plugins.md/#api-compatibility) 및 [Kubelet 장치 매니저 API 버전](docs/reference/node/device-plugin-api-versions.md)을 참조한다.
