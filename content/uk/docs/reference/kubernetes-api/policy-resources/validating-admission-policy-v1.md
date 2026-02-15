---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ValidatingAdmissionPolicy"
content_type: "api_reference"
description: "ValidatingAdmissionPolicy описує визначення політики перевірки допуску, яка приймає або відхиляє обʼєкт, не змінюючи його."
title: "ValidatingAdmissionPolicy"
weight: 7
auto_generated: false
---

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## ValidatingAdmissionPolicy {#ValidatingAdmissionPolicy}

ValidatingAdmissionPolicy описує визначення політики перевірки допуску, яка приймає або відхиляє обʼєкт, не змінюючи його.

---

- **apiVersion**: admissionregistration.k8s.io/v1

- **kind**: ValidatingAdmissionPolicy

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта; Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.

- **spec** (ValidatingAdmissionPolicySpec)

  Специфікація бажаної поведінки ValidatingAdmissionPolicy.

  <a name="ValidatingAdmissionPolicySpec"></a>
  *ValidatingAdmissionPolicySpec — це специфікація бажаної поведінки AdmissionPolicy.*

  - **spec.auditAnnotations** ([]AuditAnnotation)

    *Atomic: буде замінено під час обʼєднання*

    auditAnnotations містить вирази CEL, які використовуються для створення анотацій аудити для події аудити запиту API. validations і auditAnnotations не можуть бути одночасно порожніми; потрібна щонайменше одна з validations або auditAnnotations.

    <a name="AuditAnnotation"></a>
    *AuditAnnotation описує, як створити анотацію аудиту для запиту API.*

    - **spec.auditAnnotations.key** (string), обовʼязково

      key визначає ключ анотації аудиту. Ключі анотацій аудиту ValidatingAdmissionPolicy мають бути унікальними. Ключ повинен бути кваліфікованим імʼям ([A-Za-z0-9][-A-Za-z0-9_.]*) довжиною не більше 63 байт.

      Ключ поєднується з імʼям ресурсу ValidatingAdmissionPolicy для створення ключа анотації аудиту: "{ValidatingAdmissionPolicy name}/{key}".

      Якщо admission webhook використовує те саме імʼя ресурсу, що й цей ValidatingAdmissionPolicy, і той самий ключ анотації аудиту, ключ анотації буде ідентичним. У цьому випадку перша анотація, написана з цим ключем, буде включена в подію аудиту, а всі наступні анотації з тим самим ключем будуть відхилені.

      Обовʼязково.

    - **spec.auditAnnotations.valueExpression** (string), обовʼязково

      valueExpression представляє вираз, який оцінюється CEL для створення значення анотації аудиту. Вираз має оцінюватися або як рядок, або як значення null. Якщо вираз оцінюється як рядок, анотація аудиту включається зі значенням рядка. Якщо вираз оцінюється як null або порожній рядок, анотація аудиту буде пропущена. valueExpression може бути не довше 5 КБ. Якщо результат valueExpression перевищує 10 КБ, він буде скорочений до 10 КБ.

      Якщо кілька ресурсів ValidatingAdmissionPolicyBinding відповідають запиту API, то valueExpression буде оцінено для кожного звʼязування. Усі унікальні значення, створені valueExpressions, будуть обʼєднані в список, розділений комами.

      Обовʼязково.

  - **spec.failurePolicy** (string)

    failurePolicy визначає, як обробляти невдачі для admission policy. Невдачі можуть виникати через помилки розбору виразів CEL, помилки перевірки типів, помилки виконання та невірні або неправильно налаштовані визначення політики або звʼязувань.

    Політика вважається недійсною, якщо spec.paramKind посилається на відсутній Kind. Звʼязок вважається недійсним, якщо spec.paramRef.name посилається на нвідсутній ресурс.

    failurePolicy не визначає, як обробляються перевірки, які оцінюються як false.

    Коли failurePolicy встановлено на Fail, ValidatingAdmissionPolicyBinding validationActions визначають, як оцінюються невдачі.

    Допустимі значення: Ignore або Fail. Стандартне значення — Fail.

    Можливі значення переліку (enum):
    - `"Fail"` означає, що помилка виклику вебхука призводить до невдачі допуску.
    - `"Ignore"` означає, що помилка виклику вебхука ігнорується.

  - **spec.matchConditions** ([]MatchCondition)

    *Patch strategy: обʼєднання за ключем `name`*

    *Map: під час обʼєднання зберігаються унікальні значення за ключем name*

    MatchConditions — це список умов, які мають бути виконані для перевірки запиту. Умови збігу фільтрують запити, які вже відповідали правилам, namespaceSelector та objectSelector. Порожній список matchConditions відповідає всім запитам. Максимально допустимо 64 умови перевірки збігів.

    Якщо надається обʼєкт параметрів, до нього можна отримати доступ за допомогою дескриптора `params` так само як до виразів перевірки.

    Логіка точного збігу така (за порядком):
      1. Якщо БУДЬ-ЯКА умова відповідності оцінюється як FALSE, політика оминається.
      2. Якщо ВСІ умови відповідності оцінюються як TRUE, політика оцінюється.
      3. Якщо будь-яка умова відповідності оцінюється як помилка (але жодна не є FALSE):
         - Якщо failurePolicy=Fail, запит відхиляється
         - Якщо failurePolicy=Ignore, політика пропускається

    <a name="MatchCondition"></a>
    *MatchCondition представляє умову, яка має бути виконана для надсилання запиту до webhook.*

    - **spec.matchConditions.expression** (string), обовʼязково

      Expression представляє вираз, який буде оцінено CEL. Має оцінюватися як bool. CEL вирази мають доступ до вмісту AdmissionRequest та Authorizer, які знаходяться у змінних CEL:

      'object' — Обʼєкт із вхідного запиту. Значення null для запитів DELETE. 'oldObject' — Наявний обʼєкт. Значення null для запитів CREATE. 'request' — Атрибути запиту на допуск (/pkg/apis/admission/types.go#AdmissionRequest). 'authorizer' — Авторизатор CEL. Може використовуватися для виконання перевірок авторизації для виконавця (користувача або службового облікового запису) запиту. Див. https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz 'authorizer.requestResource' — Ресурс CEL, створений із 'authorizer' і налаштований із запитним ресурсом. Документація по CEL: [https://kubernetes.io/docs/reference/using-api/cel/](/docs/reference/using-api/cel/)

      Обовʼязково.

    - **spec.matchConditions.name** (string), обовʼязково

      Name є ідентифікатором для цієї умови збігу, використовується для стратегічного обʼєднання MatchConditions, а також для надання ідентифікатора для цілей логування. Хороше імʼя має бути описовим для повʼязаної з ним умови. Імʼя повинно бути кваліфікованим імʼям, що складається з алфавітно-цифрових символів, '-', '_' або '.', і повинно починатися та закінчуватися алфавітно-цифровим символом (наприклад, 'MyName', або 'my.name', або '123-abc', регулярний вираз, що використовується для перевірки '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]') з необовʼязковим префіксом DNS піддомену та '/' (наприклад, 'example.com/MyName')

      Обовʼязково.

  - **spec.matchConstraints** (MatchResources)

    MatchConstraints вказує, які ресурси ця політика призначена перевіряти. AdmissionPolicy піклується про запит, якщо він відповідає *всім* Constraints. Однак, щоб запобігти стану нестабільності кластерів, який не можна виправити через API, ValidatingAdmissionPolicy не може відповідати ValidatingAdmissionPolicy та ValidatingAdmissionPolicyBinding. Обовʼязково.

    <a name="MatchResources"></a>
    *MatchResources вирішує, чи запускати політику контролю доступу до обʼєкта на основі того, чи відповідає він критеріям відповідності. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає обом, він виключається)*

    - **spec.matchConstraints.excludeResourceRules** ([]NamedRuleWithOperations)

      *Atomic: буде замінено під час злиття*

      ExcludeResourceRules описує, які операції над якими ресурсами/субресурсами не повинні цікавити політику ValidatingAdmissionPolicy. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає обом правилам, він виключається)

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations є кортежем Operations та Resources з ResourceNames.*

      - **spec.matchConstraints.excludeResourceRules.apiGroups** ([]string)

        *Atomic: буде замінено під час злиття*

        APIGroups — це API групи, до яких належать ресурси. '\*' означає всі групи. Якщо присутній симовл '\*', довжина масиву повинна бути одиницею. Обовʼязково.

      - **spec.matchConstraints.excludeResourceRules.apiVersions** ([]string)

        *Atomic: буде замінено під час злиття*

        APIVersions — це API версії, до яких належать ресурси. '\*' означає всі версії. Якщо присутній '\*', довжина масиву повинна бути одиницею. Обовʼязково.

      - **spec.matchConstraints.excludeResourceRules.operations** ([]string)

        *Atomic: буде замінено під час злиття*

        Operations — це операції, які цікавлять хук допуску — CREATE, UPDATE, DELETE, CONNECT або \* для всіх цих операцій та будь-яких майбутніх операцій допуску, які будуть додані. Якщо присутній символ '\*', довжина масиву повинна бути одиницею. Обовʼязково.

      - **spec.matchConstraints.excludeResourceRules.resourceNames** ([]string)

        *Atomic: буде замінено під час злиття*

        ResourceNames —це необовʼязковий білий список імен, до яких застосовується правило. Порожній набір означає, що дозволено все.

      - **spec.matchConstraints.excludeResourceRules.resources** ([]string)

        *Atomic: буде замінено під час злиття*

        Resources — це список ресурсів, до яких застосовується це правило.

        Наприклад: 'pods' означає Podʼи. 'pods/log' означає субресурс логу для Podʼів. '\*' означає всі ресурси, але не субресурси. 'pods/\*' означає всі субресурси Podʼів. '\*/scale' означає всі субресурси масштабування. '\*/\*' означає всі ресурси та їх субресурси.

        Якщо присутній символ підстановки, правило перевірки забезпечить, що ресурси не перекривають один одного.

        Залежно від обʼєкта, що охоплює, субресурси можуть бути недозволеними. Обовʼязково.

      - **spec.matchConstraints.excludeResourceRules.scope** (string)

        scope вказує область застосування цього правила. Допустимі значення: "Cluster", "Namespaced" і "\*" "Cluster" означає, що тільки ресурси на рівні кластера відповідатимуть цьому правилу. Обʼєкти API простору імен є кластерними. "Namespaced" означає, що тільки ресурси на рівні простору імен відповідатимуть цьому правилу. "\*" означає, що немає обмежень щодо області застосування. Субресурси відповідають області свого батьківського ресурсу. Стандартно — "\*".

        Можливі значення переліку:
        - `"*"` означає, що включені всі області дії.
        - `"Cluster"` означає, що область дії обмежена обʼєктами в межах кластера. Обʼєкти простору імен мають область дії в межах кластера.
        - `"Namespaced"` означає, що область дії обмежена обʼєктами в просторі імен.

    - **spec.matchConstraints.matchPolicy** (string)

      matchPolicy визначає, як використовувати список "MatchResources" для відповідності вхідним запитам. Допустимі значення: "Exact" або "Equivalent".

      - Exact: відповідність запиту лише в разі точного збігу з певним правилом. Наприклад, якщо розгортання (deployments) можна змінити через apps/v1, apps/v1beta1 і extensions/v1beta1, але "правила" включають лише `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, запит до apps/v1beta1 або extensions/v1beta1 не буде відправлено до ValidatingAdmissionPolicy.

      - Equivalent: відповідність запиту, якщо він змінює ресурс, зазначений у правилах, навіть через іншу групу або версію API. Наприклад, якщо розгортання можна змінити через apps/v1, apps/v1beta1 і extensions/v1beta1, і "правила" включають лише `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, запит до apps/v1beta1 або extensions/v1beta1 буде перетворено на apps/v1 і відправлено до ValidatingAdmissionPolicy.

      Стандартно — "Equivalent".

      Можливі значення переліку (enum):
      - `"Equivalent"` означає, що запити повинні надсилатися до вебхука, якщо вони змінюють ресурс, зазначений у правилах, через іншу групу API або версію.
      - `"Exact"` означає, що запити повинні надсилатися до вебхука лише в тому випадку, якщо вони точно відповідають даному правилу.

    - **spec.matchConstraints.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      NamespaceSelector визначає, чи запускати політику контролю допуску для обʼєкта на основі того, чи відповідає простір імен для цього обʼєкта селектору. Якщо сам обʼєкт є простором імен, перевірка збігу виконується для обʼєкта.metadata.labels. Якщо обʼєкт є іншим кластерним ресурсом, політика ніколи не пропускається.

      Наприклад, щоб запускати вебхук для будь-яких обʼєктів, простір імен яких не повʼязаний з "runlevel" 0 або 1; ви встановите селектор наступним чином:

      ```json
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

      Якщо замість цього ви хочете запускати політику лише для будь-яких обʼєктів, простір імен яких повʼязаний з "environment" "prod" або "staging"; ви встановите селектор наступним чином:

      ```json
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

      Дивіться [https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/](/docs/concepts/overview/working-with-objects/labels/) для отримання додаткових прикладів селекторів міток.

      Стандартно — пустий LabelSelector, який відповідає всьому.

    - **spec.matchConstraints.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      ObjectSelector визначає, чи запускати перевірку на основі наявності в обʼєкта відповідних міток. objectSelector оцінюється щодо старого та нового обʼєктів, які будуть відправлені на cel перевірку, і вважається, що є збіг, якщо хоча б один обʼєкт має збіг з селектором. Порожній обʼєкт (oldObject у разі створення або newObject у разі видалення) або обʼєкт, який не може мати міток (наприклад, DeploymentRollback або PodProxyOptions) не вважається таким, що має збіг. Використовуйте селектор обʼєктів тільки якщо вебхук є опціональним, оскільки кінцеві користувачі можуть оминути вебхук допуску, встановивши мітки. Стандартно пустий LabelSelector, який відповідає всьому.

    - **spec.matchConstraints.resourceRules** ([]NamedRuleWithOperations)

      *Atomic: буде замінено під час злиття*

      ResourceRules описує, які операції з якими ресурсами/субресурсами відповідають ValidatingAdmissionPolicy. Політика цікавиться операцією, якщо вона відповідає будь-якому Правилу.

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations є кортежем Operations та Resources з ResourceNames.*

      - **spec.matchConstraints.resourceRules.apiGroups** ([]string)

        *Atomic: буде замінено під час злиття*

        APIGroups — це групи API, до яких належать ресурси. '\*' означає всі групи. Якщо присутній символ '\*', довжина списку має бути одиницею. Обовʼязково.

      - **spec.matchConstraints.resourceRules.apiVersions** ([]string)

        *Atomic: буде замінено під час злиття*

        APIVersions — це версії API, до яких належать ресурси. '\*' означає всі версії. Якщо присутній символ '\*', довжина списку має бути одиницею. Обовʼязково.

      - **spec.matchConstraints.resourceRules.operations** ([]string)

        *Atomic: буде замінено під час злиття*

        Operations — це операції, які цікавлять вебхук допуску — CREATE, UPDATE, DELETE, CONNECT або \* для всіх цих операцій і будь-яких майбутніх операцій допуску, які будуть додані. Якщо присутній символ '\*', довжина списку має бути одиницею. Обовʼязково.

      - **spec.matchConstraints.resourceRules.resourceNames** ([]string)

        *Atomic: буде замінено під час злиття*

        ResourceNames — це необовʼязковий білий список імен, до яких застосовується правило. Порожній набір означає, що дозволено все.

      - **spec.matchConstraints.resourceRules.resources** ([]string)

        *Atomic: буде замінено під час злиття*

        Resources — це список ресурсів, до яких застосовується це правило.

        Наприклад, 'pods' означає Podʼи, 'pods/log' означає субресурс логу Podʼів. '\*' означає всі ресурси, але не субресурси. 'pods/\*' означає всі субресурси Podʼів. '\*/scale' означає всі субресурси масштабування. '\*/\*' означає всі ресурси та їх субресурси.

        Якщо присутній універсальний символ, правило валідації забезпечить відсутність перекриття ресурсів.

        Залежно від навколишнього обʼєкта, субресурси можуть бути недопустимими. Обовʼязково.

      - **spec.matchConstraints.resourceRules.scope** (string)

        scope визначає область застосування цього правила. Допустимі значення — "Cluster", "Namespaced" та "\*" "Cluster" означає, що правило буде застосовано тільки до ресурсів на рівні кластера. API обʼєкти простору імен є ресурсами на рівні кластера. "Namespaced" означає, що правило буде застосовано тільки до ресурсів простору імен. "\*" означає, що немає обмежень на область застосування. Субресурси відповідають області застосування свого батьківського ресурсу. Стандартне значення — "\*".

        Можливі значення переліку:
      - `"*"` означає, що включені всі області дії.
      - `"Cluster"` означає, що область дії обмежена обʼєктами в межах кластера. Обʼєкти простору імен мають область дії в межах кластера.
      - `"Namespaced"` означає, що область дії обмежена обʼєктами в просторі імен.

  - **spec.paramKind** (ParamKind)

    ParamKind визначає тип ресурсів, що використовуються для параметризації цієї політики. Якщо відсутній, то для цієї політики немає параметрів і змінна param CEL не буде надана для виразів перевірки. Якщо ParamKind посилається на неіснуючий тип, ця політика налаштована неправильно і застосовується FailurePolicy. Якщо paramKind вказано, але paramRef не встановлено в ValidatingAdmissionPolicyBinding, змінна params буде null.

    <a name="ParamKind"></a>
    *ParamKind є кортежем Group, Kind і Version.*

    - **spec.paramKind.apiVersion** (string)

      APIVersion — це версія групи API, до якої належать ресурси. У форматі "group/version". Обовʼязково.

    - **spec.paramKind.kind** (string)

      Kind — це тип API, до якого належать ресурси. Обовʼязково.

  - **spec.validations** ([]Validation)

    *Atomic: буде замінено під час злиття*

    Validations містять CEL-вирази, які використовуються для застосування перевірки. Validations і AuditAnnotations не можуть обидва бути порожніми; потрібен мінімум щось одне з Validations або AuditAnnotations.

    <a name="Validation"></a>
    *Validation визначає CEL-вираз, який використовується для перевірки.*

    - **spec.validations.expression** (string), обовʼязково

      Expression представляє вираз, який буде оцінюватися CEL. ref: https://github.com/google/cel-spec CEL-вирази мають доступ до вмісту запиту/відповіді API, організованих у змінні CEL, а також деякі інші корисні змінні:

      - 'object' — Обʼєкт з вхідного запиту. Значення null для запитів DELETE.
      - 'oldObject' — Наявний обʼєкт. Значення null для запитів CREATE.
      - 'request' — Атрибути запиту API([ref](/pkg/apis/admission/types.go#AdmissionRequest)).
      - 'params' — Параметр ресурсу, на який посилається перевірка політики. Заповнюється лише, якщо політика має ParamKind.
      - 'namespaceObject' — Обʼєкт простору імен, до якого належить вхідний обʼєкт. Значення null для ресурсів на рівні кластера.
      - 'variables' - Map змінних, від їх назви до їхнього ледачого (lazily) оцінюваного значення.  Наприклад, змінна з назвою 'foo' може бути доступна як 'variables.foo'.
      - 'authorizer' — CEL Authorizer. Може використовуватися для виконання перевірок авторизації для виконавця (користувача або служббового облікового запису) запиту. Див. https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
      - 'authorizer.requestResource' — CEL ResourceCheck, створений з 'authorizer' та налаштований для ресурсу запиту.

      `apiVersion`, `kind`, `metadata.name` і `metadata.generateName` завжди доступні з кореня обʼєкта. Інші властивості метаданих недоступні.

      Доступні лише імена властивостей у формі `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*`. Доступні імена властивостей екрануються згідно з наступними правилами, коли доступні у виразі:

      - '__' екранується як '__underscores__'
      - '.' екранується як '__dot__'
      - '-' екранується як '__dash__'
      - '/' екранується як '__slash__'
      - Імена властивостей, що точно збігаються з CEL РЕЗЕРВОВАНИМИ ключовими словами, екрануються як '__{keyword}__'. Ключові слова включають: "true", "false", "null", "in", "as", "break", "const", "continue", "else", "for", "function", "if", "import", "let", "loop", "package", "namespace", "return".
      Приклади:

      - Вираз, що звертається до властивості з назвою "namespace": {"Expression": "object.__namespace__ > 0"}
      - Вираз, що звертається до властивості з назвою "x-prop": {"Expression": "object.x__dash__prop > 0"}
      - Вираз, що звертається до властивості з назвою "redact__d": {"Expression": "object.redact__underscores__d > 0"}

      Рівність масивів із типом списку 'set' або 'map' ігнорує порядок елементів, тобто [1, 2] == [2, 1]. Конкатенація масивів із типом списку x-kubernetes використовує семантику типу списку:

      - 'set': `X + Y` виконує обʼєднання, де позиції масиву всіх елементів у `X` зберігаються, а елементи в `Y`, що не перетинаються, додаються зі збереженням їх часткового порядку.
      - 'map': `X + Y` виконує злиття, де позиції масиву всіх ключів у `X` зберігаються, але значення замінюються значеннями з `Y`, коли множини ключів `X` та `Y` перетинаються. Елементи в `Y` з ключами, що не перетинаються з ключами, що не перетинаються, додаються зі збереженням їх часткового порядку. Обовʼязково.

    - **spec.validations.message** (string)

      Message представляє повідомлення, що відображається при невдалій перевірці. Повідомлення обовʼязкове, якщо Expression містить розриви рядка. Повідомлення не повинно містити розриви рядка. Якщо не вказано, повідомлення — "failed rule: {Rule}". Наприклад, "must be a URL with the host matching spec.host" Якщо Expression містить розриви рядка, повідомлення обовʼязкове. Повідомлення не повинно містити розриви рядка. Якщо не встановлено, повідомлення — "failed Expression: {Expression}".

    - **spec.validations.messageExpression** (string)

      messageExpression оголошує CEL-вираз, який оцінюється як повідомлення про невдачу перевірки, що повертається, коли це правило не виконується. Оскільки messageExpression використовується як повідомлення про невдачу, воно повинно оцінюватися як рядок. Якщо і message, і messageExpression присутні у перевірці, то messageExpression буде використано, якщо перевірка не вдалася. Якщо messageExpression призводить до помилки під час виконання, помилка записується в лог, і повідомлення про невдачу перевірки створюється так, ніби поле messageExpression не було встановлено. Якщо messageExpression оцінюється як порожній рядок, рядок з лише пробілами або рядок, що містить розриви рядка, то повідомлення про невдачу перевірки також створюється так, ніби поле messageExpression не було встановлено, і факт того, що messageExpression створило порожній рядок/рядок з лише пробілами/рядок з розривами рядка, буде записано в лог. messageExpression має доступ до всіх тих самих змінних, що і `expression`, за винятком 'authorizer' та 'authorizer.requestResource'. Приклад: "object.x must be less than max ("+string(params.max)+")"

    - **spec.validations.reason** (string)

      Reason представляє машинно-зчитуваний опис того, чому ця перевірка не вдалася. Якщо це перша перевірка в списку, що не вдалася, ця причина, а також відповідний код відповіді HTTP, використовуються у відповіді HTTP клієнту. Наразі підтримувані причини: "Unauthorized", "Forbidden", "Invalid", "RequestEntityTooLarge". Якщо не встановлено, використовується StatusReasonInvalid у відповіді клієнту.

  - **spec.variables** ([]Variable)

     *Patch strategy: злиття по ключу `name`*

    *Map: унікальні значення по ключу `name` будуть зберігатися під час злиття*

    Variables містять визначення змінних, які можна використовувати у складі інших виразів. Кожна змінна визначена як іменований CEL-вираз. Змінні, визначені тут, будуть доступні у `variables` в інших виразах політики, за винятком MatchConditions, оскільки MatchConditions оцінюються перед рештою політики.

    Вираз змінної може посилатися на інші змінні, визначені раніше у списку, але не на ті, що стоять після неї. Таким чином, змінні мають бути відсортовані за порядком першої появи та ациклічно.

    <a name="Variable"></a>
    *Variable — це визначення змінної, яка використовується для складання. Змінна визначається як іменований вираз.*

    - **spec.variables.expression** (string), обовʼязково

      Expression — це вираз, який буде оцінений як значення змінної. CEL-вираз має доступ до тих самих ідентифікаторів, що і CEL-вирази в Validation.

    - **spec.variables.name** (string), обовʼязково

      Name — це назва змінної. Назва повинна бути дійсним ідентифікатором CEL і унікальною серед усіх змінних. Змінна може бути доступна в інших виразах через `variables` Наприклад, якщо name є "foo", змінна буде доступна як `variables.foo`.

- **status** (ValidatingAdmissionPolicyStatus)

  Статус ValidatingAdmissionPolicy, включаючи попередження, які корисні для визначення, чи працює політика відповідно до очікувань. Заповнюється системою. Тільки для читання.

  <a name="ValidatingAdmissionPolicyStatus"></a>
  *ValidatingAdmissionPolicyStatus представляє статус політики перевірки допуску.*

  - **status.conditions** ([]Condition)

    *Map: унікальні значення по ключу type будуть зберігатися під час злиття*

    Стани представляють останні доступні спостереження поточного стану політики.

    <a name="Condition"></a>
    *Condition містить деталі одного аспекту поточного стану цього API-ресурсу.*

    - **status.conditions.lastTransitionTime** (Time), обовʼязково

      lastTransitionTime — це останній час, коли стан перейшов з одного стану в інший. Це має бути, коли змінився основний стан. Якщо це невідомо, то прийнятно використовувати час, коли змінилося поле API.

      <a name="Time"></a>
      *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

    - **status.conditions.message** (string), обовʼязково

      message — це повідомлення зрозуміле людині, яке вказує деталі про зміну стану. Воно може бути порожній рядок.

    - **status.conditions.reason** (string), обовʼязково

      reason містить програмний ідентифікатор, що вказує на причину останньої зміни стану. Виробники конкретних типів станів можуть визначити очікувані значення та значення для цього поля, а також чи вважаються значення гарантованим API. Значення має бути рядком у форматі CamelCase. Це поле не може бути порожнім.

    - **status.conditions.status** (string), обовʼязково

      статус стану, один з True, False, Unknown.

    - **status.conditions.type** (string), обовʼязково

      тип стану у форматі CamelCase або у форматі foo.example.com/CamelCase.

    - **status.conditions.observedGeneration** (int64)

      observedGeneration представляє .metadata.generation, на основі якого було встановлено стан. Наприклад, якщо .metadata.generation зараз 12, але .status.conditions[x].observedGeneration - 9, стан застарів відносно поточного стану екземпляра.

  - **status.observedGeneration** (int64)

    Покоління, яке спостерігалося контролером.

  - **status.typeChecking** (TypeChecking)

    Результати перевірки типу для кожного виразу. Наявність цього поля вказує на завершення перевірки типу.

    <a name="TypeChecking"></a>
    *TypeChecking містить результати перевірки типу виразів у ValidatingAdmissionPolicy*

    - **status.typeChecking.expressionWarnings** ([]ExpressionWarning)

      *Atomic: буде замінено під час злиття*

      Попередження перевірки типу для кожного виразу.

      <a name="ExpressionWarning"></a>
      *ExpressionWarning — це інформація про попередження, що стосується конкретного виразу.*

      - **status.typeChecking.expressionWarnings.fieldRef** (string), обовʼязково

        Шлях до поля, що посилається на вираз. Наприклад, посилання на вираз першого елемента перевірок є "spec.validations[0].expression".

      - **status.typeChecking.expressionWarnings.warning** (string), обовʼязково

        Вміст інформації про попередження перевірки типу у формі, зручною для читання людиною. Кожен рядок попередження містить тип, за яким перевірено вираз, а потім помилку перевірки типу від компілятора.

## ValidatingAdmissionPolicyList {#ValidatingAdmissionPolicyList}

ValidatingAdmissionPolicyList - це список ValidatingAdmissionPolicy.

---

- **items** ([]<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>), обовʼязково

  Список ValidatingAdmissionPolicy.

- **apiVersion** (string)

  APIVersion визначає версійовану схему цього представлення обʼєкта. Сервери повинні перетворювати визнані схеми на останнє внутрішнє значення і можуть відхиляти невідомі значення. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources.

- **kind** (string)

  Kind — це рядкове значення, що представляє REST ресурс, який представляє цей обʼєкт. Сервери можуть визначити це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлюене. У CamelCase. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds.

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds.

## ValidatingAdmissionPolicyBinding {#ValidatingAdmissionPolicyBinding}

ValidatingAdmissionPolicyBinding повʼязує ValidatingAdmissionPolicy з параметризованими ресурсами. ValidatingAdmissionPolicyBinding та параметризовані CRD разом визначають, як адміністратори кластерів налаштовують політики для кластерів.

Для даного запиту на допуск кожне привʼязування спричиняє оцінку його політики N разів, де N дорівнює 1 для політик/привʼязок, які не використовують параметри, або кількість параметрів, обраних привʼязкою.

CEL вирази політики повинні мати обчислену вартість CEL нижче максимально допустимого бюджету CEL. Кожна оцінка політики отримує незалежний бюджет CEL. Додавання/видалення політик, привʼязок або параметрів не може впливати на те, чи знаходиться комбінація (policy, binding, param) у своєму бюджеті CEL.

---

- **apiVersion** (string)

  APIVersion визначає версійну схему цього представлення обʼєкта. Сервери повинні перетворювати визнані схеми на останнє внутрішнє значення і можуть відхиляти невідомі значення. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources.

- **kind** (string)

  Kind — це рядкове значення, що представляє REST ресурс, який представляє цей обʼєкт. Сервери можуть визначити це з точки доступу, до якої клієнт надсилає запити. Не можоже бути оновлене. У CamelCase. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds.

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.

- **spec** (ValidatingAdmissionPolicyBindingSpec)

  Специфікація бажаної поведінки ValidatingAdmissionPolicyBinding.

  <a name="ValidatingAdmissionPolicyBindingSpec"></a>
  *ValidatingAdmissionPolicyBindingSpec - це специфікація ValidatingAdmissionPolicyBinding.*

  - **spec.matchResources** (MatchResources)

    MatchResources оголошує, які ресурси відповідають цій привʼязці і будуть перевірені нею. Зауважте, що це перетинається з matchConstraints політики, тому лише запити, які відповідають політиці, можуть бути обрані. Якщо це поле не встановлено, всі ресурси, які відповідають політиці, перевіряються цією привʼязкою. Якщо resourceRules не встановлено, це не обмежує відповідність ресурсу. Якщо ресурс відповідає іншим полям цього обʼєкта, він буде перевірений. Зауважте, що це відрізняється від matchConstraints ValidatingAdmissionPolicy, де resourceRules є обовʼязковими.

    <a name="MatchResources"></a>
    *MatchResources вирішує, чи запускати політику контролю допуску на обʼєкті на основі відповідності критеріям відповідності. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає обом, він виключається).*

    - **spec.matchResources.excludeResourceRules** ([]NamedRuleWithOperations)

      *Atomic: буде замінено під час обʼєднання*

      ExcludeResourceRules описує, які операції на яких ресурсах/субресурсах ValidatingAdmissionPolicy не повинна враховувати. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає обом, він виключається).

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations є кортежем Operations та Resources з ResourceNames.*

      - **spec.matchResources.excludeResourceRules.apiGroups** ([]string)

        *Atomic: буде замінено під час обʼєднання*

        APIGroups — це групи API, до яких належать ресурси. '\*' означає всі групи. Якщо присутній символ '\*', довжина списку має бути одиницею. Обовʼязково.

      - **spec.matchResources.excludeResourceRules.apiVersions** ([]string)

        *Atomic: буде замінено під час обʼєднання*

        APIVersions — це версії API, до яких належать ресурси. '\*' означає всі версії. Якщо присутній символ '\*', довжина списку має бути одиницею. Обовʼязково.

      - **spec.matchResources.excludeResourceRules.operations** ([]string)

        *Atomic: буде замінено під час обʼєднання*

        Operations — це операції, які цікавлять вебхук допуску — CREATE, UPDATE, DELETE, CONNECT або \* для всіх цих операцій і будь-яких майбутніх операцій допуску, які будуть додані. Якщо присутній символ '\*', довжина списку має бути одиницею. Обовʼязково.

      - **spec.matchResources.excludeResourceRules.resourceNames** ([]string)

        *Atomic: буде замінено під час обʼєднання*

        ResourceNames — це необовʼязковий білий список імен, до яких застосовується правило. Порожній набір означає, що дозволено все.

      - **spec.matchResources.excludeResourceRules.resources** ([]string)

        *Atomic: буде замінено під час обʼєднання*

        Resources — це список ресурсів, до яких застосовується це правило.

        Наприклад, 'pods' означає Podʼи, 'pods/log' означає субресурс логу Podʼів. '\*' означає всі ресурси, але не субресурси. 'pods/\*' означає всі субресурси Podʼів. '\*/scale' означає всі субресурси масштабування. '\*/\*' означає всі ресурси та їх субресурси.

        Якщо присутній універсальний символ, правило валідації забезпечить відсутність перекриття ресурсів.

        Залежно від навколишнього обʼєкта, субресурси можуть бути недопустимими. Обовʼязково.

      - **spec.matchResources.excludeResourceRules.scope** (string)

        scope визначає сферу дії цього правила. Дійсні значення — "Cluster", "Namespaced" та "\*". "Cluster" означає, що тільки ресурси кластерного рівня відповідатимуть цьому правилу. Обʼєкти API namespace є ресурсами кластерного рівня. "Namespaced" означає, що тільки ресурси namespace відповідатимуть цьому правилу. "\*" означає, що немає обмежень на сферу дії. Субресурси відповідають сфері дії їхнього батьківського ресурсу. Стандартне значння — \"*".

        Можливі значення переліку:
        - `"*"` означає, що включені всі області дії.
        - `"Cluster"` означає, що область дії обмежена обʼєктами в межах кластера. Обʼєкти простору імен мають область дії в межах кластера.
        - `"Namespaced"` означає, що область дії обмежена обʼєктами в просторі імен.

    - **spec.matchResources.matchPolicy** (string)

      matchPolicy визначає, як список "MatchResources" використовується для пошуку збігів з вхідними запитами. Дозволені значення — "Exact" або "Equivalent".

      - Exact: відповідати запиту тільки, якщо він точно відповідає зазначеному правилу. Наприклад, якщо розгортання (deployments) можна змінювати через apps/v1, apps/v1beta1 та extensions/v1beta1, але "rules" включали тільки `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, запит на apps/v1beta1 або extensions/v1beta1 не буде надіслано до ValidatingAdmissionPolicy.

      - Equivalent: відповідати запиту, якщо він змінює ресурс, зазначений у правилах, навіть через іншу групу або версію API. Наприклад, якщо розгортання (deployments) можна змінювати через apps/v1, apps/v1beta1 та extensions/v1beta1, і "rules" включали тільки `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, запит на apps/v1beta1 або extensions/v1beta1 буде перетворено на apps/v1 і надіслано до ValidatingAdmissionPolicy.

      Стандартно — "Equivalent".

      Можливі значення переліку (enum):
      - `"Equivalent"` означає, що запити повинні надсилатися до вебхука, якщо вони змінюють ресурс, зазначений у правилах, через іншу групу API або версію.
      - `"Exact"` означає, що запити повинні надсилатися до вебхука лише в тому випадку, якщо вони точно відповідають даному правилу.

    - **spec.matchResources.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      NamespaceSelector визначає, чи застосовувати політику контролю доступу до об’єкта на основі відповідності простору імен цього об’єкта селектору. Якщо об’єкт сам по собі є простором імен, відповідність перевіряється по обʼєкту.metadata.labels. Якщо об’єкт є іншим ресурсом на рівні кластера, він ніколи не пропускає політику.

      Наприклад, щоб запустити вебхук для будь-яких об’єктів, простір імен яких не пов’язаний з "runlevel" 0 або 1, необхідно налаштувати селектор наступним чином:

      ```json
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

      Якщо натомість ви хочете застосовувати політику лише для об’єктів, простір імен яких пов’язаний з "environment" "prod" або "staging", необхідно налаштувати селектор наступним чином:

      ```json
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

      Дивіться [https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/](/docs/concepts/overview/working-with-objects/labels/) для отримання додаткових прикладів селекторів міток.

      Стандартно використовується порожній LabelSelector, який відповідає всьому.

    - **spec.matchResources.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      ObjectSelector визначає, чи потрібно виконувати перевірку на основі відповідності міток об’єкта. objectSelector оцінюється як для oldObject, так і для newObject, які будуть надіслані на перевірку cel, і вважається відповідним, якщо будь-який об’єкт відповідає селектору. Null обʼєкт (oldObject у випадку створення або newObject у випадку видалення) або об’єкт, який не може мати міток (наприклад, DeploymentRollback або PodProxyOptions), не вважається відповідним. Використовуйте селектор об’єктів, тільки якщо вебхук є опціональним, оскільки кінцеві користувачі можуть оминути вебхук допуску, встановивши мітки. Стандартно використовується порожній LabelSelector, який відповідає всьому.

    - **spec.matchResources.resourceRules** ([]NamedRuleWithOperations)

      *Atomic: буде замінено під час злиття*

      ResourceRules описує, які операції на яких ресурсах/субресурсах відповідають ValidatingAdmissionPolicy. Політика враховує операцію, якщо вона відповідає *будь-якому* правилу.

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations є кортежем Operations та Resources з ResourceNames.*

      - **spec.matchResources.resourceRules.apiGroups** ([]string)

        *Atomic: буде замінено під час злиття*

        APIGroups — це групи API, до яких належать ресурси. '\*' означає всі групи. Якщо присутній символ '\*', довжина списку має бути одиницею. Обовʼязково.

      - **spec.matchResources.resourceRules.apiVersions** ([]string)

        *Atomic: буде замінено під час злиття*

        APIVersions — це версії API, до яких належать ресурси. '\*' означає всі версії. Якщо присутній символ '\*', довжина списку має бути одиницею. Обовʼязково.

      - **spec.matchResources.resourceRules.operations** ([]string)

        *Atomic: буде замінено під час злиття*

        Operations — це операції, які цікавлять вебхук допуску — CREATE, UPDATE, DELETE, CONNECT або \* для всіх цих операцій і будь-яких майбутніх операцій допуску, які будуть додані. Якщо присутній символ '\*', довжина списку має бути одиницею. Обовʼязково.

      - **spec.matchResources.resourceRules.resourceNames** ([]string)

        *Atomic: буде замінено під час злиття*

        ResourceNames — це необовʼязковий білий список імен, до яких застосовується правило. Порожній набір означає, що все дозволено.

      - **spec.matchResources.resourceRules.resources** ([]string)

        *Atomic: буде замінено під час злиття*

        Resources — це список ресурсів, до яких застосовується це правило.

      Наприклад, 'pods' означає Podʼи, 'pods/log' означає субресурс логу Podʼів. '\*' означає всі ресурси, але не субресурси. 'pods/\*' означає всі субресурси Podʼів. '\*/scale' означає всі субресурси масштабування. '\*/\*' означає всі ресурси та їх субресурси.

      Якщо присутній універсальний символ, правило валідації забезпечить відсутність перекриття ресурсів.

      Залежно від навколишнього обʼєкта, субресурси можуть бути недопустимими. Обовʼязково.

      - **spec.matchResources.resourceRules.scope** (string)

        scope визначає область застосування цього правила. Допустимі значення — "Cluster", "Namespaced" та "\*". "Cluster" означає, що правило буде застосовано тільки до ресурсів на рівні кластера. API обʼєкти простору імен є ресурсами на рівні кластера. "Namespaced" означає, що правило буде застосовано тільки до ресурсів простору імен. "\*" означає, що немає обмежень на область застосування. Субресурси відповідають області застосування свого батьківського ресурсу. Стандартне значення — "\*".

        Можливі значення переліку:
      - `"*"` означає, що включені всі області дії.
      - `"Cluster"` означає, що область дії обмежена обʼєктами в межах кластера. Обʼєкти простору імен мають область дії в межах кластера.
      - `"Namespaced"` означає, що область дії обмежена обʼєктами в просторі імен.

  - **spec.paramRef** (ParamRef)

    paramRef вказує на ресурс параметра, який використовується для налаштування політики контролю допуску. Він повинен вказувати на ресурс типу, визначеного в ParamKind прив’язаної ValidatingAdmissionPolicy. Якщо політика вказує ParamKind, а ресурс, на який посилається ParamRef, не існує, ця привʼязка вважається неправильно налаштованою, і застосовується FailurePolicy ValidatingAdmissionPolicy. Якщо політика не вказує ParamKind, це поле ігнорується, і правила оцінюються без параметра.

    <a name="ParamRef"></a>
    *ParamRef описує, як знайти параметри, які будуть використовуватися як вхідні дані для виразів правил, що застосовуються привʼязкою політики.*

    - **spec.paramRef.name** (string)

      name — це імʼя ресурсу, на який посилаються.

      Одне з `name` або `selector` повинно бути встановлено, але `name` і `selector` є взаємовиключними властивостями. Якщо одне встановлено, інше повинно бути відключено.

      Один параметр, який використовується для всіх запитів на допуск, можна налаштувати, встановивши поле `name`, залишивши `selector` порожнім і встановивши простір імен, якщо `paramKind` має простір імен.

    - **spec.paramRef.namespace** (string)

      namespace — це простір імен ресурсу, на який посилаються. Дозволяє обмежити пошук параметрів певним простором імен. Застосовується як до полів `name`, так і до `selector`.

      Можна використовувати параметр для кожного простору імен, вказавши простір імен для `paramKind` у політиці та залишивши це поле порожнім.

      - Якщо `paramKind` є кластерним, це поле МАЄ бути не встановленим. Встановлення цього поля призведе до помилки конфігурації.

      - Якщо `paramKind` має простір імен, використовується простір імен обʼєкта, який оцінюється на допуск, коли це поле залишено порожнім. Слідкуйте за тим, що якщо це поле залишити порожнім, привʼязка не повинна відповідати жодним ресурсам на рівні кластера, що призведе до помилки.

    - **spec.paramRef.parameterNotFoundAction** (string)

      `parameterNotFoundAction` контролює поведінку привʼязки, коли ресурс існує, і імʼя або селектор є дійсними, але немає параметрів, які відповідають привʼязці. Якщо значення встановлено на `Allow`, тоді відсутність відповідних параметрів буде розцінюватися як успішна валідація привʼязкою. Якщо встановлено `Deny`, то відсутність відповідних параметрів буде підпадати під дію `failurePolicy` політики.

      Допустимі значення: `Allow` або `Deny`.

      Обовʼязково

    - **spec.paramRef.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      selector може бути використаний для відповідності кільком обʼєктам параметрів на основі їх міток. Поставте selector: {} для відповідності всім ресурсам ParamKind.

      Якщо знайдено кілька параметрів, всі вони оцінюються за допомогою виразів політики, і результати об’єднуються логічним І.

      Одне з `name` або `selector` повинно бути встановлено, але `name` і `selector` є взаємовиключними властивостями. Якщо одне встановлено, інше повинно бути відключено.

  - **spec.policyName** (string)

    PolicyName посилається на ім’я ValidatingAdmissionPolicy, до якої прив’язується ValidatingAdmissionPolicyBinding. Якщо вказаний ресурс не існує, ця прив’язка вважається недійсною і буде ігнорована. Обовʼязково.

  - **spec.validationActions** ([]string)

    *Set: під час злиття зберігатимуться унікальні значення*

    validationActions визначає, як виконуються перевірки ValidatingAdmissionPolicy, на яку посилається ValidatingAdmissionPolicyBinding. Якщо перевірка оцінюється як хибна, вона завжди виконується відповідно до цих дій.

    Збої, визначені FailurePolicy ValidatingAdmissionPolicy, виконуються відповідно до цих дій лише у випадку, якщо FailurePolicy встановлено на Fail, інакше збої ігноруються. Це включає помилки компіляції, помилки під час виконання та неправильні конфігурації політики.

    validationActions оголошується як набір значень дій. Порядок не має значення. validationActions не можуть містити дублікатів одного й того самого значення дії.

    Підтримувані значення дій:

    "Deny" означає, що збій перевірки призводить до відхилення запиту.

    "Warn" означає, що збій перевірки повідомляється клієнту запиту в HTTP-заголовках попередження з кодом попередження 299. Попередження можуть надсилатися як для дозволених, так і для відхилених відповідей на допуск.

    "Audit" означає, що збій перевірки включається до опублікованої події аудиту для запиту. Подія аудиту міститиме анотацію аудиту `validation.policy.admission.k8s.io/validation_failure` зі значенням, що містить деталі збоїв перевірки, відформатовані як JSON-список об’єктів, кожен з яких має наступні поля:

    - message: Рядок повідомлення про збій перевірки
    - policy: Ім’я ресурсу ValidatingAdmissionPolicy
    - binding: Ім’я ресурсу ValidatingAdmissionPolicyBinding
    - expressionIndex: Індекс збоїв перевірки в ValidatingAdmissionPolicy
    - validationActions: Дії примусового виконання для збою перевірки Приклад анотації аудиту: `"validation.policy.admission.k8s.io/validation_failure": "[{"message": "Invalid value", {"policy": "policy.example.com", {"binding": "policybinding.example.com", {"expressionIndex": "1", {"validationActions": ["Audit"]}]"`

    Клієнти повинні очікувати обробки додаткових значень, ігноруючи будь-які значення, які не розпізнаються.

    "Deny" і "Warn" не можуть використовуватися разом, оскільки ця комбінація непотрібно дублює збій перевірки як у тілі відповіді API, так і в HTTP-заголовках попередження.

    Обовʼязково.

