---
title: 在集群中自动伸缩 DNS 服务
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
此页面展示如何在 Kubernetes 集群中启用和配置 DNS 服务的自动伸缩。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Make sure the [DNS feature](/docs/concepts/services-networking/dns-pod-service/) itself is enabled.

* Kubernetes version 1.4.0 or later is recommended.
-->

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* 确保 [DNS 特性](/docs/concepts/services-networking/dns-pod-service/)是启用的。

* 推荐使用 Kubernetes 1.4.0 或更高版本。

{{% /capture %}}

{{% capture steps %}}

<!--
## Determining whether DNS horizontal autoscaling is already enabled
-->
## 确定 DNS 水平自动伸缩是否已经启用

<!--
List the Deployments in your cluster in the kube-system namespace:
-->
在 kube-system 命名空间中列出集群中的部署：

    kubectl get deployment --namespace=kube-system

<!--
The output is similar to this:
-->
输出类似：

    NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    ...
    dns-autoscaler        1         1         1            1           ...
    ...

<!--
If you see "dns-autoscaler" in the output, DNS horizontal autoscaling is
already enabled, and you can skip to
[Tuning autoscaling parameters](#tuning-autoscaling-parameters).
-->
如果在输出中看到 `dns-autoscaler`，则 DNS 水平自动缩放
已经启用，您可以跳转到[优化自动缩放参数](#tuning-autoscaling-parameters)。

<!--
## Getting the name of your DNS Deployment or ReplicationController
-->

## 获取 DNS 部署或 ReplicationController 的名称

<!--
List the Deployments in your cluster in the kube-system namespace:
-->
在 kube-system 命名空间中列出集群中的部署：

    kubectl get deployment --namespace=kube-system

<!--
The output is similar to this:
->
输出类似：

    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    ...
    coredns      2         2         2            2           ...
    ...


<!--
In Kubernetes versions earlier than 1.12, the DNS Deployment was called "kube-dns".
-->
在早于 1.12 的 Kubernetes 版本中，DNS 部署称之为 `kube-dns`。

<!--
In Kubernetes versions earlier than 1.5 DNS was implemented using a
ReplicationController instead of a Deployment. So if you don't see kube-dns,
or a similar name, in the preceding output, list the ReplicationControllers in
your cluster in the kube-system namespace:
-->
在 Kubernetes 1.5 之前的版本中，DNS 是使用 ReplicationController 而不是 Deployment 来实现的。
因此，如果在前面的输出中没有看到 kube-dns 或类似的名称，请在 kube-system 名称空间中列出集群中的 ReplicationControllers:

    kubectl get rc --namespace=kube-system

<!--
The output is similar to this:
-->
输出类似：

    NAME            DESIRED   CURRENT   READY     AGE
    ...
    kube-dns-v20    1         1         1         ...
    ...

<!--
## Determining your scale target
-->

## 确定规模目标

<!--
If you have a DNS Deployment, your scale target is:
-->
如果你有 DNS 部署，你的规模目标是：

    Deployment/<your-deployment-name>

<!--
where <dns-deployment-name> is the name of your DNS Deployment. For example, if
your DNS Deployment name is coredns, your scale target is Deployment/coredns.
-->
DNS <dns-deployment-name> 在哪里。例如，如果您的 DNS 部署名称是 coredns，
则您的扩展目标是 Deployment/coredns。

<!--
If you have a DNS ReplicationController, your scale target is:
-->
如果你有一个 DNS ReplicationController，你的规模目标是:

    ReplicationController/<your-rc-name>

<!--
where <your-rc-name> is the name of your DNS ReplicationController. For example,
if your DNS ReplicationController name is kube-dns-v20, your scale target is
ReplicationController/kube-dns-v20.
-->
DNS ReplicationController <your-rc-name> 的名称在哪里。
例如，如果 DNS ReplicationController 名称为 kube-dns-v20，则您的扩展目标是 ReplicationControllekube-dns-v20。

<!--
## Enabling DNS horizontal autoscaling
-->

## 启用 DNS 水平自动缩放

<!--
In this section, you create a Deployment. The Pods in the Deployment run a
container based on the `cluster-proportional-autoscaler-amd64` image.
-->
在本节中，您将创建一个部署。部署中的 Pod 根据 `cluster-proportional-autoscaler-amd64` 镜像运行容器。

<!--
Create a file named `dns-horizontal-autoscaler.yaml` with this content:
-->
创建一个名为 `dns-horizontal-autoscaler.yaml` 的文件内容如下:

{{< codenew file="admin/dns/dns-horizontal-autoscaler.yaml" >}}

<!--
In the file, replace `<SCALE_TARGET>` with your scale target.
-->
在文件中，替换 `<SCALE_TARGET>` 您的缩放目标。

<!--
Go to the directory that contains your configuration file, and enter this
command to create the Deployment:
-->
转至包含配置文件的目录，然后输入以下命令以创建部署：

    kubectl create -f dns-horizontal-autoscaler.yaml

<!--
The output of a successful command is:
-->
成功命令的输出是：

    deployment.apps/kube-dns-autoscaler created

<!--
DNS horizontal autoscaling is now enabled.
-->
现在启用了 DNS 水平自动缩放。

<!--
## Tuning autoscaling parameters
-->

## 调优自动缩放参数

<!--
Verify that the dns-autoscaler ConfigMap exists:
-->
验证 dns-autoscaler ConfigMap 存在:

    kubectl get configmap --namespace=kube-system

<!--
The output is similar to this:
-->
输出类似：

    NAME                  DATA      AGE
    ...
    dns-autoscaler        1         ...
    ...

<!--
Modify the data in the ConfigMap:
-->
修改 ConfigMap 中的数据：

    kubectl edit configmap dns-autoscaler --namespace=kube-system

<!--
Look for this line:
-->
寻找这一行：

    linear: '{"coresPerReplica":256,"min":1,"nodesPerReplica":16}'

<!--
Modify the fields according to your needs. The "min" field indicates the
minimal number of DNS backends. The actual number of backends number is
calculated using this equation:
-->
根据需要修改字段。`min` 字段表示 DNS 后端的最小数量。实际后端数计算公式为：

    replicas = max( ceil( cores * 1/coresPerReplica ) , ceil( nodes * 1/nodesPerReplica ) )

<!--
Note that the values of both `coresPerReplica` and `nodesPerReplica` are
integers.
-->
注意，`coresPerReplica` 和 `nodesPerReplica` 的值都是整数。

<!--
The idea is that when a cluster is using nodes that have many cores,
`coresPerReplica` dominates. When a cluster is using nodes that have fewer
cores, `nodesPerReplica` dominates.
-->
其思想是，当集群使用具有多个核心的节点时，`coresPerReplica` 占主导地位。
当集群使用内核较少的节点时，`nodesPerReplica` 占主导地位。

<!--
There are other supported scaling patterns. For details, see
[cluster-proportional-autoscaler](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler).
-->
还有其他受支持的扩展模式。有关详细信息，请参见 [cluster-proportion -autoscaler](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler)。

<!--
## Disable DNS horizontal autoscaling
-->

## 禁用 DNS 水平自动缩放

<!--
There are a few options for turning DNS horizontal autoscaling. Which option to
use depends on different conditions.
-->
有一些选项可用于转换 DNS 水平自动缩放。使用哪个选项取决于不同的条件。

<!--
### Option 1: Scale down the dns-autoscaler deployment to 0 replicas
-->

### 选项 1：将 dns-autoscaler 部署降低到 0 个副本

<!--
This option works for all situations. Enter this command:
-->
此选项适用于所有情况。输入这个命令：

    kubectl scale deployment --replicas=0 dns-autoscaler --namespace=kube-system

<!--
The output is:
-->
输出是：

    deployment.extensions/dns-autoscaler scaled

<!--
Verify that the replica count is zero:
-->
验证副本计数是否为零：

    kubectl get deployment --namespace=kube-system

<!--
The output displays 0 in the DESIRED and CURRENT columns:
-->
输出在 DESIRED 和 CURRENT 列中显示 0：

    NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    ...
    dns-autoscaler        0         0         0            0           ...
    ...

<!--
### Option 2: Delete the dns-autoscaler deployment
-->

### 选项 2：删除 dns-autoscaler 部署

<!--
This option works if dns-autoscaler is under your own control, which means
no one will re-create it:
-->
如果 dns-autoscaler 在您自己的控制之下，则此选项有效，这意味着没有人会重新创建它：

    kubectl delete deployment dns-autoscaler --namespace=kube-system

<!--
The output is:
-->
输出是：

    deployment.extensions "dns-autoscaler" deleted

<!--
### Option 3: Delete the dns-autoscaler manifest file from the master node
-->

### 选项 3：从主节点删除 dns-autoscaler 清单文件

<!--
This option works if dns-autoscaler is under control of the
[Addon Manager](https://git.k8s.io/kubernetes/cluster/addons/README.md)'s
control, and you have write access to the master node.
-->
如果 dns-autoscaler 在 [Addon Manager](https://git.k8s.io/kubernetes/cluster/addons/README.md) 
控件的控制下，并且您具有对主节点的写访问权，则此选项有效。

<!--
Sign in to the master node and delete the corresponding manifest file.
The common path for this dns-autoscaler is:
-->
登录主节点并删除相应的清单文件。这个 dns-autoscaler 的通用路径是：

    /etc/kubernetes/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml

<!--
After the manifest file is deleted, the Addon Manager will delete the
dns-autoscaler Deployment.
-->
删除清单文件后，Addon 管理器将删除 dns-autoscaler 部署。

{{% /capture %}}

{{% capture discussion %}}

<!--
## Understanding how DNS horizontal autoscaling works
-->
了解 DNS 水平自动缩放的工作原理

<!--
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

* 集群比例自动伸缩器应用程序与 DNS 服务分开部署。

* 一个自动伸缩 Pod 运行一个客户端，该客户端轮询 Kubernetes API 服务器以获得集群中的节点和核心的数量。

* 根据当前可调度节点和核心以及给定的缩放参数，计算并应用所需的副本计数到 DNS 后端。

* 缩放参数和数据点是通过 ConfigMap 提供给 autoscaler 的，它会在每个轮询间隔刷新参数表，以更新所需的最新缩放参数。

* 允许在不重新构建或重新启动自动缩放Pod的情况下更改缩放参数。

* autoscaler 提供了一个控制器接口来支持两种控制模式：*linear* 和 *ladder*。

<!--
## Future enhancements
-->

## 未来的改进

<!--
Control patterns, in addition to linear and ladder, that consider custom metrics
are under consideration as a future development.
-->
除了线性和梯形之外，考虑自定义度量的控制模式也在考虑作为未来的开发。

<!--
Scaling of DNS backends based on DNS-specific metrics is under consideration as
a future development. The current implementation, which uses the number of nodes
and cores in cluster, is limited.
-->
基于 DNS 特定指标的 DNS 后端扩展正在考虑作为未来发展。当前实现使用集群中的节点和核心数量是有限的。

<!--
Support for custom metrics, similar to that provided by
[Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/),
is under consideration as a future development.
-->
支持自定义指标，类似于[水平 Pod 自动伸缩](/docs/tasks/run-application/horizontal-pod-autoscale/)
提供的支持，正在考虑作为未来的开发。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
Learn more about the
[implementation of cluster-proportional-autoscaler](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler).
-->
了解更多关于 [implementation of cluster-proportional-autoscaler](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler)。

{{% /capture %}}



