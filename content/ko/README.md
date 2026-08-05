# 쿠버네티스 문서화

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

이 저장소에는 [쿠버네티스 웹사이트 및 문서](https://kubernetes.io/)를 빌드하는 데 필요한 자산이 포함되어 있습니다. 기여해주셔서 감사합니다!

- [문서에 기여하기](#문서에-기여하기)
- [README 문서 현지화](#readme-문서-현지화)

# 저장소 사용하기

[Hugo(확장 버전)](https://gohugo.io/)를 사용하여 웹사이트를 로컬에서 실행하거나, 컨테이너 런타임에서 실행할 수 있습니다. 라이브 웹사이트와 배포 환경을 일치시키기 위해 컨테이너 사용을 권장합니다.

## 사전 준비 사항

이 저장소를 사용하기 위해, 로컬에 다음의 소프트웨어들이 설치되어 있어야 합니다.

- [npm](https://www.npmjs.com/)
- [Go](https://golang.org/)
- [Hugo(확장 버전)](https://gohugo.io/)
- [도커](https://www.docker.com/)와 같은 컨테이너 런타임.

> 참고
> [`netlify.toml`](../../netlify.toml#L11)에 파일에 있는 `HUGO_VERSION` 환경 변수와 동일한 Hugo 확장 버전을 설치하세요.

시작하기 전에 의존성이 있는 소프트웨어를 설치합니다. 저장소를 복제(clone)하고 디렉터리로 이동합니다.

```
git clone https://github.com/kubernetes/website.git
cd website
```

쿠버네티스 웹사이트는 [Docsy Hugo 테마](https://github.com/google/docsy#readme)를 사용하며, 
npm으로 설치할 수 있습니다. Hugo와 Docsy가 포함된 사전 구성 개발 컨테이너 이미지를 
다운로드해 사용할 수도 있습니다. 또한, 
레퍼런스 문서를 생성하는 도구에는 Git 서브모듈을 사용합니다.

### 윈도우

```powershell
# 하위 모듈 가져오기
git submodule update --init --recursive --depth 1
```

### 리눅스 등 기타 유닉스

```bash
# 하위 모듈 가져오기
make module-init
```

## 컨테이너를 사용하여 웹사이트 실행하기

컨테이너에서 사이트를 빌드하려면, 다음을 실행하여 컨테이너 이미지를 빌드하고 실행합니다.

```bash
# Docker와 유사한 어떤 컨테이너 도구도 환경변수 $CONTAINER_ENGINE 으로 지정 가능

# 전체 웹사이트 렌더링
make container-serve

# 특정 언어 세그먼트만 렌더링(예: 영어)
make container-serve segments=en

# 여러 언어 렌더링(예: 영어와 한국어)
make container-serve segments=en,ko
```

**💡 Tip:** 선택한 언어만 렌더링하는 _Hugo segments_ 를 사용하면 로컬 미리보기 빌드가 빨라집니다.

에러가 발생한다면, Hugo 컨테이너를 위한 컴퓨팅 리소스가 충분하지 않기 때문일 수 있습니다. 이를 해결하려면, 머신에서 도커에 허용할 CPU 및 메모리 사용량을 늘립니다([macOS](https://docs.docker.com/desktop/settings/mac/), [윈도우](https://docs.docker.com/desktop/settings/windows/)).

브라우저에서 <http://localhost:1313>을 열어 웹사이트를 확인하세요. 소스 파일을 변경하면 Hugo가 사이트를 갱신하고 브라우저를 새로 고칩니다.

## Hugo를 사용하여 로컬에서 웹사이트 실행하기

의존성이 있는 소프트웨어를 설치하고 사이트를 로컬에서 배포·테스트하려면 다음을 실행합니다.

- macOS / 리눅스

  ```bash
  npm ci

  # 전체 사이트 렌더링(기본)
  make serve

  # 특정 언어 세그먼트만 렌더링
  make serve segments=en

  # 여러 언어 세그먼트 렌더링
  make serve segments=en,ko
  ```

  **💡 팁:** Hugo Segment는 `hugo.toml`에 정의되어 있으며, 특정 언어만 렌더링하여 빌드를 빠르게 할 수 있습니다.

- 윈도우 (PowerShell)

  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```

이렇게 하면 로컬 Hugo 서버가 포트 1313에서 시작됩니다. 브라우저에서 <http://localhost:1313>을 열어 웹사이트를 확인하세요. 소스 파일을 변경하면 Hugo가 사이트를 갱신하고 브라우저를 새로 고칩니다.

## API 레퍼런스 페이지 빌드하기

`content/en/docs/reference/kubernetes-api`에 있는 API 레퍼런스 페이지는 OpenAPI(이전 Swagger) 명세를 기반으로, <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>를 사용해 생성됩니다.

새로운 쿠버네티스 릴리스를 위해 레퍼런스 페이지를 업데이트하려면 다음 단계를 수행합니다.

1. `api-ref-generator` 서브모듈을 받아옵니다.

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. Swagger 명세를 업데이트합니다.

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. `api-ref-assets/config/`에서, 새 릴리스의 변경 사항이 반영되도록 `toc.yaml` 및 `fields.yaml` 파일을 업데이트합니다.

4. 다음으로, 페이지를 빌드합니다.

   ```bash
   make api-reference
   ```

   로컬에서 결과를 테스트하기 위해 컨테이너 이미지를 이용하여 사이트를 빌드 및 실행합니다.

   ```bash
   make container-serve
   ```
   
   웹 브라우저에서, <http://localhost:1313/docs/reference/kubernetes-api/>로 이동하여 API 레퍼런스를 확인합니다.

5. 모든 API 변경사항이 `toc.yaml` 및 `fields.yaml` 구성 파일에 반영되었다면, 새로 생성된 API 레퍼런스 페이지에 대한 풀 리퀘스트를 엽니다.

## 문제 해결

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Hugo는 기술적인 이유로 2개의 바이너리 세트(표준/확장)로 제공됩니다. 현재 웹사이트는 **Hugo 확장(Extended)** 버전 기반에서만 실행됩니다. [릴리스 페이지](https://github.com/gohugoio/hugo/releases)에서 이름에 `extended` 가 포함된 아카이브를 찾습니다. 확인하려면, `hugo version` 을 실행하고 `extended` 라는 단어를 찾습니다.

### too many open files 이슈에 대한 macOS 문제 해결

macOS에서 `make serve` 를 실행하면 다음의 오류 메시지가 출력됩니다.

```
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

파일 오픈 개수에 대한 현재 제한값을 확인합니다.

`launchctl limit maxfiles`

그리고 다음의 명령을 실행합니다(https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c 를 참고하여 적용).

```
#!/bin/sh

# 코멘트 처리한 것은 원래 gist 링크들이며, 그 아래는 수정된 tombigel의 gist 링크입니다.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

이 내용은 Catalina와 Mojave macOS에서 작동합니다.

# SIG Docs에 참여하기

[커뮤니티 페이지](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)에서 SIG Docs 쿠버네티스 커뮤니티 및 회의에 대한 자세한 내용을 확인합니다.

이 프로젝트의 메인테이너에게 연락을 할 수도 있습니다.

- [슬랙](https://kubernetes.slack.com/messages/sig-docs)
  - [슬랙에 초대 받기](https://slack.k8s.io/)
- [메일링 리스트](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

# 문서에 기여하기

이 저장소에 대한 복제본을 여러분의 GitHub 계정에 생성하기 위해 화면 오른쪽 위 영역에 있는 **Fork** 버튼을 클릭하면 됩니다. 이 복제본은 *fork* 라고 부릅니다. 여러분의 fork에서 원하는 임의의 변경 사항을 만들고, 해당 변경 사항을 보낼 준비가 되었다면, 여러분의 fork로 이동하여 새로운 풀 리퀘스트를 만들어 우리에게 알려주시기 바랍니다.

여러분의 풀 리퀘스트가 생성된 이후에는, 쿠버네티스 리뷰어가 명료하고 실행 가능한 피드백을 제공하는 책임을 담당할 것입니다. 풀 리퀘스트의 오너로서, **쿠버네티스 리뷰어로부터 제공받은 피드백을 수용하기 위해 풀 리퀘스트를 수정하는 것은 여러분의 책임입니다.**

또한, 참고로 한 명 이상의 쿠버네티스 리뷰어가 여러분에게 피드백을 제공하는 상황이거나, 또는 원래 여러분에게 피드백을 제공하기로 할당된 사람이 아닌 다른 쿠버네티스 리뷰어로부터 피드백을 받는 상황도 있습니다.

그뿐만 아니라, 몇몇 상황에서는, 필요에 따라 리뷰어 중 한 명이 [쿠버네티스 기술 리뷰어](https://github.com/kubernetes/website/wiki/Tech-reviewers)로부터의 기술 리뷰를 요청할지도 모릅니다. 리뷰어는 제시간에 피드백을 제공하기 위해 최선을 다할 것이지만, 응답 시간은 상황에 따라 달라질 수도 있습니다.

쿠버네티스 문서화에 기여하기와 관련된 보다 자세한 정보는, 다음을 참고합니다.

- [쿠버네티스 문서에 기여하기](https://kubernetes.io/docs/contribute/)
- [페이지 콘텐트 타입](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [문서화 스타일 가이드](http://kubernetes.io/docs/contribute/style/style-guide/)
- [쿠버네티스 문서 현지화](https://kubernetes.io/docs/contribute/localization/)
- [쿠버네티스 문서 소개](https://www.youtube.com/watch?v=pprMgmNzDcw) 

### 신규 기여자 대사(ambassadors)

기여 과정에서 도움이 필요하다면, [신규 기여자 대사](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador)에게 연락하는 것이 좋습니다. 이들은 신규 기여자를 멘토링하고 첫 PR 과정에서 도움을 주는 역할도 담당하는 SIG Docs 승인자입니다. 신규 기여자 대사에게 문의할 가장 좋은 곳은 [쿠버네티스 슬랙](https://slack.k8s.io/)입니다. 현재 SIG Docs 신규 기여자 대사는 다음과 같습니다.

| Name                       | Slack                      | GitHub                     |                   
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh               | @sreeram.venkitesh                      | @sreeram-venkitesh              |

# README 문서 현지화

## 한국어

`README.md` 번역 및 한국어 기여자를 위한 보다 자세한 가이드는 [쿠버네티스 문서 한글화 가이드](https://kubernetes.io/ko/docs/contribute/localization_ko/)를 참고합니다.

한국어 번역 메인테이너에게 다음을 통해 연락할 수 있습니다.

* 손석호 ([GitHub - @seokho-son](https://github.com/seokho-son))
* [슬랙 채널](https://kubernetes.slack.com/messages/kubernetes-docs-ko)


# 행동 강령

쿠버네티스 커뮤니티 참여는 [CNCF 행동 강령](https://github.com/cncf/foundation/blob/master/code-of-conduct-languages/ko.md)을 따릅니다.

# 감사합니다!

쿠버네티스는 커뮤니티 참여를 통해 번창하며, 우리는 웹사이트 및 문서화에 대한 당신의 기여에 감사드립니다!
