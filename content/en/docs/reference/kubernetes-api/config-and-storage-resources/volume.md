---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "Volume"
content_type: "api_reference"
description: "Volume represents a named volume in a pod that may be accessed by any container in the pod."
title: "Volume"
weight: 10
auto_generated: true
---

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->



`import "k8s.io/api/core/v1"`


## Volume {#Volume}

Volume represents a named volume in a pod that may be accessed by any container in the pod.

<hr>

- **name** (string), required

  name of the volume. Must be a DNS_LABEL and unique within the pod. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names



### Exposed Persistent volumes


- **persistentVolumeClaim** (PersistentVolumeClaimVolumeSource)

  persistentVolumeClaimVolumeSource represents a reference to a PersistentVolumeClaim in the same namespace. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

  <a name="PersistentVolumeClaimVolumeSource"></a>
  *PersistentVolumeClaimVolumeSource references the user's PVC in the same namespace. This volume finds the bound PV and mounts that volume for the pod. A PersistentVolumeClaimVolumeSource is, essentially, a wrapper around another type of volume that is owned by someone else (the system).*

  - **persistentVolumeClaim.claimName** (string), required

    claimName is the name of a PersistentVolumeClaim in the same namespace as the pod using this volume. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

  - **persistentVolumeClaim.readOnly** (boolean)

    readOnly Will force the ReadOnly setting in VolumeMounts. Default false.

### Projections


- **configMap** (ConfigMapVolumeSource)

  configMap represents a configMap that should populate this volume

  <a name="ConfigMapVolumeSource"></a>
  *Adapts a ConfigMap into a volume.
  
  The contents of the target ConfigMap's Data field will be presented in a volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. ConfigMap volumes support ownership management and SELinux relabeling.*

  - **configMap.name** (string)

    Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

  - **configMap.optional** (boolean)

    optional specify whether the ConfigMap or its keys must be defined

  - **configMap.defaultMode** (int32)

    defaultMode is optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

  - **configMap.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

    *Atomic: will be replaced during a merge*
    
    items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.

- **secret** (SecretVolumeSource)

  secret represents a secret that should populate this volume. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret

  <a name="SecretVolumeSource"></a>
  *Adapts a Secret into a volume.
  
  The contents of the target Secret's Data field will be presented in a volume as files using the keys in the Data field as the file names. Secret volumes support ownership management and SELinux relabeling.*

  - **secret.secretName** (string)

    secretName is the name of the secret in the pod's namespace to use. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret

  - **secret.optional** (boolean)

    optional field specify whether the Secret or its keys must be defined

  - **secret.defaultMode** (int32)

    defaultMode is Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

  - **secret.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

    *Atomic: will be replaced during a merge*
    
    items If unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.

- **downwardAPI** (DownwardAPIVolumeSource)

  downwardAPI represents downward API about the pod that should populate this volume

  <a name="DownwardAPIVolumeSource"></a>
  *DownwardAPIVolumeSource represents a volume containing downward API info. Downward API volumes support ownership management and SELinux relabeling.*

  - **downwardAPI.defaultMode** (int32)

    Optional: mode bits to use on created files by default. Must be a Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

  - **downwardAPI.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile</a>)

    *Atomic: will be replaced during a merge*
    
    Items is a list of downward API volume file

