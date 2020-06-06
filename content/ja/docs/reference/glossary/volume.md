---
title: ボリューム
id: volume
date: 2018-04-12
full_link: /docs/concepts/storage/volumes/
short_description: >
  ポッド内のコンテナからアクセス可能なデータを含むディレクトリ。

aka: 
tags:
- core-object
- fundamental
---
 {{< glossary_tooltip text="ポッド" term_id="pod" >}}内のコンテナからアクセス可能なデータを含むディレクトリ。

<!--more--> 

Kubernetesボリュームはボリュームを含む{{< glossary_tooltip text="ポッド" term_id="pod" >}}が存在する限り有効です。そのためボリュームは{{< glossary_tooltip text="ポッド" term_id="pod" >}}内で実行されるすべての{{< glossary_tooltip text="コンテナ" term_id="container" >}}よりも長持ちし、{{< glossary_tooltip text="コンテナ" term_id="container" >}}の再起動後もデータは保持されます。
