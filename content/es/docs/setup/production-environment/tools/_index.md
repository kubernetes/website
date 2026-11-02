---
title: Instalar Kubernetes con herramientas de despliegue
weight: 30
no_list: true
---

Hay muchos métodos y herramientas para configurar tu propio clúster de Kubernetes en producción.
Por ejemplo:

- [kubeadm](/docs/setup/production-environment/tools/kubeadm/)

- [Cluster API](https://cluster-api.sigs.k8s.io/): Un subproyecto de Kubernetes enfocado en
  proporcionar APIs declarativas y herramientas para simplificar el aprovisionamiento, actualización, y operación
  de múltiples clústeres de Kubernetes.

- [kops](https://kops.sigs.k8s.io/): Una herramienta automatizada de aprovisionamiento de clústeres.
  Para tutoriales, mejores prácticas, opciones de configuración e información
  para contactar a la comunidad, por favor revisa el
  [sitio web `kOps`](https://kops.sigs.k8s.io/) para más detalles.

- [kubespray](https://kubespray.io/):
  Una composición de playbooks de [Ansible](https://docs.ansible.com/),
  [inventario](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible/inventory.md),
  herramientas de aprovisionamiento, y conocimiento de dominio para tareas genéricas de gestión de configuración de sistemas operativos y clústeres de Kubernetes.
  Puedes contactar a la comunidad en el canal de Slack
  [#kubespray](https://kubernetes.slack.com/messages/kubespray/).

