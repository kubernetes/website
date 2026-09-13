---
title: 디바이스 (원문, Device)
id: device
short_description: >
  GPU나 회로 기판처럼 클러스터의 노드에 직접 또는 간접적으로 연결된
  리소스.

tags:
- extension
- fundamental
---
클러스터의 {{< glossary_tooltip text="노드" term_id="node" >}}에
직접 또는 간접적으로 연결된
하나 이상의
{{< glossary_tooltip text="인프라 리소스" term_id="infrastructure-resource" >}}이다.

<!--more-->

디바이스는 GPU와 같은 상용 제품일 수도 있고, [ASIC 보드](https://en.wikipedia.org/wiki/Application-specific_integrated_circuit)와
같은 맞춤형 하드웨어일 수도 있다.
연결된 디바이스에는 일반적으로 쿠버네티스가 {{< glossary_tooltip text="파드" term_id="pod" >}}에서
디바이스에 접근할 수 있도록 하는 디바이스 드라이버가 필요하다.
