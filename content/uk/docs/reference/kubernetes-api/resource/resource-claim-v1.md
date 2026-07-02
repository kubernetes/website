---
api_metadata:
  apiVersion: "resource.k8s.io/v1"
  import: "k8s.io/api/resource/v1"
  kind: "ResourceClaim"
content_type: "api_reference"
description: "ResourceClaim описує запит на доступ до ресурсів у кластері для використання робочими навантаженнями. Наприклад, якщо робоче навантаження потребує пристрою-акселератора з конкретними властивостями, це саме той спосіб, як цей запит виражається. Розділ статусу відстежує, чи було задоволено цей запит і які конкретні ресурси були виділені."
title: "ResourceClaim"
weight: 30
auto_generated: false
---

`apiVersion: resource.k8s.io/v1`

`import "k8s.io/api/resource/v1"`

## ResourceClaim {#ResourceClaim}

ResourceClaim описує запит на доступ до ресурсів у кластері для використання робочими навантаженнями. Наприклад, якщо робоче навантаження потребує пристрою-акселератора з конкретними властивостями, це саме той спосіб, як цей запит виражається. Розділ статусу відстежує, чи було задоволено цей запит і які конкретні ресурси були виділені.

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
      <td>Стандартні метадані обʼєкта</td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#ResourceClaimSpec" >}}">ResourceClaimSpec</a></em></td>
      <td>Spec описує, що запитується і як це налаштовується. Spec є незмінним.</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#ResourceClaimStatus" >}}">ResourceClaimStatus</a></em></td>
      <td>Status описує, чи готовий запит до використання і що було виділено.</td>
    </tr>
  </tbody>
</table>

## ResourceClaimSpec {#ResourceClaimSpec}

ResourceClaimSpec визначає, що запитується в ResourceClaim і як це налаштовується.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>devices</code><br/><em><a href="{{< ref "#DeviceClaim" >}}">DeviceClaim</a></em></td>
      <td>Devices визначає, як запитувати пристрої.</td>
    </tr>
  </tbody>
</table>

## ResourceClaimStatus {#ResourceClaimStatus}

ResourceClaimStatus відстежує, чи було виділено ресурс і який був результат цього виділення.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allocation</code><br/><em><a href="{{< ref "#AllocationResult" >}}">AllocationResult</a></em></td>
      <td>Allocation встановлюється після успішного виділення запиту.</td>
    </tr>
    <tr>
      <td><code>devices</code><br/><em><a href="{{< ref "#AllocatedDeviceStatus" >}}">AllocatedDeviceStatus array</a></em></td>
      <td>Devices містить стан кожного пристрою, виділеного для цього запиту, як повідомляє драйвер. Це може включати інформацію, специфічну для драйвера. Записи належать відповідним драйверам.</td>
    </tr>
    <tr>
      <td><code>reservedFor</code><br/><em><a href="{{< ref "#ResourceClaimConsumerReference" >}}">ResourceClaimConsumerReference array</a></em><br/><em>patch strategy: злиття за ключем <code>uid</code></em></td>
      <td><p>ReservedFor вказує, які сутності наразі мають право використовувати запит. Pod, який посилається на ResourceClaim, який не зарезервований для цього Podʼа, не буде запущено. Запит, який використовується або може бути використаний, оскільки він був зарезервований, не повинен бути деалокований.<p>
      </p>У кластері з кількома екземплярами планувальника два Podʼи можуть бути заплановані одночасно різними планувальниками. Коли вони посилаються на той самий ResourceClaim, який вже досяг максимальної кількості споживачів, лише один Pod може бути запланований.</p>
      <p>Обидва планувальники намагаються додати свій Pod до поля claim.status.reservedFor, але лише оновлення, яке першим досягає API-сервера, зберігається. Інше оновлення завершується з помилкою, і планувальник, який його видав, знає, що він повинен повернути Pod назад у чергу, чекаючи, поки ResourceClaim знову стане доступним.</p>
      <p>Може бути не більше 256 таких резервувань. Це число може бути збільшене в майбутньому, але не зменшене.</p>
    </td>
    </tr>
  </tbody>
</table>

## ResourceClaimList {#ResourceClaimList}

ResourceClaimList є колекцією заявок.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>items</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim array</a></em></td>
      <td>Items є списком заявок на ресурси.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/list-meta-v1-meta#ListMeta" >}}">ListMeta</a></em></td>
      <td>Стандартні метадані списку</td>
    </tr>
  </tbody>
</table>

## AllocatedDeviceStatus {#AllocatedDeviceStatus}

AllocatedDeviceStatus містить стан виділеного пристрою, якщо драйвер вирішить його повідомити. Це може включати інформацію, специфічну для драйвера.

