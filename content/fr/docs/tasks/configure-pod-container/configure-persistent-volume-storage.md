---
title: Configurer un Pod pour utiliser un stockage de type PersistentVolume
content_type: task
weight: 60
---

<!-- overview -->

Cette page montre comment configurer un Pod afin qu'il utilise un {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} comme stockage.

Voici un resume des etapes:

1. En tant qu'administrateur d'un cluster, vous creez un PersistentVolume qui pointe vers un systeme de stockage physique. Vous n'associez le volume avec aucun pod pour le moment.

1. En tant que developer / utilisateur du cluster, vous creez un PersistentVolumeClaim qui sera automatiquement lie a un PersistentVolume adapte.

1. Vous creez un Pod qui utilise le PersistentVolumeClaim cree precedemment comme stockage.


## {{% heading "prerequisites" %}}


* Vous devez avoir a disposition un cluster qui n'a qu'un seul noeud, et l'utilitaire en ligne de commande
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}} doit etre configure pour communiquer avec votre cluster. Si vous n'avez pas deja de cluster a disposition, vous pouvez en creer un en utilisant [Minikube](https://minikube.sigs.k8s.io/docs/).

* Vous pouvez vous familiariser avec la documentation des
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/).

<!-- steps -->

## Creer un fichier index.html sur votre noeud

Open a shell to the single Node in your cluster. How you open a shell depends
on how you set up your cluster. For example, if you are using Minikube, you
can open a shell to your Node by entering `minikube ssh`.

In your shell on that Node, create a `/mnt/data` directory:

Ouvrez une session shell sur le noeud de votre cluster. La facon d'ouvrir 
la session va dependre de la configuration de votre cluster. Si vous utilisez Minikube,
vous pouvez ouvrir une session via la commande `minikube ssh`.

```shell
# En supposant que votre noeud utilise `sudo` pour les acces privilegies
sudo mkdir /mnt/data
```

Dans le dossier `/mnt/data`, creez un fichier `index.html`:  
```shell
# En supposant toujours que votre noeud utilise `sudo` pour les acces privilegies
sudo sh -c "echo 'Hello from Kubernetes storage' > /mnt/data/index.html"
```

{{< note >}}
Si votre noeud utilise un utilitaire d'acces privilegie autre que `sudo`, les commandes notees ici fonctionneront en remplacant `sudo` par le nom de l'utilitaire.
{{< /note >}}

Testez que le fichier `index.html` existe:
```shell
cat /mnt/data/index.html
```

Le resultat de la commande doit etre:
```
Hello from Kubernetes storage
```

Vous pouvez maintenant fermer l'acces shell a votre Noeud.

## Creer un PersistentVolume

Dans cet exercice, vous allez créer un PersistentVolume de type *hostpath*. Prise en charge de Kubernetes
hostPath pour le développement et les tests sur un cluster à nœud unique. Un hostPath
PersistentVolume utilise un fichier ou un répertoire sur le nœud pour émuler le stockage en réseau.

Dans un cluster de production, vous n'utiliseriez pas le type *hostPath*. Communement, un administrateur de cluster
provisionnerait une ressource réseau comme un disque persistant Google Compute Engine,
un partage NFS ou un volume Amazon Elastic Block Store. Les administrateurs de cluster peuvent également
utiliser les [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage-k8s-io)
pour parametrer du 
[provisioning dynamique](/docs/concepts/storage/dynamic-provisioning/).

Voici le fichier de configuration pour le PersitentVolume de type hostPath:
{{< codenew file="pods/storage/pv-volume.yaml" >}}

