---
no_issue: true
title: Od czego zacząć
main_menu: true
weight: 20
content_type: concept
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

Klaster Kubernetes możesz zainstalować na lokalnym komputerze, w chmurze czy w prywatnym centrum obliczeniowym albo skorzystać z klastra Kubernetes udostępnianego jako usługa. Inną możliwością jest budowa własnego systemu opartego o różnych dostawców usług chmurowych, bądź bazującego bezpośrednio na sprzęcie fizycznym.

<!-- body -->

## Środowisko do nauki {#srodowisko-do-nauki}

Do nauki Kubernetesa wykorzystaj narzędzia wspierane przez społeczność Kubernetesa lub inne narzędzia dostępne w ekosystemie, aby uruchomić klaster Kubernetesa na swoim komputerze lokalnym.

## Środowisko produkcyjne {#srodowisko-produkcyjne}

Wybierając rozwiązanie dla środowiska produkcyjnego musisz zdecydować, którymi poziomami zarządzania klastrem (_abstrakcjami_) chcesz zajmować się sam, a które będą realizowane po stronie zewnętrznego operatora.

Na stronie [Partnerzy Kubernetes](https://kubernetes.io/partners/#conformance) znajdziesz listę dostawców posiadających [certyfikację Kubernetes](https://github.com/cncf/k8s-conformance/#certified-kubernetes).
