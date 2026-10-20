import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, SafeAreaView, StatusBar as RNStatusBar, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';

import { QUESTIONS } from './data/questions';
import SetupScreen from './src/SetupScreen';
import QuizScreen from './src/QuizScreen';
import ResultScreen from './src/ResultScreen';
import { colors } from './src/theme';
import { shuffle, speak, stopSpeech } from './src/utils';

const TOP_PAD = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;

export default function App() {
  const [screen, setScreen] = useState('setup');
  const [cfg, setCfg] = useState({
    count: 20,
    cats: 'all',
    mode: 'practice',
    shuffleOptions: true,
    autoSpeak: true,
  });
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    AsyncStorage.getItem('qcm-muted').then((v) => setMuted(v === '1'));
    return () => stopSpeech();
  }, []);

  useEffect(() => {
    if (screen !== 'quiz') return undefined;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [screen]);

  useEffect(() => {
    if (screen === 'quiz' && cfg.autoSpeak && !muted && quiz[current]) {
      speak(quiz[current].q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, current]);

  const handleSpeak = (text) => {
    if (!muted) speak(text);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    AsyncStorage.setItem('qcm-muted', next ? '1' : '0').catch(() => {});
    if (next) stopSpeech();
  };

  const startQuiz = () => {
    let pool = QUESTIONS.slice();
    if (cfg.cats !== 'all') pool = pool.filter((q) => q.cat === cfg.cats);
    pool = shuffle(pool);
    const n = cfg.count === 0 ? pool.length : Math.min(cfg.count, pool.length);
    pool = pool.slice(0, n);

    const qz = pool.map((q) => {
      let opts = q.options.map((text, i) => ({ text, correct: i === q.a }));
      if (cfg.shuffleOptions) opts = shuffle(opts);
      return {
        idx: QUESTIONS.indexOf(q),
        cat: q.cat,
        q: q.q,
        exp: q.exp,
        options: opts,
        correctIndex: opts.findIndex((o) => o.correct),
      };
    });

    setQuiz(qz);
    setAnswers(qz.map(() => ({ selected: null })));
    setCurrent(0);
    setElapsed(0);
    startRef.current = Date.now();
    setScreen('quiz');
  };

  const selectOption = (i) => {
    setAnswers((prev) => {
      const cur = prev[current];
      if (!cur) return prev;
      if (cfg.mode === 'practice' && cur.selected !== null) return prev;
      const next = prev.slice();
      next[current] = { selected: i };
      return next;
    });
  };

  const goNext = () => {
    if (current < quiz.length - 1) setCurrent(current + 1);
    else {
      stopSpeech();
      setScreen('result');
    }
  };

  const goPrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const quitQuiz = () => {
    Alert.alert('الخروج', 'هل تريد الخروج من الاستمارة الحالية؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'خروج',
        onPress: () => {
          stopSpeech();
          setScreen('setup');
        },
      },
    ]);
  };

  const retryQuiz = () => {
    setAnswers(quiz.map(() => ({ selected: null })));
    setCurrent(0);
    setElapsed(0);
    startRef.current = Date.now();
    setScreen('quiz');
  };

  const shareAsset = async (module, mimeType, title) => {
    try {
      const asset = Asset.fromModule(module);
      await asset.downloadAsync();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(asset.localUri, { mimeType, dialogTitle: title });
      } else {
        Alert.alert('غير متاح', 'المشاركة غير متاحة على هذا الجهاز.');
      }
    } catch (e) {
      Alert.alert('تعذر فتح الملف', String(e && e.message ? e.message : e));
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.root, { paddingTop: TOP_PAD }]}>
        <StatusBar style="dark" backgroundColor={colors.bg} />
        {screen === 'setup' && (
          <SetupScreen
            total={QUESTIONS.length}
            cfg={cfg}
            setCfg={setCfg}
            onStart={startQuiz}
            onOpenPdf={() => shareAsset(require('./assets/procedure.pdf'), 'application/pdf', 'procedure.pdf')}
            onOpenArticles={() => shareAsset(require('./assets/articles.html'), 'text/html', 'articles.html')}
          />
        )}
        {screen === 'quiz' && (
          <QuizScreen
            quiz={quiz}
            answers={answers}
            current={current}
            mode={cfg.mode}
            elapsed={elapsed}
            muted={muted}
            onSelect={selectOption}
            onPrev={goPrev}
            onNext={goNext}
            onQuit={quitQuiz}
            onToggleMute={toggleMute}
            onSpeak={handleSpeak}
          />
        )}
        {screen === 'result' && (
          <ResultScreen
            quiz={quiz}
            answers={answers}
            elapsed={elapsed}
            muted={muted}
            onSpeak={handleSpeak}
            onRetry={retryQuiz}
            onNewQuiz={() => {
              stopSpeech();
              setScreen('setup');
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  root: { flex: 1, backgroundColor: colors.bg },
});
