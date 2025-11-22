---
title: Міграція з PodSecurityPolicy до вбудованого контролера допуску PodSecurity
content_type: task
min-kubernetes-server-version: v1.22
weight: 260
---

<!-- overview -->

Ця сторінка описує процес міграції з PodSecurityPolicy до вбудованого контролера допуску PodSecurity. Це можна зробити ефективно за допомогою комбінації запуску dry-run та режимів `audit` та `warn`, хоча це стає складнішим, якщо використовуються мутуючі PSP.

## {{% heading "prerequisites" %}}

{{% version-check %}}

Якщо ви використовуєте відмінну від {{< skew currentVersion >}} версію Kubernetes, вам можливо захочеться перейти до перегляду цієї сторінки у документації для версії Kubernetes, яку ви фактично використовуєте.

Ця сторінка передбачає, що ви вже знайомі з основними концепціями [Pod Security Admission](/docs/concepts/security/pod-security-admission/).

<!-- body -->

## Загальний підхід {#overall-approach}

Існує кілька стратегій для міграції з PodSecurityPolicy до Pod Security Admission. Наведені нижче кроки — це один з можливих шляхів міграції, з метою мінімізації ризиків виробничої перерви та пробілів у безпеці.

<!-- Keep section header numbering in sync with this list. -->
0. Вирішіть, чи Pod Security Admission відповідає вашому випадку використання.
1. Перегляньте дозволи простору імен.
2. Спростіть та стандартизуйте PodSecurityPolicies.
3. Оновіть простори імен
   1. Визначте відповідний рівень безпеки Podʼа.
   2. Перевірте рівень безпеки Podʼів.
   3. Застосуйте рівень безпеки Podʼів.
   4. Оминіть PodSecurityPolicy.
4. Перегляньте процеси створення просторів імен.
5. Вимкніть PodSecurityPolicy.

## 0. Вирішіть, чи Pod Security Admission підходить для вас {#is-psa-right-for-you}

Pod Security Admission був розроблений для задоволення найбільш поширених потреб у безпеці з коробки, а також для забезпечення стандартного набору рівнів безпеки у всіх кластерах. Однак він менш гнучкий, ніж PodSecurityPolicy. Зокрема, наступні функції підтримуються за допомогою PodSecurityPolicy, але не за допомогою Pod Security Admission:

