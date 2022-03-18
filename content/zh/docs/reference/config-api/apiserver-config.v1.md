---
title: kube-apiserver 配置 (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: true
---
<!--
title: kube-apiserver Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: true
-->

<!--
<p>Package v1 is the v1 version of the API.</p>
-->

<p>v1 包中包含 API 的 v1 版本。</p>

<!--
## Resource Types
-->
## 资源类型

- [AdmissionConfiguration](#apiserver-config-k8s-io-v1-AdmissionConfiguration)

## `AdmissionConfiguration`     {#apiserver-config-k8s-io-v1-AdmissionConfiguration}

<!--
<p>AdmissionConfiguration provides versioned configuration for admission controllers.</p>
-->
<p>AdmissionConfiguration 为准入控制器提供版本化的配置。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AdmissionConfiguration</code></td></tr>

<tr><td><code>plugins</code><br/>
<a href="#apiserver-config-k8s-io-v1-AdmissionPluginConfiguration"><code>[]AdmissionPluginConfiguration</code></a>
</td>
<td>
  <!--
   <p>Plugins allows specifying a configuration per admission control plugin.</p>
   -->
  <p><code>plugins</code> 字段允许为每个准入控制插件设置配置选项。</p>
</td>
</tr>

</tbody>
</table>

## `AdmissionPluginConfiguration`     {#apiserver-config-k8s-io-v1-AdmissionPluginConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [AdmissionConfiguration](#apiserver-config-k8s-io-v1-AdmissionConfiguration)

<!--
<p>AdmissionPluginConfiguration provides the configuration for a single plug-in.</p>
-->
<p>AdmissionPluginConfiguration 为某个插件提供配置信息。</p>

<table class="table">
<thead><tr><th width="30%"><!-- Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
   <p>Name is the name of the admission controller.
It must match the registered admission plugin name.</p>
  -->
  <p><code>name</code> 是准入控制器的名称。它必须与所注册的准入插件名称匹配。</p>
</td>
</tr>

<tr><td><code>path</code><br/>
<code>string</code>
</td>
<td>
  <!--
  <p>Path is the path to a configuration file that contains the plugin's
configuration</p>
  -->
  <p><code>path</code> 是指向包含插件配置信息的配置文件的路径。</p>
</td>
</tr>

<tr><td><code>configuration</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
</td>
<td>
  <!--
   <p>Configuration is an embedded configuration object to be used as the plugin's
configuration. If present, it will be used instead of the path to the configuration file.</p>
  -->
  <p><code>configuration</code> 是一个内嵌的配置对象，用来保存插件的配置信息。
  如果存在，则使用这里的配置信息而不是指向配置文件的路径。</p>
</td>
</tr>

</tbody>
</table>

