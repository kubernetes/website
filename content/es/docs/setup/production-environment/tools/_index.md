---
title: Instalación de Kubernetes con herramientas de despliegue
weight: 30
no_list: true
---

Existen muchos métodos y herramientas para configurar tu propio clúster de Kubernetes para producción.
Por ejemplo:

- [kubeadm](/docs/setup/production-environment/tools/kubeadm/)

- [Cluster API](https://cluster-api.sigs.k8s.io/): Un subproyecto de Kubernetes enfocado en
  proporcionar APIs declarativas y herramientas para simplificar el aprovisionamiento, la actualización y la operación
  de múltiples clústeres de Kubernetes.
  
- [kops](https://kops.sigs.k8s.io/): Una herramienta automatizada para el aprovisionamiento de clústeres.
  Para tutoriales, mejores prácticas, opciones de configuración e información sobre
  cómo comunicarse con la comunidad, consulta el
  [sitio web de `kOps`](https://kops.sigs.k8s.io/) para más detalles.

- [kubespray](https://kubespray.io/):
  Una composición de playbooks de [Ansible](https://docs.ansible.com/),
  [inventario](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible/inventory.md),
  herramientas de aprovisionamiento y conocimiento de dominio para tareas de gestión
  de configuración de clústeres genéricos de SO/Kubernetes. Puedes ponerte en contacto con la comunidad en el canal de Slack
  [#kubespray](https://kubernetes.slack.com/messages/kubespray/).
