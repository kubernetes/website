---
title: Отримання переліку всіх образів контейнерів, що працюють у кластері
content_type: task
weight: 100
---

<!-- overview -->

На цій сторінці показано, як за допомогою kubectl отримати перелік усіх образів контейнерів для Podʼів, що працюють у кластері.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

У цій вправі ви за допомогою kubectl отримаєте всі Podʼи, що працюють у кластері, і відформатуєте вивід, щоб отримати перелік контейнерів для кожного з них.

## Перелік усіх образів контейнерів у всіх просторах імен {#list-all-container-images-in-all-namespaces}

- Отримайте всі Podʼи у всіх просторах імен за допомогою `kubectl get pods --all-namespaces`.
- Відформатуйте вивід, щоб він містив лише перелік назв образів контейнерів, за допомогою `-o jsonpath={.items[*].spec['initContainers', 'containers'][*].image}`. Це рекурсивно витягне поле `image` з отриманого json.
  - Докладніше про використання jsonpath дивіться в [довіднику з jsonpath](/docs/reference/kubectl/jsonpath/).
- Відформатуйте вивід за допомогою стандартних інструментів: `tr`, `sort`, `uniq`.
  - Використовуйте `tr` для заміни пробілів на нові рядки.
  - Використовуйте `sort` для сортування результатів.
  - Використовуйте `uniq` для підрахунку образів.

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec['initContainers', 'containers'][*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

Jsonpath інтерпретується так:

- `.items[*]`: для кожного отриманого значення.
- `.spec`: отримати spec.
- `['initContainers', 'containers'][*]`: для кожного контейнера.
- `.image`: отримати образ.

{{< note >}}
Під час отримання одного Podʼа за назвою, наприклад `kubectl get pod nginx`, частину шляху `.items[*]` слід пропустити, оскільки повертається один Pod, а не список елементів.
{{< /note >}}

## Перелік образів контейнерів за Podʼами {#list-container-images-by-pod}

Форматування можна додатково контролювати за допомогою операції `range`, щоб перебирати елементи окремо.

```shell
kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

## Перелік образів контейнерів із фільтрацією за міткою Podʼа {#list-container-images-filtering-by-pod-label}

Щоб вибрати лише Podʼи з певною міткою, використовуйте прапорець -l. Наведена нижче команда вибирає лише Podʼи з міткою `app=nginx`.

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" -l app=nginx
```

## Перелік образів контейнерів із фільтрацією за простором імен Podʼа {#list-container-images-filtering-by-pod-namespace}

Щоб вибрати лише Podʼи в певному просторі імен, використовуйте прапорець namespace. Наведена нижче команда вибирає лише Podʼи в просторі імен `kube-system`.

```shell
kubectl get pods --namespace kube-system -o jsonpath="{.items[*].spec.containers[*].image}"
```

## Перелік образів контейнерів за допомогою go-template замість jsonpath {#list-container-images-using-a-go-template-instead-of-jsonpath}

Як альтернативу jsonpath kubectl підтримує [go-templates](https://pkg.go.dev/text/template) для форматування виводу:

```shell
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```

## {{% heading "whatsnext" %}} {#what-s-next}

### Довідка {#reference}

- Довідник [Jsonpath](/docs/reference/kubectl/jsonpath/)
- Довідник [Go template](https://pkg.go.dev/text/template)
