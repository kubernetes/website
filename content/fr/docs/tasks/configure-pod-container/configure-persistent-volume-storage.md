---
title: Configurer un Pod pour utiliser un stockage de type PersistentVolume
content_type: task
weight: 60
---

<!-- overview -->

Cette page montre comment configurer un Pod afin qu'il utilise un {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} comme système de stockage.

Voici un résumé des étapes:

1. En tant qu'administrateur d'un cluster, vous créez un PersistentVolume qui pointe vers un système de stockage physique. Vous n'associez le volume avec aucun Pod pour le moment.

1. En tant que développeur ou utilisateur du cluster, vous créez un PersistentVolumeClaim qui sera automatiquement lié à un PersistentVolume adapté.

1. Vous créez un Pod qui utilise le PersistentVolumeClaim créé précédemment comme stockage.


## {{% heading "prerequisites" %}}


* Vous devez avoir à disposition un cluster qui n'a qu'un seul noeud, et l'utilitaire en ligne de commande
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}} doit être configuré pour communiquer avec votre cluster. Si vous n'avez pas déja de cluster à disposition, vous pouvez en créer un en utilisant [Minikube](https://minikube.sigs.k8s.io/docs/).

* Vous pouvez vous familiariser avec la documentation des
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/).

<!-- steps -->

## Créer un fichier index.html sur votre noeud

Ouvrez une session shell sur le noeud de votre cluster. La facon d'ouvrir 
la session va dependre de la configuration de votre cluster. Si vous utilisez Minikube,
vous pouvez ouvrir une session via la commande `minikube ssh`.

Via la session sur ce noeud, créez un dossier `/mnt/data`:

```shell
# En supposant que votre noeud utilise `sudo` pour les accès privilégiés
sudo mkdir /mnt/data
```

Dans le dossier `/mnt/data`, créez un fichier `index.html`:  
```shell
# En supposant toujours que votre noeud utilise `sudo` pour les accès privilégiés
sudo sh -c "echo 'Hello from Kubernetes storage' > /mnt/data/index.html"
```

{{< note >}}
Si votre noeud utilise un utilitaire d'accès privilégié autre que `sudo`, les commandes notées ici devraient fonctionner en remplacant `sudo` par le nom de l'utilitaire.
{{< /note >}}

Testez que le fichier `index.html` existe:
```shell
cat /mnt/data/index.html
```

Le résultat de la commande doit être:
```
Hello from Kubernetes storage
```

Vous pouvez maintenant fermer l'accès shell à votre Noeud.

## Créer un PersistentVolume

Dans cet exercice, vous allez créer un PersistentVolume de type *hostpath*. Kubernetes prend en charge le type hostPath pour le développement et les tests sur un cluster à noeud unique. Un PersistentVolume de type hostPath utilise un fichier ou un dossier sur le noeud pour simuler un stockage réseau.

Dans un cluster de production, vous n'utiliseriez pas le type *hostPath*. Plus communément, un administrateur de cluster
provisionnerait une ressource réseau comme un disque persistant Google Compute Engine,
un partage NFS ou un volume Amazon Elastic Block Store. Les administrateurs de cluster peuvent également
utiliser les [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage-k8s-io)
pour paramétrer du 
[provisioning dynamique](/docs/concepts/storage/dynamic-provisioning/).

Voici le fichier de configuration pour le PersistentVolume de type hostPath:
{{% codenew file="pods/storage/pv-volume.yaml" %}}

