---
api_metadata:
  apiVersion: "apiextensions.k8s.io/v1"
  import: "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
  kind: "CustomResourceDefinition"
content_type: "api_reference"
description: "CustomResourceDefinition представляє ресурс, який повинен бути доступний на API-сервері. Його імʼя МАЄ бути у форматі &lt;.spec.name&gt;.&lt;.spec.group&gt;."
title: "CustomResourceDefinition"
weight: 10
auto_generated: false
---

`apiVersion: apiextensions.k8s.io/v1`

`import "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"`

## CustomResourceDefinition {#CustomResourceDefinition}

CustomResourceDefinition представляє ресурс, який повинен бути доступний на API-сервері. Його імʼя МАЄ бути у форматі &lt;.spec.name&gt;.&lt;.spec.group&gt;.

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
      <td>metadata визначає стандартні метадані обʼєкта. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a>.</td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#CustomResourceDefinitionSpec" >}}">CustomResourceDefinitionSpec</a></em></td>
      <td>spec describes how the user wants the resources to appear</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#CustomResourceDefinitionStatus" >}}">CustomResourceDefinitionStatus</a></em></td>
      <td>status визначає фактичний стан CustomResourceDefinition</td>
    </tr>
  </tbody>
</table>

## CustomResourceDefinitionSpec {#CustomResourceDefinitionSpec}

CustomResourceDefinitionSpec описує, як користувач хоче, щоб його ресурс виглядав

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>conversion</code><br/><em><a href="{{< ref "#CustomResourceConversion" >}}">CustomResourceConversion</a></em></td>
      <td>conversion визначає налаштування конверсії для CRD.</td>
    </tr>
    <tr>
      <td><code>group</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>group є API групою визначеного власного ресурсу. Власні ресурси обслуговуються як <code>/apis/\<group>/...</code>. Повинно відповідати імені CustomResourceDefinition (у формі <code>\<names.plural>.\<group></code>).</td>
    </tr>
    <tr>
      <td><code>names</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#CustomResourceDefinitionNames" >}}">CustomResourceDefinitionNames</a></em></td>
      <td>names визначає імена ресурсу та типи для власного ресурсу.</td>
    </tr>
    <tr>
      <td><code>preserveUnknownFields</code><br/><em>boolean</em></td>
      <td>preserveUnknownFields показує як поля обʼєкта, які не вказані в схемі OpenAPI, повинні зберігатися при збереженні в сховище. apiVersion, kind, metadata та відомі поля всередині metadata завжди зберігаються. Це поле визнане застарілим на користь встановлення <code>x-preserve-unknown-fields</code> в true в <code>spec.versions[*].schema.openAPIV3Schema</code>. Деталі див. на <a href="/uk/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning">https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning</a>.</td>
    </tr>
    <tr>
      <td><code>scope</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>scope показує, чи визначений власний ресурс є кластерним або просторово обмеженим. Дозволені значення: <code>Cluster</code> та <code>Namespaced</code>.</td>
    </tr>
    <tr>
      <td><code>versions</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#CustomResourceDefinitionVersion" >}}">CustomResourceDefinitionVersion array</a></em></td>
      <td>versions є списком усіх версій API визначеного власного ресурсу. Імена версій використовуються для обчислення порядку, у якому обслуговувані версії відображаються в API discovery. Якщо рядок версії є "kube-подібний", він буде сортуватися вище за не "kube-подібні" рядки версій, які впорядковуються лексикографічно. "Kube-подібні" версії починаються з "v", потім слідує число (основна версія), потім необовʼязково рядок "alpha" або "beta" і ще одне число (додаткова версія). Вони сортуються спочатку за GA > beta > alpha (де GA — це версія без суфікса, такого як beta або alpha), а потім за порівнянням основної версії, потім додаткової версії. Приклад відсортованого списку версій: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10.</td>
    </tr>
  </tbody>
</table>

## CustomResourceDefinitionStatus {#CustomResourceDefinitionStatus}

CustomResourceDefinitionStatus показує стан CustomResourceDefinition

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>acceptedNames</code><br/><em><a href="{{< ref "#CustomResourceDefinitionNames" >}}">CustomResourceDefinitionNames</a></em></td>
      <td>acceptedNames є іменами, які фактично використовуються для обслуговування discovery. Вони можуть відрізнятися від імен у spec.</td>
    </tr>
    <tr>
      <td><code>conditions</code><br/><em><a href="{{< ref "#CustomResourceDefinitionCondition" >}}">CustomResourceDefinitionCondition array</a></em></td>
      <td>conditions показують стан для конкретних аспектів CustomResourceDefinition</td>
    </tr>
    <tr>
      <td><code>observedGeneration</code><br/><em>integer</em></td>
      <td>observedGeneration показує покоління, яке спостерігає контролер CRD.</td>
    </tr>
    <tr>
      <td><code>storedVersions</code><br/><em>string array</em></td>
      <td>storedVersions містить усі версії CustomResources, які коли-небудь зберігалися. Відстеження цих версій дозволяє створити шлях міграції для збережених версій у etcd. Поле є змінним, щоб контролер міграції міг завершити міграцію на іншу версію (забезпечуючи, що старі обʼєкти не залишаються в сховищі), а потім видалити решту версій із цього списку. Версії не можуть бути видалені з <code>spec.versions</code>, поки вони існують у цьому списку.</td>
    </tr>
  </tbody>
</table>

## CustomResourceDefinitionList {#CustomResourceDefinitionList}

CustomResourceDefinitionList є списком CustomResourceDefinition objects.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>items</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition array</a></em></td>
      <td>items містить окремі обʼєкти CustomResourceDefinition</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/list-meta-v1-meta#ListMeta" >}}">ListMeta</a></em></td>
      <td>metadata визначає стандартні метадані обʼєкта. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a>.</td>
    </tr>
  </tbody>
</table>

## CustomResourceColumnDefinition {#CustomResourceColumnDefinition}

