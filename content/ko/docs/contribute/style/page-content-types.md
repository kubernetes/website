---
title: 페이지 콘텐츠 타입
content_type: concept
weight: 80
---

<!-- overview -->

쿠버네티스 문서는 여러 타입의 페이지 콘텐츠를 따른다.

- 개념
- 태스크
- 튜토리얼
- 레퍼런스

<!-- body -->

## 콘텐츠 섹션

각 페이지 콘텐츠 타입은 마크다운 코멘트와 HTML 헤딩으로 정의된 
여러 섹션을 포함한다. `heading` 숏코드를 사용하여 페이지에 
콘텐츠 헤딩을 추가할 수 있다. 코멘트와 헤딩은 페이지 콘텐츠 타입의 구조를 
유지하는 데 도움이 된다.

페이지 콘텐츠 섹션을 정의하는 마크다운 코멘트의 예시

```markdown
<!-- overview -->
```

```markdown
<!-- body -->
```

콘텐츠 페이지에 공통적인 헤딩을 생성하려면, 헤딩 문자열과 함께 `heading` 숏코드를 
사용한다.

헤딩 문자열 예시

- whatsnext
- prerequisites
- objectives
- cleanup
- synopsis
- seealso
- options

예를 들어, `whatsnext` 헤딩을 생성하려면 "whatsnext" 문자열과 함께 heading 숏코드를 추가한다.

```none
## {{%/* heading "whatsnext" */%}}
```

`prerequisites` 헤딩은 다음과 같이 선언할 수 있다.

```none
## {{%/* heading "prerequisites" */%}}
```

`heading` 숏코드는 하나의 문자열 파라미터를 예상한다.
헤딩 문자열 파라미터는 `i18n/<lang>/<lang>.toml` 파일의 변수 접두사와 일치한다.
예시

`i18n/en/en.toml`:

```toml
[whatsnext_heading]
other = "What's next"
```

`i18n/ko/ko.toml`:

```toml
[whatsnext_heading]
other = "다음 내용"
```

## 콘텐츠 타입

각 콘텐츠 타입은 기대되는 페이지 구조를 비공식적으로 정의한다.
제안된 페이지 섹션으로 페이지 콘텐츠를 생성한다.

### 개념

개념 페이지는 쿠버네티스의 특정 측면을 설명한다. 예를 들어, 개념 페이지는 쿠버네티스 
디플로이먼트 오브젝트를 설명하고 배포, 스케일링, 업데이트된 애플리케이션에 수행하는 
역할을 설명할 수 있다. 일반적으로 개념 페이지는 단계별 순서를 포함하지 않고, 
대신 태스크나 튜토리얼에 대한 링크를 
제공한다.

새 개념 페이지를 작성하려면, `/content/ko/docs/concepts` 디렉터리의 
하위 디렉터리에 다음과 같은 특성을 가진 마크다운 파일을 생성한다.

개념 페이지는 세 개의 섹션으로 나뉜다.

| 페이지 섹션      |
|---------------|
| overview      |
| body          |
| whatsnext     |

`overview`와 `body` 섹션은 개념 페이지에 코멘트로 나타난다.
`heading` 숏코드를 사용하여 페이지에 `whatsnext` 섹션을 추가할 수 있다.

각 섹션을 콘텐츠로 채우도록 한다. 다음 가이드라인을 따른다.

- H2 및 H3 헤딩으로 콘텐츠를 구성한다.
- `overview`의 경우, 단일 문단으로 주제의 컨텍스트를 설정한다.
- `body`의 경우, 개념을 설명한다.
- `whatsnext`의 경우, 개념에 대해 더 학습할 수 있는 주제의 불릿 리스트(최대 5개)를 제공한다.

