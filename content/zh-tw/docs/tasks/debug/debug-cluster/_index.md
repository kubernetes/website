---
title: 叢集故障排查
description: 除錯常見的叢集問題。
weight: 20
no_list: true
---
<!--
reviewers:
- davidopp
title: "Troubleshooting Clusters"
description: Debugging common cluster issues.
weight: 20
no_list: true
-->

<!-- overview -->

<!--
This doc is about cluster troubleshooting; we assume you have already ruled out your application as the root cause of the
problem you are experiencing. See
the [application troubleshooting guide](/docs/tasks/debug/debug-application/) for tips on application debugging.
You may also visit the [troubleshooting overview document](/docs/tasks/debug/) for more information.
-->
本篇文件是介紹叢集故障排查的；我們假設對於你碰到的問題，你已經排除了是由應用程式造成的。
對於應用的除錯，請參閱[應用故障排查指南](/zh-cn/docs/tasks/debug/debug-application/)。
你也可以訪問[故障排查](/zh-cn/docs/tasks/debug/)來獲取更多的資訊。

<!-- body -->

<!--
## Listing your cluster

The first thing to debug in your cluster is if your nodes are all registered correctly.

Run the following command:
-->
## 列舉叢集節點 {#listing-your-cluster}

除錯的第一步是檢視所有的節點是否都已正確註冊。

執行以下命令：

```shell
kubectl get nodes
```

<!--
And verify that all of the nodes you expect to see are present and that they are all in the `Ready` state.

To get detailed information about the overall health of your cluster, you can run:
-->
驗證你所希望看見的所有節點都能夠顯示出來，並且都處於 `Ready` 狀態。

為了瞭解你的叢集的總體健康狀況詳情，你可以執行：

```shell
kubectl cluster-info dump
```

<!-- 
### Example: debugging a down/unreachable node

Sometimes when debugging it can be useful to look at the status of a node -- for example, because you've noticed strange behavior of a Pod that's running on the node, or to find out why a Pod won't schedule onto the node. As with Pods, you can use `kubectl describe node` and `kubectl get node -o yaml` to retrieve detailed information about nodes. For example, here's what you'll see if a node is down (disconnected from the network, or kubelet dies and won't restart, etc.). Notice the events that show the node is NotReady, and also notice that the pods are no longer running (they are evicted after five minutes of NotReady status).
-->
### 示例：除錯關閉/無法訪問的節點 {#example-debugging-a-down-unreachable-node}

有時在除錯時檢視節點的狀態很有用——例如，因為你注意到在節點上執行的 Pod 的奇怪行為，
或者找出為什麼 Pod 不會排程到節點上。與 Pod 一樣，你可以使用 `kubectl describe node`
和 `kubectl get node -o yaml` 來檢索有關節點的詳細資訊。
例如，如果節點關閉（與網路斷開連線，或者 kubelet 程序掛起並且不會重新啟動等），
你將看到以下內容。請注意顯示節點為 NotReady 的事件，並注意 Pod 不再執行（它們在 NotReady 狀態五分鐘後被驅逐）。

```shell
kubectl get nodes
```

```none
NAME                     STATUS       ROLES     AGE     VERSION
kube-worker-1            NotReady     <none>    1h      v1.23.3
kubernetes-node-bols     Ready        <none>    1h      v1.23.3
kubernetes-node-st6x     Ready        <none>    1h      v1.23.3
kubernetes-node-unaj     Ready        <none>    1h      v1.23.3
```

```shell
kubectl describe node kube-worker-1
```

