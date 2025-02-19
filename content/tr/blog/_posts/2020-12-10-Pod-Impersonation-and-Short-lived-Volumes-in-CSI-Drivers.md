---
layout: blog
title: 'Kubernetes 1.20: Pod Impersonation and Short-lived Volumes in CSI Drivers'
date: 2020-12-18
slug: kubernetes-1.20-pod-impersonation-short-lived-volumes-in-csi
author: >
  Shihang Zhang (Google)
---

Typically when a [CSI](https://github.com/container-storage-interface/spec/blob/baa71a34651e5ee6cb983b39c03097d7aa384278/spec.md) driver mounts credentials such as secrets and certificates, it has to authenticate against storage providers to access the credentials. However, the access to those credentials are controlled on the basis of the pods' identities rather than the CSI driver's identity. CSI drivers, therefore, need some way to retrieve pod's service account token. 

Currently there are two suboptimal approaches to achieve this, either by granting CSI drivers the permission to use TokenRequest API or by reading tokens directly from the host filesystem. 

Both of them exhibit the following drawbacks:

- Violating the principle of least privilege
- Every CSI driver needs to re-implement the logic of getting the pod’s service account token

The second approach is more problematic due to:

- The audience of the token defaults to the kube-apiserver
- The token is not guaranteed to be available (e.g. `AutomountServiceAccountToken=false`)
- The approach does not work for CSI drivers that run as a different (non-root) user from the pods. See [file permission section for service account token](https://github.com/kubernetes/enhancements/blob/f40c24a5da09390bd521be535b38a4dbab09380c/keps/sig-storage/20180515-svcacct-token-volumes.md#file-permission)
- The token might be legacy Kubernetes service account token which doesn’t expire if `BoundServiceAccountTokenVolume=false`

Kubernetes 1.20 introduces an alpha feature, `CSIServiceAccountToken`, to improve the security posture. The new feature allows CSI drivers to receive pods' [bound service account tokens](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md).

This feature also provides a knob to re-publish volumes so that short-lived volumes can be refreshed.

## Pod Impersonation

### Using GCP APIs

Using [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity), a Kubernetes service account can authenticate as a Google service account when accessing Google Cloud APIs. If a CSI driver needs to access GCP APIs on behalf of the pods that it is mounting volumes for, it can use the pod's service account token to [exchange for GCP tokens](https://cloud.google.com/iam/docs/reference/sts/rest). The pod's service account token is plumbed through the volume context in `NodePublishVolume` RPC calls when the feature `CSIServiceAccountToken` is enabled. For example: accessing [Google Secret Manager](https://cloud.google.com/secret-manager/) via a [secret store CSI driver](https://github.com/GoogleCloudPlatform/secrets-store-csi-driver-provider-gcp).

### Using Vault

If users configure [Kubernetes as an auth method](https://www.vaultproject.io/docs/auth/kubernetes), Vault uses the `TokenReview` API to validate the Kubernetes service account token. For CSI drivers using Vault as resources provider, they need to present the pod's service account to Vault. For example, [secrets store CSI driver](https://github.com/hashicorp/secrets-store-csi-driver-provider-vault) and [cert manager CSI driver](https://github.com/jetstack/cert-manager-csi).

## Short-lived Volumes

To keep short-lived volumes such as certificates effective, CSI drivers can specify `RequiresRepublish=true` in their`CSIDriver` object to have the kubelet periodically call `NodePublishVolume` on mounted volumes. These republishes allow CSI drivers to ensure that the volume content is up-to-date.

## Next steps

This feature is alpha and projected to move to beta in 1.21. See more in the following KEP and CSI documentation:

- [KEP-1855: Service Account Token for CSI Driver](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1855-csi-driver-service-account-token/README.md)
- [Token Requests](https://kubernetes-csi.github.io/docs/token-requests.html)

Your feedback is always welcome!
- SIG-Auth [meets regularly](https://github.com/kubernetes/community/tree/master/sig-auth#meetings) and can be reached via [Slack and the mailing list](https://github.com/kubernetes/community/tree/master/sig-auth#contact)
- SIG-Storage [meets regularly](https://github.com/kubernetes/community/tree/master/sig-storage#meetings) and can be reached via [Slack and the mailing list](https://github.com/kubernetes/community/tree/master/sig-storage#contact).
