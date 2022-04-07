---
title: "fish auto-completion"
description: "fish 자동 완성을 활성화하기 위한 선택적 구성"
headless: true
---

Fish용 kubectl 자동 완성 스크립트는 `kubectl completion fish` 명령으로 생성할 수 있다. 셸에서 자동 완성 스크립트를 소싱하면 kubectl 자동 완성 기능이 활성화된다.

모든 셸 세션에서 사용하려면, `~/.config/fish/config.fish` 파일에 다음을 추가한다.

```shell
kubectl completion fish | source
```

셸을 다시 로드하면, kubectl 자동 완성 기능이 작동할 것이다.
