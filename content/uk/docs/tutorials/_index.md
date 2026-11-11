---
title: Навчальні посібники
main_menu: true
no_list: true
weight: 60
content_type: concept
---

<!-- overview -->

У цьому розділі документації Kubernetes зібрані навчальні посібники. Навчальний посібник показує, як досягти мети, що більша за одне [завдання](/docs/tasks/). Зазвичай навчальний посібник має декілька розділів, кожен з яких містить певну послідовність дій. До ознайомлення з навчальними посібниками вам, можливо, знадобиться додати у закладки сторінку зі [Стандартизованим глосарієм](/docs/reference/glossary/), щоб звертатися до неї пізніше.

<!-- body -->

## Основи {#basics}

* [Основи Kubernetes](/docs/tutorials/kubernetes-basics/) — детальний інтерактивний навчальний посібник, що допоможе вам зрозуміти систему Kubernetes і спробувати деякі базові функції Kubernetes.
* [Вступ до Kubernetes (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)
* [Привіт Minikube](/uk/docs/tutorials/hello-minikube/)

## Налаштування {#configuration}

* [Конфігурування Redis за допомогою ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/)

## Створення Podʼів {#authoring-pods}

* [Використання sidecar-контейнерів](/docs/tutorials/configuration/pod-sidecar-containers/)

## Застосунки без стану {#stateless-applications}

* [Відкриття зовнішньої IP-адреси для доступу до застосунку в кластері](/docs/tutorials/stateless-application/expose-external-ip-address/)
* [Приклад: Розгортання застосунку PHP Guestbook з Redis](/docs/tutorials/stateless-application/guestbook/)

## Застосунки зі станом {#stateful-applications}

* [Основи StatefulSet](/docs/tutorials/stateful-application/basic-stateful-set/)
* [Приклад: WordPress та MySQL із постійними томами](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)
* [Приклад: Розгортання Cassandra зі Stateful Sets](/docs/tutorials/stateful-application/cassandra/)
* [Запуск ZooKeeper, розподіленої CP-системи](/docs/tutorials/stateful-application/zookeeper/)

## Services {#services}

* [Підключення застосунків за допомогою Services](/docs/tutorials/services/connect-applications-service/)
* [Використання Source IP](/docs/tutorials/services/source-ip/)

## Безпека {#security}

* [Застосування стандартів безпеки Podʼів на рівні кластера](/docs/tutorials/security/cluster-level-pss/)
* [Застосування стандартів безпеки Podʼів на рівні простору імен](/docs/tutorials/security/ns-level-pss/)
* [Обмеження доступу контейнера до ресурсів за допомогою AppArmor](/docs/tutorials/security/apparmor/)
* [Seccomp](/docs/tutorials/security/seccomp/)

## Керування кластером {#cluster-management}

* [Запуск kubelet в автономному режимі](/docs/tutorials/cluster-management/kubelet-standalone/)
* [Налаштування своп-памʼяті на вузлах Kubernetes](/docs/tutorials/cluster-management/provision-swap-memory/)
* [Встановлення драйверів та виділення пристроїв за допомогою DRA](/docs/tutorials/cluster-management/install-use-dra/)
* [Ознайомлення з валідаційними та змінювальними політиками допуску](/docs/tutorials/cluster-management/admission-policies/)

## {{% heading "whatsnext" %}} {#what-s-next}

Якщо ви хочете написати навчальний посібник, ознайомтеся зі сторінкою [Типи вмісту сторінок](/docs/contribute/style/page-content-types/), щоб дізнатися більше про тип сторінки навчального посібника.
