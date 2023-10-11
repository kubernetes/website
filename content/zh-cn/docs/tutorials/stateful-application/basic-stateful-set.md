---
title: StatefulSet 基础
content_type: tutorial
weight: 10
---
<!--
reviewers:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: StatefulSet Basics
content_type: tutorial
weight: 10
-->

<!-- overview -->

<!--
This tutorial provides an introduction to managing applications with
{{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}}.
It demonstrates how to create, delete, scale, and update the Pods of StatefulSets.
-->
本教程介绍了如何使用
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
来管理应用。
演示了如何创建、删除、扩容/缩容和更新 StatefulSet 的 Pod。

## {{% heading "prerequisites" %}}

<!--
Before you begin this tutorial, you should familiarize yourself with the
following Kubernetes concepts:
-->
在开始本教程之前，你应该熟悉以下 Kubernetes 的概念：

<!--
* [Pods](/docs/concepts/workloads/pods/)
* [Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)
* [Headless Services](/docs/concepts/services-networking/service/#headless-services)
* [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
* [PersistentVolume Provisioning](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/)
* [StatefulSets](/docs/concepts/workloads/controllers/statefulset/)
* The [kubectl](/docs/reference/kubectl/kubectl/) command line tool
-->
* [Pod](/zh-cn/docs/concepts/workloads/pods/)
* [Cluster DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)
* [Headless Service](/zh-cn/docs/concepts/services-networking/service/#headless-services)
* [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/)
* [PersistentVolume Provisioning](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/)
* [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
* [kubectl](/zh-cn/docs/reference/kubectl/kubectl/) 命令行工具

{{< note >}}
<!--
This tutorial assumes that your cluster is configured to dynamically provision
PersistentVolumes. If your cluster is not configured to do so, you
will have to manually provision two 1 GiB volumes prior to starting this
tutorial.
-->
本教程假设你的集群被配置为动态制备 PersistentVolume 卷。
如果没有这样配置，在开始本教程之前，你需要手动准备 2 个 1 GiB 的存储卷。
{{< /note >}}

## {{% heading "objectives" %}}

<!--
StatefulSets are intended to be used with stateful applications and distributed
systems. However, the administration of stateful applications and
distributed systems on Kubernetes is a broad, complex topic. In order to
demonstrate the basic features of a StatefulSet, and not to conflate the former
topic with the latter, you will deploy a simple web application using a StatefulSet.
-->
StatefulSet 旨在与有状态的应用及分布式系统一起使用。然而在 Kubernetes
上管理有状态应用和分布式系统是一个宽泛而复杂的话题。
为了演示 StatefulSet 的基本特性，并且不使前后的主题混淆，你将会使用 StatefulSet 部署一个简单的 Web 应用。

<!--
After this tutorial, you will be familiar with the following.
-->
在阅读本教程后，你将熟悉以下内容：

<!--
* How to create a StatefulSet
* How a StatefulSet manages its Pods
* How to delete a StatefulSet
* How to scale a StatefulSet
* How to update a StatefulSet's Pods
-->
* 如何创建 StatefulSet
* StatefulSet 怎样管理它的 Pod
* 如何删除 StatefulSet
* 如何对 StatefulSet 进行扩容/缩容
* 如何更新一个 StatefulSet 的 Pod

<!-- lessoncontent -->

<!--
## Creating a StatefulSet
-->
## 创建 StatefulSet   {#creating-a-statefulset}

<!--
Begin by creating a StatefulSet using the example below. It is similar to the
example presented in the
[StatefulSets](/docs/concepts/workloads/controllers/statefulset/) concept.
It creates a [headless Service](/docs/concepts/services-networking/service/#headless-services),
`nginx`, to publish the IP addresses of Pods in the StatefulSet, `web`.
-->
作为开始，使用如下示例创建一个 StatefulSet。它和
[StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/) 概念中的示例相似。
它创建了一个 [Headless Service](/zh-cn/docs/concepts/services-networking/service/#headless-services)
`nginx` 用来发布 StatefulSet `web` 中的 Pod 的 IP 地址。

{{% code_sample file="application/web/web.yaml" %}}

<!--
Download the example above, and save it to a file named `web.yaml`
-->
下载上面的例子并保存为文件 `web.yaml`。

<!--
You will need to use two terminal windows. In the first terminal, use
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) to watch the creation
of the StatefulSet's Pods.
-->
你需要使用两个终端窗口。在第一个终端中，使用
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get)
来监视 StatefulSet 的 Pod 的创建情况。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In the second terminal, use
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) to create the
headless Service and StatefulSet defined in `web.yaml`.
-->
在另一个终端中，使用 [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply)
来创建定义在 `web.yaml` 中的 Headless Service 和 StatefulSet。

```shell
kubectl apply -f web.yaml
```
```
service/nginx created
statefulset.apps/web created
```

<!--
The command above creates two Pods, each running an
[NGINX](https://www.nginx.com) webserver. Get the `nginx` Service...
-->
上面的命令创建了两个 Pod，每个都运行了一个 [NginX](https://www.nginx.com) Web 服务器。
获取 `nginx` Service：

```shell
kubectl get service nginx
```
```
NAME      TYPE         CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
nginx     ClusterIP    None         <none>        80/TCP    12s
```

<!--
...then get the `web` StatefulSet, to verify that both were created successfully:
-->
然后获取 `web` StatefulSet，以验证两者均已成功创建：

```shell
kubectl get statefulset web
```
```
NAME      DESIRED   CURRENT   AGE
web       2         1         20s
```

<!--
### Ordered Pod Creation
-->
### 顺序创建 Pod   {#ordered-pod-creation}

<!--
For a StatefulSet with _n_ replicas, when Pods are being deployed, they are
created sequentially, ordered from _{0..n-1}_. Examine the output of the
`kubectl get` command in the first terminal. Eventually, the output will
look like the example below.
-->
对于一个拥有 **n** 个副本的 StatefulSet，Pod 被部署时是按照 **{0..n-1}** 的序号顺序创建的。
在第一个终端中使用 `kubectl get` 检查输出。这个输出最终将看起来像下面的样子。

```shell
kubectl get pods -w -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         19s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         18s
```

<!--
Notice that the `web-1` Pod is not launched until the `web-0` Pod is
_Running_ (see [Pod Phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase))
and _Ready_ (see `type` in [Pod Conditions](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)).
-->
请注意，直到 `web-0` Pod 处于 **Running**（请参阅
[Pod 阶段](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)）
并 **Ready**（请参阅 [Pod 状况](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)中的
`type`）状态后，`web-1` Pod 才会被启动。

{{< note >}}
<!--
To configure the integer ordinal assigned to each Pod in a StatefulSet, see
[Start ordinal](/docs/concepts/workloads/controllers/statefulset/#start-ordinal).
-->
要配置分配给 StatefulSet 中每个 Pod 的整数序号，
请参阅[起始序号](/zh-cn/docs/concepts/workloads/controllers/statefulset/#start-ordinal)。
{{< /note >}}

<!--
## Pods in a StatefulSet
-->
## StatefulSet 中的 Pod   {#pods-in-a-statefulset}

<!--
Pods in a StatefulSet have a unique ordinal index and a stable network identity.
-->
StatefulSet 中的每个 Pod 拥有一个唯一的顺序索引和稳定的网络身份标识。

<!--
### Examining the Pod's ordinal Index
-->
### 检查 Pod 的顺序索引   {#examining-the-pod-s-ordinal-index}

<!--
Get the StatefulSet's Pods:
-->
获取 StatefulSet 的 Pod：

```shell
kubectl get pods -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          1m
web-1     1/1       Running   0          1m
```

<!--
As mentioned in the [StatefulSets](/docs/concepts/workloads/controllers/statefulset/)
concept, the Pods in a StatefulSet have a sticky, unique identity. This identity
is based on a unique ordinal index that is assigned to each Pod by the
StatefulSet {{< glossary_tooltip term_id="controller" text="controller">}}.  
The Pods' names take the form `<statefulset name>-<ordinal index>`.
Since the `web` StatefulSet has two replicas, it creates two Pods, `web-0` and `web-1`.
-->
如同 [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/) 概念中所提到的，
StatefulSet 中的每个 Pod 拥有一个具有黏性的、独一无二的身份标志。
这个标志基于 StatefulSet
{{< glossary_tooltip term_id="controller" text="控制器">}}分配给每个
Pod 的唯一顺序索引。
Pod 名称的格式为 `<statefulset 名称>-<序号索引>`。
`web` StatefulSet 拥有两个副本，所以它创建了两个 Pod：`web-0` 和 `web-1`。

<!--
### Using Stable network Identities
-->
### 使用稳定的网络身份标识   {#using-stable-network-identities}

<!--
Each Pod has a stable hostname based on its ordinal index. Use
[`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec) to execute the
`hostname` command in each Pod:
-->
每个 Pod 都拥有一个基于其顺序索引的稳定的主机名。使用
[`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec)
在每个 Pod 中执行 `hostname`：

```shell
for i in 0 1; do kubectl exec "web-$i" -- sh -c 'hostname'; done
```
```
web-0
web-1
```

<!--
Use [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run) to execute
a container that provides the `nslookup` command from the `dnsutils` package.
Using `nslookup` on the Pods' hostnames, you can examine their in-cluster DNS
addresses:
-->
使用 [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run)
运行一个提供 `nslookup` 命令的容器，该命令来自于 `dnsutils` 包。
通过对 Pod 的主机名执行 `nslookup`，你可以检查这些主机名在集群内部的 DNS 地址：

```shell
kubectl run -i --tty --image busybox:1.28 dns-test --restart=Never --rm
```

<!--
which starts a new shell. In that new shell, run:
-->
这将启动一个新的 Shell。在新 Shell 中运行：

```shell
# 在 dns-test 容器 Shell 中运行以下命令
nslookup web-0.nginx
```

<!--
The output is similar to:
-->
输出类似于：

```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-0.nginx
Address 1: 10.244.1.6

nslookup web-1.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-1.nginx
Address 1: 10.244.2.6
```

<!--
(and now exit the container shell: `exit`)
-->
（现在可以退出容器 Shell：`exit`）

<!--
The CNAME of the headless service points to SRV records (one for each Pod that
is Running and Ready). The SRV records point to A record entries that
contain the Pods' IP addresses.
-->
Headless service 的 CNAME 指向 SRV 记录（记录每个 Running 和 Ready 状态的 Pod）。
SRV 记录指向一个包含 Pod IP 地址的记录表项。

<!--
In one terminal, watch the StatefulSet's Pods:
-->
在一个终端中监视 StatefulSet 的 Pod：

```shell
kubectl get pod -w -l app=nginx
```

<!--
In a second terminal, use
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete) to delete all
the Pods in the StatefulSet:
-->
在另一个终端中使用
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete)
删除 StatefulSet 中所有的 Pod：

```shell
kubectl delete pod -l app=nginx
```
```
pod "web-0" deleted
pod "web-1" deleted
```

<!--
Wait for the StatefulSet to restart them, and for both Pods to transition to
Running and Ready:
-->
等待 StatefulSet 重启它们，并且两个 Pod 都变成 Running 和 Ready 状态：

```shell
kubectl get pod -w -l app=nginx
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     0/1       ContainerCreating   0          0s
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         34s
```

<!--
Use `kubectl exec` and `kubectl run` to view the Pods' hostnames and in-cluster
DNS entries. First, view the Pods' hostnames:
-->
使用 `kubectl exec` 和 `kubectl run` 查看 Pod 的主机名和集群内部的 DNS 表项。
首先，查看 Pod 的主机名：

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'hostname'; done
```
```
web-0
web-1
```

<!--
then, run:
-->
然后，运行：

```shell
kubectl run -i --tty --image busybox:1.28 dns-test --restart=Never --rm
```

<!--
which starts a new shell.  
In that new shell, run:
-->
这将启动一个新的 Shell。在新 Shell 中，运行：

```shell
# 在 dns-test 容器 Shell 中运行以下命令
nslookup web-0.nginx
```

<!--
The output is similar to:
-->
输出类似于：

```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-0.nginx
Address 1: 10.244.1.7

nslookup web-1.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-1.nginx
Address 1: 10.244.2.8
```

<!--
(and now exit the container shell: `exit`)
-->
（现在可以退出容器 Shell：`exit`）

<!--
The Pods' ordinals, hostnames, SRV records, and A record names have not changed,
but the IP addresses associated with the Pods may have changed. In the cluster
used for this tutorial, they have. This is why it is important not to configure
other applications to connect to Pods in a StatefulSet by IP address.
-->
Pod 的序号、主机名、SRV 条目和记录名称没有改变，但和 Pod 相关联的 IP 地址可能发生了改变。
在本教程中使用的集群中它们就改变了。这就是为什么不要在其他应用中使用
StatefulSet 中 Pod 的 IP 地址进行连接，这点很重要。

<!--
#### Discovery for specific Pods in a StatefulSet
-->
#### 发现 StatefulSet 中特定的 Pod   {#discovery-for-specific-pods-in-a-statefulset}

<!--
If you need to find and connect to the active members of a StatefulSet, you
should query the CNAME of the headless Service
(`nginx.default.svc.cluster.local`). The SRV records associated with the
CNAME will contain only the Pods in the StatefulSet that are Running and
Ready.
-->
如果你需要查找并连接一个 StatefulSet 的活动成员，你应该查询 Headless Service 的 CNAME。
和 CNAME 相关联的 SRV 记录只会包含 StatefulSet 中处于 Running 和 Ready 状态的 Pod。

<!--
If your application already implements connection logic that tests for
liveness and readiness, you can use the SRV records of the Pods (
`web-0.nginx.default.svc.cluster.local`,
`web-1.nginx.default.svc.cluster.local`), as they are stable, and your
application will be able to discover the Pods' addresses when they transition
to Running and Ready.
-->
如果你的应用已经实现了用于测试是否已存活（liveness）并就绪（readiness）的连接逻辑，
你可以使用 Pod 的 SRV 记录（`web-0.nginx.default.svc.cluster.local`、
`web-1.nginx.default.svc.cluster.local`）。因为它们是稳定的，并且当你的
Pod 的状态变为 Running 和 Ready 时，你的应用就能够发现它们的地址。

<!--
### Writing to stable Storage
-->
### 写入稳定的存储   {#writing-to-stable-storage}

<!--
Get the PersistentVolumeClaims for `web-0` and `web-1`:
-->
获取 `web-0` 和 `web-1` 的 PersistentVolumeClaims：

```shell
kubectl get pvc -l app=nginx
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           48s
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           48s
```

<!--
The StatefulSet controller created two
{{< glossary_tooltip text="PersistentVolumeClaims" term_id="persistent-volume-claim" >}}
that are bound to two
{{< glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" >}}.
-->
StatefulSet 控制器创建了两个
{{< glossary_tooltip text="PersistentVolumeClaims" term_id="persistent-volume-claim" >}}，
绑定到两个
{{< glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" >}}。

<!--
As the cluster used in this tutorial is configured to dynamically provision PersistentVolumes,
the PersistentVolumes were created and bound automatically.
-->
由于本教程使用的集群配置为动态制备
PersistentVolume 卷，所有的 PersistentVolume 卷都是自动创建和绑定的。

<!--
The NGINX webserver, by default, serves an index file from
`/usr/share/nginx/html/index.html`. The `volumeMounts` field in the
StatefulSet's `spec` ensures that the `/usr/share/nginx/html` directory is
backed by a PersistentVolume.
-->
NginX Web 服务器默认会加载位于 `/usr/share/nginx/html/index.html` 的 index 文件。
StatefulSet `spec` 中的 `volumeMounts` 字段保证了 `/usr/share/nginx/html`
文件夹由一个 PersistentVolume 卷支持。

<!--
Write the Pods' hostnames to their `index.html` files and verify that the NGINX
webservers serve the hostnames:
-->
将 Pod 的主机名写入它们的 `index.html` 文件并验证 NginX Web 服务器使用该主机名提供服务：

```shell
for i in 0 1; do kubectl exec "web-$i" -- sh -c 'echo "$(hostname)" > /usr/share/nginx/html/index.html'; done

for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```
```
web-0
web-1
```

{{< note >}}
<!--
If you instead see **403 Forbidden** responses for the above curl command,
you will need to fix the permissions of the directory mounted by the `volumeMounts`
(due to a [bug when using hostPath volumes](https://github.com/kubernetes/kubernetes/issues/2630)),
by running:
-->
请注意，如果你看见上面的 curl 命令返回了 **403 Forbidden** 的响应，你需要像这样修复使用 `volumeMounts`
（原因归咎于[使用 hostPath 卷时存在的缺陷](https://github.com/kubernetes/kubernetes/issues/2630)）
挂载的目录的权限，先运行：

`for i in 0 1; do kubectl exec web-$i -- chmod 755 /usr/share/nginx/html; done`

<!--
before retrying the `curl` command above.
-->
再重新尝试上面的 `curl` 命令。
{{< /note >}}

<!--
In one terminal, watch the StatefulSet's Pods:
-->
在一个终端监视 StatefulSet 的 Pod：

```shell
kubectl get pod -w -l app=nginx
```

<!--
In a second terminal, delete all of the StatefulSet's Pods:
-->
在另一个终端删除 StatefulSet 所有的 Pod：

```shell
kubectl delete pod -l app=nginx
```
```
pod "web-0" deleted
pod "web-1" deleted
```

<!--
Examine the output of the `kubectl get` command in the first terminal, and wait
for all of the Pods to transition to Running and Ready.
-->
在第一个终端里检查 `kubectl get` 命令的输出，等待所有 Pod 变成 Running 和 Ready 状态。

```shell
kubectl get pod -w -l app=nginx
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     0/1       ContainerCreating   0          0s
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         34s
```

<!--
Verify the web servers continue to serve their hostnames:
-->
验证所有 Web 服务器在继续使用它们的主机名提供服务：

```
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```
```
web-0
web-1
```

<!--
Even though `web-0` and `web-1` were rescheduled, they continue to serve their
hostnames because the PersistentVolumes associated with their
PersistentVolumeClaims are remounted to their `volumeMounts`. No matter what
node `web-0` and `web-1` are scheduled on, their PersistentVolumes will be
mounted to the appropriate mount points.
-->
虽然 `web-0` 和 `web-1` 被重新调度了，但它们仍然继续监听各自的主机名，因为和它们的
PersistentVolumeClaim 相关联的 PersistentVolume 卷被重新挂载到了各自的 `volumeMount` 上。
不管 `web-0` 和 `web-1` 被调度到了哪个节点上，它们的 PersistentVolume 卷将会被挂载到合适的挂载点上。

<!--
## Scaling a StatefulSet
-->
## 扩容/缩容 StatefulSet   {#scaling-a-statefulset}

<!--
Scaling a StatefulSet refers to increasing or decreasing the number of replicas.
This is accomplished by updating the `replicas` field. You can use either
[`kubectl scale`](/docs/reference/generated/kubectl/kubectl-commands/#scale) or
[`kubectl patch`](/docs/reference/generated/kubectl/kubectl-commands/#patch) to scale a StatefulSet.
-->
扩容/缩容 StatefulSet 指增加或减少它的副本数。这通过更新 `replicas` 字段完成。
你可以使用 [`kubectl scale`](/docs/reference/generated/kubectl/kubectl-commands/#scale)
或者 [`kubectl patch`](/docs/reference/generated/kubectl/kubectl-commands/#patch) 来扩容/缩容一个 StatefulSet。

<!--
### Scaling up
-->
### 扩容   {#scaling-up}

<!--
In one terminal window, watch the Pods in the StatefulSet:
-->
在一个终端窗口监视 StatefulSet 的 Pod：

```shell
kubectl get pods -w -l app=nginx
```

<!--
In another terminal window, use `kubectl scale` to scale the number of replicas
to 5:
-->
在另一个终端窗口使用 `kubectl scale` 扩展副本数为 5：

```shell
kubectl scale sts web --replicas=5
```
```
statefulset.apps/web scaled
```

<!--
Examine the output of the `kubectl get` command in the first terminal, and wait
for the three additional Pods to transition to Running and Ready.
-->
在第一个 终端中检查 `kubectl get` 命令的输出，等待增加的 3 个 Pod 的状态变为 Running 和 Ready。

```shell
kubectl get pods -w -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2h
web-1     1/1       Running   0          2h
NAME      READY     STATUS    RESTARTS   AGE
web-2     0/1       Pending   0          0s
web-2     0/1       Pending   0         0s
web-2     0/1       ContainerCreating   0         0s
web-2     1/1       Running   0         19s
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         0s
web-3     0/1       ContainerCreating   0         0s
web-3     1/1       Running   0         18s
web-4     0/1       Pending   0         0s
web-4     0/1       Pending   0         0s
web-4     0/1       ContainerCreating   0         0s
web-4     1/1       Running   0         19s
```

<!--
The StatefulSet controller scaled the number of replicas. As with
[StatefulSet creation](#ordered-pod-creation), the StatefulSet controller
created each Pod sequentially with respect to its ordinal index, and it
waited for each Pod's predecessor to be Running and Ready before launching the
subsequent Pod.
-->
StatefulSet 控制器扩展了副本的数量。
如同[创建 StatefulSet](#ordered-pod-creation) 所述，StatefulSet 按序号索引顺序创建各个
Pod，并且会等待前一个 Pod 变为 Running 和 Ready 才会启动下一个 Pod。

<!--
### Scaling Down
-->
### 缩容   {#scaling-down}

<!--
In one terminal, watch the StatefulSet's Pods:
-->
在一个终端监视 StatefulSet 的 Pod：

```shell
kubectl get pods -w -l app=nginx
```

<!--
In another terminal, use `kubectl patch` to scale the StatefulSet back down to
three replicas:
-->
在另一个终端使用 `kubectl patch` 将 StatefulSet 缩容回三个副本：

```shell
kubectl patch sts web -p '{"spec":{"replicas":3}}'
```
```
statefulset.apps/web patched
```

<!--
Wait for `web-4` and `web-3` to transition to Terminating.
-->
等待 `web-4` 和 `web-3` 状态变为 Terminating。

```shell
kubectl get pods -w -l app=nginx
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          3h
web-1     1/1       Running             0          3h
web-2     1/1       Running             0          55s
web-3     1/1       Running             0          36s
web-4     0/1       ContainerCreating   0          18s
NAME      READY     STATUS    RESTARTS   AGE
web-4     1/1       Running   0          19s
web-4     1/1       Terminating   0         24s
web-4     1/1       Terminating   0         24s
web-3     1/1       Terminating   0         42s
web-3     1/1       Terminating   0         42s
```

<!--
### Ordered Pod termination
-->
### 顺序终止 Pod   {#ordered-pod-termination}

<!--
The controller deleted one Pod at a time, in reverse order with respect to its
ordinal index, and it waited for each to be completely shutdown before
deleting the next.
-->
控制器会按照与 Pod 序号索引相反的顺序每次删除一个 Pod。在删除下一个 Pod 前会等待上一个被完全关闭。

<!--
Get the StatefulSet's PersistentVolumeClaims:
-->
获取 StatefulSet 的 PersistentVolumeClaims：

```shell
kubectl get pvc -l app=nginx
```
```
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-2   Bound     pvc-e1125b27-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-3   Bound     pvc-e1176df6-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-4   Bound     pvc-e11bb5f8-b508-11e6-932f-42010a800002   1Gi        RWO           13h
```

<!--
There are still five PersistentVolumeClaims and five PersistentVolumes.
When exploring a Pod's [stable storage](#writing-to-stable-storage), we saw that the PersistentVolumes
mounted to the Pods of a StatefulSet are not deleted when the StatefulSet's Pods are deleted.
This is still true when Pod deletion is caused by scaling the StatefulSet down.
-->
五个 PersistentVolumeClaims 和五个 PersistentVolume 卷仍然存在。
查看 Pod 的[稳定存储](#stable-storage)，我们发现当删除 StatefulSet 的
Pod 时，挂载到 StatefulSet 的 Pod 的 PersistentVolume 卷不会被删除。
当这种删除行为是由 StatefulSet 缩容引起时也是一样的。

<!--
## Updating StatefulSets
-->
## 更新 StatefulSet   {#updating-statefulsets}

<!--
In Kubernetes 1.7 and later, the StatefulSet controller supports automated updates.  The
strategy used is determined by the `spec.updateStrategy` field of the
StatefulSet API Object. This feature can be used to upgrade the container
images, resource requests and/or limits, labels, and annotations of the Pods in a
StatefulSet. There are two valid update strategies, `RollingUpdate` and
`OnDelete`.
-->
从 Kubernetes 1.7 版本开始，StatefulSet 控制器支持自动更新。
更新策略由 StatefulSet API 对象的 `spec.updateStrategy` 字段决定。这个特性能够用来更新一个
StatefulSet 中 Pod 的的容器镜像、资源请求和限制、标签和注解。

<!--
`RollingUpdate` update strategy is the default for StatefulSets.
-->
`RollingUpdate` 更新策略是 StatefulSet 默认策略。

<!--
### RollingUpdate {#rolling-update}
-->
### 滚动更新   {#rolling-update}

<!--
The `RollingUpdate` update strategy will update all Pods in a StatefulSet, in
reverse ordinal order, while respecting the StatefulSet guarantees.
-->
`RollingUpdate` 更新策略会更新一个 StatefulSet 中的所有
Pod，采用与序号索引相反的顺序并遵循 StatefulSet 的保证。

<!--
Patch the `web` StatefulSet to apply the `RollingUpdate` update strategy:
-->
对 `web` StatefulSet 应用 Patch 操作来应用 `RollingUpdate` 更新策略：

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate"}}}'
```
```
statefulset.apps/web patched
```

<!--
In one terminal window, patch the `web` StatefulSet to change the container
image again:
-->
在一个终端窗口中对 `web` StatefulSet 执行 patch 操作来再次改变容器镜像：

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"gcr.io/google_containers/nginx-slim:0.8"}]'
```
```
statefulset.apps/web patched
```

<!--
In another terminal, watch the Pods in the StatefulSet:
-->
在另一个终端监控 StatefulSet 中的 Pod：

```shell
kubectl get pod -l app=nginx -w
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          7m
web-1     1/1       Running   0          7m
web-2     1/1       Running   0          8m
web-2     1/1       Terminating   0         8m
web-2     1/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Pending   0         0s
web-2     0/1       Pending   0         0s
web-2     0/1       ContainerCreating   0         0s
web-2     1/1       Running   0         19s
web-1     1/1       Terminating   0         8m
web-1     0/1       Terminating   0         8m
web-1     0/1       Terminating   0         8m
web-1     0/1       Terminating   0         8m
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         6s
web-0     1/1       Terminating   0         7m
web-0     1/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Pending   0         0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         10s
```

<!--
The Pods in the StatefulSet are updated in reverse ordinal order. The
StatefulSet controller terminates each Pod, and waits for it to transition to Running and
Ready prior to updating the next Pod. Note that, even though the StatefulSet
controller will not proceed to update the next Pod until its ordinal successor
is Running and Ready, it will restore any Pod that fails during the update to
its current version.
-->
StatefulSet 里的 Pod 采用和序号相反的顺序更新。在更新下一个 Pod 前，StatefulSet
控制器终止每个 Pod 并等待它们变成 Running 和 Ready。
请注意，虽然在顺序后继者变成 Running 和 Ready 之前 StatefulSet 控制器不会更新下一个
Pod，但它仍然会重建任何在更新过程中发生故障的 Pod，使用的是它们当前的版本。

<!--
Pods that have already received the update will be restored to the updated version,
and Pods that have not yet received the update will be restored to the previous
version. In this way, the controller attempts to continue to keep the application
healthy and the update consistent in the presence of intermittent failures.
-->
已经接收到更新请求的 Pod 将会被恢复为更新的版本，没有收到请求的 Pod 则会被恢复为之前的版本。
像这样，控制器尝试继续使应用保持健康并在出现间歇性故障时保持更新的一致性。

<!--
Get the Pods to view their container images:
-->
获取 Pod 来查看它们的容器镜像：

```shell
for p in 0 1 2; do kubectl get pod "web-$p" --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
```
```
registry.k8s.io/nginx-slim:0.8
registry.k8s.io/nginx-slim:0.8
registry.k8s.io/nginx-slim:0.8
```

<!--
All the Pods in the StatefulSet are now running the previous container image.
-->
StatefulSet 中的所有 Pod 现在都在运行之前的容器镜像。

{{< note >}}
<!--
You can also use `kubectl rollout status sts/<name>` to view
the status of a rolling update to a StatefulSet
-->
你还可以使用 `kubectl rollout status sts/<名称>` 来查看
StatefulSet 的滚动更新状态。
{{< /note >}}

<!--
#### Staging an update
-->
#### 分段更新   {#staging-an-update}

<!--
You can stage an update to a StatefulSet by using the `partition` parameter of
the `RollingUpdate` update strategy. A staged update will keep all of the Pods
in the StatefulSet at the current version while allowing mutations to the
StatefulSet's `.spec.template`.
-->
你可以使用 `RollingUpdate` 更新策略的 `partition` 参数来分段更新一个 StatefulSet。
分段的更新将会使 StatefulSet 中的其余所有 Pod 保持当前版本的同时允许改变
StatefulSet 的 `.spec.template`。

<!--
Patch the `web` StatefulSet to add a partition to the `updateStrategy` field:
-->
对 `web` StatefulSet 执行 Patch 操作为 `updateStrategy` 字段添加一个分区：

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":3}}}}'
```
```
statefulset.apps/web patched
```

<!--
Patch the StatefulSet again to change the container's image:
-->
再次 Patch StatefulSet 来改变容器镜像：

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"registry.k8s.io/nginx-slim:0.7"}]'
```
```
statefulset.apps/web patched
```

<!--
Delete a Pod in the StatefulSet:
-->
删除 StatefulSet 中的 Pod：

```shell
kubectl delete pod web-2
```
```
pod "web-2" deleted
```

<!--
Wait for the Pod to be Running and Ready.
-->
等待 Pod 变成 Running 和 Ready。

```shell
kubectl get pod -l app=nginx -w
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```

<!--
Get the Pod's container image:
-->
获取 Pod 的容器镜像：

```shell
kubectl get pod web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```
```
registry.k8s.io/nginx-slim:0.8
```

<!--
Notice that, even though the update strategy is `RollingUpdate` the StatefulSet
restored the Pod with its original container. This is because the
ordinal of the Pod is less than the `partition` specified by the
`updateStrategy`.
-->
请注意，虽然更新策略是 `RollingUpdate`，StatefulSet 还是会使用原始的容器恢复 Pod。
这是因为 Pod 的序号比 `updateStrategy` 指定的 `partition` 更小。

<!--
#### Rolling Out a canary
-->
#### 金丝雀发布   {#rolling-out-a-canary}

<!--
You can roll out a canary to test a modification by decrementing the `partition`
you specified [above](#staging-an-update).
-->
你可以通过减少[上文](#staging-an-update)指定的
`partition` 来进行金丝雀发布，以此来测试你的程序的改动。

<!--
Patch the StatefulSet to decrement the partition:
-->
通过 patch 命令修改 StatefulSet 来减少分区：

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":2}}}}'
```
```
statefulset.apps/web patched
```

<!--
Wait for `web-2` to be Running and Ready.
-->
等待 `web-2` 变成 Running 和 Ready。

```shell
kubectl get pod -l app=nginx -w
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```

<!--
Get the Pod's container:
-->
获取 Pod 的容器：

```shell
kubectl get pod web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```
```
registry.k8s.io/nginx-slim:0.7

```

<!--
When you changed the `partition`, the StatefulSet controller automatically
updated the `web-2` Pod because the Pod's ordinal was greater than or equal to
the `partition`.
-->
当你改变 `partition` 时，StatefulSet 会自动更新 `web-2`
Pod，这是因为 Pod 的序号大于或等于 `partition`。

<!--
Delete the `web-1` Pod:
-->
删除 `web-1` Pod：

```shell
kubectl delete pod web-1
```
```
pod "web-1" deleted
```

<!--
Wait for the `web-1` Pod to be Running and Ready.
-->
等待 `web-1` 变成 Running 和 Ready。

```shell
kubectl get pod -l app=nginx -w
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME      READY     STATUS        RESTARTS   AGE
web-0     1/1       Running       0          6m
web-1     0/1       Terminating   0          6m
web-2     1/1       Running       0          2m
web-1     0/1       Terminating   0         6m
web-1     0/1       Terminating   0         6m
web-1     0/1       Terminating   0         6m
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         18s
```

<!--
Get the `web-1` Pod's container image:
-->
获取 `web-1` Pod 的容器镜像：

```shell
kubectl get pod web-1 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```
```
registry.k8s.io/nginx-slim:0.8
```

<!--
`web-1` was restored to its original configuration because the Pod's ordinal
was less than the partition. When a partition is specified, all Pods with an
ordinal that is greater than or equal to the partition will be updated when the
StatefulSet's `.spec.template` is updated. If a Pod that has an ordinal less
than the partition is deleted or otherwise terminated, it will be restored to
its original configuration.
-->
`web-1` 被按照原来的配置恢复，因为 Pod 的序号小于分区。当指定了分区时，如果更新了
StatefulSet 的 `.spec.template`，则所有序号大于或等于分区的 Pod 都将被更新。
如果一个序号小于分区的 Pod 被删除或者终止，它将被按照原来的配置恢复。

<!--
#### Phased Roll outs
-->
#### 分阶段的发布   {#phased-roll-outs}

<!--
You can perform a phased roll out (e.g. a linear, geometric, or exponential
roll out) using a partitioned rolling update in a similar manner to how you
rolled out a [canary](#rolling-out-a-canary). To perform a phased roll out, set
the `partition` to the ordinal at which you want the controller to pause the
update.
-->
你可以使用类似[金丝雀发布](#rolling-out-a-canary)的方法执行一次分阶段的发布
（例如一次线性的、等比的或者指数形式的发布）。
要执行一次分阶段的发布，你需要设置 `partition` 为希望控制器暂停更新的序号。

<!--
The partition is currently set to `2`. Set the partition to `0`:
-->
分区当前为 `2`。请将分区设置为 `0`：

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":0}}}}'
```
```
statefulset.apps/web patched
```

<!--
Wait for all of the Pods in the StatefulSet to become Running and Ready.
-->
等待 StatefulSet 中的所有 Pod 变成 Running 和 Ready。

```shell
kubectl get pod -l app=nginx -w
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          3m
web-1     0/1       ContainerCreating   0          11s
web-2     1/1       Running             0          2m
web-1     1/1       Running   0         18s
web-0     1/1       Terminating   0         3m
web-0     1/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Pending   0         0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         3s
```

<!--
Get the container image details for the Pods in the StatefulSet:
-->
获取 StatefulSet 中 Pod 的容器镜像详细信息：

```shell
for p in 0 1 2; do kubectl get pod "web-$p" --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
```
```
registry.k8s.io/nginx-slim:0.7
registry.k8s.io/nginx-slim:0.7
registry.k8s.io/nginx-slim:0.7
```

<!--
By moving the `partition` to `0`, you allowed the StatefulSet to
continue the update process.
-->
将 `partition` 改变为 `0` 以允许 StatefulSet 继续更新过程。

<!--
### OnDelete {#on-delete}
-->
### OnDelete 策略   {#on-delete}

<!--
The `OnDelete` update strategy implements the legacy (1.6 and prior) behavior,
When you select this update strategy, the StatefulSet controller will not
automatically update Pods when a modification is made to the StatefulSet's
`.spec.template` field. This strategy can be selected by setting the
`.spec.template.updateStrategy.type` to `OnDelete`.
-->
`OnDelete` 更新策略实现了传统（1.7 之前）行为，它也是默认的更新策略。
当你选择这个更新策略并修改 StatefulSet 的 `.spec.template` 字段时，StatefulSet 控制器将不会自动更新 Pod。

<!--
## Deleting StatefulSets
-->
## 删除 StatefulSet   {#deleting-statefulsets}

<!--
StatefulSet supports both Non-Cascading and Cascading deletion. In a
Non-Cascading Delete, the StatefulSet's Pods are not deleted when the StatefulSet is deleted. In a Cascading Delete, both the StatefulSet and its Pods are
deleted.
-->
StatefulSet 同时支持级联和非级联删除。使用非级联方式删除 StatefulSet 时，StatefulSet
的 Pod 不会被删除。使用级联删除时，StatefulSet 和它的 Pod 都会被删除。

<!--
### Non-cascading delete
-->
### 非级联删除   {#non-cascading-delete}

<!--
In one terminal window, watch the Pods in the StatefulSet.
-->
在一个终端窗口监视 StatefulSet 中的 Pod。

```
kubectl get pods -w -l app=nginx
```

<!--
Use [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete) to delete the
StatefulSet. Make sure to supply the `--cascade=orphan` parameter to the
command. This parameter tells Kubernetes to only delete the StatefulSet, and to
not delete any of its Pods.
-->
使用 [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete)
删除 StatefulSet。请确保提供了 `--cascade=orphan` 参数给命令。这个参数告诉
Kubernetes 只删除 StatefulSet 而不要删除它的任何 Pod。

```shell
kubectl delete statefulset web --cascade=orphan
```
```
statefulset.apps "web" deleted
```

<!--
Get the Pods, to examine their status:
-->
获取 Pod 来检查它们的状态：

```shell
kubectl get pods -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          6m
web-1     1/1       Running   0          7m
web-2     1/1       Running   0          5m
```

<!--
Even though `web` has been deleted, all of the Pods are still Running and Ready.
Delete `web-0`:
-->
虽然 `web`  已经被删除了，但所有 Pod 仍然处于 Running 和 Ready 状态。
删除 `web-0`：

```shell
kubectl delete pod web-0
```
```
pod "web-0" deleted
```

<!--
Get the StatefulSet's Pods:
-->
获取 StatefulSet 的 Pod：

```shell
kubectl get pods -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-1     1/1       Running   0          10m
web-2     1/1       Running   0          7m
```

<!--
As the `web` StatefulSet has been deleted, `web-0` has not been relaunched.
-->
由于 `web` StatefulSet 已经被删除，`web-0` 没有被重新启动。

<!--
In one terminal, watch the StatefulSet's Pods.
-->
在一个终端监控 StatefulSet 的 Pod。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In a second terminal, recreate the StatefulSet. Note that, unless
you deleted the `nginx` Service (which you should not have), you will see
an error indicating that the Service already exists.
-->
在另一个终端里重新创建 StatefulSet。请注意，除非你删除了 `nginx`
Service（你不应该这样做），你将会看到一个错误，提示 Service 已经存在。

```shell
kubectl apply -f web.yaml
```
```
statefulset.apps/web created
service/nginx unchanged
```

<!--
Ignore the error. It only indicates that an attempt was made to create the _nginx_
headless Service even though that Service already exists.
-->
请忽略这个错误。它仅表示 kubernetes 进行了一次创建 **nginx** Headless Service
的尝试，尽管那个 Service 已经存在。

<!--
Examine the output of the `kubectl get` command running in the first terminal.
-->
在第一个终端中运行并检查 `kubectl get` 命令的输出。

```shell
kubectl get pods -w -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-1     1/1       Running   0          16m
web-2     1/1       Running   0          2m
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         18s
web-2     1/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
```

<!--
When the `web` StatefulSet was recreated, it first relaunched `web-0`.
Since `web-1` was already Running and Ready, when `web-0` transitioned to
Running and Ready, it adopted this Pod. Since you recreated the StatefulSet
with `replicas` equal to 2, once `web-0` had been recreated, and once
`web-1` had been determined to already be Running and Ready, `web-2` was
terminated.
-->
当重新创建 `web` StatefulSet 时，`web-0` 被第一个重新启动。
由于 `web-1` 已经处于 Running 和 Ready 状态，当 `web-0` 变成 Running 和 Ready 时，
StatefulSet 会接收这个 Pod。由于你重新创建的 StatefulSet 的 `replicas` 等于 2，
一旦 `web-0` 被重新创建并且 `web-1` 被认为已经处于 Running 和 Ready 状态时，`web-2` 将会被终止。

<!--
Let's take another look at the contents of the `index.html` file served by the
Pods' webservers:
-->
让我们再看看被 Pod 的 Web 服务器加载的 `index.html` 的内容：

```shell
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```
web-0
web-1
```

<!--
Even though you deleted both the StatefulSet and the `web-0` Pod, it still
serves the hostname originally entered into its `index.html` file. This is
because the StatefulSet never deletes the PersistentVolumes associated with a
Pod. When you recreated the StatefulSet and it relaunched `web-0`, its original
PersistentVolume was remounted.
-->
尽管你同时删除了 StatefulSet 和 `web-0` Pod，但它仍然使用最初写入 `index.html` 文件的主机名进行服务。
这是因为 StatefulSet 永远不会删除和一个 Pod 相关联的 PersistentVolume 卷。
当你重建这个 StatefulSet 并且重新启动了 `web-0` 时，它原本的 PersistentVolume 卷会被重新挂载。

<!--
### Cascading delete
-->
### 级联删除   {#cascading-delete}

<!--
In one terminal window, watch the Pods in the StatefulSet.
-->
在一个终端窗口监视 StatefulSet 里的 Pod。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In another terminal, delete the StatefulSet again. This time, omit the
`--cascade=orphan` parameter.
-->
在另一个窗口中再次删除这个 StatefulSet，这次省略 `--cascade=orphan` 参数。

```shell
kubectl delete statefulset web
```

```
statefulset.apps "web" deleted
```

<!--
Examine the output of the `kubectl get` command running in the first terminal,
and wait for all of the Pods to transition to Terminating.
-->
在第一个终端检查 `kubectl get` 命令的输出，并等待所有的 Pod 变成 Terminating 状态。

```shell
kubectl get pods -w -l app=nginx
```

```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          11m
web-1     1/1       Running   0          27m
NAME      READY     STATUS        RESTARTS   AGE
web-0     1/1       Terminating   0          12m
web-1     1/1       Terminating   0         29m
web-0     0/1       Terminating   0         12m
web-0     0/1       Terminating   0         12m
web-0     0/1       Terminating   0         12m
web-1     0/1       Terminating   0         29m
web-1     0/1       Terminating   0         29m
web-1     0/1       Terminating   0         29m
```

<!--
As you saw in the [Scaling Down](#scaling-down) section, the Pods
are terminated one at a time, with respect to the reverse order of their ordinal
indices. Before terminating a Pod, the StatefulSet controller waits for
the Pod's successor to be completely terminated.
-->
如同你在[缩容](#scaling-down)章节看到的，这些 Pod 按照与其序号索引相反的顺序每次终止一个。
在终止一个 Pod 前，StatefulSet 控制器会等待 Pod 后继者被完全终止。

{{< note >}}
<!--
Although a cascading delete removes a StatefulSet together with its Pods,
the cascade does not delete the headless Service associated with the StatefulSet.
You must delete the `nginx` Service manually.
-->
尽管级联删除会删除 StatefulSet 及其 Pod，但级联不会删除与 StatefulSet
关联的 Headless Service。你必须手动删除 `nginx` Service。
{{< /note >}}

```shell
kubectl delete service nginx
```

```
service "nginx" deleted
```

<!--
Recreate the StatefulSet and headless Service one more time:
-->
再一次重新创建 StatefulSet 和 Headless Service：

```shell
kubectl apply -f web.yaml
```

```
service/nginx created
statefulset.apps/web created
```

<!--
When all of the StatefulSet's Pods transition to Running and Ready, retrieve
the contents of their `index.html` files:
-->
当 StatefulSet 所有的 Pod 变成 Running 和 Ready 时，获取它们的 `index.html` 文件的内容：

```shell
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```
web-0
web-1
```

<!--
Even though you completely deleted the StatefulSet, and all of its Pods, the
Pods are recreated with their PersistentVolumes mounted, and `web-0` and
`web-1` continue to serve their hostnames.
-->
即使你已经删除了 StatefulSet 和它的全部 Pod，这些 Pod 将会被重新创建并挂载它们的
PersistentVolume 卷，并且 `web-0` 和 `web-1` 将继续使用它的主机名提供服务。

<!--
Finally, delete the `nginx` Service...
-->
最后删除 `nginx` Service：

```shell
kubectl delete service nginx
```

```
service "nginx" deleted
```

<!--
...and the `web` StatefulSet:
-->
并且删除 `web` StatefulSet：

```shell
kubectl delete statefulset web
```

```
statefulset "web" deleted
```

<!--
## Pod Management policy
-->
## Pod 管理策略   {#pod-management-policy}

<!--
For some distributed systems, the StatefulSet ordering guarantees are
unnecessary and/or undesirable. These systems require only uniqueness and
identity. To address this, in Kubernetes 1.7, we introduced
`.spec.podManagementPolicy` to the StatefulSet API Object.
-->
对于某些分布式系统来说，StatefulSet 的顺序性保证是不必要和/或者不应该的。
这些系统仅仅要求唯一性和身份标志。为了解决这个问题，在 Kubernetes 1.7
中我们针对 StatefulSet API 对象引入了 `.spec.podManagementPolicy`。
此选项仅影响扩缩操作的行为。更新不受影响。

<!--
### OrderedReady Pod management
-->
### OrderedReady Pod 管理策略   {#orderedready-pod-management}

<!--
`OrderedReady` pod management is the default for StatefulSets. It tells the
StatefulSet controller to respect the ordering guarantees demonstrated
above.
-->
`OrderedReady` Pod 管理策略是 StatefulSet 的默认选项。它告诉
StatefulSet 控制器遵循上文展示的顺序性保证。

<!--
### Parallel Pod management
-->
### Parallel Pod 管理策略   {#parallel-pod-management}

<!--
`Parallel` pod management tells the StatefulSet controller to launch or
terminate all Pods in parallel, and not to wait for Pods to become Running
and Ready or completely terminated prior to launching or terminating another
Pod. This option only affects the behavior for scaling operations. Updates are not affected.
-->
`Parallel` Pod 管理策略告诉 StatefulSet 控制器并行的终止所有 Pod，
在启动或终止另一个 Pod 前，不必等待这些 Pod 变成 Running 和 Ready 或者完全终止状态。

{{{% code_sample file="application/web/web-parallel.yaml" %}}

<!--
Download the example above, and save it to a file named `web-parallel.yaml`
-->
下载上面的例子并保存为 `web-parallel.yaml`。

<!--
This manifest is identical to the one you downloaded above except that the `.spec.podManagementPolicy`
of the `web` StatefulSet is set to `Parallel`.
-->
这份清单和你在上文下载的完全一样，只是 `web` StatefulSet 的
`.spec.podManagementPolicy` 设置成了 `Parallel`。

<!--
In one terminal, watch the Pods in the StatefulSet.
-->
在一个终端窗口监视 StatefulSet 中的 Pod。

```shell
kubectl get pod -l app=nginx -w
```

<!--
In another terminal, create the StatefulSet and Service in the manifest:
-->
在另一个终端窗口创建清单中的 StatefulSet 和 Service：

```shell
kubectl apply -f web-parallel.yaml
```
```
service/nginx created
statefulset.apps/web created
```

<!--
Examine the output of the `kubectl get` command that you executed in the first terminal.
-->
查看你在第一个终端中运行的 `kubectl get` 命令的输出。

```shell
kubectl get pod -l app=nginx -w
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-1     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         10s
web-1     1/1       Running   0         10s
```

<!--
The StatefulSet controller launched both `web-0` and `web-1` at the same time.
-->
StatefulSet 控制器同时启动了 `web-0` 和 `web-1`。

<!--
Keep the second terminal open, and, in another terminal window scale the
StatefulSet:
-->
保持第二个终端打开，并在另一个终端窗口中扩容 StatefulSet：

```shell
kubectl scale statefulset/web --replicas=4
```
```
statefulset.apps/web scaled
```

<!--
Examine the output of the terminal where the `kubectl get` command is running.
-->
在 `kubectl get` 命令运行的终端里检查它的输出。

```
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         7s
web-3     0/1       ContainerCreating   0         7s
web-2     1/1       Running   0         10s
web-3     1/1       Running   0         26s
```

<!--
The StatefulSet launched two new Pods, and it did not wait for
the first to become Running and Ready prior to launching the second.
-->
StatefulSet 启动了两个新的 Pod，而且在启动第二个之前并没有等待第一个变成 Running 和 Ready 状态。

## {{% heading "cleanup" %}}

<!--
You should have two terminals open, ready for you to run `kubectl` commands as
part of cleanup.
-->
你应该打开两个终端，准备在清理过程中运行 `kubectl` 命令。

```shell
kubectl delete sts web
# sts is an abbreviation for statefulset
```

<!--
You can watch `kubectl get` to see those Pods being deleted.
-->
你可以监视 `kubectl get` 来查看那些 Pod 被删除：

```shell
kubectl get pod -l app=nginx -w
```
```
web-3     1/1       Terminating   0         9m
web-2     1/1       Terminating   0         9m
web-3     1/1       Terminating   0         9m
web-2     1/1       Terminating   0         9m
web-1     1/1       Terminating   0         44m
web-0     1/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-3     0/1       Terminating   0         9m
web-2     0/1       Terminating   0         9m
web-1     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-2     0/1       Terminating   0         9m
web-2     0/1       Terminating   0         9m
web-2     0/1       Terminating   0         9m
web-1     0/1       Terminating   0         44m
web-1     0/1       Terminating   0         44m
web-1     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-3     0/1       Terminating   0         9m
web-3     0/1       Terminating   0         9m
web-3     0/1       Terminating   0         9m
```

<!--
During deletion, a StatefulSet removes all Pods concurrently; it does not wait for
a Pod's ordinal successor to terminate prior to deleting that Pod.
-->
在删除过程中，StatefulSet 将并发的删除所有 Pod，在删除一个
Pod 前不会等待它的顺序后继者终止。

<!--
Close the terminal where the `kubectl get` command is running and delete the `nginx`
Service:
-->
关闭 `kubectl get` 命令运行的终端并删除 `nginx` Service：

```shell
kubectl delete svc nginx
```

<!--
Delete the persistent storage media for the PersistentVolumes used in this tutorial.
-->

删除本教程中用到的 PersistentVolume 卷的持久化存储介质：

```shell
kubectl get pvc
```
```
NAME        STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
www-web-0   Bound    pvc-2bf00408-d366-4a12-bad0-1869c65d0bee   1Gi        RWO            standard       25m
www-web-1   Bound    pvc-ba3bfe9c-413e-4b95-a2c0-3ea8a54dbab4   1Gi        RWO            standard       24m
www-web-2   Bound    pvc-cba6cfa6-3a47-486b-a138-db5930207eaf   1Gi        RWO            standard       15m
www-web-3   Bound    pvc-0c04d7f0-787a-4977-8da3-d9d3a6d8d752   1Gi        RWO            standard       15m
www-web-4   Bound    pvc-b2c73489-e70b-4a4e-9ec1-9eab439aa43e   1Gi        RWO            standard       14m
```

```shell
kubectl get pv
```
```
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS   REASON   AGE
pvc-0c04d7f0-787a-4977-8da3-d9d3a6d8d752   1Gi        RWO            Delete           Bound    default/www-web-3   standard                15m
pvc-2bf00408-d366-4a12-bad0-1869c65d0bee   1Gi        RWO            Delete           Bound    default/www-web-0   standard                25m
pvc-b2c73489-e70b-4a4e-9ec1-9eab439aa43e   1Gi        RWO            Delete           Bound    default/www-web-4   standard                14m
pvc-ba3bfe9c-413e-4b95-a2c0-3ea8a54dbab4   1Gi        RWO            Delete           Bound    default/www-web-1   standard                24m
pvc-cba6cfa6-3a47-486b-a138-db5930207eaf   1Gi        RWO            Delete           Bound    default/www-web-2   standard                15m
```

```shell
kubectl delete pvc www-web-0 www-web-1 www-web-2 www-web-3 www-web-4
```

```
persistentvolumeclaim "www-web-0" deleted
persistentvolumeclaim "www-web-1" deleted
persistentvolumeclaim "www-web-2" deleted
persistentvolumeclaim "www-web-3" deleted
persistentvolumeclaim "www-web-4" deleted
```

```shell
kubectl get pvc
```

```
No resources found in default namespace.
```
{{< note >}}
<!--
You also need to delete the persistent storage media for the PersistentVolumes
used in this tutorial.
-->
你需要删除本教程中用到的 PersistentVolume 卷的持久化存储介质。

<!--
Follow the necessary steps, based on your environment, storage configuration,
and provisioning method, to ensure that all storage is reclaimed.
-->
基于你的环境、存储配置和制备方式，按照必需的步骤保证回收所有的存储。
{{< /note >}}
