---
タイトル リミットレンジ
アイドル: リミットレンジ
日付: 2019-04-15
フルリンク：  ドキュメント/コンセプト/ポリシー/リミットレンジ/ /docs/concepts/policy/limit-range/
短い説明 >
  名前空間内のコンテナまたはPodごとのリソース消費を制限する制約を提供します。

別名 
タグを使用します：
- コアオブジェクト
- 基本
- アーキテクチャ
関連する
 - ポッド
 - コンテナ

---
 名前空間内の {{< glossary_tooltip text=「Containers」 term_id=「container」 >}} または {{< glossary_tooltip text=「Pods」 term_id=「pod」 >}} ごとのリソース消費を制限する制約を提供します。

<!--もっと見る-->
限界範囲 は、タイプによって作成できるオブジェクトの量を制限します、 
また、名前空間内の個々の {{< glossary_tooltip text=「Containers」 term_id=「container」 >}} または {{< glossary_tooltip text=「Pods」 term_id=「pod」 >}} が要求/消費できる計算リソースの量も制限します。