---
title: 호스트에일리어스(HostAlias)
id: HostAliases
date: 2019-01-31
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  호스트에일리어스는 파드의 hosts 파일에 주입될 IP 주소와 호스트네임간의 매핑이다. 

aka:
tags:
- operation
---
호스트에일리어스는 {{< glossary_tooltip text="파드" term_id="pod" >}}의 hosts 파일에 주입될 IP 주소와 호스트네임간의 매핑이다.

<!--more-->

[호스트에일리어스](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core)은 명시된 경우에만 파드의 hosts 파일에 주입되는 호스트네임 및 IP 주소의 선택적 목록이다. 이는 hostNetwork 모드를 사용하고 있지 않은 파드에서만 유효하다.
