---
title: "Політики"
weight: 90
no_list: true
description: >
  Керування безпекою та найкращими практиками за допомогою політик.
---

<!-- overview -->

Політики Kubernetes — це конфігурації, які керують іншими конфігураціями або поведінкою під час виконання. Kubernetes пропонує різні форми політик, описані нижче:

<!-- body -->

## Застосування політик за допомогою обʼєктів API {#apply-policies-using-api-objects}

Деякі обʼєкти API діють як політики. Ось кілька прикладів:

* [NetworkPolicies](/docs/concepts/services-networking/network-policies/) можна використовувати для обмеження вхідного та вихідного трафіку робочого навантаження.
* [LimitRanges](/docs/concepts/policy/limit-range/) керують обмеженнями розподілу ресурсів для різних типів обʼєктів.
* [ResourceQuotas](/docs/concepts/policy/resource-quotas/) обмежують споживання ресурсів для {{< glossary_tooltip text="простору імен" term_id="namespace" >}}.

## Застосування політик за допомогою контролерів допуску {#apply-policies-using-admission-controllers}

{{< glossary_tooltip text="Контролер допуску" term_id="admission-controller" >}} працює в API-сервері та може перевіряти або змінювати запити до API. Деякі контролери допуску застосовують політики. Наприклад, контролер допуску [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) змінює новий Pod, встановлюючи для нього політику завантаження образу `Always`.

У Kubernetes є кілька вбудованих контролерів допуску, які можна налаштувати за допомогою прапорця `--enable-admission-plugins` API-сервера.

Детальні відомості про контролери допуску, з повним списком доступних контролерів допуску, ви знайдете в окремому розділі:

* [Контролери допуску](/docs/reference/access-authn-authz/admission-controllers/)

## Застосування політик за допомогою ValidatingAdmissionPolicy {#apply-policies-using-validatingadmissionpolicy}

Політики перевірки допуску дають змогу виконувати налаштовувані перевірки в API-сервері за допомогою мови виразів Common Expression Language (CEL). Наприклад, `ValidatingAdmissionPolicy` можна використати, щоб заборонити використання теґу образу `latest`.

`ValidatingAdmissionPolicy` працює із запитом до API і може використовуватися для блокування, аудиту та попередження користувачів про невідповідні конфігурації.

Детальні відомості про API `ValidatingAdmissionPolicy` з прикладами ви знайдете в окремому розділі:

* [Політика перевірки допуску](/docs/reference/access-authn-authz/validating-admission-policy/)

## Застосування політик за допомогою динамічного контролю допуску {#apply-policies-using-dynamic-admission-control}

Динамічні контролери допуску (або вебхуки допуску) працюють поза API-сервером як окремі застосунки, які реєструються для отримання запитів вебхуків, щоб виконувати перевірку або зміну запитів до API.

Динамічні контролери допуску можна використовувати для застосування політик до запитів до API та запуску інших робочих процесів на основі політик. Динамічний контролер допуску може виконувати складні перевірки, зокрема ті, що потребують отримання інших ресурсів кластера та зовнішніх даних. Наприклад, перевірка образу може шукати дані в реєстрах OCI, щоб перевірити підписи та атестації образів контейнерів.

Детальні відомості про динамічний контроль допуску ви знайдете в окремому розділі:

* [Динамічний контроль допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/)

### Реалізації {#implementations-admission-control}

{{% thirdparty-content %}}

Динамічні контролери допуску, які діють як гнучкі рушії політик, розробляються в екосистемі Kubernetes, серед них:

- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
- [Polaris](https://polaris.docs.fairwinds.com/admission-controller/)

## Застосування політик за допомогою конфігурацій Kubelet {#apply-policies-using-kubelet-configurations}

Kubernetes дозволяє налаштовувати Kubelet на кожному робочому вузлі. Деякі конфігурації Kubelet діють як політики:

* [Обмеження та резервування ID процесів](/docs/concepts/policy/pid-limiting/) використовуються для обмеження та резервування доступних для розподілу PID.
* [Менеджери ресурсів вузлів](/docs/concepts/policy/node-resource-managers/) можуть керувати обчислювальними ресурсами, памʼяттю та ресурсами пристроїв для робочих навантажень, критичних до затримок, і робочих навантажень із високою пропускною здатністю.