- **projected** (ProjectedVolumeSource)

  projected items for all in one resources secrets, configmaps, and downward API

  <a name="ProjectedVolumeSource"></a>
  *Represents a projected volume source*

  - **projected.defaultMode** (int32)

    defaultMode are the mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

  - **projected.sources** ([]VolumeProjection)

    *Atomic: will be replaced during a merge*
    
    sources is the list of volume projections. Each entry in this list handles one source.

    <a name="VolumeProjection"></a>
    *Projection that may be projected along with other supported volume types. Exactly one of these fields must be set.*

    - **projected.sources.clusterTrustBundle** (ClusterTrustBundleProjection)

      ClusterTrustBundle allows a pod to access the `.spec.trustBundle` field of ClusterTrustBundle objects in an auto-updating file.
      
      Alpha, gated by the ClusterTrustBundleProjection feature gate.
      
      ClusterTrustBundle objects can either be selected by name, or by the combination of signer name and a label selector.
      
      Kubelet performs aggressive normalization of the PEM contents written into the pod filesystem.  Esoteric PEM features such as inter-block comments and block headers are stripped.  Certificates are deduplicated. The ordering of certificates within the file is arbitrary, and Kubelet may change the order over time.

      <a name="ClusterTrustBundleProjection"></a>
      *ClusterTrustBundleProjection describes how to select a set of ClusterTrustBundle objects and project their contents into the pod filesystem.*

      - **projected.sources.clusterTrustBundle.path** (string), required

        Relative path from the volume root to write the bundle.

      - **projected.sources.clusterTrustBundle.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        Select all ClusterTrustBundles that match this label selector.  Only has effect if signerName is set.  Mutually-exclusive with name.  If unset, interpreted as "match nothing".  If set but empty, interpreted as "match everything".

      - **projected.sources.clusterTrustBundle.name** (string)

        Select a single ClusterTrustBundle by object name.  Mutually-exclusive with signerName and labelSelector.

      - **projected.sources.clusterTrustBundle.optional** (boolean)

        If true, don't block pod startup if the referenced ClusterTrustBundle(s) aren't available.  If using name, then the named ClusterTrustBundle is allowed not to exist.  If using signerName, then the combination of signerName and labelSelector is allowed to match zero ClusterTrustBundles.

      - **projected.sources.clusterTrustBundle.signerName** (string)

        Select all ClusterTrustBundles that match this signer name. Mutually-exclusive with name.  The contents of all selected ClusterTrustBundles will be unified and deduplicated.

    - **projected.sources.configMap** (ConfigMapProjection)

      configMap information about the configMap data to project

      <a name="ConfigMapProjection"></a>
      *Adapts a ConfigMap into a projected volume.
      
      The contents of the target ConfigMap's Data field will be presented in a projected volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. Note that this is identical to a configmap volume source without the default mode.*

      - **projected.sources.configMap.name** (string)

        Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **projected.sources.configMap.optional** (boolean)

        optional specify whether the ConfigMap or its keys must be defined

      - **projected.sources.configMap.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

        *Atomic: will be replaced during a merge*
        
        items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.

    - **projected.sources.downwardAPI** (DownwardAPIProjection)

      downwardAPI information about the downwardAPI data to project

      <a name="DownwardAPIProjection"></a>
      *Represents downward API info for projecting into a projected volume. Note that this is identical to a downwardAPI volume source without the default mode.*

      - **projected.sources.downwardAPI.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile</a>)

        *Atomic: will be replaced during a merge*
        
        Items is a list of DownwardAPIVolume file

    - **projected.sources.secret** (SecretProjection)

      secret information about the secret data to project

      <a name="SecretProjection"></a>
      *Adapts a secret into a projected volume.
      
      The contents of the target Secret's Data field will be presented in a projected volume as files using the keys in the Data field as the file names. Note that this is identical to a secret volume source without the default mode.*

      - **projected.sources.secret.name** (string)

        Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **projected.sources.secret.optional** (boolean)

        optional field specify whether the Secret or its key must be defined

      - **projected.sources.secret.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

        *Atomic: will be replaced during a merge*
        
        items if unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.

    - **projected.sources.serviceAccountToken** (ServiceAccountTokenProjection)

      serviceAccountToken is information about the serviceAccountToken data to project

      <a name="ServiceAccountTokenProjection"></a>
      *ServiceAccountTokenProjection represents a projected service account token volume. This projection can be used to insert a service account token into the pods runtime filesystem for use against APIs (Kubernetes API Server or otherwise).*

      - **projected.sources.serviceAccountToken.path** (string), required

        path is the path relative to the mount point of the file to project the token into.

      - **projected.sources.serviceAccountToken.audience** (string)

        audience is the intended audience of the token. A recipient of a token must identify itself with an identifier specified in the audience of the token, and otherwise should reject the token. The audience defaults to the identifier of the apiserver.

      - **projected.sources.serviceAccountToken.expirationSeconds** (int64)

        expirationSeconds is the requested duration of validity of the service account token. As the token approaches expiration, the kubelet volume plugin will proactively rotate the service account token. The kubelet will start trying to rotate the token if the token is older than 80 percent of its time to live or if the token is older than 24 hours.Defaults to 1 hour and must be at least 10 minutes.

