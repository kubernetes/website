---
title: Забезпечення стандартів безпеки Podʼів за допомогою міток простору імен
content_type: task
weight: 250
---

Простори імен можна позначати мітками, щоб забезпечити дотримання [стандартів безпеки Podʼів](/docs/concepts/security/pod-security-standards). Три політики [privileged](/docs/concepts/security/pod-security-standards/#privileged), [baseline](/docs/concepts/security/pod-security-standards/#baseline) і [restricted](/docs/concepts/security/pod-security-standards/#restricted) загалом охоплюють увесь спектр безпеки й реалізуються {{< glossary_tooltip text="контролером допуску" term_id="admission-controller" >}} [Pod Security](/docs/concepts/security/pod-security-admission/).

## {{% heading "prerequisites" %}} {#before-you-begin}

Pod Security Admission стала стандартно доступною в Kubernetes v1.23 як бета-можливість. Починаючи з версії 1.25, Pod Security Admission загальнодоступна (GA).

{{% version-check %}}

## Вимога стандарту безпеки Podʼів `baseline` за допомогою міток простору імен {#requiring-the-baseline-pod-security-standard-with-namespace-labels}

Цей маніфест визначає простір імен `my-baseline-namespace`, який:

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

    # Ми встановлюємо ці рівні на наш _бажаний_ рівень `enforce`.
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: v{{< skew currentVersion >}}
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: v{{< skew currentVersion >}}
```

## Додавання міток до наявних просторів імен за допомогою `kubectl label` {#add-labels-to-existing-namespaces-with-kubectl-label}

{{< note >}}
Коли мітку політики `enforce` (або версії) додають чи змінюють, втулок допуску перевіряє кожен Pod у просторі імен на відповідність новій політиці. Порушення повертаються користувачу як попередження.
{{< /note >}}

Під час початкового оцінювання змін профілю безпеки для просторів імен корисно застосовувати прапорець `--dry-run`. Перевірки стандартів безпеки Podʼів однаково виконуються в режимі _dry run_, даючи вам інформацію про те, як нова політика обробила б наявні Podʼи, без фактичного оновлення політики.

```shell
kubectl label --dry-run=server --overwrite ns --all \
    pod-security.kubernetes.io/enforce=baseline
```

### Застосування до всіх просторів імен {#applying-to-all-namespaces}

Якщо ви лише починаєте працювати зі стандартами безпеки Podʼів, слушним першим кроком буде налаштувати для всіх просторів імен анотації аудиту для суворішого рівня, такого як `baseline`:

```shell
kubectl label --overwrite ns --all \
  pod-security.kubernetes.io/audit=baseline \
  pod-security.kubernetes.io/warn=baseline
```

Зверніть увагу, що це не встановлює рівень enforce, щоб можна було відрізнити простори імен, які ще не були явно оцінені. Простори імен без явно встановленого рівня enforce можна перелічити такою командою:

```shell
kubectl get namespaces --selector='!pod-security.kubernetes.io/enforce'
```

### Застосування до конкретного простору імен {#applying-to-a-single-namespace}

Також можна оновити окремий простір імен. Ця команда додає політику `enforce=restricted` до `my-existing-namespace`, закріплюючи версію політики restricted на v{{< skew currentVersion >}}.

```shell
kubectl label --overwrite ns my-existing-namespace \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=v{{< skew currentVersion >}}
```
