---
title: Installer Kubernetes avec des outils de déploiement
weight: 30
no_list: true
---

Il existe de nombreuses méthodes et outils pour configurer votre propre cluster Kubernetes en production.
Par exemple :

- [kubeadm](/docs/setup/production-environment/tools/kubeadm/)

- [Cluster API](https://cluster-api.sigs.k8s.io/) : un sous-projet Kubernetes centré sur la fourniture d’API déclaratives et d’outils pour simplifier le provisionnement, les mises à jour et l’exploitation de plusieurs clusters Kubernetes.

- [kops](https://kops.sigs.k8s.io/) : un outil automatisé de provisionnement de clusters.  
  Pour des tutoriels, bonnes pratiques, options de configuration et des informations pour rejoindre la communauté, veuillez consulter le site de [`kOps`](https://kops.sigs.k8s.io/) pour plus de détails.

- [kubespray](https://kubespray.io/) : une composition de playbooks [Ansible](https://docs.ansible.com/), d’[inventaires](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible/inventory.md), d’outils de provisioning et de connaissances métier pour la gestion générique de la configuration de clusters OS/Kubernetes.  
  Vous pouvez rejoindre la communauté sur le canal Slack [#kubespray](https://kubernetes.slack.com/messages/kubespray/).