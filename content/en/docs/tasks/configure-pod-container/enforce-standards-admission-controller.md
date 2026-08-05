---
title: Enforce Pod Security Standards by Configuring the Built-in Admission Controller
reviewers:
- tallclair
- liggitt
content_type: task
weight: 240
---

Kubernetes provides a built-in [admission controller](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
to enforce the [Pod Security Standards](/docs/concepts/security/pod-security-standards).
You can configure this admission controller to set cluster-wide defaults and [exemptions](/docs/concepts/security/pod-security-admission/#exemptions).

## {{% heading "prerequisites" %}}

Following an alpha release in Kubernetes v1.22,
Pod Security Admission became available by default in Kubernetes v1.23, as
a beta. From version 1.25 onwards, Pod Security Admission is generally
available.

{{% version-check %}}

If you are not running Kubernetes {{< skew currentVersion >}}, you can switch
to viewing this page in the documentation for the Kubernetes version that you
are running.

## Configure the Admission Controller

{{< note >}}
`pod-security.admission.config.k8s.io/v1` configuration requires v1.25+.
For v1.23 and v1.24, use [v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/).
For v1.22, use [v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/).
{{< /note >}}

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1 # see compatibility note
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
The above manifest needs to be specified via the `--admission-control-config-file` to kube-apiserver.
{{< /note >}}

