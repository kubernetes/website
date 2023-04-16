---
title: Linux 노드 업그레이드
content_type: task
weight: 100
---

<!-- overview -->

- 이 페이지에서는 kubeadm으로 생성된 Linux 작업자 노드를 업그레이드하는 방법을 설명합니다.

## {{% heading "prerequisites" %}}
 
{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* 에 익숙해지세요 [나머지 kubeadm을 업그레이드하는 프로세스
무리](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). 당신은 원할 것입니다
Linux 작업자 노드를 업그레이드하기 전에 컨트롤 플레인 노드를 업그레이드하십시오.

<!-- steps -->

## Upgrading worker nodes

### Upgrade kubeadm

- kubeadm 업그레이드:

  {{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
  {{% tab name="Ubuntu, Debian or HypriotOS" %}}
  ```shell
  # replace x in {{< skew currentVersion >}}.x-00 with the latest patch version
  apt-mark unhold kubeadm && \
  apt-get update && apt-get install -y kubeadm={{< skew currentVersion >}}.x-00 && \
  apt-mark hold kubeadm
  ```
  {{% /tab %}}
  {{% tab name="CentOS, RHEL or Fedora" %}}
  ```shell
  # replace x in {{< skew currentVersion >}}.x-0 with the latest patch version
  yum install -y kubeadm-{{< skew currentVersion >}}.x-0 --disableexcludes=kubernetes
  ```
  {{% /tab %}}
  {{< /tabs >}}

### Call "kubeadm upgrade"

- 작업자 노드의 경우 로컬 kubelet 구성을 업그레이드합니다.:

  ```shell
  sudo kubeadm upgrade node
  ```

### Drain the node

- 예약 불가로 표시하고 워크로드를 제거하여 유지 관리를 위해 노드를 준비합니다.:

  ```shell
  # replace <node-to-drain> with the name of your node you are draining
  kubectl drain <node-to-drain> --ignore-daemonsets
  ```

### Upgrade kubelet and kubectl

- kubelet 및 kubectl 업그레이드:

  {{< tabs name="k8s_kubelet_and_kubectl" >}}
  {{% tab name="Ubuntu, Debian or HypriotOS" %}}
  ```shell
  # replace x in {{< skew currentVersion >}}.x-00 with the latest patch version
  apt-mark unhold kubelet kubectl && \
  apt-get update && apt-get install -y kubelet={{< skew currentVersion >}}.x-00 kubectl={{< skew currentVersion >}}.x-00 && \
  apt-mark hold kubelet kubectl
  ```
  {{% /tab %}}
  {{% tab name="CentOS, RHEL or Fedora" %}}
  ```shell
  # replace x in {{< skew currentVersion >}}.x-0 with the latest patch version
  yum install -y kubelet-{{< skew currentVersion >}}.x-0 kubectl-{{< skew currentVersion >}}.x-0 --disableexcludes=kubernetes
  ```
  {{% /tab %}}
  {{< /tabs >}}
  <br />

- kubelet 재시작:

  ```shell
  sudo systemctl daemon-reload
  sudo systemctl restart kubelet
  ```

### Uncordon the node

- 예약 가능으로 표시하여 노드를 다시 온라인 상태로 전환:

  ```shell
  # replace <node-to-uncordon> with the name of your node
  kubectl uncordon <node-to-uncordon>
  ```

 ## {{% heading "whatsnext" %}}

* 방법 보기 [Windows 노드 업그레이드](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
