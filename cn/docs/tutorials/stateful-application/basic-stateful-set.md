---
approvers:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: StatefulSet基本使用
---

{% capture overview %}

本教程介绍了如何使用 [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/) 来管理应用。演示了如何创建、删除、扩容/缩容和更新 StatefulSets 的 Pods。
{% endcapture %}

{% capture prerequisites %}

在开始本教程之前，你应该熟悉以下 Kubernetes 的概念：

* [Pods](/docs/user-guide/pods/single-container/)
* [Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)
* [Headless Services](/docs/concepts/services-networking/service/#headless-services)
* [PersistentVolumes](/docs/concepts/storage/volumes/)
* [PersistentVolume Provisioning](http://releases.k8s.io/{{page.githubbranch}}/examples/persistent-volume-provisioning/)
* [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/)
* [kubectl CLI](/docs/user-guide/kubectl)

本教程假设你的集群被配置为动态的提供 PersistentVolumes 。如果没有这样配置，在开始本教程之前，你需要手动准备5个1 GiB的存储卷。
{% endcapture %}

{% capture objectives %}

StatefulSets 旨在与有状态的应用及分布式系统一起使用。然而在 Kubernetes 上管理有状态应用和分布式系统是一个宽泛而复杂的话题。为了演示 StatefulSet 的基本特性，并且不使前后的主题混淆，你将会使用 StatefulSet 部署一个简单的 web 应用。

在阅读本教程后，你将熟悉以下内容：

* 如何创建 StatefulSet
* StatefulSet 怎样管理它的 Pods
* 如何删除 StatefulSet
* 如何对 StatefulSet 进行扩容/缩容
* 如何更新一个 StatefulSet 的 Pods
  {% endcapture %}


{% capture lessoncontent %}

##创建 StatefulSet


作为开始，使用如下示例创建一个 StatefulSet。它和 [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/)  概念中的示例相似。它创建了一个  [Headless Service](/docs/user-guide/services/#headless-services)  `nginx` 用来发布StatefulSet `web` 中的 Pod 的 IP 地址。

{% include code.html language="yaml" file="web.yaml" ghlink="/docs/tutorials/stateful-application/web.yaml" %}


下载上面的例子并保存为文件 `web.yaml`。


你需要使用两个终端窗口。在第一个终端中，使用 [`kubectl get`](/docs/user-guide/kubectl/{{page.version}}/#get)  来查看 StatefulSet 的 Pods 的创建情况。

```shell
kubectl get pods -w -l app=nginx
```


在另一个终端中，使用 [`kubectl create`](/docs/user-guide/kubectl/{{page.version}}/#create) 来创建定义在 `web.yaml` 中的 Headless Service 和 StatefulSet。

```shell
kubectl create -f web.yaml 
service "nginx" created
statefulset "web" created
```


上面的命令创建了两个 Pod，每个都运行了一个 [NGINX](https://www.nginx.com) web 服务器。获取 `nginx` Service 和 `web` StatefulSet 来验证是否成功的创建了它们。

```shell
kubectl get service nginx
NAME      CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
nginx     None         <none>        80/TCP    12s

kubectl get statefulset web
NAME      DESIRED   CURRENT   AGE
web       2         1         20s
```


### 顺序创建 Pod


对于一个拥有 N 个副本的 StatefulSet，Pod 被部署时是按照 {0..N-1}的序号顺序创建的。在第一个终端中使用 `kubectl get` 检查输出。这个输出最终将看起来像下面的样子。

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


请注意在 `web-0` Pod 处于 [Running和Ready](/docs/user-guide/pod-states) 状态后 `web-1` Pod 才会被启动。

<!-
## Pods in a StatefulSet
-->
## StatefulSet 中的 Pod


StatefulSet 中的 Pod 拥有一个唯一的顺序索引和稳定的网络身份标识。


### 检查 Pod 的顺序索引


获取 StatefulSet 的 Pod。

```shell
kubectl get pods -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          1m
web-1     1/1       Running   0          1m

```


如同 [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/)  概念中所提到的， StatefulSet 中的 Pod 拥有一个具有黏性的、独一无二的身份标志。这个标志基于 StatefulSet 控制器分配给每个 Pod 的唯一顺序索引。 Pod 的名称的形式为`<statefulset name>-<ordinal index>`。`web` StatefulSet 拥有两个副本，所以它创建了两个 Pod：`web-0`和`web-1`。


### 使用稳定的网络身份标识


每个 Pod 都拥有一个基于其顺序索引的稳定的主机名。使用[`kubectl exec`](/docs/user-guide/kubectl/{{page.version}}/#exec) 在每个 Pod 中执行`hostname` 。

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'hostname'; done
web-0
web-1
```


使用 [`kubectl run`](/docs/user-guide/kubectl/{{page.version}}/#run)  运行一个提供 `nslookup` 命令的容器，该命令来自于 `dnsutils` 包。通过对 Pod 的主机名执行 `nslookup`，你可以检查他们在集群内部的 DNS 地址。

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


headless service 的 CNAME 指向 SRV 记录（记录每个 Running 和 Ready 状态的 Pod）。SRV 记录指向一个包含 Pod IP 地址的记录表项。


在一个终端中查看 StatefulSet 的 Pod。

```shell
kubectl get pod -w -l app=nginx
```

在另一个终端中使用 [`kubectl delete`](/docs/user-guide/kubectl/{{page.version}}/#delete)  删除 StatefulSet 中所有的 Pod。

```shell
kubectl delete pod -l app=nginx
pod "web-0" deleted
pod "web-1" deleted
```


等待 StatefulSet 重启它们，并且两个 Pod 都变成 Running 和 Ready 状态。

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


使用 `kubectl exec` 和 `kubectl run` 查看 Pod 的主机名和集群内部的 DNS 表项。

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


Pod 的序号、主机名、SRV 条目和记录名称没有改变，但和 Pod 相关联的 IP 地址可能发生了改变。在本教程中使用的集群中它们就改变了。这就是为什么不要在其他应用中使用 StatefulSet 中的 Pod 的 IP 地址进行连接，这点很重要。


如果你需要查找并连接一个 StatefulSet 的活动成员，你应该查询 Headless Service 的 CNAME。和 CNAME 相关联的 SRV 记录只会包含 StatefulSet 中处于 Running 和 Ready 状态的 Pod。


如果你的应用已经实现了用于测试 liveness 和 readiness 的连接逻辑，你可以使用 Pod 的 SRV 记录（`web-0.nginx.default.svc.cluster.local`,
`web-1.nginx.default.svc.cluster.local`）。因为他们是稳定的，并且当你的 Pod 的状态变为 Running 和 Ready 时，你的应用就能够发现它们的地址。


### 写入稳定的存储


获取 `web-0` 和 `web-1` 的 PersistentVolumeClaims。

```shell
kubectl get pvc -l app=nginx
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           48s
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           48s
```

StatefulSet 控制器创建了两个 PersistentVolumeClaims，绑定到两个  [PersistentVolumes](/docs/concepts/storage/volumes/)。由于本教程使用的集群配置为动态提供 PersistentVolume，所有的 PersistentVolume 都是自动创建和绑定的。


NGINX web 服务器默认会加载位于 `/usr/share/nginx/html/index.html` 的 index 文件。StatefulSets `spec` 中的 `volumeMounts` 字段保证了 `/usr/share/nginx/html` 文件夹由一个 PersistentVolume 支持。


将Pod的主机名写入它们的 `index.html` 文件并验证 NGINX web 服务器使用该主机名提供服务。

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'echo $(hostname) > /usr/share/nginx/html/index.html'; done

for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```


请注意，如果你看见上面的 curl 命令返回了 403 Forbidden 的响应，你需要像这样修复使用 `volumeMounts`
(due to a [bug when using hostPath volumes](https://github.com/kubernetes/kubernetes/issues/2630))挂载的目录的权限：

```shell
for i in 0 1; do kubectl exec web-$i -- chmod 755 /usr/share/nginx/html; done
```

在你重新尝试上面的 curl 命令之前。

在一个终端查看 StatefulSet 的 Pod。

```shell
kubectl get pod -w -l app=nginx
```


在另一个终端删除 StatefulSet 所有的 Pod。

```shell
kubectl delete pod -l app=nginx
pod "web-0" deleted
pod "web-1" deleted
```

在第一个终端里检查 `kubectl get` 命令的输出，等待所有 Pod 变成 Running 和 Ready 状态。

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


验证所有 web 服务器在继续使用它们的主机名提供服务。

```
for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```


虽然 `web-0` 和 `web-1` 被重新调度了，但它们仍然继续监听各自的主机名，因为和它们的 PersistentVolumeClaim 相关联的 PersistentVolume 被重新挂载到了各自的 `volumeMount` 上。不管 `web-0` 和 `web-1` 被调度到了哪个节点上，它们的 PersistentVolumes 将会被挂载到合适的挂载点上。


## 扩容/缩容 StatefulSet

扩容/缩容 StatefulSet 指增加或减少它的副本数。这通过更新 `replicas` 字段完成。你可以使用[`kubectl scale`](/docs/user-guide/kubectl/{{page.version}}/#scale) 或者[`kubectl patch`](/docs/user-guide/kubectl/{{page.version}}/#patch)来扩容/缩容一个 StatefulSet。


### 扩容


在一个终端窗口观察 StatefulSet 的 Pod。

```shell
kubectl get pods -w -l app=nginx
```


在另一个终端窗口使用 `kubectl scale` 扩展副本数为5。

```shell
kubectl scale sts web --replicas=5
statefulset "web" scaled
```


在第一个 终端中检查 `kubectl get` 命令的输出，等待增加的3个 Pod 的状态变为 Running 和 Ready。

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


StatefulSet 控制器扩展了副本的数量。如同[创建 StatefulSet](#顺序创建pod)所述，StatefulSet 按序号索引顺序的创建每个 Pod，并且会等待前一个 Pod 变为 Running 和 Ready 才会启动下一个Pod。


### 缩容


在一个终端观察 StatefulSet 的 Pod。

```shell
kubectl get pods -w -l app=nginx
```


在另一个终端使用 `kubectl patch` 将 StatefulSet 缩容回三个副本。

```shell
kubectl patch sts web -p '{"spec":{"replicas":3}}'
"web" patched
```


等待 `web-4` 和 `web-3` 状态变为 Terminating。

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


### 顺序终止 Pod


控制器会按照与 Pod 序号索引相反的顺序每次删除一个 Pod。在删除下一个 Pod 前会等待上一个被完全关闭。


获取 StatefulSet 的 PersistentVolumeClaims。

```shell
kubectl get pvc -l app=nginx
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-2   Bound     pvc-e1125b27-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-3   Bound     pvc-e1176df6-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-4   Bound     pvc-e11bb5f8-b508-11e6-932f-42010a800002   1Gi        RWO           13h

```


五个 PersistentVolumeClaims 和五个 PersistentVolumes 仍然存在。查看 Pod 的 [稳定存储](#stable-storage)，我们发现当删除 StatefulSet 的 Pod 时，挂载到 StatefulSet 的 Pod 的 PersistentVolumes不会被删除。当这种删除行为是由 StatefulSe t缩容引起时也是一样的。


## 更新 StatefulSet


Kubernetes 1.7 版本的 StatefulSet 控制器支持自动更新。更新策略由 StatefulSet API Object 的 `spec.updateStrategy` 字段决定。这个特性能够用来更新一个 StatefulSet 中的 Pod 的 container images, resource requests，以及 limits, labels 和 annotations。


### On Delete 策略

`OnDelete` 更新策略实现了传统（1.7之前）行为，它也是默认的更新策略。当你选择这个更新策略并修改 StatefulSet 的 `.spec.template` 字段时， StatefulSet 控制器将不会自动的更新Pod。


Patch `web` StatefulSet 的容器镜像。 

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"k8s.gcr.io/nginx-slim:0.7"}]'
"web" patched
```


删除 `web-0` Pod。

```shell
kubectl delete pod web-0
pod "web-0" deleted
```

<--
Watch the `web-0` Pod, and wait for it to transition to Running and Ready.
-->
观察 `web-0` Pod， 等待它变成 Running 和 Ready。

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


获取 `web` StatefulSet 的 Pod 来查看他们的容器镜像。

```shell{% raw %}
kubectl get pod -l app=nginx -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[0].image}{"\n"}{end}'
web-0   k8s.gcr.io/nginx-slim:0.7
web-1   k8s.gcr.io/nginx-slim:0.8
web-2   k8s.gcr.io/nginx-slim:0.8
{% endraw %}```

`web-0` has had its image updated, but `web-0` and `web-1` still have the original 
image. Complete the update by deleting the remaining Pods.

​```shell
kubectl delete pod web-1 web-2
pod "web-1" deleted
pod "web-2" deleted
```


观察 StatefulSet 的 Pod，等待它们全部变成 Running 和 Ready。

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


获取 Pod 来查看他们的容器镜像。

```shell{% raw %}
kubectl get pod -l app=nginx -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[0].image}{"\n"}{end}'
web-0   k8s.gcr.io/nginx-slim:0.7
web-1   k8s.gcr.io/nginx-slim:0.7
web-2   k8s.gcr.io/nginx-slim:0.7
{% endraw %}
```


现在，StatefulSet 中的 Pod 都已经运行了新的容器镜像。


### Rolling Update 策略


`RollingUpdate` 更新策略会更新一个 StatefulSet 中所有的 Pod，采用与序号索引相反的顺序并遵循 StatefulSet 的保证。


Patch `web` StatefulSet 来执行 `RollingUpdate` 更新策略。

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate"}}}'
statefulset "web" patched
```

在一个终端窗口中 patch `web` StatefulSet 来再次的改变容器镜像。

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"k8s.gcr.io/nginx-slim:0.8"}]'
statefulset "web" patched
```


在另一个终端监控 StatefulSet 中的 Pod。

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

StatefulSet 里的 Pod 采用和序号相反的顺序更新。在更新下一个 Pod 前，StatefulSet 控制器终止每个 Pod 并等待它们变成 Running 和 Ready。请注意，虽然在顺序后继者变成 Running 和 Ready 之前 StatefulSet 控制器不会更新下一个 Pod，但它仍然会重建任何在更新过程中发生故障的 Pod， 使用的是它们当前的版本。已经接收到更新请求的 Pod 将会被恢复为更新的版本，没有收到请求的 Pod 则会被恢复为之前的版本。像这样，控制器尝试继续使应用保持健康并在出现间歇性故障时保持更新的一致性。


获取 Pod 来查看他们的容器镜像。

```shell{% raw %}
for p in 0 1 2; do kubectl get po web-$p --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
k8s.gcr.io/nginx-slim:0.8
k8s.gcr.io/nginx-slim:0.8
k8s.gcr.io/nginx-slim:0.8
{% endraw %}
```

StatefulSet 中的所有 Pod 现在都在运行之前的容器镜像。


**小窍门**：你还可以使用 `kubectl rollout status sts/<name>` 来查看 rolling update 的状态。


#### 分段更新

你可以使用 `RollingUpdate` 更新策略的 `partition` 参数来分段更新一个 StatefulSet。分段的更新将会使 StatefulSet 中的其余所有 Pod 保持当前版本的同时仅允许改变 StatefulSet 的  `.spec.template`。


Patch `web` StatefulSet 来对 `updateStrategy` 字段添加一个分区。

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":3}}}}'
statefulset "web" patched
```


再次 Patch StatefulSet 来改变容器镜像。

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"k8s.gcr.io/nginx-slim:0.7"}]'
statefulset "web" patched
```


删除 StatefulSet 中的 Pod。

```shell
kubectl delete po web-2
pod "web-2" deleted
```


等待 Pod 变成 Running 和 Ready。

```shell
kubectl get po -lapp=nginx -w
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```


获取 Pod 的容器。

```shell{% raw %}
get po web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
k8s.gcr.io/nginx-slim:0.8
{% endraw %}
```


请注意，虽然更新策略是 `RollingUpdate`，StatefulSet 控制器还是会使用原始的容器恢复 Pod。这是因为 Pod 的序号比 `updateStrategy` 指定的 `partition` 更小。


#### 灰度扩容

你可以通过减少 [上文](#分段更新)指定的 `partition` 来进行灰度扩容，以此来测试你的程序的改动。


Patch StatefulSet 来减少分区。

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":2}}}}'
statefulset "web" patched
```


等待 `web-2` 变成 Running 和 Ready。

```shell
kubectl get po -lapp=nginx -w
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```


获取 Pod 的容器。

```shell{% raw %}
kubectl get po web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
k8s.gcr.io/nginx-slim:0.7
{% endraw %}
```


当你改变 `partition` 时，StatefulSet 会自动的更新 `web-2` Pod，这是因为 Pod 的序号小于或等于 `partition`。


删除 `web-1` Pod。

```shell
kubectl delete po web-1
pod "web-1" deleted
```


等待 `web-1` 变成 Running 和 Ready。

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


获取 `web-1` Pod 的容器。

```shell{% raw %}
get po web-1 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
k8s.gcr.io/nginx-slim:0.8
{% endraw %}
```

`web-1` 被按照原来的配置恢复，因为 Pod 的序号小于分区。当指定了分区时，如果更新了 StatefulSet 的 `.spec.template`，则所有序号大于或等于分区的 Pod 都将被更新。如果一个序号小于分区的 Pod 被删除或者终止，它将被按照原来的配置恢复。


#### 分阶段的扩容

你可以使用类似[灰度扩容](#灰度扩容)的方法执行一次分阶段的扩容（例如一次线性的、等比的或者指数形式的扩容）。要执行一次分阶段的扩容，你需要设置 `partition` 为希望控制器暂停更新的序号。


分区当前为`2`。请将分区设置为`0`。

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":0}}}}'
statefulset "web" patched
```


等待 StatefulSet 中的所有 Pod 变成 Running 和 Ready。

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


获取 Pod 的容器。

```shell{% raw %}
for p in 0 1 2; do kubectl get po web-$p --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
k8s.gcr.io/nginx-slim:0.7
k8s.gcr.io/nginx-slim:0.7
k8s.gcr.io/nginx-slim:0.7
{% endraw %}
```


将 `partition` 改变为 `0` 以允许StatefulSet控制器继续更新过程。


## 删除 StatefulSet


StatefulSet 同时支持级联和非级联删除。使用非级联方式删除 StatefulSet 时，StatefulSet 的 Pod 不会被删除。使用级联删除时，StatefulSet 和它的 Pod 都会被删除。


### 非级联删除


在一个终端窗口查看 StatefulSet 中的 Pod。

```
kubectl get pods -w -l app=nginx
```


使用 [`kubectl delete`](/docs/user-guide/kubectl/{{page.version}}/#delete) 删 除StatefulSet。请确保提供了 `--cascade=false` 参数给命令。这个参数告诉 Kubernetes 只删除 StatefulSet 而不要删除它的任何 Pod。

```shell
kubectl delete statefulset web --cascade=false
statefulset "web" deleted
```


获取 Pod 来检查他们的状态。

```shell
kubectl get pods -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          6m
web-1     1/1       Running   0          7m
web-2     1/1       Running   0          5m
```


虽然 `web`  已经被删除了，但所有 Pod 仍然处于 Running 和 Ready 状态。
删除 `web-0`。

```shell
kubectl delete pod web-0
pod "web-0" deleted
```


获取 StatefulSet 的 Pod。

```shell
kubectl get pods -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-1     1/1       Running   0          10m
web-2     1/1       Running   0          7m
```


由于 `web` StatefulSet 已经被删除，`web-0` 没有被重新启动。


在一个终端监控 StatefulSet 的 Pod。

```shell
kubectl get pods -w -l app=nginx
```


在另一个终端里重新创建 StatefulSet。请注意，除非你删除了 `nginx` Service （你不应该这样做），你将会看到一个错误，提示 Service 已经存在。

```shell
kubectl create -f web.yaml 
statefulset "web" created
Error from server (AlreadyExists): error when creating "web.yaml": services "nginx" already exists
```


请忽略这个错误。它仅表示 kubernetes 进行了一次创建 nginx Headless Service 的尝试，尽管那个 Service 已经存在。


在第一个终端中运行并检查 `kubectl get` 命令的输出。

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


当重新创建 `web` StatefulSet 时，`web-0` 被第一个重新启动。由于 `web-1` 已经处于 Running 和 Ready 状态，当 `web-0` 变成 Running 和 Ready 时，StatefulSet 会直接接收这个 Pod。由于你重新创建的 StatefulSet 的 `replicas` 等于2，一旦 `web-0` 被重新创建并且 `web-1` 被认为已经处于 Running 和 Ready 状态时，`web-2` 将会被终止。


让我们再看看被 Pod 的 web 服务器加载的 `index.html` 的内容。

```shell
for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```


尽管你同时删除了 StatefulSet 和 `web-0` Pod，但它仍然使用最初写入 `index.html` 文件的主机名进行服务。这是因为 StatefulSet 永远不会删除和一个 Pod 相关联的 PersistentVolumes。当你重建这个 StatefulSet 并且重新启动了 `web-0` 时，它原本的 PersistentVolume 会被重新挂载。


### 级联删除


在一个终端窗口观察 StatefulSet 里的 Pod。

```shell
kubectl get pods -w -l app=nginx
```


在另一个窗口中再次删除这个 StatefulSet。这次省略 `--cascade=false` 参数。

```shell
kubectl delete statefulset web
statefulset "web" deleted
```

在第一个终端检查 `kubectl get` 命令的输出，并等待所有的 Pod 变成 Terminating 状态。

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

如同你在[缩容](#ordered-pod-termination)一节看到的，Pod 按照和他们序号索引相反的顺序每次终止一个。在终止一个 Pod 前，StatefulSet 控制器会等待 Pod 后继者被完全终止。


请注意，虽然级联删除会删除 StatefulSet 和它的 Pod，但它并不会删除和 StatefulSet 关联 的Headless Service。你必须手动删除 `nginx` Service。

```shell
kubectl delete service nginx
service "nginx" deleted
```


再一次重新创建 StatefulSet 和 Headless Service。

```shell
kubectl create -f web.yaml 
service "nginx" created
statefulset "web" created
```


当 StatefulSet 所有的 Pod 变成 Running 和 Ready 时，获取它们的 `index.html` 文件的内容。

```shell
for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```


即使你已经删除了 StatefulSet 和它的全部 Pod，这些 Pod 将会被重新创建并挂载它们的 PersistentVolumes，并且 `web-0` 和 `web-1` 将仍然使用它们的主机名提供服务。


最后删除 `web` StatefulSet 和 `nginx` service。

```shell
kubectl delete service nginx
service "nginx" deleted

kubectl delete statefulset web
statefulset "web" deleted
```


## Pod 管理策略


对于某些分布式系统来说，StatefulSet 的顺序性保证是不必要和/或者不应该的。这些系统仅仅要求唯一性和身份标志。为了解决这个问题，在 Kubernetes 1.7 中我们针对 StatefulSet API Object 引入了 `.spec.podManagementPolicy`。


### OrderedReady Pod 管理策略


`OrderedReady` pod 管理策略是 StatefulSets 的默认选项。它告诉 StatefulSet 控制器遵循上文展示的顺序性保证。


### Parallel Pod 管理策略


`Parallel` pod 管理策略告诉 StatefulSet 控制器并行的终止所有 Pod，在启动或终止另一个 Pod 前，不必等待这些 Pod 变成 Running 和 Ready 或者完全终止状态。

{% include code.html language="yaml" file="webp.yaml" ghlink="/docs/tutorials/stateful-application/webp.yaml" %}


下载上面的例子并保存为 `webp.yaml`。


这份清单和你在上文下载的完全一样，只是 `web` StatefulSet 的 `.spec.podManagementPolicy` 设置成了 `Parallel`。


在一个终端窗口查看 StatefulSet 中的 Pod。

```shell
kubectl get po -lapp=nginx -w
```


在另一个终端窗口创建清单中的 StatefulSet 和 Service。

```shell
kubectl create -f webp.yaml 
service "nginx" created
statefulset "web" created
```


查看你在第一个终端中运行的 `kubectl get` 命令的输出。

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


StatefulSet 控制器同时启动了 `web-0` 和 `web-1`。

保持第二个终端打开，并在另一个终端窗口中扩容 StatefulSet。

```shell
kubectl scale statefulset/web --replicas=4
statefulset "web" scaled
```


在 `kubectl get` 命令运行的终端里检查它的输出。

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
StatefulSet 控制器启动了两个新的 Pod，而且在启动第二个之前并没有等待第一个变成 Running 和 Ready 状态。

保持这个终端打开，并在另一个终端删除 `web` StatefulSet。

```shell
kubectl delete sts web
```


在另一个终端里再次检查 `kubectl get` 命令的输出。

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


StatefulSet 控制器将并发的删除所有 Pod，在删除一个 Pod 前不会等待它的顺序后继者终止。


关闭 `kubectl get` 命令运行的终端并删除 `nginx`  Service。

```shell
kubectl delete svc nginx
```
{% endcapture %}

{% capture cleanup %}

你需要删除本教程中用到的 PersistentVolumes 的持久化存储媒体。基于你的环境、存储配置和提供方式，按照必须的步骤保证回收所有的存储。
{% endcapture %}

{% include templates/tutorial.md %}
