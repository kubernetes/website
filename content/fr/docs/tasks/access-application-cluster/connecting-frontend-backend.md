---
title: Connecter un Frontend à un Backend en utilisant les Services
content_type: tutorial
weight: 70
---

<!-- overview -->
Cette tâche montre comment créer un microservice _frontend_ et un microservice _backend_. 
Le backend renvoie un message de salutations à chaque requête.
Le frontend expose le backend en utilisant Nginx et un {{< glossary_tooltip term_id="service" >}} Kubernetes.

## {{% heading "objectives" %}}

* Créer et exécuter un microservice backend `hello` en utilisant un {{< glossary_tooltip term_id="deployment" >}}.
* Utiliser un Service pour envoyer du trafic vers les multiples réplicas du microservice backend.
* Créer et exécuter un microservice frontend `nginx`, en utilisant également un Deployment.
* Configurer le microservice frontend pour envoyer du trafic vers le microservice backend.
* Utiliser un Service de type `LoadBalancer` pour exposer le microservice frontend en dehors du cluster.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Cette tâche utilise les [Services avec des équilibreurs de charge externes](/docs/tasks/access-application-cluster/create-external-load-balancer/), 
qui nécessitent un environnement spécifique. 
Si votre environnement ne prend pas en charge cette fonction, vous pouvez utiliser un Service de type 
[NodePort](/docs/concepts/services-networking/service/#type-nodeport) à la place.

<!-- lessoncontent -->

## Création du backend à l'aide d'un Deployment

Le backend est un simple microservice de salutations.
Voici le fichier de configuration pour le Deployment backend :

{{% codenew file="service/access/backend-deployment.yaml" %}}

Créez le Deployment backend :

```shell
kubectl apply -f https://k8s.io/examples/service/access/backend-deployment.yaml
```

Affichez les informations du Deployment:

```shell
kubectl describe deployment backend
```

Le retour sera similaire à celui-ci:

```
Name:                           backend
Namespace:                      default
CreationTimestamp:              Mon, 24 Oct 2016 14:21:02 -0700
Labels:                         app=hello
                                tier=backend
                                track=stable
Annotations:                    deployment.kubernetes.io/revision=1
Selector:                       app=hello,tier=backend,track=stable
Replicas:                       3 desired | 3 updated | 3 total | 3 available | 0 unavailable
StrategyType:                   RollingUpdate
MinReadySeconds:                0
RollingUpdateStrategy:          1 max unavailable, 1 max surge
Pod Template:
  Labels:       app=hello
                tier=backend
                track=stable
  Containers:
   hello:
    Image:              "gcr.io/google-samples/hello-go-gke:1.0"
    Port:               80/TCP
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
OldReplicaSets:                 <none>
NewReplicaSet:                  hello-3621623197 (3/3 replicas created)
Events:
...
```
## Création du Service `hello`

La solution pour envoyer des requêtes d'un frontend vers un backend est le Service `backend`. 
Un Service crée une adresse IP persistante et un enregistrement DNS afin que le microservice backend puisse toujours être joignable. 
Un Service utilise des {{< glossary_tooltip text="sélecteurs" term_id="selector" >}} pour trouver les Pods vers lesquels acheminer le trafic.

Tout d'abord, explorez le fichier de configuration du Service :

{{% codenew file="service/access/backend-service.yaml" %}}

Dans le fichier de configuration, vous pouvez voir que le Service, 
nommé `hello`, achemine le trafic vers les Pods ayant les labels `app: hello` et `tier: backend`.

Créez le Service backend :

```shell
kubectl apply -f https://k8s.io/examples/service/access/backend-service.yaml
```

À ce stade, vous avez un Deployment `backend` exécutant trois réplicas de votre application `hello`, 
et un Service capable d'acheminer le trafic vers celles-ci. 
Cependant, ce service n'est ni disponible, ni résolvable en dehors du cluster.

## Création du frontend

Maintenant que votre backend est opérationnel, 
vous pouvez créer un frontend accessible en dehors du cluster, 
qui se connecte au backend en acheminant les requêtes vers celui-ci.

Le frontend envoie des requêtes aux Pods du backend en utilisant le nom DNS attribué au Service backend. 
Le nom DNS est `hello`, qui est la valeur du champ `name` 
dans le fichier de configuration `examples/service/access/backend-service.yaml`.

Les Pods du frontend Deployment exécutent une image nginx 
configurée pour acheminer les requêtes vers le Service backend `hello`. 
Voici le fichier de configuration nginx :

{{% codenew file="service/access/frontend-nginx.conf" %}}

Comme pour le backend, le frontend dispose d'un Deployment et d'un Service. 
Une différence importante à noter entre les services backend et frontend est que 
le Service frontend est configuré avec un `type: LoadBalancer`, ce qui signifie que le Service utilise 
un équilibreur de charge provisionné par votre fournisseur de cloud et sera accessible depuis l'extérieur du cluster.

{{% codenew file="service/access/frontend-service.yaml" %}}

{{% codenew file="service/access/frontend-deployment.yaml" %}}

Créez le Deployment et le Service frontend :

```shell
kubectl apply -f https://k8s.io/examples/service/access/frontend-deployment.yaml
kubectl apply -f https://k8s.io/examples/service/access/frontend-service.yaml
```

Le retour valide la création des deux ressources:

```
deployment.apps/frontend created
service/frontend created
```

{{< note >}}
La configuration de nginx est présente dans 
[l'image du container](/examples/service/access/Dockerfile). Une meilleure approche serait
d'utiliser une [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/),
afin de pouvoir changer la configuration plus facilement.
{{< /note >}}

## Interagir avec le Service frontend

Une fois que vous avez créé un Service de type LoadBalancer, vous pouvez utiliser cette commande pour trouver l'IP externe :

```shell
kubectl get service frontend --watch
```

Cela affiche la configuration du Service `frontend` et surveille les changements. 
Initialement, l'IP externe est indiquée comme `<pending>` :

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   <pending>     80/TCP   10s
```

Dès qu'une IP externe est attribuée, cependant, 
la configuration est mise à jour pour inclure la nouvelle IP sous l'en-tête `EXTERNAL-IP` :

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   XXX.XXX.XXX.XXX    80/TCP   1m
```

Cette IP peut maintenant être utilisée pour interagir avec le service `frontend` depuis l'extérieur du cluster.

## Envoyer du trafic via le frontend

Le frontend et le backend sont maintenant connectés. 
Vous pouvez accéder à l'endpoint en utilisant la commande curl sur l'IP externe de votre Service frontend.

```shell
curl http://${EXTERNAL_IP} # à remplacer par l'ip externe affichée précédemment
```

Le résultat affiche le message généré par le backend :

```json
{"message":"Hello"}
```

## {{% heading "cleanup" %}}

Pour supprimer les Services, saisissez cette commande :

```shell
kubectl delete services frontend backend
```

Pour supprimer les Deployments, les ReplicaSets et les Pods qui exécutent les applications backend et frontend, 
saisissez cette commande :

```shell
kubectl delete deployment frontend backend
```

## {{% heading "whatsnext" %}}

* En savoir plus sur les [Services](/docs/concepts/services-networking/service/)
* En savoir plus sur les [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)
* En savoir plus sur le [DNS pour les Services et les Pods](/docs/concepts/services-networking/dns-pod-service/)