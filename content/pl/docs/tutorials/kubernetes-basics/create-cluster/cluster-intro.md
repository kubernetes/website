---
title: Jak użyć Minikube do stworzenia klastra
weight: 10
---

## {{% heading "objectives" %}}

* Dowiedz się, czym jest klaster Kubernetesa.
- Dowiedz się, czym jest Minikube.
* Uruchom klaster Kubernetesa.

## Klastry Kubernetesa {#kubernetes-clusters}

{{% alert %}}
_Kubernetes to platforma oprogramowania typu open source, gotowa do pracy w środowiskach produkcyjnych, która zarządza
rozmieszczeniem i uruchomieniem kontenerów zawierających aplikacje
na klastrach komputerowych._
{{% /alert %}}

**Zadaniem Kubernetesa jest zarządzanie klastrem komputerów o wysokiej dostępności, działającego jako jedna całość.**
Kubernetes, poprzez swój system obiektów
abstrakcyjnych, umożliwia uruchamianie aplikacji w kontenerach bez przypisywania ich do konkretnej
maszyny. Aby móc korzystać z tego nowego modelu instalacji, aplikacje muszą być
przygotowane w taki sposób, aby były niezależne od konkretnego serwera: muszą być
skonteneryzowane. Aplikacje w kontenerach są bardziej elastyczne przy instalacji, niż to miało
miejsce w poprzednich modelach, kiedy aplikacje były instalowane bezpośrednio na
konkretne maszyny jako pakiety ściśle powiązane z tą maszyną.
**Kubernetes automatyzuje dystrybucję i zlecanie uruchamiania aplikacji na klastrze w bardziej efektywny sposób.** Kubernetes jest
platformą otwartego oprogramowania, gotowym do pracy w środowiskach produkcyjnych.

Klaster Kubernetesa składa się z dwóch rodzajów zasobów:

* **Warstwa sterowania** koordynuje działanie klastra
* Na **węzłach _(nodes)_** uruchamiane są aplikacje

### Diagram klastra {#cluster-diagram}

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_01_cluster.svg" style="width: 100%;" >}}

**Warstwa sterowania odpowiada za zarządzanie klastrem.** Warstwa sterowania
koordynuje wszystkie działania klastra, takie jak zlecanie uruchomienia aplikacji,
utrzymywanie pożądanego stanu aplikacji, skalowanie aplikacji i instalowanie nowych wersji.

{{% alert %}}
_Warstwy sterowania zarządzają klastrem i węzłami, które są używane do hostowania
uruchomionych aplikacji._
{{% /alert %}}

**Węzeł to maszyna wirtualna (VM) lub fizyczny serwer, który jest maszyną roboczą w klastrze Kubernetesa.**
Na każdym węźle działa Kubelet, agent zarządzający tym węzłem i komunikujący
się z warstwą sterowania Kubernetesa. Węzeł zawiera także narzędzia do obsługi kontenerów,
takie jak {{< glossary_tooltip text="containerd" term_id="containerd" >}} lub
{{< glossary_tooltip term_id="cri-o" >}}. Klaster Kubernetesa w środowisku produkcyjnym powinien składać się
minimum z trzech węzłów, ponieważ w przypadku awarii jednego węzła traci się zarówno element
[etcd](/docs/concepts/architecture/#etcd), jak i warstwy sterowania przy jednoczesnym
zachowaniu minimalnej nadmiarowości (_redundancy_). Dodanie kolejnych węzłów warstwy sterowania może temu zapobiec.

Kiedy instalujesz aplikację na Kubernetesie, zlecasz warstwie sterowania
uruchomienie kontenera z aplikacją. Warstwa sterowania zleca uruchomienie kontenera
na węzłach klastra. **Komponenty działające na poziomie węzła, takie jak
kubelet, komunikują się z warstwą sterowania przy użyciu
[API Kubernetesa](/docs/concepts/overview/kubernetes-api/)**, udostępnianego poprzez warstwę sterowania.
Użytkownicy końcowi mogą korzystać bezpośrednio z API Kubernetesa do komunikacji z klastrem.

Klaster Kubernetesa może być zainstalowany zarówno na fizycznych, jak i na maszynach
wirtualnych. Aby wypróbować Kubernetesa, można też wykorzystać Minikube. Minikube to
"lekka" implementacja Kubernetesa, która tworzy VM na maszynie lokalnej i instaluje
prosty klaster składający się tylko z jednego węzła. Minikube jest dostępny na systemy Linux,
macOS i  Windows. Narzędzie linii poleceń Minikube obsługuje podstawowe
operacje na klastrze, takie jak start, stop, prezentacja informacji jego stanie i usunięcie klastra.

## {{% heading "whatsnext" %}}

* Samouczek [Hello Minikube](/docs/tutorials/hello-minikube/).
* Dowiedz się więcej o [architekturze klastra](/docs/concepts/architecture/).