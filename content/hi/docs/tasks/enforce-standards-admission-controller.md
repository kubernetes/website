---
title: Built-in Admission Controller कॉन्फ़िगर करके Pod Security Standards लागू करें
reviewers:
- tallclair
- liggitt
content_type: task
weight: 240
---

Kubernetes, [Pod Security Standards](/docs/concepts/security/pod-security-standards) को लागू करने के लिए
एक built-in [admission controller](/docs/reference/access-authn-authz/admission-controllers/#podsecurity) प्रदान करता है।
आप इस admission controller को cluster-wide defaults और
[exemptions](/docs/concepts/security/pod-security-admission/#exemptions) सेट करने के लिए कॉन्फ़िगर कर सकते हैं।

## {{% heading "prerequisites" %}}

Kubernetes v1.22 में alpha release के बाद,
Pod Security Admission Kubernetes v1.23 में beta रूप में default रूप से उपलब्ध हुआ।
version 1.25 से आगे, Pod Security Admission सामान्य रूप से उपलब्ध (generally available) है।

{{% version-check %}}

अगर आप Kubernetes {{< skew currentVersion >}} नहीं चला रहे हैं, तो आप इस पेज का
वह documentation version चुन सकते हैं जो आपके चल रहे Kubernetes version से मेल खाता है।

## Admission Controller कॉन्फ़िगर करें

{{< note >}}
`pod-security.admission.config.k8s.io/v1` configuration के लिए v1.25+ आवश्यक है।
v1.23 और v1.24 के लिए [v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/) उपयोग करें।
v1.22 के लिए [v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/) उपयोग करें।
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
ऊपर दिया गया manifest, kube-apiserver के लिए `--admission-control-config-file` के माध्यम से specify करना होगा।
{{< /note >}}
