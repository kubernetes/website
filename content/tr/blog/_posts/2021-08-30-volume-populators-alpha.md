---
layout: blog
title: "Kubernetes 1.22: A New Design for Volume Populators"
date: 2021-08-30
slug: volume-populators-redesigned
author: >
  Ben Swartzlander (NetApp)
---

Kubernetes v1.22, released earlier this month, introduced a redesigned approach for volume
populators. Originally implemented
in v1.18, the API suffered from backwards compatibility issues. Kubernetes v1.22 includes a new API
field called `dataSourceRef` that fixes these problems.

## Data sources

Earlier Kubernetes releases already added a `dataSource` field into the
[PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) API,
used for cloning volumes and creating volumes from snapshots. You could use the `dataSource` field when
creating a new PVC, referencing either an existing PVC or a VolumeSnapshot in the same namespace.
That also modified the normal provisioning process so that instead of yielding an empty volume, the
new PVC contained the same data as either the cloned PVC or the cloned VolumeSnapshot.

Volume populators embrace the same design idea, but extend it to any type of object, as long
as there exists a [custom resource](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
to define the data source, and a populator controller to implement the logic. Initially,
the `dataSource` field was directly extended to allow arbitrary objects, if the `AnyVolumeDataSource`
feature gate was enabled on a cluster. That change unfortunately caused backwards compatibility
problems, and so the new `dataSourceRef` field was born.

In v1.22 if the `AnyVolumeDataSource` feature gate is enabled, the `dataSourceRef` field is
added, which behaves similarly to the `dataSource` field except that it allows arbitrary
objects to be specified. The API server ensures that the two fields always have the same
contents, and neither of them are mutable. The differences is that at creation time
`dataSource` allows only PVCs or VolumeSnapshots, and ignores all other values, while
`dataSourceRef` allows most types of objects, and in the few cases it doesn't allow an
object (core objects other than PVCs) a validation error occurs.

When this API change graduates to stable, we would deprecate using `dataSource` and recommend
using `dataSourceRef` field for all use cases.
In the v1.22 release, `dataSourceRef` is available (as an alpha feature) specifically for cases
where you want to use for custom volume populators.

## Using populators

Every volume populator must have one or more CRDs that it supports. Administrators may
install the CRD and the populator controller and then PVCs with a `dataSourceRef` specifies
a CR of the type that the populator supports will be handled by the populator controller
instead of the CSI driver directly.

Underneath the covers, the CSI driver is still invoked to create an empty volume, which
the populator controller fills with the appropriate data. The PVC doesn't bind to the PV
until it's fully populated, so it's safe to define a whole application manifest including
pod and PVC specs and the pods won't begin running until everything is ready, just as if
the PVC was a clone of another PVC or VolumeSnapshot.

## How it works

PVCs with data sources are still noticed by the external-provisioner sidecar for the
related storage class (assuming a CSI provisioner is used), but because the sidecar
doesn't understand the data source kind, it doesn't do anything. The populator controller
is also watching for PVCs with data sources of a kind that it understands and when it
sees one, it creates a temporary PVC of the same size, volume mode, storage class,
and even on the same topology (if topology is used) as the original PVC. The populator
controller creates a worker pod that attaches to the volume and writes the necessary
data to it, then detaches from the volume and the populator controller rebinds the PV
from the temporary PVC to the orignal PVC.

## Trying it out

The following things are required to use volume populators:
* Enable the `AnyVolumeDataSource` feature gate
* Install a CRD for the specific data source / populator
* Install the populator controller itself

Populator controllers may use the [lib-volume-populator](https://github.com/kubernetes-csi/lib-volume-populator)
library to do most of the Kubernetes API level work. Individual populators only need to
provide logic for actually writing data into the volume based on a particular CR
instance. This library provides a sample populator implementation.

These optional components improve user experience:
* Install the VolumePopulator CRD
* Create a VolumePopulator custom respource for each specific data source
* Install the [volume data source validator](https://github.com/kubernetes-csi/volume-data-source-validator)
  controller (alpha)

The purpose of these components is to generate warning events on PVCs with data sources
for which there is no populator.

## Putting it all together

To see how this works, you can install the sample "hello" populator and try it
out.

First install the volume-data-source-validator controller.

```terminal
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/volume-data-source-validator/master/client/config/crd/populator.storage.k8s.io_volumepopulators.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/volume-data-source-validator/master/deploy/kubernetes/rbac-data-source-validator.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/volume-data-source-validator/master/deploy/kubernetes/setup-data-source-validator.yaml
```

Next install the example populator.

```terminal
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/lib-volume-populator/master/example/hello-populator/crd.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/lib-volume-populator/master/example/hello-populator/deploy.yaml
```

Create an instance of the `Hello` CR, with some text.

```yaml
apiVersion: hello.k8s.io/v1alpha1
kind: Hello
metadata:
  name: example-hello
spec:
  fileName: example.txt
  fileContents: Hello, world!
```

Create a PVC that refers to that CR as its data source.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: example-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Mi
  dataSourceRef:
    apiGroup: hello.k8s.io
    kind: Hello
    name: example-hello
  volumeMode: Filesystem
```

Next, run a job that reads the file in the PVC.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
spec:
  template:
    spec:
      containers:
        - name: example-container
          image: busybox:latest
          command:
            - cat
            - /mnt/example.txt
          volumeMounts:
            - name: vol
              mountPath: /mnt
      restartPolicy: Never
      volumes:
        - name: vol
          persistentVolumeClaim:
            claimName: example-pvc
```

Wait for the job to complete (including all of its dependencies).

```terminal
kubectl wait --for=condition=Complete job/example-job
```

And last examine the log from the job.

```terminal
kubectl logs job/example-job
Hello, world!
```

Note that the volume already contained a text file with the string contents from
the CR. This is only the simplest example. Actual populators can set up the volume
to contain arbitrary contents.

## How to write your own volume populator

Developers interested in writing new poplators are encouraged to use the
[lib-volume-populator](https://github.com/kubernetes-csi/lib-volume-populator) library
and to only supply a small controller wrapper around the library, and a pod image
capable of attaching to volumes and writing the appropriate data to the volume.

Individual populators can be extremely generic such that they work with every type
of PVC, or they can do vendor specific things to rapidly fill a volume with data
if the volume was provisioned by a specific CSI driver from the same vendor, for
example, by communicating directly with the storage for that volume.

## The future

As this feature is still in alpha, we expect to update the out of tree controllers
with more tests and documentation. The community plans to eventually re-implement
the populator library as a sidecar, for ease of operations.

We hope to see some official community-supported populators for some widely-shared
use cases. Also, we expect that volume populators will be used by backup vendors
as a way to "restore" backups to volumes, and possibly a standardized API to do
this will evolve.

## How can I learn more?

The enhancement proposal,
[Volume Populators](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1495-volume-populators), includes lots of detail about the history and technical implementation
of this feature.

[Volume populators and data sources](/docs/concepts/storage/persistent-volumes/#volume-populators-and-data-sources), within the documentation topic about persistent volumes,
explains how to use this feature in your cluster.

Please get involved by joining the Kubernetes storage SIG to help us enhance this
feature. There are a lot of good ideas already and we'd be thrilled to have more!

