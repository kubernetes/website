---
title: "Політики"
weight: 90
no_list: true
description: >
  Керування безпекою та найкращі практики застосування політик.
---

<!-- overview -->

Політики Kubernetes — це конфігурації, які керують поведінкою інших конфігурацій чи ресурсів. Kubernetes надає кілька різних рівнів політик, про які можна дізнатися в цьому розділі.

<!-- body -->

## Застосування політик за допомогою обʼєктів API {#apply-policies-using-api-objects}

Деякі обʼєкти API виступають як політики. Ось деякі приклади:

* [NetworkPolicies](/docs/concepts/services-networking/network-policies/) можуть бути використані для обмеження вхідного та вихідного трафіку для робочого навантаження.
* [LimitRanges](/docs/concepts/policy/limit-range/) керують обмеженнями розподілу ресурсів між різними типами обʼєктів.
* [ResourceQuotas](/docs/concepts/policy/resource-quotas/) обмежують споживання ресурсів для {{< glossary_tooltip text="простору імен" term_id="namespace" >}}.

## Застосування політик за допомогою admission-контролерів {#apply-policies-using-admission-controllers}

{{< glossary_tooltip text="Admission контролер" term_id="admission-controller" >}} працює в API-сервері та може перевіряти або змінювати запити до API. Деякі admission-контролери виступають як політики. Наприклад, admission-контролер [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) змінює новий обʼєкт Pod, щоб встановити політику завантаження образу на `Always`.

У Kubernetes є кілька вбудованих admission-контролерів, які можна налаштувати за допомогою прапорця `--enable-admission-plugins` API-сервера.

Детальні відомості про admission-контролери, з повним списком доступних admission-контролерів, ви знайдете в окремому розділі:

* [Admission контролери](/docs/reference/access-authn-authz/admission-controllers/)

## Застосування політик за допомогою ValidatingAdmissionPolicy {#apply-policies-using-validating-admission-policy}

Перевірка політик допуску дозволяє виконувати налаштовані перевірки в API-сервері за допомогою мови виразів Common Expression Language (CEL). Наприклад, `ValidatingAdmissionPolicy` може бути використаний для заборони використання образів з теґом `latest`.

`ValidatingAdmissionPolicy` працює з запитом до API та може бути використаний для блокування, аудиту та попередження користувачів про невідповідні конфігурації.

Детальні відомості про API `ValidatingAdmissionPolicy` з прикладами ви знайдете в окремому розділі:

* [Перевірка політик допуску](/docs/reference/access-authn-authz/validating-admission-policy/)

## Застосування політик за допомогою динамічного контролю допуску {#apply-policies-using-dynamic-admission-control}

Контролери динамічного допуску (або вхідні вебхуки) працюють поза API-сервером як окремі застосунки, які реєструються для отримання запитів вебхуків для виконання перевірки або зміни запитів до API.

Контролери динамічного допуску можуть бути використані для застосування політик до запитів до API та спрацьовувати інші робочі процеси на основі політик. Контролер динамічного допуску може виконувати складні перевірки, включаючи ті, які вимагають отримання інших ресурсів кластера та зовнішніх даних. Наприклад, звірка перевірки образу може виконувати пошук даних у реєстрах OCI для перевірки підписів та атестації образу контейнерів.

Детальні відомості про динамічний контроль допуску ви знайдете в окремому розділі:

* [Динамічний контроль допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/)

### Реалізації {#implementations-admission-control}

{{% thirdparty-content %}}

Контролери динамічного допуску, які виступають як гнучкі рушії політик, розробляються в екосистемі Kubernetes, серед них:

* [Kubewarden](https://github.com/kubewarden)
* [Kyverno](https://kyverno.io)
* [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
* [Polaris](https://polaris.docs.fairwinds.com/admission-controller/)

## Застосування політик за конфігурацій Kubelet {#apply-policies-using-kubelet-configuration}

Kubeletʼи дозволяють налаштовувати політики для кожного робочого вузла. Деякі конфігурації Kubeletʼів працюють як політики:

* [Резурвування та ліміти Process ID](/docs/concepts/policy/pid-limiting/) використовуються для обмеження та резервування PID.
* [Менеджер ресурсів вузлів](/docs/concepts/policy/node-resource-manager/) може бути використаний для керування обчислювальними ресурсами, ресурсами памʼяті та ресурсами пристроїв для високопропускних та критичних до затримок робочих навантажень.
