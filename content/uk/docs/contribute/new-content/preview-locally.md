---
title: Попередній локальний перегляд змін
content_type: concept
weight: 11
---

<!-- overview -->

Before you're going to [open a new PR](/docs/contribute/new-content/open-a-pr/), previewing your changes is recommended. A preview lets you catch build errors or markdown formatting problems.

## Попередній перегляд змін локально {#preview-locally}

Ви можете або створити образ контейнера вебсайту, або запустити Hugo локально. Створення образу контейнера відбувається повільніше, але відображає [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/), що може бути корисним для налагодження.

{{< tabs name="tab_with_hugo" >}}
{{% tab name="Hugo в контейнері" %}}

{{< note >}}
Наведені нижче команди використовують Docker як стандартний контейнерний рушій. Щоб змінити це налаштування, встановіть змінну середовища `CONTAINER_ENGINE`.
{{< /note >}}

1. Створіть образ контейнера локально _Цей крок необхідний лише у випадку, якщо ви тестуєте зміни в самому інструменті Hugo_

   ```shell
   # Запустіть це в терміналі (якщо потрібно)
   make container-image
   ```

1. Завантажте залежності субмодуля у свій локальний репозиторій:

   ```shell
   # Запустіть це в терміналі
   make module-init
   ```

1. Запустіть Hugo в контейнері:

   ```shell
   # Запустіть це в терміналі
   make container-serve
   ```

1. У вебоглядачі перейдіть за адресою `http://localhost:1313`. Hugo відстежує зміни та перекомпілює сайт за потреби.

1. Щоб зупинити локальний екземпляр Hugo, поверніться до терміналу та натисніть `Ctrl+C` або закрийте вікно терміналу.

{{% /tab %}}
{{% tab name="Hugo в командному рядку" %}}

Або ж встановіть і використовуйте команду `hugo` на своєму компʼютері:

1. Встановіть версії [Hugo (розширена версія)](https://gohugo.io/getting-started/installing/) та [Node](https://nodejs.org/en), зазначені у файлі [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/main/netlify.toml).

1. Встановіть усі залежності:

   ```shell
   npm ci
   ```

1. У терміналі перейдіть до репозиторію вебсайту Kubernetes і запустіть сервер Hugo:

   ```shell
   cd <path_to_your_repo>/website
   make serve
   ```

   Якщо ви використовуєте компʼютер з ОС Windows або не можете виконати команду `make`, скористайтеся наступною командою:

   ```shell
   hugo server --buildFuture
   ```

1. У вебоглядачі перейдіть за адресою `http://localhost:1313`. Hugo відстежує зміни та за потреби перебудовує сайт.

1. Щоб зупинити локальний екземпляр Hugo, поверніться до терміналу та натисніть `Ctrl+C` або закрийте вікно терміналу.

{{% /tab %}}
{{< /tabs >}}

## Усунення несправностей {#troubleshooting}

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo

version  Hugo постачається у двох наборах бінарних файлів з технічних причин. Поточний вебсайт працює виключно на основі версії **Hugo Extended**. На [сторінці випуску](https://github.com/gohugoio/hugo/releases) знайдіть архіви з назвою, що містить слово `extended`. Щоб підтвердити, запустіть `hugo version` і знайдіть слово `extended`.

### Усунення несправностей macOS через занадто велику кількість відкритих файлів {#troubleshooting-macos-for-too-many-open-files}

Якщо ви запускаєте `make serve` в macOS і отримуєте таку помилку:

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

Спробуйте перевірити поточний ліміт відкритих файлів:

`launchctl limit maxfiles`

Потім виконайте наступні команди (на основі <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):

```shell
#!/bin/sh

# These are the original gist links, linking to my gists now.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

Це працює як для Catalina, так і для Mojave macOS.

### Unable to find image 'gcr.io/k8s-staging-sig-docs/k8s-website-hugo:VERSION' locally

Якщо ви запускаєте `make container-serve` і бачите цю помилку, це може бути повʼязано з локальними змінами, внесеними до певних файлів [визначених](https://github.com/kubernetes/website/blob/main/Makefile#L10) у `$IMAGE_VERSION` файлу `Makefile`.

Версія образу вебсайту включає хеш, який генерується на основі вмісту перелічених файлів. Наприклад, якщо `1b9242684415` є хешем  для цих файлів, образ вебсайту буде називатися `k8s-website-hugo:v0.133.0-1b9242684415`. Виконання `make container-serve` спробує витягнути такий образ із GCR вебсайту Kubernetes. Якщо це не поточна версія, ви побачите повідомлення про помилку, що цей образ відсутній.

Якщо вам потрібно внести зміни в ці файли та переглянути вебсайт, вам доведеться створити локальний образ замість витягування попередньо створеного. Для цього виконайте `make container-image`.

### Інші проблеми {#other-issues}

Якщо у вас виникли інші проблеми з локальним запуском вебсайту та/або попереднім переглядом змін, не соромтеся [відкрити тікет](https://github.com/kubernetes/website/issues/new/choose) у репозиторії GitHub `kubernetes/website`.
