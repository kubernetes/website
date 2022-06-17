---
title: 自動擴縮叢集 DNS 服務
content_type: task
---
<!--
title: Autoscale the DNS Service in a Cluster
content_type: task
-->

<!-- overview -->
<!--
This page shows how to enable and configure autoscaling of the DNS service in a
Kubernetes cluster.
-->
本頁展示瞭如何在叢集中啟用和配置 DNS 服務的自動擴縮功能。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* This guide assumes your nodes use the AMD64 or Intel 64 CPU architecture

* Make sure the [DNS feature](/docs/concepts/services-networking/dns-pod-service/) itself is enabled.

* Kubernetes version 1.4.0 or later is recommended.
-->
* 本指南假設你的節點使用 AMD64 或 Intel 64 CPU 架構

* 確保已啟用 [DNS 功能](/zh-cn/docs/concepts/services-networking/dns-pod-service/)本身。

* 建議使用 Kubernetes 1.4.0 或更高版本。

<!-- steps -->

<!--
## Determining whether DNS horizontal autoscaling is already enabled

List the {{< glossary_tooltip text="Deployments" term_id="deployment" >}}
in your cluster in the kube-system namespace:

```shell
kubectl get deployment --namespace=kube-system
```

The output is similar to this:

    NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    ...
    dns-autoscaler        1         1         1            1           ...
    ...

