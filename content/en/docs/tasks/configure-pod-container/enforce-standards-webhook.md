---
title: Enforce Pod Security Standards by Configuring the Pod Security Admission Webhook
reviewers:
- tallclair
- liggitt
content_type: task
min-kubernetes-server-version: v1.22
---

To enable the enforcement of the 
[Pod Security Standards](/docs/concepts/security/pod-security-standards) in environments
where the [built-in Admission Controller](/docs/reference/access-authn-authz/admission-controllers/#podsecurity) cannot be used, SIG Auth provides a [Validating Admission Webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/) that provides identical behavior.

<!-- As of v1.22, Kubernetes provides a built-in [admission controller](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
to enforce the [Pod Security Standards](/docs/concepts/security/pod-security-standards).
You can configure this admission controller to set cluster-wide defaults and [exemptions](/docs/concepts/security/pod-security-admission/#exemptions). -->

## {{% heading "prerequisites" %}}

{{% version-check %}}

- Enable the `PodSecurity` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features).

## Configure the Admission Webhook

When starting the webhook, you must provide a config file that determines how to validate incoming resources.

```yaml
apiVersion: pod-security.admission.config.k8s.io/v1alpha1
kind: PodSecurityConfiguration
# Defaults applied when a mode label is not set.
#
# Level label values must be one of:
# - "privileged" (default)
# - "baseline"
# - "restricted"
#
# Version label values must be one of:
# - "latest" (default) 
# - specific version like "v{{< skew latestVersion >}}"
defaults:
    enforce: "privileged"
    enforce-version: "latest"
    audit: "privileged"
    audit-version: "latest"
    warn: "privileged"
    warn-version: "latest"
exemptions:
    # Array of authenticated usernames to exempt.
    usernames: []
    # Array of runtime class names to exempt.
    runtimeClassNames: []
    # Array of namespaces to exempt.
    namespaces: []
```