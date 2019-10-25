---
title: 永続ボリューム要求
id: persistent-volume-claim
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  ストレージ要求リソースは永続ボリュームで定義されているため、コンテナ内のボリュームとしてマウントできます。

aka: 
tags:
- core-object
- storage
---
 ストレージ要求リソースは永続ボリュームで定義されているため、コンテナ内のボリュームとしてマウントできます。

<!--more--> 

ストレージサイズ、ストレージへのアクセス制御（読み取り専用、読み取り/書き込み、排他的）、および再利用方法（保持、リサイクル、削除）を指定します。ストレージ自体の詳細は永続ボリュームの仕様にあります。

