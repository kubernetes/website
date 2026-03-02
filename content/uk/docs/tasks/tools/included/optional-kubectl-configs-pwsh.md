---
title: "PowerShell автодоповнення"
description: "Деякі необовʼязкові налаштування для автодоповнення в PowerShell."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Скрипт автодоповнення для kubectl в PowerShell можна згенерувати командою `kubectl completion powershell`.

Для того, щоб це працювало у всіх сесіях вашої оболонки, додайте наступний рядок до вашого файлу `$PROFILE`:

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```

Ця команда буде генерувати скрипт автодоповнення при кожному запуску PowerShell. Ви також можете додати згенерований скрипт безпосередньо до вашого файлу `$PROFILE`.

Щоб додати згенерований скрипт до вашого файлу `$PROFILE`, виконайте наступний рядок у вашому PowerShell:

```powershell
kubectl completion powershell >> $PROFILE
```

Після перезавантаження вашої оболонки автодоповнення для kubectl має працювати.
