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
  * [Dokumentacja źródłowa Kubernetes API {{< latest-version >}}](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/)

## Biblioteki klientów API

Aby wywołać Kubernetes API z wybranego języka programowania, możesz skorzystać z
[bibliotek klienckich](/docs/reference/using-api/client-libraries/). Oficjalnie wspierane
biblioteki to:

* [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
* [Kubernetes Python client library](https://github.com/kubernetes-client/python)
* [Kubernetes Java client library](https://github.com/kubernetes-client/java)
* [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)

## Dokumentacja poleceń tekstowych *(CLI)*

* [kubectl](/docs/reference/kubectl/overview/) - Główne narzędzie tekstowe (linii poleceń) do zarządzania klastrem Kubernetes.
  * [JSONPath](/docs/reference/kubectl/jsonpath/) - Podręcznik składni [wyrażeń JSONPath](http://goessner.net/articles/JsonPath/) dla kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/) - Narzędzie tekstowe do łatwego budowania klastra Kubernetes spełniającego niezbędne wymogi bezpieczeństwa.

## Dokumentacja konfiguracji

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - Główny agent działający na każdym węźle. Kubelet pobiera zestaw definicji PodSpecs i gwarantuje, że opisane przez nie kontenery poprawnie działają.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) - REST API, które sprawdza poprawność i konfiguruje obiekty API, takie jak pody, serwisy czy kontrolery replikacji.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) - Proces wykonujący główne pętle sterowania Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - Przekazuje bezpośrednio dane przepływające w transmisji TCP/UDP lub dystrybuuje ruch TCP/UDP zgodnie ze schematem *round-robin* pomiędzy usługi back-endu.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) - Scheduler odpowiada za dostępność, wydajność i zasoby.

## Dokumentacja projektowa

Archiwum dokumentacji projektowej różnych funkcjonalności Kubernetes. Warto zacząć od [Kubernetes Architecture](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) oraz [Kubernetes Design Overview](https://git.k8s.io/community/contributors/design-proposals).

{{% /capture %}}
