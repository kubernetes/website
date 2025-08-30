---
title: Змінювані політики допуску
content_type: concept
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.34" state="beta" >}}
<!-- due to feature gate history, use manual version specification here -->

На цій сторінці ви можете ознайомитися з інформацією про _MutatingAdmissionPolicies_. MutatingAdmissionPolicies дозволяють вам змінювати те, що відбувається, коли хтось вносить зміни до API Kubernetes. Якщо ви хочете використовувати декларативні політики лише для запобігання певному виду змін ресурсів (наприклад: захист платформених просторів імен від видалення), [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) є простішою та ефективнішою альтернативою.

Щоб використовувати цю функцію, увімкніть функціональну можливість `MutatingAdmissionPolicy` (яка стандартно є вимкненою) і встановіть `--runtime-config=admissionregistration.k8s.io/v1beta1=true` на kube-apiserver.

<!-- body -->

## Що таке MutatingAdmissionPolicies? {#what-are-mutatingadmissionpolicies}

Зміна політик доступу пропонує декларативну альтернативу зміні вебхуків допуску, яка виконується в процесі роботи.

Змінювані політики допуску використовують Common Expression Language (CEL) для оголошення мутацій ресурсів. Мутації можуть бути визначені або за допомогою *apply configuration*, яка обʼєднується за допомогою [server side apply merge strategy](/docs/reference/using-api/server-side-apply/#merge-strategy), або за допомогою [JSON patch](https://jsonpatch.com/).

Змінювані політики допуску дуже добре конфігуруються, що дозволяє авторам політик визначати політики, які можна параметризувати та масштабувати на ресурси відповідно до потреб адміністраторів кластерів.

## З яких ресурсів складається політика {#what-resources-make-a-policy}

Політика зазвичай складається з трьох ресурсів:

- MutatingAdmissionPolicy описує абстрактну логіку політики (наприклад: «ця політика встановлює певну мітку на певне значення»).

- Ресурс _параметрів_ надає інформацію для MutatingAdmissionPolicy, щоб зробити її конкретним твердженням (наприклад, «встановіть мітку `owner` на щось на кшталт `company.example.com`»). Ресурси параметрів відносяться до ресурсів Kubernetes, доступних у Kubernetes API. Вони можуть бути вбудованими типами або розширеннями, такими як {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} (CRD). Наприклад, ви можете використовувати ConfigMap як параметр.
- Привʼязка MutatingAdmissionPolicyBinding повʼязує вищезгадані ресурси (MutatingAdmissionPolicy і параметр) разом і забезпечує масштабування. Якщо ви хочете встановити мітку `owner` лише для `Pods`, а не для інших типів API, привʼязка — це місце, де ви вказуєте цю мутацію.

Для того, щоб політика мала ефект, необхідно визначити принаймні MutatingAdmissionPolicy та відповідне MutatingAdmissionPolicyBinding.

Якщо MutatingAdmissionPolicy не потрібно налаштовувати через параметри, просто залиште `spec.paramKind` у MutatingAdmissionPolicy не вказаним.

## Початок роботи з MutatingAdmissionPolicies {#getting-started-with-mutatingadmissionpolicies}

Мутація політики допуску є частиною панелі управління кластером. Ви повинні створювати та розгортати їх з великою обережністю. Нижче описано, як швидко поекспериментувати з мутуючими політиками допуску.

### Створення MutatingAdmissionPolicy {#create-a-mutatingadmissionpolicy}

Нижче наведено приклад політики MutatingAdmissionPolicy. Ця політика змінює нові створені pod'и так, щоб вони мали контейнер sidecar, якщо він не існує.

{{% code_sample language="yaml" file="mutatingadmissionpolicy/applyconfiguration-example.yaml" %}}

Поле `.spec.mutations` складається зі списку виразів, які обчислюють патчі до ресурсів. Патчі можуть бути як патчами [застосувати конфігурації](#patch-type-apply-configuration), так і патчами [JSON Patch](#patch-type-json-patch).
Після обчислення всіх виразів сервер API застосовує ці зміни до ресурсу, який проходить через допуск.

Щоб налаштувати мутуючу політику допуску для використання в кластері, необхідна привʼязка. MutatingAdmissionPolicy буде активною лише тоді, коли існує відповідна привʼязка із зазначеним `spec.policyName`, що збігається із `spec.name` політики.

Після створення привʼязки і політики будь-який запит до ресурсу, який відповідає `spec.matchConditions` політики, буде викликати набір визначених мутацій.

У наведеному вище прикладі створення Pod додасть мутацію `mesh-proxy` initContainer:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: default
spec:
  ...
  initContainers:
  - name: mesh-proxy
    image: mesh/proxy:v1.0.0
    args: ["proxy", "sidecar"]
    restartPolicy: Always
  - name: myapp-initializer
    image: example/initializer:v1.0.0
  ...
```

#### Ресурси параметрів {#parameter-resources}

Ресурси параметрів дозволяють відокремити конфігурацію політики від її
визначення. Політика може визначати `paramKind`, який окреслює GVK ресурсу параметра, а потім привʼязка політики привʼязує політику за назвою (через `policyName`) до певного ресурсу параметра через `paramRef`.

Будь ласка, зверніться до статті [ресурси параметрів](/docs/reference/access-authn-authz/validating-admission-policy/#parameter-resources) для отримання додаткової інформації.

#### `ApplyConfiguration` {#patch-type-apply-configuration}

Вирази MutatingAdmissionPolicy завжди є CEL. Кожен вираз застосовної конфігурації повинен приводити до CEL-обʼєкта (оголошеного за допомогою ініціалізації `Object()`).

Застосовні конфігурації не можуть змінювати атомарні структури, map або масиви через ризик випадкового видалення значень, не включених у застосовну конфігурацію.

CEL-вирази мають доступ до типів обʼєктів, необхідних для створення застосовних конфігурацій:
- `Object` — CEL-тип обʼєкта ресурсу.
- `Object.<fieldName>` — CEL-тип поля обʼєкта (наприклад, `Object.spec`)
- `Object.<fieldName1>.<fieldName2>...<fieldNameN>` — CEL-тип вкладеного поля (наприклад, `Object.spec.containers`)

CEL-вирази мають доступ до вмісту запиту API, організованого в CEL-змінні, а також до деяких інших корисних змінних:

- `object` — Обʼєкт з вхідного запиту. Для запитів DELETE дорівнює нулю.
- `oldObject` — Наявний обʼєкт. Для запитів на створення дорівнює нулю.
- `request` — Атрибути запиту до API.
- `params` — Ресурс параметра, на який посилається привʼязка політики, що оцінюється. Заповнюється тільки якщо політика має ParamKind.
- `namespaceObject` — Обʼєкт простору імен, до якого належить вхідний обʼєкт. Значення дорівнює нулю для кластерних ресурсів.
- `variables` — Мапа складених змінних, від імені до ледачо обчисленого значення. Наприклад, до змінної з іменем `foo` можна отримати доступ як `variables.foo`.
- `authorizer` — Авторизатор CEL. Може використовуватися для виконання перевірки авторизації для принципала (облікового запису користувача або служби) запиту. Див. https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
- `authorizer.requestResource` — CEL ResourceCheck, сконструйований з `authorizer` і сконфігурований з ресурсом запиту.

Властивості `apiVersion`, `kind`, `metadata.name`, `metadata.generateName` і `metadata.labels` завжди доступні з кореня обʼєкта. Інші властивості метаданих недоступні.

#### `JSONPatch` {#patch-type-json-patch}

Цю ж саму мутацію можна записати у вигляді [JSON Patch](https://jsonpatch.com/) наступним чином:

{{% code_sample language="yaml" file="mutatingadmissionpolicy/json-patch-example.yaml" %}}

Вираз буде обчислено CEL для створення [JSON patch](https://jsonpatch.com/). посилання: https://github.com/google/cel-spec

Кожен обчислений `expression` повинен повернути масив значень `JSONPatch`. Тип `JSONPatch` представляє одну операцію з патча JSON.

Наприклад, цей CEL-вираз повертає патч JSON для умовної зміни значення:

```json
  [
    JSONPatch{op: "test", path: "/spec/example", value: "Red"},
    JSONPatch{op: "replace", path: "/spec/example", value: "Green"}
  ]
```

Щоб визначити JSON-обʼєкт для операції виправлення `value`, використовуйте типи CEL `Object`. Наприклад:

```json
  [
    JSONPatch{
      op: "add",
      path: "/spec/selector",
      value: Object.spec.selector{matchLabels: {"environment": "test"}}
    }
  ]
```

Щоб використовувати рядки, що містять символи '/' і '~' як ключі шляху до JSONPatch, використовуйте `jsonpatch.escapeKey()`. Наприклад:

```json
  [
    JSONPatch{
      op: "add",
      path: "/metadata/labels/" + jsonpatch.escapeKey("example.com/environment"),
      value: "test"
    },
  ]
```

CEL-вирази мають доступ до типів, необхідних для створення патчів і об'єктів JSON:

- `JSONPatch` — CEL тип операцій JSON Patch. JSONPatch має поля `op`, `from`, `path` та `value`. Дивіться [JSON patch](https://jsonpatch.com/) для більш детальної інформації. Поле `value` може мати будь-яке значення: рядок, ціле число, масив, мапа або об'єкт. Якщо встановлено, поля `path` і `from` мають бути встановлені на рядок [JSON-покажчик](https://datatracker.ietf.org/doc/html/rfc6901/), де CEL-функція `jsonpatch.escapeKey()` може бути використана для витіснення ключів шляху, що містять `/` і `~`.
- `Object` — CEL-тип обʼєкта ресурсу.
- `Object.<fieldName>` — CEL-тип поля обʼєкта (наприклад, `Object.spec`)
- `Object.<fieldName1>.<fieldName2>...<fieldNameN>` — CEL-тип вкладеного поля (наприклад, `Object.spec.containers`)

CEL-вирази мають доступ до вмісту запиту API, організованого в CEL-змінні, а також до деяких інших корисних змінних:

- `object` — Обʼєкт з вхідного запиту. Для запитів DELETE дорівнює нулю.
- `oldObject` — Наявний обʼєкт. Для запитів на створення дорівнює нулю.
- `request` — Атрибути запиту до API.
- `params` — Ресурс параметра, на який посилається привʼязка політики, що оцінюється. Заповнюється тільки якщо політика має ParamKind.
- `namespaceObject` — Обʼєкт простору імен, до якого належить вхідний обʼєкт. Значення дорівнює нулю для кластерних ресурсів.
- `variables` — Мапа складених змінних, від імені до ліниво обчислюваного значення. Наприклад, до змінної з іменем `foo` можна отримати доступ як `variables.foo`.
- `authorizer` — Авторизатор CEL. Може використовуватися для виконання перевірки авторизації для принципала (облікового запису користувача або служби) запиту. Див. https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
- `authorizer.requestResource` — CEL ResourceCheck, сконструйований з `authorizer` і сконфігурований з ресурсом запиту.

CEL-вирази мають доступ до [бібліотек функцій Kubernetes CEL](/docs/reference/using-api/cel/#cel-options-language-features-and-libraries), а також:

- `jsonpatch.escapeKey` — Виконує екранування клавіш JSONPatch. Символи `~` та `/` екрануються як `~0` та `~1` відповідно.

Доступні тільки назви властивостей виду `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*`.

## Види API, на які не поширюється мутаційний допуск {#api-kinds-exempt-from-mitating-admission}

Існують певні типи API, які не підлягають мутації під час надання допуску. Наприклад, ви не можете створити MutatingAdmissionPolicy, яка змінює MutatingAdmissionPolicy.

Список вилучених типів API наведено нижче:

- [ValidatingAdmissionPolicies]({{< relref "/docs/reference/kubernetes-api/policy-resources/validating-admission-policy-v1/" >}})
- [ValidatingAdmissionPolicyBindings]({{< relref "/docs/reference/kubernetes-api/policy-resources/validating-admission-policy-binding-v1/" >}})
- MutatingAdmissionPolicies
- MutatingAdmissionPolicyBindings
- [TokenReviews]({{< relref "/docs/reference/kubernetes-api/authentication-resources/token-review-v1/" >}})
- [LocalSubjectAccessReviews]({{< relref "/docs/reference/kubernetes-api/authorization-resources/local-subject-access-review-v1/" >}})
- [SelfSubjectAccessReviews]({{< relref "/docs/reference/kubernetes-api/authorization-resources/self-subject-access-review-v1/" >}})
- [SelfSubjectReviews]({{< relref "/docs/reference/kubernetes-api/authentication-resources/self-subject-review-v1/" >}})
