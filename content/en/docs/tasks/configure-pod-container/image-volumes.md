---
title: Use an Image Volume With a Pod
reviewers:
content_type: task
weight: 210
min-kubernetes-server-version: v1.31
---

<!-- overview -->

{{< feature-state feature_gate_name="ImageVolume" >}}

This page shows how to configure a pod using image volumes. This allows you to
mount content from OCI registries inside containers.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

- The container runtime needs to support the image volumes feature
- You need to exec commands in the host
- You need to be able to exec into pods
- You need to enable the `ImageVolume` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)

<!-- steps -->

## Run a Pod that uses an image volume {#create-pod}

An image volume for a pod is enabled setting the `volumes.[*].image` field of `.spec`
to a valid reference and consuming it in the `volumeMounts` of the container. For example:

{{% code_sample file="pods/image-volumes.yaml" %}}

1. Create the pod on your cluster:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/image-volumes.yaml
   ```

1. Attach to the container:

   ```shell
   kubectl attach -it image-volume bash
   ```

Run this command:

```shell
cat /volume/dir/file
```

The output is similar to:

```shell
1
```

Also run:

```shell
cat /volume/file
```

The output is similar to:

```shell
2
```

## Further reading

- [`image` volumes](/docs/concepts/storage/volumes/#image)
