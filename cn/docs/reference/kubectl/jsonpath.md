---
title: JSONPath 支持
cn-approvers:
- lichuqiang
---
<!--
---
title: JSONPath Support
---
-->

<!--
JSONPath template is composed of JSONPath expressions enclosed by {}.
And we add three functions in addition to the original JSONPath syntax:
-->
JSONPath 模板是由 {} 包围的 JSONPath 表达式所组成的。
我们在原有的 JSONPath 语法基础上增加了三个功能：

<!--
1. The `$` operator is optional since the expression always starts from the root object by default.
2. We can use `""` to quote text inside JSONPath expressions.
3. We can use `range` operator to iterate lists.
-->
1. 因为表达式总是默认地从根对象开始， 所以 `$` 操作符是可选的。
2. 我们可以在 JSONPath 表达式内部使用 `""` 来引用文本。
3. 我们可以使用 `range` 操作符来循环遍历列表。

<!--
The result object is printed as its String() function.
-->
结果对象按照其 String() 函数的形式进行打印输出。

<!--
Given the input:
-->
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

<!--
Function | Description        | Example            | Result
---------|--------------------|--------------------|------------------
text     | the plain text     | kind is {.kind}    | kind is List
@        | the current object | {@}                | the same as input
. or []  | child operator     | {.kind} or {['kind']}| List
..       | recursive descent  | {..name}           | 127.0.0.1 127.0.0.2 myself e2e
*        | wildcard. Get all objects| {.items[*].metadata.name} | [127.0.0.1 127.0.0.2]
[start:end :step] | subscript operator | {.users[0].name}| myself
[,]      | union operator     | {.items[*]['metadata.name', 'status.capacity']} | 127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]
?()      | filter             | {.users[?(@.name=="e2e")].user.password} | secret
range, end | iterate list | {range .items[*]}[{.metadata.name}, {.status.capacity}] {end} | [127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]
""       | quote interpreted string | {range .items[*]}{.metadata.name}{"\t"}{end} | 127.0.0.1    127.0.0.2
-->
功能      | 描述               | 示例                | 结果
---------|--------------------|--------------------|------------------
text     | 纯文本              | kind is {.kind}    | kind is List
@        | 当前对象            | {@}                | 与输入相同
. or []  | 子操作符            | {.kind} 或 {['kind']}| List
..       | 降序递归            | {..name}           | 127.0.0.1 127.0.0.2 myself e2e
*        | 通配符，获取所有对象  | {.items[*].metadata.name} | [127.0.0.1 127.0.0.2]
[start:end :step] | 下标操作符 | {.users[0].name}| myself
[,]      | 并运算符            | {.items[*]['metadata.name', 'status.capacity']} | 127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]
?()      | 过滤器             | {.users[?(@.name=="e2e")].user.password} | secret
range, end | 循环遍历列表      | {range .items[*]}[{.metadata.name}, {.status.capacity}] {end} | [127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]
""       | 引用转义字符串      | {range .items[*]}{.metadata.name}{"\t"}{end} | 127.0.0.1    127.0.0.2
