---
layout: blog
title: "在邊緣上玩轉 seccomp 配置文件"
date: 2023-05-18
slug: seccomp-profiles-edge
---
<!--
layout: blog
title: "Having fun with seccomp profiles on the edge"
date: 2023-05-18
slug: seccomp-profiles-edge
-->

<!--
**Author**: Sascha Grunert
-->
**作者**: Sascha Grunert

**譯者**: [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
The [Security Profiles Operator (SPO)][spo] is a feature-rich
[operator][operator] for Kubernetes to make managing seccomp, SELinux and
AppArmor profiles easier than ever. Recording those profiles from scratch is one
of the key features of this operator, which usually involves the integration
into large CI/CD systems. Being able to test the recording capabilities of the
operator in edge cases is one of the recent development efforts of the SPO and
makes it excitingly easy to play around with seccomp profiles.
-->
[Security Profiles Operator (SPO)][spo] 是一個功能豐富的 Kubernetes [operator][operator]，
相比以往可以簡化 seccomp、SELinux 和 AppArmor 配置文件的管理。
從頭開始記錄這些配置文件是該 Operator 的關鍵特性之一，這通常涉及與大型 CI/CD 系統集成。
在邊緣場景中測試 Operator 的記錄能力是 SPO 的最新開發工作之一，
非常有助於輕鬆玩轉 seccomp 配置文件。

<!--
## Recording seccomp profiles with `spoc record`

The [v0.8.0][spo-latest] release of the Security Profiles Operator shipped a new
command line interface called `spoc`, a little helper tool for recording and
replaying seccomp profiles among various other things that are out of scope of
this blog post.
-->
## 使用 `spoc record` 記錄 seccomp 配置文件

[v0.8.0][spo-latest] 版本的 Security Profiles Operator 附帶一個名爲 `spoc` 的全新命令行接口，
是一個能夠用來記錄和回放 seccomp 配置文件的工具，該工具還有一些其他能力不在這篇博文的討論範圍內。

[spo-latest]: https://github.com/kubernetes-sigs/security-profiles-operator/releases/v0.8.0

<!--
Recording a seccomp profile requires a binary to be executed, which can be a
simple golang application which just calls [`uname(2)`][uname]:
-->
記錄 seccomp 配置文件需要執行一個二進制文件，這個二進制文件可以是一個僅只調用
[`uname(2)`][uname] 的簡單 Golang 應用程序：

```go
package main

import (
	"syscall"
)

func main() {
	utsname := syscall.Utsname{}
	if err := syscall.Uname(&utsname); err != nil {
		panic(err)
	}
}
```

[uname]: https://man7.org/linux/man-pages/man2/uname.2.html

<!--
Building a binary from that code can be done by:
-->
可通過以下命令從代碼構建一個二進制文件：

```console
> go build -o main main.go
> ldd ./main
        not a dynamic executable
```

<!--
Now it's possible to download the latest binary of [`spoc` from
GitHub][spoc-latest] and run the application on Linux with it:
-->
現在可以從 GitHub 下載最新的 [`spoc`][spoc-latest] 二進制文件，
並使用它在 Linux 上運行應用程序：

[spoc-latest]: https://github.com/kubernetes-sigs/security-profiles-operator/releases/download/v0.8.0/spoc.amd64

```console
> sudo ./spoc record ./main
10:08:25.591945 Loading bpf module
10:08:25.591958 Using system btf file
libbpf: loading object 'recorder.bpf.o' from buffer
…
libbpf: prog 'sys_enter': relo #3: patched insn #22 (ALU/ALU64) imm 16 -> 16
10:08:25.610767 Getting bpf program sys_enter
10:08:25.610778 Attaching bpf tracepoint
10:08:25.611574 Getting syscalls map
10:08:25.611582 Getting pid_mntns map
10:08:25.613097 Module successfully loaded
10:08:25.613311 Processing events
10:08:25.613693 Running command with PID: 336007
10:08:25.613835 Received event: pid: 336007, mntns: 4026531841
10:08:25.613951 No container ID found for PID (pid=336007, mntns=4026531841, err=unable to find container ID in cgroup path)
10:08:25.614856 Processing recorded data
10:08:25.614975 Found process mntns 4026531841 in bpf map
10:08:25.615110 Got syscalls: read, close, mmap, rt_sigaction, rt_sigprocmask, madvise, nanosleep, clone, uname, sigaltstack, arch_prctl, gettid, futex, sched_getaffinity, exit_group, openat
10:08:25.615195 Adding base syscalls: access, brk, capget, capset, chdir, chmod, chown, close_range, dup2, dup3, epoll_create1, epoll_ctl, epoll_pwait, execve, faccessat2, fchdir, fchmodat, fchown, fchownat, fcntl, fstat, fstatfs, getdents64, getegid, geteuid, getgid, getpid, getppid, getuid, ioctl, keyctl, lseek, mkdirat, mknodat, mount, mprotect, munmap, newfstatat, openat2, pipe2, pivot_root, prctl, pread64, pselect6, readlink, readlinkat, rt_sigreturn, sched_yield, seccomp, set_robust_list, set_tid_address, setgid, setgroups, sethostname, setns, setresgid, setresuid, setsid, setuid, statfs, statx, symlinkat, tgkill, umask, umount2, unlinkat, unshare, write
10:08:25.616293 Wrote seccomp profile to: /tmp/profile.yaml
10:08:25.616298 Unloading bpf module
```

