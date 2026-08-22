---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSIDriver"
content_type: "api_reference"
description: "CSIDriver збирає інформацію про драйвер тому Container Storage Interface (CSI), розгорнутий у кластері. Контролер приєднання та відʼєднання Kubernetes використовує цей обʼєкт для визначення, чи потрібне приєднання. Kubelet використовує цей обʼєкт для визначення, чи потрібно передавати інформацію про поди під час монтування. Обʼєкти CSIDriver не мають простору імен."
title: "CSIDriver"
weight: 10
auto_generated: false
---

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## CSIDriver {#CSIDriver}

CSIDriver збирає інформацію про драйвер тому Container Storage Interface (CSI), розгорнутий у кластері. Контролер приєднання та відʼєднання Kubernetes використовує цей обʼєкт для визначення, чи потрібне приєднання. Kubelet використовує цей обʼєкт для визначення, чи потрібно передавати інформацію про поди під час монтування. Обʼєкти CSIDriver не мають простору імен.

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
      <td>Стандартні метадані обʼєкта. metadata.Name вказує назву драйвера CSI, до якого відноситься цей обʼєкт; вона ПОВИННА бути такою ж, як і назва, повернена викликом CSI GetPluginName() для цього драйвера. Назва драйвера повинна містити не більше 63 символів, починатися та закінчуватися алфавітно-цифровим символом ([a-z0-9A-Z]) з дефісами (-), крапками (.) та алфавітно-цифровими символами між ними. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a></td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#CSIDriverSpec" >}}">CSIDriverSpec</a></em></td>
      <td>spec представляє специфікацію драйвера CSI.</td>
    </tr>
  </tbody>
</table>

## CSIDriverSpec {#CSIDriverSpec}