### Local / Temporary Directory


- **emptyDir** (EmptyDirVolumeSource)

  emptyDir represents a temporary directory that shares a pod's lifetime. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir

  <a name="EmptyDirVolumeSource"></a>
  *Represents an empty directory for a pod. Empty directory volumes support ownership management and SELinux relabeling.*

  - **emptyDir.medium** (string)

    medium represents what type of storage medium should back this directory. The default is "" which means to use the node's default medium. Must be an empty string (default) or Memory. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir

  - **emptyDir.sizeLimit** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    sizeLimit is the total amount of local storage required for this EmptyDir volume. The size limit is also applicable for memory medium. The maximum usage on memory medium EmptyDir would be the minimum value between the SizeLimit specified here and the sum of memory limits of all containers in a pod. The default is nil which means that the limit is undefined. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir

- **hostPath** (HostPathVolumeSource)

  hostPath represents a pre-existing file or directory on the host machine that is directly exposed to the container. This is generally used for system agents or other privileged things that are allowed to see the host machine. Most containers will NOT need this. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath

  <a name="HostPathVolumeSource"></a>
  *Represents a host path mapped into a pod. Host path volumes do not support ownership management or SELinux relabeling.*

  - **hostPath.path** (string), required

    path of the directory on the host. If the path is a symlink, it will follow the link to the real path. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath

  - **hostPath.type** (string)

    type for HostPath Volume Defaults to "" More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath

### Persistent volumes


- **awsElasticBlockStore** (AWSElasticBlockStoreVolumeSource)

  awsElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

  <a name="AWSElasticBlockStoreVolumeSource"></a>
  *Represents a Persistent Disk resource in AWS.
  
  An AWS EBS disk must exist before mounting to a container. The disk must also be in the same AWS zone as the kubelet. An AWS EBS disk can only be mounted as read/write once. AWS EBS volumes support ownership management and SELinux relabeling.*

  - **awsElasticBlockStore.volumeID** (string), required

    volumeID is unique ID of the persistent disk resource in AWS (Amazon EBS volume). More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

  - **awsElasticBlockStore.fsType** (string)

    fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

  - **awsElasticBlockStore.partition** (int32)

    partition is the partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).

  - **awsElasticBlockStore.readOnly** (boolean)

    readOnly value true will force the readOnly setting in VolumeMounts. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

- **azureDisk** (AzureDiskVolumeSource)

  azureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.

  <a name="AzureDiskVolumeSource"></a>
  *AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.*

  - **azureDisk.diskName** (string), required

    diskName is the Name of the data disk in the blob storage

  - **azureDisk.diskURI** (string), required

    diskURI is the URI of data disk in the blob storage

  - **azureDisk.cachingMode** (string)

    cachingMode is the Host Caching mode: None, Read Only, Read Write.

  - **azureDisk.fsType** (string)

    fsType is Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **azureDisk.kind** (string)

    kind expected values are Shared: multiple blob disks per storage account  Dedicated: single blob disk per storage account  Managed: azure managed data disk (only in managed availability set). defaults to shared

  - **azureDisk.readOnly** (boolean)

    readOnly Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

- **azureFile** (AzureFileVolumeSource)

  azureFile represents an Azure File Service mount on the host and bind mount to the pod.

  <a name="AzureFileVolumeSource"></a>
  *AzureFile represents an Azure File Service mount on the host and bind mount to the pod.*

  - **azureFile.secretName** (string), required

    secretName is the  name of secret that contains Azure Storage Account Name and Key

  - **azureFile.shareName** (string), required

    shareName is the azure share Name

  - **azureFile.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