```none
Name:               kube-worker-1
Roles:              <none>
Labels:             beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/os=linux
                    kubernetes.io/arch=amd64
                    kubernetes.io/hostname=kube-worker-1
                    kubernetes.io/os=linux
Annotations:        kubeadm.alpha.kubernetes.io/cri-socket: /run/containerd/containerd.sock
                    node.alpha.kubernetes.io/ttl: 0
                    volumes.kubernetes.io/controller-managed-attach-detach: true
CreationTimestamp:  Thu, 17 Feb 2022 16:46:30 -0500
Taints:             node.kubernetes.io/unreachable:NoExecute
                    node.kubernetes.io/unreachable:NoSchedule
Unschedulable:      false
Lease:
  HolderIdentity:  kube-worker-1
  AcquireTime:     <unset>
  RenewTime:       Thu, 17 Feb 2022 17:13:09 -0500
Conditions:
  Type                 Status    LastHeartbeatTime                 LastTransitionTime                Reason              Message
  ----                 ------    -----------------                 ------------------                ------              -------
  NetworkUnavailable   False     Thu, 17 Feb 2022 17:09:13 -0500   Thu, 17 Feb 2022 17:09:13 -0500   WeaveIsUp           Weave pod has set this
  MemoryPressure       Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  DiskPressure         Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  PIDPressure          Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  Ready                Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
Addresses:
  InternalIP:  192.168.0.113
  Hostname:    kube-worker-1
Capacity:
  cpu:                2
  ephemeral-storage:  15372232Ki
  hugepages-2Mi:      0
  memory:             2025188Ki
  pods:               110
Allocatable:
  cpu:                2
  ephemeral-storage:  14167048988
  hugepages-2Mi:      0
  memory:             1922788Ki
  pods:               110
System Info:
  Machine ID:                 9384e2927f544209b5d7b67474bbf92b
  System UUID:                aa829ca9-73d7-064d-9019-df07404ad448
  Boot ID:                    5a295a03-aaca-4340-af20-1327fa5dab5c
  Kernel Version:             5.13.0-28-generic
  OS Image:                   Ubuntu 21.10
  Operating System:           linux
  Architecture:               amd64
  Container Runtime Version:  containerd://1.5.9
  Kubelet Version:            v1.23.3
  Kube-Proxy Version:         v1.23.3
Non-terminated Pods:          (4 in total)
  Namespace                   Name                                 CPU Requests  CPU Limits  Memory Requests  Memory Limits  Age
  ---------                   ----                                 ------------  ----------  ---------------  -------------  ---
  default                     nginx-deployment-67d4bdd6f5-cx2nz    500m (25%)    500m (25%)  128Mi (6%)       128Mi (6%)     23m
  default                     nginx-deployment-67d4bdd6f5-w6kd7    500m (25%)    500m (25%)  128Mi (6%)       128Mi (6%)     23m
  kube-system                 kube-proxy-dnxbz                     0 (0%)        0 (0%)      0 (0%)           0 (0%)         28m
  kube-system                 weave-net-gjxxp                      100m (5%)     0 (0%)      200Mi (10%)      0 (0%)         28m
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                1100m (55%)  1 (50%)
  memory             456Mi (24%)  256Mi (13%)
  ephemeral-storage  0 (0%)       0 (0%)
  hugepages-2Mi      0 (0%)       0 (0%)
Events:
...
```

```shell
kubectl get node kube-worker-1 -o yaml
```

