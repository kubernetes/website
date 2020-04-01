---
title: 集群 DNS 服务自动伸缩
content_template: templates/task
---
<!--
---
title: Autoscale the DNS Service in a Cluster
content_template: templates/task
---
-->

{{% capture overview %}}
<!--
This page shows how to enable and configure autoscaling of the DNS service in a
Kubernetes cluster.
-->
本页展示了如何在集群中启用和配置 DNS 服务的自动伸缩功能。
{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* This guide assumes your nodes use the AMD64 or Intel 64 CPU architecture

* Make sure the [DNS feature](/docs/concepts/services-networking/dns-pod-service/) itself is enabled.

* Kubernetes version 1.4.0 or later is recommended.
-->
* 本指南假设您的节点使用 AMD64 或 Intel 64 CPU 架构

* 确保已启用 [DNS 功能](/docs/concepts/services-networking/dns-pod-service/)本身。

* 建议使用 Kubernetes 1.4.0 或更高版本。

{{% /capture %}}

{{% capture steps %}}

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
## 确定是否 DNS 水平 水平自动伸缩特性已经启用

在 kube-system 命名空间中列出集群中的 {{< glossary_tooltip text="Deployments" term_id="deployment" >}} ：

```shell
kubectl get deployment --namespace=kube-system
```

输出类似如下这样：

    NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    ...
    dns-autoscaler        1         1         1            1           ...
    ...

如果在输出中看到 “dns-autoscaler”，说明 DNS 水平自动伸缩已经启用，可以跳到 [调优自动伸缩参数](#tuning-autoscaling-parameters)。

<!--
## Getting the name of your DNS Deployment or ReplicationController

List the Deployments in your cluster in the kube-system namespace:

```shell
kubectl get deployment --namespace=kube-system
```

The output is similar to this:

    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    ...
    coredns      2         2         2            2           ...
    ...


In Kubernetes versions earlier than 1.12, the DNS Deployment was called "kube-dns".

In Kubernetes versions earlier than 1.5 DNS was implemented using a
ReplicationController instead of a Deployment. So if you don't see kube-dns,
or a similar name, in the preceding output, list the ReplicationControllers in
your cluster in the kube-system namespace:

```shell
kubectl get rc --namespace=kube-system
```

The output is similar to this:

    NAME            DESIRED   CURRENT   READY     AGE
    ...
    kube-dns-v20    1         1         1         ...
    ...
-->
## 获取 DNS Deployment 或 ReplicationController 的名称

列出集群内 kube-system namespace 中的 Deployment：

```shell
kubectl get deployment --namespace=kube-system
```

输出类似如下这样：

    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    ...
    coredns      2         2         2            2           ...
    ...

在早于 1.12 的 Kubernetes 版本中，DNS 部署称为 “kube-dns”。

Kubernetes 1.5 或之前版本，DNS 通过使用 ReplicationController 来实现，而不是 Deployment。 所以看不到 kube-dns 或者类似的名称，在之前的输出中，列出了集群内 kube-system namespace 中的 ReplicationController：

```shell
kubectl get rc --namespace=kube-system
```

输出类似如下这样：

    NAME            DESIRED   CURRENT   READY     AGE
    ...
    kube-dns-v20    1         1         1         ...
    ...

<!--
## Determining your scale target

If you have a DNS Deployment, your scale target is:

    Deployment/<your-deployment-name>

where `<your-deployment-name>` is the name of your DNS Deployment. For example, if
your DNS Deployment name is coredns, your scale target is Deployment/coredns.

If you have a DNS ReplicationController, your scale target is:

    ReplicationController/<your-rc-name>

where `<your-rc-name>` is the name of your DNS ReplicationController. For example,
if your DNS ReplicationController name is kube-dns-v20, your scale target is
ReplicationController/kube-dns-v20.
-->
## 确定伸缩目标

如果有一个 DNS Deployment，伸缩目标是：

    Deployment/<your-deployment-name>

其中 `<your-deployment-name>` 是 DNS 部署的名称。例如，如果您的 DNS 部署名称是 coredns，则您的扩展目标是 Deployment/coredns。

如果有一个 DNS ReplicationController，那么伸缩目标为：

    ReplicationController/<your-rc-name>

这里 `<your-rc-name>` 是 DNS ReplicationController 的名称。 例如，DNS ReplicationController 的名称是 kube-dns-v20，则伸缩目标为 ReplicationController/kube-dns-v20。

<!--
## Enabling DNS horizontal autoscaling

In this section, you create a Deployment. The Pods in the Deployment run a
container based on the `cluster-proportional-autoscaler-amd64` image.

Create a file named `dns-horizontal-autoscaler.yaml` with this content:

{{< codenew file="admin/dns/dns-horizontal-autoscaler.yaml" >}}

In the file, replace `<SCALE_TARGET>` with your scale target.

Go to the directory that contains your configuration file, and enter this
command to create the Deployment:

```shell
kubectl apply -f dns-horizontal-autoscaler.yaml
```

The output of a successful command is:

    deployment.apps/dns-autoscaler created

DNS horizontal autoscaling is now enabled.
-->
## 启用 DNS 水平自动伸缩

在本段，我们创建一个 Deployment。Deployment 中的 Pod 运行一个基于 `cluster-proportional-autoscaler-amd64` 镜像的容器。

创建文件 `dns-horizontal-autoscaler.yaml`，内容如下所示：

{{< codenew file="admin/dns/dns-horizontal-autoscaler.yaml" >}}

在文件中，将 `<SCALE_TARGET>` 替换成 scale 目标。

进入到包含配置文件的目录中，输入如下命令创建 Deployment：

```shell
kubectl apply -f dns-horizontal-autoscaler.yaml
```

一个成功的命令输出是：

    deployment.apps/dns-autoscaler created

DNS 水平自动伸缩在已经启用了。

<!--
## Tuning autoscaling parameters

Verify that the dns-autoscaler {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} exists:

```shell
kubectl get configmap --namespace=kube-system
```

The output is similar to this:

    NAME                  DATA      AGE
    ...
    dns-autoscaler        1         ...
    ...

Modify the data in the ConfigMap:

```shell
kubectl edit configmap dns-autoscaler --namespace=kube-system
```

Look for this line:

```yaml
linear: '{"coresPerReplica":256,"min":1,"nodesPerReplica":16}'
```

Modify the fields according to your needs. The "min" field indicates the
minimal number of DNS backends. The actual number of backends number is
calculated using this equation:

    replicas = max( ceil( cores * 1/coresPerReplica ) , ceil( nodes * 1/nodesPerReplica ) )

Note that the values of both `coresPerReplica` and `nodesPerReplica` are
integers.

The idea is that when a cluster is using nodes that have many cores,
`coresPerReplica` dominates. When a cluster is using nodes that have fewer
cores, `nodesPerReplica` dominates.

There are other supported scaling patterns. For details, see
[cluster-proportional-autoscaler](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler).
-->
## 调优自动伸缩参数

验证 dns-autoscaler {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} 是否存在：

```shell
kubectl get configmap --namespace=kube-system
```

输出类似如下所示：

    NAME                  DATA      AGE
    ...
    dns-autoscaler        1         ...
    ...

修改该 ConfigMap 中的数据：

```shell
kubectl edit configmap dns-autoscaler --namespace=kube-system
```

找到如下这行内容：

```yaml
linear: '{"coresPerReplica":256,"min":1,"nodesPerReplica":16}'
```

根据需要修改对应的字段。“min” 字段说明 DNS 后端的最小数量。实际后端的数量，通过使用如下公式来计算：

    replicas = max( ceil( cores * 1/coresPerReplica ) , ceil( nodes * 1/nodesPerReplica ) )

注意 `coresPerReplica` 和 `nodesPerReplica` 的值都是整数。

想法是，当一个集群使用具有很多核心的节点时，由 `coresPerReplica` 来控制。 当一个集群使用具有较少核心的节点时，由 `nodesPerReplica` 来控制。

其它的伸缩模式也是支持的，详情查看 [cluster-proportional-autoscaler](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler)。

<!--
## Disable DNS horizontal autoscaling

There are a few options for tuning DNS horizontal autoscaling. Which option to
use depends on different conditions.
-->
## 禁用 DNS 水平自动伸缩

有几个 DNS 水平自动伸缩的选项。具体使用哪个选项因环境而异。

<!--
### Option 1: Scale down the dns-autoscaler deployment to 0 replicas

This option works for all situations. Enter this command:

```shell
kubectl scale deployment --replicas=0 dns-autoscaler --namespace=kube-system
```

The output is:

    deployment.extensions/dns-autoscaler scaled

Verify that the replica count is zero:

```shell
kubectl get deployment --namespace=kube-system
```

The output displays 0 in the DESIRED and CURRENT columns:

    NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    ...
    dns-autoscaler        0         0         0            0           ...
    ...
-->
### 选项 1：调小 dns-autoscaler deployment 至 0 个副本

该选项适用于所有场景。运行如下命令：

```shell
kubectl scale deployment --replicas=0 dns-autoscaler --namespace=kube-system
```

输出如下所示：

    deployment.extensions/dns-autoscaler scaled

验证当前副本数为 0：

```shell
kubectl get deployment --namespace=kube-system
```

输出内容中，在 DESIRED 和 CURRENT 列显示为 0：

    NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    ...
    dns-autoscaler        0         0         0            0           ...
    ...

<!--
### Option 2: Delete the dns-autoscaler deployment

This option works if dns-autoscaler is under your own control, which means
no one will re-create it:

```shell
kubectl delete deployment dns-autoscaler --namespace=kube-system
```

The output is:

    deployment.extensions "dns-autoscaler" deleted
-->
### 选项 2：删除 dns-autoscaler Deployment

如果 dns-autoscaler 为您所控制，该选项可以正常工作，也就说没有人会去重新创建它：

```shell
kubectl delete deployment dns-autoscaler --namespace=kube-system
```

输出内容如下所示：

    deployment.extensions "dns-autoscaler" deleted

<!--
### Option 3: Delete the dns-autoscaler manifest file from the master node

This option works if dns-autoscaler is under control of the (deprecated)
[Addon Manager](https://git.k8s.io/kubernetes/cluster/addons/README.md),
and you have write access to the master node.

Sign in to the master node and delete the corresponding manifest file.
The common path for this dns-autoscaler is:

    /etc/kubernetes/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml

After the manifest file is deleted, the Addon Manager will delete the
dns-autoscaler Deployment.
-->
### 选项 3：从 master 节点删除 dns-autoscaler manifest 文件

如果 dns-autoscaler 在[插件管理器](https://git.k8s.io/kubernetes/cluster/addons/README.md)的控制之下，该选项可以工作，并且具有操作 master 节点的写权限。

登录到 master 节点，删除对应的 manifest 文件。 
dns-autoscaler 的路径一般为：

    /etc/kubernetes/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml

当 manifest 文件删除后，插件管理器将删除 dns-autoscaler Deployment。

{{% /capture %}}

{{% capture discussion %}}

<!--
## Understanding how DNS horizontal autoscaling works

* The cluster-proportional-autoscaler application is deployed separately from
the DNS service.

* An autoscaler Pod runs a client that polls the Kubernetes API server for the
number of nodes and cores in the cluster.

* A desired replica count is calculated and applied to the DNS backends based on
the current schedulable nodes and cores and the given scaling parameters.

* The scaling parameters and data points are provided via a ConfigMap to the
autoscaler, and it refreshes its parameters table every poll interval to be up
to date with the latest desired scaling parameters.

* Changes to the scaling parameters are allowed without rebuilding or restarting
the autoscaler Pod.

* The autoscaler provides a controller interface to support two control
patterns: *linear* and *ladder*.
-->
## 理解 DNS 水平自动伸缩工作原理

* cluster-proportional-autoscaler 应用独立于 DNS service 部署。

* autoscaler Pod 运行一个客户端，它通过轮询 Kubernetes API server 获取集群中节点和核心的数量。

* 一个期望的副本数会被计算，并根据当前可调度的节点、核心数、给定伸缩参数，被应用到 DNS 后端。

* 伸缩参数和数据点会基于一个 ConfigMap 来提供给 autoscaler，它会在每次轮询时刷新它的参数表，以与最近期望的伸缩参数保持一致。

* 允许对伸缩参数进行修改，而不需要重建或重启 autoscaler Pod。

* autoscaler 提供了一个控制器接口来支持两种控制模式：*linear* 和 *ladder*。

<!--
## Future enhancements

Control patterns, in addition to linear and ladder, that consider custom metrics
are under consideration as a future development.

Scaling of DNS backends based on DNS-specific metrics is under consideration as
a future development. The current implementation, which uses the number of nodes
and cores in cluster, is limited.

Support for custom metrics, similar to that provided by
[Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/),
is under consideration as a future development.
-->
## 未来功能增强

控制模式，除了 linear 和 ladder，正在考虑未来将开发自定义 metric。

基于 DNS 特定 metric 的 DNS 后端的伸缩，考虑未来会开发。当前实现是使用集群中节点和核心的数量是受限制的。

支持自定义 metric，类似于 [Horizontal Pod 自动伸缩](/docs/tasks/run-application/horizontal-pod-autoscale/) 所提供的，考虑未来进行开发。

{{% /capture %}}

{{% capture whatsnext %}}
<!--
* Learn more about the
[implementation of cluster-proportional-autoscaler](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler).
-->
* 了解更多关于 [cluster-proportional-autoscaler 实现](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler)的相关信息。
{{% /capture %}}
