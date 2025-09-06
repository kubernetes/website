---
title: "zsh auto-completion"
description: "Деякі додаткові налаштування для автозавершення оболонки zsh у Linux."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Сценарій автозавершення kubectl для Zsh може бути створений за допомогою команди `kubectl completion zsh`. Підключення цього сценарію автозавершення у вашій оболонці дозволяє ввімкнути автодоповнення для kubectl.

Щоб зробити це у всіх сеансах вашої оболонки, додайте наступне до вашого файлу `~/.zshrc`:

```zsh
source <(kubectl completion zsh)
```

Якщо у вас є аліас для kubectl, автодоповнення kubectl автоматично працюватиме з ним.

Після перезавантаження вашої оболонки автодоповнення kubectl повинно працювати.

Якщо ви отримуєте помилку типу `2: command not found: compdef`, то додайте наступне до початку вашого файлу `~/.zshrc`:

```zsh
autoload -Uz compinit
compinit
```
