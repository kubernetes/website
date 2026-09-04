---
title: 쿠버네티스 한글화 모범 사례
content_type: concept
---
<!-- overview -->

이 문서는 쿠버네티스 문서 한글화 과정에서 자주 반복되는 수정 리뷰 사례와 그에 대한 권장 표현 예시를 모범 사례로 정리한 문서이다.
여러 기여자와 리뷰어의 경험을 바탕으로 작성되었으며, 특히 새로운 기여자들이 쉽게 참고할 수 있도록 구성하였다.

다양한 사례를 체계적으로 살펴볼 수 있도록 다음과 같이 카테고리로 분류한다. 
정렬은 가나다순이다. 

| 구분                          | 설명                                                         |
|-------------------------------|--------------------------------------------------------------|
| [기여 방식](#기여-방식)       | 리뷰 절차, 협업 방식, 규칙 등 기여 과정 전반에 관한 사항     |
| [문체 및 표현](#문체-및-표현) | 번역된 문장의 자연스러움, 어투, 문장 구조 등과 관련된 사항   |
| [원문](#원문)                 | 영어 원문에 대한 번역 방식이나 표기 관련 사항                |
| [용어](#용어)                 | 단어·고유명사 등에 대한 번역 방식이나 표기 관련 사항         |

<!-- body -->


## 모범 사례 문서 기여 지침

본 문서는 누구든지 참고하고, PR을 통해 추가 및 개선할 수 있다.

- 신규 사례를 작성할 때는 다음의 작성 템플릿을 준수한다.
- 추가 사례는 반드시 **한글화 팀 논의**나 **리뷰어 검토** 등 명확한 합의 근거를 확인한 후 등록한다.
- 추가 사례의 경우, 이전 사례와 구분하기 위해 구분선(`---`)을 추가한 뒤 작성한다.
- 사례에는 원문의 불필요한 부분은 제거하고 꼭 필요한 내용만 간결히 기록한다.
- 사례 설명에서 강조가 필요한 부분은 마크다운(Markdown) 서식을 활용한다.

## 작성 템플릿

```md
### (제목은 명사 또는 명사형 종결 어미로 작성)

(간결하게 내용 작성)

#### 예시
* 해당하는 경우에만 작성

**[영어 원문]**
> (내용 작성)

**[권장 번역]**
> (내용 작성)

#### 참고 링크
* 해당하는 경우에만 작성
- (링크)
```

---

# 모범 사례

## 기여 방식

### 리뷰 반영 과정에서는 추가 커밋을 작성하여 변경 사항을 쉽게 확인할 수 있도록 함

- 기여자가 리뷰 반영 과정에서 `amend/squash` 후 `force-push` 를 하게 되면, 기존 리뷰 코멘트가 파일 뷰 라인에 유지되지 않는 문제가 발생한다.
- 그 결과, 리뷰어가 코멘트 위치를 다시 찾아가며 확인해야 하는 어려움이 있다.
- 따라서, 리뷰 과정에서는 **커밋을 누적**하여 변경 의도를 명확히 드러내고, 최종 승인 직전에 **하나의 커밋으로 합치는 것**이 바람직하다.
- 단, 이는 리뷰어와 기여자 간의 합의에 따라 조정할 수 있는 원칙이며, 상황에 따라 예외가 존재할 수 있다.

#### 참고 링크
- [기여 방식 준수 관련 사례(#51845)](https://github.com/kubernetes/website/pull/51845#issuecomment-3213296290)

---

### Github Profile Name은 가급적 영문으로 작성함

- `kubernetes/website` 저장소는 한국어뿐만 아니라 여러 언어가 함께 사용되는 저장소이기 때문이다.

---

### 이슈, 풀 리퀘스트, 커밋 메시지는 영문으로 작성함

- 이슈와 풀 리퀘스트 제목은 반드시 영문으로 작성하며, 본문 역시 가급적 영문으로 작성한다.
- 커밋 메시지는 영문으로 작성하고, 기존 저장소에서 사용 중인 커밋 메시지 스타일을 준수한다.
- `kubernetes/website` 저장소는 한국어뿐만 아니라 여러 언어가 함께 사용되는 저장소이기 때문이다.
- 이슈나 풀 리퀘스트의 내부 코멘트는 한국어 사용이 가능하다.

---

### 한국어 문서 경로 변경을 위한 리다이렉트 파일은 별도의 풀 리퀘스트로 제출함

이미 게시된 한국어 문서를 다른 디렉터리로 이동하면 문서의 URL도 함께 바뀐다.
이때 문서 파일만 이동하면 이전 URL을 저장해 둔 사용자, 다른 웹사이트의 링크,
검색 엔진의 검색 결과로 접근했을 때 404 오류가 발생한다.
이를 방지하려면 이전 한국어 URL로 들어온 요청을 새 한국어 URL로 보내는
**301 리다이렉트**를 함께 준비해야 한다.

새 문서를 처음 추가하여 이전 한국어 URL이 존재하지 않는 경우에는 이 절차가 필요하지 않다.
영어 원문의 이동에 맞추어 이미 게시된 한국어 문서의 경로를 변경하거나,
기존 한국어 문서의 파일명 또는 디렉터리를 변경하는 경우에 적용한다.

#### 리다이렉트 작성 방법

한국어 문서 리다이렉트는 저장소의 `static/_redirects.base` 파일에 다음 형식으로 한 줄을 추가한다.

```text
이전 한국어 경로     새 한국어 경로 301
```

- 첫 번째 경로는 사용자가 기존에 접근하던 URL이고, 두 번째 경로는 문서가 이동한 새 URL이다.
- 마지막의 `301`은 문서가 새 주소로 영구적으로 이동했음을 의미한다.
- 이전 경로와 새 경로는 실제 한국어 웹사이트의 URL과 일치하도록 모두 `/ko`로 시작하고,
  끝에 슬래시(`/`)를 포함한다.

문서 본문에서 `/docs/...` 형식의 내부 링크를 작성할 때는 Hugo가 현재 언어에 맞는 경로를 처리하므로
`/ko`를 수동으로 붙이지 않는다. 반면 `static/_redirects.base`의 규칙은 브라우저가 요청한
실제 URL을 직접 지정하므로 `/ko`를 생략해서는 안 된다.

#### 풀 리퀘스트 제출 방법

문서 이동과 리다이렉트 추가는 하나의 풀 리퀘스트에 함께 넣지 않고 다음과 같이 나누어 제출한다.

1. 한국어 문서를 이동하고 본문을 수정하는 풀 리퀘스트에는 `content/ko/` 아래의 변경만 포함한다.
2. 리다이렉트를 추가하는 별도의 풀 리퀘스트에는 `static/_redirects.base`의 변경만 포함한다.
3. 리뷰어가 두 변경의 관계를 알 수 있도록 각 풀 리퀘스트의 본문에 상대 풀 리퀘스트 링크를 남긴다.

이렇게 분리하는 이유는 `content/ko/`와 `static/_redirects.base`의 OWNERS 범위가 다르기 때문이다.
한국어 콘텐츠 승인자는 `content/ko/`의 변경을 승인할 수 있지만,
저장소 공통 파일인 `static/_redirects.base`의 변경에는 해당 파일에 대한 별도의 승인이 필요하다.

#### 예시

영어 원문의 이동에 맞추어 기존 한국어 HorizontalPodAutoscaler 문서를
다음 경로로 이동하는 경우를 예로 들 수 있다.

```text
/ko/docs/tasks/run-application/horizontal-pod-autoscale/
→ /ko/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/
```

문서 이동과 본문 수정은 한국어 콘텐츠 풀 리퀘스트에 포함하고,
다음 리다이렉트 규칙은 별도의 풀 리퀘스트로 제출한다.

```text
/ko/docs/tasks/run-application/horizontal-pod-autoscale/     /ko/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/ 301
```

#### 참고 링크
- [한국어 문서 경로 변경 사례(#55320)](https://github.com/kubernetes/website/pull/55320)
- [리다이렉트 처리 방식 비교 및 논의 제안(#55320)](https://github.com/kubernetes/website/pull/55320#issuecomment-5192791862)
- [리다이렉트 처리 방식에 관한 한글화 팀 논의(#55320)](https://github.com/kubernetes/website/pull/55320#issuecomment-5311031472)
- [리다이렉트 변경을 별도 풀 리퀘스트로 분리한 사례(#57078)](https://github.com/kubernetes/website/pull/57078)

---

### 용어집(glossary) 현지화 가이드라인

- [용어집(glossary)](/docs/reference/glossary)은 쿠버네티스 문서를 읽는 독자가 용어의 의미를 이해할 수 있도록 정의를 제공한다. 한글화 시, 해당 용어집의 목적을 고려하여 기존 영어 원문의 철자를 그대로 병기하여 독자가 원문의 철자를 빠르게 파악할 수 있도록 돕는다. 원문 병기 방식(예): `title: 파드 (원문, Pod)`, `컨테이너 네트워크 인터페이스(CNI) (원문, Container network interface (CNI))`
단, [쿠버네티스 한글화 가이드](/docs/contribute/localization_ko/#한글화-용어집-정보)에 포함된 용어집은 한글화 방법 자체에 대한 지침이며 여기서 말하는 쿠버네티스 용어집과는 목적이 다르므로, 해당 용어집은 이 방식을 적용하지 않는다.) 

#### 예시

**[영어 원문]**
> title: Pod

**[권장 번역]**
> title: 파드 (원문, Pod)

#### 참고 링크
- [쿠버네티스 한글화 가이드 - 한글화 용어집 정보](/docs/contribute/localization_ko/#한글화-용어집-정보)

---

## 문체 및 표현

### 한국어 문장 부호 체계에 맞게 변환하여 사용함

- 영어 원문에서 사용된 문장 부호는 한국어 문장에서 동일한 기능을 수행하지 못하는 경우가 있으므로,
번역 시에는 한국어 문장 부호 체계에 맞게 조정하는 것을 원칙으로 한다.
- 예를 들어, 콜론(:)은 마침표(.)로 바꾸는 식으로 자연스럽게 변환한다.

#### 예시

**[영어 원문]**
> At the moment, the VPA can operate in four different modes:

**[권장 번역]**
> 현재, VPA는 다음 네 가지 모드로 작동된다.

#### 참고 링크
- [문체 및 표현 준수 관련 사례(#37514)](https://github.com/kubernetes/website/pull/37154#discussion_r987523014)
- [문체 및 표현 준수 관련 사례(#51865)](https://github.com/kubernetes/website/pull/51864#discussion_r2265217513)

---

### 앵커 링크 현지화 가이드라인

- 앵커 링크는 **정확한 이름**으로 지정한다.
- 헤더에 별도의 앵커가 없는 경우, `Minimum required content`  →  `minimum-required-content`와 같은 패턴으로 자동 할당된다.
- 한글로 헤더가 변경되었다면, **영문 앵커 링크도 한글로 변경**한다.
  - ex. `(#minimum-required-content)` → `(#최소-요구-콘텐츠)`
- `GitHub에 현지화 팀 추가하기 {#Add-your-localization-team-in-GitHub}`와 같이 기존 원문에 이미 특별히 영문 앵커가 지정되어 있는 경우가 있다.
  - 이 경우, 해당 앵커는 한글 문서에서도 그대로 영문으로 준용한다.
- 변경 후에 실제 링크가 동작하는지 반드시 확인해야 한다.

#### 예시

**[영어 원문]**
> you must localize all the `[minimum required content](#minimum-required-content)`

**[권장 번역]**
> `[최소 요구 콘텐츠](#최소-요구-콘텐츠)`를 모두 현지화해야 한다.

#### 참고 링크
- [문체 및 표현 준수 관련 사례(#41253)](https://github.com/kubernetes/website/pull/41253#discussion_r1201534937)
- [문체 및 표현 준수 관련 사례(#51871)](https://github.com/kubernetes/website/pull/51871#discussion_r2293015065)

---

### 블로그 게시글 번역 시 격식체를 사용할 수 있음

- 블로그 게시글의 번역은 기술 문서와 달리 블로그 게시글의 성격에 따라서,
격식체(‘~습니다/합니다’체)를 선택적으로 사용할 수 있다.

#### 참고 링크
- [블로그 게시글 번역 사례(#52692)](https://github.com/kubernetes/website/pull/52692/files)

---

### 번역체를 지양함

- `쿠버네티스의 컴포넌트`와 같이 문서에서 격조사 `~의`가 과도하게 사용되지 않도록 불필요한 격조사는 생략하는 것이 좋다.

#### 예시

**[영어 원문]**
> title: Kubernetes Components

**[권장 번역]**
> title: 쿠버네티스 컴포넌트

#### 참고 링크
- [문체 및 표현 준수 관련 사례(#51936)](https://github.com/kubernetes/website/pull/51936#discussion_r2323705504)

---

### 내부 링크 현지화 가이드라인

- `[xxx](/docs/~)`와 같은 형태의 내부 링크에 언어 디렉터리 접두사(`/ko`)를 수동으로 추가하지 않는다. (참고: 풀 리퀘스트 [#47620](https://github.com/kubernetes/website/pull/47620)에 의해서 자동화 되었음.)
  - 기존 문서 수정 과정에서 내부 링크에 `/ko`가 포함되어 있다면 이를 제거한다.
- 단, 원문의 헤더 제목에 별도의 영문 앵커 링크가 지정되어 있는 경우, 해당 앵커의 참조 링크 구문에서도 기존 영문 표기를 유지한다.
  헤더 제목에 별도 명시된 영문 앵커가 없고 제목이 한글로 변환되었다면, 헤더 제목에 따라 자동 생성되는 한국어 앵커로 참조 링크 구문도 수정한다.

#### 예시

**[영어 원문]**
> For more information, see \[Adding and removing issue labels\]\(/docs/contribute/review/for-approvers/#adding-and-removing-issue-labels\).

**[권장 번역]**
> 자세한 내용은 \[이슈 레이블 추가와 제거\]\(/docs/contribute/review/for-approvers/#이슈-레이블-추가와-제거\)를 참고한다.

---

## 원문

### 가급적 원문을 준수함

-  한글화 가이드에서는 가급적 **원문을 준수**하면서 자연스럽게 번역하는 것을 원칙으로 한다.
-  심지어 영어 원문에 오류가 있다 하더라도 **임의로 수정하지 않고** 원문을 따른다. 
   (영어 원문의 오류를 수정한 후, 한글 문서에도 반영한다. SIG Docs Localization Subproject는 현지화 팀의 영어 원문 수정 기여도 매우 권장한다.)
-  원문에 없는 내용이나 양식을 한글 문서에 임의로 추가하지 않는다.

#### 예시

**[영어 원문]**
> If you want to use minikube again to learn more about Kubernetes, you don't need to delete it.

**[권장 번역]**
> 쿠버네티스를 더 배우기 위해 minikube를 다시 사용할 계획이라면, 굳이 삭제하지 않아도 된다.

#### 참고 링크
- [원문 준수 관련 사례(#51845)](https://github.com/kubernetes/website/pull/51845#discussion_r2265583071)
- [원문 준수 관련 사례(#51871)](https://github.com/kubernetes/website/pull/51871#discussion_r2292977719)
- [원문 준수 관련 사례(#51856)](https://github.com/kubernetes/website/pull/51856#discussion_r2265640994)
- [원문 준수 관련 사례(#51864)](https://github.com/kubernetes/website/pull/51864#discussion_r2265211848)

---

### 영어 원문과 유사한 위치에서 개행하여 전체 라인 수를 동일하게 유지함

- 이 규칙은 한글화된 문서의 유지보수성과 리뷰 효율을 높이기 위해 한글화 팀에서 운영하는 원칙이다.
- 영어 원문과 한국어 번역의 구조를 쉽게 비교할 수 있도록 문장 개행 위치를 원문과 가능한 한 유사하게 맞춘다.
- 영어와 한국어의 문장 구조 차이로 인해 개행 지점이 애매한 경우에도, 독자의 이해를 해치지 않는 범위에서 최대한 원문 개행 위치를 고려하여 번역문을 개행한다.
- 이러한 방식으로 작성하면, 영문 원문과 번역문의 총 라인 수가 일치하여 유지보수 및 리뷰 과정에서 차이를 빠르게 식별할 수 있다.

#### 예시

**[영어 원문]**
> Create a namespace so that the resources you create in this exercise are

> isolated from the rest of your cluster.

**[권장 번역]**
> 이 실습에서 생성하는 리소스가 클러스터의 다른 리소스와

> 격리되도록 네임스페이스를 생성한다.

#### 참고 링크
- [원문 준수 관련 사례(#51858)](https://github.com/kubernetes/website/pull/51858#discussion_r2281064968)
- [원문 준수 관련 사례(#51856)](https://github.com/kubernetes/website/pull/51856#discussion_r2265622453)
- [원문 준수 관련 사례(#51864)](https://github.com/kubernetes/website/pull/51864#discussion_r2265212235)

---

## 용어

### 한글화 용어집에 등록되지 않은 용어

- 쿠버네티스 한글화 팀은 한글화 용어집을 준용하며, 등록되지 않은 용어의 경우 논의를 통해 용어집에 등록할 수 있다.
- 자세한 내용은 [쿠버네티스 한글화 가이드](/docs/contribute/localization_ko/#용어-한글화-가이드)를 참고한다.

#### 참고 링크
- [용어 논의 관련 사례(#51885)](https://github.com/kubernetes/website/issues/51885#issuecomment-3301329235)

### 영문 병기는 기본적으로 문서에서 해당 용어가 처음 등장할 때 한 번만 표기함

- 단, 여러 번 표기가 필요한 경우 리뷰어와 기여자가 조율하여 결정할 수 있다.

#### 예시

**[영어 원문]**
> Create a ResourceQuota

> Here is the configuration file for a ResourceQuota object:

**[권장 번역]**
> 리소스쿼터(ResourceQuota) 생성

> 다음은 리소스쿼터 오브젝트에 대한 설정 파일이다.

#### 참고 링크
- [용어 준수 관련 사례(#51858)](https://github.com/kubernetes/website/pull/51858#discussion_r2265551456)

---

### 쿠버네티스 오브젝트 또는 필드 명칭 번역

- [쿠버네티스 문서 한글화 가이드](/docs/contribute/localization_ko/#api-오브젝트-용어-한글화-방침)에서 api 오브젝트 용어 한글화 방침에 대한 내용을 확인할 수 있다.

#### 예시

**[영어 원문]**
> to enforce ... and set resources such as cpu/memory requests and limits.

**[권장 번역]**
> ... cpu 혹은 메모리와 같은 자원의 요청(request)과 상한(limit)을 설정하기 위함이다.

#### 참고 링크
- [용어 준수 관련 사례(#37154)](https://github.com/kubernetes/website/pull/37154#discussion_r987521776)

---

### 한 페이지 내 동일 단어는 일관성 있게 번역함

- 백틱(``)으로 표기된 필드명이나 고유 영단어를 그대로 사용해야 하는 경우를 제외하고, 동일한 단어는 한 페이지 내에서 일관되게 번역한다.
  - 예를 들어, `hostname`, `subdomain` 등이 있다.
- 영어 원문에서 오브젝트명과 일반 용어가 동일한 단어로 혼용되어 있는 경우, 리뷰어와 기여자가 논의를 통해 표기를 결정할 수 있다.
  - 예를 들어, `ServiceAccount`(API 오브젝트명), `Service Account`(일반 용어)가 있다.

#### 참고 링크
- [용어 준수 관련 사례(#51871)](https://github.com/kubernetes/website/pull/51871#discussion_r2292997194)
- [용어 준수 관련 사례(#52692)](https://github.com/kubernetes/website/pull/52692#discussion_r2429679335)
