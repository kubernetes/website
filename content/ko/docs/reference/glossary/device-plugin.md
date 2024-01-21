---
title: 장치 플러그인(Device Plugin)
id: device-plugin
date: 2019-02-02
full_link: /ko/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  파드가 공급자별 초기화 또는 설정이 필요한 장치에 접근할 수 있도록 하는 소프트웨어 확장
aka:
tags:
- fundamental
- extension
---
 장치 플러그인은 워커\
 {{< glossary_tooltip term_id="node" text="노드">}}에서 실행되며,
 공급자별 초기화 또는 설정 단계가 필요한 로컬 하드웨어와
 같은 리소스에 접근할 수 있는
 {{< glossary_tooltip term_id="pod" text="파드">}}.

<!--more-->

장치 플러그인은 {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}에
리소스를 알리기에 워크로드 파드는 해당 파드가 실행중인
노드와 관련된 하드웨어 기능에 접근할 수 있다.
장치 플러그인을 {{< glossary_tooltip term_id="daemonset" >}}으로 배포하거나,
각 대상 노드에 직접 장치 플러그인 소프트웨어를 설치할 수 있다.

[장치 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
의 더 자세한 정보를
본다
