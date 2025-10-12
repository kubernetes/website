---
title: 쿠버네티스 한글화 모범 사례
content_type: concept
---
<!-- overview -->

이 문서는 쿠버네티스 공식 문서를 한국어로 번역할 때 흔히 나타날 수 있는 사례와 그에 대한 권장 번역 예시를 정리한 것이다.
여러 기여자와 리뷰어들이 함께 살펴본 내용을 모아 정리했으며, 새로운 기여자들도 한눈에 참고할 수 있도록 작성했다.

아래 항목들은 실제 리뷰에서 발췌한 예시, 설명, 그리고 참고할 수 있는 리뷰 링크로 구성되어 있다.
한글화에 기여하는 누구나 참고하고, 필요하면 업데이트할 수 있다.

<!-- body -->

## 카테고리

비슷한 사례를 범주화하여 체계적으로 살펴볼 수 있도록 하기 위해 모범 사례를 카테고리로 구분한다. 

| 구분     | 설명                                           |
|----------|----------------------------------------------|
| 이슈     | 한글화 팀 내에서 진행된 논의 및 이슈                   |
| 번역     | 한국어 문체 및 표현 관련 사항                        |
| 원문     | 영어 원문 관련                                    |
| 용어     | 특정 용어에 대한 번역 방식                           |
| 프로세스  | 기여 프로세스 관련                                 |
| 형식     | 문서 형식 관련 규칙                                |


## 예시 탬플릿
```md
#### [(카테고리)] (내용 작성)

#### 예시
* 해당하는 경우에만 작성

**[영어 원문]**
> (내용 작성)

**[권장 번역]**
> (내용 작성)

#### 설명
- (내용 작성)

#### 참고 링크
- (링크)
```

## 기여 지침

- 새로운 사례를 작성할 때는 위의 예시 템플릿을 따른다.
- 추가되는 사례는 반드시 **한글화 팀 내 논의**나 **리뷰어의 검토** 등 근거가 확인된 내용이어야 한다.
- 원문의 불필요한 부분은 제거하고 필요한 문장만 가져온다.
- 이전 사례와 구분하기 위해 구분선(`---`)을 그은 뒤 작성한다.
- 설명에서 강조할 부분이 있을 때는 **마크다운**을 활용한다.

## 모범 사례

---

#### [이슈] 한글화 용어집에 등록되지 않은 용어

#### 설명
- 쿠버네티스 한글화 팀은 국립국어원에서 정한 표준어 사용을 우선으로 한다.
- 단, 논의를 통해 표준어가 아닌 단어도 용어집에 등록할 수 있다.
- 예를 들어, 표준어가 아니더라도 업계에서 널리 사용되어 표준어로 번역하면 오히려 어색하게 느껴지는 경우가 이에 해당한다.

#### 참고 링크
- https://github.com/kubernetes/website/issues/51885#issuecomment-3301329235

---

#### [프로세스] 리뷰 반영 과정에서는 추가 커밋을 작성하여 변경 사항을 쉽게 확인할 수 있도록 한다.

#### 설명
- 기여자가 리뷰 반영 과정에서 amend/squash 후 force-push를 하게 되면, 기존 리뷰 코멘트가 파일 뷰 라인에 유지되지 않는 문제가 발생한다.
- 그 결과, 리뷰어가 코멘트 위치를 다시 찾아가며 확인해야 하는 어려움이 있다.
- 따라서, 리뷰 과정에서는 **커밋을 누적**하여 변경 의도를 명확히 드러내고, 최종 승인 직전에 하나의 커밋으로 합치는 것이 바람직하다.
- 단, 이는 리뷰어와 기여자 간의 합의에 따라 조정할 수 있는 원칙이며, 상황에 따라 예외가 존재할 수 있다.

#### 참고 링크
- https://github.com/kubernetes/website/pull/51845#issuecomment-3213296290

---

#### [원문] 가급적 원문을 준수한다.

#### 예시

**[영어 원문]**
> If you want to use minikube again to learn more about Kubernetes, you don't need to delete it.

**[권장 번역]**
> 쿠버네티스를 더 배우기 위해 minikube를 다시 사용할 계획이라면, 굳이 삭제하지 않아도 된다.

#### 설명
-  한글화 가이드에서는 가급적 원문을 준수하면서 자연스럽게 번역하는 것을 원칙으로 한다.
-  심지어 영어 원문에 오류가 있다 하더라도 임의로 수정하지 않고 원문을 따른다.
-  원문에 포함되지 않는 내용은 추가하지 않는다.
  -  보기 좋도록 토글 등을 사용해 수정하지 않는다.

#### 참고 링크
- https://github.com/kubernetes/website/pull/51845#discussion_r2265583071
- https://github.com/kubernetes/website/pull/51871#discussion_r2292977719
- https://github.com/kubernetes/website/pull/51856#discussion_r2265640994
- https://github.com/kubernetes/website/pull/51864#discussion_r2265211848

---

#### [원문] 영어 원문과 유사하게 개행하여 총 라인 수를 같게 한다.

#### 예시

**[영어 원문]**
> Create a namespace so that the resources you create in this exercise are

> isolated from the rest of your cluster.

**[권장 번역]**
> 이 실습에서 생성하는 리소스가 클러스터의 다른 리소스와

> 격리되도록 네임스페이스를 생성한다.

