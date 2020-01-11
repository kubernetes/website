---
title: Materiały źródłowe
linkTitle: "Materiały źródłowe"
main_menu: true
weight: 70
content_template: templates/concept
---

{{% capture overview %}}

Tutaj znajdziesz dokumentację źródłową Kubernetes.

{{% /capture %}}

{{% capture body %}}

## Dokumentacja API

* [Kubernetes API Overview](/docs/reference/using-api/api-overview/) - Ogólne informacje na temat Kubernetes API.
* Wersje Kubernetes API
  * [1.17](/docs/reference/generated/kubernetes-api/v1.17/)
  * [1.16](/docs/reference/generated/kubernetes-api/v1.16/)
  * [1.15](/docs/reference/generated/kubernetes-api/v1.15/)
  * [1.14](/docs/reference/generated/kubernetes-api/v1.14/)
  * [1.13](/docs/reference/generated/kubernetes-api/v1.13/)

## Biblioteki klientów API

Aby wywołać Kubernetes API z wybranego języka programowania, możesz skorzystać z
[bibliotek klienckich](/docs/reference/using-api/client-libraries/). Oficjalnie wspierane
biblioteki to:

* [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
* [Kubernetes Python client library](https://github.com/kubernetes-client/python)
* [Kubernetes Java client library](https://github.com/kubernetes-client/java)
* [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)

## Dokumentacja poleceń tekstowych *(CLI)*

* [kubectl](/docs/user-guide/kubectl-overview) - Główne narzędzie tekstowe (linii poleceń) do zarządzania klastrem Kubernetes.
  * [JSONPath](/docs/user-guide/jsonpath/) - Podręcznik składni [wyrażeń JSONPath](http://goessner.net/articles/JsonPath/) dla kubectl.
* [kubeadm](/docs/admin/kubeadm/) - Narzędzie tekstowe do łatwego budowania klastra Kubernetes spełniającego niezbędne wymogi bezpieczeństwa.
* [kubefed](/docs/admin/kubefed/) - Narzędzie tekstowe poleceń do zarządzania klastrami w federacji.

## Dokumentacja konfiguracji

* [kubelet](/docs/admin/kubelet/) - Główny agent działający na każdym węźle. Kubelet pobiera zestaw definicji PodSpecs i gwarantuje, że opisane przez nie kontenery poprawnie działają.
* [kube-apiserver](/docs/admin/kube-apiserver/) - REST API, które sprawdza poprawność i konfiguruje obiekty API, takie jak pody, serwisy czy kontrolery replikacji.
* [kube-controller-manager](/docs/admin/kube-controller-manager/) - Proces wykonujący główne pętle sterowania Kubernetes.
* [kube-proxy](/docs/admin/kube-proxy/) - Przekazuje bezpośrednio dane przepływające w transmisji TCP/UDP lub dystrybuuje ruch TCP/UDP zgodnie ze schematem *round-robin* pomiędzy usługi back-endu.
* [kube-scheduler](/docs/admin/kube-scheduler/) - Scheduler odpowiada za dostępność, wydajność i zasoby.

## Dokumentacja projektowa

Archiwum dokumentacji projektowej różnych funkcjonalności Kubernetes. Warto zacząć od [Kubernetes Architecture](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) oraz [Kubernetes Design Overview](https://git.k8s.io/community/contributors/design-proposals).

{{% /capture %}}
