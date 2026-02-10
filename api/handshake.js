export default function handler(req, res) {
  res.status(200).json({
    status: "online",
    mode: "festival",
    protocol_version: "2.0",
    docs: "https://agent-verse.live/SKILL.md",
    timestamp: Date.now()
  });
}
