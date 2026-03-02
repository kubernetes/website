---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ValidatingAdmissionPolicyBinding"
content_type: "api_reference"
description: "ValidatingAdmissionPolicyBinding звʼязує ValidatingAdmissionPolicy з параметризованими ресурсами."
title: "ValidatingAdmissionPolicyBinding"
weight: 8
auto_generated: false
---

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## ValidatingAdmissionPolicyBinding {#ValidatingAdmissionPolicyBinding}

ValidatingAdmissionPolicyBinding повʼязує ValidatingAdmissionPolicy з параметризованими ресурсами. ValidatingAdmissionPolicyBinding і параметризовані CRD разом визначають, як адміністраторам кластерів налаштовувати політики для кластерів.

Для кожного запиту на допуск кожне звʼязування спричинить оцінку його політики N разів, де N дорівнює 1 для політик/звʼязувань, які не використовують параметри, в іншому випадку N є кількість параметрів, вибраних звʼязуванням.

CEL вирази політики повинні мати обчислену вартість CEL нижчу за максимальний бюджет CEL. Кожна оцінка політики отримує незалежний бюджет витрат CEL. Додавання/видалення політик, звʼязувань або параметрів не повинно впливати на те, чи є дана комбінація (політика, звʼязування, параметр) у межах свого бюджету CEL.

---

- **apiVersion**: admissionregistration.k8s.io/v1

- **kind**: ValidatingAdmissionPolicyBinding

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартний обʼєкт метаданих; Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.

