---
title: Hello Minikube
content_template: templates/tutorial
weight: 5
menu:
  main:
    title: "Jak zacząć?"
    weight: 10
    post: >
      <p>Jesteś gotowy ubrudzić ręce? Zbuduj własny klaster kubernetes z działającą na nim aplikacją "Hello World" w Node.js.</p>
card:
  name: tutorials
  weight: 10
---

{{% capture overview %}}

Ten samouczek pokaże, jak uruchomić prostą aplikację Hello World w Node.js
na Kubernetes przy użyciu [Minikube](/docs/setup/learning-environment/minikube) oraz Katacoda.
Katacoda to darmowe środowisko Kubernetes dostępne bezpośrednio z przeglądarki web.

{{< note >}}
Możesz też skorzystać z tego samouczka, jeśli już zainstalowałeś [Minikube lokalnie](/docs/tasks/tools/install-minikube/).
{{< /note >}}

{{% /capture %}}

{{% capture objectives %}}

* Skonfiguruj aplikację *hello world* do uruchomienia w Minikube.
* Uruchom aplikację.
* Przejrzyj jej logi.

{{% /capture %}}

{{% capture prerequisites %}}

W tym samouczku wykorzystamy obraz kontenera zbudowany z następujących plików:

{{< codenew language="js" file="minikube/server.js" >}}

{{< codenew language="conf" file="minikube/Dockerfile" >}}

Więcej informacji na temat polecenia `docker build` znajdziesz w [dokumentacji Dockera](https://docs.docker.com/engine/reference/commandline/build/).

{{% /capture %}}

{{% capture lessoncontent %}}

## Stwórz klaster Minikube

1. Kliknij w **Launch Terminal**

    {{< kat-button >}}

    {{< note >}}Jeśli masz Minikube zainstalowane lokalnie, uruchom `minikube start`.{{< /note >}}

2. Otwórz panel Kubernetes w przeglądarce:

    ```shell
    minikube dashboard
    ```

3. Tylko w Katacoda: Na górze okienka z terminalem kliknij na znak plus, a następnie wybierz **Select port to view on Host 1**.

4. Tylko w Katacoda: Wpisz `30000`i kliknij **Display Port**.

## Stwórz Deployment

[*Pod*](/docs/concepts/workloads/pods/pod/) w Kubernetes to grupa jednego lub wielu kontenerów połączonych ze sobą
na potrzeby administrowania i dostępu sieci. W tym samouczku Pod zawiera tylko jeden kontener.
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) w Kubernetes monitoruje stan twojego Poda
i restartuje należący do niego kontener, jeśli ten z jakichś powodów przestanie działać.
Użycie Deploymentu to rekomendowana metoda zarządzania tworzeniem i skalowaniem Podów.

1. Użyj polecenia `kubectl create` do stworzenia Deploymentu, który będzie zarządzał Podem. Pod uruchamia kontener
wykorzystując podany obraz Dockera.

    ```shell
    kubectl create deployment hello-node --image=k8s.gcr.io/echoserver:1.4
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

    {{< note >}}Więcej informacji na temat polecenia `kubectl` znajdziesz w [przeglądzie kubectl](/docs/user-guide/kubectl-overview/).{{< /note >}}

## Stwórz Serwis

Domyślnie Pod jest dostępny tylko poprzez swój wewnętrzny adres IP wewnątrz klastra
Kubernetes. Aby kontener `hello-node` był osiągalny spoza wirtualnej sieci Kubernetes,
musisz najpierw wystawić Pod jako [*Serwis*](/docs/concepts/services-networking/service/) Kubernetes, na który można będzie dostać się z zewnątrz.

1. Udostępnij Pod w Internecie przy pomocy polecenia `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    Opcja `--type=LoadBalancer` wskazuje, że chcesz udostępnić swój Serwis
    na zewnątrz klastra.

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
    W Minikube, typ `LoadBalancer` udostępnia serwis poprzez polecenie `minikube service`.

3. Uruchom poniższe polecenie:

    ```shell
    minikube service hello-node
    ```

4. Tylko w Katacoda: Kliknij znak plus, a następnie **Select port to view on Host 1**.

5. Tylko w Katacoda: Wpisz `30369` (sprawdź numer portu obok `8080` w opisie Serwisu) i kliknij **Display Port**

    Otworzy sie okno przeglądarki obsługującej twoją aplikację i wyświetli w nim komunikat "Hello World".

## Włącz dodatki

Minikube ma zestaw wbudowanych {{< glossary_tooltip text="dodatków" term_id="addons" >}}, które mogą być włączane, wyłączane i otwierane w lokalnym środowisku Kubernetes.

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
    metrics-server was successfully enabled
    ```

3. Sprawdź Pod i Serwis, który właśnie stworzyłeś:

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
    heapster was successfully metrics-server
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

{{% /capture %}}

{{% capture whatsnext %}}

* Dowiedz się więcej o [obiektach typu Deployment](/docs/concepts/workloads/controllers/deployment/).
* Dowiedz się więcej o [instalowaniu aplikacji](/docs/tasks/run-application/run-stateless-application-deployment/).
* Dowiedz się więcej o [obiektach typu Serwis](/docs/concepts/services-networking/service/).

{{% /capture %}}
