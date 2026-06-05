---
title: 本地预览
content_type: concept
weight: 11
---
<!--
title: Previewing locally
content_type: concept
weight: 11
-->

<!-- overview -->

<!--
Before you're going to [open a new PR](/docs/contribute/new-content/open-a-pr/),
previewing your changes is recommended. A preview lets you catch build
errors or markdown formatting problems.
-->
在你准备[提交新 PR](/zh-cn/docs/contribute/new-content/open-a-pr/) 之前，建议先预览你的变更。
预览可以帮助你发现构建错误或 Markdown 格式问题。

<!--
## Preview your changes locally {#preview-locally}

You can either build the website's container image or run Hugo locally. Building the container
image is slower but displays [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/), which can
be useful for debugging.
-->
## 在本地预览变更  {#preview-locally}

你可以选择构建网站的容器镜像，或者在本地运行 Hugo。构建容器镜像速度较慢，但可以显示
[Hugo 短代码](/zh-cn/docs/contribute/style/hugo-shortcodes/)，这在调试时会很有帮助。

<!--
Hugo in a container
-->
{{< tabs name="tab_with_hugo" >}}
{{% tab name="在容器中操作 Hugo" %}}

{{< note >}}
<!--
The commands below use Docker as default container engine. Set the `CONTAINER_ENGINE` environment
variable to override this behaviour.
-->
以下命令默认使用 Docker 作为容器引擎。你可以通过设置 `CONTAINER_ENGINE` 环境变量来覆盖此行为。
{{< /note >}}

<!--
1. Build the container image locally  
   _You only need this step if you are testing a change to the Hugo tool itself_

   ```shell
   # Run this in a terminal (if required)
   make container-image
   ```
-->
1. 在本地构建容器镜像

   **只有在你测试 Hugo 工具本身的变更时才需要这一步**

   ```shell
   # 在终端中运行此命令（如果需要）
   make container-image
   ```

<!--
1. Fetch submodule dependencies in your local repository:

   ```shell
   # Run this in a terminal
   make module-init
   ```
-->
2. 在本地仓库中获取子模块依赖：

   ```shell
   # 在终端中运行此命令
   make module-init
   ```

<!--
1. Start Hugo in a container:

   ```shell
   # Run this in a terminal
   make container-serve
   ```
-->
3. 在容器中启动 Hugo：

   ```shell
   # 在终端中运行此命令
   make container-serve
   ```

<!--
1. In a web browser, navigate to `http://localhost:1313`. Hugo watches the
   changes and rebuilds the site as needed.

1. To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`,
   or close the terminal window.
-->
4. 在浏览器中访问 `http://localhost:1313`。Hugo 会监听文件变化，并在需要时重新构建网站。

5. 要停止本地 Hugo 实例，返回终端并输入 `Ctrl+C`，或者关闭终端窗口。

{{% /tab %}}

<!--
Hugo on the command line
-->
{{% tab name="在命令行上操作 Hugo" %}}

<!--
Alternately, install and use the `hugo` command on your computer:

