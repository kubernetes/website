---
title: JSONPath 支持
---

<!-- ---
title: JSONPath Support
--- -->

<!-- JSONPath template is composed of JSONPath expressions enclosed by {}.
And we add three functions in addition to the original JSONPath syntax: -->

JSONPath 模板由 {} 包起来的 JSONPath 表达式组成。
除了原始的 JSONPath 语法之外，我们还添加了三个函数：

<!-- 1. The `$` operator is optional since the expression always starts from the root object by default.
2. We can use `""` to quote text inside JSONPath expressions.
3. We can use `range` operator to iterate lists.
4. We can use negative slice indices to step backwards through a list. Negative indices do not "wrap around" a list. They are valid as long as `-index + listLength >= 0`. -->

1. `$` 运算符是可选的，因为表达式默认情况下始终从根对象开始。
2. 可以使用 `""` 来引用 JSONPath 表达式中的文本。
3. 可以使用 `range` 运算符来遍历列表。
4. 可以使用负切片索引来反向遍历列表。负索引并不会遍历完列表。它们只需要满足 `-index + listLength >= 0` 便可执行。


<!-- The result object is printed as its String() function. -->
结果对象使用 String() 函数打印。

<!-- Given the input: -->
给定输入：

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

<!-- Function | Description        | Example            | Result
---------|--------------------|--------------------|------------------
text     | the plain text     | kind is {.kind}    | kind is List
@        | the current object | {@}                | the same as input
. or []  | child operator     | {.kind} or {['kind']}| List
..       | recursive descent  | {..name}           | 127.0.0.1 127.0.0.2 myself e2e
\*        | wildcard. Get all objects| {.items[*].metadata.name} | [127.0.0.1 127.0.0.2]
[start:end :step] | subscript operator | {.users[0].name}| myself
[,]      | union operator     | {.items[*]['metadata.name', 'status.capacity']} | 127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]
?()      | filter             | {.users[?(@.name=="e2e")].user.password} | secret
range, end | iterate list | {range .items[*]}[{.metadata.name}, {.status.capacity}] {end} | [127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]
''       | quote interpreted string | {range .items[*]}{.metadata.name}{'\t'}{end} | 127.0.0.1    127.0.0.2 -->

函数      | 描述                | 示例                | 结果
---------|--------------------|--------------------|------------------
text     | 纯文本              | kind is {.kind}    | kind 是 List
@        | 当前对象            | {@}                | 与输入相同
. or []  | 子运算符             | {.kind} or {['kind']}| List
..       | 递归下降  | {..name}           | 127.0.0.1 127.0.0.2 myself e2e
\*        | 通配符，获取所有对象| {.items[*].metadata.name} | [127.0.0.1 127.0.0.2]
[start:end :step] | 下标运算符 | {.users[0].name}| myself
[,]      | 并集运算符     | {.items[*]['metadata.name', 'status.capacity']} | 127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]
?()      | 过滤器             | {.users[?(@.name=="e2e")].user.password} | secret
range, end | 遍历列表 | {range .items[*]}[{.metadata.name}, {.status.capacity}] {end} | [127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]
''       | 引用解释字符串 | {range .items[*]}{.metadata.name}{'\t'}{end} | 127.0.0.1    127.0.0.2

<!-- Below are some examples using jsonpath: -->
下面是使用 jsonpath 的一些例子：

```shell
$ kubectl get pods -o json
$ kubectl get pods -o=jsonpath='{@}'
$ kubectl get pods -o=jsonpath='{.items[0]}'
$ kubectl get pods -o=jsonpath='{.items[0].metadata.name}'
$ kubectl get pods -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.startTime}{"\n"}{end}'
```

<!-- On Windows, you must _double_ quote any JSONPath template that contains spaces (not single quote as shown above for bash). This in turn means that you must use a single quote or escaped double quote around any literals in the template. For example: -->

在 Windows 上，你必须要 _双_ 引号（而不是上面 bash 例子中的单引号）来引用包含空格符的任何 JSONPath 模板。
这也意味着，如果你要用字面值，必须要使用单引号或者转义双引号。例如：

```cmd
C:\> kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.status.startTime}{'\n'}{end}"
C:\> kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{\"\t\"}{.status.startTime}{\"\n\"}{end}"
```
