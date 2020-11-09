interface RouteProps {
  id: string;
  path: '/' | '/asr/' | '/tts/';
  exact: boolean;
  component: JSX.Element;
  name: 'Dashboard' | 'ASR' | 'TTS';
}
