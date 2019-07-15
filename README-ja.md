# Kubernetesのドキュメント

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

ようこそ！このリポジトリには、[KubernetesのWebサイトとドキュメント](https://kubernetes.io/)をビルドするために必要な全アセットが格納されています。貢献に興味を持っていただきありがとうございます！

## ドキュメントに貢献する

GitHubの画面右上にある**Fork**ボタンをクリックすると、お使いのGitHubアカウントに紐付いた本リポジトリのコピーが作成され、このコピーのことを*フォーク*と呼びます。フォークリポジトリの中ではお好きなように変更を加えていただいて構いません。加えた変更をこのリポジトリに追加したい任意のタイミングにて、フォークリポジトリからPull Reqeustを作成してください。

Pull Requestが作成されると、レビュー担当者が責任を持って明確かつ実用的なフィードバックを返します。
Pull Requestの所有者は作成者であるため、**ご自身で作成したPull Requestを編集し、フィードバックに対応するのはご自身の役目です。**
また、状況によっては2人以上のレビュアーからフィードバックが返されたり、アサインされていないレビュー担当者からのフィードバックが来ることがある点もご注意ください。
さらに、特定のケースにおいては、レビュー担当者が[Kubernetes tech reviewer](https://github.com/kubernetes/website/wiki/Tech-reviewers)に対してレビューを依頼することもあります。
レビュー担当者はタイムリーにフィードバックを提供するために最善を尽くしますが、応答時間は状況に応じて異なる場合があります。

Kubernetesのドキュメントへの貢献に関する詳細については以下のページをご覧ください:

* [貢献のはじめ方](https://kubernetes.io/docs/contribute/start/)
* [ドキュメントの変更をステージする](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [ページテンプレートの使い方](http://kubernetes.io/docs/contribute/style/page-templates/)
* [ドキュメントのスタイルガイド](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Kubernetesドキュメントの翻訳方法](https://kubernetes.io/docs/contribute/localization/)

## Dockerを使ってローカル環境でWebサイトを動かす

ローカル環境で本ページを動かすのに推奨される方法は、静的サイトジェネレータの[Hugo](https://gohugo.io)を動かすのに特化した[Docker](https://docker.com)イメージを使うことです。

> Windows上で環境を作る場合は[Chocolatey](https://chocolatey.org)を使ってインストール可能な追加のツールが必要になります。 `choco install make`

> Dockerを使わずに環境を構築したい場合は、[Hugoをローカル環境で動かす](#hugoをローカル環境で動かす)をご覧ください。

既に[Dockerが動いている環境](https://www.docker.com/get-started)であれば、以下のコマンドを使って`kubernetes-hugo`イメージをローカルでビルドします:

```bash
make docker-image
```

イメージが作成されたら、以下のコマンドを使ってWebサイトをローカル上で動かすことができます:

```bash
make docker-serve
```

お使いのブラウザにて http://localhost:1313 にアクセスすることでWebサイトが開きます。リポジトリ内のソースファイルに変更を加えると、HugoがWebサイトの内容を更新してブラウザに反映します。

## Hugoをローカル環境で動かす

Hugoのインストール方法については[Hugoの公式ドキュメント](https://gohugo.io/getting-started/installing/)をご覧ください。このとき、[`netlify.toml`](netlify.toml#L9)ファイルに記述されている`HUGO_VERSION`と同じバージョンをインストールするようにしてください。

Hugoがインストールできたら、以下のコマンドを使ってWebサイトをローカル上で動かすことができます:

```bash
make serve
```

これで、Hugoのサーバーが1313番ポートを使って開始します。 お使いのブラウザにて http://localhost:1313 にアクセスしてください。リポジトリ内のソースファイルに変更を加えると、HugoがWebサイトの内容を更新してブラウザに反映します。

## コミュニティ内での議論、貢献、サポートなどについて

[コミュニティのページ](http://kubernetes.io/community/)をご覧になることで、Kubernetesコミュニティとの関わり方を学ぶことができます。

本プロジェクトのメンテナーには以下の方法で連絡することができます:

- [Slack](https://kubernetes.slack.com/messages/kubernetes-docs-ja)
- [メーリングリスト](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### 行動規範

Kubernetesコミュニティへの参加については、[Kubernetesの行動規範](code-of-conduct.md)によって管理されています。

## ありがとうございます！

Kubernetesはコミュニティの参加によって成長しています。Webサイトおよびドキュメンテーションへの皆さんの貢献に感謝します！
