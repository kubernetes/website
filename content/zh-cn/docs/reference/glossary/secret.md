---
title: Secret
id: secret
date: 2018-04-12
full_link: /zh/docs/concepts/configuration/secret/
short_description: >
  Secret 用于存储敏感信息，如密码、 OAuth 令牌和 SSH 密钥。

aka: 
tags:
- core-object
- security
---

<!--
---
title: Secret
id: secret
date: 2018-04-12
full_link: /docs/concepts/configuration/secret/
short_description: >
  Stores sensitive information, such as passwords, OAuth tokens, and ssh keys.

aka: 
tags:
- core-object
- security
---
-->

<!--
 Stores sensitive information, such as passwords, OAuth tokens, and ssh keys.
-->

 Secret 用于存储敏感信息，如密码、 OAuth 令牌和 SSH 密钥。

<!--more--> 

<!--
Allows for more control over how sensitive information is used and reduces the risk of accidental exposure. Secret values are encoded as base64 strings and stored unencrypted by default, but can be configured to be [encrypted at rest](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted). A {{< glossary_tooltip text="Pod" term_id="pod" >}} references the secret as a file in a volume mount or by the kubelet pulling images for a pod. Secrets are great for confidential data and [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) for non-confidential data.
-->

Secret 允许用户对如何使用敏感信息进行更多的控制，并减少信息意外暴露的风险。
默认情况下，Secret 值被编码为 base64 字符串并以非加密的形式存储，但可以配置为
[静态加密（Encrypt at rest）](/zh/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted)。
{{< glossary_tooltip text="Pod" term_id="pod" >}} 通过挂载卷中的文件的方式引用 Secret，或者通过 kubelet 为 pod 拉取镜像时引用。
Secret 非常适合机密数据使用，而 [ConfigMaps](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/) 适用于非机密数据。
