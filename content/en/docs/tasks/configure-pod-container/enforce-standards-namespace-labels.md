---
title: Enforce Pod Security Standards with Namespace Labels
reviewers:
- tallclair
- liggitt
content_type: task
weight: 250
---

Namespaces can be labeled to enforce the [Pod Security Standards](/docs/concepts/security/pod-security-standards). The three policies
[privileged](/docs/concepts/security/pod-security-standards/#privileged), [baseline](/docs/concepts/security/pod-security-standards/#baseline)
and [restricted](/docs/concepts/security/pod-security-standards/#restricted) broadly cover the security spectrum
and are implemented by the [Pod Security](/docs/concepts/security/pod-security-admission/) {{< glossary_tooltip
text="admission controller" term_id="admission-controller" >}}.

## {{% heading "prerequisites" %}}

Pod Security Admission was available by default in Kubernetes v1.23, as
a beta. From version 1.25 onwards, Pod Security Admission is generally
available.

{{% version-check %}}

## Requiring the `baseline` Pod Security Standard with namespace labels

This manifest defines a Namespace `my-baseline-namespace` that:

- _Blocks_ any pods that don't satisfy the `baseline` policy requirements.
- Generates a user-facing warning and adds an audit annotation to any created pod that does not
  meet the `restricted` policy requirements.
- Pins the versions of the `baseline` and `restricted` policies to v{{< skew currentVersion >}}.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-baseline-namespace
  labels:
    pod-security.kubernetes.io/enforce: baseline
    pod-security.kubernetes.io/enforce-version: v{{< skew currentVersion >}}

    # We are setting these to our _desired_ `enforce` level.
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: v{{< skew currentVersion >}}
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: v{{< skew currentVersion >}}
```

## Add labels to existing namespaces with `kubectl label`

{{< note >}}
When an `enforce` policy (or version) label is added or changed, the admission plugin will test
each pod in the namespace against the new policy. Violations are returned to the user as warnings.
{{< /note >}}

It is helpful to apply the `--dry-run` flag when initially evaluating security profile changes for
namespaces. The Pod Security Standard checks will still be run in _dry run_ mode, giving you
information about how the new policy would treat existing pods, without actually updating a policy.

```shell
kubectl label --dry-run=server --overwrite ns --all \
    pod-security.kubernetes.io/enforce=baseline
```

### Applying to all namespaces

If you're just getting started with the Pod Security Standards, a suitable first step would be to
configure all namespaces with audit annotations for a stricter level such as `baseline`:

```shell
kubectl label --overwrite ns --all \
  pod-security.kubernetes.io/audit=baseline \
  pod-security.kubernetes.io/warn=baseline
```

Note that this is not setting an enforce level, so that namespaces that haven't been explicitly
evaluated can be distinguished. You can list namespaces without an explicitly set enforce level
using this command:

```shell
kubectl get namespaces --selector='!pod-security.kubernetes.io/enforce'
```

### Applying to a single namespace

You can update a specific namespace as well. This command adds the `enforce=restricted`
policy to `my-existing-namespace`, pinning the restricted policy version to v{{< skew currentVersion >}}.

```shell
kubectl label --overwrite ns my-existing-namespace \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=v{{< skew currentVersion >}}
```
