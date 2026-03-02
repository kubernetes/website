---
title: "fish auto-completion"
description: "Деякі додаткові налаштування для автозавершення оболонки fish у Linux."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
Автодоповнення для Fish вимагає kubectl версії 1.23 або пізніше.
{{< /note >}}

Сценарій автозавершення kubectl для Fish може бути створений за допомогою команди `kubectl completion fish`. Підключення цього сценарію автозавершення у вашій оболонці вмикає автодоповнення для kubectl.

Щоб зробити це у всіх сеансах вашої оболонки, додайте наступний рядок до вашого файлу `~/.config/fish/config.fish`:

```shell
kubectl completion fish | source
```

Після перезавантаження вашої оболонки, автодоповнення kubectl повинно працювати.