Le fichier de configuration spécifie que le chemin du volume sur le noeud est `/mnt/data`. Il spécifie aussi une taille de 10 gibibytes, ainsi qu'un mode d'accès de type `ReadWriteOnce`, impliquant que le volume ne peut être monté en lecture et écriture que par un seul noeud. Le fichier définit un [nom de StorageClass](/docs/concepts/storage/persistent-volumes/#class) à `manual`, ce qui sera utilisé pour attacher un PersistentVolumeClaim à ce PersistentVolume

Créez le PersistentVolume:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-volume.yaml
```

Affichez les informations du PersistentVolume:

```shell
kubectl get pv task-pv-volume
```

Le résultat affiche que le PersitentVolume a un `STATUS` de `Available`.
Cela signifie qu'il n'a pas encore été attaché à un PersistentVolumeClaim.

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s

## Créer un PersistentVolumeClaim

La prochaine étape est de créer un PersistentVolumeClaim (demande de stockage). Les Pods utilisent les PersistentVolumeClaims pour demander un accès à du stockage physique. 
Dans cet exercice, vous créez un PersistentVolumeClaim qui demande un volume d'au moins 3 GB, et qui peut être monté en lecture et écriture sur au moins un noeud. 

Voici le fichier de configuration du PersistentVolumeClaim:
{{% codenew file="pods/storage/pv-claim.yaml" %}}

Créez le PersistentVolumeClaim:

    kubectl apply -f https://k8s.io/examples/pods/storage/pv-claim.yaml

Après avoir créé le PersistentVolumeClaim, le control plane de Kubernetes va chercher un PersistentVolume qui respecte les exigences du PersistentVolumeClaim. Si le control plane trouve un PersistentVolume approprié avec la même StorageClass, il attache la demande au volume.

Affichez à nouveau les informations du PersistentVolume:
```shell
kubectl get pv task-pv-volume
```

Maintenant, le résultat affiche un `STATUS` à `Bound`.

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m

Affichez les informations du PersistentVolumeClaim:
```shell
kubectl get pvc task-pv-claim
```

Le résultat montre que le PersistentVolumeClaim est attaché au PersistentVolume `task-pv-volume`.

    NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
    task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s

## Créer un Pod

La prochaine étape est de créer un Pod qui utilise le PersistentVolumeClaim comme volume de stockage.

Voici le fichier de configuration du Pod:

{{% codenew file="pods/storage/pv-pod.yaml" %}}

Notez que le fichier de configuration du Pod spécifie un PersistentVolumeClaim et non un PersistentVolume. Du point de vue du Pod, la demande est un volume de stockage.

Créez le Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-pod.yaml
```

Vérifiez que le container dans le Pod est opérationnel:
```shell
kubectl get pod task-pv-pod
```

Lancez un shell dans le container du Pod:
```shell
kubectl exec -it task-pv-pod -- /bin/bash
```

Depuis le shell, vérifiez que nginx utilise le fichier `index.html` du volume hostPath:
```shell
# Assurez vous de lancer ces 3 commandes dans le shell qui provient de 
# la commande "kubectl exec" exécutée précedemment
apt update
apt install curl
curl http://localhost/
```

Le résultat doit afficher le texte qui a été écrit auparavant dans le fichier `index.html` dans le volume hostPath:

    Hello from Kubernetes storage


Si vous voyez ce message, vous avez configuré un Pod qui utilise un PersistentVolumeClaim comme stockage avec succès.


## Nettoyage

Supprimez le Pod, le PersistentVolumeClaim et le PersistentVolume:
```shell
kubectl delete pod task-pv-pod
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

Si vous n'avez pas déja de session ouverte sur le noeud de votre cluster, ouvrez en un de la même manière que précédemment.

Dans la session shell, supprimez les fichiers et dossiers que vous avez créé:

```shell
# En assumant que le noeud utilise "sudo" pour les accès privilégiés
sudo rm /mnt/data/index.html
sudo rmdir /mnt/data
```

Vous pouvez maintenant arrêter la session shell vers votre noeud.

## Monter le même PersistentVolume à deux endroits

Vous pouvez monter plusieurs fois un même PersistentVolume
à plusieurs endroits différents dans votre container nginx:

{{% codenew file="pods/storage/pv-duplicate.yaml" %}}

- `/usr/share/nginx/html` pour le site statique
- `/etc/nginx/nginx.conf` pour la configuration par défaut

<!-- discussion -->

## Contrôle d'accès

Le stockage configuré avec un ID de groupe (GID) ne permettra l'écriture que par les Pods qui utilisent le même GID.

Les GID manquants ou qui ne correspondent pas entraîneront des erreurs d'autorisation refusée. Pour alléger la coordination avec les utilisateurs, un administrateur peut annoter un PersistentVolume
avec un GID. Ensuite, le GID sera automatiquement ajouté à tout pod qui utilise le PersistentVolume.

Utilisez l'annotation `pv.beta.kubernetes.io/gid` comme ceci:
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
  annotations:
    pv.beta.kubernetes.io/gid: "1234"
```

Lorsqu'un Pod attache un PersistentVolume qui a une annotation pour le GID, ce dernier est appliqué à tous les containers du Pod de la même façon que les GID spécifiés dans le contexte de sécurité du Pod. Peu importe s'il provient d'une annotation du PersistentVolume ou de la spécification du Pod, chaque GID sera appliqué au premier process exécuté dans chaque container.


{{< note >}}
Quand un Pod attache un PersistentVolume, les GID associés avec le PersistentVolume ne sont pas répércutés sur la spécification de la ressource du Pod.
{{< /note >}}




## {{% heading "whatsnext" %}}


* Pour en savoir plus sur les [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Lire la [documentation de conception sur le stockage persistant](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).

### Références

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)