Комбінація Driver, Pool, Device та ShareID повинна відповідати відповідному ключу в Status.Allocation.Devices.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>conditions</code><br/><em><a href="{{< ref "../definitions/condition-v1-meta#Condition" >}}">Condition array</a></em></td>
      <td>Conditions містить останнє спостереження стану пристрою. Якщо пристрій було налаштовано відповідно до класу та посилань на конфігурацію заявки, стан <code>Ready</code> повинна бути True. Не повинно містити більше 8 записів.</td>
    </tr>
    <tr>
      <td><code>data</code><br/><em></em></td>
      <td>Data містить довільні дані, специфічні для драйвера. Довжина сирих даних повинна бути меншою або рівною 10 Ki.</td>
    </tr>
    <tr>
      <td><code>device</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Device посилається на один екземпляр пристрою за його імʼям у пулі ресурсів драйвера. Це повинно бути DNS-міткою.</td>
    </tr>
    <tr>
      <td><code>driver</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Driver вказує назву драйвера DRA, втулок kubelet якого повинен бути викликаний для обробки виділення, коли заявка потрібна на вузлі. Повинно бути субдоменом DNS і закінчуватися доменом DNS, що належить постачальнику драйвера. Повинно використовувати лише малі літери.</td>
    </tr>
    <tr>
      <td><code>networkData</code><br/><em><a href="{{< ref "#NetworkDeviceData" >}}">NetworkDeviceData</a></em></td>
      <td>NetworkData містить інформацію, повʼязану з мережею, специфічну для пристрою.</td>
    </tr>
    <tr>
      <td><code>pool</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Це імʼя разом із назвою драйвера та полем імені пристрою визначає, який пристрій було виділено (<code>&lt;driver name&gt;/&lt;pool name&gt;/&lt;device name&gt;</code>). Не повинно бути довшим за 253 символи і може містити один або кілька піддоменів DNS, розділених слешами.</td>
    </tr>
    <tr>
      <td><code>shareID</code><br/><em>string</em></td>
      <td>ShareID унікально ідентифікує окрему частку виділення пристрою.</td>
    </tr>
  </tbody>
</table>

## AllocationResult {#AllocationResult}

AllocationResult містить атрибути виділеного ресурсу.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allocationTimestamp</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>AllocationTimestamp зберігає час, коли ресурси були виділені. Це поле не гарантується до встановлення, у такому випадку час невідомий. Це бета-поле і вимагає увімкнення функцій DRADeviceBindingConditions та DRAResourceClaimDeviceStatus.</td>
    </tr>
    <tr>
      <td><code>devices</code><br/><em><a href="{{< ref "#DeviceAllocationResult" >}}">DeviceAllocationResult</a></em></td>
      <td>Devices містить результат виділення пристроїв.</td>
    </tr>
    <tr>
      <td><code>nodeSelector</code><br/><em><a href="{{< ref "../definitions/node-selector-v1#NodeSelector" >}}">NodeSelector</a></em></td>
      <td>NodeSelector визначає, де доступні виділені ресурси. Якщо не встановлено, вони доступні скрізь.</td>
    </tr>
  </tbody>
</table>

## CapacityRequirements {#CapacityRequirements}

CapacityRequirements визначає вимоги до ємності для конкретного запиту пристрою.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>requests</code><br/><em>object</em></td>
      <td><p>Requests представляє індивідуальні запити ресурсів пристрою для різних ресурсів, всі з яких повинні бути надані пристроєм.</p>
      <p>Це значення використовується як додаткова умова фільтрації проти доступної ємності на пристрої. Це семантично еквівалентно селектору CEL з <code>device.capacity[&lt;domain&gt;].&lt;name&gt;.compareTo(quantity(&lt;request quantity&gt;)) >= 0</code>. Наприклад, <code>device.capacity['test-driver.cdi.k8s.io'].counters.compareTo(quantity('2')) >= 0</code>.</p>
      <p>Коли визначено requestPolicy, запитана кількість коригується вгору до найближчого допустимого значення на основі політики. Якщо запитана кількість не може бути скоригована до допустимого значення, тому що вона перевищує те, що дозволяє requestPolicy, пристрій вважається непридатним для виділення.</p>
      <p>Для будь-якої ємності, яка явно не запитується:</p>
      <ul>
        <li>Якщо requestPolicy не встановлено, споживана ємність зазвичай дорівнює повній ємності пристрою (тобто весь пристрій затребувано).</li>
        <li>Якщо requestPolicy встановлено, споживана ємність зазвичай визначається відповідно до цієї політики. Якщо пристрій дозволяє кілька виділень, агрегована кількість по всіх запитах не повинна перевищувати значення ємності. Споживана ємність, яка може бути скоригована на основі requestPolicy, якщо вона визначена, записується в поле status.devices[*].consumedCapacity ресурсу claim.</li>
      </ul>
    </tr>
  </tbody>
</table>

## DeviceAllocationConfiguration {#DeviceAllocationConfiguration}

