---
title: 使用 seccomp 限制容器的系統呼叫
content_type: tutorial
weight: 20
min-kubernetes-server-version: v1.22
---
<!-- 
reviewers:
- hasheddan
- pjbgf
- saschagrunert
title: Restrict a Container's Syscalls with seccomp
content_type: tutorial
weight: 20
min-kubernetes-server-version: v1.22
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

<!-- 
Seccomp stands for secure computing mode and has been a feature of the Linux
kernel since version 2.6.12. It can be used to sandbox the privileges of a
process, restricting the calls it is able to make from userspace into the
kernel. Kubernetes lets you automatically apply seccomp profiles loaded onto a
{{< glossary_tooltip text="node" term_id="node" >}} to your Pods and containers.

Identifying the privileges required for your workloads can be difficult. In this
tutorial, you will go through how to load seccomp profiles into a local
Kubernetes cluster, how to apply them to a Pod, and how you can begin to craft
profiles that give only the necessary privileges to your container processes.
-->
Seccomp 代表安全計算（Secure Computing）模式，自 2.6.12 版本以來，一直是 Linux 核心的一個特性。
它可以用來沙箱化程序的許可權，限制程序從使用者態到核心態的呼叫。
Kubernetes 能使你自動將載入到 {{< glossary_tooltip text="節點" term_id="node" >}}上的
seccomp 配置檔案應用到你的 Pod 和容器。

識別你的工作負載所需要的許可權是很困難的。在本篇教程中，
你將瞭解如何將 seccomp 配置檔案載入到本地的 Kubernetes 叢集中，
如何將它們應用到 Pod，以及如何開始製作只為容器程序提供必要的許可權的配置檔案。

## {{% heading "objectives" %}}

<!-- 
* Learn how to load seccomp profiles on a node
* Learn how to apply a seccomp profile to a container
* Observe auditing of syscalls made by a container process
* Observe behavior when a missing profile is specified
* Observe a violation of a seccomp profile
* Learn how to create fine-grained seccomp profiles
* Learn how to apply a container runtime default seccomp profile
-->
* 瞭解如何在節點上載入 seccomp 配置檔案
* 瞭解如何將 seccomp 配置檔案應用到容器上
* 觀察容器程序對系統呼叫的審計
* 觀察指定的配置檔案缺失時的行為
* 觀察違反 seccomp 配置檔案的行為
* 瞭解如何建立細粒度的 seccomp 配置檔案
* 瞭解如何應用容器執行時所預設的 seccomp 配置檔案

## {{% heading "prerequisites" %}}

