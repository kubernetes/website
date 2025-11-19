---
title: 使用 seccomp 限制容器的系統調用
content_type: tutorial
weight: 40
min-kubernetes-server-version: v1.22
---
<!-- 
reviewers:
- hasheddan
- pjbgf
- saschagrunert
title: Restrict a Container's Syscalls with seccomp
content_type: tutorial
weight: 40
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
Seccomp 代表安全計算（Secure Computing）模式，自 2.6.12 版本以來，一直是 Linux 內核的一個特性。
它可以用來沙箱化進程的權限，限制進程從使用者態到內核態的調用。
Kubernetes 能使你自動將加載到{{< glossary_tooltip text="節點" term_id="node" >}}上的
seccomp 設定文件應用到你的 Pod 和容器。

識別你的工作負載所需要的權限是很困難的。在本篇教程中，
你將瞭解如何將 seccomp 設定文件加載到本地的 Kubernetes 叢集中，
如何將它們應用到 Pod，以及如何開始製作只爲容器進程提供必要的權限的設定文件。

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
* 瞭解如何在節點上加載 seccomp 設定文件
* 瞭解如何將 seccomp 設定文件應用到容器上
* 觀察容器進程對系統調用的審計
* 觀察指定的設定文件缺失時的行爲
* 觀察違反 seccomp 設定文件的行爲
* 瞭解如何創建細粒度的 seccomp 設定文件
* 瞭解如何應用容器運行時所默認的 seccomp 設定文件

## {{% heading "prerequisites" %}}