DeviceAllocationConfiguration вбудовується в обʼєкт AllocationResult.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>opaque</code><br/><em><a href="{{< ref "device-class-v1#OpaqueDeviceConfiguration" >}}">OpaqueDeviceConfiguration</a></em></td>
      <td>Opaque надає параметри конфігурації, специфічні для драйвера.</td>
    </tr>
    <tr>
      <td><code>requests</code><br/><em>string array</em></td>
      <td>Requests перераховує імена запитів, до яких застосовується конфігурація. Якщо порожньо, конфігурація застосовується до всіх запитів. Посилання на підзапити повинні включати імʼя основного запиту і можуть включати підзапит у форматі &lt;main request&gt;[/&lt;subrequest&gt;]. Якщо вказано лише основний запит, конфігурація застосовується до всіх підзапитів.</td>
    </tr>
    <tr>
      <td><code>source</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Source записує, чи конфігурація походить від класу, і таким чином не є чимось, що звичайний користувач міг би встановити, або від запиту.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"FromClaim"</code></li>
        <li><code>"FromClass"</code></li>
      </ul>
      </td>
    </tr>
  </tbody>
</table>

## DeviceAllocationResult {#DeviceAllocationResult}

DeviceAllocationResult є результатом виділення пристроїв.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>config</code><br/><em><a href="{{< ref "#DeviceAllocationConfiguration" >}}">DeviceAllocationConfiguration array</a></em></td>
      <td>Це поле є комбінацією всіх параметрів конфігурації запиту та класу. Драйвери можуть відрізняти їх на основі прапорця. Це включає параметри конфігурації для драйверів, які не мають виділених пристроїв у результаті, оскільки це залежить від драйверів, які параметри конфігурації вони підтримують. Вони можуть мовчки ігнорувати невідомі параметри конфігурації.</td>
    </tr>
    <tr>
      <td><code>results</code><br/><em><a href="{{< ref "#DeviceRequestAllocationResult" >}}">DeviceRequestAllocationResult array</a></em></td>
      <td>Results перераховує всі виділені пристрої.</td>
    </tr>
  </tbody>
</table>

## DeviceClaim {#DeviceClaim}

DeviceClaim визначає, як запитувати пристрої за допомогою ResourceClaim.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>config</code><br/><em><a href="{{< ref "#DeviceClaimConfiguration" >}}">DeviceClaimConfiguration array</a></em></td>
      <td>Це поле містить конфігурацію для кількох потенційних драйверів, які можуть задовольнити запити у цій заявці. Воно ігнорується під час призначення заявки.</td>
    </tr>
    <tr>
      <td><code>constraints</code><br/><em><a href="{{< ref "#DeviceConstraint" >}}">DeviceConstraint array</a></em></td>
      <td>Ці обмеження повинні бути виконані набором пристроїв, які виділяються для заявки.</td>
    </tr>
    <tr>
      <td><code>requests</code><br/><em><a href="{{< ref "#DeviceRequest" >}}">DeviceRequest array</a></em></td>
      <td>Requests представляє окремі запити на різні пристрої, які всі повинні бути задоволені. Якщо порожньо, нічого не потрібно виділяти.</td>
    </tr>
  </tbody>
</table>

## DeviceClaimConfiguration {#DeviceClaimConfiguration}

DeviceClaimConfiguration використовується для параметрів конфігурації в DeviceClaim.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>opaque</code><br/><em><a href="{{< ref "device-class-v1#OpaqueDeviceConfiguration" >}}">OpaqueDeviceConfiguration</a></em></td>
      <td>Opaque надає параметри конфігурації, специфічні для драйвера.</td>
    </tr>
    <tr>
      <td><code>requests</code><br/><em>string array</em></td>
      <td>Requests перераховує імена запитів, до яких застосовується конфігурація. Якщо порожньо, конфігурація застосовується до всіх запитів. Посилання на підзапити повинні включати імʼя основного запиту і можуть включати підзапит у форматі &lt;main request&gt;[/&lt;subrequest&gt;]. Якщо вказано лише основний запит, конфігурація застосовується до всіх підзапитів.</td>
    </tr>
  </tbody>
</table>

## DeviceConstraint {#DeviceConstraint}

