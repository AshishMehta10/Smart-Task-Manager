import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import morgan from "morgan"
import { errorHandler, routeNotFound } from "./middlewares/errorMiddleware.js"
import { dbConnection } from "./utils/index.js"
import routes from "./routes/index.js"
import passport from 'passport';
import bodyParser from 'body-parser';
import session from "express-session";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

dotenv.config()

dbConnection()

const PORT = process.env.PORT || 8000

const app = express()

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    })
)


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



// Access environment variables
const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = process.env.GEMINI_API_KEY;
// Middleware to handle HTTP post requests
app.use(bodyParser.json()); // To handle JSON body

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret:"This is the secret key",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

async function runChat(userInput) {
	const genAI = new GoogleGenerativeAI(API_KEY);
	const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
	const generationConfig = {
	  temperature: 0.9,
	  topK: 1,
	  topP: 1,
	  maxOutputTokens: 1000,
	};
  
	const safetySettings = [
	  {
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	  },
	  // ... other safety settings
	];
  
	const chat = model.startChat({
	  generationConfig,
	  safetySettings,
	  history: [
		{
		  role: "user",
		  parts: [
			{text: "Hi\n"},
		  ],
		},

    {
		  role: "model",
		  parts: [
			{text: "Hi, Welcome to SmartTaskManagement, how may i help you??\n"},
		  ],
		},

        {
            role: "user",
            parts: [
              {text: "what is smarttaskmanagement\n"},
            ],
          },

    {
		  role: "model",
		  parts: [
			{text: "The  SmartTaskManagement is designed to streamline task assignments, improve collaboration, and enhance workflow efficiency for both admins and users.\n Admins have full control over user management, allowing them to create accounts, add team members, assign tasks to individuals or groups, and update task details, including status and priority levels (High, Medium, Normal, Low).\n Tasks can be labeled as To-Do, In Progress, or Completed, and admins can also manage sub-tasks, upload relevant assets such as images, and control user accounts by activating, disabling, or deleting them as needed.\n Additionally, tasks can be permanently removed or moved to the trash. Users, on the other hand, can interact with their assigned tasks by updating their status, viewing task details, and participating in discussions through comments or chat.\n The system ensures secure authentication and authorization with role-based access control, enabling users to log in safely and perform only the actions permitted for their roles.\n Profile management features allow users to update their information, while secure password management ensures account security.\n The dashboard provides a comprehensive overview of user activities, with an organized display of tasks categorized as To-Do, In Progress, or Completed, ensuring efficient task tracking and management."},
		  ],
		},

      {
        role: "user",
        parts: [
          { text: "does users and admin have different portals" },
        ],
        },
  
        {
          role: "model",
          parts: [
          {text: "Yes, users and admins have different portals where they can manage their works\n"},
          ],
        },

        {
            role: "user",
            parts: [
              { text: "Can a user create task" },
            ],
            },
      
            {
              role: "model",
              parts: [
              {text: "No the user cannot create the task, the task will be created by admin and only they will assign it\n"},
              ],
        },

		{
            role: "user",
            parts: [
              { text: "is there any helddesk kind section in this" },
            ],
            },
      
            {
              role: "model",
              parts: [
              {text: "Yes, an AI ChatBot has been provided to each and every user for their help, and in case they have any query they can directly get it solved by ChatBot without admins intervention\n"}
              ],
        },
		
		
	  ],
	});
  
	const result = await chat.sendMessage(userInput);
	const response = result.response;
	return response.text();
  }


  app.post('/chat', async (req, res) => {
	try {
	  const userInput = req.body?.userInput;
	  console.log('incoming /chat req', userInput)
	  if (!userInput) {
		return res.status(400).json({ error: 'Invalid request body' });
	  }
  
	  const response = await runChat(userInput);
	  res.json({ response });
	} catch (error) {
	  console.error('Error in chat endpoint:', error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });
  


app.use(cookieParser())

app.use(morgan("dev"))
app.use("/api", routes)

app.use(routeNotFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
