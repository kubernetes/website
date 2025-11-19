---
title: " 容器世界現狀，2016 年 1 月 "
date: 2016-02-01
slug: state-of-container-world-january-2016
---
<!--
title: " State of the Container World, January 2016 "
date: 2016-02-01
slug: state-of-container-world-january-2016
url: /blog/2016/02/State-Of-Container-World-January-2016
-->

<!--
At the start of the new year, we sent out a survey to gauge the state of the container world. We’re ready to send the [February edition](https://docs.google.com/forms/d/13yxxBqb5igUhwrrnDExLzZPjREiCnSs-AH-y4SSZ-5c/viewform), but before we do, let’s take a look at the January data from the 119 responses (thank you for participating!).  
-->
新年伊始，我們進行了一項調查，以評估容器世界的現狀。
我們已經準備好發送[ 2 月版](https://docs.google.com/forms/d/13yxxBqb5igUhwrrnDExLzZPjREiCnSs-AH-y4SSZ-5c/viewform)但在此之前，讓我們從 119 條回覆中看一下 1 月的數據（感謝您的參與！）。

<!--
A note about these numbers: First, you may notice that the numbers don’t add up to 100%, the choices were not exclusive in most cases and so percentages given are the percentage of all respondents who selected a particular choice. Second, while we attempted to reach a broad cross-section of the cloud community, the survey was initially sent out via Twitter to followers of [@brendandburns](https://twitter.com/brendandburns), [@kelseyhightower](https://twitter.com/kelseyhightower), [@sarahnovotny](https://twitter.com/sarahnovotny), [@juliaferraioli](https://twitter.com/juliaferraioli), [@thagomizer\_rb](https://twitter.com/thagomizer_rb), so the audience is likely not a perfect cross-section. We’re working to broaden our sample size (have I mentioned our February survey? [Come take it now](https://docs.google.com/forms/d/13yxxBqb5igUhwrrnDExLzZPjREiCnSs-AH-y4SSZ-5c/viewform)).
-->
關於這些數字的註釋：
首先，您可能會注意到，這些數字加起來並不是 100％，在大多數情況下，選擇不是唯一的，因此給出的百分比是選擇特定選擇的所有受訪者的百分比。
其次，雖然我們嘗試覆蓋廣泛的雲社區，但調查最初是通過 Twitter 發送給[@brendandburns](https://twitter.com/brendandburns)，[@kelseyhightower](https://twitter.com/kelseyhightower)，[@sarahnovotny](https://twitter.com/sarahnovotny)，[@juliaferraioli](https://twitter.com/juliaferraioli)，[@thagomizer\_rb](https://twitter.com/thagomizer_rb)，因此受衆覆蓋可能並不完美。
我們正在努力擴大樣本數量（我是否提到過2月份的調查？[點擊立即參加](https://docs.google.com/forms/d/13yxxBqb5igUhwrrnDExLzZPjREiCnSs-AH-y4SSZ-5c/viewform))。

<!--
#### Now, without further ado, the data:
-->
#### 言歸正傳，來談談數據：
<!--
First off, lots of you are using containers! 71% are currently using containers, while 24% of you are considering using them soon. Obviously this indicates a somewhat biased sample set. Numbers for container usage in the broader community vary, but are definitely lower than 71%. &nbsp;Consequently, take all of the rest of these numbers with a grain of salt.  
-->
首先，很多人正在使用容器！目前有 71％ 的人正在使用容器，而其中有 24％ 的人正在考慮儘快使用它們。
顯然，這表明樣本集有些偏頗。
在更廣泛的社區中，容器使用的數量有所不同，但絕對低於 71％。
因此，對這些數字的其餘部分要持懷疑態度。

<!--
So what are folks using containers for? More than 80% of respondents are using containers for development, while only 50% are using containers for production. But you plan to move to production soon, as 78% of container users said that you were planning on moving to production sometime soon.  
-->
那麼人們在使用容器做什麼呢？
超過 80％ 的受訪者使用容器進行開發，但只有 50％ 的人在生產環境下使用容器。
但是他們有計劃很快投入到生產環境之中，78% 的容器用戶表示了意願。

<!--
Where do you deploy containers? Your laptop was the clear winner here, with 53% of folks deploying to laptops. Next up was 44% of people running on their own VMs (Vagrant? OpenStack? we’ll try dive into this in the February survey), followed by 33% of folks running on physical infrastructure, and 31% on public cloud VMs.  
-->
你們在哪裏部署容器？
你的筆記本電腦顯然是贏家，53% 的人使用筆記本電腦。
接下來是 44％ 的人在自己的 VM 上運行（Vagrant？OpenStack？我們將在2月的調查中嘗試深入研究），然後是 33％ 的人在物理基礎架構上運行，而 31％ 的人在公共雲 VM 上運行。

<!--
And how are you deploying containers? 54% of you are using Kubernetes, awesome to see, though likely somewhat biased by the sample set (see the notes above), possibly more surprising, 45% of you are using shell scripts. Is it because of the extensive (and awesome) Bash scripting going on in the Kubernetes repository? Go on, you can tell me the truth… &nbsp;Rounding out the numbers, 25% are using CAPS (Chef/Ansible/Puppet/Salt) systems, and roughly 13% are using Docker Swarm, Mesos or other systems.  
-->
如何部署容器？
你們當中有 54% 的人使用 Kubernetes，雖然看起來有點受樣本集的偏見（請參閱上面的註釋），但真是令人驚訝，但有 45％ 的人在使用 shell 腳本。
是因爲 Kubernetes 存儲庫中正在運行大量（且很好）的 Bash 腳本嗎？
繼續下去，我們可以看到真相……
數據顯示，25% 使用 CAPS (Chef/Ansible/Puppet/Salt)系統，約 13% 使用 Docker Swarm、Mesos 或其他系統。

<!--
Finally, we asked people for free-text answers about the challenges of working with containers. Some of the most interesting answers are grouped and reproduced here:  
-->
最後，我們讓人們自由回答使用容器的挑戰。
這兒有一些進行了分組和複製的最有趣的答案：

<!--
###### Development Complexity
-->
###### 開發複雜性

<!--
- “Silo'd development environments / workflows can be fragmented, ease of access to tools like logs is available when debugging containers but not intuitive at times, massive amounts of knowledge is required to grasp the whole infrastructure stack and best practices from say deploying / updating kubernetes, to underlying networking etc.”
- “Migrating developer workflow. People uninitiated with containers, volumes, etc just want to work.”
-->
- “孤立的開發環境/工作流程可能是零散的，調試容器時可以輕鬆訪問日誌等工具，但有時卻不太直觀，需要大量知識來掌握整個基礎架構堆棧和部署/ 更新 kubernetes，到底層網絡等。”
- “遷移開發者的工作流程。 那些不熟悉容器、卷等的人只是想工作。”

<!--
###### Security
-->
###### 安全

<!--
- “Network Security”
- “Secrets”
-->
- “網絡安全”
- “Secrets”

<!--
###### Immaturity
-->
###### 不成熟

<!--
- “Lack of a comprehensive non-proprietary standard (i.e. non-Docker) like e.g runC / OCI”
- “Still early stage with few tools and many missing features.”
- “Poor CI support, a lot of tooling still in very early days.”
- "We've never done it that way before."
-->
- “缺乏全面的非專有標準（例如，非 Docker），例如 runC / OCI”
- “仍處於早期階段，只有很少的工具和許多缺少的功能。”
- “糟糕的 CI 支持，很多工具仍然處於非常早期的階段。”
- "我們以前從未那樣做過。"

<!--
###### Complexity
-->
###### 複雜性

<!--
- “Networking support, providing ip per pod on bare metal for kubernetes”
- “Clustering is still too hard”
- “Setting up Mesos and Kubernetes too damn complicated!!”
-->
- “網絡支持， 爲 kubernetes 在裸機上爲每個 Pod 提供 IP”
- “集羣化還是太難了”
- “設置 Mesos 和 Kubernetes 太複雜了！！”

<!--
###### Data
-->
###### 數據

<!--
- “Lack of flexibility of volumes (which is the same problem with VMs, physical hardware, etc)”
- “Persistency”
- “Storage”
- “Persistent Data”
-->
- “卷缺乏靈活性（與 VM，物理硬件等相同的問題）”
- “堅持不懈”
- “存儲”
- “永久數據”

<!--
_Download the full survey results [here](https://docs.google.com/spreadsheets/d/18wZe7wEDvRuT78CEifs13maXoSGem_hJvbOSmsuJtkA/pub?gid=530616014&single=true&output=csv) (CSV file)._ 
-->
_下載完整的調查結果 [鏈接](https://docs.google.com/spreadsheets/d/18wZe7wEDvRuT78CEifs13maXoSGem_hJvbOSmsuJtkA/pub?gid=530616014&single=true&output=csv) (CSV 文件）。_  

<!--
_Up-- Brendan Burns, Software Engineer, Google  
-->
_Up-- Brendan Burns，Google 軟件工程師
