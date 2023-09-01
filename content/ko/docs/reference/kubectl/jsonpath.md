---
title: JSONPath 지원
content_type: concept
weight: 40
---

<!-- overview -->
Kubectl은 JSONPath 템플릿을 지원한다.


<!-- body -->

JSONPath 템플릿은 중괄호 {}로 둘러싸인 JSONPath 표현식으로 구성된다.
Kubectl은 JSONPath 표현식을 사용하여 JSON 오브젝트의 특정 필드를 필터링하고 출력 형식을 지정한다.
원본 JSONPath 템플릿 구문 외에도 다음과 같은 기능과 구문이 유효하다.

1. 큰따옴표를 사용하여 JSONPath 표현식 내부의 텍스트를 인용한다.
2. 목록을 반복하려면 `range`, `end` 오퍼레이터를 사용한다.
3. 목록에서 뒤로 이동하려면 negative slice 인덱스를 사용한다. negative 인덱스는 목록을 "순환(wrap around)" 하지 않으며, `-index + listLength >= 0` 인 한 유효하다.

{{< note >}}

- 표현식은 항상 루트 오브젝트에서 시작하므로 `$` 오퍼레이터는 선택 사항이다.

- 결과 오브젝트는 String() 함수로 출력된다.

{{< /note >}}

JSON 입력 시 다음과 같다.

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

Function            | Description               | Example                                                         | Result
--------------------|---------------------------|-----------------------------------------------------------------|------------------
`text`              | 일반 텍스트               | `kind is {.kind}`                                               | `kind is List`
`@`                 | 현재 오브젝트              | `{@}`                                                           | 입력과 동일
`.` or `[]`         | 자식 오퍼레이터            | `{.kind}`, `{['kind']}` or `{['name\.type']}`                   | `List`
`..`                | 재귀 하향(recursive descent)| `{..name}`                                                      | `127.0.0.1 127.0.0.2 myself e2e`
`*`                 | 와일드 카드. 모든 오브젝트 가져오기 | `{.items[*].metadata.name}`                                     | `[127.0.0.1 127.0.0.2]`
`[start:end:step]`  | 아래 첨자 오퍼레이터       | `{.users[0].name}`                                              | `myself`
`[,]`               | 조합 오퍼레이터             | `{.items[*]['metadata.name', 'status.capacity']}`               | `127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]`
`?()`               | 필터                      | `{.users[?(@.name=="e2e")].user.password}`                      | `secret`
`range`, `end`      | 반복 목록                 | `{range .items[*]}[{.metadata.name}, {.status.capacity}] {end}` | `[127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]`
`''`                | 해석된 문자열 인용  | `{range .items[*]}{.metadata.name}{'\t'}{end}`                  | `127.0.0.1      127.0.0.2`

`kubectl` 및 JSONPath 표현식을 사용하는 예는 다음과 같다.

```shell
kubectl get pods -o json
kubectl get pods -o=jsonpath='{@}'
kubectl get pods -o=jsonpath='{.items[0]}'
kubectl get pods -o=jsonpath='{.items[0].metadata.name}'
kubectl get pods -o=jsonpath="{.items[*]['metadata.name', 'status.capacity']}"
kubectl get pods -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.startTime}{"\n"}{end}'
```

{{< note >}}
윈도우에서 공백이 포함된 JSONPath 템플릿을 큰따옴표(위의 bash에 표시된 작은따옴표가 아님)로 묶어야 한다. 즉, 템플릿의 모든 문자 주변에 작은따옴표 또는 이스케이프된 큰따옴표를 사용해야 한다. 예를 들면, 다음과 같다.

```cmd
kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.status.startTime}{'\n'}{end}"
kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{\"\t\"}{.status.startTime}{\"\n\"}{end}"
```
{{< /note >}}

{{< note >}}

JSONPath 정규식은 지원되지 않는다. 정규 표현식을 이용해 매치하려면 `jq`와 같은 도구를 사용하면 된다.

```shell
# kubectl은 JSONPath 출력에 대한 정규 표현식을 지원하지 않는다.
# 다음 커맨드는 작동하지 않는다.
kubectl get pods -o jsonpath='{.items[?(@.metadata.name=~/^test$/)].metadata.name}'

# 다음 커맨드는 원하는 결과를 얻는다.
kubectl get pods -o json | jq -r '.items[] | select(.metadata.name | test("test-")).spec.containers[].image'
```
{{< /note >}}
