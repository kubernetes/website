---
title: Ссылки
approvers:
- chenopis
linkTitle: "Ссылки"
main_menu: true
weight: 70
content_type: concept
---

<!-- overview -->

Этот раздел документации Kubernetes содержит ссылки.



<!-- body -->

## Ссылки API

* [Обзор Kubernetes API](/docs/reference/using-api/api-overview/) - Обзор API для Kubernetes.
* Версии Kubernetes API
  * [1.17](/docs/reference/generated/kubernetes-api/v1.17/)
  * [1.16](/docs/reference/generated/kubernetes-api/v1.16/)
  * [1.15](/docs/reference/generated/kubernetes-api/v1.15/)
  * [1.14](/docs/reference/generated/kubernetes-api/v1.14/)
  * [1.13](/docs/reference/generated/kubernetes-api/v1.13/)
  * [1.12](/docs/reference/generated/kubernetes-api/v1.12/)

## Клиентские библиотеки API

Для вызова API Kubernetes из языка программирования вы можете использовать
[клиентские библиотеки](/docs/reference/using-api/client-libraries/). Официально поддерживаемые клиентские библиотеки:

- [Клиентская библиотека Go](https://github.com/kubernetes/client-go/)
- [Клиентская библиотека Python](https://github.com/kubernetes-client/python)
- [Клиентская библиотека Java](https://github.com/kubernetes-client/java)
- [Клиентская библиотека JavaScript](https://github.com/kubernetes-client/javascript)

## Ссылки CLI

* [kubectl](/docs/user-guide/kubectl-overview) - Основной инструмент CLI для запуска команд и управления кластерами Kubernetes.
* [JSONPath](/docs/user-guide/jsonpath/) - Документация по синтаксису использования [выражений JSONPath](http://goessner.net/articles/JsonPath/) с kubectl.
* [kubeadm](/docs/admin/kubeadm/) - Инструмент CLI для легкого разворачивания защищенного кластера Kubernetes.
* [kubefed](/docs/admin/kubefed/) - Инструмент CLI для помощи в администрировании федеративных кластеров.

## Ссылки на конфигурации

* [kubelet](/docs/admin/kubelet/) - Основной *агент ноды*, который работает на каждой ноде. Kubelet принимает набор PodSpecs и гарантирует, что описанные контейнеры работают исправно.
* [kube-apiserver](/docs/admin/kube-apiserver/) - REST API, который проверяет и настраивает данные для объектов API, таких, как модули, службы, контроллеры и репликации.
* [kube-controller-manager](/docs/admin/kube-controller-manager/) - Демон, который встраивает основные контрольные циклы, поставляемые с Kubernetes.
* [kube-proxy](/docs/admin/kube-proxy/) - Может выполнять простую пересылку запросов TCP/UDP или циклическую переадресацию TCP/UDP через набор бекендов.
* [kube-scheduler](/docs/admin/kube-scheduler/) - Планировщик, который управляет доступностью, производительностью и хранилищем.
* [federation-apiserver](/docs/admin/federation-apiserver/) - Сервер API для федеративных кластеров.
* [federation-controller-manager](/docs/admin/federation-controller-manager/) - Демон, который встраивает основные контрольные циклы, поставляемые с Kubernetes.

## Дизайн документация

Архив документации по дизайну для функциональности Kubernetes. Начните с [Архитектуры Kubernetes](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) и [Обзора дизайна Kubernetes](https://git.k8s.io/community/contributors/design-proposals).


