---
layout: blog
title: "Kubernetes 1.26: We're now signing our binary release artifacts!"
date: 2022-12-12
slug: kubernetes-release-artifact-signing
author: >
  Sascha Grunert
---

The Kubernetes Special Interest Group (SIG) Release is proud to announce that we
are digitally signing all release artifacts, and that this aspect of Kubernetes
has now reached _beta_.

Signing artifacts provides end users a chance to verify the integrity of the
downloaded resource. It allows to mitigate man-in-the-middle attacks directly on
the client side and therefore ensures the trustfulness of the remote serving the
artifacts. The overall goal of out past work was to define the used tooling for
signing all Kubernetes related artifacts as well as providing a standard signing
process for related projects (for example for those in [kubernetes-sigs][k-sigs]).

[k-sigs]: https://github.com/kubernetes-sigs

We already signed all officially released container images (from Kubernetes v1.24 onwards).
Image signing was alpha for v1.24 and v1.25. For v1.26, we've added all
**binary artifacts** to the signing process as well! This means that now all
[client, server and source tarballs][tarballs], [binary artifacts][binaries],
[Software Bills of Material (SBOMs)][sboms] as well as the [build
provenance][provenance] will be signed using [cosign][cosign]. Technically
speaking, we now ship additional `*.sig` (signature) and `*.cert` (certificate)
files side by side to the artifacts for verifying their integrity.

[tarballs]: https://github.com/kubernetes/kubernetes/blob/release-1.26/CHANGELOG/CHANGELOG-1.26.md#downloads-for-v1260
[binaries]: https://gcsweb.k8s.io/gcs/kubernetes-release/release/v1.26.0/bin
[sboms]: https://dl.k8s.io/release/v1.26.0/kubernetes-release.spdx
[provenance]: https://dl.k8s.io/release/v1.26.0/provenance.json
[cosign]: https://github.com/sigstore/cosign

To verify an artifact, for example `kubectl`, you can download the
signature and certificate alongside with the binary. I use the release candidate
`rc.1` of v1.26 for demonstration purposes because the final has not been released yet:

```shell
curl -sSfL https://dl.k8s.io/release/v1.26.0-rc.1/bin/linux/amd64/kubectl -o kubectl
curl -sSfL https://dl.k8s.io/release/v1.26.0-rc.1/bin/linux/amd64/kubectl.sig -o kubectl.sig
curl -sSfL https://dl.k8s.io/release/v1.26.0-rc.1/bin/linux/amd64/kubectl.cert -o kubectl.cert
```

Then you can verify `kubectl` using [`cosign`][cosign]:

```shell
COSIGN_EXPERIMENTAL=1 cosign verify-blob kubectl --signature kubectl.sig --certificate kubectl.cert
```

```
tlog entry verified with uuid: 5d54b39222e3fa9a21bcb0badd8aac939b4b0d1d9085b37f1f10b18a8cd24657 index: 8173886
Verified OK
```

The UUID can be used to query the [rekor][rekor] transparency log:

[rekor]: https://github.com/sigstore/rekor

```shell
rekor-cli get --uuid 5d54b39222e3fa9a21bcb0badd8aac939b4b0d1d9085b37f1f10b18a8cd24657
```

