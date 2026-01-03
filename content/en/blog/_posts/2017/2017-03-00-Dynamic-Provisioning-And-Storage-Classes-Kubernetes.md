---
title: " Dynamic Provisioning and Storage Classes in Kubernetes "
date: 2017-03-29
slug: dynamic-provisioning-and-storage-classes-kubernetes
url: /blog/2017/03/Dynamic-Provisioning-And-Storage-Classes-Kubernetes
author: >
  Saad Ali (Google),
  Michelle Au (Google),
  Matthew De Lio (Google)  
---

_Editor’s note: this post is part of a [series of in-depth articles](https://kubernetes.io/blog/2017/03/five-days-of-kubernetes-1-6) on what's new in Kubernetes 1.6_



Storage is a critical part of running stateful containers, and Kubernetes offers powerful primitives for managing it. Dynamic volume provisioning, a feature unique to Kubernetes, allows storage volumes to be created on-demand. Before dynamic provisioning, cluster administrators had to manually make calls to their cloud or storage provider to provision new storage volumes, and then create PersistentVolume objects to represent them in Kubernetes. With dynamic provisioning, these two steps are automated, eliminating the need for cluster administrators to pre-provision storage. Instead, the storage resources can be dynamically provisioned using the provisioner specified by the StorageClass object (see [user-guide](/docs/user-guide/persistent-volumes/index#storageclasses)). StorageClasses are essentially blueprints that abstract away the underlying storage provider, as well as other parameters, like disk-type (e.g.; solid-state vs standard disks).  

StorageClasses use provisioners that are specific to the storage platform or cloud provider to give Kubernetes access to the physical media being used. Several storage provisioners are provided in-tree (see [user-guide](/docs/user-guide/persistent-volumes/index#provisioner)), but additionally out-of-tree provisioners are now supported (see [kubernetes-incubator](https://github.com/kubernetes-incubator/external-storage)).  

In the [Kubernetes 1.6 release](https://kubernetes.io/blog/2017/03/kubernetes-1-6-multi-user-multi-workloads-at-scale), **dynamic provisioning has been promoted to stable** (having entered beta in 1.4). This is a big step forward in completing the Kubernetes storage automation vision, allowing cluster administrators to control how resources are provisioned and giving users the ability to focus more on their application. With all of these benefits, **there are a few important user-facing changes (discussed below) that are important to understand before using Kubernetes 1.6**.

**Storage Classes and How to Use them**  

StorageClasses are the foundation of dynamic provisioning, allowing cluster administrators to define abstractions for the underlying storage platform. Users simply refer to a StorageClass by name in the PersistentVolumeClaim (PVC) using the “storageClassName” parameter.  

In the following example, a PVC refers to a specific storage class named “gold”.  

 ```
apiVersion: v1

kind: PersistentVolumeClaim

metadata:

  name: mypvc

  namespace: testns

spec:

  accessModes:

  - ReadWriteOnce

  resources:

    requests:

      storage: 100Gi

  storageClassName: gold
  ```


In order to promote the usage of dynamic provisioning this feature permits the cluster administrator to specify a **default** StorageClass. When present, the user can create a PVC without having specifying a storageClassName, further reducing the user’s responsibility to be aware of the underlying storage provider. When using default StorageClasses, there are some operational subtleties to be aware of when creating PersistentVolumeClaims (PVCs). This is particularly important if you already have existing PersistentVolumes (PVs) that you want to re-use:  

- PVs that are already “Bound” to PVCs will remain bound with the move to 1.6

  - They will not have a StorageClass associated with them unless the user manually adds it
  - If PVs become “Available” (i.e.; if you delete a PVC and the corresponding PV is recycled), then they are subject to the following
- If storageClassName **is not specified** in the PVC, the **default storage class will be used** for provisioning.

  - Existing, “Available”, PVs that do not have the default storage class label **will not be considered** for binding to the PVC
- If storageClassName **is set to an empty string** **(‘’)** in the PVC, no storage class will be used (i.e.; dynamic provisioning is disabled for this PVC)

  - Existing, “Available”, PVs (that do not have a specified storageClassName) **will be considered** for binding to the PVC
- If storageClassName is set to a specific value, then the matching storage class will be used

  - Existing, “Available”, PVs that have a matching storageClassName **will be considered** for binding to the PVC
  - If no corresponding storage class exists, the PVC will fail.
To reduce the burden of setting up default StorageClasses in a cluster, beginning with 1.6, Kubernetes installs (via the add-on manager) default storage classes for several cloud providers. To use these default StorageClasses, users **do not** need refer to them by name – that is, storageClassName need not be specified in the PVC.  

The following table provides more detail on default storage classes pre-installed by cloud provider as well as the specific parameters used by these defaults.  


| Cloud Provider | Default StorageClass Name | Default Provisioner |
|---|---|---|
| Amazon Web Services | gp2 | aws-ebs |
| Microsoft Azure | standard | azure-disk |
| Google Cloud Platform | standard | gce-pd |
| OpenStack | standard | cinder |
| VMware vSphere | thin | vsphere-volume |


While these pre-installed default storage classes are chosen to be “reasonable” for most storage users, [this guide](/docs/tasks/administer-cluster/change-default-storage-class) provides instructions on how to specify your own default.  



**Dynamically Provisioned Volumes and the Reclaim Policy**



All PVs have a reclaim policy associated with them that dictates what happens to a PV once it becomes released from a claim (see [user-guide](/docs/user-guide/persistent-volumes/#reclaiming)). Since the goal of dynamic provisioning is to completely automate the lifecycle of storage resources, the default reclaim policy for dynamically provisioned volumes is “delete”. This means that when a PersistentVolumeClaim (PVC) is released, the dynamically provisioned volume is de-provisioned (deleted) on the storage provider and the data is likely irretrievable. If this is not the desired behavior, the user must change the reclaim policy on the corresponding PersistentVolume (PV) object after the volume is provisioned.



**How do I change the reclaim policy on a dynamically provisioned volume?**

You can change the reclaim policy by editing the PV object and changing the “persistentVolumeReclaimPolicy” field to the desired value. For more information on various reclaim policies see [user-guide](/docs/user-guide/persistent-volumes/#reclaim-policy).



**FAQs**



**How do I use a default StorageClass?**

If your cluster has a default StorageClass that meets your needs, then all you need to do is create a PersistentVolumeClaim (PVC) and the default provisioner will take care of the rest – there is no need to specify the storageClassName:

 ```
apiVersion: v1

kind: PersistentVolumeClaim

metadata:

  name: mypvc

  namespace: testns

spec:

  accessModes:

  - ReadWriteOnce

  resources:

    requests:

      storage: 100Gi
  ```



**Can I add my own storage classes?**  
Yes. To add your own storage class, first determine which provisioners will work in your cluster. Then, create a StorageClass object with parameters customized to meet your needs (see user-guide for more detail). For many users, the easiest way to create the object is to write a yaml file and apply it with “kubectl create -f”. The following is an example of a StorageClass for Google Cloud Platform named “gold” that creates a “pd-ssd”. Since multiple classes can exist within a cluster, the administrator may leave the default enabled for most workloads (since it uses a “pd-standard”), with the “gold” class reserved for workloads that need extra performance.  


 ```
kind: StorageClass

apiVersion: storage.k8s.io/v1

metadata:

  name: gold

provisioner: kubernetes.io/gce-pd

parameters:

  type: pd-ssd
  ```



**How do I check if I have a default StorageClass Installed?**

You can use kubectl to check for StorageClass objects. In the example below there are two storage classes: “gold” and “standard”. The “gold” class is user-defined, and the “standard” class is installed by Kubernetes and is the default.



 ```
$ kubectl get sc

NAME                 TYPE

gold                 kubernetes.io/gce-pd   

standard (default)   kubernetes.io/gce-pd
  ```





 ```
$ kubectl describe storageclass standard

Name:     standard

IsDefaultClass: Yes

Annotations: storageclass.beta.kubernetes.io/is-default-class=true

Provisioner: kubernetes.io/gce-pd

Parameters: type=pd-standard

Events:         \<none\>
  ```



**Can I delete/turn off the default StorageClasses?**  
You cannot delete the default storage class objects provided. Since they are installed as cluster addons, they will be recreated if they are deleted.  

You can, however, disable the defaulting behavior by removing (or setting to false) the following annotation: storageclass.beta.kubernetes.io/is-default-class.  

If there are no StorageClass objects marked with the default annotation, then PersistentVolumeClaim objects (without a StorageClass specified) will not trigger dynamic provisioning. They will, instead, fall back to the legacy behavior of binding to an available PersistentVolume object.  

**Can I assign my existing PVs to a particular StorageClass?**  
Yes, you can assign a StorageClass to an existing PV by editing the appropriate PV object and adding (or setting) the desired storageClassName field to it.  

**What happens if I delete a PersistentVolumeClaim (PVC)?**  
If the volume was dynamically provisioned, then the default reclaim policy is set to “delete”. This means that, by default, when the PVC is deleted, the underlying PV and storage asset will also be deleted. If you want to retain the data stored on the volume, then you must change the reclaim policy from “delete” to “retain” after the PV is provisioned.  


- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Join the community portal for advocates on [K8sPort](http://k8sport.org/)
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Connect with the community on [Slack](http://slack.k8s.io/)
- [Download](http://get.k8s.io/) Kubernetes
