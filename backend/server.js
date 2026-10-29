
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

// Job routes
app.use("/api/jobs", jobRoutes);

// User authentication routes
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("JobBoard API is running...");
});

// Create HTTP server
// const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Configure Socket.IO
// Configure Socket.IO


// const allowedOrigins = [
//   "https://jobboard-8kk4luu86-kanchan-team1.vercel.app",
//   "https://jobboard-2oxehl4un-kanchan-team1.vercel.app",
//   "http://localhost:5173"
// ];

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true
// }));


const allowedOrigin = (origin, callback) => {
  if (!origin) {
    return callback(null, true);
  }

  try {
    const url = new URL(origin);
    const host = url.hostname;

    const allowed =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "jobboard.vercel.app" ||
      (
        host.startsWith("jobboard-") &&
        host.endsWith("-kanchan-team1.vercel.app")
      );

    if (allowed) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed"));
  } catch {
    return callback(new Error("Invalid origin"));
  }
};


app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

app.use(express.json());

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "https://jobboard-8kk4luu86-kanchan-team1.vercel.app",
//       "https://jobboard-2oxehl4un-kanchan-team1.vercel.app",
//       "http://localhost:5173"
//     ],
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// const allowedOrigin = (origin, callback) => {
//   if (!origin) {
//     return callback(null, true);
//   }

//   try {
//     const url = new URL(origin);
//     const host = url.hostname;

//     const allowed =
//       host === "localhost" ||
//       host === "127.0.0.1" ||
//       host === "jobboard.vercel.app" ||
//       (
//         host.startsWith("jobboard-") &&
//         host.endsWith("-kanchan-team1.vercel.app")
//       );

//     if (allowed) {
//       return callback(null, true);
//     }

//     return callback(new Error("Origin not allowed"));
//   } catch {
//     return callback(new Error("Invalid origin"));
//   }
// };

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle real-time chat

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("chatMessage", (data) => {
    if (!data?.username?.trim() || !data?.message?.trim()) {
      return;
    }

    const username = data.username.trim();
    const message = data.message.trim();

    // Broadcast the user's message to everyone
    io.emit("chatMessage", {
      username,
      message
    });

    // Generate an automatic chatbot response
    const text = message.toLowerCase();
    let reply;

    if (/\b(hi|hello|hey|hii)\b/.test(text)) {
      reply = `Hey ${username}! 👋 Welcome to JobBoard. How can I help you today?`;
    } else if (text.includes("job") || text.includes("career")) {
      reply = "You can explore the Jobs section to find opportunities that match your interests! 💼";
    } else if (text.includes("resume") || text.includes("cv")) {
      reply = "Keep your resume updated with your skills, projects, education, and experience. Good luck! 📄";
    } else if (text.includes("help")) {
      reply = "Of course! 😊 I can help with job searches, careers, resumes, and using JobBoard. What would you like to know?";
    } else if (text.includes("thank")) {
      reply = "You're welcome! 😊 Happy job hunting!";
    } else if (text.includes("bye")) {
      reply = "Goodbye! 👋 Best of luck with your career!";
    } else {
      reply = "Thanks for your message! 😊 I’m JobBoard Bot. Ask me about jobs, careers, resumes, or how to use JobBoard.";
    }

    // Send the bot reply after a short delay
    setTimeout(() => {
      io.emit("chatMessage", {
        username: "JobBoard Bot",
        message: reply
      });
    }, 700);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});