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

* Node Controller: Odpowiada za rozpoznawanie i reagowanie na sytuacje, kiedy węzeł staje się z jakiegoś powodu niedostępny.
* Replication Controller: Odpowiada za utrzymanie prawidłowej liczby podów dla każdego obiektu typu *ReplicationController* w systemie.
* Endpoints Controller: Dostarcza informacji do obiektów typu *Endpoints* (tzn. łączy ze sobą Serwisy i Pody).
* Service Account & Token Controllers: Tworzy domyślne konta i tokeny dostępu API dla nowych przestrzeni nazw (*namespaces*).

### cloud-controller-manager

[cloud-controller-manager](/docs/tasks/administer-cluster/running-cloud-controller/) uruchamia kontroler, który komunikuje się z usługami dostawcy chmury, na których zbudowany jest klaster. Oprogramowanie cloud-controller-manager, wprowadzone w Kubernetes 1.6 ma status rozwojowy beta.

cloud-controller-manager wykonuje tylko pętle sterowania konkretnych dostawców usług chmurowych. Wykonywanie tych pętli sterowania musi być wyłączone w kube-controller-manager. Wyłączenie następuje poprzez ustawienie opcji `--cloud-provider` jako `external` przy starcie kube-controller-manager.

cloud-controller-manager umożliwia rozwój oprogramowania dostawców usług chmurowych niezależnie od samego oprogramowania Kubernetes. W poprzednich wersjach, główny kod Kubernetes był zależny od kodu dostarczonego przez zewnętrznych dostawców różnych usług chmurowych. W przyszłych wydaniach, oprogramowanie związane z dostawcami chmurowymi będzie utrzymywane przez nich samych i podłączane do cloud-controller-managera w trakcie uruchamiana Kubernetes.

Następujące kontrolery zależą od dostawców usług chmurowych:

  * Node Controller: Aby sprawdzić u dostawcy usługi chmurowej, czy węzeł został skasowany po tym, jak przestał odpowiadać
  * Route Controller: Aby ustawić trasy *(routes)* w niższych warstwach infrastruktury chmurowej
  * Service Controller: Aby tworzyć, aktualizować i kasować *cloud load balancers*
  * Volume Controller: Aby tworzyć, podłączać i montować woluminy oraz zarządzać nimi przez dostawcę usług chmurowych

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
* Więcej o [kube-scheduler](/docs/concepts/scheduling/kube-scheduler/)
* Oficjalna [dokumentacja](https://etcd.io/docs/) etcd
{{% /capture %}}
