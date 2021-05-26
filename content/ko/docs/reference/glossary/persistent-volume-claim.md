---
title: 퍼시스턴트 볼륨 클레임(Persistent Volume Claim)
id: persistent-volume-claim
date: 2018-04-12
full_link: /ko/docs/concepts/storage/persistent-volumes/
short_description: >
  컨테이너의 볼륨으로 마운트될 수 있도록 퍼시스턴트볼륨(PersistentVolume)에 정의된 스토리지 리소스를 요청한다.

aka: 
tags:
- core-object
- storage
---
 {{< glossary_tooltip text="컨테이너" term_id="container" >}}의 볼륨으로 마운트될 수 있도록 {{< glossary_tooltip text="퍼시스턴트볼륨(PersistentVolume)" term_id="persistent-volume" >}}에 정의된 스토리지 리소스를 요청한다.

<!--more--> 

스토리지의 양, 스토리지에 엑세스하는 방법(읽기 전용, 읽기 그리고/또는 쓰기) 및 재확보(보존, 재활용 혹은 삭제) 방법을 지정한다. 스토리지 자체에 관한 내용은 퍼시스턴트볼륨 오브젝트에 설명되어 있다. 
