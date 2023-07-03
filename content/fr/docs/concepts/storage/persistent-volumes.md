---
title: Volumes persistants
feature:
  title: Orchestration du stockage
  description: >
    Montez automatiquement le système de stockage de votre choix, que ce soit à partir du stockage local, d'un fournisseur de cloud public tel que <a href="https://cloud.google.com/storage/">GCP</a> ou <a href="https://aws.amazon.com/products/storage/">AWS</a>, ou un système de stockage réseau tel que NFS, iSCSI, Gluster, Ceph, Cinder ou Flocker.

content_type: concept
weight: 20
---

<!-- overview -->

Ce document décrit l'état actuel de `PersistentVolumes` dans Kubernetes.
Une connaissance des [volumes](/fr/docs/concepts/storage/volumes/) est suggérée.



<!-- body -->

## Introduction

La gestion du stockage est un problème distinct de la gestion des instances de calcul.
Le sous-système `PersistentVolume` fournit une API pour les utilisateurs et les administrateurs qui abstrait les détails de la façon dont le stockage est fourni et de la façon dont il est utilisé.
Pour ce faire, nous introduisons deux nouvelles ressources API: `PersistentVolume` et `PersistentVolumeClaim`.

Un `PersistentVolume` (PV) est un élément de stockage dans le cluster qui a été provisionné par un administrateur ou provisionné dynamiquement à l'aide de [Storage Classes](/docs/concepts/storage/storage-classes/).
Il s'agit d'une ressource dans le cluster, tout comme un nœud est une ressource de cluster.
Les PV sont des plugins de volume comme Volumes, mais ont un cycle de vie indépendant de tout pod individuel qui utilise le PV.
Cet objet API capture les détails de l'implémentation du stockage, que ce soit NFS, iSCSI ou un système de stockage spécifique au fournisseur de cloud.

Un `PersistentVolumeClaim` (PVC) est une demande de stockage par un utilisateur.
Il est similaire à un Pod.
Les pods consomment des ressources de noeud et les PVC consomment des ressources PV.
Les pods peuvent demander des niveaux spécifiques de ressources (CPU et mémoire).
Les PVC peuvent demander une taille et des modes d'accès spécifiques (par exemple, ils peuvent être montés une fois en lecture/écriture ou plusieurs fois en lecture seule).

Alors que les `PersistentVolumeClaims` permettent à un utilisateur de consommer des ressources de stockage abstraites, il est courant que les utilisateurs aient besoin de `PersistentVolumes` avec des propriétés et des performances variables pour différents problèmes.
Les administrateurs de cluster doivent être en mesure d'offrir une variété de `PersistentVolumes` qui diffèrent de bien des façons plus que la taille et les modes d'accès, sans exposer les utilisateurs aux détails de la façon dont ces volumes sont mis en œuvre.
Pour ces besoins, il existe la ressource `StorageClass`.

Voir la [procédure détaillée avec des exemples](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).

## Cycle de vie d'un PV et d'un PVC

Les PV sont des ressources du cluster.
Les PVC sont des demandes pour ces ressources et agissent également comme des contrôles de réclamation pour la ressource.
L'interaction entre les PV et les PVC suit ce cycle de vie:

### Provisionnement

Les PV peuvent être provisionnés de deux manières: statiquement ou dynamiquement.

#### Provisionnement statique

Un administrateur de cluster crée un certain nombre de PV.
Ils contiennent les détails du stockage réel, qui est disponible pour une utilisation par les utilisateurs du cluster.
Ils existent dans l'API Kubernetes et sont disponibles pour la consommation.

#### Provisionnement dynamique

Lorsqu'aucun des PV statiques créés par l'administrateur ne correspond au `PersistentVolumeClaim` d'un utilisateur, le cluster peut essayer de provisionner dynamiquement un volume spécialement pour le PVC.
Ce provisionnement est basé sur les `StorageClasses`: le PVC doit demander une [storage class](/docs/concepts/storage/storage-classes/) et l'administrateur doit avoir créé et configuré cette classe pour que l'approvisionnement dynamique se produise.
Les PVC qui demandent la classe `""` désactive le provisionnement dynamique pour eux-mêmes.

