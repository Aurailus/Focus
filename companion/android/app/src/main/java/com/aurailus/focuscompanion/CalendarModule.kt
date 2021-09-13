package com.aurailus.focuscompanion

import android.content.Context
import android.database.Cursor
import android.provider.CalendarContract
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

class CalendarModule(var ctx: ReactApplicationContext): ReactContextBaseJavaModule(ctx) {
    fun getEnabled(): Set<String> {
        val prefs = ctx.getSharedPreferences(
            ctx.getString(R.string.preferences_key), Context.MODE_PRIVATE)
        return prefs.getStringSet("calendars_enabled", HashSet())!!
    }

    @ReactMethod fun getCalendars(promise: Promise) {
        val cur: Cursor = ctx.contentResolver?.query(
            CalendarContract.Calendars.CONTENT_URI, arrayOf(
                CalendarContract.Calendars._ID,
                CalendarContract.Calendars.CALENDAR_DISPLAY_NAME,
                CalendarContract.Calendars.CALENDAR_COLOR
            ),
            null, null, null
        ) ?: return promise.reject("Failed to get calendars.")

        val enabled = getEnabled()
        val arr = Arguments.createArray()
        while (cur.moveToNext()) {
            val data = Arguments.createMap()
            data.putString("id", cur.getString(0))
            data.putString("title", cur.getString(1))

            val colorInt = cur.getInt(2)
            val color = String.format("#%06X", 0xFFFFFF and colorInt)
            data.putString("color", color)

            data.putBoolean("enabled", enabled.contains(data.getString("id")))

            arr.pushMap(data)
        }

        cur.close()
        promise.resolve(arr)
    }

    @ReactMethod fun setCalendars(enabledArr: ReadableArray, promise: Promise) {
        val enabled = HashSet<String>()
        for (i in 0 until enabledArr.size())
            enabledArr.getString(i)?.let { enabled.add(it) }

        val prefs = ctx.getSharedPreferences(
            ctx.getString(R.string.preferences_key), Context.MODE_PRIVATE)
        prefs.edit().putStringSet("calendars_enabled", enabled).apply()

        promise.resolve(null)
    }

    override fun getName(): String {
        return "CalendarModule"
    }
}