- **spec** (ValidatingAdmissionPolicyBindingSpec)

  Визначення бажаної поведінки ValidatingAdmissionPolicyBinding.

  <a name="ValidatingAdmissionPolicyBindingSpec"></a>
  *ValidatingAdmissionPolicyBindingSpec є специфікацією ValidatingAdmissionPolicyBinding.*

  - **spec.matchResources** (MatchResources)

    MatchResources декларує, які ресурси відповідають цьому звʼязуванню і будуть перевірені ним. Зверніть увагу, що це перетинається з `matchConstraints` політики, тому тільки запити, які відповідають політиці, можуть бути вибрані цим звʼязуванням. Якщо це не задано, всі ресурси, що відповідають політиці, будуть перевірені цим звʼязуванням.

    Коли `resourceRules` не задано, це не обмежує відповідність ресурсів. Якщо ресурс відповідає іншим полям цього обʼєкта, він буде перевірений. Зверніть увагу, що це відрізняється від `matchConstraints` ValidatingAdmissionPolicy, де `resourceRules` є обовʼязковими.

    <a name="MatchResources"></a>
    *MatchResources визначає, чи слід застосовувати політику контролю доступу до обʼєкта на основі того, чи відповідає він критеріям відповідності. Правила виключення мають перевагу над правилами включення (якщо ресурс відповідає обом, він буде виключений).*

    - **spec.matchResources.excludeResourceRules** ([]NamedRuleWithOperations)

      *Atomic: буде замінено під час злиття*

      ExcludeResourceRules описує, які операції над якими ресурсами/підресурсами ValidatingAdmissionPolicy не повинна враховувати. Правила виключення мають перевагу над правилами включення (якщо ресурс відповідає обом, він буде виключений).

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations є кортежем Operations та Resources з ResourceNames.*

      - **spec.matchResources.excludeResourceRules.apiGroups** ([]string)

        *Atomic: буде замінено під час злиття*

        APIGroups — це групи API, до яких належать ресурси. '\*' — це всі групи. Якщо '\*' присутній, довжина фрагменту повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchResources.excludeResourceRules.apiVersions** ([]string)

        *Atomic: буде замінено під час злиття*

        APIVersions — це версії API, до яких належать ресурси. '\*' — всі версії. Якщо '\*' присутній, довжина фрагменту повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchResources.excludeResourceRules.operations** ([]string)

        *Atomic: буде замінено під час злиття*

        Operations — це операції, які цікавлять хук допуску - CREATE, UPDATE, DELETE, CONNECT або \* для всіх цих операцій і будь-яких майбутніх операцій допуску, які будуть додані. Якщо присутній символ "\*", довжина фрагмента повинна бути одиницею. Обовʼязково.

      - **spec.matchResources.excludeResourceRules.resourceNames** ([]string)

        *Atomic: буде замінено під час злиття*

        ResourceNames — необовʼязковий білий список імен, до яких застосовується правило.  Порожній список означає, що дозволено все.

      - **spec.matchResources.excludeResourceRules.resources** ([]string)

        *Atomic: буде замінено під час злиття*

        Resources — список ресурсів, до яких застосовується це правило.

        Наприклад: 'pods' означає podʼи. 'pods/log' означає підресурс журналу podʼів. '\*' означає всі ресурси, але не підресурси. 'pods/\*' означає всі підресурси podʼів. '\*/scale' означає всі підресурси масштабу. '\*/\*' означає всі ресурси і їхні підресурси.

        Якщо присутній символ підстановки, правило валідації забезпечить, щоб ресурси не перекривалися між собою.

        Залежно від обʼєкта, що містить, підресурси можуть бути не дозволені. Обовʼязкове.

      - **spec.matchResources.excludeResourceRules.scope** (string)

        scope визначає область цього правила. Дійсні значення: "Cluster", "Namespaced" та "\*". "Cluster" означає, що лише ресурси з областю дії кластера відповідатимуть цьому правилу. Обʼєкти API простору імен є кластерними. "Namespaced" означає, що лише ресурси з простору імен відповідатимуть цьому правилу. "\*" означає, що обмежень за областю дії немає. Підресурси відповідають області їхнього батьківського ресурсу. Стандартно "\*".

        Можливі значення переліку:
        - `"*"` означає, що включені всі області дії.
        - `"Cluster"` означає, що область дії обмежена обʼєктами в межах кластера. Обʼєкти простору імен мають область дії в межах кластера.
        - `"Namespaced"` означає, що область дії обмежена обʼєктами в просторі імен.

    - **spec.matchResources.matchPolicy** (string)

      matchPolicy визначає, як список "MatchResources" використовується для відповідності вхідним запитам. Дійсні значення: "Exact" або "Equivalent".

      - Exact: відповідати запиту лише тоді, коли він точно відповідає зазначеному правилу. Наприклад, якщо deployments можуть бути змінені через apps/v1, apps/v1beta1 і extensions/v1beta1, але "rules" включали лише `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, запит до apps/v1beta1 або extensions/v1beta1 не буде надісланий до ValidatingAdmissionPolicy.

      - Equivalent: відповідати запиту, якщо він змінює ресурс, зазначений у правилах, навіть через іншу групу API або версію. Наприклад, якщо deployments можуть бути змінені через apps/v1, apps/v1beta1 і extensions/v1beta1, і "rules" включають лише `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, запит до apps/v1beta1 або extensions/v1beta1 буде перетворено на apps/v1 і надіслано до ValidatingAdmissionPolicy.

      Стандартно — "Equivalent".

      Можливі значення переліку (enum):
      - `"Equivalent"` означає, що запити повинні надсилатися до вебхука, якщо вони змінюють ресурс, зазначений у правилах, через іншу групу API або версію.
      - `"Exact"` означає, що запити повинні надсилатися до вебхука лише в тому випадку, якщо вони точно відповідають даному правилу.

    - **spec.matchResources.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      NamespaceSelector вирішує, чи слід застосовувати політику контролю доступу до обʼєкта на основі того, чи відповідає простір імен цього обʼєкта селектору. Якщо сам обʼєкт є простором імен, відповідність перевіряється за `object.metadata.labels`. Якщо обʼєкт є іншим ресурсом з областю кластеру, політика ніколи не пропускається.

      Наприклад, щоб застосовувати вебхук до будь-яких обʼєктів, простір імен яких не асоційований з "runlevel" значенням "0" або "1", ви встановите селектор наступним чином:

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

      Якщо ви хочете застосовувати політику лише до об'єктів, простір імен яких асоційований з "environment" значенням "prod" або "staging", ви встановите селектор наступним чином:

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

      Дивіться [https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/](/docs/concepts/overview/working-with-objects/labels/) для прикладів селекторів міток.

      Стандартно використовується порожній LabelSelector, який відповідає всьому.

    - **spec.matchResources.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      ObjectSelector вирішує, чи слід виконувати валідацію на основі того, чи має обʼєкт відповідні мітки. `objectSelector` оцінюється як для `oldObject`, так і для `newObject`, які будуть надіслані на перевірку CEL, і вважається відповідним, якщо хоча б один з обʼєктів відповідає селектору. Обʼєкт null (oldObject у випадку створення або newObject у випадку видалення) або обʼєкт, який не може мати міток (наприклад, DeploymentRollback або PodProxyOptions), не вважається таким, що мають збіг.

      Використовуйте селектор обʼєкта лише якщо вебхук є опціональним, оскільки кінцеві користувачі можуть пропустити вебхук допуску, встановивши мітки. Стандартно використовується порожній LabelSelector, який відповідає всьому.

    - **spec.matchResources.resourceRules** ([]NamedRuleWithOperations)

      *Atomic: буде замінено під час злиття*

      ResourceRules описує, які операції з якими ресурсами/підресурсами мають збіг ValidatingAdmissionPolicy. Політика враховує операцію, якщо вона відповідає *будь-якому* правилу.

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations є кортежем Operations та Resources з ResourceNames.*

      - **spec.matchResources.resourceRules.apiGroups** ([]string)

        *Atomic: буде замінено під час злиття*

        APIGroups — це групи API, до яких належать ресурси. '\*' — всі групи. Якщо '\*' присутній, довжина фрагменту повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchResources.resourceRules.apiVersions** ([]string)

        *Atomic: буде замінено під час злиття*

        APIVersions — це версії API, до яких належать ресурси. '\*' — всі версії. Якщо '\*' присутній, довжина фрагменту повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchResources.resourceRules.operations** ([]string)

        *Atomic: буде замінено під час злиття*

        Operations — це операції, які цікавлять хук допуску - CREATE, UPDATE, DELETE, CONNECT або \* для всіх цих операцій і будь-яких майбутніх операцій допуску, які будуть додані. Якщо присутній символ "\*", довжина фрагмента повинна бути одиницею. Обовʼязково.

      - **spec.matchResources.resourceRules.resourceNames** ([]string)

        *Atomic: буде замінено під час злиття*

        ResourceNames — це необовʼязковий білий список імен, до яких застосовується правило. Порожній набір означає, що дозволено все.

      - **spec.matchResources.resourceRules.resources** ([]string)

        *Atomic: буде замінено під час злиття*

        Resources — список ресурсів, до яких застосовується це правило.

        Наприклад: 'pods' означає podʼи. 'pods/log' означає підресурс журналу podʼів. '\*' означає всі ресурси, але не підресурси. 'pods/\*' означає всі підресурси podʼів. '\*/scale' означає всі підресурси масштабу. '\*/\*' означає всі ресурси і їхні підресурси.

        Якщо присутній символ підстановки, правило валідації забезпечить, щоб ресурси не перекривалися між собою.

        Залежно від обʼєкта, що містить, підресурси можуть бути не дозволені. Обовʼязкове.

      - **spec.matchResources.resourceRules.scope** (string)

        scope визначає область цього правила. Дійсні значення: "Cluster", "Namespaced" та "\*". "Cluster" означає, що лише ресурси з областю дії кластера відповідатимуть цьому правилу. Обʼєкти API простору імен є кластерними. "Namespaced" означає, що лише ресурси з простору імен відповідатимуть цьому правилу. "\*" означає, що обмежень за областю дії немає. Підресурси відповідають області їхнього батьківського ресурсу. Стандартно "\*".

        Можливі значення переліку:
        - `"*"` означає, що включені всі області дії.
        - `"Cluster"` означає, що область дії обмежена обʼєктами в межах кластера. Обʼєкти простору імен мають область дії в межах кластера.
        - `"Namespaced"` означає, що область дії обмежена обʼєктами в просторі імен.

  - **spec.paramRef** (ParamRef)

    paramRef вказує на ресурс параметра, який використовується для конфігурації політики контролю доступу. Він має вказувати на ресурс типу, зазначеного в ParamKind привʼязаної ValidatingAdmissionPolicy. Якщо політика вказує ParamKind, а ресурс, на який посилається ParamRef, не існує, це привʼязування вважається неправильно налаштованим, і застосовується FailurePolicy ValidatingAdmissionPolicy. Якщо політика не вказує ParamKind, це поле ігнорується, а правила оцінюються без параметра.

    <a name="ParamRef"></a>
    *ParamRef описує, як знайти параметри, які будуть використовуватися як вхідні дані для виразів правил, застосованих привʼязуванням політики.*

    - **spec.paramRef.name** (string)

      name — це ім'я ресурсу, на який посилаються.

      Один з параметрів `name` або `selector` повинен бути заданий, але `name` і `selector` є взаємовиключними властивостями. Якщо одне з них задане, інше повинно бути не задане.

      Один параметр, що використовується для всіх запитів на допуск, можна налаштувати, задавши поле `name`, залишивши `selector` порожнім і задавши простір імен, якщо `paramKind` має область простору імен.

    - **spec.paramRef.namespace** (string)

      namespace — це простір імен ресурсу, на який посилаються. Дозволяє обмежити пошук параметрів певним простором імен. Застосовується до обох полів `name` і `selector`.

      Параметр для кожного простору імен можна використовувати, вказавши у політиці `paramKind` для простору імен і залишивши це поле порожнім.

      - Якщо `paramKind` має область дії кластер, це поле МАЄ бути не задане. Встановлення цього поля призводить до помилки конфігурації.

      - Якщо `paramKind` має область дії простір імен, буде використано простір імен обʼєкта, що оцінюється для допуску, коли це поле залишено порожнім. Зверніть увагу, що якщо це поле залишено пустим, привʼязування не повинно відповідати жодним ресурсам з областю дії кластера, що призведе до помилки.

    - **spec.paramRef.parameterNotFoundAction** (string)

      `parameterNotFoundAction` контролює поведінку привʼязування, коли ресурс існує, і `name` або `selector` є дійсними, але не знайдено жодних параметрів, які відповідають привʼязуванню. Якщо значення встановлено на `Allow`, то відсутність відповідних параметрів буде розглядатися привʼязуванням як успішна валідація. Якщо встановлено на `Deny`, то відсутність відповідних параметрів підлягатиме `failurePolicy` політиці.

      Дозволені значення — `Allow` або `Deny`

      Обовʼязково.

    - **spec.paramRef.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    selector може використовуватися для відповідності кільком обʼєктам параметрів на основі їхніх міток. Постачайте `selector: {}` для відповідності всім ресурсам типу ParamKind.

    Якщо знайдено кілька параметрів, вони всі оцінюються за виразами політики, і результати обʼєднуються за допомогою логічного оператора AND.

    Один з параметрів `name` або `selector` повинен бути заданий, але `name` і `selector` є взаємовиключними властивостями. Якщо одне з них задане, інше повинно бути не задане.

  - **spec.policyName** (string)

    PolicyName посилається на імʼя ValidatingAdmissionPolicy, до якого привʼязується ValidatingAdmissionPolicyBinding. Якщо посиланий ресурс не існує, це привʼязування вважається недійсним і буде ігноруватися. Обовʼязкове.

  - **spec.validationActions** ([]string)

    *Set: унікальні значення будуть збережені під час злиття*

    validationActions визначає, як виконуються валідації вказаної ValidatingAdmissionPolicy. Якщо валідація оцінюється як невірна, вона завжди виконується відповідно до цих дій.

    Помилки, визначені FailurePolicy ValidatingAdmissionPolicy, виконуються відповідно до цих дій тільки якщо FailurePolicy встановлено на Fail, в іншому випадку помилки ігноруються. Це включає помилки компіляції, помилки виконання та неправильні конфігурації політики.

    validationActions оголошено як набір значень дій. Порядок не має значення. validationActions не може містити дублікатів однієї і тієї ж дії.

    Підтримувані значення дій:

    "Deny" вказує, що невдача валідації призводить до відмови у запиті.

    "Warn" вказує, що невдача валідації повідомляється клієнту запиту в заголовках HTTP Warning з кодом попередження 299. Попередження можуть бути надіслані як для дозволених, так і для відхилених відповідей на допуск.

    "Audit" вказує, що невдача валідації включена в опубліковану подію аудиту запиту. Подія аудиту буде містити анотацію аудиту `validation.policy.admission.k8s.io/validation_failure` зі значенням, яке містить деталі невдач валідації у форматі JSON списку обʼєктів, кожен з яких має такі поля:
    - message: Рядок повідомлення про невдачу валідації
    - policy: Імʼя ресурсу ValidatingAdmissionPolicy
    - binding: Імʼя ресурсу ValidatingAdmissionPolicyBinding
    - expressionIndex: Індекс невдалих валідацій у ValidatingAdmissionPolicy
    - validationActions: Дії виконання, що були застосовані до невдачі валідації

    Приклад анотації аудиту: `"validation.policy.admission.k8s.io/validation_failure": "[{"message": "Invalid value", {"policy": "policy.example.com", {"binding": "policybinding.example.com", {"expressionIndex": "1", {"validationActions": ["Audit"]}]"`

    Клієнти повинні очікувати обробку додаткових значень, ігноруючи будь-які нерозпізнані значення.

    "Deny" та "Warn" не можуть використовуватися разом, оскільки ця комбінація зайво дублює невдачу валідації як у тілі відповіді API, так і в заголовках HTTP попередження.

    Обовʼязкове.

