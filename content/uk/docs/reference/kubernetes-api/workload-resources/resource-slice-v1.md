---
api_metadata:
  apiVersion: "resource.k8s.io/v1"
  import: "k8s.io/api/resource/v1"
  kind: "ResourceSlice"
content_type: "api_reference"
description: "ResourceSlice представляє один або декілька ресурсів у пулі подібних ресурсів, керованих спільним драйвером."
title: "ResourceSlice v1"
weight: 18
auto_generated: true
---

`apiVersion: resource.k8s.io/v1`

`import "k8s.io/api/resource/v1"`

## ResourceSlice {#ResourceSlice}

ResourceSlice представляє один або кілька ресурсів у пулі подібних ресурсів, що управляються спільним драйвером. Пул може охоплювати більше ніж один ResourceSlice, і точна кількість ResourceSlices, що складають пул, визначається драйвером.

Наразі підтримуються лише пристрої з атрибутами та ємностями (capacities). Кожен пристрій у певному пулі, незалежно від кількості ResourceSlices, повинен мати унікальне імʼя. ResourceSlice, в якому пристрій публікується, може змінюватися з часом. Унікальний ідентифікатор для пристрою — це кортеж \<імʼя драйвера>, \<імʼя пулу>, \<імʼя пристрою>.

Щоразу, коли драйверу потрібно оновити пул, він інкрементує номер pool.Spec.Pool.Generation і оновлює всі ResourceSlices з новим номером і новими визначеннями ресурсів. Споживач повинен використовувати лише ResourceSlices з найвищим номером покоління та ігнорувати всі інші.

При виділенні всіх ресурсів в пулі, що відповідають певним критеріям, або при пошуку найкращого рішення серед кількох різних альтернатив, споживач повинен перевірити кількість ResourceSlices у пулі (включену в кожен ResourceSlice), щоб визначити, чи є його погляд на пул повним, і, якщо ні, чекати, поки драйвер завершить оновлення пулу.

Для ресурсів, які не є локальними для вузла, імʼя вузла не встановлюється. Замість цього драйвер може використовувати селектор вузлів для вказівки, де пристрої доступні.

Це альфа-тип і вимагає активації функціональної можливості DynamicResourceAllocation.

---

- **apiVersion**: resource.k8s.io/v1

- **kind**: ResourceSlice

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта

- **spec** (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSliceSpec" >}}">ResourceSliceSpec</a>), обовʼязково

  Містить інформацію, опубліковану драйвером.

  Зміна специфікації автоматично інкрементує номер metadata.generation.

## ResourceSliceSpec {#ResourceSliceSpec}

ResourceSliceSpec містить інформацію, опубліковану драйвером в одному ResourceSlice.

---

- **driver** (string), обовʼязково

  Driver ідентифікує драйвер DRA, який надає інформацію про ємність. Можна використовувати селектор полів для переліку лише об'єктів ResourceSlice з певним імʼям драйвера.

  Має бути піддоменом DNS і закінчуватися доменом DNS, що належить постачальнику драйвера. Має складатись із смволів нижнього регістру. Це поле є незмінним.

- **pool** (ResourcePool), обовʼязково

  Pool описує пул, до якого належить цей ResourceSlice.

  <a name="ResourcePool"></a>
  *ResourcePool описує пул, до якого належать ResourceSlices.*

  - **pool.generation** (int64), обовʼязково

    Generation відстежує зміни в пулі з часом. Щоразу, коли драйвер змінює щось в одному або кількох ресурсах у пулі, він повинен змінити покоління у всіх ResourceSlices, які є частиною цього пулу. Споживачі ResourceSlices повинні враховувати лише ресурси з пулу з найвищим номером покоління. Покоління може бути скинуто драйверами, що має бути прийнятно для споживачів, за умови, що всі ResourceSlices у пулі оновлені, щоб відповідати новому поколінню або видалені.

    Поєднаний з ResourceSliceCount, цей механізм дозволяє споживачам виявляти пули, які складаються з кількох ResourceSlices і знаходяться в неповному стані.

  - **pool.name** (string), обовʼязково

    Name використовується для ідентифікації пулу. Для локальних на вузлі пристроїв це часто є імʼя вузла, але це не є обовʼязковим.

    Не повинно перевищувати 253 символи і повинно складатися з одного або кількох піддоменів DNS, розділених косими рисками. Це поле є незмінним.

  - **pool.resourceSliceCount** (int64), обовʼязково

    ResourceSliceCount — це загальна кількість ResourceSlices у пулі на цьому номері покоління. Має бути більше нуля.

    Споживачі можуть використовувати це для перевірки, чи вони бачили всі ResourceSlices, що належать одному й тому ж пулу.

