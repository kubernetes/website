---
title: Verify Signed Container Images
content_type: task 
min-kubernetes-server-version: v1.24
---

<!-- overview -->

{{< feature-state state="alpha" for_k8s_version="v1.24" >}}

## {{% heading "prerequisites" %}}

These instructions are for Kubernetes {{< skew currentVersion >}}. If you want to check the
integrity of components for a different version of Kubernetes, check the documentation for
that Kubernetes release.

You will need to have the following tools installed:
- `cosign` ([install guide](https://docs.sigstore.dev/cosign/installation/))
- Go compiler ([install guide](https://go.dev/doc/install)
- `curl` (often provided by your operating system)

## Verifying image signatures
For a complete list of images that are signed please refer to [Releases](/releases/download/).

Let's pick one image from this list and verify its signature
using `cosign verify` command:

```shell
COSIGN_EXPERIMENTAL=1 cosign verify k8s.gcr.io/kube-apiserver-amd64:v1.24.0
```

{{% alert title="Note" %}}
`COSIGN_EXPERIMENTAL=1` is used to allow verification of images signed
in `KEYLESS` mode. To learn more about keyless signing, please refer to
[Keyless Signatures](https://github.com/sigstore/cosign/blob/main/KEYLESS.md#keyless-signatures).
{{% /alert %}}

### Verifying images for all control plane components

To verify all signed control plane images, please run this command:

```shell
curl https://kubernetes.io/examples/admin/signed-images/auto-generated-list-of-all-signed-images.txt --output auto-generated-list-of-all-signed-images.txt
input=auto-generated-list-of-all-signed-images.txt
while IFS= read -r image
do
  COSIGN_EXPERIMENTAL=1 cosign verify "$image"
done < "$input"
```

## Verifying Image Signatures with Admission Controller

For non-control plane images (e.g. kube-conformance), image signatures can also
be verified, at deploy time using 
[cosigned](https://docs.sigstore.dev/cosign/kubernetes/#cosigned-admission-controller)
admission controller. To get started on `cosigned` here are a few helpful resources:

* [Installation](https://github.com/sigstore/helm-charts/tree/main/charts/cosigned)
* [Configuration Options](https://github.com/sigstore/cosign/tree/main/config)
