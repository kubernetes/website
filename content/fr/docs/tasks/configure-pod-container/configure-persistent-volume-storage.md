---
title: Configurer un Pod pour utiliser un PersistentVolume pour le stockage
content_template: templates/task
weight: 60
---

{{% capture overview %}}

Cette page vous montre comment configurer un Pod pour utiliser un {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} pour le stockage.

Voici la procédure en bref :

1.  Vous, en tant qu'administrateur du cluster, créez un PersistentVolume basé sur des stockage physiques. Vous n'associez le volume à aucun Pod.

1. Vous, prenant maintenant le rôle de développeur / utilisateur de cluster, créez un
PersistentVolumeClaim qui est automatiquement lié à un PersistentVolume approprié.

1. Vous créez un pod qui utilise la demande de PersistentVolume ci-dessus pour le stockage.

{{% /capture %}}

{{% capture prerequisites %}}

* Vous devez avoir un cluster Kubernetes qui ne comporte qu'un seul nœud, et l'outil de ligne de commande
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}  doit être configuré pour communiquer avec votre cluster. Si vous ne disposez pas d'un cluster à nœud unique, vous pouvez en créer un en utilisant [Minikube](/docs/getting-started-guides/minikube).

* Familiarisez-vous avec la documentation dans
[Volumes persistants](/fr/docs/concepts/storage/persistent-volumes/).

{{% /capture %}}

{{% capture steps %}}

## Créez un fichier index.html sur votre nœud

Ouvrez un shell au nœud unique de votre cluster. La façon dont vous ouvrez un shell dépend sur la façon dont vous avez installé votre cluster. Par exemple, si vous utilisez Minikube, vous pouvez utiliser le commande `minikube ssh`.

Dans votre shell sur ce nœud, créez un répertoire `/mnt/data` :

```shell
# Cela suppose que votre nœud utilise "sudo" pour exécuter les commandes
# en tant que super-utilisateur
sudo mkdir /mnt/data
```


Dans le répertoire `/mnt/data`, créez un fichier `index.html` :

```shell
# Cela suppose que votre nœud utilise "sudo" pour exécuter les commandes
# en tant que super-utilisateur
sudo sh -c "echo 'Hello from Kubernetes storage' > /mnt/data/index.html"
```

{{< note >}}
Si votre noeud utilise un outil d'accès super-utilisateur autre que `sudo`, vous pourrez le faire fonctionner si vous remplacez `sudo` par le nom de l'autre outil.
{{< /note >}}

Vérifiez que le fichier `index.html` existe :

```shell
cat /mnt/data/index.html
```

Le résultat doit être :
```
Hello from Kubernetes storage
```

Vous pouvez maintenant fermer le shell de votre nœud.

## Créer un PersistentVolume

Dans cet exercice, vous créez un *hostPath* PersistentVolume. Kubernetes soutient
hostPath pour les environnements de développement et de tests sur un cluster à nœud unique. Un PersistentVolume de type hostPath utilise un fichier ou un répertoire sur le nœud pour émuler le stockage en réseau.

Dans un cluster de production, vous ne devez pas utiliser hostPath. À la place, un administrateur de cluster mettrait à disposition une ressource réseau comme le disque persistant de Google Compute Engine, un NFS share, ou un volume d'Amazon de type Elastic Block Store. Les administrateurs de clusters peuvent également utiliser les [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage) pour mettre en place le [provisionnement dynamique](https://kubernetes.io/blog/2016/10/dynamic-provisioning-and-storage-in-kubernetes).

Voici le fichier de configuration pour le hostPath PersistentVolume :

{{< codenew file="pods/storage/pv-volume.yaml" >}}

Le fichier de configuration précise que le volume est présent au répertoire `/mnt/data` sur le nœud du cluster. La configuration spécifie également une taille de 10 gibibytes et un mode d'accès de `ReadWriteOnce`, ce qui signifie que le volume peut être monté de façon lecture-écriture par un seul nœud.  Il définit aussi le nom du [StorageClass] (/docs/concepts/storage/persistent-volumes/#class)
pour le volume persistant, qui sera utilisé pour relier
PersistentVolumeClaim demande à ce PersistentVolume.

