---
approvers:
- thockin
title: Kubernetes OpenVSwitch GRE/VxLAN 网络
---

本文档介绍了如何使用OpenVSwitch，在跨nodes的pods之间设置网络。
隧道类型可以是GRE或者是VxLAN。如需在网络内执行大规模隔离时，最好使用VxLAN。

![OVS Networking](/images/docs/ovs-networking.png)

Kubernetes中Vagrant的设置如下：

docker网桥被brctl生成的Linux网桥(kbr0)所代替，kbr0是具有256个地址空间的子网。总的来说，node会得到10.244.x.0/24的子网，docker上配置使用的网桥会代替默认docker0的网桥。

另外，OVS网桥创建(obr0)，并将其作为端口添加到kbr0的网桥中。所有OVS网桥通过GRE隧道连接所有的nodes。因此，每个node都有一个到其他nodes的出站GRE隧道。这个隧道没有必要是一个完整的网状物，但是越像网状结构越好。在网桥上开启STP(生成树)模式以防止环路的发生。

路由规则允许任何10.244.0.0/16通过与隧道相连的OVS网桥到达目标。




