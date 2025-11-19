---
layout: blog
title: '在 Ingress-NGINX v1.2.0 中提高安全標準'
date: 2022-04-28
slug: ingress-nginx-1-2-0
---

<!--
layout: blog
title: 'Increasing the security bar in Ingress-NGINX v1.2.0'
date: 2022-04-28
slug: ingress-nginx-1-2-0
-->

<!--
**Authors:** Ricardo Katz (VMware), James Strong (Chainguard)
-->
**作者：** Ricardo Katz (VMware), James Strong (Chainguard)

<!--
The [Ingress](/docs/concepts/services-networking/ingress/) may be one of the most targeted components
of Kubernetes. An Ingress typically defines an HTTP reverse proxy, exposed to the Internet, containing
multiple websites, and with some privileged access to Kubernetes API (such as to read Secrets relating to
TLS certificates and their private keys).
-->
[Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 可能是 Kubernetes 最容易受攻擊的組件之一。
Ingress 通常定義一個 HTTP 反向代理，暴露在互聯網上，包含多個網站，並具有對 Kubernetes API
的一些特權訪問（例如讀取與 TLS 證書及其私鑰相關的 Secret）。

<!--
While it is a risky component in your architecture, it is still the most popular way to properly expose your services.
-->
雖然它是架構中的一個風險組件，但它仍然是正常公開服務的最流行方式。

<!--
Ingress-NGINX has been part of security assessments that figured out we have a big problem: we don't
do all proper sanitization before turning the configuration into an `nginx.conf` file, which may lead to information
disclosure risks.
-->
Ingress-NGINX 一直是安全評估的重頭戲，這類評估會發現我們有着很大的問題：
在將配置轉換爲 `nginx.conf` 文件之前，我們沒有進行所有適當的清理，這可能會導致信息泄露風險。

<!--
While we understand this risk and the real need to fix this, it's not an easy process to do, so we took another approach to reduce (but not remove!) this risk in the current (v1.2.0) release.
-->
雖然我們瞭解此風險以及解決此問題的真正需求，但這並不是一個容易的過程，
因此我們在當前(v1.2.0)版本中採取了另一種方法來減少（但不是消除！）這種風險。

<!--
## Meet Ingress NGINX v1.2.0 and the chrooted NGINX process
-->
## 瞭解 Ingress NGINX v1.2.0 和 chrooted NGINX 進程

<!--
One of the main challenges is that Ingress-NGINX runs the web proxy server (NGINX) alongside the Ingress
controller (the component that has access to Kubernetes API that and that creates the `nginx.conf` file).
-->
主要挑戰之一是 Ingress-NGINX 運行着 Web 代理服務器（NGINX），並與 Ingress 控制器一起運行
（後者是一個可以訪問 Kubernetes API 並創建 `nginx.conf` 的組件）。

<!--
So, NGINX does have the same access to the filesystem of the controller (and Kubernetes service account token, and other configurations from the container). While splitting those components is our end goal, the project needed a fast response; that lead us to the idea of using `chroot()`.
-->
因此，NGINX 對控制器的文件系統（和 Kubernetes 服務帳戶令牌，以及容器中的其他配置）具有相同的訪問權限。 
雖然拆分這些組件是我們的最終目標，但該項目需要快速響應；這讓我們想到了使用 `chroot()`。

<!--
Let's take a look into what an Ingress-NGINX container looked like before this change:
-->
讓我們看一下 Ingress-NGINX 容器在此更改之前的樣子：

![Ingress NGINX pre chroot](ingress-pre-chroot.png)

<!--
As we can see, the same container (not the Pod, the container!) that provides HTTP Proxy is the one that watches Ingress objects and writes the Container Volume
-->
正如我們所見，用來提供 HTTP Proxy 的容器（不是 Pod，是容器！）也是是監視 Ingress
對象並將數據寫入容器卷的容器。

<!--
Now, meet the new architecture:
-->
現在，見識一下新架構：

![Ingress NGINX post chroot](ingress-post-chroot.png)

<!--
What does all of this mean? A basic summary is: that we are isolating the NGINX service as a container inside the
controller container.
-->
這一切意味着什麼？一個基本的總結是：我們將 NGINX 服務隔離爲控制器容器內的容器。

<!--
While this is not strictly true, to understand what was done here, it's good to understand how
Linux containers (and underlying mechanisms such as kernel namespaces) work.
You can read about cgroups in the Kubernetes glossary: [`cgroup`](https://kubernetes.io/docs/reference/glossary/?fundamental=true#term-cgroup) and learn more about cgroups interact with namespaces in the NGINX project article
[What Are Namespaces and cgroups, and How Do They Work?](https://www.nginx.com/blog/what-are-namespaces-cgroups-how-do-they-work/).
(As you read that, bear in mind that Linux kernel namespaces are a different thing from
[Kubernetes namespaces](/docs/concepts/overview/working-with-objects/namespaces/)).
-->
雖然這並不完全正確，但要了解這裏所做的事情，最好了解 Linux 容器（以及內核命名空間等底層機制）是如何工作的。
你可以在 Kubernetes 詞彙表中閱讀有關 cgroup 的信息：[`cgroup`](/zh-cn/docs/reference/glossary/?fundamental=true#term-cgroup)，
並在 NGINX 項目文章[什麼是命名空間和 cgroup，以及它們如何工作？](https://www.nginx.com/blog/what-are-namespaces-cgroups-how-do-they-work/)
中瞭解有關 cgroup 與命名空間交互的更多信息。（當你閱讀時，請記住 Linux 內核命名空間與 
[Kubernetes 命名空間](/zh-cn/docs/concepts/overview/working-with-objects/namespaces/)不同）。

<!--
## Skip the talk, what do I need to use this new approach?
-->
## 跳過談話，我需要什麼才能使用這種新方法？

<!--
While this increases the security, we made this feature an opt-in in this release so you can have
time to make the right adjustments in your environment(s). This new feature is only available from
release v1.2.0 of the Ingress-NGINX controller.
-->
雖然這增加了安全性，但我們在這個版本中把這個功能作爲一個選項，這樣你就可以有時間在你的環境中做出正確的調整。
此新功能僅在 Ingress-NGINX 控制器的 v1.2.0 版本中可用。

<!--
There are two required changes in your deployments to use this feature:
* Append the suffix "-chroot" to the container image name. For example: `gcr.io/k8s-staging-ingress-nginx/controller-chroot:v1.2.0`
* In your Pod template for the Ingress controller, find where you add the capability `NET_BIND_SERVICE` and add the capability `SYS_CHROOT`. After you edit the manifest, you'll see a snippet like:
-->
要使用這個功能，在你的部署中有兩個必要的改變：
* 將後綴 "-chroot" 添加到容器鏡像名稱中。例如：`gcr.io/k8s-staging-ingress-nginx/controller-chroot:v1.2.0`
* 在你的 Ingress 控制器的 Pod 模板中，找到添加 `NET_BIND_SERVICE` 權能的位置並添加 `SYS_CHROOT` 權能。
  編輯清單後，你將看到如下代碼段：

```yaml
capabilities:
  drop:
  - ALL
  add:
  - NET_BIND_SERVICE
  - SYS_CHROOT
```
<!--
If you deploy the controller using the official Helm chart then change the following setting in
`values.yaml`:
-->
如果你使用官方 Helm Chart 部署控制器，則在 `values.yaml` 中更改以下設置：

```yaml
controller:
  image:
    chroot: true
```
<!--
Ingress controllers are normally set up cluster-wide (the IngressClass API is cluster scoped). If you manage the
Ingress-NGINX controller but you're not the overall cluster operator, then check with your cluster admin about
whether you can use the `SYS_CHROOT` capability, **before** you enable it in your deployment.
-->
Ingress 控制器通常部署在集羣作用域（IngressClass API 是集羣作用域的）。
如果你管理 Ingress-NGINX 控制器但你不是整個集羣的操作員，
請在部署中啓用它**之前**與集羣管理員確認你是否可以使用 `SYS_CHROOT` 功能。

<!--
## OK, but how does this increase the security of my Ingress controller?

Take the following configuration snippet and imagine, for some reason it was added to your `nginx.conf`:
-->
## 好吧，但這如何能提高我的 Ingress 控制器的安全性呢？

以下面的配置片段爲例，想象一下，由於某種原因，它被添加到你的 `nginx.conf` 中：

```
location /randomthing/ {
      alias /;
      autoindex on;
}
```
<!--
If you deploy this configuration, someone can call `http://website.example/randomthing` and get some listing (and access) to the whole filesystem of the Ingress controller.

Now, can you spot the difference between chrooted and non chrooted Nginx on the listings below?
-->
如果你部署了這種配置，有人可以調用 `http://website.example/randomthing` 並獲取對 Ingress 控制器的整個文件系統的一些列表（和訪問權限）。

現在，你能在下面的列表中發現 chroot 處理過和未經 chroot 處理過的 Nginx 之間的區別嗎？

| 不額外調用 `chroot()`             | 額外調用 `chroot()` |
|----------------------------|--------|
| `bin`                      | `bin`  |
| `dev`                      | `dev`  |
| `etc`                      | `etc`  |
| `home`                     |        |
| `lib`                      | `lib`  |
| `media`                    |        |
| `mnt`                      |        |
| `opt`                      | `opt`  |
| `proc`                     | `proc` |
| `root`                     |        |
| `run`                      | `run`  |
| `sbin`                     |        |
| `srv`                      |        |
| `sys`                      |        |
| `tmp`                      | `tmp`  |
| `usr`                      | `usr`  |
| `var`                      | `var`  |
| `dbg`                      |        |
| `nginx-ingress-controller` |        |
| `wait-shutdown`            |        |

<!--
The one in left side is not chrooted. So NGINX has full access to the filesystem. The one in right side is chrooted, so a new filesystem with only the required files to make NGINX work is created.
-->
左側的那個沒有 chroot 處理。所以 NGINX 可以完全訪問文件系統。右側的那個經過 chroot 處理，
因此創建了一個新文件系統，其中只有使 NGINX 工作所需的文件。

<!--
## What about other security improvements in this release?
-->
## 此版本中的其他安全改進如何？

<!--
We know that the new `chroot()` mechanism helps address some portion of the risk, but still, someone
can try to inject commands to read, for example, the `nginx.conf` file and extract sensitive information.
-->
我們知道新的 `chroot()` 機制有助於解決部分風險，但仍然有人可以嘗試注入命令來讀取，例如 `nginx.conf` 文件並提取敏感信息。

<!--
So, another change in this release (this is opt-out!) is the _deep inspector_.
We know that some directives or regular expressions may be dangerous to NGINX, so the deep inspector
checks all fields from an Ingress object (during its reconciliation, and also with a
[validating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook))
to verify if any fields contains these dangerous directives.
-->
所以，這個版本的另一個變化（可選擇取消）是 **深度探測（Deep Inspector）**。
我們知道某些指令或正則表達式可能對 NGINX 造成危險，因此深度探測器會檢查 Ingress 對象中的所有字段
（在其協調期間，並且還使用[驗證准入 webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook))
驗證是否有任何字段包含這些危險指令。

<!--
The ingress controller already does this for annotations, and our goal is to move this existing validation to happen inside
deep inspection as part of a future release.
-->
Ingress 控制器已經通過註解做了這個工作，我們的目標是把現有的驗證轉移到深度探測中，作爲未來版本的一部分。

<!--
You can take a look into the existing rules in [https://github.com/kubernetes/ingress-nginx/blob/main/internal/ingress/inspector/rules.go](https://github.com/kubernetes/ingress-nginx/blob/main/internal/ingress/inspector/rules.go).
-->
你可以在 [https://github.com/kubernetes/ingress-nginx/blob/main/internal/ingress/inspector/rules.go](https://github.com/kubernetes/ingress-nginx/blob/main/internal/ingress/inspector/rules.go) 中查看現有規則。

<!--
Due to the nature of inspecting and matching all strings within relevant Ingress objects, this new feature may consume a bit more CPU. You can disable it by running the ingress controller with the command line argument `--deep-inspect=false`.
-->
由於檢查和匹配相關 Ingress 對象中的所有字符串的性質，此新功能可能會消耗更多 CPU。
你可以通過使用命令行參數 `--deep-inspect=false` 運行 Ingress 控制器來禁用它。

<!--
## What's next?

This is not our final goal. Our final goal is to split the control plane and the data plane processes.
In fact, doing so will help us also achieve a [Gateway](https://gateway-api.sigs.k8s.io/) API implementation,
as we may have a different controller as soon as it "knows" what to provide to the data plane
(we need some help here!!)
-->
## 下一步是什麼?

這不是我們的最終目標。我們的最終目標是拆分控制平面和數據平面進程。
事實上，這樣做也將幫助我們實現 [Gateway](https://gateway-api.sigs.k8s.io/) API 實現，
因爲一旦它“知道”要提供什麼，我們可能會有不同的控制器 數據平面（我們需要一些幫助！！）

<!--
Some other projects in Kubernetes already take this approach
(like [KPNG](https://github.com/kubernetes-sigs/kpng), the proposed replacement for `kube-proxy`),
and we plan to align with them and get the same experience for Ingress-NGINX.
-->
Kubernetes 中的其他一些項目已經採用了這種方法（如 [KPNG](https://github.com/kubernetes-sigs/kpng)，
建議替換 `kube-proxy`），我們計劃與他們保持一致，併爲 Ingress-NGINX 獲得相同的體驗。

<!--
## Further reading

If you want to take a look into how chrooting was done in Ingress NGINX, take a look 
into [https://github.com/kubernetes/ingress-nginx/pull/8337](https://github.com/kubernetes/ingress-nginx/pull/8337)
The release v1.2.0 containing all the changes can be found at 
[https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.2.0](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.2.0)
-->
## 延伸閱讀

如果你想了解如何在 Ingress NGINX 中完成 chrooting，請查看
[https://github.com/kubernetes/ingress-nginx/pull/8337](https://github.com/kubernetes/ingress-nginx/pull/8337)。
包含所有更改的版本 v1.2.0 可以在以下位置找到
[https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.2.0](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.2.0)
