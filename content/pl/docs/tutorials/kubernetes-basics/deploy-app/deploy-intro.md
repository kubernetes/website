---
title: Jak użyć kubectl do tworzenia Deploymentu
weight: 10
---

## {{% heading "objectives" %}}

* Poznaj sposób wdrażania aplikacji.
* Wdróż swoją pierwszą aplikację na Kubernetesie za pomocą narzędzia kubectl.

## Deploymenty w Kubernetesie {#kubernetes-deployments}

{{% alert %}}
_Deployment odpowiada za stworzenie i aktualizacje instancji Twojej aplikacji._
{{% /alert %}}

{{< note >}}
Ten samouczek wykorzystuje kontener wymagający architektury AMD64. Jeśli używasz
minikube na komputerze z inną architekturą CPU, możesz spróbować użyć minikube z
sterownikiem, który potrafi emulować AMD64. Na przykład potrafi to zrobić sterownik Docker Desktop.
{{< /note >}}

Mając [działający klaster Kubernetesa](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/),
można na nim zacząć
instalować aplikacje. W tym celu należy utworzyć **Deployment**.
Deployment informuje Kubernetesa, jak tworzyć i aktualizować instancje
Twojej aplikacji. Po stworzeniu Deploymentu, warstwa sterowania
Kubernetesa zleca uruchomienie tej aplikacji na indywidualnych węzłach klastra.

Po utworzeniu instancji aplikacji, kontroler Deploymentu Kubernetesa na
bieżąco monitoruje te instancje. Jeśli węzeł, na którym działała jedna z
instancji ulegnie awarii lub zostanie usunięty, kontroler Deploymentu zamieni tę
instancję z instancją na innym węźle klastra.
**W ten sposób działa samonaprawiający się mechanizm, który reaguje na awarie lub wyłączenia maszyn w klastrze.**

W czasach przed wprowadzeniem takiej automatyzacji, skrypty instalacyjne używane
były zazwyczaj do uruchomienia aplikacji, ale nie radziły sobie z awariami maszyn.
Poprzez połączenie procesu instalacji i kontroli nad działaniem aplikacji na węzłach, Deployment
Kubernetesa oferuje fundamentalnie różne podejście do zarządzania aplikacjami.

## Instalacja pierwszej aplikacji w Kubernetesie {#deploying-your-first-app-on-kubernetes}

{{% alert %}}
_Aby aplikacja mogła zostać uruchomiona w Kubernetesie, musi być opakowana w jeden z obsługiwanych formatów kontenerów._

{{% /alert %}}

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_02_first_app.svg" class="diagram-medium" >}}

Do tworzenia i zarządzaniem Deploymentem służy polecenie linii komend,
[kubectl](/docs/reference/kubectl/). Kubectl używa API Kubernetesa do komunikacji z
klasterem. W tym module nauczysz się najczęściej używanych poleceń kubectl
niezbędnych do stworzenia Deploymentu, który uruchomi Twoje aplikacje na klastrze Kubernetesa.