DeviceConstraint повинен мати тільки одне поле, встановлене крім Requests.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>distinctAttribute</code><br/><em>string</em></td>
      <td><p>DistinctAttribute вимагає, щоб усі відповідні пристрої мали цей атрибут, а його тип і значення були унікальними для всіх цих пристроїв.</p>
      <p>Коли функціональна можливість DRAListTypeAttributes увімкнена, порівняння здійснюється за семантикою множин (тобто порядок елементів та дублікати ігноруються): атрибути зі значенням у вигляді списку не повинні повторюватися на різних пристроях. Скалярні значення розглядаються як множини з одним елементом задля забезпечення зворотної сумісності.</p>
      <p>Це діє як протилежність MatchAttribute.</p>
      <p>Це обмеження використовується для уникнення розподілу кількох запитів на той самий пристрій, забезпечуючи диференціацію на рівні атрибутів.</p>
      <p>Це корисно для сценаріїв, де запити на ресурси повинні виконуватися окремими фізичними пристроями. Наприклад, контейнер запитує два мережеві інтерфейси, які повинні бути розподілені між двома різними фізичними мережевими картами.</p>
    </td>
    </tr>
    <tr>
      <td><code>matchAttribute</code><br/><em>string</em></td>
      <td><p>MatchAttribute вимагає, щоб усі пристрої, про які йдеться, мали цей атрибуту, а його тип і значення були однаковими для всіх цих пристроїв.</p>
      <p>Коли функціональна можливість DRAListTypeAttributes увімкнена, порівняння здійснюється за семантикою множин (тобто порядок елементів та дублікати ігноруються): атрибути зі значенням у вигляді списку збігаються, коли перетин усіх пристроїв непорожній. Скалярні значення розглядаються як множини з одним елементом задля забезпечення зворотної сумісності.</p>
      <p>Наприклад, якщо ви вказали "dra.example.com/numa" (гіпотетичний приклад!), то будуть обрані лише пристрої в одному й тому самому NUMA-вузлі. Пристрій, який не має цього атрибуту, не буде обраний. Усі пристрої повинні використовувати значення одного типу для цього атрибуту, оскільки це є частиною його специфікації, але якщо якийсь пристрій цього не робить, він також не буде обраний.</p>
      <p>Має включати доменний кваліфікатор.</p></td>
    </tr>
    <tr>
      <td><code>requests</code><br/><em>string array</em></td>
      <td><p>Requests є списком з одного або більше запитів у цій заявці, які мають спільно задовольняти цю умову. Якщо запит виконується кількома пристроями, то всі пристрої повинні відповідати цій умові. Якщо це не вказано, ця умова застосовується до всіх запитів у заявці.</p>
      <p>Посилання на підзапити повинні включати імʼя основного запиту і можуть включати підзапит у форматі &lt;main request&gt;[/&lt;subrequest&gt;]. Якщо вказано лише основний запит, обмеження застосовується до всіх підзапитів.</p></td>
    </tr>
  </tbody>
</table>

## DeviceRequest {#DeviceRequest}

DeviceRequest є запитом на пристрої, необхідні для задоволення заявки. Зазвичай це заявка на один ресурс, такий як пристрій, але також може бути заявка на кілька ідентичних пристроїв. За допомогою FirstAvailable також можливо надати пріоритетний список запитів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>exactly</code><br/><em><a href="{{< ref "#ExactDeviceRequest" >}}">ExactDeviceRequest</a></em></td>
      <td>Exactly вказує деталі для одного запиту, який повинен бути виконаний точно для задоволення запиту. Потрібно встановити одне з полів Exactly або FirstAvailable.</td>
    </tr>
    <tr>
      <td><code>firstAvailable</code><br/><em><a href="{{< ref "#DeviceSubRequest" >}}">DeviceSubRequest array</a></em></td>
      <td><p>FirstAvailable містить підзапити, з яких планувальник вибере тільки один. Він намагається задовольнити їх у порядку, в якому вони перелічені тут. Тому, якщо в списку два записи, планувальник перевірить другий лише тоді, якщо визначить, що перший не може бути використаний.</p>
      <p>DRA ще не виконує оцінювання, тому планувальник вибере перший набір пристроїв, який задовольняє всі запити в заявці. І якщо вимоги можуть бути задоволені на більш ніж одному вузлі, інші функції планування визначать, який вузол буде обраний. Це означає, що набір пристроїв, виділених для заявки, може не бути оптимальним набором, доступним у кластері. Оцінювання буде реалізовано пізніше.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td><p>Name може використовуватись для посилання на цей запит у записі pod.spec.containers[].resources.claims та в обмеженні заявки.</p>
      <p>Посилання з використанням імені в DeviceRequest унікально ідентифікує запит, коли встановлено поле Exactly. Коли встановлено поле FirstAvailable, посилання на імʼя DeviceRequest відповідатиме будь-якому підзапиту, обраному планувальником.</p>
      <p>Має бути міткою DNS.</p></td>
    </tr>
  </tbody>
</table>

## DeviceRequestAllocationResult {#DeviceRequestAllocationResult}