```yaml
apiVersion: v1
kind: Node
metadata:
  annotations:
    kubeadm.alpha.kubernetes.io/cri-socket: /run/containerd/containerd.sock
    node.alpha.kubernetes.io/ttl: "0"
    volumes.kubernetes.io/controller-managed-attach-detach: "true"
  creationTimestamp: "2022-02-17T21:46:30Z"
  labels:
    beta.kubernetes.io/arch: amd64
    beta.kubernetes.io/os: linux
    kubernetes.io/arch: amd64
    kubernetes.io/hostname: kube-worker-1
    kubernetes.io/os: linux
  name: kube-worker-1
  resourceVersion: "4026"
  uid: 98efe7cb-2978-4a0b-842a-1a7bf12c05f8
spec: {}
status:
  addresses:
  - address: 192.168.0.113
    type: InternalIP
  - address: kube-worker-1
    type: Hostname
  allocatable:
    cpu: "2"
    ephemeral-storage: "14167048988"
    hugepages-2Mi: "0"
    memory: 1922788Ki
    pods: "110"
  capacity:
    cpu: "2"
    ephemeral-storage: 15372232Ki
    hugepages-2Mi: "0"
    memory: 2025188Ki
    pods: "110"
  conditions:
  - lastHeartbeatTime: "2022-02-17T22:20:32Z"
    lastTransitionTime: "2022-02-17T22:20:32Z"
    message: Weave pod has set this
    reason: WeaveIsUp
    status: "False"
    type: NetworkUnavailable
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has sufficient memory available
    reason: KubeletHasSufficientMemory
    status: "False"
    type: MemoryPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has no disk pressure
    reason: KubeletHasNoDiskPressure
    status: "False"
    type: DiskPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has sufficient PID available
    reason: KubeletHasSufficientPID
    status: "False"
    type: PIDPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:15:15Z"
    message: kubelet is posting ready status. AppArmor enabled
    reason: KubeletReady
    status: "True"
    type: Ready
  daemonEndpoints:
    kubeletEndpoint:
      Port: 10250
  nodeInfo:
    architecture: amd64
    bootID: 22333234-7a6b-44d4-9ce1-67e31dc7e369
    containerRuntimeVersion: containerd://1.5.9
    kernelVersion: 5.13.0-28-generic
    kubeProxyVersion: v1.23.3
    kubeletVersion: v1.23.3
    machineID: 9384e2927f544209b5d7b67474bbf92b
    operatingSystem: linux
    osImage: Ubuntu 21.10
    systemUUID: aa829ca9-73d7-064d-9019-df07404ad448
```

<!--
## Looking at logs

For now, digging deeper into the cluster requires logging into the relevant machines.  Here are the locations
of the relevant log files.  On systemd-based systems, you may need to use `journalctl` instead of examining log files.
-->
## 檢視日誌 {#looking-at-logs}

目前，深入挖掘叢集需要登入相關機器。以下是相關日誌檔案的位置。
在基於 systemd 的系統上，你可能需要使用 `journalctl` 而不是檢查日誌檔案。

<!--
### Control Plane nodes

   * `/var/log/kube-apiserver.log` - API Server, responsible for serving the API
   * `/var/log/kube-scheduler.log` - Scheduler, responsible for making scheduling decisions
   * `/var/log/kube-controller-manager.log` - a component that runs most Kubernetes built-in {{<glossary_tooltip text="controllers" term_id="controller">}}, with the notable exception of scheduling (the kube-scheduler handles scheduling).
-->
### 控制平面節點 {#control-plane-nodes}

   * `/var/log/kube-apiserver.log` —— API 伺服器 API
   * `/var/log/kube-scheduler.log` —— 排程器，負責制定排程決策
   * `/var/log/kube-controller-manager.log` —— 執行大多數 Kubernetes
     內建{{<glossary_tooltip text="控制器" term_id="controller">}}的元件，除了排程（kube-scheduler 處理排程）。

<!--
### Worker Nodes

   * `/var/log/kubelet.log` - logs from the kubelet, responsible for running containers on the node
   * `/var/log/kube-proxy.log` - logs from `kube-proxy`, which is responsible for directing traffic to Service endpoints
-->

### 工作節點 {#worker-nodes}

   * `/var/log/kubelet.log` —— 來自 `kubelet` 的日誌，負責在節點執行容器
   * `/var/log/kube-proxy.log` —— 來自 `kube-proxy` 的日誌，負責將流量轉發到服務端點

<!-- 
## Cluster failure modes

This is an incomplete list of things that could go wrong, and how to adjust your cluster setup to mitigate the problems.
-->
## 叢集故障模式 {#cluster-failure-modes}

