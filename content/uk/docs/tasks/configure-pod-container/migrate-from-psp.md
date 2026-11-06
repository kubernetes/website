---
title: Міграція з PodSecurityPolicy до вбудованого контролера допуску PodSecurity
content_type: task
min-kubernetes-server-version: v1.22
weight: 260
---

<!-- overview -->

Ця сторінка описує процес міграції з PodSecurityPolicy на вбудований контролер допуску PodSecurity. Це можна ефективно зробити, поєднуючи пробний запуск (dry-run) і режими `audit` та `warn`, хоча це складніше, якщо використовуються змінювальні PSP.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{% version-check %}}

Якщо ви використовуєте версію Kubernetes, відмінну від {{< skew currentVersion >}}, можливо, варто перейти до перегляду цієї сторінки в документації для версії Kubernetes, яку ви фактично використовуєте.

Ця сторінка передбачає, що ви вже знайомі з основними концепціями [Pod Security Admission](/docs/concepts/security/pod-security-admission/).

<!-- body -->

## Загальний підхід {#overall-approach}

Є кілька стратегій міграції з PodSecurityPolicy на Pod Security Admission. Наведені нижче кроки — один з можливих шляхів міграції, мета якого — мінімізувати і ризик простою в продакшн-середовищі, і ризик прогалин у безпеці.

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

Pod Security Admission розроблено так, щоб одразу задовольняти найпоширеніші потреби безпеки й забезпечувати стандартний набір рівнів безпеки в усіх кластерах. Однак він менш гнучкий, ніж PodSecurityPolicy. Зокрема, такі можливості підтримує PodSecurityPolicy, але не Pod Security Admission:

