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

민감한 정보를 사용하는 방식에 대해 더 세밀하게 제어할 수 있으며, 우발적인 노출 위험을 줄인다. 시크릿 값은 기본적으로 base64 문자열로 인코딩되어 암호화되지 않은 채로 저장되지만, [안전하게 암호화](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted)되도록 설정할 수 있다. {{< glossary_tooltip text="파드" term_id="pod" >}}는 볼륨 마운트 내의 파일 형태로 시크릿에 접근하며, 시크릿은 또한 kubelet이 파드를 위해 이미지를 풀링할 때에도 사용될 수 있다. 시크릿은 기밀 데이터를 다루는 용도로 적합하며, [컨피그맵](/docs/tasks/configure-pod-container/configure-pod-configmap/)은 기밀이 아닌 데이터를 다루는 용도로 적합하다.
