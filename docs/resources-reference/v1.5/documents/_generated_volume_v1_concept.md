

-----------
# Volume v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Volume







Volume represents a named volume in a pod that may be accessed by any container in the pod.

<aside class="notice">
Appears In <a href="#podspec-v1">PodSpec</a> </aside>

Field        | Description
------------ | -----------
awsElasticBlockStore <br /> *[AWSElasticBlockStoreVolumeSource](#awselasticblockstorevolumesource-v1)*  | AWSElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: http://kubernetes.io/docs/user-guide/volumes#awselasticblockstore
azureDisk <br /> *[AzureDiskVolumeSource](#azurediskvolumesource-v1)*  | AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.
azureFile <br /> *[AzureFileVolumeSource](#azurefilevolumesource-v1)*  | AzureFile represents an Azure File Service mount on the host and bind mount to the pod.
cephfs <br /> *[CephFSVolumeSource](#cephfsvolumesource-v1)*  | CephFS represents a Ceph FS mount on the host that shares a pod's lifetime
cinder <br /> *[CinderVolumeSource](#cindervolumesource-v1)*  | Cinder represents a cinder volume attached and mounted on kubelets host machine More info: http://releases.k8s.io/HEAD/examples/mysql-cinder-pd/README.md
configMap <br /> *[ConfigMapVolumeSource](#configmapvolumesource-v1)*  | ConfigMap represents a configMap that should populate this volume
downwardAPI <br /> *[DownwardAPIVolumeSource](#downwardapivolumesource-v1)*  | DownwardAPI represents downward API about the pod that should populate this volume
emptyDir <br /> *[EmptyDirVolumeSource](#emptydirvolumesource-v1)*  | EmptyDir represents a temporary directory that shares a pod's lifetime. More info: http://kubernetes.io/docs/user-guide/volumes#emptydir
fc <br /> *[FCVolumeSource](#fcvolumesource-v1)*  | FC represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod.
flexVolume <br /> *[FlexVolumeSource](#flexvolumesource-v1)*  | FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin. This is an alpha feature and may change in future.
flocker <br /> *[FlockerVolumeSource](#flockervolumesource-v1)*  | Flocker represents a Flocker volume attached to a kubelet's host machine. This depends on the Flocker control service being running
gcePersistentDisk <br /> *[GCEPersistentDiskVolumeSource](#gcepersistentdiskvolumesource-v1)*  | GCEPersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: http://kubernetes.io/docs/user-guide/volumes#gcepersistentdisk
gitRepo <br /> *[GitRepoVolumeSource](#gitrepovolumesource-v1)*  | GitRepo represents a git repository at a particular revision.
glusterfs <br /> *[GlusterfsVolumeSource](#glusterfsvolumesource-v1)*  | Glusterfs represents a Glusterfs mount on the host that shares a pod's lifetime. More info: http://releases.k8s.io/HEAD/examples/volumes/glusterfs/README.md
hostPath <br /> *[HostPathVolumeSource](#hostpathvolumesource-v1)*  | HostPath represents a pre-existing file or directory on the host machine that is directly exposed to the container. This is generally used for system agents or other privileged things that are allowed to see the host machine. Most containers will NOT need this. More info: http://kubernetes.io/docs/user-guide/volumes#hostpath
iscsi <br /> *[ISCSIVolumeSource](#iscsivolumesource-v1)*  | ISCSI represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: http://releases.k8s.io/HEAD/examples/volumes/iscsi/README.md
name <br /> *string*  | Volume's name. Must be a DNS_LABEL and unique within the pod. More info: http://kubernetes.io/docs/user-guide/identifiers#names
nfs <br /> *[NFSVolumeSource](#nfsvolumesource-v1)*  | NFS represents an NFS mount on the host that shares a pod's lifetime More info: http://kubernetes.io/docs/user-guide/volumes#nfs
persistentVolumeClaim <br /> *[PersistentVolumeClaimVolumeSource](#persistentvolumeclaimvolumesource-v1)*  | PersistentVolumeClaimVolumeSource represents a reference to a PersistentVolumeClaim in the same namespace. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistentvolumeclaims
photonPersistentDisk <br /> *[PhotonPersistentDiskVolumeSource](#photonpersistentdiskvolumesource-v1)*  | PhotonPersistentDisk represents a PhotonController persistent disk attached and mounted on kubelets host machine
quobyte <br /> *[QuobyteVolumeSource](#quobytevolumesource-v1)*  | Quobyte represents a Quobyte mount on the host that shares a pod's lifetime
rbd <br /> *[RBDVolumeSource](#rbdvolumesource-v1)*  | RBD represents a Rados Block Device mount on the host that shares a pod's lifetime. More info: http://releases.k8s.io/HEAD/examples/volumes/rbd/README.md
secret <br /> *[SecretVolumeSource](#secretvolumesource-v1)*  | Secret represents a secret that should populate this volume. More info: http://kubernetes.io/docs/user-guide/volumes#secrets
vsphereVolume <br /> *[VsphereVirtualDiskVolumeSource](#vspherevirtualdiskvolumesource-v1)*  | VsphereVolume represents a vSphere volume attached and mounted on kubelets host machine






