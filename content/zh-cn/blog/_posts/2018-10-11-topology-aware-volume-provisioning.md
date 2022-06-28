---
layout: blog
title: 'Kubernetes 中的拓扑感知数据卷供应'
date: 2018-10-11
slug: topology-aware-volume-provisioning-in-kubernetes
---
<!--
layout: blog
title: 'Topology-Aware Volume Provisioning in Kubernetes'
date: 2018-10-11
-->

<!--
**Author**: Michelle Au (Google)
-->
**作者**: Michelle Au（谷歌）

<!--
The multi-zone cluster experience with persistent volumes is improving in Kubernetes 1.12 with the topology-aware dynamic provisioning beta feature. This feature allows Kubernetes to make intelligent decisions when dynamically provisioning volumes by getting scheduler input on the best place to provision a volume for a pod.  In multi-zone clusters, this means that volumes will get provisioned in an appropriate zone that can run your pod, allowing you to easily deploy and scale your stateful workloads across failure domains to provide high availability and fault tolerance.
-->
通过提供拓扑感知动态卷供应功能，具有持久卷的多区域集群体验在 Kubernetes 1.12
中得到了改进。此功能使得 Kubernetes 在动态供应卷时能做出明智的决策，方法是从调度器获得为
Pod 提供数据卷的最佳位置。在多区域集群环境，这意味着数据卷能够在满足你的 Pod
运行需要的合适的区域被供应，从而允许你跨故障域轻松部署和扩展有状态工作负载，从而提供高可用性和容错能力。

<!--
## Previous challenges
-->
## 以前的挑战

<!--
Before this feature, running stateful workloads with zonal persistent disks (such as AWS ElasticBlockStore, Azure Disk, GCE PersistentDisk) in multi-zone clusters had many challenges. Dynamic provisioning was handled independently from pod scheduling, which meant that as soon as you created a PersistentVolumeClaim (PVC), a volume would get provisioned. This meant that the provisioner had no knowledge of what pods were using the volume, and any pod constraints it had that could impact scheduling.
-->
在此功能被提供之前，在多区域集群中使用区域化的持久磁盘（例如 AWS ElasticBlockStore、
Azure Disk、GCE PersistentDisk）运行有状态工作负载存在许多挑战。动态供应独立于 Pod
调度处理，这意味着只要你创建了一个 PersistentVolumeClaim（PVC），一个卷就会被供应。
这也意味着供应者不知道哪些 Pod 正在使用该卷，也不清楚任何可能影响调度的 Pod 约束。

<!--
This resulted in unschedulable pods because volumes were provisioned in zones that:
-->
这导致了不可调度的 Pod，因为在以下区域中配置了卷：

<!--
* did not have enough CPU or memory resources to run the pod
* conflicted with node selectors, pod affinity or anti-affinity policies
* could not run the pod due to taints
-->
* 没有足够的 CPU 或内存资源来运行 Pod
* 与节点选择器、Pod 亲和或反亲和策略冲突
* 由于污点（taint）不能运行 Pod

<!--
Another common issue was that a non-StatefulSet pod using multiple persistent volumes could have each volume provisioned in a different zone, again resulting in an unschedulable pod.
-->
另一个常见问题是，使用多个持久卷的非有状态 Pod 可能会在不同的区域中配置每个卷，从而导致一个不可调度的 Pod。

<!--
Suboptimal workarounds included overprovisioning of nodes, or manual creation of volumes in the correct zones, making it difficult to dynamically deploy and scale stateful workloads.
-->
次优的解决方法包括节点超配，或在正确的区域中手动创建卷，但这会造成难以动态部署和扩展有状态工作负载的问题。

<!--
The topology-aware dynamic provisioning feature addresses all of the above issues.
-->
拓扑感知动态供应功能解决了上述所有问题。

<!--
## Supported Volume Types
-->
## 支持的卷类型