Pour activer le provisionnement de stockage dynamique basé sur la classe de stockage, l'administrateur de cluster doit activer le `DefaultStorageClass` dans l'[contrôleur d'admission](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass) sur le serveur API.
Cela peut être fait, par exemple, en veillant à ce que `DefaultStorageClass` figure parmi la liste de valeurs séparées par des virgules pour l'option `--enable-admission-plugins` du composant serveur API.
Pour plus d'informations sur les options de ligne de commande du serveur API, consultez la documentation [kube-apiserver](/docs/admin/kube-apiserver/).

### Liaison

Un utilisateur crée, ou dans le cas d'un provisionnement dynamique, a déjà créé, un `PersistentVolumeClaim` avec une quantité spécifique de stockage demandée et avec certains modes d'accès.
Une boucle de contrôle dans le maître surveille les nouveaux PVC, trouve un PV correspondant (si possible) et les lie ensemble.
Si un PV a été dynamiquement provisionné pour un nouveau PVC, la boucle liera toujours ce PV au PVC.
Sinon, l'utilisateur obtiendra toujours au moins ce qu'il a demandé, mais le volume peut être supérieur à ce qui a été demandé.
Une fois liées, les liaisons `PersistentVolumeClaim` sont exclusives, quelle que soit la façon dont elles ont été liées.
Une liaison PVC-PV est une relation 1-à-1.

Les PVC resteront non liés indéfiniment s'il n'existe pas de volume correspondant.
Le PVC sera lié à mesure que les volumes correspondants deviendront disponibles.
Par exemple, un cluster provisionné avec de nombreux PV 50Gi ne correspondrait pas à un PVC demandant 100Gi.
Le PVC peut être lié lorsqu'un PV 100Gi est ajouté au cluster.

### Utilisation

Les Pods utilisent les PVC comme des volumes.
Le cluster inspecte le PVC pour trouver le volume lié et monte ce volume pour un Pod.
Pour les volumes qui prennent en charge plusieurs modes d'accès, l'utilisateur spécifie le mode souhaité lors de l'utilisation de leur PVC comme volume dans un Pod.

Une fois qu'un utilisateur a un PVC et que ce PVC est lié, le PV lié appartient à l'utilisateur aussi longtemps qu'il en a besoin.
Les utilisateurs planifient des pods et accèdent à leurs PV revendiqués en incluant un `persistentVolumeClaim` dans le bloc de volumes de leur Pod [Voir ci-dessous pour les détails de la syntaxe](#claims-as-volumes).

### Protection de l'objet de stockage en cours d'utilisation

Le but de la fonction de protection des objets de stockage utilisés est de garantir que les revendications de volume persistantes (PVC) en cours d'utilisation par un Pod et les volumes persistants (PV) liés aux PVC ne sont pas supprimées du système, car cela peut entraîner des pertes de données.

{{< note >}}
Le PVC est utilisé activement par un pod lorsqu'il existe un objet Pod qui utilise le PVC.
{{< /note >}}

Si un utilisateur supprime un PVC en cours d'utilisation par un pod, le PVC n'est pas supprimé immédiatement.
L'élimination du PVC est différée jusqu'à ce que le PVC ne soit plus activement utilisé par les pods.
De plus, si un administrateur supprime un PV lié à un PVC, le PV n'est pas supprimé immédiatement.
L'élimination du PV est différée jusqu'à ce que le PV ne soit plus lié à un PVC.

Vous pouvez voir qu'un PVC est protégé lorsque son état est `Terminating` et la liste `Finalizers` inclus `kubernetes.io/pvc-protection`:

```text
kubectl describe pvc hostpath
Name:          hostpath
Namespace:     default
StorageClass:  example-hostpath
Status:        Terminating
Volume:
Labels:        <none>
Annotations:   volume.beta.kubernetes.io/storage-class=example-hostpath
               volume.beta.kubernetes.io/storage-provisioner=example.com/hostpath
Finalizers:    [kubernetes.io/pvc-protection]
...
```

Vous pouvez voir qu'un PV est protégé lorsque son état est `Terminating` et la liste `Finalizers` inclus `kubernetes.io/pv-protection` aussi:

```text
kubectl describe pv task-pv-volume
Name:            task-pv-volume
Labels:          type=local
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    standard
Status:          Available
Claim:
Reclaim Policy:  Delete
Access Modes:    RWO
Capacity:        1Gi
Message:
Source:
    Type:          HostPath (bare host directory volume)
    Path:          /tmp/data
    HostPathType:
Events:            <none>
```

### Récupération des volumes

Lorsqu'un utilisateur a terminé avec son volume, il peut supprimer les objets PVC de l'API qui permet la récupération de la ressource.
La politique de récupération pour un `PersistentVolume` indique au cluster ce qu'il doit faire du volume une fois qu'il a été libéré de son PVC.
Actuellement, les volumes peuvent être conservés, recyclés ou supprimés.

#### Volumes conservés

La politique de récupération `Retain` permet la récupération manuelle de la ressource.
Lorsque le `PersistentVolumeClaim` est supprimé, le `PersistentVolume` existe toujours et le volume est considéré comme «libéré».
Mais il n'est pas encore disponible pour une autre demande car les données du demandeur précédent restent sur le volume.
Un administrateur peut récupérer manuellement le volume en procédant comme suit.

1. Supprimer le `PersistentVolume`.
   L'actif de stockage associé dans une infrastructure externe (comme un volume AWS EBS, GCE PD, Azure Disk ou Cinder) existe toujours après la suppression du PV.
1. Nettoyez manuellement les données sur l'actif de stockage associé en conséquence.
1. Supprimez manuellement l'actif de stockage associé ou, si vous souhaitez réutiliser le même actif de stockage, créez un nouveau `PersistentVolume` avec la définition de l'actif de stockage.

#### Volumes supprimés

Pour les plug-ins de volume qui prennent en charge la stratégie de récupération `Delete`, la suppression supprime à la fois l'objet `PersistentVolume` de Kubernetes, ainsi que l'actif de stockage associé dans l'infrastructure externe, tel qu'un volume AWS EBS, GCE PD, Azure Disk ou Cinder.
Les volumes qui ont été dynamiquement provisionnés héritent de la [politique de récupération de leur `StorageClass`](#politique-de-récupération), qui par défaut est `Delete`.
L'administrateur doit configurer la `StorageClass` selon les attentes des utilisateurs; sinon, le PV doit être édité ou corrigé après sa création.
Voir [Modifier la politique de récupération d'un PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).

#### Volumes recyclés

{{< warning >}}
La politique de récupération `Recycle` est obsolète.
Au lieu de cela, l'approche recommandée consiste à utiliser l'approvisionnement dynamique.
{{< /warning >}}

Si elle est prise en charge par le plug-in de volume sous-jacent, la stratégie de récupération `Recycle` effectue un nettoyage de base (`rm -rf /thevolume/*`) sur le volume et le rend à nouveau disponible pour une nouvelle demande.

Cependant, un administrateur peut configurer un modèle de module de recyclage personnalisé à l'aide des arguments de ligne de commande du gestionnaire de contrôleur Kubernetes, comme décrit [ici](/docs/admin/kube-controller-manager/).
Le modèle de pod de recycleur personnalisé doit contenir une définition de `volumes`, comme le montre l'exemple ci-dessous:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pv-recycler
  namespace: default
spec:
  restartPolicy: Never
  volumes:
  - name: vol
    hostPath:
      path: /any/path/it/will/be/replaced
  containers:
  - name: pv-recycler
    image: "registry.k8s.io/busybox"
    command: ["/bin/sh", "-c", "test -e /scrub && rm -rf /scrub/..?* /scrub/.[!.]* /scrub/*  && test -z \"$(ls -A /scrub)\" || exit 1"]
    volumeMounts:
    - name: vol
      mountPath: /scrub
```

Cependant, le chemin particulier spécifié dans la partie `volumes` du template personnalisé de Pod est remplacée par le chemin particulier du volume qui est recyclé.

### Redimensionnement des PVC

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

La prise en charge du redimensionnement des PersistentVolumeClaims (PVCs) est désormais activée par défaut.
Vous pouvez redimensionner les types de volumes suivants:

* gcePersistentDisk
* awsElasticBlockStore
* Cinder
* glusterfs
* rbd
* Azure File
* Azure Disk
* Portworx
* FlexVolumes
* CSI

Vous ne pouvez redimensionner un PVC que si le champ `allowVolumeExpansion` de sa classe de stockage est défini sur true.

``` yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gluster-vol-default
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

Pour demander un volume plus important pour un PVC, modifiez l'objet PVC et spécifiez une taille plus grande.
Cela déclenche l'expansion du volume qui soutient le `PersistentVolume` sous-jacent.
Un nouveau `PersistentVolume` n'est jamais créé pour satisfaire la demande.
Au lieu de cela, un volume existant est redimensionné.

#### Redimensionnement de volume CSI

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

La prise en charge du redimensionnement des volumes CSI est activée par défaut, mais elle nécessite également un pilote CSI spécifique pour prendre en charge le redimensionnement des volumes.
Reportez-vous à la documentation du pilote CSI spécifique pour plus d'informations.

#### Redimensionner un volume contenant un système de fichiers

Vous ne pouvez redimensionner des volumes contenant un système de fichiers que si le système de fichiers est XFS, Ext3 ou Ext4.

Lorsqu'un volume contient un système de fichiers, le système de fichiers n'est redimensionné que lorsqu'un nouveau pod utilise le `PersistentVolumeClaim` en mode ReadWrite.
L'extension du système de fichiers est effectuée au démarrage d'un pod ou lorsqu'un pod est en cours d'exécution et que le système de fichiers sous-jacent prend en charge le redimensionnement en ligne.

FlexVolumes autorise le redimensionnement si le pilote est défini avec la capacité `requiresFSResize` sur `true`.
Le FlexVolume peut être redimensionné au redémarrage du pod.

#### Redimensionnement d'un PersistentVolumeClaim en cours d'utilisation

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

{{< note >}}
Redimensionner un PVCs à chaud est disponible en version bêta depuis Kubernetes 1.15 et en version alpha depuis 1.11.
La fonctionnalité `ExpandInUsePersistentVolumes` doit être activée, ce qui est le cas automatiquement pour de nombreux clusters de fonctionnalités bêta.
Se référer à la documentation de la [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) pour plus d'informations.
{{< /note >}}

Dans ce cas, vous n'avez pas besoin de supprimer et de recréer un pod ou un déploiement qui utilise un PVC existant.
Tout PVC en cours d'utilisation devient automatiquement disponible pour son pod dès que son système de fichiers a été étendu.
Cette fonctionnalité n'a aucun effet sur les PVC qui ne sont pas utilisés par un pod ou un déploiement.
Vous devez créer un pod qui utilise le PVC avant que l'extension puisse se terminer.

Semblable à d'autres types de volume - les volumes FlexVolume peuvent également être étendus lorsqu'ils sont utilisés par un pod.

{{< note >}}
Le redimensionnement de FlexVolume n'est possible que lorsque le pilote sous-jacent prend en charge le redimensionnement.
{{< /note >}}

{{< note >}}
L'augmentation des volumes EBS est une opération longue.
En outre, il existe un quota par volume d'une modification toutes les 6 heures.
{{< /note >}}

## Types de volumes persistants

Les types `PersistentVolume` sont implémentés en tant que plugins.
Kubernetes prend actuellement en charge les plugins suivants:

* GCEPersistentDisk
* AWSElasticBlockStore
* AzureFile
* AzureDisk
* CSI
* FC (Fibre Channel)
* FlexVolume
* Flocker
* NFS
* iSCSI
* RBD (Ceph Block Device)
* CephFS
* Cinder (OpenStack block storage)
* Glusterfs
* VsphereVolume
* Quobyte Volumes
* HostPath (Test de nœud unique uniquement -- le stockage local n'est en aucun cas pris en charge et NE FONCTIONNERA PAS dans un cluster à plusieurs nœuds)
* Portworx Volumes
* ScaleIO Volumes
* StorageOS

## Volumes persistants

Chaque PV contient une spécification et un état, qui sont les spécifications et l'état du volume.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 172.17.0.2
```

{{< note >}}
Des logiciels additionnels supportant un type de montage de volume pourraient être nécessaires afin d'utiliser un PersistentVolume depuis un cluster.
Dans l'exemple d'un PersistentVolume de type NFS, le logiciel additionnel `/sbin/mount.nfs` est requis pour permettre de monter des systèmes de fichiers de type NFS.
{{< /note >}}

### Capacité

Généralement, un PV aura une capacité de stockage spécifique.
Ceci est réglé en utilisant l'attribut `capacity` des PV.
Voir le Kubernetes [modèle de ressource](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) pour comprendre les unités attendues par `capacity`.

Actuellement, la taille du stockage est la seule ressource qui peut être définie ou demandée.
Les futurs attributs peuvent inclure les IOPS, le débit, etc.

### Mode volume

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

Avant Kubernetes 1.9, tous les plug-ins de volume créaient un système de fichiers sur le volume persistant.
Maintenant, vous pouvez définir la valeur de `volumeMode` sur `block` pour utiliser un périphérique de bloc brut, ou `filesystem` pour utiliser un système de fichiers.
`filesystem` est la valeur par défaut si la valeur est omise.
Il s'agit d'un paramètre API facultatif.

### Modes d'accès

Un `PersistentVolume` peut être monté sur un hôte de n'importe quelle manière prise en charge par le fournisseur de ressources.
Comme indiqué dans le tableau ci-dessous, les fournisseurs auront des capacités différentes et les modes d'accès de chaque PV sont définis sur les modes spécifiques pris en charge par ce volume particulier.
Par exemple, NFS peut prendre en charge plusieurs clients en lecture/écriture, mais un PV NFS spécifique peut être exporté sur le serveur en lecture seule.
Chaque PV dispose de son propre ensemble de modes d'accès décrivant les capacités spécifiques de ce PV.

Les modes d'accès sont:

* ReadWriteOnce -- le volume peut être monté en lecture-écriture par un seul nœud
* ReadOnlyMany -- le volume peut être monté en lecture seule par plusieurs nœuds
* ReadWriteMany -- le volume peut être monté en lecture-écriture par de nombreux nœuds

Dans la CLI, les modes d'accès sont abrégés comme suit:

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany

> __Important!__ Un volume ne peut être monté qu'en utilisant un seul mode d'accès à la fois, même s'il prend en charge plusieurs.
  Par exemple, un GCEPersistentDisk peut être monté en tant que ReadWriteOnce par un seul nœud ou ReadOnlyMany par plusieurs nœuds, mais pas en même temps.

| Volume Plugin        | ReadWriteOnce    | ReadOnlyMany     | ReadWriteMany                                    |
| :-: | :-: | :-: | :-: |
| AWSElasticBlockStore | &#x2713;         | -                | -                                                |
| AzureFile            | &#x2713;         | &#x2713;         | &#x2713;                                         |
| AzureDisk            | &#x2713;         | -                | -                                                |
| CephFS               | &#x2713;         | &#x2713;         | &#x2713;                                         |
| Cinder               | &#x2713;         | -                | -                                                |
| CSI                  | dépend du pilote | dépend du pilote | dépend du pilote                                 |
| FC                   | &#x2713;         | &#x2713;         | -                                                |
| FlexVolume           | &#x2713;         | &#x2713;         | dépend du pilote                                 |
| Flocker              | &#x2713;         | -                | -                                                |
| GCEPersistentDisk    | &#x2713;         | &#x2713;         | -                                                |
| Glusterfs            | &#x2713;         | &#x2713;         | &#x2713;                                         |
| HostPath             | &#x2713;         | -                | -                                                |
| iSCSI                | &#x2713;         | &#x2713;         | -                                                |
| Quobyte              | &#x2713;         | &#x2713;         | &#x2713;                                         |
| NFS                  | &#x2713;         | &#x2713;         | &#x2713;                                         |
| RBD                  | &#x2713;         | &#x2713;         | -                                                |
| VsphereVolume        | &#x2713;         | -                | - (fonctionne lorsque les pods sont colocalisés) |
| PortworxVolume       | &#x2713;         | -                | &#x2713;                                         |
| ScaleIO              | &#x2713;         | &#x2713;         | -                                                |
| StorageOS            | &#x2713;         | -                | -                                                |

### Classe

Un PV peut avoir une classe, qui est spécifiée en définissant l'attribut `storageClassName` sur le nom d'une [StorageClass](/docs/concepts/storage/storage-classes/).
Un PV d'une classe particulière ne peut être lié qu'à des PVC demandant cette classe.
Un PV sans `storageClassName` n'a pas de classe et ne peut être lié qu'à des PVC qui ne demandent aucune classe particulière.

Dans le passé, l'annotation `volume.beta.kubernetes.io/storage-class` a été utilisé à la place de l'attribut `storageClassName`.
Cette annotation fonctionne toujours; cependant, il deviendra complètement obsolète dans une future version de Kubernetes.

### Politique de récupération

Les politiques de récupération actuelles sont:

* Retain -- remise en état manuelle
* Recycle -- effacement de base (`rm -rf /thevolume/*`)
* Delete -- l'élément de stockage associé tel qu'AWS EBS, GCE PD, Azure Disk ou le volume OpenStack Cinder est supprimé

Actuellement, seuls NFS et HostPath prennent en charge le recyclage.
Les volumes AWS EBS, GCE PD, Azure Disk et Cinder prennent en charge la suppression.

### Options de montage

Un administrateur Kubernetes peut spécifier des options de montage supplémentaires pour quand un `PersistentVolume` est monté sur un nœud.

{{< note >}}
Tous les types de volumes persistants ne prennent pas en charge les options de montage.
{{< /note >}}

Les types de volume suivants prennent en charge les options de montage:

* AWSElasticBlockStore
* AzureDisk
* AzureFile
* CephFS
* Cinder (OpenStack block storage)
* GCEPersistentDisk
* Glusterfs
* NFS
* Quobyte Volumes
* RBD (Ceph Block Device)
* StorageOS
* VsphereVolume
* iSCSI

Les options de montage ne sont pas validées, donc le montage échouera simplement si l'une n'est pas valide.

Dans le passé, l'annotation `volume.beta.kubernetes.io/mount-options` était utilisée à la place de l'attribut `mountOptions`.
Cette annotation fonctionne toujours; cependant, elle deviendra complètement obsolète dans une future version de Kubernetes.

### Affinité des nœuds

{{< note >}}
Pour la plupart des types de volume, vous n'avez pas besoin de définir ce champ.
Il est automatiquement rempli pour les volumes bloc de type [AWS EBS](/docs/concepts/storage/volumes/#awselasticblockstore), [GCE PD](/docs/concepts/storage/volumes/#gcepersistentdisk) et [Azure Disk](/docs/concepts/storage/volumes/#azuredisk).
Vous devez définir explicitement ceci pour les volumes [locaux](/docs/concepts/storage/volumes/#local).
{{< /note >}}

Un PV peut spécifier une [affinité de nœud](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volumenodeaffinity-v1-core) pour définir les contraintes qui limitent les nœuds à partir desquels ce volume est accessible.
Les pods qui utilisent un PV seront uniquement planifiés sur les nœuds sélectionnés par l'affinité de nœud.

### Phase

Un volume sera dans l'une des phases suivantes:

* Available -- une ressource libre qui n'est pas encore liée à une demande
* Bound -- le volume est lié à une demande
* Released -- la demande a été supprimée, mais la ressource n'est pas encore récupérée par le cluster
* Failed -- le volume n'a pas réussi sa récupération automatique

Le CLI affichera le nom du PVC lié au PV.

## PersistentVolumeClaims

Chaque PVC contient une spécification et un état, qui sont les spécifications et l'état de la réclamation.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 8Gi
  storageClassName: slow
  selector:
    matchLabels:
      release: "stable"
    matchExpressions:
      - {key: environment, operator: In, values: [dev]}
```

### Modes d'accès

Les PVC utilisent les mêmes conventions que les volumes lorsque vous demandez un stockage avec des modes d'accès spécifiques.

### Modes de volume

Les PVC utilisent la même convention que les volumes pour indiquer la consommation du volume en tant que système de fichiers ou périphérique de bloc.

### Ressources

Les PVC, comme les pods, peuvent demander des quantités spécifiques d'une ressource.
Dans ce cas, la demande concerne le stockage.
Le même [modèle de ressource](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) s'applique aux volumes et aux PVC.

### Sélecteur

Les PVC peuvent spécifier un [sélecteur de labels](/docs/concepts/overview/working-with-objects/labels/#label-selectors) pour filtrer davantage l'ensemble des volumes.
Seuls les volumes dont les étiquettes correspondent au sélecteur peuvent être liés au PVC.
Le sélecteur peut comprendre deux champs:

* `matchLabels` - le volume doit avoir un label avec cette valeur
* `matchExpressions` - une liste des exigences définies en spécifiant la clé, la liste des valeurs et l'opérateur qui relie la clé et les valeurs.
  Les opérateurs valides incluent In, NotIn, Exists et DoesNotExist.

Toutes les exigences, à la fois de `matchLabels` et de `matchExpressions` doivent toutes être satisfaites pour correspondre (application d'un opérateur booléen ET).

### Classe

Un PVC peut demander une classe particulière en spécifiant le nom d'une [StorageClass](/docs/concepts/storage/storage-classes/) en utilisant l'attribut `storageClassName`.
Seuls les PV de la classe demandée, ceux ayant le même `storageClassName` que le PVC, peuvent être liés au PVC.

Les PVC n'ont pas nécessairement à demander une classe.
Un PVC avec son attribut `storageClassName` égal à `""` est toujours interprété comme demandant un PV sans classe, il ne peut donc être lié qu'à des PV sans classe (pas d'annotation ou une annotation égal à `""`).
Un PVC sans `storageClassName` n'est pas tout à fait la même et est traité différemment par le cluster, selon que le [`DefaultStorageClass` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass) est activé.

* Si le plug-in d'admission est activé, l'administrateur peut spécifier une valeur par défaut `StorageClass`.
  Tous les PVC qui n'ont pas de `storageClassName` ne peuvent être liés qu'aux PV de cette valeur par défaut.
  La spécification d'une `StorageClass` par défaut se fait en définissant l'annotation `storageclass.kubernetes.io/is-default-class` égal à `true` dans un objet `StorageClass`.
  Si l'administrateur ne spécifie pas de valeur par défaut, le cluster répond à la création de PVC comme si le plug-in d'admission était désactivé.
  Si plusieurs valeurs par défaut sont spécifiées, le plugin d'admission interdit la création de tous les PVC.
* Si le plugin d'admission est désactivé, il n'y a aucune notion de défaut `StorageClass`.
  Tous les PVC qui n'ont pas `storageClassName` peut être lié uniquement aux PV qui n'ont pas de classe.
  Dans ce cas, les PVC qui n'ont pas `storageClassName` sont traités de la même manière que les PVC qui ont leur `storageClassName` égal à `""`.

Selon la méthode d'installation, une `StorageClass` par défaut peut être déployée sur un cluster Kubernetes par le gestionnaire d'extensions pendant l'installation.

Lorsqu'un PVC spécifie un `selector` en plus de demander une `StorageClass`, les exigences sont ET ensemble: seul un PV de la classe demandée et avec les labels demandées peut être lié au PVC.

{{< note >}}
Actuellement, un PVC avec un `selector` non vide ne peut pas avoir un PV provisionné dynamiquement pour cela.
{{< /note >}}

Dans le passé, l'annotation `volume.beta.kubernetes.io/storage-class` a été utilisé au lieu de l'attribut `storageClassName`.
Cette annotation fonctionne toujours; cependant, elle ne sera pas pris en charge dans une future version de Kubernetes.

## PVC sous forme de volumes

Les pods accèdent au stockage en utilisant le PVC comme volume.
Les PVC et les pods qui les utilisent doivent exister dans le même namespace.
Le cluster trouve le PVC dans le namespace où se trouve le pod et l'utilise pour obtenir le `PersistentVolume` visé par le PVC.
Le volume est ensuite monté sur l'hôte et dans le pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myclaim
```

### Remarque au sujet des namespaces

Les liaisons `PersistentVolumes` sont exclusives, et comme les objets `PersistentVolumeClaims` sont des objets vivant dans un namespace donné, le montage de PVC avec les modes "Many" (`ROX`, `RWX`) n'est possible qu'au sein d'un même namespace.

## Prise en charge du volume de bloc brut

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

Les plug-ins de volume suivants prennent en charge les volumes de blocs bruts, y compris l'approvisionnement dynamique, le cas échéant:

* AWSElasticBlockStore
* AzureDisk
* FC (Fibre Channel)
* GCEPersistentDisk
* iSCSI
* Local volume
* RBD (Ceph Block Device)
* VsphereVolume (alpha)

{{< note >}}
Seuls les volumes FC et iSCSI prennent en charge les volumes de blocs bruts dans Kubernetes 1.9.
La prise en charge des plugins supplémentaires a été ajoutée dans 1.10.
{{< /note >}}

### Volumes persistants utilisant un volume de bloc brut

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: block-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  persistentVolumeReclaimPolicy: Retain
  fc:
    targetWWNs: ["50060e801049cfd1"]
    lun: 0
    readOnly: false
```

### Revendication de volume persistant demandant un volume de bloc brut

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: block-pvc
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  resources:
    requests:
      storage: 10Gi
```

### Spécification de pod ajoutant le chemin du périphérique de bloc brut dans le conteneur

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-block-volume
spec:
  containers:
    - name: fc-container
      image: fedora:26
      command: ["/bin/sh", "-c"]
      args: [ "tail -f /dev/null" ]
      volumeDevices:
        - name: data
          devicePath: /dev/xvda
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: block-pvc
```

{{< note >}}
Lorsque vous ajoutez un périphérique de bloc brut pour un pod, vous spécifiez le chemin de périphérique dans le conteneur au lieu d'un chemin de montage.
{{< /note >}}

### Lier des volumes bloc bruts

Si un utilisateur demande un volume de bloc brut en l'indiquant à l'aide du champ `volumeMode` dans la spécification `PersistentVolumeClaim`, les règles de liaison diffèrent légèrement des versions précédentes qui ne considéraient pas ce mode comme faisant partie de la spécification.
Voici un tableau des combinaisons possibles que l'utilisateur et l'administrateur peuvent spécifier pour demander un périphérique de bloc brut.
Le tableau indique si le volume sera lié ou non compte tenu des combinaisons:
Matrice de liaison de volume pour les volumes provisionnés statiquement:

| PV volumeMode | PVC volumeMode | Result  |
|---------------|-:-:------------|--:------|
| unspecified   | unspecified    | BIND    |
| unspecified   | Block          | NO BIND |
| unspecified   | Filesystem     | BIND    |
| Block         | unspecified    | NO BIND |
| Block         | Block          | BIND    |
| Block         | Filesystem     | NO BIND |
| Filesystem    | Filesystem     | BIND    |
| Filesystem    | Block          | NO BIND |
| Filesystem    | unspecified    | BIND    |

{{< note >}}
Seuls les volumes provisionnés statiquement sont pris en charge pour la version alpha.
Les administrateurs doivent prendre en compte ces valeurs lorsqu'ils travaillent avec des périphériques de bloc brut.
{{< /note >}}

## Snapshot et restauration de volumes

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

La fonction de snapshot de volume a été ajoutée pour prendre en charge uniquement les plug-ins de volume CSI.
Pour plus de détails, voir [volume snapshots](/docs/concepts/storage/volume-snapshots/).

Pour activer la prise en charge de la restauration d'un volume à partir d'un snapshot de volume, activez la fonctionnalité `VolumeSnapshotDataSource` sur l'apiserver et le controller-manager.

### Créer du PVC à partir d'un snapshot de volume

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restore-pvc
spec:
  storageClassName: csi-hostpath-sc
  dataSource:
    name: new-snapshot-test
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Clonage de volume

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

La fonctionnalité de clonage de volume a été ajoutée pour prendre en charge uniquement les plug-ins de volume CSI.
Pour plus de détails, voir [clonage de volume](/docs/concepts/storage/volume-pvc-datasource/).

Pour activer la prise en charge du clonage d'un volume à partir d'une source de données PVC, activez la propriété `VolumePVCDataSource` sur l'apiserver et le controller-manager.

### Créer un PVC à partir d'un PVC existant

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cloned-pvc
spec:
  storageClassName: my-csi-plugin
  dataSource:
    name: existing-src-pvc-name
    kind: PersistentVolumeClaim
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Écriture d'une configuration portable

Si vous écrivez des templates de configuration ou des exemples qui s'exécutent sur une large gamme de clusters et nécessitent un stockage persistant, il est recommandé d'utiliser le modèle suivant:

* Incluez des objets `PersistentVolumeClaim` dans votre ensemble de config (aux côtés de `Deployments`, `ConfigMaps`, etc.).
* N'incluez pas d'objets `PersistentVolume` dans la configuration, car l'utilisateur qui instancie la configuration peut ne pas être autorisé à créer des `PersistentVolumes`.
* Donnez à l'utilisateur la possibilité de fournir un nom de classe de stockage lors de l'instanciation du template.
  * Si l'utilisateur fournit un nom de classe de stockage, mettez cette valeur dans le champ `persistentVolumeClaim.storageClassName`.
    Cela entraînera le PVC pour utiliser la bonne classe de stockage si le cluster a cette `StorageClasses` activé par l'administrateur.
  * Si l'utilisateur ne fournit pas de nom de classe de stockage, laissez le champ `persistentVolumeClaim.storageClassName` à zéro.
    Cela entraînera un PV à être automatiquement provisionné pour l'utilisateur avec la `StorageClass` par défaut dans le cluster.
    De nombreux environnements de cluster ont une `StorageClass` par défaut installée, où les administrateurs peuvent créer leur propre `StorageClass` par défaut.
* Dans votre outillage, surveillez les PVCs qui ne sont pas liés après un certain temps et signalez-le à l'utilisateur, car cela peut indiquer que le cluster n'a pas de support de stockage dynamique (auquel cas l'utilisateur doit créer un PV correspondant) ou que le cluster n'a aucun système de stockage (auquel cas l'utilisateur ne peut pas déployer de configuration nécessitant des PVCs).