## ValidatingAdmissionPolicy {#ValidatingAdmissionPolicy}

ValidatingAdmissionPolicy описує визначення політики валідації допуску, яка приймає або відхиляє обʼєкт без його зміни.

---

- **apiVersion** (string)

  APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати визнані схеми до останнього внутрішнього значення і можуть відхиляти невизнані значення. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  Kind — це рядкове значення, що представляє REST-ресурс, який цей обʼєкт уособлює. Сервери можуть виводити його з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У форматі CamelCase. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартний обʼєкт метаданих; Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.

- **spec** (ValidatingAdmissionPolicySpec)

  Визначення бажаної поведінки ValidatingAdmissionPolicy.

  <a name="ValidatingAdmissionPolicySpec"></a>
  *ValidatingAdmissionPolicySpec — це специфікація бажаної поведінки AdmissionPolicy.*

  - **spec.auditAnnotations** ([]AuditAnnotation)

    *Atomic: буде замінено під час злиття*

    auditAnnotations містить вирази CEL, які використовуються для створення анотацій аудиту для події аудиту API-запиту. `validations` і `auditAnnotations` не можуть бути обидва порожніми; принаймні одне з них є обовʼязковим.

    <a name="AuditAnnotation"></a>
    *AuditAnnotation описує, як створити анотацію аудиту для запиту API.*

    - **spec.auditAnnotations.key** (string), обовʼязково

      key визначає ключ анотації аудиту. Ключі анотацій аудиту для ValidatingAdmissionPolicy повинні бути унікальними. Ключ повинен бути кваліфікованим іменем ([A-Za-z0-9][-A-Za-z0-9_.]\*) довжиною не більше 63 байтів.

      Ключ комбінується з іменем ресурсу ValidatingAdmissionPolicy для створення ключа анотації аудиту: "{Ім'я ValidatingAdmissionPolicy}/{ключ}".

      Якщо admission webhook використовує те саме ім'я ресурсу, що і ця ValidatingAdmissionPolicy, та той же ключ анотації аудиту, ключ анотації буде ідентичним. У цьому випадку перша анотація, написана з цим ключем, буде включена в подію аудиту, а всі наступні анотації з тим же ключем будуть відкинуті.

      Обовʼязкове.

    - **spec.auditAnnotations.valueExpression** (string), обовʼязково

      valueExpression представляє вираз, який оцінюється CEL для створення значення анотації аудиту. Вираз має оцінюватися як рядок або null. Якщо вираз оцінюється як рядок, анотація аудиту включається з рядковим значенням. Якщо вираз оцінюється як null або порожній рядок, анотація аудиту буде пропущена. valueExpression не може перевищувати 5 КБ в довжину. Якщо результат valueExpression перевищує 10 КБ в довжину, він буде обрізаний до 10 КБ.

      Якщо кілька ресурсів ValidatingAdmissionPolicyBinding відповідають API-запиту, вираз valueExpression буде оцінений для кожного привʼязування. Всі унікальні значення, отримані від valueExpressions, будуть обʼєднані в список, розділений комами.

      Обовʼязкове.

  - **spec.failurePolicy** (string)

    failurePolicy визначає, як обробляти помилки для політики допуску. Помилки можуть виникати через помилки парсингу виразів CEL, помилки перевірки типів, помилки виконання та неправильні або некоректно налаштовані визначення політики або привʼязки.

    Політика вважається недійсною, якщо `spec.paramKind` посилається на неіснуючий Kind. Привʼязка є недійсною, якщо `spec.paramRef.name` посилається на неіснуючий ресурс.

    failurePolicy не визначає, як обробляються валідації, що оцінюються як невірні.

    Коли failurePolicy встановлено на Fail, `ValidatingAdmissionPolicyBinding` validationActions визначає, як застосовуються помилки.

    Допустимі значення: Ignore або Fail. Стандартно — Fail.

    Можливі значення переліку (enum):
    - `"Fail"` означає, що помилка виклику вебхука призводить до невдачі допуску.
    - `"Ignore"` означає, що помилка виклику вебхука ігнорується.

  - **spec.matchConditions** ([]MatchCondition)

    *Patch strategy: обʼєднання за ключем `name`*

    *Map: унікальні значення ключа name будуть збережені під час злиття*

    MatchConditions — це список умов, які повинні бути виконані для валідації запиту. Умови збігу фільтрують запити, які вже були відповідно до правил, `namespaceSelector` і `objectSelector`. Порожній список `matchConditions` відповідає всім запитам. Максимальна кількість умов збігу — 64.

    Якщо надано обʼєкт параметра, до нього можна звертатися через дескриптор `params` так само, як і до виразів валідації.

    Точна логіка збігу (впорядкована):

    1. Якщо будь-яка умова `matchCondition` оцінюється як FALSE, політика пропускається.
    2. Якщо всі умови `matchConditions` оцінюються як TRUE, політика оцінюється.
    3. Якщо будь-яка умова `matchCondition` оцінюється як помилка (але жодна не є FALSE):
       - Якщо `failurePolicy=Fail`, запит відхиляється.
       - Якщо `failurePolicy=Ignore`, політика пропускається.

    <a name="MatchCondition"></a>
    *MatchCondition представляє умову, яка повинна бути виконана для того, щоб запит був надісланий до вебхука.*

    - **spec.matchConditions.expression** (string), обовʼязково

      Expression представляє вираз, який буде оцінюватися CEL. Повинен оцінюватися як bool. CEL вирази мають доступ до вмісту AdmissionRequest та Authorizer, організованого у змінні CEL:

      - `'object'` — обʼєкт з вхідного запиту. Значення є null для запитів DELETE.
      - `'oldObject'` — існуючий обʼєкт. Значення є null для запитів CREATE.
      - `'request'` — атрибути запиту на допуск (/pkg/apis/admission/types.go#AdmissionRequest).
      - `'authorizer'` — CEL Authorizer. Може бути використаний для виконання перевірок авторизації для принципала (користувача або службового облікового запису) запиту. Див. https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz.
      - `'authorizer.requestResource'` — CEL ResourceCheck, створений з `authorizer` і налаштований з ресурсом запиту.

      Документація про CEL: [https://kubernetes.io/docs/reference/using-api/cel/](/docs/reference/using-api/cel/)

      Обовʼязкове.

    - **spec.matchConditions.name** (string), обовʼязково

      Name є ідентифікатором для цієї умови збігу, який використовується для стратегічного злиття `MatchConditions`, а також для надання ідентифікатора для цілей журналювання. Добре вибране імʼя повинно бути описовим для відповідного виразу. Name повинно бути кваліфікованим іменем, що складається з алфавітно-цифрових символів, '-', '\_' або '.', і повинно починатися та закінчуватися алфавітно-цифровим символом (наприклад, 'MyName', 'my.name', '123-abc', регулярний вираз для перевірки — '([A-Za-z0-9][-A-Za-z0-9_.]\*)?[A-Za-z0-9]') з необовʼязковим префіксом DNS піддомену та '/' (наприклад, 'example.com/MyName').

      Обовʼязкове.

  - **spec.matchConstraints** (MatchResources)

    MatchConstraints визначає ресурси, які ця політика має перевіряти. AdmissionPolicy турбується про запит, якщо він відповідає *усім* Constraints. Однак, для запобігання випадкам, коли кластер може бути переведений в нестабільний стан, з якого не можна відновитися через API, ValidatingAdmissionPolicy не може відповідати ValidatingAdmissionPolicy і ValidatingAdmissionPolicyBinding.

    Обовʼязкове.

    <a name="MatchResources"></a>
    *MatchResources визначає, чи потрібно застосовувати політику контролю доступу до обʼєкта на основі того, чи відповідає він критеріям збігу. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає обом критеріям, він буде виключений).*

    - **spec.matchConstraints.excludeResourceRules** ([]NamedRuleWithOperations)

      *Atomic: буде замінено під час злиття*

      ExcludeResourceRules описує операції над ресурсами/підресурсами, про які ValidatingAdmissionPolicy не повинна турбуватися. Правила виключення мають пріоритет над правилами включення (якщо ресурс відповідає обом критеріям, він буде виключений).

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations є кортежем Operations та Resources з ResourceNames.*

      - **spec.matchConstraints.excludeResourceRules.apiGroups** ([]string)

        *Atomic: буде замінено під час злиття*

        APIGroups — це групи API, до яких належать ресурси. '\*' — всі групи. Якщо '\*' присутній, довжина фрагменту повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchConstraints.excludeResourceRules.apiVersions** ([]string)

        *Atomic: буде замінено під час злиття*

        APIVersions — це версії API, до яких належать ресурси. '\*' — всі версії. Якщо '\*' присутній, довжина фрагменту повинна бути одиницею. Обовʼязковий параметр.

      - **spec.matchConstraints.excludeResourceRules.operations** ([]string)

        *Atomic: буде замінено під час злиття*

        Operations — це операції, які цікавлять хук допуску - CREATE, UPDATE, DELETE, CONNECT або \* для всіх цих операцій і будь-яких майбутніх операцій допуску, які будуть додані. Якщо присутній символ "\*", довжина фрагмента повинна бути одиницею. Обовʼязково.

      - **spec.matchConstraints.excludeResourceRules.resourceNames** ([]string)

        *Atomic: буде замінено під час злиття*

        ResourceNames — це необовʼязковий білий список імен, до яких застосовується правило. Порожній набір означає, що дозволено все.

      - **spec.matchConstraints.excludeResourceRules.resources** ([]string)

        *Atomic: буде замінено під час злиття*

        Resources — список ресурсів, до яких застосовується це правило.

        Наприклад: 'pods' означає podʼи. 'pods/log' означає підресурс журналу podʼів. '\*' означає всі ресурси, але не підресурси. 'pods/\*' означає всі підресурси podʼів. '\*/scale' означає всі підресурси масштабу. '\*/\*' означає всі ресурси і їхні підресурси.

        Якщо присутній символ підстановки, правило валідації забезпечить, щоб ресурси не перекривалися між собою.

        Залежно від обʼєкта, що містить, підресурси можуть бути не дозволені. Обовʼязкове.

      - **spec.matchConstraints.excludeResourceRules.scope** (string)

        scope визначає область цього правила. Дійсні значення: "Cluster", "Namespaced" та "\*". "Cluster" означає, що лише ресурси з областю дії кластера відповідатимуть цьому правилу. Обʼєкти API простору імен є кластерними. "Namespaced" означає, що лише ресурси з простору імен відповідатимуть цьому правилу. "\*" означає, що обмежень за областю дії немає. Підресурси відповідають області їхнього батьківського ресурсу. Стандартно "\*".

        Можливі значення переліку:
        - `"*"` означає, що включені всі області дії.
        - `"Cluster"` означає, що область дії обмежена обʼєктами в межах кластера. Обʼєкти простору імен мають область дії в межах кластера.
        - `"Namespaced"` означає, що область дії обмежена обʼєктами в просторі імен.

    - **spec.matchConstraints.matchPolicy** (string)

      matchPolicy визначає, як список "MatchResources" використовується для відповідності вхідним запитам. Дійсні значення: "Exact" або "Equivalent".

      - Exact: відповідати запиту лише тоді, коли він точно відповідає зазначеному правилу. Наприклад, якщо deployments можуть бути змінені через apps/v1, apps/v1beta1 і extensions/v1beta1, але "rules" включали лише `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, запит до apps/v1beta1 або extensions/v1beta1 не буде надісланий до ValidatingAdmissionPolicy.

      - Equivalent: відповідати запиту, якщо він змінює ресурс, зазначений у правилах, навіть через іншу групу API або версію. Наприклад, якщо deployments можуть бути змінені через apps/v1, apps/v1beta1 і extensions/v1beta1, і "rules" включають лише `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, запит до apps/v1beta1 або extensions/v1beta1 буде перетворено на apps/v1 і надіслано до ValidatingAdmissionPolicy.

      Стандартно — "Equivalent".

      Можливі значення переліку (enum):
      - `"Equivalent"` означає, що запити повинні надсилатися до вебхука, якщо вони змінюють ресурс, зазначений у правилах, через іншу групу API або версію.
      - `"Exact"` означає, що запити повинні надсилатися до вебхука лише в тому випадку, якщо вони точно відповідають даному правилу.

    - **spec.matchConstraints.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      NamespaceSelector визначає, чи слід застосовувати політику контролю доступу до обʼєкта на основі того, чи відповідає простір імен цього обʼєкта селектору. Якщо обʼєкт сам є простором імен, то відповідність перевіряється на object.metadata.labels. Якщо обʼєкт є іншим ресурсом, що охоплює кластер, політика ніколи не пропускається.

      Наприклад, щоб застосувати вебхук до будь-яких обʼєктів, простір імен яких не асоціюється з "runlevel" "0" або "1", ви повинні встановити селектор наступним чином:

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

      Якщо ви хочете застосувати політику лише до обʼєктів, простір імен яких асоційований з "середовищем" "prod" або "staging", ви повинні налаштувати селектор таким чином:

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

      Дивіться [https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/](/docs/concepts/overview/working-with-objects/labels/) щоб отримати більше прикладів селекторів міток.

      Стандартне значення пустий LabelSelector, який відповідає всьому.

    - **spec.matchConstraints.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      ObjectSelector визначає, чи потрібно виконати перевірку на основі того, чи має обʼєкт відповідні мітки. ObjectSelector оцінюється як для старого обʼєкта (oldObject), так і для нового обʼєкта (newObject), які будуть надіслані для перевірки cel, і вважається, що він відповідає, якщо будь-який з обʼєктів відповідає селектору. Null-обʼєкт (oldObject у випадку створення або newObject у випадку видалення) або обʼєкт, який не може мати мітки (такі як DeploymentRollback або PodProxyOptions), не вважається таким, що має збіг. Використовуйте селектор обʼєктів лише в разі, якщо веб-хук є опційним, оскільки кінцеві користувачі можуть пропустити admission webhook, налаштувавши мітки. Стандартно використовуйте пустий LabelSelector, який відповідає всьому.

    - **spec.matchConstraints.resourceRules** ([]NamedRuleWithOperations)

      *Atomic: буде замінено під час злиття*

      ResourceRules описує, які операції на яких ресурсах/підресурсах відповідає ValidatingAdmissionPolicy. Політика враховує операцію, якщо вона відповідає *будь-якому* правилу.

      <a name="NamedRuleWithOperations"></a>
      *NamedRuleWithOperations є кортежем Operations та Resources з ResourceNames.*

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

        Можливі значення переліку:
        - `"*"` означає, що включені всі області дії.
        - `"Cluster"` означає, що область дії обмежена обʼєктами в межах кластера. Обʼєкти простору імен мають область дії в межах кластера.
        - `"Namespaced"` означає, що область дії обмежена обʼєктами в просторі імен.

  - **spec.paramKind** (ParamKind)

    ParamKind вказує тип ресурсів, які використовуються для параметризації цієї політики. Якщо відсутній, параметрів для цієї політики немає, і змінна param CEL не буде надана для виразів перевірки. Якщо ParamKind посилається на неіснуючий тип, ця конфігурація політики є неправильною, і застосовується FailurePolicy. Якщо paramKind зазначено, але paramRef не встановлено у ValidatingAdmissionPolicyBinding, змінна params буде null.

    <a name="ParamKind"></a>
    *ParamKind — це кортеж Group Kind та Version.*

    - **spec.paramKind.apiVersion** (string)

      APIVersion - версія групи API, до якої належать ресурси. У форматі "group/version". Обовʼязковий параметр.

    - **spec.paramKind.kind** (string)

      Kind — це тип API, до якого належать ресурси. Обовʼязковий параметр.

  - **spec.validations** ([]Validation)

    *Atomic: буде замінено під час злиття*

    Validations містять вирази CEL, які використовуються для застосування перевірки. Validations та AuditAnnotations не можуть бути обидва пустими; потрібно щонайменше один з Validations або AuditAnnotations.

    <a name="Validation"></a>
    *Validation вказує вираз CEL, який використовується для застосування перевірки.*

    - **spec.validations.expression** (string), обовʼязково

      Expression представляє вираз, який буде оцінюватися CEL. ref: https://github.com/google/cel-spec CEL-вирази мають доступ до вмісту запиту/відповіді API, організованих у змінні CEL, а також деякі інші корисні змінні:

      - 'object' — Обʼєкт з вхідного запиту. Значення null для запитів DELETE.
      - 'oldObject' — Наявний обʼєкт. Значення null для запитів CREATE.
      - 'request' — Атрибути запиту API([ref](/pkg/apis/admission/types.go#AdmissionRequest)).
      - 'params' — Параметр ресурсу, на який посилається перевірка політики. Заповнюється лише, якщо політика має ParamKind.
      - 'namespaceObject' — Обʼєкт простору імен, до якого належить вхідний обʼєкт. Значення null для ресурсів на рівні кластера.
      - 'variables' - Map змінних, від їх назви до їхнього ледачого (lazily) оцінюваного значення.  Наприклад, змінна з назвою 'foo' може бути доступна як 'variables.foo'.
      - 'authorizer' — CEL Authorizer. Може використовуватися для виконання перевірок авторизації для виконавця (користувача або службового облікового запису) запиту. Див. https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
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

## ValidatingAdmissionPolicyBindingList {#ValidatingAdmissionPolicyBindingList}

ValidatingAdmissionPolicyBindingList — це список ValidatingAdmissionPolicyBinding.

---

- **items** ([]<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyBinding" >}}">ValidatingAdmissionPolicyBinding</a>), обовʼязково

  Перелік PolicyBinding.

- **apiVersion** (string)

  APIVersion визначає версію схеми цього подання обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  Kind — це рядкове значення, яке представляє REST-ресурс, який представляє цей обʼєкт. Сервери можуть вивести це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

## Операції {#Operations}

---

### `get` отримати вказанний ValidatingAdmissionPolicyBinding {#get-read-the-specified-validatingadmissionpolicybinding}

#### HTTP запит {#http-request}

GET /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicybindings/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя ValidatingAdmissionPolicyBinding

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyBinding" >}}">ValidatingAdmissionPolicyBinding</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ValidatingAdmissionPolicyBinding {#list-list-or-watch-objects-of-kind-validatingadmissionpolicybinding}

#### HTTP запит {#http-request-1}

GET /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicybindings

#### Параметри {#parameters-1}

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

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyBindingList" >}}">ValidatingAdmissionPolicyBindingList</a>): OK

401: Unauthorized

### `create` створення ValidatingAdmissionPolicyBinding {#create-create-a-validatingadmissionpolicybinding}

#### HTTP запит {#http-request-2}

POST /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicybindings

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyBinding" >}}">ValidatingAdmissionPolicyBinding</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyBinding" >}}">ValidatingAdmissionPolicyBinding</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyBinding" >}}">ValidatingAdmissionPolicyBinding</a>): Created

202 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyBinding" >}}">ValidatingAdmissionPolicyBinding</a>): Accepted

401: Unauthorized

### `update` заміна вказаного ValidatingAdmissionPolicyBinding {#update-replace-the-specified-validatingadmissionpolicybinding}

#### HTTP запит {#http-request-3}

PUT /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicybindings/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя ValidatingAdmissionPolicyBinding

- **body**: <a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyBinding" >}}">ValidatingAdmissionPolicyBinding</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyBinding" >}}">ValidatingAdmissionPolicyBinding</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyBinding" >}}">ValidatingAdmissionPolicyBinding</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного ValidatingAdmissionPolicyBinding {#patch-partially-update-the-specified-validatingadmissionpolicybinding}

#### HTTP запит {#http-request-4}

PATCH /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicybindings/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя ValidatingAdmissionPolicyBinding

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

200 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyBinding" >}}">ValidatingAdmissionPolicyBinding</a>): OK

201 (<a href="{{< ref "../policy-resources/validating-admission-policy-binding-v1#ValidatingAdmissionPolicyBinding" >}}">ValidatingAdmissionPolicyBinding</a>): Created

401: Unauthorized

### `delete` видалення ValidatingAdmissionPolicyBinding {#delete-delete-a-validatingadmissionpolicybinding}

#### HTTP запит {#http-request-5}

DELETE /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicybindings/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя ValidatingAdmissionPolicyBinding

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

### `deletecollection` видалення колекції ValidatingAdmissionPolicyBinding {#deletecollection-delete-collection-of-validatingadmissionpolicybinding}

#### HTTP запит {#http-request-6}

DELETE /apis/admissionregistration.k8s.io/v1/validatingadmissionpolicybindings

#### Параметри {#parameters-6}

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
