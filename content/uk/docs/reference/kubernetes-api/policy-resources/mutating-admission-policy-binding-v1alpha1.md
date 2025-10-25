---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1alpha1"
  import: "k8s.io/api/admissionregistration/v1alpha1"
  kind: "MutatingAdmissionPolicyBinding"
content_type: "api_reference"
description: "MutatingAdmissionPolicyBinding звʼязує MutatingAdmissionPolicy з параметризованими ресурсами."
title: "MutatingAdmissionPolicyBinding v1alpha1"
weight: 10
auto_generated: true
---

`apiVersion: admissionregistration.k8s.io/v1alpha1`

`import "k8s.io/api/admissionregistration/v1alpha1"`

## MutatingAdmissionPolicyBinding {#MutatingAdmissionPolicyBinding}

MutatingAdmissionPolicyBinding звʼязує MutatingAdmissionPolicy з параметризованими ресурсами. MutatingAdmissionPolicyBinding і необовʼязковий параметр resource разом визначають, як адміністратори кластерів налаштовують політики для кластерів.

Для заданого запиту на допуск кожна привʼязка призведе до того, що її політика буде оцінена N разів, де N дорівнює 1 для політик/привʼязок, які не використовують параметри, інакше N — це кількість параметрів, обраних привʼязкою. Кожна оцінка обмежена [бюджетом витрат на виконання](/docs/reference/using-api/cel/#runtime-cost-budget).

Додавання/видалення політик, привʼязок або параметрів не може вплинути на те, чи знаходиться дана комбінація (політика, привʼязка, параметр) в межах власного бюджету CEL.

---

- **apiVersion**: admissionregistration.k8s.io/v1alpha1

- **kind**: MutatingAdmissionPolicyBinding

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта; Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.

- **spec** (MutatingAdmissionPolicyBindingSpec)

  Визначення бажаної поведінки привʼязки MutatingAdmissionPolicyBinding.

  <a name="MutatingAdmissionPolicyBindingSpec"></a>
  *MutatingAdmissionPolicyBindingSpec — це специфікація MutatingAdmissionPolicyBinding.*

  - **spec.matchResources** (MatchResources)

    matchResources обмежує, які ресурси збігаються з цією привʼязкою і можуть бути змінені нею. Зауважте, що якщо matchResources відповідає ресурсу, ресурс також повинен відповідати matchConstraints і matchConditions політики, перш ніж його можна буде змінити. Якщо matchResources не встановлено, це не обмежує зіставлення ресурсів, і тільки matchConstraints і matchConditions політики повинні збігатися для ресурсу, який буде змінено. Крім того, matchResources.resourceRules є необовʼязковими і не обмежують співставлення, якщо їх не встановлено. Зауважте, що це відрізняється від matchConstraints MutatingAdmissionPolicy, де resourceRules є обовʼязковими. Операції CREATE, UPDATE і CONNECT дозволені.  Операція DELETE може не мати збігу. '*' відповідає операціям CREATE, UPDATE і CONNECT.

    <a name="MatchResources"></a>
    *MatchResources вирішує, чи застосовувати політику контролю доступу до обʼєкта на основі того, чи відповідає він критеріям відповідності. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає обом критеріям, він виключається)*

    - **spec.matchResources.excludeResourceRules** ([]NamedRuleWithOperations)

      *Atomic: буде замінено під час злиття*

      ExcludeResourceRules описує, які операції над якими ресурсами/субресурсами не повинні цікавити політику. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає обом правилам, він виключається)

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations — це кортеж операцій та ресурсів з іменами ресурсів.*

      - **spec.matchResources.excludeResourceRules.apiGroups** ([]string)

        *Atomic: буде замінено під час злиття*

        APIGroups — це групи API, до яких належать ресурси. ‘*' — це всі групи. Якщо '*' присутній, довжина фрагмента повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchResources.excludeResourceRules.apiVersions** ([]string)

        *Atomic: буде замінено під час злиття*

        APIVersions — це версії API, до яких належать ресурси. '\*' — всі версії. Якщо '\*' присутній, довжина фрагмента повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchResources.excludeResourceRules.operations** ([]string)

        *Atomic: буде замінено під час злиття*

        Операції - це операції, які цікавлять хук допуску — CREATE, UPDATE, DELETE, CONNECT або \* для всіх цих операцій і будь-яких майбутніх операцій допуску, які будуть додані. Якщо '\*' присутній, довжина фрагмента повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchResources.excludeResourceRules.resourceNames** ([]string)

        *Atomic: буде замінено під час злиття*

        ResourceNames — необовʼязковий білий список імен, до яких застосовується правило.  Порожній список означає, що дозволено все.

      - **spec.matchResources.excludeResourceRules.resources** ([]string)

        *Atomic: буде замінено під час злиття*

        Ресурси — це список ресурсів, до яких застосовується це правило.

        Наприклад: 'pods' означає podʼи. 'pods/log' означає підресурс журналу podʼів. '*' означає всі ресурси, але не підресурси. 'pods/*' означає всі підресурси podʼів. '*/scale' означає всі підресурси scale. '*/*' означає всі ресурси та їхні підресурси.

        Якщо присутній спецсимвол, правило перевірки гарантує, що ресурси не перетинаються один з одним.

        Залежно від обʼєкта, що охоплює, підресурси можуть бути заборонені. Обовʼязковий.

      - **spec.matchResources.excludeResourceRules.scope** (string)

        scope задає область дії цього правила. Допустимими значеннями є "Cluster", "Namespace" і "\*". "Cluster" означає, що цьому правилу відповідатимуть лише ресурси, масштабовані у кластері. Обʼєкти API простору імен є кластерними. "Namespaced" означає, що цьому правилу відповідатимуть лише ресурси простору імен. "\*" означає, що немає обмежень на область видимості. Підресурси відповідають області видимості їх батьківського ресурсу. Стандартно використовується "\*".

    - **spec.matchResources.matchPolicy** (string)

      matchPolicy визначає, як список "MatchResources" використовується для зіставлення вхідних запитів. Допустимі значення: "Exact" або "Equivalent".

      - Exact: збіг запиту лише у тому випадку, якщо він точно відповідає вказаному правилу. Наприклад, якщо розгортання можуть бути змінені через apps/v1, apps/v1beta1 і extensions/v1beta1, але "rules" включають лише `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, політика допуску не розглядає запити до apps/v1beta1 або extensions/v1beta1 API груп.

      - Equivalent: збіг запиту, якщо він змінює ресурс, перелічений у правилах, навіть через іншу групу або версію API. Наприклад, якщо розгортання можуть бути змінені через apps/v1, apps/v1beta1 і extensions/v1beta1, а "rules" включають тільки `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, політика допуску **розглядає** запити до apps/v1beta1 або extensions/v1beta1 API груп. API сервер транслює запити так щоб вони відповідали ресурсам API за потреби.

      Стандартне значення "Equivalent"

    - **spec.matchResources.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      NamespaceSelector вирішує, чи застосовувати політику контролю доступу до обʼєкта на основі того, чи відповідає простір імен цього обʼєкта селектору. Якщо обʼєкт сам є простором імен, співставлення виконується на основі object.metadata.labels. Якщо обʼєкт є іншим ресурсом кластера, він ніколи не оминає політику.

      Наприклад, щоб запустити веб-хук на всіх обʼєктах, чий простір імен не асоційований з "runlevel", рівним "0" або "1", ви маєте встановити селектор наступним чином:

      ```cel
      "namespaceSelector": {
        "matchExpressions": [
          {
            "key": "runlevel",
            "operator": "NotIn",
            "values": [
              "0",
              "1"
            ]
          }
        ]
      }
      ```

      Якщо натомість ви хочете запустити політику лише на обʼєктах, чий простір імен повʼязано з "environment" "prod" або "staging", ви маєте встановити селектор наступним чином:

      ```cel
      "namespaceSelector": {
        "matchExpressions": [
          {
            "key": "environment",
            "operator": "In",
            "values": [
              "prod",
              "staging"
            ]
          }
        ]
      }
      ```

      Дивіться [https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/](/docs/concepts/overview/working-with-objects/labels/) щоб дізнатись про більше прикладів селектора міток.

      Стандартно використовується порожній LabelSelector, який відповідає всьому.

    - **spec.matchResources.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      ObjectSelector вирішує, чи запускати політику на основі того, чи мають обʼєкти відповідні мітки. ObjectSelector порівнюється з oldObject і newObject, які будуть надіслані до виразу політики (CEL), і вважається, що вони збігаються, якщо будь-який з обʼєктів збігається з селектором. Нульовий обʼєкт (oldObject у випадку створення або newObject у випадку видалення) або обʼєкт, який не може мати міток (наприклад, обʼєкт DeploymentRollback або обʼєкт PodProxyOptions), не вважається таким, що збігається з селектором. Використовуйте селектор обʼєктів, тільки якщо вебхук є активним, оскільки кінцеві користувачі можуть пропустити вебхук допуску, встановивши мітки. Стандартно використовується порожній LabelSelector, який відповідає всьому.

    - **spec.matchResources.resourceRules** ([]NamedRuleWithOperations)

      *Atomic: буде замінено під час злиття*

      ResourceRules описує, яким операціям на яких ресурсах/субресурсах відповідає політика допуску. Політика дбає про операцію, якщо вона відповідає *будь-якому* правилу.

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations — це кортеж операцій та ресурсів з іменами ресурсів.*

      - **spec.matchResources.resourceRules.apiGroups** ([]string)

        *Atomic: буде замінено під час злиття*

        APIGroups — це групи API, до яких належать ресурси. '\*' — це всі групи. Якщо присутній '\*', довжина фрагмента повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchResources.resourceRules.apiVersions** ([]string)

        *Atomic: буде замінено під час злиття*

        APIVersions — версії API, до яких належать ресурси. '\*' — це всі версії. Якщо присутній '\*', довжина фрагмента повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchResources.resourceRules.operations** ([]string)

        *Atomic: буде замінено під час злиття*

        Операції - це операції, які цікавлять хук допуску: CREATE, UPDATE, DELETE, CONNECT або \* для всіх цих операцій і будь-яких майбутніх операцій допуску, які будуть додані. Якщо присутній символ '\*', довжина фрагмента повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchResources.resourceRules.resourceNames** ([]string)

        *Atomic: буде замінено під час злиття*

        ResourceNames — необовʼязковий білий список імен, до яких застосовується правило.  Порожній список означає, що дозволено все.

      - **spec.matchResources.resourceRules.resources** ([]string)

        *Atomic: буде замінено під час злиття*

        Ресурси — це список ресурсів, до яких застосовується це правило.

        Наприклад: 'pods' означає podʼи. 'pods/log' означає підресурс журналу podʼів. '\*' означає всі ресурси, але не підресурси. 'pods/\*' означає всі підресурси podʼів. '\*/scale' означає всі підресурси scale. '\*/\*' означає всі ресурси та їхні підресурси.

        Якщо присутній спецсимвол, правило перевірки гарантує, що ресурси не перетинаються один з одним.

        Залежно від обʼєкта, що охоплює, підресурси можуть бути заборонені. Обовʼязковий.

      - **spec.matchResources.resourceRules.scope** (string)

        scope визначає область застосування цього правила. Допустимі значення — "Cluster", "Namespaced" та "\*" "Cluster" означає, що правило буде застосовано тільки до ресурсів на рівні кластера. API обʼєкти простору імен є ресурсами на рівні кластера. "Namespaced" означає, що правило буде застосовано тільки до ресурсів простору імен. "\*" означає, що немає обмежень на область застосування. Субресурси відповідають області застосування свого батьківського ресурсу. Стандартне значення — "\*".

  - **spec.paramRef** (ParamRef)

    paramRef визначає ресурс параметрів, який використовується для налаштування політики контролю допуску. Він має вказувати на ресурс типу, вказаного у spec.ParamKind звʼязаної політики MutatingAdmissionPolicy. Якщо в політиці вказано ParamKind, а ресурс, на який посилається ParamRef, не існує, це привʼязування вважається неправильно налаштованим і застосовується FailurePolicy для MutatingAdmissionPolicy. Якщо в політиці не вказано ParamKind, то це поле ігнорується, і правила оцінюються без параметра.

    <a name="ParamRef"></a>
    *ParamRef описує, як знайти параметри, які будуть використані як вхідні дані для виразів правил, що застосовуються привʼязкою політики.*

    - **spec.paramRef.name** (string)

      `name` — імʼя ресурсу, на який посилаються.

      `name` і `selector` є взаємовиключними властивостями. Якщо одне з них встановлено, то інше має бути пустим.

    - **spec.paramRef.namespace** (string)

      namespace — простір імен ресурсу, на який посилаються. Дозволяє обмежити пошук параметрів певним простором імен. Застосовується як до поля `name`, так і до поля `selector`.

      Параметр для кожного простору імен можна використовувати, вказавши у політиці `paramKind`, обмежений простором імен, і залишивши це поле порожнім.

      - Якщо `paramKind` є кластерним параметром, це поле ПОВИННО бути пустим. Встановлення цього поля призведе до помилки конфігурації.

      - Якщо `paramKind` залежить від простору імен, простір імен обʼєкта, який оцінюється на допуск, буде використано, якщо це поле залишити без значення. Зверніть увагу, що якщо залишити це поле порожнім, привʼязка не повинна відповідати жодному ресурсу, масштабованому на кластері, що призведе до помилки.

    - **spec.paramRef.parameterNotFoundAction** (string)

      Параметр `parameterNotFoundAction` керує поведінкою звʼязування, коли ресурс існує, імʼя або селектор є дійсними, але звʼязування не знайшло жодного параметра, який би збігався з ним. Якщо встановлено значення `Allow`, то відсутність знайдених параметрів не вважатиметься успішною перевіркою привʼязки. Якщо встановлено значення `Deny`, то жоден з параметрів не буде підпадати під дію політики `failurePolicy` політики.

      Допустимими значеннями є `Allow` або `Deny` Стандартне значення `Deny`.

    - **spec.paramRef.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      Selector можна використовувати для зіставлення декількох обʼєктів параметрів на основі їхніх міток. Вкажіть селектор: {} для пошуку всіх ресурсів типу ParamKind.

      Якщо знайдено декілька параметрів, всі вони оцінюються за допомогою виразів політики, а результати додаються разом.

      Одне з `name` або `selector` має бути задано, але `name` і `selector` є взаємовиключними властивостями. Якщо одна з них встановлена, інша має бути порожньою.

  - **spec.policyName** (string)

    policyName посилається на імʼя MutatingAdmissionPolicy, до якого привʼязується MutatingAdmissionPolicyBinding. Якщо ресурс, на який посилається, не існує, привʼязка вважається недійсною і буде проігнорована.

