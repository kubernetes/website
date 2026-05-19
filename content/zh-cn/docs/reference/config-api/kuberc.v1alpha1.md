---
title: kuberc (v1alpha1)
content_type: tool-reference
package: kubectl.config.k8s.io/v1alpha1
---
<!--
title: kuberc (v1alpha1)
content_type: tool-reference
package: kubectl.config.k8s.io/v1alpha1
auto_generated: true
-->

<!--
## Resource Types 
-->
## 资源类型  {#resource-types}

- [Preference](#kubectl-config-k8s-io-v1alpha1-Preference)

## `Preference`     {#kubectl-config-k8s-io-v1alpha1-Preference}

<p>
<!--
Preference stores elements of KubeRC configuration file
-->
<code>Preference</code> 存储 KubeRC 配置文件的元素
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubectl.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Preference</code></td></tr>

<tr><td><code>overrides</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubectl-config-k8s-io-v1alpha1-CommandOverride"><code>[]CommandOverride</code></a>
</td>
<td>
<p>
<!--
overrides allows changing default flag values of commands.
This is especially useful, when user doesn't want to explicitly
set flags each time.
-->
<code>overrides</code> 允许更改命令的默认标志值。
这对于用户不想每次明确设置标志时特别有用。
</p>
</td>
</tr>
<tr><td><code>aliases</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubectl-config-k8s-io-v1alpha1-AliasOverride"><code>[]AliasOverride</code></a>
</td>
<td>
<p>
<!--
aliases allow defining command aliases for existing kubectl commands, with optional default flag values.
If the alias name collides with a built-in command, built-in command always takes precedence.
Flag overrides defined in the overrides section do NOT apply to aliases for the same command.
kubectl [ALIAS NAME] [USER_FLAGS] [USER_EXPLICIT_ARGS] expands to
kubectl [COMMAND] # built-in command alias points to
[KUBERC_PREPEND_ARGS]
[USER_FLAGS]
[KUBERC_FLAGS] # rest of the flags that are not passed by user in [USER_FLAGS]
[USER_EXPLICIT_ARGS]
[KUBERC_APPEND_ARGS]
e.g.
-->
<code>aliases</code> 允许为现有的 kubectl 命令定义命令别名，并可选择设置默认标志值。
如果别名与内置命令冲突，内置命令始终优先。
在 <code>overrides</code> 部分定义的标志覆盖不适用于同一命令的别名。
<code>kubectl [ALIAS NAME] [USER_FLAGS] [USER_EXPLICIT_ARGS]</code> 展开为：

```bash
kubectl [COMMAND] # 别名指向的内置命令
        [KUBERC_PREPEND_ARGS]
        [USER_FLAGS]
        [KUBERC_FLAGS] # 其余未由用户在 [用户标志] 中传递的标志
        [USER_EXPLICIT_ARGS]
        [KUBERC_APPEND_ARGS]

```

例如：

 ```yaml
 - name: runx
   command: run
   flags:
   - name: image
     default: nginx
   appendArgs:
   - --
   - custom-arg1
 ```

<!--
For example, if user invokes &quot;kubectl runx test-pod&quot; command,
this will be expanded to &quot;kubectl run --image=nginx test-pod -- custom-arg1&quot;
-->
例如，如果用户调用 <code>&quot;kubectl runx test-pod&quot;</code> 命令，
这将被展开为 <code>&quot;kubectl run --image=nginx test-pod -- custom-arg1&quot;</code>

 ```yaml
 - name: getn
   command: get
   flags:
   - name: output
     default: wide
   prependArgs:
   - node
 ```

<!--
&quot;kubectl getn control-plane-1&quot; expands to &quot;kubectl get node control-plane-1 --output=wide&quot;
&quot;kubectl getn control-plane-1 --output=json&quot; expands to &quot;kubectl get node --output=json control-plane-1&quot;
-->
<li><code>&quot;kubectl getn control-plane-1&quot; 扩展为 &quot;kubectl get node control-plane-1 --output=wide&quot;</code></li>
<li><code>&quot;kubectl getn control-plane-1 --output=json&quot; 扩展为 &quot;kubectl get node --output=json control-plane-1&quot;</code></li>
</td>
</tr>
</tbody>
</table>

## `AliasOverride`     {#kubectl-config-k8s-io-v1alpha1-AliasOverride}

<!--
**Appears in:**
-->
**出现在：**

- [Preference](#kubectl-config-k8s-io-v1alpha1-Preference)

<p>
<!--
AliasOverride stores the alias definitions.
-->
<code>AliasOverride</code> 存储别名定义。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
name is the name of alias that can only include alphabetical characters
If the alias name conflicts with the built-in command,
built-in command will be used.
-->
<code>name</code> 是别名的名称，只能包含字母字符。如果别名与内置命令冲突，
将使用内置命令。
</p>
</td>
</tr>
<tr><td><code>command</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
command is the single or set of commands to execute, such as &quot;set env&quot; or &quot;create&quot;
-->
<code>command</code> 是要执行的单个或一组命令，例如 &quot;set env&quot; 或 &quot;create&quot;
</p>
</td>
</tr>
<tr><td><code>prependArgs</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
<p>
<!--
prependArgs stores the arguments such as resource names, etc.
These arguments are inserted after the alias name.
-->
<code>prependArgs</code> 存储如资源名称等参数。
这些参数插入到别名名称之后。
</p>
</td>
</tr>
<tr><td><code>appendArgs</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
<p>
<!--
appendArgs stores the arguments such as resource names, etc.
These arguments are appended to the USER_ARGS.
-->
<code>appendArgs</code> 存储如资源名称等参数。
这些参数附加到 USER_ARGS 中。
</p>
</td>
</tr>
<tr><td><code>flags</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubectl-config-k8s-io-v1alpha1-CommandOptionDefault"><code>[]CommandOptionDefault</code></a>
</td>
<td>
<p>
<!--
flag is allocated to store the flag definitions of alias.
flags only modifies the default value of the flag and if
user explicitly passes a value, explicit one is used.
-->
<code>flags</code> 用于存储别名的标志定义。
<code>flags</code> 只修改标志的默认值，如果用户显式传递一个值，则使用显式值。
</p>
</td>
</tr>
</tbody>
</table>

## `CommandDefaults`     {#kubectl-config-k8s-io-v1alpha1-CommandDefaults}

<!--
**Appears in:**
-->
**出现在：**

- [Preference](#kubectl-config-k8s-io-v1alpha1-Preference)

<p>
<!--
CommandDefaults stores the commands and their associated option's
default values.
-->
<code>CommandDefaults</code> 存储命令及其关联参数的默认值。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>command</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
command refers to a command whose flag's default value is changed.
-->
<code>command</code> 指向一个命令，其标志的默认值已更改。
</p>
</td>
</tr>
<tr><td><code>flags</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubectl-config-k8s-io-v1alpha1-CommandDefaults"><code>[]CommandDefaults</code></a>
</td>
<td>
<p>
<!--
flags is a list of flags storing different default values.
-->
<code>flags</code> 是一个列表，存储不同的默认值。
</p>
</td>
</tr>
</tbody>
</table>

## `CommandOptionDefault`     {#kubectl-config-k8s-io-v1alpha1-CommandOptionDefault}

<!--
**Appears in:**
-->
**出现在：**

- [AliasOverride](#kubectl-config-k8s-io-v1alpha1-AliasOverride)

- [CommandDefaults](#kubectl-config-k8s-io-v1alpha1-CommandDefaults)

<p>
<!--
CommandOptionDefault stores the name and the specified default
value of an option.
-->
<code>CommandOptionDefault</code> 存储参数的名称和指定的默认值。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
Flag name (long form, without dashes).
-->
<code>flag</code> 名称（长形式，不带破折号）。
</p>
</td>
</tr>
<tr><td><code>default</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
In a string format of a default value. It will be parsed
by kubectl to the compatible value of the flag.
-->
在默认值的字符串格式中。它将被 kubectl 解析为标志的兼容值。
</p>
</td>
</tr>
</tbody>
</table>
