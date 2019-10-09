---
title: 볼륨(Volume)
id: volume
date: 2018-04-12
full_link: /docs/concepts/storage/volumes/
short_description: >
  데이터를 포함하고 있는 디렉토리이며, 파드의 컨테이너에서 접근 가능하다.

aka: 
tags:
- core-object
- fundamental
---
 데이터를 포함하고 있는 디렉토리이며, {{< glossary_tooltip text="파드" term_id="pod" >}}의 컨테이너에서 접근 가능하다.

<!--more--> 

쿠버네티스 볼륨은 그것을 포함하고 있는 {{< glossary_tooltip text="파드" term_id="pod" >}}만큼 오래 산다. 결과적으로, 볼륨은 {{< glossary_tooltip text="파드" term_id="pod" >}} 안에서 실행되는 모든 {{< glossary_tooltip text="컨테이너" term_id="container" >}} 보다 오래 지속되며, 데이터는 {{< glossary_tooltip text="컨테이너" term_id="container" >}}의 재시작 간에도 보존된다.

