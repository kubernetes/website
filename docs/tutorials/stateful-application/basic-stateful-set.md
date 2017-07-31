---
assignees:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: StatefulSet基础
---

{% capture overview %}
<!--
This tutorial provides an introduction to managing applications with
[StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/). It 
demonstrates how to create, delete, scale, and update the Pods of StatefulSets.
-->
本教程介绍了如何使用[StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/)来管理应用。演示了如何创建、删除、扩容/缩容和更新StatefulSets的Pods。
{% endcapture %}

{% capture prerequisites %}
<!--
Before you begin this tutorial, you should familiarize yourself with the 
following Kubernetes concepts.

* [Pods](/docs/user-guide/pods/single-container/)
* [Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)
* [Headless Services](/docs/concepts/services-networking/service/#headless-services)
* [PersistentVolumes](/docs/concepts/storage/volumes/)
* [PersistentVolume Provisioning](http://releases.k8s.io/{{page.githubbranch}}/examples/persistent-volume-provisioning/)
* [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/)
* [kubectl CLI](/docs/user-guide/kubectl)

This tutorial assumes that your cluster is configured to dynamically provision 
PersistentVolumes. If your cluster is not configured to do so, you
will have to manually provision five 1 GiB volumes prior to starting this 
tutorial.
-->
在开始本教程之前，你应该熟悉以下Kubernetes的概念：

* [Pods](/docs/user-guide/pods/single-container/)
* [Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)
* [Headless Services](/docs/concepts/services-networking/service/#headless-services)
* [PersistentVolumes](/docs/concepts/storage/volumes/)
* [PersistentVolume Provisioning](http://releases.k8s.io/{{page.githubbranch}}/examples/persistent-volume-provisioning/)
* [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/)
* [kubectl CLI](/docs/user-guide/kubectl)

本教程假设你的集群被配置为动态的提供PersistentVolumes。如果没有这样配置，在开始本教程之前，你需要手动准备5个1 GiB的存储卷。
{% endcapture %}

{% capture objectives %}
<!--
StatefulSets are intended to be used with stateful applications and distributed 
systems. However, the administration of stateful applications and 
distributed systems on Kubernetes is a broad, complex topic. In order to 
demonstrate the basic features of a StatefulSet, and to not conflate the former 
topic with the latter, you will deploy a simple web application using a StatefulSet.

After this tutorial, you will be familiar with the following.

* How to create a StatefulSet

* How a StatefulSet manages its Pods

* How to delete a StatefulSet

* How to scale a StatefulSet

* How to update a StatefulSet's Pods
  -->
  StatefulSets旨在与有状态的应用及分布式系统一起使用。然而在Kubernetes上管理有状态应用和分布式系统是一个宽泛而复杂的话题。为了演示StatefulSet的基本特性，并且不使前后的主题混淆，你将会使用StatefulSet部署一个简单的web应用。

在阅读本教程后，你将熟悉以下内容：

* 如何创建一个StatefulSet
* StatefulSet怎样管理它的Pods
* 如何删除一个StatefulSet
* 如何对StatefulSet进行扩容/缩容
* 如何更新一个StatefulSet的Pods
  {% endcapture %}


{% capture lessoncontent %}
<!--
## Creating a StatefulSet 
-->
##创建一个StatefulSet

<!--
Begin by creating a StatefulSet using the example below. It is similar to the 
example presented in the
[StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/) concept. 
It creates a [Headless Service](/docs/user-guide/services/#headless-services), 
`nginx`, to publish the IP addresses of Pods in the StatefulSet, `web`. 
-->
作为开始，使用如下示例创建一个StatefulSet。它和[StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/) 概念中的示例相似。它创建了一个 [Headless Service](/docs/user-guide/services/#headless-services)  `nginx`用来发布StatefulSet `web`中的Pod的IP地址。

{% include code.html language="yaml" file="web.yaml" ghlink="/docs/tutorials/stateful-application/web.yaml" %}

<!--
Download the example above, and save it to a file named `web.yaml`
-->
下载上面的例子并保存为文件`web.yaml`。

<!--
You will need to use two terminal windows. In the first terminal, use 
[`kubectl get`](/docs/user-guide/kubectl/{{page.version}}/#get) to watch the creation 
of the StatefulSet's Pods.
-->
你需要使用两个终端窗口。在第一个终端中，使用[`kubectl get`](/docs/user-guide/kubectl/{{page.version}}/#get) 来查看StatefulSet的Pods的创建情况。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In the second terminal, use 
[`kubectl create`](/docs/user-guide/kubectl/{{page.version}}/#create) to create the 
Headless Service and StatefulSet defined in `web.yaml`.
-->
在另一个终端中，使用[`kubectl create`](/docs/user-guide/kubectl/{{page.version}}/#create)来创建定义在 `web.yaml`中的Headless Service和StatefulSet。

```shell
kubectl create -f web.yaml 
service "nginx" created
statefulset "web" created
```

<!--
The command above creates two Pods, each running an 
[NGINX](https://www.nginx.com) webserver. Get the `nginx` Service and the 
`web` StatefulSet to verify that they were created successfully.
-->
上面的命令创建了两个Pod，每个都运行了一个[NGINX](https://www.nginx.com) web服务器。获取`nginx` Service和`web` StatefulSet 来验证是否成功的创建了它们。

```shell
kubectl get service nginx
NAME      CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
nginx     None         <none>        80/TCP    12s

kubectl get statefulset web
NAME      DESIRED   CURRENT   AGE
web       2         1         20s
```

<!--
### Ordered Pod Creation
-->
### 顺序创建Pod

<!--
For a StatefulSet with N replicas, when Pods are being deployed, they are 
created sequentially, in order from {0..N-1}. Examine the output of the 
`kubectl get` command in the first terminal. Eventually, the output will 
look like the example below.
-->
对于一个拥有N个副本的StatefulSet，Pod被部署时是按照 {0..N-1}的序号顺序创建的。在第一个终端中使用`kubectl get`检查输出。这个输出最终将看起来像下面的样子。

```shell
kubectl get pods -w -l app=nginx
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
[Running and Ready](/docs/user-guide/pod-states). 
-->
请注意在`web-0` Pod处于[Running和Ready](/docs/user-guide/pod-states)状态后`web-1` Pod才会被启动。

<!-
## Pods in a StatefulSet
-->
## StatefulSet中的Pod

<!--
Pods in a StatefulSet have a unique ordinal index and a stable network identity.
-->
StatefulSet中的Pod拥有一个唯一的顺序索引和稳定的网络身份标识。

<!--
### Examining the Pod's Ordinal Index
-->
### 检查Pod的顺序索引

<!--
Get the StatefulSet's Pods.
-->
获取StatefulSet的Pod。

```shell
kubectl get pods -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          1m
web-1     1/1       Running   0          1m

```

<!--
As mentioned in the [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/) 
concept, the Pods in a StatefulSet have a sticky, unique identity. This identity 
is based on a unique ordinal index that is assigned to each Pod by the 
StatefulSet controller. The Pods' names take the form 
`<statefulset name>-<ordinal index>`. Since the `web` StatefulSet has two 
replicas, it creates two Pods, `web-0` and `web-1`.
-->
如同 [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/) 概念中所提到的，StatefulSet中的Pod拥有一个具有黏性的、独一无二的身份标志。这个标志基于StatefulSet控制器分配给每个Pod的唯一顺序索引。Pod的名称的形式为`<statefulset name>-<ordinal index>`。`web` StatefulSet拥有两个副本，所以它创建了两个Pod：`web-0`和`web-1`。

<!--
### Using Stable Network Identities
-->
### 使用稳定的网络身份标识

<!--
Each Pod has a stable hostname based on its ordinal index. Use
[`kubectl exec`](/docs/user-guide/kubectl/{{page.version}}/#exec) to execute the 
`hostname` command in each Pod. 
-->
每个Pod都拥有一个基于其顺序索引的稳定的主机名。使用[`kubectl exec`](/docs/user-guide/kubectl/{{page.version}}/#exec) 在每个Pod中执行`hostname` 。

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'hostname'; done
web-0
web-1
```

<!--
Use [`kubectl run`](/docs/user-guide/kubectl/{{page.version}}/#run) to execute 
a container that provides the `nslookup` command from the `dnsutils` package. 
Using `nslookup` on the Pods' hostnames, you can examine their in-cluster DNS 
addresses.
-->
使用 [`kubectl run`](/docs/user-guide/kubectl/{{page.version}}/#run) 运行一个提供`nslookup`命令的容器，该命令来自于`dnsutils`包。通过对Pod的主机名执行`nslookup`，你可以检查他们在集群内部的DNS地址。

```shell
kubectl run -i --tty --image busybox dns-test --restart=Never --rm /bin/sh 
nslookup web-0.nginx
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
The CNAME of the headless service points to SRV records (one for each Pod that 
is Running and Ready). The SRV records point to A record entries that 
contain the Pods' IP addresses. 
-->
headless service的CNAME指向SRV记录（记录每个Running和Ready状态的Pod）。SRV记录指向一个包含Pod IP地址的记录表项。

<!--
In one terminal, watch the StatefulSet's Pods. 
-->
在一个终端中查看StatefulSet的Pod。

```shell
kubectl get pod -w -l app=nginx
```
<!--
In a second terminal, use
[`kubectl delete`](/docs/user-guide/kubectl/{{page.version}}/#delete) to delete all 
the Pods in the StatefulSet.
-->
在另一个终端中使用[`kubectl delete`](/docs/user-guide/kubectl/{{page.version}}/#delete) 删除StatefulSet中所有的Pod。

```shell
kubectl delete pod -l app=nginx
pod "web-0" deleted
pod "web-1" deleted
```

<!--
Wait for the StatefulSet to restart them, and for both Pods to transition to 
Running and Ready.
-->
等待StatefulSet重启它们，并且两个Pod都变成Running和Ready状态。

```shell
kubectl get pod -w -l app=nginx
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
Use `kubectl exec` and `kubectl run` to view the Pods hostnames and in-cluster 
DNS entries.
-->
使用`kubectl exec`和`kubectl run`查看Pod的主机名和集群内部的DNS表项。

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'hostname'; done
web-0
web-1

kubectl run -i --tty --image busybox dns-test --restart=Never --rm /bin/sh 
nslookup web-0.nginx
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
The Pods' ordinals, hostnames, SRV records, and A record names have not changed, 
but the IP addresses associated with the Pods may have changed. In the cluster 
used for this tutorial, they have. This is why it is important not to configure 
other applications to connect to Pods in a StatefulSet by IP address.
-->
Pod的序号、主机名、SRV条目和记录名称没有改变，但和Pod相关联的IP地址可能发生了改变。在本教程中使用的集群中它们就改变了。这就是为什么不要在其他应用中使用StatefulSet中的Pod的IP地址进行连接，这点很重要。

<!--
If you need to find and connect to the active members of a StatefulSet, you 
should query the CNAME of the Headless Service 
(`nginx.default.svc.cluster.local`). The SRV records associated with the 
CNAME will contain only the Pods in the StatefulSet that are Running and 
Ready.
-->
如果你需要查找并连接一个StatefulSet的活动成员，你应该查询Headless Service的CNAME。和CNAME相关联的SRV记录只会包含StatefulSet中处于Running和Ready状态的Pod。

<!--
If your application already implements connection logic that tests for 
liveness and readiness, you can use the SRV records of the Pods ( 
`web-0.nginx.default.svc.cluster.local`,
`web-1.nginx.default.svc.cluster.local`), as they are stable, and your 
application will be able to discover the Pods' addresses when they transition 
to Running and Ready.
-->
如果你的应用已经实现了用于测试liveness和readiness的连接逻辑，你可以使用Pod的SRV记录（`web-0.nginx.default.svc.cluster.local`,
`web-1.nginx.default.svc.cluster.local`）。因为他们是稳定的，并且当你的Pod的状态变为Running和Ready时，你的应用就能够发现它们的地址。

<!--
### Writing to Stable Storage
-->
### 写入稳定的存储

<!--
Get the PersistentVolumeClaims for `web-0` and `web-1`.
-->
获取`web-0`和`web-1`的PersistentVolumeClaims。

```shell
kubectl get pvc -l app=nginx
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           48s
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           48s
```
<!--
The StatefulSet controller created two PersistentVolumeClaims that are 
bound to two [PersistentVolumes](/docs/concepts/storage/volumes/). As the 
cluster used in this tutorial is configured to dynamically provision 
PersistentVolumes, the PersistentVolumes were created and bound automatically.
-->
StatefulSet控制器创建了两个PersistentVolumeClaims，绑定到两个 [PersistentVolumes](/docs/concepts/storage/volumes/)。由于本教程使用的集群配置为动态提供PersistentVolume，所有的PersistentVolume都是自动创建和绑定的。

<!--
The NGINX webservers, by default, will serve an index file at 
`/usr/share/nginx/html/index.html`. The `volumeMounts` field in the 
StatefulSets `spec` ensures that the `/usr/share/nginx/html` directory is 
backed by a PersistentVolume.
-->
NGINX web服务器默认会加载位于`/usr/share/nginx/html/index.html`的index文件。StatefulSets `spec`中的`volumeMounts`字段保证了`/usr/share/nginx/html`文件夹由一个PersistentVolume支持。

<!--
Write the Pods' hostnames to their `index.html` files and verify that the NGINX 
webservers serve the hostnames.
-->
将Pod的主机名写入它们的 `index.html`文件并验证NGINX web服务器使用该主机名提供服务。

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'echo $(hostname) > /usr/share/nginx/html/index.html'; done

for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```

<!--
Note, if you instead see 403 Forbidden responses for the above curl command,
you will need to fix the permissions of the directory mounted by the `volumeMounts`
(due to a [bug when using hostPath volumes](https://github.com/kubernetes/kubernetes/issues/2630)) with:
-->
请注意，如果你看见上面的curl命令返回了403 Forbidden的响应，你需要像这样修复使用`volumeMounts`
(due to a [bug when using hostPath volumes](https://github.com/kubernetes/kubernetes/issues/2630))挂载的目录的权限：

```shell
for i in 0 1; do kubectl exec web-$i -- chmod 755 /usr/share/nginx/html; done
```
<!--
before retrying the curl command above.

In one terminal, watch the StatefulSet's Pods.
-->
在你重新尝试上面的curl命令之前。

在一个终端查看StatefulSet的Pod。

```shell
kubectl get pod -w -l app=nginx
```

<!--
In a second terminal, delete all of the StatefulSet's Pods.
-->
在另一个终端删除StatefulSet所有的Pod。

```shell
kubectl delete pod -l app=nginx
pod "web-0" deleted
pod "web-1" deleted
```
<!--
Examine the output of the `kubectl get` command in the first terminal, and wait 
for all of the Pods to transition to Running and Ready.
-->
在第一个终端里检查`kubectl get` 命令的输出，等待所有Pod变成Running和Ready状态。

```shell
kubectl get pod -w -l app=nginx
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
Verify the web servers continue to serve their hostnames.
-->
验证所有web服务器在继续使用它们的主机名提供服务。

```
for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```

<!--
Even though `web-0` and `web-1` were rescheduled, they continue to serve their 
hostnames because the PersistentVolumes associated with their 
PersistentVolumeClaims are remounted to their `volumeMount`s. No matter what 
node `web-0`and `web-1` are scheduled on, their PersistentVolumes will be 
mounted to the appropriate mount points.
-->
虽然`web-0`和`web-1`被重新调度了，但它们仍然继续监听各自的主机名，因为和它们的PersistentVolumeClaim相关联的PersistentVolume被重新挂载到了各自的 `volumeMount`上。不管`web-0`和`web-1`被调度到了哪个节点上，它们的PersistentVolumes将会被挂载到合适的挂载点上。

<!--
## Scaling a StatefulSet
-->
## 扩容/缩容一个StatefulSet
<!--
Scaling a StatefulSet refers to increasing or decreasing the number of replicas. 
This is accomplished by updating the `replicas` field. You can use either
[`kubectl scale`](/docs/user-guide/kubectl/{{page.version}}/#scale) or
[`kubectl patch`](/docs/user-guide/kubectl/{{page.version}}/#patch) to scale a Stateful 
Set.
-->
扩容/缩容一个StatefulSet指增加或减少它的副本数。这通过更新`replicas`字段完成。你可以使用[`kubectl scale`](/docs/user-guide/kubectl/{{page.version}}/#scale) 或者[`kubectl patch`](/docs/user-guide/kubectl/{{page.version}}/#patch)来扩容/缩容一个StatefulSet。

<!--
### Scaling Up
-->
### 扩容

<!--
In one terminal window, watch the Pods in the StatefulSet.
-->
在一个终端窗口观察StatefulSet的Pod。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In another terminal window, use `kubectl scale` to scale the number of replicas 
to 5.
-->
在另一个终端窗口使用`kubectl scale`扩展副本数为5。

```shell
kubectl scale sts web --replicas=5
statefulset "web" scaled
```

<!--
Examine the output of the `kubectl get` command in the first terminal, and wait 
for the three additional Pods to transition to Running and Ready.
-->
在第一个 终端中检查`kubectl get`命令的输出，等待增加的3个Pod的状态变为Running和Ready。

```shell
kubectl get pods -w -l app=nginx
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
StatefulSet控制器扩展了副本的数量。如同[创建StatefulSet](#顺序创建pod)所述，StatefulSet按序号索引顺序的创建每个Pod，并且会等待前一个Pod变为Running和Ready才会启动下一个Pod。

<!--
### Scaling Down
-->
### 缩容

<!--
In one terminal, watch the StatefulSet's Pods.
-->
在一个终端观察StatefulSet的Pod。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In another terminal, use `kubectl patch` to scale the StatefulSet back down to 
three replicas.
-->
在另一个终端使用`kubectl patch`将StatefulSet缩容回三个副本。

```shell
kubectl patch sts web -p '{"spec":{"replicas":3}}'
"web" patched
```

<!--
Wait for `web-4` and `web-3` to transition to Terminating.
-->
等待`web-4`和`web-3`状态变为Terminating。

```
kubectl get pods -w -l app=nginx
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
### Ordered Pod Termination
-->
### 顺序终止Pod

<!--
The controller deleted one Pod at a time, in reverse order with respect to its 
ordinal index, and it waited for each to be completely shutdown before 
deleting the next.
-->
控制器会按照与Pod序号索引相反的顺序每次删除一个Pod。在删除下一个Pod前会等待上一个被完全关闭。

<!--
Get the StatefulSet's PersistentVolumeClaims. 
-->
获取StatefulSet的PersistentVolumeClaims。

```shell
kubectl get pvc -l app=nginx
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-2   Bound     pvc-e1125b27-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-3   Bound     pvc-e1176df6-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-4   Bound     pvc-e11bb5f8-b508-11e6-932f-42010a800002   1Gi        RWO           13h

```

<!--
There are still five PersistentVolumeClaims and five PersistentVolumes. 
When exploring a Pod's [stable storage](#stable-storage), we saw that the 
PersistentVolumes mounted to the Pods of a StatefulSet are not deleted when 
the StatefulSet's Pods are deleted. This is still true when Pod deletion is 
caused by scaling the StatefulSet down. 
-->
五个PersistentVolumeClaims和五个PersistentVolumes仍然存在。查看Pod的 [稳定存储](#stable-storage)，我们发现当删除StatefulSet的Pod时，挂载到StatefulSet的Pod的PersistentVolumes不会被删除。当这种删除行为是由StatefulSet缩容引起时也是一样的。

<!--
## Updating StatefulSets
-->
## 更新StatefulSet

<!--
In Kubernetes 1.7, the StatefulSet controller supports automated updates.  The 
strategy used is determined by the `spec.updateStrategy` field of the 
StatefulSet API Object. This feature can be used to upgrade the container 
images, resource requests and/or limits, labels, and annotations of the Pods in a 
StatefulSet. There are two valid update strategies, `OnDelete` and 
`RollingUpdate`. 
-->
Kubernetes 1.7版本的StatefulSet控制器支持自动更新。更新策略由StatefulSet API Object的`spec.updateStrategy`字段决定。这个特性能够用来更新一个StatefulSet中的Pod的container images, resource requests，以及limits, labels和annotations。

<!--
### On Delete
-->
### On Delete策略
<!--
The `OnDelete` update strategy implements the legacy (prior to 1.7) behavior, 
and it is the default update strategy. When you select this update strategy, 
the StatefulSet controller will not automatically update Pods when a 
modification is made to the StatefulSet's `.spec.template` field.
-->
`OnDelete`更新策略实现了传统（1.7之前）行为，它也是默认的更新策略。当你选择这个更新策略并修改StatefulSet的`.spec.template`字段时，StatefulSet控制器将不会自动的更新Pod。

<!--
Patch the container image for the `web` StatefulSet.
-->
Patch `web` StatefulSet的容器镜像。 

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"gcr.io/google_containers/nginx-slim:0.7"}]'
"web" patched
```

<!--
Delete the `web-0` Pod.
-->
删除`web-0` Pod。

```shell
kubectl delete pod web-0
pod "web-0" deleted
```

<--
Watch the `web-0` Pod, and wait for it to transition to Running and Ready.
-->
观察`web-0` Pod， 等待它变成Running和Ready。

```shell
kubectl get pod web-0 -w
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          54s
web-0     1/1       Terminating   0         1m
web-0     0/1       Terminating   0         1m
web-0     0/1       Terminating   0         1m
web-0     0/1       Terminating   0         1m
web-0     0/1       Pending   0         0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         3s
```

<!--
Get the `web` StatefulSet's Pods to view their container images.
-->
获取`web` StatefulSet的Pod来查看他们的容器镜像。

```shell{% raw %}
kubectl get pod -l app=nginx -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[0].image}{"\n"}{end}'
web-0   gcr.io/google_containers/nginx-slim:0.7
web-1   gcr.io/google_containers/nginx-slim:0.8
web-2   gcr.io/google_containers/nginx-slim:0.8
{% endraw %}```

`web-0` has had its image updated, but `web-0` and `web-1` still have the original 
image. Complete the update by deleting the remaining Pods.

​```shell
kubectl delete pod web-1 web-2
pod "web-1" deleted
pod "web-2" deleted
```

<!--
Watch the StatefulSet's Pods, and wait for all of them to transition to Running and Ready.
-->
观察StatefulSet的Pod，等待它们全部变成Running和Ready。

```
kubectl get pods -w -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          8m
web-1     1/1       Running   0          4h
web-2     1/1       Running   0          23m
NAME      READY     STATUS        RESTARTS   AGE
web-1     1/1       Terminating   0          4h
web-1     1/1       Terminating   0         4h
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-2     1/1       Terminating   0         23m
web-2     1/1       Terminating   0         23m
web-1     1/1       Running   0         4s
web-2     0/1       Pending   0         0s
web-2     0/1       Pending   0         0s
web-2     0/1       ContainerCreating   0         0s
web-2     1/1       Running   0         36s
```

<!--
Get the Pods to view their container images.
-->
获取Pod来查看他们的容器镜像。

```shell{% raw %}
kubectl get pod -l app=nginx -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[0].image}{"\n"}{end}'
web-0   gcr.io/google_containers/nginx-slim:0.7
web-1   gcr.io/google_containers/nginx-slim:0.7
web-2   gcr.io/google_containers/nginx-slim:0.7
{% endraw %}
```

<!--
All the Pods in the StatefulSet are now running a new container image.
-->
现在，StatefulSet中的Pod都已经运行了新的容器镜像。

<!--
### Rolling Update
-->
### Rolling Update策略

<!--
The `RollingUpdate` update strategy will update all Pods in a StatefulSet, in 
reverse ordinal order, while respecting the StatefulSet guarantees.
-->
`RollingUpdate`更新策略会更新一个StatefulSet中所有的Pod，采用与序号索引相反的顺序并遵循StatefulSet的保证。

<!--
Patch the `web` StatefulSet to apply the `RollingUpdate` update strategy.
-->
Patch `web` StatefulSet来执行`RollingUpdate`更新策略。

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate"}}}
statefulset "web" patched
```
<!--
In one terminal window, patch the `web` StatefulSet to change the container 
image again.
-->
在一个终端窗口中patch `web` StatefulSet来再次的改变容器镜像。

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"gcr.io/google_containers/nginx-slim:0.8"}]'
statefulset "web" patched
```

<!--
In another terminal, watch the Pods in the StatefulSet.
-->
在另一个终端监控StatefulSet中的Pod。

```shell
kubectl get po -l app=nginx -w
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
its current version. Pods that have already received the update will be 
restored to the updated version, and Pods that have not yet received the 
update will be restored to the previous version. In this way, the controller 
attempts to continue to keep the application healthy and the update consistent 
in the presence of intermittent failures.
-->
StatefulSet里的Pod采用和序号相反的顺序更新。在更新下一个Pod前，StatefulSet控制器终止每个Pod并等待它们变成Running和Ready。请注意，虽然在顺序后继者变成Running和Ready之前StatefulSet控制器不会更新下一个Pod，但它仍然会重建任何在更新过程中发生故障的Pod，使用的是它们当前的版本。已经接收到更新请求的Pod将会被恢复为更新的版本，没有收到请求的Pod则会被恢复为之前的版本。像这样，控制器尝试继续使应用保持健康并在出现间歇性故障时保持更新的一致性。

<!--
Get the Pods to view their container images.
-->
获取Pod来查看他们的容器镜像。

```shell{% raw %}
for p in 0 1 2; do kubectl get po web-$p --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
gcr.io/google_containers/nginx-slim:0.8
gcr.io/google_containers/nginx-slim:0.8
gcr.io/google_containers/nginx-slim:0.8
{% endraw %}
```
<!--
All the Pods in the StatefulSet are now running the previous container image.
-->
StatefulSet中的所有Pod现在都在运行之前的容器镜像。

<!--
**Tip** You can also use `kubectl rollout status sts/<name>` to view 
the status of a rolling update.
-->
**小窍门**：你还可以使用`kubectl rollout status sts/<name>`来查看rolling update的状态。

<!--
#### Staging an Update
-->
#### 分段更新
<!--
You can stage an update to a StatefulSet by using the `partition` parameter of 
the `RollingUpdate` update strategy. A staged update will keep all of the Pods 
in the StatefulSet at the current version while allowing mutations to the 
StatefulSet's `.spec.template`.
-->
你可以使用`RollingUpdate`更新策略的`partition`参数来分段更新一个StatefulSet。分段的更新将会使StatefulSet中的其余所有Pod保持当前版本的同时仅允许改变StatefulSet的 `.spec.template`。

<!--
Patch the `web` StatefulSet to add a partition to the `updateStrategy` field.
-->
Patch `web` StatefulSet来对`updateStrategy`字段添加一个分区。

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":3}}}}'
statefulset "web" patched
```

<!--
Patch the StatefulSet again to change the container's image.
-->
再次Patch StatefulSet来改变容器镜像。

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"gcr.io/google_containers/nginx-slim:0.7"}]'
statefulset "web" patched
```

<!--
Delete a Pod in the StatefulSet.
-->
删除StatefulSet中的Pod。

```shell
kubectl delete po web-2
pod "web-2" deleted
```

<!--
Wait for the Pod to be Running and Ready.
-->
等待Pod变成Running和Ready。

```shell
kubectl get po -lapp=nginx -w
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```

<!--
Get the Pod's container.
-->
获取Pod的容器。

```shell{% raw %}
get po web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
gcr.io/google_containers/nginx-slim:0.8
{% endraw %}
```

<!--
Notice that, even though the update strategy is `RollingUpdate` the StatefulSet 
controller restored the Pod with its original container. This is because the 
ordinal of the Pod is less than the `partition` specified by the 
`updateStrategy`.
-->
请注意，虽然更新策略是`RollingUpdate`，StatefulSet控制器还是会使用原始的容器恢复Pod。这是因为Pod的序号比`updateStrategy`指定的`partition`更小。

<!--
#### Rolling Out a Canary
-->
#### 灰度扩容
<!--
You can roll out a canary to test a modification by decrementing the `partition` 
you specified [above](#staging-an-update).
-->
你可以通过减少 [上文](#分段更新)指定的`partition`来进行灰度扩容，以此来测试你的程序的改动。

<!--
Patch the StatefulSet to decrement the partition.
-->
Patch StatefulSet来减少分区。

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":2}}}}'
statefulset "web" patched
```

<!--
Wait for `web-2` to be Running and Ready.
-->
等待`web-2`变成Running和Ready。

```shell
kubectl get po -lapp=nginx -w
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```

<!--
Get the Pod's container.
-->
获取Pod的容器。

```shell{% raw %}
kubectl get po web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
gcr.io/google_containers/nginx-slim:0.7
{% endraw %}
```

<!--
When you changed the `partition`, the StatefulSet controller automatically 
updated the `web-2` Pod because the Pod's ordinal was less than or equal to 
the `partition`.
-->
当你改变`partition`时，StatefulSet会自动的更新`web-2` Pod，这是因为Pod的序号小于或等于 `partition`。

<!--
Delete the `web-1` Pod.
-->
删除`web-1` Pod。

```shell
kubectl delete po web-1
pod "web-1" deleted
```

<!--
Wait for the `web-1` Pod to be Running and Ready.
-->
等待`web-1`变成Running和Ready。

```shell
kubectl get po -lapp=nginx -w
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
Get the `web-1` Pods container.
-->
获取`web-1` Pod的容器。

```shell{% raw %}
get po web-1 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
gcr.io/google_containers/nginx-slim:0.8
{% endraw %}
```
<!--
`web-1` was restored to its original configuration because the Pod's ordinal 
was less than the partition. When a partition is specified, all Pods with an 
ordinal that is greater than or equal to the partition will be updated when the 
StatefulSet's `.spec.template` is updated. If a Pod that has an ordinal less 
than the partition is deleted or otherwise terminated, it will be restored to 
its original configuration.
-->
`web-1`被按照原来的配置恢复，因为Pod的序号小于分区。当指定了分区时，如果更新了StatefulSet的`.spec.template`，则所有序号大于或等于分区的Pod都将被更新。如果一个序号小于分区的Pod被删除或者终止，它将被按照原来的配置恢复。

<!--
#### Phased Roll Outs
-->
#### 分阶段的扩容
<!--
You can perform a phased roll out (e.g. a linear, geometric, or exponential
roll out) using a partitioned rolling update in a similar manner to how you 
rolled out a [canary](#rolling-out-a-canary). To perform a phased roll out, set 
the `partition` to the ordinal at which you want the controller to pause the 
update. 
-->
你可以使用类似[灰度扩容](#灰度扩容)的方法执行一次分阶段的扩容（例如一次线性的、等比的或者指数形式的扩容）。要执行一次分阶段的扩容，你需要设置`partition`为希望控制器暂停更新的序号。

<!--
The partition is currently set to `2`. Set the partition to `0`.
-->
分区当前为`2`。请将分区设置为`0`。

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":0}}}}'
statefulset "web" patched
```

<!--
Wait for all of the Pods in the StatefulSet to become Running and Ready.
-->
等待StatefulSet中的所有Pod变成Running和Ready。

```shell
kubectl get po -lapp=nginx -w
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
Get the Pod's containers.
-->
获取Pod的容器。

```shell{% raw %}
for p in 0 1 2; do kubectl get po web-$p --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
gcr.io/google_containers/nginx-slim:0.7
gcr.io/google_containers/nginx-slim:0.7
gcr.io/google_containers/nginx-slim:0.7
{% endraw %}
```

<!--
By moving the `partition` to `0`, you allowed the StatefulSet controller to 
continue the update process.
-->
将`partition`改变为`0`以允许StatefulSet控制器继续更新过程。

<!--
## Deleting StatefulSets
-->
## 删除StatefulSet

<!--
StatefulSet supports both Non-Cascading and Cascading deletion. In a 
Non-Cascading Delete, the StatefulSet's Pods are not deleted when the Stateful
Set is deleted. In a Cascading Delete, both the StatefulSet and its Pods are 
deleted.
-->
StatefulSet同时支持级联和非级联删除。使用非级联方式删除StatefulSet时，StatefulSet的Pod不会被删除。使用级联删除时，StatefulSet和它的Pod都会被删除。

<!--
### Non-Cascading Delete
-->
### 非级联删除

<!--
In one terminal window, watch the Pods in the StatefulSet.
-->
在一个终端窗口查看StatefulSet中的Pod。

```
kubectl get pods -w -l app=nginx
```

<!--
Use [`kubectl delete`](/docs/user-guide/kubectl/{{page.version}}/#delete) to delete the 
StatefulSet. Make sure to supply the `--cascade=false` parameter to the 
command. This parameter tells Kubernetes to only delete the StatefulSet, and to 
not delete any of its Pods.
-->
使用 [`kubectl delete`](/docs/user-guide/kubectl/{{page.version}}/#delete)删除StatefulSet。请确保提供了`--cascade=false`参数给命令。这个参数告诉Kubernetes只删除StatefulSet而不要删除它的任何Pod。

```shell
kubectl delete statefulset web --cascade=false
statefulset "web" deleted
```

<!--
Get the Pods to examine their status.
-->
获取Pod来检查他们的状态。

```shell
kubectl get pods -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          6m
web-1     1/1       Running   0          7m
web-2     1/1       Running   0          5m
```

<!--
Even though `web` has been deleted, all of the Pods are still Running and Ready.
Delete `web-0`.
-->
虽然`web`已经被删除了，但所有Pod仍然处于Running和Ready状态。
删除`web-0`。

```shell
kubectl delete pod web-0
pod "web-0" deleted
```

<!--
Get the StatefulSet's Pods.
-->
获取StatefulSet的Pod。

```shell
kubectl get pods -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-1     1/1       Running   0          10m
web-2     1/1       Running   0          7m
```

<!--
As the `web` StatefulSet has been deleted, `web-0` has not been relaunched.
-->
由于`web` StatefulSet已经被删除，`web-0`没有被重新启动。

<!--
In one terminal, watch the StatefulSet's Pods.
-->
在一个终端监控StatefulSet的Pod。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In a second terminal, recreate the StatefulSet. Note that, unless
you deleted the `nginx` Service ( which you should not have ), you will see 
an error indicating that the Service already exists.
-->
在另一个终端里重新创建StatefulSet。请注意，除非你删除了`nginx` Service（你不应该这样做），你将会看到一个错误，提示Service已经存在。

```shell
kubectl create -f web.yaml 
statefulset "web" created
Error from server (AlreadyExists): error when creating "web.yaml": services "nginx" already exists
```

<!--
Ignore the error. It only indicates that an attempt was made to create the nginx
Headless Service even though that Service already exists. 
-->
请忽略这个错误。它仅表示kubernetes进行了一次创建nginx Headless Service的尝试，尽管那个Service已经存在。

<!--
Examine the output of the `kubectl get` command running in the first terminal.
-->
在第一个终端中运行并检查`kubectl get`命令的输出。

```shell
kubectl get pods -w -l app=nginx
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
 Running and Ready, it simply adopted this Pod. Since you recreated the StatefulSet 
 with `replicas` equal to 2, once `web-0` had been recreated, and once 
 `web-1` had been determined to already be Running and Ready, `web-2` was 
 terminated. 
-->
当重新创建`web` StatefulSet时，`web-0`被第一个重新启动。由于`web-1`已经处于Running和Ready状态，当`web-0`变成Running和Ready时，StatefulSet会直接接收这个Pod。由于你重新创建的StatefulSet的`replicas`等于2，一旦`web-0`被重新创建并且`web-1`被认为已经处于Running和Ready状态时，`web-2`将会被终止。

<!--
Let's take another look at the contents of the `index.html` file served by the 
Pods' webservers.
-->
让我们再看一眼被Pod的web服务器加载的`index.html`的内容。

```shell
for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
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
尽管你同时删除了StatefulSet和`web-0` Pod，但它仍然使用最初写入`index.html`文件的主机名进行服务。这是因为StatefulSet永远不会删除和一个Pod相关联的PersistentVolumes。当你重建这个StatefulSet并且重新启动了`web-0`时，它原本的PersistentVolume会被重新挂载。

<!--
### Cascading Delete
-->
### 级联删除

<!--
In one terminal window, watch the Pods in the StatefulSet.
-->
在一个终端窗口观察StatefulSet里的Pod。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In another terminal, delete the StatefulSet again. This time, omit the 
`--cascade=false` parameter.
-->
在另一个窗口中再次删除这个StatefulSet。这次省略`--cascade=false`参数。

```shell
kubectl delete statefulset web
statefulset "web" deleted
```
<!--
Examine the output of the `kubectl get` command running in the first terminal, 
and wait for all of the Pods to transition to Terminating.
-->
在第一个终端检查`kubectl get`命令的输出，并等待所有的Pod变成Terminating状态。

```shell
kubectl get pods -w -l app=nginx
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
As you saw in the [Scaling Down](#ordered-pod-termination) section, the Pods 
are terminated one at a time, with respect to the reverse order of their ordinal 
indices. Before terminating a Pod, the StatefulSet controller waits for 
the Pod's successor to be completely terminated.
-->
如同你在[缩容](#ordered-pod-termination)一节看到的，Pod按照和他们序号索引相反的顺序每次终止一个。在终止一个Pod前，StatefulSet控制器会等待Pod后继者被完全终止。

<!--
Note that, while a cascading delete will delete the StatefulSet and its Pods, 
it will not delete the Headless Service associated with the StatefulSet. You
must delete the `nginx` Service manually.
-->
请注意，虽然级联删除会删除StatefulSet和它的Pod，但它并不会删除和StatefulSet关联的Headless Service。你必须手动删除`nginx` Service。

```shell
kubectl delete service nginx
service "nginx" deleted
```

<!--
Recreate the StatefulSet and Headless Service one more time.
-->
再一次重新创建StatefulSet和Headless Service。

```shell
kubectl create -f web.yaml 
service "nginx" created
statefulset "web" created
```

<!--
When all of the StatefulSet's Pods transition to Running and Ready, retrieve 
the contents of their `index.html` files.
-->
当StatefulSet所有的Pod变成Running和Ready时，获取它们的`index.html`文件的内容。

```shell
for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```

<!--
Even though you completely deleted the StatefulSet, and all of its Pods, the 
Pods are recreated with their PersistentVolumes mounted, and `web-0` and 
`web-1` will still serve their hostnames.
-->
即使你已经删除了StatefulSet和它的全部Pod，这些Pod将会被重新创建并挂载它们的PersistentVolumes，并且`web-0`和`web-1`将仍然使用它们的主机名提供服务。

<!--
Finally delete the `web` StatefulSet and the `nginx` service.
-->
最后删除`web` StatefulSet和`nginx` service。

```shell
kubectl delete service nginx
service "nginx" deleted

kubectl delete statefulset web
statefulset "web" deleted
```

<!--
## Pod Management Policy
-->
## Pod管理策略

<!--
For some distributed systems, the StatefulSet ordering guarantees are 
unnecessary and/or undesirable. These systems require only uniqueness and 
identity. To address this, in Kubernetes 1.7, we introduced 
`.spec.podManagementPolicy` to the StatefulSet API Object. 
-->
对于某些分布式系统来说，StatefulSet的顺序性保证是不必要和/或者不应该的。这些系统仅仅要求唯一性和身份标志。为了解决这个问题，在Kubernetes 1.7中我们针对StatefulSet API Object引入了`.spec.podManagementPolicy`。

<!--
### OrderedReady Pod Management
-->
### OrderedReady Pod管理策略

<!--
`OrderedReady` pod management is the default for StatefulSets. It tells the 
StatefulSet controller to respect the ordering guarantees demonstrated 
above.
-->
`OrderedReady` pod管理策略是StatefulSets的默认选项。它告诉StatefulSet控制器遵循上文展示的顺序性保证。

<!--
### Parallel Pod Management
-->
### Parallel Pod管理策略

<!--
`Parallel` pod management tells the StatefulSet controller to launch or 
terminate all Pods in parallel, and to not wait for Pods to becoming Running 
and Ready or completely terminated prior to launching or terminating another 
Pod.
-->
`Parallel` pod管理策略告诉StatefulSet控制器并行的终止所有Pod，在启动或终止另一个Pod前，不必等待这些Pod变成Running和Ready或者完全终止状态。

{% include code.html language="yaml" file="webp.yaml" ghlink="/docs/tutorials/stateful-application/webp.yaml" %}

<!--
Download the example above, and save it to a file named `webp.yaml`
-->
下载上面的例子并保存为 `webp.yaml`。

<!--
This manifest is identical to the one you downloaded above except that the `.spec.podManagementPolicy` 
of the `web` StatefulSet is set to `Parallel`.
-->
这份清单和你在上文下载的完全一样，只是`web` StatefulSet的`.spec.podManagementPolicy`设置成了`Parallel`。

<!--
In one terminal, watch the Pods in the StatefulSet.
-->
在一个终端窗口查看StatefulSet中的Pod。

```shell
kubectl get po -lapp=nginx -w
```

<!--
In another terminal, create the StatefulSet and Service in the manifest.
-->
在另一个终端窗口创建清单中的StatefulSet和Service。

```shell
kubectl create -f webp.yaml 
service "nginx" created
statefulset "web" created
```

<!--
Examine the output of the `kubectl get` command that you executed in the first terminal.
-->
查看你在第一个终端中运行的`kubectl get`命令的输出。

```shell
kubectl get po -lapp=nginx -w
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

Keep the second terminal open, and, in another terminal window scale the 
StatefulSet.
-->
StatefulSet控制器同时启动了`web-0`和`web-1`。

保持第二个终端打开，并在另一个终端窗口中扩容StatefulSet。

```shell
kubectl scale statefulset/web --replicas=4
statefulset "web" scaled
```

<!--
Examine the output of the terminal where the `kubectl get` command is running.
-->
在 `kubectl get`命令运行的终端里检查它的输出。

```shell
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         7s
web-3     0/1       ContainerCreating   0         7s
web-2     1/1       Running   0         10s
web-3     1/1       Running   0         26s
```

<!
The StatefulSet controller launched two new Pods, and it did not wait for 
the first to become Running and Ready prior to launching the second.

Keep this terminal open, and in another terminal delete the `web` StatefulSet.
-->
StatefulSet控制器启动了两个新的Pod，而且在启动第二个之前并没有等待第一个变成Running和Ready状态。

保持这个终端打开，并在另一个终端删除`web` StatefulSet。

```shell
kubectl delete sts web
```

<!--
Again, examine the output of the `kubectl get` command running in the other terminal.
-->
在另一个终端里再次检查`kubectl get`命令的输出。

```shell
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
The StatefulSet controller deletes all Pods concurrently, it does not wait for 
a Pod's ordinal successor to terminate prior to deleting that Pod.
-->
StatefulSet控制器将并发的删除所有Pod，在删除一个Pod前不会等待它的顺序后继者终止。

<!--
Close the terminal where the `kubectl get` command is running and delete the `nginx` 
Service.
-->
关闭`kubectl get`命令运行的终端并删除`nginx`  Service。

```shell
kubectl delete svc nginx
```
{% endcapture %}

{% capture cleanup %}
<!--
You will need to delete the persistent storage media for the PersistentVolumes
used in this tutorial. Follow the necessary steps, based on your environment, 
storage configuration, and provisioning method, to ensure that all storage is 
reclaimed.
-->
你需要删除本教程中用到的PersistentVolumes的持久化存储媒体。基于你的环境、存储配置和提供方式，按照必须的步骤保证回收所有的存储。
{% endcapture %}

{% include templates/tutorial.md %}
