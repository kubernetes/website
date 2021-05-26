---
title: JSONPathのサポート
content_type: concept
weight: 25
---

<!-- overview -->
kubectlはJSONPathのテンプレートをサポートしています。

<!-- body -->

JSONPathのテンプレートは、波括弧`{}`によって囲まれたJSONPathの式によって構成されています。
kubectlでは、JSONPathの式を使うことで、JSONオブジェクトの特定のフィールドをフィルターしたり、出力のフォーマットを変更することができます。
本来のJSONPathのテンプレートの構文に加え、以下の機能と構文が使えます:

1. JSONPathの式の内部でテキストをクォートするために、ダブルクォーテーションを使用します。
2. リストを反復するために、`range`、`end`オペレーターを使用します。
3. リストを末尾側から参照するために、負の数のインデックスを使用します。負の数のインデックスはリストを「周回」せず、`-index + listLength >= 0`が満たされる限りにおいて有効になります。

{{< note >}}

- 式は常にルートのオブジェクトから始まるので、`$`オペレーターの入力は任意になります。

- 結果のオブジェクトはString()関数を適用した形で表示されます。

{{< /note >}}

以下のようなJSONの入力が与えられたとします。

```json
{
  "kind": "List",
  "items":[
    {
      "kind":"None",
      "metadata":{"name":"127.0.0.1"},
      "status":{
        "capacity":{"cpu":"4"},
        "addresses":[{"type": "LegacyHostIP", "address":"127.0.0.1"}]
      }
    },
    {
      "kind":"None",
      "metadata":{"name":"127.0.0.2"},
      "status":{
        "capacity":{"cpu":"8"},
        "addresses":[
          {"type": "LegacyHostIP", "address":"127.0.0.2"},
          {"type": "another", "address":"127.0.0.3"}
        ]
      }
    }
  ],
  "users":[
    {
      "name": "myself",
      "user": {}
    },
    {
      "name": "e2e",
      "user": {"username": "admin", "password": "secret"}
    }
  ]
}
```

機能            | 説明               | 例                                                         | 結果
--------------------|---------------------------|-----------------------------------------------------------------|------------------
`text`              | プレーンテキスト             | `kind is {.kind}`                                               | `kind is List`
`@`                 | 現在のオブジェクト           | `{@}`                                                           | 入力した値と同じ値
`.` or `[]`         | 子要素                     | `{.kind}`, `{['kind']}` or `{['name\.type']}`                   | `List`
`..`                | 子孫要素を再帰的に探す        | `{..name}`                                                      | `127.0.0.1 127.0.0.2 myself e2e`
`*`                 | ワイルドカード。すべてのオブジェクトを取得する | `{.items[*].metadata.name}`                                     | `[127.0.0.1 127.0.0.2]`
`[start:end:step]` | 添字       | `{.users[0].name}`                                              | `myself`
`[,]`               | 和集合           | `{.items[*]['metadata.name', 'status.capacity']}`               | `127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]`
`?()`               | フィルター                   | `{.users[?(@.name=="e2e")].user.password}`                      | `secret`
`range`, `end`      | リストの反復             | `{range .items[*]}[{.metadata.name}, {.status.capacity}] {end}` | `[127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]`
`''`                | 解釈済みの文字列をクォートする | `{range .items[*]}{.metadata.name}{'\t'}{end}`                  | `127.0.0.1      127.0.0.2`

`kubectl`とJSONPathの式を使った例:

```shell
kubectl get pods -o json
kubectl get pods -o=jsonpath='{@}'
kubectl get pods -o=jsonpath='{.items[0]}'
kubectl get pods -o=jsonpath='{.items[0].metadata.name}'
kubectl get pods -o=jsonpath="{.items[*]['metadata.name', 'status.capacity']}"
kubectl get pods -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.startTime}{"\n"}{end}'
```

{{< note >}}
Windowsでは、空白が含まれるJSONPathのテンプレートをクォートする場合は(上記のようにシングルクォーテーションを使うのではなく)、ダブルクォーテーションを使わなければなりません。
また、テンプレート内のリテラルをクォートする際には、シングルクォーテーションか、エスケープされたダブルクォーテーションを使わなければなりません。例えば:

```cmd
kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.status.startTime}{'\n'}{end}"
kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{\"\t\"}{.status.startTime}{\"\n\"}{end}"
```
{{< /note >}}

{{< note >}}

JSONPathの正規表現はサポートされていません。正規表現を利用した検索を行いたい場合は、`jq`のようなツールを使ってください。

```shell
# kubectlはJSONpathの出力として正規表現をサポートしていないので、以下のコマンドは動作しない
kubectl get pods -o jsonpath='{.items[?(@.metadata.name=~/^test$/)].metadata.name}'

# 上のコマンドに期待される結果が欲しい場合、以下のコマンドを使うとよい
kubectl get pods -o json | jq -r '.items[] | select(.metadata.name | test("test-")).spec.containers[].image'
```
{{< /note >}}
