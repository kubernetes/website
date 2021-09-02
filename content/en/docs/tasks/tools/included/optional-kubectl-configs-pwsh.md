---
title: "powershell auto-completion"
description: "Some optional configuration for powershell auto-completion."
headless: true
---

The kubectl completion script for powershell can be generated with the command `kubectl completion powershell`.

To do so in all your shell sessions, add the following to your `$PROFILE` file:

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```

If you don't want to run kubectl every time, you can just add the generated script to your `$PROFILE` file:

```powershell
kubectl completion powershell >> $PROFILE
```

After reloading your shell, kubectl autocompletion should be working.
