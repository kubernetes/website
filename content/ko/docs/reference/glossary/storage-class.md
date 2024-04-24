---
title: 스토리지 클래스(Storage Class)
id: storageclass
date: 2018-04-12
full_link: /ko/docs/concepts/storage/storage-classes
short_description: >
  스토리지클래스는 관리자가 사용 가능한 다양한 스토리지 유형을 설명할 수 있는 방법을 제공한다.

aka: 
tags:
- core-object
- storage
---
 스토리지클래스는 관리자가 사용 가능한 다양한 스토리지 유형을 설명할 수 있는 방법을 제공한다.

<!--more--> 

스토리지 클래스는 서비스 품질 수준, 백업 정책 혹은 클러스터 관리자가 결정한 임의의 정책에 매핑할 수 있다. 각 스토리지클래스에는 클래스에 속한 {{< glossary_tooltip text="퍼시스턴트 볼륨(Persistent Volume)" term_id="persistent-volume" >}}을 동적으로 프로비저닝해야 할 때 사용되는 `provisioner`, `parameters` 및 `reclaimPolicy` 필드가 있다. 사용자는 스토리지클래스 객체의 이름을 사용하여 특정 클래스를 요청할 수 있다. 


