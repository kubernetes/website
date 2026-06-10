---
title: Посібники
linkTitle: Посібники
no_list: true
weight: 60
сontent_type: concept
---

<!-- overview -->

Цей розділ документації Kubernetes містить посібники. Посібник показує, як досягти мети, яка більша за одне [завдання](/docs/tasks/). Зазвичай посібник має кілька розділів, кожен з яких має послідовність кроків. Перед тим, як пройти кожен посібник, ви можете додати [сторінку глосарія](/docs/reference/glossary/) до закладок для подальших посилань.

<!-- body -->

## Основи {#basics}

* [Основи Kubernetes](/docs/tutorials/kubernetes-basics/) — це поглиблений інтерактивний посібник, який допомагає зрозуміти систему Kubernetes та спробувати деякі основні функції Kubernetes.
* [Вступ до Kubernetes (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)
* [Привіт Minikube](/docs/tutorials/hello-minikube/)

## Налаштування {#configuration}

* [Налаштування Redis за допомогою ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/)

## Створення Podʼів {#authoring-pods}

* [Використання контейнерів sidecar](/docs/tutorials/configuration/pod-sidecar-containers/)

## Stateless-застосунки {#stateless-applications}

* [Експонування зовнішньої IP-адреси для доступу до застосунку в кластері](/docs/tutorials/stateless-application/expose-external-ip-address/)
* [Приклад: Розгортання застосунку PHP Guestbook з Redis](/docs/tutorials/stateless-application/guestbook/)

## Stateful-застосунки {#stateful-applications}

* [Основи StatefulSet](/docs/tutorials/stateful-application/basic-stateful-set/)
* [Приклад: WordPress та MySQL з постійними томами](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)
* [Приклад: Розгортання Cassandra з Stateful Sets](/docs/tutorials/stateful-application/cassandra/)
* [Запуск ZooKeeper, розподіленої системи CP](/docs/tutorials/stateful-application/zookeeper/)

## Сервіси (Services) {#services}

* [Підключення застосунків за допомогою сервісів](/docs/tutorials/services/connect-applications-service/)
* [Використання IP-адреси джерела](/docs/tutorials/services/source-ip/)

## Безпека {#security}

* [Застосування стандартів безпеки Pod на рівні кластера](/docs/tutorials/security/cluster-level-pss/)
* [Застосування стандартів безпеки Pod на рівні простору імен (namespace)](/docs/tutorials/security/ns-level-pss/)
* [Обмеження доступу контейнера до ресурсів за допомогою AppArmor](/docs/tutorials/security/apparmor/)
* [Seccomp](/docs/tutorials/security/seccomp/)

## Керування кластером {#cluster-management}

* [Налаштування своп-памʼяті на вузлах Kubernetes](/docs/tutorials/cluster-management/provision-swap-memory/)
* [Запуск автономного Kublet](/docs/tutorials/cluster-management/kubelet-standalone/)
* [Встановлення драйверів та виділення пристроїв за допомогою DRA](/docs/tutorials/cluster-management/install-use-dra/)

## {{% heading "whatsnext" %}}

Якщо ви хочете написати посібник, див. [Типи сторінок](/docs/contribute/style/page-content-types/) для отримання інформації про типи сторінок посібника.
