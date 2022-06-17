---
title: etcd
id: etcd
date: 2018-04-12
full_link: /zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/
short_description: >
  etcd 是兼具一致性和高可用性的鍵值資料庫，用作儲存 Kubernetes 所有叢集資料的後臺資料庫。

aka: 
tags:
- architecture
- storage
---

<!--
---
title: etcd
id: etcd
date: 2018-04-12
full_link: /docs/tasks/administer-cluster/configure-upgrade-etcd/
short_description: >
  Consistent and highly-available key value store used as Kubernetes' backing store for all cluster data.

aka: 
tags:
- architecture
- storage
---
-->

<!--
 Consistent and highly-available key value store used as Kubernetes' backing store for all cluster data.
-->

`etcd` 是兼顧一致性與高可用性的鍵值資料庫，可以作為儲存 Kubernetes 所有叢集資料的後臺資料庫。

<!--more--> 
<!--
If your Kubernetes cluster uses etcd as its backing store, make sure you have a
[back up](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster) plan
for those data.
-->	
你的 Kubernetes 叢集的 `etcd` 資料庫通常需要有個[備份](/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)計劃。
<!--
You can find in-depth information about etcd in the official [documentation](https://etcd.io/docs/).
-->

如果想要更深入的瞭解 `etcd`，請參考 [etcd 文件](https://etcd.io/docs/)。
