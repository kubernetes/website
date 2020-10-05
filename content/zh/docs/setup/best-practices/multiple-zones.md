---
title: 运行于多区环境
weight: 10
content_type: concept
---
<!--
reviewers:
- jlowdermilk
- justinsb
- quinton-hoole
title: Running in multiple zones
weight: 10
content_type: concept
-->

<!-- overview -->

<!--
This page describes how to run a cluster in multiple zones.
-->
本页描述如何在多个区（Zone）中运行集群。

<!-- body -->

<!--
## Introduction

Kubernetes 1.2 adds support for running a single cluster in multiple failure zones
(GCE calls them simply "zones", AWS calls them "availability zones", here we'll refer to them as "zones").
This is a lightweight version of a broader Cluster Federation feature (previously referred to by the affectionate
nickname ["Ubernetes"](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/multicluster/federation.md)).
Full Cluster Federation allows combining separate
Kubernetes clusters running in different regions or cloud providers
(or on-premises data centers).  However, many
users simply want to run a more available Kubernetes cluster in multiple zones
of their single cloud provider, and this is what the multizone support in 1.2 allows
(this previously went by the nickname "Ubernetes Lite").
-->
## 介绍

Kubernetes 1.2 添加了跨多个失效区（Failure Zone）运行同一集群的能力
（GCE 把它们称作“区（Zones）”，AWS 把它们称作“可用区（Availability Zones）”，
这里我们用“区（Zones）”指代它们）。
此能力是更广泛的集群联邦（Cluster Federation）特性的一个轻量级版本。
集群联邦之前有一个昵称
["Ubernetes"](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/multicluster/federation.md))。
完全的集群联邦可以将运行在多个区域（Region）或云供应商（或本地数据中心）的多个
Kubernetes 集群组合起来。
不过，很多用户仅仅是希望在同一云厂商平台的多个区域运行一个可用性更好的集群，
而这恰恰是 1.2 引入的多区支持所带来的特性
（此特性之前有一个昵称 “Ubernetes Lite”）。

<!--
Multizone support is deliberately limited: a single Kubernetes cluster can run
in multiple zones, but only within the same region (and cloud provider).  Only
GCE and AWS are currently supported automatically (though it is easy to
add similar support for other clouds or even bare metal, by simply arranging
for the appropriate labels to be added to nodes and volumes).
-->
多区支持有意实现的有局限性：可以在跨多个区域运行同一 Kubernetes 集群，但只能
在同一区域（Region）和云厂商平台。目前仅自动支持 GCE 和 AWS，尽管为其他云平台
或裸金属平台添加支持页相对容易，只需要确保节点和卷上添加合适的标签即可。

<!--
## Functionality

When nodes are started, the kubelet automatically adds labels to them with
zone information.
-->
## 功能

节点启动时，`kubelet` 自动向其上添加区信息标签。

<!--
Kubernetes will automatically spread the pods in a replication controller
or service across nodes in a single-zone cluster (to reduce the impact of
failures.)  With multiple-zone clusters, this spreading behavior is
extended across zones (to reduce the impact of zone failures.)  (This is
achieved via `SelectorSpreadPriority`).  This is a best-effort
placement, and so if the zones in your cluster are heterogeneous
(e.g. different numbers of nodes, different types of nodes, or
different pod resource requirements), this might prevent perfectly
even spreading of your pods across zones. If desired, you can use
homogeneous zones (same number and types of nodes) to reduce the
probability of unequal spreading.
-->
在单区（Single-Zone）集群中， Kubernetes 会自动将副本控制器或服务中的 Pod
分布到不同节点，以降低节点失效的影响。
在多区集群中，这一分布负载的行为被扩展到跨区分布，以降低区失效的影响，
跨区分布的能力是通过 `SelectorSpreadPriority` 实现的。此放置策略亦仅仅是
尽力而为，所以如果你的集群所跨区是异质的（例如，节点个数不同、节点类型
不同或者 Pod 资源需求不同），放置策略都可能无法完美地跨区完成 Pod 的
均衡分布。如果需要，你可以使用同质区（节点个数和类型相同）以降低不均衡
分布的可能性。

