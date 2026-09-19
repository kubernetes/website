---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ListMeta"
content_type: "api_reference"
description: "ListMeta описує метадані, які повинні мати синтетичні ресурси, включаючи списки та різні обʼєкти стану. Ресурс може мати лише один з {ObjectMeta, ListMeta}."
title: "ListMeta"
weight: 190
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## ListMeta {#ListMeta}

ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>continue</code><br/><em>string</em></td>
      <td>continue може бути встановлено, якщо користувач встановив обмеження на кількість повернутих елементів, і вказує, що на сервері є більше даних. Значення є непрозорим і може бути використано для виконання іншого запиту до точки доступу, яка обслуговувала цей список, щоб отримати наступний набір доступних обʼєктів. Продовження послідовного списку може бути неможливим, якщо конфігурація сервера змінилася або пройшло більше кількох хвилин. Поле resourceVersion, отримане при використанні цього значення continue, буде ідентичним значенню в першій відповіді, якщо ви не отримали цей токен з повідомлення про помилку.</td>
    </tr>
    <tr>
      <td><code>remainingItemCount</code><br/><em>integer</em></td>
      <td>remainingItemCount є кількістю наступних елементів у списку, які не включені в цю відповідь списку. Якщо запит list містив селектори міток або полів, тоді кількість залишкових елементів невідома, і поле залишиться незаповненим і буде опущене під час серіалізації. Якщо список повний (або тому, що він не розбивається на частини, або тому, що це остання частина), тоді більше немає залишкових елементів, і це поле залишиться незаповненим і буде опущене під час серіалізації. Сервери старші за v1.15 не встановлюють це поле. Передбачуване використання remainingItemCount полягає в <em>оцінці</em> розміру колекції. Клієнти не повинні покладатися на те, що remainingItemCount буде встановлено або буде точним.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code><br/><em>string</em></td>
      <td>Рядок, який ідентифікує внутрішню версію цього обʼєкта на сервері і може бути використаний клієнтами для визначення, коли обʼєкти змінилися. Значення повинно розглядатися як непрозоре для клієнтів і передаватися назад на сервер без змін. Заповнюється системою. Тільки для читання. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency</a></td>
    </tr>
    <tr>
      <td><code>selfLink</code><br/><em>string</em></td>
      <td>Застаріле: selfLink є застарілим полем лише для читання, яке більше не заповнюється системою.</td>
    </tr>
    <tr>
      <td><code>shardInfo</code><br/><em><a href="{{< ref "shard-info-v1-meta#ShardInfo" >}}">ShardInfo</a></em></td>
      <td>shardInfo встановлюється, коли список є відфільтрованою підмножиною повної колекції, як вибрано за допомогою селектора шардінгу в запиті. Він повертає селектор назад, щоб клієнти могли перевірити, який шард вони отримали, і обʼєднати часткові відповіді. Клієнти не повинні кешувати часткові відповіді списку як повне представлення колекції. Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.</td>
    </tr>
  </tbody>
</table>
