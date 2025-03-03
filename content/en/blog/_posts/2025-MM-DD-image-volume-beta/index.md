---
layout: blog
title: "Kubernetes 1.33: Image Volumes graduate to beta!"
date: 2025-MM-DD
slug: image-voume-beta
author: Sascha Grunert (Red Hat)
---

[Image Volumes](/blog/2024/08/16/kubernetes-1-31-image-volume-source) were
introduced as an Alpha feature with the Kubernetes v1.31 release as part of
[KEP-4639](https://github.com/kubernetes/enhancements/issues/4639). The recent
release of Kubernetes v1.33 moved that support to **beta**.

Please note that the feature is still _disabled_ by default, because not all
[container runtimes](/docs/setup/production-environment/container-runtimes) have
full support for it. [CRI-O](https://cri-o.io) supports the initial feature since version v1.31 and
will add support for Image Volumes as beta in v1.33.
[containerd](https://containerd.io) merged support for the alpha feature, but
has not released it yet.

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

There are also three new kubelet metrics available for image volumes:

- `kubelet_image_volume_requested_total`: Outlines the number of requested image volumes.
- `kubelet_image_volume_mounted_succeed_total`: Counts the number of successful image volume mounts.
- `kubelet_image_volume_mounted_errors_total`: Accounts the number of failed image volume mounts.

To use an existing subdirectory for a specific image volume, just use it as
`subPath` value of the containers `volumeMounts`:

{{% code_sample file="pods/image-volumes-subpath.yaml" %}}

1. Create the pod on your cluster:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/image-volumes-subpath.yaml
   ```

1. Attach to the container:

   ```shell
   kubectl attach -it image-volume bash
   ```

1. Check the content of the file from the `dir` sub path in the volume:

   ```shell
   cat /volume/file
   ```

   The output is similar to:

   ```none
   1
   ```
