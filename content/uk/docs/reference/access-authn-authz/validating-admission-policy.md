---
title: Правила перевірки допуску
content_type: concept
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.30" >}}

Ця сторінка надає огляд правил перевірки допуску.

<!-- body -->

## Що таке правила перевірки допуску? {#what-is-validating-admission-policy}

Правила перевірки допуску пропонують декларативну вбудовану альтернативу вебхукам перевірки допуску.

Правила перевірки допуску використовують мову загальних виразів (Common Expression Language, CEL) для оголошення правил валідації. Правила перевірки допуску мають широкі можливості налаштування: автори можуть визначати правила, які можна параметризувати та обмежувати певними ресурсами відповідно до потреб адміністраторів кластера.

## Які ресурси складають правила {#what-resources-make-a-policy}

Зазвичай правило складається з трьох ресурсів:

- `ValidatingAdmissionPolicy` описує абстрактну логіку правил (наприклад: "ці правила гарантують, що певна мітка встановлена у певне значення").

- Ресурс параметра надає інформацію для `ValidatingAdmissionPolicy`, щоб зробити його конкретним висловленням (наприклад, "мітка `owner` повинна бути встановлена на щось, що закінчується на `.company.com`"). Вбудований тип, такий як ConfigMap або CRD, визначає схему ресурсу параметра. Обʼєкти `ValidatingAdmissionPolicy` вказують, який Kind вони очікують для свого ресурсу параметру.

- `ValidatingAdmissionPolicyBinding` повʼязує вищезазначені ресурси разом і надає обмеження області дії. Якщо вам потрібно вимагати встановлення мітки `owner` для `Pods`, саме в привʼязці ви вказуєте це обмеження.

Для того щоб правила мали ефект, обовʼязково повинні бути визначені принаймні `ValidatingAdmissionPolicy` та відповідне `ValidatingAdmissionPolicyBinding`.

