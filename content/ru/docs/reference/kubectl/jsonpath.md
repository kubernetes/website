---
title: Поддержка JSONPath
content_type: concept
weight: 25
---

<!-- overview -->
Kubectl поддерживает шаблон JSONPath.


<!-- body -->

Шаблон JSONPath состоит из выражений JSONPath, заключенных в фигурные скобки {}.
Kubectl использует JSONPath-выражения для фильтрации по определенным полям в JSON-объекте и форматирования вывода.
В дополнение к оригинальному синтаксису шаблона JSONPath, допустимы следующие функции и синтаксис:

1. Внутри выражений JSONPath текстовые значения заключайте в двойные кавычки.
2. Используйте операторы `range`, `end`, конечные операторы для перебора списков.
3. Используйте отрицательные индексы срезов для перехода на предыдущий элемент в списке. Отрицательные индексы не "зацикливаются" в списке и работают пока истинно выражение `-index + listLength >= 0`.

{{< note >}}

- Оператор `$` необязателен, поскольку по умолчанию выражение всегда начинается с корневого объекта.

- Объект результата выводиться через функцию String().

{{< /note >}}

Все примеры ниже будут ориентироваться на следующий JSON-объект:

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

Функция            | Описание               | Пример                                                         | Результат
--------------------|---------------------------|-----------------------------------------------------------------|------------------
`text`              | обычный текст            | `kind is {.kind}`                                               | `kind is List`
`@`                 | текущий объект        | `{@}`                                                           | то же, что и ввод
`.` или `[]`         | оператор выбора по ключу            | `{.kind}`, `{['kind']}` или `{['name\.type']}`                   | `List`
`..`                | рекурсивный спуск        | `{..name}`                                                      | `127.0.0.1 127.0.0.2 myself e2e`
`*`                 | шаблон подстановки. Получение всех объектов | `{.items[*].metadata.name}`                                     | `[127.0.0.1 127.0.0.2]`
`[start:end:step]` | оператор индексирования        | `{.users[0].name}`                                              | `myself`
`[,]`               | оператор объединения            | `{.items[*]['metadata.name', 'status.capacity']}`               | `127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]`
`?()`               | фильтрация                    | `{.users[?(@.name=="e2e")].user.password}`                      | `secret`
`range`, `end`      | перебор списка            | `{range .items[*]}[{.metadata.name}, {.status.capacity}] {end}` | `[127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]`
`''`                | интерпретируемая в кавычках строка  | `{range .items[*]}{.metadata.name}{'\t'}{end}`                  | `127.0.0.1      127.0.0.2`

Примеры использования `kubectl` и JSONPath-выражений:

```shell
kubectl get pods -o json
kubectl get pods -o=jsonpath='{@}'
kubectl get pods -o=jsonpath='{.items[0]}'
kubectl get pods -o=jsonpath='{.items[0].metadata.name}'
kubectl get pods -o=jsonpath="{.items[*]['metadata.name', 'status.capacity']}"
kubectl get pods -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.startTime}{"\n"}{end}'
```

{{< note >}}
В Windows нужно заключить в _двойные_ кавычки JSONPath-шаблон, который содержит пробелы (не в одинарные, как в примерах выше для bash). Таким образом, любые литералы в таких шаблонах нужно оборачивать в одинарные кавычки или экранированные двойные кавычки. Например:

```cmd
kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.status.startTime}{'\n'}{end}"
kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{\"\t\"}{.status.startTime}{\"\n\"}{end}"
```
{{< /note >}}


