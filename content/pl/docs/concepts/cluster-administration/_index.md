---
title: Administracja klastrem
weight: 100
content_type: concept
description: >
  Niskopoziomowe szczegóły istotne dla tworzenia i administracji klastrem Kubernetesa.
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#securing-a-cluster"
    title: Zabezpieczanie klastra
---




<!-- overview -->

Rozdział dotyczący administracji klastrem jest przeznaczony dla każdego, kto tworzy lub zarządza
klastrem Kubernetesa. Zakłada się pewną znajomość podstawowych [pojęć](/docs/concepts/) Kubernetesa.

<!-- body -->

## Planowanie klastra {#planning-a-cluster}

Zobacz przewodniki w [Od czego zacząć](/docs/setup/) zawierające przykłady planowania, konfiguracji
i uruchamiania klastrów Kubernetes. Rozwiązania wymienione w tym artykule nazywane są *dystrybucjami*.

{{< note  >}}
Nie wszystkie dystrybucje są aktywnie utrzymywane. Wybierz
dystrybucje, które zostały przetestowane z aktualną wersją Kubernetesa.
{{< /note >}}

Rozważ:

- Czy chcesz wypróbować Kubernetesa na swoim komputerze, czy może chcesz zbudować klaster o
  wysokiej dostępności, złożony z wielu węzłów? Wybierz dystrybucję najlepiej dostosowaną do Twoich potrzeb.
- Czy będziesz korzystać z **hostowanego klastra Kubernetesa**, takiego jak
  [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/), czy też **hostować własny klaster**?
- Czy Twój klaster będzie **w lokalnym centrum obliczeniowym (on-premises)**, czy **w chmurze (IaaS)**?
  Kubernetes nie obsługuje bezpośrednio klastrów hybrydowych. Zamiast tego, możesz skonfigurować wiele klastrów.
- **Jeśli konfigurujesz Kubernetesa lokalnie**, zastanów się, który
  [model sieciowy](/docs/concepts/cluster-administration/networking/) pasuje najlepiej.
- Czy będziesz uruchamiać Kubernetesa na sprzęcie typu **"bare metal"** czy na **maszynach wirtualnych (VM)**?
- Czy **chcesz uruchomić klaster**, czy raczej zamierzasz prowadzić
  **aktywny rozwój kodu projektu Kubernetes**? Jeśli to drugie, wybierz dystrybucję aktywnie rozwijaną.
  Niektóre dystrybucje używają tylko wydań binarnych, ale oferują większą różnorodność wyboru.
- Zapoznaj się z [komponentami](/docs/concepts/overview/components/) potrzebnymi do uruchomienia klastra.

## Zarządzanie klastrem {#managing-a-cluster}

* Dowiedz się, jak [zarządzać węzłami](/docs/concepts/architecture/nodes/).
  * Przeczytaj o [automatycznym skalowaniu węzłów](/docs/concepts/cluster-administration/node-autoscaling/).

* Dowiedz się, jak skonfigurować i zarządzać [przydziałem zasobów](/docs/concepts/policy/resource-quotas/) dla współdzielonych klastrów.

## Zabezpieczanie klastra {#securing-a-cluster}

* [Generowanie Certyfikatów](/docs/tasks/administer-cluster/certificates/) opisuje
  kroki generowania certyfikatów z użyciem różnych zestawów narzędzi.

* [Środowisko Kontenerów Kubernetesa](/docs/concepts/containers/container-environment/)
  opisuje środowisko dla zarządzanych przez Kubelet kontenerów na węźle Kubernetesa.

* [Kontrola dostępu do API Kubernetesa](/docs/concepts/security/controlling-access)
  opisuje, jak Kubernetes implementuje kontrolę dostępu do swojego API.

* [Uwierzytelnianie](/docs/reference/access-authn-authz/authentication/)
  wyjaśnia uwierzytelnianie w Kubernetesie, w tym różne opcje uwierzytelniania.

* [Autoryzacja](/docs/reference/access-authn-authz/authorization/) jest
  oddzielona od uwierzytelniania i kontroluje, w jaki sposób obsługiwane są wywołania HTTP.

* [Korzystanie z kontrolerów dopuszczania (Admission Controllers)](/docs/reference/access-authn-authz/admission-controllers/)
  opisuje wtyczki, które
  przechwytują żądania do serwera API Kubernetesa po uwierzytelnieniu i autoryzacji.

* Dokument [Dobre Praktyki dla Admission Webhooks](/docs/concepts/cluster-administration/admission-webhooks-good-practices/)
  opisuje zalecane podejście i ważne aspekty, które należy
  uwzględnić przy tworzeniu webhooków modyfikujących oraz wehbooków walidujących w Kubernetesie.

* [Używanie Sysctls w klastrach Kubernetesa](/docs/tasks/administer-cluster/sysctl-cluster/)
  opisuje administratorowi, jak używać
  narzędzia wiersza polecenia `sysctl` do ustawiania parametrów jądra.

* [Audyt](/docs/tasks/debug/debug-cluster/audit/)
  opisuje, jak współpracować z logami audytowymi Kubernetesa.

### Zabezpieczanie kubeleta {#securing-the-kubelet}

* [Komunikacja warstwy sterowania z węzłem](/docs/concepts/architecture/control-plane-node-communication/)
* [TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
* [Uwierzytelnianie/autoryzacja Kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/)

## Opcjonalne usługi klastra {#optional-cluster-services}

* [Integracja DNS](/docs/concepts/services-networking/dns-pod-service/)
  opisuje, jak rozwiązać nazwę DNS bezpośrednio do usługi Kubernetesa.

* [Logowanie i monitorowanie aktywności klastra](/docs/concepts/cluster-administration/logging/)
  wyjaśnia, jak działa logowanie w Kubernetesie i jak je zaimplementować.

