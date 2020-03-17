---
title: CIDR
id: cidr
date: 2019-11-12
full_link: 
short_description: >
  CIDR 是一种描述 IP 地址的符号，在各种网络配置中被大量使用。

aka:
tags:
- networking
---
<!-- 
---
title: CIDR
id: cidr
date: 2019-11-12
full_link: 
short_description: >
  CIDR is a notation for describing blocks of IP addresses and is used heavily in various networking configurations.

aka:
tags:
- networking
--- 
-->
<!-- 
CIDR (Classless Inter-Domain Routing) is a notation for describing blocks of IP addresses and is used heavily in various networking configurations. 
-->
CIDR (Classless Inter-Domain Routing) 是一种描述 IP 地址的符号，在各种网络配置中被大量使用。
<!--more-->
<!-- 
In the context of Kubernetes, each {{< glossary_tooltip text="Node" term_id="node" >}} is assigned a range of IP addresses through the start address and a subnet mask using CIDR. This allows Nodes to assign each {{< glossary_tooltip text="Pod" term_id="pod" >}} a unique IP address. Although originally a concept for IPv4, CIDR has also been expanded to include IPv6.  
-->
在 Kubernetes 中，每个 {{< glossary_tooltip text="节点" term_id="node" >}} 都通过使用 CIDR 的起始地址和子网掩码分配得到一个 IP 地址范围。这允许节点为每个 {{< glossary_tooltip text="Pod" term_id="pod" >}} 分配一个唯一的 IP 地址。虽然最初是 IPv4 的概念，同样 CIDR 也被扩展到 IPv6 中。
