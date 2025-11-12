---
title: "Перевірка встановлення kubectl"
description: "Як перевірити встановлення kubectl."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Щоб kubectl знайшов та отримав доступ до кластера Kubernetes, вам потрібен
[файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), який створюється автоматично при створенні кластера за допомогою [kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) або успішного розгортання кластера Minikube. Типово конфігурація kubectl знаходиться в `~/.kube/config`.

Перевірте, що kubectl належним чином налаштований, отримавши стан кластера:

```shell
kubectl cluster-info
```

Якщо ви бачите у відповідь URL, kubectl налаштований на доступ до вашого кластера.

Якщо ви бачите повідомлення, подібне до наведеного нижче, kubectl не налаштований належним чином або не може приєднатися до кластера Kubernetes.

```console
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Наприклад, якщо ви плануєте запустити кластер Kubernetes на своєму ноутбуці (локально), вам спочатку потрібно встановити інструмент, такий як [Minikube](https://minikube.sigs.k8s.io/docs/start/), а потім повторно виконати вказані вище команди.

Якщо `kubectl cluster-info` повертає у відповідь URL, але ви не можете отримати доступ до свого кластера, щоб перевірити, чи він налаштований належним чином, скористайтесь наступною командою:

```shell
kubectl cluster-info dump
```

### Усунення несправностей повідомлення про помилку 'No Auth Provider Found' {#no-auth-provider-found}

У Kubernetes 1.26, kubectl видалив вбудовану автентифікацію для Kubernetes-кластерів керованих хмарними провайдерами. Ці провайдери випустили втулок для kubectl для надання хмарно-специфічної автентифікації. Для інструкцій див. документацію відповідного провайдера:

* Azure AKS: [kubelogin plugin](https://azure.github.io/kubelogin/)
* Google Kubernetes Engine: [gke-gcloud-auth-plugin](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin)

Також можуть бути інші причини для показу цього повідомлення про помилку, не повʼязані з цією зміною.
