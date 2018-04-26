---
title: 示例：使用 StatefulSets 部署 Cassandra
assignees:
- ahmetb
cn-approvers:
- xiaosuiba
cn-reviewers:
- markthink
---


{% capture overview %}
<!--
This tutorial shows you how to develop a native cloud [Cassandra](http://cassandra.apache.org/) deployment on Kubernetes. In this instance, a custom Cassandra `SeedProvider` enables Cassandra to discover new Cassandra nodes as they join the cluster.
-->
本教程展示了如何在 Kubernetes 上开发一个云原生的 [Cassandra](http://cassandra.apache.org/) deployment。在这个实例中，Cassandra 使用了一个自定义的  `SeedProvider` 来发现新加入集群的节点。

<!--
Deploying stateful distributed applications, like Cassandra, within a clustered environment can be challenging. StatefulSets greatly simplify this process. Please read about [StatefulSets](/docs/concepts/workloads/controllers/statefulset/)  for more information about the features used in this tutorial.
-->
在集群环境中部署类似 Cassandra 的有状态（stateful）应用可能是具有挑战性的。StatefulSets 极大的简化了这个过程。请阅读 [StatefulSets](/docs/concepts/workloads/controllers/statefulset/) 获取更多关于此教程中使用的这个特性的信息。

**Cassandra Docker**

<!--
The Pods use the [`gcr.io/google-samples/cassandra:v12`](https://github.com/kubernetes/examples/blob/master/cassandra/image/Dockerfile)
image from Google's [container registry](https://cloud.google.com/container-registry/docs/).
The docker is based on `debian:jessie` and includes OpenJDK 8. This image includes a standard Cassandra installation from the Apache Debian repo.  By using environment variables you can change values that are inserted into `cassandra.yaml`.
-->
Pod 使用了来自 Google [容器注册表（container registry）](https://cloud.google.com/container-registry/docs/) 的  [`gcr.io/google-samples/cassandra:v12`](https://github.com/kubernetes/examples/blob/master/cassandra/image/Dockerfile) 镜像。这个 docker 镜像基于 `debian:jessie` 并包含 OpenJDK 8。这个镜像包含了来自 Apache Debian 源的标准 Cassandra 安装。您可以通过环境变量来改变插入到 `cassandra.yaml` 中的值。

| ENV VAR                | DEFAULT VALUE  |
| ---------------------- | :------------: |
| CASSANDRA_CLUSTER_NAME | 'Test Cluster' |
| CASSANDRA_NUM_TOKENS   |       32       |
| CASSANDRA_RPC_ADDRESS  |    0.0.0.0     |

{% endcapture %}

{% capture objectives %}
<!--
* Create and Validate a Cassandra headless [Services](/docs/concepts/services-networking/service/).
* Use a [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) to create a Cassandra ring.
* Validate the [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
* Modify the [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
* Delete the [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) and its [Pods](/docs/concepts/workloads/pods/pod/).
-->
* 创建并验证 Cassandra headless [Services](/docs/concepts/services-networking/service/)。
* 使用  [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) 创建 Cassandra  环（Cassandra ring）。
* 验证 [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)。
* 修改 [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)。
* 删除 [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) 和它的 [Pod](/docs/concepts/workloads/pods/pod/)。
  {% endcapture %}

{% capture prerequisites %}
<!--
To complete this tutorial, you should already have a basic familiarity with [Pods](/docs/concepts/workloads/pods/pod/), [Services](/docs/concepts/services-networking/service/), and [StatefulSets](/docs/concepts/workloads/controllers/statefulset/). In addition, you should:
-->
为了完成本教程，你应该对 [Pod](/docs/concepts/workloads/pods/pod/)、 [Service](/docs/concepts/services-networking/service/) 和 [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) 有基本的了解。此外，你还应该：

<!--
* [Install and Configure](/docs/tasks/tools/install-kubectl/) the `kubectl` command line

* Download [cassandra-service.yaml](/docs/tutorials/stateful-application/cassandra/cassandra-service.yaml) and [cassandra-statefulset.yaml](/docs/tutorials/stateful-application/cassandra/cassandra-statefulset.yaml)

* Have a supported Kubernetes Cluster running
-->
*  [安装并配置 ](/docs/tasks/tools/install-kubectl/) `kubectl` 命令行工具

* 下载  [cassandra-service.yaml](/docs/tutorials/stateful-application/cassandra/cassandra-service.yaml) 和 [cassandra-statefulset.yaml](/docs/tutorials/stateful-application/cassandra/cassandra-statefulset.yaml)

* 有一个支持（这些功能）并正常运行的 Kubernetes 集群

<!--
**Note:** Please read the [getting started guides](/docs/setup/pick-right-solution/) if you do not already have a cluster.
-->
**注意：** 如果你还没有集群，请查阅 [快速入门指南](/docs/setup/pick-right-solution/)。
{: .note}

<!--
### Additional Minikube Setup Instructions
-->
### Minikube 附加安装说明

<!--
**Caution:** [Minikube](/docs/getting-started-guides/minikube/) defaults to 1024MB of memory and 1 CPU which results in an insufficient resource errors during this tutorial. 
-->
**小心：** [Minikube](/docs/getting-started-guides/minikube/) 默认配置 1024MB 内存和 1 CPU，这在本例中将导致资源不足。
{: .caution}

<!--
To avoid these errors, run minikube with:
-->
为了避免这些错误，请这样运行 minikube：

    minikube start --memory 5120 --cpus=4

{% endcapture %}

{% capture lessoncontent %}
<!--
## Creating a Cassandra Headless Service
-->
## 创建  Cassandra Headless Service
<!--
A Kubernetes [Service](/docs/concepts/services-networking/service/) describes a set of [Pods](/docs/concepts/workloads/pods/pod/) that perform the same task. 
-->
Kubernetes [Service](/docs/concepts/services-networking/service/) 描述了一个执行相同任务的 [Pod](/docs/concepts/workloads/pods/pod/) 集合。

<!--
The following `Service` is used for DNS lookups between Cassandra Pods and clients within the Kubernetes Cluster.
-->
下面的 `Service` 用于在集群内部的 Cassandra Pod 和客户端之间进行 DNS 查找。

<!--
1. Launch a terminal window in the directory you downloaded the manifest files.
2. Create a `Service` to track all Cassandra StatefulSet Nodes from the `cassandra-service.yaml` file:
-->
1. 在下载清单文件的文件夹下启动一个终端窗口。
2. 使用 `cassandra-service.yaml` 文件创建一个 `Service`，用于追踪所有的 Cassandra StatefulSet  节点。

       kubectl create -f cassandra-service.yaml

{% include code.html language="yaml" file="cassandra/cassandra-service.yaml" ghlink="/docs/tutorials/stateful-application/cassandra/cassandra-service.yaml" %}

<!--
### Validating (optional)
-->
### 验证（可选）

<!--
Get the Cassandra `Service`.
-->
获取 Cassandra `Service`。

    kubectl get svc cassandra

<!--
The response should be
-->
响应应该像这样：

    NAME        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    cassandra   None         <none>        9042/TCP   45s

<!--
If anything else returns, the service was not successfully created. Read [Debug Services](/docs/tasks/debug-application-cluster/debug-service/) for common issues.
-->
如果返回了任何其它消息，这个 service 就没有被成功创建。请查阅 [调试 Services](/docs/tasks/debug-application-cluster/debug-service/)，了解常见问题。

<!--
## Using a StatefulSet to Create a Cassandra Ring
-->
## 使用 StatefulSet 创建 Cassandra 环

<!--
The StatefulSet manifest, included below, creates a Cassandra ring that consists of three Pods.
-->
上文中的 StatefulSet 清单文件将创建一个由 3 个 pod 组成的 Cassandra 环。

<!--
**Note:** This example uses the default provisioner for Minikube. Please update the following StatefulSet for the cloud you are working with.
-->
**注意：** 本例中的 Minikube 使用默认 provisioner。请根据您使用的云服务商更新下面的 StatefulSet。
{: .note}

<!--
1. Update the StatefulSet if necessary.
2. Create the Cassandra StatefulSet from the `cassandra-statefulset.yaml` file:
-->
1. 如有必要请修改 StatefulSet。
2. 使用  `cassandra-statefulset.yaml` 文件创建 Cassandra StatefulSet。

       kubectl create -f cassandra-statefulset.yaml

{% include code.html language="yaml" file="cassandra/cassandra-statefulset.yaml" ghlink="/docs/tutorials/stateful-application/cassandra/cassandra-statefulset.yaml" %}

<!--
## Validating The Cassandra StatefulSet
-->
## 验证 Cassandra StatefulSet

<!--
1. Get the Cassandra StatefulSet:
-->
1. 获取 Cassandra StatefulSet：

       kubectl get statefulset cassandra
<!--
   The response should be
   -->
   响应应该是

       NAME        DESIRED   CURRENT   AGE
       cassandra   3         0         13s

<!--
   The StatefulSet resource deploys Pods sequentially. 
   -->
   StatefulSet 资源顺序的部署 pod。

<!--
2. Get the Pods to see the ordered creation status:
-->
2. 获取 pod， 查看顺序创建的状态：

       kubectl get pods -l="app=cassandra"

<!--
   The response should be    
  ​
  -->
   响应应该像是
   
       NAME          READY     STATUS              RESTARTS   AGE
       cassandra-0   1/1       Running             0          1m
       cassandra-1   0/1       ContainerCreating   0          8s

<!--
   **Note:** It can take up to ten minutes for all three Pods to deploy. 
   -->
   **注意：** 部署全部三个 pod 可能需要 10 分钟时间。
   {: .note}

<!--
    Once all Pods are deployed, the same command returns:
    -->
    一旦所有 pod 都已经部署，相同的命令将返回：

       NAME          READY     STATUS    RESTARTS   AGE
       cassandra-0   1/1       Running   0          10m
       cassandra-1   1/1       Running   0          9m
       cassandra-2   1/1       Running   0          8m

<!--
3. Run the Cassandra utility nodetool to display the status of the ring.
-->
3. 运行 Cassandra nodetool 工具，显示环的状态。

       kubectl exec cassandra-0 -- nodetool status

<!--
   The response is:
   -->
   响应为：

       Datacenter: DC1-K8Demo
       ======================
       Status=Up/Down
       |/ State=Normal/Leaving/Joining/Moving
       --  Address     Load       Tokens       Owns (effective)  Host ID                               Rack
       UN  172.17.0.5  83.57 KiB  32           74.0%             e2dd09e6-d9d3-477e-96c5-45094c08db0f  Rack1-K8Demo
       UN  172.17.0.4  101.04 KiB  32           58.8%             f89d6835-3a42-4419-92b3-0e62cae1479c  Rack1-K8Demo
       UN  172.17.0.6  84.74 KiB  32           67.1%             a6a1e8c2-3dc5-4417-b1a0-26507af2aaad  Rack1-K8Demo

<!--
## Modifying the Cassandra StatefulSet
-->
## 修改 Cassandra StatefulSet
<!--
Use `kubectl edit` to modify the size of of a Cassandra StatefulSet. 

1. Run the following command:

       kubectl edit statefulset cassandra

   This command opens an editor in your terminal. The line you need to change is the `replicas` field.

   **Note:** The following sample is an excerpt of the StatefulSet file.
-->
使用 `kubectl edit`修改 Cassandra StatefulSet 的大小。 

1. 运行下面的命令：

       kubectl edit statefulset cassandra

   这个命令将在终端中打开一个编辑器。您需要修改 `replicas` 字段一行。

   **注意：** 以下示例是 StatefulSet 文件的摘录。
   {: .note}

    ```yaml   
    # Please edit the object below. Lines beginning with a '#' will be ignored,
    # and an empty file will abort the edit. If an error occurs while saving this file will be
    # reopened with the relevant failures.
    #
    apiVersion: apps/v1beta1
    kind: StatefulSet
    metadata:
     creationTimestamp: 2016-08-13T18:40:58Z
     generation: 1
     labels:
       app: cassandra
     name: cassandra
     namespace: default
     resourceVersion: "323"
     selfLink: /apis/apps/v1beta1/namespaces/default/statefulsets/cassandra
     uid: 7a219483-6185-11e6-a910-42010a8a0fc0
    spec:
     replicas: 3
    ```

<!--
2. Change the number of replicas to 4, and then save the manifest. 

   The StatefulSet now contains 4 Pods.
-->
2. 修改副本数量为 4 并保存清单文件。

   这个 StatefulSet 现在包含 4 个 pod。
<!--
3. Get the Cassandra StatefulSet to verify:

       kubectl get statefulset cassandra

   The response should be
-->
3. 获取 Cassandra StatefulSet 来进行验证：

       kubectl get statefulset cassandra

   响应应该为：

       NAME        DESIRED   CURRENT   AGE
       cassandra   4         4         36m

{% endcapture %}

{% capture cleanup %}
<!--
Deleting or scaling a StatefulSet down does not delete the volumes associated with the StatefulSet. This ensures safety first: your data is more valuable than an auto purge of all related StatefulSet resources. 
-->
删除或缩容 StatefulSet 不会删除与其相关联的 volume。这优先保证了安全性：您的数据比其它所有自动清理的 StatefulSet 资源都更宝贵。

<!--
**Warning:** Depending on the storage class and reclaim policy, deleting the Persistent Volume Claims may cause the associated volumes to also be deleted. Never assume you’ll be able to access data if its volume claims are deleted.
-->
**警告：** 取决于  storage class 和回收策略（reclaim policy），删除 Persistent Volume Claims 可能导致关联的 volume 也被删除。绝对不要假设在 volume claim 被删除后还能访问数据。
{: .warning}
<!--
1. Run the following commands to delete everything in a `StatefulSet`:
-->
1. 运行下面的命令，删除 `StatefulSet` 中所有能内容：

       grace=$(kubectl get po cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
         && kubectl delete statefulset -l app=cassandra \
         && echo "Sleeping $grace" \
         && sleep $grace \
         && kubectl delete pvc -l app=cassandra

<!--
2. Run the following command to delete the Cassandra `Service`.
-->
2. 运行下面的命令，删除 Cassandra `Service`。

       kubectl delete service -l app=cassandra

{% endcapture %}

{% capture whatsnext %}
<!--
* Learn how to [Scale a StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
* Learn more about the [KubernetesSeedProvider](https://github.com/kubernetes/examples/blob/master/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java)
* See more custom [Seed Provider Configurations](https://git.k8s.io/examples/cassandra/java/README.md)
-->
* 了解如何  [扩展 StatefulSet](/docs/tasks/run-application/scale-stateful-set/)。
* 详细了解  [KubernetesSeedProvider](https://github.com/kubernetes/examples/blob/master/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java)。
* 查看更多自定义 [Seed Provider 配置](https://git.k8s.io/examples/cassandra/java/README.md)。

{% endcapture %}

{% include templates/tutorial.md %}
