---
layout: blog
title: "Kubernetes v1.33: Image Volumes graduate to beta!"
date: 2025-04-29T10:30:00-08:00
slug: kubernetes-v1-33-image-volume-beta
author: Sascha Grunert (Red Hat)
---

[Image Volumes](/blog/2024/08/16/kubernetes-1-31-image-volume-source) were
introduced as an Alpha feature with the Kubernetes v1.31 release as part of
[KEP-4639](https://github.com/kubernetes/enhancements/issues/4639). In Kubernetes v1.33, this feature graduates to **beta**.

Please note that the feature is still _disabled_ by default, because not all
[container runtimes](/docs/setup/production-environment/container-runtimes) have
full support for it. [CRI-O](https://cri-o.io) supports the initial feature since version v1.31 and
will add support for Image Volumes as beta in v1.33.
[containerd merged](https://github.com/containerd/containerd/pull/10579) support
for the alpha feature which will be part of the v2.1.0 release and is working on
beta support as part of [PR #11578](https://github.com/containerd/containerd/pull/11578).

### What's new

The major change for the beta graduation of Image Volumes is the support for
[`subPath`](/docs/concepts/storage/volumes/#using-subpath) and
[`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment) mounts
for containers via `spec.containers[*].volumeMounts.[subPath,subPathExpr]`. This
allows end-users to mount a certain subdirectory of an image volume, which is
still mounted as readonly (`noexec`). This means that non-existing
subdirectories cannot be mounted by default. As for other `subPath` and
`subPathExpr` values, Kubernetes will ensure that there are no absolute path or
relative path components part of the specified sub path. Container runtimes are
also required to double check those requirements for safety reasons. If a
specified subdirectory does not exist within a volume, then runtimes should fail
on container creation and provide user feedback by using existing kubelet
events.

Besides that, there are also three new kubelet metrics available for image volumes:

- `kubelet_image_volume_requested_total`: Outlines the number of requested image volumes.
- `kubelet_image_volume_mounted_succeed_total`: Counts the number of successful image volume mounts.
- `kubelet_image_volume_mounted_errors_total`: Accounts the number of failed image volume mounts.

To use an existing subdirectory for a specific image volume, just use it as
[`subPath`](/docs/concepts/storage/volumes/#using-subpath) (or
[`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment))
value of the containers `volumeMounts`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: image-volume
spec:
  containers:
  - name: shell
    command: ["sleep", "infinity"]
    image: debian
    volumeMounts:
    - name: volume
      mountPath: /volume
      subPath: dir
  volumes:
  - name: volume
    image:
      reference: quay.io/crio/artifact:v2
      pullPolicy: IfNotPresent
```

Then, create the pod on your cluster:

```shell
kubectl apply -f image-volumes-subpath.yaml
```

Now you can attach to the container:

```shell
kubectl attach -it image-volume bash
```

And check the content of the file from the `dir` sub path in the volume:

```shell
cat /volume/file
```

The output will be similar to:

```none
1
```

Thank you for reading through the end of this blog post! SIG Node is proud and
happy to deliver this feature graduation as part of Kubernetes v1.33.

As writer of this blog post, I would like to emphasize my special thanks to
**all** involved individuals out there!

If you would like to provide feedback or suggestions feel free to reach out
to SIG Node using the [Kubernetes Slack (#sig-node)](https://kubernetes.slack.com/messages/sig-node)
channel or the [SIG Node mailing list](https://groups.google.com/g/kubernetes-sig-node).

## Further reading

- [Use an Image Volume With a Pod](/docs/tasks/configure-pod-container/image-volumes)
- [`image` volume overview](/docs/concepts/storage/volumes/#image)