- **cephfs** (CephFSVolumeSource)

  cephFS represents a Ceph FS mount on the host that shares a pod's lifetime

  <a name="CephFSVolumeSource"></a>
  *Represents a Ceph Filesystem mount that lasts the lifetime of a pod Cephfs volumes do not support ownership management or SELinux relabeling.*

  - **cephfs.monitors** ([]string), required

    *Atomic: will be replaced during a merge*
    
    monitors is Required: Monitors is a collection of Ceph monitors More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.path** (string)

    path is Optional: Used as the mounted root, rather than the full Ceph tree, default is /

  - **cephfs.readOnly** (boolean)

    readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.secretFile** (string)

    secretFile is Optional: SecretFile is the path to key ring for User, default is /etc/ceph/user.secret More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is Optional: SecretRef is reference to the authentication secret for User, default is empty. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.user** (string)

    user is optional: User is the rados user name, default is admin More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

- **cinder** (CinderVolumeSource)

  cinder represents a cinder volume attached and mounted on kubelets host machine. More info: https://examples.k8s.io/mysql-cinder-pd/README.md

  <a name="CinderVolumeSource"></a>
  *Represents a cinder volume resource in Openstack. A Cinder volume must exist before mounting to a container. The volume must also be in the same region as the kubelet. Cinder volumes support ownership management and SELinux relabeling.*

  - **cinder.volumeID** (string), required

    volumeID used to identify the volume in cinder. More info: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is optional: points to a secret object containing parameters used to connect to OpenStack.

- **csi** (CSIVolumeSource)

  csi (Container Storage Interface) represents ephemeral storage that is handled by certain external CSI drivers (Beta feature).

  <a name="CSIVolumeSource"></a>
  *Represents a source location of a volume to mount, managed by an external CSI driver*

  - **csi.driver** (string), required

    driver is the name of the CSI driver that handles this volume. Consult with your admin for the correct name as registered in the cluster.

  - **csi.fsType** (string)

    fsType to mount. Ex. "ext4", "xfs", "ntfs". If not provided, the empty value is passed to the associated CSI driver which will determine the default filesystem to apply.

  - **csi.nodePublishSecretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    nodePublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodePublishVolume and NodeUnpublishVolume calls. This field is optional, and  may be empty if no secret is required. If the secret object contains more than one secret, all secret references are passed.

  - **csi.readOnly** (boolean)

    readOnly specifies a read-only configuration for the volume. Defaults to false (read/write).

  - **csi.volumeAttributes** (map[string]string)

    volumeAttributes stores driver-specific properties that are passed to the CSI driver. Consult your driver's documentation for supported values.

- **ephemeral** (EphemeralVolumeSource)

  ephemeral represents a volume that is handled by a cluster storage driver. The volume's lifecycle is tied to the pod that defines it - it will be created before the pod starts, and deleted when the pod is removed.
  
  Use this if: a) the volume is only needed while the pod runs, b) features of normal volumes like restoring from snapshot or capacity
     tracking are needed,
  c) the storage driver is specified through a storage class, and d) the storage driver supports dynamic volume provisioning through
     a PersistentVolumeClaim (see EphemeralVolumeSource for more
     information on the connection between this volume type
     and PersistentVolumeClaim).
  
  Use PersistentVolumeClaim or one of the vendor-specific APIs for volumes that persist for longer than the lifecycle of an individual pod.
  
  Use CSI for light-weight local ephemeral volumes if the CSI driver is meant to be used that way - see the documentation of the driver for more information.
  
  A pod can use both types of ephemeral volumes and persistent volumes at the same time.

  <a name="EphemeralVolumeSource"></a>
  *Represents an ephemeral volume that is handled by a normal storage driver.*

  - **ephemeral.volumeClaimTemplate** (PersistentVolumeClaimTemplate)

    Will be used to create a stand-alone PVC to provision the volume. The pod in which this EphemeralVolumeSource is embedded will be the owner of the PVC, i.e. the PVC will be deleted together with the pod.  The name of the PVC will be `\<pod name>-\<volume name>` where `\<volume name>` is the name from the `PodSpec.Volumes` array entry. Pod validation will reject the pod if the concatenated name is not valid for a PVC (for example, too long).
    
    An existing PVC with that name that is not owned by the pod will *not* be used for the pod to avoid using an unrelated volume by mistake. Starting the pod is then blocked until the unrelated PVC is removed. If such a pre-created PVC is meant to be used by the pod, the PVC has to updated with an owner reference to the pod once the pod exists. Normally this should not be necessary, but it may be useful when manually reconstructing a broken cluster.
    
    This field is read-only and no changes will be made by Kubernetes to the PVC after it has been created.
    
    Required, must not be nil.

    <a name="PersistentVolumeClaimTemplate"></a>
    *PersistentVolumeClaimTemplate is used to produce PersistentVolumeClaim objects as part of an EphemeralVolumeSource.*

    - **ephemeral.volumeClaimTemplate.spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimSpec" >}}">PersistentVolumeClaimSpec</a>), required

      The specification for the PersistentVolumeClaim. The entire content is copied unchanged into the PVC that gets created from this template. The same fields as in a PersistentVolumeClaim are also valid here.

    - **ephemeral.volumeClaimTemplate.metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

      May contain labels and annotations that will be copied into the PVC when creating it. No other fields are allowed and will be rejected during validation.