#### 설명
- 한글화 된 문서의 유지보수 및 리뷰의 효율을 위해 한글화 팀에서 유지하고 있는 규칙이다.
- 영어와 한국어의 문장 구조 차이로 인해 개행 위치가 애매한 경우에도 적절히 판단하여 개행한다.
- 결과적으로 **영어 원문과 한국어 번역의 총 라인 수가 같아야 한다.**

#### 참고 링크
- https://github.com/kubernetes/website/pull/51858#discussion_r2281064968
- https://github.com/kubernetes/website/pull/51856#discussion_r2265622453
- https://github.com/kubernetes/website/pull/51864#discussion_r2265212235

---

#### [용어] 영문 병기는 기본적으로 문서에서 해당 용어가 처음 등장할 때 한 번만 표기해도 된다.

#### 예시

**[영어 원문]**
> Create a ResourceQuota

> Here is the configuration file for a ResourceQuota object:

**[권장 번역]**
> 리소스쿼터(ResourceQuota) 생성

> 다음은 리소스쿼터 오브젝트에 대한 설정 파일이다.

#### 설명
- 단, 여러번 표기가 필요한 경우 리뷰어와 컨트리뷰터가 조율하여 결정할 수 있다.

#### 참고 링크
- https://github.com/kubernetes/website/pull/51858#discussion_r2265551456

---

#### [번역] 영어 원문의 `:`은 한국어에서 어색하므로, 대신 `.`를 사용한다.

#### 예시

**[영어 원문]**
> At the moment, the VPA can operate in four different modes:

**[권장 번역]**
> 현재, VPA는 다음 네 가지 모드로 작동된다.

#### 설명
- 예시나 추가 설명을 이어갈 때, 한국어에서는 콜론(`:`)보다 마침표(`.`)가 더 자연스럽기 때문이다.

#### 참고 링크
- https://github.com/kubernetes/website/pull/37154#discussion_r987523014
- https://github.com/kubernetes/website/pull/51864#discussion_r2265217513

---

#### [번역] 앵커 링크에 대하여

#### 예시

**[영어 원문]**
> you must localize all the `[minimum required content](#minimum-required-content)`

**[권장 번역]**
> `[최소 요구 콘텐츠](#최소-요구-콘텐츠)`를 모두 현지화해야 한다.

#### 설명
- 앵커 링크는 **정확한 이름**으로 지정해야 한다.
- 헤더에 별도의 앵커가 없는 경우, `Minimum required content`  →  `minimum-required-content`와 같은 패턴으로 자동 할당된다.
- 한글로 헤더가 변경되었다면, **영문 앵커 링크도 한글로 변경**되어야 한다.
  - ex. `(#minimum-required-content)` → `(#최소-요구-콘텐츠)`
- `GitHub에 현지화 팀 추가하기 {#Add-your-localization-team-in-GitHub}`와 같이 기존 원문에 이미 특별히 영문 앵커가 지정되어 있는 경우가 있다.
  - 이 경우, 해당 앵커는 한글 문서에서도 그대로 영문으로 준용한다.
- 변경 후에 실제 링크가 동작하는지 반드시 확인해야 한다.

#### 참고 링크
- https://github.com/kubernetes/website/pull/41253#discussion_r1201534937
- https://github.com/kubernetes/website/pull/51871#discussion_r2293015065

---

#### [번역] 한 페이지 내 동일 단어는 일관성 있게 번역한다.

#### 설명
- `spec` 등 필드명이나 고유 영단어를 그대로 사용해야 하는 경우를 제외하고, 같은 단어는 한 페이지 내에서 일관되게 번역해야 한다.
  - 예를 들어, `hostname`, `subdomain` 등이 있다.

#### 참고 링크
- https://github.com/kubernetes/website/pull/51871#discussion_r2292997194

---

#### [형식] 자주 실수하는 일본어 번역투에 주의한다.

#### 예시

**[영어 원문]**
> title: Kubernetes Components

**[권장 번역]**
> title: 쿠버네티스 컴포넌트

#### 설명
- `쿠버네티스의 컴포넌트`와 같이 문서에서 격조사 `~의`가 과도하게 사용되지 않도록 불필요한 격조사는 생략하는 것이 좋다.

#### 참고 링크
- https://github.com/kubernetes/website/pull/51936#discussion_r2323705504

---

#### [번역] 번역 내용에 쿠버네티스 오브젝트 또는 필드의 명칭이 포함된 경우

#### 예시

**[영어 원문]**
> to enforce ... and set resources such as cpu/memory requests and limits.

**[권장 번역]**
> ... cpu 혹은 메모리와 같은 자원의 요청(request)과 상한(limit)을 설정하기 위함이다.

#### 설명
- 먼저, [한글화 용어집](https://kubernetes.io/ko/docs/contribute/localization_ko/#%ED%95%9C%EA%B8%80%ED%99%94-%EC%9A%A9%EC%96%B4%EC%A7%91)에 해당 단어가 등록되어 있는지 확인한다.
- 한글화 용어집에 있는 경우 이를 따르고, 없는 경우 번역 대상이 쿠버네티스 오브젝트나 필드 명칭이면 영문 병기를 통해 구분한다.

#### 참고 링크
- https://github.com/kubernetes/website/pull/37154#discussion_r987521776