## MutatingAdmissionPolicy {#MutatingAdmissionPolicy}

MutatingAdmissionPolicy описує визначення модифікаційної політики допуску, яка змінює обʼєкт, що потрапляє в ланцюжок допуску.

---

- **apiVersion** (string)

  APIVersion визначає версійовану схему цього представлення обʼєкта. Сервери повинні конвертувати визнані схеми до останнього внутрішнього значення, і можуть відхилити невизнані значення. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  Kind — це рядкове значення, що представляє ресурс REST, який представляє цей обʼєкт. Сервери можуть отримати це з точки доступу, на яку клієнт надсилає запити. Не може бути оновлено. У форматі CamelCase. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта; Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.

- **spec** (MutatingAdmissionPolicySpec)

  Специфікація бажаної поведінки MutatingAdmissionPolicy.

  <a name="MutatingAdmissionPolicySpec"></a>
  *MutatingAdmissionPolicySpec — це специфікація бажаної поведінки політики допуску.*

  - **spec.failurePolicy** (string)

    failurePolicy визначає, як обробляти невдачі для admission policy. Невдачі можуть виникати через помилки розбору виразів CEL, помилки перевірки типів, помилки виконання та невірні або неправильно налаштовані визначення політики або звʼязувань.

    Політика вважається недійсною, якщо spec.paramKind посилається на відсутній Kind. Звʼязок вважається недійсним, якщо spec.paramRef.name посилається на нвідсутній ресурс.

    failurePolicy не визначає, як обробляються перевірки, які оцінюються як false.

    Коли failurePolicy встановлено на Fail, ValidatingAdmissionPolicyBinding validationActions визначають, як оцінюються невдачі.

    Допустимі значення: Ignore або Fail. Стандартне значення — Fail.

  - **spec.matchConditions** ([]MatchCondition)

    *Patch strategy: обʼєднання за ключем `name`*

    *Map: унікальні значення ключа name будуть збережені під час злиття*

    matchConditions — список умов, які повинні бути виконані для валідації запиту. Умови збігу фільтрують запити, які вже були перевірені за допомогою matchConstraints. Порожній список matchConditions відповідає всім запитам. Допускається максимум 64 умови співпадіння.

    Якщо надано обʼєкт параметра, до нього можна отримати доступ через дескриптор `params` так само, як і до виразів перевірки.

    Логіка точного збігу наступна (по порядку):
      1. Якщо БУДЬ-ЯКА умова збігу має значення FALSE, політика пропускається.
      2. Якщо ВСІ умови збігу мають значення TRUE, політика оцінюється.
      3. Якщо будь-яка умова збігу має значення помилки (але жодна з них не має значення FALSE):
         - Якщо failurePolicy=Fail, відхилити запит
         - Якщо failurePolicy=Ignore, політика пропускається

    <a name="MatchCondition"></a>
    **

    - **spec.matchConditions.expression** (string), обовʼязково

      Expression представляє вираз, який буде оцінюватися CEL. Повинен оцінюватися як bool. CEL вирази мають доступ до вмісту AdmissionRequest та Authorizer, організованого у змінні CEL:

      - `'object'` — обʼєкт з вхідного запиту. Значення є null для запитів DELETE.
      - `'oldObject'` — існуючий обʼєкт. Значення є null для запитів CREATE.
      - `'request'` — атрибути запиту на допуск ([ref](/pkg/apis/admission/types.go#AdmissionRequest)).
      - `'authorizer'` — CEL Authorizer. Може бути використаний для виконання перевірок авторизації для принципала (користувача або службового облікового запису) запиту. Див. https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz.
      - `'authorizer.requestResource'` — CEL ResourceCheck, створений з `authorizer` і налаштований з ресурсом запиту.

      Документація про CEL: [https://kubernetes.io/docs/reference/using-api/cel/](/docs/reference/using-api/cel/)

      Обовʼязкове.

    - **spec.matchConditions.name** (string), обовʼязково

      Name є ідентифікатором для цієї умови збігу, який використовується для стратегічного злиття `MatchConditions`, а також для надання ідентифікатора для цілей журналювання. Добре вибране імʼя повинно бути описовим для відповідного виразу. Name повинно бути кваліфікованим іменем, що складається з алфавітно-цифрових символів, '-', '\_' або '.', і повинно починатися та закінчуватися алфавітно-цифровим символом (наприклад, 'MyName', 'my.name', '123-abc', регулярний вираз для перевірки — '([A-Za-z0-9][-A-Za-z0-9_.]\*)?[A-Za-z0-9]') з необовʼязковим префіксом DNS піддомену та '/' (наприклад, 'example.com/MyName').

      Обовʼязкове.

  - **spec.matchConstraints** (MatchResources)

    matchConstraints вказує, які ресурси ця політика призначена для перевірки. Політика MutatingAdmissionPolicy розглядає запит, якщо він відповідає *всім* обмеженням. Однак, щоб запобігти переведенню кластерів у нестабільний стан, з якого неможливо вийти через API, MutatingAdmissionPolicy не може співпадати з MutatingAdmissionPolicy та MutatingAdmissionPolicyBinding. Операції CREATE, UPDATE та CONNECT дозволені.  Операція DELETE може не співпадати. '\*' відповідає операціям CREATE, UPDATE і CONNECT. Обовʼязковий для заповнення.

    <a name="MatchResources"></a>
    *MatchResources вирішує, чи застосовувати політику контролю допуску до обʼєкта на основі того, чи відповідає він критеріям відповідності. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає обом критеріям, він виключається)*

    - **spec.matchConstraints.excludeResourceRules** ([]NamedRuleWithOperations)

      *Atomic: буде замінено під час злиття*

      ExcludeResourceRules описує, які операції над якими ресурсами/субресурсами не повинні цікавити політику. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає обом критеріям, він виключається)

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations — це кортеж операцій та ресурсів з іменами ресурсів.*

      - **spec.matchConstraints.excludeResourceRules.apiGroups** ([]string)

        *Atomic: буде замінено під час злиття*

        APIGroups — це групи API, до яких належать ресурси. '\*' — це всі групи. Якщо присутній '\*', довжина фрагмента повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchConstraints.excludeResourceRules.apiVersions** ([]string)

        *Atomic: буде замінено під час злиття*

        APIVersions — версії API, до яких належать ресурси. '\*' — це всі версії. Якщо присутній '\*', довжина фрагмента повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchConstraints.excludeResourceRules.operations** ([]string)

        *Atomic: буде замінено під час злиття*

        Operations — це операції, які цікавлять хук допуску: CREATE, UPDATE, DELETE, CONNECT або \* для всіх цих операцій і будь-яких майбутніх операцій допуску, які будуть додані. Якщо присутній символ '\*', довжина фрагмента повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchConstraints.excludeResourceRules.resourceNames** ([]string)

        *Atomic: буде замінено під час злиття*

        ResourceNames — необовʼязковий білий список імен, до яких застосовується правило.  Порожній список означає, що дозволено все.

      - **spec.matchConstraints.excludeResourceRules.resources** ([]string)

        *Atomic: буде замінено під час злиття*

        Resources — це список ресурсів, до яких застосовується це правило.

        Наприклад, 'pods' означає Podʼи, 'pods/log' означає субресурс логу Podʼів. '\*' означає всі ресурси, але не субресурси. 'pods/\*' означає всі субресурси Podʼів. '\*/scale' означає всі субресурси scale. '\*/\*' означає всі ресурси та їх субресурси.

        Якщо присутній універсальний символ, правило валідації забезпечить відсутність перекриття ресурсів.

        Залежно від навколишнього обʼєкта, субресурси можуть бути недопустимими. Обовʼязково.

      - **spec.matchConstraints.excludeResourceRules.scope** (string)

        scope визначає область застосування цього правила. Допустимі значення — "Cluster", "Namespaced" та "\*" "Cluster" означає, що правило буде застосовано тільки до ресурсів на рівні кластера. API обʼєкти простору імен є ресурсами на рівні кластера. "Namespaced" означає, що правило буде застосовано тільки до ресурсів простору імен. "\*" означає, що немає обмежень на область застосування. Субресурси відповідають області застосування свого батьківського ресурсу. Стандартне значення — "\*".

    - **spec.matchConstraints.matchPolicy** (string)

      matchPolicy визначає, як список "MatchResources" використовується для зіставлення вхідних запитів. Допустимі значення: "Exact" або "Equivalent".

      - Exact: збіг запиту лише у тому випадку, якщо він точно відповідає вказаному правилу. Наприклад, якщо розгортання можуть бути змінені через apps/v1, apps/v1beta1 і extensions/v1beta1, але "rules" включають лише `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, політика допуску не розглядає запити до apps/v1beta1 або extensions/v1beta1 API груп.

      - Equivalent: збіг запиту, якщо він змінює ресурс, перелічений у правилах, навіть через іншу групу або версію API. Наприклад, якщо розгортання можуть бути змінені через apps/v1, apps/v1beta1 і extensions/v1beta1, а "rules" включають тільки `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, політика допуску **розглядає** запити до apps/v1beta1 або extensions/v1beta1 API груп. API сервер транслює запити так щоб вони відповідали ресурсам API за потреби.

      Стандартне значення "Equivalent"

    - **spec.matchConstraints.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      NamespaceSelector вирішує, чи застосовувати політику контролю доступу до обʼєкта на основі того, чи відповідає простір імен цього обʼєкта селектору. Якщо обʼєкт сам є простором імен, співставлення виконується на основі object.metadata.labels. Якщо обʼєкт є іншим ресурсом кластера, він ніколи не оминає політику.

      Наприклад, щоб запустити веб-хук на всіх обʼєктах, чий простір імен не асоційований з "runlevel", рівним "0" або "1", ви маєте встановити селектор наступним чином:

      ```cel
      "namespaceSelector": {
        "matchExpressions": [
          {
            "key": "runlevel",
            "operator": "NotIn",
            "values": [
              "0",
              "1"
            ]
          }
        ]
      }
      ```

      Якщо натомість ви хочете запустити політику лише на обʼєктах, чий простір імен повʼязано з "environment" "prod" або "staging", ви маєте встановити селектор наступним чином:

      ```cel
      "namespaceSelector": {
        "matchExpressions": [
          {
            "key": "environment",
            "operator": "In",
            "values": [
              "prod",
              "staging"
            ]
          }
        ]
      }
      ```

      Дивіться [https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/](/docs/concepts/overview/working-with-objects/labels/) щоб дізнатись про більше прикладів селектора міток.

      Стандартно використовується порожній LabelSelector, який відповідає всьому.

    - **spec.matchConstraints.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      ObjectSelector вирішує, чи запускати політику на основі того, чи мають обʼєкти відповідні мітки. ObjectSelector порівнюється з oldObject і newObject, які будуть надіслані до виразу політики (CEL), і вважається, що вони збігаються, якщо будь-який з обʼєктів збігається з селектором. Нульовий обʼєкт (oldObject у випадку створення або newObject у випадку видалення) або обʼєкт, який не може мати міток (наприклад, обʼєкт DeploymentRollback або обʼєкт PodProxyOptions), не вважається таким, що збігається з селектором. Використовуйте селектор обʼєктів, тільки якщо вебхук є активним, оскільки кінцеві користувачі можуть пропустити вебхук допуску, встановивши мітки. Стандартно використовується порожній LabelSelector, який відповідає всьому.

    - **spec.matchConstraints.resourceRules** ([]NamedRuleWithOperations)

      *Atomic: буде замінено під час злиття*

      ResourceRules описує, які операції з якими ресурсами/субресурсами відповідають політиці допуску. Політика цікавиться операцією, якщо вона відповідає *будь-якому* правилу.

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations — це кортеж операцій та ресурсів з іменами ресурсів.*

      - **spec.matchConstraints.resourceRules.apiGroups** ([]string)

        *Atomic: буде замінено під час злиття*

        APIGroups — це групи API, до яких належать ресурси. '\*' — всі групи. Якщо '\*' присутній, довжина фрагменту повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchConstraints.resourceRules.apiVersions** ([]string)

        *Atomic: буде замінено під час злиття*

        APIVersions — це версії API, до яких належать ресурси. '\*' — всі версії. Якщо '\*' присутній, довжина фрагменту повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchConstraints.resourceRules.operations** ([]string)

        *Atomic: буде замінено під час злиття*

        Operations — це операції, які цікавлять хук допуску - CREATE, UPDATE, DELETE, CONNECT або \* для всіх цих операцій і будь-яких майбутніх операцій допуску, які будуть додані. Якщо присутній символ "\*", довжина фрагмента повинна бути одиницею. Обовʼязково.

      - **spec.matchConstraints.resourceRules.resourceNames** ([]string)

        *Atomic: буде замінено під час злиття*

        ResourceNames — це необовʼязковий білий список імен, до яких застосовується правило. Порожній набір означає, що дозволено все.

      - **spec.matchConstraints.resourceRules.resources** ([]string)

        *Atomic: буде замінено під час злиття*

        Resources — список ресурсів, до яких застосовується це правило.

        Наприклад: 'pods' означає podʼи. 'pods/log' означає підресурс журналу podʼів. '\*' означає всі ресурси, але не підресурси. 'pods/\*' означає всі підресурси podʼів. '\*/scale' означає всі підресурси масштабу. '\*/\*' означає всі ресурси і їхні підресурси.

        Якщо присутній символ підстановки, правило валідації забезпечить, щоб ресурси не перекривалися між собою.

        Залежно від обʼєкта, що містить, підресурси можуть бути не дозволені. Обовʼязкове.

      - **spec.matchConstraints.resourceRules.scope** (string)

        scope визначає область цього правила. Дійсні значення: "Cluster", "Namespaced" та "\*". "Cluster" означає, що лише ресурси з областю дії кластера відповідатимуть цьому правилу. Обʼєкти API простору імен є кластерними. "Namespaced" означає, що лише ресурси з простору імен відповідатимуть цьому правилу. "\*" означає, що обмежень за областю дії немає. Підресурси відповідають області їхнього батьківського ресурсу. Стандартно "\*".

  - **spec.mutations** ([]Mutation)

    *Atomic: буде замінено під час злиття*

    mutations містять операції, які потрібно виконати з обʼєктами, що мають збіг. mutations не можуть бути порожніми; необхідна щонайменше одна зміна. mutations оцінюються по порядку і повторно викликаються відповідно до політики reinvocationPolicy. Зміни політики викликаються для кожного звʼязування цієї політики, і повторний виклик змін відбувається на основі кожного звʼязування.

    <a name="Mutation"></a>
    *Mutation задає CEL-вираз, який використовується для застосування зміни.*

    - **spec.mutations.patchType** (string), обовʼязково

      patchType вказує на використану стратегію виправлення. Допустимими значеннями є "ApplyConfiguration" та "JSONPatch". Обовʼязкове значення.

    - **spec.mutations.applyConfiguration** (ApplyConfiguration)

      applyConfiguration визначає бажані значення конфігурації обʼєкта. Конфігурація застосовується до обʼєкта допуску за допомогою [структурованого злиття diff](https://github.com/kubernetes-sigs/structured-merge-diff). Для створення застосувати конфігурації використовується CEL-вираз.

      <a name="ApplyConfiguration"></a>
      *ApplyConfiguration визначає бажані значення конфігурації обʼєкта.*

      - **spec.mutations.applyConfiguration.expression** (string)

        вираз буде обчислено CEL для створення застосованої конфігурації. посилання: https://github.com/google/cel-spec

        Застосування конфігурацій оголошується в CEL за допомогою ініціалізації обʼєкта. Наприклад, цей вираз CEL повертає застосовану конфігурацію  для встановлення одного поля:

        ```cel
        Object{
          spec: Object.spec{
            serviceAccountName: "example"
          }
        }
        ```

        Застосування конфігурацій не може змінювати атомарні структури, map або масиви через ризик випадкового видалення значень, не включених до застосованої конфігурації.

        CEL-вирази мають доступ до типів обʼєктів, необхідних для створення конфігурацій застосування:

        - 'Object' — CEL-тип обʼєкта ресурсу.
        - 'Object.\<fieldName>' — CEL-тип поля обʼєкта (наприклад, 'Object.spec')
        - 'Object.\<fieldName1>.\<fieldName2>...\<fieldNameN>' — CEL-тип вкладеного поля (наприклад, 'Object.spec.containers')

        CEL-вирази мають доступ до вмісту запиту API, організованого в CEL-змінні, а також до деяких інших корисних змінних:

        - 'object' — Обʼєкт з вхідного запиту. Для запитів DELETE значення дорівнює нулю.
        - 'oldObject’ — Наявний обʼєкт. Для запитів CREATE дорівнює нулю.
        - 'request' — Атрибути запиту до API([ref](/pkg/apis/admission/types.go#AdmissionRequest)).
        - 'params' — Ресурс параметрів, на який посилається привʼязка політики, що оцінюється. Заповнюється тільки якщо політика має ParamKind.
        - 'namespaceObject' — Обʼєкт простору імен, до якого належить вхідний обʼєкт. Значення дорівнює нулю для кластерних ресурсів.
        - 'variables' — Map складених змінних, від імені до ліниво обчислюваного значення. Наприклад, до змінної з іменем 'foo' можна отримати доступ як 'variables.foo'.
        - 'authorizer' — Авторизатор CEL. Може використовуватися для виконання перевірки авторизації для принципала (облікового запису користувача або служби) запиту. Див. https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
        - 'authorizer.requestResource' — CEL ResourceCheck, сконструйований з 'authorizer' і налаштований з ресурсом запиту.

        Властивості `apiVersion`, `kind`, `metadata.name` і `metadata.generateName` завжди доступні з кореня об'єкта. Ніякі інші властивості метаданих не доступні.

        Доступні лише назви властивостей виду `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*`. Обовʼязковий.

    - **spec.mutations.jsonPatch** (JSONPatch)

      jsonPatch визначає операцію [JSON patch](https://jsonpatch.com/) для виконання зміни обʼєкта. Для створення JSON патчу використовується CEL вираз.

      <a name="JSONPatch"></a>
      *JSONPatch визначає JSON Patch.*

      - **spec.mutations.jsonPatch.expression** (string)

        вираз буде обчислено CEL для створення [JSON patch](https://jsonpatch.com/). посилання: https://github.com/google/cel-spec

        вираз повинен повернути масив значень JSONPatch.

        Наприклад, цей вираз CEL повертає патч JSON для умовної зміни значення:

        ```json
        [
          JSONPatch{op: "test", path: "/spec/example", value: "Red"},
          JSONPatch{op: "replace", path: "/spec/example", value: "Green"}
        ]
        ```

        Щоб визначити обʼєкт для значення патчу, використовуйте типи обʼєктів. Наприклад:

        ```json
        [
          JSONPatch{
            op: "add",
            path: "/spec/selector",
            value: Object.spec.selector{matchLabels: {"environment": "test"}}
          }
        ]
        ```

        Щоб використовувати рядки, що містять символи '/' і '~' як ключі шляху до JSONPatch, використовуйте "jsonpatch.escapeKey". Наприклад:

        ```json
        [
          JSONPatch{
            op: "add",
            path: "/metadata/labels/" + jsonpatch.escapeKey("example.com/environment"),
            value: "test"
          },
        ]
        ```

        CEL expressions have access to the types needed to create JSON patches and objects:

        - ‘JSONPatch' — CEL-тип операцій JSON Patch. JSONPatch має поля 'op', 'from', 'path' та 'value'. Дивіться [JSON patch](https://jsonpatch.com/) для більш детальної інформації. Поле 'value' може мати будь-яке значення: рядок, ціле число, масив, map або обʼєкт.  Якщо встановлено, поля “path" та “from" мають бути встановлені на рядок [JSON-покажчик](https://datatracker.ietf.org/doc/html/rfc6901/), де CEL-функція “jsonpatch.escapeKey()" може бути використана для захисту ключів шляху, що містять символи '/' та '~'.
        - ‘Object' — CEL-тип обʼєкта ресурсу.
        - 'Object.\<fieldName>' — CEL-тип поля обʼєкта (наприклад, 'Object.spec’)
        - 'Object.\<fieldName1>.\<fieldName2>...\<fieldNameN>’ — CEL-тип вкладеного поля (наприклад, 'Object.spec.containers')

        CEL expressions have access to the contents of the API request, organized into CEL variables as well as some other useful variables:

        - 'object' — Обʼєкт з вхідного запиту. Для запитів DELETE значення дорівнює нулю.
        - 'oldObject’ — Наявний обʼєкт. Для запитів CREATE дорівнює нулю.
        - 'request' — Атрибути запиту до API([ref](/pkg/apis/admission/types.go#AdmissionRequest)).
        - 'params' — Ресурс параметрів, на який посилається привʼязка політики, що оцінюється. Заповнюється тільки якщо політика має ParamKind.
        - 'namespaceObject' — Обʼєкт простору імен, до якого належить вхідний обʼєкт. Значення дорівнює нулю для кластерних ресурсів.
        - 'variables' — Map складених змінних, від імені до ліниво обчислюваного значення. Наприклад, до змінної з іменем 'foo' можна отримати доступ як 'variables.foo'.
        - 'authorizer' — Авторизатор CEL. Може використовуватися для виконання перевірки авторизації для принципала (облікового запису користувача або служби) запиту. Див. https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
        - 'authorizer.requestResource' — CEL ResourceCheck, сконструйований з 'authorizer' і налаштований з ресурсом запиту.

        CEL-вирази мають доступ до [бібліотек функцій Kubernetes CEL](/docs/reference/using-api/cel/#cel-options-language-features-and-libraries), а також:

        - 'jsonpatch.escapeKey' - Виконує екранування ключів JSONPatch. '~' і '/' екрануються як '~0' і '~1' відповідно).

        Доступні лише назви властивостей виду `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*`. Обовʼязковий параметр.

  - **spec.paramKind** (ParamKind)

    paramKind визначає тип ресурсів, що використовуються для параметризації цієї політики. Якщо параметр відсутній, параметрів для цієї політики немає, і змінна param CEL не буде надана для виразів перевірки. Якщо параметр paramKind посилається на неіснуючий тип, ця конфігурація політики є неправильною, і застосовується FailurePolicy. Якщо параметр paramKind вказано, але параметр paramRef не встановлено MutatingAdmissionPolicyBinding, змінна params буде null.

    <a name="ParamKind"></a>
    *ParamKind — це кортеж Group Kind та Version.*

    - **spec.paramKind.apiVersion** (string)

      APIVersion - версія групи API, до якої належать ресурси. У форматі "group/version". Обовʼязковий параметр.

    - **spec.paramKind.kind** (string)

      Kind — це тип API, до якого належать ресурси. Обовʼязковий параметр.

  - **spec.reinvocationPolicy** (string)

    reinvocationPolicy вказує, чи можна викликати мутації кілька разів на MutatingAdmissionPolicyBinding в рамках однієї оцінки допуску. Допустимими значеннями є "Never" та "IfNeeded".

    Never: Ці зміни не будуть викликатися більше одного разу на звʼязування в одній оцінці допуску.

    IfNeeded: Ці зміни можуть бути викликані більше одного разу на привʼязку для одного запиту на допуск, і немає гарантії порядку щодо інших втулків допуску, вебхуків допуску, привʼязок цієї політики та політик допуску.  Зміни повторно викликаються лише тоді, коли вони змінюють обʼєкт після того, як ця зміна була викликана. Обовʼязковий параметр.

  - **spec.variables** ([]Variable)

    *Atomic: буде замінено під час злиття*

    Variables містять визначення змінних, які можуть бути використані у складі інших виразів. Кожна змінна визначається як іменований вираз CEL. Змінні, визначені тут, будуть доступні в розділі `variables` в інших виразах політики, окрім matchConditions, оскільки matchConditions обчислюються перед рештою політики.

    Вираз змінної може посилатися на інші змінні, визначені раніше у списку, але не на ті, що знаходяться після неї. Таким чином, змінні повинні бути відсортовані за порядком першої появи і ациклічно.

    <a name="Variable"></a>
    *Variable — це визначення змінної, яка використовується в композиції.*

    - **spec.variables.expression** (string), обовʼязково

      Expression — це вираз, який буде обчислюватися як значення змінної. Вираз CEL має доступ до тих самих ідентифікаторів, що й вирази CEL у Validation.

    - **spec.variables.name** (string), обовʼязково

      Name — це імʼя змінної. Імʼя має бути дійсним ідентифікатором CEL та унікальним серед усіх змінних. Змінна може бути доступна в інших виразах через `variables` Наприклад, якщо імʼя "foo", змінна буде доступна як `variables.foo`.

## MutatingAdmissionPolicyBindingList {#MutatingAdmissionPolicyBindingList}

MutatingAdmissionPolicyBindingList — є списком MutatingAdmissionPolicyBinding.

---

- **items** ([]<a href="{{< ref "../policy-resources/mutating-admission-policy-binding-v1alpha1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a>), обовʼязково

  Список PolicyBinding.

- **apiVersion** (string)

  APIVersion визначає версійну схему цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відкидати нерозпізнані значення. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  Kind — це рядкове значення, що представляє REST-ресурс, який представляє цей обʼєкт. Сервери можуть визначити це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлений. У CamelCase. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

## Операції {#operations}

---

### `get` отримати вказану MutatingAdmissionPolicyBinding {#get-read-the-specified-mutatingadmissionpolicybinding}

#### HTTP запит {#http-request}

GET /apis/admissionregistration.k8s.io/v1alpha1/mutatingadmissionpolicybindings/{name}

#### Параметри {#parametrs}

- **name** (*в шляху*): string, обовʼязково

  імʼя the MutatingAdmissionPolicyBinding

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../policy-resources/mutating-admission-policy-binding-v1alpha1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу MutatingAdmissionPolicyBinding {#list-list-or-watch-objects-of-kind-mutatingadmissionpolicybinding}

#### HTTP запит {#http-request-1}

GET /apis/admissionregistration.k8s.io/v1alpha1/mutatingadmissionpolicybindings

#### Параметри {#parametrs-1}

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../policy-resources/mutating-admission-policy-binding-v1alpha1#MutatingAdmissionPolicyBindingList" >}}">MutatingAdmissionPolicyBindingList</a>): OK

401: Unauthorized

### `create` створення MutatingAdmissionPolicyBinding {#create-create-a-mutatingadmissionpolicybinding}

#### HTTP запит {#http-request-2}

POST /apis/admissionregistration.k8s.io/v1alpha1/mutatingadmissionpolicybindings

#### Параметри {#parametrs-2}

- **body**: <a href="{{< ref "../policy-resources/mutating-admission-policy-binding-v1alpha1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../policy-resources/mutating-admission-policy-binding-v1alpha1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a>): OK

201 (<a href="{{< ref "../policy-resources/mutating-admission-policy-binding-v1alpha1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a>): Created

202 (<a href="{{< ref "../policy-resources/mutating-admission-policy-binding-v1alpha1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a>): Accepted

401: Unauthorized

### `update` заміна вказаної MutatingAdmissionPolicyBinding {#update-replace-the-specified-mutatingadmissionpolicybinding}

#### HTTP запит {#http-request-3}

PUT /apis/admissionregistration.k8s.io/v1alpha1/mutatingadmissionpolicybindings/{name}

#### Параметри {#parametrs-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя MutatingAdmissionPolicyBinding

- **body**: <a href="{{< ref "../policy-resources/mutating-admission-policy-binding-v1alpha1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../policy-resources/mutating-admission-policy-binding-v1alpha1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a>): OK

201 (<a href="{{< ref "../policy-resources/mutating-admission-policy-binding-v1alpha1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаної MutatingAdmissionPolicyBinding {#patch-partially-update-the-specified-mutatingadmissionpolicybinding}

#### HTTP запит {#http-request-4}

PATCH /apis/admissionregistration.k8s.io/v1alpha1/mutatingadmissionpolicybindings/{name}

#### Параметри {#parametrs-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя MutatingAdmissionPolicyBinding

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../policy-resources/mutating-admission-policy-binding-v1alpha1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a>): OK

201 (<a href="{{< ref "../policy-resources/mutating-admission-policy-binding-v1alpha1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a>): Created

401: Unauthorized

### `delete` видалення MutatingAdmissionPolicyBinding {#delete-delete-a-mutatingadmissionpolicybinding}

#### HTTP запит {#http-request-5}

DELETE /apis/admissionregistration.k8s.io/v1alpha1/mutatingadmissionpolicybindings/{name}

#### Параметри {#parametrs-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя MutatingAdmissionPolicyBinding

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції MutatingAdmissionPolicyBinding {#deletecollection-delete-collection-of-mutatingadmissionpolicybinding}

#### HTTP запит {#http-request-6}

DELETE /apis/admissionregistration.k8s.io/v1alpha1/mutatingadmissionpolicybindings

#### Параметри {#parametrs-6}

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
