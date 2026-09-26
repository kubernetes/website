---
title: ボリュームプラグイン
id: volumeplugin
full_link:
short_description: >
  ボリュームプラグインにより、Pod内でストレージを統合できます。

aka:
tags:
- storage
---
ボリュームプラグインにより、{{< glossary_tooltip text="Pod" term_id="pod" >}}内でストレージを統合できます。

<!--more-->

ボリュームプラグインを使用すると、{{< glossary_tooltip text="Pod" term_id="pod" >}}で使用するストレージボリュームをアタッチしてマウントできます。
ボリュームプラグインは、*ツリー内*または*ツリー外*のいずれかです。
*ツリー内*プラグインはKubernetesのコードリポジトリの一部であり、そのリリースサイクルに従います。
*ツリー外*プラグインは独立して開発されます。