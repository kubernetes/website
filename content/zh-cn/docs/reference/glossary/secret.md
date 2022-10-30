---
title: Secret
id: secret
date: 2018-04-12
full_link: /zh-cn/docs/concepts/configuration/secret/
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
 Stores sensitive information, such as passwords, OAuth tokens, and SSH keys.
-->

 Secret 用于存储敏感信息，如密码、OAuth 令牌和 SSH 密钥。

<!--more-->

<!--
Secrets give you more control over how sensitive information is used and reduces
the risk of accidental exposure. Secret values are encoded as base64 strings and
are stored unencrypted by default, but can be configured to be
[encrypted at rest](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted).
-->
Secret 允许用户对如何使用敏感信息进行更多的控制，并减少信息意外暴露的风险。
默认情况下，Secret 值被编码为 base64 字符串并以非加密的形式存储，但可以配置为
[静态加密（Encrypt at rest）](/zh-cn/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted)。

<!--
A {{< glossary_tooltip text="Pod" term_id="pod" >}} can reference the Secret in
a variety of ways, such as in a volume mount or as an environment variable.
Secrets are designed for confidential data and
[ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) are
designed for non-confidential data.
-->
{{< glossary_tooltip text="Pod" term_id="pod" >}} 可以通过多种方式引用 Secret，
例如在卷挂载中引用或作为环境变量引用。Secret 设计用于机密数据，而
[ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
设计用于非机密数据。
