import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  BookOpen,
  Star,
  Clock,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Bookmark,
  Heart,
  Share,
  Download,
  Eye,
  TrendingUp,
  Calendar,
  Tag,
  Users,
  Target,
  Zap,
  BookMarked,
  Archive,
  Trash2
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string[];
  rating: number;
  progress: number;
  totalPages: number;
  currentPage: number;
  timeSpent: number; // in minutes
  dateAdded: Date;
  lastRead: Date;
  favorite: boolean;
  tags: string[];
  notes: Note[];
  highlights: Highlight[];
  readingGoal?: ReadingGoal;
  file?: File | ArrayBuffer;
  type: 'epub' | 'pdf';
  aiAnalysis: AIBookAnalysis;
}

interface Note {
  id: string;
  content: string;
  page: number;
  position: number;
  created: Date;
  edited?: Date;
}

interface Highlight {
  id: string;
  text: string;
  page: number;
  position: number;
  color: string;
  created: Date;
  note?: string;
}

interface ReadingGoal {
  targetPagesPerDay: number;
  targetFinishDate: Date;
  currentStreak: number;
  longestStreak: number;
}

interface AIBookAnalysis {
  complexity: number;
  readingTime: number;
  themes: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  recommendations: string[];
  summary: string;
}

interface ReadingStats {
  totalBooksRead: number;
  totalPagesRead: number;
  totalTimeSpent: number;
  averageRating: number;
  currentStreak: number;
  favoriteGenres: string[];
  readingSpeed: number; // pages per hour
  monthlyGoal: number;
  monthlyProgress: number;
}

