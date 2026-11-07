---
title: Verify Signed Kubernetes Artifacts
content_type: task
min-kubernetes-server-version: v1.26
weight: 420
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.26" >}}

## {{% heading "prerequisites" %}}

You will need to have the following tools installed:

- `cosign` ([install guide](https://docs.sigstore.dev/cosign/system_config/installation/))
- `curl` (often provided by your operating system)
- `jq` version 1.6 or later ([download jq](https://jqlang.github.io/jq/download/))

## Verifying binary signatures

The Kubernetes release process signs all binary artifacts (tarballs, SPDX files,
standalone binaries) by using cosign's keyless signing. To verify a particular
binary, retrieve it together with its signature and certificate:

```bash
URL=https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64
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

Then verify the blob by using `cosign verify-blob`:

```shell
cosign verify-blob "$BINARY" \
  --signature "$BINARY".sig \
  --certificate "$BINARY".cert \
  --certificate-identity krel-staging@k8s-releng-prod.iam.gserviceaccount.com \
  --certificate-oidc-issuer https://accounts.google.com
```

{{< note >}}
Cosign 2.0 requires the `--certificate-identity` and `--certificate-oidc-issuer` options.

To learn more about keyless signing, please refer to [Keyless Signatures](https://docs.sigstore.dev/cosign/signing/overview/).

Previous versions of Cosign required that you set `COSIGN_EXPERIMENTAL=1`.

For additional information, please refer to the [sigstore Blog](https://blog.sigstore.dev/cosign-2-0-released/)
{{< /note >}}

## Verifying the release provenance

Kubernetes releases published since v1.38.0-beta.0, including the patch
releases of older minor versions, come with signed
[SLSA build provenance](https://slsa.dev/spec/v1.0/provenance) next to their
artifacts. The `provenance.json` file is a Sigstore bundle signed by the
release process. It lists the digest of every binary and release tarball, and
records the builder and the Kubernetes source commit that the release was built
from.

Retrieve the provenance together with the artifact that you want to check:

```shell
URL=https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}

curl -sSfL --retry 3 --retry-delay 3 "$URL/provenance.json" -o provenance.json
curl -sSfL --retry 3 --retry-delay 3 "$URL/bin/linux/amd64/kubectl" -o kubectl
```

Then verify the provenance and check that it lists the digest of the artifact
by using `cosign verify-blob-attestation`:

```shell
cosign verify-blob-attestation kubectl \
  --bundle provenance.json \
  --type slsaprovenance1 \
  --certificate-identity krel-staging@k8s-releng-prod.iam.gserviceaccount.com \
  --certificate-oidc-issuer https://accounts.google.com
```

The command fails if the signature doesn't verify, or if the provenance doesn't
list the digest of the artifact.

To see which source the release was built from, read the resolved dependencies
of the provenance:

```shell
jq -r '.dsseEnvelope.payload | @base64d | fromjson
  | .predicate.buildDefinition.resolvedDependencies[]
  | "\(.uri) \(.digest.gitCommit)"' provenance.json
```

The output is similar to this:

```console
git+https://github.com/kubernetes/kubernetes@refs/tags/v{{< skew currentPatchVersion >}} 6575724b63e50cd5dd454e774bc293c6de1e4e12
```

## Verifying image signatures

For a complete list of images that are signed please refer
to [Releases](/releases/download/).

Pick one image from this list and verify its signature using
the `cosign verify` command:

```shell
cosign verify registry.k8s.io/kube-apiserver-amd64:v{{< skew currentPatchVersion >}} \
  --certificate-identity krel-trust@k8s-releng-prod.iam.gserviceaccount.com \
  --certificate-oidc-issuer https://accounts.google.com \
  | jq .
```

### Verifying images for all control plane components

To verify all signed control plane images for the latest stable version
(v{{< skew currentPatchVersion >}}), please run the following commands:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" \
  | grep "SPDXID: SPDXRef-Package-registry.k8s.io" \
  | grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/' \
  | sort > images.txt
input=images.txt
while IFS= read -r image
do
  cosign verify "$image" \
    --certificate-identity krel-trust@k8s-releng-prod.iam.gserviceaccount.com \
    --certificate-oidc-issuer https://accounts.google.com \
    | jq .
done < "$input"
```

Once you have verified an image, you can specify the image by its digest in your Pod
manifests as per this example:

```console
registry-url/image-name@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2
```

For more information, please refer
to the [Image Pull Policy](/docs/concepts/containers/images/#image-pull-policy)
section.

### Verifying image provenance

For the same releases, the release process also attaches signed SLSA build
provenance to the images that it builds, which registry.k8s.io serves as an
[OCI referrer](https://github.com/opencontainers/distribution-spec/blob/main/spec.md#listing-referrers)
of the image. To verify it, run:

```shell
cosign verify-attestation registry.k8s.io/kube-apiserver-amd64:v{{< skew currentPatchVersion >}} \
  --new-bundle-format \
  --type slsaprovenance1 \
  --certificate-identity krel-staging@k8s-releng-prod.iam.gserviceaccount.com \
  --certificate-oidc-issuer https://accounts.google.com \
  | jq -er '.payload | @base64d | fromjson | .predicate.runDetails.builder.id'
```

The output is similar to this:

```console
https://git.k8s.io/release/docs/krel
```

{{< note >}}
Cosign 2 needs the `--new-bundle-format` option to find attestations that are
attached as OCI referrers. Cosign 3 uses that format by default.
{{< /note >}}

### Verifying the image verification summaries

When the image promoter publishes an image on registry.k8s.io, it checks the
provenance of the image and records the result in a signed
[SLSA verification summary](https://slsa.dev/spec/v1.0/verification_summary).
For the images of releases published since v1.38.0-beta.0, the summary claims
SLSA build level 1 or higher. To check that, run:

```shell
cosign verify-attestation registry.k8s.io/kube-apiserver-amd64:v{{< skew currentPatchVersion >}} \
  --new-bundle-format \
  --type https://slsa.dev/verification_summary/v1 \
  --certificate-identity promoter-summaries@k8s-releng-prod.iam.gserviceaccount.com \
  --certificate-oidc-issuer https://accounts.google.com \
  | jq -e '.payload | @base64d | fromjson | .predicate
    | select(.verifier.id == "https://k8s.io/promo-tools/verifier/v1")
    | .verificationResult == "PASSED"
      and any(.verifiedLevels[];
        IN("SLSA_BUILD_LEVEL_1", "SLSA_BUILD_LEVEL_2", "SLSA_BUILD_LEVEL_3"))'
```

The command prints `true`. It fails if there is no summary, if the result of
the summary isn't `PASSED`, or if the summary doesn't claim at least SLSA build
level 1.

## Verifying Image Signatures with Admission Controller

For non-control plane images (for example
[conformance image](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/image/README.md)),
signatures can also be verified at deploy time using
[sigstore policy-controller](https://docs.sigstore.dev/policy-controller/overview)
admission controller.

Here are some helpful resources to get started with `policy-controller`:

- [Installation](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller)
- [Configuration Options](https://github.com/sigstore/policy-controller/tree/main/config)

## Verify the Software Bill Of Materials

You can verify the Kubernetes Software Bill of Materials (SBOM) by using the
sigstore certificate and signature, or the corresponding SHA files:

```shell
# Retrieve the latest available Kubernetes release version
VERSION=$(curl -Ls https://dl.k8s.io/release/stable.txt)

# Verify the SHA512 sum
curl -Ls "https://sbom.k8s.io/$VERSION/release" -o "$VERSION.spdx"
echo "$(curl -Ls "https://sbom.k8s.io/$VERSION/release.sha512") $VERSION.spdx" | sha512sum --check

# Verify the SHA256 sum
echo "$(curl -Ls "https://sbom.k8s.io/$VERSION/release.sha256") $VERSION.spdx" | sha256sum --check

# Retrieve sigstore signature and certificate
curl -Ls "https://sbom.k8s.io/$VERSION/release.sig" -o "$VERSION.spdx.sig"
curl -Ls "https://sbom.k8s.io/$VERSION/release.cert" -o "$VERSION.spdx.cert"

# Verify the sigstore signature
cosign verify-blob \
    --certificate "$VERSION.spdx.cert" \
    --signature "$VERSION.spdx.sig" \
    --certificate-identity krel-staging@k8s-releng-prod.iam.gserviceaccount.com \
    --certificate-oidc-issuer https://accounts.google.com \
    "$VERSION.spdx"
```

Releases published since v1.38.0-beta.0, including the patch releases of older
minor versions, also publish the SBOM in the
[SPDX 3](https://spdx.github.io/spdx-spec/v3.0.1/) format as
`kubernetes-release.spdx3.json`, which you can verify the same way:

```bash
URL="https://dl.k8s.io/release/$VERSION"

for FILE in kubernetes-release.spdx3.json{,.sha512,.sig,.cert}; do
    curl -sSfL --retry 3 --retry-delay 3 "$URL/$FILE" -o "$FILE"
done

echo "$(cat kubernetes-release.spdx3.json.sha512) kubernetes-release.spdx3.json" | sha512sum --check

cosign verify-blob kubernetes-release.spdx3.json \
    --certificate kubernetes-release.spdx3.json.cert \
    --signature kubernetes-release.spdx3.json.sig \
    --certificate-identity krel-staging@k8s-releng-prod.iam.gserviceaccount.com \
    --certificate-oidc-issuer https://accounts.google.com
```