The configuration file specifies that the volume is at `/mnt/data` on the
cluster's Node. The configuration also specifies a size of 10 gibibytes and
an access mode of `ReadWriteOnce`, which means the volume can be mounted as
read-write by a single Node. It defines the [StorageClass name](/docs/concepts/storage/persistent-volumes/#class)
`manual` for the PersistentVolume, which will be used to bind
PersistentVolumeClaim requests to this PersistentVolume.

Creez le PersistentVolume:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-volume.yaml
```

Afficher les informations du PersistentVolume:

```shell
kubectl get pv task-pv-volume
```

Le resultat affiche que le PersitentVolume a un `STATUS` de `Available`.
Cela signifie qu'il n'a pas encore ete attache a un  PersistentVolumeClaim.

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s

## Creer un PersistentVolumeClaim

The next step is to create a PersistentVolumeClaim. Pods use PersistentVolumeClaims
to request physical storage. In this exercise, you create a PersistentVolumeClaim
that requests a volume of at least three gibibytes that can provide read-write
access for at least one Node.

Here is the configuration file for the PersistentVolumeClaim:

{{< codenew file="pods/storage/pv-claim.yaml" >}}

Create the PersistentVolumeClaim:

    kubectl apply -f https://k8s.io/examples/pods/storage/pv-claim.yaml

After you create the PersistentVolumeClaim, the Kubernetes control plane looks
for a PersistentVolume that satisfies the claim's requirements. If the control
plane finds a suitable PersistentVolume with the same StorageClass, it binds the
claim to the volume.

Look again at the PersistentVolume:

```shell
kubectl get pv task-pv-volume
```

Maintenant, le resultat affiche un `STATUS` a `Bound`.

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m

Look at the PersistentVolumeClaim:

```shell
kubectl get pvc task-pv-claim
```

Le resultat montre que le PersistentVolumeClaim est attache au PersistentVolume
`task-pv-volume`.

    NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
    task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s

## Creer un Pod

La prochaine etape est de creer un Pod qui utilise le PersistentVolumeClaim comme volume de stockage.

Voici le fichier de configuration du Pod:

{{< codenew file="pods/storage/pv-pod.yaml" >}}

Notice that the Pod's configuration file specifies a PersistentVolumeClaim, but
it does not specify a PersistentVolume. From the Pod's point of view, the claim
is a volume.

Creez le Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-pod.yaml
```

Verifiez que le container dans le Pod est operationnel:
```shell
kubectl get pod task-pv-pod
```

Lancez un shell dans le container du Pod:
```shell
kubectl exec -it task-pv-pod -- /bin/bash
```

Depuis le shell, verifiez que nginx utilise le fichier `index.html` du volume hosPath:
```shell
# Assurez vouys de lancer ces 3 commandes dans le shell qui provient de 
# la commande "kubectl exec" executee precedemment
apt update
apt install curl
curl http://localhost/
```

The output shows the text that you wrote to the `index.html` file on the
hostPath volume:

    Hello from Kubernetes storage


If you see that message, you have successfully configured a Pod to
use storage from a PersistentVolumeClaim.

## Nettoyage

Supprimez le Pod, the PersistentVolumeClaim et le PersistentVolume:
```shell
kubectl delete pod task-pv-pod
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

If you don't already have a shell open to the Node in your cluster,
open a new shell the same way that you did earlier.

In the shell on your Node, remove the file and directory that you created:

```shell
# This assumes that your Node uses "sudo" to run commands
# as the superuser
sudo rm /mnt/data/index.html
sudo rmdir /mnt/data
```

Vous pouvez maintenant clore la session shell vers votre noeud.

## Mounting the same persistentVolume in two places

{{< codenew file="pods/storage/pv-duplicate.yaml" >}}

You can perform 2 volume mounts on your nginx container:

`/usr/share/nginx/html` for the static website
`/etc/nginx/nginx.conf` for the default config

<!-- discussion -->

## Access control

Le stockage configure avec un ID de groupe (GID) ne permettra l'ecriture que par les Pods
qui utilisent le meme GID. 

Mismatched or missing GIDs cause permission denied errors. To reduce the
need for coordination with users, an administrator can annotate a PersistentVolume
with a GID. Then the GID is automatically added to any Pod that uses the
PersistentVolume.

Use the `pv.beta.kubernetes.io/gid` annotation as follows:
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
  annotations:
    pv.beta.kubernetes.io/gid: "1234"
```

When a Pod consumes a PersistentVolume that has a GID annotation, the annotated GID
is applied to all containers in the Pod in the same way that GIDs specified in the
Pod's security context are. Every GID, whether it originates from a PersistentVolume
annotation or the Pod's specification, is applied to the first process run in
each container.

{{< note >}}
When a Pod consumes a PersistentVolume, the GIDs associated with the
PersistentVolume are not present on the Pod resource itself.
{{< /note >}}




## {{% heading "whatsnext" %}}


* Pour en savoir plus sur les [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Lire la [documentation de conception sur le stockage persistant](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).

### References

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)




