---
api_metadata:
  apiVersion: "resource.k8s.io/v1"
  import: "k8s.io/api/resource/v1"
  kind: "ResourceSlice"
content_type: "api_reference"
description: |
  ResourceSlice представляє один або кілька ресурсів у пулі подібних ресурсів, керованих спільним драйвером. Пул може охоплювати більше одного ResourceSlice, і точно визначити, скільки ResourceSlice складають пул, визначає драйвер.

  На даний момент єдині підтримувані ресурси — це пристрої з атрибутами та ємностями (capacities). Кожен пристрій у даному пулі, незалежно від того, скільки ResourceSlice, повинен мати унікальне імʼя. ResourceSlice, у якому публікується пристрій, може змінюватися з часом. Унікальний ідентифікатор для пристрою — це кортеж &lt;імʼя драйвера&gt;, &lt;імʼя пулу&gt;, &lt;імʼя пристрою&gt;.

  Щоразу, коли драйвер потребує оновлення пулу, він збільшує номер pool.Spec.Pool.Generation і оновлює всі ResourceSlices з новим номером та новими визначеннями ресурсів. Споживач повинен використовувати лише ResourceSlices з найвищим номером покоління і ігнорувати всі інші.

  При виділенні всіх ресурсів у пулі, що відповідають певним критеріям, або при пошуку найкращого рішення серед кількох різних альтернатив, споживач повинен перевірити кількість ResourceSlices у пулі (включених у кожен ResourceSlice), щоб визначити, чи є його уявлення про пул повним, і якщо ні, слід чекати, поки драйвер завершить оновлення пулу.

  Для ресурсів, які не є локальними для вузла, імʼя вузла не встановлюється. Замість цього драйвер може використовувати селектор вузла, щоб вказати, де доступні пристрої.
title: "ResourceSlice"
weight: 60
auto_generated: false
---

`apiVersion: resource.k8s.io/v1`

`import "k8s.io/api/resource/v1"`

## ResourceSlice {#ResourceSlice}

ResourceSlice представляє один або кілька ресурсів у пулі подібних ресурсів, керованих спільним драйвером. Пул може охоплювати більше одного ResourceSlice, і точно визначити, скільки ResourceSlices складають пул, визначає драйвер.

На даний момент єдині підтримувані ресурси — це пристрої з атрибутами та ємностями (capacities). Кожен пристрій у даному пулі, незалежно від того, скільки ResourceSlices, повинен мати унікальне імʼя. ResourceSlice, у якому публікується пристрій, може змінюватися з часом. Унікальний ідентифікатор для пристрою — це кортеж &lt;імʼя драйвера&gt;, &lt;імʼя пулу&gt;, &lt;імʼя пристрою&gt;.

Щоразу, коли драйвер потребує оновлення пулу, він збільшує номер pool.Spec.Pool.Generation і оновлює всі ResourceSlices з новим номером та новими визначеннями ресурсів. Споживач повинен використовувати лише ResourceSlices з найвищим номером покоління і ігнорувати всі інші.

Коли виділяються всі ресурси в пулі, що відповідають певним критеріям, або коли шукається найкраще рішення серед кількох різних альтернатив, споживач повинен перевірити кількість ResourceSlices у пулі (включених у кожен ResourceSlice), щоб визначити, чи є його уявлення про пул повним, і якщо ні, слід чекати, поки драйвер завершить оновлення пулу.

Для ресурсів, які не є локальними для вузла, імʼя вузла не встановлюється. Замість цього драйвер може використовувати селектор вузла, щоб вказати, де доступні пристрої.

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
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#ResourceSliceSpec" >}}">ResourceSliceSpec</a></em></td>
      <td>Містить інформацію, опубліковану драйвером. Зміна spec автоматично збільшує номер metadata.generation.</td>
    </tr>
  </tbody>
</table>

## ResourceSliceSpec {#ResourceSliceSpec}

