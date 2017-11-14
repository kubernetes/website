---
cn-approvers:
- xiaosuiba
cn-reviewers:
- shirdrn 
title: 为 Namespace 配置最小和最大 CPU 限制
---


{% capture overview %}


本文展示了如何设置 namespace 中容器和 Pod 使用的 CPU 资源的最小和最大值。您可以设置 [LimitRange](/docs/api-reference/{{page.version}}/#limitrange-v1-core) 对象中 CPU 的最小和最大值。如果 Pod 没有符合 LimitRange 施加的限制，那么它就不能在 namespace 中创建。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}


集群中的每个节点至少需要 1 CPU。

{% endcapture %}


{% capture steps %}


## 创建一个 namespace


请创建一个 namespace，这样您在本练习中创建的资源就可以和集群中其余资源相互隔离。

```shell
kubectl create namespace constraints-cpu-example
```


## 创建一个 LimitRange 和一个 Pod


这是 LimitRange 的配置文件：

{% include code.html language="yaml" file="cpu-constraints.yaml" ghlink="/docs/tasks/administer-cluster/cpu-constraints.yaml" %}


创建 LimitRange:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-constraints.yaml --namespace=constraints-cpu-example
```


查看 LimitRange 的详细信息：

```shell
kubectl get limitrange cpu-min-max-demo-lr --output=yaml --namespace=constraints-cpu-example
```


输出显示了符合预期的最小和最大 CPU 限制。但请注意，即使您没有在配置文件中为 LimitRange 指定默认值，它们也会被自动创建。

```yaml
limits:
- default:
    cpu: 800m
  defaultRequest:
    cpu: 800m
  max:
    cpu: 800m
  min:
    cpu: 200m
  type: Container
```


现在，每当在 constraints-cpu-example namespace 中创建一个容器时，Kubernetes 都会执行下列步骤：


* 如果容器没有指定自己的 CPU 请求（CPU request）和限制（CPU limit），系统将会为其分配默认值。

* 验证容器的 CPU 请求大于等于 200 millicpu。

* 验证容器的 CPU 限制小于等于 800 millicpu。


这是一份包含一个容器的 Pod 的配置文件。这个容器的配置清单指定了 500 millicpu 的 CPU 请求和 800 millicpu 的 CPU 限制。这些配置符合 LimitRange 施加的最小和最大 CPU 限制。

{% include code.html language="yaml" file="cpu-constraints-pod.yaml" ghlink="/docs/tasks/administer-cluster/cpu-constraints-pod.yaml" %}


创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-constraints-pod.yaml --namespace=constraints-cpu-example
```


验证 Pod 的容器是否运行正常：

```shell
kubectl get pod constraints-cpu-demo --namespace=constraints-cpu-example
```


查看关于 Pod 的详细信息：

```shell
kubectl get pod constraints-cpu-demo --output=yaml --namespace=constraints-cpu-example
```


输出显示了容器的 CPU 请求为 500 millicpu，CPU 限制为 800 millicpu。这符合 LimitRange 施加的限制条件。



```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 500m
```


删除 Pod：

```shell
kubectl delete pod constraints-cpu-demo --namespace=constraints-cpu-example
```


## 尝试创建一个超过最大 CPU 限制的 Pod


这是一份包含一个容器的 Pod 的配置文件。这个容器的配置清单指定了 500 millicpu 的 CPU 请求和 1.5 cpu 的 CPU 限制。



{% include code.html language="yaml" file="cpu-constraints-pod-2.yaml" ghlink="/docs/tasks/administer-cluster/cpu-constraints-pod-2.yaml" %}


尝试创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-constraints-pod-2.yaml --namespace=constraints-cpu-example
```


输出显示 Pod 没有能够成功创建，因为容器指定的 CPU 限制值太大：

```
Error from server (Forbidden): error when creating "docs/tasks/administer-cluster/cpu-constraints-pod-2.yaml":
pods "constraints-cpu-demo-2" is forbidden: maximum cpu usage per Container is 800m, but limit is 1500m.
```


## 尝试创建一个不符合最小 CPU 请求的 Pod


这是一份包含一个容器的 Pod 的配置文件。这个容器的配置清单指定了 100 millicpu 的 CPU 请求和 800 millicpu 的 CPU 限制。

{% include code.html language="yaml" file="cpu-constraints-pod-3.yaml" ghlink="/docs/tasks/administer-cluster/cpu-constraints-pod-3.yaml" %}


尝试创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-constraints-pod-3.yaml --namespace=constraints-cpu-example
```


输出显示 Pod 没有能够成功创建，因为容器指定的 CPU 请求值太小：

```
Error from server (Forbidden): error when creating "docs/tasks/administer-cluster/cpu-constraints-pod-3.yaml":
pods "constraints-cpu-demo-4" is forbidden: minimum cpu usage per Container is 200m, but request is 100m.
```


## 创建一个没有指定任何 CPU 请求和限制的 Pod


这是一份包含一个容器的 Pod 的配置文件。这个容器没有指定 CPU 请求，也没有指定 CPU 限制。



{% include code.html language="yaml" file="cpu-constraints-pod-4.yaml" ghlink="/docs/tasks/administer-cluster/cpu-constraints-pod-4.yaml" %}


创建 Pod：


```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/cpu-constraints-pod-4.yaml --namespace=constraints-cpu-example
```


查看关于 Pod 的详细信息：

```
kubectl get pod constraints-cpu-demo-4 --namespace=constraints-cpu-example --output=yaml
```


输出显示 Pod 的容器具有 800 millicpu 的 CPU 请求和 800 millicpu 的 CPU 限制。容器是如何获取这些值的呢？


```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 800m
```


因为您的容器没有指定自己的 CPU 请求和限制，所以它将从 LimitRange 获取 [默认的 CPU 请求和限制值](/docs/tasks/administer-cluster/cpu-default-namespace/)。


到目前为止，您的容器可能在运行，也可能没有运行。回想起来，有一个先决条件就是节点必须至少拥有 1 CPU。如果每个节点都只有 1 CPU，那么任何一个节点上都没有足够的可用 CPU 来容纳 800 millicpu 的请求。如果碰巧使用的节点拥有 2 CPU，那么它可能会有足够的 CPU 来容纳 800 millicpu 的请求。


删除 Pod：

```
kubectl delete pod constraints-cpu-demo-4 --namespace=constraints-cpu-example
```


## 应用最小和最大 CPU 限制


LimitRange 在 namespace 中施加的最小和最大 CPU 限制只有在创建和更新 Pod 时才会被应用。改变 LimitRange 不会对之前创建的 Pod 造成影响。


## 最小和最大 CPU 限制的动因


作为一个集群管理员，您可能希望对 Pod 能够使用的 CPU 资源数量施加限制。例如：


* 集群中每个节点拥有 2 CPU。您不希望任何 Pod 请求超过 2 CPU 的资源，因为集群中没有节点能支持这个请求。

* 集群被生产部门和开发部门共享。 您希望生产负载最多使用 3 CPU 而将开发负载限制为 1 CPU。这种情况下，您可以为生产环境和开发环境创建单独的 namespace，并对每个 namespace 应用 CPU 限制。


## 清理


删除 namespace：

```shell
kubectl delete namespace constraints-cpu-example
```

{% endcapture %}

{% capture whatsnext %}


对于集群管理员


* [为 Namespace 配置默认内存请求和限制](/docs/tasks/administer-cluster/memory-default-namespace/)

* [为 Namespace 配置默认 CPU 请求和限制](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [为 Namespace 配置最小和最大 CPU 限制](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [为 Namespace 配置内存和 CPU 配额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [为 Namespace 配置 Pod 配额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [为 API 对象配置配额](/docs/tasks/administer-cluster/quota-api-object/)


### 对于应用开发者


* [为容器和 Pod 分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [为容器和 Pod 分配 CPU 资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [为 Pod 配置服务质量](/docs/tasks/configure-pod-container/quality-service-pod/)


{% endcapture %}


{% include templates/task.md %}


