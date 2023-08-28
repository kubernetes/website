---
title: "zsh 자동 완성"
description: "zsh 자동 완성을 위한 몇 가지 선택적 구성에 대해 설명한다."
headless: true
---

Zsh용 kubectl 자동 완성 스크립트는 `kubectl completion zsh` 명령으로 생성할 수 있다. 셸에서 자동 완성 스크립트를 소싱하면 kubectl 자동 완성 기능이 활성화된다.

모든 셸 세션에서 사용하려면, `~/.zshrc` 파일에 다음을 추가한다.

```zsh
source <(kubectl completion zsh)
```

kubectl에 대한 앨리어스가 있는 경우, kubectl 자동완성이 자동으로 동작할 것이다.

셸을 다시 로드하면, kubectl 자동 완성 기능이 작동할 것이다.

`2: command not found: compdef` 와 같은 오류가 발생하면, `~/.zshrc` 파일의 시작 부분에 다음을 추가한다.

```zsh
autoload -Uz compinit
compinit
```