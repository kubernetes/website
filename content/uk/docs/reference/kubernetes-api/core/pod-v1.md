---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Pod"
content_type: "api_reference"
description: "Pod є колекцією контейнерів, які можуть працювати на хості. Цей ресурс створюється клієнтами та планується на хости."
title: "Pod"
weight: 100
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Pod {#Pod}

Pod є колекцією контейнерів, які можуть працювати на хості. Цей ресурс створюється клієнтами та планується на хости.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>Стан стандартних метаданих обʼєкта. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a></td>
    </tr>
    <tr>
      <td><code>spec</code><br/><em><a href="{{< ref "#PodSpec" >}}">PodSpec</a></em></td>
      <td>Специфікація бажаної поведінки пода. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status</a></td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#PodStatus" >}}">PodStatus</a></em></td>
      <td>Найбільш недавно спостережуваний стан пода. Ці дані можуть бути не актуальними. Заповнюється системою. Тільки для читання. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status</a></td>
    </tr>
  </tbody>
</table>

## PodSpec {#PodSpec}

PodSpec є описом пода.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>activeDeadlineSeconds</code><br/><em>integer</em></td>
      <td>Опціональна тривалість у секундах, протягом якої под може бути активним на вузлі відносно StartTime, перш ніж система активно спробує позначити його як невдалий і завершити повʼязані контейнери. Значення повинно бути додатним цілим числом.</td>
    </tr>
    <tr>
      <td><code>affinity</code><br/><em><a href="{{< ref "#Affinity" >}}">Affinity</a></em></td>
      <td>Якщо вказано, обмеження планування пода</td>
    </tr>
    <tr>
      <td><code>automountServiceAccountToken</code><br/><em>boolean</em></td>
      <td>AutomountServiceAccountToken вказує, чи слід автоматично монтувати токен службового облікового запису.</td>
    </tr>
    <tr>
      <td><code>containers</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#Container" >}}">Container array</a></em><br/><em>patch strategy: злиття за ключем <code>name</code></em></td>
      <td>Список контейнерів, що належать поду. Контейнери наразі не можна додавати або видаляти. У поді має бути принаймні один контейнер. Не можна оновлювати.</td>
    </tr>
    <tr>
      <td><code>dnsConfig</code><br/><em><a href="{{< ref "#PodDNSConfig" >}}">PodDNSConfig</a></em></td>
      <td>Вказує параметри DNS для пода. Параметри, вказані тут, будуть обʼєднані зі згенерованою конфігурацією DNS на основі DNSPolicy.</td>
    </tr>
    <tr>
      <td><code>dnsPolicy</code><br/><em>string</em></td>
      <td>Встановлює політику DNS для пода. Зазвичай "ClusterFirst". Дійсні значення: 'ClusterFirstWithHostNet', 'ClusterFirst', 'Default' або 'None'. Параметри DNS, вказані в DNSConfig, будуть обʼєднані з політикою, обраною за допомогою DNSPolicy. Щоб мати можливість встановлювати параметри DNS разом з hostNetwork, потрібно явно вказати політику DNS як 'ClusterFirstWithHostNet'.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"ClusterFirst"</code> вказує, що под повинен використовувати DNS кластера спочатку, якщо hostNetwork не встановлено в true, якщо він доступний, тоді використовується стандартні налаштування DNS (визначені kubelet).</li>
        <li><code>"ClusterFirstWithHostNet"</code> вказує, що под повинен використовувати DNS кластера спочатку, якщо він доступний, тоді використовується стандартні налаштування DNS (визначені kubelet).</li>
        <li><code>"Default"</code> вказує, що под повинен використовувати стандартні налаштування DNS (визначені kubelet).</li>
        <li><code>"None"</code> вказує, що под повинен використовувати порожні налаштування DNS. Параметри DNS, такі як nameservers і search paths, повинні бути визначені через DNSConfig.</li>
      </ul>
    </td>
    </tr>
    <tr>
      <td><code>enableServiceLinks</code><br/><em>boolean</em></td>
      <td>EnableServiceLinks вказує, чи слід робити інʼєкцію інформації про сервіси в змінні середовища пода, відповідно до синтаксису Docker links. Опціонально: зазвичай — true.</td>
    </tr>
    <tr>
      <td><code>ephemeralContainers</code><br/><em><a href="{{< ref "#EphemeralContainer" >}}">EphemeralContainer array</a></em><br/><em>patch strategy: злиття за ключем <code>name</code></em></td>
      <td>Список ефермерних контейнерів, що запускаються в цьому поді. Ефермерні контейнери можуть запускатися в наявному поді для виконання дій, ініційованих користувачем, таких як налагодження. Цей список не можна вказати при створенні пода, і його не можна змінити, оновлюючи специфікацію пода. Щоб додати ефермерний контейнер до наявного пода, використовуйте субресурс ephemeralcontainers пода.</td>
    </tr>
    <tr>
      <td><code>hostAliases</code><br/><em><a href="{{< ref "#HostAlias" >}}">HostAlias array</a></em><br/><em>patch strategy: злиття за ключем <code>ip</code></em></td>
      <td>HostAliases є опціональним списком хостів та IP-адрес, які будуть додані до файлу hosts пода, якщо вони вказані.</td>
    </tr>
    <tr>
      <td><code>hostIPC</code><br/><em>boolean</em></td>
      <td>Використовувати простір імен IPC хоста. Опціонально: зазвичай — false.</td>
    </tr>
    <tr>
      <td><code>hostNetwork</code><br/><em>boolean</em></td>
      <td>Для цього пода запрошено мережу хоста. Використовується простір імен мережі хоста. При використанні HostNetwork слід вказати порти, щоб планувальник мав про це інформацію. Якщо `hostNetwork` має значення true, вказані поля <code>hostPort</code> у визначеннях портів повинні збігатися з <code>containerPort</code>, а для полів <code>hostPort</code>, що не вказані у визначеннях портів, стандартно встановлюється значення, яке збігається з <code>containerPort</code>. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>hostPID</code><br/><em>boolean</em></td>
      <td>Використовувати простір імен PID хоста. Опціонально: зазвичай — false.</td>
    </tr>
    <tr>
      <td><code>hostUsers</code><br/><em>boolean</em></td>
      <td>Використовувати простір імен користувачів хоста. Опціонально: зазвичай — true. Якщо встановлено true або не вказано, под буде запущено в просторі імен користувачів хоста, що корисно, коли под потребує функції, доступної лише в просторі імен користувачів хоста, наприклад, завантаження модуля ядра з CAP_SYS_MODULE. Якщо встановлено false, для пода створюється новий userns. Встановлення false корисне для зменшення ризику виходу з контейнера, навіть дозволяючи користувачам запускати свої контейнери як root без фактичних привілеїв root на хості.</td>
    </tr>
    <tr>
      <td><code>hostname</code><br/><em>string</em></td>
      <td>Вказує імʼя хоста пода. Якщо не вказано, імʼя хоста пода буде встановлено на системно визначене значення.</td>
    </tr>
    <tr>
      <td><code>hostnameOverride</code><br/><em>string</em></td>
      <td>HostnameOverride вказує явне перевизначення імені хоста пода, як його сприймає под. Це поле лише вказує імʼя хоста пода і не впливає на його DNS-записи. Коли це поле встановлено на непорожній рядок:
      <ul>
        <li>Воно має пріоритет над значеннями, встановленими в <code>hostname</code> та <code>subdomain</code>.</li>
        <li>Імʼя хоста пода буде встановлено на це значення.</li>
        <li><code>setHostnameAsFQDN</code> має бути nil або встановлено на false.</li>
        <li><code>hostNetwork</code> має бути встановлено на false. Це поле має бути дійсним субдоменом DNS, як визначено в RFC 1123, і містити не більше 64 символів. Потрібно, щоб функціональний прапорець HostnameOverride був увімкнений.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>imagePullSecrets</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference array</a></em><br/><em>patch strategy: злиття за ключем <code>name</code></em></td>
      <td>ImagePullSecrets є опціональним списком посилань на секрети в тому ж просторі імен, які використовуються для витягування будь-яких образів, що використовуються цим PodSpec. Якщо вказано, ці секрети будуть передані окремим реалізаціям витягування для їх використання. Більше інформації: <a href="/uk/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod">https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod</a></td>
    </tr>
    <tr>
      <td><code>initContainers</code><br/><em><a href="{{< ref "#Container" >}}">Container array</a></em><br/><em>patch strategy: злиття за ключем <code>name</code></em></td>
      <td>Список контейнерів ініціалізації, що належатьт поду. Інітконтейнери виконується послідовно перед запуском основних контейнерів. Якщо будь-який інітконтейнер не вдається, под вважається таким, що зазнав невдачі, і обробляється відповідно до його restartPolicy. Імʼя для інітконтейнера або звичайного контейнера має бути унікальним серед усіх контейнерів. Інітконтейнери не можуть мати дії Lifecycle, проб Readiness, Liveness або Startup. Вимоги до ресурсів інітконтейнера враховуються під час планування шляхом знаходження найвищого запиту/обмеження для кожного типу ресурсу, а потім використання максимуму цього значення або суми звичайних контейнерів. Обмеження застосовуються до інітконтейнерів аналогічним чином. Інітконтейнери наразі не можна додавати або видаляти. Не можна оновлювати. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/init-containers/">https://kubernetes.io/docs/concepts/workloads/pods/init-containers/</a></td>
    </tr>
    <tr>
      <td><code>nodeName</code><br/><em>string</em></td>
      <td>NodeName вказує, на якому вузлі заплановано цей под. Якщо порожньо, цей под є кандидатом для планування за допомогою планувальника, визначеного в schedulerName. Після встановлення цього поля kubelet для цього вузла стає відповідальним за життєвий цикл цього поду. Це поле не слід використовувати для вираження намірів того, щоб под був запланований на конкретному вузлі. <a href="/uk/docs/concepts/scheduling-eviction/assign-pod-node/#nodename">https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodename</a></td>
    </tr>
    <tr>
      <td><code>nodeSelector</code><br/><em>object</em></td>
      <td>NodeSelector є селектором, який повинен бути істинним, щоб под підходив для вузла. Селектор повинен відповідати міткам вузла, щоб под був запланований на цьому вузлі. Більше інформації: <a href="/uk/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a></td>
    </tr>
    <tr>
      <td><code>os</code><br/><em><a href="{{< ref "#PodOS" >}}">PodOS</a></em></td>
      <td><p>Визначає операційну систему контейнерів у поді. Деякі поля поду та контейнера обмежені, якщо це поле встановлено.</p>
      <p>Якщо в поле OS встановлено значення linux, наступні поля не повинні бути встановл:</p>
      <ul><li>securityContext.windowsOptions</li></ul>
      <p>Якщо в поле OS встановлено значення windows, наступні поля не повинні бути встановлені</p>:
      <ul>
        <li>spec.hostPID</li>
        <li>spec.hostIPC</li>
        <li>spec.hostUsers</li>
        <li>spec.resources</li>
        <li>spec.securityContext.appArmorProfile</li>
        <li>spec.securityContext.seLinuxOptions</li>
        <li>spec.securityContext.seccompProfile</li>
        <li>spec.securityContext.fsGroup</li>
        <li>spec.securityContext.fsGroupChangePolicy</li>
        <li>spec.securityContext.sysctls</li>
        <li>spec.shareProcessNamespace</li>
        <li>spec.securityContext.runAsUser</li>
        <li>spec.securityContext.runAsGroup</li>
        <li>spec.securityContext.supplementalGroups</li>
        <li>spec.securityContext.supplementalGroupsPolicy</li>
        <li>spec.containers[*].securityContext.appArmorProfile</li>
        <li>spec.containers[*].securityContext.seLinuxOptions</li>
        <li>spec.containers[*].securityContext.seccompProfile</li>
        <li>spec.containers[*].securityContext.capabilities</li>
        <li>spec.containers[*].securityContext.readOnlyRootFilesystem</li>
        <li>spec.containers[*].securityContext.privileged</li>
        <li>spec.containers[*].securityContext.allowPrivilegeEscalation</li>
        <li>spec.containers[*].securityContext.procMount</li>
        <li>spec.containers[*].securityContext.runAsUser</li>
        <li>spec.containers[*].securityContext.runAsGroup</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>overhead</code><br/><em>object</em></td>
      <td>Overhead представляє ресурси накладних витрат пода для вказаного RuntimeClass. Це поле буде автоматично заповнене під час допуску контролером RuntimeClass. Якщо контролер допуску RuntimeClass увімкнено, overhead не повинен бути встановлений у запитах на створення Podʼа. Контролер допуску RuntimeClass відхилить запити на створення Podʼа, у яких overhead вже встановлено. Якщо RuntimeClass налаштовано та вибрано в PodSpec, Overhead буде встановлено на значення, визначене у відповідному RuntimeClass, інакше воно залишиться невстановленим і буде розглядатися як нуль. Більше інформації: <a href="https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md">https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md</a></td>
    </tr>
    <tr>
      <td><code>preemptionPolicy</code><br/><em>string</em></td>
      <td>PreemptionPolicy є Політикою випередження подів з нижчим пріоритетом. Одне з: Never, PreemptLowerPriority. Стандартно встановлено PreemptLowerPriority, якщо не вказано.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Never"</code> означає, що под ніколи не випереджає інші поди з нижчим пріоритетом.</li>
        <li><code>"PreemptLowerPriority"</code> означає, що под може випереджати інші поди з нижчим пріоритетом.</li>
      </ul>
    </td>
    </tr>
    <tr>
      <td><code>priority</code><br/><em>integer</em></td>
      <td>Значення пріоритету. Різні системні компоненти використовують це поле для визначення пріоритету пода. Коли Priority Admission Controller увімкнено, він запобігає користувачам встановлювати це поле. Контролер допуску заповнює це поле з PriorityClassName. Чим вище значення, тим вищий пріоритет.</td>
    </tr>
    <tr>
      <td><code>priorityClassName</code><br/><em>string</em></td>
      <td>Якщо вказано, визначає пріоритет пода. "system-node-critical" та "system-cluster-critical" є двома спеціальними ключовими словами, які вказують на найвищі пріоритети, при цьому перше є найвищим пріоритетом. Будь-яке інше імʼя повинно бути визначене шляхом створення обʼєкта PriorityClass з цим імʼям. Якщо не вказано, пріоритет пода буде зазвичай або нульовим, якщо немає стандартного значення.</td>
    </tr>
    <tr>
      <td><code>readinessGates</code><br/><em><a href="{{< ref "#PodReadinessGate" >}}">PodReadinessGate array</a></em></td>
      <td>Якщо вказано, всі readiness gates будуть оцінюватися для готовності пода. Под вважається готовим, коли всі його контейнери готові І (AND) всі стани, зазначені в readiness gates, мають статус "True". Більше інформації: <a href="https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates">https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates</a></td>
    </tr>
    <tr>
      <td><code>resourceClaims</code><br/><em><a href="{{< ref "#PodResourceClaim" >}}">PodResourceClaim array</a></em><br/><em>patch strategy: merge,retainKeys за ключем <code>name</code></em></td>
      <td>ResourceClaims визначає, які ResourceClaims повинні бути виділені та зарезервовані перед тим, як поду буде дозволено запуститися. Ресурси будуть доступні тим контейнерам, які їх споживають за іменем. Це стабільне поле, але вимагає, щоб було увімкнено функціональну можливість DynamicResourceAllocation. Це поле є незмінним.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em><a href="{{< ref "#ResourceRequirements" >}}">ResourceRequirements</a></em></td>
      <td>Resources визначає загальну кількість ресурсів CPU та памʼяті, необхідних для всіх контейнерів у поді. Підтримується вказівка запитів (Requests) та обмежень (Limits) лише для ресурсів "cpu", "memory" та "hugepages-". ResourceClaims не підтримуються. Це поле дозволяє тонко керувати розподілом ресурсів для всього пода, дозволяючи спільне використання ресурсів між контейнерами в поді. Це альфа-поле і вимагає увімкнення функціональної можливості PodLevelResources.</td>
    </tr>
    <tr>
      <td><code>restartPolicy</code><br/><em>string</em></td>
      <td>Політика перезапуску для всіх контейнерів у поді. Одне з значень: Always, OnFailure, Never. У деяких контекстах може бути дозволено лише підмножину цих значень. Стандартно — Always. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy</a>
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Always"</code></li>
        <li><code>"Never"</code></li>
        <li><code>"OnFailure"</code></li>
      </ul></td>
    </tr>
    <tr>
      <td><code>runtimeClassName</code><br/><em>string</em></td>
      <td>RuntimeClassName посилається на обʼєкт RuntimeClass у групі node.k8s.io, який повинен бути використаний для запуску цього пода. Якщо жоден ресурс RuntimeClass не відповідає вказаному імені класу, под не буде запущено. Якщо не встановлено або порожньо, буде використано "legacy" RuntimeClass, який є неявним класом з порожнім визначенням, що використовує стандартний обробник. Більше інформації: <a href="https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class">https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class</a></td>
    </tr>
    <tr>
      <td><code>schedulerName</code><br/><em>string</em></td>
      <td>Якщо вказано, под буде оброблено вказаним планувальником. Якщо не вказано, под буде оброблено стандартним планувальником.</td>
    </tr>
    <tr>
      <td><code>schedulingGates</code><br/><em><a href="{{< ref "#PodSchedulingGate" >}}">PodSchedulingGate array</a></em><br/><em>patch strategy: злиття за ключем <code>name</code></em></td>
      <td>SchedulingGates є непрозорим списком значень, які, якщо вказані, блокуватимуть планування пода. Якщо schedulingGates не порожній, под залишатиметься в стані SchedulingGated, і планувальник не намагатиметься його запланувати. SchedulingGates можна встановити лише під час створення пода і видалити лише згодом.</td>
    </tr>
    <tr>
      <td><code>schedulingGroup</code><br/><em><a href="{{< ref "#PodSchedulingGroup" >}}">PodSchedulingGroup</a></em></td>
      <td>SchedulingGroup надає посилання на обʼєкт групування середовища виконання безпосереднього планування, до якого належить цей Pod. Це поле використовується планувальником для ідентифікації групи та застосування правильних політик планування групи. Ассоціація з групою також впливає на інші аспекти життєвого циклу Podʼів, які мають значення в ширшому контексті планування, такі як передача пріоритетів, приєднання ресурсів тощо. Якщо не вказано, Pod розглядається як одиниця у всіх цих аспектах. Обʼєкт групи, на який посилається це поле, може не існувати на момент створення Podʼа. Це поле є незмінним, але обʼєкт групи з тим самим імʼям може бути відтворений з іншими політиками. Роблячи це під час планування Podʼа, розміщення може не відповідати очікуваним політикам.</td>
    </tr>
    <tr>
      <td><code>securityContext</code><br/><em><a href="{{< ref "#PodSecurityContext" >}}">PodSecurityContext</a></em></td>
      <td>SecurityContext містить атрибути безпеки на рівні пода та загальні налаштування контейнера. Опціонально: зазвичай порожньо. Див. опис типу для стандартних значень кожного поля.</td>
    </tr>
    <tr>
      <td><code>serviceAccount</code><br/><em>string</em></td>
      <td>DeprecatedServiceAccount є застарілим псевдонімом для ServiceAccountName. Застаріло: використовуйте serviceAccountName замість цього.</td>
    </tr>
    <tr>
      <td><code>serviceAccountName</code><br/><em>string</em></td>
      <td>ServiceAccountName є імʼям ServiceAccount, який використовується для запуску цього пода. Більше інформації: <a href="/uk/docs/tasks/configure-pod-container/configure-service-account/">https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/</a></td>
    </tr>
    <tr>
      <td><code>setHostnameAsFQDN</code><br/><em>boolean</em></td>
      <td>Якщо true, імʼя хоста пода буде налаштовано як повне доменне імʼя (FQDN) Podʼа, а не просто коротке імʼя (стандартно). У контейнерах Linux це означає встановлення FQDN у полі hostname ядра (поле nodename структури utsname). У контейнерах Windows це означає встановлення значення реєстру hostname для ключа реєстру HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters на FQDN. Якщо под не має FQDN, це не має ефекту. Стандартне значення — false.</td>
    </tr>
    <tr>
      <td><code>shareProcessNamespace</code><br/><em>boolean</em></td>
      <td>Спільний простір імен процесів між усіма контейнерами в поді. Якщо це встановлено, контейнери зможуть бачити та надсилати сигнали процесам з інших контейнерів у тому ж поді, і перший процес у кожному контейнері не буде мати PID 1. HostPID і ShareProcessNamespace не можуть бути встановлені одночасно. Опціонально: стандартне значення — false.</td>
    </tr>
    <tr>
      <td><code>subdomain</code><br/><em>string</em></td>
      <td>Якщо вказано, повне доменне імʼя хоста Podʼа буде "&lt;hostname&gt;.&lt;subdomain&gt;.&lt;pod namespace&gt;.svc.&lt;cluster domain&gt;". Якщо не вказано, под не матиме доменного імені взагалі.</td>
    </tr>
    <tr>
      <td><code>terminationGracePeriodSeconds</code><br/><em>integer</em></td>
      <td>Опціональна тривалість у секундах, необхідна для належного завершення роботи пода. Може бути зменшена в запиті на видалення. Значення повинно бути невідʼємним цілим числом. Значення нуль означає негайну зупинку через сигнал завершення (немає можливості для завершення роботи). Якщо це значення дорівнює nil, буде використано стандартний період очікування. Період очікування — це тривалість у секундах після того, як процеси, що працюють у поді, отримують сигнал завершення, і час, коли процеси примусово зупиняються за допомогою сигналу kill. Встановіть це значення довше, ніж очікуваний час очищення для вашого процесу. Стандартне значення — 30 секунд.</td>
    </tr>
    <tr>
      <td><code>tolerations</code><br/><em><a href="{{< ref "../definitions/toleration-v1#Toleration" >}}">Toleration array</a></em></td>
      <td>Якщо вказано, толерантності пода.</td>
    </tr>
    <tr>
      <td><code>topologySpreadConstraints</code><br/><em><a href="{{< ref "#TopologySpreadConstraint" >}}">TopologySpreadConstraint array</a></em><br/><em>patch strategy: злиття за ключем <code>topologyKey</code></em></td>
      <td>TopologySpreadConstraints описує, як група подів повинна розподілятися по топологічних доменах. Планувальник буде розміщувати поди таким чином, щоб дотримуватися цих обмежень. Всі topologySpreadConstraints обʼєднуються за логікою AND.</td>
    </tr>
    <tr>
      <td><code>volumes</code><br/><em><a href="{{< ref "#Volume" >}}">Volume array</a></em><br/><em>patch strategy: merge,retainKeys on key <code>name</code></em></td>
      <td>Список томів, які можуть бути змонтовані контейнерами, що належать до пода. Більше інформації: <a href="/uk/docs/concepts/storage/volumes">https://kubernetes.io/docs/concepts/storage/volumes</a></td>
    </tr>
  </tbody>
</table>

## PodStatus {#PodStatus}

PodStatus представляє інформацію про стан пода. Стан може відставати від фактичного стану системи, особливо якщо вузол, на якому розміщено под, не може звʼязатися з вузлом панелі управління.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allocatedResources</code><br/><em>object</em></td>
      <td>AllocatedResources є загальною кількістю запитів, виділених для цього пода вузлом. Якщо запити на рівні пода не встановлені, це буде загальна кількість запитів, агрегованих по контейнерах у поді.</td>
    </tr>
    <tr>
      <td><code>conditions</code><br/><em><a href="{{< ref "#PodCondition" >}}">PodCondition array</a></em><br/><em>patch strategy: злиття за ключем <code>type</code></em></td>
      <td>Поточний стан обслуговування пода. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions</a></td>
    </tr>
    <tr>
      <td><code>containerStatuses</code><br/><em>ContainerStatus array</em></td>
      <td>Стани контейнерів у цьому поді. Кожен контейнер у поді повинен мати не більше одного стану в цьому списку, і всі стани повинні належати контейнерам у поді. Однак це не контролюється. Якщо стан для відсутнього контейнера присутній у списку, або список містить дублікати імен, поведінка різних компонентів Kubernetes не визначена, і ці стани можуть бути проігноровані. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status</a></td>
    </tr>
    <tr>
      <td><code>ephemeralContainerStatuses</code><br/><em>ContainerStatus array</em></td>
      <td>Стани будь-яких ефермерних контейнерів, які запускалися в цьому поді. Кожен ефермерний контейнер у поді повинен мати не більше одного стану в цьому списку, і всі стани повинні належати контейнерам у поді. Однак це не контролюється. Якщо стан для відсутнього контейнера присутній у списку, або список містить дублікати імен, поведінка різних компонентів Kubernetes не визначена, і ці стани можуть бути проігноровані. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status</a></td>
    </tr>
    <tr>
      <td><code>extendedResourceClaimStatus</code><br/><em><a href="{{< ref "#PodExtendedResourceClaimStatus" >}}">PodExtendedResourceClaimStatus</a></em></td>
      <td>Стан розширеного запиту ресурсів, підтримуваного DRA.</td>
    </tr>
    <tr>
      <td><code>hostIP</code><br/><em>string</em></td>
      <td>hostIP містить IP-адресу хоста, до якого призначено под. Порожнє, якщо под ще не запущено. Под може бути призначений вузлу, який має проблему в kubelet, що, в свою чергу, означає, що HostIP не буде оновлено, навіть якщо вузол призначено поду.</td>
    </tr>
    <tr>
      <td><code>hostIPs</code><br/><em><a href="{{< ref "#HostIP" >}}">HostIP array</a></em><br/><em>patch strategy: злиття за ключем <code>ip</code></em></td>
      <td>hostIPs містить IP-адреси, виділені хосту. Якщо це поле вказано, перший запис повинен відповідати полю hostIP. Цей список порожній, якщо под ще не запущено. Под може бути призначений вузлу, який має проблему в kubelet, що, в свою чергу, означає, що HostIPs не буде оновлено, навіть якщо вузол призначено цьому поду.</td>
    </tr>
    <tr>
      <td><code>initContainerStatuses</code><br/><em>ContainerStatus array</em></td>
      <td>Стан ініціалізаційних контейнерів у цьому поді. Останній успішно запущений ініціалізаційний контейнер, який не підлягає перезапуску, матиме ready = true, а останній запущений контейнер матиме встановлений startTime. Кожен ініціалізаційний контейнер у поді повинен мати не більше одного стану в цьому списку, і всі стани повинні належати контейнерам у поді. Однак це не контролюється. Якщо стан для відсутнього контейнера присутній у списку, або список містить дублікати імен, поведінка різних компонентів Kubernetes не визначена, і ці стани можуть бути проігноровані. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle/#pod-and-container-status">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-and-container-status</a></td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>Зрозуміле для людини повідомлення, що вказує деталі щодо того, чому под знаходиться в цьому стані.</td>
    </tr>
    <tr>
      <td><code>nodeAllocatableResourceClaimStatuses</code><br/><em><a href="{{< ref "#NodeAllocatableResourceClaimStatus" >}}">NodeAllocatableResourceClaimStatus array</a></em></td>
      <td>NodeAllocatableResourceClaimStatuses містить стан ресурсів, доступних вузлу, які були виділені для цього пода через запити DRA. Це включає ресурси, які наразі повідомляються у v1.Node <code>status.allocatable</code>, але не є розширеними ресурсами (див. <a href="/uk/docs/concepts/configuration/manage-resources-containers/#extended-resources">https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#extended-resources</a>). Приклади включають "cpu", "memory", "ephemeral-storage" та hugepages.</td>
    </tr>
    <tr>
      <td><code>nominatedNodeName</code><br/><em>string</em></td>
      <td>nominatedNodeName встановлюється лише тоді, коли цей под передує іншим подам на вузлі, але його не можна запланувати негайно, оскільки жертви випередження отримують свої періоди належного завершення. Це поле не гарантує, що под буде заплановано на цьому вузлі. Планувальник може вирішити розмістити под в іншому місці, якщо інші вузли стануть доступними раніше. Планувальник також може вирішити надати ресурси на цьому вузлі поду з вищим пріоритетом, який створено після випередження. В результаті це поле може відрізнятися від PodSpec.nodeName, коли под заплановано.</td>
    </tr>
    <tr>
      <td><code>observedGeneration</code><br/><em>integer</em></td>
      <td>Якщо встановлено, це представляє .metadata.generation, на основі якого було встановлено стан пода. Щоб використовувати це поле, потрібно ввімкнути функціональну можливість PodObservedGenerationTracking.</td>
    </tr>
    <tr>
      <td><code>phase</code><br/><em>string</em></td>
      <td>Фаза пода є простим, високорівневим підсумком того, на якому етапі життєвого циклу знаходиться под. Масив conditions, поля reason і message, а також масиви станів окремих контейнерів містять більше деталей про стан пода. Існує пʼять можливих значень фази:
      <dl>
        <dt>Pending</dt>
        <dd>Под був прийнятий системою Kubernetes, але один або кілька контейнерів ще не створені. Це включає час до планування, а також час, витрачений на завантаження образів через мережу, що може зайняти деякий час.</dd>
        <dt>Running</dt>
        <dd>Под був привʼязаний до вузла, і всі контейнери були створені. Принаймні один контейнер все ще працює або знаходиться в процесі запуску чи перезапуску.</dd>
        <dt>Succeeded</dt>
        <dd>Всі контейнери в поді завершилися успішно і не будуть перезапущені.</dd>
        <dt>Failed</dt>
        <dd>Всі контейнери в поді завершилися, і принаймні один контейнер завершився з помилкою. Контейнер або вийшов з ненульовим кодом завершення, або був зупинений системою.</dd>
        <dt>Unknown</dt>
        <dd>З якоїсь причини стан пода не вдалося отримати, зазвичай через помилку в комунікації з хостом пода.</dd>
      </dl>
      Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle#pod-phase">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-phase</a>
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Failed"</code> означає, що всі контейнери в поді завершилися, і принаймні один контейнер завершився з помилкою (вийшов з ненульовим кодом завершення або був зупинений системою).</li>
        <li><code>"Pending"</code> означає, що под був прийнятий системою, але один або кілька контейнерів ще не запущені. Це включає час до привʼязки до вузла, а також час, витрачений на завантаження образів на хост.</li>
        <li><code>"Running"</code> означає, що под був привʼязаний до вузла і всі контейнери були запущені. Принаймні один контейнер все ще працює або знаходиться в процесі перезапуску.</li>
        <li><code>"Succeeded"</code> означає, що всі контейнери в поді добровільно завершилися з кодом виходу 0, і система не буде перезапускати жоден з цих контейнерів.</li>
        <li><code>"Unknown"</code> означає, що з якоїсь причини стан пода не вдалося отримати, зазвичай через помилку в комунікації з хостом пода. Застаріле: не встановлюється з 2015 року (74da3b14b0c0f658b3bb8d2def5094686d0e9095)</li>
    </tr>
    <tr>
      <td><code>podIP</code><br/><em>string</em></td>
      <td>podIP адреса, виділена поду. Доступна принаймні всередині кластера. Порожньо, якщо ще не виділено.</td>
    </tr>
    <tr>
      <td><code>podIPs</code><br/><em><a href="{{< ref "#PodIP" >}}">PodIP array</a></em><br/><em>patch strategy: злиття за ключем <code>ip</code></em></td>
      <td>podIPs містить IP-адреси, виділені поду. Якщо це поле вказано, 0-й елемент повинен відповідати полю podIP. Подам може бути виділено не більше одного значення для кожного з IPv4 та IPv6. Цей список порожній, якщо IP-адреси ще не були виділені.</td>
    </tr>
    <tr>
      <td><code>qosClass</code><br/><em>string</em></td>
      <td>Класифікація якості обслуговування  (Quality of Service, QOS) призначена поду на основі вимог до ресурсів. Див. тип PodQOSClass для доступних класів QOS. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes">https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes</a>
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"BestEffort"</code> означає клас QOS BestEffort.</li>
        <li><code>"Burstable"</code> означає клас QOS Burstable.</li>
        <li><code>"Guaranteed"</code> означає клас QOS Guaranteed.</li>
      </ul>
    </td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>Коротке повідомлення у форматі CamelCase, що вказує на деталі того, чому под знаходиться в цьому стані. Наприклад, 'Evicted'</td>
    </tr>
    <tr>
      <td><code>resize</code><br/><em>string</em></td>
      <td>Статус зміни ресурсів, бажаних для контейнерів поду. Порожньо, якщо зміна ресурсів не очікується. Будь-які зміни ресурсів контейнера автоматично встановлять це значення на "Proposed". Застаріло: Статус зміни ресурсів переміщено до двох станів поду PodResizePending та PodResizeInProgress. PodResizePending відстежує стани, коли специфікація була змінена, але Kubelet ще не виділив ресурси. PodResizeInProgress відстежує зміни в процесі виконання і має бути присутнім, коли виділені ресурси != підтверджені ресурси.</td>
    </tr>
    <tr>
      <td><code>resourceClaimStatuses</code><br/><em>PodResourceClaimStatus array</em><br/><em>patch strategy: merge,retainKeys за ключем <code>name</code></em></td>
      <td>Статус заявок на ресурси.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em><a href="{{< ref "#ResourceRequirements" >}}">ResourceRequirements</a></em></td>
      <td>Resources представляє запити та обмеження обчислювальних ресурсів, які були застосовані на рівні поду, якщо запити або обмеження на рівні поду встановлені в PodSpec.Resources</td>
    </tr>
    <tr>
      <td><code>startTime</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Дата та час у форматі RFC 3339, коли обʼєкт був підтверджений Kubelet. Це відбувається до того, як Kubelet завантажив образ(и) контейнера для поду.</td>
    </tr>
  </tbody>
</table>

## PodList {#PodList}

PodList is a list of Pods.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>items</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "pod-v1#Pod" >}}">Pod array</a></em></td>
      <td>Список подів. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md</a></td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/list-meta-v1-meta#ListMeta" >}}">ListMeta</a></em></td>
      <td>Стандартні метадані списку. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
  </tbody>
