---
title: 给容器分配非透明整型资源
---

{% capture overview %}

本页展示了如何给容器分配非透明整型资源。

{% include feature-state-alpha.md %}

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

在做这个练习之前，请在[给节点配置非透明整型资源](/docs/tasks/administer-cluster/opaque-integer-resource-node/)文档中进行练习，
该文档介绍了在一个节点上配置dongle资源。

{% endcapture %}


{% capture steps %}

## 给Pod分配非透明整型资源

为了请求一个非透明整型资源，需要在容器配置文件中包含`resources:requests`字段。
非透明整型资源类型前缀是`pod.alpha.kubernetes.io/opaque-int-resource-`。

下面是含有一个容器的Pod的配置文件:

{% include code.html language="yaml" file="oir-pod.yaml" ghlink="/cn/docs/tasks/configure-pod-container/oir-pod.yaml" %}

在配置文件中，可以看到容器请求了3个dongles资源。

创建Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/oir-pod.yaml
```

验证Pod是否正在运行:

```shell
kubectl get pod oir-demo
```

查询Pod的状态:

```shell
kubectl describe pod oir-demo
```

输出显示了dongle请求:

```yaml
Requests:
  pod.alpha.kubernetes.io/opaque-int-resource-dongle: 3
```

## 尝试创建第二个Pod

下面是含有一个容器的Pod的配置文件。该容器请求了两个dongles资源。

{% include code.html language="yaml" file="oir-pod-2.yaml" ghlink="/docs/tasks/configure-pod-container/oir-pod-2.yaml" %}

Kubernetes无法再满足两个dongles的请求，因为第一个Pod已经使用了四个可用dongles中的三个。

尝试创建Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/oir-pod-2.yaml
```

查询Pod的状态

```shell
kubectl describe pod oir-demo-2
```

输出显示该Pod无法被调度，因为没有节点有两个可用的dongles资源:


```
Conditions:
  Type    Status
  PodScheduled  False
...
Events:
  ...
  ... Warning   FailedScheduling  pod (oir-demo-2) failed to fit in any node
fit failure summary on nodes : Insufficient pod.alpha.kubernetes.io/opaque-int-resource-dongle (1)
```

查看Pod的状态:

```shell
kubectl get pod oir-demo-2
```

输出显示Pod已创建，但是没有被调度并运行在节点上。
它的状态为Pending:

```yaml
NAME         READY     STATUS    RESTARTS   AGE
oir-demo-2   0/1       Pending   0          6m
```

## 删除

删除本练习中创建的Pod:

```shell
kubectl delete pod oir-demo
```

{% endcapture %}

{% capture whatsnext %}

### 对于应用开发者

* [分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [分配CPU资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### 对于集群管理员

* [给节点配置非透明整型资源](/docs/tasks/administer-cluster/opaque-integer-resource-node/)

{% endcapture %}


{% include templates/task.md %}



