---
title: Jak używać Service do udostępniania aplikacji
weight: 10
---

## {{% heading "objectives" %}}

* Dowiedz się, czym jest Service w Kubernetesie.
* Zrozum, jak etykiety (labels) i selektory (selectors) są powiązane z Service.
* Wystaw aplikację na zewnątrz klastra Kubernetesa.

## Kubernetes Services - przegląd {#overview-of-kubernetes-services}

[Pody](/docs/concepts/workloads/pods/) Kubernetesa są nietrwałe. Pody mają swój
[cykl życia](/docs/concepts/workloads/pods/pod-lifecycle/). Jeśli węzeł roboczy ulegnie awarii, tracone są
wszystkie pody działające na węźle. [Replicaset](/docs/concepts/workloads/controllers/replicaset/)
będzie próbował automatycznie doprowadzić klaster z powrotem do pożądanego stanu tworząc
nowe pody i w ten sposób zapewnić działanie aplikacji. Innym przykładem może być system na
back-endzie przetwarzania obrazów posiadający 3 repliki. Każda z tych replik jest wymienna -
system front-endu nie powinien musieć pilnować replik back-endu ani tego, czy któryś z podów
przestał działać i został odtworzony na nowo. Nie należy jednak zapominać o tym, że każdy Pod w
klastrze Kubernetesa ma swój unikatowy adres IP, nawet pody w obrębie tego samego węzła, zatem
powinna istnieć metoda automatycznego uzgadniania zmian pomiędzy podami, aby aplikacja mogła dalej funkcjonować.

{{% alert %}}
Serwis Kubernetesa to warstwa abstrakcji, która definiuje logiczny zbiór Podów i
umożliwia kierowanie ruchu przychodzącego do Podów, jego równoważenie oraz service discovery.
{{% /alert %}}

Serwis (ang. [Service](/docs/concepts/services-networking/service/)) w Kubernetesie
jest abstrakcyjnym obiektem, która definiuje logiczny zbiór podów oraz politykę dostępu
do nich. Serwisy pozwalają na swobodne łączenie zależnych podów. Serwis jest
zdefiniowany w YAMLu lub w JSONie - tak, jak wszystkie obiekty Kubernetesa. Zbiór podów, które
obsługuje Serwis, jest zazwyczaj określany przez _LabelSelector_ (poniżej opisane
jest, w jakich przypadkach możesz potrzebować zdefiniować Serwis bez specyfikowania `selektora`).

Mimo, że każdy pod ma swój unikatowy adres IP, te adresy nie są dostępne poza klastrem, o ile nie
zostaną wystawione za pomocą Serwisu. Serwis umożliwia aplikacji przyjmować ruch przychodzący.
Serwisy mogą być wystawiane na zewnątrz na kilka różnych sposobów, poprzez określenie `typu` w ServiceSpec:

* _ClusterIP_ (domyślnie) - Wystawia serwis poprzez wewnętrzny adres
  IP w klastrze. W ten sposób serwis jest dostępny tylko wewnątrz klastra.

* _NodePort_ - Wystawia serwis na tym samym porcie na każdym z wybranych węzłów klastra przy pomocy
  NAT. W ten sposób serwis jest dostępny z zewnątrz klastra poprzez `NodeIP:NodePort`. Nadzbiór ClusterIP.

* _LoadBalancer_ - Tworzy zewnętrzny load balancer u bieżącego dostawcy usług chmurowych (o
  ile jest taka możliwość) i przypisuje serwisowi stały, zewnętrzny adres IP. Nadzbiór NodePort.

* _ExternalName_ - Przypisuje Service do `externalName` (np.
  `foo.bar.example.com`), zwracając rekord `CNAME` wraz z zawartością. W tym przypadku nie
  jest wykorzystywany proces przekierowania ruchu metodą proxy. Ta metoda
  wymaga `kube-dns` w wersji v1.7 lub wyższej lub CoreDNS w wersji 0.0.8 lub wyższej.

Więcej informacji na temat różnych typów serwisów znajduje się w  samouczku
[Używanie adresu źródłowego (Source IP)](/docs/tutorials/services/source-ip/). Warto też zapoznać się
z [Łączeniem Aplikacji z Serwisami](/docs/tutorials/services/connect-applications-service/).

W pewnych przypadkach w serwisie nie specyfikuje się `selector`.
Serwis, który został stworzony bez pola `selector`, nie utworzy
odpowiedniego obiektu Endpoints. W ten sposób użytkownik ma możliwość ręcznego
przyporządkowania serwisu do konkretnych endpoints. Inny przypadek,
kiedy nie używa się selektora, ma miejsce, kiedy stosujemy `type: ExternalName`.

## Sewisy i Etykiety _(Labels)_ {#services-and-labels}

Serwis kieruje przychodzący ruch do grupy Podów. Serwisy są obiektami abstrakcyjnymi, dzięki czemu
Pody, które z jakichś powodów przestały działać i zostały zastąpione przez Kubernetesa nowymi
instancjami, nie wpłyną ujemnie na działanie twoich aplikacji. Detekcją nowych podów i kierowaniem ruchu pomiędzy zależnymi
podami (takimi, jak składowe front-end i back-end w aplikacji) zajmują się Serwisy Kubernetesa.

Serwis znajduje zestaw odpowiednich Podów przy pomocy
[etykiet i selektorów](/docs/concepts/overview/working-with-objects/labels), podstawowych jednostek
grupujących, które umożliwiają operacje logiczne na obiektach Kubernetesa.
Etykiety to pary klucz/wartość przypisane do obiektów. Mogą być używane na różne sposoby:

