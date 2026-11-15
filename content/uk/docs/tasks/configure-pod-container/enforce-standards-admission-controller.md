---
title: Забезпечення стандартів безпеки Podʼів шляхом конфігурування вбудованого контролера допуску
content_type: task
weight: 240
---

Kubernetes надає вбудований [контролер допуску](/docs/reference/access-authn-authz/admission-controllers/#podsecurity) для забезпечення дотримання [стандартів безпеки Podʼів](/docs/concepts/security/pod-security-standards). Цей контролер допуску можна налаштувати, щоб задати стандартні значення для всього кластера та [винятки](/docs/concepts/security/pod-security-admission/#exemptions).

## {{% heading "prerequisites" %}} {#before-you-begin}

Після альфа-випуску в Kubernetes v1.22 Pod Security Admission стала стандартно доступною в Kubernetes v1.23 як бета-можливість. Починаючи з версії 1.25, Pod Security Admission загальнодоступна (GA).

{{% version-check %}}

Якщо ви використовуєте не Kubernetes {{< skew currentVersion >}}, можна перейти до перегляду цієї сторінки в документації для версії Kubernetes, яку ви використовуєте.

## Налаштування контролера допуску {#configure-the-admission-controller}

{{< note >}}
Конфігурація `pod-security.admission.config.k8s.io/v1` потребує v1.25+. Для v1.23 і v1.24 використовуйте [v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/). Для v1.22 використовуйте [v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/).
{{< /note >}}

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1 # див. примітку про сумісність
    kind: PodSecurityConfiguration
    # Стандартні значення, які застосовуються, коли мітка режиму не встановлена.
    #
    # Значення мітки рівня повинні бути одним з:
    # - "privileged" (стандартно)
    # - "baseline"
    # - "restricted"
    #
    # Значення мітки версії повинні бути одним з:
    # - "latest" (стандартно)
    # - конкретна версія, наприклад "v{{< skew currentVersion >}}"
    defaults:
      enforce: "privileged"
      enforce-version: "latest"
      audit: "privileged"
      audit-version: "latest"
      warn: "privileged"
      warn-version: "latest"
    exemptions:
      # Масив імен автентифікованих користувачів, на які поширюється виняток.
      usernames: []
      # Масив імен RuntimeClass, на які поширюється виняток.
      runtimeClasses: []
      # Масив просторів імен, на які поширюється виняток.
      namespaces: []
```

{{< note >}}
Наведений вище маніфест потрібно передати kube-apiserver через `--admission-control-config-file`.
{{< /note >}}
