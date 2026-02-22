---
title: 어드미션 컨트롤러(Admission Controller)
id: admission-controller
date: 2019-06-28
full_link: /docs/reference/access-authn-authz/admission-controllers/
short_description: >
  쿠버네티스 API 서버에서 요청을 처리하여 오브젝트가 지속되기 전에 그 요청을 가로채는 코드 조각.

aka:
tags:
- extension
- security
---
쿠버네티스 API 서버에서 요청을 처리하여 오브젝트가 지속되기 전에 그 요청을 가로채는 코드 조각.

<!--more-->

어드미션 컨트롤러는 쿠버네티스 API 서버에서 구성할 수 있고, "유효성 검사"나 "변조하기" 혹은 모두를 진행할 수 있다.
모든 어드미션 컨트롤러는 요청을 거부할 수 있다. 변조하는 컨트롤러는 자신이 승인하는 오브젝트를 수정할 수 있지만
유효성 검사 컨트롤러는 수정할 수 없다.

* [쿠버네티스 문서에서 어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)
