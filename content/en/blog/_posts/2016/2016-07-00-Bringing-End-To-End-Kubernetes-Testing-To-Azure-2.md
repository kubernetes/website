---
title: " Bringing End-to-End Kubernetes Testing to Azure (Part 2) "
date: 2016-07-18
slug: bringing-end-to-end-kubernetes-testing-to-azure-2
url: /blog/2016/07/Bringing-End-To-End-Kubernetes-Testing-To-Azure-2
author: >
  Travis Newhouse (AppFormix)
---

Historically, Kubernetes testing has been hosted by Google, running e2e tests on [Google Compute Engine](https://cloud.google.com/compute/) (GCE) and [Google Container Engine](https://cloud.google.com/container-engine/) (GKE). In fact, the gating checks for the submit-queue are a subset of tests executed on these test platforms. Federated testing aims to expand test coverage by enabling organizations to host test jobs for a variety of platforms and contribute test results to benefit the Kubernetes project. Members of the Kubernetes test team at Google and SIG-Testing have created a [Kubernetes test history dashboard](http://storage.googleapis.com/kubernetes-test-history/static/index.html) that publishes the results from all federated test jobs (including those hosted by Google).  

In this blog post, we describe extending the e2e test jobs for Azure, and show how to contribute a federated test to the Kubernetes project.  

**END-TO-END INTEGRATION TESTS FOR AZURE**  

After successfully implementing [“development distro” scripts to automate deployment of Kubernetes on Azure](https://kubernetes.io/blog/2016/06/bringing-end-to-end-testing-to-azure), our next goal was to run e2e integration tests and share the results with the Kubernetes community.  

We automated our workflow for executing e2e tests of Kubernetes on Azure by defining a nightly job in our private Jenkins server. Figure 2 shows the workflow that uses kube-up.sh to deploy Kubernetes on Ubuntu virtual machines running in Azure, then executes the e2e tests. On completion of the tests, the job uploads the test results and logs to a Google Cloud Storage directory, in a format that can be processed by the [scripts that produce the test history dashboard](https://github.com/kubernetes/test-infra/tree/master/jenkins/test-history). Our Jenkins job uses the hack/jenkins/e2e-runner.sh and hack/jenkins/upload-to-gcs.sh scripts to produce the results in the correct format.  


| ![Kubernetes on Azure - Flow Chart - New Page.png](https://lh6.googleusercontent.com/TZiUu4sQ7G0XDvJgv9a1a4UEdxntOZDT9I3S42c8BOAyigxaysKmhJMen8vLaJ3UYaYKPIG9h-cyBOvTSI6kBgqnUQabe4xxZXhrUyVKGEaCDUnmNlBo__HNjzoYc_U7zM77_Dxe) |
| Figure 2 - Nightly test job workflow |


**HOW TO CONTRIBUTE AN E2E TEST**    

Throughout our work to create the Azure e2e test job, we have collaborated with members of [SIG-Testing](https://github.com/kubernetes/community/tree/master/sig-testing) to find a way to publish the results to the Kubernetes community. The results of this collaboration are documentation and a streamlined process to contribute results from a federated test job. The steps to contribute e2e test results can be summarized in 4 steps.  


1. Create a [Google Cloud Storage](https://cloud.google.com/storage/) bucket in which to publish the results.
2. Define an automated job to run the e2e tests. By setting a few environment variables, hack/jenkins/e2e-runner.sh deploys Kubernetes binaries and executes the tests.
3. Upload the results using hack/jenkins/upload-to-gcs.sh.
4. Incorporate the results into the test history dashboard by submitting a pull-request with modifications to a few files in [kubernetes/test-infra](https://github.com/kubernetes/test-infra).

The federated tests documentation describes these steps in more detail. The scripts to run e2e tests and upload results simplifies the work to contribute a new federated test job. The specific steps to set up an automated test job and an appropriate environment in which to deploy Kubernetes are left to the reader’s preferences. For organizations using Jenkins, the jenkins-job-builder configurations for GCE and GKE tests may provide helpful examples.  

**RETROSPECTIVE**  

The e2e tests on Azure have been running for several weeks now. During this period, we have found two issues in Kubernetes. Weixu Zhuang immediately published fixes that have been merged into the Kubernetes master branch.  

The first issue happened when we wanted to bring up the Kubernetes cluster using SaltStack on Azure using Ubuntu VMs. A commit (07d7cfd3) modified the OpenVPN certificate generation script to use a variable that was only initialized by scripts in the cluster/ubuntu. Strict checking on existence of parameters by the certificate generation script caused other platforms that use the script to fail (e.g. our changes to support Azure). We submitted a [pull-request that fixed the issue](https://github.com/kubernetes/kubernetes/pull/21357) by initializing the variable with a default value to make the certificate generation scripts more robust across all platform types.  

The second [pull-request cleaned up an unused import](https://github.com/kubernetes/kubernetes/pull/22321) in the Daemonset unit test file. The import statement broke the unit tests with golang 1.4. Our nightly Jenkins job helped us find this error and we promptly pushed a fix for it.  

**CONCLUSION AND FUTURE WORK**  

The addition of a nightly e2e test job for Kubernetes on Azure has helped to define the process to contribute a federated test to the Kubernetes project. During the course of the work, we also saw the immediate benefit of expanding test coverage to more platforms when our Azure test job identified compatibility issues.  

We want to thank Aaron Crickenberger, Erick Fejta, Joe Finney, and Ryan Hutchinson for their help to incorporate the results of our Azure e2e tests into the Kubernetes test history. If you’d like to get involved with testing to create a stable, high quality releases of Kubernetes, join us in the [Kubernetes Testing SIG (sig-testing)](https://github.com/kubernetes/community/tree/master/sig-testing).