這是可能出錯的事情的不完整列表，以及如何調整叢集設定以緩解問題。

<!-- 
### Contributing causes

  - VM(s) shutdown
  - Network partition within cluster, or between cluster and users
  - Crashes in Kubernetes software
  - Data loss or unavailability of persistent storage (e.g. GCE PD or AWS EBS volume)
  - Operator error, for example misconfigured Kubernetes software or application software
-->
### 造成原因 {#contributing-causes}

   - 虛擬機器關閉
   - 叢集內或叢集與使用者之間的網路分割槽
   - Kubernetes 軟體崩潰
   - 持久儲存（例如 GCE PD 或 AWS EBS 卷）的資料丟失或不可用
   - 操作員錯誤，例如配置錯誤的 Kubernetes 軟體或應用程式軟體

<!--
### Specific scenarios

  - API server VM shutdown or apiserver crashing
    - Results
      - unable to stop, update, or start new pods, services, replication controller
      - existing pods and services should continue to work normally, unless they depend on the Kubernetes API
  - API server backing storage lost
    - Results
      - the kube-apiserver component fails to start successfully and become healthy
      - kubelets will not be able to reach it but will continue to run the same pods and provide the same service proxying
      - manual recovery or recreation of apiserver state necessary before apiserver is restarted
-->
### 具體情況 {#specific-scenarios}

- API 伺服器所在的 VM 關機或者 API 伺服器崩潰
  - 結果
    - 不能停止、更新或者啟動新的 Pod、服務或副本控制器
    - 現有的 Pod 和服務在不依賴 Kubernetes API 的情況下應該能繼續正常工作
- API 伺服器的後端儲存丟失
  - 結果
    - kube-apiserver 元件未能成功啟動並變健康
    - kubelet 將不能訪問 API 伺服器，但是能夠繼續執行之前的 Pod 和提供相同的服務代理
    - 在 API 伺服器重啟之前，需要手動恢復或者重建 API 伺服器的狀態
<!--
  - Supporting services (node controller, replication controller manager, scheduler, etc) VM shutdown or crashes
    - currently those are colocated with the apiserver, and their unavailability has similar consequences as apiserver
    - in future, these will be replicated as well and may not be co-located
    - they do not have their own persistent state
  - Individual node (VM or physical machine) shuts down
    - Results
      - pods on that Node stop running
  - Network partition
    - Results
      - partition A thinks the nodes in partition B are down; partition B thinks the apiserver is down. (Assuming the master VM ends up in partition A.)
-->
- Kubernetes 服務元件（節點控制器、副本控制器管理器、排程器等）所在的 VM 關機或者崩潰
  - 當前，這些控制器是和 API 伺服器在一起執行的，它們不可用的現象是與 API 伺服器類似的
  - 將來，這些控制器也會複製為多份，並且可能不在運行於同一節點上
  - 它們沒有自己的持久狀態
- 單個節點（VM 或者物理機）關機
  - 結果
    - 此節點上的所有 Pod 都停止執行
- 網路分裂
  - 結果
    - 分割槽 A 認為分割槽 B 中所有的節點都已宕機；分割槽 B 認為 API 伺服器宕機
      （假定主控節點所在的 VM 位於分割槽 A 內）。
<!--
  - Kubelet software fault
    - Results
      - crashing kubelet cannot start new pods on the node
      - kubelet might delete the pods or not
      - node marked unhealthy
      - replication controllers start new pods elsewhere
  - Cluster operator error
    - Results
      - loss of pods, services, etc
      - lost of apiserver backing store
      - users unable to read API
      - etc.
-->
- kubelet 軟體故障
  - 結果
    - 崩潰的 kubelet 就不能在其所在的節點上啟動新的 Pod
    - kubelet 可能刪掉 Pod 或者不刪
    - 節點被標識為非健康態
    - 副本控制器會在其它的節點上啟動新的 Pod
