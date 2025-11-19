---
layout: blog
title: 'Kubernetes 1.28：節點 podresources API 正式發佈'
date: 2023-08-23
slug: kubelet-podresources-api-GA
---
<!--
layout: blog
title: 'Kubernetes 1.28: Node podresources API Graduates to GA'
date: 2023-08-23
slug: kubelet-podresources-api-GA
-->

<!--
**Author:**
Francesco Romani (Red Hat)
-->
**作者**：Francesco Romani (Red Hat)

**譯者**：Wilson Wu (DaoCloud)

<!--
The podresources API is an API served by the kubelet locally on the node, which exposes the compute resources exclusively allocated to containers. With the release of Kubernetes 1.28, that API is now Generally Available.
-->
podresources API 是由 kubelet 提供的節點本地 API，它用於公開專門分配給容器的計算資源。
隨着 Kubernetes 1.28 的發佈，該 API 現已正式發佈。

<!--
## What problem does it solve?
-->
## 它解決了什麼問題？ {#what-problem-does-it-solve}

<!--
The kubelet can allocate exclusive resources to containers, like [CPUs, granting exclusive access to full cores](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/) or [memory, either regions or hugepages](https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/). Workloads which require high performance, or low latency (or both) leverage these features. The kubelet also can assign [devices to containers](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/). Collectively, these features which enable exclusive assignments are known as "resource managers".
-->
kubelet 可以向容器分配獨佔資源，例如
[CPU，授予對完整核心的獨佔訪問權限](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)或[內存，包括內存區域或巨頁](/zh-cn/docs/tasks/administer-cluster/memory-manager/)。
需要高性能或低延遲（或者兩者都需要）的工作負載可以利用這些特性。
kubelet 還可以將[設備分配給容器](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)。
總的來說，這些支持獨佔分配的特性被稱爲“資源管理器（Resource Managers）”。

<!--
Without an API like podresources, the only possible option to learn about resource assignment was to read the state files the resource managers use. While done out of necessity, the problem with this approach is the path and the format of these file are both internal implementation details. Albeit very stable, the project reserves the right to change them freely. Consuming the content of the state files is thus fragile and unsupported, and projects doing this are recommended to consider moving to podresources API or to other supported APIs.
-->
如果沒有像 podresources 這樣的 API，瞭解資源分配的唯一可能選擇就是讀取資源管理器使用的狀態文件。
雖然這樣做是出於必要，但這種方法的問題是這些文件的路徑和格式都是內部實現細節。
儘管非常穩定，但項目保留自由更改它們的權利。因此，使用狀態文件內容的做法是不可靠的且不受支持的，
建議這樣做的項目考慮遷移到使用 podresources API 或其他受支持的 API。

<!--
## Overview of the API
-->
## API 概述 {#overview-of-the-api}

