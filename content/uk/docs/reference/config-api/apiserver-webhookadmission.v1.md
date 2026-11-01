---
title: WebhookAdmission Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: false
---

Пакунок v1 є версією v1 API.

## Типи ресурсів {#resource-types}

- [WebhookAdmission](#apiserver-config-k8s-io-v1-WebhookAdmission)

## `WebhookAdmission` {#apiserver-config-k8s-io-v1-WebhookAdmission}

WebhookAdmission надає конфігурацію для контролера доступу на основі webhook.<

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>WebhookAdmission</code></td></tr>
<tr><td><code>kubeConfigFile</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>KubeConfigFile — це шлях до файлу kubeconfig.</p>
</td>
</tr>
<tr><td><code>staticManifestsDir</code><br/>
<code>string</code>
</td>
<td>
   <p>StaticManifestsDir — це шлях до теки, що містить статичні конфігурації webhook, які будуть завантажені під час запуску. Читаються файли з розширеннями .yaml, .yml та .json. Підтримуються лише ресурси ValidatingWebhookConfiguration та MutatingWebhookConfiguration з групи admissionregistration.k8s.io/v1. Використання цього поля вимагає увімкнення функціональної можливості ManifestBasedAdmissionControlConfig.</p>
</td>
</tr>
</tbody>
</table>
