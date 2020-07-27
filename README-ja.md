# Kubernetesのドキュメント

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-master-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

このリポジトリには、[KubernetesのWebサイトとドキュメント](https://kubernetes.io/)をビルドするために必要な全アセットが格納されています。貢献に興味を持っていただきありがとうございます！

## Hugoを使ってローカル環境でWebサイトを動かす

Hugoのインストール方法については[Hugoの公式ドキュメント](https://gohugo.io/getting-started/installing/)をご覧ください。このとき、[`netlify.toml`](netlify.toml#L10)ファイルに記述されている`HUGO_VERSION`と同じバージョンをインストールするようにしてください。

Hugoがインストールできたら、以下のコマンドを使ってWebサイトをローカル上で動かすことができます:

```bash
git clone https://github.com/kubernetes/website.git
cd website
git submodule update --init --recursive --depth 1
```

**注意:** Kubernetesのウェブサイトでは[DocsyというHugoのテーマ](https://github.com/google/docsy#readme)を使用しています。リポジトリを更新していない場合、 `website/themes/docsy`ディレクトリは空です。 このサイトはテーマのローカルコピーなしでは構築できません。

テーマをアップデートするには以下のコマンドを実行します:

```bash
git submodule update --init --recursive --depth 1
```

サイトをローカルでビルドしてテストするには以下のコマンドを実行します:

```bash
hugo server --buildFuture
```

これで、Hugoのサーバーが1313番ポートを使って開始します。お使いのブラウザにて http://localhost:1313 にアクセスしてください。リポジトリ内のソースファイルに変更を加えると、HugoがWebサイトの内容を更新してブラウザに反映します。

## SIG Docsに参加する

[コミュニティのページ](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)をご覧になることで、SIG Docs Kubernetesコミュニティとの関わり方を学ぶことができます。

本プロジェクトのメンテナーには以下の方法で連絡することができます:

- [Slack](https://kubernetes.slack.com/messages/kubernetes-docs-ja)
- [メーリングリスト](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## ドキュメントに貢献する

GitHubの画面右上にある**Fork**ボタンをクリックすると、お使いのGitHubアカウントに紐付いた本リポジトリのコピーが作成され、このコピーのことを*フォーク*と呼びます。フォークリポジトリの中ではお好きなように変更を加えていただいて構いません。加えた変更をこのリポジトリに追加したい任意のタイミングにて、フォークリポジトリからPull Reqeustを作成してください。

Pull Requestが作成されると、レビュー担当者が責任を持って明確かつ実用的なフィードバックを返します。Pull Requestの所有者は作成者であるため、**ご自身で作成したPull Requestを編集し、フィードバックに対応するのはご自身の役目です。**

また、状況によっては2人以上のレビュアーからフィードバックが返されたり、アサインされていないレビュー担当者からのフィードバックが来ることがある点もご注意ください。

さらに、特定のケースにおいては、レビュー担当者がKubernetesの技術的なレビュアーに対してレビューを依頼することもあります。レビュー担当者はタイムリーにフィードバックを提供するために最善を尽くしますが、応答時間は状況に応じて異なる場合があります。

Kubernetesのドキュメントへの貢献に関する詳細については以下のページをご覧ください:

* [Kubernetesのドキュメントへの貢献](https://kubernetes.io/ja/docs/contribute/)
* [ページコンテントタイプ](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [ドキュメントのスタイルガイド](https://kubernetes.io/docs/contribute/style/style-guide/)
* [Kubernetesドキュメントの翻訳方法](https://kubernetes.io/docs/contribute/localization/)

## 翻訳された`README.md`一覧

| Language  | Language |
|---|---|
|[中国語](README-zh.md)|[韓国語](README-ko.md)|
|[フランス語](README-fr.md)|[ポーランド語](README-pl.md)|
|[ドイツ語](README-de.md)|[ポルトガル語](README-pt.md)|
|[ヒンディー語](README-hi.md)|[ロシア語](README-ru.md)|
|[インドネシア語](README-id.md)|[スペイン語](README-es.md)|
|[イタリア語](README-it.md)|[ウクライナ語](README-uk.md)|
|[日本語](README-ja.md)|[ベトナム語](README-vi.md)|

### 行動規範

Kubernetesコミュニティへの参加については、[CNCFの行動規範](https://github.com/cncf/foundation/blob/master/code-of-conduct.md)によって管理されています。

## ありがとうございます！

Kubernetesはコミュニティの参加によって成長しています。Webサイトおよびドキュメンテーションへの皆さんの貢献に感謝します！
