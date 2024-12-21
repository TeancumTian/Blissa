const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ChatController {
  async handleChat(req, res) {
    try {
      const { message, skinTestResult } = req.body;

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
      });

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
    const regex = /^\d+\.\s(.*?\?)$/gm;
    const allQuestions = content.match(regex) || [];
    return allQuestions.map((question) => question.replace(/^\d+\.\s/, ""));
  }
}

module.exports = new ChatController();
