import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Highlighter,
  MessageSquare,
  Tag,
  Search,
  Filter,
  Star,
  Bookmark,
  Share,
  Download,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Quote,
  Brain,
  Lightbulb,
  Link,
  Calendar,
  Clock,
  User,
  Hash,
  Palette,
  Type,
  AlignLeft,
  List,
  CheckSquare,
  Paperclip,
  Camera,
  Mic,
  Volume2,
  Copy,
  ExternalLink
} from 'lucide-react';

interface Annotation {
  id: string;
  type: 'highlight' | 'note' | 'bookmark' | 'question' | 'summary' | 'quote';
  content: string;
  selectedText?: string;
  position: {
    page: number;
    startOffset: number;
    endOffset: number;
    x: number;
    y: number;
  };
  color: string;
  tags: string[];
  isPrivate: boolean;
  created: Date;
  modified?: Date;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  replies?: AnnotationReply[];
  aiInsights?: AIInsight[];
  linkedAnnotations?: string[];
  attachments?: Attachment[];
  importance: 1 | 2 | 3 | 4 | 5;
}

interface AnnotationReply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  created: Date;
}

interface AIInsight {
  type: 'definition' | 'context' | 'connection' | 'analysis';
  content: string;
  confidence: number;
  sources?: string[];
}

interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'link' | 'document';
  name: string;
  url: string;
  size?: number;
}

interface AnnotationTemplate {
  id: string;
  name: string;
  type: Annotation['type'];
  structure: string;
  color: string;
  tags: string[];
}

interface StudySession {
  id: string;
  name: string;
  bookId: string;
  annotations: string[];
  created: Date;
  duration: number;
  goals: string[];
  completed: boolean;
}