<!-- 
In order to complete all steps in this tutorial, you must install
[kind](/docs/tasks/tools/#kind) and [kubectl](/docs/tasks/tools/#kubectl).

The commands used in the tutorial assume that you are using
[Docker](https://www.docker.com/) as your container runtime. (The cluster that `kind` creates may
use a different container runtime internally). You could also use
[Podman](https://podman.io/) but in that case, you would have to follow specific
[instructions](https://kind.sigs.k8s.io/docs/user/rootless/) in order to complete the tasks
successfully.
-->
爲了完成本篇教程中的所有步驟，你必須安裝 [kind](/zh-cn/docs/tasks/tools/#kind)
和 [kubectl](/zh-cn/docs/tasks/tools/#kubectl)。

本教程中使用的命令假設你使用 [Docker](https://www.docker.com/) 作爲容器運行時。
（`kind` 創建的叢集可以在內部使用不同的容器運行時）。
你也可以使用 [Podman](https://podman.io/)，但如果使用了 Podman，
你必須執行特定的[指令](https://kind.sigs.k8s.io/docs/user/rootless/)才能順利完成任務。

<!--
This tutorial shows some examples that are still beta (since v1.25) and
others that use only generally available seccomp functionality. You should
make sure that your cluster is
[configured correctly](https://kind.sigs.k8s.io/docs/user/quick-start/#setting-kubernetes-version)
for the version you are using.

The tutorial also uses the `curl` tool for downloading examples to your computer.
You can adapt the steps to use a different tool if you prefer.
-->
本篇教程演示的某些示例仍然是 Beta 狀態（自 v1.25 起），另一些示例則僅使用 seccomp 正式發佈的功能。
你應該確保，針對你使用的版本，
[正確設定](https://kind.sigs.k8s.io/docs/user/quick-start/#setting-kubernetes-version)了叢集。

本篇教程也使用了 `curl` 工具來下載示例到你的計算機上。
你可以使用其他自己偏好的工具來自適應這些步驟。

{{< note >}}
<!-- 
It is not possible to apply a seccomp profile to a container running with
`privileged: true` set in the container's `securityContext`. Privileged containers always
run as `Unconfined`.
-->
無法將 seccomp 設定文件應用於在容器的 `securityContext` 中設置了 `privileged: true` 的容器。
特權容器始終以 `Unconfined` 的方式運行。
{{< /note >}}

<!-- steps -->

<!-- 
## Download example seccomp profiles {#download-profiles}

The contents of these profiles will be explored later on, but for now go ahead
and download them into a directory named `profiles/` so that they can be loaded
into the cluster.
-->
## 下載示例 seccomp 設定文件  {#download-profiles}

這些設定文件的內容將在稍後進行分析，
現在先將它們下載到名爲 `profiles/` 的目錄中，以便將它們加載到叢集中。

{{< tabs name="tab_with_code" >}}
{{< tab name="audit.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/audit.json" %}}
{{< /tab >}}
{{< tab name="violation.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/violation.json" %}}
{{< /tab >}}
{{< tab name="fine-grained.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/fine-grained.json" %}}
{{< /tab >}}
{{< /tabs >}}

<!--
Run these commands:
-->
執行這些命令：

```shell
mkdir ./profiles
curl -L -o profiles/audit.json https://k8s.io/examples/pods/security/seccomp/profiles/audit.json
curl -L -o profiles/violation.json https://k8s.io/examples/pods/security/seccomp/profiles/violation.json
curl -L -o profiles/fine-grained.json https://k8s.io/examples/pods/security/seccomp/profiles/fine-grained.json
ls profiles
```

<!--
You should see three profiles listed at the end of the final step:
-->
你應該看到在最後一步的末尾列出有三個設定文件：

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
## 使用 kind 創建本地 Kubernetes 叢集 {#create-a-local-kubernetes-cluster-with-kind}

爲簡單起見，[kind](https://kind.sigs.k8s.io/) 可用來創建加載了 seccomp 設定文件的單節點叢集。
Kind 在 Docker 中運行 Kubernetes，因此叢集的每個節點都是一個容器。
這允許將文件掛載到每個容器的文件系統中，類似於將文件加載到節點上。

{{% code_sample file="pods/security/seccomp/kind.yaml" %}}

<!-- 
Download that example kind configuration, and save it to a file named `kind.yaml`:
-->
下載該示例 kind 設定，並將其保存到名爲 `kind.yaml` 的文件中：

```shell
curl -L -O https://k8s.io/examples/pods/security/seccomp/kind.yaml
```

<!-- 
You can set a specific Kubernetes version by setting the node's container image.
See [Nodes](https://kind.sigs.k8s.io/docs/user/configuration/#nodes) within the
kind documentation about configuration for more details on this.
This tutorial assumes you are using Kubernetes {{< param "version" >}}.
-->
你可以通過設置節點的容器映像檔來設置特定的 Kubernetes 版本。
有關此類設定的更多信息，
參閱 kind 文檔中[節點](https://kind.sigs.k8s.io/docs/user/configuration/#nodes)小節。
本篇教程假定你正在使用 Kubernetes {{< param "version" >}}。

<!-- 
As a beta feature, you can configure Kubernetes to use the profile that the
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
prefers by default, rather than falling back to `Unconfined`.
If you want to try that, see
[enable the use of `RuntimeDefault` as the default seccomp profile for all workloads](#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads)
before you continue.
-->
作爲 Beta 特性，你可以將 Kubernetes
設定爲使用{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}默認首選的設定文件，
而不是回退到 `Unconfined`。
如果你想嘗試，請在繼續之前參閱
[啓用使用 `RuntimeDefault` 作爲所有工作負載的默認 seccomp 設定文件](#enable-runtimedefault-as-default)。

<!--
Once you have a kind configuration in place, create the kind cluster with
that configuration: 
-->
有了 kind 設定後，使用該設定創建 kind 叢集：

```shell
kind create cluster --config=kind.yaml
```

<!--
After the new Kubernetes cluster is ready, identify the Docker container running
as the single node cluster:
-->
新的 Kubernetes 叢集準備就緒後，找出作爲單節點叢集運行的 Docker 容器：

```shell
docker ps
```

<!--
You should see output indicating that a container is running with name
`kind-control-plane`. The output is similar to:
-->
你應該看到輸出中名爲 `kind-control-plane` 的容器正在運行。
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
如果觀察該容器的文件系統，
你應該會看到 `profiles/` 目錄已成功加載到 kubelet 的默認 seccomp 路徑中。
使用 `docker exec` 在 Pod 中運行命令：

<!--
```shell
# Change 6a96207fed4b to the container ID you saw from "docker ps"
docker exec -it 6a96207fed4b ls /var/lib/kubelet/seccomp/profiles
```
-->
```shell
# 將 6a96207fed4b 更改爲你從 “docker ps” 看到的容器 ID
docker exec -it 6a96207fed4b ls /var/lib/kubelet/seccomp/profiles
```

```
audit.json  fine-grained.json  violation.json
```

<!-- 
You have verified that these seccomp profiles are available to the kubelet
running within kind.
-->
你已驗證這些 seccomp 設定文件可用於在 kind 中運行的 kubelet。

<!--
## Create Pod that uses the container runtime default seccomp profile

Most container runtimes provide a sane set of default syscalls that are allowed
or not. You can adopt these defaults for your workload by setting the seccomp
type in the security context of a pod or container to `RuntimeDefault`.
-->
## 創建使用容器運行時默認 seccomp 設定文件的 Pod {#create-pod-that-uses-the-container-runtime-default-seccomp-profile}

大多數容器運行時都提供了一組合理的、默認被允許或默認被禁止的系統調用。
你可以通過將 Pod 或容器的安全上下文中的 seccomp 類型設置爲 `RuntimeDefault`
來爲你的工作負載採用這些默認值。

{{< note >}}
<!-- 
If you have the `seccompDefault` [configuration](/docs/reference/config-api/kubelet-config.v1beta1/)
enabled, then Pods use the `RuntimeDefault` seccomp profile whenever
no other seccomp profile is specified. Otherwise, the default is `Unconfined`.
-->
如果你已經啓用了 `seccompDefault` [設定](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)，
只要沒有指定其他 seccomp 設定文件，那麼 Pod 就會使用 `RuntimeDefault` seccomp 設定文件。
否則，默認值爲 `Unconfined`。
{{< /note >}}

<!-- 
Here's a manifest for a Pod that requests the `RuntimeDefault` seccomp profile
for all its containers:
-->
這是一個 Pod 的清單，它要求其所有容器使用 `RuntimeDefault` seccomp 設定文件：

{{% code_sample file="pods/security/seccomp/ga/default-pod.yaml" %}}

<!--
Create that Pod:
-->
創建此 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/default-pod.yaml
```

```shell
kubectl get pod default-pod
```

<!--
The Pod should be showing as having started successfully:
-->
此 Pod 應該顯示爲已成功啓動：

```
NAME        READY   STATUS    RESTARTS   AGE
default-pod 1/1     Running   0          20s
```

<!--
Delete the Pod before moving to the next section:
-->
在進入下一節之前先刪除 Pod：

```shell
kubectl delete pod default-pod --wait --now
```

<!-- 
## Create a Pod with a seccomp profile for syscall auditing

To start off, apply the `audit.json` profile, which will log all syscalls of the
process, to a new Pod.

Here's a manifest for that Pod:
-->
## 使用 seccomp 設定文件創建 Pod 以進行系統調用審計 {#create-a-pod-with-a-seccomp-profile-for-syscall-auditing}

首先，將 `audit.json` 設定文件應用到新的 Pod 上，該設定文件將記錄進程的所有系統調用。

這是該 Pod 的清單：

{{% code_sample file="pods/security/seccomp/ga/audit-pod.yaml" %}}

{{< note >}}
<!-- 
Older versions of Kubernetes allowed you to configure seccomp
behavior using {{< glossary_tooltip text="annotations" term_id="annotation" >}}.
Kubernetes {{< skew currentVersion >}} only supports using fields within
`.spec.securityContext` to configure seccomp, and this tutorial explains that
approach.
-->
舊版本的 Kubernetes 允許你使用{{< glossary_tooltip text="註解" term_id="annotation" >}}設定
seccomp 行爲。Kubernetes {{< skew currentVersion >}} 僅支持使用位於 `.spec.securityContext`
內的字段來設定 seccomp。本教程將闡述這個方法。
{{< /note >}}

<!--
Create the Pod in the cluster:
-->
在叢集中創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/audit-pod.yaml
```

<!-- 
This profile does not restrict any syscalls, so the Pod should start
successfully.
-->
此設定文件不限制任何系統調用，因此 Pod 應該成功啓動。

```shell
kubectl get pod audit-pod
```

```
NAME        READY   STATUS    RESTARTS   AGE
audit-pod   1/1     Running   0          30s
```

<!-- 
In order to be able to interact with this endpoint exposed by this
container, create a NodePort {{< glossary_tooltip text="Service" term_id="service" >}}
that allows access to the endpoint from inside the kind control plane container.
-->
爲了能夠與容器暴露的端點交互，
創建一個 NodePort 類型的 {{< glossary_tooltip text="Service" term_id="service" >}}，
允許從 kind 控制平面容器內部訪問端點。

```shell
kubectl expose pod audit-pod --type NodePort --port 5678
```

<!--
Check what port the Service has been assigned on the node.
-->
檢查 Service 在節點上分配的端口。

```shell
kubectl get service audit-pod
```

<!--
The output is similar to:
-->
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
現在，你可以使用 `curl` 從 kind 控制平面容器內部訪問該端點，位於該服務所公開的端口上。
使用 `docker exec` 在屬於該控制平面容器的容器中運行 `curl` 命令：

<!--
```shell
# Change 6a96207fed4b to the control plane container ID and 32373 to the port number you saw from "docker ps"
docker exec -it 6a96207fed4b curl localhost:32373
```
-->
```shell
# 將 6a96207fed4b 更改爲你從 “docker ps” 看到的控制平面容器 ID 和端口號 32373
docker exec -it 6a96207fed4b curl localhost:32373
```

```
just made some syscalls!
```

<!-- 
You can see that the process is running, but what syscalls did it actually make?
Because this Pod is running in a local cluster, you should be able to see those
in `/var/log/syslog` on your local system. Open up a new terminal window and `tail` the output for
calls from `http-echo`:
-->
你可以看到該進程正在運行，但它實際上進行了哪些系統調用？
因爲這個 Pod 在本地叢集中運行，你應該能夠在本地系統的 `/var/log/syslog` 中看到它們。
打開一個新的終端窗口並 `tail` 來自 `http-echo` 的調用的輸出：

<!--
```shell
# The log path on your computer might be different from "/var/log/syslog"
tail -f /var/log/syslog | grep 'http-echo'
```
-->
```shell
# 在你的計算機上，日誌路徑可能不是 "/var/log/syslog"
tail -f /var/log/syslog | grep 'http-echo'
```

<!-- 
You should already see some logs of syscalls made by `http-echo`, and if you run `curl` again inside
the control plane container you will see more output written to the log.

For example:
-->
你應該已經看到了一些由 `http-echo` 進行的系統調用的日誌，
如果你在控制平面容器中再次運行 `curl`，你會看到更多的輸出被寫入到日誌。

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

Delete the Service and the Pod before moving to the next section:
-->
通過查看每一行的 `syscall=` 條目，你可以開始瞭解 `http-echo` 進程所需的系統調用。
雖然這些不太可能包含它使用的所有系統調用，但它可以作爲此容器的 seccomp 設定文件的基礎。

在轉到下一節之前刪除該 Service 和 Pod：

```shell
kubectl delete service audit-pod --wait
kubectl delete pod audit-pod --wait --now
```

<!-- 
## Create a Pod with a seccomp profile that causes violation

For demonstration, apply a profile to the Pod that does not allow for any
syscalls.

The manifest for this demonstration is:
-->
## 使用導致違規的 seccomp 設定文件創建 Pod {#create-pod-with-a-seccomp-profile-that-causes-violation}

出於演示目的，將設定文件應用於不允許任何系統調用的 Pod 上。

此演示的清單是：

{{% code_sample file="pods/security/seccomp/ga/violation-pod.yaml" %}}

<!--
Attempt to create the Pod in the cluster:
-->
嘗試在叢集中創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/violation-pod.yaml
```

<!-- 
The Pod creates, but there is an issue.
If you check the status of the Pod, you should see that it failed to start.
-->
Pod 已創建，但存在問題。
如果你檢查 Pod 狀態，你應該看到它沒有啓動。

```shell
kubectl get pod violation-pod
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

Delete the Pod before moving to the next section:
-->
如上例所示，`http-echo` 進程需要相當多的系統調用。
這裏 seccomp 已通過設置 `"defaultAction": "SCMP_ACT_ERRNO"` 被指示爲在發生任何系統調用時報錯。
這是非常安全的，但消除了做任何有意義的事情的能力。
你真正想要的是隻給工作負載它們所需要的權限。

在進入下一節之前刪除該 Pod：

```shell
kubectl delete pod violation-pod --wait --now
```

<!--
## Create a Pod with a seccomp profile that only allows necessary syscalls

If you take a look at the `fine-grained.json` profile, you will notice some of the syscalls
seen in syslog of the first example where the profile set `"defaultAction":
"SCMP_ACT_LOG"`. Now the profile is setting `"defaultAction": "SCMP_ACT_ERRNO"`,
but explicitly allowing a set of syscalls in the `"action": "SCMP_ACT_ALLOW"`
block. Ideally, the container will run successfully and you will see no messages
sent to `syslog`.

The manifest for this example is:
-->
## 使用只允許必要的系統調用的 seccomp 設定文件創建 Pod {#create-pod-with-a-seccomp-profile-that-only-allows-necessary-syscalls}

如果你看一看 `fine-grained.json` 設定文件，
你會注意到第一個示例的 syslog 中看到的一些系統調用，
其中設定文件設置爲 `"defaultAction": "SCMP_ACT_LOG"`。
現在的設定文件設置 `"defaultAction": "SCMP_ACT_ERRNO"`，
但在 `"action": "SCMP_ACT_ALLOW"` 塊中明確允許一組系統調用。
理想情況下，容器將成功運行，並且你看到沒有消息發送到 `syslog`。

此示例的清單是：

{{% code_sample file="pods/security/seccomp/ga/fine-pod.yaml" %}}

<!--
Create the Pod in your cluster:
-->
在你的叢集中創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/fine-pod.yaml
```

```shell
kubectl get pod fine-pod
```

<!--
The Pod should be showing as having started successfully:
-->
此 Pod 應該顯示爲已成功啓動：

```
NAME        READY   STATUS    RESTARTS   AGE
fine-pod   1/1     Running   0          30s
```

<!-- 
Open up a new terminal window and use `tail` to monitor for log entries that
mention calls from `http-echo`:
-->
打開一個新的終端窗口並使用 `tail` 來監視提到來自 `http-echo` 的調用的日誌條目：

<!--
```shell
# The log path on your computer might be different from "/var/log/syslog"
tail -f /var/log/syslog | grep 'http-echo'
```
-->
```shell
# 你計算機上的日誌路徑可能與 “/var/log/syslog” 不同
tail -f /var/log/syslog | grep 'http-echo'
```

<!--
Next, expose the Pod with a NodePort Service:
-->
接着，使用 NodePort Service 公開 Pod：

```shell
kubectl expose pod fine-pod --type NodePort --port 5678
```

<!--
Check what port the Service has been assigned on the node:
-->
檢查節點上的 Service 分配了什麼端口：

```shell
kubectl get service fine-pod
```

<!--
The output is similar to:
-->
輸出類似於：

```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
fine-pod    NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

<!--
Use `curl` to access that endpoint from inside the kind control plane container:
-->
使用 `curl` 從 kind 控制平面容器內部訪問端點：

<!--
```shell
# Change 6a96207fed4b to the control plane container ID and 32373 to the port number you saw from "docker ps"
docker exec -it 6a96207fed4b curl localhost:32373
```
-->
```shell
# 將 6a96207fed4b 更改爲你從 “docker ps” 看到的控制平面容器 ID 和端口號 32373
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

Delete the Service and the Pod before moving to the next section:
-->
你應該在 `syslog` 中看不到任何輸出。
這是因爲設定文件允許所有必要的系統調用，並指定如果調用列表之外的系統調用應發生錯誤。
從安全角度來看，這是一種理想的情況，但需要在分析程序時付出一些努力。
如果有一種簡單的方法可以在不需要太多努力的情況下更接近這種安全性，那就太好了。

在進入下一節之前刪除該 Service 和 Pod：

```shell
kubectl delete service fine-pod --wait
kubectl delete pod fine-pod --wait --now
```

<!-- 
## Enable the use of `RuntimeDefault` as the default seccomp profile for all workloads
-->
## 啓用使用 `RuntimeDefault` 作爲所有工作負載的默認 seccomp 設定文件 {#enable-runtimedefault-as-default}

{{< feature-state state="stable" for_k8s_version="v1.27" >}}

<!-- 
To use seccomp profile defaulting, you must run the kubelet with the
`--seccomp-default`
[command line flag](/docs/reference/command-line-tools-reference/kubelet)
enabled for each node where you want to use it. 
-->
要採用爲 Seccomp（安全計算模式）設置默認設定文件這一行爲，你必須使用在想要啓用此行爲的每個節點上啓用
`--seccomp-default`
[命令列標誌](/zh-cn/docs/reference/command-line-tools-reference/kubelet)來運行 kubelet。

<!-- 
If enabled, the kubelet will use the `RuntimeDefault` seccomp profile by default, which is
defined by the container runtime, instead of using the `Unconfined` (seccomp disabled) mode.
The default profiles aim to provide a strong set
of security defaults while preserving the functionality of the workload. It is
possible that the default profiles differ between container runtimes and their
release versions, for example when comparing those from CRI-O and containerd.
-->
如果啓用，kubelet 將會默認使用 `RuntimeDefault` seccomp 設定文件，
（這一設定文件是由容器運行時定義的），而不是使用 `Unconfined`（禁用 seccomp）模式。
默認的設定文件旨在提供一組限制性較強且能保留工作負載功能的安全默認值。
不同容器運行時及其不同發佈版本之間的默認設定文件可能有所不同，
例如在比較來自 CRI-O 和 containerd 的設定文件時。

{{< note >}}
<!-- 
Enabling the feature will neither change the Kubernetes
`securityContext.seccompProfile` API field nor add the deprecated annotations of
the workload. This provides users the possibility to rollback anytime without
actually changing the workload configuration. Tools like
[`crictl inspect`](https://github.com/kubernetes-sigs/cri-tools) can be used to
verify which seccomp profile is being used by a container.
-->
啓用該功能既不會更改 Kubernetes `securityContext.seccompProfile` API 字段，
也不會添加已棄用的工作負載註解。
這樣使用者可以隨時回滾，而且無需實際更改工作負載設定。
[`crictl inspect`](https://github.com/kubernetes-sigs/cri-tools)
之類的工具可用於檢查容器正在使用哪個 seccomp 設定文件。
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
與其他工作負載相比，某些工作負載可能需要更少的系統調用限制。
這意味着即使使用 `RuntimeDefault` 設定文件，它們也可能在運行時失敗。
要應對此類故障，你可以：

- 顯式地以 `Unconfined` 模式運行工作負載。
- 禁用節點的 `SeccompDefault` 特性。同時，確保工作負載被調度到禁用該特性的節點上。
- 爲工作負載創建自定義 seccomp 設定文件。

<!-- 
If you were introducing this feature into production-like cluster, the Kubernetes project
recommends that you enable this feature gate on a subset of your nodes and then
test workload execution before rolling the change out cluster-wide.

You can find more detailed information about a possible upgrade and downgrade strategy
in the related Kubernetes Enhancement Proposal (KEP):
[Enable seccomp by default](https://github.com/kubernetes/enhancements/tree/9a124fd29d1f9ddf2ff455c49a630e3181992c25/keps/sig-node/2413-seccomp-by-default#upgrade--downgrade-strategy).
-->
如果你將此特性引入到類似的生產叢集中，
Kubernetes 項目建議你在部分節點上啓用此特性門控，
然後在整個叢集範圍內推出更改之前，測試工作負載執行情況。

你可以在相關的 Kubernetes 增強提案（KEP）
中找到可能的升級和降級策略的更詳細信息:
[默認啓用 Seccomp](https://github.com/kubernetes/enhancements/tree/9a124fd29d1f9ddf2ff455c49a630e3181992c25/keps/sig-node/2413-seccomp-by-default#upgrade--downgrade-strategy)。

<!--
Kubernetes {{< skew currentVersion >}} lets you configure the seccomp profile
that applies when the spec for a Pod doesn't define a specific seccomp profile.
However, you still need to enable this defaulting for each node where you would
like to use it.
-->
Kubernetes {{< skew currentVersion >}} 允許你設定 Seccomp 設定文件，
當 Pod 的規約未定義特定的 Seccomp 設定文件時應用該設定文件。
但是，你仍然需要爲合適的節點啓用這種設置默認設定的能力。

<!--
If you are running a Kubernetes {{< skew currentVersion >}} cluster and want to
enable the feature, either run the kubelet with the `--seccomp-default` command
line flag, or enable it through the [kubelet configuration
file](/docs/tasks/administer-cluster/kubelet-config-file/). To enable the
feature gate in [kind](https://kind.sigs.k8s.io), ensure that `kind` provides
the minimum required Kubernetes version and enables the `SeccompDefault` feature
[in the kind configuration](https://kind.sigs.k8s.io/docs/user/quick-start/#enable-feature-gates-in-your-cluster):
-->
如果你正在運行 Kubernetes {{< skew currentVersion >}}
叢集並希望啓用該特性，請使用 `--seccomp-default` 命令列參數運行 kubelet，
或通過 [kubelet 設定文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)啓用。

要在 [kind](https://kind.sigs.k8s.io) 啓用特性門控，
請確保 `kind` 提供所需的最低 Kubernetes 版本，
並[在 kind 設定中](https://kind.sigs.k8s.io/docs/user/quick-start/#enable-feature-gates-in-your-cluster)
啓用 `SeccompDefault` 特性：

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    image: kindest/node:v1.28.0@sha256:9f3ff58f19dcf1a0611d11e8ac989fdb30a28f40f236f59f0bea31fb956ccf5c
    kubeadmConfigPatches:
      - |
        kind: JoinConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            seccomp-default: "true"
  - role: worker
    image: kindest/node:v1.28.0@sha256:9f3ff58f19dcf1a0611d11e8ac989fdb30a28f40f236f59f0bea31fb956ccf5c
    kubeadmConfigPatches:
      - |
        kind: JoinConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            seccomp-default: "true"
```

<!--
If the cluster is ready, then running a pod:
-->
如果叢集已就緒，則運行一個 Pod：

```shell
kubectl run --rm -it --restart=Never --image=alpine alpine -- sh
```

<!-- 
Should now have the default seccomp profile attached. This can be verified by
using `docker exec` to run `crictl inspect` for the container on the kind
worker:
-->
現在默認的 seccomp 設定文件應該已經生效。
這可以通過使用 `docker exec` 爲 kind 上的容器運行 `crictl inspect` 來驗證：

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

## {{% heading "whatsnext" %}}

<!-- 
You can learn more about Linux seccomp:

* [A seccomp Overview](https://lwn.net/Articles/656307/)
* [Seccomp Security Profiles for Docker](https://docs.docker.com/engine/security/seccomp/)
-->
你可以瞭解有關 Linux seccomp 的更多信息：

* [seccomp 概述](https://lwn.net/Articles/656307/)
* [Docker 的 Seccomp 安全設定文件](https://docs.docker.com/engine/security/seccomp/)
