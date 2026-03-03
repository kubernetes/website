---
title: Uruchamianie wielu instancji aplikacji
weight: 10
---

## {{% heading "objectives" %}}

* Ręczne skalowanie istniejącej aplikacji za pomocą narzędzia kubectl.

## Skalowanie aplikacji {#scaling-an-application}

{{% alert %}}
_Od samego początku w ramach Deploymentu można uruchomić wiele instancji - skorzystaj z parametru --replicas polecenia kubectl create deployment._

{{% /alert %}}

Poprzednio stworzyliśmy [Deployment](/docs/concepts/workloads/controllers/deployment/) i
udostępniliśmy go publicznie korzystając z [Service](/docs/concepts/services-networking/service/).
Deployment utworzył tylko jeden Pod, w którym uruchomiona jest nasza aplikacja. Wraz ze wzrostem ruchu,
będziemy musieli wyskalować aplikację, aby była w stanie obsłużyć zwiększone zapotrzebowanie użytkowników.

Jeśli nie pracowałeś z wcześniejszymi sekcjami, zacznij od sekcji
[Jak użyć Minikube do stworzenia klastra](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/).

_Skalowanie_ polega na zmianie liczby replik w Deploymencie.

{{< note >}}
Jeśli próbujesz to zrobić po
[poprzedniej sekcji](/pl/docs/tutorials/kubernetes-basics/expose/expose-intro/),
mogłeś usunąć utworzoną usługę lub utworzyłeś usługę
typu `NodePort`. W tej sekcji zakłada się, że dla
wdrożenia kubernetes-bootcamp utworzono usługę o `typie: LoadBalancer`.

Jeśli _nie_ usunąłeś usługi utworzonej w
[poprzedniej sekcji](/docs/tutorials/kubernetes-basics/expose/expose-intro),
najpierw usuń ją, a następnie uruchom następujące
polecenie, aby utworzyć nową z ustawionym `typem` na `LoadBalancer`:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="LoadBalancer" --port 8080
```
{{< /note >}}

## Ogólnie o skalowaniu {#scaling-overview}

<!-- animation -->
{{< tutorials/carousel id="myCarousel" interval="3000" >}}
  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling1.svg"
      active="true" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling2.svg" >}}
{{< /tutorials/carousel >}}

{{% alert %}}
_Skalowanie polega na zmianie liczby replik w ramach Deploymentu._
{{% /alert %}}

Kiedy zwiększamy skalę Deploymentu, uruchomienie nowych Podów jest zlecane na Węzłach, które
posiadają odpowiednio dużo zasobów. Operacja skalowania zwiększy liczbę Podów do oczekiwanej
wartości. W Kubernetesie możliwe jest również [autoskalowanie](/docs/concepts/workloads/autoscaling/)
Podów, ale jest ono poza zakresem niniejszego samouczka. Istnieje także możliwość
skalowania do zera - w ten sposób zatrzymane zostaną wszystkie Pody należące do konkretnego Deploymentu.

Kiedy działa jednocześnie wiele instancji jednej aplikacji, należy odpowiednio rozłożyć ruch pomiędzy
każdą z nich. Serwisy posiadają zintegrowany load-balancer, który dystrybuuje ruch na wszystkie Pody w Deployment
wystawionym na zewnątrz. Serwis prowadzi ciągły monitoring Podów poprzez ich punkty
dostępowe _(endpoints)_, aby zapewnić, że ruch kierowany jest tylko do tych Podów, które są faktycznie dostępne.

Kiedy aplikacja ma uruchomioną więcej niż jedną instancję,
można prowadzić ciągłe aktualizacje _(Rolling updates)_ bez
przerw w działaniu aplikacji. O tym będzie mowa w następnej sekcji.

### Skalowanie Deploymentu {#scaling-a-deployment}

Aby wyświetlić listę swoich Deploymentów, użyj komendy `get deployments`:

```shell
kubectl get deployments
```

Wynik powinien wyglądać podobnie do:

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           11m
```

Powinniśmy mieć 1 Pod. Jeśli nie, uruchom polecenie ponownie. To pokazuje:

