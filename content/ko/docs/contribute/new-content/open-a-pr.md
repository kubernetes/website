---
title: 풀 리퀘스트 열기
content_type: concept
weight: 10
card:
  name: contribute
  weight: 40
---

<!-- overview -->

{{< note >}}
**코드 개발자**: 향후 쿠버네티스 릴리스의
새로운 기능을 문서화하는 경우,
[새 기능 문서화](/docs/contribute/new-content/new-features/)를 참고한다.
{{< /note >}}

새 콘텐츠 페이지를 기여하거나 기존 콘텐츠 페이지를 개선하려면, 풀 리퀘스트(PR)를 연다. [시작하기 전에](/ko/docs/contribute/new-content/overview/#before-you-begin) 섹션의 모든 요구 사항을 준수해야 한다.

변경 사항이 작거나, git에 익숙하지 않은 경우, [GitHub을 사용하여 변경하기](#github을-사용하여-변경하기)를 읽고 페이지를 편집하는 방법을 알아보자.

변경 사항이 많으면, [로컬 포크에서 작업하기](#fork-the-repo)를 읽고 컴퓨터에서 로컬로 변경하는 방법을 배운다.



<!-- body -->

## GitHub을 사용하여 변경하기

git 워크플로에 익숙하지 않은 경우, 풀 리퀘스트를
여는 쉬운 방법이 있다.

1.  이슈가 있는 페이지에서, 오른쪽 상단에 있는 연필 아이콘을 선택한다.
    페이지 하단으로 스크롤 하여 **페이지 편집하기** 를 선택할 수도 있다.

2.  GitHub 마크다운 편집기에서 수정한다.

3.  편집기 아래에서, **Propose file change** 양식을
    작성한다. 첫 번째 필드에서, 커밋 메시지 제목을 지정한다.
    두 번째 필드에는, 설명을 제공한다.

    {{< note >}}
    커밋 메시지에 [GitHub 키워드](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)를 사용하지 않는다. 나중에 풀 리퀘스트 설명에
    추가할 수 있다.
    {{< /note >}}

4.  **Propose file change** 를 선택한다.

5.  **Create pull requests** 를 선택한다.

6.  **Open a pull request** 화면이 나타난다. 양식을 작성한다.

    - 풀 리퀘스트의 **Subject** 필드는 기본적으로 커밋의 요약으로 설정한다.
    필요한 경우 변경할 수 있다.
    - **Body** 는 만약 내용이 있다면, 확장된 커밋 메시지를 포함한다.
    그리고 일부 템플릿 텍스트를 포함한다.
    템플릿 텍스트에 필요한 세부 정보를 추가한 다음, 추가 템플릿 텍스트를 삭제한다.
    - **Allow edits from maintainers** 체크박스는 선택된 상태로 둔다.

    {{< note >}}
    PR 설명은 리뷰어가 변경 사항을 이해하는 데 유용한 방법이다. 자세한 내용은 [PR 열기](#open-a-pr)를 참고한다.
    {{</ note >}}

7.  **Create pull request** 를 선택한다.

### GitHub에서 피드백 해결

풀 리퀘스트를 병합하기 전에, 쿠버네티스 커뮤니티 회원은 이를 리뷰하고
승인한다. `k8s-ci-robot` 은 이 페이지에 나와있는 가까운
멤버에게 리뷰를 제안한다. 특정한 사람을 염두에 두고 있다면,
GitHub 사용자 이름을 코멘트로 남긴다.

리뷰어가 변경을 요청하는 경우, 다음과 같이 한다.

1. **Files changed** 탭으로 이동 한다.
2. 풀 리퀘스트에 의해 변경된 파일에서 연필(편집) 아이콘을
선택한다.
3. 요청된 변경에 대한 수정을 한다.
4. 변경 사항을 커밋한다.

리뷰어를 기다리고 있는 경우, 7일마다 한 번씩 연락한다. 슬랙 채널 `#sig-docs` 에 메시지를 게시할 수도 있다.

리뷰가 완료되면, 리뷰어가 PR을 병합하고 몇 분 후에 변경 사항이 적용된다.

## 로컬 포크에서 작업하기 {#fork-the-repo}

git에 익숙하거나, 변경 사항이 몇 줄보다 클 경우,
로컬 포크로 작업한다.

컴퓨터에 [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)이 설치되어 있는지 확인한다. git UI 애플리케이션을 사용할 수도 있다.

### kubernetes/website 리포지터리 포크하기

1. [`kubernetes/website`](https://github.com/kubernetes/website/) 리포지터리로 이동한다.
2. **Fork** 를 선택한다.

### 로컬 클론 생성 및 업스트림 설정

3. 터미널 창에서, 포크를 클론하고 [Docsy Hugo 테마](https://github.com/google/docsy#readme)를 업데이트한다.

    ```bash
    git clone git@github.com/<github_username>/website
    cd website
    git submodule update --init --recursive --depth 1
    ```

4. 새 `website` 디렉터리로 이동한다. `kubernetes/website` 리포지터리를 `upstream` 원격으로 설정한다.

      ```bash
      cd website

      git remote add upstream https://github.com/kubernetes/website.git
      ```

5. `origin` 과 `upstream` 리포지터리를 확인한다.

    ```bash
    git remote -v
    ```

    출력은 다음과 비슷하다.

    ```bash
    origin	git@github.com:<github_username>/website.git (fetch)
    origin	git@github.com:<github_username>/website.git (push)
    upstream	https://github.com/kubernetes/website.git (fetch)
    upstream	https://github.com/kubernetes/website.git (push)
    ```

6. 포크의 `origin/master` 와 `kubernetes/website` 의 `upstream/master` 에서 커밋을 가져온다.

    ```bash
    git fetch origin
    git fetch upstream
    ```

    이를 통해 변경을 시작하기 전에 로컬 리포지터리가 최신 상태인지 확인한다.

    {{< note >}}
    이 워크플로는 [쿠버네티스 커뮤니티 GitHub 워크플로](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md)와 다르다. 포크에 업데이트를 푸시하기 전에 로컬의 `master` 복사본을 `upstream/master` 와 병합할 필요가 없다.
    {{< /note >}}

### 브랜치 만들기

1. 작업할 브랜치 기반을 결정한다.

  - 기존 콘텐츠를 개선하려면, `upstream/master` 를 사용한다.
  - 기존 기능에 대한 새로운 콘텐츠를 작성하려면, `upstream/master` 를 사용한다.
  - 현지화된 콘텐츠의 경우, 현지화 규칙을 사용한다. 자세한 내용은 [쿠버네티스 문서 현지화](/ko/docs/contribute/localization_ko/)를 참고한다.
  - 다가오는 쿠버네티스 릴리스의 새로운 기능에 대해서는 기능 브랜치(feature branch)를 사용한다. 자세한 정보는 [릴리스 문서화](/docs/contribute/new-content/new-features/)를 참고한다.
  - 콘텐츠 재구성과 같이 여러 SIG Docs 기여자들이 협업하는 장기적인 작업에는,
    해당 작업을 위해 작성된 특정 기능 브랜치를
    사용한다.

    브랜치 선택에 도움이 필요하면, 슬랙 채널 `#sig-docs` 에 문의한다.

2. 1단계에서 식별된 브랜치를 기반으로 새 브랜치를 작성한다. 이 예에서는 기본 브랜치가 `upstream/master` 라고 가정한다.

    ```bash
    git checkout -b <my_new_branch> upstream/master
    ```

3.  텍스트 편집기를 사용하여 변경한다.

언제든지, `git status` 명령을 사용하여 변경한 파일을 본다.

### 변경 사항 커밋

풀 리퀘스트를 제출할 준비가 되면, 변경 사항을 커밋한다.

1. 로컬 리포지터리에서 커밋해야 할 파일을 확인한다.

    ```bash
    git status
    ```

    출력은 다음과 비슷하다.

    ```bash
    On branch <my_new_branch>
    Your branch is up to date with 'origin/<my_new_branch>'.

    Changes not staged for commit:
    (use "git add <file>..." to update what will be committed)
    (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   content/en/docs/contribute/new-content/contributing-content.md

    no changes added to commit (use "git add" and/or "git commit -a")
    ```

2. **Changes not staged for commit** 에 나열된 파일을 커밋에 추가한다.

    ```bash
    git add <your_file_name>
    ```

    각 파일에 대해 이 작업을 반복한다.

3.  모든 파일을 추가한 후, 커밋을 생성한다.

    ```bash
    git commit -m "Your commit message"
    ```

    {{< note >}}
    커밋 메시지에 [GitHub 키워드](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)를 사용하지 말자. 나중에 풀 리퀘스트 설명에 추가할
    수 있다.
    {{< /note >}}

4. 로컬 브랜치와 새로운 커밋을 원격 포크로 푸시한다.

    ```bash
    git push origin <my_new_branch>
    ```

### 로컬에서 변경 사항 미리보기 {#preview-locally}

변경 사항을 푸시하거나 풀 리퀘스트를 열기 전에 변경 사항을 로컬에서 미리 보는 것이 좋다. 미리보기를 사용하면 빌드 오류나 마크다운 형식 문제를 알아낼 수 있다.

website의 컨테이너 이미지를 만들거나 Hugo를 로컬에서 실행할 수 있다. 도커 이미지 빌드는 느리지만 [Hugo 단축코드](/docs/contribute/style/hugo-shortcodes/)를 표시하므로, 디버깅에 유용할 수 있다.

{{< tabs name="tab_with_hugo" >}}
{{% tab name="Hugo 컨테이너" %}}

{{< note >}}
아래 명령은 도커를 기본 컨테이너 엔진으로 사용한다. 이 동작을 무시하려면 `CONTAINER_ENGINE` 환경 변수를 설정한다.
{{< /note >}}

1.  로컬에서 이미지를 빌드한다.

      ```bash
      make docker-image
      # docker 사용(기본값)
      make container-image

      ### 또는 ###

      # podman 사용
      CONTAINER_ENGINE=podman make container-image
      ```

2. 로컬에서 `kubernetes-hugo` 이미지를 빌드한 후, 사이트를 빌드하고 서비스한다.

      ```bash
      make docker-serve
      # docker 사용(기본값)
      make container-serve

      ### 또는 ###

      # podman 사용
      CONTAINER_ENGINE=podman make container-serve
      ```

3.  웹 브라우저에서 `https://localhost:1313` 로 이동한다. Hugo는
    변경 사항을 보고 필요에 따라 사이트를 다시 구축한다.

4.  로컬의 Hugo 인스턴스를 중지하려면, 터미널로 돌아가서 `Ctrl+C` 를 입력하거나,
    터미널 창을 닫는다.

{{% /tab %}}
{{% tab name="Hugo 커맨드 라인" %}}

또는, 컴퓨터에 `hugo` 명령을 설치하여 사용한다.

1.  [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/master/netlify.toml)에 지정된 [Hugo](https://gohugo.io/getting-started/installing/) 버전을 설치한다.

2.  website 리포지터리를 업데이트하지 않았다면, `website/themes/docsy` 디렉터리가 비어 있다.
테마의 로컬 복제본이 없으면 사이트를 빌드할 수 없다. website 테마를 업데이트하려면, 다음을 실행한다.

    ```bash
    git submodule update --init --recursive --depth 1
    ```

3.  터미널에서, 쿠버네티스 website 리포지터리로 이동하여 Hugo 서버를 시작한다.

      ```bash
      cd <path_to_your_repo>/website
      hugo server --buildFuture
      ```

4.  웹 브라우저에서 `https://localhost:1313` 으로 이동한다. Hugo는
    변경 사항을 보고 필요에 따라 사이트를 다시 구축한다.

5.  로컬의 Hugo 인스턴스를 중지하려면, 터미널로 돌아가서 `Ctrl+C` 를 입력하거나,
    터미널 창을 닫는다.

{{% /tab %}}
{{< /tabs >}}

### 포크에서 kubernetes/website로 풀 리퀘스트 열기 {#open-a-pr}

1. 웹 브라우저에서 [`kubernetes/website`](https://github.com/kubernetes/website/) 리포지터리로 이동한다.
2. **New Pull Request** 를 선택한다.
3. **compare across forks** 를 선택한다.
4. **head repository** 드롭다운 메뉴에서, 포크를 선택한다.
5. **compare** 드롭다운 메뉴에서, 브랜치를 선택한다.
6. **Create Pull Request** 를 선택한다.
7. 풀 리퀘스트에 대한 설명을 추가한다.
    - **Title**(50자 이하): 변경 사항에 대한 의도를 요약한다.
    - **Description**: 변경 사항을 자세히 설명한다.
      - 관련된 GitHub 이슈가 있는 경우, `Fixes #12345` 또는 `Closes #12345` 를 설명에 포함한다. 이렇게 하면 GitHub의 자동화 기능이 PR을 병합한 후 언급된 이슈를 닫는다. 다른 관련된 PR이 있는 경우, 이들 PR도 연결한다.
      - 구체적인 내용에 대한 조언이 필요한 경우, 원하는 질문을 리뷰어가 생각해볼 수 있도록 설명에 포함한다.

8. **Create pull request** 버튼을 선택한다.

  축하한다! 여러분의 풀 리퀘스트가 [풀 리퀘스트](https://github.com/kubernetes/website/pulls)에 열렸다.


PR을 연 후, GitHub는 자동 테스트를 실행하고 [Netlify](https://www.netlify.com/)를 사용하여 미리보기를 배포하려고 시도한다.

  - Netlify 빌드가 실패하면, 자세한 정보를 위해 **Details** 를 선택한다.
  - Netlify 빌드가 성공하면, **Details** 를 선택하면 변경 사항이 적용된 쿠버네티스 website의 커밋하기 직전의 버전(staged version)이 열린다. 리뷰어가 변경 사항을 확인하는 방법이다.

또한 GitHub는 리뷰어에게 도움을 주기 위해 PR에 레이블을 자동으로 할당한다. 필요한 경우 직접 추가할 수도 있다. 자세한 내용은 [이슈 레이블 추가와 제거](/ko/docs/contribute/review/for-approvers/#이슈-레이블-추가와-제거)를 참고한다.

### 로컬에서 피드백 해결

1. 변경한 후, 이전 커밋을 수정한다.

    ```bash
    git commit -a --amend
    ```

    - `-a`: 모든 변경 사항을 커밋
    - `--amend`: 새로운 커밋을 만들지 않고, 이전 커밋을 수정한다.

2. 필요한 경우 커밋 메시지를 업데이트한다.

3. `git push origin <my_new_branch>` 를 사용해서 변경 사항을 푸시하고 Netlify 테스트를 다시 실행한다.

    {{< note >}}
      수정하는 대신 `git commit -m` 을 사용하는 경우, 병합하기 전에 [커밋을 스쿼시](#커밋-스쿼시하기)해야 한다.
    {{< /note >}}

#### 리뷰어의 변경

때때로 리뷰어가 여러분의 풀 리퀘스트를 커밋한다. 다른 변경을 하기 전에, 커밋을 가져온다.

1. 원격 포크에서 커밋을 가져오고 작업 브랜치를 리베이스한다.

    ```bash
    git fetch origin
    git rebase origin/<your-branch-name>
    ```

2. 리베이스한 후, 포크에 새로운 변경 사항을 강제로 푸시한다.

    ```bash
    git push --force-with-lease origin <your-branch-name>
    ```

#### 충돌 병합 및 리베이스

{{< note >}}
자세한 내용은 [Git 브랜치 - 기본 브랜치와 병합](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts), [고급 병합](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging)을 참조하거나, 슬랙 채널 `#sig-docs` 에서 도움을 요청한다.
{{< /note >}}

다른 기여자가 다른 PR에서 동일한 파일에 대한 변경 사항을 커밋하면, 병합 충돌이 발생할 수 있다. PR의 모든 병합 충돌을 해결해야 한다.

1. 포크를 업데이트하고 로컬 브랜치를 리베이스한다.

    ```bash
    git fetch origin
    git rebase origin/<your-branch-name>
    ```

    그런 다음 포크에 변경 사항을 강제로 푸시한다.

    ```bash
    git push --force-with-lease origin <your-branch-name>
    ```

2. `kubernetes/website` 의 `upstream/master` 에 대한 변경 사항을 가져오고 브랜치를 리베이스한다.

    ```bash
    git fetch upstream
    git rebase upstream/master
    ```

3. 리베이스의 결과를 검사한다.

    ```bash
    git status
    ```

  이 명령의 결과에 여러 파일이 충돌된 것으로 표시된다.

4. 충돌하는 각 파일을 열고 충돌 마커(`>>>`,`<<<` 그리고 `===`)를 찾는다. 충돌을 해결하고 충돌 마커를 삭제한다.

    {{< note >}}
    자세한 내용은 [충돌이 표시되는 방법](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented)을 참고한다.
    {{< /note >}}

5. 변경 세트에 파일을 추가한다.

    ```bash
    git add <filename>
    ```
6.  리베이스를 계속한다.

    ```bash
    git rebase --continue
    ```

7.  필요에 따라 2단계에서 5단계를 반복한다.

    모든 커밋을 적용한 후, `git status` 명령은 리베이스가 완료되었음을 나타낸다.

8. 브랜치를 포크에 강제로 푸시한다.

    ```bash
    git push --force-with-lease origin <your-branch-name>
    ```

    풀 리퀘스트에 더 이상 충돌이 표시되지 않는다.


### 커밋 스쿼시하기

{{< note >}}
자세한 내용은 [Git 도구 - 히스토리 다시 쓰기](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)를 참고하거나, 슬랙 채널 `#sig-docs` 에서 도움을 요청한다.
{{< /note >}}

PR에 여러 커밋이 있는 경우, PR을 병합하기 전에 해당 커밋을 단일 커밋으로 스쿼시해야 한다. PR의 **Commits** 탭에서 또는 `git log` 명령을 로컬에서 실행하여 커밋 수를 확인할 수 있다.

{{< note >}}
여기서는 `vim` 을 커맨드 라인 텍스트 편집기로 사용하는 것을 가정한다.
{{< /note >}}

1. 대화식 리베이스를 시작한다.

    ```bash
    git rebase -i HEAD~<number_of_commits_in_branch>
    ```

    커밋을 스쿼시하는 것은 일종의 리베이스이다. git의 `-i` 스위치는 리베이스를 대화형으로 할 수 있게 한다. `HEAD~<number_of_commits_in_branch>` 는 리베이스를 위해 살펴볼 커밋 수를 나타낸다.

    출력은 다음과 비슷하다.

    ```bash
    pick d875112ca Original commit
    pick 4fa167b80 Address feedback 1
    pick 7d54e15ee Address feedback 2

    # 3d18sf680..7d54e15ee 를 3d183f680 으로 리베이스한다 (3개 명령)

    ...

    # 이 행들은 순서를 바꿀 수 있다. 이들은 위에서 아래로 실행된다.
    ```

    출력의 첫 번째 섹션에는 리베이스의 커밋이 나열된다. 두 번째 섹션에는 각 커밋에 대한 옵션이 나열되어 있다. `pick` 단어를 바꾸면 리베이스가 완료되었을 때 커밋 상태가 변경된다.

    리베이스를 하는 목적인 `squash` 와 `pick` 에 집중한다.

    {{< note >}}
    자세한 내용은 [대화식 모드](https://git-scm.com/docs/git-rebase#_interactive_mode)를 참고한다.
    {{< /note >}}

2. 파일 편집을 시작한다.

    다음의 원본 텍스트를 변경한다.

    ```bash
    pick d875112ca Original commit
    pick 4fa167b80 Address feedback 1
    pick 7d54e15ee Address feedback 2
    ```

    아래와 같이 변경한다.

    ```bash
    pick d875112ca Original commit
    squash 4fa167b80 Address feedback 1
    squash 7d54e15ee Address feedback 2
    ```

    이것은 커밋 `4fa167b80 Address feedback 1` 과 `7d54e15ee Address feedback 2` 를 `d875112ca Original commit` 으로 스쿼시한다. 타임라인의 일부로 `d875112ca Original commit` 만 남긴다.

3. 파일을 저장하고 종료한다.

4. 스쿼시된 커밋을 푸시한다.

    ```bash
    git push --force-with-lease origin <branch_name>
    ```

## 다른 리포지터리에 기여하기

[쿠버네티스 프로젝트](https://github.com/kubernetes)에는 50개 이상의 리포지터리가 포함되어 있다. 이러한 리포지터리에는 사용자용 도움말 텍스트, 오류 메시지, API 레퍼런스 또는 코드 주석과 같은 문서가 포함되어 있다.

개선하려는 텍스트가 보이면, GitHub을 사용하여 쿠버네티스 조직의 모든 리포지터리를 검색한다.
이를 통해 어디에 이슈나 PR을 제출할지를 파악할 수 있다.

각 리포지터리에는 고유한 프로세스와 절차가 있다. 여러분이 이슈를
제기하거나 PR을 제출하기 전에, 그 리포지터리의 `README.md`, `CONTRIBUTING.md` 그리고
`code-of-conduct.md`(만약 이들 문서가 있다면)를 읽어본다.

대부분의 리포지터리에는 이슈와 PR 템플릿이 사용된다. 팀의 프로세스에 대한
느낌을 얻으려면 열린 이슈와 PR을 살펴보자. 이슈나 PR을 제출할 때
가능한 한 상세하게 템플릿의 내용을 작성한다.



## {{% heading "whatsnext" %}}


- 리뷰 프로세스에 대한 자세한 내용은 [리뷰하기](/ko/docs/contribute/review/reviewing-prs)를 읽어본다.
