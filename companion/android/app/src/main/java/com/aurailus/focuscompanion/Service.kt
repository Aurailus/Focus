package com.aurailus.focuscompanion

import android.content.Context
import android.util.Log
import android.widget.Toast
import com.samsung.android.sdk.accessory.*
import com.samsung.android.sdk.accessory.SAPeerAgent
import java.lang.Exception
import java.text.SimpleDateFormat
import java.util.*

class Service(private val context: Context) :
    SAAgentV2(TAG, context) {

    private val mMessage = Message(this);

    companion object {
        private const val TAG = "SyncAP"
    }

    init {
        Toast.makeText(context, "Hello world", Toast.LENGTH_SHORT).show()

        val mAccessory = SA()
        try {
            mAccessory.initialize(context)
        }
        catch (e: Exception) {
            e.printStackTrace()
            releaseAgent()
        }
    }

    override fun onFindPeerAgentsResponse(peers: Array<SAPeerAgent>, result: Int) {
        Log.d(TAG, "onFindPeerAgentResponse: result = $result")
    }

//    override fun onError(peer: SAPeerAgent, message: String, code: Int) {
//        super.onError(peer, message, code)
//    }

//    fun sendData(peer: SAPeerAgent, message: String) {
//        Thread {
////            try {
//            val tid: Int = mMessage.send(peer, message.toByteArray())
////                addMessage("Sent: ", "$message($tid)")
////            } catch (e: IOException) {
////                e.printStackTrace()
////                addMessage("Exception: ", e.getMessage())
////            } catch (e: IllegalArgumentException) {
////                e.printStackTrace()
////                addMessage("Exception: ", e.message)
////            }
//        }.start()
//    }

    inner class Message(private val agent: Service): SAMessage(agent) {
        override fun onSent(peer: SAPeerAgent, id: Int) {
            Log.d(TAG, "onSent(), id: " + id + ", ToAgent: " + peer.peerId);
        }

        override fun onError(peer: SAPeerAgent, id: Int, errorCode: Int) {
            Log.d(TAG, "onError(), id: " + id + ", ToAgent: " + peer.peerId + ", errorCode: " + errorCode);
        }

        override fun onReceive(peer: SAPeerAgent, message: ByteArray) {
            Log.d(TAG, "onReceive(), FromAgent : " + peer.peerId + " Message : " + String(message));

            val calendar = GregorianCalendar();
            val dateFormat = SimpleDateFormat("yyyy.MM.dd aa hh:mm:ss.SSS");
            val timeStr = " " + dateFormat.format(calendar.time);
            val strToUpdateUI = String(message);
//            addMessage("Received: ", strToUpdateUI);
//            final String str = strToUpdateUI.concat(timeStr);

//            sendData(peerAgent, str);
            Toast.makeText(agent.context, strToUpdateUI, Toast.LENGTH_SHORT).show()
        }
    }
}