---
title: "Usługi, równoważenie obciążenia i sieci w Kubernetesie"
weight: 60
description: >
  Pojęcia i zasoby związane z siecią w Kubernetesie.
---

## Model sieciowy Kubernetesa {#the-kubernetes-network-model}

Model sieci Kubernetesa składa się z kilku części:

* Każdy [pod](/docs/concepts/workloads/pods/)
  otrzymuje swój własny unikalny adres IP w całym klastrze.

  * Pod ma swoją własną, prywatną przestrzeń nazw sieci, która jest
    współdzielona przez wszystkie kontenery w ramach tego
    poda. Procesy działające w różnych kontenerach w tym samym
    podzie mogą komunikować się ze sobą za pośrednictwem `localhost`.

* _Sieć podów_ (znana również jako sieć klastra) obsługuje komunikację
  między podami. Zapewnia, że (z zastrzeżeniem celowego segmentowania sieci):

  * Wszystkie pody mogą komunikować się ze wszystkimi innymi podami,
    niezależnie od tego, czy znajdują się na tym samym
    [węźle](/docs/concepts/architecture/nodes/), czy na różnych węzłach. Pody mogą
    komunikować się ze sobą bezpośrednio, bez użycia proxy ani translacji adresów (NAT).

    W systemie Windows ta reguła nie dotyczy podów z siecią hosta.

  * Agenci na węźle (takie jak demony systemowe czy
    kubelet) mogą komunikować się ze wszystkimi podami na tym węźle.

* Obiekt API [Service](/docs/concepts/services-networking/service/)
  pozwala na udostępnienie stabilnego (długoterminowego) adresu IP lub nazwy
  hosta dla usługi zrealizowanej przez jeden lub więcej backendowych podów, gdzie
  poszczególne pody składające się na usługę mogą zmieniać się w czasie.

  * Kubernetes automatycznie zarządza obiektami
    [EndpointSlice](/docs/concepts/services-networking/endpoint-slices/) aby
    dostarczać informacje o Podach obsługujących daną usługę.

  * Implementacja proxy serwisu monitoruje zestaw obiektów Service i EndpointSlice,
    a także konfiguruje warstwę danych w celu
    kierowania ruchu serwisowego do jego backendów, używając API systemu
    operacyjnego lub dostawcy chmury do przechwytywania lub przepisania pakietów.

* Obiekt API [Gateway](/docs/concepts/services-networking/gateway/)
  (lub jego poprzednik, [Ingress](/docs/concepts/services-networking/ingress/)
  ) umożliwia udostępnienie usług klientom znajdującym się poza klastrem.

  * Prostszy, ale mniej konfigurowalny mechanizm dostępu do klastra (Ingress) jest
    dostępny za pośrednictwem API usług (Service) z wykorzystaniem opcji
    [`type: LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer), pod warunkiem
    korzystania z obsługiwanego dostawcy chmury ({{< glossary_tooltip term_id="cloud-provider">}}).

* [NetworkPolicy](/docs/concepts/services-networking/network-policies)
  to wbudowane API Kubernetesa, które pozwala na
  kontrolowanie ruchu pomiędzy podami, lub pomiędzy podami a światem zewnętrznym.

W starszych systemach kontenerowych nie było automatycznej łączności pomiędzy
kontenerami na różnych hostach, więc często konieczne było jawne
tworzenie połączeń między kontenerami lub mapowanie portów
kontenerów na porty hostów, aby były osiągalne przez kontenery na
innych hostach. W Kubernetesie nie jest to potrzebne; model Kubernetesa
polega na tym, że pody mogą być traktowane podobnie jak maszyny
wirtualne lub fizyczne hosty z perspektyw alokacji portów, nazewnictwa,
wykrywania usług, równoważenia obciążenia, konfiguracji aplikacji i migracji.

Tylko kilka części tego modelu jest implementowanych
przez Kubernetesa samodzielnie. Dla pozostałych części
Kubernetes definiuje API, ale odpowiadającą funkcjonalność
zapewniają zewnętrzne komponenty, z których niektóre są opcjonalne:

* Konfiguracja przestrzeni nazw sieci poda jest obsługiwana przez oprogramowanie systemowe implementujące
  [Interfejs Uruchomieniowy Kontenera (ang. Container Runtime Interface)](/docs/concepts/containers/cri/).

* Sama sieć podów jest zarządzana przez
  [implementację sieci podów](/docs/concepts/cluster-administration/addons/#networking-and-network-policy).
  W systemie Linux, większość środowisk
  uruchomieniowych kontenerów używa {{< glossary_tooltip text="Container Networking Interface (CNI)" term_id="cni" >}}
  do interakcji z implementacją sieci
  podów, dlatego te implementacje często nazywane są _wtyczkami CNI_.

* Kubernetes dostarcza domyślną implementację proxy usług,
  nazywaną {{< glossary_tooltip term_id="kube-proxy">}}, ale
  niektóre implementacje sieciowe poda używają zamiast tego własnego
  proxy usług, które jest ściślej zintegrowane z resztą implementacji.

* NetworkPolicy jest zazwyczaj również implementowane przez
  implementację sieci poda. (Niektóre prostsze implementacje sieci poda nie
  implementują NetworkPolicy, lub administrator może zdecydować się na
  skonfigurowanie sieci poda bez wsparcia dla NetworkPolicy. W takich
  przypadkach API będzie nadal obecne, ale nie będzie miało żadnego efektu.)

* Istnieje wiele [implementacji Gateway API](https://gateway-api.sigs.k8s.io/implementations/),
  z których niektóre są specyficzne dla określonych środowisk
  chmurowych, inne bardziej skupione na środowiskach "bare metal", a jeszcze inne bardziej ogólne.

## {{% heading "whatsnext" %}}

Samouczek [Łączenie aplikacji z usługami](/docs/tutorials/services/connect-applications-service/)
pozwala na naukę o Usługach i sieciach Kubernetesa poprzez praktyczne przykłady.

Dokumentacja [Sieci Klastra](/docs/concepts/cluster-administration/networking/) wyjaśnia, jak
skonfigurować sieć dla twojego klastra, a także dostarcza przegląd użytych technologii.
