import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Allow json payloads up to 10MB for base64 passport image transmission
app.use(express.json({ limit: '10mb' }));

// Health / status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// AI Deep Compliance Audit Endpoint
app.post('/api/ai-audit', async (req, res) => {
  try {
    const { imageBase64, lang = 'en' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 field is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY not configured on server',
        fallback: true
      });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const ai = new GoogleGenAI();

    const langInstruction = lang === 'kh'
      ? 'CRITICAL: Provide expressionDescription and all actionableFeedback items in natural, fluent Khmer (ភាសាខ្មែរ).'
      : 'Provide expressionDescription and actionableFeedback in clear English.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: 'image/jpeg',
              },
            },
            {
              text: `You are a certified U.S. Department of State Visa/Passport photo compliance inspector.
Audit this photo strictly against official U.S. Diversity Visa (DV) lottery guidelines:
1. Eyeglasses: Strictly prohibited since Nov 1, 2016. Any eyeglasses, sunglasses, or tinted lenses must FAIL.
2. Expression: Must be neutral, mouth closed, both eyes open and clearly visible.
3. Head Pose & Angle: Full face directly facing the camera, no head tilt, no looking sideways.
4. Background: Plain white or light off-white, no patterned wallpapers, no colored walls, no objects.
5. Shadows: No harsh shadows across face, under chin/ears, or on the background.
6. Alterations: No digital retouching, skin smoothing, red-eye removal filters, or AI generation artifacts.
7. Obscurations: No hair obscuring eyes or face oval; no headphones or hats (unless religious headwear leaving full face visible).

${langInstruction}
Evaluate accurately and return the JSON structured response.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isEyeglassesDetected: {
              type: Type.BOOLEAN,
              description: 'Whether eyeglasses or sunglasses are detected on the subject',
            },
            isExpressionNeutral: {
              type: Type.BOOLEAN,
              description: 'Whether facial expression is neutral with mouth closed and eyes open',
            },
            expressionDescription: {
              type: Type.STRING,
              description: 'Brief description of facial expression',
            },
            isEyesOpenAndDirect: {
              type: Type.BOOLEAN,
              description: 'Both eyes open looking directly at the camera lens',
            },
            isHeadPoseStraight: {
              type: Type.BOOLEAN,
              description: 'Head is upright and directly facing camera with 0 tilt',
            },
            isBackgroundNeutralWhite: {
              type: Type.BOOLEAN,
              description: 'Background is plain white or off-white without colors',
            },
            hasHarshShadows: {
              type: Type.BOOLEAN,
              description: 'Noticeable shadows behind head or on face',
            },
            isDigitallyAltered: {
              type: Type.BOOLEAN,
              description: 'Signs of smoothing filters, heavy airbrushing, or digital manipulation',
            },
            overallAiVerdict: {
              type: Type.STRING,
              enum: ['pass', 'fail', 'warn'],
              description: 'Overall pass or failure against US visa standards',
            },
            actionableFeedback: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Bullet points with clear guidance for the applicant',
            },
          },
          required: [
            'isEyeglassesDetected',
            'isExpressionNeutral',
            'isEyesOpenAndDirect',
            'isHeadPoseStraight',
            'isBackgroundNeutralWhite',
            'hasHarshShadows',
            'overallAiVerdict',
            'actionableFeedback',
          ],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json({ success: true, result });
  } catch (err: any) {
    console.error('Error in AI photo audit:', err);
    res.status(500).json({
      error: err?.message || 'Failed to inspect photo with AI',
      fallback: true
    });
  }
});

// Dev vs Production server wiring
if (!isProduction) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
