<!--
---
assignees:
- thockin
title: Kubernetes OpenVSwitch GRE/VxLAN networking
---
-->
---
assignees:
- thockin
title: Kubernetes OpenVSwitch GRE/VxLAN 网络
---

<!--
This document describes how OpenVSwitch is used to setup networking between pods across nodes.
The tunnel type could be GRE or VxLAN. VxLAN is preferable when large scale isolation needs to be performed within the network.
-->
本文档介绍了如何使用OpenVSwitch，在跨nodes的pods之间设置网络。
隧道类型可以是GRE或者是VxLAN。如需在网络内执行大规模隔离时，最好使用VxLAN。

![OVS Networking](/images/docs/ovs-networking.png)

<!--
The vagrant setup in Kubernetes does the following:
-->
Kubernetes中Vagrant的设置如下：

<!--
The docker bridge is replaced with a brctl generated linux bridge (kbr0) with a 256 address space subnet. Basically, a node gets 10.244.x.0/24 subnet and docker is configured to use that bridge instead of the default docker0 bridge.
-->
docker网桥被brctl生成的Linux网桥(kbr0)所代替，kbr0是具有256个地址空间的子网。总的来说，node会得到10.244.x.0/24的子网，docker上配置使用的网桥会代替默认docker0的网桥。

<!--
Also, an OVS bridge is created(obr0) and added as a port to the kbr0 bridge. All OVS bridges across all nodes are linked with GRE tunnels. So, each node has an outgoing GRE tunnel to all other nodes. It does not need to be a complete mesh really, just meshier the better. STP (spanning tree) mode is enabled in the bridges to prevent loops.
-->
另外，OVS网桥创建(obr0)，并将其作为端口添加到kbr0的网桥中。所有OVS网桥通过GRE隧道而连接所有的nodes。因此，每个node都有一个到其他nodes的出站GRE隧道。这个隧道没有必要是一个完整的网状物，但是越像网状结构越好。在网桥上开启STP(生成树)模式以防止环路的发生。

<!--
Routing rules enable any 10.244.0.0/16 target to become reachable via the OVS bridge connected with the tunnels.
-->
路由规则允许任何10.244.0.0/16通过与隧道相连的OVS网桥而到达目标。




