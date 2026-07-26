---
title: Drain
id: drain
full_link:
short_description: >
  Évacuation sécurisée des Pods d’un nœud afin de préparer une maintenance ou son retrait.
tags:
- fundamental
- operation
---

Le drain est le processus consistant à évacuer de manière sécurisée les Pods d’un nœud afin de le préparer à une maintenance ou à son retrait du cluster.

<!--more-->

La commande `kubectl drain` permet de marquer un nœud comme étant hors service.  
Lorsqu’elle est exécutée, elle évacue tous les Pods présents sur ce nœud.

Si une demande d’éviction est temporairement refusée, `kubectl drain` réessaie jusqu’à ce que tous les Pods soient terminés ou qu’un délai configurable soit atteint.