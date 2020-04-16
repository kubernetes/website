---
content_template: templates/concept
title: 쿠버네티스 문서에 기여하기
linktitle: 기여
main_menu: true
weight: 80
---

{{% capture overview %}}

쿠버네티스 문서 또는 웹사이트에 기여하여 도움을 제공하고 싶다면,
우리는 당신의 도움을 기쁘게 생각한다! 당신이 새로운 프로젝트에 참여했거나
오랜 시간 동안 진행해온 누군가로서,
혹은 개발자, 최종 사용자 또는 단지 오타를 보고 참지 못하는 누군가로서 기여할 수 있다.

{{% /capture %}}

{{% capture body %}}

## 시작하기

누구든지 문제에 대한 설명이나, 원하는 문서의 개선사항에 대한 이슈를 오픈 또는 풀 리퀘스트(PR)로 변경하는 기여를 할 수 있다.
일부 작업에는 쿠버네티스 조직에서 더 많은 신뢰와 더 많은 접근이 필요할 수 있다.
역할과 권한에 대한 자세한 내용은
[SIG Docs 참여](/ko/docs/contribute/participating/)를 본다.

쿠버네티스 문서는 GitHub 리포지터리에 있다. 우리는 누구나
기여를 환경하지만, 쿠버네티스 커뮤니티에서 효과적으로 활동하려면 git과 GitHub의
기초적인 이해가 필요하다.

문서에 참여하려면

1. CNCF [Contributor License Agreement](https://github.com/kubernetes/community/blob/master/CLA.md)에 서명한다.
2. [문서 리포지터리](https://github.com/kubernetes/website) 와 웹사이트의 [정적 사이트 생성기](https://gohugo.io)를 숙지한다.
3. [콘텐츠 향상](https://kubernetes.io/docs/contribute/start/#improve-existing-content)과 [변경 검토](https://kubernetes.io/docs/contribute/start/#review-docs-pull-requests)의 기본 프로세스를 이해하도록 한다.

## 기여 모범 사례

- 명확하고, 의미있는 GIT 커밋 메시지를 작성한다.
- 이슈를 참조하고, PR이 병합될 때 이슈를 자동으로 닫는 _Github 특수 키워드_ 를 포함한다.
- 오타 수정, 스타일 변경 또는 문법 변경과 같이 변경이 적은 PR을 생성할때, 비교적으로 적은 변화로 많은 커밋 개수를 받지 않도록 반드시 커밋을 스쿼시(squash)한다.
- 변경한 코드를 묘사하고, 코드를 변경한 이유를 포함하는 멋진 PR 설명을 포함하고 있는지와 리뷰어를 위한 충분한 정보가 있는지 꼭 확인한다.
- 추가적인 읽을거리들
    - [chris.beams.io/posts/git-commit/](https://chris.beams.io/posts/git-commit/)
    - [github.com/blog/1506-closing-issues-via-pull-requests ](https://github.com/blog/1506-closing-issues-via-pull-requests )
    - [davidwalsh.name/squash-commits-git ](https://davidwalsh.name/squash-commits-git )

## 다른 방법으로 기여하기

- 트위터나 스택오버플로(Stack Overflow) 등의 온라인 포럼의 쿠버네티스 커뮤니티에 기여하거나 지역 모임과 쿠버네티스 이벤트에 관하여 알고 싶다면 [쿠버네티스 커뮤니티 사이트](/community/)를 확인한다.
- 기능 개발에 기여하려면 [기여자 치트시트](https://github.com/kubernetes/community/tree/master/contributors/guide/contributor-cheatsheet)를 읽고 시작한다.

{{% /capture %}}

{{% capture whatsnext %}}

- 문서에 기여하는 기본적인 사항들에 대한 자세한 내용은 [기여 시작](/docs/contribute/start/)을 본다.
- 변경을 제안할 때는 [쿠버네티스 문서 스타일가이드](/docs/contribute/style/style-guide/)를 따른다.
- SIG Docs에 대한 더 자세한 정보는 [SIG Docs에 참여하기](/ko/docs/contribute/participating/)를 본다.
- 쿠버네티스 문서 현지화에 대한 자세한 내용은 [쿠버네티스 문서 현지화](/docs/contribute/localization/)를 본다.

{{% /capture %}}
