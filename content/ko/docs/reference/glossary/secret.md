---
title: 시크릿(Secret)
id: secret
date: 2018-04-12
full_link: /ko/docs/concepts/configuration/secret/
short_description: >
  비밀번호, OAuth 토큰 및 ssh 키와 같은 민감한 정보를 저장한다.

aka: 
tags:
- core-object
- security
---
 비밀번호, OAuth 토큰 및 ssh 키와 같은 민감한 정보를 저장한다.

<!--more--> 

민감한 정보를 사용하는 방식에 대해 더 세밀하게 제어할 수 있으며, 유휴 상태의 [암호화](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted)를 포함하여 우발적인 노출 위험을 줄인다. {{< glossary_tooltip text="파드(Pod)" term_id="pod" >}}는 시크릿을 마운트된 볼륨의 파일로 참조하거나, 파드의 이미지를 풀링하는 kubelet이 시크릿을 참조한다. 시크릿은 기밀 데이터에 적합하고 [컨피그맵](/docs/tasks/configure-pod-container/configure-pod-configmap/)은 기밀이 아닌 데이터에 적합하다.