- **Встановлення стандартних обмежень безпеки** — Pod Security Admission є незмінювальним контролером допуску, тобто він не змінює Podʼи перед їх перевіркою. Якщо ви покладалися на цю особливість PSP, вам доведеться або змінити свої робочі навантаження відповідно до обмежень Pod Security, або використати [змінювальний вебхук допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/) для внесення цих змін. Докладніше дивіться [Спрощення та стандартизація PodSecurityPolicies](#simplify-psps) нижче.
- **Детальне керування визначенням політик** — Pod Security Admission підтримує лише [3 стандартні рівні](/docs/concepts/security/pod-security-standards/). Якщо вам потрібно більше контролю над окремими обмеженнями, доведеться використати [валідаційний вебхук допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/) для забезпечення цих політик.
- **Деталізація політик у межах простору імен** — PodSecurityPolicy дає змогу привʼязувати різні політики до різних службових облікових записів або користувачів навіть у межах одного простору імен. Цей підхід має багато підводних каменів і не рекомендується, але якщо ця можливість вам усе ж потрібна, доведеться використати сторонній вебхук. Виняток — випадок, коли потрібно лише повністю звільнити певних користувачів або [RuntimeClasses](/docs/concepts/containers/runtime-class/); тоді Pod Security Admission надає певну [статичну конфігурацію для винятків](/docs/concepts/security/pod-security-admission/#exemptions).

Навіть якщо Pod Security Admission не задовольняє всіх ваших потреб, його розроблено як _доповнення_ до інших механізмів забезпечення політик, і він може слугувати корисним запасним механізмом поряд з іншими вебхуками допуску.

## 1. Перегляньте дозволи простору імен {#review-namespace-permissions}

Pod Security Admission керується [мітками на просторах імен](/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces). Це означає, що будь-хто, хто може оновлювати (або змінювати патчем чи створювати) простір імен, також може змінювати рівень Pod Security для цього простору імен, і це можна використати для обходу суворішої політики. Перш ніж продовжити, переконайтеся, що ці дозволи на простори імен мають лише довірені привілейовані користувачі. Не рекомендується надавати ці потужні дозволи користувачам, які не повинні мати підвищених привілеїв, але якщо доведеться, вам знадобиться [вебхук допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/), щоб накласти додаткові обмеження на встановлення міток Pod Security на обʼєктах Namespace.

## 2. Спрощення та стандартизація PodSecurityPolicies {#simplify-psps}

У цьому розділі ви зменшите кількість змінювальних PodSecurityPolicies і вилучите параметри, що виходять за межі Pod Security Standards. Рекомендовані тут зміни слід вносити в офлайн-копію початкової PodSecurityPolicy, яку ви змінюєте. Клонована PSP повинна мати іншу назву, яка за абеткою стоїть перед початковою (наприклад, додайте на початок `0`). Поки що не створюйте нові політики в Kubernetes — про це йдеться в розділі [Впровадження оновлених політик](#psp-update-rollout) нижче.

### 2.а. Вилучення суто змінювальних полів {#eliminate-mutating-fields}

Якщо PodSecurityPolicy змінює Podʼи, то, коли ви нарешті вимкнете PodSecurityPolicy, у вас можуть залишитися Podʼи, що не відповідають вимогам рівня Pod Security. Щоб уникнути цього, перед переходом слід усунути всі зміни, які вносять PSP. На жаль, PSP не розділяє чітко змінювальні та валідаційні поля, тож ця міграція не є простою.

Почати можна з вилучення полів, які є суто змінювальними й не впливають на валідаційну політику. Ці поля (також перелічені в довіднику [Зіставлення PodSecurityPolicies зі стандартами безпеки Podʼів](/docs/reference/access-authn-authz/psp-to-pod-security-standards/)):

- `.spec.defaultAllowPrivilegeEscalation`
- `.spec.runtimeClass.defaultRuntimeClassName`
- `.metadata.annotations['seccomp.security.alpha.kubernetes.io/defaultProfileName']`
- `.metadata.annotations['apparmor.security.beta.kubernetes.io/defaultProfileName']`
- `.spec.defaultAddCapabilities` — хоча технічно це змінювальне й валідаційне поле, його слід обʼєднати з `.spec.allowedCapabilities`, яке виконує ту саму перевірку без змін.

{{< caution >}}
Видалення цих полів може призвести до відсутності необхідних конфігурацій у робочих навантаженнях і спричинити проблеми. Дивіться [Впровадження оновлених політик](#psp-update-rollout) нижче, щоб отримати поради про те, як безпечно впроваджувати ці зміни.
{{< /caution >}}

### 2.б. Вилучення параметрів, які не охоплюють Pod Security Standards {#eliminate-non-standard-options}

У PodSecurityPolicy є кілька полів, які не охоплюють Pod Security Standards. Якщо вам потрібно забезпечувати ці параметри, доведеться доповнити Pod Security Admission [вебхуком допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/), що виходить за межі цього посібника.

Спершу можна вилучити суто валідаційні поля, які не охоплюють Pod Security Standards. Ці поля (також перелічені в довіднику [Зіставлення PodSecurityPolicies зі стандартами безпеки Podʼів](/docs/reference/access-authn-authz/psp-to-pod-security-standards/) з позначкою "no opinion"):

- `.spec.allowedHostPaths`
- `.spec.allowedFlexVolumes`
- `.spec.allowedCSIDrivers`
- `.spec.forbiddenSysctls`
- `.spec.runtimeClass`

Також можна вилучити такі поля, повʼязані з керуванням групами POSIX / UNIX.

{{< caution >}}
Якщо будь-яке з них використовує стратегію `MustRunAs`, воно може бути змінювальним! Вилучення цих полів може призвести до того, що робочі навантаження не встановлюватимуть потрібних груп, і спричинити проблеми. Поради щодо безпечного впровадження цих змін дивіться в розділі [Впровадження оновлених політик](#psp-update-rollout) нижче.
{{< /caution >}}

- `.spec.runAsGroup`
- `.spec.supplementalGroups`
- `.spec.fsGroup`

Решта змінювальних полів потрібні для належної підтримки Pod Security Standards, і їх доведеться пізніше обробляти в кожному випадку окремо:

- `.spec.requiredDropCapabilities` — потрібне, щоб вилучати `ALL` для профілю Restricted.
- `.spec.seLinux` — (змінювальне лише з правилом `MustRunAs`) потрібне для забезпечення вимог SELinux профілів Baseline і Restricted.
- `.spec.runAsUser` — (незмінювальне з правилом `RunAsAny`) потрібне для забезпечення `RunAsNonRoot` у профілі Restricted.
- `.spec.allowPrivilegeEscalation` — (змінювальне, лише якщо встановлено `false`) потрібне для профілю Restricted.

### 2.в. Впровадження оновлених PSP {#psp-update-rollout}

Далі можна впровадити оновлені політики у ваш кластер. Дійте обережно, оскільки вилучення змінювальних параметрів може призвести до того, що робочим навантаженням бракуватиме потрібної конфігурації.

Для кожної оновленої PodSecurityPolicy:

1. Визначте Podʼи, що працюють під початковою PSP. Це можна зробити за допомогою анотації `kubernetes.io/psp`. Наприклад, за допомогою kubectl:

   ```sh
   PSP_NAME="original" # Встановіть назву PSP, яку ви перевіряєте
   kubectl get pods --all-namespaces -o jsonpath="{range .items[?(@.metadata.annotations.kubernetes\.io\/psp=='$PSP_NAME')]}{.metadata.namespace} {.metadata.name}{'\n'}{end}"
   ```

2. Порівняйте ці запущені Podʼи з початковою специфікацією Podʼа, щоб визначити, чи змінила PodSecurityPolicy Pod. Для Podʼів, створених [ресурсом робочого навантаження](/docs/concepts/workloads/controllers/), можна порівняти Pod з PodTemplate у ресурсі контролера. Якщо виявлено будь-які зміни, початковий Pod або PodTemplate слід оновити, задавши потрібну конфігурацію. Поля, які слід перевірити:
   - `.metadata.annotations['container.apparmor.security.beta.kubernetes.io/*']` (замініть * на назву кожного контейнера)
   - `.spec.runtimeClassName`
   - `.spec.securityContext.fsGroup`
   - `.spec.securityContext.seccompProfile`
   - `.spec.securityContext.seLinuxOptions`
   - `.spec.securityContext.supplementalGroups`
   - У контейнерах, у `.spec.containers[*]` і `.spec.initContainers[*]`:
       - `.securityContext.allowPrivilegeEscalation`
       - `.securityContext.capabilities.add`
       - `.securityContext.capabilities.drop`
       - `.securityContext.readOnlyRootFilesystem`
       - `.securityContext.runAsGroup`
       - `.securityContext.runAsNonRoot`
       - `.securityContext.runAsUser`
       - `.securityContext.seccompProfile`
       - `.securityContext.seLinuxOptions`
3. Створіть нові PodSecurityPolicies. Якщо якісь Roles або ClusterRoles надають `use` на всі PSP, це може призвести до використання нових PSP замість їхніх змінювальних відповідників.
4. Оновіть авторизацію, щоб надати доступ до нових PSP. У RBAC це означає оновити всі Roles або ClusterRoles, які надають дозвіл `use` на початкову PSP, щоб вони надавали його й на оновлену PSP.
5. Перевірте: через певний час спостереження знову виконайте команду з кроку 1, щоб побачити, чи якісь Podʼи досі використовують початкові PSP. Зверніть увагу, що Podʼи потрібно перестворити після впровадження нових політик, перш ніж їх можна буде повністю перевірити.
6. (необовʼязково) Переконавшись, що початкові PSP більше не використовуються, їх можна видалити.

## 3. Оновлення просторів імен {#update-namespaces}

Такі кроки потрібно виконати для кожного простору імен у кластері. Команди в цих кроках використовують змінну `$NAMESPACE` для позначення простору імен, який оновлюється.

### 3.а. Визначення відповідного рівня Pod Security {#identify-appropriate-level}

Почніть з ознайомлення зі [стандартами безпеки Podʼів](/docs/concepts/security/pod-security-standards/) і з трьома різними рівнями.

Є кілька способів вибрати рівень Pod Security для вашого простору імен:

1. **За вимогами безпеки для простору імен** — якщо ви знаєте очікуваний рівень доступу для простору імен, можна вибрати відповідний рівень на основі цих вимог, так само як це робили б у новому кластері.
2. **За наявними PodSecurityPolicies** — за допомогою довідника [Зіставлення PodSecurityPolicies зі стандартами безпеки Podʼів](/docs/reference/access-authn-authz/psp-to-pod-security-standards/) можна зіставити кожну PSP з рівнем стандартів безпеки Podʼів. Якщо ваші PSP не ґрунтуються на Pod Security Standards, вам, можливо, доведеться вирішити, вибрати рівень, щонайменше такий самий дозвільний, як PSP, чи рівень, щонайменше такий самий обмежувальний. Які PSP використовуються для Podʼів у певному просторі імен, можна побачити такою командою:

   ```sh
   kubectl get pods -n $NAMESPACE -o jsonpath="{.items[*].metadata.annotations.kubernetes\.io\/psp}" | tr " " "\n" | sort -u
   ```

3. **За наявними Podʼами** — за допомогою стратегій з розділу [Перевірка рівня Pod Security](#verify-pss-level) можна перевірити обидва рівні, Baseline і Restricted, щоб зʼясувати, чи вони достатньо дозвільні для наявних робочих навантажень, і вибрати найменш привілейований придатний рівень.

{{< caution >}}
Варіанти 2 і 3 вище ґрунтуються на _наявних_ Podʼах і можуть пропустити робочі навантаження, які зараз не працюють, такі як CronJob, робочі навантаження з масштабуванням до нуля або інші робочі навантаження, які ще не розгорнуто.
{{< /caution >}}

### 3.б. Перевірка рівня Pod Security {#verify-pss-level}

Після того як ви вибрали рівень Pod Security для простору імен (або якщо пробуєте кілька), варто спершу його протестувати (цей крок можна пропустити, якщо використовується рівень Privileged). Pod Security має кілька інструментів, які допомагають тестувати й безпечно впроваджувати профілі.

Спершу можна виконати пробний запуск політики, який оцінить Podʼи, що вже працюють у просторі імен, на відповідність застосованій політиці, не вводячи нову політику в дію:

```sh
# $LEVEL - рівень для пробного запуску, або "baseline", або "restricted".
kubectl label --dry-run=server --overwrite ns $NAMESPACE pod-security.kubernetes.io/enforce=$LEVEL
```

Ця команда поверне попередження для будь-яких _наявних_ Podʼів, які не відповідають запропонованому рівню.

Другий варіант краще підходить для виявлення робочих навантажень, які зараз не працюють: режим аудиту. У режимі аудиту (на відміну від режиму enforce) Podʼи, що порушують рівень політики, записуються в логи аудиту, які можна переглянути пізніше, після певного часу спостереження, але такі Podʼи не забороняються. Режим попереджень працює схоже, але надсилає попередження користувачу одразу. Рівень аудиту для простору імен можна встановити такою командою:

```sh
kubectl label --overwrite ns $NAMESPACE pod-security.kubernetes.io/audit=$LEVEL
```

Якщо будь-який з цих підходів виявить неочікувані порушення, доведеться або оновити робочі навантаження, що порушують політику, щоб вони відповідали її вимогам, або послабити рівень Pod Security простору імен.

### 3.в. Примусове застосування рівня Pod Security {#enforce-pod-security-level}

Коли ви переконаєтеся, що вибраний рівень можна безпечно примусово застосувати до простору імен, оновіть простір імен, щоб примусово застосовувати потрібний рівень:

```sh
kubectl label --overwrite ns $NAMESPACE pod-security.kubernetes.io/enforce=$LEVEL
```

### 3.г. Обхід PodSecurityPolicy {#bypass-psp}

Нарешті, можна фактично обійти PodSecurityPolicy на рівні простору імен, привʼязавши повністю {{< example file="policy/privileged-psp.yaml" >}}привілейовану PSP{{< /example >}} до всіх службових облікових записів у просторі імен.

```sh
# Такі команди рівня кластера потрібні лише один раз.
kubectl apply -f privileged-psp.yaml
kubectl create clusterrole privileged-psp --verb use --resource podsecuritypolicies.policy --resource-name privileged

# Вимкнення на рівні простору імен
kubectl create -n $NAMESPACE rolebinding disable-psp --clusterrole privileged-psp --group system:serviceaccounts:$NAMESPACE
```

Оскільки привілейована PSP незмінювальна, а контролер допуску PSP завжди віддає перевагу незмінювальним PSP, це гарантує, що Podʼи в цьому просторі імен більше не змінюватимуться й не обмежуватимуться PodSecurityPolicy.

Перевага такого вимкнення PodSecurityPolicy для окремих просторів імен у тому, що в разі проблеми зміну легко скасувати, видаливши RoleBinding. Лише переконайтеся, що наявні раніше PodSecurityPolicies досі на місці!

```sh
# Скасування вимкнення PodSecurityPolicy.
kubectl delete -n $NAMESPACE rolebinding disable-psp
```

## 4. Перегляд процесів створення просторів імен {#review-namespace-creation-process}

Тепер, коли наявні простори імен оновлено для примусового застосування Pod Security Admission, переконайтеся, що ваші процеси та/або політики створення нових просторів імен оновлено так, щоб до нових просторів імен застосовувався відповідний профіль Pod Security.

Також можна статично налаштувати контролер допуску Pod Security, щоб задати стандартний рівень enforce, audit та/або warn для просторів імен без міток. Докладніше дивіться [Налаштування контролера допуску](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller).

## 5. Вимкнення PodSecurityPolicy {#disable-psp}

Нарешті, ви готові вимкнути PodSecurityPolicy. Для цього потрібно змінити конфігурацію допуску API-сервера: [Як вимкнути контролер допуску?](/docs/reference/access-authn-authz/admission-controllers/#how-do-i-turn-off-an-admission-controller).

Щоб перевірити, що контролер допуску PodSecurityPolicy більше не ввімкнено, можна вручну виконати тест, видаючи себе за користувача без доступу до будь-яких PodSecurityPolicies (дивіться [приклад PodSecurityPolicy](/docs/concepts/security/pod-security-policy/#example)), або перевірити логи API-сервера. Під час запуску API-сервер виводить рядки логу з переліком завантажених втулків контролерів допуску:

```
I0218 00:59:44.903329      13 plugins.go:158] Loaded 16 mutating admission controller(s) successfully in the following order: NamespaceLifecycle,LimitRanger,ServiceAccount,NodeRestriction,TaintNodesByCondition,Priority,DefaultTolerationSeconds,ExtendedResourceToleration,PersistentVolumeLabel,DefaultStorageClass,StorageObjectInUseProtection,RuntimeClass,DefaultIngressClass,MutatingAdmissionWebhook.
I0218 00:59:44.903350      13 plugins.go:161] Loaded 14 validating admission controller(s) successfully in the following order: LimitRanger,ServiceAccount,PodSecurity,Priority,PersistentVolumeClaimResize,RuntimeClass,CertificateApproval,CertificateSigning,CertificateSubjectRestriction,DenyServiceExternalIPs,ValidatingAdmissionWebhook,ResourceQuota.
```

Ви маєте побачити `PodSecurity` (серед валідаційних контролерів допуску), і жоден зі списків не має містити `PodSecurityPolicy`.

Коли ви впевнитеся, що контролер допуску PSP вимкнено (і мине достатньо часу, щоб бути певними, що відкочування не знадобиться), можна видалити ваші PodSecurityPolicies і всі повʼязані Roles, ClusterRoles, RoleBindings і ClusterRoleBindings (лише переконайтеся, що вони не надають інших, не повʼязаних дозволів).