<!--
I have to execute `spoc` as root because it will internally run an [ebpf][ebpf]
program by reusing the same code parts from the Security Profiles Operator
itself. I can see that the bpf module got loaded successfully and `spoc`
attached the required tracepoint to it. Then it will track the main application
by using its [mount namespace][mntns] and process the recorded syscall data. The
nature of ebpf programs is that they see the whole context of the Kernel, which
means that `spoc` tracks all syscalls of the system, but does not interfere with
their execution.
-->
我必須以 root 用戶身份執行 `spoc`，因爲它將在內部通過複用 Security Profiles Operator
自身的相同代碼，運行一個 [ebpf][ebpf] 程序。
我可以看到 bpf 模塊已成功加載，並且 `spoc` 已將所需的跟蹤點附加到該模塊。
隨後該模塊將使用其[掛載命名空間][mntns]跟蹤主應用程序並處理記錄的系統調用數據。
ebpf 程序的本質是監視整個內核的上下文，這意味着 `spoc` 跟蹤系統的所有系統調用，但不會干涉其執行過程。

[ebpf]: https://ebpf.io
[mntns]: https://man7.org/linux/man-pages/man7/mount_namespaces.7.html

<!--
The logs indicate that `spoc` found the syscalls `read`, `close`,
`mmap` and so on, including `uname`. All other syscalls than `uname` are coming
from the golang runtime and its garbage collection, which already adds overhead
to a basic application like in our demo. I can also see from the log line
`Adding base syscalls: …` that `spoc` adds a bunch of base syscalls to the
resulting profile. Those are used by the OCI runtime (like [runc][runc] or
[crun][crun]) in order to be able to run a container. This means that `spoc`
can be used to record seccomp profiles which then can be containerized directly.
This behavior can be disabled in `spoc` by using the `--no-base-syscalls`/`-n`
or customized via the `--base-syscalls`/`-b` command line flags. This can be
helpful in cases where different OCI runtimes other than crun and runc are used,
or if I just want to record the seccomp profile for the application and stack
it with another [base profile][base].
-->
這些日誌表明 `spoc` 發現了包括 `uname` 在內的 `read`、`close`、`mmap` 等系統調用。
除 `uname` 之外的所有系統調用都來自 Golang 運行時及其垃圾回收，這已經爲我們演示中的簡單應用增加了開銷。
我還可以從日誌行 `Adding base syscalls: …` 中看到 `spoc` 將一堆基本系統調用添加到了生成的配置文件中。
這些系統調用由 OCI 運行時（如 [runc][runc] 或 [crun][crun]）使用以便能夠運行容器。
這意味着 `spoc` 可用於記錄可直接被容器化的 seccomp 配置文件。
這種行爲可以通過在 `spoc` 中使用 `--no-base-syscalls`/`-n` 禁用，或通過
`--base-syscalls`/`-b` 命令行標誌進行自定義。這對於使用除了 crun 和 runc 之外的不同 OCI
運行時或者如果我只想記錄應用的 seccomp 配置文件並將其與另一個[基本配置文件][base]組合時非常有幫助。

[runc]: https://github.com/opencontainers/runc
[crun]: https://github.com/containers/crun
[base]: https://github.com/kubernetes-sigs/security-profiles-operator/blob/35ebdda/installation-usage.md#base-syscalls-for-a-container-runtime

<!--
The resulting profile is now available in `/tmp/profile.yaml`, but the default
location can be changed using the `--output-file value`/`-o` flag:
-->
生成的配置文件現在位於 `/tmp/profile.yaml`，
但可以使用 `--output-file value`/`-o` 標誌更改默認位置：

```console
> cat /tmp/profile.yaml
```

