import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questionType, difficulty, questionText, userResponse, recordedVideo } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a STRICT and HONEST interview coach analyzing interview responses. Your job is to provide ACCURATE feedback that reflects what actually happened in the response.

🚨 CRITICAL SCORING RULES - FOLLOW EXACTLY:

IF THE CANDIDATE IS SILENT OR DOESN'T SPEAK:
- Overall Score: 0-5 (complete failure to respond)
- All other scores: 0-10 
- Strengths: "None - No verbal response was provided"
- Improvements: Focus on the need to actually speak and answer the question
- Feedback: "The candidate did not provide any verbal response to the question. This represents a complete failure to engage with the interview question."

IF THE CANDIDATE SPEAKS BUT SAYS NOTHING MEANINGFUL:
- Overall Score: 10-25 (inadequate response)
- Other scores: 15-30
- Be specific about what little they said and why it's insufficient

IF THE CANDIDATE PROVIDES A MINIMAL/SHORT RESPONSE:
- Overall Score: 30-50 (needs significant improvement)
- Other scores: 30-60
- Cite exactly what was said and why it lacks depth

ONLY IF THE CANDIDATE PROVIDES A COMPREHENSIVE, DETAILED RESPONSE:
- Overall Score: 70-100 (good to excellent)
- Other scores: 70-100
- Must have specific examples, structured thinking, and depth

📹 VIDEO ANALYSIS REQUIREMENTS:

You MUST explicitly state in your feedback:
1. "The candidate [DID / DID NOT] provide a verbal response"
2. If they spoke: Quote or paraphrase EXACTLY what they said
3. Body language observations (even for silent candidates)
4. Eye contact and engagement level
5. Professional appearance

EVALUATION CRITERIA:
1. Overall quality (0-100): Did they answer? Was it comprehensive?
2. Clarity (0-100): Could you understand their verbal response?
3. Relevance (0-100): Did they address the actual question?
4. Structure (0-100): Was there a clear beginning, middle, end?

YOUR FEEDBACK MUST BE HONEST AND ACCURATE. Do not inflate scores. Do not give credit where none is due. Be helpful but truthful.`;

    // Validate that there's actual content to analyze
    const hasTextResponse = userResponse && userResponse.trim().length > 0;
    const hasVideoResponse = recordedVideo && recordedVideo.length > 0;
    
    if (!hasTextResponse && !hasVideoResponse) {
      return new Response(
        JSON.stringify({ error: "No response provided. Please provide either a written response or video recording." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build user message content based on available inputs
    let userContent: any;
    
    if (recordedVideo && userResponse) {
      // Both video and text provided
      userContent = [
        {
          type: "text",
          text: `Question Type: ${questionType}
Difficulty: ${difficulty}
Question: ${questionText}

The candidate provided both a video response and written notes below. Analyze BOTH carefully and ensure your scores reflect the actual quality and substance of their response.

Written Response: "${userResponse}"

