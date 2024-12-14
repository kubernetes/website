---
title: Security Context
id: security-context
date: 2018-04-12
full_link: /ja/docs/tasks/configure-pod-container/security-context/
short_description: >
  `securityContext`フィールドは、Podまたはコンテナの権限とアクセス制御の設定を定義します。

aka: 
tags:
- security
---
 `securityContext`フィールドは、{{< glossary_tooltip text="Pod" term_id="pod" >}}または{{< glossary_tooltip text="コンテナ" term_id="container" >}}の権限とアクセス制御の設定を定義します。

<!--more-->

`securityContext`では、プロセスを実行するユーザー、プロセスを実行するグループ、および権限の設定を定義できます。
また、セキュリティポリシー(例：SELinux、AppArmor、seccomp)も設定できます。

`PodSpec.securityContext`の設定内容は、Pod内のすべてのコンテナに適用されます。
