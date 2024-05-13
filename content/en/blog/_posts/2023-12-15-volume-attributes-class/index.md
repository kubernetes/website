---
layout: blog
title: "Kubernetes 1.29: VolumeAttributesClass for Volume Modification"
date: 2023-12-15
slug: kubernetes-1-29-volume-attributes-class
author: >
  Sunny Song (Google)
---

The v1.29 release of Kubernetes introduced an alpha feature to support modifying a volume
by changing the `volumeAttributesClassName` that was specified for a PersistentVolumeClaim (PVC).
With the feature enabled, Kubernetes can handle updates of volume attributes other than capacity.
Allowing volume attributes to be changed without managing it through different
provider's APIs directly simplifies the current flow.

You can read about VolumeAttributesClass usage details in the Kubernetes documentation 
or you can read on to learn about why the Kubernetes project is supporting this feature.


## VolumeAttributesClass

The new `storage.k8s.io/v1alpha1` API group provides two new types:

**VolumeAttributesClass**

Represents a specification of mutable volume attributes defined by the CSI driver.
The class can be specified during dynamic provisioning of PersistentVolumeClaims,
and changed in the PersistentVolumeClaim spec after provisioning.

**ModifyVolumeStatus**

Represents the status object of `ControllerModifyVolume` operation.

With this alpha feature enabled, the spec of PersistentVolumeClaim defines VolumeAttributesClassName
that is used in the PVC. At volume provisioning, the `CreateVolume` operation will apply the parameters in the
VolumeAttributesClass along with the parameters in the StorageClass.

When there is a change of volumeAttributesClassName in the PVC spec,
the external-resizer sidecar will get an informer event. Based on the current state of the configuration,
the resizer will trigger a CSI ControllerModifyVolume.
More details can be found in [KEP-3751](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md).

## How to use it

If you want to test the feature whilst it's alpha, you need to enable the relevant feature gate
in the `kube-controller-manager` and the `kube-apiserver`. Use the `--feature-gates` command line argument:


```
--feature-gates="...,VolumeAttributesClass=true"
```


It also requires that the CSI driver has implemented the ModifyVolume API.


### User flow

If you would like to see the feature in action and verify it works fine in your cluster, here's what you can try:


1. Define a StorageClass and VolumeAttributesClass

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: csi-sc-example
   provisioner: pd.csi.storage.gke.io
   parameters:
     disk-type: "hyperdisk-balanced"
   volumeBindingMode: WaitForFirstConsumer
   ```


   ```yaml
   apiVersion: storage.k8s.io/v1alpha1
   kind: VolumeAttributesClass
   metadata:
     name: silver
   driverName: pd.csi.storage.gke.io
   parameters:
     provisioned-iops: "3000"
     provisioned-throughput: "50"
   ```


2. Define and create the PersistentVolumeClaim

   ```yaml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: test-pv-claim
   spec:
     storageClassName: csi-sc-example
     volumeAttributesClassName: silver
     accessModes:
       - ReadWriteOnce
     resources:
       requests:
         storage: 64Gi
   ```


3. Verify that the PersistentVolumeClaim is now provisioned correctly with:

   ```
   kubectl get pvc
   ```


4. Create a new VolumeAttributesClass gold:

   ```yaml
   apiVersion: storage.k8s.io/v1alpha1
   kind: VolumeAttributesClass
   metadata:
     name: gold
   driverName: pd.csi.storage.gke.io
   parameters:
     iops: "4000"
     throughput: "60"
   ```


5. Update the PVC with the new VolumeAttributesClass and apply:

   ```yaml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: test-pv-claim
   spec:
     storageClassName: csi-sc-example
     volumeAttributesClassName: gold
     accessModes:
       - ReadWriteOnce
     resources:
       requests:
         storage: 64Gi
   ```


6. Verify that PersistentVolumeClaims has the updated VolumeAttributesClass parameters with:

   ```
   kubectl describe pvc <PVC_NAME>
   ```

## Next steps

* See the [VolumeAttributesClass KEP](https://kep.k8s.io/3751) for more information on the design
* You can view or comment on the [project board](https://github.com/orgs/kubernetes-csi/projects/72) for VolumeAttributesClass
* In order to move this feature towards beta, we need feedback from the community,
  so here's a call to action: add support to the CSI drivers, try out this feature,
  consider how it can help with problems that your users are having…


## Getting involved

We always welcome new contributors. So, if you would like to get involved, you can join our [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).

If you would like to share feedback, you can do so on our [public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).

Special thanks to all the contributors that provided great reviews, shared valuable insight and helped implement this feature (alphabetical order):

*   Baofa Fan (calory)
*   Ben Swartzlander (bswartz)
*   Connor Catlett (ConnorJC3)
*   Hemant Kumar (gnufied)
*   Jan Šafránek (jsafrane)
*   Joe Betz (jpbetz)
*   Jordan Liggitt (liggitt)
*   Matthew Cary (mattcary)
*   Michelle Au (msau42)
*   Xing Yang (xing-yang)