---
title: Aplicando os Padrões de Segurança do Pod Através da Configuração do Controlador de Admissão Embutido
content_type: task
min-kubernetes-server-version: v1.22
---

Desde a versão v1.22, o Kubernetes fornece um [controlador de admissão](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
embutido para fazer cumprir os [padrões de segurança do Pod](/docs/concepts/security/pod-security-standards).
Você pode configurar esse controlador de admissão para definir padrões em todo 
o cluster e [exceções](/docs/concepts/security/pod-security-admission/#exemptions).

## {{% heading "prerequisites" %}}

{{% version-check %}}

- Garanta que a `PodSecurity` do [`feature gate`](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) 
está ativada.

## Configure o Controlador de Admissão

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
A versão da configuração v1beta1 requer a versão v1.23 ou superior do Kubernetes. Para a versão v1.22 do Kubernetes, utilize v1alpha1.
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
