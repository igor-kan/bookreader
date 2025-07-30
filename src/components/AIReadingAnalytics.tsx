import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  Clock,
  Star,
  Eye,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Trophy,
  Calendar,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight
} from 'lucide-react';

interface ReadingPattern {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  frequency: number;
  duration: number;
  comprehension: number;
  mood: 'focused' | 'relaxed' | 'stressed' | 'energetic';
}

interface ReadingMetrics {
  comprehensionScore: number;
  retentionRate: number;
  readingSpeedTrend: 'up' | 'down' | 'stable';
  focusLevel: number;
  vocabularyGrowth: number;
  preferredGenres: string[];
  optimalReadingTime: string;
  strengthsAndWeaknesses: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
}

interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  similarity: number;
  reasons: string[];
  difficulty: number;
  estimatedTime: number;
  genre: string[];
  aiConfidence: number;
}

interface LearningInsights {
  conceptsMastered: string[];
  areasForImprovement: string[];
  learningVelocity: number;
  knowledgeRetention: number;
  crossConnections: string[];
  nextLearningGoals: string[];
}

export default function AIReadingAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [readingMetrics] = useState<ReadingMetrics>({
    comprehensionScore: 87,
    retentionRate: 82,
    readingSpeedTrend: 'up',
    focusLevel: 78,
    vocabularyGrowth: 15,
    preferredGenres: ['Science Fiction', 'Classic Literature', 'Philosophy'],
    optimalReadingTime: '9:00 AM - 11:00 AM',
    strengthsAndWeaknesses: {
      strengths: [
        'Excellent at identifying themes and symbolism',
        'Strong retention for character development',
        'Good at connecting concepts across books'
      ],
      weaknesses: [
        'Tends to rush through descriptive passages',
        'Lower comprehension for technical/scientific content',
        'Note-taking frequency could improve'
      ],
      suggestions: [
        'Take more time with descriptive sections',
        'Use active reading techniques for technical content',
        'Set reminders to make notes every 10 pages'
      ]
    }
  });

  const [readingPatterns] = useState<ReadingPattern[]>([
    {
      timeOfDay: 'morning',
      frequency: 85,
      duration: 45,
      comprehension: 92,
      mood: 'focused'
    },
    {
      timeOfDay: 'afternoon',
      frequency: 45,
      duration: 30,
      comprehension: 73,
      mood: 'relaxed'
    },
    {
      timeOfDay: 'evening',
      frequency: 78,
      duration: 60,
      comprehension: 85,
      mood: 'relaxed'
    },
    {
      timeOfDay: 'night',
      frequency: 25,
      duration: 25,
      comprehension: 65,
      mood: 'tired'
    }
  ]);

  const [recommendations] = useState<BookRecommendation[]>([
    {
      id: '1',
      title: 'Neuromancer',
      author: 'William Gibson',
      cover: '/placeholder.svg',
      rating: 4.3,
      similarity: 94,
      reasons: [
        'Matches your sci-fi preference',
        'Similar complexity to Dune',
        'Cyberpunk themes align with your interests'
      ],
      difficulty: 8.2,
      estimatedTime: 320,
      genre: ['Science Fiction', 'Cyberpunk'],
      aiConfidence: 96
    },
    {
      id: '2',
      title: 'The Sun Also Rises',
      author: 'Ernest Hemingway',
      cover: '/placeholder.svg',
      rating: 4.1,
      similarity: 88,
      reasons: [
        'Complements your classic literature reading',
        'Similar writing style to Gatsby',
        'Explores themes of disillusionment'
      ],
      difficulty: 6.8,
      estimatedTime: 280,
      genre: ['Classic', 'Modern Literature'],
      aiConfidence: 91
    },
    {
      id: '3',
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      cover: '/placeholder.svg',
      rating: 4.4,
      similarity: 75,
      reasons: [
        'Expands on themes from your recent reads',
        'Perfect difficulty level for growth',
        'Highly rated by similar readers'
      ],
      difficulty: 7.5,
      estimatedTime: 450,
      genre: ['Non-fiction', 'History', 'Philosophy'],
      aiConfidence: 87
    }
  ]);

  const [learningInsights] = useState<LearningInsights>({
    conceptsMastered: [
      'Symbolism in American Literature',
      'Political intrigue in sci-fi',
      'Character development analysis',
      'Thematic connections'
    ],
    areasForImprovement: [
      'Technical vocabulary understanding',
      'Historical context awareness',
      'Critical analysis depth',
      'Note organization'
    ],
    learningVelocity: 78,
    knowledgeRetention: 85,
    crossConnections: [
      'American Dream concept connects Gatsby to modern inequality themes',
      'Power dynamics in Dune relate to real-world politics',
      'Literary techniques used across different genres'
    ],
    nextLearningGoals: [
      'Explore more diverse authors and perspectives',
      'Develop stronger analytical writing skills',
      'Build systematic note-taking habits',
      'Increase reading of non-fiction works'
    ]
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      focused: 'bg-blue-100 text-blue-800 border-blue-200',
      relaxed: 'bg-green-100 text-green-800 border-green-200',
      stressed: 'bg-red-100 text-red-800 border-red-200',
      energetic: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      tired: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[mood as keyof typeof colors] || colors.relaxed;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Reading Analytics</h1>
              <p className="text-gray-600">Personalized insights and recommendations powered by artificial intelligence</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="recommendations">AI Picks</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Comprehension Score</p>
                      <p className="text-3xl font-bold">{readingMetrics.comprehensionScore}%</p>
                    </div>
                    <Brain className="h-8 w-8 text-blue-200" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(readingMetrics.readingSpeedTrend)}
                      <span className="text-xs text-blue-100">+5% from last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Retention Rate</p>
                      <p className="text-3xl font-bold">{readingMetrics.retentionRate}%</p>
                    </div>
                    <Target className="h-8 w-8 text-green-200" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-1">
                      <ArrowUp className="h-4 w-4 text-green-200" />
                      <span className="text-xs text-green-100">+8% improvement</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Focus Level</p>
                      <p className="text-3xl font-bold">{readingMetrics.focusLevel}%</p>
                    </div>
                    <Eye className="h-8 w-8 text-purple-200" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-1">
                      <ArrowUp className="h-4 w-4 text-purple-200" />
                      <span className="text-xs text-purple-100">Optimal range</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Vocab Growth</p>
                      <p className="text-3xl font-bold">+{readingMetrics.vocabularyGrowth}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-200" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-orange-200" />
                      <span className="text-xs text-orange-100">125 new words</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Reading Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {readingMetrics.strengthsAndWeaknesses.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-green-800">{strength}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Areas for Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {readingMetrics.strengthsAndWeaknesses.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-blue-800">{weakness}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Suggestions */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-indigo-600" />
                  AI Personalized Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {readingMetrics.strengthsAndWeaknesses.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                      <Zap className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{suggestion}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            Try This
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Reading Patterns by Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {readingPatterns.map((pattern, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium capitalize">{pattern.timeOfDay}</h4>
                            <Badge className={getMoodColor(pattern.mood)}>
                              {pattern.mood}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-600">
                            {pattern.frequency}% frequency
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Avg Duration</span>
                              <span className="font-medium">{pattern.duration}min</span>
                            </div>
                            <Progress value={pattern.duration} max={90} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Comprehension</span>
                              <span className="font-medium">{pattern.comprehension}%</span>
                            </div>
                            <Progress value={pattern.comprehension} className="h-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">📊 Pattern Analysis</h4>
                    <p className="text-sm text-blue-700">
                      Your optimal reading time is <strong>{readingMetrics.optimalReadingTime}</strong> 
                      when your comprehension peaks at 92%. Consider scheduling important reading during morning hours.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Reading Velocity Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Reading Speed: Improving</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Current Speed</span>
                          <span className="font-medium">245 WPM</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">Above average (220 WPM)</p>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Comprehension at Speed</span>
                          <span className="font-medium">87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">Excellent retention while speed reading</p>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Consistency Score</span>
                          <span className="font-medium">82%</span>
                        </div>
                        <Progress value={82} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">Good reading habit maintenance</p>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 mb-1">💡 Speed Training Tip</h4>
                      <p className="text-xs text-yellow-700">
                        Try the "chunking" technique: read 3-4 words at once instead of individual words to increase speed while maintaining comprehension.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">AI-Curated Recommendations</h2>
                <Badge className="bg-purple-100 text-purple-800">Based on your reading DNA</Badge>
              </div>
              <p className="text-gray-600">
                These recommendations are generated using machine learning analysis of your reading patterns, preferences, and comprehension data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{book.title}</CardTitle>
                        <p className="text-gray-600 text-sm">{book.author}</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
                        {book.similarity}% match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <img 
                        src={book.cover} 
                        alt={book.title}
                        className="w-full h-32 object-cover rounded"
                      />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-3 w-3 ${i < book.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-xs text-gray-600 ml-1">{book.rating}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {book.difficulty.toFixed(1)}/10 difficulty
                          </Badge>
                        </div>

                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Est. {Math.floor(book.estimatedTime / 60)}h {book.estimatedTime % 60}m</span>
                          <span>{book.aiConfidence}% AI confidence</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Why this book?</h4>
                        <ul className="space-y-1">
                          {book.reasons.slice(0, 2).map((reason, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                              <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {book.genre.slice(0, 3).map((genre) => (
                          <Badge key={genre} variant="secondary" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Add to Library
                        </Button>
                        <Button size="sm" variant="outline">
                          Preview
                        </Button>
                      </div>

                      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-medium text-purple-800">AI Prediction</span>
                        </div>
                        <p className="text-xs text-purple-700">
                          Based on your reading speed and comprehension, you'll likely finish this in 3-4 reading sessions with 85%+ retention.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Concepts Mastered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {learningInsights.conceptsMastered.map((concept, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span className="text-sm font-medium text-yellow-800">{concept}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Learning Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {learningInsights.nextLearningGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Target className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-blue-800">{goal}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Cross-Connection Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningInsights.crossConnections.map((connection, index) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <Brain className="h-3 w-3 text-purple-600" />
                        </div>
                        <p className="text-sm text-purple-800">{connection}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Learning Velocity</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full rounded-full border-8 border-gray-200 relative">
                      <div 
                        className="w-full h-full rounded-full border-8 border-green-500 absolute top-0 left-0"
                        style={{
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + (learningInsights.learningVelocity / 100) * 50}% 0%, 50% 50%)`
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-600">
                          {learningInsights.learningVelocity}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Above average learning pace</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Knowledge Retention</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full rounded-full border-8 border-gray-200 relative">
                      <div 
                        className="w-full h-full rounded-full border-8 border-blue-500 absolute top-0 left-0"
                        style={{
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + (learningInsights.knowledgeRetention / 100) * 50}% 0%, 50% 50%)`
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {learningInsights.knowledgeRetention}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Excellent retention rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Growth Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {learningInsights.areasForImprovement.slice(0, 3).map((area, index) => (
                      <div key={index} className="p-2 bg-orange-50 rounded text-center">
                        <span className="text-xs text-orange-800">{area}</span>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" className="w-full mt-4">
                    Create Learning Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}