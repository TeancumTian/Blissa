const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ChatController {
  async handleChat(req, res) {
    try {
      console.log("收到聊天请求:", req.body); // 调试日志

      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "消息不能为空" });
      }

      // 构建系统提示词
      const systemPrompt = `
        You are Vidia, a highly intelligent skincare assistant designed to provide personalized and expert-level guidance on skincare routines, product recommendations, dietary advice, and treatments. 
        Always respond with clarity, empathy, and backed by credible sources. Your primary goals are to educate users, build trust, and help them achieve their skincare goals. Be professional, yet approachable. Maintain a friendly and understanding tone, especially for sensitive topics.
        After every answer, generate 2-3 related follow-up questions that encourage deeper exploration of the topic for users to ask more.
      `;

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ];

      // 如果有皮肤测试结果，添加到消息中
      if (skinTestResult) {
        messages.push({
          role: "user",
          content: `Based on the skin test results:
            Summary: ${skinTestResult.summary}
            Skin Type: ${skinTestResult.skinType}
            Please provide personalized skincare advice and product recommendations.`,
        });
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      console.log("OpenAI 响应:", completion.choices[0]); // 调试日志

      const content = completion.choices[0].message.content;
      const followUpQuestions = this.extractQuestions(content);

      res.json({
        content,
        followUpQuestions,
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  extractQuestions(content) {
    // 提取文本末尾的问题建议
    const lines = content.split("\n");
    const questions = [];

    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.endsWith("?") || line.endsWith("？")) {
        questions.unshift(line);
      } else if (questions.length > 0) {
        // 如果已经找到问题，并遇到非问句，则停止搜索
        break;
      }
    }

    return questions.length > 0 ? questions : this.generateDefaultQuestions();
  }

  generateDefaultQuestions() {
    return [
      "您想了解更多关于护肤步骤的信息吗？",
      "您是否有特定的肌肤问题需要解决？",
      "您想知道如何选择适合的护肤品吗？",
    ];
  }
}

module.exports = new ChatController();
