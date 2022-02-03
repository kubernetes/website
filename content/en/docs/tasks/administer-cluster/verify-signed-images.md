---
title: Verify Signed Container Images

reviewers:
  - TBD

content_type: task
min-kubernetes-server-version: v1.24
---

<!-- overview -->

{{< feature-state state="alpha" for_k8s_version="v1.24" >}}
## Pre-requisites
- [cosign](https://docs.sigstore.dev/cosign/installation/)

## Verifying image signatures
For a complete list of images that are signed please refer to [releases](releases/download.md) page.

Let's pick one image from this list and verify its signature using `cosign verify` command.

```shell
cosign verify us.gcr.io/k8s-artifacts-prod/kube-apiserver:v1.24.0
```
### All control plane images

To verify all signed control plane images, please run this command

```shell
curl https://kubernetes.io/examples/admin/signed-images/auto-generated-list-of-all-signed-images.txt --output auto-generated-list-of-all-signed-images.txt
input=auto-generated-list-of-all-signed-images.txt
while IFS= read -r image
do
  COSIGN_EXPERIMENTAL=1 cosign verify "$image"
done < "$input"
```

