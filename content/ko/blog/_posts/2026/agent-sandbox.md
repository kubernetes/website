---
layout: blog
title: "Agent Sandbox로 쿠버네티스에서 에이전트 실행하기"
date: 2026-03-20T10:00:00-08:00
slug: running-agents-on-kubernetes-with-agent-sandbox
author: >
  [Janet Kuo](https://github.com/janetkuo),
  [Justin Santa Barbara](https://github.com/justinsb)
---

인공지능 지형이 거대한 구조 변화를 겪고 있습니다. 생성형 AI 초기에는 모델과 상호작용하는 일을 대체로 일시적이고 스테이트리스한 함수 호출로 다뤘습니다. 요청이 뜨고, 50밀리초 남짓 실행되고, 종료되는 식이었습니다.

오늘날 세계는 AI v2가 AI v1을 집어삼키는 광경을 지켜보고 있습니다. 생태계는 수명이 짧고 고립된 작업에서, 서로 발을 맞춰 끊임없이 도는 여러 AI 에이전트를 배포하는 쪽으로 옮겨 가고 있습니다. 이 자율 에이전트들은 오랜 기간에 걸쳐 컨텍스트를 유지하고, 외부 도구를 사용하고, 코드를 작성하고 실행하며, 서로 통신해야 합니다.

플랫폼 엔지니어링 팀이 이 새로운 AI 워크로드를 올릴 알맞은 인프라를 찾을 때, 자연스러운 선택지로 두드러지는 플랫폼이 하나 있습니다. 바로 쿠버네티스입니다. 그런데 이 독특한 에이전트 워크로드를 전통적인 쿠버네티스 기본 요소에 대응시키려면 새로운 추상화가 필요합니다.

여기에서 새로운 [Agent Sandbox](https://github.com/kubernetes-sigs/agent-sandbox) 프로젝트(현재 SIG Apps 산하에서 개발 중)가 등장합니다.

## 쿠버네티스의 강점(그리고 추상화의 빈틈)

쿠버네티스가 클라우드 네이티브 애플리케이션을 오케스트레이션하는 사실상의 표준인 것은, 확장성과 견고한 네트워킹과 생태계 성숙도라는 과제를 정확히 풀어냈기 때문입니다. 그런데 AI가 수명이 짧은 추론 요청에서 오래 도는 자율 에이전트로 진화하면서, 새로운 운영 패턴이 나타나고 있습니다.

반면 AI 에이전트는 대체로 격리된 스테이트풀 싱글톤(singleton) 워크로드입니다. 대규모 언어 모델(LLM)을 위한 디지털 작업 공간이자 실행 환경 역할을 합니다. 에이전트에는 지속적인 신원과, (대개 신뢰할 수 없는) 코드를 작성하고 실행할 안전한 임시 작업 영역이 필요합니다. 무엇보다도 이 오래 도는 에이전트들은 잠깐씩 몰아치는 활동을 빼면 대부분 유휴 상태일 것으로 예상되므로, 일시 중단과 빠른 재개 같은 메커니즘을 지원하는 라이프사이클이 필요합니다.

이론적으로는 에이전트 하나하나마다 크기 1인 스테이트풀셋(StatefulSet)과 헤드리스 서비스와 퍼시스턴트볼륨클레임(PersistentVolumeClaim)을 엮어 비슷하게 흉내 낼 수 있지만, 규모가 커지면 이를 관리하는 일이 운영상의 악몽이 됩니다.

이런 독특한 성질 때문에 전통적인 쿠버네티스 기본 요소는 딱 들어맞지 않습니다.

## 쿠버네티스 Agent Sandbox 소개

이 빈틈을 메우기 위해 SIG Apps는 [agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox)를 개발하고 있습니다. 이 프로젝트는 AI 에이전트 런타임처럼 싱글톤이면서 스테이트풀한 워크로드에 맞춰 설계된 선언적 표준 API를 도입합니다.

그 핵심으로 이 프로젝트는 Sandbox CRD를 도입합니다. Sandbox는 온전히 쿠버네티스 기본 요소 위에 세워진, 가볍고 컨테이너 하나짜리인 환경으로서 다음을 제공합니다.

* **신뢰할 수 없는 코드에 대한 강력한 격리**: AI 에이전트가 스스로 코드를 생성하고 실행할 때 보안은 무엇보다 중요합니다. Sandbox 커스텀 리소스는 gVisor나 Kata Containers 같은 서로 다른 런타임을 기본으로 지원합니다. 이를 통해 멀티 테넌트 환경에서 신뢰할 수 없는 코드를 실행하는 데 필요한 커널과 네트워크 격리를 제공합니다.
* **라이프사이클 관리**: 꾸준한 스테이트리스 트래픽에 최적화된 전통적인 웹 서버와 달리, AI 에이전트는 작업 사이에 몇 시간씩 유휴 상태로 있을 수도 있는 스테이트풀 작업 공간으로 동작합니다. Agent Sandbox는 리소스를 아끼기 위해 이런 유휴 환경을 0으로 스케일링하는 것을 지원하면서, 멈췄던 지점에서 정확히 재개할 수 있도록 보장합니다.
* **안정적인 신원**: 서로 발을 맞추는 멀티 에이전트 시스템에는 안정적인 네트워킹이 필요합니다. 모든 Sandbox에는 안정적인 호스트네임과 네트워크 신원이 부여되어, 서로 다른 에이전트들이 매끄럽게 서로를 발견하고 통신할 수 있습니다.

## 익스텐션(extension)으로 에이전트 스케일링하기

AI 분야가 믿기 어려울 만큼 빠르게 움직이고 있어서, 반복과 개발을 한층 더 빠르게 할 수 있는 익스텐션 API 계층을 만들었습니다.

새 파드를 시작하는 데는 1초 정도의 오버헤드가 붙습니다. 마이크로서비스의 새 버전을 배포할 때라면 전혀 문제가 되지 않지만, 유휴 상태였던 에이전트를 호출할 때의 1초짜리 콜드 스타트(cold start)는 상호작용의 연속성을 끊습니다. 모델이 생각하거나 행동을 시작하기도 전에, 사용자나 오케스트레이션 서비스가 환경이 프로비저닝되기를 기다려야 하기 때문입니다. SandboxWarmPool은 미리 프로비저닝해 둔 Sandbox 파드 풀을 유지해 이 문제를 풀고, 콜드 스타트를 사실상 없앱니다. 사용자나 오케스트레이션 서비스는 SandboxTemplate에 대해 SandboxClaim을 발행하기만 하면 되고, 컨트롤러는 미리 예열되어 완전히 격리된 환경을 에이전트에 곧바로 넘겨줍니다.

## 빠르게 시작하기

직접 해 볼 준비가 되셨나요? 원하는 릴리스를 골라, 학습용 클러스터나 샌드박스 클러스터에 Agent Sandbox 핵심 컴포넌트와 익스텐션을 바로 설치할 수 있습니다.

프로젝트가 빠르게 움직이고 있으므로 최신 릴리스를 사용하기를 권장합니다.

```bash
# "vX.Y.Z"를 다음 주소에 있는 특정 버전 태그(예: "v0.1.0")로 바꿉니다.
# https://github.com/kubernetes-sigs/agent-sandbox/releases
export VERSION="vX.Y.Z"

# 핵심 컴포넌트를 설치합니다.
kubectl apply -f https://github.com/kubernetes-sigs/agent-sandbox/releases/download/${VERSION}/manifest.yaml

# 익스텐션 컴포넌트를 설치합니다(선택 사항).
kubectl apply -f https://github.com/kubernetes-sigs/agent-sandbox/releases/download/${VERSION}/extensions.yaml

# 파이썬 SDK를 설치합니다(선택 사항).
# 파이썬 가상 환경을 생성합니다.
python3 -m venv .venv
source .venv/bin/activate
# PyPI에서 설치합니다.
pip install k8s-agent-sandbox
```

설치를 마치면 AI 에이전트를 위한 [파이썬 SDK](https://github.com/kubernetes-sigs/agent-sandbox/tree/main/clients/python/agentic-sandbox-client)를 사용해 보거나, 바로 쓸 수 있는 [예제](https://github.com/kubernetes-sigs/agent-sandbox/tree/main/examples) 중 하나를 배포해 격리된 에이전트 환경을 얼마나 쉽게 띄울 수 있는지 확인할 수 있습니다.

## 에이전트의 미래는 클라우드 네이티브입니다

50밀리초짜리 스테이트리스 작업이든, 몇 주에 걸쳐 대부분 유휴 상태로 이어지는 협업 프로세스든, 격리된 스테이트풀 싱글톤을 위해 특별히 설계된 기본 요소로 쿠버네티스를 확장하면 클라우드 네이티브 생태계의 견고한 이점을 모두 활용할 수 있습니다.

Agent Sandbox 프로젝트는 오픈소스이며 커뮤니티가 이끌어 갑니다. AI 플랫폼을 만들고 있거나, 에이전트 프레임워크를 개발하고 있거나, 쿠버네티스 확장성에 관심이 있다면 참여해 주시기 바랍니다.

* GitHub에서 [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox) 프로젝트를 확인해 보세요.
* 쿠버네티스 Slack의 [#sig-apps](https://kubernetes.slack.com/messages/sig-apps)와 [#agent-sandbox](https://kubernetes.slack.com/messages/agent-sandbox) 채널에서 논의에 참여해 보세요.
