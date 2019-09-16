---
title: JSONPath 支持
---

JSONPath 模板由 {} 包起来的 JSONPath 表达式组成。
除了原始的 JSONPath 语法之外，我们还添加了三个函数：

1. `$` 运算符是可选的，因为表达式默认情况下始终从根对象开始。
2. 我们可以使用 `""` 来引用 JSONPath 表达式中的文本。
3. 我们可以使用 `range` 运算符来迭代列表。

结果对象使用 String() 函数打印。

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
| 函数                  | 描述         | 示例                                         | 结果                                         |
| ------------------- | ---------- | ------------------------------------------ | ------------------------------------------ |
| `text`              | 纯文本        | `kind is {.kind}`                          | `kind is List`                             |
| `@`                 | 当前对象       | `{@}`                                      | 与输入相同                                    |
| `.` 或者 `[]`         | 子运算符       | `{.kind}` 或者 `{['kind']}`                  | `List`                                     |
| `..`                | 递归下降       | `{..name}`                                 | `127.0.0.1 127.0.0.2 myself e2e`           |
| `*`                 | 通配符，获取所有对象 | `{.items[*].metadata.name}`                | `[127.0.0.1 127.0.0.2]`                    |
| `[start:end :step]` | 下标运算符      | `{.users[0].name}`                         | `myself`                                   |
| `[,]`               | 并集运算符      | `{.items[*]['metadata.name', 'status.capacity']}` | `127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]` |
| `?()`               | 过滤         | `{.users[?(@.name=="e2e")].user.password}` | `secret`                                   |
| `range`, `end`      | 迭代列表       | `{range .items[*]}[{.metadata.name}, {.status.capacity}] {end}` | `[127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]` |
| `''`                | 引用解释执行字符串  | `{range .items[*]}{.metadata.name}{'\t'}{end}` | `127.0.0.1    127.0.0.2`                   |