IMPORTANT: If the written response is too brief, vague, or doesn't properly address the question, reflect this in LOW scores. Be honest and critical.`
        },
        {
          type: "video",
          video: recordedVideo
        }
      ];
    } else if (recordedVideo) {
      // Only video provided - VIDEO-ONLY ANALYSIS
      userContent = [
        {
          type: "text",
          text: `🎥 VIDEO INTERVIEW RESPONSE ANALYSIS

Question Type: ${questionType}
Difficulty: ${difficulty}
Question Asked: "${questionText}"

⚠️ CRITICAL INSTRUCTIONS - READ CAREFULLY:

You are analyzing a VIDEO RECORDING of an interview response. You MUST watch the video completely and evaluate based ONLY on what you see and hear.

🔴 FIRST: CHECK IF CANDIDATE SPEAKS
- Listen carefully to the ENTIRE video
- Did the candidate provide ANY verbal response? (Yes/No)
- If NO verbal response → Give scores of 0-5 (complete failure)
- If minimal/unclear speech → Give scores of 10-30 (inadequate)
- If comprehensive answer → Give scores based on quality (70-100 for excellent)

📋 YOUR ANALYSIS MUST START WITH:
"VERBAL RESPONSE DETECTION: The candidate [DID / DID NOT] provide a verbal response in this recording."

IF THE CANDIDATE DID NOT SPEAK OR WAS SILENT:
- State clearly: "No verbal response was detected"
- Overall Score: 0-5
- Clarity Score: 0
- Relevance Score: 0
- Structure Score: 0
- Strengths: ["None - No response provided", "Candidate appeared on camera (if visible)"]
- Improvements: ["Must provide a verbal response", "Need to speak clearly and answer the question", "Practice articulating thoughts out loud"]
- Feedback: "The candidate did not provide any verbal response to the interview question. Without speaking, there is no content to evaluate. This represents a failure to engage with the interview process."

IF THE CANDIDATE DID SPEAK, ANALYZE:

1. VERBAL CONTENT (Most Important):
   - QUOTE or paraphrase what they actually said
   - Did their words answer the question?
   - What specific examples or details did they mention?
   - How long and comprehensive was their answer?

2. DELIVERY & COMMUNICATION:
   - Speaking pace and fluency
   - Vocal clarity and projection
   - Use of filler words
   - Confidence in voice

3. BODY LANGUAGE:
   - Posture and positioning
   - Eye contact with camera
   - Hand gestures
   - Facial expressions
   - Overall confidence

4. PROFESSIONAL PRESENTATION:
   - Attire and appearance
   - Background setting
   - Camera framing

🎯 SCORING MUST BE HONEST AND ACCURATE:
- Silent/No response: 0-5 overall
- Said very little: 10-30 overall
- Brief but relevant: 40-60 overall
- Good comprehensive answer: 70-85 overall
- Exceptional detailed answer: 86-100 overall

Your feedback must prove you actually watched and listened to the recording. Include specific details about what was said and observed.`
        },
        {
          type: "video",
          video: recordedVideo
        }
      ];
    } else {
      // Only text provided - validate minimum length
      const wordCount = userResponse.trim().split(/\s+/).length;
      
      userContent = `Question Type: ${questionType}
Difficulty: ${difficulty}
Question: ${questionText}

Candidate's Written Response: "${userResponse}"

Word Count: ${wordCount} words

CRITICAL EVALUATION INSTRUCTIONS:
- If response has fewer than 20 words: Give scores in 0-30 range (insufficient answer)
- If response lacks specific examples or details: Maximum 50 score
- If response is vague or doesn't address the question: Score 20-40
- Only give high scores (70+) if the answer is comprehensive with specific examples
- Be honest and critical - your job is to help them improve, not inflate scores

Please analyze this interview response and provide comprehensive feedback that reflects the ACTUAL quality of their answer.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_feedback",
              description: "Provide structured interview feedback",
              parameters: {
                type: "object",
                properties: {
                  overall_score: { 
                    type: "number", 
                    minimum: 0, 
                    maximum: 100,
                    description: "Overall quality: 0-5 if silent, 10-30 if minimal, 40-60 if brief but relevant, 70-100 if comprehensive"
                  },
                  clarity_score: { 
                    type: "number", 
                    minimum: 0, 
                    maximum: 100,
                    description: "0 if silent, low if unclear speech, high only if articulate and clear"
                  },
                  relevance_score: { 
                    type: "number", 
                    minimum: 0, 
                    maximum: 100,
                    description: "0 if silent, low if off-topic, high only if directly answers question"
                  },
                  structure_score: { 
                    type: "number", 
                    minimum: 0, 
                    maximum: 100,
                    description: "0 if silent, low if rambling, high only if well-organized"
                  },
                  strengths: {
                    type: "array",
                    items: { 
                      type: "string",
                      description: "Specific strength observed. If no response, say 'None - No response provided'"
                    },
                    minItems: 2,
                    maxItems: 3,
                    description: "Actual strengths observed in the recording"
                  },
                  improvements: {
                    type: "array",
                    items: { 
                      type: "string",
                      description: "Specific improvement needed. For silent responses, focus on need to speak"
                    },
                    minItems: 2,
                    maxItems: 3,
                    description: "Critical areas for improvement based on what was observed"
                  },
                  feedback_text: { 
                    type: "string",
                    description: "Honest assessment starting with whether candidate spoke. Include specific observations from video."
                  }
                },
                required: ["overall_score", "clarity_score", "relevance_score", "structure_score", "strengths", "improvements", "feedback_text"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_feedback" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No feedback generated");
    }

    const feedback = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ feedback }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