- **fc** (FCVolumeSource)

  fc represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod.

  <a name="FCVolumeSource"></a>
  *Represents a Fibre Channel volume. Fibre Channel volumes can only be mounted as read/write once. Fibre Channel volumes support ownership management and SELinux relabeling.*

  - **fc.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **fc.lun** (int32)

    lun is Optional: FC target lun number

  - **fc.readOnly** (boolean)

    readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

  - **fc.targetWWNs** ([]string)

    *Atomic: will be replaced during a merge*
    
    targetWWNs is Optional: FC target worldwide names (WWNs)

  - **fc.wwids** ([]string)

    *Atomic: will be replaced during a merge*
    
    wwids Optional: FC volume world wide identifiers (wwids) Either wwids or combination of targetWWNs and lun must be set, but not both simultaneously.

- **flexVolume** (FlexVolumeSource)

  flexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin.

  <a name="FlexVolumeSource"></a>
  *FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin.*

  - **flexVolume.driver** (string), required

    driver is the name of the driver to use for this volume.

  - **flexVolume.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default filesystem depends on FlexVolume script.

  - **flexVolume.options** (map[string]string)

    options is Optional: this field holds extra command options if any.

  - **flexVolume.readOnly** (boolean)

    readOnly is Optional: defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

  - **flexVolume.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is Optional: secretRef is reference to the secret object containing sensitive information to pass to the plugin scripts. This may be empty if no secret object is specified. If the secret object contains more than one secret, all secrets are passed to the plugin scripts.

- **flocker** (FlockerVolumeSource)

  flocker represents a Flocker volume attached to a kubelet's host machine. This depends on the Flocker control service being running

  <a name="FlockerVolumeSource"></a>
  *Represents a Flocker volume mounted by the Flocker agent. One and only one of datasetName and datasetUUID should be set. Flocker volumes do not support ownership management or SELinux relabeling.*

  - **flocker.datasetName** (string)

    datasetName is Name of the dataset stored as metadata -> name on the dataset for Flocker should be considered as deprecated

  - **flocker.datasetUUID** (string)

    datasetUUID is the UUID of the dataset. This is unique identifier of a Flocker dataset

- **gcePersistentDisk** (GCEPersistentDiskVolumeSource)

  gcePersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  <a name="GCEPersistentDiskVolumeSource"></a>
  *Represents a Persistent Disk resource in Google Compute Engine.
  
  A GCE PD must exist before mounting to a container. The disk must also be in the same GCE project and zone as the kubelet. A GCE PD can only be mounted as read/write once or read-only many times. GCE PDs support ownership management and SELinux relabeling.*

  - **gcePersistentDisk.pdName** (string), required

    pdName is unique name of the PD resource in GCE. Used to identify the disk in GCE. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.fsType** (string)

    fsType is filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.partition** (int32)

    partition is the partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty). More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.readOnly** (boolean)

    readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

