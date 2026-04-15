package com.bot.model;

import java.io.Serializable;

public class LlmTask implements Serializable {
    private String id;
    private String systemInstruction;
    private String userPrompt;
    private String responseMimeType;

    public LlmTask() {}

    public LlmTask(String id, String systemInstruction, String userPrompt, String responseMimeType) {
        this.id = id;
        this.systemInstruction = systemInstruction;
        this.userPrompt = userPrompt;
        this.responseMimeType = responseMimeType;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSystemInstruction() { return systemInstruction; }
    public void setSystemInstruction(String systemInstruction) { this.systemInstruction = systemInstruction; }
    public String getUserPrompt() { return userPrompt; }
    public void setUserPrompt(String userPrompt) { this.userPrompt = userPrompt; }
    public String getResponseMimeType() { return responseMimeType; }
    public void setResponseMimeType(String responseMimeType) { this.responseMimeType = responseMimeType; }
}
