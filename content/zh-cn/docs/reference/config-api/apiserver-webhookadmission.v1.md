---
title: WebhookAdmission 配置 (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
---
<!--
title: WebhookAdmission Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: true
-->

<p>
<!--
Package v1 is the v1 version of the API.
-->
此 API 的版本是 v1。
</p>

<!--
## Resource Types 
-->
## 资源类型   {#resource-types}

- [WebhookAdmission](#apiserver-config-k8s-io-v1-WebhookAdmission)

## `WebhookAdmission`     {#apiserver-config-k8s-io-v1-WebhookAdmission}

<p>
<!--
WebhookAdmission provides configuration for the webhook admission controller.
-->
WebhookAdmission 为 Webhook 准入控制器提供配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>WebhookAdmission</code></td></tr>

<tr><td><code>kubeConfigFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
KubeConfigFile is the path to the kubeconfig file.
-->
字段 <code>kubeConfigFile</code> 包含指向 kubeconfig 文件的路径。
</p>
</td>
</tr>

<tr><td><code>staticManifestsDir</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   StaticManifestsDir is the path to a directory containing static webhook
configurations to be loaded at startup. Files with extensions .yaml,
.yml, and .json are read. Only admissionregistration.k8s.io/v1
ValidatingWebhookConfiguration and MutatingWebhookConfiguration
resources are supported.
Using this field requires the ManifestBasedAdmissionControlConfig
feature gate to be enabled.
-->
<code>staticManifestsDir</code>< 是一个目录路径，用于存放在启动时加载的静态 Webhook 配置文件。
会读取扩展名为 .yaml、.yml 和 .json 的文件。仅支持 admissionregistration.k8s.io/v1
ValidatingWebhookConfiguration 和 MutatingWebhookConfiguration 资源。
使用此字段需要启用 ManifestBasedAdmissionControlConfig 特性门控。
</p>
</td>
</tr>

</tbody>
</table>
