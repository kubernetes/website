---
title: Pody i Węzły
weight: 10
---

## {{% heading "objectives" %}}

* Zrozumieć, jak działają Pody Kubernetesa.
* Zrozumieć, jak działają węzły Kubernetesa.
* Nauczyć się rozwiązywać problemy z aplikacjami.

## Pody Kubernetesa {#kubernetes-pods}

{{% alert %}}
_Pod to grupa jednego lub wielu kontenerów aplikacji (jak np. Docker) zawierających współdzieloną przestrzeń dyskową (volumes), adres IP i informacje, jak mają być uruchamiane._

{{% /alert %}}

Po stworzeniu Deploymentu w [Module 2](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/),
Kubernetes stworzył **Pod**, który "przechowuje" instancję Twojej aplikacji.
Pod jest obiektem abstrakcyjnym Kubernetesa, który reprezentuje grupę jednego bądź wielu
kontenerów (jak np. Docker) wraz ze wspólnymi zasobami dla tych kontenerów. Zasobami mogą być:

* Współdzielona przestrzeń dyskowa, np. Volumes
* Zasoby sieciowe, takie jak unikatowy adres IP klastra
* Informacje służące do uruchamiania każdego z kontenerów ⏤
  wersja obrazu dla kontenera lub numery portów, które mają być użyte

Pod tworzy model specyficznego dla aplikacji "wirtualnego serwera" i może
zawierać różne kontenery aplikacji, które są relatywnie blisko powiązane. Przykładowo, pod
może zawierać zarówno kontener z Twoją aplikacją w Node.js, jak i inny
kontener dostarczający dane, które mają być opublikowane przez serwer Node.js.
Kontenery wewnątrz poda współdzielą adres IP i przestrzeń portów, zawsze są
uruchamiane wspólnie w tej samej lokalizacji i współdzielą kontekst wykonawczy na tym samym węźle.

Pody są niepodzielnymi jednostkami na platformie Kubernetes. W trakcie
tworzenia Deploymentu na Kubernetesa, Deployment tworzy Pody zawierające kontenery
(w odróżnieniu od tworzenia kontenerów bezpośrednio). Każdy Pod związany jest z
węzłem, na którym zostało zlecone jego uruchomienie i pozostaje tam aż do
jego wyłączenia (zgodnie z polityką restartowania) lub skasowania. W
przypadku awarii węzła, identyczny pod jest skierowany do uruchomienia na innym węźle klastra.

### Schemat ogólny podów {#pods-overview}

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_03_pods.svg" class="diagram-medium" >}}

{{% alert %}}
_Kontenery powinny być uruchamiane razem w jednym podzie, jeśli są ściśle ze sobą związane i muszą współdzielić zasoby, np. dysk._

{{% /alert %}}

## Węzły {#nodes}

Pod jest uruchamiany na *węźle* _(Node)_. Węzeł jest maszyną roboczą, fizyczną
lub wirtualną, w zależności od klastra. Każdy z węzłów jest zarządzany
przez warstwę sterowania _(Control Plane)_. Węzeł może
zawierać wiele podów. Warstwa sterowania Kubernetesa automatycznie
zleca uruchomienie podów na różnych węzłach w ramach klastra.
Automatyczne zlecanie uruchomienia bierze pod uwagę zasoby dostępne na każdym z węzłów.

Na każdym węźle Kubernetesa działają co najmniej:

* Kubelet, proces odpowiedzialny za komunikację pomiędzy warstwą sterowania
  Kubernetesa i węzłami; zarządza podami i kontenerami działającymi na maszynie.

* Proces wykonawczy kontenera (np. Docker), który zajmuje się pobraniem obrazu dla
  kontenera z repozytorium, rozpakowaniem kontenera i uruchomieniem aplikacji.

### Schemat węzła {#nodes-overview}

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_03_nodes.svg" class="diagram-medium" >}}

## Rozwiązywanie problemów przy pomocy kubectl {#troubleshooting-with-kubectl}

W module [Module 2](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)
używałeś narzędzia Kubectl. W module 3 będziemy go nadal używać, aby wydobyć informacje
na temat zainstalowanych aplikacji i środowiska, w jakim działają. Najczęstsze
operacje przeprowadzane są przy pomocy następujących poleceń kubectl:

* `kubectl get` - wyświetl informacje o zasobach
* `kubectl describe` - pokaż szczegółowe informacje na temat konkretnego zasobu
* `kubectl logs` - wyświetl logi z kontenera w danym podzie
* `kubectl exec` - wykonaj komendę wewnątrz kontenera w danym podzie