</table>

## Affinity {#Affinity}

Affinity є групою правил планування за спорідненістю.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>nodeAffinity</code><br/><em><a href="{{< ref "#NodeAffinity" >}}">NodeAffinity</a></em></td>
      <td>Описує правила планування за спорідненістю вузлів для пода.</td>
    </tr>
    <tr>
      <td><code>podAffinity</code><br/><em><a href="{{< ref "#PodAffinity" >}}">PodAffinity</a></em></td>
      <td>Описує правила планування за спорідненістю подів (наприклад, розміщення цього пода на тому ж вузлі, у тій же зоні тощо, що й інші поди).</td>
    </tr>
    <tr>
      <td><code>podAntiAffinity</code><br/><em><a href="{{< ref "#PodAntiAffinity" >}}">PodAntiAffinity</a></em></td>
      <td>Описує правила планування за антиспорідненістю подів (наприклад, уникати розміщення цього пода на тому ж вузлі, у тій же зоні тощо, що й інші поди).</td>
    </tr>
  </tbody>
</table>

## AppArmorProfile {#AppArmorProfile}

AppArmorProfile визначає налаштування AppArmor для пода або контейнера.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>localhostProfile</code><br/><em>string</em></td>
      <td>localhostProfile вказує на профіль, завантажений на вузлі, який слід використовувати. Профіль повинен бути попередньо налаштований на вузлі для роботи. Повинен відповідати завантаженій назві профілю. Повинен бути встановлений лише тоді, коли type дорівнює "Localhost".</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>type вказує, який тип профілю AppArmor буде застосовано. Дійсні варіанти:
      <ul>
        <li>Localhost — профіль, попередньо завантажений на вузлі.</li>
        <li>RuntimeDefault — стандартний профіль середовища виконання контейнера.</li>
        <li>Unconfined — без застосування AppArmor.</li>
      </ul>
      <br/>Можливі значення enum:
      <ul>
        <li><code>Localhost</code> вказує, що слід використовувати профіль, попередньо завантажений на вузлі.</li>
        <li><code>RuntimeDefault</code> вказує, що слід використовувати стандартний профіль AppArmor середовища виконання контейнера.</li>
        <li><code>Unconfined</code> вказує, що профіль AppArmor не буде застосовано.</li>
      </ul>
    </td>
    </tr>
  </tbody>
</table>

## AzureFileVolumeSource {#AzureFileVolumeSource}

AzureFile представляє монтування Azure File Service на хості та привʼязку до пода.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly зазвичай дорівнює false (читання/запис). Встановлення ReadOnly тут примусово встановить параметр ReadOnly у VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>secretName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>secretName вказує на назву секрету, який містить імʼя облікового запису Azure Storage та ключ</td>
    </tr>
    <tr>
      <td><code>shareName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>shareName вказує на назву Azure File Share</td>
    </tr>
  </tbody>
</table>

## CSIVolumeSource {#CSIVolumeSource}

Представляє джерело розташування тому для монтування, кероване зовнішнім драйвером CSI.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>driver</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>driver є назвою CSI драйвера, який працює з цим томом. Зверніться до адміністратора для отримання правильної назви, як зареєстровано в кластері.</td>
    </tr>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType вказує файлову систему для монтування. Наприклад: "ext4", "xfs", "ntfs". Якщо не вказано, порожнє значення передається відповідному CSI драйверу, який визначить стандартну файлову систему.</td>
    </tr>
    <tr>
      <td><code>nodePublishSecretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>nodePublishSecretRef є посиланням на обʼєкт секрету, який містить конфіденційну інформацію для передачі CSI драйверу для завершення викликів CSI NodePublishVolume та NodeUnpublishVolume. Це поле є необовʼязковим і може бути порожнім, якщо секрет не потрібен. Якщо обʼєкт секрету містить більше одного секрету, передаються всі посилання на секрети.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly вказує на конфігурацію лише для читання для тому. Стандартне значення — false (читання/запис).</td>
    </tr>
    <tr>
      <td><code>volumeAttributes</code><br/><em>object</em></td>
      <td>volumeAttributes зберігає властивості, специфічні для драйвера, які передаються CSI драйверу. Зверніться до документації вашого драйвера для отримання підтримуваних значень.</td>
    </tr>
  </tbody>
</table>

## Capabilities {#Capabilities}

Додає та видаляє POSIX-можливості з працюючих контейнерів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>add</code><br/><em>string array</em></td>
      <td>Додані можливості</td>
    </tr>
    <tr>
      <td><code>drop</code><br/><em>string array</em></td>
      <td>Видалені можливості</td>
    </tr>
  </tbody>
</table>

## CephFSVolumeSource {#CephFSVolumeSource}

Представляє монтування файлової системи Ceph, яке триває протягом життя пода. Томи Cephfs не підтримують управління власністю або переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>monitors</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>monitors є обовʼязковим: Monitors є колекцією Ceph моніторів. Більше інформації: <a href="https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it">https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>path</code><br/><em>string</em></td>
      <td>path є опціональним: Використовується як змонтований корінь, а не повне дерево Ceph, стандартно — /</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly є опціональним: Стандартне значення — false (читання/запис). ReadOnly тут примусово встановлює налаштування ReadOnly у VolumeMounts. Більше інформації: <a href="https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it">https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>secretFile</code><br/><em>string</em></td>
      <td>secretFile є опціональним: SecretFile є шляхом до вʼязки ключів для користувача, стандартно — /etc/ceph/user.secret. Більше інформації: <a href="https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it">https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef є опціональним: SecretRef є посиланням на секрет для автентифікації користувача, стандартно — порожній. Більше інформації: <a href="https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it">https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>user</code><br/><em>string</em></td>
      <td>user є опціональним: User є імʼям користувача rados, стандартно — admin. Більше інформації: <a href="https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it">https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</a></td>
    </tr>
  </tbody>
</table>

## CinderVolumeSource {#CinderVolumeSource}

Представляє ресурс тома Cinder в Openstack. Том Cinder повинен існувати перед монтуванням до контейнера. Том також повинен знаходитися в тому ж регіоні, що й kubelet. Томи Cinder підтримують управління власністю та переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType є типом файлової системи для монтування. Повинен бути підтримуваним типом файлової системи операційної системи хоста. Приклади: "ext4", "xfs", "ntfs". Якщо не вказано, неявно вважається "ext4". Більше інформації: <a href="https://examples.k8s.io/mysql-cinder-pd/README.md">https://examples.k8s.io/mysql-cinder-pd/README.md</a></td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly є опціональним: Стандартне значення — false (читання/запис). ReadOnly тут примусово встановлює налаштування ReadOnly у VolumeMounts. Більше інформації: <a href="https://examples.k8s.io/mysql-cinder-pd/README.md">https://examples.k8s.io/mysql-cinder-pd/README.md</a></td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef є опціональним: Посилання на обʼєкт секрету, що містить параметри для підключення до OpenStack. Більше інформації: <a href="https://examples.k8s.io/mysql-cinder-pd/README.md">https://examples.k8s.io/mysql-cinder-pd/README.md</a></td>
    </tr>
    <tr>
      <td><code>volumeID</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>volumeID використовується для ідентифікації тому в Cinder. Більше інформації: <a href="https://examples.k8s.io/mysql-cinder-pd/README.md">https://examples.k8s.io/mysql-cinder-pd/README.md</a></td>
    </tr>
  </tbody>
</table>

## ClusterTrustBundleProjection {#ClusterTrustBundleProjection}

ClusterTrustBundleProjection описує, як вибрати набір обʼєктів ClusterTrustBundle і зробити проєкцію їх вмісту у файлову систему пода.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>labelSelector</code><br/><em><a href="{{< ref "../definitions/label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>Вибирає всі ClusterTrustBundles, що відповідають цьому селектору міток. Діє лише якщо встановлено signerName. Взаємовиключно з name. Якщо не встановлено, інтерпретується як "не мати збігу ні з чим". Якщо встановлено, але порожньо, інтерпретується як "мати збіг з усіма".</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Вибирає один ClusterTrustBundle за імʼям обʼєкта. Взаємовиключно з signerName та labelSelector.</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Якщо true, не блокувати запуск пода, якщо посилання на ClusterTrustBundle(s) недоступне. Якщо використовується name, то дозволяється, щоб вказаний ClusterTrustBundle не існував. Якщо використовується signerName, то комбінація signerName та labelSelector може не відповідати жодному ClusterTrustBundle.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Відносний шлях від кореня тому до файлу, куди буде записано пакунок.</td>
    </tr>
    <tr>
      <td><code>signerName</code><br/><em>string</em></td>
      <td>Вибирає всі ClusterTrustBundles, що відповідають цьому імені підписувача. Взаємовиключно з name. Вміст усіх вибраних ClusterTrustBundles буде обʼєднано та видалено дублікати.</td>
    </tr>
  </tbody>
</table>

## ConfigMapEnvSource {#ConfigMapEnvSource}

ConfigMapEnvSource вибирає ConfigMap для заповнення змінних середовища.

Вміст поля Data цільової ConfigMap буде представляти пари ключ-значення як змінні середовища.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Імʼя референта. Це поле фактично обовʼязкове, але через зворотну сумісність дозволяється залишати його порожнім. Екземпляри цього типу з порожнім значенням тут майже напевно неправильні. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a></td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Вказує, чи має бути визначено ConfigMap</td>
    </tr>
  </tbody>
</table>

## ConfigMapKeySelector {#ConfigMapKeySelector}

Вибирає ключ з ConfigMap.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Ключ для вибору.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Імʼя референта. Це поле фактично обовʼязкове, але через зворотну сумісність дозволяється залишати його порожнім. Екземпляри цього типу з порожнім значенням тут майже напевно неправильні. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a></td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Вказує, чи має бути визначено ConfigMap або його ключ</td>
    </tr>
  </tbody>
</table>

## ConfigMapProjection {#ConfigMapProjection}

Перетворює ConfigMap у проєкційний том.

Вміст поля Data цільової ConfigMap буде представлено в проєкційному томі як файли, використовуючи ключі з поля Data як імена файлів, якщо елемент items не заповнений конкретними відображеннями ключів на шляхи. Зверніть увагу, що це ідентично джерелу тома configmap без стандартного режиму.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#KeyToPath" >}}">KeyToPath array</a></em></td>
      <td>Якщо не вказано, кожну пару ключ-значення в полі Data вказаного ConfigMap буде спроєцьовано в том як файл, імʼя якого є ключем, а вміст — значенням. Якщо вказано, перелічені ключі будуть спроєцьовані в зазначені шляхи, а невказані ключі не будуть присутні. Якщо вказано ключ, якого немає в ConfigMap, налаштування тому завершиться помилкою, якщо він не позначений як необовʼязковий. Шляхи повинні бути відносними і не можуть містити '..' або починатися з '..'.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Імʼя референта. Це поле фактично обовʼязкове, але через зворотну сумісність дозволяється залишати його порожнім. Екземпляри цього типу з порожнім значенням тут майже напевно неправильні. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a></td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Вказує, чи має бути визначено ConfigMap або його ключ</td>
    </tr>
  </tbody>
</table>

## ConfigMapVolumeSource {#ConfigMapVolumeSource}

Перетворює ConfigMap у том.

Вміст поля Data цільового ConfigMap буде представлено в томі як файли, використовуючи ключі з поля Data як імена файлів, якщо елемент items не заповнений конкретними зіставленням ключів на шляхи. Томи ConfigMap підтримують управління власністю та переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>defaultMode</code><br/><em>integer</em></td>
      <td>defaultMode є опціональним: біти режиму, які використовуються для встановлення стандартних дозволів на створені файли. Має бути восьмеричне значення від 0000 до 0777 або десяткове значення від 0 до 511. YAML приймає як восьмеричні, так і десяткові значення, JSON вимагає десяткових значень для бітів режиму. Стандартно — 0644. Теки всередині шляху не впливають на це налаштування. Це може конфліктувати з іншими параметрами, які впливають на режим файлу, такими як fsGroup, і результатом можуть бути інші встановлені біти режиму.</td>
    </tr>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#KeyToPath" >}}">KeyToPath array</a></em></td>
      <td>Якщо не вказано, кожну пару ключ-значення в полі Data вказаного ConfigMap буде спроєцьовано в том як файл, імʼя якого є ключем, а вміст — значенням. Якщо вказано, перелічені ключі будуть спроєцьовані в зазначені шляхи, а невказані ключі не будуть присутні. Якщо вказано ключ, якого немає в ConfigMap, налаштування тому завершиться помилкою, якщо він не позначений як необовʼязковий. Шляхи повинні бути відносними і не можуть містити '..' або починатися з '..'.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Імʼя референта. Це поле фактично обовʼязкове, але через зворотну сумісність дозволяється залишати його порожнім. Екземпляри цього типу з порожнім значенням тут майже напевно неправильні. Більше інформації: <a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a></td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>optional вказує, чи повинен бути визначений ConfigMap або його ключі</td>
    </tr>
  </tbody>
</table>

## Container {#Container}

Один контейнер застосунку, який ви хочете запустити всередині пода.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>args</code><br/><em>string array</em></td>
      <td>Аргументи для точки входу. Використовується CMD образу контейнера, якщо це не вказано. Посилання на змінні $(VAR_NAME) розгортаються за допомогою середовища контейнера. Якщо змінну не вдається розпізнати, посилання у вхідному рядку залишиться без змін. Подвійні $$ зменшуються до одного $, що дозволяє екранувати синтаксис $(VAR_NAME): тобто "$$(VAR_NAME)" створить рядок "$(VAR_NAME)". Екрановані посилання ніколи не будуть розгортатись, незалежно від того, чи існує змінна. Не можна оновлювати. Більше інформації: <a href="/uk/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell">https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell</a></td>
    </tr>
    <tr>
      <td><code>command</code><br/><em>string array</em></td>
      <td>Масив точок входу. Не виконується в межах оболонки. Використовується ENTRYPOINT образу контейнера, якщо це не вказано. Посилання на змінні $(VAR_NAME) розгортаються за допомогою середовища контейнера. Якщо змінну не вдається розпізнати, посилання у вхідному рядку залишиться без змін. Подвійні $$ зменшуються до одного $, що дозволяє екранувати синтаксис $(VAR_NAME): тобто "$$(VAR_NAME)" створить рядок "$(VAR_NAME)". Екрановані посилання ніколи не будуть розгортатись, незалежно від того, чи існує змінна. Не можна оновлювати. Більше інформації: <a href="/uk/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell">https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell</a></td>
    </tr>
    <tr>
      <td><code>env</code><br/><em><a href="{{< ref "#EnvVar" >}}">EnvVar array</a></em><br/><em>patch strategy: злиття за ключем <code>name</code></em></td>
      <td>Список змінних середовища для встановлення в контейнері. Не можна оновлювати.</td>
    </tr>
    <tr>
      <td><code>envFrom</code><br/><em><a href="{{< ref "#EnvFromSource" >}}">EnvFromSource array</a></em></td>
      <td>Список джерел для заповнення змінних середовища в контейнері. Ключі, визначені в джерелі, можуть складатися з будь-яких друкованих ASCII-символів, крім '='. Якщо ключ існує в кількох джерелах, значення, повʼязане з останнім джерелом, матиме пріоритет. Значення, визначені в Env з дубльованим ключем, матимуть пріоритет. Не можна оновлювати.</td>
    </tr>
    <tr>
      <td><code>image</code><br/><em>string</em></td>
      <td>Назва образу контейнера. Більше інформації: <a href="/uk/docs/concepts/containers/images">https://kubernetes.io/docs/concepts/containers/images</a>. Це поле є необовʼязковим, щоб дозволити вищому рівню керування конфігурацією встановлювати стандартні значення або перевизначати образи контейнерів у контролерах робочих навантажень, таких як Deployments і StatefulSets.</td>
    </tr>
    <tr>
      <td><code>imagePullPolicy</code><br/><em>string</em></td>
      <td>Політика витягування образу. Одне з Always, Never, IfNotPresent. Стандартно — Always, якщо вказано тег :latest, або IfNotPresent в іншому випадку. Не можна оновлювати. Більше інформації: <a href="/uk/docs/concepts/containers/images#updating-images">https://kubernetes.io/docs/concepts/containers/images#updating-images</a>
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Always"</code> означає, що kubelet завжди намагається витягнути останній образ. Контейнер не запуститься, якщо витягування не вдасться.</li>
        <li><code>"IfNotPresent"</code> означає, що kubelet витягує образ, якщо його немає на диску. Контейнер не запуститься, якщо образу немає і витягування не вдасться.</li>
        <li><code>"Never"</code> означає, що kubelet ніколи не витягує образ, а використовує лише локальний образ. Контейнер не запуститься, якщо образу немає</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>lifecycle</code><br/><em><a href="{{< ref "#Lifecycle" >}}">Lifecycle</a></em></td>
      <td>Дії, які система керування повинна виконати у відповідь на події життєвого циклу контейнера. Не можна оновлювати.</td>
    </tr>
    <tr>
      <td><code>livenessProbe</code><br/><em><a href="{{< ref "#Probe" >}}">Probe</a></em></td>
      <td>Періодична перевірка життєздатності контейнера. Контейнер буде перезапущено, якщо перевірка не вдасться. Не можна оновлювати. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle#container-probes">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes</a></td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Імʼя контейнера, вказане як DNS_LABEL. Кожен контейнер у поді повинен мати унікальне імʼя (DNS_LABEL). Не можна оновлювати.</td>
    </tr>
    <tr>
      <td><code>ports</code><br/><em><a href="{{< ref "#ContainerPort" >}}">ContainerPort array</a></em><br/><em>patch strategy: злиття за ключем <code>containerPort</code></em></td>
      <td>Список портів для експонування з контейнера. Не вказуючи порт тут, НЕ забороняє його експонування. Будь-який порт, який слухає на стандартній адресі "0.0.0.0" всередині контейнера, буде доступний з мережі. Зміна цього масиву за допомогою стратегічного злиття може пошкодити дані. Для отримання додаткової інформації див. <a href="https://github.com/kubernetes/kubernetes/issues/108255">https://github.com/kubernetes/kubernetes/issues/108255</a>. Не можна оновлювати.</td>
    </tr>
    <tr>
      <td><code>readinessProbe</code><br/><em><a href="{{< ref "#Probe" >}}">Probe</a></em></td>
      <td>Періодична перевірка готовності контейнера. Контейнер буде видалено з точок доступу сервісу, якщо перевірка не вдасться. Не можна оновлювати. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle#container-probes">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes</a></td>
    </tr>
    <tr>
      <td><code>resizePolicy</code><br/><em><a href="{{< ref "#ContainerResizePolicy" >}}">ContainerResizePolicy array</a></em></td>
      <td>Політика зміни ресурсів для контейнера. Це поле не можна встановлювати для ефермерних контейнерів.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em><a href="{{< ref "#ResourceRequirements" >}}">ResourceRequirements</a></em></td>
      <td>Обчислювальні ресурси, необхідні для цього контейнера. Не можна оновлювати. Більше інформації: <a href="/uk/docs/concepts/configuration/manage-resources-containers/">https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/</a></td>
    </tr>
    <tr>
      <td><code>restartPolicy</code><br/><em>string</em></td>
      <td>RestartPolicy визначає поведінку перезапуску окремих контейнерів у поді. Перевизначає політику перезапуску на рівні пода. Якщо це поле не вказано, поведінка перезапуску визначається політикою перезапуску пода та типом контейнера. Крім того, встановлення RestartPolicy як "Always" для init-контейнера матиме наступний ефект: цей init-контейнер буде постійно перезапускатися при виході, поки всі звичайні контейнери не завершать роботу. Після завершення роботи всіх звичайних контейнерів, всі init-контейнери з restartPolicy "Always" будуть завершені. Цей життєвий цикл відрізняється від звичайних init-контейнерів і часто називається "sidecar" контейнером. Хоча цей init-контейнер все ще запускається в послідовності init-контейнерів, він не чекає завершення контейнера перед переходом до наступного init-контейнера. Замість цього наступний init-контейнер запускається відразу після запуску цього init-контейнера або після успішного завершення будь-якого startupProbe.</td>
    </tr>
    <tr>
      <td><code>restartPolicyRules</code><br/><em><a href="{{< ref "#ContainerRestartRule" >}}">ContainerRestartRule array</a></em></td>
      <td>Представляє список правил, які перевіряються для визначення, чи слід перезапустити контейнер при виході. Правила оцінюються в порядку їхнього визначення. Як тільки правило відповідає умові виходу контейнера, решта правил ігноруються. Якщо жодне правило не відповідає умові виходу контейнера, політика перезапуску на рівні контейнера визначає, чи буде контейнер перезапущено. Обмеження для правил:
      <ul>
        <li>Дозволяється не більше 20 правил.</li>
        <li>Правила можуть мати однакову дію.</li>
        <li>Ідентичні правила не заборонені під час перевірок.</li>
        <li>Коли правила вказані, контейнер ПОВИНЕН явно встановити RestartPolicy, навіть якщо вона відповідає RestartPolicy пода.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>securityContext</code><br/><em><a href="{{< ref "#SecurityContext" >}}">SecurityContext</a></em></td>
      <td>SecurityContext визначає параметри безпеки, з якими повинен запускатися контейнер. Якщо встановлено, поля SecurityContext перевизначають еквівалентні поля PodSecurityContext. Більше інформації: <a href="/uk/docs/tasks/configure-pod-container/security-context/">https://kubernetes.io/docs/tasks/configure-pod-container/security-context/</a></td>
    </tr>
    <tr>
      <td><code>startupProbe</code><br/><em><a href="{{< ref "#Probe" >}}">Probe</a></em></td>
      <td>StartupProbe вказує, що Pod успішно ініціалізовано. Якщо вказано, жодні інші перевірки не виконуються, поки ця не завершиться успішно. Якщо ця перевірка не вдасться, Pod буде перезапущено, так само, як якщо б не вдалася livenessProbe. Можна використовувати для надання різних параметрів перевірки на початку життєвого циклу Podʼа, коли може знадобитися багато часу для завантаження даних або прогріву кешу, ніж під час стабільної роботи. Поле не можна оновити. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle#container-probes">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes</a></td>
    </tr>
    <tr>
      <td><code>stdin</code><br/><em>boolean</em></td>
      <td>Чи цей контейнер повинен виділяти буфер для stdin у середовищі виконання контейнера. Якщо це не встановлено, читання з stdin у контейнері завжди призведе до EOF. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>stdinOnce</code><br/><em>boolean</em></td>
      <td>Чи середовище виконання контейнера повинно закрити канал stdin після того, як він був відкритий одним підключенням. Коли stdin встановлено в true, потік stdin залишатиметься відкритим під час кількох сеансів підключення. Якщо stdinOnce встановлено в true, stdin відкривається при запуску контейнера, залишається порожнім до першого підключення клієнта до stdin, а потім залишається відкритим і приймає дані до відключення клієнта, після чого stdin закривається і залишається закритим до перезапуску контейнера. Якщо цей прапорець встановлено в false, процеси контейнера, які читають з stdin, ніколи не отримають EOF. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>terminationMessagePath</code><br/><em>string</em></td>
      <td>Опціонально: Шлях, за яким файл, у який буде записано повідомлення про завершення контейнера, буде змонтовано в файлову систему контейнера. Повідомлення призначене для короткого підсумкового статусу, такого як повідомлення про помилку перевірки. Буде обрізано вузлом, якщо перевищує 4096 байт. Загальна довжина повідомлення для всіх контейнерів буде обмежена 12 КБ. Стандартно — /dev/termination-log. Не можна оновити.</td>
    </tr>
    <tr>
      <td><code>terminationMessagePolicy</code><br/><em>string</em></td>
      <td>Вказує, як має бути заповнене повідомлення про завершення. Файл використовуватиме вміст terminationMessagePath для заповнення повідомлення про стан контейнера як у разі успіху, так і у разі помилки. FallbackToLogsOnError використовуватиме останній фрагмент журналу контейнера, якщо файл повідомлення про завершення порожній і контейнер завершився з помилкою. Вихідні дані журналу обмежені 2048 байтами або 80 рядками, залежно від того, що менше. Стандартно — File. Не можна оновити.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"FallbackToLogsOnError"</code> читатиме останній вміст журналу контейнера для повідомлення про стан контейнера, коли контейнер завершився з помилкою і terminationMessagePath порожній.</li>
        <li><code>"File"</code> є стандартною поведінкою і встановлює повідомлення про стан контейнера відповідно до вмісту terminationMessagePath контейнера при його завершенні.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>tty</code><br/><em>boolean</em></td>
      <td>Чи цей контейнер повинен виділяти TTY для себе, також вимагає, щоб 'stdin' було встановлено в true. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>volumeDevices</code><br/><em><a href="{{< ref "#VolumeDevice" >}}">VolumeDevice array</a></em><br/><em>patch strategy: злиття за ключем <code>devicePath</code></em></td>
      <td>volumeDevices є списком блочних пристроїв, які будуть використовуватися контейнером.</td>
    </tr>
    <tr>
      <td><code>volumeMounts</code><br/><em><a href="{{< ref "#VolumeMount" >}}">VolumeMount array</a></em><br/><em>patch strategy: злиття за ключем <code>mountPath</code></em></td>
      <td>Томи Podʼа для монтування в файлову систему контейнера. Не можна оновити.</td>
    </tr>
    <tr>
      <td><code>workingDir</code><br/><em>string</em></td>
      <td>Робоча тека контейнера. Якщо не вказано, буде використано стандартне значення середовища виконання контейнера, яке може бути налаштоване в образі контейнера. Не можна оновити.</td>
    </tr>
  </tbody>
