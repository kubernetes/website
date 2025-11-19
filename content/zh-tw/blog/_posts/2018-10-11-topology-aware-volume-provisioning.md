---
layout: blog
title: 'Kubernetes 中的拓撲感知數據卷供應'
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
通過提供拓撲感知動態卷供應功能，具有持久卷的多區域叢集體驗在 Kubernetes 1.12
中得到了改進。此功能使得 Kubernetes 在動態供應卷時能做出明智的決策，方法是從調度器獲得爲
Pod 提供數據卷的最佳位置。在多區域叢集環境，這意味着數據卷能夠在滿足你的 Pod
運行需要的合適的區域被供應，從而允許你跨故障域輕鬆部署和擴展有狀態工作負載，從而提供高可用性和容錯能力。

<!--
## Previous challenges
-->
## 以前的挑戰

<!--
Before this feature, running stateful workloads with zonal persistent disks (such as AWS ElasticBlockStore, Azure Disk, GCE PersistentDisk) in multi-zone clusters had many challenges. Dynamic provisioning was handled independently from pod scheduling, which meant that as soon as you created a PersistentVolumeClaim (PVC), a volume would get provisioned. This meant that the provisioner had no knowledge of what pods were using the volume, and any pod constraints it had that could impact scheduling.
-->
在此功能被提供之前，在多區域叢集中使用區域化的持久磁盤（例如 AWS ElasticBlockStore、
Azure Disk、GCE PersistentDisk）運行有狀態工作負載存在許多挑戰。動態供應獨立於 Pod
調度處理，這意味着只要你創建了一個 PersistentVolumeClaim（PVC），一個卷就會被供應。
這也意味着供應者不知道哪些 Pod 正在使用該卷，也不清楚任何可能影響調度的 Pod 約束。

<!--
This resulted in unschedulable pods because volumes were provisioned in zones that:
-->
這導致了不可調度的 Pod，因爲在以下區域中設定了卷：

<!--
* did not have enough CPU or memory resources to run the pod
* conflicted with node selectors, pod affinity or anti-affinity policies
* could not run the pod due to taints
-->
* 沒有足夠的 CPU 或內存資源來運行 Pod
* 與節點選擇器、Pod 親和或反親和策略衝突
* 由於污點（taint）不能運行 Pod

<!--
Another common issue was that a non-StatefulSet pod using multiple persistent volumes could have each volume provisioned in a different zone, again resulting in an unschedulable pod.
-->
另一個常見問題是，使用多個持久卷的非有狀態 Pod 可能會在不同的區域中設定每個卷，從而導致一個不可調度的 Pod。

<!--
Suboptimal workarounds included overprovisioning of nodes, or manual creation of volumes in the correct zones, making it difficult to dynamically deploy and scale stateful workloads.
-->
次優的解決方法包括節點超配，或在正確的區域中手動創建卷，但這會造成難以動態部署和擴展有狀態工作負載的問題。

<!--
The topology-aware dynamic provisioning feature addresses all of the above issues.
-->
拓撲感知動態供應功能解決了上述所有問題。

<!--
## Supported Volume Types
-->
## 支持的卷類型

<!--
In 1.12, the following drivers support topology-aware dynamic provisioning:
-->
在 1.12 中，以下驅動程序支持拓撲感知動態供應：

<!--
* AWS EBS
* Azure Disk
* GCE PD (including Regional PD)
* CSI (alpha) - currently only the GCE PD CSI driver has implemented topology support
-->
* AWS EBS
* Azure Disk
* GCE PD（包括 Regional PD）
* CSI（alpha） - 目前只有 GCE PD CSI 驅動實現了拓撲支持

<!--
## Design Principles
-->
## 設計原則

<!--
While the initial set of supported plugins are all zonal-based, we designed this feature to adhere to the Kubernetes principle of portability across environments. Topology specification is generalized and uses a similar label-based specification like in Pod nodeSelectors and nodeAffinity. This mechanism allows you to define your own topology boundaries, such as racks in on-premise clusters, without requiring modifications to the scheduler to understand these custom topologies.
-->
雖然最初支持的插件集都是基於區域的，但我們設計此功能時遵循 Kubernetes 跨環境可移植性的原則。
拓撲規範是通用的，並使用類似於基於標籤的規範，如 Pod nodeSelectors 和 nodeAffinity。
該機制允許你定義自己的拓撲邊界，例如內部部署叢集中的機架，而無需修改調度程序以瞭解這些自定義拓撲。

<!--
In addition, the topology information is abstracted away from the pod specification, so a pod does not need knowledge of the underlying storage system’s topology characteristics. This means that you can use the same pod specification across multiple clusters, environments, and storage systems.
-->
此外，拓撲信息是從 Pod 規範中抽象出來的，因此 Pod 不需要了解底層存儲系統的拓撲特徵。
這意味着你可以在多個叢集、環境和存儲系統中使用相同的 Pod 規範。

