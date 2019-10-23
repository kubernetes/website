---
title: Hello Minikube
content_template: templates/tutorial
weight: 5
description: Tutoriel Minikube
menu:
  main:
    title: "Démarrer"
    weight: 10
    post: >
      <p>Prêt à mettre les mains dans le cambouis ? Créez un cluster Kubernetes simple qui exécute "Hello World" avec Node.js.</p>>.
card: 
  name: tutorials
  weight: 10
---

{{% capture overview %}}

Ce tutoriel vous montre comment exécuter une simple application Hello World Node.js sur Kubernetes en utilisant [Minikube](/docs/getting-start-guides/minikube) et Katacoda.
Katacoda fournit un environnement Kubernetes gratuit dans le navigateur.

{{< note >}}
Vous pouvez également suivre ce tutoriel si vous avez installé [Minikube localement](/docs/tasks/tools/install-minikube/).
{{< /note >}}

{{% /capture %}}

{{% capture objectives %}}

* Déployez une application Hello World sur Minikube.
* Lancez l'application.
* Afficher les journaux des applications.

{{% /capture %}}

{{% capture prerequisites %}}

Ce tutoriel fournit une image de conteneur construite à partir des fichiers suivants :

{{< codenew language="js" file="minikube/server.js" >}}

{{< codenew language="conf" file="minikube/Dockerfile" >}}

Pour plus d'informations sur la commande `docker build`, lisez la documentation de [Docker](https://docs.docker.com/engine/reference/commandline/build/).

{{% /capture %}}

{{% capture lessoncontent %}}

## Créer un cluster Minikube

1. Cliquez sur **Lancer le terminal**.

    {{< kat-button >}}

    {{< note >}} Si vous avez installé Minikube localement, lancez `minikube start`. {{< /note >}}

2. Ouvrez le tableau de bord Kubernetes dans un navigateur :

    ```shell
    minikube dashboard
    ```

3. Environnement Katacoda seulement : En haut du volet du terminal, cliquez sur le signe plus, puis cliquez sur **Sélectionner le port pour afficher sur l'hôte 1**.

4. Environnement Katacoda seulement : Tapez `30000`, puis cliquez sur **Afficher le port**.

## Créer un déploiement

Un [*Pod*](/docs/concepts/workloads/pods/pods/pod/) Kubernetes est un groupe d'un ou plusieurs conteneurs, liés entre eux à des fins d'administration et de mise en réseau.
Dans ce tutoriel, le Pod n'a qu'un seul conteneur.
Un [*Déploiement*](/docs/concepts/workloads/controllers/deployment/) Kubernetes vérifie l'état de santé de votre Pod et redémarre le conteneur du Pod s'il se termine.
Les déploiements sont le moyen recommandé pour gérer la création et la mise à l'échelle des Pods.

1. Utilisez la commande `kubectl create` pour créer un déploiement qui gère un Pod. Le
Pod utilise un conteneur basé sur l'image Docker fournie.

    ```shell
    kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node
    ```

2. Affichez le déploiement :

    ```shell
    kubectl get deployments
    ```

    Sortie :

    ```shell
    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1         1         1            1           1m
    ```

3. Voir le Pod :

    ```shell
    kubectl get pods
    ```
    Sortie :

    ```shell
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. Afficher les événements du cluster :

    ```shell
    kubectl get events
    ```

5. Voir la configuration de `kubectl` :

    ```shell
    kubectl config view
    ```

    {{< note >}}Pour plus d'informations sur les commandes `kubectl`, voir la [vue d'ensemble de kubectl](/docs/user-guide/kubectl-overview/) {{< /note >}}.

## Créer un service

Par défaut, le Pod n'est accessible que par son adresse IP interne dans le cluster Kubernetes.
Pour rendre le conteneur `hello-node` accessible depuis l'extérieur du réseau virtuel Kubernetes, vous devez exposer le Pod comme un [*Service*](/docs/concepts/services-networking/service/) Kubernetes.

1. Exposez le Pod à internet en utilisant la commande `kubectl expose` :

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    L'indicateur `--type=LoadBalancer` indique que vous voulez exposer votre Service
    à l'extérieur du cluster.

2. Affichez le Service que vous venez de créer :

    ```shell
    kubectl get services
    ```

    Sortie :

    ```shell
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    Sur les fournisseurs de cloud qui supportent les load balancers, une adresse IP externe serait fournie pour accéder au Service.
    Sur Minikube, le type `LoadBalancer` rend le Service accessible via la commande `minikube service`.

3. Exécutez la commande suivante :

    ```shell
    minikube service hello-node
    ```

4. Environnement Katacoda seulement : Cliquez sur le signe plus, puis cliquez sur **Sélectionner le port pour afficher sur l'hôte 1**.

5. Environnement Katacoda seulement : Tapez `30369` (voir port en face de `8080` dans la sortie services), puis cliquez sur **Afficher le port**.

    Cela ouvre une fenêtre de navigateur qui sert votre application et affiche le message `Hello World`.

## Activer les extensions

Minikube dispose d'un ensemble d'extensions intégrées qui peuvent être activées, désactivées et ouvertes dans l'environnement Kubernetes local.

1. Énumérer les extensions actuellement pris en charge :

    ```shell
    minikube addons list
    ```

    Sortie:

    ```
    addon-manager: enabled
    coredns: disabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    heapster: disabled
    ingress: disabled
    kube-dns: enabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    ```

2. Activez une extension, par exemple, `heapster` :

    ```shell
    minikube addons enable heapster
    ```

    Sortie :

    ```shell
    heapster was successfully enabled
    ```

3. Affichez le pod et le service que vous venez de créer :

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    Sortie :

    ```shell
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/heapster-9jttx                          1/1       Running   0          26s
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-dns-6dcb57bcc8-gv7mw               3/3       Running   0          34m
    pod/kubernetes-dashboard-5498ccf677-cgspw   1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/heapster               ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/kubernetes-dashboard   NodePort    10.109.29.1     <none>        80:30000/TCP        34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

4. Désactivez `heapster` :

    ```shell
    minikube addons disable heapster
    ```

    Sortie :

    ```shell
    heapster was successfully disabled
    ```

## Nettoyage

Vous pouvez maintenant nettoyer les ressources que vous avez créées dans votre cluster :

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Si nécessaire, arrêtez la machine virtuelle Minikube (VM) :

```shell
minikube stop
```

Si nécessaire, effacez la VM Minikube :

```shell
minikube delete
```

{{% /capture %}}

{{% capture whatsnext %}}

* En savoir plus sur les [déploiement](/docs/concepts/workloads/controllers/deployment/).
* En savoir plus sur le [Déploiement d'applications](/docs/user-guide/deploying-applications/).
* En savoir plus sur les [Services](/docs/concepts/services-networking/service/).

{{% /capture %}}
