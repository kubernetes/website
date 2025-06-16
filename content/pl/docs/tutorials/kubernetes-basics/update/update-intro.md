---
title: Aktualizacje Rolling Update
weight: 10
---

## {{% heading "objectives" %}}

Wykonaj aktualizację Rolling Update używając kubectl.

## Aktualizowanie aplikacji {#updating-an-application}

{{% alert %}}
_Rolling updates to metoda na aktualizację Deploymentów bez przerwy w ich dostępności poprzez stopniową zamianę kolejnych Podów na ich nowe wersje._

{{% /alert %}}

Użytkownicy oczekują, że aplikacje są dostępne non-stop, a deweloperzy chcieliby móc
wprowadzać nowe wersje nawet kilka razy dziennie. W Kubernetesie jest to możliwe dzięki
mechanizmowi płynnych aktualizacji _(rolling updates)_. **Rolling updates** pozwala
prowadzić aktualizację w ramach Deploymentu bez przerw w jego działaniu. Odbywa się to
dzięki krokowemu zastępowaniu kolejnych Podów. Nowe Pody uruchamiane są na Węzłach, które
posiadają wystarczające zasoby, a Kubernetes czeka, aż uruchomią się nowe Pody, zanim usunie stare.

W poprzednim module wyskalowaliśmy aplikację aby była uruchomiona na wielu instancjach. To niezbędny
wymóg, aby móc prowadzić aktualizacje bez wpływu na dostępność aplikacji.
Domyślnie, maksymalna liczba Podów, które mogą być niedostępne w trakcie aktualizacji oraz
Podów, które mogą być tworzone, wynosi jeden. Obydwie opcje mogą być zdefiniowane w
wartościach bezwzględnych lub procentowych (ogólnej liczby Podów). W Kubernetesie, każda
aktualizacja ma nadany numer wersji i każdy Deployment może być wycofany do wersji poprzedniej (stabilnej).

## Ogólnie o Rolling updates {#rolling-updates-overview}

<!-- animation -->
<div class="col-md-8">
  <div id="myCarousel" class="carousel" data-ride="carousel" data-interval="3000">
    <div class="carousel-inner" role="listbox">
      <div class="item carousel-item active">
        <img src="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates1.svg">
      </div>
      <div class="item carousel-item">
        <img src="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates2.svg">
      </div>
      <div class="item carousel-item">
        <img src="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates3.svg">
      </div>
      <div class="item carousel-item">
        <img src="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates4.svg">
      </div>
    </div>
  </div>
</div>

{{% alert %}}
_Jeśli Deployment jest udostępniony publicznie, Serwis będzie kierował ruch w trakcie aktualizacji tylko do Podów, które są aktualnie dostępne._

{{% /alert %}}

Podobnie, jak w przypadku skalowania aplikacji, jeśli Deployment jest udostępniony
publicznie, Serwis będzie kierował ruch tylko do Podów, które są dostępne w trakcie
aktualizacji. Dostępny Pod to taki, którego instancja jest dostępna dla użytkowników aplikacji.

Płynne aktualizacje pozwalają na:

* Promocję aplikacji z jednego środowiska do innego (poprzez aktualizację obrazu kontenera)
* Wycofywanie się do poprzedniej wersji
* _Continuous Integration_ oraz _Continuous Delivery_ aplikacji bez przerw w jej działaniu

W ramach tego interaktywnego samouczka zaktualizujemy
aplikację do nowej wersji, a następnie wycofamy tę aktualizację.

### Zaktualizuj wersję aplikacji {#update-the-version-of-the-app}

Aby wyświetlić listę swoich Deploymentów, uruchom komendę `get deployments`:

```shell
kubectl get deployments
```

Aby wyświetlić listę uruchomionych Podów, użyj komendy `get pods`:

```shell
kubectl get pods
```

Aby zobaczyć bieżącą wersję obrazu aplikacji,
uruchom komendę `describe pods` i poszukaj pola `Image`:

```shell
kubectl describe pods
```

Aby zaktualizować obraz aplikacji do wersji 2, użyj komendy
`set image`, podając nazwę Deploymentu oraz nową wersję obrazu:

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=docker.io/jocatalin/kubernetes-bootcamp:v2
```

Polecenie zainicjowało rolling update Deploymentu, aktualizując obraz
aplikacji. Sprawdź status nowych Podów i zobacz, jak
postępuje wyłączanie poprzednich wersji używając polecenia `get pods`:

```shell
kubectl get pods
```

### Zweryfikuj aktualizację {#verify-an-update}

Najpierw sprawdź, czy usługa działa, ponieważ mogłeś ją usunąć w
poprzednim kroku samouczka, uruchom
`describe services/kubernetes-bootcamp`. Jeśli jej brakuje, możesz ją ponownie utworzyć za pomocą:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

Utwórz zmienną środowiskową o nazwie `NODE_PORT`,
która będzie miała wartość przypisanego portu Węzła:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

Następnie wykonaj polecenie `curl` na udostępniony adres IP i port:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

Z każdym uruchomieniem polecenia `curl`, trafisz na inny Pod. Zwróć
uwagę, że obecnie wszystkie Pody działają na najnowszej wersji (`v2`).

Możesz również potwierdzić aktualizację, uruchamiając komendę `rollout status`:

```shell
kubectl rollout status deployments/kubernetes-bootcamp
```

Aby wyświetlić bieżącą wersję obrazu aplikacji, uruchom komendę describe pods:

```shell
kubectl describe pods
```

W polu `Image` sprawdź, czy
używasz najnowszej wersji obrazu (`v2`).

### Cofnięcie aktualizacji {#roll-back-an-update}

Wykonajmy kolejną aktualizację i spróbujmy wdrożyć obraz oznaczony tagiem `v10`:

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10
```

Użyj `get deployments`, aby zobaczyć status Deploymentu:

```shell
kubectl get deployments
```

Zauważ, że w jest za mało Podów działających poprawnie.
Uruchom komendę `get pods`, aby wyświetlić listę wszystkich Podów:

```shell
kubectl get pods
```

Zauważ, że niektóre z podów mają status `ImagePullBackOff`.

Aby uzyskać więcej informacji na temat problemu, uruchom komendę `describe pods`:

```shell
kubectl describe pods
```

W sekcji `Events` dla podów, zauważ, że
wersja obrazu `v10` nie istniała w repozytorium.

Aby wycofać wdrożenie do ostatniej
działającej wersji, użyj komendy `rollout undo`:

```shell
kubectl rollout undo deployments/kubernetes-bootcamp
```

Polecenie `rollout undo` przywraca Deployment do poprzedniego znanego
stanu (`v2` obrazu). Aktualizacje są wersjonowane i
można je cofać do dowolnego wcześniej znanego stanu Deploymentu.

Użyj polecenia `get pods`, aby ponownie wyświetlić listę Podów:

```shell
kubectl get pods
```

Aby sprawdzić obraz wdrożony na działających Podach, użyj polecenia `describe pods`:

```shell
kubectl describe pods
```

Deployment ponownie używa stabilnej wersji
aplikacji (`v2`). Wycofanie zakończyło się pomyślnie.

Pamiętaj o oczyszczeniu lokalnego klastra.

```shell
kubectl delete deployments/kubernetes-bootcamp services/kubernetes-bootcamp
```

## {{% heading "whatsnext" %}}

* Dowiedz się więcej o [Deploymentach](/docs/concepts/workloads/controllers/deployment/).