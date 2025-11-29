import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "@phosphor-icons/react"
import { toast } from "sonner"

interface CodeExample {
  id: string
  title: string
  description: string
  language: string
  filename: string
  code: string
  tags: string[]
}

const codeExamples: CodeExample[] = [
  {
    id: "mcp-server",
    title: "AI-Native MCP Server",
    description: "Multi-provider financial data orchestration with intelligent routing",
    language: "python",
    filename: "orchestrator.py",
    code: `from typing import AsyncIterator
from dataclasses import dataclass
from enum import Enum
import asyncio

class ProviderPriority(Enum):
    PRIMARY = 1
    SECONDARY = 2
    FALLBACK = 3

@dataclass
class ProviderConfig:
    name: str
    priority: ProviderPriority
    rate_limit: int
    timeout: float = 30.0

class IntelligentOrchestrator:
    """Orchestrates multi-provider financial data with 
    intelligent fallback and load balancing."""
    
    def __init__(self, providers: list[ProviderConfig]):
        self.providers = sorted(providers, key=lambda p: p.priority.value)
        self._rate_limiters = {}
        self._circuit_breakers = {}
    
    async def fetch_with_fallback(
        self, 
        query: str,
        required_fields: list[str]
    ) -> AsyncIterator[dict]:
        """Fetch data with automatic provider fallback."""
        errors = []
        
        for provider in self.providers:
            if self._is_circuit_open(provider.name):
                continue
                
            try:
                async with self._rate_limit(provider):
                    result = await self._fetch(provider, query)
                    if self._validates(result, required_fields):
                        yield result
                        return
            except ProviderError as e:
                errors.append((provider.name, e))
                self._record_failure(provider.name)
        
        raise OrchestratorError(f"All providers failed: {errors}")`,
    tags: ["Python", "AsyncIO", "MCP", "API Design"]
  },
  {
    id: "react-hook",
    title: "Custom React Hook",
    description: "Type-safe async data fetching with caching and retry logic",
    language: "typescript",
    filename: "useAsyncData.ts",
    code: `import { useState, useEffect, useCallback, useRef } from 'react'

interface UseAsyncDataOptions<T> {
  initialData?: T
  cacheKey?: string
  cacheTime?: number
  retryCount?: number
  retryDelay?: number
}

interface AsyncState<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const cache = new Map<string, { data: unknown; timestamp: number }>()

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
): AsyncState<T> {
  const {
    initialData,
    cacheKey,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retryCount = 3,
    retryDelay = 1000
  } = options
  
  const [state, setState] = useState<{
    data: T | undefined
    isLoading: boolean
    error: Error | null
  }>({
    data: initialData,
    isLoading: !initialData,
    error: null
  })
  
  const retryRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  
  const execute = useCallback(async () => {
    // Check cache first
    if (cacheKey) {
      const cached = cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < cacheTime) {
        setState({ data: cached.data as T, isLoading: false, error: null })
        return
      }
    }
    
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const data = await fetcher()
      
      if (cacheKey) {
        cache.set(cacheKey, { data, timestamp: Date.now() })
      }
      
      setState({ data, isLoading: false, error: null })
      retryRef.current = 0
    } catch (error) {
      if (retryRef.current < retryCount) {
        retryRef.current++
        setTimeout(execute, retryDelay * retryRef.current)
        return
      }
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error as Error 
      }))
    }
  }, [fetcher, cacheKey, cacheTime, retryCount, retryDelay])
  
  useEffect(() => {
    execute()
    return () => abortRef.current?.abort()
  }, [execute])
  
  return { ...state, refetch: execute }
}`,
    tags: ["TypeScript", "React", "Hooks", "Caching"]
  },
  {
    id: "gpu-optimization",
    title: "GPU Kernel Optimization",
    description: "CUDA kernel for parallel matrix operations with shared memory",
    language: "cuda",
    filename: "fast_matmul.cu",
    code: `#define TILE_SIZE 32

__global__ void optimized_matmul(
    const float* __restrict__ A,
    const float* __restrict__ B,
    float* __restrict__ C,
    const int M, const int N, const int K
) {
    // Shared memory tiles for coalesced access
    __shared__ float tileA[TILE_SIZE][TILE_SIZE + 1]; // +1 to avoid bank conflicts
    __shared__ float tileB[TILE_SIZE][TILE_SIZE + 1];
    
    const int row = blockIdx.y * TILE_SIZE + threadIdx.y;
    const int col = blockIdx.x * TILE_SIZE + threadIdx.x;
    
    float sum = 0.0f;
    
    // Iterate over tiles
    for (int t = 0; t < (K + TILE_SIZE - 1) / TILE_SIZE; ++t) {
        // Collaborative loading with bounds checking
        const int aCol = t * TILE_SIZE + threadIdx.x;
        const int bRow = t * TILE_SIZE + threadIdx.y;
        
        tileA[threadIdx.y][threadIdx.x] = 
            (row < M && aCol < K) ? A[row * K + aCol] : 0.0f;
        tileB[threadIdx.y][threadIdx.x] = 
            (bRow < K && col < N) ? B[bRow * N + col] : 0.0f;
        
        __syncthreads();
        
        // Compute partial dot product with loop unrolling
        #pragma unroll
        for (int k = 0; k < TILE_SIZE; ++k) {
            sum = fmaf(tileA[threadIdx.y][k], tileB[k][threadIdx.x], sum);
        }
        
        __syncthreads();
    }
    
    // Write result
    if (row < M && col < N) {
        C[row * N + col] = sum;
    }
}

// Host wrapper with stream support
void launch_matmul(
    const float* d_A, const float* d_B, float* d_C,
    int M, int N, int K, cudaStream_t stream = 0
) {
    dim3 blocks((N + TILE_SIZE - 1) / TILE_SIZE, 
                (M + TILE_SIZE - 1) / TILE_SIZE);
    dim3 threads(TILE_SIZE, TILE_SIZE);
    
    optimized_matmul<<<blocks, threads, 0, stream>>>(d_A, d_B, d_C, M, N, K);
}`,
    tags: ["CUDA", "GPU", "Performance", "HPC"]
  },
  {
    id: "ml-pipeline",
    title: "ML Pipeline Architecture",
    description: "Production ML inference pipeline with batching and monitoring",
    language: "python",
    filename: "inference_pipeline.py",
    code: `from typing import TypeVar, Generic, Callable
from dataclasses import dataclass, field
from collections import deque
import asyncio
import time

T = TypeVar('T')
R = TypeVar('R')

@dataclass
class BatchConfig:
    max_batch_size: int = 32
    max_wait_ms: float = 50.0
    
@dataclass 
class PipelineMetrics:
    total_requests: int = 0
    total_batches: int = 0
    avg_batch_size: float = 0.0
    avg_latency_ms: float = 0.0
    p99_latency_ms: float = 0.0
    _latencies: deque = field(default_factory=lambda: deque(maxlen=1000))

class InferencePipeline(Generic[T, R]):
    """High-throughput ML inference with dynamic batching."""
    
    def __init__(
        self,
        model_fn: Callable[[list[T]], list[R]],
        config: BatchConfig = BatchConfig()
    ):
        self.model_fn = model_fn
        self.config = config
        self.metrics = PipelineMetrics()
        
        self._queue: asyncio.Queue[tuple[T, asyncio.Future]] = asyncio.Queue()
        self._batch_task: asyncio.Task | None = None
        
    async def start(self):
        """Start the batching background task."""
        self._batch_task = asyncio.create_task(self._batch_loop())
        
    async def predict(self, input: T) -> R:
        """Submit input and await result."""
        future: asyncio.Future[R] = asyncio.get_event_loop().create_future()
        await self._queue.put((input, future))
        return await future
        
    async def _batch_loop(self):
        """Continuously form and process batches."""
        while True:
            batch: list[tuple[T, asyncio.Future]] = []
            deadline = time.monotonic() + self.config.max_wait_ms / 1000
            
            # Collect batch
            while len(batch) < self.config.max_batch_size:
                timeout = max(0, deadline - time.monotonic())
                try:
                    item = await asyncio.wait_for(
                        self._queue.get(), 
                        timeout=timeout
                    )
                    batch.append(item)
                except asyncio.TimeoutError:
                    break
                    
            if not batch:
                continue
                
            # Process batch
            start = time.monotonic()
            inputs = [item[0] for item in batch]
            
            try:
                results = await asyncio.to_thread(self.model_fn, inputs)
                for (_, future), result in zip(batch, results):
                    future.set_result(result)
            except Exception as e:
                for _, future in batch:
                    future.set_exception(e)
                    
            # Update metrics
            latency = (time.monotonic() - start) * 1000
            self._update_metrics(len(batch), latency)`,
    tags: ["Python", "ML", "Async", "Production"]
  }
]