Korzystaj z tych poleceń, aby sprawdzić, kiedy aplikacja została
zainstalowana, jaki jest jej aktualny status, gdzie jest uruchomiona i w jakiej konfiguracji.

Kiedy już wiemy więcej na temat części składowych
klastra i podstawowych poleceń, przyjrzyjmy się naszej aplikacji.

### Sprawdzanie konfiguracji aplikacji {#check-application-configuration}

Sprawdźmy, czy aplikacja, którą wdrożyliśmy w poprzednim scenariuszu, działa.
Użyjemy polecenia `kubectl get` i poszukamy istniejących Podów:

```shell
kubectl get pods
```

Jeśli żadne pody nie działają, poczekaj kilka sekund i ponownie
wylistuj pody. Możesz kontynuować, gdy zobaczysz działający jeden pod.

Następnie, aby zobaczyć, jakie kontenery znajdują się w tym Podzie i jakie obrazy
są używane do budowy tych kontenerów, uruchamiamy polecenie `kubectl describe pods`:

```shell
kubectl describe pods
```

Widzimy tutaj szczegóły dotyczące kontenera Pod: adres IP,
używane porty oraz listę zdarzeń związanych z cyklem życia Poda.

Wyjście komendy `describe` jest obszerne i obejmuje niektóre pojęcia, których jeszcze nie
omawialiśmy, ale nie martw się tym, bo staną się one zrozumiałe przed końcem tego bootcampu.

{{< note >}}
Komenda `describe` może być używana do uzyskania szczegółowych informacji o większości
obiektów Kubernetesa, w tym o Węzłach, Podach i Deploymentach. Wyjście komendy
_describe_ jest zaprojektowane tak, aby było czytelne dla ludzi, a nie do wykorzystania w skryptach.
{{< /note >}}

### Pokazywanie aplikacji w terminalu {#show-the-app-in-the-terminal}

Pamiętaj, że Pody działają w izolowanej, prywatnej sieci - więc musimy
przepuścić do nich dostęp, aby móc je debugować i wchodzić z nimi w interakcję. Aby
to zrobić, użyjemy polecenia `kubectl proxy`, aby uruchomić proxy w
**drugim terminalu**. Otwórz nowe okno terminala, a w tym nowym terminalu uruchom:

```shell
kubectl proxy
```

Teraz ponownie uzyskamy nazwę Poda i zapytamy ten pod bezpośrednio przez
proxy. Aby uzyskać nazwę Poda i zapisać ją w zmiennej środowiskowej `POD_NAME`:

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo Name of the Pod: $POD_NAME
```

Aby zobaczyć wyniki działania naszej aplikacji, wykonaj polecenie `curl`:

```shell
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME:8080/proxy/
```

URL jest ścieżką do API Poda.

{{< note >}}
Nie musimy określać nazwy kontenera, ponieważ wewnątrz poda mamy tylko jeden kontener.
{{< /note >}}

### Wykonywanie polecenia w kontenerze {#executing-commands-on-the-container}

Możemy wykonywać polecenia bezpośrednio na kontenerze po
uruchomieniu i działaniu Poda. Do tego celu używamy podpolecenia `exec` i
używamy nazwy Poda jako parametru. Wymieńmy zmienne środowiskowe:

```shell
kubectl exec "$POD_NAME" -- env
```

Warto ponownie wspomnieć, że nazwa samego kontenera może
zostać pominięta, ponieważ w Podzie mamy tylko jeden kontener.

Następnie rozpocznijmy sesję bash w kontenerze Pod:

```shell
kubectl exec -ti $POD_NAME -- bash
```

Mamy teraz otwartą konsolę na kontenerze, w którym uruchamiamy naszą
aplikację NodeJS. Kod źródłowy aplikacji znajduje się w pliku `server.js`:

```shell
cat server.js
```

Możesz sprawdzić, czy aplikacja działa, wykonując polecenie curl:

```shell
curl http://localhost:8080
```

{{< note >}}
Użyliśmy tutaj `localhost`, ponieważ wykonaliśmy polecenie wewnątrz Podu
NodeJS. Jeśli nie możesz połączyć się z `localhost:8080`, upewnij się, że uruchomiłeś
polecenie `kubectl exec` i wykonujesz polecenie z wnętrza Podu.
{{< /note >}}

Aby zamknąć połączenie z kontenerem, wpisz `exit`.

## {{% heading "whatsnext" %}}

* Samouczek [Jak używać Service do udostępniania aplikacji](/docs/tutorials/kubernetes-basics/expose/expose-intro/).
  
* Dowiedz się więcej o [Podach](/docs/concepts/workloads/pods/).
* Dowiedz się więcej o [węzłach](/docs/concepts/architecture/nodes/).
