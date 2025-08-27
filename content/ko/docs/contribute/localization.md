---
title: 쿠버네티스 문서 현지화
content_type: concept
# approvers:
# - remyleone
# - rlenferink
weight: 50
card:
  name: contribute
  weight: 50
  title: 쿠버네티스 문서 현지화
---

<!-- overview -->

이 페이지는 다른 언어로 문서를
[현지화](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/)
하는 방법에 대해 설명한다.

<!-- body -->

## 쿠버네티스 문서 현지화에 기여하기

당신은 현지화 문서의 내용을 추가하거나 개선하는 데 도움을 줄 수 있다.
[쿠버네티스 Slack](https://slack.k8s.io/)에서는, 각 언어별 현지화 채널을
찾을 수 있다. 물론 인사말을 나눌 수 있는 일반적인
[SIG Docs Localizations Slack 채널](https://kubernetes.slack.com/messages/sig-docs-localizations)도
있다.

{{< note >}}
어떻게 현지화에 기여하는지에 대한 상세 내용은,
이 페이지의 각 언어별 현지화 버전에서 확인할 수 있다.
{{< /note >}}

### 각 언어별 두 자리 코드 찾기

먼저,
[ISO 639-1 표준](https://www.loc.gov/standards/iso639-2/php/code_list.php)
을 참조하여 해당 현지화의 두 자리 언어 코드를 찾는다. 예를 들어, 한국어의
두 자리 코드는 `ko`이다.

일부 언어는 언어 코드와 함께 ISO-3166에서 정의한 소문자 국가 코드를
사용한다. 예를 들어, 브라질에서 사용하는 포르투갈어의
언어 코드는 `pt-br`이다.

### 저장소를 포크(fork) 및 클론(clone) 하기 {#fork-and-clone-the-repo}

첫번째로, [kubernetes/website](https://github.com/kubernetes/website) 저장소를
자신의 저장소로 [포크](/ko/docs/contribute/new-content/open-a-pr/#fork-the-repo)한다.

그런 다음, 포크한 저장소를 클론하고 `cd` 명령어로 해당 디렉터리에 들어간다.

```shell
git clone https://github.com/<username>/website
cd website
```

website의 content 디렉터리에는 각 언어별 하위 디렉터리가 포함되어 있다. 현지화
문서는 `content/<두 자리 코드>` 디렉터리 안에 있다.

### 변경 제안하기

영어 원문을 기준으로 선택한 현지화 페이지를 생성하거나 업데이트한다. 자세한
내용은 [콘텐츠 현지화](#콘텐츠-현지화)를 참고한다.

업스트림(영문)의 기술적인 부정확성이나 기타 문제를
발견한 경우, 먼저 업스트림(영문)을 수정한 뒤
동일한 수정을 작업 중인 현지화 문서에도 반영한다.

풀 리퀘스트의 변경 사항은 하나의 현지화로만 제한한다. 여러 현지화
콘텐츠를 변경하는 풀 리퀘스트는 검토하기 어렵기 때문이다.

해당 현지화에 변경 사항을 제안하려면 [콘텐츠 개선 제안](/docs/contribute/suggesting-improvements/)
을 따른다. 이 과정은 업스트림(영문) 콘텐츠에 변경 사항을
제안하는 과정과 유사하다.

## 신규 언어 현지화 시작하기

쿠버네티스 문서를 신규 언어로 현지화하려면, 다음과
같은 절차를 따라야 한다.

기여자는 자신의 풀 리퀘스트를 스스로 승인할 수 없기 때문에, 현지화를
시작하려면 _최소한 두 명 이상의 기여자_가 있어야 한다.

모든 현지화 팀은 자체 관리가 가능해야 한다. 쿠버네티스 웹사이트는 
작업물을 호스팅하도록 제공할 뿐, 번역을 수행하고 기존 현지화를 최신 상태로 유지하는 것은
전적으로 여러분들의 책임이다.

당신의 언어의 두 글자 언어 코드를 알아야 한다.
[ISO 639-1 표준](https://www.loc.gov/standards/iso639-2/php/code_list.php)을 참조하여
해당 현지화의 두 자리 언어 코드를 찾는다. 예를 들어, 한국어의 
두 자리 코드는 `ko`이다.

만약 기여하고자 하는 언어가 여러 지역
및 나라에서 사용하는 언어인 경우, 소문자로 된 ISO-3166 국가 코드와
언어 코드를 결합하는 것이 좋을 수 있다.
예를 들어, 브라질에서 사용하는 포르투갈 언어의 경우 `pt-br`이다.

신규 현지화를 시작할 때는, 쿠버네티스 프로젝트가
변경 사항을 라이브 웹사이트에 반영하기 전에
[최소 요구 콘텐츠](#최소-요구-콘텐츠)를 모두
현지화해야 한다.

SIG Docs는 별도의 브랜치에서 작업할 수 있도록 도와주어
그 목표를 단계적으로 달성할 수 있게 한다.

### 커뮤니티 찾기

현지화에 관심이 있다면 쿠버네티스 SIG Docs에 알린다.
[SIG Docs Slack 채널](https://kubernetes.slack.com/messages/sig-docs)과
[SIG Docs Localizations Slack 채널](https://kubernetes.slack.com/messages/sig-docs-localizations)에 참여하면,
다른 현지화 팀들이 신규 팀이 시작할 수 있도록 도움을 주고 질문에도 친절히
답변해줄 것이다.

또한, [SIG Docs Localization Subgroup meeting](https://github.com/kubernetes/community/tree/master/sig-docs)
에도 참여를 고려해보길 바란다.
SIG Docs localization subgroup의 목표는 SIG Docs의
여러 현지화 팀들이 협력하여 각 언어별 기여 가이드를 만드는 프로세스를
정의하고 문서화하는 것이다. 또한, SIG Docs localization subgroup은
여러 현지화 팀이 함께 사용할 수 있는 공통 도구를 만들고 공유할 기회를 모색하고,
SIG Docs Leadership team이 고려해야 할 새로운 요구사항을 식별하는 역할도 한다.
이 회의에 대해 궁금한 점이 있다면
[SIG Docs Localizations Slack 채널](https://kubernetes.slack.com/messages/sig-docs-localizations)에 문의하면 된다.

또한, `kubernetes/community` 저장소 안에
현지화를 위한 Slack 채널을 생성할 수 있다. Slack 채널 추가에 대한 예시는
[페르시아어 채널 추가 PR](https://github.com/kubernetes/community/pull/4980)에서 확인할 수 있다.

### 쿠버네티스 Github organization에 가입하기

현지화 PR을 생성했다면, 쿠버네티스 Github organization의 멤버
될 수 있다. 팀의 각 멤버는 `kubernetes/org` 저장소에서 자신의
[Organization 멤버십 요청](https://github.com/kubernetes/org/issues/new/choose)을
직접 생성해야 한다.

### GitHub에 현지화 팀 추가하기 {#Add-your-localization-team-in-GitHub}

다음으로, 쿠버네티스 현지화 팀을
[`sig-docs/teams.yaml`](https://github.com/kubernetes/org/blob/main/config/kubernetes/sig-docs/teams.yaml)에 직접 추가한다.
현지화 팀 등록 예시는
[스페인어 현지화 팀 추가 PR](https://github.com/kubernetes/org/pull/685)에서 확인할 수 있다.

`@kubernetes/sig-docs-**-owners` 팀의 멤버는 
해당 현지화 디렉터리(`/content/**/`) 내의 콘텐츠 변경 PR만 승인할 수 있다. 각
현지화에 대해, `@kubernetes/sig-docs-**-reviews` 팀이 신규 PR의 리뷰어를
자동으로 지정한다. `@kubernetes/website-maintainers` 팀의 멤버는
번역 작업을 조율하기 위해 신규 현지화 브랜치를 생성할 수 있다.
`@kubernetes/website-milestone-maintainers` 팀의 멤버는 `/milestone`
[Prow 명령어](https://prow.k8s.io/command-help)를 사용하여 이슈나 PR에 마일스톤을 할당할 수 있다.

### 워크플로 구성하기

다음으로, `kubernetes/test-infra` 저장소에 현지화용 Github 라벨을 
추가한다. 라벨은 특정 언어에 해당하는 이슈와 풀 리퀘스트를 필터링하는 데
사용된다.

레이블 추가 예시는
[이탈리아어 레이블 추가 PR](https://github.com/kubernetes/test-infra/pull/11316)에서 확인할 수 있다.

### 사이트 구성 수정하기

쿠버네티스 웹사이트는 Hugo를 웹 프레임워크로 사용한다. 웹사이트의 Hugo에
대한 구성은
[`hugo.toml`](https://github.com/kubernetes/website/tree/main/hugo.toml)
파일에 있다. 신규 현지화를 지원하려면 `hugo.toml`을 수정해야 한다.

`hogo.toml`의 기존 [languages] 블록 아래에 신규 언어에 대한
구성 블록을 추가한다. 예를 들어, 독일어 블록은 다음과 같다.

```toml
[languages.de]
title = "Kubernetes"
languageName = "Deutsch (German)"
weight = 5
contentDir = "content/de"
languagedirection = "ltr"

[languages.de.params]
time_format_blog = "02.01.2006"
language_alternatives = ["en"]
description = "Produktionsreife Container-Orchestrierung"
languageNameLatinScript = "Deutsch"
```

언어 선택 바(bar)에는 `languageName` 값이 표시된다. `languageName`에는
“자국 문자로 된 언어명 (영문 표기)” 형식으로 값을
지정한다. 예를 들어, `languageName = "한국어 (Korean)"` 또는 `languageName =
"Deutsch (German)"`와 같이 설정한다.

`languageNameLatinScript`는 라틴 문자로 된 언어명을 가져와
테마에서 사용할 수 있다. languageNameLatinScript에는 “라틴 문자로 된 언어명”을
지정한다. 예를 들어, `languageNameLatinScript = "Korean"` 또는
`languageNameLatinScript = "Deutsch"`롸 같이 설정한다.

`weight` 매개변수는 언어 선택 바에서 언어의 표시 순서를 결정한다.
값이 낮을수록 우선순위가 높아, 해당 언어가 먼저 표시된다.
`weight`를 지정할 때는 기존 언어 블록의 값을
확인하고, 신규로 추가되는 언어를 포함하여
모든 언어의 순서가 올바르게 정렬되도록 조정해야 한다.

Hugo의 다국어 지원에 대한 자세한 내용은
[다국어 모드](https://gohugo.io/content-management/multilingual/)에서 확인할 수 있다.

### 신규 현지화 디렉터리 추가하기

저장소의 [`content`](https://github.com/kubernetes/website/tree/main/content) 폴더에
언어별 하위 디렉터리를
추가한다. 예를 들어, 독일어의 두 자리 코드는 `de`이다.

```shell
mkdir content/de
```

또한 [현지화된 문자열](#i18n의-사이트-문자열)을 위해
`i18n` 안에 디렉터리를 생성해야 한다. 예시는 기존 현지화를
참고한다.

예를 들어, 독일어의 경우 문자열은 `i18n/de/de.toml`에 있다.

### 커뮤니티 행동 강령 현지화

해당 언어로 된 행동 강령을 추가하려면
[`cncf/foundation`](https://github.com/cncf/foundation/tree/main/code-of-conduct-languages)
저장소에 PR을 열면 된다.

### OWNERS 파일 설정하기

현지화에 기여하는 각 사용자의 역할을 지정하려면, 
언어별 하위 디렉터리 안에 `OWNERS` 파일을 생성하고 다음 내용을 추가한다.

- **reviewers**: 리뷰어 역할을 가진 쿠버네티스 팀 목록.
- 이 경우, [GitHub에 현지화 팀 추가하기](#Add-your-localization-team-in-GitHub) 단계에서 생성한 `sig-docs-**-reviews` 팀이다.
- **approvers**: 승인자 역할을 가진 쿠버네티스 팀 목록.
- 이 경우, [GitHub에 현지화 팀 추가하기](#Add-your-localization-team-in-GitHub) 단계에서 생성한 `sig-docs-**-owners` 팀이다.
- **labels**: PR에 자동으로 적용할 Github 라벨 목록. 이 경우,
[워크플로 구성하기](#워크플로-구성하기) 단계에서 생성한 언어 라벨이다다.

OWNERS 파일에 대한 더 많은 정보는
[go.k8s.io/owners](https://go.k8s.io/owners)에서 확인할 수 있다.

언어 코드 `es`를 사용하는
[스페인어 OWNERS 파일](https://git.k8s.io/website/content/es/OWNERS)은 다음과 같다.

```yaml
# See the OWNERS docs at https://go.k8s.io/owners

# This is the localization project for Spanish.
# Teams and members are visible at https://github.com/orgs/kubernetes/teams.

reviewers:
- sig-docs-es-reviews

approvers:
- sig-docs-es-owners

labels:
- area/localization
- language/es
```

언어별 OWNERS 파일을 추가한 후, [root
`OWNERS_ALIASES`](https://git.k8s.io/website/OWNERS_ALIASES) 파일에
해당 현지화의 신규 쿠버네티스 팀인 `sig-docs-**-owners`와
`sig-docs-**-reviews`를 업데이트한다.

각 팀에는, [GitHub에 현지화 팀 추가하기](#Add-your-localization-team-in-GitHub)에서
요청한 GitHub 사용자 목록을
알파벳 순으로 추가한다.

```diff
--- a/OWNERS_ALIASES
+++ b/OWNERS_ALIASES
@@ -48,6 +48,14 @@ aliases:
     - stewart-yu
     - xiangpengzhao
     - zhangxiaoyu-zidif
+  sig-docs-es-owners: # Admins for Spanish content
+    - alexbrand
+    - raelga
+  sig-docs-es-reviews: # PR reviews for Spanish content
+    - alexbrand
+    - electrocucaracha
+    - glo-pena
+    - raelga
   sig-docs-fr-owners: # Admins for French content
     - perriea
     - remyleone
```

### 풀 리퀘스트 생성하기

다음으로, `kubernetes/website` 저장소에 현지화를 추가하기 위해
[풀 리퀘스트를 생성](/docs/contribute/new-content/open-a-pr/#open-a-pr)한다. 이 PR은
승인되기 전에 [최소 요구 콘텐츠](#최소-요구-콘텐츠)를
모두 포함해야 한다.

신규 현지화를 추가한 예시는
[프랑스어 문서 PR](https://github.com/kubernetes/website/pull/12548)에서 확인할 수 있다.

### 현지화된 README 파일 추가하기

다른 현지화 기여자를 안내하기 위해,
[`kubernetes/website`](https://github.com/kubernetes/website/) 최상위 디렉터리에
새로운 [`README-**.md`](https://help.github.com/articles/about-readmes/) 파일을 추가한다. 여기서 
`**`는 두 자리 코드를 의미한다. 예를 들어, 독일어의 README 파일은
`README-de.md`가 된다.

현지화된 `README-**.md` 파일에는 현지화 기여자를 위한 안내 내용을 작성한다.
`README.md`에 포함된 내용과 함께 다음 항목도 포함해야 한다.

- 현지화 프로젝트의 연락 담당자
- 현지화와 관련된 특정 정보

현지화된 README를 만든 후에는, 메인
영어 `README.md`에 해당 파일로 연결되는 링크를 추가하고, 영어로 된 연락처 정보를 포함한다. 연락은
GitHub ID, 이메일 주소, [`Slack 채널`](https://slack.com/) 또는 기타 방법을 제공할 수 있다.
또한, 현지화된 커뮤니티 행동 강령 링크도 반드시
제공해야 한다.

### 신규 현지화 작업 공개하기

현지화 작업이 워크플로우 최소 산출물 요건을 충족하면, SIG
Docs는 다음을 수행한다.

- 웹사이트에서 언어 선택 기능을 활성화한다.
- [Cloud Native Computing Foundation](https://www.cncf.io/about/)(CNCF) 채널,
[쿠버네티스 블로그](/blog/) 등을 통해
신규 현지화 공개를 홍보한다.

## 콘텐츠 현지화

쿠버네티스 문서 *전체*를 현지화하는 일은 매우 방대한 작업이다. 처음에는 작게
시작하여 시간이 지나면서 확장하는 방식도 괜찮다.

### 최소 요구 콘텐츠

모든 현지화에는 최소한 다음 항목이 포함되어야 한다.

설명 | URLs
-----|-----
홈 | [All heading and subheading URLs](/docs/home/)
설치 | [All heading and subheading URLs](/docs/setup/)
튜토리얼 | [Kubernetes Basics](/docs/tutorials/kubernetes-basics/), [Hello Minikube](/docs/tutorials/hello-minikube/)
사이트 문자열 | [모든 사이트 문자열](#i18n의-사이트-문자열) in a new localized TOML file
릴리스 | [All heading and subheading URLs](/releases)

번역된 문서는 반드시 해당 언어의 `content/**/` 하위 디렉터리에 있어야 하며, 그 외에는
영문 원본과 동일한 URL 경로를 따라야 한다. 예를 들어,
[쿠버네티스 기본](/docs/tutorials/kubernetes-basics/) 튜토리얼을 독일어로 번역하려면,
`content/de/` 디렉터리 아래에 하위 디렉터리를 만들고 영어 원본 또는 디렉터리를 복사한다.

```shell
mkdir -p content/de/docs/tutorials
cp -ra content/en/docs/tutorials/kubernetes-basics/ content/de/docs/tutorials/
```

번역 도구를 사용하면 번역 속도를 높일 수 있다. 예를 들어, 일부
편집기는 텍스트를 빠르게 번역할 수 있는 플러그인을 제공한다.

{{< caution >}}
기계 번역만으로는 충분하지 않다. 현지화는
최소 품질 기준을 충족하기 위해 반드시 광범위한 사람의 검수가 필요하다.
{{< /caution >}}

문법과 의미의 정확성을 보장하려면, 현지화 팀 멤버가
게시 전에 모든 기계 번역 결과를 꼼꼼히 검토해야 한다.

### SVG 이미지 현지화하기

쿠버네티스 프로젝트에서는 가능하면 벡터(SVG) 이미지를 사용할 것을 권장한다.
벡터 이미지는 현지화 팀이 수정하기 훨씬 쉽기 때문이다. 현지화가 필요한
래스터(raster) 이미지를 발견한 경우, 먼저 영어 버전을
벡터 이미지로 다시 그린 뒤 현지화하는 것을 고려한다.

SVG(Scalable Vector Graphics) 이미지 안의 텍스트를 번역할 때는,
정확성을 보장하고 언어별 버전 간 일관성을 유지하기 위해
반드시 특정 지침을 따라야 한다. SVG 이미지는
쿠버네티스 문서에서 개념, 워크플로,
다이어그램을 설명하는 데 자주 사용된다.

1. **번역할 텍스트 식별하기**: 먼저 SVG 이미지 안에서
    번역이 필요한 텍스트 요소를 식별한다. 요소에는 일반적으로 
    레이블, 캡션, 주석 또는 정보를 전달하는 모든 텍스트가 포함된다.

1. **SVG 파일 편집하기**: SVG 파일은 XML 기반이므로, 텍스트 편집기를 사용해
    수정할 수 있다. 그러나, 쿠버네티스 문서의 대부분의 이미지에서는
    글꼴 호환성 문제를 피하기 위해
    텍스트를 곡선으로 변환해 두고 있다. 이런 경우에는, Inkscape와 같은
    전문 SVG 편집 소프트웨어를 사용해 SVG 파일을 열고
    번역이 필요한 텍스트 요소를 찾는 것을 권장한다.

1. **텍스트 번역하기**: 원본 텍스트를 원하는 언어로
    번역한 내용으로 교체한다. 번역된 텍스트가 의도한 의미를
    정확히 전달하며 이미지 안의 사용 가능한 공간에 맞도록 한다. 라틴 알파벳을
    사용하는 언어를 작업할 때는 Open Sans 글꼴 계열을
    사용해야 한다. Open Sans 글꼴은
    [Open Sans Typeface](https://fonts.google.com/specimen/Open+Sans)에서 다운로드할 수 있다.

1. **텍스트를 곡선으로 변환하기**: 앞서 언급했듯이, 글꼴 호환성 문제를 해결하려면
    번역된 텍스트를
    곡선(curves) 또는 경로(paths)로 변환하는 것을 권장한다. 이렇게 변환하면
    사용자의 시스템에 원본 SVG에서 사용한 글꼴이 없어도
    최종 이미지에 번역된 텍스트가 올바르게 표시된다.

1. **검토 및 테스트하기**: 필요한 번역을 적용하고
    텍스트를 곡선으로 변환한 후, 수정된 SVG 이미지를 저장하고 검토하여
    텍스트가 제대로 표시되고 정렬되어 있는지 확인한다. 또한,
    [로컬에서 변경 사항 미리 보기](/docs/contribute/new-content/open-a-pr/#preview-locally)를 통해 확인한다.

### 소스 파일

현지화는 반드시 현지화 팀이 지정한 특정 릴리스의 영어 파일을
기반으로 해야 한다. 각 현지화 팀은 어떤
릴리스를 대상으로 할지 결정할 수 있으며, 이를 아래에서는 _대상 버전(target version)_이라고 한다.

대상 버전의 소스 파일을 찾으려면 다음을 수행한다.

1. https://github.com/kubernetes/website 를 통해
   쿠버네티스 웹사이트 저장소로 이동한다.

1. 아래 표에서 대상 버전에 해당하는 브랜치를 선택한다.

 대상 버전 | 브랜치
-----|-----
최신 버전 | [`main`](https://github.com/kubernetes/website/tree/main)
이전 버전 | [`release-{{< skew prevMinorVersion >}}`](https://github.com/kubernetes/website/tree/release-{{< skew prevMinorVersion >}})
다음 버전 | [`dev-{{< skew nextMinorVersion >}}`](https://github.com/kubernetes/website/tree/dev-{{< skew nextMinorVersion >}})

`main` 브랜치는 현재 릴리스`{{< latest-version >}}`의 콘텐츠를 담고 있다.
릴리스 팀은 다음 릴리스 `v{{< skew nextMinorVersion >}}` 전에
`{{< release-branch >}}` 브랜치를 생성한다.

### i18n의 사이트 문자열

현지화에는
[`i18n/en/en.toml`](https://github.com/kubernetes/website/blob/main/i18n/en/en.toml)의
내용을 신규 언어별 파일에 포함해야 한다. 예를 들어, 독일어의 경우 파일 경로는
`i18n/de/de.toml`이 된다.

`i18n/`에 신규 현지화 디렉터리와 파일을 추가한다. 예를 들어,
독일어(`de`)의 경우 다음과 같다.

```bash
mkdir -p i18n/de
cp i18n/en/en.toml i18n/de/de.toml
```

파일 상단 주석을 해당 현지화에 맞게 수정한 뒤
각 문자열의 값을 번역한다. 예를 들어, 다음은 검색 폼에 표시되는
독일어 플레이스홀더 텍스트이다.

```toml
[ui_search]
other = "Suchen"
```

사이트 문자열을 현지화하면 사이트 전역의 텍스트와 기능을 사용자 언어에 맞게 조정할 수 있다.
예를 들어, 각 페이지 하단 푸터에 표시되는 저작권 문구를 현지화할 수 있다.

### 언어별 현지화 가이드

현지화 팀은, 언어별 현지화 가이드를 작성하여
팀이 따르는 모범 사례를 공식화할 수 있다.

예를 들어,
[한국어 현지화 가이드](/ko/docs/contribute/localization_ko/)에는
다음과 같은 내용이 포함되어 있다.

- 스프린트 주기와 릴리스
- 브랜치 전략
- 풀 리퀘스트 워크플로
- 스타일 가이드
- 현지화 용어와 비현지화 용어의 용어집
- 마크다운 규칙
- 쿠버네티스 API 오브젝트 용어

### 언어별 Zoom 미팅

현지화 프로젝트에 별도의 회의 시간이 필요한 경우, SIG Docs
공동의장(Co-Chair)이나 테크 리드(Tech Lead)에게 연락하여 새 정기 Zoom 미팅과 캘린더 초대를
생성하도록 요청할 수 있다. 이 절차는 팀 규모가 충분히 커서
별도의 회의가 필요할 때만 진행하면 된다.

CNCF 정책에 따라, 현지화 팀은 회의 영상을 SIG
Docs YouTube 재생목록에 업로드해야 한다. SIG Docs 공동의장이나 테크 리드는
SIG Docs에서 이 과정을 자동화할 때까지 업로드 절차를 지원할 수 있다.

## 브랜치 전략

현지화 프로젝트는 매우 협업적인 성격을 가지므로,
특히 시작 단계에서 현지화가 아직 공개되지 않은 경우에는
팀이 공유하는 현지화 브랜치에서 작업할 것을 권장한다.

현지화 브랜치에서 협업하기 위해 다음을 따른다.

1. [@kubernetes/website-maintainers](https://github.com/orgs/kubernetes/teams/website-maintainers)
    팀의 멤버가 https://github.com/kubernetes/website 에서
    소스 브랜치로부터
    현지화 브랜치를 생성한다.

    [`kubernetes/org`](https://github.com/kubernetes/org) 저장소에
    [현지화 팀을 추가](#Add-your-localization-team-in-GitHub)할 때
    팀의 승인자가 `@kubernetes/website-maintainers` 팀에 포함된다.

    권장 브랜치 명명 규칙은 다음과 같다.

   `dev-<source version>-<language code>.<team milestone>`

    예를 들어, 독일어 현지화 팀의 승인자가
    쿠버네티스 v1.12 소스 브랜치를 기반으로
    kubernetes/website 저장소에 직접 dev-1.12-de.1 현지화 브랜치를 생성한다.

1. 개인 기여자는 현지화 브랜치를 기반으로
   기능 브랜치를 생성한다.

    예를 들어, 독일어 기여자가 자신의 `username:local-branch-name` 브랜치에서 `kubernetes:dev-1.12-de.1` 브랜치로
    변경 사항을 포함한 풀 리퀘스트를 연다.

1. 승인자가 기능 브랜치를 검토하고 현지화 브랜치에 병합한다.

1. 승인자는 주기적으로 새 풀 리퀘스트를 열어 승인하는 방식으로
   현지화 브랜치를 소스 브랜치와 병합한다. 풀 리퀘스트를 승인하기 전에
   커밋을 반드시 스쿼시(squash)해야 한다.

현지화가 완료될 때까지 필요에 따라 1~4단계를 반복한다. 예를 들어,
이후 독일어 현지화 브랜치는 dev-1.12-de.2,
dev-1.12-de.3 등이 될 수 있다.

팀은 반드시 콘텐츠를 가져온 동일한 브랜치에 현지화된 콘텐츠를
병합해야 한다. 예를 들어:

- `main`에서 가져온 현지화 브랜치는 반드시 `main`에 병합해야 한다.
- `release-{{% skew "prevMinorVersion" %}}`에서 가져온 현지화 브랜치는 반드시
  `release-{{% skew "prevMinorVersion" %}}`에 병합해야 한다.

{{< note >}}
현지화 브랜치가 `main` 브랜치에서 생성되었지만, 새 릴리스 브랜치 `{{< release-branch >}}`가 만들어지기 전에
`main`에 병합되지 않았다면, 해당 브랜치를 `main`과
새 릴리스 브랜치 `{{< release-branch >}}` 모두에 병합해야 한다.
작업 중인 현지화 브랜치를 새 릴리스 브랜치
`{{< release-branch >}}`에 병합하려면, 해당 현지화 브랜치의 업스트림 브랜치를
`{{< release-branch >}}`로 변경해야 한다.
{{< /note >}}

각 팀 마일스톤이 시작될 때, 이전 현지화 브랜치와 현재 현지화 브랜치 간
업스트림 변경 사항을 비교하는 이슈를 생성하는 것이 좋다.
업스트림 변경 사항 비교를 위해 사용할 수 있는 스크립트는
두 가지가 있다.


- [`upstream_changes.py`](https://github.com/kubernetes/website/tree/main/scripts#upstream_changespy)는
  특정 파일에 이루어진 변경 사항을 확인하는 데 유용하다.
- [`diff_l10n_branches.py`](https://github.com/kubernetes/website/tree/main/scripts#diff_l10n_branchespy)는
  특정 현지화 브랜치에서 오래된 파일 목록을 만드는 데 유용하다.

새 현지화 브랜치를 생성하고 풀 리퀘스트를 병합할 수 있는 사람은 승인자뿐이지만, 
누구나 새 현지화 브랜치에 대한 풀 리퀘스트를 열 수 있다. 그 과정에서
특별한 권한은 필요하지 않다.

포크(fork)한 리포저티리에서 작업하거나, 원본 저장소에서 직접 작업하는 방법에 대한 자세한 내용은
["저장소를 포크(fork) 및 클론(clone) 하기"](#fork-and-clone-the-repo)를 참고한다.

## 업스트림에 기여하기

SIG Docs는 영문 원본에 대한 업스트림 기여와 수정 제안을 언제나 환영한다.
