---
layout: blog
title: 'Ephemeral volumes with storage capacity tracking: EmptyDir on steroids'
date: 2020-09-01
slug: ephemeral-volumes-with-storage-capacity-tracking
author: >
  Patrick Ohly (Intel)
---

Some applications need additional storage but don't care whether that
data is stored persistently across restarts. For example, caching
services are often limited by memory size and can move infrequently
used data into storage that is slower than memory with little impact
on overall performance. Other applications expect some read-only input
data to be present in files, like configuration data or secret keys.

Kubernetes already supports several kinds of such [ephemeral
volumes](/docs/concepts/storage/ephemeral-volumes), but the
functionality of those is limited to what is implemented inside
Kubernetes.

[CSI ephemeral volumes](https://kubernetes.io/blog/2020/01/21/csi-ephemeral-inline-volumes/)
made it possible to extend Kubernetes with CSI
drivers that provide light-weight, local volumes. These [*inject
arbitrary states, such as configuration, secrets, identity, variables
or similar
information*](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/20190122-csi-inline-volumes.md#motivation).
CSI drivers must be modified to support this Kubernetes feature,
i.e. normal, standard-compliant CSI drivers will not work, and
by design such volumes are supposed to be usable on whatever node
is chosen for a pod.

This is problematic for volumes which consume significant resources on
a node or for special storage that is only available on some nodes.
Therefore, Kubernetes 1.19 introduces two new alpha features for
volumes that are conceptually more like the `EmptyDir` volumes:
- [*generic* ephemeral volumes](/docs/concepts/storage/ephemeral-volumes#generic-ephemeral-volumes) and
- [CSI storage capacity tracking](/docs/concepts/storage/storage-capacity).

The advantages of the new approach are:
- Storage can be local or network-attached.
- Volumes can have a fixed size that applications are never able to exceed.
- Works with any CSI driver that supports provisioning of persistent
  volumes and (for capacity tracking) implements the CSI `GetCapacity` call.
- Volumes may have some initial data, depending on the driver and
  parameters.
- All of the typical volume operations (snapshotting,
  resizing, the future storage capacity tracking, etc.)
  are supported.
- The volumes are usable with any app controller that accepts
  a Pod or volume specification.
- The Kubernetes scheduler itself picks suitable nodes, i.e. there is
  no need anymore to implement and configure scheduler extenders and
  mutating webhooks.

This makes generic ephemeral volumes a suitable solution for several
use cases:

# Use cases

## Persistent Memory as DRAM replacement for memcached

Recent releases of memcached added [support for using Persistent
Memory](https://memcached.org/blog/persistent-memory/) (PMEM) instead
of standard DRAM. When deploying memcached through one of the app
controllers, generic ephemeral volumes make it possible to request a PMEM volume
of a certain size from a CSI driver like
[PMEM-CSI](https://intel.github.io/pmem-csi/).

## Local LVM storage as scratch space

Applications working with data sets that exceed the RAM size can
request local storage with performance characteristics or size that is
not met by the normal Kubernetes `EmptyDir` volumes. For example,
[TopoLVM](https://github.com/cybozu-go/topolvm) was written for that
purpose.

## Read-only access to volumes with data

Provisioning a volume might result in a non-empty volume:
- [restore a snapshot](/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support)
- [cloning a volume](/docs/concepts/storage/volume-pvc-datasource)
- [generic data populators](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/20200120-generic-data-populators.md)

Such volumes can be mounted read-only.

# How it works

## Generic ephemeral volumes

The key idea behind generic ephemeral volumes is that a new volume
source, the so-called
[`EphemeralVolumeSource`](/docs/reference/generated/kubernetes-api/#ephemeralvolumesource-v1alpha1-core)
contains all fields that are needed to created a volume claim
(historically called persistent volume claim, PVC). A new controller
in the `kube-controller-manager` waits for Pods which embed such a
volume source and then creates a PVC for that pod. To a CSI driver
deployment, that PVC looks like any other, so no special support is
needed.

As long as these PVCs exist, they can be used like any other volume claim. In
particular, they can be referenced as data source in volume cloning or
snapshotting. The PVC object also holds the current status of the
volume.

Naming of the automatically created PVCs is deterministic: the name is
a combination of Pod name and volume name, with a hyphen (`-`) in the
middle. This deterministic naming makes it easier to
interact with the PVC because one does not have to search for it once
the Pod name and volume name are known. The downside is that the name might
be in use already. This is detected by Kubernetes and then blocks Pod
startup.

To ensure that the volume gets deleted together with the pod, the
controller makes the Pod the owner of the volume claim. When the Pod
gets deleted, the normal garbage-collection mechanism also removes the
claim and thus the volume.

Claims select the storage driver through the normal storage class
mechanism. Although storage classes with both immediate and late
binding (aka `WaitForFirstConsumer`) are supported, for ephemeral
volumes it makes more sense to use `WaitForFirstConsumer`: then Pod
scheduling can take into account both node utilization and
availability of storage when choosing a node. This is where the other
new feature comes in.

## Storage capacity tracking

Normally, the Kubernetes scheduler has no information about where a
CSI driver might be able to create a volume. It also has no way of
talking directly to a CSI driver to retrieve that information. It
therefore tries different nodes until it finds one where all volumes
can be made available (late binding) or leaves it entirely to the
driver to choose a location (immediate binding).

The new [`CSIStorageCapacity` alpha
API](/docs/reference/generated/kubernetes-api/v1.19/#csistoragecapacity-v1alpha1-storage-k8s-io)
allows storing the necessary information in etcd where it is available to the
scheduler. In contrast to support for generic ephemeral volumes,
storage capacity tracking must be [enabled when deploying a CSI
driver](https://github.com/kubernetes-csi/external-provisioner/blob/master/README.md#capacity-support):
the `external-provisioner` must be told to publish capacity
information that it then retrieves from the CSI driver through the normal
`GetCapacity` call.
<!-- TODO: update the link with a revision once https://github.com/kubernetes-csi/external-provisioner/pull/450 is merged -->

When the Kubernetes scheduler needs to choose a node for a Pod with an
unbound volume that uses late binding and the CSI driver deployment
has opted into the feature by setting the [`CSIDriver.storageCapacity`
flag](/docs/reference/generated/kubernetes-api/v1.19/#csidriver-v1beta1-storage-k8s-io)
flag, the scheduler automatically filters out nodes that do not have
access to enough storage capacity. This works for generic ephemeral
and persistent volumes but *not* for CSI ephemeral volumes because the
parameters of those are opaque for Kubernetes.

As usual, volumes with immediate binding get created before scheduling
pods, with their location chosen by the storage driver. Therefore, the
external-provisioner's default configuration skips storage
classes with immediate binding as the information wouldn't be used anyway.

Because the Kubernetes scheduler must act on potentially outdated
information, it cannot be ensured that the capacity is still available
when a volume is to be created. Still, the chances that it can be created
without retries should be higher.

# Security

## CSIStorageCapacity

CSIStorageCapacity objects are namespaced. When deploying each CSI
drivers in its own namespace and, as recommended, limiting the RBAC
permissions for CSIStorageCapacity to that namespace, it is
always obvious where the data came from. However, Kubernetes does
not check that and typically drivers get installed in the same
namespace anyway, so ultimately drivers are *expected to behave* and
not publish incorrect data.

## Generic ephemeral volumes

If users have permission to create a Pod (directly or indirectly),
then they can also create generic ephemeral volumes even when they do
not have permission to create a volume claim. That's because RBAC
permission checks are applied to the controller which creates the
PVC, not the original user. This is a fundamental change that must be
[taken into
account](/docs/concepts/storage/ephemeral-volumes#security) before
enabling the feature in clusters where untrusted users are not
supposed to have permission to create volumes.

# Example

A [special branch](https://github.com/intel/pmem-csi/commits/kubernetes-1-19-blog-post)
in PMEM-CSI contains all the necessary changes to bring up a
Kubernetes 1.19 cluster inside QEMU VMs with both alpha features
enabled. The PMEM-CSI driver code is used unchanged, only the
deployment was updated.

On a suitable machine (Linux, non-root user can use Docker - see the
[QEMU and
Kubernetes](https://intel.github.io/pmem-csi/0.7/docs/autotest.html#qemu-and-kubernetes)
section in the PMEM-CSI documentation), the following commands bring
up a cluster and install the PMEM-CSI driver:

```console
git clone --branch=kubernetes-1-19-blog-post https://github.com/intel/pmem-csi.git
cd pmem-csi
export TEST_KUBERNETES_VERSION=1.19 TEST_FEATURE_GATES=CSIStorageCapacity=true,GenericEphemeralVolume=true TEST_PMEM_REGISTRY=intel
make start && echo && test/setup-deployment.sh
```

If all goes well, the output contains the following usage
instructions:

```
The test cluster is ready. Log in with [...]/pmem-csi/_work/pmem-govm/ssh.0, run
kubectl once logged in.  Alternatively, use kubectl directly with the
following env variable:
   KUBECONFIG=[...]/pmem-csi/_work/pmem-govm/kube.config

secret/pmem-csi-registry-secrets created
secret/pmem-csi-node-secrets created
serviceaccount/pmem-csi-controller created
...
To try out the pmem-csi driver ephemeral volumes:
   cat deploy/kubernetes-1.19/pmem-app-ephemeral.yaml |
   [...]/pmem-csi/_work/pmem-govm/ssh.0 kubectl create -f -
```

The CSIStorageCapacity objects are not meant to be human-readable, so
some post-processing is needed. The following Golang template filters
all objects by the storage class that the example uses and prints the
name, topology and capacity:

```console
kubectl get \
        -o go-template='{{range .items}}{{if eq .storageClassName "pmem-csi-sc-late-binding"}}{{.metadata.name}} {{.nodeTopology.matchLabels}} {{.capacity}}
{{end}}{{end}}' \
        csistoragecapacities
```

```
csisc-2js6n map[pmem-csi.intel.com/node:pmem-csi-pmem-govm-worker2] 30716Mi
csisc-sqdnt map[pmem-csi.intel.com/node:pmem-csi-pmem-govm-worker1] 30716Mi
csisc-ws4bv map[pmem-csi.intel.com/node:pmem-csi-pmem-govm-worker3] 30716Mi
```

One individual object has the following content:

```console
kubectl describe csistoragecapacities/csisc-6cw8j
```

```
Name:         csisc-sqdnt
Namespace:    default
Labels:       <none>
Annotations:  <none>
API Version:  storage.k8s.io/v1alpha1
Capacity:     30716Mi
Kind:         CSIStorageCapacity
Metadata:
  Creation Timestamp:  2020-08-11T15:41:03Z
  Generate Name:       csisc-
  Managed Fields:
    ...
  Owner References:
    API Version:     apps/v1
    Controller:      true
    Kind:            StatefulSet
    Name:            pmem-csi-controller
    UID:             590237f9-1eb4-4208-b37b-5f7eab4597d1
  Resource Version:  2994
  Self Link:         /apis/storage.k8s.io/v1alpha1/namespaces/default/csistoragecapacities/csisc-sqdnt
  UID:               da36215b-3b9d-404a-a4c7-3f1c3502ab13
Node Topology:
  Match Labels:
    pmem-csi.intel.com/node:  pmem-csi-pmem-govm-worker1
Storage Class Name:           pmem-csi-sc-late-binding
Events:                       <none>
```

Now let's create the example app with one generic ephemeral
volume. The `pmem-app-ephemeral.yaml` file contains:

```yaml
# This example Pod definition demonstrates
# how to use generic ephemeral inline volumes
# with a PMEM-CSI storage class.
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app-inline-volume
spec:
  containers:
    - name: my-frontend
      image: intel/pmem-csi-driver-test:v0.7.14
      command: [ "sleep", "100000" ]
      volumeMounts:
      - mountPath: "/data"
        name: my-csi-volume
  volumes:
  - name: my-csi-volume
    ephemeral:
      volumeClaimTemplate:
        spec:
          accessModes:
          - ReadWriteOnce
          resources:
            requests:
              storage: 4Gi
          storageClassName: pmem-csi-sc-late-binding
```

After creating that as shown in the usage instructions above, we have one additional Pod and PVC:

```console
kubectl get pods/my-csi-app-inline-volume -o wide
```

```
NAME                       READY   STATUS    RESTARTS   AGE     IP          NODE                         NOMINATED NODE   READINESS GATES
my-csi-app-inline-volume   1/1     Running   0          6m58s   10.36.0.2   pmem-csi-pmem-govm-worker1   <none>           <none>
```

```console
kubectl get pvc/my-csi-app-inline-volume-my-csi-volume
```

```
NAME                                     STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS               AGE
my-csi-app-inline-volume-my-csi-volume   Bound    pvc-c11eb7ab-a4fa-46fe-b515-b366be908823   4Gi        RWO            pmem-csi-sc-late-binding   9m21s
```

That PVC is owned by the Pod:

```console
kubectl get -o yaml pvc/my-csi-app-inline-volume-my-csi-volume
```

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  annotations:
    pv.kubernetes.io/bind-completed: "yes"
    pv.kubernetes.io/bound-by-controller: "yes"
    volume.beta.kubernetes.io/storage-provisioner: pmem-csi.intel.com
    volume.kubernetes.io/selected-node: pmem-csi-pmem-govm-worker1
  creationTimestamp: "2020-08-11T15:44:57Z"
  finalizers:
  - kubernetes.io/pvc-protection
  managedFields:
    ...
  name: my-csi-app-inline-volume-my-csi-volume
  namespace: default
  ownerReferences:
  - apiVersion: v1
    blockOwnerDeletion: true
    controller: true
    kind: Pod
    name: my-csi-app-inline-volume
    uid: 75c925bf-ca8e-441a-ac67-f190b7a2265f
...
```

Eventually, the storage capacity information for `pmem-csi-pmem-govm-worker1` also gets updated:

```
csisc-2js6n map[pmem-csi.intel.com/node:pmem-csi-pmem-govm-worker2] 30716Mi
csisc-sqdnt map[pmem-csi.intel.com/node:pmem-csi-pmem-govm-worker1] 26620Mi
csisc-ws4bv map[pmem-csi.intel.com/node:pmem-csi-pmem-govm-worker3] 30716Mi
```

If another app needs more than 26620Mi, the Kubernetes
scheduler will not pick `pmem-csi-pmem-govm-worker1` anymore.


# Next steps

Both features are under development. Several open questions were
already raised during the alpha review process. The two enhancement
proposals document the work that will be needed for migration to beta and what
alternatives were already considered and rejected:

* [KEP-1698: generic ephemeral inline
volumes](https://github.com/kubernetes/enhancements/blob/9d7a75d/keps/sig-storage/1698-generic-ephemeral-volumes/README.md)
* [KEP-1472: Storage Capacity
Tracking](https://github.com/kubernetes/enhancements/tree/9d7a75d/keps/sig-storage/1472-storage-capacity-tracking)

Your feedback is crucial for driving that development. SIG-Storage
[meets
regularly](https://github.com/kubernetes/community/tree/master/sig-storage#meetings)
and can be reached via [Slack and a mailing
list](https://github.com/kubernetes/community/tree/master/sig-storage#contact).
