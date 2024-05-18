---
layout: blog
title: "Kubernetes 1.26: Support for Passing Pod fsGroup to CSI Drivers At Mount Time"
date: 2022-12-23
slug: kubernetes-12-06-fsgroup-on-mount
author: >
  Fabio Bertinatto (Red Hat),
  Hemant Kumar (Red Hat)
---

Delegation of `fsGroup` to CSI drivers was first introduced as alpha in Kubernetes 1.22,
and graduated to beta in Kubernetes 1.25.
For Kubernetes 1.26, we are happy to announce that this feature has graduated to
General Availability (GA). 

In this release, if you specify a `fsGroup` in the
[security context](/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod),
for a (Linux) Pod, all processes in the pod's containers are part of the additional group
that you specified.

In previous Kubernetes releases, the kubelet would *always* apply the
`fsGroup` ownership and permission changes to files in the volume according to the policy
you specified in the Pod's `.spec.securityContext.fsGroupChangePolicy` field.

Starting with Kubernetes 1.26, CSI drivers have the option to apply the `fsGroup` settings during 
volume mount time, which frees the kubelet from changing the permissions of files and directories
in those volumes.

## How does it work?

CSI drivers that support this feature should advertise the
[`VOLUME_MOUNT_GROUP`](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetcapabilities) node capability.

After recognizing this information, the kubelet passes the `fsGroup` information to
the CSI driver during pod startup. This is done through the
[`NodeStageVolumeRequest`](https://github.com/container-storage-interface/spec/blob/v1.7.0/spec.md#nodestagevolume) and
[`NodePublishVolumeRequest`](https://github.com/container-storage-interface/spec/blob/v1.7.0/spec.md#nodepublishvolume)
CSI calls.

Consequently, the CSI driver is expected to apply the `fsGroup` to the files in the volume using a
_mount option_. As an example, [Azure File CSIDriver](https://github.com/kubernetes-sigs/azurefile-csi-driver) utilizes the `gid` mount option to map
the `fsGroup` information to all the files in the volume.

It should be noted that in the example above the kubelet refrains from directly
applying the permission changes into the files and directories in that volume files. 
Additionally, two policy definitions no longer have an effect: neither
`.spec.fsGroupPolicy` for the CSIDriver object, nor
`.spec.securityContext.fsGroupChangePolicy` for the Pod.

For more details about the inner workings of this feature, check out the
[enhancement proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/2317-fsgroup-on-mount/)
and the [CSI Driver `fsGroup` Support](https://kubernetes-csi.github.io/docs/support-fsgroup.html)
in the CSI developer documentation.

## Why is it important?

Without this feature, applying the fsGroup information to files is not possible in certain storage environments.

For instance, Azure File does not support a concept of POSIX-style ownership and permissions
of files. The CSI driver is only able to set the file permissions at the volume level.

## How do I use it?

This feature should be mostly transparent to users. If you maintain a CSI driver that should
support this feature, read
[CSI Driver `fsGroup` Support](https://kubernetes-csi.github.io/docs/support-fsgroup.html)
for more information on how to support this feature in your CSI driver.

Existing CSI drivers that do not support this feature will continue to work as usual:
they will not receive any `fsGroup` information from the kubelet. In addition to that,
the kubelet will continue to perform the ownership and permissions changes to files
for those volumes, according to the policies specified in `.spec.fsGroupPolicy` for the
CSIDriver and `.spec.securityContext.fsGroupChangePolicy` for the relevant Pod.
