---
title: " State of the Container World, February 2016 "
date: 2016-03-01
slug: state-of-container-world-february-2016
url: /blog/2016/03/State-Of-Container-World-February-2016
---
Hello, and welcome to the second installment of the Kubernetes state of the container world survey. At the beginning of February we sent out a survey about people’s usage of containers, and wrote about the [results from the January survey](https://kubernetes.io/blog/2016/02/state-of-container-world-january-2016). Here we are again, as before, while we try to reach a large and representative set of respondents, this survey was publicized across the social media account of myself and others on the Kubernetes team, so I expect some pro-container and Kubernetes bias in the data.We continue to try to get as large an audience as possible, and in that vein, please go and take the [March survey](https://docs.google.com/a/google.com/forms/d/1hlOEyjuN4roIbcAAUbDhs7xjNMoM8r-hqtixf6zUsp4/viewform) and share it with your friends and followers everywhere! Without further ado, the numbers...

## Containers continue to gain ground

In January, 71% of respondents were currently using containers, in February, 89% of respondents were currently using containers. The percentage of users not even considering containers also shrank from 4% in January to a surprising 0% in February. Will see if that holds consistent in March.Likewise, the usage of containers continued to march across the dev/canary/prod lifecycle. In all parts of the lifecycle, container usage increased:  


- Development: 80% -\> 88%
- Test: 67% -\> 72%
- Pre production: 41% -\> 55%
- Production: 50% -\> 62%

What is striking in this is that pre-production growth continued, even as workloads were clearly transitioned into true production. Likewise the share of people considering containers for production rose from 78% in January to 82% in February. Again we’ll see if the trend continues into March.

## Container and cluster sizes

We asked some new questions in the survey too, around container and cluster sizes, and there were some interesting numbers:

How many containers are you running?  

 ![Screen Shot 2016-02-29 at 9.27.01 AM.png](https://lh6.googleusercontent.com/Ug0Bzcj6LZ__KYwUsHgMB5MFGnRHhexu6YKPaooShWCCpfYsCiynpod5cTZR_WnQdm4ox3GcHjMuGkfG863C3aiMy-sP-mX2vWJCv5gY3JzjOvCbzIvz0_pNZJSlHieTNWZZRJCv)




























How many machines are you running containers on?



 ![Screen Shot 2016-02-29 at 9.27.15 AM.png](https://lh5.googleusercontent.com/3wek678JBM05-9wllCpRjP0QQHl5qWfAVbW1dA5XqVMtf1JlLm2PW82-rrhOOSs_owGUAXOyG3eC53pd9qPTuedXukqmwC9zDOJoA7xeKeggMp3snapK9q_cWjbLDxrBLIhJHkTK)




























So while container usage continues to grow, the size and scope continues to be quite modest, with more than 50% of users running fewer than 50 containers on fewer than 10 machines.

## Things stay the same

Across the orchestration space, things seemed pretty consistent between January and February (Kubernetes is quite popular with folks (54% -\> 57%), though again, please see the note at the top about the likely bias in our survey population. Shell scripts likewise are also quite popular and holding steady. You all certainly love your Bash (don’t worry, we do too ;)
Likewise people continue to use cloud services both in raw IaaS form (10% on GCE, 30% on EC2, 2% on Azure) as well as cloud container services (16% for GKE, 11% on ECS, 1% on ACS). Though the most popular deployment target by far remains your laptop/desktop at ~53%.  

## Raw data

As always, the complete raw data is available in a spreadsheet [here](https://docs.google.com/spreadsheets/d/126nnv9Q9avxDvC82irJGUDK3UODokILZOQe5X_WB9VQ/edit?usp=sharing).

## Conclusions

Containers continue to gain in popularity and usage. The world of orchestration is somewhat stabilizing, and cloud services continue to be a common place to run containers, though your laptop is even more popular.

And if you are just getting started with containers (or looking to move beyond your laptop) please visit us at [kubernetes.io](http://kubernetes.io/) and [Google Container Engine](https://cloud.google.com/container-engine/). ‘Till next month, please get your friends, relatives and co-workers to take our [March survey](https://docs.google.com/a/google.com/forms/d/1hlOEyjuN4roIbcAAUbDhs7xjNMoM8r-hqtixf6zUsp4/viewform)!  



Thanks!

_-- Brendan Burns, Software Engineer, Google_
