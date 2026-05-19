---
title: 레퍼런스 문서 퀵스타트 가이드
linkTitle: Quickstart
content_type: task
weight: 10
hide_summary: true
---

<!-- overview -->

이 문서에서는 `update-imported-docs.py` 스크립트를 사용하여 
쿠버네티스 레퍼런스 문서를 생성하는 방법에 대해 설명한다. 
이 스크립트는 특정 쿠버네티스 릴리스 버전에 대해 빌드 설정을 자동으로 수행하고 레퍼런스 문서를 생성한다.

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## `website` 저장소 클론하기 {#Getting-the-docs-repository}

개인 계정에 있는 포크 버전의 `website` 저장소가 GitHub에 있는 `kubernetes/website` 저장소(`main` 브랜치)의 최신 상태와 일치하는지 확인한 뒤,
개인 계정에 있는 포크 버전의 `website` 저장소를 로컬 개발 환경으로 클론한다.

```shell
mkdir github.com
cd github.com
git clone git@github.com:<your_github_username>/website.git
```

아래에서 사용될 '베이스 디렉터리'를 숙지해야 한다. 예를 들어 위에 안내된 대로 
저장소를 클론했다면, 베이스 디렉터리는 
`github.com/website` 가 된다. 이제 이 문서의 나머지 부분에서 `<web-base>` 라는 구문이 나오면 
이 부분에 당신의 베이스 디렉터리를 대입하면 된다.

{{< note>}}
만약 쿠버네티스 구성 도구와 API 레퍼런스에 기여하고 싶다면, 
[업스트림 코드에 기여하기 (영문)](/docs/contribute/generate-ref-docs/contribute-upstream) 를 참조한다.
{{< /note >}}

## `update-imported-docs` 스크립트 개요 {#Overview-of-update-imported-docs}

`update-imported-docs.py` 스크립트는 `<web-base>/update-imported-docs/` 
디렉터리에 존재한다.

이 스크립트는 다음 레퍼런스를 생성한다.

* 구성요소 및 도구 레퍼런스 페이지
* `kubectl` 명령어 레퍼런스
* 쿠버네티스 API 레퍼런스

`update-imported-docs.py` 스크립트는 쿠버네티스 소스코드로부터 레퍼런스 문서를 
생성한다. 스크립트가 실행되면 개발 머신의 `/tmp` 디렉터리 아래에 임시 디렉터리를 
생성하고, 이 임시 디렉터리 아래에 레퍼런스 문서 생성에 필요한 `kubernetes/kubernetes` 저장소와 
`kubernetes-sigs/reference-docs` 저장소를 클론하며, 
`GOPATH` 환경 변수를 이 임시 디렉터리로 지정한다.
또한 이 스크립트는 다음의 환경 변수를 설정한다.

* `K8S_RELEASE`
* `K8S_ROOT`
* `K8S_WEBROOT`

스크립트가 정상적으로 실행되려면 인자 2개를 전달해야 한다.

* 환경설정 YAML 파일 (`reference.yml`)
* 쿠버네티스 릴리스 버전 (예: `1.17`)

환경설정 파일은 `generate-command` 라는 필드를 포함하는데,
이 필드에는 
`kubernetes-sigs/reference-docs/Makefile` 에 있는 Make 타겟들을 활용하여 빌드하는 일련의 과정이 명시되어 있다.
`K8S_RELEASE` 환경 변수는 릴리스 버전을 결정한다.

`update-imported-docs.py` 스크립트는 다음의 과정을 수행한다.

1. 환경설정 파일에 있는 관련 저장소를 클론한다. 
   레퍼런스 문서 생성을 위해 
   기본적으로는 `kubernetes-sigs/reference-docs` 저장소를 클론하도록 되어 있다.
1. 클론한  안에서, 문서 생성에 필요한 사항을 준비하기 위한 명령어를 실행한 뒤, 
   HTML 파일과 마크다운 파일을 생성한다.
1. 생성된 HTML 파일과 마크다운 파일을 
   환경설정 파일에 명시된 규칙에 따라 `<web-base>` 로 복사한다.
