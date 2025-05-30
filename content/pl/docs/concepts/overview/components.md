---
title: Składniki Kubernetesa
content_type: concept
description: >
  Omówienie głównych elementów tworzących klaster Kubernetesa.
weight: 10
card:
  title: Komponenty klastra
  name: concepts
  weight: 20
---



<!-- overview -->

Ta strona zawiera wysokopoziomy przegląd niezbędnych komponentów, które tworzą klaster Kubernetesa.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Komponenty Kubernetesa" caption="Komponenty klastra Kubernetesa" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## Składniki Kubernetesa {#core-components}

Klaster Kubernetesa składa się z warstwy sterowania oraz jednego
lub więcej węzłów roboczych. Oto krótki przegląd głównych komponentów:

### Części składowe warstwy sterowania {#control-plane-components}

Zarządzanie ogólnym stanem klastra:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: Podstawowy komponent udostępniający interfejs API Kubernetesa przez HTTP

[etcd](/docs/concepts/architecture/#etcd)
: Stabilna i wysoko dostępna baza danych typu klucz-wartość, wykorzystywana do przechowywania stanu całego klastra Kubernetesa.

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: Wyszukuje Pody, które nie zostały jeszcze przypisane do węzła, i przydziela każdy Pod do odpowiedniego węzła.

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: Uruchamia {{< glossary_tooltip text="kontrolery" term_id="controller" >}} realizujące logikę działania API Kubernetesa.

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (opcjonalne)
: Zapewnia integrację klastra Kubernetesa z infrastrukturą dostarczaną przez zewnętrznych dostawców chmurowych.

### Składniki węzłów {#node-components}

Działa na każdym węźle klastra, odpowiada za utrzymanie aktywnych podów oraz zapewnienie środowiska uruchomieniowego Kubernetesa:

[kubelet](/docs/concepts/architecture/#kubelet)
: Odpowiada za nadzorowanie, czy pody oraz ich kontenery są uruchomione i działają zgodnie z oczekiwaniami.

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (opcjonalne)
: Utrzymuje reguły sieciowe na węzłach w celu obsługi komunikacji z {{< glossary_tooltip text="usługami (ang. Service)" term_id="service" >}}.

[Środowisko uruchomieniowe kontenerów](/docs/concepts/architecture/#container-runtime)
: Oprogramowanie odpowiedzialne za uruchamianie kontenerów. Przeczytaj [Środowiska uruchomieniowe kontenerów](/docs/setup/production-environment/container-runtimes/), aby dowiedzieć się więcej.

{{% thirdparty-content single="true" %}}

Klaster może wymagać dodatkowego oprogramowania na każdym węźle; możesz na przykład uruchomić
[systemd](https://systemd.io/) na węzłach z systemem Linux do monitorowania i zarządzania lokalnymi usługami.

## Dodatki (Addons) {#addons}

Dodatki rozszerzają funkcjonalność Kubernetesa. Oto kilka ważnych przykładów:

[DNS](/docs/concepts/architecture/#dns)
: Umożliwia rozpoznawanie nazw DNS dla usług i komponentów działających w całym klastrze

[Web UI](/docs/concepts/architecture/#web-ui-dashboard) (Dashboard)
: Umożliwia zarządzanie klastrem Kubernetesa poprzez webowy interfejs.

[Monitorowanie zasobów kontenera](/docs/concepts/architecture/#container-resource-monitoring)
: Służy do monitorowania zasobów kontenerów poprzez gromadzenie i zapisywanie danych o ich wydajności.

[Logowanie na poziomie klastra](/docs/concepts/architecture/#cluster-level-logging)
: Umożliwia zbieranie i przechowywanie logów z kontenerów w centralnym systemie logowania dostępnym na poziomie całego klastra.

## Elastyczność architektury {#flexibility-in-architecture}

Dzięki elastycznej architekturze Kubernetesa można dostosować sposób
wdrażania i zarządzania poszczególnymi komponentami do konkretnych wymagań - od prostych
klastrów deweloperskich po złożone systemy produkcyjne na dużą skalę.

Szczegółowe informacje o każdym komponencie oraz różnych sposobach konfiguracji
architektury klastra znajdziesz na stronie [Architektura klastra](/docs/concepts/architecture/).