- **allNodes** (boolean)

  AllNodes вказує на те, що всі вузли мають доступ до ресурсів у пулі.

  Має бути встановлено точно одне з полів NodeName, NodeSelector, AllNodes або PerDeviceNodeSelection.

- **devices** ([]Device)

  *Atomic: буде замінено під час злиття*

  Devices перераховує деякі або всі пристрої в цьому пулі.

  Не повинно бути більше ніж 128 записів. Якщо будь-який пристрій використовує позначки taint або споживає лічильники, обмеження становить 64.

  У ResourceSlice можна встановити тільки один з параметрів Devices і SharedCounters.


  <a name="Device"></a>
  *Device представляє один індивідуальний апаратний екземпляр, який може бути вибраний на основі його атрибутів. Окрім імені, має бути встановлено точно одне поле.*

  - **devices.name** (string), обовʼязково

    Name є унікальним ідентифікатором серед усіх пристроїв, які управляються драйвером у пулі. Має бути піддоменом DNS.

  - **devices.allNodes** (boolean)

    AllNodes означає, що всі вузли мають доступ до пристрою.

    Має бути задано тільки якщо Spec.PerDeviceNodeSelection має значення true. Може бути задано не більше одного з NodeName, NodeSelector та AllNodes.

  - **devices.allowMultipleAllocations** (boolean)

    AllowMultipleAllocations позначає, чи можна пристрій розподілити між декількома DeviceRequests.

    Якщо AllowMultipleAllocations встановлено на true, пристрій можна розподілити більше ніж один раз, і вся його ємність є споживчою, незалежно від того, чи визначено requestPolicy.

  - **devices.attributes** (map[string]DeviceAttribute)

    Attributes визначає набір атрибутів для цього пристрою. Імʼя кожного атрибута повинно бути унікальним у цьому наборі.

    Максимальна кількість атрибутів та ємностей разом — 32.

    <a name="DeviceAttribute"></a>
    *DeviceAttribute має бути встановлено точно одне поле.*

    - **devices.attributes.bool** (boolean)

      BoolValue є значенням true/false.

    - **devices.attributes.int** (int64)

      IntValue є числом.

    - **devices.attributes.string** (string)

      StringValue є рядком. Не повинно бути довше 64 символів.

    - **devices.attributes.version** (string)

      VersionValue є семантичною версією відповідно до специфікації semver.org 2.0.0. Не повинна перевищувати 64 символи в довжину.

  - **devices.bindingConditions** ([]string)

    *Atomic: буде замінено під час злиття*

    BindingConditions визначає умови для продовження звʼязування. Усі ці умови повинні бути встановлені в умовах стану для кожного пристрою із значенням True, щоб продовжити звʼязування пода з вузлом під час планування подачі.

    Максимальна кількість умов звʼязування — 4.

    Умови повинні бути дійсним рядком типу умови.

    Це альфа-поле, яке вимагає увімкнення функціональних можливостей DRADeviceBindingConditions та DRAResourceClaimDeviceStatus.

  - **devices.bindingFailureConditions** ([]string)

    *Atomic: буде замінено під час злиття*

    BindingFailureConditions визначає умови для невдалого звʼязування. Вони можуть бути встановлені в умовах стану для кожного пристрою. Якщо будь-яка з них встановлена на "True", відбулася невдача звʼязування.

    Максимальна кількість умов невдалого звʼязування становить 4.

    Умови повинні бути дійсним рядком типу умови.

    Це альфа-поле, яке вимагає увімкнення функціональних можливостей DRADeviceBindingConditions та DRAResourceClaimDeviceStatus.

  - **devices.bindsToNode** (boolean)

    BindsToNode вказує, чи використання розподілу, що стосується цього пристрою, має бути обмежене саме тим вузлом, який було обрано під час розподілу заявки. Якщо встановлено значення true, планувальник встановить ResourceClaim.Status.Allocation.NodeSelector відповідно до вузла, де було здійснено розподіл.

    Це поле альфа-версії, яке вимагає увімкнення функціональних можливостей DRADeviceBindingConditions та DRAResourceClaimDeviceStatus.

  - **devices.capacity** (map[string]DeviceCapacity)

    Capacity визначає набір ємностей для цього пристрою. Імʼя кожної ємності повинно бути унікальним у цьому наборі.

    Максимальна кількість атрибутів та ємностей разом — 32.

    <a name="DeviceCapacity"></a>
    *DeviceCapacity описує кількість, повʼязану з пристроєм.*

    - **devices.capacity.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>), обовʼязково

      Value визначає, яку частину певної ємності має пристрій.

      Це поле показує загальну фіксовану ємність і не змінюється. Спожита кількість відстежується окремо планувальником і не впливає на це значення.

    - **devices.capacity.requestPolicy** (CapacityRequestPolicy)

      RequestPolicy визначає, як ця DeviceCapacity повинна використовуватися, коли пристрій може бути спільним для декількох розподілів.

      Для встановлення requestPolicy пристрій повинен мати allowMultipleAllocations, встановлений на true.

      Якщо значення не встановлено, запити на ємність не обмежуються: запити можуть споживати будь-яку кількість ємності, якщо загальне споживання по всіх розподілах не перевищує визначену ємність пристрою. Якщо значення request також не встановлено, стандартно використовується повне значення ємності.

      <a name="CapacityRequestPolicy"></a>
      *CapacityRequestPolicy визначає, як запити використовують потужність пристрою.*

      *Не можна встановлювати більше одного ValidRequestValues.*

      - **devices.capacity.requestPolicy.default** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        Default визначає, скільки з цієї ємності споживається запитом, який не містить запису про неї в DeviceRequest's Capacity.

      - **devices.capacity.requestPolicy.validRange** (CapacityRequestPolicyRange)

        ValidRange визначає прийнятний діапазон значень кількості в запитах на споживання.

        Якщо це поле встановлено, необхідно визначити значення Default, яке повинно знаходитися в межах визначеного діапазону ValidRange.

        Якщо запитувана кількість не знаходиться в межах визначеного діапазону, запит порушує політику, і цей пристрій не може бути виділений.

        Якщо запит не містить цього запису про ємність, використовується значення Default.

        <a name="CapacityRequestPolicyRange"></a>
        *CapacityRequestPolicyRange визначає допустимий діапазон значень споживчої ємності.*

          - *Якщо запитувана сума менше Min, вона округлюється до значення Min.*
          - *Якщо встановлено Step і запитувана сума знаходиться між Min і Max, але не відповідає Step, вона округлюється до наступного значення, рівного Min + (n \* Step).*
          - *Якщо Step не встановлено, запитувана сума використовується без змін, якщо вона знаходиться в діапазоні від Min до Max (якщо встановлено).*
          - *Якщо запитувана або округлена сума перевищує Max (якщо встановлено), запит не відповідає політиці, і пристрій не може бути виділений.*

        - **devices.capacity.requestPolicy.validRange.min** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>), обовʼязково

          Min визначає мінімальну ємність, дозволену для запиту на споживання.

          Min має бути більшим або дорівнювати нулю і меншим або дорівнювати значенню ємності. requestPolicy.default має бути більшим або дорівнювати мінімуму.

        - **devices.capacity.requestPolicy.validRange.max** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

          Max визначає верхню межу ємності, яку можна запитувати.

          Max має бути меншим або дорівнювати значенню ємності. Min і requestPolicy.default мають бути меншими або дорівнювати максимальному значенню.

        - **devices.capacity.requestPolicy.validRange.step** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

          Step визначає розмір кроку між допустимими величинами ємності в межах діапазону.

          Max (якщо встановлено) і requestPolicy.default повинні бути кратними Step. Min + Step повинні бути меншими або дорівнювати значенню ємності.

      - **devices.capacity.requestPolicy.validValues** ([]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        *Atomic: буде замінено під час злиття*

        ValidValues визначає набір прийнятних значень кількості в запитах на споживання.

        Не може містити більше 10 записів. Повинен бути відсортований у порядку зростання.

        Якщо це поле встановлено, необхідно визначити значення Default і включити його до списку ValidValues.

        Якщо запитувана кількість не відповідає жодному дійсному значенню, але є меншою за деякі дійсні значення, планувальник обчислює найменше дійсне значення, яке є більшим або дорівнює запиту. Тобто: min(ceil(requestedValue) ∈ validValues), де requestedValue ≤ max(validValues).

        Якщо запитувана кількість перевищує всі дійсні значення, запит порушує політику, і цей пристрій не може бути виділений.

  - **devices.consumesCounters** ([]DeviceCounterConsumption)

    *Atomic: буде замінено під час злиття*

    ConsumesCounters визначає список посилань на sharedCounters та набір лічильників, які пристрій буде споживати з цих наборів.

    Для кожного набору лічильників може бути лише один запис.

    Максимальна кількість споживання лічильника пристроїв на один пристрій становить 2.

    <a name="DeviceCounterConsumption"></a>
    *DeviceCounterConsumption визначає набір лічильників, які пристрій буде споживати з CounterSet.*

    - **devices.consumesCounters.counterSet** (string), обовʼязково

      CounterSet є назвою множини, з якої будуть використовуватися визначені лічильники.

    - **devices.consumesCounters.counters** (map[string]Counter), обовʼязково

      Counters визначає лічильники, які будуть споживатися пристроєм.

      Максимальна кількість лічильників — 32.

      <a name="Counter"></a>
      *Counter описує кількість, повʼязану з пристроєм.*

      - **devices.consumesCounters.counters.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>), обовʼязково

        Value визначає, скільки лічильника певного пристрою доступно.

  - **devices.nodeName** (string)

    NodeName визначає вузол, на якому доступний пристрій.

    Має бути задано тільки якщо Spec.PerDeviceNodeSelection має значення true. Може бути задано принаймні одне з NodeName, NodeSelector та AllNodes.

  - **devices.nodeSelector** (NodeSelector)

    NodeSelector визначає вузол, на якому доступний пристрій.

    Повинен використовувати лише один термін.

    Має бути задано тільки якщо Spec.PerDeviceNodeSelection має значення true. Може бути задано принаймні одне з NodeName, NodeSelector та AllNodes.

    <a name="NodeSelector"></a>
    *Селектор вузлів представляє обʼєднання результатів одного або кількох запитів міток по набору вузлів; тобто, він представляє логічну операцію OR селекторів, представлених термінами селектора вузлів.*

    - **devices.nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), обовʼязково

      *Atomic: буде замінено під час злиття*

      Обовʼязково. Список термінів селектора вузлів. Терміни обʼєднуються операцією OR.

      <a name="NodeSelectorTerm"></a>
      *Null або порожній термін селектора вузла не відповідає жодному об'єкту. Вимоги до них складаються за принципом AND. Тип TopologySelectorTerm реалізує підмножину NodeSelectorTerm.*

      - **devices.nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: буде замінено під час злиття*

        Список вимог до селектора вузлів за мітками вузлів.

      - **devices.nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: буде замінено під час злиття*

        Список вимог до селектора вузла за полями вузла.

  - **devices.taints** ([]DeviceTaint)

    *Atomic: буде замінено під час злиття*

    Якщо вказано, то це taint, визначені драйвером.

    Максимальна кількість taint — 16. Якщо для будь-якого пристрою в ResourceSlice встановлено обмеження, максимальна кількість дозволених пристроїв на ResourceSlice становить 64 замість 128.

    Це альфа-поле і вимагає увімкнення функціональної можливості DRADeviceTaints.

    <a name="DeviceTaint"></a>
    *Пристрій, до якого прикріплено цей taint, має «вплив» на будь-яку заявку, яка не толерує taint, і, через заявку, на podʼи, що використовують цю заявку.*

    - **devices.taints.effect** (string), обовʼязково

      Вплив taint на заявки, які не толерують taint, а через такі заявки на podʼи, які їх використовують.

      Допустимими ефектами є None, NoSchedule та NoExecute. PreferNoSchedule, що використовується для вузлів, тут не діє. У майбутньому можуть бути додані інші ефекти. Споживачі повинні ставитися до невідомих ефектів як до None.

      Можливі значення переліку (enum):
      - `"NoExecute"` Виселяти всі вже запущені podʼи, які не толерантні до taint.
      - `"NoSchedule"` Не дозволяти новим podʼам планувати використання tainted пристроїв, якщо вони не толерантні до taint, але дозволяти всім podʼам, надісланим до Kubelet без проходження через планувальник, запускатися, і дозволяти всім вже запущеним podʼам продовжувати працювати.
      - `"None"` Немає ефекту, позначення taint є суто інформаційним.

    - **devices.taints.key** (string), обовʼязково

      Ключ taint, який буде застосовано до пристрою. Повинна бути назва мітки.

    - **devices.taints.timeAdded** (Time)

      TimeAdded показує час, коли було додано taint. Додається автоматично під час створення або оновлення, якщо не встановлено.

      <a name="Time"></a>
      *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

    - **devices.taints.value** (string)

      Значення taint, що відповідає ключу taint. Має бути значенням мітки.

