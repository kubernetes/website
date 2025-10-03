---
title: kuberc (v1alpha1)
content_type: tool-reference
package: kubectl.config.k8s.io/v1alpha1
auto_generated: true
---


## Resource Types 


- [Preference](#kubectl-config-k8s-io-v1alpha1-Preference)
  

## `Preference`     {#kubectl-config-k8s-io-v1alpha1-Preference}
    


<p>Preference stores elements of KubeRC configuration file</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubectl.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Preference</code></td></tr>
    
  
<tr><td><code>overrides</code> <B>[Required]</B><br/>
<a href="#kubectl-config-k8s-io-v1alpha1-CommandDefaults"><code>[]CommandDefaults</code></a>
</td>
<td>
   <p>overrides allows changing default flag values of commands.
This is especially useful, when user doesn't want to explicitly
set flags each time.</p>
</td>
</tr>
<tr><td><code>aliases</code> <B>[Required]</B><br/>
<a href="#kubectl-config-k8s-io-v1alpha1-AliasOverride"><code>[]AliasOverride</code></a>
</td>
<td>
   <p>aliases allow defining command aliases for existing kubectl commands, with optional default flag values.
If the alias name collides with a built-in command, built-in command always takes precedence.
Flag overrides defined in the overrides section do NOT apply to aliases for the same command.
kubectl [ALIAS NAME] [USER_FLAGS] [USER_EXPLICIT_ARGS] expands to
kubectl [COMMAND] # built-in command alias points to
[KUBERC_PREPEND_ARGS]
[USER_FLAGS]
[KUBERC_FLAGS] # rest of the flags that are not passed by user in [USER_FLAGS]
[USER_EXPLICIT_ARGS]
[KUBERC_APPEND_ARGS]
e.g.</p>
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
<li>custom-arg1
For example, if user invokes &quot;kubectl runx test-pod&quot; command,
this will be expanded to &quot;kubectl run --image=nginx test-pod -- custom-arg1&quot;</li>
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
&quot;kubectl getn control-plane-1&quot; expands to &quot;kubectl get node control-plane-1 --output=wide&quot;
&quot;kubectl getn control-plane-1 --output=json&quot; expands to &quot;kubectl get node --output=json control-plane-1&quot;</li>
</ul>
</li>
</ul>
</td>
</tr>
</tbody>
</table>

## `AliasOverride`     {#kubectl-config-k8s-io-v1alpha1-AliasOverride}
    

**Appears in:**

- [Preference](#kubectl-config-k8s-io-v1alpha1-Preference)


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
<tr><td><code>flags</code> <B>[Required]</B><br/>
<a href="#kubectl-config-k8s-io-v1alpha1-CommandOptionDefault"><code>[]CommandOptionDefault</code></a>
</td>
<td>
   <p>flags is allocated to store the flag definitions of alias.
flags only modifies the default value of the flag and if
user explicitly passes a value, explicit one is used.</p>
</td>
</tr>
</tbody>
</table>

## `CommandDefaults`     {#kubectl-config-k8s-io-v1alpha1-CommandDefaults}
    

**Appears in:**

- [Preference](#kubectl-config-k8s-io-v1alpha1-Preference)


<p>CommandDefaults stores the commands and their associated option's
default values.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>command</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>command refers to a command whose flag's default value is changed.</p>
</td>
</tr>
<tr><td><code>flags</code> <B>[Required]</B><br/>
<a href="#kubectl-config-k8s-io-v1alpha1-CommandOptionDefault"><code>[]CommandOptionDefault</code></a>
</td>
<td>
   <p>flags is a list of flags storing different default values.</p>
</td>
</tr>
</tbody>
</table>

## `CommandOptionDefault`     {#kubectl-config-k8s-io-v1alpha1-CommandOptionDefault}
    

**Appears in:**

- [AliasOverride](#kubectl-config-k8s-io-v1alpha1-AliasOverride)

- [CommandDefaults](#kubectl-config-k8s-io-v1alpha1-CommandDefaults)


<p>CommandOptionDefault stores the name and the specified default
value of an option.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Flag name (long form, without dashes).</p>
</td>
</tr>
<tr><td><code>default</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>In a string format of a default value. It will be parsed
by kubectl to the compatible value of the flag.</p>
</td>
</tr>
</tbody>
</table>
  