DeviceRequestAllocationResult містить результат розподілу для одного запиту.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>adminAccess</code><br/><em>boolean</em></td>
      <td>AdminAccess вказує, що цей пристрій був виділений для адміністративного доступу. Див. відповідне поле запиту для визначення режиму. Адміністративний доступ вимкнено, якщо це поле не встановлено або встановлено в false, інакше він увімкнено.</td>
    </tr>
    <tr>
      <td><code>bindingConditions</code><br/><em>string array</em></td>
      <td>BindingConditions містить копію BindingConditions з відповідного ResourceSlice на момент виділення. Це бета-поле і вимагає увімкнення функціональних можливостей DRADeviceBindingConditions та DRAResourceClaimDeviceStatus.</td>
    </tr>
    <tr>
      <td><code>bindingFailureConditions</code><br/><em>string array</em></td>
      <td>BindingFailureConditions містить копію BindingFailureConditions з відповідного ResourceSlice на момент виділення. Це бета-поле і вимагає увімкнення функціональних можливостей DRADeviceBindingConditions та DRAResourceClaimDeviceStatus.</td>
    </tr>
    <tr>
      <td><code>consumedCapacity</code><br/><em>object</em></td>
      <td><p>ConsumedCapacity відстежує кількість спожитої ємності на пристрій у рамках запиту на виділення. Спожита кількість може відрізнятися від запитаної: вона округлюється до найближчого допустимого значення на основі requestPolicy пристрою, якщо це застосовно (тобто не може бути менше запитаної кількості).</p>
      <p>Загальна спожита ємність для кожного пристрою не повинна перевищувати значення DeviceCapacity.</p>
      <p>Це поле заповнюється лише для пристроїв, які дозволяють кілька виділень. Всі записи про ємність включені, навіть якщо спожита кількість дорівнює нулю.</p></td>
    </tr>
    <tr>
      <td><code>device</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Device references one device instance via its name in the driver's resource pool. It must be a DNS label.</td>
    </tr>
    <tr>
      <td><code>driver</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td><p>Driver визначає імʼя драйвера DRA, втулок kubelet якого повинен бути викликаний для обробки виділення, коли запит потрібен на вузлі.</p>
      <p>Має бути піддоменом DNS і повинен закінчуватися доменом DNS, що належить постачальнику драйвера. Повинні використовуватися лише малі літери.</p></td>
    </tr>
    <tr>
      <td><code>pool</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td><p>Це імʼя разом з імʼям драйвера та імʼям пристрою визначає, який пристрій був виділений (<code>&lt;driver name&gt;/&lt;pool name&gt;/&lt;device name&gt;</code>).</p>
      <p>Не повинно перевищувати 253 символи і може містити один або кілька піддоменів DNS, розділених слешами.</p></td>
    </tr>
    <tr>
      <td><code>request</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Request є імʼям запиту в заявці, який спричинив виділення цього пристрою. Якщо він посилається на підзапит у списку firstAvailable у DeviceRequest, це поле повинно включати як імʼя основного запиту, так і підзапиту, використовуючи формат &lt;main request&gt;/&lt;subrequest&gt;. Може бути виділено кілька пристроїв на один запит.</td>
    </tr>
    <tr>
      <td><code>shareID</code><br/><em>string</em></td>
      <td>ShareID унікально ідентифікує окрему частку виділення пристрою, використовується, коли пристрій підтримує кілька одночасних виділень. Служить додатковим ключем мапи для розрізнення одночасних часток одного й того ж пристрою.</td>
    </tr>
    <tr>
      <td><code>tolerations</code><br/><em><a href="{{< ref "#DeviceToleration" >}}">DeviceToleration array</a></em></td>
      <td>Копія всіх толерацій, зазначених у запиті на момент виділення пристрою. Максимальна кількість толерацій — 16. Це бета-поле і вимагає увімкнення функціональної можливості DRADeviceTaints.</td>
    </tr>
  </tbody>
</table>

## DeviceSubRequest {#DeviceSubRequest}

DeviceSubRequest описує запит на пристрій, наданий у масиві claim.spec.devices.requests[].firstAvailable. Кожен елемент зазвичай є запитом на один ресурс, наприклад, пристрій, але також може запитувати кілька ідентичних пристроїв.

DeviceSubRequest схожий на ExactDeviceRequest, але не розкриває поле AdminAccess, оскільки воно підтримується лише при запиті конкретного пристрою.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allocationMode</code><br/><em>string</em></td>
      <td><p>AllocationMode та повʼязані з ним поля визначають, як пристрої виділяються для задоволення цього підзапиту. Підтримувані значення:</p>
      <ul>
        <li>ExactCount: Цей запит стосується конкретної кількості пристроїв. Це стандартне значення. Точна кількість вказується в полі count.</li>
        <li>All: Цей підзапит стосується всіх відповідних пристроїв у пулі. Виділення не вдасться, якщо деякі пристрої вже виділені, якщо не запитано adminAccess.</li>
      </ul>
      <p>Якщо AllocationMode не вказано, стандартний режим — ExactCount. Якщо режим ExactCount і count не вказано, стандартне значення — один. Будь-які інші підзапити повинні вказувати це поле.</p>
      <p>У майбутньому можуть бути додані інші режими. Клієнти повинні відмовлятися обробляти запити з невідомими режимами.</p>
      <p>Можливі значення enum:</p>
      <ul>
        <li>`All`</li>
        <li>`ExactCount`</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>capacity</code><br/><em><a href="{{< ref "#CapacityRequirements" >}}">CapacityRequirements</a></em></td>
      <td><p>Capacity визначає вимоги до ресурсів для кожної ємності.</p>
      <p>Якщо це поле не встановлено і пристрій підтримує кілька виділень, стандартне значення буде застосовано до кожної ємності відповідно до requestPolicy. Для ємності, яка не має requestPolicy, стандартне значення — повне значення ємності.</p>
      <p>Застосовується до кожного виділення пристрою. Якщо Count &gt; 1, запит не вдасться, якщо немає достатньої кількості пристроїв, що відповідають вимогам. Якщо AllocationMode встановлено на All, запит не вдасться, якщо є пристрої, які інакше відповідають запиту, і мають цю ємність, зі значенням &gt;= запитаного, але які не можуть бути виділені для цього запиту.</p></td>
    </tr>
    <tr>
      <td><code>count</code><br/><em>integer</em></td>
      <td>Count використовується лише тоді, коли режим підрахунку — "ExactCount". Має бути більше нуля. Якщо AllocationMode встановлено на ExactCount і це поле не вказано, стандартне значення — один.</td>
    </tr>
    <tr>
      <td><code>deviceClassName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td><p>DeviceClassName посилається на конкретний DeviceClass, який може визначати додаткову конфігурацію та селектори, які будуть успадковані цим підзапитом.</p>
      <p>Клас є обовʼязковим. Доступні класи залежать від кластера.</p><p>Адміністратори можуть використовувати це для обмеження, які пристрої можуть бути запитані, встановлюючи лише класи з селекторами для дозволених пристроїв. Якщо користувачі можуть запитувати будь-що без обмежень, адміністратори можуть створити порожній DeviceClass для користувачів для посилання.</p></td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td><p>Name може використовуватися для посилання на цей підзапит у списку обмежень або списку конфігурацій для запиту. Посилання повинні використовувати формат &lt;main request&gt;/&lt;subrequest&gt;.</p><p>Повинно бути DNS-міткою.</p></td>
    </tr>
    <tr>
      <td><code>selectors</code><br/><em><a href="{{< ref "device-class-v1#DeviceSelector" >}}">DeviceSelector array</a></em></td>
      <td>Selectors визначають критерії, які повинні бути виконані конкретним пристроєм, щоб цей пристрій був розглянутий для цього підзапиту. Всі селектори повинні бути виконані, щоб пристрій був розглянутий.</td>
    </tr>
    <tr>
      <td><code>tolerations</code><br/><em><a href="{{< ref "#DeviceToleration" >}}">DeviceToleration array</a></em></td>
      <td><p>Якщо вказано, толерації запиту.</p>
      <p>Толерації для NoSchedule потрібні для виділення пристрою, який має позначку taint з цим ефектом. Те ж саме стосується NoExecute.</p>
      <p>Крім того, якщо будь-який з виділених пристроїв отримає taint NoExecute після виділення і цей ефект не толерується, тоді всі поди, що використовують ResourceClaim, будуть видалені для їх виселення. Планувальник не дозволить новим подам резервувати запит, поки він має ці позначені taint пристрої. Після виселення всіх подів, запит буде деактивовано.</p>
      <p>Максимальна кількість толерацій — 16.</p>
      <p>Це бета-поле і вимагає увімкнення функціональної можливості DRADeviceTaints</p>.</td>
    </tr>
  </tbody>