CSIDriverSpec представляє специфікацію драйвера CSI.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>attachRequired</code><br/><em>boolean</em></td>
      <td><p>attachRequired показує, чи цей драйвер CSI вимагає операції приєднання (оскільки він реалізує метод CSI ControllerPublishVolume()), і що контролер приєднання/відʼєднання Kubernetes повинен викликати інтерфейс приєднання тома, який перевіряє стан volumeattachment і чекає, поки том не буде приєднаний, перш ніж продовжити монтування. Зовнішній приєднувач CSI координується з драйвером CSI і оновлює стан volumeattachment, коли операція приєднання завершена. Якщо значення вказано як false, операція приєднання буде пропущена. В іншому випадку операція приєднання буде викликана.</p>
      <p>This field is immutable.</p></td>
    </tr>
    <tr>
      <td><code>fsGroupPolicy</code><br/><em>string</em></td>
      <td><p>fsGroupPolicy визначає, чи підтримує базовий том зміну власника та дозволів тома перед його монтуванням. Дивіться конкретні значення FSGroupPolicy для додаткових деталей.</p>
      <p>Це поле було незмінним у Kubernetes &lt; 1.29 і тепер є змінним.</p>
      <p>Стандартно встановлено ReadWriteOnceWithFSType, що дозволяє перевіряти кожен том, щоб визначити, чи Kubernetes повинен змінювати власника та дозволи тома. Зі стандартною  політикою визначений fsGroup буде застосовуватися лише у разі визначення fstype та якщо режим доступу тома містить ReadWriteOnce.</p></td>
    </tr>
    <tr>
      <td><code>nodeAllocatableUpdatePeriodSeconds</code><br/><em>integer</em></td>
      <td><p>nodeAllocatableUpdatePeriodSeconds визначає інтервал між періодичними оновленнями доступної ємності CSINode для цього драйвера. Коли встановлено, обидва періодичні оновлення та оновлення, викликані помилками, повʼязаними з ємністю, увімкнені. Якщо не встановлено, оновлення не відбуваються (ні періодичні, ні при виявленні помилок, повʼязаних з ємністю), і allocatable.count залишається статичним. Мінімально допустиме значення для цього поля становить 10 секунд.</p>
      <p>Ця функція вимагає, щоб була увімкнена функціональна можливість MutableCSINodeAllocatableCount.</p>
      <p>Це поле є змінним.</p></td>
    </tr>
    <tr>
      <td><code>podInfoOnMount</code><br/><em>boolean</em></td>
      <td><p>podInfoOnMount показує, чи цей драйвер CSI вимагає додаткової інформації про поди (наприклад, podName, podUID тощо) під час операцій монтування, якщо встановлено значення true. Якщо встановлено значення false, інформація про поди не буде передаватися під час монтування. Стандартно встановлено false.</p>
      <p>Драйвер CSI вказує podInfoOnMount як частину розгортання драйвера. Якщо встановлено значення true, Kubelet передаватиме інформацію про поди як VolumeContext у викликах CSI NodePublishVolume(). Драйвер CSI відповідає за розбір та перевірку інформації, переданої як VolumeContext.</p>
      <p>Наступний VolumeContext буде передано, якщо podInfoOnMount встановлено значення true. Цей список може зростати, але префікс буде використовуватися. "csi.storage.k8s.io/pod.name": pod.Name "csi.storage.k8s.io/pod.namespace": pod.Namespace "csi.storage.k8s.io/pod.uid": string(pod.UID) "csi.storage.k8s.io/ephemeral": "true", якщо том є ефермерним вбудованим томом, визначеним CSIVolumeSource, інакше "false"  "csi.storage.k8s.io/ephemeral" є новою функцією в Kubernetes 1.16. Вона потрібна лише для драйверів, які підтримують обидва режими VolumeLifecycleMode: "Persistent" та "Ephemeral". Інші драйвери можуть залишити інформацію про поди вимкненою та/або ігнорувати це поле. Оскільки Kubernetes 1.15 не підтримує це поле, драйвери можуть підтримувати лише один режим при розгортанні на такому кластері, і розгортання визначає, який режим це буде, наприклад, через параметр командного рядка драйвера.</p>
      <p>Це поле було незмінним у Kubernetes &lt; 1.29 і тепер є змінним.</p></td>
    </tr>
    <tr>
      <td><code>preventPodSchedulingIfMissing</code><br/><em>boolean</em></td>
      <td><p>PreventPodSchedulingIfMissing показує, чи CSI драйвер хоче запобігти плануванню подів, якщо CSI драйвер на вузлі відсутній.</p>
      <p>Увімкнення цієї опції запобігатиме плануванню подів на вузли, де CSI драйвер не встановлений, як для планувальника (або будь-якого іншого компонента, який вбудовує стандартний планувальник, наприклад, cluster-autoscaler).</p>
      <p>Для компонентів (таких як cluster-autoscaler), які вбудовують планувальник і виконують симуляції розміщення подів за допомогою плагінів планувальника, вони МАЮТЬ бути обізнані про інформацію про реєстрацію CSI драйвера через обʼєкт CSINode. Вони повинні створювати симульовані обʼєкти CSINode на додаток до обʼєктів Node під час симуляції планування, інакше, якщо PreventPodSchedulingIfMissing увімкнено глобально для обʼєкта CSIDriver, будь-який новостворений вузол може бути відхилений планувальником через відсутність інформації про CSI драйвер на вузлі.</p>
      <p>Це альфа-функція і вимагає увімкнення функціональної можливості VolumeLimitScaling. Стандартно встановлено "false".</p></td>
    </tr>
    <tr>
      <td><code>requiresRepublish</code><br/><em>boolean</em></td>
      <td><p>requiresRepublish показує, чи CSI драйвер хоче, щоб <code>NodePublishVolume</code> викликався періодично для показу будь-яких можливих змін у змонтованому томі. Стандартно встановлено false.</p>
      <p>Примітка: Після успішного початкового виклику NodePublishVolume, наступні виклики NodePublishVolume повинні лише оновлювати вміст тому. Нові точки монтування не будуть видимі для запущеного контейнера.</p></td>
    </tr>
    <tr>
      <td><code>seLinuxMount</code><br/><em>boolean</em></td>
      <td><p>seLinuxMount визначає, чи підтримує CSI драйвер опцію монтування "-o context".</p>
      <p>Коли встановлено "true", CSI драйвер повинен забезпечити, щоб усі томи, надані цим CSI драйвером, могли монтуватися окремо з різними опціями <code>-o context</code>. Це типово для сховищ, які надають томи як файлові системи на блочних пристроях або як незалежні спільні томи. Kubernetes викличе NodeStage / NodePublish з опцією монтування "-o context=xyz" при монтуванні тома ReadWriteOncePod, який використовується в Pod з явно встановленим контекстом SELinux. У майбутньому це може бути розширено на інші режими доступу до томів. У будь-якому випадку Kubernetes забезпечить, щоб том монтувався лише з одним контекстом SELinux.</p>
      <p>Коли встановлено "false", Kubernetes не передаватиме жодних спеціальних опцій монтування SELinux драйверу. Це типово для томів, які представляють субтеки більшої спільної файлової системи.</p>
      <p>Стандартно встановлено "false".</p></td>
    </tr>
    <tr>
      <td><code>serviceAccountTokenInSecrets</code><br/><em>boolean</em></td>
      <td><p>serviceAccountTokenInSecrets є опційним параметром для CSI драйверів, щоб вказати, що токени службових облікових записів повинні передаватися через поле Secrets у NodePublishVolumeRequest замість поля VolumeContext. Специфікація CSI надає спеціальне поле Secrets для конфіденційної інформації, такої як токени, що є відповідним механізмом для обробки облікових даних. Це вирішує проблеми безпеки, коли конфіденційні токени реєструвалися як частина контексту тома.</p>
      <p>Коли встановлено "true", kubelet передаватиме токени лише в полі Secrets з ключем "csi.storage.k8s.io/serviceAccount.tokens". CSI драйвер повинен бути оновлений для читання токенів з поля Secrets замість VolumeContext.</p>
      <p>Коли встановлено "false" або не встановлено, kubelet передаватиме токени в VolumeContext з ключем "csi.storage.k8s.io/serviceAccount.tokens" (існуюча поведінка). Це забезпечує зворотну сумісність з наявними CSI драйверами.</p>
      <p>Це поле можна встановити лише тоді, коли налаштовано TokenRequests. Сервер API відхилить специфікації CSIDriver, які встановлюють це поле без TokenRequests.</p>
      <p>Стандартна поведінка, якщо не встановлено, полягає в передачі токенів у поле VolumeContext.</p></td>
    </tr>
    <tr>
      <td><code>storageCapacity</code><br/><em>boolean</em></td>
      <td><p>storageCapacity показує, що CSI драйвер томів хоче, щоб планування Podʼа враховувало ємність сховища, яку розгортання драйвера повідомляє, створюючи обʼєкти CSIStorageCapacity з інформацією про ємність, якщо встановлено true.</p>
      <p>Перевірку можна ввімкнути відразу при розгортанні драйвера. У цьому випадку створення нових томів з пізнім звʼязуванням буде призупинено, поки розгортання драйвера не опублікує відповідний обʼєкт CSIStorageCapacity.</p>
      <p>Альтернативно, драйвер можна розгорнути з незаданим або false полем, і його можна змінити пізніше, коли буде опублікована інформація про ємність сховища.</p>
      <p>Це поле було незмінним у Kubernetes &lt;= 1.22 і тепер є змінним.</p></td>
    </tr>
    <tr>
      <td><code>tokenRequests</code><br/><em><a href="{{< ref "#TokenRequest" >}}">TokenRequest array</a></em></td>
      <td><p>tokenRequests показує, що CSI драйвер потребує токенів службових облікових записів Podʼів, для яких він монтує томи, для виконання необхідної автентифікації. Kubelet передаватиме токени в VolumeContext у викликах CSI NodePublishVolume. CSI драйвер повинен розібрати та перевірити наступний VolumeContext: <pre>"csi.storage.k8s.io/serviceAccount.tokens": {
  "<audience>": {
    "token": <token>,
    "expirationTimestamp": <expiration timestamp in RFC3339>,
  },
  ...
}</pre></p>
      <p>Примітка: Audience у кожному TokenRequest має бути різним, і не більше одного токена може бути порожнім рядком. Щоб отримати новий токен після закінчення терміну дії, можна використовувати RequiresRepublish для періодичного виклику NodePublishVolume.</p></td>
    </tr>
    <tr>
      <td><code>volumeLifecycleModes</code><br/><em>string array</em></td>
      <td><p>volumeLifecycleModes визначає, які типи томів підтримує цей CSI драйвер томів. Зазвичай, якщо список порожній, використовується "Persistent", що відповідає специфікації CSI і реалізується в Kubernetes через звичайний механізм PV/PVC.</p>
      <p>Інший режим — "Ephemeral". У цьому режимі томи визначаються безпосередньо в специфікації Podʼа за допомогою CSIVolumeSource, і їх життєвий цикл повʼязаний з життєвим циклом цього Podʼа. Драйвер повинен бути обізнаний про це, оскільки він отримає виклик NodePublishVolume лише для такого тому.</p>
      <p>Для отримання додаткової інформації про реалізацію цього режиму див. <a href="https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html">https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html</a>. Драйвер може підтримувати один або кілька з цих режимів, і в майбутньому можуть бути додані нові режими.</p>
      <p>Це поле є бета-версією. Це поле є незмінним.</p></td>
    </tr>
  </tbody>