```
LogID: c0d23d6ad406973f9559f3ba2d1ca01f84147d8ffc5b8445c224f98b9591801d
Index: 8173886
IntegratedTime: 2022-11-30T18:59:07Z
UUID: 24296fb24b8ad77a5d54b39222e3fa9a21bcb0badd8aac939b4b0d1d9085b37f1f10b18a8cd24657
Body: {
  "HashedRekordObj": {
    "data": {
      "hash": {
        "algorithm": "sha256",
        "value": "982dfe7eb5c27120de6262d30fa3e8029bc1da9e632ce70570e9c921d2851fc2"
      }
    },
    "signature": {
      "content": "MEQCIH0e1/0svxMoLzjeyhAaLFSHy5ZaYy0/2iQl2t3E0Pj4AiBsWmwjfLzrVyp9/v1sy70Q+FHE8miauOOVkAW2lTYVug==",
      "publicKey": {
        "content": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN2akNDQWthZ0F3SUJBZ0lVRldab0pLSUlFWkp3LzdsRkFrSVE2SHBQdi93d0NnWUlLb1pJemowRUF3TXcKTnpFVk1CTUdBMVVFQ2hNTWMybG5jM1J2Y21VdVpHVjJNUjR3SEFZRFZRUURFeFZ6YVdkemRHOXlaUzFwYm5SbApjbTFsWkdsaGRHVXdIaGNOTWpJeE1UTXdNVGcxT1RBMldoY05Nakl4TVRNd01Ua3dPVEEyV2pBQU1Ga3dFd1lICktvWkl6ajBDQVFZSUtvWkl6ajBEQVFjRFFnQUVDT3h5OXBwTFZzcVFPdHJ6RFgveTRtTHZSeU1scW9sTzBrS0EKTlJDM3U3bjMreHorYkhvWVkvMUNNRHpJQjBhRTA3NkR4ZWVaSkhVaWFjUXU4a0dDNktPQ0FXVXdnZ0ZoTUE0RwpBMVVkRHdFQi93UUVBd0lIZ0RBVEJnTlZIU1VFRERBS0JnZ3JCZ0VGQlFjREF6QWRCZ05WSFE0RUZnUVV5SmwxCkNlLzIzNGJmREJZQ2NzbXkreG5qdnpjd0h3WURWUjBqQkJnd0ZvQVUzOVBwejFZa0VaYjVxTmpwS0ZXaXhpNFkKWkQ4d1FnWURWUjBSQVFIL0JEZ3dOb0UwYTNKbGJDMXpkR0ZuYVc1blFHczRjeTF5Wld4bGJtY3RjSEp2WkM1cApZVzB1WjNObGNuWnBZMlZoWTJOdmRXNTBMbU52YlRBcEJnb3JCZ0VFQVlPL01BRUJCQnRvZEhSd2N6b3ZMMkZqClkyOTFiblJ6TG1kdmIyZHNaUzVqYjIwd2dZb0dDaXNHQVFRQjFua0NCQUlFZkFSNkFIZ0FkZ0RkUFRCcXhzY1IKTW1NWkhoeVpaemNDb2twZXVONDhyZitIaW5LQUx5bnVqZ0FBQVlUSjZDdlJBQUFFQXdCSE1FVUNJRXI4T1NIUQp5a25jRFZpNEJySklXMFJHS0pqNkQyTXFGdkFMb0I5SmNycXlBaUVBNW4xZ283cmQ2U3ZVeXNxeldhMUdudGZKCllTQnVTZHF1akVySFlMQTUrZTR3Q2dZSUtvWkl6ajBFQXdNRFpnQXdZd0l2Tlhub3pyS0pWVWFESTFiNUlqa1oKUWJJbDhvcmlMQ1M4MFJhcUlBSlJhRHNCNTFUeU9iYTdWcGVYdThuTHNjVUNNREU4ZmpPZzBBc3ZzSXp2azNRUQo0c3RCTkQrdTRVV1UrcjhYY0VxS0YwNGJjTFQwWEcyOHZGQjRCT2x6R204K093PT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo="
      }
    }
  }
}
```

The `HashedRekordObj.signature.content` should match the content of the file
`kubectl.sig` and `HashedRekordObj.signature.publicKey.content` should be
identical with the contents of `kubectl.cert`. It is also possible to specify
the remote certificate and signature locations without downloading them:

```shell
COSIGN_EXPERIMENTAL=1 cosign verify-blob kubectl \
    --signature https://dl.k8s.io/release/v1.26.0-rc.1/bin/linux/amd64/kubectl.sig \
    --certificate https://dl.k8s.io/release/v1.26.0-rc.1/bin/linux/amd64/kubectl.cert
```

```
tlog entry verified with uuid: 5d54b39222e3fa9a21bcb0badd8aac939b4b0d1d9085b37f1f10b18a8cd24657 index: 8173886
Verified OK
```

All of the mentioned steps as well as how to verify container images are
outlined in the official documentation about how to [Verify Signed Kubernetes
Artifacts][docs]. In one of the next upcoming Kubernetes releases we will
working making the global story more mature by ensuring that truly all
Kubernetes artifacts are signed. Beside that, we are considering using Kubernetes
owned infrastructure for the signing (root trust) and verification (transparency
log) process.

[docs]: /docs/tasks/administer-cluster/verify-signed-artifacts

## Getting involved

If you're interested in contributing to SIG Release, then consider applying for
the upcoming v1.27 shadowing program (watch for the announcement on
[k-dev][k-dev]) or join our [weekly meeting][meeting] to say _hi_.

We're looking forward to making even more of those awesome changes for future
Kubernetes releases. For example, we're working on the [SLSA Level 3 Compliance
in the Kubernetes Release Process][slsa] or the [Renaming of the kubernetes/kubernetes
default branch name to `main`][kkmain].

Thank you for reading this blog post! I'd like to use this opportunity to give
all involved SIG Release folks a special shout-out for shipping this feature in
time!

Feel free to reach out to us by using the [SIG Release mailing list][mail] or
the [#sig-release][slack] Slack channel.

[mail]: https://groups.google.com/g/kubernetes-sig-release
[slsa]: https://github.com/kubernetes/enhancements/issues/3027
[kkmain]: https://github.com/kubernetes/enhancements/issues/2853
[slack]: http://slack.k8s.io
[k-dev]: https://groups.google.com/a/kubernetes.io/g/dev
[meeting]: http://bit.ly/k8s-sig-release-meeting

## Additional resources

- [Signing Release Artifacts Enhancement Proposal](https://github.com/kubernetes/enhancements/issues/3031)
