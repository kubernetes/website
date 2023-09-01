---
title: "모니터링, 로깅, 및 디버깅"
description: 클러스터를 트러블슈팅할 수 있도록 모니터링과 로깅을 설정하거나, 컨테이너화된 애플리케이션을 디버깅한다.
weight: 20
# reviewers:
# - brendandburns
# - davidopp
content_type: concept
no_list: true
---

<!-- overview -->

때때로 문제가 발생할 수 있다. 이 가이드는 이러한 상황을 해결하기 위해 작성되었다. 문제 해결에는
다음 두 가지를 참고해 볼 수 있다.

* [애플리케이션 디버깅하기](/ko/docs/tasks/debug/debug-application/) - 쿠버네티스에
  코드를 배포하였지만 제대로 동작하지 않는 사용자들에게 유용한 가이드이다.
* [클러스터 디버깅하기](/ko/docs/tasks/debug/debug-cluster/) - 쿠버네티스 클러스터에
  문제를 겪고 있는 클러스터 관리자 혹은 기분이 나쁜 사람들에게 유용한 가이드이다.

여러분이 현재 사용중인 릴리스에 대한 알려진 이슈들을 다음의 [릴리스](https://github.com/kubernetes/kubernetes/releases)
페이지에서 확인해 볼 수도 있다.

<!-- body -->

## 도움 받기

여러분의 문제가 위에 소개된 어떠한 가이드로도 해결할 수 없다면, 
쿠버네티스 커뮤니티로부터 도움을 받을 수 있는 다양한 방법들을 시도해 볼 수 있다.

### 질문

이 사이트의 문서들은 다양한 질문들에 대한 답변을 제공할 수 있도록 구성되어 있다. 
[개념](/ko/docs/concepts/)은 쿠버네티스의 아키텍처와 각 컴포넌트들이 어떻게 동작하는지에 대해 설명하고, 
[시작하기](/ko/docs/setup/)는 쿠버네티스를 시작하는 데 유용한 지침들을 제공한다. 
[태스크](/ko/docs/tasks/)는 흔히 사용되는 작업들을 수행하는 방법에 대해 소개하고, 
[튜토리얼](/ko/docs/tutorials/)은 실무, 산업 특화 혹은 종단간 개발에 특화된 시나리오를 통해 차근차근 설명한다. 
[레퍼런스](/ko/docs/reference/) 섹션에서는 
[쿠버네티스 API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)와 
[`kubectl`](/ko/docs/reference/kubectl/)과 같은 커맨드 라인 인터페이스(CLI)에 대한 
상세한 설명을 다룬다.

## 도와주세요! 내 질문이 다뤄지지 않았어요! 도움이 필요해요!

### 스택 오버플로우

여러분들이 겪고 있는 문제와 동일한 문제에 대한 도움을 위해 커뮤니티의 다른 사람들이 이미
질문을 올렸을 수 있다. 쿠버네티스 팀은
[쿠버네티스 태그가 등록된 글](https://stackoverflow.com/questions/tagged/kubernetes)들을 모니터링하고 있다.
발생한 문제에 도움이 되는 기존 질문이 없다면,
**[해당 질문이 스택 오버플로우에 적합한지](https://stackoverflow.com/help/on-topic)와 [새로운 질문을 올리는 방법](https://stackoverflow.com/help/how-to-ask)에 대한 가이드를 읽은 뒤에** 
[새로운 질문](https://stackoverflow.com/questions/ask?tags=kubernetes)을 올리자!

### 슬랙

쿠버네티스 슬랙의 `#kubernetes-users` 채널을 통해 쿠버네티스 커뮤니티의 여러 사람들을 접할 수도 있다.
쿠버네티스 슬랙을 사용하기 위해서는 등록이 필요한데, 다음을 통해 [채널 초대 요청](https://slack.kubernetes.io)을 할 수 있다.
(누구나 가입할 수 있다). 슬랙 채널은 여러분이 어떠한 질문을 할 수 있도록 언제나 열려있다.
가입하고 나면 여러분의 웹 브라우저나 슬랙 앱을 통해 [쿠버네티스 슬랙](https://kubernetes.slack.com)
에 참여할 수 있다.

쿠버네티스 슬랙에 참여하게 된다면, 다양한 주제의 흥미와 관련된 여러 채널들에 대해
살펴본다. 가령, 쿠버네티스를 처음 접하는 사람이라면 
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice) 채널에 가입할 수 있다. 혹은, 만약 당신이 개발자라면
[`#kubernetes-contributors`](https://kubernetes.slack.com/messages/kubernetes-contributors) 채널에 가입할 수 있다.

또한 각 국가 및 사용 언어별 채널들이 여럿 존재한다. 사용하는 언어로 도움을 받거나 정보를
얻기 위해서는 다음의 채널에 참가한다.

{{< table caption="국가 / 언어별 슬랙 채널" >}}
국가 | 채널
:---------|:------------
China(중국) | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
Finland(핀란드) | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
France(프랑스) | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
Germany(독일) | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
India(인도) | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
Italy(이탈리아) | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
Japan(일본) | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
Korea(한국) | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
Netherlands(네덜란드) | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
Norway(노르웨이) | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
Poland(폴란드) | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
Russia(러시아) | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
Spain(스페인) | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
Sweden(스웨덴) | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
Turkey(터키) | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)
{{< /table >}}

### 포럼

공식 쿠버네티스 포럼에 참여하는 것도 추천되는 방법이다. [discuss.kubernetes.io](https://discuss.kubernetes.io).

### 버그와 기능 추가 요청

만약 여러분이 버그처럼 보이는 것을 발견했거나, 기능 추가 요청을 하기 위해서는
[GitHub 이슈 트래킹 시스템](https://github.com/kubernetes/kubernetes/issues)을 사용한다.

이슈를 작성하기 전에는, 여러분의 이슈가 기존 이슈에서 이미 
다뤄졌는지 검색해 본다.

버그를 보고하는 경우에는, 해당 문제를 어떻게 재현할 수 있는지에 관련된 상세한 정보를 포함한다.
포함되어야 하는 정보들은 다음과 같다.

* 쿠버네티스 버전: `kubectl version`
* 클라우드 프로바이더, OS 배포판, 네트워크 구성, 및 도커 버전
* 문제를 재현하기 위한 절차
