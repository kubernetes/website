---
approvers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
cn-approvers:
- linyouchong
title: PetSets
---

<!--
__Warning:__ Starting in Kubernetes version 1.5, PetSet has been renamed to [StatefulSet](/docs/concepts/abstractions/controllers/statefulsets). To use (or continue to use) PetSet in Kubernetes 1.5, you _must_ [migrate](/docs/tasks/manage-stateful-set/upgrade-pet-set-to-stateful-set/) your existing PetSets to StatefulSets. For information on working with StatefulSet, see the tutorial on [how to run replicated stateful applications](/docs/tutorials/stateful-application/run-replicated-stateful-application).

__This document has been deprecated__, but can still apply if you're using
  Kubernetes version 1.4 or earlier.
-->
__警告:__ 从Kubernetes 1.5 版本开始，PetSet 被重命名为 [StatefulSet](/docs/concepts/abstractions/controllers/statefulsets)。如果您想在 Kubernetes 1.5 版本中使用（或继续使用）PetSet，您 _必须_ [迁移](/docs/tasks/manage-stateful-set/upgrade-pet-set-to-stateful-set/) 您现有的 PetSet 为 StatefulSet。有关于如何使用 StatefulSet 的资料，请查看指导文档[如何运行分布式的有状态应用](/docs/tutorials/stateful-application/run-replicated-stateful-application)。

__本文档已经被废弃__，但如果您使用的是 Kubernetes 1.4 或更早的版本，您仍然可以参考本文档。

* TOC
{:toc}

<!--
__Terminology__
-->
__术语__

<!--
Throughout this doc you will see a few terms that are sometimes used interchangeably elsewhere, that might cause confusion. This section attempts to clarify them.

