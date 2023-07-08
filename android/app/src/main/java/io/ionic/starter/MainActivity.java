package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;
import com.htut.filewriter.FileWriterPlugin;


public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(FileWriterPlugin.class);
    super.onCreate(savedInstanceState);

    // Initializes the Bridg
      // Additional plugins you've installed go here
      // Ex: add(com.getcapacitor.community.fcm.FCMPlugin.class);
      

  }
}
