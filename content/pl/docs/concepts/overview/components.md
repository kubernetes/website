---
title: Składniki Kubernetes
content_template: templates/concept
weight: 20
card: 
  name: concepts
  weight: 20
---

{{% capture overview %}}
W wyniku instalacji Kubernetes otrzymujesz klaster.

{{< glossary_definition term_id="cluster" length="all" prepend="Klaster Kubernetes to">}}

W tym dokumencie opisujemy składniki niezbędne do zbudowania kompletnego, poprawnie działającego klastra Kubernetes.

Poniższy rysunek przedstawia klaster Kubernetes i powiązania pomiędzy jego różnymi częściami składowymi.

![Składniki Kubernetes](/images/docs/components-of-kubernetes.png)
{{% /capture %}}

{{% capture body %}}
## Częsci składowe warstwy sterowania

Komponenty warstwy sterowania podejmują ogólne decyzje dotyczące klastra (np. zlecanie zadań), a także wykrywają i reagują na zdarzenia w klastrze (przykładowo, start nowego {{< glossary_tooltip text="poda" term_id="pod">}}, kiedy wartość `replicas` dla deploymentu nie zgadza się z faktyczną liczbą replik).

Komponenty warstwy sterowania mogą być uruchomione na dowolnej maszynie w klastrze. Dla uproszczenia jednak skrypty instalacyjne zazwyczaj startują wszystkie składniki na tej samej maszynie i jednocześnie nie pozwalają na uruchamianie na niej kontenerów użytkowników. Na stronie [Tworzenie Wysoko Dostępnych Klastrów](/docs/admin/high-availability/) jest więcej informacji o konfiguracji typu *multi-master-VM*.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Kontrolerami są:

* Node controller: Odpowiada za rozpoznawanie i reagowanie na sytuacje, kiedy węzeł staje się z jakiegoś powodu niedostępny.
* Replication controller: Odpowiada za utrzymanie prawidłowej liczby podów dla każdego obiektu typu *ReplicationController* w systemie.
* Endpoints controller: Dostarcza informacji do obiektów typu *Endpoints* (tzn. łączy ze sobą Serwisy i Pody).
* Service Account & Token controllers: Tworzy domyślne konta i tokeny dostępu API dla nowych przestrzeni nazw (*namespaces*).

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

cloud-controller-manager uruchamia jedynie kontrolery właściwe dla konkretnego dostawcy usług chmurowych.
Jeśli uruchamiasz Kubernetesa we własnym centrum komputerowym lub w środowisku szkoleniowym na swoim
komputerze, klaster nie będzie miał cloud controller managera.

Podobnie jak w przypadku kube-controller-manager, cloud-controller-manager łączy w jednym pliku binarnym
kilka niezależnych pętli sterowania. Można go skalować horyzontalnie
(uruchomić więcej niż jedną instancję), aby poprawić wydajność lub zwiększyć odporność na awarie.

Następujące kontrolery mogą zależeć od dostawców usług chmurowych:

* Node controller: Aby sprawdzić u dostawcy usługi chmurowej, czy węzeł został skasowany po tym, jak przestał odpowiadać
* Route controller: Aby ustawić trasy *(routes)* w niższych warstwach infrastruktury chmurowej
* Service controller: Aby tworzyć, aktualizować i kasować *cloud load balancers*

## Składniki węzłów

Składniki węzłów uruchomiane są na każdym węźle. Utrzymują pody w działaniu i ustawiają środowisko uruchomieniowe Kubernetes.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### Container Runtime

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Dodatki (*Addons*) {#dodatki}

Dodatki korzystają z podstawowych obiektów Kubernetes ({{< glossary_tooltip term_id="daemonset" >}}, {{< glossary_tooltip term_id="deployment" >}}, itp.), aby rozszerzyć funkcjonalności klastra. Ponieważ są to funkcjonalności obejmujące cały klaster, zasoby te należą do przestrzeni nazw *(namespace)* `kube-system`.

Wybrane dodatki opisano poniżej. Rozszerzona lista dostępnych dodatków jest w części [Dodatki](/docs/concepts/cluster-administration/addons/).

### DNS

Mimo, że inne dodatki nie są bezwzględnie wymagane, wszystkie klastry Kubernetes powinny mieć [cluster DNS](/docs/concepts/services-networking/dns-pod-service/), ponieważ wiele przykładów z niego korzysta.

*Cluster DNS* to serwer DNS, który uzupełnienia inne serwery DNS z twojego środowiska, dostarczając informacje o rekordach DNS dla usług Kubernetes.

Kontenery uruchomione przez Kubernetes automatycznie przeszukują ten serwer DNS.

### Interfejs użytkownika (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) to webowy interfejs ogólnego zastosowania przeznaczony dla użytkowników klastra Kubernetes. Umożliwia zarządzanie i rozwiązywanie problemów związanych z aplikacjami uruchamianymi na klastrze, a także z samym klastrem.

### Monitorowanie zasobów w kontenerach

[Container Resource Monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring/) zapisuje serie czasowe podstawowych metryk kontenerów w centralnej bazie danych i oferuje interfejs użytkownika do przeglądania tych danych.

### Logowanie na poziomie klastra

Mechanizm [logowania na poziomie klastra](/docs/concepts/cluster-administration/logging/) odpowiada za zapisywanie logów pochodzących z poszczególnych kontenerów do wspólnego magazynu, który posiada interfejs do przeglądania i przeszukiwania.

{{% /capture %}}
{{% capture whatsnext %}}
* Więcej o [Węzłach](/docs/concepts/architecture/nodes/)
* Więcej o [Kontrolerach](/docs/concepts/architecture/controller/)
* Więcej o [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Oficjalna [dokumentacja](https://etcd.io/docs/) etcd
{{% /capture %}}
