---
title: Загальна мова виразів у Kubernetes
content_type: concept
weight: 35
min-kubernetes-server-version: 1.25
---

<!-- overview -->

[Загальна мова виразів (Common Expression Language, CEL)](https://github.com/google/cel-go) використовується в API Kubernetes для оголошення правил валідації, політик та інших обмежень чи умов.

Вирази CEL оцінюються безпосередньо на {{< glossary_tooltip text="сервері API" term_id="kube-apiserver" >}}, що робить CEL зручним альтернативним рішенням для зовнішніх механізмів, таких як вебхуки, для багатьох випадків розширення функціональності. Ваші вирази CEL продовжують виконуватись, поки компонент сервера API у складі панелі управління залишається доступним.

<!-- body -->

## Огляд мови {#language-overview}

[Мова CEL](https://github.com/google/cel-spec/blob/master/doc/langdef.md) має простий синтаксис, який схожий на вирази в C, C++, Java, JavaScript і Go.

CEL була розроблена для вбудовування в застосунки. Кожна "програма" CEL — це один вираз, який обраховується до одного значення. Вирази CEL зазвичай короткі "одноразові", що добре вбудовуються в строкові поля ресурсів API Kubernetes.

Вхідні дані для програми CEL — це "змінні". Кожне поле API Kubernetes, яке містить CEL, декларує в документації API, які змінні доступні для використання для цього поля. Наприклад, у полі `x-kubernetes-validations[i].rules` у CustomResourceDefinitions доступні змінні `self` і `oldSelf`, що відносяться до попереднього та поточного стану даних власного ресурсу користувача, які потрібно перевірити за допомогою виразу CEL. Інші поля API Kubernetes можуть оголошувати різні змінні. Дивіться документацію API для полів API, щоб дізнатися, які змінні доступні для цього поля.

Приклади виразів CEL:

{{< table caption="Приклади виразів CEL та їх призначення" >}}
| Правило                                                                            | Призначення                                                                       |
|------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| `self.minReplicas <= self.replicas && self.replicas <= self.maxReplicas`           | Перевірити, що три поля, що визначають репліки, розташовані в правильному порядку  |
| `'Available' in self.stateCounts`                                                  | Перевірити, що в map існує запис з ключем 'Available'                             |
| `(self.list1.size() == 0) != (self.list2.size() == 0)`                             | Перевірити, що один із двох списків не порожній, але не обидва одночасно           |
| `self.envars.filter(e, e.name = 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$'))`   | Перевірити поле 'value' у запису listMap, де поле ключа 'name' дорівнює 'MY_ENV'   |
| `has(self.expired) && self.created + self.ttl < self.expired`                      | Перевірити, що дата 'expired' є пізніше дати 'created' плюс тривалість 'ttl'       |
| `self.health.startsWith('ok')`                                                     | Перевірити, що строкове поле 'health' має префікс 'ok'                             |
| `self.widgets.exists(w, w.key == 'x' && w.foo < 10)`                               | Перевірити, що властивість 'foo' елемента listMap з ключем 'x' менше 10            |
| `type(self) == string ? self == '99%' : self == 42`                                | Перевірити поле типу int-або-string для обох випадків: int та string               |
| `self.metadata.name == 'singleton'`                                                | Перевірити, що імʼя обʼєкта відповідає конкретному значенню (робить його унікальним)|
| `self.set1.all(e, !(e in self.set2))`                                              | Перевірити, що два списки (listSets) не перетинаються                              |
| `self.names.size() == self.details.size() && self.names.all(n, n in self.details)` | Перевірити, що map 'details' має ключі, які відповідають елементам у списку 'names'|
| `self.details.all(key, key.matches('^[a-zA-Z]*$'))`                                | Перевірити ключі map 'details'                                                    |
| `self.details.all(key, self.details[key].matches('^[a-zA-Z]*$'))`                  | Перевірити значення map 'details'                                                 |
{{< /table >}}

## Опції CEL, особливості мови та бібліотеки {#cel-options-language-features-and-libraries}

CEL налаштовується з наступними опціями, бібліотеками та особливостями мови, введеними у зазначених версіях Kubernetes:

| Опція, бібліотека або особливість мови CEL | Включено | Доступність |
|--------------------------------------------|----------|-------------|
| [Стандартні макроси](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros) | `has`, `all`, `exists`, `exists_one`, `map`, `filter` | Усі версії Kubernetes |
| [Стандартні функції](https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions) | Дивіться [офіційний список стандартних визначень](https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions)| Усі версії Kubernetes |
| [Однорідні агрегаційні літерали](https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#HomogeneousAggregateLiterals) | | Усі версії Kubernetes |
| [Часовий пояс UTC за замовчуванням](https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#DefaultUTCTimeZone) | | Усі версії Kubernetes |
| [Рання перевірка декларацій](https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#EagerlyValidateDeclarations) | | Усі версії Kubernetes |
| [бібліотека розширених рядків](https://pkg.go.dev/github.com/google/cel-go/ext#Strings), Версія 1 | `charAt`, `indexOf`, `lastIndexOf`, `lowerAscii`, `upperAscii`, `replace`, `split`, `join`, `substring`, `trim` | Усі версії Kubernetes |
| Бібліотека списків Kubernetes | Дивіться [бібліотеку списків Kubernetes](#kubernetes-list-library) | Усі версії Kubernetes |
| Бібліотека регулярних виразів Kubernetes | Дивіться [бібліотеку регулярних виразів Kubernetes](#kubernetes-regex-library) | Усі версії Kubernetes |
| Бібліотека URL Kubernetes | Дивіться [бібліотеку URL Kubernetes](#kubernetes-url-library) | Усі версії Kubernetes |
| Бібліотека авторизації Kubernetes | Дивіться [бібліотеку авторизації Kubernetes](#kubernetes-authorizer-library) | Усі версії Kubernetes |
| Бібліотека кількостей Kubernetes | Дивіться [бібліотеку кількостей Kubernetes](#kubernetes-quantity-library) | Версії Kubernetes 1.29+ |
| Опційні типи CEL | Дивіться [опційні типи CEL](https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#OptionalTypes) | Версії Kubernetes 1.29+ |
| Порівняння чисел різних типів CEL| Дивіться [порівняння чисел різних типів CEL](https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#CrossTypeNumericComparisons) | Версії Kubernetes 1.29+ |

Функції CEL, особливості та налаштування мови підтримують відкат панелі управління Kubernetes. Наприклад, _опційні значення CEL_ були введені у Kubernetes 1.29, і лише сервери API цієї версії або новіші прийматимуть запити на запис виразів CEL, які використовують _опційні значення CEL_. Однак, коли кластер відкочується до версії Kubernetes 1.28, вирази CEL, що використовують "опційні значення CEL", які вже збережені в ресурсах API, продовжуватимуть правильно оцінюватись.

## Бібліотеки CEL Kubernetes {#kubernetes-cel-libraries}

Крім спільнотних бібліотек CEL, Kubernetes включає бібліотеки CEL, які доступні у всіх місцях використання CEL в Kubernetes.

### Бібліотека списків Kubernetes {#kubernetes-list-library}

Бібліотека списків включає `indexOf` та `lastIndexOf`, які працюють аналогічно функціям рядків з такими самими назвами. Ці функції повертають перший або останній індекс елемента у списку.

Бібліотека списків також включає `min`, `max` та `sum`. Сума підтримується для всіх типів чисел, а також для типу тривалості. Мінімум та максимум підтримуються для всіх типів, що можна порівняти.

Також надається функція `isSorted` для зручності та підтримується для всіх типів, які можна порівняти.

Приклади:

{{< table caption="Приклади виразів CEL, що використовують функції бібліотеки списків" >}}
| Вираз CEL                                                                     | Призначення                                                   |
|--------------------------------------------------------------------------------|---------------------------------------------------------------|
| `names.isSorted()`                                                             | Перевірити, що список імен зберігається в алфавітному порядку |
| `items.map(x, x.weight).sum() == 1.0`                                          | Перевірити, що "ваги" списку обʼєктів дорівнюють 1.0          |
| `lowPriorities.map(x, x.priority).max() < highPriorities.map(x, x.priority).min()` | Перевірити, що два набори пріоритетів не перекриваються    |
| `names.indexOf('should-be-first') == 1`                                        | Вимагати, щоб перше імʼя у списку було певним значенням     |
{{< /table >}}

Для отримання додаткової інформації дивіться [бібліотеку списків Kubernetes](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Lists) godoc.

### Бібліотека регулярних виразів Kubernetes {#kubernetes-regex-library}

Крім функції `matches`, наданої стандартною бібліотекою CEL, бібліотека регулярних виразів надає функції `find` та `findAll`, що дозволяють виконувати ширший спектр операцій з регулярними виразами.

Приклади:

{{< table caption="Приклади виразів CEL, що використовують функції бібліотеки регулярних виразів" >}}
| Вираз CEL                                              | Призначення                                        |
|---------------------------------------------------------|----------------------------------------------------|
| `"abc 123".find('[0-9]+')`                             | Знайти перше число у рядку                       |
| `"1, 2, 3, 4".findAll('[0-9]+').map(x, int(x)).sum() < 100` | Перевірити, що сума чисел у рядку менше 100 |
{{< /table >}}

Для отримання додаткової інформації дивіться [бібліотеку регулярних виразів Kubernetes](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Regex) godoc.

### Бібліотека URL Kubernetes {#kubernetes-url-library}

Для спрощення та безпечної обробки URL надані наступні функції:

- `isURL(string)` перевіряє, чи є рядок рядком дійсним URL з пакетом [Go net/url](https://pkg.go.dev/net/url#URL). Рядок повинен бути абсолютним URL.
- `url(string) URL` конвертує рядок в URL або викликає помилку, якщо рядок не є дійсним URL.

Після розбору за допомогою функції `url`, отриманий обʼєкт URL має наступні методи доступу: `getScheme`, `getHost`, `getHostname`, `getPort`, `getEscapedPath` та `getQuery`.

Приклади:

{{< table caption="Приклади виразів CEL, що використовують функції бібліотеки URL" >}}
| Вираз CEL                                                               | Призначення                                    |
|--------------------------------------------------------------------------|------------------------------------------------|
| `url('https://example.com:80/').getHost()`                               | Отримати частину хосту 'example.com:80' URL |
| `url('https://example.com/path with spaces/').getEscapedPath()`          | Повертає '/path%20with%20spaces/'               |
{{< /table >}}

Для отримання додаткової інформації дивіться [бібліотеку URL Kubernetes](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#URLs) godoc.

### Бібліотека авторизатора Kubernetes {#kubernetes-authorizer-library}

Для виразів CEL в API, де доступна змінна типу `Authorizer`, авторизатор може використовуватися для виконання перевірок авторизації для принципала (автентифікованого користувача) запиту.

Перевірки ресурсів API виконуються наступним чином:

1. Вкажіть групу та ресурс для перевірки: `Authorizer.group(string).resource(string) ResourceCheck`.
2. Опційно викличте будь-яку комбінацію наступних функцій побудови для подальшого обмеження перевірки авторизації. Зверніть увагу, що ці функції повертають тип отримувача та можуть бути зʼєднані ланцюгом:

   - `ResourceCheck.subresource(string) ResourceCheck`
   - `ResourceCheck.namespace(string) ResourceCheck`
   - `ResourceCheck.name(string) ResourceCheck`

3. Викличте `ResourceCheck.check(verb string) Decision`, щоб виконати перевірку авторизації.
4. Викличте `allowed() bool` або `reason() string`, щоб переглянути результат перевірки авторизації.

Не-ресурсна авторизація виконується так:

1. Вкажіть лише шлях: `Authorizer.path(string) PathCheck`.
2. Викличте `PathCheck.check(httpVerb string) Decision`, щоб виконати перевірку авторизації.
3. Викличте `allowed() bool` або `reason() string`, щоб переглянути результат перевірки авторизації.

Для виконання перевірки авторизації для службового облікового запису:

- `Authorizer.serviceAccount(namespace string, name string) Authorizer`

{{< table caption="Приклади виразів CEL, що використовують функції бібліотеки авторизатора" >}}
| Вираз CEL | Призначення |
|-----------|-------------|
| `authorizer.group('').resource('pods').namespace('default').check('create').allowed()` | Повертає true, якщо принципалу (користувачу або службовому обліковому запису) дозволено створювати Podʼи у просторі імен 'default'. |
| `authorizer.path('/healthz').check('get').allowed()` | Перевіряє, чи авторизований принципал (користувач або службовий обліковий запис) виконує HTTP GET-запити до шляху API /healthz. |
| `authorizer.serviceAccount('default', 'myserviceaccount').resource('deployments').check('delete').allowed()` | Перевіряє, чи службовий обліковий запис має дозвіл на видалення deployments. |
{{< /table >}}

{{< feature-state state="alpha" for_k8s_version="v1.31" >}}

З увімкненою альфа-функцією `AuthorizeWithSelectors`, до перевірок авторизації можна додавати селектори полів і міток.

{{< table caption="Приклади CEL виразів із використанням функцій авторизації для селекторів" >}}
| CEL вираз | Призначення |
|-----------|-------------|
| `authorizer.group('').resource('pods').fieldSelector('spec.nodeName=mynode').check('list').allowed()`        | Повертає true, якщо користувач або службовий обліковий запис має дозвіл на отримання списку Podʼів із селектором полів `spec.nodeName=mynode`. |
| `authorizer.group('').resource('pods').labelSelector('example.com/mylabel=myvalue').check('list').allowed()` | Повертає true, якщо користувач або службовий обліковий запис має дозвіл на отримання списку Podʼів із селектором міток `example.com/mylabel=myvalue`. |
{{< /table >}}

Для отримання додаткової інформації дивіться [бібліотеку Kubernetes Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz) та [бібліотеку Kubernetes AuthzSelectors](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors) godoc.

### Бібліотека кількості Kubernetes {#kubernetes-quantity-library}

У Kubernetes 1.28 додана підтримка обробки рядків кількості (наприклад, 1,5G, 512k, 20Mi).

- `isQuantity(string)` перевіряє, чи є рядок дійсною кількістю відповідно до [Кількості ресурсів Kubernetes](https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity).
- `quantity(string) Quantity` конвертує рядок у кількість або викликає помилку, якщо рядок не є дійсною кількістю.

Після розбору за допомогою функції `quantity`, отриманий обʼєкт кількості має наступний набір методів:

{{< table caption="Набір доступних методів для кількості" >}}
| Метод               | Повертає тип    | Опис |
|---------------------|-----------------|------|
| `isInteger()`       | bool            | Повертає true, якщо `asInteger` може бути викликано без помилки. |
| `asInteger()`       | int             | Повертає представлення поточного значення як int64, якщо це можливо, або викликає помилку, якщо конвертація призводить до переповнення або втрати точності. |
| `asApproximateFloat()` | float        | Повертає представлення кількості як float64, що може втратити точність. |
| `sign()`            | int             | Повертає `1`, якщо кількість додатня, `-1`, якщо вона відʼємна, або `0`, якщо вона нуль. |
| `add(<Quantity>)`   | Quantity        | Повертає суму двох кількостей. |
| `add(<int>)`        | Quantity        | Повертає суму кількості та цілого числа. |
| `sub(<Quantity>)`   | Quantity        | Повертає різницю між двома кількостями. |
| `sub(<int>)`        | Quantity        | Повертає різницю між кількістю та цілим числом. |
| `isLessThan(<Quantity>)` | bool      | Повертає true, якщо отримувач менше операнта. |
| `isGreaterThan(<Quantity>)` | bool   | Повертає true, якщо отримувач більше операнта. |
| `compareTo(<Quantity>)` | int         | Порівнює отримувача з операндом та повертає 0, якщо вони рівні, 1, якщо отримувач більший або -1, якщо отримувач менший за операнд. |
{{< /table >}}

Приклади:

{{< table caption="Приклади виразів CEL, що використовують функції бібліотеки кількості" >}}
| Вираз CEL                                                            | Призначення                                                    |
|-----------------------------------------------------------------------|----------------------------------------------------------------|
| `quantity("500000G").isInteger()`                                    | Перевірка, чи конвертація в ціле число викликає помилку.     |
| `quantity("50k").asInteger()`                                        | Точна конвертація в ціле число.                                |
| `quantity("9999999999999999999999999999999999999G").asApproximateFloat()` | Втратна конвертація в плаваючий рядок.                         |
| `quantity("50k").add(quantity("20k"))`                                | Додати дві кількості.                                          |
| `quantity("50k").sub(20000)`                                          | Відняти ціле число від кількості.                              |
| `quantity("50k").add(20).sub(quantity("100k")).sub(-50000)`           | Ланцюгове додавання та віднімання цілих чисел та кількостей. |
| `quantity("200M").compareTo(quantity("0.2G"))`                        | Порівняти дві кількості.                                       |
| `quantity("150Mi").isGreaterThan(quantity("100Mi"))`                  | Перевірити, чи кількість більша за отримувача.                |
| `quantity("50M").isLessThan(quantity("100M"))`                        | Перевірити, чи кількість менша за отримувача.                 |
{{< /table >}}

## Перевірка типів {#type-checking}

CEL — це [поступово типізована мова](https://github.com/google/cel-spec/blob/master/doc/langdef.md#gradual-type-checking).

Деякі поля API Kubernetes містять повністю перевірені типи CEL-виразів. Наприклад, [Правила валідації власних ресурсів](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules) повністю перевірені за типом.

Деякі поля API Kubernetes містять частково перевірені типи CEL-виразів. Частково перевірений вираз — це вираз, в якому деякі змінні статично типізовані, а інші — динамічно типізовані. Наприклад, в CEL-виразах [ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/), змінна `request` має тип, але змінна `object` динамічно типізована. У звʼязку з цим вираз, що містить `request.namex`, не пройде перевірку типів, оскільки поле `namex` не визначене. Однак `object.namex` пройде перевірку типів навіть тоді, коли поле `namex` не визначене для типів ресурсів, на які посилається `object`, оскільки `object` динамічно типізований.

Макрос `has()` в CEL можна використовувати у виразах CEL для перевірки доступності поля динамічно типізованої змінної перед спробою доступу до значення поля. Наприклад:

```cel
has(object.namex) ? object.namex == 'special' : request.name == 'special'
```

## Інтеграція системи типів {#type-system-integration}

{{< table caption="Таблиця, що показує взаємозвʼязок між типами OpenAPIv3 та CEL" >}}
| Тип OpenAPIv3                                       | Тип CEL |
|-----------------------------------------------------|---------|
| 'object' з Properties                               | object / "тип повідомлення" (`type(<object>)` обчислюється як `selfType<uniqueNumber>.path.to.object.from.self` |
| 'object' з AdditionalProperties                     | map |
| 'object' з x-kubernetes-embedded-type               | object / "тип повідомлення", 'apiVersion', 'kind', 'metadata.name' і 'metadata.generateName' включені в схему |
| 'object' з x-kubernetes-preserve-unknown-fields     | object / "тип повідомлення", невідомі поля НЕ доступні у виразі CEL |
| x-kubernetes-int-or-string                          | обʼєднання int або string,  `self.intOrString < 100 \|\| self.intOrString == '50%'` обчислюється як true для `50` і `"50%"` |
| 'array'                                             | list |
| 'array' з x-kubernetes-list-type=map                | list з базованими на map рівноправністю та унікальними ключами |
| 'array' з x-kubernetes-list-type=set                | list з базованими на set рівноправністю та унікальними елементами |
| 'boolean'                                           | boolean |
| 'number' (усі формати)                              | double |
| 'integer' (усі формати)                             | int (64) |
| _немає еквівалента_                                 | uint (64) |
| 'null'                                              | null_type |
| 'string'                                            | string |
| 'string' з format=byte (base64 encoded)             | bytes |
| 'string' з format=date                              | timestamp (google.protobuf.Timestamp) |
| 'string' з format=datetime                          | timestamp (google.protobuf.Timestamp) |
| 'string' з format=duration                          | duration (google.protobuf.Duration) |
{{< /table >}}

Також дивіться: [Типи CEL](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#values), [Типи OpenAPI](https://swagger.io/specification/#data-types), [Структурні схеми Kubernetes](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).

Порівняння рівності для масивів з `x-kubernetes-list-type` типу `set` або `map` ігнорує порядок елементів. Наприклад, `[1, 2] == [2, 1]` якщо масиви представляють значення Kubernetes `set`.

Конкатенація для масивів з `x-kubernetes-list-type` використовує семантику типу списку:

`set`
: `X + Y` виконує обʼєднання, де позиції елементів у `X` зберігаються, а не перетинаючі елементи у `Y` додаються, зберігаючи їх частковий порядок.

`map`
: `X + Y` виконує обʼєднання, де позиції ключів у `X` зберігаються, але значення перезаписуються значеннями у `Y`, коли ключові множини `X` і `Y` перетинаються. Елементи у `Y` з неперетинаючими ключами додаються, зберігаючи їх частковий порядок.

## Екранування {#escaping}

Тільки імена властивостей ресурсів Kubernetes форми `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` доступні з CEL. Доступні імена властивостей екрануються згідно з наступними правилами при доступі у виразі:

{{< table caption="Таблиця правил екранування ідентифікаторів CEL" >}}
| екрануюча послідовність | еквівалент імені властивості                                                               |
|-------------------------|--------------------------------------------------------------------------------------------|
| `__underscores__`       | `__`                                                                                       |
| `__dot__`               | `.`                                                                                        |
| `__dash__`              | `-`                                                                                        |
| `__slash__`             | `/`                                                                                        |
| `__{keyword}__`         | [**ЗАРЕЗЕРВОВАНЕ** ключове слово CEL](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#syntax) |
{{< /table >}}

Коли ви екрануєте будь-яке з **ЗАРЕЗЕРВОВАНИХ** ключових слів CEL, збіг повинен точно відповідати імені властивості та  використовувати екранування з підкресленням (наприклад, `int` у слові `sprint` не буде екрановано, і це не буде необхідно).

Приклади екранування:

{{< table caption="Приклади екранованих ідентифікаторів CEL" >}}
| імʼя властивості | правило з екранованим імʼям властивості |
|------------------|-----------------------------------------|
| `namespace`      | `self.__namespace__ > 0`                |
| `x-prop`         | `self.x__dash__prop > 0`                |
| `redact__d`      | `self.redact__underscores__d > 0`       |
| `string`         | `self.startsWith('kube')`               |
{{< /table >}}

## Обмеження ресурсів {#resource-constraints}

CEL не є повноцінною мовою Тюрінга і пропонує різноманітні засоби безпеки для обмеження часу виконання. Функції обмеження ресурсів CEL забезпечують зворотний звʼязок розробникам щодо складності виразів та допомагають захистити сервер API від надмірного споживання ресурсів під час оцінювання. Ці функції використовуються для запобігання надмірного споживання ресурсів сервера API під час виконання CEL.

Ключовим елементом функцій обмеження ресурсів є _одиниця вартості_, яку CEL визначає як спосіб відстеження використання ЦП. Одиниці вартості незалежні від системного навантаження та апаратного забезпечення. Одиниці вартості також є детермінованими; для будь-якого заданого виразу CEL та вхідних даних, оцінка виразу інтерпретатором CEL завжди призведе до однакової вартості.

Багато з основних операцій CEL мають фіксовані витрати. Найпростіші операції, такі як порівняння (наприклад, `<`), мають вартість 1. Деякі мають вищу фіксовану вартість, наприклад, оголошення літералів списку мають фіксовану базову вартість 40 одиниць вартості.

Виклики функцій, реалізованих у рідному коді, оцінюються на основі часової складності операції. Наприклад, операції, що використовують регулярні вирази, такі як `match` та `find`, оцінюються з використанням приблизної вартості `length(regexString)*length(inputString)`. Приблизна вартість відображає найгірший випадок часової складності реалізації RE2 в Go.

### Бюджет вартості під час виконання {#runtime-cost-budget}

Усі вирази CEL, які оцінюються Kubernetes, обмежені бюджетом вартості під час виконання. Бюджет вартості під час виконання — це оцінка фактичного використання ЦП, що обчислюється шляхом інкрементування лічильника одиниць вартості під час інтерпретації виразу CEL. Якщо інтерпретатор CEL виконає занадто багато інструкцій, бюджет вартості під час виконання буде перевищено, виконання виразу буде зупинено і результатом стане помилка.

Деякі ресурси Kubernetes визначають додатковий бюджет вартості під час виконання, який обмежує виконання декількох виразів. Якщо загальна вартість виразів перевищує бюджет, виконання виразів буде зупинено і результатом стане помилка. Наприклад, валідація власного ресурсу користувача  має бюджет вартості під час виконання _за одну валідацію_ для всіх [Правил Валідації](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules), які оцінюються для валідації власного ресурсу.

### Оцінювані обмеження вартості {#estimated-cost-limits}

Для деяких ресурсів Kubernetes, сервер API також може перевірити, чи не буде найгірший випадок оціненого часу виконання виразів CEL надто дорогим для виконання. Якщо так, сервер API запобігає записуванню виразу CEL у ресурсі API, відхиляючи операції створення або оновлення, що містять вираз CEL у ресурсі API. Ця функція пропонує сильнішу гарантію, що вирази CEL, записані у ресурс API, будуть оцінені під час виконання без перевищення бюджету вартості під час виконання.