Tworząc Deployment musisz określić obraz kontenera oraz liczbę
replik, które mają być uruchomione. Te ustawienia możesz zmieniać
później, aktualizując Deployment. [Moduł 5](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
oraz [Moduł 6](/docs/tutorials/kubernetes-basics/update/update-intro/)
omawiają skalowanie i aktualizowanie Deploymentów.

Na potrzeby pierwszej instalacji użyjesz aplikacji hello-node zapakowaną w kontener Docker-a,
która korzysta z NGINXa i powtarza wszystkie wysłane do niej zapytania. (Jeśli jeszcze nie
próbowałeś stworzyć aplikacji hello-node i uruchomić za pomocą kontenerów, możesz spróbować
teraz, kierując się instrukcjami samouczka [samouczku Hello Minikube](/docs/tutorials/hello-minikube/).)

Musisz mieć zainstalowane narzędzie kubectl. Jeśli potrzebujesz
go zainstalować, odwiedź [install tools](/docs/tasks/tools/#kubectl).

Skoro wiesz już, czym są Deploymenty, przeprowadźmy wdrożenie pierwszej aplikacji!

### Podstawy kubectl {#kubectl-basics}

Typowy format polecenia kubectl to: `kubectl akcja zasób`.

Wykonuje określoną _akcję_ (jak `create`, `describe` lub `delete`) na określonym
_zasobie_ (jak `node` lub `deployment`). Możesz użyć `--help` po poleceniu, aby uzyskać dodatkowe
informacje o możliwych parametrach (na przykład: `kubectl get nodes --help`).

Sprawdź, czy kubectl jest skonfigurowany do komunikacji z twoim klastrem, uruchamiając polecenie `kubectl version`.

Sprawdź, czy kubectl jest zainstalowane oraz czy możesz zobaczyć zarówno wersję klienta, jak i serwera.

Aby wyświetlić węzły w klastrze, uruchom polecenie `kubectl get nodes`.

Zobaczysz dostępne węzły. Kubernetes wybierze, gdzie
wdrożyć naszą aplikację, w oparciu o dostępne zasoby węzła.

### Wdrażanie aplikacji {#deploy-an-app}

Uruchommy naszą pierwszą aplikację na Kubernetesie, używając polecenia
`kubectl create deployment`. Musimy podać nazwę wdrożenia oraz lokalizację obrazu
aplikacji (w tym pełny adres URL repozytorium dla obrazów hostowanych poza Docker Hub).

```shell
kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
```

Świetnie! Właśnie wdrożyłeś swoją pierwszą aplikację, tworząc Deployment. Kubernetes wykonał dla Ciebie kilka rzeczy:

* wyszukał odpowiedni węzeł, na którym można uruchomić instancję aplikacji (mamy dostępny tylko 1 węzeł)
- zaplanował uruchomienie aplikacji na tym węźle
* skonfigurował klaster tak, aby w razie potrzeby ponownie uruchomić instancję na nowym węźle

Aby wyświetlić listę swoich wdrożeń, użyj polecenia `kubectl get deployments`:

```shell
kubectl get deployments
```

Widzimy, że jest jeden Deployment uruchamiający pojedynczą instancję Twojej
aplikacji. Instancja działa wewnątrz kontenera na Twoim węźle.

### Zobacz aplikację {#view-the-app}

[Pody](/docs/concepts/workloads/pods/) działające wewnątrz Kubernetesa
działają na prywatnej, izolowanej sieci. Domyślnie są one widoczne z innych
podów i usług w ramach tego samego klastra Kubernetesa, ale nie poza tą
siecią. Kiedy używamy `kubectl`, komunikujemy się z aplikacją za pośrednictwem API.

Później, w [Module 4](/docs/tutorials/kubernetes-basics/expose/), omówimy
inne opcje dotyczące sposobów udostępniania Twojej aplikacji poza klastrem
Kubernetesa. Ponieważ jest to tylko podstawowy samouczek, to nie wyjaśniamy
tutaj szczegółowo, czym są `Pody`, bo będzie to omówione w późniejszych tematach.

Polecenie `kubectl proxy` może utworzyć proxy, które przekaże komunikację do
ogólnoklastrowej, prywatnej sieci. Proxy można zakończyć poprzez
naciśnięcie control-C - podczas działania nie wyświetla ono żadnych komunikatów.

**Musisz otworzyć drugie okno terminala, aby uruchomić proxy.**

```shell
kubectl proxy
```
Mamy teraz połączenie pomiędzy naszym hostem (terminalem) a klastrem
Kubernetesa. Proxy umożliwia bezpośredni dostęp do API z tych terminali.

Możesz zobaczyć wszystkie te interfejsy API hostowane przez punkt końcowy serwera proxy.
Na przykład możemy bezpośrednio zapytać o wersję za pomocą polecenia `curl`:

```shell
curl http://localhost:8001/version
```

{{< note >}}
Jeśli port 8001 jest niedostępny, upewnij się, że
`kubectl proxy`, który uruchomiłeś wyżej, działa w drugim terminalu.
{{< /note >}}

Serwer API automatycznie utworzy punkt końcowy dla każdego poda,
bazując na nazwie poda, który jest również dostępny przez serwer proxy.

Najpierw musimy uzyskać nazwę Poda i zapisać ją w zmiennej środowiskowej `POD_NAME`.

```shell
export POD_NAME=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
echo Name of the Pod: $POD_NAME
```

Możesz uzyskać dostęp do Poda za pośrednictwem API z proxy, uruchamiając:

```shell
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME:8080/proxy/
```

Aby nowy Deployment był dostępny bez użycia proxy, wymagane jest utworzenie obiektu usługi
(ang. Service), co zostanie wyjaśnione w [Module 4](/docs/tutorials/kubernetes-basics/expose/).

## {{% heading "whatsnext" %}}

* Samouczek [Pody i Węzły](/docs/tutorials/kubernetes-basics/explore/explore-intro/).
* Dowiedz się więcej o [Deploymentach](/docs/concepts/workloads/controllers/deployment/).