<!-- 
In order to complete all steps in this tutorial, you must install
[kind](/docs/tasks/tools/#kind) and [kubectl](/docs/tasks/tools/#kubectl).

This tutorial shows some examples that are still alpha (since v1.22) and
others that use only generally available seccomp functionality. You should
make sure that your cluster is
[configured correctly](https://kind.sigs.k8s.io/docs/user/quick-start/#setting-kubernetes-version)
for the version you are using.

The tutorial also uses the `curl` tool for downloading examples to your computer.
You can adapt the steps to use a different tool if you prefer.
-->
為了完成本篇教程中的所有步驟，你必須安裝 [kind](/zh-cn/docs/tasks/tools/#kind)
和 [kubectl](/zh-cn/docs/tasks/tools/#kubectl)。

本篇教程演示的某些示例仍然是 alpha 狀態（自 v1.22 起），另一些示例則僅使用 seccomp 正式釋出的功能。
你應該確保，針對你使用的版本，
[正確配置](https://kind.sigs.k8s.io/docs/user/quick-start/#setting-kubernetes-version)了叢集。

本篇教程也使用了 `curl` 工具來下載示例到你的計算機上。
你可以使用其他自己偏好的工具來自適應這些步驟。

{{< note >}}
<!-- 
It is not possible to apply a seccomp profile to a container running with
`privileged: true` set in the container's `securityContext`. Privileged containers always
run as `Unconfined`.
-->
無法將 seccomp 配置檔案應用於在容器的 `securityContext` 中設定了 `privileged: true` 的容器。
特權容器始終以 `Unconfined` 的方式執行。
{{< /note >}}

<!-- steps -->

<!-- 
## Download example seccomp profiles {#download-profiles}

The contents of these profiles will be explored later on, but for now go ahead
and download them into a directory named `profiles/` so that they can be loaded
into the cluster.
-->
## 下載示例 seccomp 配置檔案  {#download-profiles}

這些配置檔案的內容將在稍後進行分析，
現在先將它們下載到名為 `profiles/` 的目錄中，以便將它們載入到叢集中。

{{< tabs name="tab_with_code" >}}
{{{< tab name="audit.json" >}}
{{< codenew file="pods/security/seccomp/profiles/audit.json" >}}
{{< /tab >}}
{{< tab name="violation.json" >}}
{{< codenew file="pods/security/seccomp/profiles/violation.json" >}}
{{< /tab >}}}
{{< tab name="fine-grained.json" >}}
{{< codenew file="pods/security/seccomp/profiles/fine-grained.json" >}}
{{< /tab >}}}
{{< /tabs >}}

<!-- Run these commands: -->
執行這些命令：

```shell
mkdir ./profiles
curl -L -o profiles/audit.json https://k8s.io/examples/pods/security/seccomp/profiles/audit.json
curl -L -o profiles/violation.json https://k8s.io/examples/pods/security/seccomp/profiles/violation.json
curl -L -o profiles/fine-grained.json https://k8s.io/examples/pods/security/seccomp/profiles/fine-grained.json
ls profiles
```

<!-- You should see three profiles listed at the end of the final step: -->
你應該看到在最後一步的末尾列出有三個配置檔案：
```
audit.json  fine-grained.json  violation.json
```

<!-- 
## Create a local Kubernetes cluster with kind

For simplicity, [kind](https://kind.sigs.k8s.io/) can be used to create a single
node cluster with the seccomp profiles loaded. Kind runs Kubernetes in Docker,
so each node of the cluster is a container. This allows for files
to be mounted in the filesystem of each container similar to loading files
onto a node.
-->

## 使用 kind 建立本地 Kubernetes 叢集 {#create-a-local-kubernetes-cluster-with-kind}

為簡單起見，[kind](https://kind.sigs.k8s.io/) 可用來建立載入了 seccomp 配置檔案的單節點叢集。
Kind 在 Docker 中執行 Kubernetes，因此叢集的每個節點都是一個容器。
這允許將檔案掛載到每個容器的檔案系統中，類似於將檔案載入到節點上。

{{< codenew file="pods/security/seccomp/kind.yaml" >}}

<!-- 
Download that example kind configuration, and save it to a file named `kind.yaml`:
-->
下載該示例 kind 配置，並將其儲存到名為 `kind.yaml` 的檔案中：
```shell
curl -L -O https://k8s.io/examples/pods/security/seccomp/kind.yaml
```

<!-- 
You can set a specific Kubernetes version by setting the node's container image.
See [Nodes](https://kind.sigs.k8s.io/docs/user/configuration/#nodes) within the
kind documentation about configuration for more details on this.
This tutorial assumes you are using Kubernetes {{< param "version" >}}.
-->
你可以透過設定節點的容器映象來設定特定的 Kubernetes 版本。
有關此類配置的更多資訊，
參閱 kind 文件中[節點](https://kind.sigs.k8s.io/docs/user/configuration/#nodes)小節。
本篇教程假定你正在使用 Kubernetes {{< param "version" >}}。

<!-- 
As an alpha feature, you can configure Kubernetes to use the profile that the
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
prefers by default, rather than falling back to `Unconfined`.
If you want to try that, see
[enable the use of `RuntimeDefault` as the default seccomp profile for all workloads](#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads)
before you continue.
-->
作為 alpha 特性，你可以將 Kubernetes 配置為使用
{{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}
預設首選的配置檔案，而不是回退到 `Unconfined`。
如果你想嘗試，請在繼續之前參閱
[啟用使用 `RuntimeDefault` 作為所有工作負載的預設 seccomp 配置檔案](#enable-runtimedefault-as-default)

<!--
Once you have a kind configuration in place, create the kind cluster with
that configuration: 
-->
有了 kind 配置後，使用該配置建立 kind 叢集：

```shell
kind create cluster --config=kind.yaml
```

<!--
After the new Kubernetes cluster is ready, identify the Docker container running
as the single node cluster:
-->
新的 Kubernetes 叢集準備就緒後，找出作為單節點叢集執行的 Docker 容器：

```shell
docker ps
```

<!--
You should see output indicating that a container is running with name
`kind-control-plane`. The output is similar to:
-->
你應該看到輸出中名為 `kind-control-plane` 的容器正在執行。
輸出類似於：
```
CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS                       NAMES
6a96207fed4b        kindest/node:v1.18.2   "/usr/local/bin/entr…"   27 seconds ago      Up 24 seconds       127.0.0.1:42223->6443/tcp   kind-control-plane
```

<!--
If observing the filesystem of that container, you should see that the
`profiles/` directory has been successfully loaded into the default seccomp path
of the kubelet. Use `docker exec` to run a command in the Pod:
-->
如果觀察該容器的檔案系統，
你應該會看到 `profiles/` 目錄已成功載入到 kubelet 的預設 seccomp 路徑中。
使用 `docker exec` 在 Pod 中執行命令：

```shell
# 將 6a96207fed4b 更改為你從 “docker ps” 看到的容器 ID
docker exec -it 6a96207fed4b ls /var/lib/kubelet/seccomp/profiles
```

```
audit.json  fine-grained.json  violation.json
```

<!-- 
You have verified that these seccomp profiles are available to the kubelet
running within kind.
-->
你已驗證這些 seccomp 配置檔案可用於在 kind 中執行的 kubelet。

<!-- 
## Enable the use of `RuntimeDefault` as the default seccomp profile for all workloads
-->
## 啟用使用 `RuntimeDefault` 作為所有工作負載的預設 seccomp 配置檔案 {#enable-runtimedefault-as-default}

{{< feature-state state="alpha" for_k8s_version="v1.22" >}}

<!-- 
`SeccompDefault` is an optional kubelet
[feature gate](/docs/reference/command-line-tools-reference/feature-gates) as
well as corresponding `--seccomp-default`
[command line flag](/docs/reference/command-line-tools-reference/kubelet).
Both have to be enabled simultaneously to use the feature.
-->
`SeccompDefault` 是一個可選的 kubelet [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates)
以及相應的 `--seccomp-default` [命令列標誌](/zh-cn/docs/reference/command-line-tools-reference/kubelet)。
兩者必須同時啟用才能使用該功能。

<!-- 
If enabled, the kubelet will use the `RuntimeDefault` seccomp profile by default, which is
defined by the container runtime, instead of using the `Unconfined` (seccomp disabled) mode.
The default profiles aim to provide a strong set
of security defaults while preserving the functionality of the workload. It is
possible that the default profiles differ between container runtimes and their
release versions, for example when comparing those from CRI-O and containerd.
-->
如果啟用，kubelet 將會預設使用 `RuntimeDefault` seccomp 配置檔案，
（這一配置文明是由容器執行時定義的），而不是使用 `Unconfined`（禁用 seccomp）模式。
預設的配置檔案旨在提供一組限制性較強且能保留工作負載功能的安全預設值。
不同容器執行時及其不同釋出版本之間的預設配置檔案可能有所不同，
例如在比較來自 CRI-O 和 containerd 的配置檔案時。

{{< note >}}
<!-- 
Enabling the feature will neither change the Kubernetes
`securityContext.seccompProfile` API field nor add the deprecated annotations of
the workload. This provides users the possibility to rollback anytime without
actually changing the workload configuration. Tools like
[`crictl inspect`](https://github.com/kubernetes-sigs/cri-tools) can be used to
verify which seccomp profile is being used by a container.
-->
啟用該功能既不會更改 Kubernetes `securityContext.seccompProfile` API 欄位，
也不會新增已棄用的工作負載註解。
這為使用者提供了隨時回滾的可能性，而且無需實際更改工作負載配置。
[`crictl inspect`](https://github.com/kubernetes-sigs/cri-tools)
之類的工具可用於驗證容器正在使用哪個 seccomp 配置檔案。
{{< /note >}}

<!-- 
Some workloads may require a lower amount of syscall restrictions than others.
This means that they can fail during runtime even with the `RuntimeDefault`
profile. To mitigate such a failure, you can:

- Run the workload explicitly as `Unconfined`.
- Disable the `SeccompDefault` feature for the nodes. Also making sure that
  workloads get scheduled on nodes where the feature is disabled.
- Create a custom seccomp profile for the workload.
-->
與其他工作負載相比，某些工作負載可能需要更少的系統呼叫限制。
這意味著即使使用 `RuntimeDefault` 配置檔案，它們也可能在執行時失敗。
要應對此類故障，你可以：

- 將工作負載顯式執行為 `Unconfined`。
- 禁用節點的 `SeccompDefault` 功能。還要確保工作負載被排程到禁用該功能的節點上。
- 為工作負載建立自定義 seccomp 配置檔案。

<!-- 
If you were introducing this feature into production-like cluster, the Kubernetes project
recommends that you enable this feature gate on a subset of your nodes and then
test workload execution before rolling the change out cluster-wide.

More detailed information about a possible upgrade and downgrade strategy can be
found in the [related Kubernetes Enhancement Proposal (KEP)](https://github.com/kubernetes/enhancements/tree/a70cc18/keps/sig-node/2413-seccomp-by-default#upgrade--downgrade-strategy).
-->
如果你將此功能引入到類似生產的叢集中，
Kubernetes 專案建議你在部分節點上啟用此特性門控，
然後在整個叢集範圍內推出更改之前，測試工作負載執行情況。

有關可能的升級和降級策略的更多詳細資訊，
請參閱[相關的 Kubernetes 增強提案 (KEP)](https://github.com/kubernetes/enhancements/tree/a70cc18/keps/sig-node/2413-seccomp-by-default#upgrade--downgrade-strategy)。

<!-- 
Since the feature is in alpha state it is disabled per default. To enable it,
pass the flags `--feature-gates=SeccompDefault=true --seccomp-default` to the
`kubelet` CLI or enable it via the [kubelet configuration
file](/docs/tasks/administer-cluster/kubelet-config-file/). To enable the
feature gate in [kind](https://kind.sigs.k8s.io), ensure that `kind` provides
the minimum required Kubernetes version and enables the `SeccompDefault` feature
[in the kind configuration](https://kind.sigs.k8s.io/docs/user/quick-start/#enable-feature-gates-in-your-cluster):
-->
由於此特性處於 alpha 階段，預設是被禁用的。
要啟用它，傳遞標誌 `--feature-gates=SeccompDefault=true --seccomp-default` 到
kubelet CLI 或者透過 [kubelet 配置檔案](/docs/tasks/administer-cluster/kubelet-config-file/)啟用。
要在 [kind](https://kind.sigs.k8s.io) 啟用特性門控，
請確保 `kind` 提供所需的最低 Kubernetes 版本，
並[在 kind 配置中](https://kind.sigs.k8s.io/docs/user/quick-start/#enable-feature-gates-in-your-cluster)
啟用了 `SeccompDefault` 特性：

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
featureGates:
  SeccompDefault: true
nodes:
  - role: control-plane
    image: kindest/node:v1.23.0@sha256:49824ab1727c04e56a21a5d8372a402fcd32ea51ac96a2706a12af38934f81ac
    kubeadmConfigPatches:
      - |
        kind: JoinConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            seccomp-default: "true"
  - role: worker
    image: kindest/node:v1.23.0@sha256:49824ab1727c04e56a21a5d8372a402fcd32ea51ac96a2706a12af38934f81ac
    kubeadmConfigPatches:
      - |
        kind: JoinConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            feature-gates: SeccompDefault=true
            seccomp-default: "true"
```

<!-- If the cluster is ready, then running a pod: -->
如果叢集已就緒，則執行一個 Pod：

```shell
kubectl run --rm -it --restart=Never --image=alpine alpine -- sh
```

<!-- 
Should now have the default seccomp profile attached. This can be verified by
using `docker exec` to run `crictl inspect` for the container on the kind
worker:
-->
現在應該附加了預設的 seccomp 配置檔案。
這可以透過使用 `docker exec` 為 kind 上的容器執行 `crictl inspect` 來驗證：

```shell
docker exec -it kind-worker bash -c \
    'crictl inspect $(crictl ps --name=alpine -q) | jq .info.runtimeSpec.linux.seccomp'
```

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64", "SCMP_ARCH_X86", "SCMP_ARCH_X32"],
  "syscalls": [
    {
      "names": ["..."]
    }
  ]
}
```

<!-- 
## Create a Pod with a seccomp profile for syscall auditing

To start off, apply the `audit.json` profile, which will log all syscalls of the
process, to a new Pod.

Here's a manifest for that Pod:
-->
## 使用 seccomp 配置檔案建立 Pod 以進行系統呼叫審計 {#create-a-pod-with-a-seccomp-profile-for-syscall-auditing}

首先，將 `audit.json` 配置檔案應用到新的 Pod 上，該配置檔案將記錄程序的所有系統呼叫。

這是該 Pod 的清單：

{{< codenew file="pods/security/seccomp/ga/audit-pod.yaml" >}}

{{< note >}}
<!-- 
The functional support for the already deprecated seccomp annotations
`seccomp.security.alpha.kubernetes.io/pod` (for the whole pod) and
`container.seccomp.security.alpha.kubernetes.io/[name]` (for a single container)
is going to be removed with the release of Kubernetes v1.25. Please always use
the native API fields in favor of the annotations.
-->
已棄用的 seccomp 註解 `seccomp.security.alpha.kubernetes.io/pod`（針對整個 Pod）和
`container.seccomp.security.alpha.kubernetes.io/[name]`（針對單個容器）
將隨著 Kubernetes v1.25 的釋出而被刪除。
請在可能的情況下使用原生 API 欄位而不是註解。
{{< /note >}}

<!-- Create the Pod in the cluster: -->
在叢集中建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/audit-pod.yaml
```

<!-- 
This profile does not restrict any syscalls, so the Pod should start
successfully.
-->
此配置檔案不限制任何系統呼叫，因此 Pod 應該成功啟動。

```shell
kubectl get pod/audit-pod
```

```
NAME        READY   STATUS    RESTARTS   AGE
audit-pod   1/1     Running   0          30s
```

<!-- 
In order to be able to interact with this endpoint exposed by this
container, create a NodePort {{< glossary_tooltip text="Services" term_id="service" >}}
that allows access to the endpoint from inside the kind control plane container.
-->
為了能夠與容器暴露的端點互動，
建立一個 NodePort 型別的 {{< glossary_tooltip text="Service" term_id="service" >}}，
允許從 kind 控制平面容器內部訪問端點。

```shell
kubectl expose pod audit-pod --type NodePort --port 5678
```

<!-- Check what port the Service has been assigned on the node. -->
檢查 Service 在節點上分配的埠。

```shell
kubectl get service audit-pod
```

<!-- The output is similar to: -->
輸出類似於：
```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
audit-pod   NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

<!-- 
Now you can use `curl` to access that endpoint from inside the kind control plane container,
at the port exposed by this Service. Use `docker exec` to run the `curl` command within the
container belonging to that control plane container:
-->
現在，你可以使用 `curl` 從 kind 控制平面容器內部訪問該端點，位於該服務所公開的埠上。
使用 `docker exec` 在屬於該控制平面容器的容器中執行 `curl` 命令：

```shell
# 將 6a96207fed4b 更改為你從 “docker ps” 看到的控制平面容器 ID
docker exec -it 6a96207fed4b curl localhost:32373
```

```
just made some syscalls!
```

<!-- 
You can see that the process is running, but what syscalls did it actually make?
Because this Pod is running in a local cluster, you should be able to see those
in `/var/log/syslog`. Open up a new terminal window and `tail` the output for
calls from `http-echo`:
-->
你可以看到該程序正在執行，但它實際上進行了哪些系統呼叫？
因為這個 Pod 在本地叢集中執行，你應該能夠在 `/var/log/syslog` 中看到它們。
開啟一個新的終端視窗並 `tail` 來自 `http-echo` 的呼叫的輸出：

```shell
tail -f /var/log/syslog | grep 'http-echo'
```

<!-- 
You should already see some logs of syscalls made by `http-echo`, and if you
`curl` the endpoint in the control plane container you will see more written.

For example:
-->
你應該已經看到了一些由 `http-echo` 進行的系統呼叫的日誌，
如果你在控制平面容器中 `curl` 端點，你會看到更多的寫入。

例如：
```
Jul  6 15:37:40 my-machine kernel: [369128.669452] audit: type=1326 audit(1594067860.484:14536): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=51 compat=0 ip=0x46fe1f code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669453] audit: type=1326 audit(1594067860.484:14537): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=54 compat=0 ip=0x46fdba code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669455] audit: type=1326 audit(1594067860.484:14538): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=202 compat=0 ip=0x455e53 code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669456] audit: type=1326 audit(1594067860.484:14539): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=288 compat=0 ip=0x46fdba code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669517] audit: type=1326 audit(1594067860.484:14540): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=0 compat=0 ip=0x46fd44 code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669519] audit: type=1326 audit(1594067860.484:14541): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=270 compat=0 ip=0x4559b1 code=0x7ffc0000
Jul  6 15:38:40 my-machine kernel: [369188.671648] audit: type=1326 audit(1594067920.488:14559): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=270 compat=0 ip=0x4559b1 code=0x7ffc0000
Jul  6 15:38:40 my-machine kernel: [369188.671726] audit: type=1326 audit(1594067920.488:14560): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=202 compat=0 ip=0x455e53 code=0x7ffc0000
```

<!-- 
You can begin to understand the syscalls required by the `http-echo` process by
looking at the `syscall=` entry on each line. While these are unlikely to
encompass all syscalls it uses, it can serve as a basis for a seccomp profile
for this container.

Clean up that Pod and Service before moving to the next section:
-->
透過檢視每一行的 `syscall=` 條目，你可以開始瞭解 `http-echo` 程序所需的系統呼叫。
雖然這些不太可能包含它使用的所有系統呼叫，但它可以作為此容器的 seccomp 配置檔案的基礎。

在轉到下一部分之前清理該 Pod 和 Service：

```shell
kubectl delete service audit-pod --wait
kubectl delete pod audit-pod --wait --now
```

<!-- 
## Create Pod with seccomp profile that causes violation

For demonstration, apply a profile to the Pod that does not allow for any
syscalls.

The manifest for this demonstration is:
-->
## 使用導致違規的 seccomp 配置檔案建立 Pod {#create-pod-with-seccomp-profile-that-causes-violation}

出於演示目的，將配置檔案應用於不允許任何系統呼叫的 Pod 上。

此演示的清單是：

{{< codenew file="pods/security/seccomp/ga/violation-pod.yaml" >}}

<!-- Attempt to create the Pod in the cluster: -->
嘗試在叢集中建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/violation-pod.yaml
```

<!-- 
The Pod creates, but there is an issue.
If you check the status of the Pod, you should see that it failed to start.
-->
Pod 建立，但存在問題。
如果你檢查 Pod 狀態，你應該看到它沒有啟動。

```shell
kubectl get pod/violation-pod
```

```
NAME            READY   STATUS             RESTARTS   AGE
violation-pod   0/1     CrashLoopBackOff   1          6s
```

<!-- 
As seen in the previous example, the `http-echo` process requires quite a few
syscalls. Here seccomp has been instructed to error on any syscall by setting
`"defaultAction": "SCMP_ACT_ERRNO"`. This is extremely secure, but removes the
ability to do anything meaningful. What you really want is to give workloads
only the privileges they need.

Clean up that Pod before moving to the next section:
-->
如上例所示，`http-echo` 程序需要相當多的系統呼叫。
這裡 seccomp 已透過設定 `"defaultAction": "SCMP_ACT_ERRNO"` 被指示為在發生任何系統呼叫時報錯。
這是非常安全的，但消除了做任何有意義的事情的能力。
你真正想要的是隻給工作負載它們所需要的許可權。

在轉到下一部分之前清理該 Pod：

```shell
kubectl delete pod violation-pod --wait --now
```

<!-- 
## Create Pod with seccomp profile that only allows necessary syscalls

If you take a look at the `fine-grained.json` profile, you will notice some of the syscalls
seen in syslog of the first example where the profile set `"defaultAction":
"SCMP_ACT_LOG"`. Now the profile is setting `"defaultAction": "SCMP_ACT_ERRNO"`,
but explicitly allowing a set of syscalls in the `"action": "SCMP_ACT_ALLOW"`
block. Ideally, the container will run successfully and you will see no messages
sent to `syslog`.

The manifest for this example is:
-->
## 使用只允許必要的系統呼叫的 seccomp 配置檔案建立 Pod {#create-pod-with-seccomp-profile-that-only-allows-necessary-syscalls}

如果你看一看 `fine-grained.json` 配置檔案，
你會注意到第一個示例的 syslog 中看到的一些系統呼叫，
其中配置檔案設定為 `"defaultAction": "SCMP_ACT_LOG"`。
現在的配置檔案設定 `"defaultAction": "SCMP_ACT_ERRNO"`,
但在 `"action": "SCMP_ACT_ALLOW"` 塊中明確允許一組系統呼叫。
理想情況下，容器將成功執行，並且你看到沒有訊息傳送到 `syslog`。

此示例的清單是：

{{< codenew file="pods/security/seccomp/ga/fine-pod.yaml" >}}

<!-- Create the Pod in your cluster: -->
在你的叢集中建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/fine-pod.yaml
```

```shell
kubectl get pod fine-pod
```

<!-- The Pod should be showing as having started successfully: -->
此 Pod 應該顯示為已成功啟動：
```
NAME        READY   STATUS    RESTARTS   AGE
fine-pod   1/1     Running   0          30s
```

<!-- 
Open up a new terminal window and use `tail` to monitor for log entries that
mention calls from `http-echo`:
-->
開啟一個新的終端視窗並使用 `tail` 來監視提到來自 `http-echo` 的呼叫的日誌條目：

```shell
# 你計算機上的日誌路徑可能與 “/var/log/syslog” 不同
tail -f /var/log/syslog | grep 'http-echo'
```

<!-- Next, expose the Pod with a NodePort Service: -->
接著，使用 NodePort Service 公開 Pod：

```shell
kubectl expose pod fine-pod --type NodePort --port 5678
```

<!-- Check what port the Service has been assigned on the node: -->
檢查節點上的 Service 分配了什麼埠：

```shell
kubectl get service fine-pod
```

<!-- The output is similar to: -->
輸出類似於：
```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
fine-pod    NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

<!-- Use `curl` to access that endpoint from inside the kind control plane container: -->
使用 `curl` 從 kind 控制平面容器內部訪問端點：

```shell
# 將 6a96207fed4b 更改為你從 “docker ps” 看到的控制平面容器 ID
docker exec -it 6a96207fed4b curl localhost:32373
```

```
just made some syscalls!
```

<!-- 
You should see no output in the `syslog`. This is because the profile allowed all
necessary syscalls and specified that an error should occur if one outside of
the list is invoked. This is an ideal situation from a security perspective, but
required some effort in analyzing the program. It would be nice if there was a
simple way to get closer to this security without requiring as much effort.

Clean up that Pod and Service before moving to the next section:
-->
你應該在 `syslog` 中看不到任何輸出。
這是因為配置檔案允許所有必要的系統呼叫，並指定如果呼叫列表之外的系統呼叫應發生錯誤。
從安全形度來看，這是一種理想的情況，但需要在分析程式時付出一些努力。
如果有一種簡單的方法可以在不需要太多努力的情況下更接近這種安全性，那就太好了。

在轉到下一部分之前清理該 Pod 和服務：

```shell
kubectl delete service fine-pod --wait
kubectl delete pod fine-pod --wait --now
```

<!--
## Create Pod that uses the container runtime default seccomp profile

Most container runtimes provide a sane set of default syscalls that are allowed
or not. You can adopt these defaults for your workload by setting the seccomp
type in the security context of a pod or container to `RuntimeDefault`. 
-->
## 建立使用容器執行時預設 seccomp 配置檔案的 Pod {#create-pod-that-uses-the-container-runtime-default-seccomp-profile}

大多數容器執行時都提供了一組合理的預設系統呼叫，以及是否允許執行這些系統呼叫。
你可以透過將 Pod 或容器的安全上下文中的 seccomp 型別設定為 `RuntimeDefault`
來為你的工作負載採用這些預設值。

{{< note >}}
<!-- 
If you have the `SeccompDefault` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled, then Pods use the `RuntimeDefault` seccomp profile whenever
no other seccomp profile is specified. Otherwise, the default is `Unconfined`.
-->
如果你已經啟用了 `SeccompDefault` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
只要沒有指定其他 seccomp 配置檔案，那麼 Pod 就會使用 `SeccompDefault` 的 seccomp 配置檔案。
否則，預設值為 `Unconfined`。
{{< /note >}}

<!-- 
Here's a manifest for a Pod that requests the `RuntimeDefault` seccomp profile
for all its containers:
-->
這是一個 Pod 的清單，它要求其所有容器使用 `RuntimeDefault` seccomp 配置檔案：

{{< codenew file="pods/security/seccomp/ga/default-pod.yaml" >}}

<!-- Create that Pod: -->
建立此 Pod：
```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/default-pod.yaml
```

```shell
kubectl get pod default-pod
```

<!-- The Pod should be showing as having started successfully: -->
此 Pod 應該顯示為成功啟動：
```
NAME        READY   STATUS    RESTARTS   AGE
default-pod 1/1     Running   0          20s
```

<!-- Finally, now that you saw that work OK, clean up: -->
最後，你看到一切正常之後，請清理：

```shell
kubectl delete pod default-pod --wait --now
```

## {{% heading "whatsnext" %}}

<!-- 
You can learn more about Linux seccomp:

* [A seccomp Overview](https://lwn.net/Articles/656307/)
* [Seccomp Security Profiles for Docker](https://docs.docker.com/engine/security/seccomp/)
-->
你可以瞭解有關 Linux seccomp 的更多資訊：

* [seccomp 概述](https://lwn.net/Articles/656307/)
* [Docker 的 Seccomp 安全配置檔案](https://docs.docker.com/engine/security/seccomp/)