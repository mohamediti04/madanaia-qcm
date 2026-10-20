import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from './theme';
import { formatTime } from './utils';

function Stat({ value, label, tone }) {
  const toneColor = tone === 'ok' ? colors.ok : tone === 'bad' ? colors.bad : colors.ink;
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: toneColor }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ResultScreen({ quiz, answers, elapsed, muted, onSpeak, onRetry, onNewQuiz }) {
  const total = quiz.length;
  let correct = 0;
  let wrong = 0;
  let blank = 0;
  quiz.forEach((q, i) => {
    const sel = answers[i] ? answers[i].selected : null;
    if (sel === null) blank++;
    else if (sel === q.correctIndex) correct++;
    else wrong++;
  });
  const pct = total ? Math.round((correct / total) * 100) : 0;

  let msg;
  if (pct === 100) msg = 'Ù…Ù…ØªØ§Ø²! Ø¹Ù„Ø§Ù…Ø© ÙƒØ§Ù…Ù„Ø© ðŸŽ‰';
  else if (pct >= 80) msg = 'Ù†ØªÙŠØ¬Ø© Ù…Ù…ØªØ§Ø²Ø©ØŒ ÙˆØ§ØµÙ„!';
  else if (pct >= 60) msg = 'Ù†ØªÙŠØ¬Ø© Ø¬ÙŠØ¯Ø©ØŒ ÙŠÙ…ÙƒÙ† Ø§Ù„ØªØ­Ø³ÙŠÙ†.';
  else if (pct >= 40) msg = 'Ù†ØªÙŠØ¬Ø© Ù…ØªÙˆØ³Ø·Ø©ØŒ Ø±Ø§Ø¬Ø¹ Ø§Ù„Ù…Ø§Ø¯Ø©.';
  else msg = 'ÙŠÙÙ†ØµØ­ Ø¨Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ù‚Ø§Ù†ÙˆÙ† ÙˆØ¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©.';

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <View style={styles.hero}>
          <View style={styles.ring}>
            <Text style={styles.ringPct}>{pct}%</Text>
            <Text style={styles.ringSub}>
              {correct} / {total}
            </Text>
          </View>
          <Text style={styles.msg}>{msg}</Text>
          <Text style={styles.heroSub}>Ù…Ù„Ø®Øµ Ø§Ù„Ù†ØªØ§Ø¦Ø¬</Text>
          <View style={styles.stats}>
            <Stat value={correct} label="Ø¥Ø¬Ø§Ø¨Ø§Øª ØµØ­ÙŠØ­Ø©" tone="ok" />
            <Stat value={wrong} label="Ø¥Ø¬Ø§Ø¨Ø§Øª Ø®Ø§Ø·Ø¦Ø©" tone="bad" />
            <Stat value={blank} label="Ø¨Ø¯ÙˆÙ† Ø¥Ø¬Ø§Ø¨Ø©" />
            <Stat value={formatTime(elapsed)} label="Ø§Ù„Ù…Ø¯Ø©" />
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.btnOk]} onPress={onRetry}>
            <Text style={styles.btnOkText}>â†» Ø¥Ø¹Ø§Ø¯Ø© Ù†ÙØ³ Ø§Ù„Ø£Ø³Ø¦Ù„Ø©</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onNewQuiz}>
            <Text style={styles.btnPrimaryText}>ðŸŽ² QCM Ø¬Ø¯ÙŠØ¯ Ø¹Ø´ÙˆØ§Ø¦ÙŠ</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.reviewTitle}>Ø§Ù„ØªØµØ­ÙŠØ­ ÙˆØ§Ù„Ø£Ø¬ÙˆØ¨Ø©</Text>
        {quiz.map((q, i) => {
          const sel = answers[i] ? answers[i].selected : null;
          const good = sel === q.correctIndex;
          const userAns = sel === null ? 'Ù„Ù… ØªÙØ¬Ø¨' : q.options[sel].text;
          const correctAns = q.options[q.correctIndex].text;
          return (
            <View key={i} style={[styles.reviewItem, good ? styles.reviewGood : styles.reviewBad]}>
              <View style={styles.reviewHead}>
                <View style={[styles.tag, good ? styles.tagGood : styles.tagBad]}>
                  <Text style={styles.tagText}>{good ? 'ØµØ­ÙŠØ­' : 'Ø®Ø·Ø£'}</Text>
                </View>
                <Text style={styles.reviewCat}>â€” {q.cat}</Text>
              </View>
              <View style={styles.reviewQRow}>
                <TouchableOpacity onPress={() => onSpeak(q.q)} style={styles.speakMini}>
                  <Text style={{ fontSize: 16 }}>ðŸ”Š</Text>
                </TouchableOpacity>
                <Text style={styles.reviewQ}>
                  {i + 1}. {q.q}
                </Text>
              </View>
              <Text style={styles.reviewLine}>
                Ø¥Ø¬Ø§Ø¨ØªÙƒ:{' '}
                <Text style={good ? styles.ansOk : styles.ansBad}>{userAns}</Text>
              </Text>
              <Text style={styles.reviewLine}>
                Ø§Ù„Ø¥Ø¬Ø§Ø¨Ø© Ø§Ù„ØµØ­ÙŠØ­Ø©: <Text style={styles.ansOk}>{correctAns}</Text>
              </Text>
              <Text style={styles.reviewExp}>
                <Text style={{ fontWeight: '800' }}>Ø§Ù„ØªÙˆØ¶ÙŠØ­:</Text> {q.exp}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: colors.bg, gap: 14 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  hero: { alignItems: 'center' },
  ring: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 10,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  ringPct: { fontSize: 30, fontWeight: '800', color: colors.primary },
  ringSub: { fontSize: 13, fontWeight: '700', color: colors.muted, marginTop: 2 },
  msg: { fontSize: 17, fontWeight: '800', color: colors.ink, marginTop: 12, textAlign: 'center' },
  heroSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  stats: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, marginTop: 14, width: '100%' },
  stat: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, color: colors.muted, marginTop: 2 },
  actions: { flexDirection: 'row-reverse', gap: 8, marginTop: 16 },
  btn: { flex: 1, borderRadius: radius.md, paddingVertical: 13, alignItems: 'center' },
  btnOk: { backgroundColor: colors.ok },
  btnOkText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  btnPrimary: { backgroundColor: colors.primary },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  reviewTitle: { fontSize: 15, fontWeight: '800', color: colors.ink, textAlign: 'right', marginBottom: 10 },
  reviewItem: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  reviewGood: { borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' },
  reviewBad: { borderColor: '#fecaca', backgroundColor: '#fff5f5' },
  reviewHead: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  tag: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  tagGood: { backgroundColor: colors.ok },
  tagBad: { backgroundColor: colors.bad },
  tagText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  reviewCat: { fontSize: 11, color: colors.muted, flex: 1, textAlign: 'right' },
  reviewQRow: { flexDirection: 'row-reverse', gap: 8, marginTop: 8, alignItems: 'flex-start' },
  speakMini: { padding: 2 },
  reviewQ: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 24,
  },
  reviewLine: { fontSize: 13, color: colors.ink, textAlign: 'right', marginTop: 6, writingDirection: 'rtl', lineHeight: 22 },
  ansOk: { color: colors.ok, fontWeight: '700' },
  ansBad: { color: colors.bad, fontWeight: '700' },
  reviewExp: { fontSize: 12, color: colors.muted, textAlign: 'right', marginTop: 6, lineHeight: 20, writingDirection: 'rtl' },
});

