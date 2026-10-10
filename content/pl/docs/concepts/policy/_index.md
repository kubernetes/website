---
title: "Polityki"
weight: 90
no_list: true
description: >
  Stosuj polityki do zarządzania bezpieczeństwem i wdrażania najlepszych praktyk.
---

<!-- overview -->

Polityki Kubernetesa to ustawienia kontrolujące inne konfiguracje lub sposób działania aplikacji w trakcie ich działania. Kubernetes oferuje różne formy polityk, opisane poniżej:

<!-- body -->

## Stosowanie polityk za pomocą obiektów API {#apply-policies-using-api-objects}

 Niektóre obiekty API spełniają rolę polityk. Oto kilka przykładów:
* [NetworkPolicies](/docs/concepts/services-networking/network-policies/) mogą być używane do ograniczania ruchu przychodzącego i wychodzącego dla workload.
* [LimitRanges](/docs/concepts/policy/limit-range/) zarządzają ograniczeniami alokacji zasobów w różnych typach obiektów.
* [ResourceQuotas](/docs/concepts/policy/resource-quotas/) ogranicza zużycie zasobów dla {{< glossary_tooltip text="namespace" term_id="namespace" >}}.

## Stosowanie polityk za pomocą kontrolerów dopuszczania (ang. Admission Controllers) {#apply-policies-using-admission-controllers}

Kontroler dopuszczania (ang. Admission Controller - {{< glossary_tooltip text="admission controller" term_id="admission-controller" >}}
) działa na serwerze API i może weryfikować lub modyfikować żądania API. Niektóre takie
kontrolery działają w celu zastosowania polityk. Na przykład kontroler
[AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) modyfikuje nowy Pod, aby ustawić politykę pobierania obrazów na `Always`.

Kubernetes ma kilka wbudowanych kontrolerów dostępu, które można konfigurować za pomocą flagi `--enable-admission-plugins` serwera API.

Szczegóły dotyczące kontrolerów dopuszczania są udokumentowane w dedykowanej sekcji:

* [Kontrolery dopuszczania (ang. Admission Controllers)](/docs/reference/access-authn-authz/admission-controllers/)

## Stosowanie polityk używając ValidatingAdmissionPolicy {#apply-policies-using-validatingadmissionpolicy}

Polityki walidacji przyjmowania (ang. Validating admission policies) umożliwiają wykonywanie konfigurowalnych kontroli walidacji na serwerze API przy użyciu wspólnego języka wyrażeń (CEL). Na przykład, `ValidatingAdmissionPolicy` może być używana do zakazania użycia tagu obrazu `latest`.

Polityka `ValidatingAdmissionPolicy` działa na żądaniach API i może być używana do blokowania, audytowania oraz ostrzegania użytkowników o niezgodnych konfiguracjach.

Szczegóły dotyczące API `ValidatingAdmissionPolicy`, wraz z przykładami, są udokumentowane w dedykowanej sekcji:
* [Walidacja Polityki Dopuszczania (ang. Validating Admission Policy)](/docs/reference/access-authn-authz/validating-admission-policy/)


## Stosowanie polityk przy użyciu dynamicznej kontroli dostępu {#apply-policies-using-dynamic-admission-control}

Dynamiczne kontrolery dostępu (lub webhooki dostępu) działają poza serwerem API jako oddzielne aplikacje, które rejestrują się do odbierania żądań webhooków w celu przeprowadzania weryfikacji lub modyfikacji żądań API. 

Dynamiczne kontrolery dopuszczeń mogą być używane do stosowania polityk na żądaniach API i uruchamiania innych procesów opartych na politykach. Dynamiczny kontroler dopuszczeń może przeprowadzać skomplikowane kontrole, w tym te, które wymagają pobierania innych zasobów klastra i danych zewnętrznych. Na przykład, kontrola weryfikacji obrazu może wyszukiwać dane z rejestrów OCI, aby zatwierdzić podpisy i atestacje obrazów kontenerów.

Szczegóły dotyczące dynamicznej kontroli dostępu są udokumentowane w dedykowanej sekcji:
* [Dynamiczne Sterowanie Dostępem](/docs/reference/access-authn-authz/extensible-admission-controllers/)

### Implementacje {#implementations-admission-control}

{{% thirdparty-content %}}

Dynamiczne kontrolery dopuszczeń (Admission Controllers), które działają jako elastyczne silniki polityki, są rozwijane w ekosystemie Kubernetesa:
- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
- [Polaris](https://polaris.docs.fairwinds.com/admission-controller/)

## Stosowanie zasad za pomocą konfiguracji Kubelet {#apply-policies-using-kubelet-configurations}

Kubernetes pozwala na konfigurowanie Kubelet na każdym węźle roboczym. Niektóre konfiguracje Kubelet działają jako polityki:
* [Limity i rezerwacje identyfikatorów procesów](/docs/concepts/policy/pid-limiting/) są używane do ograniczania i rezerwacji dostępnych PID-ów.
* [Menedżery zasobów węzła](/docs/concepts/policy/node-resource-managers/) mogą zarządzać zasobami obliczeniowymi, pamięci oraz urządzeniami dla workloadów krytycznych pod względem opóźnień i o wysokiej przepustowości.