- **glusterfs** (GlusterfsVolumeSource)

  glusterfs represents a Glusterfs mount on the host that shares a pod's lifetime. More info: https://examples.k8s.io/volumes/glusterfs/README.md

  <a name="GlusterfsVolumeSource"></a>
  *Represents a Glusterfs mount that lasts the lifetime of a pod. Glusterfs volumes do not support ownership management or SELinux relabeling.*

  - **glusterfs.endpoints** (string), required

    endpoints is the endpoint name that details Glusterfs topology. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.path** (string), required

    path is the Glusterfs volume path. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.readOnly** (boolean)

    readOnly here will force the Glusterfs volume to be mounted with read-only permissions. Defaults to false. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

- **iscsi** (ISCSIVolumeSource)

  iscsi represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://examples.k8s.io/volumes/iscsi/README.md

  <a name="ISCSIVolumeSource"></a>
  *Represents an ISCSI disk. ISCSI volumes can only be mounted as read/write once. ISCSI volumes support ownership management and SELinux relabeling.*

  - **iscsi.iqn** (string), required

    iqn is the target iSCSI Qualified Name.

  - **iscsi.lun** (int32), required

    lun represents iSCSI Target Lun number.

  - **iscsi.targetPortal** (string), required

    targetPortal is iSCSI Target Portal. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).

  - **iscsi.chapAuthDiscovery** (boolean)

    chapAuthDiscovery defines whether support iSCSI Discovery CHAP authentication

  - **iscsi.chapAuthSession** (boolean)

    chapAuthSession defines whether support iSCSI Session CHAP authentication

  - **iscsi.fsType** (string)

    fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#iscsi

  - **iscsi.initiatorName** (string)

    initiatorName is the custom iSCSI Initiator Name. If initiatorName is specified with iscsiInterface simultaneously, new iSCSI interface \<target portal>:\<volume name> will be created for the connection.

  - **iscsi.iscsiInterface** (string)

    iscsiInterface is the interface Name that uses an iSCSI transport. Defaults to 'default' (tcp).

  - **iscsi.portals** ([]string)

    *Atomic: will be replaced during a merge*
    
    portals is the iSCSI Target Portal List. The portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).

  - **iscsi.readOnly** (boolean)

    readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false.

  - **iscsi.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is the CHAP Secret for iSCSI target and initiator authentication

- **image** (ImageVolumeSource)

  image represents an OCI object (a container image or artifact) pulled and mounted on the kubelet's host machine. The volume is resolved at pod startup depending on which PullPolicy value is provided:
  
  - Always: the kubelet always attempts to pull the reference. Container creation will fail If the pull fails. - Never: the kubelet never pulls the reference and only uses a local image or artifact. Container creation will fail if the reference isn't present. - IfNotPresent: the kubelet pulls if the reference isn't already present on disk. Container creation will fail if the reference isn't present and the pull fails.
  
  The volume gets re-resolved if the pod gets deleted and recreated, which means that new remote content will become available on pod recreation. A failure to resolve or pull the image during pod startup will block containers from starting and may add significant latency. Failures will be retried using normal volume backoff and will be reported on the pod reason and message. The types of objects that may be mounted by this volume are defined by the container runtime implementation on a host machine and at minimum must include all valid types supported by the container image field. The OCI object gets mounted in a single directory (spec.containers[*].volumeMounts.mountPath) by merging the manifest layers in the same way as for container images. The volume will be mounted read-only (ro) and non-executable files (noexec). Sub path mounts for containers are not supported (spec.containers[*].volumeMounts.subpath). The field spec.securityContext.fsGroupChangePolicy has no effect on this volume type.

  <a name="ImageVolumeSource"></a>
  *ImageVolumeSource represents a image volume resource.*

  - **image.pullPolicy** (string)

    Policy for pulling OCI objects. Possible values are: Always: the kubelet always attempts to pull the reference. Container creation will fail If the pull fails. Never: the kubelet never pulls the reference and only uses a local image or artifact. Container creation will fail if the reference isn't present. IfNotPresent: the kubelet pulls if the reference isn't already present on disk. Container creation will fail if the reference isn't present and the pull fails. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise.

  - **image.reference** (string)

    Required: Image or artifact reference to be used. Behaves in the same way as pod.spec.containers[*].image. Pull secrets will be assembled in the same way as for the container image by looking up node credentials, SA image pull secrets, and pod spec image pull secrets. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.

