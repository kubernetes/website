---
title: 로컬에서 미리보기
content_type: concept
weight: 11
---

<!-- overview -->

[새 PR을 열기](/docs/contribute/new-content/open-a-pr/) 전에,
변경 사항을 미리 보는 것이 좋다.
미리보기를 사용하면 빌드 오류나 마크다운 형식 문제를 알아낼 수 있다.

## 로컬에서 변경 사항 미리보기 {#preview-locally}

website의 컨테이너 이미지를 빌드하거나 Hugo를 로컬에서 실행할 수 있다.
도커 이미지 빌드는 느리지만 [Hugo 단축코드](/docs/contribute/style/hugo-shortcodes/)를 표시하므로,
디버깅에 유용할 수 있다.

{{< tabs name="tab_with_hugo" >}}
{{% tab name="Hugo 컨테이너" %}}

{{< note >}}
아래 명령은 도커를 기본 컨테이너 엔진으로 사용한다. 이 동작을 무시하려면
`CONTAINER_ENGINE` 환경 변수를 설정한다.
{{< /note >}}

1. 로컬에서 이미지를 빌드한다.  
   _Hugo 도구 자체에 대한 변경을 테스트하는 경우에만 이 단계가 필요하다._

   ```shell
   # 터미널에서 실행 (필요에 따라)
   make container-image
   ```

1. 로컬 리포지터리에서 서브모듈 의존성을 가져온다.

   ```shell
   # 터미널에서 실행
   make module-init
   ```

1. 컨테이너에서 Hugo를 시작한다.

   ```shell
   # 터미널에서 실행
   make container-serve
   ```

1. 웹 브라우저에서 `http://localhost:1313` 으로 이동한다. Hugo는
   변경 사항을 보고 필요에 따라 사이트를 다시 빌드한다.

1. 로컬의 Hugo 인스턴스를 중지하려면, 터미널로 돌아가서 `Ctrl+C` 를 입력하거나,
   터미널 창을 닫는다.

{{% /tab %}}
{{% tab name="Hugo 커맨드 라인" %}}

또는, 컴퓨터에 `hugo` 명령을 설치하여 사용한다.

1. [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/main/netlify.toml)에 지정된 [Hugo (확장 에디션)](https://gohugo.io/getting-started/installing/)과
   [Node](https://nodejs.org/en) 버전을 설치한다.

1. 모든 의존성을 설치한다.

   ```shell
   npm ci
   ```

1. 터미널에서, 쿠버네티스 website 리포지터리로 이동한 뒤 Hugo 서버를 실행한다.

   ```shell
   cd <path_to_your_repo>/website
   make serve
   ```
   만약 윈도우 환경을 사용하거나 `make` 명령어를 실행할 수 없는 경우, 다음 명령을 대신 사용한다.

   ```
   hugo server --buildFuture
   ```

1. 웹 브라우저에서 `http://localhost:1313` 으로 이동한다. Hugo는
   변경 사항을 보고 필요에 따라 사이트를 다시 빌드한다.

1. 로컬의 Hugo 인스턴스를 중지하려면, 터미널로 돌아가서 `Ctrl+C` 를 입력하거나,
   터미널 창을 닫는다.

{{% /tab %}}
{{< /tabs >}}

## 트러블슈팅 {#troubleshooting}

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

기술적인 이유로 Hugo는 두 가지 바이너리로 제공된다. 현재
웹사이트는 **Hugo Extended** 버전만을 기반으로 실행된다. [릴리스 페이지](https://github.com/gohugoio/hugo/releases)에서
이름에 `extended`가 포함된 아카이브를 찾는다. 확인하려면 `hugo version`을 실행하여
`extended`라는 단어가 있는지 확인한다.

### macOS에서 "too many open files" 오류 문제 해결

macOS에서 `make serve`를 실행했을 때 다음과 같은 오류가 발생하는 경우,

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

열린 파일에 대한 현재 제한값을 확인한다.

`launchctl limit maxfiles`

그런 다음 아래 명령을 실행한다(<https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>에서 가져옴).

```shell
#!/bin/sh

# These are the original gist links, linking to my gists now.
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

이 방법은 Catalina와 Mojave macOS 모두에서 동작한다.

### Unable to find image 'gcr.io/k8s-staging-sig-docs/k8s-website-hugo:VERSION' locally

`make container-serve`를 실행했을 때 이 오류가 발생한다면, `Makefile`의
`$IMAGE_VERSION`에 [정의된](https://github.com/kubernetes/website/blob/main/Makefile#L10)
특정 파일에 로컬 변경을 가했기 때문일 수 있다.

웹사이트 이미지 버전에는 해시가 포함되며, 이 해시는
해당 파일의 내용을 기반으로 생성된다. 예를 들어, 이러한 파일에 대한 해시가 `1b9242684415`이면
웹사이트 이미지는 `k8s-website-hugo:v0.133.0-1b9242684415`라는 이름을 갖는다.
`make container-serve`를 실행하면 쿠버네티스 웹사이트의 GCR에서
해당 이미지를 가져오려고 시도한다. 현재 버전이 아닌 경우, 이 이미지가
존재하지 않는다는 오류가 표시된다.

이러한 파일을 변경하고 웹사이트를 미리 봐야 한다면,
미리 빌드된 이미지를 가져오는 대신 로컬 이미지를 빌드해야 한다.
이를 위해 `make container-image`를 실행한다.

### 기타 문제

로컬에서 웹사이트를 실행하거나 변경 사항을 미리 보는 과정에서 다른 문제가 발생하면,
`kubernetes/website` GitHub 리포지터리에 자유롭게
[이슈를 생성한다](https://github.com/kubernetes/website/issues/new/choose).
