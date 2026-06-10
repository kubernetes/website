---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Toleration"
content_type: "api_reference"
description: "Под, до якого прикріплено цей Toleration, толерує будь-який taint, що відповідає трійці &lt;key,value,effect&gt; за допомогою оператора &lt;operator&gt;."
title: "Toleration"
weight: 590
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Toleration {#Toleration}

Под, до якого прикріплено цей Toleration, толерує будь-який taint, що відповідає трійці &lt;key,value,effect&gt; за допомогою оператора &lt;operator&gt;.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>effect</code><br/><em>string</em></td>
      <td>Effect вказує ефект taint, який потрібно співставити. Порожнє значення означає співставлення всіх ефектів taint. Якщо вказано, допустимі значення: NoSchedule, PreferNoSchedule та NoExecute.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"NoExecute"</code> Виселити будь-які вже запущені поди, які не толерують taint. Наразі застосовується NodeController.</li>
        <li><code>"NoSchedule"</code> Не дозволяти новим подам плануватися на вузол, якщо вони не толерують taint, але дозволяти всім подам, надісланим до Kubelet без проходження через планувальник, запускатися, і дозволяти всім вже запущеним подам продовжувати працювати. Застосовується планувальником.</li>
        <li><code>"PreferNoSchedule"</code> Як TaintEffectNoSchedule, але планувальник намагається не планувати нові поди на вузол, а не забороняє нові поди плануватися на вузол повністю. Застосовується планувальником.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>key</code><br/><em>string</em></td>
      <td>Key є ключем taint, до якого застосовується толерація. Порожнє значення означає співставлення всіх ключів taint. Якщо ключ порожній, оператор повинен бути Exists; ця комбінація означає співставлення всіх значень і всіх ключів.</td>
    </tr>
    <tr>
      <td><code>operator</code><br/><em>string</em></td>
      <td>Оператор визначає взаємозв’язок ключа зі значенням. Допустимі оператори: Exists, Equal, Lt та Gt. Стандартно — Equal. Exists еквівалентний символу-заміннику для значення,  завдяки чому pod може толерувати всі taint певної категорії. Lt та Gt виконують числові порівняння (потребує включення функціональної можливості TaintTolerationComparisonOperators).
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"Equal"</code></li>
        <li><code>"Exists"</code></li>
        <li><code>"Gt"</code></li>
        <li><code>"Lt"</code></li>
      </ul></td>
    </tr>
    <tr>
      <td><code>tolerationSeconds</code><br/><em>integer</em></td>
      <td>TolerationSeconds представляє період часу, протягом якого толерація (яка повинна мати ефект NoExecute, інакше це поле ігнорується) толерує taint. За замовчуванням не встановлено, що означає толерувати taint назавжди (не виселяти). Нульові та від’ємні значення будуть розглядатися як 0 (виселити негайно) системою.</td>
    </tr>
    <tr>
      <td><code>value</code><br/><em>string</em></td>
      <td>Value є значенням taint, з яким співпадає толерація. Якщо оператор Exists, значення повинно бути порожнім, інакше це просто звичайний рядок.</td>
    </tr>
  </tbody>
</table>
