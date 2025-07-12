---
title: "Architektura klastra"
weight: 30
description: >
  Podstawowe założenia architektury Kubernetesa.
---

Klaster Kubernetesa składa się z warstwy sterowania oraz zestawu maszyn roboczych, zwanych węzłami, które
uruchamiają konteneryzowane aplikacje. Każdy klaster potrzebuje co najmniej jednego węzła roboczego, aby obsługiwać Pody.

Węzeł roboczy hostuje Pody, które są komponentami _workload_ aplikacji. Warstwa
sterowania zarządza węzłami roboczymi oraz Podami w klastrze. W środowiskach
produkcyjnych, warstwa sterowania zazwyczaj działa na wielu komputerach, a klaster
zazwyczaj działa na wielu węzłach, zapewniając odporność na awarie i wysoką dostępność.

Ten dokument opisuje różne komponenty, które musisz posiadać, aby mieć kompletny i działający klaster Kubernetesa.

{{< figure src="/images/docs/kubernetes-cluster-architecture.svg" alt="Warstwa sterowania (kube-apiserver, etcd, kube-controller-manager, kube-scheduler) oraz kilka węzłów. Każdy węzeł uruchamia kubelet i kube-proxy." caption="Rysunek 1. Komponenty klastra Kubernetesa." class="diagram-large" >}}

{{< details summary="About this architecture" >}}
Diagram na Rysunku 1 przedstawia przykładową referencyjną architekturę klastra Kubernetesa.
Rzeczywisty rozkład komponentów może różnić się w zależności od specyficznych konfiguracji klastra i wymagań.