</table>

## CSIDriverList {#CSIDriverList}

CSIDriverList є колекцією обʼєктів CSIDriver.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>items</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver array</a></em></td>
      <td>items є списком обʼєктів CSIDriver</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/list-meta-v1-meta#ListMeta" >}}">ListMeta</a></em></td>
      <td>Стандартні метадані списку. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a></td>
    </tr>
  </tbody>
</table>

## TokenRequest {#TokenRequest}

TokenRequest містить параметри токена службового облікового запису.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>audience</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>audience визначає призначену аудиторію токена в "TokenRequestSpec". За замовчуванням використовується аудиторія kube apiserver.</td>
    </tr>
    <tr>
      <td><code>expirationSeconds</code><br/><em>integer</em></td>
      <td>expirationSeconds визначає тривалість дії токена в "TokenRequestSpec". Воно має таке ж значення за замовчуванням, як і "ExpirationSeconds" у "TokenRequestSpec".</td>
    </tr>
  </tbody>
</table>

## Операції {#Operations}

---

### `post` Create

#### HTTP Запит {#http-request}

POST /apis/storage.k8s.io/v1/csidrivers

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
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver</a></em></td>
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
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch

#### HTTP Запит {#http-request-1}

PATCH /apis/storage.k8s.io/v1/csidrivers/{name}

