---
title: 메트릭 레퍼런스 문서 생성하기
content_type: task
weight: 100
---

<!-- overview -->

이 페이지는 메트릭 레퍼런스 문서 생성을 보여준다.

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## 쿠버네티스 리포지터리 클론하기

메트릭 생성은 쿠버네티스 리포지터리에서 이루어진다.
리포지터리를 클론하려면, 클론을 두려는 디렉터리로 이동한다.

그런 다음, 다음 명령을 실행한다.

```shell
git clone https://www.github.com/kubernetes/kubernetes 
```

이렇게 하면 현재 작업 디렉터리에 `kubernetes` 폴더가 생성된다.

## 메트릭 생성하기

클론한 쿠버네티스 리포지터리 안에서
`test/instrumentation/documentation` 디렉터리를 찾는다.
메트릭 문서는 이 디렉터리에 생성된다.

릴리스마다 새로운 메트릭이 추가된다.
메트릭 문서 생성 스크립트를 실행한 뒤에는,
메트릭 문서를 쿠버네티스 웹사이트로 복사하고
갱신된 메트릭 문서를 게시한다.

최신 메트릭을 생성하려면, 클론한 쿠버네티스 디렉터리 루트에 있는지 확인한다.
그런 다음, 다음 명령을 실행한다.

```shell
./test/instrumentation/update-documentation.sh
```

변경 사항을 확인하려면, 다음을 실행한다.

```shell
git status
```

출력은 다음과 비슷하다.

```
./test/instrumentation/documentation/documentation.md
./test/instrumentation/documentation/documentation-list.yaml
```

## 생성된 메트릭 문서 파일을 쿠버네티스 웹사이트 리포지터리로 복사하기

1. 쿠버네티스 웹사이트 루트 환경 변수를 설정한다.

   다음 명령을 실행하여 웹사이트 루트를 설정한다.

   ```shell
   export WEBSITE_ROOT=<path to website root>
   ```

2. 생성된 메트릭 파일을 쿠버네티스 웹사이트 리포지터리로 복사한다.

   ```shell
   cp ./test/instrumentation/documentation/documentation.md "${WEBSITE_ROOT}/content/en/docs/reference/instrumentation/metrics.md"
   ```

   {{< note >}}
   오류가 발생하면, 파일을 복사할 권한이 있는지 확인한다.
   `chown`을 사용하여 파일 소유권을 자신의 사용자로 되돌릴 수 있다.
   {{< /note >}}

## 풀 리퀘스트 생성하기

풀 리퀘스트를 생성하려면, [풀 리퀘스트 열기](/docs/contribute/new-content/open-a-pr/)의 안내를 따른다.

## {{% heading "whatsnext" %}}

* [업스트림에 기여하기](/docs/contribute/generate-ref-docs/contribute-upstream/)
* [쿠버네티스 컴포넌트와 도구 레퍼런스 문서 생성하기](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [kubectl 명령어 레퍼런스 문서 생성하기](/docs/contribute/generate-ref-docs/kubectl/)