{{< note >}}
Закінчення імен на `.static.k8s.io` зарезервоване для [контролю допуску на основі маніфестів](/docs/reference/access-authn-authz/manifest-admission-control/) і не може використовуватися для політик або привʼязок на основі API. Це обмеження застосовується, коли увімкнено функціональну можливість [`ManifestBasedAdmissionControlConfig`](/docs/reference/command-line-tools-reference/feature-gates/#ManifestBasedAdmissionControlConfig).
{{< /note >}}

Якщо `ValidatingAdmissionPolicy` не потребує налаштування через параметри, просто залиште
`spec.paramKind` в `ValidatingAdmissionPolicy` не вказаним.

## Початок роботи з правилами перевірки допуску {#getting-started-with-validating-admission-policy}

Правила перевірки допуску є частиною панелі управління кластера. Ви повинні писати та розгортати їх з великою обережністю. Нижче наведено інструкції щодо швидкого експерименту з правилами перевірки допуску.

### Створення ValidatingAdmissionPolicy {#creating-a-validatingadmissionpolicy}

Нижче наведено приклад ValidatingAdmissionPolicy.

{{% code_sample language="yaml" file="validatingadmissionpolicy/basic-example-policy.yaml" %}}

`spec.validations` містить вирази CEL, які використовують [Мову загальних виразів (CEL)](https://github.com/google/cel-spec), щоб перевірити запит. Якщо вираз обчислюється як false, перевірка валідації застосовується згідно з полем `spec.failurePolicy`.

{{< note >}}
Ви можете швидко перевірити вирази CEL у [пісочниці CEL](https://playcel.undistro.io).
{{< /note >}}

Для налаштування правил перевірки допуску для використання в кластері потрібна привʼязка. Нижче наведено приклад ValidatingAdmissionPolicyBinding.:

{{% code_sample language="yaml" file="validatingadmissionpolicy/basic-example-binding.yaml" %}}

Якщо спробувати створити Deployment з кількістю реплік, що не задовольняє вираз валідації, буде повернуто помилку з повідомленням:

```none
ValidatingAdmissionPolicy 'demo-policy.example.com' with binding 'demo-binding-test.example.com' denied request: failed expression: object.spec.replicas <= 5
```

Вище наведено простий приклад використання ValidatingAdmissionPolicy без налаштованого параметра.

#### Дії валідації {#validation-actions}

Кожний `ValidatingAdmissionPolicyBinding` повинен вказати одну або кілька `validationActions`, щоб визначити, як `validations` правила будуть застосовані.

Підтримувані `validationActions`:

- `Deny`: Невдалий результат валідації призводить до відхиленого запиту.
- `Warn`: Невдалий результат валідації повідомляється клієнту запиту як [попередження](/blog/2020/09/03/warnings/).
- `Audit`: Невдалий результат валідації включається в подію аудиту для запиту до API.

Наприклад, щоб одночасно попереджувати клієнтів про невдалий результат валідації та записувати невдалий результат валідації в журнал аудиту, використовуйте:

```yaml
validationActions: [Warn, Audit]
```

`Deny` та `Warn` не можуть бути використані разом, оскільки ця комбінація надмірно дублює невдалий результат валідації як у тілі відповіді API, так і в заголовках HTTP-попереджень.

`validation`, який оцінюється як false, завжди застосовується відповідно до цих дій. Невдачі, визначені полем `failurePolicy`, застосовуються відповідно до цих дій тільки у випадку, якщо `failurePolicy` встановлено на `Fail` (або не вказано), інакше невдачі ігноруються.

Див. [Анотації аудиту: невдалий результат валідації](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure) для отримання додаткових відомостей щодо аудиту невдалих результатів валідації.

### Ресурси параметрів {#parameter-resources}

Ресурси параметрів дозволяють відокремити конфігурацію правил від їх визначення. Правило може визначити paramKind, який визначає GVK ресурсу параметра, а потім привʼязка правила повʼязує його за іменем (через policyName) з певним ресурсом параметра через paramRef.

Якщо потрібна конфігурація параметра, нижче наведено приклад ValidatingAdmissionPolicy з конфігурацією параметра.

{{% code_sample language="yaml" file="validatingadmissionpolicy/policy-with-param.yaml" %}}

Поле `spec.paramKind` ValidatingAdmissionPolicy вказує на вид використовуваних ресурсів для параметризації цього правила. У цьому прикладі це налаштовано за допомогою ресурсів ReplicaLimit. Зверніть увагу в цьому прикладі, як вираз CEL посилається на параметри через змінну CEL params, наприклад, `params.maxReplicas`. `spec.matchConstraints` вказує, для яких ресурсів це правило призначене для валідації. Зверніть увагу, що як параметр можуть використовуватися і стандартні типи, такі як `ConfigMap`.

Поля `spec.validations` містять вирази CEL. Якщо вираз оцінюється як false, то валідаційна перевірка здійснюється відповідно до поля `spec.failurePolicy`.

Автор правил перевірки допуску відповідає за надання параметра CRD ReplicaLimit.

Для налаштування правил перевірки допуску для використання в кластері створюються привʼязка та ресурс параметра. Наведено приклад ValidatingAdmissionPolicyBinding який використовує **кластерний** параметр — той самий параметр буде використовуватися для валідації кожного запиту до ресурсу, який відповідає привʼязці:

{{% code_sample language="yaml" file="validatingadmissionpolicy/binding-with-param.yaml" %}}

Зверніть увагу, що ця привʼязка застосовує параметр до правил для всіх ресурсів, які знаходяться в середовищі `test`.

Ресурс параметра може мати такий вигляд:

{{% code_sample language="yaml" file="validatingadmissionpolicy/replicalimit-param.yaml" %}}

Цей ресурс параметра правил обмежує Deployments до максимуму 3 репліки.

В правилі допуску може бути кілька привʼязок. Щоб привʼязати всі інші середовища до обмеження maxReplicas 100, створіть інший ValidatingAdmissionPolicyBinding:

{{% code_sample language="yaml" file="validatingadmissionpolicy/binding-with-param-prod.yaml" %}}

Зверніть увагу, що ця привʼязка застосовує інший параметр до ресурсів, які не знаходяться в середовищі `test`.

І ресурс параметра:

{{% code_sample language="yaml" file="validatingadmissionpolicy/replicalimit-param-prod.yaml" %}}

Для кожного запиту на допуск, API-сервер оцінює вирази CEL кожної комбінації (правило, привʼязка, параметр), які відповідають запиту. Для того, щоб запит був прийнятий, він повинен пройти **всі** оцінки.

Якщо кілька привʼязок відповідають запиту, правило буде оцінено для кожної, і вони всі повинні пройти оцінку, щоб правило вважали пройденим.

Якщо кілька параметрів відповідають одній привʼязці, правила будуть оцінені для кожного параметра, і вони також повинні всі пройти, щоб привʼязка вважалася пройденою. Привʼязки можуть мати критерії відповідності, що перекриваються. Правило оцінюється для кожної відповідної комбінації привʼязка-параметр. Правило може бути оцінено навіть кілька разів, якщо йому відповідає кілька привʼязок, або одна привʼязка, яка відповідає кільком параметрам.

Обʼєкт `params`, який представляє ресурс параметра, не буде встановлений, якщо ресурс параметра не був привʼязаний, тому для правил, які потребують ресурсу параметра, може бути корисно додати перевірку, щоб забезпечити його привʼязку. Ресурс параметра не буде привʼязаний і `params` буде null, якщо `paramKind` правила або `paramRef` привʼязки не вказані.

Для випадків використання, що потребують конфігурації параметра, ми рекомендуємо додати перевірку параметра в `spec.validations[0].expression`:

```
- expression: "params != null"
  message: "params missing but required to bind to this policy"
```

#### Необовʼязкові параметри {#optional-parameters}

Може бути зручно мати можливість мати необовʼязкові параметри як частину ресурсу параметра і валідувати їх лише в разі їх присутності. У CEL є макрос `has()`, який перевіряє, чи існує поле перед тим, як вираз CEL отримує доступ до значення цього поля. Крім того, CEL реалізує булеве скорочення. Якщо перша половина логічного АБО обчислюється як true, друга половина не обчислюється (оскільки результат усього АБО буде true в будь-якому випадку).

Поєднуючи ці дві можливості, ми можемо забезпечити можливість валідації необовʼязкових параметрів:

`!has(params.optionalNumber) || (params.optionalNumber >= 5 && params.optionalNumber <= 10)`

Тут спочатку ми перевіряємо, чи необовʼязковий параметр відсутній за допомогою `!has(params.optionalNumber)`.

- Якщо `optionalNumber` не був визначений, то вираз скорочується, оскільки `!has(params.optionalNumber)` оцінюється як true.
- Якщо `optionalNumber` був визначений, тоді друга половина CEL виразу буде оцінена, і `optionalNumber` буде перевірений, щоб забезпечити, що він містить значення від 5 до 10 включно.

Використовуйте `has()` для перевірки наявності поля. Щоб перевірити, чи містить map ключ, використовуйте оператор `in`. Наприклад, `has(object.metadata.labels) && 'example.com/environment' in object.metadata.labels` перевіряє, що поле `metadata.labels` присутнє і що map містить ключ `example.com/environment`.

Для доступу до необовʼязкових полів на кількох рівнях використовуйте CEL-синтаксис для необовʼязкових значень (Kubernetes 1.29+): `object.?metadata.labels['example.com/block'].orValue('')` безпечно проходить крізь відсутні проміжні поля та повертає задане типове значення.

#### Параметри на рівні простору імен {#per-namespace-parameters}

Як автор ValidatingAdmissionPolicy та його ValidatingAdmissionPolicyBinding, ви можете вибрати, чи вказувати параметри на рівні кластера або на рівні простору імен. Якщо ви вказуєте `namespace` для `paramRef` привʼязки, панель управління шукає параметри лише в цьому просторі імен.

Проте, якщо `namespace` не вказано в ValidatingAdmissionPolicyBinding, API-сервер може шукати відповідні параметри в просторі імен, до якого відноситься запит. Наприклад, якщо ви робите запит на зміну ConfigMap у просторі імен `default`, і існує відповідна ValidatingAdmissionPolicyBinding без вказаного `namespace`, то API-сервер шукає обʼєкт параметра в `default`. Цей дизайн дозволяє конфігурувати правило, що залежить від простору імен ресурсу, який обробляється, для отримання більш точного контролю.

#### Селектор параметрів {#parameter-selector}

Крім вказання параметра у привʼязці за допомогою `name`, ви можете вибрати замість цього вказати селектор міток, таким чином, всі ресурси `paramKind` правила та `namespace` параметра (якщо застосовується), які відповідають селектору міток, вибираються для оцінки. Див. {{< glossary_tooltip text="селектор" term_id="selector">}} для отримання додаткової інформації про те, як селектори міток відбирають ресурси.

Якщо умову виконують кілька параметрів, правила оцінюються для кожного знайденого параметра, а результати будуть оцінені разом через логічне І (AND).

Якщо надано `namespace`, для вибору допускаються лише обʼєкти `paramKind` у вказаному просторі імен. В іншому випадку, коли `namespace` порожній, а `paramKind` обмежений простором імен, використовується `namespace`, використаний у запиті для допуску.

#### Перевірка авторизації {#authorization-check}

Ми ввели перевірку авторизації для ресурсів параметрів. Очікується, що користувач матиме доступ `read` до ресурсів, на які посилається `paramKind` у `ValidatingAdmissionPolicy` та `paramRef` у `ValidatingAdmissionPolicyBinding`.

Зверніть увагу, що якщо ресурс у `paramKind` не вдасться знайти через restmapper, потрібен доступ `read` до всіх ресурсів груп.

#### `paramRef`

Поле `paramRef` визначає ресурс параметра, який використовується правилом. Воно має такі поля:

- **name**: Імʼя ресурсу параметра.
- **namespace**: Простір імен ресурсу параметра.
- **selector**: Селектор міток для зіставлення кількох ресурсів параметрів.
- **parameterNotFoundAction**: (Обовʼязково) Керує поведінкою, коли вказані параметри не знайдено.

  - **Дозволені значення**:
    - **`Allow`**: Відсутність збігів параметрів розцінюється привʼязкою як успішна валідація.
    - **`Deny`**: Відсутність збігу параметрів обробляється відповідно до `failurePolicy` правила.

Має бути задано один з параметрів `name` або `selector`, але не обидва.

{{< note >}}
Поле `parameterNotFoundAction` у `paramRef` є **обовʼязковим**. Воно визначає дію, яку слід виконати, якщо не знайдено жодного параметра, що відповідає `paramRef`. Якщо його не вказати, привʼязка політики може вважатися недійсною і буде проігнорована або призведе до неочікуваної поведінки.

- **`Allow`**: Якщо встановлено в `Allow`, і жодних параметрів не знайдено, привʼязка розглядає відсутність параметрів як успішну валідацію, і політика вважається пройденою.
- **`Deny`**: Якщо встановлено в `Deny`, і жодних параметрів не знайдено, привʼязка застосовує `failurePolicy` політики. Якщо `failurePolicy` має значення `Fail`, запит буде відхилено.

Переконайтеся, що ви встановили `parameterNotFoundAction` відповідно до бажаної поведінки у разі відсутності параметрів.
{{< /note >}}

#### Обробка відсутніх параметрів з `parameterNotFoundAction` {#handling-missing-parameters-with-parameternotfoundaction}

Під час використання `paramRef` з селектором може статися так, що селектору не відповідатиме жоден параметр. Поле `parameterNotFoundAction` визначає поведінку привʼязки у цьому випадку.

**Приклад:**

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: example-binding
spec:
  policyName: example-policy
  paramRef:
    selector:
      matchLabels:
        environment: test
    parameterNotFoundAction: Allow
  validationActions:
  - Deny
```

### Політика обробки збоїв {#failure-policy}

`failurePolicy` визначає, як обробляються неправильні конфігурації та вирази CEL, обчислення яких у правилі допуску завершується помилкою. Допустимі значення: `Ignore` або `Fail`.

- `Ignore` означає, що помилка під час виклику ValidatingAdmissionPolicy ігнорується, і запит API може продовжуватися.
- `Fail` означає, що помилка під час виклику ValidatingAdmissionPolicy призводить до невдачі допуску та відхилення запиту API.

Зверніть увагу, що `failurePolicy` визначається всередині `ValidatingAdmissionPolicy`:

{{% code_sample language="yaml" file="validatingadmissionpolicy/failure-policy-ignore.yaml" %}}

### Вирази валідації {#validation-expression}

`spec.validations[i].expression` представляє вираз, який буде оцінений за допомогою CEL. Для отримання додаткової інформації див. [Специфікацію мови CEL](https://github.com/google/cel-spec). Вирази CEL мають доступ до вмісту запиту/відповіді допуску, організованого в змінні CEL, а також деяких інших корисних змінних:

- 'object' — Обʼєкт з вхідного запиту. Значення null для запитів DELETE.
- 'oldObject' — Наявний обʼєкт. Значення null для запитів CREATE.
- 'request' — Атрибути [запиту допуску](/docs/reference/config-api/apiserver-admission.v1/#admission-k8s-io-v1-AdmissionRequest).
- 'params' — Ресурс параметра, на який посилається привʼязка правила, яке оцінюється. Значення null, якщо `ParamKind` не вказано.
- `namespaceObject` — Простір імен, як ресурс Kubernetes, до якого належить вхідний обʼєкт. Значення null, якщо вхідний обʼєкт є обʼєктом рівня кластера.
- `authorizer` — Авторизатор CEL. Може використовуватися для виконання перевірок авторизації для принципала (автентифікованого користувача) запиту. Див. [AuthzSelectors](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors) та [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz) в документації бібліотеки Kubernetes CEL для отримання додаткових відомостей.
- `authorizer.requestResource` — Скорочення для перевірки авторизації, налаштоване з ресурсом запиту (група, ресурс, (субресурс), простір імен, імʼя).

У виразах CEL змінні, такі як `object` та `oldObject`, є строго типізованими. Ви можете отримати доступ до будь-якого поля в схемі обʼєкта, наприклад `object.metadata.labels` та полів у `spec`.

Для будь-якого обʼєкта Kubernetes, включаючи безсхемні власні ресурси, CEL гарантує доступ до мінімального набору властивостей: `apiVersion`, `kind`, `metadata.name` та `metadata.generateName`.

Рівність у масивах із типом списку 'set' або 'map' ігнорує порядок елементів, тобто [1, 2] == [2, 1]. Конкатенація у масивах з x-kubernetes-list-type використовує семантику типу списку:

- 'set': `X + Y` виконує обʼєднання, де позиції масиву всіх елементів в `X` зберігаються, а
  елементи `Y`, яких немає в `X`, додаються, зберігаючи їх частковий порядок.
- 'map': `X + Y` виконує злиття, де позиції масиву всіх ключів в `X` зберігаються, але значення
  перезаписуються значеннями в `Y`, коли множини ключів `X` і `Y` перетинаються. Елементи `Y` з ключами, яких немає в `X`, додаються, зберігаючи їх частковий порядок.

#### Приклади виразів валідації {#validation-expression-examples}

| Вираз                                                                                             | Призначення                                                                    |
|---------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `object.minReplicas <= object.replicas && object.replicas <= object.maxReplicas`                  | Перевірка правильного порядку трьох полів, що визначають репліки               |
| `'Available' in object.stateCounts`                                                               | Перевірка наявності запису з ключем 'Available' в map                          |
| `(size(object.list1) == 0) != (size(object.list2) == 0)`                                          | Перевірка, що один із двох списків не порожній, але не обидва                  |
| <code>!('MY_KEY' in object.map1) &#124;&#124; object.map1['MY_KEY'].matches('^[a-zA-Z]*$')</code> | Перевірка значення map для певного ключа, якщо він є в map                     |
| `object.envars.filter(e, e.name == 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$')`               | Перевірка поля 'value' запису у listMap, де значення ключа 'name' - 'MY_ENV'   |
| `has(object.expired) && object.created + object.ttl < object.expired`                             | Перевірка, що дата 'expired' пізніше дати 'create' плюс тривалість 'ttl'       |
| `object.health.startsWith('ok')`                                                                  | Перевірка, що рядок 'health' починається з префікса 'ok'                       |
| `object.widgets.exists(w, w.key == 'x' && w.foo < 10)`                                            | Перевірка, що поле 'foo' запису у listMap з ключем 'x' менше 10                |
| `type(object) == string ? object == '100%' : object == 1000`                                      | Перевірка поля типу int або string на значення int та string                   |
| `object.metadata.name.startsWith(object.prefix)`                                                  | Перевірка, що імʼя обʼєкта має префікс значення іншого поля                    |
| `object.set1.all(e, !(e in object.set2))`                                                         | Перевірка, що два listSet не перетинаються                                     |
| `size(object.names) == size(object.details) && object.names.all(n, n in object.details)`          | Перевірка, що map 'details' має ключі, визначені елементами списку 'names'     |
| `size(object.clusters.filter(c, c.name == object.primary)) == 1`                                  | Перевірка, що властивість 'primary' має лише один випадок в listMap 'clusters' |

Для отримання додаткової інформації щодо правил CEL прочитайте [Supported evaluation on CEL](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#evaluation).

`spec.validation[i].reason` представляє машинночитаний опис причини невдачі цієї валідації. Якщо це перша валідація в списку, яка завершується невдачею, ця причина, а також відповідний код відповіді HTTP використовуються у відповіді HTTP клієнту. Підтримувані зараз причини: `Unauthorized`, `Forbidden`, `Invalid`, `RequestEntityTooLarge`. Якщо не встановлено, `StatusReasonInvalid` використовується у відповіді клієнту.

### Відповідність запитів: `matchConditions` {#matching-requests-matchconditions}

Ви можете визначити _умови відповідності_ для `ValidatingAdmissionPolicy`, якщо вам потрібне детальне фільтрування запитів. Ці умови корисні, якщо ви виявите, що правила відповідності, `objectSelectors` та `namespaceSelectors` все ще не забезпечують потрібного фільтрування. Умови відповідності — це [вирази CEL](/docs/reference/using-api/cel/). Щоб ресурс було оцінено, усі умови відповідності мають повернути true.

Нижче наведено приклад, що ілюструє кілька різних використань умов відповідності:

{{% code_sample file="access/validating-admission-policy-match-conditions.yaml" %}}

Умови відповідності мають доступ до тих самих змінних CEL, що й вирази валідації, за винятком `namespaceObject` та `variables`:

- `namespaceObject` не заповнюється для умов відповідності та завжди має значення null. Щоб вибирати запити на основі міток простору імен, використовуйте `namespaceSelector` у `matchConstraints` правила або у `matchResources` привʼязки. Для перевірки інших полів простору імен використовуйте вираз валідації, де `namespaceObject` доступний.
- На `variables` не можна посилатися в умовах відповідності, оскільки умови відповідності обчислюються раніше за решту правила.

У разі помилки під час обчислення умови відповідності правило не оцінюється. Рішення про відхилення запиту ухвалюється так:

1. Якщо **будь-яка** умова відповідності оцінюється як `false` (незалежно від інших помилок), API-сервер пропускає правило.
2. В іншому випадку:
   - для [`failurePolicy: Fail`](#failure-policy), відхилити запит (без оцінки правил).
   - для [`failurePolicy: Ignore`](#failure-policy), продовжити обробку запиту, але пропустити правило.

### Анотації аудиту {#audit-annotations}

`auditAnnotations` можна використовувати для включення анотацій аудиту у подію аудиту запиту API.

Наприклад, ось правило допуску з анотацією аудиту:

{{% code_sample file="access/validating-admission-policy-audit-annotation.yaml" %}}

Коли запит API перевіряється за цим правилом допуску, отримана подія аудиту буде виглядати так:

```
# Записана подія аудиту
{
    "kind": "Event",
    "apiVersion": "audit.k8s.io/v1",
    "annotations": {
        "demo-policy.example.com/high-replica-count": "Deployment spec.replicas set to 128"
        # інші анотації
        ...
    }
    # інші поля
    ...
}
```

У цьому прикладі анотація буде включена лише тоді, коли `spec.replicas` у Deployment більше 50, в іншому випадку вираз CEL оцінюється як null, і анотація не буде включена.

Зверніть увагу, що ключі анотацій аудиту мають префікс з імʼям `ValidatingAdmissionPolicy` та `/`. Якщо інший контролер допуску, такий як вебхук допуску, використовує точно такий самий ключ анотації аудиту, то значення першого контролера допуску, який включає анотацію аудиту, буде включено в подію аудиту, а всі інші значення будуть ігноруватися.

### Вираз повідомлення {#message-expression}

Щоб повертати більш дружнє повідомлення, коли правило відхиляє запит, ми можемо використовувати вираз CEL для створення повідомлення з `spec.validations[i].messageExpression`. Подібно до виразу валідації, вираз повідомлення має доступ до `object`, `oldObject`, `request`, `params` та `namespaceObject`. На відміну від валідації, вираз повідомлення має повертати рядок.

Наприклад, щоб краще інформувати користувача про причину відхилення, коли правило посилається на параметр, можна використати таку валідацію:

{{% code_sample file="access/deployment-replicas-policy.yaml" %}}

Після створення обʼєкта параметрів, який обмежує кількість реплік до 3, і налаштування привʼязки, коли ми спробуємо створити Deployment з 5 репліками, ми отримаємо таке повідомлення.

```
$ kubectl create deploy --image=nginx nginx --replicas=5
error: failed to create deployment: deployments.apps "nginx" is forbidden: ValidatingAdmissionPolicy 'deploy-replica-policy.example.com' with binding 'demo-binding-test.example.com' denied request: object.spec.replicas must be no greater than 3
```

Це більш інформативно, ніж статичне повідомлення "занадто багато реплік".

Вираз повідомлення має перевагу над статичним повідомленням, визначеним у `spec.validations[i].message`, якщо обидва визначені. Однак, якщо вираз повідомлення не вдається оцінити, буде використано статичне повідомлення. Крім того, якщо вираз повідомлення оцінюється як багаторядковий рядок, результат оцінки буде відкинутий, і використовуватиметься статичне повідомлення, якщо воно присутнє. Зауважте, що статичне повідомлення перевіряється на відповідність багаторядковим рядкам.

### Перевірка типів {#type-checking}

Під час створення або оновлення визначення правила процес валідації аналізує вирази, які він містить, та повідомляє про будь-які синтаксичні помилки, відхиляючи визначення, якщо виявлено помилки. Потім перевіряються змінні, на які є посилання, на наявність помилок типів, включаючи відсутні поля та плутанину типів, відносно відповідних типів `spec.matchConstraints`. Результат перевірки типів можна отримати з `status.typeChecking`. Наявність `status.typeChecking` вказує на завершення перевірки типів, а порожнє `status.typeChecking` означає, що помилок не виявлено.

Наприклад, для такого визначення правила:

{{< code_sample language="yaml" file="validatingadmissionpolicy/typechecking.yaml" >}}

Статус надасть таку інформацію:

```yaml
status:
  typeChecking:
    expressionWarnings:
    - fieldRef: spec.validations[0].expression
      warning: |-
        apps/v1, Kind=Deployment: ERROR: <input>:1:7: undefined field 'replicas'
         | object.replicas > 1
         | ......^
```

Якщо в `spec.matchConstraints` збігається кілька ресурсів, всі ресурси, які мають збіг, будуть перевірені. Наприклад, таке визначення правила:

{{% code_sample language="yaml" file="validatingadmissionpolicy/typechecking-multiple-match.yaml" %}}

матиме кілька типів та результат перевірки типів кожного типу у повідомленні про попередження.

```yaml
status:
  typeChecking:
    expressionWarnings:
    - fieldRef: spec.validations[0].expression
      warning: |-
        apps/v1, Kind=Deployment: ERROR: <input>:1:7: undefined field 'replicas'
         | object.replicas > 1
         | ......^
        apps/v1, Kind=ReplicaSet: ERROR: <input>:1:7: undefined field 'replicas'
         | object.replicas > 1
         | ......^
```

Перевірка типів має такі обмеження:

- Відсутнє зіставлення за шаблоном. Якщо `spec.matchConstraints.resourceRules` містить `"*"` у будь-якому з `apiGroups`, `apiVersions` або `resources`, типи, які відповідають `"*"`, не будуть перевірені.
- Кількість збігів типів обмежена до 10. Це потрібно, щоб правило, у якому вручну вказано забагато типів, не споживало надмірних обчислювальних ресурсів. У порядку зростання групи, версії, а потім ресурсу 11-та та наступні комбінації ігноруються.
- Перевірка типів не впливає на поведінку правил жодним чином. Навіть якщо під час перевірки типів виявлено помилки, правило й надалі оцінюватиметься. Якщо під час оцінки виникають помилки, результат визначатиме політика обробки збоїв.
- Перевірка типів не застосовується до CRD, включаючи відповідні типи CRD та посилання на `paramKind`. Підтримка CRD зʼявиться у майбутній версії.

### Склад змінних {#variable-composition}

Якщо вираз стає занадто складним або частина виразу повторно використовується та має високі обчислювальні витрати, ви можете винести частину виразів у змінні. Змінна — це вираз з назвою, на який можна посилатися пізніше в `variables` в інших виразах.

```yaml
spec:
  variables:
    - name: foo
      expression: "'foo' in object.spec.metadata.labels ? object.spec.metadata.labels['foo'] : 'default'"
  validations:
    - expression: variables.foo == 'bar'
```

Змінна оцінюється ліниво (lazily), під час першого посилання на неї. Про будь-яку помилку, що виникає під час оцінки, буде повідомлено під час обчислення виразу, що посилається на змінну. Як результат, так і можлива помилка запамʼятовуються і лише один раз враховуються у вартості виконання.

Порядок змінних важливий, оскільки змінна може посилатися на інші змінні, які визначені перед нею. Це упорядкування запобігає циклічним посиланням.

Нижче наведено складніший приклад, який вимагає, щоб імена репозиторіїв образів відповідали середовищу, визначеному в просторі імен.

{{< code_sample file="access/image-matches-namespace-environment.policy.yaml" >}}

З правилом, привʼязаним до простору імен `default`, який має мітку `environment: prod`, така спроба створити Deployment буде відхилена.

```shell
kubectl create deploy --image=dev.example.com/nginx invalid
```

Повідомлення про помилку буде схоже на таке.

```console
error: failed to create deployment: deployments.apps "invalid" is forbidden: ValidatingAdmissionPolicy 'image-matches-namespace-environment.policy.example.com' with binding 'demo-binding-test.example.com' denied request: only prod images are allowed in namespace default
```

## Види API, що виключені з перевірки допуску {#api-kinds-exempt-from-admission-validation}

Існують певні види API, на які не поширюються перевірки валідації під час допуску. Наприклад, ви не можете створити ValidatingAdmissionPolicy, яка запобігає змінам у ValidatingAdmissionPolicyBindings.

Такі види конфігурацій допуску не підлягають політикам, створеним через REST API, щоб запобігти циклічним залежностям:

* [ValidatingAdmissionPolicies](/docs/reference/kubernetes-api/admissionregistration/validating-admission-policy-v1/)
* [ValidatingAdmissionPolicyBindings](/docs/reference/kubernetes-api/admissionregistration/validating-admission-policy-binding-v1/)
* MutatingAdmissionPolicies
* MutatingAdmissionPolicyBindings

{{< note >}}
Коли налаштовано через [контроль допуску на основі маніфестів](/docs/reference/access-authn-authz/manifest-admission-control/), ValidatingAdmissionPolicy може перехоплювати типи конфігурацій допуску, наведені вище. Це обходить обмеження, які зазвичай застосовуються до політик, створених через REST API, дозволяючи перевіряти навіть конфігурації допуску та ресурси, що потребують підвищеної безпеки. На відміну від REST API, неправильна політика на основі маніфестів, що перехоплює ці ресурси, не буде незворотною, оскільки вона визначена на диску, а не через API.
{{< /note >}}

Крім того, такі непостійні (віртуальні) види API автентифікації та авторизації не підлягають жодним політикам допуску, включно з політиками на основі маніфестів, оскільки їх перехоплення могло б заблокувати кластер від власного шляху автентифікації та авторизації:

* [TokenReviews](/docs/reference/kubernetes-api/definitions/token-review-v1-authentication/)
* [SelfSubjectReviews](/docs/reference/kubernetes-api/definitions/self-subject-review-v1-authentication/)
* [LocalSubjectAccessReviews](/docs/reference/kubernetes-api/definitions/local-subject-access-review-v1-authorization/)
* [SelfSubjectAccessReviews](/docs/reference/kubernetes-api/definitions/self-subject-access-review-v1-authorization/)
* [SelfSubjectRulesReviews](/docs/reference/kubernetes-api/definitions/self-subject-rules-review-v1-authorization/)
* [SubjectAccessReviews](/docs/reference/kubernetes-api/definitions/subject-access-review-v1-authorization/)

Починаючи з Kubernetes v1.37, [вебхуки допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/#excluded-virtual-resources) також типово виключають ці віртуальні ресурси.
