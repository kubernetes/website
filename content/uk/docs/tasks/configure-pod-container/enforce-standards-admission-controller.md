---
title: Забезпечення стандартів безпеки Podʼів шляхом конфігурування вбудованого контролера допуску
content_type: task
weight: 240
---

Kubernetes надає вбудований [контролер допуску](/docs/reference/access-authn-authz/admission-controllers/#podsecurity), щоб забезпечити дотримання [стандартів безпеки Podʼів](/docs/concepts/security/pod-security-standards). Ви можете налаштувати цей контролер допуску, щоб встановити глобальні стандартні значення та [винятки](/docs/concepts/security/pod-security-admission/#exemptions).

## {{% heading "prerequisites" %}}

Після альфа-релізу в Kubernetes v1.22, Pod Security Admission став стандартно доступним в Kubernetes v1.23, у вигляді бета. Починаючи з версії 1.25, Pod Security Admissio доступний загалом.

{{% version-check %}}

Якщо у вас не запущено Kubernetes {{< skew currentVersion >}}, ви можете перемикнутися на перегляд цієї сторінки в документації для версії Kubernetes, яку ви використовуєте.

## Налаштування контролера допуску {#configure-the-admission-controller}

{{< note >}}
Конфігурація `pod-security.admission.config.k8s.io/v1` потребує v1.25+. Для v1.23 та v1.24, використовуйте [v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/). Для v1.22, використовуйте [v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/).
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
    # - "privileged" (станадртно)
    # - "baseline"
    # - "restricted"
    #
    # Значення мітки версії повинні бути одним з:
    # - "latest" (станадртно)
    # - конкретна версія, наприклад "v{{< skew currentVersion >}}"
    defaults:
      enforce: "privileged"
      enforce-version: "latest"
      audit: "privileged"
      audit-version: "latest"
      warn: "privileged"
      warn-version: "latest"
    exemptions:
      # Масив імен користувачів для виключення.
      usernames: []
      # Масив імен класів виконання для виключення.
      runtimeClasses: []
      # Масив просторів імен для виключення.
      namespaces: []
```

{{< note >}}
Вищезазначений маніфест потрібно вказати через `--admission-control-config-file` для kube-apiserver.
{{< /note >}}