// Simple syntax highlighting (in production, use Prism or Shiki)
function highlightCode(code: string, language: string): string {
  const keywords: Record<string, string[]> = {
    python: ['def', 'class', 'async', 'await', 'from', 'import', 'return', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'with', 'as', 'yield', 'raise', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'lambda', 'pass', 'break', 'continue'],
    typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'extends', 'implements', 'readonly', 'private', 'public', 'static', 'true', 'false', 'null', 'undefined'],
    cuda: ['__global__', '__shared__', '__device__', '__host__', 'const', 'void', 'int', 'float', 'for', 'if', 'return', 'struct', 'typedef', 'define', 'pragma']
  }
  
  const langKeywords = keywords[language] || keywords['python']
  
  // Escape HTML
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Highlight strings
  escaped = escaped.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="text-green-500 dark:text-green-400">$&</span>')
  
  // Highlight comments
  escaped = escaped.replace(/(#.*$|\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="text-muted-foreground italic">$&</span>')
  
  // Highlight keywords
  langKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g')
    escaped = escaped.replace(regex, '<span class="text-primary font-medium">$1</span>')
  })
  
  // Highlight numbers
  escaped = escaped.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-amber-500 dark:text-amber-400">$1</span>')
  
  // Highlight function calls
  escaped = escaped.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="text-blue-500 dark:text-blue-400">$1</span>(')
  
  // Highlight decorators (Python)
  escaped = escaped.replace(/(@\w+)/g, '<span class="text-purple-500 dark:text-purple-400">$1</span>')
  
  return escaped
}

