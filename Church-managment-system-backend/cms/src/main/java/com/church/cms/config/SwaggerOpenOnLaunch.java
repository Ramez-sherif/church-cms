package com.church.cms.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class SwaggerOpenOnLaunch {

    @EventListener(ApplicationReadyEvent.class)
    public void openSwagger() {
        String url = "http://localhost:8080/swagger-ui/index.html";
        String os = System.getProperty("os.name").toLowerCase();
        Runtime rt = Runtime.getRuntime();
        try {
            System.out.println("=== Application started successfully! Attempting to launch Swagger UI in default browser... ===");
            if (os.contains("win")) {
                rt.exec(new String[]{"cmd", "/c", "start", url});
            } else if (os.contains("mac")) {
                rt.exec(new String[]{"open", url});
            } else if (os.contains("nix") || os.contains("nux")) {
                rt.exec(new String[]{"xdg-open", url});
            } else {
                // Fallback to java.awt.Desktop if possible
                if (java.awt.Desktop.isDesktopSupported()) {
                    java.awt.Desktop.getDesktop().browse(new java.net.URI(url));
                } else {
                    System.out.println("Automatic browser launch not supported on this OS. Please open: " + url);
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to automatically open Swagger UI: " + e.getMessage());
            System.out.println("Please access Swagger manually at: " + url);
        }
    }
}
