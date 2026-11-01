---
layout: blog
title: 'Kubernetes 1.30: Read-only volume mounts can be finally literally read-only'
date: 2024-04-23
slug: recursive-read-only-mounts
author: >
  Akihiro Suda (NTT) 
---

Read-only volume mounts have been a feature of Kubernetes since the beginning.
Surprisingly, read-only mounts are not completely read-only under certain conditions on Linux.
As of the v1.30 release, they can be made completely read-only,
with alpha support for _recursive read-only mounts_.

## Read-only volume mounts are not really read-only by default

Volume mounts can be deceptively complicated.

You might expect that the following manifest makes everything under `/mnt` in the containers read-only:
```yaml
---
apiVersion: v1
kind: Pod
spec:
  volumes:
    - name: mnt
      hostPath:
        path: /mnt
  containers:
    - volumeMounts:
        - name: mnt
          mountPath: /mnt
          readOnly: true
```

However, any sub-mounts beneath `/mnt` may still be writable!
For example, consider that `/mnt/my-nfs-server` is writeable on the host.
Inside the container, writes to `/mnt/*` will be rejected but `/mnt/my-nfs-server/*` will still be writeable.

## New mount option: recursiveReadOnly

Kubernetes 1.30 added a new mount option `recursiveReadOnly` so as to make submounts recursively read-only.

The option can be enabled as follows:
{{< highlight yaml "linenos=false,hl_lines=14-17" >}}
---
apiVersion: v1
kind: Pod
spec:
  volumes:
    - name: mnt
      hostPath:
        path: /mnt
  containers:
    - volumeMounts:
        - name: mnt
          mountPath: /mnt
          readOnly: true
          # NEW
          # Possible values are `Enabled`, `IfPossible`, and `Disabled`.
          # Needs to be specified in conjunction with `readOnly: true`.
          recursiveReadOnly: Enabled
{{< /highlight >}}

This is implemented by applying the `MOUNT_ATTR_RDONLY` attribute with the `AT_RECURSIVE` flag
using [`mount_setattr(2)`](https://man7.org/linux/man-pages/man2/mount_setattr.2.html) added in
Linux kernel v5.12.

For backwards compatibility, the `recursiveReadOnly` field is not a replacement for `readOnly`,
but is used _in conjunction_ with it.
To get a properly recursive read-only mount, you must set both fields.

## Feature availability {#availability}

To enable `recursiveReadOnly` mounts, the following components have to be used:

* Kubernetes: v1.30 or later, with the `RecursiveReadOnlyMounts`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled.
  As of v1.30, the gate is marked as alpha.

* CRI runtime:
  * containerd: v2.0 or later

* OCI runtime:
  * runc: v1.1 or later
  * crun: v1.8.6 or later

* Linux kernel: v5.12 or later

## What's next?

Kubernetes SIG Node hope - and expect - that the feature will be promoted to beta and eventually
general availability (GA) in future releases of Kubernetes, so that users no longer need to enable
the feature gate manually.

The default value of `recursiveReadOnly` will still remain `Disabled`, for backwards compatibility.

## How can I learn more?

<!-- https://github.com/kubernetes/website/pull/45159 -->
Please check out the [documentation](/docs/concepts/storage/volumes/#read-only-mounts)
for the further details of `recursiveReadOnly` mounts.

## How to get involved?

This feature is driven by the SIG Node community. Please join us to connect with
the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
