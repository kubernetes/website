---
reviewers:
- tallclair
title: Securing Pods with the Pod Security Standards
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

Pod Security Standards enable cluster operators to restrict the permissions of pods in a clear, consistent fashion. They are the successor to [Pod Security Policies](/docs/concepts/policy/pod-security-policy), which will be removed from Kubernetes in v1.25.

<!-- body -->

## Getting Started

### Enabling the Alpha feature

Pod Security Standards are currently in Alpha and behind a [Feature Gate](/docs/reference/command-line-tools-reference/feature-gates/). This means they must be explicitly enabled before they can be used.

```shell
--feature-gates="...,PodSecurity=true"
```

### Configuring Namespaces

Once the feature is enabled, policies can then specified by adding labels to namespaces. These labels correspond to different _modes_, which determine how the admission controller will respond to violating pods.

| Mode | Description |
| ---- | ----------- |
| **`enforce`** | Policy violations will cause the pod to be rejected. |
| **`audit`** | Policy violations will trigger the addition of an audit annotation, but are otherwise allowed. |
| **`warn`** | Policy violations will trigger a user-facing warning, but are otherwise allowed. |

For each mode, there are two labels:

```yaml
# The per-mode level label indicates which policy level to apply for the mode.
#
# MODE must be one of `enforce`, `audit`, or `warn`.
# LEVEL must be one of `privileged`, `baseline`, or `restricted`.
pod-security.kubernetes.io/<MODE>: <LEVEL>

# Optional: per-mode version label that can be used to pin the policy to the
# version that shipped with a given Kubernetes minor version (e.g. v1.22).
#
# MODE must be one of `enforce`, `audit`, or `warn`.
# VERSION must be a valid Kubernetes version label.
pod-security.kubernetes.io/<MODE>-version: <VERSION>
```