## Операції {#operations}

---

### `get` отримати вказану ValidatingAdmissionPolicy {#get-read-the-specified-validatingadmissionpolicy}

#### HTTP запит {#http-request}

GET /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя ValidatingAdmissionPolicy

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

401: Unauthorized

### `get` отримати статус вказаної ValidatingAdmissionPolicy {#get-read-status-of-the-specified-validatingadmissionpolicy}

#### HTTP запит {#http-request-1}

GET /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя ValidatingAdmissionPolicy

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ValidatingAdmissionPolicy {#list-list-or-watch-objects-of-kind-validatingadmissionpolicy}

#### HTTP запит {#http-request-2}

GET /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies

#### Параметри {#parameters-2}

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

#### Відповідь {#response-2}

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyList" >}}">ValidatingAdmissionPolicyList</a>): OK

401: Unauthorized

### `create` створення ValidatingAdmissionPolicy {#create-create-a-validatingadmissionpolicy}

#### HTTP запит {#http-request-3}

POST /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

202 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Accepted

401: Unauthorized

### `update` заміна вказаної ValidatingAdmissionPolicy {#update-replace-the-specified-validatingadmissionpolicy}

#### HTTP запит {#http-request-4}

PUT /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя ValidatingAdmissionPolicy

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

401: Unauthorized

