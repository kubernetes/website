---
title: WebhookAdmission Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: true
---
Package v1 is the v1 version of the API.

## Resource Types 


- [WebhookAdmission](#apiserver-config-k8s-io-v1-WebhookAdmission)
  
    


## `WebhookAdmission`     {#apiserver-config-k8s-io-v1-WebhookAdmission}
    




WebhookAdmission provides configuration for the webhook admission controller.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>WebhookAdmission</code></td></tr>
    

  
  
<tr><td><code>kubeConfigFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   KubeConfigFile is the path to the kubeconfig file.</td>
</tr>
    
  
</tbody>
</table>
    
  
