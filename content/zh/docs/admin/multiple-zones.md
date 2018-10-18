---
approvers:
- jlowdermilk
- justinsb
- quinton-hoole
title: 多区域运行
---

## 介绍

Kubernetes 从v1.2开始支持将集群运行在多个故障域中。
(GCE 中称其为 "区（Zones）"， AWS 中称其为 "可用区（Availability Zones）"，这里我们也称其为 "区")。
它是广泛意义上的集群联邦特性的轻量级版本 (之前被称为 ["Ubernetes"](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/multicluster/federation.md))。
完整的集群联邦能够将多个分别运行在不同区或云供应商（或本地数据中心）的集群集中管理。
然而，很多用户只是希望通过将单一云供应商上的Kubernetes集群运行在多个区域，来提高集群的可用性，
这就是1.2版本中提供的对多区域的支持。
(之前被称为 "Ubernetes Lite")。

多区域的支持是有明确限制的： Kubernetes集群能够运行在多个区，但必须在同一个地域内 (云供应商也须一致)。
目前只有GCE和AWS自动支持 (尽管在其他云甚至裸机上，也很容易通过为节点和卷添加合适的标签来实现类似的支持)。


{{< toc >}}

## 功能

节点启动时，Kubelet自动为其添加区信息的标签。

在单一区域的集群中，Kubernetes 会自动将副本管理器或服务的pod分布到各节点上 (以减轻单实例故障的影响)。
在多区域的集群中，这种分布的行为扩展到了区域级别
(以减少区域故障对整体的影响)。  (通过 `SelectorSpreadPriority` 来实现)。
这种分发是尽力而为（best-effort）的，所以如果集群在各个区之间是异构的
(比如，各区间的节点数量不同、节点类型不同、pod的资源需求不同等)可能导致pod无法完全均匀地分布。
如果需要的话，用户可以使用同质的区(节点数量和节点类型相同)来减少区域之间分配不均匀的可能。

当卷被创建时， `PersistentVolumeLabel`准入控制器会自动为其添加区域的标签。
调度器 (通过 `VolumeZonePredicate` 断言) 会确申领该卷的pod被调度到该卷对应的区域，
因为卷是不支持跨区挂载的。

## 限制

对多区的支持有一些重要的限制：

* 我们假设不同的区域间在网络上离得很近，所以我们不做任何的区域感知路由。 特别是，通过服务的网络访问可能跨区域 (即使该服务后端pod的其中一些运行在与客户端相同的区域中)，这可能导致额外的延迟和损耗。

* 卷的区域亲和性只对 `PersistentVolume`有效。 例如，如果你在pod的spec中直接指定一个EBS的卷，则不会生效。

* 集群不支持跨云平台或地域 (这些功能需要完整的集群联邦特性支持)。

* 尽管节点位于多区域，目前默认情况下 kube-up 创建的管理节点是单实例的。 所以尽管服务是高可用的，并且能够容忍跨区域的性能损耗，管理平面还是单区域的。 需要高可用的管理平面的用户可以按照 [高可用](/docs/admin/high-availability) 指导来操作。

* 目前StatefulSet的卷动态创建时的跨区域分配，与pod的亲和性/反亲和性不兼容。

* StatefulSet的名称包含破折号 ("-")时，可能影响到卷在区域间的均匀分布。

* 为deployment或pod指定多个PVC时，要求其StorageClass处于同一区域内，否则，相应的PV卷需要在一个区域中静态配置。 另一种方式是使用StatefulSet，这可以确保同一副本所挂载的卷位于同一区内。


## 演练

接下来我们将介绍如何同时在 GCE 和 AWS 上创建和使用多区域的集群。 为此，你需要创建一个完整的集群
(指定 `MULTIZONE=true`)，然后再次执行 `kube-up`（指定 `KUBE_USE_EXISTING_MASTER=true`）来添加其他区域的节点。

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

该步骤按正常方式创建了集群，仍然运行在单个区域中。
但 `MULTIZONE=true` 已经开启了多区域的能力。

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

### 添加其它区中的节点

接下来我们复用已有的管理节点，添加运行于其它区域 （us-central1-b或us-west-2b）中的节点。
再次执行 kube-up， 通过指定 `KUBE_USE_EXISTING_MASTER=true`，
kube-up 不会创建新的管理节点，而是会复用之前创建的。

GCE:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-b NUM_NODES=3 kubernetes/cluster/kube-up.sh
```

在 AWS 中我们还需要为新增的子网指定网络CIDR，还有管理节点的内部IP地址。

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2b NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.1.0/24 MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```


再次查看节点，3个新增的节点已经启动，并被标记为us-central1-b：

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

### 卷的亲和性

使用动态创建卷的功能创建一个卷 (只有PV持久卷才支持区域亲和性)：

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

**注意：** Kubernetes 1.3以上的版本中可以将PVC分发到多个已配置的区域中，在1.2版本中， 动态卷只能创建在管理节点所在的区域内(即这里的 us-central1-a / us-west-2a)；相关issue
([#23330](https://github.com/kubernetes/kubernetes/issues/23330))
在1.3后续的版本中已解决。

现在我们验证一下 Kubernetes 自动为创建的PV打上了所在地域和区域的标签。

```shell
> kubectl get pv --show-labels
NAME           CAPACITY   ACCESSMODES   STATUS    CLAIM            REASON    AGE       LABELS
pv-gce-mj4gm   5Gi        RWO           Bound     default/claim1             46s       failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a
```

现在我们将创建使用这些PVC的pod。
因为 GCE 的PD存储 / AWS 的EBS 卷 不支持跨区域挂载，
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

注意pod被自动创建在了卷所在的区域中，因为云供应商通常不支持卷的跨区域挂载（attach）。

```shell
> kubectl describe pod mypod | grep Node
Node:        kubernetes-minion-9vlv/10.240.0.5
> kubectl get node kubernetes-minion-9vlv --show-labels
NAME                     STATUS    AGE    VERSION          LABELS
kubernetes-minion-9vlv   Ready     22m    v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
```

### Pod的跨区域分布

副本管理器或服务的pod被自动创建在了不同的区域。  首先，在第三个区域内启动节点：

GCE:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-f NUM_NODES=3 kubernetes/cluster/kube-up.sh
```

AWS:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2c NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.2.0/24 MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```

验证你现在在3个区域内拥有节点:

```shell
kubectl get nodes --show-labels
```

创建 guestbook-go 示例应用， 它包含一个副本数为3的RC，运行一个简单的网络应用：

```shell
find kubernetes/examples/guestbook-go/ -name '*.json' | xargs -I {} kubectl create -f {}
```

Pod应该分布在全部3个区域上：

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


负载平衡器覆盖集群中的所有区域； guestbook-go 示例包含一个
负载均衡服务的例子：

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

负载平衡器正确指向了所有的pod，即使它们位于不同的区域内。

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
