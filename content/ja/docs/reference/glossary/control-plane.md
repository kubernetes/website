---
title: コントロールプレーン
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  コンテナのライフサイクルを定義、展開、管理するためのAPIとインターフェイスを公開するコンテナオーケストレーションレイヤーです。

aka:
tags:
- fundamental
---
 コンテナのライフサイクルを定義、展開、管理するためのAPIとインターフェイスを公開するコンテナオーケストレーションレイヤーです。

 <!--more-->

 このレイヤーは、次のような多くの異なるコンポーネントから構成されます(しかし、これらに限定はされません)。

 * {{< glossary_tooltip text="etcd" term_id="etcd" >}}
 * {{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="スケジューラー" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="コントローラーマネージャー" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="クラウドコントローラーマネージャー" term_id="cloud-controller-manager" >}}

 これらのコンポーネントは従来のオペレーティングシステムサービス(デーモン)もしくはコンテナとして実行できます。これらのコンポーネントを実行するホストは歴史的に{{< glossary_tooltip text="マスター" term_id="master" >}}と呼ばれていました。
