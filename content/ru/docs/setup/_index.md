---
title: Начало работы
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: Среда обучения
  - anchor: "#production-environment"
    title: Производственная среда
---

<!-- overview -->

В этом разделе описаны различные способы установки и запуска Kubernetes.
При установке Kubernetes выбирайте подходящий вариант с учётом удобства обслуживания,
безопасности, возможностей управления, доступных ресурсов и опыта, необходимого для эксплуатации кластера.

Вы можете [скачать Kubernetes](/releases/download/), чтобы развернуть кластер Kubernetes
на локальной машине, в облаке или в собственном центре обработки данных.

Некоторые [компоненты Kubernetes](/docs/concepts/overview/components/), например {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} или {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}, также можно
развернуть в кластере в виде [образов контейнеров](/ru/releases/download/#образы-контейнеров).

**Рекомендуется** по возможности запускать компоненты Kubernetes в виде образов контейнеров
и поручать Kubernetes управление этими компонентами.
Компоненты, запускающие контейнеры, в частности kubelet, к этой категории не относятся.

Если вы не хотите управлять кластером Kubernetes самостоятельно, можно выбрать управляемый сервис,
в том числе [сертифицированную платформу](/docs/setup/production-environment/turnkey-solutions/).
Существуют и другие стандартные и пользовательские решения для различных облачных сред
и физических серверов.

<!-- body -->

## Среда обучения {#learning-environment}

Если вы изучаете Kubernetes, используйте инструменты, поддерживаемые сообществом Kubernetes,
или инструменты из его экосистемы, чтобы создать кластер Kubernetes на локальной машине.
См. раздел [Среда обучения](/docs/setup/learning-environment/).

## Производственная среда {#production-environment}

При выборе решения для
[производственной среды](/docs/setup/production-environment/) определите, какими аспектами
эксплуатации кластера Kubernetes (или _абстракциями_) вы хотите управлять самостоятельно,
а какие предпочитаете передать провайдеру.

Для самостоятельно управляемого кластера официально поддерживаемым инструментом
развёртывания Kubernetes является [kubeadm](/docs/setup/production-environment/tools/kubeadm/).

## {{% heading "whatsnext" %}}

- [Скачайте Kubernetes](/releases/download/).
- Скачайте и [установите инструменты](/docs/tasks/tools/), включая `kubectl`.
- Выберите [среду выполнения контейнеров](/docs/setup/production-environment/container-runtimes/) для нового кластера.
- Ознакомьтесь с [рекомендациями](/docs/setup/best-practices/) по настройке кластера.

Kubernetes спроектирован так, чтобы его {{< glossary_tooltip term_id="control-plane" text="управляющий слой" >}}
работал в Linux. Внутри кластера можно запускать приложения в Linux или других операционных системах,
включая Windows.

- Узнайте, как [настроить кластеры с узлами Windows](/docs/concepts/windows/).