- **Встановлення типових обмежень безпеки** — Pod Security Admission є немутуючим контролером допуску, що означає, що він не буде змінювати Podʼи перед їх перевіркою. Якщо ви покладалися на цей аспект PodSecurityPolicy, вам доведеться або модифікувати ваші робочі навантаження, щоб вони відповідали обмеженням безпеки Podʼів, або використовувати [Мутуючий вебхук допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/) для внесення цих змін. Дивіться [Спрощення та стандартизація PodSecurityPolicies](#simplify-psps) нижче для детальнішої інформації.
- **Докладний контроль над визначенням політики** — Pod Security Admission підтримує тільки [3 стандартні рівні](/docs/concepts/security/pod-security-standards/). Якщо вам потрібно більше контролю над конкретними обмеженнями, вам доведеться використовувати [Вебхук допуску з перевіркою](/docs/reference/access-authn-authz/extensible-admission-controllers/) для виконання цих політик.
- **Деталізація політики на рівні підпросторів імен** — PodSecurityPolicy дозволяє вам призначати різні політики різним службовим обліковим записам або користувачам, навіть в межах одного простору імен. Цей підхід має багато підводних каменів і не рекомендується, але якщо вам все одно потрібна ця функція, вам потрібно буде використовувати сторонній вебхук. Виняток становить випадок, коли вам потрібно повністю виключити певних користувачів або [RuntimeClasses](/docs/concepts/containers/runtime-class/), у цьому випадку Pod Security Admission все ж надає деякі [статичні конфігурації для виключень](/docs/concepts/security/pod-security-admission/#exemptions).

Навіть якщо Pod Security Admission не відповідає всім вашим потребам, він був розроблений для _доповнення_ інших механізмів контролю політики, і може бути корисним допоміжним засобом, який працює нарівно з іншими вебхуками допуску.

## 1. Перегляньте дозволи простору імен {#review-namespace-permissions}

Pod Security Admission керується [мітками в просторах імен](/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces). Це означає, що будь-хто, хто може оновлювати (або накладати патчі, або створювати) простір імен, також може змінювати рівень безпеки Podʼів для цього простору імен, що може бути використано для обходу більш обмеженої політики. Перш ніж продовжувати, переконайтеся, що ці дозволи на простір імен мають лише довірені, привілейовані користувачі. Не рекомендується надавати ці могутні дозволи користувачам, які не повинні мати підвищені привілеї, але якщо вам доведеться це зробити, вам потрібно буде використовувати [вебхук допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/), щоб накласти додаткові обмеження на встановлення міток безпеки Podʼів на обʼєкти Namespace.

## 2. Спрощення та стандартизація PodSecurityPolicies {#simplify-psps}

На цьому етапі зменште кількість мутуючих PodSecurityPolicies і видаліть параметри, що виходять за межі Pod Security Standards. Зміни, рекомендовані тут, слід внести в офлайн-копію оригіналу PodSecurityPolicy, який ви змінюєте. Клонована PSP повинна мати іншу назву, яка в алфавітному порядку стоїть перед оригінальною (наприклад, додайте `0` до її назви). Не створюйте нові політики в Kubernetes зараз — це буде розглянуто в розділі [Впровадження оновлених політик](#psp-update-rollout) нижче.

### 2.а. Видалення явно мутуючих полів {#eliminate-mutating-fields}

Якщо PodSecurityPolicy змінює Podʼи, то ви можете опинитись з Podʼами, які не відповідають вимогам рівня безпеки Podʼів, коли ви нарешті вимкнете PodSecurityPolicy. Щоб уникнути цього, вам слід усунути всі мутації PSP перед переходом. На жаль, PSP чітко не розділяє мутуючі та валідуючі поля, тому цей перехід не є простим.

Ви можете почати з видалення полів, які є явно мутуючими та не мають жодного впливу на політику валлідації. Ці поля (також перераховані в довіднику [Перенесення PodSecurityPolicies у Pod Security Standards](/docs/reference/access-authn-authz/psp-to-pod-security-standards/)) включають:

- `.spec.defaultAllowPrivilegeEscalation`
- `.spec.runtimeClass.defaultRuntimeClassName`
- `.metadata.annotations['seccomp.security.alpha.kubernetes.io/defaultProfileName']`
- `.metadata.annotations['apparmor.security.beta.kubernetes.io/defaultProfileName']`
- `.spec.defaultAddCapabilities` — хоча це технічно мутуюче і валідуюче поле, його слід обʼєднати з `.spec.allowedCapabilities`, яке виконує ту саму валідацію без мутації.

{{< caution >}}
Видалення цих полів може призвести до відсутності необхідних конфігурацій у робочих навантаженнях і спричинити проблеми. Дивіться [Впровадження оновлених політик](#psp-update-rollout) нижче, щоб отримати поради про те, як безпечно впроваджувати ці зміни.
{{< /caution >}}

### 2.б. Вилучення параметрів, що не підпадають під Pod Security Standards  {#eliminate-non-standard-options}

Існують кілька полів в PodSecurityPolicy, які не входять до складу Pod Security Standards. Якщо вам потрібно забезпечити ці опції, вам доведеться доповнити Pod Security Admission за допомогою [вебхуків допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/), що не входить в рамки цього посібника.

Спочатку ви можете видалити явно валідуючі поля, які не охоплюються Pod Security Standards. Ці поля (також перераховані в довіднику [Перенесення PodSecurityPolicies у Pod Security Standards](/docs/reference/access-authn-authz/psp-to-pod-security-standards/) з поміткою "no opinion") включають:

- `.spec.allowedHostPaths`
- `.spec.allowedFlexVolumes`
- `.spec.allowedCSIDrivers`
- `.spec.forbiddenSysctls`
- `.spec.runtimeClass`

Ви також можете видалити наступні поля, які стосуються управління групами POSIX / UNIX.

{{< caution >}}
Якщо хоча б одне з них використовує стратегію `MustRunAs`, вони можуть бути мутуючими! Вилучення цих полів може призвести до того, що робочі навантаження не встановлюватимуть необхідні групи та спричинити проблеми. Дивіться [Впровадження оновлених політик](#psp-update-rollout) нижче, щоб отримати поради щодо безпечного впровадження цих змін.
{{< /caution >}}

- `.spec.runAsGroup`
- `.spec.supplementalGroups`
- `.spec.fsGroup`

Залишені мутуючі поля потрібні для належної підтримки Pod Security Standards і будуть оброблені в окремому порядку:

- `.spec.requiredDropCapabilities` — Потрібно видалити `ALL` щоб зробити профіль Restricted.
- `.spec.seLinux` — (Тільки мутуюче з правилом `MustRunAs`) потрібно для забезпечення вимог SELinux для профілів Baseline & Restricted.
- `.spec.runAsUser` — (Не мутує з правилом `RunAsAny`) потрібно для забезпечення `RunAsNonRoot` для профілю Restricted.
- `.spec.allowPrivilegeEscalation` — (Тільки мутується, якщо встановлено `false`) потрібно для профілю Restricted.

### 2.в. Впровадження оновлених PSP {#psp-update-rollout}

Далі ви можете впровадити оновлені політики у ваш кластер. Вам слід діяти обережно, оскільки видалення мутуючих опцій може призвести до того, що робочі навантаження пропустять необхідну конфігурацію.

Для кожної оновленої PodSecurityPolicy:

1. Визначте, які Podʼи працюють під оригінальною PSP. Це можна зробити за допомогою анотації `kubernetes.io/psp`. Наприклад, використовуючи kubectl:

   ```sh
   PSP_NAME="original" # Встановіть назву PSP, яку ви перевіряєте
   kubectl get pods --all-namespaces -o jsonpath="{range .items[?(@.metadata.annotations.kubernetes\.io\/psp=='$PSP_NAME')]}{.metadata.namespace} {.metadata.name}{'\n'}{end}"
   ```

2. Порівняйте ці робочі навантаження з оригінальною специфікацією Podаʼа, щоб визначити, чи змінила PodSecurityPolicy Pod. Для Podʼів, створених за ресурсами робочого навантаження, ви можете порівняти Pod з PodTemplate в ресурсі контролера. Якщо будь-які зміни виявлені, оригінальний Pod або PodTemplate слід оновити з необхідною конфігурацією. Поля для перегляду:
   - `.metadata.annotations['container.apparmor.security.beta.kubernetes.io/*']` (замініть * на назву кожного контейнера)
   - `.spec.runtimeClassName`
   - `.spec.securityContext.fsGroup`
   - `.spec.securityContext.seccompProfile`
   - `.spec.securityContext.seLinuxOptions`
   - `.spec.securityContext.supplementalGroups`
   - У контейнерів, під `.spec.containers[*]` та `.spec.initContainers[*]`:
       - `.securityContext.allowPrivilegeEscalation`
       - `.securityContext.capabilities.add`
       - `.securityContext.capabilities.drop`
       - `.securityContext.readOnlyRootFilesystem`
       - `.securityContext.runAsGroup`
       - `.securityContext.runAsNonRoot`
       - `.securityContext.runAsUser`
       - `.securityContext.seccompProfile`
       - `.securityContext.seLinuxOptions`
3. Створіть нові PodSecurityPolicies. Якщо будь-які Roles або ClusterRoles надають `use` на всі PSP, це може призвести до використання нових PSP замість їх мутуючих аналогів.
4. Оновіть вашу авторизацію, щоб дозволити доступ до нових PSP. У RBAC це означає оновлення будь-яких Roles або ClusterRoles, які надають дозвіл `use` на оригінальну PSP, щоб також надати його оновленому PSP.
5. Перевірте: після деякого часу повторно виконайте команду з кроку 1, щоб переглянути, чи використовуються будь-які Podʼи за оригінальними PSP. Зверніть увагу, що Podʼи повинні бути перестворені після того, як нові політики будуть впроваджені, перш ніж їх можна буде повністю перевірити.
6. (опціонально) Після того, як ви перевірили, що оригінальні PSP більше не використовуються, ви можете їх видалити.

## 3. Оновлення просторів імен {#update-namespaces}

Наступні кроки потрібно виконати для кожного простору імен у кластері. Команди, на які посилаються в цих кроках, використовують змінну `$NAMESPACE` для посилання на простір імен, який оновлюється.

### 3.а. Визначення відповідного рівня безпеки Podʼа {#identify-appropriate-level}

Почніть з ознайомлення зі [Стандартами безпеки Podʼа](/docs/concepts/security/pod-security-standards/) та з трьома різними рівнями цих стандартів.

Існує кілька способів вибору рівня безпеки Podʼа для вашого простору імен:

1. **За вимогами безпеки для простору імен** — Якщо ви знайомі з очікуваним рівнем доступу для простору імен, ви можете вибрати відповідний рівень, базуючись на цих вимогах, подібно до підходу, який можна застосувати в новому кластері.
2. **За поточними PodSecurityPolicies** — Використовуючи довідник [Перенесення PodSecurityPolicies у Pod Security Standards](/docs/reference/access-authn-authz/psp-to-pod-security-standards/), ви можете віднести кожен PSP до рівня стандарту безпеки Podʼа. Якщо ваші PSP не базуються на Pod Security Standards, вам може знадобитися вирішити, обирати рівень, який є принаймні таким же дозвільним, як PSP, або рівень, який є принаймні таким же обмежувальним. Які PSP використовуються для Podʼів у даному просторі імен, ви можете побачити за допомогою цієї команди:

   ```sh
   kubectl get pods -n $NAMESPACE -o jsonpath="{.items[*].metadata.annotations.kubernetes\.io\/psp}" | tr " " "\n" | sort -u
   ```

3. **За поточними Podʼами** — Використовуючи стратегії з розділу [Перевірка рівня безпеки Podʼа](#verify-pss-level), ви можете перевірити рівні Baseline і Restricted, щоб побачити, чи є вони достатньо дозвільними для наявних робочих навантажень, і вибрати найменш привілейований валідний рівень.

{{< caution >}}
Опції 2 і 3 вище базуються на _поточних_ Podʼах і можуть не враховувати робочі навантаження, які в цей момент не запущені, такі як CronJobs, робочі навантаження з масштабуванням до нуля або інші робочі навантаження, які ще не були розгорнуті.
{{< /caution >}}

### 3.б. Перевірка рівня безпеки Podʼа {#verify-pss-level}

Після того як ви обрали рівень безпеки Podʼа для простору імен (або якщо ви пробуєте кілька), добре було б спершу його протестувати (цей крок можна пропустити, якщо використовується рівень Privileged). Безпека Podʼа включає кілька інструментів для тестування та безпечного впровадження профілів.

Спочатку ви можете виконати пробний запуск політики, який оцінить Podʼи, що вже працюють у просторі імен, відносно застосованої політики, не впроваджуючи нову політику в дію:

```sh
# $LEVEL - рівень для пробного запуску, або "baseline", або "restricted".
kubectl label --dry-run=server --overwrite ns $NAMESPACE pod-security.kubernetes.io/enforce=$LEVEL
```

Ця команда поверне попередження для будь-яких _наявних_ Podʼів, які не відповідають запропонованому рівню.

Другий варіант краще підходить для виявлення робочих навантажень, які в цей момент не запущені: режим аудиту. Коли запущено в режимі аудиту (на відміну від примусового впровадження), Podʼи, які порушують рівень політики, реєструються у логах аудиту, які можна переглянути пізніше після деякого часу, але вони не заборонені. Режим попередження працює подібно, але надсилає попередження користувачу негайно. Ви можете встановити рівень аудиту для простору імен за допомогою цієї команди:

```sh
kubectl label --overwrite ns $NAMESPACE pod-security.kubernetes.io/audit=$LEVEL
```

Якщо будь-який з цих підходів призведе до несподіваних порушень, вам потрібно буде або оновити робочі навантаження, що їх спричиняють, щоб відповідати вимогам політики, або послабити рівень безпеки простору імен Pod.

### 3.в. Впровадження рівня безпеки Podʼа {#enforce-pod-security-level}

Коли ви переконаєтеся, що обраний рівень може бути безпечно впроваджений для простору імен, ви можете оновити простір імен, щоб впровадити бажаний рівень:

```sh
kubectl label --overwrite ns $NAMESPACE pod-security.kubernetes.io/enforce=$LEVEL
```

### 3.г. Оминання політики безпеки Pod {#bypass-psp}

Наостанок, ви можете ефективно оминути PodSecurityPolicy на рівні простору імен, привʼязавши повністю {{< example file="policy/privileged-psp.yaml" >}}привілейовану PSP{{< /example >}} до всіх службових облікових записів у просторі імен.

```sh
# Наступні команди, які виконуються на рівні кластера, потрібні лише один раз.
kubectl apply -f privileged-psp.yaml
kubectl create clusterrole privileged-psp --verb use --resource podsecuritypolicies.policy --resource-name privileged

# Вимкнення на рівні простору імен
kubectl create -n $NAMESPACE rolebinding disable-psp --clusterrole privileged-psp --group system:serviceaccounts:$NAMESPACE
```

Оскільки привілейована PSP не є мутуючою, а контролер прийняття рішення PSP завжди віддає перевагу немутуючим PSP, це гарантує, що Podʼи в цьому просторі імен більше не змінюються або не обмежуються PodSecurityPolicy.

Перевага вимкнення PodSecurityPolicy на рівні простору імен полягає в тому, що у разі виникнення проблеми ви можете легко скасувати зміну, видаливши RoleBinding. Просто переконайтеся, що попередньо наявні PodSecurityPolicy все ще застосовуються!

```sh
# Скасування вимкнення PodSecurityPolicy.
kubectl delete -n $NAMESPACE rolebinding disable-psp
```

## 4. Перегляд процесів створення просторів імен {#review-namespace-creation-process}

Тепер, коли поточні простори імен оновлено для забезпечення прийняття рішень щодо Pod Security Admission, вам слід переконатися, що ваші процеси та/або політики для створення нових просторів імен оновлено, щоб гарантувати застосування відповідного профілю безпеки Pod для нових просторів імен.

Ви також можете статично налаштувати контролер Pod Security Admission для встановлення типового рівня впровадження, аудиту та/або попередження для просторів імен без міток. Див. [Налаштування контролера допуску](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller) для отримання додаткової інформації.

## 5. Вимкнення PodSecurityPolicy {#disable-psp}

Нарешті, ви готові вимкнути PodSecurityPolicy. Для цього вам потрібно змінити конфігурацію допуску сервера API: [Як я можу вимкнути контролер допуску?](/docs/reference/access-authn-authz/admission-controllers/#how-do-i-turn-off-an-admission-controller).

Щоб перевірити, що контролер допуску PodSecurityPolicy більше не активний, ви можете вручну запустити тест, видаючи себе за користувача без доступу до будь-яких PodSecurityPolicies (див. [приклад PodSecurityPolicy](/docs/concepts/security/pod-security-policy/#example)), або перевірити логи сервера API. При запуску сервер API виводить рядки логу, що перераховують завантажені втулки контролера допуску:

```log
I0218 00:59:44.903329      13 plugins.go:158] Loaded 16 mutating admission controller(s) successfully in the following order: NamespaceLifecycle,LimitRanger,ServiceAccount,NodeRestriction,TaintNodesByCondition,Priority,DefaultTolerationSeconds,ExtendedResourceToleration,PersistentVolumeLabel,DefaultStorageClass,StorageObjectInUseProtection,RuntimeClass,DefaultIngressClass,MutatingAdmissionWebhook.
I0218 00:59:44.903350      13 plugins.go:161] Loaded 14 validating admission controller(s) successfully in the following order: LimitRanger,ServiceAccount,PodSecurity,Priority,PersistentVolumeClaimResize,RuntimeClass,CertificateApproval,CertificateSigning,CertificateSubjectRestriction,DenyServiceExternalIPs,ValidatingAdmissionWebhook,ResourceQuota.
```

Ви маєте побачити `PodSecurity` (у списку контролерів допуску для перевірки валідності), і жоден зі списків не повинен містити `PodSecurityPolicy`.

Після того, як ви впевнені, що контролер допуску PSP вимкнуто (і після достатнього часу, щоб бути впевненим, що вам не потрібно буде відкочувати зміни), ви вільні видалити ваші PodSecurityPolicies та будь-які повʼязані Roles, ClusterRoles, RoleBindings та ClusterRoleBindings (просто переконайтеся, що вони не надають будь-яких інших неповʼязаних дозволів).
