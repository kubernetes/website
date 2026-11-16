---
title: "Автодоповнення fish"
description: "Необовʼязкове налаштування для ввімкнення автодоповнення в оболонці fish."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
Автодоповнення для Fish потребує kubectl версії 1.23 або новішої.
{{< /note >}}

Скрипт автодоповнення kubectl для Fish можна згенерувати командою `kubectl completion fish`. Підключення цього скрипта у вашій оболонці вмикає автодоповнення kubectl.

Щоб зробити це в усіх сеансах оболонки, додайте такий рядок до файлу `~/.config/fish/config.fish`:

```shell
kubectl completion fish | source
```

Після перезавантаження оболонки автодоповнення kubectl має працювати.
