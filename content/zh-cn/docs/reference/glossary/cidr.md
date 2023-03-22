---
title: CIDR
id: cidr
date: 2019-11-12
full_link: 
short_description: >
  CIDR 是一种描述 IP 地址块的符号，被广泛使用于各种网络配置中。

aka:
tags:
- networking
---
<!--
title: CIDR
id: cidr
date: 2019-11-12
full_link: 
short_description: >
  CIDR is a notation for describing blocks of IP addresses and is used heavily in various networking configurations.

aka:
tags:
- networking
-->

<!--
CIDR (Classless Inter-Domain Routing) is a notation for describing blocks of IP addresses and is used heavily in various networking configurations.
-->
CIDR（无类域间路由，Classless Inter-Domain Routing）是一种描述
IP 地址块的符号，被广泛使用于各种网络配置中。

<!--more-->

<!--
In the context of Kubernetes, each {{< glossary_tooltip text="Node" term_id="node" >}} is assigned a range of IP addresses through the start address and a subnet mask using CIDR. This allows Nodes to assign each {{< glossary_tooltip text="Pod" term_id="pod" >}} a unique IP address. Although originally a concept for IPv4, CIDR has also been expanded to include IPv6. 
-->
在 Kubernetes 的上下文中，每个{{< glossary_tooltip text="节点" term_id="node" >}}
以 CIDR 形式（含起始地址和子网掩码）获得一个 IP 地址段，
从而能够为每个 {{< glossary_tooltip text="Pod" term_id="pod" >}} 分配一个独一无二的 IP 地址。
虽然其概念最初源自 IPv4，CIDR 已经被扩展为涵盖 IPv6。
