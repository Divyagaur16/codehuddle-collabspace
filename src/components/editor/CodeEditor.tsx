
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  Play,
  Save,
  Share,
  Settings,
  ChevronDown,
  Download,
  Copy,
  Github,
  FileCode,
  Trash,
  Plus
} from 'lucide-react';
import { Language } from '@/types';

type CodeEditorProps = {
  roomId: string;
};

const CodeEditor = ({ roomId }: CodeEditorProps) => {
  const [code, setCode] = useState('// Start coding here...');
  const [language, setLanguage] = useState<Language>('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Simulated files
  const [files, setFiles] = useState([
    { id: '1', name: 'index.js', language: 'javascript', content: '// Start coding here...' },
    { id: '2', name: 'styles.css', language: 'css', content: '/* Add your styles here */' }
  ]);
  
  const [activeFileId, setActiveFileId] = useState('1');
  
  const activeFile = files.find(file => file.id === activeFileId);
  
  useEffect(() => {
    if (activeFile) {
      setCode(activeFile.content);
      setLanguage(activeFile.language as Language);
    }
  }, [activeFileId, activeFile]);
  
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    
    // Update file content
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === activeFileId 
          ? { ...file, content: newCode } 
          : file
      )
    );
    
    // Simulate sending to server/peers
    console.log('Code updated, sending to peers...');
  };
  
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    setError(null);
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (language === 'javascript' || language === 'typescript') {
        try {
          // Just a demo - would be unsafe in production
          // eslint-disable-next-line no-new-func
          const result = Function(`"use strict"; return (function() { ${code} \n return 'Code executed successfully'; })()`)();
          setOutput(result);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
        }
      } else {
        // For other languages, just show a demo output
        setOutput('Code executed successfully.\nSimulated output for ' + language);
      }
    } catch (err) {
      setError('Failed to run code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleSaveCode = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Code saved successfully');
    } catch (error) {
      toast.error('Failed to save code');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleShareCode = () => {
    // Copy room link to clipboard
    navigator.clipboard.writeText(`https://codehuddle.io/room/${roomId}`);
    toast.success('Room link copied to clipboard');
  };
  
  const handleAddFile = () => {
    const newFileId = Date.now().toString();
    const newFile = {
      id: newFileId,
      name: `file-${files.length + 1}.js`,
      language: 'javascript' as Language,
      content: '// New file content'
    };
    
    setFiles([...files, newFile]);
    setActiveFileId(newFileId);
    toast.success('New file added');
  };
  
  const handleDeleteFile = (fileId: string) => {
    if (files.length <= 1) {
      toast.error('Cannot delete the only file');
      return;
    }
    
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    
    if (activeFileId === fileId) {
      setActiveFileId(files.find(file => file.id !== fileId)?.id || '');
    }
    
    toast.success('File deleted');
  };
  
  return (
    <div className="flex flex-col h-full border rounded-lg border-border overflow-hidden">
      {/* Editor toolbar */}
      <div className="border-b border-border p-2 bg-card flex items-center justify-between">
        <div className="flex items-center overflow-x-auto hide-scrollbar">
          {files.map(file => (
            <button
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`px-3 py-1.5 rounded-md mr-1 text-sm font-medium flex items-center ${
                activeFileId === file.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-secondary text-muted-foreground'
              }`}
            >
              <FileCode className="h-3.5 w-3.5 mr-1.5" />
              {file.name}
              {files.length > 1 && activeFileId !== file.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file.id);
                  }}
                  className="ml-1.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash className="h-3 w-3" />
                </button>
              )}
            </button>
          ))}
          
          <button
            onClick={handleAddFile}
            className="px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-secondary"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                {language}
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Languages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <LanguageMenuItem language="javascript" currentLanguage={language} onSelect={setLanguage} />
              <LanguageMenuItem language="typescript" currentLanguage={language} onSelect={setLanguage} />
              <LanguageMenuItem language="python" currentLanguage={language} onSelect={setLanguage} />
              <LanguageMenuItem language="java" currentLanguage={language} onSelect={setLanguage} />
              <LanguageMenuItem language="html" currentLanguage={language} onSelect={setLanguage} />
              <LanguageMenuItem language="css" currentLanguage={language} onSelect={setLanguage} />
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={handleSaveCode}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={handleShareCode}
          >
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
          
          <Button
            size="sm"
            variant="default"
            className="h-8"
            onClick={handleRunCode}
            disabled={isRunning}
          >
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
        </div>
      </div>
      
      {/* Editor area */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Code editor */}
        <div className="flex-1 overflow-auto bg-code text-code-foreground font-mono p-4 text-sm min-h-[200px]">
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full h-full bg-transparent outline-none resize-none font-mono"
            spellCheck="false"
          />
        </div>
        
        {/* Output panel (hidden by default on mobile, toggled on run) */}
        {(output || error || isRunning) && (
          <div className="border-t md:border-t-0 md:border-l border-border bg-background w-full md:w-2/5 flex flex-col overflow-hidden">
            <div className="p-2 border-b border-border bg-muted/30 text-sm font-medium">
              Output
            </div>
            <div className="p-4 flex-1 overflow-auto font-mono text-sm">
              {isRunning ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse">Running code...</div>
                </div>
              ) : error ? (
                <div className="text-destructive whitespace-pre-wrap">{error}</div>
              ) : (
                <div className="whitespace-pre-wrap">{output}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LanguageMenuItem = ({ 
  language, 
  currentLanguage, 
  onSelect 
}: { 
  language: Language; 
  currentLanguage: Language; 
  onSelect: (lang: Language) => void;
}) => (
  <DropdownMenuItem 
    className={currentLanguage === language ? 'bg-primary/10 text-primary' : ''}
    onClick={() => onSelect(language)}
  >
    {language}
  </DropdownMenuItem>
);

export default CodeEditor;
