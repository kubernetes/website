---
title: 永続ボリューム要求
id: persistent-volume-claim
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  コンテナ内でボリュームとしてマウントするためにPersistentVolume内で定義されたストレージリソースを要求します。

aka: 
tags:
- core-object
- storage
---
 コンテナ内でボリュームとしてマウントするためにPersistentVolume内で定義されたストレージリソースを要求します。

<!--more--> 

ストレージサイズ、ストレージへのアクセス制御（読み取り専用、読み取り/書き込み、排他的）、および再利用方法（保持、リサイクル、削除）を指定します。ストレージ自体の詳細はPersistentVolumeの仕様にあります。

