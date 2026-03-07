---
title: Забезпечення стандартів безпеки Podʼів за допомогою міток простору імен
content_type: task
weight: 250
---

Простори імен можуть бути позначені, щоб забезпечити [стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards). Три політики [privileged](/docs/concepts/security/pod-security-standards/#privileged), [baseline](/docs/concepts/security/pod-security-standards/#baseline) та [restricted](/docs/concepts/security/pod-security-standards/#restricted) широко охоплюють спектр безпеки та реалізуються за допомогою {{< glossary_tooltip
text="контролера допуску" term_id="admission-controller" >}} [безпеки Podʼа](/docs/concepts/security/pod-security-admission/).

## {{% heading "prerequisites" %}}

Pod Security Admission був доступний в Kubernetes v1.23, у вигляді бета. Починаючи з версії 1.25, Pod Security Admission доступний загалом.

{{% version-check %}}

## Вимога стандарту безпеки Pod `baseline` за допомогою міток простору імен {#requiring-the-baseline-pod-security-standard-with-namespace-labels}

Цей маніфест визначає Простір імен `my-baseline-namespace`, який:

- _Блокує_ будь-які Podʼи, які не відповідають вимогам політики `baseline`.
- Генерує попередження для користувача та додає анотацію аудиту до будь-якого створеного Podʼа, який не відповідає вимогам політики `restricted`.
- Фіксує версії політик `baseline` та `restricted` на v{{< skew currentVersion >}}.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-baseline-namespace
  labels:
    pod-security.kubernetes.io/enforce: baseline
    pod-security.kubernetes.io/enforce-version: v{{< skew currentVersion >}}

    # Ми встановлюємо ці рівні за нашим _бажаним_ `enforce` рівнем.
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: v{{< skew currentVersion >}}
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: v{{< skew currentVersion >}}
```

## Додавання міток до наявних просторів імен за допомогою `kubectl label` {#add-labels-to-existing-namespaces-with-kubectl-label}

{{< note >}}
Коли мітка політики `enforce` (або версії) додається або змінюється, втулок допуску буде тестувати кожен Pod в просторі імен на відповідність новій політиці. Порушення повертаються користувачу у вигляді попереджень.
{{< /note >}}

Корисно застосувати прапорець `--dry-run` при початковому оцінюванні змін профілю безпеки для просторів імен. Перевірки стандарту безпеки Pod все ще будуть виконуватися в режимі _dry run_, що дозволяє отримати інформацію про те, як нова політика буде обробляти наявні Podʼи, без фактичного оновлення політики.

```shell
kubectl label --dry-run=server --overwrite ns --all \
    pod-security.kubernetes.io/enforce=baseline
```

### Застосування до всіх просторів імен {#applying-to-all-namespaces}

Якщо ви тільки починаєте зі Pod Security Standards, відповідний перший крок — налаштувати всі простори імен з анотаціями аудиту для строгого рівня, такого як `baseline`:

```shell
kubectl label --overwrite ns --all \
  pod-security.kubernetes.io/audit=baseline \
  pod-security.kubernetes.io/warn=baseline
```

Зверніть увагу, що це не встановлює рівень примусового виконання, щоб можна було відрізняти простори імен, для яких не було явно встановлено рівень примусового виконання. Ви можете перелічити простори імен без явно встановленого рівня примусового виконання за допомогою цієї команди:

```shell
kubectl get namespaces --selector='!pod-security.kubernetes.io/enforce'
```

### Застосування до конкретного простору імен {#applying-to-a-single-namespace}

Ви також можете оновити конкретний простір імен. Ця команда додає політику `enforce=restricted` до простору імен `my-existing-namespace`, закріплюючи версію обмеженої політики на v{{< skew currentVersion >}}.

```shell
kubectl label --overwrite ns my-existing-namespace \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=v{{< skew currentVersion >}}
```