Check out the [examples](/docs/concepts/security/securing-pods/#examples) to see example usage of these labels.

#### Configuring the Admission Controller

The PodSecurity Admission Controller can be statically configured to set defaults and [exemptions](/docs/concepts/security/securing-pods/#exemptions).

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    defaults:  # Defaults applied when a mode label is not set.
      enforce:         <default enforce policy level>
      enforce-version: <default enforce policy version>
      audit:           <default audit policy level>
      audit-version:   <default audit policy version>
      warn:            <default warn policy level>
      warn-version:    <default warn policy version>
    exemptions:
      usernames:         [ <array of authenticated usernames to exempt> ]
      runtimeClassNames: [ <array of runtime class names to exempt> ]
      namespaces:        [ <array of namespaces to exempt> ]
```

#### Configuring Pods

Different policy levels (e.g. `baseline`, `restricted`) have different requirements for [Security Context](/docs/tasks/configure-pod-container/security-context/) objects and other related fields. Check out the [Pod Security Standards](/docs/concepts/security/pod-security-standards) page for an in-depth look at those requirements.

## Exemptions

Exemptions permit the creation of pods that would have otherwise been prohibited due to the policy associated with a given namespace. Exemptions can be statically configured in the [Admission Controller configuration](/docs/concepts/security/securing-pods/#configuring-the-admission-controller).

Exemptions must be explicitly enumerated, and do not support indirection such as label or group selectors. Requests meeting exemption criteria are _ignored_ by the Admission Controller (all `enforce`, `audit` and `warn` behaviors), except to record an audit annotation. Exemption dimensions include:

- **Usernames:** requests from users with an exempt authenticated (or impersonated) username are ignored.
- **RuntimeClassNames:** pods and templated pods specifying an exempt runtime class name are ignored.
- **Namespaces:** pods and templated pods in an exempt namespace are ignored.

The username exemption is special in that the creating user is not persisted on the Pod object, and the Pod may be modified by different non-exempt users in the future. See the [Updates section of the Pod Security Standards KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/2579-psp-replacement#updates) for details on how non-exempt updates of a previously exempted pod are handled. Use cases for username exemptions include:

- Trusted controllers that create pods in tenant namespaces with additional 3rd party enforcement on the privileged pods.
- Break-glass operations roles, for example for debugging workloads in a restricted namespace.

## Webhook

To enable policy enforcement on older clusters, we provide a standalone webhook implementation that utilizes the same underlying library.

TODO: Update this as instructions for setting up webhook become more clear. [See related issue.](https://github.com/kubernetes/kubernetes/issues/103559)

## Best Practices

### Configure All Cluster Namespaces

Even if the initial configurations are most permissive (i.e. everything is `privileged`), any Namespaces that lack any configuration at all will become significant gaps in your cluster security model.

We provide an [example](/docs/concepts/security/securing-pods/#applying-to-all-namespaces) that illustrates how you can do this.

### Enforce the Principle of Least Privilege

In an ideal world, every pod in every namespace would meet the requirements of the `restricted` policy. However, this is not possible nor practical, as some workloads will require elevated privileges for legitimate reasons.

- Namespaces allowing `privileged` workloads should establish and enforce appropriate access controls.
- For workloads running in those permissive namespaces, maintain documentation about their unique security requirements. If at all possible, consider how those requirements could be further constrained.

### Adopt a Multi-Mode Strategy

The `audit` and `warn` modes of the Pod Security Standards admission controller make it easy to collect important security insights about your pods without breaking existing workloads.

It is good practice to enable these modes for all namespaces, except maybe for those that will _absolutely_ always require `privileged` access or those that enforce the `restricted` policy. Further, these modes should usually be set to policies at least one level higher than the policy for the `enforce` mode.

- Namespaces enforcing the `privileged` policy (i.e. no restrictions) should set audit and warn labels to `baseline`.
- Namespaces enforcing the `baseline` policy should set audit and warn labels to `restricted`.

Monitoring these annotations and warnings over time will help you identify workloads that can be migrated to namespaces with stricter policies.

## Examples

### Adding Labels in YAML

This YAML file creates a Namespace `my-secure-namespace` that:

- Blocks any pods that don't satisfy the `baseline` policy requirements.
- Generates a user-facing warning and adds an audit annotation to any created pod that does not meet the `restricted` policy requirements.
- Pins the versions of the `baseline` and `restricted` policies to v1.22.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-secure-namespace
  labels:
    pod-security.kubernetes.io/enforce: baseline
    pod-security.kubernetes.io/enforce-version: v1.22

    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: v1.22
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: v1.22
```

### Adding Labels to Existing Namespaces with `kubectl label`

{{< note >}}
When an `enforce` policy (or version) label is added or changed, the admission plugin will test each pod in the namespace against the new policy. Violations are returned to the user as warnings.
{{< /note >}}

#### Applying to All Namespaces

If you're just getting started with the Pod Security Standards, a suitable first step would be to configure all namespaces as `privileged` but set up audit annotations for a stricter level such as `baseline`:

```shell
kubectl label --overwrite ns --all \
  pod-security.kubernetes.io/enforce=privileged \
  pod-security.kubernetes.io/audit=baseline \
  pod-security.kubernetes.io/warn=baseline
```

#### Applying to a Single Namespace

You can update a specific namespace as well. This command adds the `enforce=restricted` policy to `my-existing-namespace`, pinning the restricted policy version to v1.22.

```shell
kubectl label --overwrite ns my-existing-namespace \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=v1.22
```

## Migrating from Pod Security Policies

Migrating to the replacement policy from PodSecurityPolicies can be done effectively using a combination of dry-run and `audit` and `warn` modes, although this becomes harder if mutating PSPs are used).

{{< note >}}
**We are working on tooling to automate this migration.** In the meantime, this guide should give you an idea of the general process.
{{< /note >}}

- [Enable the Pod Security Standards feature gate.](/docs/concepts/security/securing-pods#enabling-the-alpha-feature)
- **Temporarily set the default `enforce` mode to `privileged` for all Namespaces.** This can be done by [configuring the Admission Controller](/docs/concepts/security/securing-pods#configuring-the-admission-controller) or with [`kubectl label`](/docs/concepts/security/securing-pods#applying-to-all-namespaces).
- **Eliminate mutating Pod Security Policies, if your cluster has any set up.**
  - Clone all mutating PSPs into a non-mutating version.
  - Update all ClusterRoles authorizing use of those mutating PSPs to also authorize use of the non-mutating variant.
  - Watch for Pods using the mutating PSPs and work with code owners to migrate to valid, non-mutating resources.
  - Delete mutating PSPs.
- **Select a compatible policy level for each namespace.** Analyze existing resources in the namespace to drive this decision; strive for the `restricted` and `baseline` levels.
  - Review the requirements of the different [Pod Security Standards](/docs/concepts/security/pod-security-standards).
  - Evaluate the difference in privileges that would come from disabling the PSP controller.
- **Apply the selected profiles in `warn` and `audit` mode.** This will give you an idea of how your Pods will respond to the new policies, without breaking existing workloads. Iterate on your [Pods' configuration](/docs/concepts/security/securing-pods#configuring-pods) until they are in compliance with the selected profiles.
- Apply the profiles in enforce mode.
- Disable PodSecurityPolicy!

## FAQ

### Why were the Pod Security Policies deprecated?

There were numerous problems with Pod Security Policies, which led to the decision to deprecate them. The [KEP for Pod Security Standards](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/2579-psp-replacement#motivation) goes into these issues in more detail.

### When should I pin a policy version?

The Pod Security Standards will continue to evolve over time, even after the feature leaves the Alpha phase. This is because the details of the policies are based on current Pod hardening best practices, which must adapt to new threats as they arise.

**Pinning policies to specific versions will prevent you from detecting and enforcing protections against future threats.** _Only_ consider pinning versions if the default value `latest` would result in your workloads drifting toward less-restrictive configurations in ways that cannot be resolved.

If you find yourself in that situation, consider refactoring workloads to isolate privileged operations as much as possible.