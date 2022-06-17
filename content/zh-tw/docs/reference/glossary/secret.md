---
title: Secret
id: secret
date: 2018-04-12
full_link: /zh-cn/docs/concepts/configuration/secret/
short_description: >
  Secret 用於儲存敏感資訊，如密碼、 OAuth 令牌和 SSH 金鑰。

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

 Secret 用於儲存敏感資訊，如密碼、 OAuth 令牌和 SSH 金鑰。

<!--more--> 

<!--
Allows for more control over how sensitive information is used and reduces the risk of accidental exposure. Secret values are encoded as base64 strings and stored unencrypted by default, but can be configured to be [encrypted at rest](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted). A {{< glossary_tooltip text="Pod" term_id="pod" >}} references the secret as a file in a volume mount or by the kubelet pulling images for a pod. Secrets are great for confidential data and [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) for non-confidential data.
-->

Secret 允許使用者對如何使用敏感資訊進行更多的控制，並減少資訊意外暴露的風險。
預設情況下，Secret 值被編碼為 base64 字串並以非加密的形式儲存，但可以配置為
[靜態加密（Encrypt at rest）](/zh-cn/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted)。
{{< glossary_tooltip text="Pod" term_id="pod" >}} 透過掛載卷中的檔案的方式引用 Secret，或者透過 kubelet 為 pod 拉取映象時引用。
Secret 非常適合機密資料使用，而 [ConfigMaps](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/) 適用於非機密資料。
