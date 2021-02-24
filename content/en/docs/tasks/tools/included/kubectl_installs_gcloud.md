---
title: "gcloud kubectl install"
description: "How to install kubectl with gcloud snippet for inclusion in each OS-specific tab."
toc_hide: true
---

You can install kubectl as part of the Google Cloud SDK.

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/).

1. Run the `kubectl` installation command:

   ```shell
   gcloud components install kubectl
   ```

1. Test to ensure the version you installed is up-to-date:

   ```shell
   kubectl version --client
   ```