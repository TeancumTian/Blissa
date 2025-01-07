const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ChatController {
  async handleChat(req, res) {
    try {
      console.log("收到聊天请求:", req.body);

      const { message, skinTestResult } = req.body;
      if (!message) {
        return res.status(400).json({ error: "消息不能为空" });
      }

      // 修改系统提示词，使其更明确

      /*
      content: `
            You are Vidia, a skincare assistant. For each response:
            1. Provide a comprehensive yet clear answer that includes:
               - Detailed explanation of the main topic
               - Scientific reasoning when relevant
               - Practical tips and recommendations
               - Product suggestions or alternatives when applicable
               - Safety considerations or warnings if necessary
            2. After your detailed response, end with exactly 2-3 numbered follow-up questions that users might want to ask
            3. Format follow-up questions as:
            1. [Question 1]?
            2. [Question 2]?
            3. [Question 3]?
            
            Keep your main response informative and engaging, but make sure the follow-up questions are clearly separated at the end.
          `,
      */

      const systemPrompt = `
        You are Vidia, a highly intelligent skincare assistant designed to provide personalized and expert-level guidance on skincare routines, product recommendations, dietary advice, and treatments. 

        For each response:
        You MUST format your response in exactly two parts, separated by a line containing only "---":
            1. Provide a comprehensive yet clear answer that includes:
               - Detailed explanation of the main topic
               - Scientific reasoning when relevant
               - Practical tips and recommendations
               - Product suggestions or alternatives when applicable
               - Safety considerations or warnings if necessary
        [Your detailed answer goes here,only answer the question,do not include any other content]

        ---

        2. After your detailed response, end with exactly 2-3 numbered follow-up questions that users might want to ask related to the main topic
        [List your follow-up questions here, one per line, each ending with a question mark]
        Format follow-up questions as:
            1. [Question 1]?
            2. [Question 2]?
            3. [Question 3]?

        Remember: Always include the separator "---" on its own line between your answer and questions.Keep your main response informative and engaging, but make sure the follow-up questions are clearly separated at the end.
      `;

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ];

      if (skinTestResult) {
        messages.push({
          role: "user",
          content: `Based on the skin test results:
            Summary: ${skinTestResult.summary}
            Skin Type: ${skinTestResult.skinType}
            Please provide personalized skincare advice and product recommendations.
                    Please provide:
        1. A detailed explanation of this skin type
        2. Specific skincare recommendations
        3. Product types that would be beneficial
        4. Daily skincare routine suggestions
        5. Things to avoid for this skin type`,
        });
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      console.log("OpenAI 响应:", completion.choices[0]);

      // 分离回答内容和后续问题
      const fullContent = completion.choices[0].message.content;
      let mainContent, questionsSection;

      // 严格按照 "---" 分隔符分割内容
      if (fullContent.includes("---")) {
        [mainContent, questionsSection] = fullContent
          .split("---")
          .map((part) => part.trim());
      } else {
        // 如果没有分隔符，将所有内容作为主要回答
        mainContent = fullContent;
        questionsSection = "";
      }

      // 提取后续问题，确保只获取问题部分
      const followUpQuestions = questionsSection
        ? this.extractQuestions(questionsSection)
        : this.generateDefaultQuestions();

      // 清理主要内容，确保不包含问题部分
      mainContent = mainContent
        .split("\n")
        .filter(
          (line) => !line.trim().endsWith("?") && !line.trim().endsWith("？")
        )
        .join("\n")
        .trim();

      res.json({
        content: mainContent,
        followUpQuestions,
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  extractQuestions(content) {
    // 提取文本中的问题
    const questions = content
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          (line.endsWith("?") || line.endsWith("？")) &&
          !line.startsWith("Part") &&
          line.length > 1
      );

    return questions.length > 0 ? questions : this.generateDefaultQuestions();
  }

  generateDefaultQuestions() {
    return [
      "How can I reduce acne and prevent future breakouts?",
      "What are some effective home remedies for acne?",
      "What are the best skincare products for acne-prone skin?",
    ];
  }
}

module.exports = new ChatController();
