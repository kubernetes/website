---
title: Pod miroir
id: mirror-pod
short_description: >
  Un objet dans le serveur API qui représente un pod statique sur un kubelet.

aka:
tags:
- fundamental
---
Un objet {{< glossary_tooltip text="pod" term_id="pod" >}} qu’un {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} utilise
pour représenter un {{< glossary_tooltip text="pod statique" term_id="static-pod" >}}.

<!--more-->

Lorsque le kubelet détecte un pod statique dans sa configuration, il essaie automatiquement
de créer un objet Pod correspondant sur le serveur API Kubernetes.  
Cela signifie que le pod sera visible dans le serveur API, mais ne peut pas être contrôlé depuis celui-ci.

(Par exemple, supprimer un pod miroir n’arrêtera pas le kubelet qui continue de l’exécuter.)