CustomResourceColumnDefinition specifies a column for server side printing.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>description</code><br/><em>string</em></td>
      <td>description є зрозумілим для людини описом цього стовпця.</td>
    </tr>
    <tr>
      <td><code>format</code><br/><em>string</em></td>
      <td>format є необовʼязковим визначенням типу OpenAPI для цього стовпця. Формат 'name' застосовується до основного стовпця ідентифікатора, щоб допомогти клієнтам визначити, що стовпець є імʼям ресурсу. Детальніше: <a href="https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types">https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types</a>.</td>
    </tr>
    <tr>
      <td><code>jsonPath</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>jsonPath є простим шляхом JSON (тобто з нотацією масиву), який оцінюється для кожного користувацького ресурсу, щоб отримати значення для цього стовпця.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name є зрозумілим для людини імʼям цього стовпця.</td>
    </tr>
    <tr>
      <td><code>priority</code><br/><em>integer</em></td>
      <td>priority є цілим числом, що визначає відносну важливість цього стовпця порівняно з іншими. Менші числа вважаються більш пріоритетними. Стовпці, які можуть бути опущені в умовах обмеженого простору, повинні мати пріоритет більше 0.</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>type є визначенням типу OpenAPI для цього стовпця. Детальніше: <a href="https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types">https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types</a>.</td>
    </tr>
  </tbody>
</table>

## CustomResourceConversion {#CustomResourceConversion}

CustomResourceConversion описує, як конвертувати різні версії CR.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>strategy</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>strategy визначає, як конвертувати власні ресурси між версіями. Дозволені значення:
      <ul>
        <li><code>"None"</code>: Конвертер лише змінює apiVersion і не торкається жодного іншого поля у власному ресурсі.</li>
        <li><code>"Webhook"</code>: API Server викликає зовнішній вебхук для виконання конвертації. Для цього варіанту потрібна додаткова інформація. Це вимагає, щоб spec.preserveUnknownFields було false, а spec.conversion.webhook було встановлено.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>webhook</code><br/><em><a href="{{< ref "#WebhookConversion" >}}">WebhookConversion</a></em></td>
      <td>webhook описує, як викликати вебхук для конвертації. Потрібно, коли <code>strategy</code> встановлено на <code>"Webhook"</code>.</td>
    </tr>
  </tbody>
</table>

## CustomResourceDefinitionCondition {#CustomResourceDefinitionCondition}

CustomResourceDefinitionCondition містить деталі поточного стану цього пода.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>lastTransitionTime</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>lastTransitionTime — це останній час, коли стан перейшов з одного стану в інший.</td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>message — це повідомлення, зрозуміле людині, яке вказує деталі щодо переходу. Це може бути порожній рядок.</td>
    </tr>
    <tr>
      <td><code>observedGeneration</code><br/><em>integer</em></td>
      <td>observedGeneration представляє .metadata.generation, на основі якого була встановлено стан. Наприклад, якщо .metadata.generation наразі 12, але .status.conditions[x].observedGeneration дорівнює 9, стан застарів щодо поточного стану екземпляра.</td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>reason є унікальним, однослівним описом у форматі CamelCase, що пояснює причину останнього переходу стану</td>
    </tr>
    <tr>
      <td><code>status</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>status є станом статусу. Може бути True, False, Unknown.</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>type є типом стану. Типи включають Established, NamesAccepted та Terminating.</td>
    </tr>
  </tbody>
</table>

## CustomResourceDefinitionNames {#CustomResourceDefinitionNames}

CustomResourceDefinitionNames вказує імена для обслуговування цього CustomResourceDefinition

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>categories</code><br/><em>string array</em></td>
      <td>categories є списком згрупованих ресурсів, до яких належить цей власний ресурс (наприклад, 'all'). Публікується в документах відкриття API і використовується клієнтами для підтримки викликів, таких як <code>kubectl get all</code>.</td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>kind є серіалізованим типом ресурсу. Зазвичай він у форматі CamelCase і в однині. Екземпляри власного ресурсу використовуватимуть це значення як атрибут <code>kind</code> у викликах API.</td>
    </tr>
    <tr>
      <td><code>listKind</code><br/><em>string</em></td>
      <td>listKind є серіалізованим типом списку для цього ресурсу. Зазвичай "<code>kind</code>List".</td>
    </tr>
    <tr>
      <td><code>plural</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>plural є назвою ресурсу у множині для обслуговування. Власні ресурси обслуговуються за адресою <code>/apis/\<group>/\<version>/.../\<plural></code>. Має відповідати назві CustomResourceDefinition (у формі <code>\<names.plural>.\<group></code>). Все має бути літерами нижнього регістру.</td>
    </tr>
    <tr>
      <td><code>shortNames</code><br/><em>string array</em></td>
      <td>shortNames є короткими іменами для ресурсу, які публікуються в документах відкриття API і використовуються клієнтами для підтримки викликів, таких як <code>kubectl get \<shortname></code>. Все має бути літерами нижнього регістру.</td>
    </tr>
    <tr>
      <td><code>singular</code><br/><em>string</em></td>
      <td>singular є одниною назви ресурсу. Все має бути літерами нижнього регістру. Стандартно використовується нижній регістр <code>kind</code>.</td>
    </tr>
  </tbody>
</table>

## CustomResourceDefinitionVersion {#CustomResourceDefinitionVersion}

