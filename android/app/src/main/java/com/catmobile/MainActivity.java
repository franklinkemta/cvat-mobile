package com.catmobile;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate; // Gesture handler
import com.facebook.react.ReactRootView; // Gesture handler
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView; // Gesture handler

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "CATMobile";
  }

  // Gesture handler
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {       
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}
