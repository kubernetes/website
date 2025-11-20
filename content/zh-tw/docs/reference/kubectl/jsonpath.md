---
title: JSONPath 支持
content_type: concept
weight: 40
math: true
---
<!--
title: JSONPath Support
content_type: concept
weight: 40
math: true
-->

<!-- overview -->

<!--
The {{< glossary_tooltip term_id="kubectl" text="kubectl" >}} tool supports JSONPath templates as an output format.
-->
{{< glossary_tooltip term_id="kubectl" text="kubectl" >}}
工具支持 JSONPath 模板作爲輸出格式。

<!-- body -->

<!--
A _JSONPath template_ is composed of JSONPath expressions enclosed by curly braces: `{` and `}`.
Kubectl uses JSONPath expressions to filter on specific fields in the JSON object and format the output.
In addition to the original JSONPath template syntax, the following functions and syntax are valid:
-->
**JSONPath 模板**由大括號 `{` 和 `}` 包起來的 JSONPath 表達式組成。
kubectl 使用 JSONPath 表達式來過濾 JSON 對象中的特定字段並格式化輸出。
除了原始的 JSONPath 模板語法，以下函數和語法也是有效的:

<!--
1. Use double quotes to quote text inside JSONPath expressions.
2. Use the `range`, `end` operators to iterate lists.
3. Use negative slice indices to step backwards through a list.  
   Negative indices do _not_ "wrap around" a list and are valid as long as \\( ( - index + listLength ) \ge 0 \\).
-->
1. 使用雙引號將 JSONPath 表達式內的文本引起來。
2. 使用 `range`，`end` 運算符來迭代列表。
3. 使用負片索引後退列表。負索引**不會**“環繞”列表，
   並且只要 \\( ( - index + listLength ) \ge 0 \\) 就有效。

{{< note >}}
<!--
- The `$` operator is optional since the expression always starts from the root object by default.

- The result object is printed as its `String()` function.
-->
- `$` 運算符是可選的，因爲預設情況下表達式總是從根對象開始。

- 結果對象將作爲其 `String()` 函數輸出。

{{< /note >}}

<!--
## Functions in Kubernetes JSONPath {#functions}
-->
## Kubernetes JSONPath 中的函數   {#functions}

<!--
Given the JSON input:
-->
給定 JSON 輸入:

