---
title: 동적 볼륨 프로비저닝(Dynamic Volume Provisioning)
id: dynamicvolumeprovisioning
date: 2018-04-12
full_link: /ko/docs/concepts/storage/dynamic-provisioning
short_description: >
  사용자가 스토리지 볼륨의 자동 생성을 요청할 수 있게 해준다.

aka: 
tags:
- core-object
- storage
---
 사용자가 스토리지 {{< glossary_tooltip text="볼륨" term_id="volume" >}}의 자동 생성을 요청할 수 있게 해준다.

<!--more--> 

동적 프로비저닝은 클러스터 관리자가 스토리지를 사전 프로비저닝할 필요가 없다. 대신 사용자 요청에 따라 자동으로 스토리지를 프로비저닝한다. 동적 볼륨 프로비저닝은 API 오브젝트인 {{< glossary_tooltip text="스토리지클래스(StorageClass)" term_id="storage-class" >}}를 기반으로 한다. 이 스토리지클래스는 {{< glossary_tooltip text="볼륨" term_id="volume" >}} 및 {{< glossary_tooltip text="볼륨 플러그인" term_id="volume-plugin" >}}에 전달할 파라미터 세트를 프로비저닝하는 볼륨 플러그인을 참조한다. 

