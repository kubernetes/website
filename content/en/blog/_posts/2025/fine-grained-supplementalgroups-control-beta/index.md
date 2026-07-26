---
layout: blog
title: 'Kubernetes v1.33: Fine-grained SupplementalGroups Control Graduates to Beta'
date: 2025-05-06T10:30:00-08:00
slug: kubernetes-v1-33-fine-grained-supplementalgroups-control-beta
author: >
  Shingo Omura (LY Corporation)

---

The new field, `supplementalGroupsPolicy`, was introduced as an opt-in alpha feature for Kubernetes v1.31 and has graduated to beta in v1.33; the corresponding feature gate (`SupplementalGroupsPolicy`) is now enabled by default. This feature enables to implement more precise control over supplemental groups in containers that can strengthen the security posture, particularly in accessing volumes. Moreover, it also enhances the transparency of UID/GID details in containers, offering improved security oversight.

Please be aware that this beta release contains some behavioral breaking change. See [The Behavioral Changes Introduced In Beta](#the-behavioral-changes-introduced-in-beta) and [Upgrade Considerations](#upgrade-consideration) sections for details.

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

## The behavioral changes introduced in beta

In the alpha release, when a Pod with `supplementalGroupsPolicy: Strict` was scheduled to a node that did not support the feature (i.e., `.status.features.supplementalGroupsPolicy=false`), the Pod's supplemental groups policy silently fell back to `Merge`.

In v1.33, this has entered beta to enforce the policy more strictly, where kubelet rejects pods whose nodes cannot ensure the specified policy. If your pod is rejected, you will see warning events with `reason=SupplementalGroupsPolicyNotSupported` like below:

```yaml
apiVersion: v1
kind: Event
...
type: Warning
reason: SupplementalGroupsPolicyNotSupported
message: "SupplementalGroupsPolicy=Strict is not supported in this node"
involvedObject:
  apiVersion: v1
  kind: Pod
  ...
```

## Upgrade consideration

If you're already using this feature, especially the `supplementalGroupsPolicy: Strict` policy, we assume that your cluster's CRI runtimes already support this feature. In that case, you don't need to worry about the pod rejections described above.

However, if your cluster:

- uses the `supplementalGroupsPolicy: Strict` policy, but
- its CRI runtimes do NOT yet support the feature (i.e., `.status.features.supplementalGroupsPolicy=false`),

you need to prepare the behavioral changes (pod rejection) when upgrading your cluster.

We recommend several ways to avoid unexpected pod rejections:

- Upgrading your cluster's CRI runtimes together with kubernetes or before the upgrade
- Putting some label to your nodes describing CRI runtime supports this feature or not and also putting label selector to pods with `Strict` policy to select such nodes (but, you will need to monitor the number of `Pending` pods in this case instead of pod rejections).

## Getting involved

This feature is driven by the [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) community.
Please join us to connect with the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!

## How can I learn more?

<!-- https://github.com/kubernetes/website/pull/46920 -->
- [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/)
for the further details of `supplementalGroupsPolicy`
- [KEP-3619: Fine-grained SupplementalGroups control](https://github.com/kubernetes/enhancements/issues/3619)

