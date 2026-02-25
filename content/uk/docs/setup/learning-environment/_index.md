---
title: Навчальне середовище
weight: 20
---

Якщо ви вивчаєте Kubernetes, вам потрібно місце для практики. На цій сторінці описано варіанти налаштування середовища Kubernetes, де ви зможете експериментувати та навчатися.

<!-- body -->

## Встановлення kubectl {#installing-kubectl}

Перш ніж налаштовувати кластер, вам знадобиться інструмент командного рядка `kubectl`. Цей інструмент дозволяє вам спілкуватися з кластером Kubernetes і виконувати команди на ньому.

Інструкції з встановлення див. у розділі [Встановлення та налаштування kubectl](/docs/tasks/tools/#kubectl).

## Налаштування локальних середовищ Kubernetes {#setting-up-local-kubernetes-environments}

Виконання Kubernetes локально забезпечує безпечне середовище для навчання та експериментів. Ви можете створювати та знищувати кластери, не турбуючись про витрати та вплив на виробничі системи.

### kind

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) запускає кластери Kubernetes, використовуючи контейнери Docker як вузли. Він є легким і розроблений спеціально для тестування самого Kubernetes, але також чудово підходить для навчання.

Щоб розпочати роботу з kind, див. [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/).

### minikube

[minikube](https://minikube.sigs.k8s.io/) запускає одновузловий кластер Kubernetes на вашому локальному компʼютері. Він підтримує кілька середовищ виконання контейнерів і працює на Linux, macOS та Windows.

Щоб розпочати роботу з minikube, ознайомтеся з посібником [minikube Get Started](https://minikube.sigs.k8s.io/docs/start/).

### Інші локальні опції {#other-local-options}

{{% thirdparty-content single="true" %}}

Існує кілька сторонніх інструментів, які також можуть запускати Kubernetes локально. Kubernetes не надає підтримку для цих інструментів, але вони можуть добре підійти для ваших навчальних потреб:

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) може запускати локальний кластер Kubernetes
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) може запускати локальний кластер Kubernetes
- [Rancher Desktop](https://docs.rancherdesktop.io/) надає Kubernetes на вашому робочому столі
- [MicroK8s](https://canonical.com/microk8s) запускає легкий кластер Kubernetes
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local) запускає мінімальний кластер OpenShift локально (OpenShift є сумісним з Kubernets)

Інструкції з налаштування та підтримку дивіться в документації до кожного інструменту.

## Використання онлайн-майданчиків {#using-online-playgrounds}

{{% thirdparty-content single="true" %}}

Онлайн-майданчики Kubernetes дозволяють випробувати Kubernetes без встановлення будь-яких програм на компʼютері. Ці середовища працюють у вебоглядачі:

- **[Killercoda](https://killercoda.com/kubernetes)** надає інтерактивні сценарії Kubernetes та ігрове середовище
- **[Play with Kubernetes](https://labs.play-with-k8s.com/)** надає тимчасовий кластер Kubernetes у вашому оглядачі

Ці платформи корисні для швидких експериментів та виконання навчальних посібників без локального встановлення.

## Вправи з кластерами, подібними до промислових {#practicing-with-production-like-clusters}

Якщо ви хочете попрактикуватися в налаштуванні кластера, подібного до промислового, ви можете скористатися **kubeadm**. Налаштування кластера за допомогою kubeadm — це складне завдання, яке вимагає наявності декількох машин (фізичних або віртуальних) та ретельного конфігурування.

Щоб дізнатися більше про промислові середовища, див. [Промислове середовище](/docs/setup/production-environment/).

{{< note >}}
Налаштування кластера, схожого на промисловий, є значно складнішим, ніж налаштування навчальних середовищ, описаних вище. Почніть спочатку з kind, minikube або онлайн-майданчиків.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Дотримуйтесь інструкцій у підручнику [Hello Minikube](/docs/tutorials/hello-minikube/), щоб розгорнути свою першу програму в кластері.
- Дізнайтеся про [компоненти Kubernetes](/docs/concepts/overview/components/).
- Ознайомтеся з [командами kubectl](/docs/reference/kubectl/).
