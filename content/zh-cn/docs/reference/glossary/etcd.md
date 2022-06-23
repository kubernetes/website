---
title: etcd
id: etcd
date: 2018-04-12
full_link: /zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/
short_description: >
  etcd 是兼具一致性和高可用性的键值数据库，用作保存 Kubernetes 所有集群数据的后台数据库。

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

`etcd` 是兼顾一致性与高可用性的键值数据库，可以作为保存 Kubernetes 所有集群数据的后台数据库。

<!--more--> 
<!--
If your Kubernetes cluster uses etcd as its backing store, make sure you have a
[back up](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster) plan
for those data.
-->	
你的 Kubernetes 集群的 `etcd` 数据库通常需要有个[备份](/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)计划。
<!--
You can find in-depth information about etcd in the official [documentation](https://etcd.io/docs/).
-->

如果想要更深入的了解 `etcd`，请参考 [etcd 文档](https://etcd.io/docs/)。
