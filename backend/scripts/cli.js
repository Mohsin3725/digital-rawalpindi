#!/usr/bin/env node

import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Terminal arguments pakro
const args = process.argv.slice(2);
const command = args[0]; // e.g., 'check' ya 'ask'
const target = args[1];  // e.g., 'src/app/page.tsx' ya "prompt text"

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.log('❌ Error: GEMINI_API_KEY environment variable is not set in Windows.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function main() {
  if (!command) {
    console.log('\n💡 Usage:');
    console.log('  npm run ai "your prompt here"');
    console.log('  npm run ai check <file-path>      (To review code/fix errors)\n');
    process.exit(0);
  }

  let prompt = "";

  // CASE 1: Agar command 'check' hai aur sath file path hai
  if (command === 'check' && target) {
    const filePath = path.resolve(target);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Error: File not found at path: ${target}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    prompt = `Analyze the following file from my Next.js + TypeScript project. Check for any syntax errors, logical bugs, or TypeScript issues, and provide the corrected code with a short explanation:\n\nFile Path: ${target}\n\nCode:\n\`\`\`typescript\n${fileContent}\n\`\`\``;
  } 
  // CASE 2: Agar normal prompt pucha hai (jaise poem ya query)
  else {
    prompt = args.join(' ');
  }

  try {
    console.log('⏳ Gemini Developer Assistant is analyzing...\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [prompt],
      config: {
        systemInstruction: "You are an expert full-stack developer specializing in Next.js, TypeScript, and MongoDB. Help the developer fix bugs, optimize performance, and write clean code."
      }
    });

    console.log('🤖 Gemini Response:\n');
    console.log(response.text);
  } catch (error) {
    console.error('❌ Error communicating with Gemini:', error.message);
  }
}

main();