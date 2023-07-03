---
title: 시크릿(Secret)
id: secret
date: 2018-04-12
full_link: /ko/docs/concepts/configuration/secret/
short_description: >
  비밀번호, OAuth 토큰 및 SSH 키와 같은 민감한 정보를 저장한다.

aka: 
tags:
- core-object
- security
---
 비밀번호, OAuth 토큰 및 SSH 키와 같은 민감한 정보를 저장한다.

<!--more--> 

시크릿을 사용하면 민감한 정보가 사용되는 방법을 더 잘 통제할 수 있으며,
실수로 외부에 노출되는 위험도 줄일 수 있다.
시크릿 값은 base64 문자열로 인코딩되며 기본적으로는 평문으로 저장되지만,
[암호화하여 저장](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted)하도록 설정할 수도 있다.

{{< glossary_tooltip text="파드" term_id="pod" >}}는 볼륨을 마운트하거나 혹은 환경 변수를 통하는 등
다양한 방식으로 시크릿을 참조할 수 있다.
시크릿은 기밀 데이터를 다루는 용도로 적합하며,
[컨피그맵](/docs/tasks/configure-pod-container/configure-pod-configmap/)은
기밀이 아닌 데이터를 다루는 용도로 적합하다.