CustomResourceDefinitionVersion описує версію для CRD.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>additionalPrinterColumns</code><br/><em><a href="{{< ref "#CustomResourceColumnDefinition" >}}">CustomResourceColumnDefinition array</a></em></td>
      <td>additionalPrinterColumns вказує додаткові стовпці, які повертаються у виводі таблиці. Див. <a href="/uk/docs/reference/using-api/api-concepts/#receiving-resources-as-tables">https://kubernetes.io/docs/reference/using-api/api-concepts/#receiving-resources-as-tables</a> для деталей. Якщо стовпці не вказані, використовується один стовпець, що відображає вік власного ресурсу.</td>
    </tr>
    <tr>
      <td><code>deprecated</code><br/><em>boolean</em></td>
      <td>deprecated вказує, що ця версія API власного ресурсу застаріла. Якщо встановлено значення true, запити до цієї версії отримують заголовок попередження у відповіді сервера. Стандартно — false.</td>
    </tr>
    <tr>
      <td><code>deprecationWarning</code><br/><em>string</em></td>
      <td>deprecationWarning перевизначає стандартне попередження, яке повертається клієнтам API. Може бути встановлено лише тоді, коли <code>deprecated</code> дорівнює true. Стандартне попередження вказує, що ця версія застаріла, і рекомендує використовувати найновішу обслуговувану версію з рівною або більшою стабільністю, якщо така існує.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name є назвою версії, наприклад “v1”, “v2beta1” тощо. Власні ресурси обслуговуються під цією версією за адресою <code>/apis/\<group>/\<version>/...</code>, якщо <code>served</code> дорівнює true.</td>
    </tr>
    <tr>
      <td><code>schema</code><br/><em><a href="{{< ref "#CustomResourceValidation" >}}">CustomResourceValidation</a></em></td>
      <td>schema описує схему, яка використовується для валідації, обрізання та встановлення стандартних значень для цієї версії власного ресурсу.</td>
    </tr>
    <tr>
      <td><code>selectableFields</code><br/><em><a href="{{< ref "#SelectableField" >}}">SelectableField array</a></em></td>
      <td>selectableFields вказує шляхи до полів, які можуть використовуватися як селектори полів. Дозволяється максимум 8 вибіркових полів. Див. <a href="/uk/docs/concepts/overview/working-with-objects/field-selectors">документацію</a>https://kubernetes.io/docs/concepts/overview/working-with-objects/field-selectors</td>.
    </tr>
    <tr>
      <td><code>served</code>&nbsp;<strong>*</strong><br/><em>boolean</em></td>
      <td>served є прапорцем, який дозволяє або забороняє обслуговування цієї версії через REST API</td>
    </tr>
    <tr>
      <td><code>storage</code>&nbsp;<strong>*</strong><br/><em>boolean</em></td>
      <td>storage вказує, що ця версія повинна використовуватися при збереженні власних ресурсів у сховищі. Має бути рівно одна версія з storage=true.</td>
    </tr>
    <tr>
      <td><code>subresources</code><br/><em><a href="{{< ref "#CustomResourceSubresources" >}}">CustomResourceSubresources</a></em></td>
      <td>subresources вказує, які субресурси має ця версія визначеного власного ресурсу.</td>
    </tr>
  </tbody>
</table>

## CustomResourceSubresourceScale {#CustomResourceSubresourceScale}

CustomResourceSubresourceScale визначає, як обслуговувати субресурс scale для власних ресурсів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>labelSelectorPath</code><br/><em>string</em></td>
      <td>labelSelectorPath визначає шлях JSON всередині власного ресурсу, який відповідає Scale <code>status.selector</code>. Дозволяються лише шляхи JSON без нотації масиву. Має бути шлях JSON під <code>.status</code> або <code>.spec</code>. Має бути встановлено для роботи з HorizontalPodAutoscaler. Поле, на яке вказує цей шлях JSON, має бути рядковим полем (не складною структурою селектора), яке містить серіалізований селектор міток у вигляді рядка. Більше інформації: <a href="/uk/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions#scale-subresource">https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions#scale-subresource</a> Якщо під заданим шляхом у власному ресурсі немає значення, значення <code>status.selector</code> у субресурсі <code>/scale</code> за замовчуванням буде порожнім рядком.</td>
    </tr>
    <tr>
      <td><code>specReplicasPath</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>specReplicasPath визначає шлях JSON всередині власного ресурсу, який відповідає Scale <code>spec.replicas</code>. Дозволяються лише шляхи JSON без нотації масиву. Має бути шлях JSON під <code>.spec</code>. Якщо під заданим шляхом у власному ресурсі немає значення, субресурс <code>/scale</code> поверне помилку при GET.</td>
    </tr>
    <tr>
      <td><code>statusReplicasPath</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>statusReplicasPath визначає шлях JSON всередині власного ресурсу, який відповідає Scale <code>status.replicas</code>. Дозволяються лише шляхи JSON без нотації масиву. Має бути шлях JSON під <code>.status</code>. Якщо під заданим шляхом у власному ресурсі немає значення, значення <code>status.replicas</code> у підресурсі <code>/scale</code> за замовчуванням буде 0.</td>
    </tr>
  </tbody>
</table>

## CustomResourceSubresourceStatus {#CustomResourceSubresourceStatus}

CustomResourceSubresourceStatus визначає, як обслуговувати субресурс статусу для власних ресурсів. Статус представлений шляхом JSON <code>.status</code> всередині власного ресурсу. Коли встановлено, * відкриває субресурс /status для власного ресурсу * PUT-запити до субресурсу /status приймають обʼєкт власного ресурсу і ігнорують зміни всього, крім секції статусу * PUT/POST/PATCH-запити до власного ресурсу ігнорують зміни секції статусу

---

## CustomResourceSubresources {#CustomResourceSubresources}

CustomResourceSubresources визначає, як обслуговувати субресурси статусу та масштабу для власних ресурсів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>scale</code><br/><em><a href="{{< ref "#CustomResourceSubresourceScale" >}}">CustomResourceSubresourceScale</a></em></td>
      <td>scale вказує, що власний ресурс повинен обслуговувати субресурс <code>/scale</code>, який повертає обʼєкт <code>autoscaling/v1</code> Scale.</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#CustomResourceSubresourceStatus" >}}">CustomResourceSubresourceStatus</a></em></td>
      <td>status вказує, що власний ресурс повинен обслуговувати субресурс <code>/status</code>. Коли увімкнено:
      <ol><li>запити до основної точки доступу власного ресурсу ігнорують зміни в секції <code>status</code> обʼєкта.</li><li>запити до субресурсу <code>/status</code> ігнорують зміни в будь-чому, крім секції <code>status</code> обʼєкта.</li></ol></td>
    </tr>
  </tbody>
</table>

## CustomResourceValidation {#CustomResourceValidation}

CustomResourceValidation є списком методів валідації для власних ресурсів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>openAPIV3Schema</code><br/><em><a href="{{< ref "#JSONSchemaProps" >}}">JSONSchemaProps</a></em></td>
      <td>openAPIV3Schema є схемою OpenAPI v3, яка використовується для валідації та обрізання.</td>
    </tr>
  </tbody>