<!--
When persistent volumes are created, the `PersistentVolumeLabel`
admission controller automatically adds zone labels to them.  The scheduler (via the
`VolumeZonePredicate` predicate) will then ensure that pods that claim a
given volume are only placed into the same zone as that volume, as volumes
cannot be attached across zones.
-->
持久卷被创建时，`PersistentVolumeLabel` 准入控制器会自动为其添加区标签。
调度器使用 `VolumeZonePredicate` 断言确保申领某给定卷的 Pod 只会被放到
该卷所在的区。这是因为卷不可以跨区挂载。

<!--
## Limitations

There are some important limitations of the multizone support:

* We assume that the different zones are located close to each other in the
network, so we don't perform any zone-aware routing.  In particular, traffic
that goes via services might cross zones (even if some pods backing that service
exist in the same zone as the client), and this may incur additional latency and cost.
-->
## 局限性

多区支持有一些很重要的局限性：

* 我们假定不同的区之间在网络上彼此距离很近，所以我们不执行可感知区的路由。
  尤其是，即使某些负责提供该服务的 Pod  与客户端位于同一区，通过服务末端
  进入的流量可能会跨区，因而会导致一些额外的延迟和开销。

<!--
* Volume zone-affinity will only work with a `PersistentVolume`, and will not
work if you directly specify an EBS volume in the pod spec (for example).

* Clusters cannot span clouds or regions (this functionality will require full
federation support).
-->
* 卷与区之间的亲和性仅适用于 PV 持久卷。例如，如果你直接在 Pod 规约中指定某 EBS
  卷，这种亲和性支持就无法工作。

* 集群无法跨多个云平台或者地理区域运行。这类功能需要完整的联邦特性支持。

<!--
* Although your nodes are in multiple zones, kube-up currently builds
a single master node by default.  While services are highly
available and can tolerate the loss of a zone, the control plane is
located in a single zone.  Users that want a highly available control
plane should follow the [high availability](/docs/setup/production-environment/tools/kubeadm/high-availability/) instructions.
-->
* 尽管你的节点位于多个区中，`kube-up` 脚本目前默认只能构造一个主控节点。
  尽管服务是高可用的，能够忍受失去某个区的问题，控制面位于某一个区中。
  希望运行高可用控制面的用户应该遵照
  [高可用性](/zh/docs/setup/production-environment/tools/kubeadm/high-availability/)
  中的指令构建。

<!--
### Volume limitations

