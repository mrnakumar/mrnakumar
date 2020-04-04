---
title: "Mock static method of a java class using PowerMock"
date: "2020-04-03"
---

Recently I had to test a class which was having a call to some static method on some other class. 
I usually keep utility functions as instance methods and then inject the instance, but here I had no choice to do so.
Good thing is that you can still test this using PowerMock library. I have created a small example to show how to mock 
static method on a class.

### pom.xml 
Should have the following dependencies( you can replace the `testing` with `junit` if you're using `junit` instead of `test-ng`).

```
<dependency>
  <groupId>org.testing</groupId>
  <artifactId>testing</artifactId>
  <version>6.14.3</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.mockito</groupId>
  <artifactId>mockito-core</artifactId>
  <version>2.28.2</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.powermock</groupId>
  <artifactId>powermock-module-testing</artifactId>
  <version>2.0.0</version>
  <scope>test</scope>
</dependency>

<dependency>
  <groupId>org.powermock</groupId>
  <artifactId>powermock-api-mockito2</artifactId>
  <version>2.0.0</version>
  <scope>test</scope>
</dependency>
```

### Code

`Korona` is the class that we want to test. We will test its method `deathsSoFar` that uses static method of class `Deaths`.
```
public class Korona {
    public int deathsSoFar(String countryCode) {
        return Deaths.forCountry(countryCode) + 5;
    }
}

public class Deaths {
    public static int forCountry(String countryCode){
        return 0;
    }
}
```


Test class is:
```import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.testng.PowerMockTestCase;
import org.testng.annotations.Test;

import static org.fest.assertions.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@Test
@PrepareForTest({Deaths.class})
public class KoronaTest extends PowerMockTestCase {
    private final Korona objectUnderTest = new Korona();
  public void testDeathsSoFar(){
      PowerMockito.mockStatic(Deaths.class);
      when(Deaths.forCountry("IN")).thenReturn(1000);
      assertThat(objectUnderTest.deathsSoFar("IN")).isEqualTo(1005);
  }
}
```


Important things to observe in class `KoronaTest`:
1. `@PrepareForTest({Deaths.class})` is used for the class containing static method, here that is `Deaths` class
2.  `PowerMockito.mockStatic(Deaths.class)`
3.  `when(Deaths.forCountry("IN")).thenReturn(1000)`, this line configures the static method mock.

NOTE: if this does not work for you, then consider using mockito's `ArgumentMathcers` instead. 
For example: 
`when(Deaths.forCountry("IN")).thenReturn(1000)`
will be re-written as:
`when(Deaths.forCountry(ArgumentMatchers.startsWith("IN"))).thenReturn(1000)`


Thanks for reading!!