<!--
The podresources API was [initially proposed to enable device monitoring](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources). In order to enable monitoring agents, a key prerequisite is to enable introspection of device assignment, which is performed by the kubelet. Serving this purpose was the initial goal of the API. The first iteration of the API only had a single function implemented, `List`, to return information about the assignment of devices to containers. The API is used by [multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni) and by [GPU monitoring tools](https://github.com/NVIDIA/dcgm-exporter).
-->
podresources API [最初被提出是爲了實現設備監控](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)。
爲了支持監控代理，一個關鍵的先決條件是啓用由 kubelet 執行的設備分配自省（Introspection）。
API 的最初目標就是服務於此目的。API 的第一次迭代僅實現了一個函數 `List`，用於返回有關設備分配給容器的信息。
該 API 由 [multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni)
和 [GPU 監控工具](https://github.com/NVIDIA/dcgm-exporter)使用。

<!--
Since its inception, the podresources API increased its scope to cover other resource managers than device manager. Starting from Kubernetes 1.20, the `List` API reports also CPU cores and memory regions (including hugepages); the API also reports the NUMA locality of the devices, while the locality of CPUs and memory can be inferred from the system.
-->
自推出以來，podresources API 擴大了其範圍，涵蓋了設備管理器之外的其他資源管理器。
從 Kubernetes 1.20 開始，`List` API 還報告 CPU 核心和內存區域（包括巨頁）；
在能夠從系統中推斷 CPU 和內存的位置時，API 還報告設備的 NUMA 位置。

<!--
In Kubernetes 1.21, the API [gained](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2403-pod-resources-allocatable-resources/README.md) the `GetAllocatableResources` function. This newer API complements the existing `List` API and enables monitoring agents to determine the unallocated resources, thus enabling new features built on top of the podresources API like a [NUMA-aware scheduler plugin](https://github.com/kubernetes-sigs/scheduler-plugins/blob/master/pkg/noderesourcetopology/README.md).
-->
在 Kubernetes 1.21 中，API [增加了](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2403-pod-resources-allocatable-resources/README.md)
`GetAllocatableResources` 函數。這個較新的 API 補充了現有的 `List` API，
並使監控代理能夠辨識尚未分配的資源，從而支持在 podresources API 之上構建新的特性，
例如 [NUMA 感知的調度器插件](https://github.com/kubernetes-sigs/scheduler-plugins/blob/master/pkg/noderesourcetopology/README.md)。

<!--
Finally, in Kubernetes 1.27, another function, `Get` was introduced to be more friendly with CNI meta-plugins, to make it simpler to access resources allocated to a specific pod, rather than having to filter through resources for all pods on the node. The `Get` function is currently alpha level.
-->
最後，在 Kubernetes 1.27 中，引入了另一個函數 `Get`，以便對 CNI 元插件（Meta-Plugins）更加友好，
簡化對已分配給特定 Pod 的資源的訪問，而不必過濾節點上所有 Pod 的資源。`Get` 函數目前處於 Alpha 級別。

<!--
## Consuming the API
-->
## 使用 API {#consuming-the-api}

<!--
The podresources API is served by the kubelet locally, on the same node on which is running. On unix flavors, the endpoint is served over a unix domain socket; the default path is `/var/lib/kubelet/pod-resources/kubelet.sock`. On windows, the endpoint is served over a named pipe; the default path is `npipe://\\.\pipe\kubelet-pod-resources`.
-->
podresources API 由本地 kubelet 提供，位於 kubelet 運行所在的同一節點上。
在 Unix 風格的系統上，通過 Unix 域套接字提供端點；默認路徑是 `/var/lib/kubelet/pod-resources/kubelet.sock`。
在 Windows 上，通過命名管道提供端點；默認路徑是 `npipe://\\.\pipe\kubelet-pod-resources`。

<!--
In order for the containerized monitoring application consume the API, the socket should be mounted inside the container. A good practice is to mount the directory on which the podresources socket endpoint sits rather than the socket directly. This will ensure that after a kubelet restart, the containerized monitor application will be able to re-connect to the socket.
-->
爲了讓容器化監控應用使用 API，套接字應掛載到容器內。
一個好的做法是掛載 podresources 套接字端點所在的目錄，而不是直接掛載套接字。
這種做法將確保 kubelet 重新啓動後，容器化監視器應用能夠重新連接到套接字。

<!--
An example manifest for a hypothetical monitoring agent consuming the podresources API and deployed as a DaemonSet could look like:
-->
在下面的 DaemonSet 示例清單中，包含一個假想的使用 podresources API 的監控代理：

<!--
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: podresources-monitoring-app
  namespace: monitoring
spec:
  selector:
    matchLabels:
      name: podresources-monitoring
  template:
    metadata:
      labels:
        name: podresources-monitoring
    spec:
      containers:
      - args:
        - --podresources-socket=unix:///host-podresources/kubelet.sock
        command:
        - /bin/podresources-monitor
        image: podresources-monitor:latest  # just for an example
        volumeMounts:
        - mountPath: /host-podresources
          name: host-podresources
      serviceAccountName: podresources-monitor
      volumes:
      - hostPath:
          path: /var/lib/kubelet/pod-resources
          type: Directory
        name: host-podresources
```
-->
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: podresources-monitoring-app
  namespace: monitoring
spec:
  selector:
    matchLabels:
      name: podresources-monitoring
  template:
    metadata:
      labels:
        name: podresources-monitoring
    spec:
      containers:
      - args:
        - --podresources-socket=unix:///host-podresources/kubelet.sock
        command:
        - /bin/podresources-monitor
        image: podresources-monitor:latest  # 僅作爲樣例
        volumeMounts:
        - mountPath: /host-podresources
          name: host-podresources
      serviceAccountName: podresources-monitor
      volumes:
      - hostPath:
          path: /var/lib/kubelet/pod-resources
          type: Directory
        name: host-podresources
```

<!--
I hope you find it straightforward to consume the podresources API  programmatically. The kubelet API package provides the protocol file and the go type definitions; however, a client package is not yet available from the project, and the existing code should not be used directly. The [recommended](https://github.com/kubernetes/kubernetes/blob/v1.28.0-rc.0/pkg/kubelet/apis/podresources/client.go#L32) approach is to reimplement the client in your projects, copying and pasting the related functions like for example the multus project is [doing](https://github.com/k8snetworkplumbingwg/multus-cni/blob/v4.0.2/pkg/kubeletclient/kubeletclient.go).
-->
我希望你發現以編程方式使用 podresources API 很簡單。kubelet API包提供了協議文件和 Go 類型定義；
但是，該項目尚未提供客戶端包，並且你也不應直接使用現有代碼。
[推薦](https://github.com/kubernetes/kubernetes/blob/v1.28.0-rc.0/pkg/kubelet/apis/podresources/client.go#L32)方法是在你自己的項目中重新實現客戶端，
複製並粘貼相關功能，就像 multus 項目[所做的那樣](https://github.com/k8snetworkplumbingwg/multus-cni/blob/v4.0.2/pkg/kubeletclient/kubeletclient.go)。

<!--
When operating the containerized monitoring application consuming the podresources API, few points are worth highlighting to prevent "gotcha" moments:
-->
在操作使用 podresources API 的容器化監控應用程序時，有幾點值得強調，以防止出現“陷阱”：

<!--
- Even though the API only exposes data, and doesn't allow by design clients to mutate the kubelet state, the gRPC request/response model requires read-write access to the podresources API socket. In other words, it is not possible to limit the container mount to `ReadOnly`.
- Multiple clients are allowed to connect to the podresources socket and consume the API, since it is stateless.
- The kubelet has [built-in rate limits](https://github.com/kubernetes/kubernetes/pull/116459) to mitigate local Denial of Service attacks from misbehaving or malicious consumers. The consumers of the API must tolerate rate limit errors returned by the server. The rate limit is currently hardcoded and global, so misbehaving clients can consume all the quota and potentially starve correctly behaving clients.
-->
- 儘管 API 僅公開數據，並且設計上不允許客戶端改變 kubelet 狀態，
  但 gRPC 請求/響應模型要求能對 podresources API 套接字進行讀寫訪問。
  換句話說，將容器掛載限制爲 `ReadOnly` 是不可能的。
- 讓多個客戶端連接到 podresources 套接字並使用此 API 是允許的，因爲 API 是無狀態的。
- kubelet 具有[內置限速機制](https://github.com/kubernetes/kubernetes/pull/116459)，
  用以緩解來自行爲不當或惡意用戶的本地拒絕服務攻擊。API 的使用者必須容忍服務器返回的速率限制錯誤。
  速率限制目前是硬編碼的且作用於全局的，因此行爲不當的客戶端可能會耗光所有配額，進而導致行爲正確的客戶端捱餓。

<!--
## Future enhancements
-->
## 未來的增強 {#future-enhancements}

<!--
For historical reasons, the podresources API has a less precise specification than typical kubernetes APIs (such as the Kubernetes HTTP API, or the container runtime interface). This leads to unspecified behavior in corner cases. An [effort](https://issues.k8s.io/119423) is ongoing to rectify this state and to have a more precise specification.
-->
由於歷史原因，podresources API 的規範不如典型的 kubernetes API（例如 Kubernetes HTTP API 或容器運行時接口）精確。
這會導致在極端情況下出現未指定的行爲。我們正在[努力](https://issues.k8s.io/119423)糾正這種狀態並制定更精確的規範。

<!--
The [Dynamic Resource Allocation (DRA)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3063-dynamic-resource-allocation) infrastructure is a major overhaul of the resource management. The [integration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3695-pod-resources-for-dra) with the podresources API is already ongoing.
-->
[動態資源分配（DRA）](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3063-dynamic-resource-allocation)基礎設施是對資源管理的重大改革。
與 podresources API 的[集成](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3695-pod-resources-for-dra)已經在進行中。

<!--
An [effort](https://issues.k8s.io/119817) is ongoing to recommend or create a reference client package ready to be consumed.
-->
我們正在[努力](https://issues.k8s.io/119817)推薦或創建可供使用的參考客戶端包。

<!--
## Getting involved
-->
## 參與其中 {#getting-involved}

<!--
This feature is driven by [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md). Please join us to connect with the community and share your ideas and feedback around the above feature and beyond. We look forward to hearing from you!
-->
此功能由 [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md) 驅動。
請加入我們，與社區建立聯繫，並分享你對上述功能及其他功能的想法和反饋。我們期待你的迴音！
