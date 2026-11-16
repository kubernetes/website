---
title: "Перевірка встановлення kubectl"
description: "Як перевірити встановлення kubectl."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Щоб kubectl міг знайти кластер Kubernetes і отримати до нього доступ, йому потрібен [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), який створюється автоматично, коли ви створюєте кластер за допомогою [kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) або успішно розгортаєте кластер Minikube. Стандартно конфігурація kubectl міститься в `~/.kube/config`.

Перевірте, що kubectl правильно налаштований, отримавши стан кластера:

```shell
kubectl cluster-info
```

Якщо у відповідь ви бачите URL, kubectl правильно налаштований для доступу до вашого кластера.

Якщо ви бачите повідомлення, подібне до наведеного нижче, kubectl налаштований неправильно або не може підʼєднатися до кластера Kubernetes.

```console
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Наприклад, якщо ви плануєте запускати кластер Kubernetes на своєму ноутбуці (локально), спочатку потрібно встановити інструмент на кшталт [Minikube](https://minikube.sigs.k8s.io/docs/start/), а потім повторно виконати наведені вище команди.

Якщо `kubectl cluster-info` повертає у відповідь URL, але ви не можете отримати доступ до кластера, перевірте, чи він правильно налаштований, за допомогою такої команди:

```shell
kubectl cluster-info dump
```

### Усунення несправностей із повідомленням про помилку 'No Auth Provider Found' {#no-auth-provider-found}

У Kubernetes 1.26 з kubectl вилучено вбудовану автентифікацію для керованих сервісів Kubernetes таких хмарних провайдерів. Ці провайдери випустили втулки kubectl, що забезпечують автентифікацію для їхніх хмар. Інструкції дивіться в документації провайдера:

* Azure AKS: [kubelogin plugin](https://azure.github.io/kubelogin/)
* Google Kubernetes Engine: [gke-gcloud-auth-plugin](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin)

Те саме повідомлення про помилку може мати й інші причини, не повʼязані з цією зміною.
