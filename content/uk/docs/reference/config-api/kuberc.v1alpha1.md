---
title: kuberc (v1alpha1)
content_type: tool-reference
package: kubectl.config.k8s.io/v1alpha1
auto_generated: true
---

## Типи ресурсів {#resource-types}

- [Preference](#kubectl-config-k8s-io-v1alpha1-preference)

## `Preference` {#kubectl-config-k8s-io-v1alpha1-preference}

Preference зберігає елементи конфігураційного файлу KubeRC

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubectl.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Preference</code></td></tr>

<tr><td><code>overrides</code> <b>[Обовʼязково]</b><br/>
<a href="#kubectl-config-k8s-io-v1alpha1-CommandDefaults"><code>[]CommandDefaults</code></a>
</td>
<td>
   <p>overrides дозволяє змінювати стандартні значення прапорців команд. Це особливо корисно, коли користувач не хоче кожного разу явно встановлювати прапорці.</p>
</td>
</tr>
<tr><td><code>aliases</code> <b>[Обовʼязково]</b><br/>
<a href="#kubectl-config-k8s-io-v1alpha1-aliasoverride"><code>[]AliasOverride</code></a>
</td>
<td>
   <p>aliases дозволяє визначати псевдоніми команд для наявних команд kubectl з необовʼязковими стандартними значеннями прапорців. Якщо імʼя аліасу збігається з вбудованою командою, вбудована команда завжди має пріоритет. Зміни прапорців, визначені в секції overrides, не застосовуються до аліасів для тієї ж команди. <tt>kubectl [ALIAS NAME] [USER_FLAGS] [USER_EXPLICIT_ARGS]</tt> розширюється до <tt>kubectl [COMMAND]</tt> # вбудований аліас команди вказує на <tt>[KUBERC_PREPEND_ARGS] [USER_FLAGS] [KUBERC_FLAGS]</tt> # решта прапорців, які не передані користувачем у <tt>[USER_FLAGS] [USER_EXPLICIT_ARGS] [KUBERC_APPEND_ARGS]</tt> наприклад.</p>
<ul>
<li>name: runx
command: run
flags:
<ul>
<li>name: image
default: nginx
appendArgs:</li>
</ul>
<hr>
<ul>
<li>custom-arg1,
Наприклад, якщо користувач викликає команду &quot;kubectl runx test-pod&quot;, її буде розширено до &quot;kubectl run --image=nginx test-pod -- custom-arg1&quot;</li>
</ul>
</li>
<li>name: getn
command: get
flags:
<ul>
<li>name: output
default: wide
prependArgs:</li>
<li>node
&quot;kubectl getn control-plane-1&quot; розширюється до &quot;kubectl get node control-plane-1 --output=wide&quot;
&quot;kubectl getn control-plane-1 --output=json&quot; розширюється до &quot;kubectl get node --output=json control-plane-1&quot;</li>
</ul>
</li>
</ul>
</td>
</tr>
</tbody>
</table>

## `AliasOverride`{#kubectl-config-k8s-io-v1alpha1-aliasoverride}

**Зʼявляється в:**

- [Preference](#kubectl-config-k8s-io-v1alpha1-preference)

AliasOverride зберігає визначення аліасів.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>name</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>name — це імʼя аліасу, яке може містити лише алфавітні символи. Якщо імʼя аліасу суперечить вбудованій команді, буде використано вбудовану команду.</p>
</td>
</tr>
<tr><td><code>command</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>command — це одна або кілька команд для виконання, такі як &quot;set env&quot; або &quot;create&quot;.</p>
</td>
</tr>
<tr><td><code>prependArgs</code> <b>[Обовʼязково]</b><br/>
<code>[]string</code>
</td>
<td>
   <p>prependArgs зберігає аргументи, такі як імена ресурсів тощо. Ці аргументи вставляються після імені аліасу.</p>
</td>
</tr>
<tr><td><code>appendArgs</code> <b>[Обовʼязково]</b><br/>
<code>[]string</code>
</td>
<td>
   <p>appendArgs зберігає аргументи, такі як імена ресурсів тощо. Ці аргументи додаються до USER_ARGS.</p>
</td>
</tr>
<tr><td><code>flags</code> <b>[Обовʼязково]</b><br/>
<a href="#kubectl-config-k8s-io-v1alpha1-CommandOptionDefault"><code>[]CommandOptionDefault</code></a>
</td>
<td>
   <p>flags призначено для зберігання визначень прапорців аліасів. flags лише змінює стандартне значення прапорця, і якщо користувач явно передає значення, то використовується явне значення.</p>
</td>
</tr>
</tbody>
</table>

## `CommandDefaults` {#kubectl-config-k8s-io-v1alpha1-CommandDefaults}

**Зʼявляється в:**

- [Preference](#kubectl-config-k8s-io-v1alpha1-preference)

CommandDefaults зберігає команди та повʼязані з ними стандартні значення прапорців.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>command</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>command — це команда, для якої змінюється стандартне значення прапорця.</p>
</td>
</tr>
<tr><td><code>flags</code> <b>[Обовʼязково]</b><br/>
<a href="#kubectl-config-k8s-io-v1alpha1-CommandOptionDefault"><code>[]CommandOptionDefault</code></a>
</td>
<td>
   <p>flags — це список прапорців, які зберігають різні стандартні значення.</p>
</td>
</tr>
</tbody>
</table>

## `CommandOptionDefault` {#kubectl-config-k8s-io-v1alpha1-CommandOptionDefault}

**Зʼявляється в:**

- [AliasOverride](#kubectl-config-k8s-io-v1alpha1-aliasoverride)

- [CommandDefaults](#kubectl-config-k8s-io-v1alpha1-CommandDefaults)

CommandOptionDefault зберігає імʼя та вказане стандартне значення прапорця.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>name</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>Імʼя прапорця (дослівна форма, без дефісів).</p>
</td>
</tr>
<tr><td><code>default</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>У форматі рядка стандартне значення. Воно буде проаналізовано kubectl до сумісного значення прапорця.</p>
</td>
</tr>
</tbody>
</table>
