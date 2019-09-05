---
title: 推奨ラベル(Recommended Labels)
content_template: templates/concept
---

{{% capture overview %}}
ユーザーはkubectlやダッシュボード以外に、多くのツールでKubernetesオブジェクトの管理と可視化ができます。共通のラベルセットにより、全てのツールにおいて解釈可能な共通のマナーに沿ってオブジェクトを表現することで、ツールの相互運用を可能にします。

ツール化に対するサポートに加えて、推奨ラベルはクエリ可能な方法でアプリケーションを表現します。
{{% /capture %}}

{{% capture body %}}
メタデータは、_アプリケーション_ のコンセプトを中心に構成されています。KubernetesはPaaS(Platform as a Service)でなく、アプリケーションの公式な概念を持たず、またそれを強制することはありません。
そのかわり、アプリケーションは、非公式で、メタデータによって表現されています。単一のアプリケーションが有する項目に対する定義は厳密に決められていません。

{{< note >}}
ラベルには推奨ラベルというものがあります。それらのラベルはアプリケーションの管理を容易にします。しかしコア機能のツール化において必須のものではありません。
{{< /note >}}

共有されたラベルとアノテーションは、`app.kubernetes.io`という共通のプレフィックスを持ちます。プレフィックスの無いラベルはユーザーに対してプライベートなものになります。その共有されたプレフィックスは、共有ラベルがユーザーのカスタムラベルに干渉しないことを保証します。

## ラベル

これらの推奨ラベルの利点を最大限得るためには、全てのリソースオブジェクトに対して推奨ラベルが適用されるべきです。

| キー                                 | 説明           | 例  | 型 |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | アプリケーション名 | `mysql` | 文字列 |
| `app.kubernetes.io/instance`        | アプリケーションのインスタンスを特定するための固有名 | `wordpress-abcxzy` | 文字列 |
| `app.kubernetes.io/version`         | アプリケーションの現在のバージョン (例: セマンティックバージョン、リビジョンのハッシュなど) | `5.7.21` | 文字列 |
| `app.kubernetes.io/component`       | アーキテクチャ内のコンポーネント | `database` | 文字列 |
| `app.kubernetes.io/part-of`         | このアプリケーションによって構成される上位レベルのアプリケーション | `wordpress` | 文字列 |
| `app.kubernetes.io/managed-by`  | このアプリケーションの操作を管理するために使われているツール | `helm` | 文字列 |

これらのラベルが実際にどう使われているかを表すために、下記のStatefulSetのオブジェクトを考えましょう。

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: helm
```

## アプリケーションとアプリケーションのインスタンス

単一のアプリケーションは、Kubernetesクラスタ内で、いくつかのケースでは同一の名前空間に対して1回または複数回インストールされることがあります。  
例えば、WordPressは複数のウェブサイトがあれば、それぞれ別のWordPressが複数回インストールされることがあります。

アプリケーション名と、アプリケーションのインスタンス名はそれぞれ別に記録されます。  
例えば、WordPressは`app.kubernetes.io/name`に`wordpress`と記述され、インスタンス名に関しては`app.kubernetes.io/instance`に`wordpress-abcxzy`と記述されます。この仕組みはアプリケーションと、アプリケーションのインスタンスを特定可能にします。全てのアプリケーションインスタンスは固有の名前を持たなければなりません。

## ラベルの使用例
ここでは、ラベルの異なる使用例を示します。これらの例はそれぞれシステムの複雑さが異なります。

### シンプルなステートレスサービス

`Deployment`と`Service`オブジェクトを使って、シンプルなステートレスサービスをデプロイするケースを考えます。下記の2つのスニペットはラベルが最もシンプルな形式においてどのように使われるかをあらわします。

下記の`Deployment`は、アプリケーションを稼働させるポッドを管理するのに使われます。
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

下記の`Service`は、アプリケーションを公開するために使われます。
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

### データベースを使ったウェブアプリケーション

次にもう少し複雑なアプリケーションについて考えます。データベース(MySQL)を使ったウェブアプリケーション(WordPress)で、Helmを使ってインストールします。  
下記のスニペットは、このアプリケーションをデプロイするために使うオブジェクト設定の出だし部分です。

はじめに下記の`Deployment`は、WordPressのために使われます。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

下記の`Service`は、WordPressを公開するために使われます。

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```
MySQLは`StatefulSet`として公開され、MySQL自身と、MySQLが属する親アプリケーションのメタデータを持ちます。

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/version: "5.7.21"
...
```

この`Service`はMySQLをWordPressアプリケーションの一部として公開します。
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/version: "5.7.21"
...
```

MySQLの`StatefulSet`と`Service`により、MySQLとWordPressに関するより広範な情報が含まれていることに気づくでしょう。

{{% /capture %}}