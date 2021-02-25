---
title: Narzędzia
content_type: concept
---

<!-- overview -->
Kubernetes zawiera różne wbudowane narzędzia służące do pracy z systemem:


<!-- body -->
## Kubectl

[`kubectl`](/docs/tasks/tools/install-kubectl/) to narzędzie tekstowe (linii poleceń) do Kubernetes. Służy do zarządzania klastrem Kubernetes.

## Kubeadm

[`kubeadm`](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) to narzędzie tekstowe do łatwej instalacji klastra Kubernetes w bezpiecznej konfiguracji, uruchamianego na infrastrukturze serwerów fizycznych, serwerów w chmurze bądź na maszynach wirtualnych (aktualnie w fazie rozwojowej alfa).

## Minikube

[`minikube`](https://minikube.sigs.k8s.io/docs/) to narzędzie do uruchamiania jednowęzłowego klastra Kubernetes na twojej stacji roboczej na potrzeby rozwoju oprogramowania lub prowadzenia testów.

## Pulpit *(Dashboard)*

[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/) - graficzny interfejs użytkownika w przeglądarce web, który umożliwia instalację aplikacji w kontenerach na klastrze Kubernetes, rozwiązywanie problemów z nimi związanych oraz zarządzanie samym klastrem i jego zasobami.

## Helm

[`Kubernetes Helm`](https://github.com/kubernetes/helm) — narzędzie do zarządzania pakietami wstępnie skonfigurowanych zasobów Kubernetes (nazywanych *Kubernetes charts*).

Helm-a można używać do:

* Wyszukiwania i instalowania popularnego oprogramowania dystrybuowanego jako Kubernetes *charts*
* Udostępniania własnych aplikacji w postaci pakietów Kubernetes *charts*
* Definiowania powtarzalnych instalacji aplikacji na Kubernetes
* Inteligentnego zarządzania plikami list (*manifests*) Kubernetes
* Zarządzaniem kolejnymi wydaniami pakietów Helm

## Kompose

[`Kompose`](https://github.com/kubernetes/kompose) to narzędzie, które ma pomóc użytkownikom Docker Compose przenieść się na Kubernetes.

Kompose można używać do:

* Tłumaczenia plików Docker Compose na obiekty Kubernetes
* Zmiany sposóbu zarządzania twoimi aplikacjami z lokalnego środowiska Docker na system Kubernetes
* Zamiany plików `yaml` Docker Compose v1 lub v2 oraz [Distributed Application Bundles](https://docs.docker.com/compose/bundles/)

