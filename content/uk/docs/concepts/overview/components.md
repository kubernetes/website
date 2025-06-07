---
title: Компоненти Kubernetes
content_type: concept
description: >
  Огляд ключових компонентів, з яких складається кластер Kubernetes.
weight: 10
card:
  title: Компоненти кластера
  name: concepts
  weight: 20
---

<!-- overview -->

Ця сторінка містить огляд основних компонентів, з яких складається кластер Kubernetes.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Компоненти Kubernetes" caption="Компоненти кластера Kubernetes" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## Основні компоненти {#core-components}

Кластер Kubernetes складається з панелі управління та одного або декількох робочих вузлів. Ось короткий огляд основних компонентів:

## Компоненти панелі управління {#control-plane-components}

Керують загальним станом кластера:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: Сервер основних компонентів, який надає Kubernetes HTTP API

[etcd](/docs/concepts/architecture/#etcd)
: Узгоджене та високодоступне сховище значень ключів для всіх даних сервера API

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: Шукає ще не прикріплені до вузла Podʼи та призначає кожен Pod до відповідного вузла.

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: Запускає {{< glossary_tooltip text="контролери" term_id="controller" >}} для впровадження поведінки API Kubernetes.

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (необовʼязково)
: Інтегрується з інфраструктурою хмарного постачальника.

### Компоненти вузлів {#node-components}

Запускаються на кожному вузлі, підтримуючи запущені Podʼи та надаючи середовище виконання Kubernetes:

[kubelet](/docs/concepts/architecture/#kubelet)
: Забезпечує роботу Podʼів, включно з їхніми контейнерами.

[kube-proxy](/docs/concepts/architecture/#kube-proxy)
: Підтримує мережеві правила на вузлах для реалізації {{< glossary_tooltip text="Services" term_id="service" >}}.

[Рушій виконання контейнерів](/docs/concepts/architecture/#container-runtime)
: Програмне забезпечення для запуску контейнерів. Дивіться [Середовище виконання контейнерів](/docs/setup/production-environment/container-runtimes), щоб дізнатись більше.

## Надбудови {#addons}

Надбудови розширюють функціональність Kubernetes. Ось кілька важливих прикладів:

[DNS](/docs/concepts/architecture/#dns)
: Для перетворення адрес на назви на рівні всього кластера.

[Wеb UI](/docs/concepts/architecture/#web-ui-dashboard) (Dashboard)
: Вебінтерфейс для керування кластером Kubernetes.

[Container Resource Monitoring](/docs/concepts/architecture/#container-resource-monitoring)
: Збирає логи контейнерів в централізоване сховище логів.

## Гнучкість архітектури {#architecture-flexibility}

Kubernetes дозволяє гнучко розгортати та керувати цими компонентами. Архітектуру можна адаптувати до різних потреб, від невеликих середовищ розробки до великомасштабних виробничих розгортань.

Для отримання більш детальної інформації про кожен компонент та різні способи налаштування кластерної архітектури, дивись сторінку [Архітектура кластера](/docs/concepts/architecture/).