* Node: A single virtual or physical machine in a Kubernetes cluster.
* Cluster: A group of nodes in a single failure domain, unless mentioned otherwise.
* Persistent Volume Claim (PVC): A request for storage, typically a [persistent volume](/docs/user-guide/persistent-volumes/walkthrough/).
* Host name: The hostname attached to the UTS namespace of the pod, i.e. the output of `hostname` in the pod.
* DNS/Domain name: A *cluster local* domain name resolvable using standard methods (e.g.: [gethostbyname](http://linux.die.net/man/3/gethostbyname)).
* Ordinality: the property of being "ordinal", or occupying a position in a sequence.
* Pet: a single member of a PetSet; more generally, a stateful application.
* Peer: a process running a server, capable of communicating with other such processes.
-->
在本文档中您会看到一些术语，它们之间有时互换使用，这可能会造成疑惑。本小节尝试澄清这些术语。

* 节点：指Kubernetes集群中的一个虚拟的或物理的机器。
* 集群：指单故障域中的一组节点， 除非特指别的情况。
* Persistent Volume Claim (PVC)：指对存储的使用请求， 存储一般指 [persistent volume](/docs/user-guide/persistent-volumes/walkthrough/)。
* 主机名：附加到 pod 的UTS名称空间的主机名，即 pod 中 `hostname` 命令的输出。
* DNS/域名：一个使用标准方法（即：[gethostbyname](http://linux.die.net/man/3/gethostbyname)）就可解析的本地集群域名。
* 序类型：作为顺序的属性，或者指一个顺序序列中的位置。
* Pet：PetSet 的一个成员；更一般地说，是指有状态应用。
* Peer：指一个服务器进程，拥有和其它同类进程通讯的能力

<!--
__Prerequisites__

This doc assumes familiarity with the following Kubernetes concepts:

* [Pods](/docs/user-guide/pods/single-container/)
* [Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)
* [Headless Services](/docs/user-guide/services/#headless-services)
* [Persistent Volumes](/docs/concepts/storage/volumes/)
* [Persistent Volume Provisioning](https://github.com/kubernetes/examples/tree/{{page.githubbranch}}/staging/persistent-volume-provisioning/README.md)

You need a working Kubernetes cluster at version >= 1.3, with a healthy DNS [cluster addon](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/README.md) at version >= 15. You cannot use PetSet on a hosted Kubernetes provider that has disabled `alpha` resources.
-->
__预备知识__

本文档假设您熟悉以下 Kubernetes 概念：

* [Pods](/docs/user-guide/pods/single-container/)
* [Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)
* [Headless Services](/docs/user-guide/services/#headless-services)
* [Persistent Volumes](/docs/concepts/storage/volumes/)
* [Persistent Volume Provisioning](https://github.com/kubernetes/examples/tree/{{page.githubbranch}}/staging/persistent-volume-provisioning/README.md)

您需要一个版本号 >= 1.3 的运行中的Kubernetes集群，且安装了版本号 >= 15 的健康的DNS [集群插件](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/README.md)。如果您的 Kubernetes 集群禁用了 `alpha` 资源，您将不能使用 PetSet 功能。 

<!--
## What is a PetSet?

In Kubernetes, most pod management abstractions group them into disposable units of work that compose a micro service. Replication controllers for example, are designed with a weak guarantee - that there should be N replicas of a particular pod template. The pods are treated as stateless units, if one of them is unhealthy or superseded by a newer version, the system just disposes it.
-->
## PetSet是什么

在Kubernetes中，很多 pod 管理概念都被组织为多个一次性的工作单元，这些单元组成一个微服务。以 Replication controller 为例，它被设计为低保证的 - 必须存在指定 pod 模板的 N 个复本。其中的 pod 被视为无状态的单元，如果某个 pod 处理非健康状态或者被一个更新的版本所取代，系统只需要丢弃它。

```
    foo.default.svc.cluster.local
             |service|
             /       \
    | pod-asdf |    | pod-zxcv |
```

<!--
A PetSet, in contrast, is a group of stateful pods that require a stronger notion of identity. The document refers to these as "clustered applications".
-->
一个 PetSet，相反，是一组有状态的 pod ，它们对自身的身份标志有更高的需要。本文指这类 pod 为 "集群应用"。

```
   *.foo.default.svc.cluster.local
    | mysql-0 | <-> | mysql-1 |
      [pv 0]          [pv 1]
```

<!--
The co-ordinated deployment of clustered applications is notoriously hard. They require stronger notions of identity and membership, which they use in opaque internal protocols, and are especially prone to race conditions and deadlock. Traditionally administrators have deployed these applications by leveraging nodes as stable, long-lived entities with persistent storage and static ips.
-->
众所周知，集群应用的协同部署是一件困难的事情。它们对集群成员的身份标识和成员关系有较高的要求，这些信息会在不透明的内部协议中被使用，它们还容易处于互相竞争或死锁状态。管理员习惯于在具有持久化存储和固定 IP 的长期稳定的实体上部署这些应用。

<!--
The goal of PetSet is to decouple this dependency by assigning identities to individual instances of an application that are not anchored to the underlying physical infrastructure. For the rest of this document we will refer to these entities as "Pets". Our use of this term is predated by the "Pets vs Cattle" analogy.
-->
PetSet 的目标是通过分配与底层物理架构无关的身份标识给应用实例将这种依赖解耦。在本文接下来的部分，我们将称这些实体为 "Pet"。我们使用的这个术语是从 "Pets vs Cattle"类推的。

<!--
__Relationship between Pets and Pods__: PetSet requires there be {0..N-1} Pets. Each Pet has a deterministic name - PetSetName-Ordinal, and a unique identity. Each Pet has at most one pod, and each PetSet has at most one Pet with a given identity.
-->
__ Pet 和 Pod 的关系__：PetSet 中存在 {0..N-1} 个 Pet。每个Pet有固定的名称 - PetSetName-Ordinal，和一个唯一的身份标识。每个 Pet 最多拥有一个 Pod ，每个 PetSet 中最多只能有一个 Pet 使用一个特定的身份标识。

<!--
## When to use PetSet?

A PetSet ensures that a specified number of "pets" with unique identities are running at any given time. The identity of a Pet is comprised of:

* a stable hostname, available in DNS
* an ordinal index
* stable storage: linked to the ordinal & hostname
-->
## 何时使用 PetSet ?

一个 PetSet 保证了在任何时刻都有指定数量的拥有独特身份标识的 Pet 正在运行。一个 Pet 的身份标识由以下几个属性组成：
* 一个固定的主机名，在DNS中可获得
* 一个序号索引
* 稳定的存储：与序号和主机名有关联

<!--
These properties are useful in deploying stateful applications. However most stateful applications are also clustered, meaning they form groups with strict membership requirements that rely on stored state. PetSet also helps with the 2 most common problems encountered managing such clustered applications:

* discovery of peers for quorum
* startup/teardown ordering
-->
这些属性在部署有状态应用时非常有用。然而，大多数有状态应用也是集群化的，意味着它们组成具有严格的成员关系的小组，这种关系需要依赖于存储的状态。PetSet 还对管理这类集群化应用遇到的两个普遍问题有帮助：

* 发现成员数量
* 启动/销毁顺序

<!--
Only use PetSet if your application requires some or all of these properties. Managing pods as stateless replicas is vastly easier.

Example workloads for PetSet:

* Databases like MySQL or PostgreSQL that require a single instance attached to an NFS persistent volume at any time
* Clustered software like Zookeeper, Etcd, or Elasticsearch that require stable membership.
-->
只有您的应用需要使用全部或部分这些特性时才使用 PetSet。否则将 pod 作为无状态的复本进行管理会更容易些。

使用 PetSet 工作的例子：
* 像 MySQL 或 PostgreSQL 这样的数据库应用，在任何时候都需要一个单独的实例连接到NFS持久卷上
* 集群化软件，如Zookeeper、Etcd 或 Elasticsearch，它们需要稳定的成员关系。

<!--
## Alpha limitations

Before you start deploying applications as PetSets, there are a few limitations you should understand.

* PetSet is an *alpha* resource, not available in any Kubernetes release prior to 1.3.
* As with all alpha/beta resources, it can be disabled through the `--runtime-config` option passed to the apiserver, and in fact most likely will be disabled on hosted offerings of Kubernetes.
* The only updatable field on a PetSet is `replicas`.
* The storage for a given pet must either be provisioned by a [persistent volume provisioner](https://github.com/kubernetes/examples/tree/{{page.githubbranch}}/staging/persistent-volume-provisioning/README.md) based on the requested `storage class`, or pre-provisioned by an admin. Note that persistent volume provisioning is also currently in alpha.
* Deleting and/or scaling a PetSet down will *not* delete the volumes associated with the PetSet. This is done to ensure safety first, your data is more valuable than an auto purge of all related PetSet resources. **Deleting the Persistent Volume Claims will result in a deletion of the associated volumes**.
* All PetSets currently require a "governing service", or a Service responsible for the network identity of the pets. The user is responsible for this Service.
* Updating an existing PetSet is currently a manual process, meaning you either need to deploy a new PetSet with the new image version, or orphan Pets one by one, update their image, and join them back to the cluster.
-->
## Alpha 限制

在您开始将应用部署为 PetSet之前，您需要明白几点局限性。

* PetSet 是一个 *alpha* 资源，在Kubernetes 1.3 之前的版本不可用
* 就像所有的 alpha/beta 资源一样，您也可以通过给 apiserver 传递 --runtime-config 选项来禁用 PetSet，事实上在市场上提供的 Kubernetes 托管服务中这些资源非常有可能已经被禁用了。
* PetSet 中唯一可以更改的域是 `replicas`.
* 一个 Pet 的存储由基于请求的 `storage class` 的[persistent volume provisioner](https://github.com/kubernetes/examples/tree/{{page.githubbranch}}/staging/persistent-volume-provisioning/README.md) 提供，或者由管理员预先提供。需要注意的是提供 persistent volume 特性目前也处于 alpha 阶段。
* 删除或减少 PetSet 的 Pet 数量不会删除已关联到 PetSet 的 volume。这是为了保证安全第一，您的数据比自动清除所有相关的PetSet资源更有价值。 **删除 Persistent Volume Claims 将导致关联的 volume 被删除**.
* 当前所有 PetSet 都需要一个 "governing service"， 或者一个负责 Pet 网络标识的服务。用户自己要负责创建这个服务。
* 修改一个已存在的 PetSet 是一个手动的过程，意味着您需要新部署一个使用了新的镜像版本的 PetSet，或先将 Pet 一个一个地从集群中隔离出来，更新它们的镜像，再将他们重新加入集群。

<!--
## Example PetSet

We'll create a basic PetSet to demonstrate how Pets are assigned unique and "sticky" identities.

{% include code.html language="yaml" file="petset.yaml" ghlink="/docs/concepts/workloads/controllers/petset.yaml" %}

Saving this config into `petset.yaml` and submitting it to a Kubernetes cluster should create the defined PetSet and Pets it manages:
-->
## PetSet例子

我们将创建一个基础的 PetSet 来说明如何给 Pet 分配一个唯一的固定的身份标识的。

{% include code.html language="yaml" file="petset.yaml" ghlink="/docs/concepts/workloads/controllers/petset.yaml" %}

将这个配置保存到 `petset.yaml` 文件并提交到一个 Kubernetes 集群执行，文件中定义的 PetSet 和其所管理的 Pet 都将被创建：

```shell
$ kubectl create -f petset.yaml
service "nginx" created
petset "web" created
```

<!--
## Pet Identity

The identity of a Pet sticks to it, regardless of which node it's (re) scheduled on. We can examine the identity of the pets we just created.
-->
## Pet 身份标识

无论一个 Pet 被调度到哪个节点上运行，它都有固定的身份标识。我们可以检查一下刚刚创建的 Pet 的身份标识：

<!--
### Ordinal index

you should see 2 pods with predictable names formatted thus: `$(petset name)-$(ordinal index assigned by petset controller)`
-->
### 顺序索引

您可以看到 2 个 pod 具有可预测的名称，其格式为：`$(petset name)-$(ordinal index assigned by petset controller)`

```shell
$ kubectl get po
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          10m
web-1     1/1       Running   0          10m
```

<!--
### Stable storage

2 persistent volumes, one per pod. This is auto created by the PetSet based on the `volumeClaimTemplate` field
-->
### 稳定的存储

2 个 persistent volume，每个 pod 一个。这是由 PetSet 根据 `volumeClaimTemplate` 字段自动创建的。

```shell
$ kubectl get pv
NAME                                       CAPACITY   ACCESSMODES   STATUS    CLAIM               REASON    AGE
pvc-90234946-3717-11e6-a46e-42010af00002   1Gi        RWO           Bound     default/www-web-0             11m
pvc-902733c2-3717-11e6-a46e-42010af00002   1Gi        RWO           Bound     default/www-web-1             11m
```

<!--
### Network identity

The network identity has 2 parts. First, we created a headless Service that controls the domain within which we create Pets. The domain managed by this Service takes the form: `$(service name).$(namespace).svc.cluster.local`, where "cluster.local" is the [cluster domain](/docs/concepts/services-networking/dns-pod-service/). As each pet is created, it gets a matching DNS subdomain, taking the form: `$(petname).$(governing service domain)`, where the governing service is defined by the `serviceName` field on the PetSet.

Here are some examples of choices for Cluster Domain, Service name, PetSet name, and how that affects the DNS names for the Pets and the hostnames in the Pet's pods:
-->
### 网络身份标识

网络身份标识由两部分组成。第一，我们创建了一个 headless Service 用于控制所创建 Pet 的域名。这个 Service 所管理的域格式为：`$(service name).$(namespace).svc.cluster.local`，"cluster.local" 是指 [cluster domain](/docs/concepts/services-networking/dns-pod-service/)。当每个 Pet 被创建时，它会获得一个匹配的 DNS 子域，域格式为：`$(petname).$(governing service domain)`，“governing service” 是在 PetSet 的 `serviceName` 字段中定义的。

Cluster Domain | Service (ns/name) | PetSet (ns/name)  | PetSet Domain  | Pet DNS | Pet Hostname |
-------------- | ----------------- | ----------------- | -------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

<!--
Note that Cluster Domain will be set to `cluster.local` unless [otherwise configured](https://github.com/kubernetes/kubernetes/blob/master/examples/cluster-dns/README.md).

Let's verify our assertion with a simple test.
-->
需要注意的是 Cluster Domain 列会被设置为 `cluster.local`，除非您使用了[其它配置](https://github.com/kubernetes/kubernetes/blob/master/examples/cluster-dns/README.md)。

```shell
$ kubectl get svc
NAME          CLUSTER-IP     EXTERNAL-IP       PORT(S)   AGE
nginx         None           <none>            80/TCP    12m
...
```

<!--
First, the PetSet provides a stable hostname:
-->
第一，PetSet 提供了一个稳定的主机名：

```shell
$ for i in 0 1; do kubectl exec web-$i -- sh -c 'hostname'; done
web-0
web-1
```

<!--
And the hostname is linked to the in-cluster DNS address:
-->
而且主机名与集群内部DNS地址关联：

```shell
$ kubectl run -i --tty --image busybox dns-test --restart=Never /bin/sh
dns-test # nslookup web-0.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-0.nginx
Address 1: 10.180.3.5

dns-test # nslookup web-1.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-1.nginx
Address 1: 10.180.0.9
```

<!--
The containers are running nginx webservers, which by default will look for an index.html file in `/usr/share/nginx/html/index.html`. That directory is backed by a `PersistentVolume` created by the PetSet. So let's write our hostname there:
-->
这些容器内部运行了 nginx 服务器，它们会默认在 `/usr/share/nginx/html/index.html` 目录查找 index.html 文件。这个目录由 PetSet 创建的一个 `PersistentVolume` 提供。我们来把主机名写到那个目录试试： 

```shell
$ for i in 0 1; do
  kubectl exec web-$i -- sh -c 'echo $(hostname) > /usr/share/nginx/html/index.html';
done
```

<!--
And verify each webserver serves its own hostname:
-->
验证一下每个 web 服务器是否展示了它们自己的主机名：

```shell
$ for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done
web-0
web-1
```

<!--
Now delete all pods in the petset:
-->
接下来删除 PetSet 中的所有 pod ：

```shell
$ kubectl delete po -l app=nginx
pod "web-0" deleted
pod "web-1" deleted
```

<!--
Wait for them to come back up, and try to retrieve the previously written hostname through the DNS name of the peer. They match, because the storage, DNS name, and hostname stick to the Pet no matter where it gets scheduled:
-->
等待它们重新出现，然后试着通过每个成员的 DNS 域名去获取之前被写入的主机名。它们是一致的，因为无论 Pet 被调度到哪个节点， 它的存储、DNS名称和主机名都是固定的。

```shell
$ kubectl exec -it web-1 -- curl web-0.nginx
web-0
$ kubectl exec -it web-0 -- curl web-1.nginx
web-1
```

<!--
## Peer discovery

A pet can piece together its own identity:

1. Use the [downward api](/docs/tasks/configure-pod-container/downward-api-volume-expose-pod-information/) to find its pod name
2. Run `hostname` to find its DNS name
3. Run `mount` or `df` to find its volumes (usually this is unnecessary)

It's not necessary to "discover" the governing Service of a PetSet, since it's known at creation time you can simply pass it down through an [environment variable](/docs/user-guide/environment-guide).

Usually pets also need to find their peers. In the previous nginx example, we just used `kubectl` to get the names of existing pods, and as humans, we could tell which ones belonged to a given PetSet. Another way to find peers is by contacting the API server, just like `kubectl`, but that has several disadvantages (you end up implementing a Kubernetes specific init system that runs as pid 1 in your application container).

PetSet gives you a way to discover your peers using DNS records. To illustrate this we can use the previous example (note: one usually doesn't `apt-get` in a container).
-->
## 成员发现

一个 Pet 可以拼凑出自己的身份标识：

1、使用 [downward api](/docs/tasks/configure-pod-container/downward-api-volume-expose-pod-information/) 获取自己的 pod 名称
2、运行 `hostname` 命令获取自己的 DNS 名称
3、运行 `mount` 或者 `df` 获取自己的卷信息（通常不需要这样做）

不需要去“发现”一个 PetSet 的 governing Service，因为在创建时我们就知道了这些信息，您只需要使用[环境变量](/docs/user-guide/environment-guide) 传递这些信息。

通常来说，Pet 还需要发现它们的伙伴成员。在之前的 nginx 例子中，我们只是使用 `kubectl` 就得到了已存在的 pod 的名称，作为人类，我们能够区分出它们各自属于哪个 PetSet。发现伙伴成员的另外一种方法是通过 API server，类似于 `kubectl`，但是存在几个缺点（您最终实现了一个为 Kubernetes 定制的init系统，该系统在应用程序容器中以pid 1的方式运行）。

```shell
$ kubectl exec -it web-0 /bin/sh
web-0 # apt-get update && apt-get install -y dnsutils
...

web-0 # nslookup -type=srv nginx.default
Server:        10.0.0.10
Address:    10.0.0.10#53

nginx.default.svc.cluster.local    service = 10 50 0 web-1.ub.default.svc.cluster.local.
nginx.default.svc.cluster.local    service = 10 50 0 web-0.ub.default.svc.cluster.local.
```

<!--
## Updating a PetSet

You cannot update any field of the PetSet except `spec.replicas` and the `containers` in the podTemplate. Updating `spec.replicas` will scale the PetSet, updating `containers` will not have any effect till a Pet is deleted, at which time it is recreated with the modified podTemplate.
-->
## 更新一个 PetSet

只能修改 podTemplate 中的 `spec.replicas` 和 `containers` 字段。更新 `spec.replicas` 字段将对 PetSet 进行伸缩，更新 `containers` 字段只有在 Pet 被删除后才会有效果，在它被重新创建时就会使用修改后的 podTemplate。

<!--
## Scaling a PetSet

You can scale a PetSet by updating the "replicas" field. Note however that the controller will only:

1. Create one pet at a time, in order from {0..N-1}, and wait till each one is in [Running and Ready](/docs/user-guide/pod-states) before creating the next
2. Delete one pet at a time, in reverse order from {N-1..0}, and wait till each one is completely shutdown (past its [terminationGracePeriodSeconds](/docs/concepts/workloads/pods/pod/#termination-of-pods) before deleting the next
-->
## PetSet的伸缩

您可以通过修改 "replicas" 字段让一个 PetSet 进行伸缩。但需要注意的是控制器只会：

1、以 {0..N-1} 的顺序，一次只创建一个 Pet，控制器会等待所有创建中的 pet 处于 [Running and Ready](/docs/user-guide/pod-states) 状态才会开始创建下一个 Pet 。
2、以相反的 {N-1..0} 顺序，一次只删除一个 Pet，控制器会等待一个删除中的 Pet 被彻底关闭(past its [terminationGracePeriodSeconds](/docs/concepts/workloads/pods/pod/#termination-of-pods)之后才会开始删除下一个 Pet 。

```shell
$ kubectl get po
NAME     READY     STATUS    RESTARTS   AGE
web-0    1/1       Running   0          30s
web-1    1/1       Running   0          36s

$ kubectl patch petset web -p '{"spec":{"replicas":3}}'
"web" patched

$ kubectl get po
NAME     READY     STATUS    RESTARTS   AGE
web-0    1/1       Running   0          40s
web-1    1/1       Running   0          46s
web-2    1/1       Running   0          8s
```

<!--
You can also use the `kubectl scale` command:
-->
您还可以使用 `kubectl scale` 命令进行伸缩：

```shell
$ kubectl get petset
NAME      DESIRED   CURRENT   AGE
web       3         3         24m

$ kubectl scale petset web --replicas=5
petset "web" scaled

$ kubectl get po --watch-only
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          10m
web-1     1/1       Running             0          27m
web-2     1/1       Running             0          10m
web-3     1/1       Running             0          3m
web-4     0/1       ContainerCreating   0          48s

$ kubectl get petset web
NAME      DESIRED   CURRENT   AGE
web       5         5         30m
```

<!--
Note however, that scaling up to N and back down to M *will not* delete the volumes of the M-N pets, as described in the section on [deletion](#deleting-a-petset), i.e. scaling back up to M creates new pets that use the same volumes. To see this in action, scale the PetSet back down to 3:
-->
但是请注意，从[删除](#deleting-a-petset)章节的描述可知，先扩张到 N 然后再 收缩到 M *将不会* 删除 M-N 个 pet 的 volume ，即重新扩张回 N 时将使用同样的 volume 。为了看到这个行为，收缩到 3 ：

```shell
$ kubectl get po --watch-only
web-4     1/1       Terminating   0         4m
web-4     1/1       Terminating   0         4m
web-3     1/1       Terminating   0         6m
web-3     1/1       Terminating   0         6m
```

<!--
Note that we still have 5 pvcs:
-->
注意，此时我们仍然拥有5个 pvc：

```shell
$ kubectl get pvc
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-42ca5cef-8113-11e6-82f6-42010af00002   1Gi        RWO           32m
www-web-1   Bound     pvc-42de30af-8113-11e6-82f6-42010af00002   1Gi        RWO           32m
www-web-2   Bound     pvc-ba416413-8115-11e6-82f6-42010af00002   1Gi        RWO           14m
www-web-3   Bound     pvc-ba45f19c-8115-11e6-82f6-42010af00002   1Gi        RWO           14m
www-web-4   Bound     pvc-ba47674a-8115-11e6-82f6-42010af00002   1Gi        RWO           14m
```

<!--
This allows you to upgrade the image of a petset and have it come back up with the same data, as described in the next section.
-->
这将让您可以升级一个 PetSet 的镜像，然后使用同样的数据重新创建实例，下一个章节将描述这一点。

<!--
## Image upgrades

PetSet currently *does not* support automated image upgrade as noted in the section on [limitations](#alpha-limitations), however you can update the `image` field of any container in the podTemplate and delete Pets one by one, the PetSet controller will recreate it with the new image.

Edit the image on the PetSet to `gcr.io/google_containers/nginx-slim:0.7` and delete 1 Pet:
-->
## 镜像升级

当前，PetSet *不支持*镜像自动升级，这一点在[局限性](#alpha-limitations)章节有描述，但是您可以更新 podTemplate 中任一容器的 `image` 字段，然后一个个地删除掉所有的 Pet ，PetSet 控制器将使用新的镜像重新创建它们。

将 PetSet 的 镜像修改为 `gcr.io/google_containers/nginx-slim:0.7`，然后删除一个 Pet：

```shell{% raw %}
$ for p in 0 1 2; do kubectl get po web-$p --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
gcr.io/google_containers/nginx-slim:0.8
gcr.io/google_containers/nginx-slim:0.8
gcr.io/google_containers/nginx-slim:0.8

$ kubectl delete po web-0
pod "web-0" deleted

$ for p in 0 1 2; do kubectl get po web-$p --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
gcr.io/google_containers/nginx-slim:0.7
gcr.io/google_containers/nginx-slim:0.8
gcr.io/google_containers/nginx-slim:0.8
{% endraw %}```

<!--
Delete the remaining 2:
-->
删除余下的 2 个 Pet：

```shell
$ kubectl delete po web-1 web-2
pod "web-1" deleted
pod "web-2" deleted
```

<!--
Wait till the PetSet is stable and check the images:
-->
等 PetSet 变稳定，然后检查它的镜像：

```shell{% raw %}
$ for p in 0 1 2; do kubectl get po web-$p --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
gcr.io/google_containers/nginx-slim:0.7
gcr.io/google_containers/nginx-slim:0.7
gcr.io/google_containers/nginx-slim:0.7
{% endraw %}```

<!--
## Deleting a PetSet

Deleting a PetSet through kubectl will scale it down to 0, thereby deleting all the Pets. If you wish to delete just the PetSet and not the Pets, use `--cascade=false`:
-->
## 删除一个 PetSet

使用 kubectl 删除一个 PetSet 将会使它被收缩到 0 个实例，从而使所有的 Pet 都被删除。如果您希望只是删除 PetSet但是保留它的 Pet，请使用 `--cascade=false`

```shell
$ kubectl delete -f petset.yaml --cascade=false
petset "web" deleted

$ kubectl get po -l app=nginx
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          21h
web-1     1/1       Running   0          21h

$ kubectl delete po -l app=nginx
pod "web-0" deleted
pod "web-1" deleted
```

<!--
Deleting the pods will *not* delete the volumes. Until we finalize the recycle policy for these volumes they will have to get cleaned up by an admin. This is to ensure that you have the chance to copy data off the volume before deleting it. Simply deleting the PVC after the pods have left the [terminating state](/docs/concepts/workloads/pods/pod/#termination-of-pods) should trigger deletion of the backing Persistent Volumes.

**Note: you will lose all your data once the PVC is deleted, do this with caution.**
-->
删除 pod 不会造成 volume 被删除。在我们确定这些 volume 的回收策略之前，它们必须由管理员来清理。这是为了确保在删除数据之前，您有机会将数据从 volume 上复制下来。在 pod 结束[terminating 状态](/docs/concepts/workloads/pods/pod/#termination-of-pods)后，只要删除 PVC 就可以触发对其后端的 Persistent Volume 的删除。

```shell
$ kubectl get po -l app=nginx
$ kubectl get pvc -l app=nginx
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-62d271cd-3822-11e6-b1b7-42010af00002   0                        21h
www-web-1   Bound     pvc-62d6750e-3822-11e6-b1b7-42010af00002   0                        21h

$ kubectl delete pvc -l app=nginx
$ kubectl get pv
```

<!--
If you simply want to clean everything:
-->
如果您只是想删除所有的东西：

```shell{% raw %}
$ grace=$(kubectl get po web-0 --template '{{.spec.terminationGracePeriodSeconds}}')
$ kubectl delete petset,po -l app=nginx
$ sleep $grace
$ kubectl delete pvc -l app=nginx
{% endraw %}
```

<!--
## Troubleshooting

You might have noticed an `annotations` field in all the PetSets shown above.
-->
## 故障排查

您可能已经注意到上面显示的所有的 PetSet 都有一个 `annotations` 字段。

```yaml
annotations:
  pod.alpha.kubernetes.io/initialized: "true"
```

<!--
This field is a debugging hook. It pauses any scale up/down operations on the entire PetSet. If you'd like to pause a petset after each pet, set it to `false` in the template, wait for each pet to come up, verify it has initialized correctly, and then set it to `true` using `kubectl edit` on the pet (setting it to `false` on *any pet* is enough to pause the PetSet). If you don't need it, create the PetSet with it set to `true` as shown. This is surprisingly useful in debugging bootstrapping race conditions.
-->
这个字段是一个调试勾子。它暂停了所有在 PetSet 上的扩张和收缩操作。如果你希望在任一个 Pet 之后暂停一个 PetSet，在模板中将这个字段设置为`false`，等待每个 pet 起来，验证其是否已经正确初始化，然后再使用 `kubectl edit` 将 Pet 的这个字段设置为 `true` （在 *任一个 Pet * 上将这个字段设置为 `false` 都足以暂停整个 PetSet）。如您不需要这个设置，像上面那样创建一个  PetSet 时将其值设置为 `true`。这在调试启动竞争条件时非常有用。

<!--
## Future Work

There are a LOT of planned improvements since PetSet is still in alpha.

* Data gravity and local storage
* Richer notification events
* Public network identities
* WAN cluster deployments (multi-AZ/region/cloud provider)
* Image and node upgrades

This list goes on, if you have examples, ideas or thoughts, please contribute.
-->
## 未来的工作

由于 PetSet 还处于 alpha 阶段，还存在许多计划中要改进的地方。

* 数据重力和本地存储
* 更丰富的事件通知
* 公共网络身份标识
* WAN 集群部署（multi-AZ/region/cloud provider）
* 镜像和节点升级

这个列表还在继续完善中，如果您有任意用例，主意或想法，请贡献给我们。

<!--
## Alternatives

Deploying one RC of size 1/Service per pod is a popular alternative, as is simply deploying a DaemonSet that utilizes the identity of a Node.
-->
## 可选方案

部署一个 size 为1的RC/每个 pod 一个服务是另一种可选的普遍做法，就像简单地部署一个使用节点标识的DaemonSet。

<!--
## Next steps

* Learn about [StatefulSet](/docs/concepts/abstractions/controllers/statefulsets/),
  the replacement for PetSet introduced in Kubernetes version 1.5.
* [Migrate your existing PetSets to StatefulSets](/docs/tasks/manage-stateful-set/upgrade-pet-set-to-stateful-set/)
  when upgrading to Kubernetes version 1.5 or higher.
-->
## 接下来的步骤

* 学习 [StatefulSet](/docs/concepts/abstractions/controllers/statefulsets/)，这是在 Kubernetes 1.5 版本中引入的 PetSet 的替代品
* 当升级到 Kubernetes 1.5 或更高版本的时候，[将 PetSets 迁移为 StatefulSets](/docs/tasks/manage-stateful-set/upgrade-pet-set-to-stateful-set/)

