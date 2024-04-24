---
title: etcd
id: etcd
date: 2018-04-12
full_link: /zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/
short_description: >
  一致且高可用的键值存储，用作 Kubernetes 所有集群数据的后台数据库。

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
一致且高可用的键值存储，用作 Kubernetes 所有集群数据的后台数据库。

<!--more-->

<!--
If your Kubernetes cluster uses etcd as its backing store, make sure you have a
[back up](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster) plan
for the data.
-->	
如果你的 Kubernetes 集群使用 etcd 作为其后台数据库，
请确保你针对这些数据有一份
[备份](/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)计划。

<!--
You can find in-depth information about etcd in the official [documentation](https://etcd.io/docs/).
-->
你可以在官方[文档](https://etcd.io/docs/)中找到有关 etcd 的深入知识。
