---
title: kOps (Kubernetes Operations)
id: kops
full_link: /docs/setup/production-environment/kops/
short_description: >
  kOps aide à créer, détruire, mettre à jour et maintenir des clusters Kubernetes de production hautement disponibles, tout en provisionnant l’infrastructure cloud nécessaire.
aka:
tags:
- outil
- opération
---
`kOps` aide non seulement à créer, détruire, mettre à jour et maintenir des clusters Kubernetes
de production hautement disponibles, mais il provisionne également l’infrastructure cloud nécessaire.

<!--more--> 

{{< note >}}
AWS (Amazon Web Services) est actuellement officiellement supporté, avec DigitalOcean, GCE et OpenStack en support bêta, et Azure en alpha.
{{< /note >}}

`kOps` est un système de provisionnement automatisé :
  * Installation entièrement automatisée
  * Utilise DNS pour identifier les clusters
  * Auto-réparation : tout fonctionne dans des groupes d’Auto-Scaling
  * Support de plusieurs OS (Amazon Linux, Debian, Flatcar, RHEL, Rocky et Ubuntu)
  * Support de haute disponibilité
  * Peut provisionner directement ou générer des manifests Terraform
  