</table>

## ExternalDocumentation {#ExternalDocumentation}

ExternalDocumentation дозволяє посилатися на зовнішній ресурс для розширеної документації.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>description</code><br/><em>string</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>url</code><br/><em>string</em></td>
      <td></td>
    </tr>
  </tbody>
</table>

## JSON {#JSON}

JSON представляє будь-яке дійсне значення JSON. Підтримуються такі типи: bool, int64, float64, string, []interface{}, map[string]interface{} та nil.

---

## JSONSchemaProps {#JSONSchemaProps}

JSONSchemaProps є JSON-схемою, що відповідає Specification Draft 4 (<http://json-schema.org/>).

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>$ref</code><br/><em>string</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>$schema</code><br/><em>string</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>additionalItems</code><br/><em><a href="{{< ref "#JSONSchemaPropsOrBool" >}}">JSONSchemaPropsOrBool</a></em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>additionalProperties</code><br/><em><a href="{{< ref "#JSONSchemaPropsOrBool" >}}">JSONSchemaPropsOrBool</a></em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>allOf</code><br/><em><a href="{{< ref "#JSONSchemaProps" >}}">JSONSchemaProps array</a></em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>anyOf</code><br/><em><a href="{{< ref "#JSONSchemaProps" >}}">JSONSchemaProps array</a></em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>default</code><br/><em><a href="{{< ref "#JSON" >}}">JSON</a></em></td>
      <td>default є стандартним значенням для невизначених полів обʼєкта. Defaulting є бета-функцією під керуванням функціональної можливості CustomResourceDefaulting. Defaulting вимагає, щоб spec.preserveUnknownFields було false.</td>
    </tr>
    <tr>
      <td><code>definitions</code><br/><em>object</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>dependencies</code><br/><em>object</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>description</code><br/><em>string</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>enum</code><br/><em><a href="{{< ref "#JSON" >}}">JSON array</a></em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>example</code><br/><em><a href="{{< ref "#JSON" >}}">JSON</a></em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>exclusiveMaximum</code><br/><em>boolean</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>exclusiveMinimum</code><br/><em>boolean</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>externalDocs</code><br/><em><a href="{{< ref "#ExternalDocumentation" >}}">ExternalDocumentation</a></em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>format</code><br/><em>string</em></td>
      <td>format є рядком формату OpenAPI v3. Невідомі формати ігноруються. Наступні формати перевіряються:
      <ul>
        <li>bsonobjectid: BSON-ідентифікатор обʼєкта, тобто 24-символьний шістнадцятковий рядок</li>
        <li>uri: URI, як розібрано за допомогою Golang net/url.ParseRequestURI</li>
        <li>email: адреса електронної пошти, як розібрано за допомогою Golang net/mail.ParseAddress</li>
        <li>hostname: дійсне представлення імені хоста в Інтернеті, як визначено в RFC 1034, розділ 3.1 [RFC1034].</li>
        <li>ipv4: IPv4 IP, як розібрано за допомогою Golang net.ParseIP</li>
        <li>ipv6: IPv6 IP, як розібрано за допомогою Golang net.ParseIP</li>
        <li>cidr: CIDR, як розібрано за допомогою Golang net.ParseCIDR</li>
        <li>mac: MAC-адреса, як розібрано за допомогою Golang net.ParseMAC</li>
        <li>uuid: UUID, який дозволяє великі літери, визначений регулярним виразом (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$</li>
        <li>uuid3: UUID3, який дозволяє великі літери, визначений регулярним виразом (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?3[0-9a-f]{3}-?[0-9a-f]{4}-?[0-9a-f]{12}$</li>
        <li>uuid4: UUID4, який дозволяє великі літери, визначений регулярним виразом (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$</li>
        <li>uuid5: UUID5, який дозволяє великі літери, визначений регулярним виразом (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?5[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$</li>
        <li>isbn: номер ISBN10 або ISBN13, наприклад "0321751043" або "978-0321751041"</li>
        <li>isbn10: номер ISBN10, наприклад "0321751043"</li>
        <li>isbn13: номер ISBN13, наприклад "978-0321751041"</li>
        <li>creditcard: номер кредитної картки, визначений регулярним виразом ^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6[?:011|5[0-9][0-9]](0-9){12}|3[47][0-9]{13}|3[?:0[0-5]|[68][0-9]](0-9){11}|(?:2131|1800|35\\d{3})\\d{11})$ з будь-якими нецифровими символами</li>
        <li>ssn: номер соціального страхування США, що відповідає регулярному виразу ^\\d{3}[- ]?\\d{2}[- ]?\\d{4}$</li>
        <li>hexcolor: шістнадцятковий колірний код, наприклад #FFFFFF: відповідно до регулярного виразу ^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$</li>
        <li>rgbcolor: RGB-колірний код, наприклад "rgb(255,255,2559"</li>
        <li>byte: дані у форматі base64</li>
        <li>password: будь-який рядок</li>
        <li>date: рядок дати, наприклад "2006-01-02", як визначено у full-date в RFC3339</li>
        <li>duration: рядок тривалості, наприклад "22 ns", як розібрано за допомогою Golang time.ParseDuration або сумісно з форматом тривалості Scala</li>
        <li>datetime: рядок дати та часу, наприклад "2014-12-15T19:30:20.000Z", як визначено у date-time в RFC3339.</li>
        </ul></td>
    </tr>
    <tr>
      <td><code>id</code><br/><em>string</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#JSONSchemaPropsOrArray" >}}">JSONSchemaPropsOrArray</a></em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>maxItems</code><br/><em>integer</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>maxLength</code><br/><em>integer</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>maxProperties</code><br/><em>integer</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>maximum</code><br/><em>number</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>minItems</code><br/><em>integer</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>minLength</code><br/><em>integer</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>minProperties</code><br/><em>integer</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>minimum</code><br/><em>number</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>multipleOf</code><br/><em>number</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>not</code><br/><em><a href="{{< ref "#JSONSchemaProps" >}}">JSONSchemaProps</a></em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>nullable</code><br/><em>boolean</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>oneOf</code><br/><em><a href="{{< ref "#JSONSchemaProps" >}}">JSONSchemaProps array</a></em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>pattern</code><br/><em>string</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>patternProperties</code><br/><em>object</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>properties</code><br/><em>object</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>required</code><br/><em>string array</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>title</code><br/><em>string</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>type</code><br/><em>string</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>uniqueItems</code><br/><em>boolean</em></td>
      <td></td>
    </tr>
    <tr>
      <td><code>x-kubernetes-embedded-resource</code><br/><em>boolean</em></td>
      <td>x-kubernetes-embedded-resource визнає, що значення є вбудованим Kubernetes runtime.Object, з TypeMeta та ObjectMeta. Тип повинен бути object. Дозволяється додатково обмежувати вбудований обʼєкт. kind, apiVersion та metadata перевіряються автоматично. x-kubernetes-preserve-unknown-fields дозволяється встановлювати в true, але не обовʼязково, якщо обʼєкт повністю визначений (до kind, apiVersion, metadata).</td>
    </tr>
    <tr>
      <td><code>x-kubernetes-int-or-string</code><br/><em>boolean</em></td>
      <td>x-kubernetes-int-or-string визначає, що це значення є або цілим числом, або рядком. Якщо це true, дозволяється порожній тип, і тип як дочірній елемент anyOf дозволяється, якщо дотримано один із наступних шаблонів:
      <ol>
        <li>anyOf:
          <ul><li>type: integer</li><li>type: string</li></ul></li>
        <li>allOf:
          <ul><li>anyOf:
            <ul><li>type: integer</li><li>type: string</li></ul></li>
          </ul></li>
      </ol></td>
    </tr>
    <tr>
      <td><code>x-kubernetes-list-map-keys</code><br/><em>string array</em></td>
      <td>x-kubernetes-list-map-keys додає анотацію до масиву з типом x-kubernetes-list-type <code>map</code>, вказуючи ключі, що використовуються як індекси мапи. Цей тег ПОВИНЕН використовуватися лише для списків, у яких для розширення "x-kubernetes-list-type" встановлено значення "map". Крім того, значення, вказані для цього атрибута, повинні бути полем скалярного типу дочірньої структури (вкладеність не підтримується).  Вказані властивості повинні бути обовʼязковими або мати стандартне значення, щоб гарантувати їх наявність для всіх елементів списку.</td>
    </tr>
    <tr>
      <td><code>x-kubernetes-list-type</code><br/><em>string</em></td>
      <td>x-kubernetes-list-type додає анотацію до масиву, щоб детальніше описати його топологію. Це розширення повинно використовуватися лише для списків і може мати 3 можливі значення:
      <ol>
        <li><code>atomic</code>: список обробляється як єдиний обʼєкт, подібно до скаляра. Атомарні списки будуть повністю замінені при оновленні. Це розширення може використовуватися для будь-якого типу списку (структура, скаляр тощо).</li>
        <li><code>set</code>: Множини — це списки, які не повинні мати кілька елементів з однаковим значенням. Кожне значення повинно бути скаляром, обʼєктом з x-kubernetes-map-type <code>atomic</code> або масивом з x-kubernetes-list-type <code>atomic</code>.</li>
        <li><code>map</code>: Ці списки схожі на мапи тим, що їх елементи мають неіндексований ключ, який використовується для їх ідентифікації. Порядок зберігається при обʼєднанні. Тег map повинен використовуватися лише для списків з елементами типу обʼєкт. Стандартно для масивів використовується atomic.</li>
      </ol></td>
    </tr>
    <tr>
      <td><code>x-kubernetes-map-type</code><br/><em>string</em></td>
      <td>x-kubernetes-map-type додає анотацію до обʼєкта, щоб детальніше описати його топологію. Це розширення повинно використовуватися лише тоді, коли тип обʼєкта є object, і може мати 2 можливі значення:
      <ol>
        <li><code>granular</code>: Ці мапи є фактичними мапами (пари ключ-значення), і кожне поле є незалежним від інших (вони можуть бути оброблені окремими акторами). Це стандартна поведінка для всіх мап.</li>
        <li><code>atomic</code>: мапа обробляється як єдиний обʼєкт, подібно до скаляра. Атомарні мапи будуть повністю замінені при оновленні.</li>
      </ol></td>
    </tr>
    <tr>
      <td><code>x-kubernetes-preserve-unknown-fields</code><br/><em>boolean</em></td>
      <td>x-kubernetes-preserve-unknown-fields зупиняє крок декодування API-сервера від обрізання полів, які не вказані в схемі валідації. Це впливає на поля рекурсивно, але повертає нормальну поведінку обрізання, якщо в схемі вказані вкладені властивості або additionalProperties. Може бути true або undefined. False заборонено.</td>
    </tr>
    <tr>
      <td><code>x-kubernetes-validations</code><br/><em><a href="{{< ref "#ValidationRule" >}}">ValidationRule array</a></em><br/><em>patch strategy: злиття за ключем <code>rule</code></em></td>
      <td>x-kubernetes-validations описує список правил валідації, написаних мовою виразів CEL.</td>
    </tr>
  </tbody>
</table>


## JSONSchemaPropsOrArray {#JSONSchemaPropsOrArray}

JSONSchemaPropsOrArray представляє значення, яке може бути або JSONSchemaProps, або масивом JSONSchemaProps. В основному використовується для цілей серіалізації.

---

## JSONSchemaPropsOrBool {#JSONSchemaPropsOrBool}

JSONSchemaPropsOrBool представляє JSONSchemaProps або булеве значення. За замовчуванням для булевого властивості встановлено true.

---

## SelectableField {#SelectableField}

SelectableField вказує шлях JSON до поля, яке може використовуватися з селекторами полів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>jsonPath</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>jsonPath — це простий JSON шлях, який оцінюється для кожного власного ресурсу, щоб отримати значення селектора поля. Дозволені лише JSON шляхи без нотації масиву. Повинен вказувати на поле типу string, boolean або integer. Дозволені типи з enum значеннями та рядки з форматами. Якщо jsonPath посилається на відсутнє поле в ресурсі, jsonPath оцінюється як порожній рядок. Не повинен вказувати на поля метаданих. Обовʼязково.</td>
    </tr>
  </tbody>
</table>


## ServiceReference {#ServiceReference}

ServiceReference містить посилання на Service.legacy.k8s.io

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name — це імʼя сервісу. Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>namespace</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>namespace — це простір імен сервісу. Обовʼязково.</td>
    </tr>
    <tr>
      <td><code>path</code><br/><em>string</em></td>
      <td>path — це необовʼязковий URL шлях, за яким буде звертатися вебхук.</td>
    </tr>
    <tr>
      <td><code>port</code><br/><em>integer</em></td>
      <td>port — це необовʼязковий порт сервісу, за яким буде звертатися вебхук. <code>port</code> повинен бути дійсним номером порту (1-65535, включно). Стандартно використовується 443 для зворотної сумісності.</td>
    </tr>
  </tbody>
</table>

## ValidationRule {#ValidationRule}

ValidationRule описує правило валідації, написане мовою виразів CEL.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fieldPath</code><br/><em>string</em></td>
      <td>fieldPath представляє шлях до поля, який повертається, коли валідація не проходить. Він повинен бути відносним JSON шляхом (тобто з нотацією масиву), обмеженим до місця розташування цього розширення x-kubernetes-validations у схемі, і посилатися на наявне поле. Наприклад, коли валідація перевіряє, чи конкретний атрибут <code>foo</code> присутній у мапі <code>testMap</code>, fieldPath може бути встановлений на <code>.testMap.foo</code>. Якщо перевірка передбачає, що два списки повинні містити унікальні атрибути, для параметра fieldPath можна вказати будь-який із цих списків: наприклад, <code>.testList</code>. Не підтримує числовий індекс списку. Підтримує операцію дочірнього елемента для посилання на наявне поле. Див. <a href="/docs/reference/kubectl/jsonpath/">Підтримка JSONPath у Kubernetes</a> для отримання додаткової інформації. Числовий індекс масиву не підтримується. Для імен полів, які містять спеціальні символи, використовуйте <code>['specialName']</code> для посилання на імʼя поля. Наприклад, для атрибута <code>foo.34$</code>, який зʼявляється у списку <code>testList</code>, fieldPath може бути встановлений на <code>.testList['foo.34$']</code></td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>Message представляє повідомлення, яке показується, коли валідація не проходить. Повідомлення є обовʼязковим, якщо правило містить розриви рядків. Повідомлення не повинно містити розриви рядків. Якщо не встановлено, повідомлення буде "failed rule: {Rule}". Наприклад: "must be a URL with the host matching spec.host"</td>
    </tr>
    <tr>
      <td><code>messageExpression</code><br/><em>string</em></td>
      <td>MessageExpression оголошує вираз CEL, який оцінюється як повідомлення про помилку валідації, що повертається, коли це правило не проходить. Оскільки messageExpression використовується як повідомлення про помилку, воно повинно оцінюватися як рядок. Якщо обидва поля message і messageExpression присутні в правилі, то messageExpression буде використано у разі невдачі валідації. Якщо messageExpression призводить до помилки виконання, помилка виконання реєструється, а повідомлення про помилку валідації генерується так, ніби поле messageExpression не встановлено. Якщо messageExpression оцінюється як порожній рядок, рядок, що містить лише пробіли, або рядок, що містить розриви рядків, то повідомлення про помилку валідації також генерується так, ніби поле messageExpression не встановлено, і факт, що messageExpression призвело до порожнього рядка/рядка з лише пробілами/рядка з розривами рядків, буде зареєстровано. messageExpression має доступ до всіх тих самих змінних, що й правило; єдина різниця — тип, що повертається. Приклад: "x must be less than max ("+string(self.max)+")"</td>
    </tr>
    <tr>
      <td><code>optionalOldSelf</code><br/><em>boolean</em></td>
      <td>optionalOldSelf використовується для включення правила переходу в обчислення навіть під час першого створення обʼєкта або якщо старий обʼєкт не містить значення.  Якщо ця опція увімкнена, <code>oldSelf</code> буде опціональним елементом CEL, значення якого дорівнюватиме <code>None</code>, якщо старе значення відсутнє або якщо обʼєкт створюється вперше.  Ви можете перевірити наявність oldSelf за допомогою <code>oldSelf.hasValue()</code> і розпакувати його після перевірки за допомогою <code>oldSelf.value()</code>. Докладнішу інформацію дивіться в документації CEL щодо типів Optional: <a href="https://pkg.go.dev/github.com/google/cel-go/cel#OptionalTypes">https://pkg.go.dev/github.com/google/cel-go/cel#OptionalTypes</a> Не може бути встановлено, якщо <code>oldSelf</code> не використовується в <code>rule</code>.</td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>reason надає придатну для машинного зчитування причину помилки перевірки, яка повертається абоненту, коли запит не відповідає цьому правилу перевірки. Код статусу HTTP, що повертається абоненту, відповідатиме причині першого правила перевірки, яке не пройшло перевірку. Наразі підтримуються такі причини: "FieldValueInvalid", "FieldValueForbidden", "FieldValueRequired", "FieldValueDuplicate". Якщо цей параметр не вказано, за замовчуванням використовується "FieldValueInvalid". Усі причини, додані в майбутньому, повинні бути прийняті клієнтами під час зчитування цього значення, а невідомі причини слід розглядати як FieldValueInvalid.
      <br/><br/>
      Можливі значення enum:
      <ul>
        <li><code>"FieldValueDuplicate"</code> використовується для повідомлення про конфлікти значень, які мають бути унікальними (наприклад, унікальні ідентифікатори).</li>
        <li><code>"FieldValueForbidden"</code> використовується для повідомлення про валідні (відповідно до правил форматування) значення, які будуть прийняті за певних умова, але які не дозволені поточними умовами (такими як політики бузпеки).</li>
        <li><code>"FieldValueInvalid"</code> використовується для повідомлення про спотворені значення (напр. збій регулярного виразу, дуже довгі, поза межами).</li>
        <li><code>"FieldValueRequired"</code> використовується для повідомлення про потрібні значення які не були надані (напр. порожні рядкі, значення null або порожні масиви).</li>
        </ul></td>
    </tr>
    <tr>
      <td><code>rule</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Rule представляє вираз, який буде оцінюватися за допомогою CEL. Ref: <a href="https://github.com/google/cel-spec">https://github.com/google/cel-spec</a>.
      <br/><br/>
      Rule поширюється на місце розташування розширення x-kubernetes-validations у схемі. Змінна <code>self</code> у виразі CEL привʼязана до значення, визначеного в цій області.
      <br/><br/>
      Наприклад правило, яке поширюється на корінь ресурсу з субресурсом статусу:
      <pre>{"rule": "self.status.actual \<= self.spec.maxDesired"}</pre>
      Якщо правило поширюється на обʼєкт з властивостями, доступні властивості обʼєкта можна вибирати за допомогою <code>self.field</code>, а наявність поля можна перевірити за допомогою <code>has(self.field)</code>. Поля зі значенням null вважаються відсутніми в виразах CEL.
      <br/><br/>
      Якщо правило поширюється на обʼєкт з додатковими властивостями (тобто на мапу), значення мапи доступні через <code>self[mapKey]</code>, наявність ключа в мапі можна перевірити через <code>mapKey in self</code>, а всі записи мапи доступні через макроси та функції CEL, такі як <code>self.all(...)</code>.
      <br/><br/>
      Якщо правило поширюється на масив, елементи масиву доступні через <code>self[i]</code> і також через макроси та функції.
      <br/><br/>
      Якщо правило поширюється на скалярне значення, <code>self</code> привʼязане до скалярного значення.
      <br/><br/>
      Приклади:
      <ul>
        <li>Правило, яке поширюється на мапу обʼєктів: <code>{"rule": "self.components['Widget'].priority \< 10"}</code></li>
        <li>Правило, яке поширюється на список цілих чисел: <code>{"rule": "self.values.all(value, value >= 0 && value \< 100)"}</code></li>
        <li>Правило, яке поширюється на рядкове значення: <code>{"rule": "self.startsWith('kube')"}</code></li>
      </ul>
      <code>apiVersion</code>, <code>kind</code>, <code>metadata.name</code> та <code>metadata.generateName</code> завжди доступні з кореня обʼєкта та з будь-яких обʼєктів, анотованих як x-kubernetes-embedded-resource. Жодні інші властивості метаданих недоступні.
      <br/><br/>
      Невідомі дані, збережені у власних ресурсах через x-kubernetes-preserve-unknown-fields, недоступні у виразах CEL. Це включає:
      <ul>
        <li>Невідомі значення полів, які зберігаються схемами обʼєктів з x-kubernetes-preserve-unknown-fields.</li>
        <li>Властивості обʼєктів, де схема властивості є "невідомого типу". "Невідомий тип" визначається рекурсивно як:
          <ul>
            <li>Схема без типу і з x-kubernetes-preserve-unknown-fields, встановленим у true.</li>
            <li>Масив, де схема елементів є "невідомого типу".</li>
            <li>Обʼєкт, де схема additionalProperties є "невідомого типу".</li>
          </ul>
        </li>
      </ul>
      Лише імена властивостей у формі <code>[a-zA-Z_.-/][a-zA-Z0-9_.-/]*</code> доступні.
      <br/><br/>
      Доступні імена властивостей екрануються відповідно до наступних правил при доступі у виразі:
      <ul>
        <li><code>'__'</code> екранується як <code>'__underscores__'</code>.</li>
        <li><code>'.'</code> екранується як <code>'__dot__'</code>.</li>
        <li><code>'-'</code> екранується як <code>'__dash__'</code>.</li>
        <li><code>'/'</code> екранується як <code>'__slash__'</code>.</li>
        <li>Імена властивостей, які точно збігаються з зарезервованим ключовим словом CEL, екрануються як <code>'__{keyword}__'</code>.</li>
      </ul>
      Ключові слова: <code>"true", "false", "null", "in", "as", "break", "const", "continue", "else", "for", "function", "if", "import", "let", "loop", "package", "namespace", "return"</code>.
      <br/><br/>
      Приклади:
      <ul>
        <li>Правило, яке отримує доступ до властивості з імʼям <code>"namespace"</code>: <code>{"rule": "self.__namespace__ > 0"}</code></li>
        <li>Правило, яке отримує доступ до властивості з імʼям <code>"x-prop"</code>: <code>{"rule": "self.x__dash__prop > 0"}</code></li>
        <li>Правило, яке отримує доступ до властивості з імʼям <code>"redact__d"</code>: <code>{"rule": "self.redact__underscores__d > 0"}</code></li>
      </ul>
      Рівність масивів з x-kubernetes-list-type <code>'set'</code> або <code>'map'</code> ігнорує порядок елементів, тобто <code>[1, 2] == [2, 1]</code>.
      <br/><br/>
      Конкатенація масивів з x-kubernetes-list-type використовує семантику типу списку:
      <ul>
        <li><code>'set'</code>: <code>X + Y</code> виконує обʼєднання, де зберігаються позиції всіх елементів у <code>X</code>, а неперетинаючі елементи з <code>Y</code> додаються, зберігаючи їх частковий порядок.</li>
        <li><code>'map'</code>: <code>X + Y</code> виконує злиття, де зберігаються позиції всіх ключів у <code>X</code>, але значення перезаписуються значеннями з <code>Y</code>, коли множини ключів <code>X</code> і <code>Y</code> перетинаються. Елементи в <code>Y</code> з неперетинаючими ключами додаються, зберігаючи їх частковий порядок.</li>
      </ul>
      Якщо <code>rule</code> використовує змінну <code>oldSelf</code>, вона неявно є <code>transition rule</code>.
      <br/><br/>
      Стандартно змінна <code>oldSelf</code> має той самий тип, що й <code>self</code>. Коли <code>optionalOldSelf</code> встановлено в true, змінна <code>oldSelf</code> є CEL optional змінною, значення якої <code>value()</code> має той самий тип, що й <code>self</code>. Див. документацію для поля <code>optionalOldSelf</code> для деталей.
      <br/><br/>
      Правила переходу стандартно застосовуються лише до запитів UPDATE і пропускаються, якщо старе значення не знайдено. Ви можете зробити правило переходу безумовним, встановивши <code>optionalOldSelf</code> в true.</td>
    </tr>
  </tbody>
</table>


## WebhookClientConfig {#WebhookClientConfig}

WebhookClientConfig містить інформацію для встановлення TLS-зʼєднання з вебхуком.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>caBundle</code><br/><em>string</em></td>
      <td>caBundle є PEM закодованим CA-пакунком, який буде використаний для перевірки сертифіката сервера вебхука. Якщо не вказано, використовуються системні кореневі довірчі сертифікати на apiserver.</td>
    </tr>
    <tr>
      <td><code>service</code><br/><em><a href="{{< ref "#ServiceReference" >}}">ServiceReference</a></em></td>
      <td>service є посиланням на сервіс для цього вебхука. Має бути вказано або service, або url. Якщо вебхук працює всередині кластера, слід використовувати <code>service</code>.</td>
    </tr>
    <tr>
      <td><code>url</code><br/><em>string</em></td>
      <td>url дає місцезнаходження вебхука у стандартній формі URL (<code>scheme://host:port/path</code>). Має бути вказано лише одне з полів <code>url</code> або <code>service</code>. Поле <code>host</code> не повинно посилатися на сервіс, що працює в кластері; замість цього слід використовувати поле <code>service</code>. Хост може бути визначений через зовнішній DNS в деяких apiserver (наприклад, <code>kube-apiserver</code> не може визначати внутрішній DNS кластера, оскільки це порушило б шарову архітектуру). <code>host</code> також може бути IP-адресою. Зверніть увагу, що використання <code>localhost</code> або <code>127.0.0.1</code> як <code>host</code> є ризикованим, якщо ви не забезпечите запуск цього вебхука на всіх хостах, які запускають apiserver і можуть потребувати викликів до цього вебхука. Такі установки, ймовірно, будуть непереносимими, тобто їх буде важко розгорнути в новому кластері. Схема повинна бути "https"; URL повинен починатися з "https://". Шлях є необовʼязковим, і якщо він присутній, може бути будь-яким рядком, допустимим у URL. Ви можете використовувати шлях для передачі довільного рядка вебхуку, наприклад, ідентифікатора кластера. Використання користувача або базової автентифікації, наприклад "user:password@", не дозволяється. Фрагменти ("#...") та параметри запиту ("?...") також не дозволяються.</td>
    </tr>
  </tbody>
</table>

## WebhookConversion {#WebhookConversion}

WebhookConversion описує, як викликати вебхук для конверсії

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>clientConfig</code><br/><em><a href="{{< ref "#WebhookClientConfig" >}}">WebhookClientConfig</a></em></td>
      <td>clientConfig містить інструкції щодо виклику вебхука, якщо стратегія встановлена на <code>Webhook</code>.</td>
    </tr>
    <tr>
      <td><code>conversionReviewVersions</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>conversionReviewVersions є впорядкованим списком переважних версій <code>ConversionReview</code>, які очікує вебхук. API-сервер використовуватиме першу версію зі списку, яку він підтримує. Якщо жодна з версій, зазначених у цьому списку, не підтримується API-сервером, конверсія для власного ресурсу не вдасться. Якщо збережена конфігурація вебхука вказує дозволені версії і не включає жодної версії, відомої API-серверу, виклики до вебхука не вдасться.</td>
    </tr>
  </tbody>
</table>

## Операції {#Operations}

---

### `post` Create

#### HTTP Запит {#http-request}

POST /apis/apiextensions.k8s.io/v1/customresourcedefinitions

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
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
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
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
  </tbody>
</table>


### `patch` Patch

#### HTTP Запит {#http-request-1}

PATCH /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}


#### Параметри шляху {#path-parameters}


<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CustomResourceDefinition</td>
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
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
  </tbody>
</table>


### `put` Replace

#### HTTP Запит {#http-request-2}

PUT /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}


#### Параметри шляху {#path-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CustomResourceDefinition</td>
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
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
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
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
  </tbody>
</table>


### `delete` Delete

#### HTTP Запит {#http-request-3}

DELETE /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}


#### Параметри шляху {#path-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CustomResourceDefinition</td>
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
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
  </tbody>
</table>


### `delete` Delete Collection

#### HTTP Запит {#http-request-4}

DELETE /apis/apiextensions.k8s.io/v1/customresourcedefinitions

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

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}


#### Параметри шляху {#path-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CustomResourceDefinition</td>
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
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
  </tbody>
</table>


### `get` List

#### HTTP Запит {#http-request-6}

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions

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
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinitionList" >}}">CustomResourceDefinitionList</a></em></td>
    </tr>
  </tbody>
</table>


### `get` Watch

#### HTTP Запит {#http-request-7}

GET /apis/apiextensions.k8s.io/v1/watch/customresourcedefinitions/{name}


#### Параметри шляху {#path-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CustomResourceDefinition</td>
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

GET /apis/apiextensions.k8s.io/v1/watch/customresourcedefinitions

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


### `patch` Patch Status

#### HTTP Запит {#http-request-9}

PATCH /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status


#### Параметри шляху {#path-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CustomResourceDefinition</td>
    </tr>
  </tbody>
</table>


#### Параметри запиту {#query-parameters-9}

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

#### Параметри тіла запиту {#body-parameters-7}

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


#### Відповідь {#response-9}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
  </tbody>
</table>


### `get` Read Status

#### HTTP Запит {#http-request-10}

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status


#### Параметри шляху {#path-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CustomResourceDefinition</td>
    </tr>
  </tbody>
</table>


#### Параметри запиту {#query-parameters-10}

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

#### Відповідь {#response-10}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
  </tbody>
</table>


### `put` Replace Status

#### HTTP Запит {#http-request-11}

PUT /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status


#### Параметри шляху {#path-parameters-7}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва CustomResourceDefinition</td>
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
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
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
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a></em></td>
    </tr>
  </tbody>
</table>
