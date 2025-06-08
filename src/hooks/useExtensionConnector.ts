
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { checkExtensionAvailability, initializeExtensionConnector } from '@/utils/extensionConnector';

export const useExtensionConnector = (onTranscription: (text: string, timestamp?: number) => void) => {
  const { toast } = useToast();
  const [extensionConnected, setExtensionConnected] = useState(false);
  const [extensionStatus, setExtensionStatus] = useState("Connecting...");
  const processingRef = useRef(false);

  const handleExtensionTranscriptionData = async (transcriptionText: string, timestamp?: number) => {
    console.log('🎯 [INTERVIEW] PROCESSING AUTO-TRANSCRIPTION FROM EXTENSION:', transcriptionText);
    
    if (processingRef.current) {
      console.log('⚠️ [INTERVIEW] Already processing, skipping...');
      return;
    }
    
    if (!transcriptionText || transcriptionText.trim().length < 3) {
      console.log('⚠️ [INTERVIEW] Transcription too short, skipping:', transcriptionText);
      return;
    }
    
    processingRef.current = true;
    setExtensionStatus("Processing question...");
    
    try {
      // No toast notifications for auto operation
      console.log(`🔇 Question detected automatically: "${transcriptionText.substring(0, 50)}..."`);
      
      onTranscription(transcriptionText, timestamp);
      setExtensionStatus("Auto-listening");
    } catch (error) {
      console.error('❌ [INTERVIEW] Error processing auto-transcription:', error);
      setExtensionStatus("Error - Please try again");
      
      toast({
        title: "Error processing question",
        description: "There was an error generating an answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      processingRef.current = false;
    }
  };

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initExtension = async () => {
      console.log('🚀 [INTERVIEW] Initializing auto-extension connector...');
      setExtensionStatus("Connecting...");
      
      cleanup = initializeExtensionConnector();
      
      const handleExtensionReady = (event: CustomEvent) => {
        console.log('✅ [INTERVIEW] Auto-extension ready event received:', event.detail);
        setExtensionConnected(true);
        setExtensionStatus("Auto-listening");
        (window as any).__extensionReady = true;
        
        // No connection toast for auto operation
        console.log('🔇 Chrome extension connected and operating automatically');
      };

      const handleExtensionTranscription = (event: CustomEvent) => {
        console.log('📥 [INTERVIEW] AUTO-TRANSCRIPTION RECEIVED FROM EXTENSION:', event.detail);
        
        if (event.detail?.text && event.detail.text.trim()) {
          console.log('🔄 [INTERVIEW] Processing auto-transcription:', event.detail.text);
          handleExtensionTranscriptionData(event.detail.text, event.detail.timestamp);
        } else {
          console.warn('⚠️ [INTERVIEW] Empty or invalid auto-transcription received');
        }
      };

      const handleWindowMessage = (event: MessageEvent) => {
        console.log('📨 [INTERVIEW] Window message received:', event.data);
        
        if (event.source !== window) {
          console.log('❌ [INTERVIEW] Message not from same window, ignoring');
          return;
        }
        
        // Handle both independent, silent, and auto extension sources
        if (event.data.action === 'extensionReady' && 
            (event.data.source === 'interviewace-extension-independent' || 
             event.data.source === 'interviewace-extension-silent' ||
             event.data.source === 'interviewace-extension-auto')) {
          console.log('✅ [INTERVIEW] Auto-extension ready via window message');
          setExtensionConnected(true);
          setExtensionStatus("Auto-listening");
          
          // No connection toast for auto operation
          console.log('🔇 Chrome extension connected and operating automatically');
        }
        
        if (event.data.action === 'processTranscription' && 
            (event.data.source === 'interviewace-extension-independent' || 
             event.data.source === 'interviewace-extension-silent' ||
             event.data.source === 'interviewace-extension-auto') && 
            event.data.text) {
          console.log('📝 [INTERVIEW] Processing auto-transcription via window message:', event.data.text);
          handleExtensionTranscriptionData(event.data.text, event.data.timestamp);
        }
      };

      window.addEventListener('extensionReady', handleExtensionReady as EventListener);
      window.addEventListener('extensionTranscription', handleExtensionTranscription as EventListener);
      window.addEventListener('message', handleWindowMessage);

      const isAvailable = checkExtensionAvailability();
      if (isAvailable) {
        setExtensionConnected(true);
        setExtensionStatus("Auto-listening");
      }

      console.log('📢 [INTERVIEW] Sending interviewAppReady message for auto-mode');
      window.postMessage({
        action: 'interviewAppReady',
        timestamp: Date.now()
      }, '*');

      return () => {
        window.removeEventListener('extensionReady', handleExtensionReady as EventListener);
        window.removeEventListener('extensionTranscription', handleExtensionTranscription as EventListener);
        window.removeEventListener('message', handleWindowMessage);
        if (cleanup) cleanup();
      };
    };

    const cleanupPromise = initExtension();
    
    return () => {
      cleanupPromise.then(cleanupFn => {
        if (cleanupFn) cleanupFn();
      });
    };
  }, [toast, onTranscription]);

  return {
    extensionConnected,
    extensionStatus,
    processingRef
  };
};
