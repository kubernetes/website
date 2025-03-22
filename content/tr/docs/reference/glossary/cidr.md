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
CIDR (Classless Inter-Domain Routing) is a notation for describing blocks of IP addresses and is used heavily in various networking configurations.

<!--more-->

In the context of Kubernetes, each {{< glossary_tooltip text="Node" term_id="node" >}} is assigned a range of IP addresses through the start address and a subnet mask using CIDR. This allows Nodes to assign each {{< glossary_tooltip text="Pod" term_id="pod" >}} a unique IP address. Although originally a concept for IPv4, CIDR has also been expanded to include IPv6. 

