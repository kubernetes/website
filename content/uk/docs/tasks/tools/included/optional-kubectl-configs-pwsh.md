---
title: "Автодоповнення PowerShell"
description: "Деякі необовʼязкові налаштування автодоповнення в PowerShell."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Скрипт автодоповнення kubectl для PowerShell можна згенерувати командою `kubectl completion powershell`.

Щоб зробити це в усіх сеансах оболонки, додайте такий рядок до файлу `$PROFILE`:

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```

Ця команда генеруватиме скрипт автодоповнення під час кожного запуску PowerShell. Ви також можете додати згенерований скрипт безпосередньо до файлу `$PROFILE`.

Щоб додати згенерований скрипт до файлу `$PROFILE`, виконайте такий рядок у командному рядку PowerShell:

```powershell
kubectl completion powershell >> $PROFILE
```

Після перезавантаження оболонки автодоповнення kubectl має працювати.
