---
title: kuberc (v1beta1)
content_type: tool-reference
package: kubectl.config.k8s.io/v1beta1
auto_generated: true
---


## Типи ресурсів {#resource-types}

- [Preference](#kubectl-config-k8s-io-v1beta1-Preference)

## `Preference` {#kubectl-config-k8s-io-v1beta1-Preference}

<p>Preference зберігає елементи конфігураційного файлу KubeRC</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubectl.config.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Preference</code></td></tr>

<tr><td><code>defaults</code> <B>[Обовʼязкове]</B><br/>
<a href="#kubectl-config-k8s-io-v1beta1-CommandDefaults"><code>[]CommandDefaults</code></a>
</td>
<td>
   <p>defaults дозволяють змінювати стандартні значення опцій команд. Це особливо корисно, коли користувач не хоче щоразу явно встановлювати опції.</p>
</td>
</tr>
<tr><td><code>aliases</code> <B>[Обовʼязкове]</B><br/>
<a href="#kubectl-config-k8s-io-v1beta1-AliasOverride"><code>[]AliasOverride</code></a>
</td>
<td>
   <p>aliases дозволяє визначати аліаси команд для наявних команд kubectl із необовʼязковими стандартними значеннями опцій. Якщо імʼя аліасу збігається з вбудованою командою, вбудована команда завжди має пріоритет. Параметри, перевизначені в розділі defaults, НЕ застосовуються до аліасів для тієї самої команди. kubectl [ALIAS NAME] [USER_OPTIONS] [USER_EXPLICIT_ARGS] розширюється до kubectl [COMMAND] # вбудований аліас команди вказує на [KUBERC_PREPEND_ARGS] [ USER_OPTIONS] [KUBERC_OPTIONS] # решта опцій, які не передаються користувачем у [USER_OPTIONS] [USER_EXPLICIT_ARGS] [KUBERC_APPEND_ARGS] наприклад</p>
<ul>
<li>name: runx
command: run
options:
<ul>
<li>name: image
default: nginx
appendArgs:</li>
</ul>
<hr>
<ul>
<li>custom-arg1 Наприклад, якщо користувач викликає команду &quot;kubectl runx test-pod&quot;, вона буде розгорнута до &quot;kubectl run --image=nginx test-pod -- custom-arg1&quot;.</li>
</ul>
</li>
<li>name: getn
command: get
options:
<ul>
<li>name: output
default: wide
prependArgs:</li>
<li>node &quot;kubectl getn control-plane-1&quot; розгортається у &quot;kubectl get node control-plane-1 --output=wide&quot; &quot;kubectl getn control-plane-1 --output=json&quot; розгортається у &quot;kubectl get node --output=json control-plane-1&quot;</li>
</ul>
</li>
</ul>
</td>
</tr>
</tbody>
</table>

## `AliasOverride` {#kubectl-config-k8s-io-v1beta1-AliasOverride}

**Зʼявляється в:**

- [Preference](#kubectl-config-k8s-io-v1beta1-Preference)

<p>AliasOverride зберігає визначення аліасів.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>name — це ім'я аліасу, яке може містити тільки літери алфавіту. Якщо ім'я аліасу конфліктує з вбудованою командою, буде використана вбудована команда.</p>
</td>
</tr>
<tr><td><code>command</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>command — є окремою командою або набором команд для викнання, як: &quot;set env&quot; або &quot;create&quot;</p>
</td>
</tr>
<tr><td><code>prependArgs</code> <B>[Обовʼязкове]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>prependArgs зберігає аргументи, такі як імена ресурсів тощо. Ці аргументи вставляються після імені аліасу.</p>
</td>
</tr>
<tr><td><code>appendArgs</code> <B>[Обовʼязкове]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>appendArgs зберігає аргументи, такі як імена ресурсів тощо. Ці аргументи додаються до USER_ARGS.</p>
</td>
</tr>
<tr><td><code>options</code> <B>[Обовʼязкове]</B><br/>
<a href="#kubectl-config-k8s-io-v1beta1-CommandOptionDefault"><code>[]CommandOptionDefault</code></a>
</td>
<td>
   <p>options призначений для зберігання визначень опцій аліаса. options змінює лише стандартні значення опцій, і якщо користувач явно вказує значення, використовується явно вказане значення.</p>
</td>
</tr>
</tbody>
</table>

## `CommandDefaults` {#kubectl-config-k8s-io-v1beta1-CommandDefaults}

**Зʼявляється в:**

- [Preference](#kubectl-config-k8s-io-v1beta1-Preference)

<p>CommandDefaults зберігає команди та повʼязані з ними стандартні значення опцій.</p>


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>command</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>command відноситься до команди, стандартне значення опції якої змінено.</p>
</td>
</tr>
<tr><td><code>options</code> <B>[Обовʼязкове]</B><br/>
<a href="#kubectl-config-k8s-io-v1beta1-CommandOptionDefault"><code>[]CommandOptionDefault</code></a>
</td>
<td>
   <p>options — це список опцій, що містять різні стандартні значення.</p>
</td>
</tr>
</tbody>
</table>

## `CommandOptionDefault` {#kubectl-config-k8s-io-v1beta1-CommandOptionDefault}

**Зʼявляється в:**

- [AliasOverride](#kubectl-config-k8s-io-v1beta1-AliasOverride)

- [CommandDefaults](#kubectl-config-k8s-io-v1beta1-CommandDefaults)

<p>CommandOptionDefault зберігає імʼя та вказане стандартне значення опції.</p>


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>Назва опції (повна форма, без тире).</p>
</td>
</tr>
<tr><td><code>default</code> <B>[Обовʼязкове]</B><br/>
<code>string</code>
</td>
<td>
   <p>Стандартні значення у форматі рядка. Вони будуть розібрані kubectl на сумісні значення опції.</p>
</td>
</tr>
</tbody>
</table>
