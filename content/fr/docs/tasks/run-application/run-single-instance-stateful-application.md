---
title: Exécutez une application stateful mono-instance 
content_type: tutorial
weight: 20
---

<!-- overview -->

Cette page montre comment exécuter une application mono-instance, avec gestion d'état (stateful) dans Kubernetes en utilisant un PersistentVolume et un Deployment. L'application utilisée est MySQL.

## {{% heading "objectives" %}}

- Créer un PersistentVolume en référençant un disque dans votre environnement.
- Créer un déploiement MySQL.
- Exposer MySQL à d'autres pods dans le cluster sous un nom DNS connu.

## {{% heading "prerequisites" %}}

- {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

- {{< include "default-storage-class-prereqs.md" >}}

<!-- lessoncontent -->

## Déployer MySQL

Vous pouvez exécuter une application stateful en créant un Deployment Kubernetes
et en le connectant à un PersistentVolume existant à l'aide d'un
PersistentVolumeClaim. Par exemple, ce fichier YAML décrit un
Deployment qui exécute MySQL et référence le PersistentVolumeClaim. Le fichier
définit un point de montage pour /var/lib/mysql, puis crée un
PersistentVolumeClaim qui réclame un volume de 20G. 
Cette demande est satisfaite par n'importe quel volume existant qui répond aux exigences,
ou par un provisionneur dynamique.

Remarque: le mot de passe MySQL est défini dans le fichier de configuration YAML, ce qui n'est pas sécurisé. 
Voir les [secrets Kubernetes](/docs/concepts/configuration/secret/)
pour une approche sécurisée.

{{% codenew file="application/mysql/mysql-deployment.yaml" %}}
{{% codenew file="application/mysql/mysql-pv.yaml" %}}

1. Déployez le PV et le PVC du fichier YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mysql/mysql-pv.yaml
   ```

1. Déployez les resources du fichier YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mysql/mysql-deployment.yaml
   ```

1. Affichez les informations liées au Deployment:

   ```shell
   kubectl describe deployment mysql
   ```

   Le résultat sera similaire à ceci:

   ```
   Name:                 mysql
   Namespace:            default
   CreationTimestamp:    Tue, 01 Nov 2016 11:18:45 -0700
   Labels:               app=mysql
   Annotations:          deployment.kubernetes.io/revision=1
   Selector:             app=mysql
   Replicas:             1 desired | 1 updated | 1 total | 0 available | 1 unavailable
   StrategyType:         Recreate
   MinReadySeconds:      0
   Pod Template:
     Labels:       app=mysql
     Containers:
       mysql:
       Image:      mysql:5.6
       Port:       3306/TCP
       Environment:
         MYSQL_ROOT_PASSWORD:      password
       Mounts:
         /var/lib/mysql from mysql-persistent-storage (rw)
     Volumes:
       mysql-persistent-storage:
       Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
       ClaimName:  mysql-pv-claim
       ReadOnly:   false
   Conditions:
     Type          Status  Reason
     ----          ------  ------
     Available     False   MinimumReplicasUnavailable
     Progressing   True    ReplicaSetUpdated
   OldReplicaSets:       <none>
   NewReplicaSet:        mysql-63082529 (1/1 replicas created)
   Events:
     FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
     ---------    --------    -----    ----                -------------    --------    ------            -------
     33s          33s         1        {deployment-controller }             Normal      ScalingReplicaSet Scaled up replica set mysql-63082529 to 1
   ```

1. Listez les Pods créés par le Deployment:

   ```shell
   kubectl get pods -l app=mysql
   ```

   Le résultat sera similaire à ceci:

   ```
   NAME                   READY     STATUS    RESTARTS   AGE
   mysql-63082529-2z3ki   1/1       Running   0          3m
   ```

1. Inspectez le PersistentVolumeClaim:

   ```shell
   kubectl describe pvc mysql-pv-claim
   ```

   Le résultat sera similaire à ceci:

   ```
   Name:         mysql-pv-claim
   Namespace:    default
   StorageClass:
   Status:       Bound
   Volume:       mysql-pv-volume
   Labels:       <none>
   Annotations:    pv.kubernetes.io/bind-completed=yes
                   pv.kubernetes.io/bound-by-controller=yes
   Capacity:     20Gi
   Access Modes: RWO
   Events:       <none>
   ```

## Accès à l'instance MySQL

Le fichier YAML précédent crée un service qui permet à d'autres 
pods dans le cluster d'accéder à la base de données.
L'option `clusterIP: None` du service permet à son nom DNS
de résoudre directement l'adresse IP du pod. 
C'est optimal lorsque vous n'avez qu'un seul pod derrière 
un service et que vous n'avez pas l'intention 
d'augmenter le nombre de pods.

Exécutez un client MySQL pour vous connecter au serveur :

```shell
kubectl run -it --rm --image=mysql:5.6 --restart=Never mysql-client -- mysql -h mysql -ppassword
```

Cette commande crée un nouveau pod dans le cluster exécutant 
un client MySQL et le connecte au serveur via le Service. 
Si la connexion réussit, cela signifie que votre base de données MySQL est opérationnelle.

```
Waiting for pod default/mysql-client-274442439-zyp6i to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

mysql>
```

## Mises à jour

L'image ou toute autre partie du Deployment peut être mise à jour
comme d'habitude avec la commande `kubectl apply`. 
Voici quelques précautions spécifiques aux applications stateful :

- Ne pas mettre à l'échelle l'application. Cette configuration 
  est conçue pour des applications à une seule instance seulement.
  Le PersistentVolume sous-jacent ne peut être monté que sur un 
  Pod. Pour les applications stateful clusterisées, consultez la 
  [documentation sur les StatefulSets](/docs/concepts/workloads/controllers/statefulset/).
- Utilisez `strategy`: `type: Recreate` dans le fichier de
  configuration YAML du Deployment. 
  Cela indique à Kubernetes de ne pas utiliser des mises à jour 
  continues. Les mises à jour en roulement ne fonctionneront pas, 
  car vous ne pouvez pas avoir plus d'un Pod en cours 
  d'exécution à la fois. La stratégie `Recreate` arrêtera le 
  premier pod avant d'en créer un nouveau avec la configuration mise à jour.

## Suppression d'un déploiement

Supprimez les ressources déployées avec leur noms:

```shell
kubectl delete deployment,svc mysql
kubectl delete pvc mysql-pv-claim
kubectl delete pv mysql-pv-volume
```

Si vous avez provisionné manuellement un PersistentVolume, vous
devrez également le supprimer manuellement, 
ainsi que libérer la ressource sous-jacente.
Si vous avez utilisé un provisionneur dynamique, 
il supprimera automatiquement le PersistentVolume 
lorsqu'il verra que vous avez supprimé le PersistentVolumeClaim.
Certains provisionneurs dynamiques (comme ceux pour EBS et PD) 
libèrent également la ressource sous-jacente lors de la 
suppression du PersistentVolume.

## {{% heading "whatsnext" %}}

- En savoir plus sur les [Deployments](/docs/concepts/workloads/controllers/deployment/).

- En savoir plus sur le [déploiement d'applications](/docs/tasks/run-application/run-stateless-application-deployment/)

- [Documentation de kubectl run](/docs/reference/generated/kubectl/kubectl-commands/#run)

- Documentation des [Volumes](/docs/concepts/storage/volumes/) et des [Volumes persistants](/docs/concepts/storage/persistent-volumes/)
