---
title: "Встановлення інструментів"
description: Налаштування інструментів Kubernetes на вашому компʼютері.
weight: 10
no_list: true
card:
  name: tasks
  weight: 20
  anchors:
  - anchor: "#kubectl"
    title: Встановлення kubectl
---

{{< note >}}
Щоб налаштувати середовище для практики, дивіться сторінку [Навчальне середовище](/docs/setup/learning-environment/).
{{< /note >}}

## kubectl

<!-- overview -->
Інструмент командного рядка Kubernetes, [kubectl](/docs/reference/kubectl/kubectl/), дозволяє виконувати команди в кластерах Kubernetes. За допомогою kubectl можна розгортати застосунки, оглядати ресурси кластера й керувати ними, а також переглядати логи. Докладніше, зокрема повний перелік операцій kubectl, дивіться в [довідковій документації `kubectl`](/docs/reference/kubectl/).

kubectl можна встановити на різних платформах Linux, macOS і Windows. Виберіть свою операційну систему нижче.

- [Встановлення kubectl на Linux](/docs/tasks/tools/install-kubectl-linux)
- [Встановлення kubectl на macOS](/docs/tasks/tools/install-kubectl-macos)
- [Встановлення kubectl на Windows](/docs/tasks/tools/install-kubectl-windows)

## kind

[`kind`](https://kind.sigs.k8s.io/) дозволяє запускати Kubernetes на вашому локальному компʼютері. Для цього інструмента потрібно встановити [Docker](https://www.docker.com/) або [Podman](https://podman.io/).

На сторінці kind [Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) показано, що потрібно зробити, щоб почати працювати з kind.

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="Переглянути посібник kind Quick Start">Переглянути посібник kind Quick Start</a>

## minikube

Подібно до `kind`, [`minikube`](https://minikube.sigs.k8s.io/) — це інструмент, який дозволяє запускати Kubernetes локально. `minikube` запускає локальний кластер Kubernetes «все в одному» або багатовузловий кластер на вашому персональному компʼютері (зокрема на ПК з Windows, macOS і Linux), щоб ви могли випробувати Kubernetes або використовувати його для щоденної розробки.

Якщо ваша мета — встановити інструмент, скористайтеся офіційним посібником [Get Started!](https://minikube.sigs.k8s.io/docs/start/).

<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="Переглянути посібник minikube Get Started!">Переглянути посібник minikube Get Started!</a>

Коли `minikube` запрацює, ви зможете використовувати його для [запуску застосунку-прикладу](/docs/tutorials/hello-minikube/).

## kubeadm

Ви можете використовувати інструмент {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} для створення кластерів Kubernetes і керування ними. Він виконує дії, потрібні для зручного запуску мінімально життєздатного захищеного кластера.

На сторінці [Встановлення kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) показано, як встановити kubeadm. Після встановлення ви можете використовувати його для [створення кластера](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

<a class="btn btn-primary" href="/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="Переглянути посібник зі встановлення kubeadm">Переглянути посібник зі встановлення kubeadm</a>
