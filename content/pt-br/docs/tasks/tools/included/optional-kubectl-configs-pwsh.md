---
title: "Ative o autocompletar no PowerShell"
description: "Algumas configurações opcionais para ativar o autocompletar no PowerShell."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

O script de autocompletar do kubectl para PowerShell, pode ser gerado com o comando `kubectl completion powershell`.

Para fazer isso em todas as suas sessões de shell, adicione a seguinte linha ao seu arquivo `$PROFILE`:

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```

Este comando irá regenerar o script de autocompletar toda vez que o PowerShell for iniciado. Você também pode adicionar o script gerado diretamente ao seu arquivo `$PROFILE`.

Para adicionar o script gerado ao seu arquivo `$PROFILE`, execute a seguinte linha no prompt do PowerShell:

```powershell
kubectl completion powershell >> $PROFILE
```

Após recarregar seu shell, o autocompletar do kubectl deve estar funcionando.