- **nodeName** (string)

  NodeName ідентифікує вузол, який надає ресурси в цьому пулі. Селектор полів можна використовувати для переліку лише обʼєктів ResourceSlice, що належать певному вузлу.

  Це поле може використовуватися для обмеження доступу з вузлів до ResourceSlices з тим же іменем вузла. Воно також вказує автомасштабувальникам, що додавання нових вузлів того ж типу, що й старий вузол, може також зробити нові ресурси доступними.

  Має бути встановлено точно одне з полів NodeName, NodeSelector, AllNodes або PerDeviceNodeSelection. Це поле є незмінним.

- **nodeSelector** (NodeSelector)

  NodeSelector визначає, які вузли мають доступ до ресурсів у пулі, коли цей пул не обмежений до одного вузла.

  Має бути використано точно один термін.

  Має бути встановлено точно одне з полів NodeName, NodeSelector, AllNodes або PerDeviceNodeSelection.

  <a name="NodeSelector"></a>
  *Селектор вузлів представляє обʼєднання результатів одного або кількох запитів міток по набору вузлів; тобто, він представляє логічну операцію OR селекторів, представлених термінами селектора вузлів.*

  - **nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), обовʼязково

    *Atomic: буде замінено під час злиття*

    Обовʼязково. Список термінів селектора вузлів. Терміни обʼєднуються операцією OR.

    <a name="NodeSelectorTerm"></a>
    *Null або порожній термін селектора вузла не відповідає жодному об'єкту. Вимоги до них складаються за принципом AND. Тип TopologySelectorTerm реалізує підмножину NodeSelectorTerm.*

    - **nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: буде замінено під час злиття*

      Список вимог до селектора вузлів за мітками вузлів.

    - **nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: буде замінено під час злиття*

      Список вимог до селектора вузла за полями вузла.

