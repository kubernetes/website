---
title: "kubectl-convert 개요"
description: >-
  특정 버전의 쿠버네티스 API로 작성된 매니페스트를 다른 버전으로 변환하는
  kubectl 플러그인.
headless: true
---

이것은 쿠버네티스 커맨드 라인 도구인 `kubectl`의 플러그인으로서, 특정 버전의 쿠버네티스 API로 작성된 매니페스트를 다른 버전으로
변환할 수 있도록 한다. 이것은 매니페스트를 최신 쿠버네티스 릴리스의 사용 중단되지 않은 API로 마이그레이션하는 데 특히 유용하다.
더 많은 정보는 다음의 [사용 중단되지 않은 API로 마이그레이션](/docs/reference/using-api/deprecation-guide/#migrate-to-non-deprecated-apis)을 참고한다.
