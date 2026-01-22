---
layout: blog
title: "Kubernetes 配置最佳实践"
date: 2025-11-25T00:00:00+00:00
slug: configuration-good-practices
evergreen: true
author: Kirti Goyal
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
layout: blog
title: "Kubernetes Configuration Good Practices"
date: 2025-11-25T00:00:00+00:00
slug: configuration-good-practices
evergreen: true
author: Kirti Goyal
-->

<!--
Configuration is one of those things in Kubernetes that seems small until it's not.
Configuration is at the heart of every Kubernetes workload.
A missing quote, a wrong API version or a misplaced YAML indent can ruin your entire deploy.
-->
配置是 Kubernetes 中看似微不足道，实则关键的事情之一。
配置是每个 Kubernetes 工作负载的核心。
一个缺失的引号、错误的 API 版本或错位的 YAML 缩进都可能毁掉你的整个部署。

<!--
This blog brings together tried-and-tested configuration best practices.
The small habits that make your Kubernetes setup clean, consistent and easier to manage.
Whether you are just starting out or already deploying apps daily,
these are the little things that keep your cluster stable and your future self sane.
-->
本博客汇集了经过验证的配置最佳实践。
这些小的习惯让你的 Kubernetes 设置更干净、一致且更易于管理。
无论你是刚刚开始还是已经在每天部署应用，
这些都是让你的集群保持稳定、让未来的你保持理智的小细节。

<!--
_This blog is inspired by the original *Configuration Best Practices* page,
which has evolved through contributions from many members of the Kubernetes community._
-->
**本博客的灵感源自最初的 Configuration Best Practices（配置最佳实践） 页面，
该页面由 Kubernetes 社区众多成员的贡献不断演进而来。**
<!--
## General configuration practices
-->
## 通用配置实践 {#general-configuration-practices}

<!--
### Use the latest stable API version
Kubernetes evolves fast. Older APIs eventually get deprecated and stop working.
So, whenever you are defining resources, make sure you are using the latest stable API version.
You can always check with
-->
### 使用最新的稳定 API 版本 {#use-the-latest-stable-api-version}

Kubernetes 发展很快。旧版 API 最终会被弃用并停止工作。
因此，在定义资源时，请确保使用最新的稳定 API 版本。
你可以随时使用以下命令检查：

```bash
kubectl api-resources
```

<!--
This simple step saves you from future compatibility issues.
-->
这个简单的步骤可以让你避免未来的兼容性问题。

<!--
### Store configuration in version control
Never apply manifest files directly from your desktop.
Always keep them in a version control system like Git, it's your safety net.
If something breaks, you can instantly roll back to a previous commit,
compare changes or recreate your cluster setup without panic.
-->
### 将配置存储在版本控制中 {#store-configuration-in-version-control}

永远不要直接从桌面应用清单文件。
始终将它们保存在像 Git 这样的版本控制系统中，这是你的安全网。
如果出现问题，你可以立即回滚到之前的提交、
比较更改或重新创建集群设置，而不会惊慌。

<!--
### Write configs in YAML not JSON
Write your configuration files using YAML rather than JSON.
Both work technically, but YAML is just easier for humans.
It's cleaner to read and less noisy and widely used in the community.
-->
### 使用 YAML 而不是 JSON 编写配置 {#write-configs-in-yaml-not-json}

使用 YAML 而不是 JSON 编写配置文件。
两者在技术上都可以工作，但 YAML 对人类来说更容易。
它更易读、更简洁，并在社区中广泛使用。

<!--
YAML has some sneaky gotchas with boolean values:
Use only `true` or `false`.
Don't write `yes`, `no`, `on` or  `off`.
They might work in one version of YAML but break in another.
To be safe, quote anything that looks like a Boolean (for example `"yes"`).
-->
YAML 在布尔值方面有一些隐藏的陷阱：
只使用 `true` 或 `false`。
不要写 `yes`、`no`、`on` 或 `off`。
它们可能在同一个 YAML 版本中工作，但在另一个版本中会失败。
为了安全起见，请给任何看起来像布尔值的内容加引号（例如 `"yes"`）。

<!--
###     Keep configuration simple and minimal
Avoid setting default values that are already handled by Kubernetes.
Minimal manifests are easier to debug, cleaner to review and less likely to break things later.
-->
### 保持配置简单和最小化 {#keep-configuration-simple-and-minimal}

避免设置 Kubernetes 已经处理的默认值。
最小化的清单更容易调试、更易于审查，并且以后不太可能破坏东西。

