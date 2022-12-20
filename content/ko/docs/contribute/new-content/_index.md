---
title: 새로운 콘텐츠 기여하기
content_type: concept
main_menu: true
weight: 20
---



<!-- overview -->

이 섹션에는 새로운 콘텐츠를 기여하기 전에 알아야 할 정보가 
있다.
<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR 
    subgraph second[시작하기 전에]
    direction TB
    S[ ] -.-
    A[CNCF CLA 서명하기] --> B[Git 브랜치 선택하기]
    B --> C[한 PR에는 한 언어에 대한 변경사항만]
    C --> F[기여자 도구 확인하기]
    end
    subgraph first[기여 기초]
    direction TB
       T[ ] -.-
       D[문서를 마크다운으로 작성하고<br>Hugo로 사이트 빌드] --- E[GitHub에 있는 소스]
       E --- G['/content/../docs' 폴더에<br>각 언어 컨텐츠가 있음]
       G --- H[Hugo 페이지 컨텐츠 종류와<br>shortcode 숙지하기]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}

***그림 - 새로운 콘텐츠 기여를 위한 준비***

위 그림은 새로운 콘텐츠를 제출하기 전에 알아야 할 정보를 설명한다.
해당 정보에 대한 자세한 내용은 다음과 같다.



<!-- body -->

## 기여에 대한 기본 사항

- 마크다운(Markdown)으로 쿠버네티스 문서를 작성하고 
  [Hugo](https://gohugo.io/)를 사용하여 쿠버네티스 사이트를 구축한다.
- 쿠버네티스 문서는 마크다운 스펙으로 [CommonMark](https://commonmark.org/)를 사용한다.
- 소스는 [GitHub](https://github.com/kubernetes/website)에 있다. 
  쿠버네티스 문서는 `/content/ko/docs/` 에서 찾을 수 있다. 
  일부 참조 문서는 `update-imported-docs/` 디렉터리의 스크립트를 이용하여 
  자동으로 생성된다.
- [페이지 콘텐츠 타입](/docs/contribute/style/page-content-types/)은 
  Hugo에서 문서 콘텐츠가 표시되는 방식을 기술한다.
- 쿠버네티스 문서 기여 시 [Docsy shortcodes](https://www.docsy.dev/docs/adding-content/shortcodes/) 또는 [custom Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/)를 사용할 수 있다.
- 표준 Hugo 단축코드(shortcode) 이외에도 설명서에서 여러
  [사용자 정의 Hugo 단축코드](/docs/contribute/style/hugo-shortcodes/)를 사용하여 
  콘텐츠 표시를 제어한다.
- 문서 소스는 `/content/` 에서 여러 언어로 제공된다. 각
  언어는 [ISO 639-1 표준](https://www.loc.gov/standards/iso639-2/php/code_list.php)에
  의해 결정된 2문자 코드가 있는 자체 폴더가 있다. 예를 들어,
  한글 문서의 소스는 `/content/ko/docs/` 에 저장된다.
- 여러 언어로 문서화에 기여하거나 
  새로운 번역을 시작하는 방법에 대한 자세한 내용은 
  [현지화](/ko/docs/contribute/localization_ko/)를 참고한다.

## 시작하기 전에 {#before-you-begin}

### CNCF CLA 서명 {#sign-the-cla}

모든 쿠버네티스 기여자는 **반드시** 
[기여자 가이드](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md)를 읽고 
[기여자 라이선스 계약(CLA)에 서명](https://github.com/kubernetes/community/blob/master/CLA.md)해야 한다
.

CLA에 서명하지 않은 기여자의 풀 리퀘스트(pull request)는 자동 테스트에 실패한다. 
제공한 이름과 이메일은 `git config` 에 있는 것과 일치해야 하며, 
git 이름과 이메일은 CNCF CLA에 사용된 것과 
일치해야 한다.

### 사용할 Git 브랜치를 선택한다

풀 리퀘스트를 열 때는, 작업의 기반이 되는 브랜치를 
미리 알아야 한다.

시나리오   | 브랜치
:---------|:------------
현재 릴리스의 기존 또는 새로운 영어 콘텐츠 | `main`
기능 변경 릴리스의 콘텐츠 | `dev-<version>` 패턴을 사용하여 기능 변경이 있는 주 버전과 부 버전에 해당하는 브랜치. 예를 들어, `v{{< skew nextMinorVersion >}}` 에서 기능이 변경된 경우, ``dev-{{< skew nextMinorVersion >}}`` 에 문서 변경을 추가한다.
다른 언어로된 콘텐츠(현지화) | 현지화 규칙을 사용. 자세한 내용은 [현지화 브랜치 전략](/docs/contribute/localization/#branching-strategy)을 참고한다.

어떤 브랜치를 선택해야 할지 잘 모르는 경우 슬랙의 `#sig-docs` 에 문의한다.

{{< note >}} 풀 리퀘스트를 이미 제출했는데 기본 브랜치가 잘못되었다는 것을 알게 되면,
제출자(제출자인 여러분만)가 이를 변경할 수 있다.
{{< /note >}}

### PR 당 언어

PR 당 하나의 언어로 풀 리퀘스트를 제한한다. 
여러 언어로 동일한 코드 샘플을 동일하게 변경해야 하는 경우 
각 언어마다 별도의 PR을 연다.

## 기여자를 위한 도구들

`kubernetes/website` 리포지터리의 
[문서 기여자를 위한 도구](https://github.com/kubernetes/website/tree/main/content/en/docs/doc-contributor-tools) 
디렉터리에는 기여 여정을 좀 더 순조롭게 도와주는 도구들이 포함되어 있다.

