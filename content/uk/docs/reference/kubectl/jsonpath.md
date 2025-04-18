---
title: Підтримка JSONPath
content_type: concept
weight: 40
math: true
---

<!-- overview -->

{{< glossary_tooltip term_id="kubectl" text="Kubectl" >}} підтримує шаблони JSONPath як вихідний формат.

<!-- body -->

_Шаблон JSONPath_ складається з виразів JSONPath, які заключені в фігурні дужки `{` та `}`. Kubectl використовує вирази JSONPath для фільтрації конкретних полів у JSON-обʼєкті та форматування виводу. Окрім оригінального синтаксису шаблону JSONPath, дійсні наступні функції та синтаксис:

1. Використовуйте подвійні лапки для цитування тексту всередині виразів JSONPath.
2. Використовуйте оператори `range`, `end` для ітерації списків.
3. Використовуйте відʼємні індекси зрізу для кроку назад через список. Відʼємні індекси не "обгортають" список і є дійсними, поки \\( ( - index + listLength ) \ge 0 \\).

{{< note >}}

- Оператор `$` є необовʼязковим, оскільки вираз завжди починається стандартно з обʼєкта кореня.

- Результат обʼєкта виводиться як його функція `String()`.

{{< /note >}}

## Функції в JSONPath в Kubernetes {#functions}

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

{{< table caption="Функції, їх параметри, приклад виклику та результат" >}}
Функція             | Опис                          | Приклад                                                         | Результат
--------------------|-------------------------------|-----------------------------------------------------------------|------------------
`text`              | звичайний текст               | `kind is {.kind}`                                               | `kind is List`
`@`                 | поточний обʼєкт               | `{@}`                                                           | той самий, що й вхід
`.` або `[]`        | оператор доступу до дочірніх елементів  | `{.kind}`, `{['kind']}` або `{['name\.type']}`                  | `List`
`..`                | рекурсивний спуск             | `{..name}`                                                      | `127.0.0.1 127.0.0.2 myself e2e`
`*`                 | універсальний символ. Отримати всі обʼєкти | `{.items[*].metadata.name}`                         | `[127.0.0.1 127.0.0.2]`
`[start:end:step]`  | оператор індексу             | `{.users[0].name}`                                              | `myself`
`[,]`               | оператор обʼєднання           | `{.items[*]['metadata.name', 'status.capacity']}`               | `127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]`
`?()`               | фільтр                        | `{.users[?(@.name=="e2e")].user.password}`                      | `secret`
`range`, `end`      | ітерація списку               | `{range .items[*]}[{.metadata.name}, {.status.capacity}] {end}` | `[127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]`
`''`                | інтерпретований рядок з лапками| `{range .items[*]}{.metadata.name}{'\t'}{end}`                  | `127.0.0.1      127.0.0.2`
`\`                 | символ екранування            | `{.items[0].metadata.labels.kubernetes\.io/hostname}`           | `127.0.0.1`
{{< /table >}}

## Використання виразів JSONPath з kubectl {#use-with-kubectl}

Приклади використання `kubectl` та виразів JSONPath:

```shell
kubectl get pods -o json
kubectl get pods -o=jsonpath='{@}'
kubectl get pods -o=jsonpath='{.items[0]}'
kubectl get pods -o=jsonpath='{.items[0].metadata.name}'
kubectl get pods -o=jsonpath="{.items[*]['metadata.name', 'status.capacity']}"
kubectl get pods -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.startTime}{"\n"}{end}'
kubectl get pods -o=jsonpath='{.items[0].metadata.labels.kubernetes\.io/hostname}'
```

Або за допомогою "my_pod" і "my_namespace" (налаштуйте ці назви відповідно до вашого середовища):

```shell
kubectl get pod/my_pod -n my_namespace -o=jsonpath='{@}'
kubectl get pod/my_pod -n my_namespace -o=jsonpath='{.metadata.name}'
kubectl get pod/my_pod -n my_namespace -o=jsonpath='{.status}'
```

{{< note >}}
У Windows потрібно _подвійні_ лапки для будь-якого шаблону JSONPath, що містить пробіли (не одинарні лапки, як показано вище для bash). Це означає, що потрібно використовувати одинарні лапки або екрановані подвійні лапки для будь-яких літералів у шаблоні. Наприклад:

```cmd
kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.status.startTime}{'\n'}{end}"
kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{\"\t\"}{.status.startTime}{\"\n\"}{end}"
```

{{< /note >}}

## Регулярні вирази в JSONPath {#regular-expressions-in-jsonpath}

JSONPath регулярні вирази не підтримуються. Якщо ви хочете використовувати регулярні вирази, ви можете скористатися інструментом, таким як `jq`.

```shell
# kubectl не підтримує регулярні вирази для JSONpath виводу
# Наступна команда не працює
kubectl get pods -o jsonpath='{.items[?(@.metadata.name=~/^test$/)].metadata.name}'

# Наступна команда досягає бажаного результату
kubectl get pods -o json | jq -r '.items[] | select(.metadata.name | test("test-")).metadata.name'
```
