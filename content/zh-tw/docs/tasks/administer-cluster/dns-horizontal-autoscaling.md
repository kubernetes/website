---
title: 自動擴縮叢集 DNS 服務
content_type: task
weight: 80
---
<!--
title: Autoscale the DNS Service in a Cluster
content_type: task
weight: 80
-->

<!-- overview -->
<!--
This page shows how to enable and configure autoscaling of the DNS service in
your Kubernetes cluster.
-->
本頁展示瞭如何在你的 Kubernetes 叢集中啓用和設定 DNS 服務的自動擴縮功能。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* This guide assumes your nodes use the AMD64 or Intel 64 CPU architecture

* Make sure [Kubernetes DNS](/docs/concepts/services-networking/dns-pod-service/) is enabled.
-->
* 本指南假設你的節點使用 AMD64 或 Intel 64 CPU 架構

* 確保 [Kubernetes DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/) 已啓用。

<!-- steps -->

<!--
## Determine whether DNS horizontal autoscaling is already enabled {#determining-whether-dns-horizontal-autoscaling-is-already-enabled}

List the {{< glossary_tooltip text="Deployments" term_id="deployment" >}}
in your cluster in the kube-system {{< glossary_tooltip text="namespace" term_id="namespace" >}}:
-->
## 確定是否 DNS 水平自動擴縮特性已經啓用   {#determining-whether-dns-horizontal-autoscaling-is-already-enabled}

在 kube-system {{< glossary_tooltip text="命名空間" term_id="namespace" >}}中列出叢集中的
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}：

```shell
kubectl get deployment --namespace=kube-system
```

<!--
The output is similar to this:
-->
輸出類似如下這樣：

```
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
...
kube-dns-autoscaler    1/1     1            1           ...
...
```

