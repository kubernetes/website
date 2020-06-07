---
no_issue: true
title: Od czego zacząć
main_menu: true
weight: 20
content_template: templates/concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#srodowisko-do-nauki"
    title: Środowisko do nauki
  - anchor: "#srodowisko-produkcyjne"
    title: Środowisko produkcyjne  
---

{{% capture overview %}}

Ten rozdział poświęcony jest różnym metodom konfiguracji i uruchomienia Kubernetesa.

Istnieje wiele rozwiązań dopasowanych do różnych potrzeb użytkowników: łatwości w utrzymaniu, wymagań bezpieczeństwa, poziomu sterowania, dostępności zasobów oraz niezbędnego doświadczenia do zarządzania klastrem.

Klaster Kubernetes możesz zainstalować na lokalnym komputerze, w chmurze czy w prywatnym centrum obliczeniowym albo skorzystać z klastra Kubernetes udostępnianego jako usługa. Inną możliwością jest budowa własnego rozwiązania opartego o różnych dostawców usług chmurowych, bądź bazującego bezpośrednio na sprzęcie fizycznym.

W dużym uproszczeniu, możesz zbudować klaster Kubernetes zarówno w środowisku szkoleniowym, jak i na potrzeby produkcyjne.

{{% /capture %}}

{{% capture body %}}

## Środowisko do nauki {#srodowisko-do-nauki}

Aby uruchomić klaster Kubernetes do nauki na lokalnym komputerze, skorzystaj z rozwiązań opartych o Dockera — z narzędzi wspieranych przez społeczność Kubernetesa, bądź innych narzędzi dostępnych w ekosystemie.

{{< table caption="Tabela z rozwiązaniami pozwalającymi na uruchomienie Kubernetesa na komputerze lokalnym - wspieranymi przez społeczność lub innymi dostępnymi w ekosystemie" >}}

|Społeczność           |Ekosystem     |
| ------------       | --------     |
| [Minikube](/docs/setup/learning-environment/minikube/) | [Docker Desktop](https://www.docker.com/products/docker-desktop)|
| [kind (Kubernetes IN Docker)](/docs/setup/learning-environment/kind/) | [Minishift](https://docs.okd.io/latest/minishift/)|
|                     | [MicroK8s](https://microk8s.io/)|

## Środowisko produkcyjne {#srodowisko-produkcyjne}

Wybierając rozwiązanie dla środowiska produkcyjnego musisz zdecydować, którymi poziomami zarządzania klastrem (_abstrakcjami_) chcesz zajmować się sam, a które będą realizowane po stronie zewnętrznego operatora.

Na stronie [Partnerzy Kubernetes](https://kubernetes.io/partners/#conformance) znajdziesz listę dostawców posiadających [certyfikację Kubernetes](https://github.com/cncf/k8s-conformance/#certified-kubernetes).

{{% /capture %}}