1. Install the [Hugo (Extended edition)](https://gohugo.io/getting-started/installing/) and [Node](https://nodejs.org/en) version specified in
   [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/main/netlify.toml).

1. Install any dependencies:
-->
或者，你也可以在本机安装并使用 `hugo` 命令：

1. 安装 [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/main/netlify.toml)
   中指定版本的 [Hugo（Extended 版本）](https://gohugo.io/getting-started/installing/)和
   [Node](https://nodejs.org/en)。

2. 安装相关依赖：

   ```shell
   npm ci
   ```

<!--
1. In a terminal, go to your Kubernetes website repository and start the Hugo server:

   ```shell
   cd <path_to_your_repo>/website
   make serve
   ```
   If you're on a Windows machine or unable to run the `make` command, use the following command:
-->
3. 在终端中，进入 Kubernetes 网站仓库，并启动 Hugo 服务：

   ```shell
   cd <你的仓库路径>/website
   make serve
   ```

   如果你使用的是 Windows，或者无法运行 `make` 命令，可以使用以下命令：

   ```shell
   hugo server --buildFuture
   ```

<!--
1. In a web browser, navigate to `http://localhost:1313`. Hugo watches the
   changes and rebuilds the site as needed.

1. To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`,
   or close the terminal window.
-->
4. 在浏览器中，访问 `http://localhost:1313`。Hugo 会监听文件变化，并在需要时重新构建网站。

5. 要停止本地 Hugo 实例，返回终端并输入 `Ctrl+C`，或者关闭终端窗口。

{{% /tab %}}
{{< /tabs >}}

<!--
## Troubleshooting {#troubleshooting}

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version
-->
## 故障排查  {#troubleshooting}

### 错误：failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

<!--
Hugo is shipped in two set of binaries for technical reasons. The current
website runs based on the **Hugo Extended** version only. In the [release page](https://github.com/gohugoio/hugo/releases)
 look for archives with `extended` in the name. To confirm, run `hugo version`
 and look for the word `extended`.

### Troubleshooting macOS for too many open files

If you run `make serve` on macOS and receive the following error:
-->
出于技术原因，Hugo 提供了两种二进制版本。当前网站仅支持 **Hugo Extended** 版本。
请在[发布页面](https://github.com/gohugoio/hugo/releases)中查找名称包含 `extended` 的压缩包。
你也可以运行 `hugo version`，确认输出中包含 `extended` 字样。

### macOS “打开文件过多”问题排查

如果你在 macOS 上运行 `make serve` 并遇到如下错误：

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

<!--
Try checking the current limit for open files:
-->
可以先检查当前的文件打开数量限制：

```shell
launchctl limit maxfiles
```

<!--
Then run the following commands (adapted from <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):
-->
然后执行以下命令（参考 <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>）：

```shell
#!/bin/sh

# These are the original gist links, linking to my gists now.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

<!--
This works for Catalina as well as Mojave macOS.

### Unable to find image 'gcr.io/k8s-staging-sig-docs/k8s-website-hugo:VERSION' locally

If you run `make container-serve` and see this error, it might be due to 
the local changes made to specific files [defined](https://github.com/kubernetes/website/blob/main/Makefile#L10)
in the `$IMAGE_VERSION` of `Makefile`.
-->
此方法适用于 Catalina 和 Mojave 版本的 macOS。

### 无法在本地找到镜像 'gcr.io/k8s-staging-sig-docs/k8s-website-hugo:VERSION'

如果你运行 `make container-serve` 时看到此错误，可能是因为你对 `Makefile` 中 `$IMAGE_VERSION`
所定义的某些文件进行了本地修改（参见[这里](https://github.com/kubernetes/website/blob/main/Makefile#L10)）。

<!--
The website image versioning includes a hash, which is generated based on
the content of the listed files. E.g., if `1b9242684415` is the hash 
for these files, the website image will be called `k8s-website-hugo:v0.133.0-1b9242684415`.
Executing `make container-serve` will try to pull such an image from
the Kubernetes website’s GCR. If it’s not a current version, you’ll see
an error saying this image is absent.
-->
网站镜像的版本号包含一个基于这些文件内容生成的哈希值。例如，如果这些文件的哈希为 `1b9242684415`，
则镜像名称为 `k8s-website-hugo:v0.133.0-1b9242684415`。
执行 `make container-serve` 时，会尝试从 Kubernetes 网站的 GCR 拉取对应镜像。
如果该镜像不是当前版本，就会出现“镜像不存在”的错误。

<!--
If you need to make changes in these files and preview the website,
you’ll have to build your local image instead of pulling a pre-built one.
To do so, proceed with running `make container-image`.

### Other issues

If you experience other problems with running website locally and/or
previewing your changes, feel free to [open an issue](https://github.com/kubernetes/website/issues/new/choose)
in the `kubernetes/website` GitHub repo.
-->
如果你需要修改这些文件并预览网站，则需要构建本地镜像，而不是拉取预构建镜像。你可以通过执行 `make container-image` 来完成。

### 其他问题  {other-issues}

如果你在本地运行网站或预览变更时遇到其他问题，欢迎在 GitHub 的 `kubernetes/website`
仓库中[提交 Issue](https://github.com/kubernetes/website/issues/new/choose)。