* _NAME_ wyświetla nazwy Deploymentów w klastrze.
* _READY_ pokazuje stosunek replik bieżących (ang. CURRENT) do oczekiwanych (ang. DESIRED).
* _UP-TO-DATE_ wyświetla liczbę replik zaktualizowanych w celu osiągnięcia pożądanego stanu.
* _AVAILABLE_ pokazuje, ile replik aplikacji jest dostępnych dla użytkowników.
* _AGE_ pokazuje, jak długo aplikacja jest uruchomiona.

Aby zobaczyć ReplicaSet utworzony przez Deployment, uruchom:

```shell
kubectl get rs
```

Zauważ, że nazwa ReplicaSet jest zawsze sformatowana jako
<nobr>[NAZWA-DEPLOYMENTU]-[LOSOWY-CIĄG]</nobr>. Losowy ciąg jest generowany
losowo i wykorzystuje _pod-template-hash_ jako ziarno.

Dwie istotne kolumny tego wyniku to:

* _DESIRED_ pokazuje żądaną liczbę replik aplikacji, którą
  określasz podczas tworzenia Deploymentu. Jest to pożądany stan.
* _CURRENT_ pokazuje, ile replik obecnie działa.

Następnie skalujemy Deployment do 4 replik. Użyjemy polecenia
`kubectl scale`, po którym podajemy typ Deployment, nazwę i pożądaną liczbę instancji:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=4
```

Aby ponownie wyświetlić listę swoich Deploymentów, użyj `get deployments`:

```shell
kubectl get deployments
```

Zmiana została zastosowana i mamy 4 dostępne instancje
aplikacji. Następnie sprawdźmy, czy liczba Podów uległa zmianie:

```shell
kubectl get pods -o wide
```

Obecnie są 4 Pody, z różnymi adresami IP. Zmiana została zarejestrowana
w dzienniku zdarzeń Deploymentu. Aby to sprawdzić, użyj komendy `describe`:

```shell
kubectl describe deployments/kubernetes-bootcamp
```

Możesz również zauważyć w wyniku tego polecenia, że obecnie istnieją 4 repliki.

### Równoważenie obciążenia {#load-balancing}

Sprawdźmy, czy usługa równoważy obciążenie ruchem. Aby dowiedzieć się, jaki jest wystawiony adres
IP i port, możemy użyć opcji `describe service`, jak nauczyliśmy się w poprzedniej części samouczka:

```shell
kubectl describe services/kubernetes-bootcamp
```

Utwórz zmienną środowiskową o nazwie NODE_PORT, która ma wartość jako port węzła:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo NODE_PORT=$NODE_PORT
```

Następnie wykonamy polecenie `curl` na wystawiony adres IP i port. Wykonaj to polecenie wielokrotnie:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

Za każdym razem trafiamy na inny Pod z każdym żądaniem. To pokazuje, że równoważenie obciążenia działa.

Wynik powinien wyglądać podobnie do:

```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-hs9dj | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
```

{{< note >}}
Jeśli używasz minikube z Docker Desktop jako sterownika
kontenerów, potrzebny jest tunel minikube. Wynika to z
faktu, że kontenery w Docker Desktop są izolowane od Twojego hosta.

W osobnym oknie terminala, wykonaj:

```shell
minikube service kubernetes-bootcamp --url
```

Wynik wygląda następująco:

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

Następnie użyj podany URL, aby uzyskać dostęp do aplikacji:

```shell
curl 127.0.0.1:51082
```
{{< /note >}}

### Zmniejsz Skalę {#scale-down}

Aby zmniejszyć skalowalność Deployment do 2 replik, ponownie uruchom komendę `scale`:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=2
```

Wyświetl listę Deploymentów, aby sprawdzić, czy zmiana została zastosowana, za pomocą komendy `get deployments`:

```shell
kubectl get deployments
```

Liczba replik zmniejszyła się do 2. Wyświetl listę liczby Podów za pomocą `get pods`:

```shell
kubectl get pods -o wide
```

To potwierdza, że 2 Pody zostały zakończone.

## {{% heading "whatsnext" %}}

* Samouczek [Aktualizacje Rolling Update](/docs/tutorials/kubernetes-basics/update/update-intro/).
  
* Dowiedz się więcej o [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/).
* Dowiedz się więcej o [Autoskalowaniu](/docs/concepts/workloads/autoscaling/).
