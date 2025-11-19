---
title: etcd
id: etcd
date: 2018-04-12
full_link: /zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/
short_description: >
  一致且高可用的鍵值存儲，用作 Kubernetes 所有叢集數據的後臺數據庫。

aka: 
tags:
- architecture
- storage
---
<!--
title: etcd
id: etcd
date: 2018-04-12
full_link: /docs/tasks/administer-cluster/configure-upgrade-etcd/
short_description: >
  Consistent and highly-available key value store used as backing store of Kubernetes for all cluster data.

aka: 
tags:
- architecture
- storage
-->

<!--
 Consistent and highly-available key value store used as backing store of Kubernetes for all cluster data.
-->
一致且高可用的鍵值存儲，用作 Kubernetes 所有叢集數據的後臺數據庫。

<!--more-->

<!--
If your Kubernetes cluster uses etcd as its backing store, make sure you have a
[back up](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster) plan
for the data.
-->	
如果你的 Kubernetes 叢集使用 etcd 作爲其後臺數據庫，
請確保你針對這些數據有一份
[備份](/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)計劃。

<!--
You can find in-depth information about etcd in the official [documentation](https://etcd.io/docs/).
-->
你可以在官方[文檔](https://etcd.io/docs/)中找到有關 etcd 的深入知識。
