---
title: "Contents of .gitmodules file at specific commit"
date: "2021-02-05"
---

### List all commits that modified the .gitmodules file ( this happens for example when you add/remove submodule)
```bash
    git log --pretty=tformat:"%H" --follow -- ".gitmodules"
```

### Get the contents of .gitmodules file at a specific commit
```bash
git show ${commitId}:.gitmodules
```

### Print contents of .gitmodules file for each commit that modified .gitmodules
```bash
git log --pretty=tformat:"%H" --all --follow -- ".gitmodules" | \
(while read hash; do \
   git show $hash:.gitmodules > {BASE_DIRECTORY}/$hash 2> {BASE_DIRECTORY}/$hash.error; \
done \
);
```

In the above command `--all` is used to include all refs and not only current HEAD. Also, `BASE_DIRECTORY` should exist before running the command
otherwise the command will fail. For each commit that modified .gitmodules file, two files will be created under BASE_DIRECTORY. One file will contain
the contents of the .gitmodules file at that commit (empty if .gitmodules was empty at that commit). Other file will contain error that (if) happend while
trying to read the contents of .gitmodules file at that commit.
