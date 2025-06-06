---
title: "Autocompletado de PowerShell"
description: "Algunas configuraciones opcionales para el autocompletado de PowerShell."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

El script de autocompletado de kubectl para PowerShell se puede generar con el comando `kubectl completion powershell`.

Para hacerlo en todas tus sesiones de shell, agrega la siguiente línea a tu archivo `$PROFILE`:

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```
Este comando agregará el script de autocompletado en cada sesión de PowerShell. También puedes añadir el script generado directamente en tu archivo `$PROFILE`.

Para agregar el script generado a tu archivo `$PROFILE`, ejecute el siguiente comando en el prompt de tu PowerShell:

```powershell
kubectl completion powershell >> $PROFILE
```

Después de recargar tu shell, el autocompletado de kubectl debería funcionar.
