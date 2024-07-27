---
layout: blog
title: "Kubernetes 1.25: CSI Inline Volumes have graduated to GA"
date: 2022-08-29
slug: csi-inline-volumes-ga
author: >
  Jonathan Dobson (Red Hat)
---

CSI Inline Volumes were introduced as an alpha feature in Kubernetes 1.15 and have been beta since 1.16. We are happy to announce that this feature has graduated to General Availability (GA) status in Kubernetes 1.25.

CSI Inline Volumes are similar to other ephemeral volume types, such as `configMap`, `downwardAPI` and `secret`. The important difference is that the storage is provided by a CSI driver, which allows the use of ephemeral storage provided by third-party vendors. The volume is defined as part of the pod spec and follows the lifecycle of the pod, meaning the volume is created once the pod is scheduled and destroyed when the pod is destroyed.

## What's new in 1.25?

There are a couple of new bug fixes related to this feature in 1.25, and the [CSIInlineVolume feature gate](/docs/reference/command-line-tools-reference/feature-gates/) has been locked to `True` with the graduation to GA. There are no new API changes, so users of this feature during beta should not notice any significant changes aside from these bug fixes.

- [#89290 - CSI inline volumes should support fsGroup](https://github.com/kubernetes/kubernetes/issues/89290)
- [#79980 - CSI volume reconstruction does not work for ephemeral volumes](https://github.com/kubernetes/kubernetes/issues/79980)

## When to use this feature

CSI inline volumes are meant for simple local volumes that should follow the lifecycle of the pod. They may be useful for providing secrets, configuration data, or other special-purpose storage to the pod from a CSI driver.

A CSI driver is not suitable for inline use when:
- The volume needs to persist longer than the lifecycle of a pod
- Volume snapshots, cloning, or volume expansion are required
- The CSI driver requires `volumeAttributes` that should be restricted to an administrator

## How to use this feature

In order to use this feature, the `CSIDriver` spec must explicitly list `Ephemeral` as one of the supported `volumeLifecycleModes`. Here is a simple example from the [Secrets Store CSI Driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver).

```
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: secrets-store.csi.k8s.io
spec:
  podInfoOnMount: true
  attachRequired: false
  volumeLifecycleModes:
  - Ephemeral
```

Any pod spec may then reference that CSI driver to create an inline volume, as in this example.

```
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app-inline
spec:
  containers:
    - name: my-frontend
      image: busybox
      volumeMounts:
      - name: secrets-store-inline
        mountPath: "/mnt/secrets-store"
        readOnly: true
      command: [ "sleep", "1000000" ]
  volumes:
    - name: secrets-store-inline
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: "my-provider"
```

If the driver supports any volume attributes, you can provide these as part of the `spec` for the Pod as well:

```
      csi:
        driver: block.csi.vendor.example
        volumeAttributes:
          foo: bar
```

## Example Use Cases

Two existing CSI drivers that support the `Ephemeral` volume lifecycle mode are the Secrets Store CSI Driver and the Cert-Manager CSI Driver.

The [Secrets Store CSI Driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver) allows users to mount secrets from external secret stores into a pod as an inline volume. This can be useful when the secrets are stored in an external managed service or Vault instance.

The [Cert-Manager CSI Driver](https://github.com/cert-manager/csi-driver) works along with [cert-manager](https://cert-manager.io/) to seamlessly request and mount certificate key pairs into a pod. This allows the certificates to be renewed and updated in the application pod automatically.

## Security Considerations

Special consideration should be given to which CSI drivers may be used as inline volumes. `volumeAttributes` are typically controlled through the `StorageClass`, and may contain attributes that should remain restricted to the cluster administrator. Allowing a CSI driver to be used for inline ephmeral volumes means that any user with permission to create pods may also provide `volumeAttributes` to the driver through a pod spec.

Cluster administrators may choose to omit (or remove) `Ephemeral` from `volumeLifecycleModes` in the CSIDriver spec to prevent the driver from being used as an inline ephemeral volume, or use an [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/) to restrict how the driver is used.

## References

For more information on this feature, see:

- [Kubernetes documentation](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
- [CSI documentation](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
- [KEP-596](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/596-csi-inline-volumes/README.md)
- [Beta blog post for CSI Inline Volumes](/blog/2020/01/21/csi-ephemeral-inline-volumes/)

