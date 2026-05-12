---
title: Hello Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

Ten samouczek pokaże, jak uruchomić przykładową aplikację na Kubernetesie przy użyciu minikube. W tym samouczku wykorzystamy
obraz kontenera, który korzysta z NGINX, aby wyświetlić z powrotem wszystkie przychodzące zapytania.

## {{% heading "objectives" %}}

* Skonfiguruj przykładową aplikację do uruchomienia w minikube.
* Uruchom aplikację.
* Przejrzyj jej logi.

## {{% heading "prerequisites" %}}


Ten tutorial zakłada, że masz już skonfigurowane narzędzie `minikube`. Instrukcje instalacji
znajdziesz w __Kroku 1__ dokumentacji [minikube start](https://minikube.sigs.k8s.io/docs/start/).
{{< note >}}
Wykonaj tylko instrukcje zawarte w kroku 1, Instalacja. Reszta jest opisana na tej stronie.
{{< /note >}}

Dodatkowo wymagane jest zainstalowanie `kubectl`. Szczegółowe instrukcje
instalacji dostępne są w sekcji [Install tools](/docs/tasks/tools/#kubectl).


<!-- lessoncontent -->

## Utwórz klaster minikube {#create-a-minikube-cluster}

```shell
minikube start
```

## Sprawdź status klastra minikube. {#check-the-status-of-the-minikube-cluster}

Sprawdź status klastra minikube, aby upewnić się, że wszystkie jego komponenty są uruchomione.

```shell
minikube status
```
Wynik z powyższego polecenia powinien pokazywać wszystkie komponenty jako działające (ang. Running) lub skonfigurowane (ang. Configured), jak pokazano w poniższym przykładzie:

```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

## Otwórz Dashboard {#open-the-dashboard}

Otwórz dashboard Kubernetesa. Można to zrobić na dwa sposoby:

{{< tabs name="dashboard" >}}
{{% tab name="Launch a browser" %}}
Otwórz **nowy** terminal i uruchom:
```shell
# Uruchom nową sesję terminala i pozostaw ją aktywną.
minikube dashboard
```

Teraz wróć do terminala, w którym uruchomiłeś `minikube start`.

{{< note >}}
Polecenie `dashboard` uruchamia dodatek panelu i otwiera proxy w domyślnej
przeglądarce. W panelu można tworzyć różne obiekty Kubernetesa, takie jak _Deployment_ czy _Serwis_.

Aby dowiedzieć się, jak uniknąć bezpośredniego uruchamiania przeglądarki z terminala i uzyskać URL do pulpitu nawigacyjnego w sieci, zapoznaj się z kartą "Kopiuj i wklej URL".

Panel jest domyślnie dostępny jedynie z wewnętrznej sieci Kubernetesa. Polecenie
`dashboard` tworzy tymczasowe proxy, które udostępnia panel także poza tą wewnętrzną sieć.

Aby zatrzymać proxy, wciśnij `Ctrl+C` i zakończ proces. Panel ciągle
działa na klastrze Kubernetesa, nawet po przerwaniu działania proxy. Aby dostać się
ponownie do panelu, trzeba stworzyć kolejne proxy poleceniem `dashboard`.
{{< /note >}}

{{% /tab %}}
{{% tab name="URL copy and paste" %}}

Jeśli nie chcesz, aby minikube automatycznie otwierał przeglądarkę internetową, uruchom podkomendę
dashboard z flagą --url. minikube wyświetli adres URL, który możesz otworzyć w preferowanej przeglądarce.

Otwórz **nowy** terminal i uruchom:
```shell
# Uruchom nową sesję terminala i pozostaw ją aktywną.
minikube dashboard --url
```

Teraz możesz użyć tego URL-a i wrócić do terminala, w którym uruchomiłeś `minikube start`.

{{% /tab %}}
{{< /tabs >}}

## Stwórz Deployment {#create-a-deployment}

[*Pod*](/docs/concepts/workloads/pods/) w Kubernetesie to grupa jednego lub
wielu kontenerów połączonych ze sobą na potrzeby administrowania i dostępu sieci. W
tym samouczku Pod zawiera tylko jeden kontener.
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) w Kubernetesie monitoruje stan twojego Poda i
restartuje należące do niego kontenery, jeśli z jakichś powodów przestaną
działać. Użycie Deploymentu to rekomendowana metoda zarządzania tworzeniem i skalowaniem Podów.

1. Użyj polecenia `kubectl create` do stworzenia Deploymentu, który będzie zarządzał
   Podem. Pod uruchamia kontener wykorzystując podany obraz Dockera.

    ```shell
    # Uruchom testowy obraz kontenera zawierający serwer WWW
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.53 -- /agnhost netexec --http-port=8080
    ```

1. Sprawdź stan Deploymentu:

    ```shell
    kubectl get deployments
    ```

    Wynik powinien wyglądać podobnie do:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

    (Może minąć trochę czasu, zanim pod stanie się dostępny. Jeśli widzisz "0/1", spróbuj ponownie za kilka sekund.)

1. Sprawdź stan Poda:

    ```shell
    kubectl get pods
    ```

    Wynik powinien wyglądać podobnie do:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

1. Obejrzyj zdarzenia na klastrze:

    ```shell
    kubectl get events
    ```

1. Sprawdź konfigurację `kubectl`:

    ```shell
    kubectl config view
    ```

1. Pobierz logi aplikacji z kontenera działającego w podzie (użyj nazwy poda zwróconej przez polecenie `kubectl get pods`).

   {{< note >}}
   Zastąp `hello-node-5f76cf6ccf-br9b5` w poleceniu `kubectl logs` nazwą poda z wyniku polecenia `kubectl get pods`.
   {{< /note >}}

   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

   Wynik powinien wyglądać podobnie do:

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```


{{< note >}}
Więcej informacji na temat polecenia `kubectl` znajdziesz w [przeglądzie kubectl](/docs/reference/kubectl/).
{{< /note >}}

## Stwórz Serwis {#create-a-service}

Domyślnie Pod jest dostępny tylko poprzez swój wewnętrzny adres IP
wewnątrz klastra Kubernetes. Aby kontener `hello-node` był
osiągalny spoza wirtualnej sieci Kubernetesa, musisz najpierw udostępnić
Pod jako [*Serwis*](/docs/concepts/services-networking/service/) Kubernetes.

{{< warning >}}
Kontener agnhost udostępnia endpoint /shell, który jest przydatny do
debugowania, ale niebezpieczny w przypadku wystawienia w publicznym internecie. Nie uruchamiaj
go na klastrze dostępnym z internetu ani w środowisku produkcyjnym.
{{< /warning >}}

1. Udostępnij Pod w Internecie przy pomocy polecenia `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    Opcja `--type=LoadBalancer` wskazuje, że
    chcesz udostępnić swój Serwis na zewnątrz klastra.

    Aplikacja, która jest umieszczona w obrazie kontenera, nasłuchuje jedynie na porcie TCP 8080. Jeśli użyłeś
    `kubectl expose` do wystawienia innego portu, aplikacje klienckie mogą nie móc się podłączyć do tamtego innego portu.

2. Sprawdź Serwis, który właśnie utworzyłeś:

    ```shell
    kubectl get services
    ```

    Wynik powinien wyglądać podobnie do:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    U dostawców usług chmurowych, którzy obsługują
    *load balancers*, zostanie przydzielony zewnętrzny adres IP
    na potrzeby serwisu. W minikube, serwis typu
    `LoadBalancer` można udostępnić poprzez polecenie `minikube service`.

3. Uruchom poniższe polecenie:

    ```shell
    minikube service hello-node
    ```

    Otworzy sie okno przeglądarki obsługującej twoją aplikację i wyświetli odpowiedź tej aplikacji.

## Włącz dodatki {#enable-addons}

Narzędzie minikube dysponuje zestawem wbudowanych {{< glossary_tooltip text="dodatków" term_id="addons" >}}, które mogą być włączane, wyłączane i otwierane w lokalnym środowisku Kubernetes.

1. Lista aktualnie obsługiwanych dodatków:

    ```shell
    minikube addons list
    ```

    Wynik powinien wyglądać podobnie do:

    ```
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
    ```

1. Włącz dodatek, na przykład `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    Wynik powinien wyglądać podobnie do:

    ```
    The 'metrics-server' addon is enabled
    ```

3. Sprawdź Pody i Serwisy, który właśnie stworzyłeś:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    Wynik powinien wyglądać podobnie do:

    ```
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
    pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
    pod/metrics-server-67fb648c5                1/1       Running   0          26s
    pod/etcd-minikube                           1/1       Running   0          34m
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-apiserver-minikube                 1/1       Running   0          34m
    pod/kube-controller-manager-minikube        1/1       Running   0          34m
    pod/kube-proxy-rnlps                        1/1       Running   0          34m
    pod/kube-scheduler-minikube                 1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

1. Sprawdź wynik z `metrics-server`:

    ```shell
    kubectl top pods
    ```

    Wynik powinien wyglądać podobnie do:

    ```
    NAME                         CPU(cores)   MEMORY(bytes)
    hello-node-ccf4b9788-4jn97   1m           6Mi
    ```

    Jeśli zobaczysz następującą wiadomość, poczekaj i spróbuj ponownie:

    ```
    error: Metrics API not available
    ```

1. Wyłącz dodatek `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    Wynik powinien wyglądać podobnie do:

    ```
    metrics-server was successfully disabled
    ```

## Porządkujemy po sobie {#clean-up}

Teraz jest czas na wyczyszczenie zasobów, które utworzyłeś w klastrze:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Zatrzymaj wirtualną maszynę Minikube (VM):

```shell
minikube stop
```

(Opcjonalnie) Skasuj Minikube VM:

```shell
# Optional
minikube delete
```

Jeżeli planujesz ponownie używać minikube do dalszej nauki Kubernetesa, nie musisz go usuwać.

## Wniosek {#conclusion}

Ta strona obejmowała podstawowe aspekty dotyczące uruchomienia klastra minikube. Teraz jesteś gotowy do wdrażania aplikacji.

## {{% heading "whatsnext" %}}


* Samouczek _[Jak użyć kubectl do tworzenia Deploymentu](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* Dowiedz się więcej o [obiektach typu Deployment](/docs/concepts/workloads/controllers/deployment/).
* Dowiedz się więcej o [instalowaniu aplikacji](/docs/tasks/run-application/run-stateless-application-deployment/).
* Dowiedz się więcej o [obiektach typu Serwis](/docs/concepts/services-networking/service/).

