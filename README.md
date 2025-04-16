# 🌊 ViveFlow

ViveFlow is a web application that transforms your ideas into actionable frameworks. It analyzes your input and generates structured plans with goals, action steps, challenges, resources, and tips.

## Features

- **Idea Processing**: Enter your idea or goal and get a structured framework
- **Interactive Mind Map**: Visualize the framework using an interactive ReactFlow diagram
- **JSON View**: Access raw data for technical users
- **Saved Ideas**: Recent ideas are saved to local storage for easy reference

## Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **UI**: Tailwind CSS with shadcn/ui components
- **Visualization**: ReactFlow for interactive mind maps
- **AI Integration**: Groq API with Gemma 2 9B-IT model for powerful idea processing

## Development

### Prerequisites

- Node.js (v16+)
- pnpm
- Groq API key (required)

### Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Create a `.env.local` file with the following:
   ```
   GROQ_API_KEY=your-api-key-here
   ```
4. Run the development server: `pnpm dev`

### API Integration

The application integrates directly with the Groq API using the Gemma 2 9B-IT model to transform user ideas into structured frameworks. The API processes natural language input and returns structured data that is visualized in the mind map.

To run the application:
1. Get an API key from [Groq](https://console.groq.com/)
2. Add it to your `.env.local` file

### Deployment

For production deployment:

1. Set up your environment variables on your hosting platform
2. Build the application: `pnpm build`
3. Deploy the application

## License

MIT 