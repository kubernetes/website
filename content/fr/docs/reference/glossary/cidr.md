---
title: CIDR
id: cidr
full_link: 
short_description: >
  CIDR est une notation permettant de décrire des plages d’adresses IP, largement utilisée dans les configurations réseau.

aka:
tags:
- networking
---

CIDR (Classless Inter-Domain Routing) est une notation permettant de décrire des plages d’adresses IP, largement utilisée dans les configurations réseau.

<!--more-->

Dans le contexte de Kubernetes, chaque nœud se voit attribuer une plage d’adresses IP définie par une adresse de départ et un masque de sous-réseau en notation CIDR.  
Cela permet aux nœuds d’attribuer une adresse IP unique à chaque Pod.

Bien que ce concept ait été initialement conçu pour IPv4, il a été étendu pour prendre en charge IPv6.