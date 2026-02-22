---
layout: blog
title: '쿠버네티스 1.22: 새로운 정점에 도달(Reaching New Peaks)'
date: 2021-08-04
slug: kubernetes-1-22-release-announcement
evergreen: true
author: >
  [쿠버네티스 1.22 릴리스 팀](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.22/release-team.md)
translator: >
  [손석호(ETRI)](https://github.com/seokho-son),
  [서지훈(ETRI)](https://github.com/jihoon-seo),
  [쿠버네티스 문서 한글화 팀](https://kubernetes.slack.com/archives/CA1MMR86S)
---

2021년의 두 번째 릴리스인 쿠버네티스 1.22 릴리스를 발표하게 되어 기쁘게 생각합니다!

이번 릴리스는 53개의 개선 사항(enhancement)으로 구성되어 있습니다. 13개의 개선 사항은 스테이블(stable)로 졸업하였으며(graduated), 24개의 개선 사항은 베타(beta)로 이동하였고, 16개는 알파(alpha)에 진입하였습니다. 또한, 3개의 기능(feature)을 더 이상 사용하지 않게 되었습니다(deprecated).

이번 해 4월에는 쿠버네티스 릴리스 케이던스(cadence)가 1년에 4회에서 3회로 공식적으로 변경되었습니다. 이번 릴리스가 해당 방식에 따라 긴 주기를 가진 첫 번째 릴리스입니다. 쿠버네티스 프로젝트가 성숙해짐에 따라, 사이클(cycle) 당 개선 사항도 늘어나고 있습니다. 이것은 기여자 커뮤니티 및 릴리스 엔지니어링 팀에게, 버전과 버전 사이에 더 많은 작업이 필요하다는 것을 의미합니다. 또한 점점 더 많은 기능을 포함하는 릴리스로 최신 상태를 유지하려는 최종-사용자 커뮤니티에도 부담을 줄 수 있습니다.

연간 4회에서 3회로의 릴리스 케이던스 변경을 통해 프로젝트의 다양한 측면(기여와 릴리스가 관리되는 방법, 업그레이드 및 최신 릴리스 유지에 대한 커뮤니티의 역량 등)에 대한 균형을 이루고자 하였습니다.

더 자세한 사항은 공식 블로그 포스트 [쿠버네티스 릴리스 케이던스 변경: 알아두어야 할 사항](/blog/2021/07/20/new-kubernetes-release-cadence/)에서 확인할 수 있습니다.


## 주요 주제

### 서버-사이드 어플라이(Server-side Apply)가 GA로 졸업

[서버-사이드 어플라이](/docs/reference/using-api/server-side-apply/)는 쿠버네티스 API 서버에서 동작하는 신규 필드 오너십이며 오브젝트 병합 알고리즘입니다. 서버-사이드 어플라이는 사용자와 컨트롤러가 선언적인 구성을 통해서 자신의 리소스를 관리할 수 있도록 돕습니다. 이 기능은 단순히 fully specified intent를 전송하는 것만으로 자신의 오브젝트를 선언적으로 생성 또는 수정할 수 있도록 허용합니다. 몇 릴리스에 걸친 베타 과정 이후, 서버-사이드 어플라이는 이제 GA(generally available)가 되었습니다.

### 외부 크리덴셜 제공자가 이제 스테이블이 됨

쿠버네티스 클라이언트 [크리덴셜 플러그인](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)에 대한 지원은 1.11부터 베타였으나, 쿠버네티스 1.22 릴리스에서 스테이블로 졸업하였습니다. 해당 GA 기능 집합은 인터랙티브 로그인 플로우(interactive login flow)를 제공하는 플러그인에 대한 향상된 지원을 포함합니다. 또한, 많은 버그가 수정되었습니다. 플러그인 개발은 [sample-exec-plugin](https://github.com/ankeesler/sample-exec-plugin)을 통해 시작할 수 있습니다.

### etcd 3.5.0으로 변경

쿠버네티스의 기본 백엔드 저장소인 etcd 3.5.0이 신규로 릴리스되었습니다. 신규 릴리스에는 보안, 성능, 모니터링, 개발자 경험 측면의 개선 사항이 포함되어 있습니다. 많은 버그가 수정되었으며 구조화된 로깅으로 마이그레이션(migration to structured logging) 및 빌트-인 로그 순환(built-in log rotation)과 같은 신규 중요 기능들도 일부 포함되었습니다. 해당 릴리스는 트래픽 부하에 대한 솔루션 구현을 위한 자세한 차기 로드맵도 제시하고 있습니다. [3.5.0 릴리스 발표](https://etcd.io/blog/2021/announcing-etcd-3.5/)에서 변경에 대한 자세한 항목을 확인할 수 있습니다.

### 메모리 리소스에 대한 서비스 품질(Quality of Service)

쿠버네티스는 원래 v1 cgroups API를 사용했습니다. 해당 디자인에 의해서, `Pod`에 대한 QoS 클래스는 CPU 리소스(예를 들면, `cpu_shares`)에만 적용되었습니다. 알파 기능으로, 쿠버네티스 v1.22에서는 메모리 할당(allocation)과 격리(isolation)를 제어하기 위한 cgroups v2 API를 사용할 수 있습니다. 이 기능은 메모리 리소스에 대한 컨텐션(contention)이 있을 때 워크로드와 노드의 가용성을 향상시키고, 컨테이너 라이프사이클에 대한 예측 가능성을 향상시킬 수 있도록 디자인되었습니다.

### 노드 시스템 스왑(swap) 지원

모든 시스템 관리자나 쿠버네티스 사용자는 쿠버네티스를 설정하거나 사용할 때 스왑 공간(space)을 비활성화해야 한다는 동일한 상황에 놓여 있었습니다. 쿠버네티스 1.22 릴리스에서는 노드의 스왑 메모리를 지원합니다(알파). 이 변경은 블록 스토리지의 일부를 추가적인 가상 메모리로 취급하도록, 관리자의 옵트인(opt in)을 받아서 리눅스 노드에 스왑을 구성합니다.

### 윈도우(Windows) 개선 사항 및 기능

SIG Windows는 계속해서 성장하는 개발자 커뮤니티를 지원하기 위해서 [개발 환경](https://github.com/kubernetes-sigs/sig-windows-dev-tools/)을 릴리스하였습니다. 이 새로운 도구는 여러 CNI 제공자를 지원하며, 여러 플랫폼에서 구동할 수 있습니다. 윈도우 kubelet과 kube-proxy를 컴파일하고, 다른 쿠버네티스 컴포넌트와 함께 빌드될 수 있도록 하는 새로운 방법을 제공하여, 최신(bleeding-edge) 윈도우 기능을 스크래치(scratch)부터 실행할 수 있도록 지원합니다.

1.22 릴리스에서 윈도우 노드의 CSI 지원이 GA 상태가 되었습니다. 쿠버네티스 v1.22에서는 특권을 가진(privileged) 윈도우 컨테이너가 알파가 되었습니다. 윈도우 노드에서 CSI 스토리지를 사용하도록, 노드에서의 스토리지 작업에 대한 특권을 가진(privileged) [CSIProxy](https://github.com/kubernetes-csi/csi-proxy)가 CSI 노드 플러그인을 특권을 가지지 않은(unprivileged) 파드로 배치되도록 합니다.

### 기본(default) seccomp 프로파일

알파 기능인 기본 seccomp 프로파일이 신규 커맨드라인 플래그 및 설정과 함께 kubelet에 추가되었습니다. 이 신규 기능을 사용하면, `Unconfined`대신 `RuntimeDefault` seccomp 프로파일을 기본으로 사용하는 seccomp이 클러스터 전반에서 기본이 됩니다. 이는 쿠버네티스 디플로이먼트(Deployment)의 기본 보안을 강화합니다. 워크로드에 대한 보안이 기본으로 더 강화되었으므로, 이제 보안 관리자도 조금 더 안심하고 쉴 수 있습니다. 이 기능에 대한 자세한 사항은 공식적인 [seccomp 튜토리얼](/docs/tutorials/security/seccomp/#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads)을 참고하시기 바랍니다.

### kubeadm을 통한 보안성이 더 높은 컨트롤 플레인

이 신규 알파 기능을 사용하면 `kubeadm` 컨트롤 플레인 컴포넌트들을 루트가 아닌(non-root) 사용자로 동작시킬 수 있습니다. 이것은 `kubeadm`에 오랫동안 요청되어 온 보안 조치 사항입니다. 이 기능을 사용하려면 `kubeadm`에 한정된 RootlessControlPlane 기능 게이트를 활성화해야 합니다. 이 알파 기능을 사용하여 클러스터를 배치하는 경우, 사용자의 컨트롤 플레인은 더 낮은 특권(privileges)을 가지고 동작하게 됩니다.

또한 쿠버네티스 1.22는 `kubeadm`의 신규 [v1beta3 구성 API](/docs/reference/config-api/kubeadm-config.v1beta3/)를 제공합니다. 이 버전에는 오랫동안 요청되어 온 몇 가지 기능들이 추가되었고, 기존의 일부 기능들은 사용 중단(deprecated)되었습니다. 이제 v1beta3 버전이 선호되는(preferred) API 버전입니다. 그러나, v1beta2 API도 여전히 사용 가능하며 아직 사용 중단(deprecated)되지 않았습니다.

## 주요 변경 사항

### 사용 중단된(deprecated) 일부 베타 APIs의 제거

GA 버전과 중복된 사용 중단(deprecated)된 여러 베타 API가 1.22에서 제거되었습니다. 기존의 모든 오브젝트는 스테이블 APIs를 통해 상호 작용할 수 있습니다. 이 제거에는 `Ingress`, `IngressClass`, `Lease`, `APIService`, `ValidatingWebhookConfiguration`, `MutatingWebhookConfiguration`, `CustomResourceDefinition`, `TokenReview`, `SubjectAccessReview`, `CertificateSigningRequest` API의 베타 버전이 포함되었습니다.

전체 항목은 [사용 중단된 API에 대한 마이그레이션 지침](/docs/reference/using-api/deprecation-guide/#v1-22)과 블로그 포스트 [1.22에서 쿠버네티스 API와 제거된 기능: 알아두어야 할 사항](https://blog.k8s.io/2021/07/14/upcoming-changes-in-kubernetes-1-22/)에서 확인 가능합니다.

###  임시(ephemeral) 컨테이너에 대한 API 변경 및 개선

1.22에서 [임시 컨테이너](/ko/docs/concepts/workloads/pods/ephemeral-containers/)를 생성하기 위한 API가 변경되었습니다. 임시 컨테이너 기능은 알파이며 기본적으로 비활성화되었습니다. 신규 API는 예전 API를 사용하려는 클라이언트에 대해 동작하지 않습니다.

스테이블 기능에 대해서, kubectl 도구는 쿠버네티스의 [버전 차이(skew) 정책](/ko/releases/version-skew-policy/)을 따릅니다. 그러나, kubectl v1.21 이하의 버전은 임시 컨테이너에 대한 신규 API를 지원하지 않습니다. 만약 `kubectl debug`를 사용하여 임시 컨테이너를 생성할 계획이 있고 클러스터에서 쿠버네티스 v1.22로 구동하고 있는 경우, kubectl v1.21 이하의 버전에서는 그렇게 할 수 없다는 것을 알아두어야 합니다. 따라서 만약 클러스터 버전을 혼합하여 `kubectl debug`를 사용하려면 kubectl를 1.22로 업데이트하길 바랍니다.

## 기타 업데이트

### 스테이블로 졸업

* [바운드 서비스 어카운트 토큰 볼륨(Bound Service Account Token Volumes)](https://github.com/kubernetes/enhancements/issues/542)
* [CSI 서비스 어카운트 토큰(CSI Service Account Token)](https://github.com/kubernetes/enhancements/issues/2047)
* [윈도우의 CSI 플러그인 지원](https://github.com/kubernetes/enhancements/issues/1122)
* [사용 중단된 API 사용에 대한 경고(warning) 메커니즘](https://github.com/kubernetes/enhancements/issues/1693)
* [PodDisruptionBudget 축출(eviction)](https://github.com/kubernetes/enhancements/issues/85)

### 주목할만한 기능 업데이트

* 파드시큐리티폴리시(PodSecurityPolicy)를 대체하기 위한 새로운 [파드시큐리티(PodSecurity) 어드미션(admission)](https://github.com/kubernetes/enhancements/issues/2579) 알파 기능이 소개됨.
* [메모리 관리자(manager)](https://github.com/kubernetes/enhancements/issues/1769)가 베타가 됨.
* [API 서버 트레이싱(tracing)](https://github.com/kubernetes/enhancements/issues/647)을 활성화하는 새로운 알파 기능.
* [kubeadm 설정(configuration)](https://github.com/kubernetes/enhancements/issues/970) 포맷의 신규 v1beta3 버전.
* 퍼시스턴트볼륨(PersistentVolume)을 위한 [Generic data populators](https://github.com/kubernetes/enhancements/issues/1495)를 알파로 활용 가능.
* 쿠버네티스 컨트롤 플레인이 이제 [크론잡 v2 컨트롤러(CronJobs v2 controller)](https://github.com/kubernetes/enhancements/issues/19)를 사용하게 됨.
* 알파 기능으로, 모든 쿠버네티스 노드 컴포넌트(kubelet, kube-proxy, 컨테이너 런타임을 포함)는 [루트가 아닌 사용자로](https://github.com/kubernetes/enhancements/issues/2033) 동작시킬 수 있음.

# 릴리스 노트

1.22 릴리스의 자세한 전체 사항은 [릴리스 노트](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md)에서 확인할 수 있습니다.

# 릴리스 위치

쿠버네티스 1.22는 [여기](/releases/download/)에서 다운로드할 수 있고, [GitHub 프로젝트](https://github.com/kubernetes/kubernetes/releases/tag/v1.22.0)에서도 찾을 수 있습니다.

쿠버네티스를 시작하는 데 도움이 되는 좋은 자료가 많이 있습니다. 쿠버네티스 사이트에서 [상호 작용형 튜토리얼](/ko/docs/tutorials/)을 수행할 수도 있고, [kind](https://kind.sigs.k8s.io)와 도커 컨테이너를 사용하여 로컬 클러스터를 사용자의 머신에서 구동해볼 수도 있습니다. 클러스터를 스크래치(scratch)부터 구축해보고 싶다면, Kelsey Hightower의 [쿠버네티스 어렵게 익히기(the Hard Way)](https://github.com/kelseyhightower/kubernetes-the-hard-way) 튜토리얼을 확인해보시기 바랍니다.

# 릴리스 팀

이 릴리스는 쿠버네티스 릴리스에 포함되는 모든 기술 콘텐츠, 문서, 코드, 기타 구성 요소 등을 제공하기 위해 팀들로 모인 매우 헌신적인 개인 그룹에 의해 가능했습니다.

팀을 성공적인 릴리스로 이끈 릴리스 리드 Savitha Raghunathan에게 감사드리며, 릴리스 팀 이외에도 커뮤니티에 1.22 릴리스를 제공하기 위해 열심히 작업하고 지원한 모든 사람들에게 감사드립니다.

우리는 또한 이 자리를 빌려 올해 초에 생을 마감한 팀 멤버 Peeyush Gupta를 추모하고 싶습니다. Peeyush Gupta는 SIG ContribEx 및 쿠버네티스 릴리스 팀에 활발히 참여했으며, 최근에는 1.22 커뮤니케이션 리드를 역임하였습니다. 그의 기여와 노력은 앞으로도 커뮤니티에 지속적으로 영향을 줄 것입니다. 그에 대한 추억과 추모를 공유하기 위한 [CNCF 추모](https://github.com/cncf/memorials/blob/main/peeyush-gupta.md) 페이지가 생성되어 있습니다.

# 릴리스 로고

![쿠버네티스 1.22 릴리스 로고](/images/blog/2021-08-04-kubernetes-release-1.22/kubernetes-1.22.png)

진행 중인 팬데믹, 자연재해 및 항상 존재하는 번아웃의 그림자 속에서도, 쿠버네티스 1.22 릴리스는 53개의 개선 사항을 제공하였습니다. 이것은 현재까지 가장 큰 릴리스입니다. 이 성과는 열심히 일하고 열정적인 릴리스 팀 구성원과 쿠버네티스 생태계의 대단한 기여자들 덕분에 달성할 수 있었습니다. 이 릴리스 로고는 새로운 마일스톤과 새로운 기록을 세우기 위한 리마인더입니다. 이 로고를 모든 릴리스 팀 구성원, 등산객, 별을 보는 사람들에게 바칩니다!

이 로고는 [Boris Zotkin](https://www.instagram.com/boris.z.man/)가 디자인하였습니다. Boris는 MathWorks에서 Mac/Linux 관리자 역할을 맡고 있습니다. 그는 인생에서의 소소한 재미를 즐기고 가족과 함께 시간을 보내는 것을 사랑합니다. 이 기술에 정통(tech-savvy)한 개인은 항상 도전을 준비하며 친구를 돕는 것에 행복을 느낍니다!

# 사용자 하이라이트

- 5월에 CNCF가 전 세계에 걸친 27 기관을 다양한 클라우드 네이티브 생태계의 신규 멤버로 받았습니다. 이 신규 [멤버](https://www.cncf.io/announcements/2021/05/05/27-new-members-join-the-cloud-native-computing-foundation/)는 다가오는 [KubeCon + CloudNativeCon NA in Los Angeles (October 12 – 15, 2021)](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/)를 포함한 CNCF 이벤트들에 참여할 것입니다.
- CNCF는 [KubeCon + CloudNativeCon EU – Virtual 2021](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/)에서 Spotify에 [최고 엔드 유저 상(Top End User Award)](https://www.cncf.io/announcements/2021/05/05/cloud-native-computing-foundation-grants-spotify-the-top-end-user-award/)을 수여했습니다.

# 프로젝트 속도(Velocity)

[CNCF K8s DevStats 프로젝트](https://k8s.devstats.cncf.io/)는 쿠버네티스와 다양한 서브-프로젝트에 대한 흥미로운 데이터를 수집하고 있습니다. 여기에는 개인 기여부터 기여하는 회사 수에 이르기까지 모든 것이 포함되며, 이 생태계를 발전시키는 데 필요한 노력의 깊이와 넓이를 보여줍니다.

우리는 15주(4월 26일에서 8월 4일) 간 진행된 v1.22 릴리스 주기에서, [1063개의 기업](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.21.0%20-%20now&var-metric=contributions)과 [2054명의 개인](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.21.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All)의 기여를 보았습니다.

# 생태계 업데이트

- 세 번째 가상 이벤트인 [KubeCon + CloudNativeCon Europe 2021](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/)이 5월에 열렸습니다. 모든 발표가 [온디맨드로 확인 가능](https://www.youtube.com/playlist?list=PLj6h78yzYM2MqBm19mRz9SYLsw4kfQBrC)합니다.
- [Spring Term LFX 프로그램](https://www.cncf.io/blog/2021/07/13/spring-term-lfx-program-largest-graduating-class-with-28-successful-cncf-interns)이 28명의 성공적인 인턴을 배출한 최대 규모의 졸업반을 가졌습니다!
- CNCF가 연초에 클라우드 네이티브 커뮤니티와 함께 배우고, 성장하고, 협업하기를 원하는 전 세계 누구에게나 상호 작용형 미디어 경험을 제공하고자, [Twitch에서 라이브스트리밍](https://www.cncf.io/blog/2021/06/03/cloud-native-community-goes-live-with-10-shows-on-twitch/)을 시작하였습니다.

# 이벤트 업데이트

- [KubeCon + CloudNativeCon North America 2021](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/)가 October 12 – 15, 2021에 Los Angeles에서 열립니다! 컨퍼런스와 등록에 대한 더 자세한 정보는 이벤트 사이트에서 찾을 수 있습니다.
- [쿠버네티스 커뮤니티 Days](https://community.cncf.io/kubernetes-community-days/about-kcd/)가 Italy, UK, Washington DC에서 이벤트를 앞두고 있습니다.

# 다가오는 릴리스 웨비나

이번 릴리스에 대한 중요 기능뿐만 아니라 업그레이드 계획을 위해 필요한 사용 중지된 사항이나 제거에 대한 사항을 학습하고 싶다면, 2021년 10월 5일에 쿠버네티스 1.22 릴리스 팀 웨비나에 참여하세요. 더 자세한 정보와 등록에 대해서는 CNCF 온라인 프로그램 사이트의 [이벤트 페이지](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-122-release/)를 확인하세요.

# 참여하기

만약 쿠버네티스 커뮤니티 기여에 관심이 있다면, 특별 관심 그룹(Special Interest Groups, SIGs)이 좋은 시작 지점이 될 수 있습니다. 그중 많은 SIG가 당신의 관심사와 일치될 수 있습니다! 만약 커뮤니티와 공유하고 싶은 것이 있다면, 주간 커뮤니티 미팅에 참석할 수 있습니다. 또한 다음 중 어떠한 채널이라도 활용할 수 있습니다.

* [쿠버네티스 기여자](https://www.kubernetes.dev/) 웹사이트에서 기여에 대한 더 자세한 사항을 확인
* 최신 정보 업데이트를 위해 [@Kubernetesio](https://twitter.com/kubernetesio) 트위터 팔로우
* [논의(discuss)](https://discuss.kubernetes.io/)에서 커뮤니티 논의에 참여
* [슬랙](https://slack.k8s.io/)에서 커뮤니티에 참여
* 쿠버네티스 [사용기](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform) 공유
* 쿠버네티스에서 일어나는 일에 대한 자세한 사항을 [블로그](/blog/)를 통해 읽기
* [쿠버네티스 릴리스 팀](https://github.com/kubernetes/sig-release/tree/master/release-team)에 대해 더 알아보기