- **perDeviceNodeSelection** (boolean)

  PerDeviceNodeSelection визначає, чи доступ з вузлів до ресурсів у пулі встановлюється на рівні ResourceSlice або на рівні кожного пристрою. Якщо встановлено значення true, кожен пристрій, визначений як ResourceSlice, повинен вказати його індивідуально.

  Має бути задано точно одне з значень NodeName, NodeSelector, AllNodes та PerDeviceNodeSelection.

- **sharedCounters** ([]CounterSet)

  *Atomic: буде замінено під час злиття*

  SharedCounters визначає список наборів лічильників, кожен з яких має назву та список доступних лічильників.

  Імена наборів лічильників повинні бути унікальними в ResourcePool.

  У ResourceSlice можна встановити тільки один з параметрів Devices і SharedCounters.

  Максимальна кількість наборів лічильників — 8.

  <a name="CounterSet"></a>
  *CounterSet визначає іменований набір лічильників, які доступні для використання пристроями, визначеними у ResourcePool.*

  *Лічильники не можуть бути виділені самі по собі, але на них можуть посилатися пристрої. Коли пристрій виділено, частина лічильників, яку він використовує, більше не буде доступною для використання іншими пристроями.*

  - **sharedCounters.counters** (map[string]Counter), обовʼязково

    Counters визначає набір лічильників для цього CounterSet. Імʼя кожного лічильника має бути унікальним у цьому наборі і має бути DNS-міткою.

    Максимальна кількість лічильників — 32.

    <a name="Counter"></a>
    *Counter описує кількість, повʼязану з пристроєм.*

    - **sharedCounters.counters.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>), обовʼязково

      Value визначає, скільки лічильника певного пристрою доступно.

  - **sharedCounters.name** (string), обовʼязково

    Name визначає імʼя набору лічильників. Це має бути мітка DNS.