export default function AdvancedAnnotationSystem() {
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      type: 'highlight',
      content: 'Key concept about American Dream symbolism',
      selectedText: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
      position: { page: 180, startOffset: 1250, endOffset: 1320, x: 150, y: 450 },
      color: '#fbbf24',
      tags: ['symbolism', 'american-dream', 'key-quote'],
      isPrivate: false,
      created: new Date('2024-01-20T14:30:00'),
      author: { id: '1', name: 'John Doe', avatar: '/placeholder.svg' },
      importance: 5,
      aiInsights: [
        {
          type: 'analysis',
          content: 'This closing line represents the central theme of the impossibility of recapturing the past, which relates to Gatsby\'s pursuit of Daisy and the broader American Dream.',
          confidence: 0.92,
          sources: ['Literary Analysis Database', 'F. Scott Fitzgerald Studies']
        }
      ]
    },
    {
      id: '2',
      type: 'note',
      content: 'The green light serves as a symbol throughout the novel. Here it represents hope and the unattainable dream. Fitzgerald uses color symbolism extensively.',
      selectedText: 'green light that burns all night at the end of Daisy\'s dock',
      position: { page: 25, startOffset: 580, endOffset: 650, x: 200, y: 300 },
      color: '#10b981',
      tags: ['symbolism', 'green-light', 'analysis'],
      isPrivate: false,
      created: new Date('2024-01-18T09:15:00'),
      author: { id: '1', name: 'John Doe', avatar: '/placeholder.svg' },
      importance: 4,
      replies: [
        {
          id: 'r1',
          content: 'Great observation! The green light also connects to the broader theme of money and wealth in the novel.',
          author: { id: '2', name: 'Study Group', avatar: '/placeholder.svg' },
          created: new Date('2024-01-18T10:00:00')
        }
      ]
    },
    {
      id: '3',
      type: 'question',
      content: 'Why does Fitzgerald choose to tell the story through Nick\'s perspective rather than Gatsby\'s?',
      position: { page: 15, startOffset: 200, endOffset: 200, x: 100, y: 200 },
      color: '#8b5cf6',
      tags: ['narrative', 'perspective', 'technique'],
      isPrivate: true,
      created: new Date('2024-01-16T16:45:00'),
      author: { id: '1', name: 'John Doe', avatar: '/placeholder.svg' },
      importance: 3
    }
  ]);

  const [templates] = useState<AnnotationTemplate[]>([
    {
      id: '1',
      name: 'Character Analysis',
      type: 'note',
      structure: '**Character:** [Name]\n**Traits:** \n**Development:** \n**Significance:** ',
      color: '#3b82f6',
      tags: ['character', 'analysis']
    },
    {
      id: '2',
      name: 'Theme Identification',
      type: 'highlight',
      structure: '**Theme:** \n**Evidence:** \n**Connection:** ',
      color: '#10b981',
      tags: ['theme', 'analysis']
    },
    {
      id: '3',
      name: 'Literary Device',
      type: 'note',
      structure: '**Device:** \n**Example:** \n**Effect:** \n**Purpose:** ',
      color: '#f59e0b',
      tags: ['literary-device', 'technique']
    }
  ]);

  const [studySessions] = useState<StudySession[]>([
    {
      id: '1',
      name: 'Chapter 1-3 Analysis',
      bookId: 'gatsby-1',
      annotations: ['1', '2'],
      created: new Date('2024-01-15'),
      duration: 120,
      goals: ['Identify main themes', 'Character introductions', 'Setting analysis'],
      completed: true
    }
  ]);

  const [activeTab, setActiveTab] = useState('annotations');
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [showAIInsights, setShowAIInsights] = useState(true);

  const [newAnnotation, setNewAnnotation] = useState({
    type: 'highlight' as Annotation['type'],
    content: '',
    selectedText: '',
    color: '#fbbf24',
    tags: [] as string[],
    isPrivate: false,
    importance: 3 as Annotation['importance']
  });

  const colorOptions = [
    { name: 'Yellow', value: '#fbbf24', class: 'bg-yellow-400' },
    { name: 'Green', value: '#10b981', class: 'bg-green-500' },
    { name: 'Blue', value: '#3b82f6', class: 'bg-blue-500' },
    { name: 'Purple', value: '#8b5cf6', class: 'bg-purple-500' },
    { name: 'Pink', value: '#ec4899', class: 'bg-pink-500' },
    { name: 'Orange', value: '#f59e0b', class: 'bg-orange-500' }
  ];

  const allTags = Array.from(new Set(annotations.flatMap(a => a.tags)));

  const filteredAnnotations = annotations.filter(annotation => {
    const matchesType = filterType === 'all' || annotation.type === filterType;
    const matchesTags = filterTags.length === 0 || filterTags.some(tag => annotation.tags.includes(tag));
    const matchesSearch = searchTerm === '' || 
      annotation.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annotation.selectedText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annotation.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesTags && matchesSearch;
  });

  const sortedAnnotations = [...filteredAnnotations].sort((a, b) => {
    switch (sortBy) {
      case 'importance':
        return b.importance - a.importance;
      case 'page':
        return a.position.page - b.position.page;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return b.created.getTime() - a.created.getTime();
    }
  });

  const getTypeIcon = (type: Annotation['type']) => {
    const icons = {
      highlight: Highlighter,
      note: MessageSquare,
      bookmark: Bookmark,
      question: Lightbulb,
      summary: AlignLeft,
      quote: Quote
    };
    return icons[type] || MessageSquare;
  };

  const getTypeColor = (type: Annotation['type']) => {
    const colors = {
      highlight: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      note: 'bg-blue-100 text-blue-800 border-blue-200',
      bookmark: 'bg-green-100 text-green-800 border-green-200',
      question: 'bg-purple-100 text-purple-800 border-purple-200',
      summary: 'bg-orange-100 text-orange-800 border-orange-200',
      quote: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || colors.note;
  };

  const createAnnotation = () => {
    const annotation: Annotation = {
      id: Date.now().toString(),
      type: newAnnotation.type,
      content: newAnnotation.content,
      selectedText: newAnnotation.selectedText,
      position: {
        page: 1,
        startOffset: 0,
        endOffset: 0,
        x: 100,
        y: 100
      },
      color: newAnnotation.color,
      tags: newAnnotation.tags,
      isPrivate: newAnnotation.isPrivate,
      created: new Date(),
      author: { id: '1', name: 'John Doe', avatar: '/placeholder.svg' },
      importance: newAnnotation.importance
    };

    setAnnotations(prev => [...prev, annotation]);
    setNewAnnotation({
      type: 'highlight',
      content: '',
      selectedText: '',
      color: '#fbbf24',
      tags: [],
      isPrivate: false,
      importance: 3
    });
    setShowCreateDialog(false);
  };

  const exportAnnotations = (format: 'json' | 'markdown' | 'pdf') => {
    // Implementation would depend on the chosen format
    console.log(`Exporting annotations as ${format}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Annotations & Notes</h1>
              <p className="text-gray-600">Advanced note-taking and annotation system with AI insights</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => exportAnnotations('markdown')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Annotation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Annotation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Type</Label>
                        <Select value={newAnnotation.type} onValueChange={(value: any) => 
                          setNewAnnotation(prev => ({ ...prev, type: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="highlight">Highlight</SelectItem>
                            <SelectItem value="note">Note</SelectItem>
                            <SelectItem value="bookmark">Bookmark</SelectItem>
                            <SelectItem value="question">Question</SelectItem>
                            <SelectItem value="summary">Summary</SelectItem>
                            <SelectItem value="quote">Quote</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Importance</Label>
                        <Select value={newAnnotation.importance.toString()} onValueChange={(value: any) => 
                          setNewAnnotation(prev => ({ ...prev, importance: parseInt(value) }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">⭐ Low</SelectItem>
                            <SelectItem value="2">⭐⭐ Medium-Low</SelectItem>
                            <SelectItem value="3">⭐⭐⭐ Medium</SelectItem>
                            <SelectItem value="4">⭐⭐⭐⭐ High</SelectItem>
                            <SelectItem value="5">⭐⭐⭐⭐⭐ Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Selected Text (optional)</Label>
                      <Input
                        value={newAnnotation.selectedText}
                        onChange={(e) => setNewAnnotation(prev => ({ ...prev, selectedText: e.target.value }))}
                        placeholder="Text you want to highlight or reference"
                      />
                    </div>

                    <div>
                      <Label>Annotation Content</Label>
                      <Textarea
                        value={newAnnotation.content}
                        onChange={(e) => setNewAnnotation(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Your thoughts, notes, questions..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label>Color</Label>
                      <div className="flex gap-2 mt-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                              newAnnotation.color === color.value ? 'border-gray-800' : 'border-gray-300'
                            }`}
                            onClick={() => setNewAnnotation(prev => ({ ...prev, color: color.value }))}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Tags (comma-separated)</Label>
                      <Input
                        value={newAnnotation.tags.join(', ')}
                        onChange={(e) => setNewAnnotation(prev => ({ 
                          ...prev, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        }))}
                        placeholder="analysis, character, theme"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="private"
                        checked={newAnnotation.isPrivate}
                        onCheckedChange={(checked) => setNewAnnotation(prev => ({ ...prev, isPrivate: checked }))}
                      />
                      <Label htmlFor="private">Private annotation</Label>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createAnnotation}>Create Annotation</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="annotations">Annotations</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="annotations" className="mt-6">
            {/* Filters and Search */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search annotations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="highlight">Highlights</SelectItem>
                    <SelectItem value="note">Notes</SelectItem>
                    <SelectItem value="bookmark">Bookmarks</SelectItem>
                    <SelectItem value="question">Questions</SelectItem>
                    <SelectItem value="summary">Summaries</SelectItem>
                    <SelectItem value="quote">Quotes</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created">Most Recent</SelectItem>
                    <SelectItem value="importance">Importance</SelectItem>
                    <SelectItem value="page">Page Order</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tag Filter */}
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filterTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setFilterTags(prev => 
                        prev.includes(tag) 
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Options */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ai-insights"
                    checked={showAIInsights}
                    onCheckedChange={setShowAIInsights}
                  />
                  <Label htmlFor="ai-insights">Show AI Insights</Label>
                </div>
              </div>
            </div>

            {/* Annotations List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedAnnotations.map((annotation) => {
                const TypeIcon = getTypeIcon(annotation.type);
                return (
                  <Card key={annotation.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className={`p-2 rounded-lg ${getTypeColor(annotation.type)}`}
                          >
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <Badge className={getTypeColor(annotation.type)}>
                              {annotation.type}
                            </Badge>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">Page {annotation.position.page}</span>
                              <div className="flex">
                                {[...Array(annotation.importance)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {annotation.isPrivate && <Eye className="h-4 w-4 text-gray-400" />}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {annotation.selectedText && (
                          <div 
                            className="p-3 rounded border-l-4"
                            style={{ borderLeftColor: annotation.color }}
                          >
                            <Quote className="h-4 w-4 text-gray-400 mb-2" />
                            <p className="text-sm italic text-gray-700">"{annotation.selectedText}"</p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm">{annotation.content}</p>
                        </div>

                        {annotation.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {annotation.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {showAIInsights && annotation.aiInsights && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">AI Insight</span>
                              <Badge variant="outline" className="text-xs">
                                {Math.round(annotation.aiInsights[0].confidence * 100)}% confidence
                              </Badge>
                            </div>
                            <p className="text-sm text-blue-700">{annotation.aiInsights[0].content}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={annotation.author.avatar} />
                              <AvatarFallback className="text-xs">{annotation.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-600">{annotation.author.name}</span>
                            <span className="text-xs text-gray-400">
                              {annotation.created.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Share className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Link className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {annotation.replies && annotation.replies.length > 0 && (
                          <div className="space-y-2 pt-2 border-t">
                            <h4 className="text-xs font-medium text-gray-700">Replies ({annotation.replies.length})</h4>
                            {annotation.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-2 p-2 bg-gray-50 rounded">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={reply.author.avatar} />
                                  <AvatarFallback className="text-xs">{reply.author.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-xs">{reply.content}</p>
                                  <span className="text-xs text-gray-500">{reply.author.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Study Sessions</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Session
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studySessions.map((session) => (
                  <Card key={session.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{session.name}</span>
                        <Badge variant={session.completed ? 'default' : 'outline'}>
                          {session.completed ? 'Completed' : 'In Progress'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration</span>
                          <span>{session.duration} minutes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Annotations</span>
                          <span>{session.annotations.length}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Goals:</span>
                          <ul className="list-disc list-inside text-sm mt-1">
                            {session.goals.map((goal, index) => (
                              <li key={index} className="text-gray-800">{goal}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Annotation Templates</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: template.color }}
                        ></div>
                        {template.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Badge className={getTypeColor(template.type)}>
                          {template.type}
                        </Badge>
                        <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                          <pre className="whitespace-pre-wrap">{template.structure}</pre>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" className="w-full">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">Key Themes Identified</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-purple-100 text-purple-800">American Dream</Badge>
                        <Badge className="bg-purple-100 text-purple-800">Social Class</Badge>
                        <Badge className="bg-purple-100 text-purple-800">Symbolism</Badge>
                        <Badge className="bg-purple-100 text-purple-800">Morality</Badge>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Analysis Depth Score</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={78} className="flex-1" />
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">Strong thematic analysis, consider adding more textual evidence</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Annotation Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-2xl font-bold text-blue-600">{annotations.length}</p>
                        <p className="text-xs text-gray-600">Total Annotations</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-2xl font-bold text-green-600">
                          {annotations.filter(a => a.type === 'highlight').length}
                        </p>
                        <p className="text-xs text-gray-600">Highlights</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-2xl font-bold text-purple-600">
                          {annotations.filter(a => a.type === 'note').length}
                        </p>
                        <p className="text-xs text-gray-600">Notes</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-2xl font-bold text-orange-600">
                          {annotations.filter(a => a.importance >= 4).length}
                        </p>
                        <p className="text-xs text-gray-600">High Priority</p>
                      </div>
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