</table>

## DeviceToleration {#DeviceToleration}

ResourceClaim, до якого приєднано цей DeviceToleration, допускає будь-який taint, що відповідає трійці &lt;key,value,effect&gt; за допомогою оператора зіставлення &lt;operator&gt;.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>effect</code><br/><em>string</em></td>
      <td>Effect вказує ефект taint, який має мати збіг. Порожнє значення означає відповідність всім ефектам taint. Якщо вказано, дозволені значення: NoSchedule та NoExecute.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"NoExecute"</code> Виселити будь-які вже запущені поди, які не толерують taint пристрою.</li>
        <li><code>"NoSchedule"</code> Не дозволяти новим подам плануватися на використання пристрою позначеного taint, якщо вони не толерують taint, але дозволяти всім подам, поданим до Kubelet без проходження через планувальник, запускатися, і дозволяти всім вже запущеним подам продовжувати працювати.</li>
        <li><code>"None"</code> Без ефекту, taint є чисто інформаційним.</li>
      </ul>
      </td>
    </tr>
    <tr>
      <td><code>key</code><br/><em>string</em></td>
      <td>Key є ключем taint, до якого застосовується толерантність. Порожнє значення означає відповідність всім ключам taint. Якщо ключ порожній, оператор повинен бути Exists; ця комбінація означає відповідність всім значенням і всім ключам. Має бути імʼям мітки.</td>
    </tr>
    <tr>
      <td><code>operator</code><br/><em>string</em></td>
      <td>Operator представляє відношення ключа до значення. Дійсні оператори: Exists та Equal. Стандартно використовується Equal. Exists еквівалентний символу підстановки для значення, щоб ResourceClaim міг толерувати всі taint певної категорії.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Equal"</code> Значення повинно точно збігатися.</li>
        <li><code>"Exists"</code> Існування ключа достатньо для відповідності.</li>
      </ul>
      </td>
    </tr>
    <tr>
      <td><code>tolerationSeconds</code><br/><em>integer</em></td>
      <td>TolerationSeconds представляє період часу, протягом якого толерантність (яка повинна мати ефект NoExecute, інакше це поле ігнорується) толерує taint. Стандартно не встановлено, що означає толерувати taint назавжди (не виселяти). Нульові та відʼємні значення будуть розглядатися як 0 (виселити негайно) системою. Якщо більше нуля, час, коли под потрібно виселити, обчислюється як &lt;time when taint was added&gt; + &lt;toleration seconds&gt;.</td>
    </tr>
    <tr>
      <td><code>value</code><br/><em>string</em></td>
      <td>Value є значенням taint, до якого застосовується толерантність. Якщо оператор Exists, значення повинно бути порожнім, інакше це просто звичайний рядок. Має бути значенням мітки.</td>
    </tr>
  </tbody>
</table>

## ExactDeviceRequest {#ExactDeviceRequest}

