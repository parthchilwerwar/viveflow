# 🚀 ViveFlow
*AI-powered: Turn your ideas into interactive mind maps and actionable frameworks.*

## 📌 Problem Statement
Problem Statement 1 - Weave AI magic with Groq

## 🎯 Objective
ViveFlow solves the challenge of turning abstract ideas into structured, actionable plans. It serves entrepreneurs, project managers, educators, and anyone who needs to organize complex thoughts. The application uses AI to transform natural language input into comprehensive frameworks with goals, action steps, challenges, and resources, all visualized through interactive mind maps.

## 👨‍💻 About the Creator
This project was created by **Parth Chilwerwar** as a solo endeavor. I built ViveFlow to address the problem of unstructured ideas often remaining unexecuted without proper organization and visualization.

## 🛠️ Tech Stack
**Core Technologies Used:**
- **Frontend:** Next.js 15 with TypeScript, Tailwind CSS, shadcn/ui components, React Flow
- **Backend:** Next.js API routes
- **State Management:** Local storage for saving user data
- **AI Integration:** Groq API with meta-llama/llama-4-maverick-17b-128e-instruct model
- **Deployment:** Vercel

**Key Libraries & Dependencies:**
- **@xyflow/react**: For creating interactive mind map visualizations
- **lucide-react**: For modern SVG icons
- **tailwindcss-animate**: For smooth UI animations
- **radix-ui**: For accessible UI components
- **zod**: For data validation
- **html2canvas**: For exporting mind maps as images

## ✨ Key Features
- **Idea Processing:** Enter your idea or goal and get a structured framework
- **Interactive Mind Map:** Visualize the framework using an interactive ReactFlow diagram
- **JSON View:** Access raw data for technical users
- **Saved Ideas:** Recent ideas are saved to local storage for easy reference
- **Responsive Design:** Works seamlessly on both desktop and mobile devices
- **Export Options:** Export your framework as JSON or image
- **AI-Powered Suggestions:** Get enhancement suggestions for your ideas

## 🧠 How ViveFlow Works
1. **Input Processing**: User enters their idea or goal in the input field
2. **AI Analysis**: The application sends the idea to the Groq API with a specially crafted system prompt
3. **Framework Generation**: The AI generates a comprehensive framework including:
   - Main goal
   - Action steps to achieve the goal
   - Potential challenges
   - Useful resources
   - Practical tips
4. **Visualization**: The framework is displayed as an interactive mind map using React Flow
5. **Data Management**: The framework is automatically saved to local storage for future reference

## 📽️ Demo & Deliverables
- Demo Video Link: [Coming Soon]
- Pitch Deck Link: [Coming Soon]

## ✅ Tasks & Bonus Checklist
- ✅ I completed the mandatory task
- ✅ I completed Bonus Task 1
- ✅ I completed Bonus Task 2

## 🧪 How to Run the Project
**Requirements:**
- Node.js (v16+)
- pnpm
- Groq API key

**Local Setup:**
```
# Clone the repo
git clone https://github.com/parthchilwerwar/viveflow

# Install dependencies
cd viveflow
pnpm install

# Set up environment variables
# Create a .env.local file with:
GROQ_API_KEY=your-api-key-here

# Start development server
pnpm dev
```

## 📂 Project Structure
```
viveflow/
├── app/
│   ├── api/
│   │   ├── chat-response/
│   │   ├── enhance-prompt/
│   │   └── process-idea/
│   ├── dashboard/
│   ├── saved/
│   ├── saved-ideas/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── textarea.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── magicui/
│   ├── landing-page.tsx
│   ├── flow-chart.tsx
│   ├── reactflow-chart.tsx
│   ├── json-panel.tsx
│   ├── export-menu.tsx
│   ├── chatbot.tsx
│   ├── ai-suggestions.tsx
│   ├── detailed-framework-view.tsx
│   ├── error-boundary.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── hooks/
│   ├── use-toast.ts
│   └── use-mobile.tsx
├── lib/
│   └── utils.ts
├── styles/
├── types/
│   ├── framework.ts
│   ├── idea.ts
│   └── groq.d.ts
├── public/
│   ├── images/
│   └── ...
├── .env
├── .env.local
├── .env.production
├── next.config.js
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── components.json
└── package.json
```

## 🧬 Future Scope
- 📈 **Collaboration Features:** Enable team collaboration on frameworks
- 🔄 **Version History:** Track changes to ideas over time
- 📱 **Mobile App:** Native mobile experience for on-the-go ideation
- 🔌 **Integrations:** Connect with project management tools like Asana, Trello
- 🔍 **Advanced Search:** Search through saved frameworks by content
- 🗂️ **Framework Templates:** Pre-built templates for common use cases

## 📎 Resources / Credits
- Groq API for AI processing
- ReactFlow for interactive diagrams
- shadcn/ui for component library
- Next.js and Vercel for development and hosting

## 📝 Development Insights
- Used a carefully crafted system prompt to generate structured frameworks from user input
- Implemented error handling for API timeouts and rate limiting
- Created a responsive UI that works across different device sizes
- Used React Flow to create an interactive and visually appealing mind map
- Implemented local storage for data persistence without requiring user accounts

## 🏁 Final Words
The development of ViveFlow was challenging but rewarding. The most significant technical challenge was optimizing the AI response format to ensure consistent, structured data for visualization. The breakthrough moment came when I got the mind map visualization working seamlessly with the AI-generated framework.

Thank you for checking out ViveFlow! I hope it helps you transform your ideas into actionable plans.
