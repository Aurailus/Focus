package com.aurailus.focuscompanion

import android.content.Intent
import android.content.res.Configuration
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView
import expo.modules.splashscreen.SplashScreenImageResizeMode
import expo.modules.splashscreen.singletons.SplashScreen.show

class MainActivity : ReactActivity() {
    // Added automatically by Expo Config
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        val intent = Intent("onConfigurationChanged")
        intent.putExtra("newConfig", newConfig)
        sendBroadcast(intent)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        // Set the theme to AppTheme BEFORE onCreate to support
        // coloring the background, status bar, and navigation bar.
        // This is required for expo-splash-screen.
//        setTheme(R.style.AppTheme)
        super.onCreate(null)
        // @generated begin expo-splash-screen-mainActivity-onCreate-show-splash - expo prebuild (DO NOT MODIFY) sync-8915a20732e7fda227585f9b6ef0d38bef4fbbbe
        show(this, SplashScreenImageResizeMode.CONTAIN, ReactRootView::class.java, false)
        // @generated end expo-splash-screen-mainActivity-onCreate-show-splash
        // SplashScreen.show(...) has to be called after super.onCreate(...)
        // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, "main") {
            override fun createRootView(): ReactRootView {
                return RNGestureHandlerEnabledRootView(this@MainActivity)
            }
        }
    }
}