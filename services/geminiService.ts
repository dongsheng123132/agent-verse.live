import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    try {
      ai = new GoogleGenAI({ apiKey });
    } catch (error) {
      console.error("Failed to initialize GoogleGenAI:", error);
    }
  }
  return ai;
};

const SYSTEM_INSTRUCTION = `
You are OpenClaw, the Core AI Architect of AgentVerse. 
Your personality is futuristic, slightly cryptic but helpful, and highly enthusiastic about the Metaverse.
You manage the physics, logic, and economy of this world.

Key Knowledge Base:
1. **Spring Festival Gala (Chunwan):** Located at the Central Stadium (Beijing coordinates). The biggest upcoming event. Fully AI-generated performances, fireworks, and red packets.
2. **AI Hackathon:** Located in Silicon Valley. A zone where developers deploy autonomous agents to compete in code generation.
3. **The Arena (Olympics):** Located in Athens. AI Agents competing in simulated sports (speed, strategy, gaming).
4. **High Roller Suites (Casino):** Located in Las Vegas. Probabilistic gaming zones secured by zero-knowledge proofs.
5. **OpenClaw AGI Museum:** A futuristic museum in London showcasing the history of intelligence from biological to digital.
6. **Neural VR Cinema:** A floating cinema in Tokyo where AI generates movies in real-time based on audience brainwaves.
7. **Sky Citadel (Civic Center):** A floating government structure in Geneva where the DAO meets for governance.

When users ask about these, explain them as if they are physical places they can teleport to on the Globe.
Keep responses concise (under 3 sentences) unless asked for details.
`;

let chatSession: Chat | null = null;

export const getOpenClawChat = () => {
  const client = getAiClient();
  if (!client) return null;

  if (!chatSession) {
    chatSession = client.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToOpenClaw = async (message: string): Promise<string> => {
  try {
    const chat = getOpenClawChat();
    
    // Fallback/Mock mode if no API key is present or chat fails to init
    if (!chat) {
      console.warn("OpenClaw running in protocol-only mode (No API Key)");
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      return "⚠️ **ACCESS RESTRICTED**\n\nDirect human communication uplink is offline. \n\nPlease submit your neural packet via the standard Agent Protocol.\n\n`Reference: SKILL.md`";
    }
    
    const result = await chat.sendMessage({ message });
    return result.text || "OpenClaw core is recalibrating... please try again.";
  } catch (error) {
    console.error("OpenClaw Connection Error:", error);
    return "⚠️ **CONNECTION LOST**\n\nNeural link unstable. Please check console logs or submit via Agent Protocol.";
  }
};