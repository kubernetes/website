---
title: " State of the Container World, January 2016 "
date: 2016-02-01
slug: state-of-container-world-january-2016
url: /blog/2016/02/State-Of-Container-World-January-2016
author: >
   Brendan Burns (Google)
---
At the start of the new year, we sent out a survey to gauge the state of the container world. We’re ready to send the [February edition](https://docs.google.com/forms/d/13yxxBqb5igUhwrrnDExLzZPjREiCnSs-AH-y4SSZ-5c/viewform), but before we do, let’s take a look at the January data from the 119 responses (thank you for participating!).  

A note about these numbers: First, you may notice that the numbers don’t add up to 100%, the choices were not exclusive in most cases and so percentages given are the percentage of all respondents who selected a particular choice. Second, while we attempted to reach a broad cross-section of the cloud community, the survey was initially sent out via Twitter to followers of [@brendandburns](https://twitter.com/brendandburns), [@kelseyhightower](https://twitter.com/kelseyhightower), [@sarahnovotny](https://twitter.com/sarahnovotny), [@juliaferraioli](https://twitter.com/juliaferraioli), [@thagomizer\_rb](https://twitter.com/thagomizer_rb), so the audience is likely not a perfect cross-section. We’re working to broaden our sample size (have I mentioned our February survey? [Come take it now](https://docs.google.com/forms/d/13yxxBqb5igUhwrrnDExLzZPjREiCnSs-AH-y4SSZ-5c/viewform)).

#### Now, without further ado, the data:
First off, lots of you are using containers! 71% are currently using containers, while 24% of you are considering using them soon. Obviously this indicates a somewhat biased sample set. Numbers for container usage in the broader community vary, but are definitely lower than 71%. &nbsp;Consequently, take all of the rest of these numbers with a grain of salt.  

So what are folks using containers for? More than 80% of respondents are using containers for development, while only 50% are using containers for production. But you plan to move to production soon, as 78% of container users said that you were planning on moving to production sometime soon.  

Where do you deploy containers? Your laptop was the clear winner here, with 53% of folks deploying to laptops. Next up was 44% of people running on their own VMs (Vagrant? OpenStack? we’ll try dive into this in the February survey), followed by 33% of folks running on physical infrastructure, and 31% on public cloud VMs.  

And how are you deploying containers? 54% of you are using Kubernetes, awesome to see, though likely somewhat biased by the sample set (see the notes above), possibly more surprising, 45% of you are using shell scripts. Is it because of the extensive (and awesome) Bash scripting going on in the Kubernetes repository? Go on, you can tell me the truth… &nbsp;Rounding out the numbers, 25% are using CAPS (Chef/Ansible/Puppet/Salt) systems, and roughly 13% are using Docker Swarm, Mesos or other systems.  

Finally, we asked people for free-text answers about the challenges of working with containers. Some of the most interesting answers are grouped and reproduced here:  


###### Development Complexity

- “Silo'd development environments / workflows can be fragmented, ease of access to tools like logs is available when debugging containers but not intuitive at times, massive amounts of knowledge is required to grasp the whole infrastructure stack and best practices from say deploying / updating kubernetes, to underlying networking etc.”
- “Migrating developer workflow. People uninitiated with containers, volumes, etc just want to work.”


###### Security

- “Network Security”
- “Secrets”


###### Immaturity

- “Lack of a comprehensive non-proprietary standard (i.e. non-Docker) like e.g runC / OCI”
- “Still early stage with few tools and many missing features.”
- “Poor CI support, a lot of tooling still in very early days.”
- "We've never done it that way before."


###### Complexity

- “Networking support, providing ip per pod on bare metal for kubernetes”
- “Clustering is still too hard”
- “Setting up Mesos and Kubernetes too damn complicated!!”

###### Data

- “Lack of flexibility of volumes (which is the same problem with VMs, physical hardware, etc)”
- “Persistency”
- “Storage”
- “Persistent Data”

_Download the full survey results [here](https://docs.google.com/spreadsheets/d/18wZe7wEDvRuT78CEifs13maXoSGem_hJvbOSmsuJtkA/pub?gid=530616014&single=true&output=csv) (CSV file)._ 