The following limitations are addressed with
[topology-aware volume binding](/docs/concepts/storage/storage-classes/#volume-binding-mode).

* StatefulSet volume zone spreading when using dynamic provisioning is currently not compatible with
  pod affinity or anti-affinity policies.
-->
### 卷局限性

以下局限性通过
[拓扑感知的卷绑定](/zh/docs/concepts/storage/storage-classes/#volume-binding-mode)解决：

* 使用动态卷供应时，StatefulSet 卷的跨区分布目前与 Pod
  亲和性和反亲和性策略不兼容。

<!--
* If the name of the StatefulSet contains dashes ("-"), volume zone spreading
  may not provide a uniform distribution of storage across zones.

* When specifying multiple PVCs in a Deployment or Pod spec, the StorageClass
  needs to be configured for a specific single zone, or the PVs need to be
  statically provisioned in a specific zone. Another workaround is to use a
  StatefulSet, which will ensure that all the volumes for a replica are
  provisioned in the same zone.
-->
* 如果 StatefulSet 的名字中包含连字符（"-"），卷的跨区分布可能无法实现存储的
  跨区同一分布。

* 当在一个 Deployment 或 Pod 规约中指定多个 PVC 申领时，则需要为某特定区域
  配置 StorageClass，或者在某一特定区域中需要静态供应 PV 卷。
  另一种解决方案是使用 StatefulSet，确保给定副本的所有卷都从同一区中供应。

<!--
## Walkthrough

We're now going to walk through setting up and using a multi-zone
cluster on both GCE & AWS.  To do so, you bring up a full cluster
(specifying `MULTIZONE=true`), and then you add nodes in additional zones
by running `kube-up` again (specifying `KUBE_USE_EXISTING_MASTER=true`).
-->
## 演练

我们现在准备对在 GCE 和 AWS 上配置和使用多区集群进行演练。为了完成此演练，
你需要设置 `MULTIZONE=true` 来启动一个完整的集群，之后指定
`KUBE_USE_EXISTING_MASTER=true` 并再次运行 `kube-up` 添加其他区中的节点。

<!--
### Bringing up your cluster

Create the cluster as normal, but pass MULTIZONE to tell the cluster to manage multiple zones; creating nodes in us-central1-a.
-->
### 建立集群

和往常一样创建集群，不过需要设置 MULTIZONE，以便告诉集群需要管理多个区。
这里我们在 `us-central1-a` 创建节点。

GCE:

```shell
curl -sS https://get.k8s.io | MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-a NUM_NODES=3 bash
```

AWS:

```shell
curl -sS https://get.k8s.io | MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2a NUM_NODES=3 bash
```

<!--
This step brings up a cluster as normal, still running in a single zone
(but `MULTIZONE=true` has enabled multi-zone capabilities).
-->
这一步骤和往常一样启动一个集群，不过尽管 `MULTIZONE=true`
标志已经启用了多区功能特性支持，集群仍然运行在一个区内。

<!--
### Nodes are labeled

View the nodes; you can see that they are labeled with zone information.
They are all in `us-central1-a` (GCE) or `us-west-2a` (AWS) so far.  The
labels are `failure-domain.beta.kubernetes.io/region` for the region,
and `failure-domain.beta.kubernetes.io/zone` for the zone:
-->
### 节点已被打标签

查看节点，你会看到节点上已经有了区信息标签。
目前这些节点都在 `us-central1-a` (GCE) 或 `us-west-2a` (AWS)。
对于区域（Region），标签为 `failure-domain.beta.kubernetes.io/region`，
对于区（Zone），标签为 `failure-domain.beta.kubernetes.io/zone`：

```shell
kubectl get nodes --show-labels
```

<!--
The output is similar to this:
-->
输出类似于：

```
NAME                     STATUS                     ROLES    AGE   VERSION          LABELS
kubernetes-master        Ready,SchedulingDisabled   <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-1,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-master
kubernetes-minion-87j9   Ready                      <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-87j9
kubernetes-minion-9vlv   Ready                      <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-a12q   Ready                      <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-a12q
```
<!--
### Add more nodes in a second zone

Let's add another set of nodes to the existing cluster, reusing the
existing master, running in a different zone (us-central1-b or us-west-2b).
We run kube-up again, but by specifying `KUBE_USE_EXISTING_MASTER=true`
kube-up will not create a new master, but will reuse one that was previously
created instead.
-->
### 添加第二个区中的节点

让我们向现有集群中添加另外一组节点，复用现有的主控节点，但运行在不同的区
（`us-central1-b` 或 `us-west-2b`）。
我们再次运行 `kube-up`，不过设置 `KUBE_USE_EXISTING_MASTER=true`。
`kube-up` 不会创建新的主控节点，而会复用之前创建的主控节点。

GCE:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-b NUM_NODES=3 kubernetes/cluster/kube-up.sh
```

<!--
On AWS we also need to specify the network CIDR for the additional
subnet, along with the master internal IP address:
-->
在 AWS 上，我们还需要为额外的子网指定网络 CIDR，以及主控节点的内部 IP 地址：

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2b NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.1.0/24 MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```

<!--
View the nodes again; 3 more nodes should have launched and be tagged
in us-central1-b:
-->
再次查看节点，你会看到新启动了三个节点并且其标签表明运行在 `us-central1-b` 区：

```shell
kubectl get nodes --show-labels
```

<!--
The output is similar to this:
-->
输出类似于：

```
NAME                     STATUS                     ROLES    AGE   VERSION           LABELS
kubernetes-master        Ready,SchedulingDisabled   <none>   16m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-1,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-master
kubernetes-minion-281d   Ready                      <none>   2m    v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-281d
kubernetes-minion-87j9   Ready                      <none>   16m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-87j9
kubernetes-minion-9vlv   Ready                      <none>   16m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-a12q   Ready                      <none>   17m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-a12q
kubernetes-minion-pp2f   Ready                      <none>   2m    v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-pp2f
kubernetes-minion-wf8i   Ready                      <none>   2m    v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-wf8i
```

<!--
### Volume affinity

Create a volume using the dynamic volume creation (only PersistentVolumes are supported for zone affinity):
-->
### 卷亲和性

通过动态卷供应创建一个卷（只有 PV 持久卷支持区亲和性）：

```bash
kubectl apply -f - <<EOF
{
  "apiVersion": "v1",
  "kind": "PersistentVolumeClaim",
  "metadata": {
    "name": "claim1",
    "annotations": {
        "volume.alpha.kubernetes.io/storage-class": "foo"
    }
  },
  "spec": {
    "accessModes": [
      "ReadWriteOnce"
    ],
    "resources": {
      "requests": {
        "storage": "5Gi"
      }
    }
  }
}
EOF
```

<!--
For version 1.3+ Kubernetes will distribute dynamic PV claims across
the configured zones. For version 1.2, dynamic persistent volumes were
always created in the zone of the cluster master
(here us-central1-a / us-west-2a); that issue
([#23330](https://github.com/kubernetes/kubernetes/issues/23330))
was addressed in 1.3+.
-->
{{< note >}}
Kubernetes 1.3 及以上版本会将动态 PV 申领散布到所配置的各个区。
在 1.2 版本中，动态持久卷总是在集群主控节点所在的区
（这里的 `us-central1-a` 或 `us-west-2a`），
对应的 Issue ([#23330](https://github.com/kubernetes/kubernetes/issues/23330))
在 1.3 及以上版本中已经解决。
{{< /note >}}

<!--
Now let's validate that Kubernetes automatically labeled the zone & region the PV was created in.
-->
现在我们来验证 Kubernetes 自动为 PV 打上了所在区或区域的标签：

```shell
kubectl get pv --show-labels
```

<!--
The output is similar to this:
-->
输出类似于：

```
NAME           CAPACITY   ACCESSMODES   RECLAIM POLICY   STATUS    CLAIM            STORAGECLASS    REASON    AGE       LABELS
pv-gce-mj4gm   5Gi        RWO           Retain           Bound     default/claim1   manual                    46s       failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a
```

<!--
So now we will create a pod that uses the persistent volume claim.
Because GCE PDs / AWS EBS volumes cannot be attached across zones,
this means that this pod can only be created in the same zone as the volume:
-->
现在我们将创建一个使用 PVC 申领的 Pod。
由于 GCE PD 或 AWS EBS 卷都不能跨区挂载，这意味着 Pod 只能创建在卷所在的区：

```yaml
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: claim1
EOF
```

<!--
Note that the pod was automatically created in the same zone as the volume, as
cross-zone attachments are not generally permitted by cloud providers:
-->
注意 Pod 自动创建在卷所在的区，因为云平台提供商一般不允许跨区挂接存储卷。

```shell
kubectl describe pod mypod | grep Node
```

```
Node:        kubernetes-minion-9vlv/10.240.0.5
```

<!--
And check node labels:
-->
检查节点标签：

```shell
kubectl get node kubernetes-minion-9vlv --show-labels
```

```
NAME                     STATUS    AGE    VERSION          LABELS
kubernetes-minion-9vlv   Ready     22m    v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
```

<!--
### Pods are spread across zones

Pods in a replication controller or service are automatically spread
across zones.  First, let's launch more nodes in a third zone:
-->
### Pod 跨区分布

同一副本控制器或服务的多个 Pod 会自动完成跨区分布。
首先，我们现在第三个区启动一些节点：

GCE:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-f NUM_NODES=3 kubernetes/cluster/kube-up.sh
```

AWS:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2c NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.2.0/24 MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```

<!--
Verify that you now have nodes in 3 zones:
-->
验证你现在有来自三个区的节点：

```shell
kubectl get nodes --show-labels
```

<!--
Create the guestbook-go example, which includes an RC of size 3, running a simple web app:
-->
创建 `guestbook-go` 示例，其中包含副本个数为 3 的 RC，运行一个简单的 Web 应用：

```shell
find kubernetes/examples/guestbook-go/ -name '*.json' | xargs -I {} kubectl apply -f {}
```

<!--
The pods should be spread across all 3 zones:
-->
Pod 应该跨三个区分布：

```shell
kubectl describe pod -l app=guestbook | grep Node
```

```
Node:        kubernetes-minion-9vlv/10.240.0.5
Node:        kubernetes-minion-281d/10.240.0.8
Node:        kubernetes-minion-olsh/10.240.0.11
```

```shell
kubectl get node kubernetes-minion-9vlv kubernetes-minion-281d kubernetes-minion-olsh --show-labels
```

```
NAME                     STATUS    ROLES    AGE    VERSION          LABELS
kubernetes-minion-9vlv   Ready     <none>   34m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-281d   Ready     <none>   20m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-281d
kubernetes-minion-olsh   Ready     <none>   3m     v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-f,kubernetes.io/hostname=kubernetes-minion-olsh
```

<!--
Load-balancers span all zones in a cluster; the guestbook-go example
includes an example load-balanced service:
-->
负载均衡器也会跨集群中的所有区；`guestbook-go` 示例中包含了一个负载均衡
服务的例子：

```shell
kubectl describe service guestbook | grep LoadBalancer.Ingress
```

<!--
The output is similar to this:
-->
输出类似于：

```
LoadBalancer Ingress:   130.211.126.21
```

<!--
Set the above IP:
-->
设置上面的 IP 地址：

```shell
export IP=130.211.126.21
```

<!--
Explore with curl via IP:
-->
使用 curl 访问该 IP：


```shell
curl -s http://${IP}:3000/env | grep HOSTNAME
```

<!--
The output is similar to this:
-->
输出类似于：

```
  "HOSTNAME": "guestbook-44sep",
```

<!--
Again, explore multiple times:
-->
如果多次尝试该命令：

```shell
(for i in `seq 20`; do curl -s http://${IP}:3000/env | grep HOSTNAME; done)  | sort | uniq
```

<!--
The output is similar to this:
-->
输出类似于：

```shell
  "HOSTNAME": "guestbook-44sep",
  "HOSTNAME": "guestbook-hum5n",
  "HOSTNAME": "guestbook-ppm40",
```

<!--
The load balancer correctly targets all the pods, even though they are in multiple zones.
-->
负载均衡器正确地选择不同的 Pod，即使它们跨了多个区。

<!--
### Shutting down the cluster

When you're done, clean up:
-->
### 停止集群

当完成以上工作之后，清理任务现场：

GCE:

```shell
KUBERNETES_PROVIDER=gce KUBE_USE_EXISTING_MASTER=true KUBE_GCE_ZONE=us-central1-f kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=gce KUBE_USE_EXISTING_MASTER=true KUBE_GCE_ZONE=us-central1-b kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-a kubernetes/cluster/kube-down.sh
```

AWS:

```shell
KUBERNETES_PROVIDER=aws KUBE_USE_EXISTING_MASTER=true KUBE_AWS_ZONE=us-west-2c kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=aws KUBE_USE_EXISTING_MASTER=true KUBE_AWS_ZONE=us-west-2b kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2a kubernetes/cluster/kube-down.sh
```


