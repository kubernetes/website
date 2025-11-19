---
layout: blog
title: "Kubernetes 的容器檢查點分析"
date: 2023-03-10
slug: forensic-container-analysis
---
<!--
layout: blog
title: "Forensic container analysis"
date: 2023-03-10
slug: forensic-container-analysis
-->

**作者：**[Adrian Reber](https://github.com/adrianreber) (Red Hat)
<!--
**Authors:** Adrian Reber (Red Hat)
-->

**譯者：**[Paco Xu](https://github.com/pacoxu) (DaoCloud)

<!-- 
In my previous article, [Forensic container checkpointing in
Kubernetes][forensic-blog], I introduced checkpointing in Kubernetes
and how it has to be setup and how it can be used. The name of the
feature is Forensic container checkpointing, but I did not go into
any details how to do the actual analysis of the checkpoint created by
Kubernetes. In this article I want to provide details how the
checkpoint can be analyzed.
-->
我之前在 [Kubernetes 中的取證容器檢查點][forensic-blog] 一文中，介紹了檢查點以及如何創建和使用它。
該特性的名稱是取證容器檢查點，但我沒有詳細介紹如何對 Kubernetes 創建的檢查點進行實際分析。
在本文中，我想提供如何分析檢查點的詳細信息。

<!-- 
Checkpointing is still an alpha feature in Kubernetes and this article
wants to provide a preview how the feature might work in the future.
-->
檢查點仍然是 Kubernetes 中的一個 Alpha 特性，本文將展望該特性未來可能的工作方式。

<!-- 
## Preparation
-->
## 準備

<!-- 
Details about how to configure Kubernetes and the underlying CRI implementation
to enable checkpointing support can be found in my [Forensic container
checkpointing in Kubernetes][forensic-blog] article.

As an example I prepared a container image (`quay.io/adrianreber/counter:blog`)
which I want to checkpoint and then analyze in this article. This container allows
me to create files in the container and also store information in memory which
I later want to find in the checkpoint.
-->
有關如何設定 Kubernetes 和底層 CRI 實現以啓用檢查點支持的詳細信息，
請參閱 [Kubernetes 中的取證容器檢查點][forensic-blog]一文。

作爲示例，我準備了一個容器映像檔（`quay.io/adrianreber/counter:blog`），我想對其設定檢查點，
然後在本文中進行分析。這個容器允許我在容器中創建文件，並將信息存儲在內存中，稍後我想在檢查點中找到這些信息。

<!-- 
To run that container I need a pod, and for this example I am using the following Pod manifest:
-->
要運行該容器，我需要一個 Pod，在本例中我使用以下 Pod 清單：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: counters
spec:
  containers:
  - name: counter
    image: quay.io/adrianreber/counter:blog
```

<!-- 
This results in a container called `counter` running in a pod called `counters`.

Once the container is running I am performing following actions with that
container:
-->
這會導致一個名爲 `counter` 的容器在名爲 `counters` 的 Pod 中運行。

容器運行後，我將對該容器執行以下操作：

```console
$ kubectl get pod counters --template '{{.status.podIP}}'
10.88.0.25
$ curl 10.88.0.25:8088/create?test-file
$ curl 10.88.0.25:8088/secret?RANDOM_1432_KEY
$ curl 10.88.0.25:8088
```

<!-- 
The first access creates a file called `test-file` with the content `test-file`
in the container and the second access stores my secret information
(`RANDOM_1432_KEY`) somewhere in the container's memory. The last access just
adds an additional line to the internal log file.

The last step before I can analyze the checkpoint it to tell Kubernetes to create
the checkpoint. As described in the previous article this requires access to the
*kubelet* only `checkpoint` API endpoint.

For a container named *counter* in a pod named *counters* in a namespace named
*default* the *kubelet* API endpoint is reachable at:
-->
1. 第一次訪問時在容器中創建一個名爲 `test-file` 的文件，其內容爲 `test-file`；
2. 第二次訪問時將我的 Secret 信息（`RANDOM_1432_KEY`）存儲在容器內存中的某處；
3. 最後一次訪問時在內部日誌文件中添加了一行。

在分析檢查點之前的最後一步是告訴 Kubernetes 創建檢查點。
如上一篇文章所述，這需要訪問 **kubelet** 唯一的 `checkpoint` API 端點。

對於 **default** 命名空間中 **counters** Pod 中名爲 **counter** 的容器，
可通過以下方式訪問 **kubelet** API 端點：

<!-- 
```shell
# run this on the node where that Pod is executing
curl -X POST "https://localhost:10250/checkpoint/default/counters/counter"
```
-->
```shell
# 在運行 Pod 的節點上運行這條命令
curl -X POST "https://localhost:10250/checkpoint/default/counters/counter"
```

<!-- 
For completeness the following `curl` command-line options are necessary to
have `curl` accept the *kubelet*'s self signed certificate and authorize the
use of the *kubelet* `checkpoint` API:
-->
爲了完整起見，以下 `curl` 命令列選項對於讓 `curl` 接受 **kubelet** 的自簽名證書並授權使用
**kubelet** 檢查點 API 是必要的：

```shell
--insecure --cert /var/run/kubernetes/client-admin.crt --key /var/run/kubernetes/client-admin.key
```

<!-- 
Once the checkpointing has finished the checkpoint should be available at
`/var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar`
-->
檢查點操作完成後，檢查點應該位於 `/var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar`

<!-- 
In the following steps of this article I will use the name `checkpoint.tar`
when analyzing the checkpoint archive.
-->
在本文的以下步驟中，我將在分析檢查點歸檔時使用名稱 `checkpoint.tar`。

<!-- 
## Checkpoint archive analysis using `checkpointctl`
-->
## 使用 `checkpointctl` 進行檢查點歸檔分析

<!-- 
To get some initial information about the checkpointed container I am using the
tool [checkpointctl][checkpointctl] like this:
-->
我使用工具 [checkpointctl][checkpointctl] 獲取有關檢查點容器的一些初始信息，如下所示：

```console
$ checkpointctl show checkpoint.tar --print-stats
+-----------+----------------------------------+--------------+---------+---------------------+--------+------------+------------+-------------------+
| CONTAINER |              IMAGE               |      ID      | RUNTIME |       CREATED       | ENGINE |     IP     | CHKPT SIZE | ROOT FS DIFF SIZE |
+-----------+----------------------------------+--------------+---------+---------------------+--------+------------+------------+-------------------+
| counter   | quay.io/adrianreber/counter:blog | 059a219a22e5 | runc    | 2023-03-02T06:06:49 | CRI-O  | 10.88.0.23 | 8.6 MiB    | 3.0 KiB           |
+-----------+----------------------------------+--------------+---------+---------------------+--------+------------+------------+-------------------+
CRIU dump statistics
+---------------+-------------+--------------+---------------+---------------+---------------+
| FREEZING TIME | FROZEN TIME | MEMDUMP TIME | MEMWRITE TIME | PAGES SCANNED | PAGES WRITTEN |
+---------------+-------------+--------------+---------------+---------------+---------------+
| 100809 us     | 119627 us   | 11602 us     | 7379 us       |          7800 |          2198 |
+---------------+-------------+--------------+---------------+---------------+---------------+
```

<!-- 
This gives me already some information about the checkpoint in that checkpoint
archive.  I can see the name of the container, information about the container
runtime and container engine.  It also lists the size of the checkpoint (`CHKPT
SIZE`). This is mainly the size of the memory pages included in the checkpoint,
but there is also information about the size of all changed files in the
container (`ROOT FS DIFF SIZE`).
-->
這展示了有關該檢查點歸檔中與檢查點有關的一些信息。我們可以看到容器的名稱、有關容器運行時和容器引擎的信息。
它還列出了檢查點的大小（`CHKPT SIZE`）。
這主要是檢查點中包含的內存頁的大小，同時也包含有關容器中所有已更改文件的大小信息（`ROOT FS DIFF SIZE`）。

<!-- 
The additional parameter `--print-stats` decodes information in the checkpoint
archive and displays them in the second table (*CRIU dump statistics*). This
information is collected during checkpoint creation and gives an overview how much
time CRIU needed to checkpoint the processes in the container and how many
memory pages were analyzed and written during checkpoint creation.
-->
使用附加參數 `--print-stats` 可以解碼檢查點歸檔中的信息並將其顯示在第二個表中（**CRIU 轉儲統計信息**）。
此信息是在檢查點創建期間收集的，並概述了 CRIU 對容器中的進程生成檢查點所需的時間以及在檢查點創建期間分析和寫入了多少內存頁。

<!-- 
## Digging deeper
-->
## 深入挖掘

<!-- 
With the help of `checkpointctl` I am able to get some high level information
about the checkpoint archive. To be able to analyze the checkpoint archive
further I have to extract it. The checkpoint archive is a *tar* archive and can
be extracted with the help of `tar xf checkpoint.tar`.

Extracting the checkpoint archive will result in following files and directories:
-->
藉助 `checkpointctl`，我可以獲得有關檢查點歸檔的一些高級信息。爲了能夠進一步分析檢查點歸檔，
我必須將其提取。檢查點歸檔是 **tar** 歸檔文件，可以藉助 `tar xf checkpoint.tar` 進行解壓。

展開檢查點存檔時，將創建以下文件和目錄：

<!--
* `bind.mounts` - this file contains information about bind mounts and is needed
  during restore to mount all external files and directories at the right location
* `checkpoint/` - this directory contains the actual checkpoint as created by
  CRIU
* `config.dump` and `spec.dump` - these files contain metadata about the container
  which is needed during restore
* `dump.log` - this file contains the debug output of CRIU created during
  checkpointing
* `stats-dump` - this file contains the data which is used by `checkpointctl`
  to display dump statistics (`--print-stats`)
* `rootfs-diff.tar` - this file contains all changed files on the container's
  file-system
-->
* `bind.mounts` - 該文件包含有關綁定掛載的信息，並且需要在恢復期間將所有外部文件和目錄掛載到正確的位置
* `checkpoint/` - 該目錄包含 CRIU 創建的實際檢查點
* `config.dump` 和 `spec.dump` - 這些文件包含恢復期間所需的有關容器的元數據
* `dump.log` - 該文件包含在檢查點期間創建的 CRIU 的調試輸出
* `stats-dump` - 此文件包含 `checkpointctl` 用於通過 `--print-stats` 顯示轉儲統計信息的數據
* `rootfs-diff.tar` - 該文件包含容器文件系統上所有已更改的文件

<!-- 
### File-system changes - `rootfs-diff.tar`
-->
### 更改文件系統 - `rootfs-diff.tar`

<!-- 
The first step to analyze the container's checkpoint further is to look at
the files that have changed in my container. This can be done by looking at the
file `rootfs-diff.tar`:
-->
進一步分析容器檢查點的第一步是查看容器內已更改的文件。這可以通過查看 `rootfs-diff.tar` 文件來完成。

```console
$ tar xvf rootfs-diff.tar
home/counter/logfile
home/counter/test-file
```

<!-- 
Now the files that changed in the container can be studied:
-->
現在你可以檢查容器內已更改的文件。

```console
$ cat home/counter/logfile
10.88.0.1 - - [02/Mar/2023 06:07:29] "GET /create?test-file HTTP/1.1" 200 -
10.88.0.1 - - [02/Mar/2023 06:07:40] "GET /secret?RANDOM_1432_KEY HTTP/1.1" 200 -
10.88.0.1 - - [02/Mar/2023 06:07:43] "GET / HTTP/1.1" 200 -
$ cat home/counter/test-file
test-file 
```

<!-- 
Compared to the container image (`quay.io/adrianreber/counter:blog`) this
container is based on, I can see that the file `logfile` contains information
about all access to the service the container provides and the file `test-file`
was created just as expected.

With the help of `rootfs-diff.tar` it is possible to inspect all files that
were created or changed compared to the base image of the container.
-->
與該容器所基於的容器映像檔（`quay.io/adrianreber/counter:blog`）相比，
我可以看到文件 `logfile` 包含了訪問該容器所提供服務相關的所有信息，
並且文件 `test-file` 如預期一樣被創建了。

在 `rootfs-diff.tar` 的幫助下，可以根據容器的基本映像檔檢查所有創建或修改的文件。

<!-- 
### Analyzing the checkpointed processes - `checkpoint/`
-->
### 分析檢查點進程 - `checkpoint/`

<!-- 
The directory `checkpoint/` contains data created by CRIU while checkpointing
the processes in the container. The content in the directory `checkpoint/`
consists of different [image files][image-files] which can be analyzed with the
help of the tool [CRIT][crit] which is distributed as part of CRIU.

First lets get an overview of the processes inside of the container:
-->
目錄 `checkpoint/` 包含 CRIU 在容器內對進程進行檢查點時創建的數據。
目錄 `checkpoint/` 的內容由各種[映像檔文件][image-files] 組成，可以使用作爲 CRIU
一部分分發的 [CRIT][crit] 工具進行分析。

首先，我們先概覽瞭解一下容器內的進程。

```console
$ crit show checkpoint/pstree.img | jq .entries[].pid
1
7
8
```

<!-- 
This output means that I have three processes inside of the container's PID
namespace with the PIDs: 1, 7, 8

This is only the view from the inside of the container's PID namespace. During
restore exactly these PIDs will be recreated. From the outside of the
container's PID namespace the PIDs will change after restore.

The next step is to get some additional information about these three processes:
-->
此輸出意味着容器的 PID 命名空間內有 3 個進程（PID 爲 1、7 和 8）。

這只是容器 PID 命名空間的內部視圖。這些 PID 在恢復過程中會準確地被重新創建。
從容器的 PID 命名空間外部，PID 將在恢復後更改。

下一步是獲取有關這三個進程的更多信息。

```console
$ crit show checkpoint/core-1.img | jq .entries[0].tc.comm
"bash"
$ crit show checkpoint/core-7.img | jq .entries[0].tc.comm
"counter.py"
$ crit show checkpoint/core-8.img | jq .entries[0].tc.comm
"tee"
```

<!-- 
This means the three processes in my container are `bash`, `counter.py` (a Python
interpreter) and `tee`. For details about the parent child relations of these processes there
is more data to be analyzed in `checkpoint/pstree.img`.

Let's compare the so far collected information to the still running container:
-->
這意味着容器內的三個進程是 `bash`、`counter.py`（Python 解釋器）和 `tee`。
有關這些進程的父子關係，可以參閱 `checkpoint/pstree.img` 所分析的更多數據。

讓我們將目前爲止收集到的信息與仍在運行的容器進行比較。

```console
$ crictl inspect --output go-template --template "{{(index .info.pid)}}" 059a219a22e56
722520
$ ps auxf | grep -A 2 722520
fedora    722520  \_ bash -c /home/counter/counter.py 2>&1 | tee /home/counter/logfile
fedora    722541      \_ /usr/bin/python3 /home/counter/counter.py
fedora    722542      \_ /usr/bin/coreutils --coreutils-prog-shebang=tee /usr/bin/tee /home/counter/logfile
$ cat /proc/722520/comm
bash
$ cat /proc/722541/comm
counter.py
$ cat /proc/722542/comm
tee
```

<!-- 
In this output I am first retrieving the PID of the first process in the
container and then I am looking for that PID and child processes on the system
where the container is running. I am seeing three processes and the first one is
"bash" which is PID 1 inside of the containers PID namespace.  Then I am looking
at `/proc/<PID>/comm` and I can find the exact same value
as in the checkpoint image.

Important to remember is that the checkpoint will contain the view from within the
container's PID namespace because that information is important to restore the
processes.

One last example of what `crit` can tell us about the container is the information
about the UTS namespace:
-->
在此輸出中，我們首先獲取容器中第一個進程的 PID。在運行容器的系統上，它會查找其 PID 和子進程。
你應該看到三個進程，第一個進程是 `bash`，容器 PID 命名空間中的 PID 爲 1。
然後查看 `/proc/<PID>/comm`，可以找到與檢查點映像檔完全相同的值。

需要記住的重點是，檢查點包含容器的 PID 命名空間內的視圖。因爲這些信息對於恢復進程非常重要。

`crit` 告訴我們有關容器的最後一個例子是有關 UTS 命名空間的信息。

```console
$ crit show checkpoint/utsns-12.img
{
    "magic": "UTSNS",
    "entries": [
        {
            "nodename": "counters",
            "domainname": "(none)"
        }
    ]
}
```

<!-- 
This tells me that the hostname inside of the UTS namespace is `counters`.

For every resource CRIU collected during checkpointing the `checkpoint/`
directory contains corresponding image files which can be analyzed with the help
of `crit`.
-->
這裏輸出表示 UTS 命名空間中的主機名是 `counters`。

對於檢查點創建期間收集的每個資源 CRIU，`checkpoint/` 目錄包含相應的映像檔文件，
你可以藉助 `crit` 來分析該映像檔文件。

<!-- 
#### Looking at the memory pages
-->
#### 查看內存頁面

<!-- 
In addition to the information from CRIU that can be decoded with the help
of CRIT, there are also files containing the raw memory pages written by
CRIU to disk:
-->
除了可以藉助 CRIT 解碼的 CRIU 信息之外，還有包含 CRIU 寫入磁盤的原始內存頁的文件：

```console
$ ls  checkpoint/pages-*
checkpoint/pages-1.img  checkpoint/pages-2.img  checkpoint/pages-3.img
```

<!-- 
When I initially used the container I stored a random key (`RANDOM_1432_KEY`)
somewhere in the memory. Let see if I can find it:
-->
當我最初使用該容器時，我在內存中的某個位置存儲了一個隨機密鑰。讓我看看是否能找到它：

```console
$ grep -ao RANDOM_1432_KEY checkpoint/pages-*
checkpoint/pages-2.img:RANDOM_1432_KEY
```

<!-- 
And indeed, there is my data. This way I can easily look at the content
of all memory pages of the processes in the container, but it is also
important to remember that anyone that can access the checkpoint
archive has access to all information that was stored in the memory of the
container's processes.
-->
確實有我的數據。通過這種方式，我可以輕鬆查看容器中進程的所有內存頁面的內容，
但需要注意的是，你只要能訪問檢查點存檔，就可以訪問存儲在容器進程內存中的所有信息。

<!-- 
#### Using gdb for further analysis
-->
#### 使用 gdb 進一步分析

<!-- 
Another possibility to look at the checkpoint images is `gdb`. The CRIU repository
contains the script [coredump][criu-coredump] which can convert a checkpoint
into a coredump file:
-->
查看檢查點映像檔的另一種方法是 `gdb`。CRIU 存儲庫包含腳本 [coredump][criu-coredump]，
它可以將檢查點轉換爲 coredump 文件：

```console
$ /home/criu/coredump/coredump-python3
$ ls -al core*
core.1  core.7  core.8
```

<!-- 
Running the `coredump-python3` script will convert the checkpoint images into
one coredump file for each process in the container. Using `gdb` I can also look
at the details of the processes:
-->
運行 `coredump-python3` 腳本會將檢查點映像檔轉換爲容器中每個進程一個的 coredump 文件。
使用 `gdb` 我還可以查看進程的詳細信息：

```console
$ echo info registers | gdb --core checkpoint/core.1 -q

[New LWP 1]

Core was generated by `bash -c /home/counter/counter.py 2>&1 | tee /home/counter/logfile'.

#0  0x00007fefba110198 in ?? ()
(gdb)
rax            0x3d                61
rbx            0x8                 8
rcx            0x7fefba11019a      140667595587994
rdx            0x0                 0
rsi            0x7fffed9c1110      140737179816208
rdi            0xffffffff          4294967295
rbp            0x1                 0x1
rsp            0x7fffed9c10e8      0x7fffed9c10e8
r8             0x1                 1
r9             0x0                 0
r10            0x0                 0
r11            0x246               582
r12            0x0                 0
r13            0x7fffed9c1170      140737179816304
r14            0x0                 0
r15            0x0                 0
rip            0x7fefba110198      0x7fefba110198
eflags         0x246               [ PF ZF IF ]
cs             0x33                51
ss             0x2b                43
ds             0x0                 0
es             0x0                 0
fs             0x0                 0
gs             0x0                 0
```

<!--
In this example I can see the value of all registers as they were during
checkpointing and I can also see the complete command-line of my container's PID
1 process: `bash -c /home/counter/counter.py 2>&1 | tee /home/counter/logfile`
-->
在這個例子中，我可以看到所有寄存器的值，因爲它們在檢查點，我還可以看到容器的 PID 1 進程的完整命令列：
`bash -c /home/counter/counter.py 2>&1 | tee /home/counter/logfile`。

<!-- 
## Summary
-->
## 總結

<!-- 
With the help of container checkpointing, it is possible to create a
checkpoint of a running container without stopping the container and without the
container knowing that it was checkpointed. The result of checkpointing a
container in Kubernetes is a checkpoint archive; using different tools like
`checkpointctl`, `tar`, `crit` and `gdb` the checkpoint can be analyzed. Even
with simple tools like `grep` it is possible to find information in the
checkpoint archive.

The different examples I have shown in this article how to analyze a checkpoint
are just the starting point. Depending on your requirements it is possible to
look at certain things in much more detail, but this article should give you an
introduction how to start the analysis of your checkpoint.
-->
藉助容器檢查點，可以在不停止容器且在容器不知情的情況下，爲正在運行的容器創建檢查點。
在 Kubernetes 中對容器創建一個檢查點的結果是檢查點存檔文件；
使用諸如 `checkpointctl`、`tar`、`crit` 和 `gdb` 等不同的工具，可以分析檢查點。
即使使用像 `grep` 這樣的簡單工具，也可以在檢查點存檔中找到信息。

我在本文所展示的如何分析檢查點的不同示例只是一個起點。
根據你的需求，可以更詳細地查看某些內容，本文向你介紹瞭如何開始進行檢查點分析。

<!-- 
## How do I get involved?
-->
## 如何參與？

<!-- 
You can reach SIG Node by several means:

* Slack: [#sig-node][slack-sig-node]
* Slack: [#sig-security][slack-sig-security]
* [Mailing list][sig-node-ml]
-->
你可以通過多種方式聯繫到 SIG Node：

* Slack：[#sig-node][slack-sig-node]
* Slack：[#sig-security][slack-sig-security]
* [郵件列表][sig-node-ml]

[forensic-blog]: https://kubernetes.io/zh-cn/blog/2022/12/05/forensic-container-checkpointing-alpha/
[checkpointctl]: https://github.com/checkpoint-restore/checkpointctl
[image-files]: https://criu.org/Images
[crit]: https://criu.org/CRIT
[slack-sig-node]: https://kubernetes.slack.com/messages/sig-node
[slack-sig-security]: https://kubernetes.slack.com/messages/sig-security
[sig-node-ml]: https://groups.google.com/forum/#!forum/kubernetes-sig-node
[criu-coredump]: https://github.com/checkpoint-restore/criu/tree/criu-dev/coredump