## ResourceSliceList {#ResourceSliceList}

ResourceSliceList — колекція класів ResourceSlices.

---

- **apiVersion**: resource.k8s.io/v1

- **kind**: ResourceSliceList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку

- **items** ([]<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>), обовʼязково

  Items is the list of resource ResourceSlices.

## Операції {#Operations}

---

### `get` отримати вказаний ResourceSlice {#get-read-the-specified-resourceslice}

#### HTTP запит {#http-request}

GET /apis/resource.k8s.io/v1/resourceslices/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceSlice

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ResourceSlice {#list-list-or-watch-objects-of-kind-resourceslice}

#### HTTP запит {#http-request-1}

GET /apis/resource.k8s.io/v1/resourceslices

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

200 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSliceList" >}}">ResourceSliceList</a>): OK

401: Unauthorized

### `create` створення ResourceSlice {#create-create-a-resourceslice}

#### HTTP запит {#http-request-2}

POST /apis/resource.k8s.io/v1/resourceslices

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): Accepted

401: Unauthorized

### `update` заміна вказаного ResourceSlice {#update-replace-the-specified-resourceslice}

#### HTTP запит {#http-request-3}

PUT /apis/resource.k8s.io/v1/resourceslices/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceSlice

- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного ResourceSlice {#patch-partially-update-the-specified-resourceslice}

#### HTTP запит {#http-request-4}

PATCH /apis/resource.k8s.io/v1/resourceslices/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceSlice

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

200 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): Created

401: Unauthorized

### `delete` видалення ResourceSlice {#delete-delete-a-resourceslice}

#### HTTP запит {#http-request-5}

DELETE /apis/resource.k8s.io/v1/resourceslices/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceSlice

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

200 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-slice-v1#ResourceSlice" >}}">ResourceSlice</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції ResourceSlice {#deletecollection-delete-collection-of-resourceslice}

#### HTTP запит {#http-request-6}

DELETE /apis/resource.k8s.io/v1/resourceslices

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