ExactDeviceRequest є запитом на один або декілька ідентичних пристроїв.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>adminAccess</code><br/><em>boolean</em></td>
      <td><p>AdminAccess вказує, що це запит на адміністративний доступ до пристрою(ів). Очікується, що заявки з AdminAccess використовуватимуться для моніторингу або інших служб управління пристроєм.</p>
      <p>Вони ігнорують всі звичайні запити до пристрою щодо режимів доступу та будь-яких виділень ресурсів.</p>
      <p>Адміністративний доступ вимкнено, якщо це поле не встановлено або встановлено в false, інакше він увімкнений.</p></td>
    </tr>
    <tr>
      <td><code>allocationMode</code><br/><em>string</em></td>
      <td><p>AllocationMode та повʼязані з ним поля визначають, як пристрої виділяються для задоволення цього запиту. Підтримувані значення:</p>
      <ul>
        <li><code>ExactCount</code>: Цей запит стосується конкретної кількості пристроїв. Це стандартне значення. Точна кількість вказується у полі count.</li>
        <li><code>All</code>: Цей запит стосується всіх відповідних пристроїв у пулі. Принаймні один пристрій повинен існувати на вузлі для успішного виділення.</li>
      </ul>
      <p>Розподіл завершиться невдачею, якщо деякі пристрої вже розподілені, за винятком випадків, коли запитується доступ адміністратора (adminAccess). Якщо параметр AllocationMode не вказано, зазвичай використовується режим ExactCount. Якщо встановлено режим ExactCount, а кількість (count) не вказано, стандартною кількістю вважається одиниця. У всіх інших запитах це поле має бути обовʼязково вказано.</p>
      <p>Можуть бути додані нові режими в майбутньому. Клієнти повинні відмовитися від обробки запитів із невідомими режимами.</p>
      <p>Можливі значення enum:
      <ul>
        <li><code>"All"</code></li>
        <li><code>"ExactCount"</code></li>
      </ul>
      </p></td>
    </tr>
    <tr>
      <td><code>capacity</code><br/><em><a href="{{< ref "#CapacityRequirements" >}}">CapacityRequirements</a></em></td>
      <td><p>Capacity визначає вимоги до ресурсів для кожної ємності.</p>
      <p>Якщо поле не встановлено і пристрій підтримує кілька виділень, стандартне значення буде застосовано до кожної ємності відповідно до requestPolicy. Для ємності, яка не має requestPolicy, стандартне значення дорівнює повній ємності.</p>
      <p>Застосовується до кожного виділення пристрою. Якщо Count &gt; 1, запит не вдасться, якщо немає достатньої кількості пристроїв, що відповідають вимогам. Якщо AllocationMode встановлено на All, запит не вдасться, якщо є пристрої, які інакше відповідають запиту, і мають цю ємність, зі значенням &gt;= запитаного, але які не можуть бути виділені для цього запиту.</p></td>
    </tr>
    <tr>
      <td><code>count</code><br/><em>integer</em></td>
      <td>Count використовується лише тоді, коли режим підрахунку встановлено на "ExactCount". Має бути більше нуля. Якщо AllocationMode встановлено на ExactCount і це поле не вказано, за замовчуванням використовується один.</td>
    </tr>
    <tr>
      <td><code>deviceClassName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td><p>DeviceClassName посилається на конкретний DeviceClass, який може визначати додаткову конфігурацію та селектори, що успадковуються цим запитом.</p>
      <p>DeviceClassName є обовʼязковим.</p>
      <p>Адміністратори можуть використовувати це для обмеження, які пристрої можуть бути запитані, встановлюючи лише класи з селекторами для дозволених пристроїв. Якщо користувачі можуть запитувати будь-що без обмежень, адміністратори можуть створити порожній DeviceClass для посилання користувачів.</p></td>
    </tr>
    <tr>
      <td><code>selectors</code><br/><em><a href="{{< ref "device-class-v1#DeviceSelector" >}}">DeviceSelector array</a></em></td>
      <td>Selectors визначають критерії, які повинні бути виконані конкретним пристроєм, щоб цей пристрій був розглянутий для цього запиту. Всі селектори повинні бути виконані, щоб пристрій був розглянутий.</td>
    </tr>
    <tr>
      <td><code>tolerations</code><br/><em><a href="{{< ref "#DeviceToleration" >}}">DeviceToleration array</a></em></td>
      <td><p>Якщо вказано, толерантності запиту.</p>
      <p>Толерантності для NoSchedule потрібні для виділення пристрою, який має taint з цим ефектом. Те ж саме стосується NoExecute.</p>
      <p>Крім того, якщо будь-який з виділених пристроїв отримає taint з NoExecute після виділення і цей ефект не толерується, тоді всі поди, що використовують ResourceClaim, будуть видалені для їх виселення. Планувальник не дозволить новим подам резервувати запит, поки він має ці, позначені taint, пристрої. Після виселення всіх подів, запит буде деактивовано.</p>
      <p>Максимальна кількість толерантностей — 16.</p>
      <p>Це бета-поле і вимагає увімкнення функціональної можливості DRADeviceTaints.</p></td>
    </tr>
  </tbody>