<!--
If you see "kube-dns-autoscaler" in the output, DNS horizontal autoscaling is
already enabled, and you can skip to
[Tuning autoscaling parameters](#tuning-autoscaling-parameters).
-->
如果在輸出中看到 “kube-dns-autoscaler”，說明 DNS 水平自動擴縮已經啓用，
可以跳到[調優 DNS 自動擴縮參數](#tuning-autoscaling-parameters)。

<!--
## Get the name of your DNS Deployment {#find-scaling-target}

List the DNS deployments in your cluster in the kube-system namespace:
-->
## 獲取 DNS Deployment 的名稱   {#find-scaling-target}

列出叢集內 kube-system 命名空間中的 DNS Deployment：

```shell
kubectl get deployment -l k8s-app=kube-dns --namespace=kube-system
```

<!--
The output is similar to this:
-->
輸出類似如下這樣：

```
NAME      READY   UP-TO-DATE   AVAILABLE   AGE
...
coredns   2/2     2            2           ...
...
```

<!--
If you don't see a Deployment for DNS services, you can also look for it by name:
-->
如果看不到 DNS 服務的 Deployment，你也可以通過名字來查找：

```shell
kubectl get deployment --namespace=kube-system
```

<!--
and look for a deployment named `coredns` or `kube-dns`.
-->
並在輸出中尋找名稱爲 `coredns` 或 `kube-dns` 的 Deployment。

<!--
Your scale target is
-->
你的擴縮目標爲：

```
Deployment/<your-deployment-name>
```

<!--
where `<your-deployment-name>` is the name of your DNS Deployment. For example, if
the name of your Deployment for DNS is coredns, your scale target is Deployment/coredns.
-->
其中 `<your-deployment-name>` 是 DNS Deployment 的名稱。
例如，如果你的 DNS Deployment 名稱是 `coredns`，則你的擴展目標是 Deployment/coredns。

{{< note >}}
<!--
CoreDNS is the default DNS service for Kubernetes. CoreDNS sets the label
`k8s-app=kube-dns` so that it can work in clusters that originally used
kube-dns.
-->
CoreDNS 是 Kubernetes 的默認 DNS 服務。CoreDNS 設置標籤 `k8s-app=kube-dns`，
以便能夠在原來使用 `kube-dns` 的叢集中工作。
{{< /note >}}

<!--
## Enable DNS horizontal autoscaling {#enablng-dns-horizontal-autoscaling}

In this section, you create a new Deployment. The Pods in the Deployment run a
container based on the `cluster-proportional-autoscaler-amd64` image.

Create a file named `dns-horizontal-autoscaler.yaml` with this content:
-->
## 啓用 DNS 水平自動擴縮   {#enablng-dns-horizontal-autoscaling}

在本節，我們創建一個新的 Deployment。Deployment 中的 Pod 運行一個基於
`cluster-proportional-autoscaler-amd64` 映像檔的容器。

創建文件 `dns-horizontal-autoscaler.yaml`，內容如下所示：

{{% code_sample file="admin/dns/dns-horizontal-autoscaler.yaml" %}}

<!--
In the file, replace `<SCALE_TARGET>` with your scale target.

Go to the directory that contains your configuration file, and enter this
command to create the Deployment:
-->
在此文件中，將 `<SCALE_TARGET>` 替換成擴縮目標。

進入到包含設定文件的目錄中，輸入如下命令創建 Deployment：

```shell
kubectl apply -f dns-horizontal-autoscaler.yaml
```

<!--
The output of a successful command is:
-->
命令成功執行後的輸出爲：

```
deployment.apps/kube-dns-autoscaler created
```

<!--
DNS horizontal autoscaling is now enabled.
-->
DNS 水平自動擴縮現在已經啓用了。

<!--
## Tune DNS autoscaling parameters {#tuning-autoscaling-parameters}

Verify that the kube-dns-autoscaler {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} exists:
-->
## 調優 DNS 自動擴縮參數   {#tuning-autoscaling-parameters}

驗證 kube-dns-autoscaler {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} 是否存在：

```shell
kubectl get configmap --namespace=kube-system
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME                  DATA      AGE
...
kube-dns-autoscaler   1         ...
...
```

<!--
Modify the data in the ConfigMap:
-->
修改此 ConfigMap 中的數據：

```shell
kubectl edit configmap kube-dns-autoscaler --namespace=kube-system
```

<!--
Look for this line:
-->
找到如下這行內容：

```yaml
linear: '{"coresPerReplica":256,"min":1,"nodesPerReplica":16}'
```

<!--
Modify the fields according to your needs. The "min" field indicates the
minimal number of DNS backends. The actual number of backends is
calculated using this equation:
-->
根據需要修改對應的字段。“min” 字段表明 DNS 後端的最小數量。
實際後端的數量通過使用如下公式來計算：

```
replicas = max( ceil( cores × 1/coresPerReplica ) , ceil( nodes × 1/nodesPerReplica ) )
```

<!--
Note that the values of both `coresPerReplica` and `nodesPerReplica` are
floats.

The idea is that when a cluster is using nodes that have many cores,
`coresPerReplica` dominates. When a cluster is using nodes that have fewer
cores, `nodesPerReplica` dominates.

There are other supported scaling patterns. For details, see
[cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler).
-->
注意 `coresPerReplica` 和 `nodesPerReplica` 的值都是浮點數。

背後的思想是，當一個叢集使用具有很多核心的節點時，由 `coresPerReplica` 來控制。
當一個叢集使用具有較少核心的節點時，由 `nodesPerReplica` 來控制。

其它的擴縮模式也是支持的，詳情查看
[cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)。

<!--
## Disable DNS horizontal autoscaling

There are a few options for tuning DNS horizontal autoscaling. Which option to
use depends on different conditions.
-->
## 禁用 DNS 水平自動擴縮   {#disable-dns-horizontal-autoscaling}

有幾個可供調優的 DNS 水平自動擴縮選項。具體使用哪個選項因環境而異。

<!--
### Option 1: Scale down the kube-dns-autoscaler deployment to 0 replicas

This option works for all situations. Enter this command:
-->
### 選項 1：kube-dns-autoscaler Deployment 縮容至 0 個副本

此選項適用於所有場景。運行如下命令：

```shell
kubectl scale deployment --replicas=0 kube-dns-autoscaler --namespace=kube-system
```

<!--
The output is:
-->
輸出如下所示：

```
deployment.apps/kube-dns-autoscaler scaled
```

<!--
Verify that the replica count is zero:
-->
驗證當前副本數爲 0：

```shell
kubectl get rs --namespace=kube-system
```

<!--
The output displays 0 in the DESIRED and CURRENT columns:
-->
輸出內容中，在 DESIRED 和 CURRENT 列顯示爲 0：

```
NAME                                 DESIRED   CURRENT   READY   AGE
...
kube-dns-autoscaler-6b59789fc8            0         0         0       ...
...
```

<!--
### Option 2: Delete the kube-dns-autoscaler deployment

This option works if kube-dns-autoscaler is under your own control, which means
no one will re-create it:
-->
### 選項 2：刪除 kube-dns-autoscaler Deployment

如果 kube-dns-autoscaler 爲你所控制，也就說沒有人會去重新創建它，可以選擇此選項：

```shell
kubectl delete deployment kube-dns-autoscaler --namespace=kube-system
```

<!--
The output is:
-->
輸出內容如下所示：

```
deployment.apps "kube-dns-autoscaler" deleted
```

<!--
### Option 3: Delete the kube-dns-autoscaler manifest file from the master node

This option works if kube-dns-autoscaler is under control of the (deprecated)
[Addon Manager](https://git.k8s.io/kubernetes/cluster/addons/README.md),
and you have write access to the master node.
-->
### 選項 3：從主控節點刪除 kube-dns-autoscaler 清單文件

如果 kube-dns-autoscaler 在[插件管理器](https://git.k8s.io/kubernetes/cluster/addons/README.md)
的控制之下，並且具有操作主控節點的寫權限，可以使用此選項。

<!--
Sign in to the master node and delete the corresponding manifest file.
The common path for this kube-dns-autoscaler is:
-->
登錄到主控節點，刪除對應的清單文件。
kube-dns-autoscaler 對應的路徑一般爲：

```
/etc/kubernetes/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml
```

<!--
After the manifest file is deleted, the Addon Manager will delete the
kube-dns-autoscaler Deployment.
-->
當清單文件被刪除後，插件管理器將刪除 kube-dns-autoscaler Deployment。

<!-- discussion -->

<!--
## Understanding how DNS horizontal autoscaling works

* The cluster-proportional-autoscaler application is deployed separately from
the DNS service.

* An autoscaler Pod runs a client that polls the Kubernetes API server for the
number of nodes and cores in the cluster.
-->
## 理解 DNS 水平自動擴縮工作原理   {#understanding-how-dns-horizontal-autoscaling-works}

* cluster-proportional-autoscaler 應用獨立於 DNS 服務部署。

* autoscaler Pod 運行一個客戶端，它通過輪詢 Kubernetes API 伺服器獲取叢集中節點和核心的數量。

<!--
* A desired replica count is calculated and applied to the DNS backends based on
the current schedulable nodes and cores and the given scaling parameters.

* The scaling parameters and data points are provided via a ConfigMap to the
autoscaler, and it refreshes its parameters table every poll interval to be up
to date with the latest desired scaling parameters.
-->
* 系統會基於當前可調度的節點個數、核心數以及所給的擴縮參數，計算期望的副本數並應用到 DNS 後端。

* 擴縮參數和數據點會基於一個 ConfigMap 來提供給 autoscaler，它會在每次輪詢時刷新它的參數表，
  以與最近期望的擴縮參數保持一致。

<!--
* Changes to the scaling parameters are allowed without rebuilding or restarting
the autoscaler Pod.

* The autoscaler provides a controller interface to support two control
patterns: *linear* and *ladder*.
-->
* 擴縮參數是可以被修改的，而且不需要重建或重啓 autoscaler Pod。

* autoscaler 提供了一個控制器接口來支持兩種控制模式：**linear** 和 **ladder**。

## {{% heading "whatsnext" %}}

<!--
* Read about [Guaranteed Scheduling For Critical Add-On Pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
* Learn more about the
[implementation of cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler).
-->
* 閱讀[爲關鍵插件 Pod 提供的調度保障](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)。
* 進一步瞭解 [cluster-proportional-autoscaler 實現](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)。
