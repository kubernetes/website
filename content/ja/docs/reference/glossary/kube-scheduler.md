---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /docs/reference/generated/kube-scheduler/
short_description: >
  マスター上で動くコンポーネントで、まだノードに紐付けられていない新規に作成されたPodを見張り、稼働させるべきノードを選択します。

aka: 
tags:
- architecture
---
 マスター上で動くコンポーネントで、まだノードに紐付けられていない新規に作成されたPodを見張り、稼働させるべきノードを選択します。

<!--more--> 

スケジューリングで考慮される要因は個別、集合的なものを含んでおり、ハードウェア/ソフトウェア/ポリシーの制約、アフィニティ、アンチアフィニティ設定、データの保存位置関係、稼働しているワークロードごとの干渉と処理完了期限があります。