#### Параметри шляху {#path-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CSIDriver</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-1}

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

#### Параметри тіла запиту {#body-parameters-1}

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

#### Відповідь {#response-1}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace

#### HTTP Запит {#http-request-2}

PUT /apis/storage.k8s.io/v1/csidrivers/{name}

#### Параметри шляху {#path-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CSIDriver</td>
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

#### Параметри тіла запиту {#body-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver</a></em></td>
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
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete

#### HTTP Запит {#http-request-3}

DELETE /apis/storage.k8s.io/v1/csidrivers/{name}

#### Параметри шляху {#path-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CSIDriver</td>
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

#### Параметри тіла запиту {#body-parameters-3}

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

#### Відповідь {#response-3}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete Collection

#### HTTP Запит {#http-request-4}

DELETE /apis/storage.k8s.io/v1/csidrivers

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
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Read

#### HTTP Запит {#http-request-5}

GET /apis/storage.k8s.io/v1/csidrivers/{name}

#### Параметри шляху {#path-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CSIDriver</td>
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
  </tbody>
</table>

#### Відповідь {#response-5}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriver" >}}">CSIDriver</a></em></td>
    </tr>
  </tbody>
</table>

### `get` List

#### HTTP Запит {#http-request-6}

GET /apis/storage.k8s.io/v1/csidrivers

#### Параметри запиту {#query-parameters-6}

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

#### Відповідь {#response-6}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "csi-driver-v1#CSIDriverList" >}}">CSIDriverList</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch

#### HTTP Запит {#http-request-7}

GET /apis/storage.k8s.io/v1/watch/csidrivers/{name}

#### Параметри шляху {#path-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CSIDriver</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-7}

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

#### Відповідь {#response-7}

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

#### HTTP Запит {#http-request-8}

GET /apis/storage.k8s.io/v1/watch/csidrivers

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
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>
