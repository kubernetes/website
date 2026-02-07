---
title: 콘텐츠 구성
content_type: concept
weight: 90
---

<!-- overview -->

이 사이트는 Hugo를 사용한다. Hugo에서, [콘텐츠 구성](https://gohugo.io/content-management/organization/)은 핵심 개념이다.

<!-- body -->

{{% note %}}
**Hugo 팁:** 콘텐츠 편집 세션을 시작할 때는 `hugo server --navigateToChanged`로 Hugo를 실행한다.
{{% /note %}}

## 페이지 목록

### 페이지 순서

문서 사이드 메뉴, 문서 페이지 브라우저 등은 Hugo의 기본 정렬 순서를 
사용하여 나열되며, 이 정렬 순서는 weight(1부터 시작), date(최신 항목 우선), 
그리고 link title 순서이다.

이를 바탕으로, 페이지나 섹션을 위로 올리고 싶다면, 페이지의 문서 헤더에 weight 값을 설정한다.

```yaml
title: My Page
weight: 10
```

{{% note %}}
페이지 weight는 1, 2, 3과 같은 연속된 값을 사용하기보다는
10, 20, 30과 같이 간격을 둔 값을 사용하는 것이 좋다.
이렇게 하면 이후에 원하는 위치에 페이지를 삽입할 수 있다.
또한 같은 디렉터리(섹션) 내에서는 각 weight 값이 서로 겹치지 않아야 한다.
이는 특히 현지화된 콘텐츠에서 문서가 항상 올바르게 구성되도록 보장한다.
{{% /note %}}

### 문서 메인 메뉴

`문서` 메인 메뉴는 `_index.md` 섹션 콘텐츠 
파일의 문서 헤더에 `main_menu` 플래그가 설정된 `docs/` 아래의 섹션들로 구성된다.

```yaml
main_menu: true
```

링크 제목은 페이지의 `linkTitle`에서 가져오므로, 따라서 
제목과 다르게 표시하고 싶다면, 콘텐츠 파일에서 이를 변경한다.

```yaml
main_menu: true
title: Page Title
linkTitle: Title used in links
```

{{% note %}}
위 설정은 언어별로 각각 수행해야 한다. 메뉴에서 해당 섹션이 보이지 않는다면,
Hugo에서 해당 디렉터리를 섹션으로 인식하지 못했기 때문일 수 있다.
이 경우 섹션 폴더 안에 `_index.md` 콘텐츠 파일을 생성한다.
{{% /note %}}

### 문서 사이드 메뉴

문서 사이드바 메뉴는 `docs/` 아래에서 시작하는 현재 섹션 트리를 기반으로 구성된다.

모든 섹션과 해당 섹션에 포함된 페이지가 표시된다.

섹션이나 페이지를 목록에 표시하고 싶지 않다면, 문서 헤더에서 `toc_hide` 플래그를 `true`로 설정한다.

```yaml
toc_hide: true
```

콘텐츠가 있는 섹션으로 이동하면, 해당 섹션 또는 페이지 (예: `_index.md`)가 
표시된다. 그렇지 않은 경우에는 해당 섹션 안의 첫 번째 페이지가 표시된다.

### 문서 브라우저

문서 홈 페이지의 페이지 브라우저는 `docs section` 바로 아래에 
위치한 모든 섹션과 페이지를 사용해 구성된다.

섹션이나 페이지를 목록에 표시하고 싶지 않다면, 문서 헤더에서 `toc_hide` 플래그를 `true`로 설정한다.

```yaml
toc_hide: true
```

### 메인 메뉴

오른쪽 상단 메뉴와 푸터에 있는 사이트 링크는 페이지 조회를 통해 
구성된다. 이는 해당 페이지가 실제로 존재하는지 확인하기 위함이다. 따라서, 사이트에
`case-studies` 섹션이 존재하지 않으면, 해당 섹션으로는 링크되지 않는다.

## 페이지 번들

독립적인 콘텐츠 페이지(Markdown 파일) 외에도 Hugo는
[페이지 번들](https://gohugo.io/content-management/page-bundles/)을 지원한다.

대표적인 예로 [사용자 정의 Hugo 단축 코드](/docs/contribute/style/hugo-shortcodes/)가 있다.
이는 `leaf bundle`로 간주된다. `index.md`파일을 포함한 해당 디렉터리 아래에 있는 모든 파일은
번들의 일부가 된다. 여기에는 페이지 기준 상대 링크, 처리 가능한 이미지 등도 포함된다.

```bash
en/docs/home/contribute/includes
├── example1.md
├── example2.md
├── index.md
└── podtemplate.json
```

또 다른 널리 사용되는 예로 `includes` 번들이 있다. 이 번들은 문서 헤더에 
`headless: true`를 설정하며, 이는 자체 URL을 가지지 않는다는 의미이다. 해당 번들은 다른 페이지에서만 사용된다.

```bash
en/includes
├── default-storage-class-prereqs.md
├── index.md
├── partner-script.js
├── partner-style.css
├── task-tutorial-prereqs.md
├── user-guide-content-moved.md
└── user-guide-migration-notice.md
```

번들 안에 파일과 관련해 다음과 같은 중요한 사항이 있다.

* 번역된 번들의 경우, 누락된 비콘텐츠 파일은 상위 언어에서 
  상속된다. 이를 통해 중복을 방지한다.
* 번들에 포함된 모든 파일은 Hugo에서 `Resources`라고 부르는 대상이며,
  문서 헤더(YAML 파일 등)을 지원하지 않는 경우에도
  파라미터나 제목과 같은 메타데이터를 언어별로 제공할 수 있다.
  [페이지 리소스 메타데이터](https://gohugo.io/content-management/page-resources/#page-resources-metadata)를 참고하자.
* `Resource`의 `.RelPermalink`에서 얻는 값은 페이지 기준 상대 경로이다.
  [Permalinks](https://gohugo.io/content-management/urls/#permalinks)를 참고하자.

## 스타일

이 사이트의 스타일시트에 대한 [SASS](https://sass-lang.com/) 소스는
`assets/sass`에 저장되어 있으며 Hugo에 의해 자동으로 빌드된다.

## {{% heading "whatsnext" %}}

* [사용자 정의 Hugo 단축 코드](/docs/contribute/style/hugo-shortcodes/)에 대해 알아보기.
* [스타일 가이드](/docs/contribute/style/style-guide)에 대해 알아보기.
* [콘텐츠 가이드](/docs/contribute/style/content-guide)에 대해 알아보기.
