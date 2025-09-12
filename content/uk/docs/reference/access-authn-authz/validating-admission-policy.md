---
title: Правила перевірки допуску
content_type: concept
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.30" >}}

Ця сторінка надає огляд правил перевірки допуску.

<!-- body -->

## Що таке правила перевірки допуску? {#what-is-validating-admission-policy}

Правила перевірки допуску пропонують декларативну, вбудовану альтернативу веб-хукам перевірки допуску.

Правила перевірки допуску використовують мову загальних виразів (Common Expression Language, CEL). Правила перевірки допуску мають високу налаштовуваність, що дозволяє авторам визначати правила, які можуть бути параметризовані та обмежені ресурсами за необхідності адміністраторами кластера.

## Які ресурси складають правила {#what-resources-make-a-policy}

Зазвичай правило складається з трьох ресурсів:

- `ValidatingAdmissionPolicy` описує абстрактну логіку правил (наприклад: "ці праивла переконуються, що певна мітка встановлена у певне значення"

- Ресурс параметра надає інформацію для `ValidatingAdmissionPolicy`, щоб зробити його конкретним висловленням (наприклад, "мітка `owner` повинна бути встановлена на щось, що закінчується на `.company.com`"). Вбудований тип, такий як ConfigMap або CRD, визначає схему ресурсу параметра. Обʼєкти `ValidatingAdmissionPolicy` вказують, який Kind вони очікують для свого ресурсу параметру.

- `ValidatingAdmissionPolicyBinding` повʼязує вищезазначені ресурси разом і надає обмеження області дії. Якщо вам потрібно вимагати встановлення мітки `owner` для `Pods`, привʼязка визначає, де ви будете вказувати це обмеження.

Для того щоб правила мали ефект, обовʼязково повинні бути визначені принаймні `ValidatingAdmissionPolicy` та відповідне `ValidatingAdmissionPolicyBinding`.

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

Спробувавши створити Deployment з репліками, які не відповідають виразу валідації, буде повернута помилка з повідомленням:

```none
ValidatingAdmissionPolicy 'demo-policy.example.com' with binding 'demo-binding-test.example.com' denied request: failed expression: object.spec.replicas <= 5
```

Вище наведено простий приклад використання ValidatingAdmissionPolicy без налаштованого параметра.

#### Дії валідації {#validation-actions}

Кожний `ValidatingAdmissionPolicyBinding` повинен вказати одну або декілька `validationActions`, щоб визначити, як `validations` правила будуть застосовані.

Підтримувані `validationActions`:

- `Deny`: Невдалий результат валідації призводить до відхиленого запиту.
- `Warn`: Невдалий результат валідації повідомляється клієнту запиту як [попередження](/blog/2020/09/03/warnings/).
- `Audit`: Невдалий результат валідації включається в подію аудиту для запиту до API.

Наприклад, щоб одночасно попереджувати клієнтів про невдалий результат валідації та аудитувати невдалий результат валідації, використовуйте:

```yaml
validationActions: [Warn, Audit]
```

`Deny` та `Warn` не можуть бути використані разом, оскільки ця комбінація надмірно дублює невдалий результат валідації як у тілі відповіді API, так і в HTTP заголовках попередження.

`validation`, який оцінюється як false, завжди застосовується відповідно до цих дій. Невдачі, визначені полем `failurePolicy`, застосовуються відповідно до цих дій тільки у випадку, якщо `failurePolicy` встановлено на `Fail` (або не вказано), інакше невдачі ігноруються.

Див. [Анотації аудиту: невдалий результат валідації](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure) для отримання додаткових відомостей щодо аудиту невдалих результатів валідації.

### Ресурси параметрів {#parameter-resources}

Ресурси параметрів дозволяють відокремити конфігурацію правил від їх визначення. Правило може визначити `paramKind`, який визначає GVK ресурсу параметра, а потім привʼязка правила повʼязує його за іменем (через `policyName`) з певним ресурсом параметра через `paramRef`.

Якщо потрібна конфігурація параметра, наведено приклад ValidatingAdmissionPolicy з конфігурацією параметра.

{{% code_sample language="yaml" file="validatingadmissionpolicy/policy-with-param.yaml" %}}

Поле `spec.paramKind` ValidatingAdmissionPolicy вказує на вид використовуваних ресурсів для параметризації цього правила. У цьому прикладі це налаштовано за допомогою ресурсів ReplicaLimit. Зверніть увагу в цьому прикладі, як вираз CEL посилається на параметри через змінну CEL params, наприклад, `params.maxReplicas`. `spec.matchConstraints` вказує, для яких ресурсів ця правило призначена для валідації. Зверніть увагу, що як параметр можуть використовуватися і стандартні типи, такі як `ConfigMap`.

Поля `spec.validations` містять вирази CEL. Якщо вираз оцінюється як false, то валідаційна перевірка здійснюється відповідно до поля `spec.failurePolicy`.

Автор правил перевірки допуску відповідає за надання параметра CRD ReplicaLimit.

Для налаштування правил перевірки допуску для використання в кластері створюються привʼязка та ресурс параметра. Наведено приклад ValidatingAdmissionPolicyBinding який використовує **кластерний** параметр — той самий параметр буде використовуватися для валідації кожного запиту до ресурсу, який відповідає привʼязці:

{{% code_sample language="yaml" file="validatingadmissionpolicy/binding-with-param.yaml" %}}

Зверніть увагу, що ця привʼязка застосовує параметр до правил для всіх ресурсів, які знаходяться в середовищі `test`.

Ресурс параметра може мати наступний вигляд:

{{% code_sample language="yaml" file="validatingadmissionpolicy/replicalimit-param.yaml" %}}

Цей ресурс параметра правил обмежує Deployments до максимуму 3 репліки.

В правилі допуску може бути кілька привʼязок. Щоб привʼязати всі інші середовища до обмеження maxReplicas 100, створіть інший ValidatingAdmissionPolicyBinding:

{{% code_sample language="yaml" file="validatingadmissionpolicy/binding-with-param-prod.yaml" %}}

Зверніть увагу, що ця привʼязка застосовує різний параметр до ресурсів, які не знаходяться в середовищі `test`.

Та має ресурс параметра:

{{% code_sample language="yaml" file="validatingadmissionpolicy/replicalimit-param-prod.yaml" %}}

Для кожного запиту на допуск, сервер API оцінює вирази CEL кожної комбінації (правило, привʼязка, параметр), які відповідають запиту. Для того, щоб запит був прийнятий, він повинен пройти **всі** оцінки.

Якщо кілька привʼязок відповідають запиту, правило буде оцінено для кожної, і вони всі повинні пройти оцінку, щоб правило вважали пройденим.

Якщо кілька параметрів відповідають одній привʼязці, правила будуть оцінені для кожного параметра, і вони також повинні всі пройти, щоб привʼязка вважалася пройденою. Привʼязки можуть мати критерії відповідності, що перекриваються. Правило оцінюється для кожної відповідної комбінації привʼязка-параметр. Правило може бути оцінено навіть кілька разів, якщо йому відповідає кілька привʼязок, або одна привʼязка, яка відповідає кільком параметрам.

Обʼєкт `params`, який представляє ресурс параметра, не буде встановлений, якщо ресурс параметра не був привʼязаний, тому для правил, які потребують ресурсу параметра, може бути корисно додати перевірку, щоб забезпечити його привʼязку. Ресурс параметра не буде привʼязаний і `params` буде null, якщо `paramKind` правила або `paramRef` привʼязки не вказані.

Для випадків використання, що потребують конфігурації параметра, ми рекомендуємо додати перевірку параметра в `spec.validations[0].expression`:

```none
- expression: "params != null"
  message: "params missing but required to bind to this policy"
```

#### Необовʼязкові параметри {#optional-parameters}

Буває зручно мати можливість мати необовʼязкові параметри як частину ресурсу параметра і валідувати їх лише в разі їх присутності. У CEL є `has()`, який перевіряє, чи існує переданий ключ. Крім того, CEL реалізує булеве скорочення. Якщо перша половина логічного ОБО відноситься до true, то друга половина не оцінюється (оскільки результат усього ОБО буде true в будь-якому випадку).

Поєднуючи ці дві можливості, ми можемо забезпечити можливість валідації необовʼязкових параметрів:

`!has(params.optionalNumber) || (params.optionalNumber >= 5 && params.optionalNumber <= 10)`

Тут спочатку ми перевіряємо, що необовʼязковий параметр присутній за допомогою `!has(params.optionalNumber)`.

- Якщо `optionalNumber` не був визначений, то вираз скорочується, оскільки
  `!has(params.optionalNumber)` оцінюється як true.
- Якщо `optionalNumber` був визначений, тоді друга половина CEL виразу буде
  оцінена, і `optionalNumber` буде перевірений, щоб забезпечити, що він містить значення від 5 до 10 включно.

#### Параметри на рівні простору імен {#per-namespace-parameters}

Як автор ValidatingAdmissionPolicy та його ValidatingAdmissionPolicyBinding, ви можете вибрати, чи вказувати параметри на рівні кластера або на рівні простору імен. Якщо ви вказуєте `namespace` для `paramRef` привʼязки, панель управління шукає параметри лише в цьому просторі імен.

Проте, якщо `namespace` не вказано в ValidatingAdmissionPolicyBinding, сервер API може шукати відповідні параметри в просторі імен, до якого відноситься запит. Наприклад, якщо ви робите запит на зміну ConfigMap у просторі імен `default`, і існує відповідна ValidatingAdmissionPolicyBinding без вказаного `namespace`, то сервер API шукає обʼєкт параметра в `default`. Цей дизайн дозволяє конфігурувати правило, що залежить від простору імен ресурсу, який обробляється, для отримання більш точного контролю.

#### Селектор параметрів {#parameter-selectors}

Крім вказання параметра у привʼязці за допомогою `name`, ви можете вибрати замість цього вказати селектор міток, таким чином, всі ресурси `paramKind` правила та `namespace` параметра (якщо застосовується), які відповідають селектору міток, вибираються для оцінки. Див. {{< glossary_tooltip text="селектор" term_id="selector">}} для отримання додаткової інформації про те, як селектори міток відбирають ресурси.

Якщо умову виконується для декількох параметрів, правила оцінюються для кожного знайденого параметра, а результати будуть оцінені разом через логічне І (AND).

Якщо надано `namespace`, для вибору допускаються лише обʼєкти `paramKind` у вказаному просторі імен. В іншому випадку, коли `namespace` порожній, а `paramKind` обмежений простором імен, використовується `namespace`, використаний у запиті для допуску.

#### Перевірка авторизації {#authorization-check}

Ми ввели перевірку авторизації для ресурсів параметрів. Очікується, що користувач матиме доступ на читання до ресурсів, на які посилається `paramKind` у `ValidatingAdmissionPolicy` та `paramRef` у `ValidatingAdmissionPolicyBinding`.

Зверніть увагу, що якщо ресурс у `paramKind` не вдасться знайти через restmapper, потрібен доступ на читання до всіх ресурсів груп.

#### `paramRef`

Поле `paramRef` визначає ресурс параметра, який використовується політикою. Воно має наступні поля:

- **name**: The name of the parameter resource.
- **namespace**: Простір імен ресурсу параметра.
- **selector**: Селектор мітки для зіставлення декількох ресурсів параметрів.
- **parameterNotFoundAction**: (Обовʼязково) Керує поведінкою, коли вказані параметри не знайдено.

  - **Дозволені значення**:
    - **`Allow`**: Відсутність збігів параметрів розцінюється привʼязкою як успішна валідація.
    - **`Deny`**: Відсутність збігу параметрів є предметом `failurePolicy` політики.

Має бути задано один з параметрів `name` або `selector`, але не обидва.

{{< note >}}
Поле `parameterNotFoundAction` у `paramRef` є **обовʼязковим**. Воно визначає дію, яку слід виконати, якщо не знайдено жодного параметра, що відповідає `paramRef`. Якщо його не вказати, привʼязка політики може вважатися недійсною і буде проігнорована або призведе до неочікуваної поведінки.

- **`Allow`**: Якщо встановлено в `Allow`, і жодних параметрів не знайдено, привʼязка розглядає відсутність параметрів як успішну валідацію, і політика вважається пройденою.
- **`Deny`**: Якщо встановлено в `Deny`, і жодних параметрів не знайдено, привʼязка застосовує `failurePolicy` політики. Якщо `failurePolicy` має значення `Fail`, запит буде відхилено.

Переконайтеся, що ви встановили `parameterNotFoundAction` відповідно до бажаної поведінки при відсутності параметрів.
{{< /note >}}

#### Обробка відсутніх параметрів з `parameterNotFoundAction` {#handling-missing-parameters-with-parameternotfoundaction}

При використанні `paramRef` з селектором може статися так, що селектору не відповідатиме жоден параметр. Поле `parameterNotFoundAction` визначає поведінку привʼязки у цьому випадку.

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

### Правило помилок {#failure-policy}

`failurePolicy` визначає, як обробляються неправильні конфігурації та вирази CEL, що викликають помилку в правилах перевірки допуску. Допустимі значення: `Ignore` або `Fail`.

- `Ignore` означає, що помилка під час виклику ValidatingAdmissionPolicy ігнорується, і запит API може продовжуватися.
- `Fail` означає, що помилка під час виклику ValidatingAdmissionPolicy призводить до відмови в прийнятті та відхилення запиту API.

Зверніть увагу, що `failurePolicy` визначається всередині `ValidatingAdmissionPolicy`:

{{% code_sample language="yaml" file="validatingadmissionpolicy/failure-policy-ignore.yaml" %}}

### Вирази валідації {#validation-expression}

`spec.validations[i].expression` представляє вираз, який буде оцінений за допомогою CEL. Для отримання додаткової інформації див. [Специфікацію мови CEL](https://github.com/google/cel-spec). Вирази CEL мають доступ до вмісту запиту/відповіді допуску, організованого в змінні CEL, а також деяких інших корисних змінних:

- 'object' — Обʼєкт з вхідного запиту. Значення null для запитів DELETE.
- 'oldObject' — Наявний обʼєкт. Значення null для запитів CREATE.
- 'request' — Атрибути [запиту допуску](/docs/reference/config-api/apiserver-admission.v1/#admission-k8s-io-v1-AdmissionRequest).
- 'params' — Ресурс параметра, на який посилається привʼязка правила, яке оцінюється. Значення null, якщо `ParamKind` не вказано.
- `namespaceObject` — Простір імен, як ресурс Kubernetes, до якого належить вхідний обʼєкт. Значення null, якщо вхідний обʼєкт має область видимості кластера.
- `authorizer` — Авторизатор CEL. Може використовуватися для виконання перевірок авторизації для принципала (автентифікованого користувача) запиту. Див. [AuthzSelectors](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors) та [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz) в документації бібліотеки Kubernetes CEL для отримання додаткових відомостей.
- `authorizer.requestResource` — Скорочення для перевірки авторизації, налаштоване з ресурсом запиту (група, ресурс, (субресурс), простір імен, імʼя).

У виразах CEL змінні, такі як `object` та `oldObject`, є строго типізованими. Ви можете отримати доступ до будь-якого поля в схемі обʼєкта, наприклад `object.metadata.labels` та полів у `spec`.

Для будь-якого обʼєкта Kubernetes, включаючи безсхемні власні ресурси, CEL гарантує доступ до мінімального набору властивостей: `apiVersion`, `kind`, `metadata.name` та `metadata.generateName`.

Рівність у масивах із типом списку 'set' або 'map' ігнорує порядок елементів, тобто [1, 2] == [2, 1]. Конкатенація у масивах з x-kubernetes-list-type використовує семантику типу списку:

- 'set': `X + Y` виконує обʼєднання, де позиції масиву всіх елементів в `X` зберігаються, а
  неперетинаючися елементи в `Y` додаються, зберігаючи їх частковий порядок.
- 'map': `X + Y` виконує злиття, де позиції масиву всіх ключів в `X` зберігаються, але значення
  перезаписуються значеннями в `Y`, коли множини ключів `X` і `Y` перетинаються. Елементи в `Y` з неперетинаючимися ключами додаються, зберігаючи їх частковий порядок.

#### Приклади виразів валідації {#validation-expression-examples}

| Вираз                                                                                   | Призначення                                                                 |
|----------------------------------------------------------------------------------------------| ------------                                                                      |
| `object.minReplicas <= object.replicas && object.replicas <= object.maxReplicas`             | Перевірка правильного порядку трьох полів, що визначають репліки        |
| `'Available' in object.stateCounts`                                                          | Перевірка наявності запису з ключем 'Available' в map                   |
| `(size(object.list1) == 0) != (size(object.list2) == 0)`                                     | Перевірка, що один із двох списків не порожній, але не обидва            |
| <code>!('MY_KEY' in object.map1) &#124;&#124; object['MY_KEY'].matches('^[a-zA-Z]*$')</code> | Перевірка значення map для певного ключа, якщо він є в map            |
| `object.envars.filter(e, e.name == 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$')`          | Перевірка поля 'value' запису у listMap, де значення ключа 'name' - 'MY_ENV'  |
| `has(object.expired) && object.created + object.ttl < object.expired`                        | Перевірка, що дата 'expired' пізніше дати 'create' плюс тривалість 'ttl'       |
| `object.health.startsWith('ok')`                                                             | Перевірка, що рядок 'health' починається з префікса 'ok'                              |
| `object.widgets.exists(w, w.key == 'x' && w.foo < 10)`                                       | Перевірка, що поле 'foo' запису у listMap з ключем 'x' менше 10              |
| `type(object) == string ? object == '100%' : object == 1000`                                 | Перевірка поля типу int або string на значення int та string              |
| `object.metadata.name.startsWith(object.prefix)`                                             | Перевірка, що імʼя обʼєкта має префікс значення іншого поля              |
| `object.set1.all(e, !(e in object.set2))`                                                    | Перевірка, що два listSet не перетинаються                                           |
| `size(object.names) == size(object.details) && object.names.all(n, n in object.details)`     | Перевірка, що map 'details' має ключі, визначені елементами списку 'names'           |
| `size(object.clusters.filter(c, c.name == object.primary)) == 1`                             | Перевірка, що властивість 'primary' має лише один випадок в listMap 'clusters'           |

Для отримання додаткової інформації щодо правил CEL прочитайте [Supported evaluation on CEL](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#evaluation).

`spec.validation[i].reason` представляє машинночитаний опис причини невдачі цієї валідації. Якщо це перша валідація в списку, яка завершується невдачею, ця причина, а також відповідний код відповіді HTTP використовуються у відповіді HTTP клієнту. Підтримувані зараз причини: `Unauthorized`, `Forbidden`, `Invalid`, `RequestEntityTooLarge`. Якщо не встановлено, `StatusReasonInvalid` використовується у відповіді клієнту.

### Відповідність запитів: `matchConditions`

Ви можете визначити _умови відповідності_ для `ValidatingAdmissionPolicy`, якщо вам потрібно дотримуватися детального фільтрування запитів. Ці умови корисні, якщо ви виявите, що правила відповідності, `objectSelectors` та `namespaceSelectors` все ще не забезпечують потрібного фільтрування. Умови відповідності — це [вирази CEL](/docs/reference/using-api/cel/). Усі умови відповідності повинні оцінюватися як true для ресурсу, який має бути оцінений.

Нижче наведено приклад, що ілюструє кілька різних використань умов відповідності:

{{% code_sample file="access/validating-admission-policy-match-conditions.yaml" %}}

Умови відповідності мають доступ до тих самих змінних CEL, що й вирази валідації.

У випадку помилки при оцінці умови відповідності правило не оцінюється. Рішення про відхилення запиту визначається наступним чином:

1. Якщо **будь-яка** умова відповідності оцінюється як `false` (незалежно від інших помилок), сервер API пропускає політику.
2. В іншому випадку:
   - для [`failurePolicy: Fail`](#failure-policy), відхилити запит (без оцінки правил).
   - для [`failurePolicy: Ignore`](#failure-policy), продовжити з запитом, але пропустити політику.

### Анотації аудиту {#audit-annotations}

`auditAnnotations` можна використовувати для включення анотацій аудиту в аудит-подію запиту API.

Наприклад, ось правила допуску з анотацією аудиту:

{{% code_sample file="access/validating-admission-policy-audit-annotation.yaml" %}}

Коли запит API перевіряється за цим правилом допуску, отримана подія аудиту буде виглядати так:

```json
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

Зверніть увагу, що ключі анотацій аудиту мають префікс з імʼям `ValidatingAdmissionPolicy` та `/`. Якщо інший контролер допуску, такий як вебхук допуску, використовує точно такий самий ключ анотації аудиту, то значення першого контролера допуску, який включає анотацію аудиту, буде включено в аудит-подію, а всі інші значення будуть ігноруватися.

### Вираз повідомлення {#message-expression}

Щоб повертати більш дружнє повідомлення, коли правило відхиляє запит, ми можемо використовувати вираз CEL для створення повідомлення з `spec.validations[i].messageExpression`. Подібно до виразу валідації, вираз повідомлення має доступ до `object`, `oldObject`, `request`, `params` та `namespaceObject`. На відміну від валідації, вираз повідомлення має повертати рядок.

Наприклад, щоб краще інформувати користувача про причину відхилення, коли правило посилається на параметр, ми можемо мати наступну валідацію:

{{% code_sample file="access/deployment-replicas-policy.yaml" %}}

Після створення обʼєкту параметрів, який обмежує репліки до 3 та налаштування привʼязки, коли ми спробуємо створити Deployment з 5 репліками, ми отримаємо наступне повідомлення.

```shell
$ kubectl create deploy --image=nginx nginx --replicas=5
error: failed to create deployment: deployments.apps "nginx" is forbidden: ValidatingAdmissionPolicy 'deploy-replica-policy.example.com' with binding 'demo-binding-test.example.com' denied request: object.spec.replicas must be no greater than 3
```

Це більш інформативно, ніж статичне повідомлення "занадто багато реплік".

Вираз повідомлення має перевагу над статичним повідомленням, визначеним у `spec.validations[i].message`, якщо обидва визначені. Однак, якщо вираз повідомлення не вдається оцінити, буде використано статичне повідомлення. Крім того, якщо вираз повідомлення оцінюється як багаторядковий рядок, результат оцінки буде відкинутий, і використовуватиметься статичне повідомлення, якщо воно присутнє. Зауважте, що статичне повідомлення перевіряється на відповідність багаторядковим рядкам.

### Перевірка типів {#type-checking}

Під час створення або оновлення визначення правил валідації процес валідації аналізує вирази, які він містить, та повідомляє про будь-які синтаксичні помилки, відхиляючи визначення, якщо виявлено помилки. Потім перевіряються змінні, на які є посилання, на наявність помилок типів, включаючи відсутні поля та плутанину типів, відносно відповідних типів `spec.matchConstraints`. Результат перевірки типів можна отримати з `status.typeChecking`. Наявність `status.typeChecking` вказує на завершення перевірки типів, а порожнє `status.typeChecking` означає, що помилок не виявлено.

Наприклад, з наступним визначенням правил:

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

Якщо в `spec.matchConstraints` збігається кілька ресурсів, всі ресурси, які мають збіг, будуть перевірені. Наприклад, наступне визначення правил:

{{% code_sample language="yaml" file="validatingadmissionpolicy/typechecking-multiple-match.yaml" %}}

буде мати декілька типів та результат перевірки типів кожного типу у повідомленні про попередження.

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
- Кількість збігів типів обмежена до 10. Це робиться для запобігання використанню правил, що вручну вказує занадто багато типів, що може споживати занадто багато обчислювальних ресурсів. Порядок спадання групи, версії, а потім ресурсу, 11-а комбінація та після буде ігноруватися.
- Перевірка типів не впливає на поведінку правил жодним чином. Навіть якщо під час перевірки типів виявляються помилки, політика буде продовжувати оцінюватися. Якщо під час оцінки виникають помилки, політика вибере свій результат.
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

Змінна оцінюється ліниво (lazily), під час першого посилання на неї. Про будь-яку помилку, що виникає під час оцінки, буде повідомлено під час оцінки вказаного виразу, на який посилається змінна. Як результат, так і можлива помилка запамʼятовуються і лише один раз враховуються при оцінці під час виконання.

Порядок змінних важливий, оскільки змінна може посилатися на інші змінні, які визначені перед нею. Це упорядкування запобігає циклічним посиланням.

Наведено більш складний приклад змінних, що забезпечує відповідність імен репозиторіїв образів середовищу, визначеному у просторі імен.

{{< code_sample file="access/image-matches-namespace-environment.policy.yaml" >}}

З правилом, привʼязаним до простору імен `default`, який має мітку `environment: prod`, спроба створити Deployment буде відхилена.

```shell
kubectl create deploy --image=dev.example.com/nginx invalid
```

Повідомлення про помилку буде схоже на таке.

```console
error: failed to create deployment: deployments.apps "invalid" is forbidden: ValidatingAdmissionPolicy 'image-matches-namespace-environment.policy.example.com' with binding 'demo-binding-test.example.com' denied request: only prod images are allowed in namespace default
```

## Види API, що виключені з перевірки допуску {#api-kinds-exempt-from-admission-validation}

Існують певні типи API, які виключені з перевірки допуску під час валідації. Наприклад, ви не можете створити ValidatingAdmissionPolicy, яка запобігає змінам у ValidatingAdmissionPolicyBindings.

Список типів API, які виключені з перевірки, наведено нижче:

- [ValidatingAdmissionPolicies]({{< relref "/docs/reference/kubernetes-api/policy-resources/validating-admission-policy-v1/" >}})
- [ValidatingAdmissionPolicyBindings]({{< relref "/docs/reference/kubernetes-api/policy-resources/validating-admission-policy-binding-v1/" >}})
- MutatingAdmissionPolicies
- MutatingAdmissionPolicyBindings
- [TokenReviews]({{< relref "/docs/reference/kubernetes-api/authentication-resources/token-review-v1/" >}})
- [LocalSubjectAccessReviews]({{< relref "/docs/reference/kubernetes-api/authorization-resources/local-subject-access-review-v1/" >}})
- [SelfSubjectAccessReviews]({{< relref "/docs/reference/kubernetes-api/authorization-resources/self-subject-access-review-v1/" >}})
- [SelfSubjectReviews]({{< relref "/docs/reference/kubernetes-api/authentication-resources/self-subject-review-v1/" >}})
