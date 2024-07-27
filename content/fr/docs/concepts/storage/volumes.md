---
title: Volumes
content_type: concept
weight: 10
---

<!-- overview -->

Les fichiers sur disque dans un conteneur sont éphémères, ce qui présente des problèmes pour
des applications non-triviales lorsqu'elles s'exécutent dans des conteneurs. Premièrement, lorsqu'un
conteneur plante, kubelet va le redémarrer mais les fichiers seront perdus - le conteneur démarre
avec un état propre. Deuxièmement, lorsque plusieurs conteneurs s'exécutent ensemble dans un `Pod`,
il est souvent nécessaire de partager des fichiers entre ces conteneurs. L'abstraction Kubernetes
`Volume` résout ces deux problèmes.

Une connaissance des [Pods](/fr/docs/concepts/workloads/pods/pod) est suggérée.



<!-- body -->

## Contexte

Docker a également un concept de [volumes](https://docs.docker.com/storage/), bien qu'il
soit, dans une certaine mesure, plus relâché et moins géré.
Avec Docker, un volume est simplement un dossier sur le disque ou dans un autre conteneur.
Les durées de vie ne sont pas gérées et, jusqu'à très récemment, seuls les volumes supportés par un disque local l'étaient.
Docker fournit maintenant des pilotes de volume, mais la fonctionnalité est très limitée pour le moment (par exemple, à partir de Docker 1.7, seulement un pilote de volume est autorisé par conteneur et il n'est pas possible de passer des paramètres aux volumes).

Un volume Kubernetes, en revanche, a une durée de vie explicite - la même que le Pod qui l'inclut.
Par conséquent, un volume survit aux conteneurs qui s'exécutent à l'intérieur du Pod et les données sont préservées lorsque le conteneur redémarre.
Bien sûr, lorsqu'un Pod cesse d'exister, le volume va également cesser d'exister.
Peut-être plus important encore, Kubernetes supporte de nombreux types de volumes et un Pod peut en utiliser plusieurs simultanément.

À la base, un volume est juste un dossier, contenant possiblement des données, qui est accessible aux conteneurs dans un Pod. La manière dont ce dossier est créé, le support qui le sauvegarde et son contenu sont déterminés par le type de volume utilisé.

Pour utiliser un volume, un Pod spécifie les volumes à fournir au Pod (le champ `.spec.volumes`)
et où les monter dans les conteneurs (le champ `.spec.containers.volumeMounts`).

Un processus dans un conteneur a une vue système de fichiers composée de son image et de ses volumes Docker.
L'[image Docker](https://docs.docker.com/userguide/dockerimages/) est à la racine de la hiérarchie du système de fichiers et tous les volumes sont montés sur les chemins spécifiés dans l'image.
Les volumes ne peuvent pas être montés sur d'autres volumes ou avoir des liens physiques vers d'autres volumes.
Chaque conteneur dans le Pod doit spécifier indépendamment où monter chaque volume.

## Types de Volumes

Kubernetes supporte plusieurs types de Volumes:

   * [awsElasticBlockStore](#awselasticblockstore)
   * [azureDisk](#azuredisk)
   * [azureFile](#azurefile)
   * [cephfs](#cephfs)
   * [cinder](#cinder)
   * [configMap](#configmap)
   * [csi](#csi)
   * [downwardAPI](#downwardapi)
   * [emptyDir](#emptydir)
   * [fc (fibre channel)](#fc)
   * [flexVolume](#flexVolume)
   * [flocker](#flocker)
   * [gcePersistentDisk](#gcepersistentdisk)
   * [gitRepo (deprecated)](#gitrepo)
   * [glusterfs](#glusterfs)
   * [hostPath](#hostpath)
   * [iscsi](#iscsi)
   * [local](#local)
   * [nfs](#nfs)
   * [persistentVolumeClaim](#persistentvolumeclaim)
   * [projected](#projected)
   * [portworxVolume](#portworxvolume)
   * [quobyte](#quobyte)
   * [rbd](#rbd)
   * [scaleIO](#scaleio)
   * [secret](#secret)
   * [storageos](#storageos)
   * [vsphereVolume](#vspherevolume)

Toute contribution supplémentaire est la bienvenue.

### awsElasticBlockStore {#awselasticblockstore}

Un type de volume `awsElasticBlockStore` monte un [Volume EBS](http://aws.amazon.com/ebs/) d'Amazon Web Services (AWS) dans un Pod.
À la différence de `emptyDir`, qui est écrasé lorsqu'un Pod est supprimé, le contenu d'un volume EBS
est préservé et le volume est seulement démonté. Cela signifie qu'un volume EBS peut être prérempli avec des données et que les données peuvent être transmises entre les Pods.

{{< caution >}}
Vous devez créer un volume EBS avec la commande `aws ec2 create-volume` ou l'API AWS avant de pouvoir l'utiliser.
{{< /caution >}}

Des restrictions existent lorsque l'on utilise un volume `awsElasticBlockStore` :

* les nœuds dans lesquels les Pods s'exécutent doivent être des instances AWS EC2
* ces instances doivent être dans la même région et la même zone de disponibilité que le volume EBS
* EBS supporte uniquement le montage d'un volume par une seule instance EC2

#### Création d'un volume EBS

Avant que vous puissiez utiliser un volume EBS dans un Pod, vous devez le créer.

```shell
aws ec2 create-volume --availability-zone=eu-west-1a --size=10 --volume-type=gp2
```

Assurez-vous que la zone correspond à la zone de votre grappe de serveurs (cluster).
(Et vérifiez aussi que la taille et le type du volume EBS conviennent à votre utilisation!)

#### Exemple de configuration AWS EBS

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-ebs
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-ebs
      name: test-volume
  volumes:
  - name: test-volume
    # Ce volume AWS EBS doit déjà exister.
    awsElasticBlockStore:
      volumeID: <volume-id>
      fsType: ext4
```

#### Migration CSI

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

La fonctionnalité de migration CSI pour awsElasticBlockStore, lorsque activée, fixe toutes les opérations de plugin depuis le plugin "in-tree" vers le pilote de l'interface CSI (Container Storage Interface) `ebs.csi.aws.com`.
Afin d'utiliser cette fonctionnalité, le [Pilote AWS EBS CSI](https://github.com/kubernetes-sigs/aws-ebs-csi-driver) doit être installé dans le cluster et les fonctionnalités Alpha `CSIMigration` et `CSIMigrationAWS` doivent être activées.

### azureDisk {#azuredisk}

Un type de volume `azureDisk` est utilisé pour monter un disque de données ([Data Disk](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-about-disks-vhds/)) dans un Pod.

Plus de détails sont disponibles [ici](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_disk/README.md).

#### Migration CSI

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

La fonctionnalité de migration CSI pour azureDisk, lorsque activée, fixe toutes les opérations de plugin depuis le plugin "in-tree" vers le pilote de l'interface CSI (Container Storage Interface) `disk.csi.azure.com`.
Afin d'utiliser cette fonctionnalité, le [Pilote Azure Disk CSI](https://github.com/kubernetes-sigs/azuredisk-csi-driver) doit être installé dans le cluster et les fonctionnalités Alpha `CSIMigration` et `CSIMigrationAzureDisk` doivent être activées.

### azureFile {#azurefile}

Un type de volume `azureFile` est utilisé pour monter un volume de fichier Microsoft Azure (SMB 2.1 et 3.0) dans un Pod.

Plus de détails sont disponibles [ici](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_file/README.md).

#### Migration CSI

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

La fonctionnalité de migration CSI pour azureFile, lorsque activée, fixe toutes les opérations de plugin depuis le plugin "in-tree" vers le pilote de l'interface CSI (Container Storage Interface) `file.csi.azure.com`.
Afin d'utiliser cette fonctionnalité, le [Pilote Azure File CSI](https://github.com/kubernetes-sigs/azurefile-csi-driver) doit être installé dans le cluster et les fonctionnalités Alpha `CSIMigration` et `CSIMigrationAzureFile` doivent être activées.

### cephfs {#cephfs}

Un volume `cephfs` permet de monter un volume CephFS existant dans un Pod.
Contrairement à `emptyDir`, qui est écrasé quand un Pod est supprimé, le contenu d'un volume `cephfs` est préservé et le volume est simplement démonté.
Cela signifie qu'un volume CephFS peut être prérempli avec des données et ces données peuvent être transmises entre les Pods.
CephFS peut être monté plusieurs fois en écriture simultanément.

{{< caution >}}
Vous devez exécuter votre propre serveur Ceph avec le partage exporté avant de pouvoir l'utiliser.
{{< /caution >}}

Voir [l'exemple CephFS](https://github.com/kubernetes/examples/tree/master/volumes/cephfs/) pour plus de détails.

### cinder {#cinder}

{{< note >}}
prérequis : Kubernetes avec le fournisseur infonuagique OpenStack (OpenStack Cloud Provider) configuré.
Pour la configuration cloudprovider, se référer à [cloud provider openstack](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#openstack).
{{< /note >}}

`cinder` est utilisé pour monter un volume Cinder OpenStack dans un Pod.

#### Exemple de configuration d'un volume Cinder

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-cinder
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-cinder-container
    volumeMounts:
    - mountPath: /test-cinder
      name: test-volume
  volumes:
  - name: test-volume
    # Ce volume OpenStack doit déjà exister.
    cinder:
      volumeID: <volume-id>
      fsType: ext4
```

#### Migration CSI

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

La fonctionnalité de migration CSI pour Cinder, lorsque activée, fixe toutes les opérations de plugin depuis le plugin "in-tree" vers le pilote de l'interface CSI (Container Storage Interface) `cinder.csi.openstack.org`.
Afin d'utiliser cette fonctionnalité, le [Pilote Cinder CSI](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/using-cinder-csi-plugin.md) doit être installé dans le cluster et les fonctionnalités Alpha `CSIMigration` et `CSIMigrationOpenStack` doivent être activées.

### configMap {#configmap}

La ressource [`configMap`](/docs/tasks/configure-pod-container/configure-pod-configmap/) fournit un moyen d'injecter des données de configuration dans les Pods.
Les données stockées dans un objet `ConfigMap` peuvent être référencées dans un volume de type `configMap`
et être ensuite consommées par des applications conteneurisées s'exécutant dans un Pod.

Lorsque l'on référence un objet `configMap`, on peut simplement fournir son nom dans le volume
pour le référencer. On peut également personnaliser le chemin pour utiliser une entrée spécifique dans
la ConfigMap. Par exemple, pour monter la ConfigMap `log-config` sur un Pod appelé `configmap-pod`,
vous pourriez utiliser le YAML suivant :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
    - name: test
      image: busybox
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: log-config
        items:
          - key: log_level
            path: log_level
```

La ConfigMap `log-config` est montée comme un volume et tout le contenu stocké dans son entrée `log_level`
est monté dans le Pod au chemin "`/etc/config/log_level`".
À noter que ce chemin est dérivé du `mountPath` du volume et le `path` est étiqueté avec la clef `log_level`.

{{< caution >}}
Vous devez créer une [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) avant de pouvoir l'utiliser.
{{< /caution >}}

{{< note >}}
Un conteneur utilisant une ConfigMap en tant que montage de volume [subPath](#using-subpath) ne recevra pas les mises à jour de la ConfigMap.
{{< /note >}}

### downwardAPI {#downwardapi}

Un volume `downwardAPI` est utilisé pour rendre disponibles aux applications les données de l'API Downward.
Il monte un dossier et écrit les données demandées dans des fichiers de texte brut.

{{< note >}}
Un conteneur utilisant l'API Downward en tant que montage de volume [subPath](#using-subpath) ne recevra pas les mises à jour de l'API Downward.
{{< /note >}}

Voir [l'exemple de volume `downwardAPI`](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/) pour plus de détails.

### emptyDir {#emptydir}

Un volume `emptyDir` est d'abord créé lorsqu'un Pod est assigné à un nœud et existe aussi longtemps que le Pod s'exécute sur ce nœud.
Comme le nom l'indique, le volume est initialement vide. Les conteneurs dans le Pod peuvent tous lire et écrire les mêmes fichiers dans le volume `emptyDir`, bien que ce volume puisse être monté sur le même ou différents chemins dans chaque conteneur.
Lorsqu'un Pod est supprimé d'un nœud pour une raison quelconque, les données dans le `emptyDir` sont supprimées à jamais.

{{< note >}}
Un conteneur qui plante ne retire *PAS* un Pod d'un nœud, ainsi, les données présentes dans un `emptyDir` sont protégées en cas de plantage du conteneur.
{{< /note >}}

Des cas d'utilisation pour un `emptyDir` peuvent être :

* un espace de travail, par exemple pour un tri fusion sur disque.
* l'établissement d'un point de reprise d'un long calcul à des fins de récupération des données après un crash.
* le stockage de fichiers qu'un conteneur de gestion de contenu va chercher pendant qu'un conteneur serveur web expose les données.

Par défaut, les volumes `emptyDir` sont stockés sur tout médium supporté par le nœud - que ce soit un disque dur, un disque SSD ou un stockage réseau, dépendamment de l'environnement.
Cependant, vous pouvez définir le champ `emptyDir.medium` à `"Memory"` pour indiquer à Kubernetes de monter un tmpfs (système de fichiers supporté par la RAM) pour vous à la place.
Tandis que tmpfs est très rapide, soyez conscient qu'au contraire des disques, un tmpfs est effacé au redémarrage du nœud et tous les fichiers que vous écrivez seront comptabilisés dans la limite de mémoire de votre conteneur.

#### Exemple de Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir: {}
```

### fc (fibre channel) {#fc}

Un volume `fc` permet à un volume Fibre Channel existant d'être monté dans un Pod.
Vous pouvez spécifier une ou plusieurs cibles World Wide Names en utilisant le paramètre
`targetWWNs` dans votre configuration de volume.
Si plusieurs WWNs sont spécifiés, targetWWNs s'attend à ce que ces WWNs proviennent de connexions multi-path.

{{< caution >}}
Vous devez configurer un zonage FC SAN pour allouer et masquer au préalable ces LUNs (volumes) aux cibles WWNs afin que les hôtes Kubernetes puissent y accéder.
{{< /caution >}}

Voir [l'exemple FC](https://github.com/kubernetes/examples/tree/master/staging/volumes/fibre_channel) pour plus de détails.

### flocker {#flocker}

[Flocker](https://github.com/ClusterHQ/flocker) est un gestionnaire de volumes de données en cluster open-source. Il assure la gestion et l'orchestration de volumes de données supportés par divers serveurs de stockage.

Un volume `flocker` permet de monter un ensemble de données Flocker dans un Pod.
Si l'ensemble de données n'existe pas déjà dans Flocker, il doit d'abord être créé avec la CLI Flocker ou en utilisant l'API Flocker.
Si l'ensemble de données existe déjà, il sera réattaché par Flocker au nœud sur lequel le Pod est planifié.
Cela signifie que les données peuvent être transmises entre les Pods selon les besoins.

{{< caution >}}
Vous devez exécuter votre propre installation de Flocker avant de pouvoir l'utiliser.
{{< /caution >}}

Voir [l'exemple Flocker](https://github.com/kubernetes/examples/tree/master/staging/volumes/flocker) pour plus de détails.

### gcePersistentDisk {#gcepersistentdisk}

Un volume `gcePersistentDisk` monte un [Disque Persistant](http://cloud.google.com/compute/docs/disks) Google Compute Engine (GCE) dans un Pod.
À la différence d'un `emptyDir`, qui est écrasé lorsqu'un Pod est supprimé, le contenu d'un disque persistant est préservé et le volume est simplement démonté. Cela signifie qu'un disque persistant peut être prérempli avec des données et que ces données peuvent être transmises entre les Pods.

{{< caution >}}
Vous devez créer un disque persistant en utilisant `gcloud`, l'API GCE ou l'interface utilisateur avant de pouvoir utiliser ce disque.
{{< /caution >}}

Des restrictions existent lors de l'utilisation d'un `gcePersistentDisk`:

* les nœuds sur lesquels les Pods s'exécutent doivent être des machines virtuelles (VMs) GCE.
* ces VMs doivent se trouver dans le même projet et la même zone GCE que le disque persistant

Une fonctionnalité des disques persistants est qu'ils peuvent être montés en lecture seule par plusieurs consommateurs simultanément.
Cela signifie que vous pouvez préremplir un disque persistant avec votre jeu de données et l'exposer en parallèle à partir d'autant de Pods que nécessaire.
Malheureusement, les disques persistants peuvent seulement être montés par un seul consommateur en mode lecture-écriture - les écritures simultanées ne sont pas autorisées.

Utiliser un disque persistant dans un Pod contrôlé par un ReplicationController échouera à moins que le disque persistant soit en lecture seule ou que le nombre de répliques soit de 0 ou 1.

#### Création d'un disque persistant

Avant de pouvoir utiliser un disque persistant GCE avec un Pod, vous devez le créer.

```shell
gcloud compute disks create --size=500GB --zone=us-central1-a my-data-disk
```

#### Exemple de Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    # Ce disque persistant GCE doit déjà exister.
    gcePersistentDisk:
      pdName: my-data-disk
      fsType: ext4
```

#### Disques persistants régionaux
{{< feature-state for_k8s_version="v1.10" state="beta" >}}

La fonctionnalité de disques persistants régionaux ([Regional Persistent Disks](https://cloud.google.com/compute/docs/disks/#repds)) permet la création de disques persistants disponibles dans deux zones à l'intérieur d'une même région.
Afin d'utiliser cette fonctionnalité, le volume doit être provisionné en tant que PersistentVolume; le référencement du volume directement depuis un Pod n'est pas supporté.

#### Provisionnement manuel d'un disque persistant régional en tant que PersistentVolume

Le provisionnement dynamique est possible en utilisant une [StorageClass pour un disque persistant GCE](/docs/concepts/storage/storage-classes/#gce-pd).
Avant de créer un PersistentVolume, vous devez créer le disque persistant :
```shell
gcloud beta compute disks create --size=500GB my-data-disk
    --region us-central1
    --replica-zones us-central1-a,us-central1-b
```
Exemple de spec PersistentVolume :

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: test-volume
  labels:
    failure-domain.beta.kubernetes.io/zone: us-central1-a__us-central1-b
spec:
  capacity:
    storage: 400Gi
  accessModes:
  - ReadWriteOnce
  gcePersistentDisk:
    pdName: my-data-disk
    fsType: ext4
```

#### Migration CSI

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

La fonctionnalité de migration CSI pour un disque persistant GCE, lorsque activée, fixe toutes les opérations de plugin depuis le plugin "in-tree" vers le pilote de l'interface CSI (Container Storage Interface) `pd.csi.storage.gke.io`.
Afin d'utiliser cette fonctionnalité, le [Pilote CSI de disque persistant GCE](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/using-cinder-csi-plugin.md) doit être installé dans le cluster et les fonctionnalités Alpha `CSIMigration` et `CSIMigrationGCE` doivent être activées.

### gitRepo (obsolète) {#gitrepo}

{{< warning >}}
Le type de volume gitRepo est obsolète. Pour provisionner un conteneur avec un dépôt git, il faut monter un [EmptyDir](#emptydir) dans un InitContainer qui clone le dépôt en utilisant git, ensuite, monter le [EmptyDir](#emptydir) dans le conteneur du Pod.
{{< /warning >}}

Un volume `gitRepo` est un exemple de ce qui peut être réalisé en tant que plugin de volume.
Cela monte un dossier vide et clone un dépôt git à l'intérieur, à la disposition d'un Pod.
Dans le futur, de tels volumes pourraient être déplacé vers un modèle encore plus découplé plutôt qu'étendre l'API Kubernetes pour chaque cas d'utilisation.

Voici un exemple d'un volume gitRepo :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: server
spec:
  containers:
  - image: nginx
    name: nginx
    volumeMounts:
    - mountPath: /mypath
      name: git-volume
  volumes:
  - name: git-volume
    gitRepo:
      repository: "git@somewhere:me/my-git-repository.git"
      revision: "22f1d8406d464b0c0874075539c1f2e96c253775"
```

### glusterfs {#glusterfs}

Un volume `glusterfs` permet à un volume [Glusterfs](http://www.gluster.org) (un système de fichiers en réseau open
source) d'être monté dans un Pod. À la différence d'un `emptyDir`, qui est écrasé lorsqu'un Pod est supprimé. le contenu d'un volume `glusterfs` est préservé et le volume est simplement démonté.
Cela signifie qu'un volume glusterfs peut être prérempli avec des données et que ces données peuvent être transmises entre les Pods.
GlusterFS peut être monté plusieurs fois en écriture simultanément.

{{< caution >}}
Vous devez exécuter votre propre installation de GlusterFS avant de pouvoir l'utiliser.
{{< /caution >}}

Voir [l'exemple GlusterFS](https://github.com/kubernetes/examples/tree/master/volumes/glusterfs) pour plus de détails.

### hostPath {#hostpath}

Un volume `hostPath` monte un fichier ou un dossier depuis le système de fichiers du nœud hôte à l'intérieur d'un Pod.
Ce ne sera pas requis pour la plupart des Pods, mais cela offre une puissante solution de secours pour certaines applications.

Par exemple, des utilisations du `hostPath` peuvent être :

* exécuter un conteneur qui nécessite l'accès aux éléments internes de Docker; utiliser un `hostPath` de `/var/lib/docker`
* exécuter cAdvisor dans un conteneur; utiliser un `hostPath` de `/sys`
* autoriser un Pod à spécifier si un `hostPath` donné devrait exister avant la mise en exécution du Pod, s'il devrait être créé et en tant que quoi il devrait exister.

En plus de la propriété requise `path`, un utilisateur peut optionnellement spécifier un `type` pour un volume `hostPath`.

Les valeurs supportées pour le champ `type` sont les suivantes :


| Valeur | Comportement |
|:------|:---------|
| | Une chaîne de caractères vide (par défaut) sert à la rétrocompatibilité, ce qui signifie qu'aucune vérification ne sera effectuée avant de monter le volume hostPath. |
| `DirectoryOrCreate` | Si rien n'existe au chemin fourni, un dossier vide y sera créé au besoin avec les permissions définies à 0755, avec le même groupe et la même possession que Kubelet. |
| `Directory` | Un dossier doit exister au chemin fourni |
| `FileOrCreate` | Si rien n'existe au chemin fourni, un fichier vide y sera créé au besoin avec les permissions définies à 0644, avec le même groupe et la même possession que Kubelet. |
| `File` | Un fichier doit exister au chemin fourni |
| `Socket` | Un socket UNIX doit exister au chemin fourni |
| `CharDevice` | Un périphérique en mode caractère doit exister au chemin fourni |
| `BlockDevice` | Un périphérique en mode bloc doit exister au chemin fourni |

Une attention particulière doit être portée lors de l'utilisation de ce type de volume car :

* les Pods avec une configuration identique (tels que ceux créés depuis un podTemplate) peuvent se comporter différemment sur des nœuds différents à cause de fichiers différents sur les nœuds.
* lorsque Kubernetes ajoute une planification tenant compte des ressources, comme prévu, il ne pourra pas prendre en compte les ressources utilisées par un `hostPath`.
* les fichiers ou dossiers créés sur les hôtes sous-jacents ne sont accessibles en écriture que par root. Vous devez soit exécuter votre programme en tant que root dans un [conteneur privilégié](/docs/user-guide/security-context) ou modifier les permissions du fichier sur l'hôte pour pouvoir écrire dans un volume `hostPath`.

#### Exemple de Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    hostPath:
      # chemin du dossier sur l'hôte
      path: /data
      # ce champ est optionnel
      type: Directory
```

### iscsi {#iscsi}

Un volume `iscsi` permet à un volume existant iSCSI (SCSI over IP) d'être monté dans un Pod.
À la différence d'un `emptyDir`, qui est écrasé lorsqu'un Pod est supprimé, le contenu d'un volume `iscsi` est préservé et le volume est simplement démonté.
Cela signifie qu'un volume iscsi peut être prérempli avec des données que ces données peuvent être transmises entre les Pods.

{{< caution >}}
Vous devez exécuter votre propre serveur iSCSI avec le volume créé avant de pouvoir l'utiliser.
{{< /caution >}}

Une fonctionnalité de iSCSI est qu'il peut être monté en lecture seule par plusieurs consommateurs simultanément.
Cela signifie que vous pouvez préremplir un volume avec votre jeu de données et l'exposer en parallèle à partir d'autant de Pods que nécessaire.
Malheureusement, les volumes iSCSI peuvent seulement être montés par un seul consommateur en mode lecture-écriture - les écritures simultanées ne sont pas autorisées.

Voir [l'exemple iSCSI](https://github.com/kubernetes/examples/tree/master/volumes/iscsi) pour plus de détails.

### local {#local}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Un volume `local` représente un périphérique de stockage local monté tels qu'un disque, une partition ou un dossier.

Les volumes locaux peuvent seulement être utilisés comme un PersistentVolume créé statiquement.
Le provisionnement dynamique n'est pas encore supporté.

Comparés aux volumes `hostPath`, les volumes locaux peuvent être utilisés de manière durable et portable sans planifier manuellement des Pods sur les nœuds, puisque le système est conscient des contraintes de nœud du volume en examinant l'affinité de nœud sur le PersistentVolume.

Toutefois, les volumes locaux sont encore sujets à la disponibilité du nœud sous-jacent et ne conviennent pas à toutes les applications. Si un nœud devient "en mauvaise santé" (unhealthy), alors le volume local deviendra également inaccessible et un Pod qui l'utilise ne sera pas en mesure de s'exécuter. Les applications qui utilisent des volumes locaux doivent être en mesure de tolérer cette disponibilité réduite, ainsi que de potentielles pertes de données, dépendamment des caractéristiques de durabilité du disque sous-jacent.

L'exemple suivant traite d'une spec d'un PersistentVolume utilisant un volume `local` et une `nodeAffinity`:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 100Gi
  # le champ volumeMode requiert l'activation de la "feature gate" Alpha BlockVolume
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local:
    path: /mnt/disks/ssd1
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - example-node
```

La `nodeAffinity` d'un PersistentVolume est requise lors de l'utilisation de volumes locaux.
Cela permet au planificateur (scheduler) Kubernetes de planifier correctement des Pods utilisant des volumes locaux aux bons nœuds.

Le `volumeMode` d'un PersistentVolume peut maintenant être configuré à "Block" (au lieu de la valeur par défaut "Filesystem") pour exposer le volume local en tant que périphérique bloc brut (raw block device).
Le champ `volumeMode` requiert l'activation de la "feature gate" Alpha `BlockVolume`.

Lors de l'utilisation des volumes locaux, il est recommandé de créer une StorageClass avec `volumeBindingMode` configuré à `WaitForFirstConsumer`. Voir [l'exemple](/docs/concepts/storage/storage-classes/#local). Retarder la liaison (binding) du volume garantit que la décision de liaison du PersistentVolumeClaim  sera également évaluée avec toutes les autres contraintes de nœud que le Pod peut avoir, tels que les exigences en ressources du nœud, les sélecteurs de nœud, leur affinité et leur anti-affinité.

Un provisionneur statique externe peut être exécuté séparément pour une gestion améliorée du cycle de vie du volume local.
Noter que ce provisionneur ne supporte pas encore le provisionnement dynamique. Pour un exemple sur la façon d'exécuter un provisionneur externe local, voir le [guide utilisateur de provisionneur de volume local](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner).

{{< note >}}
Le PersistentVolume local requiert un nettoyage manuel et une suppression par l'utilisateur si le provisionneur statique n'est pas utilisé pour gérer le cycle de vie du volume.
{{< /note >}}

### nfs {#nfs}

Un volume `nfs` permet à un partage NFS (Network File System) existant d'être monté dans un Pod.
À la différence d'un `emptyDir`, qui est écrasé lorsqu'un Pod est supprimé, le contenu d'un volume `nfs` est préservé et le volume est simplement démonté.
Cela signifie qu'un volume NFS peut être prérempli avec des données et que les données peuvent être transmises entre les Pods. NFS peut être monté plusieurs fois en écriture simultanément.

{{< caution >}}
Vous devez exécuter votre propre serveur NFS avec le partage exporté avant de pouvoir l'utiliser.
{{< /caution >}}

Voir [l'exemple NFS](https://github.com/kubernetes/examples/tree/master/staging/volumes/nfs) pour plus de détails.

### persistentVolumeClaim {#persistentvolumeclaim}

Un volume `persistentVolumeClaim` est utilisé pour monter un [PersistentVolume](/docs/concepts/storage/persistent-volumes/) dans un Pod. Les PersistentVolumes sont une manière pour les utilisateurs de "revendiquer" un stockage durable (comme un PersistentDisk GCE ou un volume iSCSI) sans savoir les détails d'un environnement cloud particulier.

Voir [l'exemple PersistentVolumes](/docs/concepts/storage/persistent-volumes/) pour plus de détails.

### projected {#projected}

Un volume `projected` mappe plusieurs sources de volume existantes dans le même dossier.

Actuellement, les types de sources de volume suivantes peuvent être projetés :

- [`secret`](#secret)
- [`downwardAPI`](#downwardapi)
- [`configMap`](#configmap)
- `serviceAccountToken`

Toutes les sources doivent se trouver dans le même namespace que celui du Pod. Pour plus de détails, voir le [document de conception tout-en-un ](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/node/all-in-one-volume.md).

La projection des jetons de compte de service (service account) est une fonctionnalité introduite dans Kubernetes 1.11 et promue en Beta dans la version 1.12.
Pour activer cette fonctionnalité dans la version 1.11, il faut configurer explicitement la ["feature gate" `TokenRequestProjection`](/docs/reference/command-line-tools-reference/feature-gates/) à "True".

#### Exemple d'un Pod avec un secret, une API downward et une configmap.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
spec:
  containers:
  - name: container-test
    image: busybox
    volumeMounts:
    - name: all-in-one
      mountPath: "/projected-volume"
      readOnly: true
  volumes:
  - name: all-in-one
    projected:
      sources:
      - secret:
          name: mysecret
          items:
            - key: username
              path: my-group/my-username
      - downwardAPI:
          items:
            - path: "labels"
              fieldRef:
                fieldPath: metadata.labels
            - path: "cpu_limit"
              resourceFieldRef:
                containerName: container-test
                resource: limits.cpu
      - configMap:
          name: myconfigmap
          items:
            - key: config
              path: my-group/my-config
```

#### Exemple d'un Pod avec plusieurs secrets avec une configuration de mode de permission autre que celle par défaut.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
spec:
  containers:
  - name: container-test
    image: busybox
    volumeMounts:
    - name: all-in-one
      mountPath: "/projected-volume"
      readOnly: true
  volumes:
  - name: all-in-one
    projected:
      sources:
      - secret:
          name: mysecret
          items:
            - key: username
              path: my-group/my-username
      - secret:
          name: mysecret2
          items:
            - key: password
              path: my-group/my-password
              mode: 511
```

Chaque source de volume projeté est listée dans la spec, sous `sources`. Les paramètres sont à peu près les mêmes avec deux exceptions :

* Pour les secrets, le champ `secretName` a été changé par `name` pour être consistant avec le nommage des ConfigMap.
* Le `defaultMode` peut seulement être spécifié au niveau projeté et non pour chaque source de volume. Cependant, tel qu'illustré au-dessus, il est possible de configurer explicitement le `mode` pour chaque projection individuelle.

Lorsque la fonctionnalité `TokenRequestProjection` est activée, vous pouvez injecter le jeton pour le [service account](/docs/reference/access-authn-authz/authentication/#service-account-tokens) courant dans un Pod au chemin spécifié. Ci-dessous, un exemple :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sa-token-test
spec:
  containers:
  - name: container-test
    image: busybox
    volumeMounts:
    - name: token-vol
      mountPath: "/service-account"
      readOnly: true
  volumes:
  - name: token-vol
    projected:
      sources:
      - serviceAccountToken:
          audience: api
          expirationSeconds: 3600
          path: token
```

Le pod d'exemple possède un volume projeté contenant le jeton injecté du service account.
Ce jeton peut être utilisé par des conteneurs de Pod pour accéder au service d'API Kubernetes API, par exemple.
Le champ `audience` contient l'audience-cible du jeton.
Un destinataire du jeton doit s'identifier avec un identificateur spécifié dans l'audience du jeton, sinon il doit rejeter le jeton. Ce champ est facultatif et sa valeur par défaut est l'identifiant du serveur API.

Le champ `expirationSeconds` est la durée de validité attendue du jeton de service account.
Sa valeur par défaut est de 1 heure et doit être au moins de 10 minutes (600 secondes). Un administrateur peut aussi limiter sa valeur maximum en spécifiant l'option `--service-account-max-token-expiration` pour le serveur API.
Le champ `path` spécifie un chemin relatif au point de montage du volume projeté.

{{< note >}}
Un conteneur utilisant une source de volume projeté en tant que point de montage de volume [subPath](#using-subpath) ne recevra pas de mises à jour pour ces sources de volume.
{{< /note >}}

### portworxVolume {#portworxvolume}

Un `portworxVolume` est une couche de stockage bloc élastique qui s'exécute de manière hyperconvergée avec Kubernetes.
[Portworx](https://portworx.com/use-case/kubernetes-storage/) donne l'empreinte digitale d'un stockage dans un serveur, tiers basés sur les capacités et agrège la capacité sur plusieurs serveurs. Portworx s'exécute en invité sur des machines virtuelles ou sur des nœuds Linux bare metal.

Un `portworxVolume` peut être créé dynamiquement à travers Kubernetes ou il peut également être pré-provisionné et référencé à l'intérieur d'un Pod Kubernetes.
Voici un exemple de Pod référençant un PortworxVolume pré-provisionné :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-portworx-volume-pod
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /mnt
      name: pxvol
  volumes:
  - name: pxvol
    # Ce volume Portworx doit déjà exister.
    portworxVolume:
      volumeID: "pxvol"
      fsType: "<fs-type>"
```

{{< caution >}}
Il faut s'assurer d'avoir un PortworxVolume existant avec le nom `pxvol` avant de l'utiliser dans le Pod.
{{< /caution >}}

Plus de détails et d'exemples peuvent être trouvé [ici](https://github.com/kubernetes/examples/tree/master/staging/volumes/portworx/README.md).

### quobyte {#quobyte}

Un volume `quobyte` permet à un volume existant [Quobyte](http://www.quobyte.com) d'être monté dans un Pod.

{{< caution >}}
Vous devez exécuter votre propre configuration Quobyte avec les volumes créés avant de pouvoir l'utiliser.
{{< /caution >}}

Quobyte supporte le {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}.
CSI est le plugin recommandé pour utiliser les volumes Quobyte volumes dans Kubernetes. Le projet GitHub Quobyte dispose [d'instructions](https://github.com/quobyte/quobyte-csi#quobyte-csi) pour déployer Quobyte en utilisant CSI, avec des exemples.

### rbd {#rbd}

Un volume `rbd` permet à un volume périphérique bloc Rados ([Rados Block
Device](http://ceph.com/docs/master/rbd/rbd/)) d'être monté dans un Pod.
À la différence d'un `emptyDir`, qui est écrasé lorsqu'un Pod est supprimé, le contenu d'un volume `rbd` est préservé et le volume est simplement démonté.
Cela signifie qu'un volume RBD peut être prérempli avec des données et que ces données peuvent être transmises entre les Pods.

{{< caution >}}
Vous devez exécuter votre propre installation Ceph avant de pouvoir utiliser RBD.
{{< /caution >}}

Une fonctionnalité de RBD est qu'il peut être monté en lecture seule par plusieurs consommateurs simultanément.
Cela signifie que vous pouvez préremplir un volume avec votre jeu de données et l'exposer en parallèle à partir d'autant de Pods que nécessaire.
Malheureusement, les volumes RBD peuvent seulement être montés par un seul consommateur en mode lecture-écriture - les écritures simultanées ne sont pas autorisées.

Voir [l'exemple RBD](https://github.com/kubernetes/examples/tree/master/volumes/rbd) pour plus de détails.

### scaleIO {#scaleio}

ScaleIO est une plateforme de stockage logicielle qui peut utiliser du matériel physique existant pour créer des clusters de stockage bloc partagé en réseau évolutif.
Le plugin de volume `scaleIO` permet aux Pods déployés d'accéder à des volumes ScaleIO existants (ou il peut provisionner dynamiquement de nouveaux volumes pour des revendications de volumes persistants, voir [ScaleIO Persistent Volumes](/docs/concepts/storage/persistent-volumes/#scaleio)).

{{< caution >}}
Vous devez exécuter un cluster ScaleIO déjà configuré avec les volumes créés avant de pouvoir les utiliser.
{{< /caution >}}

L'exemple suivant montre une configuration de Pod avec ScaleIO :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-0
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: pod-0
    volumeMounts:
    - mountPath: /test-pd
      name: vol-0
  volumes:
  - name: vol-0
    scaleIO:
      gateway: https://localhost:443/api
      system: scaleio
      protectionDomain: sd0
      storagePool: sp1
      volumeName: vol-0
      secretRef:
        name: sio-secret
      fsType: xfs
```

Pour plus de détails, consulter [les exemples ScaleIO](https://github.com/kubernetes/examples/tree/master/staging/volumes/scaleio).

### secret {#secret}

Un volume `secret` est utilisé pour fournir des informations sensibles, comme des mots de passe, aux Pods.
Vous pouvez stocker des secrets dans l'API Kubernetes et les monter en tant que fichiers pour être utilisés par les Pods sans les coupler directement avec Kubernetes. Les volumes `secret` sont supportés par tmpfs (un système de fichiers en RAM) pour qu'ils ne soient jamais écrits sur du stockage non volatil.

{{< caution >}}
Vous devez créer un secret dans l'API Kubernetes avant de pouvoir l'utiliser.
{{< /caution >}}

{{< note >}}
Un conteneur utilisant un secret en tant que point de montage de volume [subPath](#using-subpath) ne recevra pas les mises à jour des secrets.
{{< /note >}}

Les secrets sont décrits plus en détails [ici](/docs/concepts/configuration/secret/).

### storageOS {#storageos}

Un volume `storageos` permet à un volume [StorageOS](https://www.storageos.com) existant d'être monté dans un Pod.

StorageOS s'exécute en tant que conteneur dans l'environnement Kubernetes en rendant le stockage local ou attaché accessible depuis n'importe quel nœud dans le cluster Kubernetes.
Les données peuvent être répliquées pour se protéger des défaillances de nœuds.
Les techniques d'allocation fine et dynamique et de compression peuvent améliorer l'utilisation et réduire les coûts.

À la base, StorageOS fournit un stockage bloc aux conteneurs accessible via un système de fichiers.

Le conteneur StorageOS requiert Linux 64-bit et n'a pas besoin de dépendances supplémentaires.
Une licence développeur libre est disponible.

{{< caution >}}
Vous devez exécuter le conteneur StorageOS sur chaque nœud qui souhaite accéder aux volumes StorageOS ou qui veut contribuer à la
capacité de stockage du pool.
Pour les instructions d'installation, consulter la [documentation StorageOS](https://docs.storageos.com).
{{< /caution >}}

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: redis
    role: master
  name: test-storageos-redis
spec:
  containers:
    - name: master
      image: kubernetes/redis:v1
      env:
        - name: MASTER
          value: "true"
      ports:
        - containerPort: 6379
      volumeMounts:
        - mountPath: /redis-master-data
          name: redis-data
  volumes:
    - name: redis-data
      storageos:
        # Le volume `redis-vol01` doit déjà exister dans StorageOS, dans le namespace `default`.
        volumeName: redis-vol01
        fsType: ext4
```

Pour plus d'informations incluant le provisionnement dynamique (Dynamic Provisioning) et les réclamations de volume persistant (Persistent Volume Claims), consulter les [exemples StorageOS](https://github.com/kubernetes/examples/blob/master/volumes/storageos).

### vsphereVolume {#vspherevolume}

{{< note >}}
Prérequis : Kubernetes avec vSphere Cloud Provider configuré. Pour la configuration cloudprovider,
se référer au [guide de mise en marche vSphere](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/).
{{< /note >}}

Un volume `vsphereVolume` est utilisé pour monter un volume vSphere VMDK dans un Pod.  Le contenu d'un volume est préservé lorsqu'il est démonté. Il supporte les banques de données (datastore) VMFS and VSAN.

{{< caution >}}
Vous devez créer VMDK en utilisant une des méthodes suivantes avant de l'utiliser avec un Pod.
{{< /caution >}}

#### Création d'un volume VMDK

Choisir une des méthodes suivantes pour créer un VMDK.

{{< tabs name="tabs_volumes" >}}
{{% tab name="Création en utilisant vmkfstools" %}}
Premièrement, se connecter en ssh dans l'ESX, ensuite, utiliser la commande suivante pour créer un VMDK :

```shell
vmkfstools -c 2G /vmfs/volumes/DatastoreName/volumes/myDisk.vmdk
```
{{% /tab %}}
{{% tab name="Création en utilisant vmware-vdiskmanager" %}}
Utiliser la commande suivante pour créer un VMDK:

```shell
vmware-vdiskmanager -c -t 0 -s 40GB -a lsilogic myDisk.vmdk
```
{{% /tab %}}

{{< /tabs >}}


#### Exemple de configuration vSphere VMDK

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-vmdk
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-vmdk
      name: test-volume
  volumes:
  - name: test-volume
    # Ce volume VMDK doit déjà exister.
    vsphereVolume:
      volumePath: "[DatastoreName] volumes/myDisk"
      fsType: ext4
```

Plus d'exemples sont disponibles [ici](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere).


## Utilisation de subPath

Parfois, il est utile de partager un volume pour plusieurs utilisations dans un même Pod.
La propriété `volumeMounts[*].subPath` peut être utilisée pour spécifier un sous-chemin à l'intérieur du volume référencé au lieu de sa racine.

Voici un exemple d'un Pod avec une stack LAMP (Linux Apache Mysql PHP) utilisant un unique volume partagé.
Le contenu HTML est mappé à son dossier `html` et les bases de données seront stockées dans son dossier `mysql` :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-lamp-site
spec:
    containers:
    - name: mysql
      image: mysql
      env:
      - name: MYSQL_ROOT_PASSWORD
        value: "rootpasswd"
      volumeMounts:
      - mountPath: /var/lib/mysql
        name: site-data
        subPath: mysql
    - name: php
      image: php:7.0-apache
      volumeMounts:
      - mountPath: /var/www/html
        name: site-data
        subPath: html
    volumes:
    - name: site-data
      persistentVolumeClaim:
        claimName: my-lamp-site-data
```

### Utilisation d'un subPath avec des variables d'environnement étendues

{{< feature-state for_k8s_version="v1.15" state="beta" >}}


Utiliser le champ `subPathExpr` pour construire des noms de dossier `subPath` depuis les variables d'environnement de l'API Downward.
Avant d'utiliser cette fonctionnalité, vous devez activer la "feature gate" `VolumeSubpathEnvExpansion`.
Les propriétés `subPath` et `subPathExpr` sont mutuellement exclusives.

Dans cet exemple, un Pod utilise `subPathExpr` pour créer un dossier `pod1` à l'intérieur du volume hostPath `/var/log/pods`, en utilisant le nom du pod depuis l'API Downward.
Le dossier hôte `/var/log/pods/pod1` est monté sur `/logs` dans le conteneur.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
spec:
  containers:
  - name: container1
    env:
    - name: POD_NAME
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    image: busybox
    command: [ "sh", "-c", "while [ true ]; do echo 'Hello'; sleep 10; done | tee -a /logs/hello.txt" ]
    volumeMounts:
    - name: workdir1
      mountPath: /logs
      subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
  - name: workdir1
    hostPath:
      path: /var/log/pods
```

## Ressources

Le support de stockage (Disk, SSD, etc.)  d'un volume `emptyDir` est déterminé par le support du système de fichiers
contenant le dossier racine de kubelet (typiquement `/var/lib/kubelet`).
Il n'y a pas de limite sur l'espace qu'un volume `emptyDir` ou `hostPath` peut consommer
et pas d'isolation entre les conteneurs ou entre les Pods.

Dans le futur, il est prévu que les volumes `emptyDir` et `hostPath` soient en mesure de demander une certaine quantité d'espace en utilisant une spécification de [ressource](/docs/user-guide/compute-resources) et de sélectionner un type de support à utiliser, pour les clusters qui ont plusieurs types de support.

## Plugins de volume Out-of-Tree
Les plugins de volume Out-of-tree incluent l'interface CSI (Container Storage Interface) et FlexVolume.
Ils permettent aux fournisseurs de stockage de créer des plugins de stockage personnalisés sans les ajouter au dépôt Kubernetes.

Avant l'introduction de l'interface CSI et FlexVolume, tous les plugins de volume (tels que les types de volume listés plus haut) étaient "in-tree", ce qui signifie qu'ils étaient construits, liés, compilés et livrés avec les binaires de base Kubernetes et étendent l'API Kubernetes de base.
Cela signifiait que l'ajout d'un nouveau système de stockage à Kubernetes (un plugin de volume) requérait de vérifier le code dans le dépôt de base de Kubernetes.

CSI et FlexVolume permettent à des plugins de volume d'être développés indépendamment de la base de code Kubernetes et déployés (installés) sur des clusters Kubernetes en tant qu'extensions.

Pour les fournisseurs de stockage qui cherchent à créer un plugin de volume "out-of-tree", se référer à [cette FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).

### CSI

L'interface [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI) définit une interface standard pour les systèmes d'orchestration de conteneurs (comme Kubernetes) pour exposer des systèmes de stockage arbitraires aux charges de travail de leurs conteneurs.

Pour plus d'informations, lire la [proposition de conception CSI](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md).

Le support CSI a été introduit en alpha à partir de Kubernetes v1.9, a évolué en beta dans Kubernetes v1.10 et est en disponibilité générale (GA) depuis Kubernetes v1.13.

{{< note >}}
Le support des versions spec CSI 0.2 et 0.3 sont obsolètes dans Kubernetes v1.13 et seront retirés dans une version future.
{{< /note >}}

{{< note >}}
Les pilotes CSI peuvent ne pas être compatibles avec toutes les versions de Kubernetes.
Vérifier la documentation des pilotes CSI spécifiques pour les étapes de déploiement supportées pour chaque version de Kubernetes et la matrice de compatibilité.
{{< /note >}}

Une fois qu'un pilote de volume CSI compatible est déployé dans un cluster Kubernetes, les utilisateurs peuvent
utiliser le type de volume `csi` pour attacher, monter, etc.., les volumes exposés par le pilote CSI.

Le type de volume `csi` ne supporte pas de référence directe depuis un Pod et ne peut être référencé seulement dans un Pod que par un objet `PersistentVolumeClaim`.

Les champs suivants sont disponibles aux administrateurs de stockage pour configurer un volume persistant CSI :

- `driver`: Une valeur texte qui spécifie le nom du pilote de volume à utiliser.
  Cette valeur doit correspondre à la valeur retournée dans le `GetPluginInfoResponse` par le pilote CSI tel que défini dans la
  [spec CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo).
  Elle est utilisée par Kubernetes pour identifier le pilote CSI à appeler et par les composants du pilote CSI
  pour identifier quels objets PV appartiennent au pilote CSI.
- `volumeHandle`: Une valeur texte qui identifie le volume de manière unique. Cette valeur doit correspondre à la valeur retournée dans le champ `volume.id` de `CreateVolumeResponse` par le pilote CSI tel que défini dans la [spec CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  La valeur est passée en tant que `volume_id` sur tous les appels au pilote de volume CSI lorsque le volume est référencé.
- `readOnly`: Une valeur booléenne optionnelle indiquant si le volume doit être
  "ControllerPublished" (attaché) en lecture seule. La valeur par défaut est "false". Cette valeur est passées au pilote CSI
  via le champ `readonly` dans le `ControllerPublishVolumeRequest`.
- `fsType`: Si le `VolumeMode` du PV est `Filesystem`, alors ce champ peut être utilisé pour spécifier le système de fichiers
  qui devrait être utilisé pour monter le volume. Si le volume n'a pas été formaté et que le formatage est supporté, cette valeur sera
  utilisée pour formater le volume.
  Cette valeur est passée au pilote CSI driver via le champ `VolumeCapability` de
  `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, et
  `NodePublishVolumeRequest`.
- `volumeAttributes`: Un tableau associatif (map) string vers string qui spécifie les propriétés statiques d'un volume. Ce tableau associatif doit correspondre à celui retourné dans le champ
  `volume.attributes` du `CreateVolumeResponse` par le pilote CSI tel que défini dans
  la [spec CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  Le tableau associatif est passé au pilote CSI via le champ `volume_attributes` dans la `ControllerPublishVolumeRequest`, `NodeStageV  olumeRequest`, et `NodePublishVolumeRequest`.
- `controllerPublishSecretRef`: Une référence de l'objet de type secret contenant des informations sensibles à passer
  au driver CSI pour compléter les appels CSI `ControllerPublishVolume` et `ControllerUnpublishVolume`.
  Ce champ est optionnel et peut être vide si aucun secret n'est requis.
  Si l'objet secret contient plus qu'un secret, tous les secrets sont passés.
- `nodeStageSecretRef`: Une référence à l'objet de type secret contenant des informations sensibles à passer au pilote CSI
  pour compléter l'appel CSI `NodeStageVolume`. Ce champ est optionnel et peut être vide si aucun secret n'est requis.
  Si l'objet secret contient plus qu'un secret, tous les secrets sont passés.
- `nodePublishSecretRef`: Une référence vers l'objet de type secret contenant des informations sensibles à passer au pilote CSI
  pour compléter l'appel CSI `NodePublishVolume`. Ce champ est optionnel et peut être vide si aucun secret n'est requis.
  Si l'objet secret contient plus qu'un secret, tous les secrets sont passés.

#### Support de volume bloc brut CSI

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

À partir de la version 1.11, CSI a introduit le support des volumes bloc bruts, qui s'appuient
sur la fonctionnalité de volume bloc brut introduite dans une version précédente de Kubernetes.
Cette fonctionnalité va permettre aux fournisseurs avec des pilotes CSI externes d'implémenter le support pour les volumes bloc bruts
dans les charges de travail Kubernetes.

Le support volume bloc CSI est une "feature-gate", mais est activée par défaut. Les deux
"feature gates" qui doivent être activées pour cette fonctionnalité sont `BlockVolume` et `CSIBlockVolume`.

Apprenez comment [configurer votre PV/PVC avec le support de volume bloc brut](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support).

#### Volumes CSI éphémères

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

Cette fonctionnalité permet aux volumes CSI d'être embarqués directement dans la spécification du Pod au lieu de celle d'un PersistentVolume. Les Volumes spécifiés de cette manière sont éphémères et ne persistent pas lorsque le Pod redémarre.

Exemple :

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app
spec:
  containers:
    - name: my-frontend
      image: busybox
      volumeMounts:
      - mountPath: "/data"
        name: my-csi-inline-vol
      command: [ "sleep", "1000000" ]
  volumes:
    - name: my-csi-inline-vol
      csi:
        driver: inline.storage.kubernetes.io
        volumeAttributes:
              foo: bar
```

Cette fonctionnalité requiert l'activation de la "feature gate" CSIInlineVolume :

```
--feature-gates=CSIInlineVolume=true
```

Les volumes éphémères CSI sont seulement supportés par un sous-ensemble des pilotes CSI. La liste des pilotes CSI est disponible [ici](https://kubernetes-csi.github.io/docs/drivers.html).

# Ressources pour développeur
Pour plus d'informations sur la manière de développer un pilote CSI, se référer à la [documentation kubernetes-csi](https://kubernetes-csi.github.io/docs/)

#### Migration de pilotes CSI depuis des plugins "in-tree"

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

La fonctionnalité de migration CSI, lorsque activée, dirige les opérations sur les plugins "in-tree" existants vers les plugins CSI correspondants (qui sont sensés être installés et configurés).
Cette fonctionnalité implémente la logique de translation nécessaire et les fixations nécessaires pour rerouter les opérations
de manière transparente. En conséquence, les opérateurs n'ont pas à effectuer de changements de configuration aux classes de stockage (Storage Classes) existantes, PV ou PVC (référençant aux plugins "in-tree") lors de la transition vers un pilote CSI qui remplace un plugin "in-tree".

Dans l'état alpha, les opérations et fonctionnalités qui sont supportées incluent provisionnement/suppression, attachement/détachement, montage/démontage et le redimensionnement des volumes.

Les plugins "in-tree" qui supportent la migration CSI et qui ont un pilote CSI correspondant implémenté sont listés dans la section "Types de volumes" au-dessus.

### FlexVolume {#flexVolume}

FlexVolume est une interface de plugin "out-of-tree" qui existe dans Kubernetes depuis la version 1.2 (avant CSI).
Elle utilise un modèle basé sur exec pour s'interfacer avec les pilotes. Les binaires de pilote FlexVolume doivent être installés dans un chemin de volume de plugin prédéfini sur chaque nœud (et dans certains cas le nœud maître).

Les Pods interagissent avec les pilotes FlexVolume à travers le plugin "in-tree" `flexvolume`
Plus de détails sont disponibles [ici](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md).

## Propagation de montage

La propagation de montage permet à des volumes partagés montés par un conteneur à d'autres conteneurs dans un même Pod, ou même à d'autres Pods dans le même nœud.

La propagation de montage d'un volume est contrôlée par le champ `mountPropagation` dans Container.volumeMounts.
Ses valeurs sont :

 * `None` - Ce montage de volume ne recevra aucun montage subséquent qui est monté à ce volume ou n'importe lequel de ses sous-dossiers par l'hôte. De la même manière, aucun montage créé par le conteneur ne sera visible sur l'hôte. C'est le mode par défaut.

   Ce mode équivaut à une propagation de montage `private` tel que décrit dans la [documentation du noyau Linux](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)

 * `HostToContainer` - Ce montage de volume recevra les montages subséquents qui sont montés sur ce volume ou n'importe lequel de ses sous-dossiers.

   En d'autres termes, si l'hôte monte quoi que ce soit dans le montage de volume, le conteneur va le voir monté à cet endroit.

   De manière similaire, si un Pod avec la propagation de montage `Bidirectional` vers le même volume y monte quoi que ce soit,
   le conteneur avec la propagation de montage `HostToContainer` le verra.

   Ce mode est équivalent à la propagation de montage `rslave` tel que décrit dans la
   [documentation du noyau Linux](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)

 * `Bidirectional` - Ce montage de volume se comporte de la même manière que le montage `HostToContainer`.
   De plus, tous les montages de volume créés par le conteneur seront propagés à l'hôte et à tous les conteneurs des autres Pods qui utilisent le même volume.

   Un cas d'utilisation typique pour ce mode est un Pod avec un FlexVolume ou un pilote CSI, ou un Pod qui nécessite de monter quelque chose sur l'hôte en utilisant un volume `hostPath`.

   Ce mode est équivalent à une propagation de montage `rshared` tel que décrit dans la
   [documentation du noyau Linux](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)

{{< caution >}}
La propagation de montage `Bidirectional` peut être dangereuse. Elle peut endommager le système d'exploitation hôte
et est donc autorisée seulement dans des conteneurs privilégiés.
Il est fortement recommandé d'être familier avec le comportement du noyau Linux.
De plus, tous les montages de volume créés par des conteneurs dans des Pods doivent être détruits (démontés) par les conteneurs lors de la terminaison.
{{< /caution >}}

### Configuration
Avant que la propagation de montage puisse fonctionner correctement sur certains déploiements (CoreOS,
RedHat/Centos, Ubuntu) le partage de montage doit être correctement configuré dans Docker tel qu'illustré ci-dessous :

Modifiez le fichier de service `systemd` de votre Docker. Configurez votre `MountFlags` comme suit :
```shell
MountFlags=shared
```
Ou bien retirez `MountFlags=slave` si présent. Redémarrez ensuite le démon Docker :
```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```



## {{% heading "whatsnext" %}}

* Suivez un exemple de [déploiement de WordPress et MySQL avec des volumes persistants](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).

