import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { volcengineConfig, unsplashConfig, apiEndpoints, devConfig } from '@/config/api-config';
import { AlertCircle, CheckCircle2, RefreshCw, Info } from 'lucide-react';
import { testVolcengineAPI, testUnsplashAPI, TestResult } from '@/services/api-test-service';
import { useHistoryActions } from '../contexts/history-context';

// API测试组件
export function ApiTest() {
  const { addApiTestRecord } = useHistoryActions();
  const [loading, setLoading] = useState<{
    unsplash: boolean;
    volcengine: boolean;
  }>({
    unsplash: false,
    volcengine: false
  });
  
  const [results, setResults] = useState<{
    unsplash: { success: boolean; message: string; imageUrl?: string; rawData?: any };
    volcengine: { success: boolean; message: string; response?: string; rawData?: any };
  }>({
    unsplash: { success: false, message: '未测试' },
    volcengine: { success: false, message: '未测试' }
  });
  
  const [showRawData, setShowRawData] = useState(false);
  
  // 检查是否使用模拟数据
  useEffect(() => {
    if (devConfig.useLocalMockData) {
      alert('警告：当前配置使用的是模拟数据，而不是真实API调用。请在api-config.ts中将useLocalMockData设置为false以使用真实API。');
    }
  }, []);

  const [prompt, setPrompt] = useState<string>("你好，请用一句话介绍自己");
  const [imageKeyword, setImageKeyword] = useState<string>("营养咨询");

  // 测试Unsplash API
  const testUnsplashApi = async () => {
    setLoading(prev => ({ ...prev, unsplash: true }));
    
    try {
      // 使用测试服务
      const result = await testUnsplashAPI(imageKeyword);
      
      setResults(prev => ({
        ...prev,
        unsplash: {
          success: result.success,
          message: result.message,
          imageUrl: result.data?.imageUrl
        }
      }));
      
      // 保存到历史记录
      addApiTestRecord(`Unsplash API - ${imageKeyword}`, {
        type: 'unsplash',
        keyword: imageKeyword,
        success: result.success,
        message: result.message,
        imageUrl: result.data?.imageUrl
      });
    } catch (error) {
      console.error('调用测试服务失败:', error);
      setResults(prev => ({
        ...prev,
        unsplash: {
          success: false,
          message: `测试服务错误: ${error instanceof Error ? error.message : String(error)}`
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, unsplash: false }));
    }
  };

  // 测试火山方舟API
  const testVolcengineApi = async () => {
    setLoading(prev => ({ ...prev, volcengine: true }));
    
    try {
      // 使用测试服务
      const result = await testVolcengineAPI(prompt);
      
      setResults(prev => ({
        ...prev,
        volcengine: {
          success: result.success,
          message: result.message,
          response: result.data?.response || JSON.stringify(result.data),
          rawData: result.rawData // 保存原始数据
        }
      }));
      
      // 保存到历史记录
      addApiTestRecord(`火山方舟API - ${prompt.slice(0, 20)}...`, {
        type: 'volcengine',
        prompt: prompt,
        success: result.success,
        message: result.message,
        response: result.data?.response
      });
    } catch (error) {
      console.error('调用测试服务失败:', error);
      setResults(prev => ({
        ...prev,
        volcengine: {
          success: false,
          message: `测试服务错误: ${error instanceof Error ? error.message : String(error)}`
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, volcengine: false }));
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">API测试工具</h1>
      
      <Tabs defaultValue="volcengine" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="volcengine">火山方舟API测试</TabsTrigger>
          <TabsTrigger value="unsplash">Unsplash API测试</TabsTrigger>
        </TabsList>
        
        {/* 火山方舟API测试面板 */}
        <TabsContent value="volcengine">
          <Card>
            <CardHeader>
              <CardTitle>火山方舟API测试</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">测试提示词</Label>
                <Textarea 
                  id="prompt" 
                  value={prompt} 
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="输入测试提示词..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Label>API配置信息</Label>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>API Key:</strong> {volcengineConfig.apiKey}</p>
                  <p><strong>模型:</strong> {volcengineConfig.model}</p>
                  <p><strong>端点:</strong> {apiEndpoints.volcengine}</p>
                  <p><strong>本地模拟模式:</strong> {devConfig.useLocalMockData ? '开启' : '关闭'}</p>
                </div>
              </div>
              
              {results.volcengine.message !== '未测试' && (
                <Alert variant={results.volcengine.success ? "default" : "destructive"}>
                  <div className="flex items-center gap-2">
                    {results.volcengine.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{results.volcengine.success ? '测试成功' : '测试失败'}</AlertTitle>
                  </div>
                  <AlertDescription className="mt-2">
                    {results.volcengine.message}
                  </AlertDescription>
                </Alert>
              )}
              
              {results.volcengine.response && (
                <div className="space-y-2">
                  <Label>API响应</Label>
                  <div className="bg-muted p-3 rounded-md overflow-auto max-h-[200px]">
                    <pre className="text-xs whitespace-pre-wrap">{results.volcengine.response}</pre>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={testVolcengineApi} 
                disabled={loading.volcengine}
                className="w-full"
              >
                {loading.volcengine ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    测试中...
                  </>
                ) : '测试火山方舟API'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Unsplash API测试面板 */}
        <TabsContent value="unsplash">
          <Card>
            <CardHeader>
              <CardTitle>Unsplash API测试</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageKeyword">图片关键词</Label>
                <Input 
                  id="imageKeyword" 
                  value={imageKeyword} 
                  onChange={(e) => setImageKeyword(e.target.value)}
                  placeholder="输入图片搜索关键词..."
                />
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Label>API配置信息</Label>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Access Key:</strong> {unsplashConfig.accessKey}</p>
                  <p><strong>端点:</strong> {apiEndpoints.unsplash}</p>
                  <p><strong>本地模拟模式:</strong> {devConfig.useLocalMockData ? '开启' : '关闭'}</p>
                </div>
              </div>
              
              {results.unsplash.message !== '未测试' && (
                <Alert variant={results.unsplash.success ? "default" : "destructive"}>
                  <div className="flex items-center gap-2">
                    {results.unsplash.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{results.unsplash.success ? '测试成功' : '测试失败'}</AlertTitle>
                  </div>
                  <AlertDescription className="mt-2">
                    {results.unsplash.message}
                  </AlertDescription>
                </Alert>
              )}
              
              {results.unsplash.imageUrl && (
                <div className="space-y-2">
                  <Label>获取的图片</Label>
                  <div className="rounded-md overflow-hidden border">
                    <img 
                      src={results.unsplash.imageUrl} 
                      alt="Unsplash测试图片" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={testUnsplashApi} 
                disabled={loading.unsplash}
                className="w-full"
              >
                {loading.unsplash ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    测试中...
                  </>
                ) : '测试Unsplash API'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-400">API测试说明</h3>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
          <li>此工具用于测试项目中使用的API是否正常工作</li>
          <li>火山方舟API: 测试AI文本生成功能</li>
          <li>Unsplash API: 测试图片搜索功能</li>
          <li>如果测试失败，请检查API密钥和网络连接</li>
          <li>如果使用了代理，请确保代理配置正确</li>
          <li>在vite.config.ts中配置正确的代理设置可以解决CORS问题</li>
        </ul>
      </div>
    </div>
  );
}

export default ApiTest;