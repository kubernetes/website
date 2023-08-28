---
title: WebhookAdmission 配置 (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: true
---

<!--
title: WebhookAdmission Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: true
-->

<!--
<p>Package v1 is the v1 version of the API.</p>

## Resource Types 
-->
<p>此 API 的版本是 v1。</p>

## 资源类型   {#resource-types}

- [WebhookAdmission](#apiserver-config-k8s-io-v1-WebhookAdmission)

## `WebhookAdmission`     {#apiserver-config-k8s-io-v1-WebhookAdmission}

<!--
<p>WebhookAdmission provides configuration for the webhook admission controller.</p>
-->
<p>WebhookAdmission 为 Webhook 准入控制器提供配置信息。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>WebhookAdmission</code></td></tr>
    
  
<tr><td><code>kubeConfigFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--<p>KubeConfigFile is the path to the kubeconfig file.</p>-->
   <p>字段 kubeConfigFile 包含指向 kubeconfig 文件的路径。</p>
</td>
</tr>
    
</tbody>
</table>

