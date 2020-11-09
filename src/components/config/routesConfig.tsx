import { nanoid } from 'nanoid';
import React from 'react';
import AsrComponent from '../routes/asr/asrComponent';
import Dashboard from '../dashboard/dashboard';
import TtsComponent from '../routes/tts/ttsComponent';

export const routes: RouteProps[] = [
  { id: nanoid(), path: '/', exact: true, component: <Dashboard />, name: 'Dashboard' },
  { id: nanoid(), path: '/asr/', exact: true, component: <AsrComponent />, name: 'ASR' },
  { id: nanoid(), path: '/tts/', exact: true, component: <TtsComponent />, name: 'TTS' },
];
