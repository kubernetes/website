---
title: 自动扩缩集群 DNS 服务
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
本页展示了如何在集群中启用和配置 DNS 服务的自动扩缩功能。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* This guide assumes your nodes use the AMD64 or Intel 64 CPU architecture

* Make sure the [DNS feature](/docs/concepts/services-networking/dns-pod-service/) itself is enabled.

* Kubernetes version 1.4.0 or later is recommended.
-->
* 本指南假设你的节点使用 AMD64 或 Intel 64 CPU 架构

* 确保已启用 [DNS 功能](/zh/docs/concepts/services-networking/dns-pod-service/)本身。

* 建议使用 Kubernetes 1.4.0 或更高版本。

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
## 确定是否 DNS 水平 水平自动扩缩特性已经启用 {#determining-whether-dns-horizontal-autoscaling-is-already-enabled}

在 kube-system 命名空间中列出集群中的 {{< glossary_tooltip text="Deployments" term_id="deployment" >}} ：

```shell
kubectl get deployment --namespace=kube-system
```

输出类似如下这样：

```
NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
...
dns-autoscaler        1         1         1            1           ...
...
```

如果在输出中看到 “dns-autoscaler”，说明 DNS 水平自动扩缩已经启用，可以跳到
[调优自动扩缩参数](#tuning-autoscaling-parameters)。

<!--
## Getting the name of your DNS Deployment {#find-scaling-target}

List the Deployments in your cluster in the kube-system namespace:

```shell
kubectl get deployment --namespace=kube-system
```

The output is similar to this:
-->
## 获取 DNS Deployment 的名称 {#find-scaling-target}

列出集群内 kube-system 名字空间中的 DNS Deployment：

```shell
kubectl get deployment -l k8s-app=kube-dns --namespace=kube-system
```

输出类似如下这样：

```
NAME      READY   UP-TO-DATE   AVAILABLE   AGE
...
coredns   2/2     2            2           ...
...
```

<!--
If you don't see a Deployment for DNS services, you can also look for it by name:
-->
如果看不到 DNS 服务的 Deployment，你也可以通过名字来查找：

```shell
kubectl get deployment --namespace=kube-system
```

<!--
and look for a deployment named `coredns` or `kube-dns`.
-->
并在输出中寻找名称为 `coredns` 或 `kube-dns` 的 Deployment。

<!--
Your scale target is:
-->
你的扩缩目标为：

```
Deployment/<your-deployment-name>
```

<!--
where `<your-deployment-name>` is the name of your DNS Deployment. For example, if
your DNS Deployment name is coredns, your scale target is Deployment/coredns.
-->
其中 `<your-deployment-name>` 是 DNS Deployment 的名称。
例如，如果你的 DNS Deployment 名称是 `coredns`，则你的扩展目标是 Deployment/coredns。

<!--
CoreDNS is the default DNS service for Kubernetes. CoreDNS sets the label
`k8s-app=kube-dns` so that it can work in clusters that originally used
kube-dns.
-->
{{< note >}}
CoreDNS 是 Kubernetes 的默认 DNS 服务。CoreDNS 设置标签 `k8s-app=kube-dns`，
以便能够在原来使用 `kube-dns` 的集群中工作。
{{< /note >}}

<!--
## Enabling DNS horizontal autoscaling      {#enablng-dns-horizontal-autoscaling}

In this section, you create a Deployment. The Pods in the Deployment run a
container based on the `cluster-proportional-autoscaler-amd64` image.

Create a file named `dns-horizontal-autoscaler.yaml` with this content:
-->
## 启用 DNS 水平自动扩缩   {#enablng-dns-horizontal-autoscaling}

在本节，我们创建一个 Deployment。Deployment 中的 Pod 运行一个基于
`cluster-proportional-autoscaler-amd64` 镜像的容器。

创建文件 `dns-horizontal-autoscaler.yaml`，内容如下所示：

{{< codenew file="admin/dns/dns-horizontal-autoscaler.yaml" >}}

<!--
In the file, replace `<SCALE_TARGET>` with your scale target.

Go to the directory that contains your configuration file, and enter this
command to create the Deployment:
-->
在文件中，将 `<SCALE_TARGET>` 替换成扩缩目标。

进入到包含配置文件的目录中，输入如下命令创建 Deployment：

```shell
kubectl apply -f dns-horizontal-autoscaler.yaml
```

<!--
The output of a successful command is:
-->
一个成功的命令输出是：

```
deployment.apps/dns-autoscaler created
```

<!--
DNS horizontal autoscaling is now enabled.
-->
DNS 水平自动扩缩在已经启用了。

<!--
## Tuning autoscaling parameters  {#tuning-autoscaling-parameters}

Verify that the dns-autoscaler {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} exists:
-->
## 调优自动扩缩参数   {#tuning-autoscaling-parameters}

验证 dns-autoscaler {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} 是否存在：

```shell
kubectl get configmap --namespace=kube-system
```

<!--
The output is similar to this:
-->
输出类似于：

```
NAME                  DATA      AGE
...
dns-autoscaler        1         ...
...
```

<!--
Modify the data in the ConfigMap:
-->
修改该 ConfigMap 中的数据：

```shell
kubectl edit configmap dns-autoscaler --namespace=kube-system
```

<!--
Look for this line:
-->
找到如下这行内容：

```yaml
linear: '{"coresPerReplica":256,"min":1,"nodesPerReplica":16}'
```

<!--
Modify the fields according to your needs. The "min" field indicates the
minimal number of DNS backends. The actual number of backends number is
calculated using this equation:
-->

根据需要修改对应的字段。“min” 字段表明 DNS 后端的最小数量。
实际后端的数量通过使用如下公式来计算：

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
[cluster-proportional-autoscaler](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler).
-->
注意 `coresPerReplica` 和 `nodesPerReplica` 的值都是整数。

背后的思想是，当一个集群使用具有很多核心的节点时，由 `coresPerReplica` 来控制。
当一个集群使用具有较少核心的节点时，由 `nodesPerReplica` 来控制。

其它的扩缩模式也是支持的，详情查看
[cluster-proportional-autoscaler](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler)。

<!--
## Disable DNS horizontal autoscaling

There are a few options for tuning DNS horizontal autoscaling. Which option to
use depends on different conditions.
-->
## 禁用 DNS 水平自动扩缩

有几个可供调优的 DNS 水平自动扩缩选项。具体使用哪个选项因环境而异。

<!--
### Option 1: Scale down the dns-autoscaler deployment to 0 replicas

This option works for all situations. Enter this command:
-->
### 选项 1：缩容 dns-autoscaler Deployment 至 0 个副本

该选项适用于所有场景。运行如下命令：

```shell
kubectl scale deployment --replicas=0 dns-autoscaler --namespace=kube-system
```

<!-- The output is: -->
输出如下所示：

```
deployment.apps/dns-autoscaler scaled
```

<!--
Verify that the replica count is zero:
-->
验证当前副本数为 0：

```shell
kubectl get rs --namespace=kube-system
```

<!--
The output displays 0 in the DESIRED and CURRENT columns:
-->
输出内容中，在 DESIRED 和 CURRENT 列显示为 0：

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
### 选项 2：删除 dns-autoscaler Deployment

如果 dns-autoscaler 为你所控制，也就说没有人会去重新创建它，可以选择此选项：

```shell
kubectl delete deployment dns-autoscaler --namespace=kube-system
```

<!-- The output is:-->
输出内容如下所示：

```
deployment.apps "dns-autoscaler" deleted
```

<!--
### Option 3: Delete the dns-autoscaler manifest file from the master node

This option works if dns-autoscaler is under control of the (deprecated)
[Addon Manager](https://git.k8s.io/kubernetes/cluster/addons/README.md),
and you have write access to the master node.
-->
### 选项 3：从主控节点删除 dns-autoscaler 清单文件

如果 dns-autoscaler 在[插件管理器](https://git.k8s.io/kubernetes/cluster/addons/README.md)
的控制之下，并且具有操作 master 节点的写权限，可以使用此选项。

<!--
Sign in to the master node and delete the corresponding manifest file.
The common path for this dns-autoscaler is:
-->
登录到主控节点，删除对应的清单文件。 
dns-autoscaler 对应的路径一般为：

```
/etc/kubernetes/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml
```

<!--
After the manifest file is deleted, the Addon Manager will delete the
dns-autoscaler Deployment.
-->
当清单文件被删除后，插件管理器将删除 dns-autoscaler Deployment。

<!-- discussion -->

<!--
## Understanding how DNS horizontal autoscaling works

* The cluster-proportional-autoscaler application is deployed separately from
the DNS service.

* An autoscaler Pod runs a client that polls the Kubernetes API server for the
number of nodes and cores in the cluster.
-->
## 理解 DNS 水平自动扩缩工作原理

* cluster-proportional-autoscaler 应用独立于 DNS 服务部署。

* autoscaler Pod 运行一个客户端，它通过轮询 Kubernetes API 服务器获取集群中节点和核心的数量。

<!--
* A desired replica count is calculated and applied to the DNS backends based on
the current schedulable nodes and cores and the given scaling parameters.

* The scaling parameters and data points are provided via a ConfigMap to the
autoscaler, and it refreshes its parameters table every poll interval to be up
to date with the latest desired scaling parameters.
-->
* 系统会基于当前可调度的节点个数、核心数以及所给的扩缩参数，计算期望的副本数并应用到 DNS 后端。

* 扩缩参数和数据点会基于一个 ConfigMap 来提供给 autoscaler，它会在每次轮询时刷新它的参数表，
  以与最近期望的扩缩参数保持一致。

<!--
* Changes to the scaling parameters are allowed without rebuilding or restarting
the autoscaler Pod.

* The autoscaler provides a controller interface to support two control
patterns: *linear* and *ladder*.
-->
* 扩缩参数是可以被修改的，而且不需要重建或重启 autoscaler Pod。

* autoscaler 提供了一个控制器接口来支持两种控制模式：*linear* 和 *ladder*。

## {{% heading "whatsnext" %}}

<!--
* Read about [Guaranteed Scheduling For Critical Add-On Pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
* Learn more about the
[implementation of cluster-proportional-autoscaler](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler).

-->
* 阅读[为关键插件 Pod 提供的调度保障](/zh/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)
* 进一步了解 [cluster-proportional-autoscaler 实现](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler)

