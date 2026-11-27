---
layout: blog
title: 'Kubernetes v1.38 Sneak Peek'
date: 2026-11-23T08:00:00-08:00
slug: kubernetes-v1-38-sneak-peek
author: >
  Aaron Braundmeier,
  Arsh Sharma,
  Kirti Goyal,
  Omar Nasser,
  Sayan Chowdhury,
  Urvashi Choubey
---

As we get closer to the release date for Kubernetes v1.38, the project develops and matures,
features may be deprecated, removed, or replaced with better ones for the project's overall health.
This blog post outlines some of the planned changes for the Kubernetes v1.38 release that the
release team feels you should be aware of for the continued maintenance of your Kubernetes
environment and keeping up to date with the latest changes. The information listed below is based
on the current status of the v1.38 release and may change before the actual release date.

## Deprecations and removals for Kubernetes v1.38

### kubectl: WebSocket opt-out environment variables removed

`kubectl` has used WebSockets instead of SPDY by default for `kubectl exec`, `attach` and `cp` since
v1.30, and for `kubectl port-forward` since v1.31. The `KUBECTL_REMOTE_COMMAND_WEBSOCKETS` and
`KUBECTL_PORT_FORWARD_WEBSOCKETS` environment variables let you turn that behavior off. These
variables are going to be removed in v1.38. `kubectl` will then always try WebSockets first and fall
back to SPDY when it needs to (the same as the current default behavior). If your scripts or CI
environments set either of these environment variables, you can remove them since they will no
longer have any effect.

