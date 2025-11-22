---
layout: blog
title: 'Kubernetes v1.35: Fine-grained SupplementalGroups Control Graduates to GA'
date: XXXX-XX-XX
draft: true
slug: kubernetes-v1-35-fine-grained-supplementalgroups-control-ga
author: >
  Shingo Omura (LY Corporation)

---

Announcing graduation to General Availability (GA) - Fine-grained SupplementalGroups Control in Kubernetes v1.35!

The new field, `supplementalGroupsPolicy`, was introduced as an opt-in alpha feature for Kubernetes v1.31, and then had graduated to beta in v1.33; Now, the corresponding feature gate (`SupplementalGroupsPolicy`) is now GA. This feature enables to implement more precise control over supplemental groups in containers that can strengthen the security posture, particularly in accessing volumes. Moreover, it also enhances the transparency of UID/GID details in containers, offering improved security oversight.

If you upgrade from v1.32 or before, please be aware that some behavioral breaking change introduced since beta (v1.33). See [The behavioral changes introduced in beta](https://kubernetes.io/blog/2025/05/06/kubernetes-v1-33-fine-grained-supplementalgroups-control-beta/#the-behavioral-changes-introduced-in-beta) and [Upgrade Considerations](https://kubernetes.io/blog/2025/05/06/kubernetes-v1-33-fine-grained-supplementalgroups-control-beta/#upgrade-consideration) sections in [the previous blog for beta release](https://kubernetes.io/blog/2025/05/06/kubernetes-v1-33-fine-grained-supplementalgroups-control-beta/) for details.

## Motivation: Implicit group memberships defined in `/etc/group` in the container image

Although the majority of Kubernetes cluster admins/users may not be aware, kubernetes, by default, _merges_ group information from the Pod with information defined in `/etc/group` in the container image.

Let's see an example, below Pod manifest specifies `runAsUser=1000`, `runAsGroup=3000` and `supplementalGroups=4000` in the Pod's security context.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: implicit-groups
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    supplementalGroups: [4000]
  containers:
  - name: ctr
    image: registry.k8s.io/e2e-test-images/agnhost:2.45
    command: [ "sh", "-c", "sleep 1h" ]
    securityContext:
      allowPrivilegeEscalation: false
```

What is the result of `id` command in the `ctr` container? The output should be similar to this:

```none
uid=1000 gid=3000 groups=3000,4000,50000
```

Where does group ID `50000` in supplementary groups (`groups` field) come from, even though `50000` is not defined in the Pod's manifest at all? The answer is `/etc/group` file in the container image.

Checking the contents of `/etc/group` in the container image should show below:

```none
user-defined-in-image:x:1000:
group-defined-in-image:x:50000:user-defined-in-image
```

This shows that the container's primary user `1000` belongs to the group `50000` in the last entry.

Thus, the group membership defined in `/etc/group` in the container image for the container's primary user is _implicitly_ merged to the information from the Pod. Please note that this was a design decision the current CRI implementations inherited from Docker, and the community never really reconsidered it until now.

### What's wrong with it?

The _implicitly_ merged group information from `/etc/group` in the container image poses a security risk. These implicit GIDs can't be detected or validated by policy engines because there's no record of them in the Pod manifest. This can lead to unexpected access control issues, particularly when accessing volumes (see [kubernetes/kubernetes#112879](https://issue.k8s.io/112879) for details) because file permission is controlled by UID/GIDs in Linux.

## Fine-grained supplemental groups control in a Pod: `supplementaryGroupsPolicy`

To tackle the above problem, Pod's `.spec.securityContext` now includes `supplementalGroupsPolicy` field.

This field lets you control how Kubernetes calculates the supplementary groups for container processes within a Pod. The available policies are:

* _Merge_: The group membership defined in `/etc/group` for the container's primary user will be merged. If not specified, this policy will be applied (i.e. as-is behavior for backward compatibility).

* _Strict_: Only the group IDs specified in `fsGroup`, `supplementalGroups`, or `runAsGroup` are attached as supplementary groups to the container processes. Group memberships defined in `/etc/group` for the container's primary user are ignored.

Let's see how `Strict` policy works. Below Pod manifest specifies `supplementalGroupsPolicy: Strict`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: strict-supplementalgroups-policy
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    supplementalGroups: [4000]
    supplementalGroupsPolicy: Strict
  containers:
  - name: ctr
    image: registry.k8s.io/e2e-test-images/agnhost:2.45
    command: [ "sh", "-c", "sleep 1h" ]
    securityContext:
      allowPrivilegeEscalation: false
```

The result of `id` command in the `ctr` container should be similar to this:

```none
uid=1000 gid=3000 groups=3000,4000
```

You can see `Strict` policy can exclude group `50000` from `groups`! 

Thus, ensuring `supplementalGroupsPolicy: Strict` (enforced by some policy mechanism) helps prevent the implicit supplementary groups in a Pod.

{{<note>}}
A container with sufficient privileges can change its process identity. The `supplementalGroupsPolicy` only affect the initial process identity. See the following section for details.
{{</note>}}

## Attached process identity in Pod status

This feature also exposes the process identity attached to the first container process of the container
via `.status.containerStatuses[].user.linux` field. It would be helpful to see if implicit group IDs are attached.

```yaml
...
status:
  containerStatuses:
  - name: ctr
    user:
      linux:
        gid: 3000
        supplementalGroups:
        - 3000
        - 4000
        uid: 1000
...
```

{{<note>}}
Please note that the values in `status.containerStatuses[].user.linux` field is _the firstly attached_
process identity to the first container process in the container. If the container has sufficient privilege
to call system calls related to process identity (e.g. [`setuid(2)`](https://man7.org/linux/man-pages/man2/setuid.2.html), [`setgid(2)`](https://man7.org/linux/man-pages/man2/setgid.2.html) or [`setgroups(2)`](https://man7.org/linux/man-pages/man2/setgroups.2.html), etc.), the container process can change its identity. Thus, the _actual_ process identity will be dynamic.
{{</note>}}

## `Strict` Policy requires newer CRI versions

Actually, CRI runtime (e.g. containerd, CRI-O) plays a core role for calculating supplementary group ids to be attached to the containers. Thus, `SupplementalGroupsPolicy=Strict` requires a CRI runtime that support this feature (`SupplementalGroupsPolicy: Merge` can work with the CRI runtime which does not support this feature because this policy is fully backward compatible policy).

Here are some CRI runtimes that support this feature, and the versions you need
to be running:

- containerd: v2.0 or later
- CRI-O: v1.31 or later

And, you can see if the feature is supported in the Node's `.status.features.supplementalGroupsPolicy` field.

```yaml
apiVersion: v1
kind: Node
...
status:
  features:
    supplementalGroupsPolicy: true
```

## Getting involved

This feature is driven by the [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) community.
Please join us to connect with the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!

## How can I learn more?

<!-- https://github.com/kubernetes/website/pull/46920 -->
- [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/)
for the further details of `supplementalGroupsPolicy`
- [KEP-3619: Fine-grained SupplementalGroups control](https://github.com/kubernetes/enhancements/issues/3619)
