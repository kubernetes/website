---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "DeleteOptions"
content_type: "api_reference"
description: "DeleteOptions можуть бути надані під час видалення обʼєкта API."
title: "DeleteOptions"
weight: 80
auto_generated: false
---

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## DeleteOptions {#DeleteOptions}

DeleteOptions можуть бути надані під час видалення обʼєкта API.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>dryRun</code><br/><em>string array</em></td>
      <td>Коли присутній, вказує, що зміни не повинні зберігатися. Неправильна або невизнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення: - All: всі етапи dry run будуть оброблені</td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code><br/><em>integer</em></td>
      <td>Час у секундах перед видаленням обʼєкта. Значення повинно бути невідʼємним цілим числом. Значення нуль означає негайне видалення. Якщо це значення nil, буде використано стандартний період очікування для зазначеного типу. Стандартно використовується значення для кожного обʼєкта, якщо не вказано. нуль означає негайне видалення.</td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code><br/><em>boolean</em></td>
      <td>якщо встановлено значення true, це призведе до небезпечного видалення ресурсу у випадку, якщо звичайний процес видалення не вдасться через помилку пошкодженого обʼєкта. Ресурс вважається пошкодженим, якщо його не можна успішно отримати з відповідного сховища через а) неможливість трансформації даних, наприклад, помилка дешифрування, або б) невдачу при декодуванні в обʼєкт. ПРИМІТКА: небезпечне видалення ігнорує обмеження фіналізаторів, пропускає перевірки передумов і видаляє обʼєкт зі сховища. ПОПЕРЕДЖЕННЯ: це може потенційно порушити роботу кластера, якщо робоче навантаження, повʼязане з ресурсом, що видаляється небезпечно, покладається на звичайний процес видалення. Використовуйте лише якщо ви ДІЙСНО знаєте, що робите. Стандартне значення — false, і користувач повинен явно погодитися на його використання.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind — це рядкове значення, що представляє REST-ресурс, який представляє цей обʼєкт. Сервери можуть визначати його з точки доступу, до якої клієнт надсилає запити. Не можна оновлювати. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>orphanDependents</code><br/><em>boolean</em></td>
      <td>Застаріло: будь ласка, використовуйте PropagationPolicy, це поле буде застарілим у версії 1.7. Чи повинні залежні обʼєкти залишатися покинутими. Якщо true/false, завершувач "orphan" буде доданий до/видалений з списку завершувачів обʼєкта. Можна встановити або це поле, або PropagationPolicy, але не обидва.</td>
    </tr>
    <tr>
      <td><code>preconditions</code><br/><em><a href="{{< ref "preconditions-v1-meta#Preconditions" >}}">Preconditions</a></em></td>
      <td>Попередні вимоги повинні бути задовільнені перед видаленням. Якщо це неможливо, буде повернуто статус 409 Conflict.</td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code><br/><em>string</em></td>
      <td>Чи і як буде виконано збір сміття. Можна встановити або це поле, або OrphanDependents, але не обидва. Стандартна політика визначається наявним завершувачем у metadata.finalizers та стандартною політикою для конкретного ресурсу. Допустимі значення: 'Orphan' — залишити залежні обʼєкти покинутими; 'Background' — дозволити збирачу сміття видаляти залежні обʼєкти у фоновому режимі; 'Foreground' — каскадна політика, яка видаляє всі залежні обʼєкти з показом всіх дій.</td>
    </tr>
  </tbody>
</table>
