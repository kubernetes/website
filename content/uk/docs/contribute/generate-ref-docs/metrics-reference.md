---
title: Генерація довідкової документації для метрик
content_type: task
weight: 100
---

<!-- overview -->

Ця сторінка демонструє, як згенерувати довідкову документацію для метрик.

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Клонування репозиторію Kubernetes {#clone-the-kubernetes-repository}

Генерація документації для метрик відбувається в репозиторії Kubernetes. Щоб клонувати репозиторій, перейдіть до теки, де ви хочете, щоб знаходилася клонована копія.

Потім виконайте наступну команду:

```shell
git clone https://www.github.com/kubernetes/kubernetes
```

Це створить теку `kubernetes` у вашій поточній робочій теці.

## Генерація документації для метрик {#generate-the-metrics}

У клонованому репозиторії Kubernetes знайдіть теку `test/instrumentation/documentation`. Документація для метрик генерується в цій теці.

З кожним релізом додаються нові метрики. Після того, як ви запустите скрипт генерації документації для метрик, скопіюйте документацію для метрик на вебсайт Kubernetes і опублікуйте оновлену документацію для метрик.

Щоб згенерувати останні метрики, переконайтеся, що ви знаходитесь в кореневій теці клонованого репозиторію Kubernetes. Потім виконайте наступну команду:

```shell
./test/instrumentation/update-documentation.sh
```

Щоб перевірити наявність змін, виконайте команду:

```shell
git status
```

Вивід буде схожий на:

```none
./test/instrumentation/documentation/documentation.md
./test/instrumentation/documentation/documentation-list.yaml
```

## Скопіюйте згенерований файл документації для метрик в репозиторій вебсайту Kubernetes {#copy-the-generated-metrics-documentation-to-the-kubernetes-website-repository}

1. Встановіть змінну середовища для кореневої теки вебсайту Kubernetes.

   Виконайте наступну команду, щоб встановити кореневу теку вебсайту:

   ```shell
   export WEBSITE_ROOT=<шлях до кореня вебсайту>
   ```

2. Скопіюйте згенерований файл метрик в репозиторій вебсайту Kubernetes.

   ```shell
   cp ./test/instrumentation/documentation/documentation.md "${WEBSITE_ROOT}/content/en/docs/reference/instrumentation/metrics.md"
   ```

   {{< note >}}
   Якщо ви отримали помилку, перевірте, чи маєте ви дозволи на копіювання файлу. Ви можете використати `chown`, щоб змінити власника файлу на вашого користувача.
   {{< /note >}}

## Створіть pull request {#create-a-pull-request}

Щоб створити pull request, дотримуйтесь інструкцій у розділі [Відкриття pull request](/docs/contribute/new-content/open-a-pr/).

## {{% heading "whatsnext" %}}

* [Внесок у код Kubernetes](/docs/contribute/generate-ref-docs/contribute-upstream/)
* [Генерація довідкової документації для компонентів і інструментів Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Генерація довідкової документації для команд kubectl](/docs/contribute/generate-ref-docs/kubectl/)
