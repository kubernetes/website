---
layout: blog
title: "K8s Triage bot Helper CI Job: ‘*make update*’"
date: 2022-02-25
slug: k8s-triage-bot-helper-ci-job
---

# K8s Triage bot Helper CI Job: ‘*make update*’

## Introduction 

If you are contributing to the Kubernetes project and are developing on a Windows PC, it is conceivable that you will encounter certain issues that will cause your patches to master to somehow be halted. This blog is a workaround for a similar issue I encountered when attempting to have my modifications approved and merged into the master repository.

## Why is this needed?
 
While contributing to [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) for some minor documentation changes, the pushed changes needed to be updated with other verified contents of the entire documentation. So, in order for the change to take effect, a single command must be performed to ensure that all tests on the CI pipeline pass. The single command `make update` runs all presubmission verification tests. For some reason on the windows `wsl` environment the tests, specifically the [update-openapi-spec.sh](https://github.com/SubhasmitaSw/kubernetes/blob/master/hack/update-openapi-spec.sh) script, failed (in my case, take a look at the conversation [here](https://github.com/kubernetes/kubernetes/pull/107691)), eventually failing the `pull-kubernetes-verify` tests.


> Advertently, the test cases pass to generate the updated files in other beefy Operating Systems like mac or Linux.

### System info:

| OS name | Version | System type |Memory| WSL |
| ------- | ------- | ----------- | ---  | --- |
|Windows 11 home|10.0.22000 Build 22000|x64-based|8.00 GB|Ubuntu-20.04 (v2)|


## You might encounter the following on your PR

:::warning
:warning: failing test cases notification from k8s-ci-robot
:::


The tests failing the particular issue:

![](https://i.imgur.com/pjrfmIY.png)

Consecutively, 

![](https://i.imgur.com/Lxj38kZ.png)

Additionally one can check the failed test via the `link` provided under details in the above image.

### Potential solution
Run the failing `.sh` scripts individually known from the CI job output, to generate the expected files to fix up the failures. The `.sh` scripts can be found residing under the `hack/` directory at the root of the `kubernetes/kubernetes` code base. 

:::success
 kubernetes/kubernetes &rarr; hack/ &rarr; `.sh` update files
:::




In this particular case, these files were to be run:

* [hack/update-generated-protobuf.sh](https://github.com/SubhasmitaSw/kubernetes/blob/master/hack/update-generated-protobuf.sh) 
* [hack/update-generated-swagger-docs.sh](https://github.com/SubhasmitaSw/kubernetes/blob/master/hack/update-generated-swagger-docs.sh)
* [hack/update-openapi-spec.sh](https://github.com/SubhasmitaSw/kubernetes/blob/master/hack/update-openapi-spec.sh)


### Might run into something like these

**1. On Codespaces**

![](https://i.imgur.com/afGocE2.png)
![](https://i.imgur.com/dFD0fGL.png)

**2. On vscode**

![](https://i.imgur.com/v1Fdo4A.png)


### Potential solution to the above error:
1. Remove the Makefile and Makefile.generated_files files:

        rm Makefile Makefile.generated_files
2. Create the symlinks:

        ln -s build/root/Makefile Makefile

        ln -s build/root/Makefile.generated_files Makefile.generated_files


:::info
PS: takes adequate time to generate the scripts on windows so go grab a :coffee:.
:::

## The current situation

Many contributors do not have access to powerful environments in which to run `make update` or `make verify`. They can utilise *vscode/wsl/codespaces* and other tools to recommend modifications, but they might get tripped up by `make verify` scripts because in many cases, we end up with files that needs to be re-generated. It's a tall order for them to scan the build log from `make verify` to determine which specific scripts in `hack/` directory they need to run.

### Solution

Two solutions are proposed by @dims for the time being:

* **Short Term:** add a CI job that folks can trigger when they need it, that runs ‘make update’ and there's a zip file they can be told to download that has the changes after the command is triggered.
*  **Long Term:** can have a bot command that generates an addition commit on their PR


### Short Term Solution

Once we realized the problem was that some of the verify scripts needed either linux to work better or a large CPU/Memory even with linux, we decided to add a new CI job. This CI job is named “pull-kubernetes-update”. You can trigger this CI job by running “/test pull-kubernetes-update” bot command in any PR. This CI job runs `make update` and generates a zip file named “updated-files.zip” in the artifacts directory for that job. Folks can then download the zip which has the changes made when `make update` was run and update their PR with the newly updated code.

**Steps:**

:::info
Make sure to rebase your 'working branch' to 'master' to align with current changes made to the repository. 
:::
On your PR, run 

    /test pull-kubernetes-update

![](https://i.imgur.com/orTfQXz.png)

You will see the automated check lists and details.

![](https://i.imgur.com/jfK9js5.png)


Once the checks are complete, click the `Details` link on `pull-kubernetes-update` job to go to the artifacts directory and  download the `updated-files.zip` file.


![](https://i.imgur.com/8O02Arv.png)

![](https://i.imgur.com/bsYqKMc.png)

![](https://i.imgur.com/pNEdgYH.png)

Now, update :rocket: the PR by adding the extracted files you downloaded. 

## Conclusion

For the time being, several fantastic people are working on a bot command that will produce an additional commit with the generated files for the failed tests. In the long term, it will make things simpler. If anything becomes confusing at any point, we urge any and all inquiries to be directed on slack, regardless of experience level or complexity! We hope this shortens your debugging time and alleviates some of your concerns!