- **nfs** (NFSVolumeSource)

  nfs represents an NFS mount on the host that shares a pod's lifetime More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs

  <a name="NFSVolumeSource"></a>
  *Represents an NFS mount that lasts the lifetime of a pod. NFS volumes do not support ownership management or SELinux relabeling.*

  - **nfs.path** (string), required

    path that is exported by the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs

  - **nfs.server** (string), required

    server is the hostname or IP address of the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs

  - **nfs.readOnly** (boolean)

    readOnly here will force the NFS export to be mounted with read-only permissions. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs

- **photonPersistentDisk** (PhotonPersistentDiskVolumeSource)

  photonPersistentDisk represents a PhotonController persistent disk attached and mounted on kubelets host machine

  <a name="PhotonPersistentDiskVolumeSource"></a>
  *Represents a Photon Controller persistent disk resource.*

  - **photonPersistentDisk.pdID** (string), required

    pdID is the ID that identifies Photon Controller persistent disk

  - **photonPersistentDisk.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

- **portworxVolume** (PortworxVolumeSource)

  portworxVolume represents a portworx volume attached and mounted on kubelets host machine

  <a name="PortworxVolumeSource"></a>
  *PortworxVolumeSource represents a Portworx volume resource.*

  - **portworxVolume.volumeID** (string), required

    volumeID uniquely identifies a Portworx volume

  - **portworxVolume.fsType** (string)

    fSType represents the filesystem type to mount Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs". Implicitly inferred to be "ext4" if unspecified.

  - **portworxVolume.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

- **quobyte** (QuobyteVolumeSource)

  quobyte represents a Quobyte mount on the host that shares a pod's lifetime

  <a name="QuobyteVolumeSource"></a>
  *Represents a Quobyte mount that lasts the lifetime of a pod. Quobyte volumes do not support ownership management or SELinux relabeling.*

  - **quobyte.registry** (string), required

    registry represents a single or multiple Quobyte Registry services specified as a string as host:port pair (multiple entries are separated with commas) which acts as the central registry for volumes

  - **quobyte.volume** (string), required

    volume is a string that references an already created Quobyte volume by name.

  - **quobyte.group** (string)

    group to map volume access to Default is no group

  - **quobyte.readOnly** (boolean)

    readOnly here will force the Quobyte volume to be mounted with read-only permissions. Defaults to false.

  - **quobyte.tenant** (string)

    tenant owning the given Quobyte volume in the Backend Used with dynamically provisioned Quobyte volumes, value is set by the plugin

  - **quobyte.user** (string)

    user to map volume access to Defaults to serivceaccount user

- **rbd** (RBDVolumeSource)

  rbd represents a Rados Block Device mount on the host that shares a pod's lifetime. More info: https://examples.k8s.io/volumes/rbd/README.md

  <a name="RBDVolumeSource"></a>
  *Represents a Rados Block Device mount that lasts the lifetime of a pod. RBD volumes support ownership management and SELinux relabeling.*

  - **rbd.image** (string), required

    image is the rados image name. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.monitors** ([]string), required

    *Atomic: will be replaced during a merge*
    
    monitors is a collection of Ceph monitors. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.fsType** (string)

    fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#rbd

  - **rbd.keyring** (string)

    keyring is the path to key ring for RBDUser. Default is /etc/ceph/keyring. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.pool** (string)

    pool is the rados pool name. Default is rbd. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.readOnly** (boolean)

    readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is name of the authentication secret for RBDUser. If provided overrides keyring. Default is nil. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.user** (string)

    user is the rados user name. Default is admin. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

