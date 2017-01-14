

-----------
# PersistentVolumeSpec v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PersistentVolumeSpec







PersistentVolumeSpec is the specification of a persistent volume.

<aside class="notice">
Appears In <a href="#persistentvolume-v1">PersistentVolume</a> </aside>

Field        | Description
------------ | -----------
accessModes <br /> *string array*  | AccessModes contains all ways the volume can be mounted. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#access-modes
awsElasticBlockStore <br /> *[AWSElasticBlockStoreVolumeSource](#awselasticblockstorevolumesource-v1)*  | AWSElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: http://kubernetes.io/docs/user-guide/volumes#awselasticblockstore
azureDisk <br /> *[AzureDiskVolumeSource](#azurediskvolumesource-v1)*  | AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.
azureFile <br /> *[AzureFileVolumeSource](#azurefilevolumesource-v1)*  | AzureFile represents an Azure File Service mount on the host and bind mount to the pod.
capacity <br /> *object*  | A description of the persistent volume's resources and capacity. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#capacity
cephfs <br /> *[CephFSVolumeSource](#cephfsvolumesource-v1)*  | CephFS represents a Ceph FS mount on the host that shares a pod's lifetime
cinder <br /> *[CinderVolumeSource](#cindervolumesource-v1)*  | Cinder represents a cinder volume attached and mounted on kubelets host machine More info: http://releases.k8s.io/HEAD/examples/mysql-cinder-pd/README.md
claimRef <br /> *[ObjectReference](#objectreference-v1)*  | ClaimRef is part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim. Expected to be non-nil when bound. claim.VolumeName is the authoritative bind between PV and PVC. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#binding
fc <br /> *[FCVolumeSource](#fcvolumesource-v1)*  | FC represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod.
flexVolume <br /> *[FlexVolumeSource](#flexvolumesource-v1)*  | FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin. This is an alpha feature and may change in future.
flocker <br /> *[FlockerVolumeSource](#flockervolumesource-v1)*  | Flocker represents a Flocker volume attached to a kubelet's host machine and exposed to the pod for its usage. This depends on the Flocker control service being running
gcePersistentDisk <br /> *[GCEPersistentDiskVolumeSource](#gcepersistentdiskvolumesource-v1)*  | GCEPersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Provisioned by an admin. More info: http://kubernetes.io/docs/user-guide/volumes#gcepersistentdisk
glusterfs <br /> *[GlusterfsVolumeSource](#glusterfsvolumesource-v1)*  | Glusterfs represents a Glusterfs volume that is attached to a host and exposed to the pod. Provisioned by an admin. More info: http://releases.k8s.io/HEAD/examples/volumes/glusterfs/README.md
hostPath <br /> *[HostPathVolumeSource](#hostpathvolumesource-v1)*  | HostPath represents a directory on the host. Provisioned by a developer or tester. This is useful for single-node development and testing only! On-host storage is not supported in any way and WILL NOT WORK in a multi-node cluster. More info: http://kubernetes.io/docs/user-guide/volumes#hostpath
iscsi <br /> *[ISCSIVolumeSource](#iscsivolumesource-v1)*  | ISCSI represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Provisioned by an admin.
nfs <br /> *[NFSVolumeSource](#nfsvolumesource-v1)*  | NFS represents an NFS mount on the host. Provisioned by an admin. More info: http://kubernetes.io/docs/user-guide/volumes#nfs
persistentVolumeReclaimPolicy <br /> *string*  | What happens to a persistent volume when released from its claim. Valid options are Retain (default) and Recycle. Recycling must be supported by the volume plugin underlying this persistent volume. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#recycling-policy
photonPersistentDisk <br /> *[PhotonPersistentDiskVolumeSource](#photonpersistentdiskvolumesource-v1)*  | PhotonPersistentDisk represents a PhotonController persistent disk attached and mounted on kubelets host machine
quobyte <br /> *[QuobyteVolumeSource](#quobytevolumesource-v1)*  | Quobyte represents a Quobyte mount on the host that shares a pod's lifetime
rbd <br /> *[RBDVolumeSource](#rbdvolumesource-v1)*  | RBD represents a Rados Block Device mount on the host that shares a pod's lifetime. More info: http://releases.k8s.io/HEAD/examples/volumes/rbd/README.md
vsphereVolume <br /> *[VsphereVirtualDiskVolumeSource](#vspherevirtualdiskvolumesource-v1)*  | VsphereVolume represents a vSphere volume attached and mounted on kubelets host machine






