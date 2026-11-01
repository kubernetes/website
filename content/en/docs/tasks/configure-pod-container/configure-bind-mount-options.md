---
title: Set Bind Mount Options on Volume Mounts
content_type: task
weight: 216
min-kubernetes-server-version: v1.37
---

<!-- overview -->

{{< feature-state feature_gate_name="VolumeBindMountOptions" >}}

This page shows how to apply security-related bind mount options (`noexec`,
`nodev`, `nosuid`) to volume mounts in a Pod.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

You need to have the `VolumeBindMountOptions`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled
on the API server **and** the kubelet. The container runtime must also support
the `mount_options` field in the CRI `Mount` message.

<!-- steps -->

## Create a Pod with bind mount options {#create-pod}

The `.spec.containers[*].volumeMounts[*].bindMountOptions` field accepts a list of bind mount flags.
The allowed values are `noexec`, `nodev`, and `nosuid`.

For example, to mount an emptyDir volume at `/tmp` with `noexec` and `nosuid`
so that binaries cannot be executed and set-user-ID bits are ignored:

{{% code_sample file="pods/bind-mount-options.yaml" %}}

1. Create the pod on your cluster:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/bind-mount-options.yaml
   ```

1. Verify the pod is running:

   ```shell
   kubectl get pod bind-mount-options-demo
   ```

1. Check the mount options on the volume:

   ```shell
   kubectl exec bind-mount-options-demo -- mount | grep /tmp
   ```

   The output should include `noexec` and `nosuid` in the mount options.

1. Verify that executing a binary on the mount fails:

   ```shell
   kubectl exec bind-mount-options-demo -- sh -c 'cp /bin/ls /tmp/ls && /tmp/ls'
   ```

   The output is similar to:

   ```none
   sh: /tmp/ls: Permission denied
   ```

1. Delete the Pod that you created for this exercise:

   ```shell
   kubectl delete pod bind-mount-options-demo
   ```

## {{% heading "whatsnext" %}}

- Learn more about [bind mount options](/docs/concepts/storage/volumes/#bind-mount-options) for volumes
