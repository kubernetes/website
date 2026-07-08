---
layout: blog
title: "Kubernetes 1.31: Read Only Volumes Based On OCI Artifacts (alpha)"
date: 2024-08-16
slug: kubernetes-1-31-image-volume-source
author: Sascha Grunert
---

The Kubernetes community is moving towards fulfilling more Artificial
Intelligence (AI) and Machine Learning (ML) use cases in the future. While the
project has been designed to fulfill microservice architectures in the past,
it’s now time to listen to the end users and introduce features which have a
stronger focus on AI/ML.

One of these requirements is to support [Open Container Initiative (OCI)](https://opencontainers.org)
compatible images and artifacts (referred as OCI objects) directly as a native
volume source. This allows users to focus on OCI standards as well as enables
them to store and distribute any content using OCI registries. A feature like
this gives the Kubernetes project a chance to grow into use cases which go
beyond running particular images.

Given that, the Kubernetes community is proud to present a new alpha feature
introduced in v1.31: The Image Volume Source
([KEP-4639](https://kep.k8s.io/4639)). This feature allows users to specify an
image reference as volume in a pod while reusing it as volume mount within
containers:

```yaml
…
kind: Pod
spec:
  containers:
    - …
      volumeMounts:
        - name: my-volume
          mountPath: /path/to/directory
  volumes:
    - name: my-volume
      image:
        reference: my-image:tag
```

The above example would result in mounting `my-image:tag` to
`/path/to/directory` in the pod’s container.

## Use cases

The goal of this enhancement is to stick as close as possible to the existing
[container image](/docs/concepts/containers/images/) implementation within the
kubelet, while introducing a new API surface to allow more extended use cases.

For example, users could share a configuration file among multiple containers in
a pod without including the file in the main image, so that they can minimize
security risks and the overall image size. They can also package and distribute
binary artifacts using OCI images and mount them directly into Kubernetes pods,
so that they can streamline their CI/CD pipeline as an example.

Data scientists, MLOps engineers, or AI developers, can mount large language
model weights or machine learning model weights in a pod alongside a
model-server, so that they can efficiently serve them without including them in
the model-server container image. They can package these in an OCI object to
take advantage of OCI distribution and ensure efficient model deployment. This
allows them to separate the model specifications/content from the executables
that process them.

Another use case is that security engineers can use a public image for a malware
scanner and mount in a volume of private (commercial) malware signatures, so
that they can load those signatures without baking their own combined image
(which might not be allowed by the copyright on the public image). Those files
work regardless of the OS or version of the scanner software.

But in the long term it will be up to **you** as an end user of this project to
outline further important use cases for the new feature.
[SIG Node](https://github.com/kubernetes/community/blob/54a67f5/sig-node/README.md)
is happy to retrieve any feedback or suggestions for further enhancements to
allow more advanced usage scenarios. Feel free to provide feedback by either
using the [Kubernetes Slack (#sig-node)](https://kubernetes.slack.com/messages/sig-node)
channel or the [SIG Node mailinglist](https://groups.google.com/g/kubernetes-sig-node).

## Detailed example {#example}

The Kubernetes alpha feature gate [`ImageVolume`](/docs/reference/command-line-tools-reference/feature-gates)
needs to be enabled on the [API Server](/docs/reference/command-line-tools-reference/kube-apiserver)
as well as the [kubelet](/docs/reference/command-line-tools-reference/kubelet)
to make it functional. If that’s the case and the [container runtime](/docs/setup/production-environment/container-runtimes)
has support for the feature (like CRI-O ≥ v1.31), then an example `pod.yaml`
like this can be created:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
    - name: test
      image: registry.k8s.io/e2e-test-images/echoserver:2.3
      volumeMounts:
        - name: volume
          mountPath: /volume
  volumes:
    - name: volume
      image:
        reference: quay.io/crio/artifact:v1
        pullPolicy: IfNotPresent
```

The pod declares a new volume using the `image.reference` of
`quay.io/crio/artifact:v1`, which refers to an OCI object containing two files.
The `pullPolicy` behaves in the same way as for container images and allows the
following values:

- `Always`: the kubelet always attempts to pull the reference and the container
  creation will fail if the pull fails.
- `Never`: the kubelet never pulls the reference and only uses a local image or
  artifact. The container creation will fail if the reference isn’t present.
- `IfNotPresent`: the kubelet pulls if the reference isn’t already present on
  disk. The container creation will fail if the reference isn’t present and the
  pull fails.

The `volumeMounts` field is indicating that the container with the name `test`
should mount the volume under the path `/volume`.

If you now create the pod:

```shell
kubectl apply -f pod.yaml
```

And exec into it:

```shell
kubectl exec -it pod -- sh
```

Then you’re able to investigate what has been mounted:

```console
/ # ls /volume
dir   file
/ # cat /volume/file
2
/ # ls /volume/dir
file
/ # cat /volume/dir/file
1
```

**You managed to consume an OCI artifact using Kubernetes!**

The container runtime pulls the image (or artifact), mounts it to the
container and makes it finally available for direct usage. There are a bunch of
details in the implementation, which closely align to the existing image pull
behavior of the kubelet. For example:

- If a `:latest` tag as `reference` is provided, then the `pullPolicy` will
  default to `Always`, while in any other case it will default to `IfNotPresent`
  if unset.
- The volume gets re-resolved if the pod gets deleted and recreated, which means
  that new remote content will become available on pod recreation. A failure to
  resolve or pull the image during pod startup will block containers from
  starting and may add significant latency. Failures will be retried using
  normal volume backoff and will be reported on the pod reason and message.
- Pull secrets will be assembled in the same way as for the container image by
  looking up node credentials, service account image pull secrets, and pod spec
  image pull secrets.
- The OCI object gets mounted in a single directory by merging the manifest
  layers in the same way as for container images.
- The volume is mounted as read-only (`ro`) and non-executable files
  (`noexec`).
- Sub-path mounts for containers are not supported
  (`spec.containers[*].volumeMounts.subpath`).
- The field `spec.securityContext.fsGroupChangePolicy` has no effect on this
  volume type.
- The feature will also work with the [`AlwaysPullImages` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
  if enabled.

Thank you for reading through the end of this blog post! SIG Node is proud and
happy to deliver this feature as part of Kubernetes v1.31.

As writer of this blog post, I would like to emphasize my special thanks to
**all** involved individuals out there! You all rock, let’s keep on hacking!

## Further reading

- [Use an Image Volume With a Pod](/docs/tasks/configure-pod-container/image-volumes)
- [`image` volume overview](/docs/concepts/storage/volumes/#image)
