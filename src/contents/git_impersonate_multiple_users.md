---
title: "Multi user impersonatioin for git over ssh"
date: "2019-11-24"
---

Recently I had to check on Gerrit. Gerrit is a review tool which works on top of git vcs. I was required to manufacture a merge conflict and then resolve it to understand the Gerrit review cycle. To be able to have two users trying to push conflicting changes, I had to have two users but I had only one computer with one user account on it. This blog post is about how I interacted with git as two different users from same terminal over ssh. 

### Configuring SSH
Since I was interacting with git over the ssh instead of http, I had to configure ssh. 

#### Creating users on Gerrit
Creating users on Gerrit is simple when Gerrit is running on your localhost. I just downloaded the Gerrit source and built it using Bazel since the Gerrit uses Bazel as build tool instead of Maven or Gradle. The only problem I faced in building Gerrit was the lack of sufficient memory available on my computer. I just had to close some unwanted applications on my computer to free up some memory, retried the bazel build and the build went successfull resuling in a .war file in bazel output directory. I created two users as shown below from the Gerrit UI running on localhost from the newly built war file:
    1. username: x , email:x@x.com
    2. username: y , email:y@y.com

#### Cloning the source( Not necessarily Gerrit, can be anything you want to make changes to)
I created two directory on my ubuntu 18.04 box meant for the workspace of two different users:

```bash
cd code
mkdir user_x
mkdir user_y
```
Then I cloned the source code(not Gerrit source code but some other project but any repositry is okay including Gerrit) in each of these directories.
```bash
cd user_x
git clone ssh://localhost:29418/project.git
git remote add a one:project.git
git config user.name x
git config user.email x@x.com

cd ../user_y
git clone ssh://localhost:29418/project.git
git remote add b two:project.git
git config user.name y
git config user.email y@y.com
```
In the above code snippet, I cloned  a repository in two different directories and configured the git remote and git user in both. Interesting thing is in git remote add command where I have provided an alias for hostname, for example user x has alias **one** for remote host and when this user pushes to remote **a** the ssh will try to push to host **one** which is an alias for **ssh://localhost:29418/project.git**. The reason we did not include the hostname and port number in git remote add is because we will configure these in ~/.ssh/config file so that the username and hostname and port will be picked from that config file. That is why I had only **project.git** without hostname and port number, if you try to include all these things you will get error anyways. Also you can choose remote name anything you want, you don't have to stick to **a** here. The interaction is decided by hostname alias. Different users will be used for different aliases. 

### Configure SSH for multple users
This is how my ~/.ssh/config file looks:

```txt
Host one
  HostName localhost
  User x
  IdentityFile /home/fakegandhi/.ssh/gerrit/u_x/id_rsa
  IdentitiesOnly yes
  Port 29418

Host two
  HostName localhost
  User y
  IdentityFile /home/fakegandhi/.ssh/gerrit/u_y/id_rsa
  IdentitiesOnly yes
  Port 29418
```

In the above file, interesting thing is the **Host** header, these headers match the hostname alias given in git remote add command. Also in each subsection we have HostName, port from git remote add, that is why we did not have to put these details in git remote add. When user x says   ```git push a```  then  atutomatically ssh inserts the hostname, port and username from this config. How does the ssh knows where to look, under Host one or two? This is where alias given in git remote add command comes handy, origin name **a** is mapped to alias **one** and that's why the hostname,port, user all these details are taken from config under Host **a**.

Of course, I had to generate ssh keys and put those in correct folders matching the config IdentityFile. 
I generated the user specific ssh keys as shown below:


```bash
ssh-keygen -t rsa -b 4096 -C "x@x.com" -f /home/fakegandhi/.ssh/gerrit/u_x/id_rsa
```

###Summary
It is possible to talk to same repoisotry as two different users by configuring ssh. Changes are required in ~/.ssh/config file and the way you add the git remote. Just add an alias for the remote host and create corresponding entries in ~/.ssh/config file. 


Thanks for reading.