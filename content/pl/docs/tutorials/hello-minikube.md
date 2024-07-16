---
title: Hello Minikube
content_type: tutorial
weight: 5
menu:
  main:
    title: "Jak zacząć?"
    weight: 10
    post: >
      <p>Jesteś gotowy ubrudzić ręce? Zbuduj własny klaster Kubernetes z działającą na nim przykładową aplikacją.</p>
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

Ten samouczek pokaże, jak uruchomić przykładową aplikację
na Kubernetesie przy użyciu minikube oraz Katacoda.
Katacoda to darmowe środowisko Kubernetes dostępne bezpośrednio z przeglądarki web.

{{< note >}}
Możesz też skorzystać z tego samouczka, jeśli już zainstalowałeś minikube.
Odwiedź stronę [minikube start](https://minikube.sigs.k8s.io/docs/start/), aby dowiedzieć się, jak go zainstalować.
{{< /note >}}

## {{% heading "objectives" %}}

* Skonfiguruj przykładową aplikację do uruchomienia w minikube.
* Uruchom aplikację.
* Przejrzyj jej logi.

## {{% heading "prerequisites" %}}

W tym samouczku wykorzystamy obraz kontenera, który korzysta z NGINX, aby wyświetlić z powrotem wszystkie przychodzące zapytania.

<!-- lessoncontent -->

## Stwórz klaster minikube

1. Kliknij w **Launch Terminal**

    {{< kat-button >}}

    {{< note >}}
    Jeśli masz minikube zainstalowane lokalnie, uruchom `minikube start`. Przed uruchomieniem `minikube dashboard`, otwórz okno nowego terminala, uruchom w nim `minikube dashboard` i przełącz się z powrotem do okna głównego terminala.
    {{< /note >}}

2. Otwórz panel Kubernetesa w przeglądarce:

    ```shell
    minikube dashboard
    ```

3. Tylko w Katacoda: Na górze okienka z terminalem kliknij na znak plus, a następnie wybierz **Select port to view on Host 1**.

4. Tylko w Katacoda: Wpisz `30000`i kliknij **Display Port**.

{{< note >}}
Polecenie `dashboard` uruchamia dodatek panelu i otwiera proxy w domyślnej przeglądarce.
W panelu można tworzyć różne obiekty Kubernetesa, takie jak _Deployment_ czy _Serwis_.

Jeśli pracujesz z uprawnieniami roota, skorzystaj z: [Otwieranie panelu poprzez URL](#otwieranie-panelu-poprzez-url).

Panel jest domyślnie dostępny jedynie z wewnętrznej sieci Kubernetesa.
Polecenie `dashboard` tworzy tymczasowe proxy, które udostępnia panel także poza tą wewnętrzną sieć.

Aby zatrzymać proxy, wciśnij `Ctrl+C` i zakończ proces.
Panel ciągle działa na klastrze Kubernetesa, nawet po przerwaniu działania proxy.
Aby dostać się ponownie do panelu, trzeba stworzyć kolejne proxy poleceniem `dashboard`.
{{< /note >}}

## Otwieranie panelu poprzez URL

Jeśli nie chcesz otwierać przeglądarki, uruchom panel z opcją `--url`, aby wyświetlić URL:

```shell
minikube dashboard --url
```

## Stwórz Deployment

[*Pod*](/docs/concepts/workloads/pods/) w Kubernetesie to grupa jednego lub wielu kontenerów
połączonych ze sobą na potrzeby administrowania i dostępu sieci. W tym samouczku Pod
zawiera tylko jeden kontener. [*Deployment*](/docs/concepts/workloads/controllers/deployment/)
w Kubernetesie monitoruje stan twojego Poda
i restartuje należące do niego kontenery, jeśli z jakichś powodów przestaną działać.
Użycie Deploymentu to rekomendowana metoda zarządzania tworzeniem i skalowaniem Podów.

1. Użyj polecenia `kubectl create` do stworzenia Deploymentu, który będzie zarządzał Podem. Pod uruchamia kontener
wykorzystując podany obraz Dockera.

    ```shell
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
    ```

2. Sprawdź stan Deploymentu:

    ```shell
    kubectl get deployments
    ```

    Wynik powinien wyglądać podobnie do:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

3. Sprawdź stan Poda:

    ```shell
    kubectl get pods
    ```

    Wynik powinien wyglądać podobnie do:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. Obejrzyj zdarzenia na klastrze:

    ```shell
    kubectl get events
    ```

5. Sprawdź konfigurację `kubectl`:

    ```shell
    kubectl config view
    ```

    {{< note >}}
    Więcej informacji na temat polecenia `kubectl` znajdziesz w [przeglądzie kubectl](/docs/reference/kubectl/).
    {{< /note >}}

## Stwórz Serwis

Domyślnie Pod jest dostępny tylko poprzez swój wewnętrzny adres IP
wewnątrz klastra Kubernetes. Aby kontener `hello-node` był osiągalny spoza
wirtualnej sieci Kubernetesa, musisz najpierw udostępnić Pod
jako [*Serwis*](/docs/concepts/services-networking/service/) Kubernetes.

1. Udostępnij Pod w Internecie przy pomocy polecenia `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    Opcja `--type=LoadBalancer` wskazuje, że chcesz udostępnić swój Serwis
    na zewnątrz klastra.

    Aplikacja, która jest umieszczona w obrazie kontenera `registry.k8s.io/echoserver`, nasłuchuje jedynie na porcie TCP 8080. Jeśli użyłeś
    `kubectl expose` do wystawienia innego portu, aplikacje klienckie mogą nie móc się podłączyć do tamtego innego portu.

2. Sprawdź Serwis, który właśnie utworzyłeś:

    ```
    kubectl get services
    ```

    Wynik powinien wyglądać podobnie do:

    ```shell
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    U dostawców usług chmurowych, którzy obsługują *load balancers*,
    zostanie przydzielony zewnętrzny adres IP na potrzeby serwisu.
    W minikube, serwis typu `LoadBalancer` można udostępnić poprzez polecenie
    `minikube service`.

3. Uruchom poniższe polecenie:

    ```shell
    minikube service hello-node
    ```

4. Tylko w Katacoda: Kliknij znak plus, a następnie **Select port to view on Host 1**.

5. Tylko w Katacoda: Wpisz `30369` (sprawdź numer portu obok `8080` w opisie Serwisu) i kliknij **Display Port**

    Otworzy sie okno przeglądarki obsługującej twoją aplikację i wyświetli odpowiedź tej aplikacji.

## Włącz dodatki

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

2. Włącz dodatek, na przykład `metrics-server`:

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

4. Wyłącz dodatek `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    Wynik powinien wyglądać podobnie do:

    ```
    metrics-server was successfully disabled
    ```

## Porządkujemy po sobie

Teraz jest czas na wyczyszczenie zasobów, które utworzyłeś w klastrze:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

(Opcjonalnie) Zatrzymaj wirtualną maszynę Minikube (VM):

```shell
minikube stop
```

(Opcjonalnie) Skasuj Minikube VM:

```shell
minikube delete
```

## {{% heading "whatsnext" %}}

* Dowiedz się więcej o [obiektach typu Deployment](/docs/concepts/workloads/controllers/deployment/).
* Dowiedz się więcej o [instalowaniu aplikacji](/docs/tasks/run-application/run-stateless-application-deployment/).
* Dowiedz się więcej o [obiektach typu Serwis](/docs/concepts/services-networking/service/).