1. `kubectl`.md 에 있는 `kubectl` 명령어 링크들이 
   `kubectl` 명령어 레퍼런스 페이지의 올바른 섹션으로 연결되도록 업데이트한다.

생성된 파일이 `<web-base>`  아래에 복사되었으면, 
`kubernetes/website` 저장소로 [풀 리퀘스트를 생성](/ko/docs/contribute/new-content/open-a-pr/)
할 수 있다.

## 환경설정 파일 형식 {#Configuration-file-format}

각 환경설정 파일은 레퍼런스 생성을 위해 필요한 여러 저장소의 정보를 담을 수 있다. 
필요한 경우, 환경설정 파일을 직접 수정하여 사용할 수도 있다. 
또는, 다른 그룹의 문서를 임포트하기 위해 새로운 환경설정 파일을 작성할 수도 있다.
다음은 환경설정 YAML 파일의 예시이다.

```yaml
repos:
- name: community
  remote: https://github.com/kubernetes/community.git
  branch: master
  files:
  - src: contributors/devel/README.md
    dst: docs/imported/community/devel.md
  - src: contributors/guide/README.md
    dst: docs/imported/community/guide.md
```

이 도구에 의해 처리될 단일 페이지 마크다운 문서는 
[문서 스타일 가이드](/docs/contribute/style/style-guide/)의 내용을 만족해야 한다.

## reference.yml 환경설정 파일 다루기 {#Customizing-reference-yml}

