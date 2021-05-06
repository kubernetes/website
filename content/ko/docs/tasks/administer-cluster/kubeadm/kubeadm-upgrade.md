---


title: kubeadm 클러스터 업그레이드
content_type: task
weight: 20
---

<!-- overview -->

이 페이지는 kubeadm으로 생성된 쿠버네티스 클러스터를
{{< skew latestVersionAddMinor -1 >}}.x 버전에서 {{< skew latestVersion >}}.x 버전으로,
{{< skew latestVersion >}}.x 버전에서 {{< skew latestVersion >}}.y(여기서 `y > x`) 버전으로 업그레이드하는 방법을 설명한다.  업그레이드가 지원되지 않는 경우
마이너 버전을 건너뛴다.

이전 버전의 kubeadm을 사용하여 생성된 클러스터 업그레이드에 대한 정보를 보려면,
이 페이지 대신 다음의 페이지들을 참고한다.

- [kubeadm 클러스터를 {{< skew latestVersionAddMinor -2 >}}에서 {{< skew latestVersionAddMinor -1 >}}로 업그레이드](https://v{{< skew latestVersionAddMinor -1 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [kubeadm 클러스터를 {{< skew latestVersionAddMinor -3 >}}에서 {{< skew latestVersionAddMinor -2 >}}로 업그레이드](https://v{{< skew latestVersionAddMinor -2 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [kubeadm 클러스터를 {{< skew latestVersionAddMinor -4 >}}에서 {{< skew latestVersionAddMinor -3 >}}로 업그레이드](https://v{{< skew latestVersionAddMinor -3 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [kubeadm 클러스터를 {{< skew latestVersionAddMinor -5 >}}에서 {{< skew latestVersionAddMinor -4 >}}으로 업그레이드](https://v{{< skew latestVersionAddMinor -4 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)

추상적인 업그레이드 작업 절차는 다음과 같다.

1. 기본 컨트롤 플레인 노드를 업그레이드한다.
1. 추가 컨트롤 플레인 노드를 업그레이드한다.
1. 워커(worker) 노드를 업그레이드한다.

## {{% heading "prerequisites" %}}

- [릴리스 노트]({{< latest-release-notes >}})를 주의 깊게 읽어야 한다.
- 클러스터는 정적 컨트롤 플레인 및 etcd 파드 또는 외부 etcd를 사용해야 한다.
- 데이터베이스에 저장된 앱-레벨 상태와 같은 중요한 컴포넌트를 반드시 백업한다.
  `kubeadm upgrade` 는 워크로드에 영향을 미치지 않고, 쿠버네티스 내부의 컴포넌트만 다루지만, 백업은 항상 모범 사례일 정도로 중요하다.
- [스왑을 비활성화해야 한다](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux).

### 추가 정보

- kubelet 마이너 버전을 업그레이드하기 전에 [노드 드레이닝(draining)](/docs/tasks/administer-cluster/safely-drain-node/)이
  필요하다. 컨트롤 플레인 노드의 경우 CoreNDS 파드 또는 기타 중요한 워크로드를 실행할 수 있다.
- 컨테이너 사양 해시 값이 변경되므로, 업그레이드 후 모든 컨테이너가 다시 시작된다.

<!-- steps -->

## 업그레이드할 버전 결정

OS 패키지 관리자를 사용하여 최신의 안정 버전({{< skew latestVersion >}})을 찾는다.

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian 또는 HypriotOS" %}}
    apt update
    apt-cache madison kubeadm
    # 목록에서 최신 버전({{< skew latestVersion >}})을 찾는다
    # {{< skew latestVersion >}}.x-00과 같아야 한다. 여기서 x는 최신 패치이다.
{{% /tab %}}
{{% tab name="CentOS, RHEL 또는 Fedora" %}}
    yum list --showduplicates kubeadm --disableexcludes=kubernetes
    # 목록에서 최신 버전({{< skew latestVersion >}})을 찾는다
    # {{< skew latestVersion >}}.x-0과 같아야 한다. 여기서 x는 최신 패치이다.
{{% /tab %}}
{{< /tabs >}}

## 컨트롤 플레인 노드 업그레이드

컨트롤 플레인 노드의 업그레이드 절차는 한 번에 한 노드씩 실행해야 한다.
먼저 업그레이드할 컨트롤 플레인 노드를 선택한다. `/etc/kubernetes/admin.conf` 파일이 있어야 한다.

### "kubeadm upgrade" 호출

**첫 번째 컨트롤 플레인 노드의 경우**

-  kubeadm 업그레이드

{{< tabs name="k8s_install_kubeadm_first_cp" >}}
{{% tab name="Ubuntu, Debian 또는 HypriotOS" %}}
    # {{< skew latestVersion >}}.x-00에서 x를 최신 패치 버전으로 바꾼다.
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm={{< skew latestVersion >}}.x-00 && \
    apt-mark hold kubeadm
    -
    # apt-get 버전 1.1부터 다음 방법을 사용할 수도 있다
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubeadm={{< skew latestVersion >}}.x-00
{{% /tab %}}
{{% tab name="CentOS, RHEL 또는 Fedora" %}}
    # {{< skew latestVersion >}}.x-0에서 x를 최신 패치 버전으로 바꾼다.
    yum install -y kubeadm-{{< skew latestVersion >}}.x-0 --disableexcludes=kubernetes
{{% /tab %}}
{{< /tabs >}}

-  다운로드하려는 버전이 잘 받아졌는지 확인한다.

    ```shell
    kubeadm version
    ```

-  업그레이드 계획을 확인한다.

    ```shell
    kubeadm upgrade plan
    ```

    이 명령은 클러스터를 업그레이드할 수 있는지를 확인하고, 업그레이드할 수 있는 버전을 가져온다.
    또한 컴포넌트 구성 버전 상태가 있는 표를 보여준다.

{{< note >}}
또한 `kubeadm upgrade` 는 이 노드에서 관리하는 인증서를 자동으로 갱신한다.
인증서 갱신을 하지 않으려면 `--certificate-renewal=false` 플래그를 사용할 수 있다.
자세한 내용은 [인증서 관리 가이드](/ko/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)를 참고한다.
{{</ note >}}

{{< note >}}
`kubeadm upgrade plan` 이 수동 업그레이드가 필요한 컴포넌트 구성을 표시하는 경우, 사용자는
`--config` 커맨드 라인 플래그를 통해 대체 구성이 포함된 구성 파일을 `kubeadm upgrade apply` 에 제공해야 한다.
그렇게 하지 않으면 `kubeadm upgrade apply` 가 오류와 함께 종료되고 업그레이드를 수행하지 않는다.
{{</ note >}}

-  업그레이드할 버전을 선택하고, 적절한 명령을 실행한다. 예를 들면 다음과 같다.

    ```shell
    # 이 업그레이드를 위해 선택한 패치 버전으로 x를 바꾼다.
    sudo kubeadm upgrade apply v{{< skew latestVersion >}}.x
    ```

    명령이 완료되면 다음을 확인해야 한다.

    ```
    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v{{< skew latestVersion >}}.x". Enjoy!

    [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
    ```

-  CNI 제공자 플러그인을 수동으로 업그레이드한다.

    CNI(컨테이너 네트워크 인터페이스) 제공자는 자체 업그레이드 지침을 따를 수 있다.
    [애드온](/ko/docs/concepts/cluster-administration/addons/) 페이지에서
    사용하는 CNI 제공자를 찾고 추가 업그레이드 단계가 필요한지 여부를 확인한다.

    CNI 제공자가 데몬셋(DaemonSet)으로 실행되는 경우 추가 컨트롤 플레인 노드에는 이 단계가 필요하지 않다.

**다른 컨트롤 플레인 노드의 경우**

첫 번째 컨트롤 플레인 노드와 동일하지만 다음을 사용한다.

```
sudo kubeadm upgrade node
```

아래 명령 대신 위의 명령을 사용한다.

```
sudo kubeadm upgrade apply
```

`kubeadm upgrade plan` 을 호출하고 CNI 공급자 플러그인을 업그레이드할 필요가 없다.

### 노드 드레인

-  Prepare the node for maintenance by marking it unschedulable and evicting the workloads:

    ```shell
    # <node-to-drain>을 드레인하는 노드의 이름으로 바꾼다.
    kubectl drain <node-to-drain> --ignore-daemonsets
    ```

### kubelet과 kubectl 업그레이드

-  모든 컨트롤 플레인 노드에서 kubelet 및 kubectl을 업그레이드한다.

{{< tabs name="k8s_install_kubelet" >}}
{{< tab name="Ubuntu, Debian 또는 HypriotOS" >}}
    <pre>>
    # {{< skew latestVersion >}}.x-00의 x를 최신 패치 버전으로 바꾼다
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet={{< skew latestVersion >}}.x-00 kubectl={{< skew latestVersion >}}.x-00 && \
    apt-mark hold kubelet kubectl
    -
    # apt-get 버전 1.1부터 다음 방법을 사용할 수도 있다
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubelet={{< skew latestVersion >}}.x-00 kubectl={{< skew latestVersion >}}.x-00
    </pre>
{{< /tab >}}
{{< tab name="CentOS, RHEL 또는 Fedora" >}}
    <pre>
    # {{< skew latestVersion >}}.x-0에서 x를 최신 패치 버전으로 바꾼다
    yum install -y kubelet-{{< skew latestVersion >}}.x-0 kubectl-{{< skew latestVersion >}}.x-0 --disableexcludes=kubernetes
    </pre>
{{< /tab >}}
{{< /tabs >}}

-  kubelet을 다시 시작한다.

```shell
sudo systemctl daemon-reload
sudo systemctl restart kubelet
```

### 노드 uncordon

-   노드를 스케줄 가능으로 표시하여 노드를 다시 온라인 상태로 전환한다.

    ```shell
    # <node-to-drain>을 드레인하는 노드의 이름으로 바꾼다.
    kubectl uncordon <node-to-drain>
    ```

## 워커 노드 업그레이드

워커 노드의 업그레이드 절차는 워크로드를 실행하는 데 필요한 최소 용량을 보장하면서,
한 번에 하나의 노드 또는 한 번에 몇 개의 노드로 실행해야 한다.

### kubeadm 업그레이드

-  모든 워커 노드에서 kubeadm을 업그레이드한다.

{{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
{{% tab name="Ubuntu, Debian 또는 HypriotOS" %}}
    # {{< skew latestVersion >}}.x-00의 x를 최신 패치 버전으로 바꾼다
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm={{< skew latestVersion >}}.x-00 && \
    apt-mark hold kubeadm
    -
    # apt-get 버전 1.1부터 다음 방법을 사용할 수도 있다
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubeadm={{< skew latestVersion >}}.x-00
{{% /tab %}}
{{% tab name="CentOS, RHEL 또는 Fedora" %}}
    # {{< skew latestVersion >}}.x-0에서 x를 최신 패치 버전으로 바꾼다
    yum install -y kubeadm-{{< skew latestVersion >}}.x-0 --disableexcludes=kubernetes
{{% /tab %}}
{{< /tabs >}}

### "kubeadm upgrade" 호출

-  워커 노드의 경우 로컬 kubelet 구성을 업그레이드한다.

    ```shell
    sudo kubeadm upgrade node
    ```

### 노드 드레인

-  스케줄 불가능(unschedulable)으로 표시하고 워크로드를 축출하여 유지 보수할 노드를 준비한다.

    ```shell
    # <node-to-drain>을 드레이닝하려는 노드 이름으로 바꾼다.
    kubectl drain <node-to-drain> --ignore-daemonsets
    ```

### kubelet과 kubectl 업그레이드

-  kubelet 및 kubectl을 업그레이드한다.

{{< tabs name="k8s_kubelet_and_kubectl" >}}
{{% tab name="Ubuntu, Debian 또는 HypriotOS" %}}
    # {{< skew latestVersion >}}.x-00의 x를 최신 패치 버전으로 바꾼다
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet={{< skew latestVersion >}}.x-00 kubectl={{< skew latestVersion >}}.x-00 && \
    apt-mark hold kubelet kubectl
    -
    # apt-get 버전 1.1부터 다음 방법을 사용할 수도 있다
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubelet={{< skew latestVersion >}}.x-00 kubectl={{< skew latestVersion >}}.x-00
{{% /tab %}}
{{% tab name="CentOS, RHEL 또는 Fedora" %}}
    # {{< skew latestVersion >}}.x-0에서 x를 최신 패치 버전으로 바꾼다
    yum install -y kubelet-{{< skew latestVersion >}}.x-0 kubectl-{{< skew latestVersion >}}.x-0 --disableexcludes=kubernetes
{{% /tab %}}
{{< /tabs >}}

-  kubelet을 다시 시작한다.

    ```shell
    sudo systemctl daemon-reload
    sudo systemctl restart kubelet
    ```

### 노드에 적용된 cordon 해제

-  스케줄 가능(schedulable)으로 표시하여 노드를 다시 온라인 상태로 만든다.

    ```shell
    # <node-to-drain>을 노드의 이름으로 바꾼다.
    kubectl uncordon <node-to-drain>
    ```

## 클러스터 상태 확인

모든 노드에서 kubelet을 업그레이드한 후 kubectl이 클러스터에 접근할 수 있는 곳에서 다음의 명령을 실행하여
모든 노드를 다시 사용할 수 있는지 확인한다.

```shell
kubectl get nodes
```

모든 노드에 대해 `STATUS` 열에 `Ready` 가 표시되어야 하고, 버전 번호가 업데이트되어 있어야 한다.

## 장애 상태에서의 복구

예를 들어 `kubeadm upgrade` 를 실행하는 중에 예기치 못한 종료로 인해 업그레이드가 실패하고 롤백하지 않는다면, `kubeadm upgrade` 를 다시 실행할 수 있다.
이 명령은 멱등성을 보장하며 결국 실제 상태가 선언한 의도한 상태인지 확인한다.

잘못된 상태에서 복구하기 위해, 클러스터가 실행 중인 버전을 변경하지 않고 `kubeadm upgrade apply --force` 를 실행할 수도 있다.

업그레이드하는 동안 kubeadm은 `/etc/kubernetes/tmp` 아래에 다음과 같은 백업 폴더를 작성한다.
- `kubeadm-backup-etcd-<date>-<time>`
- `kubeadm-backup-manifests-<date>-<time>`

`kubeadm-backup-etcd` 는 컨트롤 플레인 노드에 대한 로컬 etcd 멤버 데이터의 백업을 포함한다.
etcd 업그레이드가 실패하고 자동 롤백이 작동하지 않으면, 이 폴더의 내용을
`/var/lib/etcd` 에서 수동으로 복원할 수 있다. 외부 etcd를 사용하는 경우 이 백업 폴더는 비어있다.

`kubeadm-backup-manifests` 는 컨트롤 플레인 노드에 대한 정적 파드 매니페스트 파일의 백업을 포함한다.
업그레이드가 실패하고 자동 롤백이 작동하지 않으면, 이 폴더의 내용을
`/etc/kubernetes/manifests` 에서 수동으로 복원할 수 있다. 어떤 이유로 특정 컴포넌트의 업그레이드 전
매니페스트 파일과 업그레이드 후 매니페스트 파일 간에 차이가 없는 경우, 백업 파일은 기록되지 않는다.

## 작동 원리

`kubeadm upgrade apply` 는 다음을 수행한다.

- 클러스터가 업그레이드 가능한 상태인지 확인한다.
  - API 서버에 접근할 수 있다
  - 모든 노드가 `Ready` 상태에 있다
  - 컨트롤 플레인이 정상적으로 동작한다
- 버전 차이(skew) 정책을 적용한다.
- 컨트롤 플레인 이미지가 사용 가능한지 또는 머신으로 가져올 수 있는지 확인한다.
- 컴포넌트 구성에 버전 업그레이드가 필요한 경우 대체 구성을 생성하거나 사용자가 제공한 것으로 덮어 쓰기한다.
- 컨트롤 플레인 컴포넌트 또는 롤백 중 하나라도 나타나지 않으면 업그레이드한다.
- 새로운 `kube-dns` 와 `kube-proxy` 매니페스트를 적용하고 필요한 모든 RBAC 규칙이 생성되도록 한다.
- API 서버의 새 인증서와 키 파일을 작성하고 180일 후에 만료될 경우 이전 파일을 백업한다.

`kubeadm upgrade node` 는 추가 컨트롤 플레인 노드에서 다음을 수행한다.

- 클러스터에서 kubeadm `ClusterConfiguration` 을 가져온다.
- 선택적으로 kube-apiserver 인증서를 백업한다.
- 컨트롤 플레인 컴포넌트에 대한 정적 파드 매니페스트를 업그레이드한다.
- 이 노드의 kubelet 구성을 업그레이드한다.

`kubeadm upgrade node` 는 워커 노드에서 다음을 수행한다.

- 클러스터에서 kubeadm `ClusterConfiguration` 을 가져온다.
- 이 노드의 kubelet 구성을 업그레이드한다.
