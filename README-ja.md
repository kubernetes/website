# Kubernetesのドキュメント

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

このリポジトリには、[KubernetesのWebサイトとドキュメント](https://kubernetes.io/)をビルドするために必要な全アセットが格納されています。貢献に興味を持っていただきありがとうございます！

- [ドキュメントに貢献する](#contributing-to-the-docs)
- [翻訳された`README.md`一覧](#localization-readmemds)

# リポジトリの使い方

Hugo(Extended version)を使用してWebサイトをローカルで実行することも、コンテナランタイムで実行することもできます。コンテナランタイムを使用することを強くお勧めします。これにより、本番Webサイトとのデプロイメントの一貫性が得られます。

## 前提条件

このリポジトリを使用するには、以下をローカルにインストールする必要があります。

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo(Extended version)](https://gohugo.io/)
- [Docker](https://www.docker.com/)などのコンテナランタイム

開始する前に、依存関係をインストールしてください。リポジトリのクローンを作成し、ディレクトリに移動します。

```
git clone https://github.com/kubernetes/website.git
cd website
```

KubernetesのWebサイトではDocsyというHugoテーマを使用しています。コンテナでWebサイトを実行する場合でも、以下を実行して、サブモジュールおよびその他の開発依存関係をプルすることを強くお勧めします。

```
# pull in the Docsy submodule
git submodule update --init --recursive --depth 1
```

## コンテナを使ってウェブサイトを動かす

コンテナ内でサイトを構築するには、以下を実行してコンテナイメージを構築し、実行します。

```
make container-image
make container-serve
```

お使いのブラウザにて http://localhost:1313 にアクセスしてください。リポジトリ内のソースファイルに変更を加えると、HugoがWebサイトの内容を更新してブラウザに反映します。

## Hugoを使ってローカル環境でWebサイトを動かす

[`netlify.toml`](netlify.toml#L10)ファイルに記述されている`HUGO_VERSION`と同じExtended versionのHugoをインストールするようにしてください。

ローカルでサイトを構築してテストするには、次のコマンドを実行します。

```bash
# install dependencies
npm ci
make serve
```

これで、Hugoのサーバーが1313番ポートを使って開始します。お使いのブラウザにて http://localhost:1313 にアクセスしてください。リポジトリ内のソースファイルに変更を加えると、HugoがWebサイトの内容を更新してブラウザに反映します。

## API reference pagesをビルドする

`content/en/docs/reference/kubernetes-api`に配置されているAPIリファレンスページは<https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>を使ってSwagger仕様書からビルドされています。

新しいKubernetesリリースのためにリファレンスページをアップデートするには、次の手順を実行します:

1. `api-ref-generator`サブモジュールをプルする:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. Swagger仕様書を更新する:

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. 新しいリリースの変更を反映するため、`api-ref-assets/config/`で`toc.yaml`と`fields.yaml`を適用する。

4. 次に、ページをビルドする:

   ```bash
   make api-reference
   ```

   コンテナイメージからサイトを作成・サーブする事でローカルで結果をテストすることができます:

   ```bash
   make container-image
   make container-serve
   ```

   APIリファレンスを見るために、ブラウザで<http://localhost:1313/docs/reference/kubernetes-api/>を開いてください。

5. 新しいコントラクトのすべての変更が設定ファイル`toc.yaml`と`fields.yaml`に反映されたら、新しく生成されたAPIリファレンスページとともにPull Requestを作成します。

## トラブルシューティング

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Hugoは、技術的な理由から2種類のバイナリがリリースされています。現在のウェブサイトは**Hugo Extended**バージョンのみに基づいて運営されています。[リリースページ](https://github.com/gohugoio/hugo/releases)で名前に「extended」が含まれるアーカイブを探します。確認するには、`hugo version`を実行し、「extended」という単語を探します。

### macOSにてtoo many open filesというエラーが表示される

macOS上で`make serve`を実行した際に以下のエラーが表示される場合

```
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

OS上で同時に開けるファイルの上限を確認してください。

`launchctl limit maxfiles`

続いて、以下のコマンドを実行します(https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c より引用)。

```
#!/bin/sh

# These are the original gist links, linking to my gists now.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

こちらはmacOSのCatalinaとMojaveで動作を確認しています。

## SIG Docsに参加する

[コミュニティのページ](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)をご覧になることで、SIG Docs Kubernetesコミュニティとの関わり方を学ぶことができます。

本プロジェクトのメンテナーには以下の方法で連絡することができます:

- [Slack](https://kubernetes.slack.com/messages/kubernetes-docs-ja)
- [メーリングリスト](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## ドキュメントに貢献する {#contributing-to-the-docs}

GitHubの画面右上にある**Fork**ボタンをクリックすると、お使いのGitHubアカウントに紐付いた本リポジトリのコピーが作成され、このコピーのことを*フォーク*と呼びます。フォークリポジトリの中ではお好きなように変更を加えていただいて構いません。加えた変更をこのリポジトリに追加したい任意のタイミングにて、フォークリポジトリからPull Reqeustを作成してください。

Pull Requestが作成されると、レビュー担当者が責任を持って明確かつ実用的なフィードバックを返します。Pull Requestの所有者は作成者であるため、**ご自身で作成したPull Requestを編集し、フィードバックに対応するのはご自身の役目です。**

また、状況によっては2人以上のレビュアーからフィードバックが返されたり、アサインされていないレビュー担当者からのフィードバックが来ることがある点もご注意ください。

さらに、特定のケースにおいては、レビュー担当者がKubernetesの技術的なレビュアーに対してレビューを依頼することもあります。レビュー担当者はタイムリーにフィードバックを提供するために最善を尽くしますが、応答時間は状況に応じて異なる場合があります。

Kubernetesのドキュメントへの貢献に関する詳細については以下のページをご覧ください:

* [Kubernetesのドキュメントへの貢献](https://kubernetes.io/ja/docs/contribute/)
* [ページコンテントタイプ](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [ドキュメントのスタイルガイド](https://kubernetes.io/docs/contribute/style/style-guide/)
* [Kubernetesドキュメントの翻訳方法](https://kubernetes.io/docs/contribute/localization/)

### New Contributor Ambassadors

コントリビュートする時に何か助けが必要なら、[New Contributor Ambassadors](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador)に聞いてみると良いでしょう。彼らはSIG Docsのapproverで、最初の数回のPull Requestを通して新しいコントリビューターを指導し助けることを責務としています。New Contributors Ambassadorsにコンタクトするには、[Kubernetes Slack](https://slack.k8s.io)が最適な場所です。現在のSIG DocsのNew Contributor Ambassadorは次の通りです:

| 名前                       | Slack                      | GitHub                     |                   
| -------------------------- | -------------------------- | -------------------------- |
| Arsh Sharma                | @arsh                      | @RinkiyaKeDad              |

## 翻訳された`README.md`一覧 {#localization-readmemds}

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