ResourceSliceSpec містить інформацію, опубліковану драйвером в одному ResourceSlice.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allNodes</code><br/><em>boolean</em></td>
      <td><p>AllNodes вказує, що всі вузли мають доступ до ресурсів у пулі.</p>
      <p>Тільки один з NodeName, NodeSelector, AllNodes та PerDeviceNodeSelection повинен бути встановлений.</p></td>
    </tr>
    <tr>
      <td><code>devices</code><br/><em><a href="{{< ref "#Device" >}}">Device array</a></em></td>
      <td><p>Devices перелічує деякі або всі пристрої в цьому пулі.</p>
      <p>Не повинно бути більше 128 записів. Якщо будь-який пристрій використовує taints або споживає лічильники, обмеження становить 64.</p>
      <p>Тільки один з Devices та SharedCounters може бути встановлений у ResourceSlice.</p></td>
    </tr>
    <tr>
      <td><code>driver</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td><p>Driver визнає DRA драйвер, який надає інформацію про ємність. Можна використовувати селектор полів, щоб перелічити лише обʼєкти ResourceSlice з певним імʼям драйвера.</p>
      <p>Повинно бути DNS-піддоменом і закінчуватися DNS-доменом, що належить постачальнику драйвера. Повинно використовувати лише малі літери. Це поле є незмінним.</p></td>
    </tr>
    <tr>
      <td><code>nodeName</code><br/><em>string</em></td>
      <td><p>NodeName вказує вузол, який надає ресурси в цьому пулі. Можна використовувати селектор полів, щоб перелічити лише обʼєкти ResourceSlice, що належать певному вузлу.</p>
      <p>Це поле можна використовувати для обмеження доступу вузлів до ResourceSlices з однаковим імʼям вузла. Воно також вказує автомасштабувальникам, що додавання нових вузлів того ж типу, що й деякі старі вузли, може також зробити доступними нові ресурси.</p>
      <p>Тільки один з NodeName, NodeSelector, AllNodes та PerDeviceNodeSelection повинен бути встановлений. Це поле є незмінним.</p></td>
    </tr>
    <tr>
      <td><code>nodeSelector</code><br/><em><a href="{{< ref "../definitions/node-selector-v1#NodeSelector" >}}">NodeSelector</a></em></td>
      <td><p>NodeSelector визначає, які вузли мають доступ до ресурсів у пулі, коли цей пул не обмежений одним вузлом.</p>
      <p>Має тільки один термін.</p>
      <p>Тільки один з NodeName, NodeSelector, AllNodes та PerDeviceNodeSelection повинен бути встановлений.</p></td>
    </tr>
    <tr>
      <td><code>perDeviceNodeSelection</code><br/><em>boolean</em></td>
      <td><p>PerDeviceNodeSelection визначає, чи доступ вузлів до ресурсів у пулі встановлюється на рівні ResourceSlice або на кожному пристрої. Якщо встановлено значення true, кожен пристрій, визначений у ResourceSlice, повинен вказати це окремо.</p>
      <p>Тільки один з NodeName, NodeSelector, AllNodes та PerDeviceNodeSelection повинен бути встановлений.</p></td>
    </tr>
    <tr>
      <td><code>pool</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#ResourcePool" >}}">ResourcePool</a></em></td>
      <td>Pool описує пул, до якого належить цей ResourceSlice.</td>
    </tr>
    <tr>
      <td><code>sharedCounters</code><br/><em><a href="{{< ref "#CounterSet" >}}">CounterSet array</a></em></td>
      <td><p>SharedCounters визначає список наборів лічильників, кожен з яких має імʼя та список доступних лічильників.</p>
      <p>Імена наборів лічильників повинні бути унікальними в ResourcePool. Тільки один з Devices та SharedCounters може бути встановлений у ResourceSlice. Максимальна кількість наборів лічильників становить 8.</p></td>
    </tr>
  </tbody>
</table>

## ResourceSliceList {#ResourceSliceList}

ResourceSliceList is a collection of ResourceSlices.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>items</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice array</a></em></td>
      <td>Items визначає список ресурсів ResourceSlices.</td>
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

## CapacityRequestPolicy {#CapacityRequestPolicy}

CapacityRequestPolicy визначає, як запити споживають ємність пристрою.