Na schemacie każdy węzeł uruchamia komponent [`kube-proxy`](#kube-proxy).
Potrzebujesz komponentu sieciowego proxy na każdym węźle, aby
zapewnić, że API {{< glossary_tooltip text="Service" term_id="service">}} i
związane z nim zachowania są dostępne w sieci klastra. Niektóre wtyczki
sieciowe jednak dostarczają własne, zewnętrzne implementacje proxy. Kiedy
korzystasz z tego rodzaju wtyczki sieciowej, węzeł nie musi uruchamiać `kube-proxy`.
{{< /details >}}

## Komponenty warstwy sterowania {#control-plane-components}

Komponenty warstwy sterowania podejmują globalne decyzje dotyczące klastra (na
przykład harmonogramowanie), a także wykrywają i reagują na zdarzenia klastra (na
przykład uruchamianie nowego {{< glossary_tooltip text="poda" term_id="pod">}} gdy nie
zgadza się liczba `{{< glossary_tooltip text="replik" term_id="replica">}}` Deploymentu.

Elementy warstwy sterowania mogą być uruchamiane na dowolnej maszynie w klastrze. Jednakże, dla uproszczenia, skrypty
instalacyjne zazwyczaj uruchamiają wszystkie elementy warstwy sterowania na tej samej maszynie i nie uruchamiają kontenerów
użytkownika na tej maszynie. Zobacz [Tworzenie klastrów o wysokiej dostępności za pomocą kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
dla przykładowej konfiguracji warstwy sterowania, która działa na wielu maszynach.

### kube-apiserver {#kube-apiserver}

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd {#etcd}

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler {#kube-scheduler}

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager {#kube-controller-manager}

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Istnieje wiele różnych typów kontrolerów. Niektóre z nich to:

- Kontroler węzłów (ang. Node controller): Odpowiada za zauważanie i reagowanie, gdy węzły przestają działać.
- Kontroler zadania (ang. Job controller): Monitoruje obiekty zadania (Job), które reprezentują jednorazowe zadania, a następnie tworzy Pody, aby wykonały te zadania do końca.
- Kontroler EndpointSlice: Uzupełnia obiekty EndpointSlice (aby zapewnić połączenie między Services a Pods).
- Kontroler ServiceAccount: Tworzenie domyślnych obiektów ServiceAccount dla nowych przestrzeni nazw.

Powyższa lista nie jest wyczerpującą.

### cloud-controller-manager {#cloud-controller-manager}

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

Manager 'cloud-controller' uruchamia tylko kontrolery specyficzne dla dostawcy
chmury. Jeśli uruchamiasz Kubernetesa w swojej siedzibie lub w środowisku do
nauki na swoim komputerze osobistym, klaster nie posiada managera 'cloud-controller'.

Podobnie jak kube-controller-manager, cloud-controller-manager łączy kilka logicznie niezależnych
pętli kontrolnych w jedną binarkę, którą uruchamiasz jako pojedynczy proces. Możesz go skalować
horyzontalnie (uruchamiając więcej niż jedną kopię), aby poprawić wydajność lub pomóc w tolerowaniu awarii.

Następujące kontrolery mogą mieć zależności od dostawcy chmury:

- Kontroler węzłów (ang. Node controller): Do sprawdzania dostawcy chmury w
  celu ustalenia, czy węzeł został usunięty w chmurze po tym, jak przestaje odpowiadać.
- Kontroler tras (ang. Route controller): Do konfiguracji tras w podstawowej infrastrukturze chmurowej.
- Kontroler usługi (ang. Service controller): Do tworzenia, aktualizowania i usuwania load balancerów dostawcy chmury.

---

## Komponenty węzła {#node-components}

Komponenty węzła działają na każdym węźle, utrzymując działające pody i zapewniając środowisko wykonawcze Kubernetesa.

### kubelet {#kubelet}

{{< glossary_definition term_id="kubelet" length="all" >}}

### `kube-proxy` (opcjonalne) {#kube-proxy}

{{< glossary_definition term_id="kube-proxy" length="all" >}} Jeśli
używasz [wtyczki sieciowej](#network-plugins), która samodzielnie
implementuje przekazywanie pakietów dla Usług i zapewnia równoważne działanie
do kube-proxy, to nie musisz uruchamiać kube-proxy na węzłach w swoim klastrze.

### Środowisko uruchomieniowe kontenera {#container-runtime}

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Dodatki {#addons}

Dodatki (ang. Addons) wykorzystują zasoby Kubernetesa
({{< glossary_tooltip term_id="daemonset" >}}, {{< glossary_tooltip term_id="deployment" >}},
itp.) do wdrażania funkcji klastra. Ponieważ zapewniają one
funkcje na poziomie klastra, zasoby te należą do przestrzeni nazw `kube-system`.

Wybrane dodatki są opisane poniżej; aby uzyskać rozszerzoną listę
dostępnych dodatków, zobacz [Dodatki](/docs/concepts/cluster-administration/addons/).

### DNS {#dns}

Podczas gdy inne dodatki nie są ściśle wymagane, wszystkie klastry Kubernetes powinny mieć
[DNS klastra](/docs/concepts/services-networking/dns-pod-service/), ponieważ wiele elementów na nim polega.

Cluster DNS to serwer DNS, będący uzupełnieniem dla innych serwerów
DNS w Twoim środowisku, który obsługuje rekordy DNS dla usług Kubernetes.

Kontenery uruchamiane przez Kubernetesa automatycznie uwzględniają ten serwer DNS w swoich wyszukiwaniach DNS.

### Interfejs Web UI (Dashboard) {#web-ui-dashboard}

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) to uniwersalny interfejs
internetowy dla klastrów Kubernetesa. Umożliwia użytkownikom zarządzanie
i rozwiązywanie problemów z aplikacjami działającymi w klastrze, a także samym klastrem.

### Monitorowanie zasobów kontenerów {#container-resource-monitoring}

[Monitorowanie Zasobów Kontenera](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/) rejestruje ogólne
metryki dotyczące kontenerów w centralnej bazie danych i udostępnia interfejs użytkownika do przeglądania tych danych.

### Rejestrowanie na poziomie klastra {#cluster-level-logging}

Mechanizm [logowania na poziomie klastra](/docs/concepts/cluster-administration/logging/) jest
odpowiedzialny za zapisywanie logów z kontenerów w centralnym magazynie logów z interfejsem do przeszukiwania/przeglądania.

### Wtyczki sieciowe {#network-plugins}

[Wtyczki sieciowe](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins)
są komponentami oprogramowania, które implementują
specyfikację interfejsu sieciowego kontenera (CNI). Są odpowiedzialne za
przydzielanie adresów IP do podów i umożliwianie im komunikacji między sobą w klastrze.

## Warianty architektury {#architecture-variations}

Podczas gdy podstawowe komponenty Kubernetesa pozostają niezmienne, sposób ich
wdrażania i zarządzania może się różnić. Zrozumienie tych wariacji jest kluczowe dla
projektowania i utrzymania klastrów Kubernetesa, które spełniają określone potrzeby operacyjne.

### Opcje wdrażania warstwy sterowania {#control-plane-deployment-options}

Komponenty warstwy sterowania mogą być wdrażane na kilka sposobów:

Tradycyjna implementacja: : Komponenty warstwy sterowania działają bezpośrednio na
dedykowanych maszynach lub maszynach wirtualnych (VM), często zarządzane jako usługi systemd.

Statyczne Pody: : Komponenty warstwy sterowania są wdrażane jako
statyczne Pody, zarządzane przez kubelet na określonych węzłach.
Jest to powszechne podejście stosowane przez narzędzia takie jak kubeadm.

Samodzielnie hostowane : Warstwa sterowania działa jako Pody
wewnątrz samego klastra Kubernetes, zarządzane
przez Deploymenty i StatefulSety lub inne obiekty Kubernetesa.

Zarządzane usługi Kubernetesa: Dostawcy usług chmurowych zazwyczaj
ukrywają warstwę kontrolną, zarządzając jej elementami w ramach swoich usług.

### Rozważania dotyczące umieszczania workloadów {#workload-placement-considerations}

Umiejscowienie workloadów, w tym komponentów warstwy sterowania, może różnić się w
zależności od wielkości klastra, wymagań dotyczących wydajności i polityk operacyjnych:

- W mniejszych klastrach lub klastrach deweloperskich, komponenty warstwy sterowania i workloady użytkowników mogą działać na tych samych węzłach.
- Większe klastry produkcyjne często dedykują określone węzły dla
  komponentów warstwy sterowania, oddzielając je od workloadów użytkowników.
- Niektóre organizacje uruchamiają krytyczne dodatki lub narzędzia monitorujące na węzłach warstwy sterowania.

### Narzędzia do zarządzania klastrem {#cluster-management-tools}

Narzędzia takie jak kubeadm, kops i Kubespray oferują różne podejścia do wdrażania i
zarządzania klastrami, z których każde ma własną metodę rozmieszczenia i zarządzania komponentami.

Elastyczność architektury Kubernetesa umożliwia organizacjom dostosowanie ich klastrów do
specyficznych potrzeb, balansując czynniki takie jak złożoność operacyjna, wydajność i narzut na zarządzanie.

### Dostosowywanie i rozszerzalność {#customization-and-extensibility}

Architektura Kubernetesa pozwala na szeroką konfigurację:

- Niestandardowe schedulery mogą być wdrażane do pracy wraz z domyślnym schedulerem Kubernetesa lub aby całkowicie go zastąpić.
- Serwery API mogą być rozszerzane za pomocą CustomResourceDefinitions i agregacji API.
- Dostawcy chmury mogą mocno integrować się z Kubernetesem używając `cloud-controller-manager`.

Elastyczność architektury Kubernetesa umożliwia organizacjom dostosowanie ich klastrów do
specyficznych potrzeb, balansując czynniki takie jak złożoność operacyjna, wydajność i narzut na zarządzanie.

## {{% heading "whatsnext" %}}

Dowiedz się więcej na temat:

- [Węzły](/docs/concepts/architecture/nodes/) i
  [ich komunikacja](/docs/concepts/architecture/control-plane-node-communication/) z
  warstwą sterowania.
- [Kontrolery Kubernetesa](/docs/concepts/architecture/controller/).
- [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/), czyli domyślny scheduler dla Kubernetesa.
- Oficjalna [dokumentacja](https://etcd.io/docs/) Etcd.
- Wiele [środowisk uruchomieniowych kontenerów](/docs/setup/production-environment/container-runtimes/) w Kubernetesie.
- Integracja z dostawcami chmury za pomocą [cloud-controller-manager](/docs/concepts/architecture/cloud-controller/).
- Polecenia [kubectl](/docs/reference/generated/kubectl/kubectl-commands).
