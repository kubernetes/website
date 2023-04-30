---
title: Verify Signed Kubernetes Artifacts
content_type: task
min-kubernetes-server-version: v1.26
weight: 420
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

{{< note >}}
`COSIGN_EXPERIMENTAL=1` is no longer required to have identity-based ("keyless") signing and transparency.

For additional information please read the Cosign 2.0 [blog post](https://blog.sigstore.dev/cosign-2-0-released/).
{{< /note >}}

## Verifying binary signatures

The Kubernetes release process signs all binary artifacts (tarballs, SPDX files,
standalone binaries) by using cosign's [Keyless signing](https://docs.sigstore.dev/cosign/keyless/). To verify a particular
binary, retrieve it together with its signature and certificate files:

```bash
URL=https://dl.k8s.io/release/v{{< skew currentVersion >}}.0/bin/linux/amd64
BINARY=kube-apiserver

FILES=(
    "$BINARY"
    "$BINARY.sig"
    "$BINARY.cert"
)

for FILE in "${FILES[@]}"; do
    curl -sSfL --retry 3 --retry-delay 3 "$URL/$FILE" -o "$FILE"
done
```

Then verify the blob using `cosign verify-blob`:

```shell
cosign verify-blob "$BINARY" --signature "$BINARY".sig --certificate "$BINARY".cert --certificate-identity krel-staging@k8s-releng-prod.iam.gserviceaccount.com --certificate-oidc-issuer https://accounts.google.com
```

A succesfull verification will output `Verified OK`.

{{< note >}}
Verification now requires identity flags, `--certificate-identity` and `--certificate-oidc-issuer`.

For additional information please read the Cosign 2.0 [blog post](https://blog.sigstore.dev/cosign-2-0-released/).
{{< /note >}}

## Verifying image signatures

For a complete list of images that are signed please refer
to [Releases](/releases/download/).

Pick one image from this list and verify its signature using `cosign verify`:

```shell
cosign verify registry.k8s.io/kube-apiserver-amd64:v{{< skew currentVersion >}}.0 --certificate-identity krel-trust@k8s-releng-prod.iam.gserviceaccount.com --certificate-oidc-issuer https://accounts.google.com
```

Once you have verified an image, you can replace `<image-name>:<tag>` with `<image-name>@<digest>` in your Pod manifests as per this example:

 `registry-url/image-name@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`

For more information, please refer
to the [Image Pull Policy](/docs/concepts/containers/images/#image-pull-policy)
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