export function CodeShowcase() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const copyToClipboard = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(id)
    toast.success("Code copied to clipboard!")
    setTimeout(() => setCopiedId(null), 2000)
  }
  
  return (
    <Card className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Code Samples</h3>
        <p className="text-muted-foreground">
          Examples demonstrating clean architecture, performance optimization, and production-ready patterns
        </p>
      </div>
      
      <Tabs defaultValue={codeExamples[0].id} className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 mb-6 bg-muted/50 p-1">
          {codeExamples.map((example) => (
            <TabsTrigger 
              key={example.id} 
              value={example.id}
              className="flex-1 min-w-[120px] text-xs sm:text-sm"
            >
              {example.title.split(' ').slice(0, 2).join(' ')}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {codeExamples.map((example) => (
          <TabsContent key={example.id} value={example.id}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <h4 className="text-lg font-semibold">{example.title}</h4>
                <p className="text-sm text-muted-foreground">{example.description}</p>
              </div>
              
              {/* Code Block */}
              <div className="relative rounded-lg overflow-hidden border border-border bg-zinc-950 dark:bg-zinc-900">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 dark:bg-zinc-800 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-xs text-zinc-400 ml-2 font-mono">{example.filename}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(example.code, example.id)}
                    className="h-7 text-xs text-zinc-400 hover:text-white"
                  >
                    {copiedId === example.id ? (
                      <><Check size={14} className="mr-1" /> Copied</>
                    ) : (
                      <><Copy size={14} className="mr-1" /> Copy</>
                    )}
                  </Button>
                </div>
                
                {/* Code Content */}
                <div className="overflow-x-auto">
                  <pre className="p-4 text-sm font-mono leading-relaxed text-zinc-100">
                    <code 
                      dangerouslySetInnerHTML={{ 
                        __html: highlightCode(example.code, example.language) 
                      }} 
                    />
                  </pre>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {example.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}
