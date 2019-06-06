---
title: Ingress Controllers
reviewers:
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
Pour que la ressource Ingress fonctionne, le cluster doit disposer d'un contrôleur d'entrée en cours d'exécution.

Contrairement aux autres types de contrôleurs qui font partie du binaire `kube-controller-manager`, les contrôleurs Ingress
ne sont pas démarrés automatiquement avec un cluster. Utilisez cette page pour choisir l'implémentation du contrôleur d'entrée
qui correspond le mieux à votre cluster.

Kubernetes en tant que projet soutient et maintient actuellement [GCE](https://git.k8s.io/ingress-gce/README.md) et [nginx](https://git.k8s.io/ingress-nginx/README.md) contrôleurs.

{{% /capture %}}