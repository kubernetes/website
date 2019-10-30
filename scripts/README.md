# Kubernetes 문서를 위한 개발 스크립트

| 스크립트                  | 설명                                                                                                                          |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `find_pr.py`            | GitHub 풀 리퀘스트가 지정된 파일에 접촉하는 항목을 찾으십시오.                                                                           |
| `upstream_changes.py`   | 두 버전 간에 발생한 변경 사항을 찾으십시오.                                                                                      |
| `test_examples.sh`      | 이 스크립트는 변경 사항이 웹 사이트에 추가로 제공되는 예제 파일에 영향을 미치는지 테스트합니다.                                              |
| `check-headers-file.sh` | 이 스크립트는 프로덕션 환경에 있는 경우 헤더를 확인합니다.                                                                |
| `hugo-version-check.sh` | 이 스크립트는 로컬의 Hugo 버전과 프로덕션에 사용된 버전 일치하는지 확인합니다.                                            |
| `diff_l10n_branches.py` | 이 스크립트는 l10n 팀의 milestone 브렌치와 비교하여`content / <l10n-lang>`디렉토리에 오래된 내용에 대한 보고서를 생성합니다. |



## 요구사항

이러한 스크립트 중 일부에는 외부 요구 사항이 있습니다. 다음 명령을 사용하여 설치하실 수 있습니다.

```
python3 -m pip install -r requirements.txt
```

## find_pr.py

```
$ ./find_pr.py --help
Usage: find_pr.py [OPTIONS] PATH

  GitHub 풀 리퀘스트가 지정된 파일에 접촉하는 항목을 찾으십시오.

  ex: ./find_pr.py --tags "language/fr" "content/fr/_index.html"

Options:
  --tags TEXT          풀 리퀘스트의 태그 (여러번 전달이 가능)
  --token TEXT         GitHub API token. (기본 환경 변수 GITHUB_TOKEN)
  --last-n-pr INTEGER  마지막 n번째 풀 리퀘스트
  --help               이 메세지를 보여주고 종료.
```

## upstream_changes.py

```
$ ./upstream_changes.py --help
Usage: upstream_changes.py [OPTIONS] PATH

   두 버전 간에 발생한 변경 사항을 찾으십시오

  ex: ./upstream_changes.py content/fr/_index.html

Options:
  --reference TEXT  파일의 참조 버전을 지정하십시오. 기본 설정은 영어입니다.
  --git-path TEXT   구체적은 git 경로
  --help            이 메세지를 보여주고 종료.
```

## test_examples.sh

이 스크립트는 변경 사항이 웹 사이트 추가로 된 예제 파일에 영향을 주는지 테스트합니다.

종속된 파일을 설치하려면:

    $ ./scripts/test_examples.sh install

예제를 실행하려면:

    $ ./scripts/test_examples.sh run

## check-headers-file.sh

이 스크립트는 프로덕션 환경에 있는 경우 헤더를 확인합니다.

    ./scripts/check-headers-file.sh

## hugo-version-check.sh

이 스크립트는 로컬의 Hugo 버전과 프로덕션에 사용된 버전 일치하는지 확인합니다.

    ./scripts/hugo-version-check.sh

## diff_l10n_branches.py

```
$ scripts/diff_l10n_branches.py --help
Usage: diff_l10n_branches.py [OPTIONS] L10N_LANG L_COMMIT R_COMMIT

  이 스크립트는 l10n 팀의 milestone 브렌치와 비교하여`content / <l10n-
  lang>`디렉토리에 오래된 내용에 대한 보고서를 생성합니다.

  L10n 팀 소유자는 새 팀 milestone을 시작할 때 이 스크립트에서 생성된 
  보고서로 GitHub 문제를 열 수 있습니다.

  ex: `scripts/diff_l10n_branches.py ko dev-1.15-ko.3 dev-1.15-ko.4`

Options:
  --src-lang TEXT  소스 언어
  --help           이 메세지를 보여주고 종료.
```
