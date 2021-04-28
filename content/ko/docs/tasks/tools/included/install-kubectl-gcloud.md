---
title: "gcloud kubectl install"
description: "gcloud를 이용하여 kubectl을 설치하는 방법을 각 OS별 탭에 포함하기 위한 스니펫."
headless: true
---

Google Cloud SDK를 사용하여 kubectl을 설치할 수 있다.

1. [Google Cloud SDK](https://cloud.google.com/sdk/)를 설치한다.

1. `kubectl` 설치 명령을 실행한다.

   ```shell
   gcloud components install kubectl
   ```

1. 설치한 버전이 최신 버전인지 확인한다.

   ```shell
   kubectl version --client
   ```