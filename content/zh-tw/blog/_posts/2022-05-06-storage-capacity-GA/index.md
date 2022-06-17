---
layout: blog
title: "Kubernetes 1.24 版本中儲存容量跟蹤特性進入 GA 階段"
date: 2022-05-06
slug: storage-capacity-ga
---
<!--
layout: blog
title: "Storage Capacity Tracking reaches GA in Kubernetes 1.24"
date: 2022-05-06
slug: storage-capacity-ga
-->

<!--
 **Authors:** Patrick Ohly (Intel)
-->
 **作者:** Patrick Ohly（Intel）

<!--
The v1.24 release of Kubernetes brings [storage capacity](/docs/concepts/storage/storage-capacity/)
tracking as a generally available feature.
-->
在 Kubernetes v1.24 版本中，[儲存容量](/zh-cn/docs/concepts/storage/storage-capacity/)跟蹤已經成為一項正式釋出的功能。

<!--
## Problems we have solved
-->
## 已經解決的問題

<!--
As explained in more detail in the [previous blog post about this
feature](/blog/2021/04/14/local-storage-features-go-beta/), storage capacity
tracking allows a CSI driver to publish information about remaining
capacity. The kube-scheduler then uses that information to pick suitable nodes
for a Pod when that Pod has volumes that still need to be provisioned.
-->
如[上一篇關於此功能的博文](/blog/2021/04/14/local-storage-features-go-beta/)中所詳細介紹的，
儲存容量跟蹤允許 CSI 驅動程式釋出有關剩餘容量的資訊。當 Pod 仍然有需要配置的卷時，
kube-scheduler 使用該資訊為 Pod 選擇合適的節點。

<!--
Without this information, a Pod may get stuck without ever being scheduled onto
a suitable node because kube-scheduler has to choose blindly and always ends up
picking a node for which the volume cannot be provisioned because the
underlying storage system managed by the CSI driver does not have sufficient
capacity left.
-->
如果沒有這些資訊，Pod 可能會被卡住，而不會被排程到合適節點，這是因為 kube-scheduler
只能盲目地選擇節點。由於 CSI 驅動程式管理的下層儲存系統沒有足夠的容量，
kube-scheduler 常常會選擇一個無法為其配置卷的節點。

<!--
Because CSI drivers publish storage capacity information that gets used at a
later time when it might not be up-to-date anymore, it can still happen that a
node is picked that doesn't work out after all. Volume provisioning recovers
from that by informing the scheduler that it needs to try again with a
different node.
-->
因為 CSI 驅動程式釋出的這些儲存容量資訊在被使用的時候可能已經不是最新的資訊了，
所以最終選擇的節點無法正常工作的情況仍然可能會發生。
卷配置透過通知排程程式需要在其他節點上重試來恢復。

<!--
[Load
tests](https://github.com/kubernetes-csi/csi-driver-host-path/blob/master/docs/storage-capacity-tracking.md)
that were done again for promotion to GA confirmed that all storage in a
cluster can be consumed by Pods with storage capacity tracking whereas Pods got
stuck without it.
-->
升級到 GA 版本後重新進行的[負載測試](https://github.com/kubernetes-csi/csi-driver-host-path/blob/master/docs/storage-capacity-tracking.md)證實，
叢集中部署了儲存容量跟蹤功能的 Pod 可以使用所有的儲存，而沒有部署此功能的 Pod 就會被卡住。

<!--
## Problems we have *not* solved
-->
## *尚未*解決的問題

<!--
Recovery from a failed volume provisioning attempt has one known limitation: if a Pod
uses two volumes and only one of them could be provisioned, then all future
scheduling decisions are limited by the already provisioned volume. If that
volume is local to a node and the other volume cannot be provisioned there, the
Pod is stuck. This problem pre-dates storage capacity tracking and while the
additional information makes it less likely to occur, it cannot be avoided in
all cases, except of course by only using one volume per Pod.
-->
如果嘗試恢復一個製備失敗的卷，存在一個已知的限制：
如果 Pod 使用兩個卷並且只能製備其中一個，那麼所有將來的排程決策都受到已經制備的卷的限制。
如果該卷是節點的本地卷，並且另一個卷無法被製備，則 Pod 會卡住。
此問題早在儲存容量跟蹤功能之前就存在，雖然苛刻的附加條件使這種情況不太可能發生，
但是無法完全避免，當然每個 Pod 僅使用一個卷的情況除外。

<!--
An idea for solving this was proposed in a [KEP
draft](https://github.com/kubernetes/enhancements/pull/1703): volumes that were
provisioned and haven't been used yet cannot have any valuable data and
therefore could be freed and provisioned again elsewhere. SIG Storage is
looking for interested developers who want to continue working on this.
-->
[KEP 草案](https://github.com/kubernetes/enhancements/pull/1703)中提出了一個解決此問題的想法：
已製備但尚未被使用的卷不能包含任何有價值的資料，因此可以在其他地方釋放並且再次被製備。
SIG Storage 正在尋找對此感興趣並且願意繼續從事此工作的開發人員。

<!--
Also not solved is support in Cluster Autoscaler for Pods with volumes. For CSI
drivers with storage capacity tracking, a prototype was developed and discussed
in [a PR](https://github.com/kubernetes/autoscaler/pull/3887). It was meant to
work with arbitrary CSI drivers, but that flexibility made it hard to configure
and slowed down scale up operations: because autoscaler was unable to simulate
volume provisioning, it only scaled the cluster by one node at a time, which
was seen as insufficient.
-->
另一個沒有解決的問題是 Cluster Autoscaler 對包含卷的 Pod 的支援。
對於具有儲存容量跟蹤功能的 CSI 驅動程式，我們開發了一個原型並在此
[PR](https://github.com/kubernetes/autoscaler/pull/3887) 中進行了討論。
此原型旨在與任意 CSI 驅動程式協同工作，但這種靈活性使其難以配置並減慢了擴充套件操作：
因為自動擴充套件程式無法模擬卷製備操作，它一次只能將叢集擴充套件一個節點，這是此方案的不足之處。

<!--
Therefore that PR was not merged and a different approach with tighter coupling
between autoscaler and CSI driver will be needed. For this a better
understanding is needed about which local storage CSI drivers are used in
combination with cluster autoscaling. Should this lead to a new KEP, then users
will have to try out an implementation in practice before it can move to beta
or GA. So please reach out to SIG Storage if you have an interest in this
topic.
-->
因此，這個 PR 沒有被合入，需要另一種不同的方法，在自動縮放器和 CSI 驅動程式之間實現更緊密的耦合。
為此，需要更好地瞭解哪些本地儲存 CSI 驅動程式與叢集自動縮放結合使用。如果這會引出新的 KEP，
那麼使用者將不得不在實踐中嘗試實現，然後才能遷移到 beta 版本或 GA 版本中。
如果你對此主題感興趣，請聯絡 SIG Storage。

<!--
## Acknowledgements
-->
## 致謝

<!--
Thanks a lot to the members of the community who have contributed to this
feature or given feedback including members of [SIG
Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling),
[SIG
Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling),
and of course [SIG
Storage](https://github.com/kubernetes/community/tree/master/sig-storage)!
-->
非常感謝為此功能做出貢獻或提供反饋的 [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling)、
[SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling) 
和 [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage) 成員！
