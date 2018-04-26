---
approvers:
- mml
title: 1.6 版本集群管理指南
---

* TOC
{:toc}

<!--
This document outlines the potentially disruptive changes that exist in the 1.6 release cycle.  Operators, administrators, and developers should
take note of the changes below in order to maintain continuity across their upgrade process.
-->
本文概述了 1.6 版本发布周期内存在的可能是破坏性的变化，操作人员、管理员和开发人员应注意下面的变更，以便在升级过程中保持连续性。

<!--
## Cluster defaults set to etcd 3
-->
## 集群默认设置使用 etcd3

<!--
In the 1.6 release cycle, the default backend storage layer has been upgraded to fully leverage [etcd 3 capabilities](https://coreos.com/blog/etcd3-a-new-etcd.html) by default. For new clusters, there is nothing an operator will need to do, it should "just work".  However, if you are upgrading from a 1.5 cluster, care should be taken to ensure
continuity.
-->
在 1.6 发布周期中，默认的后台存储已经升级到使用 [etcd3 能力](https://coreos.com/blog/etcd3-a-new-etcd.html)。对于新集群，操作人员不需要做任何事情，就能让它正常工作。然而，如果您是从 1.5 版本的集群进行升级，请注意保证连续性。

<!--
It is possible to maintain v2 compatibility mode while running etcd 3 for an interim period of time.  To do this, you will simply need to update an argument passed to your apiserver during startup:
-->
在运行 etcd3 的时候有兼容 v2 的一个过渡期，如果需要在 1.6 的版本中使用 v2 的功能，您只需要更新传递到 apiserver 的一个启动参数：

```
$ kube-apiserver --storage-backend='etcd2' $(EXISTING_ARGS)
```

<!--
However, for long-term maintenance of the cluster, we recommend that the operator plan an outage window in order to perform a [v2->v3 data upgrade](https://coreos.com/etcd/docs/latest/upgrades/upgrade_3_0.html).
-->
但是，对于集群的长期维护，我们建议操作员计划一个中断窗口，以便执行 [v2 到 v3 的数据升级](https://coreos.com/etcd/docs/latest/upgrades/upgrade_3_0.html)。
