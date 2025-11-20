---
layout: blog
title: "Kubernetes 1.24 中的上下文日誌記錄"
date: 2022-05-25
slug: contextual-logging
---
<!--
layout: blog
title: "Contextual Logging in Kubernetes 1.24"
date: 2022-05-25
slug: contextual-logging
canonicalUrl: https://kubernetes.dev/blog/2022/05/25/contextual-logging/
-->

<!--
 **Authors:** Patrick Ohly (Intel)
-->
**作者:** Patrick Ohly (Intel)

<!--
The [Structured Logging Working
Group](https://github.com/kubernetes/community/blob/master/wg-structured-logging/README.md)
has added new capabilities to the logging infrastructure in Kubernetes
1.24. This blog post explains how developers can take advantage of those to
make log output more useful and how they can get involved with improving Kubernetes.
-->
[結構化日誌工作組](https://github.com/kubernetes/community/blob/master/wg-structured-logging/README.md)
在 Kubernetes 1.24 中爲日誌基礎設施添加了新功能。這篇博文解釋了開發者如何利用這些功能使日誌輸出更有用，
以及他們如何參與改進 Kubernetes。

<!--
## Structured logging
-->
## 結構化日誌記錄

<!--
The goal of [structured
logging](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/1602-structured-logging/README.md)
is to replace C-style formatting and the resulting opaque log strings with log
entries that have a well-defined syntax for storing message and parameters
separately, for example as a JSON struct.
-->
[結構化日誌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/1602-structured-logging/README.md)
記錄的目標是用具有明確定義的語法的日誌條目來取代 C 風格的格式化和由此產生的不透明的日誌字符串，用於分別儲存消息和參數，例如，作爲一個 JSON 結構。

<!--
When using the traditional klog text output format for structured log calls,
strings were originally printed with `\n` escape sequences, except when
embedded inside a struct. For structs, log entries could still span multiple
lines, with no clean way to split the log stream into individual entries:
-->
當使用傳統的 klog 文本輸出格式進行結構化日誌調用時，字符串最初使用 `\n` 轉義序列打印，除非嵌入到結構中。
對於結構體，日誌條目仍然可以跨越多行，沒有乾淨的方法將日誌流拆分爲單獨的條目：

```
I1112 14:06:35.783529  328441 structured_logging.go:51] "using InfoS" longData={Name:long Data:Multiple
lines
with quite a bit
of text. internal:0}
I1112 14:06:35.783549  328441 structured_logging.go:52] "using InfoS with\nthe message across multiple lines" int=1 stringData="long: Multiple\nlines\nwith quite a bit\nof text." str="another value"
```

<!--
Now, the `<` and `>` markers along with indentation are used to ensure that splitting at a
klog header at the start of a line is reliable and the resulting output is human-readable:
-->
現在，`<` 和 `>` 標記以及縮進用於確保在行首的 klog 標頭處拆分是可靠的，並且生成的輸出是人類可讀的：

```
I1126 10:31:50.378204  121736 structured_logging.go:59] "using InfoS" longData=<
	{Name:long Data:Multiple
	lines
	with quite a bit
	of text. internal:0}
 >
I1126 10:31:50.378228  121736 structured_logging.go:60] "using InfoS with\nthe message across multiple lines" int=1 stringData=<
	long: Multiple
	lines
	with quite a bit
	of text.
 > str="another value"
```

<!--
Note that the log message itself is printed with quoting. It is meant to be a
fixed string that identifies a log entry, so newlines should be avoided there.
-->
請注意，日誌消息本身帶有引號。它是一個用於標識日誌條目的固定字符串，因此應避免使用換行符。

<!--
Before Kubernetes 1.24, some log calls in kube-scheduler still used `klog.Info`
for multi-line strings to avoid the unreadable output. Now all log calls have
been updated to support structured logging.
-->
在 Kubernetes 1.24 之前，kube-scheduler 中的一些日誌調用仍然使用 `klog.Info` 處理多行字符串，
以避免不可讀的輸出。現在所有日誌調用都已更新以支持結構化日誌記錄。

<!--
## Contextual logging
-->
## 上下文日誌記錄

<!--
[Contextual logging](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/3077-contextual-logging/README.md)
is based on the [go-logr API](https://github.com/go-logr/logr#a-minimal-logging-api-for-go). The key
idea is that libraries are passed a logger instance by their caller and use
that for logging instead of accessing a global logger. The binary decides about
the logging implementation, not the libraries. The go-logr API is designed
around structured logging and supports attaching additional information to a
logger.
-->
[上下文日誌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/3077-contextual-logging/README.md)
基於 [go-logr API](https://github.com/go-logr/logr#a-minimal-logging-api-for-go)。
關鍵的想法是，庫被其調用者傳遞給一個記錄器實例，並使用它來記錄，而不是訪問一個全局記錄器。
二進制檔案決定了日誌的實現，而不是庫。go-logr API 是圍繞着結構化的日誌記錄而設計的，並支持將額外的資訊附加到一個記錄器上。


<!--
This enables additional use cases:
-->
這使得以下用例成爲可能：

<!--
- The caller can attach additional information to a logger:
  - [`WithName`](https://pkg.go.dev/github.com/go-logr/logr#Logger.WithName) adds a prefix
  - [`WithValues`](https://pkg.go.dev/github.com/go-logr/logr#Logger.WithValues) adds key/value pairs
-->
- 調用者可以將附加資訊附加到記錄器：
  - [`WithName`](https://pkg.go.dev/github.com/go-logr/logr#Logger.WithName) 添加前綴
  - [`WithValues`](https://pkg.go.dev/github.com/go-logr/logr#Logger.WithValues) 添加鍵/值對
  
  <!--
  When passing this extended logger into a function and a function uses it
  instead of the global logger, the additional information is
  then included in all log entries, without having to modify the code that
  generates the log entries. This is useful in highly parallel applications
  where it can become hard to identify all log entries for a certain operation
  because the output from different operations gets interleaved.
  -->
  當將此擴展記錄器傳遞給函數並且函數使用它而不是全局記錄器時，附加資訊隨後將包含在所有日誌條目中，而無需修改生成日誌條目的代碼。
  這在高度並行的應用程式中很有用，在這些應用程式中，由於不同操作的輸出會交錯，因此很難識別某個操作的所有日誌條目。

<!--
- When running unit tests, log output can be associated with the current test.
  Then when a test fails, only the log output of the failed test gets shown
  by `go test`. That output can also be more verbose by default because it
  will not get shown for successful tests. Tests can be run in parallel
  without interleaving their output.
-->
- 運行單元測試時，可以將日誌輸出與當前測試關聯起來。當測試失敗時，`go test` 只顯示失敗測試的日誌輸出。
預設情況下，該輸出也可以更詳細，因爲它不會顯示成功的測試。這些測試可以在不交錯輸出的情況下並行運行。

<!--
One of the design decisions for contextual logging was to allow attaching a
logger as value to a `context.Context`. Since the logger encapsulates all
aspects of the intended logging for the call, it is *part* of the context and
not just *using* it. A practical advantage is that many APIs already have a
`ctx` parameter or adding one has additional advantages, like being able to get
rid of `context.TODO()` calls inside the functions.
-->
上下文日誌記錄的設計決策之一是允許將記錄器作爲值附加到 `context.Context`。
由於記錄器封裝了調用的預期記錄的所有方面，它是上下文的**部分**，而不僅僅是**使用**它。 
一個實際的優勢是許多 API 已經有一個 `ctx` 參數，或者添加一個具有其他優勢，例如能夠擺脫函數內部的 `context.TODO()` 調用。

<!--
Another decision was to not break compatibility with klog v2:
-->
另一個決定是不破壞與 klog v2 的兼容性：

<!--
- Libraries that use the traditional klog logging calls in a binary that has
  set up contextual logging will work and log through the logging backend
  chosen by the binary. However, such log output will not include the
  additional information and will not work well in unit tests, so libraries
  should be modified to support contextual logging. The [migration guide](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/migration-to-structured-logging.md)
  for structured logging has been extended to also cover contextual logging.
-->
- 在已設置上下文日誌記錄的二進制檔案中使用傳統 klog 日誌記錄調用的庫將通過二進制檔案選擇的日誌記錄後端工作和記錄。
  但是，這樣的日誌輸出不會包含額外的資訊，並且在單元測試中不能很好地工作，因此應該修改庫以支持上下文日誌記錄。 
  結構化日誌記錄的[遷移指南](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/migration-to-structured-logging.md)
  已擴展爲也涵蓋上下文日誌記錄。

<!--
- When a library supports contextual logging and retrieves a logger from its
  context, it will still work in a binary that does not initialize contextual
  logging because it will get a logger that logs through klog.
-->
- 當一個庫支持上下文日誌並從其上下文中檢索一個記錄器時，它仍將在不初始化上下文日誌的二進制檔案中工作，
  因爲它將獲得一個通過 klog 記錄的記錄器。

<!--
In Kubernetes 1.24, contextual logging is a new alpha feature with
`ContextualLogging` as feature gate. When disabled (the default), the new klog
API calls for contextual logging (see below) become no-ops to avoid performance
or functional regressions.
-->
在 Kubernetes 1.24 中，上下文日誌是一個新的 Alpha 特性，以 `ContextualLogging` 作爲特性門控。
禁用時（預設），用於上下文日誌記錄的新 klog API 調用（見下文）變爲無操作，以避免性能或功能迴歸。

<!--
No Kubernetes component has been converted yet. An [example program](https://github.com/kubernetes/kubernetes/blob/v1.24.0-beta.0/staging/src/k8s.io/component-base/logs/example/cmd/logger.go)
in the Kubernetes repository demonstrates how to enable contextual logging in a
binary and how the output depends on the binary's parameters:
-->
尚未轉換任何 Kubernetes 組件。 Kubernetes 儲存庫中的[示例程式](https://github.com/kubernetes/kubernetes/blob/v1.24.0-beta.0/staging/src/k8s.io/component-base/logs/example/cmd/logger.go)
演示瞭如何在一個二進制檔案中啓用上下文日誌記錄，以及輸出如何取決於該二進制檔案的參數：

```console
$ cd $GOPATH/src/k8s.io/kubernetes/staging/src/k8s.io/component-base/logs/example/cmd/
$ go run . --help
...
      --feature-gates mapStringBool  A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                     AllAlpha=true|false (ALPHA - default=false)
                                     AllBeta=true|false (BETA - default=false)
                                     ContextualLogging=true|false (ALPHA - default=false)
$ go run . --feature-gates ContextualLogging=true
...
I0404 18:00:02.916429  451895 logger.go:94] "example/myname: runtime" foo="bar" duration="1m0s"
I0404 18:00:02.916447  451895 logger.go:95] "example: another runtime" foo="bar" duration="1m0s"
```

<!--
The `example` prefix and `foo="bar"` were added by the caller of the function
which logs the `runtime` message and `duration="1m0s"` value.
-->
`example` 前綴和 `foo="bar"` 是由記錄 `runtime` 消息和 `duration="1m0s"` 值的函數的調用者添加的。

<!--
The sample code for klog includes an
[example](https://github.com/kubernetes/klog/blob/v2.60.1/ktesting/example/example_test.go)
for a unit test with per-test output.
-->
針對 klog 的示例代碼包括一個單元測試[示例](https://github.com/kubernetes/klog/blob/v2.60.1/ktesting/example/example_test.go)
以及每個測試的輸出。
<!--
## klog enhancements

### Contextual logging API

The following calls manage the lookup of a logger:
-->
## klog 增強功能

### 上下文日誌 API

以下調用管理記錄器的查找：

<!--
[`FromContext`](https://pkg.go.dev/k8s.io/klog/v2#FromContext)
: from a `context` parameter, with fallback to the global logger
-->
[`FromContext`](https://pkg.go.dev/k8s.io/klog/v2#FromContext)
：來自 `context` 參數，回退到全局記錄器

<!--
[`Background`](https://pkg.go.dev/k8s.io/klog/v2#Background)
: the global fallback, with no intention to support contextual logging

[`TODO`](https://pkg.go.dev/k8s.io/klog/v2#TODO)
: the global fallback, but only as a temporary solution until the function gets extended to accept
  a logger through its parameters
-->
[`Background`](https://pkg.go.dev/k8s.io/klog/v2#Background)
：全局後備，無意支持上下文日誌記錄

[`TODO`](https://pkg.go.dev/k8s.io/klog/v2#TODO)
：全局回退，但僅作爲一個臨時解決方案，直到該函數得到擴展能夠通過其參數接受一個記錄器

<!--
[`SetLoggerWithOptions`](https://pkg.go.dev/k8s.io/klog/v2#SetLoggerWithOptions)
: changes the fallback logger; when called with [`ContextualLogger(true)`](https://pkg.go.dev/k8s.io/klog/v2#ContextualLogger),
  the logger is ready to be called directly, in which case logging will be done
  without going through klog
-->
[`SetLoggerWithOptions`](https://pkg.go.dev/k8s.io/klog/v2#SetLoggerWithOptions)
：更改後備記錄器；當使用[`ContextualLogger(true)`](https://pkg.go.dev/k8s.io/klog/v2#ContextualLogger) 調用時,
記錄器已準備好被直接調用，在這種情況下，記錄將無需執行通過 klog

<!--
To support the feature gate mechanism in Kubernetes, klog has wrapper calls for
the corresponding go-logr calls and a global boolean controlling their behavior:
-->
爲了支持 Kubernetes 中的特性門控機制，klog 對相應的 go-logr 調用進行了包裝調用，並使用了一個全局布爾值來控制它們的行爲：

- [`LoggerWithName`](https://pkg.go.dev/k8s.io/klog/v2#LoggerWithName)
- [`LoggerWithValues`](https://pkg.go.dev/k8s.io/klog/v2#LoggerWithValues)
- [`NewContext`](https://pkg.go.dev/k8s.io/klog/v2#NewContext)
- [`EnableContextualLogging`](https://pkg.go.dev/k8s.io/klog/v2#EnableContextualLogging)

<!--
Usage of those functions in Kubernetes code is enforced with a linter
check. The klog default for contextual logging is to enable the functionality
because it is considered stable in klog. It is only in Kubernetes binaries
where that default gets overridden and (in some binaries) controlled via the
`--feature-gate` parameter.
-->
在 Kubernetes 代碼中使用這些函數是通過 linter 檢查強制執行的。 
上下文日誌的 klog 預設是啓用該功能，因爲它在 klog 中被認爲是穩定的。
只有在 Kubernetes 二進制檔案中，該預設值纔會被覆蓋，並且（在某些二進制檔案中）通過 `--feature-gate` 參數進行控制。

<!--
### ktesting logger

The new [ktesting](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/ktesting) package
implements logging through `testing.T` using klog's text output format. It has
a [single API call](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/ktesting#NewTestContext) for
instrumenting a test case and [support for command line flags](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/ktesting/init).
-->
### ktesting 記錄器

新的 [ktesting](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/ktesting)
包使用 klog 的文本輸出格式通過 `testing.T` 實現日誌記錄。它有一個 [single API call](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/ktesting#NewTestContext)
用於檢測測試用例和[支持命令列標誌](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/ktesting/init)。

<!--
### klogr

[`klog/klogr`](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/klogr) continues to be
supported and it's default behavior is unchanged: it formats structured log
entries using its own, custom format and prints the result via klog.
-->
### klogr

[`klog/klogr`](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/klogr) 繼續受支持，預設行爲不變：
它使用其格式化結構化日誌條目擁有自己的自定義格式並通過 klog 打印結果。

<!--
However, this usage is discouraged because that format is neither
machine-readable (in contrast to real JSON output as produced by zapr, the
go-logr implementation used by Kubernetes) nor human-friendly (in contrast to
the klog text format).
-->
但是，不鼓勵這種用法，因爲這種格式既不是機器可讀的（與 zapr 生成的真實 JSON 輸出相比，Kubernetes 使用的 go-logr 實現）也不是人類友好的（與 klog 文本格式相比）。

<!--
Instead, a klogr instance should be created with
[`WithFormat(FormatKlog)`](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/klogr#WithFormat)
which chooses the klog text format. A simpler construction method with the same
result is the new
[`klog.NewKlogr`](https://pkg.go.dev/k8s.io/klog/v2#NewKlogr). That is the
logger that klog returns as fallback when nothing else is configured.
-->
相反，應該使用選擇 klog 文本格式的 [`WithFormat(FormatKlog)`](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/klogr#WithFormat)
創建一個 klogr 實例。 一個更簡單但結果相同的構造方法是新的 [`klog.NewKlogr`](https://pkg.go.dev/k8s.io/klog/v2#NewKlogr)。 
這是 klog 在未設定任何其他內容時作爲後備返回的記錄器。


<!--
### Reusable output test
-->
### 可重用輸出測試

<!--
A lot of go-logr implementations have very similar unit tests where they check
the result of certain log calls. If a developer didn't know about certain
caveats like for example a `String` function that panics when called, then it
is likely that both the handling of such caveats and the unit test are missing.
-->
許多 go-logr 實現都有非常相似的單元測試，它們檢查某些日誌調用的結果。
如果開發人員不知道某些警告，例如調用時會出現恐慌的 `String` 函數，那麼很可能缺少對此類警告的處理和單元測試。

<!--
[`klog.test`](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/test) is a reusable set
of test cases that can be applied to a go-logr implementation.
-->
[`klog.test`](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/test) 是一組可重用的測試用例，可應用於 go-logr 實現。

<!--
### Output flushing

klog used to start a goroutine unconditionally during `init` which flushed
buffered data at a hard-coded interval. Now that goroutine is only started on
demand (i.e. when writing to files with buffering) and can be controlled with
[`StopFlushDaemon`](https://pkg.go.dev/k8s.io/klog/v2#StopFlushDaemon) and
[`StartFlushDaemon`](https://pkg.go.dev/k8s.io/klog/v2#StartFlushDaemon).
-->
### 輸出刷新

klog 用於在 `init` 期間無條件地啓動一個 goroutine，它以硬編碼的時間間隔刷新緩衝資料。
現在 goroutine 僅按需啓動（即當寫入具有緩衝的檔案時）並且可以使用 [`StopFlushDaemon`](https://pkg.go.dev/k8s.io/klog/v2#StopFlushDaemon) 
和 [`StartFlushDaemon`](https://pkg.go.dev/k8s.io/klog/v2#StartFlushDaemon)。

<!--
When a go-logr implementation buffers data, flushing that data can be
integrated into [`klog.Flush`](https://pkg.go.dev/k8s.io/klog/v2#Flush) by
registering the logger with the
[`FlushLogger`](https://pkg.go.dev/k8s.io/klog/v2#FlushLogger) option.
-->
當 go-logr 實現緩衝資料時，可以通過使用 [`FlushLogger`](https://pkg.go.dev/k8s.io/klog/v2#FlushLogger) 
選項註冊記錄器來將刷新該資料集成到 [`klog.Flush`](https://pkg.go.dev/k8s.io/klog/v2#Flush) 中。

<!--
### Various other changes

For a description of all other enhancements see in the [release notes](https://github.com/kubernetes/klog/releases).
-->
### 其他各種變化

有關所有其他增強功能的描述，請參見 [發行說明](https://github.com/kubernetes/klog/releases)。

<!--
## logcheck
-->
## 日誌檢查

<!--
Originally designed as a linter for structured log calls, the
 [`logcheck`](https://github.com/kubernetes/klog/tree/788efcdee1e9be0bfbe5b076343d447314f2377e/hack/tools/logcheck)
tool has been enhanced to support also contextual logging and traditional klog
log calls. These enhanced checks already found bugs in Kubernetes, like calling
`klog.Info` instead of `klog.Infof` with a format string and parameters.
-->
最初設計爲結構化日誌調用的 linter，[`logcheck`] 工具已得到增強，還支持上下文日誌記錄和傳統的 klog 日誌調用。 
這些增強檢查已經在 Kubernetes 中發現了錯誤，例如使用格式字符串和參數調用 `klog.Info` 而不是 `klog.Infof`。

<!--
It can be included as a plugin in a `golangci-lint` invocation, which is how
[Kubernetes uses it now](https://github.com/kubernetes/kubernetes/commit/17e3c555c5115f8c9176bae10ba45baa04d23a7b),
or get invoked stand-alone.
-->
它可以作爲插件包含在 `golangci-lint` 調用中，這就是 
[Kubernetes 現在使用它的方式](https://github.com/kubernetes/kubernetes/commit/17e3c555c5115f8c9176bae10ba45baa04d23a7b)，或者單獨調用。

<!--
We are in the process of [moving the tool](https://github.com/kubernetes/klog/issues/312) into a new repository because it isn't
really related to klog and its releases should be tracked and tagged properly.
-->
我們正在 [移動工具](https://github.com/kubernetes/klog/issues/312)
到一個新的儲存庫中，因爲它與 klog 沒有真正的關係，並且應該正確跟蹤和標記它的發佈。

<!--
## Next steps

The [Structured Logging WG](https://github.com/kubernetes/community/tree/master/wg-structured-logging)
is always looking for new contributors. The migration
away from C-style logging is now going to target structured, contextual logging
in one step to reduce the overall code churn and number of PRs. Changing log
calls is good first contribution to Kubernetes and an opportunity to get to
know code in various different areas.
-->
## 下一步

[Structured Logging WG](https://github.com/kubernetes/community/tree/master/wg-structured-logging)
一直在尋找新的貢獻者。 從 C 風格的日誌記錄遷移現在將一步一步地針對結構化的上下文日誌記錄，
以減少整體代碼流失和 PR 數量。 更改日誌調用是對 Kubernetes 的良好貢獻，也是瞭解各個不同領域代碼的機會。