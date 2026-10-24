---
title: Kubelet Summary API (v1alpha1)
content_type: tool-reference
package: v1alpha1
auto_generated: false
---

## Типи ресурсів

- [Summary](#Summary)

## `AcceleratorStats`     {#AcceleratorStats}

**Зʼявляється в:**

- [ContainerStats](#ContainerStats)

<p>AcceleratorStats містить статистику для прискорювачів, приєднаних до контейнера.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>make</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>Виробник прискорювача (nvidia, amd, google тощо)</p>
</td>
</tr>
<tr><td><code>model</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>Модель прискорювача (tesla-p100, tesla-k80 тощо)</p>
</td>
</tr>
<tr><td><code>id</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>Ідентифікатор прискорювача.</p>
</td>
</tr>
<tr><td><code>memoryTotal</code> <B>[Обовʼязкове]</B><br/>
<code>uint64</code>
</td>
<td>
   <p>Загальна памʼять прискорювача. Одиниця: байти</p>
</td>
</tr>
<tr><td><code>memoryUsed</code> <B>[Обовʼязкове]</B><br/>
<code>uint64</code>
</td>
<td>
   <p>Загальна памʼять прискорювача, що була виділена. Одиниця: байти</p>
</td>
</tr>
<tr><td><code>dutyCycle</code> <B>[Обовʼязкове]</B><br/>
<code>uint64</code>
</td>
<td>
   <p>Відсоток часу за попередній період вибірки (10с), протягом якого акселератор активно обробляв дані.</p>
</td>
</tr>
</tbody>
</table>

## `CPUStats`     {#CPUStats}

**Зʼявляється в:**

- [ContainerStats](#ContainerStats)

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)

<p>CPUStats містить дані про використання CPU.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>time</code> <B>[Обовʼязкове]</B><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.37/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>Час, коли ці статистичні дані були оновлені.</p>
</td>
</tr>
<tr><td><code>usageNanoCores</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Загальне використання CPU (сума всіх ядер) в середньому за вікно вибірки. Одиниця &quot;core&quot; може бути інтерпретована як CPU ядро-наносекунди на секунду.</p>
</td>
</tr>
<tr><td><code>usageCoreNanoSeconds</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Сукупне використання CPU (сума всіх ядер) з моменту створення обʼєкта.</p>
</td>
</tr>
<tr><td><code>psi</code><br/>
<a href="#PSIStats"><code>PSIStats</code></a>
</td>
<td>
   <p>Статистика PSI для CPU.</p>
</td>
</tr>
</tbody>
</table>

## `ContainerStats`     {#ContainerStats}

**Зʼявляється в:**

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)

<p>ContainerStats містить необроблену статистику вибірки на рівні контейнера.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>Посилання на виміряний контейнер.</p>
</td>
</tr>
<tr><td><code>startTime</code> <B>[Обовʼязкове]</B><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.37/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>Час, коли збирання даних для цього контейнера було (пере)запущено.</p>
</td>
</tr>
<tr><td><code>cpu</code><br/>
<a href="#CPUStats"><code>CPUStats</code></a>
</td>
<td>
   <p>Статистика, що стосується ресурсів CPU.</p>
</td>
</tr>
<tr><td><code>memory</code><br/>
<a href="#MemoryStats"><code>MemoryStats</code></a>
</td>
<td>
   <p>Статистика, що стосується ресурсів памʼяті (RAM).</p>
</td>
</tr>
<tr><td><code>io</code><br/>
<a href="#IOStats"><code>IOStats</code></a>
</td>
<td>
   <p>Статистика, що стосується ресурсів введення/виведення (IO).</p>
</td>
</tr>
<tr><td><code>accelerators</code> <B>[Обовʼязкове]</B><br/>
<a href="#AcceleratorStats"><code>[]AcceleratorStats</code></a>
</td>
<td>
   <p>Метрики для прискорювачів. Кожен прискорювач відповідає одному елементу в масиві.</p>
</td>
</tr>
<tr><td><code>rootfs</code><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>Статистика, що стосується використання файлової системи кореневою файловою системою контейнера. Rootfs.UsedBytes — це кількість байтів, що використовуються для запису шару контейнера.</p>
</td>
</tr>
<tr><td><code>logs</code><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>Статистика, що стосується використання файлової системи для журналів контейнера. Logs.UsedBytes — це кількість байтів, що використовуються для журналів контейнера.</p>
</td>
</tr>
<tr><td><code>userDefinedMetrics</code> <B>[Обовʼязкове]</B><br/>
<a href="#UserDefinedMetric"><code>[]UserDefinedMetric</code></a>
</td>
<td>
   <p>Визначені користувачем метрики, які експонуються контейнерами в Podʼі. Як правило, ми очікуємо, що лише один контейнер в Podʼі експонує визначені користувачем метрики. У випадку кількох контейнерів, що експонують метрики, вони будуть обʼєднані тут.</p>
</td>
</tr>
<tr><td><code>swap</code><br/>
<a href="#SwapStats"><code>SwapStats</code></a>
</td>
<td>
   <p>Статистика, що стосується ресурсів swap. Повідомляється лише для систем, відмінних від Windows.</p>
</td>
</tr>
</tbody>
</table>

## `FsStats`     {#FsStats}

**Зʼявляється в:**

- [ContainerStats](#ContainerStats)

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)

- [RuntimeStats](#RuntimeStats)

- [VolumeStats](#VolumeStats)

<p>FsStats містить дані про використання файлової системи.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>time</code> <B>[Обовʼязкове]</B><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.37/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>Час, коли ці статистичні дані були оновлені.</p>
</td>
</tr>
<tr><td><code>availableBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>AvailableBytes — це доступний обсяг памʼяті (у байтах) для файлової системи.</p>
</td>
</tr>
<tr><td><code>capacityBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>CapacityBytes — це загальна ємність (у байтах) базового сховища файлової системи.</p>
</td>
</tr>
<tr><td><code>usedBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>UsedBytes — це кількість байтів, що використовуються для конкретного завдання на файловій системі. Це може відрізнятися від загальної кількості байтів, що використовуються на файловій системі, і може не дорівнювати CapacityBytes - AvailableBytes. Наприклад, для ContainerStats.Rootfs це кількість байтів, що використовуються кореневою файловою системою контейнера на файловій системі.</p>
</td>
</tr>
<tr><td><code>inodesFree</code><br/>
<code>uint64</code>
</td>
<td>
   <p>InodesFree — це кількість вільних inode у файловій системі.</p>
</td>
</tr>
<tr><td><code>inodes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Inodes — це загальна кількість inode у файловій системі.</p>
</td>
</tr>
<tr><td><code>inodesUsed</code> <B>[Обовʼязкове]</B><br/>
<code>uint64</code>
</td>
<td>
   <p>InodesUsed — це кількість inode, що використовуються файловою системою. Це може не дорівнювати Inodes - InodesFree, оскільки ця файлова система може розділяти inode з іншими &quot;файловими системами&quot;. Наприклад, для ContainerStats.Rootfs це кількість inode, що використовуються лише цим контейнером, і не враховує inode, що використовуються іншими контейнерами.</p>
</td>
</tr>
</tbody>
</table>

## `IOStats`     {#IOStats}

**Зʼявляється в:**

- [ContainerStats](#ContainerStats)

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)

<p>IOStats містить дані про використання введення/виведення (IO).</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>time</code> <B>[Обовʼязкове]</B><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.37/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>Час, коли ці статистичні дані були оновлені.</p>
</td>
</tr>
<tr><td><code>psi</code><br/>
<a href="#PSIStats"><code>PSIStats</code></a>
</td>
<td>
   <p>Статистика PSI для IO.</p>
</td>
</tr>
</tbody>
</table>

## `InterfaceStats`     {#InterfaceStats}

**Зʼявляється в:**

- [NetworkStats](#NetworkStats)

<p>InterfaceStats містить дані про значення ресурсів інтерфейсу.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>Назва інтерфейсу</p>
</td>
</tr>
<tr><td><code>rxBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Сукупна кількість отриманих байтів.</p>
</td>
</tr>
<tr><td><code>rxErrors</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Сукупна кількість помилок отримання.</p>
</td>
</tr>
<tr><td><code>txBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Сукупна кількість переданих байтів.</p>
</td>
</tr>
<tr><td><code>txErrors</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Сукупна кількість помилок передачі.</p>
</td>
</tr>
</tbody>
</table>

## `MemoryStats`     {#MemoryStats}

**Зʼявляється в:**

- [ContainerStats](#ContainerStats)

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)

<p>MemoryStats містить дані про використання памʼяті.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>time</code> <B>[Обовʼязкове]</B><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.37/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>Час, коли ці статистичні дані були оновлені.</p>
</td>
</tr>
<tr><td><code>availableBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Доступна памʼять для використання. Визначається як memory limit - workingSetBytes. Якщо memory limit не визначено, значення available bytes опускається.</p>
</td>
</tr>
<tr><td><code>usageBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Загальна памʼять, що використовується. Включає всю памʼять незалежно від того, коли до неї здійснювався доступ.</p>
</td>
</tr>
<tr><td><code>workingSetBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Обсяг робочого набору памʼяті. Включає памʼять, до якої здійснювався нещодавній доступ, «брудну» памʼять та памʼять ядра. WorkingSetBytes &lt;= UsageBytes</p>
</td>
</tr>
<tr><td><code>rssBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Обсяг анонімної памʼяті та памʼяті кешу swap (включає прозорі hugepages).</p>
</td>
</tr>
<tr><td><code>pageFaults</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Сукупна кількість мінімальних помилок сторінки.</p>
</td>
</tr>
<tr><td><code>majorPageFaults</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Сукупна кількість основних помилок сторінки.</p>
</td>
</tr>
<tr><td><code>psi</code><br/>
<a href="#PSIStats"><code>PSIStats</code></a>
</td>
<td>
   <p>Статистика PSI для памʼяті.</p>
</td>
</tr>
</tbody>
</table>

## `NetworkStats`     {#NetworkStats}

**Зʼявляється в:**

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)

<p>NetworkStats містить дані про мережеві ресурси.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>time</code> <B>[Обовʼязкове]</B><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.37/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>Час, коли ці статистичні дані були оновлені.</p>
</td>
</tr>
<tr><td><code>InterfaceStats</code> <B>[Обовʼязкове]</B><br/>
<a href="#InterfaceStats"><code>InterfaceStats</code></a>
</td>
<td>
   <p>Статистика для стандартного інтерфейсу, якщо знайдено</p>
</td>
</tr>
<tr><td><code>interfaces</code> <B>[Обовʼязкове]</B><br/>
<a href="#InterfaceStats"><code>[]InterfaceStats</code></a>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
</tbody>
</table>

## `NodeStats`     {#NodeStats}

**Зʼявляється в:**

- [Summary](#Summary)

<p>NodeStats містить необроблену статистику вибірки на рівні вузла.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>nodeName</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>Посилання на виміряний вузол.</p>
</td>
</tr>
<tr><td><code>systemContainers</code><br/>
<a href="#ContainerStats"><code>[]ContainerStats</code></a>
</td>
<td>
   <p>Статистика системних демонів, що відстежуються як необроблені контейнери. Системні контейнери мають назви відповідно до констант SystemContainer*.</p>
</td>
</tr>
<tr><td><code>startTime</code> <B>[Обовʼязкове]</B><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.37/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>Час, коли збирання даних для статистики вузла (тобто агрегованої) було (пере)запущено.</p>
</td>
</tr>
<tr><td><code>cpu</code><br/>
<a href="#CPUStats"><code>CPUStats</code></a>
</td>
<td>
   <p>Статистика, що стосується ресурсів CPU.</p>
</td>
</tr>
<tr><td><code>memory</code><br/>
<a href="#MemoryStats"><code>MemoryStats</code></a>
</td>
<td>
   <p>Статистика, що стосується ресурсів памʼяті (RAM).</p>
</td>
</tr>
<tr><td><code>io</code><br/>
<a href="#IOStats"><code>IOStats</code></a>
</td>
<td>
   <p>Статистика, що стосується ресурсів введення/виведення (IO).</p>
</td>
</tr>
<tr><td><code>network</code><br/>
<a href="#NetworkStats"><code>NetworkStats</code></a>
</td>
<td>
   <p>Статистика, що стосується мережевих ресурсів.</p>
</td>
</tr>
<tr><td><code>fs</code><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>Статистика, що стосується загального використання ресурсів файлової системи в кореневій файловій системі, що використовується компонентами k8s вузла. NodeFs.Used — це загальна кількість байтів, що використовуються на файловій системі.</p>
</td>
</tr>
<tr><td><code>runtime</code><br/>
<a href="#RuntimeStats"><code>RuntimeStats</code></a>
</td>
<td>
   <p>Статистика про базову систему запуску контейнерів.</p>
</td>
</tr>
<tr><td><code>rlimit</code><br/>
<a href="#RlimitStats"><code>RlimitStats</code></a>
</td>
<td>
   <p>Статистика про rlimit операційної системи.</p>
</td>
</tr>
<tr><td><code>swap</code><br/>
<a href="#SwapStats"><code>SwapStats</code></a>
</td>
<td>
   <p>Статистика, що стосується ресурсів swap. Повідомляється лише для систем, відмінних від Windows.</p>
</td>
</tr>
</tbody>
</table>

## `PSIData`     {#PSIData}

**Зʼявляється в:**

- [PSIStats](#PSIStats)

<p>Дані PSI для окремого ресурсу.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>total</code> <B>[Обовʼязкове]</B><br/>
<code>uint64</code>
</td>
<td>
   <p>Загальна тривалість часу, протягом якого завдання в cgroup очікували через перевантаження. Одиниця: наносекунди.</p>
</td>
</tr>
<tr><td><code>avg10</code> <B>[Обовʼязкове]</B><br/>
<code>float64</code>
</td>
<td>
   <p>Середнє значення (у %) часу очікування завдань через перевантаження за 10-секундне вікно.</p>
</td>
</tr>
<tr><td><code>avg60</code> <B>[Обовʼязкове]</B><br/>
<code>float64</code>
</td>
<td>
   <p>Середнє значення (у %) часу очікування завдань через перевантаження за 60-секундне вікно.</p>
</td>
</tr>
<tr><td><code>avg300</code> <B>[Обовʼязкове]</B><br/>
<code>float64</code>
</td>
<td>
   <p>Середнє значення (у %) часу очікування завдань через перевантаження за 300-секундне вікно.</p>
</td>
</tr>
</tbody>
</table>

## `PSIStats`     {#PSIStats}

**Зʼявляється в:**

- [CPUStats](#CPUStats)

- [IOStats](#IOStats)

- [MemoryStats](#MemoryStats)

<p>Статистика PSI для окремого ресурсу.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>full</code> <B>[Обовʼязкове]</B><br/>
<a href="#PSIData"><code>PSIData</code></a>
</td>
<td>
   <p>Дані PSI для всіх завдань у cgroup.</p>
</td>
</tr>
<tr><td><code>some</code> <B>[Обовʼязкове]</B><br/>
<a href="#PSIData"><code>PSIData</code></a>
</td>
<td>
   <p>Дані PSI для деяких завдань у cgroup.</p>
</td>
</tr>
</tbody>
</table>

## `PVCReference`     {#PVCReference}

**Зʼявляється в:**

- [VolumeStats](#VolumeStats)

<p>PVCReference містить достатньо інформації для опису посиланого PVC.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
<tr><td><code>namespace</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
</tbody>
</table>

## `PodReference`     {#PodReference}

**Зʼявляється в:**

- [PodStats](#PodStats)

<p>PodReference містить достатньо інформації для пошуку Podʼа, на який є посилання.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
<tr><td><code>namespace</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
<tr><td><code>uid</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
</tbody>
</table>

## `PodStats`     {#PodStats}

**Зʼявляється в:**

- [Summary](#Summary)

<p>PodStats містить необроблену статистику вибірки на рівні Podʼа.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>podRef</code> <B>[Обовʼязкове]</B><br/>
<a href="#PodReference"><code>PodReference</code></a>
</td>
<td>
   <p>Посилання на виміряний Pod.</p>
</td>
</tr>
<tr><td><code>startTime</code> <B>[Обовʼязкове]</B><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.37/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>Час, коли збирання даних для статистики Podʼа (наприклад, мережевої) було (пере)запущено.</p>
</td>
</tr>
<tr><td><code>containers</code> <B>[Обовʼязкове]</B><br/>
<a href="#ContainerStats"><code>[]ContainerStats</code></a>
</td>
<td>
   <p>Статистика контейнерів у виміряному Podʼі.</p>
</td>
</tr>
<tr><td><code>cpu</code><br/>
<a href="#CPUStats"><code>CPUStats</code></a>
</td>
<td>
   <p>Статистика, що стосується ресурсів CPU, що споживаються cgroup Podʼа (включає використання ресурсів усіма контейнерами та накладні витрати Podʼа).</p>
</td>
</tr>
<tr><td><code>memory</code><br/>
<a href="#MemoryStats"><code>MemoryStats</code></a>
</td>
<td>
   <p>Статистика, що стосується ресурсів памʼяті (RAM), що споживаються cgroup Podʼа (включає використання ресурсів усіма контейнерами та накладні витрати Podʼа).</p>
</td>
</tr>
<tr><td><code>io</code><br/>
<a href="#IOStats"><code>IOStats</code></a>
</td>
<td>
   <p>Статистика, що стосується ресурсів введення/виведення (IO), що споживаються cgroup Podʼа (включає використання ресурсів усіма контейнерами та накладні витрати Podʼа).</p>
</td>
</tr>
<tr><td><code>network</code><br/>
<a href="#NetworkStats"><code>NetworkStats</code></a>
</td>
<td>
   <p>Статистика, що стосується мережевих ресурсів.</p>
</td>
</tr>
<tr><td><code>volume</code><br/>
<a href="#VolumeStats"><code>[]VolumeStats</code></a>
</td>
<td>
   <p>Статистика, що стосується використання томами ресурсів файлової системи. VolumeStats.UsedBytes — це кількість байтів, що використовуються томом</p>
</td>
</tr>
<tr><td><code>ephemeral-storage</code><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>EphemeralStorage повідомляє про загальне використання файлової системи для контейнерів та томів на основі emptyDir у виміряному Podʼі.</p>
</td>
</tr>
<tr><td><code>process_stats</code><br/>
<a href="#ProcessStats"><code>ProcessStats</code></a>
</td>
<td>
   <p>Статистика, що стосується процесів.</p>
</td>
</tr>
<tr><td><code>swap</code><br/>
<a href="#SwapStats"><code>SwapStats</code></a>
</td>
<td>
   <p>Статистика, що стосується ресурсів swap. Повідомляється лише для систем, відмінних від Windows.</p>
</td>
</tr>
</tbody>
</table>

## `ProcessStats`     {#ProcessStats}

**Зʼявляється в:**

- [PodStats](#PodStats)

<p>ProcessStats — це статистика, що стосується процесів.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>process_count</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Кількість процесів</p>
</td>
</tr>
</tbody>
</table>

## `RlimitStats`     {#RlimitStats}

**Зʼявляється в:**

- [NodeStats](#NodeStats)

<p>RlimitStats — це статистика rlimit операційної системи.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>time</code> <B>[Обовʼязкове]</B><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.37/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
<tr><td><code>maxpid</code> <B>[Обовʼязкове]</B><br/>
<code>int64</code>
</td>
<td>
   <p>Максимальна кількість існуючих процесів (потоків, точніше на Linux) в операційній системі. Див. RLIMIT_NPROC у getrlimit(2). Верхня межа операційної системи на кількість ідентифікаторів процесів, які можуть бути призначені. На Linux завдання (процеси або потоки) споживають по 1 PID кожне.</p>
</td>
</tr>
<tr><td><code>curproc</code> <B>[Обовʼязкове]</B><br/>
<code>int64</code>
</td>
<td>
   <p>Кількість запущених процесів (потоків, точніше на Linux) в операційній системі.</p>
</td>
</tr>
</tbody>
</table>

## `RuntimeStats`     {#RuntimeStats}

**Зʼявляється в:**

- [NodeStats](#NodeStats)

<p>RuntimeStats — це статистика, що стосується базової системи запуску контейнерів.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>imageFs</code><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>Статистика про базову файлову систему, де зберігаються образи контейнерів. Ця файлова система може бути такою ж, як основна (коренева) файлова система. Використання тут стосується загальної кількості байтів, що зайняті образами на файловій системі.</p>
</td>
</tr>
<tr><td><code>containerFs</code><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>Статистика про базову файлову систему, де зберігається записуваний шар контейнера. Ця файлова система може бути такою ж, як основна (коренева) файлова система або ImageFS. Використання тут стосується загальної кількості байтів, що зайняті записуваним шаром на файловій системі.</p>
</td>
</tr>
</tbody>
</table>

## `SwapStats`     {#SwapStats}

**Зʼявляється в:**

- [ContainerStats](#ContainerStats)

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)

<p>SwapStats містить дані про використання памʼяті</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>time</code> <B>[Обовʼязкове]</B><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.37/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>Час, коли ці статистичні дані були оновлені.</p>
</td>
</tr>
<tr><td><code>swapAvailableBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Доступна памʼять swap для використання. Визначається як <!-- raw HTML omitted --> - <!-- raw HTML omitted -->. Якщо swap limit не визначено, це значення опускається.</p>
</td>
</tr>
<tr><td><code>swapUsageBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Загальна памʼять swap, що використовується.</p>
</td>
</tr>
</tbody>
</table>

## `UserDefinedMetric`     {#UserDefinedMetric}

**Зʼявляється в:**

- [ContainerStats](#ContainerStats)

<p>UserDefinedMetric представляє метрику, визначену та згенеровану користувачами.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>UserDefinedMetricDescriptor</code> <B>[Обовʼязкове]</B><br/>
<a href="#UserDefinedMetricDescriptor"><code>UserDefinedMetricDescriptor</code></a>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
<tr><td><code>time</code> <B>[Обовʼязкове]</B><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.37/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>Час, коли ці статистичні дані були оновлені.</p>
</td>
</tr>
<tr><td><code>value</code> <B>[Обовʼязкове]</B><br/>
<code>float64</code>
</td>
<td>
   <p>Значення метрики. Float64 мають точність 53 біти. Ми не передбачаємо жодних метрик, що перевищують це значення.</p>
</td>
</tr>
</tbody>
</table>

## `UserDefinedMetricDescriptor`     {#UserDefinedMetricDescriptor}

**Зʼявляється в:**

- [UserDefinedMetric](#UserDefinedMetric)

<p>UserDefinedMetricDescriptor містить метадані, які описують визначену користувачем метрику.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>Назва метрики.</p>
</td>
</tr>
<tr><td><code>type</code> <B>[Обовʼязкове]</B><br/>
<a href="#UserDefinedMetricType"><code>UserDefinedMetricType</code></a>
</td>
<td>
   <p>Тип метрики.</p>
</td>
</tr>
<tr><td><code>units</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>Одиниці відображення для статистичних даних.</p>
</td>
</tr>
<tr><td><code>labels</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>Метадані міток, повʼязаних з цією метрикою.</p>
</td>
</tr>
</tbody>
</table>

## `UserDefinedMetricType`     {#UserDefinedMetricType}

(Аліас для `string`)

**Зʼявляється в:**

- [UserDefinedMetricDescriptor](#UserDefinedMetricDescriptor)

<p>UserDefinedMetricType визначає, як метрика має бути інтерпретована користувачем.</p>

## `VolumeStats`     {#VolumeStats}

**Зʼявляється в:**

- [PodStats](#PodStats)

<p>VolumeStats містить дані про використання файлової системи томом.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>FsStats</code> <B>[Обовʼязкове]</B><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>Вбудований FsStats</p>
</td>
</tr>
<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <p>Назва, надана тому</p>
</td>
</tr>
<tr><td><code>pvcRef</code><br/>
<a href="#PVCReference"><code>PVCReference</code></a>
</td>
<td>
   <p>Посилання на PVC, якщо він існує</p>
</td>
</tr>
</tbody>
</table>