Créez le volume persistant :

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-volume.yaml
```

Voir les informations sur le PersistentVolume :

```shell
kubectl get pv task-pv-volume
```

Les résultats montrent que le volume persistant a un `STATUS` correspondant à `Available`. Cela signifie qu'il n'a pas encore été lié à une demande de volume persistant (PersistentVolumeClaim).

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s

## Créer un PersistentVolumeClaim

L'étape suivante consiste à créer un PersistentVolumeClaim. Les pods utilisent les PersistentVolumeClaims pour demander un stockage physique. Dans cet exercice, vous créez un PersistentVolumeClaim qui demande un volume d'au moins trois gibibytes et qui peut fournir un accès en lecture-écriture pour au moins un nœud.

Voici le fichier de configuration pour le PersistentVolumeClaim :

{{< codenew file="pods/storage/pv-claim.yaml" >}}

Créez le PersistentVolumeClaim:

    kubectl apply -f https://k8s.io/examples/pods/storage/pv-claim.yaml

Après avoir créé la demande de volume persistant, le control plane de Kubernetes recherche un volume persistant qui satisfait aux exigences de la demande. Si le control plane trouve un PersistentVolume approprié avec la même StorageClass, il lie le claim au volume.

Consultez à nouveau le PersistentVolume :

```shell
kubectl get pv task-pv-volume
```

Maintenant, le résultat affiche un `STATUS` qui correspond à `Bound`.

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m

Consultez le PersistentVolumeClaim:

```shell
kubectl get pvc task-pv-claim
```

Le résultat montre que le PersistentVolumeClaim est liée à votre PersistentVolume,
`task-pv-volume`.

    NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
    task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s

## Créer un Pod

L'étape suivante consiste à créer un pod qui va utiliser votre PersistentVolumeClaim comme un volume.

Voici le fichier de configuration pour le pod :

{{< codenew file="pods/storage/pv-pod.yaml" >}}

Notez que le fichier de configuration du pod spécifie un PersistentVolumeClaim, mais
il ne spécifie pas de PersistentVolume. Du point de vue du pod, la demande
est un volume.

Créez le pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-pod.yaml
```

Vérifiez que le conteneur du pod fonctionne :

```shell
kubectl get pod task-pv-pod
```

Ouvrez le shell du conteneur qui tourne dans votre pod :

```shell
kubectl exec -it task-pv-pod -- /bin/bash
```

Dans votre shell, vérifiez que nginx affiche bien le fichier `index.html` du volume hostPath :

```shell
# Assurez-vous d'exécuter ces 3 commandes à l'intérieur du shell qui vient après
# l'exécution de "kubectl exec" dans l'étape précédente
apt update
apt install curl
curl http://localhost/
```

Le résultat montre le texte que vous avez écrit dans le fichier `index.html` situé dans le volume de hostPath :

    Hello from Kubernetes storage


Si vous voyez ce message, c'est que vous avez configuré avec succès un Pod qui utilise le stockage d'un PersistentVolumeClaim.

## Clean up

Supprimez le pod, le PersistentVolumeClaim et le PersistentVolume :

```shell
kubectl delete pod task-pv-pod
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

Si vous n'avez pas déjà un shell ouvert au nœud dans votre cluster,
ouvrir le de la même manière que vous l'avez fait précédemment.

Dans le shell de votre nœud, supprimez le fichier et le répertoire que vous avez créé :

```shell
# Cela suppose que votre nœud utilise "sudo" pour exécuter les commandes
# en tant que super-utilisateur
sudo rm /mnt/data/index.html
sudo rmdir /mnt/data
```

Vous pouvez maintenant fermer le shell de votre nœud.

{{% /capture %}}


{{% capture discussion %}}

## Contrôle d'accès

Le stockage configuré avec un ID de groupe (GID) permet l'écriture uniquement par les Pods utilisant le même GID. Les GID mal assortis ou manquants entraînent des erreurs de refus d'autorisation. Pour réduire le besoin de coordination avec les utilisateurs, un administrateur peut annoter un PersistentVolume avec un GID. Le GID est alors automatiquement ajouté à tout Pod qui utilise ce
PersistentVolume.

Utilisez l'annotation `pv.beta.kubernetes.io/gid` :
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
  annotations:
    pv.beta.kubernetes.io/gid: "1234"
```
Lorsqu'un pod consomme un PersistentVolume comportant une annotation GID, le GID annoté est appliqué à tous les conteneurs du pod de la même manière que les GID spécifiés dans le contexte de sécurité de Pod. 
Chaque GID, qu'il provienne d'un PersistentVolume ou la spécification du Pod, est appliquée au premier processus exécuté dans chaque conteneur.

{{< note >}}
Lorsqu'un pod consomme un PersistentVolume, les GID associés au PersistentVolume ne sont pas présents sur la ressource du pod elle-même.
{{< /note >}}

{{% /capture %}}


{{% capture whatsnext %}}

* Pour en savoir plus sur les [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Lire le [Document de conception du stockage persistant](https://git.k8s.io/community/contributors/design-proposals/storage/persistent-storage.md).

### Référence

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)

{{% /capture %}}


