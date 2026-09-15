---
title: Компоненты Kubernetes
content_type: concept
description: >
  Обзор основных компонентов кластера Kubernetes.
weight: 10
theme_lock: light
card:
  title: Компоненты кластера
  name: concepts
  weight: 20
---

<!-- overview -->

На этой странице в общих чертах описываются различные компоненты, необходимые для работы кластера Kubernetes.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Компоненты Kubernetes" caption="Компоненты кластера Kubernetes" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## Основные компоненты

Кластер Kubernetes состоит из управляющего слоя и одного или нескольких рабочих узлов.
Ниже приведён краткий обзор основных компонентов:

### Компоненты управляющего слоя

Управляют общим состоянием кластера:

[kube-apiserver](https://kubernetes.io/docs/concepts/architecture/#kube-apiserver)
: Основной серверный компонент, предоставляющий HTTP API Kubernetes.

[etcd](https://kubernetes.io/docs/concepts/architecture/#etcd)
: Консистентное и высокодоступное хранилище данных в формате «ключ-значение» для всех данных API-сервера.

[kube-scheduler](https://kubernetes.io/docs/concepts/architecture/#kube-scheduler)
: Отслеживает поды без назначенного для них узла и назначает каждому поду подходящий узел.

[kube-controller-manager](https://kubernetes.io/docs/concepts/architecture/#kube-controller-manager)
: Запускает {{< glossary_tooltip text="контроллеры" term_id="controller" >}} для реализации поведения API Kubernetes.

[cloud-controller-manager](https://kubernetes.io/docs/concepts/architecture/#cloud-controller-manager) (необязательный компонент)
: Обеспечивает интеграцию с используемыми облачными провайдерами.

### Компоненты узла

Компоненты узла работают на каждом узле, поддерживая работу подов и обеспечивая среду выполнения Kubernetes:

[kubelet](https://kubernetes.io/docs/concepts/architecture/#kubelet)
: Обеспечивает работу подов, включая их контейнеры.

[kube-proxy](https://kubernetes.io/docs/concepts/architecture/#kube-proxy) (необязательный компонент)
: Поддерживает сетевые правила на узлах для реализации {{< glossary_tooltip text="сервисов" term_id="service" >}}.

[Среда выполнения контейнера](https://kubernetes.io/docs/concepts/architecture/#container-runtime)
: Программное обеспечение, предназначенное для запуска контейнеров. Подробнее читайте на странице
  [Среды выполнения контейнеров](/docs/setup/production-environment/container-runtimes/).

{{% thirdparty-content single="true" %}}

Вашему кластеру может потребоваться дополнительное программное обеспечение на каждом узле; например,
на узле Linux можно также запустить [systemd](https://systemd.io/) для управления локальными компонентами.

## Дополнения

Дополнения расширяют функциональность Kubernetes. Вот несколько важных примеров:

[DNS](https://kubernetes.io/docs/concepts/architecture/#dns)
: Для разрешения DNS-имён во всём кластере.

[Веб-интерфейс](https://kubernetes.io/docs/concepts/architecture/#web-ui-dashboard) (Dashboard)
: Для управления кластером через веб-интерфейс.

[Мониторинг ресурсов контейнера](https://kubernetes.io/docs/concepts/architecture/#container-resource-monitoring)
: Для сбора и хранения метрик контейнеров.

[Логирование кластера](https://kubernetes.io/docs/concepts/architecture/#cluster-level-logging)
: Для сохранения логов контейнера в централизованном хранилище логов.

## Гибкость архитектуры

Kubernetes позволяет гибко подходить к развёртыванию этих компонентов и управлению ими.
Архитектуру можно адаптировать к различным потребностям: от небольших сред разработки
до масштабных развёртываний в производственной среде.

Более подробную информацию о каждом компоненте и различных способах настройки архитектуры
кластера смотрите на странице [Кластерная архитектура](https://kubernetes.io/docs/concepts/architecture/).
