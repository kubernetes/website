---
title: "Встановлення інструментів"
description: Встановлення інструментів Kubernetes на ваш компʼютер.
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
Дивіться сторінку [Навчальне середовище](/docs/setup/learning-environment/) для налаштування середовища для практики.
{{< /note >}}

## kubectl

<!-- overview -->
Інструмент командного рядка Kubernetes, [kubectl](/docs/reference/kubectl/kubectl/), дозволяє вам виконувати команди відносно кластерів Kubernetes. Ви можете використовувати kubectl для розгортання застосунків, огляду та управління ресурсами кластера, а також перегляду логів. Для отримання додаткової інформації, включаючи повний перелік операцій kubectl, дивіться [Довідку `kubectl`](/docs/reference/kubectl/).

kubectl можна встановити на різноманітних платформах Linux, macOS та Windows. Знайдіть свою вибрану операційну систему нижче.

- [Встановлення kubectl на Linux](/docs/tasks/tools/install-kubectl-linux)
- [Встановлення kubectl на macOS](/docs/tasks/tools/install-kubectl-macos)
- [Встановлення kubectl на Windows](/docs/tasks/tools/install-kubectl-windows)

## kind

[`kind`](https://kind.sigs.k8s.io/) дозволяє вам запускати Kubernetes на вашому локальному компʼютері. Цей інструмент вимагає встановлення або [Docker](https://www.docker.com/), або [Podman](https://podman.io/).

На сторінці [Швидкий старт з kind](https://kind.sigs.k8s.io/docs/user/quick-start/) показано, що вам потрібно зробити, щоб розпочати роботу з kind.

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="Переглянути посібник Kind Get Started!">Переглянути посібник Швидкий старт з kind</a>

## minikube

Подібно до `kind`, [`minikube`](https://minikube.sigs.k8s.io/) — це інструмент, який дозволяє вам запускати Kubernetes локально. `minikube` запускає одно- або багатовузловий локальний кластер Kubernetes на вашому персональному компʼютері (включаючи ПК з операційними системами Windows, macOS і Linux), так щоб ви могли випробувати Kubernetes або використовувати його для щоденної розробки.

Якщо ваша основна мета — встановлення інструменту, ви можете скористатися офіційним посібником [Швидкий старт](https://minikube.sigs.k8s.io/docs/start/).

<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="Переглянути навчальний посібник Minikube Get Started!">Переглянути посібник Швидкий старт з Minikube</a>

Якщо у вас вже працює `minikube`, ви можете використовувати його для [запуску застосунку-прикладу](/docs/tutorials/hello-minikube/).

## kubeadm

Ви можете використовувати інструмент {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} для створення та управління кластерами Kubernetes. Він виконує необхідні дії для запуску мінімально життєздатного та захищеного кластера за допомогою зручного інтерфейсу користувача.

На сторінці [Встановлення kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) показано, як встановити kubeadm. Після встановлення ви можете використовувати його для [створення кластера](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

<a class="btn btn-primary" href="/uk/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="Переглянути посібник з встановлення kubeadm">Переглянути посібник з встановлення kubeadm</a>