- **scaleIO** (ScaleIOVolumeSource)

  scaleIO represents a ScaleIO persistent volume attached and mounted on Kubernetes nodes.

  <a name="ScaleIOVolumeSource"></a>
  *ScaleIOVolumeSource represents a persistent ScaleIO volume*

  - **scaleIO.gateway** (string), required

    gateway is the host address of the ScaleIO API Gateway.

  - **scaleIO.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>), required

    secretRef references to the secret for ScaleIO user and other sensitive information. If this is not provided, Login operation will fail.

  - **scaleIO.system** (string), required

    system is the name of the storage system as configured in ScaleIO.

  - **scaleIO.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Default is "xfs".

  - **scaleIO.protectionDomain** (string)

    protectionDomain is the name of the ScaleIO Protection Domain for the configured storage.

  - **scaleIO.readOnly** (boolean)

    readOnly Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

  - **scaleIO.sslEnabled** (boolean)

    sslEnabled Flag enable/disable SSL communication with Gateway, default false

  - **scaleIO.storageMode** (string)

    storageMode indicates whether the storage for a volume should be ThickProvisioned or ThinProvisioned. Default is ThinProvisioned.

  - **scaleIO.storagePool** (string)

    storagePool is the ScaleIO Storage Pool associated with the protection domain.

  - **scaleIO.volumeName** (string)

    volumeName is the name of a volume already created in the ScaleIO system that is associated with this volume source.

- **storageos** (StorageOSVolumeSource)

  storageOS represents a StorageOS volume attached and mounted on Kubernetes nodes.

  <a name="StorageOSVolumeSource"></a>
  *Represents a StorageOS persistent volume resource.*

  - **storageos.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **storageos.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

  - **storageos.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef specifies the secret to use for obtaining the StorageOS API credentials.  If not specified, default values will be attempted.

  - **storageos.volumeName** (string)

    volumeName is the human-readable name of the StorageOS volume.  Volume names are only unique within a namespace.

  - **storageos.volumeNamespace** (string)

    volumeNamespace specifies the scope of the volume within StorageOS.  If no namespace is specified then the Pod's namespace will be used.  This allows the Kubernetes name scoping to be mirrored within StorageOS for tighter integration. Set VolumeName to any name to override the default behaviour. Set to "default" if you are not using namespaces within StorageOS. Namespaces that do not pre-exist within StorageOS will be created.

- **vsphereVolume** (VsphereVirtualDiskVolumeSource)

  vsphereVolume represents a vSphere volume attached and mounted on kubelets host machine

  <a name="VsphereVirtualDiskVolumeSource"></a>
  *Represents a vSphere volume resource.*

  - **vsphereVolume.volumePath** (string), required

    volumePath is the path that identifies vSphere volume vmdk

  - **vsphereVolume.fsType** (string)

    fsType is filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **vsphereVolume.storagePolicyID** (string)

    storagePolicyID is the storage Policy Based Management (SPBM) profile ID associated with the StoragePolicyName.

  - **vsphereVolume.storagePolicyName** (string)

    storagePolicyName is the storage Policy Based Management (SPBM) profile name.

### Deprecated


- **gitRepo** (GitRepoVolumeSource)

  gitRepo represents a git repository at a particular revision. DEPRECATED: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container.

  <a name="GitRepoVolumeSource"></a>
  *Represents a volume that is populated with the contents of a git repository. Git repo volumes do not support ownership management. Git repo volumes support SELinux relabeling.
  
  DEPRECATED: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container.*

  - **gitRepo.repository** (string), required

    repository is the URL

  - **gitRepo.directory** (string)

    directory is the target directory name. Must not contain or start with '..'.  If '.' is supplied, the volume directory will be the git repository.  Otherwise, if specified, the volume will contain the git repository in the subdirectory with the given name.

  - **gitRepo.revision** (string)

    revision is the commit hash for the specified revision.



## DownwardAPIVolumeFile {#DownwardAPIVolumeFile}

DownwardAPIVolumeFile represents information to create the file containing the pod field

<hr>

- **path** (string), required

  Required: Path is  the relative path name of the file to be created. Must not be absolute or contain the '..' path. Must be utf-8 encoded. The first item of the relative path must not start with '..'

- **fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

  Required: Selects a field of the pod: only annotations, labels, name, namespace and uid are supported.

- **mode** (int32)

  Optional: mode bits used to set permissions on this file, must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

- **resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

  Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, requests.cpu and requests.memory) are currently supported.





## KeyToPath {#KeyToPath}

Maps a string key to a path within a volume.

<hr>

- **key** (string), required

  key is the key to project.

- **path** (string), required

  path is the relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'.

- **mode** (int32)

  mode is Optional: mode bits used to set permissions on this file. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.