```yaml
apiVersion: security-profiles-operator.x-k8s.io/v1beta1
kind: SeccompProfile
metadata:
  creationTimestamp: null
  name: main
spec:
  architectures:
    - SCMP_ARCH_X86_64
  defaultAction: SCMP_ACT_ERRNO
  syscalls:
    - action: SCMP_ACT_ALLOW
      names:
        - access
        - arch_prctl
        - brk
        - …
        - uname
        - …
status: {}
```

<!--
The seccomp profile Custom Resource Definition (CRD) can be directly used
together with the Security Profiles Operator for managing it within Kubernetes.
`spoc` is also capable of producing raw seccomp profiles (as JSON), by using the
`--type`/`-t` `raw-seccomp` flag:
-->
seccomp 配置文件 CRD 可直接與 Security Profiles Operator 一起使用，統一在 Kubernetes 中進行管理。
`spoc` 還可以通過使用 `--type`/`-t` `raw-seccomp` 標誌生成原始的 seccomp 配置文件（格式爲 JSON）：

```console
> sudo ./spoc record --type raw-seccomp ./main
…
52.628827 Wrote seccomp profile to: /tmp/profile.json
```

```console
> jq . /tmp/profile.json
```

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64"],
  "syscalls": [
    {
      "names": ["access", "…", "write"],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
```

<!--
The utility `spoc record` allows us to record complex seccomp profiles directly
from binary invocations in any Linux system which is capable of running the ebpf
code within the Kernel. But it can do more: How about modifying the seccomp
profile and then testing it by using `spoc run`.
-->
實用程序 `spoc record` 允許我們直接在任何能夠在內核中運行 ebpf 代碼的 Linux
系統上記錄複雜的 seccomp 配置文件。但它還可以做更多事情：
例如修改 seccomp 配置文件並使用 `spoc run` 進行測試。

<!--
## Running seccomp profiles with `spoc run`

`spoc` is also able to run binaries with applied seccomp profiles, making it
easy to test any modification to it. To do that, just run:
-->
## 使用 `spoc run` 運行 seccomp 配置文件

`spoc` 還能夠使用 seccomp 配置文件來運行二進制文件，輕鬆測試對其所做的任何修改。
要執行此操作，只需運行：

```console
> sudo ./spoc run ./main
10:29:58.153263 Reading file /tmp/profile.yaml
10:29:58.153311 Assuming YAML profile
10:29:58.154138 Setting up seccomp
10:29:58.154178 Load seccomp profile
10:29:58.154189 Starting audit log enricher
10:29:58.154224 Enricher reading from file /var/log/audit/audit.log
10:29:58.155356 Running command with PID: 437880
>
```

<!--
It looks like that the application exited successfully, which is anticipated
because I did not modify the previously recorded profile yet. I can also
specify a custom location for the profile by using the `--profile`/`-p` flag,
but this was not necessary because I did not modify the default output location
from the record. `spoc` will automatically determine if it's a raw (JSON) or CRD
(YAML) based seccomp profile and then apply it to the process.
-->
看起來應用程序已成功退出，這是符合預期的，因爲我尚未修改先前記錄的配置文件。
我還可以使用 `--profile`/`-p` 標誌指定配置文件的自定義位置，但這並不是必需的，
因爲我沒有修改默認輸出位置。`spoc` 將自動確定它是基於原始的（JSON）還是基於 CRD 的
（YAML）seccomp 配置文件，然後將其應用於該進程。

<!--
The Security Profiles Operator supports a [log enricher feature][enricher],
which provides additional seccomp related information by parsing the audit logs.
`spoc run` uses the enricher in the same way to provide more data to the end
users when it comes to debugging seccomp profiles.
-->
Security Profiles Operator 支持 [log enricher 特性][enricher]，
通過解析審計日誌提供與 seccomp 相關的額外信息。
`spoc run` 以同樣的方式使用 enricher 向最終用戶提供更多數據以調試 seccomp 配置文件。

[enricher]: https://github.com/kubernetes-sigs/security-profiles-operator/blob/35ebdda/installation-usage.md#using-the-log-enricher

<!--
Now I have to modify the profile to see anything valuable in the output. For
example, I could remove the allowed `uname` syscall:
-->
現在我不得不修改配置文件來查看輸出中有價值的信息。
例如，我可以移除允許的 `uname` 系統調用：

```console
> jq 'del(.syscalls[0].names[] | select(. == "uname"))' /tmp/profile.json > /tmp/no-uname-profile.json
```

<!--
And then try to run it again with the new profile `/tmp/no-uname-profile.json`:
-->
然後嘗試用新的配置文件 `/tmp/no-uname-profile.json` 來運行：

```console
> sudo ./spoc run -p /tmp/no-uname-profile.json ./main
10:39:12.707798 Reading file /tmp/no-uname-profile.json
10:39:12.707892 Setting up seccomp
10:39:12.707920 Load seccomp profile
10:39:12.707982 Starting audit log enricher
10:39:12.707998 Enricher reading from file /var/log/audit/audit.log
10:39:12.709164 Running command with PID: 480512
panic: operation not permitted

goroutine 1 [running]:
main.main()
        /path/to/main.go:10 +0x85
10:39:12.713035 Unable to run: launch runner: wait for command: exit status 2
```

<!--
Alright, that was expected! The applied seccomp profile blocks the `uname`
syscall, which results in an "operation not permitted" error. This error is
pretty generic and does not provide any hint on what got blocked by seccomp.
It is generally extremely difficult to predict how applications behave if single
syscalls are forbidden by seccomp. It could be possible that the application
terminates like in our simple demo, but it could also lead to a strange
misbehavior and the application does not stop at all.
-->
好的，這符合預期！應用的 seccomp 配置文件阻止了 `uname` 系統調用，導致出現
"operation not permitted" 錯誤。此錯誤提示過於寬泛，沒有提供關於 seccomp 阻止了什麼的任何提示。
通常情況下，如果 seccomp 禁止某個系統調用，很難預測應用程序會做出什麼行爲。
可能應用程序像這個簡單演示一樣終止，但也可能導致奇怪的異常行爲使得應用程序根本無法停止。

<!--
If I now change the default seccomp action of the profile from `SCMP_ACT_ERRNO`
to `SCMP_ACT_LOG` like this:
-->
現在，如果我將配置文件的默認 seccomp 操作從 `SCMP_ACT_ERRNO` 更改爲 `SCMP_ACT_LOG`，就像這樣：

```console
> jq '.defaultAction = "SCMP_ACT_LOG"' /tmp/no-uname-profile.json > /tmp/no-uname-profile-log.json
```

<!--
Then the log enricher will give us a hint that the `uname` syscall got blocked
when using `spoc run`:
-->
那麼 log enricher 將提示我們 `uname` 系統調用在使用 `spoc run` 時被阻止：

```console
> sudo ./spoc run -p /tmp/no-uname-profile-log.json ./main
10:48:07.470126 Reading file /tmp/no-uname-profile-log.json
10:48:07.470234 Setting up seccomp
10:48:07.470245 Load seccomp profile
10:48:07.470302 Starting audit log enricher
10:48:07.470339 Enricher reading from file /var/log/audit/audit.log
10:48:07.470889 Running command with PID: 522268
10:48:07.472007 Seccomp: uname (63)
```

<!--
The application will not terminate any more, but seccomp will log the behavior
to `/var/log/audit/audit.log` and `spoc` will parse the data to correlate it
directly to our program. Generating the log messages to the audit subsystem
comes with a large performance overhead and should be handled with care in
production systems. It also comes with a security risk when running untrusted
apps in audit mode in production environments.
-->
應用程序現在不會再終止，但 seccomp 將行爲記錄到 `/var/log/audit/audit.log` 中，
而 `spoc` 會解析數據以將其直接與我們的程序相關聯。將日誌消息生成到審計子系統中會帶來巨大的性能開銷，
在生產系統中應小心處理。當在生產環境中以審計模式運行不受信任的應用時，也會帶來安全風險。

<!--
This demo should give you an impression how to debug seccomp profile issues with
applications, probably by using our shiny new helper tool powered by the
features of the Security Profiles Operator. `spoc` is a flexible and portable
binary suitable for edge cases where resources are limited and even Kubernetes
itself may not be available with its full capabilities.
-->
本文的演示希望讓你瞭解如何使用 Security Profiles Operator
各項特性所賦予的全新輔助工具來調試應用程序的 seccomp 配置文件問題。
`spoc` 是一個靈活且可移植的二進制文件，適用於資源有限的邊緣場景，
甚至是 Kubernetes 本身可能無法提供其全部功能的場景中。

<!--
Thank you for reading this blog post! If you're interested in more, providing
feedback or asking for help, then feel free to get in touch with us directly via
[Slack (#security-profiles-operator)][slack] or the [mailing list][mail].
-->
感謝閱讀這篇博文！如果你有興趣瞭解更多，想提出反饋或尋求幫助，請通過
[Slack (#security-profiles-operator)][slack] 或[郵件列表][mail]直接與我們聯繫。

[slack]: https://kubernetes.slack.com/messages/security-profiles-operator
[mail]: https://groups.google.com/forum/#!forum/kubernetes-dev
