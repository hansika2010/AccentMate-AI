import openai from '../config/openai';

const RANDOM_TOPICS = [
  'My favorite movie',
  'School life',
  'Social media addiction',
  'Technology and education',
  'Future career goals',
  'Climate change',
  'Sports',
  'Books',
  'A memorable trip',
  'A challenge I overcame',
  'My hobby',
  'Family traditions',
  'Travel experiences',
  'Learning languages',
  'Health and fitness',
  'Favorite food',
  'Dream vacation',
  'Music preferences',
  'Current events',
  'Friendship',
];

class TopicService {
  getRandomTopic() {
    return RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
  }

  async generatePrompts(topic, count = 5) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an English speaking coach. Generate speaking prompts to help a student practice English on a specific topic.
            Return a JSON object with:
            - topic: the topic
            - prompts: array of ${count} speaking prompts
            - tips: array of 3-4 tips for speaking naturally`,
          },
          {
            role: 'user',
            content: `Generate ${count} speaking prompts for the topic: "${topic}"`,
          },
        ],
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to generate prompts:', error);
      return {
        topic: topic,
        prompts: [`Tell me about ${topic}`],
        tips: ['Speak naturally', 'Use complete sentences'],
      };
    }
  }

  async generateWeeklyChallenge(week) {
    const challenges = {
      1: {
        title: 'Introduce Yourself',
        description: 'Introduce yourself for 2 minutes. Include your name, background, interests, and goals.',
        duration: 120,
        tips: ['Speak clearly', 'Use simple sentences', 'Practice pausing between sentences'],
      },
      2: {
        title: 'Future Goals',
        description: 'Talk about your future goals and career aspirations for 2-3 minutes.',
        duration: 180,
        tips: ['Use future tense', 'Explain your reasons', 'Be enthusiastic'],
      },
      3: {
        title: 'Memorable Experience',
        description: 'Describe a memorable experience in 2-3 minutes. Include details and emotions.',
        duration: 180,
        tips: ['Use past tense correctly', 'Add descriptive words', 'Tell a story'],
      },
      4: {
        title: 'Technology Opinion',
        description: 'Give your opinion on technology and education in 3-5 minutes.',
        duration: 300,
        tips: ['Present both sides', 'Use linking words', 'Support with examples'],
      },
    };

    return challenges[week] || challenges[1];
  }

  async startConversation(topic) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a friendly American English conversation partner for an English learner. Start a natural conversation about the given topic. 
            Be encouraging, ask follow-up questions, and help the user speak more.
            Respond with a JSON object:
            - greeting: your opening message
            - question: your first question to start the conversation`,
          },
          {
            role: 'user',
            content: `Start a conversation about: ${topic}`,
          },
        ],
        temperature: 0.8,
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      return {
        greeting: `Hi! I'd love to talk about ${topic} with you!`,
        question: `Tell me more about ${topic}.`,
      };
    }
  }

  async continueConversation(messages) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a friendly American English conversation partner. Continue the conversation naturally, ask follow-up questions, and encourage longer responses.
            Be encouraging and supportive.`,
          },
          ...messages,
        ],
        temperature: 0.8,
      });

      return {
        response: response.choices[0].message.content,
        stop_reason: response.finish_reason,
      };
    } catch (error) {
      console.error('Failed to continue conversation:', error);
      return {
        response: "That's interesting! Tell me more about that.",
        stop_reason: 'error',
      };
    }
  }
}

export default new TopicService();
