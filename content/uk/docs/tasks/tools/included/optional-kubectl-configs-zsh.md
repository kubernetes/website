---
title: "Автодоповнення zsh"
description: "Деякі необовʼязкові налаштування автодоповнення zsh."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Скрипт автодоповнення kubectl для Zsh можна згенерувати командою `kubectl completion zsh`. Підключення цього скрипта у вашій оболонці вмикає автодоповнення kubectl.

Щоб зробити це в усіх сеансах оболонки, додайте наведене нижче до файлу `~/.zshrc`:

```zsh
source <(kubectl completion zsh)
```

Якщо у вас є псевдонім для kubectl, автодоповнення kubectl автоматично працюватиме з ним.

Після перезавантаження оболонки автодоповнення kubectl має працювати.

Якщо ви отримуєте помилку на кшталт `2: command not found: compdef`, додайте наведене нижче на початок файлу `~/.zshrc`:

```zsh
autoload -Uz compinit
compinit
```
