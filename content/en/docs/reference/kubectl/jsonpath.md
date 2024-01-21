---
title: JSONPath Support
content_type: concept
weight: 40
---

<!-- overview -->
Kubectl supports JSONPath template.


<!-- body -->

JSONPath template is composed of JSONPath expressions enclosed by curly braces {}.
Kubectl uses JSONPath expressions to filter on specific fields in the JSON object and format the output.
In addition to the original JSONPath template syntax, the following functions and syntax are valid:

1. Use double quotes to quote text inside JSONPath expressions.
2. Use the `range`, `end` operators to iterate lists.
3. Use negative slice indices to step backwards through a list. Negative indices do not "wrap around" a list and are valid as long as `-index + listLength >= 0`.

{{< note >}}

- The `$` operator is optional since the expression always starts from the root object by default.

- The result object is printed as its String() function.

{{< /note >}}

Given the JSON input:

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

Function            | Description                  | Example                                                         | Result
--------------------|------------------------------|-----------------------------------------------------------------|------------------
`text`              | the plain text               | `kind is {.kind}`                                               | `kind is List`
`@`                 | the current object           | `{@}`                                                           | the same as input
`.` or `[]`         | child operator               | `{.kind}`, `{['kind']}` or `{['name\.type']}`                   | `List`
`..`                | recursive descent            | `{..name}`                                                      | `127.0.0.1 127.0.0.2 myself e2e`
`*`                 | wildcard. Get all objects    | `{.items[*].metadata.name}`                                     | `[127.0.0.1 127.0.0.2]`
`[start:end:step]` | subscript operator           | `{.users[0].name}`                                              | `myself`
`[,]`               | union operator               | `{.items[*]['metadata.name', 'status.capacity']}`               | `127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]`
`?()`               | filter                       | `{.users[?(@.name=="e2e")].user.password}`                      | `secret`
`range`, `end`      | iterate list                 | `{range .items[*]}[{.metadata.name}, {.status.capacity}] {end}` | `[127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]`
`''`                | quote interpreted string     | `{range .items[*]}{.metadata.name}{'\t'}{end}`                  | `127.0.0.1      127.0.0.2`
`\`                 | escape termination character | `{.items[0].metadata.labels.kubernetes\.io/hostname}`           | `127.0.0.1`

Examples using `kubectl` and JSONPath expressions:

```shell
kubectl get pods -o json
kubectl get pods -o=jsonpath='{@}'
kubectl get pods -o=jsonpath='{.items[0]}'
kubectl get pods -o=jsonpath='{.items[0].metadata.name}'
kubectl get pods -o=jsonpath="{.items[*]['metadata.name', 'status.capacity']}"
kubectl get pods -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.startTime}{"\n"}{end}'
kubectl get pods -o=jsonpath='{.items[0].metadata.labels.kubernetes\.io/hostname}'
```

{{< note >}}
On Windows, you must _double_ quote any JSONPath template that contains spaces (not single quote as shown above for bash). This in turn means that you must use a single quote or escaped double quote around any literals in the template. For example:

```cmd
kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.status.startTime}{'\n'}{end}"
kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{\"\t\"}{.status.startTime}{\"\n\"}{end}"
```
{{< /note >}}

{{< note >}}

JSONPath regular expressions are not supported. If you want to match using regular expressions, you can use a tool such as `jq`.

```shell
# kubectl does not support regular expressions for JSONpath output
# The following command does not work
kubectl get pods -o jsonpath='{.items[?(@.metadata.name=~/^test$/)].metadata.name}'

# The following command achieves the desired result
kubectl get pods -o json | jq -r '.items[] | select(.metadata.name | test("test-")).metadata.name'
```
{{< /note >}}
