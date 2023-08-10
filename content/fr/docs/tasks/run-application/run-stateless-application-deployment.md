---
title: Exécuter une application stateless avec un Déploiement
min-kubernetes-server-version: v1.9
content_type: tutorial
weight: 10
---

<!-- overview -->

Cette page montre comment exécuter une application en utilisant une resource Deployment (déploiement) dans Kubernetes.

## {{% heading "objectives" %}}

- Créer un déploiement nginx.
- Utiliser kubectl pour afficher des informations sur le déploiement.
- Mettre à jour le déploiement.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- lessoncontent -->

## Création et exploration d'un déploiement nginx

Vous pouvez exécuter une application en créant un objet
déploiement Kubernetes, et vous pouvez décrire un
déploiement dans un fichier YAML. Par exemple, 
ce fichier YAML décrit un déploiement qui exécute l'image Docker nginx:1.14.2 :

{{% codenew file="application/deployment.yaml" %}}

1. Créez un déploiement basé sur ce fichier YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment.yaml
   ```

1. Affichez les informations du déploiement:

   ```shell
   kubectl describe deployment nginx-deployment
   ```

   Le résultat sera similaire à ceci :

   ```
   Name:     nginx-deployment
   Namespace:    default
   CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
   Labels:     app=nginx
   Annotations:    deployment.kubernetes.io/revision=1
   Selector:   app=nginx
   Replicas:   2 desired | 2 updated | 2 total | 2 available | 0 unavailable
   StrategyType:   RollingUpdate
   MinReadySeconds:  0
   RollingUpdateStrategy:  1 max unavailable, 1 max surge
   Pod Template:
     Labels:       app=nginx
     Containers:
       nginx:
       Image:              nginx:1.14.2
       Port:               80/TCP
       Environment:        <none>
       Mounts:             <none>
     Volumes:              <none>
   Conditions:
     Type          Status  Reason
     ----          ------  ------
     Available     True    MinimumReplicasAvailable
     Progressing   True    NewReplicaSetAvailable
   OldReplicaSets:   <none>
   NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
   No events.
   ```

1. Affichez les Pods créés par le déploiement :

   ```shell
   kubectl get pods -l app=nginx
   ```

   Le résultat sera similaire à ceci :

   ```
   NAME                                READY     STATUS    RESTARTS   AGE
   nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
   nginx-deployment-1771418926-r18az   1/1       Running   0          16h
   ```

1. Affichez les informations d'un Pod :

   ```shell
   kubectl describe pod <pod-name>
   ```

   où <pod-name> est le nom d'un de vos Pods.

## Mise à jour du déploiement

Vous pouvez mettre à jour le déploiement en appliquant un nouveau fichier YAML.
Ce fichier YAML indique que le déploiement doit être mis à jour
pour utiliser nginx 1.16.1.

{{% codenew file="application/deployment-update.yaml" %}}

1. Appliquez le nouveau fichier YAML :

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment-update.yaml
   ```

1. Regardez le déploiement créer de nouveaux pods et supprimer les anciens :

   ```shell
   kubectl get pods -l app=nginx
   ```

## Mise à l'échelle de l'application en augmentant le nombre de réplicas

Vous pouvez augmenter le nombre de pods dans votre déploiement en appliquant un nouveau fichier YAML.
Ce fichier YAML définit `replicas` à 4, ce qui spécifie que le déploiement devrait avoir quatre pods :

{{% codenew file="application/deployment-scale.yaml" %}}

1. Appliquez le nouveau fichier YAML :

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml
   ```

1. Vérifiez que le déploiement a quatre pods:

   ```shell
   kubectl get pods -l app=nginx
   ```

   Le résultat sera similaire à ceci :

   ```
   NAME                               READY     STATUS    RESTARTS   AGE
   nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
   nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
   nginx-deployment-148880595-fxcez   1/1       Running   0          2m
   nginx-deployment-148880595-rwovn   1/1       Running   0          2m
   ```

## Suppression d'un déploiement

Supprimez le déploiement avec son nom :

```shell
kubectl delete deployment nginx-deployment
```

## ReplicationControllers -- méthode obsolète

La méthode préférée pour créer une application répliquée consiste à utiliser un déploiement,
qui utilise à son tour un ReplicaSet.
Avant que le déploiement et le ReplicaSet ne soient
ajoutés à Kubernetes, les applications répliquées étaient configurées
à l'aide d'un [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).

## {{% heading "whatsnext" %}}

- En savoir plus sur les [Deployments](/docs/concepts/workloads/controllers/deployment/).
