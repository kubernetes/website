---
title: 쿠버네티스 메트릭의 네이티브 히스토그램 지원
linkTitle: 네이티브 히스토그램
content_type: concept
weight: 50
---

<!-- overview -->

{{< feature-state feature_gate_name="NativeHistograms" >}}

쿠버네티스 컴포넌트는 히스토그램 메트릭을
[프로메테우스 네이티브 히스토그램](https://prometheus.io/docs/specs/native_histograms/) 형식으로,
클래식 히스토그램(classic histogram) 형식과 함께 노출할 수 있다. 네이티브 히스토그램은 고정된 경계 대신
지수 버킷(exponential bucket) 경계를 사용하여, 상당한 스토리지 효율, 개선된 쿼리 성능,
분포에 대한 더 세밀한 가시성을 제공한다.

<!-- body -->

## 시작하기 전에

네이티브 히스토그램을 사용하려면 다음이 필요하다.

- **쿠버네티스 v1.36 이상**. v1.36에서는 `NativeHistograms`
  [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/#NativeHistograms)를 수동으로 활성화해야 한다. v1.37부터는 이 기능이 베타이며 기본적으로 활성화된다.
- 네이티브 히스토그램을 스크래핑하고 저장하려면 **프로메테우스 2.40 이상**이 필요하다.
  잡 단위 설정에는 프로메테우스 3.0 이상을 권장한다.

## 네이티브 히스토그램이란?

프로메테우스 클래식 히스토그램은 고정된 버킷 경계를 사용한다(예를 들어
`[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]` 초).
버킷마다 별도의 시계열(`_bucket`, `_count`, `_sum`)이 생성되며, 이는 다음과 같은
한계로 이어질 수 있다.

- 규모가 커지면 **높은 스토리지 비용**이 든다. 히스토그램마다 시계열이 많이 생성되기 때문이다.
- **정확성 문제**가 생긴다. 넓은 버킷 범위 안의 데이터 포인트를 서로 구분할
  수 없기 때문이다. 예를 들어 1µs에 완료된 요청과 4ms에 완료된 요청이 모두
  같은 `le="0.005"` 버킷에 들어간다.

[네이티브 히스토그램](https://prometheus.io/docs/specs/native_histograms/)은
데이터 분포에 맞춰 자동으로 조절되는 지수 버킷 경계를 사용해
이러한 한계를 해결한다. 장점은 다음과 같다.

- 히스토그램 메트릭당 **시계열 개수 약 10분의 1 감소**로, 프로메테우스
  스토리지를 크게 절약하고 쿼리 성능을 개선한다.
- **더 세밀한 해상도**로 성능 저하를 감지하고 정확한 SLO 임계값을
  설정할 수 있다.

## 작동 방식

`NativeHistograms` 기능 게이트를 활성화하면 쿠버네티스 컴포넌트는 히스토그램 메트릭을
클래식 형식과 네이티브 형식으로 동시에 노출한다(이중 노출, dual exposition).
반환되는 형식은 HTTP 요청의 `Accept` 헤더에 따라 달라진다
([프로메테우스 콘텐츠 협상](https://prometheus.io/docs/instrumenting/exposition_formats/#content-negotiation)).
프로메테우스는 스크래핑 설정에 따라 이 헤더를 자동으로 설정한다.
`/metrics` 엔드포인트를 직접 조회할 때만 이를 알고 있으면 된다.

- **텍스트 형식**(Accept: `text/plain`, OpenMetrics 1.0): 클래식 히스토그램 버킷만
  반환한다. 기존 도구 전부와 하위 호환된다.
  ```
  # Classic histogram buckets (always present)
  apiserver_request_duration_seconds_bucket{le="0.005"} 1000
  apiserver_request_duration_seconds_bucket{le="0.01"} 2000
  ...
  apiserver_request_duration_seconds_bucket{le="+Inf"} 10000
  apiserver_request_duration_seconds_count 10000
  apiserver_request_duration_seconds_sum 450.5
  ```

- **Protobuf 형식**(Accept: `application/vnd.google.protobuf`): 클래식 버킷과
  네이티브 히스토그램 데이터를 모두 담는다. 해당 스크래핑 잡의
  [프로메테우스 스크래핑 설정](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)에
  `scrape_native_histograms: true`가 설정되어 있으면 프로메테우스가 이 형식을
  자동으로 요청한다.

이러한 이중 노출 전략은 다음을 보장한다.

- 기존 대시보드와 알림이 변경 없이 계속 동작한다.
- 사용자는 각자의 속도에 맞춰 쿼리를 네이티브 히스토그램으로 마이그레이션할 수 있다.
- 프로메테우스는 수집하도록 설정된 형식이 무엇이든 저장한다.

## 네이티브 히스토그램 활성화

네이티브 히스토그램 활성화는 두 단계로 진행된다. 쿠버네티스 컴포넌트에서 기능 게이트를
활성화하고, 네이티브 히스토그램을 스크래핑하도록 프로메테우스를 설정한다.

### 1단계: 쿠버네티스 기능 게이트가 활성화되어 있는지 확인하기

`NativeHistograms` 기능 게이트는 쿠버네티스 v1.37에서 기본적으로 활성화된다.
쿠버네티스 v1.36을 사용하고 있거나 이 기능을 명시적으로 비활성화했다면,
네이티브 히스토그램을 노출하려는 쿠버네티스 컴포넌트에서 `NativeHistograms`
기능 게이트를 활성화한다.

```bash
--feature-gates=NativeHistograms=true
```

이 기능 게이트는 다음 컴포넌트에 적용된다.
- kube-apiserver
- kube-controller-manager
- kube-scheduler
- kubelet
- kube-proxy

컴포넌트별 메트릭은 서로 독립적이다. 컴포넌트 단위로 기능 게이트를
활성화하거나 비활성화할 수 있다.

### 2단계: 프로메테우스 설정하기

프로메테우스 설정은 사용하는 프로메테우스 버전에 따라 다르다.

| 프로메테우스 버전 | 네이티브 히스토그램 지원 | 설정                                                             | 비고                                                                        |
| ------------------ | ------------------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| < 2.40             | 없음                     | 해당 없음                                                                       | 클래식 히스토그램만 지원한다. 쿠버네티스 기능 게이트를 활성화해도 효과가 없다. |
| 2.40 – 2.x         | 실험적             | `--enable-feature=native-histograms`(전역)                             | 모두 적용하거나 전혀 적용하지 않는다. 잡 단위 제어가 없다.                                          |
| 3.0 – 3.7          | 스테이블                   | 잡 단위 `scrape_native_histograms`와 `always_scrape_classic_histograms` | 잡 단위 설정을 권장한다. 전역 플래그도 계속 지원한다.              |
| 3.8                | 스테이블                   | 잡 단위 설정(세밀한 제어에 필요)                 | 전역 플래그는 모든 잡의 기본값만 바꾼다.                               |
| 3.9+               | 스테이블                   | 잡 단위 `scrape_native_histograms`만                                   | 전역 플래그가 제거되었다. 잡 단위 설정을 사용해야 한다.                         |

프로메테우스 3.x에서는 세밀한 제어를 위해 잡 단위 설정을 사용한다.

```yaml
scrape_configs:
  - job_name: 'kubernetes-apiservers'
    scrape_native_histograms: true            # Ingest native histograms
    always_scrape_classic_histograms: true     # Keep classic format during migration
```

마이그레이션 기간에는 두 옵션을 모두 `true`로 설정한다. 이렇게 하면 기존 대시보드용
클래식 히스토그램을 유지하면서 네이티브 히스토그램을 수집할 수 있다.

{{< note >}}
네이티브 히스토그램에는 Protobuf 노출 형식(exposition format)이 필요하다. 이는 기본적으로 프로메테우스가 자동으로 처리한다. 다만 `scrape_protocols`를 사용자 정의했다면 목록에 `PrometheusProto`가 포함되어 있는지 확인한다.
{{< /note >}}

## 대시보드와 알림 마이그레이션

{{< caution >}}
프로메테우스에 `scrape_native_histograms: true`가 설정되어 있지만
`always_scrape_classic_histograms: false`(기본값)이면 프로메테우스는 네이티브
히스토그램만 수집한다. 클래식 히스토그램 쿼리(예를 들어
`histogram_quantile(..._bucket...)`)를 사용하는 기존 대시보드에는 데이터가 표시되지 않는다.
마이그레이션 중에는 항상 `always_scrape_classic_histograms: true`로 설정한다.
{{< /caution >}}

클래식 쿼리에서 네이티브 히스토그램 쿼리로 마이그레이션할 때는 다음 워크플로를 따른다.

1. **두 형식 모두 활성화**: 프로메테우스 스크래핑 설정에서
   `scrape_native_histograms: true`와 `always_scrape_classic_histograms: true`를 지정한다.

2. **쿼리 마이그레이션**: 대시보드 쿼리와 알림 표현식을 클래식 히스토그램 함수에서
   네이티브 히스토그램에 해당하는 함수로 변경한다.

   클래식 쿼리는 다음과 같다.
   ```promql
   histogram_quantile(0.99, rate(apiserver_request_duration_seconds_bucket[5m]))
   ```

   네이티브 히스토그램 쿼리는 다음과 같다.
   ```promql
   histogram_quantile(0.99, rate(apiserver_request_duration_seconds[5m]))
   ```

3. **스테이징에서 검증**: 프로덕션에 롤아웃하기 전에 모든 대시보드와 알림을
   네이티브 히스토그램 쿼리로 테스트한다.

4. **클래식 스크래핑 비활성화**: 마이그레이션이 끝나고 검증까지 마쳤으면
   `always_scrape_classic_histograms: false`로 설정해 스토리지 오버헤드를 줄인다.

## 네이티브 히스토그램 비활성화

네이티브 히스토그램은 다음 두 가지 방법 중 하나로 언제든 비활성화할 수 있다.

- **프로메테우스 측(가장 빠르고 쿠버네티스 재시작이 필요 없다. 프로메테우스 3.x 전용)**:
  스크래핑 잡마다 `scrape_native_histograms: false`로 설정한다. 프로메테우스는 다음
  스크래핑 간격부터 클래식 형식을 다시 스크래핑한다.

- **쿠버네티스 기능 게이트**: `--feature-gates=NativeHistograms=false`로
  컴포넌트를 재시작한다. 재시작 후에는 클래식 히스토그램 형식만
  노출된다.

네이티브 히스토그램을 비활성화하면 메트릭 엔드포인트는 다시 클래식 히스토그램
형식만 노출한다. 프로메테우스에 있는 과거 네이티브 히스토그램 데이터는 계속
쿼리할 수 있다.

## 문제 해결

- **네이티브 히스토그램을 활성화한 뒤 대시보드에 데이터가 표시되지 않는다**
: 프로메테우스에 `scrape_native_histograms: true`가 설정되어 있지만
  `always_scrape_classic_histograms: false`(기본값)이고, 대시보드가 여전히 클래식
  히스토그램 쿼리(예를 들어 `histogram_quantile(..._bucket...)`)를 사용할 때 발생한다.

  해결: 대시보드를 마이그레이션하는 동안 클래식 형식 수집을 되살리려면
  `always_scrape_classic_histograms: true`로 설정한다.

- **네이티브 히스토그램을 활성화한 뒤 메모리 사용량이 늘어난다**
: 네이티브 히스토그램 버킷 저장 때문에 메모리가 약간 늘어나는 것은 정상이며, 이는
  히스토그램당 최대 160개 버킷으로 제한된다. 예상치 못한 증가가 있는지
  `process_resident_memory_bytes`를 모니터링한다.

  해결: 메모리 압박이 심하면 프로메테우스에서 네이티브 히스토그램 수집을
  비활성화하거나(`scrape_native_histograms: false`) 쿠버네티스 기능 게이트를
  비활성화한다.

- **프로메테우스 로그에 알 수 없는 메트릭 형식에 관한 오류가 기록된다**
: 사용하는 프로메테우스 버전이 너무 오래되어 네이티브 히스토그램을 이해하지 못한다.

  해결: 프로메테우스를 2.40 이상으로 업그레이드하거나 쿠버네티스에서 네이티브 히스토그램을 비활성화한다.

- **네이티브 히스토그램이 노출되고 있는지 확실하지 않다**
: 프로메테우스에서 `kubernetes_feature_enabled{name="NativeHistograms"}`를 조회해
  기능 게이트 상태를 확인한다. 값이 `1`이면 기능이 활성화된 것이다. protobuf 형식으로
  메트릭 엔드포인트를 직접 조회할 수도 있다.
  ```bash
  curl -H "Accept: application/vnd.google.protobuf;proto=io.prometheus.client.MetricFamily;encoding=delimited" \
    https://<component-address>/metrics
  ```
  응답에는 히스토그램 메트릭의 네이티브 히스토그램 인코딩이 포함되어 있어야 한다.

## 참고 자료

- [프로메테우스 네이티브 히스토그램 문서](https://prometheus.io/docs/specs/native_histograms/)에서
  네이티브 히스토그램 형식과 쿼리 함수에 대한 자세한 내용을 확인한다.
- [쿠버네티스 메트릭 레퍼런스](/docs/reference/instrumentation/metrics/)에서
  쿠버네티스 컴포넌트가 노출하는 메트릭 전체 목록을 확인한다.
