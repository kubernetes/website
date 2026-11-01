---
layout: blog
title: "Kubernetes v1.26: Alpha support for cross-namespace storage data sources"
date: 2023-01-02
slug: cross-namespace-data-sources-alpha
author: >
  Takafumi Takahashi (Hitachi Vantara)
---

Kubernetes v1.26, released last month, introduced an alpha feature that
lets you specify a data source for a PersistentVolumeClaim, even where the source
data belong to a different namespace.
With the new feature enabled, you specify a namespace in the `dataSourceRef` field of
a new PersistentVolumeClaim. Once Kubernetes checks that access is OK, the new
PersistentVolume can populate its data from the storage source specified in that other
namespace.
Before Kubernetes v1.26, provided your cluster had the `AnyVolumeDataSource` feature enabled,
you could already provision new volumes from a data source in the **same**
namespace.
However, that only worked for the data source in the same namespace,
therefore users couldn't provision a PersistentVolume with a claim
in one namespace from a data source in other namespace.
To solve this problem, Kubernetes v1.26 added a new alpha `namespace` field
to `dataSourceRef` field in PersistentVolumeClaim the API.

## How it works

Once the csi-provisioner finds that a data source is specified with a `dataSourceRef` that
has a non-empty namespace name,
it checks all reference grants within the namespace that's specified by the`.spec.dataSourceRef.namespace`
field of the PersistentVolumeClaim, in order to see if access to the data source is allowed.
If any ReferenceGrant allows access, the csi-provisioner provisions a volume from the data source.

## Trying it out

The following things are required to use cross namespace volume provisioning:

* Enable the `AnyVolumeDataSource` and `CrossNamespaceVolumeDataSource` [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) for the kube-apiserver and kube-controller-manager
* Install a CRD for the specific `VolumeSnapShot` controller
* Install the CSI Provisioner controller and enable the `CrossNamespaceVolumeDataSource` feature gate
* Install the CSI driver
* Install a CRD for ReferenceGrants

## Putting it all together

To see how this works, you can install the sample and try it out.
This sample do to create PVC in dev namespace from VolumeSnapshot in prod namespace.
That is a simple example. For real world use, you might want to use a more complex approach.

### Assumptions for this example {#example-assumptions}

* Your Kubernetes cluster was deployed with `AnyVolumeDataSource` and `CrossNamespaceVolumeDataSource` feature gates enabled
* There are two namespaces, dev and prod
* CSI driver is being deployed
* There is an existing VolumeSnapshot named `new-snapshot-demo` in the _prod_ namespace
* The ReferenceGrant CRD (from the Gateway API project) is already deployed

### Grant ReferenceGrants read permission to the CSI Provisioner

Access to ReferenceGrants is only needed when the CSI driver
has the `CrossNamespaceVolumeDataSource` controller capability.
For this example, the external-provisioner needs **get**, **list**, and **watch**
permissions for `referencegrants` (API group `gateway.networking.k8s.io`).

```yaml
  - apiGroups: ["gateway.networking.k8s.io"]
    resources: ["referencegrants"]
    verbs: ["get", "list", "watch"]
```

### Enable the CrossNamespaceVolumeDataSource feature gate for the CSI Provisioner

Add `--feature-gates=CrossNamespaceVolumeDataSource=true` to the csi-provisioner command line.
For example, use this manifest snippet to redefine the container:

```yaml
      - args:
        - -v=5
        - --csi-address=/csi/csi.sock
        - --feature-gates=Topology=true
        - --feature-gates=CrossNamespaceVolumeDataSource=true
        image: csi-provisioner:latest
        imagePullPolicy: IfNotPresent
        name: csi-provisioner
```

### Create a ReferenceGrant

Here's a manifest for an example ReferenceGrant.

```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: allow-prod-pvc
  namespace: prod
spec:
  from:
  - group: ""
    kind: PersistentVolumeClaim
    namespace: dev
  to:
  - group: snapshot.storage.k8s.io
    kind: VolumeSnapshot
    name: new-snapshot-demo
```

### Create a PersistentVolumeClaim by using cross namespace data source

Kubernetes creates a PersistentVolumeClaim on dev and the CSI driver populates
the PersistentVolume used on dev from snapshots on prod.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: example-pvc
  namespace: dev
spec:
  storageClassName: example
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  dataSourceRef:
    apiGroup: snapshot.storage.k8s.io
    kind: VolumeSnapshot
    name: new-snapshot-demo
    namespace: prod
  volumeMode: Filesystem
```

## How can I learn more?

The enhancement proposal,
[Provision volumes from cross-namespace snapshots](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3294-provision-volumes-from-cross-namespace-snapshots), includes lots of detail about the history and technical implementation of this feature.

Please get involved by joining the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage)
to help us enhance this feature.
There are a lot of good ideas already and we'd be thrilled to have more!

## Acknowledgments

It takes a wonderful group to make wonderful software.
Special thanks to the following people for the insightful reviews,
thorough consideration and valuable contribution to the CrossNamespaceVolumeDataSouce feature:

* Michelle Au (msau42)
* Xing Yang (xing-yang)
* Masaki Kimura (mkimuram)
* Tim Hockin (thockin)
* Ben Swartzlander (bswartz)
* Rob Scott (robscott)
* John Griffith (j-griffith)
* Michael Henriksen (mhenriks)
* Mustafa Elbehery (Elbehery)

It’s been a joy to work with y'all on this.
