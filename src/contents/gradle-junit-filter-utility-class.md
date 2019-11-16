---
title: "Ignore utility class in junit 4 with gradle"
date: "2019-11-16"
---

Writing unit test is a necessary and important part of software development in java. Junit is one of the popular unit test framework. Many times, for code reusability,  you want to create a utility class with methods which are used from many test classes. Junit 4.12 will not allow you to do this. Junit 4.12 throws exception upon running **./gradlew test** because it does not expect a class with zero test methods, which means every class in test folder has to be a test class and must have at least one method annotated with **@Test** annotation which means you can not have a utility class in test folder. 

### How to solve the above problem?
One of the solutions is to make changes in build.gradle and filter utility classes out from test. 
Below given code snippet is how you can do this:

```groovy
test {
    filter {
        includeTestsMatching "*Test"
        includeTestsMatching "*IT"
    }
}
```
Above filter will make sure that only classes with name ending with **Test** and **IT** will be considered as test classes and will be run by junit. Rest of the classes in test folder will be ignored, excactly what we wanted. Of course, you have to make sure that your utility class name does not match the pattern given in filter above.

Thanks for reading.