- 叢集操作錯誤
  - 結果
    - 丟失 Pod 或服務等等
    - 丟失 API 伺服器的後端儲存
    - 使用者無法讀取API
    - 等等

<!--
### Mitigations:

- Action: Use IaaS provider's automatic VM restarting feature for IaaS VMs
  - Mitigates: Apiserver VM shutdown or apiserver crashing
  - Mitigates: Supporting services VM shutdown or crashes

- Action: Use IaaS providers reliable storage (e.g. GCE PD or AWS EBS volume) for VMs with apiserver+etcd
  - Mitigates: Apiserver backing storage lost

- Action: Use [high-availability](/docs/setup/production-environment/tools/kubeadm/high-availability/) configuration
  - Mitigates: Control plane node shutdown or control plane components (scheduler, API server, controller-manager) crashing
    - Will tolerate one or more simultaneous node or component failures
  - Mitigates: API server backing storage (i.e., etcd's data directory) lost
    - Assumes HA (highly-available) etcd configuration
-->
### 緩解措施 {#mitigations}

- 措施：對於 IaaS 上的 VM，使用 IaaS 的自動 VM 重啟功能
  - 緩解：API 伺服器 VM 關機或 API 伺服器崩潰
  - 緩解：Kubernetes 服務元件所在的 VM 關機或崩潰

- 措施: 對於執行 API 伺服器和 etcd 的 VM，使用 IaaS 提供的可靠的儲存（例如 GCE PD 或者 AWS EBS 卷）
  - 緩解：API 伺服器後端儲存的丟失

- 措施：使用[高可用性](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)的配置
  - 緩解：主控節點 VM 關機或者主控節點元件（排程器、API 伺服器、控制器管理器）崩饋
    - 將容許一個或多個節點或元件同時出現故障
  - 緩解：API 伺服器後端儲存（例如 etcd 的資料目錄）丟失
    - 假定你使用了高可用的 etcd 配置

<!--
- Action: Snapshot apiserver PDs/EBS-volumes periodically
  - Mitigates: Apiserver backing storage lost
  - Mitigates: Some cases of operator error
  - Mitigates: Some cases of Kubernetes software fault

- Action: use replication controller and services in front of pods
  - Mitigates: Node shutdown
  - Mitigates: Kubelet software fault

- Action: applications (containers) designed to tolerate unexpected restarts
  - Mitigates: Node shutdown
  - Mitigates: Kubelet software fault
-->
- 措施：定期對 API 伺服器的 PDs/EBS 卷執行快照操作
  - 緩解：API 伺服器後端儲存丟失
  - 緩解：一些操作錯誤的場景
  - 緩解：一些 Kubernetes 軟體本身故障的場景

- 措施：在 Pod 的前面使用副本控制器或服務
  - 緩解：節點關機
  - 緩解：kubelet 軟體故障

- 措施：應用（容器）設計成容許異常重啟
  - 緩解：節點關機
  - 緩解：kubelet 軟體故障

## {{% heading "whatsnext" %}}

<!-- 
* Learn about the metrics available in the [Resource Metrics Pipeline](resource-metrics-pipeline)
* Discover additional tools for [monitoring resource usage](resource-usage-monitoring)
* Use Node Problem Detector to [monitor node health](monitor-node-health)
* Use `crictl` to [debug Kubernetes nodes](crictl)
* Get more information about [Kubernetes auditing](audit)
* Use `telepresence` to [develop and debug services locally](local-debugging)
-->
* 瞭解[資源指標管道](resource-metrics-pipeline)中可用的指標
* 發現用於[監控資源使用](resource-usage-monitoring)的其他工具
* 使用節點問題檢測器[監控節點健康](monitor-node-health)
* 使用 `crictl` 來[除錯 Kubernetes 節點](crictl)
* 獲取更多關於 [Kubernetes 審計](audit)的資訊
* 使用 `telepresence` [本地開發和除錯服務](local-debugging)