</table>

## NetworkDeviceData {#NetworkDeviceData}

NetworkDeviceData надає деталі, повʼязані з мережею, для виділеного пристрою. Ця інформація може бути заповнена драйверами або іншими компонентами для налаштування або ідентифікації пристрою в контексті мережі.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>hardwareAddress</code><br/><em>string</em></td>
      <td><p>HardwareAddress представляє апаратну адресу (наприклад, MAC-адресу) мережевого інтерфейсу пристрою.</p>
      <p>Не повинна перевищувати 128 байт.</p></td>
    </tr>
    <tr>
      <td><code>interfaceName</code><br/><em>string</em></td>
      <td><p>InterfaceName вказує назву мережевого інтерфейсу, повʼязаного з виділеним пристроєм. Це може бути назва фізичного або віртуального мережевого інтерфейсу, який налаштовується в поді.</p>
      <p>Не повинна перевищувати 256 байт.</p></td>
    </tr>
    <tr>
      <td><code>ips</code><br/><em>string array</em></td>
      <td><p>IPs список мережевих адрес, призначених мережевому інтерфейсу пристрою. Це може включати як IPv4, так і IPv6 адреси. IP-адреси вказуються в нотації CIDR, яка включає як адресу, так і відповідну маску підмережі. Наприклад: "192.0.2.5/24" для IPv4 та "2001:db8::5/64" для IPv6.</p></td>
    </tr>
  </tbody>
</table>

## ResourceClaimConsumerReference {#ResourceClaimConsumerReference}

ResourceClaimConsumerReference містить достатньо інформації, щоб дозволити вам знайти споживача ResourceClaim. Користувач повинен бути ресурсом у тому ж просторі імен, що й ResourceClaim.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroup</code><br/><em>string</em></td>
      <td>APIGroup є групою для ресурсу, на який посилаються. Для основного API вона порожня. Це відповідає групі в APIVersion, яка використовується при створенні ресурсів.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name є назвою ресурсу, на який посилаються.</td>
    </tr>
    <tr>
      <td><code>resource</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Resource є типом ресурсу, на який посилаються, наприклад "pods".</td>
    </tr>
    <tr>
      <td><code>uid</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>UID ідентифікує точно одну інкарнацію ресурсу.</td>
    </tr>
  </tbody>
</table>

## Операції {#Operations}

---

### `post` Create

#### HTTP Запит {#http-request}

POST /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims

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
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
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
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch

#### HTTP Запит {#http-request-1}

PATCH /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}

#### Параметри шляху {#path-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceClaim</td>
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
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace

#### HTTP Запит {#http-request-2}

PUT /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}

#### Параметри шляху {#path-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceClaim</td>
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
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
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
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete

#### HTTP Запит {#http-request-3}

DELETE /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}

#### Параметри шляху {#path-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceClaim</td>
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
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete Collection

#### HTTP Запит {#http-request-4}

DELETE /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims

#### Параметри шляху {#path-parameters-4}

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

GET /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}

#### Параметри шляху {#path-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceClaim</td>
    </tr>
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
  </tbody>
</table>

#### Відповідь {#response-5}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
  </tbody>
</table>

### `get` List

#### HTTP Запит {#http-request-6}

GET /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims

#### Параметри шляху {#path-parameters-6}

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
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaimList" >}}">ResourceClaimList</a></em></td>
    </tr>
  </tbody>
</table>

### `get` List All Namespaces

#### HTTP Запит {#http-request-7}

GET /apis/resource.k8s.io/v1/resourceclaims

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
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaimList" >}}">ResourceClaimList</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch

#### HTTP Запит {#http-request-8}

GET /apis/resource.k8s.io/v1/watch/namespaces/{namespace}/resourceclaims/{name}

#### Параметри шляху {#path-parameters-7}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceClaim</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

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

### `get` Watch List

#### HTTP Запит {#http-request-9}

GET /apis/resource.k8s.io/v1/watch/namespaces/{namespace}/resourceclaims

#### Параметри шляху {#path-parameters-8}

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

### `get` Watch List All Namespaces

#### HTTP Запит {#http-request-10}

GET /apis/resource.k8s.io/v1/watch/resourceclaims

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

### `patch` Patch Status

#### HTTP Запит {#http-request-11}

PATCH /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}/status

#### Параметри шляху {#path-parameters-9}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceClaim</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-11}

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

#### Параметри тіла запиту {#body-parameters-5}

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

#### Відповідь {#response-11}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Read Status

#### HTTP Запит {#http-request-12}

GET /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}/status

#### Параметри шляху {#path-parameters-10}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceClaim</td>
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
  </tbody>
</table>

#### Відповідь {#response-12}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace Status

#### HTTP Запит {#http-request-13}

PUT /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaims/{name}/status

#### Параметри шляху {#path-parameters-11}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceClaim</td>
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

#### Параметри тіла запиту {#body-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
      <td></td>
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
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "resource-claim-v1#ResourceClaim" >}}">ResourceClaim</a></em></td>
    </tr>
  </tbody>
</table>
