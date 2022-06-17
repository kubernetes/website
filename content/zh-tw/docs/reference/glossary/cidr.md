---
title: CIDR
id: cidr
date: 2019-11-12
full_link: 
short_description: >
  CIDR 是一種描述 IP 地址塊的符號，被廣泛使用於各種網路配置中。

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
CIDR (無類域間路由) 是一種描述 IP 地址塊的符號，被廣泛使用於各種網路配置中。


<!--more-->

<!--
In the context of Kubernetes, each {{< glossary_tooltip text="Node" term_id="node" >}} is assigned a range of IP addresses through the start address and a subnet mask using CIDR. This allows Nodes to assign each {{< glossary_tooltip text="Pod" term_id="pod" >}} a unique IP address. Although originally a concept for IPv4, CIDR has also been expanded to include IPv6. 
-->
在 Kubernetes 的上下文中，每個{{< glossary_tooltip text="節點" term_id="node" >}}
以 CIDR 形式（含起始地址和子網掩碼）獲得一個 IP 地址段，
從而能夠為每個 {{< glossary_tooltip text="Pod" term_id="pod" >}} 分配一個獨一無二的 IP 地址。
雖然其概念最初源自 IPv4，CIDR 已經被擴充套件為涵蓋 IPv6。
