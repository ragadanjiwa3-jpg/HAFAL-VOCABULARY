import { useState } from 'react';
import { Search, Filter, BookOpen, Volume2, Trash2 } from 'lucide-react';
import { Word } from '../types';

export default function Library() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Local state for demo
  const [words] = useState<Word[]>([
    {
      id: '1',
      term: 'Ephemeral',
      phonetic: '/ɪˈfɛm(ə)r(ə)l/',
      definition: 'Lasting for a very short time; transient.',
      translation: 'Singkat, tidak kekal, hanya sementara.',
      partOfSpeech: 'Adjective',
      difficulty: 'Advanced',
      example: 'The beauty of the sunset was ephemeral, fading into darkness within minutes.'
    },
    {
      id: '2',
      term: 'Serendipity',
      phonetic: '/ˌsɛrənˈdɪpɪti/',
      definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
      translation: 'Kebetulan yang menyenangkan.',
      partOfSpeech: 'Noun',
      difficulty: 'Advanced',
      example: 'It was purely serendipity that we met each other in that small bookstore.'
    },
    {
      id: '3',
      term: 'Pragmatic',
      phonetic: '/praɡˈmatɪk/',
      definition: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
      translation: 'Berpikir praktis, realistis.',
      partOfSpeech: 'Adjective',
      difficulty: 'Intermediate',
      example: 'She made a pragmatic decision to save money instead of buying a new car.'
    }
  ]);

  const filteredWords = words.filter(w => 
    w.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Word Library</h1>
          <p className="text-slate-500">Track and review every word you've discovered.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-w-[280px]"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWords.map(word => (
          <div key={word.id} className="glass-card p-6 flex flex-col group hover:border-indigo-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                {word.difficulty}
              </span>
              <button className="text-slate-300 hover:text-rose-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{word.term}</h3>
            <p className="text-sm text-slate-400 italic mb-4">{word.phonetic}</p>
            
            <p className="text-slate-600 text-sm mb-4 line-clamp-2">"{word.definition}"</p>
            
            <div className="flex items-center gap-2 text-indigo-600 mb-6">
              <span className="text-xs font-bold uppercase">ID:</span>
              <span className="font-medium text-sm">{word.translation}</span>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
              <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                <BookOpen size={14} /> Full Definition
              </button>
              <button className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <Volume2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredWords.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Search size={32} />
          </div>
          <p className="text-slate-500 font-medium">No words matching "{searchTerm}" found.</p>
        </div>
      )}
    </div>
  );
}
