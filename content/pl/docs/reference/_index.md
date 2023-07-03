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

* [Glossary](/docs/reference/glossary/) -  Pełna, zestandaryzowana lista terminologii Kubernetesa

* [Kubernetes API Reference](/docs/reference/kubernetes-api/)
* [One-page API Reference for Kubernetes {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [Using The Kubernetes API](/docs/reference/using-api/) - ogólne informacje na temat API Kubernetesa
* [API access control](/docs/reference/access-authn-authz/) - szczegóły dotyczące kontroli dostępu do API Kubernetesa
* [Well-Known Labels, Annotations and Taints](/docs/reference/labels-annotations-taints/)

## Oficjalnie wspierane biblioteki klienckie

Aby wywołać Kubernetes API z wybranego języka programowania, możesz skorzystać z
[bibliotek klienckich](/docs/reference/using-api/client-libraries/). Oficjalnie wspierane
biblioteki to:

* [Kubernetes Python client library](https://github.com/kubernetes-client/python)
* [Kubernetes Java client library](https://github.com/kubernetes-client/java)
* [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)
* [Kubernetes C# client library](https://github.com/kubernetes-client/csharp)
* [Kubernetes Haskell client library](https://github.com/kubernetes-client/haskell)

## Polecenia tekstowe *(CLI)*

* [kubectl](/docs/reference/kubectl/) - Główne narzędzie tekstowe (linii poleceń) do zarządzania klastrem Kubernetes.
  * [JSONPath](/docs/reference/kubectl/jsonpath/) - Podręcznik składni [wyrażeń JSONPath](https://goessner.net/articles/JsonPath/) dla kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/) - Narzędzie tekstowe do łatwego budowania klastra Kubernetes spełniającego niezbędne wymogi bezpieczeństwa.

## Komponenty

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - Główny
  agent działający na każdym węźle. Kubelet pobiera zestaw definicji PodSpecs
  i gwarantuje, że opisane przez nie kontenery poprawnie działają.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) -
  REST API, które sprawdza poprawność i konfiguruje obiekty API, takie jak pody, serwisy czy kontrolery replikacji.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) - Proces wykonujący główne pętle sterowania Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - Przekazuje
  bezpośrednio dane przepływające w transmisji TCP/UDP lub dystrybuuje ruch TCP/UDP
  zgodnie ze schematem *round-robin* pomiędzy usługi back-endu.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) - Scheduler odpowiada za dostępność, wydajność i zasoby.
* [Scheduler Policies](/docs/reference/scheduling/policies)
* [Scheduler Profiles](/docs/reference/scheduling/config#profiles)

* Spis [portów i protokołów](/docs/reference/ports-and-protocols/), które
  muszą być otwarte dla warstwy sterowania i na węzłach roboczych.

## API konfiguracji

W tej części zebrano "niepublikowane" API, które służą do konfiguracji komponentów
Kubernetesa lub innych narzędzi. Choć większość tych API nie jest udostępniane przez
serwer API w trybie RESTful, są one niezbędne dla użytkowników i administratorów
w korzystaniu i zarządzaniu klastrem.

* [kube-apiserver configuration (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/)
* [kube-apiserver configuration (v1)](/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver encryption (v1)](/docs/reference/config-api/apiserver-encryption.v1/)
* [kube-apiserver event rate limit (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet configuration (v1alpha1)](/docs/reference/config-api/kubelet-config.v1alpha1/) oraz
  [kubelet configuration (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/)
* [kubelet credential providers (v1alpha1)](/docs/reference/config-api/kubelet-credentialprovider.v1alpha1/)
* [kubelet credential providers (v1beta1)](/docs/reference/config-api/kubelet-credentialprovider.v1beta1/)
* [kube-scheduler configuration (v1beta2)](/docs/reference/config-api/kube-scheduler-config.v1beta2/) oraz
  [kube-scheduler configuration (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/)
* [kube-proxy configuration (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/docs/reference/config-api/apiserver-audit.v1/)
* [Client authentication API (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/) oraz
  [Client authentication API (v1)](/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission configuration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API (v1alpha1)](/docs/reference/config-api/imagepolicy.v1alpha1/)

## API konfiguracji dla kubeadm

* [v1beta2](/docs/reference/config-api/kubeadm-config.v1beta2/)
* [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)

## Dokumentacja projektowa

Archiwum dokumentacji projektowej różnych funkcjonalności Kubernetes. Warto zacząć od
[Kubernetes Architecture](https://git.k8s.io/design-proposals-archive/architecture/architecture.md) oraz
[Kubernetes Design Overview](https://git.k8s.io/design-proposals-archive).
