---
title: Установка Kubernetes с помощью инструментов развёртывания
weight: 30
no_list: true
aliases:
- /ru/docs/setup/custom-cloud/
---

Существует множество способов и инструментов для создания собственного производственного кластера Kubernetes.
Например:

- [kubeadm](/docs/setup/production-environment/tools/kubeadm/)

- [Cluster API](https://cluster-api.sigs.k8s.io/): подпроект Kubernetes, предоставляющий
  декларативные API и инструменты для упрощения создания, обновления и эксплуатации
  нескольких кластеров Kubernetes.

- [kops](https://kops.sigs.k8s.io/): инструмент автоматизированного создания кластеров.
  Руководства, рекомендации, параметры конфигурации и сведения о связи с сообществом
  приведены на [сайте `kOps`](https://kops.sigs.k8s.io/).

- [kubespray](https://kubespray.io/): набор сценариев [Ansible](https://docs.ansible.com/),
  [инвентарных файлов](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible/inventory.md),
  инструментов подготовки инфраструктуры и практических знаний для типовых задач управления
  конфигурацией ОС и кластеров Kubernetes. Связаться с сообществом можно в канале Slack
  [#kubespray](https://kubernetes.slack.com/messages/kubespray/).