</table>

## ContainerExtendedResourceRequest {#ContainerExtendedResourceRequest}

ContainerExtendedResourceRequest містить зіставлення імені контейнера, імені розширеного ресурсу з іменем запиту пристрою.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>containerName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Імʼя контейнера, який запитує ресурси.</td>
    </tr>
    <tr>
      <td><code>requestName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Імʼя запиту в спеціальному ResourceClaim, який відповідає розширеному ресурсу.</td>
    </tr>
    <tr>
      <td><code>resourceName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Імʼя розширеного ресурсу в цьому контейнері, який підтримується DRA.</td>
    </tr>
  </tbody>
</table>

## ContainerPort {#ContainerPort}

ContainerPort представляє мережевий порт в одному контейнері.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>containerPort</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>Номер порту для експонування в IP-адресі Podʼа. Це має бути дійсний номер порту, 0 &lt; x &lt; 65536.</td>
    </tr>
    <tr>
      <td><code>hostIP</code><br/><em>string</em></td>
      <td>Яку IP-адресу хосту привʼязати до зовнішнього порту.</td>
    </tr>
    <tr>
      <td><code>hostPort</code><br/><em>integer</em></td>
      <td>Номер порту для експонування на хості. Якщо вказано, це має бути дійсний номер порту, 0 &lt; x &lt; 65536. Якщо вказано HostNetwork, це має відповідати ContainerPort. Більшість контейнерів цього не потребує.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Якщо вказано, це має бути IANA_SVC_NAME і унікальним в межах pod. Кожен іменований порт у pod повинен мати унікальне імʼя. Імʼя порту, на який можна посилатися з сервісів.</td>
    </tr>
    <tr>
      <td><code>protocol</code><br/><em>string</em></td>
      <td>Протокол для порту. Має бути UDP, TCP або SCTP. Зазвичай — "TCP".
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"SCTP"</code> це протокол SCTP.</li>
        <li><code>"TCP"</code> це протокол TCP.</li>
        <li><code>"UDP"</code> це протокол UDP.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

## ContainerResizePolicy {#ContainerResizePolicy}

ContainerResizePolicy представляє політику зміни розміру ресурсу для контейнера.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>resourceName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Імʼя ресурсу, до якого застосовується ця політика зміни розміру ресурсу. Підтримувані значення: cpu, memory.</td>
    </tr>
    <tr>
      <td><code>restartPolicy</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Політика перезапуску, яка застосовується при зміні розміру вказаного ресурсу. Якщо не вказано, стандартно використовується NotRequired.</td>
    </tr>
  </tbody>
</table>

## ContainerRestartRule {#ContainerRestartRule}

ContainerRestartRule описує, як обробляється вихід контейнера.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>action</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Вказує дію, яка виконується при виході контейнера, якщо вимоги виконані. Єдине можливе значення — "Restart" для перезапуску контейнера.</td>
    </tr>
    <tr>
      <td><code>exitCodes</code><br/><em><a href="{{< ref "#ContainerRestartRuleOnExitCodes" >}}">ContainerRestartRuleOnExitCodes</a></em></td>
      <td>Представляє коди виходу, які потрібно перевіряти при виході контейнера.</td>
    </tr>
  </tbody>
</table>

## ContainerRestartRuleOnExitCodes {#ContainerRestartRuleOnExitCodes}

ContainerRestartRuleOnExitCodes описує умову для обробки виходу контейнера на основі його кодів виходу.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>operator</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Вказує відношення між кодом(ами) виходу контейнера та зазначеними значеннями. Можливі значення:
      <ul>
        <li><code>"In"</code> вимога задовольняється, якщо код виходу контейнера знаходиться в наборі зазначених значень.</li>
        <li><code>"NotIn"</code> вимога задовольняється, якщо код виходу контейнера не знаходиться в наборі зазначених значень.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>values</code><br/><em>integer array</em></td>
      <td>Набір значень, які потрібно перевіряти для кодів виходу контейнера. Дозволяється не більше 255 елементів.</td>
    </tr>
  </tbody>
</table>

## ContainerState {#ContainerState}

ContainerState описує можливий стан контейнера. Може бути вказаний лише один з його членів. Якщо жоден з них не вказано, за замовчуванням використовується ContainerStateWaiting.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>running</code><br/><em><a href="{{< ref "#ContainerStateRunning" >}}">ContainerStateRunning</a></em></td>
      <td>Деталі про контейнер, що працює</td>
    </tr>
    <tr>
      <td><code>terminated</code><br/><em><a href="{{< ref "#ContainerStateTerminated" >}}">ContainerStateTerminated</a></em></td>
      <td>Деталі про контейнер, що завершився</td>
    </tr>
    <tr>
      <td><code>waiting</code><br/><em><a href="{{< ref "#ContainerStateWaiting" >}}">ContainerStateWaiting</a></em></td>
      <td>Деталі про контейнер, що очікує</td>
    </tr>
  </tbody>
</table>

## ContainerStateRunning {#ContainerStateRunning}

ContainerStateRunning описує стан контейнера, що працює.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>startedAt</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Час, коли контейнер був останній раз (пере)запущений</td>
    </tr>
  </tbody>
</table>

## ContainerStateTerminated {#ContainerStateTerminated}

ContainerStateTerminated описує стан контейнера, що завершився.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>containerID</code><br/><em>string</em></td>
      <td>ID контейнера у форматі '&lt;type&gt;://&lt;container_id&gt;'</td>
    </tr>
    <tr>
      <td><code>exitCode</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>Код виходу з останнього завершення контейнера</td>
    </tr>
    <tr>
      <td><code>finishedAt</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Час, коли контейнер останній раз завершився</td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>Повідомлення щодо останнього завершення контейнера</td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>(коротка) причина останнього завершення контейнера</td>
    </tr>
    <tr>
      <td><code>signal</code><br/><em>integer</em></td>
      <td>Сигнал останнього завершення контейнера</td>
    </tr>
    <tr>
      <td><code>startedAt</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Час, коли попереднє виконання контейнера розпочалося</td>
    </tr>
  </tbody>
</table>

## ContainerStateWaiting {#ContainerStateWaiting}

ContainerStateWaiting описує стан контейнера, що очікує.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>Повідомлення щодо того, чому контейнер ще не працює.</td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>(коротка) причина того, чому контейнер ще не працює.</td>
    </tr>
  </tbody>
</table>

## ContainerUser {#ContainerUser}

ContainerUser описує інформацію про ідентичність користувача

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>linux</code><br/><em><a href="{{< ref "#LinuxContainerUser" >}}">LinuxContainerUser</a></em></td>
      <td>Linux містить інформацію про ідентичність користувача, спочатку прикріплену до першого процесу контейнерів у Linux. Зверніть увагу, що фактична ідентичність під час виконання може бути змінена, якщо процес має достатні привілеї для цього.</td>
    </tr>
  </tbody>
</table>

## DownwardAPIProjection {#DownwardAPIProjection}

Представляє інформацію про downward API для виконання проєкції у проєцьований том. Зверніть увагу, що це ідентично джерелу тому downwardAPI без стандартного режиму.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile array</a></em></td>
      <td>Items є списком файлів DownwardAPIVolume</td>
    </tr>
  </tbody>
</table>

## DownwardAPIVolumeFile {#DownwardAPIVolumeFile}

DownwardAPIVolumeFile описує інформацію для створення файлу, що містить поле поду

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fieldRef</code><br/><em><a href="{{< ref "#ObjectFieldSelector" >}}">ObjectFieldSelector</a></em></td>
      <td>Обовʼязково: Вибирає поле поду: підтримуються лише анотації, мітки, імʼя, простір імен та uid.</td>
    </tr>
    <tr>
      <td><code>mode</code><br/><em>integer</em></td>
      <td>Опціонально: біти режиму, що використовуються для встановлення дозволів на цей файл, повинні бути вісімковим значенням від 0000 до 0777 або десятковим значенням від 0 до 511. YAML приймає як вісімкові, так і десяткові значення, JSON вимагає десяткових значень для бітів режиму. Якщо не вказано, буде використано volume defaultMode. Це може конфліктувати з іншими параметрами, що впливають на режим файлу, такими як fsGroup, і результатом можуть бути встановлені інші біти режиму.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Обовʼязково: шлях є відносним іменем файлу, що буде створено. Не повинен бути абсолютним або містити шлях '..'. Повинен бути закодований у UTF-8. Перший елемент відносного шляху не повинен починатися з '..'</td>
    </tr>
    <tr>
      <td><code>resourceFieldRef</code><br/><em><a href="{{< ref "#ResourceFieldSelector" >}}">ResourceFieldSelector</a></em></td>
      <td>Обирає ресурс контейнера: наразі підтримуються лише обмеження та запити ресурсів (limits.cpu, limits.memory, requests.cpu та requests.memory).</td>
    </tr>
  </tbody>
</table>

## DownwardAPIVolumeSource {#DownwardAPIVolumeSource}

DownwardAPIVolumeSource описує том, що містить інформацію downward API. Том downward API підтримує керування власністю та переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>defaultMode</code><br/><em>integer</em></td>
      <td>Опціонально: біти режиму, що використовуються для встановлення дозволів на створені файли за замовчуванням. Повинні бути вісімковим значенням від 0000 до 0777 або десятковим значенням від 0 до 511. YAML приймає як вісімкові, так і десяткові значення, JSON вимагає десяткових значень для бітів режиму. За замовчуванням 0644. Каталоги всередині шляху не впливають на це налаштування. Це може конфліктувати з іншими параметрами, що впливають на режим файлу, такими як fsGroup, і результатом можуть бути встановлені інші біти режиму.</td>
    </tr>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile array</a></em></td>
      <td>Items є списком файлів downward API</td>
    </tr>
  </tbody>
</table>

## EmptyDirVolumeSource {#EmptyDirVolumeSource}

Представляє порожню теку для пода. Том порожньої теки підтримує керування власністю та переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>medium</code><br/><em>string</em></td>
      <td>medium представляє тип носія зберігання, який повинен підтримувати цю теку. Зазвичай "" означає використання стандартного носія вузла. Повинно бути порожнім рядком (типово) або Memory. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#emptydir">https://kubernetes.io/docs/concepts/storage/volumes#emptydir</a>.</td>
    </tr>
    <tr>
      <td><code>sizeLimit</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td>sizeLimit є загальною кількістю локального сховища, необхідного для цього тома EmptyDir. Обмеження розміру також застосовується до носія памʼяті. Максимальне використання на носії памʼяті EmptyDir буде мінімальним значенням між зазначеним тут SizeLimit та сумою обмежень памʼяті всіх контейнерів у поді. ЗСтандартно — nil, що означає, що обмеження не визначено. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#emptydir">https://kubernetes.io/docs/concepts/storage/volumes#emptydir</a>.</td>
    </tr>
  </tbody>
</table>

## EnvFromSource {#EnvFromSource}

EnvFromSource представляє джерело набору ConfigMaps або Secrets

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>configMapRef</code><br/><em><a href="{{< ref "#ConfigMapEnvSource" >}}">ConfigMapEnvSource</a></em></td>
      <td>ConfigMap для вибору</td>
    </tr>
    <tr>
      <td><code>prefix</code><br/><em>string</em></td>
      <td>Опційний текст для додавання на початок імені кожної змінної середовища. Може складатися з будь-яких друкованих ASCII-символів, крім '='.</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "#SecretEnvSource" >}}">SecretEnvSource</a></em></td>
      <td>Secret для вибору</td>
    </tr>
  </tbody>
</table>

## EnvVar {#EnvVar}

EnvVar представляє змінну середовища, присутню в контейнері.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Імʼя змінної середовища. Може складатися з будь-яких друкованих ASCII-символів, крім '='.</td>
    </tr>
    <tr>
      <td><code>value</code><br/><em>string</em></td>
      <td>Посилання на змінні $(VAR_NAME) розширюються з використанням раніше визначених змінних середовища в контейнері та будь-яких змінних середовища сервісу. Якщо змінну не можна розвʼязати, посилання у вхідному рядку залишиться незмінним. Подвійні $$ зменшуються до одного $, що дозволяє екранувати синтаксис $(VAR_NAME): тобто "$$(VAR_NAME)" створить рядковий літерал "$(VAR_NAME)". Екрановані посилання ніколи не будуть розширюватися, незалежно від того, чи існує змінна. Стандартно — "".</td>
    </tr>
    <tr>
      <td><code>valueFrom</code><br/><em><a href="{{< ref "#EnvVarSource" >}}">EnvVarSource</a></em></td>
      <td>Джерело значення змінної середовища. Не можна використовувати, якщо value не порожнє.</td>
    </tr>
  </tbody>
</table>

## EnvVarSource {#EnvVarSource}

