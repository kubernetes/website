---
title: Materiały źródłowe
linkTitle: "Materiały źródłowe"
main_menu: true
weight: 70
content_type: concept
---

<!-- overview -->

Tutaj znajdziesz dokumentację źródłową Kubernetesa.

<!-- body -->

## Dokumentacja API

* [Dokumentacja źródłowa API Kubernetesa {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [Using The Kubernetes API](/docs/reference/using-api/) - ogólne informacje na temat API Kubernetesa.

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
  * [JSONPath](/docs/reference/kubectl/jsonpath/) - Podręcznik składni [wyrażeń JSONPath](https://goessner.net/articles/JsonPath/) dla kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/) - Narzędzie tekstowe do łatwego budowania klastra Kubernetes spełniającego niezbędne wymogi bezpieczeństwa.

## Dokumentacja komponentów

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - Główny agent działający na każdym węźle. Kubelet pobiera zestaw definicji PodSpecs i gwarantuje, że opisane przez nie kontenery poprawnie działają.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) - REST API, które sprawdza poprawność i konfiguruje obiekty API, takie jak pody, serwisy czy kontrolery replikacji.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) - Proces wykonujący główne pętle sterowania Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - Przekazuje bezpośrednio dane przepływające w transmisji TCP/UDP lub dystrybuuje ruch TCP/UDP zgodnie ze schematem *round-robin* pomiędzy usługi back-endu.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) - Scheduler odpowiada za dostępność, wydajność i zasoby.
* [kube-scheduler Policies](/docs/reference/scheduling/policies)
* [kube-scheduler Profiles](/docs/reference/scheduling/config#profiles)

## Dokumentacja projektowa

Archiwum dokumentacji projektowej różnych funkcjonalności Kubernetes. Warto zacząć od
[Kubernetes Architecture](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) oraz
[Kubernetes Design Overview](https://git.k8s.io/community/contributors/design-proposals).
