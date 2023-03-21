---
title: Service
id: service
date: 2018-04-12
full_link: /ja/docs/concepts/services-networking/service/
short_description: >
  Podの集合で実行されているアプリケーションをネットワークサービスとして公開する方法。
tags:
- fundamental
- core-object
---
クラスター内で1つ以上の{{< glossary_tooltip text="Pod" term_id="pod" >}}として実行されているネットワークアプリケーションを公開する方法です。

<!--more-->

Serviceが対象とするPodの集合は、(通常){{< glossary_tooltip text="セレクター" term_id="selector" >}}によって決定されます。
Podを追加または削除するとセレクターにマッチしているPodの集合は変更されます。
Serviceは、ネットワークトラフィックが現在そのワークロードを処理するPodの集合に向かうことを保証します。

Kubernetes Serviceは、IPネットワーキング(IPv4、IPv6、またはその両方)を使用するか、ドメインネームシステム(DNS)でExternal Nameを参照します。

Serviceの抽象化により、IngressやGatewayなどの他のメカニズムを実現することができます。