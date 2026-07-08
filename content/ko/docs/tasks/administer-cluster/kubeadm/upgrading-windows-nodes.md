---
title: 윈도우 노드 업그레이드
min-kubernetes-server-version: 1.17
content_type: task
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

이 페이지는 [kubeadm으로 생성된](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) 윈도우 노드를 업그레이드하는 방법을 설명한다.




## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* [남은 kubeadm 클러스터를 업그레이드하는 프로세스](/ko/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)에
익숙해져야 한다. 윈도우 노드를
업그레이드하기 전에 컨트롤 플레인 노드를 업그레이드해야 한다.




<!-- steps -->

## 워커 노드 업그레이드

### kubeadm 업그레이드

1.  윈도우 노드에서, kubeadm을 업그레이드한다.

    ```powershell
    # {{< skew currentPatchVersion >}}을 사용 중인 쿠버네티스 버전으로 변경한다.
    curl.exe -Lo <kubeadm.exe을 저장할 경로> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubeadm.exe"
    ```

### 노드 드레인

1.  쿠버네티스 API에 접근할 수 있는 머신에서,
    스케줄 불가능한 것으로 표시하고 워크로드를 축출하여 유지 보수할 노드를 준비한다.

    ```shell
    # <node-to-drain>을 드레이닝하려는 노드 이름으로 바꾼다
    kubectl drain <node-to-drain> --ignore-daemonsets
    ```

    다음과 비슷한 출력이 표시되어야 한다.

    ```
    node/ip-172-31-85-18 cordoned
    node/ip-172-31-85-18 drained
    ```

### kubelet 구성 업그레이드

1.  윈도우 노드에서, 다음의 명령을 호출하여 새 kubelet 구성을 동기화한다.

    ```powershell
    kubeadm upgrade node
    ```

### kubelet 및 kube-proxy 업그레이드

1.  윈도우 노드에서, kubelet을 업그레이드하고 다시 시작한다.

    ```powershell
    stop-service kubelet
    curl.exe -Lo <kubelet.exe을 저장할 경로> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubelet.exe"
    restart-service kubelet
    ```

2. 윈도우 노드에서, kube-proxy를 업그레이드하고 다시 시작한다.

    ```powershell
    stop-service kube-proxy
    curl.exe -Lo <kube-proxy.exe을 저장할 경로> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kube-proxy.exe"
    restart-service kube-proxy
    ```

{{< note >}}
만약 kube-proxy를 윈도우 서비스로 실행중이지 않고 파드 내의 HostProcess 컨테이너에서 실행중이라면, 새로운 버전의 kube-proxy 매니페스트를 적용함으로써 업그레이드할 수 있다.
{{< /note >}}

### 노드에 적용된 cordon 해제

1.  쿠버네티스 API에 접근할 수 있는 머신에서,
스케줄 가능으로 표시하여 노드를 다시 온라인으로 가져온다.

    ```shell
    # <node-to-drain>을 노드의 이름으로 바꾼다
    kubectl uncordon <node-to-drain>
    ```