To learn more, refer to
[KEP-4006: Transition from SPDY to WebSockets](https://kubernetes.dev/resources/keps/4006).

### kubectl: `name` dropped from kuberc credential plugin allowlist entries

The `kuberc` file keeps kubectl user preferences separate from cluster credentials in the
kubeconfig, including an allowlist of the credential plugins `kubectl` is allowed to run. In the
beta `kubectl.config.k8s.io/v1beta1` API, an allowlist entry can use `name` as an alias for
`command`. The `name` field (not `command`) has been deprecated since v1.36.

With `kuberc` expected to graduate to stable in v1.38, the new `kubectl.config.k8s.io/v1` API will
not include `name`. If any of your allowlist entries use `name`, change them to `command` now.

To learn more, refer to
[KEP-3104: Separate kubectl user preferences from cluster configs](https://kubernetes.dev/resources/keps/3104).

## Ongoing major changes

### Future removal of cgroup v1 support {#cgroup-v1-support}

Support for cgroup v1 is being phased out. Since v1.35, the kubelet fails to start on nodes that use
cgroup v1 unless you set `failCgroupV1: false` in the kubelet configuration. This option remains
available in v1.38, but it should be treated as a short-term fix as support for cgroup v1 is planned
to be removed in a future release. If you haven't already, please plan your migration to
[cgroup v2](/docs/concepts/architecture/cgroups/).

To learn more, refer to
[KEP-5573: Remove cgroup v1 support](https://kubernetes.dev/resources/keps/5573).

### Admission webhooks no longer receive authentication and authorization review requests {#webhook-virtual-resources}

Since v1.37, the `ExcludeAdmissionWebhookVirtualResources` feature gate has been enabled by default.
With it on, validating and mutating admission webhooks no longer receive requests for (virtual)
writes to TokenReview, SelfSubjectReview, SubjectAccessReview, SelfSubjectAccessReview,
LocalSubjectAccessReview or SelfSubjectRulesReview. Creating or updating a webhook configuration
whose rules name one of these resources returns a deprecation warning, and the API server logs any
existing configurations that are affected when it starts.

If you rely on a webhook to see these requests, you can turn the feature gate off for now, but note
that the gate is planned to be locked on when the feature graduates to stable.

To learn more, refer to
[KEP-5793: Manifest Based Admission Control Config](https://kubernetes.dev/resources/keps/5793).

## Breaking changes in Kubernetes v1.38

### Container runtimes must report the cgroup driver {#cgroup-driver-from-cri}

The kubelet in v1.37 and older supported releases provides a legacy mechanism to configure the
cgroup driver. The modern way to do that is via the CRI `RuntimeConfig` RPC, which reports the
cgroup driver that the container runtime recommends using. In v1.38, the kubelet defaults to not
allowing the legacy configuration mechanism: it will be both deprecated and unavailable unless
explicitly re-activated. As a result, v1.38 nodes will essentially require that your container
runtime is running **before** the kubelet starts (to look up the expected cgroup driver); if the
kubelet can't get the cgroup driver from the runtime even after retrying, it will exit with an error
before even registering the node.

As part of this upcoming release, the `cgroupDriver` field in the kubelet configuration file will be
deprecated. Not only is specifying that field going to be deprecated, the kubelet will actually
reject it unless you reactivate the legacy mechanism by enabling the (temporary)
`LegacyCgroupDriverFallback` feature gate. The kubeadm tool will also no longer set `cgroupDriver`
to `systemd` by default, and its preflight checks will report an error if the runtime doesn't
support the RPC. If any of your nodes run an older, incompatible container runtime, you should
follow the instructions in the official v1.38 release notes about how to upgrade.

To learn more, refer to
[KEP-4033: Discover cgroup driver from CRI](https://kubernetes.dev/resources/keps/4033) and
[kubernetes/kubernetes#136731](https://github.com/kubernetes/kubernetes/pull/136731).

### Pod-level resources: swap behavior changes on `LimitedSwap` nodes {#pod-level-resources-swap}

If you use pod-level resources on Linux nodes that use cgroup v2 and are configured with
`LimitedSwap`, the kubelet in v1.38 will start applying swap limits based on the Pod's pod-level
memory settings. This means that Pods whose pod-level memory request equals their memory limit will
get no swap at all (both for the Pod and for every container in it), even if a container sets a
memory request lower than its limit. Check any workloads that rely on swap before you upgrade, and
be sure to read the official release notes for v1.38 for detailed advice.

To learn more, refer to
[KEP-2837: Pod Level Resource Specifications](https://kubernetes.dev/resources/keps/2837).

## Featured enhancements of Kubernetes v1.38

The following list of enhancements is likely to be included in the upcoming v1.38 release. This is
not a commitment and the release content is subject to change.

### kubectl user preferences (kuberc) graduating to stable {#kuberc}

kuberc, the separate kubectl configuration file for user preferences such as aliases, default
options and a credential plugin policy, is expected to graduate to stable in v1.38.

To learn more, read [Kubectl user preferences (kuberc)](/docs/reference/kubectl/kuberc/) or refer to
[KEP-3104: Separate kubectl user preferences from cluster configs](https://kubernetes.dev/resources/keps/3104).

### Pod-level resources graduating to stable {#pod-level-resources}

Pod-level resources, which let you set CPU, memory and hugepages requests and limits for a Pod as a
whole, are expected to graduate to stable in v1.38. If you run Linux nodes with `LimitedSwap`, see
the [swap behavior change](#pod-level-resources-swap) above before you upgrade.

To learn more, read
[Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
or refer to
[KEP-2837: Pod Level Resource Specifications](https://kubernetes.dev/resources/keps/2837).

### DRA support for partitionable devices graduating to stable {#dra-partitionable-devices}

Partitionable devices let a
[Dynamic Resource Allocation](/docs/concepts/resource-management/dynamic-resource-allocation/) (DRA)
driver advertise a device such as a GPU both as a whole and as smaller partitions, and the scheduler
allocates only combinations that fit within the physical device. The feature is expected to
graduate to stable in v1.38, and the `DRAPartitionableDevices` feature gate will then be locked on.

To learn more, read
[Partitionable devices](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)
or refer to
[KEP-4815: DRA: Add support for partitionable devices](https://kubernetes.dev/resources/keps/4815).

### EvictionRequest API (alpha) {#eviction-request-api}

Evicting a Pod isn’t always as simple as terminating it. Some applications may be in the middle of
important work, such as data migration or cleanup, and terminating them without giving them time to
prepare can cause disruptions.

The EvictionRequest API introduces a more coordinated way to evict Pods. It gives applications and
controllers time to prepare before a Pod is evicted. For example, when a node needs to be drained or
a Pod needs to be moved to another node, a controller can create an EvictionRequest to signal that
this Pod needs to be evicted.

The eviction request controller coordinates with the responders configured for the Pod. These
responders can perform application-specific tasks such as completing ongoing work, cleaning up
resources, or migrating data before the Pod is terminated.

If no custom responder is available or responders don't complete the process, Kubernetes can fall
back to the existing API-initiated eviction mechanism, which continues to respect
PodDisruptionBudgets (PDBs). The EvictionRequest API does not replace PDBs. It gives applications a
chance to participate in the eviction process.

As this is an alpha feature, you will need to enable the `EvictionRequestAPI` feature gate **and**
the relevant alpha API group. Check the v1.38 release notes and documentation, once they're
available, to confirm exactly what's required.

To learn more, refer to [KEP-4563: EvictionRequest API](https://kubernetes.dev/resources/keps/4563).

## Want to know more?

New features and deprecations are also announced in the Kubernetes release notes. We will formally
announce what's new in [Kubernetes v1.38](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.38.md)
as part of the CHANGELOG for that release.

The Kubernetes v1.38 release is planned for **Wednesday, December 16th, 2026**. Stay tuned for updates!

You can see the announcements of changes in the release notes for:

- [Kubernetes v1.37](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.37.md)
- [Kubernetes v1.36](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md)
- [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md)

## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many
[Special Interest Groups](https://kubernetes.dev/community/community-groups/sigs/) (SIGs) that align
with your interests.

If you don't know where to start, join our monthly
[New Contributor Orientations](https://www.kubernetes.dev/docs/orientation/) where we teach the
community how the project is structured, and we'll guide you on how to make your first contribution
to the project.

- Read more on how to become a [Kubernetes Contributor](https://www.kubernetes.dev/docs/guide/)
- Read more about what’s happening with Kubernetes on our [blog](https://kubernetes.io/blog/)
- Join us on [Slack](https://slack.k8s.io/)
- Follow us on [X](https://x.com/kubernetesio)
- Follow us on [LinkedIn](https://www.linkedin.com/company/kubernetes/)
- Follow us on [Bluesky](https://bsky.app/profile/kubernetes.io) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Post questions (or answer questions) on
  [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
- Share your [Kubernetes End User Story](https://www.cncf.io/case-studies/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