```json
{
  "kind": "List",
  "items":[
    {
      "kind":"None",
      "metadata":{
        "name":"127.0.0.1",
        "labels":{
          "kubernetes.io/hostname":"127.0.0.1"
        }
      },
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

<!--
{{< table caption="Functions, their parameters, an example invocation, and the result" >}}
Function | Description | Example | Result
---------|-------------|---------|-------
`text` | the plain text | `kind is {.kind}` | `kind is List`
`@` | the current object | `{@}` | the same as input
`.` or `[]` | child operator | `{.kind}`, `{['kind']}` or `{['name\.type']}` | `List`
`..` | recursive descent | `{..name}` | `127.0.0.1 127.0.0.2 myself e2e`
`*` | wildcard. Get all objects | `{.items[*].metadata.name}` | `[127.0.0.1 127.0.0.2]`
`[start:end:step]` | subscript operator | `{.users[0].name}` | `myself`
`[,]` | union operator | `{.items[*]['metadata.name', 'status.capacity']}` | `127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]`
`?()` | filter | `{.users[?(@.name=="e2e")].user.password}` | `secret`
`range`, `end` | iterate list | `{range .items[*]}[{.metadata.name}, {.status.capacity}] {end}` | `[127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]`
`''` | quote interpreted string | `{range .items[*]}{.metadata.name}{'\t'}{end}` | `127.0.0.1      127.0.0.2`
`\` | escape termination character | `{.items[0].metadata.labels.kubernetes\.io/hostname}` | `127.0.0.1`
{{< /table >}}
-->
{{< table caption="函數、相關參數、調用示例和結果" >}}
函數 | 描述 | 示例 | 結果
----|-----|------|----
`text` | 純文本 | `kind is {.kind}` | `kind is List`
`@` | 當前對象 | `{@}` | 與輸入相同
`.` 或 `[]` | 子運算符 | `{.kind}`、`{['kind']}` 或 `{['name\.type']}` | `List`
`..` | 遞歸下降 | `{..name}` | `127.0.0.1 127.0.0.2 myself e2e`
`*` | 通配符。獲取所有對象 | `{.items[*].metadata.name}` | `[127.0.0.1 127.0.0.2]`
`[start:end:step]` | 下標運算符 | `{.users[0].name}` | `myself`
`[,]` | 並集運算符 | `{.items[*]['metadata.name', 'status.capacity']}` | `127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]`
`?()` | 過濾 | `{.users[?(@.name=="e2e")].user.password}` | `secret`
`range`，`end` | 迭代列表 | `{range .items[*]}[{.metadata.name}, {.status.capacity}] {end}` | `[127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]`
`''` | 引用解釋執行字符串 | `{range .items[*]}{.metadata.name}{'\t'}{end}` | `127.0.0.1      127.0.0.2`
`\` | 轉義終止符 | `{.items[0].metadata.labels.kubernetes\.io/hostname}` | `127.0.0.1`
{{< /table >}}

<!--
## Using JSONPath expressions with kubectl {#use-with-kubectl}
-->
## 通過 kubectl 使用 JSONPath 表達式   {#use-with-kubectl}

<!--
Examples using `kubectl` and JSONPath expressions:
-->
使用 `kubectl` 和 JSONPath 表達式的示例：

```shell
kubectl get pods -o json
kubectl get pods -o=jsonpath='{@}'
kubectl get pods -o=jsonpath='{.items[0]}'
kubectl get pods -o=jsonpath='{.items[0].metadata.name}'
kubectl get pods -o=jsonpath="{.items[*]['metadata.name', 'status.capacity']}"
kubectl get pods -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.startTime}{"\n"}{end}'
kubectl get pods -o=jsonpath='{.items[0].metadata.labels.kubernetes\.io/hostname}'
```

<!--
Or, with a "my_pod" and "my_namespace" (adjust these names to your environment):
-->
或者，使用 "my_pod" 和 "my_namespace"（調整這些名稱適應你的環境）：

```shell
kubectl get pod/my_pod -n my_namespace -o=jsonpath='{@}'
kubectl get pod/my_pod -n my_namespace -o=jsonpath='{.metadata.name}'
kubectl get pod/my_pod -n my_namespace -o=jsonpath='{.status}'
```

{{< note >}}
<!--
On Windows, you must _double_ quote any JSONPath template that contains spaces (not single quote as shown above for bash). This in turn means that you must use a single quote or escaped double quote around any literals in the template. For example:
-->
在 Windows 上，對於任何包含空格的 JSONPath 模板，你必須使用**雙**引號（不是上面 bash 所示的單引號）。
反過來，這意味着你必須在模板中的所有文字周圍使用單引號或轉義的雙引號。例如：

```cmd
kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.status.startTime}{'\n'}{end}"
kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{\"\t\"}{.status.startTime}{\"\n\"}{end}"
```
{{< /note >}}

<!--
## Regular expressions in JSONPath

JSONPath regular expressions are not supported. If you want to match using regular expressions, you can use a tool such as `jq`.
-->
## JSONPath 中的正則表達式  {#regular-expression-in-jsonpath}

不支持 JSONPath 正則表達式。如需使用正則表達式進行匹配操作，你可以使用如 `jq` 之類的工具。

<!--
```shell
# kubectl does not support regular expressions for JSONpath output
# The following command does not work
kubectl get pods -o jsonpath='{.items[?(@.metadata.name=~/^test$/)].metadata.name}'

# The following command achieves the desired result
kubectl get pods -o json | jq -r '.items[] | select(.metadata.name | test("test-")).metadata.name'
```
-->
```shell
# kubectl 的 JSONpath 輸出不支持正則表達式
# 下面的命令不會生效
kubectl get pods -o jsonpath='{.items[?(@.metadata.name=~/^test$/)].metadata.name}'

# 下面的命令可以獲得所需的結果
kubectl get pods -o json | jq -r '.items[] | select(.metadata.name | test("test-")).metadata.name'
```
