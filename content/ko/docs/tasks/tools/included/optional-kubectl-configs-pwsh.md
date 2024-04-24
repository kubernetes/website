---
title: "PowerShell 자동 완성"
description: "PowerShell 자동 완성을 위한 몇 가지 선택적 구성에 대해 설명한다."
headless: true
---

PowerShell용 kubectl 자동 완성 스크립트는 `kubectl completion powershell` 명령으로 생성할 수 있다.

모든 셸 세션에서 사용하려면, `$PROFILE` 파일에 다음을 추가한다.

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```

이 명령은 PowerShell을 실행할 때마다 자동 완성 스크립트를 재생성한다. 아니면, 생성된 스크립트를 `$PROFILE` 파일에 직접 추가할 수도 있다.

생성된 스크립트를 `$PROFILE` 파일에 직접 추가하려면, PowerShell 프롬프트에서 다음 명령줄을 실행한다.

```powershell
kubectl completion powershell >> $PROFILE
```

셸을 다시 불러오면, kubectl 자동 완성이 동작할 것이다.
