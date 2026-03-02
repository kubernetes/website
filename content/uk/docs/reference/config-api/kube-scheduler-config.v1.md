---
title: kube-scheduler Configuration (v1)
content_type: tool-reference
package: kubescheduler.config.k8s.io/v1
auto_generated: false
---

## Типи ресурсів {#resource-types}

- [DefaultPreemptionArgs](#kubescheduler-config-k8s-io-v1-DefaultPreemptionArgs)
- [DynamicResourcesArgs](#kubescheduler-config-k8s-io-v1-DynamicResourcesArgs)
- [InterPodAffinityArgs](#kubescheduler-config-k8s-io-v1-InterPodAffinityArgs)
- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)
- [NodeAffinityArgs](#kubescheduler-config-k8s-io-v1-NodeAffinityArgs)
- [NodeResourcesBalancedAllocationArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesBalancedAllocationArgs)
- [NodeResourcesFitArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs)
- [PodTopologySpreadArgs](#kubescheduler-config-k8s-io-v1-PodTopologySpreadArgs)
- [VolumeBindingArgs](#kubescheduler-config-k8s-io-v1-VolumeBindingArgs)

## `ClientConnectionConfiguration` {#ClientConnectionConfiguration}

**Зʼявляється у:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

ClientConnectionConfiguration містить деталі для створення клієнта.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>kubeconfig</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>kubeconfig — шлях до файлу KubeConfig.</p>
</td>
</tr>
<tr><td><code>acceptContentTypes</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>acceptContentTypes визначає заголовок Accept, який надсилається клієнтами при підключенні до сервера, перевизначаючи стандатне значення 'application/json'. Це поле буде контролювати всі зʼєднання з сервером, що використовуються певним клієнтом.</p>
</td>
</tr>
<tr><td><code>contentType</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>contentType — тип вмісту, який використовується при надсиланні даних на сервер від цього клієнта.</p>
</td>
</tr>
<tr><td><code>qps</code> <b>[Обовʼязкове]</b><br/>
<code>float32</code>
</td>
<td>
   <p>qps контролює кількість запитів на секунду, дозволених для цього зʼєднання.</p>
</td>
</tr>
<tr><td><code>burst</code> <b>[Обовʼязкове]</b><br/>
<code>int32</code>
</td>
<td>
   <p>burst дозволяє накопичувати додаткові запити, коли клієнт перевищує свою норму.</p>
</td>
</tr>
</tbody>
</table>

## `DebuggingConfiguration` {#DebuggingConfiguration}

**Зʼявляється у:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

DebuggingConfiguration містить конфігурацію для функцій, що повʼязані з налагодженням.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>enableProfiling</code> <b>[Обовʼязкове]</b><br/>
<code>bool</code>
</td>
<td>
   <p>enableProfiling увімкне профілювання через веб-інтерфейс host:port/debug/pprof/</p>
</td>
</tr>
<tr><td><code>enableContentionProfiling</code> <b>[Обовʼязкове]</b><br/>
<code>bool</code>
</td>
<td>
   <p>enableContentionProfiling увімкне профілювання блокувань, якщо enableProfiling увімкнено.</p>
</td>
</tr>
</tbody>
</table>

## `LeaderElectionConfiguration` {#LeaderElectionConfiguration}

**Зʼявляється у:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

LeaderElectionConfiguration визначає конфігурацію клієнтів вибору лідера для компонентів, які можуть працювати з увімкненим вибором лідера.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>leaderElect</code> <b>[Обовʼязкове]</b><br/>
<code>bool</code>
</td>
<td>
   <p>leaderElect увімкне клієнта вибору лідера для отримання лідерства перед виконанням основного циклу. Увімкніть це при запуску реплікованих компонентів для високої доступності.</p>
</td>
</tr>
<tr><td><code>leaseDuration</code> <b>[Обовʼязкове]</b><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>leaseDuration — це період часу, протягом якого кандидати, які не є лідерами, чекатимуть після поновлення лідерства, перш ніж спробувати зайняти лідерство в лідерському слоті, який вже зайнятий, але не поновлений. Це фактично максимальний термін, на який лідер може бути зупинений, перш ніж його замінить інший кандидат. Це може бути застосовано лише у випадку, якщо вибори лідера увімкнено.</p>
</td>
</tr>
<tr><td><code>renewDeadline</code> <b>[Обовʼязкове]</b><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>renewDeadline — це інтервал між спробами діючого лідера оновити слот лідерства перед тим, як він припинить лідирування. Це має бути менше або дорівнювати тривалості оренди. Це застосовно тільки тоді, коли вибір лідера увімкнено.</p>
</td>
</tr>
<tr><td><code>retryPeriod</code> <b>[Обовʼязкове]</b><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>retryPeriod — це тривалість, яку клієнти повинні чекати між спробами отримання та оновлення лідерства. Це застосовно тільки тоді, коли вибір лідера увімкнено.</p>
</td>
</tr>
<tr><td><code>resourceLock</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>resourceLock вказує тип обʼєкта ресурсу, який буде використовуватися для блокування під час циклів вибору лідера.</p>
</td>
</tr>
<tr><td><code>resourceName</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>resourceName вказує на імʼя обʼєкта ресурсу, який буде використовуватися для блокування під час циклів вибору лідера.</p>
</td>
</tr>
<tr><td><code>resourceNamespace</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>resourceNamespace вказує на простір імен обʼєкта ресурсу, який буде використовуватися для блокування під час циклів вибору лідера.</p>
</td>
</tr>
</tbody>
</table>

## `DefaultPreemptionArgs` {#kubescheduler-config-k8s-io-v1-DefaultPreemptionArgs}

DefaultPreemptionArgs містить аргументи, які використовуються для налаштування втулка DefaultPreemption.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>DefaultPreemptionArgs</code></td></tr>
<tr><td><code>minCandidateNodesPercentage</code> <b>[Обовʼязкове]</b><br/>
<code>int32</code>
</td>
<td>
   <p>MinCandidateNodesPercentage — це мінімальна кількість кандидатів для відбору при тестуванні виселення як відсоток від кількості вузлів. Має бути в межах [0, 100]. Стандартно дорівнює 10% від розміру кластера, якщо не вказано.</p>
</td>
</tr>
<tr><td><code>minCandidateNodesAbsolute</code> <b>[Обовʼязкове]</b><br/>
<code>int32</code>
</td>
<td>
   <p>MinCandidateNodesAbsolute — це абсолютна мінімальна кількість кандидатів для відбору. Ймовірна кількість кандидатів, які будуть перераховані для тестування виселення, розраховується за формулою:</p>
   <p><code>numCandidates = max(numNodes * minCandidateNodesPercentage, minCandidateNodesAbsolute).</code></p>
   <p>Ми говоримо "ймовірна", оскільки є й інші фактори, такі як порушення PDB, які впливають на кількість кандидатів для відбору. Має бути не менше 0 вузлів. Стандартно дорівнює 100 вузлам, якщо не вказано.</p>
</td>
</tr>
</tbody>
</table>

## `DynamicResourcesArgs`     {#kubescheduler-config-k8s-io-v1-DynamicResourcesArgs}

<p>DynamicResourcesArgs містить аргументи, що використовуються для налаштування втулків DynamicResources.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>DynamicResourcesArgs</code></td></tr>

<tr><td><code>filterTimeout</code> <B>[Обовʼязково]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>FilterTimeout обмежує час, який може зайняти операція фільтрації на кожному вузлі для пошуку пристроїв, які можуть бути виділені для планувальника pod на цей вузол.</p>
   <p>У типових сценаріях ця операція повинна завершитися за 10–200 мілісекунд, але може тривати довше залежно від кількості запитів на ResourceClaim, кількості ResourceClaims, кількості опублікованих пристроїв у ResourceSlices та складності запитів. Інші перевірки, крім оцінки CEL, також займають час (перевірка використання, відповідність атрибутів тощо).</p>
   <p>Тому втулок планувальника застосовує цей тайм-аут. Якщо тайм-аут досягнуто, Pod вважається таким, що не підлягає плануванню для вузла. Якщо фільтрування для деяких інших вузлів є успішним, то замість них вибираються саме вони. Якщо фільтрування не вдається для всіх вузлів, Pod поміщається в чергу, що не підлягає плануванню. Він буде перевірений знову, якщо зміни, наприклад, в ResourceSlices або ResourceClaims, вказують на те, що інша спроба планування може бути успішною. Якщо це повторно не вдається, експоненціальне відхилення уповільнює майбутні спроби.</p>
   <p>Стандартно встановлено 10 секунд. Цього достатньо, щоб запобігти найгіршим сценаріям, не впливаючи на нормальне використання DRA. Однак повільна фільтрація може уповільнити планування Pod, навіть для Pod, які не використовують DRA. Адміністратори можуть зменшити час очікування після перевірки метрик <code>scheduler_framework_extension_point_duration_seconds</code>.</p>
   <p>Встановлення значення нуль повністю вимикає тайм-аут.</p>
</td>
</tr>
<tr><td><code>bindingTimeout</code> <B>[Обовʼязково]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>BindingTimeout обмежує час, протягом якого розширення PreBind може чекати на виконання умов привʼязки пристрою ResourceClaim, коли такі умови присутні. Під час очікування планувальник періодично перевіряє стан пристрою. Якщо час очікування закінчується до того, як всі необхідні умови стануть істинними (або будь-які умови bindingFailureConditions стануть істинними), розподіл ресурсів скасовується, а Pod знову потрапляє в чергу планування. Зверніть увагу, що за можливості може бути обрано той самий або інший вузол; в іншому випадку Pod поміщається в чергу, що не підлягає плануванню, і повторюється на основі змін кластера та повернення.</p>
   <p>Стандартні значення тафункціональні можливіості:</p>
      <ul>
         <li>Стандартне значення — 10 хвилин, коли увімкнено функціональну можливість DRADeviceBindingConditions.</li>
         <li>Діє тільки тоді, коли ОДНОЧАСНО ввімкнені DRADeviceBindingConditions та DRAResourceClaimDeviceStatus; в іншому випадку це поле пропускається.</li>
         <li>Коли DRADeviceBindingConditions вимкнено, встановлення цього поля вважається помилкою.</li>
      </ul>
   <p>Дійсні значення:</p>
      <ul>
         <li>
         <blockquote>
         <p>=1s (не нуль). Верхня межа не встановлена.</p>
         </blockquote>
         </li>
      </ul>
   <p>Рекомендації щодо налаштування:</p>
   <ul>
      <li>Нижчі значення скорочують час повторної спроби, коли пристрої не готові, але можуть збільшити відтік клієнтів, якщо драйверам зазвичай потрібно більше часу, щоб повідомити про готовність.</li>
      <li>Перегляньте показники затримки планувальника (наприклад, тривалість PreBind у <code>scheduler_framework_extension_point_duration_seconds</code>) та поведінку готовності драйвера перед тим, як скоротити цей час очікування.</li>
   </ul>
</td>
</tr>
</tbody>
</table>

## `InterPodAffinityArgs` {#kubescheduler-config-k8s-io-v1-InterPodAffinityArgs}

InterPodAffinityArgs містить аргументи, які використовуються для налаштування втулка InterPodAffinity.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>InterPodAffinityArgs</code></td></tr>
<tr><td><code>hardPodAffinityWeight</code> <b>[Обовʼязкове]</b><br/>
<code>int32</code>
</td>
<td>
   <p>HardPodAffinityWeight — це вага оцінки для наявних Podʼів з відповідною жорсткою спорідненністю до вхідного Podʼа.</p>
</td>
</tr>
<tr><td><code>ignorePreferredTermsOfExistingPods</code> <b>[Обовʼязкове]</b><br/>
<code>bool</code>
</td>
<td>
   <p>IgnorePreferredTermsOfExistingPods налаштовує планувальник ігнорувати бажані правила спорідненості наявних Podʼів при оцінці кандидатів вузлів, якщо вхідний Pod не має спорідненості між Podʼами.</p>
</td>
</tr>
</tbody>
</table>

## `KubeSchedulerConfiguration` {#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration}

KubeSchedulerConfiguration налаштовує планувальник

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>KubeSchedulerConfiguration</code></td></tr>
<tr><td><code>parallelism</code> <b>[Обовʼязкове]</b><br/>
<code>int32</code>
</td>
<td>
   <p>Parallelism визначає кількість паралелізму в алгоритмах для планування Podʼів. Має бути більше 0. Стандартно — 16</p>
</td>
</tr>
<tr><td><code>leaderElection</code> <b>[Обовʼязкове]</b><br/>
<a href="#LeaderElectionConfiguration"><code>LeaderElectionConfiguration</code></a>
</td>
<td>
   <p>LeaderElection визначає конфігурацію клієнта виборів лідера.</p>
</td>
</tr>
<tr><td><code>clientConnection</code> <b>[Обовʼязкове]</b><br/>
<a href="#ClientConnectionConfiguration"><code>ClientConnectionConfiguration</code></a>
</td>
<td>
   <p>ClientConnection визначає файл kubeconfig і налаштування підключення клієнта для використання проксі-сервером при спілкуванні з apiserver.</p>
</td>
</tr>
<tr><td><code>DebuggingConfiguration</code> <b>[Обовʼязкове]</b><br/>
<a href="#DebuggingConfiguration"><code>DebuggingConfiguration</code></a>
</td>
<td>(Члени <code>DebuggingConfiguration</code> вбудовані в цей тип.)
   <p>DebuggingConfiguration містить налаштування для функцій, повʼязаних із налагодженням. TODO: Ми можемо зробити це підструктурою як налагодження componentbaseconfigv1alpha1.DebuggingConfiguration</p>
</td>
</tr>
<tr><td><code>percentageOfNodesToScore</code> <b>[Обовʼязкове]</b><br/>
<code>int32</code>
</td>
<td>
   <p>PercentageOfNodesToScore — це відсоток усіх вузлів, які, як тільки будуть визнані придатними для запуску Podʼа, планувальник припиняє пошук інших придатних вузлів у кластері. Це допомагає покращити продуктивність планувальника. Планувальник завжди намагається знайти принаймні &quot;minFeasibleNodesToFind&quot; придатних вузлів незалежно від значення цього прапорця. Приклад: якщо розмір кластера 500 вузлів і значення цього прапорця 30, то планувальник припиняє пошук далі придатних вузлів, як тільки знайде 150 придатних. Коли значення дорівнює 0, стандартно буде оцінено відсоток вузлів (5%—50% залежно від розміру кластера). Він перекривається рівнем профілю PercentageOfNodesToScore.</p>
</td>
</tr>
<tr><td><code>podInitialBackoffSeconds</code> <b>[Обовʼязкове]</b><br/>
<code>int64</code>
</td>
<td>
   <p>PodInitialBackoffSeconds — це початкова фора для непридатних для планування Podʼів. Якщо вказано, він повинен бути більше 0. Якщо це значення нульове, буде використано стандартне значення (1s).</p>
</td>
</tr>
<tr><td><code>podMaxBackoffSeconds</code> <b>[Обовʼязкове]</b><br/>
<code>int64</code>
</td>
<td>
   <p>PodMaxBackoffSeconds — це максимальна фора для непридатних для планування Podʼів. Якщо вказано, він повинен бути більше podInitialBackoffSeconds. Якщо це значення нульове, буде використано стандартне значення (10s).</p>
</td>
</tr>
<tr><td><code>profiles</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile"><code>[]KubeSchedulerProfile</code></a>
</td>
<td>
   <p>Profiles — це профілі планування, які підтримує kube-scheduler. Podʼи можуть вибрати, щоб їх планували за певним профілем, встановивши відповідну назву планувальника. Podʼи, які не вказують жодної назви планувальника, плануються за допомогою профілю &quot;default-scheduler&quot;, якщо він присутній тут.</p>
</td>
</tr>
<tr><td><code>extenders</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-Extender"><code>[]Extender</code></a>
</td>
<td>
   <p>Extenders — це список розширень планувальника, кожне з яких містить значення, як спілкуватися з розширенням. Ці розширення використовуються всіма профілями планувальника.</p>
</td>
</tr>
<tr><td><code>delayCacheUntilActive</code> <b>[Обовʼязкове]</b><br/>
<code>bool</code>
</td>
<td>
   <p>DelayCacheUntilActive визначає, коли починати кешування. Якщо це true і вибори лідера увімкнені, планувальник чекатиме, щоб заповнити кеші інформаторів, поки не стане лідером. Це призведе до повільнішого перемикання з резервного на основний вузол із перевагою нижчого використання пам’яті під час очікування стати лідером. Стандартно — false.</p>
</td>
</tr>
</tbody>
</table>

## `NodeAffinityArgs` {#kubescheduler-config-k8s-io-v1-NodeAffinityArgs}

NodeAffinityArgs містить аргументи для налаштування втулка NodeAffinity.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeAffinityArgs</code></td></tr>
<tr><td><code>addedAffinity</code><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.35/#nodeaffinity-v1-core"><code>core/v1.NodeAffinity</code></a>
</td>
<td>
   <p>AddedAffinity застосовується до всіх Podʼів додатково до NodeAffinity, вказаного в PodSpec. Тобто вузли повинні відповідати AddedAffinity І .spec.NodeAffinity. AddedAffinity є станадртно порожнім (є збіг зі всіма вузлами). Коли використовується AddedAffinity, деякі Podʼи з вимогами щодо спорідненості, які збігаються з конкретним вузлом (наприклад, Podʼи Daemonset), можуть залишатися непридатними для планування.</p>
</td>
</tr>
</tbody>
</table>

## `NodeResourcesBalancedAllocationArgs`     {#kubescheduler-config-k8s-io-v1-NodeResourcesBalancedAllocationArgs}

NodeResourcesBalancedAllocationArgs містить аргументи для налаштування втулка NodeResourcesBalancedAllocation.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeResourcesBalancedAllocationArgs</code></td></tr>
<tr><td><code>resources</code> <b>[Обовʼязково]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-ResourceSpec"><code>[]ResourceSpec</code></a>
</td>
<td>
   <p>Ресурси, якими потрібно керувати, стандартно: &quot;cpu&quot; та &quot;memory&quot;, якщо не вказано інше.</p>
</td>
</tr>
</tbody>
</table>

## `NodeResourcesFitArgs` {#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs}

NodeResourcesFitArgs містить аргументи для налаштування втулка NodeResourcesFit.


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>NodeResourcesFitArgs</code></td></tr>
<tr><td><code>ignoredResources</code> <b>[Обовʼязково]</b><br/>
<code>[]string</code>
</td>
<td>
   <p>IgnoredResources — список ресурсів, які фільтр NodeResources повинен ігнорувати. Це не застосовується до оцінювання.</p>
</td>
</tr>
<tr><td><code>ignoredResourceGroups</code> <b>[Обовʼязково]</b><br/>
<code>[]string</code>
</td>
<td>
   <p>IgnoredResourceGroups визначає список груп ресурсів, які фільтр NodeResources повинен ігнорувати. наприклад, якщо група - [&quot;example.com&quot;], вона ігноруватиме всі імена ресурсів, які починаються з &quot;example.com&quot;, такі як &quot;example.com/aaa&quot; і &quot;example.com/bbb&quot;. Імʼя групи ресурсів не може містити '/'. Це не застосовується до оцінювання.</p>
</td>
</tr>
<tr><td><code>scoringStrategy</code> <b>[Обовʼязково]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-ScoringStrategy"><code>ScoringStrategy</code></a>
</td>
<td>
   <p>ScoringStrategy вибирає стратегію оцінювання ресурсів вузлів. Стандартно використовується стратегія LeastAllocated з рівною вагою &quot;cpu&quot; та &quot;memory&quot;.</p>
</td>
</tr>
</tbody>
</table>

## `PodTopologySpreadArgs` {#kubescheduler-config-k8s-io-v1-PodTopologySpreadArgs}

PodTopologySpreadArgs містить аргументи для налаштування втулка PodTopologySpread.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PodTopologySpreadArgs</code></td></tr>
<tr><td><code>defaultConstraints</code><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.35/#topologyspreadconstraint-v1-core"><code>[]core/v1.TopologySpreadConstraint</code></a>
</td>
<td>
   <p>DefaultConstraints визначає обмеження на розподіл топології, які будуть застосовані до Podʼів, що не мають визначених обмежень у <code>pod.spec.topologySpreadConstraints</code>. <code>.defaultConstraints[*].labelSelectors</code> повинні бути порожніми, оскільки вони виводяться з приналежності Podʼа до Services, ReplicationControllers, ReplicaSets або StatefulSets. Якщо не порожньо, .defaultingType має бути &quot;List&quot;.</p>
</td>
</tr>
<tr><td><code>defaultingType</code><br/>
<a href="#kubescheduler-config-k8s-io-v1-PodTopologySpreadConstraintsDefaulting"><code>PodTopologySpreadConstraintsDefaulting</code></a>
</td>
<td>
   <p>DefaultingType визначає, як виводяться .defaultConstraints. Може бути одним з &quot;System&quot; або &quot;List&quot;.</p>
<ul>
<li>&quot;System&quot;: Використовувати визначені kubernetes обмеження, які розподіляють Podʼи серед вузлів і зон.</li>
<li>&quot;List&quot;: Використовувати обмеження, визначені в .defaultConstraints.</li>
</ul>
<p>Стандартно &quot;System&quot;.</p>
</td>
</tr>
</tbody>
</table>

## `VolumeBindingArgs` {#kubescheduler-config-k8s-io-v1-VolumeBindingArgs}

VolumeBindingArgs містить аргументи для налаштування втулка VolumeBinding.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubescheduler.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>VolumeBindingArgs</code></td></tr>
<tr><td><code>bindTimeoutSeconds</code> <b>[Обовʼязкове]</b><br/>
<code>int64</code>
</td>
<td>
   <p>BindTimeoutSeconds — це тайм-аут в секундах у операції привʼязки томів. Значення повинно бути невідʼємним цілим числом. Значення нуль означає, що немає очікування. Якщо це значення не вказано, буде використано стандартне значення (600).</p>
</td>
</tr>
<tr><td><code>shape</code><br/>
<a href="#kubescheduler-config-k8s-io-v1-UtilizationShapePoint"><code>[]UtilizationShapePoint</code></a>
</td>
<td>
   <p>Shape вказує точки, що визначають форму функції оцінки, яка використовується для оцінки вузлів на основі використання наданих PV. Використання розраховується шляхом поділу загального запитаного обсягу сховища Podʼа на загальну ємність доступних PV на кожному вузлі. Кожна точка містить використання (у діапазоні від 0 до 100) та відповідну оцінку (у діапазоні від 0 до 10). Ви можете налаштувати пріоритет, вказуючи різні оцінки для різних рівнів використання. Стандартні точки Shape:</p>
<ol>
<li>10 для 0 використання</li>
<li>0 для 100 використання. Всі точки повинні бути відсортовані у зростаючому порядку за використанням.</li>
</ol>
</td>
</tr>
</tbody>
</table>

## `Extender` {#kubescheduler-config-k8s-io-v1-Extender}

**Зʼявляється в:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

Extender містить параметри, що використовуються для звʼязку з розширювачем. Якщо дієслово не вказано/пусте, вважається, що розширювач вирішів не надавати це розширення.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>urlPrefix</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>URLPrefix за яким доступний розширювач</p>
</td>
</tr>
<tr><td><code>filterVerb</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Дієслово для виклику фільтрації, порожнє, якщо не підтримується. Це дієслово додається до URLPrefix при виконанні виклику фільтрації розширювача.</p>
</td>
</tr>
<tr><td><code>preemptVerb</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Дієслово для виклику витіснення, порожнє, якщо не підтримується. Це дієслово додається до URLPrefix при виконанні виклику витіснення розширювача.</p>
</td>
</tr>
<tr><td><code>prioritizeVerb</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Дієслово для виклику пріоритезації, порожнє, якщо не підтримується. Це дієслово додається до URLPrefix при виконанні виклику пріоритезації розширювача.</p>
</td>
</tr>
<tr><td><code>weight</code> <b>[Обовʼязкове]</b><br/>
<code>int64</code>
</td>
<td>
   <p>Числовий множник для оцінок вузлів, які генерує виклик пріоритезації. Вага повинна бути додатним цілим числом</p>
</td>
</tr>
<tr><td><code>bindVerb</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Дієслово для виклику привʼязки, порожнє, якщо не підтримується. Це дієслово додається до URLPrefix при виконанні виклику привʼязки розширювача. Якщо цей метод реалізовано розширювачем, це відповідальність розширювача привʼязати Pod до apiserver. Тільки один розширювач може реалізовувати цю функцію.</p>
</td>
</tr>
<tr><td><code>enableHTTPS</code> <b>[Обовʼязкове]</b><br/>
<code>bool</code>
</td>
<td>
   <p>EnableHTTPS вказує, чи слід використовувати https для звʼязку з розширювачем</p>
</td>
</tr>
<tr><td><code>tlsConfig</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-ExtenderTLSConfig"><code>ExtenderTLSConfig</code></a>
</td>
<td>
   <p>TLSConfig вказує налаштування транспортного рівня безпеки</p>
</td>
</tr>
<tr><td><code>httpTimeout</code> <b>[Обовʼязкове]</b><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>HTTPTimeout вказує тривалість тайм-ауту для виклику розширювача. Тайм-аут фільтрації призводить до невдалої спроби планування Podʼа. Тайм-аут пріоритезації ігнорується, пріоритети k8s/інших розширювачів використовуються для вибору вузла.</p>
</td>
</tr>
<tr><td><code>nodeCacheCapable</code> <b>[Обовʼязкове]</b><br/>
<code>bool</code>
</td>
<td>
   <p>NodeCacheCapable вказує, що розширювач здатний кешувати інформацію про вузли, отже, планувальник повинен надсилати лише мінімальну інформацію про придатні вузли, припускаючи, що розширювач вже кешував повні дані про всі вузли в кластері</p>
</td>
</tr>
<tr><td><code>managedResources</code><br/>
<a href="#kubescheduler-config-k8s-io-v1-ExtenderManagedResource"><code>[]ExtenderManagedResource</code></a>
</td>
<td>
   <p>ManagedResources — це список розширених ресурсів, що керуються
цим розширювачем.</p>
<ul>
<li>Pod буде надіслано до розширювача на етапах фільтрації, пріоритезації та привʼязки (якщо розширювач є звʼязувальним) тільки якщо Pod запитує принаймні
один з розширених ресурсів у цьому списку. Якщо список порожній або не вказаний,
всі Podʼи будуть надіслані до цього розширювача.</li>
<li>Якщо IgnoredByScheduler встановлено в true для ресурсу, kube-scheduler
буде пропускати перевірку ресурсу в предикатах.</li>
</ul>
</td>
</tr>
<tr><td><code>ignorable</code> <b>[Обовʼязкове]</b><br/>
<code>bool</code>
</td>
<td>
   <p>Ignorable вказує, чи можна ігнорувати розширювач, тобто планування не повинно не вдасться, якщо розширювач повертає помилку або недоступний.</p>
</td>
</tr>
</tbody>
</table>

## `ExtenderManagedResource` {#kubescheduler-config-k8s-io-v1-ExtenderManagedResource}

**Зʼявляється в:**

- [Extender](#kubescheduler-config-k8s-io-v1-Extender)

ExtenderManagedResource описує аргументи розширених ресурсів,
якими керує розширювач.


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Назва розширеного ресурсу.</p>
</td>
</tr>
<tr><td><code>ignoredByScheduler</code> <b>[Обовʼязкове]</b><br/>
<code>bool</code>
</td>
<td>
   <p>IgnoredByScheduler вказує, чи слід kube-scheduler ігнорувати цей
ресурс при застосуванні предикатів.</p>
</td>
</tr>
</tbody>
</table>

## `ExtenderTLSConfig` {#kubescheduler-config-k8s-io-v1-ExtenderTLSConfig}

**Зʼявляється в:**

- [Extender](#kubescheduler-config-k8s-io-v1-Extender)

ExtenderTLSConfig містить налаштування для увімкнення TLS з розширювачем

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>insecure</code> <b>[Обовʼязкове]</b><br/>
<code>bool</code>
</td>
<td>
   <p>Сервер повинен бути доступний без перевірки сертифікату TLS. Тільки для тестування.</p>
</td>
</tr>
<tr><td><code>serverName</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>ServerName передається серверу для SNI та використовується в клієнті для перевірки сертифікатів сервера. Якщо ServerName порожній, використовується імʼя хоста, яке використовується для звʼязку з сервером.</p>
</td>
</tr>
<tr><td><code>certFile</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Сервер вимагає автентифікацію клієнтського сертифікату TLS</p>
</td>
</tr>
<tr><td><code>keyFile</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Сервер вимагає автентифікацію клієнтського сертифікату TLS</p>
</td>
</tr>
<tr><td><code>caFile</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Довірені кореневі сертифікати для сервера</p>
</td>
</tr>
<tr><td><code>certData</code> <b>[Обовʼязкове]</b><br/>
<code>[]byte</code>
</td>
<td>
   <p>CertData містить PEM-кодовані байти (зазвичай зчитуються з файлу клієнтського сертифіката). CertData має пріоритет над CertFile</p>
</td>
</tr>
<tr><td><code>keyData</code> <b>[Обовʼязкове]</b><br/>
<code>[]byte</code>
</td>
<td>
   <p>KeyData містить PEM-кодовані байти (зазвичай зчитуються з файлу ключа клієнтського сертифіката). KeyData має пріоритет над KeyFile</p>
</td>
</tr>
<tr><td><code>caData</code> <b>[Обовʼязкове]</b><br/>
<code>[]byte</code>
</td>
<td>
   <p>CAData містить PEM-кодовані байти (зазвичай зчитуються з файлу з кореневими сертифікатами). CAData має пріоритет над CAFile</p>
</td>
</tr>
</tbody>
</table>

## `KubeSchedulerProfile` {#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile}

**Зʼявляється в:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

KubeSchedulerProfile є профілем планувальника.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>schedulerName</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>SchedulerName є імʼям планувальника, асоційованого з цим профілем. Якщо SchedulerName відповідає значенню &quot;spec.schedulerName&quot; Podʼа, то Pod буде плануватися з цим профілем.</p>
</td>
</tr>
<tr><td><code>percentageOfNodesToScore</code> <b>[Обовʼязкове]</b><br/>
<code>int32</code>
</td>
<td>
   <p>PercentageOfNodesToScore є відсотком усіх вузлів, після знаходження яких, планувальник припиняє пошук більш придатних вузлів у кластері для запуску Podʼа. Це допомагає покращити продуктивність планувальника. Планувальник завжди намагається знайти принаймні &quot;minFeasibleNodesToFind&quot; придатних вузлів незалежно від значення цього прапорця. Наприклад, якщо розмір кластера становить 500 вузлів і значення цього прапорця становить 30, то планувальник припиняє пошук далі, як тільки знаходить 150 придатних вузлів. Коли значення 0, стандартно буде оцінено відсоток (5%–50% в залежності від розміру кластера) вузлів. Це матиме перевагу перед глобальним PercentageOfNodesToScore. Якщо це пусто, буде використано глобальний PercentageOfNodesToScore.</p>
</td>
</tr>
<tr><td><code>plugins</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-Plugins"><code>Plugins</code></a>
</td>
<td>
   <p>Plugins визначають набір втулків, які мають бути увімкнені або вимкнені. Увімкнені втулки — це ті, які мають бути увімкнені додатково до стандартних  втулків. Вимкнені втулки — це будь-які зі стандартних втулків, які мають бути вимкнені. Коли жоден увімкнений або вимкнений втулок не зазначений для точки розширення, будуть використані стандартні втулки для цієї точки розширення, якщо такі є. Якщо зазначено втулок QueueSort, то той самий втулок QueueSort та PluginConfig повинні бути зазначені для всіх профілів.</p>
</td>
</tr>
<tr><td><code>pluginConfig</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginConfig"><code>[]PluginConfig</code></a>
</td>
<td>
   <p>PluginConfig є необовʼязковим набором параметрів для кожного втулка. Виключення конфігураційних аргументів для втулка є еквівалентним використанню стандартної конфігурації для цього втулка.</p>
</td>
</tr>
</tbody>
</table>

## `Plugin` {#kubescheduler-config-k8s-io-v1-Plugin}

**Зʼявляється в:**

- [PluginSet](#kubescheduler-config-k8s-io-v1-PluginSet)

Plugin визначає імʼя втулка та його вагу, якщо це застосовується. Вага використовується лише для втулків типу Score.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Name визначає імʼя втулка</p>
</td>
</tr>
<tr><td><code>weight</code> <b>[Обовʼязкове]</b><br/>
<code>int32</code>
</td>
<td>
   <p>Weight визначає вагу втулка, використовується лише для втулків типу Score.</p>
</td>
</tr>
</tbody>
</table>

## `PluginConfig` {#kubescheduler-config-k8s-io-v1-PluginConfig}

**Зʼявляється в:**

- [KubeSchedulerProfile](#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile)

PluginConfig визначає аргументи, які повинні бути передані втулку під час ініціалізації. Втулок, який викликається на кількох точках розширення, ініціалізується один раз. Args можуть мати довільну структуру. Обробка цих аргументів залежить від самого втулка.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Name визначає імʼя втулка, що конфігурується</p>
</td>
</tr>
<tr><td><code>args</code> <b>[Обовʼязкове]</b><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <p>Args визначає аргументи, що передаються втулкам під час ініціалізації. Args можуть мати довільну структуру.</p>
</td>
</tr>
</tbody>
</table>

## `PluginSet` {#kubescheduler-config-k8s-io-v1-PluginSet}

**Зʼявляється в:**

- [Plugins](#kubescheduler-config-k8s-io-v1-Plugins)

<p>PluginSet визначає включені та виключені втулки для точки розширення. Якщо масив порожній, відсутній або nil, використовуватимуться стандартні втулки для цієї точки розширення.</p>


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>enabled</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-Plugin"><code>[]Plugin</code></a>
</td>
<td>
   <p>Enabled визначає втулки, які повинні бути активовані додатково до стандартних втулків. Якщо стандартний втулок також конфігуровано у файлі конфігурації планувальника, вага втулка буде перезаписана відповідно. Ці втулки викликаються після стандартних втулків і в тому ж порядку, як зазначено тут.</p>
</td>
</tr>
<tr><td><code>disabled</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-Plugin"><code>[]Plugin</code></a>
</td>
<td>
   <p>Disabled визначає стандартні втулки, які повинні бути вимкнені. Коли всі стандартні втулки потрібно вимкнути, слід надати масив, що містить лише один символ "*".</p>
</td>
</tr>
</tbody>
</table>

## `Plugins` {#kubescheduler-config-k8s-io-v1-Plugins}

**Зʼявляється в:**

- [KubeSchedulerProfile](#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile)

<p>Plugins включає кілька точок розширення. Коли вони вказані, список втулків для конкретної точки розширення є єдиними активованими втулками. Якщо точка розширення пропущена з конфігурації, тоді використовуються стандартні втулки  для цієї точки розширення. Активовані втулки викликаються в порядку, зазначеному тут, після стандартних втулків. Якщо їх потрібно викликати перед стандартними втулками, стандартні втулки повинні бути вимкнені і знову увімкнені тут у бажаному порядку.</p>


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>


<tr><td><code>preEnqueue</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>PreEnqueue ` це список втулків, які повинні бути викликані перед додаванням Podʼів у чергу планування.</p>
</td>
</tr>
<tr><td><code>queueSort</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>QueueSort — це список втулків, які повинні бути викликані під час сортування Podʼів у черзі планування.</p>
</td>
</tr>
<tr><td><code>preFilter</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>PreFilter — це список втулків, які повинні бути викликані на точці розширення "PreFilter" фреймворку планування.</p>
</td>
</tr>
<tr><td><code>filter</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>Filter — це список втулків, які повинні бути викликані при фільтрації вузлів, що не можуть запустити Pod.</p>
</td>
</tr>
<tr><td><code>postFilter</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>PostFilter — це список втулків, які викликаються після фази фільтрації, але лише коли для Podʼа не були знайдені підходящі вузли.</p>
</td>
</tr>
<tr><td><code>preScore</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>PreScore — це список втулків, які викликаються перед оцінюванням.</p>
</td>
</tr>
<tr><td><code>score</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>Score — це список втулків, які повинні бути викликані при ранжуванні вузлів, які пройшли фазу фільтрації.</p>
</td>
</tr>
<tr><td><code>reserve</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>Reserve — це список втулків, які викликаються при резервуванні/анулюванні резервування ресурсів після того, як вузол призначений для запуску Podʼа.</p>
</td>
</tr>
<tr><td><code>permit</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>Permit — це список втулків, які контролюють привʼязування Podʼа. Ці втулки можуть запобігти або затримати привʼязування Podʼа.</p>
</td>
</tr>
<tr><td><code>preBind</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>PreBind — це список втулків, які повинні бути викликані перед привʼязуванням Podʼа.</p>
</td>
</tr>
<tr><td><code>bind</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>Bind — це список втулків, які повинні бути викликані на точці розширення "Bind" фреймворку планування. Планувальник викликає ці втулки по порядку. Планувальник пропускає решту цих втулків, як тільки один з них повертає успіх.</p>
</td>
</tr>
<tr><td><code>postBind</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>PostBind — це список втулків, які повинні бути викликані після успішного привʼязування Podʼа.</p>
</td>
</tr>
<tr><td><code>multiPoint</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-PluginSet"><code>PluginSet</code></a>
</td>
<td>
   <p>MultiPoint — це спрощений розділ конфігурації для активації втулків для всіх дійсних точок розширення. Втулки, активовані через MultiPoint, автоматично реєструються для кожної індивідуальної точки розширення, яку втулок реалізував. Вимкнення втулка через MultiPoint вимикає таку поведінку. Те ж саме стосується вимкнення "*" через MultiPoint (жоден стандартний втулок не буде автоматично зареєстрований). Втулки все ще можна вимкнути через їх окремі точки розширення.</p>
   <p>Що стосується пріоритету, конфігурація втулків дотримується цієї основної ієрархії</p>
   <ol>
   <li>Специфічні точки розширення</li>
   <li>Явно сконфігуровані втулки MultiPoint</li>
   <li>Набір стандартних втулків, як втулки MultiPoint.  Це означає, що втулок з вищим пріоритетом буде виконуватися першим і перезаписувати будь-які налаштування всередині MultiPoint. Явно сконфігуровані втулки користувача також мають вищий пріоритет над стандартними втулками. В межах цієї ієрархії, параметр Enabled має вищий пріоритет над Disabled. Наприклад, якщо втулок зазначено як в <code>multiPoint.Enabled</code> та <code>multiPoint.Disabled</code>, втулок буде активовано. Подібним чином, включення <code>multiPoint.Disabled = '*'</code> і <code>multiPoint.Enabled = pluginA</code> все ще зареєструє цей конкретний втулок через MultiPoint. Це слідує тій же поведінці, що й у всіх інших конфігураціях точок розширення.</li>
   </ol>
</td>
</tr>
</tbody>
</table>

## `PodTopologySpreadConstraintsDefaulting` {#kubescheduler-config-k8s-io-v1-PodTopologySpreadConstraintsDefaulting}

(Аліас для `string`)

**Зʼявляється в:**

- [PodTopologySpreadArgs](#kubescheduler-config-k8s-io-v1-PodTopologySpreadArgs)

<p>PodTopologySpreadConstraintsDefaulting визначає, як встановлювати стандартне значення для втулка PodTopologySpread.</p>

## `RequestedToCapacityRatioParam` {#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioParam}

**Зʼявляється в:**

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1-ScoringStrategy)

RequestedToCapacityRatioParam визначає параметри RequestedToCapacityRatio.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>shape</code> <b>[Обовʼязково]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-UtilizationShapePoint"><code>[]UtilizationShapePoint</code></a>
</td>
<td>
   <p>Shape є списком точок, що визначають форму функції оцінки.</p>
</td>
</tr>
</tbody>
</table>

## `ResourceSpec` {#kubescheduler-config-k8s-io-v1-ResourceSpec}

**Зʼявляється в:**

- [NodeResourcesBalancedAllocationArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesBalancedAllocationArgs)

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1-ScoringStrategy)

ResourceSpec представляє один ресурс.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>Назва ресурсу.</p>
</td>
</tr>
<tr><td><code>weight</code> <b>[Обовʼязково]</b><br/>
<code>int64</code>
</td>
<td>
   <p>Вага ресурсу.</p>
</td>
</tr>
</tbody>
</table>

## `ScoringStrategy` {#kubescheduler-config-k8s-io-v1-ScoringStrategy}


**Зʼявляється в:**

- [NodeResourcesFitArgs](#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs)

ScoringStrategy визначає ScoringStrategyType для втулка ресурсів вузла.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>type</code> <b>[Обовʼязково]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-ScoringStrategyType"><code>ScoringStrategyType</code></a>
</td>
<td>
   <p>Тип обирає стратегію для виконання.</p>
</td>
</tr>
<tr><td><code>resources</code> <b>[Обовʼязково]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-ResourceSpec"><code>[]ResourceSpec</code></a>
</td>
<td>
   <p>Ресурси, які слід враховувати при оцінюванні. Стандартний набір ресурсів включає &quot;cpu&quot; та &quot;memory&quot; з однаковою вагою. Дозволені ваги від 1 до 100. Стандартна вага дорівнює 1, якщо не вказана або явно встановлена в 0.</p>
</td>
</tr>
<tr><td><code>requestedToCapacityRatio</code> <b>[Обовʼязково]</b><br/>
<a href="#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioParam"><code>RequestedToCapacityRatioParam</code></a>
</td>
<td>
   <p>Аргументи, специфічні для стратегії RequestedToCapacityRatio.</p>
</td>
</tr>
</tbody>
</table>

## `ScoringStrategyType`     {#kubescheduler-config-k8s-io-v1-ScoringStrategyType}

(Аліас `string`)

**Зʼявляється в:**

- [ScoringStrategy](#kubescheduler-config-k8s-io-v1-ScoringStrategy)


<p>ScoringStrategyType визначає тип стратегії оцінювання, яка використовується у втулку NodeResourcesFit.</p>

## `UtilizationShapePoint`     {#kubescheduler-config-k8s-io-v1-UtilizationShapePoint}

**Зʼявляється в:**

- [VolumeBindingArgs](#kubescheduler-config-k8s-io-v1-VolumeBindingArgs)

- [RequestedToCapacityRatioParam](#kubescheduler-config-k8s-io-v1-RequestedToCapacityRatioParam)

UtilizationShapePoint представляє окрему точку функції пріоритету.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>utilization</code> <b>[Обовʼязково]</b><br/>
<code>int32</code>
</td>
<td>
   <p>Utilization (вісь x). Дійсні значення від 0 до 100. Повністю використаний вузол відповідає 100.</p>
</td>
</tr>
<tr><td><code>score</code> <b>[Обовʼязково]</b><br/>
<code>int32</code>
</td>
<td>
   <p>Оцінка, присвоєна даній утилізації (вісь y). Дійсні значення від 0 до 10.</p>
</td>
</tr>
</tbody>
</table>
