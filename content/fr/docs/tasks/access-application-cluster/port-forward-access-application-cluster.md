---
title: Utiliser le Port Forwarding pour accéder à des applications dans un cluster
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
---

<!-- overview -->

Cette page montre comment utiliser `kubectl port-forward` 
pour se connecter à un serveur MongoDB s'exécutant dans un cluster Kubernetes. 
Ce type de connexion peut être utile pour le debug d'une base de données.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* Installez [MongoDB Shell](https://www.mongodb.com/try/download/shell).

<!-- steps -->

## Création du déploiement et du service MongoDB

1. Créez un déploiement qui exécute MongoDB :

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-deployment.yaml
   ```

   Le résultat d'une commande réussie doit valider que le déploiement a bien été créé :

   ```
   deployment.apps/mongo créé
   ```

   Affichez l'état du pod pour vérifier qu'il est prêt :

   ```shell
   kubectl get pods
   ```

   Le résultat doit lister le pod créé :

   ```
   NOM                     PRÊT     STATUT    REDÉMARRAGES   ÂGE
   mongo-75f59d57f4-4nd6q   1/1     Running   0              2m4s
   ```

   Affichez l'état du déploiement :

   ```shell
   kubectl get deployment
   ```

   Le résultat affiche que le déploiement a bien été créé :

   ```
   NOM     PRÊT   ACTUALISÉ   DISPONIBLE   ÂGE
   mongo   1/1     1            1           2m21s
   ```

   Le déploiement gère automatiquement un ReplicaSet. Affichez l'état du ReplicaSet à l'aide de la commande :

   ```shell
   kubectl get replicaset
   ```

   Le résultat affiche que le ReplicaSet a bien été créé :

   ```
   NOM               DÉSIRÉ   ACTUEL   PRÊT   ÂGE
   mongo-75f59d57f4   1         1         1       3m12s
   ```

2. Créez un service pour exposer MongoDB sur le réseau :

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-service.yaml
   ```

   Le résultat d'une commande réussie vérifie que le service a été créé :

   ```
   service/mongo créé
   ```

   Vérifiez que le service a été créé :

   ```shell
   kubectl get service mongo
   ```

   Le résultat affiche le service qui vient d'être créé :

   ```
   NOM     TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     ÂGE
   mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
   ```

3. Vérifiez que le serveur MongoDB s'exécute dans le pod et écoute sur le port 27017 :

   ```shell
   # Changez mongo-75f59d57f4-4nd6q par le nom du pod
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```

   Le résultat affiche le port pour MongoDB dans ce pod :

   ```
   27017
   ```

   27017 est le port TCP attribué à MongoDB sur Internet.

## Rediriger un port local vers un port du pod

1. `kubectl port-forward` permet d'utiliser un nom de ressource, tel qu'un nom de pod, pour sélectionner un pod correspondant vers lequel rediriger le port.

   ```shell
   # Changez mongo-75f59d57f4-4nd6q par le nom du pod
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```

   qui est identique à

   ```shell
   kubectl port-forward pods/mongo-75f59d57f4-4nd6q 28015:27017
   ```

   ou

   ```shell
   kubectl port-forward deployment/mongo 28015:27017
   ```

   ou

   ```shell
   kubectl port-forward replicaset/mongo-75f59d57f4 28015:27017
   ```

   ou

   ```shell
   kubectl port-forward service/mongo 28015:27017
   ```

   N'importe laquelle des commandes ci-dessus fonctionne. Le résultat sera similaire à ceci :

   ```
   Forwarding from 127.0.0.1:28015 -> 27017
   Forwarding from [::1]:28015 -> 27017
   ```

   {{< note >}}
   `kubectl port-forward` ne se termine pas une fois le port-forward lancé. Pour continuer avec les exercices, vous devrez ouvrir un autre terminal.
   {{< /note >}}

2. Démarrez l'interface de ligne de commande MongoDB :

   ```shell
   mongosh --port 28015
   ```

3. Depuis la ligne de commande de MongoDB, entrez la commande `ping` :

   ```
   db.runCommand( { ping: 1 } )
   ```

   Une demande de ping réussie renvoie :

   ```
   { ok: 1 }
   ```

### Laisser _kubectl_ choisir le port local {#let-kubectl-choose-local-port}

Si vous n'avez pas besoin d'un port local précis, 
vous pouvez laisser `kubectl` choisir et attribuer le port local, 
vous évitant ainsi de gérer les conflits de ports locaux, avec cette syntaxe légèrement plus simple :

```shell
kubectl port-forward deployment/mongo :27017
```

`kubectl` trouvera un numéro de port local qui n'est pas utilisé 
(en évitant les numéros de ports bas, car ils pourraient être utilisés par d'autres applications). 
Le résultat sera similaire à :

```
Forwarding from 127.0.0.1:63753 -> 27017
Forwarding from [::1]:63753 -> 27017
```

<!-- discussion -->

## Discussion

Les connexions établies sur le port local 28015 sont redirigées vers le port 27017 du pod qui exécute le serveur MongoDB.
Avec cette connexion en place, vous pouvez utiliser votre poste de travail local 
pour debug la base de données MongoDB qui s'exécute dans le pod.

{{< note >}}
`kubectl port-forward` est implémenté pour les ports TCP uniquement. La prise en charge du protocole UDP est suivie dans [l'issue 47862](https://github.com/kubernetes/kubernetes/issues/47862).
{{< /note >}}

## {{% heading "whatsnext" %}}

En savoir plus sur [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward).