---
layout: blog
title: 'Kubernetes 1.31: Fine-grained SupplementalGroups control'
date: 2024-08-22
slug: fine-grained-supplementalgroups-control
author: >
  Shingo Omura (Woven By Toyota)

---

This blog discusses a new feature in Kubernetes 1.31 to improve the handling of supplementary groups in containers within Pods.


## Motivation: Implicit group memberships defined in `/etc/group` in the container image

Although this behavior may not be popular with many Kubernetes cluster users/admins, kubernetes, by default, _merges_ group information from the Pod with information defined in `/etc/group` in the container image.

Let's see an example, below Pod specifies `runAsUser=1000`, `runAsGroup=3000` and `supplementalGroups=4000` in the Pod's security context.

{{% code_sample file="implicit-groups.yaml" %}}

What is the result of `id` command in the `ctr` container?

```console
# Create the Pod:
$ kubectl apply -f https://k8s.io/blog/2024-08-22-Fine-grained-SupplementalGroups-control/implicit-groups.yaml

# Verify that the Pod's Container is running:
$ kubectl get pod implicit-groups

# Check the id command
$ kubectl exec implicit-groups -- id
```

Then, output should be similar to this:

```none
uid=1000 gid=3000 groups=3000,4000,50000
```

Where does group ID `50000` in supplementary groups (`groups` field) come from, even though `50000` is not defined in the Pod's manifest at all? The answer is `/etc/group` file in the container image.

Checking the contents of `/etc/group` in the container image should show below:

```console
$ kubectl exec implicit-groups -- cat /etc/group
...
user-defined-in-image:x:1000:
group-defined-in-image:x:50000:user-defined-in-image
```

Aha! The container's primary user `1000` belongs to the group `50000` in the last entry.

Thus, the group membership defined in `/etc/group` in the container image for the container's primary user is _implicitly_ merged to the information from the Pod. Please note that this was a design decision the current CRI implementations inherited from Docker, and the community never really reconsidered it until now.

### What's wrong with it?

The _implicitly_ merged group information from `/etc/group` in the container image may cause some concerns particularly in accessing volumes (see [kubernetes/kubernetes#112879](https://issue.k8s.io/112879) for details) because file permission is controlled by uid/gid in Linux. Even worse, the implicit gids from `/etc/group` can not be detected/validated by any policy engines because there is no clue for the implicit group information in the manifest. This can also be a concern for Kubernetes security.

## Fine-grained SupplementalGroups control in a Pod: `SupplementaryGroupsPolicy`

To tackle the above problem, Kubernetes 1.31 introduces new field `supplementalGroupsPolicy` in Pod's `.spec.securityContext`.

This field provies a way to control how to calculate supplementary groups for the container processes in a Pod. The available policy is below:

* _Merge_: The group membership defined in `/etc/group` for the container's primary user will be merged. If not specified, this policy will be applied (i.e. as-is behavior for backword compatibility).

* _Strict_: it only attaches specified group IDs in `fsGroup`, `supplementalGroups`, or `runAsGroup` fields as the supplementary groups of the container processes. This means no group membership defined in `/etc/group` for the container's primary user will be merged.

Let's see how `Strict` policy works.

{{% code_sample file="strict-supplementalgroups-policy.yaml" %}}

```console
# Create the Pod:
$ kubectl apply -f https://k8s.io/blog/2024-08-22-Fine-grained-SupplementalGroups-control/strict-supplementalgroups-policy.yaml

# Verify that the Pod's Container is running:
$ kubectl get pod strict-supplementalgroups-policy

# Check the process identity:
kubectl exec -it strict-supplementalgroups-policy -- id
```

The output should be similar to this:

```none
uid=1000 gid=3000 groups=3000,4000
```

You can see `Strict` policy can exclude group `50000` from `groups`! 

Thus, ensuring `supplementalGroupsPolicy: Strict` (enforced by some policy mechanism) helps prevent the implicit supplementary groups in a Pod.

{{<note>}}
Actually, this is not enough because container with sufficient privileges / capability can change its process identity. Please see the following section for details.
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

## Feature availability

To enable `supplementalGroupsPolicy` field, the following components have to be used:

- Kubernetes: v1.31 or later, with the `SupplementalGroupsPolicy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled. As of v1.31, the gate is marked as alpha.
- CRI runtime:
  - containerd: v2.0 or later
  - CRI-O: v1.31 or later

You can see if the feature is supported in the Node's `.status.features.supplementalGroupsPolicy` field.

```yaml
apiVersion: v1
kind: Node
...
status:
  features:
    supplementalGroupsPolicy: true
```

## What's next?

Kubernetes SIG Node hope - and expect - that the feature will be promoted to beta and eventually
general availability (GA) in future releases of Kubernetes, so that users no longer need to enable
the feature gate manually.

`Merge` policy is applied when `supplementalGroupsPolicy` is not specified, for backwards compatibility.

## How can I learn more?

<!-- https://github.com/kubernetes/website/pull/46920 -->
- [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/)
for the further details of `supplementalGroupsPolicy`
- [KEP-3619: Fine-grained SupplementalGroups control](https://github.com/kubernetes/enhancements/issues/3619)

## How to get involved?

This feature is driven by the SIG Node community. Please join us to connect with
the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