<!--
## Getting Started
-->
## 入門

<!--
To enable this feature, all you need to do is to create a StorageClass with `volumeBindingMode` set to `WaitForFirstConsumer`:
-->
要啓用此功能，你需要做的就是創建一個將 `volumeBindingMode` 設置爲 `WaitForFirstConsumer` 的 StorageClass：

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
這個新設置表明卷設定器不立即創建卷，而是等待使用關聯的 PVC 的 Pod 通過調度運行。
請注意，不再需要指定以前的 StorageClass `zone` 和 `zones` 參數，因爲現在在哪個區域中設定卷由 Pod 策略決定。

<!--
Next, create a pod and PVC with this StorageClass. This sequence is the same as before, but with a different StorageClass specified in the PVC. The following is a hypothetical example, demonstrating the capabilities of the new feature by specifying many pod constraints and scheduling policies:
-->
接下來，使用此 StorageClass 創建一個 Pod 和 PVC。
此過程與之前相同，但在 PVC 中指定了不同的 StorageClass。
以下是一個假設示例，通過指定許多 Pod 約束和調度策略來演示新功能特性：

<!--
* multiple PVCs in a pod
* nodeAffinity across a subset of zones
* pod anti-affinity on zones
-->
* 一個 Pod 多個 PVC
* 跨子區域的節點親和
* 同一區域 Pod 反親和

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
之後，你可以看到根據 Pod 設置的策略在區域中設定卷：

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
## 我怎樣才能瞭解更多？

<!--
Official documentation on the topology-aware dynamic provisioning feature is available here:https://kubernetes.io/docs/concepts/storage/storage-classes/#volume-binding-mode
-->
有關拓撲感知動態供應功能的官方文檔可在此處獲取：
https://kubernetes.io/docs/concepts/storage/storage-classes/#volume-binding-mode

<!--
Documentation for CSI drivers is available at https://kubernetes-csi.github.io/docs/
-->
有關 CSI 驅動程序的文檔，請訪問： https://kubernetes-csi.github.io/docs/

<!--
## What’s next?
-->
## 下一步是什麼？

<!--
We are actively working on improving this feature to support:
-->
我們正積極致力於改進此功能以支持：

<!--
* more volume types, including dynamic provisioning for local volumes
* dynamic volume attachable count and capacity limits per node
-->
* 更多卷類型，包括本地卷的動態供應
* 動態容量可附加計數和每個節點的容量限制

<!--
## How do I get involved?
-->
## 我如何參與？

<!--
If you have feedback for this feature or are interested in getting involved with the design and development, join the [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.
-->
如果你對此功能有反饋意見或有興趣參與設計和開發，請加入
[Kubernetes 存儲特別興趣小組](https://github.com/kubernetes/community/tree/master/sig-storage)（SIG）。
我們正在快速成長，並始終歡迎新的貢獻者。

<!--
Special thanks to all the contributors that helped bring this feature to beta, including Cheng Xing ([verult](https://github.com/verult)), Chuqiang Li ([lichuqiang](https://github.com/lichuqiang)), David Zhu ([davidz627](https://github.com/davidz627)), Deep Debroy ([ddebroy](https://github.com/ddebroy)), Jan Šafránek ([jsafrane](https://github.com/jsafrane)), Jordan Liggitt ([liggitt](https://github.com/liggitt)), Michelle Au ([msau42](https://github.com/msau42)), Pengfei Ni ([feiskyer](https://github.com/feiskyer)), Saad Ali ([saad-ali](https://github.com/saad-ali)), Tim Hockin ([thockin](https://github.com/thockin)), and Yecheng Fu ([cofyc](https://github.com/cofyc)).
-->
特別感謝幫助推出此功能的所有貢獻者，包括 Cheng Xing ([verult](https://github.com/verult))、
Chuqiang Li ([lichuqiang](https://github.com/lichuqiang))、David Zhu ([davidz627](https://github.com/davidz627))、
Deep Debroy ([ddebroy](https://github.com/ddebroy))、Jan Šafránek ([jsafrane](https://github.com/jsafrane))、
Jordan Liggitt ([liggitt](https://github.com/liggitt))、Michelle Au ([msau42](https://github.com/msau42))、
Pengfei Ni ([feiskyer](https://github.com/feiskyer))、Saad Ali ([saad-ali](https://github.com/saad-ali))、
Tim Hockin ([thockin](https://github.com/thockin))，以及 Yecheng Fu ([cofyc](https://github.com/cofyc))。
