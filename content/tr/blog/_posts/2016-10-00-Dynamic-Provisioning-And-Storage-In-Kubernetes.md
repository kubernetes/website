---
title: " Dynamic Provisioning and Storage Classes in Kubernetes "
date: 2016-10-07
slug: dynamic-provisioning-and-storage-in-kubernetes
url: /blog/2016/10/Dynamic-Provisioning-And-Storage-In-Kubernetes
author: >
  Saad Ali (Google)
---

Storage is a critical part of running containers, and Kubernetes offers some powerful primitives for managing it. Dynamic volume provisioning, a feature unique to Kubernetes, allows storage volumes to be created on-demand. Without dynamic provisioning, cluster administrators have to manually make calls to their cloud or storage provider to create new storage volumes, and then create PersistentVolume objects to represent them in Kubernetes. The dynamic provisioning feature eliminates the need for cluster administrators to pre-provision storage. Instead, it automatically provisions storage when it is requested by users. This feature was introduced as alpha in Kubernetes 1.2, and has been improved and promoted to beta in the [latest release, 1.4](https://kubernetes.io/blog/2016/09/kubernetes-1-4-making-it-easy-to-run-on-kuberentes-anywhere/). This release makes dynamic provisioning far more flexible and useful.

**What’s New?**  

The alpha version of dynamic provisioning only allowed a single, hard-coded provisioner to be used in a cluster at once. This meant that when Kubernetes determined storage needed to be dynamically provisioned, it always used the same volume plugin to do provisioning, even if multiple storage systems were available on the cluster. The provisioner to use was inferred based on the cloud environment - EBS for AWS, Persistent Disk for Google Cloud, Cinder for OpenStack, and vSphere Volumes on vSphere. Furthermore, the parameters used to provision new storage volumes were fixed: only the storage size was configurable. This meant that all dynamically provisioned volumes would be identical, except for their storage size, even if the storage system exposed other parameters (such as disk type) for configuration during provisioning.  

Although the alpha version of the feature was limited in utility, it allowed us to “get some miles” on the idea, and helped determine the direction we wanted to take.  

The beta version of dynamic provisioning, new in Kubernetes 1.4, introduces a [new API object](/docs/user-guide/persistent-volumes/#storageclasses), StorageClass. Multiple StorageClass objects can be defined each specifying a volume plugin (aka provisioner) to use to provision a volume and the set of parameters to pass to that provisioner when provisioning. This design allows cluster administrators to define and expose multiple flavors of storage (from the same or different storage systems) within a cluster, each with a custom set of parameters. This design also ensures that end users don’t have to worry about the complexity and nuances of how storage is provisioned, but still have the ability to select from multiple storage options.  

**How Do I use It?**  

Below is an example of how a cluster administrator would expose two tiers of storage, and how a user would select and use one. For more details, see the [reference](/docs/user-guide/persistent-volumes/#storageclasses) and [example](https://github.com/kubernetes/kubernetes/tree/release-1.4/examples/experimental/persistent-volume-provisioning) docs.  

**Admin Configuration**  

The cluster admin defines and deploys two StorageClass objects to the Kubernetes cluster:  

```
kind: StorageClass

apiVersion: storage.k8s.io/v1beta1

metadata:

  name: slow

provisioner: kubernetes.io/gce-pd

parameters:

  type: pd-standard
 ```


This creates a storage class called “slow” which will provision standard disk-like Persistent Disks.  

```
kind: StorageClass

apiVersion: storage.k8s.io/v1beta1

metadata:

  name: fast

provisioner: kubernetes.io/gce-pd

parameters:

  type: pd-ssd
 ```



This creates a storage class called “fast” which will provision SSD-like Persistent Disks.  



**User Request**



Users request dynamically provisioned storage by including a storage class in their PersistentVolumeClaim. For the beta version of this feature, this is done via the volume.beta.kubernetes.io/storage-class annotation. The value of this annotation must match the name of a StorageClass configured by the administrator.



To select the “fast” storage class, for example, a user would create the following PersistentVolumeClaim:



```
{

  "kind": "PersistentVolumeClaim",

  "apiVersion": "v1",

  "metadata": {

    "name": "claim1",

    "annotations": {

        "volume.beta.kubernetes.io/storage-class": "fast"

    }

  },

  "spec": {

    "accessModes": [

      "ReadWriteOnce"

    ],

    "resources": {

      "requests": {

        "storage": "30Gi"

      }

    }

  }

}
 ```




This claim will result in an SSD-like Persistent Disk being automatically provisioned. When the claim is deleted, the volume will be destroyed.




**Defaulting Behavior**



Dynamic Provisioning can be enabled for a cluster such that all claims are dynamically provisioned without a storage class annotation. This behavior is enabled by the cluster administrator by marking one StorageClass object as “default”. A StorageClass can be marked as default by adding the storageclass.beta.kubernetes.io/is-default-class annotation to it.



When a default StorageClass exists and a user creates a PersistentVolumeClaim without a storage-class annotation, the new [DefaultStorageClass](https://github.com/kubernetes/kubernetes/pull/30900) admission controller (also introduced in v1.4), automatically adds the class annotation pointing to the default storage class.



**Can I Still Use the Alpha Version?**




Kubernetes 1.4 maintains backwards compatibility with the alpha version of the dynamic provisioning feature to allow for a smoother transition to the beta version. The alpha behavior is triggered by the existence of the alpha dynamic provisioning annotation (volume. **alpha**.kubernetes.io/storage-class). Keep in mind that if the beta annotation (volume. **beta**.kubernetes.io/storage-class) is present, it takes precedence, and triggers the beta behavior.



Support for the [alpha version](https://github.com/kubernetes/kubernetes/blob/master/docs/devel/api_changes.md#alpha-beta-and-stable-versions) is deprecated and will be removed in a future release.



**What’s Next?**



Dynamic Provisioning and Storage Classes will continue to evolve and be refined in future releases. Below are some areas under consideration for further development.



**Standard Cloud Provisioners**

For deployment of Kubernetes to cloud providers, we are [considering](https://github.com/kubernetes/kubernetes/pull/31617/files) automatically creating a provisioner for the cloud’s native storage system. This means that a standard deployment on AWS would result in a StorageClass that provisions EBS volumes, a standard deployment on Google Cloud would result in a StorageClass that provisions GCE PDs. It is also being debated whether these provisioners should be marked as default, which would make dynamic provisioning the default behavior (no annotation required).



**Out-of-Tree Provisioners**

There has been ongoing discussion about whether Kubernetes storage plugins should live “in-tree” or “out-of-tree”. While the details for how to implement out-of-tree plugins is still in the air, there is [a proposa](https://github.com/kubernetes/kubernetes/pull/30285)l introducing a standardized way to implement out-of-tree dynamic provisioners.



**How Do I Get Involved?**



If you’re interested in getting involved with the design and development of Kubernetes Storage, join the [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.






- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