`<web-base>/update-imported-docs/reference.yml` 환경설정 파일을 열어 수정할 수 있다.
레퍼런스 문서 생성을 위해 명령어들이 어떻게 사용되고 있는지 파악하지 못했다면, 
`generate-command` 필드의 내용은 수정하지 말아야 한다.
대부분의 경우 `reference.yml` 을 직접 수정해야 할 필요는 없다.
때때로, 업스트림 소스코드 업데이트 때문에 이 환경설정 파일을 수정해야 할 수도 있다. 
(예: Golang 버전 의존성, 써드파티 라이브러리 변경 등)
만약 스크립트 사용 시 빌드 문제가 있다면, 
[쿠버네티스 슬랙의 #sig-docs 채널](https://kubernetes.slack.com/archives/C1J0BPD2M)에서 SIG-Docs 팀에 문의하면 된다.

{{< note >}}
`generate-command` 는 특정 저장소로부터 문서를 만들기 위한 
명령어나 스크립트를 실행하기 위해 사용할 수 있는 선택적 필드이다.
{{< /note >}}

`reference.yml` 환경설정 파일에서, `files` 필드는 `src` 와 `dst` 필드를 포함한다.
`src` 필드에는 `kubernetes-sigs/reference-docs` 디렉터리 아래에 있는 생성된 마크다운 파일의 위치를 명시하고,
`dst` 필드에는 이 파일을 
`kubernetes/website` 디렉터리 아래의 어느 위치로 복사할지를 명시한다.
예시는 다음과 같다.

```yaml
repos:
- name: reference-docs
  remote: https://github.com/kubernetes-sigs/reference-docs.git
  files:
  - src: gen-compdocs/build/kube-apiserver.md
    dst: content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
  ...
```

만약 하나의 `src` 디렉터리에서 하나의 `dst` 디렉터리로 많은 파일이 복사되어야 한다면, 
`src` 필드에 와일드카드를 사용할 수 있다.
이 경우, `dst` 필드에는 단일 파일의 경로가 아니라 디렉터리의 경로를 명시해야 한다.
예시는 다음과 같다.

```yaml
  files:
  - src: gen-compdocs/build/kubeadm*.md
    dst: content/en/docs/reference/setup-tools/kubeadm/generated/
```

## `update-imported-docs` 도구 실행하기 {#Running-the-update-imported-docs-tool}

다음과 같이 `update-imported-docs.py` 도구를 실행할 수 있다.

```shell
cd <web-base>/update-imported-docs
./update-imported-docs.py <configuration-file.yml> <release-version>
```

예를 들면 다음과 같다.

```shell
./update-imported-docs reference.yml 1.17
```

<!-- Revisit: is the release configuration used -->
## 링크 업데이트하기 {#Fixing-Links}

`release.yml` 환경설정 파일은 상대경로 링크를 수정하는 방법을 포함하고 있다.
임포트하는 파일 안에 있는 상대경로 링크를 수정하려면, `gen-absolute-links` 필드를 
`true` 로 명시한다. 이에 대한 예시는 
[`release.yml`](https://github.com/kubernetes/website/blob/main/update-imported-docs/release.yml) 에서 볼 수 있다.

## `kubernetes/website` 의 변경사항을 커밋하기 {#Adding-and-committing-changes-in-kubernetes-website}

다음의 명령을 실행하여, 스크립트에 의해 생성된 뒤 `<web-base>`  아래에 복사된 파일의 목록을 볼 수 있다.

```shell
cd <web-base>
git status
```

위의 명령을 실행하면 새로 추가된 파일과 수정된 파일의 목록을 볼 수 있다. 
아래의 결과 예시는 업스트림 소스코드의 변경사항에 따라 다르게 나타날 수 있다.

### 생성된 구성요소 도구 레퍼런스 {#Generated-component-tool-files}

```
content/en/docs/reference/command-line-tools-reference/cloud-controller-manager.md
content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
content/en/docs/reference/command-line-tools-reference/kube-controller-manager.md
content/en/docs/reference/command-line-tools-reference/kube-proxy.md
content/en/docs/reference/command-line-tools-reference/kube-scheduler.md
content/en/docs/reference/setup-tools/kubeadm/generated/kubeadm.md
content/en/docs/reference/kubectl/kubectl.md
```

### 생성된 kubectl 명령어 레퍼런스 {#Generated-kubectl-command-reference-files}

```
static/docs/reference/generated/kubectl/kubectl-commands.html
static/docs/reference/generated/kubectl/navData.js
static/docs/reference/generated/kubectl/scroll.js
static/docs/reference/generated/kubectl/stylesheet.css
static/docs/reference/generated/kubectl/tabvisibility.js
static/docs/reference/generated/kubectl/node_modules/bootstrap/dist/css/bootstrap.min.css
static/docs/reference/generated/kubectl/node_modules/highlight.js/styles/default.css
static/docs/reference/generated/kubectl/node_modules/jquery.scrollto/jquery.scrollTo.min.js
static/docs/reference/generated/kubectl/node_modules/jquery/dist/jquery.min.js
static/docs/reference/generated/kubectl/css/font-awesome.min.css
```

### 생성된 쿠버네티스 API 레퍼런스 와 파일 {#Generated-Kubernetes-API-reference-directories-and-files}

```
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/index.html
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/navData.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/scroll.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/query.scrollTo.min.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/font-awesome.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/bootstrap.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/stylesheet.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/FontAwesome.otf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.eot
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.svg
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.ttf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff2
```

`git add` 와 `git commit` 명령을 실행하여 추가/변경된 파일을 커밋한다.

## 풀 리퀘스트 만들기 {#Creating-a-pull-request}

`kubernetes/website` 저장소에 풀 리퀘스트를 등록한다.
등록한 풀 리퀘스트를 모니터하고, 리뷰 커멘트가 달리면 그에 대해 대응을 한다. 
풀 리퀘스트가 머지될 때 까지 계속 모니터한다.

풀 리퀘스트가 머지된 뒤 몇 분이 지나면, 
변경사항을 
[쿠버네티스 문서 홈페이지](/docs/home/)에서 확인할 수 있다.



## {{% heading "whatsnext" %}}


수동으로 빌드 저장소를 설정하고 빌드 타겟을 실행하여 개별 레퍼런스 문서를 생성하려면, 
다음의 가이드를 참고한다.

* [쿠버네티스 구성요소와 도구에 대한 레퍼런스 문서 생성하기](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [kubectl 명령어에 대한 레퍼런스 문서 생성하기](/docs/contribute/generate-ref-docs/kubectl/)
* [쿠버네티스 API에 대한 레퍼런스 문서 생성하기](/docs/contribute/generate-ref-docs/kubernetes-api/)