Не можна встановлювати більше одного ValidRequestValues.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>default</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td>Default визначає, скільки цієї ємності споживається запитом, який не містить запису для неї в Capacity DeviceRequest.</td>
    </tr>
    <tr>
      <td><code>validRange</code><br/><em><a href="{{< ref "#CapacityRequestPolicyRange" >}}">CapacityRequestPolicyRange</a></em></td>
      <td><p>ValidRange визначає допустимий діапазон значень кількості в запитах на споживання.</p>
      <p>Якщо це поле встановлено, Default повинен бути визначений і він повинен потрапляти в межі визначеного ValidRange.</p>
      <p>Якщо запитана кількість не потрапляє в межі визначеного діапазону, запит порушує політику, і цей пристрій не може бути виділений.</p>
      <p>Якщо запит не містить цього запису про ємність, використовується стандартне значення.</p></td>
    </tr>
    <tr>
      <td><code>validValues</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity array</a></em></td>
      <td><p>ValidValues визначає набір допустимих значень кількості в запитах на споживання.</p>
      <p>Не може містити більше 10 записів. Повинно бути відсортовано за зростанням.</p>
      <p>Якщо це поле встановлено, Default повинен бути визначений і він повинен входити до списку ValidValues.</p>
      <p>Якщо запитана кількість не відповідає жодному допустимому значенню, але менша за деякі допустимі значення, планувальник обчислює найменше допустиме значення, яке більше або дорівнює запиту. Тобто: min(ceil(requestedValue) ∈ validValues), де requestedValue ≤ max(validValues).</p>
      <p>Якщо запитана кількість перевищує всі допустимі значення, запит порушує політику, і цей пристрій не може бути виділений.</p></td>
    </tr>
  </tbody>
</table>

## CapacityRequestPolicyRange {#CapacityRequestPolicyRange}

CapacityRequestPolicyRange визначає допустимий діапазон значень споживаної ємності.

- Якщо запитана кількість менша за Min, вона округлюється до значення Min.
- Якщо Step встановлено, а запитана кількість знаходиться між Min і Max, але не відповідає Step, вона буде округлена до наступного значення, рівного Min + (n * Step).
- Якщо Step не встановлено, запитана кількість використовується як є, якщо вона знаходиться в діапазоні від Min до Max (якщо встановлено).
- Якщо запитана або округлена кількість перевищує Max (якщо встановлено), запит не відповідає політиці, і пристрій не може бути виділений.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>max</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td><p>Max визначає верхню межу ємності, яку можна запитати.</p>
      <p>Max повинен бути меншим або рівним значенню ємності. Min і requestPolicy.default повинні бути меншими або рівними максимуму.</p></td>
    </tr>
    <tr>
      <td><code>min</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td><p>Min визначає мінімальну ємність, дозволену для запиту на споживання.</p>
      <p>Min повинен бути більшим або рівним нулю та меншим або рівним значенню ємності. requestPolicy.default повинен бути більшим або рівним мінімуму.</p></td>
    </tr>
    <tr>
      <td><code>step</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td><p>Step визначає крок між допустимими значеннями ємності в межах діапазону.</p>
      <p>Max (якщо встановлено) та requestPolicy.default повинні бути кратними Step. Min + Step повинно бути меншим або рівним значенню ємності.</p></td>
    </tr>
  </tbody>
</table>

## Counter {#Counter}

Counter описує кількість, повʼязану з пристроєм.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>value</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td>Value визначає, скільки певного лічильника пристрою доступно.</td>
    </tr>
  </tbody>
</table>

## CounterSet {#CounterSet}

CounterSet визначає іменований набір лічильників, які доступні для використання пристроями, визначеними в ResourcePool.

Лічильники самі по собі не можуть бути виділені, але можуть бути посиланням для пристроїв. Коли пристрій виділяється, частина лічильників, яку він використовує, більше не буде доступна для використання іншими пристроями.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>counters</code>&nbsp;<strong>*</strong><br/><em>object</em></td>
      <td><p>Counters визначає набір лічильників для цього CounterSet.</p>
      <p>Імʼя кожного лічильника повинно бути унікальним у цьому наборі та відповідати DNS-мітці. Максимальна кількість лічильників — 32.</p></td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td><p>Name визначає імʼя набору лічильників.</p>
      <p>Воно повинно бути DNS-міткою.</p></td>
    </tr>
  </tbody>