[어노테이션](https://kubernetes.io/ko/docs/concepts/overview/working-with-objects/annotations/)은 게시된 개념 페이지의 예시이다.

### 태스크

태스크 페이지는 일반적으로 짧은 단계별 순서를 제공하여 단일 작업을 수행하는 방법을 보여준다. 
태스크 페이지는 최소한의 설명을 가지지만, 관련 배경과 지식을 제공하는 
개념 주제에 대한 링크를 종종 제공한다.

새 태스크 페이지를 작성하려면, `/content/ko/docs/tasks` 디렉터리의 하위 디렉터리에 
다음과 같은 특성을 가진 마크다운 파일을 생성한다.

| 페이지 섹션      |
|---------------|
| overview      |
| prerequisites |
| steps         |
| discussion    |
| whatsnext     |

`overview`, `steps`, `discussion` 섹션은 태스크 페이지에 코멘트로 나타난다.
`heading` 숏코드를 사용하여 페이지에 `prerequisites`와 `whatsnext` 
섹션을 추가할 수 있다.

각 섹션 내에 콘텐츠를 작성한다. 이때 다음 가이드라인을 사용한다.

- 최소 H2 헤딩을 사용한다(`#` 문자 두 개로 시작). 섹션 자체는 템플릿에 의해 
  자동으로 제목이 지정된다.
- `overview`의 경우, 전체 주제에 대한 컨텍스트를 설정하기 위해 문단을 사용한다.
- `prerequisites`의 경우, 가능하면 불릿 리스트를 사용한다. `include` 아래에
  추가 전제조건을 추가하여 시작한다. 기본 전제조건에는 실행 중인 쿠버네티스 클러스터가 포함된다.
- `steps`의 경우, 번호 매김 리스트를 사용한다.
- `discussion`의 경우, 일반 콘텐츠를 사용하여 `steps`에 다룬 
  정보를 확장한다.
- `whatsnext`의 경우, 독자가 다음에 읽을 수 있는 최대 5개의 주제 불릿 리스트를 
  제공한다.

게시된 태스크 주제의 예시는 [HTTP 프록시를 사용하여 쿠버네티스 API에 접근](https://v1-32.docs.kubernetes.io/ko/docs/tasks/extend-kubernetes/http-proxy-access-api/)이다.

### 튜토리얼

튜토리얼 페이지는 단일 태스크보다 큰 목표를 달성하는 방법을 보여준다. 
일반적으로 튜토리얼 페이지는 여러 섹션을 가지며, 각 섹션에는 단계별 순서가 있다. 
예를 들어, 튜토리얼은 쿠버네티스의 특정 기능을 설명하는 코드 샘플의 예시를 
제공할 수 있다. 
튜토리얼은 개괄적인 설명을 포함할 수 있지만, 심층적인 설명을
위해서는 관련 개념 주제에 링크로 연결해야 한다.

새 튜토리얼 페이지를 작성하려면, `/content/ko/docs/tutorials` 디렉터리의 
하위 디렉터리에 다음과 같은 특성을 가진 마크다운 파일을 생성한다.

| 페이지 섹션      |
|---------------|
| overview      |
| prerequisites |
| objectives    |
| lessoncontent |
| cleanup       |
| whatsnext     |

`overview`, `objectives`, `lessoncontent` 섹션은 튜토리얼 페이지에 코멘트로 나타난다.
`heading` 숏코드를 사용하여 페이지에 `prerequisites`, `cleanup`, `whatsnext` 
섹션을 추가할 수 있다.

각 섹션 내에 콘텐츠를 작성한다. 이때 다음 가이드라인을 사용하도록 한다.

- 최소 H2 헤딩을 사용한다(`#` 문자 두 개로 시작). 섹션 자체는 템플릿에 의해 
  자동으로 제목이 지정된다.
- `overview`의 경우, 전체 주제에 대한 컨텍스트를 설정하기 위해 문단을 사용한다.
- `prerequisites`의 경우, 가능하면 불릿 리스트를 사용한다. 
  기본적으로 포함된 것들 아래에 추가 전제조건을 추가한다.
- `objectives`의 경우, 불릿 리스트를 사용한다.
- `lessoncontent`의 경우, 적절한 경우 번호 매김 리스트와 설명 콘텐츠를 혼합하여 
  사용한다.
- `cleanup`의 경우, 태스크를 완료한 후 클러스터의 상태를 정리하는 단계를 설명하기 
  위해 번호 매김 리스트를 사용한다.
- `whatsnext`의 경우, 독자가 다음에 읽을 수 있는 최대 5개의 주제 불릿 리스트를
  제공한다.

게시된 튜토리얼 주제의 예시는 
[디플로이먼트(Deployment)로 스테이트리스 애플리케이션 실행하기](https://kubernetes.io/ko/docs/tasks/run-application/run-stateless-application-deployment/)이다.

### 레퍼런스

컴포넌트 도구 레퍼런스 페이지는 쿠버네티스 컴포넌트 도구에 대한 설명과 플래그 옵션 출력을 보여준다. 
각 페이지는 컴포넌트 도구 명령을 사용하는 스크립트에 생성된다.

도구 레퍼런스 페이지는 여러 가능한 섹션을 가진다.

| 페이지 섹션                     |
|------------------------------|
| synopsis                     |
| options                      |
| options from parent commands |
| examples                     |
| seealso                      |

게시된 도구 레퍼런스 페이지의 예시

- [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/)
- [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)
- [kubectl](https://kubernetes.io/ko/docs/reference/kubectl/kubectl/)

## {{% heading "whatsnext" %}}

- [스타일 가이드](/docs/contribute/style/style-guide/)에 대해 학습하기
- [콘텐츠 가이드](/docs/contribute/style/content-guide/)에 대해 학습하기
- [콘텐츠 구성](/docs/contribute/style/content-organization/)에 대해 학습하기
