<!-----
title: Configure Memory and CPU Quotas for a Namespace
----->
---
title: 为名字空间配置CPU和内存配额（Quota）
---

{% capture overview %}

<!--This page shows how to set quotas for the total amount memory and CPU that
can be used by all Containers running in a namespace. You specify quotas in a
[ResourceQuota](/docs/api-reference/v1.7/#resourcequota-v1-core)
object.-->
本任务展示了如何为某一名字空间内运行的所有容器配置CPU和内存配额。配额可以通过
[ResourceQuota](/docs/api-reference/v1.7/#resourcequota-v1-core)对象设置。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

<!--Each node in your cluster must have at least 1 GiB of memory.-->
请确保您集群中的每个节点（node）拥有至少1GiB内存。

{% endcapture %}


{% capture steps %}

<!--## Create a namespace-->
## 创建名字空间

<!--Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.-->
创建一个单独的名字空间，以便于隔离您在本练习中创建的资源与集群的其他资源。

```shell
kubectl create namespace quota-mem-cpu-example
```

<!--## Create a ResourceQuota-->
## 创建ResourceQuota对象

<!--Here is the configuration file for a ResourceQuota object:-->
以下展示了ResourceQuota对象的配置文件内容：

{% include code.html language="yaml" file="quota-mem-cpu.yaml" ghlink="/docs/tasks/administer-cluster/quota-mem-cpu.yaml" %}

<!--Create the ResourceQuota:-->
下面，首先创建ResourceQuota对象

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-mem-cpu.yaml --namespace=quota-mem-cpu-example
```

<!--View detailed information about the ResourceQuota:-->
然后可以通过以下命令查看ResourceQuota对象的详细信息：

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

<!--The ResourceQuota places these requirements on the quota-mem-cpu-example namespace:-->
以上刚创建的ResourceQuota对象将在quota-mem-cpu-example名字空间中添加以下限制：

<!--* Every Container must have a memory request, memory limit, cpu request, and cpu limit.
* The memory request total for all Containers must not exceed 1 GiB.
* The memory limit total for all Containers must not exceed 2 GiB.
* The CPU request total for all Containers must not exceed 1 cpu.
* The CPU limit total for all Containers must not exceed 2 cpu.-->
* 每个容器必须设置内存请求（memory request），内存限额（memory limit），cpu请求（cpu request）和cpu限额（cpu limit）。
* 所有容器的内存请求总额不得超过1 GiB。
* 所有容器的内存限额总额不得超过2 GiB。
* 所有容器的CPU请求总额不得超过1 CPU。
* 所有容器的CPU限额总额不得超过2 CPU。

<!--## Create a Pod-->
## 创建一个Pod

<!--Here is the configuration file for a Pod:-->
以下展示了一个Pod的配置文件内容：

{% include code.html language="yaml" file="quota-mem-cpu-pod.yaml" ghlink="/docs/tasks/administer-cluster/quota-mem-cpu-pod.yaml" %}


<!--Create the Pod:-->
通过以下命令创建这个Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-mem-cpu-pod.yaml --namespace=quota-mem-cpu-example
```

<!--Verify that the Pod's Container is running:-->
运行以下命令验证这个Pod的容器已经运行：

```
kubectl get pod quota-mem-cpu-demo --namespace=quota-mem-cpu-example
```

<!--Once again, view detailed information about the ResourceQuota:-->
然后再次查看ResourceQuota对象的详细信息：

```
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

<!--The output shows the quota along with how much of the quota has been used.
You can see that the memory and CPU requests and limits for your Pod do not
exceed the quota.-->
除了配额本身信息外，上述命令还显示了目前配额中有多少已经被使用。可以看到，刚才创建的Pod的内存以及
CPU的请求和限额并没有超出配额。

```
status:
  hard:
    limits.cpu: "2"
    limits.memory: 2Gi
    requests.cpu: "1"
    requests.memory: 1Gi
  used:
    limits.cpu: 800m
    limits.memory: 800Mi
    requests.cpu: 400m
    requests.memory: 600Mi
```

<!--## Attempt to create a second Pod-->
## 尝试创建第二个Pod

<!--Here is the configuration file for a second Pod:-->
第二个Pod的配置文件如下所示：

{% include code.html language="yaml" file="quota-mem-cpu-pod-2.yaml" ghlink="/docs/tasks/administer-cluster/quota-mem-cpu-pod-2.yaml" %}

<!--In the configuration file, you can see that the Pod has a memory request of 700 MiB.
Notice that the sum of the used memory request and this new memory
request exceeds the memory request quota. 600 MiB + 700 MiB > 1 GiB.-->
在配置文件中，您可以看到第二个Pod的内存请求是700 MiB。可以注意到，如果创建第二个Pod,
目前的内存使用量加上新的内存请求已经超出了当前名字空间的内存请求配额。即600 MiB + 700 MiB > 1 GiB。

<!--Attempt to create the Pod:-->
下面尝试创建第二个Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-mem-cpu-pod-2.yaml --namespace=quota-mem-cpu-example
```

<!--The second Pod does not get created. The output shows that creating the second Pod
would cause the memory request total to exceed the memory request quota.-->
以下命令输出显示第二个Pod并没有创建成功。错误信息说明了如果创建第二个Pod，内存请求总额将超出名字空间的内存请求配额。

```
Error from server (Forbidden): error when creating "docs/tasks/administer-cluster/quota-mem-cpu-pod-2.yaml":
pods "quota-mem-cpu-demo-2" is forbidden: exceeded quota: mem-cpu-demo,
requested: requests.memory=700Mi,used: requests.memory=600Mi, limited: requests.memory=1Gi
```

<!--## Discussion-->
## 讨论

<!--As you have seen in this exercise, you can use a ResourceQuota to restrict
the memory request total for all Containers running in a namespace.
You can also restrict the totals for memory limit, cpu request, and cpu limit.-->
在本练习中您已经看到，使用ResourceQuota可以限制一个名字空间中所运行的所有容器的内存请求总额。
当然，也可以通过ResourceQuota限制所有容器的内存限额、CPU请求以及CPU限额。

<!--If you want to restrict individual Containers, instead of totals for all Containers, use a
[LimitRange](/docs/tasks/administer-cluster/memory-constraint-namespace/).-->
如果您仅仅想限制单个容器的上述各项指标，而非名字空间中所有容器的，请使用[LimitRange](/docs/tasks/administer-cluster/memory-constraint-namespace/)。

<!--## Clean up-->
## 练习环境的清理

<!--Delete your namespace:-->
通过删除名字空间即可完成环境清理：

```shell
kubectl delete namespace quota-mem-cpu-example
```

{% endcapture %}

{% capture whatsnext %}

<!--### For cluster administrators-->
### 集群管理员可以参考的配置配额方面的文档

<!--* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/default-memory-request-limit/)-->
* [为名字空间配置默认内存请求和限额](/docs/tasks/administer-cluster/default-memory-request-limit/)

<!--* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/default-cpu-request-limit/)-->
* [为名字空间配置默认CPU请求和限额](/docs/tasks/administer-cluster/default-cpu-request-limit/)

<!--* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)-->
* [为名字空间配置最小和最大内存限制](/docs/tasks/administer-cluster/memory-constraint-namespace/)

<!--* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)-->
* [为名字空间配置最小和最大CPU限制](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

<!--* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)-->
* [为名字空间配置Pod配额](/docs/tasks/administer-cluster/quota-pod-namespace/)

<!--* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)-->
* [为API对象配置配额](/docs/tasks/administer-cluster/quota-api-object/)

<!--### For app developers-->
### 应用开发者可以参考的配置配额方面的文档

<!--* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)-->
* [为容器和Pod分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

<!--* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)-->
* [为容器和Pod分配CPU资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

<!--* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)-->
* [为Pod配置服务质量要求（Quality of Service）](/docs/tasks/configure-pod-container/quality-service-pod/)

{% endcapture %}


{% include templates/task.md %}
