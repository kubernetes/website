---
title: 볼륨 플러그인(Volume Plugin)
id: volumeplugin
date: 2018-04-12
full_link: 
short_description: >
  볼륨 플러그인은 파드 내에서의 스토리지 통합을 가능하게 한다.

aka: 
tags:
- core-object
- storage
---
 볼륨 플러그인은 {{< glossary_tooltip text="파드(Pod)" term_id="pod" >}} 내에서의 스토리지 통합을 가능하게 한다.

<!--more--> 

볼륨 플러그인을 사용하면 {{< glossary_tooltip text="파드" term_id="pod" >}}에서 사용할 스토리지 볼륨을 연결하고 마운트할 수 있다. 볼륨 플러그인은 _인-트리(in tree)_ 혹은 _아웃-오브-트리(out of tree)_ 일 수 있다. _인-트리_ 플러그인은 쿠버네티스 코드 리포지터리의 일부이며 동일한 릴리즈 주기를 따른다. _아웃-오브-트리_ 플러그인은 독립적으로 개발된다.