If you see "dns-autoscaler" in the output, DNS horizontal autoscaling is
already enabled, and you can skip to
[Tuning autoscaling parameters](#tuning-autoscaling-parameters).
-->
## 確定是否 DNS 水平 水平自動擴縮特性已經啟用 {#determining-whether-dns-horizontal-autoscaling-is-already-enabled}

在 kube-system 名稱空間中列出叢集中的 {{< glossary_tooltip text="Deployments" term_id="deployment" >}} ：

```shell
kubectl get deployment --namespace=kube-system
```

輸出類似如下這樣：

```
NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
...
dns-autoscaler        1         1         1            1           ...
...
```

如果在輸出中看到 “dns-autoscaler”，說明 DNS 水平自動擴縮已經啟用，可以跳到
[調優自動擴縮引數](#tuning-autoscaling-parameters)。

<!--
## Getting the name of your DNS Deployment {#find-scaling-target}

List the Deployments in your cluster in the kube-system namespace:

```shell
kubectl get deployment --namespace=kube-system
```

The output is similar to this:
-->
## 獲取 DNS Deployment 的名稱 {#find-scaling-target}

列出叢集內 kube-system 名字空間中的 DNS Deployment：

```shell
kubectl get deployment -l k8s-app=kube-dns --namespace=kube-system
```

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
如果看不到 DNS 服務的 Deployment，你也可以透過名字來查詢：

```shell
kubectl get deployment --namespace=kube-system
```

<!--
and look for a deployment named `coredns` or `kube-dns`.
-->
並在輸出中尋找名稱為 `coredns` 或 `kube-dns` 的 Deployment。

<!--
Your scale target is:
-->
你的擴縮目標為：

```
Deployment/<your-deployment-name>
```

<!--
where `<your-deployment-name>` is the name of your DNS Deployment. For example, if
your DNS Deployment name is coredns, your scale target is Deployment/coredns.
-->
其中 `<your-deployment-name>` 是 DNS Deployment 的名稱。
例如，如果你的 DNS Deployment 名稱是 `coredns`，則你的擴充套件目標是 Deployment/coredns。

<!--
CoreDNS is the default DNS service for Kubernetes. CoreDNS sets the label
`k8s-app=kube-dns` so that it can work in clusters that originally used
kube-dns.
-->
{{< note >}}
CoreDNS 是 Kubernetes 的預設 DNS 服務。CoreDNS 設定標籤 `k8s-app=kube-dns`，
以便能夠在原來使用 `kube-dns` 的叢集中工作。
{{< /note >}}

<!--
## Enabling DNS horizontal autoscaling      {#enablng-dns-horizontal-autoscaling}

In this section, you create a Deployment. The Pods in the Deployment run a
container based on the `cluster-proportional-autoscaler-amd64` image.

Create a file named `dns-horizontal-autoscaler.yaml` with this content:
-->
## 啟用 DNS 水平自動擴縮   {#enablng-dns-horizontal-autoscaling}

在本節，我們建立一個 Deployment。Deployment 中的 Pod 執行一個基於
`cluster-proportional-autoscaler-amd64` 映象的容器。

建立檔案 `dns-horizontal-autoscaler.yaml`，內容如下所示：

{{< codenew file="admin/dns/dns-horizontal-autoscaler.yaml" >}}

<!--
In the file, replace `<SCALE_TARGET>` with your scale target.

Go to the directory that contains your configuration file, and enter this
command to create the Deployment:
-->
在檔案中，將 `<SCALE_TARGET>` 替換成擴縮目標。

進入到包含配置檔案的目錄中，輸入如下命令建立 Deployment：

```shell
kubectl apply -f dns-horizontal-autoscaler.yaml
```

<!--
The output of a successful command is:
-->
一個成功的命令輸出是：

```
deployment.apps/dns-autoscaler created
```

<!--
DNS horizontal autoscaling is now enabled.
-->
DNS 水平自動擴縮在已經啟用了。

<!--
## Tuning autoscaling parameters  {#tuning-autoscaling-parameters}

Verify that the dns-autoscaler {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} exists:
-->
## 調優自動擴縮引數   {#tuning-autoscaling-parameters}

驗證 dns-autoscaler {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} 是否存在：

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
dns-autoscaler        1         ...
...
```

<!--
Modify the data in the ConfigMap:
-->
修改該 ConfigMap 中的資料：

```shell
kubectl edit configmap dns-autoscaler --namespace=kube-system
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
minimal number of DNS backends. The actual number of backends number is
calculated using this equation:
-->

根據需要修改對應的欄位。“min” 欄位表明 DNS 後端的最小數量。
實際後端的數量透過使用如下公式來計算：

```
replicas = max( ceil( cores * 1/coresPerReplica ) , ceil( nodes * 1/nodesPerReplica ) )
```

<!--
Note that the values of both `coresPerReplica` and `nodesPerReplica` are
integers.

The idea is that when a cluster is using nodes that have many cores,
`coresPerReplica` dominates. When a cluster is using nodes that have fewer
cores, `nodesPerReplica` dominates.

There are other supported scaling patterns. For details, see
[cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler).
-->
注意 `coresPerReplica` 和 `nodesPerReplica` 的值都是整數。

背後的思想是，當一個叢集使用具有很多核心的節點時，由 `coresPerReplica` 來控制。
當一個叢集使用具有較少核心的節點時，由 `nodesPerReplica` 來控制。

其它的擴縮模式也是支援的，詳情檢視
[cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)。

<!--
## Disable DNS horizontal autoscaling

There are a few options for tuning DNS horizontal autoscaling. Which option to
use depends on different conditions.
-->
## 禁用 DNS 水平自動擴縮

有幾個可供調優的 DNS 水平自動擴縮選項。具體使用哪個選項因環境而異。

<!--
### Option 1: Scale down the dns-autoscaler deployment to 0 replicas

This option works for all situations. Enter this command:
-->
### 選項 1：縮容 dns-autoscaler Deployment 至 0 個副本

該選項適用於所有場景。執行如下命令：

```shell
kubectl scale deployment --replicas=0 dns-autoscaler --namespace=kube-system
```

<!-- The output is: -->
輸出如下所示：

```
deployment.apps/dns-autoscaler scaled
```

<!--
Verify that the replica count is zero:
-->
驗證當前副本數為 0：

```shell
kubectl get rs --namespace=kube-system
```

<!--
The output displays 0 in the DESIRED and CURRENT columns:
-->
輸出內容中，在 DESIRED 和 CURRENT 列顯示為 0：

```
NAME                                 DESIRED   CURRENT   READY   AGE
...
dns-autoscaler-6b59789fc8            0         0         0       ...
...
```

<!--
### Option 2: Delete the dns-autoscaler deployment

This option works if dns-autoscaler is under your own control, which means
no one will re-create it:
-->
### 選項 2：刪除 dns-autoscaler Deployment

如果 dns-autoscaler 為你所控制，也就說沒有人會去重新建立它，可以選擇此選項：

```shell
kubectl delete deployment dns-autoscaler --namespace=kube-system
```

<!-- The output is:-->
輸出內容如下所示：

```
deployment.apps "dns-autoscaler" deleted
```

<!--
### Option 3: Delete the dns-autoscaler manifest file from the master node

This option works if dns-autoscaler is under control of the (deprecated)
[Addon Manager](https://git.k8s.io/kubernetes/cluster/addons/README.md),
and you have write access to the master node.
-->
### 選項 3：從主控節點刪除 dns-autoscaler 清單檔案

如果 dns-autoscaler 在[外掛管理器](https://git.k8s.io/kubernetes/cluster/addons/README.md)
的控制之下，並且具有操作 master 節點的寫許可權，可以使用此選項。

<!--
Sign in to the master node and delete the corresponding manifest file.
The common path for this dns-autoscaler is:
-->
登入到主控節點，刪除對應的清單檔案。 
dns-autoscaler 對應的路徑一般為：

```
/etc/kubernetes/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml
```

<!--
After the manifest file is deleted, the Addon Manager will delete the
dns-autoscaler Deployment.
-->
當清單檔案被刪除後，外掛管理器將刪除 dns-autoscaler Deployment。

<!-- discussion -->

<!--
## Understanding how DNS horizontal autoscaling works

* The cluster-proportional-autoscaler application is deployed separately from
the DNS service.

* An autoscaler Pod runs a client that polls the Kubernetes API server for the
number of nodes and cores in the cluster.
-->
## 理解 DNS 水平自動擴縮工作原理

* cluster-proportional-autoscaler 應用獨立於 DNS 服務部署。

* autoscaler Pod 執行一個客戶端，它透過輪詢 Kubernetes API 伺服器獲取叢集中節點和核心的數量。

<!--
* A desired replica count is calculated and applied to the DNS backends based on
the current schedulable nodes and cores and the given scaling parameters.

* The scaling parameters and data points are provided via a ConfigMap to the
autoscaler, and it refreshes its parameters table every poll interval to be up
to date with the latest desired scaling parameters.
-->
* 系統會基於當前可排程的節點個數、核心數以及所給的擴縮引數，計算期望的副本數並應用到 DNS 後端。

* 擴縮引數和資料點會基於一個 ConfigMap 來提供給 autoscaler，它會在每次輪詢時重新整理它的引數表，
  以與最近期望的擴縮引數保持一致。

<!--
* Changes to the scaling parameters are allowed without rebuilding or restarting
the autoscaler Pod.

* The autoscaler provides a controller interface to support two control
patterns: *linear* and *ladder*.
-->
* 擴縮引數是可以被修改的，而且不需要重建或重啟 autoscaler Pod。

* autoscaler 提供了一個控制器介面來支援兩種控制模式：*linear* 和 *ladder*。

## {{% heading "whatsnext" %}}

<!--
* Read about [Guaranteed Scheduling For Critical Add-On Pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
* Learn more about the
[implementation of cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler).

-->
* 閱讀[為關鍵外掛 Pod 提供的排程保障](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)
* 進一步瞭解 [cluster-proportional-autoscaler 實現](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)

