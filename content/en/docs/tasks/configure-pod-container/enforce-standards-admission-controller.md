---
title: Enforce Pod Security Standards by Configuring the Built-in Admission Controller
reviewers:
- tallclair
- liggitt
content_type: task
min-kubernetes-server-version: v1.22
---

As of v1.22, Kubernetes provides a built-in [admission controller](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
to enforce the [Pod Security Standards](/docs/concepts/security/pod-security-standards).
You can configure this admission controller to set cluster-wide defaults and [exemptions](/docs/concepts/security/pod-security-admission/#exemptions).

## {{% heading "prerequisites" %}}

{{% version-check %}}

- Ensure the `PodSecurity` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) is enabled.

## Configure the Admission Controller

{{< tabs name="PodSecurityConfiguration_example_1" >}}
{{% tab name="pod-security.admission.config.k8s.io/v1beta1" %}}
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1beta1
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
    # - specific version like "v{{< skew currentVersion >}}"
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
      runtimeClasses: []
      # Array of namespaces to exempt.
      namespaces: []
```

{{< note >}}
v1beta1 configuration requires v1.23+. For v1.22, use v1alpha1.
{{< /note >}}

{{% /tab %}}
{{% tab name="pod-security.admission.config.k8s.io/v1alpha1" %}}
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
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
    # - specific version like "v{{< skew currentVersion >}}"
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
      runtimeClasses: []
      # Array of namespaces to exempt.
      namespaces: []
```
{{% /tab %}}
{{< /tabs >}}
