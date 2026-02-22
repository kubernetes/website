---
title: kuberc (v1beta1)
content_type: tool-reference
package: kubectl.config.k8s.io/v1beta1
auto_generated: true
---


## Resource Types 


- [Preference](#kubectl-config-k8s-io-v1beta1-Preference)
  

## `Preference`     {#kubectl-config-k8s-io-v1beta1-Preference}
    


<p>Preference stores elements of KubeRC configuration file</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubectl.config.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Preference</code></td></tr>
    
  
<tr><td><code>defaults</code> <B>[Required]</B><br/>
<a href="#kubectl-config-k8s-io-v1beta1-CommandDefaults"><code>[]CommandDefaults</code></a>
</td>
<td>
   <p>defaults allow changing default option values of commands.
This is especially useful, when user doesn't want to explicitly
set options each time.</p>
</td>
</tr>
<tr><td><code>aliases</code> <B>[Required]</B><br/>
<a href="#kubectl-config-k8s-io-v1beta1-AliasOverride"><code>[]AliasOverride</code></a>
</td>
<td>
   <p>aliases allow defining command aliases for existing kubectl commands, with optional default option values.
If the alias name collides with a built-in command, built-in command always takes precedence.
Option overrides defined in the defaults section do NOT apply to aliases for the same command.
kubectl [ALIAS NAME] [USER_OPTIONS] [USER_EXPLICIT_ARGS] expands to
kubectl [COMMAND] # built-in command alias points to
[KUBERC_PREPEND_ARGS]
[USER_OPTIONS]
[KUBERC_OPTIONS] # rest of the options that are not passed by user in [USER_OPTIONS]
[USER_EXPLICIT_ARGS]
[KUBERC_APPEND_ARGS]
e.g.</p>
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
<li>custom-arg1
For example, if user invokes &quot;kubectl runx test-pod&quot; command,
this will be expanded to &quot;kubectl run --image=nginx test-pod -- custom-arg1&quot;</li>
</ul>
</li>
<li>name: getn
command: get
options:
<ul>
<li>name: output
default: wide
prependArgs:</li>
<li>node
&quot;kubectl getn control-plane-1&quot; expands to &quot;kubectl get node control-plane-1 --output=wide&quot;
&quot;kubectl getn control-plane-1 --output=json&quot; expands to &quot;kubectl get node --output=json control-plane-1&quot;</li>
</ul>
</li>
</ul>
</td>
</tr>
<tr><td><code>credentialPluginPolicy</code><br/>
<a href="#kubectl-config-k8s-io-v1beta1-CredentialPluginPolicy"><code>CredentialPluginPolicy</code></a>
</td>
<td>
   <p>credentialPluginPolicy specifies the policy governing which, if any, client-go
credential plugins may be executed. It MUST be one of { &quot;&quot;, &quot;AllowAll&quot;, &quot;DenyAll&quot;, &quot;Allowlist&quot; }.
If the policy is &quot;&quot;, then it falls back to &quot;AllowAll&quot; (this is required
to maintain backward compatibility). If the policy is DenyAll, no
credential plugins may run. If the policy is Allowlist, only those
plugins meeting the criteria specified in the <code>credentialPluginAllowlist</code>
field may run.</p>
</td>
</tr>
<tr><td><code>credentialPluginAllowlist</code><br/>
<a href="#kubectl-config-k8s-io-v1beta1-AllowlistEntry"><code>[]AllowlistEntry</code></a>
</td>
<td>
   <p>Allowlist is a slice of allowlist entries. If any of them is a match,
then the executable in question may execute. That is, the result is the
logical OR of all entries in the allowlist. This list MUST NOT be
supplied if the policy is not &quot;Allowlist&quot;.</p>
<p>e.g.
credentialPluginAllowlist:</p>
<ul>
<li>name: cloud-provider-plugin</li>
<li>name: /usr/local/bin/my-plugin
In the above example, the user allows the credential plugins
<code>cloud-provider-plugin</code> (found somewhere in PATH), and the plugin found
at the explicit path <code>/usr/local/bin/my-plugin</code>.</li>
</ul>
</td>
</tr>
</tbody>
</table>

## `AliasOverride`     {#kubectl-config-k8s-io-v1beta1-AliasOverride}
    

**Appears in:**

- [Preference](#kubectl-config-k8s-io-v1beta1-Preference)


<p>AliasOverride stores the alias definitions.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>name is the name of alias that can only include alphabetical characters
If the alias name conflicts with the built-in command,
built-in command will be used.</p>
</td>
</tr>
<tr><td><code>command</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>command is the single or set of commands to execute, such as &quot;set env&quot; or &quot;create&quot;</p>
</td>
</tr>
<tr><td><code>prependArgs</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>prependArgs stores the arguments such as resource names, etc.
These arguments are inserted after the alias name.</p>
</td>
</tr>
<tr><td><code>appendArgs</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>appendArgs stores the arguments such as resource names, etc.
These arguments are appended to the USER_ARGS.</p>
</td>
</tr>
<tr><td><code>options</code> <B>[Required]</B><br/>
<a href="#kubectl-config-k8s-io-v1beta1-CommandOptionDefault"><code>[]CommandOptionDefault</code></a>
</td>
<td>
   <p>options is allocated to store the option definitions of alias.
options only modify the default value of the option and if
user explicitly passes a value, explicit one is used.</p>
</td>
</tr>
</tbody>
</table>

## `AllowlistEntry`     {#kubectl-config-k8s-io-v1beta1-AllowlistEntry}
    

**Appears in:**

- [Preference](#kubectl-config-k8s-io-v1beta1-Preference)


<p>AllowlistEntry is an entry in the allowlist. For each allowlist item, at
least one field must be nonempty. A struct with all empty fields is
considered a misconfiguration error. Each field is a criterion for
execution. If multiple fields are specified, then the criteria of all
specified fields must be met. That is, the result of an individual entry is
the logical AND of all checks corresponding to the specified fields within
the entry.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name matching is performed by first resolving the absolute path of both
the plugin and the name in the allowlist entry using <code>exec.LookPath</code>. It
will be called on both, and the resulting strings must be equal. If
either call to <code>exec.LookPath</code> results in an error, the <code>Name</code> check
will be considered a failure.</p>
</td>
</tr>
</tbody>
</table>

## `CommandDefaults`     {#kubectl-config-k8s-io-v1beta1-CommandDefaults}
    

**Appears in:**

- [Preference](#kubectl-config-k8s-io-v1beta1-Preference)


<p>CommandDefaults stores the commands and their associated option's
default values.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>command</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>command refers to a command whose option's default value is changed.</p>
</td>
</tr>
<tr><td><code>options</code> <B>[Required]</B><br/>
<a href="#kubectl-config-k8s-io-v1beta1-CommandOptionDefault"><code>[]CommandOptionDefault</code></a>
</td>
<td>
   <p>options is a list of options storing different default values.</p>
</td>
</tr>
</tbody>
</table>

## `CommandOptionDefault`     {#kubectl-config-k8s-io-v1beta1-CommandOptionDefault}
    

**Appears in:**

- [AliasOverride](#kubectl-config-k8s-io-v1beta1-AliasOverride)

- [CommandDefaults](#kubectl-config-k8s-io-v1beta1-CommandDefaults)


<p>CommandOptionDefault stores the name and the specified default
value of an option.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Option name (long form, without dashes).</p>
</td>
</tr>
<tr><td><code>default</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>In a string format of a default value. It will be parsed
by kubectl to the compatible value of the option.</p>
</td>
</tr>
</tbody>
</table>

## `CredentialPluginPolicy`     {#kubectl-config-k8s-io-v1beta1-CredentialPluginPolicy}
    
(Alias of `string`)

**Appears in:**

- [Preference](#kubectl-config-k8s-io-v1beta1-Preference)


<p>CredentialPluginPolicy specifies the policy governing which, if any, client-go
credential plugins may be executed. It MUST be one of { &quot;&quot;, &quot;AllowAll&quot;, &quot;DenyAll&quot;, &quot;Allowlist&quot; }.
If the policy is &quot;&quot;, then it falls back to &quot;AllowAll&quot; (this is required
to maintain backward compatibility). If the policy is DenyAll, no
credential plugins may run. If the policy is Allowlist, only those
plugins meeting the criteria specified in the <code>credentialPluginAllowlist</code>
field may run. If the policy is not <code>Allowlist</code> but one is provided, it
is considered a configuration error.</p>



  