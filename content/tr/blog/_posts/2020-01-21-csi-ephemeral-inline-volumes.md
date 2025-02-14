---
title: CSI Ephemeral Inline Volumes
date: 2020-01-21
author: >
  Patrick Ohly (Intel) 
---

Typically, volumes provided by an external storage driver in
Kubernetes are *persistent*, with a lifecycle that is completely
independent of pods or (as a special case) loosely coupled to the
first pod which uses a volume ([late binding
mode](https://kubernetes.io/docs/concepts/storage/storage-classes/#volume-binding-mode)).
The mechanism for requesting and defining such volumes in Kubernetes
are [Persistent Volume Claim (PVC) and Persistent Volume
(PV)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
objects. Originally, volumes that are backed by a Container Storage Interface
(CSI) driver could only be used via this PVC/PV mechanism.

But there are also use cases for data volumes whose content and
lifecycle is tied to a pod. For example, a driver might populate a
volume with dynamically created secrets that are specific to the
application running in the pod. Such volumes need to be created
together with a pod and can be deleted as part of pod termination
(*ephemeral*). They get defined as part of the pod spec (*inline*).

Since Kubernetes 1.15, CSI drivers can also be used for such
*ephemeral inline* volumes. The [CSIInlineVolume feature
gate](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)
had to be set to enable it in 1.15 because support was still in alpha
state. In 1.16, the feature reached beta state, which typically means
that it is enabled in clusters by default.

CSI drivers have to be adapted to support this because although two
existing CSI gRPC calls are used (`NodePublishVolume` and `NodeUnpublishVolume`),
the way how they are
used is different and not covered by the CSI spec: for ephemeral
volumes, only `NodePublishVolume` is invoked by `kubelet` when asking
the CSI driver for a volume. All other calls
(like `CreateVolume`, `NodeStageVolume`, etc.) are skipped. The volume
parameters are provided in the pod spec and from there copied into the
`NodePublishVolumeRequest.volume_context` field. There are currently
no standardized parameters; even common ones like size must be
provided in a format that is defined by the CSI driver. Likewise, only
`NodeUnpublishVolume` gets called after the pod has terminated and the
volume needs to be removed.

Initially, the assumption was that CSI drivers would be specifically
written to provide either persistent or ephemeral volumes. But there
are also drivers which provide storage that is useful in both modes:
for example, [PMEM-CSI](https://github.com/intel/pmem-csi) manages
persistent memory (PMEM), a new kind of local storage that is provided
by [Intel® Optane™ DC Persistent
Memory](https://www.intel.com/content/www/us/en/architecture-and-technology/optane-dc-persistent-memory.html). Such
memory is useful both as persistent data storage (faster than normal SSDs)
and as ephemeral scratch space (higher capacity than DRAM).

Therefore the support in Kubernetes 1.16 was extended:
* Kubernetes and users can determine which kind of volumes a driver
  supports via the `volumeLifecycleModes` field in the [`CSIDriver`
  object](https://kubernetes-csi.github.io/docs/csi-driver-object.html#what-fields-does-the-csidriver-object-have).
* Drivers can get information about the volume mode by enabling the
  ["pod info on
  mount"](https://kubernetes-csi.github.io/docs/pod-info.html) feature
  which then will add the new `csi.storage.k8s.io/ephemeral` entry to
  the `NodePublishRequest.volume_context`.

For more information about implementing support of ephemeral inline
volumes in a CSI driver, see the [Kubernetes-CSI
documentation](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
and the [original design
document](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/20190122-csi-inline-volumes.md).

What follows in this blog post are usage examples based on real drivers
and a summary at the end.

# Examples

## [PMEM-CSI](https://github.com/intel/pmem-csi)

Support for ephemeral inline volumes was added in [release
v0.6.0](https://github.com/intel/pmem-csi/releases/tag/v0.6.0). The
driver can be used on hosts with real Intel® Optane™ DC Persistent
Memory, on [special machines in
GCE](https://github.com/intel/pmem-csi/blob/v0.6.0/examples/gce.md) or
with hardware emulated by QEMU. The latter is fully [integrated into
the
makefile](https://github.com/intel/pmem-csi/tree/v0.6.0#qemu-and-kubernetes)
and only needs Go, Docker and KVM, so that approach was used for this
example:

```sh
git clone --branch release-0.6 https://github.com/intel/pmem-csi
cd pmem-csi
TEST_DISTRO=clear TEST_DISTRO_VERSION=32080 TEST_PMEM_REGISTRY=intel make start
```

Bringing up the four-node cluster can take a while but eventually should end with:

```
The test cluster is ready. Log in with /work/pmem-csi/_work/pmem-govm/ssh-pmem-govm, run kubectl once logged in.
Alternatively, KUBECONFIG=/work/pmem-csi/_work/pmem-govm/kube.config can also be used directly.

To try out the pmem-csi driver persistent volumes:
...

To try out the pmem-csi driver ephemeral volumes:
   cat deploy/kubernetes-1.17/pmem-app-ephemeral.yaml | /work/pmem-csi/_work/pmem-govm/ssh-pmem-govm kubectl create -f -
```

`deploy/kubernetes-1.17/pmem-app-ephemeral.yaml` specifies one volume:

```
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app-inline-volume
spec:
  containers:
    - name: my-frontend
      image: busybox
      command: [ "sleep", "100000" ]
      volumeMounts:
      - mountPath: "/data"
        name: my-csi-volume
  volumes:
  - name: my-csi-volume
    csi:
      driver: pmem-csi.intel.com
      fsType: "xfs"
      volumeAttributes:
        size: "2Gi"
        nsmode: "fsdax"
```

Once we have created that pod, we can inspect the result:

```sh
kubectl describe pods/my-csi-app-inline-volume
```

```
Name:         my-csi-app-inline-volume
...
Volumes:
  my-csi-volume:
    Type:              CSI (a Container Storage Interface (CSI) volume source)
    Driver:            pmem-csi.intel.com
    FSType:            xfs
    ReadOnly:          false
    VolumeAttributes:      nsmode=fsdax
                           size=2Gi
```

```sh
kubectl exec my-csi-app-inline-volume -- df -h /data
```

```
Filesystem                Size      Used Available Use% Mounted on
/dev/ndbus0region0fsdax/d7eb073f2ab1937b88531fce28e19aa385e93696
                          1.9G     34.2M      1.8G   2% /data
```


## [Image Populator](https://github.com/kubernetes-csi/csi-driver-image-populator)

The image populator automatically unpacks a container image and makes
its content available as an ephemeral volume. It's still in
development, but canary images are already available which can be
installed with:

```sh
kubectl create -f https://github.com/kubernetes-csi/csi-driver-image-populator/raw/master/deploy/kubernetes-1.16/csi-image-csidriverinfo.yaml
kubectl create -f https://github.com/kubernetes-csi/csi-driver-image-populator/raw/master/deploy/kubernetes-1.16/csi-image-daemonset.yaml
```

This example pod will run nginx and have it serve data that
comes from the `kfox1111/misc:test` image:

```sh
kubectl create -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.16-alpine
    ports:
    - containerPort: 80
    volumeMounts:
    - name: data
      mountPath: /usr/share/nginx/html
  volumes:
  - name: data
    csi:
      driver: image.csi.k8s.io
      volumeAttributes:
          image: kfox1111/misc:test
EOF
```

```sh
kubectl exec nginx -- cat /usr/share/nginx/html/test
```

That `test` file just contains a single word:
```
testing
```

Such data containers can be built with Dockerfiles such as:
```
FROM scratch
COPY index.html /index.html
```

## [cert-manager-csi](https://github.com/jetstack/cert-manager-csi)

cert-manager-csi works together with
[cert-manager](https://github.com/jetstack/cert-manager). The goal for
this driver is to facilitate requesting and mounting certificate key
pairs to pods seamlessly. This is useful for facilitating mTLS, or
otherwise securing connections of pods with guaranteed present
certificates whilst having all of the features that cert-manager
provides. This project is experimental.


# Next steps

One of the issues with ephemeral inline volumes is that pods get
scheduled by Kubernetes onto nodes without knowing anything about the
currently available storage on that node. Once the pod has been
scheduled, the CSI driver must make the volume available one that
node. If that is currently not possible, the pod cannot start. This
will be retried until eventually the volume becomes ready. The
[storage capacity tracking
KEP](https://github.com/kubernetes/enhancements/pull/1353) is an
attempt to address this problem.

A related KEP introduces a [standardized size
parameter](https://github.com/kubernetes/enhancements/pull/1409).

Currently, CSI ephemeral inline volumes stay in beta while issues like
these are getting discussed. Your feedback is needed to decide how to
proceed with this feature. For the KEPs, the two PRs linked to above
is a good place to comment. The SIG Storage also [meets
regularly](https://github.com/kubernetes/community/tree/master/sig-storage#meetings)
and can be reached via [Slack and a mailing
list](https://github.com/kubernetes/community/tree/master/sig-storage#contact).