* Dzielić obiekty na deweloperskie, testowe i produkcyjne
- Osadzać znaczniki _(tags)_ określające wersje
* Klasyfikować obiekty przy użyciu znaczników

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_04_labels.svg" class="diagram-medium" >}}

Obiekty mogą być oznaczane etykietami w momencie tworzenia lub później. Etykiety mogą być zmienianie w
dowolnej chwili. Udostępnijmy teraz naszą aplikację przy użyciu Serwisu i oznaczmy ją odpowiednimi etykietami.

### Krok 1: Tworzenie nowej Usługi {#step-1-creating-a-new-service}

Sprawdźmy, czy nasza aplikacja działa. Użyjemy
polecenia `kubectl get` i sprawdzimy istniejące Pody:

```shell
kubectl get pods
```

Jeśli żadne Pody nie działają, oznacza to, że obiekty z poprzednich
samouczków zostały usunięte. W takim przypadku wróć i odtwórz wdrożenie z
samouczka [Używanie kubectl do tworzenia Deploymentu](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro#deploy-an-app).
Proszę poczekać kilka sekund i ponownie
wylistować Pody. Możesz kontynuować, gdy zobaczysz działający jeden Pod.

Następnie wymieńmy aktualne usługi z naszego klastra:

```shell
kubectl get services
```

Aby utworzyć nową usługę i udostępnić ją dla ruchu zewnętrznego, użyjemy polecenia `expose` z parametrem `--type=NodePort`:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

Mamy teraz działającą usługę o nazwie kubernetes-bootcamp. Tutaj widzimy, że
usługa otrzymała unikalny cluster-IP, wewnętrzny port oraz zewnętrzny-IP (IP węzła).

Aby dowiedzieć się, który port został otwarty zewnętrznie (dla `type: NodePort`
usługi), uruchomimy komendę `describe service`:

```shell
kubectl describe services/kubernetes-bootcamp
```

Utwórz zmienną środowiskową o nazwie
`NODE_PORT`, która ma wartość przypisanego portu węzła:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

Teraz możemy przetestować, czy aplikacja jest wystawiona poza
klaster, używając `curl`, adresu IP węzła i zewnętrznie wystawionego portu:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```
{{< note >}}
Jeśli używasz minikube z Docker Desktop jako sterownik
kontenerów, potrzebny jest tunel minikube. Dzieje się tak, ponieważ
kontenery wewnątrz Docker Desktop są izolowane od twojego komputera głównego.

W osobnym oknie terminala wykonaj:

```shell
minikube service kubernetes-bootcamp --url
```

Wyjście wygląda następująco:

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

Następnie użyj podanego URL-a, aby uzyskać dostęp do aplikacji:

```shell
curl 127.0.0.1:51082
```
{{< /note >}}

Otrzymaliśmy odpowiedź od serwera. Usługa jest wystawiona.

### Krok 2: Używanie etykiet {#step-2-using-labels}

Deployment automatycznie utworzył etykietę dla naszego Poda. Za pomocą
komendy `describe deployment` możesz zobaczyć nazwę (klucz) tej etykiety:

```shell
kubectl describe deployment
```

Użyjmy tej etykiety, aby zapytać o naszą listę Podów. Skorzystamy z
polecenia `kubectl get pods` z parametrem `-l`, a następnie wartościami etykiet:

```shell
kubectl get pods -l app=kubernetes-bootcamp
```
Możesz zrobić to samo, aby wyświetlić istniejące Usługi:

```shell
kubectl get services -l app=kubernetes-bootcamp
```

Pobierz nazwę Pod i zapisz ją w zmiennej środowiskowej POD_NAME:

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo "Name of the Pod: $POD_NAME"
```

Aby zastosować nową etykietę, używamy komendy `label`, po
której następuje typ obiektu, nazwa obiektu i nowa etykieta:

```shell
kubectl label pods "$POD_NAME" version=v1
```

To zastosuje nową etykietę do naszego poda (przypięliśmy wersję
aplikacji do poda), a możemy to sprawdzić za pomocą polecenia `describe pod`:

```shell
kubectl describe pods "$POD_NAME"
```

Widzimy tutaj, że etykieta jest teraz przypisana do naszego
Poda. Możemy teraz zapytać o listę podów, używając nowej etykiety:

```shell
kubectl get pods -l version=v1
```
I widzimy Pod.

### Krok 3: Usuwanie usługi {#step-3-deleting-a-service}

Aby usunąć Usługi, można użyć polecenia
`delete service`. Etykiety mogą być również używane tutaj:

```shell
kubectl delete service -l app=kubernetes-bootcamp
```

Potwierdź, że Usługa została usunięta:

```shell
kubectl get services
```

To potwierdza, że nasza usługa została usunięta. Aby upewnić się, że trasa nie
jest już wystawiona, możesz użyć `curl` na wcześniej wystawionym adresie IP i porcie:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

To dowodzi, że aplikacja nie jest już dostępna z zewnątrz klastra.
Możesz potwierdzić, że aplikacja nadal działa za pomocą `curl` z wnętrza poda:

```shell
kubectl exec -ti $POD_NAME -- curl http://localhost:8080
```

Widzimy tutaj, że aplikacja jest uruchomiona. Dzieje się
tak, ponieważ aplikacją zarządza Deployment.
Aby wyłączyć aplikację, należy również usunąć Deployment.

## {{% heading "whatsnext" %}}

* Samouczek [Uruchamianie wielu instancji aplikacji](/docs/tutorials/kubernetes-basics/scale/scale-intro/).
  
* Dowiedz się więcej o [Usłudze](/docs/concepts/services-networking/service/).
