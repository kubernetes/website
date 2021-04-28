---
title: "通过 gcloud 安装 kubectl"
description: "用各个特定操作系统标签页中包含的 gcloud 指令片段安装 kubectl。"
headless: true
---
<!-- 
---
title: "gcloud kubectl install"
description: "How to install kubectl with gcloud snippet for inclusion in each OS-specific tab."
headless: true
---
-->

<!-- 
You can install kubectl as part of the Google Cloud SDK.
-->
kubectl 可以作为 Google Cloud SDK 的一部分被安装。

<!-- 
1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/).
1. Run the `kubectl` installation command:
-->
1. 安装 [Google Cloud SDK](https://cloud.google.com/sdk/)。
1. 运行安装 `kubectl` 的命令：

   ```shell
   gcloud components install kubectl
   ```

   <!-- 
   1. Test to ensure the version you installed is up-to-date:
   -->
1. 验证一下，确保安装的是最新的版本：

   ```shell
   kubectl version --client
   ```