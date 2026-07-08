---
layout: blog
title: "Kubernetes 1.24: Volume Populators Graduate to Beta"
date: 2022-05-16
slug: volume-populators-beta
author: >
  Ben Swartzlander (NetApp)
---

The volume populators feature is now two releases old and entering beta! The `AnyVolumeDataSource` feature
gate defaults to enabled in Kubernetes v1.24, which means that users can specify any custom resource
as the data source of a PVC.

An [earlier blog article](/blog/2021/08/30/volume-populators-redesigned/) detailed how the
volume populators feature works. In short, a cluster administrator can install a CRD and
associated populator controller in the cluster, and any user who can create instances of 
the CR can create pre-populated volumes by taking advantage of the populator.

Multiple populators can be installed side by side for different purposes. The SIG storage
community is already seeing some implementations in public, and more prototypes should
appear soon.

Cluster administrations are **strongly encouraged** to install the
volume-data-source-validator controller and associated `VolumePopulator` CRD before installing
any populators so that users can get feedback about invalid PVC data sources.

## New Features

The [lib-volume-populator](https://github.com/kubernetes-csi/lib-volume-populator) library
on which populators are built now includes metrics to help operators monitor and detect
problems. This library is now beta and latest release is v1.0.1.

The [volume data source validator](https://github.com/kubernetes-csi/volume-data-source-validator)
controller also has metrics support added, and is in beta. The `VolumePopulator` CRD is
beta and the latest release is v1.0.1.

## Trying it out

To see how this works, you can install the sample "hello" populator and try it
out.

First install the volume-data-source-validator controller.

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/volume-data-source-validator/v1.0.1/client/config/crd/populator.storage.k8s.io_volumepopulators.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/volume-data-source-validator/v1.0.1/deploy/kubernetes/rbac-data-source-validator.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/volume-data-source-validator/v1.0.1/deploy/kubernetes/setup-data-source-validator.yaml
```

Next install the example populator.

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/lib-volume-populator/v1.0.1/example/hello-populator/crd.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/lib-volume-populator/87a47467b86052819e9ad13d15036d65b9a32fbb/example/hello-populator/deploy.yaml
```

Your cluster now has a new CustomResourceDefinition that provides a test API named Hello.
Create an instance of the `Hello` custom resource, with some text:

```yaml
apiVersion: hello.example.com/v1alpha1
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
    apiGroup: hello.example.com
    kind: Hello
    name: example-hello
  volumeMode: Filesystem
```

Next, run a Job that reads the file in the PVC.

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

```shell
kubectl wait --for=condition=Complete job/example-job
```

And last examine the log from the job.

```shell
kubectl logs job/example-job
```

The output should be:

```terminal
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

## How can I learn more?

The enhancement proposal,
[Volume Populators](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1495-volume-populators), includes lots of detail about the history and technical implementation
of this feature.

[Volume populators and data sources](/docs/concepts/storage/persistent-volumes/#volume-populators-and-data-sources), within the documentation topic about persistent volumes,
explains how to use this feature in your cluster.

Please get involved by joining the Kubernetes storage SIG to help us enhance this
feature. There are a lot of good ideas already and we'd be thrilled to have more!

