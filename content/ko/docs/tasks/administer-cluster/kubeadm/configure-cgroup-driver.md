---
title: cgroup 드라이버 설정
content_type: task
weight: 20
---

<!-- overview -->

이 페이지에서는 kubeadm으로 생성한 클러스터에 대해 kubelet의 cgroup 드라이버를
컨테이너 런타임 cgroup 드라이버와 일치하도록 구성하는 방법을 설명한다.

## {{% heading "prerequisites" %}}

쿠버네티스 [컨테이너 런타임 요구사항](/ko/docs/setup/production-environment/container-runtimes)을
숙지하고 있어야 한다.

<!-- steps -->

## 컨테이너 런타임 cgroup 드라이버 구성

[컨테이너 런타임](/ko//docs/setup/production-environment/container-runtimes) 페이지에서는,
kubeadm 기반 설치의 경우 kubeadm이 kubelet을 `systemd` 서비스 형태로 관리하기 때문에
kubelet의 [기본](/docs/reference/config-api/kubelet-config.v1beta1) `cgroupfs` 드라이버 대신에
systemd 드라이버를 사용하는 것이 좋다고 설명는데, 이는 kubeadm이
[systemd 서비스](/docs/setup/production-environment/tools/kubeadm/kubelet-integration)로 kubelet을 관리하기 때문이다.

이 페이지에서는 `systemd` 드라이버를 기본으로 사용하여 다양한 컨테이너 런타임을 설정하는 방법에 대한
자세한 내용도 제공한다.

## kubelet cgroup 드라이버 구성

`kubeadm init`을 실행할 때 kubeadm에 `KubeletConfiguration` 구조를 전달할 수 있다.
이 `KubeletConfiguration`은 kubelet의 cgroup 드라이버를 제어하는 `cgroupDriver`
필드를 포함할 수 있다.

{{< note >}}
v1.22 및 이후 버전에서는 사용자가 `KubeletConfiguration`의 `cgroupDriver` 필드를 설정하지 않은 경우
kubeadm은 기본으로 `systemd`를 사용한다.
{{< /note >}}

다음은 필드를 명시적으로 구성하는 최소한의 예시이다.

```yaml
# kubeadm-config.yaml
kind: ClusterConfiguration
apiVersion: kubeadm.k8s.io/v1beta3
kubernetesVersion: v1.21.0
---
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
cgroupDriver: systemd
```

위와 같은 구성 파일을 kubeadm 명령에 전달할 수 있다.

```shell
kubeadm init --config kubeadm-config.yaml
```

{{< note >}}
kubeadm은 클러스터의 모든 노드에 대해 동일한 `KubeletConfiguration`을 사용한다.
`KubeletConfiguration`은 `kube-system` 네임스페이스에 속하는 [컨피그맵](/ko/docs/concepts/configuration/configmap)
오브젝트에 저장된다.

하위 명령인 `init`, `join`, `upgrade`를 실행하면 kubeadm이
`KubeletConfiguration`을 `/var/lib/kubelet/config.yaml` 파일로
작성하여 로컬 노드 kubelet에 전달한다.
{{< /note >}}

## `cgroupfs` 드라이버 사용

`cgroupfs`를 사용하고 `kubeadm upgrade`가 기존 설정의
`KubeletConfiguration` cgroup 드라이버를 수정하는 것을 방지하려면, 해당
값을 명시적으로 표시해야 한다. 이는 향후 버전의 kubeadm이 기본적으로
`systemd` 드라이버를 적용하는 것을 원하지 않는 경우에 해당된다.

값을 명시하는 방법에 대한 자세한 내용은 아래 "[kubelet 컨피그맵 수정](#kubelet-컨피그맵-수정)"
섹션을 참조한다.

컨테이너 런타임이 `cgroupfs` 드라이버를 사용하도록 구성하려면
선택한 컨테이너 런타임의 설명서를 참조해야 한다.

## `systemd` 드라이버로 마이그레이션

기존 kubeadm 클러스터의 cgroup 드라이버를 `cgroupfs`에서 `systemd`로 변경하려면,
kubelet 업그레이드와 유사한 절차가 필요하다. 이러한 절차는 아래에
설명된 두 단계를 모두 포함해야 한다.

{{< note >}}
또는 클러스터의 기존 노드에서 `systemd` 드라이버를 사용하는 새 노드로
교체할 수도 있다. 이를 위해서 새 노드를 조인(join)시키기 전에 아래의 첫 번째
단계만 실행하고 이전 노드를 삭제하기 전에 워크로드가 새 노드로
안전하게 이동할 수 있는지 확인해야 한다.
{{< /note >}}

### kubelet 컨피그맵 수정

- `kubectl edit cm kubelet-config -n kube-system`를 실행한다.
- 기존 `cgroupDriver` 값을 수정하거나 다음과 같은 새 필드를 추가한다.

  ```yaml
  cgroupDriver: systemd
  ```
  이 필드는 컨피그맵의 `kubelet:` 섹션 아래에 있어야 한다.

### 모든 노드에서 cgroup 드라이버 업데이트

클러스터의 각 노드에 대해

- `kubectl drain <node-name> --ignore-daemonsets`을 사용하여 [노드 드레인(drain)](/docs/tasks/administer-cluster/safely-drain-node)
- `systemctl stop kubelet`을 사용하여 kubelet 중지
- 컨테이너 런타임 중지
- 컨테이너 런타임 cgroup 드라이버를 `systemd`로 수정
- `/var/lib/kubelet/config.yaml`에서 `cgroupDriver: systemd`로 설정
- 컨테이너 런타임 시작
- `systemctl start kubelet`을 사용하여 kubelet 시작
- `kubectl uncordon <node-name>`를 사용하여 [노드 통제 해제(Uncordon)](/docs/tasks/administer-cluster/safely-drain-node)

이 단계를 노드에서 한 번에 하나씩 실행하여 워크로드가 다른 노드에
스케줄링할 충분한 시간을 확보할 수 있도록 한다.

위의 과정이 완료되면 모든 노드와 워크로드가 정상인지 확인한다.
