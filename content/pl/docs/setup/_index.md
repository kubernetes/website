---
title: Od czego zacząć
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#srodowisko-do-nauki"
    title: Środowisko do nauki
  - anchor: "#srodowisko-produkcyjne"
    title: Środowisko produkcyjne  
---

<!-- overview -->

Ten rozdział poświęcony jest różnym metodom konfiguracji i uruchomienia Kubernetesa.
Instalując Kubernetesa, przy wyborze platformy kieruj się: łatwością w utrzymaniu, spełnianymi wymogami bezpieczeństwa, poziomem sterowania, dostępnością zasobów oraz doświadczeniem wymaganym do zarządzania klastrem.

Możesz [pobrać Kubernetesa](/releases/download/), aby zainstalować klaster
na lokalnym komputerze, w chmurze czy w prywatnym centrum obliczeniowym.

Niektóre [komponenty Kubernetesa](/docs/concepts/overview/components/), na przykład `{{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} czy {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} mogą być
uruchamiane jako [kontenery](/releases/download/#container-images) wewnątrz samego klastra.

**Zalecamy** uruchamianie komponentów Kubernetesa jako kontenery zawsze,
kiedy jest to możliwe i na zarządzanie nimi przez samego Kubernetesa.
Do tej kategorii nie należą komponenty odpowiedzialne za uruchamianie kontenerów, w szczególności - kubelet.

Jeśli nie chcesz zarządzać klastrem Kubernetesa samodzielnie, możesz wybrać serwis zarządzany przez zewnętrznego dostawcę,
wybierając na przykład spośród [certyfikowanych platform](/docs/setup/production-environment/turnkey-solutions/).
Dostępne są także inne standardowe i specjalizowane rozwiązania dla różnych środowisk chmurowych
bądź bazujące bezpośrednio na sprzęcie fizycznym.

<!-- body -->

## Środowisko do nauki {#srodowisko-do-nauki}

Do nauki Kubernetesa wykorzystaj narzędzia wspierane przez społeczność Kubernetesa
lub inne narzędzia dostępne w ekosystemie, aby uruchomić klaster Kubernetesa na swoim komputerze lokalnym.
Zapoznaj się z [narzędziami instalacyjnymi](/docs/tasks/tools/).

## Środowisko produkcyjne {#srodowisko-produkcyjne}

Wybierając rozwiązanie dla
[środowiska produkcyjnego](/docs/setup/production-environment/) musisz zdecydować,
którymi poziomami zarządzania klastrem (_abstrakcjami_) chcesz zajmować się sam,
a które będą realizowane po stronie zewnętrznego operatora.

Do instalacji klastra Kubernetesa zarządzanego samodzielnie oficjalnym narzędziem
jest [kubeadm](/docs/setup/production-environment/tools/kubeadm/).

## {{% heading "whatsnext" %}}

- [Pobierz Kubernetesa](/releases/download/)
- Pobierz i [zainstaluj narzędzia](/docs/tasks/tools/), w tym `kubectl`
- Wybierz [środowisko uruchomieniowe dla kontenerów](/docs/setup/production-environment/container-runtimes/) w nowym klastrze
- Naucz się [najlepszych praktyk](/docs/setup/best-practices/) przy konfigurowaniu klastra

Kubernetes zaprojektowano w ten sposób, że {{< glossary_tooltip term_id="control-plane" text="warstwa sterowania" >}}
wymaga do działania systemu Linux. W ramach klastra aplikacje mogą być uruchamiane na systemie Linux i innych,
w tym Windows.

- Naucz się, [jak zbudować klaster z węzłami Windows](/docs/concepts/windows/)
