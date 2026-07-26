--- 
layout: blog 
title: 'Kubernetes 1.20: Granular Control of Volume Permission Changes'
date: 2020-12-14 
slug: kubernetes-release-1.20-fsGroupChangePolicy-fsGroupPolicy
author: >
  Hemant Kumar (Red Hat),
  Christian Huffman (Red Hat)
---

Kubernetes 1.20 brings two important beta features, allowing Kubernetes admins and users alike to have more adequate control over how volume permissions are applied when a volume is mounted inside a Pod.

### Allow users to skip recursive permission changes on mount
Traditionally if your pod is running as a non-root user ([which you should](https://twitter.com/thockin/status/1333892204490735617)), you must specify a `fsGroup` inside the pod’s security context so that the volume can be readable and writable by the Pod. This requirement is covered in more detail in [here](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/).

But one side-effect of setting `fsGroup` is that, each time a volume is mounted, Kubernetes must recursively `chown()` and `chmod()` all the files and directories inside the volume - with a few exceptions noted below. This happens even if group ownership of the volume already matches the requested `fsGroup`, and can be pretty expensive for larger volumes with lots of small files, which causes pod startup to take a long time. This scenario has been a [known problem](https://github.com/kubernetes/kubernetes/issues/69699) for a while, and in Kubernetes 1.20 we are providing knobs to opt-out of recursive permission changes if the volume already has the correct permissions.

When configuring a pod’s security context, set `fsGroupChangePolicy` to "OnRootMismatch" so if the root of the volume already has the correct permissions, the recursive permission change can be skipped. Kubernetes ensures that permissions of the top-level directory are changed last the first time it applies permissions.

```yaml
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: "OnRootMismatch"
```
You can learn more about this in [Configure volume permission and ownership change policy for Pods](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods).

### Allow CSI Drivers to declare support for fsGroup based permissions

Although the previous section implied that Kubernetes _always_ recursively changes permissions of a volume if a Pod has a `fsGroup`, this is not strictly true. For certain multi-writer volume types, such as NFS or Gluster, the cluster doesn’t perform recursive permission changes even if the pod has a `fsGroup`. Other volume types may not even support `chown()`/`chmod()`, which rely on Unix-style permission control primitives. 

So how do we know when to apply recursive permission changes and when we shouldn't? For in-tree storage drivers, this was relatively simple. For [CSI](https://kubernetes-csi.github.io/docs/introduction.html#introduction) drivers that could span a multitude of platforms and storage types, this problem can be a bigger challenge.

Previously, whenever a CSI volume was mounted to a Pod, Kubernetes would attempt to automatically determine if the permissions and ownership should be modified. These methods were imprecise and could cause issues as we already mentioned, depending on the storage type.

The CSIDriver custom resource now has a `.spec.fsGroupPolicy` field, allowing storage drivers to explicitly opt in or out of these recursive modifications. By having the CSI driver specify a policy for the backing volumes, Kubernetes can avoid needless modification attempts. This optimization helps to reduce volume mount time and also cuts own reporting errors about modifications that would never succeed.

#### CSIDriver FSGroupPolicy API

Three FSGroupPolicy values are available as of Kubernetes 1.20, with more planned for future releases.

- **ReadWriteOnceWithFSType** - This is the default policy, applied if no `fsGroupPolicy` is defined; this preserves the behavior from previous Kubernetes releases. Each volume is examined at mount time to determine if permissions should be recursively applied.
- **File** - Always attempt to apply permission modifications, regardless of the filesystem type or PersistentVolumeClaim’s access mode.
- **None** - Never apply permission modifications.

#### How do I use it?
The only configuration needed is defining `fsGroupPolicy` inside of the `.spec` for a CSIDriver. Once that element is defined, any subsequently mounted volumes will automatically use the defined policy. There’s no additional deployment required!

#### What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push these implementations to GA in either 1.21 or 1.22. 

### How can I learn more?
This feature is explained in more detail in Kubernetes project documentation: [CSI Driver fsGroup Support](https://kubernetes-csi.github.io/docs/support-fsgroup.html) and [Configure volume permission and ownership change policy for Pods ](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods).

### How do I get involved?
The [Kubernetes Slack channel #csi](https://kubernetes.slack.com/messages/csi) and any of the [standard SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and the CSI team.

Those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage). We’re rapidly growing and always welcome new contributors.
