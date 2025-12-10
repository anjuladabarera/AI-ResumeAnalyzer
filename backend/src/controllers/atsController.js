import OpenAI from "openai";

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);



const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // now it should work
});


export const atsScore = async (req, res) => {
  try {
    const { text } = req.body; // text from the uploaded PDF

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: `Analyze this CV text and give me an ATS score out of 100, along with feedback:\n\n${text}`,
        },
      ],
    });

    const result = response.choices[0].message.content;

    res.status(200).json({ analysis: result });
  } catch (error) {
    console.error("Error analyzing CV:", error);
    res.status(500).json({ message: "Error analyzing CV" });
  }
};
