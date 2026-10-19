---
title: Set Permissions on an emptyDir Volume
content_type: task
weight: 215
min-kubernetes-server-version: v1.37
---

<!-- overview -->

{{< feature-state feature_gate_name="EmptyDirVolumeMode" >}}

This page shows how to set Unix permission bits on an `emptyDir` volume directory
using the `mode` field.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

You need to have the `EmptyDirVolumeMode`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled
on the API server **and** the kubelet.

<!-- steps -->

## Create a Pod that uses an emptyDir volume with custom permissions {#create-pod}

The `emptyDir.mode` field lets you set Unix permission bits (from `0000` to `01777` in octal)
on the volume directory. If not specified, the directory is created with the default `0777`
permissions.

For example, to create a shared `/tmp` directory with the sticky bit set so that only file
owners can delete their own files:

{{% code_sample file="pods/emptydir-volume-mode.yaml" %}}

1. Create the pod on your cluster:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/emptydir-volume-mode.yaml
   ```

1. Verify the pod is running:

   ```shell
   kubectl get pod emptydir-mode-demo
   ```

1. Check the permissions on the mounted volume:

   ```shell
   kubectl exec emptydir-mode-demo -- ls -ld /tmp
   ```

   The output is similar to:

   ```none
   drwxrwxrwt 2 root root 4096 Jul 28 00:00 /tmp
   ```

   The `t` at the end confirms the sticky bit is set.

1. Delete the Pod that you created for this exercise:

   ```shell
   kubectl delete pod emptydir-mode-demo
   ```

## {{% heading "whatsnext" %}}

- Learn more about [`emptyDir` volumes](/docs/concepts/storage/volumes/#emptydir)