</table>

## Device {#Device}

Device представляє один окремий апаратний екземпляр, який можна вибрати на основі його атрибутів. Крім імені, має бути встановлено тільки одне поле.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allNodes</code><br/><em>boolean</em></td>
      <td><p>AllNodes вказує, що всі вузли мають доступ до пристрою.</p>
      <p>Має бути встановлено лише якщо Spec.PerDeviceNodeSelection встановлено в true. Можна встановити не більше одного з NodeName, NodeSelector та AllNodes.</p></td>
    </tr>
    <tr>
      <td><code>allowMultipleAllocations</code><br/><em>boolean</em></td>
      <td><p>AllowMultipleAllocations вказує, чи дозволено виділяти пристрій для кількох DeviceRequests.</p>
      <p>Якщо AllowMultipleAllocations встановлено в true, пристрій може бути виділений більше одного разу, і вся його ємність буде споживана, незалежно від того, чи визначено requestPolicy чи ні.</p></td>
    </tr>
    <tr>
      <td><code>attributes</code><br/><em>object</em></td>
      <td><p>Attributes визначає набір атрибутів для цього пристрою.</p>
      <p>Імʼя кожного атрибуту повинно бути унікальним у цьому наборі.</p>
      <p>Максимальна кількість атрибутів та ємностей разом становить 32.</p></td>
    </tr>
    <tr>
      <td><code>bindingConditions</code><br/><em>string array</em></td>
      <td><p>BindingConditions визначає умови для продовження привʼязки.</p>
      <p>Всі ці умови повинні бути встановлені в умовах стану кожного пристрою зі значенням True, щоб продовжити привʼязку пода до вузла під час планування пода.</p>
      <p>Максимальна кількість умов привʼязки становить 4.</p>
      <p>Умови повинні бути дійсним рядком типу умови.</p>
      <p>Це бета-поле і вимагає увімкнення функційних можливостей DRADeviceBindingConditions та DRAResourceClaimDeviceStatus.</p></td>
    </tr>
    <tr>
      <td><code>bindingFailureConditions</code><br/><em>string array</em></td>
      <td><p>BindingFailureConditions визначає умови для невдачі привʼязки. Вони можуть бути встановлені в умовах стану кожного пристрою. Якщо будь-яка з них встановлена в "True", сталася невдача привʼязки.</p>
      <p>Максимальна кількість умов невдачі привʼязки становить 4.</p>
      <p>Умови повинні бути дійсним рядком типу умови.</p>
      <p>Це бета-поле і вимагає увімкнення функційних можливостей DRADeviceBindingConditions та DRAResourceClaimDeviceStatus.</p></td>
    </tr>
    <tr>
      <td><code>bindsToNode</code><br/><em>boolean</em></td>
      <td><p>BindsToNode показує, чи використання виділення, що включає цей пристрій, має бути обмежене саме тим вузлом, який був обраний під час розподілу заявки. Якщо встановлено в true, планувальник встановить ResourceClaim.Status.Allocation.NodeSelector, щоб відповідати вузлу, де було зроблено виділення.</p>
      <p>Це бета-поле і вимагає увімкнення функційних можливостей DRADeviceBindingConditions та DRAResourceClaimDeviceStatus.</p></td>
    </tr>
    <tr>
      <td><code>capacity</code><br/><em>object</em></td>
      <td><p>Capacity визначає набір ємностей для цього пристрою. Імʼя кожної ємності повинно бути унікальним у цьому наборі.</p>
      <p>Максимальна кількість атрибутів і ємностей разом становить 32.</p></td>
    </tr>
    <tr>
      <td><code>consumesCounters</code><br/><em><a href="{{< ref "#DeviceCounterConsumption" >}}">DeviceCounterConsumption array</a></em></td>
      <td><p>ConsumesCounters визначає список посилань на sharedCounters та набір лічильників, які пристрій буде споживати з цих наборів лічильників.</p>
      <p>Може бути лише один запис на counterSet. Максимальна кількість споживань лічильників пристрою на пристрій становить 2.</p></td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name є унікальним ідентифікатором серед усіх пристроїв, керованих драйвером у пулі. Він повинен бути міткою DNS.</td>
    </tr>
    <tr>
      <td><code>nodeAllocatableResourceMappings</code><br/><em>object</em></td>
      <td>NodeAllocatableResourceMappings визначає зіставлення ресурсів вузла, якими керує драйвер DRA, що надає цей пристрій. Це включає ресурси, які наразі повідомляються у v1.Node <code>status.allocatable</code>, але не є розширеними ресурсами (див. <a href="/uk/docs/concepts/configuration/manage-resources-containers/#extended-resources">https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#extended-resources</a>). Прикладами є "cpu", "memory", "ephemeral-storage" та hugepages. Крім стандартних запитів, зроблених через Pod <code>spec</code>, ці ресурси також можуть бути запитані через заявки та виділені драйвером DRA. Наприклад, драйвер CPU DRA може виділяти ексклюзивні CPU або допоміжні залежності памʼяті вузла для прискорювального пристрою. Ключі цієї мапи є іменами ресурсів, доступних на вузлі (наприклад, "cpu", "memory"). Імена розширених ресурсів не дозволяються як ключі.</td>
    </tr>
    <tr>
      <td><code>nodeName</code><br/><em>string</em></td>
      <td><p>NodeName визначає вузол, де доступний пристрій.</p>
      <p>Може бути встановлено лише якщо Spec.PerDeviceNodeSelection встановлено в true. Може бути встановлено не більше одного з NodeName, NodeSelector та AllNodes.</p></td>
    </tr>
    <tr>
      <td><code>nodeSelector</code><br/><em><a href="{{< ref "../definitions/node-selector-v1#NodeSelector" >}}">NodeSelector</a></em></td>
      <td><p>NodeSelector визначає вузли, де доступний пристрій.</p>
      <p>Має використовуватися тільки один термін.</p>
      <p>Може бути встановлено лише якщо Spec.PerDeviceNodeSelection встановлено в true. Може бути встановлено не більше одного з NodeName, NodeSelector та AllNodes.</p></td>
    </tr>
    <tr>
      <td><code>taints</code><br/><em><a href="{{< ref "#DeviceTaint" >}}">DeviceTaint array</a></em></td>
      <td><p>Якщо вказано, то це taint, визначені драйвером.</p>
      <p>Максимальна кількість taints становить 16. Якщо taints встановлено для будь-якого пристрою в ResourceSlice, тоді максимальна кількість дозволених пристроїв на ResourceSlice становить 64 замість 128.</p>
      <p>Це бета-поле і вимагає увімкнення функціональної можливості DRADeviceTaints.</p></td>
    </tr>
  </tbody>
</table>

## DeviceAttribute {#DeviceAttribute}

DeviceAttribute має мати встановлене тільки одне поле.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>bool</code><br/><em>boolean</em></td>
      <td>BoolValue є значенням true/false.</td>
    </tr>
    <tr>
      <td><code>bools</code><br/><em>boolean array</em></td>
      <td>BoolValues є непорожнім списком значень true/false.</td>
    </tr>
    <tr>
      <td><code>int</code><br/><em>integer</em></td>
      <td>IntValue є числом.</td>
    </tr>
    <tr>
      <td><code>ints</code><br/><em>integer array</em></td>
      <td><p>IntValues є непорожнім списком чисел.</p>
      <p>Це альфа-поле і вимагає увімкнення функціональної можливості DRAListTypeAttributes.</p></td>
    </tr>
    <tr>
      <td><code>string</code><br/><em>string</em></td>
      <td>StringValue є рядком. Не повинен перевищувати 64 символи.</td>
    </tr>
    <tr>
      <td><code>strings</code><br/><em>string array</em></td>
      <td><p>StringValues є непорожнім списком рядків. Кожен рядок не повинен перевищувати 64 символи.</p>
      <p>Це альфа-поле і вимагає увімкнення функціональної можливості DRAListTypeAttributes.</p></td>
    </tr>
    <tr>
      <td><code>version</code><br/><em>string</em></td>
      <td>VersionValue є семантичним версіонуванням відповідно до специфікації semver.org 2.0.0. Не має перевищувати 64 символи.</td>
    </tr>
    <tr>
      <td><code>versions</code><br/><em>string array</em></td>
      <td><p>VersionValues є непорожнім списком семантичних версій відповідно до специфікації semver.org 2.0.0. Кожен рядок версії не повинен перевищувати 64 символи.</p>
      <p>Це альфа-поле і вимагає увімкнення функціональної можливості DRAListTypeAttributes.</p></td>
    </tr>
  </tbody>
</table>

## DeviceCapacity {#DeviceCapacity}

DeviceCapacity описує кількість, повʼязану з пристроєм.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>requestPolicy</code><br/><em><a href="{{< ref "#CapacityRequestPolicy" >}}">CapacityRequestPolicy</a></em></td>
      <td><p>RequestPolicy визначає, як ця DeviceCapacity повинна споживатися, коли пристрій дозволено ділити між кількома розподілами.</p>
      <p>Пристрій повинен мати allowMultipleAllocations встановлено в true, щоб встановити requestPolicy.</p>
      <p>Якщо не встановлено, запити на ємність не обмежені: запити можуть споживати будь-яку кількість ємності, доки загальна спожита кількість у всіх виділеннях не перевищує визначену ємність пристрою. Якщо request також не встановлено, за замовчуванням використовується повна ємність.</p></td>
    </tr>
    <tr>
      <td><code>value</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td><p>Value визначає, скільки певної ємності має пристрій.</p>
      <p>Це поле відображає фіксовану загальну ємність і не змінюється. Спожита кількість відстежується окремо планувальником і не впливає на це значення.</p></td>
    </tr>
  </tbody>
</table>

## DeviceCounterConsumption {#DeviceCounterConsumption}

DeviceCounterConsumption визначає набір лічильників, які пристрій буде споживати з CounterSet.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>counterSet</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>CounterSet є назвою набору, з якого будуть споживатися визначені лічильники.</td>
    </tr>
    <tr>
      <td><code>counters</code>&nbsp;<strong>*</strong><br/><em>object</em></td>
      <td><p>Counters визначає лічильники, які будуть споживатися пристроєм.</p>
      <p>Максимальна кількість лічильників становить 32.</p></td>
    </tr>
  </tbody>
</table>

## DeviceTaint {#DeviceTaint}

Пристрій, до якого прикріплено цей taint, має «вплив» на будь-яку заявку, яка не толерує taint, і, через заявку, на podʼи, що використовують цю заявку.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>effect</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td><p>Вплив taint на заявки, які не толерують цей taint, і через такі заявки на поди, що їх використовують.</p>
      <p>Дійсні ефекти: None, NoSchedule та NoExecute. PreferNoSchedule, як використовується для вузлів, тут недійсний. У майбутньому можуть бути додані інші ефекти. Споживачі повинні трактувати невідомі ефекти як None.</p>
      <p>Можливі значення enum:
      <ul>
        <li><code>"NoExecute"</code> Виселити будь-які вже запущені поди, які не толерують taint пристрою.</li>
        <li><code>"NoSchedule"</code> Не дозволяти новим подам плануватися з використанням taint пристрою, якщо вони не толерують taint, але дозволяти всім подам, поданим до Kubelet без проходження через планувальник, запускатися, і дозволяти всім вже запущеним подам продовжувати працювати.</li>
        <li><code>"None"</code> Без ефекту, taint є чисто інформаційним.</li>
      </ul></p></td>
    </tr>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Ключ taint, який буде застосовано до пристрою. Повинен бути імʼям мітки.</td>
    </tr>
    <tr>
      <td><code>timeAdded</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td><p>TimeAdded представляє час, коли taint був доданий або (тільки в DeviceTaintRule) ефект був змінений. Додається автоматично під час створення або оновлення, якщо не встановлено.</p>
      <p>Крім того, у DeviceTaintRule значення, надане під час оновлення, замінюється на поточний час, якщо надане значення збігається зі старим і новий ефект відрізняється. Зміна ключа та/або значення при збереженні ефекту без змін можлива і не оновлює часову мітку, оскільки виселення, яке її використовує, вже почалося (NoExecute) або ще не почалося (NoEffect, NoSchedule).</p></td>
    </tr>
    <tr>
      <td><code>value</code><br/><em>string</em></td>
      <td>Значення taint, що відповідає ключу taint. Повинно бути значенням мітки.</td>
    </tr>
  </tbody>
</table>

## NodeAllocatableResourceMapping {#NodeAllocatableResourceMapping}

NodeAllocatableResourceMapping визначає перетворення між одиницями пристрою/ємності DRA, запитаними, та відповідною кількістю ресурсу вузла, доступного для виділення.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allocationMultiplier</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td><p>AllocationMultiplier використовується як множник для кількості виділених пристроїв або виділеної ємності в запиті. Зазвичай дорівнює 1, якщо не вказано. Використання цього поля також залежить від того, чи встановлено <code>capacityKey</code>.</p>
      <ol>
        <li>Якщо <code>capacityKey</code> не встановлено: <code>allocationMultiplier</code> множить кількість пристроїв, виділених для запиту.</li>
        <ul>
          <li>a. DRA-драйвер, який представляє кожне ядро CPU як пристрій, матиме {ResourceName: "cpu", allocationMultiplier: "2"} у своєму <code>nodeAllocatableResourceMappings</code>. Якщо 4 пристрої виділено для запиту, 4 * 2 CPU вважатимуться виділеними і відніматимуться з ємності вузла.</li>
          <li>b. GPU-пристрій, який потребує додаткової памʼяті вузла на кожне виділення GPU, матиме {ResourceName: "memory", allocationMultiplier: "2Gi"}. Кожен виділений екземпляр цього типу GPU-пристрою враховуватиме 2Gi памʼяті.</li>
        </ul>
        <li>Якщо <code>capacityKey</code> встановлено: <code>allocationMultiplier</code> множиться на кількість спожитої ємності. Остаточна кількість ресурсу вузла, доступного для виділення, визначається як <code>consumedCapacity[capacityKey] * allocationMultiplier</code>. Наприклад, якщо спожито ємність пристрою "dra.example.com/cores", і кожне "ядро" забезпечує 2 "cpu", відображення буде таким: {ResourceName: "cpu", capacityKey: "dra.example.com/cores", allocationMultiplier: "2"}. Якщо запит споживає 8 "dra.example.com/cores", відбиток CPU становитиме 8 * 2 = 16.</li></ul></td>
    </tr>
    <tr>
      <td><code>capacityKey</code><br/><em>string</em></td>
      <td>CapacityKey посилається на назву ємності, визначену як ключ у мапі <code>spec.devices[*].capacity</code>. Коли це поле встановлено, значення, повʼязане з цим ключем у мапі <code>status.allocation.devices.results[*].consumedCapacity</code> (для конкретного виділення запиту), визначає базову кількість для ресурсу вузла, доступного для виділення. Якщо також встановлено <code>allocationMultiplier</code>, воно множиться на базову кількість. Наприклад, якщо <code>spec.devices[*].capacity</code> має запис "dra.example.com/memory": "128Gi", і це поле встановлено на "dra.example.com/memory", тоді для виділення запиту, яке споживає { "dra.example.com/memory": "4Gi" }, базова кількість для відображення ресурсу вузла буде "4Gi", і <code>allocationMultiplier</code> слід опустити або встановити на "1".</td>
    </tr>
  </tbody>
</table>

## NodeSelectorRequirement {#NodeSelectorRequirement}

Вимога до селектора вузлів — це селектор, що містить значення, ключ та оператор, який повʼязує ключ і значення.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Ключ мітки, до якого застосовується селектор.</td>
    </tr>
    <tr>
      <td><code>operator</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Представляє відношення ключа до набору значень. Дійсні оператори: In, NotIn, Exists, DoesNotExist, Gt та Lt.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"DoesNotExist"</code></li>
        <li><code>"Exists"</code></li>
        <li><code>"Gt"</code></li>
        <li><code>"In"</code></li>
        <li><code>"Lt"</code></li>
        <li><code>"NotIn"</code></li>
      </ul>
    </td>
    </tr>
    <tr>
      <td><code>values</code><br/><em>string array</em></td>
      <td>Масив значень рядків. Якщо оператор дорівнює In або NotIn, масив values повинен бути непорожнім. Якщо оператор дорівнює Exists або DoesNotExist, масив values повинен бути порожнім. Якщо оператор дорівнює Gt або Lt, масив values повинен містити один елемент, який буде інтерпретований як ціле число. Цей масив замінюється під час стратегічного злиття патчу.</td>
    </tr>
  </tbody>
</table>

## ResourcePool {#ResourcePool}

ResourcePool Описує пул, до якого належать ResourceSlices.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>generation</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td><p>Generation відстежує зміни в пулі з часом. Коли драйвер змінює щось у одному або декількох ресурсах у пулі, він повинен змінити generation у всіх ResourceSlices, які є частиною цього пулу. Споживачі ResourceSlices повинні враховувати лише ресурси з пулу з найвищим номером generation. Generation може бути скинутий драйверами, що має бути прийнятним для споживачів, за умови, що всі ResourceSlices у пулі оновлені або видалені.</p>
      <p>У поєднанні з ResourceSliceCount, цей механізм дозволяє споживачам виявляти пули, які складаються з кількох ResourceSlices і знаходяться в неповному стані.</p></td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td><p>Name використовується для ідентифікації пулу. Для локальних пристроїв вузла це часто імʼя вузла, але це не обовʼязково.</p>
      <p>Воно не повинно перевищувати 253 символи і повинно складатися з одного або декількох піддоменів DNS, розділених слешами. Це поле є незмінним.</p></td>
    </tr>
    <tr>
      <td><code>resourceSliceCount</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td><p>ResourceSliceCount є загальною кількістю ResourceSlices у пулі на цей номер generation. Має бути більше нуля.</p>
      <p>Споживачі можуть використовувати це, щоб перевірити, чи бачили вони всі ResourceSlices, що належать до одного пулу.</p></td>
    </tr>
  </tbody>
</table>

## Операції {#Operations}

---

### `post` Create

#### HTTP Запит {#http-request}

POST /apis/resource.k8s.io/v1/resourceslices

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
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a></em></td>
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
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch

#### HTTP Запит {#http-request-1}

PATCH /apis/resource.k8s.io/v1/resourceslices/{name}

#### Параметри шляху {#path-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceSlice</td>
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
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace

#### HTTP Запит {#http-request-2}

PUT /apis/resource.k8s.io/v1/resourceslices/{name}

#### Параметри шляху {#path-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceSlice</td>
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
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a></em></td>
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
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete

#### HTTP Запит {#http-request-3}

DELETE /apis/resource.k8s.io/v1/resourceslices/{name}

#### Параметри шляху {#path-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceSlice</td>
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
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete Collection

#### HTTP Запит {#http-request-4}

DELETE /apis/resource.k8s.io/v1/resourceslices

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

GET /apis/resource.k8s.io/v1/resourceslices/{name}

#### Параметри шляху {#path-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceSlice</td>
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
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a></em></td>
    </tr>
  </tbody>
</table>

### `get` List

#### HTTP Запит {#http-request-6}

GET /apis/resource.k8s.io/v1/resourceslices

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
      <td><em><a href="{{< ref "resource-slice-v1#ResourceSliceList" >}}">ResourceSliceList</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch

#### HTTP Запит {#http-request-7}

GET /apis/resource.k8s.io/v1/watch/resourceslices/{name}

#### Параметри шляху {#path-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва ResourceSlice</td>
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

GET /apis/resource.k8s.io/v1/watch/resourceslices

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
