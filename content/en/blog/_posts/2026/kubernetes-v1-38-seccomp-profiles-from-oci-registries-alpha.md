---
layout: blog
title: "Kubernetes v1.38: Seccomp profiles from OCI registries (alpha)"
draft: true
slug: kubernetes-v1-38-seccomp-profiles-from-oci-registries-alpha
author: >
  [Sascha Grunert](https://github.com/saschagrunert) (Red Hat)
---

A [seccomp](/docs/tutorials/security/seccomp/) profile restricts which system
calls a container can make. Kubernetes v1.38 lets a Pod pull its seccomp profile
from an OCI registry, the same way it pulls its container images. With the
alpha `SecurityProfileOCI`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/#SecurityProfileOCI)
enabled, you set the `type` of the
[`seccompProfile`](/docs/reference/kubernetes-api/core/pod-v1/#SeccompProfile)
to `OCI` and point `oci.ref` at a profile that you published to a registry. The
container runtime merges the pulled profile with a base profile on the node, so
a profile from a registry can make a workload stricter, but never looser.

The feature needs support in the container runtime. [CRI-O](https://cri-o.io/)
supports it starting with v1.38, and [containerd](https://containerd.io/)
support is in progress (see
[container runtime support](#container-runtime-support)).

## Why pull seccomp profiles from a registry?

A `Localhost` seccomp profile has to exist as a file on every node that might
run the Pod. Getting it there means baking it into the node image, copying it
with a privileged DaemonSet, or running the
[Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)
to sync it. In each case, the profile lives apart from the workload that needs
it. It ships on a different schedule than the application, and on a node that
misses the file, the container cannot start.

Registries already solve this problem for images. A profile in a registry sits
next to the application images, gets versioned, can be signed and mirrored with
the same tools, and is pulled with the same credentials. Because the reference
is pinned by digest, the Pod spec names exactly one profile, and that profile
changes only when you change the reference.

## How it works

A Pod or a container references the profile like this:

```yaml
securityContext:
  seccompProfile:
    type: OCI
    oci:
      ref: registry.example.com/profiles/app@sha256:<digest>
```

The `oci.ref` field must name the registry and be pinned by a `sha256`,
`sha384` or `sha512` digest. The API server rejects tags and references
without a registry.

Before the kubelet creates the Pod sandbox, it asks the container runtime to
pull every referenced profile through a new CRI call, `PullSecurityProfile`,
with the same credentials it uses for the Pod's images: image pull secrets, the
service account, and credential provider plugins. Profile pulls use a queue of
their own with the image puller's limits, so checking for a profile that is
already on the node never waits behind a large image download. The kubelet
records a `SecurityProfilePulled` event whenever it actually fetches a profile.

If a pull fails, the Pod stays `Pending` with a `SecurityProfilePullFailed`
event, and the kubelet retries with backoff, as for images. If the runtime
rejects the artifact, because it is not a seccomp profile, is too large or has
invalid content, retrying cannot help, and the Pod fails with the reason
`SecurityProfileRejected`. Once a Pod has started, the kubelet pulls a
container's profile again right before it creates the container, for example
on a restart. A failure then holds back only that container, and the rest of
the Pod keeps running.

The runtime does not load the pulled profile as is. It merges the profile with
a base profile by intersection: an operation is allowed only if both profiles
allow it. The base is the runtime's default seccomp profile, or a baseline that
the node administrator configured in the runtime. You can also set
`oci.baseProfile` to a `Localhost` profile on the node, which then takes the
place of the default, or to `RuntimeDefault` to select the default explicitly:

```yaml
securityContext:
  seccompProfile:
    type: OCI
    oci:
      ref: registry.example.com/profiles/app@sha256:<digest>
      baseProfile:
        type: Localhost
        localhostProfile: profiles/audit.json
```

CRI-O merges with the
[security-profiles-merger](https://github.com/kubernetes-sigs/security-profiles-merger)
library, which other runtimes can use as well, so that they agree on what the
effective profile is. CRI-O also logs a `SecurityProfileMergeConstrained`
warning that names what the base took away from the pulled profile.

The kubelet also cleans up. It removes pulled profiles that no Pod on the node
has referenced for longer than the
[`imageMaximumGCAge`](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)
of its configuration. As for images, the default of zero turns this off.

## Scheduling onto capable nodes

Not every node can pull seccomp profiles. A node declares the
`SecurityProfileOCI` feature through
[Node Declared Features](/docs/concepts/scheduling-eviction/node-declared-features/)
only when the feature gate is enabled on its kubelet and its container runtime
reports support. The scheduler places Pods that use `type: OCI` only on such
nodes. If no node qualifies, the Pod stays `Pending`.

A Pod bound to a node directly with `nodeName` skips the scheduler. A v1.38
kubelet rejects it if the node cannot run it: with the reason
`SecurityProfileOCIUnsupported` if the container runtime lacks support, or
`PodFeatureUnsupported` if the feature gate is off on that kubelet. Older
kubelets do not reject it (see [limitations](#limitations-of-the-alpha)).

## Trying it out

You need the `SecurityProfileOCI` feature gate enabled on the API server and on
the kubelet, and a container runtime that supports the feature (see
[container runtime support](#container-runtime-support)).

The Security Profiles Operator publishes test profiles on `registry.k8s.io`.
One of them denies `chmod` and allows everything else:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: deny-chmod
spec:
  restartPolicy: Never
  securityContext:
    seccompProfile:
      type: OCI
      oci:
        ref: registry.k8s.io/security-profiles-operator/seccomp-test-profiles@sha256:9b9d6cb98e5c58448c341628db6b20e7c4866abc53fbd5e1f5a938739b26fbe6
  containers:
  - name: test
    image: registry.k8s.io/e2e-test-images/busybox:1.37.0-2
    command:
    - sh
    - -c
    - touch /tmp/file && if chmod 600 /tmp/file; then echo allowed; else echo denied; fi
```

Once the Pod has completed, `kubectl logs deny-chmod` prints `denied`. If the
node did not have the profile yet, `kubectl events --for pod/deny-chmod` also
shows the `SecurityProfilePulled` event.

To publish a profile of your own, push it as an OCI artifact whose only layer is
the profile in the JSON format of the `linux.seccomp` section of the
[OCI runtime specification](https://github.com/opencontainers/runtime-spec/blob/main/config-linux.md#seccomp),
with the config media type `application/vnd.cncf.seccomp-profile.config.v1+json`.
With [ORAS](https://oras.land/), that looks like this:

```shell
oras push registry.example.com/profiles/app:v1 \
  --config /dev/null:application/vnd.cncf.seccomp-profile.config.v1+json \
  profile.json:application/json
```

ORAS prints the digest of the pushed artifact, which goes into `oci.ref`.
`spoc push` of the Security Profiles Operator produces the same format for a
profile in that JSON format.

## Limitations of the alpha

- Only seccomp profiles can be pulled. AppArmor follows later.
- References must be pinned by digest.
- Privileged containers cannot use `type: OCI`, because container runtimes do
  not apply seccomp profiles to them.
- Namespaces that enforce the `baseline` or `restricted`
  [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
  reject `type: OCI`.
- Do not bind Pods that use `type: OCI` to a node with a kubelet older than
  v1.38, for example with `nodeName`. Such a kubelet does not know the type and
  runs the containers without any seccomp profile, as `Unconfined`. The
  scheduler never places these Pods there, because such nodes do not declare
  the feature.
- A profile that is already on a node is available to every Pod on that node
  that references the same digest, without checking that Pod's credentials.
  Seccomp profiles are not secrets, and a pulled profile can only restrict a
  workload further, but if you rely on registry permissions to restrict who can
  use a profile, keep this in mind.

## Container runtime support {#container-runtime-support}

The feature needs the container runtime to implement the new CRI calls and to
report the `seccomp_profile_oci` runtime feature:

- CRI-O supports it starting with v1.38, implemented in
  [cri-o/cri-o#10382](https://github.com/cri-o/cri-o/pull/10382).
- containerd support is in progress in
  [containerd/containerd#14517](https://github.com/containerd/containerd/pull/14517),
  tracked in
  [containerd/containerd#13546](https://github.com/containerd/containerd/issues/13546).

## What's next?

The feature can go to beta in Kubernetes v1.41 at the earliest, because only
from then on does every supported kubelet version reject seccomp profile types
it does not know, instead of running such containers `Unconfined` (see
[limitations](#limitations-of-the-alpha)). For beta, SIG Node plans to add
AppArmor profiles, to check the credentials of every Pod that uses a profile
already on the node, and to let the `baseline` and `restricted` Pod Security
Standards accept `type: OCI`. More container runtimes supporting the feature
will help it get there.

## How can I learn more?

- [KEP-6061: OCI Artifact-Based Security Profile Distribution](https://www.kubernetes.dev/resources/keps/6061/)
- [Seccomp profiles from OCI registries](/docs/concepts/security/linux-kernel-security-constraints/#seccomp-oci)
- [Tutorial: create a Pod with a seccomp profile from an OCI registry](/docs/tutorials/security/seccomp/#seccomp-oci)

## Getting involved

This feature is driven by
[SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/),
which would like to hear from you if you try it out:

- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/a/kubernetes.io/g/sig-node)
- [KEP-6061](https://www.kubernetes.dev/resources/keps/6061/)
