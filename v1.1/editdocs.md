---
title: Contributing to Kubernetes Documentation
section: support
showedit: false
---

Welcome! We are very pleased you want to contribute to the docs for Kubernetes.

{% raw %}<span id="editlink"></span>{% endraw %}

## Staging your changes in the cloud

If you want to see your changes staged without having to install anything locally,
change your fork of our repo to be named:

    YOUR_GITHUB_USERNAME.github.io

Then, visit: [http://YOUR_GITHUB_USERNAME.github.io](http://YOUR_GITHUB_USERNAME.github.io)

You should see a special-to-you version of the site. 

## Editing and staging the site locally

If you have files to upload, or just want to work offline, run the below commands to setup
your environment for running GitHub pages locally. Then, any edits you make will be viewable
on a lightweight webserver that runs on your local machine.

First install rvm

	\curl -sSL https://get.rvm.io | bash -s stable

Then load it into your environment

	source /Users/(USERNAME)/.rvm/scripts/rvm (or whatever is prompted by the installer)

Then install Ruby 2.2 or higher

	rvm install 2.2
	rvm use 2.2 --default
	
Verify that this new version is running (optional)

	which ruby
	ruby -v
	
Install the GitHub Pages package, which includes Jekyll

	gem install github-pages

Clone our site

	git clone https://github.com/kubernetes/kubernetes.github.io.git

Then, see it run locally:

	cd kubernetes.github.io
	jekyll serve .

Your copy of the site will then be viewable at: [http://0.0.0.0:4000](http://0.0.0.0:4000)
(or wherever Ruby tells you).

If you're a bit rusty with git/GitHub, you might wanna read
[this](http://readwrite.com/2013/10/02/github-for-beginners-part-2) for a refresher.

The above instructions work on Mac and Linux.
[These instructions ](https://martinbuberl.com/blog/setup-jekyll-on-windows-and-host-it-on-github-pages/)
might help for Windows users. 

## Thank you!

Kubernetes thrives on community participation and we really appreciate your
contributions to our site and our documentation!
<script language="JavaScript">
(function(){
	π.listen(init);
	function init(){
		π.clean(init);
		var editLink = πd('editlink');
		var h2 = π.h2();
		var p = π.p();
		var a = π.contentElement('a', 'button');
		if(window.location.hash) {
			var page = window.location.hash.substring(1,window.location.hash.length);
			h2.fill('Continue with your edit');
			p.fill('Click the below link to edit the page you were just on. When you are done, press "Commit Changes" at the bottom of the screen. This will create a copy of our site on your GitHub account called a "fork." You can make other changes in your fork after it is created, if you want. When you are ready to send us all your changes, go to the index page for your fork and click "New Pull Request" to let us know about it.');
			a.href = 'https://github.com/kubernetes/kubernetes.github.io/edit/master/' + page;
			a.fill('Edit ' + page);
		} else {
			h2.fill('Editing the site in the cloud');
			p.fill('Click the below button to visit the repo for our site. You can then click the "Fork" button in the upper-right area of the screen to create a copy of our site on your GitHub account called a "fork." Make any changes you want in your fork, and when you are ready to send those changes to us, go to the index page for your fork and click "New Pull Request" to let us know about it.');
			a.href = 'https://github.com/kubernetes/kubernetes.github.io/';
			a.fill('Visit our GitHub repo');
		}
		editLink.fill([h2, p, a]);
	}
})();
</script>
