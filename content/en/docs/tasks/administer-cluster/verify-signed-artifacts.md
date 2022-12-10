---
title: Verify Signed Kubernetes Artifacts
content_type: task
min-kubernetes-server-version: v1.26
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.26" >}}

## {{% heading "prerequisites" %}}

These instructions are for Kubernetes {{< skew currentVersion >}}. If you want
to check the integrity of components for a different version of Kubernetes,
check the documentation for that Kubernetes release.

You will need to have the following tools installed:

- `cosign` ([install guide](https://docs.sigstore.dev/cosign/installation/))
- `curl` (often provided by your operating system)

## Verifying binary signatures

The Kubernetes release process signs all binary artifacts (tarballs, SPDX files,
standalone binaries) by using cosign's keyless signing. To verify a particular
binary, retrieve it together with its signature and certificate:

```bash
URL=https://dl.k8s.io/release/v{{< skew currentVersion >}}.0/bin/linux/amd64
BINARY=kubectl

FILES=(
    "$BINARY"
    "$BINARY.sig"
    "$BINARY.cert"
)

for FILE in "${FILES[@]}"; do
    curl -sSfL --retry 3 --retry-delay 3 "$URL/$FILE" -o "$FILE"
done
```

Then verify the blob by using `cosign`:

```shell
cosign verify-blob "$BINARY" --signature "$BINARY".sig --certificate "$BINARY".cert
```

{{< note >}}
To learn more about keyless signing, please refer to [Keyless
Signatures](https://github.com/sigstore/cosign/blob/main/KEYLESS.md#keyless-signatures).
{{< /note >}}

## Verifying image signatures

For a complete list of images that are signed please refer
to [Releases](/releases/download/).

Let's pick one image from this list and verify its signature using
the `cosign verify` command:

```shell
COSIGN_EXPERIMENTAL=1 cosign verify registry.k8s.io/kube-apiserver-amd64:v{{< skew currentVersion >}}.0
```

{{< note >}}
`COSIGN_EXPERIMENTAL=1` is used to allow verification of images signed
in `KEYLESS` mode. To learn more about keyless signing, please refer to
[Keyless Signatures](https://github.com/sigstore/cosign/blob/main/KEYLESS.md#keyless-signatures)
. {{< /note >}}

### Verifying images for all control plane components

To verify all signed control plane images, please run this command:

```shell
curl -Ls https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/latest.txt)/release | grep 'PackageName: registry.k8s.io/' | awk '{print $2}' > images.txt
input=images.txt
while IFS= read -r image
do
  COSIGN_EXPERIMENTAL=1 cosign verify "$image"
done < "$input"
```

Once you have verified an image, specify that image by its digest in your Pod
manifests as per this
example: `registry-url/image-name@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`
.

For more information, please refer
to [Image Pull Policy](/docs/concepts/containers/images/#image-pull-policy)
section.

## Verifying Image Signatures with Admission Controller

For non-control plane images (
e.g. [conformance image](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/image/README.md))
, signatures can also be verified at deploy time using
[sigstore policy-controller](https://docs.sigstore.dev/policy-controller/overview)
admission controller. To get started with `policy-controller` here are a few helpful
resources:

- [Installation](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller)
- [Configuration Options](https://github.com/sigstore/policy-controller/tree/main/config)
