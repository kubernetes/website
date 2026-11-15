---
title: Загальна мова виразів у Kubernetes
content_type: concept
weight: 35
min-kubernetes-server-version: 1.25
---

<!-- overview -->

[Загальна мова виразів (Common Expression Language, CEL)](https://github.com/google/cel-go) використовується в API Kubernetes для оголошення правил валідації, політик та інших обмежень чи умов.

Вирази CEL оцінюються безпосередньо на {{< glossary_tooltip text="API-сервері" term_id="kube-apiserver" >}}, що робить CEL зручним альтернативним рішенням для зовнішніх механізмів, таких як вебхуки, для багатьох випадків розширення функціональності. Ваші вирази CEL продовжують виконуватись, поки компонент API-сервера у складі панелі управління залишається доступним.

<!-- body -->

## Огляд мови {#language-overview}

[Мова CEL](https://github.com/google/cel-spec/blob/master/doc/langdef.md) має простий синтаксис, який схожий на вирази в C, C++, Java, JavaScript і Go.

CEL була розроблена для вбудовування в застосунки. Кожна "програма" CEL — це один вираз, який обраховується до одного значення. Вирази CEL зазвичай є короткими "однорядковими виразами", що добре вбудовуються в рядкові поля ресурсів API Kubernetes.

Вхідні дані для програми CEL — це "змінні". Кожне поле API Kubernetes, яке містить CEL, декларує в документації API, які змінні доступні для використання для цього поля. Наприклад, у полі `x-kubernetes-validations[i].rules` у CustomResourceDefinitions доступні змінні `self` і `oldSelf`, що відносяться до попереднього та поточного стану даних власного ресурсу користувача, які потрібно перевірити за допомогою виразу CEL. Інші поля API Kubernetes можуть оголошувати різні змінні. Дивіться документацію API для полів API, щоб дізнатися, які змінні доступні для цього поля.

Приклади виразів CEL:

<table>
<caption>Приклади виразів CEL та призначення кожного з них</caption>
<thead>
<tr>
  <th>Правило</th>
  <th>Призначення</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>self.minReplicas &lt;= self.replicas && self.replicas &lt;= self.maxReplicas</tt></td>
  <td>Перевірити, що три поля, які визначають репліки, розташовані в правильному порядку</td>
</tr>
<tr>
  <td><tt>'Available' in self.stateCounts</tt></td>
  <td>Перевірити, що в map існує запис з ключем 'Available'</td>
</tr>
<tr>
  <td><tt>(self.list1.size() == 0) != (self.list2.size() == 0)</tt></td>
  <td>Перевірити, що один із двох списків не порожній, але не обидва одночасно</td>
</tr>
<tr>
  <td><tt>self.envars.filter(e, e.name = 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$'))</tt></td>
  <td>Перевірити поле 'value' у записі listMap, де поле ключа 'name' дорівнює 'MY_ENV'</td>
</tr>
<tr>
  <td><tt>has(self.expired) && self.created + self.ttl &lt; self.expired</tt></td>
  <td>Перевірити, що дата 'expired' пізніша за дату 'create' плюс тривалість 'ttl'</td>
</tr>
<tr>
  <td><tt>self.health.startsWith('ok')</tt></td>
  <td>Перевірити, що рядкове поле 'health' має префікс 'ok'</td>
</tr>
<tr>
  <td><tt>self.widgets.exists(w, w.key == 'x' && w.foo &lt; 10)</tt></td>
  <td>Перевірити, що властивість 'foo' елемента listMap з ключем 'x' менша за 10</td>
</tr>
<tr>
  <td><tt>type(self) == string ? self == '99%' : self == 42</tt></td>
  <td>Перевірити поле типу int-або-string для обох випадків: int та string</td>
</tr>
<tr>
  <td><tt>self.metadata.name == 'singleton'</tt></td>
  <td>Перевірити, що імʼя обʼєкта відповідає конкретному значенню (що робить його єдиним екземпляром — singleton)</td>
</tr>
<tr>
  <td><tt>self.set1.all(e, !(e in self.set2))</tt></td>
  <td>Перевірити, що два listSet не перетинаються</td>
</tr>
<tr>
  <td><tt>self.names.size() == self.details.size() && self.names.all(n, n in self.details)</tt></td>
  <td>Перевірити, що ключами map 'details' є елементи listSet 'names'</td>
</tr>
<tr>
  <td><tt>self.details.all(key, key.matches('^[a-zA-Z]*$'))</tt></td>
  <td>Перевірити ключі map 'details'</td>
</tr>
<tr>
  <td><tt>self.details.all(key, self.details[key].matches('^[a-zA-Z]*$'))</tt></td>
  <td>Перевірити значення map 'details'</td>
</tr>
</tbody>
</table>

## Опції CEL, можливості мови та бібліотеки {#cel-options-language-features-and-libraries}

CEL налаштовується з наступними опціями, бібліотеками та можливостями мови, введеними у зазначених версіях Kubernetes:

<table>
<thead>
<tr>
  <th>Опція, бібліотека або можливість мови CEL</th>
  <th>Включено</th>
  <th>Доступність</th>
</tr>
</thead>
<tbody>
<tr>
  <td><a href="https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros">Стандартні макроси</a></td>
  <td><code>has</code>, <code>all</code>, <code>exists</code>, <code>exists_one</code>, <code>map</code>, <code>filter</code></td>
  <td>Усі версії Kubernetes</td>
</tr>
<tr>
  <td><a href="https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions">Стандартні функції</a></td>
  <td>Дивіться
    <a href="https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions">
      офіційний список стандартних визначень
    </a>
  </td>
  <td>Усі версії Kubernetes</td>
</tr>
<tr>
  <td>
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#HomogeneousAggregateLiterals">
      Однорідні агрегатні літерали
    </a>
  </td>
  <td>-</td>
  <td>Усі версії Kubernetes</td>
</tr>
<tr>
  <td><a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#DefaultUTCTimeZone">Типовий часовий пояс UTC</a></td>
  <td>-</td>
  <td>Усі версії Kubernetes</td>
</tr>
<tr>
  <td>
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#EagerlyValidateDeclarations">
      Рання перевірка декларацій
    </a>
  </td>
  <td>-</td>
  <td>Усі версії Kubernetes</td>
</tr>
<tr>
  <td><a href="https://pkg.go.dev/github.com/google/cel-go/ext#Strings">Розширена бібліотека рядків</a>, версія 1</td>
  <td>
    <code>charAt</code>, <code>indexOf</code>, <code>lastIndexOf</code>, <code>lowerAscii</code>,
    <code>upperAscii</code>, <code>replace</code>, <code>split</code>, <code>join</code>, <code>substring</code>,
    <code>trim</code>
  </td>
  <td>Версії Kubernetes від 1.25 до 1.30</td>
</tr>
<tr>
  <td><a href="https://pkg.go.dev/github.com/google/cel-go/ext#Strings">Розширена бібліотека рядків</a>, версія 2</td>
  <td>
    <code>charAt</code>, <code>indexOf</code>, <code>lastIndexOf</code>, <code>lowerAscii</code>,
    <code>upperAscii</code>, <code>replace</code>, <code>split</code>, <code>join</code>, <code>substring</code>,
    <code>trim</code>
  </td>
  <td>Версії Kubernetes 1.30+</td>
</tr>
<tr>
  <td>Бібліотека списків Kubernetes</td>
  <td>Дивіться
    <a href="#kubernetes-list-library">
      бібліотеку списків Kubernetes
    </a>
  </td>
  <td>Усі версії Kubernetes</td>
</tr>
<tr>
  <td>Бібліотека регулярних виразів Kubernetes</td>
  <td>Дивіться
    <a href="#kubernetes-regex-library">
      бібліотеку регулярних виразів Kubernetes
    </a>
  </td>
  <td>Усі версії Kubernetes</td>
</tr>
<tr>
  <td>Бібліотека URL Kubernetes</td>
  <td>Дивіться
    <a href="#kubernetes-url-library">
      бібліотеку URL Kubernetes
    </a>
  </td>
  <td>Усі версії Kubernetes</td>
</tr>
<tr>
  <td>Бібліотека IP-адрес Kubernetes</td>
  <td>Дивіться
    <a href="#kubernetes-ip-address-library">
      бібліотеку IP-адрес Kubernetes
    </a>
  </td>
  <td>Версії Kubernetes 1.31+</td>
</tr>
<tr>
  <td>Бібліотека CIDR Kubernetes</td>
  <td>Дивіться
    <a href="#kubernetes-cidr-library">
      бібліотеку CIDR Kubernetes
    </a>
  </td>
  <td>Версії Kubernetes 1.31+</td>
</tr>
<tr>
<tr>
  <td>Бібліотека авторизатора Kubernetes</td>
  <td>Дивіться
    <a href="#kubernetes-authorizer-library">
      бібліотеку авторизатора Kubernetes
    </a>
  </td>
  <td>Усі версії Kubernetes</td>
</tr>
<tr>
  <td>Бібліотека кількостей Kubernetes</td>
  <td>Дивіться
    <a href="#kubernetes-quantity-library">
      бібліотеку кількостей Kubernetes
    </a>
  </td>
  <td>Версії Kubernetes 1.29+</td>
</tr>
<tr>
  <td>Бібліотека semver Kubernetes</td>
  <td>Дивіться
    <a href="#kubernetes-semver-library">
      бібліотеку semver Kubernetes
    </a>
  </td>
  <td>Версії Kubernetes 1.34+</td>
</tr>
<tr>
  <td>Бібліотека форматів Kubernetes</td>
  <td>Дивіться
    <a href="#kubernetes-format-library">
      бібліотеку форматів Kubernetes
    </a>
  </td>
  <td>Версії Kubernetes 1.32+</td>
</tr>
<tr>
  <td>Опційні типи CEL</td>
  <td>Дивіться
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#OptionalTypes">
      опційні типи CEL
    </a>
  </td>
  <td>Версії Kubernetes 1.29+</td>
</tr>
<tr>
  <td>CEL CrossTypeNumericComparisons</td>
  <td>Дивіться
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#CrossTypeNumericComparisons">
      CEL CrossTypeNumericComparisons
   </a>
  </td>
  <td>Версії Kubernetes 1.29+</td>
<tr>
  <td>CEL TwoVarComprehensions</td>
  <td>Дивіться
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.25.0/ext#readme-twovarcomprehensions">
      CEL TwoVarComprehensions
   </a>
  </td>
  <td>Версії Kubernetes 1.33+</td>
</tr>
</tbody>
</table>

Функції CEL, можливості та налаштування мови підтримують відкат панелі управління Kubernetes. Наприклад, _опційні значення CEL_ були введені у Kubernetes 1.29, і лише API-сервери цієї версії або новіші прийматимуть запити на запис виразів CEL, які використовують _опційні значення CEL_. Однак, коли кластер відкочується до версії Kubernetes 1.28, вирази CEL, що використовують "опційні значення CEL", які вже збережені в ресурсах API, продовжуватимуть правильно оцінюватись.

## Бібліотеки CEL Kubernetes {#kubernetes-cel-libraries}

Крім спільнотних бібліотек CEL, Kubernetes включає бібліотеки CEL, які доступні у всіх місцях використання CEL в Kubernetes.

### Бібліотека списків Kubernetes {#kubernetes-list-library}

Бібліотека списків включає `indexOf` та `lastIndexOf`, які працюють аналогічно функціям рядків з такими самими назвами. Ці функції повертають перший або останній індекс елемента у списку.

Бібліотека списків також включає `min`, `max` та `sum`. Сума підтримується для всіх типів чисел, а також для типу тривалості. Мінімум та максимум підтримуються для всіх типів, що можна порівняти.

Також надається функція `isSorted` для зручності та підтримується для всіх типів, які можна порівняти.

Приклади:

<table>
<caption>Приклади виразів CEL, що використовують функції бібліотеки списків</caption>
<thead>
<tr>
  <td>Вираз CEL</td>
  <td>Призначення</td>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>names.isSorted()</tt></td>
  <td>Перевірити, що список імен зберігається в алфавітному порядку</td>
</tr>
<tr>
  <td><tt>items.map(x, x.weight).sum() == 1.0</tt></td>
  <td>Перевірити, що сума "ваг" списку обʼєктів дорівнює 1.0</td>
</tr>
<tr>
  <td><tt>lowPriorities.map(x, x.priority).max() &lt; highPriorities.map(x, x.priority).min()</tt></td>
  <td>Перевірити, що два набори пріоритетів не перетинаються</td>
</tr>
<tr>
  <td><tt>names.indexOf('should-be-first') == 1</tt></td>
  <td>Вимагати, щоб перше імʼя у списку мало певне значення</td>
</tr>
</tbody>
</table>

Для отримання додаткової інформації дивіться [бібліотеку списків Kubernetes](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Lists) godoc.

### Бібліотека регулярних виразів Kubernetes {#kubernetes-regex-library}

Крім функції `matches`, наданої стандартною бібліотекою CEL, бібліотека регулярних виразів надає функції `find` та `findAll`, що дозволяють виконувати значно ширший спектр операцій з регулярними виразами.

Приклади:

<table>
<caption>Приклади виразів CEL, що використовують функції бібліотеки регулярних виразів</caption>
<thead>
<tr>
  <td>Вираз CEL</td>
  <td>Призначення</td>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>"abc 123".find('[0-9]+')</tt></td>
  <td>Знайти перше число у рядку</td>
</tr>
<tr>
  <td><tt>"1, 2, 3, 4".findAll('[0-9]+').map(x, int(x)).sum() &lt; 100</tt></td>
  <td>Перевірити, що сума чисел у рядку менша за 100</td>
</tr>
</tbody>
</table>

Для отримання додаткової інформації дивіться [бібліотеку регулярних виразів Kubernetes](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Regex) godoc.

### Бібліотека URL Kubernetes {#kubernetes-url-library}

Для спрощення та безпечної обробки URL надані наступні функції:

- `isURL(string)` перевіряє, чи є рядок дійсним URL відповідно до пакета
  [net/url у Go](https://pkg.go.dev/net/url#URL). Рядок повинен бути абсолютним URL.
- `url(string) URL` конвертує рядок в URL або викликає помилку, якщо рядок не є дійсним URL.

Після розбору за допомогою функції `url`, отриманий обʼєкт URL має наступні методи доступу: `getScheme`, `getHost`, `getHostname`, `getPort`, `getEscapedPath` та `getQuery`.

Приклади:

<table>
<caption>Приклади виразів CEL, що використовують функції бібліотеки URL</caption>
<thead>
<tr>
  <td>Вираз CEL</td>
  <td>Призначення</td>
</tr>
</thead>
<tbody>
</tr>
<tr>
  <td><tt>url('https://example.com:80/').getHost()</tt></td>
  <td>Отримати частину хосту 'example.com:80' URL</td>
</tr>
<tr>
  <td><tt>url('https://example.com/path with spaces/').getEscapedPath()</tt></td>
  <td>Повертає '/path%20with%20spaces/'</td>
</tr>
</tbody>
</table>

Для отримання додаткової інформації дивіться [бібліотеку URL Kubernetes](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#URLs) godoc.

### Бібліотека IP-адрес Kubernetes {#kubernetes-ip-address-library}

Щоб зробити обробку IP-адрес простішою і безпечнішою, були додані наступні функції:

- `isIP(string)` перевіряє, чи є рядок дійсною IP-адресою.
- `ip(string) IP` конвертує рядок в обʼєкт IP-адреси або викликає помилку, якщо рядок не є дійсною IP-адресою.

Для обох функцій IP-адреса повинна бути адресою IPv4 або IPv6. Зіставлені з IPv4 IPv6-адреси (наприклад, `::ffff:1.2.3.4`) не допускаються. IP-адреси з зонами (наприклад, `fe80::1%eth0`) не допускаються. Початкові нулі в октетах IPv4-адрес не допускаються.

Після розбору за допомогою функції `ip` отриманий обʼєкт IP має наступну бібліотеку функцій-членів:

<table>
<caption>Доступні функції-члени обʼєкта IP-адреси</caption>
<thead>
<tr>
  <th>Функція-член</th>
  <th>Значення, що повертається (CEL)</th>
  <th>Опис</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isCanonical()</tt></td>
  <td>bool</td>
  <td>
    Повертає true, якщо IP-адреса знаходиться в канонічній формі.
    Для кожної IP-адреси існує лише одна канонічна форма, тому поля, що містять IP-адреси в канонічній формі,
    можна розглядати як рядки при перевірці на рівність або унікальність.
  </td>
</tr>
<tr>
  <td><tt>family()</tt></td>
  <td>int</td>
  <td>Повертає сімейство IP-адреси: <tt>4</tt> для IPv4 та <tt>6</tt> для IPv6.</td>
</tr>
<tr>
  <td><tt>isUnspecified()</tt></td>
  <td>bool</td>
  <td>
    Повертає true, якщо IP-адреса є невизначеною адресою.
    Це може бути IPv4-адреса "0.0.0.0" або IPv6-адреса "::".
  </td>
</tr>
<tr>
  <td><tt>isLoopback()</tt></td>
  <td>bool</td>
  <td>
    Повертає true, якщо IP-адреса є loopback-адресою.
    Це може бути IPv4-адреса зі значенням 127.x.x.x або IPv6-адреса зі значенням ::1.
  </td>
</tr>
<tr>
  <td><tt>isLinkLocalMulticast()</tt></td>
  <td>bool</td>
  <td>
    Повертає true, якщо IP-адреса є локальною груповою адресою каналу (link-local multicast).
    Це може бути IPv4-адреса зі значенням 224.0.0.x або IPv6-адреса в мережі ff00::/8.
  </td>
</tr>
<tr>
  <td><tt>isLinkLocalUnicast()</tt></td>
  <td>bool</td>
  <td>
    Повертає true, якщо IP-адреса є локальною індивідуальною адресою каналу (link-local unicast).
    Це може бути IPv4-адреса зі значенням 169.254.x.x або IPv6-адреса в мережі fe80::/10.
  </td>
</tr>
<tr>
  <td><tt>isGlobalUnicast()</tt></td>
  <td>bool</td>
  <td>
    Повертає true, якщо IP-адреса є глобальною індивідуальною адресою.
    Це може бути IPv4-адреса, що не є нулем або 255.255.255.255, або IPv6-адреса, що не є локальною індивідуальною адресою каналу, loopback-адресою або груповою адресою.
  </td>
</tr>
</tbody>
</table>

Приклади:

<table>
<caption>Приклади виразів CEL, що використовують функції бібліотеки IP-адрес</caption>
<thead>
<tr>
  <th>Вираз CEL</th>
  <th>Призначення</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isIP('127.0.0.1')</tt></td>
  <td>Повертає true для дійсної IP-адреси.</td>
</tr>
<tr>
  <td><tt>ip('2001:db8::abcd').isCanonical()</tt></td>
  <td>Повертає true для канонічної IPv6-адреси.</td>
</tr>
<tr>
  <td><tt>ip('2001:DB8::ABCD').isCanonical()</tt></td>
  <td>Повертає false, оскільки канонічна форма використовує нижній регістр.</td>
</tr>
<tr>
  <td><tt>ip('127.0.0.1').family() == 4</tt></td>
  <td>Перевіряє сімейство IP-адреси.</td>
</tr>
<tr>
  <td><tt>ip('::1').isLoopback()</tt></td>
  <td>Перевіряє, чи є IP-адреса loopback-адресою.</td>
</tr>
<tr>
  <td><tt>ip('192.168.0.1').isGlobalUnicast()</tt></td>
  <td>Перевіряє, чи є IP-адреса глобальною індивідуальною адресою.</td>
</tr>
</tbody>
</table>

Докладнішу інформацію наведено у [Бібліотеці IP-адрес Kubernetes](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#IP) godoc.

### Бібліотека CIDR Kubernetes {#kubernetes-cidr-library}

CIDR надає розширення бібліотеки функцій CEL для розбору нотації {{< glossary_tooltip text="CIDR" term_id="CIDR" >}}.

#### `cidr` {#cidr}

Конвертує рядок у нотації CIDR в представлення мережевої адреси або викликає помилку, якщо рядок не є дійсною нотацією CIDR. CIDR повинен бути підмережею IPv4 або IPv6 з маскою. Ведучі нулі в октетах IPv4-адреси не дозволяються. IPv4-адреси, що відображаються в IPv6 (наприклад, `::ffff:1.2.3.4/24`), не дозволяються.

<tt>cidr(&lt;string&gt;) &lt;CIDR&gt;</tt>

Приклади:

<table>
<caption>Приклади виразів CEL, що використовують функцію cidr</caption>
<thead>
<tr>
  <th>Вираз CEL</th>
  <th>Призначення</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>cidr('192.168.0.0/16')</tt></td>
  <td>Повертає IPv4-адресу з маскою CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('::1/128')</tt></td>
  <td>Повертає IPv6-адресу з маскою CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/33')</tt></td>
  <td>Помилка, оскільки довжина префікса перевищує розмір IPv4-адреси.</td>
</tr>
<tr>
  <td><tt>cidr('::1/129')</tt></td>
  <td>Помилка, оскільки довжина префікса перевищує розмір IPv6-адреси.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/16')</tt></td>
  <td>Помилка, оскільки після префікса є біти, що не дорівнюють 0.</td>
</tr>
</tbody>
</table>

#### `isCIDR` {#iscidr}

Повертає true, якщо рядок є дійсним представленням підмережі з маскою в нотації CIDR. CIDR повинен бути підмережею IPv4 або IPv6 з маскою. Ведучі нулі в октетах IPv4-адреси не дозволяються. IPv4-адреси, що відображаються в IPv6 (наприклад, `::ffff:1.2.3.4/24`), не дозволяються.

<tt>isCIDR(&lt;string&gt;) &lt;bool&gt;</tt>

Приклади:

<table>
<caption>Приклади виразів CEL, що використовують функцію isCIDR</caption>
<thead>
<tr>
  <th>Вираз CEL</th>
  <th>Призначення</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isCIDR('192.168.0.0/16')</tt></td>
  <td>Повертає true для дійсного IPv4 CIDR.</td>
</tr>
<tr>
  <td><tt>isCIDR('::1/128')</tt></td>
  <td>Повертає true для дійсного IPv6 CIDR.</td>
</tr>
<tr>
  <td><tt>isCIDR('192.168.0.0/33')</tt></td>
  <td>Повертає false, оскільки довжина префікса перевищує розмір IPv4-адреси.</td>
</tr>
<tr>
  <td><tt>isCIDR('::1/129')</tt></td>
  <td>Повертає false, оскільки довжина префікса перевищує розмір IPv6-адреси.</td>
</tr>
</tbody>
</table>

#### `containsIP` / `containsCIDR` / `ip` / `masked` / `prefixLength` {#containsip-containscidr-ip-masked-prefixlength}

- `containsIP`: Повертає true, якщо CIDR містить задану IP-адресу.
IP-адреса має бути IPv4 або IPv6.
Може приймати як аргумент рядок або IP-адресу.

- `containsCIDR`: Повертає true, якщо CIDR містить заданий CIDR.
CIDR повинен бути підмережею IPv4 або IPv6 з маскою.
Може приймати як аргумент рядок або CIDR.

- `ip`: Повертає представлення IP-адреси CIDR.

- `masked`: Повертає представлення CIDR мережевої адреси з маскованим префіксом.
Це можна використовувати для повернення канонічної форми мережі CIDR.

- `prefixLength`: Повертає довжину префікса CIDR в бітах.
Це кількість бітів у масці.

Приклади:

<table>
<caption>Приклади виразів CEL, що використовують функції бібліотеки CIDR</caption>
<thead>
<tr>
  <th>Вираз CEL</th>
  <th>Призначення</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP(ip('192.168.0.1'))</tt></td>
  <td>Перевіряє, чи містить CIDR вказану IP-адресу (обʼєкт IP).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP(ip('192.168.1.1'))</tt></td>
  <td>Перевіряє, чи містить CIDR вказану IP-адресу (обʼєкт IP).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP('192.168.0.1')</tt></td>
  <td>Перевіряє, чи містить CIDR вказану IP-адресу (рядок).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP('192.168.1.1')</tt></td>
  <td>Перевіряє, чи містить CIDR вказану IP-адресу (рядок).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/16').containsCIDR(cidr('192.168.10.0/24'))</tt></td>
  <td>Перевіряє, чи містить CIDR інший вказаний CIDR (обʼєкт CIDR).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.1.0/24').containsCIDR(cidr('192.168.2.0/24'))</tt></td>
  <td>Перевіряє, чи містить CIDR інший вказаний CIDR (обʼєкт CIDR).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/16').containsCIDR('192.168.10.0/24')</tt></td>
  <td>Перевіряє, чи містить CIDR інший вказаний CIDR (рядок).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.1.0/24').containsCIDR('192.168.2.0/24')</tt></td>
  <td>Перевіряє, чи містить CIDR інший вказаний CIDR (рядок).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24').ip()</tt></td>
  <td>Повертає частину IP-адреси CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24').ip().family()</tt></td>
  <td>Повертає сімейство частини IP-адреси CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('::1/128').ip()</tt></td>
  <td>Повертає частину IP-адреси IPv6 CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('::1/128').ip().family()</tt></td>
  <td>Повертає сімейство частини IP-адреси IPv6 CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').masked()</tt></td>
  <td>Повертає канонічну форму мережі CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24').masked()</tt></td>
  <td>Повертає канонічну форму мережі CIDR, маскуючи біти після префікса.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24') == cidr('192.168.0.0/24').masked()</tt></td>
  <td>Порівнює CIDR з його канонічною формою (вже канонічний).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24') == cidr('192.168.0.1/24').masked()</tt></td>
  <td>Порівнює CIDR з його канонічною формою (не канонічний).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/16').prefixLength()</tt></td>
  <td>Повертає довжину префікса IPv4 CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('::1/128').prefixLength()</tt></td>
  <td>Повертає довжину префікса IPv6 CIDR.</td>
</tr>
</tbody>
</table>

Докладнішу інформацію можна знайти у [Бібліотеці Kubernetes CIDR](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#CIDR) godoc.

### Бібліотека авторизатора Kubernetes {#kubernetes-authorizer-library}

Для виразів CEL в API, де доступна змінна типу `Authorizer`, авторизатор може використовуватися для виконання перевірок авторизації для принципала (автентифікованого користувача) запиту.

Перевірки ресурсів API виконуються наступним чином:

1. Вкажіть групу та ресурс для перевірки: `Authorizer.group(string).resource(string) ResourceCheck`
1. Опційно викличте будь-яку комбінацію наступних функцій побудови для подальшого обмеження перевірки авторизації.
   Зверніть увагу, що ці функції повертають тип отримувача та можуть бути зʼєднані ланцюгом:
   - `ResourceCheck.subresource(string) ResourceCheck`
   - `ResourceCheck.namespace(string) ResourceCheck`
   - `ResourceCheck.name(string) ResourceCheck`
1. Викличте `ResourceCheck.check(verb string) Decision`, щоб виконати перевірку авторизації.
1. Викличте `allowed() bool` або `reason() string`, щоб переглянути результат перевірки авторизації.

Авторизація для нересурсних запитів виконується так:

1. Вкажіть лише шлях: `Authorizer.path(string) PathCheck`
1. Викличте `PathCheck.check(httpVerb string) Decision`, щоб виконати перевірку авторизації.
1. Викличте `allowed() bool` або `reason() string`, щоб переглянути результат перевірки авторизації.

Для виконання перевірки авторизації для службового облікового запису:

- `Authorizer.serviceAccount(namespace string, name string) Authorizer`

<table>
<caption>Приклади виразів CEL, що використовують функції бібліотеки URL</caption>
<thead>
<tr>
  <th>Вираз CEL</th>
  <th>Призначення</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>authorizer.group('').resource('pods').namespace('default').check('create').allowed()</tt></td>
  <td>Повертає true, якщо принципалу (користувачу або службовому обліковому запису) дозволено створювати Podʼи у просторі імен 'default'.</td>
</tr>
<tr>
  <td><tt>authorizer.path('/healthz').check('get').allowed()</tt></td>
  <td>Перевіряє, чи має принципал (користувач або службовий обліковий запис) дозвіл виконувати HTTP GET-запити до шляху API /healthz.</td>
</tr>
<tr>
  <td><tt>authorizer.serviceAccount('default', 'myserviceaccount').resource('deployments').check('delete').allowed()<tt></td>
  <td>Перевіряє, чи має службовий обліковий запис дозвіл видаляти Deploymentʼи.</td>
</tr>
</tbody>
</table>

{{< feature-state feature_gate_name="AuthorizeWithSelectors" >}}

Для виразів CEL в API, де доступна змінна типу `Authorizer`, селектори полів і міток можуть бути включені в перевірки авторизації.

<table>
<caption>Приклади виразів CEL із використанням функцій авторизації для селекторів</caption>
<thead>
<tr>
  <th>Вираз CEL</th>
  <th>Призначення</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>authorizer.group('').resource('pods').fieldSelector('spec.nodeName=mynode').check('list').allowed()</tt></td>
  <td>
    Повертає true, якщо принципалу (користувачу або службовому обліковому запису) дозволено
    отримувати список Podʼів із селектором полів <tt>spec.nodeName=mynode</tt>.
  </td>
</tr>
<tr>
  <td><tt>authorizer.group('').resource('pods').labelSelector('example.com/mylabel=myvalue').check('list').allowed()</tt></td>
  <td>
    Повертає true, якщо принципалу (користувачу або службовому обліковому запису) дозволено
    отримувати список Podʼів із селектором міток <tt>example.com/mylabel=myvalue</tt>.
  </td>
</tr>
</tbody>
</table>

Для отримання додаткової інформації дивіться [бібліотеку Kubernetes Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz) та [бібліотеку Kubernetes AuthzSelectors](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors) godoc.

### Бібліотека форматів Kubernetes {#kubernetes-format-library}

Бібліотека `format` надає функції для перевірки поширених форматів рядків у Kubernetes. Це може бути корисно у `messageExpression` правил валідації для надання більш конкретних повідомлень про помилки.

Бібліотека надає функції `format()` для кожного іменованого формату, а також загальну функцію `format.named()`.

- `format.named(string)` &rarr; `?Format`: Повертає обʼєкт `Format` для заданого імені формату, якщо він існує. Інакше повертає `optional.none`.
- `format.<formatName>() -> Format`: Також доступні зручні функції для всіх іменованих форматів. Наприклад, `format.dns1123Label()` повертає обʼєкт `Format` для міток DNS-1123.
- `<Format>.validate(string) -> list<string>?`: Перевіряє рядок на відповідність формату. Повертає `optional.none`, якщо рядок валідний, інакше — optional, що містить список рядків з помилками валідації.

**Доступні формати:**

Підтримуються наступні назви форматів:

<table>
<caption>Доступні формати для бібліотеки форматів</caption>
<thead>
<tr>
  <th>Назва формату</th>
  <th>Опис</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>dns1123Label</tt></td>
  <td>Перевіряє, чи є рядок валідною DNS-1123 міткою.</td>
</tr>
<tr>
  <td><tt>dns1123Subdomain</tt></td>
  <td>Перевіряє, чи є рядок валідним DNS-1123 піддоменом.</td>
</tr>
<tr>
  <td><tt>dns1035Label</tt></td>
  <td>Перевіряє, чи є рядок валідною DNS-1035 міткою.</td>
</tr>
<tr>
  <td><tt>qualifiedName</tt></td>
  <td>Перевіряє, чи є рядок валідним кваліфікованим іменем.</td>
</tr>
<tr>
  <td><tt>dns1123LabelPrefix</tt></td>
  <td>Перевіряє, чи є рядок валідним префіксом DNS-1123 мітки.</td>
</tr>
<tr>
  <td><tt>dns1123SubdomainPrefix</tt></td>
  <td>Перевіряє, чи є рядок валідним префіксом DNS-1123 піддомену.</td>
</tr>
<tr>
  <td><tt>dns1035LabelPrefix</tt></td>
  <td>Перевіряє, чи є рядок валідним префіксом DNS-1035 мітки.</td>
</tr>
<tr>
  <td><tt>labelValue</tt></td>
  <td>Перевіряє, чи є рядок валідним значенням мітки.</td>
</tr>
<tr>
  <td><tt>uri</tt></td>
  <td>Перевіряє, чи є рядок валідним URI. Використовує той самий патерн, що і `isURL`, але повертає список помилок.</td>
</tr>
<tr>
  <td><tt>uuid</tt></td>
  <td>Перевіряє, чи є рядок валідним UUID.</td>
</tr>
<tr>
  <td><tt>byte</tt></td>
  <td>Перевіряє, чи є рядок валідним base64-кодованим рядком.</td>
</tr>
<tr>
  <td><tt>date</tt></td>
  <td>Перевіряє, чи є рядок валідною датою у форматі `YYYY-MM-DD`.</td>
</tr>
<tr>
  <td><tt>datetime</tt></td>
  <td>Перевіряє, чи є рядок валідною датою-часом у форматі RFC3339.</td>
</tr>
</tbody>
</table>

**Приклади:**

<table>
<caption>Приклади виразів CEL, що використовують функції бібліотеки форматів</caption>
<thead>
<tr>
  <th>Вираз CEL</th>
  <th>Призначення</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>!format.dns1123Label().validate(self.metadata.name).hasValue()</tt></td>
  <td>Правило валідації, що перевіряє, чи імʼя обʼєкта є валідною DNS-1123 міткою.</td>
</tr>
<tr>
  <td><tt>format.dns1123Label().validate(self.metadata.name).orValue([]).join("\\n")</tt></td>
  <td>`messageExpression`, що повертає конкретні помилки валідації для поля. Якщо поле валідне, `validate` повертає `optional.none`, а `orValue` — порожній список, результатом буде порожній рядок.</td>
</tr>
</tbody>
</table>

Докладніше: [Бібліотека форматів Kubernetes](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Format) godoc.

### Бібліотека кількостей Kubernetes {#kubernetes-quantity-library}

У Kubernetes 1.28 додана підтримка обробки рядків кількості (наприклад, 1.5G, 512k, 20Mi).

- `isQuantity(string)` перевіряє, чи є рядок дійсною кількістю (Quantity) відповідно до
  [resource.Quantity у Kubernetes](https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity).
- `quantity(string) Quantity` конвертує рядок у кількість або викликає помилку, якщо рядок не є дійсною кількістю.

Після розбору за допомогою функції `quantity` отриманий обʼєкт Quantity має таку бібліотеку функцій-членів:

<table>
<caption>Доступні функції-члени Quantity</caption>
<thead>
<tr>
  <th>Функція-член</th>
  <th>Значення, що повертається (CEL)</th>
  <th>Опис</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isInteger()</tt></td>
  <td>bool</td>
  <td>Повертає true тоді й лише тоді, коли asInteger можна безпечно викликати без помилки</td>
</tr>
<tr>
  <td><tt>asInteger()</tt></td>
  <td>int</td>
  <td>
    Повертає представлення поточного значення як <tt>int64</tt>, якщо це можливо,
    або викликає помилку, якщо конвертація призводить до переповнення або втрати точності.
  </td>
</tr>
<tr>
  <td><tt>asApproximateFloat()</tt></td>
  <td>float</td>
  <td>
    Повертає представлення кількості як <tt>float64</tt>, яке може втратити точність.
    Якщо значення кількості виходить за межі діапазону <tt>float64</tt>,
    буде повернуто <tt>+Inf/-Inf</tt>.</td>
</tr>
<tr>
  <td><tt>sign()</tt></td>
  <td>int</td>
  <td>
    Повертає <tt>1</tt>, якщо кількість додатна, <tt>-1</tt>, якщо вона відʼємна.
    <tt>0</tt>, якщо вона дорівнює нулю.
  </td>
</tr>
<tr>
  <td><tt>add(&lt;Quantity&gt;)</tt></td>
  <td>Quantity</td>
  <td>Повертає суму двох кількостей</td>
</tr>
<tr>
  <td><tt>add(&lt;int&gt;)</tt></td>
  <td>Quantity</td>
  <td>Повертає суму кількості та цілого числа</td>
  <td>
<tr>
  <td><tt>sub(&lt;Quantity&gt;)</tt></td>
  <td>Quantity</td>
  <td>Повертає різницю між двома кількостями</td>
</tr>
<tr>
  <td><tt>sub(&lt;int&gt;)</tt></td>
  <td>Quantity</td>
  <td>Повертає різницю між кількістю та цілим числом</td>
</tr>
<tr>
  <td><tt>isLessThan(&lt;Quantity&gt;)</tt></td>
  <td>bool</td>
  <td>Повертає true тоді й лише тоді, коли отримувач менший за операнд</td>
</tr>
<tr>
  <td><tt>isGreaterThan(&lt;Quantity&gt;)</tt></td>
  <td>bool</td>
  <td>Повертає true тоді й лише тоді, коли отримувач більший за операнд</td>
</tr>
<tr>
  <td><tt>compareTo(&lt;Quantity&gt;)</tt></td>
  <td>int</td>
  <td>
    Порівнює отримувача з операндом і повертає 0, якщо вони рівні,
    1, якщо отримувач більший, або -1, якщо отримувач менший за операнд
  </td>
</tr>
</tbody>
</table>

Приклади:

<table>
<caption>Приклади виразів CEL, що використовують функції бібліотеки URL</caption>
<thead>
<tr>
  <th>Вираз CEL</th>
  <th>Призначення</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>quantity("500000G").isInteger()</tt></td>
  <td>Перевірка, чи конвертація в ціле число викликає помилку</td>
</tr>
<tr>
  <td><tt>quantity("50k").asInteger()</tt></td>
  <td>Точна конвертація в ціле число</td>
</tr>
<tr>
  <td><tt>quantity("9999999999999999999999999999999999999G").asApproximateFloat()</tt></td>
  <td>Конвертація у float із втратою точності</td>
</tr>
<tr>
  <td><tt>quantity("50k").add(quantity("20k"))</tt></td>
  <td>Додати дві кількості</td>
</tr>
<tr>
  <td><tt>quantity("50k").sub(20000)</tt></td>
  <td>Відняти ціле число від кількості</td>
</tr>
<tr>
  <td><tt>quantity("50k").add(20).sub(quantity("100k")).sub(-50000)</tt></td>
  <td>Ланцюгове додавання та віднімання цілих чисел та кількостей</td>
</tr>
<tr>
  <td><tt>quantity("200M").compareTo(quantity("0.2G"))</tt></td>
  <td>Порівняти дві кількості</td>
</tr>
<tr>
  <td><tt>quantity("150Mi").isGreaterThan(quantity("100Mi"))</tt></td>
  <td>Перевірити, чи кількість більша за отримувача</td>
</tr>
<tr>
  <td><tt>quantity("50M").isLessThan(quantity("100M"))</tt></td>
  <td>Перевірити, чи кількість менша за отримувача</td>
</tr>
</tbody>
</table>

### Бібліотека semver Kubernetes {#kubernetes-semver-library}

У Kubernetes v1.34 додано підтримку розбору та порівняння рядків, що відповідають специфікації Semantic Versioning 2.0.0. Докладніше про прийняті патерни дивіться [semver.org](https://semver.org/).

- `isSemver(string)` перевіряє, чи є рядок валідною семантичною версією.
- `semver(string)` конвертує рядок у обʼєкт Semver або повертає помилку.

Додатковий булевий аргумент `normalize` можна передати у `isSemver` та `semver`. Якщо `true`, нормалізація прибирає префікс "v", додає 0 для minor та patch, якщо вказано лише major або major.minor, і прибирає ведучі нулі.

Після розбору через функцію `semver` отриманий обʼєкт Semver має такі функції-члени:

<table>
<caption>Доступні функції-члени обʼєкта Semver</caption>
<thead>
<tr>
  <th>Функція-член</th>
  <th>Значення, що повертається (CEL)</th>
  <th>Опис</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>major()</tt></td>
  <td>int</td>
  <td>Повертає номер основної версії (major).</td>
</tr>
<tr>
  <td><tt>minor()</tt></td>
  <td>int</td>
  <td>Повертає номер другорядної версії (minor).</td>
</tr>
<tr>
  <td><tt>patch()</tt></td>
  <td>int</td>
  <td>Повертає номер версії виправлення (patch).</td>
</tr>
<tr>
  <td><tt>isLessThan(&lt;Semver&gt;)</tt></td>
  <td>bool</td>
  <td>Повертає true тоді й лише тоді, коли отримувач менший за операнд.</td>
</tr>
<tr>
  <td><tt>isGreaterThan(&lt;Semver&gt;)</tt></td>
  <td>bool</td>
  <td>Повертає true тоді й лише тоді, коли отримувач більший за операнд.</td>
</tr>
<tr>
  <td><tt>compareTo(&lt;Semver&gt;)</tt></td>
  <td>int</td>
  <td>
    Порівнює отримувача з операндом і повертає 0, якщо вони рівні,
    1, якщо отримувач більший, або -1, якщо отримувач менший за операнд.
  </td>
</tr>
</tbody>
</table>

Приклади:

<table>
<caption>Приклади виразів CEL, що використовують функції бібліотеки semver</caption>
<thead>
<tr>
  <th>Вираз CEL</th>
  <th>Призначення</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isSemver('1.0.0')</tt></td>
  <td>Повертає true для валідного рядка Semver.</td>
</tr>
<tr>
  <td><tt>isSemver('v1.0', true)</tt></td>
  <td>Повертає true для рядка Semver, який можна нормалізувати.</td>
</tr>
<tr>
  <td><tt>semver('1.2.3').major()</tt></td>
  <td>Повертає основну версію Semver.</td>
</tr>
<tr>
  <td><tt>semver('1.2.3').compareTo(semver('2.0.0')) &lt; 0</tt></td>
  <td>Порівнює дві версії Semver.</td>
</tr>
</tbody>
</table>

Докладніше: [Бібліотека semver Kubernetes](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#SemverLib) godoc.

## Перевірка типів {#type-checking}

CEL — це [мова з поступовою типізацією](https://github.com/google/cel-spec/blob/master/doc/langdef.md#gradual-type-checking).

Деякі поля API Kubernetes містять вирази CEL з повною перевіркою типів. Наприклад, [правила валідації CustomResourceDefinitions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules) проходять повну перевірку типів.

Деякі поля API Kubernetes містять вирази CEL з частковою перевіркою типів. Вираз з частковою перевіркою типів — це вираз, у якому деякі змінні статично типізовані, а інші — динамічно типізовані. Наприклад, у виразах CEL [ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/) змінна `request` типізована, але змінна `object` динамічно типізована. У звʼязку з цим вираз, що містить `request.namex`, не пройде перевірку типів, оскільки поле `namex` не визначене. Однак `object.namex` пройде перевірку типів навіть тоді, коли поле `namex` не визначене для видів ресурсів, на які посилається `object`, оскільки `object` динамічно типізований.

Макрос `has()` у CEL можна використовувати у виразах CEL для перевірки наявності поля змінної з динамічною типізацією перед спробою отримати доступ до значення цього поля. Наприклад:

```cel
has(object.namex) ? object.namex == 'special' : request.name == 'special'
```

Використовуйте `has()` для перевірки наявності поля. Не використовуйте `has()` для перевірки наявності ключа в map. Наприклад, не пишіть `has(object.metadata.labels['example.com/environment'])`. Для перевірки ключів у map використовуйте оператор `in`. Наприклад:

```cel
has(object.metadata.labels) && 'example.com/environment' in object.metadata.labels
```

Цей вираз перевіряє, що `metadata.labels` присутній перед перевіркою наявності ключа `example.com/environment` у map.

## Інтеграція системи типів {#type-system-integration}

<table>
<caption>Таблиця, що показує взаємозвʼязок між типами OpenAPIv3 та типами CEL</caption>
<thead>
<tr>
  <th>Тип OpenAPIv3</th>
  <th>Тип CEL</th>
</tr>
</thead>
<tbody>
<tr>
  <td>'object' з Properties</td>
  <td>
    object / "тип повідомлення"
    (<tt>type(&lt;object&gt;)</tt> обчислюється як
     <tt>selfType&lt;uniqueNumber&gt;.path.to.object.from.self</tt>)
  </td>
</tr>
<tr>
  <td>'object' з <tt>additionalProperties</tt></td>
  <td>map</td>
</tr>
<tr>
  <td>'object' з <tt>x-kubernetes-embedded-type</tt></td>
  <td>
    object / "тип повідомлення", 'apiVersion', 'kind', 'metadata.name'
    і 'metadata.generateName' неявно включені в схему
  </td>
</tr>
<tr>
  <td>'object' з x-kubernetes-preserve-unknown-fields</td>
  <td>object / "тип повідомлення", невідомі поля НЕ доступні у виразі CEL</td>
</tr>
<tr>
  <td><tt>x-kubernetes-int-or-string</tt></td>
  <td>
    Обʼєднання <tt>int</tt> або <tt>string</tt>,
    <tt>self.intOrString < 100 | self.intOrString == '50%'</tt>
    обчислюється як true і для <tt>50</tt>, і для <tt>"50%"</tt>
  </td>
</tr>
<tr>
  <td>'array'</td>
  <td>list</td>
</tr>
<tr>
  <td>'array' з <tt>x-kubernetes-list-type=map</tt></td>
  <td>list з рівністю на основі map і гарантіями унікальності ключів</td>
</tr>
<tr>
  <td>'array' з <tt>x-kubernetes-list-type=set</tt></td>
  <td>list з рівністю на основі set і гарантіями унікальності елементів</td>
</tr>
<tr>
  <td>'boolean'</td>
  <td>boolean</td>
</tr>
<tr>
  <td>'number' (усі формати)</td>
  <td>double</td>
</tr>
<tr>
  <td>'integer' (усі формати)</td>
  <td>int (64)</td>
</tr>
<tr>
  <td><i>немає еквівалента</i></td>
  <td>uint (64)</td>
</tr>
<tr>
  <td>'null'</td>
  <td>null_type</td>
</tr>
<tr>
  <td>'string'</td>
  <td>string</td>
</tr>
<tr>
  <td>'string' з format=byte (закодований у base64)</td>
  <td>bytes</td>
</tr>
<tr>
  <td>'string' з format=date</td>
  <td>timestamp (<tt>google.protobuf.Timestamp</tt>)</td>
</tr>
<tr>
  <td>'string' з format=datetime</td>
  <td>timestamp (<tt>google.protobuf.Timestamp</tt>)</td>
</tr>
<tr>
  <td>'string' з format=duration</td>
  <td>duration (<tt>google.protobuf.Duration</tt>)</td>
</tr>
</tbody>
</table>

Також дивіться: [Типи CEL](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#values), [Типи OpenAPI](https://swagger.io/specification/#data-types), [Структурні схеми Kubernetes](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).

Порівняння рівності для масивів з `x-kubernetes-list-type` типу `set` або `map` ігнорує порядок елементів. Наприклад, `[1, 2] == [2, 1]`, якщо масиви представляють значення Kubernetes `set`.

Конкатенація для масивів з `x-kubernetes-list-type` використовує семантику типу списку:

`set`
: `X + Y` виконує обʼєднання, за якого позиції всіх елементів у `X` у масиві зберігаються, а елементи в `Y`, що не перетинаються, додаються в кінець зі збереженням їх часткового порядку.

`map`
: `X + Y` виконує злиття, за якого позиції всіх ключів у `X` у масиві зберігаються, але значення перезаписуються значеннями з `Y`, коли множини ключів `X` і `Y` перетинаються. Елементи `Y` з ключами, що не перетинаються, додаються в кінець зі збереженням їх часткового порядку.

## Екранування {#escaping}

Тільки імена властивостей ресурсів Kubernetes форми `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` доступні з CEL. Доступні імена властивостей екрануються згідно з наступними правилами при доступі у виразі:

<table>
<caption>Таблиця правил екранування ідентифікаторів CEL</caption>
<thead>
<tr>
  <th>екрануюча послідовність</th>
  <th>еквівалент імені властивості</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>__underscores__</tt></td>
  <td><tt>__</tt></td>
</tr>
<tr>
  <td><tt>__dot__</tt></td>
  <td><tt>.</tt></td>
</tr>
<tr>
  <td><tt>__dash__</tt></td>
  <td><tt>-</tt></td>
</tr>
<tr>
  <td><tt>__slash__</tt></td>
  <td><tt>/</tt></td>
</tr>
<tr>
  <td><tt>__{keyword}__</tt></td>
  <td>
    <a href="https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#syntax">
      <b>ЗАРЕЗЕРВОВАНЕ</b> ключове слово CEL
    </a>
  </td>
</tr>
</tbody>
</table>

Коли ви екрануєте будь-яке з **ЗАРЕЗЕРВОВАНИХ** ключових слів CEL, збіг повинен точно відповідати імені властивості та використовувати екранування з підкресленням (наприклад, `int` у слові `sprint` не буде екрановано, і це не буде необхідно).

Приклади екранування:

<table>
<caption>Приклади екранованих ідентифікаторів CEL</caption>
<thead>
<tr>
  <th>імʼя властивості</th>
  <th>правило з екранованим імʼям властивості</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>namespace</tt></td>
  <td><tt>self.__namespace__ &gt; 0</tt></td>
</tr>
<tr>
  <td><tt>x-prop</tt></td>
  <td><tt>self.x__dash__prop &gt; 0</tt></td>
</tr>
<tr>
  <td><tt>redact_d</tt></td>
  <td><tt>self.redact__underscores__d &gt; 0</tt></td>
</tr>
<tr>
  <td><tt>string</tt></td>
  <td><tt>self.startsWith('kube')</tt></td>
</tr>
</tbody>
</table>

## Обмеження ресурсів {#resource-constraints}

CEL не є Тюрінг-повною мовою і пропонує різноманітні засоби безпеки для промислової експлуатації, що обмежують час виконання. Функції _обмеження ресурсів_ CEL забезпечують зворотний звʼязок розробникам щодо складності виразів та допомагають захистити API-сервер від надмірного споживання ресурсів під час обчислення. Функції обмеження ресурсів CEL використовуються для запобігання надмірному споживанню ресурсів API-сервера під час обчислення CEL.

Ключовим елементом функцій обмеження ресурсів є _одиниця вартості_, яку CEL визначає як спосіб відстеження використання CPU. Одиниці вартості незалежні від системного навантаження та апаратного забезпечення. Одиниці вартості також є детермінованими; для будь-якого заданого виразу CEL та вхідних даних обчислення виразу інтерпретатором CEL завжди призведе до однакової вартості.

Багато з основних операцій CEL мають фіксовані витрати. Найпростіші операції, такі як порівняння (наприклад, `<`), мають вартість 1. Деякі мають вищу фіксовану вартість, наприклад, оголошення літералів списку мають фіксовану базову вартість 40 одиниць вартості.

Виклики функцій, реалізованих у рідному коді, оцінюються на основі часової складності операції. Наприклад, операції, що використовують регулярні вирази, такі як `match` та `find`, оцінюються з використанням приблизної вартості `length(regexString)*length(inputString)`. Приблизна вартість відображає найгірший випадок часової складності реалізації RE2 в Go.

### Бюджет вартості під час виконання {#runtime-cost-budget}

Усі вирази CEL, які обчислює Kubernetes, обмежені бюджетом вартості під час виконання. Бюджет вартості під час виконання — це оцінка фактичного використання CPU, що обчислюється шляхом інкрементування лічильника одиниць вартості під час інтерпретації виразу CEL. Якщо інтерпретатор CEL виконає занадто багато інструкцій, бюджет вартості під час виконання буде перевищено, виконання виразу буде зупинено і результатом стане помилка.

Деякі ресурси Kubernetes визначають додатковий бюджет вартості під час виконання, який обмежує виконання декількох виразів. Якщо загальна вартість виразів перевищує бюджет, виконання виразів буде зупинено і результатом стане помилка. Наприклад, валідація власного ресурсу користувача має бюджет вартості під час виконання _на одну валідацію_ для всіх [правил валідації](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules), які обчислюються для валідації власного ресурсу.

### Обмеження оціночної вартості {#estimated-cost-limits}

Для деяких ресурсів Kubernetes API-сервер також може перевірити, чи не буде найгірший випадок оціненого часу виконання виразів CEL надто дорогим для виконання. Якщо так, API-сервер запобігає записуванню виразу CEL у ресурси API, відхиляючи операції створення або оновлення, що містять вираз CEL для ресурсів API. Ця функція пропонує сильнішу гарантію, що вирази CEL, записані у ресурс API, будуть обчислені під час виконання без перевищення бюджету вартості під час виконання.
