---
linktitle: 릴리스 히스토리
title: 릴리스
type: docs
layout: release-info
notoc: true
---

<!-- overview -->

쿠버네티스 프로젝트는 가장 최신의 3개 마이너(minor) 릴리스
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}})에 대해 릴리스 브랜치를 관리한다.
쿠버네티스 1.19 및 이후 신규 버전은
[약 1년간 패치 지원](/releases/patch-releases/#support-period)을 받는다.
쿠버네티스 1.18 및 이전 버전은 약 9개월간의 패치 지원을 받았다.

쿠버네티스 버전은 **x.y.z** 의 형태로 표현되는데,
**x** 는 메이저(major) 버전, **y** 는 마이너(minor) 버전, **z** 는 패치(patch) 버전을 의미하며,
이는 [시맨틱 버전(Semantic Versioning)](https://semver.org/)의 용어를 따른 것이다.

자세한 정보는 [버전 차이(skew) 정책](/releases/version-skew-policy/) 문서에서 확인한다.

<!-- body -->

## 릴리스 히스토리

{{< release-data >}}

## 수명이 종료된(End-of-Life) 릴리스

더 이상 유지 관리되지 않는 이전 쿠버네티스 릴리스는 아래에 나열되어 있다.

<details>
  <summary>수명이 종료된 릴리스</summary>
  {{< note >}}
  이 릴리스들은 더 이상 지원되지 않으며 보안 업데이트나 버그 수정을 받지 않는다.
  이러한 릴리스 중 하나를 실행하고 있다면, 쿠버네티스 프로젝트는 [지원되는 버전](#릴리스-히스토리)으로 업그레이드할 것을 강력히 권장한다.
  {{< /note >}}
  
  {{< eol-releases >}}
</details>

## 차기 릴리스

차기 쿠버네티스 릴리스 **{{< skew nextMinorVersion >}}** 의
[스케줄](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})을 확인한다!

{{< note >}}
이 스케줄 링크는 릴리스 계획 초기 단계에서 일시적으로 사용하지 못할 수 있다.
최신 업데이트는 [SIG Release 저장소](https://github.com/kubernetes/sig-release/tree/master/releases)를 확인한다.
{{< /note >}}

## 유용한 자원

역할과 릴리스 프로세스에 대한 주요 정보는
[쿠버네티스 릴리스 팀](https://github.com/kubernetes/sig-release/tree/master/release-team) 자료를 참고한다.
