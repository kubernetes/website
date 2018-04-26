---
approvers:
- jlowdermilk
- justinsb
- quinton-hoole
cn-approvers:
- lichuqiang
title: 多区域运行
---
<!--
---
approvers:
- jlowdermilk
- justinsb
- quinton-hoole
title: Running in Multiple Zones
---
-->

<!--
## Introduction

Kubernetes 1.2 adds support for running a single cluster in multiple failure zones
(GCE calls them simply "zones", AWS calls them "availability zones", here we'll refer to them as "zones").
-->
## 介绍

Kubernetes 从v1.2开始支持将集群运行在多个故障域中。
(GCE 中称其为 "区（Zones）"， AWS 中称其为 "可用区（Availability Zones）"，这里我们也称其为 "区")。
<!--
This is a lightweight version of a broader Cluster Federation feature (previously referred to by the affectionate
nickname ["Ubernetes"](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/multicluster/federation.md)).
-->
它是广泛意义上的集群联邦特性的轻量级版本 (之前被称为 ["Ubernetes"](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/multicluster/federation.md))。
<!--
Full Cluster Federation allows combining separate
Kubernetes clusters running in different regions or cloud providers
(or on-premises data centers).  However, many
users simply want to run a more available Kubernetes cluster in multiple zones
of their single cloud provider, and this is what the multizone support in 1.2 allows
(this previously went by the nickname "Ubernetes Lite").
-->
完整的集群联邦能够将多个分别运行在不同区或云供应商（或本地数据中心）的集群集中管理。
然而，很多用户只是希望通过将单一云供应商上的 Kubernetes 集群运行在多个区域，来提高集群的可用性，
这就是1.2版本中提供的对多区域的支持。
(之前被称为 "Ubernetes Lite")。

<!--
Multizone support is deliberately limited: a single Kubernetes cluster can run
in multiple zones, but only within the same region (and cloud provider).  Only
GCE and AWS are currently supported automatically (though it is easy to
add similar support for other clouds or even bare metal, by simply arranging
for the appropriate labels to be added to nodes and volumes).
-->
多区域的支持是有明确限制的： Kubernetes 集群能够运行在多个区，但必须在同一个地域内 (云供应商也须一致)。
目前只有 GCE 和 AWS 自动支持 (尽管在其他云甚至裸机上，也很容易通过为节点和卷添加合适的标签来实现类似的支持)。


* TOC
{:toc}

<!--
## Functionality

When nodes are started, the kubelet automatically adds labels to them with
zone information.
-->
## 功能

节点启动时，Kubelet 自动为其添加区信息的标签。

<!--
Kubernetes will automatically spread the pods in a replication controller
or service across nodes in a single-zone cluster (to reduce the impact of
failures.)  With multiple-zone clusters, this spreading behaviour is
extended across zones (to reduce the impact of zone failures.)  (This is
achieved via `SelectorSpreadPriority`).  This is a best-effort
placement, and so if the zones in your cluster are heterogeneous
(e.g. different numbers of nodes, different types of nodes, or
different pod resource requirements), this might prevent perfectly
even spreading of your pods across zones. If desired, you can use
homogenous zones (same number and types of nodes) to reduce the
probability of unequal spreading.
-->
在单一区域的集群中，Kubernetes 会自动将副本管理器或服务的 pod 分布到各节点上 (以减轻单实例故障的影响)。
在多区域的集群中，这种分布的行为扩展到了区域级别
(以减少区域故障对整体的影响)。  (通过 `SelectorSpreadPriority` 来实现)。
这种分发是尽力而为（best-effort）的，所以如果集群在各个区之间是异构的
(比如，各区间的节点数量不同、节点类型不同、pod的资源需求不同等)可能导致 pod 无法完全均匀地分布。
如果需要的话，用户可以使用同质的区(节点数量和节点类型相同)来减少区域之间分配不均匀的可能。

<!--
When persistent volumes are created, the `PersistentVolumeLabel`
admission controller automatically adds zone labels to them.  The scheduler (via the
`VolumeZonePredicate` predicate) will then ensure that pods that claim a
given volume are only placed into the same zone as that volume, as volumes
cannot be attached across zones.
-->
当卷被创建时， `PersistentVolumeLabel` 准入控制器会自动为其添加区域的标签。
调度器 (通过 `VolumeZonePredicate` 断言) 会确保该卷的pod被调度到该卷对应的区域，
因为卷是不支持跨区挂载的。

<!--
## Limitations

There are some important limitations of the multizone support:
-->
## 限制

对多区的支持有一些重要的限制：

<!--
* We assume that the different zones are located close to each other in the
network, so we don't perform any zone-aware routing.  In particular, traffic
that goes via services might cross zones (even if pods in some pods backing that service
exist in the same zone as the client), and this may incur additional latency and cost.
-->
* 我们假设不同的区域间在网络上离得很近，所以我们不做任何的区域感知路由。 特别是，通过服务的网络访问可能跨区域 (即使该服务后端 pod 的其中一些运行在与客户端相同的区域中)，这可能导致额外的延迟和损耗。

<!--
* Volume zone-affinity will only work with a `PersistentVolume`, and will not
work if you directly specify an EBS volume in the pod spec (for example).
-->
* 卷的区域亲和性只对 `PersistentVolume` 有效。 例如，如果你在 pod 的 spec 中直接指定一个 EBS 的卷，则不会生效。

<!--
* Clusters cannot span clouds or regions (this functionality will require full
federation support).
-->
* 集群不支持跨云平台或地域 (这些功能需要完整的集群联邦特性支持)。

<!--
* Although your nodes are in multiple zones, kube-up currently builds
a single master node by default.  While services are highly
available and can tolerate the loss of a zone, the control plane is
located in a single zone.  Users that want a highly available control
plane should follow the [high availability](/docs/admin/high-availability) instructions.
-->
* 尽管节点位于多区域，目前默认情况下 kube-up 创建的管理节点是单实例的。 所以尽管服务是高可用的，并且能够容忍跨区域的性能损耗，管理平面还是单区域的。 需要高可用的管理平面的用户可以按照 [高可用](/docs/admin/high-availability) 指导来操作。

<!--
* StatefulSet volume zone spreading when using dynamic provisioning is currently not compatible with
pod affinity or anti-affinity policies.
-->
* 目前 StatefulSet 的卷动态创建时的跨区域分配，与 pod 的亲和性/反亲和性不兼容。

<!--
* If the name of the StatefulSet contains dashes ("-"), volume zone spreading
may not provide a uniform distribution of storage across zones.
-->
* StatefulSet 的名称包含破折号 ("-")时，可能影响到卷在区域间的均匀分布。

<!--
* When specifying multiple PVCs in a Deployment or Pod spec, the StorageClass
needs to be configured for a specific, single zone, or the PVs need to be
statically provisioned in a specific zone. Another workaround is to use a
StatefulSet, which will ensure that all the volumes for a replica are
provisioned in the same zone.
-->
* 为 deployment 或 pod 指定多个 PVC 时，要求其 StorageClass 处于同一区域内，否则，相应的 PV 卷需要在一个区域中静态配置。 另一种方式是使用 StatefulSet，这可以确保同一副本所挂载的卷位于同一区内。


<!--
## Walkthrough

We're now going to walk through setting up and using a multi-zone
cluster on both GCE & AWS.  To do so, you bring up a full cluster
(specifying `MULTIZONE=true`), and then you add nodes in additional zones
by running `kube-up` again (specifying `KUBE_USE_EXISTING_MASTER=true`).
-->
## 演练

接下来我们将介绍如何同时在 GCE 和 AWS 上创建和使用多区域的集群。 为此，你需要创建一个完整的集群
(指定 `MULTIZONE=true`)，然后再次执行 `kube-up`（指定 `KUBE_USE_EXISTING_MASTER=true`）来添加其他区域的节点。

<!--
### Bringing up your cluster

Create the cluster as normal, but pass MULTIZONE to tell the cluster to manage multiple zones; creating nodes in us-central1-a.
-->
### 创建集群

按正常方式创建集群，但是传入 MULTIZONE 来通知集群对多区域进行管理。 在 us-central1-a 区域创建节点。

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
该步骤按正常方式创建了集群，仍然运行在单个区域中。
但 `MULTIZONE=true` 已经开启了多区域的能力。

<!--
### Nodes are labeled

View the nodes; you can see that they are labeled with zone information.
They are all in `us-central1-a` (GCE) or `us-west-2a` (AWS) so far.  The
labels are `failure-domain.beta.kubernetes.io/region` for the region,
and `failure-domain.beta.kubernetes.io/zone` for the zone:
-->
### 标记节点

查看节点，你可以发现节点上打了区域信息的标签。
节点位于 `us-central1-a` (GCE) 或者 `us-west-2a` (AWS)。 标签 `failure-domain.beta.kubernetes.io/region` 用于区分地域，
标签 `failure-domain.beta.kubernetes.io/zone` 用于区分区域。

```shell
> kubectl get nodes --show-labels


NAME                     STATUS                     AGE   VERSION          LABELS
kubernetes-master        Ready,SchedulingDisabled   6m    v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-1,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-master
kubernetes-minion-87j9   Ready                      6m    v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-87j9
kubernetes-minion-9vlv   Ready                      6m    v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-a12q   Ready                      6m    v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-a12q
```

<!--
### Add more nodes in a second zone

Let's add another set of nodes to the existing cluster, reusing the
existing master, running in a different zone (us-central1-b or us-west-2b).
We run kube-up again, but by specifying `KUBE_USE_EXISTING_MASTER=true`
kube-up will not create a new master, but will reuse one that was previously
created instead.
-->
### 添加其它区中的节点

接下来我们复用已有的管理节点，添加运行于其它区域 （us-central1-b 或 us-west-2b）中的节点。
再次执行 kube-up， 通过指定 `KUBE_USE_EXISTING_MASTER=true`，
kube-up 不会创建新的管理节点，而是会复用之前创建的。

GCE:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-b NUM_NODES=3 kubernetes/cluster/kube-up.sh
```

<!--
On AWS we also need to specify the network CIDR for the additional
subnet, along with the master internal IP address:
-->
在 AWS 中我们还需要为新增的子网指定网络 CIDR，还有管理节点的内部 IP 地址。

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2b NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.1.0/24 MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```


<!--
View the nodes again; 3 more nodes should have launched and be tagged
in us-central1-b:
-->
再次查看节点，3个新增的节点已经启动，并被标记为 us-central1-b：

```shell
> kubectl get nodes --show-labels

NAME                     STATUS                     AGE   VERSION           LABELS
kubernetes-master        Ready,SchedulingDisabled   16m   v1.6.0+fff5156    beta.kubernetes.io/instance-type=n1-standard-1,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-master
kubernetes-minion-281d   Ready                      2m    v1.6.0+fff5156    beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-281d
kubernetes-minion-87j9   Ready                      16m   v1.6.0+fff5156    beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-87j9
kubernetes-minion-9vlv   Ready                      16m   v1.6.0+fff5156    beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-a12q   Ready                      17m   v1.6.0+fff5156    beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-a12q
kubernetes-minion-pp2f   Ready                      2m    v1.6.0+fff5156    beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-pp2f
kubernetes-minion-wf8i   Ready                      2m    v1.6.0+fff5156    beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-wf8i
```

<!--
### Volume affinity

Create a volume using the dynamic volume creation (only PersistentVolumes are supported for zone affinity):
-->
### 卷的亲和性

使用动态创建卷的功能创建一个卷 (只有 PV 持久卷才支持区域亲和性)：

```json
kubectl create -f - <<EOF
{
  "kind": "PersistentVolumeClaim",
  "apiVersion": "v1",
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
**NOTE:** For version 1.3+ Kubernetes will distribute dynamic PV claims across
the configured zones. For version 1.2, dynamic persistent volumes were
always created in the zone of the cluster master
(here us-central1-a / us-west-2a); that issue
([#23330](https://github.com/kubernetes/kubernetes/issues/23330))
was addressed in 1.3+.
-->
**注意：** Kubernetes 1.3以上的版本中可以将 PVC 分发到多个已配置的区域中，在1.2版本中， 动态卷只能创建在管理节点所在的区域内(即这里的 us-central1-a / us-west-2a)；相关 issue
([#23330](https://github.com/kubernetes/kubernetes/issues/23330))
在1.3后续的版本中已解决。

<!--
Now lets validate that Kubernetes automatically labeled the zone & region the PV was created in.
-->
现在我们验证一下 Kubernetes 自动为创建的 PV 打上了所在地域和区域的标签。

```shell
> kubectl get pv --show-labels
NAME           CAPACITY   ACCESSMODES   STATUS    CLAIM            REASON    AGE       LABELS
pv-gce-mj4gm   5Gi        RWO           Bound     default/claim1             46s       failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a
```

<!--
So now we will create a pod that uses the persistent volume claim.
Because GCE PDs / AWS EBS volumes cannot be attached across zones,
this means that this pod can only be created in the same zone as the volume:
-->
现在我们将创建使用这些 PVC 的 pod。
因为 GCE 的 PD 存储 / AWS 的 EBS 卷 不支持跨区域挂载，
这意味着相应的pod只能创建在卷所在的区域中。

```yaml
kubectl create -f - <<EOF
kind: Pod
apiVersion: v1
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
注意 pod 被自动创建在了卷所在的区域中，因为云供应商通常不支持卷的跨区域挂载（attach）:

```shell
> kubectl describe pod mypod | grep Node
Node:        kubernetes-minion-9vlv/10.240.0.5
> kubectl get node kubernetes-minion-9vlv --show-labels
NAME                     STATUS    AGE    VERSION          LABELS
kubernetes-minion-9vlv   Ready     22m    v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
```

<!--
### Pods are spread across zones

Pods in a replication controller or service are automatically spread
across zones.  First, let's launch more nodes in a third zone:
-->
### Pod 的跨区域分布

副本管理器或服务的 pod 被自动创建在了不同的区域。 首先，在第三个区域内启动节点：

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
验证你现在在3个区域内拥有节点：

```shell
kubectl get nodes --show-labels
```

<!--
Create the guestbook-go example, which includes an RC of size 3, running a simple web app:
-->
创建 guestbook-go 示例应用， 它包含一个副本数为3的 RC，运行一个简单的网络应用：

```shell
find kubernetes/examples/guestbook-go/ -name '*.json' | xargs -I {} kubectl create -f {}
```

<!--
The pods should be spread across all 3 zones:
-->
Pod 应该分布在全部3个区域上：

```shell
>  kubectl describe pod -l app=guestbook | grep Node
Node:        kubernetes-minion-9vlv/10.240.0.5
Node:        kubernetes-minion-281d/10.240.0.8
Node:        kubernetes-minion-olsh/10.240.0.11

 > kubectl get node kubernetes-minion-9vlv kubernetes-minion-281d kubernetes-minion-olsh --show-labels
NAME                     STATUS    AGE    VERSION          LABELS
kubernetes-minion-9vlv   Ready     34m    v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-281d   Ready     20m    v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-281d
kubernetes-minion-olsh   Ready     3m     v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-f,kubernetes.io/hostname=kubernetes-minion-olsh
```


<!--
Load-balancers span all zones in a cluster; the guestbook-go example
includes an example load-balanced service:
-->
负载平衡器覆盖集群中的所有区域； guestbook-go 示例包含一个负载均衡服务的例子：

```shell
> kubectl describe service guestbook | grep LoadBalancer.Ingress
LoadBalancer Ingress:   130.211.126.21

> ip=130.211.126.21

> curl -s http://${ip}:3000/env | grep HOSTNAME
  "HOSTNAME": "guestbook-44sep",

> (for i in `seq 20`; do curl -s http://${ip}:3000/env | grep HOSTNAME; done)  | sort | uniq
  "HOSTNAME": "guestbook-44sep",
  "HOSTNAME": "guestbook-hum5n",
  "HOSTNAME": "guestbook-ppm40",
```

<!--
The load balancer correctly targets all the pods, even though they are in multiple zones.
-->
负载平衡器正确指向了所有的 pod，即使它们位于不同的区域内。

<!--
### Shutting down the cluster

When you're done, clean up:
-->
### 停止集群

使用完成后，进行清理：

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
