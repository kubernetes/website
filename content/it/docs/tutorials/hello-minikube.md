---
title: Hello Minikube
content_type: tutorial
weight: 5
menu:
  main:
    title: "Cominciamo!"
    weight: 10
    post: >
      <p>Sei pronto a cominciare con Kubernetes? Crea un Kubernetes cluster ed esegui un'appliczione di esempio.</p>
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

Questo tutorial mostra come eseguire una semplice applicazione in Kubernetes
utilizzando [Minikube](/docs/setup/learning-environment/minikube) e Katacoda.
Katacoda permette di operare su un'installazione di Kubernetes dal tuo browser.

{{< note >}}
Come alternativa, è possibile eseguire questo tutorial [installando minikube](/docs/tasks/tools/install-minikube/) localmente.
{{< /note >}}



## {{% heading "objectives" %}}


* Rilasciare una semplice applicazione su Minikube.
* Eseguire l'applicazione.
* Visualizzare i log dell'applicazione.



## {{% heading "prerequisites" %}}


Questo tutorial fornisce una container image che utilizza NGINX per risponde a tutte le richieste
con un echo che visualizza i dati della richiesta stessa.



<!-- lessoncontent -->

## Crea un Minikube cluster

1. Click **Launch Terminal**

    {{< kat-button >}}

    {{< note >}}Se hai installato Minikube localmente, esegui `minikube start`.{{< /note >}}

2. Apri la console di Kubernetes nel browser:

    ```shell
    minikube dashboard
    ```

3. Katacoda environment only: In alto alla finestra del terminale, fai click segno più, e a seguire click su **Select port to view on Host 1**.

4. Katacoda environment only: Inserisci `30000`, a seguire click su **Display Port**.

## Crea un Deployment

Un Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) è un gruppo di uno o più Containers,
che sono uniti tra loro dal punto di vista amministrativo e che condividono lo stesso network.  
Il Pod in questo tutorial ha un solo Container. Un Kubernetes
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) monitora lo stato del Pod ed
eventualmente provvedere a farlo ripartire nel caso questo termini. L'uso dei Deployments è la
modalità raccomandata per gestire la creazione e lo scaling dei Pods.


1. Usa il comando `kubectl create` per creare un Deployment che gestisce un singolo Pod. Il Pod
eseguirà un Container basato sulla Docker image specificata.

    ```shell
    kubectl create deployment hello-node --image=registry.k8s.io/echoserver:1.4
    ```

2. Visualizza il Deployment:

    ```shell
    kubectl get deployments
    ```

    L'output del comando è simile a:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

3. Visualizza il Pod creato dal Deployment:

    ```shell
    kubectl get pods
    ```

    L'output del comando è simile a:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. Visualizza gli eventi del cluster Kubernetes:

    ```shell
    kubectl get events
    ```

5. Visualizza la configurazione di `kubectl`:

    ```shell
    kubectl config view
    ```

{{< note >}}Per maggiori informazioni sui comandi di `kubectl`, vedi [kubectl overview](/docs/user-guide/kubectl-overview/).{{< /note >}}

## Crea un Service

Con le impostazioni di default, un Pod è accessibile solamente dagli indirizzi IP interni
al Kubernetes cluster. Per far si che il Container `hello-node` sia accessibile dall'esterno
del Kubernetes virtual network, è necessario esporre il Pod utilizzando un
Kubernetes [*Service*](/docs/concepts/services-networking/service/).

1. Esponi il Pod su internet untilizzando il comando `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    Il flag `--type=LoadBalancer` indica la volontà di esporre il Service
    all'esterno del Kubernetes cluster.

2. Visualizza il Servizio appena creato:

    ```shell
    kubectl get services
    ```

    L'output del comando è simile a:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    Nei cloud providers che supportano i servizi di tipo load balancers,
    viene fornito un indirizzo IP pubblico per permettere l'acesso al Service. Su Minikube,
    il service type `LoadBalancer` rende il Service accessibile attraverso il comando `minikube service`.

3. Esegui il comando:

    ```shell
    minikube service hello-node
    ```

4. Katacoda environment only: Fai click segno più, e a seguire click su **Select port to view on Host 1**.

5. Katacoda environment only: Fai attenzione al numero di 5 cifre visualizzato a fianco di `8080` nell'output del comando. Questo port number è generato casualmente e può essere diverso nel tuo caso. Inserisci il tuo port number nella textbox, e a seguire fai click su Display Port. Nell'esempio precedente, avresti scritto `30369`.

    Questo apre un finestra nel browser dove l'applicazione visuallizza l'echo delle richieste ricevute.

## Attiva gli addons

Minikube include un set {{< glossary_tooltip text="addons" term_id="addons" >}} che possono essere attivati, disattivati o eseguti nel ambiente Kubernetes locale.

1. Elenca gli addons disponibili:

    ```shell
    minikube addons list
    ```

    L'output del comando è simile a:

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

2. Attiva un addon, per esempio, `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    L'output del comando è simile a:

    ```
    metrics-server was successfully enabled
    ```

3. Visualizza i Pods ed i Service creati in precedenza:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    L'output del comando è simile a:

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

4. Disabilita `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    L'output del comando è simile a:

    ```
    metrics-server was successfully disabled
    ```

## Clean up

Adesso puoi procedere a fare clean up delle risorse che hai creato nel tuo cluster:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Eventualmente, puoi stoppare la Minikube virtual machine (VM):

```shell
minikube stop
```

Eventualmente, puoi cancellare la Minikube VM:

```shell
minikube delete
```



## {{% heading "whatsnext" %}}


* Approfondisci la tua conoscenza dei [Deployments](/docs/concepts/workloads/controllers/deployment/).
* Approfondisci la tua conoscenza di [Rilasciare applicazioni](/docs/tasks/run-application/run-stateless-application-deployment/).
* Approfondisci la tua conoscenza dei [Services](/docs/concepts/services-networking/service/).


