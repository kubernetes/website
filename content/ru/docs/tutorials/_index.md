    ---
title: Руководства
main_menu: true
weight: 60
content_template: templates/concept
---

{{% capture overview %}}

В данном разделе документации Kubernetes можно найти руководства. В них рассказывается, как достичь определённой цели, а не просто выполнить одно задачу (/docs/tasks/). Большинство уроков состоит из нескольких разделов, каждый из которых включает в себя шаги для последовательного выполнения. Перед тем как приступить к выполнению уроков, может быть полезно ознакомиться со [словарем терминов](/docs/reference/glossary/) для последующих обращений.

{{% /capture %}}

{{% capture body %}}

## Основы

* [Основы Kubernetes](/docs/tutorials/kubernetes-basics/) - глубокое интерактивное руководство, направленное на понимание системы и предлагающее попробовать некоторые основные возможности Kubernetes.

* [Масштабируемые микросервисы с Kubernetes (Udacity)](https://www.udacity.com/course/scalable-microservices-with-kubernetes--ud615)

* [Введение в Kubernetes (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)

* [Hello Minikube](/docs/tutorials/hello-minikube/)

## Конфигурирование

* [Конфигурирование Redis с использованием ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/)

## Stateless приложения

* [Установка внешнего IP адреса для получения доступа к приложению в кластере](/docs/tutorials/stateless-application/expose-external-ip-address/)

* [Пример: развёртывание приложения "Гостевая книга" на PHP с использованием Redis](/docs/tutorials/stateless-application/guestbook/)

## Stateful приложения

* [Основы StatefulSet](/docs/tutorials/stateful-application/basic-stateful-set/)

* [Пример: WordPress и MySQL с персистентным хранилищем](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)

* [Пример: Развёртывание Cassandra с Stateful Sets](/docs/tutorials/stateful-application/cassandra/)

* [Запуск ZooKeeper, A CP Distributed System](/docs/tutorials/stateful-application/zookeeper/)

## CI/CD пайплайн

* [Настройка CI/CD пайплайна с Kubernetes Часть 1: Обзор](https://www.linux.com/blog/learn/chapter/Intro-to-Kubernetes/2017/5/set-cicd-pipeline-kubernetes-part-1-overview)

* [Настройка CI/CD пайплайна с подом Jenkins в Kubernetes (Часть 2)](https://www.linux.com/blog/learn/chapter/Intro-to-Kubernetes/2017/6/set-cicd-pipeline-jenkins-pod-kubernetes-part-2)

* [Запуск и масштабирование приложения распределённого кроссворда с CI/CD  в Kubernetes (Часть 3)](https://www.linux.com/blog/learn/chapter/intro-to-kubernetes/2017/6/run-and-scale-distributed-crossword-puzzle-app-cicd-kubernetes-part-3)

* [Настройка CI/CD для приложения распределённого кроссворда в Kubernetes (Часть 4)](https://www.linux.com/blog/learn/chapter/intro-to-kubernetes/2017/6/set-cicd-distributed-crossword-puzzle-app-kubernetes-part-4)

## Clusters

* [AppArmor](/docs/tutorials/clusters/apparmor/)

## Services

* [Использование IP](/docs/tutorials/services/source-ip/)

{{% /capture %}}

{{% capture whatsnext %}}

Если вы хотите создать руководство самостоятельно, обратитесь к странице [Использование шаблонов страниц](/docs/home/contribute/page-templates/), чтобы узнать информацию и посмотреть шаблоны для составления руководств.

{{% /capture %}}
