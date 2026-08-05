---
title: 컨테이너 라이프사이클 훅(Container Lifecycle Hooks)
id: container-lifecycle-hooks
date: 2018-10-08
full_link: /ko/docs/concepts/containers/container-lifecycle-hooks/
short_description: >
  라이프사이클 훅은 컨테이너 관리 라이프사이클에 이벤트를 노출하고 이벤트가 발생할 때 사용자가 코드를 실행할 수 있도록 한다.

aka:
tags:
- extension
---
  라이프사이클 훅은 {{< glossary_tooltip text="컨테이너" term_id="container" >}} 관리 라이프사이클에 이벤트를 노출하고 이벤트가 발생할 때 사용자가 코드를 실행할 수 있도록 한다.

<!--more-->

컨테이너에는 두 개의 훅(컨테이너가 생성된 직후에 실행되는 PostStart와 컨테이너가 종료되기 직전에 차단되고 호출되는 PreStop)이 노출된다.
