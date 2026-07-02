---
title: Встановлення Kubernetes за допомогою інструментів розгортання
weight: 30
no_list: true
---

Існує багато методів та інструментів для встановлення власного промислового кластера Kubernetes. Наприклад:

- [kubeadm](/docs/setup/production-environment/tools/kubeadm/)
- [Cluster API](https://cluster-api.sigs.k8s.io/): Підпроєкт Kubernetes зосереджений на наданні декларативних API та інструментарію для спрощення створення, оновлення та експлуатації кількох кластерів Kubernetes.
- [kops](https://kops.sigs.k8s.io/): автоматизований інструмент для розгортання кластера. За навчальними матеріалами, найкращими практиками, параметрами конфігурації та інформацією про спільноту звертайтесь до [вебсайту `kOps`](https://kops.sigs.k8s.io/).
- [kubespray](https://kubespray.io/): набір плейбуків [Ansible](https://docs.ansible.com/), [inventory](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible/inventory.md), інструментів керування та знання про загальні завдання з конфігурації OS/Kubernetes. Ви можете звертатися до спільноти на каналі Slack [#kubespray](https://kubernetes.slack.com/messages/kubespray/).
