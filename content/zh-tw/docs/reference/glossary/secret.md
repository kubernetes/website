---
title: Secret
id: secret
date: 2018-04-12
full_link: /zh-cn/docs/concepts/configuration/secret/
short_description: >
  Secret 用於存儲敏感信息，如密碼、 OAuth 令牌和 SSH 密鑰。

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

 Secret 用於存儲敏感信息，如密碼、OAuth 令牌和 SSH 密鑰。

<!--more-->

<!--
Secrets give you more control over how sensitive information is used and reduces
the risk of accidental exposure. Secret values are encoded as base64 strings and
are stored unencrypted by default, but can be configured to be
[encrypted at rest](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted).
-->
Secret 允許使用者對如何使用敏感信息進行更多的控制，並減少信息意外暴露的風險。
默認情況下，Secret 值被編碼爲 base64 字符串並以非加密的形式存儲，但可以設定爲
[靜態加密（Encrypt at rest）](/zh-cn/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted)。

<!--
A {{< glossary_tooltip text="Pod" term_id="pod" >}} can reference the Secret in
a variety of ways, such as in a volume mount or as an environment variable.
Secrets are designed for confidential data and
[ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) are
designed for non-confidential data.
-->
{{< glossary_tooltip text="Pod" term_id="pod" >}} 可以通過多種方式引用 Secret，
例如在卷掛載中引用或作爲環境變量引用。Secret 設計用於機密數據，而
[ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
設計用於非機密數據。
