---
title: Отримання переліку всіх образів контейнерів, що працюють у кластері
content_type: task
weight: 100
---

<!-- overview -->

Ця сторінка показує, як використовувати kubectl для отримання переліку всіх образів контейнерів для Podʼів, що працюють у кластері.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

У цьому завданні ви використовуватимете kubectl для отримання всіх Podʼів, що працюють у кластері, і форматування виводу для отримання списку контейнерів для кожного з них.

## Перелік всіх образів контейнерів у всіх просторах імен {#list-all-container-images-in-all-namespaces}

- Отримайте всі Podʼи у всіх просторах імен за допомогою `kubectl get pods --all-namespaces`.
- Форматуйте вивід для включення лише списку імен образів контейнерів, використовуючи `-o jsonpath={.items[*].spec['initContainers', 'containers'][*].image}`. Це рекурсивно розбирає поле `image` з отриманого JSON.
  - Ознайомтеся з [довідником по jsonpath](/docs/reference/kubectl/jsonpath/) для додаткової інформації про використання jsonpath.
- Форматуйте вивід за допомогою стандартних інструментів: `tr`, `sort`, `uniq`.
  - Використовуйте `tr` для заміни пробілів на нові рядки.
  - Використовуйте `sort` для сортування результатів.
  - Використовуйте `uniq` для агрегування кількості образів.

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec['initContainers', 'containers'][*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

Jsonpath інтерпретується наступним чином:

- `.items[*]`: для кожного отриманого значення.
- `.spec`: отримати spec.
- `['initContainers', 'containers'][*]`: для кожного контейнера.
- `.image`: отримати образ.

{{< note >}}
При отриманні одного Podʼа за іменем, наприклад, `kubectl get pod nginx`, частину шляху `.items[*]` слід опустити, оскільки повертається один Pod, а не список елементів.
{{< /note >}}

## Отримання переліку образів контейнерів в розрізі Podʼів{#list-container-images-by-pod}

Форматування може бути додатково налаштоване за допомогою операції `range` для ітерації по елементах індивідуально.

```shell
kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

## Отримання переліку образів контейнерів за мітками Podʼів {#list-container-images-filtered-by-pod-label}

Щоб опрацьовувати лише Podʼи, які відповідають конкретній мітці, використовуйте прапорець -l. Наступне відповідає збігам лише для Podʼів з мітками, що відповідають `app=nginx`.

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" -l app=nginx
```

## Отримання переліку образів контейнерів в розрізі просторів імен Podʼів {#list-container-images-filtered-by-pod-namespace}

Щоб опрацьовувати лише Podʼи в конкретному просторі імен, використовуйте прапорець namespace. Наступне відповідає збігам лише для Podʼів у просторі імен `kube-system`.

```shell
kubectl get pods --namespace kube-system -o jsonpath="{.items[*].spec.containers[*].image}"
```

## Отримання переліку образів контейнерів з використанням go-template замість jsonpath {#list-container-images-using-go-template-instead-of-jsonpath}

Як альтернативу jsonpath, Kubectl підтримує використання [go-templates](https://pkg.go.dev/text/template) для форматування виходу:

```shell
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```

## {{% heading "whatsnext" %}}

### Довідники

- [Jsonpath](/docs/reference/kubectl/jsonpath/)
- [Go template](https://pkg.go.dev/text/template)
