---
title: Samouczki
main_menu: true
no_list: true
weight: 60
content_type: concept
---

<!-- overview -->

W tym rozdziale dokumentacji Kubernetes znajdziesz różne samouczki.
Dzięki nim dowiesz się, jak osiągnąć złożone cele, które przekraczają
wielkość pojedynczego [zadania](/docs/tasks/). Typowy samouczek podzielony
jest na kilka części, z których każda zawiera sekwencję odpowiednich
kroków. Przed zapoznaniem się z samouczkami warto stworzyć zakładkę do
[słownika](/docs/reference/glossary/), aby móc się później do niego na bieżąco odwoływać.

<!-- body -->

## Podstawy {#basics}

* [Podstawy Kubernetesa](/pl/docs/tutorials/kubernetes-basics/) (PL) to interaktywny samouczek, który pomoże zrozumieć system Kubernetes i wypróbować jego podstawowe możliwości.
* [Introduction to Kubernetes (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)
* [Hello Minikube](/pl/docs/tutorials/hello-minikube/) (PL)

## Konfiguracja {#configuration}

* [Configuring Redis Using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/)

## Tworzenie Podów {#authoring-pods}

* [Adopting Sidecar Containers](/docs/tutorials/configuration/pod-sidecar-containers/)

## Aplikacje bezstanowe *(Stateless Applications)* {#stateless-applications}

* [Exposing an External IP Address to Access an Application in a Cluster](/docs/tutorials/stateless-application/expose-external-ip-address/)
* [Example: Deploying PHP Guestbook application with Redis](/docs/tutorials/stateless-application/guestbook/)

## Aplikacje stanowe *(Stateful Applications)* {#stateful-applications}

* [StatefulSet Basics](/docs/tutorials/stateful-application/basic-stateful-set/)
* [Example: WordPress and MySQL with Persistent Volumes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)
* [Example: Deploying Cassandra with Stateful Sets](/docs/tutorials/stateful-application/cassandra/)
* [Running ZooKeeper, A CP Distributed System](/docs/tutorials/stateful-application/zookeeper/)

## Serwisy {#services}

* [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
* [Using Source IP](/docs/tutorials/services/source-ip/)

## Bezpieczeństwo {#security}

* [Apply Pod Security Standards at Cluster level](/docs/tutorials/security/cluster-level-pss/)
* [Apply Pod Security Standards at Namespace level](/docs/tutorials/security/ns-level-pss/)
* [Restrict a Container's Access to Resources with AppArmor](/docs/tutorials/security/apparmor/)
* [Seccomp](/docs/tutorials/security/seccomp/)

## Zarządzanie Klastrem {#cluster-management}

* [Configuring Swap Memory on Kubernetes Nodes](/docs/tutorials/cluster-management/provision-swap-memory/)
* [Running Kubelet in Standalone Mode](/docs/tutorials/cluster-management/kubelet-standalone/)
* [Install Drivers and Allocate Devices with DRA](/docs/tutorials/cluster-management/install-use-dra/)

## {{% heading "whatsnext" %}}

Jeśli chciałbyś napisać nowy samouczek, odwiedź
[Content Page Types](/docs/contribute/style/page-content-types/),
gdzie znajdziesz dodatkowe informacje o tym typie strony.
