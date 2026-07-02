---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ObjectMeta"
content_type: "api_reference"
description: "ObjectMeta містить метадані, які повинні містити всі ресурси, що зберігаються в системі, зокрема всі обʼєкти, які створюють користувачі."
title: "ObjectMeta"
weight: 310
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## ObjectMeta {#ObjectMeta}

ObjectMeta містить метадані, які повинні містити всі ресурси, що зберігаються в системі, зокрема всі обʼєкти, які створюють користувачі.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>annotations</code><br/><em>object</em></td>
      <td>Annotations є неструктурованою мапою ключ-значення, збереженою з ресурсом, яку можуть встановлювати зовнішні інструменти для збереження та отримання довільних метаданих. Вони не підлягають запиту і повинні зберігатися при модифікації обʼєктів. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/annotations">https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations</a></td>
    </tr>
    <tr>
      <td><code>creationTimestamp</code><br/><em><a href="{{< ref "time-v1-meta#Time" >}}">Time</a></em></td>
      <td>CreationTimestamp є відбитком часу, що представляє час сервера, коли цей обʼєкт був створений. Не гарантується, що буде встановлено в порядку "happens-before" для окремих операцій. Клієнти не можуть встановлювати це значення. Представлено у форматі RFC3339 і в UTC. Заповнюється системою. Тільки для читання. Null для списків. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a></td>
    </tr>
    <tr>
      <td><code>deletionGracePeriodSeconds</code><br/><em>integer</em></td>
      <td>Кількість секунд, дозволених для належного завершення роботи цього обʼєкта перед його видаленням з системи. Встановлюється лише тоді, коли також встановлено deletionTimestamp. Може бути лише скорочено. Тільки для читання.</td>
    </tr>
    <tr>
      <td><code>deletionTimestamp</code><br/><em><a href="{{< ref "time-v1-meta#Time" >}}">Time</a></em></td>
      <td>DeletionTimestamp є датою та часом у форматі RFC 3339, коли цей ресурс буде видалено. Це поле встановлюється сервером, коли користувач запитує належне видалення, і не може бути безпосередньо встановлено клієнтом. Очікується, що ресурс буде видалено (більше не буде видимим у списках ресурсів і не буде доступним за іменем) після часу, зазначеного в цьому полі, коли список завершувачів буде порожнім. Поки список завершувачів містить елементи, видалення блокується. Після встановлення deletionTimestamp це значення не може бути скасовано або встановлено на більш пізній час, хоча його можна скоротити або ресурс може бути видалено раніше цього часу. Наприклад, користувач може запросити видалення поду через 30 секунд. Kubelet реагуватиме, надсилаючи сигнал належного завершення контейнерам у поді. Після цих 30 секунд Kubelet надішле сигнал примусового завершення (SIGKILL) контейнеру і після очищення видалить под з API. У разі мережевих розділень цей обʼєкт може все ще існувати після цього часу, поки адміністратор або автоматизований процес не визначить, що ресурс повністю завершено. Якщо не встановлено, належне видалення обʼєкта не запитувалося. Заповнюється системою при запиті належного видалення. Тільки для читання. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a></td>
    </tr>
    <tr>
      <td><code>finalizers</code><br/><em>string array</em><br/><em>patch strategy: злиття</em></td>
      <td>Повинно бути порожнім перед видаленням обʼєкта з реєстру. Кожен запис є ідентифікатором відповідального компонента, який видалить запис зі списку. Якщо deletionTimestamp обʼєкта не є nil, записи в цьому списку можна лише видаляти. Завершувачі можуть оброблятися та видалятися в будь-якому порядку. Порядок НЕ гарантується, оскільки це створює значний ризик зависання завершувачів. finalizers є спільним полем, будь-який а́ктор з дозволом може змінювати його порядок. Якщо список завершувачів обробляється в порядку, це може призвести до ситуації, коли компонент, відповідальний за перший завершувач у списку, очікує сигналу (значення поля, зовнішня система або інше), створеного компонентом, відповідальним за завершувач пізніше в списку, що призводить до блокування. Без забезпеченого порядку завершувачі можуть вільно впорядковуватися між собою і не піддаються змінам порядку в списку.</td>
    </tr>
    <tr>
      <td><code>generateName</code><br/><em>string</em></td>
      <td>GenerateName є необовʼязковим префіксом, який використовується сервером для генерації унікального імені ТІЛЬКИ У РАЗІ, якщо поле Name не було надано. Якщо це поле використовується, імʼя, яке повертається клієнту, буде відрізнятися від переданого імені. Це значення також буде поєднано з унікальним суфіксом. Надане значення має ті ж правила перевірки, що й поле Name, і може бути скорочене на довжину суфікса, необхідного для забезпечення унікальності на сервері. Якщо це поле вказано і згенероване імʼя вже існує, сервер поверне 409. Застосовується лише якщо Name не вказано. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency</a></td>
    </tr>
    <tr>
      <td><code>generation</code><br/><em>integer</em></td>
      <td>Порядковий номер, що представляє конкретне покоління бажаного стану. Заповнюється системою. Тільки для читання.</td>
    </tr>
    <tr>
      <td><code>labels</code><br/><em>object</em></td>
      <td>Мапа ключів і значень типу string, яка може використовуватися для організації та категоризації (scope and select) обʼєктів. Може відповідати селекторам контролерів реплікації та сервісів. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/labels">https://kubernetes.io/docs/concepts/overview/working-with-objects/labels</a></td>
    </tr>
    <tr>
      <td><code>managedFields</code><br/><em><a href="{{< ref "managed-fields-entry-v1-meta#ManagedFieldsEntry" >}}">ManagedFieldsEntry array</a></em></td>
      <td>Поле <code>ManagedFields</code> повʼязує ідентифікатор робочого процесу (<code>workflow-id</code>) та версію з набором полів, які керуються цим робочим процесом. Це переважно призначено для внутрішнього адміністрування, і користувачам, як правило, не потрібно налаштовувати це поле чи розуміти його призначення. Робочим процесом може бути імʼя користувача, назва контролера або назва конкретного шляху застосування, наприклад «ci-cd». Набір полів завжди відповідає тій версії, яку робочий процес використовував під час модифікації обʼєкта.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Імʼя повинно бути унікальним у межах простору імен. Обовʼязкове при створенні ресурсів, хоча деякі ресурси можуть дозволяти клієнту запитувати генерацію відповідного імені автоматично. Імʼя призначене головним чином для ідемпотентності створення та визначення конфігурації. Не може бути оновлене. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names</a></td>
    </tr>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>Простір імен визначає область дії, у межах якої кожне імʼя повинно бути унікальним. Порожній простір імен еквівалентний простору імен "default", але "default" є канонічним представленням. Не всі обʼєкти повинні бути обмежені простором імен — значення цього поля для таких обʼєктів буде порожнім. Повинно бути DNS_LABEL. Не може бути оновлене. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/namespaces">https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces</a></td>
    </tr>
    <tr>
      <td><code>ownerReferences</code><br/><em><a href="{{< ref "owner-reference-v1-meta#OwnerReference" >}}">OwnerReference array</a></em><br/><em>patch strategy: merge on key <code>uid</code></em></td>
      <td>Список обʼєктів, від яких залежить цей обʼєкт. Якщо ВСІ обʼєкти в списку були видалені, цей обʼєкт буде прибраний сміттєзбирачем. Якщо цей обʼєкт керується контролером, то запис у цьому списку вкаже на цей контролер, з полем controller, встановленим у true. Не може бути більше одного керуючого контролера.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code><br/><em>string</em></td>
      <td>Непрозоре значення, яке позначає внутрішню версію цього обʼєкта і може використовуватися клієнтами для визначення, коли обʼєкти зазнали змін. Може використовуватися для оптимістичної паралельності, виявлення змін та операції спостереження за ресурсом або набором ресурсів. Клієнти повинні розглядати ці значення як непрозорі та передавати їх назад на сервер без змін. Вони можуть бути дійсними лише для певного ресурсу або набору ресурсів.  Заповнюється системою. Тільки для читання. Тільки для читання. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency</a></td>
    </tr>
    <tr>
      <td><code>selfLink</code><br/><em>string</em></td>
      <td>Застаріле: selfLink є застарілим полем лише для читання, яке більше не заповнюється системою.</td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>UID є унікальним у часі та просторі значенням для цього обʼєкта. Зазвичай генерується сервером при успішному створенні ресурсу і не може змінюватися під час операцій PUT. Заповнюється системою. Тільки для читання. Більше інформації: <a href="/uk/docs/concepts/overview/working-with-objects/names#uids">https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids</a></td>
    </tr>
  </tbody>
</table>
