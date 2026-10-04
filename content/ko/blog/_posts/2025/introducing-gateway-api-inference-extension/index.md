---
layout: blog
title: "게이트웨이 API 추론 익스텐션(Gateway API Inference Extension) 소개"
date: 2025-06-05
slug: introducing-gateway-api-inference-extension
draft: false
author: >
  Daneyon Hansen (Solo.io),
  Kaushik Mitra (Google),
  Jiaxin Shan (Bytedance),
  Kellen Swain (Google)
translator: >
  [Suhyen Im](https://github.com/suhyenim)
---

최신 생성형 AI와 대규모 언어 모델(LLM) 서비스는 쿠버네티스에서 고유한 트래픽 라우팅 과제를
만들어 냅니다. 수명이 짧고 스테이트리스한 일반적인 웹 요청과 달리, LLM 추론(inference) 세션은 대체로
오래 실행되고, 리소스를 많이 사용하며, 부분적으로 스테이트풀합니다. 예를 들어 GPU 기반 단일 모델 서버는
여러 추론 세션을 활성 상태로 두고 메모리 내 토큰 캐시를 유지할 수 있습니다.

HTTP 경로나 라운드 로빈에 초점을 맞춘 기존 로드 밸런서에는 이러한 워크로드에 필요한 특화된 기능이
없습니다. 또한 모델 신원(identity)이나 요청 중요도(criticality, 예: 대화형 채팅 대 배치 잡)를
고려하지 않습니다. 조직은 임시로 만든 해결책을 이어 붙여 쓰는 경우가 많지만, 표준화된 접근 방식은
없습니다.

## 게이트웨이 API 추론 익스텐션

[게이트웨이 API 추론 익스텐션](https://gateway-api-inference-extension.sigs.k8s.io/)은 기존
[게이트웨이 API](https://gateway-api.sigs.k8s.io/)를 기반으로 이 공백을 메우기 위해 만들어졌으며, 게이트웨이(Gateway)와
HTTP라우트(HTTPRoute)라는 익숙한 모델을 유지하면서 추론에 특화된 라우팅 기능을 더합니다. 기존 게이트웨이에 추론
익스텐션을 추가하면 사실상 **추론 게이트웨이**(Inference Gateway)로 바뀌며,
'서비스형 모델(model-as-a-service)' 관점으로 GenAI/LLM을 자체 호스팅할 수 있습니다.

이 프로젝트의 목표는 생태계 전반에서 추론 워크로드로 향하는 라우팅을 개선하고 표준화하는 것입니다. 주요
목표로는 모델을 인식하는 라우팅 활성화, 요청별 중요도 지원, 안전한 모델 롤아웃 촉진, 실시간 모델 메트릭을
기반으로 한 로드 밸런싱 최적화가 있습니다. 이를 달성해 AI 워크로드의 지연 시간(latency)을 줄이고
가속기(GPU) 사용률을 높이는 것을 지향합니다.

## 작동 방식

이 설계는 책임이 서로 구별되는 다음 두 가지 새로운 사용자 정의 리소스(CRD)를 도입하며, 각각은 AI/ML
서빙(serving) 워크플로의 특정 사용자 유형(persona)에 대응합니다.

{{< figure src="inference-extension-resource-model.png" alt="리소스 모델" class="diagram-large" clicktozoom="true" >}}

1. [InferencePool](https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencepool/)
   공유 컴퓨트(예: GPU 노드)에서 실행되는 파드(모델 서버)의 풀을 정의합니다. 플랫폼 관리자는 이 파드가
   어떻게 배포되고, 스케일링되고, 밸런싱되는지 구성할 수 있습니다. InferencePool은 일관된 리소스 사용량을
   보장하고 플랫폼 전반의 정책을 적용합니다. InferencePool은 서비스와 비슷하지만 AI/ML 서빙 요구에
   특화되어 있으며 모델 서빙 프로토콜을 인식합니다.

2. [InferenceModel](https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencemodel/)
   사용자에게 노출되며 AI/ML 소유자가 관리하는 모델 엔드포인트입니다. 공개 이름(예: "gpt-4-chat")을
   InferencePool 안의 실제 모델에 매핑합니다. 이를 통해 워크로드 소유자는 서빙하려는 모델(그리고 선택적인 미세
   조정)에 더해 트래픽 분할 또는 우선순위 정책까지 지정할 수 있습니다.

정리하면, InferenceModel API는 AI/ML 소유자가 무엇을 서빙할지 관리하게 하고, InferencePool은 플랫폼
운영자가 어디에서 어떻게 서빙할지 관리하게 합니다.

## 요청 흐름

요청의 흐름은 게이트웨이 API 모델(게이트웨이와 HTTP라우트)을 기반으로 하며 중간에 추론을 인식하는 단계(익스텐션)가
하나 이상 더 들어갑니다. 다음은 [엔드포인트 선택 익스텐션(Endpoint Selection Extension, ESE)](https://gateway-api-inference-extension.sigs.k8s.io/#endpoint-selection-extension)을
사용한 요청 흐름의 개괄적인 예시입니다.

{{< figure src="inference-extension-request-flow.png" alt="요청 흐름" class="diagram-large" clicktozoom="true" >}}

1. **게이트웨이 라우팅**  
   클라이언트가 요청(예: /completions로 보내는 HTTP POST)을 보냅니다. 게이트웨이(Envoy 등)는 HTTP라우트를
   살펴보고 일치하는 InferencePool 백엔드를 찾습니다.

2. **엔드포인트 선택**  
   게이트웨이는 사용 가능한 아무 파드로 단순히 전달하지 않고, 추론에 특화된 라우팅 익스텐션인
   엔드포인트 선택 익스텐션에 질의해 사용 가능한 파드 중 가장 좋은 것을 고릅니다. 이 익스텐션은 실시간 파드
   메트릭(대기열 길이, 메모리 사용량, 로드된 어댑터)을 살펴 요청에 가장 알맞은 파드를 선택합니다.

3. **추론을 인식하는 스케줄링**  
   선택된 파드는 사용자의 중요도나 리소스 요구를 고려할 때 가장 낮은 지연 시간 또는 가장 높은 효율로
   요청을 처리할 수 있는 파드입니다. 그런 다음 게이트웨이는 해당 파드로 트래픽을 전달합니다.

{{< figure src="inference-extension-epp-scheduling.png" alt="엔드포인트 익스텐션 스케줄링" class="diagram-large" clicktozoom="true" >}}

이 추가 단계는 클라이언트에 여전히 평범한 단일 요청처럼 느껴지면서도 더 똑똑하고 모델을 인식하는
라우팅 메커니즘을 제공합니다. 또한 이 설계는 확장 가능해서, 어떤 추론 게이트웨이든 추론에 특화된 익스텐션을
더해 새로운 라우팅 전략, 고급 스케줄링 로직, 특수한 하드웨어 요구를 처리하도록 보강할 수 있습니다.
프로젝트가 계속 성장하는 만큼, 기여자가 같은 기반 게이트웨이 API 모델과 완전히 호환되는 새 익스텐션을 개발해
효율적이고 지능적인 GenAI/LLM 라우팅의 가능성을 더 넓혀 가기를 권장합니다.

## 벤치마크

[vLLM](https://docs.vllm.ai/en/latest/) 기반 모델 서빙 배포를 대상으로 이 익스텐션을 표준 쿠버네티스
서비스와 비교해 평가했습니다. 테스트 환경은 쿠버네티스 클러스터에서 vLLM([버전 1](https://blog.vllm.ai/2025/01/27/v1-alpha-release.html))을
실행하는 H100(80 GB) GPU 파드 여러 대와 Llama2 모델 레플리카 10개로 이루어졌습니다. 트래픽을 생성하고
처리량(throughput), 지연 시간 등의 메트릭을 측정하는 데는 [Latency Profile Generator(LPG)](https://github.com/AI-Hypercomputer/inference-benchmark) 도구를 썼습니다. 워크로드로는
[ShareGPT](https://huggingface.co/datasets/anon8231489123/ShareGPT_Vicuna_unfiltered/resolve/main/ShareGPT_V3_unfiltered_cleaned_split.json)
데이터셋을 썼고, 트래픽은 초당 쿼리 수(Queries per Second, QPS) 100에서 1000 QPS까지 점진적으로 올렸습니다.

### 주요 결과

{{< figure src="inference-extension-benchmark.png" alt="엔드포인트 익스텐션 스케줄링" class="diagram-large" clicktozoom="true" >}}

- **비슷한 처리량**: 테스트한 QPS 구간 전체에서 ESE는 표준 쿠버네티스 서비스와 거의 같은 수준의
  처리량을 냈습니다.

- **더 낮은 지연 시간**:
  - **출력 토큰당 지연 시간**: ESE는 더 높은 QPS(500 이상)에서 p90 지연 시간이 뚜렷하게 낮았고, 이는
  모델을 인식하는 라우팅 결정이 GPU 메모리가 포화 상태에 가까워질 때 대기와 리소스 경합을 줄인다는 것을 보여 줍니다.
  - **전체 p90 지연 시간**: 비슷한 경향이 나타났으며, 특히 트래픽이 400~500 QPS를 넘어서면서 ESE가 기준선보다
  종단 간 테일 지연 시간(tail latency)을 줄였습니다.

이러한 결과는 이 익스텐션에서 모델을 인식하는 라우팅이 GPU 기반 LLM 워크로드의 지연 시간을 뚜렷하게 줄였음을
시사합니다. 부하가 가장 적거나 성능이 가장 좋은 모델 서버를 동적으로 선택하기 때문에, 크고 오래 실행되는
추론 요청에 기존 로드 밸런싱 방법을 쓸 때 나타날 수 있는 핫스팟(hotspot)을 피합니다.

## 로드맵

게이트웨이 API 추론 익스텐션이 일반 공개(GA)를 향해 가는 가운데, 계획된 기능은 다음과 같습니다.

1. 원격 캐시용 **접두사 캐시(prefix-cache)를 인식하는 로드 밸런싱**
2. 자동 롤아웃용 **LoRA 어댑터 파이프라인**
3. 동일한 중요도 대역에 속한 워크로드 사이의 **공정성과 우선순위**
4. 집계된 모델별 메트릭 기반 스케일링용 **HPA 지원**
5. **대규모 멀티모달(multi-modal) 입출력 지원**
6. **추가 모델 타입** (예: 디퓨전(diffusion) 모델)
7. **이기종 가속기** (지연 시간과 비용을 인식하는 로드 밸런싱으로 여러 가속기 타입에서 서빙)
8. 풀을 독립적으로 스케일링하기 위한 **분리형 서빙(disaggregated serving)**

## 요약

게이트웨이 API 추론 익스텐션은 모델 서빙을 쿠버네티스 네이티브 도구와 맞추어, AI/ML 트래픽을 라우팅하는
방식을 단순화하고 표준화하는 것을 목표로 합니다. 모델을 인식하는 라우팅, 중요도 기반 우선순위 지정 등을
통해 운영 팀이 적합한 LLM 서비스를 적합한 사용자에게 매끄럽고 효율적으로 제공하도록 돕습니다.

**더 알아보고 싶으신가요?** [프로젝트 문서](https://gateway-api-inference-extension.sigs.k8s.io/)를 방문해 깊이 살펴보고,
몇 가지 [간단한 단계](https://gateway-api-inference-extension.sigs.k8s.io/guides/)로 추론 게이트웨이 익스텐션을 사용해 보고,
프로젝트에 기여하는 데 관심이 있다면
[참여해 보세요](https://gateway-api-inference-extension.sigs.k8s.io/contributing/)!