### `update` заміна статусу вказаної ValidatingAdmissionPolicy {#update-replace-status-of-the-specified-validatingadmissionpolicy}

#### HTTP запит {#http-request-5}

PUT /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя ValidatingAdmissionPolicy

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаної ValidatingAdmissionPolicy {#patch-partially-update-the-specified-validatingadmissionpolicy}

#### HTTP запит {#http-request-6}

PATCH /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя ValidatingAdmissionPolicy

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

#### Відповідь {#response-6}

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

401: Unauthorized

### `patch` часткове оновдення статусу вказанох ValidatingAdmissionPolicy {#patch-partially-update-status-of-the-specified-validatingadmissionpolicy}

#### HTTP запит {#http-request-7}

PATCH /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя ValidatingAdmissionPolicy

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

#### Відповідь {#response-7}

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicy" >}}">ValidatingAdmissionPolicy</a>): Created

401: Unauthorized

### `delete` видалення ValidatingAdmissionPolicy {#delete-delete-a-validatingadmissionpolicy}

#### HTTP запит {#http-request-8}

DELETE /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя ValidatingAdmissionPolicy

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

#### Відповідь {#response-8}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції ValidatingAdmissionPolicy {#deletecollection-delete-collection-of-validatingadmissionpolicy}

#### HTTP запит {#http-request-9}

DELETE /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicies

#### Параметри {#parameters-9}

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

#### Відповідь {#response-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
