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

```shell
# This assumes that your Node uses "sudo" to run commands
# as the superuser
sudo mkdir /mnt/data
```

Dans le dossier `/mnt/data`, creez un fichier `index.html`:  
```shell
# This again assumes that your Node uses "sudo" to run commands
# as the superuser
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

In this exercise, you create a *hostPath* PersistentVolume. Kubernetes supports
hostPath for development and testing on a single-node cluster. A hostPath
PersistentVolume uses a file or directory on the Node to emulate network-attached storage.

In a production cluster, you would not use hostPath. Instead a cluster administrator
would provision a network resource like a Google Compute Engine persistent disk,
an NFS share, or an Amazon Elastic Block Store volume. Cluster administrators can also
use [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage-k8s-io)
to set up
[dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/).

Here is the configuration file for the hostPath PersistentVolume:

{{< codenew file="pods/storage/pv-volume.yaml" >}}

The configuration file specifies that the volume is at `/mnt/data` on the
cluster's Node. The configuration also specifies a size of 10 gibibytes and
an access mode of `ReadWriteOnce`, which means the volume can be mounted as
read-write by a single Node. It defines the [StorageClass name](/docs/concepts/storage/persistent-volumes/#class)
`manual` for the PersistentVolume, which will be used to bind
PersistentVolumeClaim requests to this PersistentVolume.

Create the PersistentVolume:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-volume.yaml
```

View information about the PersistentVolume:

```shell
kubectl get pv task-pv-volume
```

The output shows that the PersistentVolume has a `STATUS` of `Available`. This
means it has not yet been bound to a PersistentVolumeClaim.

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s

## Create a PersistentVolumeClaim

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

Now the output shows a `STATUS` of `Bound`.

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m

Look at the PersistentVolumeClaim:

```shell
kubectl get pvc task-pv-claim
```

The output shows that the PersistentVolumeClaim is bound to your PersistentVolume,
`task-pv-volume`.

    NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
    task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s

## Create a Pod

The next step is to create a Pod that uses your PersistentVolumeClaim as a volume.

Here is the configuration file for the Pod:

{{< codenew file="pods/storage/pv-pod.yaml" >}}

Notice that the Pod's configuration file specifies a PersistentVolumeClaim, but
it does not specify a PersistentVolume. From the Pod's point of view, the claim
is a volume.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-pod.yaml
```

Verify that the container in the Pod is running;

```shell
kubectl get pod task-pv-pod
```

Get a shell to the container running in your Pod:

```shell
kubectl exec -it task-pv-pod -- /bin/bash
```

In your shell, verify that nginx is serving the `index.html` file from the
hostPath volume:

```shell
# Be sure to run these 3 commands inside the root shell that comes from
# running "kubectl exec" in the previous step
apt update
apt install curl
curl http://localhost/
```

The output shows the text that you wrote to the `index.html` file on the
hostPath volume:

    Hello from Kubernetes storage


If you see that message, you have successfully configured a Pod to
use storage from a PersistentVolumeClaim.

## Clean up

Delete the Pod,  the PersistentVolumeClaim and the PersistentVolume:

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

You can now close the shell to your Node.

## Mounting the same persistentVolume in two places

{{< codenew file="pods/storage/pv-duplicate.yaml" >}}

You can perform 2 volume mounts on your nginx container:

`/usr/share/nginx/html` for the static website
`/etc/nginx/nginx.conf` for the default config

<!-- discussion -->

## Access control

Storage configured with a group ID (GID) allows writing only by Pods using the same
GID. Mismatched or missing GIDs cause permission denied errors. To reduce the
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

### Reference

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)




