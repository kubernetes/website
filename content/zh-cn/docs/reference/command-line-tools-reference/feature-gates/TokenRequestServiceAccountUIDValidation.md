---
title: TokenRequestServiceAccountUIDValidation
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.34"
---

<!--
This is used to ensure that the UID provided in the TokenRequest matches
the UID of the ServiceAccount for which the token is being requested.
It helps prevent misuse of the TokenRequest API by ensuring that
tokens are only issued for the correct ServiceAccount.
-->
此特性门控用于确保 TokenRequest 中提供的 UID 与正在请求令牌的 ServiceAccount UID 一致。  
此特性门控有助于防止滥用 TokenRequest API，确保令牌只会签发给正确的 ServiceAccount。