export default function EnhancedBookLibrary() {
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      cover: '/placeholder.svg',
      genre: ['Classic', 'Fiction', 'American Literature'],
      rating: 4.5,
      progress: 75,
      totalPages: 180,
      currentPage: 135,
      timeSpent: 420,
      dateAdded: new Date('2024-01-15'),
      lastRead: new Date('2024-01-22'),
      favorite: true,
      tags: ['must-read', 'classic'],
      notes: [],
      highlights: [],
      type: 'epub',
      aiAnalysis: {
        complexity: 7.5,
        readingTime: 240,
        themes: ['American Dream', 'Social Class', 'Love and Loss'],
        sentiment: 'neutral',
        recommendations: ['Consider the themes of wealth and morality'],
        summary: 'A classic American novel exploring themes of wealth, love, and the American Dream in the 1920s.'
      }
    },
    {
      id: '2',
      title: 'Dune',
      author: 'Frank Herbert',
      cover: '/placeholder.svg',
      genre: ['Science Fiction', 'Epic Fantasy'],
      rating: 4.8,
      progress: 45,
      totalPages: 688,
      currentPage: 310,
      timeSpent: 720,
      dateAdded: new Date('2024-01-10'),
      lastRead: new Date('2024-01-23'),
      favorite: false,
      tags: ['sci-fi', 'epic'],
      notes: [],
      highlights: [],
      type: 'epub',
      aiAnalysis: {
        complexity: 9.2,
        readingTime: 820,
        themes: ['Power and Politics', 'Ecology', 'Religion and Prophecy'],
        sentiment: 'positive',
        recommendations: ['Pay attention to the political intrigue and world-building'],
        summary: 'An epic science fiction novel set in a distant future involving noble houses, desert planets, and mystical powers.'
      }
    }
  ]);

  const [stats, setStats] = useState<ReadingStats>({
    totalBooksRead: 24,
    totalPagesRead: 8420,
    totalTimeSpent: 12600, // in minutes
    averageRating: 4.2,
    currentStreak: 7,
    favoriteGenres: ['Science Fiction', 'Classic', 'Mystery'],
    readingSpeed: 45, // pages per hour
    monthlyGoal: 4,
    monthlyProgress: 2
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastRead');
  const [filterGenre, setFilterGenre] = useState('all');
  const [activeTab, setActiveTab] = useState('library');
  const [showAddBook, setShowAddBook] = useState(false);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre === 'all' || book.genre.includes(filterGenre);
    return matchesSearch && matchesGenre;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'rating':
        return b.rating - a.rating;
      case 'progress':
        return b.progress - a.progress;
      case 'dateAdded':
        return b.dateAdded.getTime() - a.dateAdded.getTime();
      default:
        return b.lastRead.getTime() - a.lastRead.getTime();
    }
  });

  const allGenres = Array.from(new Set(books.flatMap(book => book.genre)));

  const getReadingStreak = () => {
    // Calculate reading streak based on last read dates
    return stats.currentStreak;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Library</h1>
              <p className="text-gray-600">Manage your books, track progress, and discover insights</p>
            </div>
            <Dialog open={showAddBook} onOpenChange={setShowAddBook}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Book</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Book Title</Label>
                      <Input placeholder="Enter book title" />
                    </div>
                    <div>
                      <Label>Author</Label>
                      <Input placeholder="Enter author name" />
                    </div>
                    <div>
                      <Label>Genre</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {allGenres.map((genre) => (
                            <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Upload Book File</Label>
                      <Input type="file" accept=".epub,.pdf" />
                    </div>
                    <div>
                      <Label>Reading Goal (pages/day)</Label>
                      <Slider defaultValue={[20]} max={100} step={5} />
                    </div>
                    <div>
                      <Label>Tags</Label>
                      <Input placeholder="Add tags (comma-separated)" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setShowAddBook(false)}>
                    Cancel
                  </Button>
                  <Button>Add Book</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="stats">Analytics</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="mt-6">
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search books or authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastRead">Last Read</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="dateAdded">Date Added</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterGenre} onValueChange={setFilterGenre}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {allGenres.map((genre) => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 mb-1">{book.title}</CardTitle>
                        <p className="text-gray-600 text-sm">{book.author}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={book.cover} 
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-3 w-3 ${i < book.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-xs text-gray-600 ml-1">{book.rating}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{book.progress}%</span>
                            </div>
                            <Progress value={book.progress} className="h-1" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {book.genre.slice(0, 2).map((genre) => (
                          <Badge key={genre} variant="secondary" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                        {book.genre.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{book.genre.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{Math.floor(book.timeSpent / 60)}h {book.timeSpent % 60}m</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{book.lastRead.toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Continue Reading
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className={`h-3 w-3 ${book.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      </div>

                      {/* AI Insights */}
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">AI Insights</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Complexity:</span>
                            <span className="font-medium">{book.aiAnalysis.complexity}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Est. Reading Time:</span>
                            <span className="font-medium">{Math.floor(book.aiAnalysis.readingTime / 60)}h</span>
                          </div>
                          <div>
                            <span className="text-blue-700">Themes: </span>
                            <span className="font-medium">{book.aiAnalysis.themes.slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reading" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Reading Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Monthly Goal</span>
                        <span className="text-sm text-gray-600">{stats.monthlyProgress}/{stats.monthlyGoal} books</span>
                      </div>
                      <Progress value={(stats.monthlyProgress / stats.monthlyGoal) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Current Streak</span>
                        <Badge variant="outline">{stats.currentStreak} days</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats.totalBooksRead}</p>
                        <p className="text-xs text-gray-600">Books Read</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{Math.floor(stats.totalTimeSpent / 60)}h</p>
                        <p className="text-xs text-gray-600">Time Spent</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Currently Reading</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {books.filter(book => book.progress > 0 && book.progress < 100).map(book => (
                      <div key={book.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <img src={book.cover} alt={book.title} className="w-12 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{book.title}</h4>
                          <p className="text-xs text-gray-600">{book.author}</p>
                          <div className="mt-2">
                            <Progress value={book.progress} className="h-1" />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>{book.currentPage}/{book.totalPages} pages</span>
                              <span>{book.progress}%</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <BookOpen className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalBooksRead}</p>
                      <p className="text-sm text-gray-600">Books Read</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.totalPagesRead.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Pages Read</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{Math.floor(stats.totalTimeSpent / 60)}h</p>
                      <p className="text-sm text-gray-600">Reading Time</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{stats.readingSpeed}</p>
                      <p className="text-sm text-gray-600">Pages/Hour</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Genres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.favoriteGenres.map((genre, index) => (
                      <div key={genre} className="flex items-center justify-between">
                        <span className="text-sm">{genre}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(3 - index) * 33}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{3 - index}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reading Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Average Rating Given</span>
                        <span className="text-sm font-medium">{stats.averageRating}/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${i < stats.averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Current Reading Streak</span>
                        <Badge variant="outline">{stats.currentStreak} days</Badge>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Reading Speed</span>
                        <span className="text-sm font-medium">{stats.readingSpeed} pages/hour</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discover" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Based on your reading of "Dune"</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Since you enjoy epic science fiction with complex world-building, you might like:
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline">Foundation Series</Badge>
                        <Badge variant="outline">The Expanse</Badge>
                        <Badge variant="outline">Hyperion Cantos</Badge>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Continue Your Classic Literature Journey</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        After "The Great Gatsby", consider these American classics:
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline">To Kill a Mockingbird</Badge>
                        <Badge variant="outline">Of Mice and Men</Badge>
                        <Badge variant="outline">The Catcher in the Rye</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reading Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium">Genre Explorer</h4>
                      <p className="text-xs text-gray-600 mb-2">Read 3 books from different genres</p>
                      <Progress value={66} className="h-1" />
                      <p className="text-xs text-gray-500 mt-1">2/3 completed</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium">Speed Reader</h4>
                      <p className="text-xs text-gray-600 mb-2">Read 500 pages this week</p>
                      <Progress value={80} className="h-1" />
                      <p className="text-xs text-gray-500 mt-1">400/500 pages</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium">Note Taker</h4>
                      <p className="text-xs text-gray-600 mb-2">Make 25 notes or highlights</p>
                      <Progress value={40} className="h-1" />
                      <p className="text-xs text-gray-500 mt-1">10/25 notes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}