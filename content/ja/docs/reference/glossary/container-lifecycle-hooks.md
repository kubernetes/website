---
title: コンテナライフサイクルフック
id: container-lifecycle-hooks
date: 2018-10-08
full_link: /ja/docs/concepts/containers/container-lifecycle-hooks/
short_description: >
  ライフサイクルフックは、コンテナ管理のライフサイクルにおけるイベントを公開し、イベントが発生したときにユーザーがコードを実行できるようにします。

aka:
tags:
- extension
---
  ライフサイクルフックは、{{< glossary_tooltip text="コンテナ" term_id="container" >}}管理のライフサイクルにおけるイベントを公開し、イベントが発生したときにユーザーがコードを実行できるようにします。

<!--more-->

コンテナには2つのフックが公開されています。PostStartはコンテナが作成された直後に実行され、PreStopはコンテナが終了する直前に呼ばれるブロッキングです。