EnvVarSource представляє джерело значення для EnvVar.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>configMapKeyRef</code><br/><em><a href="{{< ref "#ConfigMapKeySelector" >}}">ConfigMapKeySelector</a></em></td>
      <td>Вибір ключа з ConfigMap.</td>
    </tr>
    <tr>
      <td><code>fieldRef</code><br/><em><a href="{{< ref "#ObjectFieldSelector" >}}">ObjectFieldSelector</a></em></td>
      <td>Вибір поля пода: підтримуються metadata.name, metadata.namespace, `metadata.labels['&lt;KEY&gt;']`, `metadata.annotations['&lt;KEY&gt;']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.</td>
    </tr>
    <tr>
      <td><code>fileKeyRef</code><br/><em><a href="{{< ref "#FileKeySelector" >}}">FileKeySelector</a></em></td>
      <td>FileKeyRef вибирає ключ з файлу змінних середовища. Потрібно, щоб функціональна можливість EnvFiles була увімкнена.</td>
    </tr>
    <tr>
      <td><code>resourceFieldRef</code><br/><em><a href="{{< ref "#ResourceFieldSelector" >}}">ResourceFieldSelector</a></em></td>
      <td>Вибір ресурсу контейнера: наразі підтримуються лише обмеження та запити ресурсів (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory та requests.ephemeral-storage).</td>
    </tr>
    <tr>
      <td><code>secretKeyRef</code><br/><em><a href="{{< ref "#SecretKeySelector" >}}">SecretKeySelector</a></em></td>
      <td>Вибір ключа з секрету в просторі імен пода.</td>
    </tr>
  </tbody>
</table>

## EphemeralContainer {#EphemeralContainer}

EphemeralContainer є тимчасовим контейнером, який можна додати до наявного пода для ініційованих користувачем дій, таких як налагодження. Тимчасові контейнери не мають гарантій щодо ресурсів або планування, і вони не будуть перезапущені після виходу або видалення пода. Kubelet може виселити под, якщо тимчасовий контейнер призведе до перевищення виділених ресурсів пода.

Щоб додати тимчасовий контейнер, використовуйте субресурс ephemeralcontainers наявного пода. Тимчасові контейнери не можуть бути видалені або перезапущені.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>args</code><br/><em>string array</em></td>
      <td>Аргументи для точки входу. Використовується CMD образу, якщо це не вказано. Посилання на змінні $(VAR_NAME) розгортаються за допомогою середовища контейнера. Якщо змінну не вдається знайти, посилання вхідного рядка залишиться без змін. Подвійні $$ зменшуються до одного $, що дозволяє екранувати синтаксис $(VAR_NAME): тобто "$$(VAR_NAME)" створить рядок літералів "$(VAR_NAME)". Екрановані посилання ніколи не будуть розгорнуті, незалежно від того, чи існує змінна. Не можна оновлювати. Більше інформації: <a href="/uk/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell">https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell</a></td>
    </tr>
    <tr>
      <td><code>command</code><br/><em>string array</em></td>
      <td>Масив точок входу. Не виконується в межах оболонки. Використовується ENTRYPOINT образу, якщо це не вказано. Посилання на змінні $(VAR_NAME) розгортаються за допомогою середовища контейнера. Якщо змінну не вдається знайти, посилання вхідного рядка залишиться без змін. Подвійні $$ зменшуються до одного $, що дозволяє екранувати синтаксис $(VAR_NAME): тобто "$$(VAR_NAME)" створить рядок літералів "$(VAR_NAME)". Екрановані посилання ніколи не будуть розгорнуті, незалежно від того, чи існує змінна. Не можна оновлювати. Більше інформації: <a href="/uk/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell">https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell</a></td>
    </tr>
    <tr>
      <td><code>env</code><br/><em><a href="{{< ref "#EnvVar" >}}">EnvVar array</a></em><br/><em>patch strategy: злиття за ключем <code>name</code></em></td>
      <td>Список змінних середовища для встановлення в контейнері. Не можна оновлювати.</td>
    </tr>
    <tr>
      <td><code>envFrom</code><br/><em><a href="{{< ref "#EnvFromSource" >}}">EnvFromSource array</a></em></td>
      <td>Список джерел для заповнення змінних середовища в контейнері. Ключі, визначені в джерелі, можуть складатися з будь-яких друкованих ASCII-символів, крім '='. Якщо ключ існує в кількох джерелах, значення, повʼязане з останнім джерелом, матиме пріоритет. Значення, визначені за допомогою Env з дубльованим ключем, матимуть пріоритет. Не можна оновлювати.</td>
    </tr>
    <tr>
      <td><code>image</code><br/><em>string</em></td>
      <td>Назва образу контейнера. Більше інформації: https://kubernetes.io/docs/concepts/containers/images</td>
    </tr>
    <tr>
      <td><code>imagePullPolicy</code><br/><em>string</em></td>
      <td>Політика витягування образу. Одне з Always, Never, IfNotPresent. За замовчуванням Always, якщо вказано тег :latest, або IfNotPresent в іншому випадку. Не можна оновлювати. Більше інформації: <a href="https://kubernetes.io/docs/concepts/containers/images#updating-images">https://kubernetes.io/docs/concepts/containers/images#updating-images</a>
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Always"</code> означає, що kubelet завжди намагається витягнути останній образ. Контейнер не запуститься, якщо витягування не вдасться.</li>
        <li><code>"IfNotPresent"</code> означає, що kubelet витягує образ, якщо його немає на диску. Контейнер не запуститься, якщо образу немає і витягування не вдасться.</li>
        <li><code>"Never"</code> означає, що kubelet ніколи не витягує образ, а використовує лише локальний образ. Контейнер не запуститься, якщо образу немає.</li>
      </ul>
    </tr>
    <tr>
      <td><code>lifecycle</code><br/><em><a href="{{< ref "#Lifecycle" >}}">Lifecycle</a></em></td>
      <td>Lifecycle не дозволено для епhemeral контейнерів.</td>
    </tr>
    <tr>
      <td><code>livenessProbe</code><br/><em><a href="{{< ref "#Probe" >}}">Probe</a></em></td>
      <td>Probes не дозволено для епhemeral контейнерів.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Назва епhemeral контейнера, вказана як DNS_LABEL. Ця назва повинна бути унікальною серед усіх контейнерів, init контейнерів та епhemeral контейнерів.</td>
    </tr>
    <tr>
      <td><code>ports</code><br/><em><a href="{{< ref "#ContainerPort" >}}">ContainerPort array</a></em><br/><em>patch strategy: злиття за ключем <code>containerPort</code></em></td>
      <td>Ports не дозволено для епhemeral контейнерів.</td>
    </tr>
    <tr>
      <td><code>readinessProbe</code><br/><em><a href="{{< ref "#Probe" >}}">Probe</a></em></td>
      <td>Probes не дозволено для епhemeral контейнерів.</td>
    </tr>
    <tr>
      <td><code>resizePolicy</code><br/><em><a href="{{< ref "#ContainerResizePolicy" >}}">ContainerResizePolicy array</a></em></td>
      <td>Правила зміни розміру ресурсів для контейнера.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em><a href="{{< ref "#ResourceRequirements" >}}">ResourceRequirements</a></em></td>
      <td>Resources не дозволено для епhemeral контейнерів. Епhemeral контейнери використовують вільні ресурси, вже виділені для поду.</td>
    </tr>
    <tr>
      <td><code>restartPolicy</code><br/><em>string</em></td>
      <td>Політика перезапуску для контейнера для керування поведінкою перезапуску кожного контейнера в поді. Ви не можете встановлювати це поле для епhemeral контейнерів.</td>
    </tr>
    <tr>
      <td><code>restartPolicyRules</code><br/><em><a href="{{< ref "#ContainerRestartRule" >}}">ContainerRestartRule array</a></em></td>
      <td>Представляє список правил, які перевіряються, щоб визначити, чи слід перезапустити контейнер після виходу. Ви не можете встановлювати це поле для епhemeral контейнерів.</td>
    </tr>
    <tr>
      <td><code>securityContext</code><br/><em><a href="{{< ref "#SecurityContext" >}}">SecurityContext</a></em></td>
      <td>Опційно: SecurityContext визначає параметри безпеки, з якими слід запускати епhemeral контейнер. Якщо встановлено, поля SecurityContext перевизначають еквівалентні поля PodSecurityContext.</td>
    </tr>
    <tr>
      <td><code>startupProbe</code><br/><em><a href="{{< ref "#Probe" >}}">Probe</a></em></td>
      <td>Probes не дозволено для епhemeral контейнерів.</td>
    </tr>
    <tr>
      <td><code>stdin</code><br/><em>boolean</em></td>
      <td>Чи повинен цей контейнер виділяти буфер для stdin у середовищі виконання контейнера. Якщо це не встановлено, читання з stdin у контейнері завжди призведе до EOF. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>stdinOnce</code><br/><em>boolean</em></td>
      <td>Чи повинен середовище виконання контейнера закривати канал stdin після того, як він був відкритий одним підключенням. Коли stdin встановлено в true, потік stdin залишатиметься відкритим під час кількох сеансів підключення. Якщо stdinOnce встановлено в true, stdin відкривається при запуску контейнера, порожній до першого підключення клієнта до stdin, а потім залишається відкритим і приймає дані до відключення клієнта, після чого stdin закривається і залишається закритим до перезапуску контейнера. Якщо цей прапорець встановлено в false, процеси контейнера, які читають зі stdin, ніколи не отримають EOF. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>targetContainerName</code><br/><em>string</em></td>
      <td>Якщо встановлено, імʼя контейнера з PodSpec, на який націлений цей епhemeral контейнер. Епhemeral контейнер буде запущений у просторах імен (IPC, PID тощо) цього контейнера. Якщо не встановлено, епhemeral контейнер використовує простори імен, налаштовані в Pod spec. Середовище виконання контейнера повинно підтримувати цю функцію. Якщо середовище виконання не підтримує націлювання на простори імен, результат встановлення цього поля невизначений.</td>
    </tr>
    <tr>
      <td><code>terminationMessagePath</code><br/><em>string</em></td>
      <td>Опційно: Шлях, за яким файл, у який буде записано повідомлення про завершення контейнера, монтується в файлову систему контейнера. Повідомлення призначене для короткого підсумкового статусу, такого як повідомлення про помилку перевірки. Буде обрізано вузлом, якщо перевищує 4096 байт. Загальна довжина повідомлення для всіх контейнерів буде обмежена 12 КБ. Стандартно — /dev/termination-log. Не можна оновлювати.</td>
    </tr>
    <tr>
      <td><code>terminationMessagePolicy</code><br/><em>string</em></td>
      <td>Вказує, як має бути заповнене повідомлення про завершення. Файл використовуватиме вміст terminationMessagePath для заповнення повідомлення про стан контейнера як у разі успіху, так і у разі помилки. FallbackToLogsOnError використовуватиме останній фрагмент журналу контейнера, якщо файл повідомлення про завершення порожній і контейнер завершився з помилкою. Вихідні дані журналу обмежені 2048 байтами або 80 рядками, залежно від того, що менше. Стандартно використовується File. Не можна оновлювати.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"FallbackToLogsOnError"</code> читатиме останній вміст журналу контейнера для повідомлення про стан контейнера, коли контейнер завершився з помилкою і terminationMessagePath порожній.</li>
        <li><code>"File"</code> є стандартною поведінкою і встановлює повідомлення про стан контейнера відповідно до вмісту terminationMessagePath контейнера при його завершенні.</li>
      </ul>
    </tr>
    <tr>
      <td><code>tty</code><br/><em>boolean</em></td>
      <td>Чи повинен цей контейнер виділяти TTY для себе, також вимагає, щоб 'stdin' було встановлено в true. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>volumeDevices</code><br/><em><a href="{{< ref "#VolumeDevice" >}}">VolumeDevice array</a></em><br/><em>patch strategy: злиття за ключем <code>devicePath</code></em></td>
      <td>volumeDevices є списком блочних пристроїв, які будуть використовуватися контейнером.</td>
    </tr>
    <tr>
      <td><code>volumeMounts</code><br/><em><a href="{{< ref "#VolumeMount" >}}">VolumeMount array</a></em><br/><em>patch strategy: злиття за ключем <code>mountPath</code></em></td>
      <td>Томи Podʼа для монтування у файлову систему контейнера. Subpath mounts не дозволені для епhemeral контейнерів. Не можна оновлювати.</td>
    </tr>
    <tr>
      <td><code>workingDir</code><br/><em>string</em></td>
      <td>Робоча тека контейнера. Якщо не вказано, буде використано стандартне значення середовища виконання контейнера, яке може бути налаштоване в образі контейнера. Не можна оновлювати.</td>
    </tr>
  </tbody>
</table>

## EphemeralVolumeSource {#EphemeralVolumeSource}

Представляє епhemeral том, який обробляється звичайним драйвером зберігання.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>volumeClaimTemplate</code><br/><em><a href="{{< ref "#PersistentVolumeClaimTemplate" >}}">PersistentVolumeClaimTemplate</a></em></td>
      <td>Буде використано для створення окремого PVC для забезпечення тому. Под, у якому вбудовано цей EphemeralVolumeSource, буде власником PVC, тобто PVC буде видалено разом із подом. Імʼя PVC буде <code>&lt;pod name&gt;-&lt;volume name&gt;</code>, де <code>&lt;volume name&gt;</code> — це імʼя з масиву <code>PodSpec.Volumes</code>. Валідація пода відхилить под, якщо обʼєднане імʼя не є дійсним для PVC (наприклад, занадто довге). Наявний PVC з таким імʼям, який не належить поду, *не* буде використаний для пода, щоб уникнути випадкового використання стороннього тому. Запуск пода буде заблоковано, поки не буде видалено сторонній PVC. Якщо такий попередньо створений PVC призначений для використання подом, PVC потрібно оновити з посиланням на власника пода після його створення. Зазвичай це не потрібно, але може бути корисним при ручному відновленні пошкодженого кластера. Це поле лише для читання, і Kubernetes не вноситиме зміни до PVC після його створення. Обовʼязкове, не може бути nil.</td>
    </tr>
  </tbody>
</table>

## ExecAction {#ExecAction}

ExecAction описує дію "запуск в контейнері".

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>command</code><br/><em>string array</em></td>
      <td>Команда для виконання всередині контейнера. Робоча тека для команди — коренева ('/') у файловій системі контейнера. Команда просто виконується, вона не запускається всередині оболонки, тому традиційні інструкції оболонки ('|', тощо) не працюватимуть. Щоб використовувати оболонку, потрібно явно викликати цю оболонку. Статус виходу 0 вважається життєздатним/справним, а ненульовий — несправним.</td>
    </tr>
  </tbody>
</table>

## FileKeySelector {#FileKeySelector}

FileKeySelector вибирає ключ з файлу середовища.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Ключ у файлі середовища. Недійсний ключ запобігатиме запуску пода. Ключі, визначені в джерелі, можуть складатися з будь-яких друкованих ASCII-символів, крім '='. Під час альфа-етапу функції EnvFiles розмір ключа обмежений 128 символами.</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Вказує, чи файл або його ключ мають бути визначені. Якщо файл або ключ не існує, змінна середовища не буде опублікована. Якщо optional встановлено в true і вказаний ключ не існує, змінна середовища не буде встановлена в контейнерах пода. Якщо optional встановлено в false і вказаний ключ не існує, під час створення пода буде повернено помилку.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Шлях у межах тому, з якого потрібно вибрати файл. Має бути відносним і не може містити '..' або починатися з '..'.</td>
    </tr>
    <tr>
      <td><code>volumeName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Імʼя тому, що містить файл середовища.</td>
    </tr>
  </tbody>
</table>

## FlexVolumeSource {#FlexVolumeSource}

FlexVolume представляє собою загальний ресурс тому, який надається/підключається за допомогою втулка на основі exec.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>driver</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>driver є імʼям драйвера, який використовується для цього тому.</td>
    </tr>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType є типом файлової системи для монтування. Має бути типом файлової системи, підтримуваним операційною системою хоста. Наприклад, "ext4", "xfs", "ntfs". Стандартна файлова система залежить від скрипта FlexVolume.</td>
    </tr>
    <tr>
      <td><code>options</code><br/><em>object</em></td>
      <td>options є опціональним: це поле містить додаткові параметри команди, якщо вони є.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly є опціональним: стандартно — false (читання/запис). Встановлення ReadOnly тут примусово встановить параметр ReadOnly у VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef є опціональним: secretRef є посиланням на обʼєкт секрету, що містить конфіденційну інформацію для передачі скриптам плагіна. Це поле може бути порожнім, якщо обʼєкт секрету не вказано. Якщо обʼєкт секрету містить більше одного секрету, усі секрети передаються скриптам плагіна.</td>
    </tr>
  </tbody>
</table>

## GRPCAction {#GRPCAction}

GRPCAction визначає дію, повʼязану з сервісом GRPC.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>port</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>Номер порту сервісу gRPC. Значення має бути в діапазоні від 1 до 65535.</td>
    </tr>
    <tr>
      <td><code>service</code><br/><em>string</em></td>
      <td>Service є імʼям сервісу, який буде вказано в gRPC HealthCheckRequest (див. <a href="https://github.com/grpc/grpc/blob/master/doc/health-checking.md">https://github.com/grpc/grpc/blob/master/doc/health-checking.md</a>). Якщо не вказано, стандартна поведінка визначається gRPC.</td>
    </tr>
  </tbody>
</table>

## GitRepoVolumeSource {#GitRepoVolumeSource}

Представляє том, який заповнюється вмістом репозиторію git. Томи git не підтримують управління власністю. Томи git підтримують переназначення SELinux.

ЗАСТАРІЛО: GitRepo застарів. Щоб забезпечити контейнер репозиторієм git, змонтуйте EmptyDir в InitContainer, який клонує репозиторій за допомогою git, а потім змонтуйте EmptyDir в контейнер Podʼа.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>directory</code><br/><em>string</em></td>
      <td>directory є імʼям цільової теки. Не може містити або починатися з '..'. Якщо вказано '.', тека тому буде репозиторієм git. В іншому випадку, якщо вказано, том міститиме репозиторій git у вкладеній теці з вказаним імʼям.</td>
    </tr>
    <tr>
      <td><code>repository</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>repository є URL-адресою репозиторію git.</td>
    </tr>
    <tr>
      <td><code>revision</code><br/><em>string</em></td>
      <td>revision є хешем коміту для вказаної ревізії.</td>
    </tr>
  </tbody>
</table>

## GlusterfsVolumeSource {#GlusterfsVolumeSource}

Представляє собою монтування Glusterfs, яке триває протягом життя Podʼа. Томи Glusterfs не підтримують управління власністю або переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>endpoints</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>endpoints є імʼям точки доступу, яка описує топологію Glusterfs.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>path є шляхом до тому Glusterfs. Більше інформації: <a href="https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod">https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod</a></td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly тут примусово встановить том Glusterfs у режимі лише для читання. Стандартно — false. Більше інформації: <a href="https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod">https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod</a></td>
    </tr>
  </tbody>
</table>

## HTTPGetAction {#HTTPGetAction}

HTTPGetAction описує дію, засновану на HTTP Get запитах.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>host</code><br/><em>string</em></td>
      <td>Імʼя хоста для підключення, зазвичай використовується IP-адреса Pod. Ймовірно, ви захочете встановити "Host" у httpHeaders замість цього.</td>
    </tr>
    <tr>
      <td><code>httpHeaders</code><br/><em><a href="{{< ref "#HTTPHeader" >}}">HTTPHeader array</a></em></td>
      <td>Власні заголовки для встановлення в запиті. HTTP дозволяє повторювані заголовки.</td>
    </tr>
    <tr>
      <td><code>path</code><br/><em>string</em></td>
      <td>Шлях для доступу на HTTP сервері.</td>
    </tr>
    <tr>
      <td><code>port</code>&nbsp;<strong>*</strong><br/><em></em></td>
      <td>Імʼя або номер порту для доступу на контейнері. Номер повинен бути в діапазоні від 1 до 65535. Імʼя повинно бути IANA_SVC_NAME.</td>
    </tr>
    <tr>
      <td><code>scheme</code><br/><em>string</em></td>
      <td>Схема для підключення до хоста. Стандартно — HTTP.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"HTTP"</code> означає, що буде використано схему http://</li>
        <li><code>"HTTPS"</code> означає, що буде використано схему https://</li>
      </ul></td>
    </tr>
  </tbody>
</table>

## HTTPHeader {#HTTPHeader}

HTTPHeader описує власний заголовок, який буде використано в HTTP-запитах.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Імʼя заголовка. Воно буде канонізоване при виведенні, тому варіанти з різним регістром будуть розумітися як один і той же заголовок.</td>
    </tr>
    <tr>
      <td><code>value</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Значення заголовка.</td>
    </tr>
  </tbody>
</table>

## HostAlias {#HostAlias}

HostAlias представляє відповідність між IP та іменами хостів, які будуть вставлені як запис у файлі hosts Podʼа.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>hostnames</code><br/><em>string array</em></td>
      <td>Імена хостів для вказаної IP-адреси.</td>
    </tr>
    <tr>
      <td><code>ip</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>IP-адреса для запису у файлі hosts.</td>
    </tr>
  </tbody>
</table>

## HostIP {#HostIP}

HostIP представляє одну IP-адресу, виділену для хоста.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>ip</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>IP є IP-адресою, виділеною для хосту.</td>
    </tr>
  </tbody>
</table>

## ISCSIVolumeSource {#ISCSIVolumeSource}

Представляє диск ISCSI. Томи ISCSI можна монтувати лише як читання/запис один раз. Томи ISCSI підтримують управління власністю та переназначення міток SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>chapAuthDiscovery</code><br/><em>boolean</em></td>
      <td>chapAuthDiscovery визначає, чи підтримується автентифікація iSCSI Discovery CHAP</td>
    </tr>
    <tr>
      <td><code>chapAuthSession</code><br/><em>boolean</em></td>
      <td>chapAuthSession визначає, чи підтримується автентифікація iSCSI Session CHAP</td>
    </tr>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType визначає тип файлової системи тому, який ви хочете змонтувати. Порада: Переконайтеся, що тип файлової системи підтримується операційною системою хосту. Приклади: "ext4", "xfs", "ntfs". Якщо не вказано, зазвичай використовується "ext4". Більше інформації: <a href="/uk/docs/concepts/storage/volumes#iscsi">https://kubernetes.io/docs/concepts/storage/volumes#iscsi</a>.</td>
    </tr>
    <tr>
      <td><code>initiatorName</code><br/><em>string</em></td>
      <td>initiatorName є власним iSCSI Initiator Name. Якщо initiatorName вказано разом з iscsiInterface, буде створено новий iSCSI інтерфейс &lt;target portal&gt;:\&lt;volume name&gt; для підключення.</td>
    </tr>
    <tr>
      <td><code>iqn</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>iqn є iSCSI Qualified Name цілі.</td>
    </tr>
    <tr>
      <td><code>iscsiInterface</code><br/><em>string</em></td>
      <td>iscsiInterface є імʼям інтерфейсу, який використовує iSCSI транспорт. Стандартно — 'default' (tcp).</td>
    </tr>
    <tr>
      <td><code>lun</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>lun представляє номер iSCSI Target Lun.</td>
    </tr>
    <tr>
      <td><code>portals</code><br/><em>string array</em></td>
      <td>portals є списком iSCSI Target Portal. Портал може бути або IP-адресою, або ip_addr:port, якщо порт відрізняється від стандартного (зазвичай TCP порти 860 та 3260).</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly тут примусово встановлює параметр ReadOnly у VolumeMounts. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef є CHAP Secret для автентифікації iSCSI цілі та ініціатора</td>
    </tr>
    <tr>
      <td><code>targetPortal</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>targetPortal є iSCSI Target Portal. Портал може бути або IP-адресою, або ip_addr:port, якщо порт відрізняється від стандартного (зазвичай TCP порти 860 та 3260).</td>
    </tr>
  </tbody>
</table>

## ImageVolumeSource {#ImageVolumeSource}

ImageVolumeSource представляє ресурс образу тома.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pullPolicy</code><br/><em>string</em></td>
      <td>Політика отримання обʼєктів OCI. Можливі значення: Always: kubelet завжди намагається отримати образ за посиланням. Створення контейнера зазнає невдачі, якщо отримання не вдається. Never: kubelet ніколи не намагається отримати образ за посиланням і використовує лише локальний образ або артефакт. Створення контейнера зазнає невдачі, якщо посилання відсутнє. IfNotPresent: kubelet намагається отримати обʼєкт, якщо він ще не присутній на диску. Створення контейнера зазнає невдачі, якщо посилання відсутнє і отримання не вдається. Стандартно — Always, якщо вказано тег :latest, або IfNotPresent в іншому випадку.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Always"</code> означає, що kubelet завжди намагається отримати останній образ. Контейнер зазнає невдачі, якщо отримання не вдається.</li>
        <li><code>"IfNotPresent"</code> означає, що kubelet отримує образ, якщо він відсутній на диску. Контейнер зазнає невдачі, якщо образ відсутній і отримання не вдається.</li>
        <li><code>"Never"</code> означає, що kubelet ніколи не отримує образ, а використовує лише локальний образ. Контейнер зазнає невдачі, якщо образ відсутній</li>
      </ul>
    </tr>
    <tr>
      <td><code>reference</code><br/><em>string</em></td>
      <td>Обовʼязково: Образ або посилання на артефакт для використання. Поводиться так само, як pod.spec.containers[*].image. Секрети для отримання образу будуть зібрані так само, як для образу контейнера, шляхом перевірки облікових даних вузла, секретів для отримання образу SA та секретів для отримання образу pod spec. Більше інформації: <a href="/uk/docs/concepts/containers/images">https://kubernetes.io/docs/concepts/containers/images</a>. Це поле є необовʼязковим, щоб дозволити вищому рівню керування конфігурацією встановлювати стандартне значення  або перевизначати образи контейнерів у контролерах робочих навантажень, таких як Deployments та StatefulSets.</td>
    </tr>
  </tbody>
</table>

## ImageVolumeStatus {#ImageVolumeStatus}

ImageVolumeStatus представляє стан тому на основі образу.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>imageRef</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>ImageRef є дайджестом образу, використаного для цього тому. Він повинен мати значення, подібне до pod.status.containerStatuses[i].imageID. Довжина ImageRef не повинна перевищувати 256 символів.</td>
    </tr>
  </tbody>
</table>

## KeyToPath {#KeyToPath}

Зіставлення рядка ключа з шляхом у межах тому.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>key є ключем для проєкції.</td>
    </tr>
    <tr>
      <td><code>mode</code><br/><em>integer</em></td>
      <td>mode є опціональним: біти режиму, які використовуються для встановлення дозволів на цей файл. Має бути вісімкове значення від 0000 до 0777 або десяткове значення від 0 до 511. YAML приймає як вісімкові, так і десяткові значення, JSON вимагає десяткові значення для бітів режиму. Якщо не вказано, буде використано стандартне значення для тому. Може конфліктувати з іншими параметрами, які впливають на режим файлу, такими як fsGroup, і результатом можуть бути інші встановлені біти режиму.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>path є відносним шляхом файлу для зіставлення ключа. Не може бути абсолютним шляхом. Не може містити елемент шляху '..'. Не може починатися зі рядка '..'.</td>
    </tr>
  </tbody>
</table>

## Lifecycle {#Lifecycle}

Lifecycle описує дії, які система керування повинна виконувати у відповідь на події життєвого циклу контейнера. Для обробників життєвого циклу PostStart і PreStop керування контейнером блокується до завершення дії, якщо процес контейнера не зазнає невдачі, у такому випадку робота обробника переривається.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>postStart</code><br/><em><a href="{{< ref "#LifecycleHandler" >}}">LifecycleHandler</a></em></td>
      <td>PostStart викликається одразу після створення контейнера. У разі збою обробника, робота контейнера завершується і перезапускається відповідно до його політики перезапуску. Інше керування контейнером блокується до завершення роботи обробника. Більше інформації: <a href="/uk/docs/concepts/containers/container-lifecycle-hooks/#container-hooks">https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks</a>.</td>
    </tr>
    <tr>
      <td><code>preStop</code><br/><em><a href="{{< ref "#LifecycleHandler" >}}">LifecycleHandler</a></em></td>
      <td>PreStop викликається одразу перед завершенням роботи контейнера через запит API або подію керування, таку як збій перевірки життєздатності/запуску, примусове завершення, конфлікт ресурсів тощо. Обробник не викликається, якщо контейнер аварійно завершує роботу або виходить. Зворотний відлік періоду завершення роботи Podʼа починається перед виконанням обробника PreStop. Незалежно від результату роботи обробника, контейнер зрештою завершить роботу в межах періоду завершення роботи Podʼа (якщо не затримано завершувачами). Інше керування контейнером блокується до завершення роботи обробника або до досягнення періоду завершення роботи. Більше інформації: <a href="/uk/docs/concepts/containers/container-lifecycle-hooks/#container-hooks">https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks</a>.</td>
    </tr>
    <tr>
      <td><code>stopSignal</code><br/><em>string</em></td>
      <td>StopSignal визначає, який сигнал буде надіслано контейнеру під час його зупинки. Якщо не вказано, стандартне значення визначається середовищем виконання контейнера. StopSignal можна встановити лише для Podʼів з непорожнім .spec.os.name
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"SIGABRT"</code></li>
        <li><code>"SIGALRM"</code></li>
        <li><code>"SIGBUS"</code></li>
        <li><code>"SIGCHLD"</code></li>
        <li><code>"SIGCLD"</code></li>
        <li><code>"SIGCONT"</code></li>
        <li><code>"SIGFPE"</code></li>
        <li><code>"SIGHUP"</code></li>
        <li><code>"SIGILL"</code></li>
        <li><code>"SIGINT"</code></li>
        <li><code>"SIGIO"</code></li>
        <li><code>"SIGIOT"</code></li>
        <li><code>"SIGKILL"</code></li>
        <li><code>"SIGPIPE"</code></li>
        <li><code>"SIGPOLL"</code></li>
        <li><code>"SIGPROF"</code></li>
        <li><code>"SIGPWR"</code></li>
        <li><code>"SIGQUIT"</code></li>
        <li><code>"SIGRTMAX"</code></li>
        <li><code>"SIGRTMAX-1"</code></li>
        <li><code>"SIGRTMAX-10"</code></li>
        <li><code>"SIGRTMAX-11"</code></li>
        <li><code>"SIGRTMAX-12"</code></li>
        <li><code>"SIGRTMAX-13"</code></li>
        <li><code>"SIGRTMAX-14"</code></li>
        <li><code>"SIGRTMAX-2"</code></li>
        <li><code>"SIGRTMAX-3"</code></li>
        <li><code>"SIGRTMAX-4"</code></li>
        <li><code>"SIGRTMAX-5"</code></li>
        <li><code>"SIGRTMAX-6"</code></li>
        <li><code>"SIGRTMAX-7"</code></li>
        <li><code>"SIGRTMAX-8"</code></li>
        <li><code>"SIGRTMAX-9"</code></li>
        <li><code>"SIGRTMIN"</code></li>
        <li><code>"SIGRTMIN+1"</code></li>
        <li><code>"SIGRTMIN+10"</code></li>
        <li><code>"SIGRTMIN+11"</code></li>
        <li><code>"SIGRTMIN+12"</code></li>
        <li><code>"SIGRTMIN+13"</code></li>
        <li><code>"SIGRTMIN+14"</code></li>
        <li><code>"SIGRTMIN+15"</code></li>
        <li><code>"SIGRTMIN+2"</code></li>
        <li><code>"SIGRTMIN+3"</code></li>
        <li><code>"SIGRTMIN+4"</code></li>
        <li><code>"SIGRTMIN+5"</code></li>
        <li><code>"SIGRTMIN+6"</code></li>
        <li><code>"SIGRTMIN+7"</code></li>
        <li><code>"SIGRTMIN+8"</code></li>
        <li><code>"SIGRTMIN+9"</code></li>
        <li><code>"SIGSEGV"</code></li>
        <li><code>"SIGSTKFLT"</code></li>
        <li><code>"SIGSTOP"</code></li>
        <li><code>"SIGSYS"</code></li>
        <li><code>"SIGTERM"</code></li>
        <li><code>"SIGTRAP"</code></li>
        <li><code>"SIGTSTP"</code></li>
        <li><code>"SIGTTIN"</code></li>
        <li><code>"SIGTTOU"</code></li>
        <li><code>"SIGURG"</code></li>
        <li><code>"SIGUSR1"</code></li>
        <li><code>"SIGUSR2"</code></li>
        <li><code>"SIGVTALRM"</code></li>
        <li><code>"SIGWINCH"</code></li>
        <li><code>"SIGXCPU"</code></li>
        <li><code>"SIGXFSZ"</code></li>
      </ul></td>
    </tr>
  </tbody>
</table>

## LifecycleHandler {#LifecycleHandler}

LifecycleHandler визначає конкретну дію, яка повинна бути виконана в хуку життєвого циклу. Повинно бути вказано лише одне з полів, за винятком TCPSocket.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>exec</code><br/><em><a href="{{< ref "#ExecAction" >}}">ExecAction</a></em></td>
      <td>Exec визначає команду, яку потрібно виконати в контейнері.</td>
    </tr>
    <tr>
      <td><code>httpGet</code><br/><em><a href="{{< ref "#HTTPGetAction" >}}">HTTPGetAction</a></em></td>
      <td>HTTPGet визначає HTTP GET запит, який потрібно виконати.</td>
    </tr>
    <tr>
      <td><code>sleep</code><br/><em><a href="{{< ref "#SleepAction" >}}">SleepAction</a></em></td>
      <td>Sleep визначає тривалість, протягом якої контейнер повинен спати.</td>
    </tr>
    <tr>
      <td><code>tcpSocket</code><br/><em><a href="{{< ref "#TCPSocketAction" >}}">TCPSocketAction</a></em></td>
      <td>Застаріло. TCPSocket не підтримується як LifecycleHandler і зберігається для зворотної сумісності. Валідація цього поля не проводиться, і хуки життєвого циклу не працюватимуть під час виконання, якщо воно вказане.</td>
    </tr>
  </tbody>
</table>

## LinuxContainerUser {#LinuxContainerUser}

LinuxContainerUser представляє інформацію про ідентичність користувача в Linux-контейнерах

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>gid</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>GID є основним GID, спочатку прикріпленим до першого процесу в контейнері</td>
    </tr>
    <tr>
      <td><code>supplementalGroups</code><br/><em>integer array</em></td>
      <td>SupplementalGroups є додатковими групами, спочатку прикріпленими до першого процесу в контейнері</td>
    </tr>
    <tr>
      <td><code>uid</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>UID є основним UID, спочатку прикріпленим до першого процесу в контейнері</td>
    </tr>
  </tbody>
</table>

## NodeAffinity {#NodeAffinity}

Node affinity є групою правил планування на основі спорідненості вузлів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>preferredDuringSchedulingIgnoredDuringExecution</code><br/><em><a href="{{< ref "#PreferredSchedulingTerm" >}}">PreferredSchedulingTerm array</a></em></td>
      <td>Планувальник надаватиме перевагу розміщенню подів на вузлах, які задовольняють виразам спорідненості, зазначеним в цьому полі, але він може обрати вузол, який порушує один або кілька виразів. Найбільш бажаним вузлом є той, який має найбільшу суму ваг, тобто для кожного вузла, який відповідає всім вимогам планування (запит ресурсів, вирази спорідненості requiredDuringScheduling тощо), обчислить суму, перебираючи елементи цього поля та додаючи "вагу" до суми, якщо вузол відповідає відповідним matchExpressions; вузол(и) з найвищою сумою є найбільш бажаними.</td>
    </tr>
    <tr>
      <td><code>requiredDuringSchedulingIgnoredDuringExecution</code><br/><em><a href="{{< ref "../definitions/node-selector-v1#NodeSelector" >}}">NodeSelector</a></em></td>
      <td>Якщо вимоги спорідненості, зазначені в цьому полі, не виконуються під час планування, под не буде заплановано на вузол. Якщо вимоги спорідненості, зазначені в цьому полі, перестануть виконуватися під час виконання поду (наприклад, через оновлення), система може або не може спробувати в кінцевому підсумку виселити под з його вузла.</td>
    </tr>
  </tbody>
</table>

## NodeAllocatableResourceClaimStatus {#NodeAllocatableResourceClaimStatus}

NodeAllocatableResourceClaimStatus описує стан ресурсів, доступних на вузлі, які були виділені через DRA.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>containers</code><br/><em>string array</em></td>
      <td>Список контейнерів у цьому поді, які посилаються на цей запит ресурсів.</td>
    </tr>
    <tr>
      <td><code>resourceClaimName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>ResourceClaimName є запитом ресурсів, на який посилається под, що призвів до цього виділення ресурсів на вузлі.</td>
    </tr>
    <tr>
      <td><code>resources</code>&nbsp;<strong>*</strong><br/><em>object</em></td>
      <td>Resources є мапою імен ресурсів, доступних на вузлі, до загальної кількості, виділеної для цього запиту.</td>
    </tr>
  </tbody>
</table>

## ObjectFieldSelector {#ObjectFieldSelector}

ObjectFieldSelector обирає поле обʼєкта з вказаною версією API.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>Версія схеми, у термінах якої записано FieldPath, стандартно — "v1".</td>
    </tr>
    <tr>
      <td><code>fieldPath</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Шлях до поля, яке потрібно обрати у вказаній версії API.</td>
    </tr>
  </tbody>
</table>

## PersistentVolumeClaimTemplate {#PersistentVolumeClaimTemplate}

PersistentVolumeClaimTemplate використовується для створення обʼєктів PersistentVolumeClaim як частини EphemeralVolumeSource.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>Може містити мітки та анотації, які будуть скопійовані в PVC під час його створення. Жодні інші поля не дозволяються і будуть відхилені під час перевірки.</td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "persistent-volume-claim-v1#PersistentVolumeClaimSpec" >}}">PersistentVolumeClaimSpec</a></em></td>
      <td>Специфікація для PersistentVolumeClaim. Весь вміст копіюється без змін у PVC, який створюється з цього шаблону. Ті самі поля, що й у PersistentVolumeClaim, також дійсні тут.</td>
    </tr>
  </tbody>
</table>

## PersistentVolumeClaimVolumeSource {#PersistentVolumeClaimVolumeSource}

PersistentVolumeClaimVolumeSource посилається на PVC користувача в тому ж просторі імен. Цей том знаходить привʼязаний PV і монтує цей том для пода. PersistentVolumeClaimVolumeSource, по суті, є обгорткою навколо іншого типу тому, який належить комусь іншому (системі).

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>claimName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>claimName є імʼям PersistentVolumeClaim у тому ж просторі імен, що й под, який використовує цей том. Більше інформації: <a href="/uk/docs/concepts/storage/persistent-volumes#persistentvolumeclaims">https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims</a></td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly Встановлює режим лише для читання в VolumeMounts. Стандартнт — false.</td>
    </tr>
  </tbody>
</table>

## PodAffinity {#PodAffinity}

Спорідненість подів (Pod affinity) — це група правил планування, що визначають взаємне розташування подів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>preferredDuringSchedulingIgnoredDuringExecution</code><br/><em><a href="{{< ref "#WeightedPodAffinityTerm" >}}">WeightedPodAffinityTerm array</a></em></td>
      <td>Планувальник віддає перевагу розміщенню подів на вузлах, які задовольняють виразам спорідненості, зазначених в цьому полі, але може обрати вузол, який порушує один або кілька виразів. Найбільш бажаним вузлом є той, у якого найбільша сума ваг, тобто для кожного вузла, який відповідає всім вимогам планування (запит ресурсів, вирази requiredDuringScheduling спорідненості тощо), обчислюється сума, перебираючи елементи цього поля та додаючи "вагу" до суми, якщо вузол має поди, які відповідають відповідному podAffinityTerm; вузол(и) з найвищою сумою є найбільш бажаними.</td>
    </tr>
    <tr>
      <td><code>requiredDuringSchedulingIgnoredDuringExecution</code><br/><em><a href="{{< ref "#PodAffinityTerm" >}}">PodAffinityTerm array</a></em></td>
      <td>Якщо вимоги спорідненості, зазначені в цьому полі, не виконуються під час планування, под не буде заплановано на вузол. Якщо вимоги спорідненості, зазначені в цьому полі, перестануть виконуватися під час виконання пода (наприклад, через оновлення мітки пода), система може або не може спробувати в кінцевому підсумку виселити под з його вузла. Коли є кілька елементів, списки вузлів, що відповідають кожному podAffinityTerm, перетинаються, тобто всі умови повинні бути виконані.</td>
    </tr>
  </tbody>
</table>

## PodAffinityTerm {#PodAffinityTerm}

Визначає набір подів (а саме тих, що відповідають labelSelector відносно заданих namespace(s)), з якими цей под повинен бути розташований разом (affinity) або не розташований разом (anti-affinity), де розташування разом визначається як виконання на вузлі, значення мітки з ключем &lt;topologyKey&gt; якого відповідає будь-якому вузлу, на якому виконується под з набору подів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>labelSelector</code><br/><em><a href="{{< ref "../definitions/label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>Запит міток для набору ресурсів, у цьому випадку подів. Якщо він дорівнює null, цей PodAffinityTerm не відповідає жодному поду.</td>
    </tr>
    <tr>
      <td><code>matchLabelKeys</code><br/><em>string array</em></td>
      <td>MatchLabelKeys є набором міток ключів подів для вибору, які поди будуть враховані. Ключі використовуються для пошуку значень у вхідних мітках подів, ці ключ-значення мітки обʼєднуються з <code>labelSelector</code> як <code>key in (value)</code> для вибору групи наявних подів, які будуть враховані для (анти) спорідненості вхідного пода. Ключі, які не існують у вхідних мітках подів, будуть ігноруватися. Стандартне значення є порожнім. Той самий ключ заборонено використовувати як у matchLabelKeys, так і в labelSelector. Також matchLabelKeys не може бути встановлено, якщо labelSelector не встановлено.</td>
    </tr>
    <tr>
      <td><code>mismatchLabelKeys</code><br/><em>string array</em></td>
      <td>MismatchLabelKeys є набором міток ключів подів для вибору, які поди будуть враховані. Ключі використовуються для пошуку значень у вхідних мітках подів, ці ключ-значення мітки обʼєднуються з <code>labelSelector</code> як <code>key notin (value)</code> для вибору групи наявних подів, які будуть враховані для (анти) спорідненості вхідного пода. Ключі, які не існують у вхідних мітках подів, будуть ігноруватися. Стандартне значення є порожнім. Той самий ключ заборонено використовувати як у mismatchLabelKeys, так і в labelSelector. Також mismatchLabelKeys не може бути встановлено, якщо labelSelector не встановлено.</td>
    </tr>
    <tr>
      <td><code>namespaceSelector</code><br/><em><a href="{{< ref "../definitions/label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>Запит міток для набору просторів імен, до яких застосовується цей термін. Термін застосовується до обʼєднання просторів імен, вибраних цим полем, та тих, що перелічені в полі namespaces. Null селектор і null або порожній список просторів імен означає "простір імен цього пода". Порожній селектор ({}) відповідає всім просторам імен.</td>
    </tr>
    <tr>
      <td><code>namespaces</code><br/><em>string array</em></td>
      <td>namespaces визначає статичний список назв просторів імен, до яких застосовується цей термін. Термін застосовується до обʼєднання просторів імен, перелічених у цьому полі, та тих, що вибрані за допомогою namespaceSelector. null або порожній список просторів імен і null namespaceSelector означає "простір імен цього пода".</td>
    </tr>
    <tr>
      <td><code>topologyKey</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Цей под має бути розташований разом (affinity) або не разом (anti-affinity) з подами, що відповідають labelSelector у зазначених просторах імен, де "разом" визначається як запуск на вузлі, значення мітки з ключем topologyKey якого відповідає будь-якому вузлу, на якому запущено будь-який з вибраних подів. Порожній topologyKey не дозволяється.</td>
    </tr>
  </tbody>
</table>

## PodAntiAffinity {#PodAntiAffinity}

Pod anti affinity є групою правил планування між подами, що визначають анти-спорідненість.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>preferredDuringSchedulingIgnoredDuringExecution</code><br/><em><a href="{{< ref "#WeightedPodAffinityTerm" >}}">WeightedPodAffinityTerm array</a></em></td>
      <td>Планувальник віддає перевагу розміщенню подів на вузлах, які задовольняють вирази анти-спорідненості, зазначені в цьому полі, але може обрати вузол, який порушує один або кілька виразів. Найбільш бажаним вузлом є той, у якого найбільша сума ваг, тобто для кожного вузла, який відповідає всім вимогам планування (запит ресурсів, requiredDuringScheduling вирази анти-спорідненості тощо), обчислюється сума, перебираючи елементи цього поля і віднімаючи "вагу" з суми, якщо вузол має поди, які відповідають відповідному podAffinityTerm; вузол(и) з найвищою сумою є найбільш бажаними.</td>
    </tr>
    <tr>
      <td><code>requiredDuringSchedulingIgnoredDuringExecution</code><br/><em><a href="{{< ref "#PodAffinityTerm" >}}">PodAffinityTerm array</a></em></td>
      <td>Якщо вимоги анти-спорідненості, зазначені в цьому полі, не виконуються під час планування, под не буде заплановано на вузол. Якщо вимоги анти-спорідненості, зазначені в цьому полі, перестануть виконуватися під час виконання пода (наприклад, через оновлення мітки пода), система може або не може спробувати в кінцевому підсумку виселити под з його вузла. Коли є кілька елементів, списки вузлів, що відповідають кожному podAffinityTerm, перетинаються, тобто всі умови повинні бути виконані.</td>
    </tr>
  </tbody>
</table>

## PodCertificateProjection {#PodCertificateProjection}

PodCertificateProjection надає приватний ключ та X.509 сертифікат у файловій системі пода.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>certificateChainPath</code><br/><em>string</em></td>
      <td>Записує ланцюжок сертифікатів за цим шляхом у спроєцьованому томі. Більшість застосунків повинні використовувати credentialBundlePath. При використанні keyPath і certificateChainPath ваш застосунок повинен перевіряти, що ключ і сертифікат листа узгоджені, оскільки можливо прочитати файли під час ротації.</td>
    </tr>
    <tr>
      <td><code>credentialBundlePath</code><br/><em>string</em></td>
      <td>Записує пакет облікових даних за цим шляхом у спроєцьованому томі. Пакет облікових даних є одним файлом, який містить кілька блоків PEM. Перший блок PEM є блоком PRIVATE KEY, що містить приватний ключ PKCS#8. Решта блоків є блоками CERTIFICATE, що містять виданий ланцюжок сертифікатів від підписувача (лист і будь-які проміжні сертифікати). Використання credentialBundlePath дозволяє коду вашого застосунку в поді виконати одну атомарну операцію читання, яка отримує узгоджений ключ і ланцюжок сертифікатів. Якщо ви проєцюєте їх в окремі файли,  коду вашого застосунку потрібно додатково перевіряти, що листовий сертифікат був виданий для ключа.</td>
    </tr>
    <tr>
      <td><code>keyPath</code><br/><em>string</em></td>
      <td>Записує ключ за цим шляхом у спроєцьованому томі. Більшість застосунків повинні використовувати credentialBundlePath. При використанні keyPath і certificateChainPath ваш застосунок повинен перевіряти, що ключ і сертифікат листа узгоджені, оскільки можливо прочитати файли під час ротації.</td>
    </tr>
    <tr>
      <td><code>keyType</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Тип ключа, який Kubelet згенерує для пода. Дійсні значення: "RSA3072", "RSA4096", "ECDSAP256", "ECDSAP384", "ECDSAP521" та "ED25519".</td>
    </tr>
    <tr>
      <td><code>maxExpirationSeconds</code><br/><em>integer</em></td>
      <td>maxExpirationSeconds є максимально дозволеним терміном дії сертифіката. Kubelet копіює це значення без змін у PodCertificateRequests, які він генерує для цієї проєкції. Якщо не вказано, kube-apiserver встановить його на 86400 (24 години). kube-apiserver відхилить значення менші за 3600 (1 година). Максимально допустиме значення — 7862400 (91 день). Реалізація підписувача може видавати сертифікат з будь-яким терміном дії *коротшим* за MaxExpirationSeconds, але не менше ніж 3600 секунд (1 година). Це обмеження контролюється kube-apiserver. Підписувачі<code>kubernetes.io</code> ніколи не видаватимуть сертифікати з терміном дії більше ніж 24 години.</td>
    </tr>
    <tr>
      <td><code>signerName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>CSR, згенеровані Kubelet, будуть адресовані цьому підписувачу.</td>
    </tr>
    <tr>
      <td><code>userAnnotations</code><br/><em>object</em></td>
      <td>userAnnotations дозволяють авторам подів передавати додаткову інформацію реалізації підписувача. Kubernetes ніяким чином не обмежує і не перевіряє ці метадані. Ці значення копіюються без змін у поле <code>spec.unverifiedUserAnnotations</code> обʼєктів PodCertificateRequest, які створює Kubelet. Записи підлягають такій же перевірці, як і анотації метаданих обʼєктів, з додатковою вимогою, що всі ключі повинні мати доменне префіксування. Ніяких обмежень на значення не накладається, крім загального обмеження на розмір всього поля. Підписувачі повинні документувати підтримувані ключі та значення. Підписувачі повинні відхиляти запити, що містять ключі, які вони не розпізнають.</td>
    </tr>
  </tbody>
</table>

## PodCondition {#PodCondition}

PodCondition містить деталі щодо поточного стану цього пода.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>lastProbeTime</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Останній раз, коли ми перевіряли стан.</td>
    </tr>
    <tr>
      <td><code>lastTransitionTime</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Останній раз, коли стан змінився з одного на інший.</td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>Зрозуміле для людини повідомлення, що вказує деталі останнього переходу.</td>
    </tr>
    <tr>
      <td><code>observedGeneration</code><br/><em>integer</em></td>
      <td>Якщо встановлено, це представляє .metadata.generation, на основі якого було встановлено стан пода.</td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>Унікальна, однословна, CamelCase причина останнього переходу стану.</td>
    </tr>
    <tr>
      <td><code>status</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Status є статусом стану. Може бути True, False, Unknown. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions</a></td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Type є типом стану. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions</a></td>
    </tr>
  </tbody>
</table>

## PodDNSConfig {#PodDNSConfig}

PodDNSConfig визначає параметри DNS пода, додатково до тих, що генеруються з DNSPolicy.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>nameservers</code><br/><em>string array</em></td>
      <td>Список IP-адрес DNS-серверів. Він буде доданий до базових серверів імен, згенерованих з DNSPolicy. Дублікати серверів імен будуть видалені.</td>
    </tr>
    <tr>
      <td><code>options</code><br/><em><a href="{{< ref "#PodDNSConfigOption" >}}">PodDNSConfigOption array</a></em></td>
      <td>Список параметрів DNS-резолвера. Він буде обʼєднаний з базовими параметрами, згенерованими з DNSPolicy. Дублікати будуть видалені. Параметри, задані в Options, перевизначать ті, що зʼявляються в базовій DNSPolicy.</td>
    </tr>
    <tr>
      <td><code>searches</code><br/><em>string array</em></td>
      <td>Список доменів пошуку DNS для пошуку імен хостів. Він буде доданий до базових шляхів пошуку, згенерованих з DNSPolicy. Дублікати шляхів пошуку будуть видалені.</td>
    </tr>
  </tbody>
</table>

## PodDNSConfigOption {#PodDNSConfigOption}

PodDNSConfigOption визначає параметри DNS-резолвера пода.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Name є імʼям цієї опції DNS-резолвера. Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>value</code><br/><em>string</em></td>
      <td>Value є значенням цієї опції DNS-резолвера.</td>
    </tr>
  </tbody>
</table>

## PodExtendedResourceClaimStatus {#PodExtendedResourceClaimStatus}

PodExtendedResourceClaimStatus зберігається в PodStatus для розширених запитів ресурсів, підтримуваних DRA. Він зберігає згенероване імʼя для відповідного спеціального ResourceClaim, створеного планувальником.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>requestMappings</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#ContainerExtendedResourceRequest" >}}">ContainerExtendedResourceRequest array</a></em></td>
      <td>RequestMappings ідентифікує зіставлення &lt;container, розширений ресурс, підтримуваний DRA&gt; на запит пристрою в згенерованому ResourceClaim.</td>
    </tr>
    <tr>
      <td><code>resourceClaimName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>ResourceClaimName є імʼям ResourceClaim, який був згенерований для Podʼа у просторі імен Podʼа.</td>
    </tr>
  </tbody>
</table>

## PodIP {#PodIP}

PodIP представляє одну IP-адресу, виділену поду.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>ip</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>IP є IP-адресою, призначеною поду</td>
    </tr>
  </tbody>
</table>

## PodOS {#PodOS}

PodOS визначає параметри операційної системи пода.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name є імʼям операційної системи. Поточні підтримувані значення: linux та windows. Додаткові значення можуть бути визначені в майбутньому і можуть бути одними з: <a href="https://github.com/opencontainers/runtime-spec/blob/master/config.md#platform-specific-configuration">https://github.com/opencontainers/runtime-spec/blob/master/config.md#platform-specific-configuration</a>. Клієнти повинні очікувати обробки додаткових значень і трактувати невпізнані значення в цьому полі як os: null</td>
    </tr>
  </tbody>
</table>

## PodReadinessGate {#PodReadinessGate}

PodReadinessGate містить посилання на стан пода.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>conditionType</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>ConditionType посилається на стан у списку станів пода з відповідним типом.</td>
    </tr>
  </tbody>
</table>

## PodResourceClaim {#PodResourceClaim}

PodResourceClaim посилається на точно один ResourceClaim, або безпосередньо, або шляхом вказівки ResourceClaimTemplate, який потім перетворюється на ResourceClaim для пода.

Він додає імʼя, яке унікально ідентифікує ResourceClaim всередині Podʼа. Контейнери, які потребують доступу до ResourceClaim, посилаються на нього за цим імʼям.

Коли функціональна можливість DRAWorkloadResourceClaims увімкнена і цей Pod належить до PodGroup, PodResourceClaim співставляється з PodGroupResourceClaim, якщо всі їхні поля однакові (Name, ResourceClaimName та ResourceClaimTemplateName). Співставлена вимога посилається на один ResourceClaim, спільний для всіх Podʼів у PodGroup, зарезервований для PodGroup у ResourceClaimStatus.ReservedFor, а не для окремих Podʼів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name унікально ідентифікує цю заявку на ресурс всередині пода. Це має бути DNS_LABEL.</td>
    </tr>
    <tr>
      <td><code>resourceClaimName</code><br/><em>string</em></td>
      <td>ResourceClaimName є імʼям обʼєкта ResourceClaim у тому ж просторі імен, що й цей под. Точно одне з полів ResourceClaimName або ResourceClaimTemplateName має бути встановлено.</td>
    </tr>
    <tr>
      <td><code>resourceClaimTemplateName</code><br/><em>string</em></td>
      <td>ResourceClaimTemplateName є імʼям обʼєкта ResourceClaimTemplate у тому ж просторі імен, що й цей под. Шаблон буде використано для створення нового ResourceClaim, який буде привʼязаний до цього пода. Коли цей под буде видалено, ResourceClaim також буде видалено. Імʼя пода та імʼя ресурсу, разом із згенерованим компонентом, будуть використані для формування унікального імені для ResourceClaim, яке буде зафіксовано в pod.status.resourceClaimStatuses. Коли функціональна можливість DRAWorkloadResourceClaims увімкнена і под належить до PodGroup, яка визначає PodGroupResourceClaim з тим самим Name та ResourceClaimTemplateName, цей PodResourceClaim вирішується у ResourceClaim, згенерований для PodGroup. Всі поди в групі, які визначають еквівалентний PodResourceClaim, що відповідає Name та ResourceClaimTemplateName PodGroupResourceClaim, спільно використовують той самий згенерований ResourceClaim. ResourceClaims, згенеровані для PodGroup, належать PodGroup, і їхній життєвий цикл повʼязаний з PodGroup, а не з окремим подом. Це поле є незмінним, і жодні зміни не будуть внесені до відповідного ResourceClaim контрольним механізмом після створення ResourceClaim. Точно одне з полів ResourceClaimName або ResourceClaimTemplateName має бути встановлено.</td>
    </tr>
  </tbody>
</table>

## PodSchedulingGate {#PodSchedulingGate}

PodSchedulingGate є повʼязаним з Podʼом для захисту його планування.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Імʼя шлюзу планування. Кожен шлюз планування повинен мати унікальне поле name.</td>
    </tr>
  </tbody>
</table>

## PodSchedulingGroup {#PodSchedulingGroup}

PodSchedulingGroup ідентифікує екземпляр групи планування часу виконання, до якої належить Pod. Планувальник використовує цю інформацію для застосування семантики планування з урахуванням навантаження. Має бути вказане точно одне поле.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>podGroupName</code><br/><em>string</em></td>
      <td>PodGroupName вказує імʼя окремого обʼєкта PodGroup, який представляє екземпляр групи часу виконання. Має бути DNS-субдоменом.</td>
    </tr>
  </tbody>
</table>

## PodSecurityContext {#PodSecurityContext}

PodSecurityContext містить атрибути безпеки на рівні Podʼа та загальні налаштування контейнера. Деякі поля також присутні в container.securityContext. Значення полів container.securityContext мають пріоритет над значеннями полів PodSecurityContext.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>appArmorProfile</code><br/><em><a href="{{< ref "#AppArmorProfile" >}}">AppArmorProfile</a></em></td>
      <td>appArmorProfile містить параметри AppArmor, які використовуються контейнерами в цьому Podʼі. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>fsGroup</code><br/><em>integer</em></td>
      <td>Спеціальна додаткова група, яка застосовується до всіх контейнерів у Podʼі. Деякі типи томів дозволяють Kubelet змінювати власника цього тому на власника Podʼа:
      <ol>
        <li>Власний GID буде FSGroup</li>
        <li>Встановлюється біт setgid (нові файли, створені в томі, будуть належати FSGroup)</li>
        <li>Бітові права доступу обʼєднуються з rw-rw----</li>
      </ol>
      Якщо не встановлено, Kubelet не змінюватиме власника та права доступу жодного тому. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>fsGroupChangePolicy</code><br/><em>string</em></td>
      <td>fsGroupChangePolicy визначає поведінку зміни власника та прав доступу до тому перед його використанням у Podʼі. Це поле застосовується лише до типів томів, які підтримують власність на основі fsGroup (і права доступу). Воно не впливає на епhemeral томи, такі як: secret, configmaps та emptydir. Дійсні значення: "OnRootMismatch" та "Always". Якщо не вказано, використовується "Always". Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Always"</code> вказує, що власник та права доступу до тому завжди повинні змінюватися при монтуванні тому всередині Podʼа. Це стандартна поведінка.</li>
        <li><code>"OnRootMismatch"</code> вказує, що власник та права доступу до тому будуть змінюватися лише тоді, коли права доступу та власник кореневої теки не відповідають очікуваним правам доступу до тому. Це може допомогти скоротити час, необхідний для зміни власника та прав доступу до тому.</li>
      </ul>
    </td>
    </tr>
    <tr>
      <td><code>runAsGroup</code><br/><em>integer</em></td>
      <td>GID, з яким запускається точка входу процесу контейнера. Якщо значення не вказано, використовується стандартне значення середовища виконання. Також може бути задано в SecurityContext. Якщо встановлено як у SecurityContext, так і в PodSecurityContext, значення, вказане в SecurityContext, має пріоритет для цього контейнера. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>runAsNonRoot</code><br/><em>boolean</em></td>
      <td>Вказує на те, що контейнер повинен запускатися не від імені root. Якщо значення true, Kubelet перевірятиме образ під час виконання, щоб переконатися, що він не запускається з UID 0 (root), і не вдасться запустити контейнер, якщо це так. Якщо значення не вказано або воно false, така перевірка не проводиться. Також може бути задано в SecurityContext. Якщо встановлено як у SecurityContext, так і в PodSecurityContext, значення, вказане в SecurityContext, має пріоритет для цього контейнера.</td>
    </tr>
    <tr>
      <td><code>runAsUser</code><br/><em>integer</em></td>
      <td>UID, з яким запускається точка входу процесу контейнера. Якщо значення не вказано, використовується стандартне значення середовища виконання. Також може бути задано в SecurityContext. Якщо встановлено як у SecurityContext, так і в PodSecurityContext, значення, вказане в SecurityContext, має пріоритет для цього контейнера. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>seLinuxChangePolicy</code><br/><em>string</em></td>
      <td>seLinuxChangePolicy визначає, як мітка SELinux контейнера застосовується до всіх томів, що використовуються Podʼом. Не впливає на вузли, які не підтримують SELinux, або на томи, які не підтримують SELinux. Дійсні значення: "MountOption" та "Recursive". "Recursive" означає повторне маркування всіх файлів на всіх томах Podʼа за допомогою середовища виконання контейнера. Це може бути повільно для великих томів, але дозволяє змішувати привілейовані та непривілейовані Podʼи, що використовують один і той же том на одному вузлі. "MountOption" монтує всі відповідні томи Podʼа з опцією монтування <code>-o context</code>. Це вимагає, щоб всі Podʼи, що використовують один і той же том, використовували одну й ту ж мітку SELinux. Неможливо використовувати один і той же том серед привілейованих та непривілейованих Podʼів. Відповідні томи включають вбудовані механізми підтримки томів FibreChannel та iSCSI, а також всі CSI томи, драйвер CSI яких оголошує підтримку SELinux, встановлюючи spec.seLinuxMount: true у своєму екземплярі CSIDriver. Інші томи завжди повторно маркуються рекурсивно. Значення "MountOption" дозволено лише тоді, коли увімкнено функціональний прапорець SELinuxMount. Якщо не вказано і функціональний прапорець SELinuxMount увімкнено, використовується "MountOption". Якщо не вказано і функціональний прапорець SELinuxMount вимкнено, для томів ReadWriteOncePod використовується "MountOption", а для всіх інших томів — "Recursive". Це поле впливає лише на Podʼи, які мають встановлену мітку SELinux, або в PodSecurityContext, або в SecurityContext усіх контейнерів. Всі Podʼи, що використовують один і той же том, повинні використовувати одну й ту ж seLinuxChangePolicy, інакше деякі Podʼи можуть застрягти в стані ContainerCreating. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>seLinuxOptions</code><br/><em><a href="{{< ref "#SELinuxOptions" >}}">SELinuxOptions</a></em></td>
      <td>Контекст SELinux, який застосовується до всіх контейнерів. Якщо не вказано, середовище виконання контейнера призначить випадковий контекст SELinux для кожного контейнера. Також може бути задано в SecurityContext. Якщо встановлено як у SecurityContext, так і в PodSecurityContext, значення, вказане в SecurityContext, має пріоритет для цього контейнера. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>seccompProfile</code><br/><em><a href="{{< ref "#SeccompProfile" >}}">SeccompProfile</a></em></td>
      <td>Параметри seccomp, які використовуються контейнерами в цьому поді. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>supplementalGroups</code><br/><em>integer array</em></td>
      <td>Список груп, які застосовуються до першого процесу, що запускається в кожному контейнері, на додачу до основного GID контейнера та fsGroup (якщо вказано). Якщо функція SupplementalGroupsPolicy увімкнена, поле supplementalGroupsPolicy визначає, чи ці групи додаються до будь-яких членств у групах, визначених у образі контейнера, чи замінюють їх. Якщо не вказано, додаткові групи не додаються, хоча членства в групах, визначені в образі контейнера, можуть все ще використовуватися залежно від поля supplementalGroupsPolicy. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>supplementalGroupsPolicy</code><br/><em>string</em></td>
      <td>Визначає, як обчислюються додаткові групи перших процесів контейнера. Дійсні значення: "Merge" та "Strict". Якщо не вказано, використовується "Merge". (Alpha) Використання цього поля вимагає увімкнення функціональної можливості SupplementalGroupsPolicy, а середовище виконання контейнера повинно підтримувати цю функцію. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Merge"</code> означає, що надані контейнером SupplementalGroups та FsGroup (вказані в SecurityContext) будуть обʼєднані з основними групами користувача, визначеними в образі контейнера (у /etc/group).</li>
        <li><code>"Strict"</code> означає, що надані контейнером SupplementalGroups та FsGroup (вказані в SecurityContext) будуть використовуватися замість будь-яких груп, визначених в образі контейнера.</li>
      </ul>
    </td>
    </tr>
    <tr>
      <td><code>sysctls</code><br/><em><a href="{{< ref "#Sysctl" >}}">Sysctl array</a></em></td>
      <td>Sysctls містить список іменованих sysctl, які використовуються для пода. Поди з непідтримуваними sysctl (з боку середовища виконання контейнера) можуть не запускатися. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>windowsOptions</code><br/><em><a href="{{< ref "#WindowsSecurityContextOptions" >}}">WindowsSecurityContextOptions</a></em></td>
      <td>Специфічні для Windows налаштування, які застосовуються до всіх контейнерів. Якщо не вказано, будуть використані параметри з SecurityContext контейнера. Якщо встановлено як у SecurityContext, так і в PodSecurityContext, перевага надається значенню, вказаному в SecurityContext. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є linux.</td>
    </tr>
  </tbody>
</table>

## PreferredSchedulingTerm {#PreferredSchedulingTerm}

Порожній preferred scheduling term відповідає всім обʼєктам з неявною вагою 0 (тобто це no-op). Null preferred scheduling term не відповідає жодним обʼєктам (тобто також є no-op).

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>preference</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "../definitions/node-selector-term-v1#NodeSelectorTerm" >}}">NodeSelectorTerm</a></em></td>
      <td>Термін вибору вузла, повʼязаний з відповідною вагою.</td>
    </tr>
    <tr>
      <td><code>weight</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>Вага, повʼязана з відповідним терміном вибору вузла, у діапазоні від 1 до 100.</td>
    </tr>
  </tbody>
</table>

## Probe {#Probe}

Probe описує перевірку стану справності, яка виконується для контейнера, щоб визначити, чи він життєздатний або готовий приймати трафік.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>exec</code><br/><em><a href="{{< ref "#ExecAction" >}}">ExecAction</a></em></td>
      <td>Exec вказує команду для виконання в контейнері.</td>
    </tr>
    <tr>
      <td><code>failureThreshold</code><br/><em>integer</em></td>
      <td>Мінімальна кількість послідовних невдач, щоб перевірка вважалася невдалою після успішного виконання. Зазвичай — 3. Мінімальне значення — 1.</td>
    </tr>
    <tr>
      <td><code>grpc</code><br/><em><a href="{{< ref "#GRPCAction" >}}">GRPCAction</a></em></td>
      <td>GRPC вказує GRPC HealthCheckRequest.</td>
    </tr>
    <tr>
      <td><code>httpGet</code><br/><em><a href="{{< ref "#HTTPGetAction" >}}">HTTPGetAction</a></em></td>
      <td>HTTPGet вказує HTTP GET запит для виконання.</td>
    </tr>
    <tr>
      <td><code>initialDelaySeconds</code><br/><em>integer</em></td>
      <td>Кількість секунд після запуску контейнера, перш ніж ініціюються перевірки життєздатності. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle#container-probes">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes</a></td>
    </tr>
    <tr>
      <td><code>periodSeconds</code><br/><em>integer</em></td>
      <td>Як часто (у секундах) виконувати перевірку. Стандартно — 10 секунд. Мінімальне значення — 1.</td>
    </tr>
    <tr>
      <td><code>successThreshold</code><br/><em>integer</em></td>
      <td>Мінімальна кількість послідовних успішних перевірок, щоб перевірка вважалася успішною після невдачі. Зазвичай — 1. Має бути 1 для перевірок життєздатності та запуску. Мінімальне значення — 1.</td>
    </tr>
    <tr>
      <td><code>tcpSocket</code><br/><em><a href="{{< ref "#TCPSocketAction" >}}">TCPSocketAction</a></em></td>
      <td>TCPSocket вказує підключення до TCP порту.</td>
    </tr>
    <tr>
      <td><code>terminationGracePeriodSeconds</code><br/><em>integer</em></td>
      <td>Опціональна тривалість у секундах, протягом якої под має завершити роботу після невдачі перевірки. Період належного завершення — це тривалість у секундах після того, як процеси, що працюють у поді, отримують сигнал завершення, і час, коли процеси примусово зупиняються за допомогою сигналу kill. Встановіть це значення довше, ніж очікуваний час очищення для вашого процесу. Якщо це значення nil, буде використано terminationGracePeriodSeconds пода. В іншому випадку це значення перевизначає значення, надане у специфікації пода. Значення має бути невідʼємним цілим числом. Значення нуль означає негайну зупинку за допомогою сигналу kill (немає можливості завершити роботу). Це бета-поле і вимагає увімкнення функціональної можливості ProbeTerminationGracePeriod. Мінімальне значення — 1. Використовується spec.terminationGracePeriodSeconds, якщо не встановлено.</td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code><br/><em>integer</em></td>
      <td>Кількість секунд після якої перевірка завершується з тайм-аутом. Стандартно — 1 секунда. Мінімальне значення — 1. Більше інформації: <a href="/uk/docs/concepts/workloads/pods/pod-lifecycle#container-probes">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes</a></td>
    </tr>
  </tbody>
</table>

## ProjectedVolumeSource {#ProjectedVolumeSource}

Представляє джерело спроєцьованого тому

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>defaultMode</code><br/><em>integer</em></td>
      <td>defaultMode визначає біти режиму, які стандартно використовуються для встановлення дозволів на створені файли. Має бути восьмеричним значенням від 0000 до 0777 або десятковим значенням від 0 до 511. YAML приймає як восьмеричні, так і десяткові значення, JSON вимагає десяткових значень для бітів режиму. Теки всередині шляху не впливають на цю настройку. Це може конфліктувати з іншими параметрами, які впливають на режим файлу, такими як fsGroup, і результатом можуть бути інші встановлені біти режиму.</td>
    </tr>
    <tr>
      <td><code>sources</code><br/><em><a href="{{< ref "#VolumeProjection" >}}">VolumeProjection array</a></em></td>
      <td>sources є списком проєкцій томів. Кожен елемент у цьому списку обробляє одне джерело.</td>
    </tr>
  </tbody>
</table>

## RBDVolumeSource {#RBDVolumeSource}

Представляє підключення Rados Block Device, яке триває протягом життя пода. RBD томи підтримують управління власністю та переназначення SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType є типом файлової системи тому, який ви хочете змонтувати. Порада: переконайтеся, що тип файлової системи підтримується операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Якщо не вказано, неявно вважається "ext4". Більше інформації: <a href="/uk/docs/concepts/storage/volumes#rbd">https://kubernetes.io/docs/concepts/storage/volumes#rbd</a></td>
    </tr>
    <tr>
      <td><code>image</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>image є імʼям образу Rados. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>keyring</code><br/><em>string</em></td>
      <td>keyring є шляхом до вʼязки ключів для RBDUser. Зазвичай /etc/ceph/keyring. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>monitors</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>monitors є колекцією моніторів Ceph. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>pool</code><br/><em>string</em></td>
      <td>pool є імʼям пулу Rados. Стандартно — rbd. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly тут примусово встановлює параметр ReadOnly у VolumeMounts. Стандартно — false. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef є імʼям секрету автентифікації для RBDUser. Якщо вказано, перевизначає keyring. Стандартно — nil. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
    <tr>
      <td><code>user</code><br/><em>string</em></td>
      <td>user є імʼям користувача Rados. Стандартно — admin. Більше інформації: <a href="https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it">https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</a></td>
    </tr>
  </tbody>
</table>

## ResourceClaim {#ResourceClaim}

ResourceClaim вказує на один запис у PodSpec.ResourceClaims.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name має відповідати імені одного запису в pod.spec.resourceClaims пода, де використовується це поле. Це робить ресурс доступним всередині контейнера.</td>
    </tr>
    <tr>
      <td><code>request</code><br/><em>string</em></td>
      <td>Request є імʼям, обраним для запиту в посиланні на претензію. Якщо порожньо, доступні всі ресурси з заявки, інакше лише результат цього запиту.</td>
    </tr>
  </tbody>
</table>

## ResourceFieldSelector {#ResourceFieldSelector}

ResourceFieldSelector представляє ресурси контейнера (cpu, memory) та їх формат виводу

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>containerName</code><br/><em>string</em></td>
      <td>Імʼя контейнера: обовʼязково для томів, необовʼязково для змінних середовища</td>
    </tr>
    <tr>
      <td><code>divisor</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td>Визначає формат виводу відкритих ресурсів, стандартно — "1"</td>
    </tr>
    <tr>
      <td><code>resource</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Обовʼязково: ресурс для вибору</td>
    </tr>
  </tbody>
</table>

## ResourceHealth {#ResourceHealth}

ResourceHealth представляє стан ресурсу. Він містить останню інформацію про стан пристрою. Це частина KEP <https://kep.k8s.io/4680>.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>health</code><br/><em>string</em></td>
      <td>Стан ресурсу. Може бути одним з наступних:
      <ul>
        <li>Healthy: працює нормально</li>
        <li>Unhealthy: повідомлено про несправність. Ми вважаємо це тимчасовою проблемою зі станом, оскільки наразі немає механізму для розрізнення тимчасових та постійних проблем.</li>
        <li>Unknown: стан не може бути визначений. Наприклад, втулок пристрою був відключений і не був повторно зареєстрований. У майбутньому ми можемо ввести статус PermanentlyUnhealthy.</li>
      </ul>
      </td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>Message надає контекст, зрозумілий людині, для Health (наприклад, "ECC error count exceeded threshold"). Це поле заповнюється kubelet, коли ResourceHealthStatusMessage увімкнено, якщо втулок DRA повертає повідомлення, інакше воно дорівнює null.</td>
    </tr>
    <tr>
      <td><code>resourceID</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>ResourceID є унікальним ідентифікатором ресурсу. Див. тип ResourceID для отримання додаткової інформації.</td>
    </tr>
  </tbody>
</table>

## ResourceRequirements {#ResourceRequirements}

ResourceRequirements описує вимоги до обчислювальних ресурсів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>claims</code><br/><em><a href="{{< ref "#ResourceClaim" >}}">ResourceClaim array</a></em></td>
      <td>Claims є списком імен ресурсів, визначених у spec.resourceClaims, які використовуються цим контейнером. Це поле залежить від функціональної можливості DynamicResourceAllocation. Це поле є незмінним. Воно може бути встановлено лише для контейнерів.</td>
    </tr>
    <tr>
      <td><code>limits</code><br/><em>object</em></td>
      <td>Limits описує максимальну кількість обчислювальних ресурсів, дозволених для використання. Більше інформації: <a href="/uk/docs/concepts/configuration/manage-resources-containers/">https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/</a></td>
    </tr>
    <tr>
      <td><code>requests</code><br/><em>object</em></td>
      <td>Requests описує мінімальну кількість обчислювальних ресурсів, необхідних для роботи. Якщо Requests опущено для контейнера, воно зазвичай дорівнює Limits, якщо воно явно вказано, інакше значенню, визначеному реалізацією. Requests не може перевищувати Limits. Більше інформації: <a href="/uk/docs/concepts/configuration/manage-resources-containers/">https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/</a></td>
    </tr>
  </tbody>
</table>

## ResourceStatus {#ResourceStatus}

ResourceStatus представляє стан одного ресурсу, виділеного для Podʼа.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Назва ресурсу. Має бути унікальною в межах Podʼа і, у випадку ресурсу без DRA, відповідати одному з ресурсів з специфікації Podʼа. Для ресурсів DRA значення має бути "claim:&lt;claim_name&gt;/&lt;request&gt;". Коли цей статус повідомляється про контейнер, "claim_name" і "request" мають відповідати одній з заявок цього контейнера.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em><a href="{{< ref "#ResourceHealth" >}}">ResourceHealth array</a></em></td>
      <td>Список станів унікальних ресурсів. Кожен елемент списку містить унікальний ідентифікатор ресурсу та його стан. Як мінімум, протягом життєвого циклу Podʼа, ідентифікатор ресурсу повинен унікально ідентифікувати ресурс, виділений Podʼу на вузлі. Якщо інший Pod на тому ж вузлі повідомляє про стан з тим самим ідентифікатором ресурсу, це повинен бути той самий ресурс, який вони спільно використовують. Див. визначення типу ResourceID для конкретного формату, який він має у різних випадках використання.</td>
    </tr>
  </tbody>
</table>

## SELinuxOptions {#SELinuxOptions}

SELinuxOptions описує мітки, які будуть застосовані до контейнера.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>level</code><br/><em>string</em></td>
      <td>Level є міткою рівня SELinux, яка застосовується до контейнера.</td>
    </tr>
    <tr>
      <td><code>role</code><br/><em>string</em></td>
      <td>Role є міткою ролі SELinux, яка застосовується до контейнера.</td>
    </tr>
    <tr>
      <td><code>type</code><br/><em>string</em></td>
      <td>Type є міткою типу SELinux, яка застосовується до контейнера.</td>
    </tr>
    <tr>
      <td><code>user</code><br/><em>string</em></td>
      <td>User є міткою користувача SELinux, яка застосовується до контейнера.</td>
    </tr>
  </tbody>
</table>

## ScaleIOVolumeSource {#ScaleIOVolumeSource}

ScaleIOVolumeSource представляє постійний том ScaleIO

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType є типом файлової системи для монтування. Має бути типом файлової системи, підтримуваним операційною системою хоста. Наприклад: "ext4", "xfs", "ntfs". Зазвичай — "xfs".</td>
    </tr>
    <tr>
      <td><code>gateway</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>gateway є адресою хоста ScaleIO API Gateway.</td>
    </tr>
    <tr>
      <td><code>protectionDomain</code><br/><em>string</em></td>
      <td>protectionDomain є назвою домену захисту ScaleIO для налаштованого сховища.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly стандартно — false (читання/запис). ReadOnly тут примусово встановить параметр ReadOnly у VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>secretRef</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef посилається на секрет для користувача ScaleIO та іншої конфіденційної інформації. Якщо це не надано, операція входу завершиться невдачею.</td>
    </tr>
    <tr>
      <td><code>sslEnabled</code><br/><em>boolean</em></td>
      <td>Прапорець <code>sslEnabled</code> вмикає/вимикає SSL-зʼєднання з Gateway, зазвичай — false</td>
    </tr>
    <tr>
      <td><code>storageMode</code><br/><em>string</em></td>
      <td>storageMode вказує, чи має сховище для тому бути ThickProvisioned або ThinProvisioned. Стандартно — ThinProvisioned.</td>
    </tr>
    <tr>
      <td><code>storagePool</code><br/><em>string</em></td>
      <td>storagePool є пулом сховища ScaleIO, повʼязаним із доменом захисту.</td>
    </tr>
    <tr>
      <td><code>system</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>system є назвою системи зберігання, налаштованої в ScaleIO.</td>
    </tr>
    <tr>
      <td><code>volumeName</code><br/><em>string</em></td>
      <td>volumeName є назвою тому, який вже створено в системі ScaleIO і який повʼязаний із цим джерелом тому.</td>
    </tr>
  </tbody>
</table>

## SeccompProfile {#SeccompProfile}

SeccompProfile визначає налаштування профілю seccomp для поду/контейнера. Може бути встановлено лише одне джерело профілю.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>localhostProfile</code><br/><em>string</em></td>
      <td>localhostProfile вказує, що слід використовувати профіль, визначений у файлі на вузлі. Профіль повинен бути попередньо налаштований на вузлі для роботи. Має бути низхідним шляхом, відносно налаштованого розташування профілю seccomp kubelet. Має бути встановлено, якщо type дорівнює "Localhost". Не повинно бути встановлено для будь-якого іншого типу.</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>type вказує, який тип профілю seccomp буде застосовано. Дійсні варіанти:
      <ul>
        <li>Localhost — слід використовувати профіль, визначений у файлі на вузлі.</li>
        <li>RuntimeDefault — слід використовувати стандартний для середовища виконання контейнера профіль.</li>
        <li>Unconfined — профіль не застосовується.</li>
      </ul>
      Можливі значення enum:
      <ul>
        <li><code>"Localhost"</code> вказує, що слід використовувати профіль, визначений у файлі на вузлі. Розташування файлу відносно &lt;kubelet-root-dir&gt;/seccomp.</li>
        <li><code>"RuntimeDefault"</code> представляє профіль seccomp стандартний для середовища виконання контейнера.</li>
        <li><code>"Unconfined"</code> вказує, що профіль seccomp не застосовується (так званий unconfined).</li>
      </ul>
    </td>
    </tr>
  </tbody>
</table>

## SecretEnvSource {#SecretEnvSource}

SecretEnvSource вибирає Secret для заповнення змінних середовища.

Вміст поля Data цільового Secret буде представляти пари ключ-значення як змінні середовища.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Назва референта. Це поле фактично обовʼязкове, але через зворотну сумісність дозволяється залишати його порожнім. Екземпляри цього типу з порожнім значенням тут майже напевно неправильні. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a></td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Вкажіть, чи повинен Secret бути визначений</td>
    </tr>
  </tbody>
</table>

## SecretKeySelector {#SecretKeySelector}

SecretKeySelector вибирає ключ із Secret.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Ключ секрету для вибору. Повинен бути дійсним ключем секрету.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Назва референта. Це поле фактично обовʼязкове, але через зворотну сумісність дозволяється залишати його порожнім. Екземпляри цього типу з порожнім значенням тут майже напевно неправильні. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a></td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Вкажіть, чи повинен Secret або його ключ бути визначений</td>
    </tr>
  </tbody>
</table>

## SecretProjection {#SecretProjection}

Перетворює секрет у проєкційний том.

Вміст поля Data цільового Secret буде представлений у проєкційному томі як файли, використовуючи ключі з поля Data як імена файлів. Зверніть увагу, що це ідентично джерелу тома секрету без режиму.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#KeyToPath" >}}">KeyToPath array</a></em></td>
      <td>items якщо не вказано, кожна пара ключ-значення в полі Data Secretʼу, на який є посилання, буде проєцюватись в том як файл, імʼя якого є ключем, а вміст — значенням. Якщо вказано, перелічені ключі будуть спроєцьовані в зазначені шляхи, а не перелічені ключі не будуть присутні. Якщо вказано ключ, якого немає в Secret, налаштування тому завершиться помилкою, якщо він не позначений як необовʼязковий. Шляхи повинні бути відносними і не можуть містити шлях '..' або починатися з '..'.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Назва референта. Це поле фактично обовʼязкове, але через зворотну сумісність дозволяється залишати його порожнім. Екземпляри цього типу з порожнім значенням тут майже напевно неправильні. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a></td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Вкажіть, чи повинен Secret або його ключ бути визначений</td>
    </tr>
  </tbody>
</table>

## SecretVolumeSource {#SecretVolumeSource}

Перетворює секрет у том.

Вміст поля Data цільового Secret буде представлений у томі як файли, використовуючи ключі з поля Data як імена файлів. Томи секретів підтримують управління власністю та переназначення міток SELinux.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>defaultMode</code><br/><em>integer</em></td>
      <td>defaultMode опціональним: біти режиму, які стандартно використовуються для встановлення дозволів на створені файли. Має бути вісімкове значення від 0000 до 0777 або десяткове значення від 0 до 511. YAML приймає як вісімкові, так і десяткові значення, JSON вимагає десяткові значення для бітів режиму. Стандартно — 0644. Теки всередині шляху не впливають на це налаштування. Це може конфліктувати з іншими параметрами, які впливають на режим файлу, наприклад fsGroup, і результатом можуть бути інші встановлені біти режиму.</td>
    </tr>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#KeyToPath" >}}">KeyToPath array</a></em></td>
      <td>items Якщо не вказано, кожна пара ключ-значення в полі Data Secretʼу, на який є посилання, буде проєцюватись в том як файл, імʼя якого є ключем, а вміст — значенням. Якщо вказано, перелічені ключі будуть спроєцьовані в зазначені шляхи, а не перелічені ключі не будуть присутні. Якщо вказано ключ, якого немає в Secret, налаштування тому завершиться помилкою, якщо він не позначений як необовʼязковий. Шляхи повинні бути відносними і не можуть містити шлях '..' або починатися з '..'.</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Вкажіть, чи повинен Secret або його ключ бути визначений</td>
    </tr>
    <tr>
      <td><code>secretName</code><br/><em>string</em></td>
      <td>secretName є назвою секрету в просторі імен пода, який слід використовувати. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#secret">https://kubernetes.io/docs/concepts/storage/volumes#secret</a></td>
    </tr>
  </tbody>
</table>

## SecurityContext {#SecurityContext}

SecurityContext містить конфігурацію безпеки, яка буде застосована до контейнера. Деякі поля присутні як у SecurityContext, так і у PodSecurityContext. Коли обидва встановлені, значення в SecurityContext мають пріоритет.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowPrivilegeEscalation</code><br/><em>boolean</em></td>
      <td>AllowPrivilegeEscalation контролює, чи може процес отримати більше привілеїв, ніж його батьківський процес. Цей булевий параметр безпосередньо контролює, чи буде встановлено прапорець no_new_privs для процесу контейнера. AllowPrivilegeEscalation завжди true, коли контейнер:
      <ol>
        <li>запущений як Privileged</li>
        <li>має CAP_SYS_ADMIN</li>
      </ol>
      Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>appArmorProfile</code><br/><em><a href="{{< ref "#AppArmorProfile" >}}">AppArmorProfile</a></em></td>
      <td>appArmorProfile є параметром AppArmor, який слід використовувати для цього контейнера. Якщо встановлено, цей профіль замінює appArmorProfile пода. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>capabilities</code><br/><em><a href="{{< ref "#Capabilities" >}}">Capabilities</a></em></td>
      <td>Можливості для додавання/видалення під час запуску контейнерів. За звичай використовується набір можливостей, наданих середовищем виконання контейнера. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>privileged</code><br/><em>boolean</em></td>
      <td>Запуск контейнера в привілейованому режимі. Процеси в привілейованих контейнерах фактично еквівалентні root на хості. Зазвичай — false. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>procMount</code><br/><em>string</em></td>
      <td>procMount позначає тип монтування proc, який слід використовувати для контейнерів. Стандартне значення — Default, яке використовує налаштування середовища виконання контейнера для шляхів лише для читання та замаскованих шляхів. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Default"</code> використовує налаштування середовища виконання контейнера для шляхів лише для читання та замаскованих шляхів для /proc. Більшість середовищ виконання контейнера маскують певні шляхи в /proc, щоб уникнути випадкового розкриття спеціальних пристроїв або інформації.</li>
        <li><code>"Unmasked"</code> обходить стандартну поведінку маскування середовища виконання контейнера і забезпечує, що новостворений /proc контейнера залишається незмінним без модифікацій.</li>
      </ul>
      </td>
    </tr>
    <tr>
      <td><code>readOnlyRootFilesystem</code><br/><em>boolean</em></td>
      <td>Чи має цей контейнер файлову систему root лише для читання. Стандартно — false. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>runAsGroup</code><br/><em>integer</em></td>
      <td>GID для запуску точки входу процесу контейнера. Використовує стандартне значення середовища виконання, якщо не встановлено. Може також бути встановлено в PodSecurityContext. Якщо встановлено як у SecurityContext, так і в PodSecurityContext, перевага надається значенню, вказаному в SecurityContext. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>runAsNonRoot</code><br/><em>boolean</em></td>
      <td>Вказує, що контейнер повинен запускатися не від імені root. Якщо true, Kubelet перевірить образ під час виконання, щоб переконатися, що він не запускається з UID 0 (root), і не вдасться запустити контейнер, якщо це так. Якщо не встановлено або false, така перевірка не проводиться. Може також бути встановлено в PodSecurityContext. Якщо встановлено як у SecurityContext, так і в PodSecurityContext, перевага надається значенню, вказаному в SecurityContext.</td>
    </tr>
    <tr>
      <td><code>runAsUser</code><br/><em>integer</em></td>
      <td>UID для запуску точки входу процесу контейнера. Використовує стандартне значення середовища виконання, якщо не встановлено. Може також бути встановлено в PodSecurityContext. Якщо встановлено як у SecurityContext, так і в PodSecurityContext, перевага надається значенню, вказаному в SecurityContext. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>seLinuxOptions</code><br/><em><a href="{{< ref "#SELinuxOptions" >}}">SELinuxOptions</a></em></td>
      <td>SELinux контекст, який буде застосовано до контейнера. Якщо не вказано, середовище виконання контейнера виділить випадковий SELinux контекст для кожного контейнера. Може також бути встановлено в PodSecurityContext. Якщо встановлено як у SecurityContext, так і в PodSecurityContext, перевага надається значенню, вказаному в SecurityContext. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>seccompProfile</code><br/><em><a href="{{< ref "#SeccompProfile" >}}">SeccompProfile</a></em></td>
      <td>Параметри seccomp, які використовуються цим контейнером. Якщо параметри seccomp надаються як на рівні пода, так і на рівні контейнера, параметри контейнера переважають над параметрами пода. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є windows.</td>
    </tr>
    <tr>
      <td><code>windowsOptions</code><br/><em><a href="{{< ref "#WindowsSecurityContextOptions" >}}">WindowsSecurityContextOptions</a></em></td>
      <td>Специфічні для Windows налаштування, які застосовуються до всіх контейнерів. Якщо не вказано, будуть використані параметри з PodSecurityContext. Якщо встановлено як у SecurityContext, так і в PodSecurityContext, перевага надається значенню, вказаному в SecurityContext. Зверніть увагу, що це поле не можна встановлювати, коли spec.os.name є linux.</td>
    </tr>
  </tbody>
</table>

## ServiceAccountTokenProjection {#ServiceAccountTokenProjection}

ServiceAccountTokenProjection представляє спроєцьований том токенів службового облікового запису. Цей спроєцьований том можна використовувати для вставлення токенів службового облікового запису у файлову систему подів для використання з API (Kubernetes API Server або інших).

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>audience</code><br/><em>string</em></td>
      <td>audience є призначеною аудиторією токена. Отримувач токена повинен ідентифікувати себе за допомогою ідентифікатора, вказаного в аудиторії токена, інакше слід відхилити токен. Стандартно аудиторія встановлюється як ідентифікатор apiserver.</td>
    </tr>
    <tr>
      <td><code>expirationSeconds</code><br/><em>integer</em></td>
      <td>expirationSeconds є запитуваною тривалістю дії токена службового облікового запису. Коли токен наближається до закінчення терміну дії, втулок томів kubelet буде проактивно оновлювати токен службового облікового запису. Kubelet почне намагатися оновити токен, якщо токен старший за 80 відсотків свого часу життя або якщо токен старший за 24 години. Стандартне значення становить 1 годину і має бути не менше 10 хвилин.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>path є шляхом відносно точки монтування файлу, куди буде вставлено токен.</td>
    </tr>
  </tbody>
</table>

## SleepAction {#SleepAction}

SleepAction описує дію "sleep".

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>seconds</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>Seconds є кількістю секунд для сну.</td>
    </tr>
  </tbody>
</table>

## StorageOSVolumeSource {#StorageOSVolumeSource}

Представляє ресурс постійного тома StorageOS.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType є типом файлової системи для монтування. Має бути тип файлової системи, підтримуваний операційною системою хоста. Наприклад, "ext4", "xfs", "ntfs". Якщо не вказано, неявно вважається "ext4".</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly стандартно встановлено в false (читання/запис). ReadOnly тут примусово встановить параметр ReadOnly у VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef вказує секрет для отримання облікових даних API StorageOS. Якщо не вказано, будуть використані стандартні значення.</td>
    </tr>
    <tr>
      <td><code>volumeName</code><br/><em>string</em></td>
      <td>volumeName є зрозумілим для людини імʼям тома StorageOS. Імена томів унікальні лише в межах простору імен.</td>
    </tr>
    <tr>
      <td><code>volumeNamespace</code><br/><em>string</em></td>
      <td>volumeNamespace вказує область дії тома в межах StorageOS. Якщо простір імен не вказано, буде використано простір імен пода. Це дозволяє відобразити іменування Kubernetes у StorageOS для тіснішої інтеграції. Встановіть VolumeName на будь-яке імʼя, щоб перевизначити стандартну поведінку. Встановіть на "default", якщо ви не використовуєте простори імен у StorageOS. Простори імен, які не існують у StorageOS, будуть створені.</td>
    </tr>
  </tbody>
</table>

## Sysctl {#Sysctl}

Sysctl визначає параметр ядра, який потрібно встановити

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Назва властивості для встановлення</td>
    </tr>
    <tr>
      <td><code>value</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Значення властивості для встановлення</td>
    </tr>
  </tbody>
</table>

## TCPSocketAction {#TCPSocketAction}

TCPSocketAction описує дію на основі відкриття сокета

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>host</code><br/><em>string</em></td>
      <td>Опційно: Імʼя хосту для підключення, зазвичай використовується IP пода.</td>
    </tr>
    <tr>
      <td><code>port</code>&nbsp;<strong>*</strong><br/><em></em></td>
      <td>Номер або імʼя порту для доступу до контейнера. Номер повинен бути в діапазоні від 1 до 65535. Імʼя повинно бути IANA_SVC_NAME.</td>
    </tr>
  </tbody>
</table>

## TopologySpreadConstraint {#TopologySpreadConstraint}

TopologySpreadConstraint визначає, як розподіляти відповідні поди серед заданої топології.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>labelSelector</code><br/><em><a href="{{< ref "../definitions/label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>LabelSelector використовується для пошуку відповідних подів. Поди, які відповідають цьому селектору міток, враховуються для визначення кількості подів у їх відповідному топологічному домені.</td>
    </tr>
    <tr>
      <td><code>matchLabelKeys</code><br/><em>string array</em></td>
      <td>MatchLabelKeys є набором ключів міток подів для вибору подів, для яких буде обчислюватися розподіл. Ключі використовуються для пошуку значень у мітках вхідного пода, ці ключ-значення мітки обʼєднуються з labelSelector для вибору групи наявних подів, для яких буде обчислюватися розподіл для вхідного пода. Один і той же ключ заборонено використовувати як у MatchLabelKeys, так і в LabelSelector. MatchLabelKeys не можна встановлювати, якщо LabelSelector не встановлено. Ключі, яких немає в мітках вхідного пода, будуть ігноруватися. Null або порожній список означає, що буде враховуватися лише labelSelector. Це бета-поле і вимагає увімкнення функціональної можливості MatchLabelKeysInPodTopologySpread (стандартно увімкнено).</td>
    </tr>
    <tr>
      <td><code>maxSkew</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>MaxSkew описує ступінь нерівномірного розподілу подів. Коли <code>whenUnsatisfiable=DoNotSchedule</code>, це максимальна дозволена різниця між кількістю відповідних подів у цільовій топології та глобальним мінімумом. Глобальний мінімум — це мінімальна кількість відповідних подів у допустимому домені або нуль, якщо кількість допустимих доменів менша за MinDomains. Наприклад, у кластері з 3 зонами, MaxSkew встановлено на 1, а поди з однаковим labelSelector розподілені як 2/2/1: У цьому випадку глобальний мінімум дорівнює 1.
      <br/><br/>
  {{< mermaid >}}
  graph TD;

  subgraph zone3["zone 3"]
          P3_1("Pod")
  end
  subgraph zone2["zone 2"]
          P2_1("Pod")
          P2_2("Pod")
  end
  subgraph zone1["zone 1"]
          P1_1("Pod")
          P1_2("Pod")
  end

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class P1_1,P1_2,P2_1,P2_2,P3_1 k8s;
  class zone1,zone2,zone3 cluster;
  {{</ mermaid >}}
      <ul>
        <li>якщо MaxSkew дорівнює 1, вхідний под може бути запланований лише в zone3, щоб стати 2/2/2; планування його в zone1(zone2) порушить MaxSkew(1).</li>
        <li>якщо MaxSkew дорівнює 2, вхідний под може бути запланований у будь-яку з зон. Коли <code>whenUnsatisfiable=ScheduleAnyway</code>, це використовується для надання більш високого пріоритету топологіям, які його задовольняють. Це обовʼязкове поле. Стандартне значення — 1, а 0 не допускається.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>minDomains</code><br/><em>integer</em></td>
      <td>MinDomains вказує мінімальну кількість допустимих доменів. Коли кількість допустимих доменів з відповідними ключами топології менша за minDomains, Pod Topology Spread розглядає "глобальний мінімум" як 0, а потім виконується обчислення Skew. Коли кількість допустимих доменів з відповідними ключами топології дорівнює або перевищує minDomains, це значення не впливає на планування. В результаті, коли кількість допустимих доменів менша за minDomains, планувальник не буде планувати більше maxSkew Pod у ці домени. Якщо значення nil, обмеження поводиться так, ніби MinDomains дорівнює 1. Допустимі значення — це цілі числа більше 0. Коли значення не nil, WhenUnsatisfiable має бути DoNotSchedule. Наприклад, у кластері з 3 зонами, MaxSkew встановлено на 2, MinDomains встановлено на 5, а поди з тим самим labelSelector розподілені як 2/2/2:
      <br/><br/>
  {{< mermaid >}}
  graph TD;

  subgraph zone3["zone 3"]
          P3_1("Pod")
          P3_2("Pod")
  end
  subgraph zone2["zone 2"]
          P2_1("Pod")
          P2_2("Pod")
  end
  subgraph zone1["zone 1"]
          P1_1("Pod")
          P1_2("Pod")
  end

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class P1_1,P1_2,P2_1,P2_2,P3_1,P3_2 k8s;
  class zone1,zone2,zone3 cluster;
  {{</ mermaid >}}
      Кількість доменів менша за 5(MinDomains), тому "глобальний мінімум" розглядається як 0. У цій ситуації новий под з тим самим labelSelector не може бути запланований, оскільки обчислений skew буде 3 (3 - 0), якщо новий Pod буде запланований у будь-яку з трьох зон, це порушить MaxSkew.</td>
    </tr>
    <tr>
      <td><code>nodeAffinityPolicy</code><br/><em>string</em></td>
      <td>NodeAffinityPolicy вказує, як ми будемо обробляти nodeAffinity/nodeSelector пода при обчисленні перекосу топології пода. Варіанти:
      <ul>
        <li>Honor: тільки вузли, що відповідають nodeAffinity/nodeSelector, включаються до розрахунків.</li>
        <li>Ignore: nodeAffinity/nodeSelector ігноруються. Всі вузли включені до розрахунків.</li>
      </ul>
      <p>Якщо це значення дорівнює nil, поведінка еквівалентна політиці Honor.</p>
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Honor"</code> означає використовувати цю директиву планування при обчисленні перекосу топології пода.</li>
        <li><code>"Ignore"</code> означає ігнорувати цю директиву планування при обчисленні перекосу топології пода.</li>
      </ul>
    </tr>
    <tr>
      <td><code>nodeTaintsPolicy</code><br/><em>string</em></td>
      <td>NodeTaintsPolicy вказує, як ми будемо обробляти node taints при обчисленні перекосу топології пода. Варіанти:
      <ul>
        <li>Honor: вузли без taints, а також вузли з taints, для яких вхідний под має toleration, включаються до розрахунків.</li>
        <li>Ignore: node taints ігноруються. Всі вузли включені до розрахунків.</li>
      </ul>
      <p>Якщо це значення дорівнює nil, поведінка еквівалентна політиці Ignore.</p>
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Honor"</code> означає використовувати цю директиву планування при обчисленні перекосу топології пода.</li>
        <li><code>"Ignore"</code> означає ігнорувати цю директиву планування при обчисленні перекосу топології пода.</li>
      </ul>
    </tr>
    <tr>
      <td><code>topologyKey</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>TopologyKey є ключем міток вузлів. Вузли, які мають мітку з цим ключем і однаковими значеннями, вважаються частиною однієї топології. Ми розглядаємо кожну пару &lt;ключ, значення&gt; як "кошик" і намагаємося розподілити поди рівномірно між кошиками. Ми визначаємо домен як конкретний екземпляр топології. Також ми визначаємо допустимий домен як домен, вузли якого відповідають вимогам nodeAffinityPolicy і nodeTaintsPolicy. Наприклад, якщо TopologyKey дорівнює "kubernetes.io/hostname", кожен вузол є доменом цієї топології. А якщо TopologyKey дорівнює "topology.kubernetes.io/zone", кожна зона є доменом цієї топології. Це обовʼязкове поле.</td>
    </tr>
    <tr>
      <td><code>whenUnsatisfiable</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>WhenUnsatisfiable вказує, як діяти з подом, якщо він не задовольняє обмеження розподілу.
      <ul>
        <li>DoNotSchedule (стандартно) вказує планувальнику не планувати його.</li>
        <li>ScheduleAnyway вказує планувальнику розмістити под у будь-якому місці, але надаючи вищий пріоритет топологіям, які допоможуть зменшити перекіс. Обмеження вважається "Невиконуваним" для вхідного пода лише тоді, коли кожне можливе призначення вузла для цього пода порушує "MaxSkew" на деякій топології. Наприклад, у кластері з 3 зонами, MaxSkew встановлено на 1, і поди з тим самим labelSelector розподіляються як 3/1/1:</li>
      </ul>
  {{< mermaid >}}
  graph TD;

  subgraph zone3["zone 3"]
          P3_1("Pod")
  end
  subgraph zone2["zone 2"]
          P2_1("Pod")
  end
  subgraph zone1["zone 1"]
          P1_1("Pod")
          P1_2("Pod")
          P1_3("Pod")
  end

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class P1_1,P1_2,P1_3,P2_1,P3_1 k8s;
  class zone1,zone2,zone3 cluster;
  {{</ mermaid >}}
      Якщо WhenUnsatisfiable встановлено на DoNotSchedule, вхідний под може бути запланований лише в zone2(zone3), щоб стати 3/2/1(3/1/2), оскільки ActualSkew(2-1) на zone2(zone3) задовольняє MaxSkew(1). Іншими словами, кластер все ще може бути незбалансованим, але планувальник не зробить його <em>більш</em> незбалансованим. Це обовʼязкове поле.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"DoNotSchedule"</code> вказує планувальнику не планувати под, коли обмеження не задовольняються.</li>
        <li><code>"ScheduleAnyway"</code> вказує планувальнику планувати под навіть якщо обмеження не задовольняються.</li>
      </ul>
    </tr>
  </tbody>
</table>

## Volume {#Volume}

Volume представляє іменований том у поді, до якого може отримати доступ будь-який контейнер у поді.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>awsElasticBlockStore</code><br/><em><a href="{{< ref "persistent-volume-v1#AWSElasticBlockStoreVolumeSource" >}}">AWSElasticBlockStoreVolumeSource</a></em></td>
      <td>awsElasticBlockStore представляє ресурс диска AWS, який підключається до хост-машини kubelet і потім надається поду. Застаріло: AWSElasticBlockStore застаріло. Всі операції для типу вбудованого awsElasticBlockStore перенаправляються до CSI драйвера ebs.csi.aws.com. Детальніше: <a href="/uk/docs/concepts/storage/volumes#awselasticblockstore">https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore</a></td>
    </tr>
    <tr>
      <td><code>azureDisk</code><br/><em><a href="{{< ref "persistent-volume-v1#AzureDiskVolumeSource" >}}">AzureDiskVolumeSource</a></em></td>
      <td>azureDisk представляє монтування диска Azure Data на хості та привʼязку до пода. Застаріло: AzureDisk застаріло. Всі операції для типу вбудованого azureDisk перенаправляються до CSI драйвера disk.csi.azure.com.</td>
    </tr>
    <tr>
      <td><code>azureFile</code><br/><em><a href="{{< ref "#AzureFileVolumeSource" >}}">AzureFileVolumeSource</a></em></td>
      <td>azureFile представляє монтування Azure File Service на хості та привʼязку до пода. Застаріло: AzureFile застаріло. Всі операції для типу вбудованого azureFile перенаправляються до CSI драйвера file.csi.azure.com.</td>
    </tr>
    <tr>
      <td><code>cephfs</code><br/><em><a href="{{< ref "#CephFSVolumeSource" >}}">CephFSVolumeSource</a></em></td>
      <td>cephFS представляє монтування Ceph FS на хості, яке спільно використовує життєвий цикл пода. Застаріло: CephFS застаріло, і тип cephfs більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>cinder</code><br/><em><a href="{{< ref "#CinderVolumeSource" >}}">CinderVolumeSource</a></em></td>
      <td>cinder представляє том cinder, підключений і змонтований на хості kubelet. Застаріло: Cinder застаріло. Всі операції для типу вбудованого cinder перенаправляються до CSI драйвера cinder.csi.openstack.org. Детальніше: <a href="https://examples.k8s.io/mysql-cinder-pd/README.md">https://examples.k8s.io/mysql-cinder-pd/README.md</a></td>
    </tr>
    <tr>
      <td><code>configMap</code><br/><em><a href="{{< ref "#ConfigMapVolumeSource" >}}">ConfigMapVolumeSource</a></em></td>
      <td>configMap представляє configMap, який повинен заповнити цей том</td>
    </tr>
    <tr>
      <td><code>csi</code><br/><em><a href="{{< ref "#CSIVolumeSource" >}}">CSIVolumeSource</a></em></td>
      <td>csi (Container Storage Interface) представляє тимчасове сховище, яке обробляється певними зовнішніми CSI драйверами.</td>
    </tr>
    <tr>
      <td><code>downwardAPI</code><br/><em><a href="{{< ref "#DownwardAPIVolumeSource" >}}">DownwardAPIVolumeSource</a></em></td>
      <td>downwardAPI представляє downward API, що стосується пода, який повинен заповнити цей том</td>
    </tr>
    <tr>
      <td><code>emptyDir</code><br/><em><a href="{{< ref "#EmptyDirVolumeSource" >}}">EmptyDirVolumeSource</a></em></td>
      <td>emptyDir представляє тимчасова тека, який спільно використовує життєвий цикл пода. Детальніше: <a href="/uk/docs/concepts/storage/volumes#emptydir">https://kubernetes.io/docs/concepts/storage/volumes#emptydir</a></td>
    </tr>
    <tr>
      <td><code>ephemeral</code><br/><em><a href="{{< ref "#EphemeralVolumeSource" >}}">EphemeralVolumeSource</a></em></td>
      <td>ephemeral представляє том, який обробляється драйвером сховища кластера. Життєвий цикл тому повʼязаний з подом, який його визначає — він буде створений перед запуском пода і видалений після його видалення. Використовуйте це, якщо:
      <ol type="a">
        <li>том потрібен лише під час роботи пода</li>
        <li>потрібні функції звичайних томів, такі як відновлення зі знімка або відстеження ємності</li>
        <li>драйвер сховища вказаний через клас сховища</li>
        <li>драйвер сховища підтримує динамічне створення томів через PersistentVolumeClaim (див. EphemeralVolumeSource для отримання додаткової інформації про звʼязок між цим типом тому та PersistentVolumeClaim)</li>
      </ol>
      Використовуйте PersistentVolumeClaim або один із специфічних для постачальника API для томів, які зберігаються довше, ніж життєвий цикл окремого пода. Використовуйте CSI для легких локальних ефермерних томів, якщо драйвер CSI призначений для такого використання, див. документацію драйвера для отримання додаткової інформації. Под може використовувати обидва типи ефермерних і постійних томів одночасно.</td>
    </tr>
    <tr>
      <td><code>fc</code><br/><em><a href="{{< ref "persistent-volume-v1#FCVolumeSource" >}}">FCVolumeSource</a></em></td>
      <td>fc представляє ресурс Fibre Channel, який підключається до хост-машини kubelet і потім надається поду.</td>
    </tr>
    <tr>
      <td><code>flexVolume</code><br/><em><a href="{{< ref "#FlexVolumeSource" >}}">FlexVolumeSource</a></em></td>
      <td>flexVolume представляє загальний ресурс тому, який надається/підключається за допомогою втулка на основі exec. Застаріло: FlexVolume застаріло. Розгляньте можливість використання CSIDriver замість цього.</td>
    </tr>
    <tr>
      <td><code>flocker</code><br/><em><a href="{{< ref "persistent-volume-v1#FlockerVolumeSource" >}}">FlockerVolumeSource</a></em></td>
      <td>flocker представляє том Flocker, підключений до хост-машини kubelet. Це залежить від того, що сервіс керування Flocker працює. Застаріло: Flocker застаріло, і вбудований тип flocker більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>gcePersistentDisk</code><br/><em><a href="{{< ref "persistent-volume-v1#GCEPersistentDiskVolumeSource" >}}">GCEPersistentDiskVolumeSource</a></em></td>
      <td>gcePersistentDisk представляє ресурс GCE Disk, який підключається до хост-машини kubelet і потім надається поду. Застаріло: GCEPersistentDisk застаріло. Всі операції для вбудованого типу gcePersistentDisk перенаправляються на драйвер CSI pd.csi.storage.gke.io. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#gcepersistentdisk">https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk</a></td>
    </tr>
    <tr>
      <td><code>gitRepo</code><br/><em><a href="{{< ref "#GitRepoVolumeSource" >}}">GitRepoVolumeSource</a></em></td>
      <td>gitRepo представляє репозиторій git на певній ревізії. Застаріло: GitRepo застаріло. Щоб забезпечити контейнер репозиторієм git, змонтуйте EmptyDir у InitContainer, який клонує репозиторій за допомогою git, а потім змонтуйте EmptyDir у контейнер Pod.</td>
    </tr>
    <tr>
      <td><code>glusterfs</code><br/><em><a href="{{< ref "#GlusterfsVolumeSource" >}}">GlusterfsVolumeSource</a></em></td>
      <td>glusterfs представляє монтування Glusterfs на хості, яке ділить життєвий цикл пода. Застаріло: Glusterfs застаріло, і вбудований тип glusterfs більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>hostPath</code><br/><em><a href="{{< ref "persistent-volume-v1#HostPathVolumeSource" >}}">HostPathVolumeSource</a></em></td>
      <td>hostPath представляє попередньо наявний файл або теку на хост-машині, який безпосередньо відкривається для контейнера. Це зазвичай використовується для системних агентів або інших привілейованих речей, яким дозволено бачити хост-машину. Більшість контейнерів НЕ потребують цього. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#hostpath">https://kubernetes.io/docs/concepts/storage/volumes#hostpath</a></td>
    </tr>
    <tr>
      <td><code>image</code><br/><em><a href="{{< ref "#ImageVolumeSource" >}}">ImageVolumeSource</a></em></td>
      <td>image представляє обʼєкт OCI (контейнерний образ або артефакт), який отримується та монтується на хост-машині kubelet. Том визначається під час запуску пода залежно від значення PullPolicy:
      <ul>
        <li>Always: kubelet завжди намагається отримати обʼєкт за посиланням. Створення контейнера зазнає невдачі, якщо витягування не вдається.</li>
        <li>Never: kubelet ніколи не намагається отримати обʼєкт за посиланням і використовує лише локальний образ або артефакт. Створення контейнера зазнає невдачі, якщо посилання відсутнє.</li>
        <li>IfNotPresent: kubelet отримує обʼєкт, якщо він ще не присутній на диску. Створення контейнера зазнає невдачі, якщо посилання відсутнє і отримання не вдається.</li>
      </ul>
      Том повторно визначається, якщо под видаляється та створюється заново, що означає, що новий віддалений вміст стане доступним при повторному створенні пода. Невдача при визначенні або отриманні образу під час запуску пода заблокує запуск контейнерів і може додати значну затримку. Невдачі будуть повторюватися з використанням звичайної затримки для томів і про це буде повідомлено у причинах та повідомленнях пода. Типи обʼєктів, які можуть бути змонтовані цим томом, визначаються реалізацією середовища виконання контейнера на хост-машині і, як мінімум, повинні включати всі дійсні типи, підтримувані полем контейнерного образу. Обʼєкт OCI монтується в одній теці (spec.containers[*].volumeMounts.mountPath) шляхом обʼєднання шарів маніфесту так само, як для контейнерних образів. Том буде змонтований лише для читання (ro). Субшляхи для контейнерів не підтримуються (spec.containers[*].volumeMounts.subpath) до версії 1.33. Поле spec.securityContext.fsGroupChangePolicy не впливає на цей тип тому.</td>
    </tr>
    <tr>
      <td><code>iscsi</code><br/><em><a href="{{< ref "#ISCSIVolumeSource" >}}">ISCSIVolumeSource</a></em></td>
      <td>iscsi представляє ресурс ISCSI Disk, який підключається до хост-машини kubelet і потім надається поду. Більше інформації: <a href="/uk/docs/concepts/storage/volumes/#iscsi">https://kubernetes.io/docs/concepts/storage/volumes/#iscsi</a></td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>імʼя тому. Повинно бути DNS_LABEL і унікальним в межах пода. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a></td>
    </tr>
    <tr>
      <td><code>nfs</code><br/><em><a href="{{< ref "persistent-volume-v1#NFSVolumeSource" >}}">NFSVolumeSource</a></em></td>
      <td>nfs представляє NFS-монтування на хості, яке використовує життєвий цикл пода. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#nfs">https://kubernetes.io/docs/concepts/storage/volumes#nfs</a></td>
    </tr>
    <tr>
      <td><code>persistentVolumeClaim</code><br/><em><a href="{{< ref "#PersistentVolumeClaimVolumeSource" >}}">PersistentVolumeClaimVolumeSource</a></em></td>
      <td>persistentVolumeClaimVolumeSource представляє посилання на PersistentVolumeClaim в тому ж просторі імен. Більше інформації: <a href="/uk/docs/concepts/storage/persistent-volumes#persistentvolumeclaims">https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims</a></td>
    </tr>
    <tr>
      <td><code>photonPersistentDisk</code><br/><em><a href="{{< ref "persistent-volume-v1#PhotonPersistentDiskVolumeSource" >}}">PhotonPersistentDiskVolumeSource</a></em></td>
      <td>photonPersistentDisk представляє постійний диск PhotonController, підключений і змонтований на хості kubelet. Застаріло: PhotonPersistentDisk застарів, і тип photonPersistentDisk більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>portworxVolume</code><br/><em><a href="{{< ref "persistent-volume-v1#PortworxVolumeSource" >}}">PortworxVolumeSource</a></em></td>
      <td>portworxVolume представляє том Portworx, підключений і змонтований на хості kubelet. Застаріло: PortworxVolume застарів. Всі операції для типу portworxVolume в дереві перенаправляються на драйвер CSI pxd.portworx.com.</td>
    </tr>
    <tr>
      <td><code>projected</code><br/><em><a href="{{< ref "#ProjectedVolumeSource" >}}">ProjectedVolumeSource</a></em></td>
      <td>спроєцьовані елементи для всіх ресурсів в одному: secrets, configmaps та downward API</td>
    </tr>
    <tr>
      <td><code>quobyte</code><br/><em><a href="{{< ref "persistent-volume-v1#QuobyteVolumeSource" >}}">QuobyteVolumeSource</a></em></td>
      <td>quobyte представляє монтування Quobyte на хості, яке використовує життєвий цикл пода. Застаріло: Quobyte застарів, і тип quobyte більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>rbd</code><br/><em><a href="{{< ref "#RBDVolumeSource" >}}">RBDVolumeSource</a></em></td>
      <td>rbd представляє монтування Rados Block Device на хості, яке використовує життєвий цикл пода. Застаріло: RBD застарів, і тип rbd більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>scaleIO</code><br/><em><a href="{{< ref "#ScaleIOVolumeSource" >}}">ScaleIOVolumeSource</a></em></td>
      <td>scaleIO представляє постійний том ScaleIO, підключений і змонтований на вузлах Kubernetes. Застаріло: ScaleIO застарів, і тип scaleIO більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>secret</code><br/><em><a href="{{< ref "#SecretVolumeSource" >}}">SecretVolumeSource</a></em></td>
      <td>secret представляє секрет, який повинен заповнювати цей том. Більше інформації: <a href="/uk/docs/concepts/storage/volumes#secret">https://kubernetes.io/docs/concepts/storage/volumes#secret</a></td>
    </tr>
    <tr>
      <td><code>storageos</code><br/><em><a href="{{< ref "#StorageOSVolumeSource" >}}">StorageOSVolumeSource</a></em></td>
      <td>storageOS представляє том StorageOS, підключений і змонтований на вузлах Kubernetes. Застаріло: StorageOS застарів, і тип storageos більше не підтримується.</td>
    </tr>
    <tr>
      <td><code>vsphereVolume</code><br/><em><a href="{{< ref "persistent-volume-v1#VsphereVirtualDiskVolumeSource" >}}">VsphereVirtualDiskVolumeSource</a></em></td>
      <td>vsphereVolume представляє том vSphere, підключений і змонтований на хості kubelet. Застаріло: VsphereVolume застарів. Всі операції для типу vsphereVolume в дереві перенаправляються на драйвер CSI csi.vsphere.vmware.com.</td>
    </tr>
  </tbody>
</table>

## VolumeDevice {#VolumeDevice}

volumeDevice описує зіставлення сирого блочного пристрою всередині контейнера.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>devicePath</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>devicePath є шляхом всередині контейнера, до якого буде змонтовано пристрій.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name повинен відповідати імені persistentVolumeClaim у поді</td>
    </tr>
  </tbody>
</table>

## VolumeMount {#VolumeMount}

VolumeMount описує монтування тому всередині контейнера.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>mountPath</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Шлях всередині контейнера, до якого буде змонтовано том. Не повинен містити ':'.</td>
    </tr>
    <tr>
      <td><code>mountPropagation</code><br/><em>string</em></td>
      <td>mountPropagation визначає, як монтування поширюються від хоста до контейнера і навпаки. Якщо не встановлено, використовується MountPropagationNone. Це поле є бета-версією в 1.10. Коли RecursiveReadOnly встановлено на IfPossible або Enabled, MountPropagation повинен бути None або невизначеним (що зазвичай дорівнює None).
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Bidirectional"</code> означає, що том у контейнері буде отримувати нові монтування від хоста або інших контейнерів, а його власні монтування будуть поширюватися від контейнера до хоста або інших контейнерів. Зверніть увагу, що цей режим рекурсивно застосовується до всіх монтувань у томі ("rshared" у термінології Linux).</li>
        <li><code>"HostToContainer"</code> означає, що том у контейнері буде отримувати нові монтування від хоста або інших контейнерів, але файлові системи, змонтовані всередині контейнера, не будуть поширюватися на хост або інші контейнери. Зверніть увагу, що цей режим рекурсивно застосовується до всіх монтувань у томі ("rslave" у термінології Linux).</li>
        <li><code>"None"</code> означає, що том у контейнері не буде отримувати нові монтування від хоста або інших контейнерів, і файлові системи, змонтовані всередині контейнера, не будуть поширюватися на хост або інші контейнери. Зверніть увагу, що цей режим відповідає "private" у термінології Linux.</li>
      </ul>
    </td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Поле має збігатись з Name у Volume.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>Монтується тільки для читання, якщо true, для читання та запису в іншому випадку (false або не вказано). Зазвичай — false.</td>
    </tr>
    <tr>
      <td><code>recursiveReadOnly</code><br/><em>string</em></td>
      <td>RecursiveReadOnly визначає, чи повинні монтування тільки для читання оброблятися рекурсивно. Якщо ReadOnly встановлено у false, це поле не має значення і повинно бути невказаним. Якщо ReadOnly встановлено в true, і це поле встановлено в Disabled, монтування не робиться рекурсивно тільки для читання. Якщо це поле встановлено в IfPossible, монтування робиться рекурсивно тільки для читання, якщо це підтримується середовищем виконання контейнера. Якщо це поле встановлено в Enabled, монтування робиться рекурсивно тільки для читання, якщо це підтримується середовищем виконання контейнера, інакше под не буде запущено, і буде згенеровано помилку для вказання причини. Якщо це поле встановлено в IfPossible або Enabled, MountPropagation повинно бути встановлено в None (або бути невказаним, що зазвичай дорівнює None). Якщо це поле не вказано, воно розглядається як еквівалент Disabled.</td>
    </tr>
    <tr>
      <td><code>subPath</code><br/><em>string</em></td>
      <td>Шлях всередині тому, з якого повинен бути змонтований том контейнера. Зазвичай — "" (корінь тому).</td>
    </tr>
    <tr>
      <td><code>subPathExpr</code><br/><em>string</em></td>
      <td>Розширений шлях всередині тому, з якого повинен бути змонтований том контейнера. Поводиться аналогічно до SubPath, але посилання на змінні середовища $(VAR_NAME) розширюються за допомогою середовища контейнера. Зазвичай — "" (корінь тому). SubPathExpr і SubPath взаємовиключні.</td>
    </tr>
  </tbody>
</table>

## VolumeProjection {#VolumeProjection}

Проєкція яка може бути спроєцьована разом з іншими підтримуваними типами томів. Повинно бути встановлено тільки одне з цих полів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>clusterTrustBundle</code><br/><em><a href="{{< ref "#ClusterTrustBundleProjection" >}}">ClusterTrustBundleProjection</a></em></td>
      <td>ClusterTrustBundle дозволяє поду отримувати доступ до поля <code>.spec.trustBundle</code> обʼєктів ClusterTrustBundle у файлі з автоматичним оновленням. Альфа, керується функціональною можливістю ClusterTrustBundleProjection. Обʼєкти ClusterTrustBundle можна вибирати за назвою або за комбінацією імені підписувача та селектора міток. Kubelet виконує агресивну нормалізацію вмісту PEM, записаного в файлову систему пода. Езотеричні функції PEM, такі як коментарі між блоками та заголовки блоків, видаляються. Сертифікати дедуплікуються. Порядок сертифікатів у файлі довільний, і Kubelet може змінювати порядок з часом.</td>
    </tr>
    <tr>
      <td><code>configMap</code><br/><em><a href="{{< ref "#ConfigMapProjection" >}}">ConfigMapProjection</a></em></td>
      <td>Інформація про дані configMap для проєкції</td>
    </tr>
    <tr>
      <td><code>downwardAPI</code><br/><em><a href="{{< ref "#DownwardAPIProjection" >}}">DownwardAPIProjection</a></em></td>
      <td>Інформація про дані downwardAPI для проєкції</td>
    </tr>
    <tr>
      <td><code>podCertificate</code><br/><em><a href="{{< ref "#PodCertificateProjection" >}}">PodCertificateProjection</a></em></td>
      <td>Проєкція автоматично оновлюваного набору облікових даних (приватний ключ і ланцюжок сертифікатів), який под може використовувати як TLS-клієнт або сервер. Kubelet генерує приватний ключ і використовує його для надсилання PodCertificateRequest до вказаного підписувача. Після того як підписувач схвалить запит і видасть ланцюжок сертифікатів, Kubelet записує ключ і ланцюжок сертифікатів у файлову систему пода. Под не запускається, поки сертифікати не будуть видані для кожного джерела тома podCertificate у його специфікації. Kubelet почне намагатися оновити сертифікат у час, вказаний підписувачем, використовуючи PodCertificateRequest.Status.BeginRefreshAt timestamp. Kubelet може записати один файл, вказаний у полі credentialBundlePath, або окремі файли, вказані у полях keyPath і certificateChainPath. Набір облікових даних є одним файлом у форматі PEM. Перший запис PEM є приватним ключем (у форматі PKCS#8), а решта записів PEM є ланцюжком сертифікатів, виданих підписувачем (зазвичай підписувачі повертають свій ланцюжок сертифікатів у порядку від листа до кореня). Рекомендується використовувати формат набору облікових даних, оскільки код вашого застосунку може читати його атомарно. Якщо ви використовуєте keyPath і certificateChainPath, ваш застосунок повинен виконати два окремі читання файлів. Якщо це збігається з оновленням сертифіката, можливо, що приватний ключ і сертифікат листа, які ви читаєте, можуть не відповідати один одному. Вашому застосунку потрібно перевірити цю умову і перечитати, поки вони не будуть узгоджені. Вказаний підписувач контролює формат сертифіката, який він видає; зверніться до документації реалізації підписувача, щоб дізнатися, як використовувати видані сертифікати.</td>
    </tr>
    <tr>
      <td><code>secret</code><br/><em><a href="{{< ref "#SecretProjection" >}}">SecretProjection</a></em></td>
      <td>Інформація про дані секрету для проєкції</td>
    </tr>
    <tr>
      <td><code>serviceAccountToken</code><br/><em><a href="{{< ref "#ServiceAccountTokenProjection" >}}">ServiceAccountTokenProjection</a></em></td>
      <td>Інформація про дані serviceAccountToken для проєкції</td>
    </tr>
  </tbody>
</table>

## WeightedPodAffinityTerm {#WeightedPodAffinityTerm}

Ваги для всіх полів WeightedPodAffinityTerm, що мають збіг, додаються для кожного вузла, щоб знайти найбільш бажані вузли.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>podAffinityTerm</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#PodAffinityTerm" >}}">PodAffinityTerm</a></em></td>
      <td>Обовʼязково. Термін спорідненості пода, повʼязаний з відповідною вагою.</td>
    </tr>
    <tr>
      <td><code>weight</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>Вага, повʼязана з відповідним терміном спорідненості пода, у діапазоні від 1 до 100.</td>
    </tr>
  </tbody>
</table>

## WindowsSecurityContextOptions {#WindowsSecurityContextOptions}

WindowsSecurityContextOptions містить параметри та облікові дані, специфічні для Windows.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>gmsaCredentialSpec</code><br/><em>string</em></td>
      <td>GMSACredentialSpec — це місце, де вебхук допуску GMSA (<a href="https://github.com/kubernetes-sigs/windows-gmsa">https://github.com/kubernetes-sigs/windows-gmsa</a>) вставляє вміст специфікації облікових даних GMSA, визначеної полем GMSACredentialSpecName.</td>
    </tr>
    <tr>
      <td><code>gmsaCredentialSpecName</code><br/><em>string</em></td>
      <td>GMSACredentialSpecName — це назва специфікації облікових даних GMSA, яку слід використовувати.</td>
    </tr>
    <tr>
      <td><code>hostProcess</code><br/><em>boolean</em></td>
      <td>HostProcess визначає, чи слід запускати контейнер як 'Host Process' контейнер. Усі контейнери Pod повинні мати однакове ефективне значення HostProcess (не дозволяється мати суміш HostProcess контейнерів і не-HostProcess контейнерів). Крім того, якщо HostProcess встановлено в true, то HostNetwork також повинен бути встановлений в true.</td>
    </tr>
    <tr>
      <td><code>runAsUserName</code><br/><em>string</em></td>
      <td>Імʼя користувача в Windows для запуску точки входу процесу контейнера. Зазвичай використовується користувач, вказаний у метаданих образу, якщо не вказано інше. Може також бути встановлено в PodSecurityContext. Якщо встановлено як у SecurityContext, так і в PodSecurityContext, перевага надається значенню, вказаному в SecurityContext.</td>
    </tr>
  </tbody>
</table>

## Операції {#Operations}

---

### `post` Create

#### HTTP Запит {#http-request}

POST /api/v1/namespaces/{namespace}/pods

#### Параметри шляху {#path-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `post` Create Eviction

#### HTTP Запит {#http-request-1}

POST /api/v1/namespaces/{namespace}/pods/{name}/eviction

#### Параметри шляху {#path-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Eviction</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/eviction-v1-policy#Eviction" >}}">Eviction</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-1}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/eviction-v1-policy#Eviction" >}}">Eviction</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "../definitions/eviction-v1-policy#Eviction" >}}">Eviction</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "../definitions/eviction-v1-policy#Eviction" >}}">Eviction</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch

#### HTTP Запит {#http-request-2}

PATCH /api/v1/namespaces/{namespace}/pods/{name}

#### Параметри шляху {#path-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>. Це поле обовʼязкове для запитів apply (application/apply-patch), але необовʼязкове для типів патчів, що не застосовуються (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force має на меті "примусово" застосовувати запити Apply. Це означає, що користувач повторно отримає конфліктні поля, що належать іншим користувачам. Прапорець Force повинен бути скасований для запитів, що не є патчами apply.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-2}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace

#### HTTP Запит {#http-request-3}

PUT /api/v1/namespaces/{namespace}/pods/{name}

#### Параметри шляху {#path-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-3}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete

#### HTTP Запит {#http-request-4}

DELETE /api/v1/namespaces/{namespace}/pods/{name}

#### Параметри шляху {#path-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code></td>
      <td><em>integer</em></td>
      <td>Часу у секундах перед видаленням обʼєкта. Значення повинно бути невідʼємним цілим числом. Значення нуль вказує на негайне видалення. Якщо це значення відсутнє, буде використано стандартний період очікування для зазначеного типу. Зазвичай використовується значення для конкретного обʼєкта, якщо не вказано. Нуль означає негайне видалення.</td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code></td>
      <td><em>boolean</em></td>
      <td>Якщо встановлено в true, це призведе до небезпечного видалення ресурсу у випадку, якщо нормальний процес видалення не вдасться через помилку пошкодженого обʼєкта. Ресурс вважається пошкодженим, якщо його не можна успішно отримати з відповідного сховища томущо: a) його дані не можна трансформувати, наприклад, помилка дешифрування, або b) не вдається декодувати в обʼєкт. ПРИМІТКА: небезпечне видалення ігнорує обмеження завершувача, пропускає перевірки передумов і видаляє обʼєкт зі сховища. ПОПЕРЕДЖЕННЯ: це може потенційно порушити роботу кластера, якщо робоче навантаження, повʼязане з ресурсом, що видаляється небезпечно, покладається на нормальний процес видалення. Використовуйте лише якщо ви ДІЙСНО знаєте, що робите. Стандартне значення — false, і користувач повинен явно погодитися на його використання.</td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>Застаріло: будь ласка, використовуйте PropagationPolicy, це поле буде застарілим у версії 1.7. Чи повинні залежні обʼєкти залишатися покинутими. Якщо true/false, завершувач "orphan" буде доданий до/видалений з списку завершувачів обʼєкта. Можна встановити або це поле, або PropagationPolicy, але не обидва.</td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>Чи і як буде виконано збір сміття. Можна встановити або це поле, або OrphanDependents, але не обидва. Стандартна політика визначається наявним завершувачем у metadata.finalizers та стандартною політикою для конкретного ресурсу. Допустимі значення: 'Orphan' — залишити залежні обʼєкти покинутими; 'Background' — дозволити збирачу сміття видаляти залежні обʼєкти у фоновому режимі; 'Foreground' — каскадна політика, яка видаляє всі залежні обʼєкти з показом всіх дій.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-4}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete Collection

#### HTTP Запит {#http-request-5}

DELETE /api/v1/namespaces/{namespace}/pods

#### Параметри шляху {#path-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code></td>
      <td><em>integer</em></td>
      <td>Часу у секундах перед видаленням обʼєкта. Значення повинно бути невідʼємним цілим числом. Значення нуль вказує на негайне видалення. Якщо це значення відсутнє, буде використано стандартний період очікування для зазначеного типу. Зазвичай використовується значення для конкретного обʼєкта, якщо не вказано. Нуль означає негайне видалення.</td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code></td>
      <td><em>boolean</em></td>
      <td>Якщо встановлено в true, це призведе до небезпечного видалення ресурсу у випадку, якщо нормальний процес видалення не вдасться через помилку пошкодженого обʼєкта. Ресурс вважається пошкодженим, якщо його не можна успішно отримати з відповідного сховища томущо: a) його дані не можна трансформувати, наприклад, помилка дешифрування, або b) не вдається декодувати в обʼєкт. ПРИМІТКА: небезпечне видалення ігнорує обмеження завершувача, пропускає перевірки передумов і видаляє обʼєкт зі сховища. ПОПЕРЕДЖЕННЯ: це може потенційно порушити роботу кластера, якщо робоче навантаження, повʼязане з ресурсом, що видаляється небезпечно, покладається на нормальний процес видалення. Використовуйте лише якщо ви ДІЙСНО знаєте, що робите. Стандартне значення — false, і користувач повинен явно погодитися на його використання.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>Застаріло: будь ласка, використовуйте PropagationPolicy, це поле буде застарілим у версії 1.7. Чи повинні залежні обʼєкти залишатися покинутими. Якщо true/false, завершувач "orphan" буде доданий до/видалений з списку завершувачів обʼєкта. Можна встановити або це поле, або PropagationPolicy, але не обидва.</td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>Чи і як буде виконано збір сміття. Можна встановити або це поле, або OrphanDependents, але не обидва. Стандартна політика визначається наявним завершувачем у metadata.finalizers та стандартною політикою для конкретного ресурсу. Допустимі значення: 'Orphan' — залишити залежні обʼєкти покинутими; 'Background' — дозволити збирачу сміття видаляти залежні обʼєкти у фоновому режимі; 'Foreground' — каскадна політика, яка видаляє всі залежні обʼєкти з показом всіх дій.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-5}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Read

#### HTTP Запит {#http-request-6}

GET /api/v1/namespaces/{namespace}/pods/{name}

#### Параметри шляху {#path-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-6}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `get` List

#### HTTP Запит {#http-request-7}

GET /api/v1/namespaces/{namespace}/pods

#### Параметри шляху {#path-parameters-7}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-7}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-7}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#PodList" >}}">PodList</a></em></td>
    </tr>
  </tbody>
</table>

### `get` List All Namespaces

#### HTTP Запит {#http-request-8}

GET /api/v1/pods

#### Параметри запиту {#query-parameters-8}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-8}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#PodList" >}}">PodList</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch

#### HTTP Запит {#http-request-9}

GET /api/v1/watch/namespaces/{namespace}/pods/{name}

#### Параметри шляху {#path-parameters-8}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-9}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-9}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch List

#### HTTP Запит {#http-request-10}

GET /api/v1/watch/namespaces/{namespace}/pods

#### Параметри шляху {#path-parameters-9}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-10}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-10}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch List All Namespaces

#### HTTP Запит {#http-request-11}

GET /api/v1/watch/pods

#### Параметри запиту {#query-parameters-11}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-11}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch Status

#### HTTP Запит {#http-request-12}

PATCH /api/v1/namespaces/{namespace}/pods/{name}/status

#### Параметри шляху {#path-parameters-10}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-12}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>. Це поле обовʼязкове для запитів apply (application/apply-patch), але необовʼязкове для типів патчів, що не застосовуються (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force має на меті "примусово" застосовувати запити Apply. Це означає, що користувач повторно отримає конфліктні поля, що належать іншим користувачам. Прапорець Force повинен бути скасований для запитів, що не є патчами apply.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-12}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Read Status

#### HTTP Запит {#http-request-13}

GET /api/v1/namespaces/{namespace}/pods/{name}/status

#### Параметри шляху {#path-parameters-11}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-13}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-13}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace Status

#### HTTP Запит {#http-request-14}

PUT /api/v1/namespaces/{namespace}/pods/{name}/status

#### Параметри шляху {#path-parameters-12}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-14}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-7}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-14}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Read Resize

#### HTTP Запит {#http-request-15}

GET /api/v1/namespaces/{namespace}/pods/{name}/resize

#### Параметри шляху {#path-parameters-13}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-15}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-15}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch Resize

#### HTTP Запит {#http-request-16}

PATCH /api/v1/namespaces/{namespace}/pods/{name}/resize

#### Параметри шляху {#path-parameters-14}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-16}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>. Це поле обовʼязкове для запитів apply (application/apply-patch), але необовʼязкове для типів патчів, що не застосовуються (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force має на меті "примусово" застосовувати запити Apply. Це означає, що користувач повторно отримає конфліктні поля, що належать іншим користувачам. Прапорець Force повинен бути скасований для запитів, що не є патчами apply.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-8}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-16}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace Resize

#### HTTP Запит {#http-request-17}

PUT /api/v1/namespaces/{namespace}/pods/{name}/resize

#### Параметри шляху {#path-parameters-15}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-17}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-9}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-17}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch EphemeralContainers

#### HTTP Запит {#http-request-18}

PATCH /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

#### Параметри шляху {#path-parameters-16}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-18}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>. Це поле обовʼязкове для запитів apply (application/apply-patch), але необовʼязкове для типів патчів, що не застосовуються (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force має на меті "примусово" застосовувати запити Apply. Це означає, що користувач повторно отримає конфліктні поля, що належать іншим користувачам. Прапорець Force повинен бути скасований для запитів, що не є патчами apply.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-10}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-18}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Read EphemeralContainers

#### HTTP Запит {#http-request-19}

GET /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

#### Параметри шляху {#path-parameters-17}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-19}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-19}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace EphemeralContainers

#### HTTP Запит {#http-request-20}

PUT /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

#### Параметри шляху {#path-parameters-18}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-20}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-11}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-20}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>

### `post` Create Connect Portforward

#### HTTP Запит {#http-request-21}

POST /api/v1/namespaces/{namespace}/pods/{name}/portforward

#### Параметри шляху {#path-parameters-19}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodPortForwardOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-21}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>ports</code></td>
      <td><em>integer</em></td>
      <td>Список портів для переадресації. Необхідний при використанні WebSockets</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-21}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `post` Create Connect Proxy

#### HTTP Запит {#http-request-22}

POST /api/v1/namespaces/{namespace}/pods/{name}/proxy

#### Параметри шляху {#path-parameters-20}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-22}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path є URL-адресою, яку слід використовувати для поточного проксі-запиту до пода.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-22}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `post` Create Connect Proxy Path

#### HTTP Запит {#http-request-23}

POST /api/v1/namespaces/{namespace}/pods/{name}/proxy/{path}

#### Параметри шляху {#path-parameters-21}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>шлях до ресурсу</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-23}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path є URL-адресою, яку слід використовувати для поточного проксі-запиту до пода.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-23}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete Connect Proxy

#### HTTP Запит {#http-request-24}

DELETE /api/v1/namespaces/{namespace}/pods/{name}/proxy

#### Параметри шляху {#path-parameters-22}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-24}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path є URL-адресою, яку слід використовувати для поточного проксі-запиту до пода.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-24}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete Connect Proxy Path

#### HTTP Запит {#http-request-25}

DELETE /api/v1/namespaces/{namespace}/pods/{name}/proxy/{path}

#### Параметри шляху {#path-parameters-23}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>шлях до ресурсу</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-25}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path є URL-адресою, яку слід використовувати для поточного проксі-запиту до пода.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-25}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `get` Get Connect Portforward

#### HTTP Запит {#http-request-26}

GET /api/v1/namespaces/{namespace}/pods/{name}/portforward

#### Параметри шляху {#path-parameters-24}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodPortForwardOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-26}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>ports</code></td>
      <td><em>integer</em></td>
      <td>Список портів для переадресації. Необхідний при використанні WebSockets</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-26}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `get` Get Connect Proxy

#### HTTP Запит {#http-request-27}

GET /api/v1/namespaces/{namespace}/pods/{name}/proxy

#### Параметри шляху {#path-parameters-25}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-27}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path є URL-адресою, яку слід використовувати для поточного проксі-запиту до пода.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-27}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `get` Get Connect Proxy Path

#### HTTP Запит {#http-request-28}

GET /api/v1/namespaces/{namespace}/pods/{name}/proxy/{path}

#### Параметри шляху {#path-parameters-26}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>шлях до ресурсу</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-28}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path є URL-адресою, яку слід використовувати для поточного проксі-запиту до пода.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-28}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `head` Head Connect Proxy

#### HTTP Запит {#http-request-29}

HEAD /api/v1/namespaces/{namespace}/pods/{name}/proxy

#### Параметри шляху {#path-parameters-27}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-29}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path є URL-адресою, яку слід використовувати для поточного проксі-запиту до пода.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-29}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `head` Head Connect Proxy Path

#### HTTP Запит {#http-request-30}

HEAD /api/v1/namespaces/{namespace}/pods/{name}/proxy/{path}

#### Параметри шляху {#path-parameters-28}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>шлях до ресурсу</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-30}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path є URL-адресою, яку слід використовувати для поточного проксі-запиту до пода.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-30}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `put` Replace Connect Proxy

#### HTTP Запит {#http-request-31}

PUT /api/v1/namespaces/{namespace}/pods/{name}/proxy

#### Параметри шляху {#path-parameters-29}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-31}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path є URL-адресою, яку слід використовувати для поточного проксі-запиту до пода.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-31}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `put` Replace Connect Proxy Path

#### HTTP Запит {#http-request-32}

PUT /api/v1/namespaces/{namespace}/pods/{name}/proxy/{path}

#### Параметри шляху {#path-parameters-30}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>шлях до ресурсу</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-32}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path є URL-адресою, яку слід використовувати для поточного проксі-запиту до пода.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-32}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `get` Read Log

#### HTTP Запит {#http-request-33}

GET /api/v1/namespaces/{namespace}/pods/{name}/log

#### Параметри шляху {#path-parameters-31}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя Podʼа</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-33}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>container</code></td>
      <td><em>string</em></td>
      <td>Контейнер, для якого потрібно передавати журнали. Зазвичай використовується лише один контейнер, якщо в поді є лише один контейнер.</td>
    </tr>
    <tr>
      <td><code>follow</code></td>
      <td><em>boolean</em></td>
      <td>Слідкувати за потоком журналів пода. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>insecureSkipTLSVerifyBackend</code></td>
      <td><em>boolean</em></td>
      <td>insecureSkipTLSVerifyBackend вказує, що apiserver не повинен підтверджувати дійсність сертифіката обслуговуючого сервера бекенду, до якого він підключається. Це зробить HTTPS-зʼєднання між apiserver і бекендом небезпечним. Це означає, що apiserver не може перевірити, чи дані журналу, які він отримує, походять від реального kubelet. Якщо kubelet налаштований на перевірку облікових даних TLS apiserver, це не означає, що зʼєднання з реальним kubelet вразливе до атаки "людина посередині" (наприклад, зловмисник не зможе перехопити фактичні дані журналу, що надходять від реального kubelet).</td>
    </tr>
    <tr>
      <td><code>limitBytes</code></td>
      <td><em>integer</em></td>
      <td>Якщо встановлено, кількість байтів для читання з сервера перед завершенням виводу журналу. Це може не відобразити повну останню лінію журналу і може повернути трохи більше або трохи менше, ніж вказаний ліміт.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>previous</code></td>
      <td><em>boolean</em></td>
      <td>Повернути журнали попередньо завершеного контейнера. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>sinceSeconds</code></td>
      <td><em>integer</em></td>
      <td>Відносний час у секундах до поточного часу, з якого потрібно показувати журнали. Якщо це значення передує часу запуску пода, будуть повернуті лише журнали з моменту запуску пода. Якщо це значення знаходиться в майбутньому, журнали не будуть повернуті. Можна вказати лише один з параметрів sinceSeconds або sinceTime.</td>
    </tr>
    <tr>
      <td><code>stream</code></td>
      <td><em>string</em></td>
      <td>Вкажіть, який потік журналів контейнера потрібно повернути клієнту. Допустимі значення: "All", "Stdout" та "Stderr". Якщо не вказано, використовується "All", і обидва потоки stdout та stderr повертаються змішаними. Зверніть увагу, що коли вказано "TailLines", "Stream" може бути встановлено лише в nil або "All".</td>
    </tr>
    <tr>
      <td><code>tailLines</code></td>
      <td><em>integer</em></td>
      <td>Якщо встановлено, кількість рядків з кінця журналів для відображення. Якщо не вказано, журнали відображаються з моменту створення контейнера або з параметрів sinceSeconds або sinceTime. Зверніть увагу, що коли вказано "TailLines", "Stream" може бути встановлено лише в nil або "All".</td>
    </tr>
    <tr>
      <td><code>timestamps</code></td>
      <td><em>boolean</em></td>
      <td>Якщо true, додає мітку часу у форматі RFC3339 або RFC3339Nano на початку кожного рядка виводу журналу. Стандартно — false.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-33}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `get` Get Connect Exec

#### HTTP Запит {#http-request-34}

GET /api/v1/namespaces/{namespace}/pods/{name}/exec

#### Параметри шляху {#path-parameters-32}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodExecOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-34}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>command</code></td>
      <td><em>string</em></td>
      <td>Command є віддаленою командою, яку потрібно виконати. Масив argv. Не виконується в оболонці.</td>
    </tr>
    <tr>
      <td><code>container</code></td>
      <td><em>string</em></td>
      <td>Контейнер, у якому буде виконано команду. Стандартно використовується лише один контейнер, якщо в поді є лише один контейнер.</td>
    </tr>
    <tr>
      <td><code>stderr</code></td>
      <td><em>boolean</em></td>
      <td>Переспрямовує стандартний потік помилок пода для цього виклику.</td>
    </tr>
    <tr>
      <td><code>stdin</code></td>
      <td><em>boolean</em></td>
      <td>Переспрямовує стандартний потік введення пода для цього виклику. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>stdout</code></td>
      <td><em>boolean</em></td>
      <td>Переспрямовує стандартний потік виводу пода для цього виклику. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>tty</code></td>
      <td><em>boolean</em></td>
      <td>TTY якщо true вказує, що для виклику exec буде виділено tty. Стандартно — false.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-34}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `post` Create Connect Exec

#### HTTP Запит {#http-request-35}

POST /api/v1/namespaces/{namespace}/pods/{name}/exec

#### Параметри шляху {#path-parameters-33}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodExecOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-35}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>command</code></td>
      <td><em>string</em></td>
      <td>Command є віддаленою командою, яку потрібно виконати. Масив argv. Не виконується в оболонці.</td>
    </tr>
    <tr>
      <td><code>container</code></td>
      <td><em>string</em></td>
      <td>Контейнер, у якому буде виконано команду. Стандартно використовується лише один контейнер, якщо в поді є лише один контейнер.</td>
    </tr>
    <tr>
      <td><code>stderr</code></td>
      <td><em>boolean</em></td>
      <td>Переспрямовує стандартний потік помилок пода для цього виклику.</td>
    </tr>
    <tr>
      <td><code>stdin</code></td>
      <td><em>boolean</em></td>
      <td>Переспрямовує стандартний потік введення пода для цього виклику. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>stdout</code></td>
      <td><em>boolean</em></td>
      <td>Переспрямовує стандартний потік виводу пода для цього виклику. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>tty</code></td>
      <td><em>boolean</em></td>
      <td>TTY якщо true вказує, що для виклику exec буде виділено tty. Стандартно — false.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-35}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `get` Get Connect Attach

#### HTTP Запит {#http-request-36}

GET /api/v1/namespaces/{namespace}/pods/{name}/attach

#### Параметри шляху {#path-parameters-34}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodAttachOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-36}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>container</code></td>
      <td><em>string</em></td>
      <td>The Контейнер, у якому буде виконано команду. Стандартно використовується лише один контейнер, якщо в поді є лише один контейнер.</td>
    </tr>
    <tr>
      <td><code>stderr</code></td>
      <td><em>boolean</em></td>
      <td>Якщо Stderr має значення true, це означає, що стандартний вивід помилок (stderr) має бути перенаправлений під час виклику attach. Стандартне значення — true.</td>
    </tr>
    <tr>
      <td><code>stdin</code></td>
      <td><em>boolean</em></td>
      <td>Якщо Stdin має значення true, для цього виклику виконується перенаправлення потоку стандартного вводу пода. Стандартне значення — false.</td>
    </tr>
    <tr>
      <td><code>stdout</code></td>
      <td><em>boolean</em></td>
      <td>Якщо Stdout має значення true, це означає, що stdout має бути перенаправлено для виклику attach. Стандартне значення — true.</td>
    </tr>
    <tr>
      <td><code>tty</code></td>
      <td><em>boolean</em></td>
      <td>Параметр TTY, якщо має значення true, вказує, що для виклику attach буде виділено термінал TTY. Цей параметр передається через середовище виконання контейнера, тому термінал TTY виділяється на робочому вузлі саме цим середовищем. Стандартне значення — false.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-36}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>

### `post` Create Connect Attach

#### HTTP Запит {#http-request-37}

POST /api/v1/namespaces/{namespace}/pods/{name}/attach

#### Параметри шляху {#path-parameters-35}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Імʼя PodAttachOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-37}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>container</code></td>
      <td><em>string</em></td>
      <td>The Контейнер, у якому буде виконано команду. Стандартно використовується лише один контейнер, якщо в поді є лише один контейнер.</td>
    </tr>
    <tr>
      <td><code>stderr</code></td>
      <td><em>boolean</em></td>
      <td>Якщо Stderr має значення true, це означає, що стандартний вивід помилок (stderr) має бути перенаправлений під час виклику attach. Стандартне значення — true.</td>
    </tr>
    <tr>
      <td><code>stdin</code></td>
      <td><em>boolean</em></td>
      <td>Якщо Stdin має значення true, для цього виклику виконується перенаправлення потоку стандартного вводу пода. Стандартне значення — false.</td>
    </tr>
    <tr>
      <td><code>stdout</code></td>
      <td><em>boolean</em></td>
      <td>Якщо Stdout має значення true, це означає, що stdout має бути перенаправлено для виклику attach. Стандартне значення — true.</td>
    </tr>
    <tr>
      <td><code>tty</code></td>
      <td><em>boolean</em></td>
      <td>Параметр TTY, якщо має значення true, вказує, що для виклику attach буде виділено термінал TTY. Цей параметр передається через середовище виконання контейнера, тому термінал TTY виділяється на робочому вузлі саме цим середовищем. Стандартне значення — false.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-37}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>
