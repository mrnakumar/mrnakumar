---
title: "Mock private static method of a java class using PowerMock"
date: "2020-04-03"
---

In java, PowerMock library allows us to mock private static methods.
I have created a small example to demo this.

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

###code
We want to test method `rateMyCountry` of class `CountryRating`. As we can see, this method uses a `private static method`. We want to mock this static priavte method `isPresidentDumb`.


```
public class CountryRating {
    public int rateMyCountry(String countryCode,UnitedNationsEfficiency uns) {
        if (isPresidentDumb(countryCode,uns)) {
            return 5;
        }
        return 10;
    }

    private static boolean isPresidentDumb(String countryCode, UnitedNationsEfficiency uns) {
        return false;
    }
}

public class UnitedNationsEfficiency{

}
```

Test code is as given below:


```
import org.mockito.Mock;
import org.mockito.ArgumentMatchers;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.testng.PowerMockTestCase;
import org.testng.annotations.Test;

import static org.fest.assertions.api.Assertions.assertThat;

@Test
@PrepareForTest({CountryRating.class})
public class CountryRatingTest extends PowerMockTestCase {
    @Mock
    private UnitedNationsEfficiency uns;

    private final CountryRating objectUnderTest = new CountryRating();

    public void testRateMyCountry() throws Exception {
        PowerMockito.spy(CountryRating.class);
        PowerMockito.doReturn(true).when(CountryRating.class, "isPresidentDumb",ArgumentMatchers.startsWith("IN"),ArgumentMatchers.refEq(uns));
        assertThat(objectUnderTest.rateMyCountry("IN",uns)).isEqualTo(5);
    }
}
```

Important things to observe in the test code above:
1. `@PrepareForTest({CountryRating.class})` for the class(`CountryRating` here) containing the static private method that we want to mock.
2. `PowerMockito.spy(CountryRating.class)`  for the class containing the static private method that we want to mock
3. `PowerMockito.doReturn(true).when(CountryRating.class, "isPresidentDumb", ArgumentMatchers.startsWith("IN"),ArgumentMatchers.refEq(uns))`, configure the private static method mock. We can see that since the static method `isPresidentDumb` is private and can not be accessed from the test code, it's name is passed as `string`. 


Thanks for reading!