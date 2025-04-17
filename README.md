# 🚀 ViveFlow
Transform your ideas into actionable frameworks with interactive mind maps.

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
├── app/                     # Next.js app directory (App Router)
│   ├── api/                 # Backend API routes
│   │   ├── chat-response/   # AI chat endpoint
│   │   ├── enhance-prompt/  # AI prompt enhancement endpoint
│   │   └── process-idea/    # Framework generation endpoint
│   ├── dashboard/           # Main app dashboard page
│   ├── saved/               # Saved frameworks page
│   ├── saved-ideas/         # Legacy saved ideas page
│   ├── globals.css          # Global CSS styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Landing page entry point
├── components/              # React components
│   ├── ui/                  # UI components (shadcn/ui)
│   │   ├── button.tsx       # Button component
│   │   ├── card.tsx         # Card component
│   │   ├── textarea.tsx     # Textarea component
│   │   ├── tabs.tsx         # Tabs component
│   │   ├── toast.tsx        # Toast notification component
│   │   └── ...              # Other UI components (45+ components)
│   ├── magicui/             # Magic UI components
│   ├── landing-page.tsx     # Landing page component
│   ├── flow-chart.tsx       # Mind map wrapper component
│   ├── reactflow-chart.tsx  # Mind map implementation
│   ├── json-panel.tsx       # JSON view component
│   ├── export-menu.tsx      # Export options component
│   ├── chatbot.tsx          # AI chat interface component
│   ├── ai-suggestions.tsx   # AI prompt enhancement component
│   ├── detailed-framework-view.tsx # Detailed view of framework
│   ├── error-boundary.tsx   # Error handling component
│   ├── theme-provider.tsx   # Theme context provider
│   └── theme-toggle.tsx     # Theme toggle component
├── hooks/                   # Custom React hooks
│   ├── use-toast.ts         # Toast notification hook
│   └── use-mobile.tsx       # Mobile detection hook
├── lib/                     # Utility functions
│   └── utils.ts             # General utility functions
├── styles/                  # Additional CSS styles
├── types/                   # TypeScript type definitions
│   ├── framework.ts         # Framework interface definitions
│   ├── idea.ts              # Idea type definitions
│   └── groq.d.ts            # Groq API type definitions
├── public/                  # Static assets
│   ├── images/              # Image assets
│   └── ...                  # Other static files
├── .env                     # Environment variables template
├── .env.local               # Local environment variables
├── .env.production          # Production environment variables
├── next.config.js           # Next.js configuration
├── next.config.mjs          # Next.js ESM configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── postcss.config.mjs       # PostCSS configuration
├── components.json          # shadcn/ui configuration
└── package.json             # Node.js dependencies and scripts
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
