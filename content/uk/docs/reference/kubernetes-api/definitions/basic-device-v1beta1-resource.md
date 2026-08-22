---
api_metadata:
  apiVersion: "resource.k8s.io/v1beta1"
  import: "k8s.io/api/resource/v1beta1"
  kind: "BasicDevice"
content_type: "api_reference"
description: "BasicDevice визначає один екземпляр пристрою."
title: "BasicDevice"
weight: 50
auto_generated: false
---

`apiVersion: resource.k8s.io/v1beta1`

`import "k8s.io/api/resource/v1beta1"`

## BasicDevice {#BasicDevice}

BasicDevice визначає один екземпляр пристрою.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allNodes</code><br/><em>boolean</em></td>
      <td>AllNodes вказує, що всі вузли мають доступ до пристрою.  Має бути встановлено лише якщо Spec.PerDeviceNodeSelection встановлено в true. Можна встановити не більше одного з NodeName, NodeSelector та AllNodes.</td>
    </tr>
    <tr>
      <td><code>allowMultipleAllocations</code><br/><em>boolean</em></td>
      <td>AllowMultipleAllocations вказує, чи дозволено виділяти пристрій для кількох DeviceRequests. Якщо AllowMultipleAllocations встановлено в true, пристрій може бути виділений більше одного разу, і вся його ємність є споживаною, незалежно від того, чи визначено requestPolicy.</td>
    </tr>
    <tr>
      <td><code>attributes</code><br/><em>object</em></td>
      <td>Attributes визначає набір атрибутів для цього пристрою. Імʼя кожного атрибуту має бути унікальним у цьому наборі. Максимальна кількість атрибутів і ємностей разом становить 32.</td>
    </tr>
    <tr>
      <td><code>bindingConditions</code><br/><em>string array</em></td>
      <td>BindingConditions визначає умови для продовження привʼязки. Всі ці умови повинні бути встановлені в умовах стану кожного пристрою зі значенням True, щоб продовжити привʼязку пода до вузла під час планування пода. Максимальна кількість умов привʼязки — 4. Умови повинні бути дійсним рядком типу умови. Це бета-поле і вимагає увімкнення функціональних можливостей DRADeviceBindingConditions та DRAResourceClaimDeviceStatus.</td>
    </tr>
    <tr>
      <td><code>bindingFailureConditions</code><br/><em>string array</em></td>
      <td>BindingFailureConditions визначає умови невдалої привʼязки. Вони можуть бути встановлені в умовах стану кожного пристрою. Якщо будь-яка з них істинна, сталася невдала привʼязка. Максимальна кількість умов невдалої привʼязки — 4. Умови повинні бути дійсним рядком типу умови. Це бета-поле і вимагає увімкнення функціональних можливостей DRADeviceBindingConditions та DRAResourceClaimDeviceStatus.</td>
    </tr>
    <tr>
      <td><code>bindsToNode</code><br/><em>boolean</em></td>
      <td>BindsToNode вказує, чи використання виділення, що включає цей пристрій, має бути обмежене саме тим вузлом, який був обраний під час обробки заявки. Якщо встановлено в true, планувальник встановить ResourceClaim.Status.Allocation.NodeSelector, щоб відповідати вузлу, де було зроблено виділення. Це бета-поле і вимагає увімкнення функціональних можливостей DRADeviceBindingConditions та DRAResourceClaimDeviceStatus.</td>
    </tr>
    <tr>
      <td><code>capacity</code><br/><em>object</em></td>
      <td>Capacity визначає набір ємностей для цього пристрою. Імʼя кожної ємності має бути унікальним у цьому наборі. Максимальна кількість атрибутів і ємностей разом становить 32.</td>
    </tr>
    <tr>
      <td><code>consumesCounters</code><br/><em><a href="{{< ref "../resource/resource-slice-v1#DeviceCounterConsumption" >}}">DeviceCounterConsumption array</a></em></td>
      <td>ConsumesCounters визначає список посилань на sharedCounters та набір лічильників, які пристрій буде споживати з цих наборів лічильників. Може бути лише один запис на counterSet. Максимальна кількість споживань лічильників пристрою на пристрій становить 2.</td>
    </tr>
    <tr>
      <td><code>nodeAllocatableResourceMappings</code><br/><em>object</em></td>
      <td>NodeAllocatableResourceMappings визначає відповідність ресурсів вузла, які керуються драйвером DRA, що надає цей пристрій. Це включає ресурси, які наразі повідомляються в v1.Node `status.allocatable`, але не є розширеними ресурсами (див. <a href="/uk/docs/concepts/configuration/manage-resources-containers/#extended-resources">https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#extended-resources</a>). Приклади включають "cpu", "memory", "ephemeral-storage" та hugepages. Крім стандартних запитів, зроблених через Pod `spec`, ці ресурси також можуть бути запитані через заявки та виділені драйвером DRA. Наприклад, драйвер CPU DRA може виділяти ексклюзивні CPU або допоміжні залежності памʼяті вузла для прискорювача. Ключі цієї мапи є іменами ресурсів, доступних для вузла (наприклад, "cpu", "memory"). Розширені імена ресурсів не дозволяються як ключі.</td>
    </tr>
    <tr>
      <td><code>nodeName</code><br/><em>string</em></td>
      <td>NodeName визначає вузол, де доступний пристрій. Має бути встановлено лише якщо Spec.PerDeviceNodeSelection встановлено в true. Можна встановити не більше одного з NodeName, NodeSelector та AllNodes.</td>
    </tr>
    <tr>
      <td><code>nodeSelector</code><br/><em><a href="{{< ref "node-selector-v1#NodeSelector" >}}">NodeSelector</a></em></td>
      <td>NodeSelector визначає вузли, де доступний пристрій. Має використовуватися точно один термін. Має бути встановлено лише якщо Spec.PerDeviceNodeSelection встановлено в true. Можна встановити не більше одного з NodeName, NodeSelector та AllNodes.</td>
    </tr>
    <tr>
      <td><code>taints</code><br/><em><a href="{{< ref "../resource/resource-slice-v1#DeviceTaint" >}}">DeviceTaint array</a></em></td>
      <td>Якщо вказано, це позначки taints драйверів. Максимальна кількість taints — 16. Якщо taints встановлено для будь-якого пристрою в ResourceSlice, то максимальна кількість дозволених пристроїв на ResourceSlice становить 64 замість 128. Це бета-поле і вимагає увімкнення функціональної можливості DRADeviceTaints.</td>
    </tr>
  </tbody>
</table>