<!--
In 1.12, the following drivers support topology-aware dynamic provisioning:
-->
在 1.12 中，以下驱动程序支持拓扑感知动态供应：

<!--
* AWS EBS
* Azure Disk
* GCE PD (including Regional PD)
* CSI (alpha) - currently only the GCE PD CSI driver has implemented topology support
-->
* AWS EBS
* Azure Disk
* GCE PD（包括 Regional PD）
* CSI（alpha） - 目前只有 GCE PD CSI 驱动实现了拓扑支持

<!--
## Design Principles
-->
## 设计原则

<!--
While the initial set of supported plugins are all zonal-based, we designed this feature to adhere to the Kubernetes principle of portability across environments. Topology specification is generalized and uses a similar label-based specification like in Pod nodeSelectors and nodeAffinity. This mechanism allows you to define your own topology boundaries, such as racks in on-premise clusters, without requiring modifications to the scheduler to understand these custom topologies.
-->
虽然最初支持的插件集都是基于区域的，但我们设计此功能时遵循 Kubernetes 跨环境可移植性的原则。
拓扑规范是通用的，并使用类似于基于标签的规范，如 Pod nodeSelectors 和 nodeAffinity。
该机制允许你定义自己的拓扑边界，例如内部部署集群中的机架，而无需修改调度程序以了解这些自定义拓扑。

<!--
In addition, the topology information is abstracted away from the pod specification, so a pod does not need knowledge of the underlying storage system’s topology characteristics. This means that you can use the same pod specification across multiple clusters, environments, and storage systems.
-->
此外，拓扑信息是从 Pod 规范中抽象出来的，因此 Pod 不需要了解底层存储系统的拓扑特征。
这意味着你可以在多个集群、环境和存储系统中使用相同的 Pod 规范。

<!--
## Getting Started
-->
## 入门

<!--
To enable this feature, all you need to do is to create a StorageClass with `volumeBindingMode` set to `WaitForFirstConsumer`:
-->
要启用此功能，你需要做的就是创建一个将 `volumeBindingMode` 设置为 `WaitForFirstConsumer` 的 StorageClass：

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: topology-aware-standard
provisioner: kubernetes.io/gce-pd
volumeBindingMode: WaitForFirstConsumer
parameters:
  type: pd-standard
```

<!--
This new setting instructs the volume provisioner to not create a volume immediately, and instead, wait for a pod using an associated PVC to run through scheduling. Note that previous StorageClass `zone` and `zones` parameters do not need to be specified anymore, as pod policies now drive the decision of which zone to provision a volume in.
-->
这个新设置表明卷配置器不立即创建卷，而是等待使用关联的 PVC 的 Pod 通过调度运行。
请注意，不再需要指定以前的 StorageClass `zone` 和 `zones` 参数，因为现在在哪个区域中配置卷由 Pod 策略决定。

<!--
Next, create a pod and PVC with this StorageClass. This sequence is the same as before, but with a different StorageClass specified in the PVC. The following is a hypothetical example, demonstrating the capabilities of the new feature by specifying many pod constraints and scheduling policies:
-->
接下来，使用此 StorageClass 创建一个 Pod 和 PVC。
此过程与之前相同，但在 PVC 中指定了不同的 StorageClass。
以下是一个假设示例，通过指定许多 Pod 约束和调度策略来演示新功能特性：

<!--
* multiple PVCs in a pod
* nodeAffinity across a subset of zones
* pod anti-affinity on zones
-->
* 一个 Pod 多个 PVC
* 跨子区域的节点亲和
* 同一区域 Pod 反亲和

```
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:   
  serviceName: "nginx"
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: failure-domain.beta.kubernetes.io/zone
                operator: In
                values:
                - us-central1-a
                - us-central1-f
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - nginx
            topologyKey: failure-domain.beta.kubernetes.io/zone
      containers:
      - name: nginx
        image: gcr.io/google_containers/nginx-slim:0.8
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
        - name: logs
          mountPath: /logs
 volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: topology-aware-standard
      resources:
        requests:
          storage: 10Gi
  - metadata:
      name: logs
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: topology-aware-standard
      resources:
        requests:
          storage: 1Gi
