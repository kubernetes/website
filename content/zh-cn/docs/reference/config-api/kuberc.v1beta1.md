---
title: kuberc (v1beta1)
content_type: tool-reference
package: kubectl.config.k8s.io/v1beta1
---
<!--
title: kuberc (v1beta1)
content_type: tool-reference
package: kubectl.config.k8s.io/v1beta1
auto_generated: true
-->

<!--
## Resource Types 
-->
## 资源类型  {#resource-types}

- [Preference](#kubectl-config-k8s-io-v1beta1-Preference)

## `Preference`     {#kubectl-config-k8s-io-v1beta1-Preference}

<p>
<!--
Preference stores elements of KubeRC configuration file
-->
<code>Preference</code> 存储 KubeRC 配置文件的元素。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubectl.config.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Preference</code></td></tr>

<tr><td><code>defaults</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubectl-config-k8s-io-v1beta1-CommandDefaults"><code>[]CommandDefaults</code></a>
</td>
<td>
<p>
<!--
defaults allow changing default option values of commands.
This is especially useful, when user doesn't want to explicitly
set options each time.
-->
<code>defaults</code> 允许更改命令的默认选项值。
这对于用户不想每次明确设置选项时特别有用。
</p>
</td>
</tr>
<tr><td><code>aliases</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubectl-config-k8s-io-v1beta1-AliasOverride"><code>[]AliasOverride</code></a>
</td>
<td>
<p>
<!--
aliases allow defining command aliases for existing kubectl commands, with optional default option values.
If the alias name collides with a built-in command, built-in command always takes precedence.
Option overrides defined in the defaults section do NOT apply to aliases for the same command.
kubectl [ALIAS NAME] [USER_OPTIONS] [USER_EXPLICIT_ARGS] expands to
kubectl [COMMAND] # built-in command alias points to
[KUBERC_PREPEND_ARGS]
[USER_OPTIONS]
[KUBERC_OPTIONS] # rest of the options that are not passed by user in [USER_OPTIONS]
[USER_EXPLICIT_ARGS]
[KUBERC_APPEND_ARGS]
e.g.
-->
<code>aliases</code> 允许为现有的 kubectl 命令定义命令别名，并可选择设置默认选项值。
如果别名与内置命令冲突，内置命令始终优先。
在 <code>defaults</code> 部分定义的选项 <code>overrides</code> 不适用于同一命令的别名。
<code>kubectl [ALIAS NAME] [USER_OPTIONS] [USER_EXPLICIT_ARGS]</code> 展开为：

```bash
kubectl [COMMAND] # 别名指向的内置命令
        [KUBERC_PREPEND_ARGS]
        [USER_OPTIONS]
        [KUBERC_OPTIONS] # 其余未由用户在 [用户选项] 中传递的选项
        [USER_EXPLICIT_ARGS]
        [KUBERC_APPEND_ARGS]

```

例如：

 ```yaml
 - name: runx
   command: run
   options:
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
   options:
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

<tr><td><code>credentialPluginPolicy</code><br/>
<a href="#kubectl-config-k8s-io-v1beta1-CredentialPluginPolicy"><code>CredentialPluginPolicy</code></a>
</td>
<td>
<p>
<!--
credentialPluginPolicy specifies the policy governing which, if any, client-go
credential plugins may be executed. It MUST be one of { &quot;&quot;, &quot;AllowAll&quot;, &quot;DenyAll&quot;, &quot;Allowlist&quot; }.
If the policy is &quot;&quot;, then it falls back to &quot;AllowAll&quot; (this is required
to maintain backward compatibility). If the policy is DenyAll, no
credential plugins may run. If the policy is Allowlist, only those
plugins meeting the criteria specified in the <code>credentialPluginAllowlist</code>
field may run.
-->
<code>credentialPluginPolicy</code> 设置的是一种策略，控制可以执行 client-go 中的哪个凭证插件（如果有的话）。
它必须是 { &quot;&quot;，&quot;AllowAll&quot;，&quot;DenyAll&quot;，&quot;Allowlist&quot; } 中的一个。
如果策略是 &quot;&quot;，那么它会回退到 &quot;AllowAll&quot;（这是为了保持向后兼容性所必需的）。
如果策略是 DenyAll，不允许任何凭证插件运行。如果策略是 Allowlist，
只有符合 <code>credentialPluginAllowlist</code> 字段中指定标准的插件才能运行。
</p>
</td>
</tr>
<tr><td><code>credentialPluginAllowlist</code><br/>
<a href="#kubectl-config-k8s-io-v1beta1-AllowlistEntry"><code>[]AllowlistEntry</code></a>
</td>
<td>
<p>
<!--
Allowlist is a slice of allowlist entries. If any of them is a match,
then the executable in question may execute. That is, the result is the
logical OR of all entries in the allowlist. This list MUST NOT be
supplied if the policy is not &quot;Allowlist&quot;.
-->
`credentialPluginAllowlist` 是 AllowList 条目的列表。
如果其中任何一个条目匹配，则相关的可执行文件可以执行。
也就是说，结果是对 credentialPluginAllowList 列表中所有条目的逻辑“或”操作。
如果策略不是 &quot;Allowlist&quot;，则此列表**不得**提供。
</p>
<p>
<!--
e.g.
credentialPluginAllowlist:
-->
例如
credentialPluginAllowlist:
</p>
<ul>
<li>name: cloud-provider-plugin</li>
<li>name: /usr/local/bin/my-plugin
<!--
In the above example, the user allows the credential plugins
<code>cloud-provider-plugin</code> (found somewhere in PATH), and the plugin found
at the explicit path <code>/usr/local/bin/my-plugin</code>.
-->
在上面的例子中，用户允许凭证插件 <code>cloud-provider-plugin</code>
（在 PATH 中的某个位置找到），
以及在确定路径 <code>/usr/local/bin/my-plugin</code> 下找到的插件。
</li>
</ul>
</td>
</tr>

</tbody>
</table>

## `AliasOverride`     {#kubectl-config-k8s-io-v1beta1-AliasOverride}

<!--
**Appears in:**
-->
**出现在：**

- [Preference](#kubectl-config-k8s-io-v1beta1-Preference)

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
<code>command</code> 是要执行的单个或一组命令，例如 &quot;set env&quot; 或 &quot;create&quot;。
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
<tr><td><code>options</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubectl-config-k8s-io-v1beta1-CommandOptionDefault"><code>[]CommandOptionDefault</code></a>
</td>
<td>
<p>
<!--
options is allocated to store the option definitions of alias.
options only modify the default value of the option and if
user explicitly passes a value, explicit one is used.
-->
<code>options</code> 用于存储别名的选项定义。
<code>options</code> 只修改选项的默认值，如果用户显式传递一个值，则使用显式值。
</p>
</td>
</tr>
</tbody>
</table>

## `CommandDefaults`     {#kubectl-config-k8s-io-v1beta1-CommandDefaults}

<!--
**Appears in:**
-->
**出现在：**

- [Preference](#kubectl-config-k8s-io-v1beta1-Preference)

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
command refers to a command whose option's default value is changed.
-->
<code>command</code> 指向一个命令，其选项的默认值已更改。
</p>
</td>
</tr>
<tr><td><code>options</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubectl-config-k8s-io-v1beta1-CommandDefaults"><code>[]CommandDefaults</code></a>
</td>
<td>
<p>
<!--
options is a list of options storing different default values.
-->
<code>options</code> 是一个选项的列表，存储不同的默认值。
</p>
</td>
</tr>
</tbody>
</table>

## `CommandOptionDefault`     {#kubectl-config-k8s-io-v1beta1-CommandOptionDefault}

<!--
**Appears in:**
-->
**出现在：**

- [AliasOverride](#kubectl-config-k8s-io-v1beta1-AliasOverride)
- [CommandDefaults](#kubectl-config-k8s-io-v1beta1-CommandDefaults)

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
Option name (long form, without dashes).
-->
<code>option</code> 名称（长形式，不带破折号）。
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
by kubectl to the compatible value of the option.
-->
在默认值的字符串格式中。它将被 kubectl 解析为选项的兼容值。
</p>
</td>
</tr>
</tbody>
</table>

## `CredentialPluginPolicy`     {#kubectl-config-k8s-io-v1beta1-CredentialPluginPolicy}
    
<!--
(Alias of `string`)
-->
（`string` 的别名）

<!--
**Appears in:**
-->
**出现在：**

- [Preference](#kubectl-config-k8s-io-v1beta1-Preference)

<p>
<!--
CredentialPluginPolicy specifies the policy governing which, if any, client-go
credential plugins may be executed. It MUST be one of { &quot;&quot;, &quot;AllowAll&quot;, &quot;DenyAll&quot;, &quot;Allowlist&quot; }.
If the policy is &quot;&quot;, then it falls back to &quot;AllowAll&quot; (this is required
to maintain backward compatibility). If the policy is DenyAll, no
credential plugins may run. If the policy is Allowlist, only those
plugins meeting the criteria specified in the <code>credentialPluginAllowlist</code>
field may run. If the policy is not <code>Allowlist</code> but one is provided, it
is considered a configuration error.
-->
CredentialPluginPolicy 指定的是一种策略，控制执行哪些 client-go 凭证插件（如果有的话）。
取值必须是 { &quot;&quot;, &quot;AllowAll&quot;, &quot;DenyAll&quot;, &quot;Allowlist&quot; } 中的一个。
如果策略是 &quot;&quot;，那么它会回退到 &quot;AllowAll&quot;（这是为了保持向后兼容性所必需的）。
如果策略是 DenyAll，不允许任何凭证插件运行。
如果策略是 Allowlist，只有那些满足 <code>credentialPluginAllowlist</code>
字段中指定条件的插件才能运行。
如果策略不是 <code>Allowlist</code> 但是提供了 credentialPluginAllowList，将被视为配置错误。
</p>
