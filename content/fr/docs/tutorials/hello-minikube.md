---
title: Bienvenue sur Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

Ce tutoriel vous montre comment exécuter une application exemple sur Kubernetes en utilisant minikube.
Le tutoriel fournit une image de conteneur qui utilise NGINX pour renvoyer toutes les requêtes.

## {{% heading "objectifs" %}}

* Déployer une application exemple sur minikube.
* Exécuter l'application.
* Afficher les journaux de l'application.

## {{% heading "prérequis²" %}}


Ce tutoriel suppose que vous avez déjà configuré `minikube`.
Voir __Étape 1__ dans [minikube start](https://minikube.pour les instructions d'installation installation instructions.
{{< note >}}
Exécutez uniquement les instructions de l'__Étape 1, Installation__. Le reste est couvert sur cette page. 
{{< /note >}}

Vous devez également installer `kubectl`.
Voir [Installer les outils](/docs/tasks/tools/#kubectl) pour les instructions d'installation.


<!-- lessoncontent -->

## Créer un cluster minikube

```shell
minikube start
```

## Ouvrir le Tableau de bord

Ouvrez le tableau de bord Kubernetes. Vous pouvez le faire de deux façons différentes :

{{< tabs name="dashboard" >}}
{{% tab name="Launch a browser" %}}
Ouvrez un **nouveau** terminal, et exécutez:
```shell
# Démarrez un nouveau terminal et laissez-le en cours d'exécution..
minikube dashboard
```

Maintenant, revenez au terminal où vous avez exécuté `minikube start`.

{{< note >}}
La commande `dashboard` active l'extension du tableau de bord et ouvre le proxy dans le navigateur par défaut.
Vous pouvez créer des ressources Kubernetes sur le tableau de bord, telles que Deployment et Service.

Pour savoir comment éviter d'invoquer directement le navigateur à partir du terminal et obtenir une URL pour le tableau de bord Web, consultez l'onglet "Copier et coller l'URL".

Par défaut, le tableau de bord n'est accessible que depuis le réseau virtuel interne de Kubernetes. La commande `dashboard` crée un proxy temporaire pour rendre le tableau de bord accessible depuis l'extérieur du réseau virtuel Kubernetes.

Pour arrêter le proxy, exécutez `Ctrl+C` pour quitter le processus. Une fois la commande terminée, le tableau de bord reste en cours d'exécution dans le cluster Kubernetes. Vous pouvez exécuter à nouveau la commande `dashboard` pour créer un autre proxy pour accéder au tableau de bord.
{{< /note >}}

{{% /tab %}}
{{% tab name="Copier et coller l'URL" %}}

Si vous ne souhaitez pas que minikube ouvre un navigateur pour vous, exécutez la sous-commande `dashboard` avec le drapeau `--url`. `minikube` affiche une URL que vous pouvez ouvrir dans le navigateur de votre choix.

Ouvrez un **nouveau** terminal et exécutez:
```shell
# Démarrez un nouveau terminal et laissez-le en cours d'exécution.
minikube dashboard --url
```

Maintenant, vous pouvez utiliser cette URL et revenir au terminal où vous avez exécuté `minikube start`.

{{% /tab %}}
{{< /tabs >}}

## Créer un Deployment

Un [*Pod*](/docs/concepts/workloads/pods/) Kubernetes est un groupe de un ou plusieurs conteneurs, liés ensemble pour les besoins de l'administration et du réseau. Le Pod de ce tutoriel n'a qu'un seul conteneur. Un [*Deployment*](/docs/concepts/workloads/controllers/deployment/) Kubernetes vérifie l'état de santé de votre Pod et redémarre le conteneur du Pod s'il se termine. Les Deployments sont la méthode recommandée pour gérer la création et la mise à l'échelle des Pods.

1. Utilisez la commande `kubectl` create pour créer un Deployment qui gère un Pod. Le Pod exécute un conteneur basé sur l'image Docker fournie.

    ```shell
    # Exécutez une image de conteneur de test qui inclut un serveur web
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
    ```

2. Afficher le Deployment:

    ```shell
    kubectl get deployments
    ```

    La sortie ressemble à:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

    (Il peut s'écouler un certain temps avant que le pod ne soit disponible. Si vous voyez "0/1", réessayez dans quelques secondes.)

3. Afficher le Pod:

    ```shell
    kubectl get pods
    ```

    La sortie ressemble à:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. Afficher les événements du cluster:

    ```shell
    kubectl get events
    ```

5. Afficher la configuration `kubectl`:

    ```shell
    kubectl config view
    ```

6. Afficher les journaux de l'application pour un conteneur dans un pod (remplacez le nom du pod par celui que vous avez obtenu avec la commande `kubectl get pods`).
   
   {{< note >}}
   Remplacez `hello-node-5f76cf6ccf-br9b5` dans la commande `kubectl logs` par le nom du pod de la sortie de la commande `kubectl get pods`.
   {{< /note >}}
   
   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

   La sortie ressemble à:

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```


{{< note >}}
Pour plus d'informations sur les commandes `kubectl`, consultez la [kubectl overview](/docs/reference/kubectl/).
{{< /note >}}

## Créer un Service

Par défaut, le Pod est accessible uniquement par son adresse IP interne au sein du réseau Kubernetes. Pour rendre le conteneur `hello-node` accessible depuis l'extérieur du réseau virtuel Kubernetes, vous devez exposer le Pod en tant que Kubernetes [*Service*](/docs/concepts/services-networking/service/).

{{< warning >}}
Le conteneur agnhost a un point de terminaison `/shell`, qui est utile pour le débogage, mais dangereux à exposer à Internet. Ne l'exécutez pas sur un cluster Internet-facing ou un cluster de production.
{{< /warning >}}

1. Exposez le Pod au réseau public en utilisant la commande `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    Le drapeau `--type=LoadBalancer` indique que vous souhaitez exposer votre Service en dehors du cluster.

    Le code de l'application à l'intérieur de l'image de test ne répond qu'aux requêtes sur le port TCP 8080. Si vous avez utilisé `kubectl expose` pour exposer un port différent, les clients ne pourront pas se connecter à ce port.

2. Afficher le Service que vous avez créé:

    ```shell
    kubectl get services
    ```

    La sortie ressemble à:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    Sur les fournisseurs de cloud qui prennent en charge les équilibreurs de charge, Une adresse IP externe sera provisionnée pour accéder au Service. Sur minikube, le type `LoadBalancer` rend le Service accessible via la commande `minikube service`.

3. Exécutez la commande suivante:

    ```shell
    minikube service hello-node
    ```

    Cette commande ouvre une fenêtre de navigateur qui sert votre application et affiche la réponse de l'application.

## Activer les extensions

La commande `minikube` inclut un ensemble intégré d'{{< glossary_tooltip text="addons" term_id="addons" >}} qui peuvent être activés, désactivés et ouverts dans l'environnement local Kubernetes.

1. Liste des extensions pris en charge actuellement:

    ```shell
    minikube addons list
    ```

    La sortie ressemble à:

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

2. Activer une extension, par exemple, `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    La sortie ressemble à:

    ```
    The 'metrics-server' addon is enabled
    ```

3. Afficher le Pod et le Service que vous avez créés en installant cette extension:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    La sortie devrait être simulaire à :

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

4. Vérifier la sortie de `metrics-server`:

    ```shell
    kubectl top pods
    ```

    La sortie ressemble à:

    ```
    NAME                         CPU(cores)   MEMORY(bytes)   
    hello-node-ccf4b9788-4jn97   1m           6Mi             
    ```

    Si vous voyez le message suivant, attendez un peu et réessayez:

    ```
    error: Metrics API not available
    ```

5. Désactiver `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    La sortie ressemble à:

    ```
    metrics-server was successfully disabled
    ```

## Nettoyage

Vous pouvez maintenant nettoyer les ressources que vous avez créées dans votre cluster:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Si nécessaire, arrêtez la machine virtuelle Minikube (VM)

```shell
minikube stop
```

Si nécessaire, effacez la VM Minikube:

```shell
# Facultatif
minikube delete
```

Si vous souhaitez à nouveau utiliser minikube pour en apprendre davantage sur Kubernetes, vous n'avez pas besoin de le supprimer.

## Conclusion

Cette page a couvert les aspects de base pour mettre en route un cluster minikube. Vous êtes maintenant prêt à déployer des applications.

## {{% heading "whatsnext" %}}


* Tutoriel pour _[déployer votre première application sur Kubernetes avec kubectl.](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* En savoir plus sur les [objets Deployment](/docs/concepts/workloads/controllers/deployment/).
* En savoir plus sur le [déploiement d'applications](/docs/tasks/run-application/run-stateless-application-deployment/).
* En savoir plus sur les [objets Service](/docs/concepts/services-networking/service/).

