---
approvers:
- thockin
title: Kubernetes OpenVSwitch GRE/VxLAN 网络
---

本文档介绍了如何使用 OpenVSwitch，在跨 nodes 的 pods 之间设置网络。
隧道类型可以是 GRE 或者是 VxLAN。如需在网络内执行大规模隔离时，最好使用 VxLAN。

![OVS Networking](/images/docs/ovs-networking.png)

Kubernetes 中 Vagrant 的设置如下：

docker 网桥被 brctl 生成的 Linux 网桥（kbr0） 所代替，kbr0 是具有 256 个地址空间的子网。总的来说，node 会得到 10.244.x.0/24 的子网，docker 上配置使用的网桥会代替默认 docker0 的网桥。

另外，OVS 网桥创建（obr0），并将其作为端口添加到 kbr0 的网桥中。所有 OVS 网桥通过 GRE 隧道连接所有的 nodes。因此，每个 node 都有一个到其他 nodes 的出站 GRE 隧道。这个隧道没有必要是一个完整的网状物，但是越像网状结构越好。在网桥上开启 STP （生成树）模式以防止环路的发生。

路由规则允许任何 10.244.0.0/16 通过与隧道相连的 OVS 网桥到达目标。




