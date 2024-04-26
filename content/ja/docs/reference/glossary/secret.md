---
title: Secret
id: secret
date: 2018-04-12
full_link: /ja/docs/concepts/configuration/secret/
short_description: >
  パスワードやOAuthトークン、SSHキーのような機密の情報を保持します。

aka: 
tags:
- core-object
- security
---
 パスワードやOAuthトークン、SSHキーのような機密の情報を保持します。

<!--more--> 

Secretは、機密情報の使用方法をより管理しやすくし、偶発的な漏洩のリスクを減らすことができます。Secretの値はbase64文字列としてエンコードされ、デフォルトでは暗号化されずに保存されますが、[保存時に暗号化](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted)するように設定することもできます。

{{< glossary_tooltip text="Pod" term_id="pod" >}}は、ボリュームマウントや環境変数など、さまざまな方法でSecretを参照できます。Secretは機密データ用に設計されており、[ConfigMap](/ja/docs/tasks/configure-pod-container/configure-pod-configmap/)は非機密データ用に設計されています。