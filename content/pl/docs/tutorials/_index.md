---
title: Samouczki
main_menu: true
weight: 60
content_template: templates/concept
---

{{% capture overview %}}

W tym rozdziale dokumentacji Kubernetes znajdziesz różne samouczki.
Dzięki nim dowiesz się, jak osiągnąć złożone cele, które przekraczają wielkość
pojedynczego [zadania](/docs/tasks/). Typowy samouczek podzielony jest na kilka części,
z których każda zawiera sekwencję odpowiednich kroków.
Przed zapoznaniem się z samouczkami warto stworzyć zakładkę do
[słownika](/docs/reference/glossary/), aby móc się później do niego na bieżąco odwoływać.

{{% /capture %}}

{{% capture body %}}

## Podstawy

* [Podstawy Kubernetes](/docs/tutorials/kubernetes-basics/) to interaktywny samouczek, który pomoże zrozumieć system Kubernetes i wypróbować jego podstawowe możliwości.

* [Introduction to Kubernetes (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)

* [Hello Minikube](/docs/tutorials/hello-minikube/)

## Konfiguracja

[Konfiguracja  serwera Redis z użyciem ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/)

## Aplikacje bezstanowe *(Stateless Applications)*

* [Exposing an External IP Address to Access an Application in a Cluster](/docs/tutorials/stateless-application/expose-external-ip-address/)

* [Example: Deploying PHP Guestbook application with Redis](/docs/tutorials/stateless-application/guestbook/)

## Aplikacje stanowe *(Stateful Applications)*

* [StatefulSet Basics](/docs/tutorials/stateful-application/basic-stateful-set/)

* [Example: WordPress and MySQL with Persistent Volumes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)

* [Example: Deploying Cassandra with Stateful Sets](/docs/tutorials/stateful-application/cassandra/)

* [Running ZooKeeper, A CP Distributed System](/docs/tutorials/stateful-application/zookeeper/)

## CI/CD Pipeline

* [Set Up a CI/CD Pipeline with Kubernetes Part 1: Overview](https://www.linux.com/blog/learn/chapter/Intro-to-Kubernetes/2017/5/set-cicd-pipeline-kubernetes-part-1-overview)

* [Set Up a CI/CD Pipeline with a Jenkins Pod in Kubernetes (Part 2)](https://www.linux.com/blog/learn/chapter/Intro-to-Kubernetes/2017/6/set-cicd-pipeline-jenkins-pod-kubernetes-part-2)

* [Run and Scale a Distributed Crossword Puzzle App with CI/CD on Kubernetes (Part 3)](https://www.linux.com/blog/learn/chapter/intro-to-kubernetes/2017/6/run-and-scale-distributed-crossword-puzzle-app-cicd-kubernetes-part-3)

* [Set Up CI/CD for a Distributed Crossword Puzzle App on Kubernetes (Part 4)](https://www.linux.com/blog/learn/chapter/intro-to-kubernetes/2017/6/set-cicd-distributed-crossword-puzzle-app-kubernetes-part-4)

## Klastry

* [AppArmor](/docs/tutorials/clusters/apparmor/)

## Serwisy

* [Using Source IP](/docs/tutorials/services/source-ip/)

{{% /capture %}}

{{% capture whatsnext %}}

Jeśli chciałbyś napisać nowy samouczek, zajrzyj na stronę
[Jak używać szablonów stron](/docs/home/contribute/page-templates/)
gdzie znajdziesz dodatkowe informacje na temat stron i szablonów samouczków.

{{% /capture %}}