```

<!--
Afterwards, you can see that the volumes were provisioned in zones according to the policies set by the pod:
-->
之后，你可以看到根据 Pod 设置的策略在区域中配置卷：

```
$ kubectl get pv -o=jsonpath='{range .items[*]}{.spec.claimRef.name}{"\t"}{.metadata.labels.failure\-domain\.beta\.kubernetes\.io/zone}{"\n"}{end}'
www-web-0       us-central1-f
logs-web-0      us-central1-f
www-web-1       us-central1-a
logs-web-1      us-central1-a
```

<!--
## How can I learn more?
-->
## 我怎样才能了解更多？

<!--
Official documentation on the topology-aware dynamic provisioning feature is available here:https://kubernetes.io/docs/concepts/storage/storage-classes/#volume-binding-mode
-->
有关拓扑感知动态供应功能的官方文档可在此处获取：
https://kubernetes.io/docs/concepts/storage/storage-classes/#volume-binding-mode

<!--
Documentation for CSI drivers is available at https://kubernetes-csi.github.io/docs/
-->
有关 CSI 驱动程序的文档，请访问： https://kubernetes-csi.github.io/docs/

<!--
## What’s next?
-->
## 下一步是什么？

<!--
We are actively working on improving this feature to support:
-->
我们正积极致力于改进此功能以支持：

<!--
* more volume types, including dynamic provisioning for local volumes
* dynamic volume attachable count and capacity limits per node
-->
* 更多卷类型，包括本地卷的动态供应
* 动态容量可附加计数和每个节点的容量限制

<!--
## How do I get involved?
-->
## 我如何参与？

<!--
If you have feedback for this feature or are interested in getting involved with the design and development, join the [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.
-->
如果你对此功能有反馈意见或有兴趣参与设计和开发，请加入
[Kubernetes 存储特别兴趣小组](https://github.com/kubernetes/community/tree/master/sig-storage)（SIG）。
我们正在快速成长，并始终欢迎新的贡献者。

<!--
Special thanks to all the contributors that helped bring this feature to beta, including Cheng Xing ([verult](https://github.com/verult)), Chuqiang Li ([lichuqiang](https://github.com/lichuqiang)), David Zhu ([davidz627](https://github.com/davidz627)), Deep Debroy ([ddebroy](https://github.com/ddebroy)), Jan Šafránek ([jsafrane](https://github.com/jsafrane)), Jordan Liggitt ([liggitt](https://github.com/liggitt)), Michelle Au ([msau42](https://github.com/msau42)), Pengfei Ni ([feiskyer](https://github.com/feiskyer)), Saad Ali ([saad-ali](https://github.com/saad-ali)), Tim Hockin ([thockin](https://github.com/thockin)), and Yecheng Fu ([cofyc](https://github.com/cofyc)).
-->
特别感谢帮助推出此功能的所有贡献者，包括 Cheng Xing ([verult](https://github.com/verult))、
Chuqiang Li ([lichuqiang](https://github.com/lichuqiang))、David Zhu ([davidz627](https://github.com/davidz627))、
Deep Debroy ([ddebroy](https://github.com/ddebroy))、Jan Šafránek ([jsafrane](https://github.com/jsafrane))、
Jordan Liggitt ([liggitt](https://github.com/liggitt))、Michelle Au ([msau42](https://github.com/msau42))、
Pengfei Ni ([feiskyer](https://github.com/feiskyer))、Saad Ali ([saad-ali](https://github.com/saad-ali))、
Tim Hockin ([thockin](https://github.com/thockin))，以及 Yecheng Fu ([cofyc](https://github.com/cofyc))。
