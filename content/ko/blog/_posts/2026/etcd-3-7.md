---
title: etcd v3.7.0 발표
slug: announcing-etcd-3.7
date: 2026-07-08T20:00:00+0800
canonicalUrl: https://etcd.io/blog/2026/announcing-etcd-3.7/
draft: false
author: "SIG Etcd Leads"
translator: >
  [Jaehan Byun(Supergate)](https://github.com/jaehanbyun)
---

_이 글은 [원문 발표](https://etcd.io/blog/2026/announcing-etcd-3.7/)를 미러링한 글입니다._

오늘 SIG etcd는 널리 사용되는 분산 키-값 저장소이자 쿠버네티스 핵심 컴포넌트인 etcd의 최신 마이너 릴리스 [etcd v3.7.0](https://github.com/etcd-io/etcd/releases/tag/v3.7.0)을 출시합니다. v3.7은 오랫동안 요청되어 온 RangeStream 기능과 여러 성능 개선을 제공하고, 레거시 v2store의 마지막 흔적을 제거하며, 대대적인 protobuf 개편을 완료합니다.

다음에서 etcd v3.7.0을 다운로드할 수 있습니다.

* [소스 코드](https://github.com/etcd-io/etcd/archive/refs/tags/v3.7.0.tar.gz)
* [바이너리](https://github.com/etcd-io/etcd/releases/tag/v3.7.0)
* [공식 컨테이너 이미지](https://gcr.io/etcd-development/etcd)

이번 릴리스에는 etcd의 두 핵심 의존성인 [bbolt v1.5.0](https://github.com/etcd-io/bbolt/releases/tag/v1.5.0)과 [raft v3.7.0](https://github.com/etcd-io/raft/releases/tag/v3.7.0)의 새 버전도 포함됩니다.

etcd 설치 방법은 [설치 문서](https://etcd.io/docs/v3.7/install/)를 참고하십시오. 전체 변경 사항은 [etcd v3.7 변경 로그](https://github.com/etcd-io/etcd/blob/main/CHANGELOG/CHANGELOG-3.7.md)에서 확인할 수 있습니다.

이번 릴리스를 가능하게 해 주신 모든 기여자께 진심으로 감사드립니다!

## 주요 기능

v3.7.0의 가장 중요한 변경 사항은 다음과 같습니다.

* [**RangeStream**](#rangestream) — 전체 응답을 버퍼링하지 않고 큰 결과 집합을 청크 단위로 스트리밍합니다.
* **키만 반환하는 범위 요청, 더 빠르고 안정적인 리스(lease)** 등 여러 [**성능 개선**](#성능-개선).
* etcd는 이제 레거시 v2 store에 대한 오랜 의존성을 제거하고 [v3store에서 완전히 부트스트랩합니다](#v3store에서-부트스트랩).
* 오래된 protobuf 라이브러리를 완전히 지원되는 라이브러리로 교체하는 [**protobuf 전면 개편**](#protobuf-전면-개편)을 완료했습니다.
* etcd v3.7은 [bbolt v1.5.1](#bbolt-v151)과 [raft v3.7.0](#raft-v370)을 포함합니다.

## 기능

### RangeStream

etcd v3.6 및 그 이전에서는 대량의 결과를 반환하는 요청을 처리하는 것이 어려웠습니다. 데이터베이스는 전송 전에 대량의 결과 세트를 버퍼링하여 서버와 클라이언트 모두에서 예측 불가능한 지연과 메모리 사용량을 초래했습니다. [RangeStream RPC](https://github.com/kubernetes/enhancements/tree/master/keps/sig-etcd/5966-etcd-range-stream)는 호출 애플리케이션이 결과 세트를 청크로 받아들여 지연 시간을 줄이고 버퍼링 메모리 사용을 더 예측 가능하게 만듭니다.

RangeStream을 [gRPC 호출에서](https://etcd.io/docs/v3.7/learning/api/#rangestream) 사용하는 방법과 [etcdctl에서](https://etcd.io/docs/v3.7/dev-guide/interacting_v3/#read-keys) 사용하는 방법은 etcd 문서에서 확인할 수 있습니다. 각자의 애플리케이션에서 사용해 보시기 바랍니다.

릴리스가 연계되어 진행됨에 따라, 앞으로 출시될 쿠버네티스 v1.37 사용자는 `EtcdRangeStream` 기능 게이트를 활성화하여 RangeStream 기능을 사용할 수 있습니다. 이처럼 조기에 계획된 도입이 가능한 것은 2023년에 etcd와 쿠버네티스 개발이 통합되었기 때문입니다.

### 성능 개선

v3.7은 쿠버네티스 컨트롤 플레인과 기타 사용 사례 모두에 여러 구체적인 성능 개선을 제공합니다. 쿠버네티스 사용자는 v3.6과 비교해 etcd 멤버의 전체 CPU 사용량이 크게 감소하는 것을 확인할 수 있습니다.

#### 키 전용 범위 최적화

etcd v3.7.0에는 키 전용 범위 최적화가 포함됩니다([#21791: 키 전용 범위 최적화](https://github.com/etcd-io/etcd/pull/21791)). keys_only 범위 요청이나 `etcdctl get --keys-only`를 처리할 때 etcd는 메모리 내 인덱스만 읽습니다. 이전처럼 bbolt에서 직렬화된 값을 모두 불러오지 않고 일치하는 키를 반환합니다. 유일한 예외는 `keys_only` 범위 요청을 값으로 정렬해야 하는 경우(즉, SortTarget이 VALUE로 설정된 경우)이며, 이때는 여전히 bbolt에서 데이터를 불러와야 합니다.

키 이름만 필요한 워크로드에서 불필요한 백엔드 읽기와 메모리 사용을 줄여 대규모 키 전용 범위 요청의 효율을 높입니다.

#### 더 빠르고 안정적인 etcd 리스

v3.7은 리스 만료와 갱신을 개선합니다.

* 과부하 상황에서도 리스가 제때 만료되도록 LeaseRevoke 요청의 우선순위가 높아졌습니다([#20492: 과부하 상황에서의 안정성 개선](https://github.com/etcd-io/etcd/pull/20492)).
* 새로운 FastLeaseKeepAlive 기능은 적용된 인덱스를 기다리는 과정을 건너뛰어 더 빠르게 리스를 갱신할 수 있습니다([#20589: etcdserver의 선형화 가능한 리스 갱신 개선](https://github.com/etcd-io/etcd/pull/20589)).

#### 더 빠른 find() 작업

etcd 3.7은 키에 대한 동시 watch의 find() 작업 속도를 높여 성능을 개선합니다([#19768: 일치하는 왼쪽 끝점에서 오른쪽 끝점을 기준으로 구간 트리 분할](https://github.com/etcd-io/etcd/pull/19768)).

### 기타 기능

#### protobuf 전면 개편

v3.7은 오래된 여러 protobuf 라이브러리를 완전히 지원되는 의존성으로 마이그레이션하고 교체합니다. 여기에는 `github.com/golang/protobuf`와 `github.com/gogo/protobuf`를 완전히 지원되는 `google.golang.org/protobuf`로 교체하는 작업([#14533: golang/protobuf와 gogo/protobuf 정리](https://github.com/etcd-io/etcd/issues/14533))과 grpc-logging을 grpc-middleware v2로 마이그레이션하는 작업([#20420: grpc-logging을 grpc-middleware v2로 마이그레이션](https://github.com/etcd-io/etcd/pull/20420))이 포함됩니다.

이 리팩터링은 보안과 유지보수성을 개선할 뿐 아니라 etcd 컴포넌트의 CPU 사용량도 줄이는 것으로 나타났습니다.

이러한 변경은 공식 바이너리나 컨테이너 이미지로 etcd를 실행하는 사용자에게 직접적인 영향을 주지 않을 것으로 예상되지만, 클라이언트 SDK나 `api/` 또는 `pkg/` 아래의 패키지처럼 etcd Go 모듈에 의존하는 사용자에게는 영향을 줄 수 있습니다. 이런 사용자는 이번 릴리스에 도입된 protobuf와 관련 API 변경으로 인해 코드나 의존성을 업데이트해야 할 수 있습니다. 자세한 내용은 [API 변경 추적 이슈](https://github.com/etcd-io/website/issues/1162)에서 확인할 수 있습니다.

#### Unix 소켓 지원

이제 etcd는 Unix 소켓 엔드포인트를 지원하여([#19760: Unix 소켓 엔드포인트 지원 추가](https://github.com/etcd-io/etcd/pull/19760)) TCP 포트 없이 로컬로 통신할 수 있습니다. 이 기능은 단일 멤버 클러스터로 제한되므로 주로 개발, 테스트, 엣지 디바이스 사용 사례를 대상으로 합니다.

#### v3store에서 부트스트랩

etcd v3.7의 주요 변경 사항 중 하나는 서버가 v3 저장소에서 완전히 부트스트랩함으로써([#20187: v3store에서 etcdserver 부트스트랩](https://github.com/etcd-io/etcd/issues/20187)) 시작 과정에서 레거시 v2 store에 대한 의존성을 제거한 것입니다.

이 이정표는 v3.4부터 v3.7까지 여러 릴리스에 걸친 장기 작업의 결과입니다. 오랜 기술 부채를 해결하고 부트스트랩 워크플로를 크게 단순화하며 향후 etcd 개선을 위한 기반을 마련합니다.

하위 호환성을 유지하기 위해 etcd v3.7은 계속해서 v2 스냅샷을 생성합니다. 이에 따라 `--snapshot-count` 플래그도 v3.7에 유지됩니다. 이것이 레거시 v2 store에 대한 마지막 의존성이며, v2 스냅샷 생성과 `--snapshot-count` 플래그는 모두 v3.8에서 제거됩니다.

#### etcdutl 타임아웃

이제 모든 etcdutl 명령에 타임아웃 커맨드라인 인수가 제공되므로([#20708: 모든 etcdutl 명령에 타임아웃 기능 활성화](https://github.com/etcd-io/etcd/pull/20708)), 오프라인 유틸리티 명령이 잠금을 보유한 상태에서 더 이상 무기한 차단되지 않습니다.

#### 인증 토큰 직접 설정

이제 클라이언트 v3에서 사용자가 JWT를 직접 설정할 수 있어 인증 옵션을 더 유연하게 선택할 수 있습니다([#16803: clientv3에서 JWT 직접 설정 허용](https://github.com/etcd-io/etcd/pull/16803), [#20747: 토큰이 설정된 경우 clientv3의 인증 재시도 비활성화](https://github.com/etcd-io/etcd/pull/20747)).

#### 인증 없이 AuthStatus 조회

클라이언트는 먼저 인증을 시도하지 않고 AuthStatus를 확인할 수 있어 애플리케이션 오버헤드가 줄어듭니다([#20802: etcdserver의 AuthStatus API 권한 검사 제거](https://github.com/etcd-io/etcd/pull/20802)).

#### 새로운 watch 메트릭

v3.7은 watch 경로의 가시성(observability)을 높이기 위한 선택적 watch 전송 루프 메트릭을 추가합니다([#21030: watchstream 전송 루프 계측](https://github.com/etcd-io/etcd/pull/21030)).

* `etcd_debugging_server_watch_send_loop_watch_stream_duration_seconds`
* `etcd_debugging_server_watch_send_loop_watch_stream_duration_per_event_seconds`
* `etcd_debugging_server_watch_send_loop_control_stream_duration_seconds`
* `etcd_debugging_server_watch_send_loop_progress_duration_seconds`

새로운 `etcd_server_request_duration_seconds` 메트릭도 추가되었습니다([#21038: `etcd_server_request_duration_seconds` 메트릭 추가](https://github.com/etcd-io/etcd/pull/21038)).

#### etcdctl 명령 정리

명확성을 높이기 위해 etcdctl 명령을 재구성했으며([#20162: etcdctl 하위 명령 구성](https://github.com/etcd-io/etcd/pull/20162)), 도움말 출력을 간소화하기 위해 전역 커맨드라인 인수를 숨겼습니다([#20493: etcdctl 전역 플래그 숨기기](https://github.com/etcd-io/etcd/pull/20493)).

## 업그레이드

이번 릴리스에는 특히 레거시 v2 컴포넌트 제거와 관련된 호환성을 깨는 변경 사항이 포함되어 있습니다. 노드를 업그레이드하기 전에 [업그레이드 가이드](https://etcd.io/docs/v3.7/upgrades/upgrade_3_7/)를 확인해야 합니다. 모든 마이너 릴리스와 마찬가지로 한 번에 멤버 하나씩 롤링 업그레이드를 수행하고 각 단계 사이에 클러스터 상태를 확인해야 합니다.

### 실험적 플래그 제거

사용 중단(deprecated) 상태인 실험적 플래그가 모두 제거되었습니다([#19959: 사용 중단된 실험적 플래그 정리](https://github.com/etcd-io/etcd/pull/19959)). 이제 etcd 기능은 기존 `--experimental` 접두사 대신 v3.6에서 도입된 쿠버네티스 방식의 기능 게이트 라이프사이클(알파 → 베타 → GA)을 따릅니다. 구성에서 여전히 `--experimental-*` 커맨드라인 인수를 사용한다면 etcd 3.7로 업그레이드하기 전에 해당 기능 게이트나 안정화된 커맨드라인 인수로 마이그레이션해야 합니다.

### 레거시 v2 API 패키지와 코드 정리

v2store에 대한 의존성을 제거하기 위해 다음 컴포넌트가 제거되었습니다.

* [v2 discovery](https://github.com/etcd-io/etcd/pull/20109) 패키지([#20109: v2discovery 제거](https://github.com/etcd-io/etcd/pull/20109))
* [v2 request](https://github.com/etcd-io/etcd/pull/21263) 지원([#21263: v2 Request와 apply_v2.go 제거](https://github.com/etcd-io/etcd/pull/21263))
* [v2 client](https://github.com/etcd-io/etcd/pull/20117) 지원([#20117: client/internal/v2 제거](https://github.com/etcd-io/etcd/pull/20117))

이러한 변경은 특히 v3.6.11 이상으로 아직 업데이트하지 않은 사용자에게 일부 호환성 문제를 일으킬 수 있습니다. 사용자는 작업을 가로막는 문제나 업그레이드 문서 보강이 필요한 사례를 보고해야 합니다.

### 논블로킹 클라이언트 생성

etcd는 더 이상 사용 중단된 `grpc.WithBlock` 다이얼 옵션을 적용하지 않습니다([\#21942: etcd 클라이언트 생성을 논블로킹 방식으로 변경](https://github.com/etcd-io/etcd/pull/21942)). 필요할 때 기존 블로킹 동작을 유지하려면 grpc-go의 [안티패턴 문서](https://github.com/grpc/grpc-go/blob/master/Documentation/anti-patterns.md#especially-bad-using-deprecated-dialoptions)에 있는 지침을 따릅니다.

### 멀티 아키텍처 컨테이너 이미지만 제공

공식 etcd 컨테이너 이미지를 사용하는 경우, v3.7은 **멀티 아키텍처 컨테이너로만** 배포됩니다. 아키텍처 태그가 지정된 이미지는 제공되지 않으므로 이에 맞게 배포를 조정해야 합니다.

### API 변경

모든 etcd 릴리스와 마찬가지로 여러 API 변경 사항이 있습니다. 가능한 한 하위 호환성을 유지하도록 설계되었지만 일부 사용자는 조정이 필요할 수 있습니다. 전체 내용은 [API 문서](https://etcd.io/docs/v3.7/learning/api/) 페이지를 참고하십시오.

## bbolt v1.5.1

etcd v3.7은 bbolt 스토리지 엔진 [v1.5.1](https://github.com/etcd-io/bbolt/blob/main/CHANGELOG/CHANGELOG-1.5.md)에 의존하며 이 버전을 포함합니다. v1.5에는 다음과 같은 여러 기능 및 성능 개선 사항이 포함되어 있습니다.

* [데이터베이스 파일 크기 제한](https://github.com/etcd-io/bbolt/pull/929): 사용자가 파일 크기 제한을 설정하면 bbolt가 이를 적용합니다. bolt 데이터베이스가 이 제한을 초과하면 데이터베이스를 컴팩션하거나 제한을 변경할 때까지 쓰기를 거부합니다.
* [성능을 위해 통계 비활성화](https://github.com/etcd-io/bbolt/pull/977): 사용자는 `NoStatistics`를 설정하여 데이터베이스 통계 뷰어가 획득하는 잠금으로 인한 오버헤드를 줄일 수 있습니다.
* [더 효율적인 해시맵 처리](https://github.com/etcd-io/bbolt/pull/1179): 범위(span)를 더 빠르고 적은 오버헤드로 병합합니다.

## raft v3.7.0

etcd 3.7은 raft 합의 엔진 v3.7.0에 의존하며 이 버전을 포함합니다. v3.7에는 다음과 같은 여러 개선 사항이 포함되어 있습니다.

* [부트스트랩 프로세스 업데이트](https://github.com/etcd-io/raft/pull/370): 이제 v3.7은 부분적으로 초기화된 스냅샷에서 부팅할 수 있어 etcd를 v3store에서 직접 초기화할 수 있습니다.
* [오래된 읽기를 방지하도록 ReadIndex 흐름 개선](https://github.com/etcd-io/raft/pull/397): 읽기 전용 작업의 하트비트 컨텍스트에 고유 식별자를 삽입합니다.

raft v3.7.0에도 etcd와 [동일한 protobuf 라이브러리 업데이트](https://github.com/etcd-io/etcd/issues/14533)와 리팩터링이 포함되어 있습니다.

## 의존성 업데이트

그 밖의 의존성 업데이트에는 CVE 해결을 위한 `golang.org/x/crypto` v0.52.0으로의 업데이트([\#21903: \[release-3.7\] golang.org/x/crypto를 v0.52.0으로 업데이트](https://github.com/etcd-io/etcd/pull/21903)), OpenTelemetry contrib v0.61.0 업데이트([#20017: otelgrpc를 v0.61.0으로 업데이트](https://github.com/etcd-io/etcd/pull/20017)), Go 1.26.4를 사용한 컴파일([\#21891: \[release-3.7\] Go 1.26.4로 업데이트](https://github.com/etcd-io/etcd/pull/21891))이 포함됩니다.

## 기여자

etcd v3.7.0은 커뮤니티 전반에서 백 명이 넘는 기여자가 함께 만든 결과물입니다. 코드 작성과 PR 리뷰, 이슈 등록과 분류, 알파·베타·릴리스 후보 테스트에 참여해 주신 모든 분께 감사드립니다.

### 리드

v3.7 릴리스의 SIG etcd 리드는 [ivanvc](https://github.com/ivanvc), [serathius](https://github.com/serathius), [ahrtr](https://github.com/ahrtr), [fuweid](https://github.com/fuweid), [siyuanfoundation](https://github.com/siyuanfoundation), [jberkus](https://github.com/jberkus)입니다. Ivan이 릴리스 팀을 이끌고 있습니다.

### 그 밖의 기여자

[ah8ad3](https://github.com/ah8ad3), [ajaysundark](https://github.com/ajaysundark), [aladesawe](https://github.com/aladesawe), [amosehiguese](https://github.com/amosehiguese), [ArkaSaha30](https://github.com/ArkaSaha30), [ashikjm](https://github.com/ashikjm), [AwesomePatrol](https://github.com/AwesomePatrol), [dims](https://github.com/dims), [Elbehery](https://github.com/Elbehery), [gangli113](https://github.com/gangli113), [henrybear327](https://github.com/henrybear327), [Jille](https://github.com/Jille), [jmhbnz](https://github.com/jmhbnz), [joshuazh-x](https://github.com/joshuazh-x), [kishen-v](https://github.com/kishen-v), [lavishpal](https://github.com/lavishpal), [liggitt](https://github.com/liggitt), [marcelfranca](https://github.com/marcelfranca), [miancheng7](https://github.com/miancheng7), [mmorel-35](https://github.com/mmorel-35), [MrDXY](https://github.com/MrDXY), [mrueg](https://github.com/mrueg), [purpleidea](https://github.com/purpleidea), [qsyqian](https://github.com/qsyqian), [redwrasse](https://github.com/redwrasse), [ronaldngounou](https://github.com/ronaldngounou), [skitt](https://github.com/skitt), [spzala](https://github.com/spzala), [tcchawla](https://github.com/tcchawla), [tjungblu](https://github.com/tjungblu), [vivekpatani](https://github.com/vivekpatani), [wenjiaswe](https://github.com/wenjiaswe)

### 신규 기여자

이번 주기에 etcd에 처음 기여한 분들을 반갑게 맞이합니다. RangeStream 기능 개발을 주도한 [Jeffrey Ying](https://github.com/jefftree)도 그중 한 분입니다. 신규 기여자도 etcd에 의미 있는 변화를 만들어 낼 수 있습니다. etcd에 기여하려면 [기여자 가이드](https://github.com/etcd-io/etcd/blob/main/CONTRIBUTING.md)를 참고하십시오.

[1911860538](https://github.com/1911860538), [4rivappa](https://github.com/4rivappa), [aaronjzhang](https://github.com/aaronjzhang), [abdurrehman107](https://github.com/abdurrehman107), [ABin-Huang](https://github.com/ABin-Huang), [adeptvin1](https://github.com/adeptvin1), [aditya7880900936](https://github.com/aditya7880900936), [AHBICJ](https://github.com/AHBICJ), [akstron](https://github.com/akstron), [alliasgher](https://github.com/alliasgher), [aman4433](https://github.com/aman4433), [aojea](https://github.com/aojea), [apullo777](https://github.com/apullo777), [AR21SM](https://github.com/AR21SM), [arturmelanchyk](https://github.com/arturmelanchyk), [AshrafAhmed9](https://github.com/AshrafAhmed9), [asttool](https://github.com/asttool), [asutorufa](https://github.com/asutorufa), [BBQing](https://github.com/BBQing), [beforetech](https://github.com/beforetech), [boqishan](https://github.com/boqishan), [caltechustc](https://github.com/caltechustc), [carsontham](https://github.com/carsontham), [christophsj](https://github.com/christophsj), [chuanye-gao](https://github.com/chuanye-gao), [cnuss](https://github.com/cnuss), [cuiweixie](https://github.com/cuiweixie), [dmvolod](https://github.com/dmvolod), [Dogacel](https://github.com/Dogacel), [dongjiang1989](https://github.com/dongjiang1989), [EduardoVega](https://github.com/EduardoVega), [evertrain](https://github.com/evertrain), [eyupcanakman](https://github.com/eyupcanakman), [gaganhr94](https://github.com/gaganhr94), [goingforstudying-ctrl](https://github.com/goingforstudying-ctrl), [greenblade29](https://github.com/greenblade29), [Himanshu-370](https://github.com/Himanshu-370), [HossamSaberX](https://github.com/HossamSaberX), [huajianxiaowanzi](https://github.com/huajianxiaowanzi), [hwdef](https://github.com/hwdef), [ishan-gupta2005](https://github.com/ishan-gupta2005), [ishan16696](https://github.com/ishan16696), [ivangsm](https://github.com/ivangsm), [JasonLove-Coding](https://github.com/JasonLove-Coding), [Jefftree](https://github.com/Jefftree), [jihogh](https://github.com/jihogh), [jonathan-albrecht-ibm](https://github.com/jonathan-albrecht-ibm), [joshjms](https://github.com/joshjms), [kairosci](https://github.com/kairosci), [kei01234kei](https://github.com/kei01234kei), [kjgorman](https://github.com/kjgorman), [kovan](https://github.com/kovan), [kstrifonoff](https://github.com/kstrifonoff), [Kunalbehbud](https://github.com/Kunalbehbud), [letreturn](https://github.com/letreturn), [lorenz](https://github.com/lorenz), [m4l1c1ou5](https://github.com/m4l1c1ou5), [madhav-murali](https://github.com/madhav-murali), [madvimer](https://github.com/madvimer), [majiayu000](https://github.com/majiayu000), [marcus-hodgson-antithesis](https://github.com/marcus-hodgson-antithesis), [mattsains](https://github.com/mattsains), [mcrute](https://github.com/mcrute), [mingl1](https://github.com/mingl1), [MohanadKh03](https://github.com/MohanadKh03), [mstrYoda](https://github.com/mstrYoda), [NAM-MAN](https://github.com/NAM-MAN), [neeraj542](https://github.com/neeraj542), [nicknikolakakis](https://github.com/nicknikolakakis), [nihalmaddala](https://github.com/nihalmaddala), [niuyueyang1996](https://github.com/niuyueyang1996), [notandruu](https://github.com/notandruu), [ntdkhiem](https://github.com/ntdkhiem), [nwnt](https://github.com/nwnt), [olamilekan000](https://github.com/olamilekan000), [pigeio](https://github.com/pigeio), [pjsharath28](https://github.com/pjsharath28), [progmem](https://github.com/progmem), [Qian-Cheng-nju](https://github.com/Qian-Cheng-nju), [quocvibui](https://github.com/quocvibui), [ravisastryk](https://github.com/ravisastryk), [robin-vidal](https://github.com/robin-vidal), [robinkb](https://github.com/robinkb), [rockswe](https://github.com/rockswe), [roman-khimov](https://github.com/roman-khimov), [rsafonseca](https://github.com/rsafonseca), [sahilpatel09](https://github.com/sahilpatel09), [SalehBorhani](https://github.com/SalehBorhani), [SebTardif](https://github.com/SebTardif), [seshachalam-yv](https://github.com/seshachalam-yv), [shashwat010](https://github.com/shashwat010), [shivamgcodes](https://github.com/shivamgcodes), [shuan1026](https://github.com/shuan1026), [silentred](https://github.com/silentred), [sneaky-potato](https://github.com/sneaky-potato), [socketpair](https://github.com/socketpair), [srri](https://github.com/srri), [subrajeet-maharana](https://github.com/subrajeet-maharana), [sxllwx](https://github.com/sxllwx), [tchap](https://github.com/tchap), [tsujiri](https://github.com/tsujiri), [tzfun](https://github.com/tzfun), [upamanyus](https://github.com/upamanyus), [uzairhameed](https://github.com/uzairhameed), [varunu28](https://github.com/varunu28), [vihasmakwana](https://github.com/vihasmakwana), [wendy-ha18](https://github.com/wendy-ha18), [xiaoxiangirl](https://github.com/xiaoxiangirl), [xigang](https://github.com/xigang), [xUser5000](https://github.com/xUser5000), [yagikota](https://github.com/yagikota), [yajianggroup](https://github.com/yajianggroup), [yedou37](https://github.com/yedou37), [Zanda256](https://github.com/Zanda256), [zechariahkasina](https://github.com/zechariahkasina), [zhijun42](https://github.com/zhijun42), [zhoujiaweii](https://github.com/zhoujiaweii)

다음 채널을 통해 피드백을 공유할 수 있습니다.

- [GitHub 이슈](https://github.com/etcd-io/etcd/issues)
- [쿠버네티스 Slack](https://www.kubernetes.dev/docs/comms/slack/#joining-slack)의 [#sig-etcd Slack 채널](https://kubernetes.slack.com/archives/C3HD8ARJ5)
- [etcd-dev 메일링 리스트](https://groups.google.com/g/etcd-dev)