<!--
###     Group related objects together
If your Deployment, Service and ConfigMap all belong to one app, put them in a single manifest file.
It's easier to track changes and apply them as a unit.
See the [Guestbook all-in-one.yaml](https://github.com/kubernetes/examples/blob/master/web/guestbook/all-in-one/guestbook-all-in-one.yaml) file for an example of this syntax.
-->
### 将相关对象分组在一起 {#group-related-objects-together}

如果你的 Deployment、Service 和 ConfigMap 都属于一个应用，
请将它们放在一个清单文件中。
这样更容易跟踪更改并将它们作为一个单元应用。
有关此语法的示例，请参阅
[Guestbook all-in-one.yaml](https://github.com/kubernetes/examples/blob/master/web/guestbook/all-in-one/guestbook-all-in-one.yaml) 文件。

<!--
You can even apply entire directories with:
-->
你甚至可以使用以下命令应用整个目录：

```bash
kubectl apply -f configs/
```

<!--
One command and boom everything in that folder gets deployed.
-->
只需一个命令，该文件夹中的所有内容都会被部署。

<!--
###     Add helpful annotations
Manifest files are not just for machines, they are for humans too.
Use annotations to describe why something exists or what it does.
A quick one-liner can save hours when debugging later and also allows better collaboration.
-->
### 添加有用的注解 {#add-helpful-annotations}

清单文件不仅是为机器准备的，也是为人类准备的。
使用注解来描述某些内容存在的原因或它的作用。
快速的一行注释可以在以后调试时节省数小时，并且还可以实现更好的协作。

<!--
The most helpful annotation to set is `kubernetes.io/description`.
It's like using comment, except that it gets copied into the API
so that everyone else can see it even after you deploy.
-->
最有用的注解是 `kubernetes.io/description`。
这就像使用注释一样，只是它会被复制到 API 中，
这样其他人在你部署后也能看到它。

<!--
## Managing Workloads: Pods, Deployments, and Jobs
-->
## 管理工作负载：Pod、Deployment 和 Job {#managing-workloads-pods-deployments-and-jobs}

<!--
A common early mistake in Kubernetes is creating Pods directly.
Pods work, but they don't reschedule themselves if something goes wrong.
-->
在 Kubernetes 中，一个常见的早期错误是直接创建 Pod。
Pod 可以工作，但如果出现问题，它们不会重新调度自己。

<!--
_Naked Pods_ (Pods not managed by a controller, such as [Deployment](/docs/concepts/workloads/controllers/deployment/) or a [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)) are fine for testing, but in real setups, they are risky.
-->
**裸 Pod**（不受控制器管理的 Pod，例如
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 或
[StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)）
用于测试是可以的，但在实际设置中，它们是有风险的。

<!--
Why?
Because if the node hosting that Pod dies, the Pod dies with it
and Kubernetes won't bring it back automatically.
-->
为什么？
因为如果托管该 Pod 的节点死亡，Pod 也会随之死亡，
Kubernetes 不会自动将其恢复。

<!--
### Use Deployments for apps that should always be running
A Deployment, which both creates a ReplicaSet to ensure that the desired number of Pods is always available,
and specifies a strategy to replace Pods (such as [RollingUpdate](/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)),
is almost always preferable to creating Pods directly.
You can roll out a new version, and if something breaks, roll back instantly.
-->
### 对应该始终运行的应用使用 Deployment {#use-deployments-for-apps-that-should-always-be-running}

Deployment 既创建 ReplicaSet 以确保所需数量的 Pod 始终可用，
又指定替换 Pod 的策略（例如[滚动更新](/zh-cn/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)），
几乎总是比直接创建 Pod 更可取。
你可以推出新版本，如果出现问题，可以立即回滚。

<!--
### Use Jobs for tasks that should finish
A [Job](/docs/concepts/workloads/controllers/job/) is perfect when you need something to run once and then stop
like database migration or batch processing task.
It will retry if the pods fails and report success when it's done.
-->
### 对应该完成的任务使用 Job {#use-jobs-for-tasks-that-should-finish}

当你需要某些东西运行一次然后停止时（如数据库迁移或批处理任务），
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 是完美的选择。
如果 Pod 失败，它会重试，并在完成时报告成功。

<!--
## Service Configuration and Networking
-->
## Service 配置和网络 {#service-configuration-and-networking}

<!--
Services are how your workloads talk to each other inside (and sometimes outside) your cluster.
Without them, your pods exist but can't reach anyone. Let's make sure that doesn't happen.
-->
Service 是你的工作负载在集群内部（有时是外部）相互通信的方式。
没有它们，你的 Pod 存在但无法被任何人访问。让我们确保这种情况不会发生。

<!--
### Create Services before workloads that use them
When Kubernetes starts a Pod, it automatically injects environment variables for existing Services.
So, if a Pod depends on a Service, create a [Service](/docs/concepts/services-networking/service/) **before** its corresponding backend workloads (Deployments or StatefulSets),
and before any workloads that need to access it.
-->
### 在使用它们的工作负载之前创建 Service {#create-services-before-workloads-that-use-them}

当 Kubernetes 启动 Pod 时，它会自动为现有 Service 注入环境变量。
因此，如果 Pod 依赖于 Service，请在其相应的后端工作负载（Deployment 或 StatefulSet）
以及任何需要访问它的工作负载**之前**创建 [Service](/zh-cn/docs/concepts/services-networking/service/)。

<!--
For example, if a Service named foo exists, all containers will get the following variables in their initial environment:
-->
例如，如果存在名为 foo 的 Service，所有容器将在其初始环境中获得以下变量：

```
FOO_SERVICE_HOST=<the host the Service runs on>
FOO_SERVICE_PORT=<the port the Service runs on>
```

<!--
DNS based discovery doesn't have this problem, but it's a good habit to follow anyway.
-->
基于 DNS 的发现没有这个问题，但无论如何遵循它是一个好习惯。

<!--
### Use DNS for Service discovery
If your cluster has the DNS [add-on](/docs/concepts/cluster-administration/addons/) (most do),
every Service automatically gets a DNS entry.
That means you can access it by name instead of IP:
-->
### 使用 DNS 进行 Service 发现 {#use-dns-for-service-discovery}

如果你的集群有 DNS [安装扩展（Addon）](/zh-cn/docs/concepts/cluster-administration/addons/)（大多数都有），
每个 Service 都会自动获得一个 DNS 条目。
这意味着你可以通过名称而不是 IP 访问它：

```bash
curl http://my-service.default.svc.cluster.local
```

<!--
It's one of those features that makes Kubernetes networking feel magical.
-->
这是让 Kubernetes 网络感觉神奇的特性之一。

<!--
### Avoid `hostPort` and `hostNetwork` unless absolutely necessary
You'll sometimes see these options in manifests:
-->
### 除非绝对必要，否则避免使用 `hostPort` 和 `hostNetwork` {#avoid-hostport-and-hostnetwork-unless-absolutely-necessary}

你有时会在清单中看到这些选项：

```yaml
hostPort: 8080
hostNetwork: true
```

<!--
But here's the thing:
They tie your Pods to specific nodes, making them harder to schedule and scale.
Because each <`hostIP`, `hostPort`, `protocol`> combination must be unique.
If you don't specify the `hostIP` and `protocol` explicitly,
Kubernetes will use `0.0.0.0` as the default `hostIP` and `TCP` as the default `protocol`.
Unless you're debugging or building something like a network plugin, avoid them.
-->
但问题是：
它们将你的 Pod 绑定到特定节点，使它们更难调度和扩缩容。
因为每个 <`hostIP`、`hostPort`、`protocol`> 组合必须是唯一的。
如果你没有明确指定 `hostIP` 和 `protocol`，
Kubernetes 将使用 `0.0.0.0` 作为默认 `hostIP`，使用 `TCP` 作为默认 `protocol`。
除非你在调试或构建网络插件之类的东西，否则请避免使用它们。

<!--
If you just need local access for testing, try [`kubectl port-forward`](/docs/reference/kubectl/generated/kubectl_port-forward/):
-->
如果你只需要本地访问进行测试，请尝试 [`kubectl port-forward`](/zh-cn/docs/reference/kubectl/generated/kubectl_port-forward/)：

```bash
kubectl port-forward deployment/web 8080:80
```

<!--
See [Use Port Forwarding to access applications in a cluster](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) to learn more.
Or if you really need external access, use a [`type: NodePort` Service](/docs/concepts/services-networking/service/#type-nodeport). That's the safer, Kubernetes-native way.
-->
有关更多信息，请参阅
[使用端口转发访问集群中的应用程序](/zh-cn/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)。
或者如果你真的需要外部访问，请使用 [`type: NodePort` Service](/zh-cn/docs/concepts/services-networking/service/#type-nodeport)。
这是更安全、更符合 Kubernetes 原生方式的做法。

<!--
### Use headless Services for internal discovery
Sometimes, you don't want Kubernetes to load balance traffic.
You want to talk directly to each Pod. That's where [headless Services](/docs/concepts/services-networking/service/#headless-services) come in.
-->
### 使用无头 Service 进行内部服务发现 {#use-headless-services-for-internal-discovery}

有时，你不想让 Kubernetes 负载均衡流量。
你想直接与每个 Pod 通信。这就是[无头 Service](/zh-cn/docs/concepts/services-networking/service/#headless-services) 的用武之地。

<!--
You create one by setting `clusterIP: None`.
Instead of a single IP, DNS gives you a list of all Pods IPs,
perfect for apps that manage connections themselves.
-->
你通过设置 `clusterIP: None` 来创建一个。
DNS 不是给你一个 IP，而是给你所有 Pod IP 的列表，
这非常适合自己管理连接的应用程序。

<!--
## Working with labels effectively
-->
## 有效使用标签 {#working-with-labels-effectively}

<!--
[Labels](/docs/concepts/overview/working-with-objects/labels/) are key/value pairs that are attached to objects such as Pods.
Labels help you organize, query and group your resources.
They don't do anything by themselves, but they make everything else from Services to Deployments work together smoothly.
-->
[标签](/zh-cn/docs/concepts/overview/working-with-objects/labels/)是附加到 Pod 等对象的键/值对。
标签帮助你组织、查询和分组资源。
它们本身不做任何事情，但它们使从 Service 到 Deployment 的所有其他内容都能顺利协同工作。

<!--
### Use semantics labels
Good labels help you understand what's what, even after months later.
Define and use [labels](/docs/concepts/overview/working-with-objects/labels/) that identify semantic attributes of your application or Deployment.
For example;
-->
### 使用语义标签 {#use-semantics-labels}

好的标签可以帮助你理解什么是什么，即使在几个月后也是如此。
定义并使用[标签](/zh-cn/docs/concepts/overview/working-with-objects/labels/)来标识应用程序或 Deployment 的语义属性。
例如：

```yaml
labels:
  app.kubernetes.io/name: myapp
  app.kubernetes.io/component: web
  tier: frontend
  phase: test
```

<!--
  - `app.kubernetes.io/name` : what the app is
  - `tier` : which layer it belongs to (frontend/backend)
  - `phase` : which stage it's in (test/prod)
-->
- `app.kubernetes.io/name`：应用是什么
- `tier`：它属于哪一层（前端/后端）
- `phase`：它处于哪个阶段（测试/生产）

<!--
You can then use these labels to make powerful selectors.
For example:
-->
然后你可以使用这些标签来创建强大的选择算符。
例如：

```bash
kubectl get pods -l tier=frontend
```

<!--
This will list all frontend Pods across your cluster, no matter which Deployment they came from.
Basically you are not manually listing Pod names; you are just describing what you want.
See the [guestbook](https://github.com/kubernetes/examples/tree/master/web/guestbook/) app for examples of this approach.
-->
这将列出集群中所有前端 Pod，无论它们来自哪个 Deployment。
基本上，你不需要手动列出 Pod 名称；你只是在描述你想要什么。
有关此方法的示例，请参阅 [guestbook](https://github.com/kubernetes/examples/tree/master/web/guestbook/) 应用。

<!--
### Use common Kubernetes labels
Kubernetes actually recommends a set of [common labels](/docs/concepts/overview/working-with-objects/common-labels/).
It's a standardized way to name things across your different workloads or projects.
Following this convention makes your manifests cleaner, and it means that tools such as [Headlamp](https://headlamp.dev/),
[dashboard](https://github.com/kubernetes/dashboard#introduction), or third-party monitoring systems can all
automatically understand what's running.
-->
### 使用常见的 Kubernetes 标签 {#use-common-kubernetes-labels}

Kubernetes 实际上推荐一组[常见标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/)。
这是在你的不同工作负载或项目中命名事物的一种标准方式。
遵循此约定使你的清单更清晰，这意味着诸如 [Headlamp](https://headlamp.dev/)、
[dashboard](https://github.com/kubernetes/dashboard#introduction) 或第三方监控系统等工具
都可以自动理解正在运行的内容。

<!--
###     Manipulate labels for debugging
Since controllers (like ReplicaSets or Deployments) use labels to manage Pods,
you can remove a label to "detach" a Pod temporarily.
-->
### 操作标签进行调试 {#manipulate-labels-for-debugging}

由于控制器（如 ReplicaSet 或 Deployment）使用标签来管理 Pod，
你可以删除标签以临时 "分离" Pod。

<!--
Example:
-->
示例：

```bash
kubectl label pod mypod app-
```

<!--
The `app-` part removes the label key `app`.
Once that happens, the controller won't manage that Pod anymore.
It's like isolating it for inspection, a "quarantine mode" for debugging.
To interactively remove or add labels, use [`kubectl label`](/docs/reference/kubectl/generated/kubectl_label/).
-->
`app-` 部分会删除标签键 `app`。
一旦发生这种情况，控制器将不再管理该 Pod。
这就像将其隔离以进行检查，一种用于调试的"隔离模式"。
要交互式地删除或添加标签，请使用 [`kubectl label`](/zh-cn/docs/reference/kubectl/generated/kubectl_label/)。

<!--
You can then check logs, exec into it and once done, delete it manually.
That's a super underrated trick every Kubernetes engineer should know.
-->
然后你可以检查 Pod 日志、exec 进入 Pod，完成后手动删除 Pod。
这是每个 Kubernetes 工程师都应该知道的超级被低估的技巧。

<!--
## Handy kubectl tips
-->
## 实用的 kubectl 技巧 {#handy-kubectl-tips}

<!--
These small tips make life much easier when you are working with multiple manifest files or clusters.
-->
这些小技巧使你在处理多个清单文件或集群时生活变得更加轻松。

<!--
### Apply entire directories
Instead of applying one file at a time, apply the whole folder:
-->
### 应用整个目录 {#apply-entire-directories}

不要一次应用一个文件，而是应用整个文件夹：

```bash
# Using server-side apply is also a good practice
kubectl apply -f configs/ --server-side
```

<!--
This command looks for `.yaml`, `.yml` and `.json` files in that folder and applies them all together.
It's faster, cleaner and helps keep things grouped by app.
-->
此命令在该文件夹中查找 `.yaml`、`.yml` 和 `.json` 文件并将它们一起应用。
它更快、更清晰，并有助于按应用分组。

<!--
### Use label selectors to get or delete resources
You don't always need to type out resource names one by one.
Instead, use [selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors) to act on entire groups at once:
-->
### 使用标签选择算符获取或删除资源 {#use-label-selectors-to-get-or-delete-resources}

你不需要总是逐个输入资源名称。
相反，使用[标签选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)一次对整个组进行操作：

```bash
kubectl get pods -l app=myapp
kubectl delete pod -l phase=test
```

<!--
It's especially useful in CI/CD pipelines, where you want to clean up test resources dynamically.
-->
这在 CI/CD 流水线中特别有用，你可以在其中动态清理测试资源。

<!--
### Quickly create Deployments and Services
For quick experiments, you don't always need to write a manifest.
You can spin up a Deployment right from the CLI:
-->
### 快速创建 Deployment 和 Service {#quickly-create-deployments-and-services}

对于快速实验，你不需要总是编写清单。
你可以直接从 CLI 启动 Deployment：

```bash
kubectl create deployment webapp --image=nginx
```

<!--
Then expose it as a Service:
-->
然后将其公开为 Service：

```bash
kubectl expose deployment webapp --port=80
```

<!--
This is great when you just want to test something before writing full manifests.
Also, see [Use a Service to Access an Application in a cluster](/docs/tasks/access-application-cluster/service-access-application-cluster/) for an example.
-->
当你想在编写完整清单之前测试某些内容时，这非常有用。
另外，有关示例，请参阅
[使用 Service 访问集群中的应用程序](/zh-cn/docs/tasks/access-application-cluster/service-access-application-cluster/)。

<!--
## Conclusion
-->
## 结论 {#conclusion}

<!--
Cleaner configuration leads to calmer cluster administrators.
If you stick to a few simple habits: keep configuration simple and minimal, version-control everything,
use consistent labels, and avoid relying on naked Pods, you'll save yourself hours of debugging down the road.
-->
更清晰的配置可以让集群管理员更为泰然自若。
如果你坚持几个简单的习惯：保持配置简单和最小化、对所有内容进行版本控制、
使用一致的标签，并避免依赖裸 Pod，你将为自己节省数小时的调试时间。

<!--
The best part?
Clean configurations stay readable. Even after months, you or anyone on your team
can glance at them and know exactly what's happening.
-->
最好的部分是什么？
清晰的配置保持可读性。即使在几个月后，
你或团队中的任何人都可以瞥一眼它们并确